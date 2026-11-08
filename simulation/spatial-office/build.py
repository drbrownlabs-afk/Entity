"""Blender 4.3+: reconstruct Phase 01 only. All geometry is independently editable.

Run: blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/build.py
No source scene, source inventory, backend or frontend writes.
"""
import json
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import EVIDENCE, HANDOFF, HERE, OUTPUT, ROOT, protected_changes, read, sha256, to_blender, to_source, write

assert not protected_changes(), 'Protected source changed; refuse reconstruction'
OUTPUT.mkdir(exist_ok=True)
EVIDENCE.mkdir(parents=True, exist_ok=True)
layout = read(HERE / 'layout.json')
source = read(HANDOFF / 'SPACE-INVENTORY.json')
inventory = {r['id']: r for r in source['inventory']}
annotations = read(HANDOFF / 'ANNOTATIONS-MAP.json')
random.seed(917)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for c in list(bpy.data.collections):
    bpy.data.collections.remove(c)
scene = bpy.context.scene
scene.unit_settings.system = 'NONE'
scene['coordinate_conversion'] = '(x,y,z)->(x,-z,y), once; inverse (x,y,z)->(x,z,-y)'
scene['meters_verified'] = False
scene['source_scene_id'] = 'a972d838'
scene['phase'] = '01; technical validation pending; human approval pending'
scene['source_license'] = 'argenzio, Synthetic Office, CC BY-NC 4.0'
scene['base_commit'] = read(EVIDENCE / 'protected-files.json')['base_commit']


def collection(name, parent=None):
    c = bpy.data.collections.get(name)
    if c is None:
        c = bpy.data.collections.new(name)
        (parent or scene.collection).children.link(c)
    return c


architecture = collection('01 Architecture')
environments = collection('02 Environments')
types = collection('03 Semantic types')
references = collection('00 Source references - read only')
cameras = collection('04 Inspection cameras')
illumination = collection('05 Reference lighting - not operational circuits')
envs = {}
catalog = []


def decorate(obj, stable_id, kind, env, provenance, parent=None):
    assert stable_id not in {r['id'] for r in catalog}, stable_id
    obj.name = stable_id
    for old in list(obj.users_collection):
        old.objects.unlink(obj)
    if env not in envs:
        envs[env] = collection('Environment ' + env, environments)
    envs[env].objects.link(obj)
    collection('Type ' + kind, types).objects.link(obj)
    obj['stable_id'] = stable_id
    obj['semantic_type'] = kind
    obj['environment_id'] = env
    obj['geometry_origin'] = provenance
    obj['source_frame'] = 'supersplat-original +Y up'
    obj['source_position'] = list(to_source(obj.location))
    obj['meters_verified'] = False
    obj['phase'] = '01'
    if parent:
        # Preserve the world transform when linking to the semantic environment root.
        world = obj.matrix_world.copy()
        obj.parent = parent
        obj.matrix_world = world
    catalog.append({'id': stable_id, 'type': kind, 'environment_id': env,
                    'geometry_origin': provenance, 'source_position': list(obj['source_position']),
                    'blender_position': list(obj.location), 'source_dimensions': [obj.dimensions.x, obj.dimensions.z, obj.dimensions.y],
                    'materials': [m.name for m in obj.data.materials] if obj.type == 'MESH' else [],
                    'parent_id': parent.get('stable_id') if parent else None})
    return obj


