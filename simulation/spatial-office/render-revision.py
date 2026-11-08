"""Actual Cycles architectural review; raw renders stay separate from OIDN output."""
import sys
from pathlib import Path
import bpy
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import OUTPUT,HANDOFF,HERE,read,write,sha256,to_source
import archviz_environment as env
E=HANDOFF/'evidence/phase04-revision';master=OUTPUT/'office-phase04-revision.blend'
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
draft='--draft' in args
views=[a for a in args if not a.startswith('--')] or ['lounge','comedor','waiting','meeting','WC','booths','cafe','services','general']
folder=E/('draft' if draft else 'renders');folder.mkdir(parents=True,exist_ok=True)
guides=HERE/'.runtime/revision-guides'/('draft' if draft else 'review');guides.mkdir(parents=True,exist_ok=True)
manifest=read(OUTPUT/'device-manifest-revision.json');assert manifest['master_sha256']==sha256(master)
source_hash=manifest['master_sha256']
if not draft:
    gate=read(E/'summary.json');assert gate['passed'] and gate['master_sha256']==sha256(master)
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene;initial=env.state()
records=[r for r in read(folder/'renders.json') if r['name'] not in views and r['master_sha256']==sha256(master)] if (folder/'renders.json').exists() else []
for name in views:
    assert sha256(master)==source_hash,'Master changed during this capture batch; reload before rendering'
    base_name=name.rsplit('-',1)[0] if name.rsplit('-',1)[-1] in ['08','12','16','20'] else name
    hour=int(name.rsplit('-',1)[-1]) if base_name!=name else 12
    lighting_case=base_name.removeprefix('lounge-lights-') if base_name.startswith('lounge-lights-') else None
    if lighting_case:base_name='lounge'
    env.restore(initial)
    view='revision-'+base_name;scene.camera=bpy.data.objects['view:'+view]
    scene.frame_set(31)
    # Only the architectural WC inspection uses an open door. No camera enters the room.
    bpy.data.objects['sim:p3:WC:door'].rotation_euler.z=bpy.data.objects['sim:p3:WC:door']['open_angle'] if base_name=='WC' else 0
    for o in bpy.data.objects:
        if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=base_name=='general' and o.get('environment_id')!='sim:WC'
        if o.get('environment_id')=='render-context':o.hide_render=base_name=='general'
    env.set_hour(hour)
    if lighting_case:
        assert lighting_case in ['on','off','one']
        for zone in manifest['circuits']:env.circuit_set(zone,on=False)
        if lighting_case=='on':env.circuit_set('sim:LOUNGE',on=True,level=1,mode='manual')
        if lighting_case=='one':env.light_set('sim:r1:lounge:vertical:light',on=True,level=1,mode='manual')
    context=scene.world.node_tree.nodes.get('Show photographic context')
    if context:context.outputs[0].default_value=0 if base_name=='general' else 1
    hero=(base_name in ['lounge','office','comedor','computer-detail','glass-detail','vertical-garden','garden-detail'] or name=='general-12') and not lighting_case
    scene.cycles.samples=24 if draft else (96 if hero else 64);scene.cycles.adaptive_min_samples=8 if draft else 24;scene.cycles.adaptive_threshold=.07 if draft else .03
    scene.render.resolution_x=900 if draft else (1440 if hero else 1280);scene.render.resolution_y=600 if draft else (960 if hero else 854);scene.render.resolution_percentage=100
    scene.view_layers[0].cycles.denoising_store_passes=True
    scene.use_nodes=True;nodes=scene.node_tree.nodes;nodes.clear();layer=nodes.new('CompositorNodeRLayers');composite=nodes.new('CompositorNodeComposite');scene.node_tree.links.new(layer.outputs['Image'],composite.inputs['Image'])
    for channel in ['Albedo','Normal']:
        file=nodes.new('CompositorNodeOutputFile');file.base_path=str(guides);file.format.file_format='OPEN_EXR';file.format.color_mode='RGB';file.format.color_depth='32';file.file_slots[0].path=name+'-'+channel+'-'
        scene.node_tree.links.new(layer.outputs['Denoising '+channel],file.inputs[0])
    scene.render.image_settings.file_format='PNG';scene.render.filepath=str(folder/(name+'.png'))
    bpy.ops.render.render(write_still=True)
    assert sha256(master)==source_hash,'Master changed during rendering; do not attribute this image to the new file'
    feature_files={}
    for channel in ['Albedo','Normal']:
        path=guides/(name+'-'+channel+'-0031.exr');image=bpy.data.images.load(str(path),check_existing=False);w,h=image.size[:]
        data=np.empty(w*h*4,dtype=np.float32);image.pixels.foreach_get(data);data=data.reshape(h,w,4)[:,:,:3]
        pfm=guides/(name+'-'+channel+'.pfm')
        with pfm.open('wb') as f:f.write(f'PF\n{w} {h}\n-1.0\n'.encode());f.write(data.astype('<f4').tobytes())
        feature_files[channel.lower()]={'path':str(pfm.relative_to(HERE)),'sha256':sha256(pfm),'source_exr_sha256':sha256(path)};bpy.data.images.remove(image)
    records.append({'name':name,'path':name+'.png','master_sha256':source_hash,'sha256':sha256(folder/(name+'.png')),'camera_source_position':list(to_source(scene.camera.location)),'hour':hour,'lighting_case':lighting_case,'resolution':[scene.render.resolution_x,scene.render.resolution_y],'samples_max':scene.cycles.samples,'noise_threshold':scene.cycles.adaptive_threshold,'color_management':{'view_transform':scene.view_settings.view_transform,'look':scene.view_settings.look,'exposure':scene.view_settings.exposure},'WC_door':'open for architectural inspection only' if base_name=='WC' else 'closed','WC_roof_opaque':True,'draft':draft,'state':env.state(),'denoising_guides':feature_files})
    write(folder/'renders.json',records)
    print('ARCHVIZ_CAPTURED',name,'DRAFT' if draft else 'REVIEW',flush=True)
assert sha256(master)==manifest['master_sha256']
