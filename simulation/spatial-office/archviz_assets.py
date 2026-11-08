"""Provenance-checked professional assets, imported with Blender's official glTF importer."""
import math
from pathlib import Path
import bpy
from mathutils import Vector,Matrix
from common import HERE,read,sha256,to_blender

class AssetLibrary:
    def __init__(self,studio):
        self.studio=studio;self.models={};self.instances=[];self.geometry_cache={}
        self.folder=HERE/'assets/archviz';self.provenance=read(self.folder/'provenance.json')
    def load(self,name):
        entry=next(r for r in self.provenance['models'] if r['name']==name)
        path=self.folder/(name+'.glb');assert sha256(path)==entry['sha256']
        before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(path),import_pack_images=True)
        imported=set(bpy.data.objects)-before;bpy.context.view_layer.update()
        meshes=sorted((o for o in imported if o.type=='MESH' and not o.name.lower().startswith('firefly')),key=lambda o:o.name)
        points=[o.matrix_world@Vector(v) for o in meshes for v in o.bound_box]
        low=Vector(tuple(min(p[i] for p in points) for i in range(3)))
        high=Vector(tuple(max(p[i] for p in points) for i in range(3)))
        records=[(o,o.matrix_world.copy()) for o in meshes]
        self.models[name]={'objects':records,'all':imported,'low':low,'high':high,'source':entry}
        for o in imported:o.hide_render=True;o.hide_set(True)
        print('PROFESSIONAL_ASSET',name,'dimensions_blender',list(high-low),'mesh_objects',len(meshes),flush=True)
    def place(self,name,id,x,z,env,width=None,height=None,depth=None,yaw=0,tilt_x=0,floor=-1.55,kind='Sofa',parts=None,geometry_variant=None):
        if name not in self.models:self.load(name)
        model=self.models[name];low=model['low'];high=model['high'];size=high-low
        scale=height/size.z if height else width/size.x
        scales=(width/size.x if width and height else scale, depth/size.y if depth else scale, scale)
        origin=Vector(((low.x+high.x)/2,(low.y+high.y)/2,low.z))
        transform=Matrix.Translation(Vector(to_blender((x,floor,z))))@Matrix.Rotation(-yaw,4,'Z')@Matrix.Rotation(tilt_x,4,'X')@Matrix.Diagonal((*scales,1))@Matrix.Translation(-origin)
        ids=[]
        for i,(source,world) in enumerate(model['objects']):
            if parts and not any(source.name.lower().startswith(part) for part in parts):continue
            data=source.data
            if geometry_variant=='wall-fine':
                key=(name,source.name,geometry_variant)
                if key not in self.geometry_cache:
                    temp=bpy.data.objects.new('temporary foliage simplification',source.data);bpy.context.scene.collection.objects.link(temp)
                    mod=temp.modifiers.new('Small-scale foliage LOD preserving texture UVs','DECIMATE');mod.ratio=.10
                    bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
                    data=bpy.data.meshes.new_from_object(temp.evaluated_get(dg),preserve_all_data_layers=True,depsgraph=dg)
                    bpy.data.objects.remove(temp,do_unlink=True);self.geometry_cache[key]=data
                data=self.geometry_cache[key]
            o=source.copy();o.data=data;o.parent=None;o.animation_data_clear();bpy.context.scene.collection.objects.link(o)
            o.matrix_world=transform@world;o.hide_render=False;o.hide_set(False)
            self.studio.reg(o,id+':part:'+str(i),kind,env)
            o['geometry_origin']='Professional glTF asset '+name+'; attribution assets/archviz/; pose/scale estimated'
            o['asset_name']=name;o['asset_source_sha256']=model['source']['sha256'];o['furniture_group']=self.studio.prefix+id
            o['asset_source_part']=source.name
            if geometry_variant:o['geometry_variant']=geometry_variant
            ids.append(o.name)
        self.instances.append({'id':self.studio.prefix+id,'asset':name,'objects':ids,'environment_id':env,'source_position':[x,floor,z],'scale_blender':list(scales),'yaw_source_radians':yaw,'tilt_blender_x_radians':tilt_x,'dimensions_source_unrotated':[size.x*scales[0],size.z*scales[2],size.y*scales[1]],'adaptation':'Diners fitted in three axes to the existing footprint; other instances uniformly scaled.' if width and height else 'Uniform scale; placement estimated.'})
        return ids
    def cleanup(self):
        for model in self.models.values():
            for o in model['all']:
                if o.name in bpy.data.objects:bpy.data.objects.remove(o,do_unlink=True)
        # No imported animation, cameras or punctual lights survive as hidden duplicate systems.
