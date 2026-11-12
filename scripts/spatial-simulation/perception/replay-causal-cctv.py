"""Paced source -> isolated incremental pixel worker -> existing Core.

Only this test producer can open the corpus. The worker has stdin pixels, static
calibration/graph/models and no network, corpus, workspace or evaluator mount.
Queues are bounded; every scheduled/drop/result and capture-to-commit age counts.
"""
import argparse
import hashlib
import json
import os
import queue
import struct
import subprocess
import sys
import threading
import time
import traceback
import uuid
from datetime import datetime,timedelta
from pathlib import Path
import httpx

ROOT=Path(__file__).resolve().parents[3]
PRIVATE=ROOT/'simulation/spatial-office/.runtime'
PROFILE=ROOT/'apps/spatial-simulation/public/perception/profiles/cctv-c.json'
GRAPH=ROOT/'simulation/spatial-office/perception/cctv-c-spatial-graph.json'


def digest(x):return hashlib.sha256(json.dumps(x,sort_keys=True).encode()).hexdigest()
def stats(values):
    v=sorted(values)
    return {'n':len(v),'p50':v[int(.5*(len(v)-1))],'p95':v[int(.95*(len(v)-1))],'max':v[-1]} if v else {'n':0}


def worker_command(run):
    args=['bwrap','--unshare-net','--unshare-pid','--die-with-parent']
    for path in ['/usr','/lib','/lib64','/etc']:args+=['--ro-bind',path,path]
    args+=['--proc','/proc','--dev','/dev','--tmpfs','/tmp','--dev-bind','/dev/dxg','/dev/dxg',
        '--ro-bind','/opt/entity-p2/gpu-venv','/venv','--ro-bind',str(ROOT/'services/entity-edge'),'/app',
        '--ro-bind',str(PRIVATE/'p2-vision-models'),'/models','--ro-bind',str(PROFILE),'/calibration.json',
        '--ro-bind',str(GRAPH),'/graph.json','--setenv','PYTHONPATH','/app','--setenv','PYTHONDONTWRITEBYTECODE','1',
        '--','/venv/bin/python','-m','entity_edge.causal_pixels','--run',run,'--models','/models',
        '--calibration','/calibration.json','--graph','/graph.json']
    return args


