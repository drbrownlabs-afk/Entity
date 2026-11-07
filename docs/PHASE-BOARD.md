# ENTITY OS — Tablero de fases
Última actualización: 2026-11-06. Este tablero registra aceptación, no promesas.

| Fase | Nombre | Estado | Evidencia / siguiente paso |
|---|---|---|---|
| 00 | Auditoría y base reproducible | EN VALIDACIÓN | API/health, 4 tests y persistencia tras reinicio de proceso y Docker aprobados localmente; implementación 8f3815c publicada en codex/phase-00-validation. API GitHub bloquea PR/consulta CI; revisión humana pendiente. Ver docs/audits/PHASE-00-2026-11-06.md |
| 01 | ENTITY Core | EN VALIDACIÓN | Continuación autorizada por operador; Core local, migraciones, memoria y capacidades declaradas; 15/15 tests y reinicios aprobados. Publicado 001d2f8 en codex/phase-01-core; PR/consulta CI bloqueados por API GitHub. Ver docs/phases/PHASE-01.md; revisión humana pendiente |
| 02 | Contratos y conectores | APROBADA | Aceptación explícita del operador al iniciar Fase 03. Registry, REST/simulación, permisos, auditoría e idempotencia; 19 pruebas aprobadas. Ver docs/phases/PHASE-02.md; revisión humana pendiente |
| 03 | ENTITY Edge y percepción | EN VALIDACIÓN | OpenCV/Norfair, vídeo y fixture, zonas, Core, outbox y recuperación HTTP probados. 20 tests Core + 4 Edge. Orbbec diferida no bloqueante. Ver docs/phases/PHASE-03.md |
| 04 | Laboratorio físico y Output | NO INICIADA | TV y 3 proyectores disponibles; actuadores por adquirir |
| 05 | IA situada | NO INICIADA | Herramientas y acciones pendientes |
| 06 | Sistemas externos | NO INICIADA | RTSP/ONVIF, MQTT, reservas pendientes |
| 07 | ENTITY Experience | NO INICIADA | Demo centro comercial aún sin verificación |
| 08 | Validación integral | NO INICIADA | Depende de pruebas de fases anteriores |

## Criterios de cambio de estado
- NO INICIADA -> EN CURSO: trabajo de fase autorizado y comenzado.
- EN CURSO -> EN VALIDACIÓN: código y evidencias de pruebas disponibles.
- EN VALIDACIÓN -> APROBADA: criterios demostrados y aprobación humana explícita.
- Cualquier estado -> BLOQUEADA: impedimento reproducible documentado.
- Reabrir una fase aprobada cuando una regresión invalide sus pruebas.

## Reporte para operador no programador
Cada actualización debe contestar: ¿qué funciona hoy?, ¿qué se probó?, ¿qué falta?, ¿qué decisión se necesita?, ¿cuál es el siguiente experimento? Incluir enlaces a commit/PR y comandos sencillos cuando existan.
