# Auditoría técnica integral del MVP ENTITY — fases 00–08

Fecha: 2026-11-07 UTC. Base auditada: [701da1210ab893c20b3fe6b0cbec2ab7605d0842](https://github.com/drbrownlabs-afk/Entity/commit/701da1210ab893c20b3fe6b0cbec2ab7605d0842), última entrega de Fase08. Rama de auditoría: `codex/mvp-independent-audit`. Consulta de todas las ramas remotas confirma que `main` sigue en 5ce2519: el MVP acumulado está en las ramas de entrega, no fusionado a main. Se preservó toda la historia. Esta revisión parte de inspección y experimentos adversos nuevos; no es una certificación externa de seguridad.

## Conclusión para el operador

Hay una tubería funcional que convierte detecciones/observaciones en entidades y estado persistente y ejecuta acciones virtuales con trazas. Hay también una experiencia 3D autónoma demostrable. **La coherencia entre esos productos y el aislamiento del Core tienen defectos que bloquean un piloto con datos reales o acceso compartido.** Las pruebas verdes de entrega demuestran los recorridos probados; no acreditan las propiedades adicionales investigadas aquí.

Tres ejemplos reproducidos: se puede cambiar el estado del Core sin token y contradecir la pantalla; un mensaje de 2099 deja la presencia congelada; una acción verificada por el Core no actualiza la escena que muestra Experience. La consulta controlada devuelve el mismo resumen para preguntas diferentes y no responde usando una memoria existente cuando falta estado. Esto limita el alcance real de «IA situada».

Se corrigieron cuatro defectos acotados. Se dejaron los cambios de permisos, identidades, políticas temporales y sincronización completa para una intervención diseñada y revisable: corregirlos apresuradamente alteraría contratos, datos persistentes o arquitectura. Ninguna fase se aprueba automáticamente. **Fase08 continúa EN VALIDACIÓN; uso productivo/piloto no validado.**

## Método, alcance y evidencia

- Inspección Core/SQLite, Edge/adaptadores, Output, agente, Experience, contratos, Compose, CI y memoria del repositorio.
- [scripts/audit-mvp.py](../../scripts/audit-mvp.py): uvicorn real en loopback, HTTPX, base SQLite nueva y datos ficticios aislados; reinicio real del proceso. 13 sondas iniciales y 18 después de ampliar los casos. La columna `desired` expresa una propiedad deseada para piloto, no un criterio previamente implementado; persistir el último snapshot es válido como historial, pero falta distinguirlo de presencia actual confirmada.
- [scripts/audit-edge.py](../../scripts/audit-edge.py): Outbox SQLite real con transporte HTTPX controlado para investigar un 422 permanente. Este experimento no se presenta como fallo físico de cámara/red.
- [apps/web/scripts/audit-state.mjs](../../apps/web/scripts/audit-state.mjs): objetos del adaptador real del visor, entradas duplicadas y procedencia; sin dispositivo físico.
- [apps/web/scripts/audit-sync.spec.mjs](../../apps/web/scripts/audit-sync.spec.mjs): Chromium real, backend HTTP Core temporal, proveedor controlado y Output virtual. Mide el desacuerdo Core/visor después de acción verificada. Que la sonda termine sin excepción no significa que la sincronización funcione: el reporte contiene `scene_matches_core: false`.
- [Evidencia antes/después Core](evidence/MVP-core-before.json), [Core ampliado después](evidence/MVP-core-after.json), [cola](evidence/MVP-edge.json), [visor antes](evidence/MVP-viewer-before.json), [visor después](evidence/MVP-viewer-after.json), [navegador](evidence/MVP-browser.json) y [captura](evidence/MVP-browser.png). No se modificó ninguna base/servicio del usuario ni se usaron equipos o credenciales ajenos.
- No se ejecutó un LLM remoto, hardware, prueba de carga de instalación, pentest externo ni evaluación estadística de precisión del detector. No se asume que una plantilla de API pruebe un servicio conectado.

## 1. Qué existe y qué circula realmente

| Componente | Implementado y observado | Simulado, pendiente o límite |
|---|---|---|
| Core | FastAPI y SQLite esquema5; entidades, estado clave/valor, relaciones tipadas explícitas, eventos, memorias y capacidades; persistencia transaccional y migraciones aditivas | Tipos extensibles sin ontología validada por sitio; SQLite local; PostgreSQL/PostGIS y Scorpio sin adaptador funcional; rutas básicas abiertas |
| Edge visual | Captura OpenCV; detector HOG/SVM preentrenado y tracker Norfair existentes; zonas de imagen, sesiones de track, Observation v1 y Outbox durable | Orbbec/USB/depth/calibración no integrados físicamente; puntos 2D normalizados, no posición métrica ni identidad entre cámaras; HOG sin precisión validada para piloto |
| Ingestión | JSON HTTP real; valida manifest/protocolo/tipo; conserva UUID/cuerpo, auditoría y evento; `edge.presence` proyecta Camera/PersonTrack/Zone, relaciones observedIn y estado | `site_id` no vincula/valida sitio real; autorización global por permiso; sensores/reservas quedan como eventos, sin estado materializado |
| Integraciones externas | Adaptadores Paho MQTT, OpenCV RTSP y REST; demos anteriores usan servidores locales reales | Datos de sensor/reservas ficticios; sin instalación externa/NVR/ONVIF real; perfiles requieren configuración manual, no onboarding universal |
| Output | Regla de presencia y command/agent llevan a SQLite virtual, lectura posterior, estados verified/fail/timeout/mismatch, modo manual y trazas | «Verified» confirma la salida virtual; no HDMI, TV, proyector ni carga eléctrica. Pantalla HTML lee virtual_outputs; vista de entidad lee entity_state: pueden divergir por escritura genérica |
| Agente | SDK oficial OpenAI opcional; por defecto controlled-fixture; una entidad por petición, evidencia de estado/relaciones/eventos/memorias/capacidades; autorización y trazas | Herramienta admisible predeterminada por petición; respuesta final programada, sin síntesis conversacional del modelo. Relacionadas no se expanden; máximo20 eventos/memorias y50 relaciones |
| Experience | PlayCanvas/Vite estático, siete tiendas, cinco vistas, eventos/acciones/consultas locales; mismo objeto alimenta vistas; exportación compatible | No ingestión continua al Core. Botón exporta archivo, no lo envía. API opcional lee una entidad manualmente; tiendas/HVAC son locales, no entidades enlazadas. CCTV virtual, geometría ilustrativa |
| Entrega | CI, Docker y paquetes con manifiesto; instalación en ruta limpia probada en Fase08 | Main desactualizado respecto a entrega; no Core productivo, respaldo operativo/retención ni matriz de dispositivos reales. Los paquetes necesitan descarga de dependencias |

Flujo visual real implementado: vídeo → OpenCV/HOG/Norfair → coordenadas/zonas → JSON Observation → Outbox → REST Core → proyección → regla → Output virtual. Flujo no visual: MQTT/REST → perfil → Observation → evento Core. Este último no actualiza automáticamente una temperatura consultable como estado.

El vídeo de regresión vtest.avi es una grabación pública de OpenCV procesada por un detector real; no es una cámara del piloto ni una evaluación de precisión. Los nuevos sondeos de esta auditoría usan datos sintéticos.

El fixture JSON se comparte entre Edge y Experience, pero sus consumidores **no comparten el mundo completo**: Edge añade tracker/sesiones y zonas left/right; el visor usa visitantes con desfases y zonas corridor-north/south, tiendas y HVAC propios. Compartir muestras y contrato no equivale a que sus IDs/entidades/relojes representen una misma instancia del mundo. En el modo local esto es una demostración claramente etiquetada; no acredita sincronización Core↔Experience.

## 2. Consistencia de contratos y arquitectura

Resultado positivo: los ocho JSON Schema publicados de Manifest/Observation/Capability/Invocation/Rule/Command/DisplayConfig/Ask coinciden con los modelos de ejecución inspeccionados; [comparación](evidence/MVP-contracts.json). El OpenAPI histórico core/v1 contiene9 rutas frente a19 actuales; es una instantánea de Fase01, no todo el API actual. No se encontró deriva de esos ocho esquemas; faltan contratos compartidos completos del mundo y del payload espacial.

`edge.presence` se define en app/edge_projection.py, separado de Observation genérico. Estado/attributes/payload genéricos admiten cualquier objeto JSON y las relaciones usan nombres arbitrarios: no hay validación semántica de que una clave derivada conserve el significado de su proyector. El nuevo rechazo de números no finitos evita un caso concreto, no introduce esa ontología.

Hay dos conceptos diferentes de capacidad: Core guarda una declaración en capabilities; Output la resuelve por ID y exige operación/permiso. El simulador de Fase02 acepta un Capability completo suministrado por el cliente y no comprueba que su ID exista en capabilities. Se reprodujo ejecución 200 con un ID aleatorio no declarado. La autorización simulate:write sí existe; no debe confundirse con ejecución anónima ni con una capacidad declarada y vinculada por servidor.

Hay dos fuentes de valor para la pantalla (`virtual_outputs.scene` y `entity_state['display.scene']`), dos memorias de eventos (local efímera del visor y Core durable) y representaciones distintas de zonas/capacidades. No son duplicaciones idénticas que se puedan borrar sin diseño; necesitan propiedad y traducción explícitas. Core mantiene aislamiento de librerías de visión/render: no incorpora OpenCV, Norfair ni PlayCanvas. No se justifica cambiar de motor ni añadir otro framework. El SDK LLM es dependencia instalada aun usando controlled, pero no se observó un fallo por esa dependencia; no se hicieron optimizaciones especulativas.

## 3. Defectos y brechas, por gravedad

Gravedad en contexto de piloto compartido: «crítica» no afirma exposición actual a Internet. Compose publica 127.0.0.1:8000; los experimentos fueron locales.

| ID | Gravedad/estado | Hallazgo y evidencia verificable | Referencia de implementación |
|---|---|---|---|
| A01 | Crítica antes de exposición · abierta | Core CRUD/lecturas sin autenticación. PUT anónimo del display devuelve200; entidad dice `unauthenticated-forgery`, HTML sigue welcome. Permiso observe:write acepta otra fuente/conector/sitio inexistente (200). Puede adulterar evidencia y leer datos; no se ejecutó actuador físico. Commands anónimos sí devuelven401 | [main.py](../../services/entity-api/app/main.py), [connectors.py](../../services/entity-api/app/connectors.py); casos anonymous_core_write/observe_token_scoped_to_connector_source_site |
| A02 | Alta · abierta | Colisión determinista: cámara `a:b`, track `c` y cámara `a`, track `b:c` producen1 PersonTrack donde se requieren2. Concatenación ambigua en UUID; también aplicable a zonas. Riesgo de mezclar cámaras/relaciones. Cambiar IDs requiere compatibilidad/migración, no parche silencioso | [edge_projection.py](../../services/entity-api/app/edge_projection.py), función identity; camera_track_id_isolation |
| A03 | Alta · abierta | Timestamp2099 queda como snapshot; observación actual vacía se archiva pero no actualiza ni libera presencia. Persiste tras reinicio. No TTL/heartbeat/freshness ni límite de adelanto; `as_of` del agente es momento de consulta, no prueba de observación reciente | [edge_projection.py](../../services/entity-api/app/edge_projection.py), [agent.py](../../services/entity-api/app/agent.py); future_event_does_not_freeze_camera/restart_expires_unconfirmed_presence |
| A04 | Alta · abierta | Outbox conserva un422 permanente, reintenta el mismo y nunca intenta el siguiente válido:2 pendientes después de dos intentos forzados. No pérdida, pero entrega detenida indefinidamente. Sin cuarentena/reparación operativa ni drenaje autónomo cuando acaba el productor | [pipeline.py](../../services/entity-edge/entity_edge/pipeline.py), Outbox.flush; MVP-edge.json |
| A05 | Alta funcional · abierta | Sensor19°C ingresa como evento; state vacío y respuesta «No hay estado registrado». Reservas también solo eventos por inspección. Información persistida no equivale a contexto actual computable compartido | [integrations.py](../../services/entity-edge/entity_edge/integrations.py), [connectors.py](../../services/entity-api/app/connectors.py); sensor_projects_current_state |
| A06 | Alta para promesa de IA situada · abierta | Preguntar personas o temperatura devuelve la misma respuesta de estado. Memoria «recepción cerrada» existe en evidence, pero answer indica que no hay estado. No expansión de entidades relacionadas, sin frescura semántica. No implica que los datos sean inventados: es un resumen fijo insuficiente | [agent.py](../../services/entity-api/app/agent.py); question_changes_answer/memory_only_answer_uses_recorded_memory |
| A07 | Alta para integración/sincronía · abierta | Navegador: Core display=`audit-verified-scene`, vista=`welcome`, mode=core; cinco cámaras comparten revisión local. Tras acción se vuelve a leer la cámara consultada, no la entidad display afectada. No suscripción/polling ni proyección completa del mundo | [main.js](../../apps/web/src/main.js), api-act/api-connect; MVP-browser.json y captura |
| A08 | Alta para modelo de capacidades · abierta | Invocación simulada usa ID Capability inexistente y modifica estado (200). Además puede tocar claves derivadas sin reconciliar Output. El permiso es global; no hay vínculo declarativo servidor entre capability/conector/entidad/clave | [connectors.py](../../services/entity-api/app/connectors.py), invoke; simulation_capability_must_be_declared |
| A09 | Media · abierta | Al volver de Core a local se conserva `remote-alert` como escena local; el reloj/eventos provienen de contextos distintos. El modo se etiqueta simulación, pero no se restaura de forma explícita su estado anterior | [world.js](../../apps/web/src/world.js), local/applyCore; MVP-viewer-after.json |
| A10 | Media operativa · abierta | Eventos/datos genéricos sin límite de tamaño/retención por entidad; listas sin paginación y contexto limitado pueden terminar en413 para agente. Sin backup automatizado cifrado/retención/alertas ni prueba de carga. Main no contiene la entrega acumulada. Son brechas observadas por inspección; no se simula una certificación de capacidad/seguridad | [main.py](../../services/entity-api/app/main.py), [agent.py](../../services/entity-api/app/agent.py), [migraciones](../../services/entity-api/app/migrations), ramas remotas |
| F01 | Alta de integridad · corregida | JSON NaN se persistía antes de500 y GET posterior también fallaba. Ahora devuelve422 antes de escritura y conserva estado/eventos. También Infinity y overflow1e999, anidados/attributes/events | [schemas.py](../../services/entity-api/app/schemas.py), [main.py](../../services/entity-api/app/main.py); antes/después Core y test_audit_regressions |
| F02 | Media · corregida | Bearer no ASCII generaba500 por compare_digest. Ahora401; token configurado no ASCII produce503 de configuración | [connectors.py](../../services/entity-api/app/connectors.py), authorize; pruebas nuevas |
| F03 | Media visual · corregida | applyCore aceptaba dos tracks con mismo ID; renderer conserva un mesh mientras lista cuenta dos. Ahora rechaza duplicados/ID inválido antes de mutar el estado | [world.js](../../apps/web/src/world.js); pruebas Node y viewer antes/después |
| F04 | Media de procedencia · corregida | Método observation() podía exportar tracks leídos de Core real como simulated:true. El botón ya estaba deshabilitado, por lo que era un fallo del adaptador, no un envío automático observado. Ahora bloquea exportación fuera de modo local | [world.js](../../apps/web/src/world.js); pruebas Node y viewer antes/después |

No se eliminó ni reparó retroactivamente una base existente con NaN. Las correcciones impiden nuevas escrituras inválidas; si aparecieran datos históricos corruptos necesitan diagnóstico/recuperación explícitos. No se cambió esquema SQL, IDs históricos ni políticas de acceso en esta revisión.

## 4. IA situada: alcance exacto

La API sí reúne contexto **real de su base de datos**: entidad, estado, relaciones, últimas memorias/eventos y capacidades. Después de una llamada de proveedor vuelve a leer el contexto; las trazas referencian eventos/memorias y la ejecución exige permisos del servidor y envelope explícito. Las sondas confirman401 para command anónimo y403 para acción que usa la capacidad de otra entidad. Las pruebas previas/adicionales conservan política de herramienta única, errores sin proveedor y trazas persistentes.

El controlled-fixture elige report_world_state o set_scene según el envelope; no interpreta una pregunta. El adaptador OpenAI recibe contexto y propone una herramienta, pero la elección admisible está predeterminada y el servidor siempre construye answer a partir de state o del resultado de acción. No hay síntesis de una respuesta apoyada en memoria/relaciones, búsqueda multi-entidad o decisión espacial no trivial. No se afirma haber validado OpenAI remoto porque aquí no se usó clave/proveedor real. Las consultas locales de Experience son reglas de texto sobre su simulación, no consultas al Core ni un LLM.

## 5. Sincronía y resiliencia: lo que funciona y lo que no

Probado positivo por estas sondas: UUID/cuerpo idéntico no duplica evento; UUID con cuerpo distinto devuelve409; snapshot incompleto devuelve422 sin evento parcial; mensaje atrasado se conserva sin rebobinar la presencia; SQLite integrity_check=ok; Output y acción de agente rechazan falta de autorización/ámbito de entidad. La entrega previa verifica restart y backup/restore; la regresión de esta rama vuelve a comprobar las rutas afectadas.

La transacción Core incluye ingestión/proyección/regla virtual, pero no resuelve tiempo físico ni silencios. Conservar un snapshot tras reiniciar conserva evidencia, **no confirma que una persona siga presente**. El estado no tiene caducidad visible; falta separar último dato, validez temporal, salud y confianza. Un futuro remoto erróneo puede imponer el orden durante años. La Outbox conserva cuerpos y errores, pero un mensaje venenoso impide que los siguientes reparen estado. No se ampliaron descarte/cuarentena ni relojes por ser decisiones de diseño con posible pérdida de información. En la sonda de cola se verificó además que el segundo cuerpo satisface Observation y Snapshot publicados y el primero es rechazado por Snapshot; el transporte controlado no sustituye esa validación.

Los eventos de zona Edge van dentro de payload.transitions; Core registra observation.received y proyección, no una memoria autobiográfica/semántica por track. El visor tiene40 eventos efímeros locales con otros nombres (`capability.result`, zone.entered/exited), no un espejo de eventos/memorias Core. La lista/cámaras se actualiza desde un estado local único, pero eso no demuestra coherencia entre servicios, como muestra A07.

## 6. Seguridad y exposición

- Rutas de integración/Output/agente tienen Bearer y permiso de servidor, pero no tenant/sitio/conector/entidad por credencial. Rutas Core básicas carecen de autenticación. Un piloto compartido requiere una política global coherente, claves derivadas protegidas y acceso de mínimo privilegio.
- Compose observado limita el puerto a loopback. El Core no está publicado productivamente. Pages sirve estáticos sin token ni backend; opcionalmente se introduce URL/token en memoria. CORS explícito no sustituye autorización; un cliente HTTP directo no está restringido por CORS.
- SQL parametrizado y salida HTML escapada en los caminos revisados. No se detectó SQL construido con payload ni ejecución arbitraria de shell en API; esto es inspección de código, no prueba exhaustiva de ausencia de vulnerabilidades.
- [Escaneo heurístico](evidence/MVP-security.json) de texto versionado actual, patrones de claves privadas/tokens seleccionados:0 coincidencias. No es escaneo de todo el historial ni verificación remota de secretos. Credenciales de pruebas son ficticias. Ejemplo de base local observada con permisos0600; no se presume cifrado, control de todos los backups o permisos de otras máquinas.
- No TLS/proxy/autenticación general productiva ni cuotas/paginación/retención. Los esquemas validan estructura, no aislamiento o autorización de procedencia. Auditoría de errores no abarca automáticamente todos los fallos500/validaciones ni toda escritura Core; el log no es un registro de seguridad completo.

## 7. Preparación para un piloto

Utilizable hoy en laboratorio aislado: persistencia/API local; captura de vídeo/RTSP de prueba con detector/tracker; ingestión con contratos; Outbox cuando el servicio es recuperable y la cola es válida; reglas y Output virtual; trazas/consulta de evidencia; demo web autónoma. Con datos ficticios y alcance conocido, se puede mostrar la cadena completa.

Requiere integración/validación real: modelo Orbbec/SDK/depth, calibración a zonas del sitio, CCTV y credenciales autorizadas, sensor/servicio real con su perfil y estado temporal, pantalla/dispositivo y criterio físico de verificación, LLM remoto si se necesita, precisión/latencia/pérdidas del entorno y dispositivos móviles físicos. No hay12 cámaras ni plug-and-play universal acreditados.

Demostración conceptual o parcial: inferencia espacial multi-entidad, consultas conversacionales de memoria/relaciones, gemelo métrico, sincronización bidireccional continua Core/Experience, entidadización de tiendas/HVAC, Scorpio y PostgreSQL/PostGIS. No se propone implementar esas funcionalidades durante la auditoría.

## Los cinco problemas prioritarios antes de un piloto real

1. **Cerrar y unificar permisos y autoridad del estado.** Autenticación en todas las rutas, ámbitos por sitio/fuente/conector, claves derivadas protegidas y capacidades resueltas por servidor; demostrar que un observador no puede adulterar el mundo ni actuar sobre otro equipo. A01/A08.
2. **Eliminar colisiones de identidad con migración compatible.** Espacio de IDs inequívoco por sitio/cámara/sesión/track y prueba de separación de relaciones/historial; no cambiar el hash sin migrar datos. A02 y consistencia de contratos.
3. **Definir vigencia temporal y recuperación coherente.** Clock skew/futuros, último dato frente a presencia actual, silencios/heartbeat y mensaje permanentemente rechazado sin bloquear válidos; medir recuperación con estado y auditoría, no solo proceso activo. A03/A04.
4. **Cerrar el contexto computable que alimenta respuestas.** Materializar o consultar explícitamente sensores/reservas y memoria/relaciones con origen/tiempo, distinguir ausencia de estado de ausencia de evidencia y comprobar preguntas distintas con respuestas realmente pertinentes. A05/A06.
5. **Demostrar una instalación completa con representaciones reconciliadas.** Core/Output/Experience deben mostrar el mismo efecto y su procedencia, con actualización de entidades afectadas, configuración de entrega vigente y un adaptador real autorizado/calibrado. Verificación física adecuada y prueba acotada de rendimiento; no sustituirla por fixtures. A07/A09/A10.

## Correcciones y comandos reproducibles

```bash
.venv/bin/python scripts/audit-mvp.py .runtime/mvp-audit-core.json
.runtime/edge-venv/bin/python scripts/audit-edge.py
node apps/web/scripts/audit-state.mjs .runtime/mvp-audit-viewer.json
# En apps/web:
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npx playwright test --config audit.config.js
# Regresión después de los parches, desde raíz:
PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests -v
npm --prefix apps/web test
npm --prefix apps/web run build
# En apps/web:
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:browser
```

Rendimiento de la regresión local: [16.54 FPS a390×844 en Chromium/SwiftShader](evidence/MVP-performance.json), render por software en servidor, no teléfono físico. Build JS ~2.02 MB /517.5 KB gzip. El umbral de humo de8 FPS del test no es objetivo de fluidez ni SLA de piloto.

Resultados locales:33 tests Core (29 previos +4 nuevos),6 Node (4 previos +2 nuevos), compilación y3 pruebas de navegador aprobadas. Sonda de navegador adicional completada y **detectó** desincronización; 18 sondas Core posteriores incluyen fallos abiertos deliberadamente reportados, no18 garantías aprobadas. El primer intento de sondeo NaN dejó en evidencia un reset de conexión tras500; se repitió con conexiones HTTP separadas para conservar el informe completo, sin cambiar el Core antes de registrar el fallo. Una invocación inicial de los scripts auxiliares usó un directorio incorrecto; se corrigió la ruta de ejecución. No se ocultaron esos fallos cambiando expectativas de producto.

## Publicación y verificación final

- Correcciones y auditoría: [51d9ab670ef1d0fd2c7ceaf55602bdce046a9bae](https://github.com/drbrownlabs-afk/Entity/commit/51d9ab670ef1d0fd2c7ceaf55602bdce046a9bae). Sonda de cola con cuerpos completos y evidencia: [9f35abb711413f656afff798cd854ab520858845](https://github.com/drbrownlabs-afk/Entity/commit/9f35abb711413f656afff798cd854ab520858845). [Diff sobre la entrega base](https://github.com/drbrownlabs-afk/Entity/compare/701da12...9f35abb).
- [CI final42377822190](https://github.com/drbrownlabs-afk/Entity/actions/runs/42377822190): Success, 2m38s, cuatro jobs. api-tests35s, edge-tests1m29s, experience-tests1m07s, delivery1m03s; sin anotaciones observadas. [Resumen preservado](evidence/MVP-ci-final.json).
- Regresión remota aprobada:33 Core,7 Edge,6 Node,3 navegador, Docker/persistencia y demos anteriores, más reconstrucción de paquetes e instalación desde extracción limpia. Artefactos edge-report3.57KB, experience-evidence827KB y entity-delivery1.12MB disponibles en esa ejecución.
- Las sondas adversas adicionales se ejecutaron como experimentos separados con evidencia versionada; su finalización no convierte discrepancias en criterios aprobados. El CI verde confirma regresiones/correcciones, **no** resuelve A01–A10 ni certifica un piloto.
- Fuente9f35abb descargada nuevamente desde GitHub a repositorio independiente: árbol5360c093db36429ae85fc711d608038be80ef580 y ancestro701da12 confirmados. Cierre documental posterior no cambia ese código probado.
- Rama `codex/mvp-independent-audit` publicada, sin merge a main. Consulta REST para gestionar PR devuelve Forbidden desde api.github.com; Git y páginas públicas de Actions funcionan. No se creó un PR nuevo ni se piden operaciones Git manuales al operador.
- Los parches del visor están en la rama auditada; **no se desplegaron a Pages** desde esta rama. La web pública sigue en la versión anterior documentada1f1a3b3, sin simular que un commit publicado equivale a un servicio desplegado. No se publicó Core ni se modificaron equipos físicos.

Fase08 se mantiene **EN VALIDACIÓN**, con revisión humana pendiente. Esta auditoría no autoriza nuevas funcionalidades ni declara preparación para producción.
