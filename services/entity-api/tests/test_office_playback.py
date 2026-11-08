"""Live Core clock tests, not a claim of physical scene calibration."""
import json,time,unittest
from datetime import datetime
from fastapi.testclient import TestClient
from app import main
from app.office.storage import world
import test_office_simulation as daily
import test_office as base

class PlaybackTests(unittest.TestCase):
    setUp=base.OfficeTests.setUp
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    install=daily.DailySimulationTests.install
    def state(self,root):return self.client.get(root+'/world',headers=self.headers).json()
    def wait(self,predicate):
        deadline=time.monotonic()+5
        while time.monotonic()<deadline:
            if predicate():return
            time.sleep(.05)
        self.fail('Core clock condition timed out')
    def test_all_clients_share_play_pause_and_restart_does_not_apply_offline_time(self):
        root=self.install('clock-day');initial=self.state(root)['clock']
        self.assertEqual(self.client.post(root+'/simulation/control',headers=self.auth('luis'),json={'action':'play'}).status_code,403)
        response=self.client.post(root+'/simulation/control',headers=self.headers,json={'action':'play','speed':1});self.assertEqual(response.status_code,200,response.text)
        self.wait(lambda:self.state(root)['clock']>initial)
        self.assertEqual(self.client.post(root+'/simulation/control',headers=self.headers,json={'action':'pause'}).status_code,200)
        frozen=self.state(root);time.sleep(.4);self.assertEqual(frozen,self.state(root))
        self.assertTrue(frozen['playback']['paused'])
        self.client.post(root+'/simulation/control',headers=self.headers,json={'action':'play'})
        self.wait(lambda:self.state(root)['clock']>frozen['clock'])
        self.client.__exit__(None,None,None)
        with main.database() as db:before=world(db,'office','clock-day')['clock']
        self.client=TestClient(main.app).__enter__()
        after=self.state(root);self.assertEqual(before,after['clock']);self.assertTrue(after['playback']['paused'])
        events=self.client.get(root+'/events',headers=self.headers).json()
        self.assertTrue(any(e['type']=='simulation.paused_on_restart' for e in events))
    def test_provider_failure_rolls_back_tick_and_pauses_instead_of_repeating_actions(self):
        root=self.install('failing-clock');before=self.state(root)
        with main.database(write=True) as db:db.execute('INSERT OR REPLACE INTO office_bindings VALUES(?,?,?,?,?)',('office','HVAC-D','simulated','1.0',json.dumps({'available':False})))
        response=self.client.post(root+'/simulation/control',headers=self.headers,json={'action':'play'});self.assertEqual(response.status_code,200,response.text)
        self.wait(lambda:self.state(root)['playback']['paused'])
        after=self.state(root);self.assertEqual(before['clock'],after['clock']);self.assertEqual(before['entities'],after['entities'])
        self.assertFalse(any(x.get('kind')=='Booking' for x in after['entities'].values()))
        events=self.client.get(root+'/events',headers=self.headers).json()
        self.assertEqual(sum(e['type']=='simulation.playback_failed' for e in events),1)
    def test_replay_is_atomic_shared_scoped_and_preserves_previous_history(self):
        self.install('prepared-resources')
        active='/v1/sites/office/active-run'
        self.assertEqual(self.client.get(active,headers=self.headers).json()['id'],'day')
        payload={'id':'shared-replay','clock':'2026-11-07T08:00:00-05:00','seed':7}
        endpoint=self.root+'/simulation/replay'
        denied=self.client.post(endpoint,headers=self.auth('luis'),json=payload)
        self.assertEqual(denied.status_code,403)
        self.assertEqual(self.client.get('/v1/sites/other/active-run',headers=self.headers).status_code,403)
        before=self.client.get(self.root+'/world',headers=self.headers).json()
        failed=self.client.post(endpoint,headers=self.headers,json={**payload,'clock':'invalid'})
        self.assertEqual(failed.status_code,422)
        self.assertEqual(self.client.get(active,headers=self.headers).json()['id'],'day')
        result=self.client.post(endpoint,headers=self.headers,json=payload)
        self.assertEqual(result.status_code,201,result.text)
        for headers in [self.headers,self.auth('luis')]:
            self.assertEqual(self.client.get(active,headers=headers).json()['id'],'shared-replay')
        after=self.client.get(self.root+'/world',headers=self.headers).json()
        self.assertEqual(before['entities'],after['entities'])
        self.assertEqual(before['clock'],after['clock'])
        self.assertGreater(after['revision'],before['revision'])
        new_root='/v1/sites/office/runs/shared-replay'
        self.assertTrue(self.state(new_root)['playback']['paused'])
        self.assertEqual(self.client.post(endpoint,headers=self.headers,json={**payload,'id':'stale'}).status_code,409)
        self.client.__exit__(None,None,None);self.client=TestClient(main.app).__enter__()
        self.assertEqual(self.client.get(active,headers=self.headers).json()['id'],'shared-replay')
