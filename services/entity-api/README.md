# Entity API — Core local 0.2.0

Minimal FastAPI implementation of persistent entities, state, explicit typed relations and event history. The state-change operation automatically appends a historical event.

## Local run

```bash
cd services/entity-api
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.lock
uvicorn app.main:app --reload
```

Open `http://localhost:8000/docs` for interactive API documentation. Run tests with `python -m unittest discover -s tests -v`.

SQLite is an **initial local development store**, not the production storage architecture. Planned: PostgreSQL/PostGIS, Scorpio NGSI-LD projection, versioned contracts, capability authorization and device adapters. The API is not production-hardened; do not expose it publicly without authentication and access control.

## Phase 00 checks

From the repository root, `sh scripts/start-local.sh` builds and starts only the API,
waiting for HTTP health. `python3 scripts/smoke-docker.py` writes synthetic records,
restarts the API container and checks entities, attributes, state, relations and events.
It retains those records in the development volume. Never run it against production.
`docker compose down` stops services while preserving data; `down -v` deletes data.

The unittest suite includes an actual two-process restart test using an isolated
SQLite file. `/health` is a liveness endpoint, not a database readiness guarantee.
Pinned Python dependencies are in `requirements.lock`; deliberate upgrades should
regenerate that file and rerun all checks. The Docker base image is pinned by digest.

In this managed cloud environment, the build needs the platform CA. Mount the
system CA bundle as BuildKit secret `proxy_ca` (see the cloud setup instructions).
The certificate is never copied into the image. Normal hosts use their default CA.
Scorpio is optional external infrastructure and is not started or validated here.

## Phase 01

Versioned Core records, explicit memories, declaration-only capabilities and atomic SQLite
migrations are documented in `../../docs/phases/PHASE-01.md` (from repository root:
`docs/phases/PHASE-01.md`). The new `/ready` checks schema availability. Back up existing
SQLite files before upgrading; migration is forward-only and rejects future schema versions.
The Docker smoke now verifies five events, a memory and a capability after restarting.
The published OpenAPI contract is `packages/contracts/core/v1/openapi.json`.
