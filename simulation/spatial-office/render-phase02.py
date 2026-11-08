"""Render only after geometry gate succeeds; do not save temporary camera/frame changes."""
import sys
from pathlib import Path
import bpy
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import OUTPUT,HANDOFF,read,write,sha256
E=HANDOFF/'evidence/phase02';master=OUTPUT/'office-phase02.blend'
report=read(E/'summary.json');assert report['passed'] and report['master_sha256']==sha256(master)
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene;scene.frame_set(31)
records=[]
for view in ['phase02-plan','phase02-general','phase02-interior','phase02-E']:
 scene.camera=bpy.data.objects['view:'+view];top=view in ['phase02-plan','phase02-general']
 for o in bpy.data.objects:
  if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=top
 scene.render.image_settings.file_format='PNG'
 scene.render.resolution_x=1100 if view=='phase02-plan' else 1400
 scene.render.resolution_y=1500 if view=='phase02-plan' else 900
 scene.render.filepath=str(E/(view+'.png'));bpy.ops.render.render(write_still=True)
 records.append({'view':view,'frame':31,'doors':'open','path':view+'.png','sha256':sha256(E/(view+'.png')),'master_sha256':sha256(master),'engine':'Cycles CPU','samples':scene.cycles.samples})
 write(E/'renders.json',records)
print('PHASE02_RENDERS_DONE',len(records))
