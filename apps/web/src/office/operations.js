import {mountCapabilities} from './capability-form.js';
import {mountReception} from './reception.js';
// Operational screens consume persistent Core APIs. No frontend business fixtures.
const host=document.createElement('section');
host.id='office-operations';
host.innerHTML='<h2>Operaciones del coworking · ENTITY Core</h2><form id="office-login"><label>Servidor<input name="api" type="url" value="http://127.0.0.1:8010"></label><label>Usuario<input name="username" autocomplete="username"></label><label>Contraseña<input name="password" type="password" autocomplete="current-password"></label><button>Conectar</button></form><p id="office-core-status" role="status">Sin conexión al Core: no se inventarán reservas, permisos ni resultados.</p><div id="office-workspace" hidden><nav id="office-modes"></nav><label>Ejecución<select id="office-run"></select></label><button id="office-refresh">Actualizar</button><label>Reconstrucción histórica<input id="office-time" type="datetime-local"></label><button id="office-reconstruct">Consultar ese instante</button><button id="office-present">Presente</button><p id="office-world-status"></p><div class="office-columns"><div id="office-entities"></div><div><h3 id="office-selection">Entidad</h3><div id="office-facts"></div><div id="office-actions"></div></div></div><section id="office-query"></section></div>';
document.querySelector('main').append(host);
let selectedEventDetails=null;
let currentActor=null;
let token,site,run,world,capabilities=[],selected='site',mode='Operaciones',at=null,branch='main',streamController=null,receptionPanel=null;
const status=message=>{host.querySelector('#office-core-status').textContent=message;};
const esc=value=>String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function request(path,body){const base=host.querySelector('[name=api]').value.replace(/\/$/,'');const response=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(10000)});const value=await response.json();if(!response.ok)throw Error('Core HTTP '+response.status+': '+JSON.stringify(value.detail));return value;}
const prefix=()=>'/v1/sites/'+encodeURIComponent(site)+'/runs/'+encodeURIComponent(run);
async function refresh(){const params=new URLSearchParams({branch});if(at)params.set('at',at);world=await request(prefix()+'/world?'+params);window.dispatchEvent(new CustomEvent('office-world-changed',{detail:world}));render();}
host.querySelector('#office-login').onsubmit=async event=>{
 event.preventDefault();
 try{const answer=await request('/v1/office/auth/login',{username:host.querySelector('[name=username]').value,password:host.querySelector('[name=password]').value});currentActor=answer;token=answer.token;site=answer.site_id;host.querySelector('[name=password]').value='';const runs=await request('/v1/sites/'+encodeURIComponent(site)+'/runs');host.querySelector('#office-run').innerHTML=runs.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.id)+'</option>').join('');run=host.querySelector('#office-run').value;branch='main';capabilities=await request('/v1/sites/'+encodeURIComponent(site)+'/capabilities');host.querySelector('#office-workspace').hidden=false;await refresh();subscribe();status('Conectado: '+answer.actor+' · '+answer.role+' · '+site+'. Estado y operaciones persistentes en Core.');}
 catch(error){token=null;world=null;host.querySelector('#office-workspace').hidden=true;window.dispatchEvent(new CustomEvent('office-world-cleared'));status(error.message);}
};
host.querySelector('#office-run').onchange=async event=>{run=event.target.value;await refresh().catch(e=>status(e.message));subscribe();};
host.querySelector('#office-refresh').onclick=()=>refresh().catch(e=>status(e.message));
host.querySelector('#office-reconstruct').onclick=()=>{const value=host.querySelector('#office-time').value;if(value){at=new Date(value).toISOString();refresh().catch(e=>status(e.message));}};
host.querySelector('#office-present').onclick=()=>{at=null;refresh().catch(e=>status(e.message));};
const filters={Seguridad:['Camera','Stream','Track','AccessPoint','Alert'],Reservas:['Booking','Meeting','Desk','Office','EventSpace'],Recepción:['Visit','Invitation','Person','Meeting','Notification','CheckIn','Conversation','Kiosk','Intercom'],Mantenimiento:['HVAC','Sensor','Equipment','Task','Incident'],Flujos:['Zone','Track'],Memoria:[],IA:[],Escenarios:[],Operaciones:[]};
for(const name of Object.keys(filters)){const button=document.createElement('button');button.textContent=name;button.onclick=()=>{mode=name;window.dispatchEvent(new CustomEvent('office-mode-changed',{detail:name}));render();};host.querySelector('#office-modes').append(button);}
function choose(id){selected=id;const entity=world.entities[id];if(entity?.annotation_index!==undefined)window.dispatchEvent(new CustomEvent('office-select-annotation',{detail:entity.annotation_index}));render();}
window.addEventListener('office-select-entity',event=>{if(world?.entities[event.detail]){selected=event.detail;render();}});
window.addEventListener('office-annotation-selected',event=>{if(!world)return;if(world.entities[selected]?.kind!=='Zone'&&world.entities[selected]?.annotation_index===event.detail)return;const entity=Object.values(world.entities).find(e=>e.kind==='Zone'&&e.annotation_index===event.detail);if(entity){selected=entity.id;render();}});
const labels={organization_id:'Organización',home_environment:'Ambiente',profile_level:'Perfil',name:'Nombre',kind:'Tipo',id:'ID',membership_status:'Membresía',presence:'Presencia',freshness:'Vigencia',zone_id:'Zona',observed_at:'Última observación',status:'Estado',capacity:'Capacidad',starts_at:'Inicio',ends_at:'Fin',host_id:'Anfitrión',person_id:'Persona',resource_id:'Recurso',assignee:'Asignación',description:'Descripción',resolution:'Resolución',identity_status:'Identidad',access:'Acceso',waiting_area:'Espera',provenance:'Procedencia',relations:'Relaciones',simulated:'Simulado'};
function facts(item){return '<dl>'+Object.entries(item).map(([key,value])=>'<dt>'+esc(labels[key]||key)+'</dt><dd>'+esc(typeof value==='object'?JSON.stringify(value):value)+'</dd>').join('')+'</dl>';}
async function subscribe(){
 streamController?.abort();const controller=new AbortController();streamController=controller;let delay=500;
 while(!controller.signal.aborted&&token){
  try{
   await refresh();
   const base=host.querySelector('[name=api]').value.replace(/\/$/,'');
   const response=await fetch(base+prefix()+'/stream?after='+world.revision,{headers:{Authorization:'Bearer '+token},signal:controller.signal});
   if(response.status===401||response.status===403){status('Sesión o permiso del canal expirado. Vuelve a conectar.');token=null;break;}
   if(!response.ok)throw Error('SSE HTTP '+response.status);
   const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';delay=500;
   while(!controller.signal.aborted){
    const next=await reader.read();if(next.done)throw Error('Canal cerrado');
    buffer+=decoder.decode(next.value,{stream:true});let end;
    while((end=buffer.indexOf(String.fromCharCode(10,10)))>=0){
     const event=buffer.slice(0,end);buffer=buffer.slice(end+2);
     if(event.includes('event: auth-expired')){token=null;controller.abort();status('Sesión expirada. Vuelve a conectar.');break;}
     if(event.includes('event: world-change')&&branch==='main'&&!at)await refresh();
    }
   }
  }catch(error){
   if(controller.signal.aborted)break;
   status('Reconectando con Core; el último estado no se presenta como recién observado. '+error.message);
   await new Promise(resolve=>{const timer=setTimeout(resolve,delay);controller.signal.addEventListener('abort',()=>{clearTimeout(timer);resolve();},{once:true});});
   delay=Math.min(8000,delay*2);
  }
 }
}

