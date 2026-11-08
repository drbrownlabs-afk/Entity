# Handoff compartido — ChatGPT ↔ Codex

Fecha: 2026-11-07. Rama: `codex/phase-09-autonomous-plan`.

## Regla operativa permanente
Cualquier implementación realizada directamente por ChatGPT debe registrarse aquí y en `docs/PHASE-09-PROGRESS.md` cuando afecte a la Fase 09. Codex debe leer este archivo, `AGENTS.md`, el progreso y el estado actual del árbol ANTES de editar. El registro describe cambios realizados; **no** demuestra que las pruebas pasaron. Nunca atribuir a ChatGPT commits o verificaciones de Codex.

Antes de modificar archivos: sincronizar rama, inspeccionar diff/commits recientes y preservar cambios concurrentes. Tras modificar: registrar commits, archivos, decisiones, pruebas realmente ejecutadas, fallos y pendientes. No marcar tareas como completas solo por documentación. No sustituir implementación existente por otra más simple.

## Implementaciones realizadas directamente por ChatGPT en esta conversación

1. `26f65bf`: `services/entity-api/app/office/personal_app.py`: API personal autenticada con bandeja persistente por sitio y usuario, llegada sintética manual y respuestas `ready`/`five_minutes`. Es una tabla de mensajes independiente: **todavía no emite eventos al grafo ni Web Push**.
2. `3ff4ad6`: montaje de router en `services/entity-api/app/main.py`.
3. `a23f1fe`: `apps/web/personal.html`: cliente móvil con login, bandeja, respuestas y demo manual.
4. `4d63060`: nueva entrada `personal.html` en Vite.
5. `b2a0b41`: prueba básica `services/entity-api/tests/test_personal_app.py`.
6. `1270e7d`: registro inicial de progreso.
7. `7ed86fc`: `services/entity-api/app/office/access.py`: proyección de mundo filtrada por rol y persona.
8. `04d27d5`: rutas de mundo/consulta/eventos/stream/capacidades con controles de lectura.
9. `cbb041a`: `personal.html` consume el mundo del mismo Núcleo, presenta simulaciones y entidades visibles.
10. `c4ee906`: corrección de import de autenticación y bloqueo de comparación de escenarios para miembros.
11. `16c46ea`: pruebas unitarias de proyección `test_personal_access.py`.
12. `b68ee51`: registro de progreso de permisos móviles.

**Importante:** estos cambios no fueron ejecutados ni validados por ChatGPT en un runtime. Codex debe ejecutar backend tests, build frontend, pruebas de permisos por endpoint, y revisar cuidadosamente seguridad antes de declarar listo. Al leer este handoff, verificar el árbol actual porque Codex puede haber seguido trabajando en paralelo.

## Decisión de producto vinculante
ENTITY Spatial Intelligence es una sola plataforma con un solo Núcleo, grafo y estado compartido. La interfaz principal de escritorio y la aplicación móvil son clientes de la MISMA plataforma, no productos con lógicas independientes. La PWA personal inicial debe evolucionar hacia una interfaz móvil con paridad funcional *dentro de las capacidades autorizadas*.

**José** representa un usuario operador de Impacto/Cowork: consulta cámaras autorizadas, ocupación, reservas, personas y eventos operativos; puede crear/cancelar reservas o eventos y consultar por texto/voz «¿Qué está pasando ahora en el coworking?». Su acceso se limita al sitio, ámbito y recursos realmente asignados, no simplemente a todo por llamarse operador.

**Carlos** representa miembro de la organización Entity, vinculado a Ambiente A: solo su información, su ambiente, reservas, visitas, reuniones y datos compartidos autorizados. No puede consultar cámaras ni reservas privadas ajenas, incluso si manipula API o hace una pregunta al agente. Las reglas de autorización deben ejecutarse **en servidor** y cubrir consultas, mutaciones, streams, búsqueda, eventos, cámaras, voz y notificaciones. Nunca confiar en esconder botones.

**Daniel** representa visitante sintético: check-in desde kiosco y notificación al anfitrión. Carlos, persona real, recibe push en su teléfono, responde y la respuesta modifica el estado/eventos del mundo simulado; ENTITY informa a Daniel. Distinguir participante remoto de presencia física observada.

