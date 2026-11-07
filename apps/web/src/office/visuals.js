import * as pc from 'playcanvas';
import {createAvatar} from './avatars.js';

// Cameras and avatars belong to the official viewer's existing PlayCanvas application.
// No second scene, simulation clock, renderer or invented furniture is introduced here.
export function installVisuals(viewer,original){
 const app=viewer.app,mainCamera=app.root.findComponents('camera')[0],cameras=[],avatars=new Map();
 let world=null,security=false,selectedCamera=null;
 const panel=document.createElement('div');panel.id='office-cctv';panel.hidden=true;document.querySelector('#scene').append(panel);
 const poses=original.settings.annotations.map(a=>a.camera.initial);
 poses.forEach((pose,index)=>{
  const entity=new pc.Entity('ENTITY CCTV '+(index+1));
  entity.addComponent('camera',{fov:pose.fov,priority:mainCamera.priority+index+1,layers:[...mainCamera.layers],clearColorBuffer:true,clearDepthBuffer:true,clearColor:new pc.Color(.08,.1,.12)});
  entity.setPosition(...pose.position);entity.lookAt(...pose.target);entity.enabled=false;app.root.addChild(entity);cameras.push(entity);
  const button=document.createElement('button');button.textContent='CAM-'+String(index+1).padStart(2,'0');button.dataset.camera=index;panel.append(button);
  button.onclick=()=>{selectedCamera=index;viewer.selectAnnotation(index);window.dispatchEvent(new CustomEvent('office-select-entity',{detail:'CAM-'+String(index+1).padStart(2,'0')}));layout();};
 });
 function layout(){
  const count=innerWidth<650?2:4;
  cameras.forEach((entity,index)=>{
   const id='CAM-'+String(index+1).padStart(2,'0'),state=world?.entities[id];
   entity.enabled=security&&index<count&&(!world||!!state)&&state?.connectivity!=='disconnected';
   const column=index%2,row=Math.floor(index/2);
   entity.camera.rect=new pc.Vec4(.56+column*.21,.53-row*.24,.20,.22);
   const button=panel.querySelector('[data-camera="'+index+'"]');
   button.hidden=index>=count||(!!world&&!state);button.classList.toggle('selected',selectedCamera===index);
   button.title=state?.connectivity==='disconnected'?'Desconectada: sin nueva observación':'Vista virtual del mismo mundo; cobertura física no certificada';
   button.style.left=(56+column*21)+'%';button.style.bottom=(53-row*24)+'%';
  });app.renderNextFrame=true;
 }
 function receive(state){
  world=state;layout();
  for(const person of Object.values(state.entities).filter(e=>e.kind==='Person')){
   const pose=person.spatial_pose;
   // A table/group annotation is never used as if it were a person's calibrated floor position.
   if(!pose||pose.coordinate_frame!=='supersplat-original'||pose.validated!==true||!Array.isArray(pose.position)||pose.position.length!==3||pose.position.some(v=>!Number.isFinite(v))){
    if(avatars.has(person.id))avatars.get(person.id).enabled=false;continue;
   }
   const entity=avatars.get(person.id);
   if(entity){
    entity.enabled=true;entity.setPosition(...pose.position);
    if(Number.isFinite(pose.yaw))entity.setEulerAngles(0,pose.yaw,0);
    if(entity.anim?.baseLayer){
     const name=pose.animation||'idle';if(entity.anim.baseLayer.activeState!==name)entity.anim.baseLayer.play(name);
     entity.anim.speed=0;entity.anim.baseLayer.activeStateCurrentTime=Date.parse(state.clock)/1000;
    }
   }
  }
  app.renderNextFrame=true;
 }
 window.addEventListener('office-world-changed',e=>receive(e.detail));
 window.addEventListener('office-mode-changed',e=>{security=e.detail==='Seguridad';panel.hidden=!security;layout();});
 window.addEventListener('resize',layout);
 async function loadAvatar(personId,url){
  if(avatars.has(personId))return avatars.get(personId);
  const {entity}=await createAvatar(app,url);entity.name=personId;entity.enabled=false;
  app.root.addChild(entity);avatars.set(personId,entity);
  if(world)receive(world);return entity;
 }
 // Opt-in loader; no avatar is spawned without a verified pose from Core.
 window.officeLoadAvatar=loadAvatar;
 window.officeVisualDiagnostics=()=>({cameraViews:cameras.length,activeCameras:cameras.filter(c=>c.enabled).length,worldClock:world?.clock||null,avatarsLoaded:avatars.size,avatarsPlaced:[...avatars.values()].filter(e=>e.enabled).map(e=>e.name),singleApplication:cameras.every(c=>c.parent===app.root),source:world?'original SSOG and authorized Core projection':'original SSOG authored viewpoints; Core disconnected'});
}
