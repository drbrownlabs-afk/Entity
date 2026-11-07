import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const api=process.env.OFFICE_API,web=process.env.OFFICE_WEB;
const credentials=JSON.parse(fs.readFileSync(process.env.OFFICE_CREDENTIALS,'utf8'));
const code=process.env.OFFICE_TEST_CODE;
let lastPage,lastHost;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={tested_commit:process.env.GITHUB_SHA||null,run_url:process.env.GITHUB_RUN_ID?'https://github.com/'+process.env.GITHUB_REPOSITORY+'/actions/runs/'+process.env.GITHUB_RUN_ID:null,source:'Actual local Core HTTP and built kiosk/personal clients; original site inventory; no substituted 3D scene',checks:[]};
try{
 for(const width of [1280,390]){
  const context=await browser.newContext({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600});
  const page=await context.newPage();lastPage=page;
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(web+'/kiosk.html');
  await page.locator('[name=api]').fill(api);
  await page.locator('[name=username]').fill('entity-kiosk');
  await page.locator('[name=password]').fill(credentials['entity-kiosk'].password);
  await page.getByRole('button',{name:'Conectar',exact:true}).click();
  await page.locator('#reception-start').waitFor({state:'visible'});
  await page.locator('[name=invitation]').fill('I-DANIEL-'+width);
  await page.getByRole('button',{name:'Consultar reunión',exact:true}).click();
  await page.locator('[name=code]').fill(code);
  await page.getByRole('button',{name:'Verificar y registrar llegada'}).click();
  await page.waitForFunction(()=>document.querySelector('#reception-reply').textContent.includes('contactando'));
  const host=await context.newPage();lastHost=host;await host.goto(web+'/personal.html');
  await host.locator('#api').fill(api);await host.locator('#username').fill('carlos');await host.locator('#password').fill(credentials.carlos.password);
  await host.locator('#connect').click();
  await host.getByRole('button',{name:'Estoy listo',exact:true}).first().click();
  await host.waitForFunction(()=>document.querySelector('#status').textContent.includes('Respuesta registrada'));
  const scene=host.frameLocator('#personal-scene');
  await scene.locator('#scene').waitFor({state:'visible'});
  const projection=await host.locator('#personal-scene').evaluate(async frame=>{for(let i=0;i<100;i++){const s=frame.contentWindow.officeProjectionDiagnostics?.();if(s?.clock)return s;await new Promise(r=>setTimeout(r,100));}throw Error('Personal scene never received the Core projection');});
  if(projection.camera_ids.length||projection.entity_ids.includes('PERSON-LUIS'))throw Error('Personal 3D received another person or private camera');
  await host.locator('[data-entity="A"]').click();
  await host.locator('#personal-details select[aria-label="Capacidad autorizada"]').selectOption({label:'Crear reserva'});
  const form=host.locator('#personal-details form');
  const bookingId=await form.locator('[name=booking_id]').inputValue();
  await form.locator('[name=starts_at]').fill(width===1280?'2026-11-07T22:00':'2026-11-07T23:00');
  await form.locator('[name=ends_at]').fill(width===1280?'2026-11-07T23:00':'2026-11-08T00:00');
  await form.getByRole('button',{name:'Ejecutar con autorización'}).click();
  await host.waitForFunction(()=>document.querySelector('#status').textContent==='Core: verified');
  await host.locator('[data-entity="'+bookingId+'"]').waitFor({state:'visible'});
  await host.locator('#personal-query [name=kind]').selectOption('graph');
  await host.locator('#personal-query [name=entity_id]').selectOption('PERSON-CARLOS');
  await host.locator('#personal-query button').filter({hasText:'Consultar ENTITY'}).click();
  await host.waitForFunction(()=>document.querySelector('#personal-query #office-answer').textContent.includes('evidencias'));
  const answer=await host.locator('#personal-query #office-answer').innerText();
  if(answer.includes('PERSON-LUIS')||answer.includes('CAM-01'))throw Error('Scoped personal query exposed another person/camera');
  await page.getByRole('button',{name:'Consultar respuesta',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#reception-reply').textContent.includes('confirmó que está listo'));
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Kiosk viewport overflow');
  if(errors.length)throw Error(errors.join('; '));
  await page.screenshot({path:'docs/evidence/phase09/kiosk-'+width+'.png',fullPage:true});
  await host.screenshot({path:'docs/evidence/phase09/personal-'+width+'.png',fullPage:true});
  await host.locator('#logout').click();
  await host.waitForFunction(()=>document.querySelector('#status').textContent.includes('revocada en Core'));
  await host.waitForFunction(()=>document.querySelector('#personal-scene').contentWindow.officeProjectionDiagnostics().clock===null);
  report.checks.push({width,server_session_revoked:true,verified_invitation:true,private_host_reply:true,scoped_mobile_booking:true,original_viewer_receives_scoped_world:true,shared_scoped_query_verified:true,private_cameras_in_projection:projection.camera_ids.length,kiosk_reflects_core:true,token_in_local_storage:await page.evaluate(()=>Object.keys(localStorage).some(k=>/token|password/i.test(k))),page_errors:errors,voice_screen_controls:true,voice_microphone_executed:false});
  await context.close();
 }
 report.status='passed';
} catch(error){
 report.status='failed';report.error=String(error);
 if(lastHost&&!lastHost.isClosed())report.client_error=await lastHost.locator('#status').innerText();
 throw error;
}
finally{fs.writeFileSync('docs/evidence/phase09/reception-http-browser.json',JSON.stringify(report,null,2));await browser.close();}
