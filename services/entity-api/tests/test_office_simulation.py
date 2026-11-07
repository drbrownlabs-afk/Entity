import json,unittest
from pathlib import Path
from test_office import PASSWORD
import test_office as base
from app import main
from app.office.provision import provision
ORIGINAL=json.loads((Path(__file__).resolve().parents[3]/'worlds/synthetic-office/original-viewer-settings.json').read_text())

class DailySimulationTests(unittest.TestCase):
    setUp=base.OfficeTests.setUp
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    cmd=base.OfficeTests.cmd
    state=base.OfficeTests.state
    def install(self,run):
        with main.database(write=True) as db:provision(db,'office',ORIGINAL,'2026-11-07T08:00:00-05:00')
        r=self.client.post('/v1/sites/office/runs',headers=self.headers,json={'id':run,'clock':'2026-11-07T08:00:00-05:00','seed':7});self.assertEqual(r.status_code,201,r.text)
        root='/v1/sites/office/runs/'+run
        r=self.client.post(root+'/simulation/install',headers=self.headers);self.assertEqual(r.status_code,200,r.text)
        return root
    def test_full_day_pause_resume_replay_and_memory(self):
        root=self.install('full-day')
        for time in ['09:15:00','09:16:05','11:21:02','14:11:00','15:50:01','15:50:02','15:55:03','16:01:00','18:30:00']:
            r=self.client.post(root+'/simulation/advance',headers=self.headers,json={'to':'2026-11-07T'+time+'-05:00'});self.assertEqual(r.status_code,200,r.text)
            if time=='09:15:00':
                items=self.client.get(root+'/world',headers=self.headers).json()['entities']
                track=items['CAM-05']['tracks'][0];self.assertNotIn('person_id',items[track])
            if time=='15:50:02':
                items=self.client.get(root+'/world',headers=self.headers).json()['entities']
                self.assertEqual(items['C-DANIEL-full-day']['status'],'waiting_host')
            if time=='15:55:03':
                items=self.client.get(root+'/world',headers=self.headers).json()['entities']
                self.assertEqual(items['C-DANIEL-full-day']['status'],'host_ready')
        before=self.client.get(root+'/world',headers=self.headers).json()
        self.assertEqual(r.json()['pending'],0)
        self.assertEqual(before['entities']['B-LUIS-full-day']['resource_id'],'E3')
        self.assertEqual(before['entities']['HVAC-D']['status'],'off')
        self.assertEqual(before['entities']['M-1600-full-day']['status'],'completed')
        self.assertTrue(any(x.get('type')=='access.denied' for x in before['entities'].values()))
        main.initialize()
        self.assertEqual(before,self.client.get(root+'/world',headers=self.headers).json())
        repeat=self.client.post(root+'/simulation/advance',headers=self.headers,json={'to':'2026-11-07T18:30:00-05:00'});self.assertEqual(repeat.json()['steps'],[])
        historical=self.client.get(root+'/world',headers=self.headers,params={'at':'2026-11-07T15:50:02-05:00'}).json()
        self.assertEqual(historical['entities']['C-DANIEL-full-day']['status'],'waiting_host')
        replay=self.install('replay')
        response=self.client.post(replay+'/simulation/advance',headers=self.headers,json={'to':'2026-11-07T18:30:00-05:00'});self.assertEqual(response.status_code,200,response.text)
        again=self.client.get(replay+'/world',headers=self.headers).json()
        for key in ['PERSON-LUIS','PERSON-CARLOS','HVAC-D','HVAC-E']:
            self.assertEqual(before['entities'][key]['status' if key.startswith('HVAC') else 'presence'],again['entities'][key]['status' if key.startswith('HVAC') else 'presence'])
        self.assertEqual(again['entities']['B-LUIS-replay']['resource_id'],'E3')

    def test_hvac_impact_follows_zone_links_and_resolution_is_audited(self):
        root=self.install('impact-day')
        r=self.client.post(root+'/simulation/advance',headers=self.headers,json={'to':'2026-11-07T14:00:01-05:00'});self.assertEqual(r.status_code,200,r.text)
        items=self.client.get(root+'/world',headers=self.headers).json()['entities']
        incident=next(x for x in items.values() if x['kind']=='Incident')
        self.assertIn('PERSON-LUIS',incident['affected'])
        self.assertIn('B-LUIS-impact-day',incident['affected'])
        self.assertNotIn('E3',incident['affected'])
        r=self.client.post(root+'/simulation/advance',headers=self.headers,json={'to':'2026-11-07T14:11:00-05:00'});self.assertEqual(r.status_code,200,r.text)
        items=self.client.get(root+'/world',headers=self.headers).json()['entities']
        self.assertEqual(items[incident['id']]['status'],'resolved')
        self.assertTrue(any(x['kind']=='Task' and x.get('status')=='resolved' for x in items.values()))
        causes=self.client.post(root+'/queries',headers=self.headers,json={'kind':'causes','entity_id':'HVAC-D'}).json()
        self.assertTrue(causes['evidence'])

    def test_authenticated_personal_reply_supersedes_scripted_character(self):
        root=self.install('participant')
        from app.office.auth import create_account
        with main.database(write=True) as db:create_account(db,'remote-carlos',PASSWORD,'office','member','PERSON-CARLOS')
        result=self.client.post(root+'/simulation/advance',headers=self.headers,json={'to':'2026-11-07T15:50:01-05:00'});self.assertEqual(result.status_code,200,result.text)
        headers=self.auth('remote-carlos')
        message=self.client.get('/v1/office/app/inbox',headers=headers).json()[0]
        result=self.client.post('/v1/office/app/inbox/'+message['id']+'/reply',headers=headers,json={'response':'ready'});self.assertEqual(result.status_code,200,result.text)
        result=self.client.post(root+'/simulation/advance',headers=self.headers,json={'to':'2026-11-07T18:30:00-05:00'});self.assertEqual(result.status_code,200,result.text)
        state=self.client.get(root+'/world',headers=self.headers).json()
        self.assertEqual(state['entities']['C-DANIEL-participant']['last_reply_origin'],'authenticated-personal-client')
        self.assertEqual(state['entities']['C-DANIEL-participant']['status'],'host_ready')

    def test_meeting_co2_is_not_misattributed_to_public_desks(self):
        root=self.install('sensor-scope')
        response=self.client.post(root+'/simulation/advance',headers=self.headers,json={'to':'2026-11-07T10:35:00-05:00'})
        self.assertEqual(response.status_code,200,response.text)
        items=self.client.get(root+'/world',headers=self.headers).json()['entities']
        measurement=items['annotation-1']['environment']['co2']
        self.assertEqual(measurement['source_id'],'SENSOR-MEETING')
        self.assertEqual(measurement['value'],1300)
        for zone in ['ZONE-D','ZONE-E']:
            self.assertEqual(items[zone]['environment']['co2']['value'],650)
            self.assertEqual(items[zone]['environment']['humidity']['unit'],'percent')
            self.assertEqual(items[zone]['environment']['illuminance']['unit'],'lux')
        main.initialize()
        self.assertEqual(items,self.client.get(root+'/world',headers=self.headers).json()['entities'])

    def test_calibrated_profile_is_reused_by_real_daily_runs_without_a_second_clock(self):
        from app.office.storage import encode
        profile={'id':'contract-profile-not-a-scene','coordinate_frame':'contract-test-only','motions':[{'person_id':'luis','avatar_id':'Male_Adult_01','zone_id':'zone','starts_local':'09:15:00','calibration_evidence':'contract only; no spatial validation',
            'waypoints':[{'offset_seconds':0,'position':[0,0,0],'evidence':'contract-a'},{'offset_seconds':10,'position':[0,0,2],'evidence':'contract-b'}]}]}
        with main.database(write=True) as db:
            configuration=json.loads(db.execute("SELECT config FROM office_sites WHERE id='office'").fetchone()[0]);configuration['daily_spatial_profile']=profile
            db.execute("UPDATE office_sites SET config=? WHERE id='office'",(encode(configuration),))
        for run in ['profile-day','profile-replay']:
            root=self.install(run)
            response=self.client.post(root+'/simulation/advance',headers=self.headers,json={'to':'2026-11-07T09:15:05-05:00'});self.assertEqual(response.status_code,200,response.text)
            state=self.client.get(root+'/world',headers=self.headers).json()
            self.assertEqual(state['entities']['luis']['spatial_pose']['position'],[0,0,1])
            self.assertNotEqual(state['entities']['luis'].get('presence'),'confirmed')
            main.initialize();self.assertEqual(state,self.client.get(root+'/world',headers=self.headers).json())
