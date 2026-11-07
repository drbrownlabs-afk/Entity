#!/usr/bin/env python3
"""Check restart persistence, retaining uniquely named synthetic development data."""
import json
from pathlib import Path
import subprocess
import time
from urllib.request import build_opener, ProxyHandler, Request
from uuid import uuid4

http = build_opener(ProxyHandler({}))


def request(path, payload=None, method=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = Request('http://127.0.0.1:8000' + path, data=data,
                  headers={'Content-Type': 'application/json'}, method=method)
    with http.open(req, timeout=5) as response:
        return json.load(response)


def healthy():
    deadline = time.monotonic() + 60
    while True:
        try:
            assert request('/health') == {'status': 'ok', 'service': 'entity-api'}
            return
        except OSError:
            if time.monotonic() >= deadline:
                raise
            time.sleep(0.2)


if __name__ == '__main__':
    healthy()
    prefix = 'phase01-smoke-' + uuid4().hex
    room, floor = prefix + '-room', prefix + '-floor'
    request('/v1/entities', {'id': room, 'type': 'Room', 'attributes': {'synthetic': True}})
    request('/v1/entities', {'id': floor, 'type': 'Floor'})
    request('/v1/relations', {'source_id': room, 'target_id': floor, 'type': 'locatedIn'})
    for value in (True, False):
        request(f'/v1/entities/{room}/state', {'key': 'occupied', 'value': value}, 'PUT')
    request(f'/v1/entities/{room}/memories', {'content': 'Synthetic note', 'source': 'smoke:synthetic'})
    request(f'/v1/entities/{room}/capabilities', {'operation': 'display.show', 'description': 'Show', 'required_permission': 'display:write'})
    request(f'/v1/entities/{room}/events', {'type': 'inspection.completed', 'source': 'smoke:synthetic', 'payload': {'simulated': True}})
    memories = request(f'/v1/entities/{room}/memories')
    capabilities = request(f'/v1/entities/{room}/capabilities')
    before = request(f'/v1/entities/{room}')
    events = request(f'/v1/entities/{room}/events')
    assert len(events) == 5 and len(before['relations']) == 1
    subprocess.run(['docker', 'compose', '-f', 'compose.yaml', 'restart', 'entity-api'],
                   cwd=Path(__file__).resolve().parents[1], check=True)
    healthy()
    assert request(f'/v1/entities/{room}') == before
    assert request(f'/v1/entities/{room}/events') == events
    assert request(f'/v1/entities/{floor}')['id'] == floor
    assert request(f'/v1/entities/{room}/memories') == memories
    assert request(f'/v1/entities/{room}/capabilities') == capabilities
    assert request('/ready')['database_schema_version'] == 3
    print('PASS: health/ready, entities, state, relations, 5 events, memory and capability survive container restart.')
    print('Synthetic records retained in development volume:', prefix)
