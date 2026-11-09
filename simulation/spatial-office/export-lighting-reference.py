"""Export the actual Golden Hour source state, without altering/saving the master."""
import sys,math
from pathlib import Path
import bpy
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import OUTPUT,HANDOFF,write,sha256,to_source
import archviz_environment as env
master=OUTPUT/'office-phase04-revision.blend';digest=sha256(master);bpy.ops.wm.open_mainfile(filepath=str(master));env.set_hour(17);env.pause();scene=bpy.context.scene
lights=[]
for o in env.lights():
 lights.append({'id':o.name,'environment':o['environment_id'],'type':o.data.type,'shape':o.data.shape,'size':o.data.size,'size_y':o.data.size_y,'matrix_blender':[list(r)for r in o.matrix_world],'position':list(to_source(o.matrix_world.translation)),'rgb_linear':list(o.data.color),'nominal_power_W':o['nominal_power'],'effective_power_W':o.data.energy,'state':env.state()['lights'][o.name],'conversion_status':'radiometric source; not equivalent to PlayCanvas intensity without calibration or a source-separated baked basis'})
camera=scene.objects['view:revision-lounge'];sun=scene.objects['sim:p4:sun']
data={'master_sha256':digest,'hour':17,'clock':env.state()['clock'],'exposure_EV':scene.view_settings.exposure,'exposure_linear':2**scene.view_settings.exposure,'view_transform':scene.view_settings.view_transform,'look':scene.view_settings.look,'lights':lights,'sun':{'matrix_blender':[list(r)for r in sun.matrix_world],'energy':sun.data.energy,'rgb_linear':list(sun.data.color)},'world_background_strengths':{n.name:n.inputs['Strength'].default_value for n in scene.world.node_tree.nodes if n.type=='BACKGROUND'},'camera':{'id':camera.name,'position':list(to_source(camera.location)),'matrix_blender':[list(r)for r in camera.matrix_world],'vertical_fov_degrees':math.degrees(camera.data.angle_y)},'runtime_equivalence_verified':False,'forbidden_assumptions':['Blender watts equal PlayCanvas intensity','Noon irradiance equals Golden Hour irradiance','Circuit average proves individual spatial response']}
assert sha256(master)==digest
write(Path(__file__).resolve().parent/'lighting-reference-17.json',data);write(HANDOFF/'evidence/phase04-5/shared-lighting-source.json',data);print('GOLDEN_SOURCE_EXPORTED',len(lights),'lights; master unchanged')
