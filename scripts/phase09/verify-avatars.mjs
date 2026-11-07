import {chromium} from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={source:'Original Microsoft Rocketbox human GLBs, actual PlayCanvas animation/skinning; asset test only, not office spatial validation',checks:[]};
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:4190/kiosk.html');
 const manifest=JSON.parse(fs.readFileSync('apps/web/public/avatars/manifest.json','utf8'));
 for(const asset of manifest.assets){
  const observed=await page.evaluate(async file=>{const {inspectAvatar}=await import('/src/office/avatars.js');return inspectAvatar('/avatars/'+file);},asset.file);
  if(!observed.root_pose_preserved||!observed.finite_transforms||observed.bones<50||observed.animated_bones_changed<1||observed.clips.length!==6)throw Error('Invalid skinned animation '+asset.id+': '+JSON.stringify(observed));
  report.checks.push({id:asset.id,...observed});
 }
 report.status='passed';
}catch(error){report.status='failed';report.error=String(error);throw error;}
finally{fs.writeFileSync('docs/evidence/phase09/avatar-assets.json',JSON.stringify(report,null,2));await browser.close();}
