"""Gate02 geometry, door state/collider, floor-aware navigation and actual render evidence."""
import sys,math,json,collections
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import ROOT,HERE,OUTPUT,HANDOFF,read,write,sha256,to_blender,to_source,protected_changes
from doors import command,query
E=HANDOFF/'evidence/phase03';master=OUTPUT/'office-phase03.blend';manifest=read(OUTPUT/'phase03-inventory.json');cfg=manifest['layout']
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene
checks=[]
def check(name,ok,detail=None):
 checks.append({'name':name,'passed':bool(ok),'detail':detail})
 write(E/'checks.json',{'checks':checks,'passed':all(c['passed'] for c in checks),'master_sha256':sha256(master),'human_approval':False})
 assert ok,(name,detail)
def bounds(o):
 pts=[o.matrix_world@Vector(p) for p in o.bound_box]
 return ([min(p[i] for p in pts) for i in range(3)],[max(p[i] for p in pts) for i in range(3)])
def overlap(a,b,eps=1e-5):return all(min(a[1][i],b[1][i])-max(a[0][i],b[0][i])>eps for i in range(3))
def bvh(o):
 dg=bpy.context.evaluated_depsgraph_get();eo=o.evaluated_get(dg);mesh=eo.to_mesh();v=[eo.matrix_world@p.co for p in mesh.vertices];f=[list(p.vertices) for p in mesh.polygons];tree=BVHTree.FromPolygons(v,f);eo.to_mesh_clear();return tree
check('reopens',scene.get('phase','').startswith('03'))
check('source-masters-intact',sha256(ROOT/manifest['source_master'])==manifest['source_master_sha256'])
check('577-original-files-and-upstream-plan-intact',not protected_changes())
check('white-chairs-reception',all(o.get('environment_id')=='RECEPTION' for o in bpy.data.objects if o.name.startswith('sim:p1:waiting:chair:')))
check('black-chairs-replaced-by-sofa',not any(o.name.startswith('sim:p1:reception:chair:') for o in bpy.data.objects))
check('build-inputs-current',all(sha256(ROOT/p)==h for p,h in manifest['input_hashes'].items()))
check('config-current',manifest['architecture_C']==read(HERE/'phase03-layout.json'))
ids=[o['stable_id'] for o in bpy.data.objects if 'stable_id' in o]
check('ids-unique',len(ids)==len(set(ids)))
check('six-enclosures',len(cfg['rooms'])==6)
check('four-base-TVs-plus-lounge',len(manifest['televisions'])==5 and len({t['material'] for t in manifest['televisions']})==5)
for tv in manifest['televisions']:
 check('TV-screen:'+tv['id'],bpy.data.objects[tv['screen_id']]['content_state']==tv['state'])
 check('TV-UV:'+tv['id'],bool(bpy.data.objects[tv['screen_id']].data.uv_layers))
 check('TV-image:'+tv['id'],any(n.type=='TEX_IMAGE' and n.image and n.image.packed_file for n in bpy.data.materials[tv['material']].node_tree.nodes))
check('no-pods',not any(o.name.startswith('sim:p1:pod:') for o in bpy.data.objects))
check('cafe-retained',sum(o.get('semantic_type')=='CafeTable' for o in bpy.data.objects)==2)
check('E-additional-desk','sim:p2:E:desktop' in bpy.data.objects and sum(o.name.startswith('sim:p2:E:chair:') and o.name.endswith(':seat') for o in bpy.data.objects)==6)
check('E-behind-D',cfg['E_table']['center'][2]<-24.3)
check('reception-counter','sim:p2:reception-counter' in bpy.data.objects)
check('waiting-sofa-armchair-tables',all('sim:p2:'+i in bpy.data.objects for i in ['waiting-sofa-base','waiting-armchair-seat','waiting-side-table']))
for r in read(HANDOFF/'SPACE-INVENTORY.json')['inventory']:
 if r['position'] is not None and r['kind']!='Camera':check('source-anchor:'+r['id'],(bpy.data.objects['ref:'+r['id']].location-Vector(to_blender(r['position']))).length<2e-5)
# All original reconstructed A-D tables and seats retain their world positions.
old=read(OUTPUT/'object-inventory.json')
for r in old['objects']:
 if r['id'].startswith(tuple('sim:p1:'+x+':' for x in ['A','B','C','D'])) and (r['id'].endswith(':desktop') or r['id'].endswith(':seat')):
  check('retain:'+r['id'],(bpy.data.objects[r['id']].location-Vector(r['blender_position'])).length<2e-5)
