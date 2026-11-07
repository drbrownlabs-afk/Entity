"""Prepare Rocketbox human asset only. Never edits the Synthetic Office building/voxels."""
import bpy,sys,json
from pathlib import Path
model=Path(sys.argv[sys.argv.index('--')+1]).resolve()
output=Path(sys.argv[sys.argv.index('--')+2]).resolve()
motions=Path(sys.argv[sys.argv.index('--')+3]).resolve()
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=str(model))
arm=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE')
mesh=next(o for o in bpy.context.scene.objects if o.type=='MESH')
# FBX bitmap paths reference the original authoring machine; resolve supplied original TGAs.
textures=model.parent.parent/'Textures'
for image in bpy.data.images:
    path=textures/Path(image.filepath.replace('\\','/')).name
    if path.exists():
        image.filepath=str(path);image.reload()
        if max(image.size)>512:
            ratio=512/max(image.size);image.scale(max(1,int(image.size[0]*ratio)),max(1,int(image.size[1]*ratio)))
for material in mesh.data.materials:
    material.use_nodes=True
    tree=material.node_tree;tree.nodes.clear()
    output_node=tree.nodes.new('ShaderNodeOutputMaterial');surface=tree.nodes.new('ShaderNodeBsdfPrincipled')
    surface.inputs['Roughness'].default_value=.8
    color=textures/(material.name+'_color.tga')
    if color.exists():
        image=bpy.data.images.load(str(color),check_existing=True)
        if max(image.size)>512:
            ratio=512/max(image.size);image.scale(max(1,int(image.size[0]*ratio)),max(1,int(image.size[1]*ratio)))
        texture=tree.nodes.new('ShaderNodeTexImage');texture.image=image
        tree.links.new(texture.outputs['Color'],surface.inputs['Base Color'])
        if 'opacity' in material.name:tree.links.new(texture.outputs['Alpha'],surface.inputs['Alpha']);material.surface_render_method='DITHERED'
    tree.links.new(surface.outputs['BSDF'],output_node.inputs['Surface'])
# Reuse named rig-compatible Rocketbox motion takes; drop unsupported auxiliary bone channels.
arm.animation_data_clear()
for action in list(bpy.data.actions):bpy.data.actions.remove(action)
clips=[]
files=[('idle',motions/'m_idle_neutral_01.max.fbx'),('seated',motions/'m_sit_chair_idle_neutral_01.max.fbx'),('conversation',motions/'m_gestic_listen_accept_01.max.fbx'),
       ('walk',motions.parent/'all_animations_max_motextr_xy/m_walk_neutral_01.max.fbx'),
       ('sit-down',motions.parent/'all_animations_max_motextr_xyz/m_sit_down_chair_01.max.fbx'),
       ('stand-up',motions.parent/'all_animations_max_motextr_xyz/m_sit_stand_up_chair_01.max.fbx')]
for clip,file in files:
    before=set(bpy.data.objects)
    bpy.ops.import_scene.fbx(filepath=str(file))
    imported=[o for o in bpy.data.objects if o not in before]
    source=next(o for o in imported if o.type=='ARMATURE')
    action=source.animation_data.action
    action.name=clip
    for curve in list(action.fcurves):
        if curve.data_path.startswith('pose.bones["'):
            bone=curve.data_path.split('"')[1]
            if bone not in arm.pose.bones:action.fcurves.remove(curve)
    action.use_fake_user=True
    arm.animation_data_create()
    track=arm.animation_data.nla_tracks.new();track.name=action.name
    strip=track.strips.new(action.name,int(action.frame_range[0]),action)
    clips.append({'name':action.name,'frames':list(action.frame_range),'channels':len(action.fcurves)})
    for obj in imported:bpy.data.objects.remove(obj,do_unlink=True)
for obj in list(bpy.context.scene.objects):
    if obj not in [arm,mesh]:bpy.data.objects.remove(obj,do_unlink=True)
bpy.ops.object.select_all(action='DESELECT')
arm.select_set(True);mesh.select_set(True);bpy.context.view_layer.objects.active=arm
output.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',use_selection=True,export_animations=True,
    export_animation_mode='NLA_TRACKS',export_force_sampling=True,export_frame_step=2,export_materials='EXPORT',
    export_cameras=False,export_lights=False,export_yup=True,export_image_format='JPEG',export_jpeg_quality=85)
print('ENTITY_AVATAR_EXPORT',json.dumps({'source':str(model),'output':str(output),'vertices':len(mesh.data.vertices),'bones':len(arm.data.bones),'clips':clips,'bytes':output.stat().st_size}))
