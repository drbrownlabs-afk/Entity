"""Contract/time tests only; numbers below are not a replacement scene or spatial survey."""
import unittest
from app import main
import test_office as base
class SpatialClockTests(unittest.TestCase):
    setUp=base.OfficeTests.setUp
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    cmd=base.OfficeTests.cmd
    state=base.OfficeTests.state
    def test_core_clock_reconstruction_restart_and_anonymous_identity_are_separate(self):
        body={'id':'contract-route','motions':[{'person_id':'luis','avatar_id':'Male_Adult_01','zone_id':'zone','coordinate_frame':'contract-test-not-a-scene',
            'calibration_evidence':'unit-test-only; not spatial validation','waypoints':[{'at':'2026-11-07T15:45:00-05:00','position':[0,0,0],'evidence':'contract-a'},{'at':'2026-11-07T15:45:10-05:00','position':[0,0,2],'evidence':'contract-b'}]}]}
        revision=self.state()['revision']
        self.client.post(self.root+'/scenarios',headers=self.headers,json={'id':'pre-route','expected_revision':revision})
        r=self.client.post(self.root+'/spatial-routes',headers=self.headers,json=body);self.assertEqual(r.status_code,200,r.text)
        self.assertEqual(self.client.post(self.root+'/spatial-routes',headers=self.auth('luis'),json=body).status_code,403)
        self.assertNotIn('spatial_pose',self.state(branch='pre-route')['entities']['luis'])
        self.cmd('clock.advance',inputs={'to':'2026-11-07T15:45:05-05:00'})
        before=self.state();self.assertEqual(before['entities']['luis']['spatial_pose']['position'],[0,0,1])
        self.assertNotEqual(before['entities']['luis'].get('presence'),'confirmed')
        main.initialize();self.assertEqual(before,self.state())
        self.assertEqual(self.state(at='2026-11-07T15:45:02-05:00')['entities']['luis']['spatial_pose']['position'],[0,0,.4])
        body['motions'][0]['waypoints'][1]['position'][2]=9
        self.assertEqual(self.client.post(self.root+'/spatial-routes',headers=self.headers,json=body).status_code,409)
