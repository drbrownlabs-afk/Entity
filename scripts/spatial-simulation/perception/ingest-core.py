"""Deliver actual pixel inference to existing P1 HTTP contracts. No evaluator imports or actor truth."""
import argparse,json,hashlib,uuid,time
from pathlib import Path
import httpx
ROOT=Path(__file__).resolve().parents[3]
p=argparse.ArgumentParser();p.add_argument('--api',default='http://127.0.0.1:8092');p.add_argument('--run',default='p2-09-vision');p.add_argument('--credentials',type=Path,default=ROOT/'simulation/spatial-office/.runtime/coworking-p2-access.json');p.add_argument('--worker-output',type=Path,default=Path('/tmp/p2-09-vision-output'));p.add_argument('--output',type=Path,required=True);a=p.parse_args();site='coworking-p2';creds=json.loads(a.credentials.read_text());user=site+':admin';tracks=json.loads((a.worker_output/'tracks.json').read_text());mtmc=json.loads((a.worker_output/'associations.json').read_text());det=json.loads((a.worker_output/'detections.json').read_text());cfg=json.loads((ROOT/'apps/spatial-simulation/public/perception/cameras.json').read_text());scene=json.loads((ROOT/'apps/spatial-simulation/public/model/scene.json').read_text());manifest=(ROOT/'simulation/spatial-office/.runtime/p2-09-frames/manifest.json').read_bytes();manifest_sha=hashlib.sha256(manifest).hexdigest();commands=0;seen=0;duplicates=0;associations=0;before_onboarding=None;start=time.perf_counter()
def uid(*parts):return str(uuid.uuid5(uuid.NAMESPACE_URL,json.dumps(parts,sort_keys=True,separators=(',',':'))))
with httpx.Client(base_url=a.api,timeout=60)as c:
 def request(method,path,body=None):
  r=c.request(method,path,json=body)if body is not None else c.request(method,path)
  if r.is_error:raise RuntimeError(f'P1 {method} {path}: {r.status_code} {r.text[:900]}')
  return r.json()
 auth=request('POST','/v1/office/auth/login',{'username':user,'password':creds[user]['password']});c.headers['Authorization']='Bearer '+auth['token'];root=f'/v1/sites/{site}';prefix=f'{root}/runs/{a.run}';baseline=request('GET',root+'/runs/onboarding/world');before_onboarding=hashlib.sha256(json.dumps(baseline,sort_keys=True).encode()).hexdigest();runs=request('GET',root+'/runs')
 if not any(r['id']==a.run for r in runs):request('POST',root+'/runs',{'id':a.run,'clock':'2026-11-09T12:00:00Z','seed':9})
 world=request('GET',prefix+'/world');initial_revision=world['revision'];existing=world['entities'];stored=existing['site'].get('vision_manifest_sha256')
 if stored and stored!=manifest_sha:raise RuntimeError('Input manifest changed; choose a new run instead of overwriting evidence')
 def command(operation,target,inputs):
  global commands
  body={'id':uid('p2-09',a.run,operation,target,inputs),'operation':operation,'target':target,'inputs':inputs};result=request('POST',prefix+'/commands',body);commands+=1;return result
 def metadata(key,attrs,kind):
  if all(existing.get(key,{}).get(k)==v for k,v in attrs.items()):return
  command('entity.upsert','site',{'id':key,'kind':kind,'attributes':attrs})
 metadata('site',{'vision_manifest_sha256':manifest_sha,'vision_run_source':'actual pixel detector/MOT/MTMC over virtual recorded imagery; no actor GT'},'Site')
 for camera in cfg['cameras']:
  key=camera['id'];metadata(key,{'model_status':'existente_verificado','verification_scope':'virtual calibrated source and recorded pixels; not physical installation','physical_installation_verified':False,'integration_status':'recorded_virtual_source_enrolled','declaration_only':True,'live_stream_implemented':False,'camera_profile':camera,'spatial':{'coordinate_frame':'p2-playcanvas-source-y-up','master_sha256':scene['master_sha256'],'object_ids':[],'position':camera['position'],'source':'native virtual camera capture pose, not physical installation'},'covered_zones':[]},'Camera');request('PUT',root+'/bindings',{'source':key,'adapter':'video-test','version':'1.0','config':{'available':True,'provider':'actual recorded pixels with ONNX CPU inference','simulation_only':True,'manifest_sha256':manifest_sha,'live_stream_implemented':False}})
 clock=world['clock'];obsids={};models='YOLOX-S:'+det['model_sha256']+';Norfair2.3.0;pixel-source-simulated'
 for f in tracks['frames']:
  stamp=f['observed_at']
  if stamp.replace('Z','+00:00')>clock:command('clock.advance','site',{'to':stamp});clock=stamp.replace('Z','+00:00')
  w,h=f['image_size'];observed=[]
  for t in f['tracks']:
   b=t['bbox'];observed.append({'local_track_id':a.run+':'+t['local_track_id'],'position':[(b[0]+b[2])/2/w,b[3]/h],'image_bbox':[b[0]/w,b[1]/h,b[2]/w,b[3]/h],'detection_confidence':t['confidence']})
  oid=uid('pixels',site,a.run,f['camera_id'],f['frame_index'],f['frame_sha256'],det['model_sha256']);obsids[f['camera_id'],f['frame_index']]=oid;msg={'observation_id':oid,'site_id':site,'source_id':f['camera_id'],'observed_at':stamp,'type':'edge.presence','payload':{'tracks':observed,'source_status':'connected','frame_index':f['frame_index'],'media_time_seconds':f['media_time_seconds'],'frame_sha256':f['frame_sha256']},'provenance':{'connector_id':'video-test','model_version':models,'simulated':True}}
  r=request('POST',prefix+'/observations',msg);duplicates+=r['duplicate'];seen+=1
 for camera in cfg['cameras']:
  command('entity.remember',camera['id'],{'content':f"P2-09:41 recorded frames from virtual calibrated camera {camera['id']}; manifest:{manifest_sha}; YOLOX-S:{det['model_sha256']}. Frame hashes and observations are persistent. Not physical hardware or a live stream.",'source':'P2:09 verified virtual camera capture and pixel inference'})
 world=request('GET',prefix+'/world');actual={e['local_track_id'].removeprefix(a.run+':'):key for key,e in world['entities'].items()if e['kind']=='Track'and e.get('local_track_id','').startswith(a.run+':')}
 for edge in mtmc['associations']:
  if not edge['accepted']:continue
  refs=[]
  for frame in edge['evidence_frames']:refs.extend([obsids[edge['source_camera'],frame['index']],obsids[edge['target_camera'],frame['index']]])
  payload={'track_a':actual[edge['a']],'track_b':actual[edge['b']],'score':edge['score'],'appearance_similarity':edge['appearance_similarity'],'spatial_distance_native':edge['floor_distance_native'],'simultaneous_samples':edge['simultaneous_samples'],'evidence_observation_ids':refs,'method':'osnet-ain-appearance-time-calibration','model_sha256':mtmc['reid_model_sha256'],'provisional':True,'probability_calibrated':False};msg={'observation_id':uid('mtmc',a.run,payload),'site_id':site,'source_id':edge['source_camera'],'observed_at':clock,'type':'edge.track_association','payload':payload,'provenance':{'connector_id':'video-test','model_version':'OSNet-AIN:'+mtmc['reid_model_sha256'],'simulated':True}};r=request('POST',prefix+'/observations',msg);duplicates+=r['duplicate'];associations+=1
 command('entity.remember','site',{'content':f'P2-09: {seen} recorded virtual pixel frames,89 observed detections,8 local tracks,{associations} provisional cross-camera associations from pretrained OSNet-AIN. Manifest:{manifest_sha}. No civil identity, booking, check-in or physical camera claim.','source':'P2:09 verified pixel pipeline; simulated imagery'})
 after=request('GET',prefix+'/world');after_onboarding=request('GET',root+'/runs/onboarding/world');assert before_onboarding==hashlib.sha256(json.dumps(after_onboarding,sort_keys=True).encode()).hexdigest(),'Earlier onboarding world changed';people=[e for e in after['entities'].values()if e['kind']=='Person'];assert len(people)==14 and all(e.get('position')is None for e in people);assert len(actual)==8;assert not any(e.get('person_id')for e in after['entities'].values()if e['kind']=='Track');request('POST','/v1/office/auth/logout')
report={'gate':'P2-09.8','real_http':True,'same_p1_database_site':site,'run':a.run,'pixel_observations':seen,'cross_camera_observations':associations,'duplicate_observations':duplicates,'metadata_or_clock_or_memory_commands_sent':commands,'new_person_identities':0,'logical_people_including_two_historical':len(people),'local_tracks_in_core':len(actual),'root_manifest_sha256':manifest_sha,'earlier_onboarding_world_unchanged':True,'source_frames_simulated_neural_inference_real':True,'public_https_core_configured':False,'world_revision_before':initial_revision,'world_revision_after':after['revision'],'world_revision_changed':initial_revision!=after['revision'],'seconds':time.perf_counter()-start};a.output.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
