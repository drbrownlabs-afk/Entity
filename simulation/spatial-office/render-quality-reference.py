"""Golden Hour reference from approved master, unsaved derived scene only."""
import bpy,sys,math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import OUTPUT,HANDOFF,sha256,write,to_source
import archviz_environment as env
master=OUTPUT/'office-phase04-revision.blend';digest=sha256(master);bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene;env.set_hour(17);env.pause();scene.frame_set(31)
for o in scene.objects:
 if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=False
scene.camera=bpy.data.objects['view:revision-lounge'];scene.render.resolution_x=1440;scene.render.resolution_y=960;scene.render.resolution_percentage=100;scene.cycles.samples=96
folder=HANDOFF/'evidence/phase04-5';folder.mkdir(parents=True,exist_ok=True)
write(folder/'blender-conditions.json',{'hour':17,'master_sha256':digest,'camera':scene.camera.name,'position':list(to_source(scene.camera.location)),'fov':math.degrees(scene.camera.data.angle),'exposure_EV':scene.view_settings.exposure,'state':env.state(),'resolution':[1440,960]})
scene.render.filepath=str(folder/'blender-lounge-17.png');bpy.ops.render.render(write_still=True);assert sha256(master)==digest
write(folder/'blender-capture.json',{'master_preserved':True,'sha256':sha256(folder/'blender-lounge-17.png'),'samples':96})
