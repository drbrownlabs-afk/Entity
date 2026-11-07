import json
from pathlib import Path
import sqlite3
import tempfile
from concurrent.futures import ThreadPoolExecutor
import unittest
from fastapi.testclient import TestClient
from app import main


class CoreTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.previous = main.DB_PATH
        main.DB_PATH = Path(self.temp.name) / 'core.sqlite3'
        self.client = TestClient(main.app)
        self.client.__enter__()
        self.client.post('/v1/entities', json={'id': 'display', 'type': 'Display'})

    def tearDown(self):
        self.client.__exit__(None, None, None)
        main.DB_PATH = self.previous
        self.temp.cleanup()

    def test_declarations_memory_events_and_contracts(self):
        capability = {'operation': 'display.show', 'description': 'Show content',
                      'parameters': {'content': {'type': 'string'}}, 'required_permission': 'display:write'}
        declared = self.client.post('/v1/entities/display/capabilities', json=capability)
        self.assertEqual(declared.status_code, 201)
        cid = declared.json()['id']
        self.assertEqual(self.client.post('/v1/entities/display/capabilities', json=capability).status_code, 409)
        memory = self.client.post('/v1/entities/display/memories', json={'content': 'Synthetic note', 'source': 'operator:test'})
        self.assertEqual(memory.status_code, 201)
        self.assertEqual(self.client.post('/v1/entities/display/events', json={
            'type': 'inspection.completed', 'source': 'test:manual', 'payload': {'simulated': True}}).status_code, 201)
        events = self.client.get('/v1/entities/display/events').json()
        self.assertEqual([e['type'] for e in events], ['capability.declared', 'memory.recorded', 'inspection.completed'])
        self.assertEqual(events[0]['payload']['capability_id'], cid)
        self.assertEqual(events[1]['payload']['memory_id'], memory.json()['id'])
        self.assertEqual(events[-1]['source'], 'test:manual')
        self.assertTrue(all(e['schema_version'] == '1.0' for e in events))
        self.assertEqual(self.client.get('/v1/entities/display/capabilities').json()[0]['parameters'], capability['parameters'])
        self.assertEqual(len(self.client.get('/v1/entities/display/memories').json()), 1)
        self.assertEqual(self.client.post(f'/v1/entities/display/capabilities/{cid}/invoke', json={}).status_code, 404)
        self.assertEqual(self.client.get('/ready').json()['database_schema_version'], 3)
        schema = self.client.get('/openapi.json').json()
        for name in ('EventCreate', 'MemoryCreate', 'CapabilityCreate'):
            self.assertEqual(schema['components']['schemas'][name]['properties']['schema_version']['const'], '1.0')

    def test_invalid_and_missing_records_have_no_side_effects(self):
        for endpoint, payload in (
            ('memories', {'content': ' ', 'source': 'operator'}),
            ('memories', {'content': 'note', 'source': 'test', 'schema_version': '2.0'}),
            ('events', {'type': 'inspection', 'payload': {}}),
            ('events', {'type': 'state.changed', 'source': 'spoofed'}),
            ('capabilities', {'operation': 'run', 'description': 'Run'}),
            ('capabilities', {'operation': ' ', 'description': 'Run', 'required_permission': 'admin'})):
            self.assertEqual(self.client.post('/v1/entities/display/' + endpoint, json=payload).status_code, 422)
        for endpoint, payload in (
            ('memories', {'content': 'note', 'source': 'test'}),
            ('events', {'type': 'inspection', 'source': 'test'}),
            ('capabilities', {'operation': 'show', 'description': 'Show', 'required_permission': 'write'})):
            self.assertEqual(self.client.post('/v1/entities/missing/' + endpoint, json=payload).status_code, 404)
            self.assertEqual(self.client.get('/v1/entities/missing/' + endpoint).status_code, 404)
            self.assertEqual(self.client.get('/v1/entities/display/' + endpoint).json(), [])

    def test_readiness_detects_missing_schema(self):
        main.DB_PATH = Path(self.temp.name) / 'uninitialized.sqlite3'
        self.assertEqual(self.client.get('/ready').status_code, 503)

    def test_versioned_openapi_matches_published_contract(self):
        contract = Path(__file__).resolve().parents[3] / 'packages/contracts/core/v1/openapi.json'
        actual = self.client.get('/openapi.json').json()
        original = json.loads(contract.read_text())
        for path, value in original['paths'].items():
            self.assertEqual(actual['paths'][path], value)
        for name, value in original['components']['schemas'].items():
            self.assertEqual(actual['components']['schemas'][name], value)

    def test_concurrent_state_changes_keep_consistent_history(self):
        def update(value):
            response = self.client.put('/v1/entities/display/state', json={'key': 'counter', 'value': value})
            self.assertEqual(response.status_code, 200)
        with ThreadPoolExecutor(max_workers=4) as pool:
            list(pool.map(update, range(8)))
        events = self.client.get('/v1/entities/display/events').json()
        self.assertEqual(len(events), 8)
        previous = None
        for event in events:
            self.assertEqual(event['payload']['previous'], previous)
            previous = event['payload']['value']
        self.assertEqual(self.client.get('/v1/entities/display').json()['state']['counter'], previous)

    def test_memory_and_event_are_atomic(self):
        with main.database() as db:
            db.execute("CREATE TRIGGER reject_event BEFORE INSERT ON events BEGIN SELECT RAISE(ABORT, 'test failure'); END")
        with self.assertRaises(sqlite3.IntegrityError):
            self.client.post('/v1/entities/display/memories', json={'content': 'note', 'source': 'test'})
        self.assertEqual(self.client.get('/v1/entities/display/memories').json(), [])

    def test_capability_and_event_are_atomic(self):
        with main.database() as db:
            db.execute("CREATE TRIGGER reject_event BEFORE INSERT ON events BEGIN SELECT RAISE(ABORT, 'test failure'); END")
        with self.assertRaises(sqlite3.IntegrityError):
            self.client.post('/v1/entities/display/capabilities', json={
                'operation': 'show', 'description': 'Show', 'required_permission': 'write'})
        self.assertEqual(self.client.get('/v1/entities/display/capabilities').json(), [])


class MigrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.previous = main.DB_PATH
        main.DB_PATH = Path(self.temp.name) / 'legacy.sqlite3'

    def tearDown(self):
        main.DB_PATH = self.previous
        self.temp.cleanup()

    def test_upgrade_legacy_preserves_all_records(self):
        sql = Path(main.__file__).with_name('migrations').joinpath('001_initial.sql').read_text()
        with sqlite3.connect(main.DB_PATH) as db:
            db.executescript(sql)
            db.executemany('INSERT INTO entities VALUES(?,?,?,?)', [('a', 'Room', '{}', 't'), ('b', 'Floor', '{}', 't')])
            db.execute('INSERT INTO entity_state VALUES(?,?,?,?)', ('a', 'occupied', 'true', 't'))
            db.execute('INSERT INTO relations VALUES(?,?,?,?,?)', ('r', 'a', 'b', 'locatedIn', 't'))
            db.execute('INSERT INTO events VALUES(?,?,?,?,?)', ('e', 'a', 'state.changed', json.dumps({'value': True}), 't'))
        main.initialize()
        main.initialize()
        with TestClient(main.app) as client:
            self.assertEqual(client.get('/v1/entities/a').json()['state'], {'occupied': True})
            self.assertEqual(client.get('/v1/entities/a').json()['relations'][0]['id'], 'r')
            event = client.get('/v1/entities/a/events').json()[0]
            self.assertEqual(event['id'], 'e')
            self.assertEqual(event['source'], 'entity-api')
        with sqlite3.connect(main.DB_PATH) as db:
            self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(), [])
            self.assertEqual(db.execute('PRAGMA integrity_check').fetchone()[0], 'ok')

    def test_future_schema_is_rejected_without_changes(self):
        with sqlite3.connect(main.DB_PATH) as db:
            db.execute('PRAGMA user_version=999')
        with self.assertRaisesRegex(RuntimeError, 'newer'):
            main.initialize()
        with sqlite3.connect(main.DB_PATH) as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0], 999)
            self.assertEqual(db.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall(), [])

    def test_failed_migration_rolls_back(self):
        with sqlite3.connect(main.DB_PATH) as db:
            db.execute('CREATE TABLE memories (id TEXT)')
        with self.assertRaises(sqlite3.OperationalError):
            main.initialize()
        with sqlite3.connect(main.DB_PATH) as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0], 0)
            self.assertEqual(db.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall(), [('memories',)])

    def test_concurrent_initialization(self):
        with ThreadPoolExecutor(max_workers=4) as pool:
            list(pool.map(lambda _: main.initialize(), range(8)))
        with sqlite3.connect(main.DB_PATH) as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0], 3)
