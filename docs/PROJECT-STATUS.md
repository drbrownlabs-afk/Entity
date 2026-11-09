# ENTITY — Memoria actualizable de procesos
**Autoridad:** estado y planificación de procesos, subordinados al canon de ENTITY-MASTER-SPEC.md. Actualizar después de cambios comprobados; no declarar éxito sin evidencia.

## P1 — Software ENTITY
**Propiedad permanente:** backend y frontend de plataforma, Core, Núcleo, Entidadizador, APIs, conectores y cualquier modificación/adaptación de software compartido requerida por P2 o P3. La detención de la secuencia histórica hasta fase 09 no impide desarrollar adaptaciones de plataforma en P1.
**Estado de alcance:** línea original detenida en Fase 09. **Estado de aceptación:** no inferir cierre técnico global de la numeración; consultar gates, CI y entregas. **Próximo criterio:** verificar lo que falta antes de dar por aprobada la línea. No iniciar «Fase 10/11» como continuación de P1.

## P2 — Gemelo digital operativo del coworking
**Propiedad permanente:** demo/caso de uso del workspace; escena, personajes, cámaras, simulación y experiencia. Consume e integra software P1. Las adaptaciones de backend/frontend de plataforma/conectores/Entidadizador se implementan en P1, no en P2.
**Estado:** activo. **Subproyecto escena 3D:** fases internas 01–07, no equivalentes a la totalidad de P2.
**Alcance:** escena Blender/PlayCanvas; humanos Mixamo (~12), animaciones y rutas; cámaras comerciales, cobertura, calibración, percepción, tracking y ReID; seguridad, accesos, biometría; reservas, calendario, CRM, membresías, contratos, facturación, Drive/documentos, redes/IT, mantenimiento y operaciones. Todo usa un único Core/modelo del mundo. Integrar sistemas empresariales reales mediante APIs, sin clones ni proveedores supuestos. Separar simulación/real/replay y ground truth/observación/inferencia.
**Evidencia disponible:** auditoría backend y handoff geométrico están documentados más abajo; su existencia no certifica escena final ni integraciones.
**Estado verificado P2-08 (addendum8.1/8.2/8.2.1, 2026-11-09):** Core P1 local real:66 entidades/146 relaciones activas; entidad madre Coworking con estado desconocido y memoria propios;12 personas lógicas exactas, organizaciones y declaraciones sintéticas planificadas.30 mapeos PlayCanvas verificados,7 tests estructurales y reinicio real PASS. Sin nuevas consultas/flujos operativos, pagos, reservas, check-ins, avatares ni fase09; se conserva trabajo funcional previo.06/07 pendientes hasta mañana. Mall retirado, publicador único coworking. API Core HTTPS pública no configurada. Ver evidence/phase08/structural; EN VALIDACIÓN, no aprobada.

## Hoja de ruta específica de P2 — 2026-11-08 (orden corregido)
Referencia vigente: `docs/P2-ROADMAP.md`. 01–05 escenario construido según operador; **06 personajes**, **07 integración/validación de escena**. **08 conexión del gemelo y personajes al backend P1 + entidadización del entorno**; **09 integración y entidadización de cámaras, CRM, Drive, reservas, accesos y demás sistemas externos**; **10 sincronización operativa integral**; **11 pruebas de interoperabilidad y aceptación**. Solo después: 12 percepción avanzada, 13 operación/automatizaciones, 14 evaluación contextual (sin invadir P3), 15 piloto y validación. Núcleo ≠ Core ≠ Entidadizador. No reconstruir el backend funcional ni duplicar aplicaciones externas. Estados posteriores: PLANIFICADOS, no implementados por esta edición. La numeración es interna de P2 y no reactiva las fases globales antiguas.

## P3 — IA situada y multiagentes
**Propiedad permanente:** IA situada, agentes y orquestación contextual; usa Core de P1 y puede utilizar P2 como laboratorio. Las adaptaciones de plataforma se hacen en P1.
**Estado:** posterior, no iniciado ni autorizado para implementación. OpenClaw es opción de runtime; agentes de seguridad, reservas, facturación, CRM, red y mantenimiento actuarán a través de capacidades de Core con permisos y auditoría. No sustituir Core ni crear memoria operativa paralela.

