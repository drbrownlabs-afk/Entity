// Simulator-side only. Raw pixels go directly to a loopback binary sink; no
// poses/private actor identifiers are sent with them. Default PNG path preserved.
import {chromium} from '@playwright/test';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../../../',import.meta.url),out=new URL('docs/spatial-simulation/evidence/p2-09/09.19/',root);
await mkdir(out,{recursive:true});
const received=[];
const server=createServer(async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5192');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
 if(req.method!=='POST'||req.url!=='/frame'){res.writeHead(404);res.end();return;}
 const chunks=[];let bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>16*1024**2){res.writeHead(413);res.end();return;}chunks.push(chunk);}
 const data=Buffer.concat(chunks);received.push({bytes,sha256:createHash('sha256').update(data).digest('hex')});res.end('ok');
});
await new Promise(resolve=>server.listen(8899,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.P2_CHROMIUM,headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1296,height:972},deviceScaleFactor:1});
 await context.addInitScript(()=>{const raf=requestAnimationFrame.bind(window);window.requestAnimationFrame=f=>f.name==='tick'?0:raf(f);});
 const page=await context.newPage();await page.goto('http://127.0.0.1:5192/Entity/spatial-simulation/?cameraProfile=cctv-c&profileStorage=ignore');
 await page.waitForFunction(()=>window.cctvProfile,null,{timeout:180000});
 const info=await page.evaluate(async()=>{
  for(const[id,door]of spatial.state.doors)if(id.includes('security')){door.fraction=1;door.target=1;}spatial.renderer.environmentUpdate(true);
  window.rawSequence=await cctvProfile.sequence();const gl=spatial.renderer.app.graphicsDevice.gl,ext=gl.getExtension('WEBGL_debug_renderer_info');
  const sensors=cctvProfile.profile().cameras.map(c=>c.id),start=performance.now();for(const id of sensors)await rawSequence.background(id);
  return {sensors,background_ms:performance.now()-start,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)};
 });
 const parity=[];
 for(const id of info.sensors)parity.push(await page.evaluate(async id=>{
  const feet=[-2.2,spatial.collision.floorAt(-2.2,.8),.8];const png=await rawSequence.frame(id,feet),raw=await rawSequence.frame(id,feet,{format:'bgr8'});
  const image=await createImageBitmap(await(await fetch(png.png)).blob());const canvas=new OffscreenCanvas(...raw.image_size),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
  const rgba=ctx.getImageData(0,0,...raw.image_size).data;let differing=0,maxError=0;
  for(let i=0;i<raw.pixels.length/3;i++)for(let c=0;c<3;c++){const error=Math.abs(raw.pixels[i*3+c]-rgba[i*4+2-c]);differing+=error!==0;maxError=Math.max(maxError,error);}
  return {sensor:id,differing_channels:differing,max_abs_error:maxError,pixels:raw.pixels.length/3};
 },id));
 if(parity.some(r=>r.differing_channels))throw Error('Raw/default PNG parity failed: '+JSON.stringify(parity));
 const rows=[];
 // One RPC covers already rendered independent frames; each is posted as its
 // own binary image, no panorama. No synchronous PNG/base64 return to Node.
 for(let cycle=0;cycle<5;cycle++)rows.push(...await page.evaluate(async({sensors,cycle})=>{
  const rows=[];for(const id of sensors){const start=performance.now();const frame=await rawSequence.frame(id,[-2.2,spatial.collision.floorAt(-2.2,.8),.8],{format:'bgr8'});const rendered=performance.now();
   const reply=await fetch('http://127.0.0.1:8899/frame',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:frame.pixels});if(!reply.ok)throw Error('Binary sink failed');await reply.text();
   rows.push({sensor:id,cycle,render_read_bgr_ms:rendered-start,render_transfer_ms:performance.now()-start,bytes:frame.pixels.byteLength});
  }return rows;
 },{sensors:info.sensors,cycle}));
 const timed=rows.filter(r=>r.cycle>0),stats=v=>({n:v.length,p50:v.toSorted((a,b)=>a-b)[Math.floor((v.length-1)*.5)],p95:v.toSorted((a,b)=>a-b)[Math.floor((v.length-1)*.95)],sum:v.reduce((a,b)=>a+b,0)});
 const pngBatches={};
 for(const size of [1,4,8]){
  const batches=[];
  for(let cycle=0;cycle<4;cycle++)for(let start=0;start<info.sensors.length;start+=size){
   const sensors=info.sensors.slice(start,start+size),before=performance.now();
   const images=await page.evaluate(async sensors=>{const images=[];for(const id of sensors)images.push(await rawSequence.frame(id,[-2.2,spatial.collision.floorAt(-2.2,.8),.8]));return images;},sensors);
   const ms=performance.now()-before;if(cycle>0)batches.push({ms,frames:images.length,bytes:images.reduce((n,f)=>n+Buffer.byteLength(f.png.split(',')[1],'base64'),0)});
  }
  pngBatches[size]={rpc_ms:stats(batches.map(b=>b.ms)),frames:batches.reduce((n,b)=>n+b.frames,0),
   aggregate_fps:batches.reduce((n,b)=>n+b.frames,0)/batches.reduce((n,b)=>n+b.ms,0)*1000,
   png_bytes:batches.reduce((n,b)=>n+b.bytes,0)};
 }
 const report={phase:'P2-09.19',mode:'short native RGB transport probes; not integrated Core run',renderer:info.renderer,
  background_setup_ms_excluded:info.background_ms,warmup_cycles_excluded:1,independent_sensors:8,raw_png_exact_parity:parity,
  render_read_bgr_ms:stats(timed.map(r=>r.render_read_bgr_ms)),render_transfer_ms:stats(timed.map(r=>r.render_transfer_ms)),
  binary_messages_received:received.length,binary_bytes_received:received.reduce((sum,r)=>sum+r.bytes,0),
  png_independent_frame_rpc_group_sizes:pngBatches,
  limitations:['Fixed synthetic entry stimulus, not a trajectory quality test','Short probe; not sustained 16FPS or capture-to-Core latency','Loopback Windows sink; Windows-to-WSL inference remains separately measurable']};
 await writeFile(new URL('raw-capture-probe.json',out),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
