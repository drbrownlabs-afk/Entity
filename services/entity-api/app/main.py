"""ENTITY OS minimal persistent API — initial development slice.

SQLite is used only to make the first vertical slice runnable locally.
PostgreSQL/PostGIS and Scorpio adapters are separate planned integrations.
"""
from __future__ import annotations

import asyncio
import json
import os
import sqlite3
from contextlib import asynccontextmanager, contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.responses import JSONResponse
from pydantic import Field

from app.migrate import migrate
from app.schemas import (
    CapabilityCreate, EventCreate, MemoryCreate, CoreRecord, NonBlank,
    EventRecord, MemoryRecord, MemoryCreated, CapabilityRecord, CapabilityCreated,
)

DB_PATH = Path(os.getenv("ENTITY_SQLITE_PATH", "entity-dev.sqlite3"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize()
    from app.office.playback import recover,worker
    recover();stop=asyncio.Event();task=asyncio.create_task(worker(stop))
    try:yield
    finally:
        stop.set();await task


app = FastAPI(title="ENTITY OS", version="0.2.0", lifespan=lifespan)
@app.exception_handler(RequestValidationError)
async def validation_error(request, exc):
    if any(error["type"] == "finite_json" for error in exc.errors()):
        # The invalid NaN input itself cannot be serialized in a standards-compliant error.
        return JSONResponse(status_code=422, content={"detail": [
            {key: error[key] for key in ("type", "loc", "msg")} for error in exc.errors()]})
    return await request_validation_exception_handler(request, exc)


# Optional explicit browser origins; no wildcard, cookies or renderer dependency.
allowed_origins = [value.strip() for value in os.getenv("ENTITY_ALLOWED_ORIGINS", "").split(",") if value.strip()]
if allowed_origins:
    app.add_middleware(CORSMiddleware, allow_origins=allowed_origins, allow_credentials=False,
                       allow_methods=["GET", "POST", "PUT"], allow_headers=["Authorization", "Content-Type"])


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


@contextmanager
def database(*, write=False):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        if write:
            conn.execute("BEGIN IMMEDIATE")
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def initialize():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with database() as db:
        migrate(db)
        from app.office.storage import initialize as initialize_office
        initialize_office(db)


class EntityCreate(CoreRecord):
    id: NonBlank
    type: NonBlank
    attributes: dict[str, Any] = Field(default_factory=dict)


class StateUpdate(CoreRecord):
    key: NonBlank
    value: Any


class RelationCreate(CoreRecord):
    source_id: NonBlank
    target_id: NonBlank
    type: NonBlank


def require_entity(db: sqlite3.Connection, entity_id: str):
    if not db.execute("SELECT 1 FROM entities WHERE id=?", (entity_id,)).fetchone():
        raise HTTPException(404, f"Entity not found: {entity_id}")


@app.get("/health")
def health():
    return {"status": "ok", "service": "entity-api"}


@app.post("/v1/entities", status_code=201)
def create_entity(entity: EntityCreate):
    with database(write=True) as db:
        try:
            db.execute(
                "INSERT INTO entities VALUES (?,?,?,?)",
                (entity.id, entity.type, json.dumps(entity.attributes), now()),
            )
        except sqlite3.IntegrityError:
            raise HTTPException(409, "Entity ID already exists")
    return entity.model_dump()


@app.get("/v1/entities")
def list_entities():
    with database() as db:
        rows = db.execute("SELECT * FROM entities ORDER BY id").fetchall()
        return [
            {"id": r["id"], "type": r["type"], "attributes": json.loads(r["attributes"])}
            for r in rows
        ]


@app.get("/v1/entities/{entity_id}")
def get_entity(entity_id: str):
    with database() as db:
        row = db.execute("SELECT * FROM entities WHERE id=?", (entity_id,)).fetchone()
        if row is None:
            raise HTTPException(404, "Entity not found")
        states = db.execute("SELECT key,value FROM entity_state WHERE entity_id=?", (entity_id,)).fetchall()
        relations = db.execute(
            "SELECT * FROM relations WHERE source_id=? OR target_id=? ORDER BY created_at",
            (entity_id, entity_id),
        ).fetchall()
        return {
            "id": row["id"], "type": row["type"],
            "attributes": json.loads(row["attributes"]),
            "state": {r["key"]: json.loads(r["value"]) for r in states},
            "relations": [dict(r) for r in relations],
        }


@app.put("/v1/entities/{entity_id}/state")
def update_state(entity_id: str, change: StateUpdate):
    with database(write=True) as db:
        require_entity(db, entity_id)
        timestamp = now()
        old = db.execute(
            "SELECT value FROM entity_state WHERE entity_id=? AND key=?",
            (entity_id, change.key),
        ).fetchone()
        previous = json.loads(old["value"]) if old else None
        db.execute(
            """INSERT INTO entity_state(entity_id,key,value,updated_at) VALUES(?,?,?,?)
               ON CONFLICT(entity_id,key) DO UPDATE SET
               value=excluded.value,updated_at=excluded.updated_at""",
            (entity_id, change.key, json.dumps(change.value), timestamp),
        )
        event_id = str(uuid4())
        payload = {"key": change.key, "previous": previous, "value": change.value}
        db.execute(
            "INSERT INTO events(id,entity_id,type,payload,occurred_at) VALUES(?,?,?,?,?)",
            (event_id, entity_id, "state.changed", json.dumps(payload), timestamp),
        )
    return {"entity_id": entity_id, "event_id": event_id, "state": {change.key: change.value}}


@app.post("/v1/relations", status_code=201)
def create_relation(relation: RelationCreate):
    with database(write=True) as db:
        require_entity(db, relation.source_id)
        require_entity(db, relation.target_id)
        relation_id = str(uuid4())
        db.execute(
            "INSERT INTO relations VALUES(?,?,?,?,?)",
            (relation_id, relation.source_id, relation.target_id, relation.type, now()),
        )
    return {"id": relation_id, **relation.model_dump()}


@app.get("/v1/entities/{entity_id}/events", response_model=list[EventRecord])
def get_events(entity_id: str):
    with database() as db:
        require_entity(db, entity_id)
        rows = db.execute(
            "SELECT * FROM events WHERE entity_id=? ORDER BY occurred_at,id",
            (entity_id,),
        ).fetchall()
        return [{**dict(r), "payload": json.loads(r["payload"])} for r in rows]


@app.get("/ready")
def ready():
    try:
        with database() as db:
            version = db.execute("PRAGMA user_version").fetchone()[0]
            db.execute("SELECT id FROM capabilities LIMIT 1")
            db.execute("SELECT id FROM memories LIMIT 1")
            if version != 5:
                raise sqlite3.DatabaseError("Unexpected schema version")
    except sqlite3.Error:
        raise HTTPException(503, "Database is not ready")
    return {"status": "ready", "database_schema_version": version, "api_version": "v1"}


def append_event(db, entity_id, event_type, payload, source="entity-api"):
    event = {"id": str(uuid4()), "entity_id": entity_id, "type": event_type,
             "payload": payload, "occurred_at": now(), "source": source,
             "schema_version": "1.0"}
    db.execute("INSERT INTO events(id,entity_id,type,payload,occurred_at,source,schema_version) "
               "VALUES(?,?,?,?,?,?,?)", (event["id"], entity_id, event_type,
               json.dumps(payload), event["occurred_at"], source, "1.0"))
    return event


@app.post("/v1/entities/{entity_id}/events", status_code=201, response_model=EventRecord)
def record_event(entity_id: str, event: EventCreate):
    with database(write=True) as db:
        require_entity(db, entity_id)
        return append_event(db, entity_id, event.type, event.payload, event.source)


@app.post("/v1/entities/{entity_id}/memories", status_code=201, response_model=MemoryCreated)
def record_memory(entity_id: str, memory: MemoryCreate):
    with database(write=True) as db:
        require_entity(db, entity_id)
        record = {"id": str(uuid4()), "entity_id": entity_id,
                  **memory.model_dump(), "created_at": now()}
        db.execute("INSERT INTO memories VALUES(?,?,?,?,?,?)", (
            record["id"], entity_id, memory.content, memory.source, record["created_at"], memory.schema_version))
        event = append_event(db, entity_id, "memory.recorded", {"memory_id": record["id"]}, memory.source)
        return {**record, "event_id": event["id"]}


@app.get("/v1/entities/{entity_id}/memories", response_model=list[MemoryRecord])
def list_memories(entity_id: str):
    with database() as db:
        require_entity(db, entity_id)
        return [dict(row) for row in db.execute(
            "SELECT * FROM memories WHERE entity_id=? ORDER BY created_at,id", (entity_id,))]


@app.post("/v1/entities/{entity_id}/capabilities", status_code=201, response_model=CapabilityCreated)
def declare_capability(entity_id: str, capability: CapabilityCreate):
    with database(write=True) as db:
        require_entity(db, entity_id)
        record = {"id": str(uuid4()), "entity_id": entity_id,
                  **capability.model_dump(), "created_at": now()}
        try:
            db.execute("INSERT INTO capabilities VALUES(?,?,?,?,?,?,?,?)", (
                record["id"], entity_id, capability.operation, capability.description,
                json.dumps(capability.parameters), capability.required_permission,
                capability.schema_version, record["created_at"]))
        except sqlite3.IntegrityError:
            raise HTTPException(409, "Capability operation already declared for entity")
        event = append_event(db, entity_id, "capability.declared", {"capability_id": record["id"]})
        return {**record, "event_id": event["id"]}


@app.get("/v1/entities/{entity_id}/capabilities", response_model=list[CapabilityRecord])
def list_capabilities(entity_id: str):
    with database() as db:
        require_entity(db, entity_id)
        return [{**dict(row), "parameters": json.loads(row["parameters"])}
                for row in db.execute("SELECT * FROM capabilities WHERE entity_id=? ORDER BY operation", (entity_id,))]


from app.connectors import router as integration_router
app.include_router(integration_router)

from app.output import router as output_router
app.include_router(output_router)

from app.agent import router as agent_router
app.include_router(agent_router)



from app.office.personal_app import router as personal_app_router
app.include_router(personal_app_router)

from app.office.api import router as office_router
app.include_router(office_router)

@app.middleware("http")
async def office_legacy_boundary(request, call_next):
    # Once a coworking site exists, legacy generic routes are administrative only.
    path=request.url.path
    legacy=path.startswith(("/v1/entities", "/v1/relations", "/v1/integrations", "/v1/output", "/v1/agent"))
    if legacy and request.method!="OPTIONS":
        try:
            with database() as db:
                active=db.execute("SELECT EXISTS(SELECT 1 FROM office_sites)").fetchone()[0]
            if active or os.getenv("ENTITY_REQUIRE_AUTH")=="1":
                from app.office.auth import authenticate
                actor=authenticate(request.headers.get("Authorization"))
                return JSONResponse(status_code=403,content={"detail":"Use site-scoped coworking APIs; legacy routes cannot mutate or expose office state"})
        except HTTPException as error:return JSONResponse(status_code=error.status_code,content={"detail":error.detail})
        except sqlite3.Error:return JSONResponse(status_code=503,content={"detail":"Database not ready"})
    response=await call_next(request)
    if path.startswith(("/v1/office/","/v1/sites")):
        response.headers["Cache-Control"]="private, no-store"
    return response

from app.office.agent import router as office_agent_router
app.include_router(office_agent_router)
