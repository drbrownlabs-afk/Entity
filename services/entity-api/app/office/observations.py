import hashlib,json
from datetime import datetime,timedelta
from fastapi import HTTPException
from app.connectors import Observation
from app.edge_projection import Snapshot
from app.nucleo.capabilities import normalize_sensor
from .storage import utc,world,emit,identity,encode
from .service import resource,upsert_resource
from .auth import scoped


def ingest(db,site,run,actor,message:Observation):
    scoped(site,actor,'observe')
    if message.site_id!=site:raise HTTPException(403,'Observation site mismatch')
    source=resource(db,site,message.source_id)
    if actor['role']=='connector' and actor['person']!=message.source_id:raise HTTPException(403,'Connector is bound to another source')
    state=world(db,site,run);items=state['entities'];clock=state['clock'];at=utc(message.observed_at.isoformat())
    if datetime.fromisoformat(at)>datetime.fromisoformat(clock)+timedelta(seconds=120):raise HTTPException(422,'Observation too far ahead of site clock')
    body=message.model_dump_json();oid=str(message.observation_id)
    previous=db.execute('SELECT body,result FROM office_inbox WHERE site=? AND run=? AND id=?',(site,run,oid)).fetchone()
    if previous:
        if previous['body']!=body:raise HTTPException(409,'Observation ID conflict')
        return {**json.loads(previous['result']),'duplicate':True}
    binding=db.execute('SELECT * FROM office_bindings WHERE site=? AND source=?',(site,message.source_id)).fetchone()
    if not binding or binding['adapter'] not in ['simulated','rest-test','video-test','mqtt-test']:raise HTTPException(403,'Source adapter not enrolled')
    if json.loads(binding['config']).get('available') is False:raise HTTPException(503,'Source adapter unavailable')
    if binding['version']!='1.0':raise HTTPException(409,'Adapter version mismatch')
    if message.provenance.connector_id!=binding['adapter']:raise HTTPException(403,'Adapter provenance mismatch')
    current=items.get(message.source_id,{})
    late=at<current.get('observed_at','')
    changes={};details={'observation_id':oid,'source_id':message.source_id,'type':message.type,'provenance':message.provenance.model_dump(),'payload':message.payload,'late':late}
    if message.type=='edge.presence':
        if source['kind']!='Camera':raise HTTPException(422,'Camera observation requires Camera')
        if current.get('connectivity')=='disconnected':raise HTTPException(503,'Camera disconnected; observations unavailable')
        try:snapshot=Snapshot.model_validate(message.payload)
        except ValueError:raise HTTPException(422,'Invalid camera snapshot')
        if len({x.local_track_id for x in snapshot.tracks})!=len(snapshot.tracks):raise HTTPException(422,'Duplicate track ID')
        if snapshot.source_status!='connected' and snapshot.tracks:raise HTTPException(422,'Disconnected snapshot cannot report tracks')
        allowed=current.get('covered_zones',[])
        if any(track.zone_id and track.zone_id not in allowed for track in snapshot.tracks):raise HTTPException(422,'Zone outside declared camera coverage')
        if not late:
            changes[message.source_id]={'observed_at':at,'connectivity':snapshot.source_status,'last_observation_id':oid,'ttl_seconds':30,'tracks':[]}
            active=set()
            for track in snapshot.tracks:
                key='track-'+identity(site,message.source_id,track.local_track_id)
                active.add(key)
                old=items.get(key,{})
                if not old:old=upsert_resource(db,site,key,'Track',{'camera_id':message.source_id,'local_track_id':track.local_track_id})
                patch={**old,'active':True,'zone_id':track.zone_id,'image_position':list(track.position),'coordinate_frame':'normalized-image','observed_at':at,'ttl_seconds':30,'observation_id':oid,'provenance':message.provenance.model_dump()}
                changes[key]=patch;changes[message.source_id]['tracks'].append(key)
                if old.get('person_id') and at<=old.get('association_until',''):
                    changes[old['person_id']]={'presence':'confirmed','zone_id':track.zone_id,'observed_at':at,'ttl_seconds':30,'last_observation_id':oid,'track_id':key}
            for key,old in items.items():
                if old.get('kind')=='Track' and old.get('camera_id')==message.source_id and key not in active:changes[key]={'active':False,'last_seen_at':old.get('observed_at')}
            # Occupancy of a zone is a measurement, independent of booking or identity.
            for zone in allowed:
                resource(db,site,zone)
                count=sum(track.zone_id==zone for track in snapshot.tracks)
                changes[zone]={'occupancy':count,'observed_at':at,'ttl_seconds':30,'occupancy_source':message.source_id,'last_observation_id':oid}
    elif message.type=='sensor.measurement':
        if source['kind'] not in ['Sensor','HVAC','Equipment']:raise HTTPException(422,'Sensor source required')
        data=normalize_sensor(message.payload)
        if not late:
            changes[message.source_id]={'measurement':data,'observed_at':at,'ttl_seconds':120,'last_observation_id':oid}
            zone=current.get('zone_id')
            if zone:
                resource(db,site,zone)
                changes[zone]={'environment':{**items.get(zone,{}).get('environment',{}),data['name']:{'value':data['value'],'unit':data['unit'],'observed_at':at,'observation_id':oid,'source_id':message.source_id}}}
    else:raise HTTPException(422,'Unsupported observation semantics; raw video is not a detection')
    event=emit(db,site,run,'main',at,'observation.received',actor['actor'],changes,details,[oid],oid)
    result={'duplicate':False,'late':late,'event':event,'source_id':message.source_id}
    db.execute('INSERT INTO office_inbox VALUES(?,?,?,?,?)',(site,run,oid,body,encode(result)))
    return result
