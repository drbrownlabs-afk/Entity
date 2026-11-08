import {test,expect} from '@playwright/test';
import fs from 'node:fs';
test('audit measures actual Core action versus rendered scene',async({page,request})=>{
  await page.goto('/?paused');await page.waitForFunction(()=>window.entityDiagnostics?.().rendered);
  await page.locator('.api-settings summary').click();
  await page.locator('#api-url').fill('http://127.0.0.1:4174');await page.locator('#api-token').fill('playwright-fixture-only');await page.locator('#api-entity').fill('browser-camera');await page.locator('#api-connect').click();
  await expect(page.locator('#api-status')).toContainText('Core conectado');
  const capabilities=await(await request.get('http://127.0.0.1:4174/v1/entities/browser-display/capabilities')).json();
  await page.locator('#api-target').fill('browser-display');await page.locator('#api-capability').fill(capabilities[0].id);await page.locator('#api-scene').fill('audit-verified-scene');
  const revision=await page.evaluate(()=>window.entityDiagnostics().world.revision);
  await page.locator('#api-act').click();await expect(page.locator('#api-status')).toContainText('Resultado real de API: verified');
  await page.waitForFunction(revision=>window.entityDiagnostics().world.revision>revision,revision);
  const actual=(await(await request.get('http://127.0.0.1:4174/v1/entities/browser-display')).json()).state['display.scene'];
  const diagnostics=await page.evaluate(()=>window.entityDiagnostics());
  const report={transport:'Chromium + actual temporary HTTP Core + controlled provider + virtual display',actual_core_scene:actual,rendered_scene:diagnostics.world.scene,mode:diagnostics.world.mode,scene_matches_core:actual===diagnostics.world.scene,all_cameras_same_local_revision:diagnostics.cameras.every(c=>c.revision===diagnostics.world.revision),meaning:'Audit probe completion does not mean the synchronization requirement passed'};
  fs.writeFileSync('../../.runtime/mvp-audit-browser.json',JSON.stringify(report,null,2));await page.screenshot({path:'../../.runtime/mvp-audit-browser.png',fullPage:true});console.log(report);
});
