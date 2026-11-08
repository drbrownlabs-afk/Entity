"""Visual evidence is not a licence to duplicate commercial capacity or invent geometry."""
import json,unittest
from pathlib import Path
from app import main
from app.office.provision import provision,apply_observed_inventory
import test_office as base
ROOT=Path(__file__).resolve().parents[3]
ORIGINAL=json.loads((ROOT/'worlds/synthetic-office/original-viewer-settings.json').read_text())
INVENTORY=json.loads((ROOT/'worlds/synthetic-office/observed-inventory.json').read_text())

class ObservedInventoryTests(unittest.TestCase):
    setUp=base.OfficeTests.setUp
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    cmd=base.OfficeTests.cmd
    state=base.OfficeTests.state
    def test_nonannotated_groups_are_persistent_graph_evidence_not_more_desks(self):
        with main.database(write=True) as db:provision(db,'office',ORIGINAL,'2026-11-07T08:00:00-05:00')
        self.cmd('booking.create','D1',{'booking_id':'preserved','person_id':'PERSON-LUIS','starts_at':'2026-11-07T16:00:00-05:00','ends_at':'2026-11-07T17:00:00-05:00','party_size':1})
        booking=self.state()['entities']['preserved']
        with main.database(write=True) as db:self.assertTrue(apply_observed_inventory(db,'office',INVENTORY))
        state=self.state()['entities'];self.assertEqual(state['preserved'],booking)
        self.assertEqual({x['id'] for x in state.values() if x.get('kind')=='Desk' and x.get('commercial') is True},{f'{group}{n}' for group in 'CD' for n in range(1,7)})
        for observed in INVENTORY:
            item=state[observed['id']];self.assertIsNone(item['position']);self.assertFalse(item['reservable'])
            self.assertTrue(any(r['type']=='partOf' and r['target']==observed['attributes']['parent_resource'] for r in item['relations']))
            self.cmd('booking.create',item['id'],{'booking_id':'invalid-'+item['id'],'person_id':'PERSON-LUIS','starts_at':'2026-11-07T16:00:00-05:00','ends_at':'2026-11-07T17:00:00-05:00','party_size':1},code=404)
        before=self.client.get(self.root+'/events',headers=self.headers).json()
        with main.database(write=True) as db:self.assertFalse(apply_observed_inventory(db,'office',INVENTORY))
        main.initialize();self.assertEqual(before,self.client.get(self.root+'/events',headers=self.headers).json())
    def test_v5_retires_invalid_E_and_staff_C_without_rewriting_prior_bookings_or_events(self):
        from app.office.service import upsert_resource
        with main.database(write=True) as db:
            upsert_resource(db,'office','E3','Desk',{'name':'Legacy E3','zone_id':'zone','reservable':True,'public':True,'commercial':True,'capacity':1})
            upsert_resource(db,'office','C','Office',{'name':'Legacy C staff','private':True,'organization_id':'ORG-COWORK','reservable':False})
            db.execute('UPDATE office_sites SET config=? WHERE id=?',(json.dumps({'topology_version':4}),'office'))
        self.cmd('booking.create','E3',{'booking_id':'legacy-e','person_id':'luis','starts_at':'2026-11-07T16:00:00-05:00','ends_at':'2026-11-07T17:00:00-05:00','party_size':1})
        before=self.client.get(self.root+'/events?limit=1000',headers=self.headers).json()
        with main.database(write=True) as db:provision(db,'office',ORIGINAL,'2026-11-07T15:45:00-05:00')
        old=self.state()['entities'];self.assertEqual(old['legacy-e']['resource_id'],'E3');self.assertEqual(old['legacy-e']['status'],'reserved');self.assertTrue(old['E3']['deprecated']);self.assertFalse(old['C']['private'])
        after=self.client.get(self.root+'/events?limit=1000',headers=self.headers).json();self.assertEqual(after[:len(before)],before)
        response=self.client.post('/v1/sites/office/runs',headers=self.headers,json={'id':'v5-only','clock':'2026-11-08T08:00:00-05:00'});self.assertEqual(response.status_code,201,response.text)
        fresh=response.json()['entities'];self.assertFalse(any(key.startswith('E') and key[1:].isdigit() for key in fresh));self.assertTrue(all(group+str(n) in fresh for group in 'CD' for n in range(1,7)))
        main.initialize();self.assertEqual(old,self.state()['entities'])
    def test_seat_anchors_match_original_voxel_rays_and_do_not_claim_occupancy(self):
        from app.office.provision import apply_calibrated_resources
        calibration=json.loads((ROOT/'worlds/synthetic-office/calibrated-resources.json').read_text())
        evidence=json.loads((ROOT/'docs/evidence/phase09/survey/survey-cd-seats.json').read_text())
        with main.database(write=True) as db:
            provision(db,'office',ORIGINAL,'2026-11-07T08:00:00-05:00')
            self.assertTrue(apply_calibrated_resources(db,'office',calibration))
            self.assertFalse(apply_calibrated_resources(db,'office',calibration))
        items=self.state()['entities']
        for resource in calibration['resources']:
            attributes=resource['attributes'];source=attributes['spatial_provenance']
            view=next(v for v in evidence['views'] if v['id']==source['view'])
            ray=next(p for p in view['picks'] if p['screen']==source['screen'])
            self.assertEqual(items[resource['id']]['position'],ray['original_voxel_surface'])
            self.assertNotIn('occupancy',items[resource['id']])
        self.assertFalse(items['C']['reservable']);self.assertTrue(items['C1']['reservable'])
