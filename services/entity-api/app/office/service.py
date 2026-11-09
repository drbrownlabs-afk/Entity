"""Transactional coworking behavior; simulation and real adapters use the same service."""
import json,hashlib
from datetime import datetime,timedelta
from uuid import uuid4
from fastapi import HTTPException
from app.nucleo.capabilities import CapabilityDescriptor,SimulatedAdapter,RestTestAdapter,execute as execute_adapter
from .storage import encode,identity,utc,now,world,emit,get_run
from .auth import scoped,create_account
from .catalog import declare,OPERATIONS

KINDS={'CatalogEntry','Service','Role','Network','InterfaceContract','HourPass','UsageSession','Renewal','ChargeOrder','Payment','Invoice','VisitPlan','MeetingPlan','InvitationPlan','SalesOpportunity','Scenario','Kiosk','Intercom','Conversation','Organization','Site','Company','Team','Membership','Contract','Plan','Building','Floor','Zone','Office','Desk','Room','Reception','WaitingArea','EventSpace','Person','Camera','Stream','AccessPoint','Sensor','HVAC','Light','Equipment','InventoryItem','Shift','Meeting','Booking','Invitation','Visit','Notification','Task','Incident','CheckIn','Alert','Track'}
RESERVABLE={'Desk','Room','Office','EventSpace'}


def resource(db,site,key):
    row=db.execute('SELECT * FROM office_resources WHERE site=? AND id=?',(site,key)).fetchone()
    if not row:raise HTTPException(404,'Resource not found in this site: '+str(key))
    return {**dict(row),'attributes':json.loads(row['attributes'])}


def upsert_resource(db,site,key,kind,attributes):
    if kind not in KINDS or not isinstance(key,str) or not key or len(key)>128:raise HTTPException(422,'Valid domain kind and ID required')
    core_id=identity('office',site,key)
    existing=db.execute('SELECT kind FROM office_resources WHERE site=? AND id=?',(site,key)).fetchone()
    if existing and existing[0]!=kind:raise HTTPException(409,'Resource kind is immutable')
    db.execute('INSERT INTO entities VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET attributes=excluded.attributes',(core_id,kind,encode({'site_id':site,'local_id':key,**attributes}),now()))
    db.execute('INSERT INTO office_resources VALUES(?,?,?,?,?) ON CONFLICT(site,id) DO UPDATE SET attributes=excluded.attributes',(site,key,core_id,kind,encode(attributes)))
    declare(db,site,key)
    return {'id':key,'core_id':core_id,'kind':kind,**attributes}


def site_create(db,site,name,timezone='America/Guayaquil',config=None):
    from zoneinfo import ZoneInfo,ZoneInfoNotFoundError
    try:ZoneInfo(timezone)
    except ZoneInfoNotFoundError:raise HTTPException(422,'Unknown site timezone')
    db.execute('INSERT INTO office_sites VALUES(?,?,?,?)',(site,name,timezone,encode(config or {})))
    upsert_resource(db,site,'site','Site',{'name':name})


def create_run(db,site,run,clock,seed=1):
    clock=utc(clock)
    db.execute('INSERT INTO office_runs VALUES(?,?,?,?)',(site,run,clock,seed))
    changes={}
    for row in db.execute('SELECT * FROM office_resources WHERE site=?',(site,)):
        if row['kind'] in {'Booking','Meeting','Invitation','Visit','Notification','Task','Incident','CheckIn','Alert','Track','Conversation'}:continue
        if json.loads(row['attributes']).get('deprecated'):continue
        changes[row['id']]={'id':row['id'],'core_id':row['core_id'],'kind':row['kind'],**json.loads(row['attributes'])}
    config=json.loads(db.execute('SELECT config FROM office_sites WHERE id=?',(site,)).fetchone()[0])
    if not config.get('active_run_id'):
        config['active_run_id']=run
        db.execute('UPDATE office_sites SET config=? WHERE id=?',(encode(config),site))
    emit(db,site,run,'main',clock,'run.created','system',changes,{'seed':seed})
    return world(db,site,run)


