"""Separate virtual CCTV profile. No edits to historical cameras or master geometry."""
import hashlib
import argparse
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--refine', action='store_true', help='Apply geometry/initial-render corrections while retaining initial poses')
parser.add_argument('--refine2', action='store_true', help='Retreat central support from the full-height gate/header and avoid perimeter obstacles')
parser.add_argument('--refine3', action='store_true', help='Retain second candidate and retreat C3 to cover near-field lounge points')
args = parser.parse_args()
scene_path = ROOT / 'apps/spatial-simulation/public/model/scene.json'
scene = json.loads(scene_path.read_text())
central_source = 'https://www.axis.com/dam/public/51/8d/8c/datasheet-axis-p3747-plve-panoramic-camera-en-US-506195.pdf'
detail_source = 'https://www.axis.com/dam/public/8a/0b/4c/datasheet-axis-p3267-lve-dome-camera-en-US-388254.pdf'
central = [-3.8, 1.15, -13.4]
poses = [
    ('C-S1', 'C', central, [-2.5, -.5, -9.9], 45, 'corredor hacia extremo de ingreso'),
    ('C-S2', 'C', central, [-2.5, -.5, -16.9], 45, 'corredor hacia cafetería'),
    ('C-S3', 'C', central, [-7.2, -.5, -14.2], 65, 'transición lateral recepción/espera'),
    ('C-S4', 'C', central, [-2.5, -1.6, -13.4], 71.5, 'transición cercana bajo dispositivo central'),
    ('C1-S1', 'C1', [-2.7, 1.1, 2.2], [-2.7, -.5, -1.2], 60, 'extremo de ingreso, diagonal longitudinal'),
    ('C2-S1', 'C2', [-2.7, 1.1, -28], [-2.7, -.5, -24.6], 60, 'extremo opuesto, corredor y transición posterior'),
    ('C3-S1', 'C3', [-11.2, 1.1, -1], [-6.5, -.5, -.4], 65, 'ala de lounge/cabinas y conexión frontal'),
    ('C4-S1', 'C4', [-8.3, 1.1, -23], [-4, -.5, -22], 65, 'ala de cafetería y conexión posterior'),
]
cameras = []
for sensor_id, device, position, target, vfov, purpose in poses:
    initial_position, initial_target = list(position), target[:]
    position, target = list(position), target[:]
    if args.refine and device == 'C':
        # Initial C-S1 axis hit the raised security leaf at t=.1236. Raise the
        # support within measured ceiling clearance, and aim S3 into reception
        # rather than the outdoor notch of the real C-shaped floor.
        position[1] = 1.5
        if sensor_id == 'C-S3':
            target = [-5.8, -.5, -16.5]
    if args.refine2 or args.refine3:
        if device == 'C':
            position = [-3.4, 1.3, -14.8]
            target = {'C-S1': [-2.5, -.6, -10.8],
                      'C-S2': [-2.5, -.6, -18.3],
                      'C-S3': [-5.5, -.5, -16.5],
                      'C-S4': [-2.5, -1.6, -14.8]}[sensor_id]
        elif device == 'C1':
            position, target = [-2.3, 1.4, 1.5], [-3.2, -.5, -2.4]
        elif device == 'C2':
            position, target = [-2.7, 1.3, -25.8], [-3.2, -.5, -21.6]
        elif device == 'C3':
            position, target = [-10.8, 1.3, -2.7], [-5.8, -.5, -.8]
            if args.refine3:
                position, target = [-11.3, 1.35, -4.9], [-8.5, -.5, -1]
                vfov = 74
    w, h = 1296, 972
    fy = h / (2 * math.tan(math.radians(vfov) / 2))
    pitch = math.degrees(math.atan2(position[1]-target[1], math.hypot(position[0]-target[0], position[2]-target[2])))
    if device == 'C':
        assert 23 <= pitch <= 90, 'Initial central head violates documented downward adjustment'
    cameras.append({'id': sensor_id, 'sensor_id': sensor_id, 'device_id': device,
        'channel_id': int(sensor_id[-1]), 'stream_id': sensor_id + '-rgb-main',
        'label': purpose, 'manufacturer': 'AXIS',
        'model': 'P3747-PLVE' if device == 'C' else 'P3267-LVE',
        'position': list(position), 'target': target, 'up': [0, 1, 0],
        'initial_position': initial_position, 'initial_target': initial_target,
        'projection': 'rectified-pinhole', 'resolution': [w, h],
        'source_sensor_resolution': [2592, 1944], 'source_sensor_max_fps': 20 if device == 'C' else 30,
        'capture_fps': 2, 'vfov_deg': vfov, 'hfov_deg': math.degrees(2*math.atan(w/(2*fy))),
        'K': [[fy, 0, w/2], [0, fy, h/2], [0, 0, 1]],
        'distortion': {'model': 'virtual-rectified', 'coefficients': [0, 0, 0, 0, 0],
                       'provenance': 'renderer pinhole; not measured commercial lens distortion'},
        'source': central_source if device == 'C' else detail_source,
        'mount': 'ceiling-adjacent virtual support; native units, not certified physical metres',
        'head_offset_model': 'co-located virtual optical origins; physical aperture offsets not measured',
        'downward_axis_degrees': pitch, 'simulation_only': True,
        'optical_limitations': 'conservative rectified crop within documented FOV; no physical WDR/IR/noise/codec emulation'})
