# Fase 02 — Contratos y conectores
Estado: EN VALIDACIÓN. Continuación autorizada por operador; Fase 03 NO INICIADA.

## Implementación
- Migración aditiva 003: registry, observaciones, invocaciones idempotentes y auditoría persistentes. Conserva migraciones y datos previos; /ready espera esquema 3.
- Contratos versionados 1.0 en packages/contracts/integrations/v1: Manifest, Observation, Capability, Invocation. El contrato Core anterior permanece intacto; regresión compara sus rutas y esquemas con la API actual permitiendo adiciones.
- PUT /v1/integrations/connectors/{id}: registro/actualización manual del manifiesto; protocolos REST y simulation, tipos de entrada, operaciones y habilitación. GET .../{id}/health: existencia/habilitación, no sondeo físico.
- POST /v1/integrations/observations: recepción REST real con fuente, sitio, fecha con zona, procedencia, confianza opcional. Registro/evento atómicos. Dos fuentes REST/simulada usan exactamente el mismo endpoint; datos quedan en historial del source_id, que debe existir. No se inventan entidades ni coordenadas ni se cambia estado automáticamente con observaciones tardías.
- UUID de observación repetido con idéntico contenido devuelve duplicate=true y el mismo received_at; contenido distinto devuelve 409. Conserva observed_at del cliente, received_at UTC del servidor; no reordena estado por llegada.
- POST /v1/integrations/invocations: ejecutor simulado simulation.set_state, escritura y lectura de comprobación SQLite, resultado explícitamente simulated=true/status=verified. Identidad viene del servidor, nunca del cuerpo. request_id evita ejecutar de nuevo; actor o contenido diferente produce 409. Estado, evento, resultado y auditoría exitosa se guardan atómicamente.
- Capability es un perfil mínimo v1: input_schema fijo state-key-value-v1, permiso fijo simulate:write, timeout local SQLite 5 s, verificación sqlite-readback, idempotency request-id. No es un ejecutor arbitrario de JSON Schema, HTTP ni dispositivos; capability_id identifica el descriptor enviado, no un catálogo global de capacidades. Declaraciones de Fase 01 siguen independientes.
- GET /v1/integrations/audit: permisos, registro, observaciones y acciones; errores HTTP de dominio quedan auditados sin almacenar credenciales. Los errores 422 de validación automática no se auditan como operaciones ejecutadas.

## Autenticación y puesta en marcha
Todas las rutas nuevas fallan cerradas sin credenciales. ENTITY_CONNECTOR_TOKENS es un JSON de entradas con token, actor y permissions, inyectado privadamente en el proceso. Permisos: registry:write, observe:write, simulate:write, audit:read. No introducir credenciales en Git/chat. Tests usan valores ficticios solo temporales; tokens reales deben suministrarse mediante configuración local segura. Docker requiere inyección explícita de esa variable en un override ignorado; el Compose predeterminado no configura credenciales y deja las integraciones bloqueadas.

Las rutas antiguas Core siguen sin autenticación: esta autorización básica protege integraciones, NO todo el producto. Mantener puertos en loopback y no presentar este prototipo como API pública segura. Permisos son globales para integraciones, no por sitio/entidad. No existen OAuth, TLS propio, rotación automática, RBAC granular ni hardware real.

## Evidencia ejecutada
Desde /workspace/Entity:

```
(cd services/entity-api && ../../.venv/bin/python -m unittest discover -s tests -v)
docker compose -f compose.yaml -f .runtime/cloud-compose.yaml build
sh scripts/start-local.sh
python3 scripts/smoke-docker.py
```

19 pruebas aprobadas, ninguna omitida: regresiones Core, migraciones, concurrencia, rollback; fuentes REST/simulación intercambiadas; duplicado/conflicto; 401/403; 422 fecha sin zona; conector deshabilitado 503 sin cambiar estado; ejecución simulada verificada; auditoría. Una prueba arranca Uvicorn con HTTP real en dos procesos sucesivos: los reintentos de observación/acción tras reiniciar conservan deduplicación y resultado. Tokens y DB son temporales en esa prueba; ningún servicio externo o sensor real se presupone.

Build y arranque Docker ejecutados con migración del volumen existente; smoke de fases anteriores aprobado tras reinicio. CI dispara también para todos los contratos, no solo Core. Se mantiene advertencia TestClient/httpx y caché pip sin escritura. No nuevas dependencias. No se afirma CI GitHub verde sin consultar su resultado.

## Límites y revisión
REST es una entrada real HTTP probada; la acción es exclusivamente simulada. MQTT, descubrimiento automático, percepción, buffers Edge y reconexión a sensores físicos no implementados. Auditoría/observaciones no tienen paginación ni retención. No hay borrado ni downgrade; hacer backup antes de upgrades. Pruebas no equivalen a carga/producción ni verificación física.

Entrega en codex/phase-02-connectors sobre 348e15d, conservando íntegros los commits de fases anteriores. Pendiente revisión humana; no avanzar Fase 03. Estado de publicación/PR/CI en bitácora.
