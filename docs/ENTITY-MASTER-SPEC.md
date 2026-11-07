# ENTITY OS — Documento maestro de producto y arquitectura
Actualizado: 2026-11-06. Fuente de verdad para las decisiones de ENTITY OS; mantenerlo actualizado cuando cambien alcance, hardware, arquitectura o estrategia.

## Visión
ENTITY OS es una plataforma de inteligencia espacial e IA situada. Convierte espacios físicos y sistemas fragmentados en un modelo del mundo computable y persistente sobre el que agentes y aplicaciones pueden consultar, comprender y ejecutar capacidades autorizadas. No es un chatbot con cámaras ni solamente un gemelo digital.

## Núcleo propio e inseparable
Entidades, Estado, Relaciones explícitas tipadas, Eventos, Memoria persistente/historial, Capacidades y autorización. API estable y procedencia de la información. Ontología extensible y adaptadores de interoperabilidad. Scorpio NGSI-LD es broker externo, NO el núcleo propietario ni sustituto de memoria.

## Arquitectura
- ENTITY Core: API, modelo del mundo, políticas, autorización, historial, herramientas para agentes, persistencia PostgreSQL/PostGIS (SQLite provisional existente), adaptador NGSI-LD a Scorpio.
- ENTITY Edge: software instalable en Windows/Linux por sede; descubrimiento y registro de fuentes, adaptadores de protocolo, captura, percepción, calibración espacial, observaciones, buffer local, ejecución de comandos, salud y reconexión.
- ENTITY Experience: demo web autónoma para VCs; ala de centro comercial con un solo estado de simulación para mundo 3D, CCTV virtual, entidades, agentes y acciones; contratos idénticos a los reales.
- ENTITY Output: capacidades para smart plugs, iluminación, ventiladores, Smart TV, proyectores y contenido audiovisual. Proyectores por salidas HDMI de computadora; control de hardware solo si soporta protocolo.
- Cloud VPS económico: Core 24/7 para prototipo; Edge procesa video localmente y transmite principalmente observaciones/eventos, no video continuo. GitHub guarda código/configuración, no sustituye backup de bases de datos.

## Objetivos de uso
1. Laboratorio transportable: llegar con computadora y Orbbec, conectar, descubrir cámaras compatibles, iniciar percepción, configurar zonas y reglas, observar, registrar, consultar y actuar. Las Orbbec son dispositivos de demostración intercambiables, NO dependencia estructural.
2. Piloto futuro con Impacto u otra instalación: identificar CCTV/NVR/VMS existente, conectar cámaras y analíticas cuando se autorice, fusionar reservas, acceso, sensores, BMS y otros sistemas. No asumir que se conoce el hardware de Impacto. Posible expansión futura a 12 cámaras; no son hardware disponible actualmente.
3. Demo de inversión: ala de centro comercial ficticio, no coworking. Cámaras virtuales y mundo 3D sincronizados desde la misma simulación; visitantes anónimos; IA consulta estado y ejecuta una acción que altera el estado. Demo web y video grabado de funcionamiento. No afirmar que es un despliegue real.
4. Coworking queda como posible piloto técnico, no escenario prioritario de pitch. En espacios privados pueden existir identidades vinculadas bajo reglas y permisos; en centros comerciales priorizar presencia anónima. Privacidad por diseño no equivale a prohibición universal de identidad; aplicar minimización, finalidad, control de acceso y retención.

## Hardware disponible vs futuro
Disponible según usuario: cámaras Orbbec (modelos exactos pendientes), Smart TV, tres proyectores; computadora temporal y acceso TeamViewer a computadora Windows de amigo en EE.UU. GPU remota aprox 4 GB, RAM 8-16 GB no confirmada. Alienware RTX 2060 es computadora DISTINTA del usuario y está averiada. Smart plugs, luces/ventiladores de laboratorio y 12 cámaras IP son adquisiciones propuestas, NO disponibles confirmadas.

## Integración sin dependencia de proveedores
Ninguna marca, SDK, protocolo, modelo de percepción o agente debe entrar como dependencia de ENTITY Core. Adaptadores intercambiables; descubrimiento best effort, onboarding y calibración inicial. Fuentes reales y simuladas producen los mismos contratos. Proveedores pueden exigir credenciales, licencias, acceso a red y adaptadores específicos: no prometer compatibilidad universal sin pruebas.

