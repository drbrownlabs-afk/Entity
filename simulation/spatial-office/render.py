"""Produce actual Cycles images from the saved master, using named source cameras."""
import sys
from pathlib import Path
import bpy

sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import EVIDENCE, OUTPUT, sha256, write

bpy.ops.wm.open_mainfile(filepath=str(OUTPUT/'office-phase01.blend'))
scene=bpy.context.scene
scene.render.image_settings.file_format='PNG'
views=['dollhouse','plan','annotation:0','annotation:1','annotation:2','wall-from-a','wall-from-b','table-c-seats','table-d-seats','original-plan-near-clipped']
requested=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else views
records=[]
for name in requested:
    assert name in views,name
    scene.camera=bpy.data.objects['view:'+name]
    top_view=name in ['dollhouse','plan','table-c-seats','table-d-seats','original-plan-near-clipped']
    for obj in bpy.data.objects:
        if obj.get('semantic_type') in ['Ceiling','CeilingDetail']:
            obj.hide_render=top_view
    # Keep measured camera intrinsics, including portrait survey aspect ratio.
    portrait=name in ['table-c-seats','table-d-seats','original-plan-near-clipped']
    scene.render.resolution_x=1060 if portrait else 1200
    scene.render.resolution_y=850 if portrait else 780
    filename=name.replace(':','-')+'.png'
    scene.render.filepath=str(EVIDENCE/filename)
    bpy.ops.render.render(write_still=True)
    records.append({'view':name,'path':filename,'sha256':sha256(EVIDENCE/filename),'engine':scene.render.engine,'samples':scene.cycles.samples,'source_blend_sha256':sha256(OUTPUT/'office-phase01.blend'),'ceiling_cutaway':top_view})
    write(EVIDENCE/'renders.json',records)
print('RENDERS_DONE',len(records))
