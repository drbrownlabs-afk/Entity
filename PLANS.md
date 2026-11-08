# ENTITY OS — Plan maestro por fases
Actualizado: 2026-11-06 (revisión de estrategia de reutilización). Plan vigente de referencia. No marcar fases completadas sin pruebas y aprobación.

## Estado y control
Estados: NO INICIADA, EN CURSO, BLOQUEADA, EN VALIDACIÓN, APROBADA.
Una fase puede tener subentregas; nunca avanzar automáticamente a la siguiente fase sin revisión del operador. El estado se registra en docs/PHASE-BOARD.md. El trabajo en paralelo solo si no rompe contratos.

## Fase 00 — Auditoría y base reproducible
Objetivo: inspeccionar código, dependencias, pruebas y arranque existentes; resolver defectos de la base mínima y establecer comandos verificables.
Entregables: inventario técnico, script de arranque, smoke tests, reporte de brechas, CI mínimo.
Demostración: iniciar API, consultar health, ejecutar tests y reiniciar sin error; documentar qué persiste y qué no.
Salida: comandos reproducibles, evidencia de pruebas y lista priorizada de problemas. No afirmar que la API actual ya está validada.

## Fase 01 — ENTITY Core
Objetivo: modelo persistente con entidades, estado, relaciones tipadas, eventos, memoria/historial y capacidades declaradas.
Entregables: esquemas versionados, API, migraciones, PostgreSQL/PostGIS según necesidad y presupuesto, pruebas de persistencia; Scorpio NGSI-LD como adaptador externo, nunca reemplazo de Core.
Demostración: crear entidades y relaciones, cambiar estados, recuperar eventos tras reiniciar.
Salida: pruebas de integración de persistencia y contratos, errores claros y trazabilidad.

## Fase 02 — Contratos y conectores
Objetivo: desacoplar proveedores y crear observaciones y capacidades uniformes.
Entregables: Connector Manifest, Observation v1, Capability v1, registry, adaptador simulado, MQTT o REST real, autorización básica, auditoría, estado de salud.
Demostración: intercambiar dos fuentes sin cambiar endpoints del Core y ejecutar una acción simulada autorizada.
Salida: tests de contratos, deduplicación, permisos denegados y fallo de conector.

## Fase 03 — ENTITY Edge y percepción (primero simulada)
Objetivo: integrar percepción espacial mediante componentes existentes, sin desarrollar detectores, trackers, motores de captura ni simuladores desde cero cuando haya soluciones reutilizables.
Entregables: Edge mínimo como orquestador/adaptador; evaluación práctica de herramientas existentes (p. ej. YOLO/RT-DETR, ByteTrack/BoT-SORT, MediaPipe, OpenCV, Frigate cuando corresponda); fuente de observaciones sintéticas deterministas y fuente de vídeo grabado; zonas, tracking temporal por cámara, procedencia, buffer/reintentos y contratos idénticos a fuentes físicas.
Demostración: reproducir un escenario de entradas/salidas y pérdidas de seguimiento; procesar un vídeo de prueba con detector/tracker preentrenado; entregar observaciones a la Fase 02 y actualizar el Core. Probar desconexión/reconexión de la fuente simulada.
Salida: pruebas automáticas y evidencia reproducible SIN hardware físico. Integración Orbbec/SDK y validación de cámara real quedan como subentrega diferida y no bloqueante cuando exista acceso al dispositivo. No asumir identidad entre cámaras ni reconocimiento personal.
Criterio: el detector, tracker, fuente y hardware se sustituyen por adaptadores sin modificar el Core. No inventar algoritmos de percepción propios.

## Fase 04 — ENTITY Output y laboratorio virtual primero
Objetivo: cerrar el circuito observación → estado → regla/decisión → capacidad → resultado verificado sin exigir actuadores físicos para aprobar el prototipo.
Entregables: adaptadores para pantallas, contenido y dispositivos basados preferentemente en APIs, SDKs, herramientas y protocolos existentes; ejecutores simulados con confirmación, fallo y timeout; salida audiovisual virtual o en pantalla local; configuración posterior de TV/proyectores HDMI y smart plugs cuando estén accesibles.
Demostración: una presencia simulada activa una escena o cambia contenido en una pantalla virtual; la acción, resultado y error quedan registrados. Opcionalmente mostrar en pantalla local si está disponible.
Salida: pruebas E2E simuladas, fallos y control manual. La validación eléctrica/física queda diferida y no bloquea la fase. No confundir comando enviado con efecto físico confirmado.

