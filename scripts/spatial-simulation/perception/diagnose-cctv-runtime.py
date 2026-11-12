"""Bounded 09.19 probes, reusing current models/preprocessing; no decisions changed."""
import hashlib
import json
import statistics
import time
from collections import Counter,defaultdict
from pathlib import Path
import cv2
import numpy as np
import onnxruntime as ort
from entity_edge.vision import YoloX

assert not Path('/mnt/c').exists() and not Path('/root').exists() and not Path('/evaluation').exists()
frames=Path('/frames');manifest=json.loads((frames/'manifest.json').read_text());model=Path('/models/yolox_s.onnx')
assert hashlib.sha256(model.read_bytes()).hexdigest()=='c5c2d13e59ae883e6af3b45daea64af4833a4951c92d116ec270d9ddbe998063'
ort.preload_dlls();cv2.setNumThreads(2)
provider=[('CUDAExecutionProvider',{'gpu_mem_limit':str(2*1024**3),'cudnn_conv_algo_search':'HEURISTIC','cudnn_conv_use_max_workspace':'0','use_tf32':'0'}),'CPUExecutionProvider']
def session(path,gpu=False,profile=False):
    opts=ort.SessionOptions();opts.intra_op_num_threads=2;opts.inter_op_num_threads=1;opts.enable_profiling=profile;opts.profile_file_prefix='/tmp/probe'
    return ort.InferenceSession(str(path),sess_options=opts,providers=provider if gpu else ['CPUExecutionProvider'])
def stats(values):return {'n':len(values),'p50_ms':statistics.median(values),'p95_ms':sorted(values)[int(.95*(len(values)-1))],'sum_ms':sum(values)}
detector=YoloX(model,.25);actual=session(model,True,True);detector.session=actual
first=cv2.imread(str(frames/manifest['frames'][0]['file']))
for _ in range(3):detector.detect(first)
events=json.loads(Path(actual.end_profiling()).read_text());providers=dict(Counter(x.get('args',{}).get('provider') for x in events if x.get('args',{}).get('provider')))
assert providers.get('CUDAExecutionProvider',0)>0
network=[]
class Timed:
    def run(self,*args,**kwargs):
        before=time.perf_counter();out=actual.run(*args,**kwargs);network.append((time.perf_counter()-before)*1000);return out
detector.session=Timed();indices=sorted({0,16,32,64,100,150,200,max(f['frame_index'] for f in manifest['frames'])})
selected=[f for f in manifest['frames'] if f['frame_index'] in indices];read_times=[];decode_times=[];by_sensor=defaultdict(list);calls=defaultdict(list)
for frame in selected:
    before=time.perf_counter();data=(frames/frame['file']).read_bytes();assert hashlib.sha256(data).hexdigest()==frame['sha256'];read_times.append((time.perf_counter()-before)*1000)
    before=time.perf_counter();image=cv2.imdecode(np.frombuffer(data,np.uint8),cv2.IMREAD_COLOR);decode_times.append((time.perf_counter()-before)*1000)
    before=time.perf_counter();initial=len(network);detector.detect(image)
    if frame['camera_id'] in ['C1-S1','C2-S1']:
        h,w=image.shape[:2];size=detector.size
        xs=np.linspace(0,max(0,w-size),int(np.ceil(max(0,w-size)/(size*.75)))+1,dtype=int)
        ys=np.linspace(0,max(0,h-size),int(np.ceil(max(0,h-size)/(size*.75)))+1,dtype=int)
        for y in ys:
            for x in xs:detector.detect(image[y:min(y+size,h),x:min(x+size,w)])
    by_sensor[frame['camera_id']].append((time.perf_counter()-before)*1000);calls[frame['camera_id']].append(len(network)-initial)
model_reid=Path('/models/osnet_ain.onnx');cpu=session(model_reid);gpu=session(model_reid,True,True)
tracks=json.loads(Path('/tracks.json').read_text());samples=[(f,t) for f in tracks['frames'] for t in f['tracks']][::19][:32]
cpu_times=[];gpu_times=[];max_error=0.;cosines=[];input_name=cpu.get_inputs()[0].name
for i,(frame,track) in enumerate(samples):
    image=cv2.imread(str(frames/(frame['camera_id']+f'-{frame["frame_index"]:04}.png')));x1,y1,x2,y2=map(int,track['bbox'])
    crop=image[max(0,y1):y2,max(0,x1):x2];v=cv2.resize(crop,(128,256))[:,:,::-1].astype(np.float32)/255
    v=(v-np.array([.485,.456,.406],np.float32))/np.array([.229,.224,.225],np.float32);tensor=np.ascontiguousarray(v.transpose(2,0,1)[None])
    if i==0:
        for _ in range(3):cpu.run(None,{input_name:tensor});gpu.run(None,{input_name:tensor})
        reid_events=json.loads(Path(gpu.end_profiling()).read_text());reid_providers=dict(Counter(e.get('args',{}).get('provider') for e in reid_events if e.get('args',{}).get('provider')))
    before=time.perf_counter();a=cpu.run(None,{input_name:tensor})[0][0];cpu_times.append((time.perf_counter()-before)*1000)
    before=time.perf_counter();b=gpu.run(None,{input_name:tensor})[0][0];gpu_times.append((time.perf_counter()-before)*1000)
    a=a/max(np.linalg.norm(a),1e-9);b=b/max(np.linalg.norm(b),1e-9);max_error=max(max_error,float(np.max(np.abs(a-b))));cosines.append(float(a@b))
report={'phase':'P2-09.19','purpose':'read-only model diagnosis; not replacement/accuracy/live-stream validation','frames':len(selected),
        'opencv_threads':cv2.getNumThreads(),'onnx_intra_op_threads':2,'precision':'FP32, CUDA TF32 disabled',
        'io_read_and_sha':stats(read_times),'png_decode':stats(decode_times),'yolox_network_host_run':stats(network),
        'detector_preprocess_run_postprocess_per_sensor':{k:stats(v) for k,v in by_sensor.items()},
        'network_calls_per_frame':{k:sorted(set(v)) for k,v in calls.items()},'yolox_profile_providers':providers,
        'model_input_shapes':{'yolox':actual.get_inputs()[0].shape,'osnet':cpu.get_inputs()[0].shape},
        'osnet_cpu_network':stats(cpu_times),'osnet_cuda_network':stats(gpu_times),'osnet_profile_providers':reid_providers,
        'embedding_parity_sample':{'samples':len(samples),'max_normalized_abs_error':max_error,'minimum_cosine':min(cosines)},
        'model_sha256':{'yolox':hashlib.sha256(model.read_bytes()).hexdigest(),'osnet':hashlib.sha256(model_reid.read_bytes()).hexdigest()},
        'limitations':['Host Run includes transfer/synchronization; not GPU kernel occupancy or saturation',
                       'Detector probe runs same fullview/crops but excludes final global crop NMS; not complete detector benchmark',
                       'Fixed sample indices/no GT; concurrent Core workload on host','OSNet parity on32crops is not ReID quality or production approval']}
Path('/output/runtime-probe.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
