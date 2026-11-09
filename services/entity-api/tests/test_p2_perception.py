"""P1 observation contracts/authorization/persistence; synthetic protocol fixtures, not vision accuracy."""
import unittest,tempfile,json,copy
from pathlib import Path
from uuid import uuid4
from fastapi.testclient import TestClient
from app import main
from app.office.service import site_create,upsert_resource,create_run
from app.office.auth import create_account
class PerceptionTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.old=main.DB_PATH;main.DB_PATH=Path(self.temp.name)/'test.sqlite3';self.c=TestClient(main.app).__enter__();self.pw='unit-test-password-only'
  with main.database(write=True)as db:
   site_create(db,'p2','P2 perception unit test','UTC')
   for key,kind in [('cam-a','Camera'),('cam-b','Camera'),('logical-person','Person')]:upsert_resource(db,'p2',key,kind,{'covered_zones':[]}if kind=='Camera'else{'position':None})
   for name,role,person in [('admin','admin',None),('viewer','viewer',None),('connector','connector','cam-a')]:create_account(db,name,self.pw,'p2',role,person)
   create_run(db,'p2','r','2026-11-09T12:00:20Z')
  self.h=self.login('admin');self.prefix='/v1/sites/p2/runs/r';self.messages={};self.refs=[]
  for cam in ['cam-a','cam-b']:
   self.assertEqual(self.c.put('/v1/sites/p2/bindings',headers=self.h,json={'source':cam,'adapter':'video-test'}).status_code,200)
   for index in range(3):
    msg={'observation_id':str(uuid4()),'site_id':'p2','source_id':cam,'observed_at':f'2026-11-09T12:00:0{index}Z','type':'edge.presence','provenance':{'connector_id':'video-test','model_version':'unit protocol fixture','simulated':True},'payload':{'tracks':[{'local_track_id':cam+'-local','position':[.3,.8],'image_bbox':[.2,.2,.4,.8],'detection_confidence':.9}],'source_status':'connected','frame_sha256':str(index+1)*64,'frame_index':index,'media_time_seconds':float(index)}}
    self.assertEqual(self.post(msg).status_code,200);self.refs.append(msg['observation_id']);self.messages[cam]=msg
  self.tracks={e['camera_id']:k for k,e in self.world()['entities'].items()if e['kind']=='Track'}
 def tearDown(self):self.c.__exit__(None,None,None);main.DB_PATH=self.old;self.temp.cleanup()
 def login(self,user):r=self.c.post('/v1/office/auth/login',json={'username':user,'password':self.pw});self.assertEqual(r.status_code,200);return {'Authorization':'Bearer '+r.json()['token']}
 def post(self,msg,headers=None):return self.c.post(self.prefix+'/observations',headers=headers or self.h,json=msg)
 def world(self):r=self.c.get(self.prefix+'/world',headers=self.h);self.assertEqual(r.status_code,200);return r.json()
 def association(self):return {'observation_id':str(uuid4()),'site_id':'p2','source_id':'cam-a','observed_at':'2026-11-09T12:00:20Z','type':'edge.track_association','provenance':{'connector_id':'video-test','model_version':'unit-protocol-only','simulated':True},'payload':{'track_a':self.tracks['cam-a'],'track_b':self.tracks['cam-b'],'score':.85,'appearance_similarity':.9,'spatial_distance_native':.4,'simultaneous_samples':3,'evidence_observation_ids':self.refs,'method':'osnet-ain-appearance-time-calibration','model_sha256':'a'*64}}
 def test_trace_bbox_confidence_and_idempotent_frames(self):
  msg=self.messages['cam-a'];self.assertTrue(self.post(msg).json()['duplicate']);w=self.world();t=w['entities'][self.tracks['cam-a']];self.assertEqual(t['image_bbox'],[.2,.2,.4,.8]);self.assertEqual(t['detection_confidence'],.9);self.assertEqual(t['frame_sha256'],'3'*64);self.assertNotIn('presence',w['entities']['logical-person'])
 def test_cross_camera_relation_memories_dedup_and_restart(self):
  msg=self.association();self.assertEqual(self.post(msg).status_code,200);self.assertTrue(self.post(msg).json()['duplicate']);before=self.world();t=before['entities'][self.tracks['cam-a']];self.assertTrue(any(e['type']=='provisionallySameVisualSubject'for e in t['relations']));main.initialize();self.assertEqual(before,self.world())
  with main.database()as db:self.assertEqual(db.execute('SELECT COUNT(*) FROM memories').fetchone()[0],4)
 def test_role_authorization(self):
  self.assertEqual(self.post(self.association(),self.login('viewer')).status_code,403);self.assertEqual(self.post(self.association(),self.login('connector')).status_code,403)
 def test_reject_civil_identity_forged_refs_duplicates_and_bad_overlap(self):
  for mutate in [lambda p:p.update(track_b='logical-person'),lambda p:p.update(evidence_observation_ids=[str(uuid4()),str(uuid4())]),lambda p:p.update(simultaneous_samples=9),lambda p:p.update(evidence_observation_ids=self.refs+self.refs),lambda p:p.update(actor_id='simulator-forbidden')]:
   msg=self.association();mutate(msg['payload']);self.assertEqual(self.post(msg).status_code,422)
  with main.database()as db:self.assertEqual(db.execute('SELECT COUNT(*) FROM memories').fetchone()[0],2)
 def test_no_future_evidence_or_unordered_bbox(self):
  msg=self.association();msg['observed_at']='2026-11-09T12:00:01Z';self.assertEqual(self.post(msg).status_code,422);msg=copy.deepcopy(self.messages['cam-a']);msg['observation_id']=str(uuid4());msg['payload']['tracks'][0]['image_bbox']=[.4,.2,.2,.8];self.assertEqual(self.post(msg).status_code,422)

 def test_core_memory_is_local_despite_camera_video_binding(self):
  response=self.c.post(self.prefix+'/commands',headers=self.h,json={'id':str(uuid4()),'operation':'entity.remember','target':'cam-a','inputs':{'content':'Technical source memory, no device operation','source':'unit-protocol-test'}});self.assertEqual(response.status_code,200)
  with main.database()as db:self.assertEqual(db.execute('SELECT COUNT(*) FROM memories').fetchone()[0],3)
