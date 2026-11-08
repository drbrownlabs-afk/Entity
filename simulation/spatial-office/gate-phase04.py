"""Verify evidence consistency after actual rendering/review; never grants human approval."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent/'.runtime/denoise-python'))
from common import ROOT,OUTPUT,HANDOFF,read,write,sha256,protected_changes
E=HANDOFF/'evidence/phase04';h=sha256(OUTPUT/'office-phase04.blend')
assert not protected_changes()
for stage in ['02','03','04']:
 summary=read(HANDOFF/f'evidence/phase{stage}/summary.json')
 assert summary['passed'] and summary['master_sha256']==sha256(OUTPUT/f'office-phase{stage}.blend'),stage
manifest=read(OUTPUT/'device-manifest.json')
assert manifest['master_sha256']==h and all(sha256(ROOT/p)==v for p,v in manifest['input_hashes'].items())
raw=read(E/'renders.json');filtered=read(E/'denoised/manifest.json')['images'];assert len(raw)==len(filtered)==10
for r in raw:assert r['master_sha256']==h and r['sha256']==sha256(E/r['path'])
for r in filtered:assert r['master_sha256']==h and r['raw_sha256']==sha256(E/r['raw']) and r['filtered_sha256']==sha256(E/r['filtered'])
review=read(E/'visual-review.json');assert review['master_sha256']==h and not review['human_approval']
means=review['brightness_mean_srgb_raw'];assert means['all_on']>means['one_on']>means['all_off'] and means['all_on']-means['all_off']>.1
probe=read(E/'material-probe.json');assert probe['master_sha256']==h and len(probe['results'])==5 and all(x['passed'] for x in probe['results'])
assert probe['probe_sha256']==sha256(OUTPUT/'pbr-transfer-probe.glb')
architecture=read(E/'architecture-preserved.json');assert architecture['stage04_sha256']==h and not architecture['missing_architectural_objects'] and not architecture['moved_architectural_objects']
assert read(OUTPUT/'phase04-full-inventory.json')['master_sha256']==h
report={'status':'VERIFIED_INTERNALLY_PENDING_OPERATOR_APPROVAL','phase04_checks':read(E/'summary.json')['checks'],'phase03_checks':read(HANDOFF/'evidence/phase03/summary.json')['checks'],'phase02_checks':read(HANDOFF/'evidence/phase02/summary.json')['checks'],'master_sha256':h,'luminaires':len(manifest['luminaires']),'circuits':len(manifest['circuits']),'doors':len(manifest['doors']),'render_pairs_raw_filtered':10,'pbr_swatches_roundtrip':5,'protected_snapshot_files_checked':578,'original_files_unchanged':577,'exact_upstream_plan_revision':read(HANDOFF/'evidence/upstream-revisions.json'),'human_approval':False,'PlayCanvas_started':False,'Mixamo_started':False,'environment_draft_persistence_confirmed':False}
write(E/'gate.json',report)
print('FINAL_GATE_PASS',report['phase02_checks'],report['phase03_checks'],report['phase04_checks'],'checks; approval required before Phase05')
