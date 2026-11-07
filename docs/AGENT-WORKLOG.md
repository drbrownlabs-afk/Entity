# ENTITY OS — Bitácora compartida de agentes

Este archivo permite que ChatGPT, Codex y colaboradores reconstruyan trabajo sin compartir contextos privados de conversación. Los commits y PRs de GitHub son la evidencia primaria.

## Formato obligatorio de entrada
### YYYY-MM-DD HH:MM UTC — agente / tarea
- Objetivo:
- Rama / PR / commit:
- Archivos modificados:
- Implementación real:
- Pruebas ejecutadas y resultados:
- Fallos / limitaciones:
- Decisiones de arquitectura (enlazar DECISION-LOG):
- Estado final: completado / parcial / bloqueado
- Próxima acción:

## 2026-11-06 — ChatGPT / establecer memoria compartida
- Objetivo: hacer que los agentes y ChatGPT compartan documentación y estado verificable del proyecto.
- Cambios: docs/ENTITY-MASTER-SPEC.md, docs/EDGE-INTEGRATION-SPEC.md, docs/DECISION-LOG.md, AGENTS.md, docs/PROJECT-STATUS.md y esta bitácora.
- Implementación real: documentación y protocolo de trabajo; no se afirma implementación de conectores o percepción.
- Estado: documentación establecida; adopción y cumplimiento por futuras sesiones de agentes pendientes de verificación.

## 2026-11-06 — ChatGPT / Fase 00 auditoría inicial
- Objetivo: inspeccionar base real y preparar pruebas automáticas sin iniciar Fase 01.
- Commits: httpx 576d134; workflow dc18d09; auditoría 7853d93; tablero 3fafdee; estado 0ca2999.
- Archivos: services/entity-api/requirements.txt, .github/workflows/ci.yml, docs/audits/PHASE-00-2026-11-06.md, docs/PHASE-BOARD.md, docs/PROJECT-STATUS.md, esta bitácora.
- Realizado: inspección estática de FastAPI/SQLite/tests/Docker/Scorpio, corrección de dependencia httpx y creación de workflow CI.
- Pruebas: NO EJECUTADAS en esta sesión; status GitHub de commit consultado sin checks reportados. No afirmar CI verde.
- Limitaciones: sin arranque local, pruebas HTTP, reinicio real o validación de Scorpio; ver auditoría.
- Estado: EN CURSO. Próximo paso: comprobar ejecución CI y smoke tests antes de solicitar aceptación.


### 2026-11-07 00:06 UTC — Codex / Fase 00 reproducible
- Objetivo: validar y reparar base mínima autorizada, sin avanzar Fase 01.
- Rama / PR / commit: work local, base d3dfc8f53e3cf2a951c74a1dbeed344c1cce7fdd; commit de esta entrega identificable por `git log -1`; sin push, PR ni merge.
- Archivos modificados: API main.py; tests/test_api.py y test_restart.py; Dockerfile, .dockerignore y requirements.lock; compose.yaml; scripts/start-local.sh y smoke-docker.py; workflow CI; README raíz/API; auditoría, tablero, estado y esta bitácora.
- Implementación real: lifespan, arranque API separado de Scorpio, healthcheck, dependencias/imagen fijadas y pruebas de persistencia reales. Se conservan datos sintéticos de smoke en volumen local.
- Pruebas ejecutadas: 4/4 unittest aprobados (última suite 3.195 s); instalación y pip check local/contenedor correctos; build Docker con CA válido; arranque y smoke Docker ejecutados dos veces; curl /health correcto; compileall, shell syntax y git diff --check correctos. Script install guardado ejecutado y repetido; startup guardado ejecutado.
- Fallos / limitaciones: build inicial rechazó CA proxy, resuelto con secreto BuildKit; expectativa inicial de salida 0 corregida para SIGTERM de Uvicorn; advertencia httpx/TestClient y caché pip sin permisos documentadas. CI remoto, Scorpio, hardware, despliegue y restauración en tarea nueva NO verificados.
- Configuración: install_script y start_skill guardados correctamente en borrador mediante skill cloud-environment-onboarding:setup; sin cambios de dominios ni secretos; revisión/publicación pendientes del operador.
- Decisiones de arquitectura: ninguna nueva; se mantiene SQLite provisional y Scorpio externo. Solo mantenimiento de Fase 00.
- Estado final: entrega técnica local completada, fase EN VALIDACIÓN, no APROBADA.
- Próxima acción: revisión humana de evidencia/cambios, publicar código y observar CI; revisar/guardar configuración y publicar entorno. Fase 01 NO INICIADA.


