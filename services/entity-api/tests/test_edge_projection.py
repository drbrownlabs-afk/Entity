import json
from uuid import uuid4
import unittest
import test_connectors


class EdgeProjectionTests(unittest.TestCase):
    setUp = test_connectors.ConnectorTests.setUp
    tearDown = test_connectors.ConnectorTests.tearDown
    def test_projection_late_event_dedup_and_loss(self):
        self.client.post('/v1/entities',json={'id':'camera','type':'Camera'})
        self.client.put('/v1/integrations/connectors/edge',headers=self.headers,json={
            'connector_id':'edge','version':'1','protocols':['simulation'],'input_event_types':['edge.presence']})
        body={'observation_id':str(uuid4()),'site_id':'lab','source_id':'camera','observed_at':'2026-11-06T12:00:01Z',
              'type':'edge.presence','provenance':{'connector_id':'edge','model_version':'fixture','simulated':True},
              'payload':{'tracks':[{'local_track_id':'session:1','zone_id':'left','position':[.2,.5]}], 'source_status':'connected'}}
        url='/v1/integrations/observations'
        self.assertEqual(self.client.post(url,headers=self.headers,json=body).status_code,200)
        people=[e for e in self.client.get('/v1/entities').json() if e['type']=='PersonTrack']
        self.assertEqual(len(people),1)
        person=self.client.get('/v1/entities/'+people[0]['id']).json()
        self.assertTrue(person['state']['active']);self.assertEqual(person['relations'][0]['type'],'observedIn')
        self.assertTrue(self.client.post(url,headers=self.headers,json=body).json()['duplicate'])
        body['observation_id']=str(uuid4());body['observed_at']='2026-11-06T12:00:00Z';body['payload']['tracks']=[]
        self.assertEqual(self.client.post(url,headers=self.headers,json=body).status_code,200)
        self.assertTrue(self.client.get('/v1/entities/'+people[0]['id']).json()['state']['active'])
        body['observation_id']=str(uuid4());body['observed_at']='2026-11-06T12:00:02Z';body['payload']['source_status']='disconnected'
        self.assertEqual(self.client.post(url,headers=self.headers,json=body).status_code,200)
        self.assertFalse(self.client.get('/v1/entities/'+people[0]['id']).json()['state']['active'])
        self.assertEqual(self.client.get('/v1/entities/'+people[0]['id']).json()['relations'],[])
        body['observation_id']=str(uuid4());body['payload']['tracks']=[{'local_track_id':'bad','position':[5,1]}]
        self.assertEqual(self.client.post(url,headers=self.headers,json=body).status_code,422)
        self.assertEqual(len(self.client.get('/v1/entities/camera/events').json()),3)
