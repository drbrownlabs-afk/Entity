"""Repeatable workspace-only dependencies. TLS and artifact verification remain enabled."""
from pathlib import Path
import hashlib,os,shutil,subprocess,tarfile,urllib.request
HERE=Path(__file__).resolve().parent;runtime=HERE/'.runtime';runtime.mkdir(exist_ok=True)
uv=shutil.which('uv')
if not uv:raise RuntimeError('uv is required from the managed environment toolchain')
process_env=dict(os.environ);process_env['UV_CACHE_DIR']='/workspace/.cache/entity-uv'
for lock,folder in [('requirements-lighting.lock','python'),('requirements-denoise.lock','denoise-python')]:
 subprocess.run([uv,'pip','install','--require-hashes','--target',str(runtime/folder),'-r',str(HERE/lock)],env=process_env,check=True)
archive=runtime/'oidn-2.3.3.tar.gz';pin='3c385230d9e6f63527ba72f2229594dbac5051674219d72e0044b5d0b841796f'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
if not archive.exists() or digest(archive)!=pin:
 part=archive.with_suffix('.part')
 with urllib.request.urlopen('https://github.com/RenderKit/oidn/releases/download/v2.3.3/oidn-2.3.3.x86_64.linux.tar.gz',timeout=60) as r,part.open('wb') as f:shutil.copyfileobj(r,f)
 if digest(part)!=pin:raise RuntimeError('Official OIDN archive hash differs; do not use these artifacts')
 part.replace(archive)
assert digest(archive)==pin
with tarfile.open(archive) as package:package.extractall(runtime,filter='data')
print('Verified Astral/Pillow/NumPy lockfiles and pinned official OIDN 2.3.3 archive; workspace-only setup complete')
