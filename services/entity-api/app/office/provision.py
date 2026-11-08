"""Idempotent, additive coworking inventory. Coordinates only from verified original anchors."""
import json
from .storage import identity,encode,now,emit,utc
from .service import upsert_resource,site_create

TOPOLOGY_VERSION=5
EMPLOYEES={
 'Entity':[('CARLOS','Carlos','Director de producto'),('ANA','Ana','Ingeniera espacial'),('DIEGO','Diego','Desarrollador'),('VALERIA','Valeria','Diseñadora'),('TOMAS','Tomás','Operaciones'),('ELENA','Elena','Investigadora')],
 'Inmerso':[('MARTIN','Martín','Director creativo'),('PAULA','Paula','Productora'),('ANDRES','Andrés','Artista 3D'),('LUCIA','Lucía','Diseñadora'),('NICOLAS','Nicolás','Desarrollador XR'),('CAMILA','Camila','Coordinadora')],
 'Cowork':[('SOFIA','Sofía','Coordinadora de operaciones'),('MATEO','Mateo','Técnico de mantenimiento'),('ISABEL','Isabel','Gestora de comunidad'),('RAFAEL','Rafael','Seguridad'),('NORA','Nora','Administración'),('BRUNO','Bruno','Soporte técnico')]
}

def provision(db,site,original,clock,run_id='day-01'):
    clock=utc(clock)
    row=db.execute('SELECT config FROM office_sites WHERE id=?',(site,)).fetchone()
    if row:
        config=json.loads(row[0])
        if config.get('topology_version',0)>=TOPOLOGY_VERSION:return False
    else:
        config={'scene_url':'https://superspl.at/scene/a972d838','license':'CC BY-NC4.0'}
        site_create(db,site,'Synthetic Office — ENTITY Spatial Intelligence','America/Guayaquil',config)
    entries={}
    def put(key,kind,**attrs):
        previous=db.execute('SELECT attributes FROM office_resources WHERE site=? AND id=?',(site,key)).fetchone()
        old=json.loads(previous[0]) if previous else {}
        entries[key]=upsert_resource(db,site,key,kind,{**old,**attrs})
    def link(source,kind,target):
        edge={'type':kind,'target':target,'valid_from':clock,'valid_to':None,'provenance':'operator-topology-v2'}
        relations=entries[source].setdefault('relations',[])
        if not any(x['type']==kind and x['target']==target and not x.get('valid_to') for x in relations):relations.append(edge)
        source_id=entries[source]['core_id'];target_id=entries[target]['core_id']
        db.execute('INSERT OR IGNORE INTO relations VALUES(?,?,?,?,?)',(identity(site,source,kind,target),source_id,target_id,kind,clock))
    put('site','Site',name='Synthetic Office',topology_version=TOPOLOGY_VERSION)
    for index,a in enumerate(original['settings']['annotations']):
        zone='annotation-'+str(index)
        put(zone,'Zone',name=a['title'],annotation_index=index,position=a['position'],coordinate_frame='supersplat-original',spatial_mapping='original-authored-annotation',reservable=False)
        c=a['camera']['initial'];cam='CAM-'+str(index+1).zfill(2)
        put(cam,'Camera',name=cam+' · cámara virtual',virtual=True,position=c['position'],target=c['target'],fov=c['fov'],covered_zones=[zone],coverage_mode='synthetic-declared; visibility calibration pending',connectivity='connected',annotation_index=index,retention_days=7)
        put('STREAM-'+str(index+1).zfill(2),'Stream',camera_id=cam,type='virtual-render',video_recorded=False)
        db.execute('INSERT OR IGNORE INTO office_bindings VALUES(?,?,?,?,?)',(site,cam,'simulated','1.0','{}'))
        link(cam,'covers',zone);link('STREAM-'+str(index+1).zfill(2),'streamOf',cam)
    for organization,environment in [('Entity','A'),('Inmerso','B'),('Cowork',None)]:
        org='ORG-'+organization.upper();team='TEAM-'+organization.upper()
        put(org,'Organization',name=organization,description={'Entity':'Equipo de inteligencia espacial','Inmerso':'Equipo de experiencias inmersivas','Cowork':'Equipo operador del coworking'}[organization],fictitious=True)
        put(team,'Team',name='Equipo '+organization,organization_id=org)
        link(team,'partOf',org)
        if environment:
            index=0 if environment=='A' else 2;a=original['settings']['annotations'][index]
            put(environment,'Office',name='Oficina '+environment+' · '+organization,capacity=6,organization_id=org,zone_id='annotation-'+str(index),private=True,reservable=True,commercial=True,booking_mode='whole-environment',position=a['position'],annotation_index=index,spatial_mapping='operator-confirmed-original-annotation')
            link(org,'occupies',environment);link(environment,'assignedTo',org)
        for number,(key,name,job) in enumerate(EMPLOYEES[organization],1):
            person='PERSON-'+key
            put(person,'Person',name=name,fictitious=True,profile_level='employee',job_title=job,organization_id=org,team_id=team,roles=['staff'] if organization=='Cowork' else ['member'],membership_status='active',membership_until='2027-12-31T00:00:00+00:00',schedule={'starts_local':'08:30','ends_local':'18:30','timezone':'America/Guayaquil'},presence='unknown',home_environment=environment,position=None)
            link(person,'memberOf',team);link(person,'employedBy',org)
            if environment:
                put(environment+'-INTERNAL-'+str(number),'Desk',name=environment+' · posición interna '+str(number),zone_id=entries[environment]['zone_id'],parent_resource=environment,reservable=False,commercial=False,position=None,spatial_mapping='individual-seat-not-calibrated')
                link(person,'assignedTo',environment);link(person,'uses',environment+'-INTERNAL-'+str(number))
    for group in ['C','D']:
        put('ZONE-'+group,'Zone',name='Ambiente '+group+' · puestos individuales',position=None,reservable=False,spatial_mapping='operator-confirmed-group; individual-calibration-pending')
        # C already exists as Office in previous databases: retain its immutable kind and ID.
        put(group,'Office',name='Grupo '+group+' · puestos individuales',capacity=6,organization_id=None,private=False,public=True,reservable=False,commercial=False,booking_mode='individual-desks',zone_id='ZONE-'+group,position=None,spatial_mapping='operator-confirmed-unannotated-group')
        for number in range(1,7):
            put(group+str(number),'Desk',name='Puesto '+group+str(number),capacity=1,zone_id='ZONE-'+group,parent_resource=group,reservable=True,commercial=True,public=True,position=None,spatial_mapping='individual-seat-not-calibrated')
            link(group+str(number),'locatedIn','ZONE-'+group)
    put('PERSON-LUIS','Person',name='Luis',roles=['member'],fictitious=True,profile_level='member',membership_status='active',membership_until='2027-12-31T00:00:00+00:00',presence='unknown',position=None)
    put('RECEPTION','Reception',name='Recepción inteligente · dos sillas negras',position=None,reservable=False,spatial_mapping='pending-visual-inspection',human_receptionist=False)
    put('WAITING-AREA','WaitingArea',name='Espera de visitantes',capacity=3,seating_capacity=3,capacity_source='visual-count; wall-from-a/b original survey',position=None,reservable=False,spatial_mapping='pending-visual-inspection')
    put('KIOSK-01','Kiosk',name='ENTITY · recepción',zone_id='RECEPTION',virtual=True,interfaces=['screen','touch','voice'],waiting_area='WAITING-AREA',operator_org_id='ORG-COWORK',connectivity='connected',privacy='private-session',position=None)
    put('ACCESS-01','AccessPoint',name='Acceso autorizado de ensayo',zone_id='annotation-1',position=None,virtual=True,spatial_mapping='not-calibrated')
    a=original['settings']['annotations'][1]
    put('MEETING-AREA-01','EventSpace',name='Mesa negra · reuniones',capacity=8,capacity_source='authored-title; seat-count-review-pending',zone_id='annotation-1',annotation_index=1,position=a['position'],enclosed_room=False,reservable=True,commercial=True)
    for zone in ['C','D']:
        put('HVAC-'+zone,'HVAC',name='Climatización simulada '+zone,zone_id='ZONE-'+zone,status='operational',virtual=True,physical_device_verified=False,estimated_power_w=1200,position=None)
        put('SENSOR-'+zone,'Sensor',name='Ambiente simulado '+zone,zone_id='ZONE-'+zone,virtual=True,position=None)
        db.execute('INSERT OR IGNORE INTO office_bindings VALUES(?,?,?,?,?)',(site,'SENSOR-'+zone,'simulated','1.0','{}'))
        link('HVAC-'+zone,'serves','ZONE-'+zone);link('SENSOR-'+zone,'measures','ZONE-'+zone)
    for environment in ['A','B']:
        terminal='INTERCOM-'+environment
        put(terminal,'Intercom',name='ENTITY · ambiente '+environment,zone_id=entries[environment]['zone_id'],environment_id=environment,virtual=True,connectivity='connected',privacy='private-addressed',position=None)
        link(terminal,'locatedIn',environment);link(entries[environment]['organization_id'],'communicatesThrough',terminal)
    put('PERSON-JOSE','Person',name='José',roles=['staff'],fictitious=True,profile_level='employee',job_title='Operador de Cowork',organization_id='ORG-COWORK',home_environment=None,presence='unknown',position=None)
    link('PERSON-JOSE','belongsTo','ORG-COWORK')
    link('KIOSK-01','locatedIn','RECEPTION')
    # Existing legacy objects retain their IDs, bookings and event history. They are withdrawn
    # from sale rather than silently reassigned to a different desk or organization.
    for row in db.execute('SELECT * FROM office_resources WHERE site=?',(site,)).fetchall():
        key=row['id']
        if key.startswith('DESK-') or key.startswith('BENCH-'):
            attrs=json.loads(row['attributes'])
            put(key,row['kind'],**{**attrs,'reservable':False,'commercial':False,'deprecated':True,'position':None,'migration_reason':'legacy private-group misclassified as public','replacement_resource':'A' if key=='BENCH-1' or (key.startswith('DESK-') and int(key[5:])<=6) else 'B'})
    # Retire contradicted inventory additively; old bookings and old event payloads retain IDs.
    for row in db.execute('SELECT * FROM office_resources WHERE site=?',(site,)).fetchall():
        key=row['id'];attrs=json.loads(row['attributes'])
        if key.startswith('E') and key[1:].isdigit() or key in {'ZONE-E','HVAC-E','SENSOR-E','INTERCOM-C'} or key.startswith('C-INTERNAL-'):
            put(key,row['kind'],**{**attrs,'deprecated':True,'reservable':False,'commercial':False,'position':None,'migration_reason':'operator spatial contract v5: only A/B private and C/D public; historical identifiers retained'})
        if key in entries:
            item=entries[key]
            item['relations']=[{**edge,'valid_to':clock} if not edge.get('valid_to') and ((key=='ORG-COWORK' and edge['type']=='occupies' and edge['target']=='C') or (key=='C' and edge['target']=='ORG-COWORK') or (item.get('organization_id')=='ORG-COWORK' and (edge['target']=='C' or edge['target'].startswith('C-INTERNAL-')))) else edge for edge in item.get('relations',[])]
    # Persist canonical relation metadata in resources and expose the same relation graph in replay.
    for key,item in entries.items():
        attrs={k:v for k,v in item.items() if k not in ['id','core_id','kind']}
        upsert_resource(db,site,key,item['kind'],attrs)
    for row in db.execute('SELECT id,clock FROM office_runs WHERE site=?',(site,)).fetchall():
        changes={}
        for key,item in entries.items():
            old=db.execute("SELECT body FROM office_state WHERE site=? AND run=? AND branch='main' AND entity=?",(site,row['id'],key)).fetchone()
            before=json.loads(old[0]) if old else {}
            # Inventory corrections never erase observed presence, reservations, or state.
            protected={'observed_at','presence','freshness','track_id','occupancy','last_observation_id','measurement','environment'}
            changes[key]={k:v for k,v in item.items() if k not in protected or k not in before}
        emit(db,site,row['id'],'main',row['clock'],'inventory.corrected','system',changes,{'topology_version':TOPOLOGY_VERSION,'legacy_history_preserved':True})
    config['topology_version']=TOPOLOGY_VERSION
    db.execute('UPDATE office_sites SET config=? WHERE id=?',(encode(config),site))
    return True

