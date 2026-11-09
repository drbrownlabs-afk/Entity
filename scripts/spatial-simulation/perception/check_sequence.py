"""Evaluator-only sequence validation. Its image deltas/visibility never become detector inputs."""
import json,hashlib,collections,statistics,shutil
from pathlib import Path
from datetime import datetime
import numpy as np
from PIL import Image,ImageDraw
import jsonschema
ROOT=Path(__file__).resolve().parents[3];folder=ROOT/'simulation/spatial-office/.runtime/p2-09-frames';out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.4';meta=json.loads((out/'capture.json').read_text());m=json.loads((folder/'manifest.json').read_text());schema=json.loads((ROOT/'packages/contracts/perception/v1/FrameManifest.json').read_text());jsonschema.validate(m,schema);assert not meta['errors'];assert not meta['short_smoke'];groups=collections.defaultdict(list)
for f in m['frames']:groups[f['camera_id']].append(f)
assert len(groups)==6;expected=len(next(iter(groups.values())));assert expected>=20
canvas=Image.new('RGB',(1152,820),'#161c20');d=ImageDraw.Draw(canvas);evaluator=[];samples=[]
for n,(cam,rows)in enumerate(groups.items()):
 assert len(rows)==expected;assert [f['frame_index']for f in rows]==list(range(expected));background=np.array(Image.open(folder/('background-'+cam+'.png')).convert('RGB'));changed=[];best=None;largest=0
 for i,f in enumerate(rows):
  file=folder/f['file'];assert hashlib.sha256(file.read_bytes()).hexdigest()==f['sha256'];im=Image.open(file).convert('RGB');assert im.size==(1152,648);stamp=datetime.fromisoformat(f['observed_at'].replace('Z','+00:00'))
  if i:assert (stamp-datetime.fromisoformat(rows[i-1]['observed_at'].replace('Z','+00:00'))).total_seconds()==.5
  mask=np.max(abs(np.array(im,dtype=np.int16)-background.astype(np.int16)),axis=2)>12;yy,xx=np.nonzero(mask);area=len(xx);changed.append(area);bbox=[int(xx.min()),int(yy.min()),int(xx.max())+1,int(yy.max())+1]if area>30 else None;evaluator.append({'camera_id':cam,'frame_index':i,'render_delta_box':bbox,'changed_pixels':area})
  if area>largest:largest=area;best=im.copy();best_row=f
 assert sum(v>40 for v in changed)>=2,'No visible moving dummy in '+cam
 assert len(set(f['sha256']for f in rows))>2,'Repeated stills masquerading as sequence'
 best.thumbnail((570,268));x=n%2*576;y=n//2*273;canvas.paste(best,(x,y+20));d.text((x+5,y+3),cam+' | actual frame '+str(best_row['frame_index']),fill='white');shutil.copyfile(folder/best_row['file'],out/(cam+'-sample.png'));samples.append({'camera':cam,'visible_delta_frames':sum(v>40 for v in changed),'largest_delta_pixels':largest})
# Results below are evaluation-only and never mounted into the perception sandbox.
evaldir=ROOT/'simulation/spatial-office/.runtime/p2-09-evaluation';(evaldir/'pixel-evaluation.json').write_text(json.dumps(evaluator,indent=2)+'\n');canvas.save(out/'dummy-views.jpg',quality=92)
report={'gate':'P2-09.4','passed':False,'awaiting_visual_inspection':True,'total_frames':len(m['frames']),'frames_per_camera':expected,'nominal_media_fps':2,'timestamp_skew_seconds':0,'real_wall_capture_ms_median':statistics.median(f['capture_duration_ms']for f in m['frames']),'manifest_schema_passed':True,'sample_views':samples,'ground_truth_evaluator_only':True,'profile':meta['meta']['profile'],'route_collision_check':'all source route points checked against existing CollisionWorld after explicitly opening only existing security doors in the controlled visual scenario; no Core access/door action executed'}
(out/'sequence-checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
