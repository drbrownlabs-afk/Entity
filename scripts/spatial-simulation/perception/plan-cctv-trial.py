"""Simulator-only one-actor route, planned AFTER the checked static graph."""
import argparse,hashlib,json,math,sys
from pathlib import Path
import numpy as np
from scipy.sparse.csgraph import dijkstra
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'services/entity-edge'))
from entity_edge.spatial_graph import SpatialSensorGraph
p=argparse.ArgumentParser();p.add_argument('--run',required=True);p.add_argument('--variant',type=int,default=0,choices=range(5));a=p.parse_args();assert a.run.replace('-','').replace('_','').isalnum()
checks=json.loads((ROOT/'docs/spatial-simulation/evidence/p2-09/09.13/graph-checks.json').read_text());assert checks['gate_passed']
path=ROOT/'simulation/spatial-office/perception/cctv-c-spatial-graph.json';assert hashlib.sha256(path.read_bytes()).hexdigest()==checks['graph_sha256'];graph=SpatialSensorGraph(path);data=graph.scenarios['security-open']
# Locations are simulator stimuli, never exported in a frame manifest or mounted
# in ENTITY. The graph was already built/checked without this route or actor.
waypoints=[('entry',[-2.2,-1.85,.8],2),('lounge',[-10,-1.55,-2.1],2),('waiting',[-4.8,-1.55,-9],2),('reception',[-4.7,-1.55,-16],2),('central-crossing',[-2.5,-1.85,-14.8],1),('cafeteria',[-8,-1.55,-22.3],2),('dining',[-3.2,-1.55,-25.1],2),('return',[-2.2,-1.85,.8],2)]
assert not (ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{a.run}/frames/manifest.json').exists(),'Never overwrite a captured trial'
entry=graph.locate(waypoints[0][1],tolerance=.55);bar=graph.locate(waypoints[5][1],tolerance=.55)
component=data['labels']==data['labels'][entry];visible=np.flatnonzero(component&(data['masks']!=0));depth=dijkstra(data['matrix'],indices=visible,min_only=True,directed=False);from_bar=graph.distances(bar)
candidates=np.flatnonzero(component&(data['masks']==0)&(from_bar<=8))
assert len(candidates),'A reachable blind sector is required'
blind=int(max(candidates,key=lambda i:depth[i]-.02*from_bar[i]));waypoints.insert(6,('blind-sector',data['nodes'][blind].tolist(),4))
indices=[]
for name,point,pause in waypoints:
 index=graph.locate(point,tolerance=.55)
 if index is None:raise RuntimeError('No static walkable placement for '+name)
 indices.append(index)
speed=1.+.05*a.variant;fps=2;timeline=[];distance=0.;clock=0.;yaw=0.
def append(point,kind):timeline.append({'time_seconds':round(clock,6),'feet':np.asarray(point).round(6).tolist(),'yaw_degrees':float(yaw),'kind':kind})
append(data['nodes'][indices[0]],'initial')
for waypoint,(name,point,pause) in enumerate(waypoints):
 if waypoint:
  route=graph.path_indices(indices[waypoint-1],indices[waypoint]);assert route
  for source,target in zip(route,route[1:]):
   first,last=data['nodes'][source],data['nodes'][target];length=float(np.linalg.norm(last-first));clock+=length/speed;distance+=length;yaw=math.degrees(math.atan2(last[0]-first[0],last[2]-first[2]));append(last,'move')
 # Turn while paused, then leave/reappear under actual building occlusion.
 clock+=pause/2;yaw+=90;append(data['nodes'][indices[waypoint]],'turn-pause');clock+=pause/2;append(data['nodes'][indices[waypoint]],'pause')
frames=[];cursor=0
for index in range(math.ceil(clock*fps)+1):
 time_seconds=min(index/fps,clock)
 while cursor+1<len(timeline) and timeline[cursor+1]['time_seconds']<time_seconds:cursor+=1
 first,last=timeline[cursor],timeline[min(cursor+1,len(timeline)-1)];duration=last['time_seconds']-first['time_seconds'];fraction=min(1,max(0,(time_seconds-first['time_seconds'])/duration)) if duration else 0
 feet=np.array(first['feet'])+(np.array(last['feet'])-first['feet'])*fraction
 frames.append({'frame_index':index,'media_time_seconds':time_seconds,'feet':feet.round(6).tolist(),'yaw_degrees':last['yaw_degrees'] if last['kind']=='move' else first['yaw_degrees'],'phase':last['kind']})
assert all(np.linalg.norm(np.array(b['feet'])-a['feet'])<=speed/fps+.0001 for a,b in zip(frames,frames[1:]))
seen=0
for frame in frames:
 index=graph.locate(frame['feet']);assert index is not None;seen|=int(data['masks'][index])
assert seen==255,'Route must challenge all eight approximate sensor regions'
output=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{a.run}/evaluator';output.mkdir(parents=True,exist_ok=True)
plan={'run':a.run,'variant':a.variant,'simulator_only':True,'internal_actor_id':'private-fixture-'+a.run,'graph_sha256':checks['graph_sha256'],'door_scenario':'security-open; other doors closed','speed_native_per_second':speed,'capture_fps':fps,'duration_seconds':clock,'path_length_native':distance,'actors':1,'frames':frames,'waypoints':[{'name':name,'requested':point,'static_cell':index,'pause_seconds':pause} for (name,point,pause),index in zip(waypoints,indices)]}
(output/'plan.json').write_text(json.dumps(plan,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps({k:v for k,v in plan.items() if k not in ['internal_actor_id','frames','waypoints']}))
