"""Per-sensor Norfair adapter with immutable, fresh-only causal output.

The historical adapter remains unchanged. This one emits tentative detections
immediately; confirmation is a later observation, never a backfilled frame.
"""
import copy
import math
from datetime import datetime
import numpy as np
from norfair import Detection, Tracker
from norfair.filter import OptimizedKalmanFilterFactory


class CausalMOT:
    def __init__(self,center_sensors=(),nominal_fps=2,retention_seconds=6):
        self.centers=set(center_sensors);self.fps=nominal_fps;self.retention=retention_seconds
        self.streams={}

    def _tracker(self):
        return Tracker(distance_function='euclidean',distance_threshold=.25,
            hit_counter_max=12,initialization_delay=1,
            filter_factory=OptimizedKalmanFilterFactory(R=.0001,Q=.001,pos_variance=.01,vel_variance=.01))

    def update(self,frame,session_id,known_at):
        camera=frame['camera_id'];key=(camera,session_id)
        allowed={'camera_id','frame_index','observed_at','media_time_seconds','frame_sha256','image_size','detections'}
        if set(frame)!=allowed:raise ValueError('Only pixel detections and source frame metadata accepted')
        if datetime.fromisoformat(frame['observed_at'].replace('Z','+00:00'))>datetime.fromisoformat(known_at.replace('Z','+00:00')):raise ValueError('Capture is not available yet')
        media=float(frame['media_time_seconds'])
        if not math.isfinite(media) or media<0:raise ValueError('Invalid source time')
        state=self.streams.get(key)
        if state and (frame['frame_index']<=state['index'] or media<=state['media']):
            raise ValueError('Duplicate/late frame must not rewind MOT')
        if state is None:
            state={'tracker':self._tracker(),'media':media,'index':-1,'serial':0,'ids':{},'confirmed':{},'last_seen':{}}
            self.streams[key]=state
        # Norfair's `period` adjusts hit rewards; tracker_step still predicts one
        # step. Advance missing nominal steps explicitly. Long gaps expire the
        # tracker without inventing observations or reusing its public serials.
        elapsed=media-state['media'];steps=max(1,math.floor(media*self.fps+1e-9)-math.floor(state['media']*self.fps+1e-9))
        if elapsed>self.retention:
            state['tracker']=self._tracker();state['ids']={};state['confirmed']={};state['last_seen']={}
        else:
            for _ in range(min(steps-1,math.ceil(self.retention*self.fps))):state['tracker'].update([])
        w,h=frame['image_size'];center=camera in self.centers;detections=[]
        for d in frame['detections']:
            x1,y1,x2,y2=d['bbox']
            if not (0<=x1<x2<=w and 0<=y1<y2<=h and 0<=d['confidence']<=1):
                raise ValueError('Invalid fresh pixel detection')
            point=[(x1+x2)/2/w,((y1+y2)/2 if center else y2)/h]
            detections.append(Detection(np.asarray([point]),data=copy.deepcopy(d)))
        state['tracker'].update(detections);tracks=[]
        for obj in state['tracker'].tracked_objects:
            if not any(obj.last_detection is d for d in detections):continue
            token=obj.initializing_id
            # An elapsed-time guard is independent of Norfair's hit count.
            if token in state['last_seen'] and media-state['last_seen'][token]>self.retention:
                state['ids'].pop(token,None);state['confirmed'].pop(token,None)
            if token not in state['ids']:
                state['serial']+=1;state['ids'][token]=f'{camera}:causal:{state["serial"]}'
            state['last_seen'][token]=media
            d=obj.last_detection;entry={'local_track_id':state['ids'][token],
                'track_status':'candidate' if obj.is_initializing else 'confirmed',
                'bbox':d.data['bbox'],'confidence':d.data['confidence'],'position':d.points[0].tolist(),
                'position_anchor':'bbox-center' if center else 'bbox-bottom-center',
                'position_is_filtered_estimate':False}
            if not obj.is_initializing:
                state['confirmed'].setdefault(token,known_at)
                entry['association_confirmation_evidence_at']=state['confirmed'][token]
            tracks.append(entry)
        state['media']=media;state['index']=frame['frame_index']
        # Return detached values: neither future Norfair updates nor callers can
        # mutate an already emitted event through shared objects.
        return copy.deepcopy({k:v for k,v in frame.items() if k!='detections'} | {
            'stream_session_id':session_id,'known_at':known_at,'tracks':tracks,
            'execution_mode':'causal-incremental','missing_nominal_steps':steps-1})
