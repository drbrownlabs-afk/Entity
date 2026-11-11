import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../../../',import.meta.url),label=process.env.P2_CCTV_EVIDENCE||'initial';
assert(/^[a-z0-9_-]+$/.test(label));
const output=new URL(`docs/spatial-simulation/evidence/p2-09/09.12/${label}/`,root);
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.P2_CHROMIUM,headless:true,args:process.env.P2_CCTV_NATIVE==='1'?['--no-sandbox']:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],rows=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await context.addInitScript(()=>{const raf=requestAnimationFrame.bind(window);window.requestAnimationFrame=f=>f.name==='tick'?0:raf(f);});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5192/Entity/spatial-simulation/?cameraProfile=cctv-c&profileStorage=ignore');
 await page.waitForFunction(()=>window.cctvProfile,null,{timeout:180000});
 const original=await page.evaluate(()=>cctvProfile.profile());
 const renderDevice=await page.evaluate(()=>{const gl=spatial.renderer.app.graphicsDevice.gl,ext=gl.getExtension('WEBGL_debug_renderer_info');return {vendor:gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),renderer:gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)};});
 assert.equal(original.devices.length,5);assert.equal(original.cameras.length,8);assert.equal(new Set(original.cameras.map(c=>c.id)).size,8);
 await page.evaluate(()=>{spatial.renderer.app.fire('update',.016);spatial.renderer.app.render();});
 await page.screenshot({path:new URL('editor-top.png',output).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});
 // Change a support and head independently; verify save/reload and canonical reset.
 const originalX=original.cameras[0].position[0];
 await page.getByLabel('X',{exact:true}).fill(String(originalX+.1));await page.getByLabel('X',{exact:true}).dispatchEvent('change');
 const moved=await page.evaluate(()=>cctvProfile.profile());
 assert(moved.cameras.filter(c=>c.device_id==='C').every(c=>Math.abs(c.position[0]-originalX-.1)<1e-9));
 const yaw=page.getByLabel('Giro horizontal °',{exact:true}),oldYaw=Number(await yaw.inputValue());
 await yaw.fill(String(oldYaw+5));await yaw.dispatchEvent('change');
 const oriented=await page.evaluate(()=>cctvProfile.profile());
 assert.notDeepEqual(oriented.cameras[0].target,moved.cameras[0].target);
 for(let i=1;i<8;i++)assert.deepEqual(oriented.cameras[i].target,moved.cameras[i].target);
 await page.getByRole('button',{name:'Guardar perfil',exact:true}).click();
 await page.goto('http://127.0.0.1:5192/Entity/spatial-simulation/?cameraProfile=cctv-c');
 await page.waitForFunction(()=>window.cctvProfile,null,{timeout:180000});
 assert(Math.abs((await page.evaluate(()=>cctvProfile.profile())).cameras[0].position[0]-originalX-.1)<1e-9);
 assert.deepEqual((await page.evaluate(()=>cctvProfile.profile())).cameras[0].target,oriented.cameras[0].target);
 await page.getByRole('button',{name:'Restablecer candidato',exact:true}).click();
 const doorScenario=await page.evaluate(()=>{for(const[id,door]of spatial.state.doors)if(id.includes('security')){door.fraction=1;door.target=1;}spatial.renderer.environmentUpdate(true);return 'security doors explicitly open in simulator only; fixed headers retained';});
 const metadataGuard=await page.evaluate(()=>{try{cctvProfile.validate({...cctvProfile.profile(),actor_id:'not-allowed'});return false;}catch{return true;}});
 assert(metadataGuard);
 const nestedGuards=await page.evaluate(()=>{
  const attempts=[p=>{p.devices[0].actor_id='forbidden';},p=>{p.cameras[0].distortion.actor_id='forbidden';},p=>{p.cameras[0].simulation_only=false;},p=>{p.cameras[0].resolution=[1920,1080];}];
  return attempts.map(change=>{const p=cctvProfile.profile();change(p);try{cctvProfile.validate(p);return false;}catch{return true;}});
 });assert(nestedGuards.every(Boolean));
 for(const camera of original.cameras){
  const start=Date.now(),frame=await page.evaluate(id=>cctvProfile.capture(id),camera.id);
  await writeFile(new URL(camera.id+'.png',output),Buffer.from(frame.png.split(',')[1],'base64'));
  delete frame.png;rows.push({...frame,wall_capture_ms:Date.now()-start});console.log('Captured sensor',camera.id,'in',Date.now()-start,'ms');
 }
 await page.evaluate(()=>{cctvProfile.top();spatial.renderer.app.fire('update',.016);spatial.renderer.app.render();});
 await page.screenshot({path:new URL('editor-final.png',output).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});
 assert.deepEqual(errors,[]);
 await writeFile(new URL('calibration.json',output),JSON.stringify({phase:'P2-09.12',passed:false,awaiting_pixel_coverage_validation:true,render_device:renderDevice,door_scenario:doorScenario,devices:5,sensors:8,persistence_roundtrip:true,central_support_moves_all_heads:true,metadata_guard_passed:metadataGuard,nested_metadata_guards:nestedGuards,profile:original,cameras:rows,errors},null,2));
}finally{await browser.close();}
