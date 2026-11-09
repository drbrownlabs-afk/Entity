"""Technical read-only HTTP/process restart verification for the narrowed structural stage."""
import subprocess,sys,time,json,os
from pathlib import Path
import httpx
ROOT=Path(__file__).resolve().parents[2];runtime=ROOT/'simulation/spatial-office/.runtime';credentials=json.loads((runtime/'coworking-p2-access.json').read_text());api='http://127.0.0.1:8095';process=None;log=open(runtime/'structural-restart.log','w')
def start():
 p=subprocess.Popen([sys.executable,'-m','uvicorn','app.main:app','--app-dir',str(ROOT/'services/entity-api'),'--host','127.0.0.1','--port','8095'],env={**os.environ,'ENTITY_SQLITE_PATH':str(runtime/'p2-core.sqlite3')},stdout=log,stderr=log)
 for _ in range(100):
  try:
   if httpx.get(api+'/health',timeout=1).status_code==200:return p
  except httpx.HTTPError:pass
  if p.poll()is not None:raise RuntimeError('P1 startup failed')
  time.sleep(.1)
 p.terminate();raise RuntimeError('Startup timeout')
def read():
 with httpx.Client(base_url=api,timeout=10)as c:
  r=c.post('/v1/office/auth/login',json={'username':'coworking-p2:admin','password':credentials['coworking-p2:admin']['password']});r.raise_for_status();c.headers['Authorization']='Bearer '+r.json()['token'];r=c.get('/v1/sites/coworking-p2/runs/onboarding/world');r.raise_for_status();w=r.json();c.post('/v1/office/auth/logout');return w
try:
 process=start();before=read();process.terminate();process.wait(timeout=10);process=start();after=read();assert before==after
 report={'passed':True,'scope':'structural technical inspection only','real_http':True,'full_p1_process_restart':True,'stable_ids_types_relations_spatial_mappings':True,'world_entities_including_preserved_prior_test_records':len(after['entities']),'configured_structural_entities':35,'operational_commands_run':0,'functional_queries_run':0}
 (ROOT/'docs/spatial-simulation/evidence/phase08/structural/persistence.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
finally:
 if process and process.poll()is None:process.terminate();process.wait(timeout=10)
 log.close()
