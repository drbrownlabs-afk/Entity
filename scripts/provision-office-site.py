"""Onboard a separate fictitious/authorized site using the same domain, no scene assumptions."""
import argparse,json,os,sys,secrets,hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'services/entity-api'))
parser=argparse.ArgumentParser();parser.add_argument('configuration');parser.add_argument('--database',required=True)
args=parser.parse_args();config=json.loads(Path(args.configuration).read_text())
os.environ['ENTITY_SQLITE_PATH']=str(Path(args.database).resolve())
from app import main
from app.office.service import site_create,upsert_resource,create_run
from app.office.auth import create_account
from app.office.storage import encode
from app.schemas import CoreRecord,NonBlank
from pydantic import Field
class Resource(CoreRecord):
    id:NonBlank
    kind:NonBlank
    attributes:dict=Field(default_factory=dict)
class Configuration(CoreRecord):
    id:NonBlank
    name:NonBlank
    timezone:NonBlank
    clock:NonBlank
    resources:list[Resource]
    accounts:list[dict]
config=Configuration.model_validate(config).model_dump(exclude={'schema_version'})
fingerprint=hashlib.sha256(encode(config).encode()).hexdigest();main.initialize()
credentials={}
with main.database(write=True) as db:
    old=db.execute('SELECT config FROM office_sites WHERE id=?',(config['id'],)).fetchone()
    if old:
        if json.loads(old[0]).get('configuration_sha256')!=fingerprint:raise SystemExit('Existing site differs; no data overwritten. Apply reviewed additive domain changes.')
        print('Existing site preserved, configuration identical.');raise SystemExit(0)
    site_create(db,config['id'],config['name'],config['timezone'],{'configuration_sha256':fingerprint,'source':'explicit-site-configuration','fictitious':True})
    for resource in config['resources']:
        upsert_resource(db,config['id'],resource['id'],resource['kind'],resource['attributes'])
    for account in config['accounts']:
        username=config['id']+':'+account['username'];password=secrets.token_urlsafe(24)
        create_account(db,username,password,config['id'],account['role'],account.get('person'))
        for grant in account.get('grants',[]):db.execute('INSERT INTO office_grants VALUES(?,?,?,?)',(config['id'],username,grant['resource'],grant['permission']))
        credentials[username]={'password':password,'role':account['role']}
    create_run(db,config['id'],'onboarding',config['clock'])
path=Path(args.database).resolve().parent/(config['id']+'-access.json')
fd=os.open(path,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600)
with os.fdopen(fd,'w') as stream:json.dump(credentials,stream,indent=2)
print('Site provisioned without changing domain code:',config['id'])
print('Private credentials:',path)
