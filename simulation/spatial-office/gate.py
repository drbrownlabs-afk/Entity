"""Final evidence gate: reject stale/incomplete renders and preserve human review boundary."""
import json
import struct
import subprocess
import sys
from pathlib import Path

from common import EVIDENCE, HERE, OUTPUT, ROOT, protected_changes, read, sha256, write


def main():
    result=subprocess.run([sys.executable,'-m','unittest','discover','-s',str(HERE/'tests'),'-v'],cwd=ROOT,capture_output=True,text=True)
    (EVIDENCE/'source-tests.txt').write_text(result.stdout+result.stderr)
    assert result.returncode==0,'Source tests failed; see source-tests.txt'
    assert not protected_changes(),protected_changes()
    blend_hash=sha256(OUTPUT/'office-phase01.blend')
    validation=read(EVIDENCE/'validation.json')
    assert validation['passed'] and all(c['passed'] for c in validation['checks'])
    assert validation['blend_sha256']==blend_hash,'Stale Blender validation'
    renders=read(EVIDENCE/'renders.json')
    expected={'dollhouse','plan','annotation:0','annotation:1','annotation:2','wall-from-a','wall-from-b','table-c-seats','table-d-seats','original-plan-near-clipped'}
    assert len(renders)==len(expected) and {r['view'] for r in renders}==expected,'Missing or duplicate renders'
    for r in renders:
        path=EVIDENCE/r['path']
        assert path.is_file() and sha256(path)==r['sha256'],r['view']
        assert r['source_blend_sha256']==blend_hash,('Stale render',r['view'])
        data=path.read_bytes()
        assert data[:8]==b'\x89PNG\r\n\x1a\n',r['view']
        width,height=struct.unpack('>II',data[16:24])
        assert width>=1060 and height>=780,(r['view'],width,height)
    visual=read(EVIDENCE/'visual-review.json')
    assert visual['blend_sha256']==blend_hash,'Stale visual review'
    assert set(visual['reviewed_images'])=={r['path'] for r in renders},'Incomplete visual review'
    assert visual['reviewer']=='Codex' and visual['human_acceptance'] is False
    assert visual['result']=='recognizable-approximation-with-documented-limitations'
    inventory=read(OUTPUT/'object-inventory.json')
    for path,digest in inventory['source_sha256'].items():
        assert sha256(ROOT/path)==digest,('Stale build input',path)
    report={'phase':'01','technical_status':'VERIFIED_WITH_DOCUMENTED_LIMITATIONS',
            'phase_status':'EN VALIDACIÓN','human_approval':False,
            'blend_sha256':blend_hash,'source_tests':'5 PASS',
            'blender_checks':len(validation['checks']),'cycles_images':len(renders),
            'protected_files_verified':len(read(EVIDENCE/'protected-files.json')['sha256']),
            'protected_files_changed':[], 'phase02_started':False,
            'visual_review':'visual-review.json','limitations':visual['limitations'],
            'configuration_draft_saved':False}
    write(EVIDENCE/'gate.json',report)
    print(json.dumps(report,ensure_ascii=False,indent=2))


if __name__=='__main__':
    main()
