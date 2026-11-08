# ENTITY / OpenClaw — temporary Codespaces demo

**Purpose:** disposable proof-of-concept, NOT a 24/7 server, production deployment or an approved Phase 11 E2E test.

## Launch
1. Open the GitHub repository at branch `codex/phase-09-autonomous-plan`.
2. Select **Code → Codespaces → Create codespace on this branch**. The devcontainer installs Node 22 and the official OpenClaw CLI via `npm install -g openclaw@latest`. Inspect the installation log and version; this is an intentionally unpinned demo, not a production lockfile.
3. Open the terminal and run `openclaw onboard`. Use the installed version's supported interactive options to create/configure **one** agent ID `entity`, named ENTITY, with workspace `$PWD/integrations/openclaw/entity-workspace`. Do not overwrite any existing agent if the CLI finds a preexisting configuration.
4. Choose supported **ChatGPT/Codex OAuth** during onboarding, if offered, and complete the user-directed authentication. Do not share credentials in chat or commit `~/.openclaw`, tokens or environment variables. If OAuth redirect or browser flow fails in Codespaces, follow the installed OpenClaw official remote/headless onboarding guidance instead of copying tokens to Git.
5. Start the Gateway with the installed CLI's documented command (typically `openclaw gateway`), bind to loopback and keep authentication enabled. Do not set a Codespaces forwarded port to **public**. Use Codespaces private port forwarding only if absolutely required, with Gateway authentication.
6. Test identity in a real agent turn: ask «¿Cómo te llamas?»; expected agent name ENTITY. Restart and repeat to verify workspace persistence.
7. Before any situated-AI claim, implement and register the thin read-only Core adapter and test live queries, site permissions, provenance and errors. Skills Markdown are guidance, **not** callable APIs.

## Validation
- `node --version`, `openclaw --version`, `openclaw doctor` (where supported)
- One authenticated model conversation returns ENTITY identity
- Switch provider if configured and confirm workspace identity remains constant
- A building question without an installed Core tool must explicitly say live Core access is unavailable
- Core-connected questions require verifiable Core evidence, not mock or fabricated responses

## Cost and persistence
Codespaces has usage quotas and can incur charges after the allowance. Stop/delete the codespace when done. Files committed to Git persist; uncommitted workspace changes and `~/.openclaw` may be lost when deleting. Never commit secrets. For production, use a VPS and secure secret storage later.

## Status
Devcontainer prepared. No Codespace created by this commit, no OAuth completed, no Gateway running, no live Core tool connected.
