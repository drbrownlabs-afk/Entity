#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
: "${P2_LOCAL_RUN:?Set a local capture run ID}"
[[ "$P2_LOCAL_RUN" =~ ^[a-z0-9][a-z0-9_-]{0,63}$ ]] || exit 2
worker="${P2_VISION_WORKER:-detect}"
output="$repo_root/simulation/spatial-office/.runtime/local-$P2_LOCAL_RUN-output"
frames="$repo_root/simulation/spatial-office/.runtime/local-$P2_LOCAL_RUN-frames"
test -f "$frames/manifest.json"
mkdir -p "$output"
case "$worker" in
 detect) command=(/venv/bin/python /app/entity_edge/vision.py --frames /frames --model /models/yolox_s.onnx --contract /FrameManifest.json --output /output/detections.json --assert-inaccessible "$repo_root/simulation/spatial-office/.runtime/local-$P2_LOCAL_RUN-evaluation/truth.json");;
 mot) command=(/venv/bin/python -m entity_edge.mot --input /output/detections.json --output /output/tracks.json);;
 mtmc) command=(/venv/bin/python -m entity_edge.mtmc --input /output/tracks.json --frames /frames --calibration /calibration.json --reid-model /models/osnet_ain.onnx --output /output/associations.json);;
 *) echo 'Unknown worker' >&2; exit 2;;
esac
exec bwrap --unshare-net --unshare-pid --die-with-parent \
 --ro-bind /usr /usr --ro-bind /lib /lib --ro-bind /lib64 /lib64 --ro-bind /etc /etc \
 --proc /proc --dev /dev --tmpfs /tmp \
 --ro-bind /opt/entity-p2/cpu-venv /venv \
 --ro-bind "$repo_root/services/entity-edge" /app \
 --ro-bind "$frames" /frames \
 --ro-bind "$repo_root/simulation/spatial-office/.runtime/p2-vision-models" /models \
 --ro-bind "$repo_root/packages/contracts/perception/v1/FrameManifest.json" /FrameManifest.json \
 --ro-bind "$repo_root/apps/spatial-simulation/public/perception/cameras.json" /calibration.json \
 --bind "$output" /output --setenv PYTHONPATH /app \
 -- "${command[@]}"
