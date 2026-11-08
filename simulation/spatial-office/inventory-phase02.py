"""Complete pose catalog of the saved master, including inherited objects and their provenance."""
import sys
from pathlib import Path
import bpy
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import OUTPUT,write,sha256,to_source
phase=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else '02'
assert phase in ['02','03','04']
master=OUTPUT/('office-phase'+phase+'.blend');bpy.ops.wm.open_mainfile(filepath=str(master));bpy.context.scene.frame_set(1);bpy.context.view_layer.update()
records=[]
for o in bpy.data.objects:
 records.append({'id':o.get('stable_id',o.name),'blender_name':o.name,'type':o.get('semantic_type',o.type),'environment_id':o.get('environment_id','render-reference'),'parent_id':o.parent.get('stable_id',o.parent.name) if o.parent else None,'geometry_origin':o.get('geometry_origin','inspection/render reference'),'source_provenance_position':list(o['source_position']) if 'source_position' in o else None,'current_source_position':list(to_source(o.matrix_world.translation)),'world_matrix_blender':[list(row) for row in o.matrix_world],'materials':[m.name for m in o.data.materials] if o.type=='MESH' else [],'coordinate_note':'original metadata preserved as provenance; current pose is the world matrix at frame1 (doors closed)'})
write(OUTPUT/('phase'+phase+'-full-inventory.json'),{'master_sha256':sha256(master),'frame':1,'records':records,'note':'Includes inherited geometry, moved estimated waiting/storage furniture, source references, doors, inspection cameras and nonoperational reference lights. No Core entities created.'})
print('FULL_INVENTORY',len(records))