## Fase 05 — IA situada mediante herramientas existentes
Objetivo: permitir consultas y acciones fundamentadas en el modelo del mundo, sin crear un modelo fundacional, framework de agentes ni protocolo de herramientas propio desde cero.
Entregables: integración de un LLM disponible mediante SDK/API y herramientas API/MCP existentes; consultas de entidades/estado/eventos/memoria; permisos y ejecución de capacidades verificadas; trazas, política y pruebas con proveedor real o sustituto controlado.
Demostración: responder «¿qué ocurre en recepción?» usando datos del Core y ordenar un cambio de contenido simulado autorizado, con resultado verificable.
Salida: pruebas de permisos, respuestas sin evidencia, timeout y auditoría. LLM y framework reemplazables; no introducir multiagentes sofisticados en MVP.

## Fase 06 — Integración de instalaciones existentes
Objetivo: conectar sistemas CCTV/sensores/negocio de terceros sin cambiar Core, reutilizando servidores, gateways, bibliotecas y protocolos existentes.
Entregables: evaluación e integración de RTSP/ONVIF, NVR/VMS según fabricante, Frigate u otra solución madura cuando aporte valor, REST de reservas, MQTT y sensores simulados; roadmap Modbus/BACnet/OPC UA/Zigbee/Matter mediante integraciones existentes, no implementaciones propias de protocolo.
Demostración: sustituir una fuente virtual por un vídeo RTSP de prueba o una fuente IP accesible, conservando contratos, estados y consultas; añadir una fuente no visual simulada o real.
Salida: matriz de compatibilidad comprobada, configuración y limitaciones. La conexión a CCTV ajeno y hardware específico depende de permisos/acceso y no bloquea las pruebas del prototipo.

## Fase 07 — ENTITY Experience (línea paralela)
Objetivo: demo navegable de un ala de centro comercial con 6–8 tiendas, pasillo, accesos, HVAC y visitantes anónimos; mundo 3D, CCTV virtual, entidades y acciones sincronizados.
Entregables: seleccionar primero motores, escenas, assets, simuladores y viewers ya disponibles (p. ej. PlayCanvas/three.js y assets existentes). Construir solo la lógica de sincronización indispensable: una fuente de verdad para movimientos, vistas CCTV, gemelo 3D, observaciones y eventos. Reutilizar el simulador determinista de fases anteriores en lugar de construir otro.
Demostración: un evento cambia coherentemente la escena, vistas CCTV, entidades y acciones; demo web reproducible sin cámaras ni hardware.
Salida: pruebas de sincronía, rendimiento móvil y demo publicable. No crear motor 3D, renderer, detector o simulador general desde cero; solo componentes diferenciadores de ENTITY.

## Fase 08 — Integración, pruebas y entrega
Objetivo: MVP demostrable, transportable y auditable, usando automatización y herramientas de prueba existentes.
Entregables: runbook no técnico, CI y tests E2E/regresión con frameworks existentes, pruebas de desconexión, rendimiento, checklist de demo y vídeo opcional.
Demostración: desde arranque limpio hasta observación simulada o de vídeo, contexto, memoria, consulta y actuación simulada verificable. Hardware real es validación complementaria posterior, no prerrequisito de aprobación.
Salida: aceptación humana explícita, fallos documentados y backlog financiable. Diferenciar claramente pruebas simuladas, vídeo real y dispositivos físicos.

## Principio obligatorio: reutilizar antes de construir
- Antes de cada fase, inventariar soluciones, SDKs, bibliotecas, repositorios, motores, modelos preentrenados y assets existentes; hacer una prueba mínima de integración y elegir la opción más simple que funcione.
- Priorizar configuración, composición, wrappers/adaptadores delgados y reutilización sobre reimplementación. Escribir código propio solo para el Core diferenciador, contratos, entidadización, coordinación, lógica específica de producto y brechas demostradas; documentar por qué una solución existente no basta.
- No desarrollar desde cero modelos de visión, tracking, LLMs, renderers, motores de simulación, protocolos de hardware o frameworks genéricos. Mantener interfaces de sustitución y evitar dependencias de proveedores dentro del Core.
- Para prototipos no comerciales, no bloquear la exploración por análisis exhaustivos de licencias; registrar nombre, versión, origen y condiciones conocidas de cada dependencia. No asumir que todo recurso puede redistribuirse ni que el prototipo puede comercializarse sin revisión posterior.
- Probar primero con simuladores, mocks, grabaciones y dispositivos virtuales; el hardware no disponible no debe bloquear fases. No presentar resultados simulados como validación física.
- Conservar el alcance y las entregas de las fases 00–02; aplicar estas reglas también a futuras ampliaciones y correcciones sin rehacer lo ya implementado.

