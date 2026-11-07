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


### 2026-11-07 00:46 UTC — Codex / entrega publicada Fase 01
- Objetivo: confirmar que implementación y evidencia están disponibles en GitHub.
- Rama / commit: codex/phase-01-core; implementación 001d2f810cab0e427a1d179ff558b8bc5fa3bc4a, publicada mediante git push -u origin codex/phase-01-core. Sin PR ni merge a main.
- Verificación: fetch HTTPS a repositorio bare independiente; SHA y árbol completo coinciden. Confirmados individualmente main.py, schemas.py, migraciones SQL, test_core.py, contrato OpenAPI y documentos compartidos.
- Archivos de cierre: PROJECT-STATUS.md, PHASE-BOARD.md, phases/PHASE-01.md y esta bitácora actualizados con enlaces y observaciones reales.
- Pruebas: se conservan las 15/15 pruebas y smoke Docker aprobados; no repetidos después de cambios solo documentales. Contenedor observado healthy tras publicación.
- Bloqueo: gh pr create devuelve Forbidden en api.github.com/graphql. gh api Actions para la rama devuelve Forbidden. No se puede confirmar CI remoto ni crear PR con este acceso API; publicación Git completada. No se trasladan tareas Git al operador.
- Estado final: Fase 01 EN VALIDACIÓN, evidencia publicada para revisión humana; Fase 02 NO INICIADA. Limitaciones funcionales y decisiones en phases/PHASE-01.md y DECISION-LOG.md.
- Próxima acción: revisión humana de Fase 01; acceso API GitHub para que Codex complete PR y consulta CI cuando sea posible. No avanzar Fase 02 sin aprobación.

### 2026-11-07 UTC — Codex / Fase 02
- Objetivo: contratos/conectores, preservando fases previas y sin Fase 03.
- Rama/base: codex/phase-02-connectors sobre 348e15d; fetch main sin integración funcional nueva.
- Archivos: app/connectors.py, migración 003, migrate.py/main.py; test_connectors.py; ajustes de versión en tests anteriores y smoke; contratos integrations/v1; CI triggers; master spec, decision log, status, board, CLOUD-ENVIRONMENT y phases/PHASE-02.md.
- Real: registry manual, ingreso REST y simulación común, autorización Bearer server-side, auditoría, deduplicación de observaciones y acciones simuladas verificadas/idempotentes. Sin nuevos paquetes, vendor SDK o hardware.
- Pruebas ejecutadas: unittest discover desde services/entity-api, 19/19 aprobadas, ninguna omitida; incluye HTTP real entre dos procesos, repetición durable, conflictos 409, 401/403, contrato inválido y conector deshabilitado 503 sin cambio de estado. Regresiones de migraciones/Core aprobadas; contrato previo preservado. Build Docker, scripts/start-local.sh y smoke-docker.py aprobados con volumen migrado a esquema 3. compileall y diff --check correctos.
- Integración/CI: se actualizó expectativa de esquema 2 a 3 y la comparación del contrato anterior para admitir rutas aditivas; CI activa por todos los contratos. No se desactivó ninguna prueba previa. Auditoría exitosa movida a misma transacción; header exige Bearer. Advertencia TestClient/httpx permanece.
- Configuración: start_skill actualizado en borrador para esquema 3 y límite Fase 03; no publicación de snapshot. Credenciales de tests ficticias/temporales; runtime Docker sin tokens deja integraciones cerradas.
- Límites: autenticación solo integraciones, permisos globales, REST sin dispositivo externo, acciones exclusivamente simuladas; salud es registry-only. Esquemas perfil mínimo, sin MQTT, paginación, Edge o percepción. Detalle en phases/PHASE-02.md.
- Decisiones: master spec y DECISION-LOG actualizados. Estado EN VALIDACIÓN; Fase 03 NO INICIADA.
- Próximo paso: publicación/verificación remota y revisión humana. Sin autoaprobación ni merge automático.


