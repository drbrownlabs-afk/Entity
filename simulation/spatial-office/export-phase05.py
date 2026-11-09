"""Derived web export of the operator-approved master; never saves the source .blend.
Uses Blender's official glTF exporter, linked meshes, PBR textures and semantic extras.
Collision data comes from the evaluated floor BVH and the same gate04 obstacle policy.
"""
import sys,math,json,time
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import ROOT,HERE,OUTPUT,HANDOFF,read,write,sha256,protected_changes,to_source
MASTER=OUTPUT/'office-phase04-revision.blend';EXPECTED='ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f'
assert sha256(MASTER)==EXPECTED and not protected_changes()
DEST=ROOT/'apps/spatial-simulation/public/model';DEST.mkdir(parents=True,exist_ok=True)
E=HANDOFF/'evidence/phase05';start=time.time()
bpy.ops.wm.open_mainfile(filepath=str(MASTER));scene=bpy.context.scene;scene.frame_set(1);bpy.context.view_layer.update()
m=read(OUTPUT/'device-manifest-revision.json')
# Capture actual world-space bounds before conversion, including hidden collision leaves.
def bounds(o,local=False):
 ps=[Vector(p) if local else o.matrix_world@Vector(p) for p in o.bound_box];ps=[to_source(p) for p in ps]
 return [[min(p[i] for p in ps) for i in range(3)],[max(p[i] for p in ps) for i in range(3)]]
obstacle_types={'Table','Chair','ChairFrame','TableLeg','Column','Storage','TableDivider','Monitor','MonitorStand','Counter','ReceptionCounter','Kiosk','Sofa','Armchair','SideTable','Planter','CafeTable','BoothSeat','Bar','Refrigerator','Ottoman','SanitaryFixture','Printer','Partition','PartitionFrame','Wall','WallCladding','TV','TVScreen'}
obstacles=[{'id':o.name,'bounds':bounds(o)} for o in scene.objects if o.type in ['MESH','CURVE'] and o.get('semantic_type') in obstacle_types and o.get('environment_id')!='render-context']
vs=[];faces=[]
for o in scene.objects:
 if o.type=='MESH' and o.get('semantic_type') in {'Floor','Ramp'}:
  offset=len(vs);vs += [o.matrix_world@v.co for v in o.data.vertices];faces += [[i+offset for i in p.vertices] for p in o.data.polygons]
floor=BVHTree.FromPolygons(vs,faces);nodes=[]
for ix in range(-118,44):
 for iz in range(-286,26):
  hit,_,_,_=floor.ray_cast(Vector((ix*.1,-iz*.1,5)),Vector((0,0,-1)),10)
  if hit is not None:nodes.append([ix,iz,round(hit.z,5)])
for d in m['doors']:
 o=bpy.data.objects[d['collider_id']];d['collider_local_bounds']=bounds(o,True);d['collider_local_position']=list(to_source(o.location));d['initial_locked']=False
for d in m['luminaires']:
 light=bpy.data.objects[d['id']].data;d['area_size']=[light.size,light.size_y if light.shape in ['RECTANGLE','ELLIPSE'] else light.size];d['area_shape']=light.shape
# Export approved inspection views as metadata, not Core/surveillance cameras.
views={}
for o in scene.objects:
 if o.type=='CAMERA' and o.name.startswith('view:revision-'):
  direction=o.rotation_euler.to_quaternion()@Vector((0,0,-1));views[o.name.replace('view:revision-','')]={'position':list(to_source(o.location)),'target':list(to_source(o.location+direction*4)),'fov':math.degrees(o.data.angle)}
import importlib.util
spec=importlib.util.spec_from_file_location('transfer_materials',HERE/'transfer-materials.py');transfer=importlib.util.module_from_spec(spec);spec.loader.exec_module(transfer)
baked=transfer.transfer_materials()
spec=importlib.util.spec_from_file_location('bake_ambient',HERE/'bake-ambient.py');ambient=importlib.util.module_from_spec(spec);spec.loader.exec_module(ambient)
contact_bake=ambient.bake_ambient()
spec=importlib.util.spec_from_file_location('bake_daylight',HERE/'bake-daylight.py');daylight=importlib.util.module_from_spec(spec);spec.loader.exec_module(daylight)
daylight_bake=daylight.bake_daylight()
# Flatten Cycles-only thin-leaf transmission to glTF's double-sided masked PBR.
# This retains photographed albedo, normal and alpha; it bakes no illumination.
adapt=[]
for mat in bpy.data.materials:
 if not mat.use_nodes:continue
 ns=mat.node_tree.nodes;links=mat.node_tree.links;p=next((n for n in ns if n.type=='BSDF_PRINCIPLED'),None);out=next((n for n in ns if n.type=='OUTPUT_MATERIAL'),None)
 if not p or not out:continue
 if mat.name.startswith('leaves') or mat.name.startswith('R1 living wall green'):
  image=next((n for n in ns if n.type=='TEX_IMAGE' and n.image and n.image.channels==4),None)
  if image:
   links.new(image.outputs['Color'],p.inputs['Base Color']);links.new(image.outputs['Alpha'],p.inputs['Alpha'])
   links.new(p.outputs['BSDF'],out.inputs['Surface']);mat.use_backface_culling=False
   tint=ns.get('R1 leaf green tint');factor=list(tint.inputs[2].default_value) if tint else [1,1,1,1]
   adapt.append({'factor':factor,'material':mat.name,'adaptation':'double-sided alpha-masked PBR; photographed leaf albedo/normal retained, Cycles translucency approximation'})
 # Cycles volume absorption approximates glTF volume via glass material properties at runtime.
 if p.inputs['Transmission Weight'].default_value>.9:mat.use_backface_culling=False
