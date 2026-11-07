"""Package only committed source and an allowlisted static build. Never package runtime DBs/secrets."""
import gzip
import hashlib
import json
from pathlib import Path
import subprocess
import zipfile

root = Path(__file__).resolve().parents[1]

def git(*arguments):
    return subprocess.check_output(['git', *arguments], cwd=root)

if git('status', '--porcelain').strip():
    raise SystemExit('Commit the reviewed source before packaging; dirty releases are refused')
sha = git('rev-parse', 'HEAD').decode().strip()
output = root / '.runtime/delivery'
output.mkdir(parents=True, exist_ok=True)
dist = root / 'apps/web/dist'
# Rebuild with the locked local toolchain; never attach a potentially stale dist to a new SHA.
subprocess.run(['npm', '--prefix', 'apps/web', 'run', 'build'], cwd=root, check=True)
source = output / 'entity-source.tar.gz'
with source.open('wb') as raw, gzip.GzipFile(filename='', mode='wb', fileobj=raw, mtime=0) as compressed:
    compressed.write(git('archive', '--format=tar', '--prefix=Entity/', sha))
static = output / 'entity-experience.zip'
with zipfile.ZipFile(static, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    files = [dist / 'index.html', *sorted((dist / 'assets').glob('*'))]
    for file in files:
        if not file.is_file():
            raise SystemExit('Unexpected static asset directory')
        info = zipfile.ZipInfo(file.relative_to(dist).as_posix())
        info.compress_type = zipfile.ZIP_DEFLATED
        archive.writestr(info, file.read_bytes())
    archive.writestr('BUILD.json', json.dumps({'source_commit': sha, 'mode': 'standalone-simulated'}, indent=2))
    archive.writestr('.nojekyll', '')
manifest = {'schema_version': '1.0', 'source_commit': sha,
            'source_tree': git('rev-parse', 'HEAD^{tree}').decode().strip(),
            'runtime': {'python': '3.12', 'node': '24', 'docker': 'optional for protocol/container checks'},
            'files': {p.name: {'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}
                      for p in [source, static]},
            'limitations': ['No physical hardware or remote LLM verified',
                            'Source requires dependency download; archive is not an offline installer',
                            'Static zip requires a web host; source Core is local development only']}
(output / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps(manifest, indent=2))
