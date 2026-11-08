"""Requested furniture/archviz revision, derived from Phase04 without overwriting it."""
import math,sys,json,random
from pathlib import Path
import bpy
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import ROOT,HERE,OUTPUT,HANDOFF,read,write,sha256,to_blender,to_source,protected_changes
from furnishings import Furnishings,material
from archviz_assets import AssetLibrary
import importlib.util
import archviz_environment as env

E=HANDOFF/'evidence/phase04-revision';E.mkdir(parents=True,exist_ok=True)
cfg=read(HERE/'revision-layout.json');source=OUTPUT/cfg['source_master'];h=sha256(source)
assert h==cfg['source_master_sha256'] and not protected_changes()
assert read(HANDOFF/'evidence/phase04/gate.json')['status']=='VERIFIED_INTERNALLY_PENDING_OPERATOR_APPROVAL'
bpy.ops.wm.open_mainfile(filepath=str(source));scene=bpy.context.scene;scene.frame_set(1)
scene['phase']='04 revision: professional furnishings and architectural visual review, pending operator acceptance'
scene['archviz_revision']=True
S=Furnishings('sim:r1:');A=AssetLibrary(S);M=bpy.data.materials
black=M['Graphite powder coat'];white=M['Warm white plaster']
wood=material('R1 oiled walnut micrograin',(.27,.12,.049),.35,texture='wood')
oak=material('R1 natural oak micrograin',(.47,.31,.16),.43,texture='wood')
bronze=material('R1 brushed champagne metal',(.42,.29,.14),.29,.78)
ceramic=material('R1 ceramic offwhite',(.72,.68,.59),.24)
porcelain=material('R1 sanitary porcelain',(.88,.89,.87),.14)
soil=material('R1 potting earth',(.025,.014,.008),.96)
linen=material('R1 woven linen sand',(.44,.36,.25),.87,texture='cloth')
sage=material('R1 sage textile',(.16,.25,.20),.81,texture='cloth')
terracotta=material('R1 terracotta textile',(.36,.14,.078),.82,texture='cloth')
stone=material('R1 honed stone',(.29,.28,.25),.37,texture='cloth')
removed=[]
def remove_prefix(prefixes):
    for o in list(bpy.data.objects):
        if o.name.startswith(prefixes):removed.append(o.name);bpy.data.objects.remove(o,do_unlink=True)
remove_prefix(('sim:p1:waiting:chair:','sim:cafe:table:', 'sim:p3:lounge:sofa:', 'sim:p3:lounge:armchair:', 'sim:p3:lounge:table', 'sim:p3:plant-pot:', 'sim:p3:plant:', 'sim:p1:green-wall:leaf:'))
floor_mat=material('R1 2K terrazzo PBR',(.5,.47,.4),.36)
nodes=floor_mat.node_tree.nodes;links=floor_mat.node_tree.links;p=nodes.get('Principled BSDF')
for suffix,target in [('basecolor','Base Color'),('roughness','Roughness'),('normal','Normal')]:
    tex=nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(OUTPUT/f'revision-assets/terrazzo-{suffix}.png'));tex.image.pack()
    if suffix!='basecolor':tex.image.colorspace_settings.name='Non-Color'
    if suffix=='normal':
        normal=nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.17;links.new(tex.outputs['Color'],normal.inputs['Color']);links.new(normal.outputs['Normal'],p.inputs[target])
    else:links.new(tex.outputs['Color'],p.inputs[target])
for o in bpy.data.objects:
    if o.type=='MESH':
        for slot in o.material_slots:
            if slot.material and slot.material.name=='Terrazzo warm - procedural reference':slot.material=floor_mat
# Softened manufactured edges, correct normals, restrained architectural material response.
for o in bpy.data.objects:
    if o.type=='MESH':
        for m in o.modifiers:
            if m.type=='BEVEL':m.segments=max(3,m.segments)
for m in list(M):
    if m.use_nodes and m.name in ['Phase02 clear partitions','Window glazing reference']:
        p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=.01;p.inputs['IOR'].default_value=1.52;p.inputs['Transmission Weight'].default_value=1
        p.inputs['Alpha'].default_value=1;p.inputs['Metallic'].default_value=0;p.inputs['Specular IOR Level'].default_value=.55;p.inputs['Coat Weight'].default_value=.10;p.inputs['Coat Roughness'].default_value=.01
        p.inputs['Base Color'].default_value=(.97,.99,.985,1)
        absorption=m.node_tree.nodes.new('ShaderNodeVolumeAbsorption');absorption.inputs['Color'].default_value=(.80,.95,.86,1);absorption.inputs['Density'].default_value=.12
        out=next(n for n in m.node_tree.nodes if n.type=='OUTPUT_MATERIAL');m.node_tree.links.new(absorption.outputs[0],out.inputs['Volume'])
paint=M['Warm white plaster'];nodes=paint.node_tree.nodes;links=paint.node_tree.links
noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=165;noise.inputs['Detail'].default_value=2
bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.08;bump.inputs['Distance'].default_value=.002
links.new(noise.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],nodes.get('Principled BSDF').inputs['Normal'])
# Flat glass is still bounded by existing panes. Give actual surface thickness for reflections/refraction.
for o in bpy.data.objects:
    if o.get('semantic_type') in ['Partition','Window'] and o.type=='MESH':
        if any(m and m.name in ['Phase02 clear partitions','Window glazing reference'] for m in o.data.materials):
            o['glass_finish']='dielectric IOR 1.52, roughness .01, Fresnel reflection plus clear transmission, alpha1; independent solid pane'
# Replace the actual white visitor-chair group; do not delete office chairs or source anchors.
for r in cfg['waiting_sofas']:
    x,z=r['center'];A.place('SheenWoodLeatherSofa',r['id'],x,z,'WAITING-AREA',width=r['width'],yaw=-math.pi/2)
