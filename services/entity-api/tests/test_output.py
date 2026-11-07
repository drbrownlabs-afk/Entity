import json
import os
import unittest
from uuid import uuid4
import test_connectors


class OutputTests(unittest.TestCase):
    def setUp(self):
        test_connectors.ConnectorTests.setUp(self)
        entries=json.loads(os.environ['ENTITY_CONNECTOR_TOKENS']);entries[0]['permissions'].append('output:write')
        os.environ['ENTITY_CONNECTOR_TOKENS']=json.dumps(entries)
        for identity,kind in [('camera','Camera'),('screen','Display')]:
            self.client.post('/v1/entities',json={'id':identity,'type':kind})
        self.client.put('/v1/output/displays/screen',headers=self.headers,json={}).raise_for_status()
        result=self.client.post('/v1/entities/screen/capabilities',json={'operation':'display.set_scene',
            'description':'Virtual screen scene','required_permission':'output:write'}).json()
        self.cap=result['id']
        self.client.put('/v1/output/rules/presence',headers=self.headers,json={'camera_id':'camera','capability_id':self.cap}).raise_for_status()
        self.client.put('/v1/integrations/connectors/edge',headers=self.headers,json={
            'connector_id':'edge','version':'1','protocols':['simulation'],'input_event_types':['edge.presence']}).raise_for_status()

    tearDown=test_connectors.ConnectorTests.tearDown

    def observation(self,present=True):
        return {'observation_id':str(uuid4()),'site_id':'lab','source_id':'camera','observed_at':'2026-11-06T12:00:01Z',
            'type':'edge.presence','provenance':{'connector_id':'edge','model_version':'fixture','simulated':True},
            'payload':{'tracks':[{'local_track_id':'session:1','position':[.2,.5],'zone_id':'left'}] if present else [],'source_status':'connected'}}

    def test_presence_rule_screen_readback_and_no_duplicate(self):
        body=self.observation()
        self.client.post('/v1/integrations/observations',headers=self.headers,json=body).raise_for_status()
        self.assertIn('welcome',self.client.get('/v1/output/displays/screen').text)
        self.assertEqual(self.client.get('/v1/entities/screen').json()['state']['display.scene'],'welcome')
        self.client.post('/v1/integrations/observations',headers=self.headers,json=body).raise_for_status()
        events=self.client.get('/v1/entities/screen/events').json()
        self.assertEqual(sum(e['type']=='output.result' for e in events),1)
        body=self.observation(False);body['observed_at']='2026-11-06T12:00:02Z'
        self.client.post('/v1/integrations/observations',headers=self.headers,json=body).raise_for_status()
        self.assertIn('idle',self.client.get('/v1/output/displays/screen').text)
        body=self.observation();body['observed_at']='2026-11-06T12:00:00Z'
        self.client.post('/v1/integrations/observations',headers=self.headers,json=body).raise_for_status()
        self.assertEqual(self.client.get('/v1/entities/screen').json()['state']['display.scene'],'idle')

    def test_manual_override_and_idempotency_persistence(self):
        self.client.put('/v1/output/displays/screen',headers=self.headers,json={'manual':True}).raise_for_status()
        command={'request_id':str(uuid4()),'capability_id':self.cap,'scene':'manual scene'}
        result=self.client.post('/v1/output/commands',headers=self.headers,json=command).json()
        self.assertEqual(result['status'],'verified')
        self.client.post('/v1/integrations/observations',headers=self.headers,json=self.observation()).raise_for_status()
        self.assertIn('manual scene',self.client.get('/v1/output/displays/screen').text)
        import app.main
        app.main.initialize()
        self.assertEqual(self.client.post('/v1/output/commands',headers=self.headers,json=command).json(),result)
        command['scene']='changed'
        self.assertEqual(self.client.post('/v1/output/commands',headers=self.headers,json=command).status_code,409)
        outcomes=[e['payload'].get('status') for e in self.client.get('/v1/entities/screen/events').json() if e['type']=='output.result']
        self.assertIn('suppressed',outcomes)

    def test_failure_timeout_mismatch_permissions_and_html_escape(self):
        for behavior,outcome in [('fail','failed'),('timeout','timed_out'),('mismatch','verification_failed')]:
            self.client.put('/v1/output/displays/screen',headers=self.headers,json={'behavior':behavior}).raise_for_status()
            response=self.client.post('/v1/output/commands',headers=self.headers,json={'request_id':str(uuid4()),'capability_id':self.cap,'scene':'welcome'})
            self.assertEqual(response.json()['status'],outcome)
        self.assertEqual(self.client.post('/v1/output/commands',headers={'Authorization':'Bearer reader-only'},json={'request_id':str(uuid4()),'capability_id':self.cap,'scene':'x'}).status_code,403)
        self.client.put('/v1/output/displays/screen',headers=self.headers,json={}).raise_for_status()
        self.client.post('/v1/output/commands',headers=self.headers,json={'request_id':str(uuid4()),'capability_id':self.cap,'scene':'<script>bad</script>'}).raise_for_status()
        self.assertIn('&lt;script&gt;',self.client.get('/v1/output/displays/screen').text)
