"""Single progressive pixel worker. No corpus path, evaluator or Core access.

stdin: big-endian uint32 JSON size, JSON header, `byte_length` pixel bytes.
stdout: ready and one result JSON per available independent sensor frame.
The producer owns pacing/backpressure; this worker never opens future frames.
"""
import argparse
import hashlib
import json
import struct
import sys
import time
import queue
import threading
import uuid
from datetime import datetime,timedelta
from pathlib import Path
import cv2
import numpy as np
import onnxruntime as ort
from .vision import YoloX
from .causal_mot import CausalMOT
from .causal_mtmc import CausalMTMC
from .cctv_mtmc import candidate_cells
from .cctv_reid import floor_estimate
from .spatial_graph import SpatialSensorGraph


class PixelModels:
    def __init__(self,models):
        ort.preload_dlls();options=ort.SessionOptions();options.intra_op_num_threads=2;options.inter_op_num_threads=1
        providers=[('CUDAExecutionProvider',{'gpu_mem_limit':str(2*1024**3),'cudnn_conv_algo_search':'HEURISTIC',
            'cudnn_conv_use_max_workspace':'0','use_tf32':'0'}),'CPUExecutionProvider']
        self.detector=YoloX(models/'yolox_s.onnx',.25)
        self.detector.session=ort.InferenceSession(str(models/'yolox_s.onnx'),sess_options=options,providers=providers)
        self.reid=ort.InferenceSession(str(models/'osnet_ain.onnx'),sess_options=options,providers=providers)
        if any(s.get_providers()[0]!='CUDAExecutionProvider' for s in [self.detector.session,self.reid]):
            raise RuntimeError('CUDA required; silent CPU fallback rejected')
        self.hashes={k:hashlib.sha256((models/v).read_bytes()).hexdigest() for k,v in [('detector','yolox_s.onnx'),('reid','osnet_ain.onnx')]}
        if self.hashes['detector']!='c5c2d13e59ae883e6af3b45daea64af4833a4951c92d116ec270d9ddbe998063':raise ValueError('Unexpected detector weights')

    def detect(self,image,sensor):
        # Same full view + native crops + edge exclusion + global NMS policy as
        # detect-cctv.py. The frozen historical script remains unchanged.
        detector=self.detector;boxes=detector.detect(image)
        if sensor not in {'C1-S1','C2-S1'}:return boxes
        h,w=image.shape[:2];size=detector.size
        xs=np.linspace(0,max(0,w-size),int(np.ceil(max(0,w-size)/(size*.75)))+1,dtype=int)
        ys=np.linspace(0,max(0,h-size),int(np.ceil(max(0,h-size)/(size*.75)))+1,dtype=int)
        for y in ys:
            for x in xs:
                crop=image[y:min(y+size,h),x:min(x+size,w)];ch,cw=crop.shape[:2]
                for d in detector.detect(crop):
                    b=d['bbox']
                    if (x>0 and b[0]<=4) or (y>0 and b[1]<=4) or (x+cw<w and b[2]>=cw-4) or (y+ch<h and b[3]>=ch-4):continue
                    boxes.append(dict(d,bbox=[b[0]+x,b[1]+y,b[2]+x,b[3]+y]))
        if not boxes:return []
        indices=cv2.dnn.NMSBoxes([[b['bbox'][0],b['bbox'][1],b['bbox'][2]-b['bbox'][0],b['bbox'][3]-b['bbox'][1]] for b in boxes],
            [b['confidence'] for b in boxes],.25,.45)
        return [boxes[int(i)] for i in np.asarray(indices).reshape(-1)]

    def appearance(self,image,box):
        x1,y1,x2,y2=map(int,box);crop=image[max(0,y1):min(image.shape[0],y2),max(0,x1):min(image.shape[1],x2)]
        if not crop.size:raise ValueError('Invalid crop')
        tensor=cv2.resize(crop,(128,256))[:,:,::-1].astype(np.float32)/255
        tensor=(tensor-np.array([.485,.456,.406],np.float32))/np.array([.229,.224,.225],np.float32)
        vector=self.reid.run(None,{'images':np.ascontiguousarray(tensor.transpose(2,0,1)[None])})[0][0]
        return (vector/max(float(np.linalg.norm(vector)),1e-9)).tolist()


def emit(value):print(json.dumps(value,separators=(',',':')),flush=True)


def exact(stream,length):
    parts=[];remaining=length
    while remaining:
        data=stream.read(remaining)
        if not data:raise EOFError('Truncated frame envelope')
        parts.append(data);remaining-=len(data)
    return b''.join(parts)


