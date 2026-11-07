import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const root='docs/evidence/phase09/survey';fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={scene:'https://superspl.at/scene/a972d838',source:'Original SSOG; official camera animation and native splat depth picker',views:[]};
try{
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 await page.goto('http://127.0.0.1:4175/office.html?budget=0.5&survey=1');
 await page.waitForFunction(()=>window.officeDiagnostics?.().loaded,undefined,{timeout:180000});
 const original=JSON.parse(fs.readFileSync('worlds/synthetic-office/original-viewer-settings.json','utf8'));
 const values=original.settings.animTracks[0].keyframes.values;
 const poses=[0,1,2].map(i=>({position:values.position.slice(i*3,i*3+3),target:values.target.slice(i*3,i*3+3)}));
 const shots=[...poses.map((p,i)=>['authored-'+i,p]),['rear-return',{position:poses[2].position,target:poses[0].position}],['above-private',{position:[-3,5,-8],target:original.settings.annotations[2].position}]];

 for(const [id,time]of shots){
  await page.evaluate(pose=>window.officeSurvey.pose(pose),time);
  await page.waitForTimeout(3500);
  const camera=await page.evaluate(()=>window.officeSurvey.camera());
  const picks=[];
  for(const y of [.35,.55,.75])for(const x of [.2,.4,.6,.8]){
   const position=await page.evaluate(async v=>window.officeSurvey.pick(...v),[x,y]);picks.push({screen:[x,y],position});
  }
  await page.locator('#scene').screenshot({path:root+'/'+id+'.jpg',type:'jpeg',quality:80,timeout:120000});
  report.views.push({id,camera,picks,image:id+'.jpg'});
 }
 report.status='captured-not-semantic-validation';
}finally{fs.writeFileSync(root+'/survey.json',JSON.stringify(report,null,2));await browser.close();}
