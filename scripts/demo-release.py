"""Phase 08 integrated demonstration using existing contracts, Outbox and real HTTP Core.

Only this script's processes and newly created synthetic databases are touched.
No hardware, public backend, external model or production database is used.
"""
import json
import os
from pathlib import Path
import secrets
import socket
import sqlite3
import statistics
import subprocess
import sys
import tempfile
import time
from uuid import uuid4

import httpx
from entity_edge.pipeline import Outbox

ROOT = Path(__file__).resolve().parents[1]
WORK = Path(tempfile.mkdtemp(prefix='run-', dir=ROOT / '.runtime' / 'release-demo'))
REPORT = {'schema_version': '1.0', 'mode': 'synthetic-fixture-real-http',
          'provider': 'controlled-fixture', 'hardware_tested': False, 'checks': {}, 'status': 'running'}
process = None
box = None
log = (WORK / 'core.log').open('w')
token, reader = secrets.token_urlsafe(32), secrets.token_urlsafe(32)
with socket.socket() as sock:
    sock.bind(('127.0.0.1', 0))
    port = sock.getsockname()[1]
base = f'http://127.0.0.1:{port}'
env = dict(os.environ, ENTITY_SQLITE_PATH=str(WORK / 'core.sqlite3'),
           ENTITY_AGENT_PROVIDER='controlled', ENTITY_ALLOWED_ORIGINS='',
           ENTITY_CONNECTOR_TOKENS=json.dumps([
               {'token': token, 'actor': 'release-demo', 'permissions': [
                   'registry:write', 'observe:write', 'agent:read', 'output:write', 'audit:read']},
               {'token': reader, 'actor': 'release-observer', 'permissions': ['agent:read']}]))


def check(name, condition):
    if not condition:
        raise AssertionError(name)
    REPORT['checks'][name] = 'passed'
    print('OK · ' + name, flush=True)


def start(database):
    global process
    child_env = dict(env, ENTITY_SQLITE_PATH=str(database))
    started = time.monotonic()
    process = subprocess.Popen([str(ROOT / '.venv/bin/python'), '-m', 'uvicorn',
                                'app.main:app', '--host', '127.0.0.1', '--port', str(port)],
                               cwd=ROOT / 'services/entity-api', env=child_env, stdout=log, stderr=log)
    while time.monotonic() - started < 20:
        try:
            response = httpx.get(base + '/ready', timeout=.5, trust_env=False)
            if response.status_code == 200:
                REPORT.setdefault('startup_seconds', []).append(round(time.monotonic() - started, 3))
                return
        except httpx.TransportError:
            pass
        if process.poll() is not None:
            break
        time.sleep(.1)
    raise RuntimeError('Core did not become ready; inspect this run core.log')


def stop():
    global process
    if process and process.poll() is None:
        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
    process = None


