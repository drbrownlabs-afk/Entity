"""Gate for actual edited geometry, routes, doors, source preservation and mutable lighting."""
import sys,math,collections
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import ROOT,HERE,OUTPUT,HANDOFF,read,write,sha256,protected_changes,to_source
import archviz_environment as env
from doors import command,query
E=HANDOFF/'evidence/phase04-revision';master=OUTPUT/'office-phase04-revision.blend'
m=read(OUTPUT/'device-manifest-revision.json');inv=read(OUTPUT/'revision-full-inventory.json');cfg=read(HERE/'revision-layout.json')
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene;scene.frame_set(1);bpy.context.view_layer.update()
checks=[]
def check(name,ok,detail=None):
    checks.append({'name':name,'passed':bool(ok),'detail':detail})
    write(E/'checks.json',{'checks':checks,'passed':all(c['passed'] for c in checks),'master_sha256':sha256(master),'human_approval':False})
    assert ok,(name,detail)
def bounds(o):
    pts=[o.matrix_world@Vector(p) for p in o.bound_box]
    return ([min(p[i] for p in pts) for i in range(3)],[max(p[i] for p in pts) for i in range(3)])
def overlap(a,b):return all(min(a[1][i],b[1][i])-max(a[0][i],b[0][i])>1e-5 for i in range(3))
cache={}
def bvh(o):
    if o.name not in cache:
        eo=o.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=eo.to_mesh()
        cache[o.name]=BVHTree.FromPolygons([eo.matrix_world@v.co for v in mesh.vertices],[list(p.vertices) for p in mesh.polygons]);eo.to_mesh_clear()
    return cache[o.name]
check('reopens',scene.get('archviz_revision'))
check('master-current',sha256(master)==m['master_sha256']==inv['master_sha256'])
check('original-phase04-preserved',sha256(OUTPUT/'office-phase04.blend')==cfg['source_master_sha256']==m['source_master_sha256'])
check('protected-sources-preserved',not protected_changes())
check('build-inputs-current',all(sha256(ROOT/p)==h for p,h in m['input_hashes'].items()))
check('original-phases-gates-remain-valid',all(read(HANDOFF/f'evidence/phase{n}/summary.json')['master_sha256']==sha256(OUTPUT/f'office-phase{n}.blend') for n in ['02','03','04']))
ids=[o['stable_id'] for o in bpy.data.objects if 'stable_id' in o];check('stable-ids-unique',len(ids)==len(set(ids)))
check('no-white-visitor-chair-group',not any(o.name.startswith('sim:p1:waiting:chair:') for o in bpy.data.objects))
groups=inv['professional_instances']
check('two-sofas-replace-white-group',sum(g['id'].startswith('sim:r1:waiting:sofa:') for g in groups)==2)
check('four-dining-tables',sum(o.name.startswith('sim:r1:dining:') and o.get('semantic_type')=='CafeTable' for o in bpy.data.objects)==4)
check('fourteen-dining-chair-groups',sum(g['id'].startswith('sim:r1:dining:') and ':chair:' in g['id'] for g in groups)==14)
check('bar-four-stools-preserved',sum(o.name.startswith('sim:cafe:stool:') and o.get('semantic_type')=='Stool' for o in bpy.data.objects)==4)
check('two-lounge-sofas-and-chair',sum(g['id'].startswith('sim:r1:lounge:sofa:') for g in groups)==2 and any(g['id']=='sim:r1:lounge:chair' for g in groups))
check('professional-pouf-flowers-plants',{'SpecularSilkPouf','GlassVaseFlowers','DiffuseTransmissionPlant'}<=set(g['asset'] for g in groups))
check('no-asset-fireflies',not any('firefly' in o.name.lower() for o in bpy.data.objects))
# Every inherited object not explicitly removed retains its original world pose.
removed=set(inv['removed_reconstructed_objects']);old=read(OUTPUT/'phase04-full-inventory.json')['records']
missing=[];moved=[]
for r in old:
    if r['blender_name'] in removed:continue
    o=bpy.data.objects.get(r['blender_name'])
    if not o:missing.append(r['id']);continue
    if any(abs(o.matrix_world[i][j]-r['world_matrix_blender'][i][j])>2e-5 for i in range(4) for j in range(4)):moved.append(r['id'])
