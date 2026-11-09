"""Read-only technical Core inspection. Export structure, never operational queries or scenarios."""
import sqlite3,json,argparse
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--database',required=True);p.add_argument('--configuration',required=True);p.add_argument('--output',required=True);a=p.parse_args();cfg=json.loads(Path(a.configuration).read_text());keys={'site',*[r['id']for r in cfg['resources']]};db=sqlite3.connect('file:'+str(Path(a.database).resolve())+'?mode=ro',uri=True);db.row_factory=sqlite3.Row
rows={r['id']:dict(r)for r in db.execute('SELECT id,core_id,kind,attributes FROM office_resources WHERE site=?',(cfg['id'],))if r['id']in keys};assert len(rows)==len(keys)
states={r['entity']:json.loads(r['body'])for r in db.execute("SELECT entity,body FROM office_state WHERE site=? AND run='onboarding' AND branch='main'",(cfg['id'],))}
entities=[]
for key,row in rows.items():
 attrs=json.loads(row['attributes']);entities.append({'id':key,'core_id':row['core_id'],'type':row['kind'],'name':attrs.get('name'),'parent':attrs.get('parent_resource'),'registry':attrs.get('registry_id'),'spatial':attrs.get('spatial'),'whole_scene_reference':attrs.get('whole_scene_reference'),'role':attrs.get('roles'),'identity_status':attrs.get('identity_status'),'space_root':attrs.get('space_root'),'catalogue':{k:attrs[k]for k in ['private','public','reservable','booking_mode','functional_use','planned_unindexed_catalog_ids']if k in attrs}})
root=rows['site']['core_id'];assert states['site']['operational_state']=='unknown';root_memory_count=db.execute('SELECT COUNT(*) FROM memories WHERE entity_id=?',(root,)).fetchone()[0];assert root_memory_count>0
edges=[];closed=0
for r in db.execute('SELECT r.*,a.id AS source,b.id AS target FROM relations r JOIN office_resources a ON r.source_id=a.core_id JOIN office_resources b ON r.target_id=b.core_id WHERE a.site=? AND b.site=?',(cfg['id'],cfg['id'])):
 if r['source']not in keys or r['target']not in keys:continue
 assert r['source']!=r['target'];meta=next((e for e in states[r['source']].get('relations',[])if e['type']==r['type']and e['target']==r['target']and not e.get('valid_to')),None)
 if not meta:closed+=1;continue
 edges.append({'id':r['id'],'type':r['type'],'source':r['source'],'target':r['target'],'valid_from':meta.get('valid_from',r['created_at']),'valid_to':meta.get('valid_to'),'provenance':meta.get('provenance')})
for person in [e for e in states.values()if e.get('kind')=='Person'and e.get('real_person_verified')is False]:assert not any(r['type']=='partOf'and not r.get('valid_to')for r in person.get('relations',[]))
report={'scope':'P2-08 addendum structural stage including8.1; no new operational flows','entities':entities,'relations':edges,'root_memory_records':root_memory_count,'root_state':'unknown; own state, no occupancy aggregate inferred','closed_historical_links_retained_as_history':closed,'vocabulary':{'CONTIENE':'inverse of existing partOf; stored once, traversable in either direction','PERTENECE_A':'partOf','UBICADO_EN':'locatedIn','ADYACENTE_A':'adjacentTo','CONECTADO_CON':'connectedTo','PERSONA_REGISTRADA':'registeredIn (registry membership, never permanent physical containment)'},'unknown':'No other adjacency, current door transit, individual access rights, person location or operational facts asserted','geometry_modified':False,'logical_people_without_mesh':len([e for e in entities if e['type']=='Person'])}
Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'entities':len(entities),'active_structural_links':len(edges),'root_memories':root_memory_count,'read_only_core_inspection':True}))
