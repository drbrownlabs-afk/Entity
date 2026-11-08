#!/usr/bin/env bash
set -euo pipefail
echo "[ENTITY] Codespace demo setup"
node --version
npm --version
if command -v openclaw >/dev/null 2>&1; then
  echo "[ENTITY] OpenClaw already installed: $(command -v openclaw)"
else
  echo "[ENTITY] Installing official OpenClaw CLI..."
  npm install -g openclaw@latest
fi
openclaw --version
echo
echo "[ENTITY] Workspace: $PWD/integrations/openclaw/entity-workspace"
echo "[ENTITY] Next: run 'openclaw onboard' interactively; select an isolated demo configuration and the entity workspace."
echo "[ENTITY] Do not commit OAuth tokens or ~/.openclaw."
echo "[ENTITY] No gateway has been started by setup."
