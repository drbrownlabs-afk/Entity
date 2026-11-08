"""Prepare C master with mutable luminaires, independent circuits and reference 24h clock."""
import math,sys,json
from pathlib import Path
import bpy
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import ROOT,HERE,OUTPUT,HANDOFF,read,write,sha256,to_blender,to_source,protected_changes
from studio import Studio
import environment as env
E=HANDOFF/'evidence/phase04';E.mkdir(parents=True,exist_ok=True)
source=OUTPUT/'office-phase03.blend';h=sha256(source)
assert read(HANDOFF/'evidence/phase03/summary.json')['passed'] and not protected_changes()
bpy.ops.wm.open_mainfile(filepath=str(source));scene=bpy.context.scene;scene['phase']='04 lighting and time reference; explicit approval required before PlayCanvas'
S=Studio('sim:p4:');M=bpy.data.materials;black=M['Graphite powder coat'];ivory=M['Warm white plaster'];devices=[]
# Remove old reference lamps that cannot reflect individual state. Keep newly prepared identified lights.
for o in list(bpy.data.objects):
 if o.type=='LIGHT' and o.get('semantic_type')!='LuminaireLight':bpy.data.objects.remove(o,do_unlink=True)
# Bake only the actual procedural albedo to a small transferable texture; never illumination.
stone=M['Terrazzo warm - procedural reference'];image=bpy.data.images.new('ENTITY terrazzo albedo',width=256,height=256)
tex=stone.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image;stone.node_tree.nodes.active=tex
bpy.ops.object.select_all(action='DESELECT');bpy.ops.mesh.primitive_plane_add(size=2)
plane=bpy.context.object;plane.data.materials.append(stone)
scene.cycles.samples=1;scene.render.bake.use_pass_direct=False;scene.render.bake.use_pass_indirect=False;scene.render.bake.use_pass_color=True
bpy.ops.object.bake(type='DIFFUSE')
image.filepath_raw=str(OUTPUT/'terrazzo-albedo.png');image.file_format='PNG';image.save();image.pack()
bpy.data.objects.remove(plane,do_unlink=True)
stone.node_tree.links.new(tex.outputs['Color'],stone.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
bpy.context.view_layer.update()
for o in bpy.data.objects:
 if o.type=='MESH' and stone in list(o.data.materials):
  uv=o.data.uv_layers.new(name='StudioFloorUV');o.data.uv_layers.active_index=len(o.data.uv_layers)-1;uv.active_render=True
  for loop in o.data.loops:
   v=o.matrix_world@o.data.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(v.x/2+.5,v.y/2+.5)
# Material/geometry continuity, no external assets or flattened baked lightmaps.
for m in list(M):
 if m.use_nodes:
  p=m.node_tree.nodes.get('Principled BSDF')
  if p and 'upholstery' in m.name.lower():p.inputs['Sheen Weight'].default_value=.20;p.inputs['Roughness'].default_value=.8
for o in bpy.data.objects:
 if o.type=='MESH' and o.get('semantic_type')=='Vegetation':
  for p in o.data.polygons:p.use_smooth=True
  mod=o.modifiers.new('Smooth reference foliage','SUBSURF');mod.levels=1;mod.render_levels=1
# Emissive lenses must be independently switchable too.
def emitter_material(id):
 m=M.new('Emitter '+id);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(.88,.81,.68,1);p.inputs['Emission Color'].default_value=(1,.84,.62,1);p.inputs['Emission Strength'].default_value=4
 return m

def controlled(o,fixture,nominal,color=(1,.86,.69),temperature=4000,emitter=None):
 o['controlled_luminaire']=True;o['nominal_power']=nominal;o['on']=True;o['level']=1.0;o['mode']='auto';o['nominal_temperature_kelvin']=temperature
 o.data.color=color
 if emitter is None:
  p=to_source(o.location);emitter=S.box('lens:'+str(len(devices)),(p[0],p[1]+.018,p[2]),(.72,.006,.16),ivory,'LuminaireEmitter',o['environment_id'],.002)
 mat=emitter_material(o.name);emitter.data.materials.clear();emitter.data.materials.append(mat);o['emitter_material']=mat.name
 devices.append({'id':o.name,'type':'luminaire','environment_id':o['environment_id'],'fixture_id':fixture,'emitter_id':emitter.name,'transform_blender':[list(r) for r in o.matrix_world],'position_source':list(to_source(o.location)),'nominal_power_blender':nominal,'nominal_temperature_kelvin':temperature,'color_rgb':list(color),'dimmable':True,'initial_state':{'on':True,'level':1,'mode':'auto'},'light_type':o.data.type,'physical_device_confirmed':False})
for o in list(bpy.data.objects):
 if o.type=='LIGHT' and o.get('semantic_type')=='LuminaireLight':controlled(o,o.name.removesuffix(':light')+':fixture',o.get('nominal_power',100))
# Bar accents and hanging shelf strips are mutable lights, not immutable luminous materials.
for n,o in enumerate([o for o in bpy.data.objects if o.type=='MESH' and o.get('semantic_type')=='ReferenceLight']):
 data=bpy.data.lights.new('cafe-accent-'+str(n),'AREA');data.energy=50;data.size=.7
 light=bpy.data.objects.new('sim:p4:accent:'+str(n),data);scene.collection.objects.link(light);light.location=o.location.copy();light.location.z-=.015
 S.reg(light,'accent:'+str(n),'LuminaireLight','sim:CAFE-01');controlled(light,o.name,50,(1,.73,.43),3000,o)
placements={
 'A':[(.1,1.5,-4.1),(2.7,1.5,-4.1),(.1,1.5,-6.0),(2.7,1.5,-6.0)],
 'B':[(.1,1.5,-9.5),(2.7,1.5,-9.5),(.1,1.5,-11.6),(2.7,1.5,-11.6)],
 'C':[(.1,1.5,-14.6),(2.7,1.5,-14.6),(.1,1.5,-17.1),(2.7,1.5,-17.1)],
 'D':[(.1,1.5,-20.5),(2.7,1.5,-20.5),(.1,1.5,-23),(2.7,1.5,-23)],
 'sim:ROOM-E':[(.1,1.5,-25.4),(2.7,1.5,-25.4),(.1,1.5,-27),(2.7,1.5,-27)],
 'MEETING-AREA-01':[(.1,1.5,-.8),(2.7,1.5,-.8),(.1,1.5,1),(2.7,1.5,1)],
 'RECEPTION':[(-4.6,1.5,-15.1),(-4.6,1.5,-16.8)],
 'WAITING-AREA':[(-4.8,1.5,-8.3),(-4.8,1.5,-10)],
 'sim:CAFE-01':[(-10.4,1.5,-20),(-10.4,1.5,-24.5)],
 'sim:RECREATION':[(-4.3,1.5,-20.5),(-4.3,1.5,-24)],
 'CIRCULATION-01':[(-2.2,1.5,z) for z in [0,-5,-10,-15,-20,-25]],
 'sim:LOUNGE':[(-10.5,1.5,-4.4),(-10.5,1.5,-1.2)],
 'sim:PRINT':[(-4.2,1.5,-1.8)]}
for zone,points in placements.items():
 for i,p in enumerate(points):
  fixture=S.box('fixture:'+zone+':'+str(i),(p[0],p[1]+.07,p[2]),(.78,.06,.22),black,'Luminaire',zone)
  data=bpy.data.lights.new('light:'+zone+':'+str(i),'AREA');data.energy=100;data.shape='RECTANGLE';data.size=.72;data.size_y=.16
  o=bpy.data.objects.new('light',data);scene.collection.objects.link(o);o.location=to_blender(p);S.reg(o,'light:'+zone+':'+str(i),'LuminaireLight',zone)
  controlled(o,fixture.name,110 if zone in ['A','B','C','D','sim:ROOM-E','MEETING-AREA-01'] else 90)
# Daylight is separate from artificial circuits.
data=bpy.data.lights.new('ENTITY configurable sun','SUN');data.angle=.065
sun=bpy.data.objects.new('sim:p4:sun',data);scene.collection.objects.link(sun);sun['source']='configurable reference, no building coordinates asserted'
scene['simulation_hour']=12.0;scene['simulation_speed']=60;scene['simulation_playing']=False
scene['lighting_configuration']=json.dumps(env.CFG);scene['clock_source']='local visual reference, not real time or Core observations'
env.set_hour(12);scene.frame_set(1);bpy.context.view_layer.update()
for d in devices:
 o=bpy.data.objects[d['id']];d['transform_blender']=[list(r) for r in o.matrix_world];d['position_source']=list(to_source(o.matrix_world.translation))
# Explicitly runnable text enables the control panel, never auto-run downloaded scripts.
txt=bpy.data.texts.new('START ENTITY visual controls');txt.write('import sys\nsys.path.insert(0,'+repr(str(HERE))+')\nimport environment\nenvironment.register()\n')
for name,p,t in [('phase04-roomA',[-.7,-.25,-6.5],[1.4,-.6,-4.7]),('phase04-general',[21,30,10],[-4,-.5,-12])]:
 data=bpy.data.cameras.new('view:'+name);data.sensor_fit='VERTICAL';data.angle=math.radians(80 if name.endswith('roomA') else 55);data.clip_end=200
 o=bpy.data.objects.new('view:'+name,data);scene.collection.objects.link(o);o.location=to_blender(p);o.rotation_euler=(Vector(to_blender(t))-o.location).to_track_quat('-Z','Y').to_euler()
scene.camera=bpy.data.objects['view:phase04-general'];scene.cycles.samples=48;scene.cycles.use_denoising=False;scene.cycles.max_bounces=8;scene.cycles.transmission_bounces=8
for o in bpy.data.objects:
 if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=True
# Keep privacy roof even for cutaway approval renders.
for o in bpy.data.objects:
 if o.get('environment_id')=='sim:WC' and o.get('semantic_type')=='Ceiling':o.hide_render=False
circuits={z:[d['id'] for d in devices if d['environment_id']==z] for z in sorted({d['environment_id'] for d in devices})}
manifest={'schema_version':'1.0','source':'simulation only; no Core registration','initial_clock':env.state()['clock'],'solar_configuration':env.CFG['solar'],'solar_fallback':'explicit design-reference trajectory until observer supplied','luminaires':devices,'circuits':circuits,'doors':read(OUTPUT/'phase03-inventory.json')['doors'],'lockers':read(OUTPUT/'phase03-inventory.json')['lockers'],'televisions':read(OUTPUT/'phase03-inventory.json')['televisions'],'zone_aliases':{'sim:RECREATION':'cafe social tables, separate circuit','sim:LOUNGE':'front wing social lounge; not second cafe'},'commands':{'light.set':{'parameters':['id','on:boolean','level:0..1','mode:auto|manual']},'circuit.set':{'parameters':['environment_id','on','level','mode']},'door.command':{'operations':['open','close','lock','unlock'],'implementation':'doors.py, local simulated preview'},'clock.set':{'hour':'finite 0..24, wraps'},'clock.play':{'speeds':env.CFG['clock']['speeds']},'clock.pause':{}},'event_envelope':{'schema_version':'1.0','source':'simulated-local-preview','device_id':'stable ID','operation':'command','state':'queried from actual local state','real_observation':False},'transfer_proposal':env.CFG['transfer'],'source_master_sha256':h,'input_hashes':{str(p.relative_to(ROOT)):sha256(p) for p in [HERE/'build-phase04.py',HERE/'environment.py',HERE/'solar.py',HERE/'lighting-config.json',HERE/'requirements-lighting.lock']}}
bpy.context.preferences.filepaths.save_version=0;master=OUTPUT/'office-phase04.blend';bpy.ops.wm.save_as_mainfile(filepath=str(master),compress=True)
manifest['master_sha256']=sha256(master);write(OUTPUT/'device-manifest.json',manifest);write(OUTPUT/'initial-visual-state.json',env.state())
assert sha256(source)==h and not protected_changes()
print('PHASE04_BUILT',len(devices),'individual lights',len(circuits),'circuits')
