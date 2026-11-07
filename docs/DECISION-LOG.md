# ENTITY OS — Registro de decisiones

## 2026-11-06
- Dos líneas paralelas: producto real ENTITY Core/Edge y ENTITY Experience (mockup web funcional para VCs).
- Demo de VC cambia de coworking a ala de centro comercial, para mostrar mayor complejidad comercial sin exigir despliegue físico.
- CCTV virtual y gemelo 3D consumen un único mundo simulado; los eventos actualizan entidades y permiten consultas y acciones.
- Privacidad según contexto y permisos: visitantes anónimos en espacios públicos, identidades vinculadas en instalaciones privadas cuando exista fundamento y autorización.
- ENTITY Edge es componente desplegable local y desacoplado del Core; Orbbec es hardware inicial intercambiable, no dependencia.
- Integraciones prioritarias: Orbbec, RTSP/ONVIF, MQTT, REST/webhooks, puente Home Assistant; futuros NVR/VMS, BACnet, Modbus, OPC UA, Zigbee, Matter.
- Percepción real inicial: detectar y seguir personas, zonas configurables, observaciones normalizadas. No confundir RTSP con analítica ni seguimiento monocámara con identificación multicámara.
- Laboratorio: Orbbec + Smart TV y tres proyectores existentes; smart plugs y cargas son compra propuesta; permitir acciones físicas verificables.
- Core 24/7 preferiblemente VPS económico; video local en Edge; GitHub para fuente de verdad del proyecto, no datos operativos.
- Criterio de prototipo: ver, contextualizar, registrar, consultar, actuar y verificar con hardware/sistemas reales.
- La documentación debe persistir en el repositorio y actualizarse con nuevas decisiones; distinguir decisiones, implementación y pruebas.


## 2026-11-06 — Entrega GitHub totalmente a cargo de Codex
Decisión: el operador no realiza operaciones de Git/PR. Codex debe completar los commits, push/publicación y creación de PR cuando proceda, además de pruebas, depuración y actualización de bitácora. No debe exigir que el operador publique ni fusione manualmente. Si falta autorización de merge, pedir únicamente aprobación o permisos y reportar el bloqueo. La aceptación de fase permanece humana; no avanzar automáticamente.


## 2026-11-06 Ecuador / 2026-11-07 UTC — Core local de Fase 01
- Mantener SQLite en el incremento actual: carga local pequeña, sin consultas geoespaciales ni necesidad distribuida demostrada. PostgreSQL/PostGIS queda como arquitectura objetivo, sujeto a necesidad y presupuesto según PLANS.md. No se afirma soporte PostgreSQL.
- Migraciones SQL versionadas y transaccionales hacia adelante; bloqueo previo a lectura de versión, adopción de base Fase 00 y rechazo de versiones futuras. Restauración de backup compatible para volver atrás, sin downgrade automático.
- Contratos de registros Core v1 con schema_version 1.0 y snapshot OpenAPI versionado; historial, notas y declaraciones de capacidad persistentes. No confundir estos contratos de Core con Observation/Capability interoperables de Fase 02.
- Capacidades solo declarativas con permiso requerido; sin ejecución/autorización de acciones. Procedencia de entrada declarada, no autenticada. Scorpio permanece externo sin conexión en esta entrega. Ver master spec y docs/phases/PHASE-01.md.


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
