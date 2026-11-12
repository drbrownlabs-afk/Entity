"""Core contracts, not claims of vision accuracy or multiperson validation."""
import copy
import unittest
from unittest.mock import patch
from uuid import uuid4
import test_p2_perception as fixtures
from app import main


class GlobalPerceptionTests(unittest.TestCase):
    setUp=fixtures.PerceptionTests.setUp
    tearDown=fixtures.PerceptionTests.tearDown
    login=fixtures.PerceptionTests.login
    post=fixtures.PerceptionTests.post
    world=fixtures.PerceptionTests.world

    def message(self):
        members=[]
        for cam in ['cam-a','cam-b']:
            members.append({'track_id':self.tracks[cam],'evidence_observation_ids':[self.messages[cam]['observation_id']]})
        return {'observation_id':str(uuid4()),'site_id':'p2','source_id':'cam-a',
            'observed_at':'2026-11-09T12:00:20Z','type':'edge.global_track_association',
            'provenance':{'connector_id':'video-test','model_version':'unit-protocol-only','simulated':True},
            'payload':{'global_track_id':'r:visual-anonymous','members':members,
                'method':'osnet-ain-static-graph-constrained-mtmc','model_sha256':'a'*64,'graph_sha256':'b'*64,
                'calibration_sha256':'c'*64,'association_output_sha256':'d'*64,'execution_mode':'offline-full-corpus'}}

    def test_global_identity_relations_memory_dedup_restart_and_unknown_location(self):
        msg=self.message();self.assertEqual(self.post(msg).status_code,200)
        before=self.world();self.assertTrue(self.post(msg).json()['duplicate']);self.assertEqual(before,self.world())
        subject=before['entities']['r:visual-anonymous']
        self.assertEqual(subject['kind'],'Track');self.assertEqual(subject['track_scope'],'global')
        self.assertFalse(subject['civil_identity_verified']);self.assertNotIn('observed_at',subject)
        self.assertEqual(subject['position_status'],'unknown');self.assertEqual(len(subject['relations']),2)
        for local in self.tracks.values():self.assertEqual(before['entities'][local]['global_track_id'],'r:visual-anonymous')
        main.initialize();self.assertEqual(before,self.world())
        r=self.c.post(self.prefix+'/queries',headers=self.h,json={'kind':'location','entity_id':'r:visual-anonymous'})
        self.assertEqual(r.json()['result']['status'],'unknown')
        r=self.c.post(self.prefix+'/queries',headers=self.h,json={'kind':'memories','entity_id':'r:visual-anonymous'})
        self.assertEqual(len(r.json()['result']),1)
        self.assertNotIn('presence',before['entities']['logical-person'])

    def test_invalid_actor_pose_refs_members_and_namespace_fail_without_partial_effects(self):
        for mutate in [lambda p:p.update(actor_id='forbidden'),lambda p:p.update(position=[0,0,0]),
                       lambda p:p.update(global_track_id='another-run:visual'),
                       lambda p:p['members'][0].update(track_id='logical-person'),
                       lambda p:p['members'][0].update(evidence_observation_ids=[str(uuid4())]),
                       lambda p:p['members'][0].update(evidence_observation_ids=[self.messages['cam-b']['observation_id']]),
                       lambda p:p['members'].append(copy.deepcopy(p['members'][0]))]:
            msg=self.message();mutate(msg['payload']);before=self.world()
            self.assertEqual(self.post(msg).status_code,422);self.assertEqual(before,self.world())

    def test_role_and_original_evidence_time_authorization(self):
        self.assertEqual(self.post(self.message(),self.login('viewer')).status_code,403)
        self.assertEqual(self.post(self.message(),self.login('connector')).status_code,403)
        msg=self.message();msg['observed_at']='2026-11-09T12:00:01Z';self.assertEqual(self.post(msg).status_code,422)

    def test_exact_replay_avoids_world_rebuild_without_bypassing_auth_or_conflict(self):
        msg=copy.deepcopy(self.messages['cam-a']);before=self.world()
        with patch('app.office.observations.world',side_effect=AssertionError('Duplicate rebuilt world')):
            self.assertTrue(self.post(msg).json()['duplicate'])
            changed=copy.deepcopy(msg);changed['payload']['frame_index']=99
            self.assertEqual(self.post(changed).status_code,409)
            self.assertEqual(self.post(msg,self.login('viewer')).status_code,403)
        self.assertEqual(before,self.world())

    def test_confirmation_time_preserved_and_global_inference_cannot_anticipate_it(self):
        msg=copy.deepcopy(self.messages['cam-a']);msg['observation_id']=str(uuid4())
        msg['payload']['tracks'][0]['association_confirmed_at']='2026-11-09T12:00:10Z'
        self.assertEqual(self.post(msg).status_code,200)
        track=self.world()['entities'][self.tracks['cam-a']]
        self.assertEqual(track['observed_at'],'2026-11-09T12:00:02+00:00')
        self.assertEqual(track['association_confirmed_at'],'2026-11-09T12:00:10+00:00')
        global_msg=self.message();global_msg['payload']['members'][0]['evidence_observation_ids']=[msg['observation_id']]
        global_msg['observed_at']='2026-11-09T12:00:09Z';self.assertEqual(self.post(global_msg).status_code,422)
        global_msg['observed_at']='2026-11-09T12:00:10Z';self.assertEqual(self.post(global_msg).status_code,200)

    def test_initial_confirmation_can_precede_later_detections_but_not_exceed_site_clock(self):
        msg=copy.deepcopy(self.messages['cam-a']);msg['observation_id']=str(uuid4())
        msg['payload']['tracks'][0]['association_confirmed_at']='2026-11-09T12:00:01Z'
        self.assertEqual(self.post(msg).status_code,200)
        subject=self.world()['entities'][self.tracks['cam-a']]
        self.assertEqual(subject['observed_at'],'2026-11-09T12:00:02+00:00')
        self.assertEqual(subject['association_confirmed_at'],'2026-11-09T12:00:01+00:00')
        msg['observation_id']=str(uuid4());msg['payload']['tracks'][0]['association_confirmed_at']='2026-11-09T12:00:21Z'
        self.assertEqual(self.post(msg).status_code,422)


if __name__=='__main__':unittest.main()
