"""Deterministic poses from immutable, reviewed site routes and the existing Core clock."""
import json,hashlib,math
from datetime import datetime
from fastapi import HTTPException
from pydantic import Field,AwareDatetime,model_validator
from app.schemas import CoreRecord,NonBlank
from .storage import utc,encode,emit,world
from .auth import scoped

class Waypoint(CoreRecord):
    at:AwareDatetime
    position:tuple[float,float,float]
    evidence:NonBlank

class Motion(CoreRecord):
    person_id:NonBlank
    avatar_id:NonBlank
    zone_id:NonBlank
    coordinate_frame:NonBlank
    waypoints:list[Waypoint]=Field(min_length=2,max_length=1000)
    calibration_evidence:NonBlank
    @model_validator(mode='after')
    def ordered(self):
        times=[p.at for p in self.waypoints]
        if times!=sorted(set(times)):raise ValueError('Route times must be strictly increasing')
        return self

class Routes(CoreRecord):
    id:NonBlank
    motions:list[Motion]=Field(min_length=1,max_length=100)

def setup(db):
    db.execute('CREATE TABLE IF NOT EXISTS office_spatial_routes(site TEXT NOT NULL,run TEXT NOT NULL,id TEXT NOT NULL,registered_at TEXT NOT NULL,fingerprint TEXT NOT NULL,body TEXT NOT NULL,registered_seq INTEGER NOT NULL,PRIMARY KEY(site,run,id))')

def register(db,site,run,actor,body):
    scoped(site,actor,'simulate');setup(db);state=world(db,site,run)
    content=body.model_dump(mode='json');digest=hashlib.sha256(encode(content).encode()).hexdigest()
    old=db.execute('SELECT fingerprint FROM office_spatial_routes WHERE site=? AND run=? AND id=?',(site,run,body.id)).fetchone()
    if old:
        if old[0]!=digest:raise HTTPException(409,'An immutable route ID cannot be overwritten')
        return {'registered':False,'id':body.id,'fingerprint':digest}
    for motion in body.motions:
        if state['entities'].get(motion.person_id,{}).get('kind')!='Person' or state['entities'].get(motion.zone_id,{}).get('kind')!='Zone':raise HTTPException(422,'Existing site person and zone required')
    event=emit(db,site,run,'main',state['clock'],'simulation.routes_registered',actor['actor'],{}, {'route_id':body.id,'fingerprint':digest,'calibration_evidence':[m.calibration_evidence for m in body.motions],'simulated':True})
    db.execute('INSERT INTO office_spatial_routes VALUES(?,?,?,?,?,?,?)',(site,run,body.id,state['clock'],digest,encode(content),event['sequence']))
    return {'registered':True,'id':body.id,'fingerprint':digest,'event':event}

def project(db,site,run,clock,items,branch='main'):
    exists=db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='office_spatial_routes'").fetchone()
    if not exists:return
    stamp=datetime.fromisoformat(clock)
    base_seq=db.execute('SELECT base_seq FROM office_branches WHERE site=? AND run=? AND id=?',(site,run,branch)).fetchone()[0] if branch!='main' else None
    for row in db.execute('SELECT body FROM office_spatial_routes WHERE site=? AND run=? AND registered_at<=?'+(' AND registered_seq<=?' if base_seq is not None else '')+' ORDER BY registered_seq,id',(site,run,clock,base_seq) if base_seq is not None else (site,run,clock)):
        config=json.loads(row[0])
        for motion in config['motions']:
            person=items.get(motion['person_id'])
            if not person:continue
            points=motion['waypoints'];first=datetime.fromisoformat(utc(points[0]['at']));last=datetime.fromisoformat(utc(points[-1]['at']))
            if stamp<first or stamp>last:continue
            pair=next(((a,b) for a,b in zip(points,points[1:]) if datetime.fromisoformat(utc(a['at']))<=stamp<=datetime.fromisoformat(utc(b['at']))),None)
            if not pair:continue
            a,b=pair;start=datetime.fromisoformat(utc(a['at']));end=datetime.fromisoformat(utc(b['at']));t=(stamp-start).total_seconds()/(end-start).total_seconds()
            position=[x+(y-x)*t for x,y in zip(a['position'],b['position'])]
            dx,dz=b['position'][0]-a['position'][0],b['position'][2]-a['position'][2]
            person['avatar_id']=motion['avatar_id']
            person['spatial_pose']={'position':position,'yaw':math.degrees(math.atan2(dx,dz)),'animation':'walk','animation_time':(stamp-first).total_seconds(),
                'coordinate_frame':motion['coordinate_frame'],'validated':True,'pose_kind':'simulated-route-reconstruction','physical_identity_claimed':False,
                'zone_id':motion['zone_id'],'route_id':config['id'],'evidence':[a['evidence'],b['evidence']],'calibration_evidence':motion['calibration_evidence']}

class RelativeWaypoint(CoreRecord):
    offset_seconds:float=Field(ge=0,le=86400)
    position:tuple[float,float,float]
    evidence:NonBlank

class DailyMotion(CoreRecord):
    person_id:NonBlank
    avatar_id:NonBlank
    zone_id:NonBlank
    starts_local:str=Field(pattern=r'^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$')
    waypoints:list[RelativeWaypoint]=Field(min_length=2,max_length=1000)
    calibration_evidence:NonBlank

class DailyProfile(CoreRecord):
    id:NonBlank
    coordinate_frame:NonBlank
    motions:list[DailyMotion]=Field(min_length=1,max_length=100)

def install_daily_profile(db,site,run,actor,profile):
    """Reuse calibrated site data on each new run, using the one Core/site clock."""
    from datetime import timedelta
    from zoneinfo import ZoneInfo
    from .storage import get_run
    profile=DailyProfile.model_validate(profile)
    clock=datetime.fromisoformat(get_run(db,site,run)['clock'])
    zone=ZoneInfo(db.execute('SELECT timezone FROM office_sites WHERE id=?',(site,)).fetchone()[0])
    day=clock.astimezone(zone).date().isoformat();motions=[]
    for motion in profile.motions:
        start=datetime.fromisoformat(day+'T'+motion.starts_local).replace(tzinfo=zone)
        if start<clock:raise HTTPException(409,'Install calibrated daily routes before their first waypoint on a new run')
        motions.append({'person_id':motion.person_id,'avatar_id':motion.avatar_id,'zone_id':motion.zone_id,'coordinate_frame':profile.coordinate_frame,
            'calibration_evidence':motion.calibration_evidence,'waypoints':[{'at':(start+timedelta(seconds=p.offset_seconds)).isoformat(),'position':p.position,'evidence':p.evidence} for p in motion.waypoints]})
    return register(db,site,run,actor,Routes.model_validate({'id':profile.id,'motions':motions}))
