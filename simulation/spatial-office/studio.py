"""Thin Blender composition helpers shared by architecture and lighting stages; no simulation engine."""
import math,bpy
from mathutils import Vector
from common import to_blender,to_source
class Studio:
 def __init__(self,prefix):
  self.prefix=prefix;self.objects=[];self.doors=[];self.panels=[]
  self.collection=bpy.data.collections.new(prefix);bpy.context.scene.collection.children.link(self.collection)
 def reg(self,o,id,kind,env):
  o.name=self.prefix+id
  for c in list(o.users_collection):c.objects.unlink(o)
  self.collection.objects.link(o)
  for k,v in {'stable_id':o.name,'semantic_type':kind,'environment_id':env,'geometry_origin':'new simulation design; relative units; no certified measurements','source_position':list(to_source(o.location)),'meters_verified':False}.items():o[k]=v
  self.objects.append(o);return o
 def box(self,id,p,size,mat,kind,env,bevel=.012):
  a,b,c=size[0]/2,size[2]/2,size[1]/2
  vs=[(-a,-b,-c),(a,-b,-c),(a,b,-c),(-a,b,-c),(-a,-b,c),(a,-b,c),(a,b,c),(-a,b,c)]
  mesh=bpy.data.meshes.new(id);mesh.from_pydata(vs,[],[(3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);mesh.update()
  o=bpy.data.objects.new(id,mesh);bpy.context.scene.collection.objects.link(o);o.location=to_blender(p);mesh.materials.append(mat)
  if bevel:
   m=o.modifiers.new('Soft edges','BEVEL');m.width=bevel;m.segments=2
  return self.reg(o,id,kind,env)
 def wall(self,id,p,size,mat,env):
  o=self.box(id,p,size,mat,'Partition',env,.004);self.panels.append(o.name);return o
 def copy(self,id,source,p,env,kind):
  o=source.copy();o.data=source.data.copy();bpy.context.scene.collection.objects.link(o);o.location=to_blender(p);return self.reg(o,id,kind,env)
 def door(self,id,env,hinge,width,height=2.5,angle=-math.pi/2,material=None):
  pivot=bpy.data.objects.new(id,None);bpy.context.scene.collection.objects.link(pivot);pivot.location=to_blender(hinge);self.reg(pivot,id,'DoorPivot',env)
  pivot['locked']=False;pivot['open_angle']=angle;pivot['opening_width']=width
  center=(hinge[0]+width/2,hinge[1]+height/2,hinge[2]);black=bpy.data.materials['Graphite powder coat']
  leaf=self.box(id+':leaf',center,(width-.04,height,.035),material or black,'DoorLeaf',env,.003)
  collider=self.box(id+':collider',center,(width-.04,height,.07),black,'DoorCollider',env,0)
  for o in [leaf,collider]:p=o.location.copy();o.parent=pivot;o.location=p-pivot.location
  collider.hide_render=True;collider.hide_set(True)
  for frame,v in [(1,0),(31,angle),(61,0)]:pivot.rotation_euler.z=v;pivot.keyframe_insert('rotation_euler',frame=frame)
  self.doors.append({'id':pivot.name,'environment_id':env,'hinge_source':hinge,'width':width,'leaf_id':leaf.name,'collider_id':collider.name,'open_angle':angle,'simulated':True});return pivot
 def lamp(self,id,env,p,power=100):
  black=bpy.data.materials['Graphite powder coat'];shade=self.box(id+':fixture',p,(.75,.06,.18),black,'Luminaire',env)
  data=bpy.data.lights.new(self.prefix+id,'AREA');data.energy=power;data.size=.8;data.color=(1,.79,.56)
  o=bpy.data.objects.new(data.name,data);bpy.context.scene.collection.objects.link(o);o.location=to_blender((p[0],p[1]-.04,p[2]));self.reg(o,id+':light','LuminaireLight',env)
  o['nominal_power']=power;o['on']=True;o['level']=1.0;return o
