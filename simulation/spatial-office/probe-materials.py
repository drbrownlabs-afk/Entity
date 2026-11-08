"""Isolated swatch roundtrip, not a final architectural export or PlayCanvas implementation."""
import sys
from pathlib import Path
import bpy
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import OUTPUT,HANDOFF,write,sha256
master=OUTPUT/'office-phase04.blend';h=sha256(master);bpy.ops.wm.open_mainfile(filepath=str(master))
mat_names=['Terrazzo warm - procedural reference','Phase02 clear partitions','Cafe warm oak','Sand upholstery','Graphite powder coat']
source={}
for name in mat_names:
 m=bpy.data.materials[name];n=m.node_tree.nodes.get('Principled BSDF');source[name]={'base_color':list(n.inputs['Base Color'].default_value),'roughness':n.inputs['Roughness'].default_value,'metallic':n.inputs['Metallic'].default_value,'transmission':n.inputs['Transmission Weight'].default_value,'image_texture':any(x.type=='TEX_IMAGE' and x.image for x in m.node_tree.nodes)}
# No building geometry included: only five material sample cubes selected.
bpy.ops.object.select_all(action='DESELECT')
for i,name in enumerate(mat_names):
 bpy.ops.mesh.primitive_cube_add(size=1,location=(i*2,0,0));o=bpy.context.object;o.name='material-probe:'+str(i);o.data.materials.append(bpy.data.materials[name])
for o in bpy.data.objects:o.select_set(o.name.startswith('material-probe:'))
path=OUTPUT/'pbr-transfer-probe.glb'
bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_extras=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(path))
results=[]
for name,p in source.items():
 m=bpy.data.materials.get(name);assert m is not None,name;n=m.node_tree.nodes.get('Principled BSDF')
 actual={'roughness':n.inputs['Roughness'].default_value,'metallic':n.inputs['Metallic'].default_value,'transmission':n.inputs['Transmission Weight'].default_value,'image_texture':any(x.type=='TEX_IMAGE' and x.image for x in m.node_tree.nodes)}
 assert abs(actual['roughness']-p['roughness'])<.01,(name,p,actual)
 assert abs(actual['metallic']-p['metallic'])<.01,(name,p,actual)
 assert abs(actual['transmission']-p['transmission'])<.01,(name,p,actual)
 if name=='Terrazzo warm - procedural reference':assert actual['image_texture']
 results.append({'name':name,'source':p,'reimported':actual,'passed':True})
assert sha256(master)==h
write(HANDOFF/'evidence/phase04/material-probe.json',{'scope':'five isolated swatches; no architectural scene export or browser','master_unchanged':True,'master_sha256':h,'probe_sha256':sha256(path),'results':results,'limitations':'Probe verifies material fields and packed texture presence, not PlayCanvas visual equivalence or full-scene export. Final export explicitly waits for operator approval.'})
print('MATERIAL_PROBE_PASS',len(results))