write(E/'preservation.json',{'source_sha256':m['source_master_sha256'],'master_sha256':sha256(master),'explicitly_removed_estimated_furniture_and_foliage':sorted(removed),'missing_unexpected':missing,'moved_inherited_objects':moved,'material_and_mesh_detail_changes':'Permitted finish refinement; source transforms and original master remain intact.'})
check('no-unexpected-deletions',not missing,missing[:10]);check('inherited-poses-preserved',not moved,moved[:10])
for tv in m['televisions']:
    o=bpy.data.objects[tv['screen_id']]
    check('screen-content:'+tv['id'],o['content_state']==tv['state'])
    check('screen-packed-UV:'+tv['id'],bool(o.data.uv_layers) and any(n.type=='TEX_IMAGE' and n.image and n.image.packed_file for n in bpy.data.materials[tv['material']].node_tree.nodes))
check('six-independent-screens',len(m['televisions'])==6 and len({t['material'] for t in m['televisions']})==6)
tv=bpy.data.objects['sim:r1:meeting:TV:body'];check('meeting-TV-large',tv.dimensions.y>2.3 and tv.dimensions.z>1.3)
check('WC-identified-and-equipped',all('sim:r1:WC:'+s in bpy.data.objects for s in ['sign','toilet:bowl','toilet:seat','basin','mirror','vanity']))
check('WC-roof-opaque',not bpy.data.objects['sim:p3:WC:ceiling'].hide_render)
check('no-camera-inside-WC',not any(-7.9<o.location.x<-5.2 and .3<-o.location.y<2.5 and -1.55<o.location.z<1.65 for o in bpy.data.objects if o.type=='CAMERA'))
check('two-booths-in-place',all('sim:p3:sim:CALL-0'+str(i)+':desk' in bpy.data.objects and 'sim:r1:call:'+str(i)+':sign' in bpy.data.objects for i in [1,2]))
check('clock-controller-opt-in',any('archviz_environment.register' in t.as_string() for t in bpy.data.texts if t.name.startswith('START ENTITY')))
check('PBR-floor-maps-packed',sum(bool(n.type=='TEX_IMAGE' and n.image and n.image.packed_file) for n in bpy.data.materials['R1 2K terrazzo PBR'].node_tree.nodes)==3)
check('physical-sky',scene.world.node_tree.nodes['Archviz daylight'].sky_type=='NISHITA')
glazing=read(E/'glazing-audit.json');check('glazing-audit-current',glazing['master_sha256']==sha256(master))
check('all-architecture-glass-clear-and-reflective',glazing['count']>40 and all(abs(p['IOR']-1.52)<1e-5 and p['roughness']<=.011 and p['transmission']==1 and p['alpha']==1 and p['minimum_dimension_relative']>0 for p in glazing['panes']))
check('WC-stays-opaque',all(mat.node_tree.nodes.get('Principled BSDF').inputs['Transmission Weight'].default_value==0 for o in bpy.data.objects if o.get('environment_id')=='sim:WC' and o.get('semantic_type') in ['Partition','Ceiling'] for mat in o.data.materials if mat and mat.use_nodes and mat.node_tree.nodes.get('Principled BSDF')))
check('no-spherical-greenwall-reference',not any(o.name.startswith('sim:p1:green-wall:leaf:') for o in bpy.data.objects))
check('continuous-small-leaf-vertical-garden',sum(g['id'].startswith('sim:r1:greenwall:') for g in groups)>=2000)
leaf=bpy.data.materials['leaves'];pbr=leaf.node_tree.nodes.get('Principled BSDF');alpha=pbr.inputs['Alpha']
check('thin-leaves-preserve-alpha-mask',bool(alpha.links) and any(n.type=='MIX_SHADER' and n.inputs[0].links and n.inputs[0].links[0].from_socket==alpha.links[0].from_socket for n in leaf.node_tree.nodes))
check('workstation-backs-and-keycaps',len(inv['workstation_revision']['refined_back_objects'])>=30 and inv['workstation_revision']['keyboards_detailed']>=24)
# Collisions: every door across the full sweep against furniture; synchronized visible leaf/collider.
obstacle_types={'Table','Chair','ChairFrame','TableLeg','Column','Storage','TableDivider','Monitor','MonitorStand','Counter','ReceptionCounter','Kiosk','Sofa','Armchair','SideTable','Planter','CafeTable','BoothSeat','Bar','Refrigerator','Ottoman','SanitaryFixture','Printer'}
fixtures=[o for o in bpy.data.objects if o.type in ['MESH','CURVE'] and o.get('semantic_type') in obstacle_types]
fixed={o.name:bounds(o) for o in fixtures}
for d in m['doors']:
    pivot=bpy.data.objects[d['id']];leaf=bpy.data.objects[d['leaf_id']];coll=bpy.data.objects[d['collider_id']]
    check('door-independent:'+d['id'],leaf.parent==pivot and coll.parent==pivot)
    for frame in range(1,32,3):
        scene.frame_set(frame);bpy.context.view_layer.update();cache.pop(coll.name,None)
        check(f'door-collider-sync:{d["id"]}:{frame}',all(abs(leaf.matrix_world[i][j]-coll.matrix_world[i][j])<2e-5 for i in range(4) for j in range(4)))
        hits=[o.name for o in fixtures if overlap(bounds(coll),fixed[o.name]) and bvh(coll).overlap(bvh(o))]
        check(f'door-sweep-clear:{d["id"]}:{frame}',not hits,hits[:12])