## Reglas de actualización de procesos
Cada actualización debe incluir proceso, fecha, estado, evidencia/commit, bloqueos, próxima acción y responsable cuando exista. Una tarea terminada actualiza este archivo y AGENT-WORKLOG; una decisión específica se agrega a DECISION-LOG; ninguna de ellas modifica automáticamente el canon. Si hay conflicto con notas antiguas, prevalecen el canon y ADR-2026-11-08-001.

## Actualización transversal — 2026-11-08: cartera tecnológica y simulaciones
**Estado:** decisiones de arquitectura registradas; no certifican módulos construidos.
- **Núcleo:** motor propietario universal de interoperabilidad; distinto de ENTITY Core. Estado de implementación independiente: pendiente de auditoría de código/evidencias.
- **Entidadizador automático:** identificación y transformación semántica de información externa en entidades/estados/relaciones. Estado: pendiente de auditoría.
- **Constructor de gemelos digitales:** generación simplificada de representaciones 3D y vínculos espaciales. Estado: investigación/diseño; validar capacidades reales.
- **Spatial Simulation:** laboratorio para experimentar con escenarios, personas, cámaras/dispositivos, operaciones y fallos antes del despliegue. Relacionado con P2, pero con desarrollo, ramas y aceptación separados de la vertical operativa; simulación ≠ integración real.
- **ENTITY Core:** sigue siendo la única fuente del modelo computable y memoria operacional.
**Próxima acción:** cuando se planifique cada componente, especificar contratos, criterios de prueba y qué está realmente implementado. No iniciar código por esta actualización documental.

---
## Historial operativo previo
Los reportes siguientes son evidencia cronológica y pueden describir prioridades ya sustituidas; no deben ejecutarse como órdenes actuales.

# ENTITY OS — Estado operativo compartido

Última revisión manual: 2026-11-06. Este archivo se actualiza después de cada tarea de implementación. NO reemplaza inspección de código, CI ni commits.

## Estado actual comprobado — Fase 09, 2026-11-07

La rama codex/phase-09-autonomous-plan conserva las fases anteriores y las aportaciones de ChatGPT. Fuente c0afef6: CI general42444521584, PR42444524894, original42444521616, espacial42444521608 y Pages42444521644 terminaron Success. Regresión local84 backendPASS,11NodePASS, build y E2E HTTP1280/390PASS. Entrega desde paquete limpio verificada también en CI. Evidencias y enlaces consolidados en docs/PHASE-09-DELIVERY-REPORT.md.

Office/personal/kiosco comparten la jornada activa, reloj Core y replay sin borrar datos. E2E verifica UTC/Tokio, agenda persistida, filtros temporales, permisos y formulario durante ticks. La instancia Docker8010 tiene demo-phase09-20261108 pausada en09:15:05Guayaquil:116entidades/21eventos y pose deLuis en corredor con reservaD3, todo igual tras reinicio real. Web compilada4175; Core previo8000preservado. Imagen Core comparada por hashes con fuente; prueba adicional de reinicio mientras reproduce conserva reloj y pausa sin tiempo offline.

SSOG/voxels originales y vista superior1440/390 verificados. Tramo físico de pasillo:22muestras libres,5poses Core/GLB,2CCTV con observaciones/historia. Dos grupos de trabajo no anotados se conservan como InventoryItem observados, no comerciales. Faltan correspondencia geométrica C/D/E, asientos y rutas de toda la jornada; no se inventan posiciones. Pages aloja el frontend y el original remoto, no Core público. Android/micrófono reales, WebPush, hardware y LLM remoto siguen sin acreditarse.

Estado global EN CURSO, PR#2 sin fusionar;09.4/09.5/09.6/09.7/09.8 tienen verificaciones funcionales, mientras09.1/09.2/09.3/09.9 conservan pendientes integrales. Los gates espaciales pendientes impiden cerrar toda la Fase09. No se solicita aprobación todavía, no se inicia Fase10/11 y no se autoaprueba ninguna fase.

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


