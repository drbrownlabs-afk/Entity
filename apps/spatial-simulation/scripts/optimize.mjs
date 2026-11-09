/** Production pipeline: official Blender export -> linked-mesh dedup -> GPU-native textures
 * -> Draco geometry. Never edits or saves the high-quality Blender master. */
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS,KHRTextureBasisu} from '@gltf-transform/extensions';
import {dedup,prune,weld,draco,listTextureSlots} from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import {encodeToKTX2} from 'ktx2-encoder';
import sharp from 'sharp';
import {readFile,writeFile,stat,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base=new URL('../',import.meta.url),root=new URL('../../',base),dir=new URL('public/model/',base),evidence=new URL('docs/spatial-simulation/evidence/phase05/',root);await mkdir(evidence,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const src=new URL('../../simulation/spatial-office/.runtime/office-phase05-source.glb',base);
// Exporter output is moved to ignored staging; optimized deliverables are versioned.
let raw;try{raw=await readFile(src);}catch{raw=await readFile(new URL('office.glb',dir));await mkdir(new URL('./',src),{recursive:true});await writeFile(src,raw);}
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.encoder':await draco3d.createEncoderModule(),'draco3d.decoder':await draco3d.createDecoderModule()});
const original=await io.readBinary(raw),originalIds=original.getRoot().listNodes().filter(n=>n.getExtras().stable_id).map(n=>n.getExtras().stable_id);const start=performance.now();
const metadata=JSON.parse(await readFile(new URL('scene.json',dir),'utf8'));
for(const a of metadata.material_adaptations||[]){const mat=original.getRoot().listMaterials().find(m=>m.getName()===a.material);if(mat&&a.factor)mat.setBaseColorFactor(a.factor);}
await original.transform(dedup({keepUniqueNames:false}),weld(),prune({keepExtras:true,keepLeaves:true}));
for(const mat of original.getRoot().listMaterials())if(mat.getName().startsWith('leaves')||mat.getName().startsWith('R1 living wall green'))mat.setAlphaMode('MASK').setAlphaCutoff(.4).setDoubleSided(true);
const textureStats=[];
// Sequential encoding bounds peak production RAM. Cache is content-addressed and profile-specific.
const cache=new URL('../../simulation/spatial-office/.runtime/ktx2/',base);await mkdir(cache,{recursive:true});
for(const t of original.getRoot().listTextures()){
 const image=t.getImage();if(!image||t.getMimeType()==='image/ktx2')continue;
 const slots=listTextureSlots(t),normal=slots.some(s=>s.toLowerCase().includes('normal')),srgb=slots.some(s=>/baseColor|emissive|sheenColor/.test(s));
 const opts={isUASTC:true,needSupercompression:true,uastcLDRQualityLevel:2,generateMipmap:true,isNormalMap:normal,isPerceptual:srgb,isSetKTX2SRGBTransferFunc:srgb,enableRDO:false,enableDebug:false};
 const inputMeta=await sharp(image).metadata(),key=sha(Buffer.concat([image,Buffer.from(JSON.stringify(opts))])),file=new URL(key+'.ktx2',cache);let out;
 try{out=await readFile(file);}catch{
  out=await encodeToKTX2(image,{...opts,imageDecoder:async bytes=>{const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});return {data:new Uint8Array(data),width:info.width,height:info.height};}});await writeFile(file,out);
 }
 textureStats.push({name:t.getName(),slots,width:inputMeta.width,height:inputMeta.height,source_bytes:image.length,ktx2_bytes:out.length,normal,srgb});t.setImage(new Uint8Array(out)).setMimeType('image/ktx2');console.log('KTX2',t.getName(),image.length,'->',out.length);
}
original.createExtension(KHRTextureBasisu).setRequired(true);
await original.transform(draco({method:'edgebreaker',encodeSpeed:5,decodeSpeed:5,quantizePosition:16,quantizeNormal:12,quantizeTexcoord:14,quantizeColor:12,quantizationVolume:'mesh'}));
const out=await io.writeBinary(original);await writeFile(new URL('office.glb',dir),out);
const result=await io.readBinary(out),ids=result.getRoot().listNodes().filter(n=>n.getExtras().stable_id).map(n=>n.getExtras().stable_id),missing=originalIds.filter(i=>!ids.includes(i));if(missing.length)throw Error('Semantic IDs removed: '+missing.slice(0,8));
const scene=JSON.parse(await readFile(new URL('scene.json',dir),'utf8'));scene.glb_sha256=sha(out);scene.optimization={geometry:'KHR_draco_mesh_compression; position16, normal12, UV14',textures:'KHR_texture_basisu; UASTC + Zstd, full source resolution, mipmaps, correct normal/color spaces',instancing:'Shared meshes retained in GLB; runtime GPU instancing partitioned by spatial cell. Semantic nodes preserved.',source_export_sha256:sha(raw)};await writeFile(new URL('scene.json',dir),JSON.stringify(scene));
const report={passed:true,master_sha256:scene.master_sha256,source_bytes:raw.length,optimized_bytes:out.length,reduction_percent:100*(1-out.length/raw.length),source_sha256:sha(raw),optimized_sha256:sha(out),original_ids:originalIds.length,retained_ids:ids.length,missing_ids:missing,meshes:result.getRoot().listMeshes().length,textures:textureStats,elapsed_seconds:(performance.now()-start)/1000,notes:['No architectural mesh removed or simplified. No source texture downscaled.','Environmental HDR and a separate artificial indirect HDR basis are generated by Blender. Runtime circuit gains multiply artificial indirect; OFF is zero. Direct lamps remain independent.','High-quality master unchanged. GPU instancing constructed at runtime to retain selection IDs.']};await writeFile(new URL('optimization.json',evidence),JSON.stringify(report,null,2)+'\n');console.log('OPTIMIZE_PASS',JSON.stringify({...report,textures:report.textures.length}));