## Reglas de trabajo
- Una tarea de Codex debe indicar fase, objetivo, alcance, restricciones, criterios de aceptación, pruebas y evidencia.
- Codex debe inspeccionar el repositorio antes de implementar; puede proponer cambios de secuencia con justificación, no alterar objetivos silenciosamente.
- Mantener docs/PROJECT-STATUS.md, docs/AGENT-WORKLOG.md y docs/PHASE-BOARD.md; decisiones nuevas en docs/DECISION-LOG.md.
- Una fase 'APROBADA' requiere demostración funcional y aprobación humana; pruebas no ejecutadas => EN VALIDACIÓN o BLOQUEADA.
- Priorizar pequeño ciclo end-to-end verificable sobre arquitectura ornamental.


## Fase 09 — ENTITY Spatial Intelligence / Synthetic Office (autorización especial 2026-11-07)
Nueva tarea integral de simulación de centro de trabajo, continuación de ENTITY Experience. Plan funcional, subfases 09.1–09.9, gates, evidencia y protocolo de continuidad: [docs/phases/PHASE-09.md](docs/phases/PHASE-09.md). **Excepción explícita a la regla general de aprobación por fase:** el operador autorizó completar consecutivamente todas las subfases 09.1–09.9 con autorrevisión, corrección y avance automático sin pausas humanas intermedias. Cada gate puede quedar VERIFICADO AUTOMÁTICAMENTE; solo la Fase 09 integral espera revisión humana al final. No altera las autorizaciones históricas de 00–08 ni supone que 07/08 están fusionadas. Evidencia en docs/PHASE-09-PROGRESS.md.


## Fase 10 — ENTITY Camera Gateway, registro espacial y continuidad multicámara (PLANIFICADA; NO INICIADA)

**Dependencia:** terminar los gates 09.1–09.9 y validar integralmente la Fase 09. No ampliar ni interrumpir el trabajo actual de Codex. Fase 09 entrega el SSOG/gemelo digital, interfaz gráfica compartida, CCTV virtual, simulación, Core y servicios operativos funcionales. Fase 10 reutiliza todo ello, sin duplicar mundos, renderers, APIs, trackers locales ni estados.

**Objetivo verificable prioritario:** una persona detectada en CAM-01, luego CAM-02 y después CAM-05 mantiene una identidad **global de seguimiento** y una trayectoria temporal/espacial coherente en ENTITY, incluso al perder cobertura temporalmente, **solo cuando lo sostengan conjuntamente la evidencia visual y el modelo del mundo**. Debe rechazar coincidencias visuales físicamente imposibles y mantener hipótesis inciertas sin inventar identidad civil.

### 10.1 Camera Gateway — descubrimiento, enrolamiento y operación
- Crear módulo autónomo de conexión de fuentes, agnóstico de marca y sin SDK específico en Core. Reutilizar Edge Fase 03, contratos Fase 02 y adaptadores Fase 06.
- Entradas: descubrimiento LAN ONVIF cuando esté disponible; RTSP directo; NVR/DVR/VMS mediante streams, SDK o API; APIs de fabricantes mediante plugins; USB/UVC; archivos/streams de prueba; móvil/WebRTC opcional. ONVIF no garantiza acceso a todos los NVR/cámaras; requerir credenciales y permisos. Fuentes analógicas necesitan digitalizador/DVR compatible.
- Wizard: descubrir o añadir manualmente → credenciales seguras → prueba de stream y metadatos → enrolar Camera/Stream → salud, latencia, timestamp, reconexión, backoff, outbox e idempotencia → política de permisos/retención. No prometer universalidad sin compatibilidad probada.
- Separar gateway de captura/transporte del pipeline de percepción y del Core. Distribución edge/cloud configurable; datos estructurados preferentes cuando el video crudo no sea necesario. Soportar desconexión y reemplazo de cámara sin borrar observaciones históricas.

### 10.2 Registro cámara–gemelo y sincronización
- Definir marco métrico compartido, intrínsecos/distorsión, T_world_camera, orientación, FOV, cobertura, calidad/error e incertidumbre, versiones y detección de cámara desplazada.
- Reutilizar SSOG original y geometría/poses disponibles; AprilTag/ChArUco/PnP, COLMAP/SfM y correspondencias, ajuste manual verificable; RGB-D/ICP opcional, NO requisito. Sin profundidad, un píxel define un rayo: usar plano de suelo/otras restricciones geométricas con incertidumbre.
- Calibración temporal independiente: timestamps de captura, offset, jitter, latencia, NTP/PTP cuando aplique; preservar orden y procedencia.
- Wizard de calibración con frustum sobre el gemelo y verificación independiente. No inventar escala ni coordenadas a partir de una imagen renderizada.

### 10.3 Detección, tracking local y ReID/MC-MOT
- Reutilizar OpenCV/Norfair y evaluar detectores, trackers y ReID existentes; no entrenar ni reimplementar algoritmos genéricos sin justificación.
- Track local por cámara/sesión separado de identidad global de seguimiento y de identidad civil. Embeddings de apariencia, ropa/silueta, timestamps y calidad; asociación multicámara con cámaras solapadas o disjuntas.
- Gestionar oclusiones, ropa similar, cruces, trayectorias simultáneas, fragmentación, entradas/salidas y cámaras offline.