function render(){
 if(!world)return;
 host.querySelector('#office-world-status').textContent=world.clock+' · revisión '+world.revision+' · '+(world.historical?'reconstrucción, acciones deshabilitadas':'presente');
 let daily=host.querySelector('#office-day-controls');
 if(!daily){
  daily=document.createElement('section');daily.id='office-day-controls';daily.innerHTML='<h3>Reloj compartido · jornada reproducible</h3><button id="office-install-day">Preparar jornada08:00–18:30</button><label>Avanzar a (hora de Ecuador)<input id="office-advance-time" type="time" value="09:16"></label><button id="office-advance-day">Ejecutar hitos hasta esa hora</button><p>Sin reproducción automática: el mundo permanece pausado entre avances. El historial nunca se rebobina.</p>';
  host.querySelector('#office-workspace').prepend(daily);
  daily.querySelector('#office-install-day').onclick=async()=>{try{const result=await request(prefix()+'/simulation/install',{});await refresh();status('Jornada: '+JSON.stringify(result));}catch(e){status(e.message);}};
  daily.querySelector('#office-advance-day').onclick=async()=>{try{const clock=new Date(new Date(world.clock).getTime()-5*3600000).toISOString().slice(0,10);const to=clock+'T'+daily.querySelector('input').value+':00-05:00';const result=await request(prefix()+'/simulation/advance',{to});await refresh();status('Core ejecutó '+result.steps.length+' hitos; quedan '+result.pending+'.');}catch(e){status(e.message);}};
 }
 const items=Object.values(world.entities).filter(item=>!filters[mode].length||filters[mode].includes(item.kind));
 host.querySelector('#office-entities').innerHTML=items.map(item=>'<button data-entity="'+esc(item.id)+'"><b>'+esc(item.name||item.id)+'</b><small>'+esc(item.kind)+' · '+esc(item.status||item.freshness||'registrado')+'</small></button>').join('');
 for(const button of host.querySelectorAll('[data-entity]'))button.onclick=()=>choose(button.dataset.entity);
 const item=world.entities[selected];host.querySelector('#office-selection').textContent=item?.name||selected;host.querySelector('#office-facts').innerHTML=item?facts(item):'Entidad no presente en este instante.';
 if(!receptionPanel){
  receptionPanel=document.createElement('section');host.querySelector('#office-workspace').append(receptionPanel);
  mountReception(receptionPanel,body=>request(prefix()+'/commands',body));
 }
 receptionPanel.hidden=mode!=='Recepción';
 if(mode==='Escenarios'){
  const controls=document.createElement('section');controls.innerHTML='<h3>What-if aislado</h3><p>Rama activa: '+esc(branch)+'</p><button id="office-fork">Crear escenario desde presente</button><button id="office-compare">Comparar impactos</button><button id="office-apply">Aplicar propuesta al mundo oficial</button><pre id="office-comparison"></pre>';
  host.querySelector('#office-facts').append(controls);
  controls.querySelector('#office-fork').onclick=async()=>{try{const official=await request(prefix()+'/world');const id='what-if-'+crypto.randomUUID();await request(prefix()+'/scenarios',{id,expected_revision:official.revision});branch=id;at=null;await refresh();}catch(e){status(e.message);}};
  controls.querySelector('#office-compare').onclick=async()=>{try{const result=await request(prefix()+'/scenarios/'+encodeURIComponent(branch)+'/comparison');controls.querySelector('pre').textContent=JSON.stringify(result,null,2);}catch(e){status(e.message);}};
  controls.querySelector('#office-apply').onclick=async()=>{try{if(branch==='main')throw Error('Primero crea un escenario aislado');const result=await request(prefix()+'/scenarios/'+encodeURIComponent(branch)+'/apply',{id:crypto.randomUUID()});branch='main';await refresh();status('Propuesta aplicada por Core: '+result.status);}catch(e){status(e.message);}};
 }
 const panel=host.querySelector('#office-actions');
 if(item)mountCapabilities(panel,{descriptors:capabilities,entity:item,getWorld:()=>world,actor:currentActor,send:body=>request(prefix()+'/commands',body),
  disabled:world.historical||(mode==='Escenarios'&&branch==='main'),onComplete:async result=>{await refresh();status('Core: '+result.status+' · evento '+result.event.id);},onError:error=>status(error.message)});
 else panel.replaceChildren();

 renderQuery();
 renderTimeline();
}
function renderQuery(){
 const element=host.querySelector('#office-query');
 element.innerHTML='<h3>Consulta con evidencia</h3><form><label>Pregunta<input name="question" placeholder="Consulta del espacio seleccionado"></label><label><input name="natural" type="checkbox">Interpretar texto con LLM configurado</label><select name="kind">'+Object.entries({graph:'Grafo de relaciones',entity:'Ficha de entidad',location:'Ubicación confirmada',agenda:'Agenda y reservas',events:'Historia de eventos',camera_observations:'Observaciones de una cámara',cameras_for_person:'Cámaras que observaron a la persona',causes:'Evidencias causales',impact:'Recursos y personas afectados',diff:'Cambios desde otro instante',metrics:'Métricas'}).map(([key,label])=>'<option value="'+key+'">'+label+'</option>').join('')+'</select><label>Entidad<input name="entity_id" value="'+esc(selected)+'"></label><label>Desde<input name="from" type="datetime-local"></label><label>Hasta<input name="to" type="datetime-local"></label><button>Consultar Core</button></form><div id="office-answer"></div>';
 element.querySelector('form').onsubmit=async event=>{
  event.preventDefault();const form=element.querySelector('form');const body={kind:form.elements.kind.value,entity_id:form.elements.entity_id.value||null};body.branch=branch;if(at)body.at=at;
  for(const name of ['from','to'])if(form.elements[name].value)body[name]=new Date(form.elements[name].value).toISOString();
  try{const formQuestion=form.elements.question.value||('Consulta guiada: '+body.kind+' · '+body.entity_id);
   const envelope={id:crypto.randomUUID(),question:formQuestion,...(!form.elements.natural.checked?{query:body}:{})};
   const trace=await request(prefix()+'/agent/requests',envelope);
   if(trace.status!=='verified')throw Error('IA/Core: '+trace.status+' '+JSON.stringify(trace.error||{}));
   const result=trace.result;const answer=element.querySelector('#office-answer');answer.replaceChildren();const title=document.createElement('p');title.textContent='Core · '+trace.provider+' · '+result.as_of+' · '+result.evidence.length+' evidencias';answer.append(title);
   const data=document.createElement('pre');data.textContent=JSON.stringify(result.result,null,2);answer.append(data);
  }catch(error){status(error.message);}
 };
}
window.officeCoreDiagnostics=()=>({connected:!!token,site,run,world,selected,mode,branch});


