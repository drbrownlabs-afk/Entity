"""Temporal/provenance protocol fixtures, not detector accuracy evidence."""
import copy
import unittest
from unittest.mock import patch
from uuid import uuid4
import test_p2_perception as fixtures
from app import main
from app.office.storage import world


class CausalPerceptionTests(unittest.TestCase):
    tearDown=fixtures.PerceptionTests.tearDown
    login=fixtures.PerceptionTests.login
    post=fixtures.PerceptionTests.post
    world=fixtures.PerceptionTests.world

    def setUp(self):
        fixtures.PerceptionTests.setUp(self)
        from app.office.service import upsert_resource
        with main.database(write=True) as db:
            for cam in ['cam-a','cam-b']:
                upsert_resource(db,'p2',cam,'Camera',{'covered_zones':[],'calibration_sha256':'c'*64})
            from app.office.storage import emit
            emit(db,'p2','r','main','2026-11-09T12:00:20Z','calibration.enrolled','test',
                 {cam:{'calibration_sha256':'c'*64} for cam in ['cam-a','cam-b']})

    def frame(self,cam='cam-a',index=3,known=21,session='session-a'):
        msg=copy.deepcopy(self.messages[cam]);msg['observation_id']=str(uuid4())
        msg['type']='edge.causal_presence';msg['observed_at']=f'2026-11-09T12:00:{index:02}Z'
        msg['payload']['tracks'][0].update(track_status='confirmed',association_confirmed_at=msg['observed_at'])
        msg['payload'].update(known_at=f'2026-11-09T12:00:{known:02}Z',stream_session_id=session,
            calibration_sha256='c'*64,clock_domain='paced-replay-utc',execution_mode='causal-incremental',
            frame_index=index,frame_sha256='a'*64)
        return msg

    def bundle(self,messages,headers=None):
        return self.c.post(self.prefix+'/observations/causal-bundle',headers=headers or self.h,json={'observations':messages})

    def revision(self,frames,gid='r:anonymous-a',revision=0,status='candidate',supersedes=(),known=23):
        return {'observation_id':str(uuid4()),'site_id':'p2','source_id':frames[0]['source_id'],
            'observed_at':f'2026-11-09T12:00:{known:02}Z','type':'edge.causal_association',
            'provenance':frames[0]['provenance'],
            'payload':{'global_track_id':gid,'expected_revision':revision,'status':status,
                'members':[{'source_id':f['source_id'],'stream_session_id':f['payload']['stream_session_id'],
                    'local_track_id':f['payload']['tracks'][0]['local_track_id'],
                    'evidence_observation_ids':[f['observation_id']]} for f in frames],
                'supersedes':list(supersedes),'reason':'protocol fixture, evidence available now',
                'method':'osnet-ain-static-graph-constrained-incremental','model_sha256':'a'*64,
                'graph_sha256':'b'*64,'calibration_sha256':'c'*64,
                'execution_mode':'causal-incremental','clock_domain':'paced-replay-utc'}}

    def test_selective_bundle_duplicate_replay_restart_and_unknown_world_location(self):
        frames=[self.frame(cam) for cam in ['cam-a','cam-b']]
        from app.office.observations import world as load
        with patch('app.office.observations.world',wraps=load) as observed:
            response=self.bundle(frames);self.assertEqual(response.status_code,200,response.text)
            self.assertEqual(observed.call_count,0)
        before=self.world();self.assertEqual(self.bundle(frames).json()['new_effects'],0)
        self.assertEqual(before,self.world());main.initialize();self.assertEqual(before,self.world())
        local=next(k for k,v in before['entities'].items() if v.get('stream_session_id')=='session-a' and v['kind']=='Track')
        answer=self.c.post(self.prefix+'/queries',headers=self.h,json={'kind':'location','entity_id':local}).json()['result']
        self.assertEqual(answer['status'],'unknown');self.assertEqual(answer['visual_presence'],'confirmed')

    def test_knowledge_history_does_not_backdate_capture_or_merge(self):
        a=self.frame();b=self.frame('cam-b');self.assertEqual(self.bundle([a,b]).status_code,200)
        first=self.revision([a]);self.assertEqual(self.post(first).status_code,200)
        other=self.revision([b],gid='r:anonymous-b');self.assertEqual(self.post(other).status_code,200)
        with main.database() as db:
            prefix=world(db,'p2','r',at='2026-11-09T12:00:22Z')
            self.assertNotIn('r:anonymous-a',prefix['entities'])
            self.assertTrue(any(v.get('stream_session_id')=='session-a' for v in prefix['entities'].values()))
        merge=self.revision([a,b],revision=1,status='corroborated',supersedes=['r:anonymous-b'],known=24)
        self.assertEqual(self.post(merge).status_code,200)
        current=self.world()['entities'];self.assertEqual(current['r:anonymous-b']['alias_of'],'r:anonymous-a')
        with main.database() as db:
            old_core=current['r:anonymous-b']['core_id']
            self.assertEqual(db.execute("SELECT COUNT(*) FROM relations WHERE target_id=? AND type='provisionallySameVisualSubject'",(old_core,)).fetchone()[0],0)
            self.assertEqual(db.execute("SELECT COUNT(*) FROM relations WHERE source_id=? AND type='supersededBy'",(old_core,)).fetchone()[0],1)
        with main.database() as db:
            prior=world(db,'p2','r',at='2026-11-09T12:00:23Z')['entities']
            self.assertNotIn('alias_of',prior['r:anonymous-b']);self.assertEqual(prior['r:anonymous-a']['hypothesis_status'],'candidate')
        self.assertTrue(self.post(merge).json()['duplicate'])
        stale=copy.deepcopy(merge);stale['observation_id']=str(uuid4());self.assertEqual(self.post(stale).status_code,409)

    def test_rollback_on_future_gt_foreign_source_and_conflicts(self):
        for mutate in [lambda p:p.update(actor_id='private'),lambda p:p.update(calibration_sha256='d'*64),
                       lambda p:p.update(known_at='2026-11-09T12:00:01Z'),
                       lambda p:p['tracks'][0].update(association_confirmed_at='2026-11-09T12:00:22Z')]:
            a=self.frame();b=self.frame('cam-b');mutate(b['payload']);before=self.world()
            self.assertEqual(self.bundle([a,b]).status_code,422);self.assertEqual(before,self.world())
        a=self.frame('cam-b');before=self.world()
        self.assertEqual(self.bundle([a],self.login('connector')).status_code,403);self.assertEqual(before,self.world())
        self.assertEqual(self.bundle([self.frame()],self.login('viewer')).status_code,403)

    def test_sessions_late_frames_and_future_available_refs(self):
        a=self.frame();self.assertEqual(self.post(a).status_code,200)
        b=self.frame(index=4,known=24,session='new-session');self.assertEqual(self.post(b).status_code,200)
        local=[v for v in self.world()['entities'].values() if v.get('stream_session_id') and v['kind']=='Track']
        self.assertEqual(len(local),2);self.assertEqual(sum(v['active'] for v in local),1)
        late=self.frame(index=2,known=25,session='new-session');self.assertEqual(self.post(late).status_code,200)
        self.assertEqual(next(v for v in self.world()['entities'].values() if v.get('active') and v.get('stream_session_id')=='new-session')['observed_at'],'2026-11-09T12:00:04+00:00')
        bad=self.revision([b],known=23);self.assertEqual(self.post(bad).status_code,422)
        msg=self.revision([b],known=26);msg['payload']['members'][0]['source_id']='cam-b'
        self.assertEqual(self.post(msg).status_code,422)
        msg=self.revision([b],known=26);msg['payload']['position']=[1,2,3]
        self.assertEqual(self.post(msg).status_code,422)


if __name__=='__main__':unittest.main()
