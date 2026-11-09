#!/usr/bin/env bash
set -euo pipefail
# No actor/evaluator/source scene is mounted. CPU worker gets only pixels, public calibration and models.
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
vision_output="${P2_VISION_OUTPUT:-/tmp/p2-09-vision-output}"
vision_model="${P2_VISION_MODEL:-yolox_s.onnx}"
mkdir -p "$vision_output"
vision_worker="${P2_VISION_WORKER:-detect}"
case "$vision_worker" in
 detect) vision_command=(/venv/bin/python /app/entity_edge/vision.py --frames /frames --model "/models/$vision_model" --contract /FrameManifest.json --output /output/detections.json --assert-inaccessible "$repo_root/simulation/spatial-office/.runtime/p2-09-evaluation/truth.json") ;;
 mot) vision_command=(/venv/bin/python -m entity_edge.mot --input /output/detections.json --output /output/tracks.json) ;;
 mtmc) vision_command=(/venv/bin/python -m entity_edge.mtmc --input /output/tracks.json --frames /frames --calibration /calibration.json --reid-model /models/osnet_ain.onnx --output /output/associations.json) ;;
 *) echo "Unknown isolated worker" >&2; exit 2 ;;
esac
exec bwrap --unshare-net --unshare-pid --die-with-parent \
 --ro-bind /usr /usr --ro-bind /opt /opt --ro-bind /lib /lib --ro-bind /lib64 /lib64 --ro-bind /etc /etc \
 --proc /proc --dev /dev --tmpfs /tmp \
 --ro-bind "$repo_root/services/entity-edge" /app \
 --ro-bind "$repo_root/simulation/spatial-office/.runtime/p2-vision-venv" /venv \
 --ro-bind "$repo_root/simulation/spatial-office/.runtime/p2-09-frames" /frames \
 --ro-bind "$repo_root/simulation/spatial-office/.runtime/p2-vision-models" /models \
 --ro-bind "$repo_root/packages/contracts/perception/v1/FrameManifest.json" /FrameManifest.json \
 --ro-bind "$repo_root/apps/spatial-simulation/public/perception/cameras.json" /calibration.json \
 --bind "$vision_output" /output \
 --setenv PYTHONPATH /app \
 -- "${vision_command[@]}" "$@"
