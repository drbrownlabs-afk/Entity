"""A persistent daily script orchestrating existing domain services, not a second world model."""
import json
from datetime import datetime,timedelta
from fastapi import HTTPException
from app.connectors import Observation
from .storage import identity,utc,encode,get_run,world,emit
from .service import command,upsert_resource
from .observations import ingest
from .auth import scoped,ROLES
from .interactions import issue_credential

def setup(db):
    db.execute("""CREATE TABLE IF NOT EXISTS office_schedule(
      site TEXT NOT NULL,run TEXT NOT NULL,id TEXT NOT NULL,at TEXT NOT NULL,action TEXT NOT NULL,payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',result TEXT,PRIMARY KEY(site,run,id))""")
    db.execute("""CREATE TABLE IF NOT EXISTS office_simulation(
      site TEXT NOT NULL,run TEXT NOT NULL,paused INTEGER NOT NULL DEFAULT 1,PRIMARY KEY(site,run))""")

def install_day(db,site,run,actor):
    scoped(site,actor,'simulate');setup(db)
    r=get_run(db,site,run);state=world(db,site,run)
    if db.execute('SELECT 1 FROM office_simulation WHERE site=? AND run=?',(site,run)).fetchone():return {'installed':False,'reason':'Existing schedule preserved'}
    for key in ['A','B','C','D3','E3','PERSON-CARLOS','KIOSK-01']:
        if key not in state['entities']:raise HTTPException(409,'Migrate the A-E topology first')
    from zoneinfo import ZoneInfo
    zone=ZoneInfo(db.execute('SELECT timezone FROM office_sites WHERE id=?',(site,)).fetchone()[0])
    day=datetime.fromisoformat(r['clock']).astimezone(zone).date().isoformat()
    def at(time):return utc(datetime.fromisoformat(day+'T'+time).replace(tzinfo=zone).isoformat())
    if r['clock']>at('08:00:00'):raise HTTPException(409,'Install the daily script on a new run starting at08:00')
    def add(time,key,action,payload):
        db.execute('INSERT INTO office_schedule(site,run,id,at,action,payload) VALUES(?,?,?,?,?,?)',(site,run,key,at(time),action,encode(payload)))
    def cmd(time,key,op,target='site',**inputs):add(time,key,'command',{'operation':op,'target':target,'inputs':inputs})
    def observe(time,key,camera,tracks):add(time,key,'camera',{'source_id':camera,'tracks':tracks})
    def badge(time,key,camera,local_id,person):add(time,key,'badge',{'camera':camera,'local_id':local_id,'person_id':person})
    # Additional virtual cameras are logical simulation sources, with no invented physical pose.
    configuration=json.loads(db.execute('SELECT config FROM office_sites WHERE id=?',(site,)).fetchone()[0])
    spatial_profile=configuration.get('daily_spatial_profile')
    route_zones=sorted({m['zone_id'] for m in spatial_profile['motions']}) if spatial_profile else []
    changes={}
    for key,zones in [('CAM-05',['ZONE-D','ZONE-E']),('CAM-06',['ZONE-D','ZONE-E']),('CAM-RECEPTION',['RECEPTION','WAITING-AREA'])]:
        item=upsert_resource(db,site,key,'Camera',{'name':key+' · fuente sintética','virtual':True,'covered_zones':zones+route_zones,'connectivity':'connected','position':None,'spatial_mapping':'not-calibrated','coverage_mode':'synthetic-fixture-not-geometric-visibility'})
        changes[key]=item
        stream=upsert_resource(db,site,'STREAM-'+key,'Stream',{'camera_id':key,'type':'synthetic-observations','video_recorded':False});changes[stream['id']]=stream
        db.execute('INSERT OR IGNORE INTO office_bindings VALUES(?,?,?,?,?)',(site,key,'simulated','1.0','{}'))
    sensor=upsert_resource(db,site,'SENSOR-MEETING','Sensor',{'name':'Ambiente simulado · mesa de reuniones','virtual':True,'zone_id':'annotation-1','position':None,'physical_device_verified':False,'spatial_mapping':'logical-zone-only'})
    changes[sensor['id']]=sensor
    db.execute('INSERT OR IGNORE INTO office_bindings VALUES(?,?,?,?,?)',(site,sensor['id'],'simulated','1.0','{}'))
    changes['PERSON-DANIEL']=upsert_resource(db,site,'PERSON-DANIEL','Person',{'name':'Daniel','profile_level':'visitor','fictitious':True,'known_fields':['name','invitation'],'presence':'unknown'})
    emit(db,site,run,'main',r['clock'],'simulation.configured',actor['actor'],changes,{'daily_script':'coworking-v2','geometry_claimed':False})
    if spatial_profile:
        from .spatial import install_daily_profile
        install_daily_profile(db,site,run,actor,spatial_profile)
    book='B-LUIS-'+run;morning='M-MORNING-'+run;meeting='M-1600-'+run;invite='I-DANIEL-'+run;conversation='C-DANIEL-'+run
    cmd('08:00:00','book-luis','booking.create','D3',booking_id=book,person_id='PERSON-LUIS',starts_at=at('09:15:00'),ends_at=at('18:00:00'))
    cmd('08:00:00','book-no-show','booking.create','D4',booking_id='B-NOSHOW-'+run,person_id='PERSON-LUIS',starts_at=at('09:00:00'),ends_at=at('10:00:00'))
    cmd('08:00:00','book-morning','booking.create','MEETING-AREA-01',booking_id='B-MORNING-'+run,person_id='PERSON-CARLOS',starts_at=at('10:30:00'),ends_at=at('11:30:00'),party_size=6,meeting_id=morning)
    cmd('08:00:00','book-following','booking.create','MEETING-AREA-01',booking_id='B-FOLLOWING-'+run,person_id='PERSON-MARTIN',starts_at=at('11:30:00'),ends_at=at('12:30:00'),party_size=6)
    guests=[{'id':'I-UNKNOWN-'+str(i)+'-'+run} for i in range(3)]+[{'id':invite,'name':'Daniel'}]
    cmd('08:00:00','book-daniel','booking.create','MEETING-AREA-01',booking_id='B-1600-'+run,person_id='PERSON-CARLOS',starts_at=at('16:00:00'),ends_at=at('17:00:00'),party_size=5,meeting_id=meeting,expected_guests=guests)
    for group in ['D','E']:cmd('08:00:00','power-on-'+group,'device.setPower','HVAC-'+group,on=True)
    for group in ['D','E']:
        for name,value,unit in [('temperature',23,'C'),('humidity',48,'percent'),('illuminance',450,'lux'),('co2',650,'ppm')]:
            add('08:01:00','baseline-'+group+'-'+name,'sensor',{'source_id':'SENSOR-'+group,'name':name,'value':value,'unit':unit})
    corridor_zone=next((m['zone_id'] for m in spatial_profile['motions'] if m['person_id']=='PERSON-LUIS'),'ZONE-D') if spatial_profile else 'ZONE-D'
    luis=[{'local_track_id':'luis-badge-session','zone_id':corridor_zone,'position':[.4,.6]}]
    observe('09:15:00','luis-anonymous','CAM-05',luis)
    badge('09:15:05','luis-identify','CAM-05','luis-badge-session','PERSON-LUIS')
    cmd('09:15:10','luis-book-checkin','booking.checkin',book)
    luis=[{**p,'zone_id':'ZONE-D'} for p in luis]
    observe('09:16:00','luis-camera-two','CAM-06',luis)
    badge('09:16:05','luis-authorized-handoff','CAM-06','luis-badge-session','PERSON-LUIS')
    cmd('09:20:00','no-show','booking.no_show','B-NOSHOW-'+run)
    people=['PERSON-CARLOS','PERSON-ANA','PERSON-DIEGO','PERSON-VALERIA','PERSON-TOMAS','PERSON-ELENA']
    tracks=[{'local_track_id':p,'zone_id':'annotation-1','position':[.15+i*.12,.5]} for i,p in enumerate(people)]
    observe('10:30:00','morning-occupancy','CAM-02',tracks)
    for i,p in enumerate(people):badge('10:30:00','morning-badge-'+str(i),'CAM-02',p,p)
    cmd('10:30:00','morning-start','meeting.start',morning,participants=people)
    add('10:35:00','co2-meeting','sensor',{'source_id':'SENSOR-MEETING','name':'co2','value':1300,'unit':'ppm'})
    add('11:20:00','extension-conflict','expected_conflict',{'operation':'booking.extend','target':'B-MORNING-'+run,'inputs':{'ends_at':at('12:00:00')}})
    cmd('11:21:00','alternative','booking.reassign','B-FOLLOWING-'+run,resource_id='B')
    cmd('11:21:01','morning-extended','booking.extend','B-MORNING-'+run,ends_at=at('12:00:00'))
    cmd('11:21:02','alternative-notification','notification.send','PERSON-MARTIN',message='La reserva fue reasignada al ambiente privado B por conflicto confirmado.')
    cmd('12:00:00','morning-end','meeting.end',morning)
    observe('12:00:01','meeting-empty','CAM-02',[])
    observe('14:00:00','luis-afternoon','CAM-05',luis)
    badge('14:00:00','luis-afternoon-badge','CAM-05','luis-badge-session','PERSON-LUIS')
    cmd('14:00:01','hvac-failure','equipment.fail','HVAC-D')
    add('14:00:02','heat','sensor',{'source_id':'SENSOR-D','name':'temperature','value':30,'unit':'C'})
    cmd('14:01:00','reassign-luis','booking.reassign',book,resource_id='E3')
    task='task-'+identity('schedule',site,run,'hvac-failure')
    cmd('14:01:01','assign-technician','task.assign',task,person_id='PERSON-MATEO')
    cmd('14:10:00','repair','equipment.repair','HVAC-D')
    cmd('14:10:01','resolve-ticket','task.resolve',task,resolution='Intervención sintética verificada, sin equipo físico.')
    add('14:11:00','comfort-restored','sensor',{'source_id':'SENSOR-D','name':'temperature','value':23,'unit':'C'})
    unknown=[{'local_track_id':'unknown-'+str(i),'zone_id':'RECEPTION','position':[.2+i*.2,.6]} for i in range(3)]
    observe('15:45:00','unknown-arrivals','CAM-RECEPTION',unknown)
    for i in range(3):
        track='track-'+identity(site,'CAM-RECEPTION','unknown-'+str(i))
        cmd('15:46:00','unknown-register-'+str(i),'visit.register',visit_id='VISIT-'+str(i)+'-'+run,meeting_id=meeting,track_id=track,statement='Declaración: reunión con Entity16:00; identidad individual desconocida')
        cmd('15:48:00','unknown-wait-'+str(i),'visit.checkin','VISIT-'+str(i)+'-'+run,waiting_area='WAITING-AREA')
    host=[{'local_track_id':'host-a','zone_id':'annotation-0','position':[.4,.5]}]
    observe('15:49:55','host-presence','CAM-01',host)
    badge('15:49:56','host-badge','CAM-01','host-a','PERSON-CARLOS')
    cmd('15:50:00','kiosk-start','reception.interact','KIOSK-01',conversation_id=conversation,action='start',invitation_id=invite)
    add('15:50:01','kiosk-checkin','kiosk_checkin',{'conversation_id':conversation,'invitation_id':invite,'person_id':'PERSON-DANIEL'})
    add('15:50:02','host-five-minutes','host_reply',{'conversation_id':conversation,'response':'wait','minutes':5})
    observe('15:55:00','host-refresh','CAM-01',host)
    badge('15:55:01','host-refresh-badge','CAM-01','host-a','PERSON-CARLOS')
    add('15:55:02','host-ready','host_reply',{'conversation_id':conversation,'response':'ready'})
    for i in range(3):cmd('15:55:03','escort-'+str(i),'access.requestEntry','ACCESS-01',visit_id='VISIT-'+str(i)+'-'+run,escorted=True)
    observe('16:00:00','meeting-occupancy','CAM-02',[{'local_track_id':'carlos-room','zone_id':'annotation-1','position':[.2,.5]}]+[{'local_track_id':'guest-'+str(i),'zone_id':'annotation-1','position':[.35+i*.12,.6]} for i in range(4)])
    badge('16:00:00','host-meeting-badge','CAM-02','carlos-room','PERSON-CARLOS')
    cmd('16:00:00','meeting-start','meeting.start',meeting,participants=['PERSON-CARLOS']+['VISIT-'+str(i)+'-'+run for i in range(3)])
    cmd('16:01:00','security-denied','access.requestEntry','ACCESS-01')
    cmd('17:00:00','meeting-end','meeting.end',meeting)
    observe('17:00:01','afternoon-empty','CAM-02',[])
    for camera in ['CAM-05','CAM-06','CAM-RECEPTION']:observe('18:30:00','empty-'+camera,camera,[])
    for person in ['PERSON-LUIS','PERSON-CARLOS']:cmd('18:30:00','departure-'+person,'presence.checkout',person)
    for group in ['D','E']:cmd('18:30:00','power-off-'+group,'device.setPower','HVAC-'+group,on=False)
    db.execute('INSERT INTO office_simulation VALUES(?,?,1)',(site,run))
    return {'installed':True,'milestones':db.execute('SELECT COUNT(*) FROM office_schedule WHERE site=? AND run=?',(site,run)).fetchone()[0],'script':'coworking-v2','geometry_validated':False}

