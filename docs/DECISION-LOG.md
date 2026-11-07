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