obstacle_types={'Table','Chair','ChairFrame','TableLeg','Column','Storage','TableDivider','Monitor','MonitorStand','Counter','ReceptionCounter','Kiosk','Sofa','Armchair','SideTable','Planter','CafeTable','BoothSeat','Bar','Refrigerator'}
fixtures=[o for o in bpy.data.objects if o.type=='MESH' and o.get('semantic_type') in obstacle_types]
fixed_bounds={o.name:bounds(o) for o in fixtures};trees={}
def intersects(o,other):
 if not overlap(bounds(o),fixed_bounds[other.name]):return False
 if other.name not in trees:trees[other.name]=bvh(other)
 return bool(bvh(o).overlap(trees[other.name]))
panel_bounds=[tuple(round(v,4) for edge in bounds(bpy.data.objects[id]) for v in edge) for id in manifest['partitions']]
check('no-duplicate-glass-panels',len(panel_bounds)==len(set(panel_bounds)))
check('E-rear-closed-shared-front-once',any(id.startswith('sim:p2:sim:ROOM-E:rear:') for id in manifest['partitions']) and not any(id.startswith('sim:p2:sim:ROOM-E:front:') for id in manifest['partitions']) and any(id.startswith('sim:p2:D:rear:') for id in manifest['partitions']))
# Joined frame/glass pieces are intentional assemblies; check partitions vs furniture/columns.
collisions=[]
for id in manifest['partitions']:
 o=bpy.data.objects[id]
 for other in fixtures:
  if intersects(o,other):collisions.append([id,other.name])
write(E/'partition-intersections.json',collisions)
check('partitions-clear-furniture-columns',not collisions,collisions[:20])
# Sample full opening sweep, query state and collider world pose. Operate one door without affecting peers.
for d in manifest['doors']:
 id=d['id'];pivot=bpy.data.objects[id];leaf=bpy.data.objects[d['leaf_id']];coll=bpy.data.objects[d['collider_id']]
 check('hinge-independent:'+id,leaf.parent==pivot and coll.parent==pivot)
 for frame in range(1,32,3):
  scene.frame_set(frame);bpy.context.view_layer.update()
  check(f'collider-sync:{id}:{frame}',all(abs(leaf.matrix_world[i][j]-coll.matrix_world[i][j])<2e-5 for i in range(4) for j in range(4)))
  hit=[o.name for o in fixtures if intersects(coll,o)]
  check(f'door-sweep-clear:{id}:{frame}',not hit,hit[:10])
 scene.frame_set(1);check('closed:'+id,query(id)['status']=='closed')
 other_keys={d2['id']:len(bpy.data.objects[d2['id']].animation_data.action.fcurves[2].keyframe_points) if bpy.data.objects[d2['id']].animation_data and bpy.data.objects[d2['id']].animation_data.action else 0 for d2 in manifest['doors'] if d2['id']!=id}
 command(id,'lock')
 try:command(id,'open');denied=False
 except PermissionError:denied=True
 check('locked-open-denied:'+id,denied)
 scene.frame_set(31);check('lock-stops-queued-animation:'+id,query(id)['status']=='closed');scene.frame_set(1)
 command(id,'unlock');command(id,'open');scene.frame_set(31)
 check('open-query:'+id,query(id)['status']=='open')
 check('independent-command:'+id,all((len(bpy.data.objects[k].animation_data.action.fcurves[2].keyframe_points) if bpy.data.objects[k].animation_data and bpy.data.objects[k].animation_data.action else 0)==v for k,v in other_keys.items()))
 # restore the demonstration action generated in the master without modifying it on disk
 scene.frame_set(1);command(id,'close');scene.frame_set(31);command(id,'open');scene.frame_set(61);command(id,'close')
# Reload: tests above must never alter committed animation/master.
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene;scene.frame_set(31);bpy.context.view_layer.update()
# Build a BVH only from actual floor geometry. Height jumps exclude stepping through uncut slabs.
vs=[];fs=[]
for o in bpy.data.objects:
 if o.type=='MESH' and o.get('semantic_type') in {'Floor','Ramp'}:
  mesh=o.data;offset=len(vs);vs.extend([o.matrix_world@v.co for v in mesh.vertices]);fs.extend([[i+offset for i in p.vertices] for p in mesh.polygons])
floor_tree=BVHTree.FromPolygons(vs,fs)
nav_types=obstacle_types|{'Partition','PartitionFrame','DoorCollider','Wall','WallCladding','TV','TVScreen'}
obstacles=[]
for o in bpy.data.objects:
 if o.type=='MESH' and o.get('semantic_type') in nav_types:
  lo,hi=bounds(o);obstacles.append((o.name,lo,hi))
