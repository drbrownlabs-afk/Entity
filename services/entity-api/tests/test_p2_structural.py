"""Latest narrowed P2-08 addendum: structural identity/integrity/persistence only."""
import unittest,json,tempfile,subprocess,sys
from pathlib import Path
from app import main
from app.office.service import site_create,upsert_resource,create_run,command
from app.office.auth import ROLES
ROOT=Path(__file__).resolve().parents[3]
class StructuralTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.old=main.DB_PATH;main.DB_PATH=Path(self.tmp.name)/'core.sqlite3';main.initialize();path=Path(self.tmp.name)/'config.json';subprocess.run([sys.executable,str(ROOT/'scripts/spatial-simulation/prepare-core.py'),'--output',str(path),'--clock','2026-11-09T12:00:00Z'],check=True,capture_output=True);self.cfg=json.loads(path.read_text());self.actor={'actor':'structural-test','role':'admin','site':'p2','person':None,'permissions':ROLES['admin'],'grants':[]}
  with main.database(write=True)as db:
   site_create(db,'p2','Coworking structural test','UTC')
   for r in self.cfg['resources']:upsert_resource(db,'p2',r['id'],r['kind'],r['attributes'])
   create_run(db,'p2','structure','2026-11-09T12:00:00Z')
   for edge in self.cfg['structural_relations']:command(db,'p2','structure',self.actor,{'id':__import__('uuid').uuid4().hex,'operation':'relation.add','target':'site','inputs':edge})
 def tearDown(self):main.DB_PATH=self.old;self.tmp.cleanup()
 def read(self):
  from app.office.storage import world
  with main.database()as db:return world(db,'p2','structure')
 def test_identity_hierarchy_and_catalog_policies(self):
  items=self.read()['entities'];self.assertEqual(len(items),len(self.cfg['resources']));self.assertEqual(items['site']['space_type'],'Coworking');self.assertEqual(items['site']['operational_state'],'unknown');self.assertTrue(items['site']['space_root']);self.assertFalse(items['site']['world_model_root']);self.assertEqual(len({e['core_id']for e in items.values()}),len(self.cfg['resources']))
  for k in ['A','B']:self.assertTrue(items[k]['private']);self.assertTrue(items[k]['reservable']);self.assertEqual(items[k]['booking_mode'],'whole-environment')
  self.assertFalse(items['C']['public']);self.assertFalse(items['C']['reservable']);self.assertEqual(items['C']['functional_use'],'staff')
  self.assertEqual(items['E']['planned_unindexed_catalog_ids'],['E2','E3','E4'])
  for k in ['D1','D2','D3','D4','D5','D6','E1','E5','E6']:
   self.assertTrue(items[k]['reservable']);self.assertTrue(any(e['type']=='partOf'and e['target']==k[0]for e in items[k]['relations']))
 def test_spatial_integrity_and_verified_connections_only(self):
  items=self.read()['entities'];scene=json.loads((ROOT/'apps/spatial-simulation/public/model/scene.json').read_text());ids={r['id']for r in scene['records']}
  for e in items.values():
   for edge in e.get('relations',[]):self.assertIn(edge['target'],items);self.assertNotEqual(e['id'],edge['target'])
   if e.get('spatial'):self.assertTrue(set(e['spatial']['object_ids'])<=ids);self.assertEqual(len(e['spatial']['position']),3)
  explicit=[e for r in items.values()for e in r.get('relations',[])if e['type']in ['connectedTo','adjacentTo']];self.assertEqual(len(explicit),14)
  for e in explicit:self.assertTrue(e['id']);self.assertTrue(e['provenance']);self.assertTrue(e['valid_from']);self.assertIsNone(e['valid_to'])
  people=[e for e in items.values()if e['kind']=='Person'];self.assertEqual(len(people),12)
  self.assertEqual({e['roles'][0]for e in people},{'visitor','member','staff','host'})
  for e in people:self.assertIsNone(e['position']);self.assertIsNone(e['avatar_id']);self.assertNotIn('presence',e);self.assertFalse(e['real_person_verified']);self.assertTrue(any(r['type']=='registeredIn'and r['target']=='site'for r in e['relations']));self.assertFalse(any(r['type']=='partOf'and not r.get('valid_to')for r in e['relations']))
 def test_persistence_and_no_operational_facts(self):
  before=self.read();main.initialize();self.assertEqual(before,self.read())
  with main.database()as db:
   self.assertEqual(db.execute("SELECT COUNT(*) FROM office_resources WHERE kind IN ('Booking','Track','Camera','Stream','Visit')").fetchone()[0],0)
   self.assertEqual(db.execute("SELECT COUNT(*) FROM office_events WHERE type NOT IN ('run.created','relation.add')").fetchone()[0],0)
   self.assertGreater(db.execute('SELECT COUNT(*) FROM relations').fetchone()[0],40)
 def test_metadata_reconciliation_preserves_prior_fields_and_identity(self):
  before=self.read()['entities']['D1']
  with main.database(write=True)as db:command(db,'p2','structure',self.actor,{'id':__import__('uuid').uuid4().hex,'operation':'entity.upsert','target':'site','inputs':{'id':'D1','kind':'Desk','attributes':{'structural_review':'verified-test'}}})
  after=self.read()['entities']['D1'];self.assertEqual(before['core_id'],after['core_id']);self.assertEqual(before['spatial'],after['spatial']);self.assertEqual(after['structural_review'],'verified-test')

 def test_preexisting_unindexed_catalog_entry_is_not_withdrawn(self):
  with main.database(write=True)as db:
   command(db,'p2','structure',self.actor,{'id':__import__('uuid').uuid4().hex,'operation':'entity.upsert','target':'site','inputs':{'id':'E2','kind':'Desk','attributes':{'parent_resource':'E','reservable':True,'provenance':'structural-test-existing-catalog; no position claimed'}}})
  original=self.read()['entities']['E2']
  with main.database(write=True)as db:
   for resource in self.cfg['resources']:
    command(db,'p2','structure',self.actor,{'id':__import__('uuid').uuid4().hex,'operation':'entity.upsert','target':'site','inputs':resource})
  after=self.read()['entities']['E2'];self.assertEqual(original,after);self.assertTrue(after['reservable']);self.assertNotIn('deprecated',after)

 def test_person_registration_is_not_permanent_physical_containment(self):
  from app.office.graph import derive,active
  item={'id':'test-person','parent_resource':None,'registry_id':'site','relations':[{'type':'partOf','field':'parent_resource','target':'site','valid_from':'2026-11-08T00:00:00+00:00','valid_to':None}]}
  links=derive(item,'2026-11-09T12:00:00+00:00');self.assertFalse(any(r['type']=='partOf'and active(r,'2026-11-09T12:00:00+00:00')for r in links));self.assertTrue(any(r['type']=='registeredIn'and active(r,'2026-11-09T12:00:00+00:00')for r in links))

 def test_twelve_person_population_organizations_and_declared_scenarios(self):
  from collections import Counter
  items=self.read()['entities'];people=[e for e in items.values()if e['kind']=='Person'];self.assertEqual(Counter(e['population_group']for e in people),{'staff':3,'entity':2,'inmerso':2,'regulars':3,'visitors':2})
  self.assertEqual(items['PERSON-LOGICAL-04']['name'],'Carlos');self.assertEqual(items['PERSON-LOGICAL-07']['name'],'Santiago')
  for room,organization in [('A','ORG-ENTITY'),('B','ORG-INMERSO')]:
   self.assertEqual(items[organization]['kind'],'Organization');self.assertTrue(any(r['type']=='assignedTo'and r['target']==organization for r in items[room]['relations']));self.assertNotIn('occupancy',items[room])
  for person in people:self.assertIsNone(person['position']);self.assertIsNone(person['avatar_id']);self.assertNotIn('presence',person)
  self.assertFalse(items['PAYMENT-MONTHLY']['confirmed']);self.assertFalse(items['RENEWAL-MONTHLY']['paid']);self.assertFalse(items['INVOICE-MONTHLY']['issued']);self.assertFalse(items['INVOICE-MONTHLY']['sri_submitted'])
  self.assertIsNone(items['MEMBERSHIP-MONTHLY-RENEWAL-PLAN']['valid_from']);self.assertEqual(items['HOUR-PASS-01']['consumed_hours'],0)
  self.assertEqual(items['MEETING-VISITOR-PLAN']['resource_id'],'MEETING-AREA-01');self.assertIsNone(items['VISIT-MEETING-PLAN']['arrival_event']);self.assertFalse(items['VISIT-COMMERCIAL-PLAN']['membership_created'])