### 2026-11-07 UTC — entrega GitHub Fase 02
- Publicado 0506df4b0bcb108430f58005a4c35c7002870ca5 en codex/phase-02-connectors; fetch independiente confirma árbol completo idéntico. Código, contratos, configuración, tests y memoria compartida disponibles en GitHub.
- gh pr create y gh api Actions intentados: Forbidden; sin PR/merge ni CI remoto confirmado. No se pide Git manual al operador.
- Cierre documental en PHASE-02.md/PROJECT-STATUS.md y esta entrada; sin cambios funcionales posteriores a las 19 pruebas aprobadas. Estado EN VALIDACIÓN; siguiente paso revisión humana. Fase 03 NO INICIADA.

### 2026-11-07 01:20 UTC — Codex / Fase 03 Edge y percepción
- Objetivo: integrar percepción reutilizando componentes existentes, vídeo/simulación y Core, sin hardware ni fases posteriores.
- Rama/base: codex/phase-03-edge; fetch+merge main 1e6b29f incluyendo cabd969, sin conflictos. Conservados commits de fases 00–02; Fase 02 aceptada explícitamente por operador, tablero APROBADA.
- Archivos: services/entity-edge (adapters, CLI, demo, tests, lock, zones); Core edge_projection.py y llamada en ingestión Fase 02, test_edge_projection.py; setup-edge/demo-edge scripts; CI; phase03-results.json; master/Edge specs, decision log, status, board, CLOUD-ENVIRONMENT y PHASE-03.md.
- Investigación previa: OpenCV HOG/SVM preentrenado probado sobre vídeo, Norfair instalado/probado; READMEs oficiales Ultralytics y Frigate revisados como alternativas no ejecutadas. Licencias/procedencia registradas, vídeo fuera de Git con commit/checksum fijo. No detector/tracker/captura/simulador general propios.
- Implementación real: orquestación Edge, tracks por sesión/cámara, zonas normalizadas y transiciones, media timeline, outbox SQLite FIFO/backoff; snapshot Observation v1 proyectado atómicamente en Camera/PersonTrack/Zone, relaciones y estados, sin dependencias de visión en Core. Snapshots tardíos no rebobinan estado.
- Pruebas: 20/20 Core (4.006 s), 4/4 Edge (.103 s), ninguna omitida. Demo real HTTP ejecutada dos veces: 20 pasos sintéticos/16 tracks observados/6 transiciones; 60 frames vídeo/181 muestras/68 transiciones, cero pendientes. 181 no son personas únicas. Último summary acumulado 42 tracks de dos ejecuciones, 124 eventos vídeo. Core apagado/reiniciado, Outbox cerrada/reabierta y ACK perdido: recuperación/deduplicación/persistencia pasadas.
- Comandos: bash scripts/setup-edge.sh; PYTHONPATH=services/entity-edge .runtime/edge-venv/bin/python -m unittest discover -s services/entity-edge/tests -v; unittest Core desde services/entity-api; bash scripts/demo-edge.sh; build Docker con override CA, sh scripts/start-local.sh, python3 scripts/smoke-docker.py; compileall, pip check y diff --check correctos. Se probó la secuencia exacta guardada para setup y demo.
- Fallos corregidos: filtro Norfair age descartaba detecciones asociadas; se comprueba identidad de last_detection del frame actual. Test harness importado se contaba duplicado, corregido sin quitar regresiones. Demo y suite final repetidas tras cambios funcionales.
- Límites: detector HOG no calibrado, oclusiones fragmentan pistas; sin re-ID, cámaras físicas, Orbbec, RTSP real ni GPU. Reconexión de capture adapter probada con doble controlado; hook de desconexión de fuente explícitamente inyectado. Historial y cola locales, bootstrap inicial online, no daemon, no producción. Detalles/licencias en PHASE-03.md.
- CI: job Edge instala componentes y vídeo checksum, tests y demo real; reportes numéricos sin vídeo/token. Resultado remoto/PR pendiente de consulta real al publicar.
- Decisiones: master/Edge specs y DECISION-LOG actualizados; Orbbec diferido no bloqueante por plan actualizado. Estado Fase 03 EN VALIDACIÓN; Fase 04 NO INICIADA.
- Próxima acción: publicar y comprobar GitHub; revisión humana de evidencia.


