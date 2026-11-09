#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$repo_root"
# Replays actual recorded pixels end to end; the evaluator is never mounted into any worker.
P2_VISION_WORKER=detect P2_VISION_MODEL=yolox_s.onnx scripts/spatial-simulation/perception/run-isolated.sh
P2_VISION_WORKER=mot scripts/spatial-simulation/perception/run-isolated.sh
P2_VISION_WORKER=mtmc scripts/spatial-simulation/perception/run-isolated.sh
simulation/spatial-office/.runtime/p2-api-venv/bin/python scripts/spatial-simulation/perception/ingest-core.py --output docs/spatial-simulation/evidence/p2-09/09.9/end-to-end-core.json
