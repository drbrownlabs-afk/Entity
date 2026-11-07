import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const root='docs/evidence/phase09/survey';fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={scene:'https://superspl.at/scene/a972d838',source:'Original SSOG; authored initial camera settings and native depth picker',views:[]};
const save=()=>fs.writeFileSync(root+'/survey-authored.json',JSON.stringify(report,null,2));
try{
 for(const [id,pose,direction]of [['authored-middle',1,'original'],['authored-rear',2,'original'],['rear-hall',2,'hall']]){
  const page=await browser.newPage({viewport:{width:1000,height:800}});
  await page.goto('http://127.0.0.1:4175/office.html?budget=0.25&survey=1&survey_pose='+pose+'&survey_direction='+direction,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.officeDiagnostics?.().loaded,undefined,{timeout:180000});
  await page.waitForTimeout(1500);
  const camera=await page.evaluate(()=>window.officeSurvey.camera());
  const view={id,camera,picks:[],image:id+'.jpg'};report.views.push(view);save();
  await page.locator('#scene').screenshot({path:root+'/'+id+'.jpg',type:'jpeg',quality:80,timeout:60000});
  for(const screen of [[.3,.6],[.5,.6],[.7,.6]]){
    const position=await page.evaluate(async s=>window.officeSurvey.pick(...s),screen);view.picks.push({screen,position});save();
  }
  await page.close();
 }
 report.status='captured-awaiting-semantic-review';
}catch(error){report.status='failed';report.error=String(error);throw error;}
finally{save();await browser.close();}
