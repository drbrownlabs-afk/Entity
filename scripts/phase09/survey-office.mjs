import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const root='docs/evidence/phase09/survey';fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={scene:'https://superspl.at/scene/a972d838',source:'Original SSOG; side-route native voxel walk from previously measured aisle viewpoint. No invented resource anchors',views:[]};
const save=()=>fs.writeFileSync(root+'/survey-side-walk.json',JSON.stringify(report,null,2));
try{
 const page=await browser.newPage({viewport:{width:1100,height:850}});
 await page.goto('http://127.0.0.1:4175/office.html?budget=0.25&survey=1&survey_route_pose=4&survey_direction=hall',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.officeDiagnostics?.().loaded&&window.officeDiagnostics().walkAllowed,undefined,{timeout:180000});
 await page.locator('#walk').click();
 const button=page.locator('[data-move="0,1"]'),box=await button.boundingBox();
 const sequence=[{move:'1,0',ms:800},{move:'0,1',ms:1600},{move:'1,0',ms:800},{move:'0,1',ms:1800},{move:'0,1',ms:1800},{move:'-1,0',ms:800}];
 for(let index=0;index<sequence.length;index++){
  const action=sequence[index],move=page.locator('[data-move="'+action.move+'"]'),area=await move.boundingBox();
  await page.mouse.move(area.x+area.width/2,area.y+area.height/2);await page.mouse.down();await page.waitForTimeout(action.ms);await page.mouse.up();await page.waitForTimeout(500);
  const view={id:'side-walk-'+index,action,camera:await page.evaluate(()=>window.officeSurvey.camera()),diagnostics:await page.evaluate(()=>window.officeDiagnostics()),picks:[],image:'side-walk-'+index+'.jpg'};
  report.views.push(view);save();
  await page.locator('#scene').screenshot({path:root+'/'+view.image,type:'jpeg',quality:85,timeout:60000});
  for(const screen of [[.25,.55],[.5,.7],[.75,.55]]){view.picks.push({screen,position:await page.evaluate(async s=>window.officeSurvey.pick(...s),screen)});save();}
 }
 report.status='captured-awaiting-semantic-review';await page.close();
}catch(error){report.status='failed';report.error=String(error);throw error;}
finally{save();await browser.close();}
