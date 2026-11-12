import copy
import unittest
from datetime import datetime,timedelta,timezone
from entity_edge.causal_mot import CausalMOT
from test_cctv_mot import payload


def frames(points):
    rows=payload(points)['frames'];base=datetime(2026,11,12,tzinfo=timezone.utc)
    for row in rows:row['observed_at']=(base+timedelta(seconds=row['media_time_seconds'])).isoformat()
    return rows


class CausalMotTests(unittest.TestCase):
    def emit(self,rows):
        engine=CausalMOT();return [engine.update(r,'stream-a',r['observed_at']) for r in rows]

    def test_prefix_invariance_and_no_retroactive_confirmation(self):
        rows=frames([200,210,220,230]);prefix=self.emit(rows[:1]);all_=self.emit(rows)
        self.assertEqual(prefix,all_[:1]);self.assertEqual(prefix[0]['tracks'][0]['track_status'],'candidate')
        self.assertNotIn('association_confirmation_evidence_at',prefix[0]['tracks'][0])
        self.assertEqual(all_[1]['tracks'][0]['track_status'],'confirmed')
        altered=copy.deepcopy(rows);altered[2]['detections']=[];altered[3]['detections'][0]['bbox']=[800,200,840,400]
        self.assertEqual(all_[:2],self.emit(altered)[:2])
        engine=CausalMOT();first=engine.update(rows[0],'stream-a',rows[0]['observed_at']);frozen=copy.deepcopy(first)
        engine.update(rows[1],'stream-a',rows[1]['observed_at']);self.assertEqual(first,frozen)

    def test_fresh_box_anchor_is_unfiltered_and_no_prediction_observations(self):
        rows=self.emit(frames([200,220,None,250]))
        self.assertFalse(rows[2]['tracks']);self.assertEqual(rows[3]['tracks'][0]['position'],[.25,.4])
        self.assertEqual(rows[1]['tracks'][0]['local_track_id'],rows[3]['tracks'][0]['local_track_id'])

    def test_elapsed_gap_and_session_change_cannot_reuse_an_identity(self):
        raw=frames([200,200,200]);engine=CausalMOT()
        a=engine.update(raw[0],'a',raw[0]['observed_at']);engine.update(raw[1],'a',raw[1]['observed_at'])
        late=copy.deepcopy(raw[2]);late['media_time_seconds']=20;late['observed_at']='2026-11-12T00:00:20+00:00'
        b=engine.update(late,'a',late['observed_at']);self.assertNotEqual(a['tracks'][0]['local_track_id'],b['tracks'][0]['local_track_id'])
        fresh=engine.update(raw[0],'b',raw[0]['observed_at']);self.assertNotEqual(a['stream_session_id'],fresh['stream_session_id'])
        with self.assertRaises(ValueError):engine.update(raw[0],'a',raw[0]['observed_at'])

    def test_strict_input_and_camera_separation(self):
        rows=frames([200,200]);engine=CausalMOT()
        engine.update(rows[0],'a',rows[0]['observed_at']);other=copy.deepcopy(rows[1]);other['camera_id']='other'
        self.assertEqual(engine.update(other,'a',other['observed_at'])['tracks'][0]['track_status'],'candidate')
        bad=copy.deepcopy(rows[1]);bad['actor_id']='private'
        with self.assertRaises(ValueError):engine.update(bad,'a',bad['observed_at'])


if __name__=='__main__':unittest.main()
