"""Run real HTTP/Core plus original remote SSOG and actual human/camera SDK integration."""
import json,os,socket,subprocess,sys,time,tempfile,signal
from pathlib import Path
from uuid import uuid4
import httpx
root=Path(__file__).resolve().parents[2];(root/'.runtime/phase09').mkdir(parents=True,exist_ok=True)
def port():
    with socket.socket() as sock:sock.bind(('127.0.0.1',0));return sock.getsockname()[1]
with tempfile.TemporaryDirectory(prefix='entity-spatial-') as folder:
    database=Path(folder)/'core.sqlite3'
    subprocess.run([sys.executable,'scripts/bootstrap-office.py','--database',str(database)],cwd=root,check=True,capture_output=True)
    api='http://127.0.0.1:'+str(port());web='http://127.0.0.1:'+str(port());log=open(root/'.runtime/phase09/spatial-http.log','w')
    env={**os.environ,'ENTITY_SQLITE_PATH':str(database),'ENTITY_ALLOWED_ORIGINS':web,'ENTITY_REQUIRE_AUTH':'1'}
    server=subprocess.Popen([sys.executable,'-m','uvicorn','app.main:app','--app-dir','services/entity-api','--host','127.0.0.1','--port',api.rsplit(':',1)[1]],cwd=root,env=env,stdout=log,stderr=log)
    preview=subprocess.Popen(['npm','--prefix','apps/web','run','preview','--','--port',web.rsplit(':',1)[1]],cwd=root,stdout=log,stderr=log,start_new_session=True)
    try:
        for url in [api+'/health',web+'/office.html']:
            for _ in range(100):
                try:
                    if httpx.get(url).status_code==200:break
                except httpx.HTTPError:pass
                time.sleep(.1)
            else:raise RuntimeError('Service did not start')
        credentials=json.loads((Path(folder)/'access.json').read_text())
        with httpx.Client(base_url=api,timeout=20) as client:
            token=client.post('/v1/office/auth/login',json={'username':'admin','password':credentials['admin']['password']}).json()['token'];headers={'Authorization':'Bearer '+token}
            prefix='/v1/sites/synthetic-office/runs/day-01'
            def cmd(op,target='site',**inputs):
                response=client.post(prefix+'/commands',headers=headers,json={'id':str(uuid4()),'operation':op,'target':target,'inputs':inputs});response.raise_for_status()
            cmd('entity.upsert',id='CIRCULATION-01',kind='Zone',attributes={'name':'Pasillo recorrido y medido','reservable':False,'position':None})
            route=json.loads((root/'worlds/synthetic-office/corridor-route.json').read_text())
            trace=json.loads((root/'docs/evidence/phase09/survey/survey-authored.json').read_text())['walk']['steps']
            for index,step in enumerate([trace[0],trace[2]],1):
                position=step['camera']['position'];target=trace[2]['camera']['position'] if index==1 else trace[0]['camera']['position']
                key='CAM-ROUTE-'+str(index)
                cmd('entity.upsert',id=key,kind='Camera',attributes={'name':key,'virtual':True,'position':position,'target':target,'fov':85,'covered_zones':['CIRCULATION-01'],'connectivity':'connected','capture_simulated_people':True,'calibration_evidence':route['calibration_evidence']})
                response=client.put('/v1/sites/synthetic-office/bindings',headers=headers,json={'source':key,'adapter':'simulated','config':{}});response.raise_for_status()
            cmd('clock.advance',to='2026-11-07T09:15:00-05:00')
            motion={'person_id':'PERSON-LUIS','avatar_id':'Male_Adult_01','zone_id':'CIRCULATION-01','coordinate_frame':route['coordinate_frame'],'calibration_evidence':route['calibration_evidence'],
                'waypoints':[{'at':'2026-11-07T09:15:'+str(i*5).zfill(2)+'-05:00',**p} for i,p in enumerate(route['floor_points'])]}
            response=client.post(prefix+'/spatial-routes',headers=headers,json={'id':route['id'],'motions':[motion]});response.raise_for_status()
        subprocess.run(['node','scripts/phase09/verify-spatial-core.mjs'],cwd=root,env={**os.environ,'OFFICE_API':api,'OFFICE_WEB':web,'OFFICE_CREDENTIALS':str(Path(folder)/'access.json')},check=True)
    finally:
        server.terminate();server.wait(10)
        try:os.killpg(preview.pid,signal.SIGTERM)
        except ProcessLookupError:pass
        preview.wait(10);log.close()
