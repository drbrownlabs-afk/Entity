"""Derive an explicit P2 site configuration from existing scene metadata. Never edits geometry."""
import json,hashlib,argparse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
p=argparse.ArgumentParser();p.add_argument('--output',required=True);p.add_argument('--clock',required=True,help='Explicit laboratory clock, not an observed business timestamp');a=p.parse_args()
source=ROOT/'apps/spatial-simulation/public/model/scene.json';scene=json.loads(source.read_text());records=scene['records'];byid={r['id']:r for r in records};resources=[]
def put(key,kind,environment,ids,parent='site',position=None,bounds=None):
 chosen=[byid[i]for i in ids if byid[i].get('bounds')]
 if position is None and chosen:
  lo=[min(r['bounds'][0][j]for r in chosen)for j in range(3)];hi=[max(r['bounds'][1][j]for r in chosen)for j in range(3)];position=[(l+h)/2 for l,h in zip(lo,hi)];bounds=[lo,hi]
 spatial={'coordinate_frame':'p2-playcanvas-source-y-up','scene_environment_id':environment,'object_ids':ids,'position':position,'bounds':bounds,'scene_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'master_sha256':scene['master_sha256'],'provenance':'existing-scene-index; not a physical survey'}
 resources.append({'id':key,'kind':kind,'attributes':{'name':key,'parent_resource':parent,'operational_state':'unknown','spatial':spatial,'registration_source':'P2-08 explicit inventory','real_operation_verified':False}})
for name in ['A','B','C','D','E']:
 env=name if name!='E'else'sim:ROOM-E';r=next(r for r in scene['room_bounds']if r['id']==env);x1,x2,z1,z2=r['bounds'];put(name,'Office',env,[],position=[(x1+x2)/2,r['floor_y'],(z1+z2)/2],bounds=[[x1,r['floor_y'],z1],[x2,1.72,z2]])
for r in resources:
 key=r['id'];attrs=r['attributes'];attrs.update(private=key in ['A','B'],public=key in ['D','E'],reservable=key in ['A','B'],capacity=6,booking_mode='whole-environment'if key in ['A','B']else 'staff-only'if key=='C'else 'individual-desks',functional_use='staff'if key=='C'else'private-office'if key in ['A','B']else'coworking',policy_provenance='operator P2-08 addendum; catalogue, not availability evidence')
 if key=='E':attrs['planned_unindexed_catalog_ids']=['E2','E3','E4']
for name in ['D1','D2','D3','D4','D5','D6','E1','E5','E6']:
 n=int(name[1:]);prefix=f'sim:p1:D:chair:{n}:'if name[0]=='D'else f'sim:p2:E:chair:{n-1}:';ids=[r['id']for r in records if r['id'].startswith(prefix)];assert ids,name
 put(name,'Desk',name[0]if name[0]=='D'else'sim:ROOM-E',ids,parent=name[0]);resources[-1]['attributes'].update(zone_id=name[0],public=True,private=False,reservable=True,capacity=1,policy_provenance='operator canonical D/E catalogue')
for key,env,kind in [('RECEPTION','RECEPTION','Reception'),('CAFE','sim:CAFE-01','Zone'),('LOUNGE','sim:LOUNGE','Zone')]:
 ids=[r['id']for r in records if r['environment_id']==env and r['type']in ['ReceptionCounter','Counter','Sofa']];assert ids;put(key,kind,env,ids)
# Logical registration slots are explicitly unverified, never evidence that real people exist or are present.
for n in [1,2,3,4]:
 resources.append({'id':f'PERSON-LOGICAL-{n:02}','kind':'Person','attributes':{'name':f'Persona lógica sin identificar {n}','roles':[['visitor'],['member'],['staff'],['host']][n-1],'identity_status':'unverified-placeholder','operational_state':'unknown','real_person_verified':False,'position':None,'avatar_id':None,'parent_resource':None,'registry_id':'site','registration_source':'P2-08 logical placeholder; no real identity or presence asserted'}})
# Additional existing structures and furnishings only; never generate geometry.
for key,env,kind,types,parent in [
 ('MEETING-AREA-01','MEETING-AREA-01','Room',['Table','TV'],'site'),
 ('CIRCULATION-01','CIRCULATION-01','Zone',['Floor'],'site'),
 ('KIOSK-01','RECEPTION','Kiosk',['Kiosk'],'RECEPTION'),
 ('TABLE-D','D','InventoryItem',['Table'],'D'),
 ('TABLE-E','sim:ROOM-E','InventoryItem',['Table'],'E'),
 ('LOUNGE-SEATING','sim:LOUNGE','InventoryItem',['Sofa'],'LOUNGE'),
 ('CAFE-COFFEE','sim:CAFE-01','InventoryItem',['CoffeeMachine'],'CAFE')]:
 ids=[r['id']for r in records if r['environment_id']==env and r['type']in types]
 if ids:
  put(key,kind,env,ids,parent=parent)
  if parent!='site':resources[-1]['attributes']['zone_id']=parent
  if key=='MEETING-AREA-01':resources[-1]['attributes'].update(reservable=True,booking_mode='whole-environment',policy_provenance='operator meeting-room designation; not live operation')
relations=[]
for door in scene['devices']['doors']:
 env=door.get('environment_id');room='E'if env=='sim:ROOM-E'else env
 if room not in ['A','B','C','D','E','MEETING-AREA-01']:continue
 ids=[r['id']for r in records if r['id']==door['id']or r['id'].startswith(door['id']+':')]
 if not ids:continue
 key='ACCESS-'+room;put(key,'AccessPoint',env,ids,parent=room,position=door['hinge_source']);resources[-1]['attributes'].update(zone_id=room,virtual=True,physical_device_verified=False)
 route=scene['routes'].get(env,[]);hinge=door['hinge_source'];opening=[hinge[2]+door['collider_local_position'][2]+b[2]for b in door['collider_local_bounds']]
 # Require a route segment across the actual hinge plane within its door opening.
 crossings=[]
 for before,after in zip(route,route[1:]):
  if (before[0]-hinge[0])*(after[0]-hinge[0])<=0 and before[0]!=after[0]:
   t=(hinge[0]-before[0])/(after[0]-before[0]);z=before[2]+t*(after[2]-before[2])
   if min(opening)-.01<=z<=max(opening)+.01:crossings.append([before,after])
 if crossings:
  for source_id,target in [(room,'CIRCULATION-01'),('CIRCULATION-01',room)]:relations.append({'source':source_id,'target':target,'type':'connectedTo','evidence':{'source':'existing approved geometric route','route':env,'door_object':door['id'],'crossings':crossings,'condition':'geometric connection; actual transit depends on current door state; not an access authorization'}})
# D/E share the explicit existing partition boundary. This is adjacency, not transit.
rooms={r['id']:r for r in scene['room_bounds']};d,e=rooms['D']['bounds'],rooms['sim:ROOM-E']['bounds']
if abs(d[2]-e[3])<1e-6 and min(d[1],e[1])>max(d[0],e[0]):
 for source_id,target in [('D','E'),('E','D')]:relations.append({'source':source_id,'target':target,'type':'adjacentTo','evidence':{'source':'existing room bounds and E reuse_front_partition D','shared_boundary_z':d[2],'transit_implied':False}})
resources.insert(0,{'id':'site','kind':'Site','attributes':{'name':'ENTITY coworking — entidad madre del espacio P2','space_type':'Coworking','space_root':True,'world_model_root':False,'operational_state':'unknown','state_provenance':'not observed; no aggregate occupancy inferred','whole_scene_reference':{'coordinate_frame':'p2-playcanvas-source-y-up','scene_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'master_sha256':scene['master_sha256'],'scope':'existing coworking scene as a whole; no unique mesh required'},'registration_source':'operator P2-08 addendum section8.1'}})
config={'id':'coworking-p2','name':'ENTITY coworking — P2 laboratory, not live operations','timezone':'UTC','clock':a.clock,'resources':resources,'structural_relations':relations,'accounts':[{'username':'admin','role':'admin'},{'username':'viewer','role':'viewer','grants':[{'resource':'site','permission':'read'}]}]}
Path(a.output).parent.mkdir(parents=True,exist_ok=True);Path(a.output).write_text(json.dumps(config,indent=2)+'\n');print('Prepared',len(resources),'resources; no geometry modified')