try:
    # Export from the actual viewer state adapter; never invent another simulator.
    program = """import {Experience} from './apps/web/src/world.js';
const world=new Experience();let messages=[];
for(let n=0;n<20;n++){world.setTick(n);messages.push(world.observation());}
console.log(JSON.stringify(messages));"""
    messages = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', program],
                                                 cwd=ROOT, text=True))
    # Wall-clock timestamp order is explicit for replay and backpressure tests.
    from datetime import datetime, timedelta, timezone
    beginning = datetime.now(timezone.utc)
    for index, message in enumerate(messages):
        message['observed_at'] = (beginning + timedelta(seconds=index * .1)).isoformat()
    start(WORK / 'core.sqlite3')
    with httpx.Client(base_url=base, headers={'Authorization': 'Bearer ' + token},
                      trust_env=False, timeout=5) as client:
        def send(method, path, body=None):
            result = client.request(method, path, json=body)
            result.raise_for_status()
            return result.json()

        check('fresh_schema_5', send('GET', '/ready')['database_schema_version'] == 5)
        check('health', send('GET', '/health')['status'] == 'ok')
        for identity, kind in [('experience-camera', 'Camera'), ('release-display', 'Display'), ('mall-demo', 'Site')]:
            send('POST', '/v1/entities', {'id': identity, 'type': kind})
        send('POST', '/v1/relations', {'source_id': 'experience-camera', 'target_id': 'mall-demo', 'type': 'locatedIn'})
        send('POST', '/v1/entities/experience-camera/memories', {
            'content': 'Demostración Fase 08: visitantes sintéticos, sin cámara física.', 'source': 'release-demo'})
        send('PUT', '/v1/integrations/connectors/experience', {'connector_id': 'experience', 'version': '1',
             'protocols': ['simulation'], 'input_event_types': ['edge.presence']})
        cap = send('POST', '/v1/entities/release-display/capabilities', {
            'operation': 'display.set_scene', 'description': 'Salida virtual de entrega',
            'required_permission': 'output:write'})['id']
        send('PUT', '/v1/output/displays/release-display', {})
        send('PUT', '/v1/output/rules/release', {'camera_id': 'experience-camera', 'capability_id': cap})
        latencies = []
        for message in messages:
            before = time.perf_counter()
            send('POST', '/v1/integrations/observations', message)
            latencies.append((time.perf_counter() - before) * 1000)
        check('viewer_to_observation_to_state', send('GET', '/v1/entities/experience-camera')['state']['edge.presence']['tracks'] == messages[-1]['payload']['tracks'])
        check('presence_to_verified_output', send('GET', '/v1/entities/release-display')['state']['display.scene'] == 'welcome')
        entities = send('GET', '/v1/entities')
        track = next(item for item in entities if item['type'] == 'PersonTrack')
        check('tracks_and_zones_entityized', any(item['type'] == 'Zone' for item in entities))
        active = [send('GET', '/v1/entities/' + e['id']) for e in entities if e['type'] == 'PersonTrack']
        check('typed_zone_relationship', any(any(r['type'] == 'observedIn' for r in e['relations']) for e in active))
        query = {'request_id': str(uuid4()), 'entity_id': 'experience-camera', 'question': '¿Qué ocurre en recepción?'}
        answer = send('POST', '/v1/agent/requests', query)
        check('query_with_state_memory_and_context', answer['status'] == 'ok' and answer['evidence']['memories']
              and answer['evidence']['relations'] and answer['evidence']['state']['edge.presence']['simulated'])
        action = {'request_id': str(uuid4()), 'entity_id': 'release-display', 'question': 'Cambiar escena virtual autorizada',
                  'action': {'capability_id': cap, 'scene': 'release-verified'}}
        denied = client.post('/v1/agent/requests', json=action, headers={'Authorization': 'Bearer ' + reader})
        check('read_only_actor_cannot_act', denied.status_code == 403)
        # Manual override is the existing mechanism preventing autonomous rules overwriting an operator action.
        send('PUT', '/v1/output/displays/release-display', {'manual': True})
        outcome = send('POST', '/v1/agent/requests', action)
        check('authorized_action_verified', outcome['status'] == 'verified' and outcome['action_result']['status'] == 'verified'
              and send('GET', '/v1/entities/release-display')['state']['display.scene'] == 'release-verified')
        check('trace_recorded', send('GET', '/v1/agent/requests/' + action['request_id']) == outcome)
        paths = ['/v1/entities/experience-camera', '/v1/entities/experience-camera/events',
                 '/v1/entities/experience-camera/memories', '/v1/entities/release-display',
                 '/v1/entities/release-display/events', '/v1/entities/release-display/capabilities']
        recorded = {path: send('GET', path) for path in paths}
        box = Outbox(str(WORK / 'outbox.sqlite3'))
        stop()
        box.put(messages[-1])  # accepted before shutdown; ACK-loss replay must deduplicate
        check('core_disconnection_retains_outbox', box.flush(client, force=True) == 0 and box.pending() == 1)
        box.close()
        box = Outbox(str(WORK / 'outbox.sqlite3'))
        check('edge_restart_retains_outbox', box.pending() == 1)
        start(WORK / 'core.sqlite3')
        check('persistent_state_events_memory_relations_capabilities', all(send('GET', path) == data for path, data in recorded.items()))
        check('agent_action_idempotent_after_restart', send('POST', '/v1/agent/requests', action) == outcome)
        check('outbox_recovery_no_duplicate_events', box.flush(client, force=True) == 1 and box.pending() == 0
              and send('GET', '/v1/entities/experience-camera/events') == recorded['/v1/entities/experience-camera/events'])
        # Explicit source interruption then recovery use the existing Observation contract.
        send('PUT', '/v1/output/displays/release-display', {})
        disconnected = json.loads(json.dumps(messages[-1]))
        disconnected.update(observation_id=str(uuid4()), observed_at=(beginning + timedelta(seconds=3)).isoformat())
        disconnected['payload'].update(tracks=[], source_status='disconnected')
        send('POST', '/v1/integrations/observations', disconnected)
        check('source_disconnection_visible', send('GET', '/v1/entities/experience-camera')['state']['edge.presence']['source_status'] == 'disconnected'
              and send('GET', '/v1/entities/release-display')['state']['display.scene'] == 'idle')
        recovered = json.loads(json.dumps(messages[-1]))
        recovered.update(observation_id=str(uuid4()), observed_at=(beginning + timedelta(seconds=4)).isoformat())
        send('POST', '/v1/integrations/observations', recovered)
        check('source_reconnection_restores_presence', send('GET', '/v1/entities/release-display')['state']['display.scene'] == 'welcome')
        final = {path: send('GET', path) for path in paths}
        stop()
        # SQLite's supported backup API; never copy an active WAL database file blindly.
        with sqlite3.connect(WORK / 'core.sqlite3') as source, sqlite3.connect(WORK / 'backup.sqlite3') as target:
            source.backup(target)
        with sqlite3.connect(WORK / 'backup.sqlite3') as source, sqlite3.connect(WORK / 'restored.sqlite3') as target:
            source.backup(target)
            check('restored_database_integrity', target.execute('PRAGMA integrity_check').fetchone()[0] == 'ok')
        start(WORK / 'restored.sqlite3')
        check('backup_restore_preserves_world_and_history', all(send('GET', path) == data for path, data in final.items()))
        check('backup_restore_preserves_agent_trace', send('GET', '/v1/agent/requests/' + action['request_id']) == outcome)
        REPORT['ingestion_latency_ms'] = {'samples': len(latencies), 'median': round(statistics.median(latencies), 2),
                                         'p95': round(sorted(latencies)[int(len(latencies) * .95) - 1], 2),
                                         'maximum': round(max(latencies), 2), 'scope': 'local HTTP + SQLite + virtual Output; no load/SLA claim'}
        REPORT['observation_count'] = len(send('GET', '/v1/entities/experience-camera/events')) - 1  # memory.recorded is not an observation
        REPORT['answer'] = answer['answer']
        REPORT['status'] = 'passed'
except Exception as error:
    REPORT['status'] = 'failed'
    REPORT['failure'] = {'type': type(error).__name__, 'message': str(error)}
    raise
finally:
    stop()
    if box:
        box.close()
    log.close()
    REPORT['run_directory'] = str(WORK.relative_to(ROOT))
    (WORK / 'report.json').write_text(json.dumps(REPORT, indent=2, ensure_ascii=False) + '\n')
    (ROOT / '.runtime/release-demo/latest.json').write_text(json.dumps(REPORT, indent=2, ensure_ascii=False) + '\n')
    print('Informe: ' + str(WORK.relative_to(ROOT) / 'report.json'), flush=True)
