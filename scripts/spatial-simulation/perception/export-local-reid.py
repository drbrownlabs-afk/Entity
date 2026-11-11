"""Reuse the historical OSNet export, preserving its frozen report and model inputs."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
source = ROOT / 'scripts/spatial-simulation/perception/prepare-reid.py'
models = ROOT / 'simulation/spatial-office/.runtime/p2-vision-models'
reference = json.loads((ROOT / 'docs/spatial-simulation/evidence/p2-09/09.7/reid-model.json').read_text())
for name, key in [('osnet_ain.py', 'source_sha256'), ('osnet_ain_ms_d_c_wtsonly.pth', 'weights_sha256')]:
    if hashlib.sha256((models / name).read_bytes()).hexdigest() != reference[key]:
        raise RuntimeError('Pinned OSNet input mismatch: ' + name)
output = ROOT / 'docs/spatial-simulation/evidence/p2-09/09.10/local-reid'
output.mkdir(parents=True, exist_ok=False)
code = source.read_text()
old = "out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.7'"
if code.count(old) != 1:
    raise RuntimeError('Historical exporter changed: review output relocation')
code = code.replace(old, "out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.10/local-reid'")
exec(compile(code, str(source), 'exec'), {'__file__': str(source), '__name__': '__main__'})
report = json.loads((output / 'reid-model.json').read_text())
comparison = {'same_weights': report['weights_sha256'] == reference['weights_sha256'],
              'same_onnx_binary': report['onnx_sha256'] == reference['onnx_sha256'],
              'export_parity_passed': report['onnx_torch_max_abs_error'] < .001,
              'historical_report_modified': False}
(output / 'baseline-comparison.json').write_text(json.dumps(comparison, indent=2) + '\n')
print(json.dumps(comparison))
