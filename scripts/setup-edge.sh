#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .runtime
python3 -m venv .runtime/edge-venv
.runtime/edge-venv/bin/python -m pip install -r services/entity-edge/requirements.lock
.runtime/edge-venv/bin/python -m pip check
mkdir -p .runtime/edge
if ! test -f .runtime/edge/vtest.avi; then
  curl --fail --location https://raw.githubusercontent.com/opencv/opencv/9d4808bef88a7aacbb360732303d42b279ebb6b5/samples/data/vtest.avi -o .runtime/edge/vtest.avi
fi
printf '%s\n' '45cddc9490be69345cbdab64ca583be65987e864ca408038e648db99e10516cf  .runtime/edge/vtest.avi' | sha256sum --check
