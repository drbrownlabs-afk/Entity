"""Evaluator-only summary of local reproduction; never an inference input."""
import argparse
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[3]
p = argparse.ArgumentParser()
p.add_argument('--run', required=True)
a = p.parse_args()
assert re.fullmatch(r'[a-z0-9][a-z0-9_-]{0,63}', a.run)
evidence = ROOT / f'docs/spatial-simulation/evidence/p2-09/09.11/{a.run}'
runtime = ROOT / 'simulation/spatial-office/.runtime'
worker = runtime / f'local-{a.run}-output'
read = lambda path: json.loads(path.read_text())
old = read(ROOT / 'docs/spatial-simulation/evidence/p2-09/09.4/manifest.json')
new = read(runtime / f'local-{a.run}-frames/manifest.json')
old_hashes = {frame['file']: frame['sha256'] for frame in old['frames']}
matching = sum(old_hashes.get(frame['file']) == frame['sha256'] for frame in new['frames'])
det = read(worker / 'detections.json')
mot = read(worker / 'tracks.json')
mtmc = read(worker / 'associations.json')
evaluation = read(evidence / 'evaluation/detection-checks.json')
replay = read(evidence / 'core/replay.json')
restart = read(evidence / 'core/restart.json')
isolation = read(evidence / 'isolation.json')
cpu = read(worker / 'benchmark-cpu.json')
gpu = read(worker / 'benchmark-cuda.json')
assert matching == len(new['frames']) == 246
assert replay['duplicate_observations'] == 251 and not replay['world_revision_changed']
assert restart['world_and_memory_preserved'] and isolation['passed']
assert len(cpu['frames']) == len(gpu['frames']) == 246
count_differences = 0
max_bbox_delta = 0.
max_confidence_delta = 0.
for left, right in zip(cpu['frames'], gpu['frames']):
    assert (left['camera_id'], left['frame_index'], left['frame_sha256']) == (right['camera_id'], right['frame_index'], right['frame_sha256'])
    if len(left['detections']) != len(right['detections']):
        count_differences += 1
        continue
    for x, y in zip(sorted(left['detections'], key=lambda d: d['bbox']), sorted(right['detections'], key=lambda d: d['bbox'])):
        max_bbox_delta = max(max_bbox_delta, max(abs(v-w) for v,w in zip(x['bbox'],y['bbox'])))
        max_confidence_delta = max(max_confidence_delta, abs(x['confidence']-y['confidence']))
assert count_differences == 0 and max_bbox_delta < .1 and max_confidence_delta < .001
counts = evaluation['per_camera'].values()
opportunities = sum(row['gt_visible_frames'] for row in counts)
true_positive = sum(row['tp_iou50'] for row in counts)
report = {
    'phase': 'P2-09.11', 'technical_gate_passed': True, 'human_final_acceptance': False,
    'new_local_capture': True, 'historical_pngs_required': False,
    'exact_historical_png_hash_matches': matching, 'frames': len(new['frames']),
    'person_detections': sum(len(row['detections']) for row in det['frames']),
    'visible_opportunities': opportunities, 'true_positive_iou50': true_positive,
    'per_view_recall': true_positive/opportunities,
    'false_positive_boxes_iou30': sum(row['false_positive_boxes_iou30'] for row in counts),
    'local_tracks': sum(len(row['local_ids']) for row in mot['per_camera'].values()),
    'provisional_global_groups': len(mtmc['groups']),
    'accepted_cross_camera_associations': sum(edge['accepted'] for edge in mtmc['associations']),
    'cpu_gpu': {provider: {key: data.get(key) for key in ['onnxruntime', 'processing_seconds', 'frames_per_second',
                  'median_inference_ms', 'p95_inference_ms', 'peak_rss_kib', 'gpu_global_memory_mib']}
                for provider, data in [('cpu', cpu), ('cuda', gpu)]},
    'cpu_gpu_detection_count_differences': count_differences,
    'cpu_gpu_max_bbox_delta_pixels': max_bbox_delta,
    'cpu_gpu_max_confidence_delta': max_confidence_delta,
    'same_core_http_replay_unchanged': True, 'same_core_real_restart_preserved': True,
    'core_logical_people': replay['logical_people_preserved'],
    'local_history_difference': 'Fresh local P1 has twelve declared people; two historical technical identities from the former machine were not transferred or fabricated.',
    'isolation_tests': isolation,
    'limitations': ['Baseline quality is reproduced, not improved: new-profile >=95% goal remains pending.',
                    'GPU global memory snapshots are not process peak VRAM.',
                    'Detector batch benchmark does not certify complete live pipeline throughput.',
                    'OSNet export has identical weights and parity but a different binary hash, documented in09.10.',
                    'Native units are not a certified physical survey; no real CCTV/VMS connected.']
}
(evidence / 'reproduction.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
