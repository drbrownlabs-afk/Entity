"""Blender-local simulated door controls. No physical access or Core integration."""
import math
import bpy

def query(id):
 o=bpy.data.objects[id]
 fraction=o.rotation_euler.z/o['open_angle']
 return {'id':id,'locked':bool(o['locked']),'open_fraction':round(fraction,5),'status':'closed' if abs(fraction)<1e-4 else 'open' if abs(fraction-1)<1e-4 else 'transition','simulated':True}

def command(id,operation,frames=30):
 o=bpy.data.objects[id]
 if o.get('semantic_type')!='DoorPivot':raise ValueError('Not a declared door')
 if operation=='lock':
  if query(id)['status']!='closed':raise ValueError('Close door before locking')
  o.animation_data_clear()
  o['locked']=True
 elif operation=='unlock':o['locked']=False
 elif operation in ['open','close']:
  if operation=='open' and o['locked']:raise PermissionError('Simulated door is locked')
  frame=bpy.context.scene.frame_current
  o.keyframe_insert('rotation_euler',frame=frame)
  o.rotation_euler.z=o['open_angle'] if operation=='open' else 0
  o.keyframe_insert('rotation_euler',frame=frame+frames)
  bpy.context.scene.frame_set(frame)
 else:raise ValueError('Unsupported operation')
 return query(id)