## Estado vigente — Fase 05
Continuación autorizada por operador; EN VALIDACIÓN, sin autoaprobación previa. 29/29 Core y 4/4 Edge; SDK oficial OpenAI integrado, consultas fundamentadas y acciones virtuales autorizadas, trazas/idempotencia persistentes. Demo HTTP con controlled-fixture aprobada; no inferencia remota real sin clave. Migración aditiva esquema 5, Docker/persistencia aprobados, backup previo. Rama codex/phase-05-situated-ai conserva fases anteriores. Ver docs/phases/PHASE-05.md; prioridad vigente revisión humana Fase 05, Fase 06 NO INICIADA. Las entradas anteriores son historia y no sustituyen este estado vigente.

Fase 05 publicada: f77f816c04b312842e54767375028da7b50f35f3, rama codex/phase-05-situated-ai. CI remoto run 42326524584 Success, sin anotaciones; evidencia phase05-ci.json. Proveedor real no probado; controlled-fixture y SDK con transporte controlado sí. PR REST falla Forbidden, sin PR nuevo/merge, sin operaciones Git manuales pendientes del operador. Revisión humana y validación opcional real siguen pendientes.


## Estado vigente — Fase 06
EN VALIDACIÓN, autorizada por operador sin autoaprobar fases previas. 29 Core + 7 Edge tests y demo RTSP TCP/MQTT/REST reales locales aprobados; payloads sensores/reservas ficticios, sin CCTV externo ni ONVIF físico. Misma Camera/endpoints/estado con fuente virtual y RTSP. Duplicados, broker restart y recuperación de Outbox/Core correctos; eventos no visuales consultables por Core/agente. Core sin cambios ni migración (esquema 5); fases anteriores conservadas. Ver matriz completa docs/phases/PHASE-06.md. Prioridad vigente revisión humana de esta fase; Fase 07 NO INICIADA.

Fase 06 código 12e05af070d84d7c9835e5f8070461a5e1e108ef publicado y CI final 42328459031 Success sin advertencias (1m32s); evidencia phase06-ci-final.json. Core intacto, árbol remoto verificado y fases anteriores preservadas. PR API continúa Forbidden, sin PR nuevo/merge; Git y CI web funcionan. Cierre posterior solo documental. Revisión humana pendiente; Fase 07 no iniciada.


## Estado vigente — Fase 07
Continuación autorizada y ampliación Pages: EN VALIDACIÓN. Experience PlayCanvas estática autónoma con fixture Edge compartido, 7 tiendas, 5 cámaras sincronizadas, entidades, eventos, consultas y acciones locales verificadas. API Core opcional real con CORS explícito, sin resultados falsificados. 29 Core + 4 estado + 3 navegador aprobados y exportación → Core → Output/dedup comprobada; evidencia de Edge y CI/publicación se añade al cierre. Pages inicial Success run 42330844212. Rama codex/phase-07-experience, sin merge a main. Ver docs/phases/PHASE-07.md. Las prioridades anteriores son históricas: vigente revisión humana de Fase 07; Fase 08 NO INICIADA.

Fase 07 publicación final: código 56d05f4 y revisión desplegada 1f1a3b3dd174cfe7c01b379cc887164347fcf93e, rama codex/phase-07-experience (sin merge). URL https://drbrownlabs-afk.github.io/Entity/ funcional y verificada con Chromium escritorio/móvil desde runner autorizado: run 42331518986 Success, sin advertencias, capturas/JSON en pages-verification (303 KB). CI final 42331518937 Success sin anotaciones, tres jobs; 29 Core + 7 Edge + 4 Node + 3 navegador y exportación→Core→Output aprobados, regresión Docker/persistencia/demos anteriores correcta. Git remoto descargado independientemente, historia previa conservada. Pages activo sin intervención del propietario. PR REST sigue Forbidden por entorno, sin PR nuevo/merge; no impide URL ni publicación Git. Limitaciones: móvil físico/Safari no probado, geometría ilustrativa/CCTV virtual, Core HTTPS público no desplegado, consulta local determinista sin LLM. EN VALIDACIÓN, no Fase 08. Evidencias phase07-ci-final.json y phase07-pages.json.


## Estado vigente — Fase 08
Autorizada por operador, EN VALIDACIÓN de entrega. Escenario integrado con nuevo Core HTTP y estado real de Experience: 20/20 comprobaciones locales aprobadas, memoria/relaciones/consulta, permisos, acción virtual verificada, reinicios/Outbox/dedup y backup/restore. Core sin cambios ni migración (schema5). Paquetes auditables y runbook/backlog implementados; instalación limpia y CI final aprobados, con evidencias y artefactos publicados. Rama codex/phase-08-delivery preserva main 5ce2519 y todas las fases anteriores. Sitio Pages de Fase07 conservado. Prioridad vigente revisión de entrega integral, no prioridades históricas ni autoaprobación de fases.


