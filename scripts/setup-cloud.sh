#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -m venv .venv
.venv/bin/python -m pip install --no-input -r services/entity-api/requirements.lock
.venv/bin/python -m pip check
mkdir -p .runtime
cat > .runtime/cloud-compose.yaml <<'YAML'
services:
  entity-api:
    build:
      secrets:
        - proxy_ca
secrets:
  proxy_ca:
    file: /etc/ssl/certs/ca-certificates.crt
YAML
docker compose -f compose.yaml -f .runtime/cloud-compose.yaml build
(cd services/entity-api && ../../.venv/bin/python -m unittest discover -s tests -v)
