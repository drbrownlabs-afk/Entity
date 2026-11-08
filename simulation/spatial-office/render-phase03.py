"""Render only after geometry gate succeeds; do not save temporary camera/frame changes."""
import sys
from pathlib import Path
import bpy
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import OUTPUT,HANDOFF,read,write,sha256,to_blender,to_source
E=HANDOFF/'evidence/phase03';master=OUTPUT/'office-phase03.blend'
report=read(E/'summary.json');assert report['passed'] and report['master_sha256']==sha256(master)
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene;scene.frame_set(31)
views=['phase03-general','phase03-lounge','phase03-booths','phase03-services']
requested=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else views
records=[r for r in read(E/'renders.json') if r['view'] not in requested and r['master_sha256']==sha256(master)] if (E/'renders.json').exists() else []
for view in requested:
 assert view in views
 scene.camera=bpy.data.objects['view:'+view];top=view=='phase03-general'
 if view=='phase03-lounge':
  scene.camera.location=to_blender((-7.0,.15,-.9))
  scene.camera.rotation_euler=(Vector(to_blender((-10,-.4,-3.7)))-scene.camera.location).to_track_quat('-Z','Y').to_euler()
 for o in bpy.data.objects:
  if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=top
 bpy.data.objects['sim:p3:WC:door'].rotation_euler.z=0
 for o in bpy.data.objects:
  if o.get('environment_id')=='sim:WC' and o.get('semantic_type')=='Ceiling':o.hide_render=False
 scene.render.image_settings.file_format='PNG'
 scene.render.resolution_x=1200
 scene.render.resolution_y=800
 scene.render.filepath=str(E/(view+'.png'));bpy.ops.render.render(write_still=True)
 records.append({'view':view,'camera_source_position':list(to_source(scene.camera.location)),'frame':31,'doors':'open; WC closed for privacy','path':view+'.png','sha256':sha256(E/(view+'.png')),'master_sha256':sha256(master),'engine':'Cycles CPU','samples':scene.cycles.samples})
 write(E/'renders.json',records)
print('PHASE03_RENDERS_DONE',len(records))
