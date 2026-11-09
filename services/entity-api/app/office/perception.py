"""Project legitimate cross-camera inference into the existing world; never identify civil people."""
import json
from pydantic import BaseModel,ConfigDict,Field
from typing import Literal
from fastapi import HTTPException
from .storage import identity,now,utc
class Association(BaseModel):
 model_config=ConfigDict(extra='forbid')
 track_a:str=Field(min_length=1,max_length=128)
 track_b:str=Field(min_length=1,max_length=128)
 score:float=Field(ge=0,le=1,allow_inf_nan=False)
 appearance_similarity:float=Field(ge=0,le=1,allow_inf_nan=False)
 spatial_distance_native:float=Field(ge=0,allow_inf_nan=False)
 simultaneous_samples:int=Field(ge=1)
 evidence_observation_ids:list[str]=Field(min_length=2,max_length=1000)
 model_sha256:str=Field(pattern='^[a-f0-9]{64}$')
 method:Literal['osnet-ain-appearance-time-calibration']
 provisional:Literal[True]=True
 probability_calibrated:Literal[False]=False

def associate(db,site,run,items,actor,message,at):
 if actor['role']!='admin':raise HTTPException(403,'Cross-camera inference requires an authorized pipeline operator')
 try:data=Association.model_validate(message.payload)
 except ValueError:raise HTTPException(422,'Invalid visual association; civil identity is not an observation')
 if data.track_a==data.track_b:raise HTTPException(422,'Distinct local tracks required')
 a,b=items.get(data.track_a,{}),items.get(data.track_b,{})
 if a.get('kind')!='Track'or b.get('kind')!='Track':raise HTTPException(422,'Visual association only relates existing observed Tracks')
 if a.get('camera_id')!=message.source_id or a.get('camera_id')==b.get('camera_id'):raise HTTPException(422,'Association must cross sources and be emitted by its first camera')
 if len(set(data.evidence_observation_ids))!=len(data.evidence_observation_ids):raise HTTPException(422,'Duplicate association evidence')
 sources=set();hashes=[];stamps={a['camera_id']:set(),b['camera_id']:set()}
 for oid in data.evidence_observation_ids:
  row=db.execute('SELECT body FROM office_inbox WHERE site=? AND run=? AND id=?',(site,run,oid)).fetchone()
  if not row:raise HTTPException(422,'Association evidence observation missing')
  obs=json.loads(row[0])
  if obs['type']!='edge.presence'or obs['source_id']not in [a['camera_id'],b['camera_id']]:raise HTTPException(422,'Association evidence belongs to a different source')
  expected=a if obs['source_id']==a['camera_id']else b
  if not any(t['local_track_id']==expected['local_track_id']for t in obs['payload']['tracks']):raise HTTPException(422,'Evidence does not contain the claimed local track')
  if utc(obs['observed_at'])>at:raise HTTPException(422,'Association cannot use future evidence')
  if not obs['payload'].get('frame_sha256'):raise HTTPException(422,'Association requires traced pixel frames')
  stamps[obs['source_id']].add(utc(obs['observed_at']))
  sources.add(obs['source_id']);hashes.append(obs['payload'].get('frame_sha256'))
 if sources!={a['camera_id'],b['camera_id']}:raise HTTPException(422,'Both camera sources require evidence')
 if len(stamps[a['camera_id']]&stamps[b['camera_id']])<data.simultaneous_samples:raise HTTPException(422,'Association timestamps do not support claimed overlap')
 evidence={'source':'pixel-perception MTMC','observation_id':str(message.observation_id),'provisional':True,'probability_calibrated':False,**data.model_dump()};links=list(a.get('relations',[]));typ='provisionallySameVisualSubject'
 if not any(e['type']==typ and e['target']==data.track_b and not e.get('valid_to')for e in links):links.append({'id':identity(site,data.track_a,typ,data.track_b),'type':typ,'target':data.track_b,'valid_from':at,'valid_to':None,'provenance':evidence})
 changes={data.track_a:{'relations':links,'visual_identity_status':'provisional, not civil identity'},data.track_b:{'visual_identity_status':'provisional, not civil identity'}}
 from app.main import append_event
 for key in [data.track_a,data.track_b]:
  mid=identity('visual-inference-memory',site,run,str(message.observation_id),key);content=json.dumps({'type':'provisional_cross_camera_inference','method':data.method,'score':data.score,'other_track':data.track_b if key==data.track_a else data.track_a,'evidence_observations':data.evidence_observation_ids,'model_sha256':data.model_sha256,'civil_identity_verified':False},sort_keys=True)
  db.execute('INSERT INTO memories VALUES(?,?,?,?,?,?)',(mid,items[key]['core_id'],content,'pixel-inference; virtual camera imagery',now(),'1.0'));append_event(db,items[key]['core_id'],'memory.recorded',{'memory_id':mid},'pixel-perception');changes[key]['last_memory_id']=mid
 return changes


def remember_first_frame(db,site,run,item,message,at):
 from app.main import append_event
 key=item['id'];mid=identity('first-pixel-observation',site,run,key);content=json.dumps({'source_id':message.source_id,'observation_id':str(message.observation_id),'observed_at':at,'frame_sha256':message.payload.get('frame_sha256'),'model':message.provenance.model_version,'simulated_imagery':message.provenance.simulated,'civil_identity_verified':False},sort_keys=True)
 db.execute('INSERT INTO memories VALUES(?,?,?,?,?,?)',(mid,item['core_id'],content,'first camera pixel observation',now(),'1.0'));append_event(db,item['core_id'],'memory.recorded',{'memory_id':mid},'pixel-perception');return mid
