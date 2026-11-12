"""Audit actual detector/MOT with GT present, disconnected and ID changed."""
import hashlib,json,os,shutil,subprocess,time
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[3];run='trial-a-audit15';cache=Path('/opt/entity-p2/corpora')/run/'frames';source=Path('/opt/entity-p2/corpora/trial-a/frames');cache.mkdir(parents=True,exist_ok=True)
manifest=json.loads((source/'manifest.json').read_text());manifest['frames']=manifest['frames'][:32]
for row in manifest['frames']:shutil.copyfile(source/row['file'],cache/row['file'])
(cache/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
trial=ROOT/'simulation/spatial-office/.runtime/cctv-trial-trial-a';truth=trial/'evaluator';backup=trial/'evaluator.audit15-backup'
assert truth.resolve().is_relative_to(ROOT.resolve()) and backup.resolve().is_relative_to(ROOT.resolve()) and truth.parent==backup.parent and truth.name=='evaluator' and not backup.exists()
original=(truth/'truth.json').read_bytes();before=hashlib.sha256(original).hexdigest();start=time.perf_counter();wrapper=ROOT/'scripts/spatial-simulation/perception/run-cctv-isolated.sh'
def execute(state):
 env=os.environ|{'P2_TRIAL_RUN':run,'P2_EXPERIMENT':state,'P2_VISION_WORKER':'detect','P2_DETECTOR_PROVIDER':'cuda','P2_DETECT_THRESHOLD':'0.25','P2_TILE_SENSORS':'C1-S1,C2-S1'}
 subprocess.run(['bash',str(wrapper)],env=env,check=True,stdout=subprocess.DEVNULL)
 env['P2_VISION_WORKER']='mot-tuned';subprocess.run(['bash',str(wrapper)],env=env,check=True,stdout=subprocess.DEVNULL)
 out=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{run}/output/{state}';return json.loads((out/'detections.json').read_text()),json.loads((out/'tracks-tuned.json').read_text())
first=execute('gt-present')
truth.rename(backup)
try:
 second=execute('gt-disconnected')
 truth.mkdir();changed=json.loads(original);changed['internal_actor_id']='different-private-id-for-audit';(truth/'truth.json').write_text(json.dumps(changed))
 third=execute('gt-id-changed')
finally:
 if truth.exists():
  assert {p.name for p in truth.iterdir()}=={'truth.json'},'Unexpected audit directory content; original safely retained in backup'
  (truth/'truth.json').unlink();truth.rmdir()
 backup.rename(truth)
assert hashlib.sha256((truth/'truth.json').read_bytes()).hexdigest()==before
for candidate in [second,third]:
 for base_rows,other_rows,field in [(first[0]['frames'],candidate[0]['frames'],'detections'),(first[1]['frames'],candidate[1]['frames'],'tracks')]:
  assert len(base_rows)==len(other_rows)==32
  for a,b in zip(base_rows,other_rows):
   assert all(a[k]==b[k] for k in ['camera_id','frame_index','observed_at','media_time_seconds','frame_sha256']);assert len(a[field])==len(b[field])
   for x,y in zip(a[field],b[field]):
    assert np.allclose(x['bbox'],y['bbox'],atol=.001,rtol=0) and abs(x['confidence']-y['confidence'])<=1e-5
    if field=='tracks':
     assert all(x[k]==y[k] for k in ['local_track_id','position_anchor','confirmed_at_frame_index','association_confirmation_evidence_at','association_confirmation_media_seconds','associated_after_confirmation']) and np.allclose(x['position'],y['position'],atol=1e-5,rtol=0)
report={'phase':'P2-09.15','passed':True,'sample_frames':32,'states':['actual GT present outside worker','actual evaluator directory disconnected','private actor ID changed with same pixels'],'detector_observations_invariant':True,'mot_observations_and_ids_invariant':True,'original_evaluator_restored_exact_truth_hash':True,'worker_workspace_and_evaluator_not_mounted':True,'comparison_excludes_walltime_and_memory':True,'maximum_bbox_tolerance_pixels':.001,'seconds':time.perf_counter()-start,'mtmc_validated':False}
out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.15/trial-a/isolation.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