async function renderTimeline(){
 let element=host.querySelector('#office-timeline');
 if(!element){element=document.createElement('section');element.id='office-timeline';host.querySelector('#office-workspace').append(element);}
 element.hidden=mode!=='Memoria';if(element.hidden)return;
 try{
  const records=await request(prefix()+'/events?limit=1000&branch='+encodeURIComponent(branch));
  element.innerHTML='<h3>Memoria persistente · eventos inmutables</h3><label>Recorrer eventos<input id="office-scrub" type="range" min="0" max="'+Math.max(0,records.length-1)+'" value="'+Math.max(0,records.length-1)+'"></label><p>Reconstrucción del Core. No se ofrece vídeo grabado; la imagen de fondo es el escaneo original.</p><div id="office-event-list"></div><div id="office-event-detail"></div>';
  if(selectedEventDetails)element.querySelector('#office-event-detail').textContent=JSON.stringify(selectedEventDetails,null,2);
  const list=element.querySelector('#office-event-list');
  for(const event of records){
   const button=document.createElement('button');button.textContent=event.at+' · '+event.type;button.dataset.event=event.id;
   button.onclick=async()=>{try{const detail=await request(prefix()+'/events/'+event.id);selectedEventDetails=detail;at=event.at;await refresh();}catch(e){status(e.message);}};
   list.append(button);
  }
  element.querySelector('#office-scrub').onchange=async event=>{const entry=records[Number(event.target.value)];if(entry){at=entry.at;await refresh();}};
 }catch(error){status(error.message);}
}
