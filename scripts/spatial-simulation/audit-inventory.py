"""Read-only pre-import matrix: existing/registration/planned/unlocated are independent axes."""
import argparse,sqlite3,json,collections
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--configuration',required=True);p.add_argument('--database',required=True);p.add_argument('--output',required=True);a=p.parse_args();cfg=json.loads(Path(a.configuration).read_text());db=sqlite3.connect('file:'+str(Path(a.database).resolve())+'?mode=ro',uri=True);db.row_factory=sqlite3.Row
existing={r['id']:dict(r)for r in db.execute('SELECT id,core_id,kind,attributes FROM office_resources WHERE site=?',(cfg['id'],))};scene=json.loads((Path(__file__).resolve().parents[2]/'apps/spatial-simulation/public/model/scene.json').read_text());source={r['id']for r in scene['records']};lights={r['id']for r in scene['devices']['luminaires']};rows=[]
for r in cfg['resources']:
 old=existing.get(r['id']);attrs=r['attributes'];s=attrs.get('spatial');assert not old or old['kind']==r['kind'],r['id']
 if s:
  assert set(s['object_ids'])<=source
  if s.get('runtime_light_id'):assert s['runtime_light_id']in lights
 rows.append({'id':r['id'],'kind':r['kind'],'core_presence':'ya_existe'if old else'por_registrar','core_id_before':old['core_id']if old else None,'model_status':attrs.get('model_status'),'spatial_status':attrs.get('spatial_status'),'unknown_cardinality':attrs.get('is_type_definition',False)and attrs.get('known_instance_count')is None,'source':attrs.get('registration_source'),'object_ids':s.get('object_ids',[])if s else[],'native_light_id':s.get('runtime_light_id')if s else None})
report={'read_only':True,'before_import':True,'site':cfg['id'],'desired_entities':len(rows),'existing_total_including_history':len(existing),'core_presence_counts':dict(collections.Counter(r['core_presence']for r in rows)),'model_status_counts':dict(collections.Counter(r['model_status']for r in rows)),'spatial_status_counts':dict(collections.Counter(r['spatial_status']for r in rows)),'retained_outside_current_scope':[k for k in existing if k not in {r['id']for r in cfg['resources']}],'matrix':rows}
out=Path(a.output);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k!='matrix'}))
