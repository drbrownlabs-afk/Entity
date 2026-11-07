#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
.venv/bin/python scripts/bootstrap-office.py
docker compose -f compose.office.yaml up -d --build --wait
printf 'ENTITY Office: API local http://127.0.0.1:%s/docs; visor office.html. Credenciales privadas: .runtime/office/access.json\n' "${ENTITY_OFFICE_PORT:-8010}"
