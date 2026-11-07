"""Virtual output through SQLite and browser HTML; no external actuator I/O."""
import asyncio
import html
import json
from typing import Literal
from uuid import uuid4, uuid5, NAMESPACE_URL
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from app.connectors import authorize, audit, AuditedRoute
from app.schemas import CoreRecord, NonBlank

router=APIRouter(prefix='/v1/output',tags=['output'],route_class=AuditedRoute)


class DisplayConfig(CoreRecord):
    manual: bool=False
    behavior: Literal['normal','fail','timeout','mismatch']='normal'


class Rule(CoreRecord):
    camera_id: NonBlank
    capability_id: NonBlank
    active_scene: NonBlank='welcome'
    idle_scene: NonBlank='idle'
    enabled: bool=True


class Command(CoreRecord):
    request_id: NonBlank
    capability_id: NonBlank
    scene: NonBlank


class VirtualDisplay:
    async def execute(self, db, target, scene, behavior):
        if behavior=='timeout':await asyncio.sleep(.1)
        if behavior=='fail':raise RuntimeError('Simulated output failure')
        db.execute('UPDATE virtual_outputs SET scene=? WHERE entity_id=?',('unexpected' if behavior=='mismatch' else scene,target))


async def bounded_execute(adapter,db,target,scene,behavior):
    await asyncio.wait_for(adapter.execute(db,target,scene,behavior),timeout=.02)


def capability(db, cid):
    row=db.execute('SELECT * FROM capabilities WHERE id=?',(cid,)).fetchone()
    if not row:raise HTTPException(404,'Declared capability not found')
    if row['operation']!='display.set_scene' or row['required_permission']!='output:write':
        raise HTTPException(422,'Output requires display.set_scene with output:write')
    if not db.execute('SELECT 1 FROM virtual_outputs WHERE entity_id=?',(row['entity_id'],)).fetchone():
        raise HTTPException(404,'Virtual display not configured')
    return row


def execute(db,request_id,cid,scene,actor,automatic=False):
    from app.main import append_event, now
    fingerprint=json.dumps([cid,scene,actor,automatic])
    previous=db.execute('SELECT fingerprint,result FROM output_runs WHERE id=?',(request_id,)).fetchone()
    if previous:
        if previous[0]!=fingerprint:raise HTTPException(409,'Output request ID conflict')
        return json.loads(previous[1])
    cap=capability(db,cid);target=cap['entity_id']
    device=db.execute('SELECT * FROM virtual_outputs WHERE entity_id=?',(target,)).fetchone()
    status='accepted'
    if automatic and device['manual']:
        status='suppressed'
    else:
        try:
            asyncio.run(bounded_execute(VirtualDisplay(),db,target,scene,device['behavior']))
            actual=db.execute('SELECT scene FROM virtual_outputs WHERE entity_id=?',(target,)).fetchone()[0]
            status='verified' if actual==scene else 'verification_failed'
        except TimeoutError:status='timed_out'
        except RuntimeError:status='failed'
    actual=db.execute('SELECT scene FROM virtual_outputs WHERE entity_id=?',(target,)).fetchone()[0]
    result={'request_id':request_id,'capability_id':cid,'target_entity_id':target,'actor':actor,'status':status,
            'requested_scene':scene,'actual_scene':actual,'simulated':True}
    db.execute('INSERT INTO output_runs VALUES(?,?,?)',(request_id,fingerprint,json.dumps(result)))
    append_event(db,target,'output.result',result)
    # current world state is readback, never the unverified requested value
    db.execute('INSERT INTO entity_state VALUES(?,?,?,?) ON CONFLICT(entity_id,key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
               (target,'display.scene',json.dumps(actual),now()))
    audit(actor,'output',status,db)
    return result


def evaluate(db,observation):
    # Only run for a snapshot that was actually projected (late snapshots must not actuate).
    state=db.execute("SELECT value FROM entity_state WHERE entity_id=? AND key='edge.presence'",(observation.source_id,)).fetchone()
    if not state:return
    world=json.loads(state[0])
    from datetime import datetime
    if datetime.fromisoformat(world['observed_at'])!=observation.observed_at:return
    for row in db.execute('SELECT * FROM output_rules WHERE camera_id=? AND enabled=1',(observation.source_id,)).fetchall():
        scene=row['active_scene'] if world['tracks'] else row['idle_scene']
        request_id=str(uuid5(NAMESPACE_URL,str(observation.observation_id)+':'+row['id']))
        execute(db,request_id,row['capability_id'],scene,'rule:'+row['id'],automatic=True)


@router.put('/displays/{entity_id}')
def configure(entity_id:str, config:DisplayConfig, actor=Depends(authorize('output:write'))):
    from app.main import database,require_entity
    with database(write=True) as db:
        require_entity(db,entity_id)
        if db.execute('SELECT type FROM entities WHERE id=?',(entity_id,)).fetchone()[0]!='Display':
            raise HTTPException(422,'Entity must be a Display')
        db.execute('INSERT INTO virtual_outputs(entity_id,manual,behavior) VALUES(?,?,?) ON CONFLICT(entity_id) DO UPDATE SET manual=excluded.manual,behavior=excluded.behavior',
                   (entity_id,config.manual,config.behavior))
        audit(actor,'output.configure','recorded',db)
    return config


@router.put('/rules/{rule_id}')
def configure_rule(rule_id:str,rule:Rule,actor=Depends(authorize('output:write'))):
    from app.main import database,require_entity
    with database(write=True) as db:
        require_entity(db,rule.camera_id);capability(db,rule.capability_id)
        if db.execute('SELECT type FROM entities WHERE id=?',(rule.camera_id,)).fetchone()[0]!='Camera':
            raise HTTPException(422,'Rule source must be a Camera')
        db.execute('INSERT INTO output_rules VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET camera_id=excluded.camera_id,capability_id=excluded.capability_id,active_scene=excluded.active_scene,idle_scene=excluded.idle_scene,enabled=excluded.enabled',
                   (rule_id,rule.camera_id,rule.capability_id,rule.active_scene,rule.idle_scene,rule.enabled))
        audit(actor,'output.rule','recorded',db)
    return rule


@router.post('/commands')
def command(body:Command,actor=Depends(authorize('output:write'))):
    from app.main import database
    with database(write=True) as db:return execute(db,body.request_id,body.capability_id,body.scene,actor)


@router.get('/displays/{entity_id}',response_class=HTMLResponse)
def view(entity_id:str):
    # Loopback-only read-only virtual screen; no credentials embedded into HTML.
    from app.main import database
    with database() as db:
        row=db.execute('SELECT scene,manual FROM virtual_outputs WHERE entity_id=?',(entity_id,)).fetchone()
        if not row:raise HTTPException(404,'Virtual display not found')
    return '<!doctype html><html><head><meta http-equiv="refresh" content="2"><title>ENTITY virtual display</title></head><body style="background:#101c32;color:white;font:2em sans-serif;text-align:center"><p>ENTITY · SIMULATED OUTPUT</p><h1>'+html.escape(row['scene'])+'</h1><p>'+('MANUAL' if row['manual'] else 'AUTOMATIC')+'</p></body></html>'