## Cierre vigente Fase 08 — 2026-11-07 UTC
Recuperado el entorno tras fallo de arranque, sin reiniciar fase ni repetir tests. CI final 42333312084 de 3978a9f02b9db4972738af6481c26ee8b498da03 confirmado Success (2m49s), cuatro jobs, sin anotaciones observadas: 29 Core/7 Edge/4 Node/3 navegador y 20 comprobaciones de circuito completo, cortes/reinicio/dedup/backup-restore, protocolo/vídeo y Docker/persistencia anteriores. Delivery aprobó instalación de fuente empaquetada en ruta limpia, repetibilidad de manifiestos y ZIP en escritorio/táctil con acciones offline después de cargar. Artefactos entity-delivery (951 KB, fuente+web+manifest+reporte), experience-evidence y edge-report disponibles en el run. Documentación y evidencia final publicadas en codex/phase-08-delivery; sin merge a main. Consulta REST de PR por rama sigue Forbidden; Git y Actions web funcionan, sin tarea Git manual del operador. Demo Pages conservada sin cambios. Pendiente revisión humana, hardware/LLM remoto/teléfonos físicos/producción según backlog. EN VALIDACIÓN; ninguna aprobación automática. Referencia completa docs/phases/PHASE-08.md.


## Estado vigente — Auditoría integral del MVP
Base701da12, rama codex/mvp-independent-audit. Tubería de observaciones/proyección/Output virtual funcional y Experience autónomo; plataforma integrada presenta bloqueos de piloto: A01–A10 en docs/audits/MVP-INDEPENDENT-2026-11-07.md. Sondeos adversos nuevos, no repetición exclusiva de tests: HTTP real detecta escritura anónima200 y fuente sin ámbito, ID cross-camera colisionado, snapshot2099 que congela presencia, memoria/temperatura sin respuesta contextual; Outbox bloqueada por422; Chromium confirma Core scene distinta de visor pese a acción verified. Cuatro parches pequeños verificados (JSON no finito, Bearer Unicode, tracks duplicados, exportación de Core mal etiquetada) y regresión local33 Core/6 Node/3 navegador aprobada. No se corrigen contratos/IDs/permisos globales ni sincronización completa de manera improvisada. CI final42377822190 Success y evidencia publicada; sin merge ni aprobación de fase. Fase08 EN VALIDACIÓN; no usar resultados verdes como garantía de piloto/producción.


Auditoría MVP cierre publicado: implementación51d9ab6, sonda/evidencia9f35abb, rama codex/mvp-independent-audit. CI final42377822190 Success2m38s, sin anotaciones observadas, cuatro jobs; 33Core/7Edge/6Node/3navegador y delivery limpio aprobados. Evidencias adversas separadas en docs/audits/evidence (incluida escena Core distinta de visor); diez hallazgos A01–A10 siguen abiertos, cuatro parches F01–F04 verificados. Datos sintéticos, sin hardware/LLM remoto; no cambio de schema/IDs históricos. No Pages desde rama de auditoría, web pública anterior; sin PR nuevo por Forbidden REST, sin merge a main. Cinco prioridades de piloto y límites en MVP-INDEPENDENT-2026-11-07.md. Fase08 EN VALIDACIÓN; CI verde no constituye aceptación del MVP integrado.


## Fase09 — Checkpoint parcial, EN CURSO (2026-11-07)
SSOG original a972d838 integrado mediante visor oficial, sin reemplazo de edificio: baf37b3 contiene evidencia escritorio1440/táctil emulado390, cuatro anotaciones originales y walk voxel nativo habilitado. Validación completa de rutas y cámaras pendiente. Download Vite autenticado no obtenido: no herramienta de escritorio interactivo ni sesión utilizable en el ejecutor; CONNECT403 local previo es del proxy, no prueba de autenticación. Receptor de originales Vite/SSOG listo y3tests de archivo aprobados.

