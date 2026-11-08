import sys,json,sqlite3
from uuid import uuid4
sys.path[:0]=['services/entity-api','services/entity-api/tests']
from test_office import OfficeTests
from app import main
x=OfficeTests();x.setUp();out=[]
def probe(name,method,path,body=None,headers=None):
 r=x.client.request(method,path,json=body,headers=headers or x.headers);out.append({'case':name,'status':r.status_code,'response':r.json()});return r
try:
 probe('anonymous_world','GET',x.root+'/world',headers={'Authorization':'Bearer invalid'})
 probe('cross_site_admin','GET',x.root+'/world',headers=x.auth('outsider'))
 probe('member_admin_write','POST',x.root+'/commands',{'id':str(uuid4()),'operation':'entity.upsert','target':'site','inputs':{'id':'foreign','kind':'Person','attributes':{}}},x.auth('luis'))
 probe('legacy_blocked_after_site_exists','PUT','/v1/entities/luis/state',{'key':'presence','value':True})
 probe('source_connector_impersonation','POST',x.root+'/observations',{'observation_id':str(uuid4()),'site_id':'office','source_id':'sensor','observed_at':x.state()['clock'],'type':'sensor.measurement','payload':{'name':'temperature','value':23,'unit':'C'},'provenance':{'connector_id':'simulated','simulated':True,'model_version':'audit'}},x.auth('connector'))
 probe('admin_reserved_identity_attributes','POST',x.root+'/commands',{'id':str(uuid4()),'operation':'entity.upsert','target':'site','inputs':{'id':'new-object','kind':'Light','attributes':{'id':'carlos','kind':'Person','zone_id':'missing-zone'}}})
 probe('admin_dangling_reference','POST',x.root+'/commands',{'id':str(uuid4()),'operation':'entity.upsert','target':'site','inputs':{'id':'new-device','kind':'Light','attributes':{'zone_id':'missing-zone'}}})
 state=x.state();out.append({'case':'projection_after_reserved_fields','new_object':state['entities'].get('new-object'),'carlos':state['entities'].get('carlos'),'new_device':state['entities'].get('new-device')})
 with main.database() as db:out.append({'case':'sqlite_integrity','integrity_check':db.execute('PRAGMA integrity_check').fetchone()[0],'foreign_key_check':[list(r) for r in db.execute('PRAGMA foreign_key_check')]})
finally:x.tearDown()
open('.runtime/backend-audit/scoped-probes.json','w').write(json.dumps(out,indent=2))
