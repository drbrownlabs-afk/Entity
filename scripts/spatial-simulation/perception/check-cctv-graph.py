"""Verify static sensor graph behavior on the real building, without actor data."""
import hashlib,json,sys
from pathlib import Path
import jsonschema
import numpy as np
from PIL import Image,ImageDraw
from scipy.sparse.csgraph import dijkstra
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'services/entity-edge'))
from entity_edge.spatial_graph import SpatialSensorGraph
folder=ROOT/'simulation/spatial-office/.runtime/cctv-graph-isolated';path=folder/'graph/cctv-c-spatial-graph.json'
doc=json.loads(path.read_text());schema=json.loads((ROOT/'packages/contracts/perception/v1/SensorSpatialGraph.json').read_text());jsonschema.validate(doc,schema)
graph=SpatialSensorGraph(doc);build=json.loads((folder/'evidence/build.json').read_text());assert build['isolated_no_workspace_or_evaluator_mount']
source=[-3.6,-1.55,-12.4];target=[-3.6,-1.55,-13.6]
opened=graph.transition(source,target,10,position_uncertainty_native=0)
closed=graph.transition(source,target,10,scenario='closed',position_uncertainty_native=0)
fast=graph.transition(source,target,.01,position_uncertainty_native=0)
assert opened['possible'] and not closed['possible'] and not fast['possible']
assert not graph.transition([100,0,100],target,100)['possible']
assert graph.transition(source,target,3600)['pause_time_upper_bound'] is None
hypothesis=graph.loss_hypothesis(source,30);assert hypothesis['observations_created']==0 and hypothesis['candidate_sensors']
negative=graph.negative_evidence(source,'C1-S1',100);assert negative['observations_created']==0 and not negative['identity_rejected'] and negative['uncalibrated_penalty']<=.15
for injection in [{'actor_id':'forbidden'},{'routes':[]},{'ground_truth':{} }]:
 try:jsonschema.validate(doc|injection,schema)
 except jsonschema.ValidationError:pass
 else:raise AssertionError('Privileged metadata accepted')

def deny_keys(value):
 if isinstance(value,dict):
  assert not set(value)&{'actor_id','routes','trajectory','animation','feet','observed_at','frame_index','ground_truth'}
  for item in value.values():deny_keys(item)
 elif isinstance(value,list):
  for item in value:deny_keys(item)
context=json.loads((ROOT/'simulation/spatial-office/.runtime/cctv-static-context.json').read_text());deny_keys(context);deny_keys(doc)
summary={}
for name,data in graph.scenarios.items():
 masks=data['masks'];count=len(graph.sensors);overlap=[];travel=[]
 for i in range(count):
  visible=np.flatnonzero((masks&(1<<i))!=0);distance=dijkstra(data['matrix'],indices=visible,min_only=True,directed=False) if len(visible) else np.full(len(masks),np.inf)
  overlap.append([int(np.sum(((masks&(1<<i))!=0)&((masks&(1<<j))!=0))) for j in range(count)])
  travel.append([round(float(np.min(distance[(masks&(1<<j))!=0])),5) if np.any((masks&(1<<j))!=0) and np.isfinite(distance[(masks&(1<<j))!=0]).any() else None for j in range(count)])
 sizes=np.bincount(data['labels']);summary[name]={'nodes':len(masks),'edges':len(doc['scenarios'][name]['edges']),'components':data['components'],'largest_component_cells':int(sizes.max()),'blind_cells':int(np.sum(masks==0)),'approximate_overlap_cells':overlap,'minimum_native_path_between_sensor_regions':travel}
# Static visualization only, not a path or a person visibility label.
image=Image.new('RGB',(1120,1000),'#101820');draw=ImageDraw.Draw(image);colors=['#45484f','#275a9c','#258fba','#26b6ae','#56ba73','#aad35d','#e4ca58','#ef9b49','#f26a43']
all_nodes=np.concatenate([d['nodes'] for d in graph.scenarios.values()]);xmin=float(all_nodes[:,0].min())-.5;zmin=float(all_nodes[:,2].min())-.5;scale=27
profile=json.loads((ROOT/'apps/spatial-simulation/public/perception/profiles/cctv-c.json').read_text())
for panel,(name,data) in enumerate(graph.scenarios.items()):
 left=20+panel*550;draw.text((left,12),name+' | approximate static visibility count',fill='white')
 for point,mask in zip(data['nodes'],data['masks']):
  x=left+(point[0]-xmin)*scale;y=44+(point[2]-zmin)*scale;draw.rectangle((x-2.5,y-2.5,x+2.5,y+2.5),fill=colors[int(mask).bit_count()])
 for camera in profile['cameras']:
  if camera['device_id']=='C' and camera['id']!='C-S1':continue
  x=left+(camera['position'][0]-xmin)*scale;y=44+(camera['position'][2]-zmin)*scale;draw.ellipse((x-4,y-4,x+4,y+4),fill='white');draw.text((x+6,y-6),camera['device_id'],fill='white')
 draw.text((left,925),f"{data['components']} walkable components; {int(np.sum(data['masks']==0))} approximate blind cells",fill='white')
draw.text((20,960),'Grey=0 sensors; blue=1; cyan/green=2-4; yellow/orange=5+. Door states are assumptions.',fill='white')
evidence=ROOT/'docs/spatial-simulation/evidence/p2-09/09.13';evidence.mkdir(parents=True,exist_ok=True);image.save(evidence/'static-coverage.jpg',quality=90)
report={'phase':'P2-09.13','gate_passed':True,'graph_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'strict_contract_passed':True,'privileged_metadata_rejected':True,'isolated_build_passed':True,'security_portal':{'open':opened,'closed':closed,'too_fast':fast},'outside_geometry_rejected':True,'unbounded_pause_preserved':True,'loss_hypothesis':hypothesis,'negative_evidence':negative,'sensors':graph.sensors,'statistics':summary,'limitations':doc['limitations'],'actor_route_created':False,'human_final_acceptance':False}
(evidence/'graph-checks.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps({k:v for k,v in report.items() if k!='statistics'}))
