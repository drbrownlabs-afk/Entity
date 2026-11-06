# ENTITY OS — Estado operativo compartido

Última revisión manual: 2026-11-06. Este archivo se actualiza después de cada tarea de implementación. NO reemplaza inspección de código, CI ni commits.

## Implementado en repositorio (sin verificación de ejecución)
- Esqueleto del monorepo, README, AGENTS.md, arquitectura y plan.
- API FastAPI inicial con SQLite provisional y rutas de entidades, estado, relaciones y eventos.
- Docker/Compose y script de inicio inicial; compatibilidad y ejecución no verificadas.
- Especificación maestra, integración Edge y decisiones.

## Pendiente de implementación/verificación
- PostgreSQL/PostGIS, Scorpio NGSI-LD integrado.
- Contratos Observation/Capability con validación y auditoría.
- ENTITY Edge instalable, Orbbec SDK, RTSP/ONVIF, MQTT, REST, percepción y calibración.
- Autorización, MCP, acciones verificadas y buffer offline.
- Laboratorio con hardware físico y prueba extremo a extremo.
- Demo web centro comercial con mundo 3D y CCTV virtual sincronizados.
- CI/tests reproducibles y despliegue real.

## Fase 00 en curso (2026-11-06)
- Inspección estática de API, tests, dependencias, Docker y script de Scorpio registrada en docs/audits/PHASE-00-2026-11-06.md.
- Se añadió httpx a requirements y workflow CI; no se han confirmado pruebas ejecutadas ni arranque real.
- Mantener fase 01 sin iniciar.

## Próxima prioridad
Contratos y servicios funcionales mínimos Core/Edge, con tests; después conexión Orbbec y salida de pantalla.

## Regla de actualización
Cada tarea Codex debe registrar fecha UTC, branch/commit/PR, objetivo, archivos, funcionalidades realmente implementadas, tests ejecutados y sus resultados, limitaciones y próximo paso. No convertir intención en hecho. Revisar diffs y CI antes de declarar completado.
