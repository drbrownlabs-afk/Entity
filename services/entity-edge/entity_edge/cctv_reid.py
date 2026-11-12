"""Extract appearance evidence from independent camera crops. No evaluator inputs.

This separate adapter preserves the historical six-camera MTMC baseline.
"""
import argparse
import hashlib
import json
import time
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort


def floor_estimate(camera, box):
    """Uncertain pinhole estimate, never a measured person world position.

    Bottom-centre is biased by truncation/occlusion. Steep cameras use centre
    intersected with an assumed torso plane. All heights are engineering priors.
    """
    position = np.asarray(camera['position'], float)
    forward = np.asarray(camera['target'], float) - position
    forward /= np.linalg.norm(forward)
    right = np.cross(forward, [0, 1, 0]); right /= np.linalg.norm(right)
    up = np.cross(right, forward)
    steep = camera['downward_axis_degrees'] >= 60
    u = (box[0] + box[2]) / 2
    v = (box[1] + box[3]) / 2 if steep else box[3]
    K = np.asarray(camera['K'])
    ray = forward + right * (u-K[0, 2])/K[0, 0] + up * (K[1, 2]-v)/K[1, 1]
    if ray[1] >= -1e-6:
        return None
    # Main native floor is static scene context; not simulator actor pose.
    plane = -1.85 + (.75 if steep else 0)
    distance = (plane-position[1])/ray[1]
    if distance <= 0:
        return None
    point = position + distance * ray
    point[1] = -1.85
    return point.tolist()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--frames', type=Path, required=True)
    parser.add_argument('--calibration', type=Path, required=True)
    parser.add_argument('--model', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    started = time.perf_counter()
    cameras = {c['id']: c for c in json.loads(args.calibration.read_text())['cameras']}
    tracks = json.loads(args.input.read_text())
    manifest = json.loads((args.frames/'manifest.json').read_text())
    entries = {(f['camera_id'], f['frame_index']): f for f in manifest['frames']}
    options = ort.SessionOptions(); options.intra_op_num_threads = 2
    session = ort.InferenceSession(str(args.model), sess_options=options, providers=['CPUExecutionProvider'])
    observations = []
    for frame in tracks['frames']:
        if not frame['tracks']:
            continue
        entry = entries[(frame['camera_id'], frame['frame_index'])]
        path = args.frames/entry['file']
        if path.resolve().parent != args.frames.resolve():
            raise ValueError('Frame path escapes camera corpus')
        data = path.read_bytes()
        if hashlib.sha256(data).hexdigest() != frame['frame_sha256'] or entry['sha256'] != frame['frame_sha256']:
            raise ValueError('Frame provenance mismatch')
        image = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
        for track in frame['tracks']:
            allowed={'position','position_anchor','bbox','confidence','position_is_filtered_estimate','local_track_id',
                     'confirmed_at_frame_index','association_confirmation_evidence_at','association_confirmation_media_seconds','associated_after_confirmation'}
            if set(track)-allowed or not track['local_track_id'].startswith(frame['camera_id']+':'):
                raise ValueError('Unexpected track fields or sensor provenance')
            x1, y1, x2, y2 = map(int, track['bbox'])
            crop = image[max(0, y1):min(image.shape[0], y2), max(0, x1):min(image.shape[1], x2)]
            if not crop.size:
                raise ValueError('Invalid camera crop')
            tensor = cv2.resize(crop, (128, 256))[:, :, ::-1].astype(np.float32)/255
            tensor = (tensor-np.array([.485,.456,.406],np.float32))/np.array([.229,.224,.225],np.float32)
            vector = session.run(None, {'images': np.ascontiguousarray(tensor.transpose(2,0,1)[None])})[0][0]
            vector /= max(float(np.linalg.norm(vector)), 1e-9)
            observations.append({**{k:frame[k] for k in ['camera_id','frame_index','observed_at','media_time_seconds','frame_sha256']},
                **track, 'embedding':vector.tolist(), 'floor_estimate_native':floor_estimate(cameras[frame['camera_id']],track['bbox']),
                'location_semantics':'uncertain monocular hypothesis; not observed world position'})
    result = {'model_sha256':hashlib.sha256(args.model.read_bytes()).hexdigest(),
        'calibration_sha256':hashlib.sha256(args.calibration.read_bytes()).hexdigest(),
        'tracks_sha256':hashlib.sha256(args.input.read_bytes()).hexdigest(),
        'processing_seconds':time.perf_counter()-started, 'observations':observations}
    args.output.write_text(json.dumps(result)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k!='observations'}))


if __name__ == '__main__':
    main()
