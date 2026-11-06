# Codex instructions — ENTITY OS

Build the smallest end-to-end demonstrator. Preserve the proprietary ENTITY core: entities, explicit typed relationships, state, events, persistent memory and capabilities. Do not implement latent/geodesic relation discovery or complex multiagent inference in MVP. Use Scorpio as an external NGSI-LD broker, never vendor its source. Keep the PlayCanvas viewer independent of the backend and all integrations adapter-based. No real footage, credentials or secrets in commits. Work incrementally with tests and documented decisions.


## Canonical ENTITY OS product memory (2026-11-06)
Before implementing or changing ENTITY OS, read `docs/ENTITY-MASTER-SPEC.md`, `docs/EDGE-INTEGRATION-SPEC.md`, and `docs/DECISION-LOG.md`. Treat them as canonical decisions, alongside existing architecture and implementation plans. Maintain a strict distinction between intended architecture, committed implementation, executed tests, and deployed services. For any new product decision, update the master spec and append a dated entry to the decision log in the same development work. Keep hardware actually owned distinct from hypothetical purchases. Core must never depend on Orbbec or any vendor-specific API; adapters and Edge isolate external systems. Keep real pilot and investor simulation as parallel, contract-compatible products.
