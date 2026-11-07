# ENTITY OS

Sistema modular de inteligencia espacial e IA situada. El núcleo propio representa entidades, estados, relaciones explícitas, eventos, memoria persistente y capacidades.

## Estado

**Implementación en desarrollo, no desplegada.** Se ha incorporado una API inicial con persistencia local y un contenedor Docker. Scorpio es infraestructura externa NGSI-LD; su integración de datos con la API está pendiente. La API mínima se verifica por separado; Scorpio y el sistema completo siguen pendientes.

## Arranque local de desarrollo

Requiere Docker y Docker Compose v2. El arranque mínimo no requiere Scorpio.

```sh
sh scripts/start-local.sh
```

El script construye la API, la inicia y espera una respuesta de salud. Para probar datos tras reiniciar: `python3 scripts/smoke-docker.py` (crea datos sintéticos locales). Consulta la guía `services/entity-api/README.md` y la evidencia en `docs/audits/PHASE-00-2026-11-06.md`. Scorpio se mantiene separado, pendiente de integración.

**Importante:** el API actual utiliza SQLite como almacenamiento provisional. PostgreSQL/PostGIS, proyección NGSI-LD, autorización de capacidades, simulación espacial y visor todavía requieren implementación. No exponer el servicio directamente a Internet.

Documentación: `docs/architecture.md`, `docs/implementation-plan.md`, `AGENTS.md`.
