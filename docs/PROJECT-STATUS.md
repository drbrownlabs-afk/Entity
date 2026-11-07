# ENTITY OS — Estado operativo compartido

Última revisión manual: 2026-11-06. Este archivo se actualiza después de cada tarea de implementación. NO reemplaza inspección de código, CI ni commits.

## Implementado y verificado localmente en Fase 00
- Esqueleto del monorepo, README, AGENTS.md, arquitectura y plan.
- API FastAPI inicial con SQLite provisional y rutas de entidades, estado, relaciones y eventos.
- Docker/Compose y arranque mínimo API con healthcheck ejecutados; dependencias fijadas y verificadas.
- Especificación maestra, integración Edge y decisiones.

## Pendiente de implementación/verificación
- PostgreSQL/PostGIS, Scorpio NGSI-LD integrado.
- Contratos Observation/Capability con validación y auditoría.
- ENTITY Edge instalable, Orbbec SDK, RTSP/ONVIF, MQTT, REST, percepción y calibración.
- Autorización, MCP, acciones verificadas y buffer offline.
- Laboratorio con hardware físico y prueba extremo a extremo.
- Demo web centro comercial con mundo 3D y CCTV virtual sincronizados.
- Ejecución remota de CI y despliegue real (las pruebas locales ya se ejecutaron).

## Fase 00 — EN VALIDACIÓN (2026-11-06 Ecuador / 2026-11-07 UTC)
- 4/4 unittest aprobados; HTTP health, validaciones de error e integridad, reinicio de proceso real.
- Docker construido y API saludable; dos smoke tests confirman persistencia de entidades, atributos, estados, relaciones y eventos tras reinicio del contenedor.
- Fallo inicial de confianza CA corregido con secreto de build y TLS activo; advertencia httpx/TestClient pendiente de futura actualización.
- API local queda iniciada. Evidencia y comandos: docs/audits/PHASE-00-2026-11-06.md.
- install_script y start_skill guardados en borrador del entorno; no publicado ni restaurado en nueva tarea.
- Implementación 8f3815cb9e437e5d07768c4d9cbb48f49af466c7 publicada en GitHub, rama `codex/phase-00-validation`; descargada de nuevo mediante Git independiente y SHA confirmado.
- Cambios de main incorporados por merge documental, sin alterar API/tests/configuración ya probados. Script cloud probado y pasos de arranque también versionados en scripts/setup-cloud.sh y docs/CLOUD-ENVIRONMENT.md.
- Creación automática de PR bloqueada: `gh pr create` devuelve Forbidden en api.github.com/graphql. Consulta de Actions bloqueada en api.github.com; CI remoto no confirmado. Rama publicada, sin PR ni merge a main.

## Fase 01 — EN VALIDACIÓN
- Operador autorizó continuar Fase 01; no se marca Fase 00 como APROBADA automáticamente.
- API 0.2.0: migraciones SQLite 001/002, memorias explícitas, capacidades declaradas, eventos con fuente/versión y /ready. Contrato OpenAPI versionado en packages/contracts/core/v1.
- 15/15 pruebas ejecutadas/aprobadas; persistencia verificada en dos procesos y reinicio Docker. Datos antiguos del volumen conservados y comparados con backup. Escrituras concurrentes e integridad transaccional verificadas.
- Se mantiene SQLite local por alcance/necesidad; sin PostgreSQL/PostGIS ni proyección Scorpio. Sin ejecución/autorización de capacidades ni conectores: Fase 02 NO INICIADA.
- Implementación publicada en codex/phase-01-core: 001d2f810cab0e427a1d179ff558b8bc5fa3bc4a, sobre 566e883. Descarga Git independiente confirma SHA y árbol completo. Evidencia en docs/phases/PHASE-01.md.
- PR no creado: gh pr create devuelve Forbidden en api.github.com/graphql; consulta Actions también Forbidden. Sin merge a main; CI remoto desconocido. API local continúa saludable.

## Próxima prioridad
Revisión humana de Fase 01 y límites documentados; no avanzar Fase 02 sin aprobación. No hay aprobación automática.

## Regla de actualización
Cada tarea Codex debe registrar fecha UTC, branch/commit/PR, objetivo, archivos, funcionalidades realmente implementadas, tests ejecutados y sus resultados, limitaciones y próximo paso. No convertir intención en hecho. Revisar diffs y CI antes de declarar completado.
