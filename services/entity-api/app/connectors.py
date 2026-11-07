"""Provider-neutral REST ingress and deterministic simulation; no outbound device I/O."""
import hmac
import json
import os
from datetime import datetime
from typing import Literal
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.routing import APIRoute
from pydantic import AwareDatetime, Field
from app.schemas import CoreRecord, NonBlank

class AuditedRoute(APIRoute):
    def get_route_handler(self):
        handler = super().get_route_handler()
        async def wrapped(request):
            try:
                return await handler(request)
            except HTTPException as exc:
                audit('request', self.path, str(exc.status_code))
                raise
        return wrapped


router = APIRouter(route_class=AuditedRoute, prefix='/v1/integrations', tags=['integrations'])


class Manifest(CoreRecord):
    connector_id: NonBlank
    version: NonBlank
    protocols: list[Literal['rest', 'simulation']] = Field(min_length=1)
    discovery_mode: Literal['manual'] = 'manual'
    config_schema: dict = Field(default_factory=dict)
    credential_refs: list[str] = Field(default_factory=list)
    input_event_types: list[NonBlank] = Field(min_length=1)
    capability_schemas: list[str] = Field(default_factory=list)
    health_check: Literal['registry'] = 'registry'
    enabled: bool = True


class Provenance(CoreRecord):
    connector_id: NonBlank
    model_version: NonBlank
    simulated: bool


class Observation(CoreRecord):
    observation_id: UUID
    site_id: NonBlank
    source_id: NonBlank
    observed_at: AwareDatetime
    type: NonBlank
    payload: dict
    provenance: Provenance
    confidence: float | None = Field(default=None, ge=0, le=1)
    zone_id: NonBlank | None = None


class Capability(CoreRecord):
    capability_id: UUID
    target_entity_id: NonBlank
    connector_id: NonBlank
    operation: Literal['simulation.set_state']
    input_schema: Literal['state-key-value-v1'] = 'state-key-value-v1'
    required_permission: Literal['simulate:write'] = 'simulate:write'
    timeout: Literal[5] = 5
    verification_method: Literal['sqlite-readback'] = 'sqlite-readback'
    idempotency_policy: Literal['request-id'] = 'request-id'


class Invocation(CoreRecord):
    request_id: UUID
    capability: Capability
    key: NonBlank
    value: bool | str | int | float | None


def audit(actor, operation, outcome, db=None):
    from app.main import database, now
    values = (str(uuid4()), actor, operation, outcome, now())
    if db is not None:
        db.execute('INSERT INTO connector_audit VALUES(?,?,?,?,?)', values)
    else:
        with database(write=True) as connection:
            connection.execute('INSERT INTO connector_audit VALUES(?,?,?,?,?)', values)


def authorize(permission):
    def check(authorization: str | None = Header(default=None)):
        # Credentials and grants are server-owned; never trust actor/permissions in a request body.
        try:
            entries = json.loads(os.getenv('ENTITY_CONNECTOR_TOKENS', '[]'))
            if not isinstance(entries, list) or any(not isinstance(e, dict) or not isinstance(e.get('token'), str) or not e['token'].isascii() or not isinstance(e.get('actor'), str) or not isinstance(e.get('permissions'), list) for e in entries):
                raise ValueError('Invalid authentication configuration')
        except ValueError:
            raise HTTPException(503, 'Integration authentication unavailable')
        token = authorization[7:] if authorization and authorization.startswith('Bearer ') else ''
        for entry in entries:
            if token and token.isascii() and hmac.compare_digest(token, entry['token']):
                if permission in entry['permissions']:
                    return entry['actor']
                audit(entry['actor'], permission, 'denied')
                raise HTTPException(403, 'Permission denied')
        audit('anonymous', permission, 'unauthenticated')
        raise HTTPException(401, 'Bearer credential required')
    return check


def connector(db, connector_id):
    row = db.execute('SELECT manifest FROM connectors WHERE id=?', (connector_id,)).fetchone()
    if not row:
        raise HTTPException(404, 'Connector not registered')
    manifest = json.loads(row[0])
    if not manifest['enabled']:
        raise HTTPException(503, 'Connector disabled')
    return manifest


