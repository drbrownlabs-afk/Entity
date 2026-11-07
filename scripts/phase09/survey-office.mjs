import {createViewer} from '@playcanvas/supersplat-viewer/viewer';
import '@playcanvas/supersplat-viewer/viewer.css';
import original from '../../../../worlds/synthetic-office/original-viewer-settings.json';
import './office.css';
import inspectionCameras from '../../../../worlds/synthetic-office/inspection-cameras.json';

document.querySelector('#office-app').innerHTML='<header><a href="./">ENTITY</a><span>SYNTHETIC OFFICE / ARCHIVO ORIGINAL</span><b>argenzio · CC BY-NC 4.0</b></header><main><section class="tools"><span id="status" role="status">Cargando SSOG original…</span><button id="frame">Dollhouse</button><button id="reset">Interior</button><button id="walk">Caminar con colisiones</button></section><div id="scene"></div><section class="move"><button data-move="0,1">↑</button><button data-move="-1,0">←</button><button data-move="0,-1">↓</button><button data-move="1,0">→</button><span>Controles táctiles · geometría y voxels originales</span></section><section><h2>Inventario de anotaciones originales</h2><div id="annotations"></div><pre id="selection"></pre><p>Estas anotaciones proceden del archivo publicado por el autor. No se han inventado salas ni sustituido el edificio por una escena de prueba.</p><a href="https://superspl.at/scene/a972d838" target="_blank" rel="noopener">Abrir la publicación original ↗</a></section></main>';
const settings=structuredClone(original.settings);
settings.startMode='orbit';
const surveyPose=new URLSearchParams(location.search).get('survey_pose');
if(surveyPose!==null){
 const index=Number(surveyPose),values=original.settings.animTracks[0].keyframes.values;
 if(Number.isInteger(index)&&index>=0&&index<3){
  const position=values.position.slice(index*3,index*3+3);
  settings.cameras=[{initial:{position,target:values.target.slice(index*3,index*3+3),fov:85}}];
  // Camera-only inspection direction; never a semantic resource anchor.
  if(new URLSearchParams(location.search).get('survey_direction')==='hall')settings.cameras[0].initial.target=[position[0],position[1],position[2]-5];
 }
}
const routePose=new URLSearchParams(location.search).get('survey_route_pose');
if(routePose!==null){
 const position=inspectionCameras.poses[Number(routePose)];
 if(position)settings.cameras=[{initial:{position,target:[position[0]+5,position[1],position[2]],fov:85}}];
}
let viewer;
const base=import.meta.env.VITE_OFFICE_ASSET_BASE;
const contentUrl=base?new URL('lod-meta.json',base).href:original.contentUrl;
const collisionUrl=base?new URL('scene.voxel.json',base).href:original.collisionUrl;
const output=document.querySelector('#status');
function inspect(index){
  window.dispatchEvent(new CustomEvent('office-annotation-selected',{detail:index}));
  document.querySelector('#selection').textContent=JSON.stringify({annotation_index:index,...original.settings.annotations[index]},null,2);
}
original.settings.annotations.forEach((annotation,index)=>{
  const button=document.createElement('button');
  button.textContent=annotation.title;
  button.onclick=()=>{if(viewer?.state.loaded)viewer.selectAnnotation(index);inspect(index);};
  document.querySelector('#annotations').append(button);
});
try{
  viewer=await createViewer({container:document.querySelector('#scene'),settings,contentUrl,collisionUrl,renderer:'webgl',ui:true,reticle:true,budget:Math.max(.25,Math.min(4,Number(new URLSearchParams(location.search).get('budget'))||1)),framesInFlight:1});
  viewer.state.animationPaused=true;
  viewer.events.on('loaded:changed',loaded=>{if(loaded){output.textContent='SSOG original cargado · navegación oficial SuperSplat';viewer.resetCamera();}});
  viewer.events.on('selectedAnnotation:changed',index=>{if(index!==null)inspect(index);});
  viewer.events.on('error:changed',error=>{if(error)output.textContent='Error al cargar recurso original: '+String(error);});
}catch(error){output.textContent='No se pudo cargar el recurso original: '+error.message;}
document.querySelector('#frame').onclick=()=>{if(viewer?.state.loaded)viewer.frameScene();};
document.querySelector('#reset').onclick=()=>{if(viewer?.state.loaded)viewer.resetCamera();};
document.querySelector('#walk').onclick=()=>{
  if(viewer?.state.loaded){
    viewer.toggleWalk();
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
  mode:viewer?.state.cameraMode,source:'original-public-SSOG',substitute:false
});

window.addEventListener('office-select-annotation',event=>{if(viewer?.state.loaded)viewer.selectAnnotation(event.detail);});
import('./operations.js');

// Read-only scene survey, enabled only for reproducible inspection runs.
if(new URLSearchParams(location.search).has('survey')){
  let picker;
  viewer?.events.on('picker:ready',value=>{picker=value;});
  window.officeSurvey={
    frame:()=>viewer.frameScene(),
    seek:time=>{viewer.state.animationPaused=true;viewer.seek(time);},
    annotation:index=>viewer.selectAnnotation(index),
    camera:()=>{const c=viewer.app.root.findComponents('camera')[0];return {position:c.entity.getPosition().toArray(),rotation:c.entity.getRotation().toArray(),fov:c.fov};},
    pick:async(x,y)=>{const v=await picker?.pick(x,y);return v?.toArray()||null;}
  };
}

const {installVisuals}=await import('./visuals.js');
if(viewer)installVisuals(viewer,original);
