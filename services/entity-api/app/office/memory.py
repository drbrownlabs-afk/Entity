"""Bounded event results with zone relationships reconstructed at the event's time."""
import json
from fastapi import HTTPException
from .storage import utc


def events(db,site,run,branch,after,limit,allowed=None,entity_id=None,zone_id=None,event_type=None,start=None,end=None):
    clauses=['site=?','run=?','branch=?','seq>?'];params=[site,run,branch,after]
    if start:clauses.append('at>=?');params.append(utc(start))
    if end:clauses.append('at<=?');params.append(utc(end))
    if start and end and utc(start)>utc(end):raise HTTPException(422,'Event interval is reversed')
    if event_type:clauses.append('type=?');params.append(event_type)
    if entity_id:
        clauses.append('EXISTS(SELECT 1 FROM json_each(office_events.entities) WHERE value=?)');params.append(entity_id)
    result=[];historical_seq=None;items={}
    rows=db.execute('SELECT * FROM office_events WHERE '+' AND '.join(clauses)+' ORDER BY seq',params)
    for row in rows:
        keys=json.loads(row['entities'])
        if allowed is not None and not set(keys)&set(allowed):continue
        if zone_id:
            if not keys:continue
            # Timestamp equality does not erase command order. Recover the post-event
            # state from the nearest immutable snapshot, then apply only commits up to seq.
            if historical_seq is None:
                snapshot=db.execute('SELECT seq,body FROM office_snapshots WHERE site=? AND run=? AND branch=? AND seq<=? ORDER BY seq DESC LIMIT 1',(site,run,branch,row['seq'])).fetchone()
                historical_seq=snapshot['seq'] if snapshot else 0;items=json.loads(snapshot['body']) if snapshot else {}
            for event in db.execute('SELECT payload FROM office_events WHERE site=? AND run=? AND branch=? AND seq>? AND seq<=? ORDER BY seq',(site,run,branch,historical_seq,row['seq'])):
                for key,patch in json.loads(event['payload']).get('changes',{}).items():items[key]={**items.get(key,{}),**patch}
            historical_seq=row['seq']
            def belongs(key,seen=None):
                if key==zone_id:return True
                seen=set() if seen is None else seen
                if key in seen:return False
                seen.add(key);item=items.get(key,{})
                if item.get('zone_id')==zone_id:return True
                return any(belongs(item[field],seen) for field in ['resource_id','waiting_area','destination'] if isinstance(item.get(field),str))
            if not any(belongs(key) for key in keys):continue
        record={**dict(row),'entities':keys,'payload':json.loads(row['payload']),'evidence':json.loads(row['evidence'])}
        if allowed is not None:record={**{k:record[k] for k in ['seq','id','at','type']},'entities':[k for k in keys if k in allowed]}
        result.append(record)
        if len(result)>=limit:break
    return result
