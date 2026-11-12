"""Validate global anonymous tracking hypotheses against persisted pixel evidence.

Core validates provenance/contracts; it does not rerun vision or consume simulator
truth. Global identity is inferred; image observations remain source-local.
"""
import json
from typing import Literal
from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict, Field
from .storage import identity, now, utc


class Member(BaseModel):
    model_config=ConfigDict(extra='forbid')
    track_id:str=Field(min_length=1,max_length=128)
    evidence_observation_ids:list[str]=Field(min_length=1,max_length=5000)


class GlobalAssociation(BaseModel):
    model_config=ConfigDict(extra='forbid')
    global_track_id:str=Field(min_length=1,max_length=128)
    members:list[Member]=Field(min_length=1,max_length=1000)
    method:Literal['osnet-ain-static-graph-constrained-mtmc']
    model_sha256:str=Field(pattern='^[a-f0-9]{64}$')
    graph_sha256:str=Field(pattern='^[a-f0-9]{64}$')
    calibration_sha256:str=Field(pattern='^[a-f0-9]{64}$')
    association_output_sha256:str=Field(pattern='^[a-f0-9]{64}$')
    execution_mode:Literal['offline-full-corpus']
    provisional:Literal[True]=True
    probability_calibrated:Literal[False]=False
    gap_location_status:Literal['unknown']= 'unknown'


def associate_global(db,site,run,items,actor,message,at):
    if actor['role']!='admin':raise HTTPException(403,'Global inference requires authorized pipeline operator')
    try:data=GlobalAssociation.model_validate(message.payload)
    except ValueError:raise HTTPException(422,'Invalid global inference; no civil identity or world pose accepted')
    if not data.global_track_id.startswith(run+':'):raise HTTPException(422,'Global hypothesis must be run-namespaced')
    if len({m.track_id for m in data.members})!=len(data.members):raise HTTPException(422,'Duplicate local member')
    prior=items.get(data.global_track_id,{})
    if prior and (prior.get('kind')!='Track' or prior.get('track_scope')!='global'):
        raise HTTPException(409,'Global ID conflicts with another resource')
    # Validate everything before creating resources, links or memories.
    sources=set();stamps=[];evidence_ids=[]
    for member in data.members:
        track=items.get(member.track_id,{})
        if track.get('kind')!='Track' or track.get('track_scope')=='global' or not track.get('camera_id'):
            raise HTTPException(422,'Global members must be observed camera-local Tracks')
        if len(set(member.evidence_observation_ids))!=len(member.evidence_observation_ids):
            raise HTTPException(422,'Duplicate member evidence')
        for oid in member.evidence_observation_ids:
            row=db.execute('SELECT body FROM office_inbox WHERE site=? AND run=? AND id=?',(site,run,oid)).fetchone()
            if not row:raise HTTPException(422,'Global evidence missing in this run')
            obs=json.loads(row[0]);payload=obs['payload']
            candidates=[t for t in payload.get('tracks',[]) if t['local_track_id']==track['local_track_id']]
            if obs['type']!='edge.presence' or obs['source_id']!=track['camera_id'] or len(candidates)!=1 or not payload.get('frame_sha256'):
                raise HTTPException(422,'Global evidence does not support claimed source/local track')
            stamp=utc(obs['observed_at']);confirmed=utc(candidates[0].get('association_confirmed_at') or stamp)
            if max(stamp,confirmed)>at:raise HTTPException(422,'Global inference cannot use future observation/confirmation evidence')
            stamps.append(stamp);evidence_ids.append(oid)
        sources.add(track['camera_id'])
    if message.source_id not in sources:raise HTTPException(422,'Global inference source must contribute evidence')
    from .service import upsert_resource
    global_item=prior or upsert_resource(db,site,data.global_track_id,'Track',{'track_scope':'global'})
    provenance={'observation_id':str(message.observation_id),'source_id':message.source_id,
                'connector':message.provenance.model_dump(),
                **data.model_dump(exclude={'members'}),'member_count':len(data.members),
                'evidence_reference_semantics':'full validated member references in persistent observation inbox/event'}
    links=[];changes={}
    for member in data.members:
        local=items[member.track_id];relations=list(local.get('relations',[]))
        relation={'type':'provisionallySameVisualSubject','target':data.global_track_id,'valid_from':at,
                  'valid_to':None,'provenance':provenance}
        if not any(r['type']==relation['type'] and r['target']==data.global_track_id and not r.get('valid_to') for r in relations):relations.append(relation)
        changes[member.track_id]={'relations':relations,'global_track_id':data.global_track_id,'visual_identity_status':'inferred anonymous; civil identity unknown'}
        links.append({'type':'representedBy','target':member.track_id,'valid_from':at,'valid_to':None,
                      'provenance':{'observation_id':str(message.observation_id),'provisional':True}})
    summary={'type':'global_visual_identity_inference','method':data.method,'model_sha256':data.model_sha256,
             'graph_sha256':data.graph_sha256,'association_output_sha256':data.association_output_sha256,
             'evidence_observation_ids':sorted(set(evidence_ids)),'local_track_ids':[m.track_id for m in data.members],
             'first_visual_evidence_at':min(stamps),'last_visual_evidence_at':max(stamps),
             'association_evidence_at':at,'civil_identity_verified':False,'location_status':'unknown'}
    from app.main import append_event
    mid=identity('global-visual-inference-memory',site,run,str(message.observation_id),data.global_track_id)
    db.execute('INSERT INTO memories VALUES(?,?,?,?,?,?)',(mid,global_item['core_id'],json.dumps(summary,sort_keys=True),'pixel-inference; explicit source evidence',now(),'1.0'))
    append_event(db,global_item['core_id'],'memory.recorded',{'memory_id':mid},'pixel-perception')
    changes[data.global_track_id]={**global_item,'track_scope':'global','global_tracking_id':data.global_track_id,
        'state_basis':'inferred anonymous association','civil_identity_verified':False,'position_status':'unknown',
        'first_visual_evidence_at':min(stamps),'last_visual_evidence_at':max(stamps),'association_evidence_at':at,
        'local_track_ids':[m.track_id for m in data.members],'source_ids':sorted(sources),
        'relations':links,'last_memory_id':mid,'provenance':provenance,'active':False}
    return changes