# Dining chairs may tuck beneath tables but solid meshes must not interpenetrate.
tops=[o for o in bpy.data.objects if o.name.startswith('sim:r1:dining:') and o.get('semantic_type')=='CafeTable']
hits=[]
for g in groups:
    if g['id'].startswith('sim:r1:dining:') and ':chair:' in g['id']:
        for name in g['objects']:
            o=bpy.data.objects[name]
            for top in tops:
                if overlap(bounds(o),bounds(top)) and bvh(o).overlap(bvh(top)):hits.append([name,top.name])
check('dining-no-chair-table-interpenetration',not hits,hits[:12])
# Existing partitions against furniture refined in this derivative. Wall-mounted sanitary fittings
# are intentional attachments; their door clearance is still checked in the sweep above.
panels=read(OUTPUT/'phase03-inventory.json')['partitions'];hits=[]
for id in panels:
    panel=bpy.data.objects[id];bb=bounds(panel)
    for o in fixtures:
        if o.get('semantic_type')=='SanitaryFixture':continue
        if overlap(bb,fixed[o.name]) and bvh(panel).overlap(bvh(o)):hits.append([id,o.name])
write(E/'partition-intersections.json',hits)
check('partitions-clear-refined-furniture',not hits,hits[:16])
# Actual floor-aware routing with the same step/radius/height criteria as the previous gate.
scene.frame_set(31);bpy.context.view_layer.update();vs=[];faces=[]
for o in bpy.data.objects:
    if o.type=='MESH' and o.get('semantic_type') in {'Floor','Ramp'}:
        offset=len(vs);vs += [o.matrix_world@v.co for v in o.data.vertices];faces += [[i+offset for i in p.vertices] for p in o.data.polygons]
floor=BVHTree.FromPolygons(vs,faces)
nav_types=obstacle_types|{'Partition','PartitionFrame','DoorCollider','Wall','WallCladding','TV','TVScreen'}
obstacles=[(o.name,*bounds(o)) for o in bpy.data.objects if o.type in ['MESH','CURVE'] and o.get('semantic_type') in nav_types and o.get('environment_id')!='render-context']
step=.1;radius=.18;nodes={}
for ix in range(-118,42):
    for iz in range(-284,25):
        x=ix*step;z=iz*step;hit,_,_,_=floor.ray_cast(Vector((x,-z,5)),Vector((0,0,-1)),10)
        if hit is None:continue
        y=hit.z
        if any(lo[0]-radius<x<hi[0]+radius and lo[1]-radius<-z<hi[1]+radius and hi[2]>y+.05 and lo[2]<y+1.65 for _,lo,hi in obstacles):continue
        nodes[(ix,iz)]=y
start=(-22,8);check('route-start-free',start in nodes)
def reachable(blocked=set()):
    parents={start:None};q=collections.deque([start])
    while q:
        cur=q.popleft()
        for dx,dz in [(1,0),(-1,0),(0,1),(0,-1)]:
            nxt=(cur[0]+dx,cur[1]+dz)
            if nxt in nodes and nxt not in blocked and nxt not in parents and abs(nodes[nxt]-nodes[cur])<=.06:parents[nxt]=cur;q.append(nxt)
    return parents
