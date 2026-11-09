"""High quality Blender review, all approved cameras; immutable input and resumable queue."""
import sys,math,time
from pathlib import Path
import bpy
import subprocess,shutil
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import HERE,OUTPUT,HANDOFF,read,write,sha256,protected_changes,to_source
import archviz_environment as env
cfg=read(HERE/'blender-review-quality.json');master=OUTPUT/'office-phase04-revision.blend';digest=sha256(master)
assert digest=='ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f' and not protected_changes()
folder=HANDOFF/'evidence/phase04-5/blender-review';folder.mkdir(parents=True,exist_ok=True);guides=HERE/'.runtime/blender-review-guides';guides.mkdir(parents=True,exist_ok=True)
args=sys.argv[sys.argv.index('--')+1:]if '--' in sys.argv else[];views=args or cfg.get('default_views',['lounge']);
if views!=['lounge']:raise PermissionError('Additional views require operator approval of the first image; batch disabled')
records=read(folder/'captures.json')if(folder/'captures.json').exists()else[]
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene;env.set_hour(cfg['hour']);env.pause();scene.frame_set(31)
for k,v in cfg['cycles'].items():setattr(scene.cycles,k,v)
scene.render.resolution_x,scene.render.resolution_y=cfg['resolution'];scene.render.resolution_percentage=100;scene.cycles.use_denoising=False;scene.view_layers[0].cycles.denoising_store_passes=True
materials=[]
for mat in bpy.data.materials:
 if not mat.use_nodes:continue
 p=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if not p:continue
 materials.append({'name':mat.name,'pbr':{k:{'value':list(p.inputs[k].default_value)if hasattr(p.inputs[k].default_value,'__len__')else p.inputs[k].default_value,'linked':p.inputs[k].is_linked}for k in ['Base Color','Roughness','Metallic','Normal','Transmission Weight','IOR','Coat Weight','Sheen Weight','Emission Strength']},'textures':[{'image':n.image.name,'resolution':list(n.image.size),'color_space':n.image.colorspace_settings.name,'packed':bool(n.image.packed_file)}for n in mat.node_tree.nodes if n.type=='TEX_IMAGE'and n.image],'procedural_nodes':[n.type for n in mat.node_tree.nodes if n.type in ['TEX_NOISE','VALTORGB','RGBTOBW','BUMP','BSDF_TRANSLUCENT']],'transfer_verified':False})
write(folder/'materials-source.json',{'master_sha256':digest,'materials':materials,'note':'Source inventory only; mapping/baking and runtime visual validation still required. No material replaced for this quality render.'})
write(folder/'queue.json',{'configuration':cfg,'master_sha256':digest,'script_sha256':sha256(Path(__file__)),'status':'rendering','human_approval':False})
for name in views:
 assert name in cfg['views'];camera=bpy.data.objects['view:revision-'+name];dst=folder/(name+'.png')
 old=next((r for r in records if r['view']==name and r['master_sha256']==digest and r['profile']==cfg and dst.exists()and r['sha256']==sha256(dst)),None)
 if old:continue
 for o in scene.objects:
  if o.get('semantic_type')in ['Ceiling','CeilingDetail']:o.hide_render=name=='general'and o.get('environment_id')!='sim:WC'
 bpy.data.objects['sim:p3:WC:door'].rotation_euler.z=bpy.data.objects['sim:p3:WC:door']['open_angle']if name=='WC'else 0
 scene.camera=camera;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(dst);scene.use_nodes=True;nodes=scene.node_tree.nodes;nodes.clear();layer=nodes.new('CompositorNodeRLayers');comp=nodes.new('CompositorNodeComposite');scene.node_tree.links.new(layer.outputs['Image'],comp.inputs[0])
 for channel in ['Albedo','Normal']:
  node=nodes.new('CompositorNodeOutputFile');node.base_path=str(guides);node.format.file_format='OPEN_EXR';node.format.color_mode='RGB';node.format.color_depth='32';node.file_slots[0].path=name+'-'+channel+'-';scene.node_tree.links.new(layer.outputs['Denoising '+channel],node.inputs[0])
 bpy.context.view_layer.update();start=time.time();bpy.ops.render.render(write_still=True);assert sha256(master)==digest
 features={}
 for channel in ['Albedo','Normal']:
  file=guides/(name+'-'+channel+'-0031.exr');im=bpy.data.images.load(str(file),check_existing=False);w,h=im.size[:];a=np.empty(w*h*4,dtype=np.float32);im.pixels.foreach_get(a);a=a.reshape(h,w,4)[:,:,:3];pfm=guides/(name+'-'+channel+'.pfm')
  with pfm.open('wb')as f:f.write(f'PF\n{w} {h}\n-1.0\n'.encode());f.write(a.astype('<f4').tobytes())
  features[channel.lower()]={'path':str(pfm.relative_to(HERE)),'sha256':sha256(pfm)};bpy.data.images.remove(im)
 records=[r for r in records if r['view']!=name];records.append({'view':name,'profile':cfg,'master_sha256':digest,'sha256':sha256(dst),'camera':camera.name,'position':list(to_source(camera.location)),'vertical_fov':math.degrees(camera.data.angle_y),'state':env.state(),'exposure_EV':scene.view_settings.exposure,'view_transform':scene.view_settings.view_transform,'look':scene.view_settings.look,'guides':features,'render_seconds':time.time()-start,'human_approval':False});write(folder/'captures.json',records);subprocess.run([shutil.which('python'),str(HERE/'denoise-blender-review.py')],check=True);print('BLENDER_REVIEW_CAPTURED',name,flush=True)
write(folder/'queue.json',{'configuration':cfg,'master_sha256':digest,'status':'selected views complete','completed':[r['view']for r in records],'human_approval':False})
assert not protected_changes()and sha256(master)==digest
