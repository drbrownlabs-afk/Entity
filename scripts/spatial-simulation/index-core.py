"""Register provenance memories via existing authenticated P1 commands/Núcleo. Reentrant."""
import argparse,json,uuid
from pathlib import Path
import httpx
p=argparse.ArgumentParser();p.add_argument('--api',required=True);p.add_argument('--credentials',required=True);p.add_argument('--site',default='coworking-p2');a=p.parse_args()
creds=json.loads(Path(a.credentials).read_text());username=a.site+':admin';password=creds[username]['password']
with httpx.Client(base_url=a.api,timeout=20)as c:
 r=c.post('/v1/office/auth/login',json={'username':username,'password':password});r.raise_for_status();token=r.json()['token'];c.headers['Authorization']='Bearer '+token
 r=c.get('/v1/sites/'+a.site+'/active-run');r.raise_for_status();run=r.json()['id'];prefix=f'/v1/sites/{a.site}/runs/{run}'
 r=c.get(prefix+'/world');r.raise_for_status();entities=r.json()['entities'];count=0
 for key,e in entities.items():
  if key=='site':continue
  content=json.dumps({'registration':'P2 scene-to-Core index','entity':key,'spatial_reference':{k:v for k,v in (e.get('spatial')or{}).items()if k in ['position','coordinate_frame','master_sha256','scene_sha256']},'identity_status':e.get('identity_status'),'operational_evidence':'none; unknown state, no occupancy or real identity asserted'},sort_keys=True)
  cid=str(uuid.uuid5(uuid.NAMESPACE_URL,a.site+run+key+content));r=c.post(prefix+'/commands',json={'id':cid,'operation':'entity.remember','target':key,'inputs':{'content':content,'source':'P2:index-registration'}});r.raise_for_status();count+=1
 c.post('/v1/office/auth/logout');print('Indexed provenance memories for',count,'entities through real P1 HTTP API')
