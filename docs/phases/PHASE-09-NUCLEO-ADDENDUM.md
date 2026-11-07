# Addendum arquitectónico Fase 09 — Núcleo (normalizador de capacidades)

**Carácter:** decisión arquitectónica complementaria, no una fase nueva. Se aplica a las subfases 09.1–09.9 en curso, sin detenerlas ni reiniciarlas. Núcleo es un componente con nombre propio dentro del ecosistema ENTITY; **no confundir Núcleo con ENTITY Core**, ni recuperar sin revisión el antiguo proyecto Núcleo completo.

## Responsabilidades
- **Núcleo:** frontera de interoperabilidad; registra adaptadores, descubre capacidades declaradas, valida contratos, transforma invocaciones, resultados y observaciones de protocolos externos a primitivas normalizadas; controla errores, timeouts y disponibilidad. Un recurso puede ofrecer varias capacidades; dos recursos pueden implementar una misma capacidad con distintas restricciones.
- **ENTITY Core:** identidad, entidades, estados, relaciones, eventos, memoria, modelo computable, políticas y vínculos semánticos. La entidad Camera no es el adaptador ONVIF; su identidad persiste al cambiar dispositivo/proveedor. Los eventos incluyen fuente, procedencia y tiempo.
- **Conectores/adaptadores:** implementan contratos de Núcleo para simulación o proveedores reales; el Core y aplicaciones no contienen lógica específica de fabricante.
- **Aplicaciones/IA situada:** consultan el Core y solicitan acciones autorizadas mediante capacidades declaradas, con auditoría de intención, autorización, ejecución y resultado.

## Contrato mínimo de capacidad
Cada capacidad expone: ID canónico y versión, categoría, operaciones, esquema tipado de entrada/salida, unidades y semántica, modalidad lectura/acción, restricciones, permisos, estado/disponibilidad, procedencia, errores y timeout. Identificadores conceptuales de ejemplo: `resource.getObject`, `device.getStatus`, `camera.getStream`, `camera.getObservations`, `access.checkAuthorization`, `access.requestEntry`, `booking.getAvailability`, `booking.create`, `sensor.read`. Son nombres propuestos, NO estándares universales ni APIs ya implementadas. `getObject` obtiene una descripción normalizada del recurso y sus capacidades, no implica que todos los sistemas externos soporten introspección.

No igualar `observe` de cámaras heterogéneas sin especificar modalidad: vídeo bruto, detecciones y eventos analíticos son salidas diferentes. Una cámara que solo transmite vídeo no produce por sí misma identidad ni seguimiento. Separar capacidad de observación de capacidad de acción, y exigir permiso explícito para actuar sobre accesos, HVAC, etc.

## Adaptadores de referencia para 09
Implementar primero contratos mínimos reutilizables para: (1) CCTV/stream/observación, (2) control de acceso/check-in, (3) reservas/calendarios, (4) sensores/ambiente, (5) notificaciones y operaciones de staff cuando aplique. Cada uno con adaptador **simulado** que alimenta el Core real y un contrato de adaptador **real** probado con fixtures/servicio de prueba. Cuando corresponda, investigar ONVIF/RTSP para vídeo, OSDP a nivel lector-controlador (no asumir API de plataforma), BACnet/Modbus/MQTT para edificio y REST/webhooks/iCalendar para software; no afirmar compatibilidad sin pruebas. No es requisito construir conectores para todos los fabricantes en Fase 09.

## Migración sin romper el trabajo en curso
1. Inspeccionar el estado real del código y las implementaciones existentes; reutilizar contratos/conectores compatibles.
2. Introducir la frontera Núcleo como interfaz/capa modular, sin reescribir ENTITY Core ni romper los escenarios ya especificados.
3. Encapsular los adaptadores simulados actuales tras Núcleo, conservar IDs estables y eventos persistentes.
4. Demostrar en tests que dos adaptadores distintos de la misma capacidad producen resultados normalizados compatibles y que intercambiarlos NO cambia la lógica de reservas, seguridad, memoria ni las consultas de ENTITY.
5. Probar desconexión, timeouts, capacidades ausentes, incompatibilidad de versión, permisos denegados, idempotencia/reintentos y procedencia.
6. Registrar qué se implementó, qué es solo contrato y qué queda pendiente de integración física; no declarar interoperabilidad universal sin evidencia.

## Regla de ejecución
Este addendum **no pausa Codex**, no crea una fase 09.10 y no exige aprobación intermedia. Incorporar los cambios en las subfases correspondientes, especialmente 09.2–09.5 y 09.9. Mantener las puertas de pruebas, checkpoints y autorización autónoma 09.1–09.9 establecidas en AGENTS.md. Si una integración real necesita credenciales o hardware no disponibles, probar el contrato con fixtures y registrar el bloqueo sin paralizar el resto.