# Add professional lounge sofas with stitching, UVs, wood/leather frame and velvet sheen.
A.place('GlamVelvetSofa','lounge:sofa:main',-10.2,-4.95,'sim:LOUNGE',width=2.65)
A.place('GlamVelvetSofa','lounge:sofa:side',-7.15,-3.8,'sim:LOUNGE',width=2.05,yaw=math.pi/2)
A.place('SheenChair','lounge:chair',-8.65,-1.55,'sim:LOUNGE',width=.75,yaw=math.pi/2)
# Three four-seat dining tables plus a two-seat bistro table. Existing bar stools remain.
for r in cfg['dining']:
    x,z=r['center'];id=r['id'];zone='sim:RECREATION' if r['chairs']==4 else 'sim:CAFE-01'
    S.table(id,x,z,r['radius'],oak,black,zone)
    for j in range(r['chairs']):
        a=j*math.tau/r['chairs'];radius=.9 if r['chairs']==4 else .76
        cx=x+math.cos(a)*radius;cz=z+math.sin(a)*radius
        A.place('SheenChair',id+':chair:'+str(j),cx,cz,zone,width=.51,height=.90,depth=.51,yaw=math.atan2(math.cos(a),-math.sin(a)),kind='Chair')
    # Place settings and small flowers: separate physical surfaces rather than baked scene detail.
    for j in range(2):
        px=x+(-.22 if j==0 else .22)
        S.cylinder(id+':saucer:'+str(j),(px,-.717,z),.09,.014,ceramic,'Tableware',zone)
        S.lathe(id+':cup:'+str(j),(px,-.71,z),[(0,0),(.048,0),(.058,.095),(.049,.095),(.042,.012),(0,.012)],ceramic,'Tableware',zone)
        S.line(id+':cuphandle:'+str(j),[(px+.05,-.69,z),(px+.092,-.66,z),(px+.052,-.63,z)],.009,ceramic,'Tableware',zone)
    S.lathe(id+':vase',(x,-.705,z+.18),[(0,0),(.048,0),(.06,.10),(.022,.18),(.018,.18),(.03,.02),(0,.02)],bronze,'Decoration',zone)
# Layered lounge: rug, two coffee tables, side table, ottoman, books, ceramic objects and framed art.
rugmat=material('R1 woven rug mapped PBR',(.5,.46,.4),.92)
nodes=rugmat.node_tree.nodes;links=rugmat.node_tree.links;p=nodes.get('Principled BSDF');p.inputs['Sheen Weight'].default_value=.3
for suffix in ['basecolor','normal']:
    tex=nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(OUTPUT/f'revision-assets/rug-{suffix}.png'));tex.image.pack()
    if suffix=='normal':
        tex.image.colorspace_settings.name='Non-Color';normal=nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.45;links.new(tex.outputs['Color'],normal.inputs['Color']);links.new(normal.outputs['Normal'],p.inputs['Normal'])
    else:links.new(tex.outputs['Color'],p.inputs['Base Color'])
rug=S.box('lounge:rug',(-9.5,-1.535,-3.55),(3.55,.018,3.20),rugmat,'Rug','sim:LOUNGE',.015);uv=rug.data.uv_layers.new(name='RugUV')
for loop in rug.data.loops:
    v=rug.data.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(v.x/3.55+.5,v.y/3.20+.5)
for i,(x,z,r,ht) in enumerate([(-10.15,-3.4,.58,.39),(-9.45,-3.15,.38,.48),(-7.7,-5.13,.27,.55)]):
    S.table('lounge:table:'+str(i),x,z,r,wood,bronze,'sim:LOUNGE',height=ht)
    # coffee/side tables are distinct from counted dining tables
    bpy.data.objects['sim:r1:lounge:table:'+str(i)+':top']['semantic_type']='SideTable'
A.place('SpecularSilkPouf','lounge:ottoman',-9.05,-2.15,'sim:LOUNGE',width=.62,kind='Ottoman')
A.place('GlassVaseFlowers','lounge:flowers',-10.15,-3.4,'sim:LOUNGE',height=.34,floor=-1.11,kind='Decoration')
for i,(x,z) in enumerate([(-10.2,-3.4),(-9.48,-3.16)]):
    for j in range(2):
        o=S.box(f'lounge:book:{i}:{j}',(x,-1.12+i*.09+j*.045,z),(.25,.042,.32),terracotta if j else white,'Book','sim:LOUNGE',.003);o.rotation_euler.z=.08+j*.13
S.lathe('lounge:ceramic',(-9.55,-1.02,-3.3),[(0,0),(.07,0),(.11,.09),(.065,.17),(.058,.17),(.03,.02),(0,.02)],ceramic,'Decoration','sim:LOUNGE')
for i in range(27):S.box('lounge:slat:'+str(i),(-11.65+i*.115,.15,-5.69),(.05,2.5,.035),oak,'WallDetail','sim:LOUNGE',.004)
art=material('R1 framed original artwork',(.7,.6,.4),.7)
tex=art.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(OUTPUT/'revision-assets/lounge-art.png'));tex.image.pack()
art.node_tree.links.new(tex.outputs['Color'],art.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
S.box('lounge:artframe',(-10.2,.35,-5.63),(1.78,1.16,.05),bronze,'Decoration','sim:LOUNGE')
canvas=S.box('lounge:art',(-10.2,.35,-5.595),(1.68,1.06,.012),art,'Decoration','sim:LOUNGE',0)
uv=canvas.data.uv_layers.new(name='ArtUV')
for loop in canvas.data.loops:
    v=canvas.data.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(v.x/1.68+.5,v.z/1.06+.5)
# Real model foliage with mapped leaves, petioles, pot and substrate; no green reference balls.
for i,(x,z,ht,zone) in enumerate([(-8.30,-5.15,1.35,'sim:LOUNGE'),(-11.4,-1.1,1.25,'sim:LOUNGE'),(-6.02,-13.9,1.05,'WAITING-AREA'),(-6.03,-18.25,.8,'WAITING-AREA')]):
    A.place('DiffuseTransmissionPlant','plant:'+str(i),x,z,zone,height=ht,kind='Planter')
    A.place('DiffuseTransmissionPlant','plant:'+str(i)+':canopy',x,z,zone,height=ht*.78,yaw=1.7,kind='Vegetation',parts=['leaves'])
# Professional plant on reception counter, subordinate to the clear visitor aisle.
A.place('DiffuseTransmissionPlant','reception:counterplant',-3.65,-15.35,'RECEPTION',height=.35,floor=-.465,kind='Decoration')
# Replace the spherical green-wall approximation with the professional plant's actual mapped foliage.
substrate=material('R1 living wall organic substrate',(.025,.08,.027),.94)
nodes=substrate.node_tree.nodes;links=substrate.node_tree.links
noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=45;noise.inputs['Detail'].default_value=4
ramp=nodes.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].color=(.009,.035,.012,1);ramp.color_ramp.elements[1].color=(.065,.17,.035,1)
links.new(noise.outputs['Fac'],ramp.inputs[0]);links.new(ramp.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])
bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.5;bump.inputs['Distance'].default_value=.018;links.new(noise.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],nodes.get('Principled BSDF').inputs['Normal'])
backing=bpy.data.objects['sim:p1:green-wall:backing'];backing.data.materials.clear();backing.data.materials.append(substrate)
rng=random.Random(20261108)
for row in range(31):
    for col in range(70):
        A.place('DiffuseTransmissionPlant',f'greenwall:{row}:{col}',-3.99+col*.114+rng.uniform(-.018,.018),2.18+rng.uniform(-.035,.035),'MEETING-AREA-01',height=rng.uniform(.20,.25),floor=-1.70+row*.10+rng.uniform(-.012,.012),yaw=rng.uniform(0,math.tau),kind='Vegetation',parts=['leaves'],geometry_variant='wall-fine')
