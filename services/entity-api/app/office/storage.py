import json
from datetime import datetime,timezone
from uuid import uuid4,uuid5,NAMESPACE_URL
from fastapi import HTTPException


def utc(value):
    try:
        stamp=datetime.fromisoformat(value.replace('Z','+00:00'))
        if stamp.tzinfo is None:raise ValueError()
        return stamp.astimezone(timezone.utc).isoformat()
    except (ValueError,TypeError,AttributeError):raise HTTPException(422,'Timezone-aware timestamp required')


def identity(*parts):return str(uuid5(NAMESPACE_URL,json.dumps(parts,separators=(',',':'))))
def now():return datetime.now(timezone.utc).isoformat()
def encode(value):return json.dumps(value,ensure_ascii=False,allow_nan=False,sort_keys=True)


def initialize(db):
    db.executescript('''
    CREATE TABLE IF NOT EXISTS office_schema(version INTEGER PRIMARY KEY);
    INSERT OR IGNORE INTO office_schema VALUES(1);
    CREATE TABLE IF NOT EXISTS office_sites(id TEXT PRIMARY KEY, name TEXT NOT NULL, timezone TEXT NOT NULL, config TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS office_accounts(username TEXT PRIMARY KEY, password_hash TEXT NOT NULL, salt TEXT NOT NULL, site TEXT NOT NULL REFERENCES office_sites(id), person TEXT, role TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS office_sessions(token_hash TEXT PRIMARY KEY, username TEXT NOT NULL REFERENCES office_accounts(username), expires_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS office_runs(site TEXT NOT NULL REFERENCES office_sites(id), id TEXT NOT NULL, clock TEXT NOT NULL, seed INTEGER NOT NULL, PRIMARY KEY(site,id));
    CREATE TABLE IF NOT EXISTS office_resources(site TEXT NOT NULL REFERENCES office_sites(id), id TEXT NOT NULL, core_id TEXT UNIQUE NOT NULL REFERENCES entities(id), kind TEXT NOT NULL, attributes TEXT NOT NULL, PRIMARY KEY(site,id));
    CREATE TABLE IF NOT EXISTS office_branches(site TEXT NOT NULL, run TEXT NOT NULL, id TEXT NOT NULL, base_seq INTEGER NOT NULL, base_clock TEXT NOT NULL, base_state TEXT NOT NULL, PRIMARY KEY(site,run,id));
    CREATE TABLE IF NOT EXISTS office_events(seq INTEGER PRIMARY KEY AUTOINCREMENT,id TEXT UNIQUE NOT NULL,site TEXT NOT NULL,run TEXT NOT NULL,branch TEXT NOT NULL,at TEXT NOT NULL,recorded_at TEXT NOT NULL,type TEXT NOT NULL,actor TEXT NOT NULL,entities TEXT NOT NULL,payload TEXT NOT NULL,evidence TEXT NOT NULL,command_id TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS office_event_time ON office_events(site,run,branch,at,seq);
    CREATE TRIGGER IF NOT EXISTS office_events_no_update BEFORE UPDATE ON office_events BEGIN SELECT RAISE(ABORT,'append-only event log'); END;
    CREATE TRIGGER IF NOT EXISTS office_events_no_delete BEFORE DELETE ON office_events BEGIN SELECT RAISE(ABORT,'append-only event log'); END;
    CREATE TABLE IF NOT EXISTS office_state(site TEXT NOT NULL,run TEXT NOT NULL,branch TEXT NOT NULL,entity TEXT NOT NULL,body TEXT NOT NULL,PRIMARY KEY(site,run,branch,entity));
    CREATE TABLE IF NOT EXISTS office_commands(site TEXT NOT NULL,run TEXT NOT NULL,branch TEXT NOT NULL,id TEXT NOT NULL,actor TEXT NOT NULL,fingerprint TEXT NOT NULL,result TEXT NOT NULL,PRIMARY KEY(site,run,branch,id));
    CREATE TABLE IF NOT EXISTS office_snapshots(site TEXT NOT NULL,run TEXT NOT NULL,branch TEXT NOT NULL,seq INTEGER NOT NULL,at TEXT NOT NULL,body TEXT NOT NULL,PRIMARY KEY(site,run,branch,seq));
    CREATE TABLE IF NOT EXISTS office_capabilities(id TEXT PRIMARY KEY,site TEXT NOT NULL,resource TEXT NOT NULL,operation TEXT NOT NULL,descriptor TEXT NOT NULL,adapter TEXT NOT NULL,UNIQUE(site,resource,operation));
    CREATE TABLE IF NOT EXISTS office_bindings(site TEXT NOT NULL,source TEXT NOT NULL,adapter TEXT NOT NULL,version TEXT NOT NULL,config TEXT NOT NULL,PRIMARY KEY(site,source));
    CREATE TABLE IF NOT EXISTS office_inbox(site TEXT NOT NULL,run TEXT NOT NULL,id TEXT NOT NULL,body TEXT NOT NULL,result TEXT NOT NULL,PRIMARY KEY(site,run,id));
    CREATE TABLE IF NOT EXISTS office_scenario_owners(site TEXT NOT NULL,run TEXT NOT NULL,branch TEXT NOT NULL,actor TEXT NOT NULL,PRIMARY KEY(site,run,branch));
    CREATE TABLE IF NOT EXISTS office_grants(site TEXT NOT NULL,username TEXT NOT NULL,resource TEXT NOT NULL,permission TEXT NOT NULL,PRIMARY KEY(site,username,resource,permission));
    INSERT OR IGNORE INTO office_schema VALUES(3);
    CREATE TABLE IF NOT EXISTS office_credentials(site TEXT NOT NULL,invitation TEXT NOT NULL,person TEXT,salt TEXT NOT NULL,code_hash TEXT NOT NULL,expires_at TEXT NOT NULL,source TEXT NOT NULL,used_by TEXT,PRIMARY KEY(site,invitation));
    INSERT OR IGNORE INTO office_schema VALUES(2);
    CREATE TABLE IF NOT EXISTS office_rejections(id TEXT PRIMARY KEY,site TEXT NOT NULL,source TEXT NOT NULL,at TEXT NOT NULL,reason TEXT NOT NULL);
    ''')
    if not db.execute('SELECT 1 FROM office_schema WHERE version=4').fetchone():
        from .catalog import declare
        for entry in db.execute("SELECT site,id FROM office_resources WHERE kind IN ('Camera','Sensor','HVAC','Equipment')").fetchall():declare(db,entry['site'],entry['id'])
        db.execute('INSERT INTO office_schema VALUES(4)')
    if not db.execute('SELECT 1 FROM office_schema WHERE version=5').fetchone():
        from .catalog import declare
        for entry in db.execute('SELECT site,id FROM office_resources').fetchall():declare(db,entry['site'],entry['id'])
        db.execute('INSERT INTO office_schema VALUES(5)')


