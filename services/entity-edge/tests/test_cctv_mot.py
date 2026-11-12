import unittest
from entity_edge.cctv_mot import track_frames

def payload(points):
 return {'frames':[{'camera_id':'sensor-test','frame_index':i,'observed_at':f'2026-11-12T00:00:{i:02}Z','media_time_seconds':i*.5,'frame_sha256':str(i).zfill(64),'image_size':[1000,1000],'detections':[] if x is None else [{'bbox':[x-20,200,x+20,400],'confidence':.9,'class':'person'}]} for i,x in enumerate(points)]}
class CctvMotTests(unittest.TestCase):
 def test_confirmation_associates_only_original_pixel_detections(self):
  source=payload([200,220,240]);result=track_frames(source)
  self.assertEqual(result['frames'][0]['observed_at'],source['frames'][0]['observed_at']);self.assertEqual(result['frames'][0]['tracks'][0]['association_confirmation_evidence_at'],source['frames'][1]['observed_at']);self.assertTrue(result['frames'][0]['tracks'][0]['associated_after_confirmation']);self.assertEqual(result['frames'][0]['tracks'][0]['confirmed_at_frame_index'],1)
  for frame,raw in zip(result['frames'],source['frames']):self.assertEqual(frame['tracks'][0]['bbox'],raw['detections'][0]['bbox'])
 def test_unconfirmed_single_frame_does_not_become_track(self):
  self.assertTrue(all(not f['tracks'] for f in track_frames(payload([200,None,None,None]))['frames']))
 def test_gap_has_no_invented_observations_and_recovers(self):
  result=track_frames(payload([200,200,200,None,None,None,200,200]))
  self.assertTrue(all(not f['tracks'] for f in result['frames'][3:6]));self.assertEqual(result['frames'][2]['tracks'][0]['local_track_id'],result['frames'][6]['tracks'][0]['local_track_id'])
 def test_expiration_creates_new_local_id(self):
  result=track_frames(payload([200,200,200]+[None]*20+[200,200]));self.assertNotEqual(result['frames'][1]['tracks'][0]['local_track_id'],result['frames'][-1]['tracks'][0]['local_track_id'])
 def test_steep_view_anchor_is_explicit_and_not_a_floor_claim(self):
  result=track_frames(payload([200,210]),center_sensors=['sensor-test']);self.assertEqual(result['frames'][0]['tracks'][0]['position_anchor'],'bbox-center');self.assertFalse(result['predictions_reported_as_observations'])
if __name__=='__main__':unittest.main()
