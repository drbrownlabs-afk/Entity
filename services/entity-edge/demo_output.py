"""Real HTTP virtual laboratory. No device/network protocol or custom rendering engine."""
import json
import os
from pathlib import Path
import secrets
import socket
import subprocess
import time
from uuid import uuid4
import httpx
from entity_edge.pipeline import Edge,Outbox

root=Path(__file__).resolve().parents[2]
work=root/'.runtime/output-demo';work.mkdir(parents=True,exist_ok=True)
token=secrets.token_urlsafe(32)
with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
env=dict(os.environ,ENTITY_SQLITE_PATH=str(work/'core.sqlite3'),ENTITY_CONNECTOR_TOKENS=json.dumps([
    {'token':token,'actor':'virtual-lab','permissions':['registry:write','observe:write','output:write','audit:read']}]))
log=open(work/'server.log','a')
proc=None

def start():
    p=subprocess.Popen([str(root/'.venv/bin/python'),'-m','uvicorn','app.main:app','--port',str(port)],cwd=root/'services/entity-api',env=env,stdout=log,stderr=log)
    deadline=time.monotonic()+20
    while True:
        try:
            if httpx.get(f'http://127.0.0.1:{port}/ready',trust_env=False).status_code==200:return p
        except httpx.TransportError:pass
        if p.poll() is not None or time.monotonic()>deadline:
            p.terminate();p.wait();raise RuntimeError('Core startup failed; inspect local server.log')
        time.sleep(.1)


def stop(p):
    p.terminate()
    try:p.wait(timeout=10)
    except subprocess.TimeoutExpired:p.kill();p.wait()

try:
    proc=start()
    with httpx.Client(base_url=f'http://127.0.0.1:{port}',headers={'Authorization':'Bearer '+token},trust_env=False) as client:
        def send(method,path,body):
            result=client.request(method,path,json=body);result.raise_for_status();return result.json()
        run=str(uuid4());camera='lab-camera-'+run;screen='lab-screen-'+run
        for identity,kind in [(camera,'Camera'),(screen,'Display')]:send('POST','/v1/entities',{'id':identity,'type':kind})
        cap=send('POST',f'/v1/entities/{screen}/capabilities',{'operation':'display.set_scene','description':'Virtual screen','required_permission':'output:write'})['id']
        send('PUT',f'/v1/output/displays/{screen}',{})
        send('PUT','/v1/output/rules/'+run,{'camera_id':camera,'capability_id':cap})
        send('PUT','/v1/integrations/connectors/edge-output',{'connector_id':'edge-output','version':'1','protocols':['simulation'],'input_event_types':['edge.presence']})
        box=Outbox(str(work/'outbox.sqlite3'))
        edge=Edge(box,camera,'edge-output',json.loads((root/'services/entity-edge/zones.json').read_text()),simulated=True)
        edge.emit([('1',[.2,.7])]);assert box.flush(client,force=True)==1
        state=client.get(f'/v1/entities/{screen}').json()['state']
        assert state['display.scene']=='welcome'
        page=client.get(f'/v1/output/displays/{screen}').text
        assert 'welcome' in page and 'SIMULATED OUTPUT' in page
        (work/'screen.html').write_text(page)
        edge.emit([]);assert box.flush(client,force=True)==1
        assert client.get(f'/v1/entities/{screen}').json()['state']['display.scene']=='idle'
        send('PUT',f'/v1/output/displays/{screen}',{'manual':True})
        command={'request_id':str(uuid4()),'capability_id':cap,'scene':'manual scene'}
        expected=send('POST','/v1/output/commands',command);assert expected['status']=='verified'
        edge.emit([('1',[.2,.7])]);assert box.flush(client,force=True)==1
        assert client.get(f'/v1/entities/{screen}').json()['state']['display.scene']=='manual scene'
        outcomes={}
        for behavior,status in [('fail','failed'),('timeout','timed_out'),('mismatch','verification_failed')]:
            send('PUT',f'/v1/output/displays/{screen}',{'manual':True,'behavior':behavior})
            result=send('POST','/v1/output/commands',{'request_id':str(uuid4()),'capability_id':cap,'scene':'requested'})
            assert result['status']==status;outcomes[behavior]=status
        stop(proc);proc=start()
        assert send('POST','/v1/output/commands',command)==expected
        events=client.get(f'/v1/entities/{screen}/events').json()
        assert any(e['payload'].get('status')=='suppressed' for e in events if e['type']=='output.result')
        report={'presence_to_welcome':'passed','absence_to_idle':'passed','manual_override':'passed',
                'declared_capability':cap,'restart_idempotency':'passed','simulated':True,'faults':outcomes,
                'output_events':sum(e['type']=='output.result' for e in events)}
        (work/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps(report));box.close()
finally:
    if proc and proc.poll() is None:stop(proc)
    log.close()
