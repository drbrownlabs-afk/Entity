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
        self.assertEqual({x['id'] for x in state.values() if x.get('kind')=='Desk' and x.get('commercial') is True},{f'{group}{n}' for group in 'DE' for n in range(1,7)})
        for observed in INVENTORY:
            item=state[observed['id']];self.assertIsNone(item['position']);self.assertFalse(item['reservable'])
            self.assertTrue(any(r['type']=='partOf' and r['target']=='site' for r in item['relations']))
            self.cmd('booking.create',item['id'],{'booking_id':'invalid-'+item['id'],'person_id':'PERSON-LUIS','starts_at':'2026-11-07T16:00:00-05:00','ends_at':'2026-11-07T17:00:00-05:00','party_size':1},code=404)
        before=self.client.get(self.root+'/events',headers=self.headers).json()
        with main.database(write=True) as db:self.assertFalse(apply_observed_inventory(db,'office',INVENTORY))
        main.initialize();self.assertEqual(before,self.client.get(self.root+'/events',headers=self.headers).json())
