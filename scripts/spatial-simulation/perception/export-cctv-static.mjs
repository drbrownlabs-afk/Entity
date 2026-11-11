// Simulator-side static exporter. It never instantiates an actor or reads routes.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {CollisionWorld} from '../../../apps/spatial-simulation/src/simulation.js';
const root=new URL('../../../',import.meta.url),sceneBytes=await readFile(new URL('apps/spatial-simulation/public/model/scene.json',root)),source=JSON.parse(sceneBytes);
const data={collision:source.collision,devices:{doors:source.devices.doors}};
const step=.2,scenarios={};
for(const scenario of ['closed','security-open']){
 const state={doors:new Map(data.devices.doors.map(d=>[d.id,{fraction:scenario==='security-open'&&d.id.includes('security')?1:0}]))};
 const world=new CollisionWorld(data,state),nodes=[],lookup=new Map();
 for(const[ix,iz,y]of data.collision.floor_nodes){if(ix%2||iz%2)continue;const p=[ix/10,y,iz/10];if(!world.canStand(p))continue;lookup.set(ix+','+iz,nodes.length);nodes.push(p);}
 const edges=[];
 for(let index=0;index<nodes.length;index++){
  const p=nodes[index],ix=Math.round(p[0]*10),iz=Math.round(p[2]*10);
  for(const[dx,dz]of [[2,0],[0,2],[2,2],[2,-2]]){
   const other=lookup.get((ix+dx)+','+(iz+dz));if(other===undefined)continue;const q=nodes[other];
   if(dx&&dz&&(!lookup.has((ix+dx)+','+iz)||!lookup.has(ix+','+(iz+dz))))continue;
   const moved=world.move(p,q[0]-p[0],q[2]-p[2]);if(Math.hypot(...moved.map((v,i)=>v-q[i]))>.0001)continue;
   const reverse=world.move(q,p[0]-q[0],p[2]-q[2]);if(Math.hypot(...reverse.map((v,i)=>v-p[i]))>.0001)continue;
   edges.push([index,other,Math.hypot(...q.map((v,i)=>v-p[i]))]);
  }
 }
 const doors=data.devices.doors.map(d=>({id:d.id,hinge:d.hinge_source,angle:d.open_angle*state.doors.get(d.id).fraction,local_position:d.collider_local_position,local_bounds:d.collider_local_bounds,state_assumption:state.doors.get(d.id).fraction?'open':'closed'}));
 scenarios[scenario]={nodes,edges,doors};console.log(scenario,':',nodes.length,'free cells,',edges.length,'bidirectional edges');
}
// Opaque/static bounds only. Glazing and foliage are uncertain occluders, not
// certified opaque walls. Their pixel effects were checked separately in09.12.
const ignored=new Set(['Vegetation','Window','DisplayGlazing','Floor','FloorFinish','FloorDetail','Ramp','Step','Rug','Ceiling','CeilingDetail','DoorPivot','DoorLeaf','DoorHandle','DoorHardware']);
const bounds=source.records.filter(r=>r.bounds&&!ignored.has(r.type)).map(r=>({id:r.id,type:r.type,bounds:r.bounds}));
const output={schema_version:'1.0',input_kind:'static calibrated building context only',scene_sha256:createHash('sha256').update(sceneBytes).digest('hex'),coordinate_frame:source.coordinate_frame,metric_scale_verified:false,grid_step_native:step,capsule_radius_native:data.collision.radius,opaque_aabbs:bounds,scenarios};
const path=new URL('simulation/spatial-office/.runtime/cctv-static-context.json',root);await mkdir(new URL('./',path),{recursive:true});await writeFile(path,JSON.stringify(output));
console.log('Static context exported; no actor IDs, poses, routes, animation or visibility labels');
