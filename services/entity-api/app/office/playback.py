"""One persistent Core clock producer; clients control it and render its state."""
import asyncio,time,sqlite3,json
from datetime import datetime,timedelta
from fastapi import HTTPException
from .auth import scoped,ROLES
from .storage import get_run,emit
from .simulation import setup,advance

def configure(db):
    setup(db)
    columns={r[1] for r in db.execute('PRAGMA table_info(office_simulation)')}
    for name,definition in [('speed','REAL NOT NULL DEFAULT 1'),('controller','TEXT'),('last_tick','REAL NOT NULL DEFAULT 0')]:
        if name not in columns:db.execute('ALTER TABLE office_simulation ADD COLUMN '+name+' '+definition)

def control(db,site,run,actor,action,speed=None):
    scoped(site,actor,'simulate');configure(db);clock=get_run(db,site,run)['clock']
    row=db.execute('SELECT * FROM office_simulation WHERE site=? AND run=?',(site,run)).fetchone()
    if not row:raise HTTPException(409,'Install the daily simulation on this run first')
    paused=action=='pause';rate=float(speed if speed is not None else row['speed'])
    end=db.execute('SELECT MAX(at) FROM office_schedule WHERE site=? AND run=?',(site,run)).fetchone()[0]
    if not paused and (not end or clock>=end):raise HTTPException(409,'Daily simulation finished; create a new replay run')
    if bool(row['paused'])==paused and row['speed']==rate:return {'paused':paused,'speed':rate,'changed':False}
    db.execute('UPDATE office_simulation SET paused=?,speed=?,controller=?,last_tick=? WHERE site=? AND run=?',(int(paused),rate,actor['actor'],time.monotonic(),site,run))
    event=emit(db,site,run,'main',clock,'simulation.paused' if paused else 'simulation.playing',actor['actor'],{}, {'speed':rate,'clock_authority':'Core','step_seconds':.25})
    return {'paused':paused,'speed':rate,'changed':True,'event':event}

def recover():
    from app.main import database
    with database(write=True) as db:
        if not db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='office_simulation'").fetchone():return
        configure(db)
        for row in db.execute('SELECT site,run FROM office_simulation WHERE paused=0').fetchall():
            db.execute('UPDATE office_simulation SET paused=1 WHERE site=? AND run=?',(row['site'],row['run']))
            emit(db,row['site'],row['run'],'main',get_run(db,row['site'],row['run'])['clock'],'simulation.paused_on_restart','server-recovery',{}, {'offline_time_applied':False})

def tick_once():
    from app.main import database
    with database() as db:
        if not db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='office_simulation'").fetchone():return
        active=[dict(r) for r in db.execute('SELECT site,run FROM office_simulation WHERE paused=0')]
    for identity in active:
        site,run=identity['site'],identity['run']
        try:
            with database(write=True) as db:
                row=db.execute('SELECT * FROM office_simulation WHERE site=? AND run=?',(site,run)).fetchone()
                now=time.monotonic()
                # SQLite transaction and the shared slot prevent two API workers double-ticking.
                if row['paused'] or now-row['last_tick']<.25:continue
                end=db.execute('SELECT MAX(at) FROM office_schedule WHERE site=? AND run=?',(site,run)).fetchone()[0]
                current=get_run(db,site,run)['clock'];next_time=min(datetime.fromisoformat(end),datetime.fromisoformat(current)+timedelta(seconds=.25*row['speed']))
                actor={'actor':'clock:'+str(row['controller']),'site':site,'role':'admin','person':None,'permissions':ROLES['admin']}
                advance(db,site,run,actor,next_time.isoformat())
                db.execute('UPDATE office_simulation SET last_tick=?,paused=? WHERE site=? AND run=?',(now,int(next_time>=datetime.fromisoformat(end)),site,run))
        except sqlite3.OperationalError:
            # A busy database does not advance the clock or partially commit a step.
            continue
        except Exception as error:
            with database(write=True) as db:
                db.execute('UPDATE office_simulation SET paused=1 WHERE site=? AND run=?',(site,run))
                emit(db,site,run,'main',get_run(db,site,run)['clock'],'simulation.playback_failed','clock-service',{}, {'http_status':error.status_code if isinstance(error,HTTPException) else None,'reason':'Step rolled back; repair the failing component before resuming'})

async def worker(stop):
    while not stop.is_set():
        await asyncio.to_thread(tick_once)
        try:await asyncio.wait_for(stop.wait(),timeout=.1)
        except TimeoutError:pass


def active_run(db,site):
    row=db.execute('SELECT config FROM office_sites WHERE id=?',(site,)).fetchone()
    if not row:raise HTTPException(404,'Site not found')
    run=json.loads(row['config']).get('active_run_id')
    if not run:
        fallback=db.execute('SELECT id FROM office_runs WHERE site=? ORDER BY rowid LIMIT 1',(site,)).fetchone()
        if not fallback:raise HTTPException(404,'No runs available')
        run=fallback['id']
    current=get_run(db,site,run)
    return {'id':run,'clock':current['clock']}


def replay(db,site,run,actor,new_id,clock,seed):
    from .service import create_run
    from .simulation import install_day
    from .storage import encode
    scoped(site,actor,'simulate')
    if active_run(db,site)['id']!=run:raise HTTPException(409,'The active run changed; refresh before creating a replay')
    # All changes share the request transaction; a failed install leaves the old world intact.
    configure(db)
    for playing in db.execute('SELECT run FROM office_simulation WHERE site=? AND paused=0',(site,)).fetchall():
        control(db,site,playing['run'],actor,'pause')
    create_run(db,site,new_id,clock,seed)
    install_day(db,site,new_id,actor)
    config=json.loads(db.execute('SELECT config FROM office_sites WHERE id=?',(site,)).fetchone()[0])
    config['active_run_id']=new_id
    db.execute('UPDATE office_sites SET config=? WHERE id=?',(encode(config),site))
    for affected in [run,new_id]:
        emit(db,site,affected,'main',get_run(db,site,affected)['clock'],'site.active_run_changed',actor['actor'],{}, {'previous_run':run,'active_run':new_id,'history_preserved':True})
    return active_run(db,site)
