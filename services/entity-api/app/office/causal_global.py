"""Append-only revisions of anonymous hypotheses, backed by available frames.

Core checks provenance and time. Appearance/geometric decisions belong to Edge;
this contract never treats a hypothesis as a civil identity or a world position.
"""
import json
from datetime import datetime, timezone
from typing import Literal
from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict, Field
from .storage import identity, utc, now


class Member(BaseModel):
    model_config=ConfigDict(extra='forbid')
    source_id: str=Field(min_length=1,max_length=128)
    stream_session_id: str=Field(min_length=1,max_length=80)
    local_track_id: str=Field(min_length=1,max_length=128)
    evidence_observation_ids: list[str]=Field(min_length=1,max_length=128)


class Revision(BaseModel):
    model_config=ConfigDict(extra='forbid')
    global_track_id: str=Field(min_length=1,max_length=128)
    expected_revision: int=Field(ge=0)
    status: Literal['candidate','corroborated','uncertain','retracted']
    members: list[Member]=Field(min_length=1,max_length=128)
    supersedes: list[str]=Field(default_factory=list,max_length=128)
    reason: str=Field(min_length=1,max_length=500)
    method: Literal['osnet-ain-static-graph-constrained-incremental']
    model_sha256: str=Field(pattern='^[a-f0-9]{64}$')
    graph_sha256: str=Field(pattern='^[a-f0-9]{64}$')
    calibration_sha256: str=Field(pattern='^[a-f0-9]{64}$')
    execution_mode: Literal['causal-incremental']
    clock_domain: Literal['live-utc','paced-replay-utc']