### 2026-11-07 00:28 UTC — Codex / publicación Fase 00
- Objetivo: conservar y publicar entrega probada, evidencia y configuración; mantener Fase 00 EN VALIDACIÓN.
- Rama / PR / commit: rama remota codex/phase-00-validation; implementación 8f3815cb9e437e5d07768c4d9cbb48f49af466c7 publicada; main d21623b incorporado mediante merge documental. Sin PR ni merge a main.
- Archivos modificados: docs/AGENT-WORKLOG.md, PROJECT-STATUS.md, PHASE-BOARD.md, audits/PHASE-00-2026-11-06.md, CLOUD-ENVIRONMENT.md y scripts/setup-cloud.sh (copia exacta del script ya ejecutado).
- Implementación real: API/tests/Docker sin cambios funcionales; GitHub conserva rama y commit original. Configuración cloud reproducible también versionada, separada del borrador de plataforma.
- Comandos/resultados: git fetch origin main y merge sin conflictos; git push origin HEAD:refs/heads/codex/phase-00-validation correcto; fetch HTTPS en repositorio bare independiente y rev-parse/cat-file confirman commit publicado; diff confirma implementación probada intacta. Validación documental con git diff --check y comparación exacta de script.
- Pruebas: NO repetidas, conforme instrucción; resultados previamente ejecutados se conservan: 4/4 unittest, 2 smoke Docker con persistencia de entidades/atributos/estados/relaciones/eventos, health y dependencias correctos.
- Fallos / limitaciones: gh api Actions devuelve Forbidden; gh pr create devuelve Forbidden en api.github.com/graphql. Publicación Git funciona, API GitHub no utilizable. CI remoto desconocido, sin PR creado. Advertencia TestClient/httpx, Scorpio/hardware/producción y publicación de snapshot cloud siguen con los límites de auditoría.
- Decisiones de arquitectura: ninguna; se conservan instrucciones nuevas de main.
- Estado final: entrega publicada para revisión en rama; Fase 00 EN VALIDACIÓN. Fase 01 NO INICIADA.
- Próxima acción: revisión final humana de evidencia publicada; habilitar acceso API GitHub para que Codex cree PR y consulte CI, sin operaciones Git manuales del operador.

### 2026-11-07 00:44 UTC — Codex / Fase 01 Core local
- Objetivo: implementar, probar, documentar y publicar Fase 01 autorizada; no avanzar Fase 02.
- Rama / PR / commit: codex/phase-01-core, base 566e883; sin cambios nuevos en main al fetch. Publicación y estado PR/CI se registran en la entrada de entrega siguiente.
- Archivos modificados: API main.py, schemas.py, migrate.py, migraciones SQL 001/002; tests/test_core.py y test_restart.py; scripts/smoke-docker.py; contrato OpenAPI packages/contracts/core/v1; workflow CI; README raíz/API; master spec, decision log, phase board, project status, CLOUD-ENVIRONMENT.md, docs/phases/PHASE-01.md y esta bitácora.
- Implementación real: capacidades declaradas persistentes, notas de memoria, eventos con fuente/versión, /ready; migraciones atómicas para bases nuevas y Fase 00; escrituras serializadas para coherencia de historial. No invocación, conectores, Scorpio integrado ni PostgreSQL. Contratos Core distintos de los contratos futuros de Fase 02.
- Pruebas: `cd services/entity-api && ../../.venv/bin/python -m unittest discover -s tests -v`: 15/15 aprobadas, 0 omitidas, última suite 1.812 s. Incluye reinicio de dos procesos, concurrencia, rollback de cambios asociados a eventos, migraciones y contrato OpenAPI. Build Docker con override CA correcto; `sh scripts/start-local.sh` recreó contenedor saludable; `python3 scripts/smoke-docker.py` pasó tras reinicio con memoria/capacidad y 5 eventos.
- Persistencia anterior: backup SQLite consistente en volumen local previo al upgrade; comparación después confirma 4 entidades, 2 estados, 2 relaciones y 4 eventos antiguos intactos. integrity_check=ok y foreign_key_check vacío.
- Otros checks: curl /ready=200 con esquema 2; pip check local y contenedor correctos; compileall y git diff --check correctos.
- Fallos corregidos: importación Field eliminada por error causó errores de import/arranque; restaurada y suite repetida. Posible carrera de estado anterior detectada por inspección; corregida con BEGIN IMMEDIATE y test concurrente aprobado. Comandos de escritura inicialmente desde directorio incorrecto se corrigieron; sin pérdida de datos.
- Advertencias/límites: TestClient/httpx deprecado, caché pip no escribible; sin fallos asociados. Sin carga prolongada, producción, PostgreSQL/PostGIS, Scorpio ni hardware. SQLite sigue local; permisos de capacidades son declarativos, fuente no autenticada. Ver docs/phases/PHASE-01.md.
- Configuración cloud: start_skill actualizado y guardado en borrador para Fase 01, /ready y límite Fase 02. install_script conservado; mismas dependencias y pasos de build/tests ejecutados. Guardar borrador no publica snapshot.
- Decisiones: documentadas en DECISION-LOG y master spec; SQLite por necesidad actual, migraciones forward-only, contratos versión 1.0 y capacidades solo declarativas.
- Estado: EN VALIDACIÓN; no autoaprobación de Fase 00/01. Próxima acción: publicación GitHub, verificar archivos remotos y revisión humana; Fase 02 NO INICIADA.
