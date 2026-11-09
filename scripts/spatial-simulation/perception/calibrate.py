"""Validate rendered camera matrices against declared intrinsics and measured landmarks."""
import json,math,itertools,collections
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[3];base=ROOT/'docs/spatial-simulation/evidence/p2-09';s=json.loads((ROOT/'apps/spatial-simulation/public/model/scene.json').read_text());cfg=json.loads((ROOT/'apps/spatial-simulation/public/perception/cameras.json').read_text());frames=json.loads((base/'09.2/rendered.json').read_text())['frames'];cams={c['id']:c for c in cfg['cameras']};M={f['camera_id']:(np.array(f['worldToCamera']).reshape(4,4).T,np.array(f['projection']).reshape(4,4).T)for f in frames}
def project(key,p):
 V,P=M[key];eye=V@np.array([*p,1]);clip=P@eye
 if eye[2]>=-.035:return None
 ndc=clip[:3]/clip[3];w,h=cams[key]['resolution'];return np.array([(ndc[0]+1)*w/2,(1-ndc[1])*h/2])
def inside(key,p,margin=0):
 q=project(key,p)
 if q is None:return False
 w,h=cams[key]['resolution'];return margin<=q[0]<w-margin and margin<=q[1]<h-margin
errors=[]
for key,c in cams.items():
 V,P=M[key];assert np.max(abs(V@np.linalg.inv(V)-np.eye(4)))<1e-6
 assert np.max(abs((V@np.array([*c['position'],1]))[:3]))<1e-5
 K=np.array(c['K'])
 for x,y,z in [(.1,.2,-3),(-.4,-.8,-4),(.3,-1,-7)]:
  p=np.linalg.inv(V)@np.array([x,y,z,1]);q=project(key,p[:3]);expected=np.array([K[0,0]*x/-z+K[0,2],K[1,1]*y/z+K[1,2]]);errors.append(float(np.linalg.norm(q-expected)))
def blocked(origin,target):
 origin=np.array(origin);target=np.array(target);direction=target-origin
 for r in s['records']:
  if r['type']not in ['Wall','Column','DoorLeaf']:continue
  lo,hi=map(np.array,r['bounds']);start,end=0.,1.
  for axis in range(3):
   if abs(direction[axis])<1e-10:
    if origin[axis]<lo[axis]or origin[axis]>hi[axis]:start,end=2.,-1.;break
   else:
    a,b=sorted([(lo[axis]-origin[axis])/direction[axis],(hi[axis]-origin[axis])/direction[axis]]);start=max(start,a);end=min(end,b)
  if start<end and end>.001 and start<.999:return r['id']
 return None
route=s['routes']['reception'];samples=route[::5]+[route[-1]];coverage=[];pairs=collections.Counter()
for p in samples:
 upper=[p[0],p[1]+1.65,p[2]];torso=[p[0],p[1]+1,p[2]];visible=[]
 for key in cams:
  foot,head=project(key,p),project(key,upper)
  if head is not None and foot is not None and inside(key,torso,8):
   h=float(abs(head[1]-foot[1]))
   if h>=40:visible.append({'camera':key,'projected_person_height_px':h})
 for a,b in itertools.combinations([v['camera']for v in visible],2):pairs[(a,b)]+=1
 coverage.append({'probe':p,'views':visible,'conservative_solid_los':[{'camera':v['camera'],'solid_blocker':blocked(cams[v['camera']]['position'],torso)}for v in visible]})
# Rendered common landmarks are geometry evidence, not detections or actor ground truth.
landmark_specs=[('upper-ramp',[-3.1,-1.55,-3.6],['CAMERA-PLANNED-01','CAMERA-PLANNED-02']),('upper-return',[-3.3,-1.55,-8],['CAMERA-PLANNED-01','CAMERA-PLANNED-03']),('kiosk',[-3.65,-.18,-16.1],['CAMERA-PLANNED-04','CAMERA-PLANNED-05']),('rear-transition',[-2.5,-.85,-19.3],['CAMERA-PLANNED-05','CAMERA-PLANNED-06'])]
landmarks=[];montage=Image.open(base/'09.2/views.jpg').convert('RGB');d=ImageDraw.Draw(montage)
for name,p,keys in landmark_specs:
 row={'name':name,'world_native':p,'pixels':{}}
 for key in keys:
  q=project(key,p);row['pixels'][key]=None if q is None else q.tolist()
  if q is not None and inside(key,p):
   n=list(cams).index(key);x=(n%2)*576+q[0]*(366/1152);y=(n//2)*230+20+q[1]*(206/648);d.ellipse((x-4,y-4,x+4,y+4),outline='red',width=2);d.text((x+5,y),name,fill='red')
 landmarks.append(row)
montage.save(base/'09.3/overlap-landmarks.jpg',quality=92)
report={'gate':'P2-09.3','passed':False,'camera_count':len(cams),'max_reprojection_error_px':max(errors),'native_camera_matrices':True,'scale_metres_verified':False,'route_probes':len(coverage),'solid_los_coverage_fraction':sum(any(v['solid_blocker']is None for v in p['conservative_solid_los'])for p in coverage)/len(coverage),'frustum_coverage_fraction':sum(bool(p['views'])for p in coverage)/len(coverage),'multi_view_probe_fraction':sum(len(p['views'])>=2 for p in coverage)/len(coverage),'overlapping_pairs':[{'a':a,'b':b,'probes':n}for (a,b),n in pairs.items()],'coverage':coverage,'landmarks':landmarks,'occlusion_caveat':'Frustum/pixel-density probes do not prove visibility through furniture or closed doors. Rendered images inspected with all geometry present; moving-body occlusion is tested next. Security doors are retained. No depth/actor IDs passed to perception.','timestamp_contract':{'origin':'scenario-relative fixed UTC clock; not capture wall-clock','start':'2026-11-09T12:00:00Z','capture_step_seconds':.5,'processing_step_seconds':.5,'frame_order':'monotonic per source','inter_camera_media_skew_seconds':0,'real_hardware_sync_tested':False},'physical_lens_distortion_known':False}
assert max(errors)<.001,report['max_reprojection_error_px'];assert report['frustum_coverage_fraction']>.95
(base/'09.3/calibration.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k in ['max_reprojection_error_px','frustum_coverage_fraction','multi_view_probe_fraction','overlapping_pairs']}))
