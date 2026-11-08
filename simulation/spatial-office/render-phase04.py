"""Approval references only. No master mutation, final architectural export or browser implementation."""
import sys,json
from pathlib import Path
import bpy
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import OUTPUT,HANDOFF,read,write,sha256,to_source
import environment as env
E=HANDOFF/'evidence/phase04';master=OUTPUT/'office-phase04.blend';summary=read(E/'summary.json')
assert summary['passed'] and summary['master_sha256']==sha256(master)
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene;initial=env.state()
records=[]
def capture(name,view,hour,cutaway=False):
 env.set_hour(hour);scene.frame_set(31);bpy.data.objects['sim:p3:WC:door'].rotation_euler.z=0
 scene.camera=bpy.data.objects['view:'+view]
 for o in bpy.data.objects:
  if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=cutaway and o.get('environment_id')!='sim:WC'
 bpy.context.view_layer.update()
 scene.render.resolution_x=1100;scene.render.resolution_y=750;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG'
 scene.render.filepath=str(E/(name+'.png'));bpy.ops.render.render(write_still=True)
 records.append({'name':name,'path':name+'.png','hour':hour,'camera':view,'camera_source_position':list(to_source(scene.camera.location)),'cutaway':cutaway,'WC_privacy_roof':True,'master_sha256':sha256(master),'sha256':sha256(E/(name+'.png')),'sun':{'elevation':scene['solar_elevation'],'azimuth':scene['solar_azimuth'],'source':scene['solar_source']},'state':env.state(),'samples':scene.cycles.samples})
 write(E/'renders.json',records)
for hour in [8,12,16,20]:
 env.restore(initial);capture('time-'+str(hour).zfill(2),'phase04-general',hour,True)
# Isolate A's artificial contribution while keeping the same sky/sun/exposure and powered screens.
for zone in read(OUTPUT/'device-manifest.json')['circuits']:env.circuit_set(zone,on=False)
env.circuit_set('A',on=True,level=1,mode='manual');capture('room-A-all-on-20','phase04-roomA',20)
env.circuit_set('A',on=False);capture('room-A-all-off-20','phase04-roomA',20)
first=read(OUTPUT/'device-manifest.json')['circuits']['A'][0];env.light_set(first,on=True,level=1);capture('room-A-one-on-20','phase04-roomA',20)
for name,view in [('lounge','phase03-lounge'),('booths','phase03-booths'),('services','phase03-services')]:
 env.restore(initial);capture(name+'-12',view,12)
assert sha256(master)==summary['master_sha256'];print('PHASE04_APPROVAL_RENDERS_DONE',len(records))
