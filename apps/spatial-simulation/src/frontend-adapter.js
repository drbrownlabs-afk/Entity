// Direct reuse of the existing frontend's declared-action form and civil-time formatter.
// Read-only imports: no edits to apps/web, no Core connection, no business-policy clone.
import {mountCapabilities} from '../../web/src/office/capability-form.js';
import {siteWallTime} from '../../web/src/office/site-time.js';
export function civilNow(){return siteWallTime(new Date().toISOString(),'UTC').replace('T',' ')+' UTC';}
export function mountPowerForm(container,id,on,send,onComplete,onError){
 container.officeCapabilitySignature=null;
 mountCapabilities(container,{entity:{id},descriptors:[{resource_id:id,canonical_id:'device.setPower',capability_id:'visual-only:'+id,input_schema:{type:'object',properties:{on:{type:'boolean',title:'Encendido'}},required:['on']}}],getWorld:()=>({site_id:'spatial-visual-only',run_id:'local-session',branch:'simulation',revision:0,timezone:'UTC',entities:{}}),actor:{role:'visual-simulation'},send:body=>send(body.inputs.on),onComplete,onError});
 const action=container.querySelector('select');if(action){action.hidden=true;action.setAttribute('aria-label','Acción visual');}
 const input=container.querySelector('[name=on]');if(input){input.checked=on;input.closest('label').firstChild.textContent='Encendido ';}
 const button=container.querySelector('button');if(button)button.textContent='Aplicar en simulación';
}
