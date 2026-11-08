"""Official OIDN on actual Cycles output, with real albedo/normal guides; raw files preserved."""
import sys,subprocess
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE/'.runtime/denoise-python'))
from PIL import Image
import numpy as np
from common import HANDOFF,read,write,sha256
draft='--draft' in sys.argv
folder=HANDOFF/'evidence/phase04-revision'/('draft' if draft else 'renders')
outdir=folder/'denoised';outdir.mkdir(parents=True,exist_ok=True)
runtime=HERE/'.runtime';exe=runtime/'oidn-2.3.3.x86_64.linux/bin/oidnDenoise'
assert sha256(runtime/'oidn-2.3.3.tar.gz')=='3c385230d9e6f63527ba72f2229594dbac5051674219d72e0044b5d0b841796f'
exe_hash=sha256(exe);previous={}
if (outdir/'manifest.json').exists():
    old=read(outdir/'manifest.json')
    if old.get('executable_sha256')==exe_hash:previous={r['name']:r for r in old['images']}
metadata=[]
for r in read(folder/'renders.json'):
    src=folder/r['path'];assert sha256(src)==r['sha256']
    old=previous.get(r['name']);dst=outdir/r['path']
    if old and old['raw_sha256']==r['sha256'] and old['master_sha256']==r['master_sha256'] and old.get('guides')==r.get('denoising_guides',{}) and dst.exists() and sha256(dst)==old['filtered_sha256']:
        metadata.append(old)
        write(outdir/'manifest.json',{'executable_sha256':exe_hash,'images':metadata,'no_reference_photo_edits':True,'no_generated_geometry_or_relit_pixels':True})
        print('VERIFIED_CACHED',r['name'],flush=True);continue
    pixels=np.asarray(Image.open(src).convert('RGB'),dtype=np.float32)/255;h,w,_=pixels.shape
    inp=runtime/'revision-color.pfm';output=runtime/'revision-filtered.pfm'
    with inp.open('wb') as f:f.write(f'PF\n{w} {h}\n-1.0\n'.encode());f.write(np.flipud(pixels).astype('<f4').tobytes())
    args=[str(exe),'--device','cpu','--ldr',str(inp),'--srgb','--threads','4','--affinity','0','--maxmem','1024','--quality','high','-o',str(output)]
    for key,flag in [('albedo','--alb'),('normal','--nrm')]:
        if key in r.get('denoising_guides',{}):
            guide=r['denoising_guides'][key];path=HERE/guide['path'];assert sha256(path)==guide['sha256'];args.extend([flag,str(path)])
    result=subprocess.run(args,capture_output=True,text=True);assert result.returncode==0,result.stdout+result.stderr
    with output.open('rb') as f:
        assert f.readline().strip()==b'PF';dims=tuple(map(int,f.readline().split()));scale=float(f.readline());data=np.frombuffer(f.read(),dtype='<f4' if scale<0 else '>f4')
    assert dims==(w,h);data=np.flipud(data.reshape(h,w,3));assert np.isfinite(data).all()
    dst=outdir/r['path'];Image.fromarray(np.rint(np.clip(data,0,1)*255).astype('uint8')).save(dst)
    metadata.append({'name':r['name'],'raw':r['path'],'raw_sha256':r['sha256'],'filtered':'denoised/'+r['path'],'filtered_sha256':sha256(dst),'master_sha256':r['master_sha256'],'guides':r.get('denoising_guides',{}),'algorithm':'Official OIDN 2.3.3 RT LDR, sRGB color with linear Cycles albedo and normal guides when available','raw_mean_srgb':float(pixels.mean())})
    write(outdir/'manifest.json',{'executable_sha256':exe_hash,'images':metadata,'no_reference_photo_edits':True,'no_generated_geometry_or_relit_pixels':True})
    print('FILTERED',r['name'],flush=True)
