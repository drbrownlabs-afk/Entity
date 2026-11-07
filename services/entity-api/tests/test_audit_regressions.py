"""Regression cases discovered by independent adverse audit, not happy-path mirrors."""
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app import main


class AuditRegressions(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.previous=main.DB_PATH
        main.DB_PATH=Path(self.temp.name)/'audit.sqlite3'
        self.env=patch.dict(os.environ,ENTITY_CONNECTOR_TOKENS=json.dumps([
            {'token':'audit-unit-only','actor':'audit','permissions':['observe:write']}]))
        self.env.start();self.client=TestClient(main.app).__enter__()
        self.client.post('/v1/entities',json={'id':'room','type':'Room'})

    def tearDown(self):
        self.client.__exit__(None,None,None);main.DB_PATH=self.previous
        self.env.stop();self.temp.cleanup()

    def test_nonfinite_nested_json_rejected_before_state_commit(self):
        for value in ['NaN','Infinity','-Infinity','1e999']:
            response=self.client.put('/v1/entities/room/state',content='{"key":"bad","value":{"nested":['+value+']}}',headers={'Content-Type':'application/json'})
            self.assertEqual(response.status_code,422,response.text)
            self.assertEqual(self.client.get('/v1/entities/room').json()['state'],{})
            self.assertEqual(self.client.get('/v1/entities/room/events').json(),[])
        response=self.client.put('/v1/entities/room/state',json={'key':'good','value':{'nested':[1.25]}})
        self.assertEqual(response.status_code,200)

    def test_nonfinite_attributes_and_events_are_not_persisted(self):
        response=self.client.post('/v1/entities',content='{"id":"bad","type":"Room","attributes":{"number":NaN}}',headers={'Content-Type':'application/json'})
        self.assertEqual(response.status_code,422)
        self.assertEqual(self.client.get('/v1/entities/bad').status_code,404)
        response=self.client.post('/v1/entities/room/events',content='{"type":"measurement","source":"audit","payload":{"number":Infinity}}',headers={'Content-Type':'application/json'})
        self.assertEqual(response.status_code,422)
        self.assertEqual(self.client.get('/v1/entities/room/events').json(),[])

    def test_non_ascii_bearer_does_not_crash_authentication(self):
        response=self.client.get('/v1/integrations/connectors/missing/health',headers={b'Authorization':b'Bearer \xff'})
        self.assertEqual(response.status_code,401)

    def test_non_ascii_configured_token_fails_as_configuration_error(self):
        with patch.dict(os.environ,ENTITY_CONNECTOR_TOKENS=json.dumps([
            {'token':'no-ascii-ñ','actor':'audit','permissions':['observe:write']}])):
            response=self.client.get('/v1/integrations/connectors/missing/health',headers={'Authorization':'Bearer audit-unit-only'})
            self.assertEqual(response.status_code,503)
