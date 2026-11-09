"""8.4 model-only verification: no sensors, physical actions, business flows or integrations."""
import unittest,json,tempfile,subprocess,sys,collections
from pathlib import Path
from app import main
from app.office.service import site_create,upsert_resource,create_run,command
from app.office.auth import ROLES
from app.office.storage import world
ROOT=Path(__file__).resolve().parents[3]
class InfrastructureTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.tmp=tempfile.TemporaryDirectory();path=Path(cls.tmp.name)/'config.json';subprocess.run([sys.executable,str(ROOT/'scripts/spatial-simulation/prepare-core.py'),'--output',str(path),'--clock','2026-11-09T12:00:00Z'],check=True,capture_output=True);cls.cfg=json.loads(path.read_text());cls.scene=json.loads((ROOT/'apps/spatial-simulation/public/model/scene.json').read_text())
 @classmethod
 def tearDownClass(cls):cls.tmp.cleanup()
 def setUp(self):
  self.old=main.DB_PATH;main.DB_PATH=Path(self.tmp.name)/(self._testMethodName+'.sqlite3');main.initialize();self.actor={'actor':'structural-test','role':'admin','site':'p2','person':None,'permissions':ROLES['admin'],'grants':[]}
  with main.database(write=True)as db:
   site_create(db,'p2','Infrastructure model test','UTC')
   for r in self.cfg['resources']:upsert_resource(db,'p2',r['id'],r['kind'],r['attributes'])
   create_run(db,'p2','structure','2026-11-09T12:00:00Z')
   for e in self.cfg['structural_relations']:command(db,'p2','structure',self.actor,{'id':__import__('uuid').uuid4().hex,'operation':'relation.add','target':'site','inputs':e})
 def tearDown(self):main.DB_PATH=self.old
 def read(self):
  with main.database()as db:return world(db,'p2','structure')
 def test_eight_planned_cameras_have_no_feeds_or_coverage(self):
  items=self.read()['entities'];cams=[r for r in items.values()if r['kind']=='Camera'];self.assertEqual(len(cams),8)
  for c in cams:self.assertEqual(c['model_status'],'previsto');self.assertIsNone(c['position']);self.assertIsNone(c['spatial']);self.assertIsNone(c['fov']);self.assertEqual(c['covered_zones'],[]);self.assertEqual(c['frames_produced'],0);self.assertIsNone(c['feed_url'])
  with main.database()as db:
   for row in db.execute("SELECT descriptor FROM office_capabilities WHERE resource LIKE 'CAMERA-PLANNED-%'"):
    d=json.loads(row[0]);self.assertEqual(d['availability'],'available'if d['canonical_id']in ['entity.remember','resource.getObject']else'unavailable')
   self.assertEqual(db.execute('SELECT COUNT(*) FROM office_bindings').fetchone()[0],0)
   legacy=json.loads(db.execute("SELECT descriptor FROM office_capabilities WHERE resource='KIOSK-01' AND operation='reception.interact'").fetchone()[0]);self.assertEqual(legacy['availability'],'available')
 def test_distinct_scene_assets_and_correct_D3_not_C3(self):
  items=self.read()['entities'];counts=collections.Counter(e.get('item_class')for e in items.values());self.assertEqual(counts['Computer'],30);self.assertEqual(counts['Luminaire'],71);self.assertEqual(counts['Television'],6);self.assertEqual(counts['Locker'],8)
  self.assertEqual(items['COMPUTER-D3']['parent_resource'],'D3');self.assertEqual(items['COMPUTER-D3']['spatial']['scene_environment_id'],'D');self.assertNotIn('C3',items)
  self.assertTrue(all(r.startswith('sim:p1:D:computer:3:')for r in items['COMPUTER-D3']['spatial']['object_ids']))
  self.assertEqual(len([e for e in items.values()if e.get('item_class')=='Door'and e['model_status']=='existente_verificado']),19)
  self.assertEqual(len([e for e in items.values()if e['kind']=='Desk'and e.get('public')]),12)
  for key in ['E2','E3','E4']:self.assertEqual(items[key]['parent_resource'],'E');self.assertTrue(items[key]['spatial']['object_ids'])
 def test_referential_integrity_no_duplicate_physical_groups_and_optional_spatial(self):
  items=self.read()['entities'];ids={r['id']for r in self.scene['records']};lights={r['id']for r in self.scene['devices']['luminaires']};keys=set();assets=set()
  for key,e in items.items():
   self.assertNotIn(e['core_id'],keys);keys.add(e['core_id'])
   for edge in e.get('relations',[]):self.assertIn(edge['target'],items);self.assertNotEqual(key,edge['target'])
   s=e.get('spatial')
   if s:
    self.assertTrue(set(s['object_ids'])<=ids);self.assertEqual(len(s['position']),3)
    if s.get('runtime_light_id'):self.assertIn(s['runtime_light_id'],lights)
    if e.get('item_class')and s['object_ids']:
     signature=(e['item_class'],tuple(sorted(s['object_ids'])));self.assertNotIn(signature,assets);assets.add(signature)
  self.assertIsNone(items['ENTRANCE-MAIN']['spatial']);self.assertEqual(items['ENTRANCE-MAIN']['model_status'],'pendiente_identificar')
 def test_catalogue_unknown_cardinality_and_business_is_not_executed(self):
  items=self.read()['entities'];cats=[e for e in items.values()if e['kind']=='CatalogEntry'];self.assertGreater(len(cats),90)
  self.assertEqual({e['catalog_category']for e in cats},{'security','environment','network','hr','crm','commercial','finance','documents','attention'})
  for e in cats:self.assertIsNone(e['quantity']);self.assertIsNone(e['known_instance_count']);self.assertEqual(e['model_status'],'previsto');self.assertTrue(e['no_executed_records']);self.assertTrue(all(v is None for v in e['data_fields'].values()))
  
  for key in ['ENTRANCE-MAIN','ACCESS-A','ACCESS-B','ACCESS-C']:
   for cls in ['BIOMETRICREADER','ACCESSCONTROLLER','DOORLOCK','DOORSENSOR','ACCESSPOLICY','CREDENTIALTYPE']:self.assertTrue(any(e['target']=='CAT-'+cls for e in items[key]['relations']))
  self.assertIsNone(items['ORG-OPERATOR-UNIDENTIFIED']['legal_name']);self.assertIsNone(items['ORG-OPERATOR-UNIDENTIFIED']['tax_id']);self.assertEqual(len([e for e in items.values()if e['kind']=='Person']),12)
  for e in items.values():
   if e['kind']=='Service':self.assertEqual(e['integration_status'],'not_connected');self.assertIsNone(e['provider_id'])
  with main.database()as db:self.assertEqual(db.execute("SELECT COUNT(*) FROM office_events WHERE type NOT IN ('run.created','relation.add')").fetchone()[0],0)
 def test_persistence_and_additive_multisite_scaling_without_schema_changes(self):
  before=self.read();main.initialize();self.assertEqual(before,self.read())
  with main.database(write=True)as db:
   site_create(db,'second','Second test site','UTC')
   for n in range(51):upsert_resource(db,'second','P-'+str(n),'Person',{'name':'synthetic scaling test','position':None,'registry_id':'site'})
   create_run(db,'second','structure','2026-11-09T12:00:00Z');second=world(db,'second','structure');self.assertEqual(len(second['entities']),52)
   self.assertNotEqual(second['entities']['site']['core_id'],before['entities']['site']['core_id']);self.assertEqual(db.execute('SELECT MAX(version) FROM office_schema').fetchone()[0],5)
  self.assertEqual(before,self.read())
