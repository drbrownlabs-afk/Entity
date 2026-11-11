// Opt-in P2 virtual camera editor, on the existing AppBase and building.
import * as pc from 'playcanvas';
const clone=value=>JSON.parse(JSON.stringify(value));
const radians=value=>value*Math.PI/180;
const degrees=value=>value*180/Math.PI;

export async function installCctvProfile(spatial,base){
 const response=await fetch(base+'perception/profiles/cctv-c.json');
 if(!response.ok)throw Error('Perfil CCTV no disponible');
 const original=await response.json(),storageKey='entity-p2-cctv-c-v1';
 let config=clone(original),overview=false,revision=0;
 const {app,camera}=spatial.renderer;
 function validate(value){
  if(value.profile_id!==original.profile_id||value.cameras?.length!==8||value.devices?.length!==5)throw Error('Se requieren cinco dispositivos y ocho sensores');
  for(const key of Object.keys(value))if(!(key in original))throw Error('Campo no permitido: '+key);
  // Imported profiles may change optical settings, never invent provenance or
  // smuggle simulator state through otherwise legitimate metadata containers.
  for(const key of Object.keys(original))if(key!=='cameras'&&JSON.stringify(value[key])!==JSON.stringify(original[key]))throw Error('Metadato de perfil inmutable: '+key);
  const ids=new Set();
  for(const item of value.cameras){
   const reference=original.cameras.find(c=>c.id===item.id);
   if(!reference||ids.has(item.id))throw Error('Sensor desconocido o duplicado');ids.add(item.id);
   for(const key of Object.keys(item))if(!(key in reference))throw Error('Metadato de cámara no permitido: '+key);
   const adjustable=new Set(['position','target','resolution','vfov_deg','K','hfov_deg','downward_axis_degrees']);
   for(const key of Object.keys(reference))if(!adjustable.has(key)&&JSON.stringify(item[key])!==JSON.stringify(reference[key]))throw Error('Metadato de sensor inmutable: '+key);
   if(item.device_id!==reference.device_id||item.sensor_id!==reference.sensor_id||item.channel_id!==reference.channel_id||item.stream_id!==reference.stream_id)throw Error('No reasignar identidad de dispositivo/sensor/canal/stream');
   for(const name of ['position','target'])if(!Array.isArray(item[name])||item[name].length!==3||!item[name].every(Number.isFinite))throw Error('Pose inválida');
   if(Math.hypot(...item.target.map((v,i)=>v-item.position[i]))<.01)throw Error('La cámara necesita una dirección válida');
   if(item.projection!=='rectified-pinhole'||item.model!==reference.model||item.resolution?.length!==2||!item.resolution.every(v=>Number.isInteger(v)&&v>=160&&v<=2592))throw Error('Perfil óptico no compatible');
   if(item.resolution[0]*3!==item.resolution[1]*4)throw Error('Conservar relación óptica 4:3 del perfil rectificado');
   const [x,y,z]=item.position;if(x< -13||x>5||z< -30||z>4||y< -.2||y>1.6)throw Error('Montaje fuera de los límites nativos revisables');
   const max=item.device_id==='C'?71.5:74,min=item.device_id==='C'?30:29;
   if(!Number.isFinite(item.vfov_deg)||item.vfov_deg<min||item.vfov_deg>max)throw Error('FOV fuera del rango documentado');
   const down=degrees(Math.atan2(y-item.target[1],Math.hypot(x-item.target[0],z-item.target[2])));
   if(down<(item.device_id==='C'?23:0)||down>(item.device_id==='C'?90:80))throw Error('Inclinación fuera del intervalo virtual compatible con el montaje');
  }
  // A central device is moved as a support; heads retain independent orientation.
  const origins=value.cameras.filter(c=>c.device_id==='C').map(c=>JSON.stringify(c.position));
  if(new Set(origins).size!==1)throw Error('Los cabezales de C comparten el soporte virtual');
  for(const device of value.devices){const reference=original.devices.find(d=>d.id===device.id);if(!reference||JSON.stringify(device.sensors)!==JSON.stringify(reference.sensors))throw Error('Inventario de sensores inconsistente');}
  value.cameras.forEach(intrinsics);
  return value;
 }
 if(new URLSearchParams(location.search).get('profileStorage')!=='ignore'){
  try{const saved=localStorage.getItem(storageKey);if(saved)config=validate(JSON.parse(saved));}catch(error){console.warn('Perfil local descartado:',error.message);}
 }
 spatial.state.playing=false;spatial.setHour(12);spatial.quality.set('balanced');
 function intrinsics(item){
  const [w,h]=item.resolution,fy=h/(2*Math.tan(radians(item.vfov_deg)/2));
  item.K=[[fy,0,w/2],[0,fy,h/2],[0,0,1]];
  item.hfov_deg=degrees(2*Math.atan(w/(2*fy)));
  item.downward_axis_degrees=degrees(Math.atan2(item.position[1]-item.target[1],Math.hypot(item.position[0]-item.target[0],item.position[2]-item.target[2])));
  return item;
 }
 function selected(){return config.cameras.find(c=>c.id===select.value);}
 function view(id){
  const item=intrinsics(config.cameras.find(c=>c.id===id));if(!item)throw Error('Sensor no declarado');
  overview=false;spatial.renderer.roof(true);camera.camera.projection=pc.PROJECTION_PERSPECTIVE;camera.camera.horizontalFov=false;
  camera.setPosition(...item.position);camera.lookAt(...item.target);camera.camera.fov=item.vfov_deg;app.renderNextFrame=true;
  return item;
 }
 function top(){
  overview=true;spatial.renderer.roof(false);camera.camera.projection=pc.PROJECTION_ORTHOGRAPHIC;camera.camera.orthoHeight=18;
  camera.setPosition(-4.5,28,-12.5);camera.setEulerAngles(-90,0,0);app.renderNextFrame=true;
 }
 async function capture(id){
  const item=view(id),[w,h]=item.resolution;
  spatial.renderer.frame.enabled=false;camera.camera.jitter=0;
  app.graphicsDevice.maxPixelRatio=1;app.setCanvasFillMode('NONE');app.setCanvasResolution('FIXED',w,h);app.resizeCanvas(w,h);
  app.render();app.graphicsDevice.gl.finish();
  return {camera_id:id,sensor_id:id,device_id:item.device_id,stream_id:item.stream_id,
   png:document.querySelector('#scene').toDataURL('image/png'),
   worldToCamera:Array.from(camera.getWorldTransform().clone().invert().data),
   projection:Array.from(camera.camera.projectionMatrix.data),K:clone(item.K),resolution:[w,h],profile_revision:revision};
 }
 const panel=document.createElement('section');panel.id='cctv-editor';panel.setAttribute('aria-label','Editor de cámaras virtuales');
 Object.assign(panel.style,{position:'fixed',right:'10px',top:'68px',width:'min(330px,92vw)',maxHeight:'76vh',overflow:'auto',padding:'12px',background:'#101c23ed',color:'#f4f6f7',zIndex:'35',border:'1px solid #cba95c',borderRadius:'8px',font:'13px system-ui'});
 const title=document.createElement('h3');title.textContent='CCTV virtual · 5 dispositivos / 8 sensores';title.style.margin='0 0 8px';panel.append(title);
 const note=document.createElement('p');note.textContent='Unidades del gemelo; escala física no certificada. Conos orientativos: validar con imágenes y oclusiones.';panel.append(note);
 const select=document.createElement('select');select.setAttribute('aria-label','Sensor CCTV');select.style.width='100%';
 for(const item of config.cameras)select.add(new Option(item.id+' · '+item.label,item.id));panel.append(select);
 const fields={};
 for(const [key,label]of [['x','X'],['y','Altura Y'],['z','Z'],['yaw','Giro horizontal °'],['pitch','Inclinación abajo °'],['fov','FOV vertical °']]){
  const row=document.createElement('label');row.textContent=label;Object.assign(row.style,{display:'flex',justifyContent:'space-between',alignItems:'center',margin:'6px 0'});
  const input=document.createElement('input');input.type='number';input.step=key==='fov'||key==='yaw'||key==='pitch'?'1':'.05';input.style.width='95px';input.setAttribute('aria-label',label);row.append(input);fields[key]=input;panel.append(row);
 }
 const status=document.createElement('p');status.setAttribute('role','status');
 function form(){const item=selected(),d=item.target.map((v,i)=>v-item.position[i]);fields.x.value=item.position[0];fields.y.value=item.position[1];fields.z.value=item.position[2];fields.yaw.value=degrees(Math.atan2(d[0],-d[2])).toFixed(2);fields.pitch.value=degrees(Math.atan2(-d[1],Math.hypot(d[0],d[2]))).toFixed(2);fields.fov.value=item.vfov_deg;}
 function setProfile(value){config=validate(clone(value));config.cameras.forEach(intrinsics);revision++;form();if(overview)top();else view(select.value);status.textContent='Perfil actualizado; vuelva a capturar y validar cobertura.';return clone(config);}
 function edit(){
  const candidate=clone(config),item=candidate.cameras.find(c=>c.id===select.value),old=item.position.slice();
  item.position=[+fields.x.value,+fields.y.value,+fields.z.value];const yaw=radians(+fields.yaw.value),pitch=radians(+fields.pitch.value);
  item.target=[item.position[0]+4*Math.sin(yaw)*Math.cos(pitch),item.position[1]-4*Math.sin(pitch),item.position[2]-4*Math.cos(yaw)*Math.cos(pitch)];item.vfov_deg=+fields.fov.value;
  if(item.device_id==='C')for(const head of candidate.cameras.filter(c=>c.device_id==='C'&&c.id!==item.id)){head.target=head.target.map((v,i)=>v+(item.position[i]-old[i]));head.position=item.position.slice();}
  try{setProfile(candidate);}catch(error){status.textContent=error.message;form();}
 }
 for(const input of Object.values(fields))input.addEventListener('change',edit);
 function button(text,action){const element=document.createElement('button');element.textContent=text;element.type='button';element.style.margin='4px';element.addEventListener('click',()=>Promise.resolve().then(action).catch(error=>{status.textContent=error.message;}));panel.append(element);return element;}
 select.addEventListener('change',()=>{form();view(select.value);});
 button('Vista superior',top);button('Ver sensor',()=>view(select.value));
 button('Guardar perfil',()=>{validate(config);localStorage.setItem(storageKey,JSON.stringify(config));status.textContent='Guardado en este navegador; configuración virtual, sin escritura en Core.';});
 button('Restablecer candidato',()=>{localStorage.removeItem(storageKey);setProfile(original);});
 button('Exportar JSON',()=>{const blob=new Blob([JSON.stringify(config,null,2)],{type:'application/json'}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='cctv-c-profile.json';link.click();URL.revokeObjectURL(link.href);});
 const importer=document.createElement('input');importer.type='file';importer.accept='.json';importer.setAttribute('aria-label','Importar perfil CCTV');importer.onchange=async()=>{try{setProfile(JSON.parse(await importer.files[0].text()));}catch(error){status.textContent=error.message;}};panel.append(importer);
 const feeds=document.createElement('div');feeds.id='cctv-feeds';Object.assign(feeds.style,{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5px'});
 button('Actualizar ocho vistas',async()=>{status.textContent='Capturando sensores independientes…';feeds.replaceChildren();for(const item of config.cameras){const frame=await capture(item.id),figure=document.createElement('figure'),image=document.createElement('img'),caption=document.createElement('figcaption');figure.style.margin='0';image.src=frame.png;image.style.width='100%';image.alt='Vista virtual '+item.id;image.dataset.sensorId=item.id;caption.textContent=item.id;figure.append(image,caption);figure.onclick=()=>{select.value=item.id;form();view(item.id);};feeds.append(figure);}status.textContent='Ocho vistas del mismo gemelo; no streams físicos.';});
 panel.append(status,feeds);document.body.append(panel);form();top();
 app.on('update',()=>{if(!overview)return;for(const item of config.cameras){
  intrinsics(item);const position=new pc.Vec3(...item.position),direction=new pc.Vec3(...item.target).sub(position).normalize(),end=position.clone().add(direction.clone().mulScalar(4)),color=item.id===select.value?new pc.Color(1,.8,.2):new pc.Color(.25,.8,.9);
  app.drawLine(position,end,color);
  // Optical frusta are orientation aids only; they do not certify visibility
  // through the building. Pixel/depth probes validate coverage separately.
  const right=new pc.Vec3().cross(direction,pc.Vec3.UP).normalize(),up=new pc.Vec3().cross(right,direction).normalize(),halfY=4*Math.tan(radians(item.vfov_deg)/2),halfX=halfY*item.resolution[0]/item.resolution[1];
  const corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>end.clone().add(right.clone().mulScalar(x*halfX)).add(up.clone().mulScalar(y*halfY)));
  for(let i=0;i<4;i++){app.drawLine(position,corners[i],color);app.drawLine(corners[i],corners[(i+1)%4],color);}
 }});
 return {get config(){return config;},capture,view,top,setProfile,profile:()=>clone(config),
  async sequence(){overview=false;spatial.renderer.roof(true);const {installCctvSequence}=await import('./cctv-sequence.js');return installCctvSequence(spatial,{config,capture,view},base);},
  revision:()=>revision,validate};
}
