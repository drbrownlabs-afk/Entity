// Persist an actual rendered synthetic snapshot through the existing Observation v1 API.
export function saveRenderedObservation(snapshot,{site,send}){
 if(snapshot.provenance?.simulated!==true)throw Error('This control accepts virtual camera observations only');
 return send({observation_id:crypto.randomUUID(),site_id:site,source_id:snapshot.source_id,observed_at:snapshot.clock,type:'edge.presence',payload:snapshot.payload,provenance:snapshot.provenance});
}