def command(db,site,run,actor,body):
    branch=body.get('branch','main');cid=body['id'];op=body['operation'];target=body['target'];data=body.get('inputs',{})
    if op not in OPERATIONS:raise HTTPException(422,'Unknown declared operation')
    scoped(site,actor,OPERATIONS[op][0]);r=get_run(db,site,run)
    from .inputs import INPUTS
    from pydantic import ValidationError
    try:data=INPUTS[op].model_validate(data).model_dump(mode='json',exclude_none=True,exclude={'schema_version'})
    except ValidationError as exc:raise HTTPException(422,exc.errors(include_input=False,include_context=False))
    state=world(db,site,run,branch);clock=state['clock']
    from .access import authorize_command
    authorize_command(state['entities'],actor,op,target,data)
    if branch!='main' and op not in ['zone.assumeOccupancy','zone.close','zone.open','equipment.fail','equipment.repair','resource.getObject']:raise HTTPException(422,'Scenario supports explicit zone/equipment impact operations')
    fingerprint=hashlib.sha256(encode(body).encode()).hexdigest()
    old=db.execute('SELECT * FROM office_commands WHERE site=? AND run=? AND branch=? AND id=?',(site,run,branch,cid)).fetchone()
    if old:
        if old['actor']!=actor['actor'] or old['fingerprint']!=fingerprint:raise HTTPException(409,'Command ID conflict')
        return json.loads(old['result'])
    if body.get('expected_revision') is not None and body['expected_revision']!=state['revision']:raise HTTPException(409,'World revision changed')
    cap=db.execute('SELECT * FROM office_capabilities WHERE site=? AND resource=? AND operation=?',(site,target,op)).fetchone()
    if not cap:raise HTTPException(404,'Declared capability not found for target')
    descriptor=CapabilityDescriptor.model_validate_json(cap['descriptor'])
    if body.get('capability_version','1.0')!=descriptor.version:raise HTTPException(409,'Capability version mismatch')
    binding=db.execute('SELECT * FROM office_bindings WHERE site=? AND source=?',(site,target)).fetchone()
    adapter=SimulatedAdapter()
    if binding and descriptor.modality!='read':
        if binding['version']!='1.0':raise HTTPException(409,'Adapter version mismatch')
        config=json.loads(binding['config'])
        if config.get('available') is False:raise HTTPException(503,'Adapter unavailable')
        if binding['adapter']=='rest-test':adapter=RestTestAdapter(config['url'])
        elif binding['adapter']!='simulated':raise HTTPException(503,'Adapter unavailable')
    items=state['entities'];changes={};details={'operation':op,'target':target,'inputs':({k:v for k,v in data.items() if k not in ['password','verification_code']})};evidence=[];event_type=op
    def get(key):
        if key in items:return items[key]
        resource(db,site,key)
        return {'id':key,'kind':resource(db,site,key)['kind']}
    def require_kind(key,kinds):
        item=get(key)
        if item['kind'] not in kinds:raise HTTPException(422,'Wrong resource type for operation')
        return item
    def add(key,kind,attrs):
        if key in items:raise HTTPException(409,'Entity already exists')
        entry=upsert_resource(db,site,key,kind,{**attrs,'run_id':run}) if branch=='main' else {'id':key,'kind':kind,**attrs}
        changes[key]=entry;return entry
    def member_allowed(person):
        p=require_kind(person,{'Person'})
        if actor['role']=='member' and person!=actor['person']:raise HTTPException(403,'Cannot act for another member')
        if p.get('membership_status')!='active' or p.get('membership_until','9999')<clock:raise HTTPException(403,'Membership not active')
        return p
    def overlap(resource_id,start,end,exclude=None):
        return [x for x in items.values() if x.get('kind')=='Booking' and (x.get('resource_id')==resource_id or x.get('resource_id') in items.get(resource_id,{}).get('member_resources',[]) or resource_id in items.get(x.get('resource_id'),{}).get('member_resources',[])) and x.get('id')!=exclude and x.get('status') not in ['cancelled','no_show','completed'] and x['starts_at']<end and start<x['ends_at']]
    def available(resource_id,start,end,exclude=None):
        room=require_kind(resource_id,RESERVABLE)
        if room.get('reservable') is False or room.get('deprecated'):raise HTTPException(403,'Resource is internal or withdrawn from commercial booking')
        if room.get('closed') or overlap(resource_id,start,end,exclude):raise HTTPException(409,'Resource unavailable or booking conflict')
        return room
    db.execute('SAVEPOINT office_domain_validation')
    try:
        if op in ['reception.interact','intercom.reply','intercom.timeout']:
            from .interactions import plan
            changes,extra,evidence=plan(db,site,run,actor,items,clock,op,target,data,cid,get,add)
            details.update(extra)
        elif op=='zone.assumeOccupancy':
            require_kind(target,{'Zone'})
            if branch=='main':raise HTTPException(403,'An assumption is not an official observation or executable action')
            changes[target]={'assumed_occupancy':data['count'],'hypothetical':True}
        elif op=='device.setPower':
            require_kind(target,{'HVAC','Light','Equipment'})
            changes[target]={'status':'operational' if data['on'] else 'off','power_on':data['on']}
        elif op=='presence.checkout':
            require_kind(target,{'Person'})
            changes[target]={'presence':'departed','zone_id':None,'observed_at':clock,'ttl_seconds':30}
        elif op=='entity.remember':
            item=get(target)
            from app.main import append_event
            mid=str(uuid4())
            db.execute('INSERT INTO memories VALUES(?,?,?,?,?,?)',(mid,item['core_id'],data['content'],data['source'],now(),'1.0'))
            append_event(db,item['core_id'],'memory.recorded',{'memory_id':mid},data['source'])
            changes[target]={'last_memory_id':mid}
            details['memory_id']=mid
        elif op=='entity.upsert':
            kind=data['kind'];attrs=data.get('attributes',{});key=data['id']
            if set(attrs)&{'id','kind','core_id','site_id','observed_at','freshness','presence','occupancy','access','membership_status','membership_until','status'}:raise HTTPException(403,'Derived state uses domain operations, not metadata writes')
            if kind in {'Booking','Visit','Notification','Task','Incident','CheckIn','Alert','Track'}:raise HTTPException(422,'Use domain operation for derived entity')
            previous=db.execute('SELECT attributes FROM office_resources WHERE site=? AND id=?',(site,key)).fetchone()
            metadata={**(json.loads(previous[0])if previous else{}),**attrs}
            entry=upsert_resource(db,site,key,kind,metadata);changes[key]={**entry,**get(key),**attrs,'id':key,'core_id':entry['core_id'],'kind':kind}
        elif op=='relation.add':
            from .graph import TYPES
            if data['type'] not in TYPES:raise HTTPException(422,'Unknown typed relationship')
            a=get(data['source']);get(data['target']);relations=a.get('relations',[])
            relation={'id':identity(site,data['source'],data['type'],data['target']),'type':data['type'],'target':data['target'],'valid_from':clock,'valid_to':data.get('valid_to'),'provenance':data.get('evidence')or {'source':'explicit-domain-command'}}
            if not any(r['type']==relation['type'] and r['target']==relation['target'] and r.get('valid_to') is None for r in relations):relations=relations+[relation]
            changes[data['source']]={'relations':relations}
        elif op=='account.create':
            if actor['role']!='admin':raise HTTPException(403,'Administrator required')
            if data.get('person'):require_kind(data['person'],{'Person'})
            create_account(db,data['username'],data['password'],site,data['role'],data.get('person'))
            details['username']=data['username'] # password deliberately never included in events/results
        elif op=='membership.set':
            require_kind(target,{'Person'})
            if data['status'] not in ['active','suspended','expired']:raise HTTPException(422,'Invalid membership state')
            changes[target]={'membership_status':data['status'],'membership_until':utc(data['until'])}
        elif op=='booking.create':
            member_allowed(data['person_id']);start,end=utc(data['starts_at']),utc(data['ends_at'])
            if end<=start:raise HTTPException(422,'Booking end must follow start')
            room=available(target,start,end)
            person=get(data['person_id'])
            from .graph import connected
            if room.get('private') and room.get('organization_id') and not connected(items,data['person_id'],'belongsTo',room['organization_id'],clock):raise HTTPException(403,'Private office belongs to another organization')
            if int(data.get('party_size',1))<1 or int(data.get('party_size',1))>room.get('capacity',1):raise HTTPException(422,'Capacity exceeded')
            key=data['booking_id'];add(key,'Booking',{'resource_id':target,'person_id':data['person_id'],'starts_at':start,'ends_at':end,'status':'reserved','party_size':int(data.get('party_size',1))})
            if data.get('meeting_id'):
                add(data['meeting_id'],'Meeting',{'booking_id':key,'resource_id':target,'host_id':data['person_id'],'starts_at':start,'ends_at':end,'status':'scheduled','expected_guests':data.get('expected_guests',[]),'participants':[]})
                changes[key]['meeting_id']=data['meeting_id']
                for index,guest in enumerate(data.get('expected_guests',[])):
                    invitation=guest.get('id') or 'invitation-'+identity(site,data['meeting_id'],index)
                    add(invitation,'Invitation',{'meeting_id':data['meeting_id'],'status':'expected','identity_status':'unspecified','expected_reference':guest.get('reference'),'name':guest.get('name')})
        elif op in ['booking.cancel','booking.extend','booking.reassign','booking.checkin','booking.no_show']:
            booking=require_kind(target,{'Booking'})
            if actor['role']=='member' and booking['person_id']!=actor['person']:raise HTTPException(403,'Booking belongs to another member')
            if booking['status'] in ['cancelled','completed']:raise HTTPException(409,'Booking is closed')
            if op=='booking.cancel':
                changes[target]={'status':'cancelled'}
                if booking.get('meeting_id'):changes[booking['meeting_id']]={'status':'cancelled'}
            elif op=='booking.reassign':
                room=available(data['resource_id'],booking['starts_at'],booking['ends_at'],target)
                from .graph import connected
                if room.get('private') and room.get('organization_id') and not connected(items,booking['person_id'],'belongsTo',room['organization_id'],clock):raise HTTPException(403,'Private office belongs to another organization')
                if booking.get('party_size',1)>room.get('capacity',1):raise HTTPException(409,'Alternative capacity insufficient')
                changes[target]={'resource_id':data['resource_id']}
                if booking.get('meeting_id'):changes[booking['meeting_id']]={'resource_id':data['resource_id']}
            elif op=='booking.extend':
                end=utc(data['ends_at'])
                if end<=booking['ends_at']:raise HTTPException(422,'Extension must increase end')
                available(booking['resource_id'],booking['starts_at'],end,target);changes[target]={'ends_at':end}
                if booking.get('meeting_id'):changes[booking['meeting_id']]={'ends_at':end}
            elif op=='booking.checkin':
                if booking['status']=='checked_in':raise HTTPException(409,'Booking already checked in')
                if not booking['starts_at']<=clock<booking['ends_at']:raise HTTPException(409,'Outside booking interval')
                changes[target]={'status':'checked_in','checked_in_at':clock}
            else:
                if clock<utc((datetime.fromisoformat(booking['starts_at'])+timedelta(minutes=15)).isoformat()):raise HTTPException(409,'No-show grace period not elapsed')
                if booking['status']=='checked_in':raise HTTPException(409,'Already checked in')
                changes[target]={'status':'no_show'}
        elif op=='visit.register':
            meeting=require_kind(data['meeting_id'],{'Meeting'})
            if meeting['status']=='cancelled':raise HTTPException(409,'Meeting cancelled')
            track=require_kind(data['track_id'],{'Track'})
            if track.get('person_id'):raise HTTPException(409,'Use known-person workflow')
            add(data['visit_id'],'Visit',{'track_id':data['track_id'],'meeting_id':data['meeting_id'],'statement':data.get('statement',''),'status':'provisional','identity_status':'unknown','access':'not_granted'})
            evidence=[track.get('observation_id')]
        elif op=='visit.link':
            visit=require_kind(target,{'Visit'});meeting=require_kind(data['meeting_id'],{'Meeting'})
            if meeting['status']=='cancelled':raise HTTPException(409,'Meeting cancelled')
            changes[target]={'meeting_id':data['meeting_id'],'status':'provisional','access':'not_granted'}
        elif op=='visit.checkin':
            visit=require_kind(target,{'Visit'});meeting=require_kind(visit['meeting_id'],{'Meeting'})
            if meeting['status']=='cancelled':raise HTTPException(409,'Meeting cancelled')
            if visit['status']!='provisional':raise HTTPException(409,'Visit already checked in or closed')
            waiting=require_kind(data['waiting_area'],{'WaitingArea'})
            waiting_count=sum(x.get('kind')=='Visit' and x.get('status') in {'waiting','host_ready'} and x.get('waiting_area')==data['waiting_area'] for x in items.values())
            if waiting_count>=waiting.get('capacity',1) and visit.get('status')!='waiting':raise HTTPException(409,'Waiting area full')
            changes[target]={'status':'waiting','waiting_area':data['waiting_area'],'registered_at':clock,'access':'waiting_only','registered_by':actor['actor']}
        elif op=='identity.associate':
            track=require_kind(target,{'Track'});person=member_allowed(data['person_id'])
            if track.get('freshness')!='fresh' or not track.get('active'):raise HTTPException(409,'Track is not currently observed')
            if not data.get('credential_verified') or data.get('evidence_type') not in ['badge-checkin','staff-verification']:raise HTTPException(403,'Explicit authorized identity evidence required')
            if actor['role'] not in ['admin','reception','security']:raise HTTPException(403,'Identity permission denied')
            until=(datetime.fromisoformat(clock)+timedelta(minutes=5)).isoformat()
            changes[target]={'person_id':data['person_id'],'association_until':until,'association_source':data['evidence_type']}
            changes[data['person_id']]={'presence':'confirmed','zone_id':track.get('zone_id'),'observed_at':clock,'ttl_seconds':30,'identity_evidence':data['evidence_type'],'track_id':target}
            add('checkin-'+cid,'CheckIn',{'person_id':data['person_id'],'at':clock,'source':data['evidence_type']})
            evidence=[track.get('observation_id')]
        elif op in ['access.checkAuthorization','access.requestEntry']:
            door=require_kind(target,{'AccessPoint'});person_id=data.get('person_id');visit_id=data.get('visit_id')
            allowed=False;reason='No valid identity or visit evidence'
            if person_id:
                p=member_allowed(person_id);observed=p.get('last_observation_id') or items.get(p.get('track_id'),{}).get('observation_id');evidence=[observed] if observed else [];allowed=p.get('presence')=='confirmed' and p.get('freshness')=='fresh';reason='active membership and confirmed fresh check-in' if allowed else 'Arrival not currently confirmed'
            elif visit_id:
                visit=require_kind(visit_id,{'Visit'});meeting=require_kind(visit['meeting_id'],{'Meeting'});host=get(meeting['host_id'])
                meeting_resource=get(meeting['resource_id'])
                destinations={meeting_resource['id'],meeting_resource.get('zone_id')}-{None}
                in_window=datetime.fromisoformat(meeting['starts_at'])-timedelta(minutes=15)<=datetime.fromisoformat(clock)<datetime.fromisoformat(meeting['ends_at'])
                allowed=visit.get('status') in {'waiting','host_ready'} and meeting['status'] not in {'cancelled','completed'} and host.get('presence')=='confirmed' and host.get('freshness')=='fresh' and bool(data.get('escorted')) and door.get('zone_id') in destinations and in_window
                reason='registered meeting-scoped visit, current host check-in and authorized escort' if allowed else 'Host arrival, escort, meeting destination or time policy not satisfied'
            destination=items.get(door.get('zone_id'),{})
            private=[x for x in items.values() if x.get('kind')=='Office' and x.get('private') and (x['id']==door.get('zone_id') or x.get('zone_id')==door.get('zone_id'))]
            if allowed and (door.get('closed') or destination.get('closed')):
                allowed=False;reason='Destination is closed'
            if allowed and person_id and any(x.get('organization_id')!=p.get('organization_id') for x in private):
                allowed=False;reason='Private environment belongs to another organization'
            details.update(allowed=allowed,reason=reason)
            if op=='access.requestEntry':
                if allowed:
                    changes[target]={'last_access':clock,'last_subject':person_id or visit_id}
                    if visit_id:changes[visit_id]={'status':'escorted','access':'granted','zone_id':door.get('zone_id')}
                    if person_id:changes[person_id]={'zone_id':door.get('zone_id'),'observed_at':clock}
                else:
                    add('alert-'+cid,'Alert',{'type':'access.denied','access_point':target,'subject':person_id or visit_id,'person_id':person_id,'visit_id':visit_id,'zone_id':door.get('zone_id'),'reason':reason,'status':'open'})
                    details['denied']=True
        elif op=='notification.send':
            require_kind(target,{'Person'})
            add('notification-'+cid,'Notification',{'recipient':target,'message':data['message'],'status':'delivered','simulated':True,'sent_at':clock})
        elif op in ['meeting.start','meeting.end']:
            meeting=require_kind(target,{'Meeting'})
            if meeting['status']=='cancelled':raise HTTPException(409,'Meeting cancelled')
            if op=='meeting.start':
                if meeting['status']=='in_progress':raise HTTPException(409,'Meeting already started')
                room=get(meeting['resource_id']);host=get(meeting['host_id'])
                if not meeting['starts_at']<=clock<meeting['ends_at']:raise HTTPException(409,'Outside meeting interval')
                measured=room if room.get('observed_at') else items.get(room.get('zone_id'),{})
                if not measured.get('occupancy',0) or measured.get('freshness')!='fresh':raise HTTPException(409,'No fresh occupancy evidence')
                if host.get('presence')!='confirmed' or host.get('freshness')!='fresh':raise HTTPException(409,'Host arrival not confirmed')
                participants=data.get('participants',[])
                for person in participants:require_kind(person,{'Person','Visit'})
                changes[target]={'status':'in_progress','participants':participants,'started_at':clock}
            else:
                changes[target]={'status':'completed','ended_at':clock};changes[meeting['booking_id']]={'status':'completed'}
                for key,item in items.items():
                    if item.get('kind')=='Visit' and item.get('meeting_id')==target:changes[key]={'status':'departed','access':'revoked'}
        elif op in ['task.create','task.assign','task.resolve']:
            if op=='task.create':
                get(data['resource_id']);add(data['task_id'],'Task',{'resource_id':data['resource_id'],'description':data['description'],'status':'open','assignee':None})
            else:
                task=require_kind(target,{'Task'})
                if task.get('status')=='resolved':raise HTTPException(409,'Task already resolved')
                if op=='task.assign':
                    p=require_kind(data['person_id'],{'Person'})
                    if 'staff' not in p.get('roles',[]):raise HTTPException(422,'Assignee must be staff')
                    changes[target]={'assignee':data['person_id'],'status':'assigned'}
                else:
                    if actor['role']=='maintenance' and task.get('assignee')!=actor['person']:raise HTTPException(403,'Task is not assigned to this staff member')
                    changes[target]={'status':'resolved','resolution':data['resolution'],'resolved_at':clock}
        elif op in ['equipment.fail','equipment.repair']:
            machine=require_kind(target,{'HVAC','Equipment','Light'});zone=machine.get('zone_id')
            if not zone:raise HTTPException(422,'Equipment needs site zone mapping')
            affected=[key for key,x in items.items() if (x.get('zone_id')==zone and (x.get('kind')!='Person' or (x.get('presence')=='confirmed' and x.get('freshness')=='fresh'))) or (x.get('kind')=='Booking' and items.get(x.get('resource_id'),{}).get('zone_id')==zone and x.get('status') not in ['cancelled','completed','no_show'] and x.get('ends_at','')>clock)]
            if op=='equipment.fail':
                changes[target]={'status':'failed'}
                add('incident-'+cid,'Incident',{'equipment_id':target,'zone_id':zone,'affected':affected,'status':'open','cause':'equipment-failure'})
                add('task-'+cid,'Task',{'resource_id':target,'incident_id':'incident-'+cid,'description':'Inspect failed '+target,'status':'open','assignee':None})
                changes[zone]={'comfort':'degraded'}
            else:
                changes[target]={'status':'operational'};changes[zone]={'comfort':'normal'}
                for key,x in items.items():
                    if x.get('equipment_id')==target and x.get('kind')=='Incident':changes[key]={'status':'resolved','resolved_at':clock}
            details.update(affected=affected,zone_id=zone)
        elif op in ['zone.close','zone.open']:
            require_kind(target,{'Zone'});changes[target]={'closed':op=='zone.close'}
            for key,x in items.items():
                if x.get('zone_id')==target and x.get('kind') in RESERVABLE:changes[key]={'closed':op=='zone.close'}
        elif op=='camera.setStatus':
            require_kind(target,{'Camera'})
            if data['status'] not in ['connected','disconnected']:raise HTTPException(422,'Invalid camera status')
            changes[target]={'connectivity':data['status'],'status_at':clock}
        elif op=='clock.advance':
            if branch!='main':raise HTTPException(409,'Scenario clock is fixed at fork; use a new scenario for another time')
            next_clock=utc(data['to'])
            if next_clock<clock:raise HTTPException(409,'Clock cannot rewind; use historical query or new run')
            if (datetime.fromisoformat(next_clock)-datetime.fromisoformat(clock)).total_seconds()>86400:raise HTTPException(422,'Advance limited to one day')
            db.execute('UPDATE office_runs SET clock=? WHERE site=? AND id=?',(next_clock,site,run));clock=next_clock
        elif op=='resource.getObject':
            from .access import projection
            details['resource']=projection(state,actor)['entities'][target]
        elif op=='sensor.read':
            sensor=require_kind(target,{'Sensor','HVAC','Equipment'})
            measurement=sensor.get('measurement');name=data.get('name')
            if name and measurement and measurement.get('name')!=name:measurement=None
            details['read']={'measurement':measurement,'available':measurement is not None,'observed_at':sensor.get('observed_at'),'freshness':sensor.get('freshness','unknown'),'mode':'cached-core-observation','device_contacted':False}
            if sensor.get('last_observation_id'):
                evidence=[sensor['last_observation_id']]
                record=db.execute('SELECT body FROM office_inbox WHERE site=? AND run=? AND id=?',(site,run,sensor['last_observation_id'])).fetchone()
                if record:details['read']['measurement_provenance']=json.loads(record[0]).get('provenance',{})
        elif op=='camera.getObservations':
            require_kind(target,{'Camera'})
            from .access import projection
            from .queries import query
            details['read']=query(db,site,run,{'kind':'camera_observations','entity_id':target,'branch':branch},visible_state=projection(state,actor))
            evidence=details['read']['evidence']
        elif op=='camera.getStream':
            camera=require_kind(target,{'Camera'})
            # A stream description is not a new video connection or a detection.
            streams=[{'id':x['id'],'camera_id':target,'type':x.get('type'),'video_recorded':x.get('video_recorded',False)} for x in items.values() if x.get('kind')=='Stream' and x.get('camera_id')==target]
            details['read']={'streams':streams,'available':bool(streams) and camera.get('connectivity')=='connected','connectivity':camera.get('connectivity','unknown'),'mode':'cached-stream-metadata','video_connection_opened':False}

        elif op=='booking.getAvailability':
            require_kind(target,RESERVABLE);start,end=utc(data['starts_at']),utc(data['ends_at'])
            if end<=start:raise HTTPException(422,'Invalid interval')
            details['available']=get(target).get('reservable') is not False and not get(target).get('deprecated') and not get(target).get('closed') and not overlap(target,start,end)
        else:raise HTTPException(422,'Observation capabilities use the observation endpoint')
    except (KeyError,TypeError,ValueError) as exc:raise HTTPException(422,'Invalid inputs for '+op+': '+str(exc))
    adapter_inputs={k:v for k,v in data.items() if k not in ['password','verification_code']}
    if binding:
        adapter_inputs['_behavior']=json.loads(binding['config']).get('behavior')
    if descriptor.modality=='read':
        result={'status':'verified','value':details.get('read',details.get('resource',{k:v for k,v in details.items() if k not in ['operation','target','inputs']})),'simulated':bool(get(target).get('virtual') or details.get('read',{}).get('measurement_provenance',{}).get('simulated')),'provenance':{'source':'core-memory','device_contacted':False},'idempotency_key':cid}
    elif op=='access.requestEntry' and not details.get('allowed'):
        result={'status':'denied','simulated':True,'provenance':{'source':'core-authorization-policy'},'idempotency_key':cid}
    else:
        result=execute_adapter(descriptor,adapter_inputs,cid,adapter)
    if result['status'] not in ['verified','denied']:
        db.execute('ROLLBACK TO office_domain_validation')
        changes={}
        clock=state['clock']
        event_type='action.result'
    db.execute('RELEASE office_domain_validation')
    details.update(capability_id=descriptor.capability_id,capability_version=descriptor.version,actor_person_id=actor.get('person'),
                   authorization={'permission':OPERATIONS[op][0],'site_id':site,'role':actor['role']},
                   outcome={'status':result['status'],'simulated':result.get('simulated'),'provenance':result.get('provenance')})
    event=emit(db,site,run,branch,clock,event_type,actor['actor'],changes,details,evidence,cid)
    response={**result,'event':event,'details':details,'revision':event['sequence']}
    db.execute('INSERT INTO office_commands VALUES(?,?,?,?,?,?,?)',(site,run,branch,cid,actor['actor'],fingerprint,encode(response)))
    return response
