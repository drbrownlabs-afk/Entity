import copy
import unittest
from entity_edge.spatial_graph import SpatialSensorGraph

def fixture():
 nodes=[[0.,0.,0.],[.2,0.,0.],[.4,0.,0.],[.4,0.,.2],[.4,0.,.4]]
 edges=[[0,1,.2],[1,2,.2],[2,3,.2],[3,4,.2]]
 scenario={'nodes':nodes,'edges':edges,'visibility_masks':[1,1,0,0,128],'portal_assumptions':{'test-portal':'open'}}
 closed=copy.deepcopy(scenario);closed['edges'].pop(1);closed['portal_assumptions']['test-portal']='closed'
 return {'schema_version':'1.0','profile_id':'unit-static','coordinate_frame':'native-test','metric_scale_verified':False,'grid_step_native':.2,'speed_policy':{'maximum_native_units_per_second':1.4,'nominal_minimum_moving_speed':.2,'units':'native'},'sensors':['C-S1','C-S2','C-S3','C-S4','C1-S1','C2-S1','C3-S1','C4-S1'],'scenarios':{'security-open':scenario,'closed':closed},'provenance':{},'limitations':[]}

class SpatialGraphTests(unittest.TestCase):
 def setUp(self):self.graph=SpatialSensorGraph(fixture())
 def test_path_follows_transit_topology_and_reports_first_leg(self):
  r=self.graph.transition([0,0,0],[.4,0,.4],1,position_uncertainty_native=0)
  self.assertTrue(r['possible']);self.assertAlmostEqual(r['path_length_native'],.8)
  self.assertEqual(self.graph.path_indices(0,4),[0,1,2,3,4]);self.assertEqual(r['possible_first_leg_direction'],[1.,0.,0.]);self.assertFalse(r['direction_is_observed'])
 def test_closed_portal_and_fast_teleport_rejected(self):
  self.assertFalse(self.graph.transition([0,0,0],[.4,0,.4],100,scenario='closed',position_uncertainty_native=0)['possible'])
  self.assertFalse(self.graph.transition([0,0,0],[.4,0,.4],.01,position_uncertainty_native=0)['possible'])
  self.assertFalse(self.graph.transition([99,0,99],[0,0,0],100)['possible'])
 def test_pause_has_no_invented_finite_timeout(self):
  r=self.graph.transition([0,0,0],[.4,0,.4],3600,position_uncertainty_native=0)
  self.assertTrue(r['possible']);self.assertIsNone(r['pause_time_upper_bound'])
 def test_loss_candidates_are_reachable_hypotheses_not_observations(self):
  opened=self.graph.loss_hypothesis([0,0,0],10);closed=self.graph.loss_hypothesis([0,0,0],10,scenario='closed')
  self.assertIn('C4-S1',opened['candidate_sensors']);self.assertNotIn('C4-S1',closed['candidate_sensors']);self.assertEqual(opened['observations_created'],0);self.assertGreater(opened['blind_reachable_cells'],0)
 def test_missing_detection_is_graded_never_identity_loss(self):
  r=self.graph.negative_evidence([0,0,0],'C-S1',100)
  self.assertEqual(r['uncalibrated_penalty'],.15);self.assertFalse(r['identity_rejected']);self.assertEqual(r['observations_created'],0)
  self.assertEqual(self.graph.negative_evidence([0,0,0],'C4-S1',100)['uncalibrated_penalty'],0)
 def test_actor_metadata_invalid_edges_and_invalid_clock_rejected(self):
  for change in [lambda d:d.update(actor_id='forbidden'),lambda d:d['scenarios']['closed'].update(actor_id='forbidden'),lambda d:d['scenarios']['closed']['edges'].append([0,4,100]),lambda d:d['scenarios']['closed']['visibility_masks'].__setitem__(0,256)]:
   d=fixture();change(d)
   with self.assertRaises(ValueError):SpatialSensorGraph(d)
  for elapsed in [-1,float('nan')]:
   with self.assertRaises(ValueError):self.graph.loss_hypothesis([0,0,0],elapsed)
if __name__=='__main__':unittest.main()
