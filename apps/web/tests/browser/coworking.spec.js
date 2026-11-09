import {test,expect} from '@playwright/test';
// Historical Experience tests remain in Git/source; the operational root now opens P2.
for(const mobile of [false,true])test(`active coworking redirect and scene ${mobile?'touch':'desktop'}`,async({browser})=>{
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:960,height:640},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/');
 await expect(page).toHaveURL('http://127.0.0.1:5175/');
 await page.waitForFunction(()=>window.spatial?.ready,null,{timeout:210000});
 const actual=await page.evaluate(()=>{spatial.renderer.app.autoRender=false;return {records:spatial.data.records.length,master:spatial.data.master_sha256,doors:spatial.data.devices.doors.length};});
 expect(actual.records).toBe(4514);expect(actual.doors).toBeGreaterThan(0);expect(actual.master).toBe('ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f');
 await expect(page.locator('[data-store]')).toHaveCount(0);expect(errors).toEqual([]);
 await context.close();
});
