#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
probe_output="$repo_root/docs/spatial-simulation/evidence/p2-09/09.10/local-environment"
mkdir -p "$probe_output"
exec bwrap --unshare-net --unshare-pid --die-with-parent \
 --ro-bind /usr /usr --ro-bind /lib /lib --ro-bind /lib64 /lib64 --ro-bind /etc /etc \
 --proc /proc --dev /dev --dev-bind /dev/dxg /dev/dxg --tmpfs /tmp \
 --ro-bind /opt/entity-p2/gpu-venv /venv \
 --ro-bind "$repo_root/scripts/spatial-simulation/perception/probe-local-gpu.py" /probe.py \
 --ro-bind "$repo_root/simulation/spatial-office/.runtime/p2-vision-models/yolox_s.onnx" /model.onnx \
 --bind "$probe_output" /output \
 -- /venv/bin/python /probe.py --model /model.onnx --output /output/gpu-probe.json
