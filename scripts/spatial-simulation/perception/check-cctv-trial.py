"""Validate one-actor corpus. All privileged labels remain evaluator-only."""
import argparse,datetime,hashlib,importlib.util,json,sys,time
from collections import defaultdict
from pathlib import Path
import cv2,jsonschema,numpy as np
ROOT=Path(__file__).resolve().parents[3]
spec=importlib.util.spec_from_file_location('pixel_evaluator',Path(__file__).with_name('evaluator-pixels.py'));pixels=importlib.util.module_from_spec(spec);spec.loader.exec_module(pixels)
p=argparse.ArgumentParser();p.add_argument('--run',required=True);p.add_argument('--phase',choices=['09.14','09.18'],default='09.14');p.add_argument('--image-cache',type=Path);a=p.parse_args();assert a.run.replace('-','').replace('_','').isalnum()
runtime=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{a.run}';frames=runtime/'frames';private=runtime/'evaluator';manifest=json.loads((frames/'manifest.json').read_text());truth=json.loads((private/'truth.json').read_text());plan=json.loads((private/'plan.json').read_text());completion=json.loads((runtime/'capture-complete.json').read_text())
jsonschema.validate(manifest,json.loads((ROOT/'packages/contracts/perception/v1/FrameManifest.json').read_text()))
assert truth['actors']==plan['actors']==1 and not truth['errors'];assert 'explicitly stored depth texture' in truth['render_profile']
assert len(truth['frames'])==len(plan['frames']);assert len(manifest['frames'])==len(truth['frames'])*8==completion['images']
cameras=[c['id'] for c in truth['profile']['cameras']];assert len(cameras)==8
allowed={e['file'] for e in manifest['frames']}|{'manifest.json'}|{'background-'+c+'.png' for c in cameras};assert {x.name for x in frames.iterdir()}==allowed
cv2.setNumThreads(2)
image_frames=a.image_cache/'frames' if a.image_cache else frames
image_private=a.image_cache/'evaluator' if a.image_cache else private
poses={f['frame_index']:f for f in truth['frames']};bytime=defaultdict(set);bycamera=defaultdict(list);labels=[];backgrounds={c:cv2.imread(str(image_frames/f'background-{c}.png')) for c in cameras};start=time.perf_counter()
for entry in manifest['frames']:
 path=image_frames/entry['file'];assert hashlib.sha256(path.read_bytes()).hexdigest()==entry['sha256'];assert entry['camera_id'] in cameras;assert entry['frame_index'] in poses
 index=entry['frame_index'];bytime[index].add(entry['camera_id']);bycamera[entry['camera_id']].append(entry);expected=poses[index]['media_time_seconds'];assert abs(expected-entry['media_time_seconds'])<1e-6
 clock=datetime.datetime.fromisoformat(entry['observed_at'].replace('Z','+00:00')).timestamp();assert abs(clock-datetime.datetime(2026,11,11,14+plan.get('variant',0),tzinfo=datetime.timezone.utc).timestamp()-expected)<.0011
 actual=cv2.imread(str(path));amodal=cv2.imread(str(image_private/entry['file']));assert actual is not None and amodal is not None and actual.shape==amodal.shape==backgrounds[entry['camera_id']].shape
 label=pixels.measure(backgrounds[entry['camera_id']],actual,amodal);labels.append({'camera_id':entry['camera_id'],'frame_index':index,**label})
assert all(s==set(cameras) for s in bytime.values())
speeds=[];pauses=0;turns=0
for first,last in zip(truth['frames'],truth['frames'][1:]):
 dt=last['media_time_seconds']-first['media_time_seconds'];assert dt>0;distance=float(np.linalg.norm(np.array(last['feet'])-first['feet']));speeds.append(distance/dt);pauses+=int(distance<.001);turns+=int(abs((last['yaw_degrees']-first['yaw_degrees']+180)%360-180)>10)
assert max(speeds)<=1.4+.01 and pauses>=8 and turns>=8
(private/'labels.json').write_text(json.dumps(labels,indent=2)+'\n',encoding='utf-8',newline='\n')
useful={c:{r['frame_index'] for r in labels if r['camera_id']==c and r['useful']} for c in cameras};valid_times=set().union(*useful.values());nonzero_times={r['frame_index'] for r in labels if r['visible_pixels']>=20};recoveries={}
for camera,indices in useful.items():recoveries[camera]=sum(b-a>=3 for a,b in zip(sorted(indices),sorted(indices)[1:]))
assert all(len(values)>=2 for values in useful.values());assert sum(recoveries.values())>=1
report={'phase':'P2-09.14','gate_passed':True,'run':a.run,'simulation_only':True,'actors':1,'images':len(labels),'instants':len(poses),'duration_seconds':plan['duration_seconds'],'path_length_native':plan['path_length_native'],'manifest_sha256':hashlib.sha256((frames/'manifest.json').read_bytes()).hexdigest(),'graph_sha256':plan['graph_sha256'],'strict_pixel_manifest_passed':True,'all_frame_hashes_verified':True,'synchronized_eight_sensors':True,'maximum_actual_speed_native_per_second':max(speeds),'pause_intervals':pauses,'turn_intervals':turns,'valid_visible_opportunities':sum(len(v) for v in useful.values()),'valid_frames_per_sensor':{c:len(v) for c,v in useful.items()},'loss_reappearance_intervals_per_sensor':recoveries,'instants_without_useful_view':len(poses)-len(valid_times),'instants_without_20_visible_pixels_in_any_view':len(poses)-len(nonzero_times),'evaluating_seconds':time.perf_counter()-start,'ground_truth':'poses, actor ID, masks and per-frame labels retained in isolated evaluator folder only','inference_validated':False,'human_final_acceptance':False}
report['phase']='P2-'+a.phase
output=ROOT/f'docs/spatial-simulation/evidence/p2-09/{a.phase}/{a.run}';output.mkdir(parents=True,exist_ok=True);(output/'corpus-checks.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps(report))
