"""C-wing addition preserving validated Phase02 architecture and semantic overrides."""
import sys,math
from pathlib import Path
import bpy
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import ROOT,HERE,OUTPUT,HANDOFF,read,write,sha256,to_blender,to_source,protected_changes
from studio import Studio
cfg=read(HERE/'phase03-layout.json');source=OUTPUT/'office-phase02.blend';h=sha256(source)
assert read(HANDOFF/'evidence/phase02/summary.json')['passed'] and not protected_changes()
bpy.ops.wm.open_mainfile(filepath=str(source));scene=bpy.context.scene;scene['phase']='03 C-wing';S=Studio('sim:p3:')
M=bpy.data.materials;ivory=M['Warm white plaster'];wood=M['Cafe warm oak'];black=M['Graphite powder coat'];fabric=M['Sand upholstery'];stone=M['Terrazzo warm - procedural reference'];glass=M['Phase02 clear partitions']
def remove(name):
 o=bpy.data.objects.get(name)
 if o:bpy.data.objects.remove(o,do_unlink=True)
# Keep reconstructed hanging planters inside the new enclosures; source anchors unchanged.
for zone,delta in [('A',.45),('B',.85),('C',.645)]:
 for o in bpy.data.objects:
  if o.name.startswith(tuple('sim:p1:'+zone+':'+part for part in ['planter:','planter-wire:','vine:'])):o.location.y+=delta
# Replace only the front portion of the estimated west facade and cladding for wing connection.
remove('sim:cafe:west-front-wall')
S.box('retained-west-wall',(-6.55,.05,-12),(.16,3.2,12.4),ivory,'Wall','CIRCULATION-01')
for o in list(bpy.data.objects):
 if o.name=='sim:p1:panel-west:0' or o.name.startswith('sim:p1:panel-seam:0:'):remove(o.name)
S.box('retained-front-cladding',(-4.91,.05,-6.35),(.13,3.2,1.1),wood,'WallCladding','CIRCULATION-01')
S.box('wing-floor',(-9.25,-1.64,-1.575),(5.5,.18,8.45),stone,'Floor','sim:LOUNGE')
S.box('wing-floor-join',(-6.475,-1.64,-1.575),(.1,.18,8.45),stone,'Floor','CIRCULATION-01')
S.box('wing-west',(-12.05,.05,-1.575),(.13,3.2,8.45),ivory,'Wall','sim:LOUNGE')
S.box('wing-return',(-9.25,.05,-5.8),(5.5,3.2,.13),ivory,'Wall','sim:LOUNGE')
S.box('wing-front-glass',(-9.25,.05,2.5),(5.5,3.2,.035),glass,'Window','sim:LOUNGE')
for i,x in enumerate([-11.95,-10.15,-8.35,-6.55]):S.box('wing-front-frame:'+str(i),(x,.05,2.48),(.035,3.2,.04),black,'WindowFrame','sim:LOUNGE')
S.box('wing-ceiling',(-9.25,1.72,-1.575),(5.5,.14,8.45),ivory,'Ceiling','sim:LOUNGE').hide_render=True
# A second real ramp connects the main corridor directly to the new wing.
remove('sim:p2:raised-east:front');remove('sim:p2:riser:front')
for name,zl,zr in [('middle',-18.05,-4.9),('entrance',-3.6,.85)]:
 S.box('raised-edge:'+name,(-3.2,-1.7,(zl+zr)/2),(.7,.3,zr-zl),stone,'Floor','CIRCULATION-01')
 S.box('riser:'+name,(-2.84,-1.7,(zl+zr)/2),(.045,.3,zr-zl),ivory,'Step','CIRCULATION-01')
mesh=bpy.data.meshes.new('Front ramp');mesh.from_pydata([to_blender(p) for p in [(-3.55,-1.55,-4.9),(-2.35,-1.85,-4.9),(-2.35,-1.85,-3.6),(-3.55,-1.55,-3.6)]],[],[(0,1,2,3)]);mesh.update()
o=bpy.data.objects.new('front ramp',mesh);scene.collection.objects.link(o);mesh.materials.append(stone);S.reg(o,'ramp-front','Ramp','CIRCULATION-01')
# Close the new potential bypass introduced by the front ramp: secondary simulated gate on raised route.
for name in ['sim:p2:TV:4:body','sim:p2:TV:4:screen']:
 bpy.data.objects[name].location.y=11.8