@router.put('/connectors/{connector_id}')
def register(connector_id: str, manifest: Manifest, actor=Depends(authorize('registry:write'))):
    from app.main import database
    if connector_id != manifest.connector_id:
        raise HTTPException(422, 'Connector ID mismatch')
    with database(write=True) as db:
        db.execute('INSERT INTO connectors VALUES(?,?) ON CONFLICT(id) DO UPDATE SET manifest=excluded.manifest',
                   (connector_id, manifest.model_dump_json()))
        audit(actor, 'register', 'recorded', db)
    return manifest


@router.get('/connectors/{connector_id}/health')
def health(connector_id: str, actor=Depends(authorize('observe:write'))):
    from app.main import database
    with database() as db:
        connector(db, connector_id)
    return {'status': 'ready', 'scope': 'registry-only'}


@router.post('/observations')
def ingest(observation: Observation, actor=Depends(authorize('observe:write'))):
    from app.main import database, now, require_entity, append_event
    body = observation.model_dump_json()
    with database(write=True) as db:
        manifest = connector(db, observation.provenance.connector_id)
        if observation.type not in manifest['input_event_types']:
            raise HTTPException(422, 'Observation type not supported by connector')
        protocol = 'simulation' if observation.provenance.simulated else 'rest'
        if protocol not in manifest['protocols']:
            raise HTTPException(422, 'Provenance does not match registered protocol')
        require_entity(db, observation.source_id)
        previous = db.execute('SELECT body,received_at FROM observations WHERE id=?', (str(observation.observation_id),)).fetchone()
        if previous:
            if previous[0] != body:
                raise HTTPException(409, 'Observation ID reused with different content')
            return {'duplicate': True, 'received_at': previous[1]}
        received = now()
        db.execute('INSERT INTO observations VALUES(?,?,?)', (str(observation.observation_id), body, received))
        append_event(db, observation.source_id, 'observation.received',
                     {**json.loads(body), 'received_at': received}, observation.provenance.connector_id)
        if observation.type == 'edge.presence':
            from app.edge_projection import project
            projected = project(db, observation)
            if projected:
                from app.output import evaluate
                evaluate(db, observation)
        audit(actor, 'observation', 'recorded', db)
    return {'duplicate': False, 'received_at': received}


@router.post('/invocations')
def invoke(invocation: Invocation, actor=Depends(authorize('simulate:write'))):
    from app.main import database, now, require_entity, append_event
    body = invocation.model_dump_json()
    cap = invocation.capability
    with database(write=True) as db:
        manifest = connector(db, cap.connector_id)
        if 'simulation' not in manifest['protocols'] or cap.operation not in manifest['capability_schemas']:
            raise HTTPException(422, 'Connector cannot execute this simulated capability')
        require_entity(db, cap.target_entity_id)
        previous = db.execute('SELECT actor,body,result FROM invocations WHERE id=?', (str(invocation.request_id),)).fetchone()
        if previous:
            if previous[0] != actor or previous[1] != body:
                raise HTTPException(409, 'Request ID conflict')
            return json.loads(previous[2])
        old = db.execute('SELECT value FROM entity_state WHERE entity_id=? AND key=?', (cap.target_entity_id, invocation.key)).fetchone()
        db.execute('INSERT INTO entity_state VALUES(?,?,?,?) ON CONFLICT(entity_id,key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
                   (cap.target_entity_id, invocation.key, json.dumps(invocation.value), now()))
        actual = json.loads(db.execute('SELECT value FROM entity_state WHERE entity_id=? AND key=?', (cap.target_entity_id, invocation.key)).fetchone()[0])
        if actual != invocation.value:
            raise HTTPException(500, 'Simulation verification failed')
        event = append_event(db, cap.target_entity_id, 'state.changed', {'key': invocation.key, 'previous': json.loads(old[0]) if old else None, 'value': actual}, cap.connector_id)
        result = {'request_id': str(invocation.request_id), 'actor': actor, 'status': 'verified', 'simulated': True, 'event_id': event['id']}
        db.execute('INSERT INTO invocations VALUES(?,?,?,?)', (str(invocation.request_id), actor, body, json.dumps(result)))
        audit(actor, 'invocation', 'verified-simulation', db)
    return result


@router.get('/audit')
def read_audit(actor=Depends(authorize('audit:read'))):
    from app.main import database
    with database() as db:
        return [dict(row) for row in db.execute('SELECT * FROM connector_audit ORDER BY created_at,id')]
