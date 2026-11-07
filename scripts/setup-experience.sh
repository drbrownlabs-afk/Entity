#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .runtime/npm-cache
npm --prefix apps/web --cache "$PWD/.runtime/npm-cache" ci
npm --prefix apps/web --cache "$PWD/.runtime/npm-cache" run build
