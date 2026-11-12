"""Local completion supervisor: wait without model polling, then audit Core replay."""
import json
import os
import subprocess
import time
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
private=ROOT/'simulation/spatial-office/.runtime';folder=ROOT/'docs/spatial-simulation/evidence/p2-09/09.17/trial-a'
status=private/'finish-core17-status.json';started=time.perf_counter()
status.write_text(json.dumps({'done':False,'pid':os.getpid(),'command':'finish-cctv-core.py','log':'finish-core17.log'})+'\n')
try:
    while True:
        try:upstream=json.loads((private/'validate-core17-status.json').read_text())
        except (FileNotFoundError,json.JSONDecodeError):upstream={}
        if upstream.get('done'):
            if upstream['exit_code']!=0:raise RuntimeError('Main Core validation failed; see private main log')
            break
        if time.perf_counter()-started>1800:raise RuntimeError('Main Core validation timeout; no automatic duplicate launch')
        time.sleep(1)
    with (private/'finish-core17.log').open('w') as log:
        for python,script in [('/opt/entity-p2/cpu-venv/bin/python','check-cctv-core-inputs.py'),
                              ('/opt/entity-p2/api-venv/bin/python','audit-cctv-core-isolation.py')]:
            subprocess.run([python,str(ROOT/'scripts/spatial-simulation/perception'/script)],check=True,stdout=log,stderr=log)
    assert json.loads((folder/'isolation.json').read_text())['passed']
    gate=json.loads((folder/'gate.json').read_text());gate['core_ground_truth_isolation']=True
    gate['core_stage_checks_passed']=True;gate['technical_gate_passed']=True;gate.pop('final_gate_pending',None)
    gate['repeated_pixel_inference_invariant']=True
    (folder/'gate.json').write_text(json.dumps(gate,indent=2)+'\n')
    status.write_text(json.dumps({'done':True,'pid':os.getpid(),'exit_code':0,'seconds':time.perf_counter()-started})+'\n')
    print(json.dumps(gate))
except Exception:
    status.write_text(json.dumps({'done':True,'pid':os.getpid(),'exit_code':1,'seconds':time.perf_counter()-started})+'\n')
    raise
