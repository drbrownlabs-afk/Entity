"""Check actual eight-sensor matrices and render quality, not hypothetical FOV cones."""
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageStat

ROOT = Path(__file__).resolve().parents[3]
p = argparse.ArgumentParser()
p.add_argument('--label', default='refined1')
a = p.parse_args()
assert a.label.replace('-', '').replace('_', '').isalnum()
folder = ROOT / f'docs/spatial-simulation/evidence/p2-09/09.12/{a.label}'
rendered = json.loads((folder / 'calibration.json').read_text())
profile = rendered['profile']
scene = json.loads((ROOT / 'apps/spatial-simulation/public/model/scene.json').read_text())
points = [np.array([*point, 1.]) for route in scene['routes'].values() for point in route[::12]]
canvas = Image.new('RGB', (1296, 1020), '#101820')
draw = ImageDraw.Draw(canvas)
reports = []
for index, frame in enumerate(rendered['cameras']):
    camera = next(c for c in profile['cameras'] if c['id'] == frame['camera_id'])
    V = np.array(frame['worldToCamera']).reshape(4, 4, order='F')
    P = np.array(frame['projection']).reshape(4, 4, order='F')
    K = np.array(frame['K'])
    w, h = frame['resolution']
    origin = np.linalg.inv(V) @ np.array([0., 0., 0., 1.])
    origin_error = float(np.max(np.abs(origin[:3]-camera['position'])))
    errors = []
    for point in points:
        local = V @ point
        clip = P @ local
        if local[2] >= -.01 or clip[3] <= 0:
            continue
        ndc = clip[:3]/clip[3]
        if max(abs(ndc[0]), abs(ndc[1])) > 1:
            continue
        actual = np.array([(ndc[0]+1)*w/2, (1-ndc[1])*h/2])
        expected = np.array([K[0, 0]*local[0]/-local[2]+K[0, 2], K[1, 2]-K[1, 1]*local[1]/-local[2]])
        errors.append(float(np.max(np.abs(actual-expected))))
    assert errors and origin_error < .0001
    assert max(errors) < .002, (camera['id'], max(errors))
    image = Image.open(folder / (camera['id']+'.png')).convert('RGB')
    assert image.size == (w, h)
    deviation = max(ImageStat.Stat(image).stddev)
    image.thumbnail((640, 240))
    x, y = (index % 2)*648, (index//2)*255
    canvas.paste(image, (x, y+15));draw.text((x+4,y), camera['id']+' | independent virtual sensor', fill='white')
    reports.append({'sensor_id': camera['id'], 'device_id': camera['device_id'],
                    'samples': len(errors), 'max_reprojection_error_pixels': max(errors),
                    'pose_error_native': origin_error, 'image_stddev': deviation,
                    'nonflat_image_check_passed': deviation > 12,
                    'source_png_sha256': hashlib.sha256((folder/(camera['id']+'.png')).read_bytes()).hexdigest(),
                    'resolution': [w, h]})
assert len(reports) == 8 and len({r['device_id'] for r in reports}) == 5
canvas.save(folder/'eight-views.jpg', quality=90)
report = {'phase': 'P2-09.12', 'calibration_matrix_checks_passed': True,
          'all_nonflat_images': all(r['nonflat_image_check_passed'] for r in reports),
          'pixel_coverage_gate_passed': False, 'devices': 5, 'independent_sensors': 8,
          'checks': reports, 'limits': ['Virtual intrinsics, not a factory physical calibration',
                                       'Pixel coverage with controlled probes still required',
                                       'Co-located head aperture approximation disclosed in profile']}
(folder/'matrix-checks.json').write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps(report))
