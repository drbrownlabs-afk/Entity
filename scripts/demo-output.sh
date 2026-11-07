#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PYTHONPATH=services/entity-edge .runtime/edge-venv/bin/python services/entity-edge/demo_output.py