Backend Office/Núcleo parcial persistente y UI conectable preservados en checkpoint de rama: 47tests API/SQLite aprobados (14Office+33anteriores), compilación web ejecutada. No E2E completo de Office, hardware, avatares animados ni cierre de gates09.1–09.9. No se declara piloto ni Fase09 terminados. Ver docs/PHASE-09-PROGRESS.md y docs/phases/PHASE-09-ASSET-INTAKE.md; PR#2/rama codex/phase-09-autonomous-plan, sin merge a main.


## Fase 09 — Corrección operativa registrada (2026-11-07)
SSOG original remoto integrado y probado en escritorio/táctil emulado; exportación Vite NO necesaria ni bloqueante, y no se perseguirá su descarga. El operador define mesa de reunión junto a pared, dos oficinas privadas contiguas de seis posiciones, resto de puestos individuales, recepción provisional en dos sillas negras aisladas y área de espera separada. Instrucciones actualizadas en AGENTS.md, docs/phases/PHASE-09.md y docs/PHASE-09-PROGRESS.md. El bootstrap existente requiere corrección semántica antes de validar inventario y reservas: NO afirmar implementada esa corrección. 09.1 EN CURSO; 09.2–09.9 PENDIENTES de gate aunque existe código parcial. Continuar sin pedir aprobación intermedia y sin depender de Vite.

Fase09 actualización: topología A–E y migración no destructiva implementadas, con pruebas de exactamente12puestos públicos y exclusión de A/B internos yC. Grafo y recepción/intercom persistentes con permisos, credenciales, privacidad y app personal enlazada;55testsCore PASS/build4páginas PASS. Sin certificar todavía recorrido físico de personajes ni coberturaCCTV o posicionamientoC/D/E. Fase09 EN CURSO; no depende de exportaciones.

Fase09 retomada:81b21ba publicado yCI67testsSuccess42405312827 confirmado.70tests locales actualesPASS incluyenotra sedeconfigurable, posesdeterministas yocupaciónmulticámara sinborrado/dobleconteo indebido. Respuesta personal autenticada prevalece sobreguion. Inspecciónoriginal lateral/suelo disponible; verificación gráfica Core→personaje→CCTV sigueen ejecución, no gate cerrado. Sin avance albacklogpost09.


## 2026-11-08 — Codex: integración nativa ENTITY en comprobación
Contrato espacial y referencias visuales del operador aplicados: interfaz propia, Dollhouse inicial, selección de entidades/relaciones/eventos/memoria, cámaras virtuales del mismo AppBase, timeline compartido y móvil con ficha inferior. SuperSplat sigue como motor del SSOG ORIGINAL; herramientas previas conservadas bajo ?diagnostic=1. No escena sustituta ni datos de ocupación inventados.
Causa reproducida de la demo vacía: operations.js exigía login antes de emitir mundo; Pages sin CoreHTTPS no tenía datos. Nuevo adaptador público explícito synthetic-core-replay, generado por el bootstrap/guion/observaciones/rutas reales del Core, con dos personas en el tramo calibrado. Cambios locales de reserva son de sesión, nunca persistencia Core; conexión autenticada Core sigue configurable. Ajv valida los contratos existentes.
Topología5: A/B oficinas completas; C/D seis puestos cada grupo; sin E ni Cstaff en jornadas nuevas. Migración conserva IDs, reservas y eventos antiguos; retira recursos obsoletos sin reasignación silenciosa. Calibración C/D y doce sillas procede de rayos del collider oficial en survey42448696140, sin afirmar escala métrica ni usar sillas como rutas humanas.
Pruebas frontend: npm --prefix apps/web test,15PASS; buildPASS. Chromium local1440/390: selección/grafo/feed/reloj/pausa/reserva de sesión/memoria/sin overflow ni pageerrorsPASS. Este ensayo local es SOLO estado/interacción: carga remota SSOG403 del proxy, NO validación visual del lugar. Prueba completa sobreSSOG yURLPages preparada enActions con informes/capturas nativas, pendiente de ejecución al publicar. Regresión backend actual en ejecución; resultados se registrarán por separado. Primer comando de unittest carecía de PYTHONPATH y falló importación; corregido a PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests.
Fase09 EN CURSO; PR#2/rama autorizada, sin merge ni aprobación. Pendientes inmediatos: inspeccionar capturas reales escritorio/móvil, corregir integración si falla y ejecutar regresiones Docker/API actuales. No fase10/11.