# Larger meeting screen on the east partition, independent of all previous screens.
tv=cfg['meeting_tv'];x,y,z=tv['center'];zone=tv['environment_id']
S.box('meeting:TV:backing',(4.045,.2,0),(.025,1.72,2.8),wood,'WallDetail',zone)
body=S.box('meeting:TV:body',(x,y,z),(.08,tv['height'],tv['width']),black,'TV',zone,.016)
screenmat=material('R1 meeting TV screen',(.03,.06,.08),.22)
p=screenmat.node_tree.nodes.get('Principled BSDF');p.inputs['Emission Strength'].default_value=.7
tex=screenmat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(OUTPUT/'revision-assets/meeting-screen.png'));tex.image.pack()
screenmat.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color']);screenmat.node_tree.links.new(tex.outputs['Color'],p.inputs['Emission Color'])
screen=S.box('meeting:TV:screen',(x-.046,y,z),(.009,tv['height']-.075,tv['width']-.075),screenmat,'TVScreen',zone,.003)
uv=screen.data.uv_layers.new(name='ScreenUV')
for loop in screen.data.loops:
    v=screen.data.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(.5-v.y/(tv['width']-.075),v.z/(tv['height']-.075)+.5)
screen['content_state']='meeting-reference-12h';screen['content_material']=screenmat.name
S.box('meeting:soundbar',(3.925,-.54,0),(.07,.09,.95),black,'AVEquipment',zone)
# Constructive glazing details: clamps/handles at the existing doors, never modifying pivots/colliders.
base=read(OUTPUT/'device-manifest.json')
for d in base['luminaires']:
    if d['emitter_id'].startswith('sim:p4:lens:'):
        fixture=bpy.data.objects[d['fixture_id']];emitter=bpy.data.objects[d['emitter_id']]
        bottom=min((fixture.matrix_world@Vector(v)).z for v in fixture.bound_box)
        delta=bottom-.006-emitter.matrix_world.translation.z
        if delta<-.001:
            for v in emitter.data.vertices:v.co.z+=delta
            emitter.data.update()
for d in base['doors']:
    if d['environment_id']=='sim:LOCKERS':continue
    leaf=bpy.data.objects[d['leaf_id']]
    # A small local handle inherits the leaf pose; no second hinge/controller.
    o=S.box('doorhandle:'+d['id'],(0,0,0),(.028,.29,.035),bronze,'DoorHardware',d['environment_id'])
    o.parent=leaf;o.location=(leaf.dimensions.x/2-.12,-.045,0) if leaf.dimensions.x>leaf.dimensions.y else (-.045,leaf.dimensions.y/2-.12,0)
    o['attached_to']=leaf.name
# Bathroom is now modeled, not merely an unlabeled enclosure. All cameras stay outside.
zone='sim:WC'
S.box('WC:signback',(-7.25,1.0,.235),(.72,.25,.025),black,'Signage',zone)
S.text('WC:sign','BAÑO / WC',(-7.25,1.0,.217),.105,white,zone)
S.text('WC:direction','BAÑO  →',(-6.0,.6,.235),.10,black,zone)
# Tile floor and skirting inside the same opaque footprint.
tile=material('R1 limestone bathroom',(.51,.49,.43),.43,texture='cloth')
S.box('WC:floor',(-6.55,-1.54,1.40),(2.58,.016,2.08),tile,'FloorFinish',zone,.002)
for i in range(5):S.box('WC:tilejoint:'+str(i),(-7.75+i*.55,-1.529,1.40),(.006,.002,2.03),stone,'FloorDetail',zone,0)
# Ceramic toilet with pedestal, rounded bowl, seat opening and concealed cistern.
S.ellipsoid('WC:toilet:pedestal',(-5.95,-1.28,1.85),(.34,.48,.42),porcelain,'SanitaryFixture',zone)
S.ellipsoid('WC:toilet:bowl',(-5.95,-1.12,1.72),(.43,.34,.61),porcelain,'SanitaryFixture',zone)
S.lathe('WC:toilet:seat',(-5.95,-.955,1.69),[(.12,0),(.22,0),(.23,.025),(.21,.045),(.125,.045),(.12,0)],porcelain,'SanitaryFixture',zone)
S.box('WC:toilet:cistern',(-5.95,-.89,2.18),(.46,.78,.17),porcelain,'SanitaryFixture',zone,.055)
S.cylinder('WC:toilet:flush',(-5.95,-.487,2.18),.027,.012,bronze,'SanitaryFixture',zone)
# Basin/vanity on the far left, clear of the full door sweep.
S.box('WC:vanity',(-7.50,-1.13,1.98),(.48,.63,.62),wood,'Storage',zone)
S.lathe('WC:basin',(-7.50,-.77,1.98),[(0,-.03),(.19,-.03),(.23,.06),(.23,.09),(.21,.09),(.16,.012),(0,.012)],porcelain,'SanitaryFixture',zone)
S.line('WC:tap',[(-7.60,-.72,2.18),(-7.60,-.42,2.18),(-7.50,-.42,2.10),(-7.50,-.49,2.06)],.014,bronze,'SanitaryFixture',zone)
mirror=material('R1 mirror silver',(.91,.93,.94),.025,1)
S.box('WC:mirror',(-7.50,.05,2.419),(.58,.80,.012),mirror,'SanitaryFixture',zone,.025)
S.box('WC:towel',(-7.85,-.35,1.7),(.026,.32,.22),linen,'SanitaryFixture',zone)
S.lathe('WC:soap',(-7.30,-.77,2.13),[(0,0),(.035,0),(.035,.12),(0,.12)],ceramic,'SanitaryFixture',zone)
# Phone booths retain their geometry and doors. Clear signage and fine acoustic wall battens.
for i,x0 in enumerate([-11.8,-9.8],1):
    zone=f'sim:CALL-0{i}'
    S.box(f'call:{i}:signback',(x0+.76,1.3,-.15),(1.25,.22,.025),black,'Signage',zone)
    S.text(f'call:{i}:sign',f'CABINA 0{i}',(x0+.76,1.3,-.17),.12,white,zone)
    for j in range(10):S.box(f'call:{i}:slat:{j}',(x0+.16+j*.125,.05,2.15),(.04,1.95,.025),oak,'AcousticFinish',zone,.003)
    S.box(f'call:{i}:cushion',(x0+.75,-.91,1.0),(.45,.09,.45),sage,'Cushion',zone,.035)
    S.box(f'call:{i}:phonebase',(x0+.75,-.64,1.70),(.23,.045,.17),black,'CommunicationTerminal',zone,.016)
    S.line(f'call:{i}:handset',[(x0+.65,-.59,1.69),(x0+.75,-.56,1.69),(x0+.85,-.59,1.69)],.026,black,'CommunicationTerminal',zone)
