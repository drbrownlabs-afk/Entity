# ENTITY Edge — Especificación de integración y percepción v0.1
Estado: arquitectura aprobada conceptualmente; implementación pendiente de verificación.

## Flujo
Dispositivo o sistema externo -> driver/adaptador -> captura o eventos -> percepción (si aplica) -> observación normalizada -> mapeo espacial y asociación de entidad -> ENTITY Core -> estado/relaciones/eventos/memoria -> agente/capacidad -> adaptador de salida -> verificación.

## Interfaces estables
Connector manifest: connector_id, version, protocols, discovery_mode, config_schema, credential_refs, input_event_types, capability_schemas, health_check.
Lifecycle: discover, enroll, configure, bind_to_site, bind_to_zone, start, pause, reconnect, stop, health.
Observation v1: observation_id UUID, schema_version, site_id, source_id, observed_at UTC, received_at UTC, type, payload, provenance (connector_id, model_version, simulated), confidence opcional, local_track_id opcional, zone_id opcional, spatial {coordinate_frame, position, uncertainty} opcional. Detección no equivale automáticamente a identidad. Si no hay calibración, reportar coordenadas de imagen y no inventar posición mundial.
Capability v1: capability_id, target_entity_id, operation, input_schema, required_permission, timeout, verification_method, idempotency_policy. Invocation: request_id, actor, capability_id, target_entity_id, parameters. Outcome: accepted/executed/failed/verified. Nunca asumir éxito antes de confirmación; registrar auditoría.
Persistencia/fiabilidad: outbox local durable en Edge, retries con backoff, deduplicación por observation_id, tiempos y fuente, tolerancia a mensajes fuera de orden, versionado de esquemas, secretos fuera de repositorio. Edge no expone RTSP ni controles locales a Internet pública.

## Cámaras y percepción
- Orbbec SDK: USB RGB/depth, calibración y descubrimiento cuando el modelo concreto lo soporte. Validar SDK/versiones/dispositivo antes de afirmar plug-and-play.
- ONVIF: descubrimiento y configuración en equipos compatibles; Profiles S/T para streaming según dispositivo, Profile M para metadatos analíticos si existe.
- RTSP: recepción de video de cámara/NVR; no implica detección ni identidad.
- NVR/VMS: usar primero eventos/metadatos existentes; después RTSP + percepción local; por último SDK de fabricante.
- Frigate: adaptador para eventos y detecciones por MQTT como opción de percepción existente.
- Perception worker sustituible: detección de personas y tracking por cámara, modelo intercambiable (p.ej. YOLO/ByteTrack sujeto a licencias/compatibilidad). Cross-camera matching requiere lógica separada, calibración y validación; no prometer identidad perfecta.
- Calibración: transformaciones cámara -> zonas/plano/espacio 3D con procedencia e incertidumbre. Cámaras y campos de visión son entidades.

## Sensores y negocio
P0: MQTT, REST/webhooks, simulador, puente Home Assistant. Sensores: temperatura, humedad, CO2, presencia, contacto de puerta, energía. P1: Modbus TCP/RTU, BACnet/IP, OPC UA, Zigbee gateway, Matter controller, VMS vendor SDK. Reservas y accesos: REST/OAuth/webhooks o polling controlado. ENTITY Core desconoce el proveedor.

## Actuadores
Smart plugs de control local, lámparas, ventiladores pequeños, TV y 3 proyectores disponibles (por HDMI desde computadora). Home Assistant/MQTT/API local para dispositivos compatibles. Pantallas con display.show/hide/switch_scene/set_content/get_state. PJLink/RS-232 solo si soportado. Acciones sensibles requieren autorización, límites y control manual. No controlar cargas inseguras.

## Secuencia de validación
1. Edge descubre Orbbec, captura y detecta presencia.
2. Configurar dos zonas; vincular cámara y crear eventos reales persistentes.
3. Ingestar sensor MQTT o evento de reservas REST.
4. Consultar al agente el estado y origen de observaciones.
5. Ordenar acción autorizada sobre pantalla/proyector o enchufe; comprobar resultado.
6. Desconectar y reconectar fuente/red, comprobar buffer y ausencia de duplicados.
7. Cambiar adaptador Orbbec por cámara RTSP o simulada sin cambiar contratos del Core.
8. Registrar fallos y limitaciones observadas.

## Demo VC
Centro comercial pequeño (ala), simulación web 3D + 4 CCTV virtuales desde mismo reloj/estado; observaciones sintéticas compatibles con contrato, entidades y memoria navegables, preguntas y acciones que alteran estado. Etiquetar simulación; no depender del Core desplegado para presentar.


## Fase 03 — 2026-11-06 Ecuador / 2026-11-07 UTC
Fase 02 aceptada explícitamente por operador; merge main 1e6b29f/cabd969 conservando fases anteriores. Selección práctica OpenCV HOG/SVM preentrenado y captura + Norfair (asociación/Kalman); alternativas revisadas documentalmente YOLO y Frigate, no comparadas en precisión. Adaptadores delgados Edge, fixture determinista, zonas normalizadas y Outbox SQLite hacia Observation v1. Proyección Core genérica edge.presence crea PersonTrack/Zone y estado por cámara sin vendor API. Sesiones no son identidad; snapshots tardíos no rebobinan estado. Hardware Orbbec diferido no bloqueante; no prueba física. Evidencia, licencias y restricciones: docs/phases/PHASE-03.md. Fase 03 EN VALIDACIÓN, Fase 04 no iniciada.