parents=reachable();base=read(OUTPUT/'phase03-inventory.json');targets=dict(base['layout']['target_points'])
targets['cafe-social']=[-3.2,-22.65]
targets['white-sector-sofas']=[-4.75,-15.15];targets['bistro-access']=[-8.0,-18.85]
for n,r in enumerate(cfg['dining'][:3],1):targets['dining-'+str(n)]=[-3.2,r['center'][1]]
for room in base['layout']['rooms']:targets[room['id']]=[-.9,room['hinge_z']+room['door_width']/2]
routes={}
for name,p in targets.items():
    goal=(round(p[0]/step),round(p[1]/step));check('route:'+name,goal in parents,{'target':p,'free':goal in nodes,'reachable':len(parents)})
    path=[];cur=goal
    while cur is not None:path.append([round(cur[0]*step,3),round(nodes[cur],4),round(cur[1]*step,3)]);cur=parents[cur]
    routes[name]=path[::-1]
write(E/'routes.json',{'step':step,'radius':radius,'maximum_floor_height_jump':.06,'routes':routes,'note':'Geometry QA only; no metric/accessibility certification or PlayCanvas runtime claim.'})
security=[]
for id in base['security_group']:
    o=bpy.data.objects[id];o.rotation_euler.z=0;bpy.context.view_layer.update();d=next(d for d in m['doors'] if d['id']==id);security.append(bounds(bpy.data.objects[d['collider_id']]))
blocked={n for n in nodes if any(lo[0]-radius<n[0]*step<hi[0]+radius and lo[1]-radius<-n[1]*step<hi[1]+radius for lo,hi in security)}
check('closed-security-still-blocks-rear',tuple(round(v/step) for v in targets['sim:ROOM-E']) not in reachable(blocked))
# ALL new and inherited lights remain independently mutable; no fixed artificial-light bake.
initial=env.state();check('71-lights-17-circuits',len(env.lights())==len(m['luminaires'])==71 and len(m['circuits'])==17)
check('warm-task-and-accent-design',all(o['nominal_temperature_kelvin'] in [2700,3200] and o.data.color[0]>o.data.color[1]>o.data.color[2] for o in env.lights()))
check('concealed-and-vertical-warm-LEDs',all('sim:r1:'+id in bpy.data.objects for id in ['lounge:cove:back:fascia','lounge:cove:side:fascia','lounge:vertical:light']))
check('30-detailed-computers',sum(o.get('semantic_type')=='MonitorScreen' for o in bpy.data.objects)>=30 and inv['workstation_revision']['keyboards_detailed']>=30)
for d in m['luminaires']:
    o=bpy.data.objects[d['id']];env.light_set(o.name,on=False)
    check('light-off:'+o.name,o.data.energy==0 and bpy.data.materials[o['emitter_material']].node_tree.nodes.get('Principled BSDF').inputs['Emission Strength'].default_value==0)
    env.light_set(o.name,on=True,level=.5);check('light-dim:'+o.name,abs(o.data.energy-o['nominal_power']*.5)<1e-4)
    env.light_set(o.name,on=True,level=1)
for zone in m['circuits']:
    env.circuit_set(zone,on=False);check('circuit-off:'+zone,all(bpy.data.objects[id].data.energy==0 for id in m['circuits'][zone]));env.circuit_set(zone,on=True)
for hour in [8,12,16,20]:
    env.set_hour(hour);sky=scene.world.node_tree.nodes['Archviz daylight'];check('sky-clock:'+str(hour),abs(sky.sun_rotation-math.radians(scene['solar_azimuth']))<1e-5)
env.set_hour(.01);env.play(-360);env.advance(1);check('reverse-clock',abs(scene['simulation_hour']-23.91)<1e-6);env.restore(initial)
bootstrap=next(t.as_string() for t in bpy.data.texts if t.name.startswith('START ENTITY'))
exec(bootstrap,{})
scene.entity_visual_hour=16;check('embedded-controls-hour',scene['simulation_hour']==16)
scene.entity_visual_zone='sim:LOUNGE';bpy.ops.entity.visual_light(action='off')
check('embedded-controls-circuit',all(bpy.data.objects[id].data.energy==0 for id in m['circuits']['sim:LOUNGE']))
env.restore(initial)
bpy.ops.wm.open_mainfile(filepath=str(master));check('reopen-paused-no-test-mutations',not bpy.context.scene['simulation_playing'] and bpy.context.scene['simulation_hour']==12)
write(E/'summary.json',{'passed':True,'checks':len(checks),'routes':list(routes),'master_sha256':sha256(master),'dining_tables':4,'dining_chairs':14,'retained_bar_stools':4,'luminaires':71,'circuits':17,'doors':len(m['doors']),'screens':6,'human_approval':False,'PlayCanvas_started':False})
print('REVISION_GATE_PASS',len(checks),'checks',len(routes),'routes',flush=True)
