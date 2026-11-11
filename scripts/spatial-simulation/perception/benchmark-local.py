"""Compare the existing pixel detector on CPU/CUDA. No evaluator/simulator imports."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import resource
import statistics
import subprocess
import time
import cv2
import jsonschema
import onnxruntime as ort
from entity_edge.vision import YoloX

p = argparse.ArgumentParser()
p.add_argument('--provider', choices=['cpu', 'cuda'], required=True)
p.add_argument('--frames', type=Path, default=Path('/frames'))
p.add_argument('--output', type=Path, required=True)
a = p.parse_args()
assert not Path('/mnt/c').exists() and not Path('/root').exists()
manifest = json.loads((a.frames / 'manifest.json').read_text())
jsonschema.validate(manifest, json.loads(Path('/FrameManifest.json').read_text()))
model = Path('/models/yolox_s.onnx')
assert hashlib.sha256(model.read_bytes()).hexdigest() == 'c5c2d13e59ae883e6af3b45daea64af4833a4951c92d116ec270d9ddbe998063'
def gpu_memory_snapshot():
    if a.provider != 'cuda':
        return None
    try:
        value = subprocess.check_output(['/usr/lib/wsl/lib/nvidia-smi',
            '--query-gpu=memory.used', '--format=csv,noheader,nounits'], text=True)
        return int(value.strip().splitlines()[0])
    except (OSError, ValueError, subprocess.CalledProcessError):
        return None

vram_before = gpu_memory_snapshot()
detector = YoloX(model, .25)
if a.provider == 'cuda':
    ort.preload_dlls()
    options = ort.SessionOptions()
    options.intra_op_num_threads = 2
    options.inter_op_num_threads = 1
    options.enable_profiling = True
    options.profile_file_prefix = '/tmp/cuda-benchmark'
    detector.session = ort.InferenceSession(str(model), sess_options=options, providers=[
        ('CUDAExecutionProvider', {'gpu_mem_limit': str(2 * 1024**3),
                                   'cudnn_conv_algo_search': 'HEURISTIC',
                                   'cudnn_conv_use_max_workspace': '0',
                                   'use_tf32': '0'}), 'CPUExecutionProvider'])
    assert detector.session.get_providers()[0] == 'CUDAExecutionProvider'

def image_for(frame):
    image_path = a.frames / frame['file']
    assert image_path.parent == a.frames
    assert hashlib.sha256(image_path.read_bytes()).hexdigest() == frame['sha256']
    image = cv2.imread(str(image_path))
    assert image is not None
    return image

first = image_for(manifest['frames'][0])
for _ in range(3):
    detector.detect(first)
vram_after_warmup = gpu_memory_snapshot()
profile_providers = {}
if a.provider == 'cuda':
    # Prove GPU execution during warmup, then stop tracing before measuring.
    # Profiling every kernel in the timed loop would bias CPU/GPU comparison.
    events = json.loads(Path(detector.session.end_profiling()).read_text())
    profile_providers = dict(Counter(event.get('args', {}).get('provider') for event in events
                                    if event.get('args', {}).get('provider')))
    assert profile_providers.get('CUDAExecutionProvider', 0) > 0
rows = []
start = time.perf_counter()
for frame in manifest['frames']:
    image = image_for(frame)
    before = time.perf_counter()
    boxes = detector.detect(image)
    rows.append({'camera_id': frame['camera_id'], 'frame_index': frame['frame_index'],
                 'observed_at': frame['observed_at'], 'media_time_seconds': frame['media_time_seconds'],
                 'frame_sha256': frame['sha256'], 'image_size': [image.shape[1], image.shape[0]],
                 'detections': boxes, 'inference_ms': (time.perf_counter() - before) * 1000})
seconds = time.perf_counter() - start
vram_after_run = gpu_memory_snapshot()
timings = sorted(row['inference_ms'] for row in rows)
report = {'input': 'pixels and legitimate camera metadata only', 'isolated_truth_read_blocked': True,
          'provider': a.provider, 'model': 'YOLOX-S official Megvii COCO person class',
          'model_sha256': hashlib.sha256(model.read_bytes()).hexdigest(), 'threshold': .25,
          'head_decoding_required': detector.decode, 'warmup_frames_excluded': 3,
          'timed_loop_profiling': False,
          'precision': 'FP32; TF32 disabled for CPU/CUDA equivalence',
          'gpu_global_memory_mib': {'before_session': vram_before,
                                    'after_warmup': vram_after_warmup,
                                    'after_timed_run': vram_after_run,
                                    'scope': 'whole GPU snapshots, not process peak VRAM'},
          'processing_seconds': seconds, 'frames_per_second': len(rows) / seconds,
          'median_inference_ms': statistics.median(timings), 'p95_inference_ms': timings[int(.95*(len(timings)-1))],
          'peak_rss_kib': resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
          'profile_kernel_providers': profile_providers, 'onnxruntime': ort.__version__, 'frames': rows}
a.output.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({key: value for key, value in report.items() if key != 'frames'}))
