// Simulator only: one-actor corpus; truth/reference images never share a worker mount.
import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../../../',import.meta.url),run=process.env.P2_TRIAL_RUN||'trial-a';assert(/^[a-z0-9_-]+$/.test(run));
const runtime=new URL(`simulation/spatial-office/.runtime/cctv-trial-${run}/`,root),frames=new URL('frames/',runtime),evaluator=new URL('evaluator/',runtime),plan=JSON.parse(await readFile(new URL('plan.json',evaluator),'utf8'));
try{await access(new URL('manifest.json',frames));throw Error('Never overwrite a captured corpus');}catch(error){if(error.code!=='ENOENT')throw error;}
await mkdir(frames,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.P2_CHROMIUM,headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1296,height:972},deviceScaleFactor:1});await context.addInitScript(()=>{const raf=requestAnimationFrame.bind(window);window.requestAnimationFrame=f=>f.name==='tick'?0:raf(f);});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5192/Entity/spatial-simulation/?cameraProfile=cctv-c&profileStorage=ignore');await page.waitForFunction(()=>window.cctvProfile,null,{timeout:180000});
 const meta=await page.evaluate(async internalId=>{
  for(const[id,door]of spatial.state.doors)if(id.includes('security')){door.fraction=1;door.target=1;}spatial.renderer.environmentUpdate(true);window.cctvSequence=await cctvProfile.sequence();
  spatial.renderer.app.root.findByName('Temporary dummy placement wrapper').name=internalId;
  return {profile:cctvProfile.profile(),dummy:cctvSequence.dummy,render_profile:cctvSequence.render_profile};
 },plan.internal_actor_id);
 assert(meta.render_profile.includes('explicitly stored depth texture'));
 for(const camera of meta.profile.cameras){const image=await page.evaluate(id=>cctvSequence.background(id),camera.id);await writeFile(new URL('background-'+camera.id+'.png',frames),Buffer.from(image.png.split(',')[1],'base64'));console.log('Trial background',camera.id);}
 const entries=[],truth=[];
 const sample=Number(process.env.P2_TRIAL_SAMPLE||0);assert(Number.isInteger(sample)&&sample>=0);const steps=sample?plan.frames.slice(0,sample):plan.frames;
 for(const step of steps){
  const actual=await page.evaluate(step=>{const feet=[step.feet[0],spatial.collision.floorAt(step.feet[0],step.feet[2]),step.feet[2]];if(!spatial.collision.canStand(feet))throw Error('Actor stimulus blocked by physical collision');return {...step,feet};},step);truth.push(actual);
  for(const camera of meta.profile.cameras){
   const start=Date.now(),image=await page.evaluate(({id,feet,yaw})=>cctvSequence.frame(id,feet,{yaw}),{id:camera.id,feet:actual.feet,yaw:actual.yaw_degrees});const bytes=Buffer.from(image.png.split(',')[1],'base64'),file=camera.id+'-'+String(step.frame_index).padStart(4,'0')+'.png';await writeFile(new URL(file,frames),bytes);
   entries.push({camera_id:camera.id,frame_index:step.frame_index,observed_at:new Date(Date.UTC(2026,10,11,14+(plan.variant||0),0,0)+actual.media_time_seconds*1000).toISOString(),media_time_seconds:actual.media_time_seconds,file,sha256:createHash('sha256').update(bytes).digest('hex'),capture_duration_ms:Date.now()-start});
   const reference=await page.evaluate(()=>{const {app,camera}=spatial.renderer,d=app.graphicsDevice,[w,h]=cctvProfile.config.cameras[0].resolution;camera.camera.clearDepthBuffer=true;app.render();d.gl.finish();const pixels=new Uint8Array(w*h*4);d.setRenderTarget(camera.camera.renderTarget);d.updateBegin();d.readPixels(0,0,w,h,pixels);d.updateEnd();camera.camera.clearDepthBuffer=false;const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d'),img=ctx.createImageData(w,h);for(let y=0;y<h;y++)img.data.set(pixels.subarray((h-y-1)*w*4,(h-y)*w*4),y*w*4);ctx.putImageData(img,0,0);return canvas.toDataURL('image/png');});
   await writeFile(new URL(file,evaluator),Buffer.from(reference.split(',')[1],'base64'));
  }
  await page.evaluate(()=>cctvSequence.disableActor());if(step.frame_index%20===0)console.log('Trial instant',step.frame_index,'/',plan.frames.length);
 }
 assert.deepEqual(errors,[]);
 await writeFile(new URL('manifest.json',frames),JSON.stringify({schema_version:'1.0',simulation_only:true,capture_fps:plan.capture_fps,clock_source:'Scenario UTC media time; independent render walltime measured per captured frame',frames:entries},null,2));
 await writeFile(new URL('truth.json',evaluator),JSON.stringify({...meta,internal_actor_id:plan.internal_actor_id,actors:1,frames:truth,errors},null,2));
 await writeFile(new URL('capture-complete.json',runtime),JSON.stringify({complete:true,sample_only:!!sample,instants:truth.length,images:entries.length,manifest_sha256:createHash('sha256').update(await readFile(new URL('manifest.json',frames))).digest('hex')},null,2));console.log('Single actor corpus complete:',entries.length,'images');
}finally{await browser.close();}
