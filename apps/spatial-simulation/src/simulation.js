// Ephemeral visual state only. Core, observations, bookings and physical devices are not replicated.
export const wrapHour=h=>((h%24)+24)%24;
export function sunAt(hour,keys){
 const h=wrapHour(hour),pair=keys.slice(1).map((b,i)=>[keys[i],b]).find(([a,b])=>h>=a[0]&&h<=b[0]);
 if(!pair)throw Error('Trayectoria solar incompleta');const [a,b]=pair,t=(h-a[0])/(b[0]-a[0]);
 return {elevation:a[1]+t*(b[1]-a[1]),azimuth:a[2]+t*(b[2]-a[2])};
}
export class VisualState {
 constructor(data){this.data=data;this.hour=12;this.playing=false;this.speed=60;this.lights=new Map(data.devices.luminaires.map(d=>[d.id,{...d.initial_state}]));this.doors=new Map(data.devices.doors.map(d=>[d.id,{fraction:0,target:0,locked:false}]));this.screens=new Map(data.devices.televisions.map(d=>[d.id,{on:true,content:'reference'}]));this.events=[];this.revision=0;}
 event(id,operation,value){this.revision++;this.events.push({id,operation,value,simulated_hour:this.hour,recorded_at:new Date().toISOString(),simulated:true,core_persisted:false});if(this.events.length>1000)this.events.shift();}
 setHour(value){if(!Number.isFinite(+value))throw Error('Hora inválida');this.hour=wrapHour(+value);}
 advance(seconds){if(this.playing)this.setHour(this.hour+Math.max(0,seconds)*this.speed/3600);}
 light(id,patch){if(!this.lights.has(id))throw Error('Luminaria no declarada');if(patch.level!==undefined&&(!Number.isFinite(+patch.level)||patch.level<0||patch.level>1))throw Error('Nivel inválido');if(patch.mode!==undefined&&!['auto','manual'].includes(patch.mode))throw Error('Modo inválido');Object.assign(this.lights.get(id),patch);this.event(id,'light',patch);}
 circuit(id,patch){const matches=this.data.devices.luminaires.filter(d=>d.environment_id===id);if(!matches.length)throw Error('Circuito no declarado');for(const d of matches)this.light(d.id,patch);}
 output(id){const d=this.data.devices.luminaires.find(l=>l.id===id),s=this.lights.get(id);const sun=sunAt(this.hour,this.data.lighting.artistic_sun),day=Math.max(0,Math.sin(sun.elevation*Math.PI/180));return s.on?s.level*(s.mode==='auto'?1-day*(1-d.daylight_minimum):1):0;}
 door(id,operation){const s=this.doors.get(id);if(!s)throw Error('Puerta no declarada');if(operation==='open'){if(s.locked)throw Error('Puerta bloqueada');s.target=1;}else if(operation==='close')s.target=0;else if(operation==='lock'){if(s.fraction>.001||s.target)throw Error('Cierra la puerta antes de bloquearla');s.locked=true;}else if(operation==='unlock')s.locked=false;else throw Error('Acción no admitida');this.event(id,operation,{...s});return s;}
 animateDoors(dt){for(const s of this.doors.values()){const delta=Math.min(Math.max(dt,0)*1.2,Math.abs(s.target-s.fraction));s.fraction+=Math.sign(s.target-s.fraction)*delta;}}
 tv(id,patch){if(!this.screens.has(id))throw Error('Pantalla no declarada');if(patch.content!==undefined&&!['reference','test'].includes(patch.content))throw Error('Contenido inválido');Object.assign(this.screens.get(id),patch);this.event(id,'screen',patch);}
}
export class CollisionWorld {
 constructor(data,state){this.data=data;this.state=state;this.radius=data.collision.radius;this.floor=new Map(data.collision.floor_nodes.map(([x,z,y])=>[`${x},${z}`,y]));this.static=data.collision.static;this.doors=data.devices.doors;}
 floorAt(x,z){return this.floor.get(`${Math.round(x/.1)},${Math.round(z/.1)}`);}
 blocked(x,y,z){const r=this.radius;for(const o of this.static){const [lo,hi]=o.bounds;if(hi[1]>y+.05&&lo[1]<y+1.65&&x>lo[0]-r&&x<hi[0]+r&&z>lo[2]-r&&z<hi[2]+r)return o.id;}
  for(const d of this.doors){const a=d.open_angle*this.state.doors.get(d.id).fraction,c=Math.cos(a),s=Math.sin(a),dx=x-d.hinge_source[0],dz=z-d.hinge_source[2];
   // +Y rotation: x'=cos*x+sin*z, z'=-sin*x+cos*z; inverse into leaf coordinates.
   const lx=c*dx-s*dz-d.collider_local_position[0],lz=s*dx+c*dz-d.collider_local_position[2],ly=y-d.hinge_source[1]-d.collider_local_position[1], [lo,hi]=d.collider_local_bounds;
   if(lx>lo[0]-r&&lx<hi[0]+r&&lz>lo[2]-r&&lz<hi[2]+r&&hi[1]>ly+.05&&lo[1]<ly+1.65)return d.id;
  }return null;
 }
 canStand(p,previousY=p[1]){const y=this.floorAt(p[0],p[2]);return y!==undefined&&Math.abs(y-previousY)<=this.data.collision.max_floor_jump+.0001&&!this.blocked(p[0],y,p[2]);}
 move(position,dx,dz){let [x,y,z]=position;const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.04));for(let i=0;i<n;i++){const nx=x+dx/n,ny=this.floorAt(nx,z);if(ny!==undefined&&this.canStand([nx,ny,z],y)){x=nx;y=ny;}const nz=z+dz/n,nzy=this.floorAt(x,nz);if(nzy!==undefined&&this.canStand([x,nzy,nz],y)){z=nz;y=nzy;}}return [x,y,z];}
}
