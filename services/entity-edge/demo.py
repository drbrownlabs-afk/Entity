"""Self-contained HTTP demonstration. Creates local test credentials, never prints them."""
import argparse
import json
import os
from pathlib import Path
import secrets
import socket
import subprocess
import sys
import time
import httpx
from entity_edge.pipeline import Outbox, Edge

root=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser()
parser.add_argument('--video',required=True)
parser.add_argument('--directory',default='.runtime/edge-demo')
args=parser.parse_args()
work=(root/args.directory).resolve();work.mkdir(parents=True,exist_ok=True)
token=secrets.token_urlsafe(32)
with socket.socket() as s:
    s.bind(('127.0.0.1',0));port=s.getsockname()[1]
url=f'http://127.0.0.1:{port}'
env=dict(os.environ,ENTITY_SQLITE_PATH=str(work/'core.sqlite3'),ENTITY_CONNECTOR_TOKENS=json.dumps([
    {'token':token,'actor':'edge-demo','permissions':['registry:write','observe:write','audit:read']}]))
log=open(work/'core.log','a')

def start():
    proc=subprocess.Popen([str(root/'.venv/bin/python'),'-m','uvicorn','app.main:app','--port',str(port)],
                          cwd=root/'services/entity-api',env=env,stdout=log,stderr=log)
    deadline=time.monotonic()+20
    while True:
        try:
            if httpx.get(url+'/ready',trust_env=False).status_code==200:return proc
        except httpx.TransportError:pass
        if proc.poll() is not None or time.monotonic()>deadline:
            proc.terminate();proc.wait();raise RuntimeError('Core startup failed; inspect local core.log')
        time.sleep(.1)


def stop(proc):
    proc.terminate()
    try:proc.wait(timeout=10)
    except subprocess.TimeoutExpired:proc.kill();proc.wait()

proc=start()
try:
    for mode in ('simulation','video'):
        command=[sys.executable,'-m','entity_edge.cli','--zones',str(root/'services/entity-edge/zones.json'),
                 '--core',url,'--camera','demo-'+mode,'--outbox',str(work/(mode+'-outbox.sqlite3')),
                 '--report',str(work/(mode+'-report.json')),'--limit','60','--disconnect-frame','12']
        if mode=='video':command+=['--video',str(Path(args.video).resolve())]
        subprocess.run(command,env=dict(os.environ,ENTITY_EDGE_TOKEN=token),check=True,cwd=root)
        report=json.loads((work/(mode+'-report.json')).read_text())
        assert report['detections']>0 and report['tracked_samples']>0 and report['transitions']>0
    zones=json.loads((root/'services/entity-edge/zones.json').read_text())
    box=Outbox(str(work/'recovery.sqlite3'))
    edge=Edge(box,'demo-simulation','edge-demo',zones,simulated=True)
    message=edge.emit([])
    with httpx.Client(base_url=url,headers={'Authorization':'Bearer '+token},trust_env=False) as client:
        client.post('/v1/integrations/observations',json=message).raise_for_status() # acknowledged by Core, ack lost at Edge
        before=client.get('/v1/entities/demo-simulation/events').json()
        stop(proc)
        assert box.flush(client)==0
        box.close();box=Outbox(str(work/'recovery.sqlite3'))
        proc=start()
        assert box.flush(client,force=True)==1
        assert client.get('/v1/entities/demo-simulation/events').json()==before
        entities=client.get('/v1/entities').json()
        assert any(e['type']=='PersonTrack' for e in entities)
        result={'recovery':'passed','ack_loss_dedup':'passed','core_restart_persistence':'passed',
                'person_tracks':sum(e['type']=='PersonTrack' for e in entities),
                'video_events':len(client.get('/v1/entities/demo-video/events').json())}
        (work/'summary.json').write_text(json.dumps(result,indent=2)+'\n')
        print(json.dumps(result))
    box.close()
finally:
    if proc.poll() is None:stop(proc)
    log.close()
