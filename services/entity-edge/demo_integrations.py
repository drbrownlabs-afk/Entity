"""Local RTSP + real MQTT + REST fixture, using mature servers and unchanged Core."""
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import json
import os
from pathlib import Path
import secrets
import socket
import subprocess
import sys
import threading
import time
from uuid import uuid4
import httpx
import paho.mqtt.client as mqtt
from entity_edge.integrations import MqttSensor,poll_reservations
from entity_edge.pipeline import Outbox

root=Path(__file__).resolve().parents[2]
work=root/'.runtime/integrations-demo';work.mkdir(parents=True,exist_ok=True)
log=open(work/'services.log','a')
containers=[];processes=[];servers=[];subscriber=None;publisher=None
MEDIAMTX='bluenviron/mediamtx:1.12.3@sha256:3634a1eed1288b93e8d22ed74694eae96d483fcf676cac5d0c91830ad1b86b3d'
MOSQUITTO='eclipse-mosquitto:2.0.22@sha256:81a6193ae693942a3231cd3ac52875b02b7e3a19da671b2fb4b55cc874c5b279'

def docker(*args):return subprocess.check_output(['docker',*args],text=True).strip()
def start_container(image,port,*args):
    with socket.socket() as sock:
        sock.bind(('127.0.0.1',0));host_port=sock.getsockname()[1]
    cid=docker('run','--rm','-d','-p',f'127.0.0.1:{host_port}:{port}',image,*args);containers.append(cid)
    return cid,int(docker('port',cid,str(port)+'/tcp').rsplit(':',1)[1])
def wait(check,timeout=20):
    deadline=time.monotonic()+timeout
    while time.monotonic()<deadline:
        try:
            if check():return
        except (OSError,httpx.TransportError):pass
        time.sleep(.1)
    raise RuntimeError('Readiness deadline exceeded; inspect local services.log')

def listening(port):
    with socket.create_connection(('127.0.0.1',port),timeout=.5):return True