def decoded_frames(stream,allowed,cameras):
    """Overlap codec/pipe reads with GPU work, at most two available frames."""
    pending=queue.Queue(maxsize=2)
    def receive():
        try:
            while True:
                size=stream.read(4)
                if not size:break
                if len(size)!=4:raise EOFError('Truncated header length')
                length=struct.unpack('!I',size)[0]
                if not 0<length<=16384:raise ValueError('Frame header too large')
                header=json.loads(exact(stream,length))
                if set(header)!=allowed or header['camera_id'] not in cameras or not 0<header['byte_length']<=32*1024**2:
                    raise ValueError('Unexpected frame metadata or private fields')
                received=time.monotonic();data=exact(stream,header['byte_length']);decode_start=time.monotonic()
                if hashlib.sha256(data).hexdigest()!=header['frame_sha256']:raise ValueError('Pixel evidence checksum mismatch')
                if header['encoding']=='png':image=cv2.imdecode(np.frombuffer(data,np.uint8),cv2.IMREAD_COLOR)
                elif header['encoding']=='bgr8':image=np.frombuffer(data,np.uint8).reshape(header['image_size'][1],header['image_size'][0],3)
                else:raise ValueError('Unsupported pixel encoding')
                if image is None or [image.shape[1],image.shape[0]]!=header['image_size']:raise ValueError('Invalid frame dimensions')
                pending.put((header,image,received,decode_start,time.monotonic()))
        except BaseException as exc:pending.put(exc)
        finally:pending.put(None)
    thread=threading.Thread(target=receive,daemon=True);thread.start()
    while True:
        item=pending.get()
        if item is None:break
        if isinstance(item,BaseException):raise item
        yield item
    thread.join()


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--run',required=True);parser.add_argument('--models',type=Path,required=True)
    parser.add_argument('--calibration',type=Path,required=True);parser.add_argument('--graph',type=Path,required=True)
    args=parser.parse_args();started=time.monotonic()
    if any(Path(p).exists() for p in ['/frames','/mnt/c','/evaluation','/root']):
        raise RuntimeError('Worker isolation failed: corpus/workspace/evaluator must not be accessible')
    cameras={c['id']:c for c in json.loads(args.calibration.read_text())['cameras']}
    calibration_sha=hashlib.sha256(args.calibration.read_bytes()).hexdigest();graph_sha=hashlib.sha256(args.graph.read_bytes()).hexdigest()
    graph=SpatialSensorGraph(args.graph);mot=CausalMOT([c for c in cameras if cameras[c]['downward_axis_degrees']>=60])
    mtmc=CausalMTMC(graph,args.run);models=PixelModels(args.models)
    for _ in range(3):models.detect(np.zeros((640,640,3),np.uint8),'C-S1');models.appearance(np.zeros((256,128,3),np.uint8),[0,0,128,256])
    emit({'type':'ready','cold_start_seconds':time.monotonic()-started,'models':models.hashes,'calibration_sha256':calibration_sha,'graph_sha256':graph_sha,
        'detector_policy':{'threshold':.25,'tile_sensors':['C1-S1','C2-S1'],'global_nms_iou':.45},
        'source_sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path(__file__),Path(__file__).with_name('causal_mot.py'),Path(__file__).with_name('causal_mtmc.py')]}})
    allowed={'camera_id','frame_index','observed_at','media_time_seconds','frame_sha256','image_size','stream_session_id',
             'byte_length','encoding','clock_origin_utc','clock_origin_monotonic','capture_monotonic'}
    stream=sys.stdin.buffer
    for header,image,received,decode_start,decoded in decoded_frames(stream,allowed,cameras):
        before=time.monotonic();boxes=models.detect(image,header['camera_id']);detected=time.monotonic()
        logical=lambda: (datetime.fromisoformat(header['clock_origin_utc'].replace('Z','+00:00'))+timedelta(seconds=time.monotonic()-header['clock_origin_monotonic'])).isoformat()
        frame={k:header[k] for k in ['camera_id','frame_index','observed_at','media_time_seconds','frame_sha256','image_size']}
        frame['detections']=boxes;tracked=mot.update(frame,header['stream_session_id'],logical());associated=time.monotonic()
        oid=str(uuid.uuid5(uuid.NAMESPACE_URL,'|'.join(map(str,(args.run,header['stream_session_id'],header['camera_id'],header['frame_index'],header['frame_sha256'])))))
        descriptors=[]
        for track in tracked['tracks']:
            descriptors.append((track,models.appearance(image,track['bbox']),floor_estimate(cameras[header['camera_id']],track['bbox']),candidate_cells(cameras[header['camera_id']],track['bbox'],graph)))
        known_at=logical();tracked['known_at']=known_at;revisions=[]
        for track,embedding,floor,cells in descriptors:
            row={k:tracked[k] for k in ['camera_id','stream_session_id','frame_index','observed_at','media_time_seconds','frame_sha256','known_at']}
            row.update(local_track_id=track['local_track_id'],track_status=track['track_status'],embedding=embedding,
                observation_id=oid,floor_estimate_native=floor,candidate_floor_cells=cells)
            if track.get('association_confirmation_evidence_at'):row['association_confirmation_evidence_at']=track['association_confirmation_evidence_at']
            decisions=mtmc.update(row)
            decision_available=logical()
            for decision in decisions:decision['known_at']=decision_available
            revisions.extend(decisions)
        finished=time.monotonic()
        emit({'type':'frame','frame':tracked,'observation_id':oid,'revisions':revisions,'detections':boxes,
            'capture_monotonic':header['capture_monotonic'],'worker_finished_monotonic':finished,
            'timings_ms':{'input_wait_age':(received-header['capture_monotonic'])*1000,'decode':(decoded-decode_start)*1000,'decoded_queue_wait':(before-decoded)*1000,
                'detect':(detected-before)*1000,'mot':(associated-detected)*1000,'appearance_graph_mtmc':(finished-associated)*1000}})


if __name__=='__main__':main()
