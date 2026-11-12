"""Privileged post-inference evaluator. Never imported/mounted by pixel worker."""
import argparse
import collections
import hashlib
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]


def iou(a,b):
    if b is None:return 0.
    area=max(0,min(a[2],b[2])-max(a[0],b[0]))*max(0,min(a[3],b[3])-max(a[1],b[1]))
    return area/max(1e-9,(a[2]-a[0])*(a[3]-a[1])+(b[2]-b[0])*(b[3]-b[1])-area)


def evaluate(run,corpus):
    folder=ROOT/'simulation/spatial-office/.runtime'/('causal19-'+run)
    status=json.loads((folder/'status.json').read_text())
    if status['state']!='done':raise RuntimeError('Inference must finish before evaluation')
    labels=json.loads((ROOT/'simulation/spatial-office/.runtime'/('cctv-trial-'+corpus)/'evaluator/labels.json').read_text())
    labels={(r['camera_id'],r['frame_index']):r for r in labels}
    manifest=json.loads((ROOT/'simulation/spatial-office/.runtime'/('cctv-trial-'+corpus)/'frames/manifest.json').read_text())
    times={(f['camera_id'],f['frame_index']):f['media_time_seconds'] for f in manifest['frames']}
    frames=[json.loads(line) for line in (folder/'frames.jsonl').read_text().splitlines()]
    seen=set();owner={};aliases={};statuses={};events=[];actor_locals=set();confirmed_actor_locals=set();local_switches=0;last={};support=collections.Counter()
    matched=valid=false=confirmed_matched=0;sensors=collections.defaultdict(lambda:{'valid':0,'matched':0,'false_or_duplicate_tracks':0})
    for result in frames:
        frame=result['frame'];key=frame['camera_id'],frame['frame_index'];seen.add(key)
        for revision in result['revisions']:
            events.append(revision)
            for member in revision['members']:owner[member['source_id'],member['stream_session_id'],member['local_track_id']]=revision['global_track_id']
            for alias in revision['supersedes']:aliases[alias]=revision['global_track_id']
            statuses[revision['global_track_id']]=revision['status']
        truth=labels[key];s=sensors[key[0]];valid+=truth['useful'];s['valid']+=truth['useful']
        ranked=sorted([(iou(t['bbox'],truth['visible_bbox']),j,t) for j,t in enumerate(frame['tracks'])],key=lambda x:(x[0],x[1]),reverse=True)
        for _,_,track in ranked:
            if not any(track['bbox']==d['bbox'] and track['confidence']==d['confidence'] for d in result['detections']):raise RuntimeError('Predicted or mutated image observation')
        errors=sum(score<.3 for score,_,_ in ranked)+max(0,sum(score>=.3 for score,_,_ in ranked)-1)
        false+=errors;s['false_or_duplicate_tracks']+=errors
        hit=bool(ranked and ranked[0][0]>=.3)
        matched+=bool(truth['useful'] and hit);s['matched']+=bool(truth['useful'] and hit)
        if hit and truth['visible_pixels']>=20:
            track=ranked[0][2];local=(frame['camera_id'],frame['stream_session_id'],track['local_track_id']);actor_locals.add(local)
            support[local]+=1
            if track['track_status']=='confirmed':confirmed_actor_locals.add(local)
            confirmed_matched+=bool(truth['useful'] and track['track_status']=='confirmed')
            if truth['useful']:
                if key[0] in last and last[key[0]]!=local:local_switches+=1
                last[key[0]]=local
        if not truth['useful']:last.pop(key[0],None)
    # Missing/dropped scheduled images remain in the valid denominator. A short
    # probe deliberately evaluates only its requested source interval.
    report=json.loads((folder/'report.json').read_text());duration=report['source_seconds']
    for key,truth in labels.items():
        if key in seen or times[key]>=duration:continue
        valid+=truth['useful'];sensors[key[0]]['valid']+=truth['useful']
    def canonical(gid):
        visited=set()
        while gid in aliases:
            if gid in visited:raise RuntimeError('Cyclic alias graph')
            visited.add(gid);gid=aliases[gid]
        return gid
    actor_ids={canonical(owner[k]) for k in actor_locals if k in owner}
    roots={canonical(gid) for gid in statuses}
    confirmed_ids={canonical(owner[k]) for k in confirmed_actor_locals if k in owner}
    result={'phase':'P2-09.19','run':run,'corpus':corpus,'processed_frames':len(frames),'valid_opportunities':valid,
        'matched_fresh_observations':matched,'confirmed_local_matched_observations':confirmed_matched,'recall':matched/valid if valid else None,
        'false_or_duplicate_tracks':false,'continuous_visible_local_id_switches':local_switches,
        'final_alias_actor_hypotheses':len(actor_ids),'all_final_hypotheses':len(roots),
        'final_alias_confirmed_local_actor_hypotheses':len(confirmed_ids),
        'final_actor_support_by_hypothesis':{gid:{'status':statuses[gid],
            'matched_frames':sum(count for local,count in support.items() if canonical(owner[local])==gid),
            'local_tracks':[{'sensor':local[0],'local_track_id':local[2],'matched_frames':support[local],
                'ever_locally_confirmed':local in confirmed_actor_locals} for local in sorted(actor_locals) if canonical(owner[local])==gid]}
            for gid in sorted(actor_ids)},
        'final_uncertain_hypotheses':sum(statuses[g]=='uncertain' for g in roots),
        'candidate_revisions':sum(e['status']=='candidate' for e in events),'corroborated_revisions':sum(e['status']=='corroborated' for e in events),
        'uncertainty_revisions':sum(e['status']=='uncertain' for e in events),'per_sensor':dict(sensors),
        'source_results_sha256':hashlib.sha256((folder/'frames.jsonl').read_bytes()).hexdigest(),
        'ground_truth_used_only_after_inference':True,'all_tracks_from_exact_fresh_boxes':True,'phase_gate_passed':False,
        'limitations':['Final aliases are explicitly retrospective evaluation, not evidence of one ID being known from the start',
            'Tentative local observations count in fresh recall and are separately marked in Core',
            'Five corpus regression and ten-minute real-time/live gates must be assessed separately']}
    (folder/'evaluation.json').write_text(json.dumps(result,indent=2)+'\n');return result


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--run',required=True);p.add_argument('--corpus',required=True);a=p.parse_args()
    if not all(x.replace('-','').isalnum() for x in [a.run,a.corpus]):p.error('Invalid experiment')
    print(json.dumps(evaluate(a.run,a.corpus)))
