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
from app.office.provision import provision
credentials={}
with main.database(write=True) as db:
    changed=provision(db,site,original,args.day+'T08:00:00-05:00')
    for username,role,person in [('admin','admin',None),('jose','operator','PERSON-JOSE'),('entity-kiosk','kiosk','KIOSK-01'),('carlos','member','PERSON-CARLOS'),('luis','member','PERSON-LUIS'),('mateo','maintenance','PERSON-MATEO')]:
        username=username if site=='synthetic-office' else site+':'+username
        if db.execute('SELECT 1 FROM office_accounts WHERE username=?',(username,)).fetchone():continue
        password=secrets.token_urlsafe(18);create_account(db,username,password,site,role,person);credentials[username]={'password':password,'role':role}
    jose='jose' if site=='synthetic-office' else site+':jose'
    for target in ['ZONE-D','ZONE-E','CAM-05','CAM-06','MEETING-AREA-01','PERSON-LUIS','PERSON-JOSE','WAITING-AREA','RECEPTION']:
        for permission in ['read','write']:
            db.execute('INSERT OR IGNORE INTO office_grants VALUES(?,?,?,?)',(site,jose,target,permission))
    if not db.execute('SELECT 1 FROM office_runs WHERE site=? AND id=?',(site,'day-01')).fetchone():
        create_run(db,site,'day-01',args.day+'T08:00:00-05:00')
private=Path(args.database).resolve().parent/'access.json';private.parent.mkdir(parents=True,exist_ok=True)
if credentials:
    prior=json.loads(private.read_text()) if private.exists() else {}
    fd=os.open(private,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600)
    with os.fdopen(fd,'w') as stream:json.dump({**prior,**credentials},stream,indent=2)
print('Persistent inventory migrated' if changed else 'Existing topology preserved; no reset')
print('Private local credentials:',private)
