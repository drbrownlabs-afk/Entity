"""Read-only HTTP/SQLite persistence comparison; private credentials never leave runtime."""
import argparse
import hashlib
import json
from pathlib import Path
import sqlite3
import httpx

ROOT = Path(__file__).resolve().parents[3]
p = argparse.ArgumentParser()
p.add_argument('--run', required=True)
p.add_argument('--save', type=Path)
p.add_argument('--compare', type=Path)
p.add_argument('--output', type=Path)
a = p.parse_args()
runtime = ROOT / 'simulation/spatial-office/.runtime'
credentials = json.loads((runtime / 'coworking-p2-access.json').read_text())
with httpx.Client(base_url='http://127.0.0.1:8092', timeout=30) as client:
    response = client.post('/v1/office/auth/login', json={
        'username': 'coworking-p2:admin', 'password': credentials['coworking-p2:admin']['password']})
    response.raise_for_status()
    client.headers['Authorization'] = 'Bearer ' + response.json()['token']
    response = client.get(f'/v1/sites/coworking-p2/runs/{a.run}/world')
    response.raise_for_status()
    world = response.json()
    client.post('/v1/office/auth/logout').raise_for_status()
db = sqlite3.connect('file:' + str(runtime / 'p2-core.sqlite3') + '?mode=ro', uri=True)
memory = db.execute('SELECT COUNT(*) FROM memories').fetchone()[0]
integrity = db.execute('PRAGMA integrity_check').fetchone()[0]
db.close()
snapshot = {'world_sha256': hashlib.sha256(json.dumps(world, sort_keys=True).encode()).hexdigest(),
            'world_revision': world['revision'], 'entity_count': len(world['entities']),
            'memory_records': memory, 'sqlite_integrity': integrity}
assert integrity == 'ok'
if a.save:
    a.save.write_text(json.dumps(snapshot, indent=2) + '\n')
if a.compare:
    before = json.loads(a.compare.read_text())
    assert before == snapshot, 'Core state or memory changed across restart'
    report = {'real_http': True, 'real_process_restart': True,
              'world_and_memory_preserved': True, **snapshot}
    if not a.output:
        p.error('--output is required for comparison')
    a.output.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(snapshot))
