# Architecture

ENTITY OS is a spatial intelligence platform for computable environments.

## MVP core
- Entities: stable IDs, types and attributes.
- State: current observable properties with timestamps.
- Relations: explicit typed links between entities.
- Events: append-only changes and provenance.
- Memory: persisted history and continuity across restarts.
- Capabilities: declared operations and authorization boundaries.

## Components
- `services/entity-api`: Python FastAPI facade and domain model.
- `infrastructure/scorpio`: externally deployed NGSI-LD context broker.
- PostgreSQL/PostGIS: persistence and spatial queries.
- `services/perception`: replaceable sensor adapters, initially Orbbec/mock.
- `services/simulation`: deterministic synthetic scenario updates.
- `apps/web`: PlayCanvas-based spatial viewer, loaded independently of data adapters.
- `packages/contracts`: JSON schemas and integration events.
- `packages/mcp-server`: agent-facing tools over authorized Entity API.

## MVP data flow
Adapter or simulator → Entity API → persistent events/state/relations → NGSI-LD context projection → API/web viewer.

## Explicitly deferred
Geodesic/latent relationship fields, indirect dependency discovery, butterfly-effect propagation, real-time 4DGS, multi-agent orchestration and advanced inference.