### 2026-11-07 UTC — publicación Fase 03
- Implementación publicada 8baea3d95f185bc1df682ab0c74cae56310f0e88 en codex/phase-03-edge; fetch independiente confirma árbol completo. Verificados ancestros de fases 00–02 y main cabd969/1e6b29f. Sin pérdidas ni reescritura de commits.
- PR y Actions consultados realmente: Forbidden en api.github.com/graphql y API Actions. Sin PR/merge a main; CI remoto desconocido. No se pide Git manual al operador.
- install_script y start_skill cloud guardados en borrador para Core+Edge/Fase 03; no snapshot publicado. URL del vídeo fijada por commit descargada adicionalmente, checksum correcto.
- Archivos de cierre: PHASE-03.md, PROJECT-STATUS.md y esta bitácora. Sin cambios funcionales después de 20+4 tests aprobados, demo y Docker. Fase 03 EN VALIDACIÓN; Fase 04 no iniciada. Siguiente paso revisión humana y acceso API para completar PR cuando esté disponible.

### 2026-11-07 UTC — Codex / Fase 04 y diagnóstico CI
- Autorización: main 5ce2519 integrado sin conflictos; reglas de AGENTS permiten Fase 04 tras revisión de Fase 03. Se conservan fases anteriores. Rama codex/phase-04-output.
- Diagnóstico real: gh auth status indica token inválido, pero REST sin credenciales a https://api.github.com falla en CONNECT del proxy con 403, antes de GitHub. Política enforced no incluye api.github.com; no permite concluir scopes/token inválidos. No conexiones GitHub alternativas en herramientas/manifest. Dominio agregado al borrador de red, aún sin aplicar/publicar runtime.
- Método alternativo autorizado: páginas web públicas GitHub accesibles. PR #1 observado Draft desde codex/phase-03-edge, head 5ca635a por refs/pull/1/head. No duplicado ni merge. Actions web muestra éxito en todos los 7 runs históricos; ejecución del PR https://github.com/drbrownlabs-afk/Entity/actions/runs/42324594328 Status Success, api-tests y edge-tests, 52 s. Runs por push también correctos. La limitación anterior era de observación API, no prueba de CI roto.
- CI: checkout v5/setup-python v6/upload-artifact v5 verificados en repos oficiales (Node24), runner ubuntu-24.04 fijado y permissions contents:read. Triggers push/PR incluyen API, Edge, scripts y contratos; dispatch disponible. Añadida demo Output al job Edge. Verificar nuevo push por web, sin inferir resultados de YAML.
- Fase 04 implementada: migración 004, displays virtuales, reglas ligadas a capacidad declarada, lectura de estado tras ejecutar, resultados/auditoría durables, manual override, idempotencia; fallos, timeout asyncio real y lectura divergente simulados. Pantalla HTML estándar vía FastAPI/browser, sin renderer nuevo ni dispositivo físico. Investigación documental FastAPI y Home Assistant, reutilización de stdlib asyncio/SQLite y adaptador de simulación.
- Pruebas iniciales: 23/23 Core aprobados (4.568 s), demo HTTP real de presencia→welcome, ausencia→idle, manual override, fallo/timeout/mismatch y reinicio/idempotencia pasada. Evidencia extendida y resultados finales se registran al cerrar. Fase 04 EN VALIDACIÓN, Fase 05 no iniciada.


