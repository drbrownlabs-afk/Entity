"""Bounded real HTTP profile, same Core/DB; instrumentation lives in owned process.

Creates a separate diagnostic run with24 genuine model frame messages. No GT,
database copies, production source edits or raw credential logging.
"""
import contextlib
import contextvars
import hashlib
import json
import os
import statistics
import subprocess
import sys
import time
import uuid
from datetime import datetime,timedelta
from pathlib import Path
import httpx

ROOT=Path(__file__).resolve().parents[3];PRIVATE=ROOT/'simulation/spatial-office/.runtime'
TRACE=PRIVATE/'core19-http-stage-trace.json';API='http://127.0.0.1:8096'


def serve():
    sys.path.insert(0,str(ROOT/'services/entity-api'))
    from app import main
    from app.office.auth import principal
    from fastapi import Depends,HTTPException
    import app.office.observations as observations
    import uvicorn
    tag=contextvars.ContextVar('probe',default=None);events=[];original_database=main.database
    def event(stage,ms,**extra):
        if tag.get():events.append({'request':tag.get(),'stage':stage,'ms':ms,**extra})
    @contextlib.contextmanager
    def database(*,write=False):
        before=time.perf_counter()
        with original_database(write=write) as db:
            entered=time.perf_counter();event('db_open_begin',(entered-before)*1000,write=write)
            try:yield db
            finally:ending=time.perf_counter();event('db_body',(ending-entered)*1000,write=write)
        event('db_commit_close',(time.perf_counter()-ending)*1000,write=write)
    main.database=database
    for name in ['world','emit']:
        original=getattr(observations,name)
        def measured(*a,_original=original,_name=name,**kw):
            before=time.perf_counter()
            try:return _original(*a,**kw)
            finally:event(_name,(time.perf_counter()-before)*1000)
        setattr(observations,name,measured)
    @main.app.middleware('http')
    async def measure_request(request,call_next):
        token=tag.set(request.headers.get('x-diagnostic-sample'));before=time.perf_counter()
        try:return await call_next(request)
        finally:event('server_request',(time.perf_counter()-before)*1000);tag.reset(token)
    @main.app.get('/_diagnostic/stages')
    def stages(actor=Depends(principal)):
        if actor['role']!='admin':raise HTTPException(403,'Diagnostic operator required')
        return events
    try:uvicorn.run(main.app,host='127.0.0.1',port=8096,log_level='warning')
    finally:TRACE.write_text(json.dumps(events)+'\n')


def profile():
    import socket
    with socket.socket() as probe:
        if probe.connect_ex(('127.0.0.1',8096))==0:raise RuntimeError('Diagnostic port already owned')
    run='p2-09-diag19-'+uuid.uuid4().hex[:8];site='coworking-p2';root='/v1/sites/'+site;prefix=root+'/runs/'+run
    data=json.loads((PRIVATE/'cctv-trial-accept18-v0/output/accept18/tracks-tuned.json').read_text());frames=data['frames'][:24]
    creds=json.loads((PRIVATE/'coworking-p2-access.json').read_text());user=site+':admin'
    process=None;http=[]
    def digest(x):return hashlib.sha256(json.dumps(x,sort_keys=True).encode()).hexdigest()
    with (PRIVATE/'core19-http-server.log').open('w') as log:
        try:
            process=subprocess.Popen([sys.executable,str(Path(__file__).resolve()),'--serve'],cwd=ROOT,
                env=os.environ|{'ENTITY_SQLITE_PATH':str(PRIVATE/'p2-core.sqlite3')},stdout=log,stderr=log)
            for _ in range(150):
                try:
                    if httpx.get(API+'/health',timeout=1).status_code==200:break
                except httpx.HTTPError:pass
                if process.poll() is not None:raise RuntimeError('Diagnostic Core failed to start')
                time.sleep(.1)
            with httpx.Client(base_url=API,timeout=120) as c:
                def request(method,path,body=None,**kw):
                    r=c.request(method,path,json=body,**kw);r.raise_for_status();return r.json()
                auth=request('POST','/v1/office/auth/login',{'username':user,'password':creds[user]['password']});c.headers['Authorization']='Bearer '+auth['token']
                previous={r['id']:digest(request('GET',root+'/runs/'+r['id']+'/world')) for r in request('GET',root+'/runs')}
                first=datetime.fromisoformat(frames[0]['observed_at'].replace('Z','+00:00'))
                request('POST',root+'/runs',{'id':run,'clock':first.isoformat(),'seed':19})
                request('POST',prefix+'/commands',{'id':str(uuid.uuid4()),'operation':'clock.advance','target':'site','inputs':{'to':(first+timedelta(seconds=3)).isoformat()}})
                for index,frame in enumerate(frames):
                    w,h=frame['image_size'];tracks=[]
                    for t in frame['tracks']:
                        b=[v/(w if j%2==0 else h) for j,v in enumerate(t['bbox'])]
                        tracks.append({'local_track_id':run+':'+t['local_track_id'],'position':[(b[0]+b[2])/2,(b[1]+b[3])/2 if t['position_anchor']=='bbox-center' else b[3]],'image_bbox':b,
                                       'detection_confidence':t['confidence'],'association_confirmed_at':t['association_confirmation_evidence_at']})
                    message={'observation_id':str(uuid.uuid4()),'site_id':site,'source_id':frame['camera_id'],'observed_at':frame['observed_at'],
                        'type':'edge.presence','payload':{'tracks':tracks,'source_status':'connected','frame_sha256':frame['frame_sha256'],
                            'frame_index':frame['frame_index'],'media_time_seconds':frame['media_time_seconds']},
                        'provenance':{'connector_id':'video-test','model_version':'diagnostic reuse of verified YOLOX-S/Norfair output','simulated':True}}
                    before=time.perf_counter();answer=request('POST',prefix+'/observations',message,headers={'x-diagnostic-sample':str(index)})
                    http.append((time.perf_counter()-before)*1000);assert not answer['duplicate']
                for old,checksum in previous.items():assert digest(request('GET',root+'/runs/'+old+'/world'))==checksum
                TRACE.write_text(json.dumps(request('GET','/_diagnostic/stages'))+'\n')
                request('POST','/v1/office/auth/logout')
        finally:
            if process is not None and process.poll() is None:process.terminate();process.wait(timeout=15)
    events=json.loads(TRACE.read_text());groups={}
    for event in events:
        key=event['stage']+(' write' if event.get('write') else ' read') if event['stage'].startswith('db_') else event['stage']
        groups.setdefault(key,[]).append(event['ms'])
    assert len(groups['world'])==len(groups['emit'])==len(http)==24
    def stats(v):return {'n':len(v),'p50_ms':statistics.median(v),'p95_ms':sorted(v)[int(.95*(len(v)-1))]}
    result={'phase':'P2-09.19','actual_http_same_core_database':True,'diagnostic_run':run,'fresh_frame_messages':len(http),
            'http':stats(http),'stages':{k:stats(v) for k,v in groups.items()},'historical_worlds_unchanged':True,
            'production_source_changed':False,'instrumentation':'owned temporary process wrappers; trace buffered in RAM until shutdown',
            'limitations':['24serial requests/early3instants, not sustained16images/s','Nested timings overlap; do not sum world/emit with db_body',
                           'db_commit_close includes context exit/commit/close, not fsync-only','Instrumentation/readiness overhead excluded from sample; other host activity uncontrolled']}
    out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.19';out.mkdir(parents=True,exist_ok=True)
    (out/'core-http-stage-probe.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))


if __name__=='__main__':
    if '--serve' in sys.argv:serve()
    else:profile()