S.wall('security:raised:static',(-5.25,.05,-12.95),(2.5,3.2,.035),glass,'CIRCULATION-01')
S.wall('security:raised:header',(-3.45,1.3,-12.95),(1.1,.7,.035),glass,'CIRCULATION-01')
S.door('security:raised','CIRCULATION-01',(-4.0,-1.55,-12.95),1.1,2.5,material=glass)
# Modular lounge seating, distinct from cafe.
for i,x in enumerate([-11.1,-10.3,-9.5]):
 S.box(f'lounge:sofa:{i}:seat',(x,-1.27,-4.65),(.78,.50,.78),fabric,'Sofa','sim:LOUNGE',.08)
 S.box(f'lounge:sofa:{i}:back',(x,-.89,-4.99),(.78,.85,.13),fabric,'Sofa','sim:LOUNGE',.05)
S.box('lounge:armchair:seat',(-7.7,-1.25,-3.2),(.75,.45,.75),fabric,'Armchair','sim:LOUNGE',.08)
S.box('lounge:armchair:back',(-7.36,-.89,-3.2),(.13,.85,.75),fabric,'Armchair','sim:LOUNGE',.05)
S.box('lounge:table',(-10.2,-1.06,-3.1),(1.3,.08,.75),wood,'SideTable','sim:LOUNGE')
for i,x in enumerate([-10.7,-9.7]):S.box('lounge:table:leg:'+str(i),(x,-1.31,-3.1),(.06,.45,.55),black,'TableLeg','sim:LOUNGE')
# Acoustic calls: represented enclosure, not an acoustic performance claim.
for room in cfg['rooms'][1:3]:
 env=room['id'];xl,xr,zl,zr=room['bounds'];cy=-.2
 S.wall(env+':back',((xl+xr)/2,cy,zr),(xr-xl,2.7,.065),wood,env)
 for side,x in enumerate([xl,xr]):S.wall(env+':side:'+str(side),(x,cy,(zl+zr)/2),(.065,2.7,zr-zl),ivory,env)
 hinge=xl+.05;width=.8
 S.wall(env+':front-static',((hinge+width+xr)/2,cy,zl),(xr-hinge-width,2.7,.035),glass,env)
 S.wall(env+':transom',(hinge+width/2,1.0,zl),(width,.3,.035),glass,env)
 S.door(env+':door',env,(hinge,-1.55,zl),width,2.4,material=glass)
 S.box(env+':desk',((xl+xr)/2,-.70,1.70),(1.15,.07,.45),wood,'Table',env)
 S.box(env+':chair',((xl+xr)/2,-1.20,1.0),(.45,.50,.45),fabric,'Chair',env,.04)
 S.box(env+':vent',((xl+xr)/2,.94,zr-.05),(.4,.18,.035),black,'Ventilation',env)
 S.lamp(env+':lamp',env,((xl+xr)/2,1.1,1.2),75)
# Opaque sanitary block: access-only inspection. No camera or human inside.
env='sim:WC';xl,xr,zl,zr=cfg['rooms'][3]['bounds'];mid=(xl+xr)/2
for id,p,size in [('back',(mid,.05,zr),(xr-xl,3.2,.10)),('left',(xl,.05,(zl+zr)/2),(.10,3.2,zr-zl)),('right',(xr,.05,(zl+zr)/2),(.10,3.2,zr-zl)),('front-right',(-5.95,.05,zl),(1.5,3.2,.10)),('front-left',(-7.85,.05,zl),(.1,3.2,.10)),('lintel',(-7.25,1.2,zl),(1.1,.9,.10))]:S.wall('WC:'+id,p,size,ivory,env)
S.door('WC:door',env,(-7.8,-1.55,zl),1.1,2.3,material=wood)
S.box('WC:ceiling',(mid,1.72,(zl+zr)/2),(xr-xl,.14,zr-zl),ivory,'Ceiling',env).hide_render=True
S.lamp('WC:lamp',env,(mid,1.5,1.5),80)
# Eight individually identified lockers adjacent to WC; doors operate locally, assignment unknown.
locker_ids=[]
for row in range(2):
 for c in range(4):
  x=-4.9+c*.33;y=-1.55+row*.90;id=f'locker:{row}:{c}';env='sim:LOCKERS'
  S.box(id+':back',(x+.15,y+.40,2.02),(.30,.8,.04),wood,'Storage',env)
  for side,dx in enumerate([0,.30]):S.box(id+':side:'+str(side),(x+dx,y+.40,1.8),(.025,.8,.45),wood,'Storage',env)
  for end,dy in enumerate([0,.80]):S.box(id+':shelf:'+str(end),(x+.15,y+dy,1.8),(.30,.025,.45),wood,'Storage',env)
  S.door(id+':door',env,(x,y,1.51),.30,.80,angle=math.pi/2,material=wood)
  locker_ids.append({'id':'sim:p3:'+id,'door_id':S.doors[-1]['id'],'assigned_to':None,'use_state':'unassigned','simulated':True})
