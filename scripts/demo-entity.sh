#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ ! -x .venv/bin/python || ! -x .runtime/edge-venv/bin/python ]]; then
  echo 'Faltan dependencias. Ejecuta bash scripts/setup-demo.sh.' >&2
  exit 1
fi
mkdir -p .runtime/release-demo
PYTHONPATH=services/entity-edge .runtime/edge-venv/bin/python scripts/demo-release.py
