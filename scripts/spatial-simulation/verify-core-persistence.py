"""Actual HTTP/process restart on the existing P1 database; reads only, never renders."""
import subprocess,sys,time,json,os
from pathlib import Path
import httpx
ROOT=Path(__file__).resolve().parents[2];runtime=ROOT/'simulation/spatial-office/.runtime';creds=json.loads((runtime/'coworking-p2-access.json').read_text());log=open(runtime/'persistence-http.log','w');process=None
api='http://127.0.0.1:8094';prefix='/v1/sites/coworking-p2/runs/onboarding'
def start():
 env={**os.environ,'ENTITY_SQLITE_PATH':str(runtime/'p2-core.sqlite3')};p=subprocess.Popen([sys.executable,'-m','uvicorn','app.main:app','--app-dir',str(ROOT/'services/entity-api'),'--host','127.0.0.1','--port','8094'],cwd=ROOT,env=env,stdout=log,stderr=log)
 for _ in range(100):
  try:
   if httpx.get(api+'/health',timeout=1).status_code==200:return p
  except httpx.HTTPError:pass
  if p.poll()is not None:raise RuntimeError('P1 failed to start')
  time.sleep(.1)
 p.terminate();raise RuntimeError('P1 start timeout')
def read():
 with httpx.Client(base_url=api,timeout=10)as c:
  r=c.post('/v1/office/auth/login',json={'username':'coworking-p2:admin','password':creds['coworking-p2:admin']['password']});r.raise_for_status();c.headers['Authorization']='Bearer '+r.json()['token'];r=c.get(prefix+'/world');r.raise_for_status();w=r.json();r=c.post(prefix+'/queries',json={'kind':'memories','entity_id':'D1'});r.raise_for_status();return {'world':w,'D1_memories':r.json()['result']}
try:
 process=start();before=read();process.terminate();process.wait(timeout=10);process=start();after=read();assert before==after,'World/memories changed across full P1 process restart'
 report={'passed':True,'real_http':True,'full_uvicorn_restart':True,'entities':len(after['world']['entities']),'revision':after['world']['revision'],'D1_memory_count':len(after['D1_memories']),'same_entities_states_relations_and_memories':True,'database':'ignored local P1 SQLite; no live operational database claimed'}
 (ROOT/'docs/spatial-simulation/evidence/phase08/persistence.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
finally:
 if process is not None and process.poll()is None:process.terminate();process.wait(timeout=10)
 log.close()
