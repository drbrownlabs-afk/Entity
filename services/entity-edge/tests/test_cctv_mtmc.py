import unittest
from entity_edge.cctv_mtmc import POLICY, associate, constrained_components, continuity_check, pair_evidence, region_transition
from entity_edge.spatial_graph import SpatialSensorGraph
from test_spatial_graph import fixture


def rows(sensor, identity, times, point):
    return [{'camera_id':sensor,'local_track_id':sensor+':'+identity,'media_time_seconds':t,
             'frame_index':int(t*2),'observed_at':str(t),'frame_sha256':'abc',
             'embedding':[1.]+[0.]*511,'floor_estimate_native':point,
             'association_confirmation_media_seconds':t+.5} for t in times]


def edge(a,b,score=.9,conflict=False):
    return {'a':a,'b':b,'score':score,'conflict':conflict,'accepted_candidate':not conflict}


class CCTVMTMCTests(unittest.TestCase):
    def setUp(self):
        self.graph=SpatialSensorGraph(fixture())
        self.policy=POLICY|{'position_uncertainty_native':.01}
    def test_impossible_speed_is_not_overridden_by_identical_appearance(self):
        a=rows('C-S1','one',[0,.1,.2],[0,0,0]);b=rows('C-S2','two',[.21,.3,.4],[.4,0,.4])
        result=pair_evidence(a,b,self.graph,self.policy)
        self.assertTrue(result['conflict']);self.assertFalse(result['accepted_candidate'])
    def test_closed_topology_is_not_overridden_by_long_pause(self):
        p=self.policy|{'scenario':'closed'}
        r=region_transition(self.graph,[0,0,0],[.4,0,.4],100,p)
        self.assertFalse(r['possible']);self.assertEqual(r['reason'],'disconnected uncertainty regions')
    def test_uncertainty_region_does_not_choose_only_nearest_cell(self):
        p=self.policy|{'scenario':'closed'}
        r=region_transition(self.graph,None,None,1,p,[0,2],[3,4])
        self.assertTrue(r['possible']);self.assertFalse(r['path_is_observed'])
    def test_same_sensor_simultaneous_local_ids_are_not_unconditionally_merged(self):
        a=rows('C-S1','a',[0,1,2],[0,0,0]);b=rows('C-S1','b',[0,1,2],[0,0,0])
        self.assertTrue(pair_evidence(a,b,self.graph,self.policy)['conflict'])
    def test_transitive_chain_cannot_merge_contradictory_endpoints(self):
        edges=[edge('a','b',.95),edge('b','c',.8),edge('a','c',conflict=True)]
        groups=constrained_components(['a','b','c'],edges)
        self.assertEqual(groups,[('a','b'),('c',)])
        self.assertIn('contradictory',edges[1]['decision'])
    def test_tied_incompatible_hypotheses_remain_separate(self):
        edges=[edge('a','b',.9),edge('a','c',.89),edge('b','c',conflict=True)]
        self.assertEqual(constrained_components(['a','b','c'],edges),[('a',),('b',),('c',)])
    def test_gap_retains_identity_but_creates_no_missing_observations(self):
        data=rows('C-S1','a',[0,1,2],[0,0,0])+rows('C-S2','b',[100,101,102],[.4,0,.4])
        evidence={'model_sha256':'test','observations':data}
        result=associate(evidence,self.graph,self.policy)
        self.assertEqual(len(result['groups']),1)
        self.assertEqual(len(result['groups'][0]['observations']),6)
        self.assertIsNone(result['groups'][0]['civil_person_id'])
        self.assertEqual(result['association_available_media_seconds'],102.5)
        self.assertEqual(result['groups'][0]['observations'][0]['observed_at'],'0')
        self.assertFalse(result['expected_actor_count_used'])
    def test_sensor_provenance_mismatch_rejected(self):
        data=rows('C-S1','a',[0,1,2],[0,0,0]);data[0]['camera_id']='C-S2'
        with self.assertRaises(ValueError):associate({'model_sha256':'test','observations':data},self.graph)
    def test_unknown_geometry_does_not_confirm_an_association(self):
        a=rows('C-S1','a',[0,1,2],[99,0,99]);b=rows('C-S2','b',[3,4,5],[0,0,0])
        result=pair_evidence(a,b,self.graph,self.policy)
        self.assertFalse(result['conflict']);self.assertFalse(result['accepted_candidate'])
    def test_actor_field_is_rejected(self):
        data=rows('C-S1','a',[0,1,2],[0,0,0]);data[0]['actor_id']='forbidden'
        with self.assertRaises(ValueError):associate({'model_sha256':'test','observations':data},self.graph)
    def test_full_sequence_detects_a_teleport_even_inside_one_local_track(self):
        data=rows('C-S1','a',[0,.01],[0,0,0])
        data[0]['candidate_floor_cells']=[0];data[1]['candidate_floor_cells']=[4]
        self.assertEqual(len(continuity_check(data,self.graph,self.policy)['infeasible_segments']),1)
    def test_inconsistent_views_remain_unresolved_not_fabricated_position(self):
        data=rows('C-S1','a',[0],[0,0,0])+rows('C-S2','b',[0],[.4,0,.4])
        data[0]['candidate_floor_cells']=[0];data[1]['candidate_floor_cells']=[4]
        result=continuity_check(data,self.graph,self.policy)
        self.assertEqual(result['unresolved_view_geometry_instants'],[0]);self.assertEqual(result['observations_created'],0)
    def test_appending_later_evidence_preserves_identity_anchor(self):
        data=rows('C-S1','a',[0,1,2],[0,0,0]);first=associate({'model_sha256':'test','observations':data},self.graph,self.policy)
        later=data+rows('C-S2','b',[100,101,102],[.4,0,.4])
        second=associate({'model_sha256':'test','observations':later},self.graph,self.policy)
        self.assertEqual(first['groups'][0]['id'],second['groups'][0]['id'])


if __name__=='__main__':unittest.main()