def material(name, rgb, metallic=0, roughness=.5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    node = m.node_tree.nodes.get('Principled BSDF')
    node.inputs['Base Color'].default_value = (*rgb, 1)
    node.inputs['Roughness'].default_value = roughness
    node.inputs['Metallic'].default_value = metallic
    m.diffuse_color = (*rgb, 1)
    return m


stone = material('Terrazzo warm - procedural reference', (.63, .57, .46), roughness=.57)
nodes = stone.node_tree.nodes
noise = nodes.new('ShaderNodeTexNoise')
noise.inputs['Scale'].default_value = 125
noise.inputs['Detail'].default_value = 2
geometry = nodes.new('ShaderNodeNewGeometry')
stone.node_tree.links.new(geometry.outputs['Position'], noise.inputs['Vector'])
ramp = nodes.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position = .27
ramp.color_ramp.elements[0].color = (.20, .17, .13, 1)
ramp.color_ramp.elements[1].position = .60
ramp.color_ramp.elements[1].color = (.72, .67, .56, 1)
stone.node_tree.links.new(noise.outputs['Fac'], ramp.inputs[0])
stone.node_tree.links.new(ramp.outputs[0], nodes.get('Principled BSDF').inputs['Base Color'])
ivory = material('Warm white plaster', (.80, .78, .70))
black = material('Graphite powder coat', (.035, .04, .04), metallic=.55, roughness=.3)
chrome = material('Chair brushed aluminum', (.48, .50, .51), metallic=.85, roughness=.24)
desk_mat = material('Graphite desktop', (.12, .13, .12), roughness=.32)
wood = material('Walnut wall panels', (.12, .075, .043), roughness=.47)
lightwood = material('Booth oak', (.48, .30, .15), roughness=.5)
fabric = material('Sand upholstery', (.46, .35, .24), roughness=.86)
green = material('Leaf green', (.065, .17, .025), roughness=.75)
green2 = material('Leaf light green', (.16, .30, .045), roughness=.78)
teal = material('Booth teal', (.015, .22, .19), roughness=.8)
purple = material('Booth aubergine', (.16, .035, .10), roughness=.8)
screen_mat = material('Original monitor blue placeholder', (.02, .09, .18), roughness=.28)
white = material('Keyboard ivory', (.81, .82, .78), roughness=.5)
glass = material('Window glazing reference', (.74, .84, .87), roughness=.12)
glass.node_tree.nodes.get('Principled BSDF').inputs['Transmission Weight'].default_value = .65


def finish(obj, stable_id, kind, env, mat, provenance, bevel=.02):
    if mat:
        obj.data.materials.append(mat)
    if bevel and obj.type == 'MESH':
        b = obj.modifiers.new('Small manufactured edge', 'BEVEL')
        b.width = bevel
        b.segments = 2
        obj.modifiers.new('Weighted corner normals', 'WEIGHTED_NORMAL')
    return decorate(obj, stable_id, kind, env, provenance)


EST = 'visual-estimate; simulation/spatial-office/layout.json; not a certified measurement'


def box(id, p, size, mat, env='CIRCULATION-01', kind='Architecture', rotation=0, bevel=.02, provenance=EST):
    bpy.ops.mesh.primitive_cube_add(size=1, location=to_blender(p))
    o = bpy.context.object
    o.dimensions = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.rotation_euler.z = rotation
    return finish(o, id, kind, env, mat, provenance, bevel)


def cylinder(id, p, radius, height, mat, env='CIRCULATION-01', kind='Column', vertices=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=height, location=to_blender(p))
    o = bpy.context.object
    for poly in o.data.polygons:
        poly.use_smooth = True
    return finish(o, id, kind, env, mat, EST, .012)


def empty(id, p, env, provenance, display='PLAIN_AXES'):
    o = bpy.data.objects.new(id, None)
    o.empty_display_type = display
    o.empty_display_size = .25
    o.location = to_blender(p)
    scene.collection.objects.link(o)
    return decorate(o, id, 'SourceAnchor', env, provenance)


# Keep exact anchors, including unknown locations, distinct from invented furniture centers.
for r in source['inventory']:
    if r['position'] is not None and r['kind'] != 'Camera':
        o = empty('ref:' + r['id'], r['position'], 'REFERENCES', r['classification'])
        o['source_entity_id'] = r['id']
        o['source_record'] = json.dumps(r, ensure_ascii=False)
        references.objects.link(o)
        o.hide_render = True
        o.hide_set(True)

# Parse the measured OBJ directly: no importer axis correction followed by a second rotation.
verts, faces = [], []
for line in (HANDOFF / 'WALKABLE-FLOOR.obj').read_text().splitlines():
    if line.startswith('v '):
        verts.append(to_blender(tuple(map(float, line.split()[1:]))))
    elif line.startswith('f '):
        faces.append(tuple(int(i) - 1 for i in line.split()[1:]))
mesh = bpy.data.meshes.new('Original partial walkable floor - unchanged topology')
mesh.from_pydata(verts, [], faces)
mesh.update()
guide = bpy.data.objects.new('ref:WALKABLE-FLOOR', mesh)
scene.collection.objects.link(guide)
decorate(guide, 'ref:WALKABLE-FLOOR', 'MeasuredFloorGuide', 'REFERENCES', 'exact original OBJ; conversion once')
references.objects.link(guide)
guide.hide_render = True
guide.display_type = 'WIRE'
guide.hide_set(True)
guide['source_sha256'] = sha256(HANDOFF / 'WALKABLE-FLOOR.obj')

# Reconstructed floor deliberately fills gaps only in a separate estimated design slab.
s = layout['shell']
x0, x1, z0, z1 = (s[k] for k in ('x_min', 'x_max', 'z_min', 'z_max'))
floor = layout['floor_y']
ceiling = layout['ceiling_y']
box('sim:p1:floor-main', ((x0+x1)/2, floor-.09, (z0+z1)/2), (x1-x0,.18,z1-z0), stone, kind='Floor')
box('sim:p1:floor-reception-raised', (-4.65, -1.70, -11.4), (3.6,.30,24.5), stone, kind='RaisedFloor')
box('sim:p1:step-riser', (-2.84,-1.70,-11.4), (.045,.30,24.5), ivory, kind='Step')
box('sim:p1:wall-west', (-6.55,(ceiling-1.55)/2,(z0+z1)/2), (.16,ceiling+1.55,z1-z0), ivory, kind='Wall')
for j, (start,end) in enumerate([(1.9,-6.9),(-10.7,-14.2),(-17.7,-26.5)]):
    box(f'sim:p1:panel-west:{j}', (-4.91,.05,(start+end)/2), (.13,3.2,abs(end-start)), wood, kind='WallCladding')
    for n in range(max(1,int(abs(end-start)/1.1))):
        box(f'sim:p1:panel-seam:{j}:{n}', (-4.83,.05,start-1.1*n), (.008,3.1,.012), chrome, kind='WallDetail', bevel=0)
for i,z in enumerate([2.35, -26.2]):
    box(f'sim:p1:end-window:{i}', (-1.0,-.05,z), (10.5,3.3,.035), glass, kind='Window')
for i,z in enumerate([1.2-2.35*i for i in range(12)]):
    box(f'sim:p1:window:{i}', (4.29,-.05,z), (.025,3.3,2.30), glass, kind='Window')
    box(f'sim:p1:mullion:{i}', (4.20,-.05,z-1.16), (.095,3.4,.08), black, kind='WindowFrame')
for i,y in enumerate([-1.42,.77,1.59]):
    box(f'sim:p1:window-horizontal:{i}', (4.19,y,-11.9), (.10,.07,28.7), black, kind='WindowFrame')
box('sim:p1:window-sill', (4.15,-1.66,-11.9), (.22,.37,28.7), black, kind='WindowFrame')
for i,(x,z) in enumerate(layout['columns']):
    cylinder(f'sim:p1:column:{i+1:02}', (x,(floor+ceiling)/2,z), .245, ceiling-floor, ivory)
roof = box('sim:p1:ceiling', (-1.05,ceiling+.07,-11.9), (10.9,.14,29.2), ivory, kind='Ceiling')
for j,z in enumerate([-1.6,-6.9,-12.3,-18.0,-23.7]):
    for n,x in enumerate([-.1,2.8,-3.5]):
        box(f'sim:p1:ceiling-slot:{j}:{n}', (x,ceiling-.009,z), (.045,.018,2.0), black, kind='CeilingDetail', bevel=0)


def chair(id, p, yaw, mat=fabric, env='CIRCULATION-01', measured=False):
    x,y,z = p
    # p is the seat surface. Dimensions and orientation remain visual estimates.
    provenance = ('exact calibrated chair surface; shape/yaw estimated' if measured else EST)
    box(id+':seat', (x,y-.055,z), (.52,.11,.50), mat, env, 'Chair', yaw, .045, provenance)
    back_offset = (math.sin(yaw)*.22, math.cos(yaw)*.22)
    box(id+':back', (x+back_offset[0],y+.29,z+back_offset[1]), (.52,.54,.085), mat, env, 'Chair', yaw, .035)
    ground = layout['raised_floor_y'] if env in ['RECEPTION','WAITING-AREA'] else floor
    stem_bottom, stem_top = ground+.12, y-.11
    cylinder(id+':stem', (x,(stem_bottom+stem_top)/2,z), .035,stem_top-stem_bottom,chrome, env, 'ChairFrame',16)
    for i in range(5):
        angle = i*math.tau/5
        box(id+f':foot:{i}', (x+.14*math.cos(angle),ground+.08,z+.14*math.sin(angle)), (.31,.025,.025), chrome, env, 'ChairFrame', -angle, .008)
        cylinder(id+f':wheel:{i}', (x+.28*math.cos(angle),ground+.035,z+.28*math.sin(angle)), .035,.05,black,env,'ChairFrame',12)
    for side in [-1,1]:
        offx, offz = side*.29*math.cos(yaw), -side*.29*math.sin(yaw)
        box(id+f':arm:{side}',(x+offx,y+.17,z+offz),(.035,.04,.38),chrome,env,'ChairFrame',yaw,.015)


def monitor(id, p, yaw, env):
    x,y,z = p
    box(id+':body', p, (.56,.35,.045), white, env,'Monitor',yaw)
    # Faces toward the seated user (local +Z).
    box(id+':screen',(x+math.sin(yaw)*.027,y,z+math.cos(yaw)*.027),(.51,.29,.006),screen_mat,env,'MonitorScreen',yaw,.005)
    box(id+':stand',(x,y-.22,z),(.045,.15,.05),chrome,env,'MonitorStand',yaw)
    box(id+':base',(x,y-.30,z),(.24,.015,.17),chrome,env,'MonitorStand',yaw)
    box(id+':keyboard',(x+math.sin(yaw)*.35,y-.31,z+math.cos(yaw)*.35),(.38,.018,.12),white,env,'Keyboard',yaw,.005)


for group in layout['workgroups']:
    env = group['id']
    x,y,z = group['center']
    long_x = group['long_axis']=='X'
    length, depth = group['length'], group['depth']
    box(f'sim:p1:{env}:desktop',(x,y,z),(length,.07,depth) if long_x else (depth,.07,length),desk_mat,env,'Table')
    box(f'sim:p1:{env}:divider',(x,y+.20,z),(length-.10,.39,.035) if long_x else (.035,.39,length-.10),fabric,env,'TableDivider')
    for i,(dx,dz) in enumerate([(-1,-1),(-1,1),(1,-1),(1,1)]):
        leg_height=y-.035-floor
        cylinder(f'sim:p1:{env}:table-leg:{i}', (x+dx*(length/2-.18 if long_x else depth/2-.12),floor+leg_height/2,z+dz*(depth/2-.12 if long_x else length/2-.18)),.032,leg_height,black,env,'TableLeg')
    for n in range(1,7):
        if env in ['C','D']:
            p = inventory[env+str(n)]['position']
        else:
            row, slot = (n-1)//3, (n-1)%3
            delta = (slot-1)*1.16
            p = (x+delta, -1.10, z+(-1 if row==0 else 1)*1.08) if long_x else (x+(-1 if row==0 else 1)*1.08,-1.10,z+delta)
        # Face table center; keep exact C/D surface y instead of flattening measured seats.
        yaw = math.atan2(p[0]-x, p[2]-z)
        chair(f'sim:p1:{env}:chair:{n}',p,yaw,env=env,measured=env in ['C','D'])
        if long_x:
            mp=(p[0],y+.35,z+(-.20 if p[2]<z else .20))
        else:
            mp=(x+(-.20 if p[0]<x else .20),y+.35,p[2])
        monitor(f'sim:p1:{env}:computer:{n}',mp,yaw,env)
    if env in ['A','B','D']:
        storage_pos = (x,-1.29,z+2.35) if long_x else (x-1.85,-1.29,z)
        box(f'sim:p1:{env}:storage',storage_pos,( .42,1.02,3.0) if not long_x else (3.0,1.02,.42),ivory,env,'Storage')

# Meeting table belongs to the green wall, never the waiting area.
mx,my,mz = layout['meeting']['center']
box('sim:p1:meeting:table',(mx,my,mz),(3.85,.10,1.35),black,'MEETING-AREA-01','Table',bevel=.25)
for n,dx in enumerate([-1.25,1.25]):
    box(f'sim:p1:meeting:base:{n}',(mx+dx,-1.425,mz),(.16,.85,.76),black,'MEETING-AREA-01','TableLeg')
for n in range(8):
    row,slot=divmod(n,4)
    chair(f'sim:p1:meeting:chair:{n+1}',(mx+(slot-1.5)*.85,-1.10,mz+(-1 if row==0 else 1)*.99),math.pi if row==0 else 0,black,'MEETING-AREA-01')
box('sim:p1:green-wall:backing',(-.05,-.03,2.43),(8.30,3.15,.12),green,'MEETING-AREA-01','GreenWall')


def leaf(id, p, size, env, mat=green):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=1,location=to_blender(p))
    o=bpy.context.object
    o.scale=(size*.65,size,size*.25)
    o.rotation_euler=(random.random()*2,random.random()*2,random.random()*6)
    finish(o,id,'Vegetation',env,mat,EST,0)