### 2026-11-08 — Codex: iteración visual con original y recepción real
Run42450920193 confirma desktop completo yfeedconSSOGresidentes; móvil falla porque D queda fuera delcampo horizontal, no se debilita el criterio: se corrige la cámara para orientar el largo del sitio en vertical. Capturas reales inspeccionadas, sin sustituirlas por imágenes ideales. La captura tiene artefactos deGaussianSplatting fuera de las paredes; no se presenta como un modelo arquitectónico limpio. Se mantienen límites de rutas calibradas a un minuto, no jornadaespacialcompleta.
Añadida validación Observationv1 mediante Ajv enadaptadorpúblico ycomprobación de captura/trackanónimo real delrender en el E2Eoriginal. Memoria deladaptadorCore consulta entity_id enservidor; memoria localresuelvepersonayrecursodelaacción con relacionesconcernsPerson/usesResource. Unaafiliaciónorganizacionalno seconvierteenposiciónfísica de unapersonasinpose.
RecepciónHTTP/procesos/tresclientes1280/390PASS:103entidades/19eventos conservados, backupSQLiteíntegro; pruebasde permisos/revocación/formulariovivo/horasdeagenda/privacidad del visor siguenoperativas. Evidencia reception-http-process.json y capturas actualizadas. 15frontendPASS después delos cambios;buildPASS. No aprobación ni avancefase.


## 2026-11-08 — Codex: auditoría backend para laboratorio nativo
Por instrucción posterior del operador se suspende desarrollo frontend Gaussian Splatting/personajes/NPCs; se conserva todo el WIP sin mezclarlo con la fuente auditada40850d1. Worktree/rama codex/backend-readiness-audit; sin merge/main ni cambio de servicios/bases de trabajo. Informe docs/audits/ENTITY-BACKEND-READINESS.md y evidencias adjuntas:86CorePASS61.252s,7EdgePASS,18sondasHTTPlegacy con defectos reproducidos, Outbox422 bloqueada y sondaOffice referencia zona inexistente200. No correcciones implementadas ni fases aprobadas. Recomendación: iniciar modelado/clientelectura Blender+PlayCanvas reutilizando Office; antes de integración interactiva cerrar transporteEdge por sede/run, integridadreferencial y contratoGT/poses separado de observaciones. No hardware/LLMremoto/rendernuevo ejecutados. Publicación en rama de auditoría; trabajo anterior intacto.


## 2026-11-08 — Codex: entrega geométrica sin reconstrucción
Rama codex/synthetic-office-geometry-handoff. Generados docs/spatial-simulation/GEOMETRY-HANDOFF.md, SPACE-INVENTORY.json, ANNOTATIONS-MAP.json y WALKABLE-FLOOR.obj desde evidencia versionada40850d1. Extractor offline reproducible:56entradas/7anotaciones/16709vértices/29526triángulos, IDs únicos y referencias internas válidas. Fuentes originales/voxels conservadas, escala métrica no verificada, componentes sin segmentación explícitos como desconocidos. No backend/UI/escena modificados, no Blender ni nueva validación física.

## Estado de coordinación — 2026-11-08
- **Proceso 1:** decisión de alcance: Fase 09 como última fase de la línea original. Esto no certifica que todas las pruebas y despliegues de cada rama estén aprobados; usar informes/CI para verificación.
- **Proceso 2:** ACTIVO. Fases 01–07 corresponden solo al entorno 3D, no al gemelo integral. Continuar con cámaras/percepción y posteriormente integraciones operativas completas (seguridad, accesos, reservas, CRM, facturación, documentos, redes, mantenimiento) sobre un mundo compartido. Estados concretos de fases/gates requieren inspección de commits y pruebas.
- **Proceso 3:** posterior; no se autoriza implementación de agentes todavía.
- **Decisiones:** ver `docs/ENTITY-MASTER-SPEC.md` y `docs/DECISION-LOG.md` (consolidación 2026-11-08). El roadmap global 08–15 está revocado como secuencia ejecutable; antiguas fases 10/11 reasignadas.
- **Operación documental:** dos archivos redundantes creados por error fueron eliminados en `2a723211`; se conserva el sistema original de memoria compartida. Esta actualización es **solo documentación**: no se modificó software ni se ejecutaron tests.
