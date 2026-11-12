"""Norfair adapter: confirmed associations to fresh detections, never predicted observations."""
import argparse,collections,json,math,resource,time
from pathlib import Path
import numpy as np
from norfair import Detection,Tracker
from norfair.filter import OptimizedKalmanFilterFactory

def track_frames(payload,distance_threshold=.25,hit_counter_max=12,initialization_delay=1,center_sensors=()):
 trackers={};rows=[];pending={};confirmed={};start=time.perf_counter();center_sensors=set(center_sensors)
 for frame in payload['frames']:
  camera=frame['camera_id']
  if camera not in trackers:trackers[camera]=Tracker(distance_function='euclidean',distance_threshold=distance_threshold,hit_counter_max=hit_counter_max,initialization_delay=initialization_delay,filter_factory=OptimizedKalmanFilterFactory(R=.0001,Q=.001,pos_variance=.01,vel_variance=.01))
  tracker=trackers[camera];w,h=frame['image_size'];center=camera in center_sensors
  detections=[Detection(np.array([[(d['bbox'][0]+d['bbox'][2])/2/w,((d['bbox'][1]+d['bbox'][3])/2 if center else d['bbox'][3])/h]]),data=d) for d in frame['detections']]
  tracker.update(detections);row={k:frame[k] for k in ['camera_id','frame_index','observed_at','media_time_seconds','frame_sha256','image_size']}|{'tracks':[]};rows.append(row);active=set()
  for obj in tracker.tracked_objects:
   token=(camera,obj.initializing_id);active.add(token)
   if not any(obj.last_detection is detection for detection in detections):continue
   actual=obj.last_detection.data;entry={'position':obj.estimate[0].tolist(),'position_anchor':'bbox-center' if center else 'bbox-bottom-center','bbox':actual['bbox'],'confidence':actual['confidence'],'position_is_filtered_estimate':True}
   pending.setdefault(token,[]).append((len(rows)-1,entry))
   if not obj.is_initializing:
    confirmed.setdefault(token,{'frame_index':frame['frame_index'],'observed_at':frame['observed_at'],'media_time_seconds':frame['media_time_seconds']})
    for index,observation in pending.pop(token):rows[index]['tracks'].append(dict(observation,local_track_id=camera+':norfair:'+str(obj.id),confirmed_at_frame_index=confirmed[token]['frame_index'],association_confirmation_evidence_at=confirmed[token]['observed_at'],association_confirmation_media_seconds=confirmed[token]['media_time_seconds'],associated_after_confirmation=rows[index]['frame_index']<confirmed[token]['frame_index']))
  for token in list(pending):
   if token[0]==camera and token not in active:pending.pop(token)
 stats=collections.defaultdict(lambda:{'ids':set(),'observed_frames':0,'missing_frames':0,'recoveries':0,'prior':set(),'gap':False})
 for row in rows:
  ids={entry['local_track_id'] for entry in row['tracks']};s=stats[row['camera_id']];s['ids'].update(ids);s['observed_frames']+=bool(ids);s['missing_frames']+=not bool(ids)
  if ids:
   if s['gap'] and ids&s['prior']:s['recoveries']+=1
   s['prior']=ids;s['gap']=False
  else:s['gap']=True
 for s in stats.values():s['local_ids']=sorted(s.pop('ids'));s.pop('prior');s.pop('gap')
 return {'tracker':'Norfair2.3.0; configurable confirmation/retention; steep-view bbox centre prior','parameters':{'distance_threshold':distance_threshold,'hit_counter_max':hit_counter_max,'initialization_delay_frames':initialization_delay,'nominal_fps':2,'centre_anchor_sensors':sorted(center_sensors),'normalized_kalman':{'R':.0001,'Q':.001,'pos_variance':.01,'vel_variance':.01,'probability_calibrated':False}},'semantics':{'local_track_id':'anonymous camera-local association, not civil identity or a new Person','missing_frame':'no confirmed camera observation; no building exit inferred','position':'filtered normalized image anchor (x/width,y/height), not confirmed world coordinates','confirmation':'original observation time preserved separately from later association confirmation'},'predictions_reported_as_observations':False,'past_fresh_detections_associated_after_confirmation':True,'confirmation_latency_is_explicit':True,'bbox_source':'exact associated fresh detection; buffered tentative observations retain their original frames and positions','processing_seconds':time.perf_counter()-start,'peak_rss_kib':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,'per_camera':dict(stats),'frames':rows}
def main():
 p=argparse.ArgumentParser();p.add_argument('--input',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--distance-threshold',type=float,default=.25);p.add_argument('--hit-counter-max',type=int,default=12);p.add_argument('--initialization-delay',type=int,default=1);p.add_argument('--calibration',type=Path);a=p.parse_args();assert 0<a.distance_threshold<=1 and 0<=a.initialization_delay<a.hit_counter_max
 centers=[]
 if a.calibration:
  for camera in json.loads(a.calibration.read_text())['cameras']:
   d=np.array(camera['target'])-camera['position'];down=math.degrees(math.atan2(-d[1],math.hypot(d[0],d[2])))
   if down>=60:centers.append(camera['id'])
 report=track_frames(json.loads(a.input.read_text()),a.distance_threshold,a.hit_counter_max,a.initialization_delay,centers);a.output.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='frames'}))
if __name__=='__main__':main()
