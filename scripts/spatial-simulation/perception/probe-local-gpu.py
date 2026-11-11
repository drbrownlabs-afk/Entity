"""CUDA readiness probe: pinned model, synthetic zeros, no simulator or GT inputs."""
import argparse
import hashlib
import importlib.metadata
import json
from collections import Counter
from pathlib import Path
import numpy as np
import onnxruntime as ort

p = argparse.ArgumentParser()
p.add_argument('--model', type=Path, required=True)
p.add_argument('--output', type=Path, required=True)
a = p.parse_args()
digest = hashlib.sha256(a.model.read_bytes()).hexdigest()
assert digest == 'c5c2d13e59ae883e6af3b45daea64af4833a4951c92d116ec270d9ddbe998063'
assert not Path('/mnt/c').exists(), 'Host workspace must not be mounted'
assert not Path('/root').exists(), 'Host home must not be mounted'
ort.preload_dlls()
options = ort.SessionOptions()
options.intra_op_num_threads = 2
options.inter_op_num_threads = 1
options.enable_profiling = True
options.profile_file_prefix = '/tmp/cuda-probe'
session = ort.InferenceSession(str(a.model), sess_options=options,
    providers=[('CUDAExecutionProvider', {'gpu_mem_limit': str(1024**3),
                                        'cudnn_conv_algo_search': 'DEFAULT'}), 'CPUExecutionProvider'])
assert session.get_providers()[0] == 'CUDAExecutionProvider', 'CUDA silently unavailable'
inputs = session.get_inputs()[0]
outputs = session.run(None, {inputs.name: np.zeros(inputs.shape, dtype=np.float32)})
assert all(np.isfinite(output).all() for output in outputs)
profile = Path(session.end_profiling())
events = json.loads(profile.read_text())
providers = Counter(event.get('args', {}).get('provider') for event in events
                    if event.get('args', {}).get('provider'))
assert providers['CUDAExecutionProvider'] > 0, 'No GPU kernels executed'
report = {'phase': 'P2-09.10', 'model_sha256': digest, 'input': 'synthetic zero tensor',
          'output_shapes': [list(output.shape) for output in outputs],
          'onnxruntime': ort.__version__, 'providers': session.get_providers(),
          'profile_kernel_providers': dict(providers), 'gpu_kernels_executed': True,
          'workspace_and_home_unmounted': True, 'performance_benchmark': False,
          'dependencies': {name: importlib.metadata.version(name) for name in
                           ['onnxruntime-gpu', 'nvidia-cudnn-cu12', 'nvidia-cuda-runtime-cu12']}}
a.output.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report))