## Prototipo real: criterio de aceptación
Orbbec descubierta y capturando; percepción de presencia/personas; zonas configurables; observaciones con procedencia; entidades, estado, relaciones, eventos y memoria persistente; segunda fuente real vía REST o MQTT; consulta de agente mediante herramientas reales; acción autorizada sobre enchufe o pantalla y confirmación del resultado; desconexión/reconexión sin duplicados. Adaptador RTSP/ONVIF intercambiable, aunque integración de una instalación ajena se valida según acceso.

## Límites de fase
No implementar ahora inferencia geométrica profunda, relaciones latentes/geodésicas, efecto mariposa, multiagentes sofisticados, 4DGS en vivo o reconstrucción masiva. Son investigación futura para financiación. Sí mantener interfaces extensibles. No presentar scaffolding como sistema instalado o probado.

## Regla de continuidad
Antes de cada desarrollo o cambio de ENTITY OS, revisar este documento, docs/EDGE-INTEGRATION-SPEC.md, docs/implementation-plan.md y AGENTS.md. Registrar decisiones nuevas y cambios de alcance en docs/DECISION-LOG.md, y cambios técnicos en Git con commits verificables. No borrar decisiones previas: anotar sustituciones y motivos.


## Incremento Fase 01 — 2026-11-06 Ecuador / 2026-11-07 UTC
Core local 0.2.0 añade migraciones SQLite atómicas, contratos v1/registro 1.0, memorias explícitas con fuente, eventos con procedencia y capacidades declaradas persistentes. SQLite se mantiene para el demostrador local: no hay aún necesidad espacial o distribuida que justifique PostgreSQL/PostGIS en esta entrega; no cambia la arquitectura objetivo. Una declaración registra operación, metadatos y permiso requerido; no ejecuta ni autoriza acciones. Fuente declarada no equivale a identidad autenticada. Conectores e invocación quedan en Fase 02. Scorpio sigue externo y sin proyección implementada. Evidencia y límites: docs/phases/PHASE-01.md. Estado EN VALIDACIÓN, revisión humana pendiente.


## Fase 02 — 2026-11-06 Ecuador / 2026-11-07 UTC
Perfil local v1 de Manifest/Observation/Capability/Invocation, registry manual persistente y entrada REST para fuentes reales/simuladas. Simulador set_state verifica por lectura SQLite; no hardware. Autorización Bearer por permisos server-side solo para integraciones; Core antiguo sigue local sin autenticación. Migración aditiva 003, deduplicación e idempotencia durables; no MQTT ni Edge. Contratos y límites en docs/phases/PHASE-02.md. EN VALIDACIÓN; Fase 03 no iniciada.


## Fase 03 — 2026-11-06 Ecuador / 2026-11-07 UTC
Fase 02 aceptada explícitamente por operador; merge main 1e6b29f/cabd969 conservando fases anteriores. Selección práctica OpenCV HOG/SVM preentrenado y captura + Norfair (asociación/Kalman); alternativas revisadas documentalmente YOLO y Frigate, no comparadas en precisión. Adaptadores delgados Edge, fixture determinista, zonas normalizadas y Outbox SQLite hacia Observation v1. Proyección Core genérica edge.presence crea PersonTrack/Zone y estado por cámara sin vendor API. Sesiones no son identidad; snapshots tardíos no rebobinan estado. Hardware Orbbec diferido no bloqueante; no prueba física. Evidencia, licencias y restricciones: docs/phases/PHASE-03.md. Fase 03 EN VALIDACIÓN, Fase 04 no iniciada.


## Fase 04 — 2026-11-06 Ecuador / 2026-11-07 UTC
Autorizada tras revisión de Fase 03; main 5ce2519 integrado. Output virtual con pantalla HTML/browser, FastAPI, SQLite y asyncio, sin renderer/protocolo físico nuevos. Regla presencia→capacidad declarada display.set_scene→ejecución y readback; modos manual/automático, idempotencia, auditoría y errores simulados. Migración aditiva 004. Hardware eléctrico/TV/proyector diferido; EN VALIDACIÓN, Fase 05 no iniciada. CI histórico comprobado Success por web: bloqueo api.github.com en CONNECT no demuestra token inválido. Ver docs/phases/PHASE-04.md y docs/audits/GITHUB-ACTIONS-RECOVERY.md.