def apply_semantics(db,site,annotations):
    """Add reviewed native SuperSplat annotations without changing operational state/history."""
    import hashlib
    from .storage import get_run
    digest=hashlib.sha256(encode(annotations).encode()).hexdigest()
    row=db.execute('SELECT config FROM office_sites WHERE id=?',(site,)).fetchone()
    if not row:return False
    config=json.loads(row[0])
    if config.get('semantic_revision')==digest:return False
    changes={}
    for index,annotation in enumerate(annotations,4):
        extra=annotation['extras'];key=extra['entity_id'];kind=extra['kind']
        old=db.execute('SELECT attributes FROM office_resources WHERE site=? AND id=?',(site,key)).fetchone()
        attrs={**(json.loads(old[0]) if old else {}),'name':annotation['title'],'position':annotation['position'],'annotation_index':index,
               'coordinate_frame':'supersplat-original','spatial_mapping':'visual-group-verified; individual seats not calibrated','spatial_provenance':extra,'reservable':False}
        if extra.get('seating_capacity') is not None:attrs.update(seating_capacity=extra['seating_capacity'],capacity=extra['seating_capacity'],capacity_source=extra['capacity_source'])
        changes[key]=upsert_resource(db,site,key,kind,attrs)
    for run in db.execute('SELECT id,clock FROM office_runs WHERE site=?',(site,)).fetchall():
        emit(db,site,run['id'],'main',run['clock'],'spatial.mapping.updated','authorized-scene-survey',changes,{'source':'reviewed-original-splat-depth','semantic_revision':digest})
    config['semantic_revision']=digest
    db.execute('UPDATE office_sites SET config=? WHERE id=?',(encode(config),site))
    return True