# Existing sources plus three controllable decorative lamps, sharing existing circuits.
new_lights=[]
def lamp(id,x,z,ht,zone,floor=-1.55,power=40):
    S.cylinder(id+':base',(x,floor+.025,z),.16,.045,black,'Luminaire',zone)
    S.cylinder(id+':stem',(x,floor+ht/2,z),.012,ht,bronze,'Luminaire',zone)
    S.lathe(id+':shade',(x,floor+ht,z),[(.13,-.10),(.23,.10),(.23,.12),(.13,-.08)],black,'Luminaire',zone)
    em=material('R1 emitter '+id,(1,.79,.54),.4);p=em.node_tree.nodes.get('Principled BSDF');p.inputs['Emission Color'].default_value=(1,.74,.45,1);p.inputs['Emission Strength'].default_value=4
    lens=S.cylinder(id+':lens',(x,floor+ht-.10,z),.12,.008,em,'LuminaireEmitter',zone)
    data=bpy.data.lights.new(id,'AREA');data.energy=power;data.size=.25;data.color=(1,.79,.54)
    o=bpy.data.objects.new(id,data);scene.collection.objects.link(o);o.location=to_blender((x,floor+ht-.12,z));S.reg(o,id+':light','LuminaireLight',zone)
    for k,v in {'controlled_luminaire':True,'nominal_power':power,'on':True,'level':1.0,'mode':'auto','nominal_temperature_kelvin':3000,'emitter_material':em.name}.items():o[k]=v
    new_lights.append({'id':o.name,'type':'luminaire','environment_id':zone,'fixture_id':S.prefix+id+':shade','emitter_id':lens.name,'nominal_power_blender':power,'nominal_temperature_kelvin':3000,'color_rgb':list(data.color),'dimmable':True,'initial_state':{'on':True,'level':1,'mode':'auto'},'light_type':'AREA','physical_device_confirmed':False})
lamp('lounge:floorlamp',-11.52,-4.15,1.6,'sim:LOUNGE',power=65)
lamp('lounge:tablelamp',-7.7,-5.13,.47,'sim:LOUNGE',floor=-.97,power=25)
lamp('waiting:lamp',-5.9,-16.15,1.55,'WAITING-AREA',power=40)
# Architectural indirect light: mutable cove circuit, rather than permanent emissive decoration.
lamp('lounge:uplight',-8.25,-5.47,.12,'sim:LOUNGE',power=50)
bpy.data.objects['sim:r1:lounge:uplight:light'].rotation_euler.x=math.pi
def cove(id,zone,p,length,along_z=False,flip=False,wash=False):
    x,y,z=p;toe='toe-light' in id
    dims=(.025,.025,length) if toe else ((.18,.045,length) if along_z else (length,.045,.18))
    S.box(id+':channel',p,dims,white,'Luminaire',zone,.003)
    if not toe:
        edge_p=(x+.095,y+.035,z) if along_z else (x,y+.035,z+(-.095 if flip else .095))
        edge_size=(.025,.12,length) if along_z else (length,.12,.025)
        S.box(id+':fascia',edge_p,edge_size,white,'CeilingDetail',zone,.003)
    em=material('R1 emitter '+id,(1,.82,.6),.5);pbr=em.node_tree.nodes.get('Principled BSDF');pbr.inputs['Emission Color'].default_value=(1,.82,.6,1);pbr.inputs['Emission Strength'].default_value=4
    lens_dims=(.018,.008,length) if along_z else (length,.008,.018)
    lens=S.box(id+':emitter',(x,y+.034,z),lens_dims,em,'LuminaireEmitter',zone,.002)
    data=bpy.data.lights.new(id,'AREA');data.shape='RECTANGLE';data.size=length;data.size_y=.08;data.color=(1,.82,.64)
    o=bpy.data.objects.new(id,data);scene.collection.objects.link(o);o.location=to_blender((x,y+.06,z));o.rotation_euler.x=0 if wash else math.pi
    if along_z:o.rotation_euler.z=math.pi/2
    S.reg(o,id+':light','LuminaireLight',zone)
    for k,v in {'controlled_luminaire':True,'nominal_power':110,'on':True,'level':1.0,'mode':'auto','nominal_temperature_kelvin':3500,'emitter_material':em.name}.items():o[k]=v
    new_lights.append({'id':o.name,'type':'luminaire','environment_id':zone,'fixture_id':S.prefix+id+':channel','emitter_id':lens.name,'nominal_power_blender':110,'nominal_temperature_kelvin':3500,'color_rgb':list(data.color),'dimmable':True,'initial_state':{'on':True,'level':1,'mode':'auto'},'light_type':'AREA','physical_device_confirmed':False})
