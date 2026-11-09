"""Per-camera MOT adapter reusing the existing Norfair TemporalTracker; observed tracks only."""
import argparse,json,collections,time,resource
from pathlib import Path
from entity_edge.pipeline import TemporalTracker
import numpy as np

def main():
 p=argparse.ArgumentParser();p.add_argument('--input',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();d=json.loads(a.input.read_text());trackers={};rows=[];stats=collections.defaultdict(lambda:{'observed_frames':0,'local_ids':set(),'missed_frames':0,'recoveries':0,'prior':set(),'gap':False});start=time.perf_counter()
 for f in d['frames']:
  cam=f['camera_id'];tracker=trackers.setdefault(cam,TemporalTracker(hit_counter_max=6));w,h=f['image_size'];points=[[(x['bbox'][0]+x['bbox'][2])/2/w,x['bbox'][3]/h]for x in f['detections']];observed=tracker.update(points);s=stats[cam];entries=[]
  for tid,point in observed:
   if not points:raise RuntimeError('Tracker emitted an unobserved prediction')
   nearest=int(np.argmin([np.linalg.norm(np.array(q)-point)for q in points]));det=f['detections'][nearest];entries.append({'local_track_id':cam+':norfair:'+tid,'position':point,'bbox':det['bbox'],'confidence':det['confidence']})
  ids={x['local_track_id']for x in entries};s['local_ids'].update(ids);s['observed_frames']+=bool(ids);s['missed_frames']+=not bool(ids)
  if ids and s['gap']and ids&s['prior']:s['recoveries']+=1
  if ids:s['prior']=ids;s['gap']=False
  else:s['gap']=True
  rows.append({k:f[k]for k in ['camera_id','frame_index','observed_at','media_time_seconds','frame_sha256','image_size']}|{'tracks':entries})
 for s in stats.values():s['local_ids']=sorted(s['local_ids']);s.pop('prior');s.pop('gap')
 result={'tracker':'Existing Norfair2.3.0 TemporalTracker; Euclidean normalized bottom-centre, threshold.15, hit_counter_max6 (3s at2FPS, existing default remains3)','input':'actual YOLOX-S pixel detections only','predictions_reported_as_observations':False,'processing_seconds':time.perf_counter()-start,'peak_rss_kib':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,'per_camera':dict(stats),'frames':rows};a.output.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items()if k!='frames'}))
if __name__=='__main__':main()
