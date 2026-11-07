import { Experience } from '../src/world.js';
import fs from 'node:fs';
const w=new Experience();let duplicateAccepted=false;
try{w.applyCore({id:'physical-camera',state:{'edge.presence':{simulated:false,tracks:[{local_track_id:'same',position:[.2,.3],zone_id:'north'},{local_track_id:'same',position:[.8,.9],zone_id:'south'}]}}});duplicateAccepted=w.visitors.length===2;}catch{}
const physical=new Experience();physical.applyCore({id:'physical-camera',state:{'edge.presence':{simulated:false,tracks:[{local_track_id:'track-1',position:[.2,.3],zone_id:'north'}]}}});
let exported;try{exported=physical.observation().provenance;}catch(error){exported={blocked:error.message};}
const fixture=new Experience();fixture.applyCore({id:'screen',state:{'display.scene':'remote-alert'}});fixture.local();
const report={duplicate_track_ids_accepted:duplicateAccepted,real_core_export_provenance:exported,remote_scene_leaks_to_local:fixture.scene==='remote-alert',note:'Direct viewer state adapter probe; UI export disabled in Core mode; no physical measurements'};
const output=process.argv[2]||'.runtime/mvp-audit-viewer-before.json';fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(report);
