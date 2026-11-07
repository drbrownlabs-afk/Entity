// Kiosk and operator reception are interfaces to the same declared Núcleo capability.
export function mountReception(container,send){
 let conversation=null;
 container.innerHTML='<h3>ENTITY · recepción inteligente</h3><p>Invitación y verificación autorizada. Sin teléfono obligatorio. Datos ficticios del ensayo; no reconocimiento facial.</p><form id="reception-start"><label>Referencia de invitación<input name="invitation" required autocomplete="off"></label><button>Consultar reunión</button></form><form id="reception-check" hidden><label>Código de verificación<input name="code" type="password" required autocomplete="off"></label><button>Verificar y registrar llegada</button></form><div class="reception-controls"><button id="reception-status" type="button">Consultar respuesta</button><button id="reception-speak" type="button">Escuchar respuesta</button><button id="reception-voice" type="button">Entrada por voz</button><button id="reception-clear" type="button">Finalizar sesión privada</button></div><p id="reception-reply" role="status" aria-live="polite">Bienvenido. Introduce tu referencia de invitación.</p>';
 const output=container.querySelector('#reception-reply'),start=container.querySelector('#reception-start'),check=container.querySelector('#reception-check');
 const show=message=>{output.textContent=message;};
 async function turn(action,inputs={}){
  const result=await send({id:crypto.randomUUID(),operation:'reception.interact',target:'KIOSK-01',inputs:{conversation_id:conversation,action,...inputs}});
  if(result.status!=='verified')throw Error('Acción sin confirmación: '+result.status);
  const reply=result.details.reply;show(reply.message||reply.status);check.hidden=reply.status!=='verification_required';return reply;
 }
 start.onsubmit=async event=>{event.preventDefault();conversation=crypto.randomUUID();try{await turn('start',{invitation_id:start.elements.invitation.value.trim()});start.hidden=true;}catch(error){show(error.message);}};
 check.onsubmit=async event=>{event.preventDefault();const code=check.elements.code.value;check.elements.code.value='';try{await turn('check_in',{verification_code:code});}catch(error){show(error.message);}};
 container.querySelector('#reception-status').onclick=()=>{if(conversation)turn('status').catch(e=>show(e.message));};
 container.querySelector('#reception-speak').onclick=()=>{if('speechSynthesis'in window){speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(output.textContent);speech.lang='es-EC';speechSynthesis.speak(speech);}else show('Salida de voz no disponible en este navegador. La pantalla sigue operativa.');};
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 container.querySelector('#reception-voice').onclick=()=>{
  if(!Recognition){show('Este navegador no ofrece reconocimiento de voz. Utiliza la pantalla táctil.');return;}
  const recognition=new Recognition();recognition.lang='es-EC';recognition.interimResults=false;
  recognition.onresult=event=>{const value=event.results[0][0].transcript.trim();if(!check.hidden){check.elements.code.value=value;show('Código transcrito. Revisa y pulsa Verificar; la voz no confirma identidad.');}else{start.elements.invitation.value=value;show('Referencia transcrita. Revisa y pulsa Consultar reunión.');}};
  recognition.onerror=event=>show('Entrada de voz: '+event.error+'. Puedes continuar por pantalla.');
  recognition.start();
 };
 container.querySelector('#reception-clear').onclick=()=>{conversation=null;start.reset();check.reset();start.hidden=false;check.hidden=true;window.speechSynthesis?.cancel();show('Sesión de pantalla terminada. Los registros autorizados permanecen en Core.');};
}
