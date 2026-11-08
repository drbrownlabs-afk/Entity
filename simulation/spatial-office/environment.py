"""One Blender-local visual clock and mutable device state. Never writes business/sensor observations."""
import math,time,json
import bpy
from mathutils import Vector
from common import HERE,read
from solar import angles
CFG=read(HERE/'lighting-config.json')
_LAST=None

def lights():return [o for o in bpy.data.objects if o.type=='LIGHT' and o.get('controlled_luminaire')]
def state():
 s=bpy.context.scene
 return {'clock':{'hour':s.get('simulation_hour',12),'speed':s.get('simulation_speed',60),'playing':bool(s.get('simulation_playing',False))},'lights':{o.name:{'on':bool(o['on']),'level':float(o['level']),'mode':o['mode']} for o in lights()},'source':'local visual simulation; not Core or observations'}
def apply():
 s=bpy.context.scene;hour=float(s.get('simulation_hour',12))%24
 elev,azi,source=angles(hour,CFG);f=max(0,math.sin(math.radians(elev)))
 sun=bpy.data.objects.get('sim:p4:sun')
 if sun:
  v=Vector((math.sin(math.radians(azi))*math.cos(math.radians(elev)),math.cos(math.radians(azi))*math.cos(math.radians(elev)),math.sin(math.radians(elev))))
  sun.rotation_euler=(-v).to_track_quat('-Z','Y').to_euler();sun.data.energy=2.5*f
  sun.data.color=(1,.68+.3*f,.42+.55*f)
 bg=s.world.node_tree.nodes['Background'];bg.inputs['Color'].default_value=(.12+.52*f,.17+.60*f,.28+.67*f,1);bg.inputs['Strength'].default_value=.025+.36*f
 s.view_settings.exposure=.6*(1-f)
 auto=1-min(1,f/.65)*.75
 for o in lights():
  effective=float(o['level'])*(1 if o['mode']=='manual' else auto) if o['on'] else 0
  o.data.energy=float(o['nominal_power'])*effective
  mat=bpy.data.materials.get(o.get('emitter_material',''))
  if mat:mat.node_tree.nodes.get('Principled BSDF').inputs['Emission Strength'].default_value=4*effective
 s['solar_source']=source;s['solar_elevation']=elev;s['solar_azimuth']=azi
 bpy.context.view_layer.update()
def set_hour(value):
 if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value):raise ValueError('Hour must be finite')
 bpy.context.scene['simulation_hour']=float(value)%24;apply();return state()['clock']
def light_set(id,on=None,level=None,mode='manual'):
 o=bpy.data.objects.get(id)
 if not o or not o.get('controlled_luminaire'):raise ValueError('Unknown luminaire')
 if on is not None and not isinstance(on,bool):raise ValueError('on must be boolean')
 if level is not None and (isinstance(level,bool) or not isinstance(level,(int,float)) or not math.isfinite(level) or not 0<=level<=1):raise ValueError('Level must be 0..1')
 if mode not in ['manual','auto']:raise ValueError('Unknown mode')
 if on is not None:o['on']=on
 if level is not None:o['level']=float(level)
 o['mode']=mode;apply();return state()['lights'][id]
def circuit_set(env,**parameters):
 ids=[o.name for o in lights() if o['environment_id']==env]
 if not ids:raise ValueError('Unknown circuit')
 for id in ids:light_set(id,**parameters)
 return {id:state()['lights'][id] for id in ids}
def play(speed=60):
 if isinstance(speed,bool) or speed not in CFG['clock']['speeds']:raise ValueError('Unsupported speed')
 s=bpy.context.scene;s['simulation_speed']=speed;s['simulation_playing']=True;return state()['clock']
def pause():bpy.context.scene['simulation_playing']=False;return state()['clock']
def advance(real_seconds):
 if not math.isfinite(real_seconds) or real_seconds<0:raise ValueError('Elapsed seconds must be nonnegative')
 s=bpy.context.scene
 if s.get('simulation_playing',False):set_hour(s['simulation_hour']+real_seconds*s['simulation_speed']/3600)
 return state()['clock']
def restore(snapshot):
 # Validate full payload before changing state; no credentials or business IDs accepted.
 if set(snapshot['lights'])!={o.name for o in lights()}:raise ValueError('Snapshot fixture set differs')
 for id,p in snapshot['lights'].items():
  if not isinstance(p['on'],bool) or not isinstance(p['level'],(int,float)) or isinstance(p['level'],bool) or not math.isfinite(p['level']) or not 0<=p['level']<=1 or p['mode'] not in ['auto','manual']:raise ValueError('Invalid snapshot state')
 speed=snapshot['clock']['speed']
 if isinstance(speed,bool) or speed not in CFG['clock']['speeds']:raise ValueError('Invalid snapshot speed')
 h=snapshot['clock']['hour']
 if isinstance(h,bool) or not isinstance(h,(int,float)) or not math.isfinite(h):raise ValueError('Invalid clock snapshot')
 for id,p in snapshot['lights'].items():
  o=bpy.data.objects[id];o['on']=p['on'];o['level']=p['level'];o['mode']=p['mode']
 bpy.context.scene['simulation_speed']=speed;set_hour(h);pause();return state()