## Trabajo pendiente para Codex
- Auditar el árbol actual y reconciliar los cambios de ChatGPT con las implementaciones recientes de Codex, sin duplicar sistemas de recepción/intercom ni sustituir funcionalidades avanzadas.
- Revisar `access.py` y toda la API por filtraciones, especialmente proyecciones con campos sensibles, queries, evidencia, endpoints de eventos, permisos de operador, streams y acceso multi-sede. El filtro inicial es deliberadamente conservador y no sustituye un modelo completo RBAC+ABAC+relaciones.
- Integrar `personal_app.py` con eventos, entidades y comandos existentes del Núcleo; eliminar duplicación conceptual de notificaciones si ya existe.
- Convertir el cliente móvil en interfaz responsive del visor y controles de ENTITY, sin duplicar el mundo. Incluir cámara solo si está autorizada, reservas y eventos con acciones auditadas, consultas de IA situada basadas en evidencia, notificaciones push HTTPS opt-in y fallback.
- Demostrar dos sesiones simultáneas José/Carlos: la misma modificación del estado del mundo se refleja en ambos dispositivos, con datos diferentes según permisos. Pruebas E2E y en Android real.
- Preservar las reglas de Synthetic Office, inventario A–E, 12 escritorios D/E, kiosco y el resto de Fase 09. No inventar datos, presencia ni coordenadas.

## Convención de actualizaciones
Añadir una entrada cronológica por lote con autor (ChatGPT/Codex), SHA, archivos, resultado, comandos de test y pendientes. Si una validación no se ejecutó, escribir explícitamente «no ejecutada». Ante trabajo concurrente, leer último SHA y resolver diferencias antes de escribir.

## 2026-11-07 — Codex: integración ejecutada, no atribuida a ChatGPT
Leídos e integrados64ee2b1 y todos los incrementos previos de ChatGPT sin reemplazar la app personal. Codex publicó31ebc19: inventarioA–E, grafo, kiosco/intercom y enlace inbox→comando/eventoCore. Lote siguiente: jornada persistente, repetición aislada, permisos por recurso (José explícitamente asignado aD/E y cámaras virtuales autorizadas), historial, consultas y canales filtrados en servidor. Continúan representación3D nativa y preparaciónRocketbox; no se afirma que personajes/rutas estén completos.

Codex ejecutó64CorePASS,3Playwright mallPASS ybuild4entradasPASS. Chromium real1280/390 conuvicorn separado: check-inDaniel, respuestaCarlos desdepersonal.html yrecepción reflejada enCorePASS; reinicio conserva16eventos/99entidades ybackup íntegroPASS. Evidencias reception-http-*.json, kiosk/personal*.png ybackend-regression.txt. Micrófono,Androidfísico yWebPush NO EJECUTADOS. Apppersonal sigue sinPush; polling/consulta no son notificaciónAndroid.

Corregidos: puestos privados ofrecidos individualmente; replay heredaba reservas; permisos por rol sin recursos explícitos; escenarios podían exponer contenido completo; pruebas pytest-style no recogidas por unittest (ahora wrappers ejecutados). EsquemaOffice aditivo, IDs/historial conservados yproyecciónCore porrun. Pendientes: anclasC/D/E/recepción verificadas, rutas/personajes/CCTV geométricamente sincronizados, PushHTTPS/Androidreal yentrega integral. Fase09 EN CURSO, no aprobada.

## 2026-11-07 — Codex, siguiente lote ejecutado
CI recuperado: faltaba crear .runtime/phase09 encheckoutlimpio; d3b28f7, Actions42404091061/42404097987Success. Errorreal conservado enci-failure-128495075909.txt, obtenido conRESTautorizado delrunner sin exponer token.67testsCorePASS,2tests deagente pruebanSDKoficial contransportecontrolado, permisos, timeout ytraza; noLLMremoto sinclave. Consulta guiada identificada como tal, ninguna prosa demodelo se usa comohecho.

CoreDockerOffice8010saludable/reiniciopersistente, Coreanterior8000conservado; docker-office.json. Separa respuesta personal autenticada de respuesta sintética yde presencia física: apppersonal puede responder sinatribuirle posición, espera→listo sincroniza inbox yCore. Se preservan implementaciónoriginal yscopesdeChatGPT ampliados congrants porrecurso/consultas/eventos/streams.

AssetsMicrosoftRocketboxMIT:6GLB conidle/walk/seated/sit-down/stand-up/conversation, preparaciónoriginal verificadaconPlayCanvas (avatar-assets.json). CCTV4vistas(2móvil) mismaapp/SSOG, evidenciacapturasremotas. Anotaciones propias deespera/descanso derivadas depicks revisados ycompatibles conSuperSplat, noescena alternativa. Gateespacial/personajescompletos pendiente, asícomoPushHTTPS yAndroidfísico; no cerrarFase09.


## Backlog acordado tras Fase 09 — 2026-11-07 (ChatGPT)
Documento de diseño creado: `docs/POST-PHASE-09-SPATIAL-INFERENCE-REGISTRATION.md`, commit `1aeb4abc69a76bd1ba418325ec150328a8ae0648`. Contiene decisiones completas sobre calibración automática/semi-automática de cámaras al gemelo (AprilTag, ChArUco, COLMAP, Orbbec RGB-D/ICP, sincronización temporal), inferencia contextual multievidencia, ReID/MC-MOT, hipótesis versionadas, incertidumbre, privacidad, pruebas adversas y plan incremental. **No implementado; comenzar solo tras terminar y validar Fase 09.** Codex debe leerlo al planificar la fase siguiente. Esta actualización es documental; pruebas no ejecutadas.

