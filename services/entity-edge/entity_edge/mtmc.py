"""Appearance/time/calibration adapter for anonymous tracklets. No civil identity or simulator access.
Uses OpenCV histogram descriptors (Norfair ReID demo baseline), NumPy geometry and scipy graph components.
This is a weak appearance baseline, not learned/biometric ReID or a production accuracy claim.
"""
import argparse,json,collections,itertools,hashlib,time,resource
from pathlib import Path
import cv2,numpy as np,onnxruntime as ort
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import connected_components

def appearance(image,b):
 x1,y1,x2,y2=b;w=x2-x1;h=y2-y1;x1,x2=int(x1+.25*w),int(x2-.25*w);y1,y2=int(y1+.15*h),int(y1+.75*h);crop=image[max(0,y1):max(0,y2),max(0,x1):max(0,x2)]
 if not crop.size:return None
 hsv=cv2.cvtColor(crop,cv2.COLOR_BGR2HSV);hist=cv2.calcHist([hsv],[0,1,2],None,[12,8,8],[0,180,0,256,0,256]).reshape(-1);return hist/max(float(hist.sum()),1.)
def floor_point(camera,b):
 pos=np.array(camera['position']);forward=np.array(camera['target'])-pos;forward/=np.linalg.norm(forward);right=np.cross(forward,[0,1,0]);right/=np.linalg.norm(right);up=np.cross(right,forward);K=np.array(camera['K']);u=(b[0]+b[2])/2;v=b[3];ray=forward+right*(u-K[0,2])/K[0,0]+up*(K[1,2]-v)/K[1,1]
 if ray[1]>=-1e-6:return None
 t=(-1.85-pos[1])/ray[1]
 if t<=0:return None
 return (pos+ray*t).tolist()
def main():
 p=argparse.ArgumentParser();p.add_argument('--input',type=Path,required=True);p.add_argument('--frames',type=Path,required=True);p.add_argument('--calibration',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--reid-model',type=Path);p.add_argument('--appearance-threshold',type=float,default=.6);p.add_argument('--association-threshold',type=float,default=.70);a=p.parse_args();r=json.loads(a.input.read_text());cfg=json.loads(a.calibration.read_text());cams={c['id']:c for c in cfg['cameras']};tracklets=collections.defaultdict(list);start=time.perf_counter()
 reid=None
 if a.reid_model:
  opts=ort.SessionOptions();opts.intra_op_num_threads=2;reid=ort.InferenceSession(str(a.reid_model),sess_options=opts,providers=['CPUExecutionProvider'])
 def descriptor(image,b):
  if reid is None:return appearance(image,b)
  x1,y1,x2,y2=map(int,b);crop=image[max(0,y1):max(0,y2),max(0,x1):max(0,x2)]
  if not crop.size:return None
  crop=cv2.resize(crop,(128,256))[:,:,::-1].astype(np.float32)/255;crop=(crop-np.array([.485,.456,.406],np.float32))/np.array([.229,.224,.225],np.float32);v=reid.run(None,{'images':np.ascontiguousarray(crop.transpose(2,0,1)[None])})[0][0];return v/max(float(np.linalg.norm(v)),1e-9)
 for f in r['frames']:
  if not f['tracks']:continue
  image=cv2.imread(str(a.frames/(f['camera_id']+'-'+str(f['frame_index']).zfill(4)+'.png')));assert image is not None
  for t in f['tracks']:
   hist=descriptor(image,t['bbox']);point=floor_point(cams[f['camera_id']],t['bbox']);tracklets[t['local_track_id']].append({'frame_index':f['frame_index'],'observed_at':f['observed_at'],'camera':f['camera_id'],'hist':hist,'floor':point,'frame_sha256':f['frame_sha256']})
 keys=sorted(tracklets);edges=[];mat=np.eye(len(keys),dtype=np.int8)
 for ia,ib in itertools.combinations(range(len(keys)),2):
  ka,kb=keys[ia],keys[ib];aa,bb=tracklets[ka],tracklets[kb]
  if aa[0]['camera']==bb[0]['camera']:continue
  bytime={f['frame_index']:f for f in bb};common=[(f,bytime[f['frame_index']])for f in aa if f['frame_index']in bytime and f['hist']is not None and bytime[f['frame_index']]['hist']is not None and f['floor']is not None and bytime[f['frame_index']]['floor']is not None]
  if not common:continue
  distances=[float(np.linalg.norm(np.array(x['floor'])-y['floor']))for x,y in common];similarities=[float(np.dot(x['hist'],y['hist']))if reid is not None else 1-float(cv2.compareHist(x['hist'].astype(np.float32),y['hist'].astype(np.float32),cv2.HISTCMP_BHATTACHARYYA))for x,y in common];distance=float(np.median(distances));sim=float(np.median(similarities));score=.65*sim+.35*max(0,1-distance/2.5);accepted=sim>=a.appearance_threshold and distance<=2.5 and score>=a.association_threshold and (len(common)>=3 or (reid is not None and score>=.9 and distance<=.4))
  if accepted:mat[ia,ib]=mat[ib,ia]=1
  edges.append({'a':ka,'b':kb,'source_camera':aa[0]['camera'],'target_camera':bb[0]['camera'],'simultaneous_samples':len(common),'appearance_similarity':sim,'floor_distance_native':distance,'score':score,'probability_calibrated':False,'accepted':bool(accepted),'relation_semantics':'provisional visual association, not civil identity','evidence_frames':[{'index':x['frame_index'],'a_sha256':x['frame_sha256'],'b_sha256':y['frame_sha256']}for x,y in common]})
 count,labels=connected_components(csr_matrix(mat),directed=False);groups=[]
 for label in range(count):
  members=[keys[i]for i in range(len(keys))if labels[i]==label];groups.append({'id':'visual-'+hashlib.sha256('|'.join(members).encode()).hexdigest()[:20],'local_tracks':members,'civil_person_id':None,'identity_verified':False,'association':'provisional appearance/time/geometry; uncalibrated score','cameras':sorted({tracklets[k][0]['camera']for k in members})})
 payload={'algorithm':('OSNet-AIN pretrained CPU appearance'if reid is not None else'OpenCV HSV baseline')+' + simultaneous calibrated floor-ray consistency + scipy connected components','learned_reid':reid is not None,'reid_model_sha256':hashlib.sha256(a.reid_model.read_bytes()).hexdigest()if a.reid_model else None,'biometric_identification':False,'input':'real camera crops, observed MOT tracks and legitimate camera calibration; no GT','floor_geometry':'main native floor y=-1.85; raised floor and occluded feet introduce bias.2.5-native-unit gate is an approximation, not metres/certified uncertainty','policy':{'appearance_min':a.appearance_threshold,'association_score_min':a.association_threshold,'minimum_simultaneous_samples':3,'single_sample_exception':'score>=.9 and floor distance<=.4; still provisional'},'peak_rss_kib':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,'processing_seconds':time.perf_counter()-start,'local_tracklets':len(keys),'groups':groups,'associations':edges};a.output.write_text(json.dumps(payload,indent=2)+'\n');print(json.dumps({'tracklets':len(keys),'groups':len(groups),'accepted_associations':sum(e['accepted']for e in edges),'cameras_per_group':[len(g['cameras'])for g in groups]}))
if __name__=='__main__':main()
