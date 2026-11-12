"""Render camera/model evidence only; no evaluator or actor metadata inputs."""
import argparse,json
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[3]
p=argparse.ArgumentParser();p.add_argument('--run',required=True);p.add_argument('--experiment',required=True);a=p.parse_args();assert all(s.replace('-','').replace('_','').isalnum() for s in [a.run,a.experiment])
r=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{a.run}';tracks=json.loads((r/f'output/{a.experiment}/tracks-tuned.json').read_text());cameras=sorted({f['camera_id'] for f in tracks['frames']});canvas=Image.new('RGB',(1296,2088),'#101820');draw=ImageDraw.Draw(canvas);draw.text((8,8),'Synthetic camera frames | anonymous camera-local tracks | not global or civil identities',fill='white')
for index,camera in enumerate(cameras):
 rows=[f for f in tracks['frames'] if f['camera_id']==camera and f['tracks']];frame=max(rows,key=lambda f:sum((t['bbox'][2]-t['bbox'][0])*(t['bbox'][3]-t['bbox'][1])*t['confidence'] for t in f['tracks']))
 im=Image.open(r/'frames'/f"{camera}-{frame['frame_index']:04}.png").convert('RGB');original=im.size;im.thumbnail((640,480));sx,sy=im.width/original[0],im.height/original[1];d=ImageDraw.Draw(im)
 for t in frame['tracks']:
  box=[t['bbox'][0]*sx,t['bbox'][1]*sy,t['bbox'][2]*sx,t['bbox'][3]*sy];d.rectangle(box,outline='#50ef90',width=2);d.text((box[0]+3,max(0,box[1]-13)),f"local {t['local_track_id'].split(':')[-1]} | {t['confidence']:.2f}",fill='#50ef90')
 x,y=(index%2)*648,36+(index//2)*512;canvas.paste(im,(x,y+15));draw.text((x+4,y),camera,fill='white')
out=ROOT/f'docs/spatial-simulation/evidence/p2-09/09.15/{a.run}';out.mkdir(parents=True,exist_ok=True);canvas.save(out/'local-tracks.jpg',quality=90);print('Rendered eight source-labelled local-track views; no GT read')
