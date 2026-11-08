import './office.css';
import {configuredApi,rememberApi} from './api-config.js';
import {mountReception} from './reception.js';
const form=document.querySelector('#terminal-login'),output=document.querySelector('#terminal-status');
form.elements.api.value=configuredApi();
let token='',site='',run='',base='',terminal='',epoch=0;const pinnedRun=new URLSearchParams(location.search).get('run');
async function request(path,body){
 const requestEpoch=epoch;const response=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});
 const value=await response.json();if(requestEpoch!==epoch)throw Error('La sesión o jornada cambió.');if(!response.ok)throw Error('Core '+response.status+': '+JSON.stringify(value.detail));return value;
}
form.onsubmit=async event=>{
 event.preventDefault();epoch++;try{
  base=rememberApi(form.elements.api.value);
  const answer=await request('/v1/office/auth/login',{username:form.elements.username.value,password:form.elements.password.value});
  form.elements.password.value='';token=answer.token;site=answer.site_id;run=pinnedRun||(await request('/v1/sites/'+encodeURIComponent(site)+'/active-run')).id;
  if(answer.role!=='kiosk'&&answer.role!=='admin')throw Error('Cuenta de terminal requerida');
  terminal=answer.person_id||'KIOSK-01';mount();
  form.hidden=true;output.textContent='Terminal conectado al mismo ENTITY Core · datos de simulación persistentes.';
 }catch(error){token='';output.textContent=error.message;}
};

function mount(){const fixedRun=run;mountReception(document.querySelector('#reception'),body=>{
 if(fixedRun!==run)throw Error('La jornada cambió; inicia otra consulta.');
 return request('/v1/sites/'+encodeURIComponent(site)+'/runs/'+encodeURIComponent(fixedRun)+'/commands',body);
},{kioskId:terminal});}
setInterval(async()=>{if(!token||pinnedRun||document.hidden)return;try{
 const active=await request('/v1/sites/'+encodeURIComponent(site)+'/active-run');
 if(run!==active.id){epoch++;run=active.id;mount();output.textContent='Terminal sincronizado con la nueva jornada activa.';}
}catch(error){output.textContent='Sin actualización: '+error.message;}},2000);
