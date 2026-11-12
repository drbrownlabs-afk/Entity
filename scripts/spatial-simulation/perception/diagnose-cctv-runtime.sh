#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
output="$repo_root/docs/spatial-simulation/evidence/p2-09/09.19"
mkdir -p "$output"
exec bwrap --unshare-net --unshare-pid --die-with-parent \
 --ro-bind /usr /usr --ro-bind /lib /lib --ro-bind /lib64 /lib64 --ro-bind /etc /etc --proc /proc --dev /dev --tmpfs /tmp \
 --dev-bind /dev/dxg /dev/dxg --ro-bind /opt/entity-p2/gpu-venv /venv \
 --ro-bind "$repo_root/services/entity-edge" /app \
 --ro-bind "$repo_root/scripts/spatial-simulation/perception/diagnose-cctv-runtime.py" /probe.py \
 --ro-bind /opt/entity-p2/corpora/accept18-v0/frames /frames \
 --ro-bind "$repo_root/simulation/spatial-office/.runtime/p2-vision-models" /models \
 --ro-bind "$repo_root/simulation/spatial-office/.runtime/cctv-trial-accept18-v0/output/accept18/tracks-tuned.json" /tracks.json \
 --bind "$output" /output --setenv PYTHONPATH /app --setenv PYTHONDONTWRITEBYTECODE 1 \
 -- /venv/bin/python /probe.py