## 2026-11-07 — Codex, recuperación y siguientes pruebas
81b21ba sí estaba publicado;67tests yCI42405312827/PR42405316680Success confirmados. Integrado backlogposterior aFase09 (a501b32), sin iniciar esa ampliación. Preservados cambios deChatGPT. Nuevos70testsPASS y3diariosPASS traspriorizar respuesta autenticada sobrepersonaje deguion. Ensayoonboardingotra sede conIDs/timezonedistintos, persistencia eaislamiento; configuraciónkiosco/espera/organización deja de estar acoplada aIDs deSyntheticOffice.

Nuevo contrato de rutasdeCore conreloj único/historia/aislamientoWhat-if. Corrección ocupaciónmulticámara: vacío/desconectada noerase evidencia deotra cámara; solapa anónimos seexpresa comorango, identidad solo trasverificación. Modeloshumanos yCCTV consumen lamisma poseCore. Seañade prueba remota sobreelSSOG real conpickerSDK, no sustitución visual; suresultado aún pendiente, no presumirverificaciónespacial. Capturaslaterales/suelo reales obtenidas trascorregirscriptdeinspección6ce1477.

## Codex — Incremento móvil y fallo deanimación integrado
Control de capacidades ahora es un móduloUI común paraOffice ypersonal, conmismaAPI/permisos deCore. E2Ereal1280/390 añade crearreserva deA porCarlos, ademásdelcheck-in/respuesta/persistencia;PASS. Arreglada revisión obsoleta después derespuesta personal(409correctodelservidor): refrescarCore, no omitirconcurrencia.
Primeraprueba espacialconSSOGreal falló porAnimComponentSystem faltante enAppBasedelvisor. QAaislado deassets había pasado; integración detectó eldefecto. Corregido añadiendo sistemaoficial a lamismaapp; diagnóstico localsolodeestadoPASS(no equivaleaSSOG). Nueva verificaciónremota pendiente; no seafirma 09.2/09.3completas.

## Codex — Corrección de pose y acceso, 2026-11-07
71tests completosPASS; dosdirigidos deaccesoPASS. PruebaSSOG42418437402detectó rootmotionGLB sobrescribiendo poseCore: seintroduce contenedor estable conmodeloanimado hijo, cincoinstantesCore/rendererPASS local(sinSSOG). No declarar09.2/09.3completas hasta prueba remota. Picker usa misma cámara renderizada (clon deshabilitado carecía deprofundidadSSOG). CCTV renderactivo; survey continúa pasillo nativo. Visita host_ready autorizable solo adestino/horario dereunión conescort/presencia; separación organizacional deoficinas aplicada. Conservar geometría/anclas aúnpendientes.

## Codex — Estado al publicar el siguiente lote, 2026-11-07
74tests backend PASS50.075s; Docker actual8010 conserva89entidades/5eventos trasreinicio yCore8000saludable. Revocación de sesión implementada/testeada; E2E1280/390 verifica logout, recepción, respuesta personal, reservaA, grafo y ausencia de cámaras privadas/Luis en proyección. Consultas Office/personal comparten módulo; formularios no se reinician al refrescar.
Última evidencia espacial08f2295: poses coincidentes en5instantes ypersona visible, pero picker devuelve0. C32c633 corrige worldToScreen que aplicaba rectdelazulejo a un targetcompleto. No marcar seguimiento verificado hasta nuevo resultado. CO2dereunión ahora tiene fuente lógica separada, baseline ambientalD/E y4testsdiariosPASS. Jornadas antiguas preservadas. Inventario visualC/D/E yrecepción no completado. Backlogpost09 no iniciado.


