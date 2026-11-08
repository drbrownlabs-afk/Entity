"""Official OIDN colour-only filtering of generated renders. Raw renders are never overwritten."""
import sys,subprocess,hashlib,json
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE/'.runtime/denoise-python'))
from PIL import Image
import PIL,numpy as np
from common import HANDOFF,OUTPUT,read,write,sha256
E=HANDOFF/'evidence/phase04';runtime=HERE/'.runtime';exe=runtime/'oidn-2.3.3.x86_64.linux/bin/oidnDenoise'
PIN='3c385230d9e6f63527ba72f2229594dbac5051674219d72e0044b5d0b841796f'
assert sha256(runtime/'oidn-2.3.3.tar.gz')==PIN,'Official archive differs from HTTPS-verified pinned artifact'
records=read(E/'renders.json');assert len(records)==10,'Wait for all approval renders'
folder=E/'denoised';folder.mkdir(exist_ok=True)
meta=[]
for r in records:
 src=E/r['path'];assert sha256(src)==r['sha256']
 raw=Image.open(src);pixels=np.asarray(raw.convert('RGB'),dtype=np.float32)/255
 h,w,_=pixels.shape;inp=runtime/'colour-input.pfm';out=runtime/'colour-output.pfm'
 with inp.open('wb') as f:f.write(f'PF\n{w} {h}\n-1.0\n'.encode());f.write(np.flipud(pixels).astype('<f4').tobytes())
 result=subprocess.run([str(exe),'--device','cpu','--ldr',str(inp),'--srgb','--threads','4','--affinity','0','--maxmem','512','--quality','high','-o',str(out)],capture_output=True,text=True)
 assert result.returncode==0,result.stdout+result.stderr
 with out.open('rb') as f:
  assert f.readline().strip()==b'PF';dims=tuple(map(int,f.readline().split()));scale=float(f.readline());values=np.frombuffer(f.read(),dtype='<f4' if scale<0 else '>f4')
 assert dims==(w,h)
 denoised=np.flipud(values.reshape(h,w,3));assert np.isfinite(denoised).all()
 image=Image.fromarray(np.rint(np.clip(denoised,0,1)*255).astype('uint8'))
 if 'A' in raw.getbands():image.putalpha(raw.getchannel('A'))
 dst=folder/r['path'];image.save(dst)
 assert sha256(src)==r['sha256'],'Raw render changed'
 meta.append({'name':r['name'],'raw':r['path'],'raw_sha256':r['sha256'],'filtered':'denoised/'+r['path'],'filtered_sha256':sha256(dst),'master_sha256':r['master_sha256'],'algorithm':'OIDN 2.3.3 RT LDR sRGB colour-only, high quality; no geometric changes','raw_mean_srgb':float(pixels.mean()),'filtered_mean_srgb':float(np.clip(denoised,0,1).mean())})
 write(folder/'manifest.json',{'official_release_archive_sha256':PIN,'executable_sha256':sha256(exe),'Pillow':PIL.__version__,'numpy':np.__version__,'images':meta,'note':'Raw and filtered images retained. Filtering improves sample noise; it does not certify geometry, material transfer or physical photometry.'})
 print('DENOISED',r['name'],flush=True)