def advance(db,site,run,actor,to):
    scoped(site,actor,'simulate');setup(db);to=utc(to);r=get_run(db,site,run)
    if to<r['clock']:raise HTTPException(409,'No rewind of persistent history; reconstruct or replay in a new run')
    rows=db.execute("SELECT * FROM office_schedule WHERE site=? AND run=? AND status='pending' AND at<=? ORDER BY at,rowid",(site,run,to)).fetchall()
    if any(row['at']<r['clock'] for row in rows):raise HTTPException(409,'Pending milestones precede the clock; replay in a new run')
    outcomes=[]
    def execute(body,character=None):
        principal=actor if not character else {'actor':'synthetic-character:'+character,'site':site,'role':'member','person':character,'permissions':ROLES['member']}
        return command(db,site,run,principal,body)
    for row in rows:
        stamp=row['at'];cid=identity('schedule',site,run,row['id']);payload=json.loads(row['payload']);action=row['action']
        db.execute('UPDATE office_runs SET clock=? WHERE site=? AND id=?',(stamp,site,run))
        if action in ['command','expected_conflict']:
            if action=='expected_conflict':
                db.execute('SAVEPOINT expected_conflict')
                try:
                    execute({'id':cid,**payload})
                    raise HTTPException(500,'Expected conflict was not detected')
                except HTTPException as exc:
                    db.execute('ROLLBACK TO expected_conflict');db.execute('RELEASE expected_conflict')
                    if exc.status_code!=409:raise
                    result=emit(db,site,run,'main',stamp,'simulation.expected_conflict',actor['actor'],{}, {'status':409,'operation':payload['operation'],'target':payload['target'],'reason':exc.detail,'simulated':True})
            else:result=execute({'id':cid,**payload})
        elif action in ['camera','sensor']:
            source=payload['source_id']
            observation={'observation_id':cid,'site_id':site,'source_id':source,'observed_at':stamp,
                'type':'edge.presence' if action=='camera' else 'sensor.measurement','provenance':{'connector_id':'simulated','model_version':'office-daily-v2','simulated':True},
                'payload':{'source_status':'connected','tracks':payload['tracks'],'transitions':[]} if action=='camera' else {k:v for k,v in payload.items() if k!='source_id'}}
            result=ingest(db,site,run,actor,Observation.model_validate(observation))
        elif action=='badge':
            track='track-'+identity(site,payload['camera'],payload['local_id'])
            result=execute({'id':cid,'operation':'identity.associate','target':track,'inputs':{'person_id':payload['person_id'],'credential_verified':True,'evidence_type':'badge-checkin'}})
        elif action=='kiosk_checkin':
            code='SYNTHETIC-'+str(r['seed'])+'-'+run
            issue_credential(db,site,payload['invitation_id'],payload['person_id'],code,(datetime.fromisoformat(stamp)+timedelta(hours=2)).isoformat())
            result=execute({'id':cid,'operation':'reception.interact','target':'KIOSK-01','inputs':{'conversation_id':payload['conversation_id'],'action':'check_in','verification_code':code}})
        elif action=='host_reply':
            conversation=world(db,site,run)['entities'].get(payload['conversation_id'],{})
            if conversation.get('last_reply_origin') not in [None,'synthetic-character'] or conversation.get('status') not in ['awaiting_host','waiting_host']:
                result=emit(db,site,run,'main',stamp,'simulation.synthetic_reply_superseded',actor['actor'],{}, {'conversation_id':payload['conversation_id'],'reason':'authenticated participant input takes precedence; no synthetic reply delivered'})
            else:result=execute({'id':cid,'operation':'intercom.reply','target':'INTERCOM-A','inputs':payload},'PERSON-CARLOS')
        else:raise HTTPException(422,'Unknown daily script action')
        db.execute("UPDATE office_schedule SET status='done',result=? WHERE site=? AND run=? AND id=?",(encode(result),site,run,row['id']))
        outcomes.append({'id':row['id'],'at':stamp,'status':result.get('status','recorded')})
    if to!=get_run(db,site,run)['clock']:
        command(db,site,run,actor,{'id':identity('schedule-clock',site,run,to),'operation':'clock.advance','target':'site','inputs':{'to':to}})
    return {'clock':to,'steps':outcomes,'pending':db.execute("SELECT COUNT(*) FROM office_schedule WHERE site=? AND run=? AND status='pending'",(site,run)).fetchone()[0],'world_revision':world(db,site,run)['revision']}