def get_run(db,site,run):
    r=db.execute('SELECT * FROM office_runs WHERE site=? AND id=?',(site,run)).fetchone()
    if not r:raise HTTPException(404,'Run not found in this site')
    return dict(r)


def world(db,site,run,branch='main',at=None):
    clock=get_run(db,site,run)['clock']
    if branch!='main' and not db.execute('SELECT 1 FROM office_branches WHERE site=? AND run=? AND id=?',(site,run,branch)).fetchone():raise HTTPException(404,'Scenario not found')
    if branch!='main':clock=db.execute('SELECT base_clock FROM office_branches WHERE site=? AND run=? AND id=?',(site,run,branch)).fetchone()[0]
    params=(site,run,branch)
    if at is None:
        items={r['entity']:json.loads(r['body']) for r in db.execute('SELECT entity,body FROM office_state WHERE site=? AND run=? AND branch=?',params)}
    else:
        clock=utc(at)
        if clock>get_run(db,site,run)['clock']:raise HTTPException(422,'Historical reconstruction cannot claim a future observation')
        base=db.execute('SELECT * FROM office_snapshots WHERE site=? AND run=? AND branch=? AND at<=? ORDER BY seq DESC LIMIT 1',(*params,clock)).fetchone()
        items=json.loads(base['body']) if base else {};seq=base['seq'] if base else 0
        for e in db.execute('SELECT payload FROM office_events WHERE site=? AND run=? AND branch=? AND seq>? AND at<=? ORDER BY seq',(*params,seq,clock)):
            for key,patch in json.loads(e['payload']).get('changes',{}).items():items[key]={**items.get(key,{}),**patch}
    latest=db.execute('SELECT COALESCE(MAX(seq),0) FROM office_events WHERE site=? AND run=? AND branch=?'+(' AND at<=?' if at else ''),(*params,clock) if at else params).fetchone()[0]
    from .spatial import project
    project(db,site,run,clock,items,branch)
    # Freshness is derived, never erase the last evidence or claim silence means absence.
    for item in items.values():
        if item.get('observed_at'):
            age=(datetime.fromisoformat(clock)-datetime.fromisoformat(item['observed_at'])).total_seconds()
            item['freshness']='fresh' if 0<=age<=item.get('ttl_seconds',30) else 'stale'
        for reading in item.get('environment',{}).values():
            if isinstance(reading,dict) and reading.get('observed_at'):
                reading_age=(datetime.fromisoformat(clock)-datetime.fromisoformat(reading['observed_at'])).total_seconds()
                reading['freshness']='fresh' if 0<=reading_age<=120 else 'stale'
        if item.get('kind')=='Track' and item.get('person_id') and clock>item.get('association_until',''):
            item['last_associated_person_id']=item.pop('person_id')
            item['identity_status']='association_expired'
    from .occupancy import project as project_occupancy
    project_occupancy(items,clock)
    playback=None
    if at is None and branch=='main' and db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='office_simulation'").fetchone():
        columns={r[1] for r in db.execute('PRAGMA table_info(office_simulation)')}
        if 'speed' in columns:
            playback_row=db.execute('SELECT paused,speed FROM office_simulation WHERE site=? AND run=?',(site,run)).fetchone()
            if playback_row:playback={'paused':bool(playback_row['paused']),'speed':playback_row['speed']}
    return {'playback':playback,'timezone':db.execute('SELECT timezone FROM office_sites WHERE id=?',(site,)).fetchone()[0],'site_id':site,'run_id':run,'branch':branch,'clock':clock,'revision':latest,'entities':items,'historical':at is not None}


