# ENTITY OpenClaw integration — preparation, not live installation

This directory provides a **single** OpenClaw agent workspace for `entity`. The canonical ENTITY Core and Fase 09/10 remain unchanged. No model authentication, gateway installation or live Core adapter is claimed.

## Verified official installation flow (check installed version before running)
1. Install/update OpenClaw from https://docs.openclaw.ai/start/getting-started and run `openclaw onboard` (custom/classic flow if selecting agent name/workspace is needed). Do not overwrite an existing OpenClaw configuration.
2. Configure exactly one agent with ID `entity` and workspace pointing to `integrations/openclaw/entity-workspace` using the installed version's CLI/config schema. Keep the development repository's root AGENTS.md separate.
3. Use OpenClaw's model authentication, e.g. `openclaw models auth login --provider openai --agent entity`, with the owner's interactive browser OAuth. Never commit tokens. Check `openclaw models status --agent entity`.
4. Install/enable official Codex plugin only if the installed runtime requires it, following https://docs.openclaw.ai/plugins/codex-harness . Verify with a real model turn and runtime status. Use a supported model ID discovered from the installed catalog, not an assumed ID.
5. Confirm ENTITY answers its agent identity from IDENTITY.md, restart and repeat. Verify skills load; workspace Markdown is **not** tool registration.
6. Build a thin authenticated ENTITY Core adapter using the existing API/MCP contracts and register tools via supported OpenClaw plugin/MCP mechanism. No shell/browser/admin tools for the production agent. Enforce actor/site/role permissions server-side and test denial.
7. Run the Phase 11 gates against the Core after Phase 10 completion. A persona-only test is not evidence of situated AI.

## Enterprise customization
Keep one ENTITY agent. Select a versioned organization/site persona server-side per authenticated session. Do not rewrite the global SOUL.md for each tenant. Never allow a tenant persona to override Core security or evidence requirements.

## Current status
Workspace files and skill instructions prepared. Gateway NOT installed or authenticated by this commit. Core adapter NOT implemented. End-to-end tests NOT executed. See docs/phases/PHASE-11.md.
