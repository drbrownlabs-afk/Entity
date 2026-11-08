"""Corrective cafe/L increment. Opens Phase01 master, writes a separate master and evidence."""
import json, math, sys
from pathlib import Path
import bpy
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import ROOT,HERE,OUTPUT,HANDOFF,protected_changes,read,write,sha256,to_blender,to_source
E=HANDOFF/'evidence/cafe-correction'; E.mkdir(exist_ok=True,parents=True)
config=read(HERE/'cafe-layout.json')
original=OUTPUT/'office-phase01.blend'; original_hash=sha256(original)
assert not protected_changes()
bpy.ops.wm.open_mainfile(filepath=str(original))
scene=bpy.context.scene
scene['phase']='Cafe/L correction requested by operator; full Phase02 not accepted'
scene['geometry_note']=config['meaning']
col=bpy.data.collections.new('Cafe - rear L - operator correction'); scene.collection.children.link(col)
new=[]

def mat(name,color,metal=0,rough=.45,emission=0):
 m=bpy.data.materials.new(name); m.use_nodes=True
 n=m.node_tree.nodes.get('Principled BSDF'); n.inputs['Base Color'].default_value=(*color,1)
 n.inputs['Metallic'].default_value=metal; n.inputs['Roughness'].default_value=rough
 if emission:
  n.inputs['Emission Color'].default_value=(*color,1); n.inputs['Emission Strength'].default_value=emission
 return m
wood=mat('Cafe warm oak',(.35,.16,.055)); stone=bpy.data.materials['Terrazzo warm - procedural reference']
black=bpy.data.materials['Graphite powder coat']; ivory=bpy.data.materials['Warm white plaster']
fabric=bpy.data.materials['Sand upholstery']; chrome=bpy.data.materials['Chair brushed aluminum']
glass=bpy.data.materials['Window glazing reference']; green=bpy.data.materials['Leaf green']
warm=mat('Cafe warm integrated lighting',(1,.52,.18),emission=4)
metal=mat('Cafe appliance stainless steel',(.32,.35,.37),.8,.22)

def register(o,id,kind):
 o.name='sim:cafe:'+id
 for c in list(o.users_collection): c.objects.unlink(o)
 col.objects.link(o)
 for k,v in {'stable_id':o.name,'semantic_type':kind,'environment_id':'sim:CAFE-01','geometry_origin':'operator-confirmed L/cafe; dimensions estimated; cafe-layout.json','source_frame':'supersplat-original +Y up','source_position':list(to_source(o.location)),'meters_verified':False}.items(): o[k]=v
 new.append(o); return o

def box(id,p,size,material,kind='CafeFurniture',yaw=0,bevel=.02):
 bpy.ops.mesh.primitive_cube_add(size=1,location=to_blender(p)); o=bpy.context.object
 o.dimensions=(size[0],size[2],size[1]); bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 o.rotation_euler.z=yaw; o.data.materials.append(material)
 if bevel:
  mod=o.modifiers.new('Soft manufactured edge','BEVEL');mod.width=bevel;mod.segments=2
  o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return register(o,id,kind)

def cyl(id,p,r,h,material,kind='CafeFurniture'):
 bpy.ops.mesh.primitive_cylinder_add(vertices=24,radius=r,depth=h,location=to_blender(p));o=bpy.context.object
 o.data.materials.append(material)
 return register(o,id,kind)

# Only delete reconstructed objects in this new derivative, never source references or source master.
removed=[]
for o in list(bpy.data.objects):
 if o.name.startswith(('sim:p1:pod:','sim:p1:panel-west:2','sim:p1:panel-seam:2:')) or o.name=='sim:p1:wall-west':
  removed.append(o.name);bpy.data.objects.remove(o,do_unlink=True)
