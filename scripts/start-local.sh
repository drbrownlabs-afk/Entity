#!/usr/bin/env sh
set -eu
# Run upstream Scorpio using its maintained official compose file.
# This avoids duplicating/version-drifting Scorpio infrastructure.
if ! command -v docker >/dev/null 2>&1; then echo 'Docker is required' >&2; exit 1; fi
mkdir -p .runtime
if [ ! -f .runtime/scorpio-compose.yml ]; then
  curl -fL https://raw.githubusercontent.com/ScorpioBroker/ScorpioBroker/development-quarkus/docker-compose-aaio.yml -o .runtime/scorpio-compose.yml
fi
docker compose -f .runtime/scorpio-compose.yml up -d
docker compose -f compose.yaml up -d --build
printf 'ENTITY API: http://localhost:8000/docs\nScorpio: http://localhost:9090/ngsi-ld/v1/\n'
