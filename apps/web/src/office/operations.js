import {mountReception} from './reception.js';
// Operational screens consume persistent Core APIs. No frontend business fixtures.
const host=document.createElement('section');
host.id='office-operations';
host.innerHTML='<h2>Operaciones del coworking · ENTITY Core</h2><form id="office-login"><label>Servidor<input name="api" type="url" value="http://127.0.0.1:8000"></label><label>Usuario<input name="username" autocomplete="username"></label><label>Contraseña<input name="password" type="password" autocomplete="current-password"></label><button>Conectar</button></form><p id="office-core-status" role="status">Sin conexión al Core: no se inventarán reservas, permisos ni resultados.</p><div id="office-workspace" hidden><nav id="office-modes"></nav><label>Ejecución<select id="office-run"></select></label><button id="office-refresh">Actualizar</button><label>Reconstrucción histórica<input id="office-time" type="datetime-local"></label><button id="office-reconstruct">Consultar ese instante</button><button id="office-present">Presente</button><p id="office-world-status"></p><div class="office-columns"><div id="office-entities"></div><div><h3 id="office-selection">Entidad</h3><div id="office-facts"></div><div id="office-actions"></div></div></div><section id="office-query"></section></div>';
document.querySelector('main').append(host);
let token,site,run,world,capabilities=[],selected='site',mode='Operaciones',at=null,branch='main',streamController=null,receptionPanel=null;
const status=message=>{host.querySelector('#office-core-status').textContent=message;};
const esc=value=>String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function request(path,body){const base=host.querySelector('[name=api]').value.replace(/\/$/,'');const response=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(10000)});const value=await response.json();if(!response.ok)throw Error('Core HTTP '+response.status+': '+JSON.stringify(value.detail));return value;}
const prefix=()=>'/v1/sites/'+encodeURIComponent(site)+'/runs/'+encodeURIComponent(run);
async function refresh(){const params=new URLSearchParams({branch});if(at)params.set('at',at);world=await request(prefix()+'/world?'+params);render();}
host.querySelector('#office-login').onsubmit=async event=>{
 event.preventDefault();
 try{const answer=await request('/v1/office/auth/login',{username:host.querySelector('[name=username]').value,password:host.querySelector('[name=password]').value});token=answer.token;site=answer.site_id;host.querySelector('[name=password]').value='';const runs=await request('/v1/sites/'+encodeURIComponent(site)+'/runs');host.querySelector('#office-run').innerHTML=runs.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.id)+'</option>').join('');run=host.querySelector('#office-run').value;branch='main';capabilities=await request('/v1/sites/'+encodeURIComponent(site)+'/capabilities');host.querySelector('#office-workspace').hidden=false;await refresh();subscribe();status('Conectado: '+answer.actor+' · '+answer.role+' · '+site+'. Estado y operaciones persistentes en Core.');}
 catch(error){token=null;status(error.message);}
};
host.querySelector('#office-run').onchange=async event=>{run=event.target.value;await refresh().catch(e=>status(e.message));subscribe();};
host.querySelector('#office-refresh').onclick=()=>refresh().catch(e=>status(e.message));
host.querySelector('#office-reconstruct').onclick=()=>{const value=host.querySelector('#office-time').value;if(value){at=new Date(value).toISOString();refresh().catch(e=>status(e.message));}};
host.querySelector('#office-present').onclick=()=>{at=null;refresh().catch(e=>status(e.message));};
const filters={Seguridad:['Camera','Stream','Track','AccessPoint','Alert'],Reservas:['Booking','Meeting','Desk','Office','EventSpace'],Recepción:['Visit','Invitation','Person','Meeting','Notification','CheckIn','Conversation','Kiosk','Intercom'],Mantenimiento:['HVAC','Sensor','Equipment','Task','Incident'],Flujos:['Zone','Track'],Memoria:[],IA:[],Escenarios:[],Operaciones:[]};
for(const name of Object.keys(filters)){const button=document.createElement('button');button.textContent=name;button.onclick=()=>{mode=name;render();};host.querySelector('#office-modes').append(button);}
function choose(id){selected=id;const entity=world.entities[id];if(entity?.annotation_index!==undefined)window.dispatchEvent(new CustomEvent('office-select-annotation',{detail:entity.annotation_index}));render();}
window.addEventListener('office-annotation-selected',event=>{if(!world)return;const entity=Object.values(world.entities).find(e=>e.kind==='Zone'&&e.annotation_index===event.detail);if(entity){selected=entity.id;render();}});
const labels={organization_id:'Organización',home_environment:'Ambiente',profile_level:'Perfil',name:'Nombre',kind:'Tipo',id:'ID',membership_status:'Membresía',presence:'Presencia',freshness:'Vigencia',zone_id:'Zona',observed_at:'Última observación',status:'Estado',capacity:'Capacidad',starts_at:'Inicio',ends_at:'Fin',host_id:'Anfitrión',person_id:'Persona',resource_id:'Recurso',assignee:'Asignación',description:'Descripción',resolution:'Resolución',identity_status:'Identidad',access:'Acceso',waiting_area:'Espera',provenance:'Procedencia',relations:'Relaciones',simulated:'Simulado'};
const operationNames={'booking.create':'Crear reserva','booking.extend':'Extender reserva','booking.cancel':'Cancelar reserva','booking.reassign':'Reasignar reserva','booking.checkin':'Registrar llegada a reserva','booking.no_show':'Registrar no-show','access.checkAuthorization':'Comprobar autorización','access.requestEntry':'Solicitar acceso','visit.register':'Registrar visita provisional','visit.checkin':'Registrar visitante en espera','identity.associate':'Asociar identidad con evidencia','notification.send':'Notificar','meeting.start':'Iniciar reunión','meeting.end':'Finalizar reunión','task.create':'Crear tarea','task.assign':'Asignar tarea','task.resolve':'Resolver tarea','equipment.fail':'Registrar avería','equipment.repair':'Registrar reparación','membership.set':'Actualizar membresía','camera.setStatus':'Conectar/desconectar cámara','zone.close':'Cerrar zona','zone.open':'Abrir zona','intercom.reply':'Responder por intercom','intercom.timeout':'Registrar falta de respuesta','clock.advance':'Avanzar reloj simulado','entity.upsert':'Gestionar recurso','relation.add':'Añadir relación','account.create':'Crear cuenta'};
function facts(item){return '<dl>'+Object.entries(item).map(([key,value])=>'<dt>'+esc(labels[key]||key)+'</dt><dd>'+esc(typeof value==='object'?JSON.stringify(value):value)+'</dd>').join('')+'</dl>';}
async function subscribe(){
 streamController?.abort();streamController=new AbortController();
 try{
  const base=host.querySelector('[name=api]').value.replace(/\/$/,'');
  const response=await fetch(base+prefix()+'/stream?after='+world.revision,{headers:{Authorization:'Bearer '+token},signal:streamController.signal});
  if(!response.ok)throw Error('SSE HTTP '+response.status);
  const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
  while(true){const next=await reader.read();if(next.done)break;buffer+=decoder.decode(next.value,{stream:true});let end;while((end=buffer.indexOf('\n\n'))>=0){const event=buffer.slice(0,end);buffer=buffer.slice(end+2);if(event.includes('event: world-change')&&branch==='main'&&!at)await refresh();}}
 }catch(error){if(error.name!=='AbortError')status('Canal en vivo interrumpido; utiliza Actualizar para reconciliar. '+error.message);}
}
function render(){
 if(!world)return;
 host.querySelector('#office-world-status').textContent=world.clock+' · revisión '+world.revision+' · '+(world.historical?'reconstrucción, acciones deshabilitadas':'presente');
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
 const actions=capabilities.filter(c=>c.resource_id===selected&&operationNames[c.canonical_id]&&!(item?.reservable===false&&c.canonical_id==='booking.create'));
 const panel=host.querySelector('#office-actions');
 panel.innerHTML='<h3>Capacidades declaradas</h3><select id="office-operation">'+actions.map(c=>'<option value="'+esc(c.capability_id)+'">'+esc(operationNames[c.canonical_id])+'</option>').join('')+'</select><form id="office-command"><div id="office-fields"></div><button '+(world.historical||(mode==='Escenarios'&&branch==='main')?'disabled':'')+'>Ejecutar con autorización</button></form>';
 const build=()=>{
  const descriptor=actions.find(c=>c.capability_id===panel.querySelector('select').value);const form=panel.querySelector('#office-fields');form.innerHTML='';
  if(!descriptor)return;
  for(const [key,schema]of Object.entries(descriptor.input_schema.properties||{})){
   if(key==='schema_version')continue;
   const label=document.createElement('label');label.textContent=labels[key]||schema.title||key;let input;
   if(schema.type==='boolean'){input=document.createElement('input');input.type='checkbox';}
   else if(schema.type==='object'||schema.type==='array'){input=document.createElement('textarea');input.value=schema.type==='array'?'[]':'{}';}
   else{input=document.createElement('input');input.type=schema.format==='date-time'?'datetime-local':schema.type==='integer'||schema.type==='number'?'number':key==='password'?'password':'text';input.value=schema.default??'';if(input.type==='number')input.step=schema.type==='integer'?'1':'any';}
   input.name=key;input.dataset.schema=JSON.stringify(schema);if(descriptor.input_schema.required?.includes(key))input.required=true;label.append(input);form.append(label);
  }
 };
 panel.querySelector('#office-operation').onchange=build;build();
 panel.querySelector('form').onsubmit=async event=>{
  event.preventDefault();try{const descriptor=actions.find(c=>c.capability_id===panel.querySelector('select').value);if(!descriptor)throw Error('Selecciona una capacidad');const inputs={};
   for(const input of panel.querySelectorAll('[name]')){const schema=JSON.parse(input.dataset.schema);if(input.type==='checkbox')inputs[input.name]=input.checked;else if(input.value!=='')inputs[input.name]=schema.type==='object'||schema.type==='array'?JSON.parse(input.value):schema.format==='date-time'?new Date(input.value).toISOString():input.type==='number'?Number(input.value):input.value;}
   const result=await request(prefix()+'/commands',{id:crypto.randomUUID(),operation:descriptor.canonical_id,target:selected,inputs,branch,expected_revision:world.revision});await refresh();status('Resultado Core: '+result.status+' · evento '+result.event.id);
  }catch(error){status(error.message);}
 };
 renderQuery();
}
function renderQuery(){
 const element=host.querySelector('#office-query');
 element.innerHTML='<h3>Consulta con evidencia</h3><form><select name="kind">'+Object.entries({graph:'Grafo de relaciones',entity:'Ficha de entidad',location:'Ubicación confirmada',agenda:'Agenda y reservas',events:'Historia de eventos',camera_observations:'Observaciones de una cámara',cameras_for_person:'Cámaras que observaron a la persona',causes:'Evidencias causales',impact:'Recursos y personas afectados',diff:'Cambios desde otro instante',metrics:'Métricas'}).map(([key,label])=>'<option value="'+key+'">'+label+'</option>').join('')+'</select><label>Entidad<input name="entity_id" value="'+esc(selected)+'"></label><label>Desde<input name="from" type="datetime-local"></label><label>Hasta<input name="to" type="datetime-local"></label><button>Consultar Core</button></form><div id="office-answer"></div>';
 element.querySelector('form').onsubmit=async event=>{
  event.preventDefault();const form=element.querySelector('form');const body={kind:form.elements.kind.value,entity_id:form.elements.entity_id.value||null};body.branch=branch;if(at)body.at=at;
  for(const name of ['from','to'])if(form.elements[name].value)body[name]=new Date(form.elements[name].value).toISOString();
  try{const result=await request(prefix()+'/queries',body);const answer=element.querySelector('#office-answer');answer.replaceChildren();const title=document.createElement('p');title.textContent='Core · '+result.as_of+' · '+result.evidence.length+' evidencias';answer.append(title);
   const data=document.createElement('pre');data.textContent=JSON.stringify(result.result,null,2);answer.append(data);
  }catch(error){status(error.message);}
 };
}
window.officeCoreDiagnostics=()=>({connected:!!token,site,run,world,selected,mode,branch});