for n in range(190):
    leaf(f'sim:p1:green-wall:leaf:{n}',(random.uniform(-4.0,4),random.uniform(-1.5,1.45),2.30),random.uniform(.12,.24),'MEETING-AREA-01',green if n%3 else green2)
for group in layout['workgroups'][:3]:
    x,_,z=group['center']
    # Hanging white boxes and vines are visible in original A/B interior references.
    for n,dx in enumerate([-.8,.7]):
        box(f'sim:p1:{group["id"]}:planter:{n}',(x+dx,.75,z+2.45),(.63,.28,.55),ivory,group['id'],'Planter')
        for side in [-1,1]:
            cylinder(f'sim:p1:{group["id"]}:planter-wire:{n}:{side}',(x+dx+side*.24,1.25,z+2.45),.008,.80,black,group['id'],'PlanterFrame',8)
        for j in range(13):
            leaf(f'sim:p1:{group["id"]}:vine:{n}:{j}',(x+dx+random.uniform(-.25,.25),.65-j*.055,z+2.45+random.uniform(-.22,.22)),.12,group['id'])

# Reception: exact group anchor retained; two-chair arrangement is a separate visual estimate.
for n,z in enumerate([-8.65,-9.65]):
    chair(f'sim:p1:reception:chair:{n+1}',(-5.73,-.95,z),-math.pi/2,black,'RECEPTION')
