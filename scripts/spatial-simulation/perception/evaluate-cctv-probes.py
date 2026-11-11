"""Evaluator-only static calibration masks. Never imported by perception workers."""
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[3]

def measure(background, actual, amodal):
    # Both references share the exact cached architectural color. The amodal
    # pass clears depth ONLY in the evaluator to quantify real occlusion.
    delta = np.max(np.abs(actual.astype(np.int16)-background.astype(np.int16)), axis=2)
    full_delta = np.max(np.abs(amodal.astype(np.int16)-background.astype(np.int16)), axis=2)
    mask, full = delta > 12, full_delta > 12
    mask &= full
    def box(values):
        y, x = np.nonzero(values)
        return [int(x.min()), int(y.min()), int(x.max()+1), int(y.max()+1)] if len(x) else None
    observed_box, amodal_box = box(mask), box(full)
    fraction = float(mask.sum()/full.sum()) if full.any() else 0.
    height = observed_box[3]-observed_box[1] if observed_box else 0
    # Predeclared calibration usefulness criterion, not detector recall labels.
    useful = bool(full.sum() >= 200 and mask.sum() >= 120 and fraction >= .35 and height >= 80)
    return {'visible_pixels': int(mask.sum()), 'amodal_pixels_in_frame': int(full.sum()),
            'visible_fraction_in_frame': fraction, 'visible_bbox': observed_box,
            'amodal_bbox': amodal_box, 'visible_height_pixels': height, 'useful': useful}

def main():
    p = argparse.ArgumentParser(description=__doc__);p.add_argument('--run', required=True);a = p.parse_args()
    assert a.run.replace('-', '').replace('_', '').isalnum()
    runtime = ROOT / f'simulation/spatial-office/.runtime/cctv-probes-{a.run}'
    meta = json.loads((runtime/'evaluator/probes.json').read_text())
    manifest = json.loads((runtime/'frames/manifest.json').read_text())
    cameras = [c['id'] for c in meta['profile']['cameras']]
    def read(path):return np.asarray(Image.open(path).convert('RGB'))
    backgrounds = {c:read(runtime/'frames'/f'background-{c}.png') for c in cameras}
    rows=[]
    for entry in manifest['frames']:
        row=measure(backgrounds[entry['camera_id']],read(runtime/'frames'/entry['file']),read(runtime/'evaluator'/entry['file']))
        rows.append({'sensor_id':entry['camera_id'],'probe_index':entry['frame_index'],**row})
    (runtime/'evaluator/measurements.json').write_text(json.dumps(rows,indent=2)+'\n')
    visible={c:{r['probe_index'] for r in rows if r['sensor_id']==c and r['useful']} for c in cameras}
    overlap=[[len(visible[a]&visible[b]) for b in cameras] for a in cameras]
    reached={cameras[0]}
    while True:
        new=reached|{b for a in reached for b in cameras if a!=b and visible[a]&visible[b]}
        if new==reached:break
        reached=new
    union=set().union(*visible.values())
    regions={}
    for index,point in enumerate(meta['points']):
        region=regions.setdefault(point['region'],{'probes':0,'covered':0})
        region['probes']+=1;region['covered']+=int(index in union)
    public={'phase':'P2-09.12','run':a.run,'simulation_only':True,'static_probes':len(meta['points']),
            'manifest_sha256':hashlib.sha256((runtime/'frames/manifest.json').read_bytes()).hexdigest(),
            'profile_sha256':hashlib.sha256(json.dumps(meta['profile'],sort_keys=True,separators=(',',':')).encode()).hexdigest(),
            'images':len(rows),'door_scenario':meta['door_scenario'],
            'thresholds':{'minimum_visible_fraction_of_in_frame_amodal_mask':.35,'minimum_visible_height_pixels':80,'minimum_visible_pixels':120,'minimum_amodal_pixels':200},
            'covered_static_probes':len(union),'blind_static_probes':len(meta['points'])-len(union),
            'sensors':cameras,'useful_probes_per_sensor':{c:len(visible[c]) for c in cameras},
            'simultaneous_useful_overlap_matrix':overlap,'overlap_graph_connected':len(reached)==len(cameras),
            'regions':regions,'gate_passed':False,
            'limitations':['Unordered static poses, no trajectory/MOT/identity validation',
                          'Visibility fraction is relative to amodal silhouette clipped by image boundaries',
                          'Private evaluation masks and simulator poses are never inference inputs',
                          'Closed room interiors and closed security doors can create physical blind zones']}
    output=ROOT/f'docs/spatial-simulation/evidence/p2-09/09.12/{a.run}';output.mkdir(parents=True,exist_ok=True)
    (output/'pixel-coverage.json').write_text(json.dumps(public,indent=2)+'\n')
    montage=Image.new('RGB',(1296,1020),'#101820');draw=ImageDraw.Draw(montage)
    for index,camera in enumerate(cameras):
        best=max((r for r in rows if r['sensor_id']==camera),key=lambda r:(r['useful'],r['visible_pixels']))
        entry=next(e for e in manifest['frames'] if e['camera_id']==camera and e['frame_index']==best['probe_index'])
        image=Image.open(runtime/'frames'/entry['file']).convert('RGB');image.thumbnail((640,240))
        x,y=(index%2)*648,(index//2)*255;montage.paste(image,(x,y+15));draw.text((x+4,y),f"{camera} | synthetic calibration dummy",fill='white')
    montage.save(output/'dummy-views.jpg',quality=90)
    print(json.dumps(public))
if __name__=='__main__':main()
