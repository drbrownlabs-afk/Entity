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
