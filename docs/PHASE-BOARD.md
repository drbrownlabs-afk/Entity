# ENTITY OS — Tablero de fases
Última actualización: 2026-11-07. Este tablero registra aceptación, no promesas.

| Fase | Nombre | Estado | Evidencia / siguiente paso |
|---|---|---|---|
| 00 | Auditoría y base reproducible | EN VALIDACIÓN | API/health, 4 tests y persistencia tras reinicio de proceso y Docker aprobados localmente; implementación 8f3815c publicada en codex/phase-00-validation. CI remoto histórico Success comprobado por web; revisión humana pendiente. Ver docs/audits/PHASE-00-2026-11-06.md |
| 01 | ENTITY Core | EN VALIDACIÓN | Continuación autorizada por operador; Core local, migraciones, memoria y capacidades declaradas; 15/15 tests y reinicios aprobados. Publicado 001d2f8 en codex/phase-01-core; CI remoto Success comprobado por web; API limitada por proxy. Ver docs/phases/PHASE-01.md; revisión humana pendiente |
| 02 | Contratos y conectores | APROBADA | Aceptación explícita del operador al iniciar Fase 03. Registry, REST/simulación, permisos, auditoría e idempotencia; 19 pruebas aprobadas. Ver docs/phases/PHASE-02.md; aceptada por operador |
| 03 | ENTITY Edge y percepción | EN VALIDACIÓN | OpenCV/Norfair, vídeo y fixture, zonas, Core, outbox y recuperación HTTP probados. 20 tests Core + 4 Edge. Orbbec diferida no bloqueante; PR #1 Draft y CI Success comprobados. Revisión del operador habilita Fase 04. Ver docs/phases/PHASE-03.md |
| 04 | ENTITY Output virtual primero | EN VALIDACIÓN | Presencia→regla→capacidad declarada→escena verificada; manual/fallo/timeout probados. 23 Core + 4 Edge tests; CI remoto Success run 42325648659. Ver docs/phases/PHASE-04.md |
| 05 | IA situada | EN VALIDACIÓN | SDK oficial OpenAI + sustituto controlado; evidencia, permisos, trazas y Output verificado. 29 Core + 4 Edge tests; CI remoto Success run 42326524584. Proveedor remoto no probado sin clave. Ver docs/phases/PHASE-05.md |
| 06 | Sistemas externos | EN VALIDACIÓN | RTSP real local + MQTT y REST fixtures, cambio de fuente sin Core, dedup/reinicio/consulta. 29 Core + 7 Edge; CI remoto Success run 42328459031. Matriz y límites en docs/phases/PHASE-06.md |
| 07 | ENTITY Experience | EN VALIDACIÓN | PlayCanvas autónomo, fixture Edge compartido, 7 tiendas y 5 cámaras sincronizadas; acciones/consultas y Core opcional real probados. URL pública verificada escritorio/móvil, CI final Success 42331518937 y Pages 42331518986; 29 Core + 7 Edge + 4 Node + 3 navegador aprobados. Límites en docs/phases/PHASE-07.md. Revisión humana pendiente |
| 08 | Validación integral | EN VALIDACIÓN | CI final Success 42333312084 (4 jobs): 29 Core + 7 Edge + 4 Node + 3 navegador, escenario integrado 20/20, paquete fuente instalado limpio y ZIP escritorio/táctil aprobados; artefacto entity-delivery publicado. Ver docs/phases/PHASE-08.md. Aceptación humana pendiente |

## Criterios de cambio de estado
- NO INICIADA -> EN CURSO: trabajo de fase autorizado y comenzado.
- EN CURSO -> EN VALIDACIÓN: código y evidencias de pruebas disponibles.
- EN VALIDACIÓN -> APROBADA: criterios demostrados y aprobación humana explícita.
- Cualquier estado -> BLOQUEADA: impedimento reproducible documentado.
- Reabrir una fase aprobada cuando una regresión invalide sus pruebas.

## Reporte para operador no programador
Cada actualización debe contestar: ¿qué funciona hoy?, ¿qué se probó?, ¿qué falta?, ¿qué decisión se necesita?, ¿cuál es el siguiente experimento? Incluir enlaces a commit/PR y comandos sencillos cuando existan.


## Fase 09 — Nuevo alcance autorizado (2026-11-07)
| Fase | Nombre | Estado | Evidencia / siguiente paso |
|---|---|---|---|
| 09 | Synthetic Office: simulación integral de inteligencia espacial | EN CURSO | SSOG original integrado con evidencia1440/390px (baf37b3); backend84tests PASS; CI general/PR/original/espacial/Pages c0afef6Success ypaquete limpio verificado; recepción/móvil/reserva/consulta, replayactivo de tresclientes, filtros temporales y reinicio Docker comprobados. Export Vite NO requerido ni bloqueante; topología de reunión, dos oficinas privadas, coworking individual, recepción y espera fijada por operador. Demo persistente116entidades/21eventos; inventario vigente A/B privado y C/D público; calibración de doce sillas original verificada; interfaz nativa en prueba visual y rutas completas pendientes. Informe en docs/PHASE-09-DELIVERY-REPORT.md y progreso en docs/PHASE-09-PROGRESS.md. Autorización excepcional para completar 09.1–09.9 autónomamente sin revisión humana entre subfases; revisión humana al final. |

Nota: el tablero anterior puede estar desactualizado frente a ramas de Codex aún no fusionadas. Verificar ramas, commits y CI antes de cambiar estados históricos.
## Auditoría transversal del MVP — 2026-11-07
Fases00–08 revisadas mediante código y sondas adversas nuevas. Se conservan estados históricos y no se aprueba ninguna fase. Fase08 permanece EN VALIDACIÓN; la auditoría encuentra bloqueos de preparación para piloto y discrepancias no cubiertas por los recorridos anteriores. Ver docs/audits/MVP-INDEPENDENT-2026-11-07.md (A01–A10 abiertos; F01–F04 corregidos en rama de auditoría). Un CI verde comprueba regresiones y no acredita coherencia/seguridad de todos los componentes.

Auditoría publicada en codex/mvp-independent-audit (51d9ab6/9f35abb), CI42377822190 Success. 33Core/7Edge/6Node/3navegador y entrega limpia verificados; A01–A10 abiertos y F01–F04 corregidos. Las discrepancias de autorización, IDs, tiempo, cola, contexto y Core/Experience impiden declarar listo un piloto integrado. Revisión humana pendiente; sin cambio automático de aprobaciones históricas.


## Próxima fase — decisión de alcance 2026-11-07
| Fase | Nombre | Estado | Dependencia y salida |
|---|---|---|---|
| 10 | Camera Gateway, registro espacial y continuidad multicámara visual + contextual | NO INICIADA / PLANIFICADA | Solo después de cerrar y validar Fase 09. Integrar fuentes LAN/ONVIF/RTSP/NVR/API/USB/simuladas; calibrar cámaras contra SSOG; mantener identidad global CAM-01→CAM-02→CAM-05 mediante ReID + restricciones físicas/temporales del modelo del mundo; probar imposibles, incertidumbre, persistencia, permisos y visualización. Plan detallado en PLANS.md y diseño previo en docs/POST-PHASE-09-SPATIAL-INFERENCE-REGISTRATION.md. |

No ejecutar Fase 10 en paralelo ni cambiar estado de 09 por la incorporación de este plan. OpenClaw/multiagentes quedan fuera de esta fase.
