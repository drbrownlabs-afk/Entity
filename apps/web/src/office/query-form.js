// A single query client for desktop and personal projections. Core owns scope and facts.
const labels={graph:'Relaciones',entity:'Ficha',location:'Ubicación confirmada',agenda:'Agenda y reservas',events:'Historia',camera_observations:'Observaciones de cámara',cameras_for_person:'Cámaras con evidencia',causes:'Causas y evidencias',impact:'Impacto',diff:'Cambios',metrics:'Métricas'};
function node(tag,text){const n=document.createElement(tag);if(text)n.textContent=text;return n;}
export function mountQuery(element,{getWorld,getSelection,getBranch=()=> 'main',getAt=()=>null,send,onError,onSelect}){
 element.replaceChildren(node('h3','Consulta con evidencia'));
 const form=node('form'),question=node('input');question.name='question';question.placeholder='Pregunta sobre el espacio autorizado';
 const kind=node('select');kind.name='kind';for(const [id,label]of Object.entries(labels)){const option=node('option',label);option.value=id;kind.append(option);}
 const entity=node('select');entity.name='entity_id';for(const item of Object.values(getWorld().entities)){const option=node('option',item.name||item.id);option.value=item.id;entity.append(option);}entity.value=getSelection();
 const natural=node('input');natural.type='checkbox';natural.name='natural';const naturalLabel=node('label','Usar LLM configurado');naturalLabel.prepend(natural);
 const dates={};for(const name of ['from','to']){const label=node('label',name==='from'?'Desde':'Hasta');const input=node('input');input.type='datetime-local';input.name=name;dates[name]=input;label.append(input);form.append(label);}
 const submit=node('button','Consultar ENTITY');form.prepend(question,kind,entity,naturalLabel);form.append(submit);element.append(form);const answer=node('div');answer.id='office-answer';element.append(answer);
 form.onsubmit=async event=>{
  event.preventDefault();submit.disabled=true;
  try{
   if(natural.checked&&(getAt()||getBranch()!=='main'))throw Error('Para consultar un instante histórico o un escenario, utiliza la consulta guiada con su contexto explícito.');
   const query={kind:kind.value,entity_id:entity.value||null,branch:getBranch()};if(getAt())query.at=getAt();
   for(const [name,input]of Object.entries(dates))if(input.value)query[name]=new Date(input.value).toISOString();
   const trace=await send({id:crypto.randomUUID(),question:question.value||('Consulta guiada: '+labels[kind.value]),...(!natural.checked?{query}:{})});
   if(trace.status!=='verified')throw Error('ENTITY: '+trace.status+' '+JSON.stringify(trace.error||{}));
   const result=trace.result;answer.replaceChildren(node('p',(trace.provider==='guided'?'Consulta guiada':trace.provider)+' · '+result.as_of+' · '+result.evidence.length+' evidencias'));
   const references=new Set();const visit=value=>{if(typeof value==='string'&&getWorld().entities[value])references.add(value);else if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')Object.values(value).forEach(visit);};visit(result.result);
   for(const id of references){const button=node('button',getWorld().entities[id].name||id);button.type='button';button.onclick=()=>onSelect?.(id);answer.append(button);}
   const data=node('pre');data.textContent=JSON.stringify(result.result,null,2);answer.append(data);
  }catch(error){onError(error);}finally{submit.disabled=false;}
 };
}
