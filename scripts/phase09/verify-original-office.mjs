import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={source:'Original published Synthetic Office SSOG through official SuperSplat viewer package',checks:[]};
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000},hasTouch:width<600,isMobile:width<600});
  const page=await context.newPage();const failures=[];
  page.on('pageerror',e=>failures.push(e.message));
  await page.goto('http://127.0.0.1:4175/office.html?budget=0.25',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.officeDiagnostics?.().loaded,undefined,{timeout:180000});
  const initial=await page.evaluate(()=>window.officeDiagnostics());
  if(initial.substitute||!initial.sceneUrl.includes('a972d838')||initial.annotations.length!==4)throw Error('Wrong scene or original annotations missing');
  await page.locator('#annotations button').nth(1).click();
  await page.waitForTimeout(1000);
  const text=await page.locator('#selection').innerText();
  if(!text.includes('8-Person Conference Table'))throw Error('Original annotation selection failed');
  await page.locator('#walk').click();
  const current=await page.evaluate(()=>window.officeDiagnostics());
  if(!current.walkAllowed)throw Error('Original voxel collisions unavailable');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Viewport overflow');
  report.checks.push({width,loaded:current.loaded,walkAllowed:current.walkAllowed,mode:current.mode,annotations:current.annotations.map(a=>({title:a.title,position:a.position})),errors:failures,substitute:current.substitute});
  await page.screenshot({path:'docs/evidence/phase09/integrated-original-'+width+'.png',fullPage:true,timeout:120000});
  await context.close();
 }
 report.status='passed';
}catch(error){report.status='failed';report.error=String(error);throw error;}
finally{fs.writeFileSync('docs/evidence/phase09/original-integration.json',JSON.stringify(report,null,2));await browser.close();}
