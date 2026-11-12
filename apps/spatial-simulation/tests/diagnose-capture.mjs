// 09.19 simulator-side timing only. No poses/actor IDs exported to inference.
import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../../../',import.meta.url),out=new URL('docs/spatial-simulation/evidence/p2-09/09.19/',root);
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.P2_CHROMIUM,headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1296,height:972},deviceScaleFactor:1});
 await context.addInitScript(()=>{const raf=requestAnimationFrame.bind(window);window.requestAnimationFrame=f=>f.name==='tick'?0:raf(f);});
 const page=await context.newPage();await page.goto('http://127.0.0.1:5192/Entity/spatial-simulation/?cameraProfile=cctv-c&profileStorage=ignore');
 await page.waitForFunction(()=>window.cctvProfile,null,{timeout:180000});
 const info=await page.evaluate(async()=>{
  for(const[id,door]of spatial.state.doors)if(id.includes('security')){door.fraction=1;door.target=1;}spatial.renderer.environmentUpdate(true);
  window.probeSequence=await cctvProfile.sequence();const gl=spatial.renderer.app.graphicsDevice.gl,ext=gl.getExtension('WEBGL_debug_renderer_info');
  const sensors=cctvProfile.profile().cameras.map(c=>c.id),before=performance.now();for(const id of sensors)await probeSequence.background(id);
  return {sensors,background_setup_ms:performance.now()-before,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),vendor:ext?gl.getParameter(ext.UNMASKED_VENDOR_WEBGL):null};
 });
 const rows=[];
 for(let cycle=0;cycle<4;cycle++)for(const sensor of info.sensors){
  const start=performance.now();const result=await page.evaluate(async id=>{
   const before=performance.now();const frame=await probeSequence.frame(id,[-2.2,spatial.collision.floorAt(-2.2,.8),.8],{yaw:0});
   return {frame,browser_ms:performance.now()-before};
  },sensor);
  const transfer_ms=performance.now()-start;rows.push({sensor,cycle,browser_ms:result.browser_ms,render_encode_transfer_ms:transfer_ms,png_bytes:Buffer.byteLength(result.frame.png.split(',')[1],'base64')});
 }
 const timed=rows.filter(r=>r.cycle>0),stats=values=>({n:values.length,p50:values.toSorted((a,b)=>a-b)[Math.floor((values.length-1)*.5)],p95:values.toSorted((a,b)=>a-b)[Math.floor((values.length-1)*.95)],sum:values.reduce((a,b)=>a+b,0)});
 const report={phase:'P2-09.19',renderer:info.renderer,vendor:info.vendor,independent_sensors:info.sensors.length,background_setup_ms_excluded:info.background_setup_ms,warmup_cycles_excluded:1,
  rgb_only_render_png_transfer_ms:stats(timed.map(r=>r.render_encode_transfer_ms)),browser_only_ms:stats(timed.map(r=>r.browser_ms)),
  per_sensor:Object.fromEntries(info.sensors.map(id=>[id,stats(timed.filter(r=>r.sensor===id).map(r=>r.render_encode_transfer_ms))])),
  limitations:['Native headless RGB screenshot probe, fixed synthetic entry stimulus','Includes PNG and browser-to-Node transfer; excludes filesystem/amodal evaluator pass','Short serial probe, not8-live-stream capacity or end-to-end latency','Renderer recorded here; cannot retroactively infer hardware for historical captures']};
 await writeFile(new URL('capture-probe.json',out),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await browser.close();}
