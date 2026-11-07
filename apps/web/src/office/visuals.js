import * as pc from 'playcanvas';
import {createAvatar} from './avatars.js';

const models=new Set(['Male_Adult_01','Male_Adult_02','Male_Adult_03','Female_Adult_01','Female_Adult_02','Female_Adult_03']);
export function installVisuals(viewer,original){
 const app=viewer.app,mainCamera=app.root.findComponents('camera')[0],cameras=new Map(),avatars=new Map(),loading=new Map(),errors=[];
 let world=null,security=false,selectedCamera=null,visibleIds=[];
 const panel=document.createElement('div');panel.id='office-cctv';panel.hidden=true;document.querySelector('#scene').append(panel);
 function ensureCamera(id,pose){
  if(!Array.isArray(pose.position)||!Array.isArray(pose.target)||[...pose.position,...pose.target].some(v=>!Number.isFinite(v)))return;
  let item=cameras.get(id);
  if(!item){
   const entity=new pc.Entity('ENTITY CCTV '+id);
   entity.addComponent('camera',{fov:pose.fov||85,priority:mainCamera.priority+cameras.size+1,layers:[...mainCamera.layers],clearColorBuffer:true,clearDepthBuffer:true,clearColor:new pc.Color(.08,.1,.12)});
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
  const ordered=[...(selectedCamera?[selectedCamera]:[]),...preferred,...allowed].filter((id,i,a)=>a.indexOf(id)===i);
  visibleIds=ordered.slice(0,innerWidth<650?2:4);
  for(const [id,{entity,button}]of cameras){
   const slot=visibleIds.indexOf(id),state=world?.entities[id],column=slot%2,row=Math.floor(slot/2);
   entity.enabled=security&&slot>=0&&state?.connectivity!=='disconnected';
   if(slot>=0)entity.camera.rect=new pc.Vec4(.56+column*.21,.53-row*.24,.20,.22);
   button.hidden=!security||slot<0;button.classList.toggle('selected',selectedCamera===id);
   button.title=state?.connectivity==='disconnected'?'Desconectada':'Vista virtual del mismo mundo; no es vídeo de una cámara física';
   button.style.left=(56+column*21)+'%';button.style.bottom=(53-row*24)+'%';
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
   if(entity.anim?.baseLayer){
    const name=pose.animation||'idle';if(entity.anim.baseLayer.activeState!==name)entity.anim.baseLayer.play(name);
    entity.anim.speed=0;
    entity.anim.baseLayer.activeStateCurrentTime=Number(pose.animation_time)||0;
   }
  }
  app.renderNextFrame=true;
 }
 async function capture(id){
  if(world?.historical)throw Error('Historical reconstruction cannot generate live observations');
  if(!world)throw Error('Core must be connected; authored public views are not observations');
  const source=world.entities[id],entry=cameras.get(id);
  if(!source||!entry||source.connectivity==='disconnected')throw Error('Authorized calibrated camera unavailable');
  const camera=entry.entity.camera,rect=camera.rect.clone(),aspect=camera.aspectRatio;
  const picker=new pc.Picker(app,160,96);
  try{
   camera.rect=new pc.Vec4(0,0,1,1);camera.aspectRatio=160/96;
   app.renderNextFrame=true;
   await new Promise(resolve=>app.once('postrender',resolve));
   picker.prepare(camera,app.scene);
   const tracks=[];
   for(const [personId,entity]of avatars){
    const pose=world.entities[personId]?.spatial_pose;
    if(!entity.enabled||!pose)continue;
    const center=entity.getPosition().clone().add(new pc.Vec3(0,.9,0));
    const depth=center.clone().sub(entry.entity.getPosition()).dot(entry.entity.forward);
    const screen=camera.camera.worldToScreen(center,160,96);
    if(depth<=0||screen.x<0||screen.x>=160||screen.y<0||screen.y>=96)continue;
    const hits=await picker.getSelectionAsync(Math.max(0,screen.x-3),Math.max(0,screen.y-8),7,17);
    const owned=hits.some(hit=>{let node=hit.node;while(node){if(node===entity)return true;node=node.parent;}return false;});
    if(owned){
     const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(id+':'+personId));
     const local='anon-'+[...new Uint8Array(bytes)].slice(0,8).map(n=>n.toString(16).padStart(2,'0')).join('');
     tracks.push({local_track_id:local,zone_id:pose.zone_id,position:[screen.x/160,screen.y/96]});
    }
   }
   return {source_id:id,clock:world.clock,payload:{source_status:'connected',tracks,transitions:[]},provenance:{connector_id:'simulated',model_version:'playcanvas-picker-visibility-v1',simulated:true}};
  }finally{camera.rect=rect;camera.aspectRatio=aspect;picker.destroy();app.renderNextFrame=true;}
 }
 window.addEventListener('office-world-changed',e=>receive(e.detail));
 window.addEventListener('office-world-cleared',()=>{world=null;for(const entity of avatars.values())entity.enabled=false;layout();});
 window.addEventListener('office-mode-changed',e=>{security=e.detail==='Seguridad';panel.hidden=!security;layout();});
 window.addEventListener('resize',layout);
 window.officeLoadAvatar=loadAvatar;window.officeCaptureCamera=capture;
 window.officeVisualDiagnostics=()=>({cameraViews:cameras.size,activeCameras:[...cameras.values()].filter(c=>c.entity.enabled).length,visibleCameraIds:visibleIds,worldClock:world?.clock||null,
  avatarsLoaded:avatars.size,avatarsPlaced:[...avatars.values()].filter(e=>e.enabled).map(e=>({id:e.name,position:e.getPosition().toArray()})),singleApplication:[...cameras.values()].every(c=>c.entity.parent===app.root),
  errors,source:world?'original SSOG and authorized Core projection':'original SSOG authored viewpoints; Core disconnected'});
}
