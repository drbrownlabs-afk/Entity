"""Independent adverse probes: real loopback HTTP, isolated synthetic SQLite, no user services."""
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import socket
import sqlite3
import subprocess
import sys
import tempfile
import time
from uuid import uuid4
import httpx

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'.runtime/mvp-audit-core.json'
results=[]

def record(case,observed,desired,**evidence):
    results.append({'case':case,'observed':observed,'desired':desired,'meets_desired':observed==desired,'evidence':evidence})

with tempfile.TemporaryDirectory(prefix='entity-independent-audit-') as directory:
    database=Path(directory)/'core.sqlite3'
    with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
    env=dict(os.environ,ENTITY_SQLITE_PATH=str(database),ENTITY_AGENT_PROVIDER='controlled',ENTITY_CONNECTOR_TOKENS=json.dumps([
        {'token':'audit-test-only','actor':'audit','permissions':['registry:write','observe:write','output:write','agent:read','simulate:write']},
        {'token':'audit-observe-only','actor':'other-source','permissions':['observe:write']}]))
    log=(Path(directory)/'server.log').open('w');proc=None
    def stop():
        if proc and proc.poll() is None:proc.terminate();proc.wait(timeout=10)
    def start():
        p=subprocess.Popen([str(ROOT/'.venv/bin/python'),'-m','uvicorn','app.main:app','--host','127.0.0.1','--port',str(port)],cwd=ROOT/'services/entity-api',env=env,stdout=log,stderr=log)
        for _ in range(100):
            try:
                if httpx.get(f'http://127.0.0.1:{port}/ready',trust_env=False,timeout=.3).status_code==200:return p
            except httpx.TransportError:pass
            if p.poll() is not None:break
            time.sleep(.1)
        p.terminate();p.wait();raise RuntimeError('Audit Core startup failed')
    try:
        proc=start()
        with httpx.Client(base_url=f'http://127.0.0.1:{port}',trust_env=False,timeout=10,headers={'Connection':'close'}) as client:
            h={'Authorization':'Bearer audit-test-only'}
            def send(method,path,body=None,headers=h):
                r=client.request(method,path,json=body,headers=headers);r.raise_for_status();return r.json()
            for identity,kind in [('cam','Camera'),('screen','Display'),('site','Site'),('sensor','Sensor'),('memory-only','Room'),('a:b','Camera'),('a','Camera'),('poison','Room')]:
                send('POST','/v1/entities',{'id':identity,'type':kind},headers={})
            cap=send('POST','/v1/entities/screen/capabilities',{'operation':'display.set_scene','description':'Audit synthetic screen','required_permission':'output:write'},headers={})['id']
            send('PUT','/v1/output/displays/screen',{})
            send('PUT','/v1/output/rules/one',{'camera_id':'cam','capability_id':cap})
            for cid in ['edge','other']:
                send('PUT','/v1/integrations/connectors/'+cid,{'connector_id':cid,'version':'1','protocols':['rest','simulation'],'input_event_types':['edge.presence','sensor.measurement'],'capability_schemas':['simulation.set_state']})
            def obs(source='cam',stamp=None,tracks=None,connector='edge',kind='edge.presence',payload=None):
                return {'observation_id':str(uuid4()),'site_id':'site','source_id':source,'observed_at':stamp or datetime.now(timezone.utc).isoformat(),'type':kind,'payload':payload if payload is not None else {'tracks':tracks if tracks is not None else [{'local_track_id':'person-1','zone_id':'north','position':[.2,.7]}],'source_status':'connected','transitions':[]},'provenance':{'connector_id':connector,'model_version':'independent-audit','simulated':True}}
            first=obs();send('POST','/v1/integrations/observations',first)
            before=send('GET','/v1/entities/cam/events')
            duplicate=send('POST','/v1/integrations/observations',first)
            record('exact_duplicate_does_not_reemit',duplicate['duplicate'] and send('GET','/v1/entities/cam/events')==before,True)
            late=obs(stamp='2020-01-01T00:00:00Z',tracks=[]);send('POST','/v1/integrations/observations',late)
            record('late_observation_retained_without_rewind',len(send('GET','/v1/entities/cam/events'))==2 and bool(send('GET','/v1/entities/cam')['state']['edge.presence']['tracks']),True)
            conflict=dict(first,payload={**first['payload'],'tracks':[]})
            record('reused_observation_id_different_body_rejected',client.post('/v1/integrations/observations',headers=h,json=conflict).status_code,409)
            bad=obs(payload={'source_status':'connected','tracks':[{'local_track_id':'incomplete'}]})
            count=len(send('GET','/v1/entities/cam/events'))
            rejected=client.post('/v1/integrations/observations',headers=h,json=bad)
            record('incomplete_snapshot_rejected_atomically',rejected.status_code==422 and len(send('GET','/v1/entities/cam/events'))==count,True)
            record('anonymous_output_command_denied',client.post('/v1/output/commands',json={'request_id':str(uuid4()),'capability_id':cap,'scene':'not-authorized'}).status_code,401)
            wrongscope=client.post('/v1/agent/requests',headers=h,json={'request_id':str(uuid4()),'entity_id':'cam','question':'wrong scope','action':{'capability_id':cap,'scene':'not-authorized'}})
            record('agent_action_cross_entity_denied',wrongscope.status_code,403)
            phantom=client.post('/v1/integrations/invocations',headers=h,json={'request_id':str(uuid4()),'capability':{'capability_id':str(uuid4()),'target_entity_id':'site','connector_id':'edge','operation':'simulation.set_state'},'key':'undeclared','value':True})
            record('simulation_capability_must_be_declared',phantom.status_code,404,registered_core_capability=False)
            unauthorized=client.put('/v1/entities/screen/state',json={'key':'display.scene','value':'unauthenticated-forgery'})
            entity=send('GET','/v1/entities/screen',headers={})
            display=client.get('/v1/output/displays/screen').text
            record('anonymous_core_write',unauthorized.status_code,401,core_scene=entity['state']['display.scene'],actual_virtual_scene_contains_welcome='welcome' in display)
            query=lambda entity,question:send('POST','/v1/agent/requests',{'request_id':str(uuid4()),'entity_id':entity,'question':question})
            send('POST','/v1/entities/memory-only/memories',{'content':'La recepción está cerrada por mantenimiento.','source':'audit'})
            answer=query('memory-only','¿Qué dice la memoria?')
            record('memory_only_answer_uses_recorded_memory','cerrada' in answer['answer'],True,answer=answer['answer'],memory_evidence=len(answer['evidence']['memories']))
            answer_a=query('cam','¿Cuántas personas hay?');answer_b=query('cam','¿Cuál es la temperatura actual?')
            record('question_changes_answer',answer_a['answer']!=answer_b['answer'],True,provider=answer_a['provider'],answer_a=answer_a['answer'],answer_b=answer_b['answer'])
            sensor=obs(source='sensor',kind='sensor.measurement',payload={'name':'temperature','value':19,'unit':'C'});send('POST','/v1/integrations/observations',sensor)
            record('sensor_projects_current_state',bool(send('GET','/v1/entities/sensor')['state']),True,event_count=len(send('GET','/v1/entities/sensor/events')),answer=query('sensor','¿Qué temperatura hay?')['answer'])
            unknown=obs();unknown['source_id']='cam';unknown['site_id']='unregistered-other-site';unknown['provenance']['connector_id']='other'
            response=client.post('/v1/integrations/observations',headers={'Authorization':'Bearer audit-observe-only'},json=unknown)
            record('observe_token_scoped_to_connector_source_site',response.status_code,403)
            future=obs(stamp='2099-01-01T00:00:00Z');send('POST','/v1/integrations/observations',future)
            current=obs(tracks=[]);send('POST','/v1/integrations/observations',current)
            state=send('GET','/v1/entities/cam')['state']['edge.presence']
            record('future_event_does_not_freeze_camera',state['observed_at'].startswith('2099'),False,stored_time=state['observed_at'],tracks=len(state['tracks']))
            stop();proc=start()
            record('restart_expires_unconfirmed_presence',bool(send('GET','/v1/entities/cam')['state']['edge.presence']['tracks']),False,observation='No TTL/heartbeat; source no longer transmitting')
            for camera,track in [('a:b','c'),('a','b:c')]:send('POST','/v1/integrations/observations',obs(source=camera,tracks=[{'local_track_id':track,'zone_id':'north','position':[.2,.7]}]))
            people=[e for e in send('GET','/v1/entities') if e['type']=='PersonTrack' and e['attributes']['camera_id'] in ['a:b','a']]
            record('camera_track_id_isolation',len(people),2,people=people)
            nan=client.put('/v1/entities/poison/state',content='{"key":"bad","value":NaN}',headers={'Content-Type':'application/json'})
            poisoned=client.get('/v1/entities/poison')
            record('nonfinite_json_does_not_poison_persistence',nan.status_code,422,subsequent_read_status=poisoned.status_code)
            invalid=client.get('/v1/integrations/connectors/edge/health',headers={b'Authorization':b'Bearer \xff'})
            record('malformed_bearer_fails_closed_cleanly',invalid.status_code,401)
            with sqlite3.connect(database) as db:
                record('integrity_check',db.execute('PRAGMA integrity_check').fetchone()[0],'ok')
    finally:
        stop();log.close()
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps({'transport':'real HTTP loopback uvicorn; temporary SQLite; all data synthetic; controlled provider only','checks':results},indent=2,ensure_ascii=False)+'\n')
for result in results:print(result['case'],result['observed'],'desired',result['desired'])