cove('lounge:cove:back','sim:LOUNGE',(-9.225,1.49,-5.65),5.35)
cove('lounge:cove:side','sim:LOUNGE',(-11.89,1.49,-2.95),5.22,True)
cove('waiting:cove','WAITING-AREA',(-6.37,1.49,-16.0),4.0,True)
cove('dining:cove','sim:RECREATION',(-6.20,1.49,-22.45),6.3,True)
cove('meeting:greenwall:cove','MEETING-AREA-01',(-.05,1.49,2.16),7.9,flip=True,wash=True)
# Refine finishes within the same reception counter footprint.
reception=bpy.data.objects['sim:p2:reception-counter']
for vertex in reception.data.vertices:
    if vertex.co.z<0:vertex.co.z+=.09
reception.data.update()
S.box('reception:stone-top',(-3.65,-.465,-16.1),(.79,.085,2.22),stone,'CounterFinish','RECEPTION',.012)
for i in range(16):S.box('reception:slat:'+str(i),(-3.308,-1.0,-17.0+i*.12),(.018,.82,.035),oak,'WallDetail','RECEPTION',.004)
cove('reception:toe-light','RECEPTION',(-3.32,-1.48,-16.1),1.9,True)
S.text('reception:brand','ENTITY',(-3.286,-.87,-16.1),.11,bronze,'RECEPTION',normal=(1,0,0))
# Warm vertical corner reveal, paired with the concealed wall/ceiling profiles.
S.box('lounge:vertical:channel',(-11.94,.02,-5.47),(.035,2.95,.06),wood,'Luminaire','sim:LOUNGE',.004)
em=material('R1 vertical LED emitter',(1,.48,.18),.5);pbr=em.node_tree.nodes.get('Principled BSDF');pbr.inputs['Emission Color'].default_value=(1,.48,.18,1)
lens=S.box('lounge:vertical:emitter',(-11.915,.02,-5.47),(.006,2.86,.014),em,'LuminaireEmitter','sim:LOUNGE',.002)
data=bpy.data.lights.new('warm corner wall wash','AREA');data.shape='RECTANGLE';data.size=2.86;data.size_y=.045
light=bpy.data.objects.new('warm corner wall wash',data);scene.collection.objects.link(light);light.location=to_blender((-11.90,.02,-5.47));light.rotation_euler.y=-math.pi/2
S.reg(light,'lounge:vertical:light','LuminaireLight','sim:LOUNGE')
for k,v in {'controlled_luminaire':True,'nominal_power':60,'on':True,'level':1.0,'mode':'auto','nominal_temperature_kelvin':2700,'emitter_material':em.name}.items():light[k]=v
new_lights.append({'id':light.name,'type':'luminaire','environment_id':'sim:LOUNGE','fixture_id':'sim:r1:lounge:vertical:channel','emitter_id':lens.name,'nominal_power_blender':60,'nominal_temperature_kelvin':2700,'color_rgb':[1,.48,.18],'dimmable':True,'initial_state':{'on':True,'level':1,'mode':'auto'},'light_type':'AREA','physical_device_confirmed':False})
# Reuse the imported high-resolution wood map family on contemporary tables/cladding.
professional_wood=next((m for m in M if m.name.startswith('wood Brown')),None)
if professional_wood:
    finish=professional_wood.copy();finish.name='R1 oak from professional wood PBR, recolored'
    for o in bpy.data.objects:
        if o.type=='MESH' and any(m and m.name in ['Cafe warm oak'] for m in o.data.materials):
            for slot in o.material_slots:
                if slot.material and slot.material.name=='Cafe warm oak':slot.material=finish
            uv=o.data.uv_layers.new(name='ArchitecturalWoodUV');uv.active_render=True
            for loop in o.data.loops:
                v=o.matrix_world@o.data.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(v.x*.3+v.y*.15,v.z*.3+v.y*.3)
# Replace test bars with intentional independent reference graphics, preserving screen IDs.
for i,tv0 in enumerate(base['televisions'],1):
    o=bpy.data.objects[tv0['screen_id']];m=o.data.materials[0].copy();m.name='R1 branded screen '+str(i);o.data.materials[0]=m
    for node in m.node_tree.nodes:
        if node.type=='TEX_IMAGE':node.image=bpy.data.images.load(str(OUTPUT/f'revision-assets/screen-{i}.png'));node.image.pack()
    o['content_state']='archviz-reference-'+str(i);tv0['material']=m.name;tv0['state']=o['content_state']
# Adapt the imported velvet palette while preserving its UV/normal/roughness/sheen detail.
for m in M:
    if m.name.startswith('fabric Mystere Mango Velvet'):
        for node in m.node_tree.nodes:
            if node.type=='MIX' and node.data_type=='RGBA':
                for socket in node.inputs:
                    if socket.name in ['A','B'] and socket.type=='RGBA' and not socket.is_linked:
                        color=socket.default_value
                        if color[0]>.8 and color[1]<.1:socket.default_value=(.19,.23,.16,1)
        pbr=m.node_tree.nodes.get('Principled BSDF')
        if pbr:pbr.inputs['Sheen Tint'].default_value=(.46,.50,.33,1)
# Photographic woven upholstery from the attributed professional asset, rather than flat base color.
def image_upstream(socket,seen=None):
    seen=set() if seen is None else seen
    for link in socket.links:
        node=link.from_node
        if node in seen:continue
        seen.add(node)
        if node.type=='TEX_IMAGE' and node.image:return node.image
        for inp in node.inputs:
            result=image_upstream(inp,seen)
            if result:return result
