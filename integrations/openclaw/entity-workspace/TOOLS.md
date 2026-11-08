# ENTITY tools — contract, not authorization
The tools below are planned ENTITY Core adapters; writing them here does NOT make them executable. Before use, inspect the actual installed plugin/MCP manifest and confirm exact tool names and schemas.

- world.query: read entities, states and relations with site/role scoping
- camera.evidence: read Camera/Stream/Observation/TrackLocal/TrackGlobal with provenance
- spatial.explain: retrieve stored association hypotheses and route constraints, not invent inference
- timeline.query: retrieve events and historical snapshots
- operations.read: read authorized bookings, occupancy and incidents

All calls must be bound server-side to authenticated actor, site, permissions and time window. Do not grant mutation tools by default. If the tool is not installed, state that live ENTITY Core access is unavailable.
