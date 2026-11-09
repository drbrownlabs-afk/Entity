"""P1 persistent world/authorization contracts for the existing P2 scene; no renderer fixtures."""
import unittest,tempfile,json,subprocess,sys
from pathlib import Path
from uuid import uuid4
from fastapi.testclient import TestClient
from app import main
from app.office.service import site_create,upsert_resource,create_run
from app.office.auth import create_account
ROOT=Path(__file__).resolve().parents[3]
class P2CoreTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.old=main.DB_PATH;main.DB_PATH=Path(self.tmp.name)/'core.sqlite3';self.c=TestClient(main.app);self.c.__enter__();self.password='Temporary-test-only-password'
  config=Path(self.tmp.name)/'site.json';subprocess.run([sys.executable,str(ROOT/'scripts/spatial-simulation/prepare-core.py'),'--output',str(config),'--clock','2026-11-09T12:00:00Z'],check=True,capture_output=True);self.config=json.loads(config.read_text())
  with main.database(write=True)as db:
   site_create(db,'p2','P2 test only','UTC')
   for r in self.config['resources']:upsert_resource(db,'p2',r['id'],r['kind'],r['attributes'])
   create_account(db,'p2-admin',self.password,'p2','admin');create_account(db,'p2-viewer',self.password,'p2','viewer');create_run(db,'p2','onboarding','2026-11-09T12:00:00Z')
  self.h=self.login('p2-admin');self.root='/v1/sites/p2/runs/onboarding'
 def tearDown(self):self.c.__exit__(None,None,None);main.DB_PATH=self.old;self.tmp.cleanup()
 def login(self,u):r=self.c.post('/v1/office/auth/login',json={'username':u,'password':self.password});self.assertEqual(r.status_code,200);return {'Authorization':'Bearer '+r.json()['token']}
 def world(self):r=self.c.get(self.root+'/world',headers=self.h);self.assertEqual(r.status_code,200);return r.json()
 def command(self,op,target,inputs,cid=None,headers=None):return self.c.post(self.root+'/commands',headers=headers or self.h,json={'id':cid or str(uuid4()),'operation':op,'target':target,'inputs':inputs})
 def test_persistent_spatial_index_relations_and_logical_people(self):
  w=self.world();self.assertEqual(len(w['entities']),len(self.config['resources']))
  scene=json.loads((ROOT/'apps/spatial-simulation/public/model/scene.json').read_text());ids={r['id']for r in scene['records']}
  for key in ['A','B','C','D','E','D1','D2','D3','D4','D5','D6','E1','E5','E6','RECEPTION','CAFE','LOUNGE']:
   e=w['entities'][key];self.assertEqual(e['operational_state'],'unknown');self.assertTrue(e['relations']);self.assertTrue(set(e['spatial']['object_ids'])<=ids);self.assertNotIn('occupancy',e)
  self.assertTrue(w['entities']['E2']['spatial']['object_ids']);self.assertIsNone(w['entities']['PERSON-LOGICAL-01']['position']);main.initialize();self.assertEqual(w,self.world())
 def test_memory_is_atomic_idempotent_persistent_and_scoped(self):
  cid=str(uuid4());body={'content':'Explicit synthetic test note; no real operations','source':'test:P2'}
  a=self.command('entity.remember','D1',body,cid);self.assertEqual(a.status_code,200,a.text);self.assertEqual(a.json(),self.command('entity.remember','D1',body,cid).json())
  q=self.c.post(self.root+'/queries',headers=self.h,json={'kind':'memories','entity_id':'D1'});self.assertEqual(len(q.json()['result']),1);main.initialize();self.assertEqual(q.json()['result'],self.c.post(self.root+'/queries',headers=self.h,json={'kind':'memories','entity_id':'D1'}).json()['result'])
  h=self.login('p2-viewer');self.assertEqual(self.command('entity.remember','D1',body,headers=h).status_code,403);self.assertEqual(self.c.get('/v1/sites/other/runs/onboarding/world',headers=self.h).status_code,403)
  with main.database()as db:
   self.assertEqual(db.execute('SELECT COUNT(*) FROM memories').fetchone()[0],1);self.assertGreater(db.execute('SELECT COUNT(*) FROM relations').fetchone()[0],0)
 def test_metadata_updates_and_new_logical_person_use_existing_nucleo(self):
  r=self.command('entity.upsert','site',{'id':'TEST-PERSON','kind':'Person','attributes':{'name':'Synthetic logical identity','parent_resource':None,'registry_id':'site','position':None,'operational_state':'unknown'}});self.assertEqual(r.status_code,200,r.text);self.assertTrue(any(r['type']=='registeredIn'and r['target']=='site'for r in self.world()['entities']['TEST-PERSON']['relations']))
  self.assertEqual(self.command('entity.upsert','site',{'id':'D1','kind':'Desk','attributes':{'presence':'confirmed'}}).status_code,403)

 def test_catalog_upgrade_adds_memory_without_changing_world(self):
  before=self.world()
  with main.database(write=True)as db:
   db.execute('DELETE FROM office_schema WHERE version=5');db.execute("DELETE FROM office_capabilities WHERE operation='entity.remember'")
  main.initialize();self.assertEqual(before,self.world())
  self.assertEqual(self.command('entity.remember','A',{'content':'Catalog upgrade test','source':'test-only'}).status_code,200)
 def test_rejected_event_rolls_back_memory_in_same_transaction(self):
  with main.database(write=True)as db:db.execute("CREATE TRIGGER reject_memory_event BEFORE INSERT ON events BEGIN SELECT RAISE(ABORT,'test-only failure'); END")
  r=self.command('entity.remember','A',{'content':'Must roll back','source':'test-only'});self.assertEqual(r.status_code,409)
  with main.database()as db:self.assertEqual(db.execute('SELECT COUNT(*) FROM memories').fetchone()[0],0)
