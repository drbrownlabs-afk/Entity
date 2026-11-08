# FASE 10 — ENTITY Spatial Intelligence: agente ENTITY mediante OpenClaw
Estado: PLANIFICADA / NO INICIADA. Activar solo después de completar y validar integralmente Fase 09. Decisión del operador: 2026-11-08. La antigua Fase 10 de cámaras se conserva en docs/phases/PHASE-11.md; cámaras y ReID NO son requisito de esta fase.

## Decisión y fundamento
ENTITY es software de entidadización y operación de un modelo del mundo computable y persistente. El modelo del mundo es en sí una entidad con identidad y continuidad; el coworking también es una entidad dentro del dominio modelado, NO la raíz ontológica ni el contenedor arquitectónico obligatorio del mundo. Core mantiene entidades, estados, relaciones, eventos, memoria/historial, capacidades, procedencia y autorización. API, SDK, MCP y plugins exponen capacidades para consumidores externos. OpenClaw es un runtime de agente que consume esas capacidades, NO un nuevo Core, un nuevo mundo ni la fuente de verdad. El gemelo SSOG es una representación espacial, no el núcleo.

El primer agente se identifica como `entity` y se presenta como ENTITY. Se reutilizan Gateway, runtime, sesiones, modelos, herramientas, skills, workspace y memoria conversacional oficiales de OpenClaw; no desarrollar framework de agentes ni gateway LLM propio. Un solo agente inicial; el contexto de organización, sede, actor y rol se resuelve por sesión autorizada sin mezclar usuarios o sedes. La identidad ENTITY no se restringe ontológicamente al coworking: este es el escenario inicial de validación.

## Base REAL comprobada en el repositorio, no inventar interfaces
- `services/entity-api/app/office/api.py`: `POST /v1/office/auth/login`; `GET /v1/sites/{site}/active-run`; `GET /v1/sites/{site}/runs/{run}/world`; `POST /v1/sites/{site}/runs/{run}/queries`; `GET /v1/sites/{site}/capabilities`; `POST /v1/sites/{site}/runs/{run}/commands`; `GET /v1/sites/{site}/runs/{run}/events`; `GET /v1/sites/{site}/runs/{run}/stream`.
- `services/entity-api/app/office/service.py`: comando valida operación, parámetros tipados, actor, recurso, versión de capacidad, revisión del mundo, idempotencia y resultado; `services/entity-api/app/office/access.py` aplica proyecciones por rol/recurso.
- `services/entity-api/app/nucleo/capabilities.py`: descriptores y adaptadores. `docs/PHASE-09-PROGRESS.md` y `docs/CHATGPT-CODEX-HANDOFF.md` contienen estado y límites de implementación.
- Synthetic Office original, inventario A/B oficinas privadas; C/D/E y doce puestos D/E según documentación vigente; recepción/kiosco, José operador, Carlos miembro, Daniel visitante, reservas, incidentes, HVAC, eventos y SSOG. Verificar inventario, escenas, permisos y endpoints en código ACTUAL antes de probar; no dar por validada calibración/recorridos pendientes.
- Fase 05/09.7 ya incluye un adaptador de modelo y consultas controladas. Reutilizar contratos y pruebas; no confundir simulador de transporte con inferencia LLM real.

## Integración prevista — mínima, verificable y reemplazable
1. Inventariar OpenClaw oficial en versión fijada y sus mecanismos reales de herramientas/MCP/plugins, autenticación, aislamiento de sesiones, política de herramientas y conexión con frontend. No asumir soporte de configuración o nombres sin comprobar versión y documentación. Preferir MCP si la versión lo soporta de forma estable; plugin nativo solo si aporta una necesidad comprobada. No confundir SKILL.md (procedimiento) con herramienta ejecutable o permiso.
2. Adaptador delgado ENTITY API → herramientas tipadas para `get_world`, `query`, `list_capabilities`, `get_events` y `execute_capability`. Estos son nombres PROPUESTOS, no endpoints MCP existentes. No copiar ontología, estado ni lógica de negocio al adaptador. Descubrimiento de capacidades dinámico y filtrado por actor, con esquemas/versión y parámetros válidos. No exponer todas las rutas internas indiscriminadamente.
3. Cada llamada usa identidad de usuario autenticada y contexto autorizado de organización/sede/ejecución; no token administrador compartido. Revalidar permisos en Core en cada lectura y mutación, incluyendo streams y evidencia. Separar secretos y sesiones, evitar exponer tokens a navegador/LLM/logs; defensa ante prompt injection. Deshabilitar shell, filesystem, browser, gateway-admin, cron, nodes, mensajería externa y herramientas ajenas por defecto. Permisos efectivos son server-side, no instrucciones del agente.
4. Workspace propio del agente, aislado de AGENTS.md de desarrollo: IDENTITY.md, SOUL.md, AGENTS.md operativo, USER.md contextual, TOOLS.md si ayuda, skills/SKILL.md y memoria OpenClaw para continuidad conversacional. Esta memoria NO sustituye el historial del Core. Perfil empresarial/tono parametrizable por organización sin modificar permisos ni hechos. Bootstrap solo para inicialización, no conocimiento del mundo hardcoded.
5. Primero herramientas de lectura, después mutaciones autorizadas (reserva, notificación, mantenimiento, controles disponibles). Confirmación humana para acciones sensibles según política; `expected_revision`, UUID idempotente, versionado de capacidad, errores 403/409/422, comprobación posterior y trazabilidad. No declarar éxito hasta respuesta válida del Core. No añadir operaciones no implementadas.
6. Modelos intercambiables por configuración oficial OpenClaw. Comparar proveedor económico y avanzado cuando haya credenciales legítimas; registrar coste/latencia/calidad. Fallback por fallo NO equivale a router automático por complejidad; no construir routing propio salvo necesidad medida. Nunca asumir que una suscripción ChatGPT equivale a crédito API o permite reutilizar credenciales fuera del flujo oficial.

