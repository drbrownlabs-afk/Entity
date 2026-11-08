import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from common import EVIDENCE, HANDOFF, HERE, ROOT, protected_changes, read, sha256, to_blender, to_source


class SourceTests(unittest.TestCase):
    def test_originals_byte_identical(self):
        self.assertEqual(protected_changes(),[])

    def test_coordinate_handedness_and_roundtrip(self):
        basis=[(1,0,0),(0,1,0),(0,0,1)]
        self.assertEqual([to_blender(p) for p in basis],[(1,0,0),(0,0,1),(0,-1,0)])
        for p in basis+[(-2.5,-1.55,-16.8)]: self.assertEqual(to_source(to_blender(p)),p)
        a,b,c=[to_blender(p) for p in basis]
        cross=(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
        self.assertEqual(cross,c)  # determinant +1; no mirrored scene

    def test_required_source_hashes(self):
        for path,digest in read(HANDOFF/'SPACE-INVENTORY.json')['source_hashes'].items():
            self.assertEqual(sha256(ROOT/path),digest,path)

    def test_estimates_are_explicit(self):
        layout=read(HERE/'layout.json')
        self.assertIn('not measured',layout['classification'])
        self.assertEqual({r['id'] for r in layout['workgroups']},{'A','B','C','D'})
        for group in layout['workgroups']:
            self.assertTrue((ROOT/group['evidence']).is_file())
            self.assertTrue(group['note'])
        self.assertIn('unknown',layout['pods']['note'])

    def test_extractor_reproduces_handoff_in_temporary_copy(self):
        # The legacy extractor writes its outputs. Never execute it on this checkout.
        with tempfile.TemporaryDirectory(prefix='entity-handoff-') as tmp:
            target=Path(tmp)
            paths=list(read(HANDOFF/'SPACE-INVENTORY.json')['source_hashes'])+[
                'scripts/spatial-simulation/extract-handoff.py',
                'worlds/synthetic-office/observed-inventory.json',
                'worlds/synthetic-office/inspection-cameras.json',
                'worlds/synthetic-office/view-bookmarks.json',
                'worlds/synthetic-office/product-views.json']
            for path in paths:
                (target/path).parent.mkdir(parents=True,exist_ok=True)
                shutil.copy2(ROOT/path,target/path)
            (target/'docs/spatial-simulation').mkdir(parents=True,exist_ok=True)
            result=subprocess.run([sys.executable,str(target/'scripts/spatial-simulation/extract-handoff.py')],capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            counts=json.loads(result.stdout)
            self.assertEqual(counts,{'inventory_entries':56,'annotations':7,'floor_vertices':16709,'floor_triangles':29526,'ids_unique':True,'references_valid':True})
            for name in ['SPACE-INVENTORY.json','ANNOTATIONS-MAP.json','WALKABLE-FLOOR.obj']:
                self.assertEqual(sha256(target/'docs/spatial-simulation'/name),sha256(HANDOFF/name),name)
        self.assertEqual(protected_changes(),[])


if __name__=='__main__': unittest.main(verbosity=2)
