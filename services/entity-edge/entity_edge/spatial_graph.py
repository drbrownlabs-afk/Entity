"""Static sensor/topology graph. No simulator actor, routes or evaluation imports."""
import json
import math
from pathlib import Path
import numpy as np
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import connected_components, dijkstra

class SpatialSensorGraph:
 def __init__(self, document):
  if isinstance(document,(str,Path)):document=json.loads(Path(document).read_text())
  allowed={'schema_version','profile_id','coordinate_frame','metric_scale_verified','grid_step_native','speed_policy','sensors','scenarios','provenance','limitations'}
  if set(document)-allowed or document.get('schema_version')!='1.0':raise ValueError('Unsupported static graph metadata')
  self.document=document;self.sensors=document['sensors'];self.maximum_speed=float(document['speed_policy']['maximum_native_units_per_second']);self._cache={}
  if set(document['speed_policy'])-{'maximum_native_units_per_second','nominal_minimum_moving_speed','units'} or set(document['provenance'])-{'static_context_sha256','scene_sha256','profile_sha256','method'}:raise ValueError('Unexpected policy/provenance metadata')
  if not 0<self.maximum_speed<10:raise ValueError('Invalid native speed policy')
  if not 0<float(document['speed_policy']['nominal_minimum_moving_speed'])<=self.maximum_speed:raise ValueError('Invalid moving speed interval')
  if len(self.sensors)!=8 or len(set(self.sensors))!=8:raise ValueError('Eight independent sensor IDs required')
  self.scenarios={}
  for name,scenario in document['scenarios'].items():
   if set(scenario)-{'nodes','edges','visibility_masks','portal_assumptions'}:raise ValueError('Unexpected scenario metadata')
   nodes=np.asarray(scenario['nodes'],dtype=float);masks=np.asarray(scenario['visibility_masks'],dtype=np.uint16)
   if nodes.ndim!=2 or nodes.shape[1]!=3 or len(masks)!=len(nodes) or not np.isfinite(nodes).all() or any(not isinstance(m,int) or not 0<=m<=255 for m in scenario['visibility_masks']):raise ValueError('Invalid static cells')
   row=[];col=[];weights=[]
   for a,b,weight in scenario['edges']:
    a,b=int(a),int(b);weight=float(weight)
    if a==b or min(a,b)<0 or max(a,b)>=len(nodes) or not math.isfinite(weight) or weight<=0:raise ValueError('Invalid topology edge')
    if abs(weight-float(np.linalg.norm(nodes[a]-nodes[b])))>1e-5:raise ValueError('Edge length is not geometric')
    if weight>document['grid_step_native']*2.1:raise ValueError('Nonlocal topology edge')
    horizontal=np.abs(nodes[a,[0,2]]-nodes[b,[0,2]])
    if horizontal.max()>document['grid_step_native']+1e-5 or horizontal.max()<1e-8:raise ValueError('Edge must join neighboring floor cells')
    row.extend([a,b]);col.extend([b,a]);weights.extend([weight,weight])
   matrix=csr_matrix((weights,(row,col)),shape=(len(nodes),len(nodes)))
   components,labels=connected_components(matrix,directed=False)
   self.scenarios[name]={'nodes':nodes,'masks':masks,'matrix':matrix,'components':int(components),'labels':labels}
 def locate(self,point,scenario='security-open',tolerance=.35):
  point=np.asarray(point,dtype=float)
  if point.shape!=(3,) or not np.isfinite(point).all():raise ValueError('A finite estimated 3D point is required')
  data=self.scenarios[scenario];distance=np.linalg.norm(data['nodes']-point,axis=1);index=int(np.argmin(distance))
  if distance[index]>tolerance:return None
  return index
 def distances(self,index,scenario='security-open'):
  key=(scenario,int(index))
  if key not in self._cache:
   if len(self._cache)>=64:self._cache.pop(next(iter(self._cache)))
   self._cache[key]=dijkstra(self.scenarios[scenario]['matrix'],directed=False,indices=int(index),return_predecessors=True)
  return self._cache[key][0]
 def path_indices(self,source,target,scenario='security-open'):
  distance=self.distances(source,scenario)[target]
  if not math.isfinite(distance):return None
  predecessors=self._cache[(scenario,int(source))][1];path=[int(target)]
  while path[-1]!=source:
   previous=int(predecessors[path[-1]])
   if previous<0 or len(path)>len(predecessors):raise RuntimeError('Invalid geometric predecessor chain')
   path.append(previous)
  return list(reversed(path))
 def transition(self,source,target,elapsed_seconds,scenario='security-open',position_uncertainty_native=.35):
  if not math.isfinite(elapsed_seconds) or elapsed_seconds<0 or not 0<=position_uncertainty_native<=2:raise ValueError('Invalid time/uncertainty')
  a=self.locate(source,scenario,position_uncertainty_native);b=self.locate(target,scenario,position_uncertainty_native)
  if a is None or b is None:return {'possible':False,'reason':'outside calibrated walkable cells','evidence':'geometric estimate, not an observation'}
  distance=float(self.distances(a,scenario)[b])
  if not math.isfinite(distance):return {'possible':False,'reason':'disconnected by static geometry or assumed closed portals','evidence':'scenario assumption, not observed door state'}
  minimum=max(0.,distance-2*position_uncertainty_native)/self.maximum_speed
  possible=elapsed_seconds+1e-6>=minimum
  path=self.path_indices(a,b,scenario);points=self.scenarios[scenario]['nodes'];delta=points[path[1]]-points[path[0]] if len(path)>1 else np.zeros(3);length=float(np.linalg.norm(delta));direction=(delta/length).tolist() if length else [0.,0.,0.]
  return {'possible':possible,'reason':'reachable within native speed bound' if possible else 'would exceed native speed bound','path_length_native':distance,'minimum_travel_seconds':minimum,'nominal_moving_time_seconds':[distance/self.maximum_speed,distance/self.document['speed_policy']['nominal_minimum_moving_speed']],'pause_time_upper_bound':None,'possible_first_leg_direction':direction,'direction_is_observed':False,'probability_calibrated':False,'scenario_assumption':scenario}
 def loss_hypothesis(self,last_estimate,elapsed_seconds,scenario='security-open'):
  if not math.isfinite(elapsed_seconds) or elapsed_seconds<0:raise ValueError('Invalid loss duration')
  index=self.locate(last_estimate,scenario)
  if index is None:return {'kind':'hypothesis only','observations_created':0,'candidate_sensors':[],'reachable_cells':0}
  data=self.scenarios[scenario];reachable=self.distances(index,scenario)<=max(0.,elapsed_seconds)*self.maximum_speed+.35
  mask=int(np.bitwise_or.reduce(data['masks'][reachable],initial=0))
  return {'kind':'hypothesis only','observations_created':0,'candidate_sensors':[s for i,s in enumerate(self.sensors) if mask&(1<<i)],'reachable_cells':int(reachable.sum()),'blind_reachable_cells':int(np.sum(reachable&(data['masks']==0))),'probability_calibrated':False,'door_state_is_assumed':True}
 def negative_evidence(self,estimated_point,sensor_id,missed_frames,scenario='security-open',geometry_uncertain=True):
  if sensor_id not in self.sensors or missed_frames<0:raise ValueError('Invalid missing-observation context')
  index=self.locate(estimated_point,scenario);bit=1<<self.sensors.index(sensor_id)
  expected=index is not None and bool(int(self.scenarios[scenario]['masks'][index])&bit)
  penalty=min(.3,missed_frames*.03)*(0.5 if geometry_uncertain else 1) if expected else 0.
  return {'expected_by_approximate_geometry':expected,'uncalibrated_penalty':penalty,'identity_rejected':False,'observations_created':0,'reason':'missing detection is weak evidence; never invent an observation or identity loss'}