def apply_observed_inventory(db,site,inventory):
    """Persist reviewed, unmapped furniture as evidence, never as additional saleable desks."""
    import hashlib
    digest=hashlib.sha256(encode(inventory).encode()).hexdigest()
    config=json.loads(db.execute('SELECT config FROM office_sites WHERE id=?',(site,)).fetchone()[0])
    if config.get('observed_inventory_revision')==digest:return False
    changes={}
    for item in inventory:
        attrs=item['attributes'];key=item['id']
        if item['kind']!='InventoryItem' or attrs.get('reservable') is not False or attrs.get('commercial') is not False or attrs.get('position') is not None:
            raise ValueError('Unmapped visual inventory must remain noncommercial and without asserted coordinates')
        old=db.execute('SELECT attributes FROM office_resources WHERE site=? AND id=?',(site,key)).fetchone()
        changes[key]=upsert_resource(db,site,key,item['kind'],{**(json.loads(old[0]) if old else {}),**attrs})
    for run in db.execute('SELECT id,clock FROM office_runs WHERE site=?',(site,)).fetchall():
        emit(db,site,run['id'],'main',run['clock'],'inventory.visual_observation_added','authorized-scene-survey',changes,{'source':'reviewed-original-SSOG','inventory_revision':digest,'commercial_capacity_changed':False})
    config['observed_inventory_revision']=digest
    db.execute('UPDATE office_sites SET config=? WHERE id=?',(encode(config),site))
    return True


