# Implementation plan

1. Boot the local stack using Docker Compose: PostgreSQL/PostGIS, Scorpio and Entity API.
2. Implement minimal persistence for entities, typed relations, events and current state; add migration scripts and unit tests.
3. Expose FastAPI endpoints for create/read entities, update state, link relations, append/read events and query history.
4. Provide an adapter contract and a deterministic coworking simulator with repeatable fixtures.
5. Build a lightweight PlayCanvas spatial viewer; bind visible entity state to selectable scene objects.
6. Add shopping-mall fixtures to demonstrate reuse without core changes.
7. Expose a minimal authorized MCP tool surface; document security and run end-to-end tests.

Acceptance: restart preserves history, state and relations; simulator changes propagate into the viewer; one adapter can be replaced without rewriting the core; two worlds reuse the same Entity API.
