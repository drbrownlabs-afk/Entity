import unittest,json,subprocess,sys
from pathlib import Path
import test_office as base
from app import main
class DifferentSiteTests(unittest.TestCase):
    setUp=base.OfficeTests.setUp
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    def test_different_resource_ids_and_site_configuration_use_existing_service(self):
        config={'id':'norte-ficticio','name':'Sede ficticia norte','timezone':'Europe/Madrid','clock':'2026-11-07T08:00:00+01:00',
          'resources':[{'id':'Z-NORTE','kind':'Zone','attributes':{'name':'Zona Norte'}},
            {'id':'ORG-SIERRA','kind':'Organization','attributes':{'name':'Sierra ficticia'}},
            {'id':'PUESTO-N17','kind':'Desk','attributes':{'capacity':1,'public':True,'reservable':True,'zone_id':'Z-NORTE'}},
            {'id':'SOCIA-MARIA','kind':'Person','attributes':{'name':'María','membership_status':'active','membership_until':'2027-01-01T00:00:00Z','organization_id':'ORG-SIERRA'}}],
          'accounts':[{'username':'admin','role':'admin'},{'username':'maria','role':'member','person':'SOCIA-MARIA'}]}
        root=Path(__file__).resolve().parents[3]
        file=Path(self.tmp.name)/'site.json';file.write_text(json.dumps(config))
        result=subprocess.run([sys.executable,str(root/'scripts/provision-office-site.py'),str(file),'--database',str(main.DB_PATH)],capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr)
        credentials=json.loads((Path(self.tmp.name)/'norte-ficticio-access.json').read_text())
        answer=self.client.post('/v1/office/auth/login',json={'username':'norte-ficticio:maria','password':credentials['norte-ficticio:maria']['password']})
        self.assertEqual(answer.status_code,200,answer.text);headers={'Authorization':'Bearer '+answer.json()['token']}
        prefix='/v1/sites/norte-ficticio/runs/onboarding'
        state=self.client.get(prefix+'/world',headers=headers).json()
        self.assertEqual(state['timezone'],'Europe/Madrid')
        self.assertIn('PUESTO-N17',state['entities']);self.assertNotIn('PERSON-CARLOS',state['entities'])
        from uuid import uuid4
        result=self.client.post(prefix+'/commands',headers=headers,json={'id':str(uuid4()),'operation':'booking.create','target':'PUESTO-N17','inputs':{'booking_id':'RESERVA-N17','person_id':'SOCIA-MARIA','starts_at':'2026-11-07T10:00:00+01:00','ends_at':'2026-11-07T11:00:00+01:00'}})
        self.assertEqual(result.status_code,200,result.text)
        self.assertEqual(self.client.get('/v1/sites/office/runs/day/world',headers=headers).status_code,403)
        again=subprocess.run([sys.executable,str(root/'scripts/provision-office-site.py'),str(file),'--database',str(main.DB_PATH)],capture_output=True,text=True)
        self.assertEqual(again.returncode,0,again.stderr)
        self.assertIn('RESERVA-N17',self.client.get(prefix+'/world',headers=headers).json()['entities'])