def apply_calibrated_resources(db,site,calibration):
    """Apply reviewed original-scene anchors without overwriting operational state."""
    import hashlib
    digest=hashlib.sha256(encode(calibration).encode()).hexdigest()
    config=json.loads(db.execute('SELECT config FROM office_sites WHERE id=?',(site,)).fetchone()[0])
    if config.get('calibrated_resources_revision')==digest:return False
    changes={}
    for item in calibration['resources']:
        row=db.execute('SELECT kind,attributes FROM office_resources WHERE site=? AND id=?',(site,item['id'])).fetchone()
        if not row or row['kind']!=item['kind']:raise ValueError('Calibration must reference an existing resource of the same kind')
        attrs=item['attributes']
        if set(attrs)-{'position','coordinate_frame','spatial_mapping','anchor_kind','spatial_provenance'}:raise ValueError('Calibration cannot change business or authorization fields')
        upsert_resource(db,site,item['id'],item['kind'],{**json.loads(row['attributes']),**attrs});changes[item['id']]=attrs
    for run in db.execute('SELECT id,clock FROM office_runs WHERE site=?',(site,)).fetchall():
        emit(db,site,run['id'],'main',run['clock'],'spatial.resources_calibrated','authorized-scene-survey',changes,{'source_commit':calibration['source_commit'],'calibration_revision':digest,'simulated_occupancy_claimed':False})
    config['calibrated_resources_revision']=digest
    db.execute('UPDATE office_sites SET config=? WHERE id=?',(encode(config),site))
    return True
