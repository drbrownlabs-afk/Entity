"""Evaluator only: compare pixel inference to separately stored render-difference labels."""
import json,collections,statistics
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[3];out=ROOT/'docs/spatial-simulation/evidence/p2-09/09.5';r=json.loads(Path('/tmp/p2-09-vision-output/detections.json').read_text());gt=json.loads((ROOT/'simulation/spatial-office/.runtime/p2-09-evaluation/pixel-evaluation.json').read_text());truth={(f['camera_id'],f['frame_index']):f for f in gt};frames=ROOT/'simulation/spatial-office/.runtime/p2-09-frames'
def iou(a,b):
 if a is None or b is None:return 0.
 inter=max(0,min(a[2],b[2])-max(a[0],b[0]))*max(0,min(a[3],b[3])-max(a[1],b[1]));return inter/max(1,(a[2]-a[0])*(a[3]-a[1])+(b[2]-b[0])*(b[3]-b[1])-inter)
counts=collections.defaultdict(collections.Counter);best={};records=[]
for f in r['frames']:
 key=(f['camera_id'],f['frame_index']);label=truth[key];target=label['render_delta_box']if label['changed_pixels']>=80 else None;detections=f['detections'];overlaps=[iou(d['bbox'],target)for d in detections];score=max(overlaps,default=0);c=counts[f['camera_id']];c['frames']+=1;c['gt_visible_frames']+=bool(target);c['detections']+=len(detections);c['tp_iou30']+=score>=.3;c['tp_iou50']+=score>=.5;c['false_positive_boxes_iou30']+=sum(v<.3 for v in overlaps);records.append({'camera_id':key[0],'frame_index':key[1],'best_iou':score,'gt_visible':bool(target)})
 if detections and (key[0]not in best or score>best[key[0]][0]):best[key[0]]=(score,f,target)
canvas=Image.new('RGB',(1152,850),'#161c20');draw=ImageDraw.Draw(canvas)
for n,(cam,(score,f,target))in enumerate(sorted(best.items())):
 im=Image.open(frames/(cam+'-'+str(f['frame_index']).zfill(4)+'.png')).convert('RGB');d=ImageDraw.Draw(im)
 for pred in f['detections']:d.rectangle(pred['bbox'],outline='#00ff65',width=3);d.text((pred['bbox'][0],max(0,pred['bbox'][1]-16)),f"person {pred['confidence']:.2f}",fill='#00ff65')
 if target:d.rectangle(target,outline='#ff00e5',width=2)
 im.thumbnail((570,265));x=n%2*576;y=n//2*280;canvas.paste(im,(x,y+18));draw.text((x+4,y),cam+' | evaluator IoU '+str(round(score,3)),fill='white')
canvas.save(out/'detections.jpg',quality=92)
report={'gate':'P2-09.5','passed':False,'pixel_inference':True,'ground_truth_absent_from_worker':r['isolated_truth_read_blocked'],'model':r['model'],'model_sha256':r['model_sha256'],'head_decoding_required':r['head_decoding_required'],'threshold':r['threshold'],'provider':r['provider'],'total_frames':len(r['frames']),'per_camera':{k:dict(v)for k,v in counts.items()},'median_inference_ms':statistics.median(f['inference_ms']for f in r['frames']),'p95_inference_ms':sorted(f['inference_ms']for f in r['frames'])[int(.95*(len(r['frames'])-1))],'processing_seconds':r['processing_seconds'],'peak_rss_kib':r['peak_rss_kib'],'evaluation':'IoU0.30 and0.50 both reported; labels from independent renderer pixel deltas, never supplied to inference','records':records};(out/'detection-checks.json').write_text(json.dumps(report,indent=2)+'\n');(out/'detections.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k not in ['records']}))
