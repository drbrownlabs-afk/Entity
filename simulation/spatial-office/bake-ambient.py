"""Static contact occlusion only. Movable doors and all artificial lighting are excluded.
The shared world-projected UV1 atlas preserves the original albedo/normal UV0.
"""
import bpy
from mathutils import Vector
from common import HERE,sha256

def bake_ambient():
    scene=bpy.context.scene;floor_objects=[o for o in scene.objects if o.type=='MESH' and o.get('semantic_type') in {'Floor','Ramp'}]
    cache=HERE/'.runtime/material-transfer/static-floor-contact.png';vs=[];faces=[]
    def uv(p):return ((p.x+12.5)/17, (p.y+3)/32)
    for o in floor_objects:
        offset=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices)
        faces.extend([[i+offset for i in p.vertices] for p in o.data.polygons if (o.matrix_world.to_3x3()@p.normal).z>.2])
        layer=o.data.uv_layers.get('StaticContactUV') or o.data.uv_layers.new(name='StaticContactUV')
        for loop in o.data.loops:layer.data[loop.index].uv=uv(o.matrix_world@o.data.vertices[loop.vertex_index].co)
    if cache.exists():image=bpy.data.images.load(str(cache),check_existing=True)
    else:
        original=[(o,o.hide_render) for o in scene.objects]
        for o,_ in original:
            if o in floor_objects or o.get('semantic_type') in ['DoorLeaf','DoorHardware','DoorHandle','DoorCollider']:o.hide_render=True
        mesh=bpy.data.meshes.new('static-floor-bake');mesh.from_pydata(vs,[],faces);mesh.update();obj=bpy.data.objects.new('temporary static floor contact bake',mesh);scene.collection.objects.link(obj);layer=mesh.uv_layers.new(name='ContactUV')
        for loop in mesh.loops:layer.data[loop.index].uv=uv(mesh.vertices[loop.vertex_index].co)
        mat=bpy.data.materials.new('temporary contact bake');mat.use_nodes=True;mesh.materials.append(mat);image=bpy.data.images.new('Static floor contact occlusion',width=1024,height=2048,alpha=False);image.colorspace_settings.name='Non-Color';node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;mat.node_tree.nodes.active=node
        bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj;scene.render.engine='CYCLES';scene.cycles.samples=16
        if hasattr(scene.world,'light_settings'):scene.world.light_settings.distance=.65
        bpy.ops.object.bake(type='AO',margin=8);image.filepath_raw=str(cache);image.file_format='PNG';image.save();bpy.data.objects.remove(obj,do_unlink=True)
        for o,hidden in original:o.hide_render=hidden
    # Standard glTF exporter occlusion hook, separate from diffuse and emission.
    group=bpy.data.node_groups.new('glTF Material Output','ShaderNodeTree');group.interface.new_socket(name='Occlusion',in_out='INPUT',socket_type='NodeSocketFloat');group.nodes.new('NodeGroupInput')
    materials=set(m for o in floor_objects for m in o.data.materials if m and m.use_nodes)
    for mat in materials:
        ns=mat.node_tree.nodes;links=mat.node_tree.links;g=ns.new('ShaderNodeGroup');g.node_tree=group;tex=ns.new('ShaderNodeTexImage');tex.image=image;mapping=ns.new('ShaderNodeUVMap');mapping.uv_map='StaticContactUV';links.new(mapping.outputs['UV'],tex.inputs['Vector']);links.new(tex.outputs['Color'],g.inputs['Occlusion'])
    return {'kind':'static contact ambient occlusion','resolution':[1024,2048],'sha256':sha256(cache),'floor_objects':len(floor_objects),'cycles_samples':16,'distance':.65,'mutable_lights_baked':False,'movable_doors_included':False,'note':'No baked direct artificial light; OFF and dynamic daylight remain functional. UV1 does not replace approved material UV0.'}