x0,x1,z0,z1=config['wing_bounds_xz']; floor=config['floor_y']; ceiling=1.65
box('floor-wing',((x0+x1)/2,floor-.09,(z0+z1)/2),(x1-x0,.18,z1-z0),stone,'Floor')
# Existing raised strip ends at -6.45; bridge that 0.05 gap explicitly.
box('floor-join',(-6.475,floor-.09,(z0+z1)/2),(.10,.18,z1-z0),stone,'Floor')
box('floor-cafe-rear-fill',(-4.675,floor-.09,-25.075),(3.65,.18,2.85),stone,'Floor')
box('west-front-wall',(-6.55,.05,(2.65+z1)/2),(.16,3.2,2.65-z1),ivory,'Wall')
box('wing-return-wall',((x0+x1)/2,.05,z1), (x1-x0,3.2,.13),ivory,'Wall')
box('wing-outer-wall',(x0-.05,.05,(z0+z1)/2),(.13,3.2,z1-z0),ivory,'Wall')
box('rear-glass-wing',((x0+x1)/2,.05,-26.2),(x1-x0,3.2,.03),glass,'Window')
for n,x in enumerate([-11.9,-10.1,-8.3,-6.55]):box(f'rear-frame:{n}',(x,.05,-26.15),(.065,3.2,.08),black,'WindowFrame')
roof=box('wing-ceiling',((x0+x1)/2,ceiling+.07,(z0+z1)/2),(x1-x0,.14,z1-z0),ivory,'Ceiling');roof.hide_render=True;roof.hide_set(True)
# Bar: separate service counter, working passage, back storage and appliances.
box('bar-cabinet',(-9.7,-1.02,-22.3),(.85,1.06,5.5),wood,'Bar')
box('bar-counter',(-9.7,-.46,-22.3),(1.04,.10,5.65),black,'Counter')
for n in range(45):box(f'bar-slat:{n}',(-9.26,-1.02,-24.95+n*.12),(.025,.94,.035),wood,'Cladding',bevel=.005)
box('bar-light',(-9.235,-.53,-22.3),(.02,.025,5.4),warm,'ReferenceLight')
box('bar-plinth-light',(-9.24,-1.48,-22.3),(.02,.025,5.4),warm,'ReferenceLight')
box('back-storage',(-11.5,-1.02,-22.5),(.60,1.06,5.5),wood,'Storage')
box('back-worktop',(-11.5,-.46,-22.5),(.66,.09,5.6),black,'Counter')
for n,z in enumerate([-24.3,-22.7,-21.1]):
 box(f'back-shelf:{n}',(-11.5,.45,z),(.62,.07,1.4),wood,'Shelf')
 box(f'back-shelf-light:{n}',(-11.45,.40,z),(.48,.025,1.3),warm,'ReferenceLight')
 for j in range(4):cyl(f'jar:{n}:{j}',(-11.42,.61,z-.5+j*.32),.065,.23,ivory,'Jar')
box('fridge',(-11.5,-.25,-19.2),(.75,2.5,.9),metal,'Refrigerator')
box('fridge-seam',(-11.11,-.68,-19.2),(.012,.025,.88),black,'Detail')
box('espresso-machine',(-9.7,-.10,-23.7),(.62,.64,.8),metal,'CoffeeMachine')
box('espresso-face',(-9.37,-.12,-23.7),(.025,.38,.65),black,'Detail')
for n,z in enumerate([-23.9,-23.5]):
 cyl(f'espresso-cup:{n}',(-9.30,-.34,z),.07,.10,ivory,'Cup')
box('display-base',(-9.7,-.25,-20.3),(.72,.35,1.05),black,'DisplayCase')
box('display-glazing',(-9.7,.02,-20.3),(.72,.38,1.05),glass,'DisplayGlazing')
for n in range(4):
 z=-24.3+n*1.30
 cyl(f'stool:{n}:seat',(-8.6,-.60,z),.25,.075,wood,'Stool')
 for side in [-1,1]:
  for end in [-1,1]:box(f'stool:{n}:leg:{side}:{end}',(-8.6+side*.17,-1.08,z+end*.14),(.035,.90,.035),black,'StoolFrame')
