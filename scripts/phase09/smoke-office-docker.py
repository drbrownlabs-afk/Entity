"""Check actual Docker service state and immutable events across container restart."""
import json,hashlib,subprocess,time,sqlite3
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
    # Restart while the clock is RUNNING: disk state after shutdown is the authority,
    # since a tick may legitimately commit between the last HTTP read and shutdown.
    clock_run='technical-clock-'+str(uuid4());clock_root='/v1/sites/synthetic-office/runs/'+clock_run
    r=client.post('/v1/sites/synthetic-office/runs',headers=headers,json={'id':clock_run,'clock':'2026-11-07T08:00:00-05:00'});r.raise_for_status()
    client.post(clock_root+'/simulation/install',headers=headers).raise_for_status()
    initial=client.get(clock_root+'/world',headers=headers).json()['clock']
    client.post(clock_root+'/simulation/control',headers=headers,json={'action':'play'}).raise_for_status()
    for _ in range(100):
        if client.get(clock_root+'/world',headers=headers).json()['clock']>initial:break
        time.sleep(.05)
    else:raise RuntimeError('Actual container clock did not advance')
    subprocess.run(['docker','compose','-f','compose.office.yaml','stop','entity-office'],cwd=root,check=True,capture_output=True)
    with sqlite3.connect(root/'.runtime/office/core.sqlite3') as db:
        persisted_clock=db.execute('SELECT clock FROM office_runs WHERE site=? AND id=?',('synthetic-office',clock_run)).fetchone()[0]
        persisted_state=db.execute('SELECT entity,body FROM office_state WHERE site=? AND run=? ORDER BY branch,entity',('synthetic-office',clock_run)).fetchall()
    subprocess.run(['docker','compose','-f','compose.office.yaml','start','entity-office'],cwd=root,check=True,capture_output=True)
    for _ in range(100):
        try:
            if client.get('/ready').status_code==200:break
        except httpx.HTTPError:pass
        time.sleep(.2)
    else:raise RuntimeError('Running-clock restart did not recover')
    recovered=client.get(clock_root+'/world',headers=headers).json()
    assert recovered['clock']==persisted_clock and recovered['playback']['paused'],'Restart changed the committed clock or left playback active'
    with sqlite3.connect(root/'.runtime/office/core.sqlite3') as db:
        assert persisted_state==db.execute('SELECT entity,body FROM office_state WHERE site=? AND run=? ORDER BY branch,entity',('synthetic-office',clock_run)).fetchall(),'Recovery changed entity state'
    assert any(e['type']=='simulation.paused_on_restart' for e in client.get(clock_root+'/events?limit=1000',headers=headers).json())
    source_code="import pathlib,hashlib,json;print(json.dumps({str(p.relative_to('/app')):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(pathlib.Path('/app/app').rglob('*.py'))}))"
    image_sources=json.loads(subprocess.check_output(['docker','compose','-f','compose.office.yaml','exec','-T','entity-office','python','-c',source_code],cwd=root))
    local_sources={str(p.relative_to(root/'services/entity-api')):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((root/'services/entity-api/app').rglob('*.py'))}
    assert image_sources==local_sources,'Running image does not contain the current Core source'
    container=subprocess.check_output(['docker','compose','-f','compose.office.yaml','ps','-q','entity-office'],cwd=root,text=True).strip()
    image_id=subprocess.check_output(['docker','inspect','--format','{{.Image}}',container],cwd=root,text=True).strip()
    legacy=httpx.get('http://127.0.0.1:8000/health');legacy.raise_for_status()
report={'status':'passed','original_office_api':'http://127.0.0.1:8010','legacy_core_health':'passed on8000, service preserved',
        'container_restart_state_equal':True,'event_log_equal':True,'entity_count':len(after['entities']),'events':len(after_events),
        'world_sha256':hashlib.sha256(json.dumps(after,sort_keys=True).encode()).hexdigest(),'credentials_logged':False,'running_clock_restart_paused_without_offline_time':True,'clock_run':clock_run,'persisted_clock':persisted_clock,'source_files_sha256':image_sources,'running_image_id':image_id}
(root/'docs/evidence/phase09/docker-office.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
