"""Build P2 sensor graph from whitelisted static geometry and camera calibration only."""
import hashlib,itertools,json,os,sys,time
from pathlib import Path
import numpy as np
import jsonschema
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'services/entity-edge'))
from entity_edge.spatial_graph import SpatialSensorGraph

def digest(path):return hashlib.sha256(path.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
def ray_clear(origin,targets,boxes):
 result=np.ones(len(targets),dtype=bool)
 lo,hi=boxes[:,0,:],boxes[:,1,:]
 for start in range(0,len(targets),128):
  direction=targets[start:start+128]-origin
  direction=np.where(abs(direction)<1e-10,1e-10,direction)
  aa=(lo[None,:,:]-origin)/direction[:,None,:];bb=(hi[None,:,:]-origin)/direction[:,None,:]
  near=np.maximum(np.minimum(aa,bb).max(axis=2),.0001);far=np.minimum(np.maximum(aa,bb).min(axis=2),.9999)
  result[start:start+128]=~np.any(near<=far,axis=1)
 return result

def door_box(door):
 lo,hi=door['local_bounds'];angle=door['angle'];c,s=np.cos(angle),np.sin(angle);p=np.array(door['local_position']);hinge=np.array(door['hinge']);points=[]
 for corner in itertools.product(*zip(lo,hi)):
  x,y,z=np.array(corner)+p;points.append(hinge+[c*x+s*z,y,-s*x+c*z])
 return [np.min(points,axis=0),np.max(points,axis=0)]

def visibility(nodes,camera,boxes):
 origin=np.array(camera['position']);forward=np.array(camera['target'])-origin;forward/=np.linalg.norm(forward);right=np.cross(forward,[0,1,0]);right/=np.linalg.norm(right);up=np.cross(right,forward);fy=camera['K'][1][1];w,h=camera['resolution']
 def project(points):
  rel=points-origin;depth=rel@forward;u=w/2+fy*(rel@right)/np.maximum(depth,1e-9);v=h/2-fy*(rel@up)/np.maximum(depth,1e-9);return u,v,depth
 feet=nodes.copy();heads=nodes+[0,1.65,0];_,vf,df=project(feet);_,vh,dh=project(heads);height=abs(vf-vh)
 scale=(df>.035)&(dh>.035)&(height>=80);seen=np.zeros(len(nodes),dtype=bool)
 for anchor in [.55,.95,1.45]:
  targets=nodes+[0,anchor,0];u,v,depth=project(targets);candidate=np.flatnonzero(scale&(depth>.035)&(u>=0)&(u<w)&(v>=0)&(v<h))
  seen[candidate]|=ray_clear(origin,targets[candidate],boxes)
 return seen

def main():
 isolated=os.environ.get('P2_GRAPH_ISOLATED')=='1'
 if isolated:
  assert not Path('/mnt/c').exists() and not Path('/root').exists()
  try:Path('/repo/simulation/spatial-office/.runtime/cctv-probes-depth4-open/evaluator/probes.json').read_bytes()
  except (FileNotFoundError,PermissionError):pass
  else:raise RuntimeError('Evaluator unexpectedly accessible')
 gate=json.loads((ROOT/'docs/spatial-simulation/evidence/p2-09/09.12/gate.json').read_text());assert gate['technical_gate_passed']
 context_path=ROOT/'simulation/spatial-office/.runtime/cctv-static-context.json';profile_path=ROOT/'apps/spatial-simulation/public/perception/profiles/cctv-c.json'
 context=json.loads(context_path.read_text());profile=json.loads(profile_path.read_text());assert digest(profile_path)==gate['profile_file_sha256'];assert context['scene_sha256']==profile['scene_sha256']
 result={'schema_version':'1.0','profile_id':profile['profile_id'],'coordinate_frame':profile['coordinate_frame'],'metric_scale_verified':False,'grid_step_native':context['grid_step_native'],
  'speed_policy':{'maximum_native_units_per_second':1.4,'nominal_minimum_moving_speed':.2,'units':'native, not certified metres; pauses have no finite upper bound'},
  'sensors':[c['id'] for c in profile['cameras']],'scenarios':{},'provenance':{'static_context_sha256':digest(context_path),'scene_sha256':context['scene_sha256'],'profile_sha256':digest(profile_path),'method':'Existing CollisionWorld walkability; calibrated FOV and conservative opaque AABB rays at generic heights; no actor/evaluator inputs'},
  'limitations':['Native units and generic assumed body height1.65 are not surveyed physical measurements','Opaque AABBs are conservative; glazing/foliage and partial silhouettes remain uncertain','Visibility is an approximate static sensor prior, never a person observation','Door states are named assumptions, not live observations','Speed policy is configurable and uncalibrated; no arbitrary maximum pause duration']}
 statistics={};start=time.perf_counter()
 for name,scenario in context['scenarios'].items():
  nodes=np.array(scenario['nodes']);boxes=np.array([r['bounds'] for r in context['opaque_aabbs']]+[door_box(d) for d in scenario['doors']]);masks=np.zeros(len(nodes),dtype=np.uint16);counts={}
  for bit,camera in enumerate(profile['cameras']):
   visible=visibility(nodes,camera,boxes);masks[visible]|=1<<bit;counts[camera['id']]=int(visible.sum());print(name,camera['id'],int(visible.sum()),'approximate visible cells',flush=True)
  result['scenarios'][name]={'nodes':nodes.round(5).tolist(),'edges':[[a,b,round(distance,6)] for a,b,distance in scenario['edges']],'visibility_masks':masks.tolist(),'portal_assumptions':{d['id']:d['state_assumption'] for d in scenario['doors']}}
  statistics[name]={'nodes':len(nodes),'edges':len(scenario['edges']),'blind_cells':int((masks==0).sum()),'visible_cells_per_sensor':counts}
 jsonschema.validate(result,json.loads((ROOT/'packages/contracts/perception/v1/SensorSpatialGraph.json').read_text()))
 graph=SpatialSensorGraph(result)
 for name,data in graph.scenarios.items():statistics[name]['walkable_components']=data['components']
 output=ROOT/'simulation/spatial-office/perception/cctv-c-spatial-graph.json';output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(result,separators=(',',':')),encoding='utf-8',newline='\n')
 evidence=ROOT/'docs/spatial-simulation/evidence/p2-09/09.13';evidence.mkdir(parents=True,exist_ok=True)
 report={'phase':'P2-09.13','gate_passed':False,'graph_sha256':digest(output),'build_seconds':time.perf_counter()-start,'inputs':'Whitelisted static building geometry and sensor metadata only; no actor/route/GT','statistics':statistics,'tests_pending':True,'isolated_no_workspace_or_evaluator_mount':isolated}
 (evidence/'build.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps(report))
if __name__=='__main__':main()
