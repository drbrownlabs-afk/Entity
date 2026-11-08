import asyncio,json,sqlite3,hashlib
from datetime import datetime
from uuid import UUID,uuid4
from fastapi import APIRouter,Depends,HTTPException,Header,Request,Query as QueryParam
from fastapi.responses import StreamingResponse
from pydantic import Field
from app.schemas import CoreRecord,NonBlank
from app.connectors import Observation,AuditedRoute
from .auth import principal,scoped,login,authenticate
from .storage import encode,utc,world,emit,get_run,identity
from .service import create_run,command,resource
from .observations import ingest
from .queries import query
from .access import projection,operator,require_visible,unrestricted

router=APIRouter(prefix='/v1',tags=['coworking'],route_class=AuditedRoute)

class Login(CoreRecord):
    username:NonBlank
    password:str=Field(min_length=1,max_length=1024)
class RunCreate(CoreRecord):
    id:NonBlank
    clock:NonBlank
    seed:int=1
class Command(CoreRecord):
    id:UUID
    operation:NonBlank
    target:NonBlank
    inputs:dict=Field(default_factory=dict)
    branch:NonBlank='main'
    expected_revision:int|None=Field(default=None,ge=0)
    capability_version:str='1.0'
class Query(CoreRecord):
    kind:NonBlank
    entity_id:str|None=None
    at:str|None=None
    branch:NonBlank='main'
    start:str|None=Field(default=None,alias='from')
    end:str|None=Field(default=None,alias='to')
class Binding(CoreRecord):
    source:NonBlank
    adapter:str
    version:str='1.0'
    config:dict=Field(default_factory=dict)
class Fork(CoreRecord):
    id:NonBlank
    expected_revision:int=Field(ge=0)
class Apply(CoreRecord):
    id:UUID

@router.post('/office/auth/login')
def sign_in(body:Login):
    from app.main import database
    with database(write=True) as db:return login(db,body.username,body.password)

@router.post('/office/auth/logout')
def sign_out(authorization:str=Header(...),actor=Depends(principal)):
    from app.main import database
    digest=hashlib.sha256(authorization[7:].encode()).hexdigest()
    with database(write=True) as db:db.execute('DELETE FROM office_sessions WHERE token_hash=?',(digest,))
    return {'revoked':True}

@router.get('/office/me')
def me(actor=Depends(principal)):return {k:v for k,v in actor.items() if k!='permissions'}

@router.get('/sites')
def sites(actor=Depends(principal)):
    from app.main import database
    with database() as db:
        return [dict(r) for r in db.execute('SELECT id,name,timezone,config FROM office_sites WHERE id=?',(actor['site'],))]

