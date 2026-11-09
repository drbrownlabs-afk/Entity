"""Pixel-only YOLOX ONNX adapter; no simulator imports, actor IDs, positions or annotations."""
import argparse,json,hashlib,time,resource
from pathlib import Path
import cv2,numpy as np,onnxruntime as ort,jsonschema
class YoloX:
 def __init__(self,weights,threshold=.25):
  opts=ort.SessionOptions();opts.intra_op_num_threads=2;opts.inter_op_num_threads=1
  self.session=ort.InferenceSession(str(weights),sess_options=opts,providers=['CPUExecutionProvider']);self.input=self.session.get_inputs()[0];self.size=int(self.input.shape[-1]);self.threshold=threshold
  grids=[];strides=[]
  for stride in [8,16,32]:
   y,x=np.meshgrid(np.arange(self.size//stride),np.arange(self.size//stride),indexing='ij');grids.append(np.stack([x,y],axis=-1).reshape(-1,2));strides.append(np.full((x.size,1),stride))
  self.grid=np.concatenate(grids);self.stride=np.concatenate(strides);self.decode=None
 def detect(self,image):
  h,w=image.shape[:2];ratio=min(self.size/h,self.size/w);resized=cv2.resize(image,(int(w*ratio),int(h*ratio)),interpolation=cv2.INTER_LINEAR);padded=np.full((self.size,self.size,3),114,dtype=np.uint8);padded[:resized.shape[0],:resized.shape[1]]=resized
  normalized=padded.astype(np.float32) # Contract verified on the exact ONNX binary with a positive-control photograph.
  raw=self.session.run(None,{self.input.name:np.ascontiguousarray(normalized.transpose(2,0,1)[None],dtype=np.float32)})[0][0];boxes=raw[:,:4].copy()
  if self.decode is None:self.decode=bool(np.max(abs(boxes[:,:2]))<20)
  if self.decode:boxes[:,:2]=(boxes[:,:2]+self.grid)*self.stride;boxes[:,2:]=np.exp(boxes[:,2:])*self.stride
  scores=raw[:,4]*raw[:,5];keep=scores>=self.threshold;boxes=boxes[keep]/ratio;scores=scores[keep]
  if not len(boxes):return []
  boxes[:,:2]-=boxes[:,2:]/2
  indices=cv2.dnn.NMSBoxes(boxes.tolist(),scores.tolist(),self.threshold,.45);result=[]
  for i in np.array(indices).reshape(-1)[:50]:
   x,y,bw,bh=boxes[i];bbox=[float(max(0,x)),float(max(0,y)),float(min(w,x+bw)),float(min(h,y+bh))]
   if bbox[2]>bbox[0]and bbox[3]>bbox[1]:result.append({'bbox':bbox,'confidence':float(scores[i]),'class':'person'})
  return result

def main():
 p=argparse.ArgumentParser();p.add_argument('--frames',type=Path,required=True);p.add_argument('--model',type=Path,required=True);p.add_argument('--contract',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--threshold',type=float,default=.25);p.add_argument('--assert-inaccessible',required=True);a=p.parse_args()
 try:Path(a.assert_inaccessible).read_bytes()
 except (FileNotFoundError,PermissionError):isolation=True
 else:raise RuntimeError('Ground truth was accessible: refusing inference')
 m=json.loads((a.frames/'manifest.json').read_text());jsonschema.validate(m,json.loads(a.contract.read_text()));detector=YoloX(a.model,a.threshold);rows=[];start=time.perf_counter()
 for f in m['frames']:
  path=a.frames/f['file'];assert path.parent==a.frames and hashlib.sha256(path.read_bytes()).hexdigest()==f['sha256'];image=cv2.imread(str(path));assert image is not None;t=time.perf_counter();detections=detector.detect(image);rows.append({'camera_id':f['camera_id'],'frame_index':f['frame_index'],'observed_at':f['observed_at'],'media_time_seconds':f['media_time_seconds'],'frame_sha256':f['sha256'],'image_size':[image.shape[1],image.shape[0]],'detections':detections,'inference_ms':(time.perf_counter()-t)*1000})
 report={'input':'pixels only plus camera/time metadata; no ground truth mounted','isolated_truth_read_blocked':isolation,'provider':'ONNX Runtime '+ort.__version__+' CPUExecutionProvider','model':a.model.stem+' official Megvii COCO person class','model_sha256':hashlib.sha256(a.model.read_bytes()).hexdigest(),'head_decoding_required':detector.decode,'threshold':a.threshold,'preprocessing':'BGR0..255 CHW, top-left114 padding; exact binary contract verified on public positive control. Tagged legacy helper is incompatible with these ONNX binaries.','processing_seconds':time.perf_counter()-start,'peak_rss_kib':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,'frames':rows};a.output.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'frames':len(rows),'person_boxes':sum(len(r['detections'])for r in rows),'seconds':report['processing_seconds'],'truth_blocked':isolation}))
if __name__=='__main__':main()
