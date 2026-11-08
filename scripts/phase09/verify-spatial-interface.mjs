import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const web=process.env.OFFICE_WEB||'http://127.0.0.1:4175',stateOnly=process.env.OFFICE_STATE_ONLY==='1';
const report={tested_commit:process.env.GITHUB_SHA||null,run_url:process.env.GITHUB_RUN_ID?'https://github.com/'+process.env.GITHUB_REPOSITORY+'/actions/runs/'+process.env.GITHUB_RUN_ID:null,source:'Native ENTITY spatial interface, ORIGINAL published SSOG, actual Core-generated trace and normalized synthetic session actions',public_url:web,checks:[]};
const output=stateOnly?'.runtime/phase09/native-interface-state.json':'docs/evidence/phase09/native-interface.json';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});let lastPage;
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000},hasTouch:width<700,isMobile:width<700});const page=await context.newPage();lastPage=page;const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(web+'/office.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.officeSpatialApp,undefined,{timeout:30000});
  if(!stateOnly)await page.waitForFunction(()=>window.officeSpatialApp.diagnostics().loaded,undefined,{timeout:180000});
  await page.waitForFunction(()=>window.officeSpatialApp.diagnostics().visual.avatarsPlaced.length===2,undefined,{timeout:90000});
  const initial=await page.evaluate(()=>window.officeSpatialApp.diagnostics());
  if(initial.nativeUi||initial.view!=='dollhouse'||initial.mode!=='synthetic-replay'||initial.coreConnected)throw Error('Wrong product mode or exposed renderer UI');
  if(await page.locator('#office-login:visible,.sse-ui:visible,#annotations:visible').count())throw Error('Technical/renderer UI is visible in public product');
  for(const id of stateOnly?[]:['A','B','C','D','PERSON-CARLOS','PERSON-LUIS'])if(!initial.markers.includes(id))throw Error('Original/Core entity is not visible: '+id);
  const check={width,original_loaded:initial.loaded,native_renderer_ui:false,visible_people:initial.visual.avatarsPlaced,core_connected:false,mode:initial.mode};report.checks.push(check);
  await page.screenshot({path:stateOnly?'.runtime/phase09/native-state-'+width+'.png':'docs/evidence/phase09/native-dollhouse-'+width+'.png',timeout:120000});
  const select=async id=>stateOnly?page.evaluate(id=>window.officeSpatialApp.select(id),id):(width<700?page.locator('#world-markers [data-entity="'+id+'"]').tap():page.locator('#world-markers [data-entity="'+id+'"]').click());
  await select('PERSON-CARLOS');
  await page.waitForFunction(()=>document.querySelector('#context-body h1')?.textContent==='Carlos');
  await page.locator('[data-tab="Relaciones"]').click();await page.waitForFunction(()=>document.querySelector('#context-body').textContent.includes('belongsTo'));
  if(!(await page.locator('#context-body').innerText()).includes('Entity'))throw Error('Context does not resolve Carlos graph from the model');
  check.person_graph=true;
  await page.screenshot({path:stateOnly?'.runtime/phase09/native-state-person-'+width+'.png':'docs/evidence/phase09/native-person-'+width+'.png',timeout:120000});
  await page.locator('#close-context').click();await select('CAM-ROUTE-1');if(stateOnly)await page.locator('#context-actions button').filter({hasText:'Abrir feed'}).click();
  await page.waitForFunction(()=>window.officeSpatialApp.diagnostics().feed);
  if(!stateOnly)await page.waitForFunction(()=>window.officeSpatialApp.diagnostics().visual.cameraRenderState.some(c=>c.managers.some(m=>m.splats>0&&!m.pending)),undefined,{timeout:90000});
  if(!(await page.locator('#context-body').innerText()).includes('SIMULADA'))throw Error('Virtual camera not labelled simulated');
  if(await page.evaluate(()=>window.officeSpatialApp.diagnostics().visual.activeCameras)!==1)throw Error('Selected feed not rendered in the same application');
  check.camera_feed=true;check.resident_original_feed=!stateOnly;
  if(!stateOnly){await page.locator('#context-actions button').filter({hasText:'Capturar evidencia de sesión'}).click();await page.waitForFunction(()=>Object.values(window.officeSpatialApp.getWorld().entities).some(x=>x.kind==='Track'&&x.scope==='demo-session-not-Core'),undefined,{timeout:30000});check.rendered_normalized_session_observation=true;}
  await page.screenshot({path:stateOnly?'.runtime/phase09/native-state-feed-'+width+'.png':'docs/evidence/phase09/native-feed-'+width+'.png',timeout:120000});
  await page.locator('#return-world').click();await page.locator('#close-context').click();
  await select('A');await page.waitForFunction(()=>document.querySelector('#context-body').textContent.includes('oficina se reserva'));
  const selectBefore=await page.evaluate(()=>window.officeSpatialApp.getSelected());
  if(!stateOnly)await page.locator('.view-controls [data-view="interior"]').click();if(!stateOnly)await page.waitForFunction(()=>window.officeSpatialApp.diagnostics().view==='interior');
  await page.locator('.view-controls [data-view="dollhouse"]').click();if(await page.evaluate(()=>window.officeSpatialApp.getSelected())!==selectBefore)throw Error('Navigation lost entity selection');
  check.view_roundtrip_keeps_selection=true;
  await page.locator('#close-context').click();await select('C');await page.waitForFunction(()=>document.querySelectorAll('.desk-grid button').length===6);
  await page.locator('.desk-grid [data-open="C1"]').click();await page.waitForFunction(()=>document.querySelector('#context-body h1')?.textContent==='Puesto C1');
  const originalTime=await page.evaluate(()=>window.officeSpatialApp.getWorld().clock);
  await page.locator('#clock-play').click();await page.waitForTimeout(1200);await page.locator('#clock-play').click();
  if(Date.parse(await page.evaluate(()=>window.officeSpatialApp.getWorld().clock))<=Date.parse(originalTime))throw Error('Shared replay clock did not advance');
  const paused=await page.evaluate(()=>window.officeSpatialApp.getWorld().clock);await page.waitForTimeout(300);if(await page.evaluate(()=>window.officeSpatialApp.getWorld().clock)!==paused)throw Error('Paused replay moved');
  check.shared_clock_pause=true;
  await page.locator('.reservation-control summary').click();await page.locator('#context-actions select[aria-label="Capacidad autorizada"]').selectOption({label:'Crear reserva'});
  const form=page.locator('#context-actions form');const bookingId=await form.locator('[name=booking_id]').inputValue();await form.locator('[name=starts_at]').fill('2026-11-07T09:30');await form.locator('[name=ends_at]').fill('2026-11-07T10:00');
  await form.getByRole('button',{name:'Ejecutar con autorización'}).click();await page.waitForFunction(id=>!!window.officeSpatialApp.getWorld().entities[id],bookingId);
  if(await page.evaluate(id=>window.officeSpatialApp.getWorld().entities[id].scope,bookingId)!=='demo-session-not-Core')throw Error('Local simulation pretended Core persistence');
  check.session_booking=true;
  await page.locator('[data-tab="Memoria"]').click();await page.waitForFunction(()=>document.querySelector('#context-body').textContent.includes('No hay vídeo histórico'));
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Responsive viewport overflow');
  if(errors.length)throw Error(errors.join('; '));check.errors=errors;
  await page.screenshot({path:stateOnly?'.runtime/phase09/native-state-memory-'+width+'.png':'docs/evidence/phase09/native-memory-'+width+'.png',timeout:120000});
  await context.close();
 }
 report.status=stateOnly?'state-only; original scene NOT verified':'passed';
}catch(error){report.status='failed';report.error=String(error);if(lastPage&&!lastPage.isClosed()){report.last_state=await lastPage.evaluate(()=>({status:document.querySelector('#scene-status')?.textContent,app:window.officeSpatialApp?.diagnostics()})).catch(()=>null);await lastPage.screenshot({path:stateOnly?'.runtime/phase09/native-state-failure.png':'docs/evidence/phase09/native-failure.png',timeout:30000}).catch(()=>{});}throw error;}
finally{fs.writeFileSync(output,JSON.stringify(report,null,2));await browser.close();}
