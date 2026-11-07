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