try:
    _,rtsp_port=start_container(MEDIAMTX,8554)
    broker,mqtt_port=start_container(MOSQUITTO,1883,'sh','-c','printf "listener 1883\nallow_anonymous true\npersistence false\n" > /tmp/demo.conf; exec mosquitto -c /tmp/demo.conf')
    wait(lambda:listening(rtsp_port));wait(lambda:listening(mqtt_port))
    with socket.socket() as sock:sock.bind(('127.0.0.1',0));core_port=sock.getsockname()[1]
    url=f'http://127.0.0.1:{core_port}';token=secrets.token_urlsafe(32)
    env=dict(os.environ,ENTITY_SQLITE_PATH=str(work/'core.sqlite3'),ENTITY_CONNECTOR_TOKENS=json.dumps([
        {'token':token,'actor':'integration-lab','permissions':['registry:write','observe:write','agent:read']}]))
    def start_core():
        proc=subprocess.Popen([str(root/'.venv/bin/python'),'-m','uvicorn','app.main:app','--port',str(core_port)],cwd=root/'services/entity-api',env=env,stdout=log,stderr=log);processes.append(proc)
        wait(lambda:httpx.get(url+'/ready',trust_env=False).status_code==200)
        return proc
    core=start_core()
    rtsp=f'rtsp://127.0.0.1:{rtsp_port}/camera'
    video=str(root/'.runtime/edge/vtest.avi')
    ffmpeg=subprocess.Popen(['ffmpeg','-nostdin','-loglevel','error','-re','-stream_loop','-1','-i',video,
        '-an','-c:v','libx264','-preset','ultrafast','-tune','zerolatency','-g','10','-keyint_min','10','-pix_fmt','yuv420p',
        '-f','rtsp','-rtsp_transport','tcp',rtsp],stdout=log,stderr=log);processes.append(ffmpeg)
    time.sleep(1)
    assert ffmpeg.poll() is None
    run=str(uuid4());camera='integration-camera-'+run;sensor_id='temperature-'+run;room='reservations-'+run
    with httpx.Client(base_url=url,headers={'Authorization':'Bearer '+token},trust_env=False,timeout=10) as client:
        for mode in ['simulation','rtsp']:
            command=[sys.executable,'-m','entity_edge.cli','--zones',str(root/'services/entity-edge/zones.json'),
                '--outbox',str(work/(mode+'-outbox.sqlite3')),'--core',url,'--camera',camera,
                '--limit','30','--report',str(work/(mode+'-report.json'))]
            if mode=='rtsp':command+=['--video',rtsp]
            subprocess.run(command,cwd=root,env=dict(os.environ,ENTITY_EDGE_TOKEN=token,OPENCV_FFMPEG_CAPTURE_OPTIONS='rtsp_transport;tcp'),check=True,stdout=log,stderr=log)
            report=json.loads((work/(mode+'-report.json')).read_text());assert report['detections']>0 and report['pending']==0
        camera_events=client.get(f'/v1/entities/{camera}/events').json()
        assert {e['payload']['provenance']['simulated'] for e in camera_events if e['type']=='observation.received'}=={True,False}
        for identity,kind in [(sensor_id,'Sensor'),(room,'Room')]:client.post('/v1/entities',json={'id':identity,'type':kind}).raise_for_status()
        client.put('/v1/integrations/connectors/external-lab',json={'connector_id':'external-lab','version':'1','protocols':['simulation'],
            'input_event_types':['sensor.measurement','business.reservation']}).raise_for_status()
        path=str(work/'mqtt-outbox.sqlite3')
        subscriber=MqttSensor(path,'lab/temperature',sensor_id,'external-lab',client_id='edge-'+run)
        subscriber.start('127.0.0.1',mqtt_port);wait(subscriber.subscribed.is_set)
        publisher=mqtt.Client(mqtt.CallbackAPIVersion.VERSION2);publisher.connect('127.0.0.1',mqtt_port);publisher.loop_start()
        measurement={'id':str(uuid4()),'observed_at':'2026-11-06T12:00:00Z','name':'temperature','value':24.5,'unit':'C'}
        for _ in range(2):publisher.publish('lab/temperature',json.dumps(measurement),qos=1).wait_for_publish(timeout=5)
        wait(lambda:subscriber.received>=2)
        box=Outbox(path);assert box.flush(client,force=True)==2;box.close()
        assert len(client.get(f'/v1/entities/{sensor_id}/events').json())==1
        publisher.disconnect();publisher.loop_stop();publisher=None
        docker('restart',broker)
        wait(subscriber.subscribed.is_set,30)
        publisher=mqtt.Client(mqtt.CallbackAPIVersion.VERSION2);publisher.connect('127.0.0.1',mqtt_port);publisher.loop_start()
        measurement['id']=str(uuid4());measurement['value']=25.0
        publisher.publish('lab/temperature',json.dumps(measurement),qos=1).wait_for_publish(timeout=5)
        wait(lambda:subscriber.received>=3)
        core.terminate();core.wait(timeout=10)
        box=Outbox(path);assert box.flush(client,force=True)==0;box.close()
        core=start_core();box=Outbox(path);assert box.flush(client,force=True)==1;box.close()
        records=[{'id':'fixture-booking','revision':1,'status':'confirmed','starts_at':'2026-11-06T12:00:00Z','ends_at':'2026-11-06T13:00:00Z','updated_at':'2026-11-06T11:00:00Z'}]
        class Reservations(BaseHTTPRequestHandler):
            def do_GET(self):
                data=json.dumps(records).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
            def log_message(self,*args):pass
        server=ThreadingHTTPServer(('127.0.0.1',0),Reservations);servers.append(server)
        threading.Thread(target=server.serve_forever,daemon=True).start()
        box=Outbox(str(work/'rest-outbox.sqlite3'))
        with httpx.Client(base_url=f'http://127.0.0.1:{server.server_port}',trust_env=False) as external:
            for _ in range(2):poll_reservations(external,'/reservations',box,room,'external-lab')
            assert box.flush(client,force=True)==2
            records[0]['revision']=2;records[0]['status']='cancelled'
            poll_reservations(external,'/reservations',box,room,'external-lab');assert box.flush(client,force=True)==1
        box.close()
        sensor_events=client.get(f'/v1/entities/{sensor_id}/events').json();booking_events=client.get(f'/v1/entities/{room}/events').json()
        assert len(sensor_events)==2 and len(booking_events)==2
        assert sensor_events[-1]['payload']['payload']['value']==25.0
        query=client.post('/v1/agent/requests',json={'request_id':str(uuid4()),'entity_id':sensor_id,'question':'Consulta las mediciones registradas'}).json()
        assert query['status']=='ok' and len(query['references']['event_ids'])==2
        report={'ip_video':'rtsp-real-local-protocol','video_samples':json.loads((work/'rtsp-report.json').read_text())['detections'],
            'same_camera_contract':'passed','mqtt_qos1_dedup':'passed','broker_restart':'passed','core_restart_outbox':'passed',
            'measurement_events':2,'rest_reservation_events':2,'reservation_revision':'passed','agent_evidence':'passed',
            'physical_devices_tested':False,'sensor_and_business_data':'simulated-fixtures'}
        (work/'report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
finally:
    if publisher:publisher.disconnect();publisher.loop_stop()
    if subscriber:subscriber.close()
    for server in servers:server.shutdown();server.server_close()
    for proc in reversed(processes):
        if proc.poll() is None:
            proc.terminate()
            try:proc.wait(timeout=10)
            except subprocess.TimeoutExpired:proc.kill();proc.wait()
    for cid in reversed(containers):subprocess.run(['docker','rm','-f',cid],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    log.close()
