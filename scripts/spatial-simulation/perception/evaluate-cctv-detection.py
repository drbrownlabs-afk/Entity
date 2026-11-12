"""Post-inference evaluator only; never mounted in the perception worker."""
import argparse,json
from collections import defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
p=argparse.ArgumentParser();p.add_argument('--run',required=True);p.add_argument('--experiment',required=True);a=p.parse_args();assert all(s.replace('-','').replace('_','').isalnum() for s in [a.run,a.experiment])
r=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{a.run}';detections=json.loads((r/f'output/{a.experiment}/detections.json').read_text());labels=json.loads((r/'evaluator/labels.json').read_text());truth={(x['camera_id'],x['frame_index']):x for x in labels}
def iou(a,b):
 if b is None:return 0.
 area=max(0,min(a[2],b[2])-max(a[0],b[0]))*max(0,min(a[3],b[3])-max(a[1],b[1]));return area/max(1e-9,(a[2]-a[0])*(a[3]-a[1])+(b[2]-b[0])*(b[3]-b[1])-area)
stats=defaultdict(lambda:{'valid':0,'matched':0,'false_positive_boxes':0,'boxes':0});details=[]
for frame in detections['frames']:
 t=truth[(frame['camera_id'],frame['frame_index'])];scores=[iou(d['bbox'],t['visible_bbox']) for d in frame['detections']];best=max(scores,default=0);s=stats[frame['camera_id']];s['valid']+=t['useful'];s['matched']+=bool(t['useful'] and best>=.3);s['boxes']+=len(scores);s['false_positive_boxes']+=sum(score<.3 for score in scores)+max(0,sum(score>=.3 for score in scores)-1);details.append({'camera_id':frame['camera_id'],'frame_index':frame['frame_index'],'valid':t['useful'],'matched':best>=.3,'best_iou':best})
for s in stats.values():s['recall']=s['matched']/s['valid'] if s['valid'] else None
valid=sum(s['valid'] for s in stats.values());matched=sum(s['matched'] for s in stats.values());report={'phase':'P2-09.15','experiment':a.experiment,'iou_threshold':.3,'valid_opportunities':valid,'matched':matched,'recall':matched/valid,'false_positive_boxes':sum(s['false_positive_boxes'] for s in stats.values()),'per_sensor':dict(stats),'detection_target_passed':matched/valid>=.95,'mot_validated':False,'gate_passed':False,'model_sha256':detections['model_sha256'],'threshold':detections['threshold'],'processing_seconds':detections['processing_seconds'],'frames_per_second':detections['frames_per_second']}
(r/f'evaluator/{a.experiment}-detection-detail.json').write_text(json.dumps(details,indent=2)+'\n',encoding='utf-8');out=ROOT/f'docs/spatial-simulation/evidence/p2-09/09.15/{a.run}/{a.experiment}';out.mkdir(parents=True,exist_ok=True);(out/'detection-checks.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report))
