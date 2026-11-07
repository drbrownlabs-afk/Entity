"""ENTITY-specific projection of provider-neutral snapshots; no vision dependencies."""
import json
from datetime import datetime, timezone
from uuid import uuid5, NAMESPACE_URL, uuid4
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from typing import Annotated, Literal
from fastapi import HTTPException

Coordinate = Annotated[float,Field(ge=0,le=1,allow_inf_nan=False)]


class Track(BaseModel):
    model_config=ConfigDict(extra='forbid')
    local_track_id: str=Field(min_length=1,max_length=128)
    zone_id: str | None=Field(default=None,max_length=128)
    position: tuple[Coordinate,Coordinate]


class Snapshot(BaseModel):
    model_config=ConfigDict(extra='forbid')
    frame_index: int | None = Field(default=None,ge=0)
    media_time_seconds: float | None = Field(default=None,ge=0,allow_inf_nan=False)
    tracks: list[Track]=Field(max_length=1000)
    transitions: list[dict]=Field(default_factory=list,max_length=2000)
    source_status: Literal['connected','disconnected','eof']


def project(db, observation):
    try:
        snapshot=Snapshot.model_validate(observation.payload)
    except ValidationError:
        raise HTTPException(422,'Invalid edge.presence payload')
    if len({t.local_track_id for t in snapshot.tracks})!=len(snapshot.tracks):
        raise HTTPException(422,'Duplicate local track ID')
    if snapshot.source_status != 'connected' and snapshot.tracks:
        raise HTTPException(422,'Disconnected source cannot report active tracks')
    camera=observation.source_id
    if db.execute('SELECT type FROM entities WHERE id=?',(camera,)).fetchone()[0]!='Camera':
        raise HTTPException(422,'edge.presence source must be a Camera')
    previous=db.execute("SELECT value FROM entity_state WHERE entity_id=? AND key='edge.presence'",(camera,)).fetchone()
    prior=json.loads(previous[0]) if previous else {'tracks':[]}
    if previous and datetime.fromisoformat(prior['observed_at']) >= observation.observed_at:
        return  # retain late observation/event as history; do not rewind current world state
    stamp=observation.observed_at.astimezone(timezone.utc).isoformat()
    simulated=observation.provenance.simulated
    def entity(identity,kind,attributes):
        db.execute('INSERT OR IGNORE INTO entities VALUES(?,?,?,?)',(identity,kind,json.dumps(attributes),stamp))
    def state(identity,key,value):
        db.execute('INSERT INTO entity_state VALUES(?,?,?,?) ON CONFLICT(entity_id,key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
                   (identity,key,json.dumps(value),stamp))
    def identity(track):return 'track:'+str(uuid5(NAMESPACE_URL,camera+':'+track))
    for old in prior['tracks']:
        pid=identity(old['local_track_id'])
        state(pid,'active',False)
        db.execute("DELETE FROM relations WHERE source_id=? AND type='observedIn'",(pid,))
    counts={}
    for track in snapshot.tracks:
        pid=identity(track.local_track_id)
        entity(pid,'PersonTrack',{'camera_id':camera,'local_track_id':track.local_track_id,'simulated':simulated})
        state(pid,'active',True)
        state(pid,'position',{'coordinate_frame':'normalized-image','point':track.position})
        state(pid,'zone_id',track.zone_id)
        if track.zone_id is not None:
            zid='zone:'+str(uuid5(NAMESPACE_URL,camera+':'+track.zone_id))
            entity(zid,'Zone',{'camera_id':camera,'label':track.zone_id,'coordinate_frame':'normalized-image'})
            db.execute('INSERT INTO relations VALUES(?,?,?,?,?)',(str(uuid4()),pid,zid,'observedIn',stamp))
            counts[track.zone_id]=counts.get(track.zone_id,0)+1
    state(camera,'edge.presence',{**snapshot.model_dump(),'observed_at':stamp,'counts':counts,'simulated':simulated})
