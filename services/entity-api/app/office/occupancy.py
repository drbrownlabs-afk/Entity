"""Aggregate only fresh camera evidence; never identify overlapping anonymous tracks."""
from datetime import datetime
def project(items,clock):
    stamp=datetime.fromisoformat(clock);coverage={}
    for item in items.values():
        if item.get('kind')=='Camera':
            for zone in item.get('covered_zones',[]):coverage.setdefault(zone,[]).append(item)
    for zone,cameras in coverage.items():
        target=items.get(zone)
        if not target:continue
        fresh=[c for c in cameras if c.get('connectivity')=='connected' and c.get('observed_at') and 0<=(stamp-datetime.fromisoformat(c['observed_at'])).total_seconds()<=c.get('ttl_seconds',30)]
        if not fresh:
            if 'occupancy' in target:target.update(occupancy_current=False,occupancy_freshness='unknown',freshness='stale')
            continue
        known=set();anonymous=0;counts=[]
        for camera in fresh:
            count=0
            for key in camera.get('tracks',[]):
                track=items.get(key,{})
                if not track.get('active') or track.get('zone_id')!=zone or track.get('freshness')!='fresh':continue
                count+=1
                if track.get('person_id') and track.get('association_until','')>=clock:known.add(track['person_id'])
                else:anonymous+=1
            counts.append(count)
        lower=max([len(known),*counts]);upper=len(known)+anonymous
        target.update(occupancy=lower,occupancy_range=[lower,upper],occupancy_is_estimate=lower!=upper,
            occupancy_current=True,occupancy_freshness='fresh',freshness='fresh',occupancy_sources=[c['id'] for c in fresh],
            occupancy_semantics='observed lower bound; authorized identities deduplicated; anonymous overlap remains uncertain')