def emit(db,site,run,branch,at,kind,actor,changes,details=None,evidence=None,command_id=None):
    at=utc(at);event_id=str(uuid4());cmd=command_id or event_id
    from .graph import derive,active
    changes={k:dict(v) for k,v in changes.items()}
    for key,patch in changes.items():
        old=db.execute('SELECT body FROM office_state WHERE site=? AND run=? AND branch=? AND entity=?',(site,run,branch,key)).fetchone()
        merged={**(json.loads(old[0]) if old else {}),**patch}
        links=derive(merged,at)
        if links:patch['relations']=links
    payload={'changes':changes,**(details or {})}
    row=db.execute('INSERT INTO office_events(id,site,run,branch,at,recorded_at,type,actor,entities,payload,evidence,command_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
      (event_id,site,run,branch,at,now(),kind,actor,encode(list(changes)),encode(payload),encode(evidence or []),cmd))
    for key,patch in changes.items():
        old=db.execute('SELECT body FROM office_state WHERE site=? AND run=? AND branch=? AND entity=?',(site,run,branch,key)).fetchone()
        merged={**(json.loads(old[0]) if old else {}),**patch}
        db.execute('INSERT INTO office_state VALUES(?,?,?,?,?) ON CONFLICT(site,run,branch,entity) DO UPDATE SET body=excluded.body',(site,run,branch,key,encode(merged)))
        if branch=='main':
            resource=db.execute('SELECT core_id FROM office_resources WHERE site=? AND id=?',(site,key)).fetchone()
            if resource:
                for link in merged.get('relations',[]):
                    other=db.execute('SELECT core_id FROM office_resources WHERE site=? AND id=?',(site,link['target'])).fetchone()
                    if other and active(link,at):
                        db.execute('INSERT OR IGNORE INTO relations VALUES(?,?,?,?,?)',(identity(site,key,link['type'],link['target']),resource[0],other[0],link['type'],at))
                db.execute('INSERT INTO entity_state VALUES(?,?,?,?) ON CONFLICT(entity_id,key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',(resource[0],'office.run.'+run,encode(merged),at))
                from app.main import append_event
                append_event(db,resource[0],kind,{'office_event_id':event_id,'run_id':run,'effective_at':at,'details':details or {}},'office-domain')
    if row.lastrowid%25==0 and at==get_run(db,site,run)['clock']:
        state={r['entity']:json.loads(r['body']) for r in db.execute('SELECT entity,body FROM office_state WHERE site=? AND run=? AND branch=?',(site,run,branch))}
        db.execute('INSERT INTO office_snapshots VALUES(?,?,?,?,?,?)',(site,run,branch,row.lastrowid,at,encode(state)))
    return {'id':event_id,'sequence':row.lastrowid,'type':kind,'at':at,'entities':list(changes),'evidence':evidence or []}
