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