## Subfases y gates — ejecutar secuencialmente SOLO cuando Fase 09 esté cerrada
### 10.1 Auditoría y contratos
Verificar código, endpoints, auth, contratos, permisos, tests, CI, documentación oficial OpenClaw y versión real. **Gate:** matriz implementado/propuesto/no probado, casos de prueba, riesgo de aislamiento y selección MCP/plugin fundamentada.

### 10.2 Runtime OpenClaw oficial
Configurar un solo agente `entity`, workspace y proveedor permitido, sin secretos en Git. **Gate:** conversación real, reinicio y continuidad de identidad/sesión; sin segundo Core.

### 10.3 Adaptador de herramientas ENTITY
Exponer herramientas de lectura sobre API existente, con descriptores reales y errores tipados. **Gate:** leer estado, consultas, capacidades y eventos de Synthetic Office sin respuestas hardcoded; datos con procedencia/tiempo.

### 10.4 Autorización multiusuario y multisitio
José y Carlos consultan el mismo mundo, con vistas y permisos diferentes; pruebas adversas de recursos privados, sede cruzada, prompt injection y credenciales. **Gate:** denegación efectiva en backend; ninguna herramienta elude filtros.

### 10.5 Operación de capacidades
Activar únicamente comandos disponibles y autorizados, comenzando por reserva; consulta previa, revisión de conflicto, ejecución, readback, auditoría e idempotencia. **Gate:** cambio de mundo reflejado en otros clientes; 403/409/422 y repetición sin efectos duplicados.

### 10.6 Continuidad, memoria y eventos
Separar memoria conversacional OpenClaw de eventos/memoria ENTITY; consulta histórica y recuperación tras reinicio. Evaluar eventos/SSE para conocimiento actualizado, sin afirmar proactividad continua por tener un chat. **Gate:** el agente detecta estado cambiado, explica fuente y no inventa presencia o coordenadas.

### 10.7 Modelos, coste y robustez
Comparar dos proveedores cuando estén disponibles, errores, timeouts, cuotas y fallback real; políticas de uso de herramientas. **Gate:** misma identidad, permisos y capacidades con modelos intercambiables; métricas y limitaciones documentadas. Si no hay proveedor, NO EJECUTADO, no PASS ficticio.

### 10.8 Integración UI y E2E
Conectar interfaz desktop/móvil de ENTITY mediante backend seguro, no Gateway público sin controles. Probar recepción, consulta, reserva y escenario de José/Carlos, con SSOG y mundo único. **Gate:** pruebas de regresión 00–09, tests de seguridad, reinicio, escritorio/móvil y evidencia reproducible. Fase global EN VALIDACIÓN hasta revisión humana.

## Límites y secuencia
- Fase 09 sigue EN CURSO; no iniciar implementación de 10 ni interrumpir trabajo actual.
- Cámaras reales, Camera Gateway, calibración geométrica, ReID, TrackGlobal y continuidad multicámara pasan a Fase 11; hardware no disponible no bloquea el agente.
- No implementar multiagentes, agentes subordinados, inferencia geodésica/latente avanzada, 4DGS ni acciones físicas no verificadas.
- Cada gate: implementar → probar → corregir → repetir → registrar evidencia, comandos, SHA y límites → commit; no declarar aprobado por escribir este plan.
- Al iniciar, crear docs/PHASE-10-PROGRESS.md, actualizar tablero, decisión y handoff; respetar trabajo concurrente.

## Referencias
- docs/phases/PHASE-09.md; docs/PHASE-09-PROGRESS.md; docs/CHATGPT-CODEX-HANDOFF.md; docs/ENTITY-MASTER-SPEC.md; docs/DECISION-LOG.md.
- docs oficiales: https://docs.openclaw.ai/concepts/agent ; https://docs.openclaw.ai/concepts/agent-workspace ; https://docs.openclaw.ai/tools/skills ; https://docs.openclaw.ai/gateway/configuration ; https://docs.openclaw.ai/gateway/security ; https://docs.openclaw.ai/plugins .
- Contrastar la documentación contra la versión instalada antes de implementar; esta especificación registra decisiones, NO pruebas de runtime OpenClaw.
