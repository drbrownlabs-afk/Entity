import * as pc from 'playcanvas';
import {createAvatar} from './avatars.js';

const models=new Set(['Male_Adult_01','Male_Adult_02','Male_Adult_03','Female_Adult_01','Female_Adult_02','Female_Adult_03']);
export function installVisuals(viewer,original){
 const app=viewer.app,mainCamera=app.root.findComponents('camera')[0],cameras=new Map(),avatars=new Map(),loading=new Map(),errors=[];
 let world=null,security=false,selectedCamera=null,expandedCamera=null,observerEnabled=false,visibleIds=[];
 const panel=document.createElement('div');panel.id='office-cctv';panel.hidden=true;document.querySelector('#scene').append(panel);
 const expand=document.createElement('button');expand.id='office-camera-expand';expand.textContent='Ampliar cámara';expand.style.cssText='right:12px;bottom:12px;left:auto;font-size:12px';panel.append(expand);
 expand.onclick=()=>{expandedCamera=expandedCamera?null:(selectedCamera||visibleIds[0]);expand.textContent=expandedCamera?'Volver a la cuadrícula':'Ampliar cámara';layout();};
 const record=document.createElement('button');record.id='office-camera-record';record.textContent='Registrar observación simulada';record.hidden=true;record.style.cssText='left:12px;bottom:12px;right:auto;font-size:12px';panel.append(record);
 record.onclick=()=>{record.disabled=true;window.dispatchEvent(new CustomEvent('office-capture-request',{detail:selectedCamera||visibleIds[0]}));};
 window.addEventListener('office-observer-enabled',event=>{observerEnabled=event.detail===true;layout();});
 window.addEventListener('office-capture-completed',()=>{record.disabled=false;});
 const caption=document.createElement('span');caption.id='office-camera-caption';caption.style.cssText='position:absolute;left:12px;top:12px;background:#101b22bb;padding:5px;pointer-events:none';panel.append(caption);
 function ensureCamera(id,pose){
  if(!Array.isArray(pose.position)||!Array.isArray(pose.target)||[...pose.position,...pose.target].some(v=>!Number.isFinite(v)))return;
  let item=cameras.get(id);
  if(!item){
   const entity=new pc.Entity('ENTITY CCTV '+id);
   entity.addComponent('camera',{fov:pose.fov||85,nearClip:.01,aspectRatioMode:pc.ASPECT_MANUAL,aspectRatio:16/9,priority:mainCamera.priority+cameras.size+1,layers:[...mainCamera.layers],clearColorBuffer:true,clearDepthBuffer:true,clearColor:new pc.Color(.08,.1,.12)});
   entity.enabled=false;app.root.addChild(entity);
   const button=document.createElement('button');button.textContent=id;button.dataset.camera=id;panel.append(button);
   button.onclick=()=>{selectedCamera=id;window.dispatchEvent(new CustomEvent('office-select-entity',{detail:id}));layout();};
   item={entity,button};cameras.set(id,item);
  }
  item.entity.setPosition(...pose.position);item.entity.lookAt(...pose.target);item.entity.camera.fov=pose.fov||85;
 }
 original.settings.annotations.forEach((a,i)=>ensureCamera('CAM-'+String(i+1).padStart(2,'0'),a.camera.initial));
 function layout(){
  const allowed=[...cameras.keys()].filter(id=>!world||world.entities[id]);
  const preferred=world?allowed.filter(id=>world.entities[id]?.capture_simulated_people):[];
  const ordered=[...(selectedCamera&&allowed.includes(selectedCamera)?[selectedCamera]:[]),...preferred,...allowed].filter((id,i,a)=>a.indexOf(id)===i);
  if(expandedCamera&&!allowed.includes(expandedCamera))expandedCamera=null;
  visibleIds=expandedCamera?[expandedCamera]:ordered.slice(0,innerWidth<650?2:4);
  record.hidden=!observerEnabled||!world||world.historical||world.branch!=='main'||!world.entities[selectedCamera||visibleIds[0]]?.capture_simulated_people;
  caption.textContent=world?(world.historical?'Reconstrucción · sin vídeo grabado · ':'CCTV virtual · ')+world.clock:'Vistas del escaneo original · Core desconectado';
  for(const [id,{entity,button}]of cameras){
   const slot=visibleIds.indexOf(id),state=world?.entities[id],column=slot%2,row=Math.floor(slot/2);
   entity.enabled=security&&slot>=0&&(!world||!!state)&&state?.connectivity!=='disconnected';
   const dimensions=app.graphicsDevice.clientRect;
   const height=.20*dimensions.width/(16/9)/dimensions.height;
   const bottom=.94-height-row*(height+.025);
   if(slot>=0){
    if(expandedCamera){const width=Math.min(.92,.84*dimensions.height*(16/9)/dimensions.width),h=width*dimensions.width/(16/9)/dimensions.height;entity.camera.rect=new pc.Vec4((1-width)/2,(1-h)/2,width,h);}
    else entity.camera.rect=new pc.Vec4(.56+column*.21,bottom,.20,height);
   }
   button.hidden=!security||slot<0;button.classList.toggle('selected',selectedCamera===id);
   button.title=state?.connectivity==='disconnected'?'Desconectada':'Vista virtual del mismo mundo; no es vídeo de una cámara física';
   button.style.left=(56+column*21)+'%';button.style.bottom=(bottom*100)+'%';
  }
  app.renderNextFrame=true;
 }
 async function loadAvatar(personId,url){
  if(avatars.has(personId))return avatars.get(personId);
  if(loading.has(personId))return loading.get(personId);
  const promise=createAvatar(app,url).then(({entity})=>{
   entity.name=personId;entity.enabled=false;app.root.addChild(entity);avatars.set(personId,entity);
   app.scene.ambientLight=new pc.Color(.7,.7,.7);
   if(world)receive(world);return entity;
  }).catch(error=>{errors.push(personId+': '+error.message);throw error;}).finally(()=>loading.delete(personId));
  loading.set(personId,promise);return promise;
 }
 function receive(state){
  world=state;
  for(const item of Object.values(state.entities))if(item.kind==='Camera'&&item.virtual&&item.position&&item.target)ensureCamera(item.id,item);
  layout();
  for(const entity of avatars.values())entity.enabled=false;
  for(const person of Object.values(state.entities).filter(e=>e.kind==='Person')){
   const pose=person.spatial_pose;
   if(!pose||pose.coordinate_frame!=='supersplat-original'||pose.validated!==true||!Array.isArray(pose.position)||pose.position.length!==3||pose.position.some(v=>!Number.isFinite(v)))continue;
   const entity=avatars.get(person.id);
   if(!entity){if(models.has(person.avatar_id))loadAvatar(person.id,new URL('avatars/'+person.avatar_id+'.glb',document.baseURI).href).catch(()=>{});continue;}
   entity.enabled=true;entity.setPosition(...pose.position);
   if(Number.isFinite(pose.yaw))entity.setEulerAngles(0,pose.yaw,0);
   const animation=entity.findComponent('anim');
   if(animation?.baseLayer){
    const name=pose.animation||'idle';if(animation.baseLayer.activeState!==name)animation.baseLayer.play(name);
    animation.speed=0;
    animation.baseLayer.activeStateCurrentTime=Number(pose.animation_time)||0;
    animation.update(0);
   }
  }
  app.renderNextFrame=true;
 }
 async function capture(id){
  if(world?.historical||world?.branch!=='main')throw Error('Historical or hypothetical reconstruction cannot generate official live observations');
  if(!world)throw Error('Core must be connected; authored public views are not observations');
  const sample=world;
  // Camera observations/events do not move actors; compare physical fields, not unrelated revisions.
  const frame=state=>JSON.stringify({clock:state?.clock,branch:state?.branch,historical:state?.historical,camera:state?.entities[id]&&['position','target','fov','connectivity'].map(k=>state.entities[id][k]),poses:Object.values(state?.entities||{}).filter(p=>p.spatial_pose).map(p=>[p.id,p.spatial_pose])});
  const fingerprint=frame(sample);
  const ensureCurrent=()=>{if(frame(world)!==fingerprint)throw Error('El mundo cambió durante la captura; vuelve a intentarlo.');};
  if(Object.values(sample.entities).some(p=>p.spatial_pose&&models.has(p.avatar_id)&&!avatars.has(p.id)))throw Error('Los personajes aún se están cargando; no se publicará una falsa ausencia.');
  const source=sample.entities[id],entry=cameras.get(id);
  if(!source||!entry||source.connectivity==='disconnected')throw Error('Authorized calibrated camera unavailable');
  // Reuse the rendered source camera: an unrendered clone has no resident splat depth.
  const camera=entry.entity.camera,picker=new pc.Picker(app,160,90);
  const rect=camera.rect.clone();
  try{
   await new Promise((resolve,reject)=>{
    const finish=()=>{clearTimeout(timer);resolve();};
    const timer=setTimeout(()=>{app.off('postrender',finish);reject(Error('Camera render did not complete within 10 seconds'));},10000);
    app.once('postrender',finish);app.renderNextFrame=true;
   });
   ensureCurrent();camera.rect=new pc.Vec4(0,0,1,1);window.officeSetSplatClipForCamera?.(camera);picker.prepare(camera,app.scene);camera.rect=rect;
   const tracks=[];
   for(const [personId,entity]of avatars){
    const pose=sample.entities[personId]?.spatial_pose;
    if(!entity.enabled||!pose)continue;
    const center=entity.getPosition().clone().add(new pc.Vec3(0,.9,0));
    const depth=center.clone().sub(entry.entity.getPosition()).dot(entry.entity.forward);
    // Picker uses its complete 160×90 target; worldToScreen otherwise applies the CCTV tile rect.
    camera.rect=new pc.Vec4(0,0,1,1);
    const screen=camera.camera.worldToScreen(center,160,90);camera.rect=rect;
    if(depth<=0||screen.x<0||screen.x>=160||screen.y<0||screen.y>=90)continue;
    let timer;
    const hits=app.graphicsDevice.isWebGL2?picker.getSelection(Math.max(0,screen.x-3),Math.max(0,screen.y-8),7,17):await Promise.race([picker.getSelectionAsync(Math.max(0,screen.x-3),Math.max(0,screen.y-8),7,17),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Camera visibility readback timed out')),10000);})]).finally(()=>clearTimeout(timer));
    const owned=hits.some(hit=>{let node=hit.node;while(node){if(node===entity)return true;node=node.parent;}return false;});
    if(owned){
     const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(id+':'+personId));
     const local='anon-'+[...new Uint8Array(bytes)].slice(0,8).map(n=>n.toString(16).padStart(2,'0')).join('');
     tracks.push({local_track_id:local,zone_id:pose.zone_id,position:[screen.x/160,screen.y/90]});
    }
   }
   ensureCurrent();
   return {source_id:id,clock:sample.clock,payload:{source_status:'connected',tracks,transitions:[]},provenance:{connector_id:'simulated',model_version:'playcanvas-picker-visibility-v1',simulated:true}};
  }finally{camera.rect=rect;picker.destroy();app.renderNextFrame=true;}
 }
 window.addEventListener('office-world-changed',e=>receive(e.detail));
 window.addEventListener('office-world-cleared',()=>{world=null;observerEnabled=false;for(const entity of avatars.values())entity.enabled=false;layout();});
 window.addEventListener('office-mode-changed',e=>{security=e.detail==='Seguridad';panel.hidden=!security;layout();});
 window.addEventListener('resize',layout);
 // Warm secondary camera resident sets without unbounded rendering on a paused world.
 let warmUntil=0;window.addEventListener('office-mode-changed',()=>{warmUntil=performance.now()+10000;});
 setInterval(()=>{if(security&&performance.now()<warmUntil&&!document.hidden)app.renderNextFrame=true;},500);
 window.officeFocusCamera=(id,expanded=true)=>{if(!cameras.has(id))throw Error('La cámara no tiene pose calibrada');selectedCamera=id;expandedCamera=expanded?id:null;security=true;warmUntil=performance.now()+10000;panel.hidden=false;layout();};
 window.officeCloseCameras=()=>{security=false;expandedCamera=null;panel.hidden=true;layout();};
 window.officeLoadAvatar=loadAvatar;window.officeCaptureCamera=capture;
 window.officeVisualDiagnostics=()=>({cameraRenderState:[...cameras].filter(([,c])=>c.entity.enabled).map(([id,c])=>({id,layers:c.entity.camera.layers,managers:[...(app.renderer.gsplatDirector?.camerasMap.get(c.entity.camera.camera)?.layersMap.values()||[])].map(m=>({splats:m.gsplatManager?.world.currentState?.totalActiveSplats??null,pending:m.gsplatManager?.hasPendingSort}))})),cameraViews:cameras.size,activeCameras:[...cameras.values()].filter(c=>c.entity.enabled).length,visibleCameraIds:visibleIds,worldClock:world?.clock||null,
  avatarsLoaded:avatars.size,avatarsPlaced:[...avatars.values()].filter(e=>e.enabled).map(e=>({id:e.name,position:e.getPosition().toArray()})),singleApplication:[...cameras.values()].every(c=>c.entity.parent===app.root),
  errors,source:world?'original SSOG and authorized Core projection':'original SSOG authored viewpoints; Core disconnected'});
}
