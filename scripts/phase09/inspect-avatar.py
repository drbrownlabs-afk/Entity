import bpy,json,sys
from pathlib import Path
source=Path(sys.argv[sys.argv.index('--')+1])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=str(source))
print('AVATAR_INSPECTION',json.dumps([{'name':o.name,'kind':o.type,'vertices':len(o.data.vertices) if o.type=='MESH' else None,'bones':len(o.data.bones) if o.type=='ARMATURE' else None,'bounds':[list(p) for p in o.bound_box][:2] if o.type=='MESH' else None,'materials':[m.name for m in o.data.materials] if o.type=='MESH' else None} for o in bpy.context.scene.objects]))
print('ACTIONS',[(a.name,a.frame_range[:]) for a in bpy.data.actions])
print('IMAGES',[(i.name,i.filepath) for i in bpy.data.images])