### 2026-11-07 UTC — evidencia Fase 04 y CI remoto
- Última suite 23/23 Core (3.817 s), 4/4 Edge (.105 s), demo Output HTTP dos veces aprobada. Resultados versionados en evidence/phase04-output-results.json y pantalla HTML virtual. Docker build/start/smoke correctos con esquema 4, backup SQLite previo, compileall/pip check/diff --check correctos.
- Implementación 520475fbfee95abc5440bea2a2edc627ffe8f573 publicada. CI por push https://github.com/drbrownlabs-afk/Entity/actions/runs/42325368629 verificado Success, 51 s; api-tests 30 s y edge-tests 47 s, incluyendo demo Output.
- Se corrige suposición inicial upload-artifact@v5 Node24: warning remoto demuestra Node20; action.yml v6 consultado y confirma node24, se actualiza a v6. Resultado final se comprueba tras nuevo push. Runners fijados y checkout/setup-python ya sin warnings anteriores.
- Docs compartidas/master/decision-log/tablero actualizados. Fase 04 EN VALIDACIÓN; revisión Fase 03 autoriza este trabajo, sin declarar hardware probado ni Fase 05 iniciada.
- API: api.github.com denegado por proxy CONNECT 403 sin llegar a GitHub; ampliación guardada en borrador no aplicada. No se afirma token inválido/scopes conocidos. Método web autorizado permite leer PR y runs; CI remoto operativo. PR #1 Draft permanece sin duplicar/merge.


### 2026-11-07 UTC — cierre Fase 04 y CI verificado
- Código 520475f y corrección de CI/documentación b715116 publicados. Último CI observado https://github.com/drbrownlabs-afk/Entity/actions/runs/42325648659 Status Success, SHA completo b715116da5a7645896aa011367aa448bad7123b6, sin anotaciones de warnings; dos jobs completos. Evidencia JSON versionada. Cierre posterior solo docs, sin nuevo cambio que requiera repetir tests.
- Comparación del volumen con backup previo: 12 entidades, 6 estados, 6 relaciones, 24 eventos, 4 memorias y 4 capacidades anteriores idénticos; tablas vacías de integración intactas. SQLite integrity_check=ok, foreign_key_check vacío y esquema 4.
- GitHub comprobado por fetch independiente: árbol completo coincide; fases anteriores y main 5ce2519 preservados como ancestros. PR #1 Draft se mantiene sin duplicado/merge. REST POST de PR Fase 04 también falla Forbidden; API bloqueada por proxy CONNECT, no diagnóstico de scopes inválidos. Settings públicos 404 por sesión anónima.
- Cambio de red api.github.com y start_skill esquema 4 guardados en borrador, sin afirmar aplicación/publicación de runtime. CI sí operativo y verificado mediante push+web. Nada de hardware validado, Fase 04 EN VALIDACIÓN; Fase 05 NO INICIADA. Próximo paso revisión humana.

### 2026-11-07 UTC — Codex / Fase 05 IA situada
- Objetivo autorizado: consultas/acciones fundamentadas mediante herramientas existentes; no Fase 06. Rama codex/phase-05-situated-ai sobre fbad94e; fetch/merge main sin cambios adicionales, fases previas preservadas.
- Investigación: README oficial openai/openai-python; SDK oficial 2.8.1 instalado en venv Core, requisitos/lock actualizados. Reutiliza Chat Completions function tools, FastAPI, herramientas Core/Output y autorización de Fase 02. No modelo ni framework de agentes nuevos, sin MCP propio/multiagentes.
- Implementación: GET/POST /v1/agent/requests con scope de entidad, evidencia de estado/relaciones/eventos/memoria/capacidades, referencias, política de herramientas server-side y capacidad/escena explícitas; agent:read y output:write separados; trazas/resultado/idempotencia persistentes, migración aditiva 005. SDK sin retries automáticos, timeout 5 s; sustituto controlled-fixture rotulado por defecto, ninguna llamada real sin configurar proveedor/clave.
- Credenciales inspeccionadas por presencia: no ENTITY_LLM_API_KEY ni OPENAI_API_KEY; no binding de proveedor. No se solicitan valores en chat. Requisito opcional user_provided ENTITY_LLM_API_KEY para api.openai.com guardado en borrador, dominio añadido preservando red; ENTITY_AGENT_PROVIDER=controlled sugerido. No se afirma aplicación ni snapshot publicado.
- Pruebas iniciales: 28 Core aprobadas, demo HTTP real (proveedor controlado) consulta recepción con referencias, acción virtual verified, trace e idempotencia pasadas. SDK oficial probado con HTTPX MockTransport para tool call y timeout, sin confundir con inferencia remota. Resultado final y CI se registran al cierre.
- Política: no se usa prosa libre del modelo como hecho; respuesta deriva de evidencia Core. Acción no incluida o distinta del envelope explícito rechazada; modelo no concede permisos. Estado desconocido se declara como ausencia de registro. Errores/timeout no ejecutan acciones; fallos Output se conservan como fallos.
- Límites: proveedor real no validado sin clave, respuestas naturales restringidas/scope explícito, permisos globales heredados y Core local no endurecido. Fase 05 EN VALIDACIÓN; Fase 06 no iniciada. Próximo paso publicación y CI real.


