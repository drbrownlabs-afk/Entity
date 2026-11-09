"""8.4 data-only model extension. Scene evidence is not proof of real-world installation."""
import hashlib,re
from collections import defaultdict
SOURCE='operator P2-08 addendum8.4; declarations only'

def extend(config,scene):
 resources=config['resources'];bykey={r['id']:r for r in resources};records={r['id']:r for r in scene['records']};edges=config['structural_relations']
 frame={'coordinate_frame':'p2-playcanvas-source-y-up','master_sha256':scene['master_sha256'],'scene_sha256':next(r['attributes']['whole_scene_reference']['scene_sha256']for r in resources if r['id']=='site'),'provenance':'existing scene objects only; physical installation not verified'}
 def put(key,kind,attrs):
  if key in bykey:
   bykey[key]['attributes'].update(attrs);return bykey[key]
  r={'id':key,'kind':kind,'attributes':{'name':key,'operational_state':'unknown','registry_id':'site','registration_source':SOURCE,'real_operation_verified':False,**attrs}};resources.append(r);bykey[key]=r;return r
 def link(source,target,kind,planned=False):
  if not any(e['source']==source and e['target']==target and e['type']==kind for e in edges):edges.append({'source':source,'target':target,'type':kind,'evidence':{'source':SOURCE,'declaration':'previsto'if planned else'declared-model-relation','execution_or_presence_proven':False}})
 def spatial(ids):
  ids=sorted(set(ids));chosen=[records[i]for i in ids if records[i].get('bounds')];assert chosen,ids
  lo=[min(r['bounds'][0][j]for r in chosen)for j in range(3)];hi=[max(r['bounds'][1][j]for r in chosen)for j in range(3)]
  return {**frame,'object_ids':ids,'position':[(a+b)/2 for a,b in zip(lo,hi)],'bounds':[lo,hi],'scene_environment_id':chosen[0]['environment_id']}
 def evidence_attrs(status='existente_verificado'):
  return {'model_status':status,'verification_scope':'digital scene only'if status=='existente_verificado'else'operator-declared catalogue; not installation evidence','physical_installation_verified':False,'integration_status':'not_connected','operational_state':'unknown','validity':{'declared_from':config['clock'],'valid_until':None,'physical_dates_known':False}}
 # Retain existing classifications and distinguish catalogue from physical verification.
 for r in list(resources):
  a=r['attributes'];a.setdefault('model_status','existente_verificado'if a.get('spatial')else'pendiente_identificar'if r['kind']=='Person'else'previsto');a.setdefault('spatial_status','mapped_existing_scene'if a.get('spatial')else'sin_correspondencia_espacial')
  a.setdefault('verification_scope','digital scene or explicit operator model; not actual operation')
 bykey['site']['attributes'].update(model_status='existente_verificado',verification_scope='registered space identity and existing digital scene; physical site verification unknown',spatial_status='whole-scene-reference')
 for key in ['ORG-ENTITY','ORG-INMERSO']:bykey[key]['attributes'].update(model_status='existente_verificado',verification_scope='operator-defined organizational identity in model; legal details unverified')
 envmap={'sim:ROOM-E':'E','sim:CAFE-01':'CAFE','sim:LOUNGE':'LOUNGE','RECEPTION':'RECEPTION','CIRCULATION-01':'CIRCULATION-01','MEETING-AREA-01':'MEETING-AREA-01',**{x:x for x in 'ABCDE'}}
 for key,env,label in [('WAITING-AREA','WAITING-AREA','Espera'),('CALL-01','sim:CALL-01','Cabina1'),('CALL-02','sim:CALL-02','Cabina2'),('WC','sim:WC','Baño'),('PRINT','sim:PRINT','Impresión'),('LOCKERS','sim:LOCKERS','Lockers'),('DINING','sim:RECREATION','Comedor')]:
  ids=[r['id']for r in records.values()if r['environment_id']==env and r.get('bounds')and r['type']not in ['Vegetation','Ceiling','CeilingDetail']];assert ids
  put(key,'Zone',{'name':label,'parent_resource':'site','spatial':spatial(ids),'spatial_status':'mapped_existing_scene',**evidence_attrs()});envmap[env]=key
 put('ENTRANCE-MAIN','Zone',{'name':'Entrada principal — geometría sin identificar','parent_resource':'site','spatial':None,'spatial_status':'sin_correspondencia_espacial',**evidence_attrs('pendiente_identificar'),'source_note':'Route origin does not prove which door is the main entrance'})
 put('ENTRANCE-MAIN-DOOR','InventoryItem',{'name':'Puerta principal — identidad física pendiente','item_class':'Door','parent_resource':'ENTRANCE-MAIN','spatial':None,'spatial_status':'sin_correspondencia_espacial',**evidence_attrs('pendiente_identificar')})
 # Existing scene confirms six E chairs. Register missing canonical slots without changing older IDs.
 for number in [2,3,4]:
  ids=[r['id']for r in records.values()if r['id'].startswith(f'sim:p2:E:chair:{number-1}:')];assert ids
  put('E'+str(number),'Desk',{'parent_resource':'E','zone_id':'E','public':True,'private':False,'reservable':True,'capacity':1,'spatial':spatial(ids),'spatial_status':'mapped_existing_scene',**evidence_attrs(),'policy_provenance':'canonical12 D/E positions; existing E chair index n-1'})
 bykey['E']['attributes']['planned_unindexed_catalog_ids']=[]
 # Source group is stable across mesh parts; do not count back/seat/legs as different assets.
 def group(r):
  if r.get('furniture_group'):return r['furniture_group']
  key=re.sub(r':part:\d+$','',r['id']);key=re.sub(r':(?:seat|back)$','',key);key=re.sub(r'-(?:seat|back|base)$','',key);return key
 def asset(key,kind,cls,ids,env,parent=None,facet='physical-asset'):
  ids=sorted(set(i for i in ids if i in records));assert ids
  # Reuse exactly matching existing physical assets, never a logical Desk or spatial Zone.
  match=next((r for r in resources if r['kind']in ['InventoryItem','Equipment','Kiosk']and set(r['attributes'].get('spatial',{}).get('object_ids',[])if r['attributes'].get('spatial')else[])==set(ids)and r['attributes'].get('representation_level')!='aggregate'),None)
  if match and cls not in ['Door']:key=match['id'];kind=match['kind']
  put(key,kind,{'item_class':cls,'asset_facet':facet,'parent_resource':parent or envmap.get(env,'site'),'zone_id':envmap.get(env,'site'),'spatial':spatial(ids),'spatial_status':'mapped_existing_scene','declaration_only':False if match else True,'manufacturer':None,'model':None,'serial_number':None,**evidence_attrs()});return key
 bykey['LOUNGE-SEATING']['attributes']['representation_level']='aggregate'
 furniture_types={'Table':'Table','CafeTable':'DiningTable','SideTable':'SideTable','Chair':'Chair','Sofa':'Sofa','Armchair':'Armchair','Stool':'Stool','Ottoman':'Ottoman','ReceptionCounter':'ReceptionCounter','Counter':'Counter','Shelf':'Shelf','SanitaryFixture':'SanitaryFixture','Ventilation':'VentilationOutlet','Signage':'Signage','Storage':'Storage'}
 groups=defaultdict(list)
 for r in records.values():
  if r['type']in furniture_types and not('locker:'in r['id']):groups[(furniture_types[r['type']],group(r),r['environment_id'])].append(r['id'])
 for (cls,g,env),ids in sorted(groups.items()):
  parent=envmap.get(env,'site');m=re.search(r':D:chair:(\d+)$',g)
  if m:parent='D'+m[1]
  m=re.search(r':E:chair:(\d+)$',g)
  if m:parent='E'+str(int(m[1])+1)
  if cls=='Sofa'and'sim:r1:lounge:chair'in g:cls='Armchair'
  if cls=='SanitaryFixture'and':toilet:'in g:continue
  asset('ASSET-'+hashlib.sha256((cls+'|'+g).encode()).hexdigest()[:14],'InventoryItem',cls,ids,env,parent)
 toilet=[r['id']for r in records.values()if r['id'].startswith('sim:r1:WC:toilet:')]
 if toilet:asset('WC-TOILET','InventoryItem','Toilet',toilet,'sim:WC')
 for r in records.values():
  if r['type']!='Monitor':continue
  prefix=r['id'].removesuffix(':body');ids=[i for i in records if i==prefix or i.startswith(prefix+':')];env=r['environment_id'];n=re.search(r':computer:(\d+):body$',r['id']);number=int(n[1])if n else int(r['id'].rsplit(':',1)[1])if env=='sim:ROOM-E'else None
  # D3 is the requested computer example. C hardware stays private, not a public C3 desk.
  parent='D'+str(number)if env=='D'else'E'+str(number+1)if env=='sim:ROOM-E'else envmap.get(env,'site')
  key='COMPUTER-D3'if env=='D'and number==3 else'COMPUTER-'+hashlib.sha256(prefix.encode()).hexdigest()[:14]
  asset(key,'Equipment','Computer',ids,env,parent)
 for d in scene['devices']['televisions']:asset('TV-'+hashlib.sha256(d['id'].encode()).hexdigest()[:14],'Equipment','Television',[d['id'],d['screen_id']],d['environment_id'])
 for d in scene['devices']['luminaires']:
  ids=[i for i in [d['fixture_id'],d['emitter_id']]if i in records]
  key='LIGHT-'+hashlib.sha256(d['id'].encode()).hexdigest()[:14]
  if ids:asset(key,'Light','Luminaire',ids,d['environment_id'])
  else:put(key,'Light',{'name':key,'item_class':'Luminaire','parent_resource':envmap.get(d['environment_id'],'site'),'zone_id':envmap.get(d['environment_id'],'site'),'spatial':{**frame,'object_ids':[],'position':d['position_source'],'bounds':None,'scene_environment_id':d['environment_id'],'provenance':'existing native PlayCanvas light definition; no corresponding GLB fixture'},'spatial_status':'mapped_native_light','declaration_only':True,**evidence_attrs()})
  bykey[key]['attributes']['spatial']['runtime_light_id']=d['id'];bykey[key]['attributes']['source_device_id']=d['id']
 for d in scene['devices']['doors']:
  ids=[i for i in records if i==d['id']or i.startswith(d['id']+':')];key=asset('DOOR-'+hashlib.sha256(d['id'].encode()).hexdigest()[:14],'InventoryItem','Door',ids,d['environment_id'],facet='physical-door; access point is a separate policy entity')
  for old in resources:
   if old['kind']=='AccessPoint'and d['id']in old['attributes'].get('spatial',{}).get('object_ids',[])if old['attributes'].get('spatial')else False:link(old['id'],key,'referencesDoor')
 for d in scene['devices']['lockers']:
  ids=[i for i in records if i.startswith(d['id']+':')and records[i]['type']=='Storage'];locker=asset('LOCKER-'+hashlib.sha256(d['id'].encode()).hexdigest()[:14],'InventoryItem','Locker',ids,'sim:LOCKERS',facet='locker body; separate door asset')
  door='DOOR-'+hashlib.sha256(d['door_id'].encode()).hexdigest()[:14]
  if door in bykey:bykey[door]['attributes']['parent_resource']=locker
 for typ,cls in [('Printer','Printer'),('Kiosk','Kiosk'),('CoffeeMachine','CoffeeMachine'),('Refrigerator','Refrigerator')]:
  for r in records.values():
   if r['type']==typ:asset('DEVICE-'+hashlib.sha256(r['id'].encode()).hexdigest()[:14],'Equipment',cls,[r['id']],r['environment_id'])
 terminals=defaultdict(list)
 for r in records.values():
  if r['type']=='CommunicationTerminal':terminals[(r['environment_id'],re.sub(':(phonebase|handset)$','',r['id']))].append(r['id'])
 for (env,g),ids in terminals.items():asset('INTERCOM-'+hashlib.sha256(g.encode()).hexdigest()[:14],'Equipment','CommunicationTerminal',ids,env)
 # Catalogue types have unknown cardinality; they are not invented installed devices.
 categories={
 'security':['BiometricReader','AccessController','CredentialType','AccessPolicy','DoorLock','DoorSensor','SurveillanceConsole','AlarmPanel','IntrusionZone','Siren','MotionDetector','SmokeFireDetector','EvacuationSafety','EmergencyExit'],
 'environment':['TemperatureSensor','HumiditySensor','CO2Sensor','HVAC','VentilationController','EnergyMeter','UPS'],
 'network':['Router','Firewall','Switch','WiFi','WAN','ISP','LocalNetwork','DataSource','ElectronicLocker','MaintenanceAsset','StorageArea'],
 'hr':['EmploymentContract','Shift','Schedule','WorkDay','AttendanceCheckIn','AttendanceCheckOut','Absence','LeavePermission','OrdinaryHours','Overtime','PayrollPeriod','Salary','Deduction','RemunerationPayment','Position','Team','Responsibility'],
 'crm':['Prospect','Lead','ClientLifecycle','Contact','ClientDirectory','SupplierDirectory','ServiceProviderDirectory','CommercialActivity','VisitFollowUp','SalesOpportunity'],
 'commercial':['MembershipPlan','Membership','HourPass','OfficeAssignment','DeskAssignment','Reservation','Availability','Agenda','Meeting','Invitation','ContractedUse','Contract','Agreement'],
 'finance':['Receivable','ChargeOrder','ChargeConcept','Tariff','InvoiceDraft','Payment','PaymentMethod','Balance','DueDate','Refund','CreditNote','Payable','Purchase','SupplierInvoice','RecurringExpense','TaxField'],
 'documents':['Document','Folder','DocumentPermission','ServiceContract','AssetInventory','ConsumableInventory','MaintenancePlan','WorkOrder','Incident'],
 'attention':['ReceptionRequest','Visitor','ServiceTicket','Notification']}
 for category,classes in categories.items():
  for cls in classes:put('CAT-'+cls.upper(),'CatalogEntry',{'name':cls,'catalog_category':category,'record_class':cls,'is_type_definition':True,'known_instance_count':None,'quantity':None,'spatial':None,'spatial_status':'sin_correspondencia_espacial','model_status':'previsto','integration_status':'not_connected','declaration_only':True,'schema_fields':{'identity':'stable identifier','state':'unknown or explicitly sourced declaration','source':'required','valid_from':'optional, sourced','valid_until':'optional, sourced'},'data_fields':{'value':None,'amount':None,'dates':None},'no_executed_records':True})
 # Type-specific future record fields remain unknown, never actual payroll/billing facts.
 fieldsets={
  'EmploymentContract':['employee_id','employer_id','effective_from','effective_to','salary_id','weekly_hours','document_id'],
  'Shift':['role_id','planned_start','planned_end','break_minutes'], 'Schedule':['timezone','working_days','planned_hours'],
  'WorkDay':['person_id','date','ordinary_hours','overtime_hours'], 'AttendanceCheckIn':['person_id','expected_at','actual_at','evidence'], 'AttendanceCheckOut':['person_id','expected_at','actual_at','evidence'],
  'PayrollPeriod':['starts_at','ends_at','calculation_status','payment_status'], 'Salary':['person_id','gross_amount','currency','effective_from','effective_to'], 'Deduction':['kind','amount','rate','basis','authorization'], 'RemunerationPayment':['person_id','period_id','amount','confirmed_at','provider_id'],
  'Absence':['person_id','starts_at','ends_at','reason'], 'LeavePermission':['person_id','starts_at','ends_at','authorization'],
  'Contact':['person_or_organization_id','communication_channels','consent'], 'ClientLifecycle':['organization_or_person_id','declared_status','source'], 'SupplierDirectory':['organization_ids','known_cardinality'], 'ServiceProviderDirectory':['organization_ids','service_ids','known_cardinality'],
  'TaxField':['jurisdiction','tax_code','base','rate','source','calculated_liability'],
  'Document':['document_id','owner_id','repository_id','access_policy_id','content_reference'], 'DocumentPermission':['subject_id','document_id','rights','valid_from','valid_until'],
  'BiometricReader':['manufacturer','model','quantity','source_contract_id','calibration_status'], 'CredentialType':['credential_kind','policy_id','retention_policy'],
  'DoorLock':['quantity','door_id','controller_id','installation_evidence'], 'DoorSensor':['quantity','door_id','source_contract_id','installation_evidence'], 'StorageArea':['quantity','zone_id','geometry_reference']}
 for r in resources:
  if r['kind']=='CatalogEntry':
   cls=r['attributes']['record_class'];fields=fieldsets.get(cls,['subject_id','related_entity_id','declared_state','source','effective_from','effective_to'])
   r['attributes']['field_schema']={k:{'type':'unknown until contract is configured','required':False}for k in fields};r['attributes']['data_fields']={k:None for k in fields}
   if cls=='Contact':r['attributes']['identity_policy']='Reference existing Person/Organization; never duplicate identity for contact role'
 # Unknown operator is one explicit role placeholder, not a fabricated legal company/provider.
 put('ORG-OPERATOR-UNIDENTIFIED','Organization',{'name':'Operadora del coworking — sin identificar','legal_name':None,'tax_id':None,'model_status':'pendiente_identificar','identity_status':'unidentified-operator-role','registry_id':'site','spatial':None,'spatial_status':'sin_correspondencia_espacial'})
 link('site','ORG-OPERATOR-UNIDENTIFIED','declaredOperator',True)
 for org in ['ORG-ENTITY','ORG-INMERSO']:link(org,'site','clientOf')
 role_ids={'staff':'STAFF','reception':'RECEPTION','administration':'ADMINISTRATION','operations':'OPERATIONS','member':'MEMBER','visitor':'VISITOR','host':'HOST'}
 for role,suffix in role_ids.items():put('ROLE-'+suffix,'Role',{'name':role,'registry_id':'site','model_status':'existente_verificado','verification_scope':'operator-defined role, no system permission inferred','spatial':None,'spatial_status':'sin_correspondencia_espacial','permissions_granted':[]})
 for r in list(resources):
  if r['kind']=='Person'and r['attributes'].get('demo_population'):
   for role in r['attributes'].get('roles',[]):
    if role in role_ids:link(r['id'],'ROLE-'+role_ids[role],'hasRole')
   if r['attributes'].get('population_group')=='staff':r['attributes']['employer_identity_status']='pending; operator legal identity unknown'
 for key,zone,planned in [('RECEPTION','RECEPTION',False),('CAFE','CAFE',False),('LOUNGE','LOUNGE',False),('DOCUMENT-REPOSITORY',None,True),('CRM',None,True),('CALENDAR',None,True),('BILLING',None,True),('PAYROLL',None,True),('NETWORK-INTERNET',None,True),('SUPPORT',None,True),('MAINTENANCE',None,True),('EXTERNAL-SERVICES',None,True)]:
  sid='SERVICE-'+key;put(sid,'Service',{'name':key,'registry_id':'site','model_status':'previsto'if planned else'existente_verificado','verification_scope':'service category declared by operator; not availability evidence','provider_id':None,'integration_status':'not_connected','declaration_only':True,'spatial':None,'spatial_status':'sin_correspondencia_espacial','actual_accounts_or_tenants_known':False});link('site',sid,'plansService'if planned else'offersService',planned)
  if zone:link(zone,sid,'supportsService')
 put('NETWORK-PLANNED','Network',{'name':'Red del coworking — diseño pendiente','registry_id':'site','model_status':'previsto','network_addresses':None,'ssid':None,'provider_id':None,'integration_status':'not_connected','spatial':None,'spatial_status':'sin_correspondencia_espacial','known_device_count':None})
 put('CONTRACT-VISUAL-FUTURE','InterfaceContract',{'name':'Futura fuente visual para percepción8.3','registry_id':'site','model_status':'previsto','existing_observation_contract':'packages/contracts/integrations/v1/Observation.json','visual_frame_transport_implemented':False,'provider_binding':None,'integration_status':'not_connected','spatial':None,'spatial_status':'sin_correspondencia_espacial'})
 put('CONTRACT-ACCESS-FUTURE','InterfaceContract',{'name':'Futuro control de acceso','registry_id':'site','model_status':'previsto','planned_capabilities':['verify_credential','evaluate_authorization','request_unlock'],'availability':'not_implemented','provider_binding':None,'biometric_templates_stored':False,'spatial':None,'spatial_status':'sin_correspondencia_espacial'})
 for number in range(1,9):
  cid=f'CAMERA-PLANNED-{number:02}';put(cid,'Camera',{'name':f'Cámara virtual prevista {number}','virtual':True,'model_status':'previsto','registry_id':'site','position':None,'spatial':None,'spatial_status':'sin_correspondencia_espacial','calibration_status':'pending','covered_zones':[],'coverage_verified':False,'fov':None,'resolution':None,'fps':None,'feed_url':None,'frames_produced':0,'integration_status':'not_connected','declaration_only':True});link(cid,'site','plannedFor',True);link(cid,'CONTRACT-VISUAL-FUTURE','hasSourceContract',True)
 for target in ['ENTRANCE-MAIN','ACCESS-A','ACCESS-B','ACCESS-C']:
  if target not in bykey:continue
  for cls,relation in [('BiometricReader','plannedProtection'),('AccessController','plannedControl'),('DoorLock','plannedProtection'),('DoorSensor','plannedMonitoring'),('AccessPolicy','plannedControl'),('CredentialType','plannedComponent')]:link(target,'CAT-'+cls.upper(),relation,True)
  link(target,'CONTRACT-ACCESS-FUTURE','hasSourceContract',True)
 for cls in ['Router','Firewall','Switch','WiFi','WAN','ISP']:link('NETWORK-PLANNED','CAT-'+cls.upper(),'plannedComponent',True)
 for r in list(resources):
  if r['attributes'].get('item_class')in ['Computer','Printer','Television','CommunicationTerminal','Kiosk']:link(r['id'],'NETWORK-PLANNED','plannedNetworkConnection',True)
 # A declaration is a durable model record; no device readings, bindings or business actions.
 assert len(bykey)==len(resources)
 return config
