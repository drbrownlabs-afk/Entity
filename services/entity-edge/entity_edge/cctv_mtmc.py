"""Anonymous, evidence-backed batch MTMC using OSNet and static walkable topology.

Association scores are engineering gates, not calibrated probabilities. Components
are checked for pairwise contradictions before merging; unknown is not impossible.
No actor count, route, evaluator label or civil identity is accepted as input.
"""
import argparse
import collections
import hashlib
import itertools
import json
import time
from pathlib import Path

import numpy as np
from scipy.sparse.csgraph import dijkstra
from entity_edge.spatial_graph import SpatialSensorGraph


POLICY = {'appearance_overlap_min': .60, 'appearance_gap_min': .65,
          'position_uncertainty_native': 1.2, 'minimum_pair_samples': 3,
          'ambiguous_score_margin': .03, 'scenario': 'security-open',
          'generic_body_height_native': 2.0, 'minimum_projected_height_fraction': .65}


def cosine(a, b):
    return float(np.dot(a, b)/max(1e-9, np.linalg.norm(a)*np.linalg.norm(b)))


def candidate_cells(camera, box, graph, policy=POLICY):
    """Conservative floor support from observed bbox and static camera geometry.

    Occluded/truncated feet invalidate a bottom-ray point. Intersect a generic
    vertical body support with the box instead, without reading actual body pose.
    Result is a set of hypotheses, including potentially disconnected regions.
    """
    nodes=graph.scenarios[policy['scenario']]['nodes'];position=np.asarray(camera['position'])
    forward=np.asarray(camera['target'])-position;forward/=np.linalg.norm(forward)
    right=np.cross(forward,[0,1,0]);right/=np.linalg.norm(right);up=np.cross(right,forward)
    K=np.asarray(camera['K']);points=np.repeat(nodes[:,None,:],9,axis=1)
    points[:,:,1]+=np.linspace(0,policy['generic_body_height_native'],9)[None,:]
    relative=points-position;depth=relative@forward
    x=K[0,2]+K[0,0]*(relative@right)/np.maximum(depth,1e-6)
    y=K[1,2]-K[1,1]*(relative@up)/np.maximum(depth,1e-6)
    width=box[2]-box[0];height=box[3]-box[1]
    inside=(x>=box[0]+.15*width)&(x<=box[2]-.15*width)&(y>=box[1]-.1*height)&(y<=box[3]+.1*height)&(depth>0)
    projected_height=np.max(y,axis=1)-np.min(y,axis=1)
    return np.flatnonzero(inside.any(axis=1)&(projected_height>=height*policy['minimum_projected_height_fraction'])).tolist()


def region_transition(graph, source, target, elapsed, policy, source_cells=None, target_cells=None):
    """Existential reachability between uncertainty regions, not nearest-cell snap.

    Explicit image-derived support sets take precedence over point-radius test
    fixtures. Never subtract uncertainty twice. A path is only a hypothesis.
    """
    data=graph.scenarios[policy['scenario']];nodes=data['nodes']
    radius=policy['position_uncertainty_native']
    a=np.asarray(source_cells,dtype=int) if source_cells is not None else np.flatnonzero(np.linalg.norm(nodes-np.asarray(source),axis=1)<=radius)
    b=np.asarray(target_cells,dtype=int) if target_cells is not None else np.flatnonzero(np.linalg.norm(nodes-np.asarray(target),axis=1)<=radius)
    base={'source_candidate_cells':len(a),'target_candidate_cells':len(b),
          'scenario_assumption':policy['scenario'],
          'support_method':'projected generic body support in observed box' if source_cells is not None else 'point-radius fixture',
          'position_uncertainty_native':None if source_cells is not None else radius,
          'path_is_observed':False,'probability_calibrated':False,'pause_time_upper_bound':None}
    if not len(a) or not len(b):return base|{'possible':False,'reason':'outside calibrated walkable cells'}
    if np.intersect1d(a,b).size:return base|{'possible':True,'reason':'uncertainty regions overlap','path_length_native':0.,'minimum_travel_seconds':0.}
    if not np.intersect1d(data['labels'][a],data['labels'][b]).size:
        return base|{'possible':False,'reason':'disconnected uncertainty regions'}
    distances=dijkstra(data['matrix'],directed=False,indices=a,min_only=True)
    length=float(np.min(distances[b]));minimum=length/graph.maximum_speed
    return base|{'possible':elapsed+1e-6>=minimum,'reason':'reachable within native speed bound' if elapsed+1e-6>=minimum else 'would exceed native speed bound',
                 'path_length_native':length,'minimum_travel_seconds':minimum}


