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
    with database() as db:return world(db,site,run,branch,at)

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
        with database() as db:return query(db,site,run,data)
    except (KeyError,TypeError,ValueError):raise HTTPException(422,'Required query parameters missing or invalid')

@router.get('/sites/{site}/capabilities')
def capabilities(site:str,resource_id:str|None=None,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    with database() as db:return [json.loads(r[0]) for r in db.execute('SELECT descriptor FROM office_capabilities WHERE site=?'+(' AND resource=?' if resource_id else ''),(site,resource_id) if resource_id else (site,))]

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
        get_run(db,site,run)
        return [{**dict(r),'entities':json.loads(r['entities']),'payload':json.loads(r['payload']),'evidence':json.loads(r['evidence'])} for r in db.execute('SELECT * FROM office_events WHERE site=? AND run=? AND branch=? AND seq>? ORDER BY seq LIMIT ?',(site,run,branch,after,limit))]

@router.get('/sites/{site}/runs/{run}/stream')
async def stream(site:str,run:str,request:Request,after:int=0,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    with database() as db:get_run(db,site,run)
    async def generate():
        cursor=after
        while not await request.is_disconnected():
            try:scoped(site,authenticate(request.headers.get('authorization')),'read')
            except HTTPException:
                yield 'event: auth-expired\ndata: {}\n\n'
                return
            with database() as db:rows=db.execute("SELECT seq,id,type,at,entities FROM office_events WHERE site=? AND run=? AND branch='main' AND seq>? ORDER BY seq LIMIT 100",(site,run,cursor)).fetchall()
            for row in rows:
                cursor=row['seq'];yield f'id: {cursor}\nevent: world-change\ndata: {encode(dict(row))}\n\n'
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
            return world(db,site,run,body.id)
    except sqlite3.IntegrityError:raise HTTPException(409,'Scenario already exists')

@router.get('/sites/{site}/runs/{run}/scenarios/{branch}/comparison')
def compare(site:str,run:str,branch:str,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'read')
    with database() as db:
        state=world(db,site,run,branch)
        base=db.execute('SELECT * FROM office_branches WHERE site=? AND run=? AND id=?',(site,run,branch)).fetchone()
        if not base:raise HTTPException(404,'Scenario missing')
        initial=json.loads(base['base_state'])
        return {'base_revision':base['base_seq'],'current_official_revision':world(db,site,run)['revision'],'changes':{k:{'before':initial.get(k),'after':v} for k,v in state['entities'].items() if initial.get(k)!=v},'official_modified':False}

@router.post('/sites/{site}/runs/{run}/scenarios/{branch}/apply')
def apply(site:str,run:str,branch:str,body:Apply,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,'operate')
    with database(write=True) as db:
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
