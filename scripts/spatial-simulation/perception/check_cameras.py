"""Gate checks for source-defined parameters and independent rendered images."""
import json,math,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageStat
ROOT=Path(__file__).resolve().parents[3];out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.2';cfg=json.loads((ROOT/'apps/spatial-simulation/public/perception/cameras.json').read_text());render=json.loads((out/'rendered.json').read_text());checks=[]
assert 6<=len(cfg['cameras'])<=8
montage=Image.new('RGB',(1152,700),'#161c20');d=ImageDraw.Draw(montage)
for n,c in enumerate(cfg['cameras']):
 assert c['id']==f'CAMERA-PLANNED-{n+1:02}';assert -1.85<c['position'][1]<1.65;assert c['capture_fps']<=30;assert c['projection']=='rectified-pinhole';assert c['vfov_deg']<180
 im=Image.open(out/(c['id']+'.png')).convert('RGB');assert list(im.size)==c['resolution'];assert max(ImageStat.Stat(im).stddev)>12,'Blank/flat capture'
 row=render['frames'][n];assert row['camera_id']==c['id'];assert len(row['worldToCamera'])==16;assert len(row['projection'])==16
 im.thumbnail((570,320));x=(n%2)*576;y=(n//2)*230;im.thumbnail((570,206));montage.paste(im,(x,y+20));d.text((x+6,y+3),c['id']+' | '+c['label'],fill='white');checks.append({'camera':c['id'],'png_sha256':hashlib.sha256((out/(c['id']+'.png')).read_bytes()).hexdigest(),'image_stddev':ImageStat.Stat(Image.open(out/(c['id']+'.png'))).stddev,'parameters_consistent':True})
montage.save(out/'views.jpg',quality=90);print(json.dumps({'checks':checks,'visual_inspection_required':True},indent=2));(out/'checks.json').write_text(json.dumps({'checks':checks,'visual_inspection_required':True},indent=2)+'\n')