def _tick():
 global _LAST
 if not bpy.context.scene.get('simulation_playing',False):return None
 now=time.monotonic();advance(now-_LAST if _LAST is not None else 0);_LAST=now
 for a in bpy.context.screen.areas if bpy.context.screen else []:a.tag_redraw()
 return .1
def start_timer(speed):
 global _LAST
 play(speed);_LAST=time.monotonic()
 if not bpy.app.timers.is_registered(_tick):bpy.app.timers.register(_tick,first_interval=.1)

def register():
 # Explicit opt-in from Blender text/console; no automatic execution on opening a downloaded blend.
 from bpy.props import FloatProperty,EnumProperty,StringProperty
 class ENTITY_OT_clock(bpy.types.Operator):
  bl_idname='entity.visual_clock';bl_label='Visual clock'
  action:StringProperty()
  def execute(self,context):
   if self.action=='pause':pause()
   else:start_timer(int(context.scene.entity_visual_speed))
   return {'FINISHED'}
 class ENTITY_OT_light(bpy.types.Operator):
  bl_idname='entity.visual_light';bl_label='Light control'
  target:StringProperty();action:StringProperty()
  def execute(self,context):
   if self.action=='toggle':light_set(self.target,on=not bpy.data.objects[self.target]['on'])
   else:circuit_set(context.scene.entity_visual_zone,on=self.action!='off',level=context.scene.entity_visual_level,mode='auto' if self.action=='auto' else 'manual')
   return {'FINISHED'}
 class ENTITY_OT_door(bpy.types.Operator):
  bl_idname='entity.visual_door';bl_label='Simulated door'
  action:StringProperty()
  def execute(self,context):
   from doors import command
   try:command(context.scene.entity_visual_door,self.action,frames=0)
   except (ValueError,PermissionError) as e:self.report({'WARNING'},str(e));return {'CANCELLED'}
   bpy.context.view_layer.update();return {'FINISHED'}
 class ENTITY_PT_visual(bpy.types.Panel):
  bl_label='ENTITY · visual simulation';bl_idname='ENTITY_PT_visual';bl_space_type='VIEW_3D';bl_region_type='UI';bl_category='ENTITY'
  def draw(self,context):
   l=self.layout;s=context.scene;l.label(text='Simulation · no sensor events');l.prop(s,'entity_visual_hour',slider=True);l.prop(s,'entity_visual_speed');r=l.row()
   r.operator('entity.visual_clock',text='Play').action='play';r.operator('entity.visual_clock',text='Pause').action='pause'
   l.prop(s,'entity_visual_zone');l.prop(s,'entity_visual_level',slider=True);r=l.row()
   for name,action in [('On / level','on'),('Off','off'),('Auto','auto')]:r.operator('entity.visual_light',text=name).action=action
   l.separator();l.prop(s,'entity_visual_door');r=l.row()
   for op in ['open','close','lock','unlock']:r.operator('entity.visual_door',text=op).action=op
   l.label(text='Door buttons: instant local preview')
   for o in lights():
    if o['environment_id']==s.entity_visual_zone:
     r=l.row();r.label(text=o.name.rsplit(':',1)[-1]);op=r.operator('entity.visual_light',text='ON' if o['on'] else 'OFF');op.target=o.name;op.action='toggle'
 for cls in [ENTITY_OT_clock,ENTITY_OT_light,ENTITY_OT_door,ENTITY_PT_visual]:
  old=getattr(bpy.types,cls.__name__,None)
  if old:bpy.utils.unregister_class(old)
  bpy.utils.register_class(cls)
 def ui_set_hour(s,v):set_hour(v)
 bpy.types.Scene.entity_visual_hour=FloatProperty(name='Hour 00–24',min=0,max=24,get=lambda s:float(s.get('simulation_hour',12)),set=ui_set_hour)
 bpy.types.Scene.entity_visual_speed=EnumProperty(name='Speed',items=[(str(v),str(v)+'×','') for v in CFG['clock']['speeds']],default='60')
 zones=sorted({o['environment_id'] for o in lights()})
 bpy.types.Scene.entity_visual_zone=EnumProperty(name='Circuit',items=[(v,v,'') for v in zones])
 bpy.types.Scene.entity_visual_door=EnumProperty(name='Door',items=[(o.name,o.name,'') for o in bpy.data.objects if o.get('semantic_type')=='DoorPivot'])
 bpy.types.Scene.entity_visual_level=FloatProperty(name='Group level',min=0,max=1,default=1)
 pause();apply()
