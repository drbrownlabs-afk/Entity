"""Separate official OIDN output with measured Cycles feature passes; preserve raw renders."""
import sys,subprocess
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE/'.runtime/denoise-python'))
from PIL import Image
import numpy as np
from common import HANDOFF,read,write,sha256
folder=HANDOFF/'evidence/phase04-5/blender-review';outdir=folder/'denoised';outdir.mkdir(parents=True,exist_ok=True);exe=HERE/'.runtime/oidn-2.3.3.x86_64.linux/bin/oidnDenoise';results=[]
for r in read(folder/'captures.json'):
 src=folder/(r['view']+'.png');assert sha256(src)==r['sha256'];dst=outdir/src.name;p=np.asarray(Image.open(src).convert('RGB'),np.float32)/255;h,w,_=p.shape;inp=HERE/'.runtime/review-color.pfm';out=HERE/'.runtime/review-filtered.pfm'
 with inp.open('wb')as f:f.write(f'PF\n{w} {h}\n-1.0\n'.encode());f.write(np.flipud(p).astype('<f4').tobytes())
 args=[str(exe),'--device','cpu','--ldr',str(inp),'--srgb','--threads','4','--affinity','0','--quality','high','-o',str(out)]
 for key,flag in [('albedo','--alb'),('normal','--nrm')]:
  guide=r['guides'][key];file=HERE/guide['path'];assert sha256(file)==guide['sha256'];args.extend([flag,str(file)])
 subprocess.run(args,check=True)
 with out.open('rb')as f:
  assert f.readline().strip()==b'PF';assert tuple(map(int,f.readline().split()))==(w,h);scale=float(f.readline());a=np.frombuffer(f.read(),dtype='<f4'if scale<0 else'>f4').reshape(h,w,3)
 Image.fromarray(np.rint(np.clip(np.flipud(a),0,1)*255).astype('uint8')).save(dst);results.append({'view':r['view'],'raw_sha256':r['sha256'],'denoised_sha256':sha256(dst),'guides':r['guides']})
write(outdir/'manifest.json',{'algorithm':'Official OIDN 2.3.3 RT LDR sRGB with linear Cycles albedo and normal guides','images':results,'raw_preserved':True,'human_approval':False})
