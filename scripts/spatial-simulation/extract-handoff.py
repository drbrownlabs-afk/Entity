"""Offline, deterministic handoff from committed scene evidence. No scene/network writes."""
import json,hashlib,math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/spatial-simulation';OUT.mkdir(exist_ok=True)
def read(p):return json.loads((ROOT/p).read_text())
def save(name,data):(OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
original_path='worlds/synthetic-office/original-viewer-settings.json';original=read(original_path)
cal_path='worlds/synthetic-office/calibrated-resources.json';cal=read(cal_path)
sem_path='worlds/synthetic-office/semantic-annotations.json';semantic=read(sem_path)
nav_path='docs/evidence/phase09/office-navigation.json';nav=read(nav_path)
voxel_path='docs/evidence/phase09/source-voxels/scene.voxel.json';voxel=read(voxel_path)
entries=[];annotations=[]
def add(id,name,kind,position=None,classification='unknown',source=None,**more):
 entries.append(dict(id=id,name=name,kind=kind,position=position,coordinate_frame='supersplat-original',classification=classification,dimensions=None,orientation=None,sources=[source] if source else [],**more))
mapping={0:'A',1:'MEETING-AREA-01',2:'B',3:'annotation-3'}
for i,a in enumerate(original['settings']['annotations']):
 resource=mapping[i];zone='annotation-'+str(i)
 annotations.append({'annotation_index':i,'origin':'original-author','title':a['title'],'position':a['position'],'zone_id':zone,'resource_id':resource,'camera':a.get('camera'),'source':original_path})
 add(zone,a['title'],'Zone',a['position'],'authored-original-anchor',original_path,relations=[] if resource==zone else [{'type':'referenceFor','target':resource}],semantic_note='Annotation is a point, not the boundary or size of a room')
 if i<3:add(resource,{'A':'Oficina privada A','B':'Oficina privada B','MEETING-AREA-01':'Mesa negra de reuniones'}[resource],'Office' if i!=1 else 'EventSpace',a['position'],'authored-original-anchor; operator-confirmed-role',original_path,relations=[{'type':'locatedIn','target':zone}],capacity=6 if i!=1 else None,capacity_note='Private group six; meeting title says8 but complete chair count not independently measured',reservable_unit='whole-environment')
 if i in [0,2]:
  for n in range(1,7):add(resource+'-INTERNAL-'+str(n),f'{resource} posición interna {n}','Desk',source=original_path,relations=[{'type':'partOf','target':resource}],note='Existing logical ID; individual chair location unmeasured; do not place at group anchor')
 camera=a['camera']['initial'];add('CAM-'+str(i+1).zfill(2),'Vista virtual original '+str(i+1),'Camera',camera['position'],'authored-original-camera',original_path,target=camera['target'],fov_degrees=camera['fov'],physical_mount_verified=False,relations=[{'type':'covers','target':zone}])
for r in cal['resources']:
 attrs=r['attributes'];add(r['id'],('Grupo '+r['id']) if r['id'] in ['C','D'] else r['id'],r['kind'],attrs['position'],'original-voxel-ray-and-visual-verified',cal_path,anchor_kind=attrs.get('anchor_kind'),provenance=attrs.get('spatial_provenance'),relations=[{'type':'partOf','target':r['id'][0]}] if r['kind']=='Desk' else [],reservable_unit='individual' if r['kind']=='Desk' else None)
for i,a in enumerate(semantic,4):
 extra=a['extras'];add(extra['entity_id'],a['title'],extra['kind'],a['position'],'reviewed-original-splat-depth-anchor',sem_path,provenance=extra,capacity=extra.get('seating_capacity'),note=a['text'])
 annotations.append({'annotation_index':i,'origin':'reviewed-semantic-overlay','title':a['title'],'position':a['position'],'resource_id':extra['entity_id'],'camera':a.get('camera'),'source':sem_path})
add('CIRCULATION-01','Pasillo calibrado','Zone',classification='measured-floor-samples; boundary unknown',source=nav_path,geometry='WALKABLE-FLOOR.obj',note='Navigation floor coverage only, not an architectural polygon')
add('ACCESS-01','Acceso autorizado de ensayo','AccessPoint',source='services/entity-api/app/office/provision.py',note='Logical access policy object; physical doorway and pose not calibrated')
for item in read('worlds/synthetic-office/observed-inventory.json'):
 a=item['attributes'];add(item['id'],a['name'],item['kind'],a.get('position'),'visual-verified-group-reference', 'worlds/synthetic-office/observed-inventory.json',relations=[{'type':'partOf','target':a['parent_resource']}],note='Alias/evidence of C/D; not another table',provenance=a)
inspection=read('worlds/synthetic-office/inspection-cameras.json')
for n,(p,t) in enumerate([(inspection['poses'][0],inspection['poses'][2]),(inspection['poses'][2],inspection['poses'][0])],1):add('CAM-ROUTE-'+str(n),'Vista de pasillo '+str(n),'Camera',p,'derived-existing-virtual-camera','scripts/bootstrap-office.py',target=t,fov_degrees=85,physical_mount_verified=False)
for id,name in [('walls','Paredes'),('ceiling','Techo'),('columns','Columnas'),('windows','Ventanales'),('recreation','Zona recreativa distinta de booths'),('doors','Puertas/accesos físicos'),('individual-pods','Pods individuales'),('black-chairs','Dos sillas negras individuales')]:
 add('handoff:unmapped:'+id,name,'UnsegmentedGeometry',source=voxel_path,id_scope='handoff-only; not a Core entity ID',note='No individual verified dimensions/orientation/positions in existing structured evidence; consult original captures and collider; do not fabricate geometry')
for group in ['C','D']:
 points=[e['position'] for e in entries if e['id'] in [group+str(n) for n in range(1,7)]]
 extent={'min':[min(p[k] for p in points) for k in range(3)],'max':[max(p[k] for p in points) for k in range(3)]}
 next(e for e in entries if e['id']==group)['chair_anchor_envelope']={**extent,'extent':[extent['max'][k]-extent['min'][k] for k in range(3)],'meaning':'Spread of six sampled chair surface anchors, NOT table dimensions or room boundaries'}
ids=[e['id'] for e in entries];assert len(ids)==len(set(ids)), 'Duplicate inventory IDs'
assert {group+str(n) for group in ['C','D'] for n in range(1,7)}<=set(ids)
for e in entries:
 for relation in e.get('relations',[]):assert relation['target'] in ids,(e['id'],relation)
# Export only measured navigation nodes. Refuse quads crossing a reported blocked edge.
grid=nav['grid'];nodes={tuple(n['node']):n['position'] for n in grid['walkable']};indexes={key:i+1 for i,key in enumerate(nodes)}
blocked={tuple(sorted((a,b))) for a,b in grid['blocked_edges']}
lines=['# ORIGINAL collider measured floor samples; not complete architectural floor', '# x,y,z unchanged. Scale in meters is NOT verified.'];lines+=['v '+' '.join(format(x,'.10g') for x in p) for p in nodes.values()];faces=0
for (x,z),a in indexes.items():
 keys=[(x,z),(x+1,z),(x+1,z+1),(x,z+1)]
 if not all(k in nodes for k in keys):continue
 if any(tuple(sorted((','.join(map(str,u)),','.join(map(str,v))))) in blocked for u,v in zip(keys,keys[1:]+keys[:1])):continue
 if max(nodes[k][1] for k in keys)-min(nodes[k][1] for k in keys)>.1+1e-8:continue
 b,c,d=[indexes[k] for k in keys[1:]];lines.extend([f'f {a} {c} {b}',f'f {a} {d} {c}']);faces+=2
(OUT/'WALKABLE-FLOOR.obj').write_text('\n'.join(lines)+'\n')
sources=[original_path,cal_path,sem_path,nav_path,voxel_path,'docs/evidence/phase09/source-voxels/scene.voxel.bin']
save('SPACE-INVENTORY.json',{'schema_version':'1.0','scene_id':'a972d838','source_commit':'40850d120a82a431b3e6ccc824e7bc734c379e5f','coordinate_system':{'handedness':'right','up':'+Y','horizontal':['X','Z'],'meters_verified':False,'blender_conversion':'(x,y,z) -> (x,-z,y); rotation +90 degrees about X; determinant+1; scale1 preserves relative units'},'bounds':{'collision_grid':voxel['gridBounds'],'scene':voxel['sceneBounds'],'note':'global data bounds, NOT measured room/wall bounds'},'voxel_resolution_relative_units':voxel['voxelResolution'],'inventory':entries,'export':{'file':'WALKABLE-FLOOR.obj','vertices':len(nodes),'triangles':faces,'source':nav_path,'complete_floor':False},'source_hashes':{p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in sources}})
save('ANNOTATIONS-MAP.json',{'schema_version':'1.0','scene_id':'a972d838','annotations':annotations,'original_camera_settings':original['settings']['cameras'],'inspection_poses':inspection,'view_only_bookmarks':read('worlds/synthetic-office/view-bookmarks.json'),'product_views':read('worlds/synthetic-office/product-views.json'),'note':'View positions and targets are not physical CCTV mounts or object dimensions'})
print(json.dumps({'inventory_entries':len(entries),'annotations':len(annotations),'floor_vertices':len(nodes),'floor_triangles':faces,'ids_unique':True,'references_valid':True}))