def pair_evidence(a, b, graph, policy=POLICY):
    same_sensor = a[0]['camera_id'] == b[0]['camera_id']
    bytime = {x['media_time_seconds']: x for x in b}
    common = [(x, bytime[x['media_time_seconds']]) for x in a if x['media_time_seconds'] in bytime]
    tolerance=policy.get('sync_tolerance_seconds',0)
    if tolerance and not same_sensor:
        # Opt-in causal feeds have independent capture times. Match available
        # samples one-to-one; preserve their real timestamps and elapsed travel.
        remaining=set(range(len(b)));common=[]
        for x in a:
            if not remaining:break
            j=min(remaining,key=lambda j:abs(x['media_time_seconds']-b[j]['media_time_seconds']))
            if abs(x['media_time_seconds']-b[j]['media_time_seconds'])<=tolerance:
                common.append((x,b[j]));remaining.remove(j)
    result = {'accepted_candidate': False, 'conflict': False, 'simultaneous_samples': len(common),
              'score_is_probability': False, 'observations_created': 0}
    def references(rows):
        return [{k:x[k] for k in ['camera_id','local_track_id','frame_index','observed_at','frame_sha256',
                    'association_confirmation_evidence_at','association_confirmation_media_seconds'] if k in x} for x in rows]
    if common and same_sensor:
        return result | {'conflict': True, 'reason': 'distinct simultaneous local tracks in same sensor'}
    if common:
        pairs = [(x,y) for x,y in common if x['floor_estimate_native'] is not None and y['floor_estimate_native'] is not None]
        if len(pairs) < policy['minimum_pair_samples']:
            return result | {'reason': 'insufficient simultaneous geometry evidence'}
        sim = float(np.median([cosine(x['embedding'],y['embedding']) for x,y in pairs]))
        checks = [region_transition(graph,x['floor_estimate_native'],y['floor_estimate_native'],abs(x['media_time_seconds']-y['media_time_seconds']),policy,x.get('candidate_floor_cells'),y.get('candidate_floor_cells')) for x,y in pairs]
        known = [c for c in checks if c['reason'] != 'outside calibrated walkable cells']
        fraction = sum(c['possible'] for c in known)/max(1,len(known))
        conflict = len(known) >= 3 and fraction < .2
        possible = len(known) >= 3 and fraction >= .6
        result |= {'kind':'overlap','appearance_similarity':sim,'spatial_compatible_fraction':fraction,
                   'evidence_observations':references([z for pair in pairs for z in pair]),
                   'spatial_samples':len(known),'conflict':conflict,'score':sim,
                   'accepted_candidate':possible and sim>=policy['appearance_overlap_min'],
                   'reason':'simultaneous appearance and uncertain walkable floor consistency'}
    else:
        first, second = (a,b) if a[-1]['media_time_seconds'] < b[0]['media_time_seconds'] else (b,a)
        if first[-1]['media_time_seconds'] >= second[0]['media_time_seconds']:
            return result | {'reason':'interleaved observations without synchronized evidence'}
        tail = [x for x in first[-3:] if x['floor_estimate_native'] is not None]
        head = [x for x in second[:3] if x['floor_estimate_native'] is not None]
        if len(tail)<3 or len(head)<3:
            return result | {'reason':'insufficient boundary evidence'}
        source = np.median([x['floor_estimate_native'] for x in tail],axis=0)
        target = np.median([x['floor_estimate_native'] for x in head],axis=0)
        dt = float(np.median([x['media_time_seconds'] for x in head])-np.median([x['media_time_seconds'] for x in tail]))
        # Use actual boundary frames and their support sets. Median point alone
        # can cross a wall or floor discontinuity and destroy valid hypotheses.
        x,y=tail[-1],head[0];dt=y['media_time_seconds']-x['media_time_seconds']
        transition = region_transition(graph,x['floor_estimate_native'],y['floor_estimate_native'],dt,policy,x.get('candidate_floor_cells'),y.get('candidate_floor_cells'))
        sim = cosine(np.mean([x['embedding'] for x in tail],axis=0),np.mean([x['embedding'] for x in head],axis=0))
        def direction(rows):
            delta=np.asarray(rows[-1]['floor_estimate_native'])-rows[0]['floor_estimate_native']
            return (delta/max(float(np.linalg.norm(delta)),1e-9)).tolist()
        result |= {'kind':'gap','appearance_similarity':sim,'score':sim,'transition':transition,
                   'evidence_observations':references(tail+head),
                   'boundary_elapsed_seconds':dt,'source_image_derived_direction':direction(tail),
                   'target_image_derived_direction':direction(head),'direction_is_uncertain':True,
                   'conflict':not transition['possible'] and transition['reason']!='outside calibrated walkable cells',
                   'accepted_candidate':transition['possible'] and sim>=policy['appearance_gap_min'],
                   'reason':'appearance and geodesic speed/connectivity gate; no maximum pause assumed'}
    return result


