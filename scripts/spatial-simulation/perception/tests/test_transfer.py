"""Adversarial checks for imported asset integrity, independent of inference/GT."""
import hashlib
import importlib.util
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'audit-transfer.py'
spec = importlib.util.spec_from_file_location('transfer_audit', SCRIPT)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
TEST_TEMP = audit.ROOT / 'simulation/spatial-office/.runtime/transfer-tests'


class TransferTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_TEMP.mkdir(parents=True, exist_ok=True)

    def test_corrupt_and_missing_model_fail_integrity(self):
        with tempfile.TemporaryDirectory(dir=TEST_TEMP) as folder:
            root = Path(folder)
            expected = hashlib.sha256(b'expected model').hexdigest()
            self.assertEqual(audit.inspect_file(root, 'model.onnx', expected)['status'], 'missing')
            (root / 'model.onnx').write_bytes(b'corrupted model')
            self.assertEqual(audit.inspect_file(root, 'model.onnx', expected)['status'], 'hash_mismatch')
            (root / 'model.onnx').write_bytes(b'expected model')
            self.assertEqual(audit.inspect_file(root, 'model.onnx', expected)['status'], 'verified')

    def test_import_cannot_read_outside_input_folder(self):
        with tempfile.TemporaryDirectory(dir=TEST_TEMP) as folder:
            for name in ('../truth.json', '/tmp/truth.json', 'C:\\truth.json', 'subdir/truth.json'):
                with self.subTest(name=name):
                    self.assertEqual(audit.inspect_file(Path(folder), name, '0' * 64)['status'], 'unsafe_path')

    def test_local_recapture_does_not_require_old_pngs(self):
        with tempfile.TemporaryDirectory(dir=TEST_TEMP) as folder:
            root = Path(folder)
            report = audit.inventory(root / 'frames', root / 'models')
            self.assertEqual(report['frame_status_counts'], {'missing': 246})
            self.assertFalse(report['original_pngs_required'])
            self.assertFalse(report['original_pngs_absence_blocks_local_recapture'])
            self.assertFalse(report['phase_gate_passed'])
            self.assertFalse(report['ground_truth_opened'])

    def test_cli_refuses_overwriting_frozen_evidence(self):
        reference = audit.ROOT / 'docs/spatial-simulation/evidence/p2-09/09.4/manifest.json'
        before = reference.read_bytes()
        result = subprocess.run([sys.executable, str(SCRIPT), '--output', str(reference)],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)
        self.assertIn('Historical baseline evidence is frozen', result.stderr)
        self.assertEqual(before, reference.read_bytes())


if __name__ == '__main__':
    unittest.main()
