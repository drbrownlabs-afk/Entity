import './office.css';
import {mountReception} from './reception.js';
const form=document.querySelector('#terminal-login'),output=document.querySelector('#terminal-status');
let token='',site='',run='',base='';
async function request(path,body){
 const response=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});
 const value=await response.json();if(!response.ok)throw Error('Core '+response.status+': '+JSON.stringify(value.detail));return value;
}
form.onsubmit=async event=>{
 event.preventDefault();try{
  base=form.elements.api.value.replace(/\/$/,'');
  const answer=await request('/v1/office/auth/login',{username:form.elements.username.value,password:form.elements.password.value});
  form.elements.password.value='';token=answer.token;site=answer.site_id;run=new URLSearchParams(location.search).get('run')||'day-01';
  if(answer.role!=='kiosk'&&answer.role!=='admin')throw Error('Cuenta de terminal requerida');
  mountReception(document.querySelector('#reception'),body=>request('/v1/sites/'+encodeURIComponent(site)+'/runs/'+encodeURIComponent(run)+'/commands',body));
  form.hidden=true;output.textContent='Terminal conectado al mismo ENTITY Core · datos de simulación persistentes.';
 }catch(error){token='';output.textContent=error.message;}
};
