# ENTITY OS — Plan maestro por fases
Actualizado: 2026-11-06. Plan vigente de referencia. No marcar fases completadas sin pruebas y aprobación.

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

## Fase 03 — ENTITY Edge y percepción
Objetivo: software local que detecta dispositivos y observa el espacio con Orbbec.
Entregables: servicio Edge, Orbbec SDK adapter según modelo real, captura, detector de personas, tracking por cámara, mapeo de zonas, buffer/reintentos.
Demostración: conectar Orbbec, observar persona, cambiar zona, registrar eventos y reconectar.
Salida: prueba con cámara física y evidencia; no asumir cross-camera identity.

## Fase 04 — Laboratorio físico y ENTITY Output
Objetivo: intervenir físicamente sobre un espacio con dispositivos disponibles y nuevos actuadores compatibles.
Entregables: adaptador display HDMI, Smart TV, tres proyectores, al menos un smart plug/sensor si se adquiere, estado y verificación de comandos.
Demostración: presencia activa una escena; agente o regla cambia proyección; acción y resultado registrados.
Salida: pruebas de fallo y control manual; distinguir comando de confirmación física.

## Fase 05 — IA situada
Objetivo: consultas y acciones sobre modelo del mundo, no respuestas inventadas.
Entregables: herramientas API/MCP, consultas de entidades y eventos, capacidades autorizadas, trazas y política.
Demostración: '¿qué ocurre en recepción?' y orden de cambio de contenido/actuador con verificación.
Salida: tests de permisos, alucinación de estado, timeout y audit log.

## Fase 06 — Instalaciones existentes
Objetivo: conectar sistemas CCTV/sensores/negocio de terceros sin cambiar Core.
Entregables: RTSP/ONVIF, integración NVR/VMS según fabricante, Frigate opcional, REST reservas, MQTT sensores; roadmap Modbus/BACnet/OPC UA/Zigbee/Matter.
Demostración: sustituir Orbbec por cámara IP autorizada y mantener estado y consultas; incorporar una fuente no visual.
Salida: matriz de compatibilidad real, documentación de configuración y limitaciones; no prometer acceso a Impacto sin conocer su infraestructura.

## Fase 07 — ENTITY Experience (línea paralela)
Objetivo: demo comercial navegable de un ala de centro comercial con 6-8 tiendas, pasillo, accesos, HVAC y visitantes anónimos.
Entregables: un único simulador determinista; gemelo 3D; cuatro CCTV virtuales del mismo mundo; entidades/eventos/acciones; UI profesional; demo web publicable.
Demostración: evento de simulación cambia a la vez CCTV, 3D, entidades y acciones.
Salida: pruebas de sincronía, rendimiento móvil y demo reproducible. No requiere cámaras físicas.

## Fase 08 — Integración, pruebas y entrega
Objetivo: producto mínimo demostrable, transportable y auditable.
Entregables: runbook no técnico, test E2E, regresión, pruebas de desconexión, reporte de rendimiento, checklist de demo, vídeo opcional.
Demostración: desde arranque limpio hasta observación, contexto, memoria, consulta y actuación real.
Salida: aceptación humana explícita, fallos documentados y siguiente backlog financiable.

## Reglas de trabajo
- Una tarea de Codex debe indicar fase, objetivo, alcance, restricciones, criterios de aceptación, pruebas y evidencia.
- Codex debe inspeccionar el repositorio antes de implementar; puede proponer cambios de secuencia con justificación, no alterar objetivos silenciosamente.
- Mantener docs/PROJECT-STATUS.md, docs/AGENT-WORKLOG.md y docs/PHASE-BOARD.md; decisiones nuevas en docs/DECISION-LOG.md.
- Una fase 'APROBADA' requiere demostración funcional y aprobación humana; pruebas no ejecutadas => EN VALIDACIÓN o BLOQUEADA.
- Priorizar pequeño ciclo end-to-end verificable sobre arquitectura ornamental.
