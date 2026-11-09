"""Derive an explicit P2 site configuration from existing scene metadata. Never edits geometry."""
import json,hashlib,argparse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
p=argparse.ArgumentParser();p.add_argument('--output',required=True);p.add_argument('--clock',required=True,help='Explicit laboratory clock, not an observed business timestamp');a=p.parse_args()
source=ROOT/'apps/spatial-simulation/public/model/scene.json';scene=json.loads(source.read_text());records=scene['records'];byid={r['id']:r for r in records};resources=[]
def put(key,kind,environment,ids,parent='site',position=None,bounds=None):
 chosen=[byid[i]for i in ids]
 if position is None and chosen:
  lo=[min(r['bounds'][0][j]for r in chosen)for j in range(3)];hi=[max(r['bounds'][1][j]for r in chosen)for j in range(3)];position=[(l+h)/2 for l,h in zip(lo,hi)];bounds=[lo,hi]
 spatial={'coordinate_frame':'p2-playcanvas-source-y-up','scene_environment_id':environment,'object_ids':ids,'position':position,'bounds':bounds,'scene_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'master_sha256':scene['master_sha256'],'provenance':'existing-scene-index; not a physical survey'}
 resources.append({'id':key,'kind':kind,'attributes':{'name':key,'parent_resource':parent,'operational_state':'unknown','spatial':spatial,'registration_source':'P2-08 explicit inventory','real_operation_verified':False}})
for name in ['A','B','C','D','E']:
 env=name if name!='E'else'sim:ROOM-E';r=next(r for r in scene['room_bounds']if r['id']==env);x1,x2,z1,z2=r['bounds'];put(name,'Office',env,[],position=[(x1+x2)/2,r['floor_y'],(z1+z2)/2],bounds=[[x1,r['floor_y'],z1],[x2,1.72,z2]])
for name in ['D1','D2','D3','D4','D5','D6','E1','E5','E6']:
 n=int(name[1:]);prefix=f'sim:p1:D:chair:{n}:'if name[0]=='D'else f'sim:p2:E:chair:{n-1}:';ids=[r['id']for r in records if r['id'].startswith(prefix)];assert ids,name
 put(name,'Desk',name[0]if name[0]=='D'else'sim:ROOM-E',ids,parent=name[0])
for key,env,kind in [('RECEPTION','RECEPTION','Reception'),('CAFE','sim:CAFE-01','Zone'),('LOUNGE','sim:LOUNGE','Zone')]:
 ids=[r['id']for r in records if r['environment_id']==env and r['type']in ['ReceptionCounter','Counter','Sofa']];assert ids;put(key,kind,env,ids)
# Logical registration slots are explicitly unverified, never evidence that real people exist or are present.
for n in [1,2]:
 resources.append({'id':f'PERSON-LOGICAL-{n:02}','kind':'Person','attributes':{'name':f'Persona lógica sin identificar {n}','identity_status':'unverified-placeholder','operational_state':'unknown','real_person_verified':False,'position':None,'avatar_id':None,'parent_resource':'site','registration_source':'P2-08 logical placeholder; no real identity or presence asserted'}})
config={'id':'coworking-p2','name':'ENTITY coworking — P2 laboratory, not live operations','timezone':'UTC','clock':a.clock,'resources':resources,'accounts':[{'username':'admin','role':'admin'},{'username':'viewer','role':'viewer','grants':[{'resource':'site','permission':'read'}]}]}
Path(a.output).parent.mkdir(parents=True,exist_ok=True);Path(a.output).write_text(json.dumps(config,indent=2)+'\n');print('Prepared',len(resources),'resources; no geometry modified')