### 10.4 Inferencia contextual fundada en el modelo del mundo
- Evaluar candidatos ReID con tiempo de transición, distancia, velocidad físicamente posible, dirección, puertas/pasillos/escaleras, topología navegable, cobertura y estado de accesos; consultar memoria de tracks, eventos y estados.
- Rechazar hipótesis físicamente imposibles incluso con apariencia similar; si la geometría/tiempo es incierta, no afirmar asociación. Reservas, declaraciones o respuestas de app NO son evidencia de presencia física.
- Mantener hipótesis versionadas, alternativas, evidencia y procedencia; distinción observada/inferida/confirmada/desconocida. Permitir corrección/reasociación sin borrar observaciones originales.

### 10.5 Proyección al Core y experiencia 3D
- Un solo modelo del mundo: Camera, Stream, Observation, TrackLocal, TrackGlobal, AssociationHypothesis, Calibration, Zone, Route, Event y relaciones/estado/memoria; contratos versionados y permisos por sitio/rol.
- Representar sobre el gemelo digital cámaras, frustums, zonas, observaciones, tramos observados y trayectorias inferidas diferenciados. Visor, CCTV, historial y app consultan el mismo Core.
- Mantener captura y ReID independientes del renderer; el demo debe seguir funcionando con video grabado/sintético y backend sin PlayCanvas.

### 10.6 Gates de aceptación y evidencia
1. Gateway descubre/enrola una fuente de red compatible y una fuente manual/archivo; valida reconexión, cambio de fuente, salud, timestamps, credenciales y fallos sin modificar Core.
2. Dos o más cámaras registradas sobre un mismo gemelo con frustums y errores medidos; una cámara movida pierde calibración válida hasta relocalizarse.
3. Caso principal CAM-01 → CAM-02 → CAM-05 con mismo TrackGlobal y trayectoria temporal/espacial, evidencia rastreable y visualización sincronizada.
4. Prueba adversa: dos personas visualmente parecidas y transición físicamente imposible; rechazar fusión errónea. Pruebas de oclusión, desconexión, reloj desfasado y observaciones tardías.
5. Recuperación tras reinicio conserva eventos, observaciones, asociaciones y versiones; permisos impiden exposición de streams/embeddings a usuarios no autorizados.
6. Validación reproducible con fuentes sintéticas/grabadas y, por separado, cámara IP real cuando exista acceso autorizado. Orbbec es hardware de laboratorio opcional, nunca requisito de producto ni instalación del cliente.
7. Evidencias: logs, capturas del SSOG original, métricas de asociación (ID switches, falsas asociaciones, continuidad, latencia), tests E2E, matriz de protocolos probados y limitaciones. No afirmar universalidad ni exactitud sin medir.

**Fuera de Fase 10:** OpenClaw, orquestación multiagente, campos latentes/geodésicos avanzados, efecto mariposa, 4DGS live, biometría como requisito, recrear el gemelo digital o agregar funciones comerciales no relacionadas. IA situada existente puede consultar evidencia del Core sin introducir nuevo framework de agentes.

**Referencias:** docs/POST-PHASE-09-SPATIAL-INFERENCE-REGISTRATION.md; docs/phases/PHASE-03.md; docs/phases/PHASE-06.md; docs/phases/PHASE-09.md; docs/PHASE-09-PROGRESS.md. Esta sección es planificación, NO acredita implementación ni pruebas.


**Especificación ejecutable vinculante de Fase 10:** [docs/phases/PHASE-10.md](docs/phases/PHASE-10.md). Sus subfases 10.1–10.9, gates, bucle implementar→probar→corregir→registrar→continuar y escenario E2E prevalecen sobre el resumen temático anterior. No iniciar hasta validar Fase 09.


## Fase 11 — IA situada sobre mundo operativo (PLANIFICADA; NO INICIADA)
Tras validar la Fase 10, probar inferencia real y conversación sobre observaciones, ReID visual+contextual, trayectorias y memoria de ENTITY Core. Las fases 05/09.7 son preparación técnica, no validación de esta capacidad sobre mundo espacial completo. Evaluar **Sign in with ChatGPT + Codex app-server OAuth** como vía principal de autenticación respaldada por suscripción; API convencional/local como alternativas, sin asumir permisos ni cuotas ilimitadas. No requiere OpenClaw ni multiagentes. Especificación ejecutable, gates 11.1–11.8 y pruebas: [docs/phases/PHASE-11.md](docs/phases/PHASE-11.md). No comenzar hasta cerrar 09 y 10.
