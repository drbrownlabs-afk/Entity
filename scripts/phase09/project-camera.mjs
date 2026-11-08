// Projection from the official renderer math, used by the SYNTHETIC source adapter.
// This is a generated observation, not a claim of image detection or physical identity.
import {Mat4,Vec3,Vec4} from '../../apps/web/node_modules/playcanvas/build/playcanvas/src/index.js';
let text='';for await(const chunk of process.stdin)text+=chunk;
const {camera,position}=JSON.parse(text);
const view=new Mat4().setLookAt(new Vec3(...camera.position),new Vec3(...camera.target),Vec3.UP).invert();
const matrix=new Mat4().setPerspective(camera.fov,16/9,.01,100).mul(view);
const p=matrix.transformVec4(new Vec4(...position,1));
if(p.w<=0)throw Error('Synthetic point is behind the declared camera');
console.log(JSON.stringify([(p.x/p.w+1)/2,(1-p.y/p.w)/2]));
