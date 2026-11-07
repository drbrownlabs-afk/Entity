"""Archive safety tests only, not synthetic replacement scene assets."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
import zipfile
spec=importlib.util.spec_from_file_location('intake',Path(__file__).parents[1]/'import-synthetic-office.py');intake=importlib.util.module_from_spec(spec);spec.loader.exec_module(intake)

class IntakeTests(unittest.TestCase):
    def test_project_is_preserved_without_executing_code(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'project.zip'
            with zipfile.ZipFile(source,'w') as z:
                z.writestr('project/package.json','{"scripts":{"postinstall":"exit 1"}}');z.writestr('project/index.html','<html></html>')
            report=intake.import_original(source,Path(tmp)/'output')
            self.assertFalse(report['scripts_executed']);self.assertFalse(report['spatial_gate_verified'])
            self.assertEqual((Path(report['directory'])/'project/package.json').read_text(),'{"scripts":{"postinstall":"exit 1"}}')
            self.assertEqual(report['content_sha256'],intake.import_original(source,Path(tmp)/'output')['content_sha256'])
    def test_traversal_rejected(self):
        for name in ['../outside','/outside','C:/outside','..\\outside']:
            with self.subTest(name=name),tempfile.TemporaryDirectory() as tmp:
                source=Path(tmp)/'bad.zip'
                with zipfile.ZipFile(source,'w') as z:z.writestr(name,'bad')
                with self.assertRaises(ValueError):intake.import_original(source,Path(tmp)/'output')
    def test_private_environment_is_not_imported(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'bad.zip'
            with zipfile.ZipFile(source,'w') as z:z.writestr('.env','not a real secret')
            with self.assertRaises(ValueError):intake.import_original(source,Path(tmp)/'output')