# Normal cafe tables replace the representative pods at their sector, without becoming Core resources.
for n,(x,z) in enumerate(config['table_centers_xz']):
 cyl(f'table:{n}:top',(x,-.73,z),.70,.08,wood,'CafeTable')
 cyl(f'table:{n}:stem',(x,-1.16,z),.045,.78,black,'TableLeg')
 cyl(f'table:{n}:base',(x,-1.51,z),.35,.045,black,'TableLeg')
 for j in range(4):
  a=j*math.tau/4; cx=x+math.cos(a)*1.10; cz=z+math.sin(a)*1.10
  box(f'table:{n}:chair:{j}:seat',(cx,-1.02,cz),(.48,.10,.48),fabric,'Chair',bevel=.05)
  box(f'table:{n}:chair:{j}:back',(cx+math.cos(a)*.22,-.74,cz+math.sin(a)*.22),(.48,.50,.08),fabric,'Chair',yaw=math.pi/2-a,bevel=.035)
  for side in [-1,1]:box(f'table:{n}:chair:{j}:legs:{side}',(cx+side*.18,-1.30,cz),(.035,.50,.38),black,'ChairFrame')
 cyl(f'table:{n}:plant-pot',(x,-.59,z),.10,.20,ivory,'Planter')
# Hanging black shelves, foliage and warm architectural light derived from reference 1212.
leaf_template=next(o for o in bpy.data.objects if o.name.startswith('sim:p1:green-wall:leaf:'))
for n,z in enumerate([-23.7,-21.0]):
 box(f'hanging-shelf:{n}',(-9.6,.65,z),(1.1,.06,1.8),wood,'Shelf')
 for side in [-1,1]:
  for end in [-1,1]:box(f'hanging-frame:{n}:{side}:{end}',(-9.6+side*.53,1.11,z+end*.90),(.035,.95,.035),black,'ShelfFrame')
  box(f'hanging-top:{n}:{side}',(-9.6+side*.53,1.58,z),(.035,.035,1.85),black,'ShelfFrame')
 box(f'hanging-light:{n}',(-9.6,.60,z),(1,.025,1.7),warm,'ReferenceLight')
 for j in range(30):
  o=leaf_template.copy();o.data=leaf_template.data;col.objects.link(o)
  o.location=to_blender((-9.6+math.sin(j*2.4)*.50,.82-(j%6)*.10,z+math.cos(j*2.4)*.8))
  register(o,f'hanging-plant:{n}:{j}','Vegetation')
for i,(x,z) in enumerate([(-10,-22.4),(-5,-22),(-7,-19.5)]):
 data=bpy.data.lights.new(f'cafe:warm:{i}','AREA');data.energy=130;data.color=(1,.70,.43);data.size=3
 o=bpy.data.objects.new(data.name,data);col.objects.link(o);o.location=to_blender((x,1.40,z))
# Reference title is metadata, not a physical signage claim.
for name,p,target,fov in [('cafe-interior',[-6.9,.15,-18.8],[-10,-.1,-22.7],72),('cafe-dollhouse',[18,24,8],[-3,-.5,-12],55),('cafe-plan',[-3.8,33,-12],None,58)]:
 data=bpy.data.cameras.new('view:'+name);data.sensor_fit='VERTICAL';data.angle=math.radians(fov);data.clip_end=200
 o=bpy.data.objects.new('view:'+name,data);scene.collection.objects.link(o);o.location=to_blender(p)
 if target:o.rotation_euler=(Vector(to_blender(target))-o.location).to_track_quat('-Z','Y').to_euler()
 else:o.rotation_euler=(0,0,0)
scene.camera=bpy.data.objects['view:cafe-dollhouse']
scene.cycles.samples=32;scene.cycles.use_denoising=False
bpy.context.preferences.filepaths.save_version=0
master=OUTPUT/'office-cafe-L.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(master),compress=True)
assert sha256(original)==original_hash and not protected_changes()
write(OUTPUT/'cafe-inventory.json',{'layout':config,'source_master_sha256':original_hash,'master_sha256':sha256(master),'removed_reconstruction_ids':removed,'objects':[{'id':o.name,'type':o['semantic_type'],'environment_id':o['environment_id'],'source_position':list(to_source(o.location)),'matrix_blender':[list(row) for row in o.matrix_world],'material':[m.name for m in o.data.materials]} for o in new],'reference_sha256':{p:sha256(ROOT/p) for p in config['references']}})
print('CAFE_L_BUILT',len(new),'objects; source master and protected sources intact')
