"""Compare fresh capture pixels while keeping private actor IDs out of reports."""
import argparse,hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
p=argparse.ArgumentParser();p.add_argument('--run',required=True);p.add_argument('--sample',required=True);a=p.parse_args()
assert all(value.replace('-','').replace('_','').isalnum() for value in [a.run,a.sample])
base=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{a.run}';sample=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{a.sample}'
first=json.loads((base/'frames/manifest.json').read_text());second=json.loads((sample/'frames/manifest.json').read_text());lookup={(r['camera_id'],r['frame_index']):r for r in first['frames']}
identical=sum(row['sha256']==lookup[(row['camera_id'],row['frame_index'])]['sha256'] for row in second['frames']);t1=json.loads((base/'evaluator/truth.json').read_text());t2=json.loads((sample/'evaluator/truth.json').read_text());assert t1['internal_actor_id']!=t2['internal_actor_id']
report={'phase':'P2-09.14','scope':'Fresh browser recapture, same stimulus, different private actor ID','frames':len(second['frames']),'exact_pixel_hash_matches':identical,'all_exact':identical==len(second['frames']),'private_actor_id_changed':True,'original_manifest_sha256':hashlib.sha256((base/'frames/manifest.json').read_bytes()).hexdigest(),'recapture_manifest_sha256':hashlib.sha256((sample/'frames/manifest.json').read_bytes()).hexdigest(),'inference_id_invariance_tested':False}
output=ROOT/f'docs/spatial-simulation/evidence/p2-09/09.14/{a.run}';output.mkdir(parents=True,exist_ok=True);(output/'reproduction.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps(report));assert report['all_exact']
