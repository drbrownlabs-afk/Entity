#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v ffmpeg >/dev/null || { echo 'FFmpeg is required; install via the official OS package manager.' >&2; exit 1; }
docker info >/dev/null
bash scripts/setup-edge.sh
docker pull bluenviron/mediamtx:1.12.3@sha256:3634a1eed1288b93e8d22ed74694eae96d483fcf676cac5d0c91830ad1b86b3d
docker pull eclipse-mosquitto:2.0.22@sha256:81a6193ae693942a3231cd3ac52875b02b7e3a19da671b2fb4b55cc874c5b279
