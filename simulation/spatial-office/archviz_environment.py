"""Thin visual adapter: existing clock/circuit controls plus a physical procedural sky.

The Phase04 controller is preserved. No business clock, new runtime or Core writes.
"""
import math
import bpy
import environment as _base
from environment import *
from common import HERE,read
DESIGN=read(HERE/'archviz-lighting.json')

_original_apply=getattr(_base,'_archviz_original_apply',_base.apply)
_base._archviz_original_apply=_original_apply

def apply():
    _original_apply()
    scene=bpy.context.scene
    if not scene.get('archviz_revision'):return
    sky=scene.world.node_tree.nodes.get('Archviz daylight')
    if sky:
        elevation=math.radians(float(scene['solar_elevation']))
        sky.sun_elevation=max(-.05,elevation)
        sky.sun_rotation=math.radians(float(scene['solar_azimuth']))
        # Match one clock, with no fixed artificial-light bake.
        daylight=max(0,math.sin(elevation))
        scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.001+DESIGN['sky_strength_day']*daylight
        scene.view_settings.exposure=DESIGN['exposure']
        context=scene.world.node_tree.nodes.get('Archviz context')
        if context:context.inputs['Strength'].default_value=.001+daylight*DESIGN['photographic_context_strength_day']
    daylight=min(1,max(0,math.sin(math.radians(float(scene['solar_elevation']))))/.65)
    for light in lights():
        palette=DESIGN[light.get('archviz_role','task')]
        effective=float(light['level'])*(1-(1-palette['daylight_minimum'])*daylight if light['mode']=='auto' else 1) if light['on'] else 0
        light.data.energy=light['nominal_power']*effective
        if light.get('emitter_material') and light['nominal_power']:
            m=bpy.data.materials.get(light['emitter_material'])
            if m:
                m.node_tree.nodes.get('Principled BSDF').inputs['Emission Strength'].default_value=palette['emitter_radiance']*effective
    bpy.context.view_layer.update()

_base.apply=apply
