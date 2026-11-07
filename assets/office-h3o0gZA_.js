const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./operations-CLi2QLU2.js","./capability-form-hyT7XvPx.js","./reception-zQR5M7PT.js","./visuals-C7YvkBrD.js","./component-Bodd-LAz.js","./system-CmN4SVqm.js","./render-pass-picker-zN5RNuyt.js"])))=>i.map(i=>d[i]);
import"./modulepreload-polyfill-P2Xu9kJm.js";import{At as e,Bt as t,C as n,Ct as r,Dt as i,Et as a,F as o,Ft as s,I as c,L as l,Lt as u,Mt as d,Nt as f,Ot as p,R as m,St as h,T as g,Tt as _,V as v,Vt as y,Wt as b,X as x,Z as S,at as C,b as w,bt as T,h as E,i as D,it as O,jt as k,kt as A,l as j,m as M,mt as N,n as P,o as F,ot as I,pt as L,q as R,r as ee,s as te,st as z,t as ne,ut as re,v as ie,w as ae,xt as oe,y as se,yt as ce,zt as le}from"./xr-manager-Ypy0vTku.js";import{An as ue,At as de,Bt as fe,C as pe,Dt as me,Et as B,Ft as he,Gn as ge,Gt as V,Hn as _e,Ht as ve,It as H,Jn as ye,Jt as be,Kt as xe,Lt as Se,Mn as Ce,Nt as we,On as Te,Ot as Ee,Pt as De,Qn as Oe,Qt as ke,Rt as Ae,Tt as je,Un as Me,Ut as Ne,Vt as Pe,Wt as Fe,Xn as Ie,Xt as Le,Y as Re,Yn as ze,Yt as Be,_ as Ve,_n as U,a as He,ar as Ue,bn as We,cr as Ge,dr as W,fr as G,hn as Ke,hr as qe,ir as Je,jn as Ye,jt as Xe,kn as K,kt as Ze,lr as Qe,mr as $e,o as et,or as tt,pr as q,qt as nt,sr as J,ut as rt,vr as it,vt as at,w as Y,xt as ot,yr as st}from"./component-Bodd-LAz.js";import{t as ct}from"./render-pass-picker-zN5RNuyt.js";/* empty css               */var lt=class{static concentric(e,t){let n=[];n.push(0,0);let r=2*Math.PI/e/t;for(let t=1;t<=e;t++){let i=t/e,a=2*Math.PI*i,o=Math.max(1,Math.floor(a/r)),s=2*Math.PI/o;for(let e=0;e<o;e++){let t=e*s,r=i*Math.cos(t),a=i*Math.sin(t);n.push(r,a)}}return n}},ut=class{bindGroup;constructor(e){this.owner=e,e.device._bindGroups.add(this)}loseContext(){this.bindGroup=null,this.owner.dirty=!0}update(e){this.bindGroup=null;let t=e.device,n=this.createDescriptor(t,e);this.bindGroup=t.wgpu.createBindGroup(n)}destroy(){this.owner.device._bindGroups.delete(this),this.bindGroup=null}createDescriptor(e,t){let n=[],r=t.format,i=t.format.uniformBufferFormats;t.uniformBuffers.forEach((e,t)=>{let r=i[t].slot,a=e.persistent?e.impl.buffer:e.allocation.gpuBuffer.buffer;n.push({binding:r,resource:{buffer:a,offset:0,size:e.format.byteSize}})});let a=t.format.textureFormats;t.textures.forEach((t,i)=>{let o=t instanceof ve,s=(o?t.texture:t).impl,c=r.textureFormats[i],l=a[i].slot,u=s.getView(e,o?t:void 0);if(n.push({binding:l,resource:u}),c.hasSampler){let t=s.getSampler(e,c.sampleType);n.push({binding:l+1,resource:t})}});let o=t.format.storageTextureFormats;t.storageTextures.forEach((t,r)=>{let i=t instanceof ve,a=(i?t.texture:t).impl,s=o[r].slot,c=a.getView(e,i?t:void 0);n.push({binding:s,resource:c})});let s=t.format.storageBufferFormats;return t.storageBuffers.forEach((e,t)=>{let r=e.impl.buffer,i=s[t].slot;n.push({binding:i,resource:{buffer:r}})}),{layout:t.format.impl.bindGroupLayout,entries:n}}},dt=class{static shaderStage(e){let t=0;return e&1&&(t|=GPUShaderStage.VERTEX),e&2&&(t|=GPUShaderStage.FRAGMENT),e&4&&(t|=GPUShaderStage.COMPUTE),t}},X=[];X[0]=``,X[1]=``,X[2]=``,X[52]=`r8unorm`,X[53]=`rg8unorm`,X[3]=``,X[4]=``,X[5]=``,X[6]=`rgba8unorm`,X[7]=`rgba8unorm`,X[8]=`bc1-rgba-unorm`,X[9]=`bc2-rgba-unorm`,X[10]=`bc3-rgba-unorm`,X[11]=``,X[12]=`rgba16float`,X[50]=`r16float`,X[51]=`rg16float`,X[13]=``,X[14]=`rgba32float`,X[15]=`r32float`,X[70]=`rg32float`,X[16]=`depth32float`,X[69]=`depth16unorm`,X[17]=`depth24plus-stencil8`,X[18]=`rg11b10ufloat`,X[19]=``,X[20]=`rgba8unorm-srgb`,X[21]=``,X[22]=`etc2-rgb8unorm`,X[23]=`etc2-rgba8unorm`,X[24]=``,X[25]=``,X[26]=``,X[27]=``,X[28]=`astc-4x4-unorm`,X[29]=``,X[30]=``,X[31]=`bgra8unorm`,X[64]=`bgra8unorm-srgb`,X[32]=`r8sint`,X[33]=`r8uint`,X[34]=`r16sint`,X[35]=`r16uint`,X[36]=`r32sint`,X[37]=`r32uint`,X[38]=`rg8sint`,X[39]=`rg8uint`,X[40]=`rg16sint`,X[41]=`rg16uint`,X[42]=`rg32sint`,X[43]=`rg32uint`,X[44]=`rgba8sint`,X[45]=`rgba8uint`,X[46]=`rgba16sint`,X[47]=`rgba16uint`,X[48]=`rgba32sint`,X[49]=`rgba32uint`,X[65]=`bc6h-rgb-float`,X[66]=`bc6h-rgb-ufloat`,X[67]=`bc7-rgba-unorm`,X[71]=`rgb9e5ufloat`,X[72]=`rg8snorm`,X[73]=`rgba8snorm`,X[74]=`rgb10a2unorm`,X[75]=`rgb10a2uint`,X[54]=`bc1-rgba-unorm-srgb`,X[55]=`bc2-rgba-unorm-srgb`,X[56]=`bc3-rgba-unorm-srgb`,X[61]=`etc2-rgb8unorm-srgb`,X[62]=`etc2-rgba8unorm-srgb`,X[68]=`bc7-rgba-unorm-srgb`,X[63]=`astc-4x4-unorm-srgb`;var ft=[];ft[0]=`filtering`,ft[1]=`non-filtering`,ft[2]=`comparison`,ft[3]=`comparison`,ft[4]=`comparison`;var pt=[];pt[0]=`float`,pt[1]=`unfilterable-float`,pt[2]=`depth`,pt[3]=`sint`,pt[4]=`uint`;var mt=new Ne,ht=class{constructor(e){this.bindGroupFormat=e,e.device._bindGroupFormats.add(this),this.restoreContext()}restoreContext(){let e=this.bindGroupFormat,t=e.device,{key:n,desc:r}=this.createDescriptor(e);this.key=mt.get(n),this.bindGroupLayout=t.wgpu.createBindGroupLayout(r)}destroy(){this.bindGroupFormat.device._bindGroupFormats.delete(this),this.bindGroupLayout=null}loseContext(){this.bindGroupLayout=null}createDescriptor(e){let t=[],n=``;return e.uniformBufferFormats.forEach(e=>{let r=dt.shaderStage(e.visibility);n+=`#${e.slot}U:${r}`,t.push({binding:e.slot,visibility:r,buffer:{type:`uniform`,hasDynamicOffset:!0}})}),e.textureFormats.forEach(e=>{let r=dt.shaderStage(e.visibility),i=e.sampleType,a=e.textureDimension,o=!!e.multisampled,s=pt[i];if(n+=`#${e.slot}T:${r}-${s}-${a}-${o}`,t.push({binding:e.slot,visibility:r,texture:{sampleType:s,viewDimension:a,multisampled:o}}),e.hasSampler){let a=ft[i];n+=`#${e.slot+1}S:${r}-${a}`,t.push({binding:e.slot+1,visibility:r,sampler:{type:a}})}}),e.storageTextureFormats.forEach(e=>{let{format:r,textureDimension:i}=e,{read:a,write:o}=e;n+=`#${e.slot}ST:${r}-${i}-${a?`r1`:`r0`}-${o?`w1`:`w0`}`,t.push({binding:e.slot,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:a?o?`read-write`:`read-only`:`write-only`,format:X[r],viewDimension:i}})}),e.storageBufferFormats.forEach(e=>{let r=e.readOnly,i=dt.shaderStage(e.visibility);n+=`#${e.slot}SB:${i}-${r?`ro`:`rw`}`,t.push({binding:e.slot,visibility:i,buffer:{type:r?`read-only-storage`:`storage`}})}),{key:n,desc:{entries:t}}}},gt=class{buffer=null;usageFlags=0;constructor(e=0){this.usageFlags=e}destroy(e){this.buffer&&=(e.deferDestroy(this.buffer),null)}get initialized(){return!!this.buffer}loseContext(){this.buffer=null}allocate(e,t){this.buffer=e.wgpu.createBuffer({size:t,usage:this.usageFlags})}unlock(e,t,n=0,r=t.byteLength-n){let i=e.wgpu;if(!this.buffer){n=0,r=t.byteLength;let i=t.byteLength+3&-4;this.usageFlags|=GPUBufferUsage.COPY_DST,this.allocate(e,i)}let a=(t.byteOffset??0)+n,o=t.buffer??t;if(r&3&&n===0&&r===t.byteLength){let e=new Uint8Array(r+3&-4);e.set(new Uint8Array(o,a,r)),i.queue.writeBuffer(this.buffer,n,e,0,e.length)}else i.queue.writeBuffer(this.buffer,n,o,a,r)}read(e,t,n,r,i){return e.readStorageBuffer(this,t,n,r,i)}write(e,t,n,r,i){e.writeStorageBuffer(this,t,n,r,i)}clear(e,t,n){e.clearStorageBuffer(this,t,n)}},_t=class extends gt{format=null;constructor(e,t){super(16|(t?.storage?128:0)),this.format=e.format===1?`uint16`:`uint32`}unlock(e,t,n){let r=e.device;super.unlock(r,e.storage,t,n)}},vt=[];vt[0]=`sint8`,vt[1]=`uint8`,vt[2]=`sint16`,vt[3]=`uint16`,vt[4]=`sint32`,vt[5]=`uint32`,vt[6]=`float32`,vt[7]=`float16`;var yt=[];yt[0]=`snorm8`,yt[1]=`unorm8`,yt[2]=`snorm16`,yt[3]=`unorm16`,yt[4]=`sint32`,yt[5]=`uint32`,yt[6]=`float32`,yt[7]=`float16`;var bt=class{cache=new Map;get(e,t=null){let n=this.getKey(e,t),r=this.cache.get(n);return r||(r=this.create(e,t),this.cache.set(n,r)),r}getKey(e,t=null){return`${e?.renderingHashString}-${t?.renderingHashString}`}create(e,t){let n=[],r=e=>{let t=e.interleaved,r=e.instancing?`instance`:`vertex`,i=[],a=e.elements.length;for(let o=0;o<a;o++){let s=e.elements[o],c=Oe[s.name],l=s.normalize?yt:vt;i.push({shaderLocation:c,offset:t?s.offset:0,format:`${l[s.dataType]}${s.numComponents>1?`x${s.numComponents}`:``}`}),t&&o!==a-1||(n.push({attributes:i,arrayStride:s.stride,stepMode:r}),i=[])}};return e&&r(e),t&&r(t),n}},xt=0,St=class{constructor(e){this.device=e}static keysEqual(e,t){for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}getPipelineLayout(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n];t.push(r.bindGroupLayout)}let n={bindGroupLayouts:t};return xt++,this.device.wgpu.createPipelineLayout(n)}},Ct=0,wt=new Ae,Tt=new Set([`rgba8unorm`,`rgba8unorm-srgb`,`bgra8unorm`,`bgra8unorm-srgb`,`rgb10a2unorm`,`rgba16float`]),Et=e=>{let t=0;return e.redWrite&&(t|=GPUColorWrite.RED),e.greenWrite&&(t|=GPUColorWrite.GREEN),e.blueWrite&&(t|=GPUColorWrite.BLUE),e.alphaWrite&&(t|=GPUColorWrite.ALPHA),t},Dt=[`point-list`,`line-list`,void 0,`line-strip`,`triangle-list`,`triangle-strip`,void 0],Ot=e=>e===`triangle-list`||e===`triangle-strip`,kt=[`add`,`subtract`,`reverse-subtract`,`min`,`max`],At=[`zero`,`one`,`src`,`one-minus-src`,`dst`,`one-minus-dst`,`src-alpha`,`src-alpha-saturated`,`one-minus-src-alpha`,`dst-alpha`,`one-minus-dst-alpha`,`constant`,`one-minus-constant`,`src1`,`one-minus-src1`,`src1-alpha`,`one-minus-src1-alpha`],jt=[`never`,`less`,`equal`,`less-equal`,`greater`,`not-equal`,`greater-equal`,`always`],Mt=[`none`,`back`,`front`],Nt=[`ccw`,`cw`],Pt=[`keep`,`zero`,`replace`,`increment-clamp`,`increment-wrap`,`decrement-clamp`,`decrement-wrap`,`invert`],Ft=[``,`uint16`,`uint32`],It=class{pipeline;hashes},Lt=class e extends St{lookupHashes=new Uint32Array(20);lookupHashesFloat=new Float32Array(this.lookupHashes.buffer);constructor(e){super(e),this.vertexBufferLayout=new bt,this.cache=new Map}static stripIndexFormat(e,t){return e===3||e===5?t:void 0}get(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=t.type;i=e.stripIndexFormat(g,i);let _=this.getAlphaToCoverage(h,o),v=Dt[g],y=Ot(v),{lookupHashes:b,lookupHashesFloat:x}=this;b[0]=g,b[1]=a.id,b[2]=u,b[3]=l.func,b[4]=c.key,b[5]=n?.renderingHash??0,b[6]=r?.renderingHash??0,b[7]=o.impl.key,b[8]=s[0]?.key??0,b[9]=s[1]?.key??0,b[10]=s[2]?.key??0,b[11]=s[3]?.key??0,b[12]=d?f.key:0,b[13]=d?p.key:0,b[14]=i??0,b[15]=m,b[16]=+!!_,b[17]=+!!l.write,b[18]=y?Math.trunc(l.depthBias):0,x[19]=y?l.depthBiasSlope:0;let S=we(b),C=this.cache.get(S);if(C)for(let e=0;e<C.length;e++){let t=C[e];if(St.keysEqual(t.hashes,b))return t.pipeline}let w=this.getPipelineLayout(s),T=this.vertexBufferLayout.get(n,r),E=new It;return E.hashes=new Uint32Array(b),E.pipeline=this.create(v,i,a,o,w,c,l,T,u,d,f,p,m,_),C?C.push(E):C=[E],this.cache.set(S,C),E.pipeline}getBlend(e){let t;return e.blend&&(t={color:{operation:kt[e.colorOp],srcFactor:At[e.colorSrcFactor],dstFactor:At[e.colorDstFactor]},alpha:{operation:kt[e.alphaOp],srcFactor:At[e.alphaSrcFactor],dstFactor:At[e.alphaDstFactor]}}),t}getAlphaToCoverage(e,t){if(!e||t.samples<=1)return!1;let n=t.impl.colorAttachments[0]?.format;return Tt.has(n)||n===`rgba32float`&&this.device.textureFloatBlendable}getDepthStencil(e,t,n,r,i,a){let o,{depth:s,stencil:c}=t;if(s||c){if(o={format:t.impl.depthAttachment.format},s){o.depthWriteEnabled=e.write,o.depthCompare=jt[e.func];let t=Ot(a);o.depthBias=t?Math.trunc(e.depthBias):0,o.depthBiasSlopeScale=t?e.depthBiasSlope:0}else o.depthWriteEnabled=!1,o.depthCompare=`always`;c&&n&&(o.stencilReadMask=r.readMask,o.stencilWriteMask=r.writeMask,o.stencilFront={compare:jt[r.func],failOp:Pt[r.fail],passOp:Pt[r.zpass],depthFailOp:Pt[r.zfail]},o.stencilBack={compare:jt[i.func],failOp:Pt[i.fail],passOp:Pt[i.zpass],depthFailOp:Pt[i.zfail]})}return o}create(e,t,n,r,i,a,o,s,c,l,u,d,f,p){let m=this.device.wgpu,h=n.impl,g={vertex:{module:h.getVertexShaderModule(),entryPoint:h.vertexEntryPoint,buffers:s},primitive:{topology:e,frontFace:Nt[f],cullMode:Mt[c]},depthStencil:this.getDepthStencil(o,r,l,u,d,e),multisample:{count:r.samples,alphaToCoverageEnabled:p},layout:i};t&&(g.primitive.stripIndexFormat=Ft[t]),g.fragment={module:h.getFragmentShaderModule(),entryPoint:h.fragmentEntryPoint,targets:[]};let _=r.impl.colorAttachments;a.usesDualSourceBlending;for(let e=0;e<_.length;e++){let t=a.getAttachment(e,wt);g.fragment.targets.push({format:_[e].format,writeMask:Et(t),blend:this.getBlend(t)})}return Ct++,m.createRenderPipeline(g)}},Rt=0,zt=class{pipeline=null;hashes=null},Bt=class extends St{lookupHashes=new Uint32Array(3);cache=new Map;get(e,t){let n=this.lookupHashes;n[0]=e.impl.computeKey,n[1]=t[0]?t[0].impl.key:0,n[2]=t[1]?t[1].impl.key:0;let r=we(n),i=this.cache.get(r);if(i)for(let e=0;e<i.length;e++){let t=i[e];if(St.keysEqual(t.hashes,n))return t.pipeline}let a=[];t[0]&&a.push(t[0].impl),t[1]&&a.push(t[1].impl);let o=this.getPipelineLayout(a),s=new zt;return s.hashes=new Uint32Array(n),s.pipeline=this.create(e,o),i?i.push(s):i=[s],this.cache.set(r,i),s.pipeline}create(e,t){let n=this.device.wgpu,r=e.impl,i={compute:{module:r.getComputeShaderModule(),entryPoint:r.computeEntryPoint},layout:t};return Rt++,n.createComputePipeline(i)}},Vt=new Ne,Ht=class{format;multisampledBuffer;transient=!1;resolveView;destroy(e){e.deferDestroy(this.multisampledBuffer),this.multisampledBuffer=null,this.resolveView=void 0}},Ut=class{format;hasStencil;depthTexture=null;depthTextureInternal=!1;multisampledDepthBuffer=null;multisampledDepthBufferKey;transient=!1;constructor(e){this.format=e,this.hasStencil=e===`depth24plus-stencil8`}destroy(e){this.depthTextureInternal&&(e.deferDestroy(this.depthTexture),this.depthTexture=null),this.multisampledDepthBuffer&&(this.multisampledDepthBuffer=null,i(e).release(this.multisampledDepthBufferKey))}},Wt=class{initialized=!1;key;colorAttachments=[];depthAttachment=null;assignedColorTexture=null;renderPassDescriptor={};isBackbuffer=!1;constructor(e){this.renderTarget=e}destroy(e){this.initialized=!1,this.assignedColorTexture=null,this.colorAttachments.forEach(t=>{t.destroy(e)}),this.colorAttachments.length=0,this.depthAttachment?.destroy(e),this.depthAttachment=null}updateKey(){let e=`${this.renderTarget.samples}:${this.depthAttachment?this.depthAttachment.format:`nodepth`}`;this.colorAttachments.forEach(t=>{e+=`:${t.format}`}),this.key=Vt.get(e)}assignColorTexture(e,t){this.assignedColorTexture=e;let n=this.renderTarget.device,r=n?.xrColorTextureViewDescriptor,i=r&&e===n.xrColorTexture,a=e.createView(i?r:{format:t}),o=this.renderPassDescriptor.colorAttachments[0];this.renderTarget.samples>1?o.resolveTarget=a:o.view=a,this.setColorAttachment(0,void 0,t),this.updateKey()}setColorAttachment(e,t,n){this.colorAttachments[e]||(this.colorAttachments[e]=new Ht),t&&(this.colorAttachments[e].multisampledBuffer=t),n&&(this.colorAttachments[e].format=n)}init(e,t){let n=e.wgpu;this.initDepthStencil(e,n,t),t._colorBuffers&&t._colorBuffers.forEach((e,t)=>{this.setColorAttachment(t,void 0,e.impl.format)}),this.renderPassDescriptor.colorAttachments=[];let r=this.isBackbuffer?1:t._colorBuffers?.length??0;for(let i=0;i<r;++i){let r=this.initColor(e,n,t,i),a=i===0&&this.colorAttachments[0]?.format;(r.view||a)&&this.renderPassDescriptor.colorAttachments.push(r)}this.updateKey(),this.initialized=!0}initDepthStencil(e,t,n){let{samples:r,width:a,height:o,depth:s,depthBuffer:c}=n;if(s||c){let s;if(!c){this.depthAttachment=new Ut(`depth24plus-stencil8`);let e={size:[a,o,1],dimension:`2d`,sampleCount:r,format:this.depthAttachment.format,usage:GPUTextureUsage.RENDER_ATTACHMENT};n.transientDepth?(e.usage|=GPUTextureUsage.TRANSIENT_ATTACHMENT,this.depthAttachment.transient=!0):r>1?e.usage|=GPUTextureUsage.TEXTURE_BINDING:e.usage|=GPUTextureUsage.COPY_SRC;let i=t.createTexture(e);this.depthAttachment.depthTexture=i,this.depthAttachment.depthTextureInternal=!0,s=i.createView()}else if(c.samples>1)this.depthAttachment=new Ut(c.impl.format),this.depthAttachment.depthTexture=c.impl.gpuTexture,this.depthAttachment.depthTextureInternal=!1,s=c.impl.gpuTexture.createView();else if(this.depthAttachment=new Ut(c.impl.format),r>1){let n=`depth24plus-stencil8`;this.depthAttachment.format=n,this.depthAttachment.hasStencil=!0;let l=`${c.id}:${a}:${o}:${r}:${n}`,u=i(e),d=u.get(l);if(!d){let e={size:[a,o,1],dimension:`2d`,sampleCount:r,format:n,usage:GPUTextureUsage.RENDER_ATTACHMENT|(n===c.impl.format?0:GPUTextureUsage.TEXTURE_BINDING)};d=t.createTexture(e),u.set(l,d)}this.depthAttachment.multisampledDepthBuffer=d,this.depthAttachment.multisampledDepthBufferKey=l,s=d.createView()}else{let e=c.impl.gpuTexture;this.depthAttachment.depthTexture=e,s=e.createView()}this.renderPassDescriptor.depthStencilAttachment={view:s}}}initColor(e,t,n,r){let i={},{samples:a,width:o,height:s,mipLevel:c}=n,l=n.getColorBuffer(r),u=null;if(l&&(u=l.cubemap?l.impl.createView({dimension:`2d`,baseArrayLayer:n.face,arrayLayerCount:1,mipLevelCount:1,baseMipLevel:c}):l.impl.createView({mipLevelCount:1,baseMipLevel:c})),a>1){if(!this.isBackbuffer&&l?.samples>1){this.setColorAttachment(r,void 0,l.impl.format),i.view=u;let e=n.getResolveBuffer(r);if(e){let t=e.impl.createView({mipLevelCount:1,baseMipLevel:0});this.colorAttachments[r].resolveView=t,i.resolveTarget=t}return i}let c=this.isBackbuffer?this.colorAttachments[r]?.format??e.backBufferViewFormat:l.impl.format,d=n.transientColor,f={size:[o,s,1],dimension:`2d`,sampleCount:a,format:c,usage:d?GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TRANSIENT_ATTACHMENT:GPUTextureUsage.RENDER_ATTACHMENT},p=t.createTexture(f);this.setColorAttachment(r,p,f.format),this.colorAttachments[r].transient=d,i.view=p.createView(),i.resolveTarget=u}else i.view=u;return i}setupForRenderPass(e,t){let n=this.renderPassDescriptor.colorAttachments?.length??0;for(let r=0;r<n;++r){let n=this.renderPassDescriptor.colorAttachments[r],i=e.colorArrayOps[r];n.clearValue=t.isColorBufferSrgb(r)?i.clearValueLinear:i.clearValue,n.loadOp=i.clear?`clear`:`load`,n.storeOp=i.store?`store`:`discard`,this.colorAttachments[r]?.resolveView&&(n.resolveTarget=i.resolve?this.colorAttachments[r].resolveView:void 0),!this.isBackbuffer&&t.samples>1&&n.storeOp===`discard`&&n.resolveTarget,this.colorAttachments[r]?.transient&&(n.loadOp!==`clear`||n.storeOp!==`discard`)&&(n.loadOp=`clear`,n.storeOp=`discard`)}let r=this.renderPassDescriptor.depthStencilAttachment;r&&(r.depthClearValue=e.depthStencilOps.clearDepthValue,r.depthLoadOp=e.depthStencilOps.clearDepth?`clear`:`load`,r.depthStoreOp=e.depthStencilOps.storeDepth?`store`:`discard`,r.depthReadOnly=!1,this.depthAttachment.hasStencil&&(r.stencilClearValue=e.depthStencilOps.clearStencilValue,r.stencilLoadOp=e.depthStencilOps.clearStencil?`clear`:`load`,r.stencilStoreOp=e.depthStencilOps.storeStencil?`store`:`discard`,r.stencilReadOnly=!1),this.depthAttachment.transient&&(r.depthLoadOp!==`clear`||r.depthStoreOp!==`discard`||this.depthAttachment.hasStencil&&(r.stencilLoadOp!==`clear`||r.stencilStoreOp!==`discard`))&&(r.depthLoadOp=`clear`,r.depthStoreOp=`discard`,this.depthAttachment.hasStencil&&(r.stencilLoadOp=`clear`,r.stencilStoreOp=`discard`)))}loseContext(){this.initialized=!1}resolve(e,t,n,r){}},Gt=/^[ \t]*(attribute|varying|uniform)[\t ]+/gm,Kt=/^[ \t]*(attribute|varying|uniform)[ \t]*([^;]+)(;+)/gm,qt=/^[ \t]*var\s*(?:(<storage,[^>]*>)\s*([\w\d_]+)\s*:\s*(.*?)\s*;|(<(?!storage,)[^>]*>)?\s*([\w\d_]+)\s*:\s*(texture_.*|storage_texture_.*|storage\w.*|external_texture|sampler(?:_comparison)?)\s*;)\s*$/gm,Jt=/(?:@interpolate\([^)]*\)\s*)?([\w]+)\s*:\s*([\w<>]+)/,Yt=`@@@`,Xt=/(@vertex|@fragment)\s*fn\s+\w+\s*\(\s*(\w+)\s*:[\s\S]*?\{/,Zt=/\.fragDepth\s*=/,Qt=/\.sampleMask\s*=(?!=)/,$t=[{wgslName:`position`,wgslType:`vec4f`,wgslBuiltin:`position`,pcName:`pcPosition`,isFallback:!0},{wgslName:`frontFacing`,wgslType:`bool`,wgslBuiltin:`front_facing`,pcName:`pcFrontFacing`},{wgslName:`sampleIndex`,wgslType:`u32`,wgslBuiltin:`sample_index`,pcName:`pcSampleIndex`},{wgslName:`sampleMask`,wgslType:`u32`,wgslBuiltin:`sample_mask`,pcName:`pcSampleMask`},{wgslName:`primitiveIndex`,wgslType:`u32`,wgslBuiltin:`primitive_index`,pcName:`pcPrimitiveIndex`,requiresFeature:`supportsPrimitiveIndex`}],en=`meshInstanceStorage`,tn=[{wgslName:`vertexIndex`,wgslType:`u32`,wgslBuiltin:`vertex_index`,pcName:`pcVertexIndex`,isFallback:!0},{wgslName:`instanceIndex`,wgslType:`u32`,wgslBuiltin:`instance_index`,pcName:`pcInstanceIndex`}],nn=(e,t,n,r)=>e.filter(e=>e.requiresFeature&&!r[e.requiresFeature]?!1:RegExp(`\\b(?:${e.pcName}|${n}\\.${e.wgslName})\\b`).test(t)),rn=(e,t,n,r)=>{if(e.length===0&&!r){let e=t.find(e=>e.isFallback&&(!e.requiresFeature||n[e.requiresFeature]));if(e)return[e]}return e},an=e=>e.map(e=>`    @builtin(${e.wgslBuiltin}) ${e.wgslName} : ${e.wgslType},
`).join(``),on=e=>e.map(e=>`    var<private> ${e.pcName}: ${e.wgslType};
`).join(``),sn=e=>e.map(e=>`    ${e.pcName} = input.${e.wgslName};
`).join(``),cn={texture_1d:{viewDimension:`1d`,baseSampleType:0},texture_2d:{viewDimension:`2d`,baseSampleType:0},texture_2d_array:{viewDimension:ue,baseSampleType:0},texture_3d:{viewDimension:`3d`,baseSampleType:0},texture_cube:{viewDimension:Ye,baseSampleType:0},texture_cube_array:{viewDimension:Ce,baseSampleType:0},texture_multisampled_2d:{viewDimension:`2d`,baseSampleType:0,multisampled:!0},texture_depth_2d:{viewDimension:`2d`,baseSampleType:2},texture_depth_2d_array:{viewDimension:ue,baseSampleType:2},texture_depth_cube:{viewDimension:Ye,baseSampleType:2},texture_depth_cube_array:{viewDimension:Ce,baseSampleType:2},texture_depth_multisampled_2d:{viewDimension:`2d`,baseSampleType:2,multisampled:!0},texture_external:{viewDimension:`2d`,baseSampleType:1}},ln=(e,t)=>{let n=cn[e],r=n.baseSampleType,i=!!n.multisampled;if(n.baseSampleType===0){switch(t){case`u32`:r=4;break;case`i32`:r=3;break;case`f32`:r=0;break;case`uff`:r=1}i&&r===0&&(r=1)}return{viewDimension:n.viewDimension,sampleType:r,multisampled:i}},un=(e,t,n=!1)=>{if(n){if(t===2)return`texture_depth_multisampled_2d`;let e;switch(t){case 0:case 1:e=`f32`;break;case 4:e=`u32`;break;case 3:e=`i32`}return`texture_multisampled_2d<${e}>`}if(t===2)switch(e){case`2d`:return`texture_depth_2d`;case ue:return`texture_depth_2d_array`;case Ye:return`texture_depth_cube`;case Ce:return`texture_depth_cube_array`}let r;switch(e){case`1d`:r=`texture_1d`;break;case`2d`:r=`texture_2d`;break;case ue:r=`texture_2d_array`;break;case`3d`:r=`texture_3d`;break;case Ye:r=`texture_cube`;break;case Ce:r=`texture_cube_array`}let i;switch(t){case 0:case 1:i=`f32`;break;case 4:i=`u32`;break;case 3:i=`i32`}return`${r}<${i}>`},dn=new Map;X.forEach((e,t)=>{e&&dn.set(e,t)});var fn={f32:`WrappedF32`,i32:`WrappedI32`,u32:`WrappedU32`,vec2f:`WrappedVec2F`,vec2i:`WrappedVec2I`,vec2u:`WrappedVec2U`},pn=e=>(e=e.replace(/\s+/g,` `).trim(),e.split(/[\s:]+/)),mn=/array<([^,]+),\s*([^>]+)>/,hn=class{ubName=null;arraySize=0;constructor(e,t){this.line=e;let n=pn(e);if(n.length<2)t.failed=!0;else if(this.name=n[0],this.type=n.slice(1).join(` `),this.type.includes(`array<`)){let e=mn.exec(this.type);this.type=e[1].trim(),this.arraySize=Number(e[2]),isNaN(this.arraySize)&&(t.failed=!0)}}},gn=/^\s*var\s+(\w+)\s*:\s*(texture_\w+)(?:<(\w+)>)?;\s*$/,_n=/^\s*var\s+([\w\d_]+)\s*:\s*(texture_storage_2d|texture_storage_2d_array)<([\w\d_]+),\s*(\w+)>\s*;\s*$/,vn=/^\s*var\s*<storage,\s*(read_write|read)?>\s*([\w\d_]+)\s*:\s*(.*)\s*;\s*$/,yn=/^\s*var\s+([\w\d_]+)\s*:\s*texture_external;\s*$/,bn=/^\s*var\s+([\w\d_]+)\s*:\s*(sampler|sampler_comparison)\s*;\s*$/,xn=class{constructor(e,t){this.originalLine=e,this.line=e,this.isTexture=!1,this.isSampler=!1,this.isStorageTexture=!1,this.isStorageBuffer=!1,this.isExternalTexture=!1,this.multisampled=!1,this.type=``,this.matchedElements=[];let n=this.line.match(gn);if(n){this.name=n[1],this.type=n[2],this.textureFormat=n[3],this.isTexture=!0,this.matchedElements.push(...n);let e=ln(this.type,this.textureFormat);this.textureDimension=e.viewDimension,this.sampleType=e.sampleType,this.multisampled=e.multisampled}let r=this.line.match(_n);r&&(this.isStorageTexture=!0,this.name=r[1],this.textureType=r[2],this.format=r[3],this.access=r[4],this.matchedElements.push(...r));let i=this.line.match(vn);i&&(this.isStorageBuffer=!0,this.accessMode=i[1]||`none`,this.name=i[2],this.type=i[3],this.matchedElements.push(...i));let a=this.line.match(yn);a&&(this.name=a[1],this.isExternalTexture=!0,this.matchedElements.push(...i));let o=this.line.match(bn);o&&(this.name=o[1],this.samplerType=o[2],this.isSampler=!0,this.matchedElements.push(...o)),this.matchedElements.length===0&&(t.failed=!0)}equals(e){return this.name===e.name&&this.type===e.type&&this.isTexture===e.isTexture&&this.isSampler===e.isSampler&&this.isStorageTexture===e.isStorageTexture&&this.isStorageBuffer===e.isStorageBuffer&&this.isExternalTexture===e.isExternalTexture&&this.textureFormat===e.textureFormat&&this.textureDimension===e.textureDimension&&this.sampleType===e.sampleType&&this.multisampled===e.multisampled&&this.textureType===e.textureType&&this.format===e.format&&this.access===e.access&&this.accessMode===e.accessMode&&this.samplerType===e.samplerType}},Sn=class e{static run(t,n,r){let i=new Map,a=e.extract(n.vshader),o=e.extract(n.fshader),s=a.src.match(Xt)?.[2]??``,c=o.src.match(Xt)?.[2]??``,l=new Map,u=e.processAttributes(a.attributes,n.attributes,l,n.processingOptions,r,t,a.src,s),d=e.processVaryings(a.varyings,i,!0,t),f=e.processVaryings(o.varyings,i,!1,t,o.src,c),p=a.uniforms.concat(o.uniforms),m=Array.from(new Set(p)).map(e=>new hn(e,r)),h=e.processUniforms(t,m,n.processingOptions,r);a.src=e.renameUniformAccess(a.src,m),o.src=e.renameUniformAccess(o.src,m);let g=e.mergeResources(a.resources,o.resources,r),_=e.processResources(t,g,n.processingOptions,r),v=e.generateFragmentOutputStruct(o.src,t.maxColorAttachments,n.useDualSourceBlending);a.src=e.copyInputs(a.src,r),o.src=e.copyInputs(o.src,r);let y=`${u}
${d}
${h.code}
${_.code}
`,b=a.src.replace(Yt,y),x=`${f}
${v}
${h.code}
${_.code}
`;return{vshader:b,fshader:o.src.replace(Yt,x),attributes:l,meshUniformBufferFormat:h.meshUniformBufferFormat,meshUniformBufferEmpty:h.meshUniformBufferEmpty,meshBindGroupFormat:_.meshBindGroupFormat,viewBindGroupFormat:_.viewBindGroupFormat,usesMeshInstanceStorage:_.usesMeshInstanceStorage}}static runCompute(t,n,r,i,a){let o=e.extract(n),s=o.uniforms.map(e=>new hn(e,i)),c=[];s.forEach(e=>{e.ubName=`ub_compute`;let t=Je.get(e.type);c.push(new B(e.name,t,e.arraySize))});let l=c.length>0?new je(t,c,{pack:!0}):null,u=e.mergeResources(o.resources,[],i),d=e.buildResourceFormats(u,4,i),f=l?new be(`ub_compute`,4):null,p=f?[...d,f]:d,m=n,h=null;if(p.length>0){h=new Fe(t,p);let n=e.getTextureShaderDeclaration(h,a);l&&(n+=e.getUniformShaderDeclaration(l,a,f.slot,`compute`));let r=e.renameUniformAccess(o.src,s);m=r.includes(Yt)?r.replace(Yt,n):`${n}
${r}`}return{cshader:m,computeBindGroupFormat:h,computeUniformBufferFormat:l}}static extract(t){let n=[],r=[],i=[],a=[],o=`${Yt}
`,s;for(;(s=Gt.exec(t))!==null;){let a=s[1];Kt.lastIndex=s.index;let c=Kt.exec(t);a===`attribute`?n.push(c[2]):a===`varying`?r.push(c[2]):a===`uniform`&&i.push(c[2]),t=e.cutOut(t,s.index,Kt.lastIndex,o),Gt.lastIndex=s.index+o.length,o=``}for(;(s=qt.exec(t))!==null;)a.push(s[0]),t=e.cutOut(t,s.index,qt.lastIndex,o),qt.lastIndex=s.index+o.length,o=``;if(o){let e=t.match(/^(?:\s*(?:enable|requires)\s+\w+\s*;)*/)?.[0]??``;t=`${e}
${o}${t.slice(e.length)}`}return{src:t,attributes:n,varyings:r,uniforms:i,resources:a}}static processUniforms(t,n,r,i){let a=[];n.forEach(e=>{if(r.hasUniform(e.name))e.ubName=`ub_${Me[r.getUniformBindGroup(e.name)]}`;else{r.debugCheckMeshUniform(e.name),e.ubName=`ub_mesh_ub`;let t=Je.get(e.type),n=new B(e.name,t,e.arraySize);a.push(n)}});let o=a.length===0;o&&a.push(new B(_e,2));let s=new je(t,a,{pack:!0}),c=``;return r.uniformFormats.forEach((t,n)=>{t&&(c+=e.getUniformShaderDeclaration(t,n,0))}),s&&(c+=e.getUniformShaderDeclaration(s,3,0)),{code:c,meshUniformBufferFormat:s,meshUniformBufferEmpty:o}}static renameUniformAccess(e,t){return t.forEach(t=>{let n=`uniform.${t.name}`,r=`${t.ubName}.${t.name}`,i=RegExp(`\\b${n}\\b`,`g`);e=e.replace(i,r)}),e}static mergeResources(e,t,n){let r=e.map(e=>new xn(e,n));return t.map(e=>new xn(e,n)).forEach(e=>{let t=r.find(t=>t.name===e.name);t?t.equals(e)||(n.failed=!0):r.push(e)}),r}static buildResourceFormats(e,t,n){let r=[];for(let n=0;n<e.length;n++){let i=e[n];if(i.isTexture){let a=e[n+1],o=(a?.isSampler??!1)&&!i.multisampled,s=i.sampleType,c=i.textureDimension;r.push(new nt(i.name,t,c,s,o,o?a.name:null,i.multisampled)),o&&n++}if(i.isStorageBuffer){let e=i.accessMode!==`read_write`,n=new V(i.name,t,e);n.format=i.type,r.push(n)}if(i.isStorageTexture){let e=i.textureType===`texture_storage_2d_array`?ue:`2d`,t=dn.get(i.format),n=i.access===`write`||i.access===`read_write`,a=i.access===`read`||i.access===`read_write`;r.push(new xe(i.name,t,e,n,a))}}return r}static filterSuppliedResources(e,t,n){let r=[];for(let n=0;n<e.length;n++){let i=e[n];i.isTexture&&t.getTexture(i.name)?e[n+1]?.isSampler&&e[n+1]&&n++:r.push(i)}return r}static splitViewResources(e,t){let n=[],r=0;for(let i=0;i<e.length;i++){let a=e[i];a.isTexture&&t?.has(a.name)?(n.push(a),e[i+1]?.isSampler&&n.push(e[++i])):a.isStorageBuffer&&a.name===en?n.push(a):e[r++]=a}return e.length=r,n}static processResources(t,n,r,i,o=3,s=2){let c=e.filterSuppliedResources(n,r,i),l=null;if(r?.uniformFormats[0]){let n=e.splitViewResources(c,r.viewTextures);if(n.length){let r=e.buildResourceFormats(n,o,i);l=a(t,r)}}let u=n.some(e=>e.isStorageBuffer&&e.name===en),d=e.buildResourceFormats(c,o,i),f=new Fe(t,d),p=``;return r?.bindGroupFormats?.forEach((t,n)=>{t&&(p+=e.getTextureShaderDeclaration(t,n))}),l&&(p+=e.getTextureShaderDeclaration(l,0)),p+=e.getTextureShaderDeclaration(f,s),{code:p,meshBindGroupFormat:f,viewBindGroupFormat:l,usesMeshInstanceStorage:u}}static getUniformShaderDeclaration(e,t,n,r=Me[t]){let i=`struct_ub_${r}`,a=`struct ${i} {
`;return e.uniforms.forEach(e=>{let t=Ue[e.type][0];e.count>0?(fn.hasOwnProperty(t)&&(t=fn[t]),a+=`    ${e.shortName}: array<${t}, ${e.count}>,
`):a+=`    ${e.shortName}: ${t},
`}),a+=`};
`,a+=`@group(${t}) @binding(${n}) var<uniform> ub_${r} : ${i};

`,a}static getTextureShaderDeclaration(e,t){let n=``;return e.textureFormats.forEach(e=>{let r=un(e.textureDimension,e.sampleType,e.multisampled);if(n+=`@group(${t}) @binding(${e.slot}) var ${e.name}: ${r};
`,e.hasSampler){let r=e.sampleType===2?`sampler_comparison`:`sampler`;n+=`@group(${t}) @binding(${e.slot+1}) var ${e.samplerName}: ${r};
`}}),e.storageBufferFormats.forEach(e=>{let r=e.readOnly?`read`:`read_write`;n+=`@group(${t}) @binding(${e.slot}) var<storage, ${r}> ${e.name} : ${e.format};
`}),e.storageTextureFormats.forEach(e=>{let r=e.textureDimension===`2d-array`?`texture_storage_2d_array`:`texture_storage_2d`,i=X[e.format],a=e.read?e.write?`read_write`:`read`:`write`;n+=`@group(${t}) @binding(${e.slot}) var ${e.name}: ${r}<${i}, ${a}>;
`}),n}static processVaryings(e,t,n,r,i=``,a=``){let o=``,s=``,c=``;if(e.forEach((e,r)=>{let i=e.match(Jt);if(i){let a=i[1],l=i[2];n?t.set(a,r):r=t.get(a),o+=`    @location(${r}) ${e},
`,n||(s+=`    var<private> ${a}: ${l};
`,c+=`    ${a} = input.${a};
`)}}),n)return o+=`    @builtin(position) position : vec4f,
`,`
								struct VertexOutput {
										${o}
								};
						`;let l=rn(nn($t,i,a,r),$t,r,o.length>0);return o+=an(l),`
						struct FragmentInput {
								${o}
						};

						${on(l)}
						${s}

						// function to copy inputs (varyings) to private global variables
						fn _pcCopyInputs(input: FragmentInput) {
								${c}
								${sn(l)}
						}
				`}static generateFragmentOutputStruct(e,t,n=!1){let r=`struct FragmentOutput {
`;if(n)r+=`    @location(0) @blend_src(0) color : pcOutType0,
`,r+=`    @location(0) @blend_src(1) colorSecondary : pcOutType0,
`;else{let n=e=>`color${e>0?e:``}`;for(let i=0;i<t;i++){let t=n(i);e.search(RegExp(`\\.${t}\\s*=`))!==-1&&(r+=`    @location(${i}) ${t} : pcOutType${i},
`)}}return e.search(Zt)!==-1&&(r+=`    @builtin(frag_depth) fragDepth : f32,
`),e.search(Qt)!==-1&&(r+=`    @builtin(sample_mask) sampleMask : u32,
`),`${r}};
`}static floatAttributeToInt(e,t){let n={f32:`f32`,"vec2<f32>":`vec2f`,"vec3<f32>":`vec3f`,"vec4<f32>":`vec4f`}[e]||e;return{f32:t?`i32`:`u32`,vec2f:t?`vec2i`:`vec2u`,vec3f:t?`vec3i`:`vec3u`,vec4f:t?`vec4i`:`vec4u`}[n]||null}static processAttributes(t,n={},r,i,a,o,s=``,c=``){let l=``,u=``,d=``,f={};t.forEach(t=>{let a=pn(t),o=a[0],s=a[1],c=s;if(n.hasOwnProperty(o)){let a=n[o],p=Oe[a];f[p]=a,r.set(p,o);let m=i.getVertexElement(a);if(m){let t=m.dataType;if(t!==6&&t!==7&&!m.normalize&&!m.asInt){let n=t===0||t===2||t===4;s=e.floatAttributeToInt(s,n)}}l+=`    @location(${p}) ${o}: ${s},
`,u+=`    var<private> ${t};
`,d+=`    ${o} = ${c}(input.${o});
`}});let p=rn(nn(tn,s,c,o),tn,o,l.length>0);return`
						struct VertexInput {
								${l}
								${an(p)}
						};

						${u}
						${on(p)}

						fn _pcCopyInputs(input: VertexInput) {
								${d}
								${sn(p)}
						}
				`}static copyInputs(e,t){let n=e.match(Xt);if(!n||!n[2])return e;let r=n[2],i=n.index+n[0].length-1,a=e.slice(0,i+1),o=e.slice(i+1);return a+`
		_pcCopyInputs(${r});`+o}static cutOut(e,t,n,r){return e.substring(0,t)+r+e.substring(n)}},Cn=new Ne,wn=class{_ownedMeshBindGroupFormat=null;_vertexCode=null;_fragmentCode=null;_computeCode=null;_computeKey;computeBindGroupFormat=null;computeReflectedBindGroupFormat=null;computeReflectedUniformBufferFormat=null;computeReflectedGroupIndex=0;vertexEntryPoint=`main`;fragmentEntryPoint=`main`;computeEntryPoint=`main`;constructor(e){this.shader=e;let t=e.definition;t.shaderLanguage===`wgsl`?(t.cshader?(t.computeEntryPoint&&(this.computeEntryPoint=t.computeEntryPoint),this.processComputeWGSL()):(this.vertexEntryPoint=`vertexMain`,this.fragmentEntryPoint=`fragmentMain`,t.processingOptions?this.processWGSL():(this._vertexCode=t.vshader??null,this._fragmentCode=t.fshader??null,e.meshUniformBufferFormat=t.meshUniformBufferFormat,e.meshBindGroupFormat=t.meshBindGroupFormat)),e.ready=!0):t.processingOptions&&this.processGLSL()}destroy(e){this._vertexCode=null,this._fragmentCode=null,this._ownedMeshBindGroupFormat?.destroy(),this._ownedMeshBindGroupFormat=null,this.computeReflectedBindGroupFormat?.destroy(),this.computeReflectedBindGroupFormat=null}createShaderModule(e,t){return this.shader.device.wgpu.createShaderModule({code:e})}getVertexShaderModule(){return this.createShaderModule(this._vertexCode,`Vertex`)}getFragmentShaderModule(){return this.createShaderModule(this._fragmentCode,`Fragment`)}getComputeShaderModule(){return this.createShaderModule(this._computeCode,`Compute`)}processGLSL(){let e=this.shader,t=_.run(e.device,e.definition,e);this._vertexCode=this.transpile(t.vshader,`vertex`,e.definition.vshader),this._fragmentCode=this.transpile(t.fshader,`fragment`,e.definition.fshader),this._vertexCode&&this._fragmentCode?e.ready=!0:e.failed=!0,e.meshUniformBufferFormat=t.meshUniformBufferFormat,e.meshBindGroupFormat=t.meshBindGroupFormat,e.viewBindGroupFormat=t.viewBindGroupFormat,this._ownedMeshBindGroupFormat=t.meshBindGroupFormat,e.attributes=t.attributes}processComputeWGSL(){let e=this.shader,t=e.definition,n=t.computeBindGroupFormat??null,r=+!!n,i=Sn.runCompute(e.device,t.cshader,t,e,r);this._computeCode=i.cshader,this.computeBindGroupFormat=n,this.computeUniformBufferFormats=t.computeUniformBufferFormats,this.computeReflectedGroupIndex=r,this.computeReflectedBindGroupFormat=i.computeBindGroupFormat,this.computeReflectedUniformBufferFormat=i.computeUniformBufferFormat}processWGSL(){let e=this.shader,t=Sn.run(e.device,e.definition,e);this._vertexCode=t.vshader,this._fragmentCode=t.fshader,e.meshUniformBufferFormat=t.meshUniformBufferFormat,e.meshBindGroupFormat=t.meshBindGroupFormat,e.viewBindGroupFormat=t.viewBindGroupFormat,e.usesMeshInstanceStorage=t.usesMeshInstanceStorage,e.meshUniformBufferEmpty=t.meshUniformBufferEmpty,this._ownedMeshBindGroupFormat=t.meshBindGroupFormat,e.attributes=t.attributes}transpile(e,t,n){let r=this.shader.device;if(!r.glslang||!r.twgsl)return console.error(`Cannot transpile shader [${this.shader.label}] - shader transpilers (glslang/twgsl) are not available. Make sure to provide glslangUrl and twgslUrl when creating the device.`,{shader:this.shader}),null;try{let n=r.glslang.compileGLSL(e,t);return r.twgsl.convertSpirV2WGSL(n)}catch(r){console.error(`Failed to transpile webgl ${t} shader [${this.shader.label}] to WebGPU while rendering undefined, error:
 [${r.stack}]`,{processed:e,original:n,shader:this.shader,error:r,stack:r.stack})}}get vertexCode(){return this._vertexCode}get fragmentCode(){return this._fragmentCode}get computeKey(){if(this._computeKey===void 0){let e=`${this._computeCode}|${this.computeEntryPoint}`;this._computeKey=Cn.get(e)}return this._computeKey}loseContext(){}restoreContext(e,t){}},Tn=[];Tn[0]=`repeat`,Tn[1]=`clamp-to-edge`,Tn[2]=`mirror-repeat`;var En=[];En[0]={level:`nearest`,mip:`nearest`},En[1]={level:`linear`,mip:`nearest`},En[2]={level:`nearest`,mip:`nearest`},En[3]={level:`nearest`,mip:`linear`},En[4]={level:`linear`,mip:`nearest`},En[5]={level:`linear`,mip:`linear`};var Dn=class{gpuTexture;view;samplers=[];desc;format;viewCache=new Map;constructor(e){this.texture=e,this.format=X[e.format],e.device.contextLost||this.create(e.device)}create(e){let t=this.texture,n=e.wgpu,r=t.numLevels;ye(t.format)&&(t.width%4!=0||t.height%4!=0)&&(t._width=q.roundUp(t.width,4),t._height=q.roundUp(t.height,4)),this.desc={size:{width:t.width,height:t.height,depthOrArrayLayers:t.cubemap?6:t.array?t.arrayLength:1},format:this.format,mipLevelCount:r,sampleCount:t.samples,dimension:t.volume?`3d`:`2d`,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC|(ye(t.format)?0:GPUTextureUsage.RENDER_ATTACHMENT)|(t.storage?GPUTextureUsage.STORAGE_BINDING:0)},this.gpuTexture=n.createTexture(this.desc);let i;this.texture.format===17&&(i={format:`depth24plus`,aspect:`depth-only`}),this.view=this.createView(i),this.viewCache.clear()}destroy(e){e.deferDestroy(this.gpuTexture),this.gpuTexture=null,this.view=null,this.viewCache.clear(),this.samplers.length=0}propertyChanged(e){this.samplers.length=0}getView(e,t){if(this.uploadImmediate(e,this.texture),t){let e=this.viewCache.get(t.key);return e||(e=this.createView({baseMipLevel:t.baseMipLevel,mipLevelCount:t.mipLevelCount,baseArrayLayer:t.baseArrayLayer,arrayLayerCount:t.arrayLayerCount}),this.viewCache.set(t.key,e)),e}return this.view}createView(e){let t=e??{},n=this.desc,r=this.texture,i={format:t.format??n.format,dimension:t.dimension??(r.cubemap?`cube`:r.volume?`3d`:r.array?`2d-array`:`2d`),aspect:t.aspect??`all`,baseMipLevel:t.baseMipLevel??0,mipLevelCount:t.mipLevelCount??n.mipLevelCount,baseArrayLayer:t.baseArrayLayer??0,arrayLayerCount:t.arrayLayerCount??n.depthOrArrayLayers};return this.gpuTexture.createView(i)}getSampler(e,t){let n=this.samplers[t];if(!n){let r=this.texture,i={addressModeU:Tn[r.addressU],addressModeV:Tn[r.addressV],addressModeW:Tn[r.addressW]};!t&&r.compareOnRead&&(t=2),t===2||t===3||t===4?(i.compare=`less`,i.magFilter=`linear`,i.minFilter=`linear`):t===1||!e.textureFloatFilterable&&(r.format===14||r.format===12)||this.texture.format===17||ze(this.texture.format)?(i.magFilter=`nearest`,i.minFilter=`nearest`,i.mipmapFilter=`nearest`):(i.magFilter=En[r.magFilter].level,i.minFilter=En[r.minFilter].level,i.mipmapFilter=En[r.minFilter].mip),i.maxAnisotropy=i.minFilter===`linear`&&i.magFilter===`linear`&&i.mipmapFilter===`linear`?q.clamp(Math.round(r._anisotropy),1,e.maxTextureAnisotropy):1,n=e.wgpu.createSampler(i),this.samplers[t]=n}return n}loseContext(){this.gpuTexture=null,this.view=null,this.viewCache.clear(),this.samplers.length=0}uploadImmediate(e,t){e.contextLost||e._destroyed||(t._needsUpload||t._needsMipmapsUpload)&&(this.uploadData(e),t._needsUpload=!1,t._needsMipmapsUpload=!1)}uploadData(e){let t=this.texture;if(this.desc&&(this.desc.size.width!==t.width||this.desc.size.height!==t.height)&&(e.deferDestroy(this.gpuTexture),this.create(e),t.renderVersionDirty=e.renderVersion),t._levels){let n=!1,r=!1,i=t.numLevels;for(let a=0;a<i;a++){let i=t._levels[a];if(i){if(t.cubemap)for(let t=0;t<6;t++){let o=i[t];o?this.isExternalImage(o)?(this.uploadExternalImage(e,o,a,t),n=!0):ArrayBuffer.isView(o)&&(this.uploadTypedArrayData(e,o,a,t),n=!0):r=!0}else if(!t._volume){if(t.array){if(t.arrayLength===i.length)for(let r=0;r<t._arrayLength;r++){let t=i[r];this.isExternalImage(t)?(this.uploadExternalImage(e,t,a,r),n=!0):ArrayBuffer.isView(t)&&(this.uploadTypedArrayData(e,t,a,r),n=!0)}else r=!0}else e._isHTMLElementInterface(i)&&e.supportsHtmlTextures?(this.uploadElementImage(e,i,a,0),n=!0):this.isExternalImage(i)?(this.uploadExternalImage(e,i,a,0),n=!0):ArrayBuffer.isView(i)&&(this.uploadTypedArrayData(e,i,a,0),n=!0)}}else r=!0}n&&r&&t.mipmaps&&!ye(t.format)&&!ze(t.format)&&e.mipmapRenderer.generate(this),t._gpuSize&&t.adjustVramSizeTracking(e._vram,-t._gpuSize),t._gpuSize=t.gpuSize,t.adjustVramSizeTracking(e._vram,t._gpuSize),t.releaseSourceAfterUpload&&t.releaseImageSources()}}isExternalImage(e){return typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof HTMLVideoElement<`u`&&e instanceof HTMLVideoElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof OffscreenCanvas<`u`&&e instanceof OffscreenCanvas}uploadExternalImage(e,t,n,r){let i={source:t,origin:[0,0],flipY:!1},a={texture:this.gpuTexture,mipLevel:n,origin:[0,0,r],aspect:`all`,premultipliedAlpha:this.texture._premultiplyAlpha},o={width:this.desc.size.width,height:this.desc.size.height,depthOrArrayLayers:1};e.submit(),typeof HTMLCanvasElement<`u`&&t instanceof HTMLCanvasElement&&t.getContext(`2d`),e.wgpu.queue.copyExternalImageToTexture(i,a,o)}uploadElementImage(e,t,n,r){let i={texture:this.gpuTexture,mipLevel:n,origin:[0,0,r],aspect:`all`,premultipliedAlpha:this.texture._premultiplyAlpha},a=Se.calcLevelDimension(this.texture.width,n),o=Se.calcLevelDimension(this.texture.height,n);e.submit();let s={source:t},c={destination:i,width:a,height:o};e.wgpu.queue.copyElementImageToTexture(s,c)}uploadTypedArrayData(e,t,n,r){let i=this.texture,a=e.wgpu,o={texture:this.gpuTexture,origin:[0,0,r],mipLevel:n},s=Se.calcLevelDimension(i.width,n),c=Se.calcLevelDimension(i.height,n);Se.calcLevelGpuSize(s,c,1,i.format);let l=Ie.get(i.format),u,d;if(l.size)u={offset:0,bytesPerRow:l.size*s,rowsPerImage:c},d={width:s,height:c};else if(l.blockSize){let e=e=>Math.floor((e+3)/4);u={offset:0,bytesPerRow:l.blockSize*e(s),rowsPerImage:e(c)},d={width:Math.max(4,s),height:Math.max(4,c)}}e.submit(),a.queue.writeTexture(o,t,u,d)}read(e,t,n,r,i){let a=i.mipLevel??0,o=i.face??0,s=i.data??null,c=i.immediate??!1,l=this.texture,u=n*Ie.get(l.format).size,d=q.roundUp(u,256),f=d*r,p=l.device,m=p.createBufferImpl(9);m.allocate(p,f);let h={texture:this.gpuTexture,mipLevel:a,origin:[e,t,o]},g={buffer:m.buffer,offset:0,bytesPerRow:d},_={width:n,height:r,depthOrArrayLayers:1};return p.getCommandEncoder().copyTextureToBuffer(h,g,_),p.readBuffer(m,f,null,c).then(e=>{let t=ge(l.format),n=s?.buffer??new ArrayBuffer(r*u),i=new Uint8Array(n,s?.byteOffset??0,r*u);for(let t=0;t<r;t++){let n=t*d,r=t*u;i.set(e.subarray(n,n+u),r)}return s??new t(n)})}copy(e,t){let n=this.texture.device,r=t.sourceMipLevel??0,i=t.destMipLevel??0,a=t.face??0,o=t.sourceX??0,s=t.sourceY??0,c=t.destX??0,l=t.destY??0,u=t.width??Math.max(1,e.width>>r),d=t.height??Math.max(1,e.height>>r);return n._uploadDirtyTextures(),n.getCommandEncoder().copyTextureToTexture({texture:e.impl.gpuTexture,mipLevel:r,origin:[o,s,a]},{texture:this.gpuTexture,mipLevel:i,origin:[c,l,a]},{width:u,height:d,depthOrArrayLayers:1}),!0}},On=class extends gt{constructor(e){super(64)}unlock(e){let t=e.device;super.unlock(t,e.storageInt32.buffer)}},kn=class extends gt{constructor(e,t,n){super(32|(n?.storage?128:0))}unlock(e,t,n){let r=e.device;super.unlock(r,e.storage,t,n)}},An=`
	struct ub_mesh {
		color : vec4f,
		depth: f32
	}
	@group(3) @binding(0) var<uniform> ubMesh : ub_mesh;
	var<private> pos : array<vec2f, 4> = array<vec2f, 4>(
		vec2(-1.0, 1.0), vec2(1.0, 1.0), vec2(-1.0, -1.0), vec2(1.0, -1.0)
	);
	struct VertexOutput {
		@builtin(position) position : vec4f
	}
	@vertex
	fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
		var output : VertexOutput;
		output.position = vec4(pos[vertexIndex], ubMesh.depth, 1.0);
		return output;
	}
	@fragment
	fn fragmentMain() -> @location(0) vec4f {
		return ubMesh.color;
	}
`,jn={type:5,base:0,baseVertex:0,count:4,indexed:!1},Mn=class{constructor(t){this.shader=new r(t,{name:`WebGPUClearRendererShader`,shaderLanguage:K,vshader:An,fshader:An}),this.uniformBuffer=new de(t,new je(t,[new B(`color`,5),new B(`depth`,2)]),!1),this.dynamicBindGroup=new Pe,this.colorData=new Float32Array(4),this.stencilState=new e({func:7,zpass:2})}destroy(){this.shader.destroy(),this.shader=null,this.uniformBuffer.destroy(),this.uniformBuffer=null}clear(e,t,n,r){n||=r;let i=n.flags??r.flags;if(i!==0){let{uniformBuffer:a,dynamicBindGroup:o}=this;a.startUpdate(o),e.setBindGroup(3,o.bindGroup,o.offsets),e.setBindGroup(2,e.emptyBindGroup),e.setBindGroup(1,e.emptyBindGroup);let s;if(i&1&&(t.colorBuffer||t.impl.assignedColorTexture)){let e=n.color??r.color;this.colorData.set(e),s=Ae.NOBLEND}else s=Ae.NOWRITE;a.set(`color`,this.colorData);let c;if(i&2&&t.depth){let e=n.depth??r.depth;a.set(`depth`,e),c=he.WRITEDEPTH}else a.set(`depth`,1),c=he.NODEPTH;let l=null;i&4&&t.stencil&&(l=this.stencilState,l.ref=n.stencil??r.stencil),a.endUpdate(),e.setDrawStates(s,c,0,0,l,l),e.setShader(this.shader),e.draw(jn)}}},Nn=`
	var<private> pos : array<vec2f, 4> = array<vec2f, 4>(
		vec2(-1.0, 1.0), vec2(1.0, 1.0), vec2(-1.0, -1.0), vec2(1.0, -1.0)
	);
	struct VertexOutput {
		@builtin(position) position : vec4f,
		@location(0) texCoord : vec2f
	};
	@vertex
	fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
		var output : VertexOutput;
		output.texCoord = pos[vertexIndex] * vec2f(0.5, -0.5) + vec2f(0.5);
		output.position = vec4f(pos[vertexIndex], 0, 1);
		return output;
	}
	@group(0) @binding(0) var imgSampler : sampler;
	@group(0) @binding(1) var img : texture_2d<f32>;
	@fragment
	fn fragmentMain(@location(0) texCoord : vec2f) -> @location(0) vec4f {
		return textureSample(img, imgSampler, texCoord);
	}
`,Pn=class{device;pipelineCache=new Map;constructor(e){this.device=e,this.shader=new r(e,{name:`WebGPUMipmapRendererShader`,shaderLanguage:K,vshader:Nn,fshader:Nn}),this.minSampler=e.wgpu.createSampler({minFilter:`linear`})}destroy(){this.shader.destroy(),this.shader=null,this.pipelineCache.clear()}generate(e){let t=e.desc;if(t.mipLevelCount<=1||e.texture.volume)return;let n=this.device,r=n.wgpu,i=t.format,a=this.pipelineCache.get(i);if(!a){let e=this.shader.impl;a=r.createRenderPipeline({layout:`auto`,vertex:{module:e.getVertexShaderModule(),entryPoint:e.vertexEntryPoint},fragment:{module:e.getFragmentShaderModule(),entryPoint:e.fragmentEntryPoint,targets:[{format:i}]},primitive:{topology:`triangle-strip`}}),this.pipelineCache.set(i,a)}let o=e.texture,s=o.cubemap?6:o.array?o.arrayLength:1,c=[];for(let t=0;t<s;t++)c.push(e.createView({dimension:`2d`,baseMipLevel:0,mipLevelCount:1,baseArrayLayer:t}));let l=n.getCommandEncoder();for(let n=1;n<t.mipLevelCount;n++)for(let t=0;t<s;t++){let i=e.createView({dimension:`2d`,baseMipLevel:n,mipLevelCount:1,baseArrayLayer:t}),o=l.beginRenderPass({colorAttachments:[{view:i,loadOp:`clear`,storeOp:`store`}]}),s=r.createBindGroup({layout:a.getBindGroupLayout(0),entries:[{binding:0,resource:this.minSampler},{binding:1,resource:c[t]}]});o.setPipeline(a),o.setBindGroup(0,s),o.draw(4),o.end(),c[t]=i}n.pipeline=null}},Fn=class extends h{buffer=null;mappedRange=null;constructor(e,t,n){super(e),this.buffer=e.wgpu.createBuffer({size:t,usage:n?GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:n}),n&&this.onAvailable(),e._vram.ub+=t}destroy(e){this.bindGroupCache.forEach(e=>e.destroy()),this.bindGroupCache.clear(),this.bindGroupFormat.destroy(),this.mappedRange=null,this.setStorage(null),e._vram.ub-=this.buffer.size,this.buffer.destroy(),this.buffer=null}onAvailable(){this.mappedRange=this.buffer.getMappedRange(),this.setStorage(this.mappedRange)}},In=class extends Xe{pendingStagingBuffers=[];destroy(){this.scheduleSubmit();for(let{gpuBuffer:e,stagingBuffer:t}of this.usedBuffers)e.destroy(this.device),t.destroy(this.device);for(let e of this.pendingStagingBuffers)e.destroy(this.device);this.pendingStagingBuffers.length=0,super.destroy()}createBuffer(e,t,n){return new Fn(e,t,n)}submit(){super.submit();let e=this.usedBuffers.length;if(e){let t=this.device,n=this.gpuBuffers,r=t.wgpu.createCommandEncoder();for(let t=e-1;t>=0;t--){let{stagingBuffer:e,gpuBuffer:i,offset:a,size:o}=this.usedBuffers[t],s=e.buffer;s.unmap(),r.copyBufferToBuffer(s,a,i.buffer,a,o),n.push(i)}let i=r.finish();t.addCommandBuffer(i,!0);for(let t=0;t<e;t++){let e=this.usedBuffers[t].stagingBuffer;this.pendingStagingBuffers.push(e)}this.usedBuffers.length=0}}onCommandBuffersSubmitted(){let e=this.pendingStagingBuffers.length;if(e){let t=this.device;for(let n=0;n<e;n++){let e=this.pendingStagingBuffers[n];t.mapBufferAsync(e.buffer,GPUMapMode.WRITE).then(n=>{n&&this.stagingBuffers?(e.onAvailable(),this.stagingBuffers.push(e)):e.destroy(t)})}this.pendingStagingBuffers.length=0}}},Ln=class{querySet;stagingBuffers=[];activeStagingBuffer=null;bytesPerSlot;constructor(e,t,n){this.device=e,this.capacity=n,this.bytesPerSlot=t?8:4;let r=e.wgpu;this.querySet=r.createQuerySet({type:t?`timestamp`:`occlusion`,count:n}),this.queryBuffer=r.createBuffer({size:this.bytesPerSlot*n,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}destroy(){this.device.deferDestroy(this.querySet),this.querySet=null,this.device.deferDestroy(this.queryBuffer),this.queryBuffer=null,this.activeStagingBuffer=null,this.stagingBuffers.forEach(e=>{e.destroy()}),this.stagingBuffers=null}getStagingBuffer(){let e=this.stagingBuffers.pop();return e||=this.device.wgpu.createBuffer({size:this.queryBuffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),e}resolve(e){let t=this.device.getCommandEncoder();t.resolveQuerySet(this.querySet,0,e,this.queryBuffer,0);let n=this.getStagingBuffer();this.activeStagingBuffer=n,t.copyBufferToBuffer(this.queryBuffer,0,n,0,this.bytesPerSlot*e)}request(e,t){let n=this.activeStagingBuffer;return this.activeStagingBuffer=null,this.device.mapBufferAsync(n,GPUMapMode.READ).then(r=>{if(!r)return n.destroy(),null;let i=new BigInt64Array(n.getMappedRange()),a=[],o=null,s=null;for(let t=0;t<e;t++){let e=i[t*2],n=i[t*2+1];a.push(Math.max(0,Number(n-e)*1e-6)),(o===null||e<o)&&(o=e),n<o&&(o=n),(s===null||n>s)&&(s=n),e>s&&(s=e)}let c=e>0?Number(s-o)*1e-6:0;return n.unmap(),this.stagingBuffers?.push(n),{renderVersion:t,timings:a,frameTime:c}})}},Rn=class extends oe{device;frameGPUMarkerSlot;constructor(e){super(),this.device=e,this.maxCount=1024,this.timestampQueriesSet=e.supportsTimestampQuery?new Ln(e,!0,2*this.maxCount):null}destroy(){this.invalidateTimings(),this.timestampQueriesSet?.destroy(),this.timestampQueriesSet=null}frameStart(){this.processEnableRequest()}frameEnd(){this._enabled&&this.timestampQueriesSet?.resolve(this.slotCount*2)}request(){if(this._enabled){let e=this.device.renderVersion;this.timestampQueriesSet?.request(this.slotCount,e).then(e=>{e&&this.report(e.renderVersion,e.timings,e.frameTime)}),super.request(e)}}},zn=`
	var<private> pos : array<vec2f, 4> = array<vec2f, 4>(
		vec2(-1.0, 1.0), vec2(1.0, 1.0), vec2(-1.0, -1.0), vec2(1.0, -1.0)
	);
	struct VertexOutput {
		@builtin(position) position : vec4f,
	};
	@vertex
	fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
		var output : VertexOutput;
		output.position = vec4f(pos[vertexIndex], 0, 1);
		return output;
	}
	@group(0) @binding(0) var img : texture_depth_multisampled_2d;
	@fragment
	fn fragmentMain(@builtin(position) fragColor: vec4f) -> @location(0) vec4f {
		let coord = vec2i(fragColor.xy);
		var depth = textureLoad(img, coord, 0u);
		#if defined(DEPTH_RESOLVE_MIN) || defined(DEPTH_RESOLVE_MAX)
			let count = i32(textureNumSamples(img));
			for (var i = 1; i < count; i++) {
				#ifdef DEPTH_RESOLVE_MIN
					depth = min(depth, textureLoad(img, coord, i));
				#else
					depth = max(depth, textureLoad(img, coord, i));
				#endif
			}
		#endif
		return vec4f(depth, 0.0, 0.0, 0.0);
	}
`,Bn=class{device;pipelineCache=new Map;shaderCache=new Map;constructor(e){this.device=e}destroy(){this.shaderCache.forEach(e=>e.destroy()),this.shaderCache=null,this.pipelineCache=null}getShader(e){let t=this.shaderCache.get(e);if(!t){let n=`#define DEPTH_RESOLVE_${e.toUpperCase()}
${zn}`;t=new r(this.device,{name:`WebGPUResolverDepthShader-${e}`,shaderLanguage:K,vshader:n,fshader:n}),this.shaderCache.set(e,t)}return t}getPipeline(e,t){let n=`${e}-${t}`,r=this.pipelineCache.get(n);return r||(r=this.createPipeline(e,t),this.pipelineCache.set(n,r)),r}createPipeline(e,t){let n=this.getShader(t).impl;return this.device.wgpu.createRenderPipeline({layout:`auto`,vertex:{module:n.getVertexShaderModule(),entryPoint:n.vertexEntryPoint},fragment:{module:n.getFragmentShaderModule(),entryPoint:n.fragmentEntryPoint,targets:[{format:e}]},primitive:{topology:`triangle-strip`}})}resolveDepth(e,t,n,r=`min`){let i=this.device,a=i.wgpu,o=this.getPipeline(n.format,r),s=t.depthOrArrayLayers;for(let r=0;r<s;r++){let i=t.createView({dimension:`2d`,aspect:`depth-only`,baseMipLevel:0,mipLevelCount:1,baseArrayLayer:r}),s=n.createView({dimension:`2d`,baseMipLevel:0,mipLevelCount:1,baseArrayLayer:r}),c=e.beginRenderPass({colorAttachments:[{view:s,loadOp:`clear`,storeOp:`store`}]}),l=a.createBindGroup({layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:i}]});c.setPipeline(o),c.setBindGroup(0,l),c.draw(4),c.end()}i.pipeline=null}},Vn=12,Hn=class{uniformBuffers=[];bindGroups=[];constructor(e){this.compute=e;let{device:t,shader:n}=e,{computeBindGroupFormat:r,computeUniformBufferFormats:i,computeReflectedBindGroupFormat:a,computeReflectedUniformBufferFormat:o,computeReflectedGroupIndex:s}=n.impl,c=[];if(r){let e=new fe(t,r);if(i){for(let n in i)if(i.hasOwnProperty(n)){let r=new de(t,i[n],!0);this.uniformBuffers.push(r),e.setUniformBuffer(n,r)}}c[0]=r,this.bindGroups[0]=e}if(a){let e=new fe(t,a);if(o){let n=new de(t,o,!0);this.uniformBuffers.push(n),e.setUniformBuffer(`ub_compute`,n)}c[s]=a,this.bindGroups[s]=e}this.pipeline=t.computePipeline.get(n,c),t._computes.add(this)}destroy(){this.compute.device._computes.delete(this),this.pipeline=null,this.uniformBuffers.forEach(e=>e.destroy()),this.uniformBuffers.length=0,this.bindGroups.forEach(e=>e.destroy()),this.bindGroups.length=0}loseContext(){this.pipeline=null}restoreContext(){let{device:e,shader:t}=this.compute;this.pipeline=e.computePipeline.get(t,this.bindGroups.map(e=>e.format))}updateBindGroup(){for(let e=0;e<this.bindGroups.length;e++){let t=this.bindGroups[e];t.updateUniformBuffers(),t.update()}}dispatch(e,t,n){let r=this.compute.device;for(let e=0;e<this.bindGroups.length;e++)r.setBindGroup(e,this.bindGroups[e]);let i=r.passEncoder;i.setPipeline(this.pipeline);let{indirectSlotIndex:a,indirectBuffer:o,indirectFrameStamp:s}=this.compute;if(a>=0){let e;e=o?o.impl.buffer:r.indirectDispatchBuffer.impl.buffer;let t=a*Vn;i.dispatchWorkgroupsIndirect(e,t)}else i.dispatchWorkgroups(e,t,n)}},Un=28,Wn=112,Gn=16,Kn=class{capacity=0;count=0;version=0;buffer=null;data=new Float32Array;_freeSlots=[];_releasedSlots=[];_dirtyBits=new Uint32Array;_dirty=!1;constructor(e,t=1024){this.device=e,this.scopeId=e.scope.resolve(`meshInstanceStorage`),this._resize(t)}destroy(){this.buffer?.destroy(),this.buffer=null}restoreContext(){this._dirtyBits.fill(0),this._dirty=!1,this._recycleReleasedSlots(),this.count>0&&this._writeRange(0,this.count-1)}allocate(){return this._freeSlots.length>0?this._freeSlots.pop():(this.count===this.capacity&&this._resize(this.capacity*2),this.count++)}free(e){this._releasedSlots.push(e)}write(e,t,n){let r=this.data,i=e*Un;r.set(t,i),r[i+16]=n[0],r[i+17]=n[1],r[i+18]=n[2],r[i+20]=n[3],r[i+21]=n[4],r[i+22]=n[5],r[i+24]=n[6],r[i+25]=n[7],r[i+26]=n[8],this._dirtyBits[e>>5]|=1<<(e&31),this._dirty=!0}upload(){this._uploadDirtySlots(),this._recycleReleasedSlots()}_recycleReleasedSlots(){let e=this._releasedSlots;for(;e.length>0;)this._freeSlots.push(e.pop())}_uploadDirtySlots(){if(!this._dirty)return;this._dirty=!1;let e=-1,t=-1,n=this._dirtyBits;for(let r=0;r<n.length;r++){let i=n[r];if(i===0)continue;n[r]=0;let a=r<<5;if(i===4294967295)e<0?e=a:a-t>Gn&&(this._writeRange(e,t),e=a),t=a+31;else for(;i!==0;){let n=a+31-Math.clz32(i&-i);i&=i-1,e<0?e=n:n-t>Gn&&(this._writeRange(e,t),e=n),t=n}}this._writeRange(e,t)}_writeRange(e,t){this.buffer.write(e*Wn,this.data,e*Un,(t-e+1)*Un)}_resize(e){let t=this.buffer;t&&(this._uploadDirtySlots(),t.destroy());let n=new Float32Array(e*Un);n.set(this.data),this.data=n,this._dirtyBits=new Uint32Array(Math.ceil(e/32)),this.capacity=e,this.buffer=new A(this.device,e*Wn,12),this.count>0&&this._writeRange(0,this.count-1),this.scopeId.setValue(this.buffer),this.version++}},qn=class{device;gpuIndirect=null;gpuIndirectSigned=null;storage=null;count=0;constructor(e){this.device=e,e._drawCommands.add(this)}allocate(e){this.gpuIndirect&&this.gpuIndirect.length===5*e||(this.storage?.destroy(),this.count=0,this.gpuIndirect=new Uint32Array(5*e),this.gpuIndirectSigned=new Int32Array(this.gpuIndirect.buffer),this.storage=new A(this.device,this.gpuIndirect.byteLength,264))}add(e,t,n,r,i=0,a=0){let o=e*5;this.gpuIndirect[o+0]=t,this.gpuIndirect[o+1]=n,this.gpuIndirect[o+2]=r,this.gpuIndirectSigned[o+3]=i,this.gpuIndirect[o+4]=a}update(e){if(this.count=e,this.storage&&e>0){let t=e*5;this.storage.write(0,this.gpuIndirect,0,t)}}restoreContext(){this.update(this.count)}destroy(){this.device._drawCommands.delete(this),this.storage?.destroy(),this.storage=null}},Jn=class{availableStagingBuffers=[];pendingStagingBuffers=[];_destroyed=!1;_lastUploadSubmitVersion=-1;constructor(e){this.uploadStream=e,this.useSingleBuffer=e.useSingleBuffer}_onDeviceLost(){this.availableStagingBuffers.forEach(e=>e.destroy()),this.availableStagingBuffers.length=0,this.pendingStagingBuffers.forEach(e=>e.destroy()),this.pendingStagingBuffers.length=0,this._lastUploadSubmitVersion=-1}destroy(){this._destroyed=!0,this._onDeviceLost()}update(e){let t=this.uploadStream.device,n=t.wgpu,r=this.pendingStagingBuffers;for(let e=0;e<r.length;e++){let i=r[e];t.mapBufferAsync(i,GPUMapMode.WRITE).then(e=>{e&&!this._destroyed&&!t.contextLost&&t.wgpu===n?this.availableStagingBuffers.push(i):i.destroy()})}r.length=0;let i=this.availableStagingBuffers;for(let t=i.length-1;t>=0;t--)i[t].size<e&&(i[t].destroy(),i.splice(t,1))}upload(e,t,n,r){this.useSingleBuffer?this.uploadDirect(e,t,n,r):this.uploadStaging(e,t,n,r)}uploadDirect(e,t,n,r){let i=n*e.BYTES_PER_ELEMENT;r*e.BYTES_PER_ELEMENT,t.write(i,e,0,r)}uploadStaging(e,t,n,r){let i=this.uploadStream.device,a=n*e.BYTES_PER_ELEMENT,o=r*e.BYTES_PER_ELEMENT;this.pendingStagingBuffers.length,this.update(o);let s=this.availableStagingBuffers.pop()??this.uploadStream.device.wgpu.createBuffer({size:o,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0}),c=s.getMappedRange();new Uint8Array(c).set(new Uint8Array(e.buffer,e.byteOffset,o)),s.unmap(),i.getCommandEncoder().copyBufferToBuffer(s,0,t.impl.buffer,a,o),this.pendingStagingBuffers.push(s),this._lastUploadSubmitVersion=i.submitVersion}},Yn=class{_binding=null;_layer=null;_cachedFramebufferSize=new Qe;constructor(e){this.xrBridge=e}destroy(e){this._binding=null,this._layer=null,this._cachedFramebufferSize.set(0,0),e._clearXrState()}beginFrame(e,t){let n=this.xrBridge.device;if(n._clearXrState(),!this._binding||!this._layer||!t)return;let r=e.getViewerPose(t);if(!r||!r.views?.length)return;let i=n.xrSubImages;for(let e=0;e<r.views.length;e++){let t;try{t=this._binding.getViewSubImage(this._layer,r.views[e])}catch(e){this.xrBridge._onBindingError?.(e);return}let n=t?.colorTexture;if(!n)continue;let a=null;if(typeof t.getViewDescriptor==`function`)try{let e=t.getViewDescriptor();e&&(a={...e})}catch{}i.push({colorTexture:n,viewDescriptor:a,viewport:t.viewport,viewFormat:a?.format??n.format})}let a=i[0];a&&(n.xrColorTexture=a.colorTexture,n.xrColorTextureViewFormat=a.viewFormat,n.setXrBackBufferFormat(a.viewFormat),this._cachedFramebufferSize.set(a.colorTexture.width,a.colorTexture.height))}endFrame(){this.xrBridge.device?._clearXrState()}get presentationLayer(){return this._layer}get graphicsBinding(){return this._binding}getFramebufferSize(e,t){let n=this._layer;if(n){let e=n.textureWidth??n.width,r=n.textureHeight??n.height;if(e>0&&r>0){t.set(e,r);return}}this._cachedFramebufferSize.x>0&&this._cachedFramebufferSize.y>0?t.copy(this._cachedFramebufferSize):t.set(0,0)}getViewport(e,t){if(this._binding&&this._layer)try{let e=this._binding.getViewSubImage(this._layer,t);if(e?.viewport)return e.viewport}catch{}return{x:0,y:0,width:0,height:0}}attachPresentation(e,t){let n=globalThis.XRGPUBinding;if(n===void 0){this.xrBridge._onBindingError?.(Error(`XRGPUBinding is not available in this browser.`));return}let r=this.xrBridge.device.wgpu;try{this._binding=new n(e,r)}catch(e){this.xrBridge._onBindingError?.(e);return}let i={colorFormat:this._binding.getPreferredColorFormat(),scaleFactor:t.framebufferScaleFactor};try{this._layer=this._binding.createProjectionLayer({...i,textureType:`texture-array`})}catch{this._layer=this._binding.createProjectionLayer({...i,textureType:`texture`})}e.updateRenderState({layers:[this._layer],depthNear:t.depthNear,depthFar:t.depthFar})}syncCameraColorTexture(e,t){if(!this._binding?.getCameraImage)return;let n=this._binding.getCameraImage(e);if(!n)return;let r=t.impl?.gpuTexture;if(!r)return;let i=this.xrBridge.device.getCommandEncoder(),a=e.width,o=e.height;i.copyTextureToTexture({texture:n},{texture:r},[a,o,1])}syncCameraDepthTexture(e,t,n){e?.texture}releasePresentation(){this._binding=null}onGraphicsDeviceLost(){let e=this.xrBridge,t=e._session;if(!t)return;let n=t.renderState,r=e.device;this._binding=null,this._layer=null,this._cachedFramebufferSize.set(0,0),r._clearXrState(),t.updateRenderState({layers:[],depthNear:n.depthNear,depthFar:n.depthFar})}onGraphicsDeviceRestored(){let e=this.xrBridge;if(!e._session)return;let t=e.eventHandler;setTimeout(()=>{if(e._session)try{let t=e._session.renderState;e.attachPresentation(e._session,{framebufferScaleFactor:e._framebufferScaleFactor,depthNear:t.depthNear,depthFar:t.depthFar,onBindingError:e._onBindingError})}catch(e){t.fire(`error`,e)}},0)}},Xn=`modulepreload`,Zn=function(e,t){return new URL(e,t).href},Qn={},$n=function(e){return e.pathname.endsWith(`.css`)},er=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},tr=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=Zn(t,n);let r=s(t),i=$n(r);return er(Qn,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:Xn,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{let i=a=>{t.removeEventListener(`load`,i),t.removeEventListener(`error`,i),a.type===`error`?n(Error(`Unable to preload CSS for ${r}`)):e(a)};t.addEventListener(`load`,i),t.addEventListener(`error`,i)})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},nr=20,rr=12,ir={rgba8unorm:7,"rgba8unorm-srgb":20,bgra8unorm:31,"bgra8unorm-srgb":64,rgba16float:12},ar=class extends p{_deferredDestroys=[];gpuAdapter=null;wgpu=null;_ownsGpuDevice=!0;_uncapturedErrorHandler=null;canvasConfig=null;_bindGroups=new Set;_bindGroupFormats=new Set;_computes=new Set;_drawCommands=new Set;renderPipeline=new Lt(this);computePipeline=new Bt(this);_indirectDrawBuffer=null;_indirectDrawBufferCount=0;_indirectDrawNextIndex=0;_indirectDispatchBuffer=null;_indirectDispatchBufferCount=0;_indirectDispatchNextIndex=0;clearRenderer;mipmapRenderer;pipeline=null;_pipelineDirty=!0;_pipelinePrimitiveType=-1;_pipelineVertexHash0=-1;_pipelineVertexHash1=-1;_pipelineIndexFormat=-1;_boundVertexBuffers=[];_boundVertexOffsets=[];_boundIndexBuffer=null;_boundIndexFormat=null;bindGroupFormats=[];emptyBindGroup;submitVersion=0;_canvasBackBufferFormat;xrColorTexture=null;xrColorTextureViewFormat=null;xrColorTextureViewDescriptor=null;xrSubImages=[];xrCurrentViewIndex=-1;externalBackbuffer=null;commandEncoder=null;commandBuffers=[];limits;glslang=null;twgsl=null;constructor(e,t={}){super(e,t),t=this.initOptions,this.backBufferAntialias=t.antialias??!1,this.isWebGPU=!0,this._deviceType=ke,this.featureLevel=t.featureLevel,this.scope.resolve(_e).setValue(0)}getResourceCounts(e){super.getResourceCounts(e),e.set(`bindGroups`,this._bindGroups.size),e.set(`bindGroupFormats`,this._bindGroupFormats.size),e.set(`computes`,this._computes.size),e.set(`drawCommands`,this._drawCommands.size);let t=0,n=0;for(let e of this.renderPipeline.cache.values())t+=e.length;for(let e of this.computePipeline.cache.values())n+=e.length;e.set(`renderPipelines`,t),e.set(`computePipelines`,n)}destroy(){this.destroyDeviceResources(),this._clearXrState(),this.externalBackbuffer=null,super.destroy(),this.destroyDeferredResources(),this.clearDeviceState(),this._bindGroups.clear(),this._bindGroupFormats.clear(),this._computes.clear(),this._drawCommands.clear(),this.gpuContext?.unconfigure(),this._uncapturedErrorHandler&&=(this.wgpu?.removeEventListener?.(`uncapturederror`,this._uncapturedErrorHandler),null),this._ownsGpuDevice&&this.wgpu?.destroy(),this.wgpu=null,this.gpuAdapter=null,this.gpuContext=null,this.canvasConfig=null}destroyDeviceResources(){this.clearRenderer?.destroy(),this.clearRenderer=null,this.mipmapRenderer?.destroy(),this.mipmapRenderer=null,this.resolver?.destroy(),this.resolver=null,this.quadVertexBuffer?.destroy(),this.quadVertexBuffer=null,this.quadIndexBuffer?.destroy(),this.quadIndexBuffer=null,this.emptyBindGroup?.format.destroy(),this.emptyBindGroup?.destroy(),this.emptyBindGroup=null,this.dynamicBuffers?.destroy(),this.dynamicBuffers=null,this.gpuProfiler?.destroy(),this.gpuProfiler=null,this.backBuffer?.destroy(),this.backBuffer=null}_clearXrState(){this.xrColorTexture=null,this.xrColorTextureViewFormat=null,this.xrColorTextureViewDescriptor=null,this.xrSubImages.length=0,this.xrCurrentViewIndex=-1,this._canvasBackBufferFormat!==void 0&&(this.backBufferFormat=this._canvasBackBufferFormat)}setXrBackBufferFormat(e){let t=ir[e];t!==void 0&&(this.backBufferFormat=t)}initDeviceCaps(){let e=this.wgpu?.limits;this.limits=e,this.precision=`highp`,this.maxPrecision=`highp`,this.maxSamples=4,this.maxTextures=e.maxSampledTexturesPerShaderStage,this.maxTextureSize=e.maxTextureDimension2D,this.maxCubeMapSize=e.maxTextureDimension2D,this.maxVolumeSize=e.maxTextureDimension3D,this.maxColorAttachments=e.maxColorAttachments,this.maxPixelRatio=1,this.maxAnisotropy=16,this.fragmentUniformsCount=e.maxUniformBufferBindingSize/16,this.vertexUniformsCount=e.maxUniformBufferBindingSize/16,this.usesMeshBindGroups=!0,this.supportsAreaLights=!0,this.supportsGpuParticles=!0,this.supportsCompute=!0,this.supportsIndirectDraw=!0,this.supportsMeshInstanceStorage=(e.maxStorageBuffersInVertexStage??e.maxStorageBuffersPerShaderStage)>0,this.textureFloatRenderable=!0,this.textureHalfFloatRenderable=!0,this.supportsImageBitmap=typeof createImageBitmap==`function`,this.supportsIndependentBlending=!0,this.samples=this.backBufferAntialias?4:1;let t=window.navigator.gpu.wgslLanguageFeatures;this.supportsStorageTextureRead=t?.has(`readonly_and_readwrite_storage_textures`),this.supportsSubgroupUniformity=t?.has(`subgroup_uniformity`),this.supportsSubgroupId=t?.has(`subgroup_id`),this.supportsLinearIndexing=t?.has(`linear_indexing`),this.supportsUnrestrictedPointerParameters=t?.has(`unrestricted_pointer_parameters`),this.supportsPointerCompositeAccess=t?.has(`pointer_composite_access`),this.supportsPacked4x8IntegerDotProduct=t?.has(`packed_4x8_integer_dot_product`),this.supportsTextureAndSamplerLet=t?.has(`texture_and_sampler_let`),this.initCapsDefines()}async initWebGpu(e,t){if(!window.navigator.gpu)throw s(`WebGPU`),Error(`Unable to retrieve GPU. Ensure you are using a browser that supports WebGPU rendering.`);if(e&&t){let n=window.document?.baseURI??window.location.href,r=e=>new URL(e,n).toString(),i=r(t),a=r(t.replace(`.js`,`.wasm`)),o=r(e),s=await Promise.all([tr(()=>import(`${i}`).then(()=>twgsl(a)),[],import.meta.url),tr(()=>import(`${o}`).then(e=>e.default()),[],import.meta.url)]);this.twgsl=s[0],this.glslang=s[1]}return this.createDevice()}async createDevice(){if(this._destroyed)return null;let e={powerPreference:this.initOptions.powerPreference==="default"?void 0:this.initOptions.powerPreference,xrCompatible:!!this.initOptions.xrCompatible},t=await window.navigator.gpu.requestAdapter(e);if(this._destroyed)return null;if(!t)throw Error(`Unable to retrieve a WebGPU adapter`);if(t?.info?.vendor===`img-tec`)throw Error(`WebGPU is disabled on Imagination PowerVR GPUs due to driver issues. See https://github.com/playcanvas/engine/issues/8874`);let n=this.initOptions.featureLevel===`bare`,r=n?[]:this._applyFeatures(t.features),i={};if(!n){let e=t?.limits;if(e)for(let t in e)t!==`minSubgroupSize`&&t!==`maxSubgroupSize`&&(i[t]=e[t])}let a={requiredFeatures:r,requiredLimits:i,defaultQueue:{label:`Default Queue`}},o=await t.requestDevice(a);return this._destroyed?(o.destroy(),null):this.initFromGpuDevice(t,o,!0)}_applyFeatures(e){let t=[],n=n=>{let r=e.has(n);return r&&t.push(n),r};return this.textureFloatFilterable=n(`float32-filterable`),this.textureFloatBlendable=n(`float32-blendable`),this.extCompressedTextureS3TC=n(`texture-compression-bc`),this.extCompressedTextureS3TCSliced3D=n(`texture-compression-bc-sliced-3d`),this.extCompressedTextureETC=n(`texture-compression-etc2`),this.extCompressedTextureASTC=n(`texture-compression-astc`),this.extCompressedTextureASTCSliced3D=n(`texture-compression-astc-sliced-3d`),this.supportsTimestampQuery=n(`timestamp-query`),this.supportsDepthClip=n(`depth-clip-control`),this.supportsDepth32Stencil=n(`depth32float-stencil8`),this.supportsIndirectFirstInstance=n(`indirect-first-instance`),this.supportsShaderF16=n(`shader-f16`),this.supportsStorageRGBA8=n(`bgra8unorm-storage`),this.textureRG11B10Renderable=n(`rg11b10ufloat-renderable`),this.supportsClipDistances=n(`clip-distances`),this.supportsDualSourceBlending=n(`dual-source-blending`),this.supportsTextureFormatsTier1=n(`texture-formats-tier1`),this.supportsTextureFormatsTier2=n(`texture-formats-tier2`),this.supportsTextureFormatsTier1||=this.supportsTextureFormatsTier2,this.supportsPrimitiveIndex=n(`primitive-index`),this.supportsSubgroups=n(`subgroups`),this.supportsSubgroupSizeControl=n(`subgroup-size-control`),t}initFromGpuDevice(e,t,n=!1){this.gpuAdapter=e,this.wgpu=t,this._ownsGpuDevice=n,this._applyFeatures(t.features),this.maxSubgroupSize=e?.info?.subgroupMaxSize??0,this.minSubgroupSize=e?.info?.subgroupMinSize??0,window.navigator.gpu.wgslLanguageFeatures&&Array.from(window.navigator.gpu.wgslLanguageFeatures),this.supportsHtmlTextures=typeof this.wgpu.queue?.copyElementImageToTexture==`function`,this.supportsTransientAttachments=typeof GPUTextureUsage<`u`&&`TRANSIENT_ATTACHMENT`in GPUTextureUsage,n&&this.wgpu.lost?.then(this.handleDeviceLost.bind(this)),this._uncapturedErrorHandler=e=>{e.error},this.wgpu.addEventListener?.(`uncapturederror`,this._uncapturedErrorHandler),this.initDeviceCaps(),this.gpuContext=this.canvas.getContext(`webgpu`);let r=`standard`,i=window.navigator.gpu.getPreferredCanvasFormat(),a=this.initOptions.displayFormat;return this.backBufferFormat=i===`rgba8unorm`?a===`ldr_srgb`?20:7:a===`ldr_srgb`?64:31,this.backBufferViewFormat=a===`ldr_srgb`?`${i}-srgb`:i,a===`hdr`&&this.textureFloatFilterable&&window.matchMedia(`(dynamic-range: high)`)?.matches&&(this.backBufferFormat=12,this.backBufferViewFormat=`rgba16float`,i=`rgba16float`,this.isHdr=!0,r=`extended`),this.canvasConfig={device:this.wgpu,colorSpace:`srgb`,alphaMode:this.initOptions.alpha?`premultiplied`:`opaque`,format:i,toneMapping:{mode:r},usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC|GPUTextureUsage.COPY_DST,viewFormats:a===`ldr_srgb`?[this.backBufferViewFormat]:[]},this.gpuContext?.configure(this.canvasConfig),this._canvasBackBufferFormat=this.backBufferFormat,this.createBackbuffer(),this.clearRenderer=new Mn(this),this.mipmapRenderer=new Pn(this),this.resolver=new Bn(this),this.postInit(),this}debugLoseContext(e=100){}async handleDeviceLost(e){if(e.reason!==`destroyed`&&!this._destroyed){let e=this.gpuProfiler.enabled;if(this.loseContext(),this.fire(`devicelost`),this._destroyed||(await this.createDevice(),this._destroyed))return;this.restoreContext(),this.gpuProfiler.enabled=e,this.fire(`devicerestored`)}}clearDeviceState(){this.commandEncoder=null,this.commandBuffers.length=0,this.passEncoder=null,this.pipeline=null,this.insideRenderPass=!1,this.bindGroupFormats.length=0,this.renderPipeline.cache.clear(),this.computePipeline.cache.clear()}loseContext(){this.clearDeviceState(),this.destroyDeviceResources(),super.loseContext();for(let e of this._bindGroups)e.loseContext();for(let e of this._bindGroupFormats)e.loseContext();for(let e of this._computes)e.loseContext();this.destroyDeferredResources()}restoreContext(){for(let e of this.textures)e.impl.create(this);for(let e of this._bindGroupFormats)e.restoreContext();for(let e of this._computes)e.restoreContext();super.restoreContext();for(let e of this._drawCommands)e.restoreContext();this.meshInstanceStorage?.restoreContext()}postInit(){super.postInit(),this.initializeRenderState(),this.setupPassEncoderDefaults(),this.gpuProfiler=new Rn(this),this.dynamicBuffers=new In(this,102400,this.limits.minUniformBufferOffsetAlignment),this.emptyBindGroup=new fe(this,new Fe(this,[])),this.emptyBindGroup.update(),this.supportsMeshInstanceStorage&&!this.meshInstanceStorage&&(this.meshInstanceStorage=new Kn(this))}createBackbuffer(){this.supportsStencil=this.initOptions.stencil,this.backBuffer=new Ze({name:`WebgpuFramebuffer`,graphicsDevice:this,depth:this.initOptions.depth,stencil:this.supportsStencil,samples:this.samples,transientColor:this.initOptions.transientColor,transientDepth:this.initOptions.transientDepth}),this.backBuffer.impl.isBackbuffer=!0}frameStart(){super.frameStart(),this.gpuProfiler.frameStart(),this.submit();let e=this.xrColorTexture??this.gpuContext?.getCurrentTexture?.()??this.externalBackbuffer?.impl.gpuTexture;(this.backBufferSize.x!==e.width||this.backBufferSize.y!==e.height)&&(this.backBufferSize.set(e.width,e.height),this.backBuffer.destroy(),this.backBuffer=null,this.createBackbuffer());let t=this.backBuffer,n=t.impl,r=e===this.xrColorTexture&&this.xrColorTextureViewFormat?this.xrColorTextureViewFormat:this.backBufferViewFormat;n.setColorAttachment(0,void 0,r),t._width=e.width,t._height=e.height,this.initRenderTarget(t),n.assignColorTexture(e,r)}frameEnd(){super.frameEnd(),this.gpuProfiler.frameEnd(),this.submit(),this.contextLost||this.gpuProfiler.request(),this._indirectDrawNextIndex=0,this._indirectDispatchNextIndex=0}createBufferImpl(e){return new gt(e)}createUniformBufferImpl(e){return new On(e)}createVertexBufferImpl(e,t,n){return new kn(e,t,n)}createIndexBufferImpl(e,t){return new _t(e,t)}createShaderImpl(e){return new wn(e)}createDrawCommandImpl(e){return new qn(this)}createTextureImpl(e){return this.textures.add(e),new Dn(e)}createXrBridgeImpl(e){return new Yn(e)}createRenderTargetImpl(e){return new Wt(e)}createUploadStreamImpl(e){return new Jn(e)}createBindGroupFormatImpl(e){return new ht(e)}createBindGroupImpl(e){return new ut(e)}createComputeImpl(e){return new Hn(e)}get indirectDrawBuffer(){return this.allocateIndirectDrawBuffer(),this._indirectDrawBuffer}allocateIndirectDrawBuffer(){this._indirectDrawNextIndex===0&&this._indirectDrawBufferCount<this.maxIndirectDrawCount&&(this._indirectDrawBuffer?.destroy(),this._indirectDrawBuffer=null),this._indirectDrawBuffer===null&&(this._indirectDrawBuffer=new A(this,this.maxIndirectDrawCount*nr,264),this._indirectDrawBufferCount=this.maxIndirectDrawCount)}getIndirectDrawSlot(e=1){this.allocateIndirectDrawBuffer();let t=this._indirectDrawNextIndex,n=this._indirectDrawNextIndex+e;return this._indirectDrawNextIndex=n,t}get indirectDispatchBuffer(){return this.allocateIndirectDispatchBuffer(),this._indirectDispatchBuffer}allocateIndirectDispatchBuffer(){this._indirectDispatchNextIndex===0&&this._indirectDispatchBufferCount<this.maxIndirectDispatchCount&&(this._indirectDispatchBuffer?.destroy(),this._indirectDispatchBuffer=null),this._indirectDispatchBuffer===null&&(this._indirectDispatchBuffer=new A(this,this.maxIndirectDispatchCount*rr,264),this._indirectDispatchBufferCount=this.maxIndirectDispatchCount)}getIndirectDispatchSlot(e=1){this.allocateIndirectDispatchBuffer();let t=this._indirectDispatchNextIndex,n=this._indirectDispatchNextIndex+e;return this._indirectDispatchNextIndex=n,t}setBindGroup(e,t,n){if(this.passEncoder){let r=n??t.uniformBufferOffsets,i=r.length;i===0?this.passEncoder.setBindGroup(e,t.impl.bindGroup):this.passEncoder.setBindGroup(e,t.impl.bindGroup,r,0,i);let a=t.format.impl;this.bindGroupFormats[e]?.key!==a.key&&(this._pipelineDirty=!0),this.bindGroupFormats[e]=a}}submitVertexBuffer(e,t){let{interleaved:n,elements:r}=e.format,i=r.length,a=e.impl.buffer;if(n)return this.bindVertexBuffer(t,a,0),1;for(let e=0;e<i;e++)this.bindVertexBuffer(t+e,a,r[e].offset);return i}bindVertexBuffer(e,t,n){(this._boundVertexBuffers[e]!==t||this._boundVertexOffsets[e]!==n)&&(this._boundVertexBuffers[e]=t,this._boundVertexOffsets[e]=n,this.passEncoder.setVertexBuffer(e,t,n))}draw(e,t,n=1,r,i=!0,a=!0,o=0){if(this.shader.ready&&!this.shader.failed){let a=this.passEncoder,s=this.pipeline,c=this.vertexBuffers[0],l=this.vertexBuffers[1];if(i){if(c){let e=this.submitVertexBuffer(c,0);l&&this.submitVertexBuffer(l,e)}let n=e.type,r=c?c.format.renderingHash:0,i=l?l.format.renderingHash:0,o=Lt.stripIndexFormat(n,t?.format)??-1;(this._pipelineDirty||!s||this._pipelinePrimitiveType!==n||this._pipelineVertexHash0!==r||this._pipelineVertexHash1!==i||this._pipelineIndexFormat!==o)&&(this._pipelineDirty=!1,this._pipelinePrimitiveType=n,this._pipelineVertexHash0=r,this._pipelineVertexHash1=i,this._pipelineIndexFormat=o,s=this.renderPipeline.get(e,c?.format,l?.format,t?.format,this.shader,this.renderTarget,this.bindGroupFormats,this.blendState,this.depthState,this.cullMode,this.stencilEnabled,this.stencilFront,this.stencilBack,this.frontFace,this.alphaToCoverage),this.pipeline!==s&&(this.pipeline=s,a.setPipeline(s)))}if(t){let{buffer:e,format:n}=t.impl;(this._boundIndexBuffer!==e||this._boundIndexFormat!==n)&&(this._boundIndexBuffer=e,this._boundIndexFormat=n,a.setIndexBuffer(e,n))}if(r){let e=(r.impl?.storage??this.indirectDrawBuffer).impl.buffer,n=r.count;for(let i=0;i<n;i++){let n=(r.slotIndex+i)*nr;t?a.drawIndexedIndirect(e,n):a.drawIndirect(e,n)}}else t?a.drawIndexed(e.count,n,e.base,e.baseVertex??0,o):a.draw(e.count,n,e.base,o);this._drawCallsPerFrame++}a&&this.clearVertexBuffer()}setShader(e,t=!1){e!==this.shader&&(this.shader=e,this._pipelineDirty=!0)}setBlendState(e){this.blendState.key!==e.key&&(this._pipelineDirty=!0),this.blendState.copy(e)}setDepthState(e){this.depthState.key!==e.key&&(this._pipelineDirty=!0),this.depthState.copy(e)}setStencilState(t,n){if(t||n){let r=t??e.DEFAULT,i=n??e.DEFAULT;this.stencilEnabled&&this.stencilFront.key===r.key&&this.stencilBack.key===i.key||(this._pipelineDirty=!0),this.stencilEnabled=!0,this.stencilFront.copy(r),this.stencilBack.copy(i);let a=this.stencilFront.ref;this.stencilRef!==a&&(this.stencilRef=a,this.passEncoder.setStencilReference(a))}else this.stencilEnabled&&(this._pipelineDirty=!0),this.stencilEnabled=!1}setBlendColor(e,t,n,r){let i=this.blendColor;(e!==i.r||t!==i.g||n!==i.b||r!==i.a)&&(i.set(e,t,n,r),this.passEncoder.setBlendConstant(i))}setCullMode(e){this.cullMode!==e&&(this.cullMode=e,this._pipelineDirty=!0)}setFrontFace(e){this.frontFace!==e&&(this.frontFace=e,this._pipelineDirty=!0)}setAlphaToCoverage(e){this.alphaToCoverage!==e&&(this.alphaToCoverage=e,this._pipelineDirty=!0)}initializeContextCaches(){super.initializeContextCaches()}setupPassEncoderDefaults(){this.pipeline=null,this.stencilRef=0,this.blendColor.set(0,0,0,0),this._boundVertexBuffers.length=0,this._boundVertexOffsets.length=0,this._boundIndexBuffer=null,this._boundIndexFormat=null}_uploadDirtyTextures(){this.texturesToUpload.forEach(e=>{(e._needsUpload||e._needsMipmapsUpload)&&e.upload()}),this.texturesToUpload.clear()}setupTimeStampWrites(e,t){if(e&&(e.timestampWrites=void 0),this.gpuProfiler._enabled&&this.gpuProfiler.timestampQueriesSet){let n=this.gpuProfiler.getSlot(t);n===-1||(e??={},e.timestampWrites={querySet:this.gpuProfiler.timestampQueriesSet.querySet,beginningOfPassWriteIndex:n*2,endOfPassWriteIndex:n*2+1})}return e}startRenderPass(e){this._uploadDirtyTextures();let t=e.renderTarget||this.backBuffer;this.renderTarget=t;let n=t.impl;t!==this.backBuffer&&this.initRenderTarget(t),n.setupForRenderPass(e,t);let r=n.renderPassDescriptor;this.setupTimeStampWrites(r,e.name);let i=this.getCommandEncoder();this.passEncoder=i.beginRenderPass(r),this.passEncoder.label=`${e.name}-PassEncoder RT:${t.name}`,this.setupPassEncoderDefaults();let{width:a,height:o}=t;this.setViewport(0,0,a,o),this.setScissor(0,0,a,o),this.insideRenderPass=!0}endRenderPass(e){this.passEncoder.end(),this.passEncoder=null,this.insideRenderPass=!1,this.bindGroupFormats.length=0;let t=this.renderTarget;if(t&&t.depthBuffer&&e.depthStencilOps.resolveDepth&&e.samples>1){let e=t.depthBuffer.samples>1;if(e||t.autoResolve){let n=t.impl.depthAttachment,r=e?n?.depthTexture:n?.multisampledDepthBuffer,i=e?t.depthResolveBuffer?.impl.gpuTexture:t.depthBuffer.impl.gpuTexture;n?.transient||r&&i&&this.resolver.resolveDepth(this.commandEncoder,r,i,t.depthResolveMode)}}for(let t=0;t<e.colorArrayOps.length;t++)e.colorArrayOps[t].genMipmaps&&this.mipmapRenderer.generate(e.renderTarget._colorBuffers[t].impl)}startComputePass(e){this._uploadDirtyTextures(),this.pipeline=null;let t=this.setupTimeStampWrites(void 0,e),n=this.getCommandEncoder();this.passEncoder=n.beginComputePass(t),this.insideRenderPass=!0}endComputePass(){this.passEncoder.end(),this.passEncoder=null,this.insideRenderPass=!1,this.bindGroupFormats.length=0}computeDispatch(e,t=`Unnamed`){this.startComputePass(t);for(let t=0;t<e.length;t++){let n=e[t];n.applyParameters(),n.impl.updateBindGroup()}for(let t=0;t<e.length;t++){let n=e[t];n.impl.dispatch(n.countX,n.countY,n.countZ)}this.endComputePass()}getCommandEncoder(){let e=this.commandEncoder;return e||(e=this.wgpu.createCommandEncoder(),this.commandEncoder=e),e}endCommandEncoder(){let{commandEncoder:e}=this;if(e){let t=e.finish();this.addCommandBuffer(t),this.commandEncoder=null}}addCommandBuffer(e,t=!1){t?this.commandBuffers.unshift(e):this.commandBuffers.push(e)}submit(){this.endCommandEncoder(),this.commandBuffers.length>0&&(this.dynamicBuffers.submit(),this.meshInstanceStorage?.upload(),this.wgpu.queue.submit(this.commandBuffers),this.commandBuffers.length=0,this.submitVersion++,this.dynamicBuffers.onCommandBuffersSubmitted()),this.destroyDeferredResources()}destroyDeferredResources(){let e=this._deferredDestroys;if(e.length>0){for(let t=0;t<e.length;t++)e[t].destroy();e.length=0}}deferDestroy(e){e&&(this._destroyed?e.destroy():this._deferredDestroys.push(e))}clear(e){e.flags&&this.clearRenderer.clear(this,this.renderTarget,e,this.defaultClearOptions)}setViewport(e,t,n,r){if(this.passEncoder){if(this.xrColorTexture)return;this.renderTarget.flipY||(t=this.renderTarget.height-t-r),this.vx=e,this.vy=t,this.vw=n,this.vh=r,this.passEncoder.setViewport(e,t,n,r,0,1)}}setScissor(e,t,n,r){if(this.passEncoder){if(this.xrColorTexture)return;let i=this.renderTarget,a=i.width,o=i.height;i.flipY||(t=o-t-r);let s=Math.min(Math.max(e,0),a),c=Math.min(Math.max(t,0),o);n=Math.max(Math.min(e+n,a)-s,0),r=Math.max(Math.min(t+r,o)-c,0),e=s,t=c,this.sx=e,this.sy=t,this.sw=n,this.sh=r,this.passEncoder.setScissorRect(e,t,n,r)}}clearStorageBuffer(e,t=0,n=e.byteSize){this.getCommandEncoder().clearBuffer(e.buffer,t,n)}mapBufferAsync(e,t){return this.contextLost?Promise.resolve(!1):e.mapAsync(t).then(()=>!0,e=>!1)}readStorageBuffer(e,t=0,n=e.byteSize-t,r=null,i=!1){let a=this.createBufferImpl(9);a.allocate(this,n);let o=a.buffer;return this.getCommandEncoder().copyBufferToBuffer(e.buffer,t,o,0,n),this.readBuffer(a,n,r,i)}async readBuffer(e,t,n=null,r=!1){let i=e.buffer;try{r?this.submit():await new Promise(e=>{setTimeout(e)}),await i.mapAsync(GPUMapMode.READ),n??=new Uint8Array(t);let e=i.getMappedRange(0,t),a=n.constructor;return n.set(new a(e)),n}finally{i.unmap(),e.destroy(this)}}writeStorageBuffer(e,t=0,n,r=0,i){this.wgpu.queue.writeBuffer(e.buffer,t,n,r,i)}copyRenderTarget(e,t,n,r){let i={width:e?e.width:t.width,height:e?e.height:t.height,depthOrArrayLayers:1},a=this.getCommandEncoder();if(n){if(((e?e.colorBuffer?.samples:1)??1)!==((t?t.colorBuffer?.samples:1)??1))return!1;let n={texture:e?e.colorBuffer.impl.gpuTexture:this.backBuffer.impl.assignedColorTexture,mipLevel:e?e.mipLevel:0},r={texture:t?t.colorBuffer.impl.gpuTexture:this.backBuffer.impl.assignedColorTexture,mipLevel:t?t.mipLevel:0};a.copyTextureToTexture(n,r,i)}if(r){let n=e||this.renderTarget;if(n.impl.depthAttachment?.transient)return!1;let r=n.impl.depthAttachment,o=r.depthTexture??r.multisampledDepthBuffer,s=n.mipLevel;if(n.samples>1){let e=t?.depthBuffer?.samples>1?t.depthBuffer:null;if(e){if(e.samples!==n.samples)return!1;a.copyTextureToTexture({texture:o},{texture:e.impl.gpuTexture},i)}else{let e=t.colorBuffer.impl.gpuTexture;this.resolver.resolveDepth(a,o,e,n.depthResolveMode)}}else{let e=t?t.depthBuffer.impl.gpuTexture:this.renderTarget.impl.depthAttachment.depthTexture,n=t?t.mipLevel:this.renderTarget.mipLevel,r={texture:o,mipLevel:s},c={texture:e,mipLevel:n};a.copyTextureToTexture(r,c,i)}}return!0}get hasTranspilers(){return this.glslang&&this.twgsl}},or=class{unlock(e,t,n){}loseContext(){}},sr=class{destroy(e){}init(e,t){}loseContext(){}resolve(e,t,n,r){}},cr=class{destroy(e){}loseContext(){}restoreContext(e,t){}},lr=class{destroy(e){}propertyChanged(e){}loseContext(){}copy(e,t){return!0}},ur=class{destroy(e){}unlock(e,t,n){}loseContext(){}},dr=class{add(e,t,n,r){}},fr=class{destroy(e){}loseContext(){}unlock(e){}},pr=class{update(e){}destroy(){}},mr=class{destroy(){}},hr=class extends Xe{buffer;storageSize=0;constructor(e){super(e,0,0),this.buffer=new h(e)}alloc(e,t){this.storageSize<t&&(this.storageSize=t,this.buffer.setStorage(new ArrayBuffer(t))),e.gpuBuffer=this.buffer,e.offset=0,e.storageBuffer=this.buffer,e.storageOffset=0}},gr=class extends p{constructor(e={width:1,height:1},t={}){super(e,t),t=this.initOptions,this.isNull=!0,this._deviceType=Be,this.samples=1,this.backBuffer=new Ze({name:`Framebuffer`,graphicsDevice:this,depth:this.initOptions.depth,stencil:this.supportsStencil,samples:this.samples}),this.initDeviceCaps(),this.dynamicBuffers=new hr(this),this.postInit()}destroy(){super.destroy()}debugLoseContext(e=100){}initDeviceCaps(){this.disableParticleSystem=!0,this.precision=`highp`,this.maxPrecision=`highp`,this.maxSamples=4,this.maxTextures=16,this.maxTextureSize=4096,this.maxCubeMapSize=4096,this.maxVolumeSize=4096,this.maxColorAttachments=8,this.maxPixelRatio=1,this.maxAnisotropy=16,this.usesMeshBindGroups=!1,this.supportsAreaLights=!0,this.supportsGpuParticles=!1,this.textureFloatRenderable=!0,this.textureHalfFloatRenderable=!0,this.supportsImageBitmap=!1}postInit(){super.postInit()}frameStart(){super.frameStart()}frameEnd(){super.frameEnd()}updateBegin(){}updateEnd(){}readPixels(e,t,n,r,i){}createVertexBufferImpl(e,t){return new ur(e,t)}createIndexBufferImpl(e){return new or(e)}createShaderImpl(e){return new cr(e)}createUniformBufferImpl(e){return new fr}createBindGroupImpl(e){return new pr}createBindGroupFormatImpl(e){return new mr}setBindGroup(e,t,n){}createTextureImpl(e){return new lr(e)}createRenderTargetImpl(e){return new sr(e)}createDrawCommandImpl(e){return new dr}createUploadStreamImpl(e){return null}draw(e,t,n,r,i=!0,a=!0,o=0){}setShader(e,t=!1){}setBlendState(e){}setDepthState(e){}setStencilState(e,t){}setBlendColor(e,t,n,r){}setCullMode(e){}setFrontFace(e){}setAlphaToCoverage(e){}initializeContextCaches(){super.initializeContextCaches()}clear(e){}setViewport(e,t,n,r){}setScissor(e,t,n,r){}copyRenderTarget(e,t,n,r){return!0}};function _r(e,t={}){let n=t.deviceTypes??[];n.includes(`webgl2`)||n.push(Le);let r=[];for(let i=0;i<n.length;i++){let a=n[i];if((a===`webgpu`||a===`webgpu:bare`)&&window?.navigator?.gpu){let n=a===`webgpu:bare`?`bare`:void 0;r.push(()=>new ar(e,{...t,featureLevel:n}).initWebGpu(t.glslangUrl,t.twgslUrl))}(a===`webgl2`||a===`webgl2:bare`)&&r.push(()=>new T(e,{...t,deviceType:a})),a===`null`&&r.push(()=>new gr(e,t))}return new Promise((e,t)=>{let n=0,i=[],a=()=>{n>=r.length?t(AggregateError(i,`Failed to create a graphics device`)):new Promise(e=>{e(r[n++]())}).then(t=>{t?e(t):a()}).catch(e=>{console.log(e),i.push(e),a()})};a()})}var vr=new class{key=null;element=null;event=null;constructor(e,t){t&&(this.key=t.keyCode,this.element=t.target,this.event=t)}};function yr(e){return vr.key=e.keyCode,vr.element=e.target,vr.event=e,vr}function br(e){return typeof e==`string`?e.toUpperCase().charCodeAt(0):e}var xr={9:`Tab`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,27:`Escape`,37:`Left`,38:`Up`,39:`Right`,40:`Down`,46:`Delete`,91:`Win`},Sr=class extends qe{static EVENT_KEYDOWN=`keydown`;static EVENT_KEYUP=`keyup`;_element=null;_keymap={};_lastmap={};_keyDownHandler;_keyUpHandler;_keyPressHandler;_visibilityChangeHandler;_windowBlurHandler;preventDefault;stopPropagation;constructor(e,t={}){super(),this._keyDownHandler=this._handleKeyDown.bind(this),this._keyUpHandler=this._handleKeyUp.bind(this),this._keyPressHandler=this._handleKeyPress.bind(this),this._visibilityChangeHandler=this._handleVisibilityChange.bind(this),this._windowBlurHandler=this._handleWindowBlur.bind(this),e&&this.attach(e),this.preventDefault=t.preventDefault||!1,this.stopPropagation=t.stopPropagation||!1}attach(e){this._element&&this.detach(),this._element=e,this._element.addEventListener(`keydown`,this._keyDownHandler,!1),this._element.addEventListener(`keypress`,this._keyPressHandler,!1),this._element.addEventListener(`keyup`,this._keyUpHandler,!1),document.addEventListener(`visibilitychange`,this._visibilityChangeHandler,!1),window.addEventListener(`blur`,this._windowBlurHandler,!1)}detach(){this._element&&(this._element.removeEventListener(`keydown`,this._keyDownHandler),this._element.removeEventListener(`keypress`,this._keyPressHandler),this._element.removeEventListener(`keyup`,this._keyUpHandler),this._element=null,document.removeEventListener(`visibilitychange`,this._visibilityChangeHandler,!1),window.removeEventListener(`blur`,this._windowBlurHandler,!1),this._handleWindowBlur())}toKeyIdentifier(e){e=br(e);let t=xr[e.toString()];if(t)return t;let n=e.toString(16).toUpperCase(),r=n.length;for(let e=0;e<4-r;e++)n=`0${n}`;return`U+${n}`}_handleKeyDown(e){let t=e.keyCode||e.charCode;if(t===void 0)return;let n=this.toKeyIdentifier(t);this._keymap[n]=!0,this.fire(`keydown`,yr(e)),this.preventDefault&&e.preventDefault(),this.stopPropagation&&e.stopPropagation()}_handleKeyUp(e){let t=e.keyCode||e.charCode;if(t===void 0)return;let n=this.toKeyIdentifier(t);delete this._keymap[n],this.fire(`keyup`,yr(e)),this.preventDefault&&e.preventDefault(),this.stopPropagation&&e.stopPropagation()}_handleKeyPress(e){this.fire(`keypress`,yr(e)),this.preventDefault&&e.preventDefault(),this.stopPropagation&&e.stopPropagation()}_handleVisibilityChange(){document.visibilityState===`hidden`&&this._handleWindowBlur()}_handleWindowBlur(){this._keymap={},this._lastmap={}}update(){for(let e in this._lastmap)delete this._lastmap[e];for(let e in this._keymap)this._keymap.hasOwnProperty(e)&&(this._lastmap[e]=this._keymap[e])}isPressed(e){let t=br(e),n=this.toKeyIdentifier(t);return!!this._keymap[n]}wasPressed(e){let t=br(e),n=this.toKeyIdentifier(t);return!!this._keymap[n]&&!this._lastmap[n]}wasReleased(e){let t=br(e),n=this.toKeyIdentifier(t);return!this._keymap[n]&&!!this._lastmap[n]}};function Cr(){return!!(document.pointerLockElement||document.mozPointerLockElement||document.webkitPointerLockElement)}var wr=class e{x=0;y=0;dx=0;dy=0;button=-1;buttons;wheelDelta=0;element;ctrlKey=!1;altKey=!1;shiftKey=!1;metaKey=!1;event;constructor(t,n){let r={x:0,y:0};if(n){if(n instanceof e)throw Error(`Expected MouseEvent`);r=t._getTargetCoords(n)}else n={};if(r)this.x=r.x,this.y=r.y;else if(Cr())this.x=0,this.y=0;else return;n.type===`wheel`&&(n.deltaY>0?this.wheelDelta=1:n.deltaY<0&&(this.wheelDelta=-1)),Cr()?(this.dx=n.movementX||n.webkitMovementX||n.mozMovementX||0,this.dy=n.movementY||n.webkitMovementY||n.mozMovementY||0):t._lastPositionValid&&(this.dx=this.x-t._lastX,this.dy=this.y-t._lastY),(n.type===`mousedown`||n.type===`mouseup`)&&(this.button=n.button),this.buttons=t._buttons.slice(0),this.element=n.target,this.ctrlKey=n.ctrlKey??!1,this.altKey=n.altKey??!1,this.shiftKey=n.shiftKey??!1,this.metaKey=n.metaKey??!1,this.event=n}get wheel(){return this.wheelDelta*-2}},Tr=class extends qe{static EVENT_MOUSEMOVE=`mousemove`;static EVENT_MOUSEDOWN=`mousedown`;static EVENT_MOUSEUP=`mouseup`;static EVENT_MOUSEWHEEL=`mousewheel`;_lastX=0;_lastY=0;_lastPositionValid=!1;_buttons=[!1,!1,!1];_lastbuttons=[!1,!1,!1];_target=null;_attached=!1;_upHandler;_downHandler;_moveHandler;_wheelHandler;_contextMenuHandler;_visibilityChangeHandler;_windowBlurHandler;constructor(e){super(),this._upHandler=this._handleUp.bind(this),this._downHandler=this._handleDown.bind(this),this._moveHandler=this._handleMove.bind(this),this._wheelHandler=this._handleWheel.bind(this),this._visibilityChangeHandler=this._handleVisibilityChange.bind(this),this._windowBlurHandler=this._handleWindowBlur.bind(this),this._contextMenuHandler=e=>{e.preventDefault()},this.attach(e)}static isPointerLocked(){return Cr()}attach(e){if(this._target=e,this._attached)return;this._attached=!0;let t={passive:!1};window.addEventListener(`mouseup`,this._upHandler,t),window.addEventListener(`mousedown`,this._downHandler,t),window.addEventListener(`mousemove`,this._moveHandler,t),window.addEventListener(`wheel`,this._wheelHandler,t),document.addEventListener(`visibilitychange`,this._visibilityChangeHandler,!1),window.addEventListener(`blur`,this._windowBlurHandler,!1)}detach(){if(!this._attached)return;this._attached=!1,this._target=null;let e={passive:!1};window.removeEventListener(`mouseup`,this._upHandler,e),window.removeEventListener(`mousedown`,this._downHandler,e),window.removeEventListener(`mousemove`,this._moveHandler,e),window.removeEventListener(`wheel`,this._wheelHandler,e),document.removeEventListener(`visibilitychange`,this._visibilityChangeHandler,!1),window.removeEventListener(`blur`,this._windowBlurHandler,!1),this._handleWindowBlur()}disableContextMenu(){this._target&&this._target.addEventListener(`contextmenu`,this._contextMenuHandler)}enableContextMenu(){this._target&&this._target.removeEventListener(`contextmenu`,this._contextMenuHandler)}enablePointerLock(e,t){if(!document.body.requestPointerLock){t&&t();return}let n=()=>{e(),document.removeEventListener(`pointerlockchange`,n)},r=()=>{t(),document.removeEventListener(`pointerlockerror`,r)};e&&document.addEventListener(`pointerlockchange`,n,!1),t&&document.addEventListener(`pointerlockerror`,r,!1),document.body.requestPointerLock()}disablePointerLock(e){if(!document.exitPointerLock)return;let t=()=>{e(),document.removeEventListener(`pointerlockchange`,t)};e&&document.addEventListener(`pointerlockchange`,t,!1),document.exitPointerLock()}update(){this._lastbuttons[0]=this._buttons[0],this._lastbuttons[1]=this._buttons[1],this._lastbuttons[2]=this._buttons[2]}isPressed(e){return this._buttons[e]}wasPressed(e){return this._buttons[e]&&!this._lastbuttons[e]}wasReleased(e){return!this._buttons[e]&&this._lastbuttons[e]}_handleVisibilityChange(){document.visibilityState===`hidden`&&this._handleWindowBlur()}_handleWindowBlur(){this._buttons.fill(!1),this._lastbuttons.fill(!1),this._lastPositionValid=!1}_handleUp(e){this._buttons[e.button]=!1;let t=new wr(this,e);t.event&&this.fire(`mouseup`,t)}_handleDown(e){this._buttons[e.button]=!0;let t=new wr(this,e);t.event&&this.fire(`mousedown`,t)}_handleMove(e){let t=new wr(this,e);t.event?(this._lastX=t.x,this._lastY=t.y,this._lastPositionValid=!Cr(),this.fire(`mousemove`,t)):this._lastPositionValid=!1}_handleWheel(e){let t=new wr(this,e);t.event&&this.fire(`mousewheel`,t)}_getTargetCoords(e){let t=this._target.getBoundingClientRect(),n=Math.floor(t.left),r=Math.floor(t.top);return e.clientX<n||e.clientX>=n+this._target.clientWidth||e.clientY<r||e.clientY>=r+this._target.clientHeight?null:{x:e.clientX-n,y:e.clientY-r}}};function Er(e){let t=0,n=0,r=e.target;for(;!(r instanceof HTMLElement)&&r;)r=r.parentNode;for(;r;)t+=r.offsetLeft-r.scrollLeft,n+=r.offsetTop-r.scrollTop,r=r.offsetParent;return{x:e.pageX-t,y:e.pageY-n}}var Dr=class{id;x;y;target;touch;constructor(e){let t=Er(e);this.id=e.identifier,this.x=t.x,this.y=t.y,this.target=e.target,this.touch=e}},Or=class{element;event;touches=[];changedTouches=[];constructor(e,t){this.element=t.target,this.event=t,this.touches=Array.from(t.touches).map(e=>new Dr(e)),this.changedTouches=Array.from(t.changedTouches).map(e=>new Dr(e))}getTouchById(e,t){return t.find(t=>t.id===e)||null}},kr=class extends qe{static EVENT_TOUCHSTART=`touchstart`;static EVENT_TOUCHEND=`touchend`;static EVENT_TOUCHMOVE=`touchmove`;static EVENT_TOUCHCANCEL=`touchcancel`;_element=null;_startHandler;_endHandler;_moveHandler;_cancelHandler;constructor(e){super(),this._startHandler=this._handleTouchStart.bind(this),this._endHandler=this._handleTouchEnd.bind(this),this._moveHandler=this._handleTouchMove.bind(this),this._cancelHandler=this._handleTouchCancel.bind(this),this.attach(e)}attach(e){this._element&&this.detach(),this._element=e,this._element.addEventListener(`touchstart`,this._startHandler,!1),this._element.addEventListener(`touchend`,this._endHandler,!1),this._element.addEventListener(`touchmove`,this._moveHandler,!1),this._element.addEventListener(`touchcancel`,this._cancelHandler,!1)}detach(){this._element&&(this._element.removeEventListener(`touchstart`,this._startHandler,!1),this._element.removeEventListener(`touchend`,this._endHandler,!1),this._element.removeEventListener(`touchmove`,this._moveHandler,!1),this._element.removeEventListener(`touchcancel`,this._cancelHandler,!1)),this._element=null}_handleTouchStart(e){this.fire(`touchstart`,new Or(this,e))}_handleTouchEnd(e){this.fire(`touchend`,new Or(this,e))}_handleTouchMove(e){e.preventDefault(),this.fire(`touchmove`,new Or(this,e))}_handleTouchCancel(e){this.fire(`touchcancel`,new Or(this,e))}},Ar=class extends c{_maxSplats=0;_numSplats=0;constructor(e,n,r){let i=new t;super(e,{numSplats:n,getCenters:()=>null,calcAabb:e=>e.copy(i)},{prepareCenters:!1}),this._format=r,this._maxSplats=n,this._numSplats=n,this.streams.init(this._format,n)}set centers(e){this._centers=e}get centers(){return this._centers===null&&(this._centers=new Float32Array(this._maxSplats*3),this.centersVersion++),this._centers}get maxSplats(){return this._maxSplats}get numSplats(){return this._numSplats}update(e=this._numSplats,t=!0){this._numSplats=q.clamp(e,0,this._maxSplats),t&&this.centersVersion++}configureMaterialDefines(e){e.set(`SH_BANDS`,`0`)}configureMaterial(e,t=null,n){super.configureMaterial(e,t,n);let r=this.device.isWebGPU?e.shaderChunks.wgsl:e.shaderChunks.glsl;r.set(`gsplatContainerDeclarationsVS`,this.format.getInputDeclarations()),r.set(`gsplatDeclarationsVS`,`#include "gsplatContainerDeclVS"`),r.set(`gsplatReadVS`,this.format.getReadCode())}},jr=class{constructor(e){this.app=e,this.unitsName=`ms`,this.decimalPlaces=1,this.enabled=!0,this._pending=new Float64Array(2),this._timings=new Float64Array(2),this._updateStart=0,this._renderStart=0,e.on(`frameupdate`,this.begin,this),e.on(`framerender`,this.mark,this),e.on(`frameend`,this.end,this)}begin(){this.enabled&&(this._timings.set(this._pending),this._updateStart=$e())}mark(){this.enabled&&(this._renderStart=$e(),this._pending[0]=this._renderStart-this._updateStart)}end(){this.enabled&&(this._pending[1]=$e()-this._renderStart)}get timings(){return this._timings}destroy(){this.app.off(`frameupdate`,this.begin,this),this.app.off(`framerender`,this.mark,this),this.app.off(`frameend`,this.end,this)}},Mr=class{constructor(e){this.device=e,e.gpuProfiler&&(e.gpuProfiler.enabled=!0),this.enabled=!0,this.unitsName=`ms`,this.decimalPlaces=1,this._timings=[]}get timings(){return this._timings[0]=this.device.gpuProfiler?._frameTime??0,this._timings}},Nr=class{constructor(e,t,n=0,r=``,i=1){this.app=e,this.paths=t.map(e=>e.split(`.`)),this.values=new Float64Array(t.length),this.unitsName=r,this.decimalPlaces=n,this.multiplier=i,this.enabled=!0}get timings(){for(let e=0;e<this.paths.length;e++){let t=this.paths[e],n=this.app.stats;for(let e=0;e<t.length&&n!=null;e++)n=n instanceof Map?n.get(t[e]):n[t[e]];this.values[e]=(n??0)*this.multiplier}return this.values}},Pr=class{constructor(e,t,n,r,i){this.name=e,this.label=e===`DrawCalls`?`Draw calls`:e,this.timer=i,this.watermark=n??100,this.enabled=!1,this.textRefreshRate=r,this.avgTotal=0,this.avgTimer=0,this.avgCount=0,this.maxValue=0,this.timingText=`—`,this.maxText=`—`,this.texture=null,this.yOffset=0,this.cursor=0,this.needsClear=!0,this.quad=-1,this.renderWidth=0,this.parent=null,this.group=0,this.headerOnly=!1,this.countOnly=!1,this.count=0,this.historyRange=0,this.headerTop=0,this.headerBottom=0,this.lastNonZeroFrame=0,this.statName=``}destroy(){typeof this.timer.destroy==`function`&&this.timer.destroy()}loseContext(){typeof this.timer.loseContext==`function`&&this.timer.loseContext()}update(e,t){if(this.headerOnly)return 0;if(this.countOnly)return t&&this.enabled&&this.updateHistory(this.count,t),0;let n=this.timer.timings,r=0;for(let e=0;e<n.length;e++)r+=n[e];Number.isFinite(r)||(r=0),this.avgTotal+=r,this.avgTimer+=e,this.avgCount++,this.maxValue=Math.max(this.maxValue,r);let i=0;if(this.avgTimer>=this.textRefreshRate){let e=(this.avgTotal/this.avgCount).toFixed(this.timer.decimalPlaces),t=this.maxValue.toFixed(this.timer.decimalPlaces);i=(this.timingText===e?0:1)|(this.maxText===t?0:2),this.timingText=e,this.maxText=t,this.avgTotal=0,this.avgTimer=0,this.avgCount=0,this.maxValue=0}return t&&this.enabled&&this.updateHistory(r,t),i}updateHistory(e,t){let n=this.texture.width,r=this.yOffset*n*4,i=this.countOnly?Math.max(16,this.historyRange,e>this.historyRange?2**Math.ceil(Math.log2(e)):0):1.5*(this.watermark>0?this.watermark:100);if(this.needsClear)t.fill(0,r,r+n*4),this.needsClear=!1;else if(this.countOnly&&i>this.historyRange){let e=this.historyRange/i;for(let i=r;i<r+n*4;i+=4)t[i]=Math.round(t[i]*e)}this.historyRange=i;let a=r+this.cursor*4;t[a]=Math.min(255,Math.max(0,Math.round(e/i*255))),t[a+3]=this.countOnly?255:170,this.cursor=(this.cursor+1)%n}},Fr=class{constructor(e,t){let n=document.createElement(`canvas`),r=n.getContext(`2d`,{alpha:!0}),i=[`400 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,`600 28px "SFMono-Regular", Consolas, "Liberation Mono", monospace`],a=new Set(t);for(let e of t)for(let t of e)a.add(t);for(let e=32;e<127;e++)a.add(String.fromCharCode(e));a.add(`…`),a.add(`—`);let o=1024,s=2,c=2,l=0;this.placements=[new Map,new Map];for(let e=0;e<i.length;e++){r.font=i[e];for(let t of a){let n=r.measureText(t),i=Math.floor(-n.actualBoundingBoxLeft),a=Math.ceil(n.actualBoundingBoxRight),u=Math.ceil(n.actualBoundingBoxAscent),d=Math.ceil(n.actualBoundingBoxDescent),f=a-i+4,p=u+d+4;f>1020||(s+f+2>o&&(s=2,c+=l+2,l=0),this.placements[e].set(t,{x:s,y:c,w:f,h:p,left:i,ascent:u,offsetX:(i-2)/2,offsetY:(-d-2)/2,advance:n.width/2}),s+=f+2,l=Math.max(l,p))}}n.width=o,n.height=q.nextPowerOfTwo(c+l+2),r.fillStyle=`#fff`,r.textBaseline=`alphabetic`;for(let e=0;e<i.length;e++){r.font=i[e];for(let[t,n]of this.placements[e])r.fillText(t,n.x+2-n.left,n.y+2+n.ascent)}this.texture=new H(e,{name:`mini-stats-word-atlas`,width:n.width,height:n.height,mipmaps:!1,minFilter:1,magFilter:1,levels:[r.getImageData(0,0,n.width,n.height).data]})}destroy(){this.texture.destroy()}measure(e,t=0){let n=this.placements[t],r=n.get(e);if(r)return r.advance;let i=0;for(let t=0;t<e.length;t++)i+=(n.get(e[t])??n.get(`?`)).advance;return i}render(e,t,n,r,i=0,a=4294967295,o=1/0){let s=this.measure(t,i);if(o<=0)return 0;let c=this.placements[i].get(`…`),l=s>o,u=l?Math.max(0,o-c.advance):s;return this.renderText(e,t,n,r,i,a,u),l&&this.renderText(e,`…`,n+u,r,i,a,c.advance),Math.min(s,o)}renderText(e,t,n,r,i,a,o){let s=this.placements[i],c=s.get(t),l=0,u=c?1:t.length;for(let i=0;i<u&&l<o;i++){let u=c??s.get(t[i])??s.get(`?`),d=Math.min(u.w/2,o-l-u.offsetX);e.quad(n+l+u.offsetX,r+u.offsetY,d,u.h/2,u.x,this.texture.height-u.y-u.h,d*2,u.h,this.texture,1,a),l+=u.advance}}},Ir=`
	attribute vec3 vertex_position;
	attribute vec4 vertex_texCoord0;
	attribute vec4 vertex_color;
	varying vec4 uv0;
	varying vec4 color;
	varying float mode;
	void main(void) {
		gl_Position = vec4(vertex_position.xy * 2.0 - 1.0, 0.5, 1.0);
		uv0 = vertex_texCoord0;
		color = vertex_color;
		mode = vertex_position.z;
	}
`,Lr=`
	attribute vertex_position: vec3f;
	attribute vertex_texCoord0: vec4f;
	attribute vertex_color: vec4f;
	varying uv0: vec4f;
	varying color: vec4f;
	varying mode: f32;
	@vertex fn vertexMain(input: VertexInput) -> VertexOutput {
		var output: VertexOutput;
		output.position = vec4f(input.vertex_position.xy * 2.0 - 1.0, 0.5, 1.0);
		output.uv0 = input.vertex_texCoord0;
		output.color = input.vertex_color;
		output.mode = input.vertex_position.z;
		return output;
	}
`,Rr=`
	varying vec4 uv0;
	varying vec4 color;
	varying float mode;
	uniform vec4 clr;
	uniform sampler2D graphTex;
	uniform sampler2D wordsTex;
	void main(void) {
		float alpha = 1.0;
		if (mode > 1.5) {
			vec4 sampleValue = texture2D(graphTex, uv0.xy);
			float fill = step(uv0.w, sampleValue.r) * 0.18;
			float edge = (1.0 - step(uv0.z, abs(uv0.w - sampleValue.r))) * 0.60;
			float budget = (1.0 - step(uv0.z * 0.5, abs(uv0.w - sampleValue.a))) * 0.16;
			alpha = max(fill, max(edge, budget)) * step(0.001, sampleValue.a);
		} else if (mode > 0.5) {
			alpha = texture2D(wordsTex, vec2(uv0.x, 1.0 - uv0.y)).a;
		}
		gl_FragColor = vec4(color.rgb, color.a * alpha) * clr;
	}
`,zr=`
	varying uv0: vec4f;
	varying color: vec4f;
	varying mode: f32;
	uniform clr: vec4f;
	var graphTex: texture_2d<f32>;
	var graphTex_sampler: sampler;
	var wordsTex: texture_2d<f32>;
	var wordsTex_sampler: sampler;
	@fragment fn fragmentMain(input: FragmentInput) -> FragmentOutput {
		var alpha = 1.0;
		if (input.mode > 1.5) {
			let sampleValue = textureSampleLevel(graphTex, graphTex_sampler, input.uv0.xy, 0.0);
			let fill = step(input.uv0.w, sampleValue.r) * 0.18;
			let edge = (1.0 - step(input.uv0.z, abs(input.uv0.w - sampleValue.r))) * 0.60;
			let budget = (1.0 - step(input.uv0.z * 0.5, abs(input.uv0.w - sampleValue.a))) * 0.16;
			alpha = max(fill, max(edge, budget)) * step(0.001, sampleValue.a);
		} else if (input.mode > 0.5) {
			alpha = textureSampleLevel(wordsTex, wordsTex_sampler, vec2f(input.uv0.x, 1.0 - input.uv0.y), 0.0).a;
		}
		var output: FragmentOutput;
		output.color = vec4f(input.color.rgb, input.color.a * alpha) * uniform.clr;
		return output;
	}
`,Br=class{constructor(e,t=128){this.device=e,this.format=new k(e,[{semantic:U,components:3,type:6},{semantic:We,components:4,type:6},{semantic:Ke,components:4,type:1,normalize:!0}]),this.mesh=new re(e),this.prim={type:4,indexed:!0,base:0,baseVertex:0,count:0},this.mesh.primitive=[this.prim],this.quads=0,this.dirty=!0,this.resize(t),this.material=new v({uniqueName:`MiniStats`,vertexGLSL:Ir,fragmentGLSL:Rr,vertexWGSL:Lr,fragmentWGSL:zr,attributes:{vertex_position:U,vertex_texCoord0:We,vertex_color:Ke}}),this.material.cull=0,this.material.depthState=he.NODEPTH,this.material.blendState=new Ae(!0,0,6,8,0,1,8),this.material.update(),this.meshInstance=new z(this.mesh,this.material,new pe(`MiniStatsMesh`)),this.meshInstance.cull=!1,this.meshInstance.castShadow=!1,this.meshInstance.shaderPassMask=0,this.meshInstance.drawOrder=1/0,this.meshInstances=[this.meshInstance],this.layer=null,this.rendered=!1,this.clr=new Float32Array(4),this.material.setParameter(`clr`,this.clr),this.targetWidth=1,this.targetHeight=1,this.setClip(0,0,1/0,1/0)}resize(e){let t=new Float32Array(e*32);this.data&&(t.set(this.data),this.buffer.destroy(),this.indexBuffer.destroy());let n=new Uint16Array(e*6);for(let t=0;t<e;t++){let e=t*6,r=t*4;n[e]=r,n[e+1]=r+1,n[e+2]=r+2,n[e+3]=r,n[e+4]=r+2,n[e+5]=r+3}this.maxQuads=e,this.data=t,this.colors=new Uint32Array(t.buffer),this.buffer=new d(this.device,this.format,e*4,{usage:2}),this.indexBuffer=new f(this.device,1,e*6,0,n),this.mesh.vertexBuffer=this.buffer,this.mesh.indexBuffer[0]=this.indexBuffer,this.dirty=!0}destroy(){this.setLayer(null),this.meshInstance.destroy(),this.material.destroy()}setClip(e,t,n,r){this.clipLeft=e,this.clipBottom=t,this.clipRight=e+n,this.clipTop=t+r}quad(e,t,n,r,i,a,o,s,c,l=0,u=4294967295){let d=Math.max(e,this.clipLeft),f=Math.max(t,this.clipBottom),p=Math.min(e+n,this.clipRight),m=Math.min(t+r,this.clipTop);if(p<=d||m<=f)return-1;if(this.quads===this.maxQuads){if(this.maxQuads>=8192)return-1;this.resize(this.maxQuads*2)}let h=c?.width??1,g=c?.height??1,_=(i+(d-e)/n*o)/h,v=(i+(p-e)/n*o)/h,y=(a+(f-t)/r*s)/g,b=(a+(m-t)/r*s)/g,x=(f-t)/r,S=(m-t)/r,C=this.data,w=this.colors,T=this.quads*32;for(let e=0;e<4;e++){let t=e===1||e===2,n=e>=2;C[T]=(t?p:d)/this.targetWidth,C[T+1]=(n?m:f)/this.targetHeight,C[T+2]=l,C[T+3]=t?v:_,C[T+4]=n?b:y,C[T+5]=1/r,C[T+6]=n?S:x,w[T+7]=u,T+=8}return this.prim.count+=6,this.dirty=!0,this.quads++}rect(e,t,n,r,i){this.quad(e,t,n,r,0,0,0,0,null,0,i)}graph(e,t,n,r,i,a){e.quad=this.quad(t,n,r,i,e.cursor-r,e.yOffset+.5,r,0,e.texture,2,a),e.renderWidth=r}graphCursor(e){if(e.quad<0)return;let t=e.quad*32+3,n=(e.cursor-e.renderWidth)/e.texture.width,r=e.cursor/e.texture.width;this.data[t]=n,this.data[t+8]=r,this.data[t+16]=r,this.data[t+24]=n,this.dirty=!0}startFrame(){this.quads=0,this.prim.count=0}setLayer(e){this.layer!==e&&(this.meshInstance.shaderPassMask=0,this.layer?.removeMeshInstances(this.meshInstances),this.layer=e,e?.addMeshInstances(this.meshInstances))}frameUpdate(){this.rendered=!1,this.meshInstance.shaderPassMask=0}onPreRenderLayer(e,t,n){!this.rendered&&this.prim.count>0&&t===this.layer&&n===this.meshInstance.transparent&&(this.meshInstance.shaderPassMask=4294967295,this.rendered=!0)}onPostRenderLayer(){this.meshInstance.shaderPassMask=0}render(e,t,n,r){this.dirty&&=(this.buffer.setData(this.data.buffer),!1),this.clr.set(r),this.material.setParameter(`graphTex`,t),this.material.setParameter(`wordsTex`,n),this.setLayer(e)}},Vr={scriptUpdate:`Script update`,scriptPostUpdate:`Script post-update`,animUpdate:`Animation`,physicsTime:`Physics`,renderTime:`Render`,gsplatSort:`Splat sort`},Hr={tex:`Textures`,geom:`Geometry`,buffers:`Buffers`},Ur=[`renderTime`,`scriptUpdate`,`scriptPostUpdate`,`animUpdate`,`physicsTime`,`gsplatSort`],Wr=[`tex`,`geom`,`buffers`],Gr=4280490773,Kr=4281805602,qr=4283317552,Jr=4294637042,Yr=4291344557,Xr=[4285379033,4294424708,4290171245,4292714680,4285379033,4291344557,4288991152],Zr=e=>e.headerOnly?0:e.name===`DrawCalls`?1:e.name===`Frame`?2:3,Qr=e=>e.group===5?0:e.group===4?1:e.group+1,$r=(e,t)=>Qr(e)-Qr(t)||Zr(e)-Zr(t),ei=class e{constructor(t,n=e.getDefaultOptions()){this.app=t,this.device=t.graphicsDevice,this.sizes=n.sizes.map(e=>({...e})),this.graphs=[],this.graphRows=new Map,this.freeRows=[],this.nextRowIndex=0,this.gpuPassGraphs=new Map,this.cpuGraphs=new Map,this.vramGraphs=new Map,this.collapsedGroups=new Set,(n.resourcesCollapsed??!0)&&this.collapsedGroups.add(6),this._resourcesEnabled=n.resourcesEnabled??!0,this._resourceElapsed=1/0,this._resourceCounts=new Map,this._resourceGraphs=new Map,this.gpuTimingMinSize=n.gpuTimingMinSize??1,this.cpuTimingMinSize=n.cpuTimingMinSize??1,this.vramTimingMinSize=n.vramTimingMinSize??1,this.textRefreshRate=n.textRefreshRate,this._averageLabel=`Avg (${this.textRefreshRate/1e3}s)`,this.frameIndex=0,this._enabled=!0,this._showGraphs=!1,this._destroyed=!1,this._geometryDirty=!0,this._layoutDirty=!0,this._clientWidth=-1,this._clientHeight=-1,this._scroll=0,this._maxScroll=0,this._overallHeight=0,this.clr=[1,1,1,.95],this.initGraphs(t,this.device,n);let r=[`Metric`,this._averageLabel,`Peak`,`Count`,`ms`,`MB`];for(let e of this.graphs)r.push(e.label,e.timer.unitsName||``);r.push(...Object.values(Vr),...Object.values(Hr)),this.wordAtlas=new Fr(this.device,r),this.render2d=new Br(this.device),this.drawLayer=t.scene.layers.getLayerById(4);let i=document.createElement(`div`);i.id=`mini-stats`,i.style.cssText=`position:fixed;background:transparent;cursor:pointer;touch-action:none;user-select:none;`,i.setAttribute(`role`,`button`),i.tabIndex=0,i.title=`Click a category to expand or collapse it. Click elsewhere to change size. Scroll or drag to view more metrics.`,document.body.appendChild(i),this.div=i;let a=!1,o=0,s=0,c=0;i.addEventListener(`mouseenter`,()=>{this.opacity=1}),i.addEventListener(`mouseleave`,()=>{this.opacity=.95}),i.addEventListener(`click`,e=>{e.preventDefault(),this._enabled&&!a&&this.handleClick(e),a=!1}),i.addEventListener(`keydown`,e=>{this._enabled&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.activeSizeIndex=(this.activeSizeIndex+1)%this.sizes.length)}),i.addEventListener(`wheel`,e=>{if(this._maxScroll>0){e.preventDefault(),a=!0;let t=e.deltaMode===1?this.height:e.deltaMode===2?this._panelHeight:1;this.scroll(e.deltaY*t)}},{passive:!1}),i.addEventListener(`pointerdown`,e=>{a=!1,s=e.clientX,c=o=e.clientY,e.pointerType!==`mouse`&&i.setPointerCapture(e.pointerId)}),i.addEventListener(`pointermove`,e=>{e.buttons&&(a||=Math.abs(e.clientY-c)>5||Math.abs(e.clientX-s)>5,a&&e.pointerType!==`mouse`&&this._maxScroll>0&&this.scroll(o-e.clientY),o=e.clientY)}),i.addEventListener(`pointercancel`,()=>{a=!0}),this.device.on(`resizecanvas`,this.updateDiv,this),this.device.on(`losecontext`,this.loseContext,this),t.on(`frameupdate`,this.update,this),t.on(`prerender`,this.render2d.frameUpdate,this.render2d),t.scene.on(`prerender:layer`,this.render2d.onPreRenderLayer,this.render2d),t.scene.on(`postrender:layer`,this.render2d.onPostRenderLayer,this.render2d),t.on(`postrender`,this.postRender,this),t.on(`destroy`,this.destroy,this),this.activeSizeIndex=n.startSizeIndex}destroy(){if(!this._destroyed){this._destroyed=!0,this.device.off(`resizecanvas`,this.updateDiv,this),this.device.off(`losecontext`,this.loseContext,this),this.app.off(`frameupdate`,this.update,this),this.app.off(`prerender`,this.render2d.frameUpdate,this.render2d),this.app.scene.off(`prerender:layer`,this.render2d.onPreRenderLayer,this.render2d),this.app.scene.off(`postrender:layer`,this.render2d.onPostRenderLayer,this.render2d),this.app.off(`postrender`,this.postRender,this),this.app.off(`destroy`,this.destroy,this);for(let e=0;e<this.graphs.length;e++)this.graphs[e].destroy();this.gpuPassGraphs.clear(),this.cpuGraphs.clear(),this.vramGraphs.clear(),this._resourceGraphs.clear(),this._resourceCounts.clear(),this.graphRows.clear(),this.wordAtlas.destroy(),this.texture.destroy(),this.render2d.destroy(),this.div.remove()}}static statPresets={gsplats:[{name:`GSplats`,stats:[`frame.gsplats`],decimalPlaces:3,multiplier:1/1e6,unitsName:`M`,watermark:10}],gsplatsCopy:[{name:`GsplatsCopy`,stats:[`frame.gsplatBufferCopy`],decimalPlaces:1,multiplier:1,unitsName:`%`,watermark:100}]};static getDefaultOptions(t=[]){let n={sizes:[{width:128,height:22,spacing:0,graphs:!1,detailed:!1,peak:!1},{width:176,height:20,spacing:0,graphs:!1,detailed:!0,peak:!1},{width:224,height:22,spacing:0,graphs:!0,detailed:!0,peak:!0}],startSizeIndex:0,textRefreshRate:500,resourcesEnabled:!0,resourcesCollapsed:!0,cpu:{enabled:!0,watermark:33},gpu:{enabled:!0,watermark:33},stats:[{name:`DrawCalls`,stats:[`drawCalls.total`],watermark:1e3},{name:`Frame`,stats:[`frame.ms`],decimalPlaces:1,unitsName:`ms`,watermark:33},{name:`VRAM`,stats:[`vram.totalUsed`],decimalPlaces:1,multiplier:1/1048576,unitsName:`MB`,watermark:1024}],gpuTimingMinSize:1,cpuTimingMinSize:1,vramTimingMinSize:1};for(let r of t)n.stats.push(...e.statPresets[r]??[]);return n}set activeSizeIndex(e){let t=this.sizes[e];t&&(this._activeSizeIndex=e,this._resourceElapsed=1/0,this._detailed=t.detailed??(e>0||t.graphs),this._showPeak=this._detailed&&(t.peak??t.graphs),this.gspacing=t.spacing,this._scroll=0,(!this._detailed||e<this.gpuTimingMinSize)&&this.clearSubGraphs(this.gpuPassGraphs),(!this._detailed||e<this.cpuTimingMinSize)&&this.clearSubGraphs(this.cpuGraphs),(!this._detailed||e<this.vramTimingMinSize)&&this.clearSubGraphs(this.vramGraphs),this.resize(t.width,t.height,t.graphs),this.div.setAttribute(`aria-label`,this._detailed?t.graphs?`MiniStats: averages, peaks and history. Change size.`:`MiniStats: grouped averages. Change size.`:`MiniStats: compact counters. Change size.`))}get activeSizeIndex(){return this._activeSizeIndex}set opacity(e){this.clr[3]=e}get opacity(){return this.clr[3]}get overallHeight(){return this._overallHeight}set enabled(e){if(e!==this._enabled){this._enabled=e,this._resourceElapsed=1/0;for(let t=0;t<this.graphs.length;t++)this.graphs[t].enabled=e&&this._showGraphs,this.graphs[t].timer.enabled=e;this.div.style.display=e?`block`:`none`,e||this.render2d.setLayer(null)}}get enabled(){return this._enabled}set resourcesEnabled(e){this._resourcesEnabled!==e&&(this._resourcesEnabled=e,this._resourceElapsed=1/0,this.updateDiv())}get resourcesEnabled(){return this._resourcesEnabled}set resourcesCollapsed(e){this.setGroupCollapsed(6,e)}get resourcesCollapsed(){return this.collapsedGroups.has(6)}set engineCollapsed(e){this.setGroupCollapsed(5,e)}get engineCollapsed(){return this.collapsedGroups.has(5)}set userCollapsed(e){this.setGroupCollapsed(4,e)}get userCollapsed(){return this.collapsedGroups.has(4)}set cpuCollapsed(e){this.setGroupCollapsed(1,e)}get cpuCollapsed(){return this.collapsedGroups.has(1)}set gpuCollapsed(e){this.setGroupCollapsed(2,e)}get gpuCollapsed(){return this.collapsedGroups.has(2)}set vramCollapsed(e){this.setGroupCollapsed(3,e)}get vramCollapsed(){return this.collapsedGroups.has(3)}setGroupCollapsed(e,t){this.collapsedGroups.has(e)!==t&&(e===6&&(this._resourceElapsed=1/0),t?this.collapsedGroups.add(e):this.collapsedGroups.delete(e),this.updateDiv())}handleClick(e){if(this._detailed){let t=this.div.getBoundingClientRect().bottom-e.clientY+8;for(let e of this.graphs)if(t>=e.headerBottom&&t<e.headerTop){this.setGroupCollapsed(e.group,!this.collapsedGroups.has(e.group));return}}this.activeSizeIndex=(this.activeSizeIndex+1)%this.sizes.length}initGraphs(e,t,n){n.cpu.enabled&&(this.cpuGraph=new Pr(`CPU`,e,n.cpu.watermark,n.textRefreshRate,new jr(e)),this.cpuGraph.group=1,this.graphs.push(this.cpuGraph)),n.gpu.enabled&&(this.gpuGraph=new Pr(`GPU`,e,n.gpu.watermark,n.textRefreshRate,new Mr(t)),this.gpuGraph.group=2,this.graphs.push(this.gpuGraph));let r=new Map;for(let t of n.stats??[]){let i=new Nr(e,t.stats,t.decimalPlaces,t.unitsName,t.multiplier),a=new Pr(t.name,e,t.watermark,n.textRefreshRate,i);if(t.name===`VRAM`)a.group=3,this.vramGraph=a;else{let i=t.stats.length>0&&t.stats.every(e=>e.startsWith(`user.`)),o=i?`User`:`Engine`,s=r.get(o);s||(s=new Pr(o,e,0,n.textRefreshRate,new Nr(e,[])),s.group=i?4:5,s.headerOnly=!0,r.set(o,s),this.graphs.push(s)),a.group=s.group,a.parent=s}this.graphs.push(a)}let i=new Pr(`Resources`,e,0,n.textRefreshRate,new Nr(e,[]));i.group=6,i.headerOnly=!0,i.countOnly=!0,this._resourceGraph=i,this.graphs.push(i);let a=new Map([[`vertexBuffers`,`Vertex buffers`],[`indexBuffers`,`Index buffers`],[`uniformBuffers`,`Uniform buffers`],[`textures`,`Textures`],[`renderTargets`,`Render targets`]]);t.isWebGL2&&a.set(`shaders`,`Shaders`),t.isWebGPU&&(a.set(`storageBuffers`,`Storage buffers`),a.set(`computes`,`Computes`),a.set(`bindGroups`,`Bind groups`),a.set(`bindGroupFormats`,`Bind group formats`),a.set(`drawCommands`,`Draw commands`),a.set(`renderPipelines`,`Render pipelines`),a.set(`computePipelines`,`Compute pipelines`));for(let[t,r]of a){let a=new Pr(r,e,0,n.textRefreshRate,new Nr(e,[]));a.group=i.group,a.parent=i,a.countOnly=!0,this._resourceGraphs.set(t,a),this.graphs.push(a)}this.graphs.sort($r),this.texture=new H(t,{name:`mini-stats-graph-texture`,width:1,height:1,mipmaps:!1,minFilter:1,magFilter:1,addressU:0,addressV:0});for(let e of this.graphs)e.texture=this.texture,e.headerOnly||this.allocateRow(e)}resize(e,t,n){this.width=e,this.height=t,this._showGraphs=n;for(let e=0;e<this.graphs.length;e++)this.graphs[e].enabled=this._enabled&&n;this.updateDiv()}isGraphVisible(e){return e.countOnly&&(!this._resourcesEnabled||!this._detailed)?!1:this._detailed?!e.parent||!this.collapsedGroups.has(e.group):!e.headerOnly}updateDiv(){let e=this.device.canvas.getBoundingClientRect();this.render2d.targetWidth=e.width,this.render2d.targetHeight=e.height;let t=this._detailed?31:8,n=-1,r=0;for(let e=0;e<this.graphs.length;e++){let i=this.graphs[e];if(!this.isGraphVisible(i))continue;let a=i.group;this._detailed&&r>0&&a!==n&&(t+=5),t+=this.height+(r?this.gspacing:0),r++,n=a}this._overallHeight=t,this._panelWidth=Math.max(0,Math.min(this.width,e.width-16)),this._panelHeight=Math.max(0,Math.min(t,e.height-16)),this._maxScroll=Math.max(0,t-this._panelHeight),this._scroll=Math.min(this._scroll,this._maxScroll),this.div.style.left=`${e.left+8}px`,this.div.style.bottom=`${window.innerHeight-e.bottom+8}px`,this.div.style.width=`${this._panelWidth}px`,this.div.style.height=`${this._panelHeight}px`,this._layoutDirty=!1,this._geometryDirty=!0}scroll(e){let t=q.clamp(this._scroll+e,0,this._maxScroll);t!==this._scroll&&(this._scroll=t,this._geometryDirty=!0)}update(e){if(!this._enabled)return;if(this._resourcesEnabled&&this._detailed&&(this._resourceElapsed+=e,this._resourceElapsed>=this.textRefreshRate)){this._resourceElapsed=0,this.device.getResourceCounts(this._resourceCounts);let e=0;for(let[t,n]of this._resourceGraphs){let r=this._resourceCounts.get(t)??0;n.count=r,e+=r;let i=String(r);n.timingText!==i&&(n.timingText=i,this._geometryDirty=!0)}let t=String(e);this._resourceGraph.timingText!==t&&(this._resourceGraph.timingText=t,this._geometryDirty=!0)}let t=this._showGraphs?this.texture.lock():null;for(let n=0;n<this.graphs.length;n++){let r=this.graphs[n];(!r.countOnly||this._resourcesEnabled&&this._detailed)&&r.update(e,t)&(this._showPeak?3:1)&&(this._geometryDirty=!0)}t&&this.texture.unlock()}render(){let{width:e,height:t}=this.device.clientRect;if((e!==this._clientWidth||t!==this._clientHeight)&&(this._clientWidth=e,this._clientHeight=t,this._layoutDirty=!0),this._layoutDirty&&this.updateDiv(),this._geometryDirty)this.rebuildGeometry(),this._geometryDirty=!1;else if(this._showGraphs)for(let e=0;e<this.graphs.length;e++)this.render2d.graphCursor(this.graphs[e]);this.render2d.render(this.drawLayer,this.texture,this.wordAtlas.texture,this.clr)}rebuildGeometry(){let e=this.render2d,t=this.wordAtlas,n=this._panelWidth,r=8+this._panelHeight,i=8+n-10,a=i-(this._showPeak?44:0);e.startFrame(),e.setClip(8,8,n,this._panelHeight),e.rect(8,8,n,this._panelHeight,Gr);let o=r-4;if(this._detailed){let s=r-16;t.render(e,`Metric`,18,s,0,Yr),t.render(e,this._averageLabel,a-t.measure(this._averageLabel),s,0,Yr),this._showPeak&&t.render(e,`Peak`,i-t.measure(`Peak`),s,0,Yr),e.rect(8,r-23,n,1,qr),o=r-27,e.setClip(8,8,n,this._panelHeight-23)}let s=-1,c=o;e.setClip(8,8,n,Math.max(0,o-8)),o+=this._scroll;for(let l=0;l<this.graphs.length;l++){let u=this.graphs[l];if(u.quad=-1,u.headerTop=u.headerBottom=0,!this.isGraphVisible(u))continue;this._detailed&&l>0&&u.group!==s&&(o-=5);let d=o-this.height;if(d<r&&o>8){let r=this._detailed&&u.group>0&&!u.parent,s=Xr[u.group];r&&(u.headerTop=Math.min(o,c),u.headerBottom=Math.max(d,8),e.rect(8,d,n,this.height,Kr),e.rect(8,d+5,2,this.height-10,s)),this._showGraphs&&!u.headerOnly&&e.graph(u,8,d,n,this.height,s);let l=Math.round(d+(this.height-14)/2+3),f=u.timer.unitsName||``,p=this._detailed&&f&&(!u.parent||u.parent.headerOnly),m=!u.headerOnly||u.countOnly&&this.resourcesCollapsed,h=m?t.measure(u.timingText,1):0,g=u.countOnly?i:a;if(r&&u.countOnly&&!this.resourcesCollapsed&&t.render(e,`Count`,i-t.measure(`Count`),l,0,Yr),!this._detailed&&f){let n=t.measure(f);t.render(e,f,i-n,l,0,Yr),g-=n+4}let _=m?Math.max(18,g-h):i;if(m&&t.render(e,u.timingText,_,l,1,Jr,g-_),this._showPeak&&!u.headerOnly&&!u.countOnly){let n=t.measure(u.maxText);t.render(e,u.maxText,i-Math.min(n,40),l,0,Yr,40)}let v=18+(this._detailed&&u.parent?5:0),y=+!!r,b=t.render(e,u.label,v,l,y,r?Jr:Yr,_-v-8-(p?t.measure(f)+4:0));p&&t.render(e,f,v+b+4,l,0,Yr,_-v-b-8)}o=d-this.gspacing,s=u.group}}loseContext(){for(let e=0;e<this.graphs.length;e++)this.graphs[e].loseContext();this.render2d.dirty=!0}allocateRow(e){let t=this.freeRows.length?this.freeRows.pop():this.nextRowIndex++;return this.ensureTextureHeight(this.nextRowIndex),this.graphRows.set(e,t),e.yOffset=t,e.needsClear=!0,t}ensureTextureHeight(e){let t=1;for(let e=0;e<this.sizes.length;e++)t=Math.max(t,this.sizes[e].width);let n=q.nextPowerOfTwo(t),r=q.nextPowerOfTwo(Math.max(1,e));if(n>this.texture.width||r>this.texture.height){let e=this.texture.width,t=this.texture.height,i=this.texture.lock();this.texture.unlock(),this.texture.resize(Math.max(n,e),Math.max(r,t));let a=this.texture.lock();for(let n=0;n<t;n++)a.set(i.subarray(n*e*4,(n+1)*e*4),n*this.texture.width*4);this.texture.unlock(),this._geometryDirty=!0}}removeGraph(e){let t=this.graphs.indexOf(e);t!==-1&&this.graphs.splice(t,1),this.freeRows.push(this.graphRows.get(e)),this.graphRows.delete(e),e.destroy(),this._layoutDirty=!0}clearSubGraphs(e){e.forEach(this.removeGraph,this),e.clear()}updateSubStat(e,t,n,r,i,a){if(!t)return;let o=e.get(n);if(!o){if(a&&!(r>0))return;let s=i===`vram`?`MB`:`ms`,c=new Nr(this.app,[n],1,s,i===`vram`?1/1048576:1);c.paths[0]=[i,n],o=new Pr(n,this.app,t.watermark,this.textRefreshRate,c),o.label=i===`frame`?Vr[n]:i===`vram`?Hr[n]:n,o.parent=t,o.group=t.group,o.statName=n,o.texture=this.texture,o.enabled=this._showGraphs,this.allocateRow(o);let l=this.graphs.indexOf(t)+1;for(;l<this.graphs.length&&this.graphs[l].parent===t;)l++;this.graphs.splice(l,0,o),e.set(n,o),this._layoutDirty=!0}o.watermark=t.watermark,r>0&&(o.lastNonZeroFrame=this.frameIndex)}updateGpuPass(e,t){this.updateSubStat(this.gpuPassGraphs,this.gpuGraph,t,e,`gpu`,!0)}postRender(){if(this._enabled){if(this.frameIndex++,this._detailed){if(this.gpuGraph&&this.activeSizeIndex>=this.gpuTimingMinSize){this.app.stats.gpu?.forEach(this.updateGpuPass,this);for(let e=this.graphs.length-1;e>=0;e--){let t=this.graphs[e];t.parent===this.gpuGraph&&this.frameIndex-t.lastNonZeroFrame>240&&(this.gpuPassGraphs.delete(t.statName),this.removeGraph(t))}}if(this.cpuGraph&&this.activeSizeIndex>=this.cpuTimingMinSize){let e=this.app.stats.frame;for(let t=0;t<Ur.length;t++){let n=Ur[t];this.updateSubStat(this.cpuGraphs,this.cpuGraph,n,e[n],`frame`,t>=3)}}if(this.vramGraph&&this.activeSizeIndex>=this.vramTimingMinSize){let e=this.app.stats.vram,t=this.device.isWebGPU?3:2;for(let n=0;n<t;n++){let t=Wr[n];this.updateSubStat(this.vramGraphs,this.vramGraph,t,e[t],`vram`,!1)}}}this.render()}}},ti=`none`,ni=`lighting`,ri=`
uniform sampler2D sourceTexture;
uniform vec2 sourceInvResolution;
varying vec2 uv0;
#ifdef PREMULTIPLY
	uniform sampler2D premultiplyTexture;
#endif
#ifdef PREFILTER
	uniform vec2 prefilterThresholdKnee;
#endif
void main()
{
	vec3 e = texture2D (sourceTexture, uv0).rgb;
	#ifdef BOXFILTER
		vec3 value = e;
		#ifdef PREMULTIPLY
			float premultiply = texture2D(premultiplyTexture, uv0).{PREMULTIPLY_SRC_CHANNEL};
			value *= vec3(premultiply);
		#endif
	#else
		float x = sourceInvResolution.x;
		float y = sourceInvResolution.y;
		vec3 a = texture2D(sourceTexture, vec2 (uv0.x - 2.0 * x, uv0.y + 2.0 * y)).rgb;
		vec3 b = texture2D(sourceTexture, vec2 (uv0.x,		   uv0.y + 2.0 * y)).rgb;
		vec3 c = texture2D(sourceTexture, vec2 (uv0.x + 2.0 * x, uv0.y + 2.0 * y)).rgb;
		vec3 d = texture2D(sourceTexture, vec2 (uv0.x - 2.0 * x, uv0.y)).rgb;
		vec3 f = texture2D(sourceTexture, vec2 (uv0.x + 2.0 * x, uv0.y)).rgb;
		vec3 g = texture2D(sourceTexture, vec2 (uv0.x - 2.0 * x, uv0.y - 2.0 * y)).rgb;
		vec3 h = texture2D(sourceTexture, vec2 (uv0.x,		   uv0.y - 2.0 * y)).rgb;
		vec3 i = texture2D(sourceTexture, vec2 (uv0.x + 2.0 * x, uv0.y - 2.0 * y)).rgb;
		vec3 j = texture2D(sourceTexture, vec2 (uv0.x - x, uv0.y + y)).rgb;
		vec3 k = texture2D(sourceTexture, vec2 (uv0.x + x, uv0.y + y)).rgb;
		vec3 l = texture2D(sourceTexture, vec2 (uv0.x - x, uv0.y - y)).rgb;
		vec3 m = texture2D(sourceTexture, vec2 (uv0.x + x, uv0.y - y)).rgb;
		vec3 value = e * 0.125;
		value += (a + c + g + i) * 0.03125;
		value += (b + d + f + h) * 0.0625;
		value += (j + k + l + m) * 0.125;
	#endif
	#ifdef REMOVE_INVALID
		value = max(value, vec3(0.0));
	#endif
	#ifdef PREFILTER
		float luminance = max(value.r, max(value.g, value.b));
		float threshold = prefilterThresholdKnee.x;
		float knee = prefilterThresholdKnee.y;
		float soft = clamp(luminance - threshold + knee, 0.0, 2.0 * knee);
		soft = soft * soft / (4.0 * knee + 1e-4);
		value *= clamp(max(soft, luminance - threshold) / max(luminance, 1e-4), 0.0, 1.0);
	#endif
	gl_FragColor = vec4(value, 1.0);
}
`,ii=`
var sourceTexture: texture_2d<f32>;
var sourceTextureSampler: sampler;
uniform sourceInvResolution: vec2f;
varying uv0: vec2f;
#ifdef PREMULTIPLY
	var premultiplyTexture: texture_2d<f32>;
	var premultiplyTextureSampler: sampler;
#endif
#ifdef PREFILTER
	uniform prefilterThresholdKnee: vec2f;
#endif
@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
	var output: FragmentOutput;
	let e: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, input.uv0).rgb);
	#ifdef BOXFILTER
		var value: half3 = e;
		#ifdef PREMULTIPLY
			let premultiply: half = half(textureSample(premultiplyTexture, premultiplyTextureSampler, input.uv0).{PREMULTIPLY_SRC_CHANNEL});
			value *= premultiply;
		#endif
	#else
		let x: f32 = uniform.sourceInvResolution.x;
		let y: f32 = uniform.sourceInvResolution.y;
		let a: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x - 2.0 * x, input.uv0.y + 2.0 * y)).rgb);
		let b: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x,		   input.uv0.y + 2.0 * y)).rgb);
		let c: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x + 2.0 * x, input.uv0.y + 2.0 * y)).rgb);
		let d: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x - 2.0 * x, input.uv0.y)).rgb);
		let f: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x + 2.0 * x, input.uv0.y)).rgb);
		let g: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x - 2.0 * x, input.uv0.y - 2.0 * y)).rgb);
		let h: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x,		   input.uv0.y - 2.0 * y)).rgb);
		let i: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x + 2.0 * x, input.uv0.y - 2.0 * y)).rgb);
		let j: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x - x, input.uv0.y + y)).rgb);
		let k: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x + x, input.uv0.y + y)).rgb);
		let l: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x - x, input.uv0.y - y)).rgb);
		let m: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x + x, input.uv0.y - y)).rgb);
		var value: half3 = e * half(0.125);
		value += (a + c + g + i) * half(0.03125);
		value += (b + d + f + h) * half(0.0625);
		value += (j + k + l + m) * half(0.125);
	#endif
	#ifdef REMOVE_INVALID
		value = max(value, half3(0.0));
	#endif
	#ifdef PREFILTER
		let luminance: half = max(value.r, max(value.g, value.b));
		let threshold: half = half(uniform.prefilterThresholdKnee.x);
		let knee: half = half(uniform.prefilterThresholdKnee.y);
		var soft: half = clamp(luminance - threshold + knee, half(0.0), half(2.0) * knee);
		soft = soft * soft / (half(4.0) * knee + half(1e-4));
		value *= clamp(max(soft, luminance - threshold) / max(luminance, half(1e-4)), half(0.0), half(1.0));
	#endif
	output.color = vec4f(vec3f(value), 1.0);
	return output;
}
`,ai=class extends m{constructor(e,t,n={}){super(e),this.sourceTexture=t,this.premultiplyTexture=n.premultiplyTexture,this.prefilter=n.prefilter??!1,this.prefilterThreshold=0,this.prefilterKnee=0,Y.get(e,Te).set(`downsamplePS`,ri),Y.get(e,K).set(`downsamplePS`,ii);let r=n.boxFilter??!1,i=`${r?`Box`:``}-${n.premultiplyTexture?`Premultiply`:``}-${n.premultiplySrcChannel??``}-${n.removeInvalid?`RemoveInvalid`:``}-${this.prefilter?`Prefilter`:``}`,a=new Map;r&&a.set(`BOXFILTER`,``),n.premultiplyTexture&&a.set(`PREMULTIPLY`,``),n.removeInvalid&&a.set(`REMOVE_INVALID`,``),this.prefilter&&a.set(`PREFILTER`,``),a.set(`{PREMULTIPLY_SRC_CHANNEL}`,n.premultiplySrcChannel??`x`),this.shader=N.createShader(e,{uniqueName:`DownSampleShader:${i}`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`downsamplePS`,fragmentDefines:a}),this.sourceTextureId=e.scope.resolve(`sourceTexture`),this.premultiplyTextureId=e.scope.resolve(`premultiplyTexture`),this.sourceInvResolutionId=e.scope.resolve(`sourceInvResolution`),this.sourceInvResolutionValue=new Float32Array(2),this.prefilterThresholdKneeId=e.scope.resolve(`prefilterThresholdKnee`),this.prefilterThresholdKneeValue=new Float32Array(2)}setSourceTexture(e){this.sourceTexture=e,this.options.resizeSource=e}execute(){this.sourceTextureId.setValue(this.sourceTexture),this.premultiplyTexture&&this.premultiplyTextureId.setValue(this.premultiplyTexture),this.sourceInvResolutionValue[0]=1/this.sourceTexture.width,this.sourceInvResolutionValue[1]=1/this.sourceTexture.height,this.sourceInvResolutionId.setValue(this.sourceInvResolutionValue),this.prefilter&&(this.prefilterThresholdKneeValue[0]=this.prefilterThreshold,this.prefilterThresholdKneeValue[1]=this.prefilterKnee,this.prefilterThresholdKneeId.setValue(this.prefilterThresholdKneeValue)),super.execute()}},oi=`
	uniform sampler2D sourceTexture;
	uniform vec2 sourceInvResolution;
	varying vec2 uv0;
	void main()
	{
		float x = sourceInvResolution.x;
		float y = sourceInvResolution.y;
		vec3 a = texture2D (sourceTexture, vec2 (uv0.x - x, uv0.y + y)).rgb;
		vec3 b = texture2D (sourceTexture, vec2 (uv0.x,	 uv0.y + y)).rgb;
		vec3 c = texture2D (sourceTexture, vec2 (uv0.x + x, uv0.y + y)).rgb;
		vec3 d = texture2D (sourceTexture, vec2 (uv0.x - x, uv0.y)).rgb;
		vec3 e = texture2D (sourceTexture, vec2 (uv0.x,	 uv0.y)).rgb;
		vec3 f = texture2D (sourceTexture, vec2 (uv0.x + x, uv0.y)).rgb;
		vec3 g = texture2D (sourceTexture, vec2 (uv0.x - x, uv0.y - y)).rgb;
		vec3 h = texture2D (sourceTexture, vec2 (uv0.x,	 uv0.y - y)).rgb;
		vec3 i = texture2D (sourceTexture, vec2 (uv0.x + x, uv0.y - y)).rgb;
		vec3 value = e * 0.25;
		value += (b + d + f + h) * 0.125;
		value += (a + c + g + i) * 0.0625;
		gl_FragColor = vec4(value, 1.0);
	}
`,si=`
	var sourceTexture: texture_2d<f32>;
	var sourceTextureSampler: sampler;
	uniform sourceInvResolution: vec2f;
	varying uv0: vec2f;
	@fragment
	fn fragmentMain(input: FragmentInput) -> FragmentOutput {
		var output: FragmentOutput;
		let x: f32 = uniform.sourceInvResolution.x;
		let y: f32 = uniform.sourceInvResolution.y;
		let a: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x - x, input.uv0.y + y)).rgb);
		let b: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x,	 input.uv0.y + y)).rgb);
		let c: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x + x, input.uv0.y + y)).rgb);
		let d: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x - x, input.uv0.y)).rgb);
		let e: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x,	 input.uv0.y)).rgb);
		let f: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x + x, input.uv0.y)).rgb);
		let g: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x - x, input.uv0.y - y)).rgb);
		let h: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x,	 input.uv0.y - y)).rgb);
		let i: half3 = half3(textureSample(sourceTexture, sourceTextureSampler, vec2f(input.uv0.x + x, input.uv0.y - y)).rgb);
		var value: half3 = e * half(0.25);
		value += (b + d + f + h) * half(0.125);
		value += (a + c + g + i) * half(0.0625);
		output.color = vec4f(vec3f(value), 1.0);
		return output;
	}
`,ci=class extends m{constructor(e,t){super(e),this.sourceTexture=t,Y.get(e,Te).set(`upsamplePS`,oi),Y.get(e,K).set(`upsamplePS`,si),this.shader=N.createShader(e,{uniqueName:`UpSampleShader`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`upsamplePS`}),this.sourceTextureId=e.scope.resolve(`sourceTexture`),this.sourceInvResolutionId=e.scope.resolve(`sourceInvResolution`),this.sourceInvResolutionValue=new Float32Array(2)}execute(){this.sourceTextureId.setValue(this.sourceTexture),this.sourceInvResolutionValue[0]=1/this.sourceTexture.width,this.sourceInvResolutionValue[1]=1/this.sourceTexture.height,this.sourceInvResolutionId.setValue(this.sourceInvResolutionValue),super.execute()}},li=class extends Ee{bloomTexture;blurLevel=16;threshold=0;bloomRenderTarget;textureFormat;renderTargets=[];prefilterPass=null;_prefilterEnabled=!1;constructor(e,t,n){super(e),this._sourceTexture=t,this.textureFormat=n,this.bloomRenderTarget=this.createRenderTarget(0),this.bloomTexture=this.bloomRenderTarget.colorBuffer}destroy(){this.destroyRenderPasses(),this.destroyRenderTargets()}destroyRenderTargets(e=0){for(let t=e;t<this.renderTargets.length;t++){let e=this.renderTargets[t];e.destroyTextureBuffers(),e.destroy()}this.renderTargets.length=0}destroyRenderPasses(){for(let e=0;e<this.beforePasses.length;e++)this.beforePasses[e].destroy();this.beforePasses.length=0,this.prefilterPass=null}createRenderTarget(e){return new Ze({depth:!1,colorBuffer:new H(this.device,{name:`BloomTexture${e}`,width:1,height:1,format:this.textureFormat,mipmaps:!1,minFilter:1,magFilter:1,addressU:1,addressV:1})})}createRenderTargets(e){for(let t=0;t<e;t++){let e=t===0?this.bloomRenderTarget:this.createRenderTarget(t);this.renderTargets.push(e)}}calcMipLevels(e,t,n){return Math.floor(Math.log2(Math.min(e,t))-Math.log2(n))}createRenderPasses(e){let t=this.device,n=this.threshold>0;this._prefilterEnabled=n;let r=this._sourceTexture;for(let i=0;i<e;i++){let e=new ai(t,r,{prefilter:n&&i===0});e.prefilter&&(this.prefilterPass=e);let a=this.renderTargets[i];e.init(a,{resizeSource:r,scaleX:.5,scaleY:.5}),e.setClearColor(G.BLACK),this.beforePasses.push(e),r=a.colorBuffer}r=this.renderTargets[e-1].colorBuffer;for(let n=e-2;n>=0;n--){let e=new ci(t,r),i=this.renderTargets[n];e.init(i),e.blendState=Ae.ADDBLEND,this.beforePasses.push(e),r=i.colorBuffer}}onDisable(){this.renderTargets[0]?.resize(1,1),this.destroyRenderPasses(),this.destroyRenderTargets(1)}frameUpdate(){super.frameUpdate();let e=this.calcMipLevels(this._sourceTexture.width,this._sourceTexture.height,1),t=q.clamp(e,1,this.blurLevel);(this.renderTargets.length!==t||this._prefilterEnabled!==this.threshold>0)&&(this.destroyRenderPasses(),this.destroyRenderTargets(1),this.createRenderTargets(t),this.createRenderPasses(t)),this.prefilterPass&&(this.prefilterPass.prefilterThreshold=this.threshold,this.prefilterPass.prefilterKnee=this.threshold*.5)}},ui={composePS:`
	#include "tonemappingPS"
	#include "gammaPS"
	varying vec2 uv0;
	uniform sampler2D sceneTexture;
	uniform vec2 sceneTextureInvRes;
	uniform float composeTargetFlipY;
	#include "composeBloomPS"
	#include "composeDofPS"
	#include "composeSsaoPS"
	#include "composeGradingPS"
	#include "composeColorEnhancePS"
	#include "composeVignettePS"
	#include "composeFringingPS"
	#include "composeCasPS"
	#include "composeColorLutPS"
	#if DEBUG_COMPOSE == depth
		#include "screenDepthPS"
	#endif
	#include "composeDeclarationsPS"
	void main() {
		#include "composeMainStartPS"
		vec2 uv = vec2(uv0.x, mix(uv0.y, 1.0 - uv0.y, composeTargetFlipY));
		vec4 scene = texture2DLod(sceneTexture, uv, 0.0);
		vec3 result = scene.rgb;
		#ifdef CAS
			result = applyCas(result, uv, sharpness);
		#endif
		#ifdef DOF
			result = applyDof(result, uv);
		#endif
		#ifdef SSAO_TEXTURE
			result = applySsao(result, uv);
		#endif
		#ifdef FRINGING
			result = applyFringing(result, uv);
		#endif
		#ifdef BLOOM
			result = applyBloom(result, uv);
		#endif
		#ifdef COLOR_ENHANCE
			result = applyColorEnhance(result);
		#endif
		#ifdef GRADING
			result = applyGrading(result);
		#endif
		result = toneMap(max(vec3(0.0), result));
		#ifdef COLOR_LUT
			result = applyColorLUT(result);
		#endif
		#ifdef VIGNETTE
			result = applyVignette(result, uv);
		#endif
		#include "composeMainEndPS"
		#ifdef DEBUG_COMPOSE
			#if DEBUG_COMPOSE == scene
				result = scene.rgb;
			#elif defined(BLOOM) && DEBUG_COMPOSE == bloom
				result = dBloom * bloomIntensity;
			#elif defined(DOF) && DEBUG_COMPOSE == dofcoc
				result = vec3(dCoc, 0.0);
			#elif defined(DOF) && DEBUG_COMPOSE == dofblur
				result = dBlur;
			#elif defined(SSAO_TEXTURE) && DEBUG_COMPOSE == ssao
				result = vec3(dSsao);
			#elif defined(VIGNETTE) && DEBUG_COMPOSE == vignette
				result = vec3(dVignette);
			#elif DEBUG_COMPOSE == depth
				float dDepth = getLinearScreenDepth(uv);
				result = vec3(clamp((dDepth - camera_params.z) / (camera_params.y - camera_params.z), 0.0, 1.0));
			#elif DEBUG_COMPOSE == depthmissing
				result = vec3(0.0);
			#endif
		#endif
		result = gammaCorrectOutput(result);
		gl_FragColor = vec4(result, scene.a);
	}
`,composeBloomPS:`
	#ifdef BLOOM
		uniform sampler2D bloomTexture;
		uniform float bloomIntensity;
		
		vec3 dBloom;
		
		vec3 applyBloom(vec3 color, vec2 uv) {
			dBloom = texture2DLod(bloomTexture, uv, 0.0).rgb;
			return color + dBloom * bloomIntensity;
		}
	#endif
`,composeDofPS:`
	#ifdef DOF
		uniform sampler2D cocTexture;
		uniform sampler2D blurTexture;
		
		vec2 dCoc;
		vec3 dBlur;
		vec3 getDofBlur(vec2 uv) {
			dCoc = texture2DLod(cocTexture, uv, 0.0).rg;
			#if DOF_UPSCALE
				vec2 blurTexelSize = 1.0 / vec2(textureSize(blurTexture, 0));
				vec3 bilinearBlur = vec3(0.0);
				float totalWeight = 0.0;
				for (int i = -1; i <= 1; i++) {
					for (int j = -1; j <= 1; j++) {
						vec2 offset = vec2(i, j) * blurTexelSize;
						vec2 cocSample = texture2DLod(cocTexture, uv + offset, 0.0).rg;
						vec3 blurSample = texture2DLod(blurTexture, uv + offset, 0.0).rgb;
						float cocWeight = clamp(cocSample.r + cocSample.g, 0.0, 1.0);
						bilinearBlur += blurSample * cocWeight;
						totalWeight += cocWeight;
					}
				}
				if (totalWeight > 0.0) {
					bilinearBlur /= totalWeight;
				}
				dBlur = bilinearBlur;
				return bilinearBlur;
			#else
				dBlur = texture2DLod(blurTexture, uv, 0.0).rgb;
				return dBlur;
			#endif
		}
		vec3 applyDof(vec3 color, vec2 uv) {
			vec3 blur = getDofBlur(uv);
			return mix(color, blur, dCoc.r + dCoc.g);
		}
	#endif
`,composeSsaoPS:`
	#ifdef SSAO
		#define SSAO_TEXTURE
	#endif
	#if DEBUG_COMPOSE == ssao
		#define SSAO_TEXTURE
	#endif
	#ifdef SSAO_TEXTURE
		uniform sampler2D ssaoTexture;
		
		float dSsao;
		
		vec3 applySsao(vec3 color, vec2 uv) {
			dSsao = texture2DLod(ssaoTexture, uv, 0.0).r;
			
			#ifdef SSAO
				return color * dSsao;
			#else
				return color;
			#endif
		}
	#endif
`,composeGradingPS:`
	#ifdef GRADING
		uniform vec3 brightnessContrastSaturation;
		uniform vec3 tint;
		vec3 colorGradingHDR(vec3 color, float brt, float sat, float con) {
			color *= tint;
			color = color * brt;
			float grey = dot(color, vec3(0.3, 0.59, 0.11));
			grey = grey / max(1.0, max(color.r, max(color.g, color.b)));
			color = mix(vec3(grey), color, sat);
			return mix(vec3(0.5), color, con);
		}
		vec3 applyGrading(vec3 color) {
			return colorGradingHDR(color, 
				brightnessContrastSaturation.x, 
				brightnessContrastSaturation.z, 
				brightnessContrastSaturation.y);
		}
	#endif
`,composeColorEnhancePS:`
	#ifdef COLOR_ENHANCE
		uniform vec4 colorEnhanceParams;
		uniform float colorEnhanceMidtones;
		vec3 applyColorEnhance(vec3 color) {
			float maxChannel = max(color.r, max(color.g, color.b));
			float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
			if (colorEnhanceParams.x != 0.0 || colorEnhanceParams.y != 0.0) {
				float logLum = log2(max(lum, 0.001)) / 10.0 + 0.5;
				logLum = clamp(logLum, 0.0, 1.0);
				float shadowWeight = pow(1.0 - logLum, 2.0);
				float highlightWeight = pow(logLum, 2.0);
				color *= pow(2.0, colorEnhanceParams.x * shadowWeight);
				color *= pow(2.0, colorEnhanceParams.y * highlightWeight);
			}
			if (colorEnhanceMidtones != 0.0) {
				const float pivot = 0.18;
				const float widthStops = 1.25;
				const float maxStops = 2.0;
				float y = max(dot(color, vec3(0.2126, 0.7152, 0.0722)), 1e-6);
				float d = log2(y / pivot);
				float w = exp(-(d * d) / (2.0 * widthStops * widthStops));
				float stops = colorEnhanceMidtones * maxStops * w;
				color *= exp2(stops);
			}
			if (colorEnhanceParams.z != 0.0) {
				float minChannel = min(color.r, min(color.g, color.b));
				maxChannel = max(color.r, max(color.g, color.b));
				float sat = (maxChannel - minChannel) / max(maxChannel, 0.001);
				lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
				float normalizedLum = lum / max(1.0, maxChannel);
				vec3 grey = vec3(normalizedLum) * maxChannel;
				float satBoost = colorEnhanceParams.z * (1.0 - sat);
				color = mix(grey, color, 1.0 + satBoost);
			}
			if (colorEnhanceParams.w != 0.0) {
				maxChannel = max(color.r, max(color.g, color.b));
				float scale = max(1.0, maxChannel);
				vec3 normalized = color / scale;
				float darkChannel = min(normalized.r, min(normalized.g, normalized.b));
				float atmosphericLight = 0.95;
				float t = 1.0 - colorEnhanceParams.w * darkChannel / atmosphericLight;
				t = max(t, 0.1);
				vec3 dehazed = (normalized - atmosphericLight) / t + atmosphericLight;
				color = dehazed * scale;
			}
			return max(vec3(0.0), color);
		}
	#endif
`,composeVignettePS:`
	#ifdef VIGNETTE
		uniform vec4 vignetterParams;
		uniform vec3 vignetteColor;
		
		float dVignette;
		
		float calcVignette(vec2 uv) {
			float inner = vignetterParams.x;
			float outer = vignetterParams.y;
			float curvature = vignetterParams.z;
			float intensity = vignetterParams.w;
			vec2 curve = pow(abs(uv * 2.0 -1.0), vec2(1.0 / curvature));
			float edge = pow(length(curve), curvature);
			dVignette = 1.0 - intensity * smoothstep(inner, outer, edge);
			return dVignette;
		}
		vec3 applyVignette(vec3 color, vec2 uv) {
			return mix(vignetteColor, color, calcVignette(uv));
		}
	#endif
`,composeFringingPS:`
	#ifdef FRINGING
		uniform float fringingIntensity;
		vec3 applyFringing(vec3 color, vec2 uv) {
			vec2 centerDistance = uv - 0.5;
			vec2 offset = fringingIntensity * centerDistance * centerDistance;
			color.r = texture2D(sceneTexture, uv - offset).r;
			color.b = texture2D(sceneTexture, uv + offset).b;
			return color;
		}
	#endif
`,composeCasPS:`
	#ifdef CAS
		uniform float sharpness;
		#ifdef CAS_HDR
			float maxComponent(float x, float y, float z) { return max(x, max(y, z)); }
			vec3 toSDR(vec3 c) { return c / (1.0 + maxComponent(c.r, c.g, c.b)); }
			vec3 toHDR(vec3 c) { return c / max(1.0 - maxComponent(c.r, c.g, c.b), 1e-4); }
		#else
			vec3 toSDR(vec3 c) { return c; }
			vec3 toHDR(vec3 c) { return c; }
		#endif
		vec3 applyCas(vec3 color, vec2 uv, float sharpness) {
			float x = sceneTextureInvRes.x;
			float y = sceneTextureInvRes.y;
			vec3 a = toSDR(texture2DLod(sceneTexture, uv + vec2(0.0, -y), 0.0).rgb);
			vec3 b = toSDR(texture2DLod(sceneTexture, uv + vec2(-x, 0.0), 0.0).rgb);
			vec3 c = toSDR(color.rgb);
			vec3 d = toSDR(texture2DLod(sceneTexture, uv + vec2(x, 0.0), 0.0).rgb);
			vec3 e = toSDR(texture2DLod(sceneTexture, uv + vec2(0.0, y), 0.0).rgb);
			float min_g = min(a.g, min(b.g, min(c.g, min(d.g, e.g))));
			float max_g = max(a.g, max(b.g, max(c.g, max(d.g, e.g))));
			float sharpening_amount = sqrt(min(1.0 - max_g, min_g) / max(max_g, 1e-4));
			float w = sharpening_amount * sharpness;
			vec3 res = (w * (a + b + d + e) + c) / (4.0 * w + 1.0);
			res = max(res, 0.0);
			return toHDR(res);
		}
	#endif
`,composeColorLutPS:`
	#ifdef COLOR_LUT
		const float COLOR_LUT_N = 16.0;
		const float COLOR_LUT_W = 256.0;
		const float COLOR_LUT_MAX = COLOR_LUT_N - 1.0;
		const float COLOR_LUT_HALF_PX_X = 0.5 / COLOR_LUT_W;
		const float COLOR_LUT_HALF_PX_Y = 0.5 / COLOR_LUT_N;
		const float COLOR_LUT_R_SCALE = COLOR_LUT_MAX / COLOR_LUT_W;
		const float COLOR_LUT_G_SCALE = COLOR_LUT_MAX / COLOR_LUT_N;
		const float COLOR_LUT_SLICE = 1.0 / COLOR_LUT_N;
		uniform vec3 colorLUTParams;
		uniform sampler2D colorLUT;
		#ifdef COLOR_LUT2
			uniform sampler2D colorLUT2;
		#endif
		vec3 sampleColorLUT(sampler2D lut, vec2 uv_l, vec2 uv_h, float t) {
			vec3 color_l = texture2DLod(lut, uv_l, 0.0).rgb;
			vec3 color_h = texture2DLod(lut, uv_h, 0.0).rgb;
			return mix(color_l, color_h, t);
		}
		vec3 applyColorLUT(vec3 color) {
			vec3 srgbCoord = pow(max(color, vec3(0.0)) + 0.0000001, vec3(1.0 / 2.2));
			vec3 c = clamp(srgbCoord, 0.0, 1.0);
			float cell = c.b * COLOR_LUT_MAX;
			float cell_l = floor(cell);
			float cell_h = ceil(cell);
			float t = fract(cell);
			float r_offset = COLOR_LUT_HALF_PX_X + c.r * COLOR_LUT_R_SCALE;
			float g_offset = COLOR_LUT_HALF_PX_Y + c.g * COLOR_LUT_G_SCALE;
			vec2 uv_l = vec2(cell_l * COLOR_LUT_SLICE + r_offset, g_offset);
			vec2 uv_h = vec2(cell_h * COLOR_LUT_SLICE + r_offset, g_offset);
			vec3 lut1 = sampleColorLUT(colorLUT, uv_l, uv_h, t);
			#ifdef COLOR_LUT2
				vec3 lut2 = sampleColorLUT(colorLUT2, uv_l, uv_h, t);
				float w1 = colorLUTParams.x * (1.0 - colorLUTParams.z);
				float w2 = colorLUTParams.y * colorLUTParams.z;
				return color + (lut1 - color) * w1 + (lut2 - color) * w2;
			#else
				return mix(color, lut1, colorLUTParams.x);
			#endif
		}
	#endif
`,composeDeclarationsPS:``,composeMainStartPS:``,composeMainEndPS:``},di={composePS:`
	#include "tonemappingPS"
	#include "gammaPS"
	varying uv0: vec2f;
	var sceneTexture: texture_2d<f32>;
	var sceneTextureSampler: sampler;
	uniform sceneTextureInvRes: vec2f;
	uniform composeTargetFlipY: f32;
	#include "composeBloomPS"
	#include "composeDofPS"
	#include "composeSsaoPS"
	#include "composeGradingPS"
	#include "composeColorEnhancePS"
	#include "composeVignettePS"
	#include "composeFringingPS"
	#include "composeCasPS"
	#include "composeColorLutPS"
	#if DEBUG_COMPOSE == depth
		#include "screenDepthPS"
	#endif
	#include "composeDeclarationsPS"
	@fragment
	fn fragmentMain(input: FragmentInput) -> FragmentOutput {
		#include "composeMainStartPS"
		var output: FragmentOutput;
		var uv = vec2f(uv0.x, mix(uv0.y, 1.0 - uv0.y, uniform.composeTargetFlipY));
		let scene = textureSampleLevel(sceneTexture, sceneTextureSampler, uv, 0.0);
		var result = scene.rgb;
		#ifdef CAS
			result = applyCas(result, uv, uniform.sharpness);
		#endif
		#ifdef DOF
			result = applyDof(result, uv);
		#endif
		#ifdef SSAO_TEXTURE
			result = applySsao(result, uv);
		#endif
		#ifdef FRINGING
			result = applyFringing(result, uv);
		#endif
		#ifdef BLOOM
			result = applyBloom(result, uv);
		#endif
		#ifdef COLOR_ENHANCE
			result = applyColorEnhance(result);
		#endif
		#ifdef GRADING
			result = applyGrading(result);
		#endif
		result = toneMap(max(vec3f(0.0), result));
		#ifdef COLOR_LUT
			result = applyColorLUT(result);
		#endif
		#ifdef VIGNETTE
			result = applyVignette(result, uv);
		#endif
		#include "composeMainEndPS"
		#ifdef DEBUG_COMPOSE
			#if DEBUG_COMPOSE == scene
				result = scene.rgb;
			#elif defined(BLOOM) && DEBUG_COMPOSE == bloom
				result = dBloom * uniform.bloomIntensity;
			#elif defined(DOF) && DEBUG_COMPOSE == dofcoc
				result = vec3f(dCoc, 0.0);
			#elif defined(DOF) && DEBUG_COMPOSE == dofblur
				result = dBlur;
			#elif defined(SSAO_TEXTURE) && DEBUG_COMPOSE == ssao
				result = vec3f(dSsao);
			#elif defined(VIGNETTE) && DEBUG_COMPOSE == vignette
				result = vec3f(dVignette);
			#elif DEBUG_COMPOSE == depth
				let dDepth = getLinearScreenDepth(uv);
				result = vec3f(clamp((dDepth - uniform.camera_params.z) / (uniform.camera_params.y - uniform.camera_params.z), 0.0, 1.0));
			#elif DEBUG_COMPOSE == depthmissing
				result = vec3f(0.0);
			#endif
		#endif
		result = gammaCorrectOutput(result);
		output.color = vec4f(result, scene.a);
		return output;
	}
`,composeBloomPS:`
	#ifdef BLOOM
		var bloomTexture: texture_2d<f32>;
		var bloomTextureSampler: sampler;
		uniform bloomIntensity: f32;
		
		var<private> dBloom: vec3f;
		
		fn applyBloom(color: vec3f, uv: vec2f) -> vec3f {
			dBloom = textureSampleLevel(bloomTexture, bloomTextureSampler, uv, 0.0).rgb;
			return color + dBloom * uniform.bloomIntensity;
		}
	#endif
`,composeDofPS:`
	#ifdef DOF
		var cocTexture: texture_2d<f32>;
		var cocTextureSampler: sampler;
		var blurTexture: texture_2d<f32>;
		var blurTextureSampler: sampler;
		
		var<private> dCoc: vec2f;
		var<private> dBlur: vec3f;
		fn getDofBlur(uv: vec2f) -> vec3f {
			dCoc = textureSampleLevel(cocTexture, cocTextureSampler, uv, 0.0).rg;
			#if DOF_UPSCALE
				let blurTexelSize = 1.0 / vec2f(textureDimensions(blurTexture, 0));
				var bilinearBlur = vec3f(0.0);
				var totalWeight = 0.0;
				for (var i = -1; i <= 1; i++) {
					for (var j = -1; j <= 1; j++) {
						let offset = vec2f(f32(i), f32(j)) * blurTexelSize;
						let cocSample = textureSampleLevel(cocTexture, cocTextureSampler, uv + offset, 0.0).rg;
						let blurSample = textureSampleLevel(blurTexture, blurTextureSampler, uv + offset, 0.0).rgb;
						let cocWeight = clamp(cocSample.r + cocSample.g, 0.0, 1.0);
						bilinearBlur += blurSample * cocWeight;
						totalWeight += cocWeight;
					}
				}
				if (totalWeight > 0.0) {
					bilinearBlur /= totalWeight;
				}
				dBlur = bilinearBlur;
				return bilinearBlur;
			#else
				dBlur = textureSampleLevel(blurTexture, blurTextureSampler, uv, 0.0).rgb;
				return dBlur;
			#endif
		}
		fn applyDof(color: vec3f, uv: vec2f) -> vec3f {
			let blur = getDofBlur(uv);
			return mix(color, blur, dCoc.r + dCoc.g);
		}
	#endif
`,composeSsaoPS:`
	#ifdef SSAO
		#define SSAO_TEXTURE
	#endif
	#if DEBUG_COMPOSE == ssao
		#define SSAO_TEXTURE
	#endif
	#ifdef SSAO_TEXTURE
		var ssaoTexture: texture_2d<f32>;
		var ssaoTextureSampler: sampler;
		
		var<private> dSsao: f32;
		
		fn applySsao(color: vec3f, uv: vec2f) -> vec3f {
			dSsao = textureSampleLevel(ssaoTexture, ssaoTextureSampler, uv, 0.0).r;
			
			#ifdef SSAO
				return color * dSsao;
			#else
				return color;
			#endif
		}
	#endif
`,composeGradingPS:`
	#ifdef GRADING
		uniform brightnessContrastSaturation: vec3f;
		uniform tint: vec3f;
		fn colorGradingHDR(color: vec3f, brt: f32, sat: f32, con: f32) -> vec3f {
			var colorOut = color * uniform.tint;
			colorOut = colorOut * brt;
			let grey = dot(colorOut, vec3f(0.3, 0.59, 0.11));
			let normalizedGrey = grey / max(1.0, max(colorOut.r, max(colorOut.g, colorOut.b)));
			colorOut = mix(vec3f(normalizedGrey), colorOut, sat);
			return mix(vec3f(0.5), colorOut, con);
		}
		fn applyGrading(color: vec3f) -> vec3f {
			return colorGradingHDR(color, 
				uniform.brightnessContrastSaturation.x, 
				uniform.brightnessContrastSaturation.z, 
				uniform.brightnessContrastSaturation.y);
		}
	#endif
`,composeColorEnhancePS:`
	#ifdef COLOR_ENHANCE
		uniform colorEnhanceParams: vec4f;
		uniform colorEnhanceMidtones: f32;
		fn applyColorEnhance(color: vec3f) -> vec3f {
			var colorOut = color;
			var maxChannel = max(colorOut.r, max(colorOut.g, colorOut.b));
			var lum = dot(colorOut, vec3f(0.2126, 0.7152, 0.0722));
			if (uniform.colorEnhanceParams.x != 0.0 || uniform.colorEnhanceParams.y != 0.0) {
				var logLum = log2(max(lum, 0.001)) / 10.0 + 0.5;
				logLum = clamp(logLum, 0.0, 1.0);
				let shadowWeight = pow(1.0 - logLum, 2.0);
				let highlightWeight = pow(logLum, 2.0);
				colorOut *= pow(2.0, uniform.colorEnhanceParams.x * shadowWeight);
				colorOut *= pow(2.0, uniform.colorEnhanceParams.y * highlightWeight);
			}
			if (uniform.colorEnhanceMidtones != 0.0) {
				let pivot = 0.18;
				let widthStops = 1.25;
				let maxStops = 2.0;
				let y = max(dot(colorOut, vec3f(0.2126, 0.7152, 0.0722)), 1e-6);
				let d = log2(y / pivot);
				let w = exp(-(d * d) / (2.0 * widthStops * widthStops));
				let stops = uniform.colorEnhanceMidtones * maxStops * w;
				colorOut *= exp2(stops);
			}
			if (uniform.colorEnhanceParams.z != 0.0) {
				let minChannel = min(colorOut.r, min(colorOut.g, colorOut.b));
				maxChannel = max(colorOut.r, max(colorOut.g, colorOut.b));
				let sat = (maxChannel - minChannel) / max(maxChannel, 0.001);
				lum = dot(colorOut, vec3f(0.2126, 0.7152, 0.0722));
				let normalizedLum = lum / max(1.0, maxChannel);
				let grey = vec3f(normalizedLum) * maxChannel;
				let satBoost = uniform.colorEnhanceParams.z * (1.0 - sat);
				colorOut = mix(grey, colorOut, 1.0 + satBoost);
			}
			if (uniform.colorEnhanceParams.w != 0.0) {
				maxChannel = max(colorOut.r, max(colorOut.g, colorOut.b));
				let scale = max(1.0, maxChannel);
				let normalized = colorOut / scale;
				let darkChannel = min(normalized.r, min(normalized.g, normalized.b));
				let atmosphericLight = 0.95;
				var t = 1.0 - uniform.colorEnhanceParams.w * darkChannel / atmosphericLight;
				t = max(t, 0.1);
				let dehazed = (normalized - atmosphericLight) / t + atmosphericLight;
				colorOut = dehazed * scale;
			}
			return max(vec3f(0.0), colorOut);
		}
	#endif
`,composeVignettePS:`
	#ifdef VIGNETTE
		uniform vignetterParams: vec4f;
		uniform vignetteColor: vec3f;
		
		var<private> dVignette: f32;
		
		fn calcVignette(uv: vec2f) -> f32 {
			let inner = uniform.vignetterParams.x;
			let outer = uniform.vignetterParams.y;
			let curvature = uniform.vignetterParams.z;
			let intensity = uniform.vignetterParams.w;
			let curve = pow(abs(uv * 2.0 - 1.0), vec2f(1.0 / curvature));
			let edge = pow(length(curve), curvature);
			dVignette = 1.0 - intensity * smoothstep(inner, outer, edge);
			return dVignette;
		}
		fn applyVignette(color: vec3f, uv: vec2f) -> vec3f {
			return mix(uniform.vignetteColor, color, calcVignette(uv));
		}
	#endif
`,composeFringingPS:`
	#ifdef FRINGING
		uniform fringingIntensity: f32;
		fn applyFringing(color: vec3f, uv: vec2f) -> vec3f {
			let centerDistance = uv - 0.5;
			let offset = uniform.fringingIntensity * centerDistance * centerDistance;
			var colorOut = color;
			colorOut.r = textureSample(sceneTexture, sceneTextureSampler, uv - offset).r;
			colorOut.b = textureSample(sceneTexture, sceneTextureSampler, uv + offset).b;
			return colorOut;
		}
	#endif
`,composeCasPS:`
	#ifdef CAS
		uniform sharpness: f32;
		#ifdef CAS_HDR
			fn maxComponent(x: f32, y: f32, z: f32) -> f32 { return max(x, max(y, z)); }
			fn toSDR(c: vec3f) -> vec3f { return c / (1.0 + maxComponent(c.r, c.g, c.b)); }
			fn toHDR(c: vec3f) -> vec3f { return c / max(1.0 - maxComponent(c.r, c.g, c.b), 1e-4); }
		#else
			fn toSDR(c: vec3f) -> vec3f { return c; }
			fn toHDR(c: vec3f) -> vec3f { return c; }
		#endif
		fn applyCas(color: vec3f, uv: vec2f, sharpness: f32) -> vec3f {
			let x = uniform.sceneTextureInvRes.x;
			let y = uniform.sceneTextureInvRes.y;
			let a: half3 = half3(toSDR(textureSampleLevel(sceneTexture, sceneTextureSampler, uv + vec2f(0.0, -y), 0.0).rgb));
			let b: half3 = half3(toSDR(textureSampleLevel(sceneTexture, sceneTextureSampler, uv + vec2f(-x, 0.0), 0.0).rgb));
			let c: half3 = half3(toSDR(color.rgb));
			let d: half3 = half3(toSDR(textureSampleLevel(sceneTexture, sceneTextureSampler, uv + vec2f(x, 0.0), 0.0).rgb));
			let e: half3 = half3(toSDR(textureSampleLevel(sceneTexture, sceneTextureSampler, uv + vec2f(0.0, y), 0.0).rgb));
			let min_g = min(a.g, min(b.g, min(c.g, min(d.g, e.g))));
			let max_g = max(a.g, max(b.g, max(c.g, max(d.g, e.g))));
			let sharpening_amount = sqrt(min(half(1.0) - max_g, min_g) / max(max_g, half(1e-4)));
			let w = sharpening_amount * half(sharpness);
			var res = (w * (a + b + d + e) + c) / (half(4.0) * w + half(1.0));
			res = max(res, half3(0.0));
			return toHDR(vec3f(res));
		}
	#endif
`,composeColorLutPS:`
	#ifdef COLOR_LUT
		const COLOR_LUT_N: f32 = 16.0;
		const COLOR_LUT_W: f32 = 256.0;
		const COLOR_LUT_MAX: f32 = COLOR_LUT_N - 1.0;
		const COLOR_LUT_HALF_PX_X: f32 = 0.5 / COLOR_LUT_W;
		const COLOR_LUT_HALF_PX_Y: f32 = 0.5 / COLOR_LUT_N;
		const COLOR_LUT_R_SCALE: f32 = COLOR_LUT_MAX / COLOR_LUT_W;
		const COLOR_LUT_G_SCALE: f32 = COLOR_LUT_MAX / COLOR_LUT_N;
		const COLOR_LUT_SLICE: f32 = 1.0 / COLOR_LUT_N;
		uniform colorLUTParams: vec3f;
		var colorLUT: texture_2d<f32>;
		var colorLUTSampler: sampler;
		#ifdef COLOR_LUT2
			var colorLUT2: texture_2d<f32>;
			var colorLUT2Sampler: sampler;
		#endif
		fn sampleColorLUT(lut: texture_2d<f32>, lutSampler: sampler, uv_l: vec2f, uv_h: vec2f, t: f32) -> vec3f {
			let color_l: vec3f = textureSampleLevel(lut, lutSampler, uv_l, 0.0).rgb;
			let color_h: vec3f = textureSampleLevel(lut, lutSampler, uv_h, 0.0).rgb;
			return mix(color_l, color_h, vec3f(t));
		}
		fn applyColorLUT(color: vec3f) -> vec3f {
			let srgbCoord: vec3f = pow(max(color, vec3f(0.0)) + vec3f(0.0000001), vec3f(1.0 / 2.2));
			let c: vec3f = clamp(srgbCoord, vec3f(0.0), vec3f(1.0));
			let cell: f32 = c.b * COLOR_LUT_MAX;
			let cell_l: f32 = floor(cell);
			let cell_h: f32 = ceil(cell);
			let t: f32 = fract(cell);
			let r_offset: f32 = COLOR_LUT_HALF_PX_X + c.r * COLOR_LUT_R_SCALE;
			let g_offset: f32 = COLOR_LUT_HALF_PX_Y + c.g * COLOR_LUT_G_SCALE;
			let uv_l: vec2f = vec2f(cell_l * COLOR_LUT_SLICE + r_offset, g_offset);
			let uv_h: vec2f = vec2f(cell_h * COLOR_LUT_SLICE + r_offset, g_offset);
			let lut1: vec3f = sampleColorLUT(colorLUT, colorLUTSampler, uv_l, uv_h, t);
			#ifdef COLOR_LUT2
				let lut2: vec3f = sampleColorLUT(colorLUT2, colorLUT2Sampler, uv_l, uv_h, t);
				let w1: f32 = uniform.colorLUTParams.x * (1.0 - uniform.colorLUTParams.z);
				let w2: f32 = uniform.colorLUTParams.y * uniform.colorLUTParams.z;
				return color + (lut1 - color) * w1 + (lut2 - color) * w2;
			#else
				return mix(color, lut1, vec3f(uniform.colorLUTParams.x));
			#endif
		}
	#endif
`,composeDeclarationsPS:``,composeMainStartPS:``,composeMainEndPS:``},fi=class extends m{sceneTexture=null;bloomIntensity=.01;_bloomTexture=null;_cocTexture=null;blurTexture=null;blurTextureUpscale=!1;_ssaoTexture=null;_toneMapping=0;_gradingEnabled=!1;gradingSaturation=1;gradingContrast=1;gradingBrightness=1;gradingTint=new G(1,1,1,1);_shaderDirty=!0;_vignetteEnabled=!1;vignetteInner=.5;vignetteOuter=1;vignetteCurvature=.5;vignetteIntensity=.3;vignetteColor=new G(0,0,0);_fringingEnabled=!1;fringingIntensity=10;_colorEnhanceEnabled=!1;colorEnhanceShadows=0;colorEnhanceHighlights=0;colorEnhanceVibrance=0;colorEnhanceDehaze=0;colorEnhanceMidtones=0;_taaEnabled=!1;_hdrScene=!0;_sharpness=.5;_gammaCorrection=1;_colorLUT=null;_colorLUT2=null;colorLUTIntensity=1;colorLUT2Intensity=1;colorLUTBlend=0;_key=``;_debug=null;_sceneDepthAvailable=!1;_customComposeChunks=new Map([[`composeDeclarationsPS`,``],[`composeMainStartPS`,``],[`composeMainEndPS`,``]]);constructor(e,t){super(e),this.cameraComponent=t,Y.get(e,Te).add(ui,!1),Y.get(e,K).add(di,!1);let{scope:n}=e;this.sceneTextureId=n.resolve(`sceneTexture`),this.bloomTextureId=n.resolve(`bloomTexture`),this.cocTextureId=n.resolve(`cocTexture`),this.ssaoTextureId=n.resolve(`ssaoTexture`),this.blurTextureId=n.resolve(`blurTexture`),this.bloomIntensityId=n.resolve(`bloomIntensity`),this.bcsId=n.resolve(`brightnessContrastSaturation`),this.tintId=n.resolve(`tint`),this.vignetterParamsId=n.resolve(`vignetterParams`),this.vignetteColorId=n.resolve(`vignetteColor`),this.fringingIntensityId=n.resolve(`fringingIntensity`),this.sceneTextureInvResId=n.resolve(`sceneTextureInvRes`),this.sceneTextureInvResValue=new Float32Array(2),this.sharpnessId=n.resolve(`sharpness`),this.colorLUTId=n.resolve(`colorLUT`),this.colorLUT2Id=n.resolve(`colorLUT2`),this.colorLUTParams=new Float32Array(3),this.colorLUTParamsId=n.resolve(`colorLUTParams`),this.colorEnhanceParamsId=n.resolve(`colorEnhanceParams`),this.colorEnhanceMidtonesId=n.resolve(`colorEnhanceMidtones`),this.composeTargetFlipYId=n.resolve(`composeTargetFlipY`),this.cameraParams=new Float32Array(4),this.cameraParamsId=n.resolve(`camera_params`)}set debug(e){this._debug!==e&&(this._debug=e,this._shaderDirty=!0)}get debug(){return this._debug}set sceneDepthAvailable(e){this._sceneDepthAvailable!==e&&(this._sceneDepthAvailable=e,this._shaderDirty=!0)}get sceneDepthAvailable(){return this._sceneDepthAvailable}get _debugMode(){return this._debug===`depth`&&!this._sceneDepthAvailable?`depthmissing`:this._debug}set colorLUT(e){this._colorLUT!==e&&(this._colorLUT=e,this._shaderDirty=!0,this._validateColorLUT(e,`colorLUT`))}get colorLUT(){return this._colorLUT}set colorLUT2(e){this._colorLUT2!==e&&(this._colorLUT2=e,this._shaderDirty=!0,this._validateColorLUT(e,`colorLUT2`))}get colorLUT2(){return this._colorLUT2}_validateColorLUT(e,t){}set bloomTexture(e){this._bloomTexture!==e&&(this._bloomTexture=e,this._shaderDirty=!0)}get bloomTexture(){return this._bloomTexture}set cocTexture(e){this._cocTexture!==e&&(this._cocTexture=e,this._shaderDirty=!0)}get cocTexture(){return this._cocTexture}set ssaoTexture(e){this._ssaoTexture!==e&&(this._ssaoTexture=e,this._shaderDirty=!0)}get ssaoTexture(){return this._ssaoTexture}set taaEnabled(e){this._taaEnabled!==e&&(this._taaEnabled=e,this._shaderDirty=!0)}get taaEnabled(){return this._taaEnabled}set gradingEnabled(e){this._gradingEnabled!==e&&(this._gradingEnabled=e,this._shaderDirty=!0)}get gradingEnabled(){return this._gradingEnabled}set vignetteEnabled(e){this._vignetteEnabled!==e&&(this._vignetteEnabled=e,this._shaderDirty=!0)}get vignetteEnabled(){return this._vignetteEnabled}set fringingEnabled(e){this._fringingEnabled!==e&&(this._fringingEnabled=e,this._shaderDirty=!0)}get fringingEnabled(){return this._fringingEnabled}set colorEnhanceEnabled(e){this._colorEnhanceEnabled!==e&&(this._colorEnhanceEnabled=e,this._shaderDirty=!0)}get colorEnhanceEnabled(){return this._colorEnhanceEnabled}set toneMapping(e){this._toneMapping!==e&&(this._toneMapping=e,this._shaderDirty=!0)}get toneMapping(){return this._toneMapping}set sharpness(e){this._sharpness!==e&&(this._sharpness=e,this._shaderDirty=!0)}get sharpness(){return this._sharpness}get isSharpnessEnabled(){return this._sharpness>0}set hdrScene(e){this._hdrScene!==e&&(this._hdrScene=e,this._shaderDirty=!0)}get hdrScene(){return this._hdrScene}postInit(){this.setClearColor(G.BLACK),this.setClearDepth(1),this.setClearStencil(0)}frameUpdate(){super.frameUpdate();let e=+!(this.renderTarget??this.device.backBuffer).isColorBufferSrgb(0);this._gammaCorrection!==e&&(this._gammaCorrection=e,this._shaderDirty=!0);let t=Y.get(this.device,this.device.isWebGPU?K:Te);for(let[e,n]of this._customComposeChunks.entries()){let r=t.get(e);r!==n&&(this._customComposeChunks.set(e,r),this._shaderDirty=!0)}if(this._shaderDirty){this._shaderDirty=!1;let e=rt[this._gammaCorrection],t=this._customComposeChunks,n=De(t.get(`composeDeclarationsPS`)??``),r=De(t.get(`composeMainStartPS`)??``),i=De(t.get(`composeMainEndPS`)??``),a=this._debugMode,o=new Map,s=a===`depth`?N.addScreenDepthChunkDefines(this.cameraComponent.shaderParams,o):``,c=`${this.toneMapping}-${e}-${this.bloomTexture?`bloom`:`nobloom`}-${this.cocTexture?`dof`:`nodof`}-${this.blurTextureUpscale?`dofupscale`:``}-${this.ssaoTexture?`ssao`:`nossao`}-${this.gradingEnabled?`grading`:`nograding`}-${this.colorEnhanceEnabled?`colorenhance`:`nocolorenhance`}-${this.colorLUT?`colorlut`:`nocolorlut`}-${this.colorLUT2?`colorlut2`:`nocolorlut2`}-${this.vignetteEnabled?`vignette`:`novignette`}-${this.fringingEnabled?`fringing`:`nofringing`}-${this.taaEnabled?`taa`:`notaa`}-${this.isSharpnessEnabled?this._hdrScene?`cashdr`:`cas`:`nocas`}-${a??``}${s}-decl${n}-start${r}-end${i}`;if(this._key!==c){this._key=c;let t=new Map;t.set(`TONEMAP`,ot[this.toneMapping]),t.set(`GAMMA`,e),this.bloomTexture&&t.set(`BLOOM`,!0),this.cocTexture&&t.set(`DOF`,!0),this.blurTextureUpscale&&t.set(`DOF_UPSCALE`,!0),this.ssaoTexture&&t.set(`SSAO`,!0),this.gradingEnabled&&t.set(`GRADING`,!0),this.colorEnhanceEnabled&&t.set(`COLOR_ENHANCE`,!0),this.colorLUT&&t.set(`COLOR_LUT`,!0),this.colorLUT&&this.colorLUT2&&t.set(`COLOR_LUT2`,!0),this.vignetteEnabled&&t.set(`VIGNETTE`,!0),this.fringingEnabled&&t.set(`FRINGING`,!0),this.taaEnabled&&t.set(`TAA`,!0),this.isSharpnessEnabled&&(t.set(`CAS`,!0),this._hdrScene&&t.set(`CAS_HDR`,!0)),a&&t.set(`DEBUG_COMPOSE`,a),o.forEach((e,n)=>t.set(n,e)),this.shader=N.createShader(this.device,{uniqueName:`ComposeShader-${c}`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`composePS`,fragmentDefines:t})}}}execute(){this._debugMode===`depth`&&this.cameraParamsId.setValue(this.cameraComponent.camera.fillShaderParams(this.cameraParams));let e=this.sceneTexture;this.sceneTextureId.setValue(e),this.sceneTextureInvResValue[0]=1/e.width,this.sceneTextureInvResValue[1]=1/e.height,this.sceneTextureInvResId.setValue(this.sceneTextureInvResValue),this.composeTargetFlipYId.setValue(+!!this.renderTarget?.flipY),this._bloomTexture&&(this.bloomTextureId.setValue(this._bloomTexture),this.bloomIntensityId.setValue(this.bloomIntensity)),this._cocTexture&&(this.cocTextureId.setValue(this._cocTexture),this.blurTextureId.setValue(this.blurTexture)),this._ssaoTexture&&this.ssaoTextureId.setValue(this._ssaoTexture),this._gradingEnabled&&(this.bcsId.setValue([this.gradingBrightness,this.gradingContrast,this.gradingSaturation]),this.tintId.setValue([this.gradingTint.r,this.gradingTint.g,this.gradingTint.b])),this._colorEnhanceEnabled&&(this.colorEnhanceParamsId.setValue([this.colorEnhanceShadows,this.colorEnhanceHighlights,this.colorEnhanceVibrance,this.colorEnhanceDehaze]),this.colorEnhanceMidtonesId.setValue(this.colorEnhanceMidtones));let t=this._colorLUT;t&&(this.colorLUTParams[0]=this.colorLUTIntensity,this.colorLUTParams[1]=this.colorLUT2Intensity,this.colorLUTParams[2]=this.colorLUTBlend,this.colorLUTParamsId.setValue(this.colorLUTParams),this.colorLUTId.setValue(t),this._colorLUT2&&this.colorLUT2Id.setValue(this._colorLUT2)),this._vignetteEnabled&&(this.vignetterParamsId.setValue([this.vignetteInner,this.vignetteOuter,this.vignetteCurvature,this.vignetteIntensity]),this.vignetteColorId.setValue([this.vignetteColor.r,this.vignetteColor.g,this.vignetteColor.b])),this._fringingEnabled&&this.fringingIntensityId.setValue(this.fringingIntensity/1024),this.isSharpnessEnabled&&this.sharpnessId.setValue(q.lerp(-.125,-.2,this.sharpness)),super.execute()}},pi=`
vec4 SampleTextureCatmullRom(TEXTURE_ACCEPT(tex), vec2 uv, vec2 texSize) {
	vec2 samplePos = uv * texSize;
	vec2 texPos1 = floor(samplePos - 0.5) + 0.5;
	vec2 f = samplePos - texPos1;
	vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
	vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
	vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f));
	vec2 w3 = f * f * (-0.5 + 0.5 * f);
	vec2 w12 = w1 + w2;
	vec2 offset12 = w2 / (w1 + w2);
	vec2 texPos0 = (texPos1 - 1.0) / texSize;
	vec2 texPos3 = (texPos1 + 2.0) / texSize;
	vec2 texPos12 = (texPos1 + offset12) / texSize;
	vec4 result = vec4(0.0);
	result += texture2DLod(tex, vec2(texPos0.x, texPos0.y), 0.0) * w0.x * w0.y;
	result += texture2DLod(tex, vec2(texPos12.x, texPos0.y), 0.0) * w12.x * w0.y;
	result += texture2DLod(tex, vec2(texPos3.x, texPos0.y), 0.0) * w3.x * w0.y;
	result += texture2DLod(tex, vec2(texPos0.x, texPos12.y), 0.0) * w0.x * w12.y;
	result += texture2DLod(tex, vec2(texPos12.x, texPos12.y), 0.0) * w12.x * w12.y;
	result += texture2DLod(tex, vec2(texPos3.x, texPos12.y), 0.0) * w3.x * w12.y;
	result += texture2DLod(tex, vec2(texPos0.x, texPos3.y), 0.0) * w0.x * w3.y;
	result += texture2DLod(tex, vec2(texPos12.x, texPos3.y), 0.0) * w12.x * w3.y;
	result += texture2DLod(tex, vec2(texPos3.x, texPos3.y), 0.0) * w3.x * w3.y;
	return result;
}
`,mi=`
fn SampleTextureCatmullRom(tex: texture_2d<f32>, texSampler: sampler, uv: vec2f, texSize: vec2f) -> vec4f {
	let samplePos: vec2f = uv * texSize;
	let texPos1: vec2f = floor(samplePos - 0.5) + 0.5;
	let f: vec2f = samplePos - texPos1;
	let w0: vec2f = f * (-0.5 + f * (1.0 - 0.5 * f));
	let w1: vec2f = 1.0 + f * f * (-2.5 + 1.5 * f);
	let w2: vec2f = f * (0.5 + f * (2.0 - 1.5 * f));
	let w3: vec2f = f * f * (-0.5 + 0.5 * f);
	let w12: vec2f = w1 + w2;
	let offset12: vec2f = w2 / w12;
	let texPos0: vec2f = (texPos1 - 1.0) / texSize;
	let texPos3: vec2f = (texPos1 + 2.0) / texSize;
	let texPos12: vec2f = (texPos1 + offset12) / texSize;
	var result: vec4f = vec4f(0.0);
	result = result + textureSampleLevel(tex, texSampler, vec2f(texPos0.x, texPos0.y), 0.0) * w0.x * w0.y;
	result = result + textureSampleLevel(tex, texSampler, vec2f(texPos12.x, texPos0.y), 0.0) * w12.x * w0.y;
	result = result + textureSampleLevel(tex, texSampler, vec2f(texPos3.x, texPos0.y), 0.0) * w3.x * w0.y;
	result = result + textureSampleLevel(tex, texSampler, vec2f(texPos0.x, texPos12.y), 0.0) * w0.x * w12.y;
	result = result + textureSampleLevel(tex, texSampler, vec2f(texPos12.x, texPos12.y), 0.0) * w12.x * w12.y;
	result = result + textureSampleLevel(tex, texSampler, vec2f(texPos3.x, texPos12.y), 0.0) * w3.x * w12.y;
	result = result + textureSampleLevel(tex, texSampler, vec2f(texPos0.x, texPos3.y), 0.0) * w0.x * w3.y;
	result = result + textureSampleLevel(tex, texSampler, vec2f(texPos12.x, texPos3.y), 0.0) * w12.x * w3.y;
	result = result + textureSampleLevel(tex, texSampler, vec2f(texPos3.x, texPos3.y), 0.0) * w3.x * w3.y;
	return result;
}
`,hi=`
	#include  "sampleCatmullRomPS"
	#include  "screenDepthPS"
	uniform sampler2D sourceTexture;
	uniform sampler2D historyTexture;
	uniform mat4 matrix_viewProjectionPrevious;
	uniform mat4 matrix_viewProjectionInverse;
	uniform vec4 jitters;
	uniform vec2 textureSize;
	varying vec2 uv0;
	vec2 reproject(vec2 uv, float depth) {
		depth = depth * 2.0 - 1.0;
		vec4 ndc = vec4(uv * 2.0 - 1.0, depth, 1.0);
		ndc.xy -= jitters.xy;
		vec4 worldPosition = matrix_viewProjectionInverse * ndc;
		worldPosition /= worldPosition.w;
		vec4 screenPrevious = matrix_viewProjectionPrevious * worldPosition;
		return (screenPrevious.xy / screenPrevious.w) * 0.5 + 0.5;
	}
	vec3 colorClampPremul(vec2 uv, vec3 historyPremul) {
		vec3 minPremul = vec3(9999.0);
		vec3 maxPremul = vec3(-9999.0);
		for(float x = -1.0; x <= 1.0; ++x) {
			for(float y = -1.0; y <= 1.0; ++y) {
				vec4 s = texture2D(sourceTexture, uv + vec2(x, y) / textureSize);
				vec3 premul = s.rgb * s.a;
				minPremul = min(minPremul, premul);
				maxPremul = max(maxPremul, premul);
			}
		}
		return clamp(historyPremul, minPremul, maxPremul);
	}
	void main()
	{
		vec4 srcColor = texture2D(sourceTexture, uv0);
		float linearDepth = getLinearScreenDepth(uv0);
		float depth = delinearizeDepth(linearDepth);
		vec2 historyUv = reproject(uv0, depth);
		#ifdef QUALITY_HIGH
			vec4 historySample = SampleTextureCatmullRom(TEXTURE_PASS(historyTexture), historyUv, textureSize);
		#else
			vec4 historySample = texture2D(historyTexture, historyUv);
		#endif
		vec3 historyPremul = historySample.rgb * historySample.a;
		vec3 srcPremul = srcColor.rgb * srcColor.a;
		vec3 historyPremulClamped = colorClampPremul(uv0, historyPremul);
		float mixFactor = (historyUv.x < 0.0 || historyUv.x > 1.0 || historyUv.y < 0.0 || historyUv.y > 1.0) ?
			1.0 : 0.05;
		vec3 mixedPremul = mix(historyPremulClamped, srcPremul, mixFactor);
		float a = srcColor.a;
		const float UNPREMUL_EPS = 1.0 / 255.0;
		vec3 rgbStraight = (a > UNPREMUL_EPS) ? (mixedPremul / a) : srcColor.rgb;
		gl_FragColor = vec4(rgbStraight, a);
	}
`,gi=`
	#include "sampleCatmullRomPS"
	#include "screenDepthPS"
	var sourceTexture: texture_2d<f32>;
	var sourceTextureSampler: sampler;
	var historyTexture: texture_2d<f32>;
	var historyTextureSampler: sampler;
	uniform matrix_viewProjectionPrevious: mat4x4f;
	uniform matrix_viewProjectionInverse: mat4x4f;
	uniform jitters: vec4f;
	uniform textureSize: vec2f;
	varying uv0: vec2f;
	fn reproject(uv_in: vec2f, depth: f32) -> vec2f {
		var uv = vec2f(uv_in.x, 1.0 - uv_in.y);
		var ndc = vec4f(uv * 2.0 - 1.0, depth, 1.0);
		ndc = vec4f(ndc.xy - uniform.jitters.xy, ndc.zw);
		var worldPosition = uniform.matrix_viewProjectionInverse * ndc;
		worldPosition = worldPosition / worldPosition.w;
		let screenPrevious = uniform.matrix_viewProjectionPrevious * worldPosition;
		var result = (screenPrevious.xy / screenPrevious.w) * 0.5 + 0.5;
		result.y = 1.0 - result.y;
		return result;
	}
	fn colorClampPremul(uv: vec2f, historyPremul: vec3f) -> vec3f {
		var minPremul = vec3f(9999.0);
		var maxPremul = vec3f(-9999.0);
		for (var ix: i32 = -1; ix <= 1; ix = ix + 1) {
			for (var iy: i32 = -1; iy <= 1; iy = iy + 1) {
				let s = textureSample(sourceTexture, sourceTextureSampler, uv + vec2f(f32(ix), f32(iy)) / uniform.textureSize);
				let premul = s.rgb * s.a;
				minPremul = min(minPremul, premul);
				maxPremul = max(maxPremul, premul);
			}
		}
		return clamp(historyPremul, minPremul, maxPremul);
	}
	@fragment
	fn fragmentMain(input: FragmentInput) -> FragmentOutput {
		var output: FragmentOutput;
		let srcColor = textureSample(sourceTexture, sourceTextureSampler, uv0);
		let linearDepth = getLinearScreenDepth(uv0);
		let depth = delinearizeDepth(linearDepth);
		let historyUv = reproject(uv0, depth);
		#ifdef QUALITY_HIGH
			var historySample: vec4f = SampleTextureCatmullRom(historyTexture, historyTextureSampler, historyUv, uniform.textureSize);
		#else
			var historySample: vec4f = textureSample(historyTexture, historyTextureSampler, historyUv);
		#endif
		let historyPremul = historySample.rgb * historySample.a;
		let srcPremul = srcColor.rgb * srcColor.a;
		let historyPremulClamped = colorClampPremul(uv0, historyPremul);
		let mixFactor_condition = historyUv.x < 0.0 || historyUv.x > 1.0 || historyUv.y < 0.0 || historyUv.y > 1.0;
		let mixFactor = select(0.05, 1.0, mixFactor_condition);
		let mixedPremul = mix(historyPremulClamped, srcPremul, mixFactor);
		let a = srcColor.a;
		let UNPREMUL_EPS = 1.0 / 255.0;
		let rgbStraight = select(srcColor.rgb, mixedPremul / a, a > UNPREMUL_EPS);
		output.color = vec4f(rgbStraight, a);
		return output;
	}
`,_i=class extends m{historyIndex=0;historyTexture=null;historyTextures=[];historyRenderTargets=[];constructor(e,t,n){super(e),this.sourceTexture=t,this.cameraComponent=n,Y.get(e,Te).set(`sampleCatmullRomPS`,pi),Y.get(e,K).set(`sampleCatmullRomPS`,mi),Y.get(e,Te).set(`taaResolvePS`,hi),Y.get(e,K).set(`taaResolvePS`,gi);let r=new Map;r.set(`QUALITY_HIGH`,!0);let i=N.addScreenDepthChunkDefines(n.shaderParams,r);this.shader=N.createShader(e,{uniqueName:`TaaResolveShader${i}`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`taaResolvePS`,fragmentDefines:r});let{scope:a}=e;this.sourceTextureId=a.resolve(`sourceTexture`),this.textureSizeId=a.resolve(`textureSize`),this.textureSize=new Float32Array(2),this.historyTextureId=a.resolve(`historyTexture`),this.viewProjPrevId=a.resolve(`matrix_viewProjectionPrevious`),this.viewProjInvId=a.resolve(`matrix_viewProjectionInverse`),this.jittersId=a.resolve(`jitters`),this.cameraParams=new Float32Array(4),this.cameraParamsId=a.resolve(`camera_params`),this.setup()}destroy(){this.renderTarget&&=(this.renderTarget.destroyTextureBuffers(),this.renderTarget.destroy(),null)}setup(){for(let e=0;e<2;++e)this.historyTextures[e]=new H(this.device,{name:`TAA-History-${e}`,width:4,height:4,format:this.sourceTexture.format,mipmaps:!1,minFilter:1,magFilter:1,addressU:1,addressV:1}),this.historyRenderTargets[e]=new Ze({colorBuffer:this.historyTextures[e],depth:!1});this.historyTexture=this.historyTextures[0],this.init(this.historyRenderTargets[0],{resizeSource:this.sourceTexture})}before(){this.sourceTextureId.setValue(this.sourceTexture),this.historyTextureId.setValue(this.historyTextures[1-this.historyIndex]),this.textureSize[0]=this.sourceTexture.width,this.textureSize[1]=this.sourceTexture.height,this.textureSizeId.setValue(this.textureSize);let e=this.cameraComponent.camera;this.viewProjPrevId.setValue(e._viewProjPrevious.data),this.viewProjInvId.setValue(e._viewProjInverse.data),this.jittersId.setValue(e._jitters),this.cameraParamsId.setValue(e.fillShaderParams(this.cameraParams))}update(){return this.historyIndex=1-this.historyIndex,this.historyTexture=this.historyTextures[this.historyIndex],this.renderTarget=this.historyRenderTargets[this.historyIndex],this.historyTexture}},vi=`
	#include "screenDepthPS"
	varying vec2 uv0;
	uniform vec3 params;
	void main()
	{
		float depth = getLinearScreenDepth(uv0);
		float focusDistance = params.x;
		float focusRange = params.y;
		float invRange = params.z;
		float farRange = focusDistance + focusRange * 0.5;
		
		float cocFar = min((depth - farRange) * invRange, 1.0);
		#ifdef NEAR_BLUR
			float nearRange = focusDistance - focusRange * 0.5;
			float cocNear = min((nearRange - depth) * invRange, 1.0);
		#else
			float cocNear = 0.0;
		#endif
		gl_FragColor = vec4(cocFar, cocNear, 0.0, 0.0);
	}
`,yi=`
#include "screenDepthPS"
varying uv0: vec2f;
uniform params: vec3f;
@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
	var output: FragmentOutput;
	let depth: f32 = getLinearScreenDepth(uv0);
	let focusDistance: f32 = uniform.params.x;
	let focusRange: f32 = uniform.params.y;
	let invRange: f32 = uniform.params.z;
	let farRange: f32 = focusDistance + focusRange * 0.5;
	let cocFar: f32 = min((depth - farRange) * invRange, 1.0);
	#ifdef NEAR_BLUR
		let nearRange: f32 = focusDistance - focusRange * 0.5;
		var cocNear: f32 = min((nearRange - depth) * invRange, 1.0);
	#else
		var cocNear: f32 = 0.0;
	#endif
	output.color = vec4f(cocFar, cocNear, 0.0, 0.0);
	return output;
}
`,bi=class extends m{focusDistance;focusRange;constructor(e,t,n){super(e),this.cameraComponent=t,Y.get(e,Te).set(`cocPS`,vi),Y.get(e,K).set(`cocPS`,yi);let r=new Map;n&&r.set(`NEAR_BLUR`,``);let i=N.addScreenDepthChunkDefines(t.shaderParams,r);this.shader=N.createShader(e,{uniqueName:`CocShader-${n}${i}`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`cocPS`,fragmentDefines:r}),this.paramsId=e.scope.resolve(`params`),this.paramsValue=new Float32Array(3),this.cameraParams=new Float32Array(4),this.cameraParamsId=e.scope.resolve(`camera_params`)}execute(){let{paramsValue:e,focusRange:t}=this;e[0]=this.focusDistance+.001,e[1]=t,e[2]=1/t,this.paramsId.setValue(e);let n=this.cameraComponent.camera;this.cameraParamsId.setValue(n.fillShaderParams(this.cameraParams)),super.execute()}},xi=`
	#if defined(NEAR_BLUR)
		uniform sampler2D nearTexture;
	#endif
	uniform sampler2D farTexture;
	uniform sampler2D cocTexture;
	uniform vec2 kernel[{KERNEL_COUNT}];
	uniform float blurRadiusNear;
	uniform float blurRadiusFar;
	varying vec2 uv0;
	void main()
	{
		vec2 coc = texture2D(cocTexture, uv0).rg;
		float cocFar = coc.r;
		vec3 sum = vec3(0.0, 0.0, 0.0);
		#if defined(NEAR_BLUR)
			float cocNear = coc.g;
			if (cocNear > 0.0001) {
				vec2 nearTextureSize = vec2(textureSize(nearTexture, 0));
				vec2 step = cocNear * blurRadiusNear * vec2(nearTextureSize.y / nearTextureSize.x, 1.0);
				for (int i = 0; i < {KERNEL_COUNT}; i++) {
					vec2 uv = uv0 + step * kernel[i];
					vec3 tap = texture2DLod(nearTexture, uv, 0.0).rgb;
					sum += tap.rgb;
				}
				sum *= float({INV_KERNEL_COUNT});
			} else
		#endif
			
			if (cocFar > 0.0001) {
			vec2 farTextureSize = vec2(textureSize(farTexture, 0));
			vec2 step = cocFar * blurRadiusFar * vec2(farTextureSize.y / farTextureSize.x, 1.0);
			float sumCoC = 0.0; 
			for (int i = 0; i < {KERNEL_COUNT}; i++) {
				vec2 uv = uv0 + step * kernel[i];
				vec3 tap = texture2DLod(farTexture, uv, 0.0).rgb;
				float cocThis = texture2DLod(cocTexture, uv, 0.0).r;
				tap *= cocThis;
				sumCoC += cocThis;
				sum += tap;
			}
			if (sumCoC > 0.0)
				sum /= sumCoC;
			sum /= cocFar;
		}
		pcFragColor0 = vec4(sum, 1.0);
	}
`,Si=`
#if defined(NEAR_BLUR)
	var nearTexture: texture_2d<f32>;
	var nearTextureSampler: sampler;
#endif
var farTexture: texture_2d<f32>;
var farTextureSampler: sampler;
var cocTexture: texture_2d<f32>;
var cocTextureSampler: sampler;
uniform kernel: array<vec2f, {KERNEL_COUNT}>;
uniform blurRadiusNear: f32;
uniform blurRadiusFar: f32;
varying uv0: vec2f;
@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
	var output: FragmentOutput;
	let coc: vec2f = textureSample(cocTexture, cocTextureSampler, input.uv0).rg;
	let cocFar: f32 = coc.r;
	var sum: vec3f = vec3f(0.0, 0.0, 0.0);
	#if defined(NEAR_BLUR)
		let cocNear: f32 = coc.g;
		if (cocNear > 0.0001) {
			let nearTextureSize: vec2f = vec2f(textureDimensions(nearTexture, 0));
			let step: vec2f = cocNear * uniform.blurRadiusNear * vec2f(nearTextureSize.y / nearTextureSize.x, 1.0);
			for (var i: i32 = 0; i < {KERNEL_COUNT}; i = i + 1) {
				let uv: vec2f = uv0 + step * uniform.kernel[i].element;
				let tap: vec3f = textureSampleLevel(nearTexture, nearTextureSampler, uv, 0.0).rgb;
				sum = sum + tap;
			}
			sum = sum * f32({INV_KERNEL_COUNT});
		} else
	#endif
		if (cocFar > 0.0001) {
			let farTextureSize: vec2f = vec2f(textureDimensions(farTexture, 0));
			let step: vec2f = cocFar * uniform.blurRadiusFar * vec2f(farTextureSize.y / farTextureSize.x, 1.0);
			var sumCoC: f32 = 0.0;
			for (var i: i32 = 0; i < {KERNEL_COUNT}; i = i + 1) {
				let uv: vec2f = uv0 + step * uniform.kernel[i].element;
				var tap: vec3f = textureSampleLevel(farTexture, farTextureSampler, uv, 0.0).rgb;
				let cocThis: f32 = textureSampleLevel(cocTexture, cocTextureSampler, uv, 0.0).r;
				tap = tap * cocThis;
				sumCoC = sumCoC + cocThis;
				sum = sum + tap;
			}
			if (sumCoC > 0.0) {
				sum = sum / sumCoC;
			}
			sum = sum / cocFar;
		}
	output.color = vec4f(sum, 1.0);
	return output;
}
`,Ci=class extends m{blurRadiusNear=1;blurRadiusFar=1;_blurRings=3;_blurRingPoints=3;referenceHeight=540;constructor(e,t,n,r){super(e),this.nearTexture=t,this.farTexture=n,this.cocTexture=r,Y.get(e,Te).set(`dofBlurPS`,xi),Y.get(e,K).set(`dofBlurPS`,Si);let{scope:i}=e;this.kernelId=i.resolve(`kernel[0]`),this.kernelCountId=i.resolve(`kernelCount`),this.blurRadiusNearId=i.resolve(`blurRadiusNear`),this.blurRadiusFarId=i.resolve(`blurRadiusFar`),this.nearTextureId=i.resolve(`nearTexture`),this.farTextureId=i.resolve(`farTexture`),this.cocTextureId=i.resolve(`cocTexture`)}set blurRings(e){this._blurRings!==e&&(this._blurRings=e,this.shader=null)}get blurRings(){return this._blurRings}set blurRingPoints(e){this._blurRingPoints!==e&&(this._blurRingPoints=e,this.shader=null)}get blurRingPoints(){return this._blurRingPoints}createShader(){this.kernel=new Float32Array(lt.concentric(this.blurRings,this.blurRingPoints));let e=this.kernel.length>>1,t=this.nearTexture!==null,n=new Map;n.set(`{KERNEL_COUNT}`,e),n.set(`{INV_KERNEL_COUNT}`,1/e),t&&n.set(`NEAR_BLUR`,``),this.shader=N.createShader(this.device,{uniqueName:`DofBlurShader-${e}-${t?`nearBlur`:`noNearBlur`}`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`dofBlurPS`,fragmentDefines:n})}execute(){this.shader||this.createShader(),this.nearTextureId.setValue(this.nearTexture),this.farTextureId.setValue(this.farTexture),this.cocTextureId.setValue(this.cocTexture),this.kernelId.setValue(this.kernel),this.kernelCountId.setValue(this.kernel.length>>1);let e=1/(this.referenceHeight>0?this.referenceHeight:540);this.blurRadiusNearId.setValue(this.blurRadiusNear*e),this.blurRadiusFarId.setValue(this.blurRadiusFar*e),super.execute()}},wi=class extends Ee{focusDistance=100;focusRange=50;blurRadius=1;blurRings=3;blurRingPoints=3;highQuality=!0;cocTexture=null;blurTexture=null;cocPass=null;farPass=null;blurPass=null;constructor(e,t,n,r,i,a){super(e),this.highQuality=i,this.cocPass=this.setupCocPass(e,t,n,a),this.beforePasses.push(this.cocPass);let o=i?n:r;this.farPass=this.setupFarPass(e,o,.5),this.beforePasses.push(this.farPass),this.blurPass=this.setupBlurPass(e,r,a,i?2:.5),this.beforePasses.push(this.blurPass)}destroy(){this.destroyRenderPasses(),this.cocPass=null,this.farPass=null,this.blurPass=null,this.destroyRT(this.cocRT),this.destroyRT(this.farRt),this.destroyRT(this.blurRt),this.cocRT=null,this.farRt=null,this.blurRt=null}destroyRenderPasses(){for(let e=0;e<this.beforePasses.length;e++)this.beforePasses[e].destroy();this.beforePasses.length=0}destroyRT(e){e&&(e.destroyTextureBuffers(),e.destroy())}setupCocPass(e,t,n,r){let i=r?53:52;this.cocRT=this.createRenderTarget(`CoCTexture`,i),this.cocTexture=this.cocRT.colorBuffer;let a=new bi(e,t,r);return a.init(this.cocRT,{resizeSource:n}),a.setClearColor(G.BLACK),a}setupFarPass(e,t,n){this.farRt=this.createRenderTarget(`FarDofTexture`,t.format);let r=new ai(e,t,{boxFilter:!0,premultiplyTexture:this.cocTexture,premultiplySrcChannel:`r`});return r.init(this.farRt,{resizeSource:t,scaleX:n,scaleY:n}),r.setClearColor(G.BLACK),r}setupBlurPass(e,t,n,r){let i=this.farRt?.colorBuffer;this.blurRt=this.createRenderTarget(`DofBlurTexture`,t.format),this.blurTexture=this.blurRt.colorBuffer;let a=new Ci(e,n?t:null,i,this.cocTexture);return a.init(this.blurRt,{resizeSource:t,scaleX:r,scaleY:r}),a.setClearColor(G.BLACK),a}createTexture(e,t){return new H(this.device,{name:e,width:1,height:1,format:t,mipmaps:!1,minFilter:1,magFilter:1,addressU:1,addressV:1})}createRenderTarget(e,t){return new Ze({colorBuffer:this.createTexture(e,t),depth:!1,stencil:!1})}setSceneTexture(e){this.highQuality&&this.farPass.setSourceTexture(e)}frameUpdate(){super.frameUpdate(),this.cocPass.focusDistance=this.focusDistance,this.cocPass.focusRange=this.focusRange,this.blurPass.blurRadiusNear=this.blurRadius,this.blurPass.blurRadiusFar=this.blurRadius,this.blurPass.blurRings=this.blurRings,this.blurPass.blurRingPoints=this.blurRingPoints}},Ti=`
	#include "screenDepthPS"
	varying vec2 uv0;
	uniform vec3 uFogCameraPos;
	uniform vec3 uFogCameraFwd;
	uniform mat4 uFogInvView;
	uniform vec2 uFogProjScale;
	uniform vec3 uFogTint;
	uniform vec3 uFogLightColor;
	uniform vec3 uFogLightDir;
	uniform vec3 uFogAmbient;
	uniform vec4 uFogParams;
	uniform vec4 uFogScatterParams;
	uniform float uFogExtinction;
	#ifdef FOG_SHADOWS
		uniform mat4 uFogShadowMatrixPalette[4];
		uniform vec4 uFogShadowCascadeDistances;
		uniform vec4 uFogShadowParams;
		#ifdef FOG_SHADOW_PCF
			uniform sampler2DShadow uFogShadowMap;
		#else
			uniform sampler2D uFogShadowMap;
		#endif
		float sampleFogShadow(vec3 worldPos, float viewDepth) {
			if (viewDepth >= uFogShadowParams.w) return 1.0;
			vec4 comparisons = step(uFogShadowCascadeDistances, vec4(viewDepth));
			int cascadeIndex = int(min(dot(comparisons, vec4(1.0)), uFogShadowParams.x - 1.0));
			vec3 shadowCoord = (uFogShadowMatrixPalette[cascadeIndex] * vec4(worldPos, 1.0)).xyz;
			float z = shadowCoord.z - uFogShadowParams.y;
			#ifdef FOG_SHADOW_PCF
				return textureShadow(uFogShadowMap, vec3(shadowCoord.xy, z));
			#else
				return step(z, texture2D(uFogShadowMap, shadowCoord.xy).r);
			#endif
		}
	#endif
	float fogNoise(vec2 fragCoord) {
		const vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
		return fract(magic.z * fract(dot(fragCoord, magic.xy)));
	}
	float fogPhase(float cosTheta, float g) {
		float g2 = g * g;
		float denom = 1.0 + g2 - 2.0 * g * cosTheta;
		return (1.0 - g2) / (12.56637 * denom * sqrt(denom));
	}
	void main() {
		vec2 ndcUV = uv0;
		#ifdef WEBGPU
			ndcUV.y = 1.0 - ndcUV.y;
		#endif
		vec2 ndc = ndcUV * 2.0 - 1.0;
		vec3 rayDir = normalize((uFogInvView * vec4(ndc * uFogProjScale, -1.0, 0.0)).xyz);
		float rayDot = max(dot(rayDir, uFogCameraFwd), 0.001);
		float rayLength = min(getLinearScreenDepth(uv0) / rayDot, uFogParams.w);
		float stepCount = uFogScatterParams.y;
		float dt = rayLength / stepCount;
		float noise = fract(fogNoise(gl_FragCoord.xy) + uFogScatterParams.z);
		vec3 sunLight = uFogLightColor * fogPhase(dot(rayDir, uFogLightDir), uFogScatterParams.x);
		vec3 inscatter = vec3(0.0);
		float transmittance = 1.0;
		for (float i = 0.0; i < stepCount; i += 1.0) {
			float t = (i + noise) * dt;
			vec3 pos = uFogCameraPos + rayDir * t;
			float density = uFogParams.x * exp(-uFogParams.z * max(pos.y - uFogParams.y, 0.0));
			float shadow = 1.0;
			#ifdef FOG_SHADOWS
				shadow = mix(1.0, sampleFogShadow(pos, t * rayDot), uFogScatterParams.w);
			#endif
			vec3 radiance = sunLight * shadow + uFogAmbient;
			inscatter += transmittance * uFogTint * radiance * (density * dt);
			transmittance *= exp(-uFogExtinction * density * dt);
			if (transmittance < 0.005) break;
		}
		gl_FragColor = vec4(inscatter, transmittance);
	}
`,Ei=`
	#include "screenDepthPS"
	varying uv0: vec2f;
	uniform uFogCameraPos: vec3f;
	uniform uFogCameraFwd: vec3f;
	uniform uFogInvView: mat4x4f;
	uniform uFogProjScale: vec2f;
	uniform uFogTint: vec3f;
	uniform uFogLightColor: vec3f;
	uniform uFogLightDir: vec3f;
	uniform uFogAmbient: vec3f;
	uniform uFogParams: vec4f;
	uniform uFogScatterParams: vec4f;
	uniform uFogExtinction: f32;
	#ifdef FOG_SHADOWS
		uniform uFogShadowMatrixPalette: array<mat4x4f, 4>;
		uniform uFogShadowCascadeDistances: vec4f;
		uniform uFogShadowParams: vec4f;
		#ifdef FOG_SHADOW_PCF
			var uFogShadowMap: texture_depth_2d;
			var uFogShadowMapSampler: sampler_comparison;
		#else
			var uFogShadowMap: texture_2d<f32>;
			var uFogShadowMapSampler: sampler;
		#endif
		fn sampleFogShadow(worldPos: vec3f, viewDepth: f32) -> f32 {
			if (viewDepth >= uniform.uFogShadowParams.w) {
				return 1.0;
			}
			let comparisons: vec4f = step(uniform.uFogShadowCascadeDistances, vec4f(viewDepth));
			let cascadeIndex: i32 = i32(min(dot(comparisons, vec4f(1.0)), uniform.uFogShadowParams.x - 1.0));
			let shadowCoord: vec3f = (uniform.uFogShadowMatrixPalette[cascadeIndex] * vec4f(worldPos, 1.0)).xyz;
			let z: f32 = shadowCoord.z - uniform.uFogShadowParams.y;
			#ifdef FOG_SHADOW_PCF
				return textureSampleCompareLevel(uFogShadowMap, uFogShadowMapSampler, shadowCoord.xy, z);
			#else
				return step(z, textureSampleLevel(uFogShadowMap, uFogShadowMapSampler, shadowCoord.xy, 0.0).r);
			#endif
		}
	#endif
	fn fogNoise(fragCoord: vec2f) -> f32 {
		const magic: vec3f = vec3f(0.06711056, 0.00583715, 52.9829189);
		return fract(magic.z * fract(dot(fragCoord, magic.xy)));
	}
	fn fogPhase(cosTheta: f32, g: f32) -> f32 {
		let g2: f32 = g * g;
		let denom: f32 = 1.0 + g2 - 2.0 * g * cosTheta;
		return (1.0 - g2) / (12.56637 * denom * sqrt(denom));
	}
	@fragment
	fn fragmentMain(input: FragmentInput) -> FragmentOutput {
		var output: FragmentOutput;
		let ndcUV: vec2f = vec2f(input.uv0.x, 1.0 - input.uv0.y);
		let ndc: vec2f = ndcUV * 2.0 - 1.0;
		let rayDir: vec3f = normalize((uniform.uFogInvView * vec4f(ndc * uniform.uFogProjScale, -1.0, 0.0)).xyz);
		let rayDot: f32 = max(dot(rayDir, uniform.uFogCameraFwd), 0.001);
		let rayLength: f32 = min(getLinearScreenDepth(input.uv0) / rayDot, uniform.uFogParams.w);
		let stepCount: f32 = uniform.uFogScatterParams.y;
		let dt: f32 = rayLength / stepCount;
		let noise: f32 = fract(fogNoise(pcPosition.xy) + uniform.uFogScatterParams.z);
		let sunLight: vec3f = uniform.uFogLightColor * fogPhase(dot(rayDir, uniform.uFogLightDir), uniform.uFogScatterParams.x);
		var inscatter: vec3f = vec3f(0.0);
		var transmittance: f32 = 1.0;
		for (var i: f32 = 0.0; i < stepCount; i += 1.0) {
			let t: f32 = (i + noise) * dt;
			let pos: vec3f = uniform.uFogCameraPos + rayDir * t;
			let density: f32 = uniform.uFogParams.x * exp(-uniform.uFogParams.z * max(pos.y - uniform.uFogParams.y, 0.0));
			var shadow: f32 = 1.0;
			#ifdef FOG_SHADOWS
				shadow = mix(1.0, sampleFogShadow(pos, t * rayDot), uniform.uFogScatterParams.w);
			#endif
			let radiance: vec3f = sunLight * shadow + uniform.uFogAmbient;
			inscatter += transmittance * uniform.uFogTint * radiance * (density * dt);
			transmittance *= exp(-uniform.uFogExtinction * density * dt);
			if (transmittance < 0.005) {
				break;
			}
		}
		output.color = vec4f(inscatter, transmittance);
		return output;
	}
`,Di=`
	#include "screenDepthPS"
	varying vec2 uv0;
	uniform sampler2D uFogTexture;
	uniform vec4 uFogTextureSize;
	void main() {
		float depth = getLinearScreenDepth(uv0);
		vec2 texel = uv0 * uFogTextureSize.xy - 0.5;
		vec2 base = (floor(texel) + 0.5) * uFogTextureSize.zw;
		vec2 f = fract(texel);
		vec2 uvs[4];
		uvs[0] = base;
		uvs[1] = base + vec2(uFogTextureSize.z, 0.0);
		uvs[2] = base + vec2(0.0, uFogTextureSize.w);
		uvs[3] = base + uFogTextureSize.zw;
		vec4 bilinear = vec4((1.0 - f.x) * (1.0 - f.y), f.x * (1.0 - f.y), (1.0 - f.x) * f.y, f.x * f.y);
		vec4 sum = vec4(0.0);
		float sumWeight = 0.0;
		for (int i = 0; i < 4; i++) {
			float sampleDepth = getLinearScreenDepth(uvs[i]);
			float w = bilinear[i] / (1.0 + 16.0 * abs(sampleDepth - depth) / max(depth, 0.001));
			sum += texture2D(uFogTexture, uvs[i]) * w;
			sumWeight += w;
		}
		gl_FragColor = sum / max(sumWeight, 0.0001);
	}
`,Oi=`
	#include "screenDepthPS"
	varying uv0: vec2f;
	var uFogTexture: texture_2d<f32>;
	var uFogTextureSampler: sampler;
	uniform uFogTextureSize: vec4f;
	@fragment
	fn fragmentMain(input: FragmentInput) -> FragmentOutput {
		var output: FragmentOutput;
		let depth: f32 = getLinearScreenDepth(input.uv0);
		let texel: vec2f = input.uv0 * uniform.uFogTextureSize.xy - 0.5;
		let base: vec2f = (floor(texel) + 0.5) * uniform.uFogTextureSize.zw;
		let f: vec2f = fract(texel);
		var uvs: array<vec2f, 4>;
		uvs[0] = base;
		uvs[1] = base + vec2f(uniform.uFogTextureSize.z, 0.0);
		uvs[2] = base + vec2f(0.0, uniform.uFogTextureSize.w);
		uvs[3] = base + uniform.uFogTextureSize.zw;
		let bilinear: vec4f = vec4f((1.0 - f.x) * (1.0 - f.y), f.x * (1.0 - f.y), (1.0 - f.x) * f.y, f.x * f.y);
		var sum: vec4f = vec4f(0.0);
		var sumWeight: f32 = 0.0;
		for (var i: i32 = 0; i < 4; i += 1) {
			let sampleDepth: f32 = getLinearScreenDepth(uvs[i]);
			let w: f32 = bilinear[i] / (1.0 + 16.0 * abs(sampleDepth - depth) / max(depth, 0.001));
			sum += textureSampleLevel(uFogTexture, uFogTextureSampler, uvs[i], 0.0) * w;
			sumWeight += w;
		}
		output.color = sum / max(sumWeight, 0.0001);
		return output;
	}
`,ki=`
	#include "screenDepthPS"
	#include "clusteredLightUtilsPS"
	float square(float x) {
		return x * x;
	}
	float saturate(float x) {
		return clamp(x, 0.0, 1.0);
	}
	#include "falloffInvSquaredPS"
	#include "falloffLinearPS"
	#include "spotPS"
	#ifdef VOL_COOKIES
		#include "clusteredLightCookiesPS"
	#endif
	varying vec2 uv0;
	uniform vec3 uVolCameraPos;
	uniform vec3 uVolCameraFwd;
	uniform mat4 uVolInvView;
	uniform vec2 uVolProjScale;
	uniform vec3 uVolTint;
	uniform vec4 uVolFogParams;
	uniform vec4 uVolMarchParams;
	uniform vec4 uVolLightPosRange;
	uniform vec4 uVolLightSphere;
	uniform vec3 uVolLightColor;
	uniform vec4 uVolLightDir;
	uniform vec4 uVolLightSpot;
	uniform vec4 uVolLightAtten;
	#if defined(VOL_SHADOWS) || defined(VOL_COOKIES)
		uniform mat4 uVolLightProjMatrix;
		uniform vec4 uVolLightAtlas;
		uniform vec2 shadowAtlasParams;
	#endif
	#ifdef VOL_SHADOWS
		uniform sampler2DShadow shadowAtlasTexture;
		float volSampleShadow(vec3 pos, vec3 lightVec, float spiral) {
			vec2 tapOffset = vec2(cos(spiral), sin(spiral)) / shadowAtlasParams.x;
			if (uVolLightDir.w > 0.0) {
				vec4 projPos = uVolLightProjMatrix * vec4(pos, 1.0);
				vec3 shadowCoord = projPos.xyz / projPos.w;
				return textureShadow(shadowAtlasTexture, vec3(shadowCoord.xy + tapOffset, shadowCoord.z));
			}
			vec2 uv = getCubemapAtlasCoordinates(uVolLightAtlas.xyz, shadowAtlasParams.y, shadowAtlasParams.x, lightVec);
			float shadowZ = length(lightVec) / uVolLightPosRange.w + uVolLightAtlas.w;
			return textureShadow(shadowAtlasTexture, vec3(uv + tapOffset, shadowZ));
		}
	#endif
	#ifdef VOL_COOKIES
		uniform sampler2D cookieAtlasTexture;
		uniform vec4 uVolLightCookieChannel;
		vec3 volSampleCookie(vec3 pos, vec3 lightVec) {
			if (uVolLightDir.w > 0.0) {
				return getCookie2DClustered(TEXTURE_PASS(cookieAtlasTexture), uVolLightProjMatrix, pos,
					uVolLightSpot.w, uVolLightCookieChannel);
			}
			return getCookieCubeClustered(TEXTURE_PASS(cookieAtlasTexture), lightVec, uVolLightSpot.w,
				uVolLightCookieChannel, shadowAtlasParams.x, shadowAtlasParams.y, uVolLightAtlas.xyz);
		}
	#endif
	float fogNoise(vec2 fragCoord) {
		const vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
		return fract(magic.z * fract(dot(fragCoord, magic.xy)));
	}
	float fogPhase(float cosTheta, float g) {
		float g2 = g * g;
		float denom = 1.0 + g2 - 2.0 * g * cosTheta;
		return (1.0 - g2) / (12.56637 * denom * sqrt(denom));
	}
	float volFogSegmentDepth(float s0, float s1, float h0, float rayDirY) {
		if (s1 <= s0) return 0.0;
		float density = uVolFogParams.x;
		float falloff = uVolFogParams.z;
		float hMid = h0 + rayDirY * (s0 + s1) * 0.5;
		if (hMid <= 0.0) {
			return density * (s1 - s0);
		}
		float scale = falloff * rayDirY;
		if (abs(scale) < 1e-6) {
			return density * exp(-falloff * hMid) * (s1 - s0);
		}
		return density * (exp(-falloff * (h0 + rayDirY * s0)) - exp(-falloff * (h0 + rayDirY * s1))) / scale;
	}
	vec2 volClipCone(vec2 span, float root, float gradient, float axial) {
		if (axial < 0.0) return span;
		return gradient > 0.0 ? vec2(max(span.x, root), span.y) : vec2(span.x, min(span.y, root));
	}
	float volFogOpticalDepth(float t, float rayDirY) {
		float h0 = uVolCameraPos.y - uVolFogParams.y;
		float sCross = abs(rayDirY) > 1e-6 ? clamp(-h0 / rayDirY, 0.0, t) : 0.0;
		float depth = volFogSegmentDepth(0.0, sCross, h0, rayDirY) +
					  volFogSegmentDepth(sCross, t, h0, rayDirY);
		return depth * uVolMarchParams.w;
	}
	void main() {
		vec2 ndcUV = uv0;
		#ifdef WEBGPU
			ndcUV.y = 1.0 - ndcUV.y;
		#endif
		vec2 ndc = ndcUV * 2.0 - 1.0;
		vec3 rayDir = normalize((uVolInvView * vec4(ndc * uVolProjScale, -1.0, 0.0)).xyz);
		float rayDot = max(dot(rayDir, uVolCameraFwd), 0.001);
		float sceneT = min(getLinearScreenDepth(uv0) / rayDot, uVolFogParams.w);
		vec3 sphereToCam = uVolCameraPos - uVolLightSphere.xyz;
		float halfB = dot(sphereToCam, rayDir);
		float c = dot(sphereToCam, sphereToCam) - uVolLightSphere.w * uVolLightSphere.w;
		float discriminant = halfB * halfB - c;
		if (discriminant <= 0.0) discard;
		float rootOffset = sqrt(discriminant);
		float t0 = max(-halfB - rootOffset, 0.0);
		float t1 = min(-halfB + rootOffset, sceneT);
		if (uVolLightDir.w > 0.0) {
			vec3 apexToCam = uVolCameraPos - uVolLightPosRange.xyz;
			float axisStart = dot(apexToCam, uVolLightDir.xyz);
			float axisRate = dot(rayDir, uVolLightDir.xyz);
			if (abs(axisRate) > 1e-6) {
				float tApex = -axisStart / axisRate;
				float tRange = (uVolLightPosRange.w - axisStart) / axisRate;
				t0 = max(t0, min(tApex, tRange));
				t1 = min(t1, max(tApex, tRange));
			} else if (axisStart < 0.0 || axisStart > uVolLightPosRange.w) {
				discard;
			}
			float cosSqr = uVolLightSpot.y * uVolLightSpot.y;
			float qa = axisRate * axisRate - cosSqr;
			float qb = axisRate * axisStart - cosSqr * dot(rayDir, apexToCam);
			float qc = axisStart * axisStart - cosSqr * dot(apexToCam, apexToCam);
			vec2 span = vec2(t0, t1);
			if (abs(qa) > 1e-6) {
				float discriminantCone = qb * qb - qa * qc;
				if (discriminantCone > 0.0) {
					float rootOffsetCone = sqrt(discriminantCone);
					float rootA = (-qb - rootOffsetCone) / qa;
					float rootB = (-qb + rootOffsetCone) / qa;
					span = volClipCone(span, rootA, qa * rootA + qb, axisStart + rootA * axisRate);
					span = volClipCone(span, rootB, qa * rootB + qb, axisStart + rootB * axisRate);
				}
			} else if (abs(qb) > 1e-6) {
				float root = -0.5 * qc / qb;
				span = volClipCone(span, root, qb, axisStart + root * axisRate);
			}
			t0 = span.x;
			t1 = span.y;
		}
		if (t1 <= t0) discard;
		float stepCount = uVolMarchParams.y;
		float dt = (t1 - t0) / stepCount;
		float noise = fract(fogNoise(gl_FragCoord.xy) + uVolMarchParams.z);
		vec3 inscatter = vec3(0.0);
		for (float i = 0.0; i < stepCount; i += 1.0) {
			float t = t0 + (i + noise) * dt;
			vec3 pos = uVolCameraPos + rayDir * t;
			float density = uVolFogParams.x * exp(-uVolFogParams.z * max(pos.y - uVolFogParams.y, 0.0));
			vec3 lightVec = pos - uVolLightPosRange.xyz;
			vec3 lightDirNorm = normalize(lightVec);
			float atten = uVolLightAtten.x > 0.0 ?
				getFalloffLinear(uVolLightPosRange.w, lightVec) :
				getFalloffInvSquared(uVolLightPosRange.w, lightVec);
			if (uVolLightDir.w > 0.0) {
				atten *= getSpotEffect(uVolLightDir.xyz, uVolLightSpot.x, uVolLightSpot.y, lightDirNorm);
			}
			if (atten > 0.00001) {
				#ifdef VOL_SHADOWS
					if (uVolLightSpot.z > 0.0) {
						float spiral = (i + noise) * 2.39996;
						atten *= mix(1.0, volSampleShadow(pos, lightVec, spiral), uVolLightSpot.z);
					}
				#endif
				vec3 radiance = uVolLightColor;
				#ifdef VOL_COOKIES
					if (uVolLightSpot.w > 0.0) {
						radiance *= volSampleCookie(pos, lightVec);
					}
				#endif
				float transmittance = exp(-volFogOpticalDepth(t, rayDir.y));
				float phase = fogPhase(dot(rayDir, -lightDirNorm), uVolMarchParams.x);
				inscatter += transmittance * uVolTint * radiance * (atten * phase * density * dt);
			}
		}
		gl_FragColor = vec4(inscatter, 1.0);
	}
`,Ai=`
	#include "screenDepthPS"
	#include "clusteredLightUtilsPS"
	fn square(x: f32) -> f32 {
		return x * x;
	}
	#include "falloffInvSquaredPS"
	#include "falloffLinearPS"
	#include "spotPS"
	#ifdef VOL_COOKIES
		#include "clusteredLightCookiesPS"
	#endif
	varying uv0: vec2f;
	uniform uVolCameraPos: vec3f;
	uniform uVolCameraFwd: vec3f;
	uniform uVolInvView: mat4x4f;
	uniform uVolProjScale: vec2f;
	uniform uVolTint: vec3f;
	uniform uVolFogParams: vec4f;
	uniform uVolMarchParams: vec4f;
	uniform uVolLightPosRange: vec4f;
	uniform uVolLightSphere: vec4f;
	uniform uVolLightColor: vec3f;
	uniform uVolLightDir: vec4f;
	uniform uVolLightSpot: vec4f;
	uniform uVolLightAtten: vec4f;
	#if defined(VOL_SHADOWS) || defined(VOL_COOKIES)
		uniform uVolLightProjMatrix: mat4x4f;
		uniform uVolLightAtlas: vec4f;
		uniform shadowAtlasParams: vec2f;
	#endif
	#ifdef VOL_SHADOWS
		var shadowAtlasTexture: texture_depth_2d;
		var shadowAtlasTextureSampler: sampler_comparison;
		fn volSampleShadow(pos: vec3f, lightVec: vec3f, spiral: f32) -> f32 {
			let tapOffset: vec2f = vec2f(cos(spiral), sin(spiral)) / uniform.shadowAtlasParams.x;
			if (uniform.uVolLightDir.w > 0.0) {
				let projPos: vec4f = uniform.uVolLightProjMatrix * vec4f(pos, 1.0);
				let shadowCoord: vec3f = projPos.xyz / projPos.w;
				return textureSampleCompareLevel(shadowAtlasTexture, shadowAtlasTextureSampler, shadowCoord.xy + tapOffset, shadowCoord.z);
			}
			let uv: vec2f = getCubemapAtlasCoordinates(uniform.uVolLightAtlas.xyz, uniform.shadowAtlasParams.y, uniform.shadowAtlasParams.x, lightVec);
			let shadowZ: f32 = length(lightVec) / uniform.uVolLightPosRange.w + uniform.uVolLightAtlas.w;
			return textureSampleCompareLevel(shadowAtlasTexture, shadowAtlasTextureSampler, uv + tapOffset, shadowZ);
		}
	#endif
	#ifdef VOL_COOKIES
		var cookieAtlasTexture: texture_2d<f32>;
		var cookieAtlasTextureSampler: sampler;
		uniform uVolLightCookieChannel: vec4f;
		fn volSampleCookie(pos: vec3f, lightVec: vec3f) -> vec3f {
			if (uniform.uVolLightDir.w > 0.0) {
				return getCookie2DClustered(cookieAtlasTexture, cookieAtlasTextureSampler, uniform.uVolLightProjMatrix,
					pos, uniform.uVolLightSpot.w, uniform.uVolLightCookieChannel);
			}
			return getCookieCubeClustered(cookieAtlasTexture, cookieAtlasTextureSampler, lightVec,
				uniform.uVolLightSpot.w, uniform.uVolLightCookieChannel, uniform.shadowAtlasParams.x,
				uniform.shadowAtlasParams.y, uniform.uVolLightAtlas.xyz);
		}
	#endif
	fn fogNoise(fragCoord: vec2f) -> f32 {
		const magic: vec3f = vec3f(0.06711056, 0.00583715, 52.9829189);
		return fract(magic.z * fract(dot(fragCoord, magic.xy)));
	}
	fn fogPhase(cosTheta: f32, g: f32) -> f32 {
		let g2: f32 = g * g;
		let denom: f32 = 1.0 + g2 - 2.0 * g * cosTheta;
		return (1.0 - g2) / (12.56637 * denom * sqrt(denom));
	}
	fn volFogSegmentDepth(s0: f32, s1: f32, h0: f32, rayDirY: f32) -> f32 {
		if (s1 <= s0) {
			return 0.0;
		}
		let density: f32 = uniform.uVolFogParams.x;
		let falloff: f32 = uniform.uVolFogParams.z;
		let hMid: f32 = h0 + rayDirY * (s0 + s1) * 0.5;
		if (hMid <= 0.0) {
			return density * (s1 - s0);
		}
		let scale: f32 = falloff * rayDirY;
		if (abs(scale) < 1e-6) {
			return density * exp(-falloff * hMid) * (s1 - s0);
		}
		return density * (exp(-falloff * (h0 + rayDirY * s0)) - exp(-falloff * (h0 + rayDirY * s1))) / scale;
	}
	fn volClipCone(span: vec2f, root: f32, gradient: f32, axial: f32) -> vec2f {
		if (axial < 0.0) {
			return span;
		}
		if (gradient > 0.0) {
			return vec2f(max(span.x, root), span.y);
		}
		return vec2f(span.x, min(span.y, root));
	}
	fn volFogOpticalDepth(t: f32, rayDirY: f32) -> f32 {
		let h0: f32 = uniform.uVolCameraPos.y - uniform.uVolFogParams.y;
		var sCross: f32 = 0.0;
		if (abs(rayDirY) > 1e-6) {
			sCross = clamp(-h0 / rayDirY, 0.0, t);
		}
		let depth: f32 = volFogSegmentDepth(0.0, sCross, h0, rayDirY) +
						volFogSegmentDepth(sCross, t, h0, rayDirY);
		return depth * uniform.uVolMarchParams.w;
	}
	@fragment
	fn fragmentMain(input: FragmentInput) -> FragmentOutput {
		var output: FragmentOutput;
		let ndcUV: vec2f = vec2f(input.uv0.x, 1.0 - input.uv0.y);
		let ndc: vec2f = ndcUV * 2.0 - 1.0;
		let rayDir: vec3f = normalize((uniform.uVolInvView * vec4f(ndc * uniform.uVolProjScale, -1.0, 0.0)).xyz);
		let rayDot: f32 = max(dot(rayDir, uniform.uVolCameraFwd), 0.001);
		let sceneT: f32 = min(getLinearScreenDepth(input.uv0) / rayDot, uniform.uVolFogParams.w);
		let sphereToCam: vec3f = uniform.uVolCameraPos - uniform.uVolLightSphere.xyz;
		let halfB: f32 = dot(sphereToCam, rayDir);
		let c: f32 = dot(sphereToCam, sphereToCam) - uniform.uVolLightSphere.w * uniform.uVolLightSphere.w;
		let discriminant: f32 = halfB * halfB - c;
		if (discriminant <= 0.0) {
			discard;
			return output;
		}
		let rootOffset: f32 = sqrt(discriminant);
		var t0: f32 = max(-halfB - rootOffset, 0.0);
		var t1: f32 = min(-halfB + rootOffset, sceneT);
		if (uniform.uVolLightDir.w > 0.0) {
			let apexToCam: vec3f = uniform.uVolCameraPos - uniform.uVolLightPosRange.xyz;
			let axisStart: f32 = dot(apexToCam, uniform.uVolLightDir.xyz);
			let axisRate: f32 = dot(rayDir, uniform.uVolLightDir.xyz);
			if (abs(axisRate) > 1e-6) {
				let tApex: f32 = -axisStart / axisRate;
				let tRange: f32 = (uniform.uVolLightPosRange.w - axisStart) / axisRate;
				t0 = max(t0, min(tApex, tRange));
				t1 = min(t1, max(tApex, tRange));
			} else if (axisStart < 0.0 || axisStart > uniform.uVolLightPosRange.w) {
				discard;
				return output;
			}
			let cosSqr: f32 = uniform.uVolLightSpot.y * uniform.uVolLightSpot.y;
			let qa: f32 = axisRate * axisRate - cosSqr;
			let qb: f32 = axisRate * axisStart - cosSqr * dot(rayDir, apexToCam);
			let qc: f32 = axisStart * axisStart - cosSqr * dot(apexToCam, apexToCam);
			var span: vec2f = vec2f(t0, t1);
			if (abs(qa) > 1e-6) {
				let discriminantCone: f32 = qb * qb - qa * qc;
				if (discriminantCone > 0.0) {
					let rootOffsetCone: f32 = sqrt(discriminantCone);
					let rootA: f32 = (-qb - rootOffsetCone) / qa;
					let rootB: f32 = (-qb + rootOffsetCone) / qa;
					span = volClipCone(span, rootA, qa * rootA + qb, axisStart + rootA * axisRate);
					span = volClipCone(span, rootB, qa * rootB + qb, axisStart + rootB * axisRate);
				}
			} else if (abs(qb) > 1e-6) {
				let root: f32 = -0.5 * qc / qb;
				span = volClipCone(span, root, qb, axisStart + root * axisRate);
			}
			t0 = span.x;
			t1 = span.y;
		}
		if (t1 <= t0) {
			discard;
			return output;
		}
		let stepCount: f32 = uniform.uVolMarchParams.y;
		let dt: f32 = (t1 - t0) / stepCount;
		let noise: f32 = fract(fogNoise(pcPosition.xy) + uniform.uVolMarchParams.z);
		var inscatter: vec3f = vec3f(0.0);
		for (var i: f32 = 0.0; i < stepCount; i += 1.0) {
			let t: f32 = t0 + (i + noise) * dt;
			let pos: vec3f = uniform.uVolCameraPos + rayDir * t;
			let density: f32 = uniform.uVolFogParams.x * exp(-uniform.uVolFogParams.z * max(pos.y - uniform.uVolFogParams.y, 0.0));
			let lightVec: vec3f = pos - uniform.uVolLightPosRange.xyz;
			let lightDirNorm: vec3f = normalize(lightVec);
			var atten: f32 = select(
				getFalloffInvSquared(uniform.uVolLightPosRange.w, lightVec),
				getFalloffLinear(uniform.uVolLightPosRange.w, lightVec),
				uniform.uVolLightAtten.x > 0.0);
			if (uniform.uVolLightDir.w > 0.0) {
				atten = atten * getSpotEffect(uniform.uVolLightDir.xyz, uniform.uVolLightSpot.x, uniform.uVolLightSpot.y, lightDirNorm);
			}
			if (atten > 0.00001) {
				#ifdef VOL_SHADOWS
					if (uniform.uVolLightSpot.z > 0.0) {
						let spiral: f32 = (i + noise) * 2.39996;
						atten = atten * mix(1.0, volSampleShadow(pos, lightVec, spiral), uniform.uVolLightSpot.z);
					}
				#endif
				var radiance: vec3f = uniform.uVolLightColor;
				#ifdef VOL_COOKIES
					if (uniform.uVolLightSpot.w > 0.0) {
						radiance = radiance * volSampleCookie(pos, lightVec);
					}
				#endif
				let transmittance: f32 = exp(-volFogOpticalDepth(t, rayDir.y));
				let phase: f32 = fogPhase(dot(rayDir, -lightDirNorm), uniform.uVolMarchParams.x);
				inscatter += transmittance * uniform.uVolTint * radiance * (atten * phase * density * dt);
			}
		}
		output.color = vec4f(inscatter, 1.0);
		return output;
	}
`,ji=`
	attribute vec2 aPosition;
	uniform vec4 uVolLightRect;
	varying vec2 uv0;
	void main(void)
	{
		vec2 ndc = mix(uVolLightRect.xy, uVolLightRect.zw, aPosition * 0.5 + 0.5);
		gl_Position = vec4(ndc, 0.0, 1.0);
		uv0 = getImageEffectUV(ndc * 0.5 + 0.5);
	}
`,Mi=`
	attribute aPosition: vec2f;
	uniform uVolLightRect: vec4f;
	varying uv0: vec2f;
	@vertex fn vertexMain(input: VertexInput) -> VertexOutput {
		var output: VertexOutput;
		let ndc: vec2f = mix(uniform.uVolLightRect.xy, uniform.uVolLightRect.zw, input.aPosition * 0.5 + 0.5);
		output.position = vec4f(ndc, 0.0, 1.0);
		output.uv0 = getImageEffectUV(ndc * 0.5 + 0.5);
		return output;
	}
`,Ni=new W,Pi=new W,Fi=new le,Ii=new Ge,Li=new Ge,Ri=new Ge,zi={rrr:[1,0,0,0],ggg:[0,1,0,0],bbb:[0,0,1,0],aaa:[0,0,0,1],rgb:[1,1,1,0]},Bi=[0,0,0,0],Vi=class extends m{light=null;shadowsEnabled=!1;lightRenderData=null;tint=new G(1,1,1);density=.01;heightBase=0;heightFalloff=.05;extinction=1;anisotropy=.6;intensity=1;ambientColor=new G(1,1,1);ambientIntensity=.02;maxDistance=300;steps=24;noiseOffset=0;exposure=1;_variantKey=null;constructor(e,t){super(e),this.cameraComponent=t;let n=e.scope;this.cameraPosId=n.resolve(`uFogCameraPos`),this.cameraFwdId=n.resolve(`uFogCameraFwd`),this.invViewId=n.resolve(`uFogInvView`),this.projScaleId=n.resolve(`uFogProjScale`),this.tintId=n.resolve(`uFogTint`),this.lightColorId=n.resolve(`uFogLightColor`),this.lightDirId=n.resolve(`uFogLightDir`),this.ambientId=n.resolve(`uFogAmbient`),this.fogParamsId=n.resolve(`uFogParams`),this.scatterParamsId=n.resolve(`uFogScatterParams`),this.extinctionId=n.resolve(`uFogExtinction`),this.shadowMapId=n.resolve(`uFogShadowMap`),this.shadowMatrixPaletteId=n.resolve(`uFogShadowMatrixPalette[0]`),this.shadowCascadeDistancesId=n.resolve(`uFogShadowCascadeDistances`),this.shadowParamsId=n.resolve(`uFogShadowParams`),this._cameraPos=new Float32Array(3),this._cameraFwd=new Float32Array(3),this._projScale=new Float32Array(2),this._tint=new Float32Array(3),this._lightColor=new Float32Array(3),this._lightDir=new Float32Array(3),this._ambient=new Float32Array(3),this._fogParams=new Float32Array(4),this._scatterParams=new Float32Array(4),this._shadowParams=new Float32Array(4)}updateShaderVariant(e,t){let n=`${e}-${t}${N.getScreenDepthChunkKey(this.cameraComponent.shaderParams)}`;if(this._variantKey!==n){this._variantKey=n;let r=new Map;N.addScreenDepthChunkDefines(this.cameraComponent.shaderParams,r),e&&r.set(`FOG_SHADOWS`,``),t&&r.set(`FOG_SHADOW_PCF`,``),this.shader=N.createShader(this.device,{uniqueName:`VolumetricFogShader-${n}`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`volumetricFogPS`,fragmentDefines:r})}}execute(){let{light:e}=this,t=this.cameraComponent.camera,n=t._node;this.invViewId.setValue(n.getWorldTransform().data);let r=n.getPosition();this._cameraPos[0]=r.x,this._cameraPos[1]=r.y,this._cameraPos[2]=r.z,this.cameraPosId.setValue(this._cameraPos);let i=n.forward;this._cameraFwd[0]=i.x,this._cameraFwd[1]=i.y,this._cameraFwd[2]=i.z,this.cameraFwdId.setValue(this._cameraFwd);let a=t.projectionMatrix.data;this._projScale[0]=1/a[0],this._projScale[1]=1/a[5],this.projScaleId.setValue(this._projScale);let o=this.intensity*this.exposure;if(e){e._node.getWorldTransform().getY(Ni).normalize(),this._lightDir[0]=Ni.x,this._lightDir[1]=Ni.y,this._lightDir[2]=Ni.z;let t=e._colorLinear;this._lightColor[0]=t[0]*o,this._lightColor[1]=t[1]*o,this._lightColor[2]=t[2]*o}else this._lightDir[0]=0,this._lightDir[1]=1,this._lightDir[2]=0,this._lightColor[0]=0,this._lightColor[1]=0,this._lightColor[2]=0;if(this.lightDirId.setValue(this._lightDir),this.lightColorId.setValue(this._lightColor),this.shadowsEnabled&&e&&this.lightRenderData){let t=this.lightRenderData,n=e._getUniformBiasValues(t);this.shadowMapId.setValue(t.shadowBuffer),this.shadowMatrixPaletteId.setValue(e._shadowMatrixPalette),this.shadowCascadeDistancesId.setValue(e._shadowCascadeDistances),this._shadowParams[0]=e.numCascades,this._shadowParams[1]=n.bias,this._shadowParams[2]=0,this._shadowParams[3]=e.shadowDistance,this.shadowParamsId.setValue(this._shadowParams)}let{tint:s,ambientColor:c,ambientIntensity:l}=this;this._tint[0]=s.r,this._tint[1]=s.g,this._tint[2]=s.b,this.tintId.setValue(this._tint);let u=l*this.exposure;this._ambient[0]=c.r*u,this._ambient[1]=c.g*u,this._ambient[2]=c.b*u,this.ambientId.setValue(this._ambient),this._fogParams[0]=this.density,this._fogParams[1]=this.heightBase,this._fogParams[2]=this.heightFalloff,this._fogParams[3]=this.maxDistance,this.fogParamsId.setValue(this._fogParams),this.extinctionId.setValue(this.extinction),this._scatterParams[0]=this.anisotropy,this._scatterParams[1]=this.steps,this._scatterParams[2]=this.noiseOffset,this._scatterParams[3]=e?e.shadowIntensity:1,this.scatterParamsId.setValue(this._scatterParams),super.execute()}},Hi=class extends m{scenePass=null;omniLights=!0;spotLights=!0;tint=new G(1,1,1);density=.01;heightBase=0;heightFalloff=.05;extinction=1;anisotropy=.6;intensity=1;maxDistance=300;steps=12;noiseOffset=0;exposure=1;_variantKey=null;constructor(e,t){super(e),this.cameraComponent=t,this.blendState=new Ae(!0,0,1,1,0,0,1);let n=e.scope;this.cameraPosId=n.resolve(`uVolCameraPos`),this.cameraFwdId=n.resolve(`uVolCameraFwd`),this.invViewId=n.resolve(`uVolInvView`),this.projScaleId=n.resolve(`uVolProjScale`),this.tintId=n.resolve(`uVolTint`),this.fogParamsId=n.resolve(`uVolFogParams`),this.marchParamsId=n.resolve(`uVolMarchParams`),this.lightRectId=n.resolve(`uVolLightRect`),this.lightPosRangeId=n.resolve(`uVolLightPosRange`),this.lightSphereId=n.resolve(`uVolLightSphere`),this.lightColorId=n.resolve(`uVolLightColor`),this.lightDirId=n.resolve(`uVolLightDir`),this.lightSpotId=n.resolve(`uVolLightSpot`),this.lightAttenId=n.resolve(`uVolLightAtten`),this.lightProjMatrixId=n.resolve(`uVolLightProjMatrix`),this.lightAtlasId=n.resolve(`uVolLightAtlas`),this.lightCookieChannelId=n.resolve(`uVolLightCookieChannel`),this._cameraPos=new Float32Array(3),this._cameraFwd=new Float32Array(3),this._projScale=new Float32Array(2),this._tint=new Float32Array(3),this._fogParams=new Float32Array(4),this._marchParams=new Float32Array(4),this._lightRect=new Float32Array(4),this._lightPosRange=new Float32Array(4),this._lightSphere=new Float32Array(4),this._lightColor=new Float32Array(3),this._lightDir=new Float32Array(4),this._lightSpot=new Float32Array(4),this._lightAtten=new Float32Array(4),this._lightAtlas=new Float32Array(4)}updateShaderVariant(e,t){let n=`${e}-${t}${N.getScreenDepthChunkKey(this.cameraComponent.shaderParams)}`;if(this._variantKey!==n){this._variantKey=n;let r=new Map;N.addScreenDepthChunkDefines(this.cameraComponent.shaderParams,r),e&&r.set(`VOL_SHADOWS`,``),t&&r.set(`VOL_COOKIES`,``),this.shader=N.createShader(this.device,{uniqueName:`VolumetricFogLocalShader-${n}`,attributes:{aPosition:U},vertexChunk:`volumetricFogLocalVS`,fragmentChunk:`volumetricFogLocalPS`,fragmentDefines:r})}}_getLightClusters(){let e=this.scenePass?.layerRenderSteps;if(e)for(let t=0;t<e.length;t++){let n=e[t].lightClusters;if(n&&n.usedLights.length>1)return n}return null}_evalLightRect(e,t,n){e.getBoundingSphere(Fi);let r=Fi.radius;if(t.viewMatrix.transformPoint(Fi.center,Pi),-Pi.z-r<=t.nearClip)return n.set(-1,-1,1,1),!0;let i=t.projectionMatrix,a=1/0,o=1/0,s=-1/0,c=-1/0;for(let e=0;e<8;e++){Ii.set(Pi.x+(e&1?r:-r),Pi.y+(e&2?r:-r),Pi.z+(e&4?r:-r),1),i.transformVec4(Ii,Li);let t=Li.x/Li.w,n=Li.y/Li.w;a=Math.min(a,t),o=Math.min(o,n),s=Math.max(s,t),c=Math.max(c,n)}return n.set(Math.max(a,-1),Math.max(o,-1),Math.min(s,1),Math.min(c,1)),n.x<n.z&&n.y<n.w}_setupLight(e,t,n){let r=this.cameraComponent.camera,i=e._type===2;if(!this._evalLightRect(e,r,Ri))return!1;this._lightRect[0]=Ri.x,this._lightRect[1]=Ri.y,this._lightRect[2]=Ri.z,this._lightRect[3]=Ri.w,this.lightRectId.setValue(this._lightRect),this._lightSphere[0]=Fi.center.x,this._lightSphere[1]=Fi.center.y,this._lightSphere[2]=Fi.center.z,this._lightSphere[3]=Fi.radius,this.lightSphereId.setValue(this._lightSphere);let a=e._node.getPosition();this._lightPosRange[0]=a.x,this._lightPosRange[1]=a.y,this._lightPosRange[2]=a.z,this._lightPosRange[3]=e.attenuationEnd,this.lightPosRangeId.setValue(this._lightPosRange);let o=this.intensity*this.exposure*e.volumetricScattering,s=e._colorLinear;this._lightColor[0]=s[0]*o,this._lightColor[1]=s[1]*o,this._lightColor[2]=s[2]*o,this.lightColorId.setValue(this._lightColor),i&&e._node.getWorldTransform().getY(Ni).mulScalar(-1).normalize(),this._lightDir[0]=i?Ni.x:0,this._lightDir[1]=i?Ni.y:0,this._lightDir[2]=i?Ni.z:0,this._lightDir[3]=+!!i,this.lightDirId.setValue(this._lightDir),this._lightAtten[0]=+(e._falloffMode===0),this.lightAttenId.setValue(this._lightAtten);let c=e.atlasViewportAllocated,l=t&&c&&e.castShadows,u=l&&e.shadowIntensity>0,d=n&&c&&!!e._cookie&&e.cookieIntensity>0;if(this._lightSpot[0]=e._innerConeAngleCos,this._lightSpot[1]=e._outerConeAngleCos,this._lightSpot[2]=u?e.shadowIntensity:0,this._lightSpot[3]=d?e.cookieIntensity:0,this.lightSpotId.setValue(this._lightSpot),t||n){let t=l?e.getRenderData(null,0):null;if(i){let n=t?.shadowMatrix??(d?O.evalSpotCookieMatrix(e):J.IDENTITY);this.lightProjMatrixId.setValue(n.data)}else this.lightProjMatrixId.setValue(J.IDENTITY.data);let n=e.atlasViewport;this._lightAtlas[0]=n.x,this._lightAtlas[1]=n.y,this._lightAtlas[2]=n.z/3,this._lightAtlas[3]=t?e._getUniformBiasValues(t).bias:0,this.lightAtlasId.setValue(this._lightAtlas)}return n&&this.lightCookieChannelId.setValue(d?zi[e._cookieChannel]??zi.rgb:Bi),!0}execute(){let e=this._getLightClusters();if(!e||!this.quadRender)return;let t=this.cameraComponent.camera,n=t._node,{lighting:r}=this.cameraComponent.system.app.scene;this.invViewId.setValue(n.getWorldTransform().data);let i=n.getPosition();this._cameraPos[0]=i.x,this._cameraPos[1]=i.y,this._cameraPos[2]=i.z,this.cameraPosId.setValue(this._cameraPos);let a=n.forward;this._cameraFwd[0]=a.x,this._cameraFwd[1]=a.y,this._cameraFwd[2]=a.z,this.cameraFwdId.setValue(this._cameraFwd);let o=t.projectionMatrix.data;this._projScale[0]=1/o[0],this._projScale[1]=1/o[5],this.projScaleId.setValue(this._projScale);let{tint:s}=this;this._tint[0]=s.r,this._tint[1]=s.g,this._tint[2]=s.b,this.tintId.setValue(this._tint),this._fogParams[0]=this.density,this._fogParams[1]=this.heightBase,this._fogParams[2]=this.heightFalloff,this._fogParams[3]=this.maxDistance,this.fogParamsId.setValue(this._fogParams),this._marchParams[0]=this.anisotropy,this._marchParams[1]=this.steps,this._marchParams[2]=this.noiseOffset,this._marchParams[3]=this.extinction,this.marchParamsId.setValue(this._marchParams),this.device.setDrawStates(this.blendState,this.depthState,this.cullMode,this.frontFace,this.stencilFront,this.stencilBack);let{shadowsEnabled:c,cookiesEnabled:l}=r,{omniLights:u,spotLights:d}=this,f=e.usedLights;for(let e=1;e<f.length;e++){let t=f[e].light;t?.volumetricScattering>0&&(t._type===2?d:u)&&this._setupLight(t,c,l)&&this.quadRender.render()}}},Ui=class extends m{constructor(e,t,n){super(e),this.fogTexture=n;let r=new Map,i=N.addScreenDepthChunkDefines(t.shaderParams,r);this.shader=N.createShader(e,{uniqueName:`VolumetricFogCombineShader${i}`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`volumetricFogCombinePS`,fragmentDefines:r}),this.blendState=new Ae(!0,0,1,6,0,0,1),this.fogTextureId=e.scope.resolve(`uFogTexture`),this.fogTextureSizeId=e.scope.resolve(`uFogTextureSize`),this._fogTextureSize=new Float32Array(4)}execute(){let{fogTexture:e}=this;this.fogTextureId.setValue(e),this._fogTextureSize[0]=e.width,this._fogTextureSize[1]=e.height,this._fogTextureSize[2]=1/e.width,this._fogTextureSize[3]=1/e.height,this.fogTextureSizeId.setValue(this._fogTextureSize),super.execute()}},Wi=class extends Ee{light=null;tint=new G(1,1,1);density=.01;heightBase=0;heightFalloff=.05;extinction=1;anisotropy=.6;intensity=1;ambientColor=new G(1,1,1);ambientIntensity=.02;maxDistance=300;steps=24;temporalDither=!1;localOmniLights=!1;localSpotLights=!1;localIntensity=1;localSteps=12;_scale=.5;_frameIndex=0;constructor(e,t,n,r,i=null){super(e),this.cameraComponent=t,Y.get(e,Te).set(`volumetricFogPS`,Ti),Y.get(e,K).set(`volumetricFogPS`,Ei),Y.get(e,Te).set(`volumetricFogCombinePS`,Di),Y.get(e,K).set(`volumetricFogCombinePS`,Oi),Y.get(e,Te).set(`volumetricFogLocalPS`,ki),Y.get(e,K).set(`volumetricFogLocalPS`,Ai),Y.get(e,Te).set(`volumetricFogLocalVS`,ji),Y.get(e,K).set(`volumetricFogLocalVS`,Mi);let a=e.getRenderableHdrFormat([12,14],!0,1)??7;this.fogTexture=new H(e,{name:`VolumetricFogTexture`,width:4,height:4,format:a,mipmaps:!1,minFilter:1,magFilter:1,addressU:1,addressV:1}),this.fogRenderTarget=new Ze({name:`VolumetricFogRT`,colorBuffer:this.fogTexture,depth:!1}),this.fogPass=new Vi(e,t),this.fogPass.init(this.fogRenderTarget,{resizeSource:n,scaleX:this._scale,scaleY:this._scale}),this.fogPass.setClearColor(new G(0,0,0,1)),this.beforePasses.push(this.fogPass),this.localPass=new Hi(e,t),this.localPass.scenePass=i,this.localPass.init(this.fogRenderTarget),this.beforePasses.push(this.localPass),this.combinePass=new Ui(e,t,this.fogTexture),this.combinePass.init(r),this.beforePasses.push(this.combinePass)}destroy(){this.beforePasses.forEach(e=>e.destroy()),this.beforePasses.length=0,this.fogPass=null,this.localPass=null,this.combinePass=null,this.fogRenderTarget&&(this.fogRenderTarget.destroyTextureBuffers(),this.fogRenderTarget.destroy(),this.fogRenderTarget=null,this.fogTexture=null)}set scale(e){this._scale=e,this.fogPass.scaleX=e,this.fogPass.scaleY=e}get scale(){return this._scale}frameUpdate(){super.frameUpdate();let{light:e,fogPass:t,localPass:n}=this,r=this.cameraComponent.camera,i=this.cameraComponent.system.app.scene,a=!1,o=!1,s=null;e&&e.castShadows&&e.shadowIntensity>0&&(s=e.getRenderData(r,0),s.shadowBuffer&&(a=!0,o=!!at.get(e._shadowType)?.pcf)),t.updateShaderVariant(a,o),t.shadowsEnabled=a,t.lightRenderData=a?s:null,t.light=e,t.tint.copy(this.tint),t.density=this.density,t.heightBase=this.heightBase,t.heightFalloff=this.heightFalloff,t.extinction=this.extinction,t.anisotropy=this.anisotropy,t.intensity=this.intensity,t.ambientColor.copy(this.ambientColor),t.ambientIntensity=this.ambientIntensity,t.maxDistance=this.maxDistance,t.steps=Math.max(1,Math.floor(this.steps)),t.exposure=i.exposure,this._frameIndex=(this._frameIndex+1)%16,t.noiseOffset=this.temporalDither?this._frameIndex*.618034:0;let{localOmniLights:c,localSpotLights:l}=this;if(n.enabled=(c||l)&&i.clusteredLightingEnabled,n.enabled){let{shadowsEnabled:e,cookiesEnabled:r}=i.lighting;n.updateShaderVariant(e,r),n.omniLights=c,n.spotLights=l,n.tint.copy(this.tint),n.density=this.density,n.heightBase=this.heightBase,n.heightFalloff=this.heightFalloff,n.extinction=this.extinction,n.anisotropy=this.anisotropy,n.maxDistance=this.maxDistance,n.intensity=this.localIntensity,n.steps=Math.max(1,Math.floor(this.localSteps)),n.exposure=i.exposure,n.noiseOffset=t.noiseOffset}}},Gi=[],Ki=`uSceneDepthMap`,qi=class extends me{linearDepthTexture;linearDepthClearValue=new G(0,0,0,0);_qualifiedLayerIndices=[];constructor(e,t,n,r,i){super(e),this.scene=t,this.renderer=n,this.camera=r,this.setupRenderTarget(i)}destroy(){super.destroy(),this.camera.shaderParams.sceneDepthMapLinear=!1,this.camera.shaderParams.sceneDepthMapPacked=!1,this.camera.shaderParams.sceneDepthMapReciprocal=!1,this.renderTarget?.destroy(),this.renderTarget=null,this.linearDepthTexture?.destroy(),this.linearDepthTexture=null}setupRenderTarget(e){let{device:t}=this;this.linearDepthFormat=t.textureFloatRenderable?15:7,this.linearDepthTexture=H.createDataTexture2D(t,`SceneLinearDepthTexture`,1,1,this.linearDepthFormat);let n=new Ze({name:`PrepassRT`,colorBuffer:this.linearDepthTexture,depth:!0,samples:1}),{shaderParams:r}=this.camera;r.sceneDepthMapLinear=!0,r.sceneDepthMapPacked=this.linearDepthFormat===7,r.sceneDepthMapReciprocal=!1,this.init(n,e)}after(){this.device.scope.resolve(Ki).setValue(this.linearDepthTexture),this.camera.camera.publishSceneDepthMap(this.linearDepthTexture,this.device.renderVersion)}execute(){let{renderer:e,scene:t,renderTarget:n}=this,r=this.camera.camera,i=t.layers.layerList,a=t.layers.subLayerList;for(let t of this._qualifiedLayerIndices){let o=i[t].getCulledInstances(r),s=a[t]?o.transparent:o.opaque;for(let e=0;e<s.length;e++){let t=s[e];t.material?.depthWrite&&Gi.push(t)}e.renderForwardLayer(r,n,null,void 0,1,{meshInstances:Gi}),Gi.length=0}}frameUpdate(){super.frameUpdate();let{camera:e}=this;this.setClearDepth(e.clearDepthBuffer?1:void 0);let t;if(e.clearDepthBuffer){let n=e.farClip-Number.MIN_VALUE;t=this.linearDepthClearValue,this.linearDepthFormat===15?t.r=n:y.float2RGBA8(n,t)}this.setClearColor(t);let{renderer:n,scene:r}=this,i=this.camera.camera,a=r.layers,o=a.layerList,s=this._qualifiedLayerIndices;s.length=0;for(let e=0;e<o.length&&o[e].id!==1;e++)a.isSubLayerRenderedByCamera(e,i)&&(s.push(e),n.culler.requestMeshInstanceCull(i,o[e]))}},Ji=`
	#include "screenDepthPS"
	varying vec2 uv0;
	uniform sampler2D sourceTexture;
	uniform vec2 sourceInvResolution;
	uniform int filterSize;
	float random(const highp vec2 w) {
		const vec3 m = vec3(0.06711056, 0.00583715, 52.9829189);
		return fract(m.z * fract(dot(w, m.xy)));
	}
	mediump float bilateralWeight(in mediump float depth, in mediump float sampleDepth) {
		mediump float diff = (sampleDepth - depth);
		return max(0.0, 1.0 - diff * diff);
	}
	void tap(inout float sum, inout float totalWeight, float weight, float depth, vec2 position) {
		mediump float color = texture2D(sourceTexture, position).r;
		mediump float textureDepth = -getLinearScreenDepth(position);
	
		mediump float bilateral = bilateralWeight(depth, textureDepth);
		bilateral *= weight;
		sum += color * bilateral;
		totalWeight += bilateral;
	}
	void main() {
		mediump float depth = -getLinearScreenDepth(uv0);
		mediump float totalWeight = 1.0;
		mediump float color = texture2D(sourceTexture, uv0 ).r;
		mediump float sum = color * totalWeight;
		for (mediump int i = -filterSize; i <= filterSize; i++) {
			mediump float weight = 1.0;
			#ifdef HORIZONTAL
				vec2 offset = vec2(i, 0) * sourceInvResolution;
			#else
				vec2 offset = vec2(0, i) * sourceInvResolution;
			#endif
			tap(sum, totalWeight, weight, depth, uv0 + offset);
		}
		mediump float ao = sum / totalWeight;
		gl_FragColor.r = ao;
	}
`,Yi=`
#include "screenDepthPS"
varying uv0: vec2f;
var sourceTexture: texture_2d<f32>;
var sourceTextureSampler: sampler;
uniform sourceInvResolution: vec2f;
uniform filterSize: i32;
fn random(w: vec2f) -> f32 {
	const m: vec3f = vec3f(0.06711056, 0.00583715, 52.9829189);
	return fract(m.z * fract(dot(w, m.xy)));
}
fn bilateralWeight(depth: f32, sampleDepth: f32) -> f32 {
	let diff: f32 = (sampleDepth - depth);
	return max(0.0, 1.0 - diff * diff);
}
fn tap(sum_ptr: ptr<function, f32>, totalWeight_ptr: ptr<function, f32>, weight: f32, depth: f32, position: vec2f) {
	let color: f32 = textureSample(sourceTexture, sourceTextureSampler, position).r;
	let textureDepth: f32 = -getLinearScreenDepth(position);
	let bilateral: f32 = bilateralWeight(depth, textureDepth) * weight;
	*sum_ptr = *sum_ptr + color * bilateral;
	*totalWeight_ptr = *totalWeight_ptr + bilateral;
}
@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
	var output: FragmentOutput;
	let depth: f32 = -getLinearScreenDepth(input.uv0);
	var totalWeight: f32 = 1.0;
	let color: f32 = textureSample(sourceTexture, sourceTextureSampler, input.uv0 ).r;
	var sum: f32 = color * totalWeight;
	for (var i: i32 = -uniform.filterSize; i <= uniform.filterSize; i = i + 1) {
		let weight: f32 = 1.0;
		#ifdef HORIZONTAL
			var offset: vec2f = vec2f(f32(i), 0.0) * uniform.sourceInvResolution;
		#else
			var offset: vec2f = vec2f(0.0, f32(i)) * uniform.sourceInvResolution;
		#endif
		tap(&sum, &totalWeight, weight, depth, input.uv0 + offset);
	}
	let ao: f32 = sum / totalWeight;
	output.color = vec4f(ao, ao, ao, 1.0);
	return output;
}
`,Xi=class extends m{constructor(e,t,n,r){super(e),this.sourceTexture=t,Y.get(e,Te).set(`depthAwareBlurPS`,Ji),Y.get(e,K).set(`depthAwareBlurPS`,Yi);let i=new Map;r&&i.set(`HORIZONTAL`,``);let a=N.addScreenDepthChunkDefines(n.shaderParams,i);this.shader=N.createShader(e,{uniqueName:`DepthAware${r?`Horizontal`:`Vertical`}BlurShader${a}`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`depthAwareBlurPS`,fragmentDefines:i});let o=this.device.scope;this.sourceTextureId=o.resolve(`sourceTexture`),this.sourceInvResolutionId=o.resolve(`sourceInvResolution`),this.sourceInvResolutionValue=new Float32Array(2),this.filterSizeId=o.resolve(`filterSize`)}execute(){this.filterSizeId.setValue(4),this.sourceTextureId.setValue(this.sourceTexture);let{width:e,height:t}=this.sourceTexture;this.sourceInvResolutionValue[0]=1/e,this.sourceInvResolutionValue[1]=1/t,this.sourceInvResolutionId.setValue(this.sourceInvResolutionValue),super.execute()}},Zi=`
	#include "screenDepthPS"
	
	varying vec2 uv0;
	uniform vec2 uInvResolution;
	uniform float uAspect;
	#define saturate(x) clamp(x,0.0,1.0)
	highp float getWFromProjectionMatrix(const mat4 p, const vec3 v) {
		return -v.z;
	}
	highp float getViewSpaceZFromW(const mat4 p, const float w) {
		return -w;
	}
	const float kLog2LodRate = 3.0;
	float random(const highp vec2 w) {
		const vec3 m = vec3(0.06711056, 0.00583715, 52.9829189);
		return fract(m.z * fract(dot(w, m.xy)));
	}
	highp vec2 getFragCoord() {
		return gl_FragCoord.xy;
	}
	highp vec3 computeViewSpacePositionFromDepth(highp vec2 uv, highp float linearDepth) {
		return vec3((0.5 - uv) * vec2(uAspect, 1.0) * linearDepth, linearDepth);
	}
	highp vec2 snapToDepthTexelCenter(const highp vec2 uv) {
		vec2 size = vec2(textureSize(uSceneDepthMap, 0));
		return (floor(uv * size) + 0.5) / size;
	}
	highp vec3 faceNormal(highp vec3 dpdx, highp vec3 dpdy) {
		return normalize(cross(dpdx, dpdy));
	}
	highp vec3 computeViewSpaceNormal(const highp vec3 position) {
		return faceNormal(dFdx(position), dFdy(position));
	}
	highp vec3 computeViewSpaceNormal(const highp vec3 position, const highp vec2 uv) {
		highp vec2 uvdx = snapToDepthTexelCenter(uv + vec2(uInvResolution.x, 0.0));
		highp vec2 uvdy = snapToDepthTexelCenter(uv + vec2(0.0, uInvResolution.y));
		highp vec3 px = computeViewSpacePositionFromDepth(uvdx, -getLinearScreenDepth(uvdx));
		highp vec3 py = computeViewSpacePositionFromDepth(uvdy, -getLinearScreenDepth(uvdy));
		highp vec3 dpdx = px - position;
		highp vec3 dpdy = py - position;
		return faceNormal(dpdx, dpdy);
	}
	uniform vec2 uSampleCount;
	uniform float uSpiralTurns;
	#define PI (3.14159)
	mediump vec3 tapLocation(mediump float i, const mediump float noise) {
		mediump float offset = ((2.0 * PI) * 2.4) * noise;
		mediump float angle = ((i * uSampleCount.y) * uSpiralTurns) * (2.0 * PI) + offset;
		mediump float radius = (i + noise + 0.5) * uSampleCount.y;
		return vec3(cos(angle), sin(angle), radius * radius);
	}
	highp vec2 startPosition(const float noise) {
		float angle = ((2.0 * PI) * 2.4) * noise;
		return vec2(cos(angle), sin(angle));
	}
	uniform vec2 uAngleIncCosSin;
	highp mat2 tapAngleStep() {
		highp vec2 t = uAngleIncCosSin;
		return mat2(t.x, t.y, -t.y, t.x);
	}
	mediump vec3 tapLocationFast(mediump float i, mediump vec2 p, const mediump float noise) {
		mediump float radius = (i + noise + 0.5) * uSampleCount.y;
		return vec3(p, radius * radius);
	}
	uniform float uMaxLevel;
	uniform float uInvRadiusSquared;
	uniform float uMinHorizonAngleSineSquared;
	uniform float uBias;
	uniform float uPeak2;
	void computeAmbientOcclusionSAO(inout mediump float occlusion, mediump float i, mediump float ssDiskRadius,
			const highp vec2 uv, const highp vec3 origin, const mediump vec3 normal,
			const mediump vec2 tapPosition, const float noise) {
		mediump vec3 tap = tapLocationFast(i, tapPosition, noise);
		mediump float ssRadius = max(1.0, tap.z * ssDiskRadius);
		mediump vec2 uvSamplePos = snapToDepthTexelCenter(uv + vec2(ssRadius * tap.xy) * uInvResolution);
		mediump float level = clamp(floor(log2(ssRadius)) - kLog2LodRate, 0.0, float(uMaxLevel));
		highp float occlusionDepth = -getLinearScreenDepth(uvSamplePos);
		highp vec3 p = computeViewSpacePositionFromDepth(uvSamplePos, occlusionDepth);
		vec3 v = p - origin;
		float vv = dot(v, v);
		float vn = dot(v, normal);
		mediump float w = max(0.0, 1.0 - vv * uInvRadiusSquared);
		w = w * w;
		w *= step(vv * uMinHorizonAngleSineSquared, vn * vn);
		occlusion += w * max(0.0, vn + origin.z * uBias) / (vv + uPeak2);
	}
	uniform float uProjectionScaleRadius;
	uniform float uIntensity;
	uniform float uRandomize;
	float scalableAmbientObscurance(highp vec2 uv, highp vec3 origin, vec3 normal) {
		float noise = random(getFragCoord()) + uRandomize;
		highp vec2 tapPosition = startPosition(noise);
		highp mat2 angleStep = tapAngleStep();
		float ssDiskRadius = -(uProjectionScaleRadius / origin.z);
		float occlusion = 0.0;
		for (float i = 0.0; i < uSampleCount.x; i += 1.0) {
			computeAmbientOcclusionSAO(occlusion, i, ssDiskRadius, uv, origin, normal, tapPosition, noise);
			tapPosition = angleStep * tapPosition;
		}
		return occlusion;
	}
	uniform float uPower;
	void main() {
		highp vec2 uv = snapToDepthTexelCenter(uv0);
		highp float depth = -getLinearScreenDepth(uv);
		highp vec3 origin = computeViewSpacePositionFromDepth(uv, depth);
		vec3 normal = computeViewSpaceNormal(origin, uv);
		float occlusion = 0.0;
		if (uIntensity > 0.0) {
			occlusion = scalableAmbientObscurance(uv, origin, normal);
		}
		float ao = max(0.0, 1.0 - occlusion * uIntensity);
		ao = pow(ao, uPower);
		gl_FragColor = vec4(ao, ao, ao, 1.0);
	}
`,Qi=`
	#include "screenDepthPS"
	varying uv0: vec2f;
	uniform uInvResolution: vec2f;
	uniform uAspect: f32;
	fn getWFromProjectionMatrix(p: mat4x4f, v: vec3f) -> f32 {
		return -v.z;
	}
	fn getViewSpaceZFromW(p: mat4x4f, w: f32) -> f32 {
		return -w;
	}
	const kLog2LodRate: f32 = 3.0;
	fn random(w: vec2f) -> f32 {
		const m: vec3f = vec3f(0.06711056, 0.00583715, 52.9829189);
		return fract(m.z * fract(dot(w, m.xy)));
	}
	fn getFragCoord() -> vec2f {
		return pcPosition.xy;
	}
	fn computeViewSpacePositionFromDepth(uv: vec2f, linearDepth: f32) -> vec3f {
		return vec3f((0.5 - uv) * vec2f(uniform.uAspect, 1.0) * linearDepth, linearDepth);
	}
	fn snapToDepthTexelCenter(uv: vec2f) -> vec2f {
		let size: vec2f = vec2f(textureDimensions(uSceneDepthMap, 0));
		return (floor(uv * size) + vec2f(0.5)) / size;
	}
	fn faceNormal(dpdx: vec3f, dpdy: vec3f) -> vec3f {
		return normalize(cross(dpdx, dpdy));
	}
	fn computeViewSpaceNormalDeriv(position: vec3f) -> vec3f {
		return faceNormal(dpdx(position), dpdy(position));
	}
	fn computeViewSpaceNormalDepth(position: vec3f, uv: vec2f) -> vec3f {
		let uvdx: vec2f = snapToDepthTexelCenter(uv + vec2f(uniform.uInvResolution.x, 0.0));
		let uvdy: vec2f = snapToDepthTexelCenter(uv + vec2f(0.0, uniform.uInvResolution.y));
		let px: vec3f = computeViewSpacePositionFromDepth(uvdx, -getLinearScreenDepth(uvdx));
		let py: vec3f = computeViewSpacePositionFromDepth(uvdy, -getLinearScreenDepth(uvdy));
		let dpdx: vec3f = px - position;
		let dpdy: vec3f = py - position;
		return faceNormal(dpdx, dpdy);
	}
	uniform uSampleCount: vec2f;
	uniform uSpiralTurns: f32;
	const PI: f32 = 3.14159;
	fn tapLocation(i: f32, noise: f32) -> vec3f {
		let offset: f32 = ((2.0 * PI) * 2.4) * noise;
		let angle: f32 = ((i * uniform.uSampleCount.y) * uniform.uSpiralTurns) * (2.0 * PI) + offset;
		let radius: f32 = (i + noise + 0.5) * uniform.uSampleCount.y;
		return vec3f(cos(angle), sin(angle), radius * radius);
	}
	fn startPosition(noise: f32) -> vec2f {
		let angle: f32 = ((2.0 * PI) * 2.4) * noise;
		return vec2f(cos(angle), sin(angle));
	}
	uniform uAngleIncCosSin: vec2f;
	fn tapAngleStep() -> mat2x2f {
		let t: vec2f = uniform.uAngleIncCosSin;
		return mat2x2f(vec2f(t.x, t.y), vec2f(-t.y, t.x));
	}
	fn tapLocationFast(i: f32, p: vec2f, noise_in: f32) -> vec3f {
		let radius: f32 = (i + noise_in + 0.5) * uniform.uSampleCount.y;
		return vec3f(p.x, p.y, radius * radius);
	}
	uniform uMaxLevel: f32;
	uniform uInvRadiusSquared: f32;
	uniform uMinHorizonAngleSineSquared: f32;
	uniform uBias: f32;
	uniform uPeak2: f32;
	fn computeAmbientOcclusionSAO(occlusion_ptr: ptr<function, f32>, i: f32, ssDiskRadius: f32,
			uv: vec2f, origin: vec3f, normal: vec3f,
			tapPosition: vec2f, noise: f32) {
		let tap: vec3f = tapLocationFast(i, tapPosition, noise);
		let ssRadius: f32 = max(1.0, tap.z * ssDiskRadius);
		let uvSamplePos: vec2f = snapToDepthTexelCenter(uv + (ssRadius * tap.xy) * uniform.uInvResolution);
		let level: f32 = clamp(floor(log2(ssRadius)) - kLog2LodRate, 0.0, uniform.uMaxLevel);
		let occlusionDepth: f32 = -getLinearScreenDepth(uvSamplePos);
		let p: vec3f = computeViewSpacePositionFromDepth(uvSamplePos, occlusionDepth);
		let v: vec3f = p - origin;
		let vv: f32 = dot(v, v);
		let vn: f32 = dot(v, normal);
		var w_val: f32 = max(0.0, 1.0 - vv * uniform.uInvRadiusSquared);
		w_val = w_val * w_val;
		w_val = w_val * step(vv * uniform.uMinHorizonAngleSineSquared, vn * vn);
		*occlusion_ptr = *occlusion_ptr + w_val * max(0.0, vn + origin.z * uniform.uBias) / (vv + uniform.uPeak2);
	}
	uniform uProjectionScaleRadius: f32;
	uniform uIntensity: f32;
	uniform uRandomize: f32;
	fn scalableAmbientObscurance(uv: vec2f, origin: vec3f, normal: vec3f) -> f32 {
		let noise: f32 = random(getFragCoord()) + uniform.uRandomize;
		var tapPosition: vec2f = startPosition(noise);
		let angleStep: mat2x2f = tapAngleStep();
		let ssDiskRadius: f32 = -(uniform.uProjectionScaleRadius / origin.z);
		var occlusion: f32 = 0.0;
		for (var i: i32 = 0; i < i32(uniform.uSampleCount.x); i = i + 1) {
			computeAmbientOcclusionSAO(&occlusion, f32(i), ssDiskRadius, uv, origin, normal, tapPosition, noise);
			tapPosition = angleStep * tapPosition;
		}
		return occlusion;
	}
	uniform uPower: f32;
	@fragment
	fn fragmentMain(input: FragmentInput) -> FragmentOutput {
		var output: FragmentOutput;
		let uv: vec2f = snapToDepthTexelCenter(input.uv0);
		let depth: f32 = -getLinearScreenDepth(uv);
		let origin: vec3f = computeViewSpacePositionFromDepth(uv, depth);
		let normal: vec3f = computeViewSpaceNormalDepth(origin, uv);
		var occlusion: f32 = 0.0;
		if (uniform.uIntensity > 0.0) {
			occlusion = scalableAmbientObscurance(uv, origin, normal);
		}
		var ao: f32 = max(0.0, 1.0 - occlusion * uniform.uIntensity);
		ao = pow(ao, uniform.uPower);
		output.color = vec4f(ao, ao, ao, 1.0);
		return output;
	}
`,$i=class extends m{radius=5;intensity=1;power=1;sampleCount=10;minAngle=5;randomize=!1;ssaoTexture;_scale=1;_blueNoise=new x(19);constructor(e,t,n,r){super(e),this.sourceTexture=t,this.cameraComponent=n,Y.get(e,Te).set(`ssaoPS`,Zi),Y.get(e,K).set(`ssaoPS`,Qi);let i=new Map,a=N.addScreenDepthChunkDefines(n.shaderParams,i);this.shader=N.createShader(e,{uniqueName:`SsaoShader${a}`,attributes:{aPosition:U},vertexChunk:`quadVS`,fragmentChunk:`ssaoPS`,fragmentDefines:i});let o=this.createRenderTarget(`SsaoFinalTexture`);this.ssaoTexture=o.colorBuffer,this.init(o,{resizeSource:this.sourceTexture});let s=new G(0,0,0,0);if(this.setClearColor(s),r){let t=this.createRenderTarget(`SsaoTempTexture`),r=new Xi(e,o.colorBuffer,n,!0);r.init(t,{resizeSource:o.colorBuffer}),r.setClearColor(s);let i=new Xi(e,t.colorBuffer,n,!1);i.init(o,{resizeSource:o.colorBuffer}),i.setClearColor(s),this.afterPasses.push(r),this.afterPasses.push(i)}this.ssaoTextureId=e.scope.resolve(`ssaoTexture`),this.ssaoTextureSizeInvId=e.scope.resolve(`ssaoTextureSizeInv`)}destroy(){if(this.renderTarget?.destroyTextureBuffers(),this.renderTarget?.destroy(),this.renderTarget=null,this.afterPasses.length>0){let e=this.afterPasses[0].renderTarget;e?.destroyTextureBuffers(),e?.destroy()}this.afterPasses.forEach(e=>e.destroy()),this.afterPasses.length=0,super.destroy()}set scale(e){this._scale=e,this.scaleX=e,this.scaleY=e}get scale(){return this._scale}createRenderTarget(e){return new Ze({depth:!1,colorBuffer:H.createDataTexture2D(this.device,e,1,1,52)})}execute(){let{device:e,sampleCount:t,minAngle:n}=this,{width:r,height:i}=this.renderTarget.colorBuffer,a=e.scope;a.resolve(`uAspect`).setValue(r/i),a.resolve(`uInvResolution`).setValue([1/r,1/i]),a.resolve(`uSampleCount`).setValue([t,1/t]);let o=Math.sin(n*q.DEG_TO_RAD);a.resolve(`uMinHorizonAngleSineSquared`).setValue(o*o);let s=1/(t-.5)*10*2*3.141,c=this.radius,l=.1*c,u=2*(l*2*3.141)*this.intensity/t,d=.5*i;a.resolve(`uSpiralTurns`).setValue(10),a.resolve(`uAngleIncCosSin`).setValue([Math.cos(s),Math.sin(s)]),a.resolve(`uMaxLevel`).setValue(0),a.resolve(`uInvRadiusSquared`).setValue(1/(c*c)),a.resolve(`uBias`).setValue(.001),a.resolve(`uPeak2`).setValue(l*l),a.resolve(`uIntensity`).setValue(u),a.resolve(`uPower`).setValue(this.power),a.resolve(`uProjectionScaleRadius`).setValue(d*c),a.resolve(`uRandomize`).setValue(this.randomize?this._blueNoise.value():0),super.execute()}after(){this.ssaoTextureId.setValue(this.ssaoTexture);let e=this.sourceTexture;this.ssaoTextureSizeInvId.setValue([1/e.width,1/e.height])}},ea=class{formats;stencil=!1;samples=1;sceneColorMap=!1;lastGrabLayerId=2;lastGrabLayerIsTransparent=!1;lastSceneLayerId=3;lastSceneLayerIsTransparent=!0;taaEnabled=!1;bloomEnabled=!1;ssaoType=ti;ssaoBlurEnabled=!0;prepassEnabled=!1;sceneTextureDepth=!1;dofEnabled=!1;dofNearBlur=!1;dofHighQuality=!0;volumetricFogEnabled=!1},ta=new ea,na=[15,50],ra=class e extends Ee{app;prePass;scenePass;composePass;bloomPass;ssaoPass;taaPass;scenePassHalf;dofPass;volumetricFogPass;_renderTargetScale=1;layersDirty=!1;cameraFrame;rt=null;_sceneTextureNames=[];sceneDepthTexture=null;sceneDepthSlot=0;rtSceneColor=null;_sceneDepthClearValue=new G(0,0,0,1);constructor(e,t,n,r={}){super(e.graphicsDevice),this.app=e,this.cameraComponent=n,this.cameraFrame=t,this.options=this.sanitizeOptions(r),this.setupRenderPasses(this.options)}destroy(){this.reset()}reset(){if(this.sceneTexture=null,this.sceneTextureHalf=null,this.sceneDepthTexture){this.sceneDepthTexture=null,this.sceneDepthSlot=0,this._sceneTextureNames.length=0;let{shaderParams:e}=this.cameraComponent;e.sceneDepthMapLinear=!1,e.sceneDepthMapPacked=!1,e.sceneDepthMapReciprocal=!1}this.rtSceneColor&&=(this.rtSceneColor.destroy(),null),this.rt&&=(this.rt.destroyTextureBuffers(),this.rt.destroy(),null),this.rtHalf&&=(this.rtHalf.destroyTextureBuffers(),this.rtHalf.destroy(),null),this.beforePasses.forEach(e=>e.destroy()),this.beforePasses.length=0,this.prePass=null,this.scenePass=null,this.scenePassTransparent=null,this.colorGrabPass=null,this.composePass=null,this.bloomPass=null,this.ssaoPass=null,this.taaPass=null,this.afterPass=null,this.scenePassHalf=null,this.dofPass=null,this.volumetricFogPass=null}sanitizeOptions(t){t=Object.assign({},ta,t);let n=t.taaEnabled||t.dofEnabled||t.volumetricFogEnabled||t.ssaoType===`combine`,r=this.needsInSceneDepth(t),i=this.app.scene.getGsplatParams()?.sceneDepthWrite??!1,a=e.isSceneTextureDepthSupported(this.device),o=this.sceneTexturesUnsupportedReason(t),s=r||this.sceneDepthFormat!==15;return t.sceneTextureDepth=n&&a&&!o&&(!s||i),t.prepassEnabled=r||n&&!t.sceneTextureDepth,t}rendersGSplats(){return!1}needsInSceneDepth(e){return e.prepassEnabled||e.ssaoType===`lighting`}sceneTexturesUnsupportedReason(e){return e.samples>1?`multi-sampling is enabled on the CameraFrame, which the scene depth cannot be rendered with`:this.cameraComponent.camera.fullSizeClearRect?this.needsInSceneDepth(e)?`the depth prepass this camera also needs stores the depth differently, and the two cannot be told apart by the shaders sampling them`:null:`this camera does not clear the whole render target, and the clear it uses instead would also clear the scene depth`}get sceneDepthFormat(){return e.getSceneDepthFormat(this.device)}static getSceneDepthFormat(e){return e.getRenderableHdrFormat(na,!1,1,!0)}static isSceneTextureDepthSupported(t){return t.supportsIndependentBlending&&e.getSceneDepthFormat(t)!==void 0}set renderTargetScale(e){this._renderTargetScale=e,this.scenePass&&(this.scenePass.scaleX=e,this.scenePass.scaleY=e)}get renderTargetScale(){return this._renderTargetScale}needsReset(e){let t=this.options;return e.ssaoType!==t.ssaoType||e.ssaoBlurEnabled!==t.ssaoBlurEnabled||e.taaEnabled!==t.taaEnabled||e.samples!==t.samples||e.stencil!==t.stencil||e.bloomEnabled!==t.bloomEnabled||e.prepassEnabled!==t.prepassEnabled||e.sceneTextureDepth!==t.sceneTextureDepth||e.sceneColorMap!==t.sceneColorMap||e.dofEnabled!==t.dofEnabled||e.dofNearBlur!==t.dofNearBlur||e.dofHighQuality!==t.dofHighQuality||e.volumetricFogEnabled!==t.volumetricFogEnabled||((e,t)=>e!==t&&(!(Array.isArray(e)&&Array.isArray(t))||e.length!==t.length||!e.every((e,n)=>e===t[n])))(e.formats,t.formats)}update(e){e=this.sanitizeOptions(e),(this.needsReset(e)||this.layersDirty)&&(this.layersDirty=!1,this.reset()),this.options=e,this.sceneTexture||this.setupRenderPasses(this.options)}createRenderTarget(e,t,n,r,i){let a=new H(this.device,{name:e,width:4,height:4,format:this.hdrFormat,mipmaps:!1,minFilter:1,magFilter:1,addressU:1,addressV:1});return new Ze({colorBuffers:i?.length?[a,...i]:[a],depth:t,stencil:n,samples:r})}setupRenderPasses(e){let{device:t}=this,n=this.cameraComponent,r=n.renderTarget;this.hdrFormat=t.getRenderableHdrFormat(e.formats,!0,e.samples)||7,this._bloomEnabled=e.bloomEnabled&&this.hdrFormat!==7,this._sceneHalfEnabled=this._bloomEnabled||e.dofEnabled,n.shaderParams.ssaoEnabled=e.ssaoType===ni;let i=[],a=this._sceneTextureNames;if(a.length=0,e.sceneTextureDepth&&(this.sceneDepthTexture=H.createDataTexture2D(t,`SceneTextureDepth`,4,4,this.sceneDepthFormat),i.push(this.sceneDepthTexture),a.push(Re),this.sceneDepthSlot=i.length),this.rt=this.createRenderTarget(`SceneColor`,!0,e.stencil,e.samples,i),this.sceneTexture=this.rt.colorBuffer,this.sceneDepthTexture){let{shaderParams:e}=n;e.sceneDepthMapLinear=!0,e.sceneDepthMapPacked=!1,e.sceneDepthMapReciprocal=!0,this.rtSceneColor=new Ze({name:`SceneColorOnly`,colorBuffers:[this.sceneTexture],depth:!1,samples:1})}this._sceneHalfEnabled&&(this.rtHalf=this.createRenderTarget(`SceneColorHalf`,!1,!1,1),this.sceneTextureHalf=this.rtHalf.colorBuffer),this.sceneOptions={resizeSource:r,scaleX:this.renderTargetScale,scaleY:this.renderTargetScale},this.createPasses(e);let o=this.collectPasses();this.beforePasses=o.filter(e=>e!=null),this.updateCameraUseFlags()}updateCameraUseFlags(){let e=new Map,t=new Map;for(let n=0;n<this.beforePasses.length;n++){let r=this.beforePasses[n];if(r instanceof R){let n=r.layerRenderSteps;for(let r=0;r<n.length;r++){let i=n[r],a=i.cameraComponent;a&&(e.has(a)||e.set(a,i),t.set(a,i))}}}e.forEach(e=>{e.firstCameraUse=!0}),t.forEach(e=>{e.lastCameraUse=!0})}collectPasses(){let e=this.options.ssaoType===ni;return[this.prePass,e?this.ssaoPass:null,this.scenePass,this.colorGrabPass,this.scenePassTransparent,e?null:this.ssaoPass,this.volumetricFogPass,this.taaPass,this.scenePassHalf,this.bloomPass,this.dofPass,this.composePass,this.afterPass]}createPasses(e){this.setupScenePrepass(e),this.setupSsaoPass(e);let t=this.setupScenePass(e);this.setupVolumetricFogPass(e);let n=this.setupTaaPass(e);this.setupSceneHalfPass(e,n),this.setupBloomPass(e,this.sceneTextureHalf),this.setupDofPass(e,this.sceneTexture,this.sceneTextureHalf),this.setupComposePass(e),this.setupAfterPass(e,t)}setupScenePrepass(e){if(e.prepassEnabled){let{app:e,device:t,cameraComponent:n}=this,{scene:r,renderer:i}=e;this.prePass=new qi(t,r,i,n,this.sceneOptions)}}setupScenePassSettings(e){e.gammaCorrection=0,e.toneMapping=6,e.sceneTextures=this._sceneTextureNames}addCameraLayers(e,t,n,r,i=!0){let a=this.cameraComponent,{layerList:o,subLayerList:s}=e.layerComposition,c=n,l=t;for(;l<o.length;){let t=o[l],n=s[l];if(a.camera.layersSet.has(t.id)&&(e.addLayer(a,t,n,c),c=!1),l++,t.id===r&&n===i)break}return l}setupScenePass(e){let{app:t,device:n}=this,{scene:r,renderer:i}=t,a=r.layers;this.scenePass=new R(n,a,r,i),this.setupScenePassSettings(this.scenePass),this.scenePass.init(this.rt,this.sceneOptions);let o=e.sceneColorMap?e.lastGrabLayerId:e.lastSceneLayerId,s=e.sceneColorMap?e.lastGrabLayerIsTransparent:e.lastSceneLayerIsTransparent,c={lastAddedIndex:0,clearRenderTarget:!0};return c.lastAddedIndex=this.addCameraLayers(this.scenePass,c.lastAddedIndex,c.clearRenderTarget,o,s),c.clearRenderTarget=!1,e.sceneColorMap&&(this.colorGrabPass=new I(n),this.colorGrabPass.source=this.rt,this.scenePassTransparent=new R(n,a,r,i),this.setupScenePassSettings(this.scenePassTransparent),this.scenePassTransparent.init(this.rt),c.lastAddedIndex=this.addCameraLayers(this.scenePassTransparent,c.lastAddedIndex,c.clearRenderTarget,e.lastSceneLayerId,e.lastSceneLayerIsTransparent),this.scenePassTransparent.rendersAnything||(this.scenePassTransparent.destroy(),this.scenePassTransparent=null),this.scenePassTransparent&&e.prepassEnabled&&(this.scenePassTransparent.depthStencilOps.storeDepth=!0)),(this.scenePassTransparent??this.scenePass).sceneTexturesCamera=this.cameraComponent.camera,this.scenePass.clearSceneTextures=e.sceneTextureDepth&&!e.prepassEnabled,c}setupSsaoPass(e){let{ssaoBlurEnabled:t,ssaoType:n}=e,{device:r,cameraComponent:i}=this;n!==`none`&&(this.ssaoPass=new $i(r,this.sceneTexture,i,t))}setupSceneHalfPass(e,t){this._sceneHalfEnabled&&(this.scenePassHalf=new ai(this.device,t,{boxFilter:!0,removeInvalid:!0}),this.scenePassHalf.name=`RenderPassSceneHalf`,this.scenePassHalf.init(this.rtHalf,{resizeSource:t,scaleX:.5,scaleY:.5}),this.scenePassHalf.setClearColor(G.BLACK))}setupBloomPass(e,t){this._bloomEnabled&&(this.bloomPass=new li(this.device,t,this.hdrFormat))}setupDofPass(e,t,n){e.dofEnabled&&(this.dofPass=new wi(this.device,this.cameraComponent,t,n,e.dofHighQuality,e.dofNearBlur))}setupVolumetricFogPass(e){e.volumetricFogEnabled&&(this.volumetricFogPass=new Wi(this.device,this.cameraComponent,this.sceneTexture,this.rtSceneColor??this.rt,this.scenePass),this.volumetricFogPass.temporalDither=e.taaEnabled)}setupTaaPass(e){let t=this.sceneTexture;return e.taaEnabled&&(this.taaPass=new _i(this.device,this.sceneTexture,this.cameraComponent),t=this.taaPass.historyTexture),t}setupComposePass(e){this.composePass=new fi(this.device,this.cameraComponent),this.composePass.bloomTexture=this.bloomPass?.bloomTexture,this.composePass.hdrScene=this.hdrFormat!==7,this.composePass.taaEnabled=e.taaEnabled,this.composePass.cocTexture=this.dofPass?.cocTexture,this.composePass.blurTexture=this.dofPass?.blurTexture,this.composePass.blurTextureUpscale=!this.dofPass?.highQuality;let t=this.cameraComponent.renderTarget;this.composePass.init(t),this.composePass.ssaoTexture=e.ssaoType===`combine`?this.ssaoPass.ssaoTexture:null}setupAfterPass(e,t){let{app:n,cameraComponent:r}=this,{scene:i,renderer:a}=n,o=i.layers,s=r.renderTarget;this.afterPass=new R(this.device,o,i,a),this.afterPass.init(s),this.addCameraLayers(this.afterPass,t.lastAddedIndex,t.clearRenderTarget)}frameUpdate(){this.layersDirty&&this.cameraFrame.update(),super.frameUpdate();let{options:e,composePass:t}=this;if(t.sceneDepthAvailable=e.sceneTextureDepth||e.prepassEnabled,this.sceneDepthTexture){let{scenePass:e}=this,t=e.options.resizeSource??this.device.backBuffer;this.rtSceneColor.resize(Math.floor(t.width*e.scaleX),Math.floor(t.height*e.scaleY));let n=this._sceneDepthClearValue;n.r=1/this.cameraComponent.camera.farClip,this.scenePass.setClearColor(n,this.sceneDepthSlot)}let n=this.taaPass?.update()??this.rt.colorBuffer;this.composePass.sceneTexture=n,this.scenePassHalf?.setSourceTexture(n),this.dofPass?.setSceneTexture(n)}},ia=class{_enabled=!0;rendering={renderFormats:[18,12,14],stencil:!1,renderTargetScale:1,samples:1,sceneColorMap:!1,sceneDepthMap:!1,toneMapping:0,sharpness:0};ssao={type:ti,blurEnabled:!0,randomize:!1,intensity:.5,radius:30,samples:12,power:6,minAngle:10,scale:1};bloom={intensity:0,blurLevel:16,threshold:0};grading={enabled:!1,brightness:1,contrast:1,saturation:1,tint:new G(1,1,1,1)};colorLUT={texture:null,intensity:1,texture2:null,intensity2:1,blend:0};vignette={intensity:0,inner:.5,outer:1,curvature:.5,color:new G(0,0,0)};taa={enabled:!1,jitter:1};fringing={intensity:0};colorEnhance={enabled:!1,shadows:0,highlights:0,vibrance:0,midtones:0,dehaze:0};dof={enabled:!1,nearBlur:!1,focusDistance:100,focusRange:10,blurRadius:3,blurRings:4,blurRingPoints:5,highQuality:!0};volumetricFog={enabled:!1,light:null,localOmniLights:!1,localSpotLights:!1,localIntensity:1,localSteps:12,tint:new G(1,1,1),density:.01,heightBase:0,heightFalloff:.05,extinction:1,anisotropy:.6,intensity:1,ambientColor:new G(1,1,1),ambientIntensity:.02,maxDistance:300,steps:24,scale:.5};debug=null;options=new ea;renderPassCamera=null;constructor(e,t){this.app=e,this.cameraComponent=t,this.updateOptions(),this.enable(),this.cameraLayersChanged=t.on(`set:layers`,()=>{this.renderPassCamera&&(this.renderPassCamera.layersDirty=!0)})}destroy(){this.disable(),this.cameraLayersChanged.off()}enable(){this.renderPassCamera=this.createRenderPass(),this.cameraComponent.framePasses=[this.renderPassCamera]}disable(){let e=this.cameraComponent;e.framePasses?.forEach(e=>{e.destroy()}),e.framePasses=[],e.rendering=null,e.jitter=0,e.shaderParams.ssaoEnabled=!1,this.renderPassCamera=null}createRenderPass(){return new ra(this.app,this,this.cameraComponent,this.options)}set enabled(e){this._enabled!==e&&(e?this.enable():this.disable(),this._enabled=e)}get enabled(){return this._enabled}updateOptions(){let{options:e,rendering:t,bloom:n,taa:r,ssao:i}=this;e.stencil=t.stencil,e.samples=t.samples,e.sceneColorMap=t.sceneColorMap,e.prepassEnabled=t.sceneDepthMap,e.bloomEnabled=n.intensity>0,e.taaEnabled=r.enabled,e.ssaoType=i.type,e.ssaoBlurEnabled=i.blurEnabled,e.formats=t.renderFormats.slice(),e.dofEnabled=this.dof.enabled,e.dofNearBlur=this.dof.nearBlur,e.dofHighQuality=this.dof.highQuality,e.volumetricFogEnabled=this._volumetricFogSupported()}_volumetricFogSupported(){let{volumetricFog:e,cameraComponent:t}=this;if(!e.enabled||e.light&&e.light.type!==`directional`)return!1;let n=e.localOmniLights||e.localSpotLights;return n&&!t.system.app.scene.clusteredLightingEnabled&&(n=!1),!(!e.light&&!n||t.projection!==0)}static isSplatSceneDepthSupported(e){return ra.isSceneTextureDepthSupported(e)}update(){if(!this._enabled)return;let e=this.cameraComponent,{options:t,renderPassCamera:n,rendering:r,bloom:i,grading:a,colorEnhance:o,vignette:s,fringing:c,taa:l,ssao:u}=this;this.updateOptions(),n.update(t);let{composePass:d,bloomPass:f,ssaoPass:p,dofPass:m,volumetricFogPass:h}=n;if(n.renderTargetScale=q.clamp(r.renderTargetScale,.1,1),d.toneMapping=r.toneMapping,d.sharpness=r.sharpness,t.bloomEnabled&&f&&(d.bloomIntensity=i.intensity,f.blurLevel=i.blurLevel,f.threshold=i.threshold),t.dofEnabled&&(m.focusDistance=this.dof.focusDistance,m.focusRange=this.dof.focusRange,m.blurRadius=this.dof.blurRadius,m.blurRings=this.dof.blurRings,m.blurRingPoints=this.dof.blurRingPoints),t.volumetricFogEnabled){let{volumetricFog:e}=this;h.light=e.light?.light??null,h.localOmniLights=e.localOmniLights,h.localSpotLights=e.localSpotLights,h.localIntensity=e.localIntensity,h.localSteps=q.clamp(e.localSteps,2,64),h.tint.copy(e.tint),h.density=e.density,h.heightBase=e.heightBase,h.heightFalloff=e.heightFalloff,h.extinction=Math.max(e.extinction,0),h.anisotropy=q.clamp(e.anisotropy,0,.95),h.intensity=e.intensity,h.ambientColor.copy(e.ambientColor),h.ambientIntensity=e.ambientIntensity,h.maxDistance=e.maxDistance,h.steps=q.clamp(e.steps,4,128),h.scale=q.clamp(e.scale,.25,1)}t.ssaoType!==`none`&&(p.intensity=u.intensity,p.power=u.power,p.radius=u.radius,p.sampleCount=u.samples,p.minAngle=u.minAngle,p.scale=u.scale,p.randomize=u.randomize),d.gradingEnabled=a.enabled,a.enabled&&(d.gradingSaturation=a.saturation,d.gradingBrightness=a.brightness,d.gradingContrast=a.contrast,d.gradingTint=a.tint),d.colorLUT=this.colorLUT.texture,d.colorLUTIntensity=this.colorLUT.intensity,d.colorLUT2=this.colorLUT.texture2,d.colorLUT2Intensity=this.colorLUT.intensity2,d.colorLUTBlend=this.colorLUT.blend,d.vignetteEnabled=s.intensity>0,d.vignetteEnabled&&(d.vignetteInner=s.inner,d.vignetteOuter=s.outer,d.vignetteCurvature=s.curvature,d.vignetteIntensity=s.intensity,d.vignetteColor.copy(s.color)),d.fringingEnabled=c.intensity>0,d.fringingEnabled&&(d.fringingIntensity=c.intensity),d.colorEnhanceEnabled=o.enabled,o.enabled&&(d.colorEnhanceShadows=o.shadows,d.colorEnhanceHighlights=o.highlights,d.colorEnhanceVibrance=o.vibrance,d.colorEnhanceMidtones=o.midtones,d.colorEnhanceDehaze=o.dehaze),e.jitter=l.enabled?l.jitter:0,d.debug=this.debug,d.debug===`ssao`&&t.ssaoType===`none`&&(d.debug=null),d.debug===`vignette`&&!d.vignetteEnabled&&(d.debug=null)}},aa=new W,oa=new tt,sa=class e{position=new W;angles=new W;distance=0;pitchRange=new Qe(-1/0,1/0);yawRange=new Qe(-1/0,1/0);xRange=new Qe(-1/0,1/0);yRange=new Qe(-1/0,1/0);zRange=new Qe(-1/0,1/0);constructor(e=W.ZERO,t=W.ZERO,n=0){this.set(e,t,n)}copy(e){return this.set(e.position,e.angles,e.distance)}clone(){return new e(this.position.clone(),this.angles.clone(),this.distance)}equalsApprox(e,t=1e-6){return this.position.equalsApprox(e.position,t)&&this.angles.equalsApprox(e.angles,t)&&Math.abs(this.distance-e.distance)<t}lerp(e,t,n,r=n,i=n){return this.position.lerp(e.position,t.position,n),this.angles.x=q.lerpAngle(e.angles.x,t.angles.x,r)%360,this.angles.y=q.lerpAngle(e.angles.y,t.angles.y,r)%360,this.angles.z=q.lerpAngle(e.angles.z,t.angles.z,r)%360,this.distance=q.lerp(e.distance,t.distance,i),this}move(e){return this.position.add(e),this.position.x=q.clamp(this.position.x,this.xRange.x,this.xRange.y),this.position.y=q.clamp(this.position.y,this.yRange.x,this.yRange.y),this.position.z=q.clamp(this.position.z,this.zRange.x,this.zRange.y),this}rotate(e){return this.angles.add(e),this.angles.x%=360,this.angles.y%=360,this.angles.z%=360,this.angles.x=q.clamp(this.angles.x,this.pitchRange.x,this.pitchRange.y),this.angles.y=q.clamp(this.angles.y,this.yawRange.x,this.yawRange.y),this}set(e,t,n){return this.position.copy(e),this.angles.copy(t),this.distance=n,this}look(e,t){this.position.copy(e),this.distance=e.distance(t);let n=aa.sub2(t,e).normalize(),r=Math.atan2(-n.y,Math.sqrt(n.x*n.x+n.z*n.z))*q.RAD_TO_DEG,i=Math.atan2(-n.x,-n.z)*q.RAD_TO_DEG;return this.angles.set(-r,i,0),this}getFocus(e){return oa.setFromEulerAngles(this.angles).transformVector(W.FORWARD,e).mulScalar(this.distance).add(this.position)}},ca=class{_value;constructor(e){this._value=Array.isArray(e)?e.slice():Array(+e).fill(0)}add(e){for(let t=0;t<this._value.length;t++)this._value[t]+=e._value[t]||0;return this}append(e){for(let t=0;t<this._value.length;t++)this._value[t]+=e[t]||0;return this}copy(e){for(let t=0;t<this._value.length;t++)this._value[t]=e._value[t]||0;return this}length(){let e=0;for(let t of this._value)e+=t*t;return Math.sqrt(e)}read(){let e=this._value.slice();return this._value.fill(0),e}},la=class{deltas={};constructor(e){for(let t in e)this.deltas[t]=new ca(e[t])}read(){let e={};for(let t in this.deltas)e[t]=this.deltas[t].read();return e}},ua=class extends la{_element=null;_events=new qe;on(e,t){this._events.on(e,t)}off(e,t){this._events.off(e,t)}fire(e,...t){this._events.fire(e,...t)}attach(e){this._element&&this.detach(),this._element=e}detach(){this._element&&(this._element=null,this.read())}destroy(){this.detach(),this._events.off()}},da=class{update(e,t){e.read()}},fa=class extends da{_pose=new sa;attach(e,t=!0){}detach(){}update(e,t){return super.update(e,t),this._pose}destroy(){this.detach()}},pa=e=>e===`touch`||e===`pen`,ma=()=>{let e=new Map;return{down:t=>{e.set(t.pointerId,[t.screenX,t.screenY])},move:t=>{if(!e.has(t.pointerId))return[0,0];let n=e.get(t.pointerId),r=t.screenX-n[0],i=t.screenY-n[1];return n[0]=t.screenX,n[1]=t.screenY,[r,i]},up:t=>{e.delete(t.pointerId)}}},ha=new Qe,ga=class extends ua{_movementState=ma();_pointerEvents=new Map;_pointerPos=new Qe;_pinchDist=-1;constructor(){super({touch:[0,0],count:[0],pinch:[0]}),this._onPointerDown=this._onPointerDown.bind(this),this._onPointerMove=this._onPointerMove.bind(this),this._onPointerUp=this._onPointerUp.bind(this),this._onContextMenu=this._onContextMenu.bind(this)}_onPointerDown(e){let{pointerId:t,pointerType:n}=e;this._movementState.down(e),pa(n)&&(this._element?.setPointerCapture(t),this._pointerEvents.set(t,e),this.deltas.count.append([1]),this._pointerEvents.size>1&&(this._getMidPoint(this._pointerPos),this._pinchDist=this._getPinchDist()))}_onPointerMove(e){let{pointerType:t,target:n,pointerId:r}=e,[i,a]=this._movementState.move(e);if(pa(t)&&n===this._element&&this._pointerEvents.size!==0){if(this._pointerEvents.set(r,e),this._pointerEvents.size>1){let e=this._getMidPoint(ha);this.deltas.touch.append([e.x-this._pointerPos.x,e.y-this._pointerPos.y]),this._pointerPos.copy(e);let t=this._getPinchDist();this._pinchDist>0&&this.deltas.pinch.append([this._pinchDist-t]),this._pinchDist=t}else this.deltas.touch.append([i,a])}}_onPointerUp(e){let{pointerType:t,pointerId:n}=e;this._movementState.up(e),pa(t)&&(this._element?.releasePointerCapture(n),this._pointerEvents.delete(n),this.deltas.count.append([-1]),this._pointerEvents.size<2&&(this._pinchDist=-1),this._pointerPos.set(0,0))}_onContextMenu(e){e.preventDefault()}_getMidPoint(e){if(this._pointerEvents.size<2)return e.set(0,0);let[t,n]=this._pointerEvents.values(),r=t.clientX-n.clientX,i=t.clientY-n.clientY;return e.set(n.clientX+r*.5,n.clientY+i*.5)}_getPinchDist(){if(this._pointerEvents.size<2)return 0;let[e,t]=this._pointerEvents.values(),n=e.clientX-t.clientX,r=e.clientY-t.clientY;return Math.sqrt(n*n+r*r)}attach(e){super.attach(e),this._element=e,this._element.addEventListener(`pointerdown`,this._onPointerDown),this._element.addEventListener(`pointermove`,this._onPointerMove),this._element.addEventListener(`pointerup`,this._onPointerUp),this._element.addEventListener(`pointercancel`,this._onPointerUp),this._element.addEventListener(`contextmenu`,this._onContextMenu)}detach(){this._element&&(this._element.removeEventListener(`pointerdown`,this._onPointerDown),this._element.removeEventListener(`pointermove`,this._onPointerMove),this._element.removeEventListener(`pointerup`,this._onPointerUp),this._element.removeEventListener(`pointercancel`,this._onPointerUp),this._element.removeEventListener(`contextmenu`,this._onContextMenu),this._pointerEvents.clear(),super.detach())}},_a={passive:!1},va={A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,0:26,1:27,2:28,3:29,4:30,5:31,6:32,7:33,8:34,9:35,UP:36,DOWN:37,LEFT:38,RIGHT:39,SPACE:40,SHIFT:41,CTRL:42},ya=Object.keys(va).length,ba=Array(ya).fill(0),xa=class e extends ua{_movementState=ma();static keyCode=va;_pointerId=-1;_pointerLock;_keyMap=new Map;_keyPrev=Array(ya).fill(0);_keyNow=Array(ya).fill(0);_button=[,,,].fill(0);constructor({pointerLock:t=!1}={}){super({key:Array(ya).fill(0),button:[0,0,0],mouse:[0,0],wheel:[0]}),this._pointerLock=t??!1;let{keyCode:n}=e;for(let e=0;e<26;e++){let t=`Key${String.fromCharCode(65+e)}`;this._keyMap.set(t,n.A+e)}for(let e=0;e<10;e++){let t=`Digit${e}`;this._keyMap.set(t,n[0]+e)}this._keyMap.set(`ArrowUp`,n.UP),this._keyMap.set(`ArrowDown`,n.DOWN),this._keyMap.set(`ArrowLeft`,n.LEFT),this._keyMap.set(`ArrowRight`,n.RIGHT),this._keyMap.set(`Space`,n.SPACE),this._keyMap.set(`ShiftLeft`,n.SHIFT),this._keyMap.set(`ShiftRight`,n.SHIFT),this._keyMap.set(`ControlLeft`,n.CTRL),this._keyMap.set(`ControlRight`,n.CTRL),this._onWheel=this._onWheel.bind(this),this._onPointerDown=this._onPointerDown.bind(this),this._onPointerMove=this._onPointerMove.bind(this),this._onPointerUp=this._onPointerUp.bind(this),this._onContextMenu=this._onContextMenu.bind(this),this._onKeyDown=this._onKeyDown.bind(this),this._onKeyUp=this._onKeyUp.bind(this)}_onWheel(e){e.preventDefault(),this.deltas.wheel.append([e.deltaY])}_onPointerDown(e){this._movementState.down(e),e.pointerType===`mouse`&&(this._pointerLock?document.pointerLockElement!==this._element&&this._element?.requestPointerLock():this._element?.setPointerCapture(e.pointerId),this._clearButtons(),this._button[e.button]=1,this.deltas.button.append(this._button),this._pointerId===-1&&(this._pointerId=e.pointerId))}_onPointerMove(e){let[t,n]=this._pointerLock&&document.pointerLockElement===this._element?[e.movementX,e.movementY]:this._movementState.move(e);if(e.pointerType===`mouse`&&e.target===this._element){if(this._pointerLock){if(document.pointerLockElement!==this._element)return}else if(this._pointerId!==e.pointerId)return;this.deltas.mouse.append([t,n])}}_onPointerUp(e){this._movementState.up(e),e.pointerType===`mouse`&&(this._pointerLock||this._element?.releasePointerCapture(e.pointerId),this._clearButtons(),this.deltas.button.append(this._button),this._pointerId===e.pointerId&&(this._pointerId=-1))}_onContextMenu(e){e.preventDefault()}_onKeyDown(e){this._pointerLock&&document.pointerLockElement!==this._element||(e.stopPropagation(),this._setKey(e.code,1))}_onKeyUp(e){e.stopPropagation(),this._setKey(e.code,0)}_clearButtons(){for(let e=0;e<this._button.length;e++)this._button[e]===1?this._button[e]=-1:this._button[e]=0}_setKey(e,t){this._keyMap.has(e)&&(this._keyNow[this._keyMap.get(e)??0]=t)}attach(e){super.attach(e),this._element=e,this._element.addEventListener(`wheel`,this._onWheel,_a),this._element.addEventListener(`pointerdown`,this._onPointerDown),this._element.addEventListener(`pointermove`,this._onPointerMove),this._element.addEventListener(`pointerup`,this._onPointerUp),this._element.addEventListener(`pointercancel`,this._onPointerUp),this._element.addEventListener(`pointerleave`,this._onPointerUp),this._element.addEventListener(`lostpointercapture`,this._onPointerUp),this._element.addEventListener(`contextmenu`,this._onContextMenu),window.addEventListener(`keydown`,this._onKeyDown,!1),window.addEventListener(`keyup`,this._onKeyUp,!1)}detach(){this._element&&(this._element.removeEventListener(`wheel`,this._onWheel,_a),this._element.removeEventListener(`pointerdown`,this._onPointerDown),this._element.removeEventListener(`pointermove`,this._onPointerMove),this._element.removeEventListener(`pointerup`,this._onPointerUp),this._element.removeEventListener(`pointercancel`,this._onPointerUp),this._element.removeEventListener(`pointerleave`,this._onPointerUp),this._element.removeEventListener(`lostpointercapture`,this._onPointerUp),this._element.removeEventListener(`contextmenu`,this._onContextMenu),window.removeEventListener(`keydown`,this._onKeyDown,!1),window.removeEventListener(`keyup`,this._onKeyUp,!1),this._keyNow.fill(0),this._keyPrev.fill(0),super.detach())}read(){for(let e=0;e<ba.length;e++)ba[e]=this._keyNow[e]-this._keyPrev[e],this._keyPrev[e]=this._keyNow[e];return this.deltas.key.append(ba),super.read()}},Sa={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,SELECT:8,START:9,LEFT_STICK:10,RIGHT_STICK:11},Ca=Object.keys(Sa).length,wa=class extends ua{static buttonCode=Sa;_buttonPrev=Array(Ca).fill(0);constructor(){super({buttons:Array(Ca).fill(0),leftStick:[0,0],rightStick:[0,0]})}read(){let e=navigator.getGamepads();for(let t=0;t<e.length;t++){let n=e[t];if(!n||n.mapping!==`standard`||n.axes.length<4||n.buttons.length<Ca)continue;let{buttons:r,axes:i}=n;for(let e=0;e<this._buttonPrev.length;e++){let t=+r[e].pressed;this.deltas.buttons[e]=t-this._buttonPrev[e],this._buttonPrev[e]=t}this.deltas.leftStick.append([i[0],i[1]]),this.deltas.rightStick.append([i[2],i[3]])}return super.read()}},Ta=(e,t)=>1-e**(t*1e3),Ea=new W,Da=new W,Oa=new W,ka=new tt,Aa=class extends fa{_targetRootPose=new sa;_rootPose=new sa;_targetChildPose=new sa;_childPose=new sa;rotateDamping=.98;moveDamping=.98;zoomDamping=.98;set pitchRange(e){this._targetRootPose.pitchRange.copy(e),this._rootPose.copy(this._targetRootPose.rotate(W.ZERO))}get pitchRange(){return this._targetRootPose.pitchRange}set yawRange(e){this._targetRootPose.yawRange.copy(e),this._rootPose.copy(this._targetRootPose.rotate(W.ZERO))}get yawRange(){return this._targetRootPose.yawRange}set zoomRange(e){this._targetChildPose.zRange.copy(e),this._childPose.copy(this._targetChildPose.move(W.ZERO))}get zoomRange(){return this._targetRootPose.zRange}attach(e,t=!0){this._targetRootPose.set(e.getFocus(Ea),e.angles,0),this._targetChildPose.position.set(0,0,e.distance),t||(this._rootPose.copy(this._targetRootPose),this._childPose.copy(this._targetChildPose))}detach(){this._targetRootPose.copy(this._rootPose),this._targetChildPose.copy(this._childPose)}update(e,t){let{move:n,rotate:r}=e.read();Da.set(n[0],n[1],0),ka.setFromEulerAngles(this._rootPose.angles).transformVector(Da,Da),this._targetRootPose.move(Da);let{z:i}=this._targetChildPose.position;return this._targetChildPose.move(Da.set(0,0,i*(1+n[2])-i)),this._targetRootPose.rotate(Oa.set(-r[1],-r[0],0)),this._rootPose.lerp(this._rootPose,this._targetRootPose,Ta(this.moveDamping,t),Ta(this.rotateDamping,t),1),this._childPose.lerp(this._childPose,this._targetChildPose,Ta(this.zoomDamping,t),1,1),ka.setFromEulerAngles(this._rootPose.angles).transformVector(this._childPose.position,Da).add(this._rootPose.position),this._pose.set(Da,this._rootPose.angles,this._childPose.position.z)}destroy(){this.detach()}},ja=class extends g{static scriptName=`xrControllers`;basePath=`https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets/dist/profiles`;controllers=new Map;_pendingInputSources=new Set;_models=new Map;_visible=!0;_handlers=null;initialize(){this.app.xr?(this._handlers={onAdd:this._onInputSourceAdd.bind(this),onRemove:this._onInputSourceRemove.bind(this),onXrEnd:this._onXrEnd.bind(this)},this.app.xr.input.on(`add`,this._handlers.onAdd),this.app.xr.input.on(`remove`,this._handlers.onRemove),this.app.xr.on(`end`,this._handlers.onXrEnd),this.once(`destroy`,()=>{this._onDestroy()})):console.error(`XrControllers script requires XR to be enabled on the application`)}_onDestroy(){this._handlers&&this.app.xr&&(this.app.xr.input.off(`add`,this._handlers.onAdd),this.app.xr.input.off(`remove`,this._handlers.onRemove),this.app.xr.off(`end`,this._handlers.onXrEnd)),this._destroyAllControllers(),this._handlers=null,this._pendingInputSources.clear();for(let e of this._models.values())e.asset?this._releaseModel(e.asset):e.load.then(e=>this._releaseModel(e),()=>{});this._models.clear()}_onXrEnd(){this._destroyAllControllers(),this._pendingInputSources.clear()}_destroyController(e){let t=this.controllers.get(e);t&&(t.entity.destroy(),this.controllers.delete(e),this.app.fire(`xr:controller:remove`,e))}_destroyAllControllers(){for(let e of this.controllers.keys())this._destroyController(e)}async _tryLoadProfiles(e,t,n=0){return n>=t.length||!this._pendingInputSources.has(e)?null:await this._loadProfile(e,t[n])||this._tryLoadProfiles(e,t,n+1)}async _onInputSourceAdd(e){if(!e.profiles?.length){console.warn(`XrControllers: No profiles available for input source`);return}this._pendingInputSources.add(e);let t=await this._tryLoadProfiles(e,e.profiles);if(this._pendingInputSources.has(e)){if(this._pendingInputSources.delete(e),t){let{asset:n}=t,r=n.resource.instantiateRenderEntity();this.app.root.addChild(r),r.enabled=this._visible;let i=new Map;if(e.hand)for(let t of e.hand.joints){let e=r.findByName(t.id);e&&i.set(t,e)}this.controllers.set(e,{entity:r,jointMap:i,asset:n,tracked:!0,enabledWhenTracked:!0}),this.app.fire(`xr:controller:add`,e,r)}else console.warn(`XrControllers: No compatible profiles found for input source`)}}async _loadProfile(e,t){let n=`${this.basePath}/${t}/profile.json`;try{let r=await fetch(n);if(!r.ok)return null;let i=await r.json(),a=i.layouts[e.handedness]?.assetPath||``,o=`${this.basePath}/${i.profileId}/${e.handedness}${a.replace(/^\/?(left|right)/,``)}`;return this._pendingInputSources.has(e)?{profileId:t,asset:await this._loadModel(o)}:null}catch{return null}}_loadModel(e){let t=this._models.get(e);if(t)return t.load;let n={load:new Promise((t,n)=>{this.app.assets.loadFromUrl(e,`container`,(e,r)=>{e?n(e):t(r)})}),asset:null};return this._models.set(e,n),n.load.then(e=>{n.asset=e},()=>{this._models.get(e)===n&&this._models.delete(e)}),n.load}_releaseModel(e){let{assets:t}=this.app;t&&(t.remove(e),e.unload())}_onInputSourceRemove(e){this._pendingInputSources.delete(e),this._destroyController(e)}set visible(e){if(this._visible!==e){this._visible=e;for(let[,t]of this.controllers)t.tracked?t.entity.enabled=e:t.enabledWhenTracked=e}}get visible(){return this._visible}update(e){if(!this.app.xr?.active||!this._visible)return;let t=this.app.xr.visibilityState===`visible`;for(let[e,n]of this.controllers){let r=t&&(!e.hand||e.hand.tracking);if(n.tracked!==r&&(n.tracked=r,r?n.entity.enabled=n.enabledWhenTracked:(n.enabledWhenTracked=n.entity.enabled,n.entity.enabled=!1)),!r)continue;let{entity:i,jointMap:a}=n;if(e.hand)for(let[e,t]of a)t.setPosition(e.getPosition()),t.setRotation(e.getRotation());else{let t=e.getPosition(),n=e.getRotation();t&&i.setPosition(t),n&&i.setRotation(n)}}}},Ma=9.81,Na=new Qe,Pa=new Qe,Fa=new W,Ia=new W,La=new W,Ra=new W,za=new W,Ba=new W,Va=new W,Ha=new W,Ua=new W,Wa=1e3,Ga=`
    attribute vec3 vertex_position;
    attribute vec2 aUv0;

    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;

    varying vec2 uv0;

    void main(void) {
        gl_Position = matrix_viewProjection * matrix_model * vec4(vertex_position, 1.0);
        uv0 = aUv0;
    }
`,Ka=`
    uniform vec4 uColor;

    varying vec2 uv0;

    void main(void) {
        float edge = 1.0 - abs(uv0.y * 2.0 - 1.0);
        edge *= edge;
        float ends = smoothstep(0.0, 0.1, uv0.x) * (1.0 - smoothstep(0.9, 1.0, uv0.x));
        gl_FragColor = vec4(uColor.rgb, uColor.a * edge * ends);
    }
`,qa=`
    attribute vertex_position: vec3f;
    attribute aUv0: vec2f;

    uniform matrix_model: mat4x4f;
    uniform matrix_viewProjection: mat4x4f;

    varying uv0: vec2f;

    @vertex
    fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        output.position = uniform.matrix_viewProjection * uniform.matrix_model * vec4f(input.vertex_position, 1.0);
        output.uv0 = input.aUv0;
        return output;
    }
`,Ja=`
    uniform uColor: vec4f;

    varying uv0: vec2f;

    @fragment
    fn fragmentMain(input: FragmentInput) -> FragmentOutput {
        var output: FragmentOutput;
        let edgeBase = 1.0 - abs(input.uv0.y * 2.0 - 1.0);
        let edge = edgeBase * edgeBase;
        let ends = smoothstep(0.0, 0.1, input.uv0.x) * (1.0 - smoothstep(0.9, 1.0, input.uv0.x));
        output.color = vec4f(uniform.uColor.rgb, uniform.uColor.a * edge * ends);
        return output;
    }
`,Ya=`
    uniform vec4 uColor;

    varying vec2 uv0;

    void main(void) {
        float d = length(uv0 * 2.0 - 1.0);
        float ring = smoothstep(0.55, 0.75, d) * (1.0 - smoothstep(0.85, 1.0, d));
        float fill = (1.0 - smoothstep(0.0, 0.85, d)) * 0.15;
        gl_FragColor = vec4(uColor.rgb, uColor.a * (ring + fill));
    }
`,Xa=`
    uniform uColor: vec4f;

    varying uv0: vec2f;

    @fragment
    fn fragmentMain(input: FragmentInput) -> FragmentOutput {
        var output: FragmentOutput;
        let d = length(input.uv0 * 2.0 - 1.0);
        let ring = smoothstep(0.55, 0.75, d) * (1.0 - smoothstep(0.85, 1.0, d));
        let fill = (1.0 - smoothstep(0.0, 0.85, d)) * 0.15;
        output.color = vec4f(uniform.uColor.rgb, uniform.uColor.a * (ring + fill));
        return output;
    }
`,Za=class extends g{static scriptName=`xrNavigation`;enableTeleport=!0;enableMove=!0;movementSpeed=1.5;turnMode=`snap`;rotateSpeed=45;movementThreshold=.1;rotateThreshold=.5;rotateResetThreshold=.25;smoothTurnSpeed=90;smoothTurnThreshold=.15;maxTeleportDistance=10;groundHeight=0;teleportArcSpeed=8;arcWidth=.05;arcSegments=32;teleportIndicatorRadius=.2;validTeleportColor=new G(.5,.8,.95);invalidTeleportColor=new G(.9,.4,.35);enableSnapVertical=!0;snapVerticalHeight=.5;snapVerticalBoostHeight=2;snapVerticalThreshold=.5;snapVerticalResetThreshold=.25;castRay=null;_inputSources=new Set;_activePointers=new Map;_inputHandlers=new Map;_rotateSnap={last:0};_verticalSnap={last:0};_cameraEntity=null;_arcMaterial=null;_ringMaterial=null;_ringMesh=null;_arcVisuals=new Map;_arcHits=new Map;_arcPoints=[];_currentGroundY=0;_unfocusedTime=-1/0;initialize(){if(!this.app.xr){console.error(`XrNavigation script requires XR to be enabled on the application`);return}this.enableTeleport||this.enableMove||this.enableSnapVertical||console.warn(`XrNavigation: All navigation methods are disabled. Navigation will not work.`);for(let e=0;e<=this.arcSegments;e++)this._arcPoints.push(new W);this._currentGroundY=this.groundHeight,this._arcMaterial=new v({uniqueName:`xr-navigation-arc`,vertexGLSL:Ga,fragmentGLSL:Ka,vertexWGSL:qa,fragmentWGSL:Ja,attributes:{vertex_position:U,aUv0:We}}),this._arcMaterial.blendType=2,this._arcMaterial.cull=0,this._arcMaterial.depthWrite=!1,this._arcMaterial.update(),this._ringMaterial=new v({uniqueName:`xr-navigation-ring`,vertexGLSL:Ga,fragmentGLSL:Ya,vertexWGSL:qa,fragmentWGSL:Xa,attributes:{vertex_position:U,aUv0:We}}),this._ringMaterial.blendType=2,this._ringMaterial.cull=0,this._ringMaterial.depthWrite=!1,this._ringMaterial.update(),this._ringMesh=re.fromGeometry(this.app.graphicsDevice,new l),this._ringMesh.incRefCount();let e=()=>{this._destroyAllArcVisuals()};this.app.xr.on(`end`,e),this._cameraEntity=this.entity.findComponent(`camera`)?.entity??null,this._cameraEntity||console.error(`XrNavigation: No camera entity found. Movement calculations may not work correctly.`);let t=e=>{let t=()=>{this._isSystemSelect(e)||(this._activePointers.set(e,!0),this._arcHits.delete(e))},n=()=>{this._activePointers.get(e)&&(this._activePointers.set(e,!1),this.enableTeleport&&this.tryTeleport(e))};e.on(`selectstart`,t),e.on(`selectend`,n),this._inputHandlers.set(e,{handleSelectStart:t,handleSelectEnd:n}),this._inputSources.add(e)};this.app.xr.input.on(`add`,t);let n=e=>{let t=this._inputHandlers.get(e);t&&(e.off(`selectstart`,t.handleSelectStart),e.off(`selectend`,t.handleSelectEnd),this._inputHandlers.delete(e)),this._activePointers.delete(e),this._inputSources.delete(e),this._destroyArcVisual(e)};this.app.xr.input.on(`remove`,n),this.once(`destroy`,()=>{this.app.xr.off(`end`,e),this.app.xr.input.off(`add`,t),this.app.xr.input.off(`remove`,n);for(let[e,t]of this._inputHandlers)e.off(`selectstart`,t.handleSelectStart),e.off(`selectend`,t.handleSelectEnd);this._inputHandlers.clear(),this._activePointers.clear(),this._inputSources.clear(),this._destroyAllArcVisuals(),this._arcMaterial&&=(this._arcMaterial.destroy(),null),this._ringMaterial&&=(this._ringMaterial.destroy(),null),this._ringMesh&&=(this._ringMesh.destroy(),null)})}_getAimRay(e){Ba.copy(e.getDirection()),za.copy(e.getOrigin());let t=e.grip?e.getPosition():null;if(!t)return;let n=this.maxTeleportDistance;if(!this.castRay&&Ba.y<-.001){let e=(za.y-this.groundHeight)/-Ba.y;e>0&&e<this.maxTeleportDistance*2&&(n=e)}Va.copy(Ba).mulScalar(n).add(za),za.copy(t),Ba.sub2(Va,za).normalize()}_computeArcHit(e,t,n){let r=this._arcPoints.length-1,i=Ma,a=t.x*this.teleportArcSpeed,o=t.y*this.teleportArcSpeed,s=t.z*this.teleportArcSpeed;n.valid=!1;let c,l=!1;if(this.castRay){let t=this.maxTeleportDistance+Math.max(0,e.y-this.entity.getPosition().y);c=(o+Math.sqrt(o*o+2*i*t))/i}else{let t=o*o+2*i*(e.y-this.groundHeight);c=t>=0?(o+Math.sqrt(t))/i:0,l=c>.001,l||(c=2*this.teleportArcSpeed/i)}for(let t=0;t<=r;t++){let n=c*t/r;this._arcPoints[t].set(e.x+a*n,e.y+o*n-.5*i*n*n,e.z+s*n)}if(this.castRay)for(let e=0;e<r;e++){let t=this.castRay(this._arcPoints[e],this._arcPoints[e+1]);if(t){n.point.copy(t);for(let t=e+1;t<=r;t++)this._arcPoints[t].copy(n.point);n.valid=this.isValidTeleportDistance(n.point);return}}else l&&(n.point.copy(this._arcPoints[r]),n.point.y=this.groundHeight,n.valid=this.isValidTeleportDistance(n.point))}_getOrCreateHit(e){let t=this._arcHits.get(e);return t||(t={point:new W,valid:!1},this._arcHits.set(e,t)),t}tryTeleport(e){let t=this._arcHits.get(e);if(t||(t=this._getOrCreateHit(e),this._getAimRay(e),this._computeArcHit(za,Ba,t)),!t.valid)return;let n=Fa.copy(t.point),r=this.entity.getPosition();if(this._cameraEntity){let e=this._cameraEntity.getPosition();n.x-=e.x-r.x,n.z-=e.z-r.z}n.y=r.y+(t.point.y-this._currentGroundY),this._currentGroundY=t.point.y,this.entity.setPosition(n)}update(e){this.app.xr?.active&&this.app.xr.visibilityState!==`visible`&&(this._unfocusedTime=$e());for(let t of this._inputSources)this._hasThumbsticks(t)&&(t.handedness===`left`?this.enableMove&&this._cameraEntity&&this._handleMovement(t,e):t.handedness===`right`&&(this.enableMove&&this._cameraEntity&&(this.turnMode===`smooth`?this._handleSmoothTurning(t,e):this.turnMode===`snap`&&this._handleSnapTurning(t)),this.enableSnapVertical&&this._handleSnapVertical(t)));this.enableTeleport&&this._handleTeleportation()}_isSystemSelect(e){if(this.app.xr.visibilityState!==`visible`||$e()-this._unfocusedTime<Wa)return!0;let t=e.hand,n=t?.tracking?t.wrist:null;return!!(n&&this._cameraEntity&&(n.getRotation().transformVector(Ha.set(0,-1,0),Ha),Ua.sub2(this._cameraEntity.getPosition(),n.getPosition()).normalize(),Ha.dot(Ua)>0))}_hasThumbsticks(e){return!!e.gamepad&&e.gamepad.axes.length>=4}_snapTrigger(e,t,n,r){return(e.last>0&&t<r||e.last<0&&t>-r)&&(e.last=0),e.last===0&&Math.abs(t)>n?(e.last=Math.sign(t),e.last):0}_rotateRigAroundCamera(e){Fa.copy(this._cameraEntity.getLocalPosition()),this.entity.translateLocal(Fa),this.entity.rotateLocal(0,e,0),this.entity.translateLocal(Fa.mulScalar(-1))}_handleMovement(e,t){if(Na.set(e.gamepad.axes[2],e.gamepad.axes[3]),Na.length()<=this.movementThreshold)return;Na.normalize();let n=this._cameraEntity.forward;Pa.x=n.x,Pa.y=n.z,Pa.normalize();let r=Math.atan2(Pa.x,Pa.y)-Math.PI/2,i=Na.x*Math.sin(r)-Na.y*Math.cos(r);Na.y=Na.y*Math.sin(r)+Na.x*Math.cos(r),Na.x=i,Na.mulScalar(this.movementSpeed*t),this.entity.translate(Na.x,0,Na.y)}_handleSnapTurning(e){let t=-e.gamepad.axes[2],n=this._snapTrigger(this._rotateSnap,t,this.rotateThreshold,this.rotateResetThreshold);n&&this._rotateRigAroundCamera(n*this.rotateSpeed)}_handleSmoothTurning(e,t){let n=-e.gamepad.axes[2];Math.abs(n)<=this.smoothTurnThreshold||this._rotateRigAroundCamera(n*this.smoothTurnSpeed*t)}_handleSnapVertical(e){let t=-e.gamepad.axes[3],n=this._snapTrigger(this._verticalSnap,t,this.snapVerticalThreshold,this.snapVerticalResetThreshold);if(n){let t=e.gamepad.buttons[1]?.pressed;this.entity.translate(0,n*(t?this.snapVerticalBoostHeight:this.snapVerticalHeight),0)}}_handleTeleportation(){for(let e of this._inputSources){if(!this._activePointers.get(e)){let t=this._arcVisuals.get(e);t&&(t.entity.enabled=!1,t.ringEntity.enabled=!1);continue}let t=this._getOrCreateHit(e);this._getAimRay(e),this._computeArcHit(za,Ba,t);let n=this._getArcVisual(e);if(n.entity.enabled=!0,this._updateArcVisual(n,t.valid),n.ringEntity.enabled=t.valid,t.valid){n.ringEntity.setPosition(t.point.x,t.point.y+.01,t.point.z);let e=this.teleportIndicatorRadius*2;n.ringEntity.setLocalScale(e,1,e)}}}_getArcVisual(e){let t=this._arcVisuals.get(e);if(t)return t;let n=this._arcPoints.length-1,r=(n+1)*2,i=new Float32Array(r*3),a=new Float32Array(r*2),o=new Uint16Array(n*6);for(let e=0;e<=n;e++){let t=e/n;a[e*4+0]=t,a[e*4+1]=0,a[e*4+2]=t,a[e*4+3]=1}for(let e=0;e<n;e++){let t=e*2;o[e*6+0]=t,o[e*6+1]=t+1,o[e*6+2]=t+2,o[e*6+3]=t+1,o[e*6+4]=t+3,o[e*6+5]=t+2}let s=new re(this.app.graphicsDevice);s.clear(!0,!1),s.setPositions(i),s.setUvs(0,a),s.setIndices(o),s.update(4);let c=new z(s,this._arcMaterial);c.pick=!1;let l=new He(`XrNavigationArc`);l.addComponent(`render`,{castShadows:!1}),l.render.meshInstances=[c],this.app.root.addChild(l);let u=new Float32Array(4),d=new z(this._ringMesh,this._ringMaterial);d.pick=!1,d.setParameter(`uColor`,u);let f=new He(`XrNavigationRing`);return f.addComponent(`render`,{castShadows:!1}),f.render.meshInstances=[d],f.enabled=!1,this.app.root.addChild(f),t={entity:l,meshInstance:c,mesh:s,positions:i,colorParam:u,ringEntity:f},this._arcVisuals.set(e,t),t}_updateArcVisual(e,t){let n=this._arcPoints,r=n.length-1,i=e.positions,a=this._cameraEntity?this._cameraEntity.getPosition():this.entity.getPosition(),o=this.arcWidth*.5;for(let e=0;e<=r;e++){let t=n[e];e<r?Ia.sub2(n[e+1],t):Ia.sub2(t,n[e-1]),La.sub2(a,t),Ra.cross(Ia,La);let s=Ra.length();s>1e-6?Ra.mulScalar(o/s):Ra.set(o,0,0);let c=e*6;i[c+0]=t.x-Ra.x,i[c+1]=t.y-Ra.y,i[c+2]=t.z-Ra.z,i[c+3]=t.x+Ra.x,i[c+4]=t.y+Ra.y,i[c+5]=t.z+Ra.z}e.mesh.setPositions(i),e.mesh.update(4);let s=t?this.validTeleportColor:this.invalidTeleportColor;e.colorParam[0]=s.r,e.colorParam[1]=s.g,e.colorParam[2]=s.b,e.colorParam[3]=s.a,e.meshInstance.setParameter(`uColor`,e.colorParam)}_destroyArcVisual(e){let t=this._arcVisuals.get(e);t&&(t.entity.destroy(),t.ringEntity.destroy(),this._arcVisuals.delete(e),this._arcHits.delete(e))}_destroyAllArcVisuals(){for(let e of this._arcVisuals.keys())this._destroyArcVisual(e)}isValidTeleportDistance(e){return e.distance(this.entity.getPosition())<=this.maxTeleportDistance}},Qa=class extends ae{constructor(e,t){super(e);let r=new n;r.graphicsDevice=t.graphicsDevice,r.componentSystems=[se,ie,w,M,E],r.resourceHandlers=[te,D,F,j],r.mouse=t.mouse,r.touch=t.touch,r.keyboard=t.keyboard,r.xr=ne,this.init(r)}},$a=.05,eo=1e-4,to=4;function no(e,t,n,r,i,a,o){let s=e,c=t,l=n,u=0,d=0,f=0,p=!1,m=0;for(let e=0;e<to&&r(s,c,l,a);e++){p=!0;let e=a.x,t=a.y,n=a.z;for(let r=0;r<m;r++){let a=i[r],o=e*a.x+t*a.y+n*a.z;o<0&&(e-=o*a.x,t-=o*a.y,n-=o*a.z)}let r=Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z);if(r>eo&&m<3){let e=1/r,t=i[m];t.x=a.x*e,t.y=a.y*e,t.z=a.z*e,m++}s+=e,c+=t,l+=n,u+=e,d+=t,f+=n}let h=u*u+d*d+f*f,g=p&&h>eo*eo;return g&&(o.x=u,o.y=d,o.z=f),g}var ro=4;function io(e,t,n){let r=e.indices[t];n.minX=Math.min(e.v0x[r],e.v1x[r],e.v2x[r]),n.minY=Math.min(e.v0y[r],e.v1y[r],e.v2y[r]),n.minZ=Math.min(e.v0z[r],e.v1z[r],e.v2z[r]),n.maxX=Math.max(e.v0x[r],e.v1x[r],e.v2x[r]),n.maxY=Math.max(e.v0y[r],e.v1y[r],e.v2y[r]),n.maxZ=Math.max(e.v0z[r],e.v1z[r],e.v2z[r])}function ao(e,t,n){let r={minX:1/0,minY:1/0,minZ:1/0,maxX:-1/0,maxY:-1/0,maxZ:-1/0},i={minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};for(let a=t;a<t+n;a++)io(e,a,i),r.minX=Math.min(r.minX,i.minX),r.minY=Math.min(r.minY,i.minY),r.minZ=Math.min(r.minZ,i.minZ),r.maxX=Math.max(r.maxX,i.maxX),r.maxY=Math.max(r.maxY,i.maxY),r.maxZ=Math.max(r.maxZ,i.maxZ);if(n<=ro)return{...r,left:null,right:null,triStart:t,triCount:n};let a=r.maxX-r.minX,o=r.maxY-r.minY,s=r.maxZ-r.minZ,c=a>=o&&a>=s?0:o>=s?1:2,l=c===0?(r.minX+r.maxX)*.5:c===1?(r.minY+r.maxY)*.5:(r.minZ+r.maxZ)*.5,u=t,d=t+n-1;for(;u<=d;){let t=e.indices[u];if((c===0?(e.v0x[t]+e.v1x[t]+e.v2x[t])/3:c===1?(e.v0y[t]+e.v1y[t]+e.v2y[t])/3:(e.v0z[t]+e.v1z[t]+e.v2z[t])/3)<l)u++;else{let t=e.indices[u];e.indices[u]=e.indices[d],e.indices[d]=t,d--}}let f=u-t;return(f===0||f===n)&&(f=n>>1),{...r,left:ao(e,t,f),right:ao(e,t+f,n-f),triStart:0,triCount:0}}function oo(e,t,n,r,i,a,o,s,c,l,u,d,f){let p=(o-e)*r,m=(l-e)*r,h=(s-t)*i,g=(u-t)*i,_=(c-n)*a,v=(d-n)*a,y=Math.max(Math.min(p,m),Math.min(h,g),Math.min(_,v)),b=Math.min(Math.max(p,m),Math.max(h,g),Math.max(_,v));return b<0||y>b||y>f?-1:y>=0?y:0}function so(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m){let h=l-o,g=u-s,_=d-c,v=f-o,y=p-s,b=m-c,x=i*b-a*y,S=a*v-r*b,C=r*y-i*v,w=h*x+g*S+_*C;if(Math.abs(w)<1e-10)return-1;let T=1/w,E=e-o,D=t-s,O=n-c,k=(E*x+D*S+O*C)*T;if(k<0||k>1)return-1;let A=D*_-O*g,j=O*h-E*_,M=E*g-D*h,N=(r*A+i*j+a*M)*T;if(N<0||k+N>1)return-1;let P=(v*A+y*j+b*M)*T;return P>=0?P:-1}function co(e,t,n,r,i,a,o,s,c,l){let u=Math.max(i,Math.min(e,s)),d=Math.max(a,Math.min(t,c)),f=Math.max(o,Math.min(n,l)),p=e-u,m=t-d,h=n-f;return p*p+m*m+h*h<=r*r}function lo(e,t,n,r,i,a,o,s,c,l,u,d,f){let p=o-r,m=s-i,h=c-a,g=l-r,_=u-i,v=d-a,y=e-r,b=t-i,x=n-a,S=p*y+m*b+h*x,C=g*y+_*b+v*x;if(S<=0&&C<=0){f.x=r,f.y=i,f.z=a;return}let w=e-o,T=t-s,E=n-c,D=p*w+m*T+h*E,O=g*w+_*T+v*E;if(D>=0&&O<=D){f.x=o,f.y=s,f.z=c;return}let k=S*O-D*C;if(k<=0&&S>=0&&D<=0){let e=S/(S-D);f.x=r+p*e,f.y=i+m*e,f.z=a+h*e;return}let A=e-l,j=t-u,M=n-d,N=p*A+m*j+h*M,P=g*A+_*j+v*M;if(P>=0&&N<=P){f.x=l,f.y=u,f.z=d;return}let F=N*C-S*P;if(F<=0&&C>=0&&P<=0){let e=C/(C-P);f.x=r+g*e,f.y=i+_*e,f.z=a+v*e;return}let I=D*P-N*O;if(I<=0&&O-D>=0&&N-P>=0){let e=(O-D)/(O-D+(N-P));f.x=o+(l-o)*e,f.y=s+(u-s)*e,f.z=c+(d-c)*e;return}let L=1/(I+F+k),R=F*L,ee=k*L;f.x=r+p*R+g*ee,f.y=i+m*R+_*ee,f.z=a+h*R+v*ee}function uo(e,t,n,r,i,a,o,s,c,l){let u=o-r,d=s-i,f=c-a,p=u*u+d*d+f*f;if(p<1e-20){l.x=r,l.y=i,l.z=a;return}let m=e-r,h=t-i,g=n-a,_=(m*u+h*d+g*f)/p;_=Math.max(0,Math.min(1,_)),l.x=r+u*_,l.y=i+d*_,l.z=a+f*_}var fo={x:0,y:0,z:0},po={x:0,y:0,z:0},mo={x:0,y:0,z:0},ho={x:0,y:0,z:0};function go(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g){let _=1/0;for(let h=0;h<=5;h++){let g=h/5,v=e+(r-e)*g,y=t+(i-t)*g,b=n+(a-n)*g;lo(v,y,b,o,s,c,l,u,d,f,p,m,ho);let x=v-ho.x,S=y-ho.y,C=b-ho.z,w=x*x+S*S+C*C;w<_&&(_=w,fo.x=v,fo.y=y,fo.z=b,po.x=ho.x,po.y=ho.y,po.z=ho.z)}uo(po.x,po.y,po.z,e,t,n,r,i,a,mo),lo(mo.x,mo.y,mo.z,o,s,c,l,u,d,f,p,m,ho);let v=mo.x-ho.x,y=mo.y-ho.y,b=mo.z-ho.z,x=v*v+y*y+b*b;return x<_&&(_=x,fo.x=mo.x,fo.y=mo.y,fo.z=mo.z,po.x=ho.x,po.y=ho.y,po.z=ho.z),h.x=fo.x,h.y=fo.y,h.z=fo.z,g.x=po.x,g.y=po.y,g.z=po.z,_}var _o={x:0,y:0,z:0},vo={x:0,y:0,z:0},yo={x:0,y:0,z:0},bo=class e{voxelResolution=$a;_tris;_root;_normalResult={nx:0,ny:0,nz:0};_push={x:0,y:0,z:0};_constraintNormals=[{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0}];_stack=[];_rayResult={t:-1,triIdx:-1};constructor(e,t){let n=Math.floor(t.length/3),r={v0x:new Float32Array(n),v0y:new Float32Array(n),v0z:new Float32Array(n),v1x:new Float32Array(n),v1y:new Float32Array(n),v1z:new Float32Array(n),v2x:new Float32Array(n),v2y:new Float32Array(n),v2z:new Float32Array(n),nx:new Float32Array(n),ny:new Float32Array(n),nz:new Float32Array(n),indices:new Uint32Array(n),count:n};for(let i=0;i<n;i++){let n=t[i*3]*3,a=t[i*3+1]*3,o=t[i*3+2]*3;r.v0x[i]=e[n],r.v0y[i]=e[n+1],r.v0z[i]=e[n+2],r.v1x[i]=e[a],r.v1y[i]=e[a+1],r.v1z[i]=e[a+2],r.v2x[i]=e[o],r.v2y[i]=e[o+1],r.v2z[i]=e[o+2];let s=r.v1x[i]-r.v0x[i],c=r.v1y[i]-r.v0y[i],l=r.v1z[i]-r.v0z[i],u=r.v2x[i]-r.v0x[i],d=r.v2y[i]-r.v0y[i],f=r.v2z[i]-r.v0z[i],p=c*f-l*d,m=l*u-s*f,h=s*d-c*u,g=Math.sqrt(p*p+m*m+h*h);if(g>1e-10){let e=1/g;p*=e,m*=e,h*=e}r.nx[i]=p,r.ny[i]=m,r.nz[i]=h,r.indices[i]=i}this._tris=r,this._root=ao(r,0,n)}get triangles(){return this._tris}queryRay(e,t,n,r,i,a,o){let s=Math.sqrt(r*r+i*i+a*a);if(s<1e-10)return null;let c=1/s;r*=c,i*=c,a*=c;let l=1/(Math.abs(r)>1e-12?r:r>=0?1e-12:-1e-12),u=1/(Math.abs(i)>1e-12?i:i>=0?1e-12:-1e-12),d=1/(Math.abs(a)>1e-12?a:a>=0?1e-12:-1e-12),f=this._queryRayBVH(e,t,n,r,i,a,l,u,d,o);return f?{x:e+r*f.t,y:t+i*f.t,z:n+a*f.t}:null}querySphere(e,t,n,r,i){return no(e,t,n,(e,t,n,i)=>this._deepestSpherePenetration(e,t,n,r,i),this._constraintNormals,this._push,i)}queryCapsule(e,t,n,r,i,a){return no(e,t,n,(e,t,n,a)=>this._deepestCapsulePenetration(e,t,n,r,i,a),this._constraintNormals,this._push,a)}querySurfaceNormal(e,t,n,r,i,a){let o=Math.sqrt(r*r+i*i+a*a);if(o<1e-10)return this._normalResult.nx=0,this._normalResult.ny=1,this._normalResult.nz=0,this._normalResult;let s=1/o,c=r*s,l=i*s,u=a*s,d=1/(Math.abs(c)>1e-12?c:c>=0?1e-12:-1e-12),f=1/(Math.abs(l)>1e-12?l:l>=0?1e-12:-1e-12),p=1/(Math.abs(u)>1e-12?u:u>=0?1e-12:-1e-12),m=this._queryRayBVH(e,t,n,c,l,u,d,f,p,1),h=this._normalResult;if(m){let e=m.triIdx;h.nx=this._tris.nx[e],h.ny=this._tris.ny[e],h.nz=this._tris.nz[e],h.nx*c+h.ny*l+h.nz*u>0&&(h.nx=-h.nx,h.ny=-h.ny,h.nz=-h.nz)}else h.nx=0,h.ny=1,h.nz=0;return h}_queryRayBVH(e,t,n,r,i,a,o,s,c,l){let u=this._root;if(oo(e,t,n,o,s,c,u.minX,u.minY,u.minZ,u.maxX,u.maxY,u.maxZ,l)<0)return null;let d=this._stack,f=0;d[f++]=u;let p=l+1,m=-1,{_tris:h}=this;for(;f>0;){let u=d[--f];if(u.left===null){for(let o=u.triStart;o<u.triStart+u.triCount;o++){let s=h.indices[o],c=so(e,t,n,r,i,a,h.v0x[s],h.v0y[s],h.v0z[s],h.v1x[s],h.v1y[s],h.v1z[s],h.v2x[s],h.v2y[s],h.v2z[s]);c>=0&&c<=l&&c<p&&(p=c,m=s)}continue}let g=oo(e,t,n,o,s,c,u.left.minX,u.left.minY,u.left.minZ,u.left.maxX,u.left.maxY,u.left.maxZ,p),_=oo(e,t,n,o,s,c,u.right.minX,u.right.minY,u.right.minZ,u.right.maxX,u.right.maxY,u.right.maxZ,p);g>=0&&_>=0?g<=_?(d[f++]=u.right,d[f++]=u.left):(d[f++]=u.left,d[f++]=u.right):g>=0?d[f++]=u.left:_>=0&&(d[f++]=u.right)}if(m<0)return null;let g=this._rayResult;return g.t=p,g.triIdx=m,g}_deepestSpherePenetration(e,t,n,r,i){let a=eo,o=0,s=0,c=0,l=!1;return this._sphereBVH(this._root,e,t,n,r,i=>{let u=this._tris;lo(e,t,n,u.v0x[i],u.v0y[i],u.v0z[i],u.v1x[i],u.v1y[i],u.v1z[i],u.v2x[i],u.v2y[i],u.v2z[i],_o);let d=e-_o.x,f=t-_o.y,p=n-_o.z,m=d*d+f*f+p*p;if(m>=r*r)return;let h=Math.sqrt(m),g=r-h;if(g>a){if(a=g,h>1e-10){let e=1/h;o=d*e*g,s=f*e*g,c=p*e*g}else o=u.nx[i]*g,s=u.ny[i]*g,c=u.nz[i]*g;l=!0}}),l&&(i.x=o,i.y=s,i.z=c),l}_deepestCapsulePenetration(e,t,n,r,i,a){let o=eo,s=0,c=0,l=0,u=!1,d=e,f=t-r,p=n,m=e,h=t+r,g=n,_=i,v=t,y=r+i;return this._capsuleBVH(this._root,e,v,n,y,_,e=>{let t=this._tris;go(d,f,p,m,h,g,t.v0x[e],t.v0y[e],t.v0z[e],t.v1x[e],t.v1y[e],t.v1z[e],t.v2x[e],t.v2y[e],t.v2z[e],vo,yo);let n=vo.x-yo.x,r=vo.y-yo.y,a=vo.z-yo.z,_=n*n+r*r+a*a;if(_>=i*i)return;let v=Math.sqrt(_),y=i-v;if(y>o){if(o=y,v>1e-10){let e=1/v;s=n*e*y,c=r*e*y,l=a*e*y}else s=t.nx[e]*y,c=t.ny[e]*y,l=t.nz[e]*y;u=!0}}),u&&(a.x=s,a.y=c,a.z=l),u}_sphereBVH(e,t,n,r,i,a){let o=this._stack,s=0;for(o[s++]=e;s>0;){let e=o[--s];if(co(t,n,r,i,e.minX,e.minY,e.minZ,e.maxX,e.maxY,e.maxZ)){if(e.left===null){let{_tris:t}=this;for(let n=e.triStart;n<e.triStart+e.triCount;n++)a(t.indices[n])}else o[s++]=e.right,o[s++]=e.left}}}_capsuleBVH(e,t,n,r,i,a,o){let s=t-a,c=t+a,l=n-i,u=n+i,d=r-a,f=r+a,p=this._stack,m=0;for(p[m++]=e;m>0;){let e=p[--m];if(!(c<e.minX||s>e.maxX||u<e.minY||l>e.maxY||f<e.minZ||d>e.maxZ)){if(e.left===null){let{_tris:t}=this;for(let n=e.triStart;n<e.triStart+e.triCount;n++)o(t.indices[n])}else p[m++]=e.right,p[m++]=e.left}}}static fromGlb(t,n){return new Promise((r,i)=>{let a=new et(n,`container`,{url:n}),o=()=>{t.assets.remove(a),a.unload()};a.on(`load`,()=>{let t=a.resource.renders;if(!t||t.length===0){o(),i(Error(`GLB contains no mesh data`));return}let n=[],s=[],c=0;for(let e of t){let t=e.resource;for(let e=0;e<t.meshes.length;e++){let r=t.meshes[e],i=r.vertexBuffer,a=r.indexBuffer[0];if(!i||!a)continue;let o=i.format,l=null;for(let e=0;e<o.elements.length;e++)if(o.elements[e].name===`POSITION`){l=o.elements[e];break}if(!l)continue;let u=new Float32Array(i.storage),d=o.size/4,f=l.offset/4,p=i.numVertices;for(let e=0;e<p;e++){let t=e*d+f;n.push(u[t],u[t+1],u[t+2])}let m=a.format===2?new Uint32Array(a.storage):new Uint16Array(a.storage);for(let e of r.primitive)for(let t=0;t<e.count;t++)s.push(m[e.base+t]+c);c+=p}}if(s.length===0){o(),i(Error(`GLB meshes contain no triangle data`));return}let l=new e(new Float32Array(n),new Uint32Array(s));o(),r(l)}),a.on(`error`,e=>{o(),i(Error(e))}),t.assets.add(a),t.assets.load(a)})}},xo=4278190080,So=2,Co=1/Math.sqrt(2),wo=[[1,0,0,0,1,0,0,0,1],[0,1,0,1,0,0,0,0,1],[0,0,1,1,0,0,0,1,0],[1,0,1,0,1,0,-1,0,1],[1,0,-1,0,1,0,1,0,1],[1,1,0,0,0,1,-1,1,0],[1,-1,0,0,0,1,1,1,0],[0,1,1,1,0,0,0,-1,1],[0,1,-1,1,0,0,0,1,1]];function To(e,t,n,r,i,a,o,s,c,l,u,d,f){let p=0;for(let m=1;m>=-1;m--){let h=0;for(let p=-2;p<=So;p++)for(let g=-2;g<=So;g++){let _=t+p*s+g*u-i*m,v=n+p*c+g*d-a*m,y=r+p*l+g*f-o*m;e.isVoxelSolid(_,v,y)&&!e.isVoxelSolid(_+i,v+a,y+o)&&h++}h>p&&(p=h)}return p}function Eo(e){return e>>>=0,e-=e>>>1&1431655765,e=(e&858993459)+(e>>>2&858993459),(e+(e>>>4)&252645135)*16843009>>>24}var Do=class{_gridMinX;_gridMinY;_gridMinZ;_numVoxelsX;_numVoxelsY;_numVoxelsZ;_voxelResolution;_leafSize;_treeDepth;_nodes;_leafData;_push={x:0,y:0,z:0};_normalResult={nx:0,ny:0,nz:0};_constraintNormals=[{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0}];constructor(e,t,n){this._gridMinX=e.gridBounds.min[0],this._gridMinY=e.gridBounds.min[1],this._gridMinZ=e.gridBounds.min[2];let r=e.voxelResolution;this._numVoxelsX=Math.round((e.gridBounds.max[0]-e.gridBounds.min[0])/r),this._numVoxelsY=Math.round((e.gridBounds.max[1]-e.gridBounds.min[1])/r),this._numVoxelsZ=Math.round((e.gridBounds.max[2]-e.gridBounds.min[2])/r),this._voxelResolution=r,this._leafSize=e.leafSize,this._treeDepth=e.treeDepth,this._nodes=t,this._leafData=n}get gridMinX(){return this._gridMinX}get gridMinY(){return this._gridMinY}get gridMinZ(){return this._gridMinZ}get numVoxelsX(){return this._numVoxelsX}get numVoxelsY(){return this._numVoxelsY}get numVoxelsZ(){return this._numVoxelsZ}get voxelResolution(){return this._voxelResolution}get leafSize(){return this._leafSize}get treeDepth(){return this._treeDepth}get nodes(){return this._nodes}get leafData(){return this._leafData}get flipXY(){return!1}querySurfaceNormal(e,t,n,r,i,a){let o=this._voxelResolution*.25,s=Math.floor((e+Math.sign(r)*o-this._gridMinX)/this._voxelResolution),c=Math.floor((t+Math.sign(i)*o-this._gridMinY)/this._voxelResolution),l=Math.floor((n+Math.sign(a)*o-this._gridMinZ)/this._voxelResolution),u=this._normalResult,d=-1,f=0,p=1,m=0;for(let e=0;e<wo.length;e++){let t=wo[e],n=t[0],o=t[1],u=t[2],h=r*n+i*o+a*u;if(Math.abs(h)<1e-6)continue;let g=h<0?1:-1,_=n*g,v=o*g,y=u*g,b=To(this,s,c,l,_,v,y,t[3],t[4],t[5],t[6],t[7],t[8]);if(b>d){d=b;let e=Math.abs(n)+Math.abs(o)+Math.abs(u)>1?Co:1;f=_*e,p=v*e,m=y*e}}return u.nx=f,u.ny=p,u.nz=m,u}queryRay(e,t,n,r,i,a,o,s=!1){if(this._nodes.length===0)return null;let c=this._voxelResolution,l=this._gridMinX,u=this._gridMinY,d=this._gridMinZ,f=l+this._numVoxelsX*c,p=u+this._numVoxelsY*c,m=d+this._numVoxelsZ*c,h=1e-12,g=0,_=o;if(Math.abs(r)>h){let t=(l-e)/r,n=(f-e)/r;if(t>n){let e=t;t=n,n=e}if(t>g&&(g=t),_=Math.min(_,n),g>_)return null}else if(e<l||e>=f)return null;if(Math.abs(i)>h){let e=(u-t)/i,n=(p-t)/i;if(e>n){let t=e;e=n,n=t}if(e>g&&(g=e),_=Math.min(_,n),g>_)return null}else if(t<u||t>=p)return null;if(Math.abs(a)>h){let e=(d-n)/a,t=(m-n)/a;if(e>t){let n=e;e=t,t=n}if(e>g&&(g=e),_=Math.min(_,t),g>_)return null}else if(n<d||n>=m)return null;let v=e+r*g,y=t+i*g,b=n+a*g,x=Math.max(0,Math.min(Math.floor((v-l)/c),this._numVoxelsX-1)),S=Math.max(0,Math.min(Math.floor((y-u)/c),this._numVoxelsY-1)),C=Math.max(0,Math.min(Math.floor((b-d)/c),this._numVoxelsZ-1)),w=r>0?1:r<0?-1:0,T=i>0?1:i<0?-1:0,E=a>0?1:a<0?-1:0,D=Math.abs(r)>h?1/r:0,O=Math.abs(i)>h?1/i:0,k=Math.abs(a)>h?1/a:0,A=Math.abs(r)>h?(l+(x+ +(r>0))*c-e)*D:1/0,j=Math.abs(i)>h?(u+(S+ +(i>0))*c-t)*O:1/0,M=Math.abs(a)>h?(d+(C+ +(a>0))*c-n)*k:1/0,N=Math.abs(r)>h?c*Math.abs(D):1/0,P=Math.abs(i)>h?c*Math.abs(O):1/0,F=Math.abs(a)>h?c*Math.abs(k):1/0,I=g,L=this._numVoxelsX+this._numVoxelsY+this._numVoxelsZ,R=s&&g===0&&this.isVoxelSolid(x,S,C);for(let s=0;s<L;s++){if(this.isVoxelSolid(x,S,C)!==R)return{x:e+r*I,y:t+i*I,z:n+a*I,exit:R};A<j?A<M?(I=A,x+=w,A+=N):(I=M,C+=E,M+=F):j<M?(I=j,S+=T,j+=P):(I=M,C+=E,M+=F);let s=x<0||S<0||C<0||x>=this._numVoxelsX||S>=this._numVoxelsY||C>=this._numVoxelsZ;if(s&&R&&I<=o)return{x:e+r*I,y:t+i*I,z:n+a*I,exit:!0};if(s||I>o)return null}return null}querySphere(e,t,n,r,i){return this.nodes.length!==0&&no(e,t,n,(e,t,n,i)=>this.resolveDeepestPenetration(e,t,n,r,i),this._constraintNormals,this._push,i)}queryCapsule(e,t,n,r,i,a){return this.nodes.length!==0&&no(e,t,n,(e,t,n,a)=>this.resolveDeepestPenetrationCapsule(e,t,n,r,i,a),this._constraintNormals,this._push,a)}resolveDeepestPenetration(e,t,n,r,i){let{voxelResolution:a,gridMinX:o,gridMinY:s,gridMinZ:c}=this,l=r*r,u=Math.floor((e-r-o)/a),d=Math.floor((t-r-s)/a),f=Math.floor((n-r-c)/a),p=Math.floor((e+r-o)/a),m=Math.floor((t+r-s)/a),h=Math.floor((n+r-c)/a),g=0,_=0,v=0,y=eo,b=!1;for(let i=f;i<=h;i++)for(let f=d;f<=m;f++)for(let d=u;d<=p;d++){if(!this.isVoxelSolid(d,f,i))continue;let u=o+d*a,p=s+f*a,m=c+i*a,h=u+a,x=p+a,S=m+a,C=Math.max(u,Math.min(e,h)),w=Math.max(p,Math.min(t,x)),T=Math.max(m,Math.min(n,S)),E=e-C,D=t-w,O=n-T,k=E*E+D*D+O*O;if(k>=l)continue;let A,j,M,N;if(k>1e-12){let e=Math.sqrt(k);N=r-e;let t=1/e;A=E*t*N,j=D*t*N,M=O*t*N}else{let i=e-u,a=h-e,o=t-p,s=x-t,c=n-m,l=S-n,d=i<a?-(i+r):a+r,f=o<s?-(o+r):s+r,g=c<l?-(c+r):l+r,_=Math.abs(d),v=Math.abs(f),y=Math.abs(g);A=0,j=0,M=0,_<=v&&_<=y?(A=d,N=_):v<=y?(j=f,N=v):(M=g,N=y)}N>y&&(y=N,g=A,_=j,v=M,b=!0)}return b&&(i.x=g,i.y=_,i.z=v),b}resolveDeepestPenetrationCapsule(e,t,n,r,i,a){let{voxelResolution:o,gridMinX:s,gridMinY:c,gridMinZ:l}=this,u=i*i,d=t-r,f=t+r,p=Math.floor((e-i-s)/o),m=Math.floor((d-i-c)/o),h=Math.floor((n-i-l)/o),g=Math.floor((e+i-s)/o),_=Math.floor((f+i-c)/o),v=Math.floor((n+i-l)/o),y=0,b=0,x=0,S=eo,C=!1;for(let t=h;t<=v;t++)for(let r=m;r<=_;r++)for(let a=p;a<=g;a++){if(!this.isVoxelSolid(a,r,t))continue;let p=s+a*o,m=c+r*o,h=l+t*o,g=p+o,_=m+o,v=h+o,w;if(f<m)w=f;else if(d>_)w=d;else{let e=(m+_)*.5;w=Math.max(d,Math.min(f,e))}let T=Math.max(p,Math.min(e,g)),E=Math.max(m,Math.min(w,_)),D=Math.max(h,Math.min(n,v)),O=e-T,k=w-E,A=n-D,j=O*O+k*k+A*A;if(j>=u)continue;let M,N,P,F;if(j>1e-12){let e=Math.sqrt(j);F=i-e;let t=1/e;M=O*t*F,N=k*t*F,P=A*t*F}else{let t=e-p,r=g-e,a=w-m,o=_-w,s=n-h,c=v-n,l=t<r?-(t+i):r+i,u=a<o?-(a+i):o+i,d=s<c?-(s+i):c+i,f=Math.abs(l),y=Math.abs(u),b=Math.abs(d);M=0,N=0,P=0,f<=y&&f<=b?(M=l,F=f):y<=b?(N=u,F=y):(P=d,F=b)}F>S&&(S=F,y=M,b=N,x=P,C=!0)}return C&&(a.x=y,a.y=b,a.z=x),C}isVoxelSolid(e,t,n){if(this.nodes.length===0||e<0||t<0||n<0||e>=this.numVoxelsX||t>=this.numVoxelsY||n>=this.numVoxelsZ)return!1;let{leafSize:r,treeDepth:i}=this,a=Math.floor(e/r),o=Math.floor(t/r),s=Math.floor(n/r),c=0;for(let r=i-1;r>=0;r--){let i=this.nodes[c]>>>0;if(i===xo)return!0;let l=i>>>24&255;if(l===0)return this.checkLeafByIndex(i,e,t,n);let u=a>>>r&1,d=o>>>r&1,f=(s>>>r&1)<<2|d<<1|u;if(!(l&1<<f))return!1;c=(i&16777215)+Eo(l&(1<<f)-1)}let l=this.nodes[c]>>>0;return l===xo||this.checkLeafByIndex(l,e,t,n)}readBlock(e,t,n,r){r[0]=0,r[1]=0;let{leafSize:i,treeDepth:a,nodes:o,leafData:s}=this;if(o.length===0||e<0||t<0||n<0||e*i>=this.numVoxelsX||t*i>=this.numVoxelsY||n*i>=this.numVoxelsZ)return;let c=0;for(let i=a-1;i>=-1;i--){let a=o[c]>>>0;if(a===xo){r[0]=4294967295,r[1]=4294967295;return}let l=a>>>24&255;if(l===0||i<0){let e=a&16777215;r[0]=s[e*2],r[1]=s[e*2+1];return}let u=(n>>>i&1)<<2|(t>>>i&1)<<1|e>>>i&1;if(!(l&1<<u))return;c=(a&16777215)+Eo(l&(1<<u)-1)}}checkLeafByIndex(e,t,n,r){let i=e&16777215,a=t&3,o=n&3,s=(r&3)*16+o*4+a;return s<32?(this.leafData[i*2]>>>0>>>s&1)==1:(this.leafData[i*2+1]>>>0>>>s-32&1)==1}},Oo=class extends Do{get flipXY(){return!0}querySurfaceNormal(e,t,n,r,i,a){let o=super.querySurfaceNormal(-e,-t,n,-r,-i,a);return o.nx=-o.nx,o.ny=-o.ny,o}queryRay(e,t,n,r,i,a,o,s=!1){let c=super.queryRay(-e,-t,n,-r,-i,a,o,s);return c&&(c.x=-c.x,c.y=-c.y),c}querySphere(e,t,n,r,i){let a=super.querySphere(-e,-t,n,r,i);return a&&(i.x=-i.x,i.y=-i.y),a}queryCapsule(e,t,n,r,i,a){let o=super.queryCapsule(-e,-t,n,r,i,a);return o&&(a.x=-a.x,a.y=-a.y),o}},ko=async e=>{let t=await fetch(e);if(!t.ok)throw Error(`Failed to fetch voxel metadata: ${t.statusText}`);let n=await t.json(),r=e.replace(`.voxel.json`,`.voxel.bin`),i=await fetch(r);if(!i.ok)throw Error(`Failed to fetch voxel binary: ${i.statusText}`);let a=await i.arrayBuffer(),o=new Uint32Array(a),s=o.slice(0,n.nodeCount),c=o.slice(n.nodeCount,n.nodeCount+n.leafDataCount);return!n.version||parseFloat(n.version)<1.1?new Oo(n,s,c):new Do(n,s,c)},Ao=(e,t)=>{let n=new Set(Object.keys(t));return new Proxy(t,{set(t,r,i,a){if(typeof r==`symbol`)return console.error(`Cannot set symbol property on target`),!1;if(!n.has(r))return console.error(`Cannot set new property on target`),!1;if(t[r]!==i){let n=t[r];t[r]=i,e.fire(`${r}:changed`,i,n)}return!0}})},jo='async function createGsafModule(moduleArg={}){var Module=moduleArg;var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=true;var programArgs=[];var thisProgram="./this.program";var _scriptName;if(ENVIRONMENT_IS_WORKER){_scriptName=self.location.href}var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readAsync,readBinary;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){try{scriptDirectory=new URL(".",_scriptName).href}catch{}{if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=async url=>{var response=await fetch(url,{credentials:"same-origin"});if(response.ok){return response.arrayBuffer()}throw new Error(response.status+" : "+response.url)}}}else{}var out=console.log.bind(console);var err=console.error.bind(console);var wasmBinary;var ABORT=false;class EmscriptenEH{}class EmscriptenSjLj extends EmscriptenEH{}var runtimeInitialized=false;function updateMemoryViews(){var b=wasmMemory.buffer;HEAP8=new Int8Array(b);HEAP16=new Int16Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);HEAPU16=new Uint16Array(b);HEAP32=new Int32Array(b);HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);HEAPF64=new Float64Array(b);HEAP64=new BigInt64Array(b);HEAPU64=new BigUint64Array(b)}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(onPreRuns)}function initRuntime(){runtimeInitialized=true;wasmExports["F"]()}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(onPostRuns)}function abort(what){Module["onAbort"]?.(what);what=`Aborted(${what})`;err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);throw e}var wasmBinaryFile;function findWasmBinary(){return locateFile("gsaf-decoder.wasm")}function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){if(!wasmBinary){try{var response=await readAsync(binaryFile);return new Uint8Array(response)}catch{}}return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var binary=await getWasmBinary(binaryFile);var instance=await WebAssembly.instantiate(binary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)}}async function instantiateAsync(binary,binaryFile,imports){if(!binary){try{var response=fetch(binaryFile,{credentials:"same-origin"});var instantiationResult=await WebAssembly.instantiateStreaming(response,imports);return instantiationResult}catch(reason){err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation")}}return instantiateArrayBuffer(binaryFile,imports)}function getWasmImports(){var imports={a:wasmImports};return imports}async function createWasm(){function receiveInstance(instance,module){wasmExports=instance.exports;assignWasmExports(wasmExports);updateMemoryViews();return wasmExports}function receiveInstantiationResult(result){return receiveInstance(result["instance"])}var info=getWasmImports();if(Module["instantiateWasm"]){return new Promise((resolve,reject)=>{Module["instantiateWasm"](info,(inst,mod)=>{resolve(receiveInstance(inst,mod))})})}wasmBinaryFile??=findWasmBinary();var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);var exports=receiveInstantiationResult(result);return exports}class ExitStatus{name="ExitStatus";constructor(status){this.message=`Program terminated with exit(${status})`;this.status=status}}var HEAP16;var HEAP32;var HEAP64;var HEAP8;var HEAPF32;var HEAPF64;var HEAPU16;var HEAPU32;var HEAPU64;var HEAPU8;var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};var onPostRuns=[];var addOnPostRun=cb=>onPostRuns.push(cb);var onPreRuns=[];var addOnPreRun=cb=>onPreRuns.push(cb);var noExitRuntime=true;var stackRestore=val=>__emscripten_stack_restore(val);var stackSave=()=>_emscripten_stack_get_current();class ExceptionInfo{constructor(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24}set_type(type){HEAPU32[this.ptr+4>>2]=type}get_type(){return HEAPU32[this.ptr+4>>2]}set_destructor(destructor){HEAPU32[this.ptr+8>>2]=destructor}get_destructor(){return HEAPU32[this.ptr+8>>2]}set_caught(caught){caught=caught?1:0;HEAP8[this.ptr+12]=caught}get_caught(){return HEAP8[this.ptr+12]!=0}set_rethrown(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13]=rethrown}get_rethrown(){return HEAP8[this.ptr+13]!=0}init(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor)}set_adjusted_ptr(adjustedPtr){HEAPU32[this.ptr+16>>2]=adjustedPtr}get_adjusted_ptr(){return HEAPU32[this.ptr+16>>2]}}var uncaughtExceptionCount=0;var ___cxa_throw=(ptr,type,destructor)=>{var info=new ExceptionInfo(ptr);info.init(type,destructor);uncaughtExceptionCount++;abort()};var __abort_js=()=>abort("");var AsciiToString=ptr=>{var str="";while(1){var ch=HEAPU8[ptr++];if(!ch)return str;str+=String.fromCharCode(ch)}};var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var BindingError=class BindingError extends Error{constructor(message){super(message);this.name="BindingError"}};var throwBindingError=message=>{throw new BindingError(message)};function sharedRegisterType(rawType,registeredInstance,options={}){var name=registeredInstance.name;if(!rawType){throwBindingError(`type "${name}" must have a positive integer typeid pointer`)}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else{throwBindingError(`Cannot register type \'${name}\' twice`)}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(cb=>cb())}}function registerType(rawType,registeredInstance,options={}){return sharedRegisterType(rawType,registeredInstance,options)}var integerReadValueFromPointer=(name,width,signed)=>{switch(width){case 1:return signed?pointer=>HEAP8[pointer]:pointer=>HEAPU8[pointer];case 2:return signed?pointer=>HEAP16[pointer>>1]:pointer=>HEAPU16[pointer>>1];case 4:return signed?pointer=>HEAP32[pointer>>2]:pointer=>HEAPU32[pointer>>2];case 8:return signed?pointer=>HEAP64[pointer>>3]:pointer=>HEAPU64[pointer>>3];default:throw new TypeError(`invalid integer width (${width}): ${name}`)}};var __embind_register_bigint=(primitiveType,name,size,minRange,maxRange)=>{name=AsciiToString(name);const isUnsignedType=minRange===0n;let fromWireType=value=>value;if(isUnsignedType){const bitSize=size*8;fromWireType=value=>BigInt.asUintN(bitSize,value);maxRange=fromWireType(maxRange)}registerType(primitiveType,{name,fromWireType,toWireType:(destructors,value)=>{if(typeof value=="number"){value=BigInt(value)}return value},readValueFromPointer:integerReadValueFromPointer(name,size,!isUnsignedType),destructorFunction:null})};var __embind_register_bool=(rawType,name,trueValue,falseValue)=>{name=AsciiToString(name);registerType(rawType,{name,fromWireType:function(wt){return!!wt},toWireType:function(destructors,o){return o?trueValue:falseValue},readValueFromPointer:function(pointer){return this.fromWireType(HEAPU8[pointer])},destructorFunction:null})};var shallowCopyInternalPointer=o=>({count:o.count,deleteScheduled:o.deleteScheduled,preservePointerOnDelete:o.preservePointerOnDelete,ptr:o.ptr,ptrType:o.ptrType,smartPtr:o.smartPtr,smartPtrType:o.smartPtrType});var throwInstanceAlreadyDeleted=obj=>{function getInstanceTypeName(handle){return handle.$$.ptrType.registeredClass.name}throwBindingError(getInstanceTypeName(obj)+" instance already deleted")};var finalizationRegistry=false;var detachFinalizer=handle=>{};var runDestructor=$$=>{if($$.smartPtr){$$.smartPtrType.rawDestructor($$.smartPtr)}else{$$.ptrType.registeredClass.rawDestructor($$.ptr)}};var releaseClassHandle=$$=>{$$.count.value-=1;var toDelete=0===$$.count.value;if(toDelete){runDestructor($$)}};var attachFinalizer=handle=>{if(!globalThis.FinalizationRegistry){attachFinalizer=handle=>handle;return handle}finalizationRegistry=new FinalizationRegistry(info=>{releaseClassHandle(info.$$)});attachFinalizer=handle=>{var $$=handle.$$;var hasSmartPtr=!!$$.smartPtr;if(hasSmartPtr){var info={$$};finalizationRegistry.register(handle,info,handle)}return handle};detachFinalizer=handle=>finalizationRegistry.unregister(handle);return attachFinalizer(handle)};var deletionQueue=[];var flushPendingDeletes=()=>{while(deletionQueue.length){var obj=deletionQueue.pop();obj.$$.deleteScheduled=false;obj["delete"]()}};var delayFunction;var init_ClassHandle=()=>{let proto=ClassHandle.prototype;Object.assign(proto,{isAliasOf(other){if(!(this instanceof ClassHandle)){return false}if(!(other instanceof ClassHandle)){return false}var leftClass=this.$$.ptrType.registeredClass;var left=this.$$.ptr;other.$$=other.$$;var rightClass=other.$$.ptrType.registeredClass;var right=other.$$.ptr;while(leftClass.baseClass){left=leftClass.upcast(left);leftClass=leftClass.baseClass}while(rightClass.baseClass){right=rightClass.upcast(right);rightClass=rightClass.baseClass}return leftClass===rightClass&&left===right},clone(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this)}if(this.$$.preservePointerOnDelete){this.$$.count.value+=1;return this}else{var clone=attachFinalizer(Object.create(Object.getPrototypeOf(this),{$$:{value:shallowCopyInternalPointer(this.$$)}}));clone.$$.count.value+=1;clone.$$.deleteScheduled=false;return clone}},delete(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this)}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion")}detachFinalizer(this);releaseClassHandle(this.$$);if(!this.$$.preservePointerOnDelete){this.$$.smartPtr=undefined;this.$$.ptr=undefined}},isDeleted(){return!this.$$.ptr},deleteLater(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this)}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion")}deletionQueue.push(this);if(deletionQueue.length===1&&delayFunction){delayFunction(flushPendingDeletes)}this.$$.deleteScheduled=true;return this}});const symbolDispose=Symbol.dispose;if(symbolDispose){proto[symbolDispose]=proto["delete"]}};function ClassHandle(){}var createNamedFunction=(name,func)=>Object.defineProperty(func,"name",{value:name});var registeredPointers={};var ensureOverloadTable=(proto,methodName,humanName)=>{if(undefined===proto[methodName].overloadTable){var prevFunc=proto[methodName];proto[methodName]=function(...args){if(!proto[methodName].overloadTable.hasOwnProperty(args.length)){throwBindingError(`Function \'${humanName}\' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`)}return proto[methodName].overloadTable[args.length].apply(this,args)};proto[methodName].overloadTable=[];proto[methodName].overloadTable[prevFunc.argCount]=prevFunc}};var exposePublicSymbol=(name,value,numArguments)=>{if(Module.hasOwnProperty(name)){if(undefined===numArguments||undefined!==Module[name].overloadTable&&undefined!==Module[name].overloadTable[numArguments]){throwBindingError(`Cannot register public name \'${name}\' twice`)}ensureOverloadTable(Module,name,name);if(Module[name].overloadTable.hasOwnProperty(numArguments)){throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`)}Module[name].overloadTable[numArguments]=value}else{Module[name]=value;Module[name].argCount=numArguments}};var char_0=48;var char_9=57;var makeLegalFunctionName=name=>{name=name.replace(/[^a-zA-Z0-9_]/g,"$");var f=name.charCodeAt(0);if(f>=char_0&&f<=char_9){return`_${name}`}return name};function RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast){this.name=name;this.constructor=constructor;this.instancePrototype=instancePrototype;this.rawDestructor=rawDestructor;this.baseClass=baseClass;this.getActualType=getActualType;this.upcast=upcast;this.downcast=downcast;this.pureVirtualFunctions=[]}var upcastPointer=(ptr,ptrClass,desiredClass)=>{while(ptrClass!==desiredClass){if(!ptrClass.upcast){throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`)}ptr=ptrClass.upcast(ptr);ptrClass=ptrClass.baseClass}return ptr};var embindRepr=v=>{if(v===null){return"null"}var t=typeof v;if(t==="object"||t==="array"||t==="function"){return v.toString()}else{return""+v}};function constNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError(`null is not a valid ${this.name}`)}return 0}if(!handle.$$){throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`)}if(!handle.$$.ptr){throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`)}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function genericPointerToWireType(destructors,handle){var ptr;if(handle===null){if(this.isReference){throwBindingError(`null is not a valid ${this.name}`)}if(this.isSmartPointer){ptr=this.rawConstructor();if(destructors!==null){destructors.push(this.rawDestructor,ptr)}return ptr}else{return 0}}if(!handle||!handle.$$){throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`)}if(!handle.$$.ptr){throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`)}if(!this.isConst&&handle.$$.ptrType.isConst){throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name} to parameter type ${this.name}`)}var handleClass=handle.$$.ptrType.registeredClass;ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);if(this.isSmartPointer){if(undefined===handle.$$.smartPtr){throwBindingError("Passing raw pointer to smart pointer is illegal")}switch(this.sharingPolicy){case 0:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr}else{throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name} to parameter type ${this.name}`)}break;case 1:ptr=handle.$$.smartPtr;break;case 2:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr}else{var clonedHandle=handle["clone"]();ptr=this.rawShare(ptr,Emval.toHandle(()=>clonedHandle["delete"]()));if(destructors!==null){destructors.push(this.rawDestructor,ptr)}}break;default:throwBindingError("Unsupported sharing policy")}}return ptr}function nonConstNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError(`null is not a valid ${this.name}`)}return 0}if(!handle.$$){throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`)}if(!handle.$$.ptr){throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`)}if(handle.$$.ptrType.isConst){throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`)}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function readPointer(pointer){return this.fromWireType(HEAPU32[pointer>>2])}var downcastPointer=(ptr,ptrClass,desiredClass)=>{if(ptrClass===desiredClass){return ptr}if(undefined===desiredClass.baseClass){return null}var rv=downcastPointer(ptr,ptrClass,desiredClass.baseClass);if(rv===null){return null}return desiredClass.downcast(rv)};var registeredInstances={};var getBasestPointer=(class_,ptr)=>{if(ptr===undefined){throwBindingError("ptr should not be undefined")}while(class_.baseClass){ptr=class_.upcast(ptr);class_=class_.baseClass}return ptr};var getInheritedInstance=(class_,ptr)=>{ptr=getBasestPointer(class_,ptr);return registeredInstances[ptr]};var InternalError=class InternalError extends Error{constructor(message){super(message);this.name="InternalError"}};var throwInternalError=message=>{throw new InternalError(message)};var makeClassHandle=(prototype,record)=>{if(!record.ptrType||!record.ptr){throwInternalError("makeClassHandle requires ptr and ptrType")}var hasSmartPtrType=!!record.smartPtrType;var hasSmartPtr=!!record.smartPtr;if(hasSmartPtrType!==hasSmartPtr){throwInternalError("Both smartPtrType and smartPtr must be specified")}record.count={value:1};return attachFinalizer(Object.create(prototype,{$$:{value:record,writable:true}}))};function RegisteredPointer_fromWireType(ptr){var rawPointer=this.getPointee(ptr);if(!rawPointer){this.destructor(ptr);return null}var registeredInstance=getInheritedInstance(this.registeredClass,rawPointer);if(undefined!==registeredInstance){if(0===registeredInstance.$$.count.value){registeredInstance.$$.ptr=rawPointer;registeredInstance.$$.smartPtr=ptr;return registeredInstance["clone"]()}else{var rv=registeredInstance["clone"]();this.destructor(ptr);return rv}}function makeDefaultHandle(){if(this.isSmartPointer){return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:rawPointer,smartPtrType:this,smartPtr:ptr})}else{return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this,ptr})}}var actualType=this.registeredClass.getActualType(rawPointer);var registeredPointerRecord=registeredPointers[actualType];if(!registeredPointerRecord){return makeDefaultHandle.call(this)}var toType;if(this.isConst){toType=registeredPointerRecord.constPointerType}else{toType=registeredPointerRecord.pointerType}var dp=downcastPointer(rawPointer,this.registeredClass,toType.registeredClass);if(dp===null){return makeDefaultHandle.call(this)}if(this.isSmartPointer){return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp,smartPtrType:this,smartPtr:ptr})}else{return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp})}}var init_RegisteredPointer=()=>{Object.assign(RegisteredPointer.prototype,{getPointee(ptr){if(this.rawGetPointee){ptr=this.rawGetPointee(ptr)}return ptr},destructor(ptr){this.rawDestructor?.(ptr)},readValueFromPointer:readPointer,fromWireType:RegisteredPointer_fromWireType})};function RegisteredPointer(name,registeredClass,isReference,isConst,isSmartPointer,pointeeType,sharingPolicy,rawGetPointee,rawConstructor,rawShare,rawDestructor){this.name=name;this.registeredClass=registeredClass;this.isReference=isReference;this.isConst=isConst;this.isSmartPointer=isSmartPointer;this.pointeeType=pointeeType;this.sharingPolicy=sharingPolicy;this.rawGetPointee=rawGetPointee;this.rawConstructor=rawConstructor;this.rawShare=rawShare;this.rawDestructor=rawDestructor;if(!isSmartPointer&&registeredClass.baseClass===undefined){if(isConst){this.toWireType=constNoSmartPtrRawPointerToWireType;this.destructorFunction=null}else{this.toWireType=nonConstNoSmartPtrRawPointerToWireType;this.destructorFunction=null}}else{this.toWireType=genericPointerToWireType}}var replacePublicSymbol=(name,value,numArguments)=>{if(!Module.hasOwnProperty(name)){throwInternalError("Replacing nonexistent public symbol")}if(undefined!==Module[name].overloadTable&&undefined!==numArguments){Module[name].overloadTable[numArguments]=value}else{Module[name]=value;Module[name].argCount=numArguments}};var wasmTableMirror=[];var getWasmTableEntry=funcPtr=>{var func=wasmTableMirror[funcPtr];if(!func){wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}return func};var embind__requireFunction=(signature,rawFunction,isAsync=false)=>{signature=AsciiToString(signature);function makeDynCaller(){var rtn=getWasmTableEntry(rawFunction);return rtn}var fp=makeDynCaller();if(typeof fp!="function"){throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`)}return fp};class UnboundTypeError extends Error{}var getTypeName=type=>{var ptr=___getTypeName(type);var rv=AsciiToString(ptr);_free(ptr);return rv};var throwUnboundTypeError=(message,types)=>{var unboundTypes=[];var seen={};function visit(type){if(seen[type]){return}if(registeredTypes[type]){return}if(typeDependencies[type]){typeDependencies[type].forEach(visit);return}unboundTypes.push(type);seen[type]=true}types.forEach(visit);throw new UnboundTypeError(`${message}: `+unboundTypes.map(getTypeName).join([", "]))};var whenDependentTypesAreResolved=(myTypes,dependentTypes,getTypeConverters)=>{myTypes.forEach(type=>typeDependencies[type]=dependentTypes);function onComplete(typeConverters){var myTypeConverters=getTypeConverters(typeConverters);if(myTypeConverters.length!==myTypes.length){throwInternalError("Mismatched type converter count")}for(var i=0;i<myTypes.length;++i){registerType(myTypes[i],myTypeConverters[i])}}var typeConverters=new Array(dependentTypes.length);var unregisteredTypes=[];var registered=0;for(let[i,dt]of dependentTypes.entries()){if(registeredTypes.hasOwnProperty(dt)){typeConverters[i]=registeredTypes[dt]}else{unregisteredTypes.push(dt);if(!awaitingDependencies.hasOwnProperty(dt)){awaitingDependencies[dt]=[]}awaitingDependencies[dt].push(()=>{typeConverters[i]=registeredTypes[dt];++registered;if(registered===unregisteredTypes.length){onComplete(typeConverters)}})}}if(0===unregisteredTypes.length){onComplete(typeConverters)}};var __embind_register_class=(rawType,rawPointerType,rawConstPointerType,baseClassRawType,getActualTypeSignature,getActualType,upcastSignature,upcast,downcastSignature,downcast,name,destructorSignature,rawDestructor)=>{name=AsciiToString(name);getActualType=embind__requireFunction(getActualTypeSignature,getActualType);upcast&&=embind__requireFunction(upcastSignature,upcast);downcast&&=embind__requireFunction(downcastSignature,downcast);rawDestructor=embind__requireFunction(destructorSignature,rawDestructor);var legalFunctionName=makeLegalFunctionName(name);exposePublicSymbol(legalFunctionName,function(){throwUnboundTypeError(`Cannot construct ${name} due to unbound types`,[baseClassRawType])});whenDependentTypesAreResolved([rawType,rawPointerType,rawConstPointerType],baseClassRawType?[baseClassRawType]:[],base=>{base=base[0];var baseClass;var basePrototype;if(baseClassRawType){baseClass=base.registeredClass;basePrototype=baseClass.instancePrototype}else{basePrototype=ClassHandle.prototype}var constructor=createNamedFunction(name,function(...args){if(Object.getPrototypeOf(this)!==instancePrototype){throw new BindingError(`Use \'new\' to construct ${name}`)}if(undefined===registeredClass.constructor_body){throw new BindingError(`${name} has no accessible constructor`)}var body=registeredClass.constructor_body[args.length];if(undefined===body){throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${args.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`)}return body.apply(this,args)});var instancePrototype=Object.create(basePrototype,{constructor:{value:constructor}});constructor.prototype=instancePrototype;var registeredClass=new RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast);if(registeredClass.baseClass){registeredClass.baseClass.__derivedClasses??=[];registeredClass.baseClass.__derivedClasses.push(registeredClass)}var referenceConverter=new RegisteredPointer(name,registeredClass,true,false,false);var pointerConverter=new RegisteredPointer(name+"*",registeredClass,false,false,false);var constPointerConverter=new RegisteredPointer(name+" const*",registeredClass,false,true,false);registeredPointers[rawType]={pointerType:pointerConverter,constPointerType:constPointerConverter};replacePublicSymbol(legalFunctionName,constructor);return[referenceConverter,pointerConverter,constPointerConverter]})};var runDestructors=destructors=>{while(destructors.length){var ptr=destructors.pop();var del=destructors.pop();del(ptr)}};function usesDestructorStack(argTypes){for(var i=1;i<argTypes.length;++i){if(argTypes[i]!==null&&argTypes[i].destructorFunction===undefined){return true}}return false}function craftInvokerFunction(humanName,argTypes,classType,cppInvokerFunc,cppTargetFunc,isAsync){var argCount=argTypes.length;if(argCount<2){throwBindingError("argTypes array size mismatch! Must at least get return value and \'this\' types!")}var isClassMethodFunc=argTypes[1]!==null&&classType!==null;var needsDestructorStack=usesDestructorStack(argTypes);var returns=!argTypes[0].isVoid;var expectedArgCount=argCount-2;var argsWired=new Array(expectedArgCount);var invokerFuncArgs=[];var destructors=[];var invokerFn=function(...args){destructors.length=0;var thisWired;invokerFuncArgs.length=isClassMethodFunc?2:1;invokerFuncArgs[0]=cppTargetFunc;if(isClassMethodFunc){thisWired=argTypes[1].toWireType(destructors,this);invokerFuncArgs[1]=thisWired}for(var i=0;i<expectedArgCount;++i){argsWired[i]=argTypes[i+2].toWireType(destructors,args[i]);invokerFuncArgs.push(argsWired[i])}var rv=cppInvokerFunc(...invokerFuncArgs);function onDone(rv){if(needsDestructorStack){runDestructors(destructors)}else{for(var i=isClassMethodFunc?1:2;i<argTypes.length;i++){var param=i===1?thisWired:argsWired[i-2];if(argTypes[i].destructorFunction!==null){argTypes[i].destructorFunction(param)}}}if(returns){return argTypes[0].fromWireType(rv)}}return onDone(rv)};return createNamedFunction(humanName,invokerFn)}var heap32VectorToArray=(count,firstElement)=>{var array=[];for(var i=0;i<count;i++){array.push(HEAPU32[firstElement+i*4>>2])}return array};var getFunctionName=signature=>{signature=signature.trim();const argsIndex=signature.indexOf("(");if(argsIndex===-1)return signature;return signature.slice(0,argsIndex)};var __embind_register_class_class_function=(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,fn,isAsync,isNonnullReturn)=>{var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=AsciiToString(methodName);methodName=getFunctionName(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker,isAsync);whenDependentTypesAreResolved([],[rawClassType],classType=>{classType=classType[0];var humanName=`${classType.name}.${methodName}`;function unboundTypesHandler(){throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`,rawArgTypes)}if(methodName.startsWith("@@")){methodName=Symbol[methodName.substring(2)]}var proto=classType.registeredClass.constructor;if(undefined===proto[methodName]){unboundTypesHandler.argCount=argCount-1;proto[methodName]=unboundTypesHandler}else{ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-1]=unboundTypesHandler}whenDependentTypesAreResolved([],rawArgTypes,argTypes=>{var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));var func=craftInvokerFunction(humanName,invokerArgsArray,null,rawInvoker,fn,isAsync);if(undefined===proto[methodName].overloadTable){func.argCount=argCount-1;proto[methodName]=func}else{proto[methodName].overloadTable[argCount-1]=func}if(classType.registeredClass.__derivedClasses){for(const derivedClass of classType.registeredClass.__derivedClasses){if(!derivedClass.constructor.hasOwnProperty(methodName)){derivedClass.constructor[methodName]=func}}}return[]});return[]})};var __embind_register_class_constructor=(rawClassType,argCount,rawArgTypesAddr,invokerSignature,invoker,rawConstructor)=>{var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);invoker=embind__requireFunction(invokerSignature,invoker);whenDependentTypesAreResolved([],[rawClassType],classType=>{classType=classType[0];var humanName=`constructor ${classType.name}`;if(undefined===classType.registeredClass.constructor_body){classType.registeredClass.constructor_body=[]}if(undefined!==classType.registeredClass.constructor_body[argCount-1]){throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount-1}) for class \'${classType.name}\'! Overload resolution is currently only performed using the parameter count, not actual type info!`)}classType.registeredClass.constructor_body[argCount-1]=()=>{throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`,rawArgTypes)};whenDependentTypesAreResolved([],rawArgTypes,argTypes=>{argTypes.splice(1,0,null);classType.registeredClass.constructor_body[argCount-1]=craftInvokerFunction(humanName,argTypes,null,invoker,rawConstructor);return[]});return[]})};var __embind_register_class_function=(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,context,isPureVirtual,isAsync,isNonnullReturn)=>{var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=AsciiToString(methodName);methodName=getFunctionName(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker,isAsync);whenDependentTypesAreResolved([],[rawClassType],classType=>{classType=classType[0];var humanName=`${classType.name}.${methodName}`;if(methodName.startsWith("@@")){methodName=Symbol[methodName.substring(2)]}if(isPureVirtual){classType.registeredClass.pureVirtualFunctions.push(methodName)}function unboundTypesHandler(){throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`,rawArgTypes)}var proto=classType.registeredClass.instancePrototype;var method=proto[methodName];if(undefined===method||undefined===method.overloadTable&&method.className!==classType.name&&method.argCount===argCount-2){unboundTypesHandler.argCount=argCount-2;unboundTypesHandler.className=classType.name;proto[methodName]=unboundTypesHandler}else{ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-2]=unboundTypesHandler}whenDependentTypesAreResolved([],rawArgTypes,argTypes=>{var memberFunction=craftInvokerFunction(humanName,argTypes,classType,rawInvoker,context,isAsync);if(undefined===proto[methodName].overloadTable){memberFunction.argCount=argCount-2;proto[methodName]=memberFunction}else{proto[methodName].overloadTable[argCount-2]=memberFunction}return[]});return[]})};var validateThis=(this_,classType,humanName)=>{if(!(this_ instanceof Object)){throwBindingError(`${humanName} with invalid "this": ${this_}`)}if(!(this_ instanceof classType.registeredClass.constructor)){throwBindingError(`${humanName} incompatible with "this" of type ${this_.constructor.name}`)}if(!this_.$$.ptr){throwBindingError(`cannot call emscripten binding method ${humanName} on deleted object`)}return upcastPointer(this_.$$.ptr,this_.$$.ptrType.registeredClass,classType.registeredClass)};var __embind_register_class_property=(classType,fieldName,getterReturnType,getterSignature,getter,getterContext,setterArgumentType,setterSignature,setter,setterContext)=>{fieldName=AsciiToString(fieldName);getter=embind__requireFunction(getterSignature,getter);whenDependentTypesAreResolved([],[classType],classType=>{classType=classType[0];var humanName=`${classType.name}.${fieldName}`;var desc={get(){throwUnboundTypeError(`Cannot access ${humanName} due to unbound types`,[getterReturnType,setterArgumentType])},enumerable:true,configurable:true};if(setter){desc.set=()=>throwUnboundTypeError(`Cannot access ${humanName} due to unbound types`,[getterReturnType,setterArgumentType])}else{desc.set=v=>throwBindingError(humanName+" is a read-only property")}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);whenDependentTypesAreResolved([],setter?[getterReturnType,setterArgumentType]:[getterReturnType],types=>{var getterReturnType=types[0];var desc={get(){var ptr=validateThis(this,classType,humanName+" getter");return getterReturnType.fromWireType(getter(getterContext,ptr))},enumerable:true};if(setter){setter=embind__requireFunction(setterSignature,setter);var setterArgumentType=types[1];desc.set=function(v){var ptr=validateThis(this,classType,humanName+" setter");var destructors=[];setter(setterContext,ptr,setterArgumentType.toWireType(destructors,v));runDestructors(destructors)}}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);return[]});return[]})};var emval_freelist=[];var emval_handles=[0,1,,1,null,1,true,1,false,1];var __emval_decref=handle=>{if(handle>9&&0===--emval_handles[handle+1]){var value=emval_handles[handle];emval_handles[handle]=undefined;emval_freelist.push(handle)}};var Emval={toValue:handle=>{if(!handle){throwBindingError(`Cannot use deleted val. handle = ${handle}`)}return emval_handles[handle]},toHandle:value=>{switch(value){case undefined:return 2;case null:return 4;case true:return 6;case false:return 8;default:{const handle=emval_freelist.pop()||emval_handles.length;emval_handles[handle]=value;emval_handles[handle+1]=1;return handle}}}};var EmValType={name:"emscripten::val",fromWireType:handle=>{var rv=Emval.toValue(handle);__emval_decref(handle);return rv},toWireType:(destructors,value)=>Emval.toHandle(value),readValueFromPointer:readPointer,destructorFunction:null};var __embind_register_emval=rawType=>registerType(rawType,EmValType);var floatReadValueFromPointer=(name,width)=>{switch(width){case 4:return function(pointer){return this.fromWireType(HEAPF32[pointer>>2])};case 8:return function(pointer){return this.fromWireType(HEAPF64[pointer>>3])};default:throw new TypeError(`invalid float width (${width}): ${name}`)}};var __embind_register_float=(rawType,name,size)=>{name=AsciiToString(name);registerType(rawType,{name,fromWireType:value=>value,toWireType:(destructors,value)=>value,readValueFromPointer:floatReadValueFromPointer(name,size),destructorFunction:null})};var __embind_register_function=(name,argCount,rawArgTypesAddr,signature,rawInvoker,fn,isAsync,isNonnullReturn)=>{var argTypes=heap32VectorToArray(argCount,rawArgTypesAddr);name=AsciiToString(name);name=getFunctionName(name);rawInvoker=embind__requireFunction(signature,rawInvoker,isAsync);exposePublicSymbol(name,function(){throwUnboundTypeError(`Cannot call ${name} due to unbound types`,argTypes)},argCount-1);whenDependentTypesAreResolved([],argTypes,argTypes=>{var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));replacePublicSymbol(name,craftInvokerFunction(name,invokerArgsArray,null,rawInvoker,fn,isAsync),argCount-1);return[]})};var __embind_register_integer=(primitiveType,name,size,minRange,maxRange)=>{name=AsciiToString(name);const isUnsignedType=minRange===0;let fromWireType=value=>value;if(isUnsignedType){var bitshift=32-8*size;fromWireType=value=>value<<bitshift>>>bitshift;maxRange=fromWireType(maxRange)}registerType(primitiveType,{name,fromWireType,toWireType:(destructors,value)=>value,readValueFromPointer:integerReadValueFromPointer(name,size,minRange!==0),destructorFunction:null})};var __embind_register_memory_view=(rawType,dataTypeIndex,name)=>{var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){var size=HEAPU32[handle>>2];var data=HEAPU32[handle+4>>2];return new TA(HEAP8.buffer,data,size)}name=AsciiToString(name);registerType(rawType,{name,fromWireType:decodeMemoryView,readValueFromPointer:decodeMemoryView},{ignoreDuplicateRegistrations:true})};var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.codePointAt(i);if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;i++}}heap[outIdx]=0;return outIdx-startIdx};var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var UTF8Decoder=globalThis.TextDecoder&&new TextDecoder;var findStringEnd=(heapOrArray,idx,maxBytesToRead,ignoreNul)=>{var maxIdx=idx+maxBytesToRead;if(ignoreNul)return maxIdx;while(heapOrArray[idx]&&!(idx>=maxIdx))++idx;return idx};var UTF8ArrayToString=(heapOrArray,idx=0,maxBytesToRead,ignoreNul)=>{var endPtr=findStringEnd(heapOrArray,idx,maxBytesToRead,ignoreNul);if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str};var UTF8ToString=(ptr,maxBytesToRead,ignoreNul)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead,ignoreNul):"";var __embind_register_std_string=(rawType,name)=>{name=AsciiToString(name);var stdStringIsUTF8=true;registerType(rawType,{name,fromWireType(value){var length=HEAPU32[value>>2];var payload=value+4;var str;if(stdStringIsUTF8){str=UTF8ToString(payload,length,true)}else{str="";for(var i=0;i<length;++i){str+=String.fromCharCode(HEAPU8[payload+i])}}_free(value);return str},toWireType(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value)}var length;var valueIsOfTypeString=typeof value=="string";if(!(valueIsOfTypeString||ArrayBuffer.isView(value)&&value.BYTES_PER_ELEMENT==1)){throwBindingError("Cannot pass non-string to std::string")}if(stdStringIsUTF8&&valueIsOfTypeString){length=lengthBytesUTF8(value)}else{length=value.length}var base=_malloc(4+length+1);var ptr=base+4;HEAPU32[base>>2]=length;if(valueIsOfTypeString){if(stdStringIsUTF8){stringToUTF8(value,ptr,length+1)}else{for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(base);throwBindingError("String has UTF-16 code units that do not fit in 8 bits")}HEAPU8[ptr+i]=charCode}}}else{HEAPU8.set(value,ptr)}if(destructors!==null){destructors.push(_free,base)}return base},readValueFromPointer:readPointer,destructorFunction(ptr){_free(ptr)}})};var UTF16Decoder=globalThis.TextDecoder?new TextDecoder("utf-16le"):undefined;var UTF16ToString=(ptr,maxBytesToRead,ignoreNul)=>{var idx=ptr>>1;var endIdx=findStringEnd(HEAPU16,idx,maxBytesToRead/2,ignoreNul);if(endIdx-idx>16&&UTF16Decoder)return UTF16Decoder.decode(HEAPU16.subarray(idx,endIdx));var str="";for(var i=idx;i<endIdx;++i){var codeUnit=HEAPU16[i];str+=String.fromCharCode(codeUnit)}return str};var stringToUTF16=(str,outPtr,maxBytesToWrite)=>{maxBytesToWrite??=2147483647;if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2}HEAP16[outPtr>>1]=0;return outPtr-startPtr};var lengthBytesUTF16=str=>str.length*2;var UTF32ToString=(ptr,maxBytesToRead,ignoreNul)=>{var str="";var startIdx=ptr>>2;for(var i=0;!(i>=maxBytesToRead/4);i++){var utf32=HEAPU32[startIdx+i];if(!utf32&&!ignoreNul)break;str+=String.fromCodePoint(utf32)}return str};var stringToUTF32=(str,outPtr,maxBytesToWrite)=>{maxBytesToWrite??=2147483647;if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codePoint=str.codePointAt(i);if(codePoint>65535){i++}HEAP32[outPtr>>2]=codePoint;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr};var lengthBytesUTF32=str=>{var len=0;for(var i=0;i<str.length;++i){var codePoint=str.codePointAt(i);if(codePoint>65535){i++}len+=4}return len};var __embind_register_std_wstring=(rawType,charSize,name)=>{name=AsciiToString(name);var decodeString,encodeString,lengthBytesUTF;if(charSize===2){decodeString=UTF16ToString;encodeString=stringToUTF16;lengthBytesUTF=lengthBytesUTF16}else{decodeString=UTF32ToString;encodeString=stringToUTF32;lengthBytesUTF=lengthBytesUTF32}registerType(rawType,{name,fromWireType:value=>{var length=HEAPU32[value>>2];var str=decodeString(value+4,length*charSize,true);_free(value);return str},toWireType:(destructors,value)=>{if(!(typeof value=="string")){throwBindingError(`Cannot pass non-string to C++ string type ${name}`)}var length=lengthBytesUTF(value);var ptr=_malloc(4+length+charSize);HEAPU32[ptr>>2]=length/charSize;encodeString(value,ptr+4,length+charSize);if(destructors!==null){destructors.push(_free,ptr)}return ptr},readValueFromPointer:readPointer,destructorFunction(ptr){_free(ptr)}})};var __embind_register_void=(rawType,name)=>{name=AsciiToString(name);registerType(rawType,{isVoid:true,name,fromWireType:()=>undefined,toWireType:(destructors,o)=>undefined})};var __emval_array_to_memory_view=(dst,src)=>{dst=Emval.toValue(dst);src=Emval.toValue(src);dst.set(src)};var emval_methodCallers=[];var emval_addMethodCaller=caller=>{var id=emval_methodCallers.length;emval_methodCallers.push(caller);return id};var requireRegisteredType=(rawType,humanName)=>{var impl=registeredTypes[rawType];if(undefined===impl){throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`)}return impl};var emval_lookupTypes=(argCount,argTypes)=>{var a=new Array(argCount);for(var i=0;i<argCount;++i){a[i]=requireRegisteredType(HEAPU32[argTypes+i*4>>2],`parameter ${i}`)}return a};var emval_returnValue=(toReturnWire,destructorsRef,handle)=>{var destructors=[];var result=toReturnWire(destructors,handle);if(destructors.length){HEAPU32[destructorsRef>>2]=Emval.toHandle(destructors)}return result};var emval_symbols={};var getStringOrSymbol=address=>{var symbol=emval_symbols[address];if(symbol===undefined){return AsciiToString(address)}return symbol};var __emval_create_invoker=(argCount,argTypesPtr,kind)=>{var GenericWireTypeSize=8;var[retType,...argTypes]=emval_lookupTypes(argCount,argTypesPtr);var toReturnWire=retType.toWireType.bind(retType);var argFromPtr=argTypes.map(type=>type.readValueFromPointer.bind(type));argCount--;var argN=new Array(argCount);var invokerFunction=(handle,methodName,destructorsRef,args)=>{var offset=0;for(var i=0;i<argCount;++i){argN[i]=argFromPtr[i](args+offset);offset+=GenericWireTypeSize}var rv;switch(kind){case 0:rv=Emval.toValue(handle).apply(null,argN);break;case 2:rv=Reflect.construct(Emval.toValue(handle),argN);break;case 3:rv=argN[0];break;case 1:rv=Emval.toValue(handle)[getStringOrSymbol(methodName)](...argN);break}return emval_returnValue(toReturnWire,destructorsRef,rv)};var functionName=`methodCaller<(${argTypes.map(t=>t.name)}) => ${retType.name}>`;return emval_addMethodCaller(createNamedFunction(functionName,invokerFunction))};var __emval_get_global=name=>{if(!name){return Emval.toHandle(globalThis)}name=getStringOrSymbol(name);return Emval.toHandle(globalThis[name])};var __emval_get_property=(handle,key)=>{handle=Emval.toValue(handle);key=Emval.toValue(key);return Emval.toHandle(handle[key])};var __emval_incref=handle=>{if(handle>9){emval_handles[handle+1]+=1}};var __emval_invoke=(caller,handle,methodName,destructorsRef,args)=>emval_methodCallers[caller](handle,methodName,destructorsRef,args);var __emval_new_array=()=>Emval.toHandle([]);var __emval_new_cstring=v=>Emval.toHandle(getStringOrSymbol(v));var __emval_new_object=()=>Emval.toHandle({});var __emval_run_destructors=handle=>{var destructors=Emval.toValue(handle);runDestructors(destructors);__emval_decref(handle)};var __emval_set_property=(handle,key,value)=>{handle=Emval.toValue(handle);key=Emval.toValue(key);value=Emval.toValue(value);handle[key]=value};var getHeapMax=()=>2147483648;var alignMemory=(size,alignment)=>Math.ceil(size/alignment)*alignment;var growMemory=size=>{var oldHeapSize=wasmMemory.buffer.byteLength;var pages=(size-oldHeapSize+65535)/65536|0;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){}};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignMemory(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}return false};var getCFunc=ident=>{var func=Module["_"+ident];return func};var writeArrayToMemory=(array,buffer)=>{HEAP8.set(array,buffer)};var stackAlloc=sz=>__emscripten_stack_alloc(sz);var stringToUTF8OnStack=str=>{var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8(str,ret,size);return ret};var ccall=(ident,returnType,argTypes,args,opts)=>{var toC={string:str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=stringToUTF8OnStack(str)}return ret},array:arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func(...cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret};var cwrap=(ident,returnType,argTypes,opts)=>{var numericArgs=!argTypes||argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return(...args)=>ccall(ident,returnType,argTypes,args,opts)};init_ClassHandle();init_RegisteredPointer();{if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];if(Module["print"])out=Module["print"];if(Module["printErr"])err=Module["printErr"];if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];if(Module["arguments"])programArgs=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].shift()()}}}Module["ccall"]=ccall;Module["cwrap"]=cwrap;var ___getTypeName,_malloc,_free,__emscripten_stack_restore,__emscripten_stack_alloc,_emscripten_stack_get_current,memory,__indirect_function_table,wasmMemory,wasmTable;function assignWasmExports(wasmExports){___getTypeName=wasmExports["G"];_malloc=Module["_malloc"]=wasmExports["I"];_free=Module["_free"]=wasmExports["J"];__emscripten_stack_restore=wasmExports["K"];__emscripten_stack_alloc=wasmExports["L"];_emscripten_stack_get_current=wasmExports["M"];memory=wasmMemory=wasmExports["E"];__indirect_function_table=wasmTable=wasmExports["H"]}var wasmImports={k:___cxa_throw,w:__abort_js,s:__embind_register_bigint,z:__embind_register_bool,p:__embind_register_class,q:__embind_register_class_class_function,u:__embind_register_class_constructor,d:__embind_register_class_function,A:__embind_register_class_property,x:__embind_register_emval,r:__embind_register_float,m:__embind_register_function,j:__embind_register_integer,h:__embind_register_memory_view,y:__embind_register_std_string,n:__embind_register_std_wstring,B:__embind_register_void,C:__emval_array_to_memory_view,g:__emval_create_invoker,a:__emval_decref,t:__emval_get_global,D:__emval_get_property,o:__emval_incref,f:__emval_invoke,l:__emval_new_array,c:__emval_new_cstring,i:__emval_new_object,e:__emval_run_destructors,b:__emval_set_property,v:_emscripten_resize_heap};async function run(){preRun();var setStatus=Module["setStatus"];if(setStatus){setStatus("Running...");await new Promise(resolve=>setTimeout(resolve,1));setTimeout(setStatus,1,"")}if(ABORT)return;initRuntime();Module["onRuntimeInitialized"]?.();postRun()}var wasmExports;wasmExports=await createWasm();await run();\n;return Module}if(typeof exports==="object"&&typeof module==="object"){module.exports=createGsafModule;module.exports.default=createGsafModule}else if(typeof define==="function"&&define["amd"])define([],()=>createGsafModule);\n';function Mo(){let e=self,t=null,n=null,r=new Float32Array(1),i=new Uint32Array(r.buffer),a=e=>{r[0]=e;let t=i[0],n=t>>>16&32768,a=(t>>>23&255)-112,o=t&8388607;return a<=0?a<-10?n:n|((o|8388608)>>1-a)+4096>>13:a>=31?n|31744:n|(a<<10)+(o+4096>>13)},o=async(r,i)=>{if(t=await e.createGsafModule({instantiateWasm:(e,t)=>(WebAssembly.instantiate(i,e).then(e=>t(e,i)),{})}),n=t.WasmReader.openFromBytes(new Uint8Array(r)),!n)throw Error(`gsaf: ${t.gsafLastError()}`);let a=n.header(),o=0;for(let e=0;e<a.frameCount;e++)o=Math.max(o,n.frameInfo(e).splatCount);return{frameCount:a.frameCount,maxSplats:o,fps:a.metadata?.fps,boundsMin:Array.from(a.assetBounds.min),boundsMax:Array.from(a.assetBounds.max),canonicalRotation:a.metadata?.canonicalRotation&&Array.from(a.metadata.canonicalRotation),canonicalTranslation:a.metadata?.canonicalTranslation&&Array.from(a.metadata.canonicalTranslation)}},s=(e,r)=>{n.decodeFrameInto(e,0);let i=n.frameSlot(0),o=i.splatCount,s=t.HEAPF32,c=s.subarray(i.positionsPtr()>>2,(i.positionsPtr()>>2)+o*3),l=s.subarray(i.rotationsPtr()>>2,(i.rotationsPtr()>>2)+o*4),u=s.subarray(i.scalesPtr()>>2,(i.scalesPtr()>>2)+o*3),d=s.subarray(i.colorsPtr()>>2,(i.colorsPtr()>>2)+o*4),{center:f,color:p,scale:m,rotation:h,centers:g}=r;for(let e=0;e<o;e++){let t=e*3,n=e*4;f[n]=g[t]=c[t],f[n+1]=g[t+1]=c[t+1],f[n+2]=g[t+2]=c[t+2],m[n]=a(u[t]),m[n+1]=a(u[t+1]),m[n+2]=a(u[t+2]);for(let e=0;e<4;e++)h[n+e]=a(l[n+e]),p[n+e]=a(d[n+e])}return r.index=e,r.count=o,r};e.onmessage=async t=>{let{type:n}=t.data;try{if(n===`open`)e.postMessage({type:n,header:await o(t.data.bytes,t.data.wasm)});else if(n===`decode`){let r=s(t.data.index,t.data.frame),{center:i,color:a,scale:o,rotation:c,centers:l}=r;e.postMessage({type:n,frame:r},[i.buffer,a.buffer,o.buffer,c.buffer,l.buffer])}}catch(t){e.postMessage({type:`error`,message:t?.message??String(t)})}}}var No=new Map,Po=e=>{let t=e??new URL(new URL(`gsaf-decoder-BcEBYZsU.wasm`,import.meta.url).href,``+import.meta.url).href,n=No.get(t);return n||(n=(async()=>{let e=await fetch(t);if(!e.ok)throw Error(`gsaf: ${e.status} ${e.statusText} fetching the decoder ${t}`);try{return await WebAssembly.compileStreaming(e.clone())}catch{return WebAssembly.compile(await e.arrayBuffer())}})(),No.set(t,n),n.catch(()=>No.delete(t))),n},Fo=class{worker;pending=null;constructor(){let e=`${jo}\n(${Mo.toString()})();\n`,t=URL.createObjectURL(new Blob([e],{type:`application/javascript`}));this.worker=new Worker(t),URL.revokeObjectURL(t),this.worker.onmessage=e=>{let t=this.pending;this.pending=null,e.data.type===`error`?t?.reject(Error(e.data.message)):t?.resolve(e.data)},this.worker.onerror=e=>{let t=this.pending;this.pending=null,t?.reject(Error(e.message||`gsaf: the decoder worker failed`))}}stopped=!1;request(e,t,n){return this.stopped?Promise.reject(Error(`gsaf: the decoder was stopped`)):new Promise((r,i)=>{this.pending={resolve:r,reject:i},this.worker.postMessage({type:e,...t},n)})}async open(e,t){let{header:n}=await this.request(`open`,{bytes:e,wasm:t},[e]);return n}async decode(e,t){let{center:n,color:r,scale:i,rotation:a,centers:o}=t,{frame:s}=await this.request(`decode`,{index:e,frame:{...t,index:e,count:0}},[n.buffer,r.buffer,i.buffer,a.buffer,o.buffer]);return s}destroy(){if(this.stopped)return;this.stopped=!0,this.worker.terminate();let e=this.pending;this.pending=null,e?.reject(Error(`gsaf: the decoder was stopped`))}},Io=30,Lo=[[`dataCenter`,`center`],[`dataColor`,`color`],[`dataScale`,`scale`],[`dataRotation`,`rotation`]],Ro=async(e,t)=>{if(!e.ok)throw Error(`gsaf: ${e.status} ${e.statusText} fetching ${e.url}`);let n=Number(e.headers.get(`content-length`))||0;if(!e.body||!n)return e.arrayBuffer();let r=[],i=0,a=e.body.getReader();for(;;){let{done:e,value:o}=await a.read();if(e)break;r.push(o),i+=o.length,t(Math.trunc(Math.min(1,i/n)*100))}let o=new Uint8Array(i),s=0;for(let e of r)o.set(e,s),s+=e.length;return o.buffer},zo=class{entity;animated;duration;paused=!0;app;decoder;fps;frameCount;_time=0;shown=0;buffers;waiters=[];failure=null;destroyed=!1;constructor(e,t,n,r,i,a,o){this.app=e,this.entity=t,this.decoder=n,this.frameCount=r,this.fps=i,this.duration=r/i,this.buffers=a,this.animated=o;let s=e=>{this.paused||(this._time=(this._time+e)%this.duration),this.pump()};o&&e.on(`update`,s),t.once(`destroy`,()=>{this.destroyed=!0,e.off(`update`,s),this.settle()})}get time(){return this._time}seek(e){if(this.failure)return Promise.reject(this.failure);if(!this.animated)return Promise.resolve();let t=e%this.duration;this._time=t<0?t+this.duration:t;let n=new Promise((e,t)=>this.waiters.push({resolve:e,reject:t}));return this.pump(),n}settle(e){let{waiters:t}=this;this.waiters=[];for(let n of t)e?n.reject(e):n.resolve()}pump(){if(this.destroyed||this.failure||!this.buffers)return;let e=Math.min(this.frameCount-1,Math.floor(this._time*this.fps+1e-6));if(e===this.shown){this.settle();return}let t=this.buffers;this.buffers=null,this.decoder.decode(e,t).then(e=>{Bo(this.app,this.entity.gsplat.resource,e),this.entity.gsplat.workBufferUpdate=1,this.shown=e.index,this.buffers=e,this.pump()},e=>{this.destroyed||(console.error(e),this.failure=e,this.settle(e))})}},Bo=(e,t,n)=>{for(let[e,r]of Lo){let i=t.getTexture(e);i.lock().set(n[r]),i.unlock()}t.centers.set(n.centers.subarray(0,n.count*3)),t.update(n.count),e.renderNextFrame=!0},Vo=async(e,t,n,r,i)=>{let a=()=>Error(`loadGsaf: the viewer was destroyed while loading`),s=Po(n);s.catch(()=>{});let c=await Ro(await t,r);if(i.aborted)throw a();let l=await s;if(i.aborted)throw a();let u=new Fo,d=null,f=()=>{u.destroy(),d?.destroy(),d=null};i.addEventListener(`abort`,f,{once:!0});try{let t=await u.open(c,l);if(i.aborted)throw a();let n=e.graphicsDevice;d=new Ar(n,t.maxSplats,o.createDefaultFormat(n)),d.aabb.setMinMax(new W(t.boundsMin),new W(t.boundsMax));let r=d.getTexture(`dataCenter`),s=r.width*r.height*4,p=await u.decode(0,{center:new Float32Array(s),color:new Uint16Array(s),scale:new Uint16Array(s),rotation:new Uint16Array(s),centers:new Float32Array(t.maxSplats*3)});if(i.aborted)throw a();i.removeEventListener(`abort`,f),Bo(e,d,p);let m=new He(`gsplat`,e);if(t.canonicalRotation){let[e,n,r,i]=t.canonicalRotation;m.setLocalRotation(new tt(n,r,i,e)),t.canonicalTranslation&&m.setLocalPosition(new W(t.canonicalTranslation))}else m.setLocalEulerAngles(0,0,180);m.addComponent(`gsplat`,{unified:!0,resource:d}),e.root.addChild(m);let h=t.frameCount>1&&n.isWebGPU;h||u.destroy();let g=d;m.once(`destroy`,()=>{u.destroy(),g.destroy()});let _=t.fps>0?t.fps:Io;return new zo(e,m,u,t.frameCount,_,p,h)}catch(e){throw i.removeEventListener(`abort`,f),u.destroy(),d?.destroy(),i.aborted?a():e}},Ho={"settings.performance-mode":`Leistungsmodus`,"settings.gaming-controls":`Gaming-Steuerung`,"settings.show-annotations":`Anmerkungen anzeigen`,"settings.show-collision":`Kollision anzeigen`,"settings.frame":`Einpassen`,"settings.reset":`Zurücksetzen`,"tooltip.play":`Wiedergabe`,"tooltip.pause":`Pause`,"tooltip.orbit-camera":`Umlaufkamera`,"tooltip.fly-camera":`Flugkamera`,"tooltip.walk-mode":`Gehmodus`,"tooltip.reset-camera":`Kamera zurücksetzen`,"tooltip.frame-scene":`Szene einpassen`,"tooltip.settings":`Einstellungen`,"tooltip.help":`Info`,"tooltip.controls":`Steuerung`,"tooltip.enter-ar":`AR starten`,"tooltip.enter-vr":`VR starten`,"tooltip.fullscreen":`Vollbild`,"help.section.orbit":`Umlaufmodus`,"help.section.fly":`Flugmodus`,"help.section.walk":`Gehmodus`,"help.section.anim":`Animation`,"help.section.modes":`Modus wechseln`,"help.action.orbit":`Umkreisen`,"help.action.pan":`Schwenken`,"help.action.zoom":`Zoomen`,"help.action.set-focus":`Fokus setzen`,"help.action.fly-to":`Fliegen zu`,"help.action.fly-to-point":`Zum Punkt fliegen`,"help.action.walk-to":`Gehen zu`,"help.action.look-around":`Umsehen`,"help.action.move":`Bewegen`,"help.action.vertical":`Vertikal`,"help.action.jump":`Springen`,"help.action.run-slow":`Rennen / Gehen`,"help.action.focus-point":`Fokuspunkt`,"help.action.frame-scene":`Szene einpassen`,"help.action.reset-camera":`Kamera zurücksetzen`,"help.action.orbit-mode":`Umlaufmodus`,"help.action.fly-mode":`Flugmodus`,"help.action.toggle-walk":`Gehen umschalten`,"help.action.toggle-gaming":`Gaming-Steuerung umschalten`,"help.action.show-collision":`Kollision anzeigen`,"help.action.play-pause":`Wiedergabe / Pause`,"help.action.toggle-controls":`Steuerung umschalten`,"help.action.toggle-help":`Info umschalten`,"help.action.exit-cancel":`Beenden / Abbrechen`,"help.action.release-mouse":`Maus freigeben`,"help.action.exit-walk":`Gehmodus beenden`,"help.key.double-tap":`Doppeltippen`,"help.key.tap":`Tippen`,"help.key.touch-drag":`Berühren + Ziehen`,"help.key.one-finger-drag":`Mit einem Finger ziehen`,"help.key.two-finger-drag":`Mit zwei Fingern ziehen`,"help.key.pinch":`Zwei-Finger-Zoom`,"help.key.pinch-two-finger":`Zwei-Finger-Zoom / Ziehen`,"help.key.joystick":`Joystick`,"help.key.space":`Leertaste`,"help.key.esc":`Esc`,"xr-modal.title":`WebGL erforderlich`,"xr-modal.message":`AR und VR werden vom WebGPU-Renderer nicht unterstützt. Mit OK wird der Viewer mit WebGL neu geladen.`,"xr-modal.cancel":`Abbrechen`,"xr-modal.ok":`OK`,"vr-prompt.loading":`Wird geladen…`,"vr-prompt.enter":`Tippen, um VR zu starten`,"xr-menu.exit-vr":`VR beenden`,"xr-menu.exit-ar":`AR beenden`,"xr-menu.ice-cream":`Eiscreme-Modus`,"xr-hint.place":`Zusammendrücken, auf Boden oder Tisch zeigen, dann loslassen`,"xr-hint.place-controller":`Trigger halten, auf Boden oder Tisch zeigen, dann loslassen`,"xr-hint.place-screen":`Boden oder Tisch berühren zum Platzieren, mit zwei Fingern skalieren und drehen`,"xr-hint.stalled":`Passiert nichts? Wechsle den Tab und wieder zurück.`},Uo={"settings.performance-mode":`Performance Mode`,"settings.quality":`Quality`,"settings.quality-performance":`Performance`,"settings.quality-default":`Default`,"settings.quality-high":`High`,"settings.quality-max":`Max`,"settings.gaming-controls":`Gaming Controls`,"settings.show-annotations":`Show Annotations`,"settings.show-collision":`Show Collision`,"settings.frame":`Frame`,"settings.reset":`Reset`,"tooltip.play":`Play`,"tooltip.pause":`Pause`,"tooltip.orbit-camera":`Orbit Camera`,"tooltip.fly-camera":`Fly Camera`,"tooltip.walk-mode":`Walk Mode`,"tooltip.reset-camera":`Reset Camera`,"tooltip.frame-scene":`Frame Scene`,"tooltip.settings":`Settings`,"tooltip.help":`Info`,"tooltip.controls":`Controls`,"tooltip.enter-ar":`Enter AR`,"tooltip.enter-vr":`Enter VR`,"tooltip.fullscreen":`Fullscreen`,"help.section.orbit":`Orbit Mode`,"help.section.fly":`Fly Mode`,"help.section.walk":`Walk Mode`,"help.section.anim":`Animation`,"help.section.modes":`Mode Switching`,"help.action.orbit":`Orbit`,"help.action.pan":`Pan`,"help.action.zoom":`Zoom`,"help.action.set-focus":`Set Focus`,"help.action.fly-to":`Fly To`,"help.action.fly-to-point":`Fly to Point`,"help.action.walk-to":`Walk To`,"help.action.look-around":`Look Around`,"help.action.move":`Move`,"help.action.vertical":`Vertical`,"help.action.jump":`Jump`,"help.action.run-slow":`Run / Slow`,"help.action.focus-point":`Focus Point`,"help.action.frame-scene":`Frame Scene`,"help.action.reset-camera":`Reset Camera`,"help.action.orbit-mode":`Orbit Mode`,"help.action.fly-mode":`Fly Mode`,"help.action.toggle-walk":`Toggle Walk`,"help.action.toggle-gaming":`Toggle Gaming Controls`,"help.action.show-collision":`Show Collision`,"help.action.play-pause":`Play / Pause`,"help.action.toggle-controls":`Toggle Controls`,"help.action.toggle-help":`Toggle Info`,"help.action.exit-cancel":`Exit / Cancel`,"help.action.release-mouse":`Release Mouse`,"help.action.exit-walk":`Exit Walk`,"help.key.double-tap":`Double-tap`,"help.key.tap":`Tap`,"help.key.touch-drag":`Touch + Drag`,"help.key.one-finger-drag":`One Finger Drag`,"help.key.two-finger-drag":`Two Finger Drag`,"help.key.pinch":`Pinch`,"help.key.pinch-two-finger":`Pinch / Two Finger Drag`,"help.key.joystick":`Joystick`,"help.key.space":`Space`,"help.key.esc":`Esc`,"xr-modal.title":`WebGL Required`,"xr-modal.message":`AR and VR are not supported on the WebGPU renderer. Pressing OK will reload the viewer with WebGL.`,"xr-modal.cancel":`Cancel`,"xr-modal.ok":`OK`,"vr-prompt.loading":`Loading…`,"vr-prompt.enter":`Tap to enter VR`,"xr-menu.exit-vr":`Exit VR`,"xr-menu.exit-ar":`Exit AR`,"xr-menu.ice-cream":`Ice-cream mode`,"xr-hint.place":`Pinch, point at a floor or table, then let go`,"xr-hint.place-controller":`Hold the trigger, point at a floor or table, then let go`,"xr-hint.place-screen":`Touch a floor or table to place, two fingers to resize and turn`,"xr-hint.stalled":`Nothing happening? Switch tabs and back.`},Wo={"settings.performance-mode":`Modo rendimiento`,"settings.gaming-controls":`Controles de juego`,"settings.show-annotations":`Mostrar anotaciones`,"settings.show-collision":`Mostrar colisión`,"settings.frame":`Encuadrar`,"settings.reset":`Restablecer`,"tooltip.play":`Reproducir`,"tooltip.pause":`Pausar`,"tooltip.orbit-camera":`Cámara orbital`,"tooltip.fly-camera":`Cámara de vuelo`,"tooltip.walk-mode":`Modo caminar`,"tooltip.reset-camera":`Restablecer cámara`,"tooltip.frame-scene":`Encuadrar escena`,"tooltip.settings":`Ajustes`,"tooltip.help":`Información`,"tooltip.controls":`Controles`,"tooltip.enter-ar":`Entrar en AR`,"tooltip.enter-vr":`Entrar en VR`,"tooltip.fullscreen":`Pantalla completa`,"help.section.orbit":`Modo orbital`,"help.section.fly":`Modo vuelo`,"help.section.walk":`Modo caminar`,"help.section.anim":`Animación`,"help.section.modes":`Cambio de modo`,"help.action.orbit":`Orbitar`,"help.action.pan":`Desplazar`,"help.action.zoom":`Zoom`,"help.action.set-focus":`Fijar foco`,"help.action.fly-to":`Volar a`,"help.action.fly-to-point":`Volar al punto`,"help.action.walk-to":`Caminar a`,"help.action.look-around":`Mirar alrededor`,"help.action.move":`Mover`,"help.action.vertical":`Vertical`,"help.action.jump":`Saltar`,"help.action.run-slow":`Correr / Lento`,"help.action.focus-point":`Punto focal`,"help.action.frame-scene":`Encuadrar escena`,"help.action.reset-camera":`Restablecer cámara`,"help.action.orbit-mode":`Modo orbital`,"help.action.fly-mode":`Modo vuelo`,"help.action.toggle-walk":`Alternar caminar`,"help.action.toggle-gaming":`Alternar controles de juego`,"help.action.show-collision":`Mostrar colisión`,"help.action.play-pause":`Reproducir / Pausar`,"help.action.toggle-controls":`Alternar controles`,"help.action.toggle-help":`Alternar información`,"help.action.exit-cancel":`Salir / Cancelar`,"help.action.release-mouse":`Liberar ratón`,"help.action.exit-walk":`Salir de caminar`,"help.key.double-tap":`Doble toque`,"help.key.tap":`Toque`,"help.key.touch-drag":`Toque + arrastrar`,"help.key.one-finger-drag":`Arrastre con un dedo`,"help.key.two-finger-drag":`Arrastre con dos dedos`,"help.key.pinch":`Pellizcar`,"help.key.pinch-two-finger":`Pellizcar / Arrastre con dos dedos`,"help.key.joystick":`Joystick`,"help.key.space":`Espacio`,"help.key.esc":`Esc`,"xr-modal.title":`Se requiere WebGL`,"xr-modal.message":`AR y VR no son compatibles con el renderizador WebGPU. Al pulsar OK se recargará el visor con WebGL.`,"xr-modal.cancel":`Cancelar`,"xr-modal.ok":`OK`,"vr-prompt.loading":`Cargando…`,"vr-prompt.enter":`Toca para entrar en RV`,"xr-menu.exit-vr":`Salir de VR`,"xr-menu.exit-ar":`Salir de AR`,"xr-menu.ice-cream":`Modo helado`,"xr-hint.place":`Pellizca, apunta al suelo o a una mesa y suelta`,"xr-hint.place-controller":`Mantén el gatillo, apunta al suelo o a una mesa y suelta`,"xr-hint.place-screen":`Toca el suelo o una mesa para colocar, dos dedos para escalar y rotar`,"xr-hint.stalled":`¿No pasa nada? Cambia de pestaña y vuelve.`},Go={"settings.performance-mode":`Mode performance`,"settings.gaming-controls":`Commandes de jeu`,"settings.show-annotations":`Afficher les annotations`,"settings.show-collision":`Afficher les collisions`,"settings.frame":`Cadrer`,"settings.reset":`Réinitialiser`,"tooltip.play":`Lecture`,"tooltip.pause":`Pause`,"tooltip.orbit-camera":`Caméra orbitale`,"tooltip.fly-camera":`Caméra volante`,"tooltip.walk-mode":`Mode marche`,"tooltip.reset-camera":`Réinitialiser la caméra`,"tooltip.frame-scene":`Cadrer la scène`,"tooltip.settings":`Paramètres`,"tooltip.help":`Infos`,"tooltip.controls":`Commandes`,"tooltip.enter-ar":`Entrer en AR`,"tooltip.enter-vr":`Entrer en VR`,"tooltip.fullscreen":`Plein écran`,"help.section.orbit":`Mode orbital`,"help.section.fly":`Mode vol`,"help.section.walk":`Mode marche`,"help.section.anim":`Animation`,"help.section.modes":`Changement de mode`,"help.action.orbit":`Orbiter`,"help.action.pan":`Panoramique`,"help.action.zoom":`Zoom`,"help.action.set-focus":`Définir le focus`,"help.action.fly-to":`Voler vers`,"help.action.fly-to-point":`Voler vers le point`,"help.action.walk-to":`Marcher vers`,"help.action.look-around":`Regarder autour`,"help.action.move":`Se déplacer`,"help.action.vertical":`Vertical`,"help.action.jump":`Sauter`,"help.action.run-slow":`Courir / Lent`,"help.action.focus-point":`Point focal`,"help.action.frame-scene":`Cadrer la scène`,"help.action.reset-camera":`Réinitialiser la caméra`,"help.action.orbit-mode":`Mode orbital`,"help.action.fly-mode":`Mode vol`,"help.action.toggle-walk":`Basculer la marche`,"help.action.toggle-gaming":`Basculer les commandes de jeu`,"help.action.show-collision":`Afficher les collisions`,"help.action.play-pause":`Lecture / Pause`,"help.action.toggle-controls":`Basculer les commandes`,"help.action.toggle-help":`Basculer les infos`,"help.action.exit-cancel":`Quitter / Annuler`,"help.action.release-mouse":`Libérer la souris`,"help.action.exit-walk":`Quitter la marche`,"help.key.double-tap":`Double tape`,"help.key.tap":`Tape`,"help.key.touch-drag":`Toucher + glisser`,"help.key.one-finger-drag":`Glisser à un doigt`,"help.key.two-finger-drag":`Glisser à deux doigts`,"help.key.pinch":`Pincer`,"help.key.pinch-two-finger":`Pincer / Glisser à deux doigts`,"help.key.joystick":`Joystick`,"help.key.space":`Espace`,"help.key.esc":`Échap`,"xr-modal.title":`WebGL requis`,"xr-modal.message":`L'AR et la VR ne sont pas prises en charge par le moteur de rendu WebGPU. Cliquer sur OK rechargera le visualiseur avec WebGL.`,"xr-modal.cancel":`Annuler`,"xr-modal.ok":`OK`,"vr-prompt.loading":`Chargement…`,"vr-prompt.enter":`Touchez pour entrer en RV`,"xr-menu.exit-vr":`Quitter la VR`,"xr-menu.exit-ar":`Quitter l'AR`,"xr-menu.ice-cream":`Mode glace`,"xr-hint.place":`Pincez, pointez le sol ou une table, puis relâchez`,"xr-hint.place-controller":`Maintenez la gâchette, pointez le sol ou une table, puis relâchez`,"xr-hint.place-screen":`Touchez le sol ou une table pour placer, deux doigts pour redimensionner et pivoter`,"xr-hint.stalled":`Rien ne se passe ? Changez d'onglet puis revenez.`},Ko={"settings.performance-mode":`パフォーマンスモード`,"settings.gaming-controls":`ゲームコントロール`,"settings.show-annotations":`注釈を表示`,"settings.show-collision":`コリジョンを表示`,"settings.frame":`フィット`,"settings.reset":`リセット`,"tooltip.play":`再生`,"tooltip.pause":`一時停止`,"tooltip.orbit-camera":`オービットカメラ`,"tooltip.fly-camera":`フライカメラ`,"tooltip.walk-mode":`ウォークモード`,"tooltip.reset-camera":`カメラをリセット`,"tooltip.frame-scene":`シーンにフィット`,"tooltip.settings":`設定`,"tooltip.help":`情報`,"tooltip.controls":`操作`,"tooltip.enter-ar":`ARを開始`,"tooltip.enter-vr":`VRを開始`,"tooltip.fullscreen":`全画面表示`,"help.section.orbit":`オービットモード`,"help.section.fly":`フライモード`,"help.section.walk":`ウォークモード`,"help.section.anim":`アニメーション`,"help.section.modes":`モード切り替え`,"help.action.orbit":`オービット`,"help.action.pan":`パン`,"help.action.zoom":`ズーム`,"help.action.set-focus":`フォーカスを設定`,"help.action.fly-to":`飛ぶ`,"help.action.fly-to-point":`ポイントへ飛ぶ`,"help.action.walk-to":`歩く`,"help.action.look-around":`周りを見る`,"help.action.move":`移動`,"help.action.vertical":`垂直`,"help.action.jump":`ジャンプ`,"help.action.run-slow":`走る / 歩く`,"help.action.focus-point":`フォーカスポイント`,"help.action.frame-scene":`シーンにフィット`,"help.action.reset-camera":`カメラをリセット`,"help.action.orbit-mode":`オービットモード`,"help.action.fly-mode":`フライモード`,"help.action.toggle-walk":`ウォークを切り替え`,"help.action.toggle-gaming":`ゲームコントロールを切り替え`,"help.action.show-collision":`コリジョンを表示`,"help.action.play-pause":`再生 / 一時停止`,"help.action.toggle-controls":`操作の切り替え`,"help.action.toggle-help":`情報を切り替え`,"help.action.exit-cancel":`終了 / キャンセル`,"help.action.release-mouse":`マウスを解放`,"help.action.exit-walk":`ウォークを終了`,"help.key.double-tap":`ダブルタップ`,"help.key.tap":`タップ`,"help.key.touch-drag":`タッチ + ドラッグ`,"help.key.one-finger-drag":`1本指でドラッグ`,"help.key.two-finger-drag":`2本指でドラッグ`,"help.key.pinch":`ピンチ`,"help.key.pinch-two-finger":`ピンチ / 2本指でドラッグ`,"help.key.joystick":`ジョイスティック`,"help.key.space":`スペース`,"help.key.esc":`Esc`,"xr-modal.title":`WebGLが必要です`,"xr-modal.message":`ARとVRはWebGPUレンダラーでは利用できません。OKを押すとWebGLでビューアーを再読み込みします。`,"xr-modal.cancel":`キャンセル`,"xr-modal.ok":`OK`,"vr-prompt.loading":`読み込み中…`,"vr-prompt.enter":`タップしてVRを開始`,"xr-menu.exit-vr":`VRを終了`,"xr-menu.exit-ar":`ARを終了`,"xr-menu.ice-cream":`アイスクリームモード`,"xr-hint.place":`ピンチして床かテーブルを指し、離す`,"xr-hint.place-controller":`トリガーを押したまま床かテーブルを指し、離す`,"xr-hint.place-screen":`床かテーブルをタッチして配置、2本指で拡大縮小と回転`,"xr-hint.stalled":`反応がない場合は、タブを切り替えてから戻ってください。`},qo={"settings.performance-mode":`성능 모드`,"settings.gaming-controls":`게임 컨트롤`,"settings.show-annotations":`주석 표시`,"settings.show-collision":`충돌 표시`,"settings.frame":`맞춤`,"settings.reset":`재설정`,"tooltip.play":`재생`,"tooltip.pause":`일시 정지`,"tooltip.orbit-camera":`오빗 카메라`,"tooltip.fly-camera":`플라이 카메라`,"tooltip.walk-mode":`워크 모드`,"tooltip.reset-camera":`카메라 재설정`,"tooltip.frame-scene":`씬에 맞춤`,"tooltip.settings":`설정`,"tooltip.help":`정보`,"tooltip.controls":`조작`,"tooltip.enter-ar":`AR 시작`,"tooltip.enter-vr":`VR 시작`,"tooltip.fullscreen":`전체 화면`,"help.section.orbit":`오빗 모드`,"help.section.fly":`플라이 모드`,"help.section.walk":`워크 모드`,"help.section.anim":`애니메이션`,"help.section.modes":`모드 전환`,"help.action.orbit":`오빗`,"help.action.pan":`팬`,"help.action.zoom":`줌`,"help.action.set-focus":`포커스 설정`,"help.action.fly-to":`비행`,"help.action.fly-to-point":`지점으로 비행`,"help.action.walk-to":`걷기`,"help.action.look-around":`둘러보기`,"help.action.move":`이동`,"help.action.vertical":`수직`,"help.action.jump":`점프`,"help.action.run-slow":`달리기 / 천천히`,"help.action.focus-point":`포커스 포인트`,"help.action.frame-scene":`씬에 맞춤`,"help.action.reset-camera":`카메라 재설정`,"help.action.orbit-mode":`오빗 모드`,"help.action.fly-mode":`플라이 모드`,"help.action.toggle-walk":`워크 전환`,"help.action.toggle-gaming":`게임 컨트롤 전환`,"help.action.show-collision":`충돌 표시`,"help.action.play-pause":`재생 / 일시 정지`,"help.action.toggle-controls":`조작 전환`,"help.action.toggle-help":`정보 전환`,"help.action.exit-cancel":`나가기 / 취소`,"help.action.release-mouse":`마우스 해제`,"help.action.exit-walk":`워크 종료`,"help.key.double-tap":`더블 탭`,"help.key.tap":`탭`,"help.key.touch-drag":`터치 + 드래그`,"help.key.one-finger-drag":`한 손가락 드래그`,"help.key.two-finger-drag":`두 손가락 드래그`,"help.key.pinch":`핀치`,"help.key.pinch-two-finger":`핀치 / 두 손가락 드래그`,"help.key.joystick":`조이스틱`,"help.key.space":`스페이스`,"help.key.esc":`Esc`,"xr-modal.title":`WebGL 필요`,"xr-modal.message":`AR과 VR은 WebGPU 렌더러에서 지원되지 않습니다. 확인을 누르면 WebGL로 뷰어를 다시 불러옵니다.`,"xr-modal.cancel":`취소`,"xr-modal.ok":`확인`,"vr-prompt.loading":`로드 중…`,"vr-prompt.enter":`탭하여 VR 시작`,"xr-menu.exit-vr":`VR 종료`,"xr-menu.exit-ar":`AR 종료`,"xr-menu.ice-cream":`아이스크림 모드`,"xr-hint.place":`집은 채로 바닥이나 테이블을 가리키고 놓기`,"xr-hint.place-controller":`트리거를 누른 채 바닥이나 테이블을 가리키고 놓기`,"xr-hint.place-screen":`바닥이나 테이블을 터치해 배치, 두 손가락으로 크기 조절과 회전`,"xr-hint.stalled":`반응이 없나요? 다른 탭으로 전환했다가 돌아오세요.`},Jo={"settings.performance-mode":`Modo de desempenho`,"settings.gaming-controls":`Controles de jogo`,"settings.show-annotations":`Mostrar anotações`,"settings.show-collision":`Mostrar colisão`,"settings.frame":`Enquadrar`,"settings.reset":`Redefinir`,"tooltip.play":`Reproduzir`,"tooltip.pause":`Pausar`,"tooltip.orbit-camera":`Câmera orbital`,"tooltip.fly-camera":`Câmera de voo`,"tooltip.walk-mode":`Modo caminhar`,"tooltip.reset-camera":`Redefinir câmera`,"tooltip.frame-scene":`Enquadrar cena`,"tooltip.settings":`Configurações`,"tooltip.help":`Informações`,"tooltip.controls":`Controles`,"tooltip.enter-ar":`Entrar em AR`,"tooltip.enter-vr":`Entrar em VR`,"tooltip.fullscreen":`Tela cheia`,"help.section.orbit":`Modo orbital`,"help.section.fly":`Modo voo`,"help.section.walk":`Modo caminhar`,"help.section.anim":`Animação`,"help.section.modes":`Troca de modo`,"help.action.orbit":`Orbitar`,"help.action.pan":`Deslocar`,"help.action.zoom":`Zoom`,"help.action.set-focus":`Definir foco`,"help.action.fly-to":`Voar para`,"help.action.fly-to-point":`Voar até o ponto`,"help.action.walk-to":`Caminhar para`,"help.action.look-around":`Olhar em volta`,"help.action.move":`Mover`,"help.action.vertical":`Vertical`,"help.action.jump":`Pular`,"help.action.run-slow":`Correr / Devagar`,"help.action.focus-point":`Ponto focal`,"help.action.frame-scene":`Enquadrar cena`,"help.action.reset-camera":`Redefinir câmera`,"help.action.orbit-mode":`Modo orbital`,"help.action.fly-mode":`Modo voo`,"help.action.toggle-walk":`Alternar caminhar`,"help.action.toggle-gaming":`Alternar controles de jogo`,"help.action.show-collision":`Mostrar colisão`,"help.action.play-pause":`Reproduzir / Pausar`,"help.action.toggle-controls":`Alternar controles`,"help.action.toggle-help":`Alternar informações`,"help.action.exit-cancel":`Sair / Cancelar`,"help.action.release-mouse":`Liberar mouse`,"help.action.exit-walk":`Sair da caminhada`,"help.key.double-tap":`Toque duplo`,"help.key.tap":`Toque`,"help.key.touch-drag":`Toque + arrastar`,"help.key.one-finger-drag":`Arrastar com um dedo`,"help.key.two-finger-drag":`Arrastar com dois dedos`,"help.key.pinch":`Pinçar`,"help.key.pinch-two-finger":`Pinçar / Arrastar com dois dedos`,"help.key.joystick":`Joystick`,"help.key.space":`Espaço`,"help.key.esc":`Esc`,"xr-modal.title":`WebGL necessário`,"xr-modal.message":`AR e VR não são compatíveis com o renderizador WebGPU. Ao pressionar OK, o visualizador será recarregado com WebGL.`,"xr-modal.cancel":`Cancelar`,"xr-modal.ok":`OK`,"vr-prompt.loading":`Carregando…`,"vr-prompt.enter":`Toque para entrar em RV`,"xr-menu.exit-vr":`Sair da VR`,"xr-menu.exit-ar":`Sair da AR`,"xr-menu.ice-cream":`Modo sorvete`,"xr-hint.place":`Faça pinça, aponte para o chão ou uma mesa e solte`,"xr-hint.place-controller":`Segure o gatilho, aponte para o chão ou uma mesa e solte`,"xr-hint.place-screen":`Toque no chão ou numa mesa para posicionar, dois dedos para redimensionar e girar`,"xr-hint.stalled":`Nada acontecendo? Troque de aba e volte.`},Yo={"settings.performance-mode":`Режим производительности`,"settings.gaming-controls":`Игровое управление`,"settings.show-annotations":`Показать аннотации`,"settings.show-collision":`Показать коллизию`,"settings.frame":`Кадрировать`,"settings.reset":`Сбросить`,"tooltip.play":`Воспроизвести`,"tooltip.pause":`Пауза`,"tooltip.orbit-camera":`Орбитальная камера`,"tooltip.fly-camera":`Полётная камера`,"tooltip.walk-mode":`Режим ходьбы`,"tooltip.reset-camera":`Сбросить камеру`,"tooltip.frame-scene":`Кадрировать сцену`,"tooltip.settings":`Настройки`,"tooltip.help":`Информация`,"tooltip.controls":`Управление`,"tooltip.enter-ar":`Войти в AR`,"tooltip.enter-vr":`Войти в VR`,"tooltip.fullscreen":`Полный экран`,"help.section.orbit":`Орбитальный режим`,"help.section.fly":`Режим полёта`,"help.section.walk":`Режим ходьбы`,"help.section.anim":`Анимация`,"help.section.modes":`Смена режимов`,"help.action.orbit":`Вращение`,"help.action.pan":`Панорама`,"help.action.zoom":`Масштаб`,"help.action.set-focus":`Задать фокус`,"help.action.fly-to":`Лететь к`,"help.action.fly-to-point":`Лететь к точке`,"help.action.walk-to":`Идти к`,"help.action.look-around":`Осмотреться`,"help.action.move":`Движение`,"help.action.vertical":`Вертикально`,"help.action.jump":`Прыжок`,"help.action.run-slow":`Бег / Медленно`,"help.action.focus-point":`Точка фокуса`,"help.action.frame-scene":`Кадрировать сцену`,"help.action.reset-camera":`Сбросить камеру`,"help.action.orbit-mode":`Орбитальный режим`,"help.action.fly-mode":`Режим полёта`,"help.action.toggle-walk":`Переключить ходьбу`,"help.action.toggle-gaming":`Переключить игровое управление`,"help.action.show-collision":`Показать коллизию`,"help.action.play-pause":`Воспроизведение / Пауза`,"help.action.toggle-controls":`Переключить управление`,"help.action.toggle-help":`Переключить информацию`,"help.action.exit-cancel":`Выход / Отмена`,"help.action.release-mouse":`Освободить мышь`,"help.action.exit-walk":`Выйти из ходьбы`,"help.key.double-tap":`Двойной тап`,"help.key.tap":`Тап`,"help.key.touch-drag":`Касание + перетаскивание`,"help.key.one-finger-drag":`Перетаскивание одним пальцем`,"help.key.two-finger-drag":`Перетаскивание двумя пальцами`,"help.key.pinch":`Щипок`,"help.key.pinch-two-finger":`Щипок / Перетаскивание двумя пальцами`,"help.key.joystick":`Джойстик`,"help.key.space":`Пробел`,"help.key.esc":`Esc`,"xr-modal.title":`Требуется WebGL`,"xr-modal.message":`AR и VR не поддерживаются рендером WebGPU. Нажмите OK, чтобы перезагрузить просмотрщик с WebGL.`,"xr-modal.cancel":`Отмена`,"xr-modal.ok":`OK`,"vr-prompt.loading":`Загрузка…`,"vr-prompt.enter":`Нажмите, чтобы войти в VR`,"xr-menu.exit-vr":`Выйти из VR`,"xr-menu.exit-ar":`Выйти из AR`,"xr-menu.ice-cream":`Режим мороженого`,"xr-hint.place":`Сведите пальцы, укажите на пол или стол и отпустите`,"xr-hint.place-controller":`Удерживайте курок, укажите на пол или стол и отпустите`,"xr-hint.place-screen":`Коснитесь пола или стола, чтобы разместить; двумя пальцами — масштаб и поворот`,"xr-hint.stalled":`Ничего не происходит? Переключитесь на другую вкладку и вернитесь.`},Xo={"settings.performance-mode":`性能模式`,"settings.gaming-controls":`游戏控制`,"settings.show-annotations":`显示注释`,"settings.show-collision":`显示碰撞`,"settings.frame":`适应`,"settings.reset":`重置`,"tooltip.play":`播放`,"tooltip.pause":`暂停`,"tooltip.orbit-camera":`环绕相机`,"tooltip.fly-camera":`飞行相机`,"tooltip.walk-mode":`行走模式`,"tooltip.reset-camera":`重置相机`,"tooltip.frame-scene":`适应场景`,"tooltip.settings":`设置`,"tooltip.help":`信息`,"tooltip.controls":`操作`,"tooltip.enter-ar":`进入 AR`,"tooltip.enter-vr":`进入 VR`,"tooltip.fullscreen":`全屏`,"help.section.orbit":`环绕模式`,"help.section.fly":`飞行模式`,"help.section.walk":`行走模式`,"help.section.anim":`动画`,"help.section.modes":`模式切换`,"help.action.orbit":`环绕`,"help.action.pan":`平移`,"help.action.zoom":`缩放`,"help.action.set-focus":`设置焦点`,"help.action.fly-to":`飞至`,"help.action.fly-to-point":`飞至该点`,"help.action.walk-to":`走到`,"help.action.look-around":`环顾`,"help.action.move":`移动`,"help.action.vertical":`垂直`,"help.action.jump":`跳跃`,"help.action.run-slow":`奔跑 / 慢走`,"help.action.focus-point":`焦点`,"help.action.frame-scene":`适应场景`,"help.action.reset-camera":`重置相机`,"help.action.orbit-mode":`环绕模式`,"help.action.fly-mode":`飞行模式`,"help.action.toggle-walk":`切换行走`,"help.action.toggle-gaming":`切换游戏控制`,"help.action.show-collision":`显示碰撞`,"help.action.play-pause":`播放 / 暂停`,"help.action.toggle-controls":`切换操作`,"help.action.toggle-help":`切换信息`,"help.action.exit-cancel":`退出 / 取消`,"help.action.release-mouse":`释放鼠标`,"help.action.exit-walk":`退出行走`,"help.key.double-tap":`双击`,"help.key.tap":`点击`,"help.key.touch-drag":`触摸 + 拖动`,"help.key.one-finger-drag":`单指拖动`,"help.key.two-finger-drag":`双指拖动`,"help.key.pinch":`捏合`,"help.key.pinch-two-finger":`捏合 / 双指拖动`,"help.key.joystick":`摇杆`,"help.key.space":`空格`,"help.key.esc":`Esc`,"xr-modal.title":`需要 WebGL`,"xr-modal.message":`WebGPU 渲染器不支持 AR 和 VR。按下确定将以 WebGL 重新加载查看器。`,"xr-modal.cancel":`取消`,"xr-modal.ok":`确定`,"vr-prompt.loading":`加载中…`,"vr-prompt.enter":`点击进入 VR`,"xr-menu.exit-vr":`退出 VR`,"xr-menu.exit-ar":`退出 AR`,"xr-menu.ice-cream":`冰淇淋模式`,"xr-hint.place":`捏合并指向地面或桌面，然后松开`,"xr-hint.place-controller":`按住扳机并指向地面或桌面，然后松开`,"xr-hint.place-screen":`触摸地面或桌面放置，双指缩放和旋转`,"xr-hint.stalled":`没有反应？切换到其他标签页再切回来。`},Zo=Uo,Qo={de:Ho,en:Zo,es:Wo,fr:Go,ja:Ko,ko:qo,"pt-BR":Jo,ru:Yo,"zh-CN":Xo},$o=e=>{let t=[e,...navigator.languages??[navigator.language]],n=Object.keys(Qo);for(let e of t){if(!e)continue;let t=e.toLowerCase(),r=t.split(`-`)[0],i=n.find(e=>e.toLowerCase()===t)??n.find(e=>e.toLowerCase()===r)??n.find(e=>e.toLowerCase().split(`-`)[0]===r);if(i)return i}return`en`},es=(e,t)=>{let n=$o(e),r=Qo[n],i=e=>r[e]??Zo[e]??e;return t.lang=n,t.querySelectorAll(`[data-i18n]`).forEach(e=>{e.textContent=i(e.dataset.i18n)}),i},ts=[`performance`,`default`,`high`,`max`],ns=e=>{let t={quality:e?`performance`:`default`,performanceMode:!1,gamingControls:!1,showAnnotations:!0,iceCream:!0};try{let e=localStorage.getItem(`retinaDisplay`),n=localStorage.getItem(`performanceMode`);if(e!==null&&n===null){n=String(e===`false`);try{localStorage.setItem(`performanceMode`,n),localStorage.removeItem(`retinaDisplay`)}catch{}}let r=localStorage.getItem(`quality`);return{quality:ts.includes(r)?r:t.quality,performanceMode:n===`true`,gamingControls:localStorage.getItem(`gamingControls`)===`true`,showAnnotations:localStorage.getItem(`showAnnotations`)!==`false`,iceCream:localStorage.getItem(`iceCream`)!==`false`}}catch{return t}},rs=e=>{let t=[`quality`,`performanceMode`,`gamingControls`,`showAnnotations`,`iceCream`].map(t=>e.on(`${t}:changed`,e=>{try{localStorage.setItem(t,String(e))}catch{}}));return()=>t.forEach(e=>e.off())},is=`
vec4 encodePickOutput(uint id) {
    const vec4 inv = vec4(1.0 / 255.0);
    const uvec4 shifts = uvec4(16, 8, 0, 24);
    uvec4 col = (uvec4(id) >> shifts) & uvec4(0xff);
    return vec4(col) * inv;
}

#ifdef GSPLAT_PICK_DEPTH
    #ifndef CAMERAPLANES
        #define CAMERAPLANES
        uniform vec4 camera_params; // x: 1/far, y: far, z: near, w: isOrtho
    #endif

    uint pickHash(uint v) {
        v ^= v >> 16u;
        v *= 0x7feb352du;
        v ^= v >> 15u;
        v *= 0x846ca68bu;
        v ^= v >> 16u;
        return v;
    }

    // Four independent trials, one per channel: each keeps the fragment with probability alpha,
    // the splat's opacity at this fragment with its falloff included, writing its depth there,
    // and the far plane where it does not. The splat's seed (see pickSeedVS) and depth, both
    // the same across its quad, hashed with the pixel decorrelate the splats covering one pixel.
    vec4 getSplatPickOutput(float alpha) {
        float normalizedDepth;
        if (camera_params.w > 0.5) {
            normalizedDepth = gl_FragCoord.z;
        } else {
            float linearDepth = 1.0 / gl_FragCoord.w;
            normalizedDepth = (linearDepth - camera_params.z) / (camera_params.y - camera_params.z);
        }

        uvec2 p = uvec2(gl_FragCoord.xy);
        uint h = pickHash(p.x ^ pickHash(p.y ^ pickHash(vPickSeed ^ floatBitsToUint(normalizedDepth))));
        uvec4 trials = uvec4(pickHash(h), pickHash(h ^ 0x9e3779b9u), pickHash(h ^ 0x7f4a7c15u), pickHash(h ^ 0x2545f491u));
        bvec4 keep = lessThan(vec4(trials >> 8u) * (1.0 / 16777216.0), vec4(alpha));
        if (!any(keep)) {
            discard;
        }
        return mix(vec4(1.0), vec4(normalizedDepth), vec4(keep));
    }
#else
    #ifndef PICK_CUSTOM_ID
        uniform uint meshInstanceId;

        vec4 getPickOutput() {
            return encodePickOutput(meshInstanceId);
        }
    #endif
#endif

#ifdef DEPTH_PICK_PASS
    #include "floatAsUintPS"
    #ifndef CAMERAPLANES
        #define CAMERAPLANES
        uniform vec4 camera_params; // x: 1/far, y: far, z: near, w: isOrtho
    #endif

    vec4 getPickDepth() {
        float linearDepth;
        if (camera_params.w > 0.5) {
            linearDepth = gl_FragCoord.z;
        } else {
            float viewDist = 1.0 / gl_FragCoord.w;
            linearDepth = (viewDist - camera_params.z) / (camera_params.y - camera_params.z);
        }
        return float2uint(linearDepth);
    }
#endif
`,as=`
fn encodePickOutput(id: u32) -> vec4f {
    let inv: vec4f = vec4f(1.0 / 255.0);
    let shifts: vec4u = vec4u(16u, 8u, 0u, 24u);
    let col: vec4u = (vec4u(id) >> shifts) & vec4u(0xffu);
    return vec4f(col) * inv;
}

#ifdef GSPLAT_PICK_DEPTH
    #ifndef CAMERAPLANES
        #define CAMERAPLANES
        uniform camera_params: vec4f; // x: 1/far, y: far, z: near, w: isOrtho
    #endif

    fn pickHash(value: u32) -> u32 {
        var v = value;
        v ^= v >> 16u;
        v *= 0x7feb352du;
        v ^= v >> 15u;
        v *= 0x846ca68bu;
        v ^= v >> 16u;
        return v;
    }

    // Four independent trials, one per channel: each keeps the fragment with probability alpha,
    // the splat's opacity at this fragment with its falloff included, writing its depth there,
    // and the far plane where it does not. The splat's seed (see pickSeedVS) and depth, both
    // the same across its quad, hashed with the pixel decorrelate the splats covering one pixel.
    fn getSplatPickOutput(alpha: f32) -> vec4f {
        var normalizedDepth: f32;
        if (uniform.camera_params.w > 0.5) {
            normalizedDepth = pcPosition.z;
        } else {
            let linearDepth = 1.0 / pcPosition.w;
            normalizedDepth = (linearDepth - uniform.camera_params.z) / (uniform.camera_params.y - uniform.camera_params.z);
        }

        let p = vec2u(pcPosition.xy);
        let h = pickHash(p.x ^ pickHash(p.y ^ pickHash(vPickSeed ^ bitcast<u32>(normalizedDepth))));
        let trials = vec4u(pickHash(h), pickHash(h ^ 0x9e3779b9u), pickHash(h ^ 0x7f4a7c15u), pickHash(h ^ 0x2545f491u));
        let keep = vec4f(trials >> vec4u(8u)) * (1.0 / 16777216.0) < vec4f(alpha);
        if (!any(keep)) {
            discard;
        }
        return select(vec4f(1.0), vec4f(normalizedDepth), keep);
    }
#else
    #ifndef PICK_CUSTOM_ID
        uniform meshInstanceId: u32;

        fn getPickOutput() -> vec4f {
            return encodePickOutput(uniform.meshInstanceId);
        }
    #endif
#endif

#ifdef DEPTH_PICK_PASS
    #include "floatAsUintPS"
    #ifndef CAMERAPLANES
        #define CAMERAPLANES
        uniform camera_params: vec4f; // x: 1/far, y: far, z: near, w: isOrtho
    #endif

    fn getPickDepth() -> vec4f {
        var linearDepth: f32;
        if (uniform.camera_params.w > 0.5) {
            linearDepth = pcPosition.z;
        } else {
            let viewDist = 1.0 / pcPosition.w;
            linearDepth = (viewDist - uniform.camera_params.z) / (uniform.camera_params.y - uniform.camera_params.z);
        }
        return float2uint(linearDepth);
    }
#endif
`,os=(e,t,n)=>{let r=e.replace(t,n);if(r===e)throw Error(`picker: engine gsplat/pick chunk patch failed (engine version mismatch?)`);return r},ss=e=>`#ifdef PICK_PASS
    ${e}
    #define GSPLAT_PICK_DEPTH
    #include "pickPS"
#endif`,cs=`flat varying uint vPickSeed;`,ls=`varying @interpolate(flat) vPickSeed: u32;`,us=e=>`vPickSeed = (floatBitsToUint(${e}.x) * 0x9e3779b9u) ^ (floatBitsToUint(${e}.y) * 0x85ebca6bu) ^ (floatBitsToUint(${e}.w) * 0xc2b2ae35u);`,ds=e=>`output.vPickSeed = (bitcast<u32>(${e}.x) * 0x9e3779b9u) ^ (bitcast<u32>(${e}.y) * 0x85ebca6bu) ^ (bitcast<u32>(${e}.w) * 0xc2b2ae35u);`,fs=e=>`\n#ifdef PICK_PASS\n    ${e}\n#endif\n`,ps=e=>os(os(e,/(varying mediump vec2 gaussianUV;)/,`$1${fs(cs)}`),/(gaussianUV = corner\.uv;)/,`$1${fs(us(`center.proj`))}`),ms=e=>os(os(e,/(varying gaussianUV: half2;)/,`$1${fs(ls)}`),/(output\.gaussianUV = corner\.uv;)/,`$1${fs(ds(`center.proj`))}`),hs=e=>os(os(e,/(varying gaussianUV: half2;)/,`$1${fs(ls)}`),/(output\.gaussianUV = half2\(cornerClipped\);)/,`$1${fs(ds(`proj`))}`),gs=e=>os(os(e,/#ifdef PICK_PASS\s*#include "pickPS"\s*#endif/,ss(cs)),/pcFragColor0 = (encodePickOutput\(vPickId\)|getPickOutput\(\));/g,`pcFragColor0 = getSplatPickOutput(alpha);`),_s=e=>os(os(e,/#ifdef PICK_PASS\s*#include "pickPS"\s*#endif/,ss(ls)),/output\.color = (encodePickOutput\(vPickId\)|getPickOutput\(\));/g,`output.color = getSplatPickOutput(f32(alpha));`),vs=new WeakMap,ys=new Ge,bs=new J,xs=new G(1,1,1,1),Ss=4,Cs=2,ws=.3,Ts=1e-12,Es=1e-20,Ds=.2,Os=6,ks=48,As=[.3,.55,.8,1],js=2.5,Ms=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],Ns=new Float32Array(1),Ps=new Uint32Array(Ns.buffer),Fs=e=>{let t=(e&32768)<<16,n=(e&31744)>>10,r=e&1023;if(n===0){if(r===0)Ps[0]=t;else{let e=-1,n=r;do e++,n<<=1;while(!(n&1024));Ps[0]=t|112-e<<23|(n&1023)<<13}}else Ps[0]=n===31?t|2139095040|r<<13:t|n+127-15<<23|r<<13;return Ns[0]},Is=e=>{let t=e.graphicsDevice,n=vs.get(t);if(n){n.refCount++;return}let r=Y.get(t,`glsl`),i=Y.get(t,`wgsl`),a=r.get(`pickPS`),o=r.get(`gsplatPS`),s=i.get(`pickPS`),c=i.get(`gsplatPS`),l=r.get(`gsplatVS`),u=i.get(`gsplatVS`),d=i.get(`gsplatHybridVS`),f=gs(o),p=_s(c),m=ps(l),h=ms(u),g=hs(d),_={glslPickPS:a,glslGsplatPS:o,wgslPickPS:s,wgslGsplatPS:c,glslGsplatVS:l,wgslGsplatVS:u,wgslGsplatHybridVS:d,refCount:1};vs.set(t,_),r.set(`pickPS`,is),i.set(`pickPS`,as),r.set(`gsplatPS`,f),i.set(`gsplatPS`,p),r.set(`gsplatVS`,m),i.set(`gsplatVS`,h),i.set(`gsplatHybridVS`,g)},Ls=e=>{let t=e.graphicsDevice,n=vs.get(t);if(!n||(n.refCount--,n.refCount>0))return;let r=Y.get(t,`glsl`),i=Y.get(t,`wgsl`);r.set(`pickPS`,n.glslPickPS),r.set(`gsplatPS`,n.glslGsplatPS),i.set(`pickPS`,n.wgslPickPS),i.set(`gsplatPS`,n.wgslGsplatPS),r.set(`gsplatVS`,n.glslGsplatVS),i.set(`gsplatVS`,n.wgslGsplatVS),i.set(`gsplatHybridVS`,n.wgslGsplatHybridVS),vs.delete(t)},Rs=(e,t)=>{let n=e.camera.camera,r=n._xrViews;if(r===null)return t();n._xrViews=null,n._projMatDirty=!0;try{return t()}finally{n._xrViews=r,n._projMatDirty=!0}},zs=()=>({position:new W,viewMatrix:new J,projectionMatrix:new J,nearClip:0,farClip:0,projection:0}),Bs=(e,t)=>{let n=e.camera;t.position.copy(e.getPosition()),t.viewMatrix.copy(n.viewMatrix),t.projectionMatrix.copy(n.projectionMatrix),t.nearClip=n.nearClip,t.farClip=n.farClip,t.projection=n.projection},Vs=(e,t,n,r,i,a,o)=>{if(!Number.isFinite(a)||a<0||a>1)return null;let{farClip:s,nearClip:c}=e,l=e.projection===1?a:s*a/(a*(s-c)+c);return bs.mul2(e.projectionMatrix,e.viewMatrix).invert(),ys.set(t/r*2-1,(1-n/i)*2-1,l*2-1,1),bs.transformVec4(ys,ys),!Number.isFinite(ys.w)||Math.abs(ys.w)<1e-8||(ys.mulScalar(1/ys.w),!Number.isFinite(ys.x)||!Number.isFinite(ys.y)||!Number.isFinite(ys.z))?null:(o??new W).set(ys.x,ys.y,ys.z)},Hs=(e,t,n)=>{n.sub2(e,t);let r=n.length();return r>1e-6?n.mulScalar(1/r):n.set(0,1,0),n},Us=(e,t,n,r)=>{let i=e.projectionMatrix.data[5];if(e.projection===1)return r*i*n/2;let a=t.x-e.position.x,o=t.y-e.position.y,s=t.z-e.position.z,c=Math.sqrt(a*a+o*o+s*s);return c<1e-6?1/0:r*i*n/(2*c)},Ws=e=>{let t=e.length;if(t<3)return null;let n=0,r=0,i=0;for(let a=0;a<t;a++)n+=e[a].x,r+=e[a].y,i+=e[a].z;n/=t,r/=t,i/=t;let a=0,o=0,s=0,c=0,l=0,u=0;for(let d=0;d<t;d++){let t=e[d].x-n,f=e[d].y-r,p=e[d].z-i;a+=t*t,o+=t*f,s+=t*p,c+=f*f,l+=f*p,u+=p*p}let d=(a+c+u)/3,f=a-d,p=c-d,m=u-d,h=f*f+p*p+m*m+2*(o*o+s*s+l*l);if(h<Es)return null;let g=Math.sqrt(h/6),_=1/g,v=f*_,y=o*_,b=s*_,x=p*_,S=l*_,C=m*_,w=v*(x*C-S*S)-y*(y*C-S*b)+b*(y*S-x*b),T=Math.max(-1,Math.min(1,w/2)),E=Math.acos(T)/3,D=d+2*g*Math.cos(E+2*Math.PI/3),O=a-D,k=c-D,A=u-D,j=o*l-s*k,M=s*o-O*l,N=O*k-o*o,P=o*A-s*l,F=s*s-O*A,I=O*l-o*s,L=k*A-l*l,R=l*s-o*A,ee=o*l-k*s,te=j*j+M*M+N*N,z=P*P+F*F+I*I,ne=L*L+R*R+ee*ee,re,ie,ae,oe;if(te>=z&&te>=ne?(re=j,ie=M,ae=N,oe=te):z>=ne?(re=P,ie=F,ae=I,oe=z):(re=L,ie=R,ae=ee,oe=ne),oe<Ts)return null;let se=1/Math.sqrt(oe);return{cx:n,cy:r,cz:i,vx:re*se,vy:ie*se,vz:ae*se}},Gs=(e,t,n)=>{let r=Ws(e);if(!r)return!1;let i=0;for(let t=0;t<e.length;t++){let n=e[t].x-r.cx,a=e[t].y-r.cy,o=e[t].z-r.cz;i+=Math.abs(n*r.vx+a*r.vy+o*r.vz)}let a=i/e.length*js,o=[];for(let t=0;t<e.length;t++){let n=e[t].x-r.cx,i=e[t].y-r.cy,s=e[t].z-r.cz;Math.abs(n*r.vx+i*r.vy+s*r.vz)<=a&&o.push(e[t])}let s=r;if(o.length>=3&&o.length<e.length){let e=Ws(o);e&&(s=e)}let{vx:c,vy:l,vz:u}=s;return c*t.x+l*t.y+u*t.z<0&&(c=-c,l=-l,u=-u),n.set(c,l,u),!0},Ks=(e,t,n)=>{let r=[];for(let i=-2;i<=Cs;i++)for(let a=-2;a<=Cs;a++)if(!(a*a+i*i>4))for(let o=0;o<Ss;o++){let s=e(t+a,n+i,o);s!==null&&r.push(s)}if(r.length===0)return null;r.sort((e,t)=>e-t);let i=r[Math.max(0,Math.ceil(r.length*ws)-1)];return Number.isFinite(i)&&i<1?i:null},qs=(e,t,n,r,i,a)=>{let o=(i,a)=>{let o=Ks(e,i,a);return o===null?null:Vs(t,i,a,n,r,o)},s=o(i,a);if(!s)return null;let c=(e,t)=>e<0||e>=n||t<0||t>=r?null:o(e,t),l=Math.max(Os,Math.min(ks,Us(t,s,r,Ds))),u=As.map(e=>Math.max(1,Math.round(e*l))).map(e=>Ms.map(([t,n])=>c(i+t*e,a+n*e))),d=Hs(t.position,s,new W),f=[s];for(let e=0;e<u.length;e++){let t=u[e];for(let e=0;e<t.length;e++){let n=t[e];n&&f.push(n)}}let p=new W,m=Gs(f,d,p);return m||p.copy(d),{position:s,normal:p,fitted:m}},Js=(e,t,n,r,i,a)=>{let o=(a-t.nearClip)/(t.farClip-t.nearClip),s=0,c=0;for(let t=-i;t<=i;t++)for(let a=-i;a<=i;a++)if(!(a*a+t*t>i*i))for(let i=0;i<Ss;i++){let l=e(n+a,r+t,i);l!==null&&(s++,l<o&&c++)}return s>0?c/s:null},Ys=e=>{let t=e.canvas,n=Math.min(Math.floor(e.width),Math.round(t.clientWidth)),r=Math.min(Math.floor(e.height),Math.round(t.clientHeight));return n>0&&r>0?{width:n,height:r}:null},Xs=(e,t)=>Math.min(t-1,Math.max(0,Math.floor(e*t))),Zs=class{released=!1;queue=Promise.resolve();run(e,t){let n=()=>this.released?Promise.resolve(t):e().catch(e=>{if(this.released)return t;throw e}),r=this.queue.then(n,n);return this.queue=r.then(()=>void 0,()=>void 0),r}},Qs=class{pick;pickSurface;pickVisibility;renderView;release;constructor(e,t,n){let{graphicsDevice:r}=e,i,a,o,s=!1,c=new Zs,l=!1,u=0,d=0,f=0,p=zs(),m=(t,n)=>{i=new H(r,{format:12,width:t,height:n,mipmaps:!1,minFilter:0,magFilter:0,addressU:1,addressV:1,name:`picker-stochastic`}),a=new Ze({colorBuffer:i,depth:!1}),o=new ct(r,e.renderer),o.blendState=new Ae(!0,3,1,1,3,1,1)},h=(e,n)=>{Bs(t,p),d=e,f=n},g=(e,n)=>{let r=t.camera;return l&&d===e&&f===n&&p.viewMatrix.equals(r.viewMatrix)&&p.projectionMatrix.equals(r.projectionMatrix)&&p.nearClip===r.nearClip&&p.farClip===r.farClip&&p.projection===r.projection},_=()=>{let e=zs();return e.position.copy(p.position),e.viewMatrix.copy(p.viewMatrix),e.projectionMatrix.copy(p.projectionMatrix),e.nearClip=p.nearClip,e.farClip=p.farClip,e.projection=p.projection,e},v=async(e,t,n,o,s)=>{let c=Math.max(0,e-n),l=Math.max(0,t-n),u=Math.min(o-1,e+n)-c+1,d=Math.min(s-1,t+n)-l+1,f=r.isWebGL2?a.height-l-d:l,p=await i.read(c,f,u,d,{renderTarget:a,immediate:!0});return(e,t,n)=>{let i=e-c,a=t-l;if(i<0||i>=u||a<0||a>=d)return null;let o=r.isWebGL2?d-a-1:a;return Fs(p[(o*u+i)*4+n])}},y=(n,r,i)=>{g(n,r)||(s||=(Is(e),!0),o?(d!==n||f!==r)&&(l=!1,a.resize(n,r)):m(n,r),o.init(a),o.setClearColor(xs),o.update(t.camera,e.scene,[i],new Map,!1),o.render(),h(n,r),l=!0,u++)},b=(i,a)=>{if(c.released)return null;let o=n??Ys(r);if(!o)return null;let{width:s,height:l}=o,u=e.scene.layers.getLayerByName(`World`);if(!u)return null;let d=Xs(i,s),f=Xs(a,l);return Rs(t,()=>y(s,l,u)),{width:s,height:l,screenX:d,screenY:f,pickCamera:_()}},x=async(e,t)=>{let n=b(e,t);if(!n)return null;let{width:r,height:i,screenX:a,screenY:o,pickCamera:s}=n,c=Ks(await v(a,o,Cs,r,i),a,o);return c===null?null:Vs(s,a,o,r,i,c)},S=async(e,t)=>{let n=b(e,t);if(!n)return null;let{width:r,height:i,screenX:a,screenY:o,pickCamera:s}=n;return qs(await v(a,o,50,r,i),s,r,i,a,o)},C=async(e,t)=>e.length===0?[]:Promise.all(e.map(async({x:e,y:n,depth:r})=>{let i=b(e,n);if(!i)return null;let{width:a,height:o,screenX:s,screenY:c,pickCamera:l}=i,u=Math.max(1,Math.round(t*o));return Js(await v(s,c,u,a,o),l,s,c,u,r)}));this.pick=(e,t)=>c.run(()=>x(e,t),null),this.pickSurface=(e,t)=>c.run(()=>S(e,t),null),this.pickVisibility=(e,t)=>c.run(()=>C(e,t),e.map(()=>null)),this.renderView=()=>b(0,0)?{texture:i,renders:u}:null;let w=e.systems.gsplat,T=!1,E=(e,n,r)=>{e===t.camera&&(r&&T||(l=!1),T=r)};w.on(`frame:ready`,E),this.release=()=>{c.released=!0,w.off(`frame:ready`,E),s&&=(Ls(e),!1),o?.destroy(),a?.destroy(),i?.destroy(),l=!1}}},$s=new W,ec=new W,tc=class{app;camera;layer;handles=[];callbacks=new Set;set=null;takenOver=new Map;active=!0;constructor(e,t,n){this.app=e,this.camera=t,this.layer=n;let r=e.systems.gsplat;this.handles.push(r.on(`material:created`,(e,t,n)=>{if(t===this.camera&&n===this.layer&&this.active){let e=this.manager();e&&this.takeOver(e)}})),this.handles.push(r.on(`frame:ready`,(e,t)=>{if(e!==this.camera||t!==this.layer||!this.active)return;let n=this.manager();if(!n)return;this.takeOver(n);let r=n.world.currentState;if(!r)return;let i=!this.set||this.set.version!==r.version||r.splats.some((e,t)=>!this.set.files[t]?.modelMatrix.equals(e.node.getWorldTransform()));i&&(this.set=nc(r));for(let e of this.callbacks)e(this.set,i,n)}))}manager(){return(this.app.renderer.gsplatDirector?.camerasMap.get(this.camera.camera))?.layersMap.get(this.layer)?.gsplatManager??null}setActive(e){if(this.active!==e){if(this.active=e,e){let e=this.manager();e&&this.takeOver(e)}else this.restore(),this.manager()?.world.invalidate({workBuffer:!0})}}onFrame(e){return this.callbacks.add(e),()=>this.callbacks.delete(e)}takeOver(e){let t=e.renderer;this.takenOver.has(t)||(this.takenOver.set(t,t.prepareRenderView),t.prepareRenderView=()=>!1),t.meshInstance&&(t.meshInstance.visible=!1);for(let e of[`gpuSorter`,`projector`,`intervalCompaction`]){let n=t[e];n&&(n.destroy(),t[e]=null)}}restore(){for(let[e,t]of this.takenOver)e.prepareRenderView=t,e.meshInstance&&(e.meshInstance.visible=!0);this.takenOver.clear()}destroy(){this.restore();for(let e of this.handles)e.off();this.handles.length=0,this.callbacks.clear(),this.set=null}},nc=e=>{let t=[],n=[],r=[],i=(e,t,i,a,o)=>{n.push(e),r.push(t,i,a,o)};return e.splats.forEach((e,r)=>{let a=e.node.getWorldTransform().clone(),o=a.getScale(ec),s=Math.max(Math.abs(o.x),Math.abs(o.y),Math.abs(o.z)),c={fileIndex:r,lodIndex:e.lodIndex,nodes:[],modelMatrix:a,resource:e.resource},l=e.intervals.length/2;if(l===0){let t={fileIndex:r,nodeIndex:n.length,lodIndex:e.lodIndex,sourceBase:0,count:e.activeSplats,slotBase:e.intervalOffsets[0]??0,allocId:e.allocId};a.transformPoint(e.aabb.center,$s);let o=e.aabb.halfExtents;i(t,$s.x,$s.y,$s.z,o.length()*s),c.nodes.push(t)}else for(let t=0;t<l;t++){let o=e.intervals[t*2],l=e.intervals[t*2+1],u=e.intervalNodeIndices[t],d={fileIndex:r,nodeIndex:n.length,lodIndex:e.lodIndex,sourceBase:o,count:l-o,slotBase:e.intervalOffsets[t]??0,allocId:e.intervalAllocIds[t]},f=e.octreeNodes?.[u]?.boundingSphere;f?($s.set(f.x,f.y,f.z),a.transformPoint($s,$s),i(d,$s.x,$s.y,$s.z,f.w*s)):i(d,0,0,0,1/0),c.nodes.push(d)}t.push(c)}),{version:e.version,activeSplats:e.totalActiveSplats,slotCapacity:e.textureSize*e.textureSize,fullRebuild:e.fullRebuild,changedAllocIds:e.needsUploadIds,files:t,nodes:n,nodeSpheres:new Float32Array(r)}},rc=e=>{let t=e;if(!t)return null;if(!t.octree)return t.numSplats??null;let n=0;for(let e of t.octree.fileResources.values())n+=e.numSplats;return n},ic=async(e,t,n)=>{let r=(e.renderer.gsplatDirector?.camerasMap.get(t.camera)?.layersMap.get(n)?.gsplatManager)?.renderer.intervalCompaction?.numSplatsBuffer;if(!r)return null;let i=new Uint32Array(1);return await r.read(0,4,i,!0),i[0]},ac=1024,oc=(e,t,n)=>{let r=t=>t/Math.sqrt(Math.max(e*e-(e*e-1)*t*t,1e-6)),i=new Float32Array(t),a=new Float32Array(n);for(let e=0;e<t;e++)i[e]=r(2*(e+.5)/t-1);for(let e=0;e<n;e++)a[e]=r(1-2*(e+.5)/n);return{width:t,height:n,columns:i,rows:a}},sc=(e,t,n)=>{let r=0,i=e.length-1;for(;i-r>1;){let a=r+i>>1;n*e[a]<=t?r=a:i=a}let a=n*e[r],o=n*e[i];return r+.5+(o>a?(t-a)/(o-a):0)},cc=e=>{let{width:t,height:n,columns:r,rows:i}=e,a=new Float32Array(2050+t+n);a[0]=t,a[1]=n;for(let e=0;e<ac;e++){let o=-1+2*e/1023;a[2+e]=2*sc(r,o,1)/t-1,a[1026+e]=1-2*sc(i,-o,-1)/n}return a.set(r,2050),a.set(i,2050+t),a},lc=`
fn warpStep(p: f32) -> vec2f {
    let t = (p * 0.5 + 0.5) * 1023.0;
    let i = clamp(floor(t), 0.0, 1022.0);
    return vec2f(i, t - i);
}

// one axis of the forward map at a logical ndc; linear beyond the edges
fn warpAxis(p: f32, base: u32) -> f32 {
    let s = warpStep(p);
    let i = base + u32(s.x);
    let a = warpTable[i];
    return a + (warpTable[i + 1u] - a) * s.y;
}

// the target's ndc of a logical ndc
fn warpNdc(p: vec2f) -> vec2f {
    return vec2f(warpAxis(p.x, 2u), warpAxis(p.y, 1026u));
}

// the forward map's slope at a logical ndc: the target's pixels per screen pixel
fn warpSlope(p: vec2f) -> vec2f {
    let sx = 2u + u32(warpStep(p.x).x);
    let sy = 1026u + u32(warpStep(p.y).x);
    let scale = ${1023/2};
    return vec2f(warpTable[sx + 1u] - warpTable[sx], warpTable[sy + 1u] - warpTable[sy]) * scale;
}

// the logical ndc at the centre of a target texel, its row counted from the top
fn unwarpTexel(texel: vec2i) -> vec2f {
    let base = 2050u;
    return vec2f(warpTable[base + u32(texel.x)], warpTable[base + u32(warpTable[0]) + u32(texel.y)]);
}
`,uc=6,dc=256,Z=dc,fc=dc,pc=4,mc=(e=!1)=>(e?1/Math.cos(Math.PI/pc):Math.sqrt(2*Math.PI/(pc*Math.sin(2*Math.PI/pc)))).toFixed(6),hc=5,gc=Math.floor(Z/hc),_c=32768,vc=15,yc=(()=>{let e=[],t=(n,r,i)=>{if(!n.length)e.push(r);else for(let e=0;e<n.length;e++)t([...n.slice(0,e),...n.slice(e+1)],r|n[e]<<i,i+2)};return t([0,1,2,3],0,0),e})(),bc=lc.replace(/warpTable\[/g,`warpTable[uniforms.warpBaseEye1 + `).replace(/\b(warpStep|warpAxis|warpNdc|warpSlope|unwarpTexel)\(/g,`$1Eye1(`),xc=(e,t)=>`
fn farthestL1${e}(block: vec2i, gather: i32, blocks: vec2i) -> u32 {
    var farthest = 0u;
    for (var dy = -gather; dy <= gather; dy++) {
        for (var dx = -gather; dx <= gather; dx++) {
            farthest = max(farthest, occ${e}[u32((block.y + dy) * blocks.x + block.x + dx)]);
        }
    }
    return farthest;
}

fn farthestL2${e}(block: vec2i, gather: i32, blocks: vec2i) -> u32 {
    var farthest = 0u;
    for (var dy = -gather; dy <= gather; dy++) {
        for (var dx = -gather; dx <= gather; dx++) {
            farthest = max(farthest, occ${e}[uniforms.occL2Base + u32((block.y + dy) * blocks.x + block.x + dx)]);
        }
    }
    return farthest;
}

// whether a splat at a centre and view depth, whose largest polygon reaches halfExtent pixels at
// a focal length, lay wholly behind the eye's previous frame
fn occludedIn${e}(center: vec3f, depth: f32, focalX: f32, halfExtent: f32, c22: f32) -> bool {
    let prevClip = uniforms.prevViewProj${e} * vec4f(center, 1.0);
    let prevDepth = -(uniforms.prevView${e} * vec4f(center, 1.0)).z;
    let prevOrtho = uniforms.prevClipZ.z != 0.0;
    if (prevClip.w <= 0.0 || (!prevOrtho && prevDepth <= 0.0)) {
        return false;
    }
    let prevNdc = ${t?`warpNdc${e}(prevClip.xy / prevClip.w)`:`prevClip.xy / prevClip.w`};
    let prevHalfExtent = halfExtent * (uniforms.prevFocal${e}.x / focalX)
        * select(depth / max(prevDepth, 0.001), 1.0, prevOrtho);
    let footprint = max(halfExtent, prevHalfExtent);
    var level = 1u;
    var blockSize = 8.0;
    var blocks = vec2i(i32(uniforms.occBlocksX1), i32(uniforms.occBlocksY1));
    if (footprint > 16.0) {
        level = 2u;
        blockSize = 32.0;
        blocks = vec2i(i32(uniforms.occBlocksX2), i32(uniforms.occBlocksY2));
    }
    if (footprint > 64.0 || level > uniforms.occlusionMode) {
        return false;
    }
    let gather = max(i32(ceil(footprint / blockSize)), 1);
    let prevPixel = vec2f(prevNdc.x * 0.5 + 0.5, 0.5 - prevNdc.y * uniforms.prevFlip * 0.5) * uniforms.prevViewport;
    let block = vec2i(floor(prevPixel / blockSize));
    if (block.x < gather || block.y < gather || block.x >= blocks.x - gather || block.y >= blocks.y - gather) {
        return false;
    }
    let front = prevDepth - 2.8284 * sqrt(c22);
    let w = select(front, 1.0, prevOrtho);
    if (w <= 0.0) {
        return false;
    }
    let frontZ = clamp(uniforms.prevClipZ.x * front + uniforms.prevClipZ.y, 0.0, w) / w;
    // the block under the centre first: the neighbourhood's maximum is at least its maximum, so
    // a splat that block alone cannot cull is visible, and most splats leave here after one load
    let centreIndex = u32(block.y * blocks.x + block.x);
    var farthest = select(occ${e}[centreIndex], occ${e}[uniforms.occL2Base + centreIndex], level == 2u);
    if (frontZ <= bitcast<f32>(farthest)) {
        return false;
    }
    if (level == 1u) {
        farthest = farthestL1${e}(block, gather, blocks);
    } else {
        farthest = farthestL2${e}(block, gather, blocks);
    }
    return frontZ > bitcast<f32>(farthest);
}
`,Sc=e=>`
struct FootprintEye1 {
    visible: bool,
    depth: f32,
    ndc: vec2f,
    axis1: vec2f,
    len2: f32,
    lambda1: f32,
    determinant: f32
}

fn footprintEye1(center: vec3f, rot: vec4f, scale: vec3f, viewport: vec2f) -> FootprintEye1 {
    var f: FootprintEye1;
    f.visible = false;
    f.ndc = vec2f(1e4);
    f.axis1 = vec2f(1.0, 0.0);
    f.len2 = 1.0;
    let viewCenter = uniforms.viewEye1 * vec4f(center, 1.0);
    let ortho = uniforms.isOrtho != 0u;
    f.depth = -viewCenter.z;
    let clip = uniforms.viewProjEye1 * vec4f(center, 1.0);
    if ((!ortho && f.depth <= 0.0) || clip.w <= 0.0) {
        return f;
    }
    let focal = uniforms.focalEye1;
    let linear = mat3x3f(uniforms.viewEye1[0].xyz, uniforms.viewEye1[1].xyz, uniforms.viewEye1[2].xyz);
    let gaussian = linear * rotationMatrix(vec4f(rot.yzw, rot.x)) * mat3x3f(
        vec3f(scale.x, 0.0, 0.0),
        vec3f(0.0, scale.y, 0.0),
        vec3f(0.0, 0.0, scale.z)
    );
    let row0 = vec3f(gaussian[0].x, gaussian[1].x, gaussian[2].x);
    let row1 = vec3f(gaussian[0].y, gaussian[1].y, gaussian[2].y);
    let row2 = vec3f(gaussian[0].z, gaussian[1].z, gaussian[2].z);
    let c00 = dot(row0, row0);
    let c01 = dot(row0, row1);
    let c02 = dot(row0, row2);
    let c11 = dot(row1, row1);
    let c12 = dot(row1, row2);
    let c22 = dot(row2, row2);
    var cov00: f32;
    var cov01: f32;
    var cov11: f32;
    if (ortho) {
        cov00 = focal.x * focal.x * c00;
        cov01 = focal.x * focal.y * c01;
        cov11 = focal.y * focal.y * c11;
    } else {
        let invDepth = 1.0 / max(f.depth, 0.001);
        let jx0 = focal.x * invDepth;
        let jx2 = focal.x * viewCenter.x * invDepth * invDepth;
        let jy1 = focal.y * invDepth;
        let jy2 = focal.y * viewCenter.y * invDepth * invDepth;
        let u00 = jx0 * c00 + jx2 * c02;
        let u01 = jx0 * c01 + jx2 * c12;
        let u02 = jx0 * c02 + jx2 * c22;
        let u11 = jy1 * c11 + jy2 * c12;
        let u12 = jy1 * c12 + jy2 * c22;
        cov00 = u00 * jx0 + u02 * jx2;
        cov01 = u01 * jy1 + u02 * jy2;
        cov11 = u11 * jy1 + u12 * jy2;
    }
${e?`
    let linearNdc = clip.xy / clip.w;
    let reach = 2.8284 * sqrt(vec2f(cov00, cov11)) * 2.0 / viewport;
    let lo = clamp(linearNdc - reach, vec2f(-1.0), vec2f(1.0));
    let hi = clamp(linearNdc + reach, vec2f(-1.0), vec2f(1.0));
    let span = hi - lo;
    let warpedLo = warpNdcEye1(lo);
    let pixelScale = select(
        warpSlopeEye1(lo),
        (warpNdcEye1(hi) - warpedLo) / max(span, vec2f(1e-9)),
        span > vec2f(1e-6)
    );
    f.ndc = warpedLo + pixelScale * (linearNdc - lo);
    cov00 *= pixelScale.x * pixelScale.x;
    cov01 *= pixelScale.x * pixelScale.y;
    cov11 *= pixelScale.y * pixelScale.y;
`:`
    f.ndc = clip.xy / clip.w;
`}
    let us2 = uniforms.unitScale * uniforms.unitScale;
    cov00 += 0.3 / us2;
    cov11 += 0.3 / us2;
    f.determinant = cov00 * cov11 - cov01 * cov01;
    if (f.determinant <= 0.0) {
        f.ndc = vec2f(1e4);
        return f;
    }
    let mid = 0.5 * (cov00 + cov11);
    let radius = length(vec2f(0.5 * (cov00 - cov11), cov01));
    f.lambda1 = mid + radius;
    let lambda2 = max(mid - radius, 0.1 / us2);
    let eigenVec = vec2f(cov01, f.lambda1 - cov00);
    let eigenLen = length(eigenVec);
    let direction = select(vec2f(1.0, 0.0), eigenVec / eigenLen, eigenLen > 1e-9);
    let len1 = 2.0 * sqrt(2.0 * f.lambda1);
    let clampScale = min(1.0, min(1024.0, min(viewport.x, viewport.y)) / len1);
    f.axis1 = len1 * clampScale * direction;
    f.len2 = 2.0 * sqrt(2.0 * lambda2) * clampScale;
    f.visible = true;
    return f;
}
`,Cc=(e,t,n,r,i)=>`
struct ProjectorUniforms {
    view: mat4x4f,
    viewProj: mat4x4f,
    // the previous frame, for the occlusion cull: its view and view-projection, its clip-z
    // mapping (a, b, isOrtho, 0), viewport and focal length
    prevViewProj: mat4x4f,
    prevView: mat4x4f,
    prevClipZ: vec4f,
    viewport: vec2f,
    focal: vec2f,
    prevViewport: vec2f,
    prevFocal: vec2f,
    numChunks: u32,
    splatTextureSize: u32,
    isOrtho: u32,
    minPixelSize: f32,
    alphaClip: f32,
    minContribution: f32,
    // the occlusion grid: level 1 (8 px) and level 2 (32 px) block counts
    occBlocksX1: u32,
    occBlocksY1: u32,
    occBlocksX2: u32,
    occBlocksY2: u32,
    // 0 off, 1 level 1 only, 2 both levels
    occlusionMode: u32,
    // -1 when the previous depth texture's rows run bottom-up (an offscreen target), else 1
    prevFlip: f32,
    // the order key: bucket = (log(depth) - keyLogNear) * keyInvLogRange, over [0, 1)
    keyLogNear: f32,
    keyInvLogRange: f32,
    // first chunk-table entry of this dispatch (per-file sources dispatch one run each)
    chunkBase: u32,
    // the file's model transform, for sources that read splats in the file's own space
    model: mat4x4f,
    modelRotation: vec4f,
    modelScale: vec4f,
    cameraPosition: vec4f,
    // 1: covariance in true pixels. 2: the engine's convention (its focal is viewport * proj[0][0],
    // twice the pixel focal), which makes its 0.3 dilation 0.075 px^2 and scales its culls
    unitScale: f32,
    // the coverage seed (variant coverage:splat; see the raster's frameSeed)
    frameSeed: u32,
    // variant jitter: sub-strata a stratum splits into (0: no jitter), and the strata a per-splat
    // threshold draws from (coverage:splat, and the full target's splats of the interleaved mode)
    jitterSubs: u32,
    strata: u32,
    // coverage:interleaved: splats whose footprint at the alpha clip is below this many pixels
    // draw per splat into the full target instead of into the pixel sets (0: none)
    interleaveArea: f32,
    // stereo: the second eye this projection also serves, which shapes and places the splats by
    // its own view, focal length and warp and culls against its own previous frame
    viewEye1: mat4x4f,
    viewProjEye1: mat4x4f,
    prevViewProjEye1: mat4x4f,
    prevViewEye1: mat4x4f,
    focalEye1: vec2f,
    prevFocalEye1: vec2f,
    // where level 2 starts in a view's grid; where the second eye's words start in the cache
    // and its warp table in warpTable
    occL2Base: u32,
    stereoBase: u32,
    warpBaseEye1: u32
}

// chunk table entry: slotBase, count, node, lod | file << 16
@group(0) @binding(0) var<storage, read> chunks: array<vec4u>;
// one bit per node: 1 = inside the frustum this frame
@group(0) @binding(1) var<storage, read> nodeVisible: array<u32>;
@group(0) @binding(2) var<storage, read_write> cache: array<u32>;
// [0] survivors this frame, [1] splats the occlusion cull removed
@group(0) @binding(3) var<storage, read_write> counter: array<atomic<u32>>;
@group(0) @binding(4) var<uniform> uniforms: ProjectorUniforms;
// the previous frame's farthest depth per block, as f32 bits, level 1 then level 2 (see
// shaders/reduce.ts)
@group(0) @binding(5) var<storage, read> occ: array<u32>;
// survivors per depth bucket (see shaders/order.ts)
@group(0) @binding(6) var<storage, read_write> buckets: array<atomic<u32>>;

struct Splat {
    index: u32,
    uv: vec2i
}
var<private> splat: Splat;
fn setSplat(idx: u32) {
    splat.index = idx;
    splat.uv = vec2i(i32(idx % uniforms.splatTextureSize), i32(idx / uniforms.splatTextureSize));
}

${r?`
// variant warp: the view's table (shaders/warp.ts), and in stereo the second eye's after it
@group(0) @binding(7) var<storage, read> warpTable: array<f32>;
${lc}`:``}
${i?`
// stereo: the second eye's occlusion grid, and its warp's lookups
@group(0) @binding(8) var<storage, read> occEye1: array<u32>;
${r?bc:``}
`:``}
${e}
${n===`pixel`?``:`
// integer hash (Wellons' prospector mix), as the raster's
fn hashU32(x: u32) -> u32 {
    var v = x;
    v ^= v >> 16u;
    v *= 0x7feb352du;
    v ^= v >> 15u;
    v *= 0x846ca68bu;
    v ^= v >> 16u;
    return v;
}

// the radius, in units of the quad's half extent, where alpha = opacity * falloff(r^2) falls to
// a threshold, with falloff(x) = (exp(-4 x) - exp(-4)) / (1 - exp(-4))
fn radiusAt(threshold: f32, opacity: f32) -> f32 {
    let e4 = exp(-4.0);
    return sqrt(max(-log(threshold / opacity * (1.0 - e4) + e4) * 0.25, 0.0));
}

// the 24 orders of four strata, 2 bits a set
const PERMUTATIONS = array<u32, 24>(${yc.map(e=>`${e}u`).join(`, `)});
`}
// quaternion (x, y, z, w) to a rotation matrix (columns)
fn rotationMatrix(qIn: vec4f) -> mat3x3f {
    let q = normalize(qIn);
    let x = q.x;
    let y = q.y;
    let z = q.z;
    let w = q.w;
    return mat3x3f(
        vec3f(1.0 - 2.0 * (y * y + z * z), 2.0 * (x * y + w * z), 2.0 * (x * z - w * y)),
        vec3f(2.0 * (x * y - w * z), 1.0 - 2.0 * (x * x + z * z), 2.0 * (y * z + w * x)),
        vec3f(2.0 * (x * z + w * y), 2.0 * (y * z - w * x), 1.0 - 2.0 * (x * x + y * y))
    );
}

struct Projected {
    valid: bool,
    occluded: bool,
    words: array<u32, ${uc}>
}
${t?xc(``,r):``}${t&&i?xc(`Eye1`,r):``}${i?Sc(r):``}
fn project(slot: u32, file: u32${i?`, local: u32`:``}) -> Projected {
    var result: Projected;
    result.valid = false;
    result.occluded = false;

    setSplat(slot);
    let center = srcCenter();
    let opacity = srcOpacity();
    if (opacity < uniforms.alphaClip) {
        return result;
    }
${n===`pixel`?``:`
    // Variant coverage:splat: one coverage threshold per splat and frame instead of one per
    // pixel. The pixels where alpha exceeds it form a solid ellipse, which the raster draws as a
    // polygon of the same area with no discard, so a gpu updates depth early and rejects what
    // lies behind it before rasterising it. Each pixel is still kept with probability alpha,
    // independently per splat; the noise is a splat at a random size rather than a dither. The
    // threshold is hashed afresh every frame: one sequence shared by every splat, rotated per
    // splat, would keep two splats' thresholds a fixed distance apart, so their coverage would
    // stay correlated over frames and the accumulation would converge to the wrong image. A
    // splat whose opacity does not exceed its threshold keeps nothing this frame and stops here.
    // The draw goes into cache word 5 as ${vc} bits, and the raster rebuilds the same
    // thresholds from them (shaders/raster.ts).
    let id = slot ^ (file * 2654435761u);
    let hashed = hashU32(((id + 1u) * 26699u) ^ uniforms.frameSeed);
    let drawnBits = hashed >> 17u;
    let drawn = f32(drawnBits) * (1.0 / 32767.0);
    // Variant jitter: the threshold is the base of a random stratum instead of the draw itself,
    // and every pixel adds its own jitter within the stratum in the raster, so the kept region
    // is the stratum's ellipse with a dithered rim rather than a solid one. Each pixel's
    // threshold is still uniform over [0, 1) and independent per splat, so the expectation is
    // unchanged, but neighbouring pixels no longer all agree. Sub-strata (jitterSubs above 1)
    // narrow the jitter: smaller polygons, more agreement.
    let subs = uniforms.jitterSubs;
    let jittered = subs > 0u;
    let subMask = max(subs, 1u) - 1u;
    // the per-splat threshold (coverage:splat, and the small splats of the interleaved mode): a
    // stratum of \`strata\`, its sub-stratum, and the nibble the raster reads them back from
    // (kept | stratum << 1 | sub << 3)
    let strata = max(uniforms.strata, 1u);
    let splatStratum = min(u32(drawn * f32(strata)), strata - 1u);
    let splatSub = (hashed >> 15u) & subMask;
    let splatBase = select(drawn, f32(splatStratum * max(subs, 1u) + splatSub) / f32(strata * max(subs, 1u)), jittered);
    let splatNibble = 1u | (splatStratum << 1u) | (splatSub << 3u);
    let splatThreshold = max(splatBase, uniforms.alphaClip);
    let splatKept = splatThreshold < opacity;
${n===`interleaved`?`
    // Variant coverage:interleaved: the pixels split into four interleaved sets, the four of a
    // 2x2 quad, and each set takes its own threshold, the four quarters of [0, 1) from the one
    // draw: a quad holds the splat at four stratified sizes, so its mean is nearly the splat's
    // alpha, as the per-pixel thresholds' is, and neighbouring pixels are no longer all one
    // splat. Jittered, the sets take the four strata in a random order, each within a random
    // sub-stratum, and their pixels jitter inside it
    var setBases = fract(vec4f(drawn) + vec4f(0.0, 0.25, 0.5, 0.75));
    var setNibbles = vec4u(0u);
    if (jittered) {
        let bits = hashU32(hashed ^ 0x9e3779b9u);
        let packed = PERMUTATIONS[bits % 24u];
        let perm = (vec4u(packed) >> vec4u(0u, 2u, 4u, 6u)) & vec4u(3u);
        let subsOf = (vec4u(bits) >> vec4u(8u, 10u, 12u, 14u)) & vec4u(subMask);
        setBases = vec4f(perm * subs + subsOf) / f32(4u * subs);
        setNibbles = (perm << vec4u(1u)) | (subsOf << vec4u(3u));
    }
    let setThresholds = max(setBases, vec4f(uniforms.alphaClip));
    let keptSets = setThresholds < vec4f(opacity);
    setNibbles = select(vec4u(0u), setNibbles | vec4u(1u), keptSets);
    // whether the splat draws into the sets or the full target waits for its footprint; a splat
    // keeping nothing either way stops here
    if (!any(keptSets) && !splatKept) {
        return result;
    }
    let lowest = select(vec4f(2.0), setThresholds, keptSets);
    let setThreshold = min(min(lowest.x, lowest.y), min(lowest.z, lowest.w));
`:`
    if (!splatKept) {
        return result;
    }
`}
`}
    let viewCenter = uniforms.view * vec4f(center, 1.0);
    let depth = -viewCenter.z;
    if (uniforms.isOrtho == 0u && depth <= 0.0) {
        return result;
    }
    let clip = uniforms.viewProj * vec4f(center, 1.0);
    if (clip.w == 0.0) {
        return result;
    }

    let viewport = uniforms.viewport;
    let focal = uniforms.focal;

    // the work buffer holds world-space splats, so the view matrix is the model-view
    let rot = srcRotation();
    let scale = srcScale();
    let linear = mat3x3f(uniforms.view[0].xyz, uniforms.view[1].xyz, uniforms.view[2].xyz);
    let gaussian = linear * rotationMatrix(vec4f(rot.yzw, rot.x)) * mat3x3f(
        vec3f(scale.x, 0.0, 0.0),
        vec3f(0.0, scale.y, 0.0),
        vec3f(0.0, 0.0, scale.z)
    );
    let row0 = vec3f(gaussian[0].x, gaussian[1].x, gaussian[2].x);
    let row1 = vec3f(gaussian[0].y, gaussian[1].y, gaussian[2].y);
    let row2 = vec3f(gaussian[0].z, gaussian[1].z, gaussian[2].z);
    let c00 = dot(row0, row0);
    let c01 = dot(row0, row1);
    let c02 = dot(row0, row2);
    let c11 = dot(row1, row1);
    let c12 = dot(row1, row2);
    let c22 = dot(row2, row2);

    var cov00: f32;
    var cov01: f32;
    var cov11: f32;
    if (uniforms.isOrtho != 0u) {
        cov00 = focal.x * focal.x * c00;
        cov01 = focal.x * focal.y * c01;
        cov11 = focal.y * focal.y * c11;
    } else {
        let safeDepth = max(depth, 0.001);
        let invDepth = 1.0 / safeDepth;
        let jx0 = focal.x * invDepth;
        let jx2 = focal.x * viewCenter.x * invDepth * invDepth;
        let jy1 = focal.y * invDepth;
        let jy2 = focal.y * viewCenter.y * invDepth * invDepth;
        let u00 = jx0 * c00 + jx2 * c02;
        let u01 = jx0 * c01 + jx2 * c12;
        let u02 = jx0 * c02 + jx2 * c22;
        let u11 = jy1 * c11 + jy2 * c12;
        let u12 = jy1 * c12 + jy2 * c22;
        cov00 = u00 * jx0 + u02 * jx2;
        cov01 = u01 * jy1 + u02 * jy2;
        cov11 = u11 * jy1 + u12 * jy2;
    }

${r?`
    // Variant warp: the splat in the foveated target, through the affine map per axis that is
    // exact at the two ends of its quad's extent on screen. For a small splat that is the warp's
    // slope at its centre; for a large one the secant over what is visible, since a near splat
    // centred off screen, where the slope is all but zero, would shrink to nothing at the edge.
    // Everything after, the dilation and the culls included, works in the target's pixels
    let linearNdc = clip.xy / clip.w;
    let reach = 2.8284 * sqrt(vec2f(cov00, cov11)) * 2.0 / viewport;
    let lo = clamp(linearNdc - reach, vec2f(-1.0), vec2f(1.0));
    let hi = clamp(linearNdc + reach, vec2f(-1.0), vec2f(1.0));
    let span = hi - lo;
    let warpedLo = warpNdc(lo);
    let pixelScale = select(
        warpSlope(lo),
        (warpNdc(hi) - warpedLo) / max(span, vec2f(1e-9)),
        span > vec2f(1e-6)
    );
    let ndc = warpedLo + pixelScale * (linearNdc - lo);
    cov00 *= pixelScale.x * pixelScale.x;
    cov01 *= pixelScale.x * pixelScale.y;
    cov11 *= pixelScale.y * pixelScale.y;
`:`
    let ndc = clip.xy / clip.w;
    // the target's pixels per screen pixel (variant warp)
    let pixelScale = vec2f(1.0);
`}
    // the low-pass dilation every splat renderer applies, 0.3 in the chosen units
    let us2 = uniforms.unitScale * uniforms.unitScale;
    cov00 += 0.3 / us2;
    cov11 += 0.3 / us2;
    let determinant = cov00 * cov11 - cov01 * cov01;
    if (determinant <= 0.0) {
        return result;
    }

    let mid = 0.5 * (cov00 + cov11);
    let radius = length(vec2f(0.5 * (cov00 - cov11), cov01));
    let lambda1 = mid + radius;
    let lambda2 = max(mid - radius, 0.1 / us2);
${i?`
    // Stereo: one projection serves both eyes, as the engine's own stereo projector does: the
    // second eye takes this view's depth, colour, coverage and order and its own footprint, and
    // every cull keeps what either eye would
    let eye1 = footprintEye1(center, rot, scale, viewport);
`:``}
    // size cull on the footprint's radius in pixels. minPixelSize is a diameter: the engine's
    // projector is dispatched with half of it, and its quad path tests the full extent
    // (2 sqrt(2 lambda)) against the whole value, so both cut at the same place
    if (uniforms.unitScale * sqrt(2.0 * lambda1) < 0.5 * uniforms.minPixelSize${i?` && (!eye1.visible || uniforms.unitScale * sqrt(2.0 * eye1.lambda1) < 0.5 * uniforms.minPixelSize)`:``}) {
        return result;
    }

    // contribution cull: the splat's alpha mass in pixels (the engine's minContribution rule)
    if (opacity * 6.283185 * sqrt(determinant) * us2 < uniforms.minContribution${i?` && (!eye1.visible || opacity * 6.283185 * sqrt(eye1.determinant) * us2 < uniforms.minContribution)`:``}) {
        return result;
    }

    // principal axis; a circular footprint has no defined eigenvector, any axis is right
    let eigenVec = vec2f(cov01, lambda1 - cov00);
    let eigenLen = length(eigenVec);
    let direction = select(vec2f(1.0, 0.0), eigenVec / eigenLen, eigenLen > 1e-9);
    let maxRadius = min(1024.0, min(viewport.x, viewport.y));
    let len1 = 2.0 * sqrt(2.0 * lambda1);
    let len2Full = 2.0 * sqrt(2.0 * lambda2);
    let clampScale = min(1.0, maxRadius / len1);
${n===`pixel`?`
    let radiusScale = clampScale;
`:`
    // The kept ellipse's polygon, in units of the quad's half extent: area matched to the
    // ellipse, or containing it when the raster discards outside it (jitter). The cache keeps
    // the full quad's axes and the raster sizes each polygon itself; here the largest bounds the
    // culls below
    let polygonScale = select(${mc()}, ${mc(!0)}, jittered);
${n===`interleaved`?`
    // the small splats of the interleaved mode draw per splat into the full target: the
    // footprint at the alpha clip, in pixels, decides
    let footprint = 3.14159265 * len1 * len2Full * pow(radiusAt(max(uniforms.alphaClip, 1e-6), opacity), 2.0);
    let fullEntry = uniforms.interleaveArea > 0.0 && footprint < uniforms.interleaveArea;
    if (select(!any(keptSets), !splatKept, fullEntry)) {
        return result;
    }
    let threshold = select(setThreshold, splatThreshold, fullEntry);
    let radiusScale = clampScale * radiusAt(threshold, opacity) * polygonScale;
`:`
    let radiusScale = clampScale * radiusAt(splatThreshold, opacity) * polygonScale;
`}
`}
    // the extent the culls test: the largest polygon the raster will draw
    let axis1 = len1 * radiusScale * direction;
    let len2 = len2Full * radiusScale;
    let axis2 = len2 * vec2f(direction.y, -direction.x);

    let extent = abs(axis1) + abs(axis2);
    let centerPixels = (ndc * 0.5 + 0.5) * viewport;
    var outside = centerPixels.x + extent.x < 0.0 || centerPixels.x - extent.x > viewport.x
        || centerPixels.y + extent.y < 0.0 || centerPixels.y - extent.y > viewport.y;
${i?`
    // a splat either eye sees survives: the second eye's largest polygon is to its full quad as
    // this view's is (both eyes' targets are the same size)
    let polygonRatio = radiusScale / clampScale;
    let axis1Eye1 = eye1.axis1 * polygonRatio;
    let axis2Eye1 = eye1.len2 * polygonRatio * normalize(vec2f(eye1.axis1.y, -eye1.axis1.x));
    let extentEye1 = abs(axis1Eye1) + abs(axis2Eye1);
    let centerEye1 = (eye1.ndc * 0.5 + 0.5) * viewport;
    outside = outside && (!eye1.visible || centerEye1.x + extentEye1.x < 0.0 || centerEye1.x - extentEye1.x > viewport.x
        || centerEye1.y + extentEye1.y < 0.0 || centerEye1.y - extentEye1.y > viewport.y);
`:``}
    if (outside) {
        return result;
    }

${t?`
    // Occlusion cull against the previous frame. Each stored depth is the nearest sample that
    // survived there, so the farthest depth over the blocks a splat covered bounds what could
    // still have shown behind it; a splat whose front (its centre less 2 sqrt(2) sigma along the
    // view, the same cut-off as the quad's edge) lies beyond that bound was invisible last
    // frame, up to sampling. Static splats reproject exactly through the previous view, so only
    // true disocclusions arrive a frame late. The footprint the splat had last frame bounds the
    // gather; footprints up to 16 px use the 8 px grid, up to 64 px the 32 px grid, larger ones
    // skip the test. In stereo a splat goes only when both eyes' previous frames hid it.
    if (uniforms.occlusionMode != 0u) {
        let halfExtent = len1 * radiusScale;
        if (occludedIn(center, depth, focal.x, halfExtent, c22)${i?` && (!eye1.visible || occludedInEye1(center, eye1.depth, uniforms.focalEye1.x, length(axis1Eye1), c22))`:``}) {
            result.occluded = true;
            return result;
        }
    }

`:``}
    let color = clamp(srcColor(), vec3f(0.0), vec3f(8.0));

    // rgb: 10/10/10 unorm with a 2-bit shared exponent (scale 1/2/4/8, range [0, 8])
    let maxChannel = max(color.r, max(color.g, color.b));
    var exponent = 0u;
    if (maxChannel > 4.0) {
        exponent = 3u;
    } else if (maxChannel > 2.0) {
        exponent = 2u;
    } else if (maxChannel > 1.0) {
        exponent = 1u;
    }
    let rgb = vec3u(clamp(color / f32(1u << exponent), vec3f(0.0), vec3f(1.0)) * 1023.0 + 0.5);

    // centre as snorm16 over the range the offscreen cull bounds visible centres to; the
    // raster shader derives the same range from its viewport
    let ndcRange = vec2f(1.0) + vec2f(4.0 * maxRadius) / viewport;

    result.valid = true;
    result.words[0] = pack2x16snorm(ndc / ndcRange);
    result.words[1] = bitcast<u32>(depth);
${n===`pixel`?`
    result.words[2] = pack2x16float(axis1);
    result.words[3] = pack2x16float(vec2f(len2, 0.0)) | (u32(clamp(opacity, 0.0, 1.0) * 255.0 + 0.5) << 16u);
`:`
    // the full quad's axes (clamped to the radius limit); the raster scales them to each polygon
    result.words[2] = pack2x16float(len1 * clampScale * direction);
    result.words[3] = pack2x16float(vec2f(len2Full * clampScale, 0.0)) | (u32(clamp(opacity, 0.0, 1.0) * 255.0 + 0.5) << 16u);
`}
    // the depth bucket, log-spaced from the near plane, in the flags byte
    let key = clamp((log(max(depth, 1e-6)) - uniforms.keyLogNear) * uniforms.keyInvLogRange, 0.0, 0.999) * ${Z}.0;
    result.words[3] |= u32(key) << 24u;
    result.words[4] = rgb.r | (rgb.g << 10u) | (rgb.b << 20u) | (exponent << 30u);
${n===`pixel`?`
    // the stable id the coverage hash seeds from: the slot, salted by the file for sources
    // whose indices restart per file
    result.words[5] = slot ^ (file * 2654435761u);
`:n===`interleaved`?`
    // the draw's bits, bit 15 for a full-target entry, and a nibble per pixel set (0: the set
    // keeps nothing): the raster rebuilds every threshold from them
    let nibbles = select(setNibbles, vec4u(splatNibble, 0u, 0u, 0u), fullEntry);
    result.words[5] = drawnBits | select(0u, ${_c}u, fullEntry)
        | (nibbles.x << 16u) | (nibbles.y << 20u) | (nibbles.z << 24u) | (nibbles.w << 28u);
`:`
    // the draw's bits and the per-splat nibble (shaders/raster.ts)
    result.words[5] = drawnBits | (splatNibble << 16u);
`}${i?`
    // the second eye's centre, in the same range, and its full quad's axes (shaders/raster.ts),
    // stashed in workgroup memory rather than returned: three more words in the per-thread state
    // that main() holds across its barriers put the Adreno 740's compiler on a slow path, 6-9x
    // the mono projector (Quest 3, 2026-10-16, docs/device-benchmarks-2026-10-14.md)
    wgEye1[local] = vec3u(
        pack2x16snorm(eye1.ndc / ndcRange),
        pack2x16float(eye1.axis1),
        pack2x16float(vec2f(eye1.len2, 0.0))
    );`:``}
    return result;
}

var<workgroup> wgCount: atomic<u32>;
var<workgroup> wgOccluded: atomic<u32>;
var<workgroup> wgBase: u32;
var<workgroup> wgBuckets: array<atomic<u32>, ${Z}>;${i?`
// stereo: each thread's second-eye words, from project() to the cache write
var<workgroup> wgEye1: array<vec3u, ${dc}>;`:``}

@compute @workgroup_size(${dc})
fn main(
    @builtin(workgroup_id) wg: vec3u,
    @builtin(num_workgroups) numWorkgroups: vec3u,
    @builtin(local_invocation_index) local: u32
) {
    // no early returns: the barriers below need every thread of the workgroup
    let chunkIndex = wg.x + wg.y * numWorkgroups.x;
    atomicStore(&wgBuckets[local], 0u);
    var projected: Projected;
    projected.valid = false;
    projected.occluded = false;
    if (chunkIndex < uniforms.numChunks) {
        let chunk = chunks[uniforms.chunkBase + chunkIndex];
        let visible = (nodeVisible[chunk.z >> 5u] >> (chunk.z & 31u)) & 1u;
        if (visible != 0u && local < chunk.y) {
            projected = project(chunk.x + local, chunk.w >> 16u${i?`, local`:``});
        }
    }

    // survivors claim consecutive slots: one workgroup-local count, one global atomic
    var localSlot = 0u;
    if (projected.valid) {
        localSlot = atomicAdd(&wgCount, 1u);
    }
    if (projected.occluded) {
        atomicAdd(&wgOccluded, 1u);
    }
    workgroupBarrier();
    if (local == 0u) {
        let n = atomicLoad(&wgCount);
        wgBase = select(0u, atomicAdd(&counter[0], n), n > 0u);
        let o = atomicLoad(&wgOccluded);
        if (o > 0u) {
            atomicAdd(&counter[1], o);
        }
    }
    workgroupBarrier();
    if (projected.valid) {
        let base = (wgBase + localSlot) * ${uc}u;
        for (var i = 0u; i < ${uc}u; i++) {
            cache[base + i] = projected.words[i];
        }${i?`
        // the second eye's three words, after every entry
        let stereoBase = uniforms.stereoBase + (wgBase + localSlot) * 3u;
        let eye1Words = wgEye1[local];
        cache[stereoBase] = eye1Words.x;
        cache[stereoBase + 1u] = eye1Words.y;
        cache[stereoBase + 2u] = eye1Words.z;`:``}
${n===`interleaved`?`
        // one entry per kept pixel set, or one in the full target's group: the group's
        // ${gc} buckets, front to back, from the depth bucket
        let depthKey = ((projected.words[3] >> 24u) * ${gc}u) >> 8u;
        if ((projected.words[5] & ${_c}u) != 0u) {
            atomicAdd(&wgBuckets[4u * ${gc}u + depthKey], 1u);
        } else {
            for (var s = 0u; s < 4u; s++) {
                if (((projected.words[5] >> (16u + 4u * s)) & 1u) != 0u) {
                    atomicAdd(&wgBuckets[s * ${gc}u + depthKey], 1u);
                }
            }
        }`:`        atomicAdd(&wgBuckets[projected.words[3] >> 24u], 1u);`}
    }
    // a chunk's splats are spatially coherent, so few of its buckets are non-empty: one
    // workgroup count each, then one global atomic per non-empty bucket
    workgroupBarrier();
    let bucketCount = atomicLoad(&wgBuckets[local]);
    if (bucketCount > 0u) {
        atomicAdd(&buckets[local], bucketCount);
    }
}
`,wc=`
struct DrawIndexedIndirectArgs {
    indexCount: u32,
    instanceCount: u32,
    firstIndex: u32,
    baseVertex: i32,
    firstInstance: u32
}

struct ArgsUniforms {
    drawSlot: u32,
    indexCount: u32,
    quadsPerInstance: u32,
    dispatchSlot: u32,
    scatterWorkgroupSize: u32
}

@group(0) @binding(0) var<storage, read> counter: array<u32>;
@group(0) @binding(1) var<storage, read_write> indirectDrawArgs: array<DrawIndexedIndirectArgs>;
@group(0) @binding(2) var<storage, read_write> indirectDispatchArgs: array<u32>;
@group(0) @binding(3) var<uniform> uniforms: ArgsUniforms;

@compute @workgroup_size(1)
fn main() {
    let count = counter[0];
    indirectDrawArgs[uniforms.drawSlot] = DrawIndexedIndirectArgs(
        uniforms.indexCount,
        (count + uniforms.quadsPerInstance - 1u) / uniforms.quadsPerInstance,
        0u,
        0,
        0u
    );
    // the scatter: one workgroup per scatterWorkgroupSize survivors, 2D past the 65535 limit
    let groups = (count + uniforms.scatterWorkgroupSize - 1u) / uniforms.scatterWorkgroupSize;
    let x = max(min(groups, 65535u), 1u);
    let base = uniforms.dispatchSlot * 3u;
    indirectDispatchArgs[base] = x;
    indirectDispatchArgs[base + 1u] = (groups + x - 1u) / x;
    indirectDispatchArgs[base + 2u] = 1u;
}
`,Tc=`
struct DrawIndexedIndirectArgs {
    indexCount: u32,
    instanceCount: u32,
    firstIndex: u32,
    baseVertex: i32,
    firstInstance: u32
}

struct SetArgsUniforms {
    drawSlot: u32,
    indexCount: u32,
    quadsPerInstance: u32
}

// [0, ${Z}) counts, [${Z}, ${2*Z}) offsets
@group(0) @binding(0) var<storage, read> buckets: array<u32>;
@group(0) @binding(1) var<storage, read_write> indirectDrawArgs: array<DrawIndexedIndirectArgs>;
@group(0) @binding(2) var<storage, read_write> setRanges: array<vec2u>;
@group(0) @binding(3) var<uniform> uniforms: SetArgsUniforms;

@compute @workgroup_size(${hc})
fn main(@builtin(local_invocation_index) index: u32) {
    let first = buckets[${Z}u + index * ${gc}u];
    var count = 0u;
    for (var b = 0u; b < ${gc}u; b++) {
        count += buckets[index * ${gc}u + b];
    }
    setRanges[index] = vec2u(first, first + count);
    indirectDrawArgs[uniforms.drawSlot + index] = DrawIndexedIndirectArgs(
        uniforms.indexCount,
        (count + uniforms.quadsPerInstance - 1u) / uniforms.quadsPerInstance,
        0u,
        0,
        0u
    );
}
`,Ec=511,Dc=`
attribute vertex_position: vec2f;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4f(vertex_position, 0.0, 1.0);
    return output;
}
`,Oc=`
const TAA_COLOR_SCALE = 65535.0;

#ifdef SSE_TAA_HALF
    // Variant taaHistory:half, an XR eye's by default: the colour in half floats, which filter,
    // so the moving fetch takes five bilinear taps instead of sixteen loads (historyCubicAt), 4.3
    // of the pass's 7.4 ms in a Vision Pro session. Half floats stall a long mean (above), but in a
    // session the head never rests, so the history holds at most taaMoveMax samples
    fn decodeColor(v: vec4f) -> vec4f {
        return v;
    }

    fn encodeColor(c: vec4f) -> vec4f {
        let a = clamp(c.a, 0.0, 1.0);
        return vec4f(clamp(c.rgb, vec3f(0.0), vec3f(a)), a);
    }
#else
    fn decodeColor(v: vec4u) -> vec4f {
        return vec4f(v) / TAA_COLOR_SCALE;
    }

    // premultiplied colour and coverage: coverage in [0, 1] and colour within it (the Catmull-Rom
    // fetch over- and undershoots both), rounded to the nearest step
    fn encodeColor(c: vec4f) -> vec4u {
        let a = clamp(c.a, 0.0, 1.0);
        return vec4u(round(vec4f(clamp(c.rgb, vec3f(0.0), vec3f(a)), a) * TAA_COLOR_SCALE));
    }
#endif

struct HistoryInfo {
    depth: f32,
    count: f32
}

// The mean view depth keeps the float's exponent and top 15 mantissa bits, rounded: a relative
// step of 2^-15, which stalls a 256-sample mean only within 0.4 % of the depth (the depth steers
// the reprojection, where that is far below a pixel). The count takes the low 9 bits
fn decodeInfo(v: u32) -> HistoryInfo {
    var info: HistoryInfo;
    info.depth = bitcast<f32>((v >> 9u) << 8u);
    info.count = f32(v & ${Ec}u);
    return info;
}

fn encodeInfo(depth: f32, count: f32) -> u32 {
    let bits = bitcast<u32>(max(depth, 0.0));
    return (((bits + 0x80u) >> 8u) << 9u) | min(u32(count), ${Ec}u);
}
`,kc=`
#ifdef SSE_SETS
    // variant coverage:interleaved: this frame's samples straight from the four pixel sets'
    // targets, the full target's pixel (2i + x, 2j + y) being set (x, y)'s (i, j), and their
    // depth written into the full depth target for the compose, the occlusion grid and the picker
    // (in place of a pass that copies the sets back)
    var setColor0: texture_2d<f32>;
    var setColor0Sampler: sampler;
    var setColor1: texture_2d<f32>;
    var setColor1Sampler: sampler;
    var setColor2: texture_2d<f32>;
    var setColor2Sampler: sampler;
    var setColor3: texture_2d<f32>;
    var setColor3Sampler: sampler;
    var setDepth0: texture_depth_2d;
    var setDepth1: texture_depth_2d;
    var setDepth2: texture_depth_2d;
    var setDepth3: texture_depth_2d;
#else
    var curColor: texture_2d<f32>;
    var curColorSampler: sampler;
    var curDepth: texture_depth_2d;
#endif
// premultiplied colour and coverage, unorm16 or half floats (decodeColor)
#ifdef SSE_TAA_HALF
    var histColor: texture_2d<f32>;
    var histColorSampler: sampler;
#else
    var histColor: texture_2d<u32>;
#endif
// the mean view depth of the pixel's samples and their count, in the previous frame's view
// depths (decodeInfo)
var histInfo: texture_2d<u32>;

// the camera's world transform (the inverse view), and its projection's x and y terms: x, y the
// scales, z, w the offsets (the column that multiplies view z for a perspective camera, the
// translation for an orthographic one)
uniform cameraWorld: mat4x4f;
uniform unproject: vec4f;
uniform prevViewProj: mat4x4f;
uniform prevView: mat4x4f;
// clip z = a * viewDepth + b over w = viewDepth (x, y); z: 1 for an orthographic camera
uniform clipZParams: vec4f;
// x: sample cap, y: 1 when the history holds the previous frame, z: 1 when the camera moved
// since that frame, w: the frames the camera has rested, this one included (0 on a frame whose
// resident set changed)
uniform taaParams: vec4f;
// width, height, 1 / width, 1 / height
uniform taaViewport: vec4f;
// x: -1 when the target's rows run bottom-up (an offscreen target), else 1; y: the colour
// clamp width in neighbourhood standard deviations while moving (0: no clamp); z: 1 to
// reproject through the pixel's accumulated mean depth rather than this frame's sample depth;
// w: image motion in pixels a frame that halves the moving sample cap (0: fixed cap)
uniform taaControl: vec4f;
// x: 1 to shorten the moving cap by no more than the parallax motion, and a history an occluder
// left behind by its misplacement (variant taaParallax);
// y: the history length at which the moving sample is half the pixel's own, half the quad mean
// (variant taaSharp, 0: the quad mean)
uniform taaMoving: vec2f;
// 1: write the accumulation state instead of colour (r: count / cap, g: history accepted,
// b: the camera moved since the previous frame)
uniform taaDebug: f32;
#ifdef SSE_WARP
    // variant warp: the view's table (shaders/warp.ts)
    var<storage, read> warpTable: array<f32>;
    ${lc}
#endif

${Oc}

// variant taaParallax: the misplacement in pixels a frame that halves the cap of a history an
// occluder left behind (measured against 1 px, which kept a visible trail)
const TAA_GHOST_PX = 0.25;

fn viewDepthOf(z: f32) -> f32 {
    let p = uniform.clipZParams;
    let dz = z - p.x;
    let safeDz = select(dz, sign(dz) * 1e-9 + 1e-12, abs(dz) < 1e-9);
    return select(p.y / safeDz, (z - p.y) / p.x, p.z != 0.0);
}

struct Reprojected {
    valid: bool,
    uv: vec2f,
    prevDepth: f32,
    // where the camera's rotation alone carries the pixel (its ray's direction, a point at
    // infinity), so uv - farUv is the parallax its translation adds; for an orthographic camera
    // the pixel itself, the whole motion
    farUv: vec2f
}

// The previous frame's view depth and texture coordinate of this pixel's point at a view
// depth. The point is built in view space from the depth and the projection's x and y terms,
// then moved by the camera's rigid transform: through the inverse view-projection instead, a
// near plane at 1e-4 of the depth (the viewer's floor once the camera is inside the scene
// bound) leaves a 32-bit float about three digits of the point, a pixel of error that changes
// with every frame's sample depths and shakes the history.
fn reproject(pix: vec2i, viewDepth: f32) -> Reprojected {
    var r: Reprojected;
    let flip = uniform.taaControl.x;
    let uv = (vec2f(pix) + vec2f(0.5)) * uniform.taaViewport.zw;
    // variant warp: the texel's place on screen, and the previous frame's points back into the
    // target; the history's coordinates are the target's
    #ifdef SSE_WARP
        let rowFromTop = select(i32(uniform.taaViewport.y) - 1 - pix.y, pix.y, flip > 0.0);
        let ndc = unwarpTexel(vec2i(pix.x, rowFromTop));
    #else
        let ndc = vec2f(uv.x * 2.0 - 1.0, flip * (1.0 - 2.0 * uv.y));
    #endif
    let u = uniform.unproject;
    let viewXY = select((ndc + u.zw) * viewDepth, ndc - u.zw, uniform.clipZParams.z != 0.0) / u.xy;
    let world = (uniform.cameraWorld * vec4f(viewXY, -viewDepth, 1.0)).xyz;
    let prevClip = uniform.prevViewProj * vec4f(world, 1.0);
    r.prevDepth = -(uniform.prevView * vec4f(world, 1.0)).z;
    r.valid = prevClip.w > 0.0;
    var prevNdc = prevClip.xy / max(prevClip.w, 1e-9);
    let dir = (uniform.cameraWorld * vec4f(viewXY, -viewDepth, 0.0)).xyz;
    let farClip = uniform.prevViewProj * vec4f(dir, 0.0);
    var farNdc = farClip.xy / max(farClip.w, 1e-9);
    #ifdef SSE_WARP
        prevNdc = warpNdc(prevNdc);
        farNdc = warpNdc(farNdc);
    #endif
    r.uv = vec2f(prevNdc.x * 0.5 + 0.5, 0.5 - prevNdc.y * flip * 0.5);
    r.valid = r.valid && all(r.uv >= vec2f(0.0)) && all(r.uv <= vec2f(1.0));
    r.farUv = select(vec2f(farNdc.x * 0.5 + 0.5, 0.5 - farNdc.y * flip * 0.5), uv, uniform.clipZParams.z != 0.0);
    return r;
}

struct Current {
    color: vec4f,
    depth: f32
}

// this frame's colour and depth at a texel
fn current(p: vec2i) -> Current {
    var c: Current;
    #ifdef SSE_SETS
        let t = p >> vec2u(1u);
        let index = (p.x & 1) + (p.y & 1) * 2;
        if (index == 0) {
            c.color = textureLoad(setColor0, t, 0);
            c.depth = textureLoad(setDepth0, t, 0);
        } else if (index == 1) {
            c.color = textureLoad(setColor1, t, 0);
            c.depth = textureLoad(setDepth1, t, 0);
        } else if (index == 2) {
            c.color = textureLoad(setColor2, t, 0);
            c.depth = textureLoad(setDepth2, t, 0);
        } else {
            c.color = textureLoad(setColor3, t, 0);
            c.depth = textureLoad(setDepth3, t, 0);
        }
    #else
        c.color = textureLoad(curColor, p, 0);
        c.depth = textureLoad(curDepth, p, 0);
    #endif
    return c;
}

// the premultiplied sample at a texel: its colour where a fragment landed, nothing otherwise
fn sampleAt(pix: vec2i, dims: vec2i) -> vec4f {
    let s = current(clamp(pix, vec2i(0), dims - vec2i(1)));
    return select(vec4f(0.0), vec4f(s.color.rgb, 1.0), s.color.a > 0.0 && s.depth < 1.0);
}

// The mean of the 2x2 quad's samples, bilinear between quad centres (the compose's resolve of
// the raster's quad-stratified thresholds): four samples a pixel, at a little sharpness, for
// the frames where the history is too short to carry the noise on its own
fn quadSample(pix: vec2i, dims: vec2i) -> vec4f {
    let u = (vec2f(pix) - vec2f(0.5)) * 0.5;
    #ifdef SSE_SETS
        // a quad is one texel of each set, so the bilinear mean between quad centres is the
        // mean of the sets' bilinear fetches there
        let uvS = (u + vec2f(0.5)) / vec2f(textureDimensions(setColor0));
        let m = 0.25 * (textureSampleLevel(setColor0, setColor0Sampler, uvS, 0.0) +
            textureSampleLevel(setColor1, setColor1Sampler, uvS, 0.0) +
            textureSampleLevel(setColor2, setColor2Sampler, uvS, 0.0) +
            textureSampleLevel(setColor3, setColor3Sampler, uvS, 0.0));
    #else
        let size = vec2f(dims);
        let q0 = floor(u);
        let f = u - q0;
        let uv = (q0 * 2.0 + vec2f(1.0)) / size;
        let step = vec2f(2.0) / size;
        let a = textureSampleLevel(curColor, curColorSampler, uv, 0.0);
        let b = textureSampleLevel(curColor, curColorSampler, uv + vec2f(step.x, 0.0), 0.0);
        let c = textureSampleLevel(curColor, curColorSampler, uv + vec2f(0.0, step.y), 0.0);
        let d = textureSampleLevel(curColor, curColorSampler, uv + step, 0.0);
        let m = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    #endif
    // the raster leaves empty texels transparent black, so the mean is premultiplied coverage
    return vec4f(m.rgb, m.a);
}

fn historyTexel(p: vec2i, dims: vec2i) -> vec4f {
    return decodeColor(textureLoad(histColor, clamp(p, vec2i(0), dims - vec2i(1)), 0));
}

// Catmull-Rom fetch of the history: sharper than bilinear, whose blur compounds over the
// frames a moving history lives. Its lobes over- and undershoot; the encoding clamps both
fn historyCubicAt(uv: vec2f, dims: vec2i) -> vec4f {
    let p = uv * vec2f(dims) - vec2f(0.5);
    let i0 = floor(p);
    let f = p - i0;
    let f2 = f * f;
    let f3 = f2 * f;
    // Catmull-Rom weights for taps at -1, 0, 1, 2
    let w0 = -0.5 * f3 + f2 - 0.5 * f;
    let w1 = 1.5 * f3 - 2.5 * f2 + vec2f(1.0);
    let w2 = -1.5 * f3 + 2.0 * f2 + 0.5 * f;
    let w3 = 0.5 * f3 - 0.5 * f2;
    #ifdef SSE_TAA_HALF
        // five bilinear taps (Jimenez, Filmic SMAA, 2016): along each axis the two middle texels
        // in one tap placed between them by their weights, and the four corner taps, each the
        // product of two small outer weights, left out and the rest renormalised
        let size = vec2f(dims);
        let w12 = w1 + w2;
        let t0 = (i0 - vec2f(0.5)) / size;
        let t3 = (i0 + vec2f(2.5)) / size;
        let t12 = (i0 + vec2f(0.5) + w2 / w12) / size;
        let sum = textureSampleLevel(histColor, histColorSampler, vec2f(t12.x, t0.y), 0.0) * (w12.x * w0.y) +
            textureSampleLevel(histColor, histColorSampler, vec2f(t0.x, t12.y), 0.0) * (w0.x * w12.y) +
            textureSampleLevel(histColor, histColorSampler, t12, 0.0) * (w12.x * w12.y) +
            textureSampleLevel(histColor, histColorSampler, vec2f(t3.x, t12.y), 0.0) * (w3.x * w12.y) +
            textureSampleLevel(histColor, histColorSampler, vec2f(t12.x, t3.y), 0.0) * (w12.x * w3.y);
        return sum / (w12.x * (w0.y + w12.y + w3.y) + (w0.x + w3.x) * w12.y);
    #else
        let wx = array<f32, 4>(w0.x, w1.x, w2.x, w3.x);
        let wy = array<f32, 4>(w0.y, w1.y, w2.y, w3.y);
        var sum = vec4f(0.0);
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                sum += historyTexel(vec2i(i0) + vec2i(x - 1, y - 1), dims) * (wx[x] * wy[y]);
            }
        }
        return sum;
    #endif
}

@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;
    let pix = vec2i(pcPosition.xy);
    let dims = vec2i(uniform.taaViewport.xy);
    let here = current(pix);
    let cur = here.color;
    let z = here.depth;
    #ifdef SSE_SETS
        output.fragDepth = z;
    #endif
    let hit = cur.a > 0.0 && z < 1.0;
    let d = viewDepthOf(z);

    let own = decodeInfo(textureLoad(histInfo, pix, 0).x);
    let maxCount = uniform.taaParams.x;
    let historyValid = uniform.taaParams.y > 0.5;
    let moving = uniform.taaParams.z > 0.5;
    // still: this pixel's own sample, so the history converges to full resolution; moving:
    // the quad's four, which a long history takes back toward the pixel's own (below)
    let single = select(vec4f(0.0), vec4f(cur.rgb, 1.0), hit);
    var sample = single;
    if (moving) {
        sample = quadSample(pix, dims);
    }

    // Where to look in the history: through this frame's sample, or, with no sample, through
    // the depth this pixel's own history remembers, so an emptied pixel fades rather than
    // holding a stale colour
    var r: Reprojected;
    r.valid = false;
    var carryDepth = 0.0;
    if (!moving) {
        // a resting camera maps every pixel onto itself: the exact texel, not the round trip
        // through the matrices, whose rounding would blur the history a little every frame
        r.valid = true;
        r.uv = (vec2f(pix) + vec2f(0.5)) * uniform.taaViewport.zw;
        r.prevDepth = select(own.depth, d, hit);
        carryDepth = r.prevDepth;
    } else if (uniform.taaControl.z > 0.5 && own.count > 0.5) {
        // through the depth the pixel's history has settled on: one stochastic sample's depth
        // is one layer of the mixture the history holds, and reprojecting the mixture through
        // a different layer every frame smears it by their parallax
        r = reproject(pix, own.depth);
        carryDepth = own.depth;
    } else if (hit) {
        r = reproject(pix, d);
        carryDepth = d;
    } else if (own.count > 0.5) {
        r = reproject(pix, own.depth);
        carryDepth = own.depth;
    }
    r.valid = r.valid && historyValid;

    var hist = vec4f(0.0);
    var info: HistoryInfo;
    var accepted = false;
    if (r.valid) {
        // at rest the exact texel; moving, a filtered fetch of the reprojected position
        if (!moving) {
            hist = decodeColor(textureLoad(histColor, pix, 0));
            info = own;
        } else {
            hist = historyCubicAt(r.uv, dims);
            info = decodeInfo(textureLoad(histInfo, clamp(vec2i(r.uv * vec2f(dims)), vec2i(0), dims - vec2i(1)), 0).x);
        }
        // a resting camera cannot disocclude anything, so every sample is accepted and the
        // pixel converges; moving, the colour clamp below keeps a disoccluded history out
        accepted = info.count > 0.5;
    }

    var color: vec4f;
    var mean: f32;
    var count: f32;
    if (!accepted) {
        color = sample;
        mean = d;
        count = select(0.0, 1.0, hit);
        // at rest a pixel with no hit yet has still been sampled on every rest frame, so its
        // first hit is one of that many samples: at full weight a rare hit would flash to full
        // coverage, and freeze there once the viewer stops rendering. Its depth is the hit's
        if (hit && !moving && historyValid) {
            count = clamp(uniform.taaParams.w, 1.0, maxCount);
            color = sample / count;
        }
    } else {
        // moving, the history is clamped to the colours this frame's neighbourhood holds, so a
        // stale colour cannot survive where nothing like it is drawn any more
        if (moving && uniform.taaControl.y > 0.0) {
            var m1 = vec4f(0.0);
            var m2 = vec4f(0.0);
            for (var dy = -1; dy <= 1; dy++) {
                for (var dx = -1; dx <= 1; dx++) {
                    let n = sampleAt(pix + vec2i(dx, dy), dims);
                    m1 += n;
                    m2 += n * n;
                }
            }
            let mu = m1 / 9.0;
            let sd = sqrt(max(m2 / 9.0 - mu * mu, vec4f(0.0)));
            let halfWidth = sd * uniform.taaControl.y;
            hist = clamp(hist, mu - halfWidth, mu + halfWidth);
        }
        // the faster the image moves, the shorter the history: a stochastic pixel's layers
        // reproject through one layer's depth, so their parallax smears the history by an
        // amount that grows with the motion, and a raw frame is the better estimate past it.
        // A rotation moves every layer alike, whatever its depth, so with variant taaParallax
        // the motion counts for no more than the parallax the camera's translation adds
        var cap = maxCount;
        if (moving && uniform.taaControl.w > 0.0) {
            var speed = length(r.uv * vec2f(dims) - vec2f(pix) - vec2f(0.5));
            let parallax = length((r.uv - r.farUv) * vec2f(dims));
            if (uniform.taaMoving.x > 0.5) {
                speed = min(speed, parallax);
            }
            cap = max(2.0, maxCount / (1.0 + speed / uniform.taaControl.w));
            // A history nearer than this frame's sample is what an occluder left behind as it
            // moved off the pixel: its surface's parallax is the sample's scaled by their depth
            // ratio, so it lands that much further each frame from where it is fetched, and a
            // history the length of the background's own motion would streak. Its cap shrinks
            // by that misplacement; a rotation has no parallax, so it keeps its history
            if (uniform.taaMoving.x > 0.5 && hit) {
                let ghost = parallax * max(r.prevDepth - info.depth, 0.0) / max(info.depth, 1e-6);
                cap = min(cap, max(2.0, maxCount / (1.0 + ghost / TAA_GHOST_PX)));
            }
        }
        count = min(info.count + 1.0, cap);
        // variant taaSharp: the longer the history, the more of the noise it carries and the
        // less the quad mean's blur buys, so the pixel's own sample takes count / (count + k)
        if (moving && uniform.taaMoving.y > 0.0) {
            sample = mix(sample, single, count / (count + uniform.taaMoving.y));
        }
        let w = 1.0 / count;
        color = mix(hist, sample, w);
        // an empty sample takes at least a step off the coverage: rounded to the nearest, a
        // decay of less than half a step holds (below cap / 2 steps, about 0.002 at the default
        // cap), so a faint pixel would keep its coverage, and the depth the compose writes for
        // it, forever. The colour follows, since the encoding keeps it within the coverage
        if (sample.a == 0.0) {
            color.a = min(color.a, max(hist.a - 1.0 / TAA_COLOR_SCALE, 0.0));
        }
        // carry the mean depth into this view: the point moved along the ray by the change in
        // its depth, then the sample joins it
        let shifted = info.depth + (carryDepth - r.prevDepth);
        mean = select(shifted, shifted + w * (d - shifted), hit);
    }

    if (uniform.taaDebug > 1.5) {
        // the reprojection offset in pixels, 8 px full scale, centred on 0.5
        let mv = select(vec2f(0.0), r.uv * vec2f(dims) - vec2f(pix) - vec2f(0.5), r.valid);
        color = vec4f(mv / 16.0 + vec2f(0.5), select(0.0, 1.0, r.valid), 1.0);
    } else if (uniform.taaDebug > 0.5) {
        color = vec4f(count / maxCount, select(0.0, 1.0, accepted), select(0.0, 1.0, moving), 1.0);
    }
    output.color = encodeColor(color);
    output.color1 = encodeInfo(mean, count);
    return output;
}
`,Ac=`
varying screenPos: vec2f;
`,jc=`
attribute vertex_position: vec2f;
${Ac}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4f(vertex_position, 0.0, 1.0);
    output.screenPos = vertex_position * 0.5 + vec2f(0.5);
    return output;
}
`,Mc=`
#include "gsplatOutputVS"
${Ac}

var splatColor: texture_2d<f32>;
var splatColorSampler: sampler;
var splatDepth: texture_depth_2d;
// the temporally accumulated frame (premultiplied colour, coverage), when taa ran this frame:
// unorm16, or half floats (variant taaHistory, shaders/taa.ts)
#ifdef SSE_TAA_HALF
    var taaColor: texture_2d<f32>;
#else
    var taaColor: texture_2d<u32>;
#endif
// its depth record: the mean view depth of the pixel's samples and their count
var taaInfo: texture_2d<u32>;
// x: 1 when the splat target's rows run the other way to the camera target's; y: 1 for an
// orthographic camera; z: 1 to read the taa history instead of the raw frame (w unused)
uniform composeParams: vec4f;
// the splat target's depth: clip z = a * viewDepth + b over w = viewDepth (x, y), and the
// camera's near and far (z, w) for the depth view
uniform depthViewParams: vec4f;
// the camera's own depth, the one written for the rest of the scene: clip z = a * viewDepth + b
// (x, y). The splat target's far plane is at infinity where the camera's is fitted to the scene
uniform cameraClipZ: vec4f;
// variant taaSharpen: x the strength of an unsharp mask on the history at display, y the sample
// count at which it has faded out (a still camera's converged history needs none)
uniform sharpenParams: vec4f;
#ifdef SSE_WARP
    // variant warp: the view's table (shaders/warp.ts)
    var<storage, read> warpTable: array<f32>;
    ${lc}
#endif

${Oc}

const FAR_DEPTH = 0.999999;

// the splat target's depth texel of a view depth, just inside its far plane at most: the
// raster clamps there too, since a depth of 1 reads as no sample
fn clipZOf(viewDepth: f32) -> f32 {
    let p = uniform.depthViewParams;
    let w = select(viewDepth, 1.0, uniform.composeParams.y > 0.5);
    return min(clamp(p.x * viewDepth + p.y, 0.0, w) / w, FAR_DEPTH);
}

// the view depth of a splat target depth texel
fn viewDepthOf(z: f32) -> f32 {
    let p = uniform.depthViewParams;
    let dz = z - p.x;
    let safeDz = select(dz, sign(dz) * 1e-9 + 1e-12, abs(dz) < 1e-9);
    return select(p.y / safeDz, (z - p.y) / p.x, uniform.composeParams.y > 0.5);
}

// a splat target texel's depth: the nearest sample's, or 1 (the clear) where none landed
fn sampleDepth(p: vec2i) -> f32 {
    return textureLoad(splatDepth, p, 0);
}

// A splat target depth in the camera's depth, clamped just inside the camera's far plane as the
// engine clamps its splats: splats beyond it stay behind everything the scene draws
fn cameraDepthOf(z: f32) -> f32 {
    let viewDepth = viewDepthOf(z);
    let c = uniform.cameraClipZ;
    let w = select(viewDepth, 1.0, uniform.composeParams.y > 0.5);
    return min(clamp(c.x * viewDepth + c.y, 0.0, w) / w, FAR_DEPTH);
}

@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;
    let dims = vec2i(textureDimensions(splatColor));
    // variant warp: the foveated target holds this pixel where the warp put it
    #ifdef SSE_WARP
        let screen = warpNdc(input.screenPos * 2.0 - vec2f(1.0)) * 0.5 + vec2f(0.5);
    #else
        let screen = input.screenPos;
    #endif
    // the splat target's texel under this fragment, rows from the top as the fragment's are
    var pix = vec2i(floor(vec2f(screen.x, 1.0 - screen.y) * vec2f(dims)));
    if (uniform.composeParams.x > 0.5) {
        pix.y = dims.y - 1 - pix.y;
    }
    pix = clamp(pix, vec2i(0), dims - vec2i(1));

    var depth = sampleDepth(pix);
    var color: vec4f;
    if (uniform.composeParams.z > 0.5) {
        // the accumulated history: coverage in alpha, colour premultiplied by it
        color = decodeColor(textureLoad(taaColor, pix, 0));
        if (color.a > 0.001) {
            let info = decodeInfo(textureLoad(taaInfo, pix, 0).x);
            // Variant taaSharpen: an unsharp mask applied here at display, where nothing feeds back
            // (a sharper kernel inside the accumulation diverges), to take back some of the blur
            // the moving path's resampling compounds. The blur is a few pixels wide, so the mask
            // takes its mean over a 5x5 tent; it fades out as the history lengthens toward a still
            // camera's, which is sharp already
            if (uniform.sharpenParams.x > 0.0 && info.count > 0.5) {
                var mean = vec4f(0.0);
                var weight = 0.0;
                for (var dy = -2; dy <= 2; dy++) {
                    for (var dx = -2; dx <= 2; dx++) {
                        let w = f32((3 - abs(dx)) * (3 - abs(dy)));
                        mean += decodeColor(textureLoad(taaColor, clamp(pix + vec2i(dx, dy), vec2i(0), dims - vec2i(1)), 0)) * w;
                        weight += w;
                    }
                }
                let k = uniform.sharpenParams.x * clamp(1.0 - info.count / max(uniform.sharpenParams.y, 1.0), 0.0, 1.0);
                color += (color - mean / weight) * k;
                let a = clamp(color.a, 0.0, 1.0);
                color = vec4f(clamp(color.rgb, vec3f(0.0), vec3f(a)), a);
            }
            // The mean depth of the pixel's own samples wherever it has a history, rather than
            // this frame's nearest sample: a faint splat in front takes a sample on a few frames
            // only, so the depth would flicker between it and what lies behind, which a compositor
            // reprojecting a late XR frame by depth shows as judder there, and which hides what
            // is drawn after the splats on some frames only. For a history this frame started
            // (moving, from the quad's samples), this frame's sample, or where none landed the
            // nearest sampled neighbour's, so the pixel still occludes what is behind the splats
            if (info.count > 0.5) {
                depth = clipZOf(info.depth);
            } else if (depth >= 1.0) {
                for (var dy = -1; dy <= 1; dy++) {
                    for (var dx = -1; dx <= 1; dx++) {
                        depth = min(depth, sampleDepth(clamp(pix + vec2i(dx, dy), vec2i(0), dims - vec2i(1))));
                    }
                }
            }
        }
    } else {
        // the raw frame: the mean of each 2x2 quad, bilinearly interpolated between quad centres.
        // A quad's four pixels take thresholds spread over [0, 1) (interleaved gradient noise, or
        // the pixel sets' four quarters), so the mean is close to the splat's coverage. Empty
        // texels are transparent black, so the result is premultiplied coverage
        let size = vec2f(dims);
        let u = (vec2f(pix) - vec2f(0.5)) * 0.5;
        let q0 = floor(u);
        let f = u - q0;
        let uv = (q0 * 2.0 + vec2f(1.0)) / size;
        let step = vec2f(2.0) / size;
        let a = textureSampleLevel(splatColor, splatColorSampler, uv, 0.0);
        let b = textureSampleLevel(splatColor, splatColorSampler, uv + vec2f(step.x, 0.0), 0.0);
        let c = textureSampleLevel(splatColor, splatColorSampler, uv + vec2f(0.0, step.y), 0.0);
        let d = textureSampleLevel(splatColor, splatColorSampler, uv + step, 0.0);
        color = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        if (depth >= 1.0) {
            // no sample at this pixel but coverage from its quad: the quad's nearest depth
            let quad = (pix >> vec2u(1u)) << vec2u(1u);
            depth = min(
                min(sampleDepth(quad), sampleDepth(min(quad + vec2i(1, 0), dims - 1))),
                min(sampleDepth(min(quad + vec2i(0, 1), dims - 1)), sampleDepth(min(quad + vec2i(1, 1), dims - 1)))
            );
        }
    }
    if (color.a <= 0.001) {
        discard;
    }
    // coverage with no depth anywhere near: shown, behind everything the scene drew
    depth = min(depth, FAR_DEPTH);

    #ifdef SSE_SHOW_DEPTH
        // the nearest sample's view depth, log-spaced between near and far, as grey
        let p = uniform.depthViewParams;
        let viewDepth = viewDepthOf(depth);
        let t = clamp(log(max(viewDepth, p.z) / p.z) / log(p.w / p.z), 0.0, 1.0);
        // 24-bit fixed point across rgb (high byte in red), so a capture can read it precisely
        let fixed = floor(t * 16777215.0);
        let hi = floor(fixed / 65536.0);
        let mid = floor((fixed - hi * 65536.0) / 256.0);
        let lo = fixed - hi * 65536.0 - mid * 256.0;
        output.color = vec4f(vec3f(hi, mid, lo) / 255.0, 1.0);
        output.fragDepth = cameraDepthOf(depth);
        return output;
    #endif

    // un-premultiply for the output transform, then premultiply for the blend
    let gamma = color.rgb / color.a;
    let rgb = prepareOutputFromGamma(gamma, 0.0);
    output.color = vec4f(rgb * color.a, color.a);
    output.fragDepth = cameraDepthOf(depth);
    return output;
}
`,Nc=`
var setColor0: texture_2d<f32>;
var setColor1: texture_2d<f32>;
var setColor2: texture_2d<f32>;
var setColor3: texture_2d<f32>;
var setDepth0: texture_depth_2d;
var setDepth1: texture_depth_2d;
var setDepth2: texture_depth_2d;
var setDepth3: texture_depth_2d;

@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;
    let pix = vec2i(pcPosition.xy);
    let texel = pix >> vec2u(1u);
    let index = (pix.x & 1) + (pix.y & 1) * 2;
    var color: vec4f;
    var depth: f32;
    if (index == 0) {
        color = textureLoad(setColor0, texel, 0);
        depth = textureLoad(setDepth0, texel, 0);
    } else if (index == 1) {
        color = textureLoad(setColor1, texel, 0);
        depth = textureLoad(setDepth1, texel, 0);
    } else if (index == 2) {
        color = textureLoad(setColor2, texel, 0);
        depth = textureLoad(setDepth2, texel, 0);
    } else {
        color = textureLoad(setColor3, texel, 0);
        depth = textureLoad(setDepth3, texel, 0);
    }
    output.color = color;
    output.fragDepth = depth;
    return output;
}
`,Pc=`
// [0, ${Z}) counts, [${Z}, ${2*Z}) offsets
@group(0) @binding(0) var<storage, read_write> buckets: array<u32>;

var<workgroup> partial: array<u32, ${Z}>;

@compute @workgroup_size(${Z})
fn main(@builtin(local_invocation_index) local: u32) {
    partial[local] = buckets[local];
    for (var stride = 1u; stride < ${Z}u; stride <<= 1u) {
        workgroupBarrier();
        let value = select(0u, partial[local - stride], local >= stride);
        workgroupBarrier();
        partial[local] += value;
    }
    // inclusive to exclusive
    buckets[${Z}u + local] = partial[local] - buckets[local];
}
`,Fc=`
@group(0) @binding(0) var<storage, read> counter: array<u32>;
@group(0) @binding(1) var<storage, read> cache: array<u32>;
@group(0) @binding(2) var<storage, read_write> buckets: array<atomic<u32>>;
@group(0) @binding(3) var<storage, read_write> ordered: array<u32>;

var<workgroup> wgCounts: array<atomic<u32>, ${Z}>;
var<workgroup> wgBase: array<u32, ${Z}>;

@compute @workgroup_size(${Z})
fn main(
    @builtin(workgroup_id) wg: vec3u,
    @builtin(num_workgroups) numWorkgroups: vec3u,
    @builtin(local_invocation_index) local: u32
) {
    // no early returns: the barriers need every thread
    atomicStore(&wgCounts[local], 0u);
    let slot = (wg.x + wg.y * numWorkgroups.x) * ${Z}u + local;
    let live = slot < counter[0];
    var key = 0u;
    var rank = 0u;
    workgroupBarrier();
    if (live) {
        key = cache[slot * ${uc}u + 3u] >> 24u;
        rank = atomicAdd(&wgCounts[key], 1u);
    }
    workgroupBarrier();
    let count = atomicLoad(&wgCounts[local]);
    if (count > 0u) {
        wgBase[local] = atomicAdd(&buckets[${Z}u + local], count);
    }
    workgroupBarrier();
    if (live) {
        ordered[wgBase[key] + rank] = slot;
    }
}
`,Ic=`
@group(0) @binding(0) var<storage, read> counter: array<u32>;
@group(0) @binding(1) var<storage, read> cache: array<u32>;
@group(0) @binding(2) var<storage, read_write> buckets: array<atomic<u32>>;
@group(0) @binding(3) var<storage, read_write> ordered: array<u32>;

var<workgroup> wgCounts: array<atomic<u32>, ${Z}>;
var<workgroup> wgBase: array<u32, ${Z}>;

@compute @workgroup_size(${Z})
fn main(
    @builtin(workgroup_id) wg: vec3u,
    @builtin(num_workgroups) numWorkgroups: vec3u,
    @builtin(local_invocation_index) local: u32
) {
    // no early returns: the barriers need every thread
    atomicStore(&wgCounts[local], 0u);
    let slot = (wg.x + wg.y * numWorkgroups.x) * ${Z}u + local;
    let live = slot < counter[0];
    // bit g: an entry in group g
    var groups = 0u;
    var keys = array<u32, ${hc}>();
    var ranks = array<u32, ${hc}>();
    workgroupBarrier();
    if (live) {
        let depthKey = ((cache[slot * ${uc}u + 3u] >> 24u) * ${gc}u) >> 8u;
        let word5 = cache[slot * ${uc}u + 5u];
        if ((word5 & ${_c}u) != 0u) {
            groups = 1u << 4u;
        } else {
            for (var s = 0u; s < 4u; s++) {
                groups |= ((word5 >> (16u + 4u * s)) & 1u) << s;
            }
        }
        for (var g = 0u; g < ${hc}u; g++) {
            if (((groups >> g) & 1u) != 0u) {
                keys[g] = g * ${gc}u + depthKey;
                ranks[g] = atomicAdd(&wgCounts[keys[g]], 1u);
            }
        }
    }
    workgroupBarrier();
    let count = atomicLoad(&wgCounts[local]);
    if (count > 0u) {
        wgBase[local] = atomicAdd(&buckets[${Z}u + local], count);
    }
    workgroupBarrier();
    if (live) {
        for (var g = 0u; g < ${hc}u; g++) {
            if (((groups >> g) & 1u) != 0u) {
                ordered[wgBase[keys[g]] + ranks[g]] = slot;
            }
        }
    }
}
`,Lc=128,Rc=.999999,zc=`
varying @interpolate(linear) gaussianUV: vec2f;
varying @interpolate(flat, either) packedColor: u32;
varying @interpolate(flat, either) packedAlpha: u32;
#ifdef SSE_JITTER
    // variant jitter, as floats so the fragment converts nothing: x the stratum's base
    // threshold, y the entry's key for the jitter pattern, z the opacity
    varying @interpolate(flat, either) jitterVary: vec4f;
#endif
`,Bc=`
attribute vertex_position: vec3f;

// width, height, 2 / width, 2 / height
uniform viewportSize: vec4f;
// clip z = a * viewDepth + b (x, y); z = 1 for an orthographic camera
uniform clipZParams: vec4f;
// set by the engine's forward renderer for the target being rendered
uniform projectionFlipY: f32;
// the fragment shader's alpha clip, which also bounds the quad
uniform sseAlphaClip: f32;

var<storage, read> splatCache: array<u32>;
var<storage, read> splatCount: array<u32>;
// cache slots in draw order (shaders/order.ts)
var<storage, read> orderedSlots: array<u32>;
#ifdef SSE_INTERLEAVED
    // variant coverage:interleaved: the draw group this draw renders (0-3 the pixel sets, 4 the
    // full target's small splats), its range of the ordered list, and the map from the full
    // target's clip x and y (over w) into the group's target
    uniform setIndex: u32;
    uniform setMap: vec4f;
    var<storage, read> setRanges: array<vec2u>;
#endif
#ifdef SSE_STEREO
    // variant stereo: one projection serves both eyes; the second draws each splat at its own
    // centre with its own quad (shaders/projector.ts), from the three words per cache slot that
    // follow the entries
    uniform stereoEye: u32;
    uniform stereoBase: u32;
#endif
#ifdef SSE_COVERAGE_SPLAT
    // x: the sub-strata a stratum splits into (variant jitter; 0: no jitter), y: the strata this
    // draw's thresholds come from, z: 1 / (strata * sub-strata), the width of a pixel's jitter,
    // w: the square's circumradius over the ellipse's (area matched, or containing it with jitter)
    uniform jitterParams: vec4f;
#endif

// screen-linear: the corners share one screen footprint whatever depth they carry
${zc}
// the splat's share of the coverage hash, once per vertex rather than per fragment
uniform frameSeed: u32;

fn hashU32(x: u32) -> u32 {
    var v = x;
    v ^= v >> 16u;
    v *= 0x7feb352du;
    v ^= v >> 15u;
    v *= 0x846ca68bu;
    v ^= v >> 16u;
    return v;
}


const discardPosition = vec4f(0.0, 0.0, 2.0, 1.0);

#ifdef SSE_COVERAGE_SPLAT
    // the radius, in units of the quad's half extent, where alpha = opacity * falloff(r^2) falls
    // to a threshold (the projector's radiusAt)
    fn radiusAt(threshold: f32, opacity: f32) -> f32 {
        let e4 = exp(-4.0);
        return sqrt(max(-log(threshold / opacity * (1.0 - e4) + e4) * 0.25, 0.0));
    }
#endif

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    #ifdef SSE_INTERLEAVED
        let range = setRanges[uniform.setIndex];
        let order = range.x + pcInstanceIndex * ${Lc}u + u32(vertex_position.z);
        if (order >= range.y) {
            output.position = discardPosition;
            return output;
        }
    #else
        let order = pcInstanceIndex * ${Lc}u + u32(vertex_position.z);
        // the indirect instance count rounds up to whole instances; the tail is discarded here
        if (order >= splatCount[0]) {
            output.position = discardPosition;
            return output;
        }
    #endif
    let base = orderedSlots[order] * ${uc}u;
    let maxRadius = min(1024.0, min(uniform.viewportSize.x, uniform.viewportSize.y));
    let ndcRange = vec2f(1.0) + vec2f(4.0 * maxRadius) / uniform.viewportSize.xy;
    var ndc = unpack2x16snorm(splatCache[base]) * ndcRange;
    let depth = bitcast<f32>(splatCache[base + 1u]);
    let ortho = uniform.clipZParams.z != 0.0;

    var axis1 = unpack2x16float(splatCache[base + 2u]);
    let word3 = splatCache[base + 3u];
    var len2 = unpack2x16float(word3).x;
    #ifdef SSE_STEREO
        if (uniform.stereoEye != 0u) {
            let stereoWord = uniform.stereoBase + orderedSlots[order] * 3u;
            ndc = unpack2x16snorm(splatCache[stereoWord]) * ndcRange;
            axis1 = unpack2x16float(splatCache[stereoWord + 1u]);
            len2 = unpack2x16float(splatCache[stereoWord + 2u]).x;
        }
    #endif
    let axis2 = len2 * normalize(vec2f(axis1.y, -axis1.x));

    #ifdef SSE_COVERAGE_SPLAT
        // Coverage other than pixel: the projector kept only the splats with pixels to keep this
        // frame and stored the full quad's axes; the square of the pixels this draw keeps is
        // sized here from its threshold, rebuilt from cache word 5 as the projector built it
        // (shaders/projector.ts): the splat's 15-bit draw, and a nibble per draw group holding
        // the stratum and sub-stratum of the jittered modes
        let word5 = splatCache[base + 5u];
        let opacityS = f32((word3 >> 16u) & 0xffu) / 255.0;
        let drawn = f32(word5 & 32767u) * (1.0 / 32767.0);
        #ifdef SSE_INTERLEAVED
            let group = uniform.setIndex;
            let fullGroup = group == 4u;
            let nibble = (word5 >> (16u + 4u * select(group, 0u, fullGroup))) & 0xfu;
            // the sets' thresholds are the four quarters from the draw; the full target's is the draw
            let plain = select(fract(drawn + f32(group) * 0.25), drawn, fullGroup);
        #else
            let nibble = (word5 >> 16u) & 0xfu;
            let plain = drawn;
        #endif
        let subs = uniform.jitterParams.x;
        // jittered: the base of the stratum (and sub-stratum) the nibble names; its index goes to
        // the fragment, which adds the pixel's own jitter within it
        let strataIndex = f32((nibble >> 1u) & 3u) * subs + f32(nibble >> 3u);
        let threshold = max(select(plain, strataIndex * uniform.jitterParams.z, subs > 0.0), uniform.sseAlphaClip);
        let polygonRadius = radiusAt(threshold, opacityS) * uniform.jitterParams.w;
        #ifdef SSE_POLYGON_ROTATE
            // without jitter the square is turned by a fresh angle every frame, so over frames
            // the kept region averages to the ellipse rather than to the square's corners
            let turn = f32(hashU32(order ^ uniform.frameSeed)) * (6.2831853 / 4294967296.0);
            let cs = vec2f(cos(turn), sin(turn));
            let unit = vec2f(
                vertex_position.x * cs.x - vertex_position.y * cs.y,
                vertex_position.x * cs.y + vertex_position.y * cs.x
            );
        #else
            let unit = vertex_position.xy;
        #endif
        let corner = unit * polygonRadius;
    #else
        // shrink the quad to where alpha falls below the clip, as the engine's clipCorner does:
        // the fragment shader discards everything outside it anyway, but still pays to shade it
        let opacity = f32((word3 >> 16u) & 0xffu) / 255.0;
        let corner = vertex_position.xy * min(1.0, sqrt(max(0.0, log(opacity / uniform.sseAlphaClip))) * 0.5);
    #endif
    let pixelOffset = corner.x * axis1 + corner.y * axis2;
    let w = select(depth, 1.0, ortho);
    let ndcCorner = ndc + pixelOffset * uniform.viewportSize.zw;
    // clip z clamped into range like the engine's splat shader, so splats beyond the far plane
    // still draw; just inside it, since the compose and the accumulation read depth 1 as empty
    let pos = vec4f(ndcCorner * w, clamp(uniform.clipZParams.x * depth + uniform.clipZParams.y, 0.0, w * ${Rc}), w);
    output.position = vec4f(pos.x, pos.y * uniform.projectionFlipY, pos.z, pos.w);
    #ifdef SSE_INTERLEAVED
        // into the set's own target, in framebuffer space: the full target's pixel (2i + x, 2j + y)
        // for set (x, y) is the set's pixel (i, j), so the interleave can copy texel for texel
        output.position = vec4f(
            uniform.setMap.x * output.position.x + uniform.setMap.y * w,
            uniform.setMap.z * output.position.y + uniform.setMap.w * w,
            output.position.z,
            w
        );
    #endif
    output.gaussianUV = corner;
    output.packedColor = splatCache[base + 4u];
    #ifdef SSE_JITTER
        // the stratum's base threshold for the fragment's test, and a per-entry key that rotates
        // its jitter pattern, so overlapping splats' jitters are independent
        let entryKey = hashU32(order ^ uniform.frameSeed);
        output.jitterVary = vec4f(strataIndex * uniform.jitterParams.z, f32(entryKey >> 8u) * (1.0 / 16777216.0), opacityS, 0.0);
        output.packedAlpha = word3 >> 16u;
    #else
        let seed = hashU32(((splatCache[base + 5u] + 1u) * 26699u) ^ uniform.frameSeed);
        output.packedAlpha = ((word3 >> 16u) & 0xffu) | (seed & 0xffffff00u);
    #endif
    return output;
}
`,Vc=`
${zc}

uniform sseAlphaClip: f32;
#ifdef SSE_JITTER
    // z: the width of a pixel's jitter, 1 / (strata * sub-strata) (see the vertex stage)
    uniform jitterParams: vec4f;
#endif

const EXP4 = exp(-4.0);
const INV_EXP4 = 1.0 / (1.0 - EXP4);

// the engine's falloff: zero at the quad edge, which sits at 2 sqrt(2) sigma
fn falloff(x: f32) -> f32 {
    return (exp(x * -4.0) - EXP4) * INV_EXP4;
}

@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;
    #ifdef SSE_COVERAGE_SPLAT
        #ifdef SSE_JITTER
            // Variant jitter: the square contains the stratum's ellipse, and the fragment keeps
            // itself where alpha exceeds the stratum's base plus its own jitter within the
            // stratum: interleaved gradient noise rotated by the entry's key, as the per-pixel
            // raster's. The test discards the square's corners too (alpha is negative past the
            // quad's edge), so the kept region is the exact ellipse with a dithered rim
            let alphaJ = falloff(dot(gaussianUV, gaussianUV)) * jitterVary.z;
            let ignJ = fract(52.9829189 * fract(dot(pcPosition.xy, vec2f(0.06711056, 0.00583715))));
            let thresholdJ = jitterVary.x + fract(ignJ + jitterVary.y) * uniform.jitterParams.z;
            if (alphaJ <= max(thresholdJ, uniform.sseAlphaClip)) {
                discard;
            }
        #endif
        // the square is the kept coverage, so every fragment is kept
        let bits = packedColor;
    #else
        let radius = dot(gaussianUV, gaussianUV);
        if (radius > 1.0) {
            discard;
        }
        let opacity = f32(packedAlpha & 0xffu) / 255.0;
        let alpha = falloff(radius) * opacity;
        if (alpha < uniform.sseAlphaClip) {
            discard;
        }

        // the coverage threshold: interleaved gradient noise (Jimenez 2014) rotated by the
        // splat's seed, float only, with no integer multiplies, which mobile gpus run at a
        // fraction of the float rate; the rotation changes every frame with the seed
        let ign = fract(52.9829189 * fract(dot(pcPosition.xy, vec2f(0.06711056, 0.00583715))));
        let rnd = fract(ign + f32(packedAlpha >> 8u) * (1.0 / 16777216.0));
        if (rnd >= alpha) {
            discard;
        }
        let bits = packedColor;
    #endif

    let color = vec3f(vec3u(bits, bits >> 10u, bits >> 20u) & vec3u(1023u)) * (f32(1u << (bits >> 30u)) / 1023.0);
    // opaque coverage: the compose reads alpha 1 as "a sample landed here"
    output.color = vec4f(color, 1.0);
    return output;
}
`,Hc=`
struct ReduceUniforms {
    width: u32,
    height: u32,
    blocksX: u32,
    blocksY: u32
}

@group(0) @binding(0) var prevDepth: texture_depth_2d;
@group(0) @binding(1) var<storage, read_write> blockMax: array<u32>;
@group(0) @binding(2) var<uniform> uniforms: ReduceUniforms;

var<workgroup> wgMax: atomic<u32>;

@compute @workgroup_size(8, 8)
fn main(
    @builtin(workgroup_id) wg: vec3u,
    @builtin(local_invocation_id) lid: vec3u,
    @builtin(local_invocation_index) li: u32
) {
    let pixel = wg.xy * 8u + lid.xy;
    // pixels off the texture count as far, so an edge block never culls
    var depth = 1.0;
    if (pixel.x < uniforms.width && pixel.y < uniforms.height) {
        depth = textureLoad(prevDepth, vec2i(pixel), 0);
    }
    atomicMax(&wgMax, bitcast<u32>(depth));
    workgroupBarrier();
    if (li == 0u) {
        blockMax[wg.y * uniforms.blocksX + wg.x] = atomicLoad(&wgMax);
    }
}
`,Uc=`
struct ReduceUniforms {
    blocksX1: u32,
    blocksY1: u32,
    blocksX2: u32,
    blocksY2: u32
}

// level 1, then level 2 from blocksX1 * blocksY1
@group(0) @binding(0) var<storage, read_write> grid: array<u32>;
@group(0) @binding(1) var<uniform> uniforms: ReduceUniforms;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
    let index = gid.x;
    if (index >= uniforms.blocksX2 * uniforms.blocksY2) {
        return;
    }
    let bx = index % uniforms.blocksX2;
    let by = index / uniforms.blocksX2;
    var farthest = 0u;
    for (var dy = 0u; dy < 4u; dy++) {
        for (var dx = 0u; dx < 4u; dx++) {
            let x = bx * 4u + dx;
            let y = by * 4u + dy;
            if (x < uniforms.blocksX1 && y < uniforms.blocksY1) {
                farthest = max(farthest, grid[y * uniforms.blocksX1 + x]);
            } else {
                farthest = max(farthest, bitcast<u32>(1.0));
            }
        }
    }
    grid[uniforms.blocksX1 * uniforms.blocksY1 + index] = farthest;
}
`,Wc=`
@group(0) @binding(0) var means_l: texture_2d<f32>;
@group(0) @binding(1) var means_u: texture_2d<f32>;
@group(0) @binding(2) var quats: texture_2d<f32>;
@group(0) @binding(3) var scales: texture_2d<f32>;
@group(0) @binding(4) var sh0: texture_2d<f32>;
@group(0) @binding(5) var sh_labels: texture_2d<f32>;
@group(0) @binding(6) var outGeom: texture_storage_2d<rgba32uint, write>;
@group(0) @binding(7) var outColor: texture_storage_2d<r32uint, write>;

fn bytesOf(v: vec4f) -> vec4u {
    return vec4u(v * 255.0 + 0.5);
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) id: vec3u) {
    let dims = textureDimensions(means_l);
    if (id.x >= dims.x || id.y >= dims.y) {
        return;
    }
    let p = vec2i(id.xy);
    let l = bytesOf(textureLoad(means_l, p, 0));
    let u = bytesOf(textureLoad(means_u, p, 0));
    let q = bytesOf(textureLoad(quats, p, 0));
    let s = bytesOf(textureLoad(scales, p, 0));
    let c = bytesOf(textureLoad(sh0, p, 0));
    let lab = bytesOf(textureLoad(sh_labels, p, 0));
    let geom = vec4u(
        (l.x | (u.x << 8u)) | ((l.y | (u.y << 8u)) << 16u),
        (l.z | (u.z << 8u)) | (q.x << 16u) | (q.y << 24u),
        q.z | (q.w << 8u) | (s.x << 16u) | (s.y << 24u),
        s.z | (c.w << 8u) | ((lab.x | (lab.y << 8u)) << 16u)
    );
    textureStore(outGeom, p, geom);
    textureStore(outColor, p, vec4u(c.x | (c.y << 8u) | (c.z << 16u), 0u, 0u, 0u));
}
`,Gc=`
struct DecodeUniforms {
    shRange: vec4f
}
@group(0) @binding(0) var<uniform> uniforms: DecodeUniforms;
@group(0) @binding(1) var sh_centroids: texture_2d<f32>;
@group(0) @binding(2) var sogCodebook: texture_2d<f32>;
@group(0) @binding(3) var outSH: texture_storage_2d<r32uint, write>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) id: vec3u) {
    let dims = textureDimensions(sh_centroids);
    if (id.x >= dims.x || id.y >= dims.y) {
        return;
    }
    let p = vec2i(id.xy);
    let idx = vec3i(textureLoad(sh_centroids, p, 0).xyz * 255.0 + 0.5);
    let value = vec3f(
        textureLoad(sogCodebook, vec2i(idx.x, 0), 0).b,
        textureLoad(sogCodebook, vec2i(idx.y, 0), 0).b,
        textureLoad(sogCodebook, vec2i(idx.z, 0), 0).b
    );
    // x and z take 11 bits, y 10, as the engine's own packing
    let n = clamp((value - uniforms.shRange.x) / uniforms.shRange.y, vec3f(0.0), vec3f(1.0));
    let q = vec3u(n * vec3f(2047.0, 1023.0, 2047.0) + 0.5);
    textureStore(outSH, p, vec4u((q.x << 21u) | (q.y << 11u) | q.z, 0u, 0u, 0u));
}
`,Kc={means_l:`byteOf(g.x, 0u), byteOf(g.x, 2u), byteOf(g.y, 0u), 0u`,means_u:`byteOf(g.x, 1u), byteOf(g.x, 3u), byteOf(g.y, 1u), 0u`,quats:`byteOf(g.y, 2u), byteOf(g.y, 3u), byteOf(g.z, 0u), byteOf(g.z, 1u)`,scales:`byteOf(g.z, 2u), byteOf(g.z, 3u), byteOf(g.w, 0u), 0u`,sh0:`byteOf(c, 0u), byteOf(c, 1u), byteOf(c, 2u), byteOf(g.w, 1u)`,sh_labels:`byteOf(g.w, 2u), byteOf(g.w, 3u), 0u, 0u`},qc=e=>`
@group(0) @binding(0) var packedGeom: texture_2d<u32>;
@group(0) @binding(1) var packedColor: texture_2d<u32>;
${e.map((e,t)=>`@group(0) @binding(${t+2}) var ${e}: texture_storage_2d<rgba8unorm, write>;`).join(`
`)}

// byte i of a word
fn byteOf(v: u32, i: u32) -> u32 {
    return (v >> (i * 8u)) & 255u;
}

fn toUnorm(b: vec4u) -> vec4f {
    return vec4f(b) / 255.0;
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) id: vec3u) {
    let dims = textureDimensions(packedGeom);
    if (id.x >= dims.x || id.y >= dims.y) {
        return;
    }
    let p = vec2i(id.xy);
    let g = textureLoad(packedGeom, p, 0);
    let c = textureLoad(packedColor, p, 0).r;
${e.map(e=>`    textureStore(${e}, p, toUnorm(vec4u(${Kc[e]})));`).join(`
`)}
}
`,Jc=`
@group(0) @binding(0) var decodedSH: texture_2d<u32>;
@group(0) @binding(1) var levelIndices: texture_2d<u32>;
@group(0) @binding(2) var sh_centroids: texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) id: vec3u) {
    let dims = textureDimensions(decodedSH);
    if (id.x >= dims.x || id.y >= dims.y) {
        return;
    }
    let p = vec2i(id.xy);
    let v = textureLoad(decodedSH, p, 0).r;
    let x = textureLoad(levelIndices, vec2i(i32(v >> 21u), 0), 0).r;
    let y = textureLoad(levelIndices, vec2i(i32((v >> 11u) & 1023u), 1), 0).r;
    let z = textureLoad(levelIndices, vec2i(i32(v & 2047u), 0), 0).r;
    textureStore(sh_centroids, p, vec4f(vec3f(f32(x), f32(y), f32(z)) / 255.0, 0.0));
}
`,Yc=(e,t)=>`
#include "halfTypesCS"
#include "gsplatEvalSHVS"
@group(0) @binding(${e}) var packedGeom: texture_2d<u32>;
@group(0) @binding(${e+1}) var packedColor: texture_2d<u32>;
${t>0?`@group(0) @binding(${e+2}) var sh_centroids: texture_2d<u32>;`:``}
@group(0) @binding(${e+(t>0?3:2)}) var sogCodebook: texture_2d<f32>;
uniform means_mins: vec3f;
uniform means_maxs: vec3f;
${t>0?`uniform shRange: vec4f;`:``}

const SH_C0: f32 = 0.28209479177387814;
const PACK_NORM: f32 = sqrt(2.0);
// the file's coefficients per palette entry: the stride of the centroid texture
const SH_STRIDE: i32 = ${[0,3,8,15][t]};

fn lutScales(b: i32) -> f32 { return textureLoad(sogCodebook, vec2i(b, 0), 0).r; }
fn lutSh0(b: i32) -> f32 { return textureLoad(sogCodebook, vec2i(b, 0), 0).g; }

var<private> packedG: vec4u;
var<private> srcWorldCenter: vec3f;

fn quatMulF(a: vec4f, b: vec4f) -> vec4f {
    return vec4f(a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz), a.w * b.w - dot(a.xyz, b.xyz));
}

// v rotated by the inverse of q (x, y, z, w)
fn quatRotateInvF(q: vec4f, v: vec3f) -> vec3f {
    let u = -q.xyz;
    return v + 2.0 * cross(u, cross(u, v) + q.w * v);
}

// the one read every active splat makes
fn srcCenter() -> vec3f {
    packedG = textureLoad(packedGeom, splat.uv, 0);
    let n = vec3f(f32(packedG.x & 0xffffu), f32(packedG.x >> 16u), f32(packedG.y & 0xffffu)) / 65535.0;
    let v = mix(uniform.means_mins, uniform.means_maxs, n);
    srcWorldCenter = (uniforms.model * vec4f(sign(v) * (exp(abs(v)) - 1.0), 1.0)).xyz;
    return srcWorldCenter;
}

fn srcOpacity() -> f32 {
    return f32((packedG.w >> 8u) & 0xffu) / 255.0;
}

// the file stores three components and the omitted axis; the engine's getRotation
fn srcRotation() -> vec4f {
    let qb = vec4u((packedG.y >> 16u) & 0xffu, packedG.y >> 24u, packedG.z & 0xffu, (packedG.z >> 8u) & 0xffu);
    let abc = (vec3f(qb.xyz) / 255.0 - 0.5) * PACK_NORM;
    let d = sqrt(max(0.0, 1.0 - dot(abc, abc)));
    let qmode = qb.w - 252u;
    var quat: vec4f;
    if (qmode == 0u) {
        quat = vec4f(d, abc);
    } else if (qmode == 1u) {
        quat = vec4f(abc.x, d, abc.y, abc.z);
    } else if (qmode == 2u) {
        quat = vec4f(abc.x, abc.y, d, abc.z);
    } else {
        quat = vec4f(abc.x, abc.y, abc.z, d);
    }
    // the format's order is (w, x, y, z); world = model * source
    let q = quatMulF(uniforms.modelRotation, quat.yzwx);
    return q.wxyz;
}

fn srcScale() -> vec3f {
    let i = vec3i(i32((packedG.z >> 16u) & 0xffu), i32(packedG.z >> 24u), i32(packedG.w & 0xffu));
    return uniforms.modelScale.xyz * exp(vec3f(lutScales(i.x), lutScales(i.y), lutScales(i.z)));
}

#if SH_BANDS > 0
// a coefficient triple of the decoded palette: 11/11/10 bits over the file's codebook range
fn readSHTexel(u: i32, v: i32) -> half3 {
    let bits = textureLoad(sh_centroids, vec2i(u, v), 0).x;
    let q = vec3f(vec3u(bits >> 21u, (bits >> 11u) & 0x3ffu, bits & 0x7ffu)) / vec3f(2047.0, 1023.0, 2047.0);
    return half3(uniform.shRange.x + q * uniform.shRange.y);
}
#endif

// survivors only: the sh0 texel, and the sh evaluation for this camera
fn srcColor() -> vec3f {
    let c = textureLoad(packedColor, splat.uv, 0).x;
    let i = vec3i(i32(c & 0xffu), i32((c >> 8u) & 0xffu), i32((c >> 16u) & 0xffu));
    var color = vec3f(0.5) + vec3f(lutSh0(i.x), lutSh0(i.y), lutSh0(i.z)) * SH_C0;
    #if SH_BANDS > 0
        let view = uniforms.view;
        let orthoDir = vec3f(0.0, 0.0, -1.0) * mat3x3f(view[0].xyz, view[1].xyz, view[2].xyz);
        let viewDir = select(srcWorldCenter - uniforms.cameraPosition.xyz, orthoDir, uniforms.isOrtho != 0u);
        let dir = normalize(quatRotateInvF(uniforms.modelRotation, viewDir));
        let n = i32(packedG.w >> 16u);
        let u = (n % 64) * SH_STRIDE;
        let v = n / 64;
        var sh: array<half3, SH_COEFFS>;
        sh[0] = readSHTexel(u, v);
        sh[1] = readSHTexel(u + 1, v);
        sh[2] = readSHTexel(u + 2, v);
        #if SH_BANDS > 1
            sh[3] = readSHTexel(u + 3, v);
            sh[4] = readSHTexel(u + 4, v);
            sh[5] = readSHTexel(u + 5, v);
            sh[6] = readSHTexel(u + 6, v);
            sh[7] = readSHTexel(u + 7, v);
        #endif
        #if SH_BANDS > 2
            sh[8] = readSHTexel(u + 8, v);
            sh[9] = readSHTexel(u + 9, v);
            sh[10] = readSHTexel(u + 10, v);
            sh[11] = readSHTexel(u + 11, v);
            sh[12] = readSHTexel(u + 12, v);
            sh[13] = readSHTexel(u + 13, v);
            sh[14] = readSHTexel(u + 14, v);
        #endif
        color += vec3f(evalSH(&sh, dir));
    #endif
    return color;
}
`,Xc=new W,Zc=new tt,Qc=[[`means_l`,`means_u`,`quats`,`scales`],[`sh0`]],$c=e=>e.gsplatData?.meta?.shN?.codebook??[0,1],el=(e,t)=>{let n=new Uint8Array(4096);return[2047,1023].forEach((r,i)=>{let a=e.map((e,n)=>({level:(e-t[0])/t[1]*r,index:n})).sort((e,t)=>e.level-t.level),o=0;for(let e=0;e<=r;e++){for(;o+1<a.length&&Math.abs(a[o+1].level-e)<=Math.abs(a[o].level-e);)o++;n[i*2048+e]=a[o].index}}),n},tl=class{kind=`direct`;device;resource=null;set=null;constants=new Map;packed=new Map;pendingRelease=[];repack=null;decodedSH=new Map;decodeSHShader=null;ranges=new Map;unpackComputes=new Map;encodeSH=null;patched=null;constructor(e){this.device=e}update(e,t){this.resource=e.files[0]?.resource??this.resource,this.set=e,this.constants.clear();for(let t of e.files){let e=t.modelMatrix;e.getScale(Xc),Zc.setFromMat4(e),Zc.w<0&&Zc.mulScalar(-1),this.constants.set(t.fileIndex,{rotation:[Zc.x,Zc.y,Zc.z,Zc.w],scale:[Xc.x,Xc.y,Xc.z,0]})}if(this.patchWorkBuffer(t.world.workBuffer),this.evict(),this.packedActive())for(let t of e.files)this.prepare(t.resource)}prepare(e){this.packed.has(e)||(this.ensurePacked(e),this.decodedActive()&&this.ensureDecodedSH(e),this.pendingRelease.push(e))}evict(){let e=e=>!!e.streams.textures.get(`sogCodebook`)?.device;for(let[t,{geom:n,color:r}]of this.packed)e(t)||(n.destroy(),r.destroy(),this.packed.delete(t));for(let[t,{texture:n,compute:r}]of this.decodedSH)e(t)||(n.destroy(),r.destroy(),this.decodedSH.delete(t));for(let t of this.ranges.keys())e(t)||this.ranges.delete(t)}frameEnd(){this.evict();for(let e of this.pendingRelease){e.releaseTextureSources?.();let{textures:t}=e.streams;for(let e of[`means_l`,`means_u`,`quats`,`scales`,`sh0`,`sh_labels`,`sh_centroids`])t.get(e)?.destroy()}this.pendingRelease.length=0}decodedActive(){return this.packedActive()&&this.hasSH()}codebookRange(e){let t=this.ranges.get(e);if(!t){let n=$c(e),r=1/0,i=-1/0;for(let e of n)r=Math.min(r,e),i=Math.max(i,e);t=[r,Math.max(i-r,1e-6),0,0],this.ranges.set(e,t)}return t}ensureDecodedSH(e){if(this.decodedSH.has(e))return;let{device:t}=this,n=e.streams.textures.get(`sh_centroids`),i=new H(t,{name:`sse-splat-sh-decoded`,width:n.width,height:n.height,format:37,mipmaps:!1,storage:!0,minFilter:0,magFilter:0,addressU:1,addressV:1});this.decodeSHShader||=new r(t,{name:`sse-splat-decode-sh`,shaderLanguage:K,cshader:Gc,computeUniformBufferFormats:{uniforms:new je(t,[new B(`shRange`,5)])},computeBindGroupFormat:new Fe(t,[new be(`uniforms`,4),new nt(`sh_centroids`,4,void 0,0,!1),new nt(`sogCodebook`,4,void 0,1,!1),new xe(`outSH`,37,`2d`)])});let a=new ce(t,this.decodeSHShader,`sse-splat-decode-sh`);a.setParameter(`sh_centroids`,n),a.setParameter(`sogCodebook`,e.streams.textures.get(`sogCodebook`)),a.setParameter(`outSH`,i),a.setParameter(`shRange`,this.codebookRange(e)),a.setupDispatch(Math.ceil(n.width/16),Math.ceil(n.height/16),1),t.computeDispatch([a],`sse-splat-decode-sh`),this.decodedSH.set(e,{texture:i,compute:a})}packedActive(){let e=this.resource?.streams.textures;return!!e&&e.has(`sogCodebook`)}hasSH(){let e=this.resource?.streams.textures;return!!e&&e.has(`sh_labels`)&&e.has(`sh_centroids`)}ensurePacked(e){if(this.packed.has(e))return;let{device:t}=this,{x:n,y:i}=e.textureDimensions,a={width:n,height:i,mipmaps:!1,storage:!0,minFilter:0,magFilter:0,addressU:1,addressV:1},o=new H(t,{...a,name:`sse-splat-packed-geom`,format:49}),s=new H(t,{...a,name:`sse-splat-packed-color`,format:37});if(!this.repack){let e=[`means_l`,`means_u`,`quats`,`scales`,`sh0`,`sh_labels`];this.repack=new ce(t,new r(t,{name:`sse-splat-repack`,shaderLanguage:K,cshader:Wc,computeBindGroupFormat:new Fe(t,[...e.map(e=>new nt(e,4,void 0,0,!1)),new xe(`outGeom`,49,`2d`),new xe(`outColor`,37,`2d`)])}),`sse-splat-repack`)}let c=this.repack;for(let t of[`means_l`,`means_u`,`quats`,`scales`,`sh0`])c.setParameter(t,e.streams.textures.get(t));let l=e.streams.textures;c.setParameter(`sh_labels`,l.get(`sh_labels`)??l.get(`sh0`)),c.setParameter(`outGeom`,o),c.setParameter(`outColor`,s),c.setupDispatch(Math.ceil(n/16),Math.ceil(i/16),1),t.computeDispatch([c],`sse-splat-repack`),this.packed.set(e,{geom:o,color:s})}suspend(){this.restoreWorkBuffer(),this.restoreFiles()}restoreFiles(){this.evict();for(let e of this.packed.keys())this.pendingRelease.includes(e)||this.restoreTextures(e);this.pendingRelease.length=0;for(let{geom:e,color:t}of this.packed.values())e.destroy(),t.destroy();this.packed.clear();for(let{texture:e,compute:t}of this.decodedSH.values())e.destroy(),t.destroy();this.decodedSH.clear()}restoreTextures(e){let{device:t}=this,n=e.streams.textures,r=new Map,i=e=>{let i=n.get(e),a=new H(t,{name:i.name,width:i.width,height:i.height,format:7,mipmaps:!1,storage:!0,minFilter:i.minFilter,magFilter:i.magFilter,addressU:i.addressU,addressV:i.addressV});return r.set(e,a),a},a=n.has(`sh_labels`),{geom:o,color:s}=this.packed.get(e);for(let e of Qc){let n=a&&e.includes(`sh0`)?[...e,`sh_labels`]:e,r=this.unpackCompute(n);r.setParameter(`packedGeom`,o),r.setParameter(`packedColor`,s);for(let e of n)r.setParameter(e,i(e));r.setupDispatch(Math.ceil(o.width/16),Math.ceil(o.height/16),1),t.computeDispatch([r],`sse-splat-unpack`)}let c=this.decodedSH.get(e)?.texture;if(c){let n=new H(t,{name:`sse-splat-sh-levels`,width:2048,height:2,format:33,mipmaps:!1,minFilter:0,magFilter:0,addressU:1,addressV:1,levels:[el($c(e),this.codebookRange(e))]}),r=this.encodeSHCompute();r.setParameter(`decodedSH`,c),r.setParameter(`levelIndices`,n),r.setParameter(`sh_centroids`,i(`sh_centroids`)),r.setupDispatch(Math.ceil(c.width/16),Math.ceil(c.height/16),1),t.computeDispatch([r],`sse-splat-encode-sh`),n.destroy()}for(let[t,i]of r){n.set(t,i),Reflect.set(e.gsplatData,t,i);for(let{material:n}of e.workBufferRenderInfos.values())n.setParameter(t,i)}}unpackCompute(e){let t=e.join(`,`),n=this.unpackComputes.get(t);if(!n){let{device:i}=this,a=`sse-splat-unpack-${t}`;n=new ce(i,new r(i,{name:a,shaderLanguage:K,cshader:qc(e),computeBindGroupFormat:new Fe(i,[new nt(`packedGeom`,4,void 0,4,!1),new nt(`packedColor`,4,void 0,4,!1),...e.map(e=>new xe(e,7,`2d`))])}),a),this.unpackComputes.set(t,n)}return n}encodeSHCompute(){if(!this.encodeSH){let{device:e}=this;this.encodeSH=new ce(e,new r(e,{name:`sse-splat-encode-sh`,shaderLanguage:K,cshader:Jc,computeBindGroupFormat:new Fe(e,[new nt(`decodedSH`,4,void 0,4,!1),new nt(`levelIndices`,4,void 0,4,!1),new xe(`sh_centroids`,7,`2d`)])}),`sse-splat-encode-sh`)}return this.encodeSH}patchWorkBuffer(e){if(this.patched?.workBuffer===e)return;this.restoreWorkBuffer();let{render:t,renderColor:n,resize:r}=e;this.patched={workBuffer:e,render:t,renderColor:n,resize:r};let i=e.textureSize;i>1&&(r.call(e,1),e.orderBuffer.destroy(),e.orderBuffer=new A(e.device,4,8));let a=()=>void 0;e.render=a,e.renderColor=a,e.resize=e=>{i=e},Object.defineProperty(e,"textureSize",{configurable:!0,get:()=>i})}restoreWorkBuffer(){if(!this.patched)return;let{workBuffer:e,render:t,renderColor:n,resize:r}=this.patched;e.render=t,e.renderColor=n,e.resize=r,Reflect.deleteProperty(e,`textureSize`),this.patched=null}readChunk(e){if(this.packedActive())return Yc(e,this.fileBands());let t=this.require().format;return`
#include "halfTypesCS"
#include "gsplatEvalSHVS"
${t.getComputeInputDeclarations(e).replace(/texture_2d<uff>/g,`texture_2d<f32>`)}
${t.getReadCode()}

var<private> srcWorldCenter: vec3f;
var<private> srcColorCache: vec4f;

fn quatMulF(a: vec4f, b: vec4f) -> vec4f {
    return vec4f(a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz), a.w * b.w - dot(a.xyz, b.xyz));
}

// v rotated by the inverse of q (x, y, z, w)
fn quatRotateInvF(q: vec4f, v: vec3f) -> vec3f {
    let u = -q.xyz;
    return v + 2.0 * cross(u, cross(u, v) + q.w * v);
}

fn srcCenter() -> vec3f {
    srcWorldCenter = (uniforms.model * vec4f(getCenter(), 1.0)).xyz;
    return srcWorldCenter;
}

fn srcOpacity() -> f32 {
    srcColorCache = getColor();
    return srcColorCache.a;
}

// the format returns (w, x, y, z); world = model * source
fn srcRotation() -> vec4f {
    let q = quatMulF(uniforms.modelRotation, getRotation().yzwx);
    return q.wxyz;
}

fn srcScale() -> vec3f {
    return uniforms.modelScale.xyz * getScale();
}

fn srcColor() -> vec3f {
    var color = srcColorCache.rgb;
    #if SH_BANDS > 0
        // the view direction in the file's space; orthographic rays all run along the camera forward
        let view = uniforms.view;
        let orthoDir = vec3f(0.0, 0.0, -1.0) * mat3x3f(view[0].xyz, view[1].xyz, view[2].xyz);
        let viewDir = select(srcWorldCenter - uniforms.cameraPosition.xyz, orthoDir, uniforms.isOrtho != 0u);
        let dir = normalize(quatRotateInvF(uniforms.modelRotation, viewDir));
        var sh: array<half3, SH_COEFFS>;
        var shScale: f32;
        readSHData(&sh, &shScale);
        color += vec3f(evalSH(&sh, dir) * half(shScale));
    #endif
    return color;
}
`}bindFormats(){if(this.packedActive())return[new nt(`packedGeom`,4,void 0,4,!1),new nt(`packedColor`,4,void 0,4,!1),...this.hasSH()?[new nt(`sh_centroids`,4,void 0,4,!1)]:[],new nt(`sogCodebook`,4,void 0,1,!1)];let e=this.require().format,t=e.getComputeBindFormats();for(let n of t)e.streams.find(e=>e.name===n.name)?.format===14&&(n.sampleType=1);return t}shaderIncludes(){return new Map(Y.get(this.device,K))}shaderDefines(){let e=new Map;return this.require().configureMaterialDefines(e),this.packedActive()&&e.set(`SSE_PACKED_SOURCE`,`1`),this.decodedActive()&&e.set(`SSE_SH_DECODED`,`1`),e}fileBands(){let e=new Map;return this.require().configureMaterialDefines(e),Number(e.get(`SH_BANDS`)??0)}chunkBase(e){return e.sourceBase}dispatchPlan(e){let t=[],n=0,r=this.resource?.format.hash;for(let i of e.files){let e=0;for(let t of i.nodes)e+=Math.ceil(t.count/256);e>0&&i.resource.format.hash===r&&t.push({fileIndex:i.fileIndex,chunkBase:n,chunkCount:e}),n+=e}return t}bind(e,t,n){let r=n.files[t.fileIndex],{resource:i}=r;if(this.packedActive()){this.prepare(i);let t=this.packed.get(i);e.setParameter(`packedGeom`,t.geom),e.setParameter(`packedColor`,t.color),this.decodedActive()&&(e.setParameter(`sh_centroids`,this.decodedSH.get(i).texture),e.setParameter(`shRange`,this.codebookRange(i))),e.setParameter(`sogCodebook`,i.streams.textures.get(`sogCodebook`))}else for(let[t,n]of i.streams.textures)e.setParameter(t,n);for(let[t,n]of i.parameters)e.setParameter(t,n);let a=this.constants.get(r.fileIndex);e.setParameter(`model`,r.modelMatrix.data),e.setParameter(`modelRotation`,a.rotation),e.setParameter(`modelScale`,a.scale)}textureSize(e){return this.set?.files[e.fileIndex].resource.textureDimensions.x??0}gpuBytes(){let e=0;for(let{geom:t,color:n}of this.packed.values())e+=t.gpuSize+n.gpuSize;for(let{texture:t}of this.decodedSH.values())e+=t.gpuSize;return e}shaderKey(){let e=this.resource;if(!e)return`direct:`;let t=this.shaderDefines();return`direct:${e.format.hash}:${[...t].map(([e,t])=>`${e}=${t}`).join(`,`)}`}destroy(){this.restoreWorkBuffer(),this.pendingRelease.length=0;for(let{geom:e,color:t}of this.packed.values())e.destroy(),t.destroy();this.packed.clear(),this.repack?.shader.destroy(),this.repack?.destroy(),this.repack=null;for(let e of[...this.unpackComputes.values(),this.encodeSH])e?.shader.destroy(),e?.destroy();this.unpackComputes.clear(),this.encodeSH=null;for(let{texture:e,compute:t}of this.decodedSH.values())e.destroy(),t.destroy();this.decodedSH.clear(),this.ranges.clear(),this.decodeSHShader?.destroy(),this.decodeSHShader=null,this.resource=null,this.set=null,this.constants.clear()}require(){if(!this.resource)throw Error(`DirectSplatSource: update() has not run`);return this.resource}},nl=class{kind=`workbuffer`;workBuffer=null;update(e,t){this.workBuffer=t.world.workBuffer}suspend(){}frameEnd(){}readChunk(e){let t=this.require().format;return`
${t.getComputeInputDeclarations(e)}
${t.getReadCode()}
fn srcCenter() -> vec3f { return getCenter(); }
fn srcOpacity() -> f32 { return getOpacity(); }
fn srcRotation() -> vec4f { return getRotation(); }
fn srcScale() -> vec3f { return getScale(); }
fn srcColor() -> vec3f { return getColor(); }
`}bindFormats(){return this.require().format.getComputeBindFormats()}shaderIncludes(){}shaderDefines(){}chunkBase(e){return e.slotBase}dispatchPlan(e,t){return[{fileIndex:-1,chunkBase:0,chunkCount:t}]}bind(e){let t=this.require();for(let n of t.format.streams)e.setParameter(n.name,t.getTexture(n.name))}textureSize(){return this.require().textureSize}gpuBytes(){return 0}shaderKey(){let e=this.workBuffer;return e?`wb:${e.format.streams.map(e=>e.name).join(`,`)}`:`wb:`}destroy(){this.workBuffer=null}require(){if(!this.workBuffer)throw Error(`WorkBufferSplatSource: update() has not run`);return this.workBuffer}},rl=1,il=`
// the texture's size, and its middle column and row
struct Params { size: vec2u, mid: vec2u }
@group(0) @binding(0) var<uniform> params: Params;
// the logical ndc x of each column's centre along the middle row, then the ndc y of each row's
// centre along the middle column
@group(0) @binding(1) var<storage, read_write> map: array<f32>;
// the last column and row a fragment landed in
@group(0) @binding(2) var<storage, read_write> extent: array<atomic<u32>, 2>;

struct Varyings {
    @builtin(position) position: vec4f,
    @location(0) ndc: vec2f
}

@vertex
fn vertexMain(@builtin(vertex_index) index: u32) -> Varyings {
    var corners = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
    var out: Varyings;
    out.position = vec4f(corners[index], 0.0, 1.0);
    out.ndc = corners[index];
    return out;
}

@fragment
fn fragmentMain(input: Varyings) -> @location(0) vec4f {
    let texel = vec2u(input.position.xy);
    if (texel.y == params.mid.y && texel.x < params.size.x) {
        map[texel.x] = input.ndc.x;
        atomicMax(&extent[0], texel.x);
    }
    if (texel.x == params.mid.x && texel.y < params.size.y) {
        map[params.size.x + texel.y] = input.ndc.y;
        atomicMax(&extent[1], texel.y);
    }
    return vec4f(0.0);
}
`,al=e=>e.viewport.width>e.colorTexture.width||e.viewport.height>e.colorTexture.height,ol=async(e,t)=>{let n=e.createShaderModule({code:il}),r=e.createCommandEncoder(),i=t.map(t=>{let{width:i,height:a}=t.colorTexture,o=e.createRenderPipeline({layout:`auto`,vertex:{module:n,entryPoint:`vertexMain`},fragment:{module:n,entryPoint:`fragmentMain`,targets:[{format:t.viewFormat,writeMask:0}]},primitive:{topology:`triangle-list`}}),s=e.createBuffer({size:16,usage:72});e.queue.writeBuffer(s,0,new Uint32Array([i,a,i>>1,a>>1]));let c=(i+a)*4,l=e.createBuffer({size:c,usage:132}),u=e.createBuffer({size:8,usage:132}),d=e.createBuffer({size:c,usage:9}),f=e.createBuffer({size:8,usage:9}),p=e.createBindGroup({layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:u}}]}),m=r.beginRenderPass({colorAttachments:[{view:t.colorTexture.createView(t.viewDescriptor??void 0),loadOp:`load`,storeOp:`store`}]}),{viewport:h}=t;return m.setPipeline(o),m.setViewport(h.x,h.y,h.width,h.height,0,1),m.setBindGroup(0,p),m.draw(3),m.end(),r.copyBufferToBuffer(l,0,d,0,c),r.copyBufferToBuffer(u,0,f,0,8),{width:i,height:a,buffers:[s,l,u,d,f],readMap:d,readExtent:f}});e.queue.submit([r.finish()]);try{return await Promise.all(i.map(async({width:e,readMap:t,readExtent:n})=>{await Promise.all([t.mapAsync(rl),n.mapAsync(rl)]);let r=new Float32Array(t.getMappedRange().slice(0)),[i,a]=new Uint32Array(n.getMappedRange().slice(0));t.unmap(),n.unmap();let o={width:i+1,height:a+1,columns:r.slice(0,i+1),rows:r.slice(e,e+a+1)};for(let e=1;e<o.width;e++)if(!(o.columns[e]>o.columns[e-1]))return null;for(let e=1;e<o.height;e++)if(!(o.rows[e]<o.rows[e-1]))return null;return o.width>1&&o.height>1?o:null}))}finally{for(let e of i)for(let t of e.buffers)t.destroy()}},sl=()=>({compose:`blend`,cull:`auto`,contribution:0,coverage:`pixel`,jitter:0,strata:4,interleaveArea:0,taa:`on`,taaMax:256,taaMoveMax:16,taaClip:1.25,taaReproj:`sample`,taaMotion:4,taaParallax:`on`,taaSharp:16,taaHistory:`auto`,taaSharpen:0,taaDebug:0,warp:`auto`,stereo:`shared`,units:`engine`}),cl=e=>Math.min(Ec,Math.max(1,Math.round(e))),ll=e=>{let t=sl();for(let n of(e??``).split(`,`)){let[e,r]=n.split(`:`).map(e=>e.trim());e&&r!==void 0&&(e===`compose`&&(r===`blend`||r===`depth`)&&(t.compose=r),e===`cull`&&(r===`off`||r===`l1`||r===`l2`||r===`auto`)&&(t.cull=r),e===`contribution`&&Number.isFinite(Number(r))&&(t.contribution=Math.max(0,Number(r))),e===`coverage`&&(r===`pixel`||r===`splat`||r===`interleaved`)&&(t.coverage=r),e===`jitter`&&[`0`,`1`,`2`].includes(r)&&(t.jitter=Number(r)),e===`strata`&&[`1`,`2`,`4`].includes(r)&&(t.strata=Number(r)),e===`interleaveArea`&&Number.isFinite(Number(r))&&(t.interleaveArea=Math.max(0,Number(r))),e===`taa`&&(r===`on`||r===`off`)&&(t.taa=r),e===`taaMax`&&Number.isFinite(Number(r))&&(t.taaMax=cl(Number(r))),e===`taaMoveMax`&&Number.isFinite(Number(r))&&(t.taaMoveMax=cl(Number(r))),e===`taaClip`&&Number.isFinite(Number(r))&&(t.taaClip=Math.max(0,Number(r))),e===`taaReproj`&&(r===`sample`||r===`history`)&&(t.taaReproj=r),e===`taaMotion`&&Number.isFinite(Number(r))&&(t.taaMotion=Math.max(0,Number(r))),e===`taaParallax`&&(r===`on`||r===`off`)&&(t.taaParallax=r),e===`taaSharp`&&Number.isFinite(Number(r))&&(t.taaSharp=Math.max(0,Number(r))),e===`taaHistory`&&(r===`auto`||r===`fixed`||r===`half`)&&(t.taaHistory=r),e===`taaSharpen`&&Number(r)>=0&&(t.taaSharpen=Number(r)),e===`taaDebug`&&Number.isFinite(Number(r))&&(t.taaDebug=Number(r)),e===`warp`&&(r===`auto`||r===`off`)&&(t.warp=r),e===`warp`&&Number(r)>1&&(t.warp=Number(r)),e===`stereo`&&(r===`shared`||r===`separate`)&&(t.stereo=r),e===`units`&&(r===`px`||r===`engine`)&&(t.units=r))}return t},ul={pixel:``,mobile:`coverage:interleaved,jitter:2,interleaveArea:256,taaClip:0`,sol:`coverage:splat`},dl=Object.keys(ul),fl=`taaMoveMax:64,taaMotion:1`,pl=Math.cos(1*Math.PI/180),ml=e=>{let t=e[0].viewOffMat.data,n=e[1].viewOffMat.data;return t[2]*n[2]+t[6]*n[6]+t[10]*n[10]>=pl},hl=class extends me{forward;camera;instances;constructor(e,t,n,r,i=`sse-splat-raster`){super(e),this.forward=t,this.camera=n,this.instances=r,this.name=i}execute(){this.forward.renderForwardLayer(this.camera(),this.renderTarget,null,void 0,0,{meshInstances:this.instances})}},gl=class extends Ee{bind;constructor(e,t){super(e),this.bind=t,this.name=`sse-splat-bind`}execute(){this.bind()}},_l=(e,t)=>{let n=new Float32Array(t*4*3),r=new Uint32Array(t*6);for(let e=0;e<t;++e){n.set([-1,-1,e,1,-1,e,1,1,e,-1,1,e],e*12);let t=e*4;r.set([t,t+1,t+2,t,t+2,t+3],e*6)}let i=new re(e);return i.setPositions(n,3),i.setIndices(r),i.update(4),i},vl=(e,t)=>{let n=pc,r=new Float32Array(t*n*3),i=new Uint32Array(t*2*3);for(let e=0;e<t;++e){for(let t=0;t<n;++t){let i=2*Math.PI*t/n;r.set([Math.cos(i),Math.sin(i),e],(e*n+t)*3)}let t=e*n;for(let n=1;n<3;++n)i.set([t,t+n,t+n+1],(e*2+n-1)*3)}let a=new re(e);return a.setPositions(r,3),a.setIndices(i),a.update(4),a},yl=e=>{let t=new re(e);return t.setPositions(new Float32Array([-1,-1,1,-1,1,1,-1,1]),2),t.setIndices(new Uint16Array([0,1,2,0,2,3])),t.update(4),t},bl=new Qe,xl=new W,Sl=new J,Cl=(e,t,n,r)=>new H(e,{name:t,width:4,height:4,format:n,mipmaps:!1,...r===void 0?{}:{minFilter:r,magFilter:r},addressU:1,addressV:1}),wl=(e,t)=>{let n=e.wgpu?.limits?.maxStorageBufferBindingSize;return!n||t<=n},Tl=class{device;suffix;colorTexture;depthTexture;target;setTextures=[];setTargets=[];taaColor=[];taaHalf=!1;taaInfo=[];taaTargets=[];taaSetTargets=[];taaWrite=0;taaHistoryValid=!1;taaWidth=0;taaHeight=0;taaPrevViewProjection=new J;taaPrevView=new J;taaLastViewProjection=new J;taaLastView=new J;taaLastModel=new J;cameraWorld=new J;restFrames=0;occGrid;occBlocks={x1:0,y1:0,x2:0,y2:0};reduceL1;reduceL2;prevValid=!1;prevViewProjection=new J;prevView=new J;prevProjection=new J;prevModel=new J;prevClipZ=[0,0,0,0];prevViewport=[0,0];prevFocal=[0,0];prevFlip=1;prevWidth=0;prevHeight=0;prevVersion=-1;prevOrtho=!1;shaderProjection=new J;viewProjection=new J;nodeVisibleData=new Uint32Array;nodeVisibleBuffer=null;cacheBuffer=null;cacheSlots=0;cacheStereo=!1;counter;orderBuckets;orderedBuffer=null;orderedCapacity=0;setRanges;projectorComputes=new Map;args;orderScan;orderScatter;orderScatterSets;setArgs;bindings=[];warpBuffer;warpKey=``;warpTable=null;warpWidth=0;warpHeight=0;constructor(e,t,n){this.device=e,this.suffix=n,this.colorTexture=Cl(e,`sse-splat-color${n}`,7,1),this.depthTexture=Cl(e,`sse-splat-depth${n}`,16),this.target=new Ze({name:`sse-splat-target${n}`,colorBuffer:this.colorTexture,depthBuffer:this.depthTexture,samples:1});for(let t=0;t<4;t++){let r=Cl(e,`sse-splat-set-${t}-color${n}`,7,1),i=Cl(e,`sse-splat-set-${t}-depth${n}`,16);this.setTextures.push(r,i),this.setTargets.push(new Ze({name:`sse-splat-set-${t}${n}`,colorBuffer:r,depthBuffer:i,samples:1}))}for(let t=0;t<2;t++)this.taaInfo.push(Cl(e,`sse-splat-taa-info-${t}${n}`,37,0));this.createHistoryColor(),this.occGrid=new A(e,8,8),this.reduceL1=new ce(e,t.reduceL1,`sse-splat-reduce1`),this.reduceL2=new ce(e,t.reduceL2,`sse-splat-reduce2`),this.counter=new A(e,16,12),this.orderBuckets=new A(e,2*Z*4,8),this.setRanges=new A(e,40),this.args=new ce(e,t.args,`sse-splat-args`),this.orderScan=new ce(e,t.orderScan,`sse-splat-order-scan`),this.orderScatter=new ce(e,t.orderScatter,`sse-splat-order-scatter`),this.orderScatterSets=new ce(e,t.orderScatterSets,`sse-splat-order-scatter`),this.setArgs=new ce(e,t.setArgs,`sse-splat-set-args`),this.warpBuffer=new A(e,16,8)}createHistoryColor(){let e=this.taaHalf?12:47,t=+!!this.taaHalf;for(let n=0;n<2;n++)this.taaColor.push(Cl(this.device,`sse-splat-taa-color-${n}${this.suffix}`,e,t)),this.taaTargets.push(new Ze({name:`sse-splat-taa-${n}${this.suffix}`,colorBuffers:[this.taaColor[n],this.taaInfo[n]],depth:!1,samples:1}))}setTaaHalf(e){this.releaseTaaSetTargets();for(let e of this.taaTargets)e.destroy();for(let e of this.taaColor)e.destroy();this.taaTargets.length=0,this.taaColor.length=0,this.taaHalf=e,this.createHistoryColor();for(let e of this.taaInfo)e.resize(4,4);this.taaWidth=0,this.taaHeight=0,this.taaHistoryValid=!1,this.restFrames=0}setWarp(e,t){let n=t?cc(t):null,r=n?n.byteLength:16;this.warpBuffer.byteSize!==r&&(this.warpBuffer.destroy(),this.warpBuffer=new A(this.device,r,8)),n&&this.warpBuffer.write(0,n,0,n.length),this.warpTable=n,this.warpKey=e,this.warpWidth=t?t.width:0,this.warpHeight=t?t.height:0,this.taaHistoryValid=!1,this.restFrames=0,this.prevValid=!1}get gpuBytes(){let e=0,t=[this.nodeVisibleBuffer,this.cacheBuffer,this.orderedBuffer,this.counter,this.orderBuckets,this.warpBuffer];for(let n of[...t,this.occGrid])e+=n?.byteSize??0;e+=this.colorTexture.gpuSize+this.depthTexture.gpuSize;for(let t of[...this.taaColor,...this.taaInfo])e+=t.gpuSize;return e}releaseTaaSetTargets(){for(let e of this.taaSetTargets)e.destroy();this.taaSetTargets.length=0}destroyProjectorComputes(){for(let e of this.projectorComputes.values())e.destroy();this.projectorComputes.clear()}destroy(){this.destroyProjectorComputes();for(let e of[this.args,this.orderScan,this.orderScatter,this.orderScatterSets,this.setArgs])e.destroy();for(let e of[this.reduceL1,this.reduceL2])e.destroy();for(let e of[this.occGrid,this.counter,this.orderBuckets,this.setRanges,this.warpBuffer])e.destroy();this.orderedBuffer?.destroy(),this.cacheBuffer?.destroy(),this.nodeVisibleBuffer?.destroy(),this.orderedBuffer=this.cacheBuffer=this.nodeVisibleBuffer=null,this.releaseTaaSetTargets();for(let e of[...this.taaTargets,...this.setTargets,this.target])e.destroy();for(let e of[...this.taaColor,...this.taaInfo,...this.setTextures])e.destroy();this.colorTexture.destroy(),this.depthTexture.destroy()}},El=class e{variant;modeName;modeVariant;variantText;source;app;device;camera;worldLayer;provider;unsubscribe;enabled=!0;set=null;numChunks=0;chunkData=new Uint32Array;chunkBuffer=null;views;viewShaders;stereo=!1;stereoWarp=null;stereoWarpKey=``;stereoDefined=!1;stereoSlots={draw:0,sets:0};eye1ViewProjection=new J;passCamera;bindPass;projectorShaders=new Map;projectorBindGroupFormat=null;projectorSourceKey=``;argsBindGroupFormat;orderFormats=[];reduceFormats=[];residentAllocIds=new Set;nodesRemoved=!1;culling=!1;get cullSuspended(){return this.variant.cull===`auto`&&(!this.cullActive||this.cullSuspendedFrames>0)}cullActive=!0;cullSuspendedFrames=0;cullStatsPending=!1;static cacheFits(e,t){return wl(e,Math.ceil(t*1.25)*uc*4)}static CULL_SUSPEND_FRAMES=60;static CULL_MIN_FRACTION=.08;allowQueryCull=!1;rasterMesh;polygonMesh;setPasses=[];setInstances=[];interleaveMaterial;interleaveInstance;rasterMaterial;rasterInstance;rasterPass;taaMesh;taaMaterial;taaInstance;taaSetMaterial;taaSetInstance;taaHalfMaterial;taaSetHalfMaterial;setsFolded=!1;taaPassHalf=!1;composeHalf=!1;rateMaps=null;rateMapState=`idle`;rateMapSession=0;warpDefined=!1;destroyed=!1;taaPass;depthFrame=null;depthFrameCount=0;depthFrameCamera=zs();frameWanted=!1;requestFrame;onFrameEnd=()=>{this.source.frameEnd(),this.rateMapState===`wanted`&&this.measureRateMaps(),this.frameWanted&&(this.frameWanted=!1,this.requestFrame())};frameIndex=0;userSeed=0;taaActive=!1;allowQueryTaa=!1;composeMesh;composeMaterial;composeInstance;frustum=new u;sphere=new le;frameSeed=0;ready=!1;get frameDepthTexture(){return this.views[0].depthTexture}get cacheBuffer(){return this.views[0].cacheBuffer}get orderedBuffer(){return this.views[0].orderedBuffer}get cacheSlots(){return this.views[0].cacheSlots}get gpuBytes(){let e=(this.chunkBuffer?.byteSize??0)+(this.stereoWarp?.byteSize??0);for(let t of this.views)e+=t.gpuBytes;return e+this.source.gpuBytes()}get seed(){return this.frameSeed}set seed(e){this.userSeed=e>>>0,this.frameSeed=this.userSeed,this.app.renderNextFrame=!0}async readStats(){let e=new Uint32Array(2);return await this.views[0].counter.read(0,8,e,!0),{survivors:e[0],occluded:e[1]}}ensureOccGrid(e,t,n){let r=Math.ceil(t/8),i=Math.ceil(n/8),a=Math.ceil(r/4),o=Math.ceil(i/4);(e.occBlocks.x1!==r||e.occBlocks.y1!==i)&&(e.occGrid.destroy(),e.occGrid=new A(this.device,(r*i+a*o)*4,8),e.occBlocks={x1:r,y1:i,x2:a,y2:o})}reduceLevel2(e){let{x1:t,y1:n,x2:r,y2:i}=e.occBlocks,a=e.reduceL2;a.setParameter(`grid`,e.occGrid),a.setParameter(`blocksX1`,t),a.setParameter(`blocksY1`,n),a.setParameter(`blocksX2`,r),a.setParameter(`blocksY2`,i),ce.calcDispatchSize(Math.ceil(r*i/64),bl),a.setupDispatch(bl.x,bl.y,1),this.device.computeDispatch([a],`sse-splat-reduce2`)}reduceDepth(e,t,n){let{device:r}=this;this.ensureOccGrid(e,t,n);let{x1:i,y1:a}=e.occBlocks,o=e.reduceL1;o.setParameter(`prevDepth`,e.depthTexture),o.setParameter(`blockMax`,e.occGrid),o.setParameter(`width`,t),o.setParameter(`height`,n),o.setParameter(`blocksX`,i),o.setParameter(`blocksY`,a),o.setupDispatch(i,a,1),r.computeDispatch([o],`sse-splat-reduce1`),this.reduceLevel2(e)}activeSplats=0;constructor(e,t,n,i={}){this.app=e,this.device=e.graphicsDevice,this.camera=t,this.worldLayer=n,this.requestFrame=i.requestFrame??(()=>{this.app.renderNextFrame=!0}),this.modeName=i.mode??`pixel`,this.modeVariant=ul[this.modeName],this.variantText=i.variant??``,this.variant=ll(`${this.modeVariant},${this.variantText}`);let{device:a}=this;this.passCamera=new C(a),this.passCamera.node=t.entity,this.source=i.source===`workbuffer`?new nl:new tl(a),this.argsBindGroupFormat=new Fe(a,[new V(`counter`,4,!0),new V(`indirectDrawArgs`,4),new V(`indirectDispatchArgs`,4),new be(`uniforms`,4)]);let o=new r(a,{name:`sse-splat-args`,shaderLanguage:K,cshader:wc,computeUniformBufferFormats:{uniforms:new je(a,[new B(`drawSlot`,26),new B(`indexCount`,26),new B(`quadsPerInstance`,26),new B(`dispatchSlot`,26),new B(`scatterWorkgroupSize`,26)])},computeBindGroupFormat:this.argsBindGroupFormat}),s=new Fe(a,[new V(`buckets`,4)]),c=new Fe(a,[new V(`counter`,4,!0),new V(`cache`,4,!0),new V(`buckets`,4),new V(`ordered`,4)]),l=new Fe(a,[new V(`buckets`,4,!0),new V(`indirectDrawArgs`,4),new V(`setRanges`,4),new be(`uniforms`,4)]);this.orderFormats=[s,c,l];let u=new r(a,{name:`sse-splat-order-scan`,shaderLanguage:K,cshader:Pc,computeBindGroupFormat:s}),d=new r(a,{name:`sse-splat-order-scatter`,shaderLanguage:K,cshader:Fc,computeBindGroupFormat:c}),f=new r(a,{name:`sse-splat-order-scatter-sets`,shaderLanguage:K,cshader:Ic,computeBindGroupFormat:c}),p=new r(a,{name:`sse-splat-set-args`,shaderLanguage:K,cshader:Tc,computeUniformBufferFormats:{uniforms:new je(a,[new B(`drawSlot`,26),new B(`indexCount`,26),new B(`quadsPerInstance`,26)])},computeBindGroupFormat:l}),m=new Fe(a,[new nt(`prevDepth`,4,`2d`,2,!1),new V(`blockMax`,4),new be(`uniforms`,4)]),h=new Fe(a,[new V(`grid`,4),new be(`uniforms`,4)]);this.reduceFormats=[m,h];let g=new r(a,{name:`sse-splat-reduce1`,shaderLanguage:K,cshader:Hc,computeUniformBufferFormats:{uniforms:new je(a,[new B(`width`,26),new B(`height`,26),new B(`blocksX`,26),new B(`blocksY`,26)])},computeBindGroupFormat:m}),_=new r(a,{name:`sse-splat-reduce2`,shaderLanguage:K,cshader:Uc,computeUniformBufferFormats:{uniforms:new je(a,[new B(`blocksX1`,26),new B(`blocksY1`,26),new B(`blocksX2`,26),new B(`blocksY2`,26)])},computeBindGroupFormat:h});this.viewShaders={args:o,orderScan:u,orderScatter:d,orderScatterSets:f,setArgs:p,reduceL1:g,reduceL2:_},this.views=[new Tl(a,this.viewShaders,``)];let y=this.views[0],b=()=>this.stereo?this.passCamera:t.camera,x=e.renderer;this.rasterMesh=_l(a,Lc),this.polygonMesh=vl(a,Lc),this.rasterMaterial=new v({uniqueName:`sse-splat-raster`,vertexWGSL:Bc,fragmentWGSL:Vc,attributes:{vertex_position:U}}),this.rasterMaterial.blendType=3,this.rasterMaterial.depthWrite=!0,this.rasterMaterial.depthTest=!0,this.rasterMaterial.cull=0,this.rasterInstance=new z(this.rasterMesh,this.rasterMaterial,new pe(`sse-splat-raster`)),this.rasterInstance.cull=!1,this.rasterInstance.castShadow=!1,this.rasterInstance.receiveShadow=!1,this.rasterPass=new hl(a,x,b,[this.rasterInstance]),this.rasterPass.init(y.target),this.rasterPass.setClearColor(new G(0,0,0,0)),this.rasterPass.setClearDepth(1),this.rasterPass.enabled=!1;for(let e=0;e<4;e++){let t=new z(this.polygonMesh,this.rasterMaterial,new pe(`sse-splat-set-${e}`));t.cull=!1,t.castShadow=!1,t.receiveShadow=!1,t.setParameter(`setIndex`,e),this.setInstances.push(t);let n=new hl(a,x,b,[t],`sse-splat-raster-set-${e}`);n.init(y.setTargets[e]),n.setClearColor(new G(0,0,0,0)),n.setClearDepth(1),n.enabled=!1,this.setPasses.push(n)}this.interleaveMaterial=new v({uniqueName:`sse-splat-interleave`,vertexWGSL:Dc,fragmentWGSL:Nc,attributes:{vertex_position:U}}),this.interleaveMaterial.blendType=3,this.interleaveMaterial.depthWrite=!0,this.interleaveMaterial.depthTest=!0,this.interleaveMaterial.depthFunc=1,this.interleaveMaterial.cull=0,this.interleaveInstance=new z(yl(a),this.interleaveMaterial,new pe(`sse-splat-interleave`)),this.interleaveInstance.cull=!1,this.interleaveInstance.castShadow=!1,this.interleaveInstance.receiveShadow=!1,this.taaMesh=yl(a);let S=(e,t,n)=>{let r=new v({uniqueName:e,vertexWGSL:Dc,fragmentWGSL:kc,attributes:{vertex_position:U},fragmentOutputTypes:[n?`vec4`:`uvec4`,`uint`]});return t&&r.setDefine(`SSE_SETS`,``),n&&r.setDefine(`SSE_TAA_HALF`,``),r.blendType=3,r.depthWrite=t,r.depthTest=t,t&&(r.depthFunc=7),r.cull=0,r};this.taaMaterial=S(`sse-splat-taa`,!1,!1),this.taaSetMaterial=S(`sse-splat-taa-sets`,!0,!1),this.taaHalfMaterial=S(`sse-splat-taa-half`,!1,!0),this.taaSetHalfMaterial=S(`sse-splat-taa-sets-half`,!0,!0),this.taaInstance=new z(this.taaMesh,this.taaMaterial,new pe(`sse-splat-taa`)),this.taaInstance.cull=!1,this.taaInstance.castShadow=!1,this.taaInstance.receiveShadow=!1,this.bindSetTextures(y);for(let e of[this.taaSetMaterial,this.taaSetHalfMaterial])e.update();this.taaSetInstance=new z(this.taaMesh,this.taaSetMaterial,new pe(`sse-splat-taa-sets`)),this.taaSetInstance.cull=!1,this.taaSetInstance.castShadow=!1,this.taaSetInstance.receiveShadow=!1,this.taaPass=new hl(a,x,b,[this.taaInstance],`sse-splat-taa`),this.initTaaPass(y.taaTargets[0]),this.taaPass.enabled=!1,this.composeMesh=yl(a),this.composeMaterial=new v({uniqueName:`sse-splat-compose`,vertexWGSL:jc,fragmentWGSL:Mc,attributes:{vertex_position:U}}),this.composeMaterial.blendType=4,this.composeMaterial.depthWrite=!0,this.composeMaterial.depthTest=!0,this.composeMaterial.cull=0,this.composeMaterial.setParameter(`splatColor`,y.colorTexture),this.composeMaterial.setParameter(`splatDepth`,y.depthTexture),this.composeMaterial.setParameter(`taaColor`,y.taaColor[0]),this.composeMaterial.setParameter(`taaInfo`,y.taaInfo[0]),this.composeInstance=new z(this.composeMesh,this.composeMaterial,new pe(`sse-splat-compose`)),this.composeInstance.cull=!1,this.composeInstance.castShadow=!1,this.composeInstance.receiveShadow=!1,this.composeInstance.pick=!1,this.composeInstance.drawOrder=-1e3,this.composeInstance.calculateSortDistance=()=>Number.MAX_VALUE,this.bindPass=new gl(a,()=>this.bindView()),this.applyVariant(),this.provider=new tc(e,t,n),this.unsubscribe=this.provider.onFrame((e,t,n)=>this.frame(e,t,n)),e.on(`frameend`,this.onFrameEnd),this.attach()}setEnabled(e){this.enabled!==e&&(this.enabled=e,e?this.attach():this.detach(),this.app.renderNextFrame=!0)}get mode(){return this.modeName}setMode(e){e!==this.modeName&&(this.modeName=e,this.modeVariant=ul[e],this.setVariant(this.variantText))}setVariant(e){this.variantText=e;let t=this.stereo?fl:``;Object.assign(this.variant,ll(`${this.modeVariant},${t},${e}`)),this.cullActive=!0,this.cullSuspendedFrames=0,this.applyVariant()}resetHistory(){for(let e of this.views)e.taaHistoryValid=!1,e.restFrames=0;this.frameIndex=0}applyVariant(){this.resetHistory();let e=this.variant.coverage!==`pixel`;this.rasterMaterial.setDefine(`SSE_COVERAGE_SPLAT`,e?``:void 0),this.rasterMaterial.setDefine(`SSE_INTERLEAVED`,this.variant.coverage===`interleaved`?``:void 0),this.rasterInstance.mesh=e?this.polygonMesh:this.rasterMesh;let{jitter:t,strata:n}=this.variant,r=e&&t>0;this.rasterMaterial.setDefine(`SSE_JITTER`,r?``:void 0),this.rasterMaterial.setDefine(`SSE_POLYGON_ROTATE`,e&&!r?``:void 0);let i=Number(mc(t>0)),a=Math.max(t,1);for(let e of this.setInstances)e.setParameter(`jitterParams`,[t,4,1/(4*a),i]);this.rasterInstance.setParameter(`jitterParams`,[t,n,1/(n*a),i]),this.rasterInstance.setParameter(`setIndex`,4),this.rasterInstance.setParameter(`setMap`,[1,0,1,0]),this.composeMaterial.setDefine(`SSE_SHOW_DEPTH`,this.variant.compose===`depth`?``:void 0),this.rasterMaterial.update(),this.composeMaterial.update(),this.setReady(this.ready),this.app.renderNextFrame=!0}setReady(e){this.ready=e,this.rasterPass.enabled=e&&!this.setsFolded;for(let t of this.setPasses)t.enabled=e&&this.variant.coverage===`interleaved`;this.composeInstance.visible=e}attach(){let e=this.camera.camera.beforePasses;e.includes(this.bindPass)||e.push(this.bindPass);for(let t of this.setPasses)e.includes(t)||e.push(t);e.includes(this.rasterPass)||e.push(this.rasterPass),e.includes(this.taaPass)||e.push(this.taaPass),this.worldLayer.addMeshInstances([this.composeInstance]),this.provider.setActive(!0)}detach(){let e=this.camera.camera.beforePasses;for(let t of[this.bindPass,...this.setPasses,this.rasterPass,this.taaPass]){let n=e.indexOf(t);n>=0&&e.splice(n,1)}this.resetHistory(),this.depthFrame=null;for(let e of this.views)e.destroy();this.views=[new Tl(this.device,this.viewShaders,``)],this.worldLayer.removeMeshInstances([this.composeInstance]),this.source.suspend(),this.set=null,this.provider.setActive(!1)}stereoViews(){let e=this.camera.camera,t=e.xrActive?e.xrViews:null;return this.device.isWebGPU&&t&&t.length>=2?t:null}bindView(){let e=this.device.xrCurrentViewIndex??-1,t=this.stereo?Math.min(Math.max(e,0),this.views.length-1):0;for(let e of this.views[t].bindings)e()}bindSetTextures(e){for(let t=0;t<4;t++)for(let n of[this.interleaveMaterial,this.taaSetMaterial,this.taaSetHalfMaterial])n.setParameter(`setColor${t}`,e.setTextures[t*2]),n.setParameter(`setDepth${t}`,e.setTextures[t*2+1])}frame(e,t,n){if(!this.enabled)return;let{device:r,camera:i}=this,a=i.camera;if(this.nodesRemoved=!1,t||this.set!==e){let t=new Set(e.nodes.map(e=>e.allocId));for(let e of this.residentAllocIds)if(!t.has(e)){this.nodesRemoved=!0;break}this.residentAllocIds=t,this.source.update(e,n),this.rebuildChunkTable(e),this.activeSplats=e.activeSplats,this.pruneProjectorComputes(e),this.set=e}if(this.numChunks===0){this.setReady(!1);return}let o=a;if(o.xrActive&&!o.xrViews?.length){this.setReady(!1),this.taaPass.enabled=!1;return}let s=this.stereoViews();this.stereo!==!!s&&(this.stereo=!!s,this.setVariant(this.variantText));let c=s?s.length:1;for(;this.views.length<c;)this.views.push(new Tl(r,this.viewShaders,`-eye${this.views.length}`));for(;this.views.length>c;)this.views.pop().destroy();if(s&&a.updateViewTransforms(),this.followModel(e),!s)this.rateMapState!==`idle`&&this.rateMapSession++,this.rateMaps=null,this.rateMapState=`idle`;else if(this.rateMapState===`idle`&&this.variant.warp===`auto`){let e=r.xrSubImages??[];e.length>=c&&(this.rateMapState=r.wgpu&&e.some(al)?`wanted`:`done`)}let l=i.renderTarget,u=l?l.width:r.width,d=l?l.height:r.height,f=a.projection===1,p=e=>s?s[e].viewOffMat:a.viewMatrix,m=e=>s?s[e].projMat:a.projectionMatrix,h=!!l,g=this.views[0],_=this.variant.taa===`on`&&(!h||this.allowQueryTaa&&u===g.taaWidth&&d===g.taaHeight);this.frameSeed=_?this.frameIndex++>>>0:this.userSeed,this.taaActive=_,g.prevVersion!==e.version&&(this.cullSuspendedFrames=0,this.cullActive=!0);let v=this.variant.cull,y=v!==`off`,b=!1;if(v===`auto`&&!h){if(this.cullSuspendedFrames>0){let e=this.viewMoved(g,p(0),m(0));this.cullSuspendedFrames=Math.max(0,this.cullSuspendedFrames-(e?4:1)),y=!1}else this.cullActive||(b=!this.cullStatsPending,y=b)}let x=this.views.map((e,t)=>this.prepareTarget(e,t,!!s,u,d)),S=c===2&&this.variant.stereo===`shared`&&!!s&&ml(s)&&x[0].width===x[1].width&&x[0].height===x[1].height&&x[0].warped===x[1].warped&&wl(r,this.cacheSlotsFor(g,e.activeSplats)*9*4);S!==this.stereoDefined&&(this.stereoDefined=S,this.rasterMaterial.setDefine(`SSE_STEREO`,S?``:void 0),this.rasterMaterial.update());let C=S&&x[0].warped?`${this.views[0].warpKey}|${this.views[1].warpKey}`:``;if(C!==this.stereoWarpKey){this.stereoWarpKey=C,this.stereoWarp?.destroy(),this.stereoWarp=null;let[e,t]=[this.views[0].warpTable,this.views[1]?.warpTable];C&&e&&t&&(this.stereoWarp=new A(r,(e.length+t.length)*4,8),this.stereoWarp.write(0,e,0,e.length),this.stereoWarp.write(e.length*4,t,0,t.length))}for(let n=0;n<c;n++){let r=S?n===0?`lead`:`follow`:`own`;this.frameView(this.views[n],n,e,t,p(n),m(n),!!s,r,{...x[n],isOrtho:f,isQuery:h,taaOn:_,cullWanted:y,eye1:S?{view:this.views[1],viewMatrix:p(1),projection:m(1)}:null})}let w=this.views[0].warpKey!==``;if(w!==this.warpDefined){this.warpDefined=w;let e=[this.taaMaterial,this.taaSetMaterial,this.taaHalfMaterial,this.taaSetHalfMaterial];for(let t of[...e,this.composeMaterial])t.setDefine(`SSE_WARP`,w?``:void 0),t.update()}let T=this.views[0].taaHalf;T!==this.composeHalf&&(this.composeHalf=T,this.composeMaterial.setDefine(`SSE_TAA_HALF`,T?``:void 0),this.composeMaterial.update()),(h||s||w)&&(this.depthFrame=null),this.setReady(!0)}prepareTarget(e,t,n,r,i){let a=this.warpOf(t,n,r,i);e.warpKey!==(a?.key??``)&&e.setWarp(a?.key??``,a?a.map():null);let o=!!a,s=o?e.warpWidth:r,c=o?e.warpHeight:i;return(e.target.width!==s||e.target.height!==c)&&(e.target.resize(s,c),e.releaseTaaSetTargets()),{width:s,height:c,warped:o}}canCull(e,t,n,r,i){return(!i||this.allowQueryCull)&&e.prevValid&&e.prevWidth===t&&e.prevHeight===n&&!this.nodesRemoved&&e.prevOrtho===r}warpOf(e,t,n,r){let{warp:i}=this.variant;if(typeof i==`number`)return{key:`m${i}:${n}x${r}`,map:()=>oc(i,n,r)};let a=t&&i===`auto`?this.rateMaps?.[e]:void 0;return a?{key:`xr${this.rateMapSession}:${e}`,map:()=>a}:null}measureRateMaps(){let{device:e}=this,t=e.xrSubImages??[];if(!e.wgpu||!t.length)return;this.rateMapState=`measuring`;let n=this.rateMapSession;ol(e.wgpu,t).then(e=>{this.destroyed||n!==this.rateMapSession||e.every(e=>e)&&(this.rateMaps=e,this.app.renderNextFrame=!0)}).catch(()=>{}).finally(()=>{n===this.rateMapSession&&(this.rateMapState=`done`)})}frameView(t,n,r,i,a,o,s,c,l){let{device:u,camera:d}=this,f=d.camera,{width:p,height:m,warped:h,isOrtho:g,isQuery:_,taaOn:v}=l,y=t.bindings;y.length=0;let b=(e,t,n)=>y.push(()=>e.setParameter(t,n)),x=c!==`follow`,S=c===`follow`?this.views[0]:t,w=s?t.shaderProjection.copy(o):C.applyShaderProjectionTransform(o,t.shaderProjection,!1,!0);t.viewProjection.mul2(w,a);let T=[-w.data[10],w.data[14]],E=g?T:[1,T[1]/T[0]],D=[E[0],E[1],+!!g,0],{eye1:O}=l,k=O?this.eye1ViewProjection.mul2(O.projection,O.viewMatrix):null;x&&this.cullNodes(t,r,k?[t.viewProjection,k]:[t.viewProjection]);let A=[Math.abs(o.data[0])*p*.5,Math.abs(o.data[5])*m*.5],j=this.app.scene.gsplat,M=j.alphaClipForward,N=this.viewMoved(t,a,o),P=N&&this.variant.contribution>0,F=P?Math.max(j.minContribution,this.variant.contribution):j.minContribution;P&&(this.frameWanted=!0);let{taaHistory:I}=this.variant,L=I===`half`||I===`auto`&&s;t.taaHalf!==L&&t.setTaaHalf(L),v?((t.taaWidth!==p||t.taaHeight!==m)&&(this.resizeHistory(t,p,m),t.taaWidth=p,t.taaHeight=m,t.taaHistoryValid=!1,t.restFrames=0),N||i?t.restFrames=0:t.restFrames++,t.restFrames<this.variant.taaMax+2&&(this.frameWanted=!0)):(t.taaHistoryValid=!1,t.restFrames=0,this.variant.taa===`off`&&t.taaWidth!==0&&(this.resizeHistory(t,4,4),t.taaWidth=0,t.taaHeight=0));let R=this.variant.cull,ee=l.cullWanted&&this.canCull(t,p,m,g,_)&&(!O||this.canCull(O.view,p,m,g,_));n===0&&(this.culling=ee),ee&&x&&(this.reduceDepth(t,p,m),O&&this.reduceDepth(O.view,p,m));let{coverage:te}=this.variant,z=te===`interleaved`,ne=z&&this.variant.interleaveArea>0;t.cameraWorld.copy(a).invert();let re=this.stereoSlots.draw,ie=this.stereoSlots.sets;if(x){t.counter.clear(),this.ensureCache(t,r.activeSplats,!!O),t.orderBuckets.clear(),this.ensureOrdered(t,t.cacheSlots*(z?4:1));let e=Math.log(Math.max(f.nearClip,1e-6)),n=1/Math.max(Math.log(Math.max(f.farClip,1e-6))-e,1e-6),i=s?t.cameraWorld.getTranslation(xl):d.entity.getPosition(),c=O?.view??t,l=O?.projection??o,_=[Math.abs(l.data[0])*p*.5,Math.abs(l.data[5])*m*.5],v=this.source.dispatchPlan(r,this.numChunks);for(let o of v){if(o.fileIndex>=0&&!this.anyNodeVisible(t,r.files[o.fileIndex].nodes))continue;let s=this.ensureProjector(t,ee,te,h,!!O,o);this.source.bind(s,o,r),s.setParameter(`chunks`,this.chunkBuffer),s.setParameter(`nodeVisible`,t.nodeVisibleBuffer),s.setParameter(`cache`,t.cacheBuffer),s.setParameter(`counter`,t.counter),s.setParameter(`occ`,t.occGrid),s.setParameter(`buckets`,t.orderBuckets),s.setParameter(`view`,a.data),s.setParameter(`viewProj`,t.viewProjection.data),s.setParameter(`prevViewProj`,t.prevViewProjection.data),s.setParameter(`prevView`,t.prevView.data),s.setParameter(`prevClipZ`,t.prevClipZ),s.setParameter(`viewport`,[p,m]),s.setParameter(`focal`,A),s.setParameter(`prevViewport`,t.prevViewport),s.setParameter(`prevFocal`,t.prevFocal),s.setParameter(`numChunks`,o.chunkCount),s.setParameter(`chunkBase`,o.chunkBase),s.setParameter(`cameraPosition`,[i.x,i.y,i.z,0]),s.setParameter(`splatTextureSize`,this.source.textureSize(o)),s.setParameter(`isOrtho`,+!!g),s.setParameter(`minPixelSize`,j.minPixelSize),s.setParameter(`alphaClip`,M),s.setParameter(`minContribution`,F),s.setParameter(`unitScale`,this.variant.units===`engine`?2:1),s.setParameter(`occBlocksX1`,t.occBlocks.x1),s.setParameter(`occBlocksY1`,t.occBlocks.y1),s.setParameter(`occBlocksX2`,t.occBlocks.x2),s.setParameter(`occBlocksY2`,t.occBlocks.y2),s.setParameter(`occlusionMode`,ee?R===`l1`?1:2:0),s.setParameter(`prevFlip`,t.prevFlip),s.setParameter(`keyLogNear`,e),s.setParameter(`keyInvLogRange`,n),s.setParameter(`frameSeed`,this.frameSeed),s.setParameter(`jitterSubs`,this.variant.jitter),s.setParameter(`strata`,this.variant.strata),s.setParameter(`interleaveArea`,z?this.variant.interleaveArea:0),s.setParameter(`warpTable`,O&&this.stereoWarp?this.stereoWarp:t.warpBuffer),s.setParameter(`viewEye1`,(O?.viewMatrix??a).data),s.setParameter(`viewProjEye1`,(k??t.viewProjection).data),s.setParameter(`prevViewProjEye1`,c.prevViewProjection.data),s.setParameter(`prevViewEye1`,c.prevView.data),s.setParameter(`focalEye1`,_),s.setParameter(`prevFocalEye1`,c.prevFocal),s.setParameter(`occEye1`,c.occGrid),s.setParameter(`occL2Base`,t.occBlocks.x1*t.occBlocks.y1),s.setParameter(`stereoBase`,t.cacheSlots*uc),s.setParameter(`warpBaseEye1`,t.warpTable?.length??0),ce.calcDispatchSize(o.chunkCount,bl),s.setupDispatch(bl.x,bl.y,1),u.computeDispatch([s],`sse-splat-project`)}re=u.getIndirectDrawSlot(1);let y=u.getIndirectDispatchSlot(1),b=t.args;if(b.setParameter(`counter`,t.counter),b.setParameter(`indirectDrawArgs`,u.indirectDrawBuffer),b.setParameter(`indirectDispatchArgs`,u.indirectDispatchBuffer),b.setParameter(`drawSlot`,re),b.setParameter(`indexCount`,768),b.setParameter(`quadsPerInstance`,Lc),b.setParameter(`dispatchSlot`,y),b.setParameter(`scatterWorkgroupSize`,Z),b.setupDispatch(1,1,1),u.computeDispatch([b],`sse-splat-args`),t.orderScan.setParameter(`buckets`,t.orderBuckets),t.orderScan.setupDispatch(1,1,1),u.computeDispatch([t.orderScan],`sse-splat-order-scan`),z){ie=u.getIndirectDrawSlot(hc);let e=t.setArgs;e.setParameter(`buckets`,t.orderBuckets),e.setParameter(`indirectDrawArgs`,u.indirectDrawBuffer),e.setParameter(`setRanges`,t.setRanges),e.setParameter(`drawSlot`,ie),e.setParameter(`indexCount`,768),e.setParameter(`quadsPerInstance`,Lc),e.setupDispatch(1,1,1),u.computeDispatch([e],`sse-splat-set-args`)}let x=z?t.orderScatterSets:t.orderScatter;x.setParameter(`counter`,t.counter),x.setParameter(`cache`,t.cacheBuffer),x.setParameter(`buckets`,t.orderBuckets),x.setParameter(`ordered`,t.orderedBuffer),x.setupIndirectDispatch(y),u.computeDispatch([x],`sse-splat-order-scatter`),this.stereoSlots={draw:re,sets:ie}}z?(y.push(()=>this.rasterInstance.setIndirect(null,ie+4,1)),this.prepareSets(t,p,m,ie)):y.push(()=>this.rasterInstance.setIndirect(null,re,1)),y.push(()=>{this.rasterPass.renderTarget=t.target;for(let e=0;e<4;e++)this.setPasses[e].renderTarget=t.setTargets[e];this.bindSetTextures(t)});let ae=this.rasterMaterial;b(ae,`splatCache`,S.cacheBuffer),b(ae,`splatCount`,S.counter),b(ae,`orderedSlots`,S.orderedBuffer),b(ae,`viewportSize`,[p,m,2/p,2/m]),b(ae,`clipZParams`,D),b(ae,`sseAlphaClip`,M),b(ae,`frameSeed`,this.frameSeed),z&&b(ae,`setRanges`,S.setRanges),c!==`own`&&(b(ae,`stereoBase`,S.cacheSlots*uc),b(ae,`stereoEye`,+(c===`follow`))),this.rasterPass.instances=z?ne?[this.rasterInstance,this.interleaveInstance]:[this.interleaveInstance]:[this.rasterInstance];let oe=z&&v&&!ne;if(oe&&this.ensureTaaSetTargets(t),(oe!==this.setsFolded||L!==this.taaPassHalf)&&(this.setsFolded=oe,this.taaPassHalf=L,this.initTaaPass(oe?t.taaSetTargets[0]:t.taaTargets[0]),this.taaPass.instances=[oe?this.taaSetInstance:this.taaInstance],this.taaInstance.material=L?this.taaHalfMaterial:this.taaMaterial,this.taaSetInstance.material=L?this.taaSetHalfMaterial:this.taaSetMaterial),this.taaPass.enabled=v,v||(b(this.composeMaterial,`taaColor`,t.taaColor[0]),b(this.composeMaterial,`taaInfo`,t.taaInfo[0])),v){let e=t.taaWrite^1,n=oe?L?this.taaSetHalfMaterial:this.taaSetMaterial:L?this.taaHalfMaterial:this.taaMaterial;t.taaPrevViewProjection.copy(t.taaLastViewProjection),t.taaPrevView.copy(t.taaLastView),oe||(b(n,`curColor`,t.colorTexture),b(n,`curDepth`,t.depthTexture)),b(n,`histColor`,t.taaColor[e]),b(n,`histInfo`,t.taaInfo[e]),b(n,`cameraWorld`,t.cameraWorld.data);let o=w.data;b(n,`unproject`,g?[o[0],o[5],o[12],o[13]]:[o[0],o[5],o[8],o[9]]),b(n,`prevViewProj`,t.taaPrevViewProjection.data),b(n,`prevView`,t.taaPrevView.data),b(n,`clipZParams`,D),b(n,`taaParams`,[N||i?this.variant.taaMoveMax:this.variant.taaMax,+!!t.taaHistoryValid,+!!N,t.restFrames]),b(n,`taaViewport`,[p,m,1/p,1/m]),b(n,`taaControl`,[t.target.flipY?-1:1,this.variant.taaClip,+(this.variant.taaReproj===`history`),this.variant.taaMotion]),b(n,`taaMoving`,[+(this.variant.taaParallax===`on`),this.variant.taaSharp]),b(n,`taaDebug`,this.variant.taaDebug),b(n,`warpTable`,t.warpBuffer);let s=(oe?t.taaSetTargets:t.taaTargets)[t.taaWrite];y.push(()=>{this.taaPass.renderTarget=s}),b(this.composeMaterial,`taaColor`,t.taaColor[t.taaWrite]),b(this.composeMaterial,`taaInfo`,t.taaInfo[t.taaWrite]),t.taaLastViewProjection.copy(t.viewProjection),t.taaLastView.copy(a),t.taaLastModel.copy(r.files[0]?.modelMatrix??J.IDENTITY),t.taaHistoryValid=!0,t.taaWrite^=1}let se=d.renderTarget,le=se?se.flipY:u.backBuffer.flipY,ue=this.composeMaterial;if(b(ue,`splatColor`,t.colorTexture),b(ue,`splatDepth`,t.depthTexture),b(ue,`composeParams`,[t.target.flipY===le?0:1,+!!g,+!!v,0]),b(ue,`sharpenParams`,[this.variant.taaSharpen,this.variant.taaMax,0,0]),b(ue,`depthViewParams`,[E[0],E[1],Math.max(f.nearClip,1e-4),Math.max(f.farClip,f.nearClip*2)]),b(ue,`cameraClipZ`,[T[0],T[1],+!!g,0]),b(ue,`warpTable`,t.warpBuffer),n===0&&ee&&R===`auto`&&!_&&!this.cullStatsPending){this.cullStatsPending=!0;let n=new Uint32Array(2);t.counter.read(0,8,n,!1).then(()=>{let t=n[0]+n[1],r=t>0&&n[1]/t>=e.CULL_MIN_FRACTION;this.cullActive=r,r||(this.cullSuspendedFrames=e.CULL_SUSPEND_FRAMES)}).catch(()=>{}).finally(()=>{this.cullStatsPending=!1})}_?t.prevValid=!1:(s||(Bs(d.entity,this.depthFrameCamera),this.depthFrame={id:++this.depthFrameCount,camera:this.depthFrameCamera,width:p,height:m,clipZ:[E[0],E[1]]}),t.prevViewProjection.copy(t.viewProjection),t.prevView.copy(a),t.prevProjection.copy(o),t.prevModel.copy(r.files[0]?.modelMatrix??J.IDENTITY),t.prevClipZ=D,t.prevViewport=[p,m],t.prevFocal=A,t.prevFlip=t.target.flipY?-1:1,t.prevWidth=p,t.prevHeight=m,t.prevVersion=r.version,t.prevOrtho=g,t.prevValid=!0)}resizeHistory(e,t,n){for(let r of[...e.taaColor,...e.taaInfo])r.resize(t,n);for(let r of e.taaTargets)r.resize(t,n);e.releaseTaaSetTargets()}initTaaPass(e){this.taaPass.init(e),this.taaPass.setClearColor(new G(0,0,0,0)),e.depthBuffer&&this.taaPass.setClearDepth(1)}ensureTaaSetTargets(e){if(!e.taaSetTargets.length)for(let t=0;t<2;t++)e.taaSetTargets.push(new Ze({name:`sse-splat-taa-sets-${t}`,colorBuffers:[e.taaColor[t],e.taaInfo[t]],depthBuffer:e.depthTexture,samples:1}))}followModel(e){let t=e.files[0]?.modelMatrix;if(t)for(let e of this.views)e.prevModel.equals(t)||(Sl.copy(t).invert().mul2(e.prevModel,Sl),e.prevViewProjection.mul(Sl),e.prevView.mul(Sl),e.prevModel.copy(t)),e.taaLastModel.equals(t)||(Sl.copy(t).invert().mul2(e.taaLastModel,Sl),e.taaLastViewProjection.mul(Sl),e.taaLastView.mul(Sl),e.taaLastModel.copy(t))}viewMoved(e,t,n){for(let r=0;r<16;r++)if(Math.abs(t.data[r]-e.prevView.data[r])>1e-6||Math.abs(n.data[r]-e.prevProjection.data[r])>1e-6)return!0;return!1}rebuildChunkTable(e){let t=0;for(let n of e.nodes)t+=Math.ceil(n.count/fc);this.chunkData.length<t*4&&(this.chunkData=new Uint32Array(Math.ceil(t*1.25)*4),this.chunkBuffer?.destroy(),this.chunkBuffer=new A(this.device,this.chunkData.byteLength,8));let n=this.chunkData,r=0;e.nodes.forEach((e,t)=>{let i=this.source.chunkBase(e);for(let a=0;a<e.count;a+=fc)n[r++]=i+a,n[r++]=Math.min(fc,e.count-a),n[r++]=t,n[r++]=e.lodIndex&65535|e.fileIndex<<16}),this.numChunks=t,t>0&&this.chunkBuffer.write(0,n,0,t*4)}ensureCache(e,t,n=!1){if(t<=e.cacheSlots&&(e.cacheStereo||!n))return;e.cacheBuffer?.destroy(),e.orderedBuffer?.destroy(),e.cacheSlots=this.cacheSlotsFor(e,t),e.cacheStereo=n;let r=uc+(e.cacheStereo?3:0);e.cacheBuffer=new A(this.device,e.cacheSlots*r*4,4),e.orderedBuffer=null,e.orderedCapacity=0}cacheSlotsFor(e,t){return t<=e.cacheSlots?e.cacheSlots:Math.max(1,Math.ceil(t*1.25))}ensureOrdered(e,t){t<=e.orderedCapacity||(e.orderedBuffer?.destroy(),e.orderedCapacity=t,e.orderedBuffer=new A(this.device,t*4))}prepareSets(e,t,n,r){let i=Math.ceil(t/2),a=Math.ceil(n/2);for(let o=0;o<4;o++){let s=e.setTargets[o];(s.width!==i||s.height!==a)&&s.resize(i,a);let c=o&1,l=o>>1,u=this.setInstances[o],d=[t/(2*i),(t/2-c+.5)/i-1,n/(2*a),1-(n/2-l+.5)/a];e.bindings.push(()=>{u.setIndirect(null,r+o,1),u.setParameter(`setMap`,d)})}}cullNodes(e,t,n){let r=Math.max(1,Math.ceil(t.nodes.length/32));e.nodeVisibleData.length<r&&(e.nodeVisibleData=new Uint32Array(r),e.nodeVisibleBuffer?.destroy(),e.nodeVisibleBuffer=new A(this.device,r*4,8));let i=e.nodeVisibleData;i.fill(0);let a=t.nodeSpheres,{sphere:o}=this;for(let e of n){this.frustum.setFromMat4(e);for(let e=0;e<t.nodes.length;e++)o.center.set(a[e*4],a[e*4+1],a[e*4+2]),o.radius=a[e*4+3],this.frustum.containsSphere(o)!==0&&(i[e>>5]|=1<<(e&31))}e.nodeVisibleBuffer.write(0,i,0,r)}anyNodeVisible(e,t){let n=e.nodeVisibleData;return t.some(e=>n[e.nodeIndex>>5]>>>(e.nodeIndex&31)&1)}ensureProjector(e,t,n,r,i,a){let o=this.source.shaderKey();this.projectorSourceKey!==o&&(this.destroyProjector(),this.projectorSourceKey=o);let s=`${t?`occlusion`:`plain`}-${n}${r?`-warp`:``}${i?`-stereo`:``}`,c=`${s}:${a.fileIndex}`,l=e.projectorComputes.get(c);if(l)return l;let u=this.ensureProjectorShader(s,t,n,r,i),d=new ce(this.device,u,`sse-splat-project`);return e.projectorComputes.set(c,d),d}pruneProjectorComputes(e){for(let t of this.views)for(let[n,r]of t.projectorComputes){let i=Number(n.slice(n.lastIndexOf(`:`)+1));i>=0&&!e.files[i]&&(r.destroy(),t.projectorComputes.delete(n))}}ensureProjectorShader(e,t,n,i,a){let o=this.projectorShaders.get(e);if(o)return o;let{device:s}=this,c=[new V(`chunks`,4,!0),new V(`nodeVisible`,4,!0),new V(`cache`,4),new V(`counter`,4),new be(`uniforms`,4),new V(`occ`,4,!0),new V(`buckets`,4),new V(`warpTable`,4,!0),new V(`occEye1`,4,!0)],l=[...c,...this.source.bindFormats()];this.projectorBindGroupFormat??=new Fe(s,l);let u=new r(s,{name:`sse-splat-project-${e}`,shaderLanguage:K,cshader:Cc(this.source.readChunk(c.length),t,n,i,a),cincludes:this.source.shaderIncludes(),cdefines:this.source.shaderDefines(),computeUniformBufferFormats:{uniforms:new je(s,[new B(`view`,14),new B(`viewProj`,14),new B(`prevViewProj`,14),new B(`prevView`,14),new B(`prevClipZ`,5),new B(`viewport`,3),new B(`focal`,3),new B(`prevViewport`,3),new B(`prevFocal`,3),new B(`numChunks`,26),new B(`splatTextureSize`,26),new B(`isOrtho`,26),new B(`minPixelSize`,2),new B(`alphaClip`,2),new B(`minContribution`,2),new B(`occBlocksX1`,26),new B(`occBlocksY1`,26),new B(`occBlocksX2`,26),new B(`occBlocksY2`,26),new B(`occlusionMode`,26),new B(`prevFlip`,2),new B(`keyLogNear`,2),new B(`keyInvLogRange`,2),new B(`chunkBase`,26),new B(`model`,14),new B(`modelRotation`,5),new B(`modelScale`,5),new B(`cameraPosition`,5),new B(`unitScale`,2),new B(`frameSeed`,26),new B(`jitterSubs`,26),new B(`strata`,26),new B(`interleaveArea`,2),new B(`viewEye1`,14),new B(`viewProjEye1`,14),new B(`prevViewProjEye1`,14),new B(`prevViewEye1`,14),new B(`focalEye1`,3),new B(`prevFocalEye1`,3),new B(`occL2Base`,26),new B(`stereoBase`,26),new B(`warpBaseEye1`,26)])},computeBindGroupFormat:this.projectorBindGroupFormat});return this.projectorShaders.set(e,u),u}destroyProjector(){for(let e of this.views)e.destroyProjectorComputes();for(let e of this.projectorShaders.values())e.destroy();this.projectorShaders.clear(),this.projectorBindGroupFormat?.destroy(),this.projectorBindGroupFormat=null,this.projectorSourceKey=``}destroy(){this.destroyed=!0,this.unsubscribe(),this.app.off(`frameend`,this.onFrameEnd),this.detach(),this.provider.destroy(),this.source.destroy(),this.destroyProjector();for(let e of this.views)e.destroy();this.views.length=0;for(let e of Object.values(this.viewShaders))e.destroy();this.argsBindGroupFormat.destroy();for(let e of[...this.reduceFormats,...this.orderFormats])e.destroy();this.chunkBuffer?.destroy(),this.chunkBuffer=null,this.stereoWarp?.destroy(),this.stereoWarp=null,this.bindPass.destroy(),this.rasterPass.destroy(),this.rasterInstance.destroy(),this.rasterMaterial.destroy();for(let e of this.setPasses)e.destroy();for(let e of this.setInstances)e.destroy();this.setPasses.length=0,this.setInstances.length=0;let e=this.interleaveInstance.mesh;this.interleaveInstance.destroy(),e.destroy(),this.interleaveMaterial.destroy(),this.rasterMesh.destroy(),this.polygonMesh.destroy(),this.taaPass.destroy(),this.taaInstance.destroy(),this.taaMaterial.destroy(),this.taaSetInstance.destroy(),this.taaSetMaterial.destroy(),this.taaHalfMaterial.destroy(),this.taaSetHalfMaterial.destroy(),this.taaMesh.destroy(),this.composeInstance.destroy(),this.composeMaterial.destroy(),this.composeMesh.destroy()}},Dl=[`sorted`,...dl],Ol=[`performance`,`default`,`high`,`max`],kl=/OculusBrowser|PicoBrowser/.test(globalThis.navigator?.userAgent??``),Al=/Macintosh/.test(globalThis.navigator?.userAgent??``)&&(globalThis.navigator?.maxTouchPoints??0)>0,jl={desktop:[2,4,8,16],mobile:[1,2,4,8],standaloneXr:[.5,1,2,null]},Ml=.5,Nl=.8,Pl=110,Fl=75,Il=40,Ll=32,Rl=1.1,zl={mobile:1100,standaloneHeadset:1900,desktop:2600},Bl=.35,Vl=5,Hl=90,Ul=.2,Wl=1,Gl=()=>{let e=b.mobile?1080:2160;return Math.min(e/Math.min(screen.width,screen.height),window.devicePixelRatio)},Kl=(e,t)=>e===`performance`&&!t?Ml:1,ql=class{deviceClass;stochasticAllowed;app;config;state;renderer;events;ceilingMB;debugOverride=null;handles;constructor(e,t,n,r,i){this.app=e,this.config=t,this.state=n,this.renderer=i,this.events=r;let a=e.graphicsDevice,o=a.gpuAdapter?.info,s=o?.vendor===`apple`&&/^metal/.test(o.architecture??``);this.deviceClass={ladder:b.mobile||Al&&!s||kl?`mobile`:`desktop`,standaloneHeadset:kl,visionPro:Al,gpu:o?[o.vendor,o.architecture,o.description].filter(Boolean).join(` / `):a.unmaskedRenderer??``},this.stochasticAllowed=i===`webgpu`&&!kl&&t.stochastic!==`off`;let c=globalThis.navigator?.deviceMemory,l=kl?zl.standaloneHeadset:zl[this.deviceClass.ladder];this.ceilingMB=c?Math.min(l,c*1024*Bl):l,this.handles=[r.on(`performanceMode:changed`,()=>{this.debugOverride=null,this.updateAvailable()}),r.on(`debugMode:changed`,()=>this.updateAvailable()),r.on(`xrMode:changed`,()=>this.updateAvailable()),r.on(`quality:changed`,()=>this.updateAvailable())],this.updateAvailable()}destroy(){for(let e of this.handles)e.off()}get stochastic(){if(this.debugOverride!==null)return this.renderer===`webgpu`&&this.debugOverride!==`sorted`;let{stochastic:e}=this.config;return e===!0||e===`mobile`?this.renderer===`webgpu`:this.stochasticAllowed&&this.state.performanceMode}get stochasticMode(){return this.debugOverride!==null&&this.debugOverride!==`sorted`?this.debugOverride:this.config.stochastic===`mobile`?`mobile`:this.config.stochastic===!0?`pixel`:this.deviceClass.ladder===`mobile`?`mobile`:`pixel`}get debugModes(){return this.renderer===`webgpu`&&(this.switchable||this.config.debug)}get debugMode(){return this.stochastic?this.stochasticMode:`sorted`}setDebugMode(e){this.debugModes&&e!==this.debugOverride&&(this.debugOverride=e,this.events.fire(`debugMode:changed`,e))}get level(){let e=this.state.qualityAvailable;if(e.includes(this.state.quality))return this.state.quality;let t=Ol.indexOf(this.state.quality);return[...e].reverse().find(e=>Ol.indexOf(e)<t)??e[0]??this.state.quality}get budget(){return this.budgetFor(this.level)??this.fallbackBudget()}get resolutionScale(){return Kl(this.state.quality,this.stochastic)}get xrFramebufferScale(){return kl&&this.state.quality===`performance`?Nl:1}get xrFixedFoveation(){return kl}get xrTargetFrameRate(){return kl?72:null}get colorUpdateAngle(){return this.state.quality===`performance`?Wl:Ul}get lodBehindPenalty(){return this.state.xrMode===null?Vl:1}get lodUpdateAngle(){return this.state.xrMode===null?Hl:0}levels(){let e=this.config.budget;if(e!==void 0&&Number.isFinite(e)&&e>0)return Ol.map(t=>({level:t,budget:e}));let t=kl&&this.state.xrMode!==null?jl.standaloneXr:jl[this.deviceClass.ladder],n=0;return Ol.map((e,r)=>{let i=t[r],a=i===null?null:this.fitBudget(i),o=a!==null&&a>n?a:null;return o!==null&&(n=o),{level:e,budget:o}})}budgetFor(e){return this.levels().find(t=>t.level===e)?.budget??null}fallbackBudget(){let e=this.levels(),t=Ol.indexOf(this.state.quality);for(let n=t;n>=0;n--){let t=e[n].budget;if(t!==null)return t}return e.find(e=>e.budget!==null)?.budget??e[0].budget??1}get switchable(){let{stochastic:e}=this.config;return this.stochasticAllowed&&e!==!0&&e!==`mobile`}fitBudget(e){let t=this.debugModes?[!1,!0]:[this.stochastic];for(let n=e;n>=.1;n=Math.round((n-.1)*10)/10)if(t.every(e=>this.cacheFits(n,e)&&this.estimateMB(n,e)<=this.ceilingMB))return n;return null}cacheFits(e,t){let n=this.app.graphicsDevice,r=e*1e6*Rl;if(t)return El.cacheFits(n,r);let i=n.wgpu?.limits?.maxStorageBufferBindingSize;return i===void 0||r*Ll<=i}estimateMB(e,t){if(!t)return e*Pl;let n=Gl(),r=screen.width*screen.height*n*n*(this.state.xrMode===null?1:2);return e*Fl+r*Il/1048576}updateAvailable(){let e=this.levels().filter(e=>e.budget!==null).map(e=>e.level),t=this.state.qualityAvailable;(t.length!==e.length||t.some((t,n)=>t!==e[n]))&&(this.state.qualityAvailable=e),this.state.xrMode===null&&e.length&&!e.includes(this.state.quality)&&(this.state.quality=this.level)}},Jl=85,Yl=()=>({sharpness:{enabled:!1,amount:0},bloom:{enabled:!1,intensity:.1,blurLevel:2},grading:{enabled:!1,brightness:1,contrast:1,saturation:1,tint:[1,1,1]},vignette:{enabled:!1,intensity:.5,inner:.3,outer:.75,curvature:1},fringing:{enabled:!1,intensity:.5}}),Xl=e=>(typeof e==`object`&&e&&(Object.values(e).forEach(Xl),Object.freeze(e)),e);Xl({min:10,max:120,step:1}),Xl({sharpness:{amount:{min:0,max:1,step:.01}},bloom:{intensity:{min:0,max:.1,step:.01},blurLevel:{min:1,max:16,step:1}},grading:{brightness:{min:0,max:3,step:.01},contrast:{min:.5,max:1.5,step:.01},saturation:{min:0,max:2,step:.01}},vignette:{intensity:{min:0,max:1,step:.01},inner:{min:0,max:3,step:.01},outer:{min:0,max:3,step:.01},curvature:{min:.01,max:10,step:.01}},fringing:{intensity:{min:0,max:100,step:1}}}),Xl({duration:{min:.1,max:600},frameRate:{min:1,max:120},smoothness:{min:0,max:1},maxKeyframes:1e3,nameMax:120,maxTracks:10}),Xl({maxCount:25,titleMax:60,textMax:280});var Zl=e=>{let t=structuredClone(e);return t.animTracks?t.animTracks?.forEach(e=>{if(!e.frameRate){e.frameRate=30;let t=e.keyframes.times;for(let e=0;e<t.length;e++)t[e]*=30}e.hasOwnProperty(`smoothness`)||(e.smoothness=0)}):t.animTracks=[],t},Ql=(e,t)=>({name:e.name,duration:e.duration,frameRate:e.frameRate,loopMode:e.loopMode,interpolation:e.interpolation,smoothness:e.smoothness,keyframes:{times:e.keyframes.times,values:{position:e.keyframes.values.position,target:e.keyframes.values.target,fov:Array(e.keyframes.times.length).fill(t)}}}),$l=e=>({version:2,tonemapping:`none`,highPrecisionRendering:!1,background:{color:e.background.color||[0,0,0]},postEffectSettings:Yl(),animTracks:e.animTracks.map(t=>Ql(t,e.camera.fov||Jl)),cameras:e.camera.position&&e.camera.target?[{initial:{position:e.camera.position,target:e.camera.target,fov:e.camera.fov||Jl}}]:[],annotations:[],startMode:e.camera.startAnim===`animTrack`?`animTrack`:`default`}),eu=e=>{let t,n=e.version;if(n===void 0)t=$l(Zl(e));else if(n===2)t=e;else throw Error(`Unsupported experience settings version: ${n}`);return t},tu=`1.42.1`,nu=class{register;unregister;destroy;constructor(e){let{style:t}=e;t.display=`none`;let n=new Map,r=0;this.register=(i,a,o=`bottom`)=>{let s=()=>{let n=e.parentElement.getBoundingClientRect(),r=i.getBoundingClientRect(),s=r.left-n.left,c=r.right-n.left,l=r.top-n.top,u=r.bottom-n.top,d=Math.floor((s+c)*.5),f=Math.floor((l+u)*.5);switch(o){case`left`:t.left=`${s}px`,t.top=`${f}px`,t.transform=`translate(calc(-100% - 10px), -50%)`;break;case`right`:t.left=`${c}px`,t.top=`${f}px`,t.transform=`translate(10px, -50%)`;break;case`top`:t.left=`${d}px`,t.top=`${l}px`,t.transform=`translate(-50%, calc(-100% - 10px))`;break;case`bottom`:t.left=`${d}px`,t.top=`${u}px`,t.transform=`translate(-50%, 10px)`}e.textContent=a,t.display=`inline`},c=e=>{r=window.setTimeout(()=>{e(),r=-1},250)},l=()=>{r>=0&&(clearTimeout(r),r=-1)},u=()=>{l(),t.display===`inline`?s():c(()=>s())},d=()=>{l(),t.display===`inline`&&c(()=>{t.display=`none`})};i.addEventListener(`pointerenter`,u),i.addEventListener(`pointerleave`,d),n.set(i,{enter:u,leave:d})},this.unregister=e=>{let t=n.get(e);t&&(e.removeEventListener(`pointerenter`,t.enter),e.removeEventListener(`pointerleave`,t.leave),n.delete(e))},this.destroy=()=>{for(let e of n.keys())this.unregister(e)}}},ru=(e,t)=>{let{state:n,events:r,annotations:i}=e,a=t.querySelector(`.sse-annotationNav`),o=t.querySelector(`.sse-annotationInfo`),s=t.querySelector(`.sse-annotationNavNumber`),c=t.querySelector(`.sse-annotationNavTitle`),l=t.querySelector(`.sse-annotationPrev`),u=t.querySelector(`.sse-annotationNext`),d=t.querySelector(`.sse-annotationsRow`),f=t.querySelector(`.sse-annotationsCheck`),p=n.selectedAnnotation??0,m=()=>{p=n.selectedAnnotation??p,s.textContent=i[p]?String(p+1):``,c.textContent=i[p]?.title??``,a.classList.toggle(`sse-hidden`,!n.loaded||!n.showAnnotations||i.length<2),a.classList.toggle(`sse-unselected`,n.selectedAnnotation===null),a.classList.toggle(`sse-desktop`,n.inputMode===`desktop`),a.classList.toggle(`sse-touch`,n.inputMode===`touch`),a.classList.toggle(`sse-faded-in`,!n.controlsHidden),a.classList.toggle(`sse-faded-out`,n.controlsHidden),l.disabled=u.disabled=!n.loaded||i.length<2,d.classList.toggle(`sse-hidden`,i.length===0),f.classList.toggle(`sse-active`,n.showAnnotations)},h=t=>{t.stopPropagation(),e.selectAnnotation((p-1+i.length)%i.length)},g=t=>{t.stopPropagation(),e.selectAnnotation((p+1)%i.length)},_=t=>{t.stopPropagation(),n.loaded&&n.selectedAnnotation===null&&i[p]&&e.selectAnnotation(p)},v=e=>{e.stopPropagation(),n.showAnnotations=!n.showAnnotations};l.addEventListener(`click`,h),u.addEventListener(`click`,g),o.addEventListener(`click`,_),d.addEventListener(`click`,v);let y=[r.on(`loaded:changed`,m),r.on(`selectedAnnotation:changed`,m),r.on(`showAnnotations:changed`,m),r.on(`inputMode:changed`,m),r.on(`controlsHidden:changed`,m)];return m(),()=>{for(let e of y)e.off();l.removeEventListener(`click`,h),u.removeEventListener(`click`,g),o.removeEventListener(`click`,_),d.removeEventListener(`click`,v)}},iu=1/60,au=15,ou=new W,su=(e,t,n,r,i=new W)=>{let{system:a,fov:o,aspectRatio:s,horizontalFov:c,projection:l,orthoHeight:u}=e,{width:d,height:f}=a.app.graphicsDevice.clientRect;i.set(-(t/d)*2,n/f*2,0);let p=ou.set(0,0,0);if(l===0){let e=r*Math.tan(.5*o*q.DEG_TO_RAD);c?p.set(e,e/s,0):p.set(e*s,e,0)}else p.set(u*s,u,0);return i.mul(p),i},cu=(e,t)=>e===`orbit`?-t:t,lu=new W,uu=class extends g{static scriptName=`annotation`;context;label;title;text;hotspotDom=null;screen=null;destroyed=!1;initialize(){let e=this.context;this.hotspotDom=document.createElement(`div`),this.hotspotDom.className=`sse-annotation-hotspot sse-occluded`,this.hotspotDom.textContent=this.label;let t=e=>{e.stopPropagation(),this.fire(`select`)};this.hotspotDom.addEventListener(`click`,t),e.hotspotsDom.appendChild(this.hotspotDom);let n=()=>this._update();this.app.on(`prerender`,n),this.on(`destroy`,()=>{this.destroyed=!0,this.app.off(`prerender`,n),this.hotspotDom.removeEventListener(`click`,t),this.hotspotDom.remove(),e.activeAnnotation===this&&this.hideTooltip()})}_update(){if(this.destroyed)return;let{camera:e}=this.context,t=this.entity.getPosition();if(e.camera.viewMatrix.transformPoint(t,lu),lu.z>=0){this.screen=null,this._hideElements();return}let n=e.camera.worldToScreen(t),r=e.getPosition().distance(t);this.screen={x:n.x,y:n.y,distance:r,depth:-lu.z},this._updatePositions(n,r)}setOccluded(e){this.hotspotDom.classList.toggle(`sse-occluded`,e)}showTooltip(){let e=this.context;e.activeAnnotation=this,e.revealed=!1,this.hotspotDom.classList.add(`sse-active`)}revealTooltip(){let e=this.context;e.revealed=!0,e.tooltipOwner!==this&&(e.tooltipOwner=this,e.titleDom.textContent=this.title,e.textDom.textContent=this.text,e.tooltipDom.classList.remove(`sse-arrow-left`,`sse-arrow-right`)),this._update()}hideTooltip(){let e=this.context;e.activeAnnotation=null,e.tooltipDom.classList.remove(`sse-visible`),this.hotspotDom.classList.remove(`sse-active`)}_hideElements(){this.hotspotDom.style.display=`none`,this.context.tooltipOwner===this&&this.context.tooltipDom.classList.remove(`sse-visible`)}_updatePositions(e,t){let n=this.hotspotDom;n.style.display=`flex`,n.style.transform=`translate(${e.x}px, ${e.y}px) translate(-50%, -50%)`,n.style.zIndex=String(Math.round(1e5/(1+t)));let r=this.context;if(r.tooltipOwner!==this)return;let i=r.tooltipDom,a=r.canvas.clientWidth,o=r.canvas.clientHeight,s=e.x>=0&&e.x<=a&&e.y>=0&&e.y<=o;if(r.activeAnnotation!==this||!r.revealed){i.classList.remove(`sse-visible`);let t=r.tooltipOffset;t&&(i.style.transform=`translate(${e.x+t.x}px, ${e.y+t.y}px)`);return}let c=i.offsetWidth,l=i.offsetHeight,u=e.x+24,d=e.x-24-c,f=i.classList.contains(`sse-arrow-left`);(f?d<8&&u+c<=a-8:u+c>a-8)&&(f=!f);let p=f?d:u,m=e.y-l/2;p=Math.max(8,Math.min(p,a-c-8)),m=Math.max(8,Math.min(m,o-l-8));let h=Math.max(16,Math.min(e.y-m,l-16));i.style.setProperty(`--arrow-top`,`${h}px`),i.classList.toggle(`sse-arrow-right`,!f),i.classList.toggle(`sse-arrow-left`,f),i.style.transform=`translate(${p}px, ${m}px)`,i.classList.add(`sse-visible`),r.tooltipOffset=s?{x:p-e.x,y:m-e.y}:null}},du=class{parentDom;hotspotsDom;canvas;camera;tooltipDom;titleDom;textDom;activeAnnotation=null;revealed=!1;tooltipOwner=null;tooltipOffset=null;constructor(e,t,n){this.parentDom=n,this.canvas=e,this.camera=t,this.hotspotsDom=document.createElement(`div`),this.hotspotsDom.className=`sse-annotation-hotspots`,n.appendChild(this.hotspotsDom),this.tooltipDom=document.createElement(`div`),this.tooltipDom.className=`sse-annotation`,this.titleDom=document.createElement(`div`),this.titleDom.className=`sse-annotation-title`,this.textDom=document.createElement(`div`),this.textDom.className=`sse-annotation-text`,this.tooltipDom.append(this.titleDom,this.textDom),n.appendChild(this.tooltipDom)}},fu=150,pu=.5,mu=13,hu=.9,gu=class{parentDom;parent;subscriptions;removeClick;removeOcclusion;constructor(e,t,n,r,i){let{app:a,state:o,events:s,annotations:c}=e,l=document.createElement(`div`);l.className=`sse-annotations`,t.querySelector(`.sse-sceneLayer`).appendChild(l),this.parentDom=l;let u=a.graphicsDevice.canvas,d=new du(u,n,l),f=new He(`annotations`,a);a.root.addChild(f),this.parent=f;let p=[];for(let t=0;t<c.length;t++){let n=c[t],r=new He(`annotation`,a);r.addComponent(`script`),r.script.create(uu);let i=r.script.annotation;i.context=d,i.label=(t+1).toString(),i.title=n.title,i.text=n.text,r.setPosition(n.position[0],n.position[1],n.position[2]),f.addChild(r),p.push(i),i.on(`select`,()=>e.selectAnnotation(t))}let m=!1,h=null,g=0,_=new J,v=new J,y=async()=>{h=null;let e=r();if(m||!e||l.style.display===`none`)return;let t=u.clientWidth,n=u.clientHeight,i=p.filter(({screen:e})=>e&&e.x>=0&&e.x<t&&e.y>=0&&e.y<n);if(i.length===0)return;let a=g,o;try{o=await e.pickVisibility(i.map(({screen:e})=>({x:e.x/t,y:e.y/n,depth:e.depth*.9})),mu/n)}catch{return}m||a!==g||i.forEach((e,t)=>{e.setOccluded((o[t]??0)>=pu)})},b=()=>{h&&clearTimeout(h),h=setTimeout(y,fu)},x=1,S=()=>{let e=i();e<x&&(d.revealed=!1),x=e};a.on(`framerender`,S);let C=()=>{let e=n.getWorldTransform(),{projectionMatrix:t}=n.camera,r=_.equals(e)&&v.equals(t),a=i(),{activeAnnotation:o}=d,s=o?.screen,c=s&&s.x>=0&&s.x<=u.clientWidth&&s.y>=0&&s.y<=u.clientHeight;o&&!d.revealed&&(r||a>=hu&&c)&&o.revealTooltip(),r||(_.copy(e),v.copy(t),g++,b())};a.on(`frameend`,C);let w=a.systems.gsplat,T=!1,E=(e,t,r)=>{e===n.camera&&(r&&!T&&(g++,b()),T=r)};w.on(`frame:ready`,E),this.removeOcclusion=()=>{m=!0,h&&clearTimeout(h),a.off(`framerender`,S),a.off(`frameend`,C),w.off(`frame:ready`,E)};let D=()=>{let e=(o.cameraMode===`walk`||o.cameraMode===`fly`)&&o.gamingControls,t=!o.loaded||!o.showAnnotations||o.controlsHidden||e,n=l.style.display===`none`;l.style.display=t?`none`:`block`,n&&!t&&b();let r=t||o.selectedAnnotation===null?null:p[o.selectedAnnotation];r!==d.activeAnnotation&&(d.activeAnnotation?.hideTooltip(),r?.showTooltip()),a.renderNextFrame=!0};this.subscriptions=[s.on(`loaded:changed`,D),s.on(`selectedAnnotation:changed`,D),s.on(`controlsHidden:changed`,D),s.on(`showAnnotations:changed`,D),s.on(`cameraMode:changed`,D),s.on(`gamingControls:changed`,D)],D();let O=0,k=()=>{O=0},A=e=>{e.buttons&&(O+=Math.abs(e.movementX)+Math.abs(e.movementY))},j=()=>{let t=O>=au;O=0,!t&&o.loaded&&o.selectedAnnotation!==null&&e.selectAnnotation(null)};t.addEventListener(`pointerdown`,k),t.addEventListener(`pointermove`,A),t.addEventListener(`click`,j),this.removeClick=()=>{t.removeEventListener(`pointerdown`,k),t.removeEventListener(`pointermove`,A),t.removeEventListener(`click`,j)}}destroy(){for(let e of this.subscriptions)e.off();this.removeClick(),this.removeOcclusion(),this.parent.destroy(),this.parentDom.remove()}},_u=(e,t)=>{let{state:n,events:r}=e,i=t.querySelector(`.sse-orbitCamera`),a=t.querySelector(`.sse-flyCamera`),o=t.querySelector(`.sse-fpsCamera`),s=t.querySelector(`.sse-reset`),c=t.querySelector(`.sse-frame`),l=()=>{i.classList.toggle(`sse-active`,n.cameraMode===`orbit`),a.classList.toggle(`sse-active`,n.cameraMode===`fly`),o.classList.toggle(`sse-active`,n.cameraMode===`walk`),o.classList.toggle(`sse-hidden`,!n.walkAllowed),a.classList.toggle(`sse-middle`,n.walkAllowed),a.classList.toggle(`sse-right`,!n.walkAllowed);for(let e of[i,a,o,s,c])e.disabled=!n.loaded},u=()=>{n.cameraMode=`orbit`},d=()=>{n.cameraMode=`fly`},f=()=>e.toggleWalk(),p=()=>e.resetCamera(),m=()=>e.frameScene();i.addEventListener(`click`,u),a.addEventListener(`click`,d),o.addEventListener(`click`,f),s.addEventListener(`click`,p),c.addEventListener(`click`,m);let h=[r.on(`cameraMode:changed`,l),r.on(`walkAllowed:changed`,l),r.on(`loaded:changed`,l)];return l(),()=>{for(let e of h)e.off();i.removeEventListener(`click`,u),a.removeEventListener(`click`,d),o.removeEventListener(`click`,f),s.removeEventListener(`click`,p),c.removeEventListener(`click`,m)}},vu=`controlsPanelOpen`,yu=()=>{try{return localStorage.getItem(vu)!==`false`}catch{return!0}},bu=e=>{try{localStorage.setItem(vu,String(e))}catch{}},xu=e=>({kind:`key`,label:e}),Su=(e,t)=>({kind:`mouse`,button:e,suffix:t}),Cu=[`W`,`A`,`S`,`D`].map(xu),wu={kind:`or`},Tu={left:`<path class="sse-mouseActive" d="M1 9a8 8 0 0 1 8-8v8Z"/>`,right:`<path class="sse-mouseActive" d="M17 9a8 8 0 0 0-8-8v8Z"/>`,wheel:`<rect class="sse-mouseActive" x="7.5" y="3.5" width="3" height="6" rx="1.5"/>`,none:``},Eu=e=>`<svg class="sse-mouseIcon" viewBox="0 0 18 26" aria-hidden="true">${Tu[e]}<rect class="sse-mouseBody" x="1" y="1" width="16" height="24" rx="8"/><path class="sse-mouseSplit" d="M9 1v8M1 9h16"/></svg>`,Du=`<svg class="sse-dragIcon" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1v10M1 6h10M4 3l2-2 2 2M4 9l2 2 2-2M3 4 1 6l2 2M9 4l2 2-2 2"/></svg>`,Ou={orbit:`help.section.orbit`,fly:`help.section.fly`,walk:`help.section.walk`,anim:`help.section.anim`},ku={orbit:`#orbitIcon`,fly:`#flyIcon`,walk:`#walkIcon`,anim:`#playIcon`},Au=e=>e.gamingControls&&(e.cameraMode===`fly`||e.cameraMode===`walk`),ju=(e,t)=>{let{cameraMode:n}=e,r=Au(e),i=xu(t(`help.key.space`)),a=xu(t(`help.key.esc`)),o=[`run-slow`,xu(`Shift`),wu,xu(`Ctrl`)],s=[`reset-camera`,xu(`R`)],c=e=>({kind:`gesture`,label:t(`help.key.${e}`)}),l;if(e.inputMode===`desktop`){switch(n){case`orbit`:l=[[`orbit`,Su(`left`,`drag`)],[`pan`,Su(`right`,`drag`)],[`zoom`,Su(`wheel`)],[`set-focus`,Su(`left`)],[`fly-to-point`,Su(`left`,`double`)],[`frame-scene`,xu(`F`)],s];break;case`fly`:l=r?[[`look-around`,Su(`none`,`drag`)],[`move`,...Cu],[`vertical`,xu(`Q`),xu(`E`)],o,s,[`release-mouse`,a]]:[[`fly-to`,Su(`left`)],[`look-around`,Su(`left`,`drag`)],[`pan`,Su(`right`,`drag`)],[`focus-point`,Su(`left`,`double`)],[`move`,...Cu],o,s];break;case`walk`:l=r?[[`look-around`,Su(`none`,`drag`)],[`move`,...Cu],[`jump`,i],o,s,[`release-mouse`,a]]:[[`walk-to`,Su(`left`)],[`look-around`,Su(`left`,`drag`)],[`fly-to-point`,Su(`left`,`double`)],[`move`,...Cu],o,s,[`exit-walk`,a]];break;case`anim`:l=[[`play-pause`,i],[`exit-cancel`,a]]}r||l.push(null,[`toggle-controls`,xu(`H`)],[`toggle-help`,xu(`Shift`),xu(`H`)])}else switch(n){case`orbit`:l=[[`orbit`,c(`one-finger-drag`)],[`pan`,c(`two-finger-drag`)],[`zoom`,c(`pinch`)],[`set-focus`,c(`tap`)],[`fly-to-point`,c(`double-tap`)]];break;case`fly`:l=r?[[`look-around`,c(`touch-drag`)],[`move`,c(`joystick`)]]:[[`fly-to`,c(`tap`)],[`look-around`,c(`touch-drag`)],[`move`,c(`pinch-two-finger`)],[`focus-point`,c(`double-tap`)]];break;case`walk`:l=r?[[`look-around`,c(`touch-drag`)],[`move`,c(`joystick`)],[`jump`,c(`tap`)]]:[[`walk-to`,c(`tap`)],[`look-around`,c(`touch-drag`)],[`fly-to-point`,c(`double-tap`)]];break;case`anim`:l=[]}return{title:t(Ou[n]),subtitle:r?t(`settings.gaming-controls`):``,icon:ku[n],rows:l}},Mu=e=>{let t=(e,t)=>{let n=document.createElement(`span`);return n.className=e,t&&(n.textContent=t),n},n=e=>{let t=document.createElement(`kbd`);return t.className=`sse-key`,t.textContent=e,t};switch(e.kind){case`key`:return n(e.label);case`mouse`:{let n=t(`sse-mouse`);return n.innerHTML=(e.suffix===`drag`?Du:``)+Eu(e.button),e.suffix===`double`&&n.prepend(t(`sse-mouseCount`,`×2`)),n}case`gesture`:return t(`sse-gesture`,e.label);case`or`:return t(`sse-or`,`/`)}},Nu=(e,t,n)=>{let{state:r,events:i}=e,a=t.querySelector(`.sse-controlsHintIcon > use`),o=t.querySelector(`.sse-controlsHintTitle`),s=t.querySelector(`.sse-controlsHintSubtitle`),c=t.querySelector(`.sse-controlsHintRows`),l=``,u=e=>{a.setAttribute(`href`,e.icon),o.textContent=e.title,s.textContent=e.subtitle,c.replaceChildren(...e.rows.map(e=>{let t=document.createElement(`div`);if(!e)return t.className=`sse-divider`,t;let[r,...i]=e,a=document.createElement(`span`);a.className=`sse-controlsHintAction`,a.textContent=n(`help.action.${r}`);let o=document.createElement(`span`);return o.className=`sse-controlsHintInputs`,o.append(...i.map(Mu)),t.className=`sse-controlsHintItem`,t.append(a,o),t}))},d=()=>{let e=`${r.cameraMode}:${r.inputMode}:${Au(r)}`;e!==l&&(l=e,u(ju(r,n)))},f=[i.on(`cameraMode:changed`,d),i.on(`inputMode:changed`,d),i.on(`gamingControls:changed`,d)];return d(),()=>{for(let e of f)e.off()}},Pu=(e,t)=>{let n=t.querySelector(`.sse-enterFullscreen`),r=t.querySelector(`.sse-exitFullscreen`),i=()=>{n.classList.toggle(`sse-hidden`,e.state.isFullscreen),r.classList.toggle(`sse-hidden`,!e.state.isFullscreen)},a=()=>{e.requestFullscreen().catch(()=>{})},o=()=>{e.exitFullscreen().catch(()=>{})},s=()=>{screen.orientation.type.startsWith(`landscape`)?a():o()};n.addEventListener(`click`,a),r.addEventListener(`click`,o),screen.orientation?.addEventListener(`change`,s);let c=e.events.on(`isFullscreen:changed`,i);return i(),()=>{c.off(),n.removeEventListener(`click`,a),r.removeEventListener(`click`,o),screen.orientation?.removeEventListener(`change`,s)}},Fu=(e,t)=>{let{state:n,events:r}=e,i={joystickBase:t.querySelector(`.sse-joystickBase`),joystick:t.querySelector(`.sse-joystick`)},a=!1,o=null,s=0,c=0,l=`2d`,u=0,d=()=>{let t=o;o=null,s=c=0,i.joystick.style.top=`30px`,i.joystick.style.left=l===`2d`?`30px`:`8px`,t!==null&&(a||e.setMoveInput(0,0),i.joystickBase.hasPointerCapture(t)&&i.joystickBase.releasePointerCapture(t))},f=()=>{d(),(n.cameraMode===`fly`||n.cameraMode===`walk`)&&n.inputMode===`touch`&&n.gamingControls&&n.loaded&&n.xrMode===null?(i.joystickBase.classList.remove(`sse-hidden`),i.joystickBase.classList.toggle(`sse-mode-2d`,l===`2d`),i.joystick.style.top=`30px`,l===`2d`?i.joystick.style.left=`30px`:i.joystick.style.left=`8px`):i.joystickBase.classList.add(`sse-hidden`)},p=[`cameraMode`,`inputMode`,`gamingControls`,`loaded`,`xrMode`].map(e=>r.on(`${e}:changed`,f)),m=(t,n)=>{let r=i.joystickBase.getBoundingClientRect(),a=n-(r.top+r.height/2),o=Math.max(-30,Math.min(30,a));if(c=o/30,i.joystick.style.top=`${30+o}px`,l===`2d`){let e=t-(r.left+r.width/2),n=Math.max(-30,Math.min(30,e));s=n/30,i.joystick.style.left=`${30+n}px`}else s=0;e.setMoveInput(s,-c)},h=e=>{if(o!==null)return;let t=Date.now();t-u<300?(l=l===`1d`?`2d`:`1d`,f(),u=0):u=t,o=e.pointerId,i.joystickBase.setPointerCapture(e.pointerId),m(e.clientX,e.clientY),e.preventDefault(),e.stopPropagation()},g=e=>{e.pointerId===o&&(m(e.clientX,e.clientY),e.preventDefault())},_=e=>{e.pointerId===o&&d()};return i.joystickBase.addEventListener(`pointerdown`,h),i.joystickBase.addEventListener(`pointermove`,g),i.joystickBase.addEventListener(`pointerup`,_),i.joystickBase.addEventListener(`pointercancel`,_),i.joystickBase.addEventListener(`lostpointercapture`,_),window.addEventListener(`blur`,d),document.addEventListener(`visibilitychange`,d),f(),()=>{a=!0,d();for(let e of p)e.off();i.joystickBase.removeEventListener(`pointerdown`,h),i.joystickBase.removeEventListener(`pointermove`,g),i.joystickBase.removeEventListener(`pointerup`,_),i.joystickBase.removeEventListener(`pointercancel`,_),i.joystickBase.removeEventListener(`lostpointercapture`,_),window.removeEventListener(`blur`,d),document.removeEventListener(`visibilitychange`,d)}},Iu=(e,t,n)=>{let{state:r,events:i}=e,a=t.querySelector(`.sse-play`),o=t.querySelector(`.sse-pause`),s=t.querySelector(`.sse-timelineContainer`),c=t.querySelector(`.sse-handle`),l=t.querySelector(`.sse-time`),u=()=>r.loaded&&r.hasAnimation,d=()=>r.hasSequence||r.cameraMode===`anim`,f=()=>{let e=d()&&!r.animationPaused;a.classList.toggle(`sse-hidden`,!u()||e),o.classList.toggle(`sse-hidden`,!u()||!e),s.classList.toggle(`sse-hidden`,!u()||!d())},p=()=>{let e=r.animationDuration>0?r.animationTime/r.animationDuration*100:0;c.style.left=`${e}%`,l.style.left=`${e}%`,l.innerText=`${r.animationTime.toFixed(1)}s`},m=()=>{u()&&(r.hasSequence||(r.cameraMode=`anim`),r.animationPaused=!1)},h=()=>{u()&&(r.hasSequence||(r.cameraMode=`anim`),r.animationPaused=!0)},g=t=>{let i=s.getBoundingClientRect();if(i.width<=0)return;let a=Math.max(0,Math.min(1,(t.clientX-i.left)/i.width));e.seek(r.animationDuration*a),n()},_=null,v=e=>{_===null&&e.button===0&&u()&&(r.animationPaused=!0,g(e),_=e.pointerId,s.setPointerCapture(_),l.classList.remove(`sse-hidden`))},y=e=>{e.pointerId===_&&g(e)},b=e=>{e.pointerId===_&&(_=null,l.classList.add(`sse-hidden`),s.hasPointerCapture(e.pointerId)&&s.releasePointerCapture(e.pointerId))};a.addEventListener(`click`,m),o.addEventListener(`click`,h),s.addEventListener(`pointerdown`,v),s.addEventListener(`pointermove`,y),s.addEventListener(`pointerup`,b),s.addEventListener(`pointercancel`,b),s.addEventListener(`lostpointercapture`,b);let x=[i.on(`loaded:changed`,f),i.on(`hasAnimation:changed`,f),i.on(`hasSequence:changed`,f),i.on(`cameraMode:changed`,f),i.on(`animationPaused:changed`,f),i.on(`animationTime:changed`,p),i.on(`animationDuration:changed`,p)];return f(),p(),()=>{for(let e of x)e.off();a.removeEventListener(`click`,m),o.removeEventListener(`click`,h),s.removeEventListener(`pointerdown`,v),s.removeEventListener(`pointermove`,y),s.removeEventListener(`pointerup`,b),s.removeEventListener(`pointercancel`,b),s.removeEventListener(`lostpointercapture`,b),_!==null&&s.hasPointerCapture(_)&&s.releasePointerCapture(_)}},Lu=(e,t,n)=>{let{state:r,events:i}=e,a=t.querySelector(`.sse-vrPrompt`),o=t.querySelector(`.sse-vrPromptPill`),s=t.querySelector(`.sse-vrPromptText`),c=!1,l=!1,u=()=>{a.classList.toggle(`sse-hidden`,l||!r.canStartVR||r.xrMode!==null),a.classList.toggle(`sse-vrPromptLoading`,!c),s.textContent=n(c?`vr-prompt.enter`:`vr-prompt.loading`)},d=e=>{o.contains(e.target)?c&&i.fire(`vrPrompt:start`):(l=!0,u())};a.addEventListener(`click`,d);let f=[i.on(`vrPrompt:ready`,()=>{c=!0,u()}),i.on(`canStartVR:changed`,u),i.on(`xrMode:changed`,e=>{e&&(l=!0),u()})];return u(),()=>{for(let e of f)e.off();a.removeEventListener(`click`,d)}},Ru=(e,t)=>{let{state:n,events:r}=e,i=t.querySelector(`.sse-arMode`),a=t.querySelector(`.sse-vrMode`),o=t.querySelector(`.sse-xrModal`),s=t.querySelector(`.sse-xrModalOk`),c=t.querySelector(`.sse-xrModalCancel`),l=()=>{i.classList.toggle(`sse-hidden`,!n.hasAR),a.classList.toggle(`sse-hidden`,!n.hasVR),i.disabled=a.disabled=!n.loaded||n.xrMode!==null},u=t=>{(t===`ar`?n.canStartAR:n.canStartVR)?e.startXR(t).catch(()=>{}):(t===`ar`?n.hasAR:n.hasVR)&&o.classList.remove(`sse-hidden`)},d=()=>u(`ar`),f=()=>u(`vr`),p=()=>o.classList.add(`sse-hidden`),m=()=>{let e=new URL(location.href);e.searchParams.set(`webgl`,``),location.replace(e.toString())};i.addEventListener(`click`,d),a.addEventListener(`click`,f),s.addEventListener(`click`,m),c.addEventListener(`click`,p),o.addEventListener(`pointerdown`,p);let h=[r.on(`loaded:changed`,l),r.on(`hasAR:changed`,l),r.on(`hasVR:changed`,l),r.on(`xrMode:changed`,l)];return l(),()=>{for(let e of h)e.off();i.removeEventListener(`click`,d),a.removeEventListener(`click`,f),s.removeEventListener(`click`,m),c.removeEventListener(`click`,p),o.removeEventListener(`pointerdown`,p)}},zu=4e3,Bu=(e,t)=>{let n=t.querySelector(`.sse-xrHint`),r=!1,i=null,a=()=>{i!==null&&clearTimeout(i),i=null,n.classList.add(`sse-hidden`),r&&document.visibilityState===`visible`&&(i=setTimeout(()=>{i=null,n.classList.remove(`sse-hidden`)},zu))},o=e.events.on(`xrRequest:pending`,e=>{r=e,a()});return document.addEventListener(`visibilitychange`,a),()=>{o.off(),document.removeEventListener(`visibilitychange`,a),i!==null&&clearTimeout(i)}},Vu=0,Hu=9.81,Uu=.15,Wu=e=>{let t=e._arcPoints,n=t.length-1,r=null,i=e._getAimRay.bind(e);e._getAimRay=e=>{r=e,i(e)};let a=e._getArcVisual.bind(e);e._getArcVisual=e=>{let t=a(e);if(t.meshInstance.drawBucket!==Vu){t.meshInstance.drawBucket=Vu;for(let e of t.ringEntity.render.meshInstances)e.drawBucket=Vu}return t};let o=(e,r,i,a,o)=>{for(let s=0;s<=n;s++){let c=o*s/n;t[s].set(e.x+r*c,e.y+i*c-.5*Hu*c*c,e.z+a*c)}},s=(r,i,a,s=!0)=>{let c=e.teleportArcSpeed,l=i.x*c,u=i.y*c,d=i.z*c;a.valid=!1;let f,p=!1;if(e.castRay){let t=e.maxTeleportDistance+Math.max(0,r.y-e.entity.getPosition().y);f=(u+Math.sqrt(u*u+2*Hu*t))/Hu}else{let t=u*u+2*Hu*(r.y-e.groundHeight);f=t>=0?(u+Math.sqrt(t))/Hu:0,p=f>.001,p||(f=2*c/Hu)}if(o(r,l,u,d,f),e.castRay)for(let i=0;i<n;i++){let c=t[i],p=t[i+1],m=e.castRay(c,p);if(m){a.point.copy(m);let h=c.distance(p),g=h>1e-6?Math.min(c.distance(a.point)/h,1):0;o(r,l,u,d,f*(i+g)/n),t[n].copy(a.point),a.valid=s&&e.isValidTeleportDistance(a.point);return}}else p&&(a.point.copy(t[n]),a.point.y=e.groundHeight,a.valid=s&&e.isValidTeleportDistance(a.point))},c=new W,l=new W,u=new W,d=new W,f=(r,i)=>{c.copy(r.getOrigin()),l.copy(r.getDirection()),d.copy(r.grip?r.getPosition():c);let a=e.maxTeleportDistance*2,s=null;if(e.castRay)u.copy(l).mulScalar(a).add(c),s=e.castRay(c,u);else if(l.y<-.001){let t=(c.y-e.groundHeight)/-l.y;t>0&&t<a&&(s=u.copy(l).mulScalar(t).add(c))}if(!s)return!1;i.point.copy(s),i.valid=e.isValidTeleportDistance(i.point);let f=i.point.x-d.x,p=i.point.y-d.y,m=i.point.z-d.z,h=Math.sqrt(f*f+p*p+m*m),g=Math.max(Math.sqrt(8*Uu*h/Hu),.01);return o(d,f/g,p/g+.5*Hu*g,m/g,g),t[n].copy(i.point),!0};e._computeArcHit=(e,t,n)=>{if(r?.targetRayMode===`transient-pointer`){if(f(r,n))return;s(e,t,n,!1)}else s(e,t,n)}},Gu=.8,Ku=.4,qu=.3,Ju=.15,Yu=.5,Xu=.005,Zu=2,Qu=`
    attribute vec3 vertex_position;
    attribute vec2 aUv0;

    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;
    uniform vec3 uTarget;
    uniform float uTime;
    uniform float uScale;

    varying vec2 uv0;
    varying float dist;
    varying float crest;

    const float DROP_PERIOD = 1.6;
    const float DROP_SPEED = 0.6;
    const float RIPPLE_LENGTH = 0.12;
    const float RIPPLE_WIDTH = 0.1;
    const float RIPPLE_HEIGHT = 0.012;

    void main(void) {
        vec4 world = matrix_model * vec4(vertex_position, 1.0);
        float r = distance(world.xz, uTarget.xz) / uScale;
        float age = fract(uTime / DROP_PERIOD) * DROP_PERIOD;
        float x = r - age * DROP_SPEED;
        float envelope = exp(-(x * x) / (RIPPLE_WIDTH * RIPPLE_WIDTH)) * (1.0 - age / DROP_PERIOD);
        float wave = cos(6.2831853 * x / RIPPLE_LENGTH) * envelope;
        world.y += RIPPLE_HEIGHT * uScale * wave;
        gl_Position = matrix_viewProjection * world;
        uv0 = aUv0;
        dist = r;
        crest = max(wave, 0.0);
    }
`,$u=`
    attribute vertex_position: vec3f;
    attribute aUv0: vec2f;

    uniform matrix_model: mat4x4f;
    uniform matrix_viewProjection: mat4x4f;
    uniform uTarget: vec3f;
    uniform uTime: f32;
    uniform uScale: f32;

    varying uv0: vec2f;
    varying dist: f32;
    varying crest: f32;

    const DROP_PERIOD: f32 = 1.6;
    const DROP_SPEED: f32 = 0.6;
    const RIPPLE_LENGTH: f32 = 0.12;
    const RIPPLE_WIDTH: f32 = 0.1;
    const RIPPLE_HEIGHT: f32 = 0.012;

    @vertex
    fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        var world = uniform.matrix_model * vec4f(input.vertex_position, 1.0);
        let r = distance(world.xz, uniform.uTarget.xz) / uniform.uScale;
        let age = fract(uniform.uTime / DROP_PERIOD) * DROP_PERIOD;
        let x = r - age * DROP_SPEED;
        let envelope = exp(-(x * x) / (RIPPLE_WIDTH * RIPPLE_WIDTH)) * (1.0 - age / DROP_PERIOD);
        let wave = cos(6.2831853 * x / RIPPLE_LENGTH) * envelope;
        world.y += RIPPLE_HEIGHT * uniform.uScale * wave;
        output.position = uniform.matrix_viewProjection * world;
        output.uv0 = input.aUv0;
        output.dist = r;
        output.crest = max(wave, 0.0);
        return output;
    }
`,ed=`
    uniform vec4 uColor;
    uniform float uRadius;

    varying vec2 uv0;
    varying float dist;
    varying float crest;

    // half a line's width in pixels
    const float LINE_HALF = 0.75;

    void main(void) {
        float fade = 1.0 - smoothstep(uRadius * 0.3, uRadius, dist);
        vec2 edge = min(uv0, 1.0 - uv0) / max(fwidth(uv0), vec2(1e-6));
        float line = 1.0 - smoothstep(LINE_HALF - 0.5, LINE_HALF + 0.5, min(edge.x, edge.y));
        gl_FragColor = vec4(uColor.rgb, uColor.a * fade * (line * (0.55 + 0.3 * crest) + 0.04));
    }
`,td=`
    uniform uColor: vec4f;
    uniform uRadius: f32;

    varying uv0: vec2f;
    varying dist: f32;
    varying crest: f32;

    const LINE_HALF: f32 = 0.75;

    @fragment
    fn fragmentMain(input: FragmentInput) -> FragmentOutput {
        var output: FragmentOutput;
        let fade = 1.0 - smoothstep(uniform.uRadius * 0.3, uniform.uRadius, input.dist);
        let edge = min(input.uv0, vec2f(1.0) - input.uv0) / max(fwidth(input.uv0), vec2f(1e-6));
        let line = 1.0 - smoothstep(LINE_HALF - 0.5, LINE_HALF + 0.5, min(edge.x, edge.y));
        output.color = vec4f(uniform.uColor.rgb, uniform.uColor.a * fade * (line * (0.55 + 0.3 * input.crest) + 0.04));
        return output;
    }
`,nd=new Uint32Array(2),rd=(e,t,n,r,i,a)=>{let{voxelResolution:o,leafSize:s,gridMinX:c,gridMinY:l,gridMinZ:u,flipXY:d}=e,f=d?-1:1,p=e=>f>0?e:-e-1,m=f*c,h=f*l,g=Math.ceil(i/o),_=Math.ceil(Ju*a/o),v=Math.ceil(Yu*a/o),y=Math.round((n-h)/o)-1,b=2*g+1,x=2*_+v+1,S=Math.floor((t-m)/o)-g,C=y-_,w=Math.floor((r-u)/o)-g,T=new Uint8Array(b*x*b),E=(e,t,n)=>(n*x+t)*b+e,D=[p(S),p(S+b-1)],O=[p(C),p(C+x-1)],k=Math.floor(Math.min(D[0],D[1])/s),A=Math.floor(Math.max(D[0],D[1])/s),j=Math.floor(Math.min(O[0],O[1])/s),M=Math.floor(Math.max(O[0],O[1])/s),N=Math.floor(w/s),P=Math.floor((w+b-1)/s);for(let t=N;t<=P;t++)for(let n=j;n<=M;n++)for(let r=k;r<=A;r++)if(e.readBlock(r,n,t,nd),nd[0]!==0||nd[1]!==0)for(let e=0;e<64;e++){if(!(nd[e>>5]>>>(e&31)&1))continue;let i=p(r*s+(e&3))-S,a=p(n*s+(e>>2&3))-C,o=t*s+(e>>4)-w;i>=0&&a>=0&&o>=0&&i<b&&a<x&&o<b&&(T[E(i,a,o)]=1)}let F=new Int16Array(b*b).fill(-1);for(let e=0;e<b;e++)for(let t=0;t<b;t++)for(let n=2*_;n>=0;n--){if(!T[E(t,n,e)])continue;let r=!0;for(let i=n+1;i<=n+v&&i<x&&r;i++)r=!T[E(t,i,e)];r&&(F[e*b+t]=n);break}let I=new Uint8Array(b*b),L=[],R=g*b+g;F[R]>=0&&Math.abs(F[R]-_)<=1&&(I[R]=1,L.push(R));let ee=(g+.5)*(g+.5);for(;L.length;){let e=L.pop(),t=e%b,n=(e-t)/b;for(let r=0;r<4;r++){let i=t+(r===0?1:r===1?-1:0),a=n+(r===2?1:r===3?-1:0);if(i<0||a<0||i>=b||a>=b||(i-g)*(i-g)+(a-g)*(a-g)>ee)continue;let o=a*b+i;I[o]||F[o]<0||Math.abs(F[o]-F[e])>1||(I[o]=1,L.push(o))}}let te=b+1,z=new Float32Array(te*te),ne=new Uint8Array(te*te);for(let e=0;e<b;e++)for(let t=0;t<b;t++){let n=e*b+t;if(I[n])for(let r=0;r<4;r++){let i=(e+(r>>1))*te+t+(r&1);z[i]+=F[n]+1,ne[i]++}}let re=[],ie=[],ae=[];for(let e=0;e<b;e++)for(let t=0;t<b;t++){if(!I[e*b+t])continue;let n=re.length/3;for(let n=0;n<4;n++){let r=n&1,i=n>>1,a=(e+r)*te+t+i,s=h+(C+z[a]/ne[a])*o+Xu;re.push(m+(S+t+i)*o,s,u+(w+e+r)*o),ie.push(r,i)}ae.push(n,n+1,n+3,n,n+3,n+2)}return{positions:new Float32Array(re),uvs:new Float32Array(ie),indices:new Uint32Array(ae)}},id=class{app;collision;material;entity;centre=new W;built=!1;scale=1;time=0;color=new Float32Array(4);target=new Float32Array(3);constructor(e,t){this.app=e,this.collision=t,this.material=new v({uniqueName:`sse-teleport-target`,vertexGLSL:Qu,fragmentGLSL:ed,vertexWGSL:$u,fragmentWGSL:td,attributes:{vertex_position:U,aUv0:We}}),this.material.blendType=2,this.material.cull=1,this.material.depthTest=!1,this.material.depthWrite=!1,this.material.update(),this.entity=new He(`TeleportTarget`,e),this.entity.addComponent(`render`,{castShadows:!1}),this.entity.enabled=!1,e.root.addChild(this.entity)}show(e,t,n,r){this.entity.enabled?this.time+=n:(this.entity.enabled=!0,this.time=0);let i=Math.min(r,Zu);(!this.built||i!==this.scale||this.centre.distance(e)>Ku*i)&&(this.scale=i,this.build(e));let a=Math.min(this.time/qu,1);this.target[0]=e.x,this.target[1]=e.y,this.target[2]=e.z,this.color[0]=t.r,this.color[1]=t.g,this.color[2]=t.b,this.color[3]=t.a,this.material.setParameter(`uTarget`,this.target),this.material.setParameter(`uTime`,this.time),this.material.setParameter(`uColor`,this.color),this.material.setParameter(`uScale`,i),this.material.setParameter(`uRadius`,Gu*(1-(1-a)*(1-a)))}hide(){this.entity.enabled=!1}destroy(){this.entity.destroy(),this.material.destroy()}build(e){this.centre.copy(e),this.built=!0;let{positions:t,uvs:n,indices:r}=rd(this.collision,e.x,e.y,e.z,1.2000000000000002*this.scale,this.scale);if(r.length===0){this.entity.render.meshInstances=[];return}let i=new re(this.app.graphicsDevice);i.setPositions(t),i.setUvs(0,n),i.setIndices(r),i.update(4);let a=new z(i,this.material);a.drawBucket=Vu,this.entity.render.meshInstances=[a]}},ad=.12,od=.024,sd=.004,cd=4e3,ld=.06,ud=3,dd=.06,fd=.06,pd=4,md=25,hd=.03,gd=.006,_d=.015,vd=.3,yd=.15,bd=.12,xd=.04,Sd=.004,Cd=.96,wd=.15,Td=.95,Ed=.004,Dd=.15,Od=1500,kd=700,Ad=.05,jd=.08,Md=.4,Nd=25,Pd=`rgba(20, 22, 28, 0.86)`,Fd=`rgba(58, 62, 72, 0.92)`,Id=`rgba(88, 94, 108, 0.96)`,Ld=`#4cc38a`,Rd=`rgba(255, 255, 255, 0.28)`,zd=[`index`,`middle`,`ring`,`pinky`],Bd=`‹  Back`,Vd=new W,Hd=new W,Ud=new W,Wd=new W,Gd=new J,Kd=new W,qd=new W,Jd=new W,Yd=new W,Xd=new W,Zd=new W,Qd=new tt,$d=(e,t,n,r,i,a)=>{e.beginPath(),e.roundRect(t,n,r,i,a),e.fill()},ef=e=>e*e*(3-2*e),tf=(e,t,n)=>e+(t-e)*n,nf=(e,t,n)=>e<t?Math.min(t,e+n):Math.max(t,e-n),rf=(e,t,n,r,i)=>{let a=document.createElement(`canvas`);a.width=Math.round(n*i),a.height=Math.round(r*i);let o=new H(e.graphicsDevice,{name:`sse-xr-quad`,width:a.width,height:a.height,format:20,mipmaps:!1,addressU:1,addressV:1}),s=new S;s.useLighting=!1,s.useSkybox=!1,s.useFog=!1,s.useTonemap=!1,s.diffuse.set(0,0,0),s.emissive.set(1,1,1),s.emissiveMap=o,s.opacityMap=o,s.opacityMapChannel=`a`,s.blendType=2,s.alphaTest=.1,s.depthTest=!1,s.update();let c=new He(`XrQuad`,e);c.addComponent(`render`,{type:`plane`,castShadows:!1,receiveShadows:!1}),c.render.material=s;for(let e of c.render.meshInstances)e.drawBucket=Vu;return c.setLocalEulerAngles(90,0,0),c.setLocalScale(n,1,r),c.enabled=!1,t.addChild(c),{entity:c,canvas:a,texture:o,material:s}},af=e=>{e.texture.setSource(e.canvas),e.texture.upload()},of=class{app;camera;items=[];pageOf=[];submenuPage=new Map;page=0;container;cursors;rows;anchor=null;toggleWasDown=!1;open=!1;openness=0;knobs;shown;hovered=null;hoveredSide=0;hitX=0;press=null;flash=null;flashUntil=0;pokeReady=!0;pokeTime=-1/0;time=0;audio=null;handles;constructor(e,t,n){this.app=e,this.camera=t;let r=(e,t)=>{this.items.push(e),this.pageOf.push(t)};for(let e of n)r(e,0);for(let e of n){if(!e.submenu)continue;let t=this.submenuPage.size+1;this.submenuPage.set(e,t),r({label:()=>Bd,action:()=>this.setPage(0)},t);for(let n of e.submenu)r(n,t)}this.container=new He(`XrPalmMenu`,e),e.root.addChild(this.container),this.rows=this.items.map(()=>this.createQuad(ad,od)),this.knobs=this.items.map(e=>+!!e.checked?.()),this.shown=this.items.map(()=>0),this.cursors=[0,1].map(()=>this.createQuad(Ed,Ed));for(let e of this.cursors)this.drawCursor(e);let{xr:i}=e;this.handles=[i.on(`start`,()=>this.hide()),i.on(`end`,()=>this.hide()),e.on(`update`,e=>this.update(e))],this.hide()}get isOpen(){return this.open}pointsAt(e){return this.open&&!e.hand&&!!this.pointedAt(e)}select(e){if(!this.open||e.hand)return!1;let t=this.pointedAt(e);if(!t)return!1;let n=this.sideOf(t),r=this.itemOf(t)?.stepper;return this.press||r&&!r.can(n)||this.startPress(e,t,n),!0}destroy(){this.cancelPress();for(let e of this.handles)e.off();for(let e of[...this.rows,...this.cursors])e.material.destroy(),e.texture.destroy();this.container.destroy(),this.audio?.close().catch(()=>{}),this.audio=null}createQuad(e,t){return rf(this.app,this.container,e,t,cd)}toQuad(e,t,n){return Gd.copy(e.entity.getWorldTransform()).invert(),Gd.transformPoint(t,n)}hits(e){Gd.copy(e.entity.getWorldTransform()).invert();let t=Gd.transformPoint(Vd,Ud),n=Gd.transformVector(Hd,Wd);if(t.y<=0||n.y>=0)return!1;let r=-t.y/n.y,i=t.x+n.x*r;return Math.abs(i)>.5||Math.abs(t.z+n.z*r)>.5?!1:(this.hitX=i,!0)}itemOf(e){let t=this.rows.indexOf(e);return t>=0?this.items[t]:null}sideOf(e){return this.itemOf(e)?.stepper?this.hitX<0?-1:1:0}pointedAt(e){return this.open?(Vd.copy(e.getOrigin()),Hd.copy(e.getDirection()),this.rows.find(e=>e.entity.enabled&&this.hits(e))??null):null}hide(){this.setOpen(!1),this.openness=0,this.page=0,this.anchor=null,this.toggleWasDown=!1;for(let e of this.rows)e.entity.enabled=!1;for(let e of this.cursors)e.entity.enabled=!1}setOpen(e){e!==this.open&&(this.cancelPress(),this.open=e,this.hovered=null,this.hoveredSide=0,this.flash=null,e&&(this.items.forEach((e,t)=>this.drawRow(t)),this.anchor&&this.anchorPose(this.anchor)&&(this.container.setPosition(Zd),this.container.setRotation(Qd))))}setPage(e){this.page=e,this.openness=0,this.hovered=null,this.hoveredSide=0,this.flash=null,this.items.forEach((t,n)=>{this.pageOf[n]===e&&this.drawRow(n)})}showing(e){return this.pageOf[e]===this.page&&(this.items[e].visible?.()??!0)}startPress(e,t,n){let r=()=>this.endPress();e.once(`selectend`,r),this.press={source:e,quad:t,side:n,over:!0,release:r},this.feedback(e),this.drawRow(this.rows.indexOf(t))}endPress(){let{press:e}=this;e&&(this.press=null,e.source.off(`selectend`,e.release),this.drawRow(this.rows.indexOf(e.quad)),e.over&&this.run(this.rows.indexOf(e.quad),e.side))}cancelPress(){this.press&&(this.press.over=!1),this.endPress()}run(e,t){let n=this.items[e],r=this.submenuPage.get(n);r===void 0?(n.stepper?n.stepper.step(t):n.action?.(),this.open&&this.drawRow(e)):this.setPage(r)}feedback(e){(e.gamepad?.hapticActuators?.[0])?.pulse(Md,Nd).catch(()=>{});try{this.audio??=new AudioContext}catch{return}let{audio:t}=this;t.state===`suspended`&&t.resume().catch(()=>{});let n=t.currentTime,r=t.createOscillator();r.frequency.setValueAtTime(Od,n),r.frequency.exponentialRampToValueAtTime(kd,n+Ad);let i=t.createGain();i.gain.setValueAtTime(jd,n),i.gain.exponentialRampToValueAtTime(.001,n+Ad),r.connect(i).connect(t.destination),r.start(n),r.stop(n+Ad)}update(e){this.app.xr.active&&(this.time+=e,this.updateAnchor(),this.follow(e),this.updateHover(),this.updateCursors(),this.updatePress(),this.animate(e))}get scale(){return this.camera.parent?.getScale().x??1}preferred(){let e=this.app.xr.input.inputSources.filter(e=>e.handedness!==`none`&&(!e.hand||e.hand.tracking));return e.find(e=>e.handedness===`left`)??e[0]??null}updateAnchor(){let e=this.preferred();if(e!==this.anchor&&(this.anchor=e,this.toggleWasDown=!1,this.setOpen(!1)),!e)return;if(e.hand){this.setOpen(this.palmFacing(e));return}let t=!!e.gamepad?.buttons[pd]?.pressed;t&&!this.toggleWasDown&&this.setOpen(!this.open),this.toggleWasDown=t}palmNormal(e){let t=e.hand;if(!t?.tracking)return!1;let n=t.getJointById(`middle-finger-metacarpal`),r=t.getJointById(`index-finger-metacarpal`),i=t.getJointById(`pinky-finger-metacarpal`);return!n||!r||!i?!1:(Kd.sub2(n.getPosition(),t.wrist.getPosition()),qd.sub2(i.getPosition(),r.getPosition()),Jd.cross(Kd,qd).normalize(),e.handedness===`left`&&Jd.mulScalar(-1),!0)}palmFacing(e){let t=e.hand;if(!t?.tracking)return!1;let n=ld*this.scale,r=0;for(let e of zd){let i=t.getJointById(`${e}-finger-tip`),a=t.getJointById(`${e}-finger-metacarpal`);i&&a&&i.getPosition().distance(a.getPosition())>n&&r++}return r<ud||!this.palmNormal(e)?!1:Jd.dot(this.camera.forward)<-.6}anchorPose(e){let t=this.scale,n=e.hand;if(n){let r=n.getJointById(`middle-finger-metacarpal`),i=n.getJointById(`middle-finger-phalanx-proximal`);if(!r||!i||!this.palmNormal(e))return!1;Zd.lerp(r.getPosition(),i.getPosition(),.5),Zd.add(Yd.copy(Jd).mulScalar(dd*t))}else{if(!e.grip)return!1;Zd.copy(e.getPosition()),Xd.sub2(this.camera.getPosition(),Zd),Xd.lengthSq()>1e-6&&Zd.add(Xd.normalize().mulScalar(fd*t))}if(Xd.sub2(this.camera.getPosition(),Zd),Xd.lengthSq()>1e-6){Xd.normalize();let e=Math.atan2(Xd.x,Xd.z)*(180/Math.PI),t=-Math.asin(Xd.y)*(180/Math.PI);Qd.setFromEulerAngles(t,e,0)}return!0}follow(e){if(!this.open&&this.openness<=0||!this.anchor||!this.anchorPose(this.anchor))return;let{container:t}=this,n=Math.min(1,md*e);t.setPosition(Yd.lerp(t.getPosition(),Zd,n)),t.setRotation(Qd.slerp(t.getRotation(),Qd,n));let r=this.scale;t.setLocalScale(r,r,r)}pointing(e){return e.targetRayMode===`tracked-pointer`&&!e.hand}updateHover(){let e=null,t=0;if(this.open){for(let n of this.app.xr.input.inputSources){if(!this.pointing(n))continue;let r=this.pointedAt(n);r&&(e=r,t=this.sideOf(r))}if(!e&&this.anchor?.hand){let n=this.poke(this.anchor);n&&(e=n,t=this.sideOf(n))}}if(this.flash&&this.time>=this.flashUntil){let e=this.flash;this.flash=null,this.drawRow(this.rows.indexOf(e))}if(e!==this.hovered||t!==this.hoveredSide){let n=this.hovered;this.hovered=e,this.hoveredSide=t,n&&n!==e&&this.drawRow(this.rows.indexOf(n)),e&&this.drawRow(this.rows.indexOf(e))}}poke(e){let t=this.app.xr.input.inputSources.find(t=>t!==e&&t.hand?.tracking),n=t?.hand.getJointById(`index-finger-tip`);if(!t||!n)return this.pokeReady=!0,null;Gd.copy(this.container.getWorldTransform()).invert(),Gd.transformPoint(n.getPosition(),Wd).z>_d&&(this.pokeReady=!0);let r=null,i=1/0;for(let e of this.rows){if(!e.entity.enabled)continue;let t=this.toQuad(e,n.getPosition(),Ud);Math.abs(t.x)>.5||Math.abs(t.z)>.5||t.y>hd||t.y<-.03||t.y>=i||(r=e,i=t.y,this.hitX=t.x)}if(!r)return null;if(i<gd&&this.pokeReady&&this.time-this.pokeTime>=vd){this.pokeReady=!1,this.pokeTime=this.time;let e=this.sideOf(r),n=this.itemOf(r)?.stepper;(!n||n.can(e))&&(this.feedback(t),this.flash=r,this.flashUntil=this.time+yd,this.run(this.rows.indexOf(r),e))}return r}updateCursors(){let e=0;if(this.open){Gd.copy(this.container.getWorldTransform()).invert();for(let t of this.app.xr.input.inputSources){if(e>=this.cursors.length)break;if(!this.pointing(t))continue;let n=Gd.transformPoint(t.getOrigin(),Ud),r=Gd.transformVector(t.getDirection(),Wd);if(r.z>=0||n.z<=0)continue;let i=-n.z/r.z,a=n.x+r.x*i,o=n.y+r.y*i;if(Math.hypot(a,o)>Dd)continue;let s=this.cursors[e++];s.entity.enabled=!0,s.entity.setLocalPosition(a,o,.001)}}for(let t=e;t<this.cursors.length;t++)this.cursors[t].entity.enabled=!1}updatePress(){let{press:e}=this;if(!e)return;if(!this.app.xr.input.inputSources.includes(e.source)){this.cancelPress();return}let t=this.pointedAt(e.source)===e.quad&&this.sideOf(e.quad)===e.side;t!==e.over&&(e.over=t,this.drawRow(this.rows.indexOf(e.quad)))}animate(e){let t=this.items.filter((e,t)=>this.showing(t)).length,n=bd+xd*Math.max(t-1,0);this.openness=nf(this.openness,+!!this.open,e/n);let r=0,i=.5*(t*od+Math.max(t-1,0)*sd);this.items.forEach((t,a)=>{let o=this.rows[a],s=this.showing(a),c=s?Math.min(Math.max((this.openness*n-r*xd)/bd,0),1):0,l=ef(c);if(o.entity.enabled=c>0,t.checked){let n=+!!t.checked(),r=o.entity.enabled?nf(this.knobs[a],n,e/wd):n;r!==this.knobs[a]&&(this.knobs[a]=r,o.entity.enabled&&this.drawRow(a))}if(s){if(o.entity.enabled){o.entity.setLocalPosition(0,i-od*.5+(1-l)*Sd,0);let e=tf(Cd,1,l)*this.pressScale(o);o.entity.setLocalScale(ad*e,1,od*e),l!==this.shown[a]&&(this.shown[a]=l,o.material.opacity=l,o.material.update())}i-=.028,r++}})}pressed(e){return this.press?.quad===e&&this.press.over||this.flash===e}pressScale(e){return this.pressed(e)?Td:1}fill(e,t){return this.pressed(e)?Id:this.hovered===e?Fd:t}drawRow(e){let t=this.rows[e],n=this.items[e];if(n.stepper){this.drawStepper(t,n,n.stepper);return}let{canvas:r}=t,i=r.getContext(`2d`),{width:a,height:o}=r;i.clearRect(0,0,a,o),i.fillStyle=this.fill(t,Pd),$d(i,1,1,a-2,o-2,o*.3);let s=o*.8,c=a-o*.3-s,l=o*.36,u=n.checked?c-o*.2-l:a-2*l,d=n.label(),f=e=>`500 ${e}px -apple-system, system-ui, sans-serif`,p=Math.round(o*.36);i.font=f(p);let m=i.measureText(d).width;if(m>u&&(i.font=f(Math.floor(p*u/m))),i.fillStyle=`#ffffff`,i.textBaseline=`middle`,i.fillText(d,l,o/2),n.checked){let t=ef(this.knobs[e]),n=o*.44,r=(o-n)/2;i.fillStyle=Rd,$d(i,c,r,s,n,n/2),i.globalAlpha=t,i.fillStyle=Ld,$d(i,c,r,s,n,n/2),i.globalAlpha=1,i.fillStyle=`#ffffff`,i.beginPath(),i.arc(tf(c+n/2,c+s-n/2,t),o/2,n*.4,0,Math.PI*2),i.fill()}this.upload(t)}drawStepper(e,t,n){let{canvas:r}=e,i=r.getContext(`2d`),{width:a,height:o}=r;i.clearRect(0,0,a,o),i.fillStyle=Pd,$d(i,1,1,a-2,o-2,o*.3);let s=this.press?.quad===e&&this.press.over?this.press.side:this.flash===e?this.hoveredSide:0,c=s||(this.hovered===e?this.hoveredSide:0);c&&n.can(c)&&(i.save(),i.beginPath(),i.roundRect(1,1,a-2,o-2,o*.3),i.clip(),i.fillStyle=s?Id:Fd,i.fillRect(c<0?0:a/2,0,a/2,o),i.restore());let l=o*.45,u=o*.09,d=o*.15;i.lineWidth=o*.06,i.lineCap=`round`,i.lineJoin=`round`;for(let e of[-1,1]){let t=e<0?l:a-l;i.strokeStyle=n.can(e)?`#ffffff`:Rd,i.beginPath(),i.moveTo(t-e*u,o/2-d),i.lineTo(t,o/2),i.lineTo(t-e*u,o/2+d),i.stroke()}let f=a-2*(l+o*.35),p=t.label(),m=e=>`500 ${e}px -apple-system, system-ui, sans-serif`,h=Math.round(o*.36);i.font=m(h);let g=i.measureText(p).width;g>f&&(i.font=m(Math.floor(h*f/g))),i.fillStyle=`#ffffff`,i.textAlign=`center`,i.textBaseline=`middle`,i.fillText(p,a/2,o/2),i.textAlign=`start`,this.upload(e)}drawCursor(e){let{canvas:t}=e,n=t.getContext(`2d`);n.clearRect(0,0,t.width,t.height);let r=t.width*.5;n.beginPath(),n.arc(r,r,r*.9,0,Math.PI*2),n.fillStyle=`rgba(20, 22, 28, 0.9)`,n.fill(),n.beginPath(),n.arc(r,r,r*.6,0,Math.PI*2),n.fillStyle=`#fff`,n.fill(),this.upload(e)}upload(e){af(e)}},sf=.8,cf=.65,lf=1,uf=.12,df=.003,ff=.004,pf=.55,mf=1.5,hf=.36,gf=.05,_f=4e3,vf=.09,yf=.8,bf=.2,xf=.9,Sf=.7,Cf=.3,wf=64,Tf=`
    attribute vec3 vertex_position;
    attribute vec2 aUv0;

    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;

    varying vec2 uv0;

    void main(void) {
        gl_Position = matrix_viewProjection * matrix_model * vec4(vertex_position, 1.0);
        uv0 = aUv0;
    }
`,Ef=`
    attribute vertex_position: vec3f;
    attribute aUv0: vec2f;

    uniform matrix_model: mat4x4f;
    uniform matrix_viewProjection: mat4x4f;

    varying uv0: vec2f;

    @vertex
    fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        output.position = uniform.matrix_viewProjection * uniform.matrix_model * vec4f(input.vertex_position, 1.0);
        output.uv0 = input.aUv0;
        return output;
    }
`,Df=`
    varying vec2 uv0;

    void main(void) {
        float r = length(uv0 * 2.0 - 1.0);
        float aa = fwidth(r);
        float band = smoothstep(0.72 - aa, 0.72, r) * (1.0 - smoothstep(0.95 - aa, 0.95, r));
        float fill = 0.15 * (1.0 - smoothstep(0.0, 0.72, r));
        gl_FragColor = vec4(vec3(0.95), max(0.85 * band, fill));
    }
`,Of=`
    varying uv0: vec2f;

    @fragment
    fn fragmentMain(input: FragmentInput) -> FragmentOutput {
        var output: FragmentOutput;
        let r = length(input.uv0 * 2.0 - vec2f(1.0));
        let aa = fwidth(r);
        let band = smoothstep(0.72 - aa, 0.72, r) * (1.0 - smoothstep(0.95 - aa, 0.95, r));
        let fill = 0.15 * (1.0 - smoothstep(0.0, 0.72, r));
        output.color = vec4f(vec3f(0.95), max(0.85 * band, fill));
        return output;
    }
`,kf=`
    attribute vec3 vertex_position;

    void main(void) {
        gl_Position = vec4(vertex_position.x * 2.0, vertex_position.z * 2.0, 0.0, 1.0);
    }
`,Af=`
    attribute vertex_position: vec3f;

    @vertex
    fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        output.position = vec4f(input.vertex_position.x * 2.0, input.vertex_position.z * 2.0, 0.0, 1.0);
        return output;
    }
`,jf=`
    uniform float uFade;

    void main(void) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, uFade);
    }
`,Mf=`
    uniform uFade: f32;

    @fragment
    fn fragmentMain(input: FragmentInput) -> FragmentOutput {
        var output: FragmentOutput;
        output.color = vec4f(0.0, 0.0, 0.0, uniform.uFade);
        return output;
    }
`,Nf=new W,Pf=new W,Ff=new W,If=new tt,Lf=new W,Rf=new W,zf=new W,Bf=class{app;rig;camera;grab;claimed;hintText;ring;ringMaterial;ray;rayMaterial;fade;fadeMaterial;hintHolder;hint;hintDrawn=``;active=!1;placed=!1;source=null;touches=new Map;held=new Set;placingTouch=null;pinch=null;pinchSpread=0;pinchHeading=0;pointers=new Map;aiming=null;ringAt=new W;ringFound=!1;baseAt=new W;goal=new W;gliding=!1;released=!1;asking=0;generation=0;waiting=null;handles;constructor(e,t,n,r,i,a){this.app=e,this.rig=t,this.camera=n,this.grab=r,this.claimed=i,this.hintText=a,this.ringMaterial=new v({uniqueName:`sse-xr-ar-placement-ring`,vertexGLSL:Tf,fragmentGLSL:Df,vertexWGSL:Ef,fragmentWGSL:Of,attributes:{vertex_position:U,aUv0:We}}),this.ringMaterial.blendType=2,this.ringMaterial.cull=0,this.ringMaterial.depthTest=!1,this.ringMaterial.depthWrite=!1,this.ringMaterial.update(),this.ring=new He(`XrArPlacementRing`,e),this.ring.addComponent(`render`,{type:`plane`,castShadows:!1,receiveShadows:!1}),this.ring.render.material=this.ringMaterial;for(let e of this.ring.render.meshInstances)e.drawBucket=Vu;this.ring.setLocalScale(uf,1,uf),this.ring.enabled=!1,e.root.addChild(this.ring),this.rayMaterial=new S,this.rayMaterial.useLighting=!1,this.rayMaterial.useSkybox=!1,this.rayMaterial.useFog=!1,this.rayMaterial.useTonemap=!1,this.rayMaterial.diffuse.set(0,0,0),this.rayMaterial.emissive.set(.95,.95,.95),this.rayMaterial.opacity=pf,this.rayMaterial.blendType=2,this.rayMaterial.depthTest=!1,this.rayMaterial.depthWrite=!1,this.rayMaterial.update(),this.ray=new He(`XrArPlacementRay`,e),this.ray.addComponent(`render`,{type:`cylinder`,castShadows:!1,receiveShadows:!1}),this.ray.render.material=this.rayMaterial;for(let e of this.ray.render.meshInstances)e.drawBucket=Vu;this.ray.enabled=!1,e.root.addChild(this.ray),this.fadeMaterial=new v({uniqueName:`sse-xr-ar-placement-fade`,vertexGLSL:kf,fragmentGLSL:jf,vertexWGSL:Af,fragmentWGSL:Mf,attributes:{vertex_position:U}}),this.fadeMaterial.blendState=new Ae(!0,0,0,6,0,0,6),this.fadeMaterial.cull=0,this.fadeMaterial.depthTest=!1,this.fadeMaterial.depthWrite=!1,this.fadeMaterial.update(),this.fade=new He(`XrArPlacementFade`,e),this.fade.addComponent(`render`,{type:`plane`,castShadows:!1,receiveShadows:!1}),this.fade.render.material=this.fadeMaterial;for(let e of this.fade.render.meshInstances)e.drawBucket=wf,e.cull=!1;this.fade.enabled=!1,e.root.addChild(this.fade),this.hintHolder=new He(`XrArPlacementHint`,e),e.root.addChild(this.hintHolder),this.hint=rf(e,this.hintHolder,hf,gf,_f);let o=e=>{if(!this.active||this.claimed(e))return;let t=this.pointers.get(e);if(t)this.aiming=t,this.ringFound=!1;else if(e.targetRayMode===`screen`){if(this.held.add(e),this.held.size===1)this.placingTouch=e,this.ringFound=!1;else if(this.held.size===2&&!this.pinch){this.placingTouch=null;let[e,t]=this.held;this.startPinch(e,t)}}},s=e=>{if(!this.active)return;let t=this.pointers.get(e);if(t){if(t!==this.aiming)return;this.aiming=null,this.ring.enabled&&this.placeAt(this.ringAt),this.ring.enabled=!1,this.ray.enabled=!1}else this.releaseTouch(e,!0)},c=e=>{this.active&&this.addPointer(e)},l=e=>{this.removePointer(e),this.releaseTouch(e,!1)},{input:u}=e.xr;u.on(`selectstart`,o),u.on(`selectend`,s),u.on(`add`,c),u.on(`remove`,l),this.handles=[e.on(`update`,e=>this.update(e)),e.xr.on(`update`,e=>this.readPointers(e)),{off:()=>{u.off(`selectstart`,o),u.off(`selectend`,s),u.off(`add`,c),u.off(`remove`,l)}}]}start(){let{hitTest:e}=this.app.xr;if(!this.released&&e.supported){if(!e.available)this.waiting??=e.once(`available`,()=>{this.waiting=null,this.app.xr.active&&this.start()});else if((!this.active||this.asking!==0||this.hasHitTest())&&(this.placed=!1,this.gliding=!1,this.aiming=null,this.setFade(cf),!this.active)){this.active=!0,this.generation++,this.asking=0;for(let e of this.app.xr.input.inputSources)this.addPointer(e);this.requestTouches([ee,P])}}}get surface(){return this.active&&this.placed?this.goal:null}stop(){this.active=!1,this.waiting?.off(),this.waiting=null,this.aiming=null,this.gliding=!1,this.ring.enabled=!1,this.ray.enabled=!1,this.hint.entity.enabled=!1,this.fade.enabled=!1,this.source?.remove(),this.source=null,this.touches.clear(),this.held.clear(),this.placingTouch=null,this.pinch=null;for(let e of[...this.pointers.keys()])this.removePointer(e)}destroy(){this.released=!0,this.stop();for(let e of this.handles)e.off();this.ring.destroy(),this.ringMaterial.destroy(),this.ray.destroy(),this.rayMaterial.destroy(),this.fade.destroy(),this.fadeMaterial.destroy(),this.hintHolder.destroy(),this.hint.material.destroy(),this.hint.texture.destroy()}setFade(e){this.fadeMaterial.setParameter(`uFade`,e),this.fade.enabled=!0}answered(e){e===this.generation&&(this.asking--,this.asking===0&&this.active&&!this.hasHitTest()&&(this.fade.enabled=!1))}hasHitTest(){return!!this.source||[...this.pointers.values()].some(e=>!!e.test)}placeAt(e){this.grab.basePoint(this.baseAt),this.goal.copy(e),this.gliding=!0,this.placed=!0,this.fade.enabled=!1,this.hint.entity.enabled=!1}addPointer(e){if(e.targetRayMode!==`tracked-pointer`||this.pointers.has(e))return;let t=e.inputSource.targetRaySpace,n={space:t,test:null,origin:new W,direction:new W,posed:!1,hit:new W,age:1/0,cancelled:!1};this.pointers.set(e,n);let r=this.app.xr.session,i=r?.requestHitTestSource?.bind(r);if(!i)return;let{generation:a}=this;this.asking++,i({space:t,entityTypes:[ee,P]}).catch(()=>i({space:t,entityTypes:[ee]})).then(e=>{n.cancelled?e.cancel():n.test=e,this.answered(a)}).catch(()=>{this.answered(a)})}removePointer(e){let t=this.pointers.get(e);t&&(t.cancelled=!0,t.test?.cancel(),this.pointers.delete(e))}readPointers(e){if(!this.active)return;let t=this.app.xr._referenceSpace;for(let n of this.pointers.values()){let r=e.getPose(n.space,t);if(n.posed=!!r,r){let{position:e,orientation:t}=r.transform;n.origin.set(e.x,e.y,e.z),If.set(t.x,t.y,t.z,t.w).transformVector(W.FORWARD,n.direction)}if(!n.test)continue;let i=e.getHitTestResults(n.test);for(let e of i){let r=e.getPose(t);if(!r)continue;let{position:i,orientation:a}=r.transform;If.set(a.x,a.y,a.z,a.w).transformVector(W.UP,Nf),Nf.y>=sf&&(n.hit.set(i.x,i.y,i.z),n.age=0);break}}}requestTouches(e){let{generation:t}=this;this.asking++,this.app.xr.hitTest.start({profile:`generic-touchscreen`,entityTypes:e,callback:(n,r)=>{let i=t===this.generation&&this.active&&!this.released;n||!r?(e.length>1&&i&&this.requestTouches([ee]),this.answered(t)):i?(this.source=r,this.answered(t),r.on(`result`,(e,t,n)=>{if(t.transformVector(W.UP,Nf),Nf.y<sf||!n)return;let r=this.touches.get(n);r||(r={hit:new W,age:1/0},this.touches.set(n,r)),r.hit.copy(e),r.age=0})):(r.remove(),this.answered(t))}})}releaseTouch(e,t){this.held.delete(e)?(this.touches.delete(e),this.pinch?this.pinch.includes(e)&&(this.pinch=null):e===this.placingTouch&&(this.placingTouch=null,t&&this.ring.enabled&&this.placeAt(this.ringAt),this.ring.enabled=!1)):this.touches.delete(e)}screenOf(e,t){If.copy(this.camera.getRotation()).invert().transformVector(e.getDirection(),t);let n=-t.z||1e-6;return t.set(t.x/n,t.y/n,0)}startPinch(e,t){this.pinch=[e,t],this.screenOf(e,Rf),this.screenOf(t,zf),Lf.sub2(zf,Rf),this.pinchSpread=Math.max(Lf.length(),1e-6),this.pinchHeading=Math.atan2(Lf.y,Lf.x),this.gliding=!1,this.ring.enabled=!1,this.grab.startAdjust()}updatePinch(){if(!this.pinch)return;let[e,t]=this.pinch;this.screenOf(e,Rf),this.screenOf(t,zf),Lf.sub2(zf,Rf);let n=Lf.length()/this.pinchSpread,r=(Math.atan2(Lf.y,Lf.x)-this.pinchHeading)%(Math.PI*2);r>Math.PI?r-=Math.PI*2:r<=-Math.PI&&(r+=Math.PI*2),this.grab.adjust(n,r)}update(e){if(!this.active)return;for(let t of this.pointers.values())t.age+=e;for(let t of this.touches.values())t.age+=e;let t=null,n=this.aiming;if(n)n.posed&&n.age<lf&&(t=n.hit);else if(this.placingTouch){let e=this.touches.get(this.placingTouch);e&&e.age<lf&&(t=e.hit)}this.updatePinch(),t&&(this.rig.getWorldTransform().transformPoint(t,Pf),this.ringFound?this.ringAt.lerp(this.ringAt,Pf,1-Math.exp(-10*e)):(this.ringAt.copy(Pf),this.ringFound=!0),this.ring.setPosition(this.ringAt.x,this.ringAt.y+df,this.ringAt.z)),this.ring.enabled=!!t,this.placeRay(),this.gliding&&(this.baseAt.lerp(this.baseAt,this.goal,1-Math.exp(-10*e)),this.baseAt.distance(this.goal)<.001&&(this.baseAt.copy(this.goal),this.gliding=!1),this.grab.moveTo(this.baseAt)),this.placed?this.hint.entity.enabled=!1:this.placeHint()}placeRay(){let e=this.aiming;if(!e?.posed){this.ray.enabled=!1;return}let t=this.rig.getWorldTransform();t.transformPoint(e.origin,Rf),this.ring.enabled?zf.copy(this.ringAt):(t.transformVector(e.direction,Lf).normalize(),zf.copy(Lf).mulScalar(mf).add(Rf)),Lf.sub2(zf,Rf);let n=Lf.length();n<.001?this.ray.enabled=!1:(Lf.mulScalar(1/n),If.setFromDirections(W.UP,Lf),this.ray.setRotation(If),this.ray.setPosition(Pf.add2(Rf,zf).mulScalar(.5)),this.ray.setLocalScale(ff,n,ff),this.ray.enabled=!0)}placeHint(){let e=this.pointers.size===0?this.camera.camera.camera.xrViews?.[0]:void 0;e?this.placeHintOnScreen(e.projMat.data):this.placeHintInWorld();let t=this.hintText(this.placingInput());t!==this.hintDrawn&&this.drawHint(t),this.hint.entity.enabled=!0}placingInput(){return this.pointers.size===0?`screen`:[...this.pointers.keys()].some(e=>!e.hand)?`controller`:`hand`}placeHintOnScreen(e){let t=Cf;Pf.set(e[8]*t/e[0],(e[9]-Sf)*t/e[5],-.3),this.camera.getWorldTransform().transformPoint(Pf,Pf),this.hintHolder.setPosition(Pf),this.hintHolder.setRotation(this.camera.getRotation());let n=2*xf*t/e[0]/hf*this.camera.getScale().x;this.hintHolder.setLocalScale(n,n,n)}placeHintInWorld(){let e=this.camera.getPosition();if(this.ring.enabled)Pf.set(this.ringAt.x,this.ringAt.y+vf,this.ringAt.z);else{let{forward:t}=this.camera;Ff.set(t.x,0,t.z).normalize(),Pf.set(e.x+Ff.x*yf,e.y-bf,e.z+Ff.z*yf)}this.hintHolder.setPosition(Pf),Ff.sub2(Pf,e).add(Pf),this.hintHolder.lookAt(Ff.x,Pf.y,Ff.z),this.hintHolder.setLocalScale(1,1,1)}drawHint(e){this.hintDrawn=e;let{canvas:t}=this.hint,n=t.getContext(`2d`),{width:r,height:i}=t;n.clearRect(0,0,r,i),n.fillStyle=`rgba(20, 22, 28, 0.86)`,n.beginPath(),n.roundRect(1,1,r-2,i-2,i*.3),n.fill();let a=e=>`500 ${e}px -apple-system, system-ui, sans-serif`,o=Math.round(i*.42);n.font=a(o);let s=r-i,c=n.measureText(e).width;c>s&&(n.font=a(Math.floor(o*s/c))),n.fillStyle=`#ffffff`,n.textAlign=`center`,n.textBaseline=`middle`,n.fillText(e,r/2,i/2),af(this.hint)}},Vf=e=>{let{xr:t}=e,n=t,r=e.graphicsDevice;return t.on(`update`,e=>{let i=t.graphicsBinding,a=n.xrBridge?.presentationLayer,o=n._referenceSpace;if(!i||!a||!o)return;let s=e.getViewerPose(o)?.views;if(s)for(let e of s){let t,n;try{let r=i.getViewSubImage(a,e);if(t=r.depthStencilTexture,!t)continue;n=r.getViewDescriptor?.()?.baseArrayLayer??0}catch{return}let o={view:t.createView({dimension:`2d`,baseMipLevel:0,mipLevelCount:1,baseArrayLayer:n,arrayLayerCount:1}),depthClearValue:1,depthLoadOp:`clear`,depthStoreOp:`store`};t.format.includes(`stencil`)&&(o.stencilLoadOp=`clear`,o.stencilStoreOp=`store`),r.getCommandEncoder().beginRenderPass({colorAttachments:[],depthStencilAttachment:o}).end()}})},Hf=.001,Uf=1e-4,Wf=.05,Gf=.1,Kf=.25,qf=4,Jf=new W,Yf=new W,Xf=new W,Zf=new W,Qf=new W,$f=new W,ep=new J,tp=(e,t)=>{let n=Math.cos(t),r=Math.sin(t),i=e.x*n+e.z*r;return e.z=-e.x*r+e.z*n,e.x=i,e},np=e=>(e%=Math.PI*2,e>Math.PI?e-Math.PI*2:e<=-Math.PI?e+Math.PI*2:e),rp=e=>{let{forward:t}=e;return Math.atan2(-t.x,-t.z)},ip=e=>e.grip||!!(e.hand?.tracking&&e.hand.wrist),ap=class{scale=1;enabled=!0;app;rig;onScale;first=null;second=null;rigPosition=new W;rigYaw=0;rigScale=1;grabMid=new W;grabHeading=null;grabDistance=0;setPosition=new W;setYaw=0;updating;paused=!1;menuActive;constructor(e,t,n){this.app=e,this.rig=t,this.onScale=n,this.updating=e.xr?.on(`update`,()=>this.update())??null,this.menuActive=e.on(`xr:menu:active`,e=>{this.paused=!!e})}end(){this.first=null,this.second=null}reset(){this.end(),this.scale!==1&&(this.rig.setLocalScale(1,1,1),this.scale=1,this.onScale(1))}destroy(){this.updating?.off(),this.menuActive.off(),this.end()}handPosition(e,t){return e.grip?t.copy(e.getLocalPosition()):ep.transformPoint(e.hand.wrist.getPosition(),t)}rebase(){let{rig:e}=this;this.rigPosition.copy(e.getPosition()),this.rigYaw=rp(e),this.rigScale=this.scale,this.setPosition.copy(this.rigPosition),this.setYaw=this.rigYaw,this.grabMid.add2(Jf,Yf).mulScalar(.5),Zf.sub2(Yf,Jf),this.grabDistance=Zf.length(),this.grabHeading=Math.hypot(Zf.x,Zf.z)>Uf?Math.atan2(Zf.x,Zf.z):null}update(){let{xr:e}=this.app;if(!e?.active||this.paused||!this.enabled){this.end();return}let t=e.input.inputSources,n=e=>t.includes(e)&&e.squeezing;if(this.first&&!(n(this.first)&&n(this.second))&&this.end(),ep.copy(this.rig.getWorldTransform()).invert(),!this.first){let e=null,n=null,r=null,i=null;for(let a of t)a.squeezing&&ip(a)&&(a.handedness===`left`&&!e?e=a:a.handedness===`right`&&!n&&(n=a),r?i||=a:r=a);[this.first,this.second]=e&&n?[e,n]:[r,i],this.first&&this.second?(this.handPosition(this.first,Jf),this.handPosition(this.second,Yf),this.rebase()):this.end();return}this.handPosition(this.first,Jf),this.handPosition(this.second,Yf);let{rig:r}=this;r.getPosition().equals(this.setPosition)&&rp(r)===this.setYaw||this.rebase(),Xf.add2(Jf,Yf).mulScalar(.5),Zf.sub2(Yf,Jf);let i=Zf.length(),a=Math.hypot(Zf.x,Zf.z)>Uf?Math.atan2(Zf.x,Zf.z):null,o=!1,s=this.rigYaw;a!==null&&this.grabHeading!==null?s-=np(a-this.grabHeading):o=!0;let c=Xf.y-this.grabMid.y,l=Math.sign(c)*Math.max(Math.abs(c)-Wf,0),u=Math.max(this.grabMid.y,Gf),d=1;i>Hf&&this.grabDistance>Hf?(d=i/this.grabDistance,d>1.15?d/=1.15:d<.85?d/=.85:d=1):o=!0;let f=this.rigScale*u/(Math.max(u+l,Gf)*d),p=q.clamp(f,1/qf,1/Kf);o||=p!==f,Qf.copy(this.grabMid),tp(Qf,this.rigYaw).mulScalar(this.rigScale).add(this.rigPosition),$f.copy(Xf),tp($f,s).mulScalar(p),$f.sub2(Qf,$f),$f.y=this.rigPosition.y,r.setPosition($f),r.setEulerAngles(0,s*q.RAD_TO_DEG,0),r.setLocalScale(p,p,p),this.setPosition.copy(r.getPosition()),this.setYaw=rp(r),p!==this.scale&&(this.scale=p,this.onScale(p)),o&&this.rebase()}},op=2.5,sp=.5,cp=.002,lp=`
    attribute vec3 vertex_position;

    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;

    varying vec3 world;

    void main(void) {
        vec4 position = matrix_model * vec4(vertex_position, 1.0);
        world = position.xyz;
        gl_Position = matrix_viewProjection * position;
    }
`,up=`
    attribute vertex_position: vec3f;

    uniform matrix_model: mat4x4f;
    uniform matrix_viewProjection: mat4x4f;

    varying world: vec3f;

    @vertex
    fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        let position = uniform.matrix_model * vec4f(input.vertex_position, 1.0);
        output.world = position.xyz;
        output.position = uniform.matrix_viewProjection * position;
        return output;
    }
`,dp=`
    uniform vec3 uCenter;
    uniform float uRadius;
    uniform float uCell;

    varying vec3 world;

    void main(void) {
        float fade = 1.0 - smoothstep(0.25, 1.0, distance(world.xz, uCenter.xz) / uRadius);
        vec2 cell = world.xz / uCell;
        vec2 edge = abs(fract(cell - 0.5) - 0.5) / fwidth(cell);
        float line = 1.0 - min(min(edge.x, edge.y), 1.0);
        gl_FragColor = vec4(vec3(0.85, 0.9, 0.95), fade * (0.06 + 0.3 * line));
    }
`,fp=`
    uniform uCenter: vec3f;
    uniform uRadius: f32;
    uniform uCell: f32;

    varying world: vec3f;

    @fragment
    fn fragmentMain(input: FragmentInput) -> FragmentOutput {
        var output: FragmentOutput;
        let fade = 1.0 - smoothstep(0.25, 1.0, distance(input.world.xz, uniform.uCenter.xz) / uniform.uRadius);
        let cell = input.world.xz / uniform.uCell;
        let edge = abs(fract(cell - vec2f(0.5)) - vec2f(0.5)) / fwidth(cell);
        let line = 1.0 - min(min(edge.x, edge.y), 1.0);
        output.color = vec4f(vec3f(0.85, 0.9, 0.95), fade * (0.06 + 0.3 * line));
        return output;
    }
`,pp=class{entity;material;center=new Float32Array(3);updating;constructor(e,t,n,r){this.material=new v({uniqueName:`sse-xr-ground-disc`,vertexGLSL:lp,fragmentGLSL:dp,vertexWGSL:up,fragmentWGSL:fp,attributes:{vertex_position:U}}),this.material.blendType=2,this.material.cull=0,this.material.depthWrite=!1,this.material.update(),this.entity=new He(`XrGroundDisc`,e),this.entity.addComponent(`render`,{type:`plane`,castShadows:!1,receiveShadows:!1}),this.entity.render.material=this.material;for(let e of this.entity.render.meshInstances)e.drawBucket=Vu;this.entity.enabled=!1,e.root.addChild(this.entity),this.updating=e.on(`update`,()=>{if(!this.entity.enabled)return;let e=r(),i=t.getPosition();this.entity.setPosition(i.x,n()+cp*e,i.z),this.entity.setLocalScale(op*2*e,1,op*2*e),this.center[0]=i.x,this.center[1]=n(),this.center[2]=i.z,this.material.setParameter(`uCenter`,this.center),this.material.setParameter(`uRadius`,op*e),this.material.setParameter(`uCell`,sp*e)})}set visible(e){this.entity.enabled=e}destroy(){this.updating.off(),this.entity.destroy(),this.material.destroy()}},mp=55e-5,hp=2.5,gp=.75,_p=.17,vp=.8,yp=32,bp=Math.cos(4*Math.PI/180).toFixed(4),xp=Math.cos(25*Math.PI/180).toFixed(4),Sp=.025,Cp=.075,wp=[.3,.85,1],Tp=.45,Ep=`
varying vRestPosition: vec3f;
`,Dp=`
    output.vRestPosition = vertex_position.xyz;
`,Op=`
varying vec3 vRestPosition;
`,kp=`
    vRestPosition = vertex_position.xyz;
`,Ap=`
uniform material_opacity: f32;
uniform material_alphaDitherScale: f32;

var<private> sseRim: f32;
var<private> sseSparkle: f32;

// three random numbers in [0, 1) for a cell (pcg3d)
fn sseHash(cell: vec3i) -> vec3f {
    var v = vec3u(cell) * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v = v ^ (v >> vec3u(16u));
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return vec3f(v >> vec3u(8u)) * (1.0 / 16777216.0);
}

#if defined(FORWARD_PASS) && defined(LIT_NEEDS_NORMAL)
// The flake of p's cell in a lattice of cells of the given size, px a pixel's size in metres and
// seed the lattice's level: a crisp disc where the skin cuts its ball, so every flake is as bright,
// faint until it faces the eye
fn sseFlake(p: vec3f, size: f32, px: f32, seed: i32) -> f32 {
    let q = p / size;
    let base = floor(q);
    let cell = vec3i(base) + vec3i(seed * 7919, seed * 104729, seed * 1299709);
    let centre = base + 0.25 + 0.5 * sseHash(cell);
    let tilt = sseHash(cell + vec3i(4096)) * 2.0 - 1.0;
    let shown = step(sseHash(cell + vec3i(8192)).x, ${gp});
    let w = 0.5 * px / size;
    let flake = 1.0 - smoothstep(${_p} - w, ${_p} + w, distance(q, centre));
    let facing = saturate(dot(normalize(dVertexNormalW + ${vp} * tilt), dViewDirW));
    return shown * flake * (0.3 + 3.7 * pow(facing, ${yp}.0));
}

// the lattice at the level whose cells span GLITTER_CELL_PIXELS, and the next coarser near its step
fn sseGlitter(p: vec3f, px: f32) -> f32 {
    let level = max(0.0, log2(px * ${hp.toFixed(1)} / ${mp}));
    let l0 = floor(level);
    let size = ${mp} * exp2(l0);
    let next = smoothstep(0.7, 1.0, level - l0);
    var sparkle = sseFlake(p, size, px, i32(l0)) * (1.0 - next);
    if (next > 0.0) {
        sparkle += sseFlake(p, size * 2.0, px, i32(l0) + 1) * next;
    }
    return sparkle;
}
#endif

fn getOpacity() {
    sseRim = 0.0;
    sseSparkle = 0.0;
    var alpha = uniform.material_opacity;
    var wrist = 1.0;
    #ifdef FORWARD_PASS
        wrist = 1.0 - smoothstep(${Sp}, ${Cp}, vRestPosition.y);
        #ifdef LIT_NEEDS_NORMAL
            let facing = saturate(abs(dot(dVertexNormalW, dViewDirW)));
            sseRim = pow(1.0 - facing, 2.5);
            alpha = alpha * (0.4 + 1.6 * sseRim);
            let p = vRestPosition;
            let px = length(fwidth(p));
            sseSparkle = sseGlitter(p, px) * smoothstep(${xp}, ${bp}, facing);
        #endif
    #endif
    dAlpha = saturate((alpha + 0.4 * sseSparkle) * wrist);
}
`,jp=`
uniform material_emissive: vec3f;
uniform material_emissiveIntensity: f32;

fn getEmission() {
    dEmission = uniform.material_emissive * uniform.material_emissiveIntensity * (0.5 + 1.5 * sseRim + 1.3 * sseSparkle);
}
`,Mp=`
uniform float material_opacity;
uniform float material_alphaDitherScale;

float sseRim;
float sseSparkle;

vec3 sseHash(ivec3 cell) {
    uvec3 v = uvec3(cell) * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return vec3(v >> 8u) * (1.0 / 16777216.0);
}

#if defined(FORWARD_PASS) && defined(LIT_NEEDS_NORMAL)
float sseFlake(vec3 p, float size, float px, int seed) {
    vec3 q = p / size;
    vec3 base = floor(q);
    ivec3 cell = ivec3(base) + ivec3(seed * 7919, seed * 104729, seed * 1299709);
    vec3 centre = base + 0.25 + 0.5 * sseHash(cell);
    vec3 tilt = sseHash(cell + ivec3(4096)) * 2.0 - 1.0;
    float shown = step(sseHash(cell + ivec3(8192)).x, ${gp});
    float w = 0.5 * px / size;
    float flake = 1.0 - smoothstep(${_p} - w, ${_p} + w, distance(q, centre));
    float facing = saturate(dot(normalize(dVertexNormalW + ${vp} * tilt), dViewDirW));
    return shown * flake * (0.3 + 3.7 * pow(facing, ${yp}.0));
}

float sseGlitter(vec3 p, float px) {
    float level = max(0.0, log2(px * ${hp.toFixed(1)} / ${mp}));
    float l0 = floor(level);
    float size = ${mp} * exp2(l0);
    float next = smoothstep(0.7, 1.0, level - l0);
    float sparkle = sseFlake(p, size, px, int(l0)) * (1.0 - next);
    if (next > 0.0) {
        sparkle += sseFlake(p, size * 2.0, px, int(l0) + 1) * next;
    }
    return sparkle;
}
#endif

void getOpacity() {
    sseRim = 0.0;
    sseSparkle = 0.0;
    float alpha = material_opacity;
    float wrist = 1.0;
    #ifdef FORWARD_PASS
        wrist = 1.0 - smoothstep(${Sp}, ${Cp}, vRestPosition.y);
        #ifdef LIT_NEEDS_NORMAL
            float facing = saturate(abs(dot(dVertexNormalW, dViewDirW)));
            sseRim = pow(1.0 - facing, 2.5);
            alpha *= 0.4 + 1.6 * sseRim;
            vec3 p = vRestPosition;
            float px = length(fwidth(p));
            sseSparkle = sseGlitter(p, px) * smoothstep(${xp}, ${bp}, facing);
        #endif
    #endif
    dAlpha = saturate((alpha + 0.4 * sseSparkle) * wrist);
}
`,Np=`
uniform vec3 material_emissive;
uniform float material_emissiveIntensity;

void getEmission() {
    dEmission = material_emissive * material_emissiveIntensity * (0.5 + 1.5 * sseRim + 1.3 * sseSparkle);
}
`,Pp=class{material=new S;constructor(){let{material:e}=this;e.useSkybox=!1,e.useFog=!1,e.useTonemap=!1,e.diffuse.set(0,0,0),e.specular.set(0,0,0),e.emissive.set(wp[0],wp[1],wp[2]),e.opacity=Tp,e.blendType=2,e.depthWrite=!1;let t=e.getShaderChunks(K);t.set(`litUserDeclarationVS`,Ep),t.set(`litUserMainEndVS`,Dp),t.set(`litUserDeclarationPS`,Ep),t.set(`opacityPS`,Ap),t.set(`emissivePS`,jp);let n=e.getShaderChunks(Te);n.set(`litUserDeclarationVS`,Op),n.set(`litUserMainEndVS`,kp),n.set(`litUserDeclarationPS`,Op),n.set(`opacityPS`,Mp),n.set(`emissivePS`,Np),e.shaderChunksVersion=`2.23`,e.update()}apply(e){for(let t of e.findComponents(`render`))for(let e of t.meshInstances)e.material=this.material,e.drawBucket=Vu}destroy(){this.material.destroy()}},Fp=.65,Ip=.42,Lp=.9,Rp=.77,zp=2,Bp=.2,Vp=3,Hp=1,Up=.15,Wp=.02,Gp=.01,Kp=.15,qp=.25,Jp=4,Yp=10*Math.PI/180,Xp=.02,Zp=.02,Qp=.0625,$p=.35,em=.8,tm=1.5,nm=.35,rm=.4,im=[.85,.3,0],am=[1,.4,0],om=[1,.85,.7],sm=`middle-finger-metacarpal`,cm=`
    attribute vec3 vertex_position;
    attribute vec2 aUv0;

    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;

    varying vec2 uv0;

    void main(void) {
        gl_Position = matrix_viewProjection * matrix_model * vec4(vertex_position, 1.0);
        uv0 = aUv0;
    }
`,lm=`
    attribute vertex_position: vec3f;
    attribute aUv0: vec2f;

    uniform matrix_model: mat4x4f;
    uniform matrix_viewProjection: mat4x4f;

    varying uv0: vec2f;

    @vertex
    fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        output.position = uniform.matrix_viewProjection * uniform.matrix_model * vec4f(input.vertex_position, 1.0);
        output.uv0 = input.aUv0;
        return output;
    }
`,um=`
    uniform float uProgress;
    uniform float uPulse;
    uniform float uBurst;

    varying vec2 uv0;

    // the ring's outer radius, a share of the quad's half width (the head's cap reaches past it),
    // and its inner, a share of that
    const float OUTER = 0.8;
    const float INNER = OUTER * 0.72;
    const vec3 START = vec3(${im.join(`, `)});
    const vec3 HEAD = vec3(${am.join(`, `)});
    const vec3 CAP = vec3(${om.join(`, `)});

    void main(void) {
        vec2 p = uv0 * 2.0 - 1.0;
        float r = length(p);
        float aa = fwidth(r);
        float band = smoothstep(INNER - aa, INNER, r) * (1.0 - smoothstep(OUTER - aa, OUTER, r));
        float angle = fract(atan(p.x, p.y) / 6.2831853 + 1.0);
        float filled = step(angle, uProgress);
        float tail = exp(-(uProgress - angle) * 10.0);
        vec3 fill = mix(START, HEAD, angle / max(uProgress, 0.001)) * (1.0 + 0.5 * tail + 0.3 * uPulse);
        vec3 rgb = mix(vec3(1.0), fill, filled);
        float a = band * mix(0.2, 0.75 + 0.25 * tail, filled);
        float headAngle = uProgress * 6.2831853;
        vec2 head = vec2(sin(headAngle), cos(headAngle)) * 0.5 * (INNER + OUTER);
        float capRadius = 0.5 * (OUTER - INNER) * (1.25 + 0.35 * uPulse);
        float cap = (1.0 - smoothstep(capRadius - aa, capRadius + aa, length(p - head))) * step(0.001, uProgress);
        rgb = mix(rgb, CAP, 0.7 * cap);
        a = max(a, cap);
        gl_FragColor = vec4(rgb, a * (1.0 - uBurst) * (1.0 - uBurst));
    }
`,dm=`
    uniform uProgress: f32;
    uniform uPulse: f32;
    uniform uBurst: f32;

    varying uv0: vec2f;

    const OUTER: f32 = 0.8;
    const INNER: f32 = OUTER * 0.72;
    const START = vec3f(${im.join(`, `)});
    const HEAD = vec3f(${am.join(`, `)});
    const CAP = vec3f(${om.join(`, `)});

    @fragment
    fn fragmentMain(input: FragmentInput) -> FragmentOutput {
        var output: FragmentOutput;
        let p = input.uv0 * 2.0 - vec2f(1.0);
        let r = length(p);
        let aa = fwidth(r);
        let band = smoothstep(INNER - aa, INNER, r) * (1.0 - smoothstep(OUTER - aa, OUTER, r));
        let angle = fract(atan2(p.x, p.y) / 6.2831853 + 1.0);
        let progress = uniform.uProgress;
        let filled = step(angle, progress);
        let tail = exp(-(progress - angle) * 10.0);
        let fill = mix(START, HEAD, angle / max(progress, 0.001)) * (1.0 + 0.5 * tail + 0.3 * uniform.uPulse);
        var rgb = mix(vec3f(1.0), fill, filled);
        var a = band * mix(0.2, 0.75 + 0.25 * tail, filled);
        let headAngle = progress * 6.2831853;
        let head = vec2f(sin(headAngle), cos(headAngle)) * 0.5 * (INNER + OUTER);
        let capRadius = 0.5 * (OUTER - INNER) * (1.25 + 0.35 * uniform.uPulse);
        let cap = (1.0 - smoothstep(capRadius - aa, capRadius + aa, length(p - head))) * step(0.001, progress);
        rgb = mix(rgb, CAP, 0.7 * cap);
        a = max(a, cap);
        let fade = 1.0 - uniform.uBurst;
        output.color = vec4f(rgb, a * fade * fade);
        return output;
    }
`,fm=new W,pm=new W,mm=new W,hm=new W,gm=new tt,_m=new tt,vm=new tt,ym=new tt,bm=new W,xm=new J,Sm=new J,Cm=new W,wm=e=>(e%=Math.PI*2,e>Math.PI?e-Math.PI*2:e<=-Math.PI?e+Math.PI*2:e),Tm=e=>{let t=e-1;return 1+2.70158*t*t*t+1.70158*t*t},Em=(e,t)=>e.find(e=>e.hand&&e.handedness===t)??e.find(e=>!e.hand&&e.grip&&e.handedness===t)??null,Dm=e=>e?e.hand?e.hand.tracking?e.hand.getJointById(sm)?.getPosition()??null:null:e.getPosition():null,Om=new W,km=new W,Am=e=>{let t=0;for(let n=1;n<=4;n++){let{joints:r}=e.fingers[n];Om.sub2(r[0].getPosition(),r[1].getPosition()),km.sub2(r[2].getPosition(),r[3].getPosition()),Om.dot(km)<0&&t++}return t},jm=new W,Mm=new W,Nm=new W,Pm=new J,Fm=(e,t,n)=>{let r=e.getJointById(`pinky-finger-phalanx-proximal`),i=e.getJointById(`index-finger-phalanx-proximal`),a=e.getJointById(`middle-finger-phalanx-proximal`),o=e.getJointById(`thumb-phalanx-distal`),s=e.getJointById(`wrist`);if(!r||!i||!a||!o||!s)return!1;Mm.sub2(i.getPosition(),r.getPosition()).normalize(),Nm.sub2(s.getPosition(),a.getPosition()),jm.copy(Mm).mulScalar(Nm.dot(Mm)),Nm.sub(jm).normalize(),jm.cross(Mm,Nm);let c=Pm.data;return c[0]=jm.x,c[1]=jm.y,c[2]=jm.z,c[4]=Mm.x,c[5]=Mm.y,c[6]=Mm.z,c[8]=Nm.x,c[9]=Nm.y,c[10]=Nm.z,n.setFromMat4(Pm),t.add2(i.getPosition(),o.getPosition()).mulScalar(.5),!0},Im=new tt().setFromEulerAngles(-52,0,0),Lm=(e,t,n,r)=>(n.mul2(e.getRotation(),Im),n.transformVector(W.UP,t),t.mulScalar(Wp*r).add(e.getPosition()),!0),Rm=class{app;entity;scene;scenePin;camera;userScale;onHolding;menuOpen;ring;material;on=!1;armed=0;openFor=Bp;lostFor=0;rightFor=0;pulse=0;burstFor=nm;popFor=rm;hold=!1;handPosition=new W;handRotation=new tt;homePosition=new W;homeRotation=new tt;homeScale=new W;pinLocal=new W;holdScale=1;bottom=0;size=1;resizeFrom=0;resizeSize=1;twist=new tt;gripHand=new tt;gripTwist=new tt;swingFrom=null;swung=0;updating;constructor(e,t,n,r,i,a,o,s){this.app=e,this.entity=t,this.scene=n,this.scenePin=r,this.camera=i,this.userScale=a,this.onHolding=o,this.menuOpen=s,this.material=new v({uniqueName:`sse-fist-hold-ring`,vertexGLSL:cm,fragmentGLSL:um,vertexWGSL:lm,fragmentWGSL:dm,attributes:{vertex_position:U,aUv0:We}}),this.material.blendType=2,this.material.cull=0,this.material.depthTest=!1,this.material.depthWrite=!1,this.material.update(),this.ring=new He(`XrIceCreamRing`,e),this.ring.addComponent(`render`,{type:`plane`,castShadows:!1,receiveShadows:!1}),this.ring.render.material=this.material;for(let e of this.ring.render.meshInstances)e.drawBucket=Vu;this.ring.enabled=!1,e.root.addChild(this.ring),this.updating=e.on(`update`,e=>this.update(e))}set enabled(e){this.on=e,e||(this.armed=0,this.release())}get enabled(){return this.on}get holding(){return this.hold}cancel(){this.armed=0,this.openFor=Bp,this.rightFor=0,this.burstFor=nm,this.popFor=rm,this.ring.enabled=!1,this.release()}destroy(){this.cancel(),this.updating.off(),this.ring.destroy(),this.material.destroy()}update(e){let{xr:t}=this.app;if(!t?.active)return;let n=t.input.inputSources,r=Em(n,`left`),i=!!r&&(r.hand?r.hand.tracking&&Fm(r.hand,this.handPosition,this.handRotation):Lm(r,this.handPosition,this.handRotation,this.userScale()));i?this.lostFor=0:this.lostFor+=e;let a=Em(n,`right`),o=Dm(a),s=!!a?.squeezing||i&&!!o&&o.distance(this.handPosition)<Up*this.userScale();if(i&&r&&!s){let t=this.openFor<Bp,n=r.squeezing||t&&!!r.hand&&Am(r.hand)>=Vp;this.openFor=n?0:this.openFor+e}let c=this.openFor<Bp;this.rightFor=a?.squeezing?this.rightFor+e:0;let l=this.rightFor>=Bp;if(this.hold?(!c||this.lostFor>Hp||!this.on)&&this.release():this.on&&c&&!l&&!this.menuOpen()&&this.lostFor<Bp&&this.upright()&&this.looking()?(i&&(this.armed+=e),this.armed>=zp&&(this.armed=0,this.burstFor=0,this.popFor=0,this.take())):this.armed=0,this.armed===0&&(this.pulse=0),this.hold&&l&&o){let e=Math.max(o.distance(this.handPosition),.001);if(this.resizeFrom===0)this.resizeFrom=e,this.resizeSize=this.size,this.gripHand.copy(this.handRotation),this.gripTwist.copy(this.twist),this.swingFrom=null,this.swung=0;else{let t=e/this.resizeFrom,n=t>1.15?t/1.15:t<.85?t/.85:1;this.size=Math.min(Math.max(this.resizeSize*n,qp),Jp)}_m.invert(this.gripHand).mul(this.handRotation);let t=Math.hypot(_m.y,_m.w);t>1e-6?vm.set(0,-_m.y/t,0,_m.w/t):vm.set(0,0,0,1),_m.invert(this.gripHand).transformVector(bm.sub2(o,this.handPosition),bm);let n=Math.atan2(bm.x,bm.z);this.swingFrom!==null&&Math.hypot(bm.x,bm.z)>.001&&(this.swung+=wm(n-this.swingFrom)),this.swingFrom=n;let r=Math.abs(this.swung)>Yp?this.swung-Math.sign(this.swung)*Yp:0;ym.setFromAxisAngle(W.UP,r*q.RAD_TO_DEG),this.twist.mul2(this.gripTwist,vm).mul(ym)}else this.resizeFrom=0;this.ring.enabled=this.armed>0||this.burstFor<nm,this.ring.enabled&&this.placeRing(e),this.hold&&(this.popFor+=e,this.place())}upright(){return this.handRotation.transformVector(W.UP,fm),fm.y>(this.armed>0?Ip:Fp)}looking(){return Cm.sub2(this.handPosition,this.camera.getPosition()).normalize(),Cm.dot(this.camera.forward)>(this.armed>0?Rp:Lp)}placeRing(e){let t=1,n=0,r=0,i;if(this.burstFor<nm)this.burstFor+=e,r=Math.min(this.burstFor/nm,1),i=1+.8*(1-(1-r)*(1-r));else{let r=this.armed/zp;t=r*($p+.65*r*r),this.pulse+=e*(tm+4.5*r),n=.5+.5*Math.sin(this.pulse*2*Math.PI),i=em+.19999999999999996*t+.04*n}let a=this.userScale()*i;this.handRotation.transformVector(W.UP,fm),pm.copy(fm).mulScalar(Zp*this.userScale()).add(this.handPosition),this.ring.setPosition(pm),this.ring.setRotation(this.handRotation),this.ring.setLocalScale(Qp*a,1,Qp*a),this.material.setParameter(`uProgress`,t),this.material.setParameter(`uPulse`,n),this.material.setParameter(`uBurst`,r)}take(){let{entity:e}=this;this.homePosition.copy(e.getLocalPosition()),this.homeRotation.copy(e.getLocalRotation()),this.homeScale.copy(e.getLocalScale());let t=e.getWorldTransform(),n=this.userScale(),r=e.gsplat?.resource?.aabb;if(this.scene||!r)xm.copy(t).invert(),xm.transformPoint(this.scenePin(pm),this.pinLocal),this.holdScale=Gp*n,this.bottom=0;else{let{halfExtents:t}=r;this.pinLocal.copy(r.center),this.holdScale=Kp*n/(2*Math.max(t.x,t.y,t.z,1e-6)),Sm.setTRS(W.ZERO,e.getRotation(),W.ONE);let i=Sm.data;this.bottom=this.holdScale*(Math.abs(i[1])*t.x+Math.abs(i[5])*t.y+Math.abs(i[9])*t.z)}this.size=1,this.twist.set(0,0,0,1),this.hold=!0,this.onHolding(!0)}place(){let{entity:e}=this,t=(this.popFor<rm?Math.max(Tm(this.popFor/rm),.01):1)*this.size,n=this.holdScale*t;this.handRotation.transformVector(W.UP,fm),pm.copy(fm).mulScalar(Xp*this.userScale()+this.bottom*t).add(this.handPosition),gm.mul2(this.handRotation,this.twist).mul(this.homeRotation),mm.copy(this.pinLocal).mulScalar(n),gm.transformVector(mm,mm),hm.sub2(pm,mm),e.setPosition(hm),e.setRotation(gm),e.setLocalScale(n,n,n)}release(){if(!this.hold)return;this.hold=!1;let{entity:e}=this;e.setLocalPosition(this.homePosition),e.setLocalRotation(this.homeRotation),e.setLocalScale(this.homeScale),this.onHolding(!1)}},zm=.8,Bm=.35,Vm=.8,Hm=1/40,Um=.6,Wm=.25,Gm=4,Km=.001,qm=1e-4,Jm=new W,Ym=new W,Xm=new W,Zm=new W,Qm=new W,$m=new W,eh=new W,th=new tt,nh=new t,rh=new J,ih=e=>(e%=Math.PI*2,e>Math.PI?e-Math.PI*2:e<=-Math.PI?e+Math.PI*2:e),ah=e=>e.grip||!!(e.hand?.tracking&&e.hand.wrist),oh=(e,t)=>t.copy(e.grip?e.getPosition():e.hand.wrist.getPosition()),sh=class{enabled=!1;app;entity;rig;scene;pinLocal=new W;homePosition=new W;homeRotation=new tt;homeScale=new W;placedScale=1;paused=!1;first=null;second=null;grabMid=new W;grabDistance=0;grabHeading=null;grabBase=new W;grabPosition=new W;grabRotation=new tt;grabScale=new W;grabRigPosition=new W;grabRigRotation=new tt;yaw=0;updating;menuActive;constructor(e,t,n,r){this.app=e,this.entity=t,this.rig=n,this.scene=r,this.homePosition.copy(t.getPosition()),this.homeRotation.copy(t.getRotation()),this.homeScale.copy(t.getLocalScale()),this.updating=e.on(`update`,()=>this.update()),this.menuActive=e.on(`xr:menu:active`,e=>{this.paused=!!e})}place(){this.end(),this.restoreHome();let{entity:e,rig:t}=this,n=t.getPosition(),r,i;if(this.scene)Qm.copy(n),r=Hm,i=Um;else{this.worldBound();let{center:e,halfExtents:t}=nh;Qm.set(e.x,e.y-t.y,e.z),r=Math.min(1,Vm/(2*Math.max(t.x,t.y,t.z,1e-6))),i=Bm+Math.max(t.x,t.z)*r}rh.copy(e.getWorldTransform()).invert(),rh.transformPoint(Qm,this.pinLocal);let{forward:a}=t;Zm.set(a.x,0,a.z),Zm.lengthSq()<1e-8&&Zm.set(0,0,-1),Zm.normalize(),Xm.set(n.x+Zm.x*i,n.y+zm,n.z+Zm.z*i),$m.sub2(e.getPosition(),Qm).mulScalar(r),e.setPosition(Xm.add($m)),e.setLocalScale(this.homeScale.x*r,this.homeScale.y*r,this.homeScale.z*r),this.placedScale=r}moveTo(e){this.end(),this.basePoint(Qm),$m.sub2(e,Qm).add(this.entity.getPosition()),this.entity.setPosition($m)}restore(){this.end(),this.restoreHome(),this.placedScale=1}destroy(){this.updating.off(),this.menuActive.off(),this.end()}restoreHome(){this.entity.setPosition(this.homePosition),this.entity.setRotation(this.homeRotation),this.entity.setLocalScale(this.homeScale)}basePoint(e){return this.entity.getWorldTransform().transformPoint(this.pinLocal,e)}worldBound(){let e=this.entity.gsplat?.resource?.aabb;e?nh.setFromTransformedAabb(e,this.entity.getWorldTransform()):(nh.center.copy(this.entity.getPosition()),nh.halfExtents.set(0,0,0))}end(){this.first=null,this.second=null}begin(){oh(this.first,Jm),oh(this.second,Ym),this.grabMid.add2(Jm,Ym).mulScalar(.5),Zm.sub2(Ym,Jm),this.grabDistance=Zm.length(),this.grabHeading=Math.hypot(Zm.x,Zm.z)>qm?Math.atan2(Zm.x,Zm.z):null,this.basePoint(this.grabBase),this.grabPosition.copy(this.entity.getPosition()),this.grabRotation.copy(this.entity.getRotation()),this.grabScale.copy(this.entity.getLocalScale()),this.grabRigPosition.copy(this.rig.getPosition()),this.grabRigRotation.copy(this.rig.getRotation()),this.yaw=0}update(){let{xr:e}=this.app;if(!e?.active||this.paused||!this.enabled){this.end();return}let t=e.input.inputSources,n=e=>t.includes(e)&&e.squeezing&&ah(e);if(this.first&&!(n(this.first)&&n(this.second))&&this.end(),!this.first){let e=null,n=null,r=null,i=null;for(let a of t)a.squeezing&&ah(a)&&(a.handedness===`left`&&!e?e=a:a.handedness===`right`&&!n&&(n=a),r?i||=a:r=a);[this.first,this.second]=e&&n?[e,n]:[r,i],this.first&&this.second?this.begin():this.end();return}let{rig:r}=this;if(!r.getPosition().equals(this.grabRigPosition)||!r.getRotation().equals(this.grabRigRotation)){this.begin();return}oh(this.first,Jm),oh(this.second,Ym),Xm.add2(Jm,Ym).mulScalar(.5),Zm.sub2(Ym,Jm);let i=Zm.length();Math.hypot(Zm.x,Zm.z)>qm&&this.grabHeading!==null&&(this.yaw=ih(Math.atan2(Zm.x,Zm.z)-this.grabHeading));let a=i>Km&&this.grabDistance>Km?i/this.grabDistance:1;Qm.sub2(Xm,this.grabMid).add(this.grabBase),this.apply(this.ratioOf(a),this.yaw,Qm)}startAdjust(){this.end(),this.basePoint(this.grabBase),this.grabPosition.copy(this.entity.getPosition()),this.grabRotation.copy(this.entity.getRotation()),this.grabScale.copy(this.entity.getLocalScale())}adjust(e,t){this.apply(this.ratioOf(e),t,this.grabBase)}ratioOf(e){let t=e>1.15?e/1.15:e<.85?e/.85:1,n=this.homeScale.x||1;return q.clamp(this.grabScale.x*t/n,this.placedScale*Wm,this.placedScale*Gm)*n/this.grabScale.x}apply(e,t,n){th.setFromAxisAngle(W.UP,t*q.RAD_TO_DEG),$m.sub2(this.grabPosition,this.grabBase),th.transformVector($m,$m).mulScalar(e);let{entity:r}=this;r.setPosition(eh.add2(n,$m)),r.setRotation(th.mul(this.grabRotation)),r.setLocalScale(this.grabScale.x*e,this.grabScale.y*e,this.grabScale.z*e)}},ch=.7,lh=.85,uh=3,dh=.002,fh=200,ph=`
    attribute vec3 vertex_position;
    attribute vec2 aUv0;

    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;

    varying vec2 uv0;

    void main(void) {
        gl_Position = matrix_viewProjection * matrix_model * vec4(vertex_position, 1.0);
        uv0 = aUv0;
    }
`,mh=`
    attribute vertex_position: vec3f;
    attribute aUv0: vec2f;

    uniform matrix_model: mat4x4f;
    uniform matrix_viewProjection: mat4x4f;

    varying uv0: vec2f;

    @vertex
    fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        output.position = uniform.matrix_viewProjection * uniform.matrix_model * vec4f(input.vertex_position, 1.0);
        output.uv0 = input.aUv0;
        return output;
    }
`,hh=`
    uniform float uOpacity;
    uniform float uSharpness;

    varying vec2 uv0;

    void main(void) {
        vec2 p = uv0 * 2.0 - 1.0;
        float r2 = dot(p, p);
        gl_FragColor = vec4(0.0, 0.0, 0.0, uOpacity * exp(-uSharpness * r2 * r2));
    }
`,gh=`
    uniform uOpacity: f32;
    uniform uSharpness: f32;

    varying uv0: vec2f;

    @fragment
    fn fragmentMain(input: FragmentInput) -> FragmentOutput {
        var output: FragmentOutput;
        let p = input.uv0 * 2.0 - vec2f(1.0);
        let r2 = dot(p, p);
        output.color = vec4f(0.0, 0.0, 0.0, uniform.uOpacity * exp(-uniform.uSharpness * r2 * r2));
        return output;
    }
`,_h=new W,vh=new W,yh=new W,bh=class{entity;splat;material;updating;constructor(e,t,n){this.splat=t,this.material=new v({uniqueName:`sse-xr-object-shadow`,vertexGLSL:ph,fragmentGLSL:hh,vertexWGSL:mh,fragmentWGSL:gh,attributes:{vertex_position:U,aUv0:We}}),this.material.blendState=new Ae(!0,0,0,8,0,1,8),this.material.cull=0,this.material.depthWrite=!1,this.material.setParameter(`uOpacity`,ch),this.material.setParameter(`uSharpness`,uh),this.material.update(),this.entity=new He(`XrObjectShadow`,e),this.entity.addComponent(`render`,{type:`plane`,castShadows:!1,receiveShadows:!1}),this.entity.render.material=this.material;for(let e of this.entity.render.meshInstances)e.drawBucket=fh;this.entity.enabled=!1,e.root.addChild(this.entity),this.updating=e.on(`update`,()=>this.update(n()))}destroy(){this.updating.off(),this.entity.destroy(),this.material.destroy()}update(e){let t=this.splat.gsplat?.resource?.aabb;if(!e||!t){this.entity.enabled=!1;return}let n=this.splat.getWorldTransform();n.getX(yh),yh.y=0,yh.lengthSq()<1e-8&&(n.getZ(yh),yh.y=0),yh.lengthSq()<1e-8&&yh.set(1,0,0),yh.normalize(),n.transformPoint(t.center,vh);let r=0,i=0,{halfExtents:a}=t;for(let e=0;e<8;e++)_h.set(e&1?a.x:-a.x,e&2?a.y:-a.y,e&4?a.z:-a.z).add(t.center),n.transformPoint(_h,_h).sub(vh),r=Math.max(r,Math.abs(_h.x*yh.x+_h.z*yh.z)),i=Math.max(i,Math.abs(_h.z*yh.x-_h.x*yh.z));this.entity.enabled=!0,this.entity.setPosition(vh.x,e.y+dh,vh.z),this.entity.setEulerAngles(0,Math.atan2(-yh.z,yh.x)*(180/Math.PI),0),this.entity.setLocalScale(2*r*lh,1,2*i*lh)}},xh=256,Sh=.87,Ch=150,wh=.75,Th=.85,Eh=3,Dh=new J,Oh=new Ge,kh=class{camera;picker;point=new W;aimed=!1;timer=null;picking=!1;released=!1;found=new W;standable=!1;constructor(e,t){this.camera=t,this.picker=new Qs(e,t,{width:xh,height:xh})}aim(e){this.point.copy(e),this.aimed=!0,this.timer||this.picking||this.released||(this.timer=setTimeout(()=>this.pick(),Ch))}floorNear(e){if(!this.standable)return null;let t=this.found.x-e.x,n=this.found.z-e.z;return t*t+n*n<wh*wh?this.found.y:null}async floorAhead(){let e=this.camera.getPosition();if(!await this.pickScreen(.5,Th))return null;let t=e.y-this.found.y;return t>=0&&t<=Eh?this.found.y:null}destroy(){this.released=!0,this.timer&&clearTimeout(this.timer),this.timer=null,this.picker.release()}async pick(){this.timer=null,this.aimed&&!this.released&&(this.aimed=!1,await this.pickAt(this.point))}async pickAt(e){let t=this.camera.camera;Rs(this.camera,()=>Dh.mul2(t.projectionMatrix,t.viewMatrix)),Oh.set(e.x,e.y,e.z,1),Dh.transformVec4(Oh,Oh);let n=Oh.x/Oh.w,r=Oh.y/Oh.w;return Oh.w<=1e-6||Math.abs(n)>1||Math.abs(r)>1?(this.standable=!1,!1):this.pickScreen((n+1)/2,(1-r)/2)}async pickScreen(e,t){this.picking=!0;try{let n=await this.picker.pickSurface(e,t);return!this.released&&(this.standable=!!n&&n.fitted&&n.normal.y>Sh,n&&this.found.copy(n.position),this.standable)}finally{this.picking=!1}}},Ah=new W(-.24,-.28,-1),jh=.36,Mh=.034,Nh=.114,Ph=1600,Fh=.25,Ih=class{app;quad;value=!1;profiling=!1;profilerWas=!1;wait=0;handle;constructor(e,t){this.app=e,this.quad=rf(e,t,jh,Nh,Ph),this.quad.entity.setLocalPosition(Ah),this.handle=e.on(`update`,e=>this.update(e))}get enabled(){return this.value}set enabled(e){e!==this.value&&(this.value=e,this.wait=0,this.show(e&&this.app.xr.active))}destroy(){this.show(!1),this.handle.off(),this.quad.entity.destroy(),this.quad.material.destroy(),this.quad.texture.destroy()}show(e){if(this.quad.entity.enabled=e,e===this.profiling)return;this.profiling=e;let t=this.app.graphicsDevice.gpuProfiler;t&&(e?(this.profilerWas=t.enabled,t.enabled=!0):t.enabled=this.profilerWas)}update(e){let t=this.value&&this.app.xr.active;this.show(t),t&&(this.wait-=e,this.wait>0||(this.wait=Fh,this.draw()))}draw(){let{fps:e,frameTime:t,gpuFrameTime:n,frame:r}=this.app.stats,i=n===void 0?`–`:n.toFixed(1),a=[`Frame:  ${t.toFixed(1)} ms (${e} fps)`,`GPU:    ${i} ms`,`Splats: ${(r.gsplats/1e6).toFixed(2)}M`],{canvas:o}=this.quad,s=o.getContext(`2d`),{width:c,height:l}=o,u=Mh*Ph,d=u*.4;s.clearRect(0,0,c,l),s.fillStyle=`rgba(20, 22, 28, 0.78)`,s.beginPath(),s.roundRect(1,1,c-2,l-2,u*.4),s.fill();let f=e=>`500 ${e}px ui-monospace, Menlo, monospace`,p=Math.round(u*.6);s.font=f(p);let m=Math.max(...a.map(e=>s.measureText(e).width)),h=c-2*d;m>h&&(s.font=f(Math.floor(p*h/m))),s.fillStyle=`#ffffff`,s.textBaseline=`middle`;let g=(l-a.length*u)/2;a.forEach((e,t)=>s.fillText(e,d,g+(t+.5)*u)),af(this.quad)}},Lh=.3,Rh=.8,zh=.15,Bh=1.5,Vh=.2,Hh=500,Uh=1e3,Wh=e=>{let{app:t,config:n,events:r,state:i,camera:a,renderer:o,root:s,localize:c,quality:l}=e,{xr:u}=t,d=!1,f=null,p=null,m=null,h=()=>Error(`the viewer has been destroyed`),g=!1,_=!1,v=()=>{d||(i.canStartAR=u.isAvailable(`immersive-ar`),i.canStartVR=u.isAvailable(`immersive-vr`),i.hasAR=i.canStartAR||g,i.hasVR=i.canStartVR||_)};v();let y=u.on(`available`,v),b=o===`webgpu`?Vf(t):null,x=-1/0,S=u.on(`error`,e=>{if(o!==`webgpu`||!u.session||e?.name!==`OperationError`||!/getViewSubImage/.test(e.message))return;let t=performance.now();if(t-x<Uh)return;x=t;let n=u.xrBridge;if(!n)return;let r=u.fixedFoveation,i=n.presentationLayer,{depthNear:a,depthFar:s}=u.session.renderState;try{n.attachPresentation(u.session,{framebufferScaleFactor:n._framebufferScaleFactor,depthNear:a,depthFar:s,onBindingError:n._onBindingError})}catch{return}n.presentationLayer!==i&&(r!==null&&(u.fixedFoveation=r),i?.destroy?.())});o===`webgpu`&&Promise.all([ne.isDeviceSupported(Le,`immersive-ar`),ne.isDeviceSupported(Le,`immersive-vr`)]).then(([e,t])=>{d||(g=e,_=t,v())});let C=a.parent,w=new W,T=new tt,E=new W,D=new tt;C.addComponent(`script`);let O=C.script.create(ja),k=C.script.create(Za);Wu(k);let A=1,j={maxTeleportDistance:k.maxTeleportDistance,movementSpeed:k.movementSpeed,arcWidth:k.arcWidth,teleportIndicatorRadius:k.teleportIndicatorRadius,snapVerticalHeight:k.snapVerticalHeight,snapVerticalBoostHeight:k.snapVerticalBoostHeight},M=k.teleportArcSpeed,N=e=>e.setLocalScale(A,A,A),P=new Pp,F=t.on(`xr:controller:add`,(e,t)=>{N(t),e.hand&&(P.apply(t),u.type===`immersive-ar`&&(t.enabled=!1))}),I=e=>{A=e;for(let t of Object.keys(j))k[t]=j[t]*e;k.teleportArcSpeed=M*Math.sqrt(e);for(let{entity:e}of O.controllers.values())N(e)},L=new W;k._rotateRigAroundCamera=e=>{L.copy(a.getPosition()),C.rotateLocal(0,e,0),C.translate(L.sub(a.getPosition()))};let R=null,ee=new W,te=new W,z={x:0,y:0,z:0},re=!1,ie=(e,t,n,r)=>{let i=A,a=n+.95*i;if(e.queryCapsule(t,a,r,(Bh*.5-Vh)*i,Vh*i,z))return!1;let o=Lh*i,s=zh*i,c=Math.max(e.voxelResolution,o/6),l=Math.floor(o/c),u=0,d=0;for(let i=-l;i<=l;i++)for(let a=-l;a<=l;a++)i*i+a*a>l*l||(u++,e.queryRay(t+i*c,n+s,r+a*c,0,-1,0,2*s)&&d++);return d>=u*Rh},ae=(e,t)=>{if(!R)return null;ee.sub2(t,e);let n=ee.length();if(n<1e-6)return null;ee.mulScalar(1/n);let r=R.queryRay(e.x,e.y,e.z,ee.x,ee.y,ee.z,n);return r?(re=ie(R,r.x,r.y,r.z),te.set(r.x,r.y,r.z)):null},oe=k.isValidTeleportDistance.bind(k),se=new W,ce=!1,le=!1,ue=null,de=null,fe=null,pe=e=>{if(!de)return;de.aim(e);let t=de.floorNear(e);t!==null&&(k.groundHeight=t)};k.isValidTeleportDistance=e=>{pe(e);let t=oe(e)&&(!R||re);return se.copy(e),ce=!0,le=t,t};let me=t.on(`update`,e=>{ue&&(ce&&le&&u.active?ue.show(se,k.validTeleportColor,e,A):ue.hide()),ce=!1}),B=e=>{let t=R?.queryRay(e.x,e.y,e.z,0,-1,0,1e3);return t?t.y:null},he=null,ge=null,V=null,_e=null,ve=null,H=!1,ye=null,be=r.on(`iceCream:changed`,e=>{ye&&(ye.enabled=e)}),xe=new W,Se=0,Ce=0,we=null,Te=()=>{ye?.cancel(),V?.reset(),C.setPosition(xe),C.setEulerAngles(0,Se,0),k._currentGroundY=Ce,H&&(he?.place(),u.type===`immersive-ar`&&ge?.start())},Ee=()=>{!d&&u.active&&Te()},De=()=>{we?.removeEventListener(`reset`,Ee),we=null},Oe=null,ke=u.on(`start`,()=>{if(d)return;t.autoRender=!0,Oe=t.on(`frameend`,()=>{a.camera.camera.xrViews?.length&&(Oe?.off(),Oe=null,t.scene.gsplat.dirty=!0)}),w.copy(C.getPosition()),T.copy(C.getRotation()),E.copy(a.getPosition()),D.copy(a.getRotation());let{forward:e}=a,n=e.x,r=e.z;if(n*n+r*r<1e-6){let{up:t}=a,i=e.y<0?1:-1;n=t.x*i,r=t.z*i}if(Ce=B(E)??k.groundHeight,xe.set(E.x,Ce,E.z),Se=Math.atan2(-n,-r)*q.RAD_TO_DEG,H=!!he&&(!V||u.type===`immersive-ar`),he&&(he.enabled=H),V&&(V.enabled=!H),k.enableTeleport=!H,Te(),_e&&(_e.visible=!H),de&&!H){let e=de;fe=setTimeout(()=>{fe=null,e.floorAhead().then(e=>{e!==null&&!d&&u.active&&(Ce=e,xe.y=e,k.groundHeight=e,Te())})},Hh)}we=u._referenceSpace,we?.addEventListener(`reset`,Ee),l.xrFixedFoveation&&(u.fixedFoveation=1);let o=l.xrTargetFrameRate;o!==null&&u.supportedFrameRates?.includes(o)&&u.updateTargetFrameRate(o),i.xrMode=u.type===`immersive-ar`?`ar`:`vr`}),Ae=u.on(`end`,()=>{d||(t.autoRender=!1,Oe?.off(),Oe=null,De(),ye?.cancel(),V?.reset(),C.setPosition(w),C.setRotation(T),a.setPosition(E),a.setRotation(D),ge?.stop(),he?.restore(),_e&&(_e.visible=!1),fe&&clearTimeout(fe),fe=null,i.xrMode=null,f!==null&&cancelAnimationFrame(f),f=requestAnimationFrame(()=>{f=null,d||(s.prepend(t.graphicsDevice.canvas),t.renderNextFrame=!0)}))}),je=async e=>{if(d)throw h();if(e!==`ar`&&e!==`vr`)throw Error(`startXR: mode must be ar or vr`);if(p||m||u.active)throw Error(`startXR: a session is active or pending`);let t=e===`ar`?`immersive-ar`:`immersive-vr`;if(!u.isAvailable(t)){let t=e===`ar`?i.hasAR:i.hasVR;throw Error(t?`startXR: reload with WebGL to start this session`:`startXR: XR is not available`)}let{nearClip:n,farClip:o}=a.camera;a.camera.nearClip=.01,a.camera.farClip=1e3,r.fire(`xrRequest:pending`,!0);try{if(await new Promise((e,n)=>{p=n,u.start(a.camera,t,`local-floor`,{framebufferScaleFactor:l.xrFramebufferScale,callback:t=>{d?(u.session?.end().catch(()=>{}),n(h())):t?n(t):e()}})}),d)throw h()}catch(e){throw d||(a.camera.nearClip=n,a.camera.farClip=o),e}finally{p=null,d||r.fire(`xrRequest:pending`,!1)}},Me=async()=>{if(d)throw h();if(p)throw Error(`endXR: a session is still starting`);if(m)throw Error(`endXR: a session is already ending`);let{session:e}=u;if(!e)return;let t;try{if(await new Promise((n,r)=>{m=r,t=n,u.once(`end`,t),e.end().catch(r)}),d)throw h()}finally{u.off(`end`,t),m=null}},Ne=e=>{let t=i.qualityAvailable,n=t.indexOf(l.level);return n<0?null:t[n+e]??null},Pe=null,Fe=[r.on(`splatRenderer:ready`,e=>{Pe=l.stochastic?e:null}),r.on(`splatRenderer:changed`,e=>{Pe=e})],Ie=n.debug?new Ih(t,a):null,Re=e=>Dl[Dl.indexOf(l.debugMode)+e]??null,ze=new of(t,a,[{label:()=>c(i.animationPaused?`tooltip.play`:`tooltip.pause`),visible:()=>i.hasSequence,action:()=>{i.animationPaused=!i.animationPaused}},{label:()=>c(`tooltip.reset-camera`),action:Te},{label:()=>`${c(`settings.quality`)}: ${c(`settings.quality-${l.level}`)}`,stepper:{can:e=>Ne(e)!==null,step:e=>{let t=Ne(e);t&&(i.quality=t)}}},{label:()=>c(`settings.performance-mode`),checked:()=>i.performanceMode,visible:()=>l.switchable,action:()=>{i.performanceMode=!i.performanceMode}},{label:()=>c(`xr-menu.ice-cream`),checked:()=>i.iceCream,visible:()=>!!ye&&u.input.inputSources.some(e=>!!e.hand||e.grip),action:()=>{i.iceCream=!i.iceCream}},...n.debug?[{label:()=>`Debug  ›`,submenu:[{label:()=>`Mode: ${l.debugMode}`,visible:()=>l.debugModes,stepper:{can:e=>Re(e)!==null,step:e=>{let t=Re(e);t&&l.setDebugMode(t)}}},{label:()=>`TAA`,checked:()=>Pe?.variant.taa===`on`,visible:()=>!!Pe,action:()=>{Pe&&(Pe.variant.taa=Pe.variant.taa===`on`?`off`:`on`,Pe.applyVariant())}},{label:()=>`MiniStats`,checked:()=>!!Ie?.enabled,action:()=>{Ie&&(Ie.enabled=!Ie.enabled)}}]}]:[],{label:()=>c(u.type===`immersive-ar`?`xr-menu.exit-ar`:`xr-menu.exit-vr`),action:()=>{Me().catch(()=>{})}}]),Be=k._isSystemSelect.bind(k);k._isSystemSelect=e=>Be(e)||ze.select(e)||!!ye?.holding;let Ve=r.on(`inputEvent`,e=>{e===`cancel`&&u.active&&Me().catch(()=>{})});return{start:je,end:Me,setCollision:e=>{R=e,k.castRay=ae,ue?.destroy(),ue=e instanceof Do?new id(t,e):null,_e?.destroy(),_e=null,de?.destroy(),de=null},setGrabTarget:(e,n)=>{if(n&&(V=new ap(t,C,I),!R)){let e=k;_e=new pp(t,a,()=>e._currentGroundY,()=>A),de=new kh(t,a)}he=new sh(t,e,C,n),ge=new Bf(t,C,a,he,e=>u.visibilityState!==`visible`||ze.pointsAt(e),e=>c({hand:`xr-hint.place`,controller:`xr-hint.place-controller`,screen:`xr-hint.place-screen`}[e])),ye=new Rm(t,e,n,e=>H&&he?he.basePoint(e):e.copy(C.getPosition()),a,()=>A,e=>t.fire(`xr:menu:active`,e),()=>ze.isOpen),ye.enabled=i.iceCream,n||(ve=new bh(t,e,()=>ye?.holding?null:ge?.surface??null))},destroy:()=>{d=!0,y.off(),b?.off(),S.off(),ke.off(),Ae.off(),Oe?.off(),Ve.off(),me.off(),F.off(),P.destroy(),De(),ze.destroy(),Ie?.destroy();for(let e of Fe)e.off();be.off(),ye?.destroy(),ye=null,ve?.destroy(),ve=null,V?.destroy(),V=null,ge?.destroy(),ge=null,he?.destroy(),he=null,_e?.destroy(),_e=null,fe&&clearTimeout(fe),fe=null,de?.destroy(),de=null,ue?.destroy(),ue=null,f!==null&&cancelAnimationFrame(f),p?.(h()),m?.(h()),i.xrMode=null}}},Gh=(e,t,n)=>{let r=e.querySelector(`.sse-poster`);r.style.setProperty(`--poster-url`,`url(${t.src})`),r.style.display=`block`,r.style.filter=`blur(40px)`,e.style.setProperty(`--canvas-opacity`,`0`),n.on(`loaded:changed`,()=>{r.style.display=`none`,e.style.setProperty(`--canvas-opacity`,`1`)}),n.on(`progress:changed`,e=>{r.style.filter=`blur(${Math.floor((100-e)*.4)}px)`})},Kh=e=>{let{gpuAdapter:t,unmaskedRenderer:n}=e,r=t?.info;return r?r.description||[r.vendor,r.architecture,r.device].filter(Boolean).join(` / `):n??``},qh=(e,t,n,r)=>{let{root:i,localize:a}=e,{events:o,state:s}=t,c=[],l=(e,t)=>{let n=o.on(e,t);c.push(()=>n.off())},u=`ui.sceneLayer.controlsWrap.annotationNav.arMode.vrMode.enterFullscreen.exitFullscreen.info.infoPanel.infoClose.infoShortcuts.rendererName.gpuName.engineVersionLabel.buttonContainer.play.pause.settings.settingsPanel.orbitCamera.flyCamera.fpsCamera.qualityValue.qualityTrack.qualityRail.qualityThumb.performanceModeRow.performanceModeCheck.gamingControlsRow.gamingControlsCheck.gamingControlsOption.controlsButton.controlsHint.controlsHintClose.reset.frame.loadingWrap.loadingText.loadingBar.showCollisionRow.showCollisionCheck.showCollisionShortcut.walkShortcut.playShortcut.tooltip.viewerBranding.appVersionLabel`.split(`.`).reduce((e,t)=>(e[t]=i.querySelector(`.sse-${t}`),e),{});u.appVersionLabel.textContent=tu,u.engineVersionLabel.textContent=st,u.rendererName.textContent=e.renderer===`webgpu`?`WebGPU`:`WebGL 2`,u.gpuName.textContent=Kh(e.app.graphicsDevice),u.ui.addEventListener(`click`,()=>{document.activeElement?.blur()});let d=e.app.graphicsDevice.canvas,f=e=>{e.preventDefault();let t=new WheelEvent(e.type,e),n=e;for(let e of[`wheelDelta`,`wheelDeltaX`,`wheelDeltaY`])typeof n[e]==`number`&&Object.defineProperty(t,e,{value:n[e],configurable:!0});d.dispatchEvent(t)};for(let e of[u.ui,u.sceneLayer])e.addEventListener(`wheel`,f,{passive:!1});let p=e=>{u.loadingText.textContent=`${e}%`,e<100?u.loadingBar.style.backgroundImage=`linear-gradient(90deg, #F60 0%, #F60 ${e}%, white ${e}%, white 100%)`:u.loadingBar.style.backgroundImage=`linear-gradient(90deg, #F60 0%, #F60 100%)`};l(`progress:changed`,p),p(s.progress),l(`loaded:changed`,()=>{u.loadingWrap.classList.add(`sse-hidden`)});let m=Array.from(u.qualityRail.querySelectorAll(`.sse-qualityStop`)),h=e=>`${e/(Ol.length-1)*100}%`;m.forEach((e,t)=>{e.style.left=h(t)});let g=e=>{let t=u.qualityRail.getBoundingClientRect(),n=(t.width>0?Math.min(1,Math.max(0,(e.clientX-t.left)/t.width)):0)*(Ol.length-1),r=s.qualityAvailable.map(e=>({level:e,distance:Math.abs(Ol.indexOf(e)-n)})).sort((e,t)=>e.distance-t.distance)[0];r&&r.level!==s.quality&&(s.quality=r.level)};u.qualityTrack.addEventListener(`pointerdown`,e=>{e.button===0&&(u.qualityTrack.setPointerCapture(e.pointerId),g(e))}),u.qualityTrack.addEventListener(`pointermove`,e=>{u.qualityTrack.hasPointerCapture(e.pointerId)&&g(e)});let _=()=>{u.qualityThumb.style.left=h(Ol.indexOf(s.quality));let t=e.quality.levels().find(e=>e.level===s.quality)?.budget;u.qualityValue.textContent=`${a(`settings.quality-${s.quality}`)}${t==null?``:` · ${t}M`}`,m.forEach((e,t)=>{e.classList.toggle(`sse-disabled`,!s.qualityAvailable.includes(Ol[t]))})};l(`quality:changed`,_),l(`qualityAvailable:changed`,_),_(),u.performanceModeRow.classList.toggle(`sse-hidden`,!e.quality.switchable),u.performanceModeRow.addEventListener(`click`,()=>{s.performanceMode=!s.performanceMode});let v=()=>{u.performanceModeCheck.classList.toggle(`sse-active`,s.performanceMode)};l(`performanceMode:changed`,v),v(),u.gamingControlsRow.addEventListener(`click`,()=>{s.gamingControls=!s.gamingControls});let y=()=>{let e=s.inputMode===`desktop`;u.gamingControlsRow.classList.toggle(`sse-hidden`,e)};l(`inputMode:changed`,y),y();let b=()=>{u.gamingControlsCheck.classList.toggle(`sse-active`,s.gamingControls)};l(`gamingControls:changed`,b),b();let x=e=>!e.classList.contains(`sse-hidden`),S=yu(),C=()=>{let e=S&&s.loaded&&!x(u.settingsPanel);u.controlsHint.classList.toggle(`sse-hidden`,!e),u.controlsButton.classList.toggle(`sse-active`,e)},w=e=>{u.settingsPanel.classList.toggle(`sse-hidden`,!e),u.settings.classList.toggle(`sse-active`,e),C()},T=e=>{S=e,bu(e),e&&w(!1),C()};l(`loaded:changed`,C),C();let E=()=>T(!x(u.controlsHint));u.controlsButton.addEventListener(`click`,()=>{E(),R()}),u.controlsHintClose.addEventListener(`click`,()=>{T(!1),R()});let D=e=>{u.infoShortcuts.classList.toggle(`sse-hidden`,s.inputMode!==`desktop`),u.walkShortcut.classList.toggle(`sse-hidden`,!s.walkAllowed),u.playShortcut.classList.toggle(`sse-hidden`,!s.hasAnimation),u.infoPanel.classList.toggle(`sse-hidden`,!e),u.info.classList.toggle(`sse-active`,e)},O=()=>D(!x(u.infoPanel));u.info.addEventListener(`click`,()=>{O(),R()}),u.infoPanel.addEventListener(`pointerdown`,()=>{D(!1),R()}),u.infoClose.addEventListener(`click`,()=>{D(!1),R()}),l(`inputEvent`,e=>{e===`toggleHelp`?O():e===`toggleControls`?E():e===`cancel`?(D(!1),w(!1)):e===`interrupt`&&w(!1)}),l(`controlsHidden:changed`,e=>{u.controlsWrap.classList.toggle(`sse-faded-out`,e),u.controlsWrap.classList.toggle(`sse-faded-in`,!e)});let k=null,A=null,j=!1;c.push(()=>{k&&=(clearTimeout(k),null),A&&=(clearTimeout(A),null)});let M=()=>s.inputMode===`desktop`&&s.gamingControls&&(s.cameraMode===`walk`||s.cameraMode===`fly`),N=e=>{u.controlsWrap.classList.toggle(`sse-dimmed`,e),u.annotationNav.classList.toggle(`sse-dimmed`,e)},P=()=>{A&&=(clearTimeout(A),null),N(!1)},F=()=>{k&&=(clearTimeout(k),null),P(),j=!1,D(!1),w(!1),s.controlsHidden=!0},I=()=>{P(),N(!0),A=setTimeout(F,2500)},L=()=>{k&&=(clearTimeout(k),null),D(!1),w(!1),s.controlsHidden=!1,I()},R=()=>{M()?A?(D(!1),w(!1)):F():(k&&clearTimeout(k),P(),s.controlsHidden=!1,k=setTimeout(()=>{k=null,j||x(u.settingsPanel)||x(u.infoPanel)||x(u.controlsHint)||s.selectedAnnotation!==null&&s.showAnnotations||I()},3e3))};u.controlsWrap.addEventListener(`pointerenter`,()=>{j=!0,R()}),u.controlsWrap.addEventListener(`pointerleave`,()=>{j=!1,R()}),l(`loaded:changed`,()=>{u.controlsWrap.classList.remove(`sse-hidden`),R()}),l(`inputEvent`,R);let ee=!1,te=()=>{let e=M();e&&!ee?L():e||(P(),R()),ee=e};if(l(`cameraMode:changed`,te),l(`inputMode:changed`,te),l(`gamingControls:changed`,te),l(`selectedAnnotation:changed`,R),c.push(Iu(t,i,R)),c.push(_u(t,i)),c.push(Nu(t,i,a)),c.push(Pu(t,i)),c.push(Ru(t,i)),Al&&c.push(Bu(t,i)),e.config.vr&&c.push(Lu(t,i,a)),l(`hasCollisionOverlay:changed`,e=>{u.showCollisionRow.classList.toggle(`sse-hidden`,!e),u.showCollisionShortcut.classList.toggle(`sse-hidden`,!e)}),u.showCollisionRow.addEventListener(`click`,()=>{s.collisionOverlayEnabled=!s.collisionOverlayEnabled}),l(`collisionOverlayEnabled:changed`,e=>{u.showCollisionCheck.classList.toggle(`sse-active`,e)}),u.settings.addEventListener(`click`,()=>{w(!x(u.settingsPanel)),R()}),c.push(Fu(t,i)),c.push(ru(t,i)),t.annotations.length>0){let a=new gu(t,i,e.camera,n,r);c.push(()=>a.destroy())}let z=new nu(u.tooltip);if(c.push(z.destroy),z.register(u.play,a(`tooltip.play`),`top`),z.register(u.pause,a(`tooltip.pause`),`top`),z.register(u.orbitCamera,a(`tooltip.orbit-camera`),`top`),z.register(u.flyCamera,a(`tooltip.fly-camera`),`top`),z.register(u.fpsCamera,a(`tooltip.walk-mode`),`top`),z.register(u.reset,a(`tooltip.reset-camera`),`bottom`),z.register(u.frame,a(`tooltip.frame-scene`),`bottom`),z.register(u.settings,a(`tooltip.settings`),`top`),z.register(u.info,a(`tooltip.help`),`top`),z.register(u.controlsButton,a(`tooltip.controls`),`top`),z.register(u.arMode,a(`tooltip.enter-ar`),`top`),z.register(u.vrMode,a(`tooltip.enter-vr`),`top`),z.register(u.enterFullscreen,a(`tooltip.fullscreen`),`top`),z.register(u.exitFullscreen,a(`tooltip.fullscreen`),`top`),window.parent!==window&&(()=>{try{return window.location.hostname!==window.parent.location.hostname}catch{return!0}})()){let e=new URL(window.location.href);e.pathname===`/s`&&(e.pathname=`/view`),u.viewerBranding.href=e.toString(),u.viewerBranding.classList.remove(`sse-hidden`)}return()=>{for(let e of c)e()}},Jh=`
<canvas></canvas>

<div class="sse-sceneLayer"></div>

<div class="sse-ui">
    <div class="sse-poster"></div>

    
    <a class="sse-viewerBranding sse-hidden" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="64 64 384 384" role="img" aria-label="SuperSplat">
            <path
                fill="#F26722"
                d="M129.83,217c9.75,0,17.64-7.9,17.64-17.64s-7.9-17.64-17.64-17.64-17.64,7.9-17.64,17.64,7.9,17.64,17.64,17.64Z"
            />
            <path
                fill="#F26722"
                d="M388.74,253.94c-12.46,0-22.57,10.11-22.57,22.57s10.11,22.57,22.57,22.57,22.57-10.11,22.57-22.57-10.11-22.57-22.57-22.57h0Z"
            />
            <path
                fill="#F26722"
                d="M345.26,161.1h.02c.37-.05.65-.22.97-.33,16.78-2.32,29.75-16.57,29.75-33.99,0-19.04-15.43-34.46-34.46-34.46s-34.46,15.43-34.46,34.46c0,4.29.88,8.35,2.32,12.14.04.12-.01.25.04.38,10.55,29.18-22.33,23.62-39.07,20.74-.49-.09-.88-.07-1.32-.11-4.27-.56-8.59-.97-13.03-.97-53.93,0-97.64,43.71-97.64,97.64,0,9.84,1.48,19.32,4.2,28.28.04.1,0,.17.05.27,8.97,30.15-14.83,25.49-25.52,25.69-1.04-.13-2.09-.32-3.18-.32-13.51,0-24.45,10.94-24.45,24.45s10.94,24.45,24.45,24.45c11.69,0,21.44-8.22,23.85-19.19h.02c6.31-26.57,25.9-18.02,31.15-12.67.2.2.4.26.59.42,17.44,16.25,40.75,26.26,66.47,26.26.67,0,1.34-.09,2.01-.1.66.01,1.31.04,2.04.04,9.7-.04,17.82,10.91,4.94,29.68h.13c-4.42,6.01-7.1,13.36-7.1,21.41,0,20.09,16.29,36.39,36.39,36.39s36.39-16.29,36.39-36.39c0-15.4-9.61-28.49-23.12-33.81-.32-.15-.61-.29-.98-.45-12.28-4.94-25.43-17.69-6.89-27.1l-.04-.1c31.93-16.06,53.88-49.02,53.88-87.2,0-21.15-6.8-40.68-18.23-56.66-.13-.23-.23-.47-.44-.74-23.15-31.67-2.37-36.07,10.3-38.09h-.01Z"
            />
            <path
                fill="#fff"
                d="M230.79,284.71c0,7.95-6.44,14.38-14.38,14.38s-14.38-6.44-14.38-14.38v-22.95c0-7.95,6.44-14.38,14.38-14.38s14.38,6.44,14.38,14.38v22.95Z"
            />
            <path
                fill="#fff"
                d="M309.78,284.71c0,7.95-6.44,14.38-14.38,14.38s-14.38-6.44-14.38-14.38v-22.95c0-7.95,6.44-14.38,14.38-14.38s14.38,6.44,14.38,14.38v22.95Z"
            />
        </svg>
        <span>SuperSplat</span>
    </a>

    
    <div class="sse-loadingWrap">
        <div class="sse-loadingText"></div>
        <div class="sse-loadingBar"></div>
    </div>

    <div class="sse-controlsWrap sse-hidden">
        
        <div class="sse-timelineContainer sse-hidden">
            <div class="sse-line"></div>
            <div class="sse-handle"></div>
            <div class="sse-time sse-hidden">0:00</div>
        </div>

        
        <div class="sse-buttonsContainer">
            <div class="sse-buttonGroup">
                <button class="sse-play sse-controlButton sse-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#playIcon" /></g>
                        <g class="sse-fill"><use href="#playIcon" /></g>
                    </svg>
                </button>
                <button class="sse-pause sse-controlButton sse-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
                        <g class="sse-stroke"><use href="#pauseIcon" /></g>
                        <g class="sse-fill"><use href="#pauseIcon" /></g>
                    </svg>
                </button>
            </div>

            <div class="sse-spacer"></div>

            <div class="sse-buttonGroup">
                <button class="sse-orbitCamera sse-controlButton sse-toggle sse-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#orbitIcon" /></g>
                        <g class="sse-fill"><use href="#orbitIcon" /></g>
                    </svg>
                </button>
                <button class="sse-flyCamera sse-controlButton sse-toggle sse-right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#flyIcon" /></g>
                        <g class="sse-fill"><use href="#flyIcon" /></g>
                    </svg>
                </button>
                <button class="sse-fpsCamera sse-controlButton sse-toggle sse-right sse-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#walkIcon" /></g>
                        <g class="sse-fill"><use href="#walkIcon" /></g>
                    </svg>
                </button>
            </div>

            <div class="sse-buttonGroup">
                
                <button class="sse-settings sse-controlButton">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#settingsIcon" /></g>
                        <g class="sse-fill"><use href="#settingsIcon" /></g>
                    </svg>
                </button>
                <button class="sse-controlsButton sse-controlButton">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#keyboardIcon" /></g>
                        <g class="sse-fill"><use href="#keyboardIcon" /></g>
                    </svg>
                </button>
                <button class="sse-info sse-controlButton">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#infoIcon" /></g>
                        <g class="sse-fill"><use href="#infoIcon" /></g>
                    </svg>
                </button>
                <button class="sse-arMode sse-controlButton sse-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#arIcon" /></g>
                        <g class="sse-fill"><use href="#arIcon" /></g>
                    </svg>
                </button>
                <button class="sse-vrMode sse-controlButton sse-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#vrIcon" /></g>
                        <g class="sse-fill"><use href="#vrIcon" /></g>
                    </svg>
                </button>
                <button class="sse-enterFullscreen sse-controlButton">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#enterFullscreenIcon" /></g>
                        <g class="sse-fill"><use href="#enterFullscreenIcon" /></g>
                    </svg>
                </button>
                <button class="sse-exitFullscreen sse-controlButton sse-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <g class="sse-stroke"><use href="#exitFullscreenIcon" /></g>
                        <g class="sse-fill"><use href="#exitFullscreenIcon" /></g>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    
    <div class="sse-joystickBase sse-hidden">
        <div class="sse-joystick"></div>
    </div>

    
    <div class="sse-annotationNav sse-hidden">
        <button class="sse-annotationPrev">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <g class="sse-stroke"><use href="#chevronLeftIcon" /></g>
                <g class="sse-fill"><use href="#chevronLeftIcon" /></g>
            </svg>
        </button>
        <div class="sse-annotationInfo">
            <span class="sse-annotationNavNumber"></span>
            <span class="sse-annotationNavTitle"></span>
        </div>
        <button class="sse-annotationNext">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <g class="sse-stroke"><use href="#chevronRightIcon" /></g>
                <g class="sse-fill"><use href="#chevronRightIcon" /></g>
            </svg>
        </button>
    </div>

    
    <div class="sse-controlsHint sse-hidden">
        <div class="sse-controlsHintHeader">
            <svg class="sse-controlsHintIcon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <use href="#orbitIcon" />
            </svg>
            <div class="sse-controlsHintTitles">
                <span class="sse-controlsHintTitle"></span>
                <span class="sse-controlsHintSubtitle"></span>
            </div>
            <button class="sse-controlsHintClose sse-panelButton">
                <svg xmlns="http://www.w3.org/2000/svg"><use href="#closeIcon" /></svg>
            </button>
        </div>
        <div class="sse-controlsHintRows"></div>
    </div>

    
    <div class="sse-settingsPanel sse-hidden">
        
        <div class="sse-settingsGroup">
            <div class="sse-annotationsRow sse-settingsRow">
                <div class="sse-annotationsOption" data-i18n="settings.show-annotations">Show Annotations</div>
                <div class="sse-annotationsCheck sse-toggleSwitch sse-active">
                    <div class="sse-toggleTrack"><div class="sse-toggleThumb"></div></div>
                </div>
            </div>
            <div class="sse-showCollisionRow sse-settingsRow sse-hidden">
                <div class="sse-showCollisionOption" data-i18n="settings.show-collision">Show Collision</div>
                <div class="sse-showCollisionCheck sse-toggleSwitch">
                    <div class="sse-toggleTrack"><div class="sse-toggleThumb"></div></div>
                </div>
            </div>
        </div>
        
        <div class="sse-settingsGroup">
            <div class="sse-gamingControlsRow sse-settingsRow">
                <div class="sse-gamingControlsOption" data-i18n="settings.gaming-controls">Gaming Controls</div>
                <div class="sse-gamingControlsCheck sse-toggleSwitch">
                    <div class="sse-toggleTrack"><div class="sse-toggleThumb"></div></div>
                </div>
            </div>
            
            <div class="sse-qualityRow sse-settingsRow">
                <div class="sse-qualityOption" data-i18n="settings.quality">Quality</div>
                <div class="sse-qualityValue"></div>
            </div>
            <div class="sse-qualitySliderRow sse-settingsRow">
                <div class="sse-qualityTrack">
                    <div class="sse-qualityRail">
                        <div class="sse-qualityStop"></div>
                        <div class="sse-qualityStop"></div>
                        <div class="sse-qualityStop"></div>
                        <div class="sse-qualityStop"></div>
                        <div class="sse-qualityThumb"></div>
                    </div>
                </div>
            </div>
            
            <div class="sse-performanceModeRow sse-settingsRow sse-hidden">
                <div class="sse-performanceModeOption" data-i18n="settings.performance-mode">Performance Mode</div>
                <div class="sse-performanceModeCheck sse-toggleSwitch">
                    <div class="sse-toggleTrack"><div class="sse-toggleThumb"></div></div>
                </div>
            </div>
        </div>
        
        <div class="sse-settingsGroup">
            <div class="sse-settingsRow">
                <button class="sse-frame" data-i18n="settings.frame">Frame</button>
                <button class="sse-reset" data-i18n="settings.reset">Reset</button>
            </div>
        </div>
    </div>

    
    <div class="sse-tooltip"></div>

    
    <div class="sse-infoPanel sse-hidden">
        <div class="sse-infoPanelContent" onpointerdown="event.stopPropagation()" onwheel="event.stopPropagation()">
            <button class="sse-infoClose sse-panelButton">
                <svg xmlns="http://www.w3.org/2000/svg"><use href="#closeIcon" /></svg>
            </button>
            <a
                class="sse-viewerTitle"
                href="https://github.com/playcanvas/supersplat-viewer"
                target="_blank"
                rel="noopener noreferrer"
            >
                <svg class="sse-viewerLogo" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <use href="#supersplatIcon" />
                </svg>
                <span class="sse-title-name">SuperSplat Viewer</span>
                <span class="sse-title-version">v<span class="sse-appVersionLabel"></span></span>
            </a>
            <div class="sse-infoGpu">
                <span class="sse-rendererName"></span>
                <span class="sse-gpuName"></span>
            </div>
            <div class="sse-infoLinks">
                <a
                    class="sse-infoLink"
                    href="https://github.com/playcanvas/engine"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>PlayCanvas Engine</span>
                    <span class="sse-infoLinkVersion">v<span class="sse-engineVersionLabel"></span></span>
                </a>
            </div>
            <div class="sse-infoShortcuts">
                <h1 data-i18n="help.section.modes">Mode Switching</h1>
                <div class="sse-infoShortcut">
                    <span data-i18n="help.action.orbit-mode">Orbit Mode</span>
                    <kbd class="sse-key">1</kbd>
                </div>
                <div class="sse-infoShortcut">
                    <span data-i18n="help.action.fly-mode">Fly Mode</span>
                    <kbd class="sse-key">2</kbd>
                </div>
                <div class="sse-walkShortcut sse-infoShortcut">
                    <span data-i18n="help.action.toggle-walk">Toggle Walk</span>
                    <kbd class="sse-key">3</kbd>
                </div>
                <div class="sse-infoShortcut">
                    <span data-i18n="help.action.toggle-gaming">Toggle Gaming Controls</span>
                    <kbd class="sse-key">G</kbd>
                </div>
                <div class="sse-showCollisionShortcut sse-infoShortcut sse-hidden">
                    <span data-i18n="help.action.show-collision">Show Collision</span>
                    <kbd class="sse-key">V</kbd>
                </div>
                <div class="sse-playShortcut sse-infoShortcut">
                    <span data-i18n="help.action.play-pause">Play / Pause</span>
                    <kbd class="sse-key" data-i18n="help.key.space">Space</kbd>
                </div>
                <div class="sse-infoShortcut">
                    <span data-i18n="help.action.toggle-controls">Toggle Controls</span>
                    <kbd class="sse-key">H</kbd>
                </div>
                <div class="sse-infoShortcut">
                    <span data-i18n="help.action.toggle-help">Toggle Info</span>
                    <span class="sse-keys"><kbd class="sse-key">Shift</kbd><kbd class="sse-key">H</kbd></span>
                </div>
                <div class="sse-infoShortcut">
                    <span data-i18n="help.action.exit-cancel">Exit / Cancel</span>
                    <kbd class="sse-key" data-i18n="help.key.esc">Esc</kbd>
                </div>
            </div>
        </div>
    </div>

    
    <div class="sse-xrModal sse-hidden" onwheel="event.stopPropagation()">
        <div class="sse-xrModalContent" onpointerdown="event.stopPropagation()">
            <h2 data-i18n="xr-modal.title">WebGL Required</h2>
            <p data-i18n="xr-modal.message">
                AR and VR are not supported on the WebGPU renderer. Pressing OK will reload the viewer with WebGL.
            </p>
            <div class="sse-xrModalButtons">
                <button class="sse-xrModalCancel" data-i18n="xr-modal.cancel">Cancel</button>
                <button class="sse-xrModalOk" data-i18n="xr-modal.ok">OK</button>
            </div>
        </div>
    </div>

    
    <div class="sse-vrPrompt sse-hidden" onwheel="event.stopPropagation()">
        <button class="sse-vrPromptPill" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <g class="sse-stroke"><use href="#vrIcon" /></g>
                <g class="sse-fill"><use href="#vrIcon" /></g>
            </svg>
            <span class="sse-vrPromptText" data-i18n="vr-prompt.loading">Loading…</span>
        </button>
    </div>

    
    <div class="sse-xrHint sse-hidden" data-i18n="xr-hint.stalled">Nothing happening? Switch tabs and back.</div>
</div>

<svg>
    <symbol id="playIcon" viewBox="-2 0 24 24">
        <path
            d="M1 1.98725C1 1.20022 1.87789 0.730421 2.5332 1.16694L14.5605 9.18061C15.146 9.57066 15.146 10.4302 14.5605 10.8203L2.5332 18.833C1.87788 19.2695 1 18.7997 1 18.0126V1.98725Z"
            transform="translate(2 2)"
        />
    </symbol>
    <symbol id="pauseIcon" viewBox="0 0 20 20">
        <path d="M5 16V4h3v12H5zm7-12h3v12h-3V4z" />
    </symbol>
    <symbol id="orbitIcon" viewBox="-2 -2 20 20">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.44728 1.7561C6.14077 0.763957 8.53159 1.57857 10.4375 3.58357C12.75 3.02099 14.4585 3.40647 14.6491 4.73071C14.7831 5.66256 14.139 6.87994 12.9942 8.09008C13.7427 10.7586 13.2413 13.2551 11.5527 14.2444C9.85867 15.2369 7.46679 14.4208 5.56056 12.4143C3.34914 12.9521 1.691 12.6254 1.38412 11.4371L1.35092 11.2698C1.21678 10.3379 1.85972 9.11931 3.00457 7.90909C2.28693 5.34963 2.72037 2.94871 4.24741 1.88435L4.44728 1.7561ZM11.9889 9.03995C11.002 9.88136 9.79998 10.6808 8.47918 11.3303L8.13673 11.4937C7.70533 11.6942 7.28148 11.8681 6.8698 12.0172C7.32387 12.4287 7.79226 12.7587 8.25326 12.9983C9.39237 13.5903 10.3231 13.574 10.946 13.2092C11.5745 12.841 12.0613 12.0184 12.1263 10.7086C12.1518 10.1934 12.1065 9.62999 11.9889 9.03995ZM3.46225 9.20206C3.15128 9.5802 2.91825 9.93412 2.76238 10.2489C2.54363 10.6909 2.51958 10.967 2.53842 11.0985C2.54902 11.1721 2.56635 11.2146 2.67058 11.2763C2.81832 11.3636 3.12484 11.4626 3.6478 11.467C3.95641 11.4696 4.3074 11.4373 4.69402 11.3707C4.45655 11.0439 4.23084 10.6971 4.02215 10.3303C3.81017 9.95774 3.62416 9.58004 3.46225 9.20206ZM10.0358 4.9423C9.42018 5.13611 8.75205 5.40184 8.05014 5.74698C6.61265 6.45384 5.33887 7.34291 4.37175 8.24373C4.55213 8.73829 4.78227 9.2401 5.06511 9.73722C5.33995 10.2202 5.64271 10.6614 5.96355 11.0575C6.5793 10.8637 7.24782 10.5987 7.94988 10.2535C9.38732 9.54667 10.6605 8.65688 11.6276 7.7561C11.4473 7.26173 11.2176 6.76019 10.9349 6.26326C10.66 5.78001 10.3568 5.33855 10.0358 4.9423ZM7.74675 3.00219C6.60759 2.41015 5.67698 2.42644 5.05405 2.79126C4.42548 3.15953 3.93866 3.98199 3.87371 5.29191C3.84822 5.80668 3.89236 6.36967 4.00978 6.95922C4.91091 6.19088 5.9923 5.45862 7.17905 4.84269L7.52084 4.67016C8.07056 4.39986 8.6096 4.17089 9.12957 3.98266C8.67568 3.57138 8.20757 3.24172 7.74675 3.00219ZM12.3522 4.53344C12.0433 4.53086 11.6918 4.56177 11.3047 4.6285C11.5425 4.95566 11.7689 5.3029 11.9779 5.67016C12.1897 6.04255 12.3753 6.41999 12.5371 6.79777C12.8481 6.41965 13.0818 6.06635 13.2376 5.75154C13.4564 5.30973 13.4804 5.03352 13.4616 4.90193C13.451 4.82831 13.4337 4.7859 13.3294 4.7242C13.1817 4.63684 12.8753 4.53787 12.3522 4.53344Z"
        />
    </symbol>
    <symbol id="flyIcon" viewBox="-2 -2 20 20">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 1.33337C13.4727 1.33337 14.6666 2.52728 14.6666 4.00004C14.6666 5.4728 13.4727 6.66671 12 6.66671C11.4931 6.66671 11.0194 6.52491 10.6159 6.27934L10.2721 6.62374C10.0345 6.86142 9.90102 7.18411 9.90102 7.52022V8.47986C9.90102 8.81597 10.0345 9.13866 10.2721 9.37634L10.6159 9.72009C11.0193 9.47463 11.4932 9.33337 12 9.33337C13.4727 9.33337 14.6666 10.5273 14.6666 12C14.6666 13.4728 13.4727 14.6667 12 14.6667C10.5272 14.6667 9.33331 13.4728 9.33331 12C9.33331 11.4932 9.47457 11.0194 9.72003 10.6159L9.37628 10.2722C9.1386 10.0345 8.81591 9.90108 8.4798 9.90108H7.52016C7.18405 9.90108 6.86136 10.0345 6.62368 10.2722L6.27928 10.6159C6.52485 11.0195 6.66665 11.4931 6.66665 12C6.66665 13.4728 5.47274 14.6667 3.99998 14.6667C2.52722 14.6667 1.33331 13.4728 1.33331 12C1.33331 10.5273 2.52722 9.33337 3.99998 9.33337C4.50658 9.33337 4.98008 9.47481 5.38344 9.72009L5.72784 9.37634C5.9655 9.13866 6.09894 8.81597 6.09894 8.47986V7.52022C6.09894 7.18411 5.9655 6.86142 5.72784 6.62374L5.38344 6.27934C4.98001 6.52473 4.5067 6.66671 3.99998 6.66671C2.52722 6.66671 1.33331 5.4728 1.33331 4.00004C1.33331 2.52728 2.52722 1.33337 3.99998 1.33337C5.47274 1.33337 6.66665 2.52728 6.66665 4.00004C6.66665 4.50676 6.52467 4.98008 6.27928 5.3835L6.62368 5.72791C6.86136 5.96556 7.18405 6.099 7.52016 6.099H8.4798C8.81591 6.099 9.1386 5.96556 9.37628 5.72791L9.72003 5.3835C9.47475 4.98014 9.33331 4.50664 9.33331 4.00004C9.33331 2.52728 10.5272 1.33337 12 1.33337ZM3.99998 10.3998C3.11632 10.3998 2.39972 11.1164 2.39972 12C2.39972 12.8837 3.11632 13.6003 3.99998 13.6003C4.88364 13.6003 5.60024 12.8837 5.60024 12C5.60024 11.7911 5.55917 11.5919 5.48631 11.4089L4.41469 12.4812C4.16723 12.7284 3.76625 12.7286 3.51886 12.4812C3.27147 12.2338 3.27158 11.8328 3.51886 11.5853L4.59047 10.5131C4.40769 10.4404 4.20862 10.3998 3.99998 10.3998ZM12 10.3998C11.7911 10.3998 11.5918 10.4403 11.4088 10.5131L12.4811 11.5853C12.7284 11.8328 12.7285 12.2338 12.4811 12.4812C12.2337 12.7286 11.8327 12.7284 11.5853 12.4812L10.513 11.4089C10.4402 11.5918 10.3997 11.7912 10.3997 12C10.3997 12.8837 11.1163 13.6003 12 13.6003C12.8836 13.6003 13.6002 12.8837 13.6002 12C13.6002 11.1164 12.8836 10.3998 12 10.3998ZM3.99998 2.39978C3.11632 2.39978 2.39972 3.11639 2.39972 4.00004C2.39972 4.8837 3.11632 5.6003 3.99998 5.6003C4.20871 5.6003 4.40763 5.55909 4.59047 5.48637L3.51886 4.41475C3.27158 4.16729 3.27147 3.76631 3.51886 3.51892C3.76625 3.27153 4.16723 3.27164 4.41469 3.51892L5.48631 4.59054C5.55903 4.40769 5.60024 4.20877 5.60024 4.00004C5.60024 3.11639 4.88364 2.39978 3.99998 2.39978ZM12 2.39978C11.1163 2.39978 10.3997 3.11639 10.3997 4.00004C10.3997 4.20868 10.4403 4.40775 10.513 4.59054L11.5853 3.51892C11.8327 3.27164 12.2337 3.27153 12.4811 3.51892C12.7285 3.76631 12.7284 4.16729 12.4811 4.41475L11.4088 5.48637C11.5918 5.55923 11.791 5.6003 12 5.6003C12.8836 5.6003 13.6002 4.8837 13.6002 4.00004C13.6002 3.11639 12.8836 2.39978 12 2.39978Z"
        />
    </symbol>
    <symbol id="walkIcon" viewBox="-2 -2 20 20">
        <path d="M9.75 2a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0zM5.25 4.75h5.5v4.5h-.5v5h-2v-5h-.5v5h-2v-5h-.5z" />
    </symbol>
    <symbol id="arIcon" viewBox="0 0 24 24">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 15.3994V6H16.9629C18.2109 6 19.1167 6.1089 19.6797 6.32715C20.248 6.53997 20.7021 6.92247 21.042 7.47363C21.3818 8.02476 21.5518 8.65491 21.5518 9.36426C21.5518 10.2645 21.2943 11.0093 20.7793 11.5986C20.2641 12.1825 19.4938 12.5513 18.4688 12.7041C18.9786 13.0097 19.3983 13.3453 19.7275 13.7109C20.0621 14.0766 20.5113 14.7261 21.0742 15.6592L22.5 18H19.6797L17.9746 15.3887C17.3694 14.4559 16.9555 13.8691 16.7324 13.6289C16.5095 13.3835 16.2729 13.2172 16.0234 13.1299C15.7738 13.0371 15.3777 12.9902 14.8359 12.9902H14.3584V18H10.4053L9.35742 15.2744H4.56055L3.57031 18H1L5.67383 6H8.23633L12 15.3994ZM5.30566 13.252H8.58008L6.92676 8.7998L5.30566 13.252ZM14.3584 11.0752H16.1025C17.2336 11.0752 17.9401 11.0259 18.2217 10.9277C18.5032 10.8295 18.7235 10.66 18.8828 10.4199C19.0421 10.1798 19.1221 9.87966 19.1221 9.51953C19.122 9.11597 19.016 8.79138 18.8037 8.5459C18.5966 8.29488 18.3013 8.13677 17.9189 8.07129C17.7276 8.04401 17.1541 8.03027 16.1982 8.03027H14.3584V11.0752Z"
        />
    </symbol>
    <symbol id="vrIcon" viewBox="0 0 24 24">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.52148 10.7021L7.15918 15.1133L8.76465 10.7021L9.50195 8.7002L10.4834 6H16.9541C18.1903 6 19.0879 6.10801 19.6455 6.32422C20.2081 6.53499 20.6576 6.9134 20.9941 7.45898C21.3308 8.00484 21.499 8.62946 21.499 9.33203C21.499 10.2239 21.2446 10.9622 20.7344 11.5459C20.2241 12.1242 19.4606 12.4893 18.4453 12.6406C18.9503 12.9433 19.3662 13.2756 19.6924 13.6377C20.0238 13.9999 20.4688 14.6432 21.0264 15.5674L22.4385 17.8857H19.6455L17.9561 15.2998C17.3565 14.3758 16.9466 13.7946 16.7256 13.5566C16.5047 13.3135 16.2706 13.148 16.0234 13.0615C15.7762 12.9696 15.3841 12.9238 14.8477 12.9238H14.374V17.8857H12.0381V8.54395L8.39941 17.8857H5.86133L1.10254 6H3.71289L5.52148 10.7021ZM14.374 11.0264H16.1025C17.2228 11.0264 17.9224 10.9781 18.2012 10.8809C18.4799 10.7836 17.6986 10.6157 18.8564 10.3779C19.0141 10.1402 19.0928 9.84288 19.0928 9.48633C19.0928 9.08641 18.9877 8.7647 18.7773 8.52148C18.5722 8.27286 18.2801 8.11565 17.9014 8.05078C17.712 8.02376 17.1439 8.01075 16.1973 8.01074H14.374V11.0264Z"
        />
    </symbol>
    <symbol id="infoIcon" viewBox="-2 -2 24 24">
        <path
            d="M9.98633 7.58301C10.2598 7.58301 10.4854 7.67643 10.6631 7.86328C10.8408 8.05013 10.9297 8.3099 10.9297 8.64258V14.0361C10.9297 14.4098 10.8408 14.6924 10.6631 14.8838C10.4854 15.0752 10.2598 15.1709 9.98633 15.1709C9.71289 15.1709 9.48958 15.0729 9.31641 14.877C9.14779 14.681 9.06348 14.4007 9.06348 14.0361V8.69727C9.06348 8.32812 9.14779 8.05013 9.31641 7.86328C9.48958 7.67643 9.71289 7.58301 9.98633 7.58301Z"
        />
        <path
            d="M10.0068 4.88965C10.2484 4.88965 10.4626 4.96712 10.6494 5.12207C10.8363 5.27702 10.9297 5.5026 10.9297 5.79883C10.9297 6.08594 10.8385 6.31152 10.6562 6.47559C10.474 6.63509 10.2575 6.71484 10.0068 6.71484C9.74707 6.71484 9.52376 6.63509 9.33691 6.47559C9.15462 6.31608 9.06348 6.09049 9.06348 5.79883C9.06348 5.53451 9.1569 5.31803 9.34375 5.14941C9.53516 4.97624 9.75618 4.88965 10.0068 4.88965Z"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM10 1.7998C5.47126 1.7998 1.7998 5.47126 1.7998 10C1.7998 14.5287 5.47126 18.2002 10 18.2002C14.5287 18.2002 18.2002 14.5287 18.2002 10C18.2002 5.47126 14.5287 1.7998 10 1.7998Z"
        />
    </symbol>
    <symbol id="settingsIcon" viewBox="0 0 24 24">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8ZM12 9.7998C10.785 9.7998 9.7998 10.785 9.7998 12C9.7998 13.215 10.785 14.2002 12 14.2002C13.215 14.2002 14.2002 13.215 14.2002 12C14.2002 10.785 13.215 9.7998 12 9.7998Z"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.7119 2.2002C13.1961 2.20028 13.6296 2.49055 13.8164 2.93066L13.8506 3.02051L14.3652 4.56641C14.7875 4.70091 15.1932 4.87075 15.5801 5.07129L17.042 4.3418L17.1299 4.30176C17.5436 4.13502 18.017 4.21245 18.3564 4.50195L18.4268 4.56641L19.4336 5.57324C19.7985 5.93836 19.8889 6.49621 19.6582 6.95801L18.9268 8.41895C19.1274 8.80592 19.2971 9.21159 19.4316 9.63379L20.9795 10.1504C21.4693 10.3138 21.7997 10.7717 21.7998 11.2881V12.7119C21.7997 13.2284 21.4695 13.6873 20.9795 13.8506L19.4316 14.3652C19.2971 14.7875 19.1274 15.1932 18.9268 15.5801L19.6582 17.042C19.8889 17.5038 19.7985 18.0616 19.4336 18.4268L18.4268 19.4336C18.0616 19.7985 17.5038 19.8889 17.042 19.6582L15.5801 18.9268C15.1932 19.1274 14.7875 19.2971 14.3652 19.4316L13.8506 20.9795C13.6873 21.4695 13.2284 21.7997 12.7119 21.7998H11.2881C10.7717 21.7997 10.3138 21.4693 10.1504 20.9795L9.63379 19.4316C9.21159 19.2971 8.80592 19.1274 8.41895 18.9268L6.95801 19.6582C6.49621 19.8889 5.93836 19.7985 5.57324 19.4336L4.56641 18.4268C4.20146 18.0617 4.1112 17.5038 4.3418 17.042L5.07129 15.5801C4.87075 15.1932 4.70091 14.7875 4.56641 14.3652L3.02051 13.8506C2.53057 13.6873 2.20029 13.2283 2.2002 12.7119V11.2881C2.20024 10.7718 2.53076 10.3139 3.02051 10.1504L4.56641 9.63379C4.70094 9.21149 4.86966 8.80498 5.07031 8.41797L4.3418 6.95801C4.11113 6.49617 4.20145 5.93834 4.56641 5.57324L5.57324 4.56641C5.93834 4.20145 6.49617 4.11113 6.95801 4.3418L8.41797 5.07031C8.80498 4.86966 9.21149 4.70094 9.63379 4.56641L10.1504 3.02051L10.1836 2.92969C10.3706 2.49001 10.8042 2.20023 11.2881 2.2002H12.7119ZM11.0186 5.4707L10.8809 5.88477L10.458 5.99316C9.88479 6.13982 9.34317 6.36768 8.84473 6.66309L8.46875 6.88477L8.0791 6.69043L6.50098 5.90137L5.90137 6.50098L6.69043 8.0791L6.88477 8.46875L6.66309 8.84473C6.36768 9.34317 6.13982 9.88479 5.99316 10.458L5.88477 10.8809L5.4707 11.0186L3.7998 11.5762V12.4229L5.4707 12.9805L5.88477 13.1182L5.99316 13.541C6.13969 14.1141 6.36763 14.6556 6.66309 15.1543L6.88477 15.5303L6.69043 15.9199L5.90137 17.498L6.50098 18.0977L8.0791 17.3086L8.46875 17.1133L8.84473 17.3359C9.34314 17.6314 9.88463 17.8591 10.458 18.0059L10.8809 18.1143L11.0186 18.5283L11.5771 20.2002H12.4229L13.1182 18.1143L13.541 18.0059C14.1143 17.8593 14.6556 17.6314 15.1543 17.3359L15.5303 17.1143L15.9199 17.3086L17.498 18.0977L18.0977 17.498L17.3086 15.9199L17.1143 15.5303L17.3359 15.1543C17.6314 14.6556 17.8593 14.1143 18.0059 13.541L18.1143 13.1182L20.2002 12.4229V11.5762L18.1143 10.8809L18.0059 10.458C17.8591 9.88463 17.6314 9.34314 17.3359 8.84473L17.1133 8.46875L17.3086 8.0791L18.0977 6.50098L17.498 5.90137L15.9199 6.69043L15.5303 6.88477L15.1543 6.66309C14.6556 6.36763 14.1141 6.13969 13.541 5.99316L13.1182 5.88477L12.9805 5.4707L12.4229 3.7998H11.5762L11.0186 5.4707Z"
        />
    </symbol>
    <symbol id="enterFullscreenIcon" viewBox="0 0 24 24">
        <path
            d="M3 14.7002C3.49693 14.7002 3.90018 15.1027 3.90039 15.5996V20C3.90039 20.0552 3.94477 20.0996 4 20.0996H8.40039C8.89727 20.0998 9.2998 20.5031 9.2998 21C9.2998 21.4969 8.89727 21.9002 8.40039 21.9004H4C2.95066 21.9004 2.09961 21.0493 2.09961 20V15.5996C2.09982 15.1027 2.50307 14.7002 3 14.7002Z"
        />
        <path
            d="M21 14.7002C21.4969 14.7002 21.9002 15.1027 21.9004 15.5996V20C21.9004 21.0493 21.0493 21.9004 20 21.9004H15.5996C15.1027 21.9002 14.7002 21.4969 14.7002 21C14.7002 20.5031 15.1027 20.0998 15.5996 20.0996H20C20.0552 20.0996 20.0996 20.0552 20.0996 20V15.5996C20.0998 15.1027 20.5031 14.7002 21 14.7002Z"
        />
        <path
            d="M8.40039 2.09961C8.89727 2.09982 9.2998 2.50307 9.2998 3C9.2998 3.49693 8.89727 3.90018 8.40039 3.90039H4C3.94477 3.90039 3.90039 3.94477 3.90039 4V8.40039C3.90018 8.89727 3.49693 9.2998 3 9.2998C2.50307 9.2998 2.09982 8.89727 2.09961 8.40039V4C2.09961 2.95066 2.95066 2.09961 4 2.09961H8.40039Z"
        />
        <path
            d="M20 2.09961C21.0493 2.09961 21.9004 2.95066 21.9004 4V8.40039C21.9002 8.89727 21.4969 9.2998 21 9.2998C20.5031 9.2998 20.0998 8.89727 20.0996 8.40039V4C20.0996 3.94477 20.0552 3.90039 20 3.90039H15.5996C15.1027 3.90018 14.7002 3.49693 14.7002 3C14.7002 2.50307 15.1027 2.09982 15.5996 2.09961H20Z"
        />
    </symbol>
    <symbol id="supersplatIcon" viewBox="64 64 384 384">
        <path
            fill="#F26722"
            d="M129.83,217c9.75,0,17.64-7.9,17.64-17.64s-7.9-17.64-17.64-17.64-17.64,7.9-17.64,17.64,7.9,17.64,17.64,17.64Z"
        />
        <path
            fill="#F26722"
            d="M388.74,253.94c-12.46,0-22.57,10.11-22.57,22.57s10.11,22.57,22.57,22.57,22.57-10.11,22.57-22.57-10.11-22.57-22.57-22.57h0Z"
        />
        <path
            fill="#F26722"
            d="M345.26,161.1h.02c.37-.05.65-.22.97-.33,16.78-2.32,29.75-16.57,29.75-33.99,0-19.04-15.43-34.46-34.46-34.46s-34.46,15.43-34.46,34.46c0,4.29.88,8.35,2.32,12.14.04.12-.01.25.04.38,10.55,29.18-22.33,23.62-39.07,20.74-.49-.09-.88-.07-1.32-.11-4.27-.56-8.59-.97-13.03-.97-53.93,0-97.64,43.71-97.64,97.64,0,9.84,1.48,19.32,4.2,28.28.04.1,0,.17.05.27,8.97,30.15-14.83,25.49-25.52,25.69-1.04-.13-2.09-.32-3.18-.32-13.51,0-24.45,10.94-24.45,24.45s10.94,24.45,24.45,24.45c11.69,0,21.44-8.22,23.85-19.19h.02c6.31-26.57,25.9-18.02,31.15-12.67.2.2.4.26.59.42,17.44,16.25,40.75,26.26,66.47,26.26.67,0,1.34-.09,2.01-.1.66.01,1.31.04,2.04.04,9.7-.04,17.82,10.91,4.94,29.68h.13c-4.42,6.01-7.1,13.36-7.1,21.41,0,20.09,16.29,36.39,36.39,36.39s36.39-16.29,36.39-36.39c0-15.4-9.61-28.49-23.12-33.81-.32-.15-.61-.29-.98-.45-12.28-4.94-25.43-17.69-6.89-27.1l-.04-.1c31.93-16.06,53.88-49.02,53.88-87.2,0-21.15-6.8-40.68-18.23-56.66-.13-.23-.23-.47-.44-.74-23.15-31.67-2.37-36.07,10.3-38.09h-.01Z"
        />
        <path
            fill="#fff"
            d="M230.79,284.71c0,7.95-6.44,14.38-14.38,14.38s-14.38-6.44-14.38-14.38v-22.95c0-7.95,6.44-14.38,14.38-14.38s14.38,6.44,14.38,14.38v22.95Z"
        />
        <path
            fill="#fff"
            d="M309.78,284.71c0,7.95-6.44,14.38-14.38,14.38s-14.38-6.44-14.38-14.38v-22.95c0-7.95,6.44-14.38,14.38-14.38s14.38,6.44,14.38,14.38v22.95Z"
        />
    </symbol>
    <symbol id="keyboardIcon" viewBox="0 0 24 24">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 5.5h16a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5H4A2.5 2.5 0 0 1 1.5 16V8A2.5 2.5 0 0 1 4 5.5Zm0 1.8a.7.7 0 0 0-.7.7v8c0 .39.31.7.7.7h16a.7.7 0 0 0 .7-.7V8a.7.7 0 0 0-.7-.7H4Z"
        />
        <path d="M5 9h2v2H5zM8.5 9h2v2h-2zM12 9h2v2h-2zM15.5 9h2v2h-2zM7 13h10v2H7z" />
    </symbol>
    <symbol id="closeIcon" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6L6 18" />
    </symbol>
    <symbol id="chevronLeftIcon" viewBox="0 0 24 24">
        <path d="M15 19l-7-7 7-7" />
    </symbol>
    <symbol id="chevronRightIcon" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
    </symbol>
    <symbol id="exitFullscreenIcon" viewBox="0 0 24 24">
        <path
            d="M8 15.0996C8.49706 15.0996 8.90039 15.5029 8.90039 16V21C8.90039 21.4971 8.49706 21.9004 8 21.9004C7.50294 21.9004 7.09961 21.4971 7.09961 21V16.9004H3C2.50294 16.9004 2.09961 16.4971 2.09961 16C2.09961 15.5029 2.50294 15.0996 3 15.0996H8Z"
        />
        <path
            d="M21 15.0996C21.4971 15.0996 21.9004 15.5029 21.9004 16C21.9004 16.4971 21.4971 16.9004 21 16.9004H16.9004V21C16.9004 21.4971 16.4971 21.9004 16 21.9004C15.5029 21.9004 15.0996 21.4971 15.0996 21V16C15.0996 15.5029 15.5029 15.0996 16 15.0996H21Z"
        />
        <path
            d="M8 2.09961C8.49706 2.09961 8.90039 2.50294 8.90039 3V8C8.90039 8.49706 8.49706 8.90039 8 8.90039H3C2.50294 8.90039 2.09961 8.49706 2.09961 8C2.09961 7.50294 2.50294 7.09961 3 7.09961H7.09961V3C7.09961 2.50294 7.50294 2.09961 8 2.09961Z"
        />
        <path
            d="M16 2.09961C16.4971 2.09961 16.9004 2.50294 16.9004 3V7.09961H21C21.4971 7.09961 21.9004 7.50294 21.9004 8C21.9004 8.49706 21.4971 8.90039 21 8.90039H16C15.5029 8.90039 15.0996 8.49706 15.0996 8V3C15.0996 2.50294 15.5029 2.09961 16 2.09961Z"
        />
    </symbol>
</svg>
`,Yh=(e,t,n,r=1,i=24,a=20)=>{let o=Array(i).fill(0).map((e,t)=>t/i*a),s=[],c=[],l=Array(i).fill(n),u=r*.5,d=e.x-t.x,f=e.z-t.z,p=Math.sqrt(d*d+f*f),m,h,g,_;p>.001?(g=d/p,_=f/p,m=-_,h=g):(g=0,_=1,m=1,h=0);for(let n=0;n<i;++n){let r=n/i*Math.PI*2,a=u*Math.sin(r),o=u*Math.sin(2*r)/2;s.push(e.x+m*a+g*o),s.push(e.y),s.push(e.z+h*a+_*o),c.push(t.x),c.push(t.y),c.push(t.z)}return{name:`figure8`,duration:a,frameRate:1,loopMode:`repeat`,interpolation:`spline`,smoothness:1,keyframes:{times:o,values:{position:s,target:c,fov:l}}}},Xh=(e,t,n,r=12,i=20)=>{let a=Array(r).fill(0).map((e,t)=>t/r*i),o=[],s=[],c=Array(r).fill(n),l=e.x-t.x,u=e.y-t.y,d=e.z-t.z,f=Math.sqrt(l*l+d*d),p=Math.sqrt(l*l+u*u+d*d)*.3,m=Math.max(f,p),h=Math.atan2(l,d);for(let e=0;e<r;++e){let n=h-e/r*Math.PI*2;o.push(t.x+m*Math.sin(n)),o.push(t.y+u),o.push(t.z+m*Math.cos(n)),s.push(t.x),s.push(t.y),s.push(t.z)}return{name:`rotate`,duration:i,frameRate:1,loopMode:`repeat`,interpolation:`spline`,smoothness:1,keyframes:{times:a,values:{position:o,target:s,fov:c}}}},Zh=(e,t)=>1-e**(t*1e3),Qh=e=>(1-2**(-10*e))/(1-2**-10),$h=(e,t)=>(e%t+t)%t,eg=(e,t,n=1e-4)=>!e.some((e,r)=>Math.abs(e-t[r])>=n),tg=(e,t)=>{let n=180/Math.PI,r=t.x*t.x+t.z*t.z;return e.x=Math.asin(Math.max(-1,Math.min(1,t.y)))*n,e.y=r>1e-8?Math.atan2(-t.x,-t.z)*n:0,e.z=0,e},ng=.95,rg=new tt,ig=(e,t,n=-90,r=90)=>(e.x-=t[1],e.y-=t[0],e.z=0,e.x=q.clamp(e.x,n,r),e),ag=(e,t,n,r)=>{rg.setFromEulerAngles(e),rg.transformVector(W.FORWARD,t),rg.transformVector(W.RIGHT,n),rg.transformVector(W.UP,r)},og=(e,t)=>{rg.setFromEulerAngles(e),rg.transformVector(W.FORWARD,t)},sg=(e,t,n)=>{rg.setFromEulerAngles(0,e,0),rg.transformVector(W.FORWARD,t),rg.transformVector(W.RIGHT,n)},cg=(e,t,n,r,i,a,o)=>(e.set(a.x*t+o.x*n+i.x*r,a.y*t+o.y*n+i.y*r,a.z*t+o.z*n+i.z*r),e),lg=(e,t,n,r)=>{if(r<=0)return e;let i=Zh(n,r);return e.y=$h(e.y,360),e.z=$h(e.z,360),t.y=$h(t.y,360),t.z=$h(t.z,360),e.x=q.lerpAngle(e.x,t.x,i),e.y=q.lerpAngle(e.y,t.y,i),e.z=q.lerpAngle(e.z,t.z,i),e},ug=e=>{e.read()},dg=class e{times;knots;dim;constructor(e,t){this.times=e,this.knots=t,this.dim=t.length/e.length/3}evaluate(e,t){let{times:n}=this,r=n.length-1;if(e<=n[0])this.getKnot(0,t);else if(e>=n[r])this.getKnot(r,t);else{let r=0;for(;e>=n[r+1];)r++;this.evaluateSegment(r,(e-n[r])/(n[r+1]-n[r]),t)}}getKnot(e,t){let{knots:n,dim:r}=this,i=e*3*r;for(let e=0;e<r;++e)t[e]=n[i+e*3+1]}evaluateSegment(e,t,n){let{knots:r,dim:i}=this,a=t*t,o=t+t,s=1-t,c=s*s,l=e*i*3;for(let e=0;e<i;++e){let s=r[l+1],u=r[l+2],d=r[l+i*3],f=r[l+i*3+1];l+=3,n[e]=s*((1+o)*c)+t*c*u+f*(a*(3-o))+d*(a*(t-1))}}static calcKnots(e,t,n){let r=e.length,i=t.length/r,a=Array(r*i*3);for(let o=0;o<r;o++){let s=e[o];for(let c=0;c<i;c++){let l=o*i+c,u=t[l],d;d=o===0?(t[l+i]-u)/(e[o+1]-s):o===r-1?(u-t[l-i])/(s-e[o-1]):(t[l+i]-t[l-i])/(e[o+1]-e[o-1]);let f=o>0?e[o]-e[o-1]:e[1]-e[0],p=o<r-1?e[o+1]-e[o]:e[o]-e[o-1];a[l*3]=d*f*n,a[l*3+1]=u,a[l*3+2]=d*p*n}}return a}static fromPoints(t,n,r=1){return new e(t,e.calcKnots(t,n,r))}static fromPointsLooping(t,n,r,i=1){if(n.length<2)return e.fromPoints(n,r);let a=r.length/n.length,o=n.slice(),s=r.slice();return o.push(t+n[0],t+n[1]),s.push(...r.slice(0,a*2)),o.splice(0,0,n[n.length-2]-t,n[n.length-1]-t),s.splice(0,0,...r.slice(r.length-a*2)),e.fromPoints(o,s,i)}},fg=class{duration=0;loopMode=`none`;timer=0;cursor=0;constructor(e,t){this.reset(e,t)}update(e){if(this.timer+=e,this.cursor+=e,this.cursor>=this.duration)switch(this.loopMode){case`none`:this.cursor=this.duration;break;case`repeat`:this.cursor%=this.duration;break;case`pingpong`:this.cursor%=this.duration*2}}reset(e,t){this.duration=e,this.loopMode=t,this.timer=0,this.cursor=0}get ended(){return this.loopMode===`none`&&this.cursor>=this.duration}set value(e){this.cursor=this.loopMode===`repeat`?$h(e,this.duration):Math.max(0,Math.min(this.duration,e))}get value(){return this.cursor>this.duration?2*this.duration-this.cursor:this.cursor}},pg=class e{spline;cursor=new fg(0,`none`);frameRate;result=[];position=new W;target=new W;fov=90;constructor(e,t,n,r){this.spline=e,this.cursor.reset(t,n),this.frameRate=r}update(e){let{cursor:t,result:n,spline:r,frameRate:i,position:a,target:o}=this;t.update(e),r.evaluate(t.value*i,n),n.every(isFinite)&&(a.set(n[0],n[1],n[2]),o.set(n[3],n[4],n[5]),this.fov=n[6])}static fromTrack(t){let{keyframes:n,duration:r,frameRate:i,loopMode:a,smoothness:o}=t,{times:s,values:c}=n,{position:l,target:u,fov:d}=c,f=[];for(let e=0;e<s.length;e++)f.push(l[e*3],l[e*3+1],l[e*3+2]),f.push(u[e*3],u[e*3+1],u[e*3+2]),f.push(d[e]);let p=+(r===s[s.length-1]/i),m=a===`repeat`?dg.fromPointsLooping((r+p)*i,s,f,o):dg.fromPoints(s,f,o);return new e(m,r,a,i)}},mg=class{animState;constructor(e){this.animState=pg.fromTrack(e),this.animState.update(0)}onEnter(e){e.look(this.animState.position,this.animState.target),e.fov=this.animState.fov}update(e,t,n){this.animState.update(e),n.look(this.animState.position,this.animState.target),n.fov=this.animState.fov,ug(t)}onExit(e){}},hg=new tt,gg=new W,_g=new W,vg=class{position=new W;angles=new W;distance=1;fov=65;constructor(e){e&&this.copy(e)}copy(e){this.position.copy(e.position),this.angles.copy(e.angles),this.distance=e.distance,this.fov=e.fov}lerp(e,t,n){e.calcFocusPoint(gg),t.calcFocusPoint(_g),this.position.lerp(e.position,t.position,n),gg.lerp(gg,_g,n).sub(this.position),this.distance=gg.length(),tg(this.angles,gg.mulScalar(1/this.distance)),this.fov=q.lerp(e.fov,t.fov,n)}lerpAngles(e,t,n,r=n){this.position.lerp(e.position,t.position,n),this.angles.x=q.lerp(e.angles.x,t.angles.x,r),this.angles.y=e.angles.y+($h(t.angles.y-e.angles.y+180,360)-180)*r,this.angles.z=q.lerp(e.angles.z,t.angles.z,r),this.distance=q.lerp(e.distance,t.distance,n),this.fov=q.lerp(e.fov,t.fov,n)}look(e,t){this.position.copy(e),this.distance=e.distance(t);let n=gg.sub2(t,e).normalize();tg(this.angles,n)}calcFocusPoint(e){hg.setFromEulerAngles(this.angles).transformVector(W.FORWARD,e).mulScalar(this.distance).add(this.position)}},yg=class{_position=new W;_angles=new W;_distance=1;_has=!1;get has(){return this._has}store(e,t,n){this._position.copy(e),this._angles.copy(t),this._distance=n,this._has=!0}restore(e,t){return e.copy(this._position),t.copy(this._angles),this._distance}},bg=.001,xg=3,Sg=1e-10,Cg=1/Math.sqrt(2),wg=[[0,0,!0],[1,0,!1],[-1,0,!1],[0,1,!1],[0,-1,!1],[Cg,Cg,!1],[-Cg,Cg,!1],[-Cg,-Cg,!1],[Cg,-Cg,!1]],Tg=new W,Eg=new W,Dg=new W,Og=new W,kg=new W,Ag=new W,jg=new W,Mg=new W,Ng=new W(0,1,0),Pg=new W(1,0,0),Fg={x:0,y:0,z:0},Ig={x:0,y:0,z:0,nx:0,ny:1,nz:0,travel:0},Lg=class{collision=null;radius;_lastClearPosition=new W;_hasLastClearPosition=!1;constructor(e){this.radius=e}reset(e){this._setLastClearPosition(e)}move(e,t){if(!this.collision)e.add(t),this._setLastClearPosition(e);else if(Eg.copy(t),this._isMoveComplete(Eg))this.resolve(e);else for(let t=0;t<xg&&!this._isMoveComplete(Eg)&&this._moveAndSlide(e,Eg);t++);}resolve(e){this.collision?(this._resolveSphere(e,Dg),!this._isSphereClear(e)&&this._hasLastClearPosition&&e.copy(this._lastClearPosition),this._isSphereClear(e)&&this._setLastClearPosition(e)):this._setLastClearPosition(e)}_moveAndSlide(e,t){let n=t.x*t.x+t.y*t.y+t.z*t.z,r=Math.sqrt(n);return Og.copy(t).mulScalar(1/r),this._querySweep(e,Og,r,Ig)?(e.add(Tg.copy(Og).mulScalar(Ig.travel)),this.resolve(e),kg.set(Ig.nx,Ig.ny,Ig.nz),t.add(Tg.copy(Og).mulScalar(-Ig.travel)),this._clipMove(t,kg),!0):(e.add(t),this.resolve(e),!1)}_querySweep(e,t,n,r){Math.abs(t.y)<.99?Ag.cross(t,Ng).normalize():Ag.cross(t,Pg).normalize(),jg.cross(t,Ag).normalize();let i=!1,a=1/0;for(let o=0;o<wg.length;o++){let[s,c,l]=wg[o],u=l?0:this.radius,d=l?this.radius:0;Mg.copy(e),l||(Mg.add(Tg.copy(Ag).mulScalar(s*u)),Mg.add(Tg.copy(jg).mulScalar(c*u)));let f=this.collision.queryRay(Mg.x,Mg.y,Mg.z,t.x,t.y,t.z,n+d+bg);if(!f)continue;let p=f.x-Mg.x,m=f.y-Mg.y,h=f.z-Mg.z,g=Math.max(0,p*t.x+m*t.y+h*t.z),_=l?this.radius:0,v=q.clamp(g-_-bg,0,n);if(v>=a)continue;let y=this.collision.querySurfaceNormal(f.x,f.y,f.z,t.x,t.y,t.z);i=!0,a=v,r.x=f.x,r.y=f.y,r.z=f.z,r.nx=y.nx,r.ny=y.ny,r.nz=y.nz,r.travel=v}return i}_resolveSphere(e,t){return this.collision.querySphere(e.x,e.y,e.z,this.radius,Fg)?(e.x+=Fg.x,e.y+=Fg.y,e.z+=Fg.z,t.x=Fg.x,t.y=Fg.y,t.z=Fg.z,!0):(t.set(0,0,0),!1)}_clipMove(e,t){let n=t.x*t.x+t.y*t.y+t.z*t.z;if(n<=Sg)return;let r=1/Math.sqrt(n),i=t.x*r,a=t.y*r,o=t.z*r,s=e.x*i+e.y*a+e.z*o;s<0&&(e.x-=s*i,e.y-=s*a,e.z-=s*o)}_isMoveComplete(e){return e.x*e.x+e.y*e.y+e.z*e.z<=Sg}_isSphereClear(e){return!this.collision.querySphere(e.x,e.y,e.z,this.radius,Fg)}_setLastClearPosition(e){this._lastClearPosition.copy(e),this._hasLastClearPosition=!this.collision||this._isSphereClear(e)}},Rg=3,zg={x:0,y:0,z:0},Bg=(e,t,n,r,i,a)=>{let o=e.voxelResolution,s=i*Rg,c=s*s,l=Math.ceil(s/o),u=1/0,d=!1;for(let s=0;s<=l&&!(s*o*(s*o)>=u);s++)for(let l=-s;l<=s;l++){let f=l<0?-l:l;for(let p=-s;p<=s;p++){let m=p<0?-p:p,h=f===s||m===s?1:2*s;for(let f=-s;f<=s;f+=h){let s=(f*f+l*l+p*p)*o*o;if(s>=u||s>c)continue;let m=t+f*o,h=n+l*o,g=r+p*o;e.querySphere(m,h,g,i,zg)||(u=s,a.x=m,a.y=h,a.z=g,d=!0)}}}return d},Vg=.2,Hg=new W,Ug=new W,Wg=new W,Gg=new W,Kg=new W,qg={x:0,y:0,z:0},Jg=(e,t)=>!e.querySphere(t.x,t.y,t.z,Vg,qg),Yg=class{fov=90;rotateDamping=ng;_position=new W;_angles=new W;_targetAngles=new W;_distance=1;_spawn=new yg;_mover=new Lg(Vg);_pendingCollision=null;_hasPosition=!1;set collision(e){e&&this._hasPosition&&!Jg(e,this._position)?(this._pendingCollision=e,this._mover.collision=null,this._mover.reset(this._position)):(this._pendingCollision=null,this._mover.collision=e,this._mover.reset(this._position))}get collision(){return this._mover.collision}_reengage(){this.collision=this._mover.collision??this._pendingCollision}onEnter(e){this.goto(e);let t=this._mover.collision??this._pendingCollision;this._pendingCollision=null,t&&(Bg(t,this._position.x,this._position.y,this._position.z,Vg,Kg)&&this._position.copy(Kg),this.collision=t),this._storeSpawn()}update(e,t,n){this._pendingCollision&&Jg(this._pendingCollision,this._position)&&this._reengage();let{move:r,rotate:i}=t.read();ig(this._targetAngles,i),lg(this._angles,this._targetAngles,this.rotateDamping,e),this._step(r),n.position.copy(this._position),n.angles.set(this._angles.x,this._angles.y,0),n.distance=this._distance,n.fov=this.fov}onExit(e){}goto(e){this._hasPosition=!0,this._position.copy(e.position),this._angles.set(e.angles.x,e.angles.y,0),this._targetAngles.copy(this._angles),this._distance=e.distance,this._mover.reset(this._position)}resetToSpawn(e){return this._spawn.has?(this._distance=this._spawn.restore(this._position,this._angles),this._targetAngles.copy(this._angles),this._reengage(),e.position.copy(this._position),e.angles.copy(this._angles),e.distance=this._distance,e.fov=this.fov,!0):!1}_storeSpawn(){this._spawn.store(this._position,this._angles,this._distance)}_step(e){ag(this._angles,Hg,Ug,Wg),cg(Gg,e[0],e[1],e[2],Hg,Ug,Wg),this._mover.move(this._position,Gg)}},Xg=180/Math.PI,Zg=e=>(e%360+540)%360-180,Qg=(e,t,n)=>{let r=q.clamp((n-e)/(t-e),0,1);return r*r*(3-2*r)},$g=(e,t,n)=>e<t?Math.min(t,e+n):Math.max(t,e-n),e_=(e,t,n,r,i)=>{if(i<=0)return e;let a=q.clamp(t*r,-n,n),o=1-Math.exp(-4*r*i);return e+(a-e)*o},t_=(e,t,n)=>{let r=e*n;return Math.abs(t)<1e-4?0:Math.sign(r)===Math.sign(t)&&Math.abs(r)>Math.abs(t)?t:r},n_=(e,t)=>Math.atan2(-e,-t)*Xg,r_=(e,t,n)=>Zg(n_(e,t)-n),i_=e=>Math.asin(q.clamp(e,-1,1))*Xg,a_=class{_blockedTime=0;_prevDist=1/0;reset(){this._blockedTime=0,this._prevDist=1/0}update(e,t,n,r,i=!0){if(i&&this._prevDist!==1/0&&t>0){if((this._prevDist-e)/t<n){if(this._blockedTime+=t,this._blockedTime>=r)return this._prevDist=e,!0}else this._blockedTime=0}return this._prevDist=e,!1}},o_=Math.PI/180,s_=.75,c_=.75,l_=4,u_=.03,d_=.05,f_=1.75,p_=.25,m_=.5,h_=new W,g_=new W,__=new W,v_=e=>{let t=q.clamp(e,15,120)*o_*.5;return q.clamp(s_/Math.tan(t),c_,l_)},y_=class{flySpeed=4;maxTurnRate=180;turnGain=4;moveAcceleration=6;moveDeceleration=8;onComplete=null;_target=null;_yawRate=0;_pitchRate=0;_speed=0;_progress=new a_;_speedMul=1;get isActive(){return this._target!==null}navigateTo(e,t=1){let n=this._target!==null;this._target||=new W,this._target.copy(e),this._speedMul=t,n||(this._yawRate=0,this._pitchRate=0,this._speed=0),this._progress.reset()}cancel(){this._target&&(this._target=null,this._yawRate=0,this._pitchRate=0,this._speed=0,this._progress.reset(),this.onComplete?.())}update(e,t,n){if(!this._target)return;let r=this._target,i=t.position,a=t.angles;h_.sub2(r,i);let o=h_.length(),s=o-v_(t.fov),c=Math.max(0,s);if(c<=u_&&this._speed<=d_){this.cancel();return}if(e<=0)return;let l=1/o,u=h_.x*l,d=h_.y*l,f=h_.z*l,p=r_(h_.x,h_.z,a.y),m=i_(d)-a.x;this._yawRate=e_(this._yawRate,p,this.maxTurnRate,this.turnGain,e),this._pitchRate=e_(this._pitchRate,m,this.maxTurnRate,this.turnGain,e);let h=t_(this._yawRate,p,e),g=t_(this._pitchRate,m,e);this._yawRate=h/e,this._pitchRate=g/e,n.deltas.rotate.append([-h,-g,0]),__.set(a.x+g,a.y+h,0),og(__,g_);let _=q.clamp(g_.x*u+g_.y*d+g_.z*f,0,1),v=Qg(.05,.95,_),y=Math.sqrt(2*this.moveDeceleration*c),b=c*f_,x=Math.min(this.flySpeed*this._speedMul,y,b);this._speed=x>this._speed?$g(this._speed,x,this.moveAcceleration*v*e):$g(this._speed,x,this.moveDeceleration*e);let S=c*(1-Math.exp(-1.75*e)),C=Math.min(this._speed*e,S);C>0&&n.deltas.move.append([0,0,C]),this._progress.update(o,e,p_,m_,_>.5&&this._speed>p_)&&this.cancel()}},b_=new sa,x_=class{controller;fov=90;constructor(){this.controller=new Aa,this.controller.zoomRange=new Qe(.01,1/0),this.controller.pitchRange=new Qe(-90,90),this.controller.rotateDamping=ng,this.controller.moveDamping=ng,this.controller.zoomDamping=ng}onEnter(e){this._attach(e)}update(e,t,n){let r=this.controller.update(t,e);n.position.copy(r.position),n.angles.copy(r.angles),n.distance=r.distance,n.fov=this.fov}onExit(e){}goto(e){this.fov=e.fov,this._attach(e)}_attach(e){b_.position.copy(e.position),b_.angles.copy(e.angles),b_.distance=Math.max(e.distance,this.controller.zoomRange.x),this.controller.attach(b_,!1)}},S_=1/60,C_=10,w_=10,T_=1e3,E_=.25,D_=3,O_={x:0,y:0,z:0},k_=new W,A_=new W,j_=new W,M_=new W,N_=new W,P_=[0,0,0],F_=new W,I_=class{fov=90;capsuleHeight=1.5;capsuleRadius=.2;eyeHeight=1.3;gravity=9.8;jumpSpeed=4;moveGroundSpeed=7;moveAirSpeed=1;rotateDamping=ng;velocityDampingGround=.99;velocityDampingAir=.998;hoverHeight=.2;springStiffness=800;springDamping=57;groundProbeRange=1;_position=new W;_prevPosition=new W;_angles=new W;_targetAngles=new W;_distance=1;_spawn=new yg;_velocity=new W;_pendingMove=[0,0,0];_accumulator=0;_grounded=!1;_jumping=!1;_jumpHeld=!1;_collision=null;_pendingCollision=null;_heldFloorY=null;_hasPosition=!1;set collision(e){e&&this._hasPosition&&!this._canEngage(e,this._position)?this._hold(e):(this._pendingCollision=null,this._heldFloorY=null,this._collision=e)}get collision(){return this._collision}onEnter(e){this.goto(e);let t=this._collision??this._pendingCollision;this._pendingCollision=null,this._collision=null,this._heldFloorY=this._position.y-this.eyeHeight-this.hoverHeight,this._grounded=!0,t&&(this._standOnFloor(t)||this._fit(t,this._position),this.collision=t),this._spawn.store(this._position,this._angles,this._distance),this._prevPosition.copy(this._position)}update(e,t,n){let{move:r,rotate:i}=t.read();ig(this._targetAngles,i),lg(this._angles,this._targetAngles,this.rotateDamping,e),this._pendingMove[0]+=r[0],this._pendingMove[1]=this._pendingMove[1]||r[1],this._pendingMove[2]+=r[2],this._accumulator=Math.min(this._accumulator+e,C_*S_);let a=Math.floor(this._accumulator/S_);if(a>0){let e=1/a;P_[0]=this._pendingMove[0]*e,P_[1]=this._pendingMove[1],P_[2]=this._pendingMove[2]*e;for(let e=0;e<a;e++)this._prevPosition.copy(this._position),this._step(S_,P_),this._accumulator-=S_;this._pendingMove[0]=0,this._pendingMove[1]=0,this._pendingMove[2]=0}let o=this._accumulator/S_;n.position.lerp(this._prevPosition,this._position,o),n.angles.set(this._angles.x,this._angles.y,0),n.distance=this._distance,n.fov=this.fov}_step(e,t){this._pendingCollision&&this._canEngage(this._pendingCollision,this._position)&&(this._collision=this._pendingCollision,this._pendingCollision=null,this._heldFloorY=null);let n=this._probeGround(this._position);n===null&&this._collision&&!this._floorBelow(this._collision,this._position)&&(this._hold(this._collision),n=this._heldFloorY);let r=n!==null;if(this._velocity.y<0&&(this._jumping=!1),t[1]&&!this._jumping&&this._grounded&&!this._jumpHeld&&(this._jumping=!0,this._velocity.y=this.jumpSpeed,this._grounded=!1),this._jumpHeld=!!t[1],r&&!this._jumping){let t=n+this.hoverHeight+this.eyeHeight,r=this._position.y-t;if(r>.1)this._velocity.y-=this.gravity*e,this._position.y+this._velocity.y*e<=t&&(this._position.y=t,this._velocity.y=0),this._grounded=!1;else{let t=-this.springStiffness*r-this.springDamping*this._velocity.y;this._velocity.y+=t*e,this._grounded=!0}}else this._velocity.y-=this.gravity*e,this._grounded=!1;sg(this._angles.y,M_,N_),cg(F_,t[0],0,t[2],M_,N_,W.UP),this._velocity.add(F_.mulScalar(this._grounded?this.moveGroundSpeed:this.moveAirSpeed));let i=Zh(this._grounded?this.velocityDampingGround:this.velocityDampingAir,e);this._velocity.x=q.lerp(this._velocity.x,0,i),this._velocity.z=q.lerp(this._velocity.z,0,i),this._position.add(k_.copy(this._velocity).mulScalar(e)),this._checkCollision(this._position,A_)}onExit(e){}goto(e){this._hasPosition=!0,this._position.copy(e.position),this._prevPosition.copy(this._position),this._angles.set(e.angles.x,e.angles.y,0),this._targetAngles.copy(this._angles),this._distance=e.distance,this._resetMotion()}resetToSpawn(e){if(!this._spawn.has)return!1;this._distance=this._spawn.restore(this._position,this._angles),this._prevPosition.copy(this._position),this._targetAngles.copy(this._angles),this._resetMotion();let t=this._collision??this._pendingCollision;return t&&(this.collision=t),e.position.copy(this._position),e.angles.copy(this._angles),e.distance=this._distance,e.fov=this.fov,!0}_resetMotion(){this._velocity.set(0,0,0),this._grounded=!1,this._jumping=!1,this._jumpHeld=!1,this._pendingMove[0]=0,this._pendingMove[1]=0,this._pendingMove[2]=0,this._accumulator=0}_capsuleClear(e,t){let n=t.y-this.eyeHeight+this.capsuleHeight*.5,r=this.capsuleHeight*.5-this.capsuleRadius;return!e.queryCapsule(t.x,n,t.z,r,this.capsuleRadius,O_)}_floorBelow(e,t){return!!e.queryRay(t.x,t.y-this.eyeHeight,t.z,0,-1,0,w_)}_canEngage(e,t){return this._capsuleClear(e,t)&&this._floorBelow(e,t)}_standOnFloor(e){let t=this._position;if(this._tryStandFrom(e,t.y,T_))return!0;for(let n=E_;n<=2.000001;n+=E_)if(this._tryStandFrom(e,t.y+n,n))return!0;return!1}_tryStandFrom(e,t,n){let r=this._position,i=e.queryRay(r.x,t,r.z,0,-1,0,n);return!i||i.y>=t||(k_.set(r.x,i.y+this.hoverHeight+this.eyeHeight,r.z),!this._fit(e,k_))?!1:(r.copy(k_),!0)}_fit(e,t){let n=t.y-this.eyeHeight+this.capsuleHeight*.5,r=this.capsuleHeight*.5-this.capsuleRadius;if(!e.queryCapsule(t.x,n,t.z,r,this.capsuleRadius,O_))return!0;let i=this.capsuleRadius*D_;return O_.x*O_.x+O_.y*O_.y+O_.z*O_.z>i*i||(j_.set(t.x+O_.x,t.y+O_.y,t.z+O_.z),!this._capsuleClear(e,j_))?!1:(t.copy(j_),!0)}_hold(e){this._pendingCollision=e,this._collision=null,this._heldFloorY=this._position.y-this.eyeHeight-this.hoverHeight,this._velocity.y=0,this._jumping=!1}_probeGround(e){if(this._heldFloorY!==null)return this._heldFloorY;if(!this.collision)return null;let t=e.y-this.eyeHeight,n=this.capsuleRadius,r=this.groundProbeRange,i=0,a=0;for(let o=0;o<5;o++){let s=e.x,c=e.z;o===1?s-=n:o===2?s+=n:o===3?c+=n:o===4&&(c-=n);let l=this.collision.queryRay(s,t,c,0,-1,0,r);l&&(i+=l.y,a++)}return a>0?i/a:null}_checkCollision(e,t){if(!this.collision)return;let n=e.y-this.eyeHeight+this.capsuleHeight*.5,r=this.capsuleHeight*.5-this.capsuleRadius;this.collision.queryCapsule(e.x,n,e.z,r,this.capsuleRadius,O_)&&(t.set(O_.x,O_.y,O_.z),e.add(t),t.y<0&&this._velocity.y>0&&(this._velocity.y=0),!this._grounded&&t.y>0&&this._velocity.y<0&&(this._velocity.y=0,this._grounded=!0))}},L_=.5,R_=.6,z_=.2,B_=class{walkSpeed=4;maxTurnRate=192;turnGain=5;onComplete=null;_target=null;_yawRate=0;_progress=new a_;_speedMul=1;get isActive(){return this._target!==null}navigateTo(e,t=1){this._target||=new W,this._target.copy(e),this._speedMul=t,this._progress.reset()}cancel(){this._target&&(this._target=null,this._yawRate=0,this._progress.reset(),this.onComplete?.())}update(e,t,n){if(!this._target)return;let r=this._target,i=t.position,a=t.angles,o=r.x-i.x,s=r.z-i.z,c=Math.sqrt(o*o+s*s);if(c<L_||this._progress.update(c,e,R_,z_)){this.cancel();return}let l=r_(o,s,a.y);this._yawRate=e_(this._yawRate,l,this.maxTurnRate,this.turnGain,e);let u=t_(this._yawRate,l,e);this._yawRate=e>0?u/e:this._yawRate,n.deltas.rotate.append([-u,0,0]);let d=Math.max(0,Math.cos(l*Math.PI/180));n.deltas.move.append([0,0,this.walkSpeed*this._speedMul*e*d])}},V_=new vg,H_=new W,U_=new W,W_=1.2,G_=2.4,K_=5,q_=3,J_=.8,Y_=e=>t=>1-(1-t)**K_*(1+(K_-e)*t),X_=5,Z_=e=>{let{x:t,z:n}=e.halfExtents;return t*2>=X_&&n*2>=X_},Q_=(e,t)=>!!t&&Z_(e),$_=(e,t,n)=>{let r=new vg;return r.look(e,t),r.fov=n,r},ev=(e,t)=>{let n=e.halfExtents.length()/Math.sin(t/180*Math.PI*.5);return $_(new W(2,1,2).normalize().mulScalar(n).add(e.center),e.center,t)},tv=class{update;seek;selectAnnotation;snap;transitionProgress;setCollision;isObjectExperience;camera=new vg;constructor(e,t,n=null,r=!0){let{events:i,settings:a,state:o}=e,s=Q_(t,n),c=a.cameras[0]?.initial,l=ev(t,c?.fov??Jl),u=c?$_(new W(c.position),new W(c.target),c.fov):l,d=(e,t)=>{let{animTracks:n}=a;return n?.length>0&&a.startMode===`animTrack`?n[0]:t?(e.calcFocusPoint(H_),Xh(e.position,H_,e.fov)):(e.calcFocusPoint(H_),Yh(e.position,H_,e.fov))},f=!t.containsPoint(u.position);this.isObjectExperience=f;let p=r?d(u,f):null,m={orbit:new x_,fly:new Yg,walk:new I_,anim:p?new mg(p):null};m.orbit.fov=u.fov,m.fly.fov=u.fov,m.fly.collision=n,m.walk.collision=n;let h=new B_,g=new y_,_={walk:h,fly:g};h.onComplete=g.onComplete=()=>{i.fire(`navigateComplete`)};let v=e=>m[e];r&&(o.hasAnimation=!!m.anim,o.animationDuration=m.anim?m.anim.animState.cursor.duration:0),o.cameraMode=m.anim?`anim`:f?`orbit`:s?`walk`:`fly`,this.camera.copy(u);let y=new vg(this.camera),b=new vg(this.camera),x=()=>f?`orbit`:s?`walk`:`fly`,S=null,C=f?`orbit`:`fly`;v(o.cameraMode).onEnter(this.camera);let w=1,T=1,E=Qh,D=null,O=!1,k=0,A=this.camera.position.clone(),j=(e=1,t=Qh,n=null)=>{b.copy(this.camera),w=0,T=e,E=t,D=n};this.transitionProgress=()=>w<1?E(w):1,this.setCollision=e=>{m.fly.collision=e,m.walk.collision=e,s=Q_(t,e)},this.snap=()=>{v(o.cameraMode).onEnter(this.camera),y.copy(this.camera),w=1,e.app.renderNextFrame=!0},this.update=(e,t)=>{let n=o.cameraMode===`anim`&&o.animationPaused?0:e,r=w;w=Math.min(1,w+e/T);let a=v(o.cameraMode);if(_[o.cameraMode]?.update(n,this.camera,t),a.update(n,t,y),w<1){let e=E(w);D?this.camera.lerpAngles(b,y,e,D(w)):this.camera.lerp(b,y,e)}else this.camera.copy(y);e>0&&(k=this.camera.position.distance(A)/e),A.copy(this.camera.position),o.cameraMode===`anim`&&(o.animationTime=m.anim.animState.cursor.value,!o.animationPaused&&m.anim.animState.cursor.ended&&(o.animationPaused=!0)),O&&r<1&&w===1&&(O=!1,i.fire(`orbitTarget:clear`))},i.on(`inputEvent`,e=>{switch(e){case`frame`:i.fire(`orbitTarget:clear`),o.cameraMode=`orbit`,m.orbit.goto(l),j();break;case`reset`:o.cameraMode===`walk`?(h.cancel(),i.fire(`navTarget:clear`),j(),m.walk.resetToSpawn(y)):o.cameraMode===`fly`?(g.cancel(),j(),m.fly.resetToSpawn(y)):(i.fire(`orbitTarget:clear`),o.cameraMode=`orbit`,m.orbit.goto(u),j());break;case`playPause`:m.anim?o.hasAnimation&&(o.cameraMode===`anim`?o.animationPaused=!o.animationPaused:(o.cameraMode=`anim`,o.animationPaused=!1)):o.hasAnimation&&(o.animationPaused=!o.animationPaused);break;case`requestFirstPerson`:o.cameraMode=s?`walk`:`fly`;break;case`toggleWalk`:s&&(o.cameraMode===`walk`?o.cameraMode=C:o.cameraMode=`walk`);break;case`exitWalk`:o.cameraMode===`walk`&&(o.cameraMode=C);break;case`cancel`:o.cameraMode===`anim`&&(o.cameraMode=S??x());break;case`interrupt`:o.cameraMode===`anim`&&(o.cameraMode=S??x())}}),i.on(`cameraMode:changed`,(e,t)=>{v(e)?v(t)&&(e===`walk`&&(C=t),_[t]?.cancel(),j(),y.copy(this.camera),S=t,v(t).onExit(this.camera),v(e).onEnter(this.camera)):o.cameraMode=t}),i.on(`animationPaused:changed`,e=>{let t=m.anim?.animState;if(!e&&t){let{cursor:e}=t;e.loopMode===`none`&&e.duration-e.value<1/t.frameRate&&(e.value=0)}}),this.seek=e=>{m.anim&&(o.cameraMode=`anim`,m.anim.animState.cursor.value=e,o.animationTime=m.anim.animState.cursor.value)},i.on(`pick`,e=>{o.cameraMode=`orbit`,V_.copy(this.camera),V_.look(this.camera.position,e),m.orbit.goto(V_),j(),O=!0}),this.selectAnnotation=e=>{i.fire(`orbitTarget:clear`),o.cameraMode=`orbit`;let{initial:n}=e.camera;V_.fov=n.fov,V_.look(new W(n.position),new W(n.target)),V_.calcFocusPoint(H_),H_.sub(V_.position).normalize();let r=U_.set(...e.position).sub(V_.position).dot(H_);r>.001&&(V_.distance=r);let a=this.camera.position.distance(V_.position),s=Math.max(t.halfExtents.length(),.001);this.camera.calcFocusPoint(H_),H_.sub(this.camera.position).normalize(),V_.calcFocusPoint(U_),U_.sub(V_.position).normalize();let c=Math.acos(Math.max(-1,Math.min(1,H_.dot(U_))))/Math.PI,l=Math.max(W_,Math.min(G_,W_+.8*a/s+.6*c)),u=a>1e-6?Math.min(q_,k*l/a):0,d=Y_(u),f=Y_(u*J_);m.orbit.goto(V_),j(l,d,e=>f(Math.min(1,e/J_)))},i.on(`navigateTo`,(e,t,n=1)=>{let r=_[o.cameraMode];r&&(r.navigateTo(e,n),i.fire(`navTarget:set`,e,t))}),i.on(`navigateCancel`,()=>{_[o.cameraMode]?.cancel(),i.fire(`navTarget:clear`)}),i.on(`navigateComplete`,()=>{i.fire(`navTarget:clear`)})}},nv=`
varying vec2 vUv0;

uniform sampler2D source;
uniform vec2 uSrcSize;
uniform float uRatio;
uniform float uFlipY;

void main(void) {
    int r = int(uRatio);
    vec2 outSize = uSrcSize / uRatio;
    vec2 uv = vUv0;
    if (uFlipY > 0.5) {
        uv.y = 1.0 - uv.y;
    }
    vec2 base = floor(uv * outSize) * uRatio;
    vec4 sum = vec4(0.0);
    for (int y = 0; y < 8; y++) {
        if (y >= r) break;
        for (int x = 0; x < 8; x++) {
            if (x >= r) break;
            vec2 texel = base + vec2(float(x) + 0.5, float(y) + 0.5);
            sum += texture2D(source, texel / uSrcSize);
        }
    }
    gl_FragColor = sum / (uRatio * uRatio);
}
`,rv=`
varying vUv0: vec2f;
var source: texture_2d<f32>;
var sourceSampler: sampler;
uniform uSrcSize: vec2f;
uniform uRatio: f32;
uniform uFlipY: f32;

@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;
    let r: i32 = i32(uniform.uRatio);
    let outSize: vec2f = uniform.uSrcSize / uniform.uRatio;
    var uv: vec2f = input.vUv0;
    if (uniform.uFlipY > 0.5) {
        uv.y = 1.0 - uv.y;
    }
    let base: vec2f = floor(uv * outSize) * uniform.uRatio;
    var sum: vec4f = vec4f(0.0);
    for (var y: i32 = 0; y < 8; y = y + 1) {
        if (y >= r) { break; }
        for (var x: i32 = 0; x < 8; x = x + 1) {
            if (x >= r) { break; }
            let texel: vec2f = base + vec2f(f32(x) + 0.5, f32(y) + 0.5);
            sum = sum + textureSample(source, sourceSampler, texel / uniform.uSrcSize);
        }
    }
    output.color = sum / (uniform.uRatio * uniform.uRatio);
    return output;
}
`,iv=class{app;device;camera;getCameraFrame;shader;srcRT=null;dstRT=null;destroyed=!1;constructor(e,t,n){this.app=e,this.device=e.graphicsDevice,this.camera=t,this.getCameraFrame=n,this.shader=N.createShader(this.device,{uniqueName:`captureBoxDownsample`,attributes:{vertex_position:U},vertexChunk:`fullscreenQuadVS`,fragmentGLSL:nv,fragmentWGSL:rv})}makeRT(e,t,n,r){let i=this.device.backBuffer?.isColorBufferSrgb?.(0)??!1,a=new H(this.device,{name:e,width:t,height:n,format:7,mipmaps:!1,minFilter:1,magFilter:1,addressU:1,addressV:1}),o=new Ze({name:e,colorBuffer:a,depth:r});return o.isColorBufferSrgb=()=>i,o}destroy(){this.destroyed=!0;for(let e of[`srcRT`,`dstRT`])this[e]?.colorBuffer.destroy(),this[e]?.destroy(),this[e]=null;this.shader.destroy()}ensure(e,t,n,r){let i=this[e];if(i&&i.width===t&&i.height===n)return i;i?.colorBuffer.destroy(),i?.destroy();let a=this.makeRT(e,t,n,r);return this[e]=a,a}setCameraTarget(e){this.camera.renderTarget=e;let t=this.getCameraFrame();if(t){let e=t.renderPassCamera;e&&(e.layersDirty=!0),t.update()}}async grab({time:e,width:t,height:n,supersample:r=2,scrub:i}){let a=this.device,o=Math.min(8,Math.max(1,Math.round(r))),s=Math.max(1,Math.round(t)),c=Math.max(1,Math.round(n)),l=s*o,u=c*o,d=this.ensure(`srcRT`,l,u,!0),f=this.camera,p={renderTarget:f.renderTarget,aspectRatioMode:f.aspectRatioMode,aspectRatio:f.aspectRatio,horizontalFov:f.horizontalFov};try{f.aspectRatioMode=0,f.horizontalFov=l>=u,this.setCameraTarget(d),e!==void 0&&i&&await i(e),this.app.renderNextFrame=!0,await new Promise(e=>{this.app.once(`frameend`,()=>e())});let t=this.ensure(`dstRT`,s,c,!1),{scope:n}=a;n.resolve(`source`).setValue(d.colorBuffer),n.resolve(`uSrcSize`).setValue([l,u]),n.resolve(`uRatio`).setValue(o),n.resolve(`uFlipY`).setValue(+!d.flipY),a.setBlendState(Ae.NOBLEND),L(a,t,this.shader);let r=await t.colorBuffer.read(0,0,s,c,{renderTarget:t,immediate:!0}),p=r instanceof Uint8Array?r:new Uint8Array(r.buffer),m=[],h=32768;for(let e=0;e<p.length;e+=h)m.push(String.fromCharCode.apply(null,p.subarray(e,e+h)));return{width:s,height:c,data:btoa(m.join(``))}}finally{this.destroyed||(f.aspectRatioMode=p.aspectRatioMode,f.aspectRatio=p.aspectRatio,f.horizontalFov=p.horizontalFov,this.setCameraTarget(p.renderTarget),this.app.renderNextFrame=!0)}}},av=(e,t)=>({position:[e.camera.position.x,e.camera.position.y,e.camera.position.z],angles:[e.camera.angles.x,e.camera.angles.y,e.camera.angles.z],distance:e.camera.distance,fov:e.camera.fov,mode:t.cameraMode}),ov=(e,t,n)=>{e.camera.position.set(n.position[0],n.position[1],n.position[2]),e.camera.angles.set(n.angles[0],n.angles[1],n.angles[2]),e.camera.distance=n.distance,e.camera.fov=n.fov,t.cameraMode!==n.mode&&(t.cameraMode=n.mode),e.snap()},sv=0;for(let e=-2;e<=Cs;e++)for(let t=-2;t<=Cs;t++)t*t+e*e<=4&&sv++;var cv=Math.ceil(sv*Ss*ws),lv=Cs,uv=`
uniform highp sampler2D pickDepth;
uniform vec2 pickRange;
uniform float surfaceOpacity;
void main(void) {
    ivec2 size = textureSize(pickDepth, 0);
    ivec2 p = ivec2(gl_FragCoord.xy);
    float nearest[${cv}];
    for (int i = 0; i < ${cv}; i++) nearest[i] = 2.0;
    int n = 0;
    for (int dy = -${lv}; dy <= ${lv}; dy++) {
        for (int dx = -${lv}; dx <= ${lv}; dx++) {
            ivec2 q = p + ivec2(dx, dy);
            if (dx * dx + dy * dy > 4 || any(lessThan(q, ivec2(0))) || any(greaterThanEqual(q, size))) continue;
            vec4 trials = texelFetch(pickDepth, q, 0);
            for (int c = 0; c < ${Ss}; c++) {
                float v = trials[c];
                n++;
                if (v < nearest[${cv-1}]) {
                    int i = ${cv-1};
                    while (i > 0 && nearest[i - 1] > v) {
                        nearest[i] = nearest[i - 1];
                        i--;
                    }
                    nearest[i] = v;
                }
            }
        }
    }
    float depth = nearest[clamp(int(ceil(float(n) * surfaceOpacity)) - 1, 0, ${cv-1})];
    float z = depth < 1.0 ? pickRange.x + depth * (pickRange.y - pickRange.x) : 0.0;
    gl_FragColor = vec4(z, 0.0, 0.0, 1.0);
}
`,dv=`
var pickDepth: texture_2d<uff>;
uniform pickRange: vec2f;
uniform surfaceOpacity: f32;
@fragment fn fragmentMain(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;
    let size = vec2i(textureDimensions(pickDepth, 0));
    let p = vec2i(pcPosition.xy);
    var nearest: array<f32, ${cv}>;
    for (var i = 0; i < ${cv}; i++) {
        nearest[i] = 2.0;
    }
    var n = 0;
    for (var dy = -${lv}; dy <= ${lv}; dy++) {
        for (var dx = -${lv}; dx <= ${lv}; dx++) {
            let q = p + vec2i(dx, dy);
            if (dx * dx + dy * dy > 4 || any(q < vec2i(0)) || any(q >= size)) {
                continue;
            }
            let trials = textureLoad(pickDepth, q, 0);
            for (var c = 0; c < ${Ss}; c++) {
                let v = trials[c];
                n++;
                if (v < nearest[${cv-1}]) {
                    var i = ${cv-1};
                    loop {
                        if (i == 0 || nearest[i - 1] <= v) {
                            break;
                        }
                        nearest[i] = nearest[i - 1];
                        i--;
                    }
                    nearest[i] = v;
                }
            }
        }
    }
    let depth = nearest[clamp(i32(ceil(f32(n) * uniform.surfaceOpacity)) - 1, 0, ${cv-1})];
    let z = select(0.0, uniform.pickRange.x + depth * (uniform.pickRange.y - uniform.pickRange.x), depth < 1.0);
    output.color = vec4f(z, 0.0, 0.0, 1.0);
    return output;
}
`,fv=`
vec3 turbo(float x) {
    const vec4 r4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
    const vec4 g4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
    const vec4 b4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
    const vec2 r2 = vec2(-152.94239396, 59.28637943);
    const vec2 g2 = vec2(4.27729857, 2.82956604);
    const vec2 b2 = vec2(-89.90310912, 27.34824973);
    vec4 v4 = vec4(1.0, x, x * x, x * x * x);
    vec2 v2 = v4.zw * v4.z;
    return vec3(dot(v4, r4) + dot(v2, r2), dot(v4, g4) + dot(v2, g2), dot(v4, b4) + dot(v2, b2));
}
`,pv=`
fn turbo(x: f32) -> vec3f {
    let r4 = vec4f(0.13572138, 4.61539260, -42.66032258, 132.13108234);
    let g4 = vec4f(0.09140261, 2.19418839, 4.84296658, -14.18503333);
    let b4 = vec4f(0.10667330, 12.64194608, -60.58204836, 110.36276771);
    let r2 = vec2f(-152.94239396, 59.28637943);
    let g2 = vec2f(4.27729857, 2.82956604);
    let b2 = vec2f(-89.90310912, 27.34824973);
    let v4 = vec4f(1.0, x, x * x, x * x * x);
    let v2 = v4.zw * v4.z;
    return vec3f(dot(v4, r4) + dot(v2, r2), dot(v4, g4) + dot(v2, g2), dot(v4, b4) + dot(v2, b2));
}
`,mv=`
uniform highp sampler2D surfaceDepth;
uniform vec4 viewport_size;
${fv}
void main(void) {
    ivec2 size = textureSize(surfaceDepth, 0);
    float z = texelFetch(surfaceDepth, ivec2(gl_FragCoord.xy * vec2(size) * viewport_size.zw), 0).r;
    gl_FragColor = z > 0.0 ? vec4(turbo(fract(log2(z))), 1.0) : vec4(0.6, 0.0, 0.6, 1.0);
}
`,hv=`
var surfaceDepth: texture_2d<uff>;
uniform viewport_size: vec4f;
${pv}
@fragment fn fragmentMain(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;
    let size = vec2f(textureDimensions(surfaceDepth, 0));
    let z = textureLoad(surfaceDepth, vec2i(pcPosition.xy * size * uniform.viewport_size.zw), 0).r;
    output.color = select(vec4f(0.6, 0.0, 0.6, 1.0), vec4f(turbo(fract(log2(z))), 1.0), z > 0.0);
    return output;
}
`,gv=class{app;camera;picker;resolveShader;material=new v;quad;depthTarget=null;onFrameEnd=()=>this.resolve();onPrerender=()=>this.draw();resolvedRenders=-1;_enabled=!1;constructor(e,t,n){this.app=e,this.camera=t,this.picker=n,this.resolveShader=N.createShader(e.graphicsDevice,{uniqueName:`PickDepthResolve`,attributes:{vertex_position:U},vertexChunk:`fullscreenQuadVS`,fragmentGLSL:uv,fragmentWGSL:dv});let r=this.material;r.cull=0,r.blendType=3,r.depthTest=!1,r.depthWrite=!1,r.shaderDesc={uniqueName:`PickDepthColour`,vertexGLSL:`
                attribute vec2 vertex_position;
                uniform mat4 matrix_model;
                void main(void) {
                    gl_Position = matrix_model * vec4(vertex_position, 0, 1);
                }
            `,vertexWGSL:`
                attribute vertex_position: vec2f;
                uniform matrix_model: mat4x4f;
                @vertex fn vertexMain(input: VertexInput) -> VertexOutput {
                    var output: VertexOutput;
                    output.position = uniform.matrix_model * vec4f(input.vertex_position, 0.0, 1.0);
                    return output;
                }
            `,fragmentGLSL:mv,fragmentWGSL:hv,attributes:{vertex_position:U}},r.update();let i=new re(e.graphicsDevice);i.setPositions([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0]),i.update(5);let a=new pe(`PickDepthColour`);a.setLocalScale(2,-2,1),a.getWorldTransform(),this.quad=new z(i,r,a),this.quad.cull=!1,this.quad.castShadow=!1,this.quad.pick=!1,this.quad.visible=!1,e.scene.defaultDrawLayer.addMeshInstances([this.quad],!0)}get enabled(){return this._enabled}set enabled(e){e!==this._enabled&&(this._enabled=e,e?(this.app.on(`frameend`,this.onFrameEnd),this.app.on(`prerender`,this.onPrerender)):(this.app.off(`frameend`,this.onFrameEnd),this.app.off(`prerender`,this.onPrerender),this.resolvedRenders=-1,this.quad.visible=!1),this.app.renderNextFrame=!0)}ensureDepthTarget(e,t){let n=this.depthTarget;if(n&&n.width===e&&n.height===t)return n;n?.colorBuffer.destroy(),n?.destroy();let r=this.app.graphicsDevice,i=new H(r,{name:`pick-depth-resolved`,width:e,height:t,format:r.textureFloatRenderable?15:50,mipmaps:!1,minFilter:0,magFilter:0,addressU:1,addressV:1});return this.depthTarget=new Ze({name:`pick-depth-resolved`,colorBuffer:i,depth:!1}),this.depthTarget}resolve(){if(this.camera.camera.renderTarget)return;let e=this.picker.renderView();if(!e||e.renders===this.resolvedRenders)return;this.resolvedRenders=e.renders;let t=this.app.graphicsDevice,n=this.camera.camera,r=this.ensureDepthTarget(e.texture.width,e.texture.height);t.scope.resolve(`pickDepth`).setValue(e.texture),t.scope.resolve(`pickRange`).setValue([n.nearClip,n.farClip]),t.scope.resolve(`surfaceOpacity`).setValue(ws),t.setBlendState(Ae.NOBLEND),L(t,r,this.resolveShader),this.app.renderNextFrame=!0}draw(){this.quad.visible=!1,!this.depthTarget||this.resolvedRenders<0||this.camera.camera.renderTarget||(this.material.setParameter(`surfaceDepth`,this.depthTarget.colorBuffer),this.quad.visible=!0)}destroy(){this.enabled=!1,this.app.scene.defaultDrawLayer.removeMeshInstances([this.quad],!0),this.quad.destroy(),this.material.destroy(),this.resolveShader.destroy(),this.depthTarget?.colorBuffer.destroy(),this.depthTarget?.destroy(),this.depthTarget=null}},_v=`sse-debug-panel-style`,Q=`sse-debug-panel`,vv=20,yv=2,bv=8,xv=`
.${Q} {
    position: absolute;
    top: max(8px, env(safe-area-inset-top));
    left: max(8px, env(safe-area-inset-left));
    padding: 8px 10px;
    background: rgba(0, 0, 0, 0.7);
    color: #eee;
    font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    pointer-events: auto;
    user-select: none;
    /* a fixed width, wide enough for the longest labels, so the panel keeps its layout as
       values change and options are toggled */
    box-sizing: border-box;
    width: 56ch;
    max-width: calc(100% - 16px);
}
.${Q} .sse-debug-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
    min-height: ${vv}px;
    margin-top: ${yv}px;
}
.${Q} .sse-debug-label {
    color: #888;
}
.${Q} .sse-debug-row .sse-debug-value {
    color: #eee;
    font-variant-numeric: tabular-nums;
    cursor: text;
    padding: 0 4px;
    margin: 0 -4px;
    border-radius: 2px;
    transition: background-color 0.15s ease;
    outline: none;
    white-space: pre;
}
.${Q} .sse-debug-row .sse-debug-value:hover {
    background: rgba(255, 255, 255, 0.08);
}
.${Q} .sse-debug-row .sse-debug-value:focus {
    background: rgba(255, 255, 255, 0.12);
    box-shadow: inset 0 0 0 1px rgba(120, 180, 255, 0.45);
}
.${Q} .sse-debug-row .sse-debug-value.sse-flash-ok {
    background: rgba(120, 220, 140, 0.35);
}
.${Q} .sse-debug-row .sse-debug-value.sse-flash-bad {
    background: rgba(220, 100, 100, 0.45);
}
.${Q} button {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(255, 255, 255, 0.08);
    color: #eee;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 3px;
    box-sizing: border-box;
    height: ${vv}px;
    padding: 0 8px;
    font: inherit;
    cursor: pointer;
    transition: background-color 0.15s ease;
}
.${Q} button:hover {
    background: rgba(255, 255, 255, 0.16);
}
.${Q} button.sse-flash {
    background: rgba(120, 220, 140, 0.35);
}
.${Q} button.sse-flash-bad {
    background: rgba(220, 100, 100, 0.45);
}
.${Q} input.sse-debug-paste {
    width: 100%;
    box-sizing: border-box;
    height: ${vv}px;
    margin-top: ${yv}px;
    background: rgba(255, 255, 255, 0.08);
    color: #eee;
    border: 1px solid rgba(120, 180, 255, 0.6);
    border-radius: 3px;
    padding: 0 8px;
    font: inherit;
}
.${Q} button.sse-debug-on {
    background: rgba(120, 180, 255, 0.35);
}
/* the camera's rows beside the view buttons, stacked a row each */
.${Q} .sse-debug-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 13ch;
    column-gap: 12px;
}
.${Q} .sse-debug-stack {
    display: grid;
    row-gap: ${yv}px;
    align-content: start;
}
/* a row whose label has small actions at the right */
.${Q} .sse-debug-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: ${vv}px;
}
.${Q} .sse-debug-head .sse-debug-actions {
    display: flex;
    gap: 4px;
}
/* a group's label on the line of its controls, which line up at the right */
.${Q} .sse-debug-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    min-height: ${vv}px;
    margin-top: ${bv}px;
}
/* a control that does not apply to the renderer in use */
.${Q} button:disabled {
    opacity: 0.35;
    cursor: default;
}
.${Q} button:disabled:hover {
    background: rgba(255, 255, 255, 0.08);
}
.${Q} .sse-debug-off .sse-debug-label {
    color: #555;
}
/* the splat counts: a label row over a value row */
.${Q} .sse-debug-table {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: 8px;
    row-gap: ${yv}px;
    margin-top: ${bv}px;
}
.${Q} .sse-debug-table > span {
    display: flex;
    align-items: center;
    min-height: ${vv}px;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
}
/* a choice of one: the options joined, the chosen one lit */
.${Q} .sse-debug-segments {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 10ch;
}
.${Q} .sse-debug-segments button {
    border-radius: 0;
    margin-left: -1px;
}
.${Q} .sse-debug-segments button:first-child {
    border-radius: 3px 0 0 3px;
    margin-left: 0;
}
.${Q} .sse-debug-segments button:last-child {
    border-radius: 0 3px 3px 0;
}
`,Sv={sorted:`The engine's renderer: splats sorted by depth and blended`,pixel:`Stochastic, a coverage threshold per pixel (desktops)`,mobile:`Stochastic, interleaved pixel sets with jittered strata (phones, tablets)`,sol:`Stochastic, a solid ellipse per splat: the speed-of-light bound`},Cv=(e,t,n)=>{let r=new Map;for(let{value:i,label:a,title:o}of t){let t=document.createElement(`button`);t.textContent=a,o&&(t.title=o),t.addEventListener(`click`,()=>n(i)),e.appendChild(t),r.set(i,t)}return r},wv=e=>e===null?`—`:e>=1e6?`${(e/1e6).toFixed(2)}M`:e>=1e3?`${(e/1e3).toFixed(1)}K`:`${e}`,Tv=(e,t)=>{e?.forEach((e,n)=>e.classList.toggle(`sse-debug-on`,n===t))},Ev=e=>[e.x,e.y,e.z].map(e=>e.toFixed(3).padStart(8)).join(`,`),Dv=e=>{let t=e.trim().split(/[\s,]+/).filter(e=>e.length>0);if(t.length!==3)return null;let n=t.map(Number);return n.some(e=>!Number.isFinite(e))?null:[n[0],n[1],n[2]]},Ov=class{_global;_cameraManager;_picker;_splatRenderer;_stochasticSection=null;_splatRendererChanged;_modeButtons=null;_taaButtons=null;_cullButtons=null;_loadedValue=null;_selectedValue=null;_onScreenValue=null;_renderedValue=null;_countsFrames=0;_countsPending=!1;_pickDepthOverlay=null;_focusTmp=new W;_root=null;_style=null;_positionValue=null;_focusValue=null;_copyButton=null;_pasteButton=null;_pasteField=null;_miniStatsButton=null;_miniStats;_screenshotButton=null;_pickDepthButton=null;_editing=null;_editCanceled=!1;_visible=!1;_onPrerender=()=>this._render();_onFrameEnd=()=>this._renderCounts();_onKeyDown=e=>{this._global.state.inputEnabled&&e.code===`KeyD`&&e.shiftKey&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),this.toggle())};constructor(e,t,n,r=null,i=null){this._global=e,this._cameraManager=t,this._picker=n,this._splatRenderer=r,this._miniStats=i,this._splatRendererChanged=e.events.on(`splatRenderer:changed`,e=>{this._splatRenderer=e,this._renderStochastic()}),window.addEventListener(`keydown`,this._onKeyDown),e.config.debug&&this.show()}show(){this._visible||(this._visible=!0,this._root||this._build(),this._root.style.display=``,this._global.app.on(`prerender`,this._onPrerender),this._global.app.on(`frameend`,this._onFrameEnd),this._global.config.exposeGlobals&&(window.getCameraState=()=>av(this._cameraManager,this._global.state),window.setCameraState=e=>ov(this._cameraManager,this._global.state,e)),this._render())}hide(){this._visible&&(this._visible=!1,this._root&&(this._root.style.display=`none`),this._setPickDepth(!1),this._global.app.off(`prerender`,this._onPrerender),this._global.app.off(`frameend`,this._onFrameEnd),this._global.config.exposeGlobals&&(delete window.getCameraState,delete window.setCameraState))}toggle(){this._visible?this.hide():this.show()}destroy(){this.hide(),this._pickDepthOverlay?.destroy(),this._pickDepthOverlay=null,this._splatRendererChanged.off(),window.removeEventListener(`keydown`,this._onKeyDown),this._root&&=(this._root.remove(),null),this._style?.remove(),this._style=null}_build(){let e=this._global.root;if(!this._style){let t=document.createElement(`style`);t.id=_v,t.textContent=xv,e.appendChild(t),this._style=t}let t=document.createElement(`div`);t.className=Q,t.innerHTML=`
            <div class="sse-debug-top">
                <div>
                    <div class="sse-debug-head">
                        <span class="sse-debug-label">Camera</span>
                        <span class="sse-debug-actions">
                            <button data-id="copy" title="Copy the camera's state">Copy</button>
                            <button data-id="paste" title="Paste a copied camera state">Paste</button>
                        </span>
                    </div>
                    <div class="sse-debug-row"><span class="sse-debug-label">Position</span><span class="sse-debug-value" data-id="position" contenteditable="plaintext-only" spellcheck="false" title="Edit to set camera position">—</span></div>
                    <div class="sse-debug-row"><span class="sse-debug-label">Focus</span><span class="sse-debug-value" data-id="focus" contenteditable="plaintext-only" spellcheck="false" title="Edit to look at this point">—</span></div>
                </div>
                <div class="sse-debug-stack">
                    <button data-id="screenshot">Screenshot</button>
                    <button data-id="pick-depth" title="Show the depth a navigation pick finds at every pixel">Show depth</button>
                    <button data-id="ministats" title="Show the engine's MiniStats graphs (the viewer then renders every frame)">MiniStats</button>
                </div>
            </div>
            <input class="sse-debug-paste" data-id="paste-field" placeholder="Clipboard blocked here: paste with Ctrl/Cmd+V" spellcheck="false" style="display: none">
            <div data-id="renderer">
                <div class="sse-debug-line">
                    <span class="sse-debug-label">Renderer</span>
                    <div class="sse-debug-segments" data-id="mode"></div>
                </div>
                <div data-id="stochastic">
                    <div class="sse-debug-row"><span class="sse-debug-label">TAA</span><span class="sse-debug-segments" data-id="taa" title="Stochastic modes: accumulate the samples over frames (reprojected while the camera moves)"></span></div>
                    <div class="sse-debug-row"><span class="sse-debug-label">Depth cull</span><span class="sse-debug-segments" data-id="depth-cull" title="Stochastic modes: cull splats hidden in the previous frame's depth (auto suspends the test when it removes too little)"></span></div>
                </div>
            </div>
            <div class="sse-debug-table" title="Splats in the files loaded (in use or cooling down), selected by the level of detail and budget, in view after the frustum cull (and a stochastic mode's random coverage), and drawn after the depth cull, with the share it removed">
                <span class="sse-debug-label">Loaded</span>
                <span class="sse-debug-label">Splats</span>
                <span class="sse-debug-label">On screen</span>
                <span class="sse-debug-label">Rendered</span>
                <span data-id="loaded">—</span>
                <span data-id="selected">—</span>
                <span data-id="on-screen">—</span>
                <span data-id="rendered">—</span>
            </div>
        `,e.appendChild(t),this._root=t,this._positionValue=t.querySelector(`[data-id="position"]`),this._focusValue=t.querySelector(`[data-id="focus"]`),this._copyButton=t.querySelector(`[data-id="copy"]`),this._pasteButton=t.querySelector(`[data-id="paste"]`),this._screenshotButton=t.querySelector(`[data-id="screenshot"]`),this._pickDepthButton=t.querySelector(`[data-id="pick-depth"]`),this._miniStatsButton=t.querySelector(`[data-id="ministats"]`),this._pasteField=t.querySelector(`[data-id="paste-field"]`),this._wirePasteField(this._pasteField),this._miniStats?(this._miniStatsButton.addEventListener(`click`,()=>{this._miniStats.show(!this._miniStats.shown()),this._renderMiniStats()}),this._renderMiniStats()):this._miniStatsButton.remove(),this._copyButton.addEventListener(`click`,()=>this._copy()),this._pasteButton.addEventListener(`click`,()=>this._paste()),this._screenshotButton.addEventListener(`click`,()=>this._screenshot()),this._pickDepthButton.addEventListener(`click`,()=>{this._setPickDepth(!this._pickDepthOverlay?.enabled)}),this._stochasticSection=t.querySelector(`[data-id="stochastic"]`),this._loadedValue=t.querySelector(`[data-id="loaded"]`),this._selectedValue=t.querySelector(`[data-id="selected"]`),this._onScreenValue=t.querySelector(`[data-id="on-screen"]`),this._renderedValue=t.querySelector(`[data-id="rendered"]`);let{quality:n}=this._global;n.debugModes?this._buildRendererControls(t):(t.querySelector(`[data-id="renderer"]`).remove(),this._stochasticSection=null),this._renderStochastic(),this._wireEditable(this._positionValue,`position`),this._wireEditable(this._focusValue,`focus`)}_buildRendererControls(e){let{quality:t}=this._global;this._modeButtons=Cv(e.querySelector(`[data-id="mode"]`),Dl.map(e=>({value:e,label:e[0].toUpperCase()+e.slice(1),title:Sv[e]})),e=>t.setDebugMode(e));let n=e=>t=>{this._splatRenderer&&(e(this._splatRenderer,t),this._splatRenderer.applyVariant(),this._renderCull())};this._taaButtons=Cv(e.querySelector(`[data-id="taa"]`),[{value:`on`,label:`On`},{value:`off`,label:`Off`}],n((e,t)=>{e.variant.taa=t})),this._cullButtons=Cv(e.querySelector(`[data-id="depth-cull"]`),[{value:`auto`,label:`Auto`},{value:`on`,label:`On`},{value:`off`,label:`Off`}],n((e,t)=>{e.variant.cull=t===`on`?`l2`:t}))}_wireEditable(e,t){e.addEventListener(`focus`,()=>{this._editing=e,this._editCanceled=!1;let t=document.createRange();t.selectNodeContents(e);let n=window.getSelection();n?.removeAllRanges(),n?.addRange(t)});let n=e=>e.stopPropagation();e.addEventListener(`keydown`,t=>{n(t),t.key===`Enter`?(t.preventDefault(),e.blur()):t.key===`Escape`&&(t.preventDefault(),this._editCanceled=!0,e.blur())}),e.addEventListener(`keyup`,n),e.addEventListener(`keypress`,n),e.addEventListener(`blur`,()=>{let n=this._editCanceled;if(this._editing=null,this._editCanceled=!1,window.getSelection()?.removeAllRanges(),n){this._render();return}let r=Dv(e.textContent??``);r?(t===`position`?this._applyPosition(r):this._applyFocus(r),this._flashOk(e)):(this._flashBad(e),this._render())})}_setPickDepth(e){e&&!this._pickDepthOverlay&&(this._pickDepthOverlay=new gv(this._global.app,this._global.camera,this._picker)),this._pickDepthOverlay&&(this._pickDepthOverlay.enabled=e),this._pickDepthButton?.classList.toggle(`sse-debug-on`,e)}_applyPosition(e){this._cameraManager.camera.position.set(e[0],e[1],e[2]),this._cameraManager.snap()}_applyFocus(e){let t=this._cameraManager.camera,n=this._focusTmp.copy(t.position),r=new W(e[0],e[1],e[2]);t.look(n,r),this._cameraManager.snap()}_render(){if(!this._visible||!this._positionValue||!this._focusValue)return;let e=this._cameraManager.camera;e.calcFocusPoint(this._focusTmp),this._editing!==this._positionValue&&(this._positionValue.textContent=Ev(e.position)),this._editing!==this._focusValue&&(this._focusValue.textContent=Ev(this._focusTmp))}_renderStochastic(){if(!this._stochasticSection)return;Tv(this._modeButtons,this._global.quality.debugMode);let e=!!this._splatRenderer;this._stochasticSection.classList.toggle(`sse-debug-off`,!e);for(let t of[this._taaButtons,this._cullButtons])t?.forEach(t=>{t.disabled=!e});e||(Tv(this._taaButtons,null),Tv(this._cullButtons,null)),this._renderCull()}_renderCull(){let e=this._splatRenderer;if(!e)return;let t=e.variant.cull;Tv(this._cullButtons,t===`l1`||t===`l2`?`on`:t),Tv(this._taaButtons,e.variant.taa)}_renderCounts(){if(!this._loadedValue||!this._selectedValue||this._countsPending||this._countsFrames++%15!=0)return;let{app:e,camera:t}=this._global,n=e.root.findComponent(`gsplat`);this._loadedValue.textContent=wv(rc(n?.resource)),this._selectedValue.textContent=wv(e.stats.frame.gsplats);let r=this._splatRenderer,i=e.scene.layers.getLayerByName(`World`),a=r?r.readStats().then(({survivors:e,occluded:t})=>({onScreen:e+t,rendered:e,culled:r.culling?t:null})):t.camera&&i?ic(e,t.camera,i).then(e=>e===null?null:{onScreen:e,rendered:e,culled:null}):Promise.resolve(null);this._countsPending=!0,a.then(e=>{if(!this._onScreenValue||!this._renderedValue)return;this._onScreenValue.textContent=wv(e?.onScreen??null);let t=e&&e.culled!==null&&e.onScreen>0?`  −${(100*e.culled/e.onScreen).toFixed(0)}%`:``;this._renderedValue.textContent=`${wv(e?.rendered??null)}${t}`}).catch(()=>{}).finally(()=>{this._countsPending=!1})}async _copy(){let e=JSON.stringify(av(this._cameraManager,this._global.state)),t=!1;try{await navigator.clipboard.writeText(e),t=!0}catch{if(!this._root)return;let n=document.createElement(`textarea`);n.value=e,n.style.cssText=`position: fixed; opacity: 0; pointer-events: none`,this._root.appendChild(n),n.select();try{t=document.execCommand(`copy`)}catch{t=!1}n.remove()}t?this._flash(this._copyButton):(console.warn(`[debug-panel] copy failed`),this._flashBad(this._copyButton))}async _paste(){let e;try{e=await navigator.clipboard.readText()}catch{this._showPasteField(!0);return}this._root&&this._applyPasted(e)}_applyPasted(e){try{let t=JSON.parse(e);ov(this._cameraManager,this._global.state,t),this._flash(this._pasteButton)}catch(e){console.warn(`[debug-panel] paste failed`,e),this._flashBad(this._pasteButton)}}_showPasteField(e){let t=this._pasteField;t&&(t.value=``,t.style.display=e?``:`none`,e&&t.focus())}_wirePasteField(e){let t=e=>e.stopPropagation();e.addEventListener(`keydown`,n=>{if(t(n),n.key===`Enter`){n.preventDefault();let t=e.value;this._showPasteField(!1),this._applyPasted(t)}else n.key===`Escape`&&(n.preventDefault(),this._showPasteField(!1))}),e.addEventListener(`keyup`,t),e.addEventListener(`keypress`,t),e.addEventListener(`paste`,e=>{e.preventDefault();let t=e.clipboardData?.getData(`text/plain`)??``;this._showPasteField(!1),this._applyPasted(t)}),e.addEventListener(`blur`,()=>this._showPasteField(!1))}_renderMiniStats(){this._miniStats&&this._miniStatsButton&&this._miniStatsButton.classList.toggle(`sse-debug-on`,this._miniStats.shown())}_screenshot(){let e=this._global.app,t=e.graphicsDevice.canvas;e.renderNextFrame=!0,e.once(`frameend`,()=>{t.toBlob(e=>{if(!e){console.warn(`[debug-panel] screenshot toBlob returned null`);return}let t=e.type===`image/webp`?`webp`:`png`,n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=`supersplat-viewer.${t}`,r.click(),URL.revokeObjectURL(n),this._flash(this._screenshotButton)},`image/webp`,1)})}_flash(e){e&&(e.classList.add(`sse-flash`),setTimeout(()=>e.classList.remove(`sse-flash`),250))}_flashOk(e){e.classList.add(`sse-flash-ok`),setTimeout(()=>e.classList.remove(`sse-flash-ok`),250)}_flashBad(e){e.classList.add(`sse-flash-bad`),setTimeout(()=>e.classList.remove(`sse-flash-bad`),400)}},kv=class{limit;held=0;app;queue;gl;fences=[];pending=0;owed=!1;rendered=!1;destroyed=!1;handles;constructor(e,t){this.app=e,this.limit=t;let n=e.graphicsDevice;this.queue=n.wgpu?.queue??null,this.gl=this.queue?null:n.gl??null,this.handles=[e.on(`frameupdate`,()=>this.poll()),e.on(`postrender`,()=>{this.rendered=!0}),e.on(`frameend`,()=>this.frameEnd())]}request(){this.limit>0&&!this.app.autoRender&&this.pending>=this.limit?(this.owed||this.held++,this.owed=!0):this.app.renderNextFrame=!0}destroy(){this.destroyed=!0;for(let e of this.handles)e.off();let{gl:e}=this;if(e&&!e.isContextLost())for(let t of this.fences)e.deleteSync(t);this.fences.length=0}frameEnd(){if(this.rendered){if(this.rendered=!1,this.queue)this.pending++,this.queue.onSubmittedWorkDone().then(()=>this.finished(),()=>this.finished());else if(this.gl){let e=this.gl.fenceSync(this.gl.SYNC_GPU_COMMANDS_COMPLETE,0);e&&(this.fences.push(e),this.pending++)}}}poll(){let{gl:e,fences:t}=this;if(e&&t.length){if(e.isContextLost())t.length=0,this.pending=0,this.finished();else for(;t.length&&e.getSyncParameter(t[0],e.SYNC_STATUS)===e.SIGNALED;)e.deleteSync(t.shift()),this.finished()}}finished(){this.pending=Math.max(this.pending-1,0);let e=this.limit<=0||this.app.autoRender||this.pending<this.limit;this.owed&&e&&!this.destroyed&&(this.owed=!1,this.app.renderNextFrame=!0)}},Av=({root:e,state:t,events:n})=>{let r=!!(e.requestFullscreen&&document.exitFullscreen),i=!1,a=()=>{i||(t.isFullscreen=document.fullscreenElement===e)};r&&(document.addEventListener(`fullscreenchange`,a),a());let o=async()=>{r?(document.fullscreenElement===e&&await document.exitFullscreen(),a()):t.isFullscreen&&=(window.parent.postMessage(`exitFullscreen`,`*`),!1)},s=async()=>{if(r)await e.requestFullscreen(),i?await o():a();else if(window.parent!==window)window.parent.postMessage(`requestFullscreen`,`*`),t.isFullscreen=!0;else throw Error(`requestFullscreen: fullscreen is not supported`)},c=n.on(`inputEvent`,e=>{e===`cancel`&&o().catch(()=>{})});return{request:s,exit:o,destroy:()=>{i=!0,document.removeEventListener(`fullscreenchange`,a),c.off(),o().catch(()=>{}),t.isFullscreen=!1}}},jv=class{_global=null;_onPointer=e=>{this._global&&(this._global.state.inputMode=e.pointerType===`touch`?`touch`:`desktop`)};attach(e){this._global=e,e.root.addEventListener(`pointerdown`,this._onPointer),e.root.addEventListener(`pointermove`,this._onPointer)}detach(){this._global?.root.removeEventListener(`pointerdown`,this._onPointer),this._global?.root.removeEventListener(`pointermove`,this._onPointer),this._global=null}},Mv=e=>e===`walk`||e===`fly`,Nv=e=>e.code===`KeyW`||e.code===`KeyA`||e.code===`KeyS`||e.code===`KeyD`,Pv=e=>{if(/^[\x20-\x7e]$/.test(e.key))return e.key;let t=/^(?:Key([A-Z])|Digit(\d))$/.exec(e.code);return t?t[1]?.toLowerCase()??t[2]:e.key},Fv=class{_global=null;_pointerLock=null;_onKeyDown=e=>{let t=this._global;if(!t)return;let{state:n,events:r}=t;if(!n.inputEnabled)return;if(e.key===`Escape`){this._pointerLock?.recentlyExitedCapture||(Mv(n.cameraMode)&&n.gamingControls&&n.inputMode===`desktop`?n.gamingControls=!1:n.cameraMode===`walk`?r.fire(`inputEvent`,`exitWalk`,e):r.fire(`inputEvent`,`cancel`,e));return}if(e.ctrlKey||e.altKey||e.metaKey)return;let i=Pv(e);switch(i){case`1`:n.cameraMode=`orbit`;break;case`2`:n.cameraMode=`fly`;break;case`3`:r.fire(`inputEvent`,`toggleWalk`);break;case`v`:n.hasCollisionOverlay&&(n.collisionOverlayEnabled=!n.collisionOverlayEnabled);break;case`g`:n.gamingControls=!n.gamingControls;break;case`h`:case`H`:r.fire(`inputEvent`,e.shiftKey?`toggleHelp`:`toggleControls`);break;case`r`:r.fire(`inputEvent`,`reset`,e);break;default:Nv(e)&&n.inputMode===`desktop`&&(Mv(n.cameraMode)||r.fire(`inputEvent`,`requestFirstPerson`),n.gamingControls||=!0)}if(n.cameraMode!==`walk`)switch(i){case`f`:r.fire(`inputEvent`,`frame`,e);break;case` `:r.fire(`inputEvent`,`playPause`,e)}};attach(e,t){this._global=e,this._pointerLock=t,window.addEventListener(`keydown`,this._onKeyDown)}detach(){window.removeEventListener(`keydown`,this._onKeyDown),this._global=null,this._pointerLock=null}},Iv=new W,Lv=e=>e.state.cameraMode===`fly`&&!(e.state.inputMode===`desktop`&&e.state.gamingControls),Rv=(e,t)=>{if(!e)return 1;if(t===`walk`){if(e.shiftKey)return 2;if(e.ctrlKey)return .5}else if(t===`fly`){if(e.shiftKey)return 4;if(e.ctrlKey)return .25}return 1},zv=class{collision=null;_picker;_global=null;_canvas=null;_lastPointerOffsetX=0;_lastPointerOffsetY=0;_mouseClickTracking=!1;_mouseClickDelta=0;_suppressClick=!1;_targetPickRequest=0;_lastTap={time:0,x:0,y:0};constructor(e){this._picker=e}_updateCursor=()=>{let e=this._global,t=this._canvas;if(!e||!t)return;let{state:n}=e;n.inputMode===`desktop`&&(n.cameraMode===`walk`&&!n.gamingControls||Lv(e)||n.cameraMode===`orbit`)?t.style.cursor=this._mouseClickTracking?`default`:`pointer`:t.style.cursor=``};_onCameraModeChanged=()=>{this._targetPickRequest++,this._updateCursor()};_pickCollision(e,t){if(!this.collision||!this._global)return null;let n=this._global.camera,r=n.getPosition();n.camera.screenToWorld(e,t,1,Iv),Iv.sub(r).normalize();let i=this.collision.queryRay(r.x,r.y,r.z,Iv.x,Iv.y,Iv.z,n.camera.farClip,!0);if(!i)return null;i.exit&&Iv.mulScalar(-1);let a=this.collision.querySurfaceNormal(i.x,i.y,i.z,Iv.x,Iv.y,Iv.z);return{position:new W(i.x,i.y,i.z),normal:new W(a.nx,a.ny,a.nz)}}async _pickSceneTarget(e,t){let n=this._global,r=this._canvas;return!n||!r?null:this._pickCollision(e,t)||await this._picker.pickSurface(e/r.clientWidth,t/r.clientHeight)||null}async _flyToPickedPosition(e,t,n){let r=this._global;if(!r||!Lv(r))return;let i=++this._targetPickRequest,a=await this._pickSceneTarget(e,t);if(a&&i===this._targetPickRequest&&this._global&&Lv(this._global)){let e=Rv(n,this._global.state.cameraMode);this._global.events.fire(`navigateTo`,a.position,a.normal,e)}}async _focusPickedPosition(e,t){let n=this._global;if(!n||n.state.cameraMode!==`orbit`)return;let r=++this._targetPickRequest,i=await this._pickSceneTarget(e,t);if(i&&r===this._targetPickRequest&&this._global?.state.cameraMode===`orbit`){let{events:e}=this._global;e.fire(`orbitTarget:set`,i.position,i.normal),e.fire(`pick`,i.position)}}_onPointerDown=e=>{let t=this._global;if(!t)return;let{events:n}=t;this._lastPointerOffsetX=e.offsetX,this._lastPointerOffsetY=e.offsetY,e.pointerType!==`touch`&&e.button===0&&(this._mouseClickTracking=!0,this._mouseClickDelta=0,this._updateCursor());let r=Date.now();Math.max(0,r-this._lastTap.time)<300&&Math.abs(e.clientX-this._lastTap.x)<8&&Math.abs(e.clientY-this._lastTap.y)<8?(this._suppressClick=!0,n.fire(`inputEvent`,`dblclick`,e),this._lastTap.time=0):(this._lastTap.time=r,this._lastTap.x=e.clientX,this._lastTap.y=e.clientY)};_onPointerMove=e=>{let t=this._global;if(!t)return;let{state:n,events:r}=t;if(this._mouseClickTracking&&e.pointerType!==`touch`){let i=this._mouseClickDelta;this._mouseClickDelta+=Math.abs(e.movementX)+Math.abs(e.movementY),i<au&&this._mouseClickDelta>=au&&(n.cameraMode===`walk`&&!n.gamingControls||Lv(t))&&r.fire(`navigateCancel`)}};_onPointerUp=e=>{let t=this._global;if(!t)return;let{state:n,events:r}=t;if(this._mouseClickTracking&&e.pointerType!==`touch`&&e.button===0){if(this._mouseClickTracking=!1,this._updateCursor(),this._suppressClick){this._suppressClick=!1;return}if(this._mouseClickDelta<au){if(n.cameraMode===`walk`&&!n.gamingControls){let t=this._pickCollision(this._lastPointerOffsetX,this._lastPointerOffsetY);if(t){let i=Rv(e,n.cameraMode);r.fire(`navigateTo`,t.position,t.normal,i)}}else n.cameraMode===`fly`?this._flyToPickedPosition(this._lastPointerOffsetX,this._lastPointerOffsetY,e):n.cameraMode===`orbit`&&this._focusPickedPosition(this._lastPointerOffsetX,this._lastPointerOffsetY)}}};_onInputEvent=async(e,t)=>{let n=this._global,r=this._canvas;if(!n||!r||e!==`dblclick`||!(t instanceof MouseEvent))return;let{events:i,state:a}=n;if((a.cameraMode===`walk`||a.cameraMode===`fly`)&&a.gamingControls)return;let o=++this._targetPickRequest,s=await this._pickSceneTarget(t.offsetX,t.offsetY);if(!s||o!==this._targetPickRequest)return;let c=this._global?.state;c&&(c.cameraMode===`walk`?c.gamingControls||i.fire(`navigateTo`,s.position,s.normal,2):(i.fire(`pick`,s.position),i.fire(`orbitTarget:set`,s.position,s.normal)))};_onMobileTap=()=>{let e=this._global;if(!e)return;let{state:t,events:n}=e;if(this._suppressClick)this._suppressClick=!1;else if(t.cameraMode===`walk`&&!t.gamingControls){let e=this._pickCollision(this._lastPointerOffsetX,this._lastPointerOffsetY);e&&n.fire(`navigateTo`,e.position,e.normal)}else t.cameraMode===`fly`?this._flyToPickedPosition(this._lastPointerOffsetX,this._lastPointerOffsetY):t.cameraMode===`orbit`&&this._focusPickedPosition(this._lastPointerOffsetX,this._lastPointerOffsetY)};attach(e,t){this._canvas=e,this._global=t;let{events:n}=t;e.addEventListener(`pointerdown`,this._onPointerDown),e.addEventListener(`pointermove`,this._onPointerMove),e.addEventListener(`pointerup`,this._onPointerUp),n.on(`inputEvent`,this._onInputEvent),n.on(`mobileTap`,this._onMobileTap),n.on(`cameraMode:changed`,this._onCameraModeChanged),n.on(`inputMode:changed`,this._updateCursor),n.on(`gamingControls:changed`,this._updateCursor)}detach(){if(this._canvas&&(this._canvas.removeEventListener(`pointerdown`,this._onPointerDown),this._canvas.removeEventListener(`pointermove`,this._onPointerMove),this._canvas.removeEventListener(`pointerup`,this._onPointerUp)),this._global){let{events:e}=this._global;e.off(`inputEvent`,this._onInputEvent),e.off(`mobileTap`,this._onMobileTap),e.off(`cameraMode:changed`,this._onCameraModeChanged),e.off(`inputMode:changed`,this._updateCursor),e.off(`gamingControls:changed`,this._updateCursor)}this._canvas=null,this._global=null}},Bv=e=>e===`walk`||e===`fly`,Vv=()=>navigator.userActivation?.isActive===!0,Hv=class{_global=null;_canvas=null;_keyboardMouse=null;_recentlyExitedCapture=!1;_onPointerLockChange=()=>{let e=this._global;if(!e)return;let{state:t,events:n}=e;!document.pointerLockElement&&Bv(t.cameraMode)&&t.gamingControls&&(this._recentlyExitedCapture=!0,requestAnimationFrame(()=>{this._recentlyExitedCapture=!1}),t.inputMode===`desktop`?t.gamingControls=!1:t.cameraMode===`walk`&&n.fire(`inputEvent`,`exitWalk`))};_onPointerLockError=()=>{this._keyboardMouse&&(this._keyboardMouse.source._pointerLock=!1);let e=this._global;if(!e)return;let{state:t,events:n}=e;t.inputMode===`desktop`&&Bv(t.cameraMode)?t.gamingControls=!1:t.cameraMode===`walk`&&n.fire(`inputEvent`,`exitWalk`)};_onCameraModeChanged=(e,t)=>{let n=this._global?.state;n&&(Bv(e)&&n.inputMode===`desktop`&&n.gamingControls?this._activate():Bv(t)&&this._deactivate())};_onGamingControlsChanged=e=>{let t=this._global?.state;t&&Bv(t.cameraMode)&&t.inputMode===`desktop`&&(e?this._activate():this._deactivate())};_onInputModeChanged=e=>{let t=this._global?.state;t&&Bv(t.cameraMode)&&t.gamingControls&&(e===`desktop`&&Vv()?this._activate():e!==`desktop`&&this._deactivate())};_onPointerDown=()=>{let e=this._global?.state;e&&e.inputMode===`desktop`&&Bv(e.cameraMode)&&e.gamingControls&&this._activate()};_activate(){this._keyboardMouse&&(this._keyboardMouse.source._pointerLock=!0),document.pointerLockElement!==this._canvas&&this._canvas?.requestPointerLock()}_deactivate(){this._keyboardMouse&&(this._keyboardMouse.source._pointerLock=!1),document.pointerLockElement===this._canvas&&document.exitPointerLock()}get recentlyExitedCapture(){return this._recentlyExitedCapture}attach(e,t,n){this._canvas=e,this._global=t,this._keyboardMouse=n;let{events:r}=t;r.on(`cameraMode:changed`,this._onCameraModeChanged),r.on(`gamingControls:changed`,this._onGamingControlsChanged),r.on(`inputMode:changed`,this._onInputModeChanged),e.addEventListener(`pointerdown`,this._onPointerDown),document.addEventListener(`pointerlockchange`,this._onPointerLockChange),document.addEventListener(`pointerlockerror`,this._onPointerLockError)}detach(){if(this._global){let{events:e}=this._global;e.off(`cameraMode:changed`,this._onCameraModeChanged),e.off(`gamingControls:changed`,this._onGamingControlsChanged),e.off(`inputMode:changed`,this._onInputModeChanged)}this._canvas?.removeEventListener(`pointerdown`,this._onPointerDown),document.removeEventListener(`pointerlockchange`,this._onPointerLockChange),document.removeEventListener(`pointerlockerror`,this._onPointerLockError),this._canvas=null,this._global=null,this._keyboardMouse=null}},Uv=new W,Wv=new W,Gv=new W,Kv=class{moveSpeed=4;orbitSpeed=18;gamepadRotateSensitivity=1;_source=new wa;_global=null;attach(e,t){this._global=t}detach(){this._global=null}update(e,t){if(!this._global?.state.inputEnabled)return;let{dt:n,cameraComponent:r,isFly:i,isFirstPerson:a}=e,{leftStick:o,rightStick:s}=this._source.read(),c=a?r.fov/120:1,{deltas:l}=t;i&&(o[0]!==0||o[1]!==0||s[0]!==0||s[1]!==0)&&this._global?.events.fire(`navigateCancel`);let u=Uv.set(0,0,0);Wv.set(o[0],0,-o[1]),u.add(Wv.mulScalar(this.moveSpeed*n)),l.move.append([u.x,u.y,u.z]),u.set(0,0,0),Gv.set(s[0],s[1],0),u.add(Gv.mulScalar(this.orbitSpeed*c*this.gamepadRotateSensitivity*n)),l.rotate.append([u.x,u.y,u.z])}},qv=new W,Jv=new W,Yv=new W,Xv=new W,Zv=new W,Qv=new W,$v=new W,ey=(e,t)=>{let n=e._onKeyDown;e._onKeyDown=r=>{t()&&(r.key===`Meta`?e._keyNow.fill(0):r.metaKey||n(r))};let r=e._onKeyUp;e._onKeyUp=t=>{t.key===`Meta`?e._keyNow.fill(0):t.metaKey||r(t)}},ty=class{moveSpeed=4;orbitSpeed=18;wheelSpeed=.06;mouseRotateSensitivity=.5;flyMoveAccelerationDamping=.992;flyMoveDecelerationDamping=.993;_source=new xa;_global=null;_axis=new W;_buttons=[0,0,0];_shift=0;_ctrl=0;_jump=0;_flyKeyVelocity=new W;_onInputEnabled=e=>{e||this._source._keyNow.fill(0)};get source(){return this._source}attach(e,t){this._global=t,ey(this._source,()=>t.state.inputEnabled),this._source.attach(e),t.events.on(`inputEnabled:changed`,this._onInputEnabled)}detach(){this._global?.events.off(`inputEnabled:changed`,this._onInputEnabled),this._source.detach(),this._global=null}update(e,t){let{keyCode:n}=xa,{key:r,button:i,mouse:a,wheel:o}=this._source.read(),{events:s}=this._global;this._axis.add(qv.set(r[n.D]-r[n.A]+(r[n.RIGHT]-r[n.LEFT]),r[n.E]-r[n.Q],r[n.W]-r[n.S]+(r[n.UP]-r[n.DOWN]))),this._jump+=r[n.SPACE],this._shift+=r[n.SHIFT],this._ctrl+=r[n.CTRL];let c=Math.min(i.length,this._buttons.length);for(let e=0;e<c;e++)this._buttons[e]+=i[e];let{isFly:l,isWalk:u,isFirstPerson:d,gamingControls:f,dt:p,distance:m,cameraComponent:h,mode:g,touchCount:_}=e,v=this._buttons[2]||+(i[2]===-1)||+(_>1);u&&(this._axis.x!==0||this._axis.z!==0)&&s.fire(`navigateCancel`),l&&(this._axis.x!==0||this._axis.y!==0||this._axis.z!==0)&&s.fire(`navigateCancel`),l&&o[0]!==0&&s.fire(`navigateCancel`),l&&(f||v)&&(a[0]!==0||a[1]!==0)&&s.fire(`navigateCancel`),!d&&this._axis.length()>0&&s.fire(`inputEvent`,`requestFirstPerson`);let y=d?h.fov/120:1,{deltas:b}=t,x=qv.set(0,0,0);Yv.copy(this._axis),u&&(Yv.y=0),Yv.normalize();let S=u?2:4,C=u?.5:.25,w=this.moveSpeed*(this._shift?S:this._ctrl?C:1);if(Yv.mulScalar(w),l){Xv.copy(Yv);let e=Xv.lengthSq()>this._flyKeyVelocity.lengthSq()?this.flyMoveAccelerationDamping:this.flyMoveDecelerationDamping;this._flyKeyVelocity.lerp(this._flyKeyVelocity,Xv,Zh(e,p)),Xv.lengthSq()===0&&this._flyKeyVelocity.lengthSq()<1e-4&&this._flyKeyVelocity.set(0,0,0),Yv.copy(this._flyKeyVelocity)}else this._flyKeyVelocity.set(0,0,0);x.add(Jv.copy(Yv).mulScalar(+!!d*p)),u&&(x.y=+(this._jump>0)),su(h,a[0],a[1],m,Zv),x.add(Zv.mulScalar(v)),$v.set(0,0,-o[0]),x.add($v.mulScalar(this.wheelSpeed*iu)),b.move.append([x.x,x.y,cu(g,x.z)]),x.set(0,0,0),Qv.set(a[0],a[1],0),x.add(Qv.mulScalar((1-v)*this.orbitSpeed*y*this.mouseRotateSensitivity*iu)),b.rotate.append([x.x,x.y,x.z])}},ny=new W,ry=new W,iy=new W,ay=new W,oy=new W,sy=class{orbitSpeed=18;pinchSpeed=.4;touchRotateSensitivity=1.5;_source=new ga;_global=null;_touchCount=0;_tapTouches=0;_tapMaxTouches=0;_tapDelta=0;_tapJump=!1;get touchCount(){return this._touchCount}attach(e,t){this._global=t,this._source.attach(e)}detach(){this._source.detach(),this._global=null}update(e,t){let{touch:n,pinch:r,count:i}=this._source.read(),{isFly:a,isWalk:o,isFirstPerson:s,isOrbit:c,gamingControls:l,distance:u,cameraComponent:d}=e;if(this._touchCount+=i[0],o||a||c){let e=this._tapTouches;if(this._tapTouches=Math.max(0,this._tapTouches+i[0]),e===0&&this._tapTouches>0&&(this._tapDelta=0),this._tapTouches>0&&(this._tapMaxTouches=Math.max(this._tapMaxTouches,this._tapTouches)),this._tapTouches>0){let e=this._tapDelta;this._tapDelta+=Math.abs(n[0])+Math.abs(n[1])+Math.abs(r[0]),e<au&&this._tapDelta>=au&&(o&&!l||a)&&this._global.events.fire(`navigateCancel`)}e>0&&this._tapTouches===0&&(this._tapDelta<au&&this._tapMaxTouches===1&&(o&&!l?this._global.events.fire(`mobileTap`):o?this._tapJump=!0:(a&&!l||c)&&this._global.events.fire(`mobileTap`)),this._tapMaxTouches=0)}else this._tapTouches=0,this._tapMaxTouches=0;let f=+!!c,p=+!!s,m=+(this._touchCount>1),h=s?d.fov/120:1,g=s&&!l?-1:1,_=p*+!l,{deltas:v}=t,y=ny.set(0,0,0);su(d,n[0],n[1],u,ry),o&&(ry.y=0),y.add(ry.mulScalar((f+_)*m)),iy.set(0,0,(f-_)*r[0]),y.add(iy.mulScalar(m*this.pinchSpeed*iu)),o&&this._tapJump&&(y.y=1,this._tapJump=!1),v.move.append([y.x,y.y,y.z]),y.set(0,0,0),ay.set(n[0],n[1],0),y.add(ay.mulScalar(f*(1-m)*this.orbitSpeed*this.touchRotateSensitivity*iu)),oy.set(n[0]*g,n[1]*g,0),y.add(oy.mulScalar(p*(1-m)*this.orbitSpeed*h*this.touchRotateSensitivity*iu)),v.rotate.append([y.x,y.y,y.z])}},cy=new W,ly=class{orbitSpeed=18;wheelSpeed=.06;trackpadOrbitSensitivity=.75;trackpadPanSensitivity=1;trackpadZoomSensitivity=2;_global=null;_orbit=[0,0];_pan=[0,0];_zoom=0;_ctrlDown=!1;_onKeyDown=e=>{e.key===`Control`&&this._global?.state.inputEnabled&&(this._ctrlDown=!0)};_onKeyUp=e=>{e.key===`Control`&&(this._ctrlDown=!1)};_onBlur=()=>{this._ctrlDown=!1};_onWheel=e=>{let t=this._global.state.cameraMode,n=e.ctrlKey&&!this._ctrlDown,r=e.ctrlKey&&this._ctrlDown,i=e.shiftKey;if(!n&&!r&&!i)return;e.preventDefault(),e.stopImmediatePropagation(),this._global.events.fire(`inputEvent`,`interrupt`,e),t===`fly`&&this._global.events.fire(`navigateCancel`);let{deltaX:a,deltaY:o}=e;n?this._zoom+=o:r?(this._orbit[0]+=a,this._orbit[1]+=o):(this._pan[0]+=a,this._pan[1]+=o)};_canvas=null;attach(e,t){this._canvas=e,this._global=t,e.addEventListener(`wheel`,this._onWheel,{passive:!1}),window.addEventListener(`keydown`,this._onKeyDown),window.addEventListener(`keyup`,this._onKeyUp),window.addEventListener(`blur`,this._onBlur)}detach(){this._canvas&&=(this._canvas.removeEventListener(`wheel`,this._onWheel),null),window.removeEventListener(`keydown`,this._onKeyDown),window.removeEventListener(`keyup`,this._onKeyUp),window.removeEventListener(`blur`,this._onBlur),this._global=null,this._ctrlDown=!1,this._orbit[0]=this._orbit[1]=0,this._pan[0]=this._pan[1]=0,this._zoom=0}update(e,t){let{isOrbit:n,isFirstPerson:r,distance:i,cameraComponent:a}=e,o=r?a.fov/120:1,{deltas:s}=t;if(n){let e=cy.set(this._orbit[0],this._orbit[1],0);e.mulScalar(this.orbitSpeed*this.trackpadOrbitSensitivity*iu),s.rotate.append([e.x,e.y,0]),su(a,this._pan[0],this._pan[1],i,cy),cy.mulScalar(this.trackpadPanSensitivity),s.move.append([cy.x,cy.y,0]);let t=this._zoom*this.wheelSpeed*this.trackpadZoomSensitivity*iu;s.move.append([0,0,t])}else if(r){let e=cy.set(this._orbit[0],this._orbit[1],0);e.mulScalar(this.orbitSpeed*o*this.trackpadOrbitSensitivity*iu),s.rotate.append([e.x,e.y,0]),su(a,this._pan[0],this._pan[1],i,cy),cy.mulScalar(this.trackpadPanSensitivity),s.move.append([cy.x,cy.y,0]);let t=-this._zoom*this.wheelSpeed*this.trackpadZoomSensitivity*iu;s.move.append([0,0,t])}this._orbit[0]=this._orbit[1]=0,this._pan[0]=this._pan[1]=0,this._zoom=0}},uy=class{moveSpeed=4;frame=new la({move:[0,0,0],rotate:[0,0,0]});_global;_trackpad=new ly;_keyboardMouse=new ty;_touch=new sy;_gamepad=new Kv;_navInteraction;_pointerLock=new Hv;_modeShortcuts=new Fv;_inputModeTracker=new jv;_canvas;_canvasListeners=[];_moveInput=[0,0];_clearMoveInput=()=>this._moveInput.fill(0);setMoveInput(e,t){let{state:n}=this._global;(n.cameraMode===`fly`||n.cameraMode===`walk`)&&n.xrMode===null&&(this._moveInput[0]=e,this._moveInput[1]=t)}set collision(e){this._navInteraction.collision=e}get collision(){return this._navInteraction.collision}constructor(e,t){this._global=e,this._navInteraction=new zv(t);let{app:n,events:r}=e,i=n.graphicsDevice.canvas;this._canvas=i,this._trackpad.attach(i,e),this._keyboardMouse.attach(i,e),this._touch.attach(i,e),this._gamepad.attach(i,e),this._navInteraction.attach(i,e),this._pointerLock.attach(i,e,this._keyboardMouse),this._modeShortcuts.attach(e,this._pointerLock),this._inputModeTracker.attach(e),r.on(`cameraMode:changed`,this._clearMoveInput),r.on(`xrMode:changed`,this._clearMoveInput),window.addEventListener(`blur`,this._clearMoveInput),document.addEventListener(`visibilitychange`,this._clearMoveInput);let a=(e,t)=>{i.addEventListener(e,t),this._canvasListeners.push([e,t])};[`wheel`,`pointerdown`,`contextmenu`,`keydown`].forEach(e=>{a(e,e=>{r.fire(`inputEvent`,`interrupt`,e)})}),a(`pointermove`,e=>{r.fire(`inputEvent`,`interact`,e)})}destroy(){this._clearMoveInput(),this._global.events.off(`cameraMode:changed`,this._clearMoveInput),this._global.events.off(`xrMode:changed`,this._clearMoveInput),window.removeEventListener(`blur`,this._clearMoveInput),document.removeEventListener(`visibilitychange`,this._clearMoveInput);for(let[e,t]of this._canvasListeners)this._canvas.removeEventListener(e,t);this._canvasListeners.length=0,this._inputModeTracker.detach(),this._modeShortcuts.detach(),this._pointerLock.detach(),this._navInteraction.detach(),this._gamepad.detach(),this._touch.detach(),this._keyboardMouse.detach(),this._trackpad.detach()}update(e,t){let{state:n}=this._global,r=this._global.camera.camera,i=n.cameraMode===`orbit`,a=n.cameraMode===`fly`,o=n.cameraMode===`walk`,s=a||o,c={dt:e,distance:t,cameraComponent:r,mode:n.cameraMode,isOrbit:i,isFly:a,isWalk:o,isFirstPerson:s,gamingControls:n.gamingControls,touchCount:this._touch.touchCount};if(this._touch.update(c,this.frame),c.touchCount=this._touch.touchCount,this._keyboardMouse.update(c,this.frame),this._trackpad.update(c,this.frame),this._gamepad.update(c,this.frame),s&&(this._moveInput[0]!==0||this._moveInput[1]!==0)){this._global.events.fire(`navigateCancel`);let t=this.moveSpeed*e;this.frame.deltas.move.append([this._moveInput[0]*t,0,this._moveInput[1]*t])}}},dy=.85,fy=.55,py=.3,my=.3,hy=(e,t,n)=>{let r=e=>Math.round((t?e:e**2.2)*255),i=r(dy),a=r(fy),o=r(py),s=Math.round(my*255),c=e.count,l=n??new Uint8Array(c*12);for(let t=0;t<c;t++){let n=Math.abs(e.nx[t]),r=Math.abs(e.ny[t]),c=Math.abs(e.nz[t]),u;u=n>r&&n>c?i:r>c?a:o;let d=t*12;for(let e=0;e<3;e++){let t=d+e*4;l[t]=u,l[t+1]=u,l[t+2]=u,l[t+3]=s}}return l},gy=(e,t)=>{let n=e.count,r=new Float32Array(n*9),i=hy(e,t),a=new Uint32Array(n*3);for(let t=0;t<n;t++){let n=t*9;r[n]=e.v0x[t],r[n+1]=e.v0y[t],r[n+2]=e.v0z[t],r[n+3]=e.v1x[t],r[n+4]=e.v1y[t],r[n+5]=e.v1z[t],r[n+6]=e.v2x[t],r[n+7]=e.v2y[t],r[n+8]=e.v2z[t];let i=t*3;a[i]=i,a[i+1]=i+1,a[i+2]=i+2}return{flatPositions:r,flatColors:i,flatIndices:a}},_y=()=>{let e=new S;return e.useLighting=!1,e.useSkybox=!1,e.useFog=!1,e.useTonemap=!1,e.ambient=new G(0,0,0),e.diffuse=new G(0,0,0),e.specular=new G(0,0,0),e.emissive=new G(1,1,1),e.emissiveVertexColor=!0,e.emissiveVertexColorChannel=`rgb`,e.opacityVertexColor=!0,e.opacityVertexColorChannel=`a`,e.opacity=1,e},vy=class{app;camera;layer;entity;mesh;triangles;flatColors;materials;_enabled=!1;constructor(e,t,n,r){this.app=e,this.camera=n,this.triangles=t.triangles;let i=e.graphicsDevice,{flatPositions:a,flatColors:o,flatIndices:s}=gy(this.triangles,r);this.flatColors=o;let c=new re(i);c.setPositions(a),c.setColors32(o),c.setIndices(s),c.update(4),c.generateWireframe(),this.mesh=c,this.layer=new Ve({name:`CollisionOverlay`,enabled:!1,clearColorBuffer:!1,clearDepthBuffer:!0,opaqueSortMode:1,transparentSortMode:1}),e.scene.layers.push(this.layer),n.camera.layers=[...n.camera.layers,this.layer.id];let l=_y();l.cull=1,l.blendType=2,l.depthTest=!0,l.depthWrite=!0,l.depthBias=1,l.slopeDepthBias=1,l.redWrite=!1,l.greenWrite=!1,l.blueWrite=!1,l.alphaWrite=!1,l.update();let u=new z(c,l);u.drawOrder=0;let d=new He(`CollisionDepthPrepass`,this.app);d.addComponent(`render`,{meshInstances:[u],layers:[this.layer.id]});let f=_y();f.cull=1,f.blendType=2,f.depthTest=!0,f.depthFunc=2,f.depthWrite=!1,f.depthBias=1,f.slopeDepthBias=1,f.update();let p=new z(c,f);p.drawOrder=1;let m=new He(`CollisionSurface`,this.app);m.addComponent(`render`,{meshInstances:[p],layers:[this.layer.id]});let h=new S;h.useLighting=!1,h.useSkybox=!1,h.useFog=!1,h.useTonemap=!1,h.ambient=new G(0,0,0),h.diffuse=new G(0,0,0),h.specular=new G(0,0,0),h.emissive=new G(0,0,0),h.opacity=1,h.blendType=2,h.depthTest=!0,h.depthFunc=3,h.depthWrite=!1,h.cull=0,h.update();let g=new z(c,h);g.drawOrder=2;let _=new He(`CollisionWireframe`,this.app);_.addComponent(`render`,{meshInstances:[g],layers:[this.layer.id]}),_.render.renderStyle=1,this.materials=[l,f,h],this.entity=new He(`MeshCollisionDebug`,this.app),this.entity.addChild(d),this.entity.addChild(m),this.entity.addChild(_),this.entity.enabled=!1,e.root.addChild(this.entity)}set enabled(e){this._enabled=e,this.entity.enabled=e,this.layer.enabled=e}get enabled(){return this._enabled}setCameraFrameEnabled(e){hy(this.triangles,e,this.flatColors),this.mesh.setColors32(this.flatColors),this.mesh.update(4)}destroy(){this.entity?.destroy();for(let e of this.materials)e.destroy();this.materials.length=0,this.app.scene.layers.remove(this.layer),this.camera.camera.layers=this.camera.camera.layers.filter(e=>e!==this.layer.id)}},yy=`http://www.w3.org/2000/svg`,by=12,xy=.2,Sy=.17/.2,Cy=48,wy=1/6,Ty=.25,Ey=Math.PI/4,Dy=1e-6,Oy=(()=>{let e=[];for(let t=-2;t<=2;t++){let n=t*Ey,r=Math.cos(n),i=Math.sin(n);if(Math.abs(r)<=Dy)e.push(new W(0,i>0?1:-1,0));else for(let t=0;t<8;t++){let n=t*Ey;e.push(new W(Math.cos(n)*r,i,Math.sin(n)*r))}}return e})(),ky=(e,t,n,r)=>{let i=Math.sqrt(e*e+t*t+n*n);if(i<=Dy)return r.set(0,1,0);let a=1/i,o=e*a,s=t*a,c=n*a,l=Oy[0],u=-1/0;for(let e=0;e<Oy.length;e++){let t=Oy[e],n=t.x*o+t.y*s+t.z*c;n>u&&(u=n,l=t)}return r.copy(l)},Ay=new W,jy=new W,My=new W,Ny=new W,Py=new W,Fy=new W(0,1,0),Iy=new W(1,0,0),Ly=(e,t,n,r)=>{let i=e.camera;if(i.projection===1)return r*i.orthoHeight/t;let a=e.getPosition(),o=n.x-a.x,s=n.y-a.y,c=n.z-a.z,l=Math.sqrt(o*o+s*s+c*c),u=Math.tan(i.fov*Math.PI/360);return r*l*u/t},Ry=(e,t)=>{let n=e.length,r=`M${e[0].toFixed(1)},${t[0].toFixed(1)}`;for(let i=0;i<n;i++){let a=(i-1+n)%n,o=i,s=(i+1)%n,c=(i+2)%n,l=e[o]+(e[s]-e[a])*wy,u=t[o]+(t[s]-t[a])*wy,d=e[s]-(e[c]-e[o])*wy,f=t[s]-(t[c]-t[o])*wy;r+=` C${l.toFixed(1)},${u.toFixed(1)} ${d.toFixed(1)},${f.toFixed(1)} ${e[s].toFixed(1)},${t[s].toFixed(1)}`}return`${r} Z`},zy=class{path;svg;canvas;camera;smoothing;smoothNx=0;smoothNy=1;smoothNz=0;hasSmoothedNormal=!1;outerX=new Float64Array(by);outerY=new Float64Array(by);innerX=new Float64Array(by);innerY=new Float64Array(by);constructor(e,t,n,r){this.svg=e,this.canvas=t,this.camera=n,this.smoothing=r,this.path=document.createElementNS(yy,`path`),this.path.setAttribute(`fill`,`white`),this.path.setAttribute(`fill-opacity`,`0.6`),this.path.setAttribute(`fill-rule`,`evenodd`),this.path.setAttribute(`stroke`,`none`),this.path.style.display=`none`,e.appendChild(this.path)}projectCircle(e,t,n,r,i,a,o,s,c){let l=Ay.set(r,i,a);Math.abs(l.y)<.99?My.cross(l,Fy).normalize():My.cross(l,Iy).normalize(),Ny.cross(l,My);let u=this.camera.camera,d=2*Math.PI/by;for(let r=0;r<by;r++){let i=r*d,a=Math.cos(i),l=Math.sin(i),f=a*My.x+l*Ny.x,p=a*My.y+l*Ny.y,m=a*My.z+l*Ny.z;Py.set(e+f*o,t+p*o,n+m*o),u.worldToScreen(Py,jy),s[r]=jy.x,c[r]=jy.y}}render(e,t,n){ky(t.x,t.y,t.z,Ay);let r=Ay.x,i=Ay.y,a=Ay.z;if(this.smoothing){if(this.hasSmoothedNormal){let e=Ty;r=this.smoothNx+(r-this.smoothNx)*e,i=this.smoothNy+(i-this.smoothNy)*e,a=this.smoothNz+(a-this.smoothNz)*e;let t=Math.sqrt(r*r+i*i+a*a);if(t>1e-6){let e=1/t;r*=e,i*=e,a*=e}}this.smoothNx=r,this.smoothNy=i,this.smoothNz=a,this.hasSmoothedNormal=!0}let o=n===null?xy:Ly(this.camera,this.canvas.clientHeight||1,e,n),s=o*Sy;this.projectCircle(e.x,e.y,e.z,r,i,a,o,this.outerX,this.outerY),this.projectCircle(e.x,e.y,e.z,r,i,a,s,this.innerX,this.innerY),this.path.setAttribute(`d`,`${Ry(this.outerX,this.outerY)} ${Ry(this.innerX,this.innerY)}`),this.path.style.display=``,this.svg.style.display=``}hide(){this.path.style.display=`none`,this.hasSmoothedNormal=!1}},By=class{svg;captureMarker;hoverRing;targetRing;camera;collision;canvas;state;app;onPrerender;hoverActive=!1;navigating=!1;targetPos=null;targetNormal=null;targetMode=null;onPointerMove;onPointerLeave;collisionTarget={position:new W,normal:new W};constructor(e,t,n,r,i,a){this.camera=t,this.collision=n,this.canvas=e.graphicsDevice.canvas,this.state=i,this.app=e,this.svg=document.createElementNS(yy,`svg`),this.svg.style.cssText=`position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible`;let o=this.canvas.parentElement;(o.querySelector(`:scope > .sse-sceneLayer`)??o).prepend(this.svg),this.captureMarker=document.createElementNS(yy,`circle`),this.captureMarker.setAttribute(`cx`,`50%`),this.captureMarker.setAttribute(`cy`,`50%`),this.captureMarker.setAttribute(`r`,`2`),this.captureMarker.setAttribute(`fill`,`white`),this.captureMarker.setAttribute(`stroke`,`black`),this.captureMarker.setAttribute(`stroke-opacity`,`0.5`),this.captureMarker.setAttribute(`stroke-width`,`2`),this.captureMarker.style.display=`none`,this.svg.appendChild(this.captureMarker),this.hoverRing=new zy(this.svg,this.canvas,t,!0),this.targetRing=new zy(this.svg,this.canvas,t,!1),this.svg.style.display=`none`,this.onPointerMove=e=>{e.pointerType===`touch`||e.buttons?this.hoverRing.hide():this.updateCursor(e.offsetX,e.offsetY)},this.onPointerLeave=()=>{this.hoverRing.hide()},this.canvas.addEventListener(`pointermove`,this.onPointerMove),this.canvas.addEventListener(`pointerleave`,this.onPointerLeave);let s=()=>{let e=a&&i.inputMode===`desktop`&&i.gamingControls&&(i.cameraMode===`walk`||i.cameraMode===`fly`);this.captureMarker.style.display=e?``:`none`,e&&(this.svg.style.display=``),this.hoverActive=i.cameraMode===`walk`&&!i.gamingControls,this.hoverRing.hide(),this.targetMode&&this.targetMode!==i.cameraMode&&(this.navigating=!1,this.clearTarget())};r.on(`cameraMode:changed`,s),r.on(`inputMode:changed`,s),r.on(`gamingControls:changed`,s),r.on(`navigateTo`,()=>{this.navigating=!0,this.hoverRing.hide()}),r.on(`navigateCancel`,()=>{this.navigating=!1,this.clearTarget()}),r.on(`navigateComplete`,()=>{this.navigating=!1,this.clearTarget()}),r.on(`navTarget:set`,(e,t)=>{let n=i.cameraMode===`walk`||i.cameraMode===`fly`?i.cameraMode:`walk`;this.setTarget(e,t,n)}),r.on(`navTarget:clear`,()=>{this.clearTarget()}),r.on(`orbitTarget:set`,(e,t)=>{this.navigating=!1,this.setTarget(e,t,`orbit`)}),r.on(`orbitTarget:clear`,()=>{this.targetMode===`orbit`&&this.clearTarget()}),this.onPrerender=()=>{this.updateTarget()},e.on(`prerender`,this.onPrerender),s()}screenPixelsForRing(){return this.state.walkAllowed?null:Cy}setTarget(e,t,n){this.targetPos=e.clone(),this.targetNormal=t.clone(),this.targetMode=n,this.hoverRing.hide(),this.targetRing.hide()}clearTarget(){this.targetPos=null,this.targetNormal=null,this.targetMode=null,this.targetRing.hide()}pickCollision(e,t){if(!this.collision)return null;let{camera:n,collision:r}=this,i=n.getPosition();n.camera.screenToWorld(e,t,1,Ay),Ay.sub(i).normalize();let a=r.queryRay(i.x,i.y,i.z,Ay.x,Ay.y,Ay.z,n.camera.farClip,!0);if(!a)return null;a.exit&&Ay.mulScalar(-1);let o=r.querySurfaceNormal(a.x,a.y,a.z,Ay.x,Ay.y,Ay.z);return this.collisionTarget.position.set(a.x,a.y,a.z),this.collisionTarget.normal.set(o.nx,o.ny,o.nz),this.collisionTarget}updateCursor(e,t){if(!this.hoverActive||this.navigating){this.hoverRing.hide();return}let n=this.pickCollision(e,t);n?this.hoverRing.render(n.position,n.normal,this.screenPixelsForRing()):this.hoverRing.hide()}updateTarget(){if(!this.targetPos||!this.targetNormal||!this.targetMode)return;let e=this.camera.getPosition().distance(this.targetPos);this.targetMode!==`orbit`&&e<2?this.targetRing.hide():this.targetRing.render(this.targetPos,this.targetNormal,this.screenPixelsForRing())}destroy(){this.app.off(`prerender`,this.onPrerender),this.canvas.removeEventListener(`pointermove`,this.onPointerMove),this.canvas.removeEventListener(`pointerleave`,this.onPointerLeave),this.svg.remove()}},Vy=`
var splatDepth: texture_depth_2d;
// clip z = a * viewDepth + b over w = viewDepth (x, y), near and far (z, w)
uniform depthViewParams: vec4f;
// device pixels per snapshot pixel (x, y), 1 for an orthographic camera (z)
uniform snapshotParams: vec4f;

@fragment fn fragmentMain(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;
    let dims = vec2i(textureDimensions(splatDepth));
    let p = uniform.depthViewParams;
    let ortho = uniform.snapshotParams.z > 0.5;
    let origin = floor(pcPosition.xy);
    var trials = vec4f(1.0);
    for (var i = 0; i < 4; i++) {
        let corner = vec2f(0.25 + 0.5 * f32(i & 1), 0.25 + 0.5 * f32(i >> 1));
        let q = clamp(vec2i(floor((origin + corner) * uniform.snapshotParams.xy)), vec2i(0), dims - vec2i(1));
        let depth = textureLoad(splatDepth, q, 0);
        if (depth < 1.0) {
            let dz = depth - p.x;
            let safeDz = select(dz, sign(dz) * 1e-9 + 1e-12, abs(dz) < 1e-9);
            let viewDepth = select(p.y / safeDz, (depth - p.y) / p.x, ortho);
            trials[i] = clamp((viewDepth - p.z) / (p.w - p.z), 0.0, 0.99951171875);
        }
    }
    output.color = trials;
    return output;
}
`,Hy=(e,t)=>{let n=t.camera;return e.viewMatrix.equals(n.viewMatrix)&&e.projectionMatrix.equals(n.projectionMatrix)&&e.nearClip===n.nearClip&&e.farClip===n.farClip&&e.projection===n.projection},Uy=(e,t)=>e.viewMatrix.equals(t.viewMatrix)&&e.projectionMatrix.equals(t.projectionMatrix)&&e.nearClip===t.nearClip&&e.farClip===t.farClip&&e.projection===t.projection,Wy=(e,t)=>{t.position.copy(e.position),t.viewMatrix.copy(e.viewMatrix),t.projectionMatrix.copy(e.projectionMatrix),t.nearClip=e.nearClip,t.farClip=e.farClip,t.projection=e.projection},Gy=class{app;camera;renderer;shader;texture=null;target=null;snapshotFrame=-1;snapshotCamera=zs();renders=0;queue=new Zs;waiters=new Set;constructor(e,t,n){this.app=e,this.camera=t,this.renderer=n,this.shader=N.createShader(e.graphicsDevice,{uniqueName:`sse-splat-depth-snapshot`,attributes:{vertex_position:U},vertexChunk:`fullscreenQuadVS`,fragmentWGSL:Vy})}nextFrame(){return new Promise(e=>{let t=()=>{n.off(),this.waiters.delete(t),e()},n=this.app.once(`frameend`,t);this.waiters.add(t)})}snapshot(e,t){let n=this.app.graphicsDevice,r=Ys(n);if(!r)return null;let{width:i,height:a}=r;if(this.texture?(this.texture.width!==i||this.texture.height!==a)&&(this.target.resize(i,a),this.snapshotFrame=-1):(this.texture=new H(n,{name:`sse-splat-depth-snapshot`,format:12,width:i,height:a,mipmaps:!1,minFilter:0,magFilter:0,addressU:1,addressV:1}),this.target=new Ze({name:`sse-splat-depth-snapshot`,colorBuffer:this.texture,depth:!1}),this.snapshotFrame=-1),!(this.snapshotFrame===e.id||!t&&this.snapshotFrame>=0&&Uy(this.snapshotCamera,e.camera))){let{scope:t}=n,{camera:r}=e;t.resolve(`splatDepth`).setValue(this.renderer.frameDepthTexture),t.resolve(`depthViewParams`).setValue([e.clipZ[0],e.clipZ[1],r.nearClip,r.farClip]),t.resolve(`snapshotParams`).setValue([e.width/i,e.height/a,+(r.projection===1),0]),n.setBlendState(Ae.NOBLEND),L(n,this.target,this.shader),this.snapshotFrame=e.id,Wy(e.camera,this.snapshotCamera),this.renders++}let o=zs();return Wy(e.camera,o),{width:i,height:a,pickCamera:o}}async prepare(){if(this.queue.released)return null;let e=this.renderer.depthFrame;return(!e||!Hy(e.camera,this.camera))&&(this.app.renderNextFrame=!0,await this.nextFrame(),e=this.renderer.depthFrame,!e||this.queue.released)?null:this.snapshot(e,!0)}async readAround(e,t,n,r,i){let a=Math.max(0,e-n),o=Math.max(0,t-n),s=Math.min(r-1,e+n)-a+1,c=Math.min(i-1,t+n)-o+1,l=await this.texture.read(a,o,s,c,{renderTarget:this.target,immediate:!0});return(e,t,n)=>{let r=e-a,i=t-o;return r<0||r>=s||i<0||i>=c?null:Fs(l[(i*s+r)*4+n])}}pick(e,t){return this.queue.run(async()=>{let n=await this.prepare();if(!n)return null;let{width:r,height:i,pickCamera:a}=n,o=Xs(e,r),s=Xs(t,i),c=Ks(await this.readAround(o,s,Cs,r,i),o,s);return c===null?null:Vs(a,o,s,r,i,c)},null)}pickSurface(e,t){return this.queue.run(async()=>{let n=await this.prepare();if(!n)return null;let{width:r,height:i,pickCamera:a}=n,o=Xs(e,r),s=Xs(t,i);return qs(await this.readAround(o,s,50,r,i),a,r,i,o,s)},null)}pickVisibility(e,t){return e.length===0?Promise.resolve([]):this.queue.run(async()=>{let n=await this.prepare();if(!n)return e.map(()=>null);let{width:r,height:i,pickCamera:a}=n,o=Math.max(1,Math.round(t*i));return Promise.all(e.map(async({x:e,y:t,depth:n})=>{let s=Xs(e,r),c=Xs(t,i);return Js(await this.readAround(s,c,o,r,i),a,s,c,o,n)}))},e.map(()=>null))}renderView(){if(this.queue.released)return null;let e=this.renderer.depthFrame;return!e||!this.snapshot(e,!1)?null:{texture:this.texture,renders:this.renders}}release(){this.queue.released=!0;for(let e of[...this.waiters])e();this.target?.destroy(),this.texture?.destroy(),this.target=null,this.texture=null,this.shader.destroy()}},Ky=`

// Solid leaf sentinel: childMask=0xFF, baseOffset=0
const SOLID_LEAF_MARKER: u32 = 0xFF000000u;

// Maximum DDA steps to prevent infinite loops
const MAX_STEPS: u32 = 512u;

// Target wireframe edge width in pixels
const EDGE_PIXELS: f32 = 1.5;

// Keep edges tinted so dense grids retain the solid/free-space distinction.
const EDGE_ALPHA: f32 = 0.8;

const FILL_ALPHA: f32 = 0.4;

struct Uniforms {
    invVP: mat4x4<f32>,
    screenWidth: u32,
    screenHeight: u32,
    gridMinX: f32,
    gridMinY: f32,
    gridMinZ: f32,
    voxelRes: f32,
    numVoxelsX: u32,
    numVoxelsY: u32,
    numVoxelsZ: u32,
    leafSize: u32,
    treeDepth: u32,
    projScaleY: f32,
    displayMode: u32,
    inverted: u32
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> nodes: array<u32>;
@group(0) @binding(2) var<storage, read> leafData: array<u32>;
@group(0) @binding(3) var outputTexture: texture_storage_2d<rgba8unorm, write>;

// ---- helpers ----

// Traverse the octree for block (bx, by, bz). Returns vec2u(result, skipLevel):
//   result: 0 = empty, 1 = solid, 2+ = mixed leaf (2 + leafDataIndex)
//   skipLevel: octree level for multi-block skipping (meaningful when result == 0 or 1)
fn queryBlock(bx: i32, by: i32, bz: i32) -> vec2u {
    let depth = uniforms.treeDepth;
    var nodeIndex: u32 = 0u;

    for (var level: u32 = depth - 1u; ; ) {
        let node = nodes[nodeIndex];

        // Solid leaf sentinel -- return level + 1 so the caller can skip 2^(level+1) blocks
        if (node == SOLID_LEAF_MARKER) {
            return vec2u(1u, level + 1u);
        }

        let childMask = (node >> 24u) & 0xFFu;

        // childMask == 0 means this is a mixed leaf node
        if (childMask == 0u) {
            let leafIdx = node & 0x00FFFFFFu;
            return vec2u(2u + leafIdx, 0u);
        }

        // Determine octant at this level
        let bitX = (u32(bx) >> level) & 1u;
        let bitY = (u32(by) >> level) & 1u;
        let bitZ = (u32(bz) >> level) & 1u;
        let octant = (bitZ << 2u) | (bitY << 1u) | bitX;

        // Check if child exists
        if ((childMask & (1u << octant)) == 0u) {
            return vec2u(0u, level);
        }

        // Compute child index
        let baseOffset = node & 0x00FFFFFFu;
        let prefix = (1u << octant) - 1u;
        let childOffset = countOneBits(childMask & prefix);
        nodeIndex = baseOffset + childOffset;

        if (level == 0u) { break; }
        level -= 1u;
    }

    // Reached leaf level
    let node = nodes[nodeIndex];
    if (node == SOLID_LEAF_MARKER) {
        return vec2u(1u, 0u);
    }
    let leafIdx = node & 0x00FFFFFFu;
    return vec2u(2u + leafIdx, 0u);
}

// Ray-AABB intersection returning (tNear, tFar). If tNear > tFar → miss.
fn intersectAABB(ro: vec3f, invDir: vec3f, bmin: vec3f, bmax: vec3f) -> vec2f {
    let t1 = (bmin - ro) * invDir;
    let t2 = (bmax - ro) * invDir;
    let tmin = min(t1, t2);
    let tmax = max(t1, t2);
    let tNear = max(max(tmin.x, tmin.y), tmin.z);
    let tFar  = min(min(tmax.x, tmax.y), tmax.z);
    return vec2f(tNear, tFar);
}

// Compute wireframe edge factor (0 = interior, 1 = on edge) for a hit point on a voxel cube.
// Uses the median of the three per-axis face distances so it works on ANY face.
fn edgeFactor(hitPos: vec3f, voxMin: vec3f, voxSize: f32, edgeWidth: f32) -> f32 {
    let local = (hitPos - voxMin) / voxSize;

    // Distance to nearest face boundary for each axis
    let fx = min(local.x, 1.0 - local.x);
    let fy = min(local.y, 1.0 - local.y);
    let fz = min(local.z, 1.0 - local.z);

    // Median of three values = second smallest = edge distance.
    // On a face, one of fx/fy/fz is ~0 (the face normal axis).
    // The median gives the smaller of the other two = distance to nearest edge.
    let edgeDist = max(min(fx, fy), min(max(fx, fy), fz));

    return 1.0 - smoothstep(0.0, edgeWidth, edgeDist);
}

// Shade by the camera's occupancy: gray in free space, orange inside solid
// voxels (where the ray-march is inverted to find the exit into free space).
// Face-axis brightness and darker edges keep the grid shape readable.
fn shadeVoxelHit(hitPos: vec3f, voxMin: vec3f, voxelRes: f32, ro: vec3f) -> vec4f {
    let dist = length(hitPos - ro);
    let pixelWorld = 2.0 * dist / (f32(uniforms.screenHeight) * uniforms.projScaleY);
    let ew = clamp(EDGE_PIXELS * pixelWorld / voxelRes, 0.01, 0.5);

    let ef = edgeFactor(hitPos, voxMin, voxelRes, ew);

    let local = (hitPos - voxMin) / voxelRes;
    let fx = min(local.x, 1.0 - local.x);
    let fy = min(local.y, 1.0 - local.y);
    let fz = min(local.z, 1.0 - local.z);

    var faceAxis: u32 = 0u;
    if (fy <= fx && fy <= fz) {
        faceAxis = 1u;
    } else if (fz <= fx) {
        faceAxis = 2u;
    }

    var brightness = 0.85;
    if (faceAxis == 1u) { brightness = 0.65; }
    else if (faceAxis == 2u) { brightness = 0.45; }

    let tint = select(vec3f(1.0), vec3f(1.0, 0.35, 0.08), uniforms.inverted != 0u);
    let color = tint * mix(brightness, 0.2, ef);
    let alpha = mix(FILL_ALPHA, EDGE_ALPHA, ef);

    return vec4f(color * alpha, alpha);
}

// Blue (0) -> Cyan (0.25) -> Green (0.5) -> Yellow (0.75) -> Red (1.0)
fn heatmap(t: f32) -> vec3f {
    let c = clamp(t, 0.0, 1.0);
    let r = clamp(min(c - 0.5, 1.0) * 2.0, 0.0, 1.0);
    let g = select(clamp(c * 4.0, 0.0, 1.0), clamp((1.0 - c) * 4.0, 0.0, 1.0), c > 0.5);
    let b = clamp(1.0 - c * 2.0, 0.0, 1.0);
    return vec3f(r, g, b);
}

// ---- main ----

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) gid: vec3u) {
    let px = i32(gid.x);
    let py = i32(gid.y);
    let sw = i32(uniforms.screenWidth);
    let sh = i32(uniforms.screenHeight);

    if (px >= sw || py >= sh) {
        return;
    }

    // Reconstruct world-space ray from pixel coordinates
    let ndcX = (f32(px) + 0.5) / f32(sw) * 2.0 - 1.0;
    let ndcY = -((f32(py) + 0.5) / f32(sh) * 2.0 - 1.0);

    let clipNear = vec4f(ndcX, ndcY, 0.0, 1.0);
    let clipFar  = vec4f(ndcX, ndcY, 1.0, 1.0);

    var worldNear = uniforms.invVP * clipNear;
    worldNear = worldNear / worldNear.w;
    var worldFar = uniforms.invVP * clipFar;
    worldFar = worldFar / worldFar.w;

    let ro = worldNear.xyz;
    let rd = normalize(worldFar.xyz - worldNear.xyz);

    // Grid AABB
    let gridMin = vec3f(uniforms.gridMinX, uniforms.gridMinY, uniforms.gridMinZ);
    let gridMax = gridMin + vec3f(
        f32(uniforms.numVoxelsX),
        f32(uniforms.numVoxelsY),
        f32(uniforms.numVoxelsZ)
    ) * uniforms.voxelRes;

    let invDir = 1.0 / rd;
    let gridHit = intersectAABB(ro, invDir, gridMin, gridMax);

    if (max(gridHit.x, 0.0) > gridHit.y) {
        textureStore(outputTexture, vec2i(px, py), vec4f(0.0));
        return;
    }

    let tEntry = max(gridHit.x, 0.0) + 0.0001;

    // Entry point in voxel-index space
    let entryWorld = ro + rd * tEntry;
    let voxelRes = uniforms.voxelRes;
    let lsf = f32(uniforms.leafSize);
    let blockRes = voxelRes * lsf;
    let leafSz = i32(uniforms.leafSize);

    // Block-level DDA setup
    let entryBlock = (entryWorld - gridMin) / blockRes;
    let numBlocksX = i32(uniforms.numVoxelsX / uniforms.leafSize);
    let numBlocksY = i32(uniforms.numVoxelsY / uniforms.leafSize);
    let numBlocksZ = i32(uniforms.numVoxelsZ / uniforms.leafSize);

    var bx = clamp(i32(floor(entryBlock.x)), 0, numBlocksX - 1);
    var by = clamp(i32(floor(entryBlock.y)), 0, numBlocksY - 1);
    var bz = clamp(i32(floor(entryBlock.z)), 0, numBlocksZ - 1);

    let stepX = select(-1, 1, rd.x >= 0.0);
    let stepY = select(-1, 1, rd.y >= 0.0);
    let stepZ = select(-1, 1, rd.z >= 0.0);

    let tDeltaX = abs(blockRes / rd.x);
    let tDeltaY = abs(blockRes / rd.y);
    let tDeltaZ = abs(blockRes / rd.z);

    // tMax: t value to reach next block boundary along each axis
    let blockMinWorld = gridMin + vec3f(f32(bx), f32(by), f32(bz)) * blockRes;
    let nextBoundX = select(blockMinWorld.x, blockMinWorld.x + blockRes, rd.x >= 0.0);
    let nextBoundY = select(blockMinWorld.y, blockMinWorld.y + blockRes, rd.y >= 0.0);
    let nextBoundZ = select(blockMinWorld.z, blockMinWorld.z + blockRes, rd.z >= 0.0);

    var tMaxX = (nextBoundX - ro.x) / rd.x;
    var tMaxY = (nextBoundY - ro.y) / rd.y;
    var tMaxZ = (nextBoundZ - ro.z) / rd.z;

    let inv = uniforms.inverted != 0u;
    var totalWork: u32 = 0u;

    for (var step: u32 = 0u; step < MAX_STEPS; step++) {
        totalWork += 1u;

        let qResult = queryBlock(bx, by, bz);
        let blockResult = qResult.x;
        let skipLevel = qResult.y;

        // Normal: skip large empty regions.  Inverted: skip large solid regions.
        let shouldSkip = select(
            blockResult == 0u && skipLevel >= 1u,
            blockResult == 1u && skipLevel >= 1u,
            inv
        );

        if (shouldSkip) {
            let cellBlocks = i32(1u << skipLevel);
            let cellMask = ~(cellBlocks - 1);
            let cellXMin = bx & cellMask;
            let cellYMin = by & cellMask;
            let cellZMin = bz & cellMask;

            for (var skip: u32 = 0u; skip < 128u; skip++) {
                totalWork += 1u;

                if (tMaxX < tMaxY && tMaxX < tMaxZ) {
                    bx += stepX;
                    tMaxX += tDeltaX;
                    if (bx < cellXMin || bx >= cellXMin + cellBlocks) { break; }
                } else if (tMaxY < tMaxZ) {
                    by += stepY;
                    tMaxY += tDeltaY;
                    if (by < cellYMin || by >= cellYMin + cellBlocks) { break; }
                } else {
                    bz += stepZ;
                    tMaxZ += tDeltaZ;
                    if (bz < cellZMin || bz >= cellZMin + cellBlocks) { break; }
                }
            }
        } else {
            // Normal: enter voxel DDA for non-empty blocks.
            // Inverted: enter voxel DDA for non-solid blocks (empty or mixed).
            let enterDDA = select(blockResult != 0u, blockResult != 1u, inv);

            if (enterDDA) {
                let blockOrigin = gridMin + vec3f(f32(bx), f32(by), f32(bz)) * blockRes;

                let blockMax = blockOrigin + vec3f(blockRes);
                let bHit = intersectAABB(ro, invDir, blockOrigin, blockMax);
                let tBlockEntry = max(bHit.x, 0.0);

                // Voxel-level DDA within the block
                let entryVoxWorld = ro + rd * (tBlockEntry + 0.0001);
                let entryLocal = (entryVoxWorld - blockOrigin) / voxelRes;
                var vx = clamp(i32(floor(entryLocal.x)), 0, leafSz - 1);
                var vy = clamp(i32(floor(entryLocal.y)), 0, leafSz - 1);
                var vz = clamp(i32(floor(entryLocal.z)), 0, leafSz - 1);

                let vTDeltaX = abs(voxelRes / rd.x);
                let vTDeltaY = abs(voxelRes / rd.y);
                let vTDeltaZ = abs(voxelRes / rd.z);

                let voxOrigin = blockOrigin + vec3f(f32(vx), f32(vy), f32(vz)) * voxelRes;
                let vNextX = select(voxOrigin.x, voxOrigin.x + voxelRes, rd.x >= 0.0);
                let vNextY = select(voxOrigin.y, voxOrigin.y + voxelRes, rd.y >= 0.0);
                let vNextZ = select(voxOrigin.z, voxOrigin.z + voxelRes, rd.z >= 0.0);

                var vTMaxX = (vNextX - ro.x) / rd.x;
                var vTMaxY = (vNextY - ro.y) / rd.y;
                var vTMaxZ = (vNextZ - ro.z) / rd.z;

                var maskLo: u32 = 0u;
                var maskHi: u32 = 0u;
                if (blockResult > 1u) {
                    let leafIdx = blockResult - 2u;
                    maskLo = leafData[leafIdx * 2u];
                    maskHi = leafData[leafIdx * 2u + 1u];
                }

                for (var vStep: u32 = 0u; vStep < 12u; vStep++) {
                    totalWork += 1u;

                    var isSolid = false;

                    if (blockResult == 1u) {
                        isSolid = true;
                    } else {
                        let bitIndex = u32(vz) * 16u + u32(vy) * 4u + u32(vx);
                        isSolid = select(
                            (maskHi & (1u << (bitIndex - 32u))) != 0u,
                            (maskLo & (1u << bitIndex)) != 0u,
                            bitIndex < 32u
                        );
                    }

                    let isHit = select(isSolid, !isSolid, inv);

                    if (isHit) {
                        if (uniforms.displayMode == 0u) {
                            let voxMin = blockOrigin + vec3f(f32(vx), f32(vy), f32(vz)) * voxelRes;
                            let vHit = intersectAABB(ro, invDir, voxMin, voxMin + vec3f(voxelRes));
                            let hitPos = ro + rd * max(vHit.x, 0.0);
                            let result = shadeVoxelHit(hitPos, voxMin, voxelRes, ro);
                            textureStore(outputTexture, vec2i(px, py), result);
                        } else {
                            let effort = f32(totalWork) / 256.0;
                            let color = heatmap(effort);
                            textureStore(outputTexture, vec2i(px, py), vec4f(color, 1.0));
                        }
                        return;
                    }

                    // Advance voxel DDA
                    if (vTMaxX < vTMaxY && vTMaxX < vTMaxZ) {
                        vx += stepX;
                        vTMaxX += vTDeltaX;
                        if (vx < 0 || vx >= leafSz) { break; }
                    } else if (vTMaxY < vTMaxZ) {
                        vy += stepY;
                        vTMaxY += vTDeltaY;
                        if (vy < 0 || vy >= leafSz) { break; }
                    } else {
                        vz += stepZ;
                        vTMaxZ += vTDeltaZ;
                        if (vz < 0 || vz >= leafSz) { break; }
                    }
                }
            }

            // Advance block DDA
            if (tMaxX < tMaxY && tMaxX < tMaxZ) {
                bx += stepX;
                tMaxX += tDeltaX;
            } else if (tMaxY < tMaxZ) {
                by += stepY;
                tMaxY += tDeltaY;
            } else {
                bz += stepZ;
                tMaxZ += tDeltaZ;
            }
        }

        if (bx < 0 || by < 0 || bz < 0 ||
            bx >= numBlocksX || by >= numBlocksY || bz >= numBlocksZ) {
            break;
        }
    }

    textureStore(outputTexture, vec2i(px, py), vec4f(0.0));
}
`,qy=class{app;camera;compute;storageTexture;overlayMaterial;quad;nodesBuffer;leafDataBuffer;collision;currentWidth=0;currentHeight=0;invVP=new J;vpTemp=new J;enabled=!1;mode=`overlay`;constructor(e,t,n){this.app=e,this.camera=n,this.collision=t;let i=e.graphicsDevice,a=t.nodes,o=Math.max(a.byteLength,4);this.nodesBuffer=new A(i,o,8),a.byteLength>0&&this.nodesBuffer.write(0,a,0,a.length);let s=t.leafData,c=Math.max(s.byteLength,4);this.leafDataBuffer=new A(i,c,8),s.byteLength>0&&this.leafDataBuffer.write(0,s,0,s.length),this.currentWidth=Math.max(i.width,1),this.currentHeight=Math.max(i.height,1),this.storageTexture=this.createStorageTexture(this.currentWidth,this.currentHeight);let l={name:`VoxelDebugOverlay`,shaderLanguage:K,cshader:Ky,computeUniformBufferFormats:{uniforms:new je(i,[new B(`invVP`,14),new B(`screenWidth`,26),new B(`screenHeight`,26),new B(`gridMinX`,2),new B(`gridMinY`,2),new B(`gridMinZ`,2),new B(`voxelRes`,2),new B(`numVoxelsX`,26),new B(`numVoxelsY`,26),new B(`numVoxelsZ`,26),new B(`leafSize`,26),new B(`treeDepth`,26),new B(`projScaleY`,2),new B(`displayMode`,26),new B(`inverted`,26)])},computeBindGroupFormat:new Fe(i,[new be(`uniforms`,4),new V(`nodes`,4,!0),new V(`leafData`,4,!0),new xe(`outputTexture`,7,`2d`)])},u=new r(i,l);this.compute=new ce(i,u,`VoxelDebugOverlay`),this.overlayMaterial=new v,this.overlayMaterial.cull=0,this.overlayMaterial.blendType=4,this.overlayMaterial.depthTest=!1,this.overlayMaterial.depthWrite=!1,this.overlayMaterial.setParameter(`colorMap`,this.storageTexture),this.overlayMaterial.shaderDesc={uniqueName:`VoxelOverlayComposite`,vertexGLSL:`
                attribute vec2 vertex_position;
                uniform mat4 matrix_model;
                varying vec2 uv0;
                void main(void) {
                    gl_Position = matrix_model * vec4(vertex_position, 0, 1);
                    uv0 = vertex_position.xy + 0.5;
                }
            `,vertexWGSL:`
                attribute vertex_position: vec2f;
                uniform matrix_model: mat4x4f;
                varying uv0: vec2f;
                @vertex fn vertexMain(input: VertexInput) -> VertexOutput {
                    var output: VertexOutput;
                    output.position = uniform.matrix_model * vec4f(input.vertex_position, 0.0, 1.0);
                    output.uv0 = input.vertex_position.xy + vec2f(0.5);
                    return output;
                }
            `,fragmentGLSL:`
                varying vec2 uv0;
                uniform sampler2D colorMap;
                void main(void) {
                    gl_FragColor = texture2D(colorMap, uv0);
                }
            `,fragmentWGSL:`
                varying uv0: vec2f;
                var colorMap: texture_2d<f32>;
                var colorMapSampler: sampler;
                @fragment fn fragmentMain(input: FragmentInput) -> FragmentOutput {
                    var output: FragmentOutput;
                    output.color = textureSample(colorMap, colorMapSampler, input.uv0);
                    return output;
                }
            `,attributes:{vertex_position:U}},this.overlayMaterial.update();let d=new re(i);d.setPositions([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0]),d.update(5);let f=new pe(`VoxelOverlayComposite`);f.setLocalScale(2,-2,1),f.getWorldTransform(),this.quad=new z(d,this.overlayMaterial,f),this.quad.cull=!1,this.quad.castShadow=!1,this.quad.pick=!1,this.quad.visible=!1,e.scene.defaultDrawLayer.addMeshInstances([this.quad],!0)}createStorageTexture(e,t){return new H(this.app.graphicsDevice,{name:`VoxelOverlay-Storage`,width:e,height:t,format:7,mipmaps:!1,addressU:3,addressV:3,storage:!0})}update(){if(this.quad.visible=!1,!this.enabled||this.collision.nodes.length===0)return;let{app:e,camera:t,compute:n,collision:r}=this,i=e.graphicsDevice,a=i.width,o=i.height;if(a<=0||o<=0)return;(a!==this.currentWidth||o!==this.currentHeight)&&(this.storageTexture.destroy(),this.currentWidth=a,this.currentHeight=o,this.storageTexture=this.createStorageTexture(a,o),this.overlayMaterial.setParameter(`colorMap`,this.storageTexture),this.overlayMaterial.update());let s=t.camera;if(this.vpTemp.mul2(s.projectionMatrix,s.viewMatrix),this.invVP.copy(this.vpTemp).invert(),r.flipXY){let e=this.invVP.data;e[0]=-e[0],e[1]=-e[1],e[4]=-e[4],e[5]=-e[5],e[8]=-e[8],e[9]=-e[9],e[12]=-e[12],e[13]=-e[13]}n.setParameter(`invVP`,this.invVP.data),n.setParameter(`screenWidth`,a),n.setParameter(`screenHeight`,o),n.setParameter(`gridMinX`,r.gridMinX),n.setParameter(`gridMinY`,r.gridMinY),n.setParameter(`gridMinZ`,r.gridMinZ),n.setParameter(`voxelRes`,r.voxelResolution),n.setParameter(`numVoxelsX`,r.numVoxelsX),n.setParameter(`numVoxelsY`,r.numVoxelsY),n.setParameter(`numVoxelsZ`,r.numVoxelsZ),n.setParameter(`leafSize`,r.leafSize),n.setParameter(`treeDepth`,r.treeDepth),n.setParameter(`projScaleY`,s.projectionMatrix.data[5]),n.setParameter(`displayMode`,+(this.mode===`heatmap`));let c=t.getPosition(),l=c.x,u=c.y,d=c.z;r.flipXY&&(l=-l,u=-u);let f=Math.floor((l-r.gridMinX)/r.voxelResolution),p=Math.floor((u-r.gridMinY)/r.voxelResolution),m=Math.floor((d-r.gridMinZ)/r.voxelResolution);n.setParameter(`inverted`,+!!r.isVoxelSolid(f,p,m)),n.setParameter(`nodes`,this.nodesBuffer),n.setParameter(`leafData`,this.leafDataBuffer),n.setParameter(`outputTexture`,this.storageTexture);let h=Math.ceil(a/8),g=Math.ceil(o/8);n.setupDispatch(h,g,1),i.computeDispatch([n],`VoxelDebugOverlay`),this.quad.visible=!0}destroy(){this.app.scene.defaultDrawLayer.removeMeshInstances([this.quad],!0),this.quad.destroy(),this.compute.destroy(),this.compute.shader.destroy(),this.overlayMaterial.destroy(),this.nodesBuffer?.destroy(),this.leafDataBuffer?.destroy(),this.storageTexture?.destroy()}},Jy=(e,t,n,r)=>(e.includes(t)||console.warn(`patchChunk: substring not found in '${r}', shader chunk patch may be out of sync with the engine.`),e.replace(t,n)),Yy=`
vec3 prepareOutputFromGamma(vec3 gammaColor, float depth) {
    return gammaColor;
}
`,Xy=`
fn prepareOutputFromGamma(gammaColor: vec3f, depth: f32) -> vec3f {
    return gammaColor;
}
`,Zy={webgl:1,webgpu:2},Qy={none:6,linear:0,filmic:1,hejl:2,aces:3,aces2:4,neutral:5},$y=(e,t)=>{t.sharpness.enabled?e.rendering.sharpness=t.sharpness.amount:e.rendering.sharpness=0;let{bloom:n}=e;t.bloom.enabled?(n.intensity=t.bloom.intensity,n.blurLevel=t.bloom.blurLevel):n.intensity=0;let{grading:r}=e;t.grading.enabled?(r.enabled=!0,r.brightness=t.grading.brightness,r.contrast=t.grading.contrast,r.saturation=t.grading.saturation,r.tint=new G().fromArray(t.grading.tint)):r.enabled=!1;let{vignette:i}=e;t.vignette.enabled?(i.intensity=t.vignette.intensity,i.inner=t.vignette.inner,i.outer=t.vignette.outer,i.curvature=t.vignette.curvature):i.intensity=0;let{fringing:a}=e;a.intensity=t.fringing.enabled?t.fringing.intensity:0},eb=e=>e.sharpness.enabled&&e.sharpness.amount>0||e.bloom.enabled&&e.bloom.intensity>0||e.grading.enabled||e.vignette.enabled&&e.vignette.intensity>0||e.fringing.enabled&&e.fringing.intensity>0,tb=new W,nb=Ze.prototype.isColorBufferSrgb,rb=new Set,ib=function(e){return rb.has(this.device)&&this===this.device.backBuffer?!0:nb.call(this,e)},ab=(e,t)=>{t?rb.add(e):rb.delete(e),Ze.prototype.isColorBufferSrgb=rb.size?ib:nb},ob=class{global;cameraFrame;inputController;cameraManager;picker;voxelOverlay=null;meshOverlay=null;navCursor=null;debugPanel=null;splatRenderer=null;frameGate;miniStats=null;destroyed=!1;sequence=null;disposers=[];fullscreen;xr;capture=null;captureQueue=Promise.resolve();ready;failReady;abortHandlers=new Set;origChunks;constructor(e,n,r,i,a=null){this.global=e;let{app:o,settings:s,config:c,events:l,state:u,camera:d,renderer:f}=e,{graphicsDevice:p}=o;this.fullscreen=Av(e),this.xr=Wh(e),this.ready=new Promise((e,t)=>{l.once(`firstFrame`,()=>e()),this.failReady=t}),this.ready.catch(()=>{});let m=Y.get(p,`glsl`);m.set(`skyboxPS`,Jy(m.get(`skyboxPS`),`mapRoughnessUv(uv, mipLevel)`,`uv`,`glsl skyboxPS`));let h=Y.get(p,`wgsl`);h.set(`skyboxPS`,Jy(h.get(`skyboxPS`),`mapRoughnessUv(uv, uniform.mipLevel)`,`uv`,`wgsl skyboxPS`)),this.origChunks={glsl:{gsplatOutputVS:m.get(`gsplatOutputVS`),skyboxPS:m.get(`skyboxPS`)},wgsl:{gsplatOutputVS:h.get(`gsplatOutputVS`),skyboxPS:h.get(`skyboxPS`)}},o.autoRender=!0,this.frameGate=new kv(o,c.framesInFlight),this.onDestroy(()=>this.frameGate.destroy()),l.once(`firstFrame`,()=>l.fire(`frameGate:ready`,this.frameGate)),this.configureCamera(s),this.syncSplatRenderer(),l.once(`firstFrame`,()=>l.fire(`splatRenderer:ready`,this.splatRenderer));let g=[`performanceMode:changed`,`debugMode:changed`].map(e=>l.on(e,()=>{this.destroyed||this.syncSplatRenderer()}));this.onDestroy(()=>g.forEach(e=>e.off()));let _=l.on(`xrMode:changed`,()=>{this.destroyed||this.configureCamera(s)});this.onDestroy(()=>_.off()),this.setMiniStats(c.ministats),this.onDestroy(()=>{this.miniStats?.destroy(),this.miniStats=null});let v=new J,y=new J,b=new t;o.on(`framerender`,()=>{let e=d.getWorldTransform(),t=d.camera.projectionMatrix;o.renderNextFrame||!this.miniStats?.enabled&&eg(e.data,y.data)&&eg(t.data,v.data)||this.frameGate.request(),o.renderNextFrame&&(y.copy(e),v.copy(t))});let x=t=>{let n=e.camera;n.setPosition(t.position),n.setEulerAngles(t.angles),n.camera.fov=t.fov,n.camera.horizontalFov=p.width>p.height;let r=b.halfExtents.length();tb.sub2(b.center,t.position);let i=tb.dot(n.forward),a=Math.max(i+r,.01),o=Math.max(i-r,Math.min(a/16384,.01));n.camera.farClip=a,n.camera.nearClip=Math.min(1,o)};o.on(`update`,e=>{o.xr.active||this.inputController&&this.cameraManager&&(this.inputController.update(e,this.cameraManager.camera.distance),this.cameraManager.update(e,this.inputController.frame),x(this.cameraManager.camera))}),o.on(`prerender`,()=>{this.voxelOverlay?.update()}),l.on(`firstFrame`,()=>{u.animationPaused=c.noanim||c.vr,u.loaded=!0,c.exposeGlobals&&(window.scrubTo=async e=>{let t=this.seekTo(e);u.animationPaused=!0,await this.untilDestroyed(t);let n,r=new Promise(e=>{n=e,o.once(`frameend`,n)});try{await this.untilDestroyed(r)}finally{o.off(`frameend`,n)}},window.animationDuration=u.animationDuration,window.app=o,window.captureFrame=e=>this.captureFrame(e))});let{gsplat:S}=o.scene;S.lodUpdateAngle=e.quality.lodUpdateAngle,S.lodBehindPenalty=e.quality.lodBehindPenalty,S.minContribution=1,S.alphaClip=1/255,S.antiAlias=c.aa,S.radialSorting=!0,S.debug=+!!c.colorize;let C=()=>{};c.fullload||n.then(e=>{if(this.destroyed)return;let t=e.gsplat,n=t.resource?.octree?.lodLevels;n&&(t.lodRangeMax=t.lodRangeMin=n-1)},C);let w;n.then(()=>{if(this.destroyed)return;let e=o.systems.gsplat,t=0,n=0,r=(e,r,i,a)=>{n+=Math.max(0,t-a),t=a;let o=n+a;o>0&&(u.progress=Math.max(u.progress,Math.min(99,Math.trunc(n/o*100))))};e.on(`frame:ready`,r),w=()=>e.off(`frame:ready`,r),this.onDestroy(w)},C);let T=null,E;i?.then(e=>{!this.destroyed&&e&&(T=e,E?.(e))},C),Promise.all([n,r,a]).then(t=>{if(this.destroyed)return;let n=t[2];n?.animated&&(this.sequence=n,u.hasSequence=!0,u.hasAnimation=!0,u.animationDuration=n.duration,n.paused=u.animationPaused,l.on(`animationPaused:changed`,e=>{n.paused=e}),o.on(`update`,()=>{u.animationTime=n.time}));let r=t[0].gsplat,i=r.customAabb;i&&b.setFromTransformedAabb(i,t[0].getWorldTransform());let a=null,s=null,p=()=>this.splatRenderer&&this.global.quality.stochastic?(s??=new Gy(o,d,this.splatRenderer),s):(a??=new Qs(o,d),a);if(this.picker={pick:(e,t)=>p().pick(e,t),pickSurface:(e,t)=>p().pickSurface(e,t),pickVisibility:(e,t)=>p().pickVisibility(e,t),renderView:()=>p().renderView(),release:()=>{a?.release(),s?.release()}},l.fire(`picker:ready`,this.picker),this.inputController=new uy(e,this.picker),this.cameraManager=new tv(e,b,null,!n),x(this.cameraManager.camera),this.xr.setGrabTarget(t[0],!this.cameraManager.isObjectExperience),c.vr){let e=l.on(`vrPrompt:start`,()=>{!this.destroyed&&u.canStartVR&&this.xr.start(`vr`).catch(()=>{})});this.onDestroy(()=>e.off()),l.fire(`vrPrompt:ready`)}c.ui&&(this.navCursor=new By(o,d,null,l,u,c.reticle)),E=e=>{if(this.inputController.collision=e,this.cameraManager.setCollision(e),this.xr.setCollision(e),this.navCursor&&(this.navCursor.collision=e),u.hasCollision=!0,u.walkAllowed=Q_(b,e),e instanceof Do&&f!==`webgl`){let t=()=>{let t=u.collisionOverlayEnabled&&u.xrMode===null;t&&!this.voxelOverlay&&(this.voxelOverlay=new qy(o,e,d),this.voxelOverlay.mode=c.heatmap?`heatmap`:`overlay`),this.voxelOverlay&&(this.voxelOverlay.enabled=t),o.renderNextFrame=!0};l.on(`collisionOverlayEnabled:changed`,t),l.on(`xrMode:changed`,t),u.hasCollisionOverlay=!0,t()}else e instanceof bo&&(this.meshOverlay=new vy(o,e,d,!!this.cameraFrame),u.hasCollisionOverlay=!0,l.on(`collisionOverlayEnabled:changed`,e=>{this.meshOverlay.enabled=e,o.renderNextFrame=!0}));o.renderNextFrame=!0},T&&E(T);let m=e.quality.stochastic?this.splatRenderer:null;this.debugPanel=new Ov(e,this.cameraManager,this.picker,m,{shown:()=>!!this.miniStats?.enabled,show:e=>this.setMiniStats(e)});let h=()=>{let{quality:e}=this.global;S.splatBudget=e.budget*1e6,S.colorUpdateAngle=e.colorUpdateAngle,S.lodBehindPenalty=e.lodBehindPenalty,S.lodUpdateAngle=e.lodUpdateAngle,r.lodRangeMin=0,r.lodRangeMax=1e3,o.renderNextFrame=!0};c.fullload&&h();let g=o.systems.gsplat;g.on(`frame:request`,()=>{o.renderNextFrame=!0});let _=!(r.resource?.octree??null),v=!1,y=l.on(`xrMode:changed`,e=>{!e&&!v&&(o.autoRender=!0)});this.onDestroy(()=>y.off());let C=(e,t,n,r)=>{if((r>0||o.stats.frame.gsplats>0)&&(_=!0),n&&r===0&&_){g.off(`frame:ready`,C),w?.(),u.progress=100,v=!0,o.xr.active||(o.autoRender=!1);let e=[l.on(`quality:changed`,h),l.on(`performanceMode:changed`,h),l.on(`debugMode:changed`,h),l.on(`xrMode:changed`,h)];this.onDestroy(()=>e.forEach(e=>e.off())),h(),this.splatRenderer||(S.renderer=Zy[f]),o.once(`frameend`,()=>{l.fire(`firstFrame`),window.firstFrame?.()})}};g.on(`frame:ready`,C)},C)}syncSplatRenderer(){let{app:e,config:t,events:n,camera:r,quality:i}=this.global,a=i.stochastic;if(a&&!this.splatRenderer){let n=e.scene.layers.getLayerByName(`World`),a=i.budget*1e6;El.cacheFits(e.graphicsDevice,a)?n&&(this.splatRenderer=new El(e,r.camera,n,{source:t.splatSource,mode:i.stochasticMode,variant:t.variant,requestFrame:()=>this.frameGate.request()})):console.warn(`stochastic renderer: a ${i.budget}M splat budget exceeds this device's storage binding limit; the sorted renderer draws`)}a&&this.splatRenderer?.setMode(i.stochasticMode),this.splatRenderer?.setEnabled(a),n.fire(`splatRenderer:changed`,a?this.splatRenderer:null)}requireAlive(e){if(this.destroyed)throw Error(`${e}: the viewer has been destroyed`)}requireLoaded(e){if(this.requireAlive(e),!this.global.state.loaded)throw Error(`${e}: the viewer is not loaded`)}frameScene(){this.requireLoaded(`frameScene`),this.global.events.fire(`inputEvent`,`frame`)}resetCamera(){this.requireLoaded(`resetCamera`),this.global.events.fire(`inputEvent`,`reset`)}toggleWalk(){this.requireLoaded(`toggleWalk`),this.global.events.fire(`inputEvent`,`toggleWalk`)}selectAnnotation(e){this.requireLoaded(`selectAnnotation`);let{settings:t,state:n,app:r}=this.global;if(e!==null){if(!Number.isInteger(e)||e<0||e>=t.annotations.length)throw RangeError(`selectAnnotation: index must be an integer in range or null`);this.cameraManager.selectAnnotation(t.annotations[e])}n.selectedAnnotation=e,r.renderNextFrame=!0}setMoveInput(e,t){if(this.requireLoaded(`setMoveInput`),!Number.isFinite(e)||!Number.isFinite(t))throw Error(`setMoveInput: axes must be finite numbers`);this.inputController.setMoveInput(Math.max(-1,Math.min(1,e)),Math.max(-1,Math.min(1,t)))}async requestFullscreen(){return this.requireAlive(`requestFullscreen`),this.untilDestroyed(this.fullscreen.request())}async exitFullscreen(){return this.requireAlive(`exitFullscreen`),this.untilDestroyed(this.fullscreen.exit())}async startXR(e){return this.requireLoaded(`startXR`),this.xr.start(e)}async endXR(){return this.requireAlive(`endXR`),this.xr.end()}seek(e){this.seekTo(e).catch(()=>{})}seekTo(e){this.requireLoaded(`seek`);let{state:t,app:n}=this.global;if(!t.hasAnimation)throw Error(`seek: no animation track`);if(!Number.isFinite(e))throw Error(`seek: time must be finite`);if(n.renderNextFrame=!0,this.sequence){let n=this.sequence.seek(e);return t.animationTime=this.sequence.time,n}return this.cameraManager.seek(e),Promise.resolve()}captureFrame({time:e,width:t=480,height:n=t,supersample:r}={}){let i=async()=>{if(await this.ready,this.destroyed)throw Error(`captureFrame: the viewer has been destroyed`);let{app:i,camera:a,state:o}=this.global;this.capture||=new iv(i,a.camera,()=>this.cameraFrame??null);let s=this.capture.grab({time:e,width:t,height:n,supersample:r,scrub:async e=>{o.hasAnimation&&(o.animationPaused=!0,await this.seekTo(e))}});return this.untilDestroyed(s)},a=this.captureQueue.then(i,i);return this.captureQueue=a.then(()=>{},()=>{}),a}untilDestroyed(e){let t,n=new Promise((e,n)=>{t=n});return this.abortHandlers.add(t),Promise.race([e,n]).finally(()=>{this.abortHandlers.delete(t)})}onDestroy(e){this.destroyed?e():this.disposers.push(e)}setMiniStats(e){if(e===!!this.miniStats?.enabled)return;if(this.miniStats){if(this.miniStats.enabled=e,this.miniStats.div.style.display=e?``:`none`,e){let e=this.miniStats.activeSizeIndex;this.miniStats.activeSizeIndex=e,this.global.app.renderNextFrame=!0}return}let t=ei.getDefaultOptions();t.cpu.enabled=!1,t.stats=t.stats.filter(e=>e.name!==`DrawCalls`),t.stats.push({name:`Splats`,stats:[`frame.gsplats`],decimalPlaces:3,multiplier:1/1e6,unitsName:`M`,watermark:5}),this.miniStats=new ei(this.global.app,t),this.global.app.renderNextFrame=!0}destroy(){if(this.destroyed)return;this.destroyed=!0;let e=()=>Error(`the viewer has been destroyed`);this.failReady(e());for(let t of this.abortHandlers)t(e());this.abortHandlers.clear();let{app:t}=this.global;this.fullscreen.destroy(),this.xr.destroy(),this.debugPanel?.destroy(),this.navCursor?.destroy(),this.inputController?.destroy(),this.voxelOverlay?.destroy(),this.meshOverlay?.destroy(),this.picker?.release(),this.splatRenderer?.destroy(),this.splatRenderer=null,this.capture?.destroy(),this.capture=null,this.cameraFrame&&=(this.cameraFrame.destroy(),null),ab(t.graphicsDevice,!1);for(let e of this.disposers.reverse())e();this.disposers.length=0,window.app===t&&(delete window.app,delete window.scrubTo,delete window.captureFrame,delete window.animationDuration);let n=t.graphicsDevice,r=n.gl??null,i=n.wgpu??null;t.destroy(),r?.getExtension(`WEBGL_lose_context`)?.loseContext(),i?.destroy(),this.global.root.remove()}configureCamera(e){let{global:t}=this,{app:n,config:r,camera:i,state:a}=t,{postEffectSettings:o}=e,{background:s}=e,c=r.hpr??e.highPrecisionRendering,l=!r.nofx&&(eb(o)||c);if(a.xrMode===null&&l){this.cameraFrame||=new ia(n,i.camera);let{cameraFrame:t}=this;t.enabled=!0,t.rendering.toneMapping=Qy[e.tonemapping],t.rendering.renderFormats=c?[12,14]:[],$y(t,o),t.update(),Y.get(n.graphicsDevice,`glsl`).set(`gsplatOutputVS`,Yy),Y.get(n.graphicsDevice,`wgsl`).set(`gsplatOutputVS`,Xy),Y.get(n.graphicsDevice,`glsl`).set(`skyboxPS`,Jy(this.origChunks.glsl.skyboxPS,`gammaCorrectOutput(toneMap(processEnvironment(linear)))`,`pow(toneMap(processEnvironment(linear)) + 0.0000001, vec3(1.0 / 2.2))`,`glsl skyboxPS gamma override`)),Y.get(n.graphicsDevice,`wgsl`).set(`skyboxPS`,Jy(this.origChunks.wgsl.skyboxPS,`gammaCorrectOutput(toneMap(processEnvironment(linear)))`,`pow(toneMap(processEnvironment(linear)) + 0.0000001, vec3f(1.0 / 2.2))`,`wgsl skyboxPS gamma override`)),ab(n.graphicsDevice,!0),i.camera.clearColor=new G(s.color)}else this.cameraFrame&&=(this.cameraFrame.destroy(),null),Y.get(n.graphicsDevice,`glsl`).set(`gsplatOutputVS`,this.origChunks.glsl.gsplatOutputVS),Y.get(n.graphicsDevice,`wgsl`).set(`gsplatOutputVS`,this.origChunks.wgsl.gsplatOutputVS),Y.get(n.graphicsDevice,`glsl`).set(`skyboxPS`,this.origChunks.glsl.skyboxPS),Y.get(n.graphicsDevice,`wgsl`).set(`skyboxPS`,this.origChunks.wgsl.skyboxPS),ab(n.graphicsDevice,!1),i.camera.toneMapping=Qy[e.tonemapping],i.camera.clearColor=a.xrMode===`ar`?new G(0,0,0,0):new G(s.color);let u=n.scene.layers.getLayerById(2);u&&(u.enabled=a.xrMode!==`ar`),this.meshOverlay?.setCameraFrameEnabled(!!this.cameraFrame)}},sb=(e,t)=>t||new URL(e,location.href).pathname.split(`/`).pop(),cb=(e,t)=>sb(e,t)?.toLowerCase()!==`lod-meta.json`,lb=(e,t)=>sb(e,t)?.toLowerCase().endsWith(`.gsaf`),ub=/OculusBrowser/.test(globalThis.navigator?.userAgent??``)&&!new URLSearchParams(globalThis.location?.search??``).has(`webgpu`),db=async(e,t,n,r)=>{let{contents:i,contentUrl:a,contentFilename:o}=t,s=i,c=sb(a,o),l=c.toLowerCase()===`meta.json`?await(await i).json():void 0;if(r())throw Error(`loadGsplat: the viewer was destroyed while loading`);let u=new et(c,`gsplat`,{url:a,filename:c,contents:s},l);return new Promise((t,r)=>{u.on(`load`,()=>{let n=new He(`gsplat`,e);n.setLocalEulerAngles(0,0,180),n.addComponent(`gsplat`,{unified:!0,asset:u}),e.root.addChild(n),t(n)});let i=0;u.on(`progress`,(e,t)=>{let r=Math.min(1,e/t)*100;r>i&&(i=r,n(Math.trunc(i)))}),u.on(`error`,e=>{console.log(e),r(e)}),e.assets.add(u),e.assets.load(u)})},fb=(e,t)=>new Promise((n,r)=>{let i=new et(`skybox`,`texture`,{url:t},{type:`rgbp`,mipmaps:!1,addressu:`repeat`,addressv:`clamp`});i.on(`load`,()=>{n(i)}),i.on(`error`,e=>{console.log(e),r(e)}),e.assets.add(i),e.assets.load(i)}),pb=async(e,t)=>{let n=await _r(e,{deviceTypes:t.renderer===`webgpu`?[`webgpu`]:[],antialias:!1,depth:!0,stencil:!1,xrCompatible:!0,powerPreference:`high-performance`});console.log(`Renderer: ${n.deviceType}`);let r=n.deviceType===`webgpu`?`webgpu`:`webgl`;n.maxPixelRatio=window.devicePixelRatio;let i=new Qa(e,{graphicsDevice:n,mouse:new Tr(e),touch:new kr(e),keyboard:new Sr(window)});r===`webgpu`&&(i.scene.gsplatCentersEnabled=!1),i.loader.getHandler(`texture`).imgParser.crossOrigin=`anonymous`;let a=new He(`camera root`,i);i.root.addChild(a);let o=new He(`camera`,i);a.addChild(o);let s=new He(`light`,i);return s.setEulerAngles(35,45,0),s.addComponent(`light`,{color:new G(1,.98,.957),intensity:1}),i.root.addChild(s),i.scene.ambientLight.set(.51,.55,.65),{app:i,camera:o,renderer:r}},mb=e=>({width:e.clientWidth,height:e.clientHeight}),hb=(e,t,n)=>{if(!t.width||!t.height)return;let r=Gl()*n,i=Math.ceil(t.width*r),a=Math.ceil(t.height*r);(i!==e.width||a!==e.height)&&(e.width=i,e.height=a)},gb=e=>{let{app:t,events:n,quality:r}=e,{canvas:i}=t.graphicsDevice,a=mb(i),o=()=>{t.xr?.active||hb(i,a,r.resolutionScale)},s=new ResizeObserver(e=>{let n=e[0]?.contentBoxSize?.[0];n&&n.inlineSize&&n.blockSize&&(a.width=n.inlineSize,a.height=n.blockSize,t.renderNextFrame=!0)});return s.observe(i),n.on(`quality:changed`,()=>{t.renderNextFrame=!0}),t.on(`framerender`,o),t._allowResize=!1,o(),()=>s.disconnect()},_b=e=>{let t=new Image;return t.src=e,t},vb=e=>({contentUrl:e.contentUrl,contentFilename:e.contentFilename,posterUrl:e.posterUrl,skyboxUrl:e.skyboxUrl,collisionUrl:e.collisionUrl,gsafDecoderUrl:e.gsafDecoderUrl,poster:e.poster??(e.posterUrl?_b(e.posterUrl):void 0),contents:e.contents??(cb(e.contentUrl,e.contentFilename)?fetch(e.contentUrl):void 0),renderer:ub?`webgl`:e.renderer??`webgpu`,ui:e.ui??!0,reticle:e.reticle??!1,noanim:e.noanim??!1,nofx:e.nofx??!1,hpr:e.hpr,ministats:e.ministats??!1,colorize:e.colorize??!1,fullload:e.fullload??!1,vr:e.vr??!1,aa:e.aa??!1,stochastic:e.stochastic??!1,splatSource:lb(e.contentUrl,e.contentFilename)?`workbuffer`:e.splatSource??`direct`,variant:lb(e.contentUrl,e.contentFilename)?`taa:off,cull:off,${e.variant??``}`:e.variant??``,budget:e.budget,framesInFlight:e.framesInFlight??2,heatmap:e.heatmap??!1,debug:e.debug??!1,lang:e.lang,exposeGlobals:e.exposeGlobals??!1}),yb=async e=>{let{container:t}=e,n=vb(e),r=document.createElement(`div`);r.className=`sse-viewer`,n.ui?r.innerHTML=Jh:r.appendChild(document.createElement(`canvas`)),t.appendChild(r);let i=r.querySelector(`canvas`),a=new qe;n.poster&&n.ui&&Gh(r,n.poster,a);let o=typeof e.settings==`string`?await(await fetch(e.settings)).json():await e.settings,s=ns(b.mobile),c=n.stochastic===`off`?!1:n.stochastic!==!1||s.performanceMode;hb(i,mb(i),Kl(s.quality,c));let{app:l,camera:u,renderer:d}=await pb(i,n),f=es(n.lang,r),p=Ao(a,{loaded:!1,...s,qualityAvailable:[],progress:0,inputMode:b.mobile?`touch`:`desktop`,cameraMode:`orbit`,hasAnimation:!1,hasSequence:!1,animationDuration:0,animationTime:0,animationPaused:!0,hasAR:!1,hasVR:!1,canStartAR:!1,canStartVR:!1,xrMode:null,hasCollision:!1,hasCollisionOverlay:!1,walkAllowed:!1,collisionOverlayEnabled:!1,isFullscreen:!1,controlsHidden:!1,selectedAnnotation:null,inputEnabled:!0}),m=new ql(l,n,p,a,d),h={app:l,settings:eu(o),config:n,state:p,events:a,camera:u,renderer:d,root:r,localize:f,quality:m},g=gb(h);l.start(),u.addComponent(`camera`);let _=!1,v=e=>{p.progress=e},y=new AbortController,x=lb(n.contentUrl,n.contentFilename)?Vo(l,n.contents??fetch(n.contentUrl),n.gsafDecoderUrl,v,y.signal).catch(e=>{throw _||console.log(e),e}):null,S=x?x.then(e=>e.entity):db(l,n,v,()=>_),C=n.skyboxUrl&&fb(l,n.skyboxUrl).then(e=>{l.scene.envAtlas=e.resource}).catch(e=>{console.warn(`Failed to load skybox:`,e)}),w;n.collisionUrl&&(w=new URL(n.collisionUrl,location.href).pathname.split(`.`).pop()?.toLowerCase()===`glb`?bo.fromGlb(l,n.collisionUrl).catch(e=>(console.warn(`Failed to load mesh collision:`,e),null)):ko(n.collisionUrl).catch(e=>(console.warn(`Failed to load voxel data:`,e),null)));let T;if(h.settings.soundUrl){let e=new Audio(h.settings.soundUrl);e.crossOrigin=`anonymous`;let t=()=>{e&&e.play()};r.addEventListener(`click`,t,{capture:!0,once:!0}),T=()=>{r.removeEventListener(`click`,t,{capture:!0}),e.pause()}}let E=new ob(h,S,C,w,x);E.onDestroy(rs(a)),E.onDestroy(()=>m.destroy());let D={app:l,state:p,events:a,annotations:h.settings.annotations,captureFrame:e=>E.captureFrame(e),seek:e=>E.seek(e),frameScene:()=>E.frameScene(),resetCamera:()=>E.resetCamera(),toggleWalk:()=>E.toggleWalk(),selectAnnotation:e=>E.selectAnnotation(e),setMoveInput:(e,t)=>E.setMoveInput(e,t),requestFullscreen:()=>E.requestFullscreen(),exitFullscreen:()=>E.exitFullscreen(),startXR:e=>E.startXR(e),endXR:()=>E.endXR(),destroy:()=>E.destroy()},O=n.ui?qh(h,D,()=>E.picker,()=>E.cameraManager?.transitionProgress()??1):null;return E.onDestroy(()=>{_=!0,y.abort()}),E.onDestroy(g),O&&E.onDestroy(O),T&&E.onDestroy(T),D};console.log(`SuperSplat Viewer v${tu} | Engine v${st} (${it})`);var bb={settings:{version:2,tonemapping:`neutral`,highPrecisionRendering:!0,background:{color:[1,1,1]},postEffectSettings:{sharpness:{enabled:!1,amount:.5},bloom:{enabled:!0,intensity:.1,blurLevel:1},grading:{enabled:!0,brightness:1,contrast:1,saturation:1.1,tint:[1,1,1]},vignette:{enabled:!0,intensity:.5,inner:.3,outer:1.88,curvature:1},fringing:{enabled:!1,intensity:4}},animTracks:[{name:`animTrack`,duration:6,frameRate:30,loopMode:`pingpong`,interpolation:`spline`,smoothness:1,keyframes:{times:[0,90,180],values:{position:[-2.7365071773529053,-.570602297782898,-1.8901045322418213,-4.54594087600708,-.38141191005706787,-6.841612815856934,-3.4262733459472656,-.37242391705513,-12.386368751525879],target:[-2.285997320264056,-.574066659743855,-3.300063103420414,-3.066252593463437,-.41258478445815966,-6.86410480968325,-2.638698754248028,-.3352852352437239,-11.133651895837664],fov:[85,85,85]}}}],cameras:[{initial:{position:[-2.8490238189697266,-.30681493878364563,-1.8820308446884155],target:[-2.3203034883382,-.2879806676207069,-3.264439668922533],fov:85}}],annotations:[{position:[-.4324827070899584,-1.1356615558262035,-5.352859958159687],title:`6-Person Office Bench System`,text:``,extras:{},camera:{initial:{position:[-2.2909014225006104,-.6327518224716187,-6.878935813903809],target:[-1.063821250294442,-.7785310259698787,-6.064088128799655],fov:85}}},{position:[1.1870577758066334,-1.2140478639523282,.06964437653360278],title:`8-Person Conference Table`,text:``,extras:{},camera:{initial:{position:[-2.698869466781616,-.7564377784729004,-2.1411778926849365],target:[-1.5667378200804414,-.82848103010642,-1.1903667760348111],fov:85}}},{position:[1.9970835412267196,-.8033600527595,-10.693077551494174],title:`6-Person Office Bench System`,text:``,extras:{},camera:{initial:{position:[1.8311508893966675,-.5394223928451538,-6.283419609069824],target:[1.887405199081167,-.5492254865430951,-9.172446737881645],fov:85}}},{position:[.09792180086598856,-.17678632222835267,2.586294204317113],title:`Fito Wall`,text:``,extras:{},camera:{initial:{position:[-2.5200188159942627,-.7118004560470581,-2.3654165267944336],target:[-1.0462618929210763,-.7242954121367714,.12006608542043518],fov:85}}}],startMode:`animTrack`},contentUrl:`https://d28zzqy0iyovbz.cloudfront.net/a972d838/v1/lod-meta.json`,telemetry:{splatHash:`a972d838`,viewerSessionId:`65fc5a9e-7804-43d6-85a0-55d8838e5936`},posterUrl:`https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat/a972d838/v1/xl.webp`,skyboxUrl:`/s/skybox?id=a972d838`,collisionUrl:`https://d28zzqy0iyovbz.cloudfront.net/a972d838/v1/scene.voxel.json`},xb=[{title:`Espera de visitantes`,text:`Grupo de sillas claras visible a la izquierda del recorrido. Ancla de grupo, no posición individual de asiento.`,position:[-4.751476330788986,-.63474085001273,-16.002127587705036],camera:{initial:{position:[-3.4262733459472656,-.37242391705513,-12.386368751525879],target:[-3.4262733459472656,-.37242391705513,-17.38636875152588],fov:85}},extras:{entity_id:`WAITING-AREA`,kind:`WaitingArea`,source:`native-splat-depth-pick`,evidence:`docs/evidence/phase09/survey/rear-hall.jpg`,screen:[.3,.6],confidence:`visual-group-verified`,reservable:!1}},{title:`Booths de descanso`,text:`Grupo de booths curvos de madera y verde. No reservables; cantidad individual pendiente de inventario completo.`,position:[-3.426234714858262,-.9248632498038959,-19.5901388836479],camera:{initial:{position:[-3.4262733459472656,-.37242391705513,-12.386368751525879],target:[-3.4262733459472656,-.37242391705513,-17.38636875152588],fov:85}},extras:{entity_id:`REST-AREA`,kind:`Zone`,source:`native-splat-depth-pick`,evidence:`docs/evidence/phase09/survey/walk-2.jpg`,screen:[.5,.85],confidence:`visual-group-verified`,reservable:!1,individual_count_verified:!1}}],Sb={source:`Measured original voxel-walk camera trace in docs/evidence/phase09/survey/survey-authored.json; camera viewpoints only, not semantic resource anchors`,poses:[[-3.4262733459472656,-.3476232886314392,-12.386368751525879],[-3.4262733459472656,-.3029446601867676,-15.987741470336914],[-3.4262733459472656,-.355322927236557,-17.43784523010254],[-3,-.3787338137626648,-20.734716415405273],[-2.9178333282470703,-.39998164772987366,-23.549999237060547]]};document.querySelector(`#office-app`).innerHTML=`<header><a href="./">ENTITY</a><span>SYNTHETIC OFFICE / ARCHIVO ORIGINAL</span><b>argenzio · CC BY-NC 4.0</b></header><main><section class="tools"><span id="status" role="status">Cargando SSOG original…</span><button id="frame">Dollhouse</button><button id="reset">Interior</button><button id="walk">Caminar con colisiones</button></section><div id="scene"></div><section class="move"><button data-move="0,1">↑</button><button data-move="-1,0">←</button><button data-move="0,-1">↓</button><button data-move="1,0">→</button><span>Controles táctiles · geometría y voxels originales</span></section><section><h2>Inventario espacial</h2><div id="annotations"></div><pre id="selection"></pre><p>A/B y reunión conservan sus anotaciones originales. Espera y descanso se identificaron en la escena; los puntos aún no calibrados permanecen pendientes.</p><a href="https://superspl.at/scene/a972d838" target="_blank" rel="noopener">Abrir la publicación original ↗</a></section></main>`;var Cb=structuredClone(bb.settings);Cb.startMode=`orbit`,Cb.annotations.push(...structuredClone(xb));var wb=new URLSearchParams(location.search).get(`survey_pose`);if(wb!==null){let e=Number(wb),t=bb.settings.animTracks[0].keyframes.values;if(Number.isInteger(e)&&e>=0&&e<3){let n=t.position.slice(e*3,e*3+3);Cb.cameras=[{initial:{position:n,target:t.target.slice(e*3,e*3+3),fov:85}}];let r=new URLSearchParams(location.search).get(`survey_direction`);r===`hall`&&(Cb.cameras[0].initial.target=[n[0],n[1],n[2]-5]),r===`left`&&(Cb.cameras[0].initial.target=[n[0]-5,n[1],n[2]]),r===`back`&&(Cb.cameras[0].initial.target=[n[0],n[1],n[2]+5])}}var Tb=new URLSearchParams(location.search).get(`survey_route_pose`);if(Tb!==null){let e=Sb.poses[Number(Tb)];e&&(Cb.cameras=[{initial:{position:e,target:new URLSearchParams(location.search).get(`survey_direction`)===`down`?[e[0],e[1]-5,e[2]+1e-4]:new URLSearchParams(location.search).get(`survey_direction`)===`hall`?[e[0],e[1],e[2]-5]:[e[0]+5,e[1],e[2]],fov:85}}])}var $,Eb=bb.contentUrl,Db=bb.collisionUrl,Ob=document.querySelector(`#status`);function kb(e){window.dispatchEvent(new CustomEvent(`office-annotation-selected`,{detail:e})),document.querySelector(`#selection`).textContent=JSON.stringify({annotation_index:e,...Cb.annotations[e]},null,2)}Cb.annotations.forEach((e,t)=>{let n=document.createElement(`button`);n.textContent=e.title,n.onclick=()=>{$?.state.loaded&&$.selectAnnotation(t),kb(t)},document.querySelector(`#annotations`).append(n)});try{$=await yb({container:document.querySelector(`#scene`),settings:Cb,contentUrl:Eb,collisionUrl:Db,renderer:`webgl`,ui:!0,reticle:!0,budget:Math.max(.25,Math.min(4,Number(new URLSearchParams(location.search).get(`budget`))||1)),framesInFlight:1}),$.state.animationPaused=!0,$.events.on(`loaded:changed`,e=>{e&&(Ob.textContent=`SSOG original cargado · navegación oficial SuperSplat`,$.resetCamera())}),$.events.on(`selectedAnnotation:changed`,e=>{e!==null&&kb(e)}),$.events.on(`error:changed`,e=>{e&&(Ob.textContent=`Error al cargar recurso original: `+String(e))})}catch(e){Ob.textContent=`No se pudo cargar el recurso original: `+e.message}document.querySelector(`#frame`).onclick=()=>{$?.state.loaded&&$.frameScene()},document.querySelector(`#reset`).onclick=()=>{$?.state.loaded&&$.resetCamera()},document.querySelector(`#walk`).onclick=()=>{$?.state.loaded&&($.toggleWalk(),Ob.textContent=$.state.walkAllowed?`Caminar · colisiones voxelizadas originales activas`:`Colisiones aún no disponibles: no se declara navegación validada`)};for(let e of document.querySelectorAll(`[data-move]`)){let t=()=>{$?.state.loaded&&$.setMoveInput(0,0)};e.onpointerdown=t=>{t.preventDefault(),$?.state.loaded&&($.state.cameraMode=$.state.walkAllowed?`walk`:`fly`,$.setMoveInput(...e.dataset.move.split(`,`).map(Number)),e.setPointerCapture(t.pointerId))},e.onpointerup=t,e.onpointercancel=t,e.onlostpointercapture=t}if(window.officeDiagnostics=()=>({sceneUrl:Eb,collisionUrl:Db,loaded:$?.state.loaded||!1,walkAllowed:$?.state.walkAllowed||!1,annotations:$?.annotations||[],mode:$?.state.cameraMode,source:`original-public-SSOG`,substitute:!1}),window.addEventListener(`office-select-annotation`,e=>{$?.state.loaded&&$.selectAnnotation(e.detail)}),tr(()=>import(`./operations-CLi2QLU2.js`),__vite__mapDeps([0,1,2]),import.meta.url),new URLSearchParams(location.search).has(`survey`)){let e;$?.events.on(`picker:ready`,t=>{e=t}),window.officeSurvey={frame:()=>$.frameScene(),seek:e=>{$.state.animationPaused=!0,$.seek(e)},annotation:e=>$.selectAnnotation(e),camera:()=>{let e=$.app.root.findComponents(`camera`)[0];return{position:e.entity.getPosition().toArray(),rotation:e.entity.getRotation().toArray(),fov:e.fov}},pick:async(t,n)=>(await e?.pick(t,n))?.toArray()||null}}var{installVisuals:Ab}=await tr(async()=>{let{installVisuals:e}=await import(`./visuals-C7YvkBrD.js`);return{installVisuals:e}},__vite__mapDeps([3,4,5,6]),import.meta.url);$&&Ab($,bb);