@router.get('/sites/{site}/runs')
def runs(site:str,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    with database() as db:return [dict(r) for r in db.execute('SELECT * FROM office_runs WHERE site=? ORDER BY id',(site,))]

@router.get('/sites/{site}/active-run')
def current_run(site:str,actor=Depends(principal)):
    from app.main import database
    from .playback import active_run
    scoped(site,actor,'kiosk' if actor['role']=='kiosk' else 'read')
    with database() as db:return active_run(db,site)

@router.post('/sites/{site}/runs',status_code=201)
def run_create(site:str,body:RunCreate,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'simulate')
    try:
        with database(write=True) as db:return create_run(db,site,body.id,body.clock,body.seed)
    except sqlite3.IntegrityError:raise HTTPException(409,'Run already exists')

@router.get('/sites/{site}/runs/{run}/world')
def get_world(site:str,run:str,branch:str='main',at:str|None=None,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    with database() as db:return projection(world(db,site,run,branch,at),actor)

@router.post('/sites/{site}/runs/{run}/commands')
def execute_command(site:str,run:str,body:Command,actor=Depends(principal)):
    from app.main import database
    try:
        with database(write=True) as db:return command(db,site,run,actor,body.model_dump(mode='json'))
    except sqlite3.IntegrityError:raise HTTPException(409,'Domain identifier already exists')

@router.post('/sites/{site}/runs/{run}/observations')
def observation(site:str,run:str,body:Observation,actor=Depends(principal)):
    from app.main import database
    with database(write=True) as db:return ingest(db,site,run,actor,body)

@router.post('/sites/{site}/runs/{run}/queries')
def ask(site:str,run:str,body:Query,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'query')
    data=body.model_dump(by_alias=True,exclude_none=True)
    try:
        with database() as db:
            state=world(db,site,run,data.get('branch','main'),data.get('at'))
            visible=projection(state,actor)
            require_visible(state,actor,data.get('entity_id'))
            if not operator(actor):
                if data['kind'] not in {'entity','agenda','location','events','graph'}:raise HTTPException(403,'Query outside personal scope')
                if data['kind']=='agenda' and data.get('entity_id')!=actor.get('person'):raise HTTPException(403,'Personal agenda requires own person')
                if not data.get('entity_id'):raise HTTPException(403,'Entity ID required')
            return query(db,site,run,data,None if unrestricted(actor) else visible)
    except (KeyError,TypeError,ValueError):raise HTTPException(422,'Required query parameters missing or invalid')

@router.get('/sites/{site}/capabilities')
def capabilities(site:str,resource_id:str|None=None,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    with database() as db:
        resources={r['id']:{'id':r['id'],'kind':r['kind'],**json.loads(r['attributes'])} for r in db.execute('SELECT * FROM office_resources WHERE site=?',(site,))}
        allowed=projection({'entities':resources},actor)['entities']
        return [descriptor for r in db.execute('SELECT descriptor FROM office_capabilities WHERE site=?'+(' AND resource=?' if resource_id else ''),(site,resource_id) if resource_id else (site,)) if (descriptor:=json.loads(r[0]))['resource_id'] in allowed and descriptor['permission'] in actor['permissions']]

@router.put('/sites/{site}/bindings')
def bind(site:str,body:Binding,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'manage')
    if body.adapter not in ['simulated','rest-test','video-test','mqtt-test']:raise HTTPException(422,'Adapter not installed')
    if body.version!='1.0':raise HTTPException(409,'Unsupported adapter contract')
    if body.adapter=='rest-test':
        from urllib.parse import urlparse
        u=urlparse(body.config.get('url',''))
        # Reference network adapter is intentionally restricted to operator-owned loopback test services.
        if u.scheme not in ['http','https'] or u.hostname not in ['127.0.0.1','localhost'] or u.username:raise HTTPException(422,'Test adapter URL must be an operator-owned loopback service')
    with database(write=True) as db:
        resource(db,site,body.source)
        db.execute('INSERT INTO office_bindings VALUES(?,?,?,?,?) ON CONFLICT(site,source) DO UPDATE SET adapter=excluded.adapter,version=excluded.version,config=excluded.config',(site,body.source,body.adapter,body.version,encode(body.config)))
    return body

@router.get('/sites/{site}/runs/{run}/events')
def events(site:str,run:str,after:int=0,limit:int=QueryParam(default=100,ge=1,le=1000),branch:str='main',actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    with database() as db:
        allowed=projection(world(db,site,run,branch),actor)['entities']
        rows=[{**dict(r),'entities':json.loads(r['entities']),'payload':json.loads(r['payload']),'evidence':json.loads(r['evidence'])} for r in db.execute('SELECT * FROM office_events WHERE site=? AND run=? AND branch=? AND seq>? ORDER BY seq LIMIT ?',(site,run,branch,after,limit))]
        if unrestricted(actor):return rows
        return [{**{k:r[k] for k in ['seq','id','at','type']},'entities':[k for k in r['entities'] if k in allowed]} for r in rows if set(r['entities'])&set(allowed)]

@router.get('/sites/{site}/runs/{run}/stream')
async def stream(site:str,run:str,request:Request,after:int=0,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    with database() as db:get_run(db,site,run)
    async def generate():
        cursor=after
        while not await request.is_disconnected():
            try:
                current_actor=authenticate(request.headers.get('authorization'));scoped(site,current_actor,'read')
            except HTTPException:
                yield 'event: auth-expired\ndata: {}\n\n'
                return
            with database() as db:
                rows=db.execute("SELECT seq,id,type,at,entities FROM office_events WHERE site=? AND run=? AND branch='main' AND seq>? ORDER BY seq LIMIT 100",(site,run,cursor)).fetchall()
                allowed=projection(world(db,site,run),current_actor)['entities']
            for row in rows:
                cursor=row['seq']
                row=dict(row);row['entities']=[k for k in json.loads(row['entities']) if k in allowed]
                if not unrestricted(current_actor) and not row['entities'] and row['type']!='clock.advance':continue
                yield f'id: {cursor}\nevent: world-change\ndata: {encode(dict(row))}\n\n'
            if not rows:yield ': heartbeat\n\n'
            await asyncio.sleep(.5)
    return StreamingResponse(generate(),media_type='text/event-stream',headers={'Cache-Control':'no-cache'})

@router.post('/sites/{site}/runs/{run}/scenarios',status_code=201)
def fork(site:str,run:str,body:Fork,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'operate')
    if body.id=='main':raise HTTPException(422,'Reserved branch ID')
    try:
        with database(write=True) as db:
            state=world(db,site,run)
            if state['revision']!=body.expected_revision:raise HTTPException(409,'World changed before fork')
            db.execute('INSERT INTO office_branches VALUES(?,?,?,?,?,?)',(site,run,body.id,state['revision'],state['clock'],encode(state['entities'])))
            for key,item in state['entities'].items():db.execute('INSERT INTO office_state VALUES(?,?,?,?,?)',(site,run,body.id,key,encode(item)))
            db.execute('INSERT INTO office_snapshots VALUES(?,?,?,?,?,?)',(site,run,body.id,0,state['clock'],encode(state['entities'])))
            db.execute('INSERT INTO office_scenario_owners VALUES(?,?,?,?)',(site,run,body.id,actor['actor']))
            return projection(world(db,site,run,body.id),actor)
    except sqlite3.IntegrityError:raise HTTPException(409,'Scenario already exists')

@router.get('/sites/{site}/runs/{run}/scenarios/{branch}/comparison')
def compare(site:str,run:str,branch:str,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    if not operator(actor):raise HTTPException(403,'Scenario comparison requires operator role')
    with database() as db:
        owner=db.execute('SELECT actor FROM office_scenario_owners WHERE site=? AND run=? AND branch=?',(site,run,branch)).fetchone()
        if not unrestricted(actor) and (not owner or owner[0]!=actor['actor']):raise HTTPException(403,'Scenario belongs to another actor')
        state=projection(world(db,site,run,branch),actor)
        base=db.execute('SELECT * FROM office_branches WHERE site=? AND run=? AND id=?',(site,run,branch)).fetchone()
        if not base:raise HTTPException(404,'Scenario missing')
        initial=json.loads(base['base_state'])
        return {'base_revision':base['base_seq'],'current_official_revision':world(db,site,run)['revision'],'changes':{k:{'before':initial.get(k),'after':v} for k,v in state['entities'].items() if initial.get(k)!=v},'official_modified':False}

@router.post('/sites/{site}/runs/{run}/scenarios/{branch}/apply')
def apply(site:str,run:str,branch:str,body:Apply,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'operate')
    with database(write=True) as db:
        owner=db.execute('SELECT actor FROM office_scenario_owners WHERE site=? AND run=? AND branch=?',(site,run,branch)).fetchone()
        if not unrestricted(actor) and (not owner or owner[0]!=actor['actor']):raise HTTPException(403,'Scenario belongs to another actor')
        old=db.execute("SELECT actor,fingerprint,result FROM office_commands WHERE site=? AND run=? AND branch='main' AND id=?",(site,run,str(body.id))).fetchone()
        if old:
            if old['actor']!=actor['actor'] or old['fingerprint']!=hashlib.sha256(branch.encode()).hexdigest():raise HTTPException(409,'Scenario application ID conflict')
            return json.loads(old['result'])
        base=db.execute('SELECT * FROM office_branches WHERE site=? AND run=? AND id=?',(site,run,branch)).fetchone()
        if not base:raise HTTPException(404,'Scenario missing')
        if world(db,site,run)['revision']!=base['base_seq']:raise HTTPException(409,'Official world changed; fork and compare again')
        results=[]
        for row in db.execute('SELECT seq,payload FROM office_events WHERE site=? AND run=? AND branch=? ORDER BY seq',(site,run,branch)).fetchall():
            data=json.loads(row['payload'])
            results.append(command(db,site,run,actor,{'id':identity('apply',str(body.id),row['seq']),'operation':data['operation'],'target':data['target'],'inputs':data.get('inputs',{}),'branch':'main'}))
        response={'status':'verified','scenario':branch,'results':results}
        db.execute('INSERT INTO office_commands VALUES(?,?,?,?,?,?,?)',(site,run,'main',str(body.id),actor['actor'],hashlib.sha256(branch.encode()).hexdigest(),encode(response)))
        return response


class SimulationAdvance(CoreRecord):
    to:NonBlank

@router.post('/sites/{site}/runs/{run}/simulation/install')
def install_simulation(site:str,run:str,actor=Depends(principal)):
    from app.main import database
    from .simulation import install_day
    with database(write=True) as db:return install_day(db,site,run,actor)

@router.post('/sites/{site}/runs/{run}/simulation/advance')
def advance_simulation(site:str,run:str,body:SimulationAdvance,actor=Depends(principal)):
    from app.main import database
    from .simulation import advance
    with database(write=True) as db:return advance(db,site,run,actor,body.to)

class PlaybackControl(CoreRecord):
    action:str=Field(pattern='^(play|pause)$')
    speed:float|None=Field(default=None,gt=0,le=240)

@router.post('/sites/{site}/runs/{run}/simulation/control')
def control_simulation(site:str,run:str,body:PlaybackControl,actor=Depends(principal)):
    from app.main import database
    from .playback import control
    with database(write=True) as db:return control(db,site,run,actor,body.action,body.speed)

@router.post('/sites/{site}/runs/{run}/simulation/replay',status_code=201)
def replay_simulation(site:str,run:str,body:RunCreate,actor=Depends(principal)):
    from app.main import database
    from .playback import replay
    try:
        with database(write=True) as db:return replay(db,site,run,actor,body.id,body.clock,body.seed)
    except sqlite3.IntegrityError:raise HTTPException(409,'Replay run already exists')

class InvitationCredential(CoreRecord):
    invitation_id:NonBlank
    person_id:NonBlank
    code:str=Field(min_length=8,max_length=128)
    expires_at:NonBlank

@router.post('/sites/{site}/runs/{run}/invitation-credentials')
def provision_invitation_credential(site:str,run:str,body:InvitationCredential,actor=Depends(principal)):
    from app.main import database
    from .interactions import issue_credential
    scoped(site,actor,'manage')
    with database(write=True) as db:
        state=world(db,site,run)
        invitation=state['entities'].get(body.invitation_id,{})
        person=state['entities'].get(body.person_id,{})
        if invitation.get('kind')!='Invitation' or person.get('kind')!='Person':raise HTTPException(422,'Existing invitation and person required in this run')
        expires=utc(body.expires_at)
        if expires<=state['clock']:raise HTTPException(422,'Credential expiry must be in the future')
        issue_credential(db,site,body.invitation_id,body.person_id,body.code,expires)
        event=emit(db,site,run,'main',state['clock'],'invitation.credential_issued',actor['actor'],{}, {'invitation_id':body.invitation_id,'person_id':body.person_id,'expires_at':expires,'simulated':True})
        return {'issued':True,'event_id':event['id'],'simulated':True}


@router.get('/sites/{site}/runs/{run}/events/{event_id}')
def event_detail(site:str,run:str,event_id:UUID,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    with database() as db:
        row=db.execute('SELECT * FROM office_events WHERE site=? AND run=? AND id=?',(site,run,str(event_id))).fetchone()
        if not row:raise HTTPException(404,'Event not found')
        visible=projection(world(db,site,run,row['branch']),actor)['entities']
        keys=[key for key in json.loads(row['entities']) if key in visible]
        if not unrestricted(actor) and not keys:raise HTTPException(403,'Event outside assigned resource scope')
        if not unrestricted(actor):return {'id':row['id'],'seq':row['seq'],'type':row['type'],'at':row['at'],'entities':keys,'immutable':True}
        return {**dict(row),'entities':keys,'payload':json.loads(row['payload']),'evidence':json.loads(row['evidence']),'immutable':True}


from .spatial import Routes as SpatialRoutes
@router.post('/sites/{site}/runs/{run}/spatial-routes')
def spatial_routes(site:str,run:str,body:SpatialRoutes,actor=Depends(principal)):
    from app.main import database
    from .spatial import register
    with database(write=True) as db:return register(db,site,run,actor,body)
