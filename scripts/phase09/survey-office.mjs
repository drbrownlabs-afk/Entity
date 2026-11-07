import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const root='docs/evidence/phase09/survey';fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={scene:'https://superspl.at/scene/a972d838',source:'Original SSOG from measured native walk camera positions; semantic review required',views:[]};
const save=()=>fs.writeFileSync(root+'/survey-lateral.json',JSON.stringify(report,null,2));
try{
 for(const [id,index,direction]of [['lateral-1',1,'right'],['lateral-2',2,'right'],['lateral-3',3,'right'],['lateral-4',4,'right'],['floor-0',0,'down'],['floor-1',1,'down'],['floor-2',2,'down']]){
  const page=await browser.newPage({viewport:{width:1100,height:850}});
  await page.goto('http://127.0.0.1:4175/office.html?budget=0.25&survey=1&survey_route_pose='+index+'&survey_direction='+direction,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.officeDiagnostics?.().loaded,undefined,{timeout:180000});
  await page.waitForTimeout(1000);
  const view={id,camera:await page.evaluate(()=>window.officeSurvey.camera()),picks:[],image:id+'.jpg'};report.views.push(view);save();
  await page.locator('#scene').screenshot({path:root+'/'+view.image,type:'jpeg',quality:85,timeout:60000});
  for(const screen of direction==='down'?[[.5,.5]]:[[.25,.6],[.5,.6],[.75,.6]]){
   const position=await page.evaluate(async s=>window.officeSurvey.pick(...s),screen);view.picks.push({screen,position});save();
  }
  await page.close();
 }
 report.status='captured-awaiting-semantic-review';
}catch(error){report.status='failed';report.error=String(error);throw error;}
finally{save();await browser.close();}
