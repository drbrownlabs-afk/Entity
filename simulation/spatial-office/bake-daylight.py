"""Blender HDR environmental irradiance bake, no switchable artificial contribution.
Derived geometry/UV1 only. High-quality source .blend remains untouched.
"""
import bpy,math,time
from pathlib import Path
from common import HERE,ROOT,HANDOFF,OUTPUT,read,write,sha256,to_source

def bake_daylight():
 scene=bpy.context.scene;started=time.time();dest=ROOT/'apps/spatial-simulation/public/model';cache=HERE/'.runtime/daylight-transfer';cache.mkdir(parents=True,exist_ok=True)
 receivers=[];types={'Floor','FloorFinish','Ceiling','CeilingDetail','Wall','WallCladding','Column','CounterFinish','Counter','ReceptionCounter','Table','TableDivider','Cladding','AcousticFinish','Storage'}
 for o in list(scene.objects):
  if o.type!='MESH' or o.get('semantic_type') not in types or o.get('environment_id') in ['render-context','REFERENCES']:continue
  if any(m and m.use_nodes and any(n.type=='BSDF_PRINCIPLED' and n.inputs['Transmission Weight'].default_value>.1 for n in m.node_tree.nodes) for m in o.data.materials):continue
  receivers.append(o)
 # Apply modifiers in this derived scene so baked UV1 and exported geometry match exactly, including bevels.
 dg=bpy.context.evaluated_depsgraph_get()
 for o in receivers:
  mesh=bpy.data.meshes.new_from_object(o.evaluated_get(dg),preserve_all_data_layers=True,depsgraph=dg);o.modifiers.clear();o.data=mesh
  while len(mesh.uv_layers)>1:mesh.uv_layers.remove(mesh.uv_layers[-1])
  if not mesh.uv_layers:mesh.uv_layers.new(name='UVMap')
  mesh.uv_layers.new(name='LightmapUV')
 vs=[];faces=[];uv0=[];mapping=[];materials=[];material_indices=[]
 for o in receivers:
  offset=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices);first=len(uv0)
  for p in o.data.polygons:
   faces.append([offset+i for i in p.vertices]);mat=o.data.materials[p.material_index] if o.data.materials else None
   if mat not in materials:materials.append(mat)
   material_indices.append(materials.index(mat))
   uv0.extend(tuple(o.data.uv_layers[0].data[i].uv) for i in p.loop_indices)
  mapping.append((o,first,len(uv0)))
 mesh=bpy.data.meshes.new('environment irradiance receiver atlas');mesh.from_pydata(vs,[],faces);mesh.update();obj=bpy.data.objects.new('temporary HDR environmental bake',mesh);scene.collection.objects.link(obj)
 for mat in materials:mesh.materials.append(mat or bpy.data.materials['Warm white plaster'])
 for i,p in enumerate(mesh.polygons):p.material_index=material_indices[i]
 base=mesh.uv_layers.new(name='UVMap');atlas=mesh.uv_layers.new(name='LightmapUV');mesh.uv_layers.active=atlas;base.active_render=True
 for i,v in enumerate(uv0):base.data[i].uv=v
 bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj;bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.004,area_weight=1,correct_aspect=True);bpy.ops.object.mode_set(mode='OBJECT')
 for o,first,last in mapping:
  layer=o.data.uv_layers['LightmapUV']
  for i in range(last-first):layer.data[i].uv=atlas.data[first+i].uv
  o.data.uv_layers[0].active_render=True;o['daylight_lightmap']='environment-irradiance.hdr';o['lightmap_uv']=1
 hdr=dest/'environment-irradiance.hdr';exr=cache/'environment-irradiance.exr';art_exr=cache/'artificial-indirect.exr';art_hdr=dest/'artificial-indirect.hdr';uv_path=cache/'uv.json'
 import json,hashlib,numpy as np
 uv_hash=hashlib.sha256(json.dumps([tuple(x.uv) for x in atlas.data]).encode()).hexdigest()
 previous=json.loads(uv_path.read_text()) if uv_path.exists() else None
 if previous and previous['uv_hash']!=uv_hash:
  raise RuntimeError('Cached irradiance UV layout changed: invalidate this bake cache explicitly')
 write(uv_path,{'uv_hash':uv_hash,'bake_uv_layer':'LightmapUV','source_master':'ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f'})
 hidden=[(o,o.hide_render) for o in scene.objects if o!=obj];light_values=[(o.data,o.data.energy) for o in scene.objects if o.type=='LIGHT'];emissions=[]
 for mat in bpy.data.materials:
  if not mat.use_nodes:continue
  for n in mat.node_tree.nodes:
   if n.type=='BSDF_PRINCIPLED':emissions.append((n.inputs['Emission Strength'],n.inputs['Emission Strength'].default_value));n.inputs['Emission Strength'].default_value=0
 for data,_ in light_values:data.energy=0
 for o,_ in hidden:
  if o in receivers or o.get('semantic_type') in ['DoorLeaf','DoorHardware','DoorHandle','DoorCollider']:o.hide_render=True
  elif o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=False
 world_strengths=[(n.inputs['Strength'],n.inputs['Strength'].default_value) for n in scene.world.node_tree.nodes if n.type=='BACKGROUND']
 scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.diffuse_bounces=6;scene.cycles.transmission_bounces=12
 def render_bake(path,indirect):
  if path.exists():return
  image=bpy.data.images.new('HDR bake '+path.stem,width=2048,height=2048,alpha=False,float_buffer=True);image.colorspace_settings.name='Linear Rec.709';targets=[]
  for mat in materials:
   if not mat or not mat.use_nodes:continue
   node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;mat.node_tree.nodes.active=node;targets.append((mat,node))
  scene.render.bake.use_pass_direct=not indirect;scene.render.bake.use_pass_indirect=True;scene.render.bake.use_pass_color=False
  print('HDR_IRRADIANCE_BAKE_START',path.name,'receivers',len(receivers),'vertices',len(vs),'faces',len(faces),flush=True)
  bpy.ops.object.bake(type='DIFFUSE',uv_layer='LightmapUV',margin=12,use_clear=True)
  image.filepath_raw=str(path);image.file_format='OPEN_EXR';image.save()
  for mat,node in targets:mat.node_tree.nodes.remove(node)
  print('HDR_IRRADIANCE_BAKED',path.name,sha256(path),flush=True)
 render_bake(exr,False)
 # Artificial indirect is a separately encoded dynamic basis, never added as immutable lighting.
 # Direct illumination and exact source/individual light states stay in the native realtime lights.
 for socket,_ in world_strengths:socket.default_value=0
 manifest=read(OUTPUT/'device-manifest-revision.json');palette=read(HERE/'archviz-lighting.json')
 for light in manifest['luminaires']:
  bpy.data.objects[light['id']].data.energy=light['nominal_power_blender']
  emitter=bpy.data.objects.get(light.get('emitter_id',''))
  if emitter:
   for mat in emitter.data.materials:
    if mat and mat.use_nodes:
     for n in mat.node_tree.nodes:
      if n.type=='BSDF_PRINCIPLED':n.inputs['Emission Strength'].default_value=palette[light['design_role']]['emitter_radiance']
 render_bake(art_exr,True)
 for data,energy in light_values:data.energy=energy
 for socket,value in emissions:socket.default_value=value
 for socket,value in world_strengths:socket.default_value=value
 for o,hidden_value in hidden:o.hide_render=hidden_value
 def rgbe(source,target):
  if target.exists():return
  image=bpy.data.images.load(str(source),check_existing=False);w,h=image.size[:];pixels=np.empty(w*h*4,dtype=np.float32);image.pixels.foreach_get(pixels);rgb=np.maximum(0,pixels.reshape(h,w,4)[::-1,:,:3]);maximum=rgb.max(axis=2);mantissa,exponent=np.frexp(maximum);scale=np.divide(mantissa*256,maximum,out=np.zeros_like(maximum),where=maximum>1e-32);encoded=np.zeros((h,w,4),dtype=np.uint8);encoded[:,:,:3]=np.minimum(255,rgb*scale[:,:,None]).astype(np.uint8);encoded[:,:,3]=np.where(maximum>1e-32,exponent+128,0).astype(np.uint8)
  with target.open('wb') as f:
   f.write(('#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y '+str(h)+' +X '+str(w)+'\n').encode())
   for row in encoded:
    f.write(bytes([2,2,w>>8,w&255]))
    for channel in range(4):
     for offset in range(0,w,128):chunk=row[offset:offset+128,channel].tobytes();f.write(bytes([len(chunk)]));f.write(chunk)
  bpy.data.images.remove(image)
 rgbe(exr,hdr);rgbe(art_exr,art_hdr)
 bpy.data.objects.remove(obj,do_unlink=True)
 report={'path':'environment-irradiance.hdr','sha256':sha256(hdr),'artificial_indirect_path':'artificial-indirect.hdr','artificial_indirect_sha256':sha256(art_hdr),'resolution':[2048,2048],'samples':64,'encoding':'linear HDR RGBE; no AgX/exposure baked','uv_hash':uv_hash,'bake_uv_layer':'LightmapUV','receivers':[o.name for o in receivers],'receiver_count':len(receivers),'daylight_baked_lights':'environment only; all LIGHT energy zero, all material emission zero','artificial_basis':'indirect diffuse only; environment zero; all 71 sources at full nominal power; runtime room gains follow actual current source output','artificial_basis_limitation':'Spatially averaged indirect response per circuit, not a separate path trace per individual lamp. Direct lighting and emissive sources remain individually exact.','movable_doors_included':False,'runtime_policy':'Continuous daylight scaling plus mutable artificial indirect circuit gains. All artificial gains reach zero on OFF.','seconds':time.time()-started}
 write(HANDOFF/'evidence/phase05/daylight-bake.json',report);return report
