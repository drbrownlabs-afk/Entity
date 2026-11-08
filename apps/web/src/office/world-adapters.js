import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import observationSchema from '../../../../packages/contracts/integrations/v1/Observation.json' with {type:'json'};
const ajv=addFormats(new Ajv2020({strict:false,allErrors:true}));
const validateObservation=ajv.compile(observationSchema);
const clone=value=>structuredClone(value);
const date=value=>Date.parse(value);
export function relations(world,id){
 const result=[];for(const [source,item]of Object.entries(world.entities))for(const edge of item.relations||[])
  if((source===id||edge.target===id)&&world.entities[edge.target]&&date(edge.valid_from||'1970-01-01')<=date(world.clock)&&(!edge.valid_to||date(world.clock)<date(edge.valid_to)))result.push({source,...edge});
 return result;
}
export class ReplayWorld {
 constructor(trace){if(trace.mode!=='synthetic-core-replay'||trace.topology_version!==5)throw Error('Unrecognized Core replay contract');this.trace=trace;this.session=[];this.receipts=new Map();this.clock=new Date(trace.default_clock).toISOString();this.connected=false;this.mode='synthetic-replay';}
 seek(clock){if(!Number.isFinite(date(clock)))throw Error('Invalid clock');this.clock=new Date(Math.min(date(this.trace.frames.at(-1).clock),Math.max(date(this.trace.initial.clock),date(clock)))).toISOString();return this.read();}
 read(){
  const state=clone(this.trace.initial),stamp=date(this.clock);
  for(const frame of this.trace.frames){if(date(frame.clock)>stamp)break;for(const id of frame.removed)delete state.entities[id];Object.assign(state.entities,clone(frame.changes));state.revision=frame.revision;}
  state.clock=this.clock;state.historical=false;state.replay=true;state.core_connected=false;state.persistence='session-only';
  // Immutable routes registered by Core carry absolute timestamps, independent of device TZ.
  for(const route of this.trace.routes)for(const motion of route.motions){
   const start=date(motion.waypoints[0].at),seconds=(stamp-start)/1000;
   const pair=motion.waypoints.slice(1).map((b,i)=>[motion.waypoints[i],b]).find(([a,b])=>stamp>=date(a.at)&&stamp<=date(b.at));
   const person=state.entities[motion.person_id];if(!person)continue;
   delete person.spatial_pose;
   if(!pair)continue;const [a,b]=pair,t=(stamp-date(a.at))/(date(b.at)-date(a.at)),dx=b.position[0]-a.position[0],dz=b.position[2]-a.position[2];
   person.avatar_id=motion.avatar_id;person.spatial_pose={position:a.position.map((x,i)=>x+(b.position[i]-x)*t),yaw:Math.atan2(dx,dz)*180/Math.PI,animation:a.position.some((x,i)=>Math.abs(b.position[i]-x)>1e-9)?'walk':'idle',animation_time:seconds,coordinate_frame:motion.coordinate_frame,validated:true,zone_id:motion.zone_id,route_id:route.id,pose_kind:'simulated-route-reconstruction',calibration_evidence:motion.calibration_evidence,evidence:[a.evidence,b.evidence],physical_identity_claimed:false};
  }
  for(const event of this.session)if(date(event.at)<=stamp)Object.assign(state.entities,clone(event.payload.changes));
  for(const item of Object.values(state.entities)){
   if(item.observed_at){const age=(stamp-date(item.observed_at))/1000;item.freshness=age>=0&&age<=(item.ttl_seconds??30)?'fresh':'stale';}
   for(const reading of Object.values(item.environment||{}))if(reading?.observed_at){const age=(stamp-date(reading.observed_at))/1000;reading.freshness=age>=0&&age<=120?'fresh':'stale';}
   if(item.kind==='Track'&&item.person_id&&stamp>date(item.association_until)){item.last_associated_person_id=item.person_id;delete item.person_id;item.identity_status='association_expired';}
  }
  state.session_revision=this.session.length;return state;
 }
 events(id){return [...this.trace.events,...this.session].filter(e=>date(e.at)<=date(this.clock)&&(!id||e.entities.includes(id)||e.payload?.person_id===id||Object.values(e.payload?.changes||{}).some(x=>x.resource_id===id||x.person_id===id)));}
 async command(body){
  const fingerprint=JSON.stringify(body),previous=this.receipts.get(body.id);if(previous){if(previous.fingerprint!==fingerprint)throw Error('La referencia ya se utilizó con otros datos');return previous.result;}
  const state=this.read(),resource=state.entities[body.target],descriptor=this.trace.capabilities.find(c=>c.resource_id===body.target&&c.canonical_id===body.operation);
  if(!descriptor||!['booking.create','booking.cancel'].includes(body.operation))throw Error('Esta acción requiere una sesión de Core; no se simula su ejecución real.');
  const validate=ajv.compile(descriptor.input_schema);if(!validate(body.inputs))throw Error('Datos de capacidad inválidos: '+ajv.errorsText(validate.errors));
  const inputs=body.inputs,changes={};
  if(body.operation==='booking.create'){
   if(body.inputs.meeting_id||body.inputs.expected_guests?.length)throw Error('Las reuniones con invitaciones requieren la conexión al Core.');
   const person=state.entities[inputs.person_id],start=date(inputs.starts_at),end=date(inputs.ends_at),party=inputs.party_size??1;
   if(!resource.reservable||resource.closed||state.entities[resource.zone_id]?.closed)throw Error('El recurso no está disponible para reservas.');
   if(!person||person.membership_status!=='active'||date(person.membership_until)<date(state.clock))throw Error('La membresía no está activa.');
   if(resource.private&&resource.organization_id!==person.organization_id)throw Error('La oficina privada pertenece a otra organización.');
   if(start<date(state.clock)||end<=start||party>resource.capacity)throw Error('Revisa el horario y la capacidad del recurso.');
   if(state.entities[inputs.booking_id])throw Error('La referencia de reserva ya existe.');
   if(Object.values(state.entities).some(x=>x.kind==='Booking'&&x.resource_id===body.target&&!['cancelled','no_show'].includes(x.status)&&start<date(x.ends_at)&&date(x.starts_at)<end))throw Error('Conflicto con una reserva existente.');
   changes[inputs.booking_id]={id:inputs.booking_id,kind:'Booking',resource_id:body.target,person_id:inputs.person_id,starts_at:new Date(start).toISOString(),ends_at:new Date(end).toISOString(),party_size:party,status:'reserved',simulated:true,scope:'demo-session-not-Core',relations:[{type:'usesResource',target:body.target,valid_from:state.clock},{type:'concernsPerson',target:inputs.person_id,field:'person_id',provenance:'explicit-domain-field',valid_from:state.clock,valid_to:null}]};
  }else{if(resource.kind!=='Booking')throw Error('Reserva no encontrada');changes[resource.id]={...resource,status:'cancelled',simulated:true,scope:'demo-session-not-Core'};}
  const event={id:body.id,seq:this.trace.events.at(-1).seq+this.session.length+1,at:state.clock,type:body.operation,actor:'operador-sintético',entities:Object.keys(changes),payload:{changes,operation:body.operation,inputs:clone(inputs),simulated:true,scope:'demo-session-not-Core'},evidence:[]};
  this.session.push(event);const result={status:'simulated',event,core_persisted:false};this.receipts.set(body.id,{fingerprint,result});return result;
 }
 async observe(observation){
  if(!validateObservation(observation))throw Error('Observación v1 inválida: '+ajv.errorsText(validateObservation.errors));
  if(observation.provenance?.simulated!==true||observation.site_id!==this.trace.initial.site_id||date(observation.observed_at)!==date(this.clock))throw Error('Observación fuera del mundo o instante actual');
  const state=this.read(),camera=state.entities[observation.source_id];if(camera?.kind!=='Camera')throw Error('Cámara no declarada');
  const changes={};
  for(const track of observation.payload.tracks){if(!camera.covered_zones.includes(track.zone_id))throw Error('Zona fuera de cobertura declarada');const id='session-track-'+camera.id+'-'+track.local_track_id;changes[id]={id,kind:'Track',camera_id:camera.id,zone_id:track.zone_id,active:true,identity_status:'anonymous',observed_at:this.clock,ttl_seconds:30,simulated:true,scope:'demo-session-not-Core'};}
  const event={id:observation.observation_id,seq:this.trace.events.at(-1).seq+this.session.length+1,at:this.clock,type:'observation.received',actor:'cámara-simulada',entities:[camera.id,...Object.keys(changes)],payload:{changes,source_id:camera.id,observation_id:observation.observation_id,observation:clone(observation),simulated:true,scope:'demo-session-not-Core'},evidence:[]};
  this.session.push(event);return {status:'simulated',core_persisted:false,event};
 }
}
export class CoreWorld {
 constructor(api,token,site,run){this.api=api.replace(/\/$/,'');this.token=token;this.site=site;this.run=run;this.connected=true;this.mode='core';}
 async request(path,body){const r=await fetch(this.api+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+this.token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(10000)});const value=await r.json();if(!r.ok)throw Object.assign(Error('Core '+r.status+': '+JSON.stringify(value.detail)),{status:r.status});return value;}
 prefix(){return '/v1/sites/'+encodeURIComponent(this.site)+'/runs/'+encodeURIComponent(this.run);}
 async refresh(){this.state=await this.request(this.prefix()+'/world');return this.state;}
 read(){return this.state;}
 command(body){return this.request(this.prefix()+'/commands',body);}
 observe(body){return this.request(this.prefix()+'/observations',body);}
 events(id){return this.request(this.prefix()+'/events?limit=1000'+(id?'&entity_id='+encodeURIComponent(id):''));}
}
