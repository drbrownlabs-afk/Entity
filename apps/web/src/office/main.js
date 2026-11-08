import {ShaderChunks} from 'playcanvas';
import {createViewer} from '@playcanvas/supersplat-viewer/viewer';
import '@playcanvas/supersplat-viewer/viewer.css';
import original from '../../../../worlds/synthetic-office/original-viewer-settings.json';
import './office.css';
import semanticAnnotations from '../../../../worlds/synthetic-office/semantic-annotations.json';
import viewBookmarks from '../../../../worlds/synthetic-office/view-bookmarks.json';
import inspectionCameras from '../../../../worlds/synthetic-office/inspection-cameras.json';

document.querySelector('#office-app').innerHTML='<header><a href="./">ENTITY</a><span>SYNTHETIC OFFICE / ARCHIVO ORIGINAL</span><b>argenzio · CC BY-NC 4.0</b></header><main><section class="tools"><span id="status" role="status">Cargando SSOG original…</span><button id="frame">Dollhouse</button><button id="reset">Interior</button><button id="walk">Caminar con colisiones</button></section><div id="scene"></div><section class="move"><button data-move="0,1">↑</button><button data-move="-1,0">←</button><button data-move="0,-1">↓</button><button data-move="1,0">→</button><span>Controles táctiles · geometría y voxels originales</span></section><section><h2>Inventario espacial</h2><div id="annotations"></div><pre id="selection"></pre><p>A/B y reunión conservan sus anotaciones originales. Espera y descanso se identificaron en la escena; los puntos aún no calibrados permanecen pendientes.</p><a href="https://superspl.at/scene/a972d838" target="_blank" rel="noopener">Abrir la publicación original ↗</a></section></main>';
const settings=structuredClone(original.settings);
settings.startMode='orbit';
settings.annotations.push(...structuredClone(semanticAnnotations));
const overviewIndex=settings.annotations.length;settings.annotations.push(...structuredClone(viewBookmarks));
let clippedOverview=false;
const surveyPose=new URLSearchParams(location.search).get('survey_pose');
if(surveyPose!==null){
 const index=Number(surveyPose),values=original.settings.animTracks[0].keyframes.values;
 if(Number.isInteger(index)&&index>=0&&index<3){
  const position=values.position.slice(index*3,index*3+3);
  settings.cameras=[{initial:{position,target:values.target.slice(index*3,index*3+3),fov:85}}];
  // Camera-only inspection direction; never a semantic resource anchor.
  const direction=new URLSearchParams(location.search).get('survey_direction');
  if(direction==='hall')settings.cameras[0].initial.target=[position[0],position[1],position[2]-5];
  if(direction==='left')settings.cameras[0].initial.target=[position[0]-5,position[1],position[2]];
  if(direction==='back')settings.cameras[0].initial.target=[position[0],position[1],position[2]+5];
 }
}
const routePose=new URLSearchParams(location.search).get('survey_route_pose');
if(routePose!==null){
 const position=inspectionCameras.poses[Number(routePose)];
 if(position){
  const down=new URLSearchParams(location.search).get('survey_direction')==='down';
  settings.cameras=[{initial:{position,target:down?[position[0],position[1]-5,position[2]+.0001]:new URLSearchParams(location.search).get('survey_direction')==='hall'?[position[0],position[1],position[2]-5]:[position[0]+5,position[1],position[2]],fov:85}}];
 }
}
// Inspection camera transforms only; these never define entity positions or routes.
if(new URLSearchParams(location.search).has('survey')){
 const direction=new URLSearchParams(location.search).get('survey_direction');
 const between=new URLSearchParams(location.search).get('survey_midpoint');
 if(between!==null){const index=Number(between),a=inspectionCameras.poses[index],b=inspectionCameras.poses[index+1];if(a&&b)settings.cameras[0].initial.position=a.map((value,i)=>(value+b[i])/2);}
 const eye=new URLSearchParams(location.search).get('survey_annotation_eye');
 if(eye!==null){
  const index=Number(eye),annotation=original.settings.annotations[index],values=original.settings.animTracks[0].keyframes.values;
  if(annotation&&[0,2].includes(index)){const position=[...annotation.position];position[1]+=1.2;settings.cameras=[{initial:{position,target:values.position.slice(index===0?3:6,index===0?6:9),fov:100}}];}
 }
 const camera=settings.cameras[0].initial;
 if(direction==='overview-right'){camera.position=[...camera.position];camera.position[1]+=1.2;camera.target=[camera.position[0]+5,camera.position[1]-3,camera.position[2]];}
 if(direction==='topdown'){const a=original.settings.annotations[2].position,b=inspectionCameras.poses.at(-1),front=original.settings.annotations[3].position;const center=[a[0],-1.85,(front[2]+b[2])/2];const far=new URLSearchParams(location.search).get('survey_plan')==='far';if(far)center[2]=b[2];camera.position=[center[0],center[1]+(far?12:20),center[2]];camera.target=[center[0],center[1],center[2]+.0001];camera.fov=90;}
 if(direction==='front-down'){camera.target=[camera.position[0]-3,camera.position[1]-2,camera.position[2]+2];}
}
let viewer;
const base=import.meta.env.VITE_OFFICE_ASSET_BASE;
const contentUrl=base?new URL('lod-meta.json',base).href:original.contentUrl;
const collisionUrl=base?new URL('scene.voxel.json',base).href:original.collisionUrl;
const output=document.querySelector('#status');
function inspect(index){
  if(settings.annotations[index]?.extras?.view_only)return;clippedOverview=false;
  window.dispatchEvent(new CustomEvent('office-annotation-selected',{detail:index}));
  document.querySelector('#selection').textContent=JSON.stringify({annotation_index:index,...settings.annotations[index]},null,2);
}
settings.annotations.forEach((annotation,index)=>{
  if(annotation.extras?.view_only)return;const button=document.createElement('button');
  button.textContent=annotation.title;
  button.onclick=()=>{if(viewer?.state.loaded)viewer.selectAnnotation(index);inspect(index);};
  document.querySelector('#annotations').append(button);
});
try{
  viewer=await createViewer({container:document.querySelector('#scene'),settings,contentUrl,collisionUrl,renderer:'webgl',ui:true,reticle:true,budget:Math.max(.25,Math.min(4,Number(new URLSearchParams(location.search).get('budget'))||1)),framesInFlight:1});
  viewer.state.animationPaused=true;
  { // Public view bookmark and inspection share the official camera/chunk path.
   // Official chunk extension: the default splat shader clamps depth to the near plane
   // instead of clipping. Respect that plane for this inspection camera without editing assets.
   const chunks=ShaderChunks.get(viewer.app.graphicsDevice,'glsl'),center=chunks.get('gsplatCenterVS');
   const marker='vec4 centerProj = matrix_projection * centerView;';
   if(!center?.includes(marker))throw Error('Official splat projection changed; inspect camera clipping before proceeding.');
   chunks.set('gsplatCenterVS',center.replace(marker,'if (-centerView.z < camera_params.z) return false;\n'+marker));
   const inspectionPlan=new URLSearchParams(location.search).get('survey_direction')==='topdown';
   if(inspectionPlan){viewer.state.controlsHidden=true;viewer.state.showAnnotations=false;}
   viewer.app.on('update',()=>{const c=viewer.app.root.findComponents('camera')[0];c.nearClip=(clippedOverview||inspectionPlan)&&c.entity.forward.y<-.1?Math.max(.01,(c.entity.getPosition().y-.5)/(-c.entity.forward.y)):.01;});
  }
  viewer.events.on('loaded:changed',loaded=>{if(loaded){output.textContent='SSOG original cargado · navegación oficial SuperSplat';viewer.resetCamera();}});
  viewer.events.on('selectedAnnotation:changed',index=>{if(index!==null)inspect(index);});
  viewer.events.on('error:changed',error=>{if(error)output.textContent='Error al cargar recurso original: '+String(error);});
}catch(error){output.textContent='No se pudo cargar el recurso original: '+error.message;}
document.querySelector('#frame').onclick=()=>{if(viewer?.state.loaded){clippedOverview=true;viewer.selectAnnotation(overviewIndex);viewer.events.fire('inputEvent','cancel');output.textContent='Vista superior del SSOG original · recorte de cámara; navega con órbita y zoom';}};
document.querySelector('#reset').onclick=()=>{if(viewer?.state.loaded){clippedOverview=false;viewer.resetCamera();}};
document.querySelector('#walk').onclick=()=>{
  if(viewer?.state.loaded){
    clippedOverview=false;viewer.toggleWalk();
    output.textContent=viewer.state.walkAllowed?'Caminar · colisiones voxelizadas originales activas':'Colisiones aún no disponibles: no se declara navegación validada';
  }
};
for(const button of document.querySelectorAll('[data-move]')){
  const stop=()=>{if(viewer?.state.loaded)viewer.setMoveInput(0,0);};
  button.onpointerdown=event=>{
    event.preventDefault();
    if(viewer?.state.loaded){
      viewer.state.cameraMode=viewer.state.walkAllowed?'walk':'fly';
      viewer.setMoveInput(...button.dataset.move.split(',').map(Number));
      button.setPointerCapture(event.pointerId);
    }
  };
  button.onpointerup=stop;button.onpointercancel=stop;button.onlostpointercapture=stop;
}
window.officeDiagnostics=()=>({
  sceneUrl:contentUrl,collisionUrl,loaded:viewer?.state.loaded||false,
  walkAllowed:viewer?.state.walkAllowed||false,annotations:viewer?.annotations||[],
  overview:clippedOverview,camera:viewer?(()=>{const c=viewer.app.root.findComponents('camera')[0];return {position:c.entity.getPosition().toArray(),forward:c.entity.forward.toArray(),near_clip:c.nearClip};})():null,mode:viewer?.state.cameraMode,source:'original-public-SSOG',substitute:false
});