def execute(args):
    run=args.run;out=PRIVATE/('causal19-'+run)
    out.mkdir(exist_ok=False);status=out/'status.json'
    status.write_text(json.dumps({'state':'running','pid':os.getpid(),'run':run}))
    source=Path('/opt/entity-p2/corpora')/args.corpus/'frames'
    manifest=json.loads((source/'manifest.json').read_text());frames=sorted(manifest['frames'],key=lambda f:(f['media_time_seconds'],f['camera_id']))
    frames=[f for f in frames if f['media_time_seconds']<args.seconds]
    if not frames:raise ValueError('No scheduled frames')
    profile_sha=hashlib.sha256(PROFILE.read_bytes()).hexdigest();graph_sha=hashlib.sha256(GRAPH.read_bytes()).hexdigest()
    inputs=queue.Queue(maxsize=16);outputs=queue.Queue(maxsize=16);errors=[];counts={'scheduled':0,'dropped_input_full':0,'sent':0,'processed':0,'persisted':0}
    drops=[];stages={};latencies=[];messages=[];http_ms=[];bundle_sizes=[];source_lateness=[];server=None;worker=None;session=uuid.uuid4().hex
    site='coworking-p2';base='/v1/sites/'+site;prefix=base+'/runs/'+run;api='http://127.0.0.1:8097'
    client=httpx.Client(base_url=api,timeout=120);prior={};ready={};raw=out/'frames.jsonl'
    def request(method,path,body=None):
        response=client.request(method,path,json=body)
        if response.is_error:raise RuntimeError(f'Core {method} {path} status {response.status_code}: '+response.text[:250])
        return response.json()
    def safe(fn):
        def wrapped():
            try:fn()
            except BaseException:errors.append(traceback.format_exc());outputs.put({'type':'thread_error'})
        return wrapped
    try:
        if args.core:
            import socket
            with socket.socket() as check:
                if check.connect_ex(('127.0.0.1',8097))==0:raise RuntimeError('Port already owned')
            server_log=(out/'core.log').open('w')
            server=subprocess.Popen(['/opt/entity-p2/api-venv/bin/python','-m','uvicorn','app.main:app','--host','127.0.0.1','--port','8097','--log-level','warning'],
                cwd=ROOT/'services/entity-api',env=os.environ|{'ENTITY_SQLITE_PATH':str(PRIVATE/'p2-core.sqlite3')},stdout=server_log,stderr=server_log)
            for _ in range(200):
                try:
                    if client.get('/health').status_code==200:break
                except httpx.HTTPError:pass
                if server.poll() is not None:raise RuntimeError('Core startup failed')
                time.sleep(.1)
            credentials=json.loads((PRIVATE/'coworking-p2-access.json').read_text());username=site+':admin'
            client.headers['Authorization']='Bearer '+request('POST','/v1/office/auth/login',{'username':username,'password':credentials[username]['password']})['token']
            prior={r['id']:digest(request('GET',base+'/runs/'+r['id']+'/world')) for r in request('GET',base+'/runs')}
            request('POST',base+'/runs',{'id':run,'clock':frames[0]['observed_at'],'seed':19})
            for camera in json.loads(PROFILE.read_text())['cameras']:
                request('POST',prefix+'/commands',{'id':str(uuid.uuid4()),'operation':'entity.upsert','target':'site','inputs':{'id':camera['id'],'kind':'Camera','attributes':{
                    'camera_profile':camera,'covered_zones':[],'calibration_sha256':profile_sha,'physical_installation_verified':False,'live_stream_implemented':False}}})
                request('PUT',base+'/bindings',{'source':camera['id'],'adapter':'video-test','version':'1.0','config':{'available':True,'simulation_only':True}})
        worker_log=(out/'worker.log').open('w')
        worker=subprocess.Popen(worker_command(run),stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=worker_log,bufsize=0)
        # A real newline reader is needed with unbuffered binary pipe (readline
        # on stdout is allowed; transport input uses explicit byte lengths).
        ready=json.loads(worker.stdout.readline())
        if ready.get('type')!='ready':raise RuntimeError('Worker did not initialize')
        (out/'ready.json').write_text(json.dumps(ready,indent=2)+'\n')
        origin=time.monotonic();logical_origin=datetime.fromisoformat(frames[0]['observed_at'].replace('Z','+00:00'))
        def producer():
            for frame in frames:
                due=origin+frame['media_time_seconds'];time.sleep(max(0,due-time.monotonic()));counts['scheduled']+=1
                source_lateness.append((time.monotonic()-due)*1000)
                data=(source/frame['file']).read_bytes()
                # PNG IHDR width/height are legitimate image metadata. No decode
                # or simulator fields are needed by this producer.
                width,height=struct.unpack('!II',data[16:24])
                header={k:frame[k] for k in ['camera_id','frame_index','observed_at','media_time_seconds']}
                header.update(frame_sha256=frame['sha256'],image_size=[width,height],stream_session_id=session,
                    byte_length=len(data),encoding='png',clock_origin_utc=logical_origin.isoformat(),clock_origin_monotonic=origin,capture_monotonic=due)
                try:
                    if args.lossless:inputs.put((header,data))
                    else:inputs.put_nowait((header,data))
                except queue.Full:
                    counts['dropped_input_full']+=1;drops.append({k:frame[k] for k in ['camera_id','frame_index','media_time_seconds']})
            inputs.put(None)
        def sender():
            while True:
                item=inputs.get()
                if item is None:break
                header,data=item;encoded=json.dumps(header,separators=(',',':')).encode()
                # FileIO.write may be short on pipes; loop until exact framing.
                for part in [struct.pack('!I',len(encoded)),encoded,data]:
                    view=memoryview(part)
                    while view:
                        length=worker.stdin.write(view)
                        if not length:raise BrokenPipeError('Worker stopped consuming')
                        view=view[length:]
                counts['sent']+=1
            worker.stdin.close()
        def reader():
            for line in worker.stdout:
                result=json.loads(line);outputs.put(result)
            outputs.put(None)
        threads=[threading.Thread(target=safe(fn),daemon=True) for fn in [producer,sender,reader]]
        for thread in threads:thread.start()
        eof=False
        with raw.open('w') as archive:
            while not eof:
                batch=[];first=outputs.get(timeout=120)
                if first is None:break
                batch.append(first);deadline=time.monotonic()+.075
                while len(batch)<8:
                    try:item=outputs.get(timeout=max(0,deadline-time.monotonic()))
                    except queue.Empty:break
                    if item is None:eof=True;break
                    batch.append(item)
                if errors:raise RuntimeError(errors[0])
                observations=[]
                for result in batch:
                    archive.write(json.dumps(result)+'\n');archive.flush();counts['processed']+=1
                    for key,value in result['timings_ms'].items():stages.setdefault(key,[]).append(value)
                    frame=result['frame'];w,h=frame['image_size'];tracks=[]
                    for track in frame['tracks']:
                        box=[v/(w if j%2==0 else h) for j,v in enumerate(track['bbox'])]
                        tracks.append({'local_track_id':track['local_track_id'],'track_status':track['track_status'],'position':track['position'],
                            'image_bbox':box,'detection_confidence':track['confidence'],
                            **({'association_confirmed_at':track['association_confirmation_evidence_at']} if track.get('association_confirmation_evidence_at') else {})})
                    provenance={'connector_id':'video-test','model_version':'YOLOX-S/Norfair/OSNet causal incremental; same weights','simulated':True}
                    observations.append({'observation_id':result['observation_id'],'site_id':site,'source_id':frame['camera_id'],
                        'observed_at':frame['observed_at'],'type':'edge.causal_presence','provenance':provenance,
                        'payload':{'tracks':tracks,'source_status':'connected','frame_sha256':frame['frame_sha256'],'frame_index':frame['frame_index'],
                            'media_time_seconds':frame['media_time_seconds'],'known_at':frame['known_at'],'stream_session_id':session,
                            'calibration_sha256':profile_sha,'clock_domain':'paced-replay-utc','execution_mode':'causal-incremental'}})
                    for revision in result['revisions']:
                        payload={k:v for k,v in revision.items() if k not in {'known_at','position_status','civil_identity_verified'}}
                        payload.update(method='osnet-ain-static-graph-constrained-incremental',model_sha256=ready['models']['reid'],
                            graph_sha256=graph_sha,calibration_sha256=profile_sha,clock_domain='paced-replay-utc')
                        observations.append({'observation_id':str(uuid.uuid5(uuid.NAMESPACE_URL,run+digest(revision))),
                            'site_id':site,'source_id':revision['members'][0]['source_id'],'observed_at':revision['known_at'],
                            'type':'edge.causal_association','provenance':provenance,'payload':payload})
                if args.core:
                    for offset in range(0,len(observations),32):
                        chunk=observations[offset:offset+32];before_http=time.monotonic()
                        request('POST',prefix+'/observations/causal-bundle',{'observations':chunk})
                        http_ms.append((time.monotonic()-before_http)*1000);bundle_sizes.append(len(chunk))
                    committed=time.monotonic();messages.extend(observations);counts['persisted']+=len(batch)
                    for result in batch:latencies.append((committed-result['capture_monotonic'])*1000)
                else:
                    for result in batch:latencies.append((result['worker_finished_monotonic']-result['capture_monotonic'])*1000)
        for thread in threads:thread.join(timeout=15)
        if any(thread.is_alive() for thread in threads):raise RuntimeError('Producer threads did not terminate')
        code=worker.wait(timeout=15)
        if code or errors:raise RuntimeError('Worker failed: '+str(code)+' '+str(errors))
        elapsed=time.monotonic()-origin
        if args.core:
            before=request('GET',prefix+'/world');duplicate_count=0
            for offset in range(0,len(messages),32):duplicate_count+=request('POST',prefix+'/observations/causal-bundle',{'observations':messages[offset:offset+32]})['observations']
            if digest(before)!=digest(request('GET',prefix+'/world')):raise RuntimeError('Replay changed world')
            for old,checksum in prior.items():
                if digest(request('GET',base+'/runs/'+old+'/world'))!=checksum:raise RuntimeError('Historical world changed')
            (out/'world.json').write_text(json.dumps(before)+'\n')
            (out/'observations.json').write_text(json.dumps(messages)+'\n')
        report={'phase':'P2-09.19','mode':'causal replay with producer backpressure for lossless quality regression' if args.lossless else 'paced causal replay, not virtual live capture','run':run,'corpus':args.corpus,
            'source_seconds':args.seconds,'elapsed_seconds':elapsed,'counts':counts,'processed_fps':counts['processed']/elapsed,
            'latency_ms':stats(latencies),'latency_scope':'scheduled source release to actual Core HTTP commit ACK' if args.core else 'scheduled source release to pixel worker completion',
            'stages_ms':{k:stats(v) for k,v in stages.items()},'queue_capacity_frames':{'input':16,'output':16},'drops':drops,
            'core_bundle_http_ms':stats(http_ms),'bundle_message_counts':stats(bundle_sizes),
            'source_release_lateness_ms':stats(source_lateness),'lossless_backpressure_enabled':args.lossless,
            'core_enabled':args.core,'same_core_database':args.core,'prior_worlds_unchanged':True if args.core else None,
            'exact_replay_no_effects':True if args.core else None,'cold_start_seconds':ready['cold_start_seconds'],
            'future_frames_mounted_in_worker':False,'ground_truth_mounted_in_worker':False,
            'sustained_gate_passed':False,'limitations':['Short development probe unless independently accepted against full ten-minute gate',
                'Source is prerecorded PNG; this does not benchmark virtual capture','Drops remain in scheduled denominator; not a quality evaluation']}
        (out/'report.json').write_text(json.dumps(report,indent=2)+'\n');status.write_text(json.dumps({'state':'done','run':run}));print(json.dumps(report))
    except BaseException:
        status.write_text(json.dumps({'state':'failed','traceback':traceback.format_exc()}));raise
    finally:
        if worker is not None and worker.poll() is None:worker.terminate();worker.wait(timeout=15)
        if server is not None and server.poll() is None:server.terminate();server.wait(timeout=15)
        client.close()


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--corpus',default='accept18-v0');parser.add_argument('--seconds',type=float,default=8)
    parser.add_argument('--run',required=True);parser.add_argument('--core',action='store_true');parser.add_argument('--lossless',action='store_true');args=parser.parse_args()
    if not args.run.replace('-','').isalnum() or not args.corpus.replace('-','').isalnum() or args.seconds<=0:parser.error('Invalid experiment')
    execute(args)
