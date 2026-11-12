"""Run actual OSNet+MTMC in three evaluator states; restore originals in finally."""
import hashlib
import json
import os
import shutil
import subprocess
import time
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
trial=ROOT/'simulation/spatial-office/.runtime/cctv-trial-trial-a'
source=Path('/opt/entity-p2/corpora/trial-a/frames')
run='trial-a-audit16';cache=Path('/opt/entity-p2/corpora')/run/'frames'
cache.mkdir(parents=True,exist_ok=True)
tracks=json.loads((trial/'output/tiles025/tracks-tuned.json').read_text())
indices={0,10,46,71,76,90,108,130,160,190,220,240}
tracks['frames']=[f for f in tracks['frames'] if f['frame_index'] in indices]
manifest=json.loads((source/'manifest.json').read_text())
manifest['frames']=[f for f in manifest['frames'] if f['frame_index'] in indices]
for row in manifest['frames']:shutil.copyfile(source/row['file'],cache/row['file'])
(cache/'manifest.json').write_text(json.dumps(manifest)+'\n')
truth=trial/'evaluator';backup=trial/'evaluator.audit16-backup'
assert truth.resolve().is_relative_to(ROOT.resolve()) and backup.resolve().is_relative_to(ROOT.resolve())
assert truth.parent==backup.parent and truth.name=='evaluator' and not backup.exists()
original=(truth/'truth.json').read_bytes();before=hashlib.sha256(original).hexdigest()
wrapper=ROOT/'scripts/spatial-simulation/perception/run-cctv-isolated.sh'
started=time.perf_counter()

def execute(state):
    out=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{run}/output/{state}'
    out.mkdir(parents=True,exist_ok=True);(out/'tracks-tuned.json').write_text(json.dumps(tracks)+'\n')
    env=os.environ|{'P2_TRIAL_RUN':run,'P2_EXPERIMENT':state}
    for worker in ['reid','mtmc']:
        subprocess.run(['bash',str(wrapper)],env=env|{'P2_VISION_WORKER':worker},check=True,stdout=subprocess.DEVNULL)
    result=[]
    for file in ['reid-evidence.json','global-tracks.json']:
        data=json.loads((out/file).read_text());data.pop('processing_seconds');result.append(data)
    return result

first=execute('gt-present');truth.rename(backup)
try:
    second=execute('gt-disconnected')
    truth.mkdir();changed=json.loads(original);changed['internal_actor_id']='private-id-variation-audit16'
    (truth/'truth.json').write_text(json.dumps(changed))
    third=execute('gt-id-changed')
finally:
    if truth.exists():
        assert {p.name for p in truth.iterdir()}=={'truth.json'},'Original preserved in backup; unexpected audit content'
        (truth/'truth.json').unlink();truth.rmdir()
    backup.rename(truth)
assert hashlib.sha256((truth/'truth.json').read_bytes()).hexdigest()==before
assert first==second==third,'OSNet/MTMC changed with external evaluator state'
report={'phase':'P2-09.16','passed':True,'frames':len(manifest['frames']),
        'appearance_observations':len(first[0]['observations']),
        'states':['actual evaluator present outside worker','actual evaluator directory disconnected','private actor ID changed'],
        'embeddings_and_associations_identical':True,'original_evaluator_restored_exact_hash':True,
        'worker_workspace_evaluator_network_not_mounted':True,'comparison_excludes_walltime_only':True,
        'processing_seconds':time.perf_counter()-started}
out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.16/trial-a';out.mkdir(parents=True,exist_ok=True)
(out/'isolation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
