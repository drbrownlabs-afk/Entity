// Site calibration only. Geometry queries are the unchanged official SuperSplat collider;
// A* is qiao/PathFinding.js 0.4.18 (MIT), not a new navigation/physics engine.
import fs from 'node:fs';
import PF from '../../apps/web/node_modules/pathfinding/index.js';
const {loadVoxelCollision}=await import('../../apps/web/node_modules/@playcanvas/supersplat-viewer/dist/calibration-runtime.mjs');
const original=JSON.parse(fs.readFileSync('worlds/synthetic-office/original-viewer-settings.json'));
const measured=JSON.parse(fs.readFileSync('docs/evidence/phase09/voxel-ground.json'));
const calibration=JSON.parse(fs.readFileSync('worlds/synthetic-office/calibrated-resources.json'));
const semantic=JSON.parse(fs.readFileSync('worlds/synthetic-office/semantic-annotations.json'));
const collision=await loadVoxelCollision(original.collisionUrl),resolution=collision.voxelResolution;
const anchors=Object.fromEntries(calibration.resources.filter(r=>r.kind==='Desk').map(r=>[r.id,r.attributes.position]));
Object.assign(anchors,{A:original.settings.annotations[0].position,B:original.settings.annotations[2].position,'MEETING-AREA-01':original.settings.annotations[1].position});
for(const s of semantic)anchors[s.extras.entity_id]=s.position;
const seed=measured.route_candidate[0].position,spacing=resolution*4;
const xs=Object.values(anchors).map(p=>p[0]),zs=Object.values(anchors).map(p=>p[2]);
// Search envelope only: candidates are never adopted without actual floor/capsule queries.
const minX=Math.floor((Math.min(...xs,seed[0])-2)/spacing)*spacing,minZ=Math.floor((Math.min(...zs)-6)/spacing)*spacing;
const width=Math.ceil((Math.max(...xs)+2-minX)/spacing)+1,height=Math.ceil((Math.max(...zs)+2-minZ)/spacing)+1;
const floors=measured.points.map(p=>p.ground.y),low=Math.min(...floors)-resolution*5,high=Math.max(...floors)+resolution*3;
function sample(x,z){const hit=collision.queryRay(x,high+resolution,z,0,-1,0,4);if(!hit||hit.y<low||hit.y>high)return null;const foot=[hit.x,hit.y+resolution,hit.z],push={x:0,y:0,z:0};if(collision.queryCapsule(foot[0],foot[1]+.9,foot[2],.7,.2,push))return null;return foot;}
const nodes=new Map(),matrix=Array.from({length:height},()=>Array(width).fill(1));
for(let z=0;z<height;z++)for(let x=0;x<width;x++){const foot=sample(minX+x*spacing,minZ+z*spacing);if(foot){nodes.set(x+','+z,foot);matrix[z][x]=0;}}
const nearest=(p)=>[...nodes].map(([key,position])=>({key,position,distance:Math.hypot(position[0]-p[0],position[2]-p[2])})).sort((a,b)=>a.distance-b.distance);
const start=nearest(seed)[0],finder=new PF.AStarFinder({diagonalMovement:PF.DiagonalMovement.Never});
const report={tested_commit:process.env.GITHUB_SHA||null,run_url:'https://github.com/'+process.env.GITHUB_REPOSITORY+'/actions/runs/'+process.env.GITHUB_RUN_ID,source:'Original official voxel floor rays and human capsule queries; PathFinding.js A* over measured free samples',collision_url:original.collisionUrl,metric_scale_verified:false,spacing,body:{height:1.8,radius:.2},sampling_envelope:{minX,minZ,width,height},walkable_samples:nodes.size,seed:start,resources:{},routes:{}};
const save=()=>fs.writeFileSync('docs/evidence/phase09/office-navigation.json',JSON.stringify(report,null,2));
for(const [id,anchor]of Object.entries(anchors)){
 let found;
 for(const candidate of nearest(anchor).slice(0,180)){
  if(candidate.distance>3)break;
  const route=finder.findPath(...start.key.split(',').map(Number),...candidate.key.split(',').map(Number),new PF.Grid(matrix));if(!route.length)continue;
  const points=route.map(([x,z])=>nodes.get(x+','+z));let valid=true,samples=0;
  for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];for(const t of [0,.5,1]){const p=a.map((v,k)=>v+(b[k]-v)*t),floor=sample(p[0],p[2]);samples++;if(!floor||Math.abs(floor[1]-p[1])>resolution*2){valid=false;break;}}if(!valid)break;}
  if(!valid)continue;found={anchor,approach:candidate.position,distance_to_anchor:candidate.distance,approach_kind:'measured accessible floor beside the resource; not a seat or physical device mount',clearance_samples:samples,points};break;
 }
 report.resources[id]=found?{...found,points:undefined}:{anchor,status:'no connected capsule-clear approach found'};
 if(found)report.routes[id]=found.points;save();
}
// Actual floor beneath each measured chair is distinct from its top surface.
report.seat_floor={};for(const [id,anchor]of Object.entries(anchors).filter(([id])=>/^[CD][1-6]$/.test(id))){const ground=collision.queryRay(anchor[0],low+resolution*7,anchor[2],0,-1,0,4);report.seat_floor[id]=ground&&ground.y>=low&&ground.y<=high?[ground.x,ground.y+resolution,ground.z]:null;}
report.grid={origin:[minX,minZ],spacing,width,height,walkable:[...nodes].map(([key,position])=>({node:key.split(',').map(Number),position})),blocked_edges:[]};
for(const [key,a]of nodes){const [x,z]=key.split(',').map(Number);for(const other of [[x+1,z],[x,z+1]]){const b=nodes.get(other.join(','));if(!b)continue;const p=a.map((v,k)=>(v+b[k])/2),floor=sample(p[0],p[2]);if(!floor||Math.abs(floor[1]-p[1])>resolution*2)report.grid.blocked_edges.push([key,other.join(',')]);}}
report.status=Object.values(report.resources).every(r=>r.approach)?'measured; original visual route review required':'partial; inaccessible approaches retained explicitly';save();console.log(JSON.stringify({status:report.status,walkable_samples:nodes.size,resources:Object.fromEntries(Object.entries(report.resources).map(([id,r])=>[id,r.approach||r.status]))}));