fabric_source=M['Frame_Fabric'].node_tree.nodes.get('Principled BSDF')
cloth=material('R1 professional woven linen PBR',(.4,.35,.27),.85)
nodes=cloth.node_tree.nodes;links=cloth.node_tree.links;pbr=nodes.get('Principled BSDF');pbr.inputs['Sheen Weight'].default_value=.25
coords=nodes.new('ShaderNodeTexCoord');mapping=nodes.new('ShaderNodeMapping');mapping.inputs['Scale'].default_value=(3,2,1);links.new(coords.outputs['UV'],mapping.inputs['Vector'])
color=nodes.new('ShaderNodeTexImage');color.image=image_upstream(fabric_source.inputs['Base Color']);links.new(mapping.outputs['Vector'],color.inputs['Vector'])
gray=nodes.new('ShaderNodeRGBToBW');links.new(color.outputs['Color'],gray.inputs[0])
ramp=nodes.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=.05;ramp.color_ramp.elements[0].color=(.23,.21,.17,1);ramp.color_ramp.elements[1].position=.45;ramp.color_ramp.elements[1].color=(.50,.46,.37,1)
links.new(gray.outputs[0],ramp.inputs[0]);links.new(ramp.outputs['Color'],pbr.inputs['Base Color'])
normal=nodes.new('ShaderNodeTexImage');normal.image=image_upstream(fabric_source.inputs['Normal']);links.new(mapping.outputs['Vector'],normal.inputs['Vector'])
nmap=nodes.new('ShaderNodeNormalMap');nmap.inputs['Strength'].default_value=.65;links.new(normal.outputs['Color'],nmap.inputs['Color']);links.new(nmap.outputs['Normal'],pbr.inputs['Normal'])
# Bake only recolored diffuse albedo on an isolated UV plane; preserve mutable lighting and normal map.
baked=bpy.data.images.new('R1 linen albedo',width=1024,height=1024);target=nodes.new('ShaderNodeTexImage');target.image=baked;nodes.active=target
bpy.ops.object.select_all(action='DESELECT');bpy.ops.mesh.primitive_plane_add(size=2);plane=bpy.context.object;plane.data.materials.append(cloth)
scene.cycles.samples=1;scene.render.bake.use_pass_color=True;scene.render.bake.use_pass_direct=False;scene.render.bake.use_pass_indirect=False
bpy.ops.object.bake(type='DIFFUSE');baked.filepath_raw=str(OUTPUT/'revision-assets/sofa-linen-albedo.png');baked.file_format='PNG';baked.save();baked.pack();bpy.data.objects.remove(plane,do_unlink=True)
links.new(target.outputs['Color'],pbr.inputs['Base Color'])
for o in bpy.data.objects:
    if o.get('asset_name')=='GlamVelvetSofa':
        for slot in o.material_slots:
            if slot.material and 'fabric' in slot.material.name.lower():slot.material=cloth
spec=importlib.util.spec_from_file_location('refine_workstations',HERE/'refine-workstations.py');office=importlib.util.module_from_spec(spec);spec.loader.exec_module(office)
workstation_revision=office.refine(S,A)
removed.extend(workstation_revision['removed_vine_references'])
new_lights.extend(workstation_revision['pendant_lights'])
# Thin mapped foliage transmits some light instead of behaving like opaque plastic.
for mat in M:
    if mat.name=='leaves':
        nodes=mat.node_tree.nodes;links=mat.node_tree.links;pbr=nodes.get('Principled BSDF');out=next((n for n in nodes if n.type=='OUTPUT_MATERIAL'),None)
        if pbr and out:
            color_source=pbr.inputs['Base Color'].links[0].from_socket if pbr.inputs['Base Color'].links else None
            tint=nodes.new('ShaderNodeMixRGB');tint.name='R1 leaf green tint';tint.blend_type='MULTIPLY';tint.inputs[0].default_value=1;tint.inputs[2].default_value=(.35,.95,.35,1)
            if color_source:links.new(color_source,tint.inputs[1])
            links.new(tint.outputs[0],pbr.inputs['Base Color'])
            thin=nodes.new('ShaderNodeBsdfTranslucent')
            links.new(tint.outputs[0],thin.inputs['Color'])
            # Preserve the source alpha mask for the translucent lobe as well as the Principled lobe.
            transparent=nodes.new('ShaderNodeBsdfTransparent');masked=nodes.new('ShaderNodeMixShader')
            alpha=pbr.inputs['Alpha'];masked.inputs[0].default_value=alpha.default_value
            if alpha.links:links.new(alpha.links[0].from_socket,masked.inputs[0])
            links.new(transparent.outputs[0],masked.inputs[1]);links.new(thin.outputs[0],masked.inputs[2])
            mix=nodes.new('ShaderNodeMixShader');mix.inputs[0].default_value=.10;links.new(pbr.outputs['BSDF'],mix.inputs[1]);links.new(masked.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],out.inputs['Surface'])
# Three shared mesh/material variants create natural green variation without thousands of unique meshes.
variants={};greens=[(.20,.65,.18,1),(.40,1.0,.30,1),(.24,.78,.40,1)]
for o in bpy.data.objects:
    if o.name.startswith('sim:r1:greenwall:') and o.type=='MESH':
        row,col=map(int,o.name.split(':')[3:5]);index=((row*73856093)^(col*19349663))%3;key=(o.data.as_pointer(),index)
        if key not in variants:
            mesh=o.data.copy()
            for i,mat in enumerate(mesh.materials):
                if mat and 'R1 leaf green tint' in mat.node_tree.nodes:
                    m=mat.copy();m.name='R1 living wall green '+str(index);m.node_tree.nodes['R1 leaf green tint'].inputs[2].default_value=greens[index];mesh.materials[i]=m
            variants[key]=mesh
        o.data=variants[key]
# Neutral pouf finish, retaining the professional model's stitched seams and anisotropic fabric.
for mat in M:
    if mat.name.startswith('shot silk'):
        pbr=mat.node_tree.nodes.get('Principled BSDF')
        if pbr:pbr.inputs['Base Color'].default_value=(.12,.15,.105,1);pbr.inputs['Specular Tint'].default_value=(.62,.66,.5,1)
