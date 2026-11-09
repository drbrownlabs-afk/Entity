// Opt-in capture adapter in the existing viewer. It never emits actor IDs or geometry to perception.
export async function installPerceptionCapture(spatial,base){
 const {renderer,state}=spatial,{app,camera}=renderer;
 const config=await fetch(base+'perception/cameras.json').then(r=>{if(!r.ok)throw Error('Camera calibration unavailable');return r.json();});
 state.playing=false;spatial.setHour(12);renderer.roof(true);spatial.quality.set('balanced');
 let captureSize='';
 function view(id){const c=config.cameras.find(c=>c.id===id);if(!c)throw Error('Unregistered camera');camera.setPosition(...c.position);camera.lookAt(...c.target);camera.camera.fov=c.vfov_deg;app.renderNextFrame=true;return c;}
 async function capture(id){const c=config.cameras.find(c=>c.id===id);if(!c)throw Error('Unregistered camera');const [w,h]=c.resolution;if(captureSize!==w+'x'+h){app.graphicsDevice.maxPixelRatio=1;app.setCanvasFillMode('NONE');app.setCanvasResolution('FIXED',w,h);app.resizeCanvas(w,h);captureSize=w+'x'+h;}view(id);app.renderNextFrame=true;app.render();await app.graphicsDevice.gl.finish();return {camera_id:id,png:document.querySelector('#scene').toDataURL('image/png'),worldToCamera:Array.from(camera.getWorldTransform().clone().invert().data),projection:Array.from(camera.camera.projectionMatrix.data)};}
 const controls=document.createElement('div'),label=document.createElement('p'),select=document.createElement('select');label.textContent='Cámaras virtuales de ensayo · no son equipos instalados';select.setAttribute('aria-label','Cámara virtual');for(const c of config.cameras)select.add(new Option(c.id+' · '+c.label,c.id));select.onchange=()=>view(select.value);controls.append(label,select);document.querySelector('#views').append(controls);
 return {config,capture,view,async sequence(){const {installSequence}=await import('./perception-sequence.js');return installSequence(spatial,{config,capture,view},base);}};
}
