import * as pc from 'playcanvas';

export async function createAvatar(app,url){
 // SuperSplat uses AppBase with a deliberately small set of systems.
 // Reuse that application and register the official animation system once.
 if(!app.systems.anim)app.systems.add(new pc.AnimComponentSystem(app));
 const asset=await new Promise((resolve,reject)=>app.assets.loadFromUrl(url,'container',(error,value)=>error?reject(error):resolve(value)));
 const model=asset.resource.instantiateRenderEntity();
 const entity=new pc.Entity('Core spatial pose');entity.addChild(model);
 // Imported clips may animate their root translation. Keep the Core pose on a parent.
 model.addComponent('anim',{activate:true});
 const clips=asset.resource.animations.map(a=>({name:a.resource.name||a.name,track:a.resource}));
 model.anim.loadStateGraph({layers:[{name:'Base',weight:1,states:[{name:pc.ANIM_STATE_START},...clips.map(c=>({name:c.name,speed:1}))],transitions:[{from:pc.ANIM_STATE_START,to:clips[0].name}]}],parameters:{}});
 for(const clip of clips)model.anim.assignAnimation(clip.name,clip.track);
 return {entity,asset};
}

// Asset QA only: no replacement office, no fabricated spatial calibration.
export async function inspectAvatar(url){
 const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;
 const app=new pc.Application(canvas,{graphicsDeviceOptions:{antialias:false}});
 try{
  const {entity,asset}=await createAvatar(app,url);app.root.addChild(entity);entity.setPosition(10,20,30);
  entity.findComponent('anim').baseLayer.play('walk');app.update(.01);
  const bones=entity.findComponents('render').flatMap(r=>r.meshInstances.flatMap(m=>m.skinInstance?.bones||[]));
  const initial=bones.map(b=>b.getLocalRotation().clone());
  app.update(.3);
  const changed=bones.filter((b,i)=>!b.getLocalRotation().equals(initial[i])).length;
  return {root_pose_preserved:entity.getPosition().equals(new pc.Vec3(10,20,30)),clips:asset.resource.animations.map(a=>a.resource.name||a.name),bones:bones.length,animated_bones_changed:changed,mesh_instances:entity.findComponents('render').reduce((n,r)=>n+r.meshInstances.length,0),finite_transforms:bones.every(b=>[...b.getWorldTransform().data].every(Number.isFinite))};
 }finally{app.destroy();}
}
