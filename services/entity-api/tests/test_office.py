"""Backend-only transactional tests. Test resources are not a replacement Synthetic Office scene."""
import json,sqlite3,tempfile,unittest
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from uuid import uuid4
from fastapi.testclient import TestClient
from app import main
from app.office.storage import initialize,encode,identity
from app.office.service import site_create,upsert_resource
from app.office.auth import create_account
from app.nucleo.capabilities import CapabilityDescriptor,SimulatedAdapter,RestTestAdapter,execute
import httpx

PASSWORD='office-unit-only-password'

class OfficeTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.old=main.DB_PATH;main.DB_PATH=Path(self.tmp.name)/'office.sqlite3'
        self.client=TestClient(main.app).__enter__()
        with main.database(write=True) as db:
            site_create(db,'office','Backend test only');site_create(db,'other','Other isolated site')
            for key,kind,attrs in [('waiting','WaitingArea',{'capacity':4}),('room','Room',{'capacity':6,'zone_id':'zone'}),('desk','Desk',{'capacity':1,'zone_id':'zone'}),('zone','Zone',{}),('other-zone','Zone',{}),('hvac','HVAC',{'zone_id':'zone','status':'operational'}),('camera','Camera',{'covered_zones':['waiting','room','zone'],'connectivity':'connected'}),('sensor','Sensor',{'zone_id':'zone'}),('door','AccessPoint',{'zone_id':'room'})]:
                upsert_resource(db,'office',key,kind,attrs)
            for key in ['luis','carlos','sofia','technician']:
                upsert_resource(db,'office',key,'Person',{'name':key.title(),'roles':['staff'] if key in ['sofia','technician'] else ['member'],'membership_status':'active','membership_until':'2027-01-01T00:00:00+00:00'})
            for username,role,person in [('admin','admin',None),('sofia','reception','sofia'),('luis','member','luis'),('technician','maintenance','technician'),('connector','connector','camera')]:create_account(db,username,PASSWORD,'office',role,person)
            for username in ['sofia']:
                for permission in ['read','write']:db.execute('INSERT INTO office_grants VALUES(?,?,?,?)',('office',username,'site',permission))
            create_account(db,'outsider',PASSWORD,'other','admin')
            for source in ['camera','sensor']:
                db.execute('INSERT INTO office_bindings VALUES(?,?,?,?,?)',('office',source,'simulated','1.0','{}'))
        self.headers=self.auth('admin')
        r=self.client.post('/v1/sites/office/runs',headers=self.headers,json={'id':'day','clock':'2026-11-07T15:45:00-05:00'});self.assertEqual(r.status_code,201,r.text)
        self.root='/v1/sites/office/runs/day'
    def tearDown(self):
        self.client.__exit__(None,None,None);main.DB_PATH=self.old;self.tmp.cleanup()
    def auth(self,user):
        r=self.client.post('/v1/office/auth/login',json={'username':user,'password':PASSWORD});self.assertEqual(r.status_code,200,r.text)
        return {'Authorization':'Bearer '+r.json()['token']}
    def cmd(self,operation,target='site',inputs=None,headers=None,code=200,**extra):
        r=self.client.post(self.root+'/commands',headers=headers or self.headers,json={'id':str(uuid4()),'operation':operation,'target':target,'inputs':inputs or {},**extra});self.assertEqual(r.status_code,code,r.text);return r.json()
    def state(self,branch='main',at=None):
        r=self.client.get(self.root+'/world',headers=self.headers,params={'branch':branch,**({'at':at} if at else {})});self.assertEqual(r.status_code,200,r.text);return r.json()
    def advance(self,to):return self.cmd('clock.advance',inputs={'to':to})
    def obs(self,tracks=None,source='camera',at=None,headers=None,code=200,**extra):
        body={'observation_id':str(uuid4()),'site_id':'office','source_id':source,'observed_at':at or self.state()['clock'],'type':'edge.presence' if source=='camera' else 'sensor.measurement','payload':{'tracks':tracks or [],'source_status':'connected','transitions':[]} if source=='camera' else {'name':'temperature','value':77,'unit':'F'},'provenance':{'connector_id':'simulated','model_version':'unit-test','simulated':True},**extra}
        r=self.client.post(self.root+'/observations',headers=headers or self.headers,json=body);self.assertEqual(r.status_code,code,r.text);return r.json(),body
    def booking(self,key='booking',person='carlos',resource='room',**extra):
        return self.cmd('booking.create',resource,{'booking_id':key,'person_id':person,'starts_at':'2026-11-07T16:00:00-05:00','ends_at':'2026-11-07T17:00:00-05:00','party_size':4,**extra})
    def test_site_and_legacy_access_fail_closed(self):
        self.assertEqual(self.client.get(self.root+'/world').status_code,401)
        self.assertEqual(self.client.get(self.root+'/world',headers=self.auth('outsider')).status_code,403)
        self.assertEqual(self.client.get('/v1/entities').status_code,401)
        self.assertEqual(self.client.get('/v1/entities',headers=self.auth('luis')).status_code,403)
        self.cmd('membership.set','luis',{'status':'suspended','until':'2027-01-01T00:00:00Z'},headers=self.auth('luis'),code=403)
    def test_booking_concurrency_and_ownership(self):
        headers=self.headers
        def create(i):return self.client.post(self.root+'/commands',headers=headers,json={'id':str(uuid4()),'operation':'booking.create','target':'room','inputs':{'booking_id':f'b{i}','person_id':'luis','starts_at':'2026-11-07T21:00:00Z','ends_at':'2026-11-07T22:00:00Z'}}).status_code
        with ThreadPoolExecutor(max_workers=4) as pool:codes=list(pool.map(create,range(4)))
        self.assertEqual(codes.count(200),1);self.assertEqual(codes.count(409),3)
        self.cmd('booking.create','desk',{'booking_id':'stolen','person_id':'carlos','starts_at':'2026-11-07T21:00:00Z','ends_at':'2026-11-07T22:00:00Z'},headers=self.auth('luis'),code=403)
    def test_idempotency_and_conflict(self):
        body={'id':str(uuid4()),'operation':'zone.close','target':'zone','inputs':{}}
        a=self.client.post(self.root+'/commands',headers=self.headers,json=body).json();b=self.client.post(self.root+'/commands',headers=self.headers,json=body).json();self.assertEqual(a,b)
        body['operation']='zone.open';self.assertEqual(self.client.post(self.root+'/commands',headers=self.headers,json=body).status_code,409)
    def test_sensor_projection_and_duplicate(self):
        result,body=self.obs(source='sensor');self.assertEqual(self.state()['entities']['zone']['environment']['temperature']['value'],25)
        self.assertTrue(self.client.post(self.root+'/observations',headers=self.headers,json=body).json()['duplicate'])
        self.assertEqual(self.state()['revision'],result['event']['sequence'])
    def test_future_late_and_camera_disconnect(self):
        self.obs(at='2099-01-01T00:00:00Z',code=422)
        self.obs([{'local_track_id':'a','zone_id':'zone','position':[.2,.7]}]);self.advance('2026-11-07T15:46:00-05:00')
        self.obs([]);late,_=self.obs([{'local_track_id':'a','zone_id':'zone','position':[.2,.7]}],at='2026-11-07T15:45:00-05:00')
        self.assertTrue(late['late']);self.assertEqual(self.state()['entities']['zone']['occupancy'],0)
        self.cmd('camera.setStatus','camera',{'status':'disconnected'});self.obs(code=503)
        self.cmd('camera.setStatus','camera',{'status':'connected'});self.obs()
    def test_anonymous_and_identity_expiry(self):
        self.obs([{'local_track_id':'a','zone_id':'waiting','position':[.2,.7]}]);track=self.state()['entities']['camera']['tracks'][0]
        self.assertNotIn('person_id',self.state()['entities'][track])
        self.cmd('identity.associate',track,{'person_id':'luis','credential_verified':False,'evidence_type':'badge-checkin'},code=403)
        self.cmd('identity.associate',track,{'person_id':'luis','credential_verified':True,'evidence_type':'badge-checkin'})
        answer=self.client.post(self.root+'/queries',headers=self.headers,json={'kind':'location','entity_id':'luis'}).json();self.assertEqual(answer['result']['status'],'confirmed')
        self.advance('2026-11-07T15:47:00-05:00');answer=self.client.post(self.root+'/queries',headers=self.headers,json={'kind':'location','entity_id':'luis'}).json();self.assertEqual(answer['result']['status'],'unknown')
    def test_visitors_wait_for_host_and_meeting_occupancy(self):
        self.booking(meeting_id='meeting',expected_guests=[{'id':'guest-1'},{'id':'guest-2'},{'id':'guest-3'}])
        self.obs([{'local_track_id':f'anon-{i}','zone_id':'waiting','position':[.2+i*.1,.7]} for i in range(3)])
        tracks=self.state()['entities']['camera']['tracks']
        reception=self.auth('sofia')
        for i,track in enumerate(tracks):
            self.cmd('visit.register',inputs={'visit_id':f'visit-{i}','meeting_id':'meeting','track_id':track,'statement':'Meeting with Carlos'},headers=reception)
            self.cmd('visit.checkin',f'visit-{i}',{'waiting_area':'waiting'},headers=reception)
        denied=self.cmd('access.requestEntry','door',{'visit_id':'visit-0','escorted':True},headers=reception);self.assertEqual(denied['status'],'denied')
        self.advance('2026-11-07T15:55:00-05:00');self.obs([{'local_track_id':'host','zone_id':'waiting','position':[.2,.7]}])
        hosttrack=self.state()['entities']['camera']['tracks'][0]
        self.cmd('identity.associate',hosttrack,{'person_id':'carlos','credential_verified':True,'evidence_type':'badge-checkin'},headers=reception)
        self.cmd('notification.send','carlos',{'message':'Three visitors waiting'},headers=reception)
        for i in range(3):self.assertEqual(self.cmd('access.requestEntry','door',{'visit_id':f'visit-{i}','escorted':True},headers=reception)['status'],'verified')
        self.advance('2026-11-07T16:00:00-05:00');self.cmd('meeting.start','meeting',{},headers=reception,code=409)
        self.obs([{'local_track_id':'host','zone_id':'room','position':[.2,.7]}])
        self.cmd('meeting.start','meeting',{'participants':['carlos','visit-0','visit-1','visit-2']},headers=reception)
        self.assertEqual(self.state()['entities']['meeting']['status'],'in_progress')
        self.advance('2026-11-07T17:00:00-05:00');self.cmd('meeting.end','meeting',{},headers=reception)
        self.assertEqual(self.state()['entities']['visit-0']['access'],'revoked')
    def test_hvac_task_and_history(self):
        self.booking();result=self.cmd('equipment.fail','hvac')
        self.assertIn('booking',result['details']['affected']);self.assertNotIn('other-zone',result['details']['affected'])
        task=next(k for k,v in self.state()['entities'].items() if v['kind']=='Task')
        self.cmd('task.assign',task,{'person_id':'technician'});self.cmd('task.resolve',task,{'resolution':'Replaced filter'},headers=self.auth('technician'))
        self.advance('2026-11-07T16:00:00-05:00');self.cmd('equipment.repair','hvac')
        old=self.state(at='2026-11-07T15:45:00-05:00');self.assertEqual(old['entities']['hvac']['status'],'failed')
        current=self.state();main.initialize();self.assertEqual(current,self.state())
        with main.database(write=True) as db:
            with self.assertRaises(sqlite3.IntegrityError):db.execute('DELETE FROM office_events')
    def test_scenario_isolation_and_apply_revalidation(self):
        before=self.state();r=self.client.post(self.root+'/scenarios',headers=self.headers,json={'id':'what-if','expected_revision':before['revision']});self.assertEqual(r.status_code,201,r.text)
        self.cmd('equipment.fail','hvac',branch='what-if');self.assertEqual(self.state(),before)
        with main.database() as db:self.assertEqual(db.execute("SELECT COUNT(*) FROM office_resources WHERE kind='Incident'").fetchone()[0],0)
        self.assertEqual(self.state('what-if')['entities']['hvac']['status'],'failed')
        r=self.client.post(self.root+'/scenarios/what-if/apply',headers=self.headers,json={'id':str(uuid4())});self.assertEqual(r.status_code,200,r.text)
        self.assertEqual(self.state()['entities']['hvac']['status'],'failed')
        before=self.state();self.client.post(self.root+'/scenarios',headers=self.headers,json={'id':'stale','expected_revision':before['revision']})
        self.cmd('zone.close','zone');r=self.client.post(self.root+'/scenarios/stale/apply',headers=self.headers,json={'id':str(uuid4())});self.assertEqual(r.status_code,409)
    def test_normalized_adapters_and_timeout(self):
        descriptor=CapabilityDescriptor(capability_id='test',canonical_id='sensor.read',resource_id='sensor',category='environment',modality='read',input_schema={'type':'object'},output_schema={'type':'object'},semantics='temperature',permission='observe',provenance={'source':'unit'})
        virtual=execute(descriptor,{'name':'temperature','value':25,'unit':'C'},'same',SimulatedAdapter())
        transport=httpx.MockTransport(lambda req:httpx.Response(200,json={'confirmed':True,'value':{'name':'temperature','value':77,'unit':'F'}}))
        fixture=execute(descriptor,{},'same',RestTestAdapter('http://test-service',transport))
        self.assertEqual(virtual['value'],fixture['value'])
        self.assertEqual(execute(descriptor,{'_behavior':'timeout'},'t',SimulatedAdapter())['status'],'timed_out')

    def test_adapter_failure_rolls_back_domain_and_is_idempotent(self):
        with main.database(write=True) as db:
            db.execute('INSERT INTO office_bindings VALUES(?,?,?,?,?)',('office','site','simulated','1.0',json.dumps({'behavior':'timeout'})))
        before=self.state()
        result=self.cmd('task.create',inputs={'task_id':'never-created','resource_id':'hvac','description':'Failure test'})
        self.assertEqual(result['status'],'timed_out')
        self.assertNotIn('never-created',self.state()['entities'])
        with main.database() as db:
            self.assertFalse(db.execute("SELECT 1 FROM office_resources WHERE site='office' AND id='never-created'").fetchone())
        self.assertEqual(self.state()['entities'],before['entities'])
    def test_connector_scope_and_schema_validation(self):
        connector=self.auth('connector')
        self.obs(source='sensor',headers=connector,code=403)
        self.cmd('booking.create','room',{'booking_id':'bad'},code=422)
        self.cmd('clock.advance',inputs={'to':'2026-11-07T16:00:00-05:00'},capability_version='2.0',code=409)
    def test_cancelled_meeting_and_duplicate_visit_checkin(self):
        self.booking(meeting_id='meeting')
        self.obs([{'local_track_id':'anon','zone_id':'waiting','position':[.2,.7]}])
        track=self.state()['entities']['camera']['tracks'][0]
        self.cmd('visit.register',inputs={'visit_id':'visit','meeting_id':'meeting','track_id':track})
        self.cmd('visit.checkin','visit',{'waiting_area':'waiting'})
        self.cmd('visit.checkin','visit',{'waiting_area':'waiting'},code=409)
        self.cmd('booking.cancel','booking')
        self.cmd('visit.register',inputs={'visit_id':'other-visit','meeting_id':'meeting','track_id':track},code=409)

    def test_no_show_and_extension_conflicts(self):
        self.booking()
        self.cmd('booking.no_show','booking',code=409)
        self.advance('2026-11-07T16:15:00-05:00')
        self.cmd('booking.no_show','booking')
        self.assertEqual(self.state()['entities']['booking']['status'],'no_show')
        self.cmd('booking.create','room',{'booking_id':'new','person_id':'luis','starts_at':'2026-11-07T16:15:00-05:00','ends_at':'2026-11-07T17:00:00-05:00'})
        self.cmd('booking.create','room',{'booking_id':'next','person_id':'luis','starts_at':'2026-11-07T17:00:00-05:00','ends_at':'2026-11-07T18:00:00-05:00'})
        self.cmd('booking.extend','new',{'ends_at':'2026-11-07T17:30:00-05:00'},code=409)
