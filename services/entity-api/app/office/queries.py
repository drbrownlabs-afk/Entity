"""Structured evidence queries; no answers prewritten for phrases or inferred identities."""
import json
from datetime import datetime
from fastapi import HTTPException
from .storage import world,utc


def query(db,site,run,body,visible_state=None):
    at=body.get('at');branch=body.get('branch','main');kind=body['kind'];key=body.get('entity_id')
    state=visible_state or world(db,site,run,branch,at);items=state['entities'];evidence=[];answer=None
    if key and key not in items:raise HTTPException(404,'Entity absent from selected time/site')
    if kind=='memories':
        if at:raise HTTPException(422,'Historical memory query is not supported')
        if not key:raise HTTPException(422,'Entity ID required')
        answer=[dict(row)for row in db.execute('SELECT * FROM memories WHERE entity_id=? ORDER BY created_at,id',(items[key]['core_id'],))]
    elif kind=='graph':
        from .graph import subgraph
        answer=subgraph(items,key,state['clock'])
    elif kind=='location':
        item=items[key]
        if item.get('kind') not in ['Person','Track','Visit']:raise HTTPException(422,'Location query requires person, track or visit')
        confirmed=item.get('freshness')=='fresh' and (item.get('presence')=='confirmed' or item.get('active') is True)
        image_only=item.get('kind')=='Track' and item.get('coordinate_frame')=='normalized-image' and not item.get('zone_id')
        visual_confirmed=confirmed
        if image_only:confirmed=False
        answer={'status':'confirmed' if confirmed else 'unknown','zone_id':item.get('zone_id') if confirmed else None,'last_observed_at':item.get('observed_at'),'last_known_zone':item.get('zone_id'),'reason':'observed evidence' if confirmed else 'Arrival not confirmed or observation expired'}
        if image_only:answer.update(visual_presence='confirmed' if visual_confirmed else 'unknown',reason='Image evidence has no confirmed world zone',coordinate_frame='normalized-image')
    elif kind=='agenda':
        start,end=utc(body['from']),utc(body['to'])
        answer=[x for x in items.values() if x.get('kind') in ['Meeting','Booking'] and x.get('starts_at','9999')<end and start<x.get('ends_at','') and (not key or x.get('resource_id')==key or x.get('person_id')==key or x.get('host_id')==key)]
    elif kind in ['events','camera_observations','cameras_for_person']:
        rows=db.execute('SELECT * FROM office_events WHERE site=? AND run=? AND branch=? AND at>=? AND at<=? ORDER BY seq LIMIT 1000',(site,run,branch,utc(body.get('from','2000-01-01T00:00:00Z')),utc(body.get('to',state['clock'])))).fetchall()
        answer=[]
        for row in rows:
            p=json.loads(row['payload']);entities=json.loads(row['entities'])
            if visible_state is not None:
                entities=[x for x in entities if x in items]
                if not entities:continue
                p={**p,'changes':{k:v for k,v in p.get('changes',{}).items() if k in items}}

            if kind=='events' and (not key or key in entities or p.get('actor_person_id')==key):answer.append({'id':row['id'],'at':row['at'],'type':row['type'],'actor':row['actor'],'entities':entities,'details':({k:v for k,v in p.items() if k in ['operation','target','outcome']} if visible_state is not None else {k:v for k,v in p.items() if k!='changes'})})
            elif kind=='camera_observations' and row['type']=='observation.received' and p.get('source_id')==key:answer.append({'event_id':row['id'],'at':row['at'],'observation_id':p['observation_id'],'payload':p['payload'],'provenance':p['provenance']})
            elif kind=='cameras_for_person' and row['type']=='observation.received' and key in p.get('changes',{}):answer.append({'camera_id':p['source_id'],'at':row['at'],'event_id':row['id'],'observation_id':p['observation_id']})
        evidence=[x.get('event_id',x.get('id')) for x in answer]
    elif kind=='impact':
        item=items[key];zone=item.get('zone_id',key if item['kind']=='Zone' else None)
        affected=[x for x in items.values() if x.get('zone_id')==zone or (x.get('kind')=='Booking' and items.get(x.get('resource_id'),{}).get('zone_id')==zone)]
        capacity=sum(x.get('capacity',0) for x in items.values() if x.get('zone_id')==zone and x.get('reservable') is True and not x.get('closed'))
        assumed=items.get(zone,{}).get('assumed_occupancy')
        answer={'zone_id':zone,'affected':affected,'capacity':capacity,'assumed_occupancy':assumed,
            'over_capacity':max(0,assumed-capacity) if assumed is not None else None,
            'recommendation':'Reduce the assumed load or request an authorized relocation' if assumed is not None and assumed>capacity else None,
            'rule':'explicit zone/resource/booking relationships; hypothetical assumptions are not observations'}
    elif kind=='causes':
        rows=db.execute('SELECT * FROM office_events WHERE site=? AND run=? AND branch=? AND at<=? ORDER BY seq DESC LIMIT 1000',(site,run,branch,state['clock'])).fetchall()
        answer=[{'id':r['id'],'type':r['type'],'at':r['at'],'details':{k:v for k,v in json.loads(r['payload']).items() if k!='changes'}} for r in rows if (visible_state is None or set(json.loads(r['entities']))&set(items)) and (not key or key in json.loads(r['entities'])) and r['type'] in ['equipment.fail','equipment.repair','observation.received','zone.close']]
        evidence=[r['id'] for r in answer]
    elif kind=='diff':
        old=world(db,site,run,branch,body['from'])['entities'];old={k:v for k,v in old.items() if visible_state is None or k in items};answer={k:{'before':old.get(k),'after':v} for k,v in items.items() if old.get(k)!=v and (not key or k==key)}
    elif kind=='metrics':
        answer={'resource_count':len(items),'occupied_zones':sum(bool(x.get('occupancy')) and x.get('freshness')=='fresh' for x in items.values()),'bookings':sum(x.get('kind')=='Booking' for x in items.values()),'open_tasks':sum(x.get('kind')=='Task' and x.get('status')!='resolved' for x in items.values()),'energy_estimate_w':sum(x.get('estimated_power_w',0) for x in items.values() if x.get('status')=='operational'),'energy_is_estimated':True}
    elif kind=='entity':answer=items[key]
    else:raise HTTPException(422,'Unknown query kind; use structured query catalogue')
    if not evidence:
        rows=db.execute('SELECT id,entities FROM office_events WHERE site=? AND run=? AND branch=? AND at<=? ORDER BY seq DESC LIMIT 500',(site,run,branch,state['clock'])).fetchall()
        evidence=[r['id'] for r in rows if (not key or key in json.loads(r['entities'])) and (visible_state is None or set(json.loads(r['entities']))&set(items))][:20]
    return {'query':body,'as_of':state['clock'],'revision':state['revision'],'result':answer,'evidence':evidence,'provider':'core-query-engine','historical':at is not None,'video_available':False}
