"""Reproduce 09.16 from immutable 09.15 tracks, with separate post-hoc evaluator."""
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
os.chdir(ROOT)
folder=ROOT/'docs/spatial-simulation/evidence/p2-09/09.16/trial-a'
folder.mkdir(parents=True,exist_ok=True)
private=ROOT/'simulation/spatial-office/.runtime/cctv-trial-trial-a/output/tiles025'
wrapper=ROOT/'scripts/spatial-simulation/perception/run-cctv-isolated.sh'
env=os.environ|{'P2_TRIAL_RUN':'trial-a','P2_EXPERIMENT':'tiles025'}
for worker in ['reid','mtmc']:
    subprocess.run(['bash',str(wrapper)],env=env|{'P2_VISION_WORKER':worker},check=True)
python='/opt/entity-p2/cpu-venv/bin/python'
tests=subprocess.run([python,'-m','unittest','discover','-s','services/entity-edge/tests','-v'],
                     env=os.environ|{'PYTHONPATH':str(ROOT/'services/entity-edge')},capture_output=True,text=True)
(private/'edge-tests16.log').write_text(tests.stdout+tests.stderr)
if tests.returncode:raise RuntimeError('Edge regression tests failed; private log retained')
assert 'Ran 34 tests' in tests.stderr and '\nOK\n' in tests.stderr
(folder/'test-results.json').write_text(json.dumps({'edge_tests_passed':34,'new_mtmc_behavior_tests':13,
    'negative_cases':['identical appearance impossible speed','closed topology after long pause','same-sensor simultaneous IDs',
                      'transitive contradiction','ambiguous competing alternatives','unknown geometry','sensor provenance mismatch',
                      'forbidden actor field','within-track teleport','conflicting views'],
    'positive_cases':['uncertainty region crossing nearest-cell ambiguity','retained identity through gap without new observations',
                      'stable identity when later evidence appended']},indent=2)+'\n')
for script in ['evaluate-cctv-mtmc.py','audit-cctv-mtmc-isolation.py']:
    subprocess.run([python,str(ROOT/'scripts/spatial-simulation/perception'/script)],check=True)
evaluation=json.loads((folder/'evaluation.json').read_text())
isolation=json.loads((folder/'isolation.json').read_text())
assert evaluation['technical_gate_passed'] and isolation['passed']
files=['services/entity-edge/entity_edge/cctv_reid.py','services/entity-edge/entity_edge/cctv_mtmc.py',
       'scripts/spatial-simulation/perception/run-cctv-isolated.sh']
gate={'phase':'P2-09.16','technical_gate_passed':True,'evaluation':'evaluation.json','ground_truth_isolation':'isolation.json',
      'edge_tests_passed':34,'baseline_modified':False,'core_modified':False,'next_phase':'P2-09.17',
      'human_final_acceptance':False,'code_sha256':{f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in files}}
(folder/'gate.json').write_text(json.dumps(gate,indent=2)+'\n')
print(json.dumps(gate))