def constrained_components(keys, edges, margin=.03):
    """Reject ambiguous alternatives and contradictions across the entire union."""
    groups={k:{k} for k in keys}
    conflicts={frozenset((e['a'],e['b'])) for e in edges if e['conflict']}
    candidates=[e for e in edges if e['accepted_candidate'] and not e['conflict']]
    ambiguous=set()
    for x,y in itertools.combinations(candidates,2):
        shared={x['a'],x['b']}&{y['a'],y['b']}
        alternatives=({x['a'],x['b']}|{y['a'],y['b']})-shared
        if len(shared)==1 and frozenset(alternatives) in conflicts and abs(x['score']-y['score'])<=margin:
            ambiguous.update((id(x),id(y)))
    for edge in sorted(candidates,key=lambda e:(-e['score'],e['a'],e['b'])):
        ga,gb=groups[edge['a']],groups[edge['b']]
        if id(edge) in ambiguous:
            edge['decision']='uncertain: incompatible alternatives have similar evidence';continue
        if any(frozenset((a,b)) in conflicts for a in ga for b in gb if a!=b):
            edge['decision']='rejected: component contains contradictory evidence';continue
        merged=ga|gb
        for member in merged:groups[member]=merged
        edge['decision']='associated provisionally'
    unique={tuple(sorted(g)) for g in groups.values()}
    return sorted(unique)


def continuity_check(rows, graph, policy):
    """Conservative existence of a speed-bounded path through image supports.

    Disagreeing views remain unresolved rather than choosing the correct camera
    from evaluator knowledge. No sample in a visual gap is created or located.
    """
    bytime=collections.defaultdict(list)
    for row in rows:bytime[row['media_time_seconds']].append(row)
    data=graph.scenarios[policy['scenario']];reachable=None;last=None
    failures=[];unresolved=[];checked=0;largest_gap=0
    for instant,observations in sorted(bytime.items()):
        supports=[set(x.get('candidate_floor_cells',[])) for x in observations]
        supports=[s for s in supports if s]
        if not supports:unresolved.append(instant);continue
        candidates=set.intersection(*supports)
        if not candidates:
            unresolved.append(instant);continue
        candidates=np.asarray(sorted(candidates),dtype=int)
        if reachable is not None:
            dt=instant-last;largest_gap=max(largest_gap,dt)
            distances=dijkstra(data['matrix'],directed=False,indices=reachable,min_only=True,limit=graph.maximum_speed*dt+1e-6)
            candidates=candidates[np.isfinite(distances[candidates])]
            if not len(candidates):
                failures.append({'from_media_seconds':last,'to_media_seconds':instant,'reason':'no speed-bounded path through retained support hypotheses'})
                reachable=None;last=None;continue
        reachable=candidates;last=instant;checked+=1
    return {'checked_observed_instants':checked,'unresolved_view_geometry_instants':unresolved,
            'infeasible_segments':failures,'largest_observation_gap_seconds':largest_gap,
            'path_is_observed':False,'observations_created':0,
            'meaning':'existence of a path through uncertain image-derived support; not recovered ground-truth trajectory'}


