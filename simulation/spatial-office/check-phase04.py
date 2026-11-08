"""Runtime checks in Blender: clock, circuits, individual dimming, recovery, solar config and UI registration."""
import sys,math,json,copy
from pathlib import Path
import bpy
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import ROOT,HERE,OUTPUT,HANDOFF,read,write,sha256,protected_changes
import environment as env
from solar import angles
from doors import command,query
E=HANDOFF/'evidence/phase04';master=OUTPUT/'office-phase04.blend';manifest=read(OUTPUT/'device-manifest.json')
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene
checks=[]
def check(name,ok,detail=None):
 checks.append({'name':name,'passed':bool(ok),'detail':detail});write(E/'checks.json',{'checks':checks,'passed':all(x['passed'] for x in checks),'master_sha256':sha256(master),'human_approval':False});assert ok,(name,detail)
def reject(name,fn):
 try:fn();failed=False
 except (ValueError,PermissionError,KeyError):failed=True
 check(name,failed)
check('master-current',sha256(master)==manifest['master_sha256'])
check('source-phase03-intact',sha256(OUTPUT/'office-phase03.blend')==manifest['source_master_sha256'])
check('source-data-and-upstream-plan-intact',not protected_changes())
check('inputs-current',all(sha256(ROOT/p)==h for p,h in manifest['input_hashes'].items()))
ids=[x['id'] for x in manifest['luminaires']];check('luminaire-ids-unique',len(ids)==len(set(ids)))
check('all-real-lights-declared',{o.name for o in env.lights()}==set(ids))
check('no-immutable-reference-lights',all(o.get('controlled_luminaire') or o.name=='sim:p4:sun' for o in bpy.data.objects if o.type=='LIGHT'))
required={'A','B','C','D','sim:ROOM-E','MEETING-AREA-01','RECEPTION','WAITING-AREA','sim:CAFE-01','sim:RECREATION','CIRCULATION-01','sim:LOUNGE','sim:CALL-01','sim:CALL-02','sim:WC','sim:LOCKERS','sim:PRINT'}
check('all-environment-circuits',required<=set(manifest['circuits']))
flat=[id for ids2 in manifest['circuits'].values() for id in ids2];check('one-circuit-per-luminaire',len(flat)==len(set(flat)) and set(flat)==set(ids))
initial=env.state();check('initial-clock',initial['clock']=={'hour':12.0,'speed':60,'playing':False})
# Independent command and actual visual energy/material state, for EVERY fixture.
for id in ids:
 other={o.name:o.data.energy for o in env.lights() if o.name!=id}
 env.light_set(id,on=False,mode='manual');o=bpy.data.objects[id]
 check('individual-off:'+id,o.data.energy==0 and bpy.data.materials[o['emitter_material']].node_tree.nodes.get('Principled BSDF').inputs['Emission Strength'].default_value==0)
 check('other-lights-unchanged:'+id,all(abs(bpy.data.objects[k].data.energy-v)<1e-5 for k,v in other.items()))
 env.light_set(id,on=True,level=.5);check('individual-dim:'+id,abs(o.data.energy-o['nominal_power']*.5)<1e-4)
 env.light_set(id,on=True,level=1)
for zone,zone_ids in manifest['circuits'].items():
 env.circuit_set(zone,on=False);check('circuit-off:'+zone,all(bpy.data.objects[id].data.energy==0 for id in zone_ids))
 env.circuit_set(zone,on=True,level=.4);check('circuit-dim:'+zone,all(abs(bpy.data.objects[id].data.energy-bpy.data.objects[id]['nominal_power']*.4)<1e-4 for id in zone_ids))
 env.circuit_set(zone,on=True,level=1)
reject('unknown-device-denied',lambda:env.light_set('real-device-not-declared',on=True))
reject('invalid-level-denied',lambda:env.light_set(ids[0],level=2))
reject('nonfinite-level-denied',lambda:env.light_set(ids[0],level=float('nan')))
reject('invalid-on-type-denied',lambda:env.light_set(ids[0],on='yes'))
reject('unknown-circuit-denied',lambda:env.circuit_set('unknown',on=False))
reject('invalid-clock-denied',lambda:env.set_hour(float('nan')))
reject('boolean-speed-denied',lambda:env.play(True))
# Pause, forward, reverse, wrap and direct scrub. No source of real observations exists here.
for speed in env.CFG['clock']['speeds']:
 env.set_hour(12);env.play(speed);env.advance(10);expected=(12+speed*10/3600)%24
 check('speed:'+str(speed),abs(scene['simulation_hour']-expected)<1e-7)
