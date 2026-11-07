"""Executable acceptance checks over the original-office domain configuration."""
import json,unittest
from pathlib import Path
from uuid import uuid4
import test_office as base
from app import main
from app.office.provision import provision
from app.office.interactions import issue_credential
from app.office.service import upsert_resource
from app.office.auth import create_account
from app.office.storage import encode
from test_office import PASSWORD

ORIGINAL=json.loads((Path(__file__).resolve().parents[3]/'worlds/synthetic-office/original-viewer-settings.json').read_text())

class DeliveryTests(unittest.TestCase):
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    cmd=base.OfficeTests.cmd
    state=base.OfficeTests.state
    advance=base.OfficeTests.advance
    obs=base.OfficeTests.obs
    booking=base.OfficeTests.booking
    def setUp(self):
        base.OfficeTests.setUp(self)
        with main.database(write=True) as db:
            provision(db,'office',ORIGINAL,'2026-11-07T08:00:00-05:00')
            create_account(db,'kiosk',PASSWORD,'office','kiosk','KIOSK-01')
            create_account(db,'carlos-host',PASSWORD,'office','member','PERSON-CARLOS')
            upsert_resource(db,'office','PERSON-DANIEL','Person',{'name':'Daniel','profile_level':'visitor','fictitious':True})
        # Include newly introduced visitor resource without resetting existing run.
        self.cmd('entity.upsert',inputs={'id':'PERSON-DANIEL','kind':'Person','attributes':{'name':'Daniel','profile_level':'visitor','fictitious':True}})
    def test_exact_commercial_inventory_and_graph(self):
        items=self.state()['entities']
        self.assertEqual(sorted(x['id'] for x in items.values() if x['kind']=='Desk' and x.get('commercial') and x.get('reservable')),[f'{g}{i}' for g in 'DE' for i in range(1,7)])
        for key in ['A','B']:
            self.assertEqual(items[key]['kind'],'Office');self.assertEqual(items[key]['capacity'],6)
        self.assertFalse(items['C']['reservable'])
        self.assertIsNone(items['D1']['position']);self.assertIsNone(items['C']['position'])
        self.booking('internal',person='PERSON-CARLOS',resource='A')
        self.cmd('booking.create','B',{'booking_id':'wrong','person_id':'PERSON-CARLOS','starts_at':'2026-11-07T21:00:00Z','ends_at':'2026-11-07T22:00:00Z'},code=403)
        for key in ['C','A-INTERNAL-1','C-INTERNAL-1']:
            self.cmd('booking.create',key,{'booking_id':'no-'+key,'person_id':'PERSON-CARLOS','starts_at':'2026-11-07T21:00:00Z','ends_at':'2026-11-07T22:00:00Z'},code=403)
        answer=self.client.post(self.root+'/queries',headers=self.headers,json={'kind':'graph','entity_id':'PERSON-CARLOS'}).json()
        self.assertTrue(any(e['type']=='belongsTo' and e['target']=='ORG-ENTITY' for e in answer['result']['edges']))
        with main.database() as db:self.assertGreater(db.execute('SELECT COUNT(*) FROM relations').fetchone()[0],0)
    def setup_reception(self,fresh=True):
        self.cmd('booking.create','MEETING-AREA-01',{'booking_id':'B-1600','person_id':'PERSON-CARLOS','starts_at':'2026-11-07T16:00:00-05:00','ends_at':'2026-11-07T17:00:00-05:00','party_size':2,'meeting_id':'M-1600','expected_guests':[{'id':'I-DANIEL','name':'Daniel'}]})
        with main.database(write=True) as db:issue_credential(db,'office','I-DANIEL','PERSON-DANIEL','authorized-test-code','2026-11-07T18:00:00-05:00')
        self.advance('2026-11-07T15:50:00-05:00')
        if fresh:
            # A typed, authorized badge check-in supplies identity; visual tracks are anonymous.
            self.cmd('entity.upsert',inputs={'id':'camera-a','kind':'Camera','attributes':{'covered_zones':['annotation-0'],'connectivity':'connected'}})
            with main.database(write=True) as db:db.execute('INSERT INTO office_bindings VALUES(?,?,?,?,?)',('office','camera-a','simulated','1.0','{}'))
            body={'observation_id':str(uuid4()),'site_id':'office','source_id':'camera-a','observed_at':self.state()['clock'],'type':'edge.presence','payload':{'source_status':'connected','tracks':[{'local_track_id':'host','position':[.4,.5],'zone_id':'annotation-0'}],'transitions':[]},'provenance':{'connector_id':'simulated','model_version':'synthetic-test','simulated':True}}
            r=self.client.post(self.root+'/observations',headers=self.headers,json=body);self.assertEqual(r.status_code,200,r.text)
            track=self.state()['entities']['camera-a']['tracks'][0]
            self.cmd('identity.associate',track,{'person_id':'PERSON-CARLOS','credential_verified':True,'evidence_type':'badge-checkin'})
        self.kiosk=self.auth('kiosk');self.conversation='conversation-'+str(uuid4())
        self.cmd('reception.interact','KIOSK-01',{'action':'start','conversation_id':self.conversation,'invitation_id':'I-DANIEL'},headers=self.kiosk)
    def check_in(self,code='authorized-test-code',status=200):
        return self.cmd('reception.interact','KIOSK-01',{'action':'check_in','conversation_id':self.conversation,'verification_code':code},headers=self.kiosk,code=status)
    def test_kiosk_ready_and_host_authority(self):
        self.setup_reception();self.check_in('wrong-code',403)
        result=self.check_in();self.assertEqual(result['details']['reply']['status'],'awaiting_host')
        self.assertEqual(result['details']['routing']['channel_id'],'INTERCOM-A');self.assertFalse(result['details']['routing']['public_announcement'])
        self.assertNotIn('authorized-test-code',json.dumps(result))
        self.assertEqual(self.client.get(self.root+'/world',headers=self.kiosk).status_code,403)
        self.cmd('intercom.reply','INTERCOM-A',{'conversation_id':self.conversation,'response':'ready'},headers=self.auth('luis'),code=403)
        self.cmd('intercom.reply','INTERCOM-B',{'conversation_id':self.conversation,'response':'ready'},headers=self.auth('carlos-host'),code=403)
        result=self.cmd('intercom.reply','INTERCOM-A',{'conversation_id':self.conversation,'response':'ready'},headers=self.auth('carlos-host'))
        self.assertEqual(result['details']['reply']['status'],'host_ready')
        self.assertEqual(self.state()['entities'][self.conversation]['identity_status'],'verified-invitation')
        with main.database() as db:
            text=' '.join(r[0] for r in db.execute('SELECT payload FROM office_events'))
            self.assertNotIn('authorized-test-code',text);self.assertNotIn('wrong-code',text)
        before=self.state();main.initialize();self.assertEqual(before,self.state())
    def test_intercom_wait_and_no_presence_fallback(self):
        self.setup_reception();self.check_in()
        result=self.cmd('intercom.reply','INTERCOM-A',{'conversation_id':self.conversation,'response':'wait','minutes':5},headers=self.auth('carlos-host'))
        self.assertEqual(result['details']['reply']['status'],'waiting_host')
        self.assertTrue(result['details']['reply']['retry_at'].startswith('2026-11-07T20:55'))
    def test_absent_host_never_notified_as_present(self):
        self.setup_reception(fresh=False);result=self.check_in()
        self.assertEqual(result['details']['reply']['status'],'staff_fallback')
        self.assertNotIn('routing',result['details'])
        self.assertTrue(any(x['kind']=='Task' and x.get('organization_id')=='ORG-COWORK' for x in self.state()['entities'].values()))
    def test_intercom_timeout_and_cancelled_meeting(self):
        self.setup_reception();self.check_in()
        self.cmd('intercom.timeout','INTERCOM-A',{'conversation_id':self.conversation},code=409)
        self.advance('2026-11-07T15:51:00-05:00')
        self.cmd('intercom.timeout','INTERCOM-A',{'conversation_id':self.conversation})
        self.assertEqual(self.state()['entities'][self.conversation]['status'],'staff_fallback')
    def test_additive_migration_with_legacy_booking(self):
        with main.database(write=True) as db:
            db.execute("UPDATE office_sites SET config='{}' WHERE id='office'")
            upsert_resource(db,'office','DESK-03','Desk',{'capacity':1,'position':[1,2,3]})
        self.cmd('entity.upsert',inputs={'id':'DESK-03','kind':'Desk','attributes':{'capacity':1}})
        self.booking('legacy-booking',person='luis',resource='DESK-03',party_size=1)
        before_events=self.client.get(self.root+'/events',headers=self.headers).json()
        with main.database(write=True) as db:self.assertTrue(provision(db,'office',ORIGINAL,'2026-11-07T15:45:00-05:00'))
        self.assertEqual(self.state()['entities']['legacy-booking']['resource_id'],'DESK-03')
        self.assertTrue(self.state()['entities']['DESK-03']['deprecated'])
        after=self.client.get(self.root+'/events',headers=self.headers).json();self.assertEqual(after[:len(before_events)],before_events)
        with main.database(write=True) as db:self.assertFalse(provision(db,'office',ORIGINAL,'2026-11-07T15:45:00-05:00'))

    def test_personal_reply_changes_the_same_reception_world(self):
        self.setup_reception();self.check_in()
        host=self.auth('carlos-host')
        response=self.client.get('/v1/office/app/inbox',headers=host)
        self.assertEqual(response.status_code,200,response.text)
        messages=response.json();self.assertEqual(len(messages),1)
        self.assertEqual(self.client.get('/v1/office/app/inbox',headers=self.auth('luis')).json(),[])
        result=self.client.post('/v1/office/app/inbox/'+messages[0]['id']+'/reply',headers=host,json={'response':'ready'})
        self.assertEqual(result.status_code,200,result.text)
        self.assertEqual(self.state()['entities'][self.conversation]['status'],'host_ready')
        self.assertEqual(self.client.post('/v1/office/app/inbox/'+messages[0]['id']+'/reply',headers=host,json={'response':'ready'}).status_code,409)

    def test_reservations_change_availability_without_inventing_occupancy(self):
        interval={'starts_at':'2026-11-07T21:00:00Z','ends_at':'2026-11-07T22:00:00Z'}
        before=self.cmd('booking.getAvailability','D1',interval)
        self.assertTrue(before['details']['available'])
        self.cmd('booking.create','D1',{'booking_id':'B-D1','person_id':'PERSON-LUIS',**interval})
        self.assertFalse(self.cmd('booking.getAvailability','D1',interval)['details']['available'])
        self.assertNotIn('occupancy',self.state()['entities']['ZONE-D'])
        self.assertEqual(self.state()['entities']['PERSON-LUIS']['presence'],'unknown')
        self.cmd('booking.cancel','B-D1')
        self.assertTrue(self.cmd('booking.getAvailability','D1',interval)['details']['available'])
    def test_hypothetical_occupancy_never_becomes_an_official_measurement(self):
        before=self.state()
        r=self.client.post(self.root+'/scenarios',headers=self.headers,json={'id':'occupancy-what-if','expected_revision':before['revision']});self.assertEqual(r.status_code,201,r.text)
        self.cmd('zone.assumeOccupancy','ZONE-D',{'count':50},branch='occupancy-what-if')
        hypothetical=self.state(branch='occupancy-what-if')
        self.assertEqual(hypothetical['entities']['ZONE-D']['assumed_occupancy'],50)
        self.assertEqual(before,self.state())
        r=self.client.post(self.root+'/scenarios/occupancy-what-if/apply',headers=self.headers,json={'id':str(uuid4())})
        self.assertEqual(r.status_code,403,r.text);self.assertEqual(before,self.state())

    def test_remote_reply_does_not_establish_physical_presence(self):
        self.setup_reception();self.check_in()
        self.advance('2026-11-07T15:51:00-05:00')
        host=self.auth('carlos-host')
        message=self.client.get('/v1/office/app/inbox',headers=host).json()[0]
        result=self.client.post('/v1/office/app/inbox/'+message['id']+'/reply',headers=host,json={'response':'five_minutes'})
        self.assertEqual(result.status_code,200,result.text);self.assertEqual(result.json()['status'],'waiting')
        self.assertEqual(self.state()['entities']['PERSON-CARLOS']['freshness'],'stale')
        result=self.client.post('/v1/office/app/inbox/'+message['id']+'/reply',headers=host,json={'response':'ready'})
        self.assertEqual(result.status_code,200,result.text)
        self.assertEqual(self.state()['entities']['PERSON-CARLOS']['freshness'],'stale')
        self.assertEqual(self.state()['entities'][self.conversation]['status'],'host_ready')

    def test_access_respects_ready_visit_destination_and_private_organization(self):
        self.setup_reception();self.check_in()
        self.cmd('intercom.reply','INTERCOM-A',{'conversation_id':self.conversation,'response':'ready'},headers=self.auth('carlos-host'))
        visit=self.state()['entities'][self.conversation]['visit_id']
        self.cmd('entity.upsert',inputs={'id':'test-meeting-door','kind':'AccessPoint','attributes':{'zone_id':'annotation-1'}})
        self.cmd('entity.upsert',inputs={'id':'test-other-door','kind':'AccessPoint','attributes':{'zone_id':'annotation-0'}})
        good=self.cmd('access.checkAuthorization','test-meeting-door',{'visit_id':visit,'escorted':True})
        self.assertTrue(good['details']['allowed'])
        denied=self.cmd('access.requestEntry','test-other-door',{'visit_id':visit,'escorted':True})
        self.assertEqual(denied['status'],'denied')
        self.assertEqual(self.state()['entities'][visit]['status'],'host_ready')
        self.cmd('entity.upsert',inputs={'id':'test-private-door','kind':'AccessPoint','attributes':{'zone_id':'annotation-2'}})
        denied=self.cmd('access.requestEntry','test-private-door',{'person_id':'PERSON-CARLOS'})
        self.assertEqual(denied['status'],'denied')
        self.assertIn('organization',denied['details']['reason'])
        self.cmd('zone.close','annotation-1')
        self.assertFalse(self.cmd('access.checkAuthorization','test-meeting-door',{'visit_id':visit,'escorted':True})['details']['allowed'])