for o in bpy.data.objects:
    if o.get('asset_name')=='DiffuseTransmissionPlant' and o.get('asset_source_part','').lower().startswith('pot'):
        for i,old in enumerate(o.data.materials):
            # Copy the mesh so only pot instances use the neutral finish; leaf/soil maps stay intact.
            o.data=o.data.copy();m=old.copy();m.name='R1 concrete planter finish'
            pbr=m.node_tree.nodes.get('Principled BSDF')
            if pbr:
                links=list(pbr.inputs['Base Color'].links)
                if links:
                    source_socket=links[0].from_socket;gray=m.node_tree.nodes.new('ShaderNodeRGBToBW');m.node_tree.links.new(source_socket,gray.inputs[0])
                    ramp=m.node_tree.nodes.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].color=(.30,.29,.26,1);ramp.color_ramp.elements[1].color=(.69,.67,.62,1)
                    m.node_tree.links.new(gray.outputs[0],ramp.inputs['Fac']);m.node_tree.links.new(ramp.outputs['Color'],pbr.inputs['Base Color'])
                pbr.inputs['Roughness'].default_value=.64
            o.data.materials[i]=m
# Physical sky and restrained neutral exterior context for credible glazing reflections.
sky=scene.world.node_tree.nodes.new('ShaderNodeTexSky');sky.name='Archviz daylight';sky.sky_type='NISHITA';sky.sun_disc=False;sky.air_density=1;sky.dust_density=.7;sky.ozone_density=1
scene.world.node_tree.links.new(sky.outputs['Color'],scene.world.node_tree.nodes['Background'].inputs['Color'])
nodes=scene.world.node_tree.nodes;links=scene.world.node_tree.links
hdri=nodes.new('ShaderNodeTexEnvironment');hdri.name='Generic CC0 city environment';hdri.image=bpy.data.images.load(str(HERE/'assets/archviz/potsdamer_platz_1k.hdr'));hdri.image.pack()
background=nodes.new('ShaderNodeBackground');background.name='Archviz context';background.inputs['Strength'].default_value=1
links.new(hdri.outputs['Color'],background.inputs['Color'])
paths=nodes.new('ShaderNodeLightPath');maxray=nodes.new('ShaderNodeMath');maxray.operation='MAXIMUM';links.new(paths.outputs['Is Glossy Ray'],maxray.inputs[0]);links.new(paths.outputs['Is Transmission Ray'],maxray.inputs[1])
camera=nodes.new('ShaderNodeMath');camera.operation='MAXIMUM';links.new(paths.outputs['Is Camera Ray'],camera.inputs[0]);links.new(maxray.outputs[0],camera.inputs[1])
show=nodes.new('ShaderNodeValue');show.name='Show photographic context';show.outputs[0].default_value=1
factor=nodes.new('ShaderNodeMath');factor.operation='MULTIPLY';links.new(camera.outputs[0],factor.inputs[0]);links.new(show.outputs[0],factor.inputs[1])
mix=nodes.new('ShaderNodeMixShader');links.new(factor.outputs[0],mix.inputs[0]);links.new(nodes['Background'].outputs['Background'],mix.inputs[1]);links.new(background.outputs['Background'],mix.inputs[2]);links.new(mix.outputs[0],nodes.get('World Output').inputs['Surface'])
scene['environment_context']='CC0 photographic Potsdamer Platz; generic lighting/reflection context, not this building location. No surveyed geography asserted.'
# Photographic inspection cameras, including clearly identifiable WC and phone booths.
views=[
 ('revision-general',[19,25,9],[-4,-.6,-12],49),
 ('revision-comedor',[-6.65,-.05,-18.55],[-4.65,-.65,-23],64),
 ('revision-cafe',[-4.05,-.05,-20.8],[-9.3,-.15,-21.5],65),
 ('revision-waiting',[-4.2,-.10,-13.8],[-5.65,-.75,-16.1],65),
 ('revision-lounge',[-7.05,-.05,-.8],[-9.85,-.55,-3.95],68),
 ('revision-lounge-detail',[-8.25,-.35,-2.05],[-10.2,-.65,-4.6],56),
 ('revision-meeting',[.15,-.15,-1.5],[3.9,.05,0],76),
 ('revision-services',[-6.6,.05,-2.6],[-7.4,-.15,.9],64),
 ('revision-WC',[-7.55,-.05,-1.7],[-6.65,-.55,1.65],65),
 ('revision-booths',[-10.15,.05,-2.25],[-10.1,-.25,1.3],74),
 ('revision-office',[-.6,-.15,-6.85],[1.25,-.25,-5.25],69),
 ('revision-reception',[-2.2,-.15,-13.8],[-4.4,-.4,-16.0],70),
 ('revision-computer-detail',[.3,-.3,-6.3],[.9,-.6,-5.5],48),
 ('revision-lighting-corner',[-9.15,-.05,-2.2],[-11.5,.5,-5.25],58),
 ('revision-corridor',[-2.2,-.05,.35],[-2.2,-.3,-15],60),
 ('revision-glass',[-2.3,-.1,-10.5],[1.8,.2,-5.1],62),
 ('revision-glass-detail',[-2.5,-.10,-7.0],[-1.45,-.05,-3.5],55),
 ('revision-vertical-garden',[-.05,.20,-2.8],[-.05,.0,2.2],65),
 ('revision-garden-detail',[-.3,-.2,.95],[.2,.0,2.2],55)]
for name,p,t,fov in views:
    data=bpy.data.cameras.new('view:'+name);data.sensor_fit='VERTICAL';data.angle=math.radians(fov);data.clip_end=200
    o=bpy.data.objects.new('view:'+name,data);scene.collection.objects.link(o);o.location=to_blender(p);o.rotation_euler=(Vector(to_blender(t))-o.location).to_track_quat('-Z','Y').to_euler()
    o['role']='static architectural inspection, not a surveillance device or Core entity'
    o['source_position']=p
A.cleanup()
for image in bpy.data.images:
    if image.source=='FILE' and image.has_data and not image.packed_file:image.pack()
for txt in bpy.data.texts:
    if txt.name.startswith('START ENTITY visual controls'):
        txt.clear();txt.write('import sys\nfrom pathlib import Path\nimport bpy\nsys.path.insert(0,str(Path(bpy.data.filepath).resolve().parents[1]))\nimport archviz_environment\narchviz_environment.register()\n')
