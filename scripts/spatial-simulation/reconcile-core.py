"""Additive, idempotent structural reconciliation through P1. No business scenarios or deletions."""
import argparse,json,uuid
from pathlib import Path
import httpx
p=argparse.ArgumentParser();p.add_argument('--api',required=True);p.add_argument('--configuration',required=True);p.add_argument('--credentials',required=True);a=p.parse_args();cfg=json.loads(Path(a.configuration).read_text());site=cfg['id'];credentials=json.loads(Path(a.credentials).read_text());username=site+':admin';changes=0
with httpx.Client(base_url=a.api,timeout=20)as c:
 r=c.post('/v1/office/auth/login',json={'username':username,'password':credentials[username]['password']});r.raise_for_status();c.headers['Authorization']='Bearer '+r.json()['token'];r=c.get(f'/v1/sites/{site}/active-run');r.raise_for_status();run=r.json()['id'];prefix=f'/v1/sites/{site}/runs/{run}'
 def world():
  r=c.get(prefix+'/world');r.raise_for_status();return r.json()['entities']
 def command(op,inputs,seed):
  global changes
  cid=str(uuid.uuid5(uuid.NAMESPACE_URL,json.dumps([site,run,op,inputs,seed],sort_keys=True)));r=c.post(prefix+'/commands',json={'id':cid,'operation':op,'target':'site','inputs':inputs});r.raise_for_status();changes+=1
 items=world()
 # Establish all stable identities before applying attributes that reference other entities.
 for resource in cfg['resources']:
  if resource['id']not in items:
   command('entity.upsert',{'id':resource['id'],'kind':resource['kind'],'attributes':{'name':resource['attributes'].get('name',resource['id']),'registration_source':'P2 structural identity registration','operational_state':'unknown',**{k:resource['attributes'][k]for k in ['declaration_only','integration_status','model_status','spatial_status']if k in resource['attributes']}}},'identity-before-links');items[resource['id']]={'id':resource['id'],'kind':resource['kind']}
 items=world()
 for resource in cfg['resources']:
  key=resource['id'];old=items.get(key,{});attrs=dict(resource['attributes'])
  if old.get('kind')and old['kind']!=resource['kind']:raise RuntimeError('Immutable kind mismatch: '+key)
  if 'operational_state'in old:attrs.pop('operational_state',None)
  if old and all(old.get(k)==v for k,v in attrs.items()):continue
  command('entity.upsert',{'id':key,'kind':resource['kind'],'attributes':attrs},{k:old.get(k)for k in attrs})
 items=world()
 # Preserve earlier logical test identities while correcting registry membership semantics.
 for key,old in list(items.items()):
  if old.get('kind')=='Person'and old.get('real_person_verified')is False and old.get('position')is None and old.get('parent_resource')=='site':
   command('entity.upsert',{'id':key,'kind':'Person','attributes':{'parent_resource':None,'registry_id':'site'}},'8.1 nonphysical registration');items[key]={**old,'parent_resource':None,'registry_id':'site'}
 for key,old in list(items.items()):
  if old.get('kind')=='Person'and key not in {r['id']for r in cfg['resources']}and old.get('real_person_verified')is False and old.get('demo_population')is not False:
   command('entity.upsert',{'id':key,'kind':'Person','attributes':{'demo_population':False,'registry_scope':'historical-technical-test-only; retained, not part of twelve-person demo'}},'8.2 preserve historical tests outside demo population');items[key]={**old,'demo_population':False}
 for edge in cfg.get('structural_relations',[]):
  if any(r['type']==edge['type']and r['target']==edge['target']and not r.get('valid_to')for r in items[edge['source']].get('relations',[])):continue
  command('relation.add',edge,'structural-scene-evidence');items[edge['source']].setdefault('relations',[]).append({**edge,'valid_to':None})
 items=world()
 if not items['site'].get('last_memory_id'):
  command('entity.remember',{'content':'Registro estructural de la entidad madre Coworking: identidad estable, estado propio desconocido y referencia al conjunto espacial. No es la raíz de todo el modelo ENTITY; no se infiere ocupación.','source':'P2:structural-registration'},'coworking-root-8.1');items=world()
 c.post('/v1/office/auth/logout');print(json.dumps({'structural_commands_applied':changes,'entities_preserved':len(items),'deleted':0,'operational_flows_executed':False}))