# Remove every hidden/helper/debug/render-context object from the derived export.
# Keep semantic door pivots and all visible fixtures. Exclude physical light nodes: adapter uses manifest.
exclude={'SourceAnchor','MeasuredFloorGuide','ReviewLabel','DoorCollider','LuminaireLight','ReferenceLight'}
records=[];selected=[]
for o in list(scene.objects):
 if o.type not in ['MESH','CURVE','FONT','EMPTY']:continue
 if (o.hide_render and o.get('semantic_type') not in ['Ceiling','CeilingDetail']) or o.get('semantic_type') in exclude or o.get('environment_id') in ['render-context','REFERENCES']:continue
 if o.type=='EMPTY' and o.get('semantic_type')!='DoorPivot':continue
 o.animation_data_clear();o.hide_set(False);o.hide_viewport=False;o.hide_render=False
 if o.type=='MESH' and any(len(p.vertices)>4 for p in o.data.polygons):
  o.modifiers.new('Export-only triangulation for portable tangent space','TRIANGULATE')
 o['stable_id']=o.get('stable_id',o.name);o['simulated']=True
 selected.append(o)
 records.append({'id':o['stable_id'],'name':o.name,'type':o.get('semantic_type',o.type),'environment_id':o.get('environment_id','architecture'),'bounds':bounds(o) if o.type!='EMPTY' else None,'parent':o.parent.name if o.parent else None,'furniture_group':o.get('furniture_group'),'daylight_lightmap':o.get('daylight_lightmap'),'lightmap_uv':o.get('lightmap_uv')})
# Meaningful glTF hierarchy around original objects; moving leaves retain their original pivot.
groups={}
for o in selected:
 if o.parent:continue
 env=o.get('environment_id','architecture')
 if env not in groups:
  g=bpy.data.objects.new('environment:'+env,None);scene.collection.objects.link(g);g['environment_id']=env;g['semantic_type']='Environment';groups[env]=g
 o.parent=groups[env]
bpy.ops.object.select_all(action='DESELECT')
for o in selected+list(groups.values()):o.select_set(True)
path=HERE/'.runtime/office-phase05-source.glb';path.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_extras=True,export_animations=False,export_cameras=False,export_lights=False,export_apply=True,export_yup=True,export_materials='EXPORT',export_texcoords=True,export_normals=True,export_tangents=True,export_image_format='AUTO')
assert sha256(MASTER)==EXPECTED and not protected_changes()
# Runtime data are simulation-only; no business rules, persons, bookings or second Core.
write(DEST/'scene.json',{'schema_version':'1.0','master_sha256':EXPECTED,'glb_sha256':sha256(path),'coordinate_frame':'supersplat-original +Y up; relative units, not surveyed meters','devices':m,'records':records,'views':views,'collision':{'radius':.18,'eye_height':1.65,'step':.1,'max_floor_jump':.06,'floor_nodes':nodes,'static':obstacles},'lighting':read(HERE/'lighting-config.json'),'palette':read(HERE/'archviz-lighting.json'),'routes':read(HANDOFF/'evidence/phase04-revision/routes.json')['routes'],'room_bounds':read(OUTPUT/'phase03-inventory.json')['layout']['rooms'],'material_adaptations':adapt,'baked_materials':baked,'static_contact_bake':contact_bake,'daylight_bake':daylight_bake,'simulation_only':True})
# Original CC0 photographic reflection context; source is already provenance-pinned in phase04.
hdri=next((HERE/'assets/archviz').glob('*.hdr'));(DEST/'environment.hdr').write_bytes(hdri.read_bytes())
# Inspect real GLB JSON without reimport duplication of the full scene.
import struct
raw=path.read_bytes();size,typ=struct.unpack_from('<II',raw,12);gl=json.loads(raw[20:20+size]);ids=[n.get('extras',{}).get('stable_id') for n in gl.get('nodes',[])];ids=[i for i in ids if i]
assert len(ids)==len(set(ids)) and {r['id'] for r in records}<=set(ids)
assert all(any(n.get('extras',{}).get('stable_id')==d['leaf_id'] and n.get('mesh') is not None for n in gl['nodes']) for d in m['doors'])
report={'passed':True,'master_sha256':EXPECTED,'master_preserved':sha256(MASTER)==EXPECTED,'protected_changes':protected_changes(),'glb_sha256':sha256(path),'bytes':len(raw),'nodes':len(gl['nodes']),'meshes':len(gl['meshes']),'materials':len(gl['materials']),'stable_ids':len(ids),'semantic_records':len(records),'linked_mesh_reuse':len(gl['nodes'])>len(gl['meshes']),'extensions':gl.get('extensionsUsed',[]),'room_bounds':read(OUTPUT/'phase03-inventory.json')['layout']['rooms'],'material_adaptations':adapt,'baked_materials':baked,'static_contact_bake':contact_bake,'daylight_bake':daylight_bake,'floor_nodes':len(nodes),'static_collision_objects':len(obstacles),'export_seconds':time.time()-start,'exporter':'Blender 4.3.2 official glTF 2.0; separate environmental HDR and dynamically weighted artificial indirect basis','limitations':['Cycles procedural micro-bump and leaf translucency are approximated in realtime PBR.','No georeferenced sun until observer is supplied.','No claim of equivalence to path-traced Cycles; browser inspection required.']}
write(E/'export.json',report);print('EXPORT_PHASE05_PASS',json.dumps(report),flush=True)
