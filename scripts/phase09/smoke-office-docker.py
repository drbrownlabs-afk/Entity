"""Check actual Docker service state and immutable events across container restart."""
import json,hashlib,subprocess,time
from pathlib import Path
from uuid import uuid4
import httpx
root=Path(__file__).resolve().parents[2];base='http://127.0.0.1:8010'
credentials=json.loads((root/'.runtime/office/access.json').read_text())
with httpx.Client(base_url=base,timeout=20) as client:
    for _ in range(100):
        try:
            if client.get('/ready').status_code==200:break
        except httpx.HTTPError:pass
        time.sleep(.2)
    else:raise RuntimeError('Docker Office initial readiness did not recover')
    response=client.post('/v1/office/auth/login',json={'username':'admin','password':credentials['admin']['password']});response.raise_for_status()
    headers={'Authorization':'Bearer '+response.json()['token']};prefix='/v1/sites/synthetic-office/runs/day-01'
    key='technical-smoke-'+str(uuid4())
    for op,target,inputs in [('task.create','site',{'task_id':key,'resource_id':'D1','description':'Prueba técnica explícita de persistencia; no incidencia física'}),('task.resolve',key,{'resolution':'Prueba técnica terminada'})]:
        response=client.post(prefix+'/commands',headers=headers,json={'id':str(uuid4()),'operation':op,'target':target,'inputs':inputs});response.raise_for_status();assert response.json()['status']=='verified'
    before=client.get(prefix+'/world',headers=headers).json();events=client.get(prefix+'/events?limit=1000',headers=headers).json()
    subprocess.run(['docker','compose','-f','compose.office.yaml','restart','entity-office'],cwd=root,check=True,capture_output=True)
    for _ in range(100):
        try:
            if client.get('/ready').status_code==200:break
        except httpx.HTTPError:pass
        time.sleep(.2)
    else:raise RuntimeError('Docker Office readiness did not recover')
    after=client.get(prefix+'/world',headers=headers).json();after_events=client.get(prefix+'/events?limit=1000',headers=headers).json()
    assert before==after and events==after_events,'State or immutable event mismatch'
    assert after['entities'][key]['status']=='resolved'
    legacy=httpx.get('http://127.0.0.1:8000/health');legacy.raise_for_status()
report={'status':'passed','original_office_api':'http://127.0.0.1:8010','legacy_core_health':'passed on8000, service preserved',
        'container_restart_state_equal':True,'event_log_equal':True,'entity_count':len(after['entities']),'events':len(after_events),
        'world_sha256':hashlib.sha256(json.dumps(after,sort_keys=True).encode()).hexdigest(),'credentials_logged':False}
(root/'docs/evidence/phase09/docker-office.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
