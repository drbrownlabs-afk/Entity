"""Server-side role AND resource scope, shared by every Office representation."""
from fastapi import HTTPException

OPERATOR_ROLES={'admin','operator','reception','security','maintenance'}
PRIVATE_KINDS={'Camera','Stream','Sensor','AccessPoint','Track','Incident','Alert','Contract','Membership','Kiosk','Intercom'}
PERSONAL_KINDS={'Booking','Meeting','Visit','Invitation','Notification','CheckIn','Task','Conversation'}

def operator(actor):return actor['role'] in OPERATOR_ROLES
def unrestricted(actor):return actor['role']=='admin'
def granted(item,actor,items,permission='read',seen=None):
    if unrestricted(actor):return True
    if not item:return False
    seen=set(seen or [])
    key=item.get('id')
    if key in seen:return False
    seen.add(key)
    for grant in actor.get('grants',[]):
        if grant['permission'] not in [permission,'*']:continue
        if grant['resource'] in ['site',key]:return True
    for parent in [item.get('resource_id'),item.get('zone_id'),item.get('parent_resource'),item.get('meeting_id'),item.get('conversation_id')]:
        if parent and granted(items.get(parent,{}),actor,items,permission,seen):return True
    return False

def permitted(item,actor,items=None):
    items=items or {}
    if unrestricted(actor):return True
    if operator(actor) and granted(item,actor,items):return True
    person=actor.get('person')
    if not person:return False
    kind=item.get('kind');key=item.get('id')
    if kind=='Person':return key==person
    if kind in PRIVATE_KINDS:return False
    if kind in PERSONAL_KINDS:
        return person in (item.get('person_id'),item.get('host_id'),item.get('recipient_id'),item.get('recipient'),item.get('assignee_id'),item.get('assignee'),item.get('visitor_id')) or person in item.get('participants',[])
    if kind in {'Desk','Room','Office','Zone','EventSpace'}:
        own=items.get(person,{})
        return (item.get('public') is True and not item.get('private')) or key==own.get('home_environment')
    if kind in {'Site','Building','Floor','Reception','WaitingArea'}:return True
    if kind in {'Organization','Team'}:
        own=items.get(person,{})
        return key in [own.get('organization_id'),own.get('team_id')]
    return False

def projection(state,actor):
    if unrestricted(actor):return state
    items=state['entities'];filtered={k:v for k,v in items.items() if permitted(v,actor,items)}
    hidden={'core_id','credentials','access','observations','stream_url','secret','token','raw_data','track_id','last_associated_person_id'}
    if not operator(actor):hidden|={'camera_id','provenance','identity_evidence','last_observation_id'}
    safe={}
    for key,item in filtered.items():
        safe[key]={k:v for k,v in item.items() if k not in hidden|{'relations'}}
        safe[key]['relations']=[r for r in item.get('relations',[]) if r.get('target') in filtered]
    return {**state,'entities':safe,'access_scope':'assigned-resources' if operator(actor) else 'personal'}

def require_visible(state,actor,key):
    if key and key not in projection(state,actor)['entities']:raise HTTPException(403,'Entity outside actor scope')

def authorize_command(items,actor,operation,target,data):
    if unrestricted(actor):return
    if actor['role']=='kiosk' and operation=='reception.interact' and actor['person']==target:return
    if operation=='intercom.reply':return # addressed-host check is stricter and runs in domain policy
    if data.get('person_id') and data['person_id'] in items and not permitted(items[data['person_id']],actor,items):raise HTTPException(403,'Person outside assigned resource scope')
    item=items.get(target,{})
    from .catalog import OPERATIONS
    if OPERATIONS[operation][1]=='read':
        if not permitted(item,actor,items):raise HTTPException(403,'Read outside assigned resource scope')
        return
    if actor['role']=='member':
        if operation.startswith('booking.') and permitted(item,actor,items):return
        raise HTTPException(403,'Command outside member scope')
    if operation=='task.resolve' and item.get('assignee')==actor.get('person'):return
    mapped=items.get(data.get('resource_id'),{}) if operation=='task.create' else item
    if not granted(mapped,actor,items,'write'):raise HTTPException(403,'Command outside assigned resource scope')
    if operation=='booking.reassign' and not granted(items.get(data.get('resource_id'),{}),actor,items,'write'):raise HTTPException(403,'Alternative outside assigned scope')
