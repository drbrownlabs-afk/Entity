#!/usr/bin/env sh
set -eu
cd "$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
command -v docker >/dev/null 2>&1 || { echo 'Docker is required' >&2; exit 1; }
# Minimal API only. Scorpio is an optional, separate integration.
docker compose -f compose.yaml up -d --build --wait --wait-timeout 60
printf 'ENTITY API ready on port 8000; interactive documentation: /docs\n'
