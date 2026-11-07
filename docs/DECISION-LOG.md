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
