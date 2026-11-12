#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
: "${P2_TRIAL_RUN:?Set corpus run}"
[[ "$P2_TRIAL_RUN" =~ ^[a-z0-9_-]+$ ]] || exit 2
experiment="${P2_EXPERIMENT:-initial-cuda}"
[[ "$experiment" =~ ^[a-z0-9_-]+$ ]] || exit 2
worker="${P2_VISION_WORKER:-detect-initial}"
frames="/opt/entity-p2/corpora/$P2_TRIAL_RUN/frames"
output="$repo_root/simulation/spatial-office/.runtime/cctv-trial-$P2_TRIAL_RUN/output/$experiment"
test -f "$frames/manifest.json"
mkdir -p "$output"
runtime=/opt/entity-p2/cpu-venv
extra=()
case "$worker" in
 detect-initial|detect)
  provider="${P2_DETECTOR_PROVIDER:-cuda}"
  if test "$provider" = cuda;then runtime=/opt/entity-p2/gpu-venv;extra=(--dev-bind /dev/dxg /dev/dxg);fi
  if test "$worker" = detect;then command=(/venv/bin/python /cctv-detector.py --provider "$provider" --threshold "${P2_DETECT_THRESHOLD:-0.1}" --tile-sensors "${P2_TILE_SENSORS:-}" --output /output/detections.json);else command=(/venv/bin/python /benchmark.py --provider "$provider" --output /output/detections.json);fi;;
 mot-tuned) command=(/venv/bin/python -m entity_edge.cctv_mot --input /output/detections.json --output /output/tracks-tuned.json --calibration /calibration.json);;
 mot) command=(/venv/bin/python -m entity_edge.mot --input /output/detections.json --output /output/tracks.json);;
 reid) runtime=/opt/entity-p2/gpu-venv;command=(/venv/bin/python -m entity_edge.cctv_reid --input /output/tracks-tuned.json --frames /frames --calibration /calibration.json --model /models/osnet_ain.onnx --output /output/reid-evidence.json);;
 mtmc) command=(/venv/bin/python -m entity_edge.cctv_mtmc --input /output/reid-evidence.json --graph /spatial-graph.json --calibration /calibration.json --output /output/global-tracks.json);;
 *) echo 'Unknown CCTV worker' >&2;exit 2;;
esac
exec bwrap --unshare-net --unshare-pid --die-with-parent \
 --ro-bind /usr /usr --ro-bind /lib /lib --ro-bind /lib64 /lib64 --ro-bind /etc /etc --proc /proc --dev /dev --tmpfs /tmp "${extra[@]}" \
 --ro-bind "$runtime" /venv --ro-bind "$repo_root/services/entity-edge" /app \
 --ro-bind "$repo_root/scripts/spatial-simulation/perception/benchmark-local.py" /benchmark.py \
 --ro-bind "$repo_root/scripts/spatial-simulation/perception/detect-cctv.py" /cctv-detector.py \
 --ro-bind "$frames" /frames \
 --ro-bind "$repo_root/simulation/spatial-office/.runtime/p2-vision-models" /models \
 --ro-bind "$repo_root/packages/contracts/perception/v1/FrameManifest.json" /FrameManifest.json \
 --ro-bind "$repo_root/packages/contracts/perception/v1/SensorSpatialGraph.json" /GraphContract.json \
 --ro-bind "$repo_root/apps/spatial-simulation/public/perception/profiles/cctv-c.json" /calibration.json \
 --ro-bind "$repo_root/simulation/spatial-office/perception/cctv-c-spatial-graph.json" /spatial-graph.json \
 --bind "$output" /output --setenv PYTHONPATH /app --setenv PYTHONDONTWRITEBYTECODE 1 \
 -- /usr/bin/bash -c 'test ! -e /evaluation/truth.json && test ! -e /mnt/c && test ! -e /root || exit 99; exec "$@"' _ "${command[@]}"