### 2026-11-07 UTC — cierre y publicación Fase 05
- Publicado f77f816c04b312842e54767375028da7b50f35f3 en codex/phase-05-situated-ai. CI remoto por push https://github.com/drbrownlabs-afk/Entity/actions/runs/42326524584 observado Success para ese SHA completo, sin anotaciones; evidencia JSON versionada. CI incluye demo-agent y todas las regresiones/Docker/Edge/Output.
- Suite final 29/29 Core (4.801 s), 4/4 Edge (.145 s), ninguna omitida; demo HTTP controlada aprobada dos veces. Test adicional proveedor real sin clave falla cerrado; no efectos. Modelo/proveedor/política/pregunta/refreshed evidence incluidos en traza. No inferencia OpenAI real ejecutada ni coste supuesto.
- Persistencia: comparación con backup previo, 14 entidades/7 estados/7 relaciones/29 eventos/5 memorias/5 capacidades intactos y tablas vacías heredadas preservadas; integrity_check ok, foreign keys vacías, esquema 5.
- Actualizados master spec, decision log, project status, phase board, CLOUD-ENVIRONMENT, PHASE-05.md y artefactos de evidencia. Cierre posterior solo docs, sin cambios funcionales tras CI.
- PR REST intentado para Fase 05: Forbidden; sin PR nuevo ni merge, publicación Git y lectura CI web operativas. No se traslada Git al usuario. Config cloud start_skill guardada esquema 5/límite Fase 06; requisito personal opcional ENTITY_LLM_API_KEY/api.openai.com y variables guardados en borrador, no runtime publicado.
- Estado: Fase 05 EN VALIDACIÓN, Fase 06 NO INICIADA. Próximo paso revisión humana; proveedor real requiere configuración y prueba aparte si se desea activarlo.

### 2026-11-07 UTC — Codex / Fase 06 instalaciones existentes
- Objetivo autorizado: sustituir fuente virtual por vídeo IP/RTSP y añadir fuentes no visuales mediante componentes existentes; no Fase 07. Rama codex/phase-06-integrations sobre fc769b0; fetch/merge main sin cambios nuevos, fases previas conservadas.
- Investigación: READMEs MediaMTX, Paho MQTT, Mosquitto, ONVIF zeep y Frigate consultados. Seleccionados MediaMTX 1.12.3 + FFmpeg y OpenCV existente, Mosquitto 2.0.22 + Paho 2.1.0, HTTPX para REST. Servidores Docker fijados por digest; sin protocolo propio ni dependencias nuevas Core.
- Implementación: adapters Edge measurement/reservation, MQTT QoS1/manual ACK tras persistencia FIFO, polling REST con revisiones estables y filtro de datos personales; demo RTSP TCP real + broker MQTT real + HTTP reservas fixture. Observation v1 y esquema Core 5 intactos, sin migración ni código Core cambiado.
- Prueba real de vídeo: misma entidad Camera/endpoints para fixture y RTSP, captura/detección/tracking existentes; vídeo público servido por FFmpeg/MediaMTX en loopback. MQTT duplicado produce un evento, broker reinicia y cliente se resuscribe, Core cae y Outbox recupera. REST repetido deduplica y revisión/cancelación añade evento; consulta agente controlado encuentra referencias no visuales.
- Fallo diagnosticado: Docker reasignó puerto publicado automáticamente tras reiniciar (reproducción aislada: 32771→32772); demo pasó a asignación explícita estable. GOP H264 reducido para no esperar 25 s por primer keyframe. Demo afectada repetida y aprobada.
- Resultados demo: 107 muestras vídeo RTSP, mismo contrato/cámara passed, mqtt_qos1_dedup/broker_restart/core_restart_outbox/reservation_revision/agent_evidence passed; 2 eventos sensores y 2 reservas. Datos de sensores/reservas ficticios, protocolos reales locales; no hardware ajeno ni ONVIF físico probado. Estado Fase 06 EN VALIDACIÓN.
- Compatibilidad física, credenciales, SDKs de fabricante y seguridad de producción pendientes según matriz de Fase 06; Fase 07 NO INICIADA. Resultados tests/CI y publicación se registran al cierre.


