import copy
import unittest
from entity_edge.causal_mtmc import CausalMTMC
from entity_edge.cctv_mtmc import POLICY
from entity_edge.spatial_graph import SpatialSensorGraph
from test_spatial_graph import fixture


def evidence(sensor,local,frame,cell=0,known=None,status='confirmed'):
    stamp=f'2026-11-12T00:00:{frame:02}Z'
    return {'camera_id':sensor,'stream_session_id':'session','local_track_id':sensor+':'+local,
        'media_time_seconds':float(frame),'frame_index':frame,'observed_at':stamp,'known_at':known or stamp,
        'frame_sha256':'a'*64,'observation_id':sensor+':'+local+':'+str(frame),
        'embedding':[1.]+[0.]*511,'floor_estimate_native':[0,0,0],
        'candidate_floor_cells':[cell],'track_status':status,
        **({'association_confirmation_evidence_at':stamp} if status=='confirmed' else {})}


class CausalMtmcTests(unittest.TestCase):
    def engine(self,policy=None):return CausalMTMC(SpatialSensorGraph(fixture()),'run',policy or POLICY)
    def run_rows(self,rows):
        engine=self.engine();events=[]
        for row in rows:events.extend(engine.update(row))
        return events,engine

    def test_prefix_invariance_candidates_then_merge_without_rewriting(self):
        rows=[evidence(sensor,'a',i) for i in range(5) for sensor in ['C-S1','C-S2']]
        first,_=self.run_rows(rows[:4]);all_,engine=self.run_rows(rows)
        self.assertEqual(first,all_[:len(first)]);self.assertEqual(len(first),2)
        self.assertEqual(first[0]['status'],'candidate');self.assertEqual(all_[2]['status'],'corroborated')
        self.assertEqual(all_[2]['known_at'],'2026-11-12T00:00:02Z');self.assertEqual(len(all_[2]['supersedes']),1)
        altered=copy.deepcopy(rows);altered[-1]['embedding']=[0.,1.]+[0.]*510
        second,_=self.run_rows(altered);self.assertEqual(all_[:3],second[:3])
        self.assertEqual(len(set(engine.owner.values())),1)

    def test_new_conflict_revises_to_uncertain_at_new_evidence_time(self):
        rows=[evidence(sensor,'a',i) for i in range(3) for sensor in ['C-S1','C-S2']]
        events,engine=self.run_rows(rows);frozen=copy.deepcopy(events)
        for i in range(3,20):
            engine.update(evidence('C-S1','a',i,cell=0))
            more=engine.update(evidence('C-S2','a',i,cell=4));events.extend(more)
        self.assertEqual(events[:len(frozen)],frozen)
        self.assertTrue(any(e['status']=='uncertain' for e in events));self.assertTrue(all(e['position_status']=='unknown' for e in events))

    def test_gap_uses_only_available_boundary_evidence(self):
        rows=[evidence('C-S1','a',i) for i in range(3)]+[evidence('C-S2','b',i,cell=4) for i in range(10,13)]
        events,engine=self.run_rows(rows)
        self.assertEqual(events[-1]['status'],'corroborated');self.assertEqual(events[-1]['known_at'],'2026-11-12T00:00:12Z')
        self.assertEqual(sum(len(h) for h in engine.histories.values()),6)

    def test_closed_wall_and_same_sensor_duplicates_are_not_merged(self):
        engine=self.engine(POLICY|{'scenario':'closed'})
        events=[]
        for i in range(3):events.extend(engine.update(evidence('C-S1','a',i)))
        for i in range(10,13):events.extend(engine.update(evidence('C-S2','b',i,cell=4)))
        self.assertEqual(len(events),2)
        rows=[evidence('C-S1',local,i) for i in range(3) for local in ['a','b']]
        events,_=self.run_rows(rows);self.assertEqual(len(events),2)

    def test_tentatives_future_private_and_late_evidence(self):
        engine=self.engine();row=evidence('C-S1','a',0,status='candidate')
        self.assertEqual(engine.update(row)[0]['status'],'candidate');self.assertEqual(len(engine.histories[('C-S1','session','C-S1:a')]),0)
        with self.assertRaises(ValueError):engine.update(row)
        for mutate in [lambda r:r.update(actor_id='private'),lambda r:r.update(known_at='2026-11-11T23:59:59Z'),
                       lambda r:r.update(association_confirmation_evidence_at='2026-11-12T00:00:20Z')]:
            bad=evidence('C-S1','a',1);mutate(bad)
            with self.assertRaises(ValueError):engine.update(bad)

    def test_later_confirmation_supports_prior_candidate_without_rewriting_it(self):
        engine=self.engine();first=engine.update(evidence('C-S1','a',0,status='candidate'));saved=copy.deepcopy(first)
        engine.update(evidence('C-S1','a',1))
        self.assertEqual(first,saved)
        history=engine.histories[('C-S1','session','C-S1:a')]
        self.assertEqual(len(history),2);self.assertEqual(history[0]['observed_at'],'2026-11-12T00:00:00Z')
        self.assertEqual(history[0]['known_at'],'2026-11-12T00:00:01Z')

    def test_independent_capture_jitter_uses_real_elapsed_time(self):
        engine=self.engine();events=[]
        for i in range(3):
            events.extend(engine.update(evidence('C-S1','a',i)))
            row=evidence('C-S2','b',i,known=f'2026-11-12T00:00:0{i}.200000Z')
            row['media_time_seconds']+=.2;row['observed_at']=row['known_at'];row['association_confirmation_evidence_at']=row['known_at']
            events.extend(engine.update(row))
        self.assertEqual(events[-1]['status'],'corroborated')
        self.assertEqual(events[-1]['known_at'],'2026-11-12T00:00:02.200000Z')


if __name__=='__main__':unittest.main()
