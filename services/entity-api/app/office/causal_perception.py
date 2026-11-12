"""Causal perception contracts: source time and knowledge time are distinct."""
from datetime import datetime, timezone
from typing import Literal
from pydantic import AwareDatetime, Field
from fastapi import HTTPException
from app.edge_projection import Snapshot, Track, Coordinate
from app.schemas import CoreRecord
from app.connectors import Observation
from .storage import utc, get_run, identity, now
from .auth import scoped


class CausalTrack(Track):
    track_status: Literal['candidate','confirmed']
    image_bbox: tuple[Coordinate,Coordinate,Coordinate,Coordinate]
    detection_confidence: float=Field(ge=0,le=1,allow_inf_nan=False)


class CausalSnapshot(Snapshot):
    frame_sha256: str=Field(pattern='^[a-f0-9]{64}$')
    frame_index: int=Field(ge=0)
    tracks: list[CausalTrack]=Field(max_length=128)
    transitions: list[dict]=Field(default_factory=list,max_length=0)
    known_at: AwareDatetime
    stream_session_id: str=Field(min_length=1,max_length=80)
    calibration_sha256: str=Field(pattern='^[a-f0-9]{64}$')
    clock_domain: Literal['live-utc','paced-replay-utc']
    execution_mode: Literal['causal-incremental']


class CausalBundle(CoreRecord):
    observations: list[Observation]=Field(min_length=1,max_length=32)


def prepare_snapshot(message,current):
    try:data=CausalSnapshot.model_validate(message.payload)
    except ValueError:raise HTTPException(422,'Invalid causal camera observation')
    observed=utc(message.observed_at.isoformat());known=utc(data.known_at.isoformat())
    if known<observed:raise HTTPException(422,'Evidence cannot be available before capture')
    if data.clock_domain=='live-utc' and (data.known_at-datetime.now(timezone.utc)).total_seconds()>2:
        raise HTTPException(422,'Live evidence availability is ahead of server clock')
    if current.get('calibration_sha256')!=data.calibration_sha256:
        raise HTTPException(422,'Camera calibration version not enrolled')
    if any(t.association_confirmed_at and utc(t.association_confirmed_at.isoformat())>known for t in data.tracks):
        raise HTTPException(422,'Local association uses future confirmation evidence')
    if any((t.track_status=='confirmed' and not t.association_confirmed_at) or
           (t.track_status=='candidate' and t.association_confirmed_at) for t in data.tracks):
        raise HTTPException(422,'Causal track status and confirmation evidence disagree')
    if current.get('stream_session_id')==data.stream_session_id and data.frame_index<=current.get('frame_index',-1):
        # Delayed evidence is retained, but never rewinds operational state.
        if observed>=current.get('observed_at',''):
            raise HTTPException(409,'Frame sequence cannot repeat or rewind within a stream session')
    payload=data.model_dump(mode='json',exclude={'known_at','stream_session_id','calibration_sha256','clock_domain','execution_mode'})
    return known,payload,data


def relevant_state(db,site,run,message,cache=None):
    """Read only persisted causal resources; never project simulator routes.

    All writes still go through the existing emit/inbox transaction. A source's
    previous active set supplies deactivation; global revisions load every
    referenced member/alias. No process-global cache survives a transaction.
    """
    import json
    state=cache if cache is not None else {}
    if not state:state.update(clock=get_run(db,site,run)['clock'],entities={})
    items=state['entities'];keys={message.source_id}
    def load(ids):
        for key in ids:
            if key in items:continue
            row=db.execute('SELECT body FROM office_state WHERE site=? AND run=? AND branch=? AND entity=?',
                           (site,run,'main',key)).fetchone()
            if row:items[key]=json.loads(row[0])
    load(keys)
    if message.type=='edge.causal_presence':
        # Validate schema before using any caller-provided key in the loader.
        try:data=CausalSnapshot.model_validate(message.payload)
        except ValueError:raise HTTPException(422,'Invalid causal camera observation')
        keys.update(items.get(message.source_id,{}).get('tracks',[]))
        keys.update(items.get(message.source_id,{}).get('covered_zones',[]))
        keys.update('track-'+identity(site,message.source_id,data.stream_session_id,t.local_track_id) for t in data.tracks)
    else:
        from .causal_global import Revision
        try:data=Revision.model_validate(message.payload)
        except ValueError:raise HTTPException(422,'Invalid causal hypothesis revision')
        keys.add(data.global_track_id);keys.update(data.supersedes)
        keys.update('track-'+identity(site,m.source_id,m.stream_session_id,m.local_track_id) for m in data.members)
    load(keys)
    # A late frame may encounter a legitimate prior person association. Load it
    # if present; this adapter does not create a civil identity association.
    load({v['person_id'] for v in list(items.values()) if v.get('person_id')})
    return state


def ingest_bundle(db,site,run,actor,bundle,received_at=None):
    from .observations import ingest
    scoped(site,actor,'observe')
    # Snapshot is loaded at most once. Every message still has its own immutable
    # inbox entry/event/source/time; a bundle is not a stitched sensor.
    cache={};results=[];received_at=received_at or now()
    for message in bundle.observations:
        if message.type not in {'edge.causal_presence','edge.causal_association'}:
            raise HTTPException(422,'Causal bundle cannot import retrospective observation types')
        results.append(ingest(db,site,run,actor,message,state_cache=cache,received_at=received_at))
    return {'results':results,'atomic':True,'observations':len(results),'new_effects':sum(not r['duplicate'] for r in results)}