### 2026-11-07 UTC — Fase 06 CI y regresión
- Suite local final: 29/29 Core (4.583 s), 7/7 Edge (.106 s), ninguna omitida; setup-integrations/pip check/compileall/diff --check correctos. Segunda demo correcta: 95 muestras vídeo (variación por instante de entrada al stream), eventos/dedup/restarts/consulta correctos. Proveedor agente fijado controlled explícitamente para no realizar llamadas externas accidentales.
- Primer push 8084b84: CI remoto run 42327761645 Failure en paso Demonstrate RTSP MQTT and REST integration (api-tests correcto). Logs de job exigen login, fallo no se oculta ni se atribuye a causa no demostrada. Se añadió comprobación/instalación de FFmpeg en runner y anotación pública por etapa/excepción; push cc78f08 solicita nueva ejecución. Resultado se registrará al observarlo.
- Fase 06 EN VALIDACIÓN, sin avanzar Fase 07.


### 2026-11-07 UTC — Fase 06 corrección CI comprobada
- Run 42328049603 para cc78f084a60ed625b61997713469a728e01ccac1: Success, 1m41s, api-tests 34s/edge-tests 1m37s, sin anotaciones. Incluye integración real local RTSP/MQTT/REST. Se conserva primer fallo run 42327761645; no se inventa causa exacta con logs privados. FFmpeg ahora garantizado desde apt oficial si falta en runner.
- Salud de cliente MQTT corregida: connected=False al desconectar y flag subscribed limpio; test dirigido de los 3 casos de adaptadores aprobado (.019 s). Diagnóstico público de vídeo solo muestra logs de este laboratorio ficticio, sin headers/tokens. No se cambió Core ni protocolos propios.
- Documentación de matriz/roadmap/licencias y límites añadida. Esquema Core sigue 5, historial de fases anteriores conservado. Resultado de CI final se registrará tras el siguiente push. Fase 06 EN VALIDACIÓN, no Fase 07.


### 2026-11-07 UTC — publicación/verificación Fase 06
- Rama codex/phase-06-integrations publicada hasta 1c1332f0743372d0d8b326c379cf7017c49462cb. Fetch independiente confirma SHA/árbol idénticos, fases previas preservadas como ancestros; diff de services/entity-api respecto a fc769b0 vacío. Core sin cambios, sin migración/DDL nuevos.
- PR REST intentado: Forbidden en api.github.com/repos/drbrownlabs-afk/Entity/pulls. Sin PR nuevo/merge, PR #1 no se duplica; no operaciones Git manuales del operador. CI se dispara por push y se observa por web pública como en fases previas.
- start_skill esquema 5 actualizado en borrador para instalación/demo de integraciones y límite Fase 07, sin afirmar publicación de snapshot. Servicios de demo limpiados; solo API Docker previa sigue funcionando.
- Cierre documental explicita límites de IDs opacos/reservas, compatibilidad física no demostrada y semántica de eventos no visuales. Fase 06 EN VALIDACIÓN; Fase 07 NO INICIADA.


