# Codex handoff — ENTITY OS

## Objective
Build and RUN an integrated, reproducible spatial intelligence MVP, not just disconnected service skeletons. All source code, schemas, deployment configurations, migrations, sample fixtures, tests and run instructions must be committed to `drbrownlabs-afk/Entity`. Never commit secrets, runtime databases or generated large assets.

## Existing state (audit before editing)
- `services/entity-api/app/main.py`: first FastAPI/SQLite vertical slice; unverified.
- `compose.yaml`: currently only launches Entity API with SQLite; **not a complete ENTITY deployment**.
- `scripts/start-local.sh`: attempts to download an upstream Scorpio Compose file; its URL and compatibility are **not verified**. Do not assume it works.
- `docs/architecture.md`, `docs/implementation-plan.md`, `AGENTS.md`: design documents.

## Non-negotiable architecture
ENTITY-owned domain core: stable entities, typed explicit relations, current state, append-only events, persistent memory/history, declared capabilities and authorization. Use PostgreSQL/PostGIS for durable production-oriented storage. Integrate Scorpio NGSI-LD as an external context broker/interop projection, **not** the proprietary core or sole source of event history. Connectors and the PlayCanvas visualization must remain replaceable. Use only synthetic people/occupancy data in demo. Orbbec is a future available sensor adapter; do not assume the user owns CCTV/NVR systems.

## Execution plan
1. Inspect repository and run the existing tests; report and fix any failures. Replace deprecated APIs and unsafe error handling.
2. Verify Scorpio's current official Docker/Quarkus deployment docs and compatible image tags. Create a working reproducible Compose stack (PostgreSQL/PostGIS, Scorpio and Entity API). Beware that Scorpio may require its own database/schema and other dependencies. Do not download an unpinned moving Compose file at runtime.
3. Migrate ENTITY persistence to PostgreSQL with versioned migrations, atomic state + event writes, referential integrity and history queries. Do not conflate Scorpio's internal persistence with ENTITY's event store.
4. Implement an NGSI-LD projection adapter to Scorpio, with retry/idempotency and meaningful health/readiness checks. Explicitly document the mapping and failure behavior.
5. Complete versioned API/contracts for entities, state, relations, events, capabilities and authorization. Enforce capabilities server-side; avoid exposing mutating endpoints without auth on a public interface.
6. Implement a deterministic coworking demo: floors, rooms, door and sensor entities, occupancy transitions, relations, history. Provide a second shopping-mall fixture to demonstrate reuse.
7. Add a minimal browser-based spatial view (PlayCanvas or lightweight alternative for first run), reading live Entity API state. Do not require a GPU or heavyweight Gaussian Splat model for the first demo.
8. Expose a small, authorized MCP tool surface for entity queries and approved operations. Keep the core independent of the LLM.
9. Execute unit/integration/end-to-end tests inside the cloud development environment; include cold start, persistence after restart, Scorpio unavailable/recovery, and browser demo where possible.
10. Commit changes in reviewable increments, with clear run instructions, exact image versions, evidence of successful commands and known limitations.

## Acceptance criteria
- A fresh cloud development environment can run the documented startup command.
- ENTITY API, database and Scorpio report healthy (if available in environment).
- A simulated occupancy event changes current state, appends immutable history, and updates the spatial view.
- The state and history survive service restart.
- A query returns explicit typed relationships and historical events.
- A second scenario reuses the same domain core.
- The repo contains all source/config necessary to reproduce the environment; no secrets or runtime databases.
- If cloud Docker/ports are restricted, state the exact restriction, run everything feasible, and leave a verified fallback. Never claim a stack was deployed without actually starting it.

## Out of scope for first pilot
Latent/geodesic relation fields, butterfly-effect propagation, advanced inference, multi-agent orchestration, 4DGS and high-fidelity real-time capture.

## Reporting
Provide commit SHAs, commands executed, observed results, endpoints, remaining blockers and precise next steps. Do not stop at a scaffold or a plan.
