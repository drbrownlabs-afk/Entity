"""Real process / HTTP / browser / restart / backup test of persistent reception."""
import json,os,socket,subprocess,sys,time,tempfile,sqlite3,shutil
from pathlib import Path
from uuid import uuid4
import httpx
ROOT=Path(__file__).resolve().parents[2]
def port():
    with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
report={'transport':'actual HTTP; separate uvicorn process, production Vite preview','checks':[]}
with tempfile.TemporaryDirectory(prefix='entity-office-') as temp:
    database=Path(temp)/'core.sqlite3'
    subprocess.run([sys.executable,'scripts/bootstrap-office.py','--database',str(database)],cwd=ROOT,check=True,capture_output=True)
    credentials=json.loads((Path(temp)/'access.json').read_text());api_port=port();web_port=port()
    api='http://127.0.0.1:'+str(api_port);web='http://127.0.0.1:'+str(web_port)
    env={**os.environ,'ENTITY_SQLITE_PATH':str(database),'ENTITY_ALLOWED_ORIGINS':web,'ENTITY_REQUIRE_AUTH':'1'}
    log=open(ROOT/'.runtime/phase09/http-demo.log','w')
    def server():
        process=subprocess.Popen([sys.executable,'-m','uvicorn','app.main:app','--app-dir','services/entity-api','--host','127.0.0.1','--port',str(api_port)],cwd=ROOT,env=env,stdout=log,stderr=log)
        for _ in range(100):
            try:
                if httpx.get(api+'/health').status_code==200:return process
            except httpx.HTTPError:pass
            time.sleep(.1)
        raise RuntimeError('API did not start')
    process=server()
    preview=subprocess.Popen(['npm','--prefix','apps/web','run','preview','--','--port',str(web_port)],cwd=ROOT,stdout=log,stderr=log)
    try:
        with httpx.Client(base_url=api,timeout=20) as client:
            answer=client.post('/v1/office/auth/login',json={'username':'admin','password':credentials['admin']['password']});answer.raise_for_status()
            headers={'Authorization':'Bearer '+answer.json()['token']};base='/v1/sites/synthetic-office/runs/day-01'
            def cmd(operation,target='site',**inputs):
                r=client.post(base+'/commands',headers=headers,json={'id':str(uuid4()),'operation':operation,'target':target,'inputs':inputs});r.raise_for_status();return r.json()
            cmd('entity.upsert',id='PERSON-DANIEL',kind='Person',attributes={'name':'Daniel','profile_level':'visitor','fictitious':True})
            cmd('booking.create','MEETING-AREA-01',booking_id='B-1600',person_id='PERSON-CARLOS',starts_at='2026-11-07T16:00:00-05:00',ends_at='2026-11-07T17:00:00-05:00',party_size=3,meeting_id='M-1600',expected_guests=[{'id':'I-DANIEL-'+str(w),'name':'Daniel'} for w in [1280,390]])
            cmd('clock.advance',to='2026-11-07T15:50:00-05:00')
            code=str(uuid4())
            for width in [1280,390]:
                r=client.post(base+'/invitation-credentials',headers=headers,json={'invitation_id':'I-DANIEL-'+str(width),'person_id':'PERSON-DANIEL','code':code,'expires_at':'2026-11-07T17:00:00-05:00'});r.raise_for_status()
            r=client.post(base+'/observations',headers=headers,json={'observation_id':str(uuid4()),'site_id':'synthetic-office','source_id':'CAM-01','observed_at':'2026-11-07T15:50:00-05:00','type':'edge.presence','payload':{'source_status':'connected','tracks':[{'local_track_id':'host','zone_id':'annotation-0','position':[.4,.5]}],'transitions':[]},'provenance':{'connector_id':'simulated','model_version':'browser-test','simulated':True}});r.raise_for_status()
            state=client.get(base+'/world',headers=headers).json();track=state['entities']['CAM-01']['tracks'][0]
            cmd('identity.associate',track,person_id='PERSON-CARLOS',credential_verified=True,evidence_type='badge-checkin')
            browser_env={**os.environ,'OFFICE_API':api,'OFFICE_WEB':web,'OFFICE_CREDENTIALS':str(Path(temp)/'access.json'),'OFFICE_TEST_CODE':code}
            subprocess.run(['node','scripts/phase09/verify-reception.mjs'],cwd=ROOT,env=browser_env,check=True)
            before=client.get(base+'/world',headers=headers).json();before_events=client.get(base+'/events',headers=headers,params={'limit':1000}).json()
            process.terminate();process.wait(10);process=server()
            after=client.get(base+'/world',headers=headers).json()
            assert before==after,'World changed across actual process restart'
            assert before_events==client.get(base+'/events',headers=headers,params={'limit':1000}).json(),'Events changed across restart'
            report['checks'].append({'actual_process_restart':'passed','events_preserved':len(before_events),'entity_count':len(after['entities'])})
            with sqlite3.connect(database) as db,sqlite3.connect(Path(temp)/'backup.sqlite3') as backup:db.backup(backup)
            with sqlite3.connect(Path(temp)/'backup.sqlite3') as db:assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
            report['checks'].append({'sqlite_online_backup_integrity':'passed'})
        report['status']='passed'
    except Exception as error:report['status']='failed';report['error']=str(error);raise
    finally:
        process.terminate();process.wait(10);preview.terminate();preview.wait(10);log.close()
        (ROOT/'docs/evidence/phase09/reception-http-process.json').write_text(json.dumps(report,indent=2)+'\n')
