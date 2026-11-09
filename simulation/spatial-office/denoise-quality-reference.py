"""Standard OIDN render denoising; raw Cycles output is retained unchanged."""
import sys,subprocess
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE/'.runtime/denoise-python'))
from PIL import Image
import numpy as np
from common import HANDOFF,write,sha256
folder=HANDOFF/'evidence/phase04-5';src=folder/'blender-lounge-17.png';dst=folder/'blender-lounge-17-denoised.png';pixels=np.asarray(Image.open(src).convert('RGB'),dtype=np.float32)/255;h,w,_=pixels.shape
inp=HERE/'.runtime/golden-color.pfm';out=HERE/'.runtime/golden-filtered.pfm'
with inp.open('wb') as f:f.write(f'PF\n{w} {h}\n-1.0\n'.encode());f.write(np.flipud(pixels).astype('<f4').tobytes())
exe=HERE/'.runtime/oidn-2.3.3.x86_64.linux/bin/oidnDenoise';subprocess.run([str(exe),'--device','cpu','--ldr',str(inp),'--srgb','--threads','4','--affinity','0','--quality','high','-o',str(out)],check=True)
with out.open('rb') as f:
 assert f.readline().strip()==b'PF';assert tuple(map(int,f.readline().split()))==(w,h);scale=float(f.readline());a=np.frombuffer(f.read(),dtype='<f4'if scale<0 else '>f4').reshape(h,w,3)
Image.fromarray(np.rint(np.clip(np.flipud(a),0,1)*255).astype('uint8')).save(dst)
write(folder/'denoising.json',{'raw_sha256':sha256(src),'denoised_sha256':sha256(dst),'algorithm':'OIDN 2.3.3 RT LDR sRGB, color only; no guides available for this capture','raw_preserved':True,'relighting':False,'reference_status':'diagnostic of previous Blender lighting, not proof of PlayCanvas transfer'})