window.addEventListener('office-select-annotation',event=>{if(viewer?.state.loaded)viewer.selectAnnotation(event.detail);});
let projectedWorld=null;
const personalProjection=new URLSearchParams(location.search).get('projection')==='personal';
if(!personalProjection)import('./operations.js');
else{
 document.querySelector('#office-app header').hidden=true;
 const cameraButton=document.createElement('button');cameraButton.textContent='Mis cámaras autorizadas';cameraButton.hidden=true;
 let projectedSecurity=false;cameraButton.onclick=()=>{projectedSecurity=!projectedSecurity;window.dispatchEvent(new CustomEvent('office-mode-changed',{detail:projectedSecurity?'Seguridad':'Operaciones'}));};
 document.querySelector('.tools').append(cameraButton);
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==window.parent)return;
  if(event.data?.type==='entity-authorized-world'){
   projectedWorld=event.data.world;cameraButton.hidden=!Object.values(projectedWorld?.entities||{}).some(e=>e.kind==='Camera');
   if(event.data.world)window.dispatchEvent(new CustomEvent('office-world-changed',{detail:event.data.world}));
   else window.dispatchEvent(new CustomEvent('office-world-cleared'));
  }
  if(event.data?.type==='entity-observer-capable')window.dispatchEvent(new CustomEvent('office-observer-enabled',{detail:event.data.enabled===true}));
  if(event.data?.type==='entity-camera-saved')window.dispatchEvent(new CustomEvent('office-capture-completed'));
  if(event.data?.type==='entity-select-resource'){const i=projectedWorld?.entities?.[event.data.id]?.annotation_index;if(Number.isInteger(i)&&viewer.state.selectedAnnotation!==i)viewer.selectAnnotation(i);}
 });
 window.addEventListener('office-capture-request',async event=>{try{const snapshot=await window.officeCaptureCamera(event.detail);window.parent.postMessage({type:'entity-camera-snapshot',snapshot},location.origin);}catch(error){document.querySelector('#status').textContent=error.message;window.dispatchEvent(new CustomEvent('office-capture-completed'));}});
 window.addEventListener('office-annotation-selected',event=>window.parent.postMessage({type:'entity-annotation-selection',index:event.detail},location.origin));
 window.addEventListener('office-select-entity',event=>window.parent.postMessage({type:'entity-resource-selection',id:event.detail},location.origin));
 window.officeProjectionDiagnostics=()=>({run_id:projectedWorld?.run_id||null,clock:projectedWorld?.clock||null,entity_ids:Object.keys(projectedWorld?.entities||{}),camera_ids:Object.values(projectedWorld?.entities||{}).filter(e=>e.kind==='Camera').map(e=>e.id)});
 window.parent.postMessage({type:'entity-projection-ready'},location.origin);
}