## Fase 05 — 2026-11-06 Ecuador / 2026-11-07 UTC
IA situada como adaptador del SDK oficial OpenAI 2.8.1/function tools + sustituto controlado reproducible. Sin nuevo framework/MCP/modelo. Scope de entidad explícito y envelope de acción exacto, permisos server-side y capacidades declaradas; respuesta factual derivada de evidencia Core, no prosa libre del modelo. Trazas/idempotencia persistentes en migración 005, salida virtual por Output. Proveedor real no validado por ausencia de clave; SDK real validado con transporte controlado. Decisión compatible con sustituto permitido por PLANS.md; límites y evidencia en docs/phases/PHASE-05.md. EN VALIDACIÓN, no Fase 06.


## Fase 06 — 2026-11-06 Ecuador / 2026-11-07 UTC
Autorizada integración de instalaciones mediante adaptadores existentes. MediaMTX/FFmpeg/OpenCV para RTSP TCP local real y Eclipse Mosquitto/Paho para MQTT; HTTPX para reservas fixture. Perfiles Edge normalizan a Observation v1 con deduplicación/cola existente, sin cambiar código/schema/endpoints Core. Sensores/reservas persisten como eventos con procedencia, no estado materializado. ONVIF, Frigate y NVR/VMS físicos solo evaluación documental/matriz; no acceso ajeno ni hardware supuesto. Docker fijado por digest, licencias y límites en docs/phases/PHASE-06.md. EN VALIDACIÓN; Fase 07 no iniciada.


## Fase 07 — 2026-11-07 UTC
Experience autorizada: PlayCanvas 2.23.3 + Vite estático, siete tiendas, cuatro CCTV y vista principal desde el mismo estado/revisión. Se extrae sin alterar el fixture Edge a JSON compartido; desfases de la misma trayectoria para visitantes anónimos, sin otro motor de simulación. Geometrías primitivas de PlayCanvas; tres acciones locales con readback, consultas deterministas y export Observation v1. Adaptador opcional Core con API real y modos separados, token solo memoria, errores sin fallback; CORS explícito por variable de entorno, desactivado por defecto. Publicación Pages por gh-pages y Actions, con prueba de SHA y navegación real sobre URL. Hardware, calibración y despliegue Core público no acreditados. EN VALIDACIÓN; no Fase 08. Evidencia y límites en docs/phases/PHASE-07.md.


## Fase 08 — 2026-11-07 UTC
Continuación autorizada por operador. Entrega compone frameworks existentes (unittest/HTTPX/Playwright/SQLite/GitHub Actions) con el fixture del visor y Outbox vigente: escenario HTTP aislado, memoria/contexto, acción virtual, permisos, interrupción, reinicio y backup/restore. Sin nuevos servicios genéricos ni cambio de contratos/schema Core. Paquetes de fuente comprometida y web estática con manifiesto/checksums, instalados desde extracción limpia en CI. No incluye dependencias offline ni DB/secretos. Runbook del operador y backlog por prioridad/dependencias/esfuerzo; EN VALIDACIÓN hasta aceptación humana, hardware/LLM remoto/producción siguen sin acreditar. Ver docs/phases/PHASE-08.md.


## Auditoría integral MVP — 2026-11-07 UTC
Auditoría independiente de recorridos felices sobre701da12. Probes nuevos HTTP real, Outbox y Chromium detectan autenticación Core incompleta, falta de ámbitos por fuente, colisión de IDs cámara/track, congelación temporal por timestamp futuro, cola bloqueada por422 permanente, sensores solo como eventos, respuesta de agente fija y escena Core/Experience divergente. Informe docs/audits/MVP-INDEPENDENT-2026-11-07.md. Se corrigen únicamente números JSON no finitos, Bearer no ASCII y validación/procedencia de exportación del visor; sin nueva arquitectura, migración ni funcionalidades. La auditoría sustituye interpretaciones de «plataforma plenamente integrada» basadas solo en demos verdes. Fases no autoaprobadas, Fase08 EN VALIDACIÓN; piloto/producción sin validar.


## Checkpoint Fase09: implementación parcial (2026-11-07)
Office usa Core persistente y Núcleo modular para normalización de capacidades/adaptadores, según el addendum vigente. Se conservan entidades/eventos/observaciones y separación entre identidad confirmada y track anónimo; nuevas APIs requieren ámbito de sede/rol. Tablas Office son aditivas y versionadas. Simulación y REST de servicio de prueba se rotulan como tales. SSOG y voxels originales de Synthetic Office se presentan con visor oficial; no se inventan salas ni ubicaciones físicas de equipos. Ver progreso de gates en docs/PHASE-09-PROGRESS.md; este checkpoint parcial no declara validada la fase ni un piloto real.
