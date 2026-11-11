"""Evaluator-only replay of frozen sequence/detection checks in new output folders.

This script must never be mounted or imported into perception workers.
"""
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--run', required=True)
p.add_argument('--stage', choices=['sequence', 'detection'], required=True)
a = p.parse_args()
import re
if not re.fullmatch(r'[a-z0-9][a-z0-9_-]{0,63}', a.run):
    p.error('Invalid run ID')
evidence = f'docs/spatial-simulation/evidence/p2-09/09.11/{a.run}'
name = 'check_sequence.py' if a.stage == 'sequence' else 'evaluate_detection.py'
source = ROOT / 'scripts/spatial-simulation/perception' / name
code = source.read_text()
replacements = [
    ('simulation/spatial-office/.runtime/p2-09-frames', f'simulation/spatial-office/.runtime/local-{a.run}-frames'),
    ('simulation/spatial-office/.runtime/p2-09-evaluation', f'simulation/spatial-office/.runtime/local-{a.run}-evaluation'),
    ('docs/spatial-simulation/evidence/p2-09/09.4', evidence + '/capture'),
]
if a.stage == 'detection':
    replacements += [('docs/spatial-simulation/evidence/p2-09/09.5', evidence + '/evaluation'),
                     ("Path('/tmp/p2-09-vision-output/detections.json')",
                      f"(ROOT/'simulation/spatial-office/.runtime/local-{a.run}-output/detections.json')")]
    (ROOT / evidence / 'evaluation').mkdir(parents=True, exist_ok=True)
for before, after in replacements:
    # Some stages do not refer to the other stage's report path.
    if before in code:
        code = code.replace(before, after)
exec(compile(code, str(source), 'exec'), {'__file__': str(source), '__name__': '__main__'})
if a.stage == 'detection':
    # Public evidence is aggregate-only. Detailed evaluator visibility/IoU stays
    # local, outside all inference mounts and outside Git.
    import json
    report_path = ROOT / evidence / 'evaluation/detection-checks.json'
    report = json.loads(report_path.read_text())
    records = report.pop('records', [])
    private = ROOT / f'simulation/spatial-office/.runtime/local-{a.run}-evaluation/detection-detail.json'
    private.write_text(json.dumps(records, indent=2) + '\n')
    report['per_frame_evaluator_detail'] = 'retained locally, not published or available to inference'
    report_path.write_text(json.dumps(report, indent=2) + '\n')
