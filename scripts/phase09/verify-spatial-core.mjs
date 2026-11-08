import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const api=process.env.OFFICE_API,web=process.env.OFFICE_WEB,credentials=JSON.parse(fs.readFileSync(process.env.OFFICE_CREDENTIALS,'utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={tested_commit:process.env.GITHUB_SHA||null,run_url:process.env.GITHUB_RUN_ID?'https://github.com/'+process.env.GITHUB_REPOSITORY+'/actions/runs/'+process.env.GITHUB_RUN_ID:null,scene:'https://superspl.at/scene/a972d838',source:'Original SSOG + Core routes measured from original floor + Rocketbox + PlayCanvas picker; simulated people, no physical camera or facial identity claim',checks:[]};
const calibration=JSON.parse(fs.readFileSync('docs/evidence/phase09/voxel-ground.json','utf8'));
const route=JSON.parse(fs.readFileSync('worlds/synthetic-office/corridor-route.json','utf8'));
report.physical_ground={source:calibration.collision_url,floor_clearance:calibration.floor_clearance,clear_capsule_samples:calibration.route_clearance.length,metric_scale_verified:false};
let token,lastPage;
const failures=[];
const save=()=>fs.writeFileSync('docs/evidence/phase09/spatial-core.json',JSON.stringify(report,null,2));
report.status='running';save();
const prefix='/v1/sites/synthetic-office/runs/day-01';
async function request(path,body){
 const result=await fetch(api+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});
 const value=await result.json();if(!result.ok)throw Error('Core '+result.status+': '+JSON.stringify(value));return value;
}
try{
 if(route.floor_source!=='original-official-voxel-ray'||calibration.route_clearance.some(p=>p.blocked)||JSON.stringify(route.floor_points)!==JSON.stringify(calibration.route_candidate))throw Error('Current original voxel ground/capsule validation does not match adopted route');
 token=(await request('/v1/office/auth/login',{username:'admin',password:credentials.admin.password})).token;
 const page=await browser.newPage({viewport:{width:1440,height:1000}});lastPage=page;page.on('pageerror',error=>failures.push(error.message));
 await page.goto(web+'/office.html?budget=.25&survey=1&survey_route_pose=0&survey_direction=hall',{waitUntil:'domcontentloaded'});
 if(!process.env.OFFICE_STATE_ONLY)await page.waitForFunction(()=>window.officeDiagnostics?.().loaded,undefined,{timeout:180000});
 await page.locator('#office-login [name=api]').fill(api);await page.locator('#office-login [name=username]').fill('admin');await page.locator('#office-login [name=password]').fill(credentials.admin.password);
 await page.locator('#office-login button').click();
 try{await page.waitForFunction(()=>window.officeCoreDiagnostics?.().connected&&window.officeVisualDiagnostics?.().avatarsPlaced.length===1,undefined,{timeout:process.env.OFFICE_STATE_ONLY?15000:90000});}
 catch(error){report.state=await page.evaluate(()=>({status:document.querySelector('#office-core-status')?.textContent,core:window.officeCoreDiagnostics?.(),visual:window.officeVisualDiagnostics?.()}));throw error;}
 if(process.env.OFFICE_STATE_ONLY){
 for(const second of [0,1,5,9,10]){
  const at=new Date(Date.parse('2026-11-07T14:15:00Z')+second*1000).toISOString();
  await request(prefix+'/commands',{id:crypto.randomUUID(),operation:'clock.advance',target:'site',inputs:{to:at}});
  await page.waitForFunction(clock=>Date.parse(window.officeVisualDiagnostics?.().worldClock)===Date.parse(clock),at,{timeout:30000});
  await page.waitForTimeout(200);
  const expected=(await request(prefix+'/world')).entities['PERSON-LUIS'].spatial_pose.position;
  const observed=await page.evaluate(()=>window.officeVisualDiagnostics().avatarsPlaced[0]?.position);
  report.checks.push({second,expected,observed});
  if(!observed||expected.some((v,i)=>Math.abs(v-observed[i])>.0001))throw Error('Core motion integration diverged: '+JSON.stringify(report.checks.at(-1)));
 }
 report.status='state-only; original scene NOT verified';await page.close();
}
 else{

 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('office-mode-changed',{detail:'Seguridad'})));
 await page.waitForTimeout(5000);
 const initial=await request(prefix+'/world');let identified=false;
 for(const second of [0,1,5,9,10]){
  const at=new Date(Date.parse('2026-11-07T14:15:00Z')+second*1000).toISOString();
  await request(prefix+'/commands',{id:crypto.randomUUID(),operation:'clock.advance',target:'site',inputs:{to:at}});
  await page.waitForFunction(clock=>Date.parse(window.officeVisualDiagnostics?.().worldClock)===Date.parse(clock),at,{timeout:30000});
  const world=await request(prefix+'/world');const expected=world.entities['PERSON-LUIS'].spatial_pose.position;
  const observed=await page.evaluate(()=>window.officeVisualDiagnostics());
  const placed=observed.avatarsPlaced.find(p=>p.id==='PERSON-LUIS');
  report.pose_check={second,expected,observed:placed,world_clock:world.clock,renderer_clock:observed.worldClock};
  if(!placed||expected.some((v,i)=>Math.abs(v-placed.position[i])>.0001))throw Error('Renderer pose diverged from Core: '+JSON.stringify(report.pose_check));
  report.stage='capture at '+second+' seconds';report.visual=observed;save();
  for(const camera of ['CAM-ROUTE-1','CAM-ROUTE-2']){
   const snapshot=await page.evaluate(async id=>window.officeCaptureCamera(id),camera);
   if(snapshot.payload.tracks.some(t=>t.local_track_id.includes('LUIS')||t.person_id))throw Error('Visual source fabricated identity');
   await request(prefix+'/observations',{observation_id:crypto.randomUUID(),site_id:'synthetic-office',source_id:camera,observed_at:at,type:'edge.presence',payload:snapshot.payload,provenance:snapshot.provenance});
   if(snapshot.payload.tracks.length){
    const current=await request(prefix+'/world');const track=current.entities[camera].tracks[0];
    await request(prefix+'/commands',{id:crypto.randomUUID(),operation:'identity.associate',target:track,inputs:{person_id:'PERSON-LUIS',credential_verified:true,evidence_type:'staff-verification'}});
    // The explicit simulated verification is separate from the anonymous rendered observation.
    const next=await page.evaluate(async id=>window.officeCaptureCamera(id),camera);
    await request(prefix+'/observations',{observation_id:crypto.randomUUID(),site_id:'synthetic-office',source_id:camera,observed_at:at,type:'edge.presence',payload:next.payload,provenance:next.provenance});
    identified=true;
   }
   report.checks.push({second,camera,visible:snapshot.payload.tracks.length,core_position:expected,rendered_position:placed.position,identity_from_image:false});save();
  }
  if(second===5){
   await page.locator('[data-camera="CAM-ROUTE-1"]').click();
   await page.locator('#office-camera-record').click();await page.waitForFunction(()=>document.querySelector('#office-core-status').textContent.includes('Observación virtual guardada en Core'));
   report.observation_saved_from_ui=true;
   await page.locator('#office-camera-expand').click();
   await page.locator('#scene').screenshot({path:'docs/evidence/phase09/spatial-person-floor.png',timeout:120000});
   await page.locator('#office-camera-expand').click();
  }
 }
 if(!identified)throw Error('No actual rendered person was selected by the camera picker');
 const history=await request(prefix+'/queries',{kind:'cameras_for_person',entity_id:'PERSON-LUIS'});
 const seen=[...new Set(history.result.map(r=>r.camera_id))];report.cameras_with_recorded_person=seen;
 if(!['CAM-ROUTE-1','CAM-ROUTE-2'].every(id=>seen.includes(id)))throw Error('Both camera observations were not recovered from Core history');
 await page.screenshot({path:'docs/evidence/phase09/spatial-core.png',fullPage:true,timeout:120000});
 report.pause=await page.evaluate(()=>window.officeVisualDiagnostics().avatarsPlaced);
 await page.waitForTimeout(1000);
 const paused=await page.evaluate(()=>window.officeVisualDiagnostics().avatarsPlaced);
 if(JSON.stringify(report.pause)!==JSON.stringify(paused))throw Error('Paused Core clock still moved people');
 await page.locator('#office-time').fill('2026-11-07T09:15:00');await page.locator('#office-reconstruct').click();
 await page.waitForFunction(()=>window.officeCoreDiagnostics().world.historical);
 const replay=await page.evaluate(()=>window.officeVisualDiagnostics().avatarsPlaced[0].position);
 if(initial.entities['PERSON-LUIS'].spatial_pose.position.some((v,i)=>Math.abs(v-replay[i])>.0001))throw Error('Historical pose reconstruction diverged');
 report.historical_pose=replay;report.status='passed';await page.close();
 }
}catch(error){
 report.status='failed';report.error=String(error);report.page_errors=failures;
 if(lastPage&&!lastPage.isClosed())report.visual=await lastPage.evaluate(()=>window.officeVisualDiagnostics?.()).catch(()=>null);
 if(lastPage&&!lastPage.isClosed())await lastPage.screenshot({path:'docs/evidence/phase09/spatial-core-failed.png',fullPage:true,timeout:30000}).catch(()=>{});
 throw error;
}
finally{if(process.env.GITHUB_RUN_ID){fs.mkdirSync('docs/evidence/phase09/spatial-runs',{recursive:true});fs.writeFileSync('docs/evidence/phase09/spatial-runs/'+process.env.GITHUB_RUN_ID+'.json',JSON.stringify(report,null,2));}fs.writeFileSync('docs/evidence/phase09/spatial-core.json',JSON.stringify(report,null,2));await browser.close();}
