"""Typed temporal links shared by Core projections, queries and operational routing."""
from datetime import datetime
from fastapi import HTTPException

FIELD_LINKS={
 'registry_id':'registeredIn',
 'visit_id':'registeredVisit','access_point':'atAccessPoint',
 'operator_org_id':'managedBy','organization_id':'belongsTo','team_id':'memberOf','zone_id':'locatedIn','parent_resource':'partOf',
 'resource_id':'usesResource','person_id':'concernsPerson','host_id':'hostedBy','booking_id':'scheduledBy',
 'meeting_id':'attendsMeeting','camera_id':'observedBy','track_id':'representedBy','assignee':'assignedTo',
 'environment_id':'locatedIn','waiting_area':'waitsIn','recipient':'addressedTo','conversation_id':'partOfConversation',
}
TYPES={'registeredIn','adjacentTo','connectedTo','registeredVisit','atAccessPoint','managedBy','belongsTo','memberOf','locatedIn','partOf','usesResource','concernsPerson','hostedBy','scheduledBy','attendsMeeting','observedBy','representedBy','assignedTo','waitsIn','addressedTo','partOfConversation','occupies','employedBy','uses','covers','streamOf','measures','serves','communicatesThrough','reservedBy','invitedTo','reportsTo','affectedBy'}
def active(edge,at):
    return edge.get('valid_from','0000')<=at and (not edge.get('valid_to') or at<edge['valid_to'])
def derive(item,at):
    links=list(item.get('relations',[]))
    for field,kind in FIELD_LINKS.items():
        target=item.get(field)
        if not isinstance(target,str) or not target:
            links=[{**r,'valid_to':at}if r['type']==kind and r.get('field')==field and not r.get('valid_to')else r for r in links]
            continue
        links=[{**r,'valid_to':at} if r['type']==kind and r.get('field')==field and r['target']!=target and not r.get('valid_to') else r for r in links]
        if not any(r['type']==kind and r['target']==target and active(r,at) for r in links):
            links.append({'type':kind,'target':target,'field':field,'valid_from':at,'valid_to':None,'provenance':'explicit-domain-field'})
    return links
def targets(items,key,kind,at):
    return [r['target'] for r in items.get(key,{}).get('relations',[]) if r['type']==kind and active(r,at) and r['target'] in items]
def connected(items,source,kind,target,at):
    return target in targets(items,source,kind,at)
def subgraph(items,key,at,depth=2):
    if key not in items:raise HTTPException(404,'Graph root absent at selected time')
    seen={key};edges=[]
    for _ in range(depth):
        frontier=set()
        for source,item in items.items():
            for edge in item.get('relations',[]):
                target=edge['target']
                if not active(edge,at) or target not in items:continue
                if source in seen or target in seen:
                    entry={'source':source,**edge}
                    if entry not in edges:edges.append(entry)
                    frontier.update([source,target])
        seen|=frontier
    return {'nodes':[items[k] for k in sorted(seen)],'edges':edges,'as_of':at}
