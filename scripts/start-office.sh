#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ $# -gt 1 || ( $# -eq 1 && "$1" != '--api-only' ) ]]; then
  printf 'Uso: bash scripts/start-office.sh [--api-only]\n' >&2
  exit 2
fi
mkdir -p .runtime/office
compose=(docker compose -f compose.office.yaml)
if [[ -n "${ENTITY_BUILD_CA_FILE:-}" ]]; then
  test -r "$ENTITY_BUILD_CA_FILE"
  compose+=(-f compose.build-ca.yaml)
fi
"${compose[@]}" build entity-office
# Use the locked Python dependencies inside the image. Never require a host virtualenv.
"${compose[@]}" run --rm --no-deps --user "$(id -u):$(id -g)" \
  -v "$PWD/scripts:/project/scripts:ro" -v "$PWD/worlds:/project/worlds:ro" \
  -e PYTHONPATH=/app --entrypoint python entity-office \
  /project/scripts/bootstrap-office.py --database /data/core.sqlite3
"${compose[@]}" up -d --no-build --wait entity-office
printf 'ENTITY Core: http://127.0.0.1:%s/docs\nCredenciales privadas: .runtime/office/access.json (no compartir)\n' "${ENTITY_OFFICE_PORT:-8010}"
if [[ "${1:-}" == '--api-only' ]]; then exit 0; fi
node -e "if(Number(process.versions.node.split('.')[0])<24)throw Error('Esta entrega requiere Node 24 o superior')"
npm --prefix apps/web ci
npm --prefix apps/web run build
printf 'ENTITY Office: http://127.0.0.1:4175/office.html\nRecepción: /kiosk.html · Cuenta personal: /personal.html\n'
exec npm --prefix apps/web run preview -- --port 4175 --strictPort
