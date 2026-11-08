"""Refine existing seats/desks in place; calibration anchors, IDs and poses stay fixed."""
import math
import bpy
from mathutils import Vector
from common import OUTPUT,to_source,to_blender
from furnishings import material

def refine(S,A):
    M=bpy.data.materials
    mesh_fabric=material('R1 ergonomic woven mesh',(.34,.32,.28),.83,texture='cloth')
    dark=material('R1 desk pad leather',(.042,.045,.044),.65,texture='cloth')
    polymer=material('R1 warm polymer',(.64,.63,.58),.34)
    graphite=material('R1 graphite polymer',(.055,.058,.057),.35)
    aluminum=material('R1 satin anodized aluminum',(.51,.53,.54),.26,.72)
    work_env={'A','B','C','D','sim:ROOM-E','MEETING-AREA-01'}
    chairs=[o for o in bpy.data.objects if o.get('environment_id') in work_env and o.name.endswith(':back') and ':chair:' in o.name and o.type=='MESH']
    refined=[]
    for i,o in enumerate(chairs):
        # Preserve the object's original transform and approximate dimensions while sculpting the back.
        w=max(.25,o.dimensions.x);h=max(.35,o.dimensions.z)
        # object rotations are yaw-only; dimensions.x depends on yaw, so use mesh-local extents.
        xs=[v.co.x for v in o.data.vertices];zs=[v.co.z for v in o.data.vertices]
        w=max(xs)-min(xs);h=max(zs)-min(zs)
        vs=[];faces=[];cols=18;rows=22
        for row in range(rows+1):
            t=row/rows;zz=(t-.5)*h
            half=w/2*(.84+.16*math.sin(math.pi*t))
            for col in range(cols+1):
                u=col/cols*2-1
                vs.append((u*half,.018+.045*(u*u)+.026*math.sin(math.pi*t*1.4),zz))
        for row in range(rows):
            for col in range(cols):a=row*(cols+1)+col;faces.append((a,a+1,a+cols+2,a+cols+1))
        mesh=bpy.data.meshes.new('Ergonomic back sculpt');mesh.from_pydata(vs,[],faces);mesh.update()
        for p in mesh.polygons:p.use_smooth=True
        mesh.materials.append(mesh_fabric);o.data=mesh
        for mod in list(o.modifiers):o.modifiers.remove(mod)
        solid=o.modifiers.new('Mesh upholstery backing','SOLIDIFY');solid.thickness=.025
        # White structural rim at the same original back pose.
        path=[]
        for xx,zz in [(-w*.40,-h*.48),(-w*.49,-h*.2),(-w*.47,h*.36),(-w*.36,h*.49),(w*.36,h*.49),(w*.47,h*.36),(w*.49,-h*.2),(w*.40,-h*.48)]:
            p=o.matrix_world@Vector((xx,.075,zz));path.append(tuple(to_source(p)))
        rim=S.line('work:backrim:'+str(i),path,.018,polymer,'ChairFrame',o['environment_id'])
        # Keep source-calibrated seat centers intact; padded arms add physical depth.
        prefix=o.name.removesuffix(':back')
        for side in [-1,1]:
            arm=bpy.data.objects.get(prefix+':arm:'+str(side))
            if arm:
                pad=S.box(f'work:armpad:{i}:{side}',(0,0,0),(.06,.035,.32),graphite,'ChairDetail',o['environment_id'],.016)
                pad.parent=arm;pad.location=(0,0,.025)
        refined.append(o.name)
    # Use actual packed wallpaper and mapped panels on the existing independent screens.
    image=bpy.data.images.load(str(OUTPUT/'revision-assets/workstation-screen.png'));image.pack()
    screenmat=material('R1 workstation display',(.035,.05,.065),.22)
    nodes=screenmat.node_tree.nodes;links=screenmat.node_tree.links;p=nodes.get('Principled BSDF')
    tex=nodes.new('ShaderNodeTexImage');tex.image=image;links.new(tex.outputs['Color'],p.inputs['Base Color']);links.new(tex.outputs['Color'],p.inputs['Emission Color']);p.inputs['Emission Strength'].default_value=.08
    p.inputs['Coat Weight'].default_value=.65;p.inputs['Coat Roughness'].default_value=.035;p.inputs['IOR'].default_value=1.50
    def rounded_body(flip=1):
        ring=[]
        for cx,cz,start in [(.297,-.187,-math.pi/2),(.297,.187,0),(-.297,.187,math.pi/2),(-.297,-.187,math.pi)]:
            for j in range(6):
                a=start+j*math.pi/10;ring.append((cx+.013*math.cos(a),cz+.013*math.sin(a)))
        verts=[(x*flip,yy*flip,z) for yy in [-.023,.003] for x,z in ring];N=len(ring)
        faces=[tuple(range(N)),tuple(range(2*N-1,N-1,-1))]+[(i,(i+1)%N,(i+1)%N+N,i+N) for i in range(N)]
        mesh=bpy.data.meshes.new('Thin radiused display enclosure');mesh.from_pydata(verts,[],faces);mesh.materials.append(aluminum);mesh.update();return mesh
    bodies=[o for o in bpy.data.objects if o.get('semantic_type')=='Monitor']
    for i,body in enumerate(bodies):
        zone=body['environment_id'];is_E=zone=='sim:ROOM-E';source_z=to_source(body.matrix_world.translation)[2]
        E_z=to_source(bpy.data.objects['sim:p2:E:desktop'].matrix_world.translation)[2]
        flip=-1 if is_E and source_z<E_z else 1
        body.data=rounded_body(flip)
        for mod in list(body.modifiers):body.modifiers.remove(mod)
        bevel=body.modifiers.new('Machined enclosure radii','BEVEL');bevel.width=.002;bevel.segments=3
        # Camera lens, microphone slot and subtle rear connector details are real geometry.
        lens=S.cylinder('work:webcam:'+str(i),(0,0,0),.0035,.002,graphite,'MonitorDetail',zone)
        lens.parent=body;lens.location=(0,-.026*flip,.177);lens.rotation_euler.x=math.pi/2*flip
        slot=S.box('work:microphone:'+str(i),(0,0,0),(.019,.0015,.002),graphite,'MonitorDetail',zone,.0005)
        slot.parent=body;slot.location=(.016,-.026*flip,.177)
        if is_E:
            screen=S.box('work:E:screen:'+str(i),(0,0,0),(.58,.32,.003),screenmat,'MonitorScreen',zone,.003)
            screen.parent=body;screen.location=(0,-.027*flip,.01);screen.rotation_euler.z=0 if flip==1 else math.pi
            keyboard=S.box('work:E:keyboard:'+str(i),(0,0,0),(.38,.018,.12),aluminum,'Keyboard',zone,.006)
            keyboard.parent=body;keyboard.location=(0,-.43*flip,-.235);keyboard.rotation_euler.z=0 if flip==1 else math.pi
            stand=S.box('work:E:stand:'+str(i),(0,0,0),(.055,.17,.025),aluminum,'MonitorStand',zone,.008)
            stand.parent=body;stand.location=(0,.022*flip,-.15)
            base=S.box('work:E:foot:'+str(i),(0,0,0),(.25,.018,.17),aluminum,'MonitorStand',zone,.008)
            base.parent=body;base.location=(0,.03*flip,-.235)
    # Sculpt the existing independent stand, retaining its original transform.
    for stand in [o for o in bpy.data.objects if o.get('semantic_type')=='MonitorStand' and o.name.endswith(':stand')]:
        verts=[]
        for width,depth,h in [(.055,.045,-.07),(.036,.036,-.02),(.025,.018,.08),(.026,.010,.14)]:
            verts.extend([(-width,depth-.008,h),(width,depth-.008,h),(width,depth+.008,h),(-width,depth+.008,h)])
        faces=[(3,2,1,0),(12,13,14,15)]
        for row in range(3):
            for j in range(4):a=row*4+j;b=row*4+(j+1)%4;faces.append((a,b,b+4,a+4))
        mesh=bpy.data.meshes.new('Curved tapered monitor support');mesh.from_pydata(verts,[],faces);mesh.materials.append(aluminum);mesh.update();stand.data=mesh
        for mod in list(stand.modifiers):stand.modifiers.remove(mod)
        bevel=stand.modifiers.new('Aluminum stand radii','BEVEL');bevel.width=.004;bevel.segments=3
    for o in list(bpy.data.objects):
        if o.get('semantic_type')=='MonitorScreen':
            if not o.name.startswith('sim:r1:work:E:screen:'):
                xs=[v.co.x for v in o.data.vertices];zs=[v.co.z for v in o.data.vertices];w=max(xs)-min(xs);h=max(zs)-min(zs)
                o.data=o.data.copy()
                for v in o.data.vertices:v.co.x*=.58/w;v.co.z=v.co.z*.32/h+.01
            o.data.materials.clear();o.data.materials.append(screenmat);uv=o.data.uv_layers.new(name='DisplayUV');uv.active_render=True
            for loop in o.data.loops:
                v=o.data.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(v.x/.58+.5,(v.z-(.01 if not o.name.startswith('sim:r1:work:E:screen:') else 0))/.32+.5)
        if o.get('semantic_type')=='Monitor':
            o.data.materials.clear();o.data.materials.append(aluminum)
    keyboards=[o for o in bpy.data.objects if o.get('semantic_type')=='Keyboard']
    # One editable mesh per keyboard: individual raised keycaps share the original keyboard pose.
    verts=[];faces=[]
    for row in range(5):
        for col in range(14):
            x=(col-6.5)*.025;y=(row-2)*.019;z=.011;a=.0105;b=.0075;c=.004
            offset=len(verts);verts += [(x-a,y-b,z-c),(x+a,y-b,z-c),(x+a,y+b,z-c),(x-a,y+b,z-c),(x-a,y-b,z+c),(x+a,y-b,z+c),(x+a,y+b,z+c),(x-a,y+b,z+c)]
            faces += [tuple(offset+k for k in f) for f in [(3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]]
    keymat=polymer.copy();keymat.name='R1 key legends PBR';p=keymat.node_tree.nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=.32
    tex=keymat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(OUTPUT/'revision-assets/keyboard-legends.png'));tex.image.pack();keymat.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color'])
    keymesh=bpy.data.meshes.new('Individual keyboard keycaps');keymesh.from_pydata(verts,[],faces);keymesh.materials.append(keymat)
    uv=keymesh.uv_layers.new(name='KeyLegendUV')
    for loop in keymesh.loops:
        v=keymesh.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(v.x/.38+.5,v.y/.12+.5)
    for i,keyboard in enumerate(keyboards):
        keyboard.data.materials.clear();keyboard.data.materials.append(aluminum)
        o=bpy.data.objects.new('keycaps',keymesh);bpy.context.scene.collection.objects.link(o);S.reg(o,'work:keys:'+str(i),'KeyboardDetail',keyboard['environment_id']);o.parent=keyboard;o.location=(0,0,0)
        bevel=o.modifiers.new('Rounded key corners','BEVEL');bevel.width=.0015;bevel.segments=2
        pad=S.box('work:deskpad:'+str(i),(0,0,0),(.55,.004,.27),dark,'DeskAccessory',keyboard['environment_id'],.014);pad.parent=keyboard;pad.location=(.06,0,-.012)
        mouse=S.ellipsoid('work:mouse:'+str(i),(0,0,0),(.065,.032,.108),polymer,'DeskAccessory',keyboard['environment_id']);mouse.parent=keyboard;mouse.location=(.28,-.01,.005)
        detail=S.line('work:mouse-seam:'+str(i),[(0,.018,-.045),(0,.020,0),(0,.017,.043)],.0006,graphite,'DeskAccessory',keyboard['environment_id']);detail.parent=keyboard;detail.location=(.28,-.01,.005)
    # Existing hanging boxes stay fixed; replace their spherical vine approximation with mapped leaves.
    removed_vines=[];pendants=[]
    for env in ['A','B','C']:
        old=[o for o in list(bpy.data.objects) if o.name.startswith('sim:p1:'+env+':vine:')]
        for o in old:removed_vines.append(o.name);bpy.data.objects.remove(o,do_unlink=True)
        for j,planter in enumerate([o for o in bpy.data.objects if o.name.startswith('sim:p1:'+env+':planter:')]):
            x,y,z=to_source(planter.location)
            A.place('DiffuseTransmissionPlant',f'work:foliage:{env}:{j}',x,z,env,height=.60,floor=y+.10,tilt_x=math.pi,kind='Vegetation',parts=['leaves'])
            # Warm diffuser under the original hanging planter, as in the supplied office reference.
            id=f'work:planter-glow:{env}:{j}';em=material('R1 hanging diffuser '+env+str(j),(1,.55,.25),.45)
            p=em.node_tree.nodes.get('Principled BSDF');p.inputs['Emission Color'].default_value=(1,.55,.25,1)
            lens=S.box(id+':emitter',(x,y-.148,z),(.58,.012,.49),em,'LuminaireEmitter',env,.004)
            data=bpy.data.lights.new(id,'AREA');data.shape='RECTANGLE';data.size=.56;data.size_y=.47;data.color=(1,.55,.25)
            o=bpy.data.objects.new(id,data);bpy.context.scene.collection.objects.link(o);o.location=to_blender((x,y-.17,z));S.reg(o,id+':light','LuminaireLight',env)
            for k,v in {'controlled_luminaire':True,'nominal_power':45,'on':True,'level':1.0,'mode':'auto','nominal_temperature_kelvin':2700,'emitter_material':em.name}.items():o[k]=v
            pendants.append({'id':o.name,'type':'luminaire','environment_id':env,'fixture_id':planter.name,'emitter_id':lens.name,'nominal_power_blender':45,'nominal_temperature_kelvin':2700,'color_rgb':[1,.55,.25],'dimmable':True,'initial_state':{'on':True,'level':1,'mode':'auto'},'light_type':'AREA','physical_device_confirmed':False})
    return {'refined_back_objects':refined,'keyboards_detailed':len(keyboards),'removed_vine_references':removed_vines,'pendant_lights':pendants,'positions':'All inherited seat/table/monitor transforms retained; only back mesh data/materials and attached details modified.'}
