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
# Section8.2: reuse the four existing logical identities, extend the population to exactly12.
people=[
 (1,'Visitante comercial sintético','visitors',['visitor'],None),
 (2,'Habitual anual sintético','regulars',['member'],None),
 (3,'Staff de recepción sintético','staff',['staff','reception'],None),
 (4,'Carlos','entity',['host','member'],'ORG-ENTITY'),
 (5,'Staff de administración sintético','staff',['staff','administration'],None),
 (6,'Staff de operaciones sintético','staff',['staff','operations'],None),
 (7,'Santiago','entity',['member'],'ORG-ENTITY'),
 (8,'Integrante Inmerso provisional1','inmerso',['member'],'ORG-INMERSO'),
 (9,'Integrante Inmerso provisional2','inmerso',['member'],'ORG-INMERSO'),
 (10,'Habitual mensual sintético','regulars',['member'],None),
 (11,'Habitual por horas sintético','regulars',['member'],None),
 (12,'Visitante de reunión sintético','visitors',['visitor'],None)]
for number,name,group,roles,organization in people:
 key=f'PERSON-LOGICAL-{number:02}';attrs={'name':name,'population_group':group,'roles':roles,'organization_id':organization,'identity_status':'operator-named-logical-person'if name in ['Carlos','Santiago']else'synthetic-provisional','real_person_verified':False,'operational_state':'unknown','position':None,'avatar_id':None,'parent_resource':None,'registry_id':'site','demo_population':True,'registration_source':'operator addendum8.2; logical identities, not observed people'}
 previous=next((r for r in resources if r['id']==key),None)
 if previous:previous['attributes']=attrs
 else:resources.append({'id':key,'kind':'Person','attributes':attrs})
def logical(key,kind,**attrs):
 resources.append({'id':key,'kind':kind,'attributes':{'name':key,'registry_id':'site','parent_resource':None,'operational_state':'unknown','synthetic':True,'relation_semantics':'planned-reference-not-executed-effect','registration_source':'operator addendum8.2.1; declarative model for future operational tests','real_operation_verified':False,**attrs}})
for key,name in [('ORG-ENTITY','Entity'),('ORG-INMERSO','Inmerso')]:logical(key,'Organization',name=name,organization_role='workspace-occupant; not ENTITY Core',conditions_verified=False)
for resource in resources:
 if resource['id']in ['A','B']:resource['attributes']['assigned_org_id']='ORG-ENTITY'if resource['id']=='A'else'ORG-INMERSO';resource['attributes']['assignment_source']='operator section8.2';resource['attributes']['assignment_dates_verified']=False
