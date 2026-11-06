# ENTITY OS — Tablero de fases
Última actualización: 2026-11-06. Este tablero registra aceptación, no promesas.

| Fase | Nombre | Estado | Evidencia / siguiente paso |
|---|---|---|---|
| 00 | Auditoría y base reproducible | EN CURSO | Auditoría estática y CI añadidos; tests y arranque pendientes de ejecución. Ver docs/audits/PHASE-00-2026-11-06.md |
| 01 | ENTITY Core | NO INICIADA | API SQLite parcial existente, sin verificación; migraciones y pruebas pendientes |
| 02 | Contratos y conectores | NO INICIADA | Diseños en docs; implementación pendiente |
| 03 | ENTITY Edge y percepción | NO INICIADA | Orbbec física disponible, SDK/modelo por confirmar |
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
