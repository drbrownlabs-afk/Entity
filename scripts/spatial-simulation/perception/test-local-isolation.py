"""Orchestrator-only GT-disconnect/ID-change test. Never mounted into workers."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[3]
p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--run', required=True)
p.add_argument('--output', type=Path, required=True)
a = p.parse_args()
assert re.fullmatch(r'[a-z0-9][a-z0-9_-]{0,63}', a.run)
runtime = ROOT / 'simulation/spatial-office/.runtime'
truth = runtime / f'local-{a.run}-evaluation/truth.json'
offline = truth.with_suffix('.json.offline')
assert not offline.exists()
original_truth = truth.read_bytes()
frames = runtime / f'local-{a.run}-frames'
manifest = (frames / 'manifest.json').read_bytes()
files = ['detections.json', 'tracks.json', 'associations.json']

def stable(value):
    if isinstance(value, dict):
        return {key: stable(item) for key, item in value.items()
                if key not in {'inference_ms', 'processing_seconds', 'peak_rss_kib'}}
    if isinstance(value, list):
        return [stable(item) for item in value]
    return value

def infer():
    for worker in ['detect', 'mot', 'mtmc']:
        subprocess.run(['bash', str(ROOT / 'scripts/spatial-simulation/perception/run-local-isolated.sh')],
                       env={**os.environ, 'P2_LOCAL_RUN': a.run, 'P2_VISION_WORKER': worker},
                       check=True, stdout=subprocess.PIPE, text=True)
    return {name: stable(json.loads((runtime / f'local-{a.run}-output' / name).read_text()))
            for name in files}

baseline = infer()
results = {}
try:
    changed = json.loads(original_truth)
    changed['actor'] = 'different-evaluator-only-actor'
    truth.write_text(json.dumps(changed))
    results['changed_actor_id_same_outputs'] = infer() == baseline
    truth.rename(offline)
    results['disconnected_ground_truth_same_outputs'] = infer() == baseline
finally:
    if offline.exists():
        offline.rename(truth)
    truth.write_bytes(original_truth)
assert (frames / 'manifest.json').read_bytes() == manifest
assert all(results.values()), results
report = {'passed': True, 'scope': 'four-frame local smoke through detector, MOT and MTMC',
          'manifest_sha256': hashlib.sha256(manifest).hexdigest(),
          'timing_and_memory_excluded_from_output_equality': True,
          'original_evaluator_data_restored': True, **results}
a.output.parent.mkdir(parents=True, exist_ok=True)
a.output.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report))