for light in env.lights():
    role='accent' if any(token in light.name for token in [':cove',':toe-light',':vertical:',':accent:']) else ('decor' if light.name.startswith('sim:r1:') else 'task')
    palette=env.DESIGN[role];light['archviz_role']=role;light['nominal_temperature_kelvin']=palette['nominal_kelvin'];light.data.color=palette['design_rgb_linear']
    mat=M[light['emitter_material']];mat.node_tree.nodes.get('Principled BSDF').inputs['Emission Color'].default_value=(*palette['design_rgb_linear'],1)
env.set_hour(12);env.pause();scene.frame_set(1);scene.camera=bpy.data.objects['view:revision-general']
scene.cycles.samples=128;scene.cycles.use_adaptive_sampling=True;scene.cycles.adaptive_threshold=.025;scene.cycles.adaptive_min_samples=32;scene.cycles.use_denoising=False
scene.cycles.max_bounces=12;scene.cycles.diffuse_bounces=6;scene.cycles.glossy_bounces=8;scene.cycles.transmission_bounces=12
scene.cycles.transparent_max_bounces=12;scene.render.film_transparent=False
for o in bpy.data.objects:
    if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=o.get('environment_id')!='sim:WC'
bpy.context.view_layer.update()
for d in new_lights:
    o=bpy.data.objects[d['id']];d['transform_blender']=[list(row) for row in o.matrix_world];d['position_source']=list(to_source(o.matrix_world.translation))
manifest=json.loads(json.dumps(base));manifest['revision']='phase04-r1';manifest['source_master_sha256']=h
manifest['emitter_radiance_policy']='Per-role camera-visible radiance and daylight minimum in archviz-lighting.json. Independent of nominal Blender watts. Sources and emitters both reach zero on OFF.'
manifest['lighting_design']=env.DESIGN
manifest['glazing_design']={'IOR':1.52,'roughness':.01,'transmission':1,'alpha':1,'specular_IOR_level':.55,'metallic':0,'clear_coating_weight':.1,'edge_absorption_density_relative':.12,'reflection':'Fresnel reflection of actual modeled fixtures/furniture and generic CC0 environment; transparency preserved','architectural_materials':['Phase02 clear partitions','Window glazing reference']}
manifest['luminaires']+=new_lights
for d in manifest['luminaires']:
    light=bpy.data.objects[d['id']];d['nominal_temperature_kelvin']=light['nominal_temperature_kelvin'];d['color_rgb']=list(light.data.color);d['design_role']=light['archviz_role'];d['daylight_minimum']=env.DESIGN[light['archviz_role']]['daylight_minimum']
manifest['circuits']={zone:[d['id'] for d in manifest['luminaires'] if d['environment_id']==zone] for zone in base['circuits']}
manifest['televisions'].append({'id':body.name,'screen_id':screen.name,'environment_id':'MEETING-AREA-01','material':screenmat.name,'state':screen['content_state']})
manifest['input_hashes']={str(p.relative_to(ROOT)):sha256(p) for p in [HERE/n for n in ['build-revision.py','revision-layout.json','furnishings.py','archviz_assets.py','archviz_environment.py','archviz-lighting.json','environment.py','create-revision-assets.py','refine-workstations.py']]}
manifest['input_hashes'].update({str(p.relative_to(ROOT)):sha256(p) for p in (HERE/'assets/archviz').iterdir() if p.is_file()})
manifest['input_hashes'].update({str(p.relative_to(ROOT)):sha256(p) for p in (OUTPUT/'revision-assets').glob('*.png')})
scene['revision_manifest']='device-manifest-revision.json';scene['revision_semantic_override']=cfg['semantic_override']
bpy.context.preferences.filepaths.save_version=0;master=OUTPUT/cfg['output_master'];bpy.ops.wm.save_as_mainfile(filepath=str(master),compress=True)
manifest['master_sha256']=sha256(master);write(OUTPUT/'device-manifest-revision.json',manifest)
records=[]
for o in bpy.data.objects:
    records.append({'id':o.get('stable_id',o.name),'blender_name':o.name,'type':o.get('semantic_type',o.type),'environment_id':o.get('environment_id','render-reference'),'current_source_position':list(to_source(o.matrix_world.translation)),'world_matrix_blender':[list(row) for row in o.matrix_world],'materials':[m.name for m in o.data.materials] if o.type=='MESH' else [],'asset_name':o.get('asset_name'),'furniture_group':o.get('furniture_group'),'geometry_origin':o.get('geometry_origin')})
write(OUTPUT/'revision-full-inventory.json',{'master_sha256':sha256(master),'source_master_sha256':h,'frame':1,'records':records,'professional_instances':A.instances,'removed_reconstructed_objects':removed,'workstation_revision':workstation_revision,'configuration':cfg,'business_entities_created':False})
write(E/'build-summary.json',{'master_sha256':sha256(master),'source_master_sha256':h,'dining_tables':4,'dining_chairs':14,'bar_stools_retained':4,'white_visitor_chairs_removed':True,'new_objects':len(S.objects),'professional_instances':len(A.instances),'luminaires':len(manifest['luminaires']),'circuits':len(manifest['circuits']),'televisions':len(manifest['televisions']),'human_approval':False})
glazing=[]
for o in bpy.data.objects:
    if o.type!='MESH':continue
    for mat in o.data.materials:
        if mat and mat.name in manifest['glazing_design']['architectural_materials']:
            p=mat.node_tree.nodes.get('Principled BSDF')
            glazing.append({'id':o.get('stable_id',o.name),'type':o.get('semantic_type'),'environment_id':o.get('environment_id'),'material':mat.name,'IOR':p.inputs['IOR'].default_value,'roughness':p.inputs['Roughness'].default_value,'transmission':p.inputs['Transmission Weight'].default_value,'alpha':p.inputs['Alpha'].default_value,'minimum_dimension_relative':min(o.dimensions),'world_matrix_blender':[list(r) for r in o.matrix_world]})
write(E/'glazing-audit.json',{'master_sha256':sha256(master),'panes':glazing,'count':len(glazing),'note':'Architecture glass, including door leaves, transoms and cafe display. Opaque WC walls remain excluded. Values are design parameters, not measured glass specifications.'})
assert sha256(source)==h and not protected_changes()
print('REVISION_BUILT',len(S.objects),'objects;',len(A.instances),'professional asset instances;',len(manifest['luminaires']),'lights',flush=True)