for n,z in enumerate([-15.1,-16.0,-16.9]):
    chair(f'sim:p1:waiting:chair:{n+1}',(-4.48,-.95,z),-math.pi/2,ivory,'WAITING-AREA')

# Representative curved booths, not a claim to the unknown original count or exact footprint.
for n,(x,z) in enumerate(layout['pods']['centers']):
    env='REST-AREA'
    cylinder(f'sim:p1:pod:{n}:seat',(x,-1.24,z),.83,.40,fabric,env,'BoothSeat',32)
    for j in range(15):
        a=math.pi*.05+j*math.pi*1.50/14
        box(f'sim:p1:pod:{n}:oak-slat:{j}',(x+math.cos(a)*.86,-.69,z+math.sin(a)*.86),(.19,1.52,.09),lightwood,env,'BoothShell',-a,.015)
    box(f'sim:p1:pod:{n}:fabric-back',(x-.75,-.42,z),(.13,1.80,1.4),teal if n==0 else purple,env,'BoothBack',bevel=.10)
    cylinder(f'sim:p1:pod:{n}:table',(x+1.05,-.86,z+.10),.42,.06,ivory,env,'CafeTable',32)
    cylinder(f'sim:p1:pod:{n}:table-base',(x+1.05,-1.33,z+.10),.035,.90,chrome,env,'TableLeg',16)