# Small printer station outside corridor; subordinate to WC and lockers.
S.box('print:cabinet',(-4.2,-1.15,-1.8),(1.1,.8,.55),wood,'Storage','sim:PRINT')
S.box('print:printer',(-4.2,-.53,-1.8),(.65,.40,.45),ivory,'Printer','sim:PRINT')
# Fifth display belongs to lounge; four base TVs remain independent and unchanged.
source_tv=bpy.data.objects['sim:p2:TV:1:body'];source_screen=bpy.data.objects['sim:p2:TV:1:screen']
tv=S.copy('lounge:TV',source_tv,(-11.86,.25,-2.6),'sim:LOUNGE','TV')
screen=S.copy('lounge:screen',source_screen,(-11.80,.25,-2.6),'sim:LOUNGE','TVScreen')
screen.data.materials[0]=source_screen.data.materials[0].copy();screen.data.materials[0].name='Lounge independent screen';screen['content_state']='lounge-reference'
for i,p in enumerate([(-10.6,1.5,-3.2),(-8,1.5,-2),(-4.3,1.5,.7)]):S.lamp('lamp:'+str(i),'sim:LOUNGE' if i<2 else 'sim:LOCKERS',p,140)
# Reference plants use existing mesh/material family, without copying external assets.
leaf=next(o for o in bpy.data.objects if o.name.startswith('sim:p1:green-wall:leaf:'))
for i,(x,z) in enumerate([(-11.5,-5.2),(-6.9,-5.1)]):
 S.box('plant-pot:'+str(i),(x,-1.18,z),(.5,.7,.5),ivory,'Planter','sim:LOUNGE')
 for j in range(14):S.copy(f'plant:{i}:{j}',leaf,(x+math.sin(j)*.25,-.7+j*.04,z+math.cos(j)*.25),'sim:LOUNGE','Vegetation')
for name,p,target in [('phase03-general',[21,30,10],[-4,-.5,-12]),('phase03-lounge',[-7,.15,-.9],[-10,-.4,-3.7]),('phase03-booths',[-10,.1,-2],[-10,-.3,1]),('phase03-services',[-4.8,.1,-3.3],[-5.8,-.3,1.3])]:
 data=bpy.data.cameras.new('view:'+name);data.sensor_fit='VERTICAL';data.angle=math.radians(75 if name!='phase03-general' else 55);data.clip_end=200
 o=bpy.data.objects.new('view:'+name,data);scene.collection.objects.link(o);o.location=to_blender(p);o.rotation_euler=(Vector(to_blender(target))-o.location).to_track_quat('-Z','Y').to_euler()
scene.camera=bpy.data.objects['view:phase03-general'];scene.frame_set(1)
for o in bpy.data.objects:
 if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=True;o.hide_set(True)
base=read(OUTPUT/'phase02-inventory.json');base['source_master']=str(source.relative_to(ROOT));base['source_master_sha256']=h
base['security_group']=['sim:p2:door:security','sim:p3:security:raised'];base['architecture_C']=cfg;base['doors']+=S.doors;base['partitions']+=S.panels;base['lockers']=locker_ids
base['televisions'].append({'id':tv.name,'screen_id':screen.name,'environment_id':'sim:LOUNGE','material':screen.data.materials[0].name,'state':'lounge-reference'})
base['layout']['target_points'].update(cfg['targets'])
base['objects'] += [{'id':o.name,'type':o['semantic_type'],'environment_id':o['environment_id'],'position_source':list(to_source(o.matrix_world.translation))} for o in S.objects]
base['input_hashes']={str(p.relative_to(ROOT)):sha256(p) for p in [HERE/'build-phase03.py',HERE/'studio.py',HERE/'phase03-layout.json',HERE/'doors.py']}
bpy.context.preferences.filepaths.save_version=0;master=OUTPUT/'office-phase03.blend';bpy.ops.wm.save_as_mainfile(filepath=str(master),compress=True)
base['master_sha256']=sha256(master);write(OUTPUT/'phase03-inventory.json',base)
assert sha256(source)==h and not protected_changes()
print('PHASE03_C_BUILT',len(S.objects),'new objects',len(base['doors']),'total doors')
