"""Privileged evaluation AFTER MTMC. Never imported or mounted by inference."""
import collections
import hashlib
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
trial=ROOT/'simulation/spatial-office/.runtime/cctv-trial-trial-a'
out=trial/'output/tiles025'
tracks=json.loads((out/'tracks-tuned.json').read_text())
result=json.loads((out/'global-tracks.json').read_text())
reid=json.loads((out/'reid-evidence.json').read_text())
labels={(x['camera_id'],x['frame_index']):x for x in json.loads((trial/'evaluator/labels.json').read_text())}
source={(f['camera_id'],f['frame_index'],t['local_track_id']):(f,t) for f in tracks['frames'] for t in f['tracks']}
assigned={};byframe=collections.defaultdict(list);members={}
for group in result['groups']:
    for member in group['local_tracks']:
        assert member not in members;members[member]=group['id']
    for obs in group['observations']:
        key=obs['camera_id'],obs['frame_index'],obs['local_track_id']
        assert key not in assigned and key in source
        frame,track=source[key]
        assert all(obs[k]==frame[k] for k in ['camera_id','frame_index','observed_at','media_time_seconds','frame_sha256'])
        assert all(obs[k]==v for k,v in track.items())
        assigned[key]=group['id'];byframe[key[:2]].append(obs)
assert set(assigned)==set(source)

def iou(a,b):
    if b is None:return 0.
    area=max(0,min(a[2],b[2])-max(a[0],b[0]))*max(0,min(a[3],b[3])-max(a[1],b[1]))
    return area/max(1e-9,(a[2]-a[0])*(a[3]-a[1])+(b[2]-b[0])*(b[3]-b[1])-area)

actor_groups=set();sensors=collections.defaultdict(lambda:{'matched_valid':0,'global_ids':set()})
valid=matched=false=0
for key,label in labels.items():
    rows=byframe[key];ranked=sorted([(iou(x['bbox'],label['visible_bbox']),x['local_track_id']) for x in rows],reverse=True)
    false+=sum(score<.3 for score,_ in ranked)+max(0,sum(score>=.3 for score,_ in ranked)-1)
    valid+=label['useful']
    if label['useful'] and ranked and ranked[0][0]>=.3:
        identity=members[ranked[0][1]];actor_groups.add(identity);matched+=1
        sensors[key[0]]['matched_valid']+=1;sensors[key[0]]['global_ids'].add(identity)
for sensor in sensors.values():sensor['global_ids']=sorted(sensor['global_ids'])
infeasible=sum(len(g['continuity_check']['infeasible_segments']) for g in result['groups'])
internal_conflicts=sum(e['conflict'] and members[e['a']]==members[e['b']] for e in result['associations'])
checks={'single_actor_global_identity':len(actor_groups)==1,'all_eight_sensors_share_identity':len(sensors)==8 and all(set(s['global_ids'])==actor_groups for s in sensors.values()),
        'zero_residual_actor_fragmentation':len(actor_groups)-1==0,'no_internal_pair_contradictions':internal_conflicts==0,
        'no_infeasible_full_sequence_segments':infeasible==0,'all_original_observations_preserved_exactly':True,
        'actor_count_not_used_by_inference':result['expected_actor_count_used'] is False,
        'no_civil_identity_or_fabricated_gap_observations':result['no_observations_created'] and all(g['civil_person_id'] is None for g in result['groups'])}
report={'phase':'P2-09.16','run':'trial-a','checks':checks,'technical_gate_passed':all(checks.values()),
        'global_groups':len(result['groups']),'actor_global_id_count':len(actor_groups),'residual_actor_fragmentations':len(actor_groups)-1,
        'local_tracklets':len(members),'original_observations':len(assigned),'matched_valid_observations':matched,'valid_opportunities':valid,
        'false_or_duplicate_observations':false,'per_sensor':dict(sensors),
        'provisional_associations':sum(e.get('decision')=='associated provisionally' for e in result['associations']),
        'continuity':[g['continuity_check'] for g in result['groups']],
        'osnet_seconds':reid['processing_seconds'],'mtmc_seconds':result['processing_seconds'],
        'model_sha256':result['model_sha256'],'graph_sha256':result['graph_sha256'],
        'input_tracks_sha256':reid['tracks_sha256'],'output_sha256':hashlib.sha256((out/'global-tracks.json').read_bytes()).hexdigest(),
        'limitations':['One tuning corpus; five held-out trials pending09.18','Single actor cannot estimate multiperson false merge rate',
                       'Four false/localization/duplicate source observations remain associated, not hidden',
                       'Body-support projection is uncertain; generic height2.0 native is a prior, not actor pose or measured body height',
                       'Geometry-disagreeing instants remain unresolved; feasible path is not observed trajectory',
                       'Offline full-corpus association; live causal MTMC and Core persistence not validated'],
        'human_final_acceptance':False}
folder=ROOT/'docs/spatial-simulation/evidence/p2-09/09.16/trial-a';folder.mkdir(parents=True,exist_ok=True)
(folder/'evaluation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report))