# Named cameras reproduce exact existing position/target/fov; no camera mounts invented.
camera_records=[]


def camera(id, position, target, fov, reference=None, quaternion=None, near=.05):
    data=bpy.data.cameras.new(id)
    data.lens_unit='FOV'
    # PlayCanvas stores vertical fov; Blender defaults to horizontal fit.
    data.sensor_fit='VERTICAL'
    data.angle=math.radians(fov)
    data.clip_start=near
    data.clip_end=200
    obj=bpy.data.objects.new(id,data)
    cameras.objects.link(obj)
    obj.location=to_blender(position)
    if quaternion:
        from mathutils import Quaternion
        conversion=Quaternion((1,0,0),math.pi/2)
        x,y,z,w=quaternion
        obj.rotation_mode='QUATERNION'
        obj.rotation_quaternion=conversion @ Quaternion((w,x,y,z))
    else:
        direction=Vector(to_blender(target))-obj.location
        obj.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
    obj['stable_id']=id
    obj['source_position']=position
    obj['source_target']=target or []
    obj['source_fov_vertical']=fov
    obj['source_reference']=reference or 'authored inspection camera; not a physical device'
    camera_records.append({'id':id,'source_position':position,'source_target':target,'fov_vertical':fov,'reference':reference,'near':near,'quaternion_xyzw':quaternion})
    return obj


for a in annotations['annotations']:
    c=a['camera']['initial']
    camera('view:annotation:'+str(a['annotation_index']),c['position'],c['target'],c['fov'],a['source'])
