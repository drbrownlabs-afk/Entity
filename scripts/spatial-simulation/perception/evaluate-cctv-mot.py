"""Evaluate local tracks only after inference; privileged labels stay private."""
import argparse,json
from collections import defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
p=argparse.ArgumentParser();p.add_argument('--run',required=True);p.add_argument('--experiment',required=True);p.add_argument('--tracks',default='tracks-tuned.json');p.add_argument('--phase',choices=['09.15','09.18'],default='09.15');a=p.parse_args();assert all(x.replace('-','').replace('_','').isalnum() for x in [a.run,a.experiment]);assert a.tracks in ['tracks.json','tracks-tuned.json']
r=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{a.run}';out=r/f'output/{a.experiment}';tracks=json.loads((out/a.tracks).read_text());detections={(f['camera_id'],f['frame_index']):f for f in json.loads((out/'detections.json').read_text())['frames']};labels={(f['camera_id'],f['frame_index']):f for f in json.loads((r/'evaluator/labels.json').read_text())}
def iou(a,b):
 if b is None:return 0.
 area=max(0,min(a[2],b[2])-max(a[0],b[0]))*max(0,min(a[3],b[3])-max(a[1],b[1]));return area/max(1e-9,(a[2]-a[0])*(a[3]-a[1])+(b[2]-b[0])*(b[3]-b[1])-area)
stats=defaultdict(lambda:{'valid':0,'matched_observations':0,'false_track_observations':0,'continuous_visible_id_switches':0,'local_ids':set()});last={}
for f in tracks['frames']:
 key=f['camera_id'],f['frame_index'];truth=labels[key];raw=detections[key];s=stats[f['camera_id']];s['valid']+=truth['useful'];assert raw['frame_sha256']==f['frame_sha256']
 if not raw['detections']:assert not f['tracks'],'Stale prediction reported as observation'
 for track in f['tracks']:assert any(track['bbox']==d['bbox'] and track['confidence']==d['confidence'] for d in raw['detections']),'Track has no fresh pixel detection'
 ranked=sorted([(iou(t['bbox'],truth['visible_bbox']),t['local_track_id']) for t in f['tracks']],reverse=True);matched=ranked and ranked[0][0]>=.3;s['matched_observations']+=bool(truth['useful'] and matched);s['false_track_observations']+=sum(score<.3 for score,_ in ranked)+max(0,sum(score>=.3 for score,_ in ranked)-1)
 if not truth['useful']:last.pop(f['camera_id'],None)
 elif matched:
  identity=ranked[0][1];s['local_ids'].add(identity);previous=last.get(f['camera_id']);s['continuous_visible_id_switches']+=int(previous is not None and previous!=identity);last[f['camera_id']]=identity
for s in stats.values():s['local_ids']=sorted(s['local_ids']);s['observation_recall']=s['matched_observations']/s['valid']
report={'phase':'P2-'+a.phase,'experiment':a.experiment,'tracks_file':a.tracks,'per_sensor':dict(stats),'continuous_visible_id_switches':sum(s['continuous_visible_id_switches'] for s in stats.values()),'false_track_observations':sum(s['false_track_observations'] for s in stats.values()),'all_tracks_from_fresh_detections':True,'predictions_reported_as_observations':False,'initialization_and_loss_policy':tracks.get('parameters',tracks.get('tracker')),'global_identity_validated':False,'gate_passed':False}
folder=ROOT/f'docs/spatial-simulation/evidence/p2-09/{a.phase}/{a.run}/{a.experiment}';folder.mkdir(parents=True,exist_ok=True);(folder/('mot-'+a.tracks)).write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report))