profile = {'schema_version': '1.0', 'profile_id': 'cctv-c-v1', 'simulation_only': True,
    'coordinate_frame': scene['coordinate_frame'], 'metric_scale_verified': False,
    'master_sha256': scene['master_sha256'], 'scene_sha256': hashlib.sha256(scene_path.read_bytes()).hexdigest(),
    'device_count': 5, 'sensor_count': 8,
    'devices': [{'id': device, 'sensors': [c['id'] for c in cameras if c['device_id'] == device],
                 'model': 'AXIS P3747-PLVE' if device == 'C' else 'AXIS P3267-LVE'}
                for device in ['C', 'C1', 'C2', 'C3', 'C4']],
    'cameras': cameras, 'placement_state': 'initial candidate; calibration and pixel coverage validation pending',
    'reference': 'operator conceptual C-plan adapted to elongated real corridor and lateral wings',
    'clock_source': 'scenario UTC media timestamps; wall rendering time measured separately',
    'capture_render_profile': 'native PBR without CameraFrame postprocessing or jitter; not physical WDR/noise/codec emulation',
    'baseline_profile_modified': False,
    'sources': [central_source, detail_source],
    'selection': 'Four real optical channels centrally plus four independent detail cameras; no stitched panorama',
    'uncertainty': ['Physical scale and factory lens distortion not surveyed',
                    'Co-located optical-origin approximation must be disclosed',
                    'Coverage and useful pixel density require actual render probes, not cones']}
if args.refine:
    profile['placement_adjustments'] = [
        'Initial C-S1 render blocked by raised security leaf: support raised from1.15to1.50 nativeY below measured ceiling1.65.',
        'C-S3 redirected to reception transition; initial west axis faced the exterior notch, not a useful indoor zone.'
    ]
if args.refine2 or args.refine3:
    profile['placement_adjustments'] = [
        'Raised security gate has a fixed header up to ceiling: elevation alone failed. Retreat C to view below header with explicitly open security doors; closed doors remain real occlusions.',
        'C-S3 redirected to the indoor reception transition instead of the exterior notch.',
        'C1 moved away from vegetation immediately in front of its lens.',
        'C2 moved inside the rear retained glazing, without changing that glazing.',
        'C3 moved into the lounge side of the cabin obstruction for a crossed view.'
    ]
    if args.refine3:
        profile['placement_adjustments'][-1] = 'C3 retreated to the lounge corner with wider documented FOV: previous near-field pose missed lounge/cabin-01 probes.'
output = ROOT / 'apps/spatial-simulation/public/perception/profiles/cctv-c.json'
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(profile, indent=2) + '\n', encoding='utf-8', newline='\n')
print(json.dumps({'devices': 5, 'independent_sensors': 8, 'baseline_modified': False}))
