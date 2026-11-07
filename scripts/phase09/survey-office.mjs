import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const root='docs/evidence/phase09/survey';fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={scene:'https://superspl.at/scene/a972d838',source:'Original SSOG from measured native walk camera positions; semantic review required',views:[]};
const save=()=>fs.writeFileSync(root+'/survey-front.json',JSON.stringify(report,null,2));
try{
 for(const [id,index,direction]of [['front-left',0,'left'],['front-return',0,'back'],['middle-left',1,'left'],['rear-left',2,'left']]){
  const page=await browser.newPage({viewport:{width:1100,height:850}});
  await page.goto('http://127.0.0.1:4175/office.html?budget=0.25&survey=1&survey_pose='+index+'&survey_direction='+direction,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.officeDiagnostics?.().loaded,undefined,{timeout:180000});
  await page.waitForTimeout(1000);
  const view={id,camera:await page.evaluate(()=>window.officeSurvey.camera()),picks:[],image:id+'.jpg'};report.views.push(view);save();
  await page.locator('#scene').screenshot({path:root+'/'+view.image,type:'jpeg',quality:85,timeout:60000});
  for(const screen of [[.25,.55],[.5,.55],[.75,.55]]){
   const position=await page.evaluate(async s=>window.officeSurvey.pick(...s),screen);view.picks.push({screen,position});save();
  }
  await page.close();
 }
 report.status='captured-awaiting-semantic-review';
}catch(error){report.status='failed';report.error=String(error);throw error;}
finally{save();await browser.close();}
