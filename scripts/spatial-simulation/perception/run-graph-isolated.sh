#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
output="$repo_root/simulation/spatial-office/.runtime/cctv-graph-isolated"
mkdir -p "$output/graph" "$output/evidence"
exec bwrap --unshare-net --unshare-pid --die-with-parent \
 --ro-bind /usr /usr --ro-bind /lib /lib --ro-bind /lib64 /lib64 --ro-bind /etc /etc --proc /proc --dev /dev --tmpfs /tmp \
 --ro-bind /opt/entity-p2/cpu-venv /venv \
 --ro-bind "$repo_root/scripts/spatial-simulation/perception/build-cctv-graph.py" /repo/scripts/spatial-simulation/perception/build-cctv-graph.py \
 --ro-bind "$repo_root/services/entity-edge" /repo/services/entity-edge \
 --ro-bind "$repo_root/simulation/spatial-office/.runtime/cctv-static-context.json" /repo/simulation/spatial-office/.runtime/cctv-static-context.json \
 --ro-bind "$repo_root/apps/spatial-simulation/public/perception/profiles/cctv-c.json" /repo/apps/spatial-simulation/public/perception/profiles/cctv-c.json \
 --ro-bind "$repo_root/packages/contracts/perception/v1/SensorSpatialGraph.json" /repo/packages/contracts/perception/v1/SensorSpatialGraph.json \
 --ro-bind "$repo_root/docs/spatial-simulation/evidence/p2-09/09.12/gate.json" /repo/docs/spatial-simulation/evidence/p2-09/09.12/gate.json \
 --bind "$output/graph" /repo/simulation/spatial-office/perception \
 --bind "$output/evidence" /repo/docs/spatial-simulation/evidence/p2-09/09.13 \
 --setenv P2_GRAPH_ISOLATED 1 --setenv PYTHONDONTWRITEBYTECODE 1 \
 -- /venv/bin/python /repo/scripts/spatial-simulation/perception/build-cctv-graph.py
