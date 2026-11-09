"""P2-09.1: measurements from existing scene records, not reconstructed geometry."""
import json,hashlib,collections
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[3]
scene_path=ROOT/'apps/spatial-simulation/public/model/scene.json'
s=json.loads(scene_path.read_text());out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.1';out.mkdir(parents=True,exist_ok=True)
selected=[r for r in s['records']if r['type']in ['Floor','Ceiling','Wall','Partition','DoorLeaf','Kiosk','ReceptionCounter','Column']]
measurements=[]
for r in selected:
 b=r.get('bounds')
 if not b:continue
 assert len(b)==2 and all(len(v)==3 for v in b)
 assert all(b[0][i]<=b[1][i]for i in range(3))
 measurements.append({'id':r['id'],'type':r['type'],'environment':r['environment_id'],'bounds':b,'native_dimensions':[b[1][i]-b[0][i]for i in range(3)]})
ids={r['id']for r in measurements}
assert {'sim:p1:floor-main','sim:p1:ceiling','sim:p2:reception-kiosk','sim:p2:door:security:leaf'}<=ids
f=next(r for r in measurements if r['id']=='sim:p1:floor-main');ceiling=next(r for r in measurements if r['id']=='sim:p1:ceiling')
report={'gate':'P2-09.1','passed':True,'coordinate_frame':s['coordinate_frame'],'metric_scale_verified':False,'units':'native scene units; no surveyed metres','master_sha256':s['master_sha256'],'scene_sha256':hashlib.sha256(scene_path.read_bytes()).hexdigest(),'original_records':len(s['records']),'floor_top':f['bounds'][1][1],'ceiling_underside':ceiling['bounds'][0][1],'main_clear_height_native':ceiling['bounds'][0][1]-f['bounds'][1][1],'measurements':measurements,'zone_bounds':s['room_bounds'],'route_endpoints':{k:{'start':v[0],'end':v[-1],'samples':len(v)}for k,v in s['routes'].items()},'access_caveat':'security partition is identified, main entrance/door remains unidentified. Route origin is only an ingress test anchor, not a newly asserted main entrance.','geometric_occluders':'Existing walls, partitions, columns and furniture render normally; closed security/office doors are not removed','unknown':['surveyed scale','actual main entrance','real hardware mounting/installation','lens distortion calibration'],'original_geometry_modified':False}
(out/'audit.json').write_text(json.dumps(report,indent=2)+'\n')
im=Image.new('RGB',(760,1100),'#f0ede7');d=ImageDraw.Draw(im)
def xy(x,z):return (int((x+13)*38),int((3-z)*32)+35)
colors={'Floor':'#d2cec2','Wall':'#443c35','Partition':'#72a3ac','Column':'#76685a','DoorLeaf':'#b17a35','Kiosk':'#c03030','ReceptionCounter':'#d49e52'}
for typ in colors:
 for r in measurements:
  if r['type']!=typ:continue
  a,b=r['bounds'];d.rectangle([xy(a[0],b[2]),xy(b[0],a[2])],fill=colors[typ])
for k,v in s['routes'].items():
 if k=='reception':d.line([xy(p[0],p[2])for p in v],fill='#007a22',width=3)
d.text((15,10),'P2-09.1 | EXISTING AABBs | X/Z plan | native units (not surveyed metres)',fill='black')
d.text((15,1070),'Red: kiosk | brown: doors | green: existing reception route | blue: partitions',fill='black')
im.save(out/'measured-plan.png');print(json.dumps({k:v for k,v in report.items()if k not in ['measurements','route_endpoints','zone_bounds']}))
