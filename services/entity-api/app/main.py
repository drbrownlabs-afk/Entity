"""ENTITY OS minimal persistent API — initial development slice.

SQLite is used only to make the first vertical slice runnable locally.
PostgreSQL/PostGIS and Scorpio adapters are separate planned integrations.
"""
from __future__ import annotations

import json
import os
import sqlite3
from contextlib import asynccontextmanager, contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

DB_PATH = Path(os.getenv("ENTITY_SQLITE_PATH", "entity-dev.sqlite3"))
@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize()
    yield


app = FastAPI(title="ENTITY OS", version="0.1.0", lifespan=lifespan)


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


@contextmanager
def database():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def initialize():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with database() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS entities (
            id TEXT PRIMARY KEY, type TEXT NOT NULL,
            attributes TEXT NOT NULL, created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS entity_state (
            entity_id TEXT NOT NULL, key TEXT NOT NULL,
            value TEXT NOT NULL, updated_at TEXT NOT NULL,
            PRIMARY KEY(entity_id, key),
            FOREIGN KEY(entity_id) REFERENCES entities(id)
        );
        CREATE TABLE IF NOT EXISTS relations (
            id TEXT PRIMARY KEY, source_id TEXT NOT NULL,
            target_id TEXT NOT NULL, type TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(source_id) REFERENCES entities(id),
            FOREIGN KEY(target_id) REFERENCES entities(id)
        );
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY, entity_id TEXT NOT NULL,
            type TEXT NOT NULL, payload TEXT NOT NULL,
            occurred_at TEXT NOT NULL,
            FOREIGN KEY(entity_id) REFERENCES entities(id)
        );
        """)


class EntityCreate(BaseModel):
    id: str = Field(min_length=1)
    type: str = Field(min_length=1)
    attributes: dict[str, Any] = Field(default_factory=dict)


class StateUpdate(BaseModel):
    key: str = Field(min_length=1)
    value: Any


class RelationCreate(BaseModel):
    source_id: str
    target_id: str
    type: str = Field(min_length=1)


def require_entity(db: sqlite3.Connection, entity_id: str):
    if not db.execute("SELECT 1 FROM entities WHERE id=?", (entity_id,)).fetchone():
        raise HTTPException(404, f"Entity not found: {entity_id}")


@app.get("/health")
def health():
    return {"status": "ok", "service": "entity-api"}


@app.post("/v1/entities", status_code=201)
def create_entity(entity: EntityCreate):
    with database() as db:
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
    timestamp = now()
    with database() as db:
        require_entity(db, entity_id)
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
            "INSERT INTO events VALUES(?,?,?,?,?)",
            (event_id, entity_id, "state.changed", json.dumps(payload), timestamp),
        )
    return {"entity_id": entity_id, "event_id": event_id, "state": {change.key: change.value}}


@app.post("/v1/relations", status_code=201)
def create_relation(relation: RelationCreate):
    with database() as db:
        require_entity(db, relation.source_id)
        require_entity(db, relation.target_id)
        relation_id = str(uuid4())
        db.execute(
            "INSERT INTO relations VALUES(?,?,?,?,?)",
            (relation_id, relation.source_id, relation.target_id, relation.type, now()),
        )
    return {"id": relation_id, **relation.model_dump()}


@app.get("/v1/entities/{entity_id}/events")
def get_events(entity_id: str):
    with database() as db:
        require_entity(db, entity_id)
        rows = db.execute(
            "SELECT * FROM events WHERE entity_id=? ORDER BY occurred_at,id",
            (entity_id,),
        ).fetchall()
        return [{**dict(r), "payload": json.loads(r["payload"])} for r in rows]
