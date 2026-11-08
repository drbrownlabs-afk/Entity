// Offline inspection of ORIGINAL voxels using the installed official SuperSplat collider.
// The module copy adds an export only; no collider algorithm or office geometry is rewritten.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import crypto from 'node:crypto';
const directory=path.resolve('apps/web/node_modules/@playcanvas/supersplat-viewer/dist');
const official=fs.readFileSync(directory+'/viewer.js','utf8');
if(!official.includes('const loadVoxelCollision = async (jsonUrl) =>'))throw Error('Pinned official collider loader changed; inspect before calibration');
const runtime=directory+'/calibration-runtime.mjs';fs.writeFileSync(runtime,official+'\nexport {loadVoxelCollision};\n');
const {loadVoxelCollision}=await import(pathToFileURL(runtime));
const original=JSON.parse(fs.readFileSync('worlds/synthetic-office/original-viewer-settings.json','utf8'));
const collision=await loadVoxelCollision(original.collisionUrl);
const cameras=JSON.parse(fs.readFileSync('worlds/synthetic-office/inspection-cameras.json','utf8')).poses;
const report={tested_commit:process.env.GITHUB_SHA||null,run_url:process.env.GITHUB_RUN_ID?'https://github.com/'+process.env.GITHUB_REPOSITORY+'/actions/runs/'+process.env.GITHUB_RUN_ID:null,
 source:'Original scene.voxel.json/bin queried with unmodified official SuperSplat1.42.1 collider; inspection only',collision_url:original.collisionUrl,
 official_viewer_sha256:crypto.createHash('sha256').update(official).digest('hex'),points:[],route_clearance:[]};
for(const [index,position]of cameras.entries()){
 const hit=collision.queryRay(...position,0,-1,0,10);
 if(!hit)throw Error('No original voxel ground below native walk camera '+index);
 report.points.push({index,native_camera:position,ground:{x:hit.x,y:hit.y,z:hit.z},eye_to_ground:position[1]-hit.y});
}
report.floor_clearance=collision.voxelResolution;
report.route_candidate=report.points.slice(0,3).map(p=>({position:[p.ground.x,p.ground.y+report.floor_clearance,p.ground.z],evidence:'docs/evidence/phase09/voxel-ground.json; original-voxel-ray-'+p.index}));
for(let segment=0;segment<2;segment++){
 const a=report.points[segment].ground,b=report.points[segment+1].ground;
 for(let step=0;step<=10;step++){
  const t=step/10,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;
  const ground=collision.queryRay(x,cameras[segment][1],z,0,-1,0,10);
  const push={x:0,y:0,z:0};
  // Human-height capsule; 2*(halfHeight+radius)=1.8. Clearance is explicit, not a resource coordinate.
  const footY=a.y+(b.y-a.y)*t+report.floor_clearance;
  const blocked=ground?collision.queryCapsule(x,footY+.9,z,.7,.2,push):true;
  report.route_clearance.push({segment,t,foot_position:[x,footY,z],ground:ground?{x:ground.x,y:ground.y,z:ground.z}:null,blocked,push});
 }
}
report.status='measured; visual review required';
fs.mkdirSync('docs/evidence/phase09',{recursive:true});fs.writeFileSync('docs/evidence/phase09/voxel-ground.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({points:report.points,blocked_samples:report.route_clearance.filter(p=>p.blocked).length}));
