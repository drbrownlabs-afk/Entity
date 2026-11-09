// Functional browser proof; touch emulation does not claim physical-mobile performance.
import {existsSync} from 'node:fs';
import {chromium} from '@playwright/test';import assert from 'node:assert/strict';import {mkdir,writeFile} from 'node:fs/promises';
const folder=new URL('../../../docs/spatial-simulation/evidence/phase05-walk/',import.meta.url);await mkdir(folder,{recursive:true});
const url=process.env.SPATIAL_TEST_URL||'http://127.0.0.1:5180/Entity/spatial-simulation/';
const report={url,started_at:new Date().toISOString(),checks:[],errors:[],physical_mobile_tested:false};
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const check=(name,passed,detail)=>{report.checks.push({name,passed:!!passed,detail});assert.ok(passed,name+': '+JSON.stringify(detail));console.log('PASS',name);};
async function ready(page){await page.goto(url);await page.waitForFunction(()=>window.spatial?.ready,null,{timeout:180000});}
async function floorPoint(page){return page.evaluate(()=>{const s=spatial,c=s.renderer.camera,rect=document.querySelector('canvas').getBoundingClientRect();for(const z of [-2,-1.5,-1,-.5])for(const x of [-2.5,-2.4,-2.3]){const p=c.getPosition().clone().set(x,s.collision.floorAt(x,z),z),v=c.camera.worldToScreen(p);if(v.z>0&&v.x>15&&v.x<rect.width-15&&v.y>155&&v.y<rect.height-185&&s.collision.canStand(p.toArray()))return {x:v.x,y:v.y,goal:p.toArray()};}throw Error('No visible test floor point');});}
try{
 for(const touch of [false,true]){
  const scope=touch?'touch-emulation':'desktop',context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1100,height:760},isMobile:touch,hasTouch:touch,deviceScaleFactor:1});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push({scope,error:e.message}));page.on('response',r=>{if(r.status()>=400)report.errors.push({scope,url:r.url(),status:r.status()});});
  await ready(page);check(scope+'-all-source-records-loaded',await page.evaluate(()=>spatial.data.records.length>4400));
  if(process.env.SOURCE_SHA){const deployment=await page.evaluate(()=>fetch('deployment.json',{cache:'no-store'}).then(r=>r.json()));check(scope+'-public-source-commit',deployment.source_commit===process.env.SOURCE_SHA,deployment);}
  await page.locator('#walk').click();await page.evaluate(()=>{spatial.renderer.camera.setEulerAngles(-32,0,0);});
  const target=await floorPoint(page),before=await page.evaluate(()=>spatial.pose().feet);
  if(touch)await page.touchscreen.tap(target.x,target.y);else await page.mouse.click(target.x,target.y);
  check(scope+'-floor-input-starts-route',await page.evaluate(()=>!!spatial.navigator.destination),target);
  // Rendering on CI is software; advance the exact live controller without waiting for GPU frames.
  const result=await page.evaluate(()=>{const s=spatial;let p=s.pose().feet,allSafe=true;for(let i=0;i<1200&&s.navigator.destination;i++){const r=s.navigator.step(p,1/60);p=r.position;allSafe&&=s.collision.canStand(p);}s.setFeet(p);return {p,allSafe};});
  check(scope+'-arrival-with-valid-floor-and-clearance',result.allSafe&&Math.hypot(result.p[0]-target.goal[0],result.p[2]-target.goal[2])<.02,{before,...result});
  const old=await page.evaluate(()=>spatial.pose());await page.mouse.move(120,310);await page.mouse.down();await page.mouse.move(190,335,{steps:6});await page.mouse.up();
  check(scope+'-drag-looks-without-destination',await page.evaluate(old=>spatial.pose().yaw!==old.yaw&&spatial.navigator.destination===null,old));
  check(scope+'-no-joystick-or-arrow-controls',await page.locator('[data-move]').count()===0);
  await page.evaluate(()=>{spatial.view('meeting');});
  const tv=await page.evaluate(()=>{const s=spatial,d=s.data.devices.televisions.at(-1),r=s.data.records.find(r=>r.id===d.screen_id),p=r.bounds[0].map((v,i)=>(v+r.bounds[1][i])/2),v=s.renderer.camera.camera.worldToScreen(s.renderer.camera.getPosition().clone().set(...p));return {x:v.x,y:v.y,id:d.id};});
  // Ficha can be opened through the preserved entity selector on small screens too.
  await page.evaluate(id=>spatial.select(id),tv.id);await page.getByRole('button',{name:'Contenido de prueba',exact:true}).click();check(scope+'-TV-interaction-preserved',await page.evaluate(id=>spatial.state.screens.get(id).content==='test',tv.id));
  await page.evaluate(()=>{const s=spatial,id=s.data.devices.doors[0].id;s.select(id);});await page.getByRole('button',{name:'Abrir',exact:true}).click();check(scope+'-door-control-preserved',await page.evaluate(()=>spatial.state.doors.get(spatial.data.devices.doors[0].id).target===1));
  await page.evaluate(()=>{const s=spatial,id=s.data.devices.luminaires[0].id;s.state.light(id,{on:false,mode:'manual'});s.renderer.environmentUpdate(true);});check(scope+'-individual-light-off-preserved',await page.evaluate(()=>spatial.state.output(spatial.data.devices.luminaires[0].id)===0));
  await page.locator('#collapse').click();await page.locator('#general').click();check(scope+'-general-view-preserved',await page.evaluate(()=>spatial.pose().mode==='general'&&spatial.navigator.destination===null));
  await page.screenshot({path:new URL(scope+'.png',folder).pathname});await context.close();
 }
 check('no-browser-errors-or-failed-assets',report.errors.length===0,report.errors);report.functional_passed=true;
}catch(e){report.functional_passed=false;report.failure=e.stack;process.exitCode=1;console.error(e);}finally{report.finished_at=new Date().toISOString();await writeFile(new URL('browser.json',folder),JSON.stringify(report,null,2)+'\n');await browser.close();}
