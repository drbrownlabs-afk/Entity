import { chromium } from '../../apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const dir='docs/evidence/phase09';fs.mkdirSync(dir,{recursive:true});
const network=[],json=[],errors=[];
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));const pending=[];
page.on('response',response=>{pending.push((async()=>{const url=response.url();const type=response.headers()['content-type']||'';network.push({url,status:response.status(),type});if(type.includes('json')&&(url.includes('a972d838')||/meta|scene|settings|manifest/i.test(url))){try{const body=await response.json();json.push({url,body});}catch{}}})());});
const response=await page.goto('https://superspl.at/scene/a972d838',{waitUntil:'domcontentloaded',timeout:90000});await page.waitForTimeout(25000);await page.screenshot({path:dir+'/synthetic-office-browser.png',fullPage:true});await Promise.allSettled(pending);
const report={source:'Authorized GitHub Actions Chromium, public scene, no login',url:page.url(),status:response.status(),title:await page.title(),text:(await page.locator('body').innerText()).slice(0,7000),frames:page.frames().map(f=>f.url()),links:await page.locator('a').evaluateAll(a=>a.map(x=>({text:x.textContent,url:x.href}))),network,json,errors};
fs.writeFileSync(dir+'/scene-discovery.json',JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,title:report.title,frames:report.frames,requests:network.length,json:json.length,errors}));
}finally{await browser.close();}