for filename in ['survey-inventory-detail.json','survey-cd-seats.json','survey-plan-view.json']:
    for view in read(ROOT/'docs/evidence/phase09/survey'/filename)['views']:
        if view['id'] in ['wall-from-a','wall-from-b','table-c-seats','table-d-seats','original-plan-near-clipped']:
            c=view['camera']
            camera('view:'+view['id'],c['position'],None,c['fov'],f'docs/evidence/phase09/survey/{view["image"]}',c['rotation'],c.get('near_clip',.05))
camera('view:dollhouse',[17,20,4],[-1,-.7,-12],55)
camera('view:plan',[-1,31,-12],None,58,quaternion=[-.7071067811865476,0,0,.7071067811865476])

# Reference lighting only. Operable individual circuits are intentionally Phase 03.
world=bpy.data.worlds.new('Reference daylight')
world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.73,.81,1,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.30
scene.world=world
for n,z in enumerate([-1,-7,-13,-19,-25]):
    data=bpy.data.lights.new(f'reference:daylight:{n}','AREA')
    data.energy=450
    data.shape='RECTANGLE'
    data.size=4
    data.size_y=3
    obj=bpy.data.objects.new(data.name,data)
    illumination.objects.link(obj)
    obj.location=to_blender((4.0,.30,z))
    obj.rotation_euler=(Vector(to_blender((.0,-.7,z)))-obj.location).to_track_quat('-Z','Y').to_euler()
for n,z in enumerate([-2,-7,-12,-17,-22]):
    data=bpy.data.lights.new(f'reference:ceiling:{n}','AREA')
    data.energy=160
    data.size=3
    obj=bpy.data.objects.new(data.name,data)
    illumination.objects.link(obj)
    obj.location=to_blender((-.5,ceiling-.10,z))

scene.render.engine='CYCLES'
scene.cycles.samples=48
# This system Blender has Cycles CPU but was compiled without OpenImageDenoise.
scene.cycles.use_denoising=False
scene.cycles.device='CPU'
scene.render.threads_mode='FIXED'
scene.render.threads=4
scene.render.resolution_x=1200
scene.render.resolution_y=850
scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
scene.camera=bpy.data.objects['view:dollhouse']
# Default opens as a dollhouse; switch ceiling visibility for interior camera renders.
roof.hide_render=True
roof.hide_set(True)
for area in bpy.context.screen.areas if bpy.context.screen else []:
    if area.type=='VIEW_3D':
        area.spaces.active.region_3d.view_distance=31
        area.spaces.active.region_3d.view_location=Vector((-1,12,-.2))
        area.spaces.active.clip_end=200
        area.spaces.active.shading.type='MATERIAL'
readme=bpy.data.texts.new('READ ME - Phase 01 and source limitations')
readme.write('PHASE 01 RECONSTRUCTION - NOT EXACT RECOVERY\n'
             'Original argenzio scene CC BY-NC 4.0, https://superspl.at/scene/a972d838\n'
             'Relative units only. Existing source anchors and floor guide are hidden in 00 Source references.\n'
             'Enable ceiling for interiors. Named cameras preserve original poses.\n'
             'Objects have stable_id, semantic_type, environment_id, geometry_origin, source_position.\n'
             'A/B chair placements, shell, columns, furniture dimensions and booth count are visual estimates.\n'
             'No Core entities created. No source or previous app changed.\n'
             'Doors, new E, cafe, device controls, runtime and avatars belong to later phases.\n')
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT/'office-phase01.blend'),compress=True)
write(OUTPUT/'object-inventory.json',{'phase':'01','base_commit':scene['base_commit'],
      'units':'relative; meters unverified','coordinate_conversion':scene['coordinate_conversion'],
      'objects':catalog,'cameras':camera_records,'unlocated_source_ids':[r['id'] for r in source['inventory'] if r['position'] is None],
      'assumptions':layout,'source_sha256':{str(p.relative_to(ROOT)):sha256(p) for p in [HERE/'layout.json',HANDOFF/'SPACE-INVENTORY.json',HANDOFF/'ANNOTATIONS-MAP.json',HANDOFF/'WALKABLE-FLOOR.obj']}})
print('PHASE01_BUILT',json.dumps({'objects':len(catalog),'cameras':len(camera_records),'guide_vertices':len(verts),'guide_triangles':len(faces),'blend_bytes':(OUTPUT/'office-phase01.blend').stat().st_size}))
