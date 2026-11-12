"""09.19 bounded read-only probes of the existing Core; no writes or DB copies."""
import json
import sqlite3
import statistics
import sys
import time
import argparse
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'services/entity-api'))
parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path);args=parser.parse_args()
from app.office.storage import world
from app.office.queries import query

dbpath=ROOT/'simulation/spatial-office/.runtime/p2-core.sqlite3'
site='coworking-p2';run='p2-09-accept18-v0-r2'
def connect():
    db=sqlite3.connect(dbpath.as_uri()+'?mode=ro',uri=True)
    db.row_factory=sqlite3.Row;db.execute('PRAGMA query_only=ON');return db
def stats(values):return {'samples':len(values),'p50_ms':statistics.median(values),'p95_ms':sorted(values)[int(.95*(len(values)-1))]}
def measure(operation,n=20):
    values=[]
    for _ in range(n):
        before=time.perf_counter();operation();values.append((time.perf_counter()-before)*1000)
    return stats(values)

with connect() as db:
    oid=db.execute('SELECT id FROM office_inbox WHERE site=? AND run=? LIMIT 1',(site,run)).fetchone()[0]
    state=world(db,site,run)
    result={'phase':'P2-09.19','database_read_only':True,'database_copied':False,'sample_run':run,
            'state_entities':len(state['entities']),'database_mib':dbpath.stat().st_size/1024**2,
            'journal_mode':db.execute('PRAGMA journal_mode').fetchone()[0],
            'connection_default_synchronous':db.execute('PRAGMA synchronous').fetchone()[0],
            'world_same_connection':measure(lambda:world(db,site,run)),
            'read_state_json_only':measure(lambda:[json.loads(r[0]) for r in db.execute('SELECT body FROM office_state WHERE site=? AND run=? AND branch=?',(site,run,'main'))]),
            'latest_revision_only':measure(lambda:db.execute('SELECT COALESCE(MAX(seq),0) FROM office_events WHERE site=? AND run=? AND branch=?',(site,run,'main')).fetchone()),
            'inbox_lookup_same_connection':measure(lambda:db.execute('SELECT body,result FROM office_inbox WHERE site=? AND run=? AND id=?',(site,run,oid)).fetchone())}
    local=next((k for k,v in state['entities'].items() if v.get('kind')=='Track' and v.get('camera_id') and v.get('active') and v.get('freshness')=='fresh'),None)
    if local:
        answer=query(db,site,run,{'kind':'location','entity_id':local})['result']
        result['location_semantics_probe']={'track_coordinate_frame':state['entities'][local].get('coordinate_frame'),
            'query_status':answer['status'],'query_zone_id':answer['zone_id'],
            'confirmed_status_without_world_zone':answer['status']=='confirmed' and answer['zone_id'] is None,
            'interpretation':'visual activity is not a confirmed world location; contract needs explicit distinction'}
    route_table=db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='office_spatial_routes'").fetchone()
    result['simulator_routes_table_present']=bool(route_table)
    result['simulator_routes_in_sample_run']=db.execute('SELECT COUNT(*) FROM office_spatial_routes WHERE site=? AND run=?',(site,run)).fetchone()[0] if route_table else 0
db.close()
def new_connection_world():
    db=connect()
    try:world(db,site,run)
    finally:db.close()
result['world_new_connection']=measure(new_connection_world,12)
status_path=ROOT/'simulation/spatial-office/.runtime/accept18-core-resume-status.json'
result['acceptance_core_supervisor_completed_at_probe_end']=json.loads(status_path.read_text()).get('done') if status_path.exists() else None
result['limitations']=['Acceptance Core completed; other host activity uncontrolled' if result['acceptance_core_supervisor_completed_at_probe_end'] else 'Concurrent or unknown acceptance Core activity; not exclusive capacity benchmark',
                       'Read-only probe does not attribute write/commit/HTTP costs or GPU saturation',
                       'synchronous is connection default; production uses same connect defaults and no override found in code']
out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.19';out.mkdir(parents=True,exist_ok=True)
(args.output or out/'core-readonly.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
