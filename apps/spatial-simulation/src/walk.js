// PathFinding.js (MIT) A*: retain the exported floor, capsule clearance and live door colliders.
import PF from 'pathfinding';
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[2]-b[2]);
export class WalkNavigator {
 constructor(collision){
  this.world=collision;this.path=[];this.destination=null;this.speed=0;
  const floor=collision.data.collision.floor_nodes;
  this.minX=Math.min(...floor.map(p=>p[0]));this.minZ=Math.min(...floor.map(p=>p[1]));
  this.width=Math.max(...floor.map(p=>p[0]))-this.minX+1;this.height=Math.max(...floor.map(p=>p[1]))-this.minZ+1;
  const matrix=Array.from({length:this.height},()=>Array(this.width).fill(1));
  this.cells=[];
  for(const [x,z,y]of floor)if(!collision.blockedStatic(x/10,y,z/10)){matrix[z-this.minZ][x-this.minX]=0;this.cells.push([x-this.minX,z-this.minZ,[x/10,y,z/10]]);}
  this.base=new PF.Grid(matrix);this.finder=new PF.AStarFinder({diagonalMovement:PF.DiagonalMovement.OnlyWhenNoObstacles});
 }
 point(x,z){const wx=(x+this.minX)/10,wz=(z+this.minZ)/10;return [wx,this.world.floorAt(wx,wz),wz];}
 cell(p){return [Math.round(p[0]*10)-this.minX,Math.round(p[2]*10)-this.minZ];}
 clear(a,b){let y=a[1];const n=Math.max(1,Math.ceil(distance(a,b)/.025));for(let i=1;i<=n;i++){const t=i/n,p=[a[0]+(b[0]-a[0])*t,y,a[2]+(b[2]-a[2])*t];if(!this.world.canStand(p,y))return false;y=this.world.floorAt(p[0],p[2]);}return true;}
 route(from,to){
  if(!to?.every(Number.isFinite)||!this.world.canStand(to)||!this.world.canStand(from))return null;
  const grid=this.base.clone();
  for(const [x,z,p]of this.cells)if(this.world.blockedDoor(...p))grid.setWalkableAt(x,z,false);
  const [sx,sz]=this.cell(from),[tx,tz]=this.cell(to);
  if(!grid.isWalkableAt(sx,sz)||!grid.isWalkableAt(tx,tz))return null;
  const neighbors=grid.getNeighbors.bind(grid);
  grid.getNeighbors=(node,diagonal)=>neighbors(node,diagonal).filter(n=>this.clear(this.point(node.x,node.y),this.point(n.x,n.y)));
  const nodes=this.finder.findPath(sx,sz,tx,tz,grid);if(!nodes.length)return null;
  const raw=[from,...nodes.map(([x,z])=>this.point(x,z)),[to[0],this.world.floorAt(to[0],to[2]),to[2]]];
  const path=[];let anchor=0;
  while(anchor<raw.length-1){let next=anchor+1;while(next+1<raw.length&&this.clear(raw[anchor],raw[next+1]))next++;if(!this.clear(raw[anchor],raw[next]))return null;path.push(raw[next]);anchor=next;}
  return path.filter(p=>distance(from,p)>.005);
 }
 go(from,to){const route=this.route(from,to);if(!route){this.cancel();return false;}this.path=route;this.destination=[...to];if(!route.length)this.cancel();return true;}
 cancel(){this.path=[];this.destination=null;this.speed=0;}
 step(position,dt){
  if(!this.path.length)return {position,moving:false};
  const remaining=distance(position,this.path[0]);this.speed=Math.min(1.4,this.speed+3*dt,Math.sqrt(2*2.5*(this.path.length===1?remaining:100)));
  let budget=this.speed*Math.min(Math.max(dt,0),.05),p=[...position];
  while(budget>1e-6&&this.path.length){const target=this.path[0],d=distance(p,target);if(d<.005){this.path.shift();continue;}const length=Math.min(budget,d),next=[p[0]+(target[0]-p[0])*length/d,p[1],p[2]+(target[2]-p[2])*length/d];
   if(!this.clear(p,next)){const goal=this.destination;if(!this.go(p,goal))return {position:p,moving:false,blocked:true};return {position:p,moving:true,replanned:true};}
   next[1]=this.world.floorAt(next[0],next[2]);p=next;budget-=length;if(length===d)this.path.shift();
  }
  if(!this.path.length)this.cancel();return {position:p,moving:!!this.path.length};
 }
}
// Physical CSS pixels: touch jitter and multi-touch never become accidental destinations.
export class ClickGesture {
 constructor(){this.pointers=new Set();this.drag=null;}
 down(e){this.pointers.add(e.pointerId);if(this.pointers.size>1){if(this.drag)this.drag.cancelled=true;return;}this.drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false,cancelled:false,button:e.button??0};}
 move(e){const d=this.drag;if(!d||d.id!==e.pointerId||this.pointers.size!==1)return null;const dx=e.clientX-d.lastX,dy=e.clientY-d.lastY;d.lastX=e.clientX;d.lastY=e.clientY;d.moved ||= Math.hypot(e.clientX-d.x,e.clientY-d.y)>7;return {dx,dy,dragging:d.moved};}
 up(e){const d=this.drag;this.pointers.delete(e.pointerId);if(!d||d.id!==e.pointerId)return false;this.drag=null;return !d.moved&&!d.cancelled&&d.button===0&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<=7;}
 cancel(e){this.pointers.delete(e.pointerId);if(this.drag)this.drag.cancelled=true;if(this.drag?.id===e.pointerId)this.drag=null;}
}
// Explicit touch activation avoids relying on delayed compatibility mouse clicks inside
// scrollable fichas. Preserve native keyboard/mouse clicks and suppress only the duplicate
// trusted touch click after an already handled pointer tap. Scrolling/multitouch cancels taps.
export function installTouchButtons(root=document){
 const gesture=new ClickGesture();let start=null,lastTouch=-Infinity;
 root.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;gesture.down(e);start=e.target.closest?.('button')||null;},true);
 root.addEventListener('pointermove',e=>{if(e.pointerType==='touch')gesture.move(e);},true);
 root.addEventListener('pointercancel',e=>{if(e.pointerType==='touch')gesture.cancel(e);},true);
 root.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')return;const tap=gesture.up(e),button=e.target.closest?.('button');if(tap&&button&&button===start&&!button.disabled){e.preventDefault();lastTouch=performance.now();button.click();}start=null;},true);
 root.addEventListener('click',e=>{if(e.isTrusted&&e.pointerType==='touch'&&e.target.closest?.('button')&&performance.now()-lastTouch<700){e.preventDefault();e.stopImmediatePropagation();}},true);
}
