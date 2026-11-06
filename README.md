# ENTITY OS

Sistema modular de inteligencia espacial e IA situada. El núcleo propio representa entidades, estados, relaciones explícitas, eventos, memoria persistente y capacidades.

## Estado

**Implementación en desarrollo, no desplegada.** Se ha incorporado una API inicial con persistencia local y un contenedor Docker. Scorpio es infraestructura externa NGSI-LD; su integración de datos con la API está pendiente. No se ha verificado el arranque completo.

## Arranque local de desarrollo

Requiere Docker Compose, `curl` y una máquina con capacidad para ejecutar Scorpio.

```sh
sh scripts/start-local.sh
```

El script descarga el archivo Compose mantenido por Scorpio desde su repositorio oficial y levanta los servicios. La configuración exacta y compatibilidad de la versión upstream deben verificarse antes de considerarlo un instalador probado. Para consultar la API: http://localhost:8000/docs.

**Importante:** el API actual utiliza SQLite como almacenamiento provisional. PostgreSQL/PostGIS, proyección NGSI-LD, autorización de capacidades, simulación espacial y visor todavía requieren implementación. No exponer el servicio directamente a Internet.

Documentación: `docs/architecture.md`, `docs/implementation-plan.md`, `AGENTS.md`.
