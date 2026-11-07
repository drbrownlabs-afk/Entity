import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const root='docs/evidence/phase09/survey';fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={scene:'https://superspl.at/scene/a972d838',source:'Original SSOG, elevated/oblique inspection viewpoints derived from authored and measured cameras. Camera transforms are NOT semantic resource coordinates or verified walking routes',views:[]};
const save=()=>fs.writeFileSync(root+'/survey-oblique.json',JSON.stringify(report,null,2));
try{
 for(const [id,params]of [['oblique-0','survey_route_pose=0&survey_direction=overview-right'],['oblique-1','survey_route_pose=1&survey_direction=overview-right'],['oblique-3','survey_route_pose=3&survey_direction=overview-right'],['oblique-4','survey_route_pose=4&survey_direction=overview-right'],['front-down','survey_pose=0&survey_direction=front-down']]){
  const page=await browser.newPage({viewport:{width:1400,height:950}});
  await page.goto('http://127.0.0.1:4175/office.html?budget=0.5&survey=1&'+params,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.officeDiagnostics?.().loaded,undefined,{timeout:180000});await page.waitForTimeout(1000);
  const view={id,camera:await page.evaluate(()=>window.officeSurvey.camera()),picks:[],image:id+'.jpg'};report.views.push(view);save();
  await page.locator('#scene').screenshot({path:root+'/'+view.image,type:'jpeg',quality:90,timeout:60000});
  for(const screen of [[.25,.55],[.5,.55],[.75,.55],[.5,.8]]){view.picks.push({screen,position:await page.evaluate(async s=>window.officeSurvey.pick(...s),screen)});save();}
  await page.close();
 }
 report.status='captured-awaiting-semantic-review';
}catch(error){report.status='failed';report.error=String(error);throw error;}
finally{save();await browser.close();}