// Read-only scene survey, enabled only for reproducible inspection runs.
if(new URLSearchParams(location.search).has('survey')){
  let picker;
  viewer?.events.on('picker:ready',value=>{picker=value;});
  window.officeSurvey={
    frame:()=>viewer.frameScene(),
    seek:time=>{viewer.state.animationPaused=true;viewer.seek(time);},
    annotation:index=>viewer.selectAnnotation(index),
    camera:()=>{const c=viewer.app.root.findComponents('camera')[0];return {position:c.entity.getPosition().toArray(),rotation:c.entity.getRotation().toArray(),fov:c.fov,near_clip:c.nearClip,far_clip:c.farClip};},
    ray:(x,y)=>{const c=viewer.app.root.findComponents('camera')[0],r=viewer.app.graphicsDevice.clientRect;const a=c.screenToWorld(x*r.width,y*r.height,c.nearClip),b=c.screenToWorld(x*r.width,y*r.height,c.farClip);const d=b.clone().sub(a);const length=d.length();d.normalize();return {origin:a.toArray(),direction:d.toArray(),length};},
    pick:async(x,y)=>{const v=await picker?.pick(x,y);return v?.toArray()||null;}
  };
}

const {installVisuals}=await import('./visuals.js');
if(viewer){installVisuals(viewer,original);if(projectedWorld)window.dispatchEvent(new CustomEvent('office-world-changed',{detail:projectedWorld}));}
