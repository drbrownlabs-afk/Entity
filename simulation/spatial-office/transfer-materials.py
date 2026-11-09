"""Bake unsupported Cycles material detail only; never bake switchable illumination.
Material cube atlases retain the approved generated-coordinate noise in glTF PBR.
"""
from pathlib import Path
import bpy
from mathutils import Vector
from common import HERE

def transfer_materials():
    scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=1
    cache=HERE/'.runtime/material-transfer';cache.mkdir(parents=True,exist_ok=True)
    reports=[]
    # Only local procedural finishes. Professional photographed materials retain original UV maps.
    materials=[m for m in bpy.data.materials if m.use_nodes and any(n.type=='TEX_NOISE' for n in m.node_tree.nodes) and not any(n.type=='TEX_IMAGE' for n in m.node_tree.nodes)]
    original_objects=list(scene.objects)
    for m in materials:
        ns=m.node_tree.nodes;links=m.node_tree.links;p=next((n for n in ns if n.type=='BSDF_PRINCIPLED'),None)
        if not p:continue
        source=p.inputs['Base Color'];normal=p.inputs['Normal'];has_color=source.is_linked;has_bump=normal.is_linked
        if not has_color and not has_bump:continue
        # Linked generated material used on original geometry; atlas transfers its 3D unit-cube domain.
        bpy.ops.object.select_all(action='DESELECT');bpy.ops.mesh.primitive_cube_add(size=1,location=(100,100,100));cube=bpy.context.object;cube.name='temporary material transfer';cube.data.materials.clear();cube.data.materials.append(m)
        # Stable face-domain atlas maps every surface to a corresponding generated-coordinate cube face.
        uv=cube.data.uv_layers.active
        def atlas(co,normal,lo,hi):
            q=[(co[i]-lo[i])/max(hi[i]-lo[i],1e-8) for i in range(3)];axis=max(range(3),key=lambda i:abs(normal[i]));side=int(normal[axis]>0);tile=axis*2+side
            if axis==0:u,v=q[1],q[2]
            elif axis==1:u,v=q[0],q[2]
            else:u,v=q[0],q[1]
            return ((tile%3+(u*.96+.02))/3,(tile//3+(v*.96+.02))/2)
        for face in cube.data.polygons:
            for i in face.loop_indices:uv.data[i].uv=atlas(cube.data.vertices[cube.data.loops[i].vertex_index].co,face.normal,[-.5]*3,[.5]*3)
        out=next(n for n in ns if n.type=='OUTPUT_MATERIAL');previous=out.inputs['Surface'].links[0].from_socket
        material_files={}
        for kind in ['albedo','normal']:
            if kind=='albedo' and not has_color:continue
            if kind=='normal' and not has_bump:continue
            path=cache/(m.name.replace('/','_')+'-'+kind+'.png')
            if path.exists():image=bpy.data.images.load(str(path),check_existing=True)
            else:
                image=bpy.data.images.new(m.name+' '+kind,width=1024,height=1024,alpha=False);image.colorspace_settings.name='sRGB' if kind=='albedo' else 'Non-Color'
                node=ns.new('ShaderNodeTexImage');node.image=image;ns.active=node
                if kind=='albedo':
                    emission=ns.new('ShaderNodeEmission');links.new(source.links[0].from_socket,emission.inputs['Color']);links.new(emission.outputs[0],out.inputs['Surface']);bpy.ops.object.bake(type='EMIT',margin=8);ns.remove(emission);links.new(previous,out.inputs['Surface'])
                else:bpy.ops.object.bake(type='NORMAL',normal_space='TANGENT',margin=8)
                image.filepath_raw=str(path);image.file_format='PNG';image.save();ns.remove(node)
            material_files[kind]=image
        bpy.data.objects.remove(cube,do_unlink=True)
        for o in original_objects:
            if o.type!='MESH' or not any(x==m for x in o.data.materials):continue
            if not o.data.uv_layers:uv=o.data.uv_layers.new(name='Material transfer UV')
            else:uv=o.data.uv_layers.active
            lo=[min(v.co[i] for v in o.data.vertices) for i in range(3)];hi=[max(v.co[i] for v in o.data.vertices) for i in range(3)]
            for face in o.data.polygons:
                for i in face.loop_indices:uv.data[i].uv=atlas(o.data.vertices[o.data.loops[i].vertex_index].co,face.normal,lo,hi)
        for kind,image in material_files.items():
            tex=ns.new('ShaderNodeTexImage');tex.image=image
            if kind=='albedo':links.new(tex.outputs['Color'],source)
            else:
                node=ns.new('ShaderNodeNormalMap');links.new(tex.outputs['Color'],node.inputs['Color']);links.new(node.outputs['Normal'],normal)
        reports.append({'material':m.name,'maps':list(material_files),'resolution':1024,'baked_illumination':False,'method':'approved generated-coordinate material sampled on six-face unit cube atlas; fitted to each object'})
    # Cycles recolors of photographed planters use RGBToBW + ColorRamp, which glTF cannot express.
    # Bake the mapped albedo in UV space; keep source normal/roughness/occlusion textures and UVs.
    for m in list(bpy.data.materials):
        if not m.name.startswith('R1 concrete planter finish') or not m.use_nodes:continue
        ns=m.node_tree.nodes;links=m.node_tree.links;p=ns.get('Principled BSDF');source=p.inputs['Base Color']
        if not source.is_linked:continue
        path=cache/'concrete-planter-UV-albedo.png'
        if path.exists():image=bpy.data.images.load(str(path),check_existing=True)
        else:
            bpy.ops.object.select_all(action='DESELECT');bpy.ops.mesh.primitive_plane_add(size=2,location=(100,100,100));obj=bpy.context.object;obj.data.materials.append(m)
            image=bpy.data.images.new('Concrete planter mapped albedo',width=1024,height=1024,alpha=False)
            tex=ns.new('ShaderNodeTexImage');tex.image=image;ns.active=tex
            out=next(n for n in ns if n.type=='OUTPUT_MATERIAL');previous=out.inputs['Surface'].links[0].from_socket
            emission=ns.new('ShaderNodeEmission');links.new(source.links[0].from_socket,emission.inputs['Color']);links.new(emission.outputs[0],out.inputs['Surface'])
            bpy.ops.object.bake(type='EMIT',margin=8);image.filepath_raw=str(path);image.file_format='PNG';image.save()
            ns.remove(emission);ns.remove(tex);links.new(previous,out.inputs['Surface']);bpy.data.objects.remove(obj,do_unlink=True)
        tex=ns.new('ShaderNodeTexImage');tex.image=image;links.new(tex.outputs['Color'],source)
        reports.append({'material':m.name,'maps':['mapped albedo'],'resolution':1024,'baked_illumination':False,'method':'original UV shader albedo; preserves approved neutral concrete recolor'})
    return reports
