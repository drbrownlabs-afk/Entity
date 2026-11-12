"""Supervise corrected remaining quality regressions, preserving every attempt."""
import json
import os
import subprocess
import sys
import time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
PRIVATE=ROOT/'simulation/spatial-office/.runtime'
STATUS=PRIVATE/'causal19-quality-status.json'
completed=[];started=time.monotonic()


def save(**state):STATUS.write_text(json.dumps({'pid':os.getpid(),'elapsed_seconds':time.monotonic()-started,'completed':completed,**state},indent=2)+'\n')


try:
    save(state='running')
    for index in range(1,5):
        run=f'p2-09-causal19-reg-v{index}a';corpus=f'accept18-v{index}';folder=PRIVATE/('causal19-'+run)
        if folder.exists():raise RuntimeError('Existing attempt must be inspected, never silently relaunched: '+run)
        save(state='running',current=run)
        with (PRIVATE/(run+'-supervisor.log')).open('w') as log:
            subprocess.run([sys.executable,str(ROOT/'scripts/spatial-simulation/perception/replay-causal-cctv.py'),
                '--run',run,'--corpus',corpus,'--seconds','125','--core','--lossless'],cwd=ROOT,stdout=log,stderr=log,check=True,timeout=1800)
            subprocess.run([sys.executable,str(ROOT/'scripts/spatial-simulation/perception/evaluate-causal-cctv.py'),
                '--run',run,'--corpus',corpus],cwd=ROOT,stdout=log,stderr=log,check=True,timeout=120)
        completed.append(run)
        save(state='running')
    save(state='done',exit_code=0)
except BaseException as exc:
    save(state='failed',error=str(exc));raise
