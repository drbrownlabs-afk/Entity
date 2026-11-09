// Native StandardMaterial lightmaps with two Blender HDR bases. Artificial indirect lighting
// is multiplied by current circuit output; it never survives an all-OFF state.
// The direct contribution of every lamp remains an independent native area light.
import * as pc from 'playcanvas';
export function createIrradiance(data,dayTexture,artTexture){
 // Radiance RGBE cannot be filtered in encoded form. Decode once to native FP16 so the
 // lightmaps retain HDR range with smooth, stable bilinear filtering at human scale.
 function linearHDR(source){if(!source)return null;const bytes=source.lock(),pixels=new Uint16Array(source.width*source.height*4),half=pc.FloatPacking.float2Half;
  for(let i=0;i<bytes.length;i+=4){const e=bytes[i+3],scale=e?Math.pow(2,e-128)/255:0;pixels[i]=half(bytes[i]*scale);pixels[i+1]=half(bytes[i+1]*scale);pixels[i+2]=half(bytes[i+2]*scale);pixels[i+3]=0x3c00;}
  source.unlock();const texture=new pc.Texture(source.device,{name:source.name+' linear FP16',width:source.width,height:source.height,format:pc.PIXELFORMAT_RGBA16F,type:pc.TEXTURETYPE_DEFAULT,levels:[pixels],mipmaps:false,minFilter:pc.FILTER_LINEAR,magFilter:pc.FILTER_LINEAR,addressU:pc.ADDRESS_CLAMP_TO_EDGE,addressV:pc.ADDRESS_CLAMP_TO_EDGE,flipY:false});texture.upload();source.destroy();return texture;
 }
 dayTexture=linearHDR(dayTexture);artTexture=linearHDR(artTexture);
 const circuits=Object.keys(data.devices.circuits),gains=new Float32Array(circuits.length),materials=new Set(),zeroSH=new Float32Array(27),receivers=new Set(data.daylight_bake?.receivers||[]);
 const boxes=(data.room_bounds||[]).map(r=>({env:r.id,b:r.bounds}));boxes.push(
  {env:'sim:WC',b:[-7.9,-5.2,.3,2.5]},{env:'sim:CALL-01',b:[-11.8,-10.25,-.1,2.2]},{env:'sim:CALL-02',b:[-9.8,-8.25,-.1,2.2]},
  {env:'sim:LOCKERS',b:[-5.2,-3.3,.0,2.5]},{env:'sim:PRINT',b:[-5.2,-3.3,-1.8,0]},
  {env:'sim:LOUNGE',b:[-12.1,-7.1,-5.85,-.15]},{env:'sim:CAFE-01',b:[-12,-6.4,-28,-18.4]},
  {env:'sim:RECREATION',b:[-6.4,-2.85,-28.3,-18.4]},{env:'WAITING-AREA',b:[-6.4,-2.85,-18.4,-13.1]});
 const roomIndex=`int entityRoomIndex(vec3 p){${boxes.filter(r=>circuits.includes(r.env)).map(r=>`if(p.x>=${r.b[0].toFixed(4)}&&p.x<=${r.b[1].toFixed(4)}&&p.z>=${r.b[2].toFixed(4)}&&p.z<=${r.b[3].toFixed(4)})return ${circuits.indexOf(r.env)};`).join('\n')}return ${circuits.indexOf('CIRCULATION-01')};}`;
 const chunk=`uniform float entityDaylightScale;
uniform float entityCircuitGains[${circuits.length}];
uniform sampler2D entityArtificialIndirect;
${roomIndex}
void getLightMap(){
 dLightmap=vec3(0.0);
 #ifdef STD_LIGHT_TEXTURE
  vec2 uv={STD_LIGHT_TEXTURE_UV};
  vec3 environmental={STD_LIGHT_TEXTURE_DECODE}(texture2DBias({STD_LIGHT_TEXTURE_NAME},uv,{STD_TEXTURE_BIAS})).{STD_LIGHT_TEXTURE_CHANNEL};
  vec3 artificial=texture2DBias(entityArtificialIndirect,uv,{STD_TEXTURE_BIAS}).rgb;
  dLightmap=environmental*entityDaylightScale+artificial*entityCircuitGains[entityRoomIndex(vPositionW)];
 #endif
}`;
 if(dayTexture){dayTexture.flipY=false;dayTexture.addressU=dayTexture.addressV=pc.ADDRESS_CLAMP_TO_EDGE;}
 if(artTexture){artTexture.flipY=false;artTexture.addressU=artTexture.addressV=pc.ADDRESS_CLAMP_TO_EDGE;}
 function apply(record,mat){if(!dayTexture||!artTexture||!receivers.has(record.id))return false;mat.lightMap=dayTexture;mat.lightMapUv=1;mat.lightMapChannel='rgb';mat.ambientSH=zeroSH;mat.aoMap=null;mat.getShaderChunks(pc.SHADERLANGUAGE_GLSL).set('lightmapPS',chunk);mat.setParameter('entityArtificialIndirect',artTexture);mat.setParameter('entityCircuitGains[0]',gains);mat.setParameter('entityDaylightScale',1);mat.update();materials.add(mat);return true;}
 function update(state,day){for(let i=0;i<circuits.length;i++){let output=0,power=0;for(const l of data.devices.luminaires)if(l.environment_id===circuits[i]){power+=l.nominal_power_blender;output+=l.nominal_power_blender*state.output(l.id);}gains[i]=power?output/power:0;}
  const daylight=Math.max(0,day)/Math.sin(65*Math.PI/180);for(const mat of materials){mat.setParameter('entityCircuitGains[0]',gains);mat.setParameter('entityDaylightScale',daylight);}}
 return {apply,update,statistics:()=>({HDR:true,receiver_count:receivers.size,materials:materials.size,circuits:circuits.map((id,i)=>({id,indirect_gain:gains[i]})),artificial_OFF_zero:[...gains].every(g=>g===0),basis:'Blender environmental irradiance + separately mutable indirect artificial basis',indirect_approximation:'Spatially averaged response by circuit; direct lamps remain independent'})};
}
