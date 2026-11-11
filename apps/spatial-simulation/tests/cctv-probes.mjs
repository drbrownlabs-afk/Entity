// Simulator/calibration only. Unordered static probes are not an actor route.
import {chromium} from '@playwright/test';
import {mkdir,writeFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../../../',import.meta.url),label=process.env.P2_CCTV_PROBE_RUN||'refined1-open';
assert(/^[a-z0-9_-]+$/.test(label));
const runtime=new URL(`simulation/spatial-office/.runtime/cctv-probes-${label}/`,root),frames=new URL('frames/',runtime),evaluator=new URL('evaluator/',runtime);
try{await access(new URL('manifest.json',frames));throw Error('Probe run exists');}catch(error){if(error.code!=='ENOENT')throw error;}
await mkdir(frames,{recursive:true});await mkdir(evaluator,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.P2_CHROMIUM,headless:true,args:process.env.P2_CCTV_NATIVE==='1'?['--no-sandbox']:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const context=await browser.newContext({viewport:{width:1296,height:972},deviceScaleFactor:1});
 await context.addInitScript(()=>{const raf=requestAnimationFrame.bind(window);window.requestAnimationFrame=f=>f.name==='tick'?0:raf(f);});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5192/Entity/spatial-simulation/?cameraProfile=cctv-c&profileStorage=ignore');
 await page.waitForFunction(()=>window.cctvProfile,null,{timeout:180000});
 const meta=await page.evaluate(async open=>{
  if(open)for(const[id,door]of spatial.state.doors)if(id.includes('security')){door.fraction=1;door.target=1;}
  spatial.renderer.environmentUpdate(true);
  const names=['reception','waiting','cafe-social','cafe-bar','lounge','call-01','call-02','WC-access','lockers','print','white-sector-sofas','bistro-access','dining-1','dining-2','dining-3'];
  const points=[],seen=new Set();
  for(const name of names){const route=spatial.data.routes[name];for(const fraction of [0,.25,.5,.75,1]){const feet=route[Math.round((route.length-1)*fraction)],key=feet.map(v=>v.toFixed(2)).join(',');if(seen.has(key)||!spatial.collision.canStand(feet))continue;seen.add(key);points.push({region:name,feet});}}
  window.cctvSequence=await cctvProfile.sequence();
  return {profile:cctvProfile.profile(),points,door_scenario:open?'security doors explicitly open in simulator only':'closed default doors',fixture:cctvSequence.dummy,render_profile:cctvSequence.render_profile};
 },process.env.P2_CCTV_CLOSED!=='1');
 assert(meta.points.length>=20);
 meta.calibration=[];
 for(const camera of meta.profile.cameras){const background=await page.evaluate(id=>cctvSequence.background(id),camera.id);await writeFile(new URL('background-'+camera.id+'.png',frames),Buffer.from(background.png.split(',')[1],'base64'));meta.calibration.push(await page.evaluate(id=>({sensor_id:id,worldToCamera:Array.from(spatial.renderer.camera.getWorldTransform().clone().invert().data),projection:Array.from(spatial.renderer.camera.camera.projectionMatrix.data)}),camera.id));console.log('Probe background',camera.id);}
 const entries=[];
 for(let index=0;index<meta.points.length;index++){
  const probe=meta.points[index];
  for(const camera of meta.profile.cameras){const started=Date.now(),image=await page.evaluate(({id,feet})=>cctvSequence.frame(id,feet),{id:camera.id,feet:probe.feet}),bytes=Buffer.from(image.png.split(',')[1],'base64'),file=camera.id+'-'+String(index).padStart(4,'0')+'.png';await writeFile(new URL(file,frames),bytes);entries.push({camera_id:camera.id,frame_index:index,observed_at:new Date(Date.UTC(2026,10,11,12,0,0)+index*1000).toISOString(),media_time_seconds:index,file,sha256:createHash('sha256').update(bytes).digest('hex'),capture_duration_ms:Date.now()-started});
   // Evaluator-only amodal reference: clear depth after the real depth-tested
   // frame, leaving the architecture color intact. Never an inference input.
   const reference=await page.evaluate(()=>{const {app,camera}=spatial.renderer,d=app.graphicsDevice,[w,h]=cctvProfile.config.cameras[0].resolution;camera.camera.clearDepthBuffer=true;app.render();d.gl.finish();const pixels=new Uint8Array(w*h*4);d.setRenderTarget(camera.camera.renderTarget);d.updateBegin();d.readPixels(0,0,w,h,pixels);d.updateEnd();camera.camera.clearDepthBuffer=false;const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d'),img=ctx.createImageData(w,h);for(let y=0;y<h;y++)img.data.set(pixels.subarray((h-y-1)*w*4,(h-y)*w*4),y*w*4);ctx.putImageData(img,0,0);return canvas.toDataURL('image/png');});
   await writeFile(new URL(file,evaluator),Buffer.from(reference.split(',')[1],'base64'));
  }
  await page.evaluate(()=>cctvSequence.disableActor());console.log('Static calibration probe',index+1,'/',meta.points.length);
 }
 assert.deepEqual(errors,[]);
 await writeFile(new URL('manifest.json',frames),JSON.stringify({schema_version:'1.0',simulation_only:true,capture_fps:1,clock_source:'unordered static calibration stills; no trajectory or MOT claim',frames:entries},null,2));
 await writeFile(new URL('probes.json',evaluator),JSON.stringify({...meta,errors},null,2));
 console.log('Calibration capture complete:',entries.length,'frames');
}finally{await browser.close();}
