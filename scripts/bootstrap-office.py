"""Provision an empty local coworking using ORIGINAL SuperSplat annotations, never a new building."""
import argparse,json,os,secrets,sys
from datetime import datetime,timedelta
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'services/entity-api'))
parser=argparse.ArgumentParser();parser.add_argument('--database',default=str(root/'.runtime/office/core.sqlite3'));parser.add_argument('--day',default='2026-11-07');parser.add_argument('--site',default='synthetic-office');parser.add_argument('--settings',default=str(root/'worlds/synthetic-office/original-viewer-settings.json'));args=parser.parse_args();site=args.site
os.environ['ENTITY_SQLITE_PATH']=str(Path(args.database).resolve())
from app import main
from app.office.storage import now,encode
from app.office.service import site_create,upsert_resource,create_run
from app.office.auth import create_account
main.initialize()
original=json.loads(Path(args.settings).read_text())
credentials={}
with main.database(write=True) as db:
    if db.execute('SELECT 1 FROM office_sites WHERE id=?',(site,)).fetchone():
        print('Existing site preserved; no reseed, overwrite or credential reset.');raise SystemExit(0)
    site_create(db,site,'Synthetic Office — original scene','America/Guayaquil',{'scene_url':'https://superspl.at/scene/a972d838','license':'CC BY-NC4.0','spatial_mapping':'original annotation anchors; individual seat/access/HVAC calibration pending'})
    desk_counter=0;meeting_counter=0
    for index,annotation in enumerate(original['settings']['annotations']):
        key='annotation-'+str(index)
        upsert_resource(db,site,key,'Zone',{'name':annotation['title'],'annotation_index':index,'position':annotation['position'],'coordinate_frame':'supersplat-original','annotation_source':'published-settings','relations':[]})
        camera=annotation['camera']['initial']
        cam='CAM-'+str(index+1).zfill(2)
        upsert_resource(db,site,cam,'Camera',{'name':cam+' · vista virtual guardada','virtual':True,'position':camera['position'],'target':camera['target'],'fov':camera['fov'],'covered_zones':[key],'coverage_mode':'synthetic-declared; physical calibration not claimed','connectivity':'connected','annotation_index':index,'retention_days':7})
        upsert_resource(db,site,'STREAM-'+str(index+1).zfill(2),'Stream',{'camera_id':cam,'type':'virtual-render','video_recorded':False})
        db.execute('INSERT INTO office_bindings VALUES(?,?,?,?,?)',(site,cam,'simulated','1.0','{}'))
        if 'Conference Table' in annotation['title']:
            meeting_counter+=1
            upsert_resource(db,site,'MEETING-AREA-'+str(meeting_counter).zfill(2),'EventSpace',{'name':'Mesa abierta de conferencias · 8 personas','capacity':8,'zone_id':key,'annotation_index':index,'position':annotation['position'],'enclosed_room':False})
        elif 'Office Bench' in annotation['title']:
            group='BENCH-'+str(desk_counter//6+1)
            members=['DESK-'+str(desk_counter+i+1).zfill(2) for i in range(6)]
            upsert_resource(db,site,group,'EventSpace',{'name':annotation['title'],'capacity':6,'zone_id':key,'annotation_index':index,'position':annotation['position'],'member_resources':members,'enclosed_room':False})
            for seat in range(6):
                desk_counter+=1;number=desk_counter
                upsert_resource(db,site,'DESK-'+str(number).zfill(2),'Desk',{'name':'Puesto '+str(number),'capacity':1,'zone_id':key,'annotation_index':index,'position':annotation['position'],'position_is_group_anchor':True,'individual_seat_calibrated':False})
    # Operational entities do not assert physical equipment/locations in the published scan.
    upsert_resource(db,site,'WAITING-AREA','WaitingArea',{'name':'Zona de espera pendiente de mapeo','capacity':4,'spatial_mapping':'not-calibrated','position':None})
    upsert_resource(db,site,'ACCESS-01','AccessPoint',{'name':'Acceso simulado, ubicación pendiente','zone_id':'annotation-1','spatial_mapping':'not-calibrated','virtual':True})
    upsert_resource(db,site,'HVAC-01','HVAC',{'name':'HVAC simulado de ensayo','zone_id':'annotation-0','status':'operational','virtual':True,'physical_device_verified':False,'estimated_power_w':1200})
    upsert_resource(db,site,'SENSOR-01','Sensor',{'name':'Sensor ambiental simulado','zone_id':'annotation-0','virtual':True})
    db.execute('INSERT INTO office_bindings VALUES(?,?,?,?,?)',(site,'SENSOR-01','simulated','1.0','{}'))
    for key,name,roles in [('PERSON-LUIS','Luis',['member']),('PERSON-CARLOS','Carlos',['member']),('PERSON-SOFIA','Sofía',['staff']),('PERSON-MATEO','Mateo',['staff'])]:
        upsert_resource(db,site,key,'Person',{'name':name,'roles':roles,'fictitious':True,'membership_status':'active','membership_until':'2027-12-31T00:00:00+00:00','presence':'unknown'})
    upsert_resource(db,site,'SHIFT-SOFIA','Shift',{'person_id':'PERSON-SOFIA','starts_at':args.day+'T13:00:00+00:00','ends_at':args.day+'T23:30:00+00:00','responsibilities':['reception','visitor-registration']})
    for username,role,person in [('admin','admin',None),('sofia','reception','PERSON-SOFIA'),('luis','member','PERSON-LUIS'),('mateo','maintenance','PERSON-MATEO')]:
        username=username if site=='synthetic-office' else site+':'+username
        password=secrets.token_urlsafe(18);create_account(db,username,password,site,role,person);credentials[username]={'password':password,'role':role}
    create_run(db,site,'day-01',args.day+'T08:00:00-05:00')
private=Path(args.database).resolve().parent/'access.json';private.parent.mkdir(parents=True,exist_ok=True)
fd=os.open(private,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600)
with os.fdopen(fd,'w') as stream:json.dump(credentials,stream,indent=2)
print('Original annotation inventory and persistent coworking provisioned. Private local credentials:',private)
