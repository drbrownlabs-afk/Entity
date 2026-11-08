"""Phase02 derivative. Preserve cafe/source masters. Run with Blender --python-exit-code 1."""
import math,sys,json
from pathlib import Path
import bpy
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import ROOT,HERE,OUTPUT,HANDOFF,read,write,sha256,to_blender,to_source,protected_changes
cfg=read(HERE/'phase02-layout.json'); E=HANDOFF/'evidence/phase02';E.mkdir(parents=True,exist_ok=True)
source=OUTPUT/'office-cafe-L.blend'; source_hash=sha256(source)
assert not protected_changes()
bpy.ops.wm.open_mainfile(filepath=str(source)); scene=bpy.context.scene
scene['phase']='02; new architecture; human review pending'
collection=bpy.data.collections.new('Phase02 - rooms devices and access');scene.collection.children.link(collection)
new=[];doors=[];partitions=[];tvs=[];removed=[]
materials=bpy.data.materials
black=materials['Graphite powder coat'];wood=materials['Cafe warm oak'];ivory=materials['Warm white plaster'];fabric=materials['Sand upholstery'];stone=materials['Terrazzo warm - procedural reference'];chrome=materials['Chair brushed aluminum']
glass=bpy.data.materials.new('Phase02 clear partitions');glass.use_nodes=True
bsdf=glass.node_tree.nodes.get('Principled BSDF');bsdf.inputs['Base Color'].default_value=(.95,.98,1,1);bsdf.inputs['Transmission Weight'].default_value=1;bsdf.inputs['Roughness'].default_value=.025;bsdf.inputs['IOR'].default_value=1.45

def reg(o,id,kind,env):
 o.name='sim:p2:'+id
 for c in list(o.users_collection):c.objects.unlink(o)
 collection.objects.link(o)
 for k,v in {'stable_id':o.name,'semantic_type':kind,'environment_id':env,'geometry_origin':'Phase02 new design estimate; phase02-layout.json','source_frame':'supersplat-original +Y up','source_position':list(to_source(o.location)),'meters_verified':False}.items():o[k]=v
 new.append(o);return o

def mesh_object(id,p,vertices,faces,mat,kind,env,bevel=0):
 mesh=bpy.data.meshes.new(id);mesh.from_pydata(vertices,[],faces);mesh.update()
 if kind=='TVScreen':
  uv=mesh.uv_layers.new(name='ContentUV')
  for poly in mesh.polygons:
   for j,loop in enumerate(poly.loop_indices):uv.data[loop].uv=[(0,0),(1,0),(1,1),(0,1)][j%4]
 o=bpy.data.objects.new(id,mesh);scene.collection.objects.link(o);o.location=to_blender(p);mesh.materials.append(mat)
 if bevel:
  m=o.modifiers.new('Manufactured edges','BEVEL');m.width=bevel;m.segments=2
 return reg(o,id,kind,env)