from datetime import datetime,timedelta
clock=datetime.fromisoformat(a.clock.replace('Z','+00:00'))
for key,period in [('PLAN-ANNUAL','annual'),('PLAN-MONTHLY','monthly'),('PLAN-HOURLY','hourly')]:logical(key,'Plan',period=period,commercial_terms_verified=False,real_price=None)
logical('MEMBERSHIP-ANNUAL','Membership',person_id='PERSON-LOGICAL-02',plan_id='PLAN-ANNUAL',declared_state='active',valid_from=clock.isoformat(),valid_until=(clock+timedelta(days=365)).isoformat(),access_rights='scenario-plan entitlement only; no live individual authorization materialized')
logical('MEMBERSHIP-MONTHLY-OLD','Membership',person_id='PERSON-LOGICAL-10',plan_id='PLAN-MONTHLY',declared_state='expired',valid_from=(clock-timedelta(days=31)).isoformat(),valid_until=(clock-timedelta(days=1)).isoformat())
logical('MEMBERSHIP-HOURLY','Membership',person_id='PERSON-LOGICAL-11',plan_id='PLAN-HOURLY',declared_state='scenario-hours-plan; no consumption inferred')
logical('HOUR-PASS-01','HourPass',person_id='PERSON-LOGICAL-11',plan_id='PLAN-HOURLY',purchased_hours=10,consumed_hours=0,declared_state='synthetic-contract-balance',commercial_terms_verified=False)
logical('USAGE-SESSION-PLAN','UsageSession',person_id='PERSON-LOGICAL-11',pass_id='HOUR-PASS-01',declared_state='planned-not-started',started_at=None,ended_at=None,consumed_hours=0)
for number,person in [(1,'PERSON-LOGICAL-01'),(2,'PERSON-LOGICAL-12')]:logical('VISITOR-PASS-'+str(number),'HourPass',person_id=person,declared_state='planned-temporary-pass',valid_from=clock.isoformat(),valid_until=(clock+timedelta(days=1)).isoformat(),access_granted=False)
logical('RENEWAL-MONTHLY','Renewal',person_id='PERSON-LOGICAL-10',renews_id='MEMBERSHIP-MONTHLY-OLD',plan_id='PLAN-MONTHLY',declared_state='awaiting-payment-confirmation',paid=False,new_valid_from=None,new_valid_until=None)
logical('CHARGE-MONTHLY','ChargeOrder',person_id='PERSON-LOGICAL-10',renewal_id='RENEWAL-MONTHLY',amount=100,currency='USD',amount_source='synthetic-example; not actual pricing',declared_state='unpaid')
logical('PAYMENT-MONTHLY','Payment',person_id='PERSON-LOGICAL-10',order_id='CHARGE-MONTHLY',amount=100,currency='USD',declared_state='pending-confirmation',confirmed=False,provider=None,confirmation_event=None)
logical('INVOICE-MONTHLY','Invoice',person_id='PERSON-LOGICAL-10',payment_id='PAYMENT-MONTHLY',issuer=None,issuer_status='operator organization not identified',recipient='PERSON-LOGICAL-10',concepts=[{'description':'Synthetic monthly membership renewal','amount':100}],amount=100,currency='USD',document_id='SIM-P2-INVOICE-01',declared_state='draft-simulated-not-issued',issued=False,fiscal_document=False,sri_submitted=False)
logical('MEMBERSHIP-MONTHLY-RENEWAL-PLAN','Membership',person_id='PERSON-LOGICAL-10',plan_id='PLAN-MONTHLY',renewal_id='RENEWAL-MONTHLY',declared_state='planned-after-confirmed-payment',valid_from=None,valid_until=None,active=False)
logical('VISIT-COMMERCIAL-PLAN','VisitPlan',person_id='PERSON-LOGICAL-01',service_id='RECEPTION',purpose='evaluate coworking membership',declared_state='planned-no-arrival',arrival_event=None,membership_created=False)
logical('OPPORTUNITY-COMMERCIAL','SalesOpportunity',person_id='PERSON-LOGICAL-01',visit_plan_id='VISIT-COMMERCIAL-PLAN',declared_state='synthetic-prospect; not converted')
logical('MEETING-VISITOR-PLAN','MeetingPlan',person_id='PERSON-LOGICAL-12',host_id='PERSON-LOGICAL-04',organization_id='ORG-ENTITY',resource_id='MEETING-AREA-01',declared_state='planned; not booked',office_A_authorization_defined=False,arrival_event=None,starts_at=None,ends_at=None)
logical('INVITATION-VISITOR-PLAN','InvitationPlan',person_id='PERSON-LOGICAL-12',meeting_plan_id='MEETING-VISITOR-PLAN',host_id='PERSON-LOGICAL-04',declared_state='planned-not-delivered',arrival_event=None)
logical('VISIT-MEETING-PLAN','VisitPlan',person_id='PERSON-LOGICAL-12',meeting_plan_id='MEETING-VISITOR-PLAN',service_id='RECEPTION',declared_state='planned-no-arrival',arrival_event=None)
logical('SCENARIO-RENEWAL-MONTHLY','Scenario',person_id='PERSON-LOGICAL-10',renewal_id='RENEWAL-MONTHLY',declared_state='future-test-definition',expected_sequence=['membership.expired','renewal.requested','charge.created','payment.confirmed','invoice.simulated-issued','membership.renewed'],invariant='No paid renewal, issued invoice or active renewal before payment confirmation; no flow executed here')
resources.insert(0,{'id':'site','kind':'Site','attributes':{'name':'ENTITY coworking — entidad madre del espacio P2','space_type':'Coworking','space_root':True,'world_model_root':False,'operational_state':'unknown','state_provenance':'not observed; no aggregate occupancy inferred','whole_scene_reference':{'coordinate_frame':'p2-playcanvas-source-y-up','scene_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'master_sha256':scene['master_sha256'],'scope':'existing coworking scene as a whole; no unique mesh required'},'registration_source':'operator P2-08 addendum section8.1'}})
config={'id':'coworking-p2','name':'ENTITY coworking — P2 laboratory, not live operations','timezone':'UTC','clock':a.clock,'resources':resources,'structural_relations':relations,'accounts':[{'username':'admin','role':'admin'},{'username':'viewer','role':'viewer','grants':[{'resource':'site','permission':'read'}]}]}
Path(a.output).parent.mkdir(parents=True,exist_ok=True);Path(a.output).write_text(json.dumps(config,indent=2)+'\n');print('Prepared',len(resources),'resources; no geometry modified')