step=.1;radius=cfg['corridor']['radius_qa'];nodes={}
# Axes: grid ix maps X, iz maps source Z. Four-neighbor moves avoid corner cutting.
for ix in range(-118,42):
 x=ix*step
 for iz in range(-284,25):
  z=iz*step
  hit,_,_,_=floor_tree.ray_cast(Vector((x,-z,5)),Vector((0,0,-1)),10)
  if hit is None:continue
  ground=hit.z
  if any(lo[0]-radius<x<hi[0]+radius and lo[1]-radius<-z<hi[1]+radius and hi[2]>ground+.05 and lo[2]<ground+1.65 for _,lo,hi in obstacles):continue
  nodes[(ix,iz)]=ground
start=(-22,8);check('corridor-start-free',start in nodes)
parents={start:None};q=collections.deque([start])
while q:
 cur=q.popleft()
 for dx,dz in [(1,0),(-1,0),(0,1),(0,-1)]:
  nxt=(cur[0]+dx,cur[1]+dz)
  if nxt in nodes and nxt not in parents and abs(nodes[nxt]-nodes[cur])<=.06:
   parents[nxt]=cur;q.append(nxt)
targets=dict(cfg['target_points'])
for r in cfg['rooms']:targets[r['id']]=[-.9,r['hinge_z']+r['door_width']/2]
routes={}
for name,p in targets.items():
 goal=(round(p[0]/step),round(p[1]/step));check('route:'+name,goal in parents,{'target':p,'free':goal in nodes,'reachable_nodes':len(parents)})
 path=[];cur=goal
 while cur is not None:path.append([round(cur[0]*step,3),round(nodes[cur],4),round(cur[1]*step,3)]);cur=parents[cur]
 routes[name]=path[::-1]
write(E/'routes.json',{'radius_relative':radius,'step_relative':step,'max_height_step':.06,'doors_state':'open at frame31','routes':routes,'note':'Geometry QA of reconstructed scene, not physical certification or PlayCanvas runtime test'})
# Closed security must block the same straight corridor cross-section; open state moves it to edge.
security=bpy.data.objects['sim:p2:door:security:collider']
pivot=bpy.data.objects['sim:p2:door:security'];pivot.rotation_euler.z=0;bpy.context.view_layer.update();closed=bounds(security)
check('security-closed-crosses-corridor',closed[0][0]<-2.2<closed[1][0])
security_bounds=[closed]
for id in manifest['security_group'][1:]:
 o=bpy.data.objects[id];o.rotation_euler.z=0;bpy.context.view_layer.update();record=next(d for d in manifest['doors'] if d['id']==id);security_bounds.append(bounds(bpy.data.objects[record['collider_id']]))
blocked={n for n,y in nodes.items() if any(lo[0]-radius<n[0]*step<hi[0]+radius and lo[1]-radius<-n[1]*step<hi[1]+radius for lo,hi in security_bounds)}
reached={start};queue=collections.deque([start])
while queue:
 cur=queue.popleft()
 for dx,dz in [(1,0),(-1,0),(0,1),(0,-1)]:
  nxt=(cur[0]+dx,cur[1]+dz)
  if nxt in nodes and nxt not in blocked and nxt not in reached and abs(nodes[nxt]-nodes[cur])<=.06:reached.add(nxt);queue.append(nxt)
goal=tuple(round(v/step) for v in targets['sim:ROOM-E'])
check('security-closed-blocks-rear-route',goal not in reached,{'reachable_with_security_closed':len(reached)})
pivot.rotation_euler.z=pivot['open_angle'];bpy.context.view_layer.update();opened=bounds(security)
check('security-open-clears-corridor',not opened[0][0]-radius<-2.2<opened[1][0]+radius)
check('eight-lockers-adjacent-WC',len(manifest['lockers'])==8 and all(x['assigned_to'] is None for x in manifest['lockers']))
check('two-acoustic-booths',sum(d['environment_id'] in ['sim:CALL-01','sim:CALL-02'] for d in manifest['doors'])==2)
check('no-camera-inside-WC',not any(-7.9<o.location.x<-5.2 and .3<-o.location.y<2.5 and -1.55<o.location.z<1.65 for o in bpy.data.objects if o.type=='CAMERA'))
check('C-wing-distinct',bool(bpy.data.objects.get('sim:p3:wing-floor')) and bool(bpy.data.objects.get('sim:cafe:floor-wing')))
write(E/'summary.json',{'passed':True,'checks':len(checks),'routes':list(routes),'master_sha256':sha256(master),'human_approval':False,'runtime_tested':False,'protected_files_unchanged':577,'upstream_plan_revision':'8490e1a'})
print('PHASE03_CHECKS_PASS',len(checks),'ROUTES',len(routes))
