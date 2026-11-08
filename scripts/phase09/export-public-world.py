"""Export the EXISTING Core simulator as a labelled public replay, never a fake live backend."""
import json,os,sys,tempfile,subprocess,hashlib
from pathlib import Path
from datetime import datetime,timedelta
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'services/entity-api'))
from app import main
from app.office.storage import world,encode
from app.office.service import create_run,command
from app.office.simulation import install_day,advance
from app.office.auth import ROLES
from app.office.catalog import OPERATIONS
actor={'actor':'synthetic-demo-operator','site':'synthetic-office','role':'admin','person':None,'permissions':ROLES['admin']}
output=ROOT/'apps/web/public/office/demo-trace.json'
with tempfile.TemporaryDirectory(prefix='entity-public-export-') as folder:
    database=Path(folder)/'core.sqlite3'
    subprocess.run([sys.executable,'scripts/bootstrap-office.py','--database',str(database)],cwd=ROOT,check=True,capture_output=True)
    main.DB_PATH=database
    profile=json.loads((ROOT/'worlds/synthetic-office/daily-spatial-profile.json').read_text())
    points=json.loads((ROOT/'worlds/synthetic-office/corridor-route.json').read_text())['floor_points']
    standing=next(s['foot_position'] for s in json.loads((ROOT/'docs/evidence/phase09/voxel-ground.json').read_text())['route_clearance'] if s['segment']==1 and s['t']==.5 and s['blocked'] is False)
    profile['id']='public-calibrated-corridor-v1'
    # Positions are actual original-voxel measurements. This is a site simulation profile,
    # not another geometry/physics engine, nor an assertion about actual people at this place.
    profile['motions'][0]['waypoints']=[{'offset_seconds':s,'position':points[i]['position'],'evidence':points[i]['evidence']} for s,i in [(0,0),(10,1),(60,1)]]
    profile['motions'].append({**profile['motions'][0],'person_id':'PERSON-CARLOS','avatar_id':'Male_Adult_02','waypoints':[{'offset_seconds':s,'position':standing,'evidence':'docs/evidence/phase09/voxel-ground.json; segment1 t0.5 clear capsule'} for s in [0,60]]})
    cameras=json.loads((ROOT/'worlds/synthetic-office/inspection-cameras.json').read_text())['poses']
    pixel=json.loads(subprocess.check_output(['node','scripts/phase09/project-camera.mjs'],cwd=ROOT,input=json.dumps({'camera':{'position':cameras[0],'target':cameras[2],'fov':85},'position':[standing[0],standing[1]+.9,standing[2]]}),text=True))
    with main.database(write=True) as db:
        config=json.loads(db.execute('SELECT config FROM office_sites WHERE id=?',('synthetic-office',)).fetchone()[0]);config['daily_spatial_profile']=profile
        db.execute('UPDATE office_sites SET config=? WHERE id=?',(encode(config),'synthetic-office'))
        run='public-office-v5';create_run(db,'synthetic-office',run,'2026-11-07T08:00:00-05:00',1);install_day(db,'synthetic-office',run,actor)
        # Same normalized observation and authorized simulated staff verification as daily sources.
        db.execute('INSERT INTO office_schedule(site,run,id,at,action,payload) VALUES(?,?,?,?,?,?)',('synthetic-office',run,'public-carlos-observation','2026-11-07T14:15:00+00:00','camera',encode({'source_id':'CAM-ROUTE-1','tracks':[{'local_track_id':'carlos-synthetic','zone_id':'CIRCULATION-01','position':pixel}]})))
        db.execute('INSERT INTO office_schedule(site,run,id,at,action,payload) VALUES(?,?,?,?,?,?)',('synthetic-office',run,'public-carlos-verification','2026-11-07T14:15:00+00:00','badge',encode({'camera':'CAM-ROUTE-1','local_id':'carlos-synthetic','person_id':'PERSON-CARLOS'})))
        times={r[0] for r in db.execute('SELECT at FROM office_schedule WHERE site=? AND run=?',('synthetic-office',run))}
        start=datetime.fromisoformat('2026-11-07T14:15:00+00:00')
        times|={(start+timedelta(seconds=i)).isoformat() for i in range(61)}
        initial=world(db,'synthetic-office',run);previous=initial['entities'];frames=[]
        for at in sorted(times):
            advance(db,'synthetic-office',run,actor,at);state=world(db,'synthetic-office',run)
            changes={key:value for key,value in state['entities'].items() if previous.get(key)!=value}
            frames.append({'clock':state['clock'],'revision':state['revision'],'changes':changes,'removed':[k for k in previous if k not in state['entities']]});previous=state['entities']
        events=[{**{k:r[k] for k in ['seq','id','at','type','actor']},'entities':json.loads(r['entities']),'payload':json.loads(r['payload']),'evidence':json.loads(r['evidence'])} for r in db.execute('SELECT * FROM office_events WHERE site=? AND run=? ORDER BY seq',('synthetic-office',run))]
        routes=[json.loads(r[0]) for r in db.execute('SELECT body FROM office_spatial_routes WHERE site=? AND run=? ORDER BY registered_seq,id',('synthetic-office',run))]
        checks=[]
        for seconds in [0,2.375,5,9.5,10,10.125,30,59.5,60]:
            at=(start+timedelta(seconds=seconds)).isoformat();state=world(db,'synthetic-office',run,at=at)
            checks.append({'clock':at,'people':{key:state['entities'][key]['spatial_pose'] for key in ['PERSON-LUIS','PERSON-CARLOS']}})
        capabilities=[d for r in db.execute('SELECT descriptor FROM office_capabilities WHERE site=?',('synthetic-office',)) if (d:=json.loads(r[0]))['canonical_id'] in {'booking.create','booking.cancel'}]
    trace={'schema_version':'1.0','mode':'synthetic-core-replay','core_connected':False,'persistence':'session-only','source':'Existing ENTITY Core daily simulator and normalized observations; original measured corridor routes','generator':'scripts/phase09/export-public-world.py','topology_version':5,'source_profile':profile,'routes':routes,'initial':initial,'frames':frames,'events':events,'capabilities':capabilities,'default_clock':'2026-11-07T14:15:03+00:00','play_window':['2026-11-07T14:15:00+00:00','2026-11-07T14:16:00+00:00'],'verification_samples':checks}
    def inspect(value):
        if isinstance(value,dict):
            for k,v in value.items():
                if k in {'password','token','password_hash','salt','code_hash','verification_code'}:raise RuntimeError('Secret field would enter public replay: '+k)
                inspect(v)
        elif isinstance(value,list):
            for v in value:inspect(v)
    inspect(trace);output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(trace,ensure_ascii=False,separators=(',',':'))+'\n')
    print(json.dumps({'path':str(output.relative_to(ROOT)),'bytes':output.stat().st_size,'entities':len(initial['entities']),'frames':len(frames),'events':len(events),'sha256':hashlib.sha256(output.read_bytes()).hexdigest()}))
