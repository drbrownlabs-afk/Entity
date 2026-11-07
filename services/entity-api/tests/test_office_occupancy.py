import unittest
from uuid import uuid4
import test_office as base
from app import main
class CameraOccupancyTests(unittest.TestCase):
    setUp=base.OfficeTests.setUp
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    cmd=base.OfficeTests.cmd
    state=base.OfficeTests.state
    obs=base.OfficeTests.obs
    def test_other_camera_empty_or_disconnected_does_not_erase_observed_person(self):
        self.cmd('entity.upsert',inputs={'id':'second-camera','kind':'Camera','attributes':{'covered_zones':['zone'],'connectivity':'connected'}})
        with main.database(write=True) as db:db.execute('INSERT INTO office_bindings VALUES(?,?,?,?,?)',('office','second-camera','simulated','1.0','{}'))
        self.obs([{'local_track_id':'a','zone_id':'zone','position':[.5,.5]}])
        def second(tracks):
            r=self.client.post(self.root+'/observations',headers=self.headers,json={'observation_id':str(uuid4()),'site_id':'office','source_id':'second-camera','observed_at':self.state()['clock'],'type':'edge.presence','payload':{'source_status':'connected','tracks':tracks,'transitions':[]},'provenance':{'connector_id':'simulated','model_version':'test','simulated':True}})
            self.assertEqual(r.status_code,200,r.text)
        second([])
        self.assertEqual(self.state()['entities']['zone']['occupancy'],1)
        second([{'local_track_id':'b','zone_id':'zone','position':[.4,.6]}])
        self.assertEqual(self.state()['entities']['zone']['occupancy_range'],[1,2])
        # Only explicit authorized evidence permits merging the two observations as Luis.
        for camera in ['camera','second-camera']:
            track=self.state()['entities'][camera]['tracks'][0]
            self.cmd('identity.associate',track,{'person_id':'luis','credential_verified':True,'evidence_type':'staff-verification'})
        self.assertEqual(self.state()['entities']['zone']['occupancy_range'],[1,1])
        self.cmd('camera.setStatus','second-camera',{'status':'disconnected'})
        self.assertEqual(self.state()['entities']['zone']['occupancy'],1)
