"""Server-side projection of coworking world per authenticated actor.

Fail closed for non-operators. No camera/other-member payload in member API.
"""
from fastapi import HTTPException

OPERATOR_ROLES={"admin","reception","security","maintenance"}
PRIVATE_KINDS={"Camera","Stream","Sensor","AccessPoint","Track","Incident","Alert","Contract","Membership"}
PERSONAL_KINDS={"Booking","Meeting","Visit","Invitation","Notification","CheckIn","Task"}

def operator(actor):
    return actor["role"] in OPERATOR_ROLES

def permitted(item,actor):
    if operator(actor): return True
    person=actor.get("person")
    if not person: return False
    kind=item.get("kind")
    if kind in PRIVATE_KINDS:return False
    key=item.get("id")
    if kind=="Person":return key==person
    if kind in PERSONAL_KINDS:
        return person in (item.get("person_id"),item.get("host_id"),item.get("recipient_id"),item.get("assignee_id"),item.get("visitor_id")) or person in item.get("participants",[])
    if kind in {"Desk","Room","Office","Zone","EventSpace"}:
        return item.get("public") is True and item.get("private") is not True
    if kind in {"Site","Building","Floor","Reception","WaitingArea"}:
        return True
    return False

def projection(state,actor):
    if operator(actor):return state
    filtered={key:value for key,value in state["entities"].items() if permitted(value,actor)}
    safe={}
    for key,item in filtered.items():
        safe[key]={k:v for k,v in item.items() if k not in {"relations","core_id","credentials","access","observations","camera_id","stream_url","secret","token","raw_data"}}
    return {**state,"entities":safe,"access_scope":"personal"}

def require_visible(state,actor,key):
    if key and key not in projection(state,actor)["entities"]:
        raise HTTPException(403,"Entity outside actor scope")