env.pause();h=scene['simulation_hour'];env.advance(100);check('pause-stops-clock',scene['simulation_hour']==h)
env.set_hour(23.99);env.play(360);env.advance(1);check('forward-wrap',abs(scene['simulation_hour']-.09)<1e-6)
env.set_hour(.01);env.play(-360);env.advance(1);check('reverse-wrap',abs(scene['simulation_hour']-23.91)<1e-6);env.pause()
for h in [0,8,12,16,20,23.999]:env.set_hour(h);check('scrub:'+str(h),abs(scene['simulation_hour']-h)<1e-6)
# Time reversal must reproduce exactly the same derived state, not accumulated interpolation drift.
env.set_hour(8);first=(scene['solar_elevation'],scene['solar_azimuth'],bpy.data.objects['sim:p4:sun'].data.energy)
env.set_hour(20);env.set_hour(8);second=(scene['solar_elevation'],scene['solar_azimuth'],bpy.data.objects['sim:p4:sun'].data.energy)
check('reversal-restores-sun',first==second)
prev=None
for i in range(241):
 h=(i/10)%24;a=angles(h,env.CFG)
 if prev is not None:check('continuous-elevation:'+str(i),abs(a[0]-prev[0])<3)
 prev=a
# Real astronomy package exercised with a synthetic observer fixture ONLY; not building coordinates.
cfg=copy.deepcopy(env.CFG);cfg['solar'].update(latitude=0,longitude=0,date='2026-11-08',timezone='UTC')
morning=angles(8,cfg);noon=angles(12,cfg);night=angles(20,cfg)
check('astral-observer-operates',noon[0]>morning[0]>night[0] and night[0]<0)
changed=copy.deepcopy(cfg);changed['solar']['latitude']=45;check('latitude-changes-trajectory',abs(angles(12,changed)[0]-noon[0])>1)
changed=copy.deepcopy(cfg);changed['solar']['date']='2026-06-21';check('date-changes-trajectory',angles(12,changed)!=noon)
changed=copy.deepcopy(cfg);changed['solar']['north_rotation_degrees']=30;check('orientation-configurable',abs(angles(12,changed)[1]-noon[1]-30)<1e-6)
check('building-location-not-invented',env.CFG['solar']['latitude'] is None and env.CFG['solar']['longitude'] is None)
# Snapshot reload restores all device levels/overrides and hour, intentionally resumes paused.
env.set_hour(20);env.light_set(ids[0],on=False);snap=json.loads(json.dumps(env.state()))
env.set_hour(12);env.light_set(ids[0],on=True);restored=env.restore(snap)
check('state-recovery',restored['lights']==snap['lights'] and restored['clock']['hour']==snap['clock']['hour'] and restored['clock']['speed']==snap['clock']['speed'] and not restored['clock']['playing'])
bad=copy.deepcopy(snap);bad['clock']['hour']=True;before=env.state();reject('invalid-snapshot-atomic',lambda:env.restore(bad));check('failed-restore-no-change',env.state()==before)
# Embedded data recovery and real panel/operators registered in Blender (no GUI walk-through claimed).
env.register();scene.entity_visual_hour=16;check('UI-hour-updates-state',scene['simulation_hour']==16)
check('UI-panel-registered',hasattr(bpy.types,'ENTITY_PT_visual'))
scene.entity_visual_zone='A';before=bpy.data.objects[manifest['circuits']['A'][0]].data.energy
bpy.ops.entity.visual_light(action='off');check('UI-circuit-command',all(bpy.data.objects[id].data.energy==0 for id in manifest['circuits']['A']))
scene.entity_visual_door=manifest['doors'][0]['id'];bpy.ops.entity.visual_door(action='close');bpy.ops.entity.visual_door(action='open');check('UI-door-command',query(scene.entity_visual_door)['status']=='open')
bpy.ops.entity.visual_door(action='close');bpy.ops.entity.visual_door(action='lock');check('UI-door-lock',query(scene.entity_visual_door)['locked'])
# Opening a saved master resets volatile mutations, preserving declared initial state.
bpy.ops.wm.open_mainfile(filepath=str(master));env.apply();check('saved-state-recovery',env.state()==initial)
check('albedo-only-packed-texture',bpy.data.images.get('ENTITY terrazzo albedo') is not None and bpy.data.images['ENTITY terrazzo albedo'].packed_file is not None)
write(E/'summary.json',{'passed':True,'checks':len(checks),'luminaires':len(ids),'circuits':len(manifest['circuits']),'master_sha256':sha256(master),'physical_devices_tested':False,'PlayCanvas_started':False,'human_approval':False,'building_location_known':False,'dependency':'Astral 3.2, hash-verified pure Python'})
print('PHASE04_CHECKS_PASS',len(checks),len(ids),'lights',len(manifest['circuits']),'circuits')
