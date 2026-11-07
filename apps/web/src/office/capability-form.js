// One client for declared Núcleo contracts; all business policy remains in Core.
export const actionNames={
 'booking.create':'Crear reserva','booking.cancel':'Cancelar reserva','booking.extend':'Extender reserva','booking.reassign':'Reasignar reserva','booking.checkin':'Check-in de reserva','booking.no_show':'Registrar no-show',
 'access.checkAuthorization':'Comprobar autorización','access.requestEntry':'Solicitar acceso','visit.register':'Registrar visita','visit.link':'Relacionar visita','visit.checkin':'Check-in de visitante',
 'identity.associate':'Verificar identidad','notification.send':'Notificar','meeting.start':'Iniciar reunión','meeting.end':'Finalizar reunión','task.create':'Crear tarea','task.assign':'Asignar tarea','task.resolve':'Resolver tarea',
 'device.setPower':'Encender/apagar','presence.checkout':'Registrar salida','equipment.fail':'Registrar avería','equipment.repair':'Registrar reparación','membership.set':'Actualizar membresía','camera.setStatus':'Estado de cámara',
 'zone.close':'Cerrar zona','zone.open':'Abrir zona','zone.assumeOccupancy':'Suponer ocupación (what-if)','clock.advance':'Avanzar reloj','entity.upsert':'Gestionar recurso','relation.add':'Añadir relación','account.create':'Crear cuenta',
 'intercom.reply':'Responder al visitante','intercom.timeout':'Registrar falta de respuesta','resource.getObject':'Consultar recurso','booking.getAvailability':'Consultar disponibilidad'
};
const fieldNames={booking_id:'Referencia de reserva',person_id:'Persona',resource_id:'Recurso',starts_at:'Inicio (hora de este dispositivo)',ends_at:'Fin (hora de este dispositivo)',party_size:'Participantes',meeting_id:'Referencia de reunión (opcional)',expected_guests:'Invitaciones previstas (avanzado)',response:'Respuesta',minutes:'Minutos',description:'Descripción',resolution:'Resolución',status:'Estado'};
export function mountCapabilities(container,{descriptors,entity,getWorld,actor,send,onComplete,onError,disabled=false}){
 const available=descriptors.filter(c=>c.resource_id===entity.id&&actionNames[c.canonical_id]&&!(entity.reservable===false&&c.canonical_id==='booking.create'));
 container.replaceChildren();if(!available.length){container.textContent='No hay acciones autorizadas para este recurso.';return;}
 const select=document.createElement('select');select.setAttribute('aria-label','Capacidad autorizada');
 for(const descriptor of available){const option=document.createElement('option');option.value=descriptor.capability_id;option.textContent=actionNames[descriptor.canonical_id];select.append(option);}
 const form=document.createElement('form'),fields=document.createElement('div'),button=document.createElement('button');fields.className='capability-fields';button.textContent='Ejecutar con autorización';button.disabled=disabled;form.append(fields,button);container.append(select,form);
 function build(){
  fields.replaceChildren();const descriptor=available.find(c=>c.capability_id===select.value);
  for(const [key,raw]of Object.entries(descriptor.input_schema.properties||{})){
   if(key==='schema_version')continue;
   const schema=raw.anyOf?.find(s=>s.type!=='null')||raw,label=document.createElement('label');label.textContent=fieldNames[key]||raw.title||key;
   let input;
   if(schema.enum){input=document.createElement('select');for(const value of schema.enum){const option=document.createElement('option');option.value=value;option.textContent=value;input.append(option);}}
   else if(schema.type==='boolean'){input=document.createElement('input');input.type='checkbox';}
   else if(schema.type==='array'||schema.type==='object'){input=document.createElement('textarea');input.value=schema.type==='array'?'[]':'{}';}
   else if(key==='person_id'&&Object.values(getWorld().entities).some(e=>e.kind==='Person')){
    input=document.createElement('select');for(const person of Object.values(getWorld().entities).filter(e=>e.kind==='Person')){const option=document.createElement('option');option.value=person.id;option.textContent=person.name||person.id;input.append(option);}
    if(actor?.person_id&&getWorld().entities[actor.person_id]?.membership_status==='active')input.value=actor.person_id;
    else if(descriptor.canonical_id==='booking.create'){const active=Object.values(getWorld().entities).find(p=>p.kind==='Person'&&p.membership_status==='active');if(active)input.value=active.id;}
   }else{
    input=document.createElement('input');input.type=schema.format==='date-time'?'datetime-local':['integer','number'].includes(schema.type)?'number':key==='password'?'password':'text';
    input.value=raw.default??schema.default??(key==='booking_id'?'booking-'+crypto.randomUUID():'');if(input.type==='number')input.step=schema.type==='integer'?'1':'any';
   }
   input.name=key;input.dataset.schema=JSON.stringify(schema);input.required=descriptor.input_schema.required?.includes(key)||false;
   if(schema.minimum!==undefined)input.min=schema.minimum;if(schema.maximum!==undefined)input.max=schema.maximum;
   label.append(input);fields.append(label);
  }
 }
 select.onchange=build;build();
 form.onsubmit=async event=>{
  event.preventDefault();button.disabled=true;
  try{
   const descriptor=available.find(c=>c.capability_id===select.value),inputs={};
   for(const input of fields.querySelectorAll('[name]')){
    const schema=JSON.parse(input.dataset.schema);
    if(input.type==='checkbox')inputs[input.name]=input.checked;
    else if(input.value!=='')inputs[input.name]=schema.type==='object'||schema.type==='array'?JSON.parse(input.value):schema.format==='date-time'?new Date(input.value).toISOString():input.type==='number'?Number(input.value):input.value;
   }
   const world=getWorld();const result=await send({id:crypto.randomUUID(),operation:descriptor.canonical_id,target:entity.id,inputs,branch:world.branch,expected_revision:world.revision});
   await onComplete(result);
  }catch(error){onError(error);}
  finally{button.disabled=disabled;}
 };
}
