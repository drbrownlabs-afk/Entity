import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from uuid import uuid4
from fastapi.testclient import TestClient
from app import main


class ConnectorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.old = main.DB_PATH
        main.DB_PATH = Path(self.temp.name)/'test.sqlite3'
        self.env = patch.dict(os.environ, ENTITY_CONNECTOR_TOKENS=json.dumps([
            {'token': 'test-only', 'actor': 'operator', 'permissions': ['registry:write','observe:write','simulate:write','audit:read']},
            {'token': 'reader-only', 'actor': 'reader', 'permissions': ['observe:write']}]))
        self.env.start()
        self.client = TestClient(main.app).__enter__()
        self.headers={'Authorization':'Bearer test-only'}
        self.client.post('/v1/entities',json={'id':'room','type':'Room'})
        for name, protocol in [('sim','simulation'),('sensor','rest')]:
            response=self.client.put('/v1/integrations/connectors/'+name,headers=self.headers,json={
                'connector_id':name,'version':'1','protocols':[protocol], 'input_event_types':['presence'],
                'capability_schemas':['simulation.set_state'] if name=='sim' else []})
            self.assertEqual(response.status_code,200)

    def tearDown(self):
        self.client.__exit__(None,None,None)
        main.DB_PATH=self.old
        self.env.stop()
        self.temp.cleanup()

    def observation(self, name='sim'):
        return {'observation_id':str(uuid4()),'site_id':'lab','source_id':'room',
                'observed_at':'2026-11-06T12:00:00Z','type':'presence','payload':{'occupied':True},
                'provenance':{'connector_id':name,'model_version':'test-v1','simulated':name=='sim'}}

    def invocation(self):
        return {'request_id':str(uuid4()),'capability':{'capability_id':str(uuid4()),'target_entity_id':'room',
                'connector_id':'sim','operation':'simulation.set_state'}, 'key':'occupied','value':True}

    def test_interchange_deduplication_and_restart(self):
        for name in ('sim','sensor'):
            body=self.observation(name)
            first=self.client.post('/v1/integrations/observations',headers=self.headers,json=body)
            self.assertEqual(first.status_code,200)
            self.assertFalse(first.json()['duplicate'])
            main.initialize()
            duplicate=self.client.post('/v1/integrations/observations',headers=self.headers,json=body)
            self.assertTrue(duplicate.json()['duplicate'])
            self.assertEqual(first.json()['received_at'],duplicate.json()['received_at'])
            body['payload']={'occupied':False}
            self.assertEqual(self.client.post('/v1/integrations/observations',headers=self.headers,json=body).status_code,409)
        self.assertEqual(len(self.client.get('/v1/entities/room/events').json()),2)

    def test_verified_action_idempotency_and_audit(self):
        body=self.invocation()
        first=self.client.post('/v1/integrations/invocations',headers=self.headers,json=body)
        self.assertEqual(first.status_code,200)
        self.assertEqual(first.json()['status'],'verified')
        main.initialize()
        self.assertEqual(self.client.post('/v1/integrations/invocations',headers=self.headers,json=body).json(),first.json())
        self.assertTrue(self.client.get('/v1/entities/room').json()['state']['occupied'])
        self.assertEqual(len(self.client.get('/v1/entities/room/events').json()),1)
        body['value']=False
        self.assertEqual(self.client.post('/v1/integrations/invocations',headers=self.headers,json=body).status_code,409)
        audit=self.client.get('/v1/integrations/audit',headers=self.headers).json()
        self.assertIn('verified-simulation',[r['outcome'] for r in audit])

    def test_permissions_failure_and_contract(self):
        path='/v1/integrations/invocations'
        self.assertEqual(self.client.post(path,json=self.invocation()).status_code,401)
        self.assertEqual(self.client.post(path,headers={'Authorization':'Bearer reader-only'},json=self.invocation()).status_code,403)
        body=self.observation(); body['observed_at']='2026-11-06T12:00:00'
        self.assertEqual(self.client.post('/v1/integrations/observations',headers=self.headers,json=body).status_code,422)
        with main.database(write=True) as db:
            row=json.loads(db.execute("SELECT manifest FROM connectors WHERE id='sim'").fetchone()[0]);row['enabled']=False
            db.execute("UPDATE connectors SET manifest=? WHERE id='sim'",(json.dumps(row),))
        self.assertEqual(self.client.post(path,headers=self.headers,json=self.invocation()).status_code,503)
        self.assertEqual(self.client.get('/v1/entities/room').json()['state'],{})
        self.assertEqual(self.client.get('/v1/integrations/connectors/sim/health',headers=self.headers).status_code,503)

    def test_real_rest_transport_and_process_restart(self):
        import socket
        import subprocess
        import sys
        import time
        import httpx
        with socket.socket() as sock:
            sock.bind(('127.0.0.1', 0))
            port = sock.getsockname()[1]
        env = dict(os.environ, ENTITY_SQLITE_PATH=str(main.DB_PATH))
        body = self.observation('sensor')
        invocation = self.invocation()
        with httpx.Client(base_url=f'http://127.0.0.1:{port}', trust_env=False, headers=self.headers) as client:
            for iteration in range(2):
                with open(Path(self.temp.name)/'server.log','w') as log:
                    proc = subprocess.Popen([sys.executable,'-m','uvicorn','app.main:app','--port',str(port)],
                        cwd=Path(main.__file__).parents[1],env=env,stdout=log,stderr=log)
                    try:
                        deadline=time.monotonic()+20
                        while True:
                            try:
                                if client.get('/ready').status_code==200: break
                            except httpx.TransportError: pass
                            self.assertIsNone(proc.poll())
                            self.assertLess(time.monotonic(),deadline)
                            time.sleep(.1)
                        response=client.post('/v1/integrations/observations',json=body)
                        self.assertEqual(response.status_code,200)
                        self.assertEqual(response.json()['duplicate'],bool(iteration))
                        result=client.post('/v1/integrations/invocations',json=invocation)
                        self.assertEqual(result.status_code,200)
                        if iteration: self.assertEqual(result.json(),previous)
                        previous=result.json()
                    finally:
                        proc.terminate()
                        try: proc.wait(timeout=10)
                        except subprocess.TimeoutExpired:
                            proc.kill();proc.wait()
