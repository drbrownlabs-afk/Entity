#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -c "import sys; assert sys.version_info[:2] == (3,12), 'Esta entrega está validada con Python 3.12'"
node -e "if(Number(process.versions.node.split('.')[0])<24)throw Error('Se requiere Node 24 o superior')"
python3 -m venv .venv
.venv/bin/python -m pip install --no-input -r services/entity-api/requirements.lock
.venv/bin/python -m pip check
bash scripts/setup-edge.sh
bash scripts/setup-experience.sh
printf 'Preparación terminada. Demostración integrada: bash scripts/demo-entity.sh\n'