def box(id,p,size,mat,kind,env,bevel=.008):
 a,b,c=size[0]/2,size[2]/2,size[1]/2
 vertices=[(-a,-b,-c),(a,-b,-c),(a,b,-c),(-a,b,-c),(-a,-b,c),(a,-b,c),(a,b,c),(-a,b,c)]
 return mesh_object(id,p,vertices,[(3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],mat,kind,env,bevel)

def cyl(id,p,r,h,mat,kind,env):
 n=24;vs=[(r*math.cos(i*math.tau/n),r*math.sin(i*math.tau/n),z) for z in [-h/2,h/2] for i in range(n)]
 fs=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
 return mesh_object(id,p,vs,fs,mat,kind,env)

def remove(name):
 o=bpy.data.objects.get(name)
 if o:removed.append(name);bpy.data.objects.remove(o,do_unlink=True)

def parent_keep(o,p):
 world_location=o.location.copy();o.parent=p;o.location=world_location-p.location

# Keep desk/seat positions; move only explicitly estimated storage/waiting layout.
bpy.data.objects['sim:p1:A:storage'].location.y=3.3
for i,z in enumerate([-15.1,-16.0,-16.9]):
 delta=Vector((-1.22,0,0))
 for o in bpy.data.objects:
  if o.name.startswith(f'sim:p1:waiting:chair:{i+1}:'):o.location+=delta
# Current plan: white chairs are reception; black-chair sector becomes sofa waiting.
for o in list(bpy.data.objects):
 if o.name.startswith('sim:p1:reception:chair:'):remove(o.name)
 elif o.name.startswith('sim:p1:waiting:chair:'):o['environment_id']='RECEPTION'
# True ramp slot in the raised floor, not a slab pasted over a step.
remove('sim:p1:floor-reception-raised');remove('sim:p1:step-riser')
box('raised-west',(-5.0,-1.70,-11.4),(2.9,.30,24.5),stone,'Floor','CIRCULATION-01')
for name,zlo,zhi in [('front',-18.05,.85),('back',-23.65,-19.35)]:
 box('raised-east:'+name,(-3.2,-1.70,(zlo+zhi)/2),(.70,.30,zhi-zlo),stone,'Floor','CIRCULATION-01')
 box('riser:'+name,(-2.84,-1.70,(zlo+zhi)/2),(.045,.30,zhi-zlo),ivory,'Step','CIRCULATION-01')
verts=[(-3.55,-1.55,-19.35),(-2.35,-1.85,-19.35),(-2.35,-1.85,-18.05),(-3.55,-1.55,-18.05)]
m=bpy.data.meshes.new('Ramp mesh');m.from_pydata([to_blender(p) for p in verts],[],[(0,1,2,3)]);m.update()
o=bpy.data.objects.new('ramp',m);scene.collection.objects.link(o);o.data.materials.append(stone);reg(o,'ramp','Ramp','CIRCULATION-01')
# Additional E fits beyond D without moving measured D surfaces; envelope is a design estimate.
box('rear-floor',(.75,-1.94,-27.55),(7.2,.18,2.1),stone,'Floor','sim:ROOM-E')
box('rear-ceiling',(.75,1.72,-27.55),(7.2,.14,2.1),ivory,'Ceiling','sim:ROOM-E').hide_render=True
remove('sim:p1:end-window:0') # front green wall is opaque, not a window in front of foliage
remove('sim:p1:end-window:1')
box('cafe-rear-retained',(-3.925,-.05,-26.2),(4.65,3.3,.035),glass,'Window','sim:CAFE-01')
box('E-rear-window',(1.3,-.05,-28.35),(5.8,3.3,.035),glass,'Window','sim:ROOM-E')
box('E-side-window',(4.29,-.05,-27.4),(.035,3.3,2.4),glass,'Window','sim:ROOM-E')
# Match original-family long table and six seats; new namespace only.
x,y,z=cfg['E_table']['center'];env='sim:ROOM-E'
box('E:desktop',(x,y,z),cfg['E_table']['dimensions'],materials['Graphite desktop'],'Table',env)
box('E:divider',(x,y+.19,z),(3.2,.36,.035),fabric,'TableDivider',env)
for i,(dx,dz) in enumerate([(-1,-1),(-1,1),(1,-1),(1,1)]):cyl('E:leg:'+str(i),(x+dx*1.45,-1.38,z+dz*.45),.035,.9,black,'TableLeg',env)
for i in range(6):
 row,slot=divmod(i,3);cx=x+(slot-1)*1.1;cz=z+(-1 if row==0 else 1)*1.02
 box(f'E:chair:{i}:seat',(cx,-1.12,cz),(.50,.10,.48),fabric,'Chair',env,.04)
 box(f'E:chair:{i}:back',(cx,-.86,cz+(-.22 if row==0 else .22)),(.50,.48,.08),fabric,'Chair',env,.03)
 cyl(f'E:chair:{i}:stem',(cx,-1.5,cz),.035,.6,chrome,'ChairFrame',env)
 for j in range(5):
  a=j*math.tau/5
  box(f'E:chair:{i}:foot:{j}',(cx+math.cos(a)*.13,-1.79,cz+math.sin(a)*.13),(.28,.03,.035),chrome,'ChairFrame',env)
 box(f'E:monitor:{i}',(cx,y+.28,z+(-.18 if row==0 else .18)),(.52,.32,.045),ivory,'Monitor',env)
# Partitions are split into short modules with slender black frames, not monolithic glazing.
def pane(id,p,size,env):
 o=box(id+':glass',p,size,glass,'Partition',env,.003);partitions.append(o.name)
 # upright framing at panel boundaries, ceiling/floor rails
 if size[0]>.1:
  for side in [-1,1]:box(id+':vertical:'+str(side),(p[0]+side*size[0]/2,p[1],p[2]),(.025,size[1],.035),black,'PartitionFrame',env)
 else:
  for side in [-1,1]:box(id+':vertical:'+str(side),(p[0],p[1],p[2]+side*size[2]/2),(.035,size[1],.025),black,'PartitionFrame',env)
 for side in [-1,1]:box(id+':rail:'+str(side),(p[0],p[1]+side*size[1]/2,p[2]),(max(.035,size[0]),.025,max(.035,size[2])),black,'PartitionFrame',env)

def wall(id,axis,fixed,lo,hi,env):
 n=max(1,math.ceil((hi-lo)/1.35))
 for i in range(n):
  a=lo+(hi-lo)*i/n;b=lo+(hi-lo)*(i+1)/n
  pane(f'{id}:{i}',((a+b)/2,-.10,fixed) if axis=='X' else (fixed,-.10,(a+b)/2),(b-a,3.5,.025) if axis=='X' else (.025,3.5,b-a),env)

def door(id,env,hinge,width,axis='Z'):
 pivot=bpy.data.objects.new(id,None);scene.collection.objects.link(pivot);pivot.location=to_blender(hinge);reg(pivot,id,'DoorPivot',env)
 pivot['locked']=False;pivot['open_angle']=math.pi/2 if axis=='Z' else -math.pi/2;pivot['opening_width']=width
 floor=hinge[1];c=(hinge[0],floor+1.68,hinge[2]+width/2) if axis=='Z' else (hinge[0]+width/2,floor+1.68,hinge[2])
 size=(.025,3.35,width-.06) if axis=='Z' else (width-.06,3.35,.025)
 leaf=box(id+':leaf',c,size,glass,'DoorLeaf',env,.003);parent_keep(leaf,pivot)
 collider=box(id+':collider',c,(.07,3.35,width-.06) if axis=='Z' else (width-.06,3.35,.07),black,'DoorCollider',env,0);parent_keep(collider,pivot);collider.hide_render=True;collider.hide_set(True);collider.display_type='WIRE'
 for side in [-1,1]:
  p=(c[0],c[1],c[2]+side*(width-.06)/2) if axis=='Z' else (c[0]+side*(width-.06)/2,c[1],c[2])
  frame=box(id+':edge:'+str(side),p,(.04,3.35,.025) if axis=='Z' else (.025,3.35,.04),black,'DoorFrame',env);parent_keep(frame,pivot)
 handle=box(id+':handle',(c[0]+.06,c[1]-.25,c[2]+width*.3) if axis=='Z' else (c[0]+width*.3,c[1]-.25,c[2]+.06),(.04,.35,.04),chrome,'DoorHandle',env);parent_keep(handle,pivot)
 for frame,angle in [(1,0),(31,pivot['open_angle']),(61,0)]:pivot.rotation_euler.z=angle;pivot.keyframe_insert('rotation_euler',frame=frame)
 doors.append({'id':pivot.name,'environment_id':env,'hinge_source':hinge,'width':width,'leaf_id':leaf.name,'collider_id':collider.name,'open_angle':pivot['open_angle'],'simulated':True})
 return pivot

for r in cfg['rooms']:
 env=r['id'];xl,xr,zl,zr=r['bounds'];h=r['hinge_z'];w=r['door_width']
 wall(env+':west-before','Z',xl,zl,h,env);wall(env+':west-after','Z',xl,h+w,zr,env)
 wall(env+':rear','X',zl,xl,xr,env)
 if not r.get('reuse_green_back') and not r.get('reuse_front_partition'):wall(env+':front','X',zr,xl,xr,env)
 wall(env+':east','Z',xr,zl,zr,env)
 door('door:'+env,env,(xl,r['floor_y'],h),w)
 pane(env+':door-transom',(xl,1.575,h+w/2),(.025,.15,w),env)
# Security gate uses same independent pivot/collider, and stays within corridor when open.
door('door:security','CIRCULATION-01',(-2.85,-1.85,-12.95),1.35,'X')
# Reception counter/kiosk and expanded waiting face a clear aisle.
box('reception-counter',(-3.65,-1.05,-16.1),(.65,1,2.1),wood,'ReceptionCounter','RECEPTION')
box('reception-top',(-3.65,-.51,-16.1),(.75,.08,2.2),black,'Counter','RECEPTION')
box('reception-kiosk',(-3.65,-.18,-16.1),(.18,.60,.65),black,'Kiosk','RECEPTION')
box('waiting-sofa-base',(-5.65,-1.20,-9.2),(.75,.7,1.8),fabric,'Sofa','WAITING-AREA',.08)
box('waiting-sofa-back',(-6.0,-.83,-9.2),(.14,.7,1.8),fabric,'Sofa','WAITING-AREA',.06)
box('waiting-armchair-seat',(-3.9,-1.15,-8.3),(.65,.25,.65),fabric,'Armchair','WAITING-AREA',.06)
box('waiting-armchair-back',(-3.55,-.84,-8.3),(.12,.65,.65),fabric,'Armchair','WAITING-AREA',.04)
cyl('waiting-side-table',(-4.8,-.93,-10.1),.28,.07,wood,'SideTable','WAITING-AREA')
cyl('waiting-side-table-leg',(-4.8,-1.25,-10.1),.035,.60,black,'TableLeg','WAITING-AREA')
for i,(env,p,axis) in enumerate([('RECEPTION',(-6.30,.10,-15.8),'X'),('WAITING-AREA',(-6.30,.10,-9.2),'X'),('sim:CAFE-01',(-9.0,.10,-18.32),'Z'),('CIRCULATION-01',(-4.79,.10,-12.5),'X')],1):
 mat=bpy.data.materials.new(f'TV{i} independent content');mat.use_nodes=True;n=mat.node_tree.nodes.get('Principled BSDF');n.inputs['Base Color'].default_value=(.02,.12*i,.22,1);n.inputs['Emission Color'].default_value=(.02,.12*i,.22,1);n.inputs['Emission Strength'].default_value=.5
 body=box(f'TV:{i}:body',p,(.10,.85,1.5) if axis=='X' else (1.5,.85,.10),black,'TV',''+env)
 pos=(p[0]+.06,p[1],p[2]) if axis=='X' else (p[0],p[1],p[2]-.06)
 screen=box(f'TV:{i}:screen',pos,(.012,.76,1.4) if axis=='X' else (1.4,.76,.012),mat,'TVScreen',env,.003)
 screen['content_state']='test-pattern-'+str(i);screen['content_material']=mat.name
 image=bpy.data.images.new(f'TV{i} test pattern',width=128,height=64)
 pixels=[]
 for py in range(64):
  for px in range(128):
   band=(px//16+i)%4;pixels.extend([.08+band*.2,.15+i*.12,.70-band*.12,1])
 image.pixels=pixels;image.pack()
 tex=mat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image
 mat.node_tree.links.new(tex.outputs['Color'],n.inputs['Base Color']);mat.node_tree.links.new(tex.outputs['Color'],n.inputs['Emission Color'])
 tvs.append({'id':body.name,'screen_id':screen.name,'environment_id':env,'material':mat.name,'state':'test-pattern-'+str(i)})
# Floor labels and inspection cameras are identifiers for review, not new Core entities.
for r in cfg['rooms']:
 xl,xr,zl,zr=r['bounds'];bpy.ops.object.text_add(location=to_blender((2.8,-1.80,(zl+zr)/2)))
 o=bpy.context.object;o.data.body='E' if r['id']=='sim:ROOM-E' else 'REUNION' if r['id']=='MEETING-AREA-01' else r['id'];o.data.size=.42;o.data.align_x='CENTER';o.data.materials.append(black);reg(o,'label:'+r['id'],'ReviewLabel',r['id'])
for name,p,t,fov in [('phase02-plan',[-3.8,36,-13],None,58),('phase02-general',[20,26,8],[-3,-.5,-13],55),('phase02-interior',[-2.2,-.15,-.8],[.9,-.3,-5.3],85),('phase02-E',[-2.2,-.1,-25.2],[1.3,-.5,-26.3],85)]:
 data=bpy.data.cameras.new('view:'+name);data.sensor_fit='VERTICAL';data.angle=math.radians(fov);data.clip_end=200
 o=bpy.data.objects.new('view:'+name,data);scene.collection.objects.link(o);o.location=to_blender(p)
 if t:o.rotation_euler=(Vector(to_blender(t))-o.location).to_track_quat('-Z','Y').to_euler()
scene.camera=bpy.data.objects['view:phase02-general'];scene.frame_start=1;scene.frame_end=61;scene.frame_set(1)
for o in bpy.data.objects:
 if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=True;o.hide_set(True)
scene.cycles.samples=24;scene.cycles.use_denoising=False
text=bpy.data.texts.new('Phase02 door controls');text.write("import sys\nsys.path.insert(0,"+repr(str(HERE))+")\nfrom doors import command, query\n# command('sim:p2:door:A','open'); advance 30 frames to see animation\n# query('sim:p2:door:A'); command(...,'close'/'lock'/'unlock')\n")
scene['door_control_note']='Blender-local simulated commands in doors.py; frames 1 closed /31 open /61 closed. Same pivot transforms visible leaf and collider. No real access control.'
bpy.context.preferences.filepaths.save_version=0
master=OUTPUT/'office-phase02.blend';bpy.ops.wm.save_as_mainfile(filepath=str(master),compress=True)
bpy.context.view_layer.update()
write(OUTPUT/'phase02-inventory.json',{'layout':cfg,'master_sha256':sha256(master),'source_master_sha256':source_hash,'source_master':str(source.relative_to(ROOT)),'objects':[{'id':o.name,'type':o['semantic_type'],'environment_id':o['environment_id'],'position_source':list(to_source(o.matrix_world.translation)),'matrix_world':[list(r) for r in o.matrix_world]} for o in new],'doors':doors,'partitions':partitions,'televisions':tvs,'removed_estimated_objects':removed,'business_entities_created':False,'input_hashes':{str(p.relative_to(ROOT)):sha256(p) for p in [HERE/'build-phase02.py',HERE/'doors.py',HERE/'phase02-layout.json']}})
assert sha256(source)==source_hash and not protected_changes()
print('PHASE02_BUILT',len(new),'objects',len(doors),'doors',len(tvs),'TVs')
