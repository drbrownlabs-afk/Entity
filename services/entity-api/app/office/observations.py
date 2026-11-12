import hashlib,json
from datetime import datetime,timedelta
from fastapi import HTTPException
from app.connectors import Observation
from app.edge_projection import Snapshot
from app.nucleo.capabilities import normalize_sensor
from .storage import utc,world,emit,identity,encode,now
from .service import resource,upsert_resource
from .auth import scoped


def ingest(db,site,run,actor,message:Observation,state_cache=None,received_at=None):
    received_at=received_at or now()
    scoped(site,actor,'observe')
    if message.site_id!=site:raise HTTPException(403,'Observation site mismatch')
    source=resource(db,site,message.source_id)
    if actor['role']=='connector' and actor['person']!=message.source_id:raise HTTPException(403,'Connector is bound to another source')
    body=message.model_dump_json();oid=str(message.observation_id)
    previous=db.execute('SELECT body,result FROM office_inbox WHERE site=? AND run=? AND id=?',(site,run,oid)).fetchone()
    if previous:
        if previous['body']!=body:raise HTTPException(409,'Observation ID conflict')
        return {**json.loads(previous['result']),'duplicate':True}
    # Exact duplicates already passed temporal/binding validation. Authorization,
    # site and source checks above still apply; avoid rebuilding the whole world.
    if message.type in {'edge.causal_presence','edge.causal_association'}:
        from .causal_perception import relevant_state
        state=relevant_state(db,site,run,message,state_cache)
    elif state_cache is not None:
        if not state_cache:state_cache.update(world(db,site,run))
        state=state_cache
    else:state=world(db,site,run)
    items=state['entities'];clock=state['clock'];at=utc(message.observed_at.isoformat());event_at=at;snapshot_payload=message.payload;causal=None
    if message.type=='edge.causal_presence':
        from .causal_perception import prepare_snapshot
        event_at,snapshot_payload,causal=prepare_snapshot(message,items.get(message.source_id,{}))
    elif message.type=='edge.causal_association':
        event_at=at
        if message.payload.get('execution_mode')!='causal-incremental':raise HTTPException(422,'Causal association mode required')
    if message.type in {'edge.causal_presence','edge.causal_association'}:
        if event_at<clock:raise HTTPException(422,'Knowledge time cannot rewind the run; late captures need current availability time')
        if event_at>clock:
            db.execute('UPDATE office_runs SET clock=? WHERE site=? AND id=?',(event_at,site,run));clock=event_at;state['clock']=clock
    if datetime.fromisoformat(at)>datetime.fromisoformat(clock)+timedelta(seconds=120):raise HTTPException(422,'Observation too far ahead of site clock')
    binding=db.execute('SELECT * FROM office_bindings WHERE site=? AND source=?',(site,message.source_id)).fetchone()
    if not binding or binding['adapter'] not in ['simulated','rest-test','video-test','mqtt-test']:raise HTTPException(403,'Source adapter not enrolled')
    if json.loads(binding['config']).get('available') is False:raise HTTPException(503,'Source adapter unavailable')
    if binding['version']!='1.0':raise HTTPException(409,'Adapter version mismatch')
    if message.provenance.connector_id!=binding['adapter']:raise HTTPException(403,'Adapter provenance mismatch')
    current=items.get(message.source_id,{})
    late=at<current.get('observed_at','')
    changes={};details={'observation_id':oid,'source_id':message.source_id,'type':message.type,'provenance':message.provenance.model_dump(),'payload':message.payload,'late':late}
    if message.type in {'edge.presence','edge.causal_presence'}:
        if source['kind']!='Camera':raise HTTPException(422,'Camera observation requires Camera')
        if current.get('connectivity')=='disconnected':raise HTTPException(503,'Camera disconnected; observations unavailable')
        try:snapshot=Snapshot.model_validate(snapshot_payload)
        except ValueError:raise HTTPException(422,'Invalid camera snapshot')
        if len({x.local_track_id for x in snapshot.tracks})!=len(snapshot.tracks):raise HTTPException(422,'Duplicate track ID')
        if snapshot.source_status!='connected' and snapshot.tracks:raise HTTPException(422,'Disconnected snapshot cannot report tracks')
        for track in snapshot.tracks:
            if track.association_confirmed_at:
                confirmed=utc(track.association_confirmed_at.isoformat())
                # Initial local-track confirmation can precede later detections;
                # retrospective detections may instead precede confirmation.
                if confirmed>clock:raise HTTPException(422,'Local association confirmation ahead of site clock')
        allowed=current.get('covered_zones',[])
        if any(track.zone_id and track.zone_id not in allowed for track in snapshot.tracks):raise HTTPException(422,'Zone outside declared camera coverage')
        if not late:
            changes[message.source_id]={'observed_at':at,'connectivity':snapshot.source_status,'last_observation_id':oid,'ttl_seconds':30,'tracks':[]}
            if causal:changes[message.source_id].update(evidence_available_at=event_at,stream_session_id=causal.stream_session_id,clock_domain=causal.clock_domain)
            if snapshot.frame_sha256:changes[message.source_id].update(last_frame_sha256=snapshot.frame_sha256,frame_index=snapshot.frame_index,media_time_seconds=snapshot.media_time_seconds)
            active=set()
            for track in snapshot.tracks:
                parts=(site,message.source_id,causal.stream_session_id,track.local_track_id) if causal else (site,message.source_id,track.local_track_id)
                key='track-'+identity(*parts)
                active.add(key)
                old=items.get(key,{})
                if not old:
                    old=upsert_resource(db,site,key,'Track',{'camera_id':message.source_id,'local_track_id':track.local_track_id})
                    if snapshot.frame_sha256:
                        from .perception import remember_first_frame
                        old['last_memory_id']=remember_first_frame(db,site,run,old,message,at)
                patch={**old,'active':True,'zone_id':track.zone_id,'image_position':list(track.position),'coordinate_frame':'normalized-image','observed_at':at,'ttl_seconds':30,'observation_id':oid,'provenance':message.provenance.model_dump()}
                if track.image_bbox is not None:patch['image_bbox']=list(track.image_bbox)
                if track.detection_confidence is not None:patch['detection_confidence']=track.detection_confidence
                if track.association_confirmed_at:patch['association_confirmed_at']=utc(track.association_confirmed_at.isoformat())
                if track.track_status:patch['track_status']=track.track_status
                if snapshot.frame_sha256:patch['frame_sha256']=snapshot.frame_sha256
                if causal:patch.update(evidence_available_at=event_at,stream_session_id=causal.stream_session_id,identity_status='anonymous camera-local',world_location_status='unknown' if track.zone_id is None else 'observed-zone')
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
    elif message.type=='edge.track_association':
        from .perception import associate
        changes=associate(db,site,run,items,actor,message,at)
    elif message.type=='edge.global_track_association':
        from .global_perception import associate_global
        changes=associate_global(db,site,run,items,actor,message,at)
    elif message.type=='edge.causal_association':
        from .causal_global import associate_incremental
        changes=associate_incremental(db,site,run,items,actor,message,event_at)
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
    if message.type in {'edge.causal_presence','edge.causal_association'}:details.update(source_observed_at=at,evidence_available_at=event_at,received_at=received_at,execution_mode='causal-incremental')
    causal_type=message.type in {'edge.causal_presence','edge.causal_association'}
    event=emit(db,site,run,'main',event_at,'observation.received',actor['actor'],changes,details,[oid],oid,
               transaction_state=items if causal_type else None)
    result={'duplicate':False,'late':late,'event':event,'source_id':message.source_id}
    db.execute('INSERT INTO office_inbox VALUES(?,?,?,?,?)',(site,run,oid,body,encode(result)))
    if state_cache is not None and not causal_type:
        for key in changes:
            row=db.execute('SELECT body FROM office_state WHERE site=? AND run=? AND branch=? AND entity=?',(site,run,'main',key)).fetchone()
            if row:state_cache['entities'][key]=json.loads(row[0])
    return result
