"""Publish generated evidence on the latest branch without rebasing binary screenshots.

CI checkout only. Never resets an operator's or Codex's development workspace.
"""
import json,os,shutil,subprocess,sys,tempfile
from pathlib import Path
root=Path(__file__).resolve().parents[2]
if os.environ.get('GITHUB_ACTIONS')!='true' or Path(os.environ.get('GITHUB_WORKSPACE','')).resolve()!=root:
    raise SystemExit('Evidence publication requires the isolated GitHub Actions checkout')
branch='codex/phase-09-autonomous-plan'
def git(*args,check=True):return subprocess.run(['git',*args],cwd=root,check=check,capture_output=True,text=True)
paths=[]
for pattern in sys.argv[1:]:
    for file in root.glob(pattern):
        if not file.is_file():continue
        rel=file.relative_to(root)
        if not str(rel).startswith('docs/evidence/phase09/'):raise SystemExit('Only Phase09 evidence may be published')
        paths.append(rel)
with tempfile.TemporaryDirectory(prefix='entity-ci-evidence-') as folder:
    saved=Path(folder)
    for rel in paths:
        destination=saved/rel;destination.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(root/rel,destination)
    # Every report has its tested SHA/run URL. Preserve JSON per run even when a newer
    # implementation is concurrently committed; the single-file reports show latest execution.
    run=os.environ['GITHUB_RUN_ID']
    for rel in list(paths):
        if rel.suffix!='.json' or 'spatial-runs' in str(rel):continue
        archive=Path('docs/evidence/phase09/ci-runs')/run/rel.name
        (saved/archive).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(saved/rel,saved/archive);paths.append(archive)
    for attempt in range(4):
        git('fetch','origin',branch)
        git('reset','--hard','FETCH_HEAD')
        for rel in paths:
            (root/rel).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(saved/rel,root/rel)
        git('add','--',*[str(p) for p in paths])
        if git('diff','--cached','--quiet',check=False).returncode==0:break
        git('-c','user.name=ENTITY CI evidence','-c','user.email=evidence@users.noreply.github.com','commit','-m','Record actual Phase09 execution evidence [skip ci]')
        pushed=git('push','origin','HEAD:'+branch,check=False)
        if pushed.returncode==0:break
        if attempt==3:raise SystemExit('Evidence push failed after concurrent branch updates; evidence remains in the workflow artifact')
    print(json.dumps({'published_commit':git('rev-parse','HEAD').stdout.strip(),'files':[str(p) for p in paths]}))
