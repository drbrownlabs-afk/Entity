// Adapter of PlayCanvas's native cubemap-renderer.js and reflection-box example (MIT).
// Captures actual runtime state. Transparent glass is excluded from probe cameras to prevent
// recursive refraction; it receives a locally box-projected HDR reflection instead.
import * as pc from 'playcanvas';
export function installReflections(app,camera,materialsByRoom,excludedLayer,data){
 const device=app.graphicsDevice,resolution=128,cube=new pc.Texture(device,{name:'Local HDR reflection',width:resolution,height:resolution,format:pc.PIXELFORMAT_RGBA16F,cubemap:true,mipmaps:true,minFilter:pc.FILTER_LINEAR_MIPMAP_LINEAR,magFilter:pc.FILTER_LINEAR});
 const root=new pc.Entity('Architectural reflection probe');app.root.addChild(root);const rotations=[[0,90,0],[0,-90,0],[-90,0,180],[90,0,180],[0,180,0],[0,0,0]],cameras=[],atlases=new Map();
 for(let i=0;i<6;i++){const target=new pc.RenderTarget({name:'HDR probe face '+i,colorBuffer:cube,depth:true,face:i});const e=new pc.Entity('Reflection face '+i);e.addComponent('camera',{aspectRatio:1,fov:90,nearClip:.08,farClip:50,priority:-20+i,layers:[pc.LAYERID_WORLD,pc.LAYERID_SKYBOX],clearColor:new pc.Color(.01,.015,.02),clearColorBuffer:true,clearDepthBuffer:true,toneMapping:pc.TONEMAP_NONE,gammaCorrection:pc.GAMMA_NONE,renderTarget:target});root.addChild(e);e.setEulerAngles(...rotations[i]);e.camera.enabled=false;cameras.push(e);}
 const social={
  'sim:LOUNGE':[-12.1,-7.1,-5.85,-.15,-1.55,1.72],
  'sim:CAFE-01':[-12,-6.4,-27.8,-18.4,-1.55,1.72],
  'sim:RECREATION':[-6.4,-2.85,-28.3,-18.4,-1.55,1.72],
  'WAITING-AREA':[-6.4,-2.85,-18.4,-13.1,-1.55,1.72],
  'RECEPTION':[-6.4,-2.85,-18.4,-13.1,-1.55,1.72],
  'sim:WC':[-7.9,-5.2,.3,2.5,-1.55,1.72],
  'sim:LOCKERS':[-5.2,-3.3,-1.8,2.5,-1.55,1.72],
  'sim:PRINT':[-5.2,-3.3,-1.8,2.5,-1.55,1.72],
  'sim:CALL-01':[-11.8,-10.25,-.1,2.2,-1.55,1.72],
  'sim:CALL-02':[-9.8,-8.25,-.1,2.2,-1.55,1.72],
  'CIRCULATION-01':[-2.85,-1.5,-28.2,2.2,-1.85,1.72]
 };
 const boxes=new Map(Object.entries(social));for(const r of data.room_bounds||[])boxes.set(r.id,[...r.bounds,r.floor_y,1.72]);
 const aliases={lounge:'sim:LOUNGE',office:'A','computer-detail':'A','vertical-garden':'MEETING-AREA-01','garden-detail':'MEETING-AREA-01',meeting:'MEETING-AREA-01',comedor:'sim:RECREATION',cafe:'sim:CAFE-01',waiting:'WAITING-AREA',reception:'RECEPTION',WC:'sim:WC',services:'sim:LOCKERS',booths:'sim:CALL-01',corridor:'CIRCULATION-01','glass-detail':'A','lighting-corner':'sim:LOUNGE'};
 let active=null,queued=null,inFlight=false,count=0,lastCapture=0,lastHour=NaN,lastEvents=-1;
 function request(room){if(!boxes.has(room))return;active=room;queued=room;app.renderNextFrame=true;}
 function start(){if(!queued||inFlight)return;const room=queued,b=boxes.get(room);queued=null;const center=new pc.Vec3((b[0]+b[1])/2,(b[4]+b[5])/2,(b[2]+b[3])/2);root.setPosition(center);root._room=room;root._box=new pc.BoundingBox(center,new pc.Vec3((b[1]-b[0])/2,(b[5]-b[4])/2,(b[3]-b[2])/2));for(const e of cameras)e.camera.enabled=true;inFlight=true;app.renderNextFrame=true;}
 app.scene.on('postrender',component=>{if(!inFlight||component!==cameras[5].camera)return;const room=root._room;let atlas=atlases.get(room);atlas=pc.EnvLighting.generateAtlas(cube,{target:atlas,size:512,numReflectionSamples:64,numAmbientSamples:64});atlases.set(room,atlas);
  for(const mat of materialsByRoom.get(room)||[]){mat.envAtlas=atlas;mat.cubeMapProjection=pc.CUBEPROJ_BOX;mat.cubeMapProjectionBox=root._box;mat.update();}
  // Broad architectural floors/ceilings can span rooms; keep global atlas there, with HDR lightmaps.
  for(const e of cameras)e.camera.enabled=false;inFlight=false;count++;lastCapture=performance.now();
 });
 return {view(name){const id=aliases[name];if(id)request(id);else active=null;},request,update(state,position){if(position){const room=[...boxes].find(([,b])=>position[0]>=b[0]&&position[0]<=b[1]&&position[2]>=b[2]&&position[2]<=b[3]);if(room&&room[0]!==active)request(room[0]);}if(!active)return;const changed=state.revision!==lastEvents||!Number.isFinite(lastHour)||Math.abs(state.hour-lastHour)>.1;if(changed&&performance.now()-lastCapture>250){queued=active;lastHour=state.hour;lastEvents=state.revision;}start();},ready:()=>!queued&&!inFlight,stats:()=>({captures:count,active_room:active,cached_atlases:atlases.size,resolution,HDR:true,box_projection:true})};
}