def associate(evidence,graph,policy=POLICY):
    tracklets=collections.defaultdict(list)
    for row in evidence['observations']:
        allowed={'camera_id','local_track_id','media_time_seconds','frame_index','observed_at','frame_sha256',
                 'embedding','floor_estimate_native','candidate_floor_cells','location_semantics','bbox','confidence',
                 'position','position_anchor','position_is_filtered_estimate','confirmed_at_frame_index',
                 'association_confirmation_evidence_at','association_confirmation_media_seconds','associated_after_confirmation'}
        if set(row)-allowed:raise ValueError('Unexpected observation fields')
        if row['camera_id'] not in graph.sensors or not row['local_track_id'].startswith(row['camera_id']+':'):
            raise ValueError('Sensor/local-track provenance mismatch')
        if len(row['embedding'])!=512 or not np.isfinite(row['embedding']).all():
            raise ValueError('Invalid appearance descriptor')
        tracklets[row['local_track_id']].append(row)
    for rows in tracklets.values():rows.sort(key=lambda x:x['media_time_seconds'])
    keys=sorted(tracklets);edges=[]
    for a,b in itertools.combinations(keys,2):
        edge=pair_evidence(tracklets[a],tracklets[b],graph,policy)
        edge |= {'a':a,'b':b,'source_sensor':tracklets[a][0]['camera_id'],'target_sensor':tracklets[b][0]['camera_id']}
        edges.append(edge)
    components=constrained_components(keys,edges,policy['ambiguous_score_margin'])
    groups=[]
    for component in components:
        rows=[x for k in component for x in tracklets[k]]
        anchor=min(rows,key=lambda x:(x['media_time_seconds'],x['camera_id'],x['local_track_id']))
        identity_anchor='|'.join(str(anchor[k]) for k in ['camera_id','local_track_id','observed_at','frame_sha256'])
        groups.append({'id':'visual-'+hashlib.sha256(identity_anchor.encode()).hexdigest()[:20],
            'identity_anchor_semantics':'earliest source observation; later appended evidence does not rename this hypothesis',
            'local_tracks':list(component),'sensors':sorted({x['camera_id'] for x in rows}),
            'civil_person_id':None,'identity_verified':False,'association':'provisional batch inference',
            'first_observed_media_seconds':min(x['media_time_seconds'] for x in rows),
            'last_observed_media_seconds':max(x['media_time_seconds'] for x in rows),
            'observations':[{k:v for k,v in x.items() if k not in {'embedding','candidate_floor_cells','floor_estimate_native'}} for x in sorted(rows,key=lambda x:(x['media_time_seconds'],x['camera_id']))]})
        groups[-1]['continuity_check']=continuity_check(rows,graph,policy)
    return {'algorithm':'OSNet-AIN + static geodesic constraints + contradiction-aware components',
            'execution_mode':'offline full-corpus association; not causal live identity assignment',
            'association_available_media_seconds':max((max(x['media_time_seconds'],x.get('association_confirmation_media_seconds',0)) for rows in tracklets.values() for x in rows),default=0),
            'policy':policy,'probability_calibrated':False,'expected_actor_count_used':False,
            'no_observations_created':True,'location_during_gaps':'unknown; graph paths are hypotheses only',
            'model_sha256':evidence['model_sha256'],'groups':groups,'associations':edges}


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--input',type=Path,required=True)
    parser.add_argument('--graph',type=Path,required=True);parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--calibration',type=Path,required=True)
    args=parser.parse_args();started=time.perf_counter()
    evidence=json.loads(args.input.read_text());graph=SpatialSensorGraph(args.graph)
    if hashlib.sha256(args.calibration.read_bytes()).hexdigest()!=evidence['calibration_sha256']:
        raise ValueError('ReID/calibration provenance mismatch')
    cameras={c['id']:c for c in json.loads(args.calibration.read_text())['cameras']}
    for row in evidence['observations']:
        row['candidate_floor_cells']=candidate_cells(cameras[row['camera_id']],row['bbox'],graph)
    result=associate(evidence,graph)
    result['graph_sha256']=hashlib.sha256(args.graph.read_bytes()).hexdigest()
    result['processing_seconds']=time.perf_counter()-started
    args.output.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'groups':len(result['groups']),'local_tracks':sum(len(g['local_tracks']) for g in result['groups']),
                     'accepted_associations':sum(e.get('decision')=='associated provisionally' for e in result['associations']),
                     'processing_seconds':result['processing_seconds']}))


if __name__=='__main__':main()
