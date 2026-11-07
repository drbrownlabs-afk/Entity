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


## Actualización vigente Fase 02
Continuación autorizada por operador: EN VALIDACIÓN. Registry y contratos v1, REST real/simulación, autorización básica de integraciones, auditoría, deduplicación e invocación simulada verificadas. 19 tests aprobados y smoke Docker/regresión aprobados. Esquema 3, sin nuevas dependencias; fases anteriores conservadas en historia y pruebas. Ver docs/phases/PHASE-02.md. La prioridad vigente es revisión Fase 02, sin iniciar Fase 03; las entradas anteriores describen sus entregas históricas.


## Publicación comprobada
Implementación: https://github.com/drbrownlabs-afk/Entity/commit/0506df4b0bcb108430f58005a4c35c7002870ca5 . Rama codex/phase-02-connectors publicada y descargada en repositorio bare independiente: árbol completo idéntico. PR intentado con gh pr create: Forbidden en api.github.com/graphql. Consulta gh api Actions para esta rama: Forbidden. No hay PR ni merge a main; CI remoto desconocido, pruebas locales válidas. No se requieren operaciones Git manuales del operador. Fase 02 EN VALIDACIÓN; Fase 03 NO INICIADA.


## Estado vigente — Fase 03
Fase 02 APROBADA por operador. Fase 03 EN VALIDACIÓN: Edge OpenCV HOG/Norfair, vídeo y fixture, zonas/tracks, observaciones con procedencia, entidades/estado Core y cola durable. 20/20 tests Core, 4/4 Edge y demo HTTP real aprobados. 60 frames vídeo → 181 muestras y 68 transiciones, no personas únicas. Fallo/reinicio Core y ACK perdido sin duplicados. Fases 00–02 preservadas; main 1e6b29f integrado sin conflictos. Ver docs/phases/PHASE-03.md. Orbbec y físico diferidos según plan actualizado. Fase 04 NO INICIADA; prioridad vigente revisión humana de Fase 03, reemplaza prioridades históricas anteriores.

Publicación Fase 03 comprobada: 8baea3d95f185bc1df682ab0c74cae56310f0e88, rama codex/phase-03-edge; fetch independiente y ancestros verificados. PR/Actions siguen bloqueados por Forbidden API; sin PR/merge, CI remoto desconocido. La evidencia local es válida. install_script/start_skill guardados en borrador, sin afirmar snapshot publicado.


## Estado vigente — Fase 04 y CI
Main 5ce2519 autoriza Fase 04 tras revisión Fase 03. Output virtual EN VALIDACIÓN: circuito completo y control manual, capacidad declarada, fallos/timeout/readback divergente, 23 tests Core + 4 Edge y demo HTTP aprobados. Esquema 4, migración aditiva, backup previo y smoke Docker correctos. Fase 05 NO INICIADA. PR #1 Fase 03 existente Draft, sin duplicación/merge. CI remoto histórico confirmado Success por web; las afirmaciones anteriores de CI desconocido eran límites de observación API y quedan actualizadas. La API está bloqueada por red en CONNECT antes de GitHub, dominio añadido al borrador pendiente de aplicación. Resultado del nuevo run Fase 04 en informe Actions/bitácora al cierre.

CI Fase 04 verificado Success por web: run 42325368629, commit 520475f, api-tests y edge-tests. Corrección final upload-artifact v6 en progreso de validación. Las advertencias históricas de CI desconocido se sustituyen por esta observación real, no por suposiciones de YAML.

CI final Fase 04 Success sin anotaciones en run 42325648659, commit b715116da5a7645896aa011367aa448bad7123b6; evidencia docs/evidence/phase04-ci.json. Rama codex/phase-04-output publicada/verificada, sin PR nuevo por bloqueo API ni merge. Todo código y workflow validado; cierre posterior solo documental. Pendiente revisión humana Fase 04 y aplicar configuración de red si se necesita gh/API; ningún comando Git/CI manual requerido.
