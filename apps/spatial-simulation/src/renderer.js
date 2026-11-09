import goldenSource from '../../../simulation/spatial-office/lighting-reference-17.json';
import * as pc from 'playcanvas';
import {createIrradiance} from './irradiance.js';
import {installReflections} from './reflections.js';
import agx from './agx.js';
import {sunAt} from './simulation.js';
export async function createRenderer(canvas,data,state){
 pc.WasmModule.setConfig('DracoDecoderModule',{glueUrl:'/decoders/draco.js',wasmUrl:'/decoders/draco.wasm',numWorkers:2});
 pc.WasmModule.setConfig('BASIS',{glueUrl:'/decoders/basis.js',wasmUrl:'/decoders/basis.wasm',numWorkers:2});
 const device=await pc.createGraphicsDevice(canvas,{deviceTypes:['webgl2'],antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 pc.ShaderChunks.get(device,pc.SHADERLANGUAGE_GLSL).set('tonemappingAcesPS',agx);
 const app=new pc.Application(canvas,{graphicsDevice:device});app.autoRender=false;app.renderNextFrame=true;app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);app.setCanvasResolution(pc.RESOLUTION_AUTO);device.maxPixelRatio=Math.min(devicePixelRatio,matchMedia('(pointer:coarse)').matches?2:1.5);
 const ltc=new Float32Array(await fetch('/model/area-light-luts.bin').then(r=>r.arrayBuffer()));app.setAreaLightLuts(ltc.subarray(0,16384),ltc.subarray(16384));
 app.scene.clusteredLightingEnabled=true;app.scene.lighting.areaLightsEnabled=true;app.scene.lighting.cells=new pc.Vec3(12,4,24);app.scene.lighting.maxLightsPerCell=48;app.scene.lighting.shadowsEnabled=true;app.scene.lighting.shadowAtlasResolution=2048;
 const excludedLayer=new pc.Layer({name:'Architectural glass'});app.scene.layers.insert(excludedLayer,app.scene.layers.getTransparentIndex(app.scene.layers.getLayerByName('World'))+1);
 const lightLayers=[pc.LAYERID_WORLD,excludedLayer.id];
 const camera=new pc.Entity('Architectural navigation');camera.addComponent('camera',{fov:65,nearClip:.035,farClip:180,clearColor:new pc.Color(.18,.22,.24),toneMapping:pc.TONEMAP_ACES});camera.camera.layers=[...camera.camera.layers,excludedLayer.id];app.root.addChild(camera);
 const frame=new pc.CameraFrame(app,camera.camera);frame.rendering.toneMapping=pc.TONEMAP_ACES;frame.rendering.samples=2;frame.rendering.sceneColorMap=true;frame.ssao.type=pc.SSAOTYPE_LIGHTING;frame.ssao.intensity=.25;frame.ssao.power=1.5;frame.ssao.radius=.35;frame.ssao.samples=12;frame.bloom.intensity=.035;frame.bloom.threshold=1;frame.bloom.blurLevel=4;frame.update();
 function load(name,type,url){return new Promise((resolve,reject)=>{const a=new pc.Asset(name,type,{url});app.assets.add(a);a.ready(()=>resolve(a.resource));a.on('error',reject);app.assets.load(a);});}
 const [resource,hdr,dayTexture,artTexture]=await Promise.all([load('Office approved master','container','/model/office.glb'),load('CC0 reflection environment','texture','/model/environment.hdr'),data.daylight_bake?load('HDR environmental irradiance','texture','/model/environment-irradiance.hdr'):null,data.daylight_bake?load('Mutable artificial indirect HDR basis','texture','/model/artificial-indirect.hdr'):null]);
 const irradiance=createIrradiance(data,dayTexture,artTexture);
 const model=resource.instantiateRenderEntity();app.root.addChild(model);const entities=new Map();function traverse(node){entities.set(node.name,node);for(const n of node.children)traverse(n);}traverse(model);
 const environment=pc.EnvLighting.generateLightingSource(hdr,{size:128});app.scene.envAtlas=pc.EnvLighting.generateAtlas(environment,{size:512,numReflectionSamples:128,numAmbientSamples:128});app.scene.skybox=pc.EnvLighting.generateSkyboxCubemap(hdr,256);app.scene.skyboxMip=1;environment.destroy();
 const roomMaterials=new Map(),roomClones=new Map(),bakedReceivers=new Set(data.daylight_bake?.receivers||[]);
 const lights=new Map(),emitters=new Map(),glass=new Set(),screenMaterials=new Map();
 // Every visible source receives its own material; no shared emissive state across circuits.
 for(const d of data.devices.luminaires){
  const e=new pc.Entity(d.id);const dir=[-d.transform_blender[0][2],-d.transform_blender[2][2],d.transform_blender[1][2]];
  e.addComponent('light',{type:'spot',shape:pc.LIGHTSHAPE_RECT,layers:lightLayers,color:new pc.Color(...d.color_rgb).gamma(),intensity:1,range:d.design_role==='accent'?4.5:6,innerConeAngle:80,outerConeAngle:89.5,falloffMode:pc.LIGHTFALLOFF_INVERSESQUARED,castShadows:false,shadowResolution:256,shadowBias:.15,normalOffsetBias:.025,shadowType:pc.SHADOW_PCF3});app.root.addChild(e);e.setPosition(...d.position_source);e.lookAt(...d.position_source.map((v,i)=>v+dir[i]));const b=d.transform_blender,rotation=new pc.Mat4();rotation.set([b[0][0],b[2][0],-b[1][0],0,b[0][2],b[2][2],-b[1][2],0,-b[0][1],-b[2][1],b[1][1],0,0,0,0,1]);e.setRotation(new pc.Quat().setFromMat4(rotation));e.setLocalScale(d.area_size?.[0]||.8,1,d.area_size?.[1]||.8);lights.set(d.id,e);
  const node=entities.get(d.emitter_id),list=[];if(node)for(const render of node.findComponents('render'))for(const mi of render.meshInstances){mi.material=mi.material.clone();mi.material.emissive=new pc.Color(...d.color_rgb).gamma();mi.material.emissiveMap=null;mi.material.emissiveIntensity=1;mi.material.update();list.push(mi.material);}emitters.set(d.id,list);
 }
 const sun=new pc.Entity('Design sun');sun.addComponent('light',{type:'directional',layers:lightLayers,color:new pc.Color(1,.9,.75),intensity:1,castShadows:true,shadowDistance:65,numCascades:2,shadowResolution:2048,normalOffsetBias:.03,shadowBias:.15,shadowType:pc.SHADOW_PCF3});app.root.addChild(sun);
 const mutable=new Set([...data.devices.luminaires.map(l=>l.emitter_id),...data.devices.televisions.map(t=>t.screen_id)]),doorLeafs=new Set(data.devices.doors.map(d=>d.id));
 const ceilings=[];const group=app.batcher.addGroup('Static architecture',false,12);const glassGroup=app.batcher.addGroup('Glass partitions',false,8,undefined,[excludedLayer.id]);let originals=0;
 for(const r of data.records){const node=entities.get(r.name);if(!node)continue;
  if(r.type==='Ceiling'||(r.type==='CeilingDetail'&&r.environment_id!=='sim:WC'))ceilings.push(node);
  for(const render of node.findComponents('render')){if(render.entity!==node)continue;for(const mi of render.meshInstances){originals++;const room=r.environment_id;let mat=mi.material;if(!mutable.has(r.id)){const key=mat.id+'|'+room+'|'+bakedReceivers.has(r.id);if(!roomClones.has(key))roomClones.set(key,mat.clone());mi.material=mat=roomClones.get(key);if(!roomMaterials.has(room))roomMaterials.set(room,new Set());roomMaterials.get(room).add(mat);irradiance.apply(r,mat);}
    if(mat.refraction>0||mat.name==='Phase02 clear partitions'||mat.name==='Window glazing reference'){
     // Real transmissive Fresnel dielectric. Reflections sample the photographic environment;
     // realtime screen-space refraction uses scene color, alpha stays opaque (no ghost walls).
     render.layers=[excludedLayer.id];mat.useDynamicRefraction=true;mat.update();glass.add(mat);
    }
   }
   let parent=node,dynamic=mutable.has(r.id)||r.type==='Ceiling'||r.type==='CeilingDetail';while(parent){if(doorLeafs.has(parent.name))dynamic=true;parent=parent.parent;}
   if(!dynamic)render._spatialStatic=true;
  }
 }
 // Batching preserves semantic metadata/picking in the separate read-only scene index.
 // True GPU instancing: share the same vertex/index buffers across repeated furniture and plants.
 // Partition by spatial cell to retain frustum culling. Original semantic nodes remain selectable.
 const repeated=new Map();
 for(const render of model.findComponents('render'))if(render._spatialStatic)for(const mi of render.meshInstances){
  const pos=mi.node.getPosition(),key=[mi.mesh.id,mi.material.id,Math.floor(pos.x/6),Math.floor(pos.z/6)].join(':');
  if(!repeated.has(key))repeated.set(key,[]);repeated.get(key).push({mi,render});
 }
 let gpuInstanceGroups=0,gpuInstances=0;const instanceRoots=[];
 const instanced=new Set();
 for(const list of repeated.values())if(list.length>=3){
  const matrices=new Float32Array(list.length*16),bound=list[0].mi.aabb.clone();list.forEach(({mi},i)=>{matrices.set(mi.node.getWorldTransform().data,i*16);bound.add(mi.aabb);instanced.add(mi);});
  const buffer=new pc.VertexBuffer(device,pc.VertexFormat.getDefaultInstancingFormat(device),list.length,{data:matrices});
  const root=new pc.Entity('Shared geometry instances '+gpuInstanceGroups);app.root.addChild(root);
  const mi=new pc.MeshInstance(list[0].mi.mesh,list[0].mi.material,root);mi.setInstancing(buffer,true);mi.setCustomAabb(bound);mi.castShadow=true;root.addComponent('render',{meshInstances:[mi],layers:list[0].mi.material.refraction>0?[excludedLayer.id]:[pc.LAYERID_WORLD]});mi.setCustomAabb(bound);instanceRoots.push({root,ids:list.map(x=>x.mi.node.name),buffer});gpuInstanceGroups++;gpuInstances+=list.length;
 }
 for(const render of model.findComponents('render'))if(render._spatialStatic){
  // Batcher receives remaining unique meshes only; keep original arrays for exact geometry picking.
  const visible=render.meshInstances.filter(mi=>!instanced.has(mi));
  if(visible.length!==render.meshInstances.length){for(const mi of render.meshInstances)if(instanced.has(mi))mi.visible=false;}
  if(visible.length)render.batchGroupId=visible.some(mi=>mi.material.refraction>0)?glassGroup.id:group.id;
 }
 app.batcher.generate();
 for(const t of data.devices.televisions){const e=entities.get(t.screen_id);if(e){const list=e.findComponents('render').flatMap(r=>r.meshInstances);for(const mi of list)mi.material=mi.material.clone();screenMaterials.set(t.id,list.map(mi=>({mi,reference:mi.material})));}}
 const testCanvas=document.createElement('canvas');testCanvas.width=1024;testCanvas.height=576;const ctx=testCanvas.getContext('2d'),colors=['#fafafa','#eac928','#2dc9cd','#36bd4f','#ce30bd','#d84538','#244eda','#111'];colors.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(i*128,0,128,576);});ctx.fillStyle='#141c20';ctx.fillRect(0,440,1024,136);ctx.fillStyle='#fff';ctx.font='28px sans-serif';ctx.fillText('ENTITY  /  CONTENIDO DE PRUEBA',45,515);const testTexture=new pc.Texture(device,{width:1024,height:576,mipmaps:true});testTexture.setSource(testCanvas);
 const testMat=new pc.StandardMaterial();testMat.diffuse=new pc.Color(.1,.1,.1);testMat.emissiveMap=testTexture;testMat.emissive=new pc.Color(1,1,1);testMat.emissiveIntensity=.8;testMat.update();const offMat=new pc.StandardMaterial();offMat.diffuse=new pc.Color(.006,.008,.01);offMat.metalness=.1;offMat.useMetalness=true;offMat.gloss=.8;offMat.update();
 const reflections=installReflections(app,camera,roomMaterials,excludedLayer,data);
 let roofVisible=false,lastHour=NaN,lastOutput='',lastDoor='',lastScreen='';
 function roof(visible){app.renderNextFrame=true;roofVisible=visible;for(const c of ceilings){const rec=data.records.find(r=>r.name===c.name);c.enabled=rec?.environment_id==='sim:WC'||visible;}return roofVisible;}
 function environmentUpdate(force=false){const sky=sunAt(state.hour,data.lighting.artistic_sun),day=Math.max(0,Math.sin(sky.elevation*Math.PI/180));
  if(force||state.hour!==lastHour){app.renderNextFrame=true;const a=sky.azimuth*Math.PI/180,e=sky.elevation*Math.PI/180;const direction=new pc.Vec3(Math.sin(a)*Math.cos(e),-Math.sin(e),-Math.cos(a)*Math.cos(e));sun.setPosition(0,10,0);sun.lookAt(direction.clone().add(sun.getPosition()));sun.rotateLocal(90,0,0);sun.light.intensity=1;sun.light.color=new pc.Color(1,.68+.3*day,.42+.55*day).mulScalar(day*2.5).gamma();app.scene.ambientLight=new pc.Color(.055+day*.14,.06+day*.14,.075+day*.14).gamma();app.scene.skyboxIntensity=.02+day*.34;app.scene.exposure=Math.pow(2,data.palette.exposure);camera.camera.clearColor=new pc.Color(.018+day*.3,.025+day*.4,.045+day*.52);lastHour=state.hour;}
  irradiance.update(state,day);
  const key=JSON.stringify([...state.lights]);if(force||key!==lastOutput||state.playing){app.renderNextFrame=true;for(const d of data.devices.luminaires){const value=state.output(d.id),e=lights.get(d.id);const power=(d.nominal_power_blender/(120*Math.max(.04,(d.area_size?.[0]||.8)*(d.area_size?.[1]||.8))))*value;e.light.intensity=1;e.light.color=new pc.Color(...d.color_rgb).mulScalar(power).gamma();e.enabled=value>.0001;for(const mat of emitters.get(d.id)){mat.emissiveIntensity=(data.palette[d.design_role]?.emitter_radiance||4)*value;mat.update();}}lastOutput=key;}
  const doorKey=JSON.stringify([...state.doors]);if(doorKey!==lastDoor){app.renderNextFrame=true;for(const d of data.devices.doors){const e=entities.get(d.id);if(e)e.setLocalEulerAngles(0,d.open_angle*state.doors.get(d.id).fraction*180/Math.PI,0);}lastDoor=doorKey;}
  const screenKey=JSON.stringify([...state.screens]);if(screenKey!==lastScreen){app.renderNextFrame=true;for(const [id,list]of screenMaterials){const s=state.screens.get(id);for(const {mi,reference}of list)mi.material=!s.on?offMat:s.content==='test'?testMat:reference;}lastScreen=screenKey;}
 }
 function view(name){reflections.view(name);const v=data.views[name];if(!v)throw Error('Vista no declarada');camera.setPosition(...v.position);camera.lookAt(...v.target);camera.camera.fov=v.fov;roof(name!=='general');}
 roof(false);view('general');environmentUpdate(true);app.start();window.addEventListener('resize',()=>app.resizeCanvas());
 return {applyReferenceCondition(){if(goldenSource.master_sha256!==data.master_sha256)throw Error('La condición Golden Hour pertenece a otro maestro');state.playing=false;state.setHour(goldenSource.hour);for(const l of goldenSource.lights)state.light(l.id,{...l.state});data.palette.exposure=goldenSource.exposure_EV;environmentUpdate(true);return {source_consumed:true,transport_equivalence_verified:false};},app,camera,entities,model,view,roof,environmentUpdate,instanceRoots,lights,emitters,glass,frame,sun,reflections,irradiance,stats:()=>({engine:pc.version,sourceMeshInstances:originals,gpuInstanceGroups,gpuInstances,batches:app.batcher.getBatches(group.id).length,glassMaterials:glass.size,reflections:reflections.stats(),irradiance:irradiance.statistics(),drawCalls:app.stats.drawCalls.total,frameMs:app.stats.frame.ms})};
}
