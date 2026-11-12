"""Import real pixel inference via existing P1 HTTP API, with deterministic replay.

No evaluator, scene actors, routes or ground truth are inputs. Credentials stay
local. This script never creates another database, site, Person or operational
occupancy assertion. New run keeps historical worlds unchanged.
"""
import argparse
import collections
import hashlib
import json
import resource
import statistics
import time
import uuid
from datetime import datetime, timedelta
from pathlib import Path
import httpx

ROOT=Path(__file__).resolve().parents[3]


def uid(*parts):return str(uuid.uuid5(uuid.NAMESPACE_URL,json.dumps(parts,sort_keys=True,separators=(',',':'))))
def digest(value):return hashlib.sha256(json.dumps(value,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def percentile(values,p):return sorted(values)[int(p*(len(values)-1))] if values else None


def execute(api,run,output,replay=False,experiment='core17'):
    started=time.perf_counter();site='coworking-p2';root=f'/v1/sites/{site}';prefix=f'{root}/runs/{run}'
    private=ROOT/'simulation/spatial-office/.runtime';worker=private/'cctv-trial-trial-a/output'/experiment
    tracks=json.loads((worker/'tracks-tuned.json').read_text());global_result=json.loads((worker/'global-tracks.json').read_text())
    detections=json.loads((worker/'detections.json').read_text())
    profile_path=ROOT/'apps/spatial-simulation/public/perception/profiles/cctv-c.json'
    profile=json.loads(profile_path.read_text());profile_sha=hashlib.sha256(profile_path.read_bytes()).hexdigest()
    association_sha=hashlib.sha256((worker/'global-tracks.json').read_bytes()).hexdigest()
    manifest_sha=hashlib.sha256((private/'cctv-trial-trial-a/frames/manifest.json').read_bytes()).hexdigest()
    frames=sorted(tracks['frames'],key=lambda f:(f['media_time_seconds'],f['camera_id']))
    latest=max(max(f['observed_at'] for f in frames),max(t['association_confirmation_evidence_at'] for f in frames for t in f['tracks']))
    inference_at=datetime.fromisoformat(latest.replace('Z','+00:00')).isoformat()
    clock=(datetime.fromisoformat(inference_at)+timedelta(seconds=1)).isoformat()
    credentials=json.loads((private/'coworking-p2-access.json').read_text());username=site+':admin'
    latencies=collections.defaultdict(list);observation_refs={};bytrack=collections.defaultdict(list);duplicates=0
    with httpx.Client(base_url=api,timeout=120) as client:
        def request(method,path,body=None,category='other'):
            before=time.perf_counter();response=client.request(method,path,json=body) if body is not None else client.request(method,path)
            latencies[category].append((time.perf_counter()-before)*1000)
            if response.is_error:raise RuntimeError(f'P1 {method} {path} returned {response.status_code}; response body withheld')
            return response.json()
        auth=request('POST','/v1/office/auth/login',{'username':username,'password':credentials[username]['password']})
        client.headers['Authorization']='Bearer '+auth['token']
        before_worlds={r['id']:digest(request('GET',root+'/runs/'+r['id']+'/world')) for r in request('GET',root+'/runs') if r['id']!=run}
        runs=request('GET',root+'/runs')
        exists=any(r['id']==run for r in runs)
        if replay and not exists:raise RuntimeError('Replay requires an existing run')
        if exists and not replay:raise RuntimeError('Cold measurement requires a new run; historical runs are preserved')
        if not exists:request('POST',root+'/runs',{'id':run,'clock':min(f['observed_at'] for f in frames),'seed':17})
        before=request('GET',prefix+'/world');before_digest=digest(before)
        baseline_people={k:digest(v) for k,v in before['entities'].items() if v['kind']=='Person'}
        def command(operation,target,inputs):
            return request('POST',prefix+'/commands',{'id':uid('cctv17',run,operation,target,inputs),'operation':operation,'target':target,'inputs':inputs})
        if not replay:
            if before['entities']['site'].get('cctv_manifest_sha256') not in [None,manifest_sha]:raise RuntimeError('Run manifest mismatch')
            command('entity.upsert','site',{'id':'site','kind':'Site','attributes':{'cctv_manifest_sha256':manifest_sha,'cctv_profile_sha256':profile_sha,
                'cctv_association_output_sha256':association_sha,'vision_semantics':'pixel observations; anonymous inference; no simulator truth'}})
            for camera in profile['cameras']:
                command('entity.upsert','site',{'id':camera['id'],'kind':'Camera','attributes':{'camera_profile':camera,'covered_zones':[],
                    'physical_installation_verified':False,'live_stream_implemented':False,'sensor_id':camera['sensor_id'],'device_id':camera['device_id'],
                    'channel_id':camera['channel_id'],'stream_id':camera['stream_id'],'calibration_sha256':profile_sha}})
                request('PUT',root+'/bindings',{'source':camera['id'],'adapter':'video-test','version':'1.0','config':{'available':True,'simulation_only':True,'manifest_sha256':manifest_sha}})
            command('clock.advance','site',{'to':clock})
        elif before['entities']['site'].get('cctv_association_output_sha256')!=association_sha:
            raise RuntimeError('Replay source output changed; original run evidence must not be overwritten')
        # Only frame-backed observations; empty frames mean no visual detection,
        # never building departure, civil identity change or free-seat assertion.
        for frame in frames:
            width,height=frame['image_size'];observed=[]
            for track in frame['tracks']:
                bbox=[v/(width if i%2==0 else height) for i,v in enumerate(track['bbox'])]
                if not all(0<=v<=1 for v in bbox):raise ValueError('Image box outside calibrated frame')
                # Filter estimates can leave the image. Do not clamp a prediction
                # into an apparent observation: use the fresh associated box.
                anchor=[(bbox[0]+bbox[2])/2,(bbox[1]+bbox[3])/2 if track['position_anchor']=='bbox-center' else bbox[3]]
                local=run+':'+track['local_track_id']
                observed.append({'local_track_id':local,'position':anchor,'image_bbox':bbox,'detection_confidence':track['confidence'],
                                 'association_confirmed_at':track['association_confirmation_evidence_at']})
            oid=uid('cctv-pixels',site,run,frame['camera_id'],frame['frame_index'],frame['frame_sha256'],detections['model_sha256'])
            observation_refs[frame['camera_id'],frame['frame_index']]=oid
            for track in frame['tracks']:bytrack[track['local_track_id']].append(oid)
            message={'observation_id':oid,'site_id':site,'source_id':frame['camera_id'],'observed_at':frame['observed_at'],'type':'edge.presence',
                'payload':{'tracks':observed,'source_status':'connected','frame_index':frame['frame_index'],'media_time_seconds':frame['media_time_seconds'],'frame_sha256':frame['frame_sha256']},
                'provenance':{'connector_id':'video-test','model_version':'YOLOX-S:'+detections['model_sha256']+';Norfair2.3.0','simulated':True}}
            duplicates+=request('POST',prefix+'/observations',message,'pixel_ingress')['duplicate']
        world=request('GET',prefix+'/world')
        local_ids={e['local_track_id'].removeprefix(run+':'):key for key,e in world['entities'].items() if e['kind']=='Track' and e.get('camera_id') and e.get('local_track_id','').startswith(run+':')}
        global_ids=[]
        for group in global_result['groups']:
            gid=run+':'+group['id'];global_ids.append(gid)
            payload={'global_track_id':gid,'members':[{'track_id':local_ids[k],'evidence_observation_ids':bytrack[k]} for k in group['local_tracks']],
                'method':'osnet-ain-static-graph-constrained-mtmc','model_sha256':global_result['model_sha256'],'graph_sha256':global_result['graph_sha256'],
                'calibration_sha256':profile_sha,'association_output_sha256':association_sha,'execution_mode':'offline-full-corpus'}
            message={'observation_id':uid('cctv-global',site,run,payload),'site_id':site,'source_id':group['sensors'][0],
                'observed_at':inference_at,'type':'edge.global_track_association','payload':payload,
                'provenance':{'connector_id':'video-test','model_version':'OSNet-AIN:'+global_result['model_sha256'],'simulated':True}}
            duplicates+=request('POST',prefix+'/observations',message,'global_ingress')['duplicate']
        after=request('GET',prefix+'/world');memories={};graphs={}
        history_at=(datetime.fromisoformat(min(f['observed_at'] for f in frames).replace('Z','+00:00'))+timedelta(seconds=5)).isoformat()
        history=request('GET',prefix+'/world?at='+history_at.replace('+','%2B'))
        assert all(history['entities'].get(cam['id'],{}).get('kind')=='Camera' for cam in profile['cameras'])
        assert not any(x.get('track_scope')=='global' for x in history['entities'].values()),'Global inference leaked into earlier historical world'
        for gid in global_ids:
            memories[gid]=request('POST',prefix+'/queries',{'kind':'memories','entity_id':gid})['result']
            graph=request('POST',prefix+'/queries',{'kind':'graph','entity_id':gid})['result'];graphs[gid]={'nodes':len(graph['nodes']),'edges':len(graph['edges'])}
            location=request('POST',prefix+'/queries',{'kind':'location','entity_id':gid})['result']
            assert location['status']=='unknown' and location['zone_id'] is None
            assert after['entities'][gid]['civil_identity_verified'] is False and after['entities'][gid]['position_status']=='unknown'
            assert len(memories[gid])==1
        for key in baseline_people:assert digest(after['entities'][key])==baseline_people[key]
        for old,checksum in before_worlds.items():assert digest(request('GET',root+'/runs/'+old+'/world'))==checksum,'Historical world changed'
        if replay:assert digest(after)==before_digest and duplicates==len(frames)+len(global_ids),'Replay changed world or produced new observation effects'
        # Check event provenance through actual HTTP, not private DB shortcuts.
        event=request('GET',prefix+'/events?entity_id='+global_ids[0]+'&limit=100')
        request('POST','/v1/office/auth/logout')
    report={'phase':'P2-09.17','run':run,'real_http':True,'same_existing_site':site,'replay':replay,
        'frame_observations':len(frames),'local_observations':sum(len(f['tracks']) for f in frames),'global_associations':len(global_ids),
        'duplicate_observations':duplicates,'local_tracks_in_core':len(local_ids),'global_tracks_in_core':len(global_ids),
        'new_civil_people':0,'prior_people_unchanged':True,'historical_worlds_unchanged':True,
        'world_revision_before':before['revision'],'world_revision_after':after['revision'],'world_unchanged':digest(after)==before_digest,
        'world_sha256':digest(after),'memory_sha256':digest(memories),'global_memory_count':sum(map(len,memories.values())),
        'global_graphs':graphs,'global_event_count':len(event),'global_location_status':'unknown',
        'historical_sources_available_before_pixels':True,'global_inference_absent_before_available_at':True,
        'core_image_position_source':'fresh associated bbox anchor; filtered MOT estimate is not clipped into an observation',
        'experiment':experiment,
        'manifest_sha256':manifest_sha,'association_output_sha256':association_sha,
        'http_latency_ms':{k:{'requests':len(v),'p50':statistics.median(v),'p95':percentile(v,.95)} for k,v in latencies.items()},
        'seconds':time.perf_counter()-started,'ingester_peak_rss_kib':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
        'semantics':'batch historical pixel observations and later inference; not live occupancy, civil identity or confirmed world trajectory'}
    output.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
    return report


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--api',default='http://127.0.0.1:8095');parser.add_argument('--run',default='p2-09-cctv-trial-a')
    parser.add_argument('--output',type=Path,required=True);parser.add_argument('--replay',action='store_true')
    parser.add_argument('--experiment',default='core17',choices=['core17','tiles025']);args=parser.parse_args()
    execute(args.api,args.run,args.output,args.replay,args.experiment)