def associate_incremental(db,site,run,items,actor,message,at):
    if actor['role']!='admin':raise HTTPException(403,'Global inference requires authorized pipeline operator')
    try:data=Revision.model_validate(message.payload)
    except ValueError:raise HTTPException(422,'Invalid causal hypothesis revision')
    if data.clock_domain=='live-utc' and (message.observed_at-datetime.now(timezone.utc)).total_seconds()>2:
        raise HTTPException(422,'Live decision ahead of server clock')
    gid=data.global_track_id;prior=items.get(gid,{})
    if not gid.startswith(run+':'):raise HTTPException(422,'Global hypothesis must be run-namespaced')
    if prior and (prior.get('track_scope')!='global' or prior.get('execution_mode')!='causal-incremental'):
        raise HTTPException(409,'Hypothesis ID conflicts with another resource')
    if prior.get('hypothesis_revision',0)!=data.expected_revision or prior.get('alias_of'):
        raise HTTPException(409,'Stale or superseded hypothesis revision')
    if len(set(data.supersedes))!=len(data.supersedes) or gid in data.supersedes:
        raise HTTPException(422,'Invalid hypothesis aliases')
    locals_={};sources=set();refs=[];stamps=[];frames={}
    # Validate immutable evidence in bounded indexed reads instead of reopening
    # the same inbox row for each member/reference on the Windows-backed DB.
    ids=sorted({oid for m in data.members for oid in m.evidence_observation_ids});inbox={}
    for start in range(0,len(ids),128):
        chunk=ids[start:start+128];marks=','.join('?' for _ in chunk)
        for r in db.execute('SELECT id,body FROM office_inbox WHERE site=? AND run=? AND id IN ('+marks+')',
                            (site,run,*chunk)):inbox[r[0]]=json.loads(r[1])
    for member in data.members:
        key='track-'+identity(site,member.source_id,member.stream_session_id,member.local_track_id)
        if key in locals_:raise HTTPException(422,'Duplicate local member')
        local=items.get(key,{})
        if local.get('kind')!='Track' or local.get('stream_session_id')!=member.stream_session_id:
            raise HTTPException(422,'Member is not an observed session-local track')
        if len(set(member.evidence_observation_ids))!=len(member.evidence_observation_ids):
            raise HTTPException(422,'Duplicate member evidence')
        for oid in member.evidence_observation_ids:
            if oid not in inbox:raise HTTPException(422,'Evidence missing in this run')
            obs=inbox[oid];p=obs['payload']
            matches=[t for t in p.get('tracks',[]) if t['local_track_id']==member.local_track_id]
            if (obs['type']!='edge.causal_presence' or obs['source_id']!=member.source_id
                or p.get('stream_session_id')!=member.stream_session_id or len(matches)!=1
                or p.get('calibration_sha256')!=data.calibration_sha256):
                raise HTTPException(422,'Evidence does not support claimed sensor/session/calibration/member')
            track=matches[0];capture=utc(obs['observed_at']);available=utc(p['known_at'])
            confirmed=utc(track.get('association_confirmed_at') or capture)
            if max(capture,available,confirmed)>at:raise HTTPException(422,'Hypothesis uses unavailable future evidence')
            frame=(member.source_id,member.stream_session_id,p['frame_index'])
            if frame in frames and frames[frame]!=key:raise HTTPException(422,'Distinct same-frame local tracks cannot be merged')
            frames[frame]=key;refs.append(oid);stamps.append(capture)
        locals_[key]=local;sources.add(member.source_id)
    if message.source_id not in sources:raise HTTPException(422,'Decision source must contribute evidence')
    # A revision carries the cumulative membership. Removing evidence requires an
    # explicit retraction, never silently rewriting the established component.
    required=set(prior.get('local_track_ids',[]))
    for old_id in data.supersedes:
        old=items.get(old_id,{})
        if (old.get('execution_mode')!='causal-incremental' or old.get('track_scope')!='global'
            or old.get('alias_of') or old.get('hypothesis_status')=='retracted'):
            raise HTTPException(422,'Alias must reference a current causal hypothesis')
        required.update(old.get('local_track_ids',[]))
    if not required<=locals_.keys():raise HTTPException(422,'Revision omitted existing members')
    if any(local.get('global_track_id') not in {None,gid,*data.supersedes} for local in locals_.values()):
        raise HTTPException(409,'Member belongs to another hypothesis; explicit merge required')
    from .service import upsert_resource
    item=prior or upsert_resource(db,site,gid,'Track',{'track_scope':'global'})
    revision=data.expected_revision+1
    provenance={**data.model_dump(exclude={'members'}),'observation_id':str(message.observation_id),
                'evidence_available_at':at,'probability_calibrated':False,'civil_identity_verified':False}
    changes={}
    for key,local in locals_.items():
        relations=[dict(r) for r in local.get('relations',[])]
        for rel in relations:
            if rel['type']=='provisionallySameVisualSubject' and not rel.get('valid_to'):rel['valid_to']=at
        if data.status!='retracted':relations.append({'type':'provisionallySameVisualSubject','target':gid,
            'valid_from':at,'valid_to':None,'provenance':provenance})
        changes[key]={'relations':relations,'global_track_id':gid if data.status!='retracted' else None,
                      'visual_identity_status':data.status,'civil_identity_verified':False}
    for old_id in data.supersedes:
        changes[old_id]={'alias_of':gid,'hypothesis_status':'superseded','superseded_at':at,
                         'hypothesis_revision':items[old_id]['hypothesis_revision']+1,'active':False,
                         'relations':list(items[old_id].get('relations',[]))+[{'type':'supersededBy','target':gid,
                            'valid_from':at,'valid_to':None,'provenance':provenance}]}
    summary={'type':'causal_visual_hypothesis_revision',**provenance,'revision':revision,
             'evidence_observation_ids':sorted(set(refs)),'local_track_ids':sorted(locals_),
             'first_visual_evidence_at':min(stamps),'last_visual_evidence_at':max(stamps),'location_status':'unknown'}
    mid=identity('causal-visual-memory',site,run,str(message.observation_id),gid)
    db.execute('INSERT INTO memories VALUES(?,?,?,?,?,?)',(mid,item['core_id'],json.dumps(summary,sort_keys=True),
               'causal pixel inference; explicit source evidence',now(),'1.0'))
    from app.main import append_event
    append_event(db,item['core_id'],'memory.recorded',{'memory_id':mid},'pixel-perception')
    changes[gid]={**item,'track_scope':'global','execution_mode':'causal-incremental','global_tracking_id':gid,
        'hypothesis_revision':revision,'hypothesis_status':data.status,'available_at':at,
        'local_track_ids':sorted(locals_),'source_ids':sorted(sources),'position_status':'unknown',
        'civil_identity_verified':False,'active':False,'last_memory_id':mid,'provenance':provenance}
    return changes