## 2026-11-08 — Codex: reloj Core, jornada activa y replay conservador
Implementado un único productor de reloj por ejecución en Core, play/pause/velocidad autorizados, pasos transaccionales de250ms y pausa al reiniciar sin sumar tiempo fuera de servicio. Un fallo de adaptador revierte reloj y acciones del paso y deja un evento de fallo, sin reintento destructivo. Replay crea otra ejecución, instala el guion y cambia la jornada activa en una sola transacción; conserva mundos e historial anteriores. Office, personal y kiosco siguen por defecto la jornada activa; elegir una ejecución explícita permite inspeccionarla. Inbox enlazado se filtra por ejecución; el mensaje demo aislado no se presenta como llegada del grafo. El kiosco solo obtiene ID/reloj, no datos privados del mundo. Hora civil usa la zona horaria de la sede, rechaza horas DST inexistentes/ambiguas.
Pruebas reales: PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests -v:81PASS59.139s; test_office_playback.py:3PASS5.074s; npm --prefix apps/web test:10PASS; npm --prefix apps/web run build:PASS. CHROMIUM_PATH=/usr/bin/chromium .venv/bin/python scripts/phase09/demo-reception-http.py:PASS1280/390, cambio compartido de jornada, play/pause, privacidad/logout tardío, recepción/intercom/reserva/grafo; reinicio HTTP108entidades/19eventos y backup integrity_checkPASS. Informes reception-http-*.json y backend/playback-regression.txt. El primer intento E2E esperaba observar08:00 a60× pese al polling3s: timeout del aserto; corregido comparando el reloj Core monotónico, sin ralentizar ni fingir el avance. El primer comando unittest sinPYTHONPATH no importaba app; repetido con el comando correcto anterior.
La evidencia SSOG original previa sí prueba22muestras físicas de pasillo libres,5poses Core/GLB,2CCTV y observación anónima/historia. No certifica rutas completas de jornada ni localización C/D/E: cuatro grupos se han localizado visualmente, correspondencia funcional de cinco ambientes sigue sin resolver. Recepción se ancló al sector de sillas negras, no a un kiosco medido. No se inventan muebles ni posiciones. Sin Android físico, micrófono real, WebPush ni LLM remoto verificados. Docker/CI/Pages del nuevo lote pendientes de ejecutar; no se reutiliza evidencia anterior como si probara código nuevo. Fase09 EN CURSO, PR#2 sin fusionar, sin aprobación humana ni avance a10/11.


## 2026-11-08 — Codex: memoria temporal y tercer cliente sincronizado
Backend83PASS60.502s (incluye2nuevas pruebas de filtros temporales/aislamiento). Memoria filtra entidad, zona, tipo e intervalo, aplica cursor después de filtrar y reconstruye relaciones históricas; no usa ubicación actual para reescribir el pasado. UI conserva filtros, scrubbing y evidencia; fecha en timezone de sede. SSE ahora entrega el evento no privado site.active_run_changed también a operadores acotados.
E2E real1280/390PASS: José enOffice y Carlos enpersonal, máskiosco, siguen replayactivo; mensajes anteriores desaparecen; relojplay/pausecompartido; JoséfiltraD1/ZONE-D/run.created, seleccionaevento yreconstruyehistoria sinCarlosprivado. reception-http-browser.json/memory-390.png; reinicio conserva108entidades/19eventos ybackupPASS. BuildPASS y11NodePASS (incluye rechazo de fecha civil imposible). No se afirma pruebaespacialSSOG nueva por esta ejecución local.
Arranque se prepara encontenedor con dependenciasfijadas, sinvenvhost, másfrontendcompilado. PrimerensayoconUIDdelhost detectó appDocker copiada conpermisos700/600 delworkspace; corregido chmoda+rX delcódigo público enimagen, sin cambiarpermisos0600decredenciales/datos. Nuevo ensayo con UID del anfitrión PASS: bootstrap en contenedor, up --wait y ready. Smoke posterior conserva98entidades/14eventos y Core8000saludable. EntregaZIP rotulaOffice/Coreobligatorio ySSOGremoto, sin vender todaslasentradascomoautónomas;CIañadeE2EOfficeextraídodelpaquetelimpio. VerPHASE-09-RUNBOOK.md. No cambianaprobaciones ni seabrenfases10/11.


## 2026-11-08 — Codex: inventario observado sin duplicar capacidad
Dos grupos de seis posiciones sin anotación original, visibles en original-plan-near-clipped/far, pasan a InventoryItem persistente con IDs OBSERVED-WORKGROUP-01/02 y relación partOf hacia la sede. No se asignan a C/D/E sin prueba; position y resource_mapping permanecen null, no son reservables ni comerciales y no aumentan la oferta12D/E. Bootstrap aplica la observación de forma aditiva e idempotente sin borrar reservas/historial. Prueba dirigida1PASS1.058s: reservaD1 conservada, docepuestos exactos, grafo, rechazo de booking para mobiliario sin capacidad declarada e idempotencia tras initialize. El primer aserto esperaba422, pero la API rechaza correctamente404 por ausencia de capacidad; no se cambió el servicio para acomodar el test. Regresión completa posterior en curso.
La configuración espacial dd4090d fue rechazada porActions42442701961: concurrency duplicado durante edición de workflows. Corregida inmediatamente en51178c9 restaurando el job espacial completo y un único bloque. No es un fallo del modelo del mundo. Se espera conclusión real de la nueva ejecución antes de declarar CI verificado. El trabajo no avanza aFase10/11.
