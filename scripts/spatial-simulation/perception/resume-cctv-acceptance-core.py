"""Resume only Core after preserved five-run perception; never recapture/reinfer."""
import importlib.util
import json
import os
import subprocess
import time
import argparse
import hashlib
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
spec=importlib.util.spec_from_file_location('acceptance',ROOT/'scripts/spatial-simulation/perception/validate-cctv-acceptance.py')
acceptance=importlib.util.module_from_spec(spec);spec.loader.exec_module(acceptance)
started=time.perf_counter();status=acceptance.PRIVATE/'accept18-core-resume-status.json'
parser=argparse.ArgumentParser();parser.add_argument('--attempt',default='-r2');args=parser.parse_args()
assert args.attempt.startswith('-r') and args.attempt[2:].isdigit()
try:
    frozen=acceptance.read(acceptance.OUT/'frozen-policy.json')['sha256']
    assert acceptance.pinned()==frozen
    for case in acceptance.CASES:
        acceptance.write(status,{'done':False,'pid':os.getpid(),'current':case})
        folder=acceptance.OUT/case
        # The evaluator never selects which model outputs enter Core. Even a
        # failed quality gate must remain visible in the complete batch report.
        assert (folder/'evaluation.json').exists()
        worker=acceptance.PRIVATE/f'cctv-trial-{case}/output/accept18'
        if (folder/'persistence.json').exists() and (folder/'ingestion.json').exists():
            previous=acceptance.read(folder/'ingestion.json')
            if acceptance.read(folder/'persistence.json')['passed'] and previous['run']=='p2-09-'+case+args.attempt:
                assert previous['association_output_sha256']==hashlib.sha256((worker/'global-tracks.json').read_bytes()).hexdigest()
                continue
        seconds=sum(acceptance.read(worker/file)['processing_seconds'] for file in ['detections.json','tracks-tuned.json','reid-evidence.json','global-tracks.json'])
        acceptance.persist(case,seconds,attempt=args.attempt)
        result=acceptance.read(folder/'persistence.json')
        result['timing_scope']='sum of recorded inference processing times plus new measured Core ingress; not same-attempt walltime, excludes capture/evaluation/queue'
        result['vision_stage_timing_basis']='previously measured processing times; unchanged outputs reused after correcting only enrollment'
        acceptance.write(folder/'persistence.json',result)
    with (acceptance.PRIVATE/'edge-tests18.log').open('w') as log:
        subprocess.run(['/opt/entity-p2/cpu-venv/bin/python','-m','unittest','discover','-s','services/entity-edge/tests'],cwd=ROOT,
            env=os.environ|{'PYTHONPATH':str(ROOT/'services/entity-edge')},check=True,stdout=log,stderr=log)
    result=acceptance.summarize(frozen)
    acceptance.write(status,{'done':True,'pid':os.getpid(),'exit_code':0,'seconds':time.perf_counter()-started,'status':result['status']})
    print(json.dumps(result))
except Exception:
    acceptance.write(status,{'done':True,'pid':os.getpid(),'exit_code':1,'seconds':time.perf_counter()-started})
    raise