### 2026-11-07 UTC — cierre Fase 06 verificado
- Código 12e05af070d84d7c9835e5f8070461a5e1e108ef en codex/phase-06-integrations. CI final https://github.com/drbrownlabs-afk/Entity/actions/runs/42328459031 Success, 1m32s (api-tests 31s/edge-tests 1m28s), sin anotaciones, SHA completo confirmado. 29 Core + 7 Edge y demo integral incluidas. Evidencia JSON versionada, fallo inicial y runs previos conservados.
- Core/DB/API sin cambios frente a fc769b0; fases anteriores ancestros verificados y árbol remoto descargado idéntico. Ajuste final solo diagnóstico de error tras cleanup comprobado; cierre posterior exclusivamente documental, sin repetir tests ya verificados.
- Reporte, matriz/licencias/roadmap y memoria compartida actualizados. PR API Forbidden, no PR nuevo ni merge; PR #1 no se duplica. No comandos Git manuales del operador. start_skill guardado en borrador, no snapshot publicado.
- Estado: Fase 06 EN VALIDACIÓN; Fase 07 NO INICIADA. Próximo paso revisión humana; hardware/ONVIF/VMS ajenos y perfiles de producción se mantienen fuera de la evidencia demostrada.


## 2026-11-07 UTC — Fase 07 y ampliación Pages
Objetivo: Experience autónoma reutilizando fases anteriores, sin Fase 08. Rama codex/phase-07-experience sobre 1b4e94d; main actualizado sin conflictos. Implementados apps/web PlayCanvas/Vite/Playwright, fixture JSON compartido con Edge, scripts setup/demo/pruebas/publicación y workflows CI/Pages. Core solo añade CORS opcional; sin migración DB. 29 Core, 4 Node y 3 Chromium aprobados; contrato de exportación real ingerido/proyectado y Output/dedup aprobados. Demo Edge tras extracción aprobada (20/60 frames). Primer comando Core mal invocado sin PYTHONPATH produjo errores de importación; repetición correcta 29/29. Corregidos CCTV recortados, fetch mal enlazado, IDs eventos repetidos y reconexión con adaptador antiguo. Capturas y rendimiento software (~17.8 FPS móvil) registrados; no teléfono físico. Pages gh-pages 108d227 y run 42330844212 Success, URL publicada por GitHub. API/gh Forbidden por proxy; Git autorizado funcional. Últimos cambios de procedencia y rótulos se comprueban antes de commit. CI final/URL real/prueba independiente y referencias SHA se registrarán en entrada de cierre, sin afirmar resultados todavía. Memoria actualizada; EN VALIDACIÓN, revisión humana pendiente.


## 2026-11-07 UTC — Primera verificación pública Fase 07
56d05f43348cbc85bd6c9144b1d3e52c8e3748a6 publicado en GitHub; fetch independiente del remoto confirma SHA y árbol 43bed16999038468b5c7df4dd4af5602c2b95abf y ancestro Fase 06. Pages run 42331389293 Success (54s): script obligatorio obtiene deployment.json con SHA exacto, abre URL pública con Chromium a 1280×900 y 390×844 y prueba cámaras/escena/consulta sin Core. Build nativo 42331412067 Success (26s), gh-pages 9921349. Build nativo duplicado 42331410465 cancelado por prioridad de otro request, no fallo del producto. Advertencia propia: upload-artifact omite .runtime por ser oculta; se corrige include-hidden-files explícito solo para rutas concretas de evidencia. Se añade reporte al resumen de Actions. Native Pages conserva advertencias de acciones gestionadas por GitHub. CI de regresión sigue en progreso, no se adelanta conclusión. Prueba local de producción Vite preview sin Python también pasó ambos formatos. Navegador final 3/3 con navegación táctil de tienda/vista; Edge 7/7. Intento PR REST POST /repos/drbrownlabs-afk/Entity/pulls Forbidden, gh auth status reporta token inválido sin poder llegar al endpoint por proxy; no prueba independiente de validez del token. Sin PR nuevo ni merge, sin tareas Git trasladadas al operador. install_script/start_skill actualizados como borrador, no publicados/restaurados.
