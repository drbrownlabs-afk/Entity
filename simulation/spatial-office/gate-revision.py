"""Consolidate actual geometry/render evidence. Never grants operator approval."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent/'.runtime/denoise-python'))
import numpy as np
from PIL import Image
from common import ROOT,OUTPUT,HANDOFF,read,write,sha256,protected_changes
E=HANDOFF/'evidence/phase04-revision';folder=E/'renders';h=sha256(OUTPUT/'office-phase04-revision.blend')
expected={'vertical-garden','garden-detail','glass-detail','office','lounge','computer-detail','comedor','waiting','reception','WC','booths','cafe','lighting-corner','services','corridor','general-12','general-08','general-16','general-20','lounge-lights-on-20','lounge-lights-one-20','lounge-lights-off-20','meeting'}
g=read(E/'summary.json');m=read(OUTPUT/'device-manifest-revision.json');inventory=read(OUTPUT/'revision-full-inventory.json')
assert g['passed'] and g['master_sha256']==m['master_sha256']==inventory['master_sha256']==h
assert not protected_changes()
assert all(sha256(ROOT/p)==value for p,value in m['input_hashes'].items())
assert sha256(OUTPUT/'office-phase04.blend')==m['source_master_sha256']
raw={r['name']:r for r in read(folder/'renders.json')};filtered={r['name']:r for r in read(folder/'denoised/manifest.json')['images']}
assert set(raw)==set(filtered)==expected,{'raw_missing':sorted(expected-set(raw)),'filtered_missing':sorted(expected-set(filtered))}
for name in expected:
    r=raw[name];f=filtered[name]
    assert not r['draft'] and r['master_sha256']==f['master_sha256']==h
    assert sha256(folder/r['path'])==r['sha256']==f['raw_sha256']
    assert sha256(folder/f['filtered'])==f['filtered_sha256']
    assert set(r['denoising_guides'])=={'albedo','normal'}
    assert r['WC_roof_opaque']
    x,y,z=r['camera_source_position'];assert not (-7.9<x<-5.2 and .3<z<2.5 and -1.55<y<1.65)
review=read(E/'visual-review.json');assert review['master_sha256']==h and set(review['viewed_final_images'])==expected and not review['human_approval']
preserved=read(E/'preservation.json');assert preserved['master_sha256']==h and not preserved['missing_unexpected'] and not preserved['moved_inherited_objects']
glass=read(E/'glazing-audit.json');assert glass['master_sha256']==h and glass['count']==135
means={}
for state in ['on','one','off']:
    r=raw['lounge-lights-'+state+'-20'];means[state]=float(np.asarray(Image.open(folder/r['path']).convert('RGB'),dtype=np.float32).mean()/255)
    assert r['hour']==20 and r['camera_source_position']==raw['lounge-lights-on-20']['camera_source_position']
    assert r['color_management']==raw['lounge-lights-on-20']['color_management']
assert means['on']>means['one']>means['off'] and means['on']-means['off']>.1,means
write(E/'gate.json',{'status':'VERIFIED_INTERNALLY_PENDING_OPERATOR_VISUAL_ACCEPTANCE','master_sha256':h,'geometry_and_controls_checks':g['checks'],'routes':len(g['routes']),'actual_render_pairs':len(expected),'raw_lounge_lights_mean_srgb':means,'glass_pieces':glass['count'],'luminaires':len(m['luminaires']),'circuits':len(m['circuits']),'doors':len(m['doors']),'screens':len(m['televisions']),'wall_foliage_groups':sum(g['id'].startswith('sim:r1:greenwall:') for g in inventory['professional_instances']),'previous_phase04_preserved':True,'original_protected_files_unchanged':577,'upstream_plan_exact_revision':read(HANDOFF/'evidence/upstream-revisions.json'),'human_approval':False,'PlayCanvas_started':False,'Mixamo_started':False})
print('REVISION_FINAL_GATE_PASS',g['checks'],'geometry/controls checks;',len(expected),'actual render pairs; pending operator visual acceptance')
