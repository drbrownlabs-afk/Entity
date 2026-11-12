"""Image evidence is additive: existing Edge clients retain their serialized track shape."""
import unittest
from uuid import uuid4
import test_connectors

class EdgeWireCompatibilityTests(unittest.TestCase):
    setUp=test_connectors.ConnectorTests.setUp
    tearDown=test_connectors.ConnectorTests.tearDown

    def test_legacy_and_image_evidence_projection(self):
        self.client.post('/v1/entities',json={'id':'camera','type':'Camera'}).raise_for_status()
        self.client.put('/v1/integrations/connectors/edge',headers=self.headers,json={'connector_id':'edge','version':'1','protocols':['simulation'],'input_event_types':['edge.presence']}).raise_for_status()
        track={'local_track_id':'legacy:1','zone_id':None,'position':[.2,.5]}
        body={'observation_id':str(uuid4()),'site_id':'lab','source_id':'camera','observed_at':'2026-11-06T12:00:01Z','type':'edge.presence','provenance':{'connector_id':'edge','model_version':'fixture','simulated':True},'payload':{'tracks':[track],'source_status':'connected'}}
        self.client.post('/v1/integrations/observations',headers=self.headers,json=body).raise_for_status()
        state=self.client.get('/v1/entities/camera').json()['state']['edge.presence']
        self.assertEqual(state['tracks'],[track]);self.assertNotIn('frame_sha256',state)
        track.update(image_bbox=[.1,.1,.5,.8],detection_confidence=.9)
        body.update(observation_id=str(uuid4()),observed_at='2026-11-06T12:00:02Z');body['payload'].update(frame_sha256='a'*64,frame_index=1,media_time_seconds=.5)
        self.client.post('/v1/integrations/observations',headers=self.headers,json=body).raise_for_status()
        state=self.client.get('/v1/entities/camera').json()['state']['edge.presence']
        self.assertEqual(state['tracks'],[track]);self.assertEqual(state['frame_sha256'],'a'*64)
        track['association_confirmed_at']='2026-11-06T12:00:04Z'
        body.update(observation_id=str(uuid4()),observed_at='2026-11-06T12:00:03Z')
        self.client.post('/v1/integrations/observations',headers=self.headers,json=body).raise_for_status()
        state=self.client.get('/v1/entities/camera').json()['state']['edge.presence']
        self.assertEqual(state['tracks'][0]['association_confirmed_at'],'2026-11-06T12:00:04Z')
