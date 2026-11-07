# Fase 05 — IA situada con herramientas existentes
Estado: EN VALIDACIÓN. Operador autoriza continuar Fase 05; no se autoaprueban fases previas ni se inicia Fase 06.

## Alcance implementado
Se reutiliza SDK oficial OpenAI Python 2.8.1 (https://github.com/openai/openai-python, README consultado; licencia Apache-2.0 del proyecto). Se usa Chat Completions con function tools, no framework/protocolo de agentes nuevo. FastAPI, Pydantic, HTTPX y las APIs/funciones Core y Output existentes resuelven herramientas y ejecución. No se implementa MCP propio ni multiagentes.

Adaptadores reemplazables con interfaz propose(request,evidence): OpenAIProvider mediante SDK oficial y ControlledProvider como sustituto determinista explícito. No hay clave ENTITY_LLM_API_KEY ni OPENAI_API_KEY en este entorno, ni credenciales de proveedor listas. Por eso se valida con sustituto controlado, permitido por PLANS.md. NO se afirma haber realizado inferencia remota con un LLM real. El SDK real sí fue ejecutado contra HTTPX MockTransport para validar parsing de tool_calls y timeout.

## Herramientas y política
- POST `/v1/agent/requests`: request_id UUID, entity_id explícito, question, action opcional {capability_id,scene}, schema_version 1.0. Contrato en packages/contracts/agent/v1/Ask.json.
- Requiere `agent:read`. Las acciones requieren además `output:write` desde credencial server-side; nunca del prompt/modelo/cuerpo.
- Tool API estándar: report_world_state y set_scene. Una sola propuesta por solicitud. Solo se admite tool/argumentos EXACTAMENTE iguales al ámbito de consulta o al envelope de acción explícito. El modelo no selecciona dispositivos arbitrarios, no amplía permisos ni puede ejecutar código/HTTP libre.
- La capacidad tiene que existir, ser display.set_scene/output:write, estar configurada y pertenecer a entity_id. Se reutiliza el ejecutor virtual/readback/idempotencia de Output.
- El proveedor recibe únicamente contexto de esa entidad: estado, relaciones (máximo 50), últimos 20 eventos y 20 memorias, capacidades; presupuesto de contexto serializado 64k. Se cierra la conexión DB antes de llamar al proveedor, se releen hechos después. No hay transacción SQLite esperando al modelo.
- No se presenta la prosa libre del modelo como estado factual. El servidor devuelve una respuesta determinista con datos Core, referencias a IDs de eventos/memorias, as_of y estado registrado. Con estado vacío declara “No hay estado registrado”; con entidad inexistente devuelve 404. Los datos almacenados son evidencia de lo registrado, no prueba independiente de verdad física.
- Contexto/preguntas se tratan como datos no confiables. Una propuesta distinta del envelope produce provider_or_policy_error y no actúa. Esto limita la superficie de inyección por modelo o memoria; no sustituye el endurecimiento multiusuario futuro.
- SDK timeout 5 s, max_retries=0, max_completion_tokens=300, un tool call y sin llamadas paralelas. Un timeout/error/configuración faltante conserva una traza, no ejecuta y no cambia silenciosamente a otro proveedor.
- Resultados terminales y trazas se guardan en agent_runs (migración aditiva 005) junto con auditoría en la misma transacción que Output. Mismo UUID/cuerpo/actor devuelve el resultado original incluso después de reiniciar; un cambio con mismo UUID devuelve 409. Para consulta fresca o reintentar fallo se usa UUID nuevo.
- GET `/v1/agent/requests/{uuid}` permite consultar la traza al mismo actor autenticado; actor distinto devuelve 403. Incluye proveedor/modelo/política, pregunta, herramienta, evidencia, referencias, resultado de acción y fecha. No contiene claves de API ni respuestas crudas con posibles credenciales del proveedor.

HTTP 200 en una solicitud registrada no implica éxito de inferencia/acción: el cliente debe inspeccionar status y action_result. Status posibles incluyen ok, timeout, provider_unavailable, provider_or_policy_error y estados terminales de Output. Las denegaciones de autenticación/permisos usan 401/403 y auditoría existente.

## Demostración reproducible
Desde raíz, con Core/Edge preparados:

```sh
bash scripts/setup-cloud.sh
bash scripts/setup-edge.sh
bash scripts/demo-agent.sh
```

La demo reutiliza el laboratorio HTTP de Fase 04 y el Edge/Outbox de Fase 03. Proveedor fijado a controlled para evitar tráfico/coste remoto accidental. Entrega una presencia simulada, pregunta «¿Qué ocurre en recepción?» con scope de la cámara, obtiene estado/referencias; ordena escena situada-ai-demo mediante capacidad explícita de pantalla y comprueba verified/readback, traza y repetición. Detiene solo su Core efímero; datos/reportes locales en .runtime/output-demo, incluido agent-report.json.

## Activar proveedor real posteriormente (opcional)
- Configurar privadamente ENTITY_AGENT_PROVIDER=openai, ENTITY_LLM_API_KEY y ENTITY_LLM_MODEL (por defecto gpt-4.1-mini).
- Permitir api.openai.com y aplicar configuración; solicitudes envían contexto de la entidad al proveedor, por lo que se deben utilizar datos autorizados para ello.
- Requisito personal opcional ENTITY_LLM_API_KEY y dominio api.openai.com guardados en borrador cloud, preservando dominios anteriores. ENTITY_AGENT_PROVIDER=controlled sugerido para reproducción. El guardado no aplica/publica runtime; los valores se introducen en ajustes, nunca en chat/Git.
- No se probó inferencia real, coste, autorización del modelo ni calidad lingüística con un servicio externo. El SDK no puede funcionar con su proveedor real sin clave; falla cerrado y con traza.

## Evidencia ejecutada
- Core: 29/29 unittest aprobados, ninguna omitida (última suite 4.801 s): 23 regresiones previas y 6 tests agente, cada uno con múltiples escenarios.
- Consultas con estado vacío/memoria/referencias, entidad inexistente, 403 acción/trace ajenos, scope de capacidad, idempotencia/reinicio, conflicto 409, proveedor malicioso, timeout, clave ausente y Output fallido comprobados.
- SDK oficial con MockTransport: petición tool_choice=required, tool call parseado y ejecutado bajo política, timeout HTTP convertido por SDK a estado timeout; sin solicitudes remotas reales.
- Demo agente HTTP real con proveedor controlado ejecutada dos veces: query passed, action verified, trace passed, idempotency passed. Presencia con procedencia simulated=true en zona left; no hardware.
- Build Docker con CA, start-local, smoke-docker y persistencia aprobados con esquema 5; pip check correcto. Backup previo: /data/entity-before-phase05.sqlite3 en volumen local, fuera de Git. Se conserva trabajo/commits anteriores.
- Tests Edge 4/4 aprobados (.145 s). CI añade demo-agent además de vídeo/Output/tests/Docker; artefacto incluye agent-report.json sin credenciales.

## Límites
No hay resolución libre de nombres de espacios: entity_id es explícito. El sustituto no entiende lenguaje natural general; solo propone la herramienta requerida por el envelope. No se promete conversación autónoma compleja, IA física, MCP instalado, acciones reales o aprendizaje del modelo. Memoria consultada es persistencia Core, no memoria latente del modelo.

Permisos globales/loopback y rutas Core antiguas sin autenticación son límites heredados. Se necesita evaluación adicional de privacidad, revocación granular, escalabilidad, paginación y modelo real antes de despliegue multiusuario. En acción la respuesta refleja el resultado real (incluye failed/timed_out); no una promesa del modelo. Fase 06 no iniciada. Próximo paso revisión humana de Fase 05.


## Entrega y validación remota
Implementación publicada: https://github.com/drbrownlabs-afk/Entity/commit/f77f816c04b312842e54767375028da7b50f35f3, rama codex/phase-05-situated-ai. CI por push verificado mediante página pública GitHub: https://github.com/drbrownlabs-afk/Entity/actions/runs/42326524584 — Success, commit completo coincidente, sin anotaciones. Incluye tests Core/Edge, demo Edge, Output y agente, build Docker y persistencia. Evidencia observada en docs/evidence/phase05-ci.json.

Comparación del volumen con backup previo: 14 entidades, 7 estados, 7 relaciones, 29 eventos, 5 memorias y 5 capacidades originales intactos; tablas vacías de integración/Output conservadas. SQLite integrity_check=ok, foreign_key_check vacío, esquema 5.

POST REST de PR para Fase 05 intentado: Forbidden en api.github.com/repos/drbrownlabs-afk/Entity/pulls, por la limitación de entorno ya diagnosticada. Sin PR nuevo ni merge; publicación Git y observación CI web funcionan. No se pide Git manual al operador. PR #1 existente no se duplica ni se fusiona. Cierre posterior solo documental, sin repetir pruebas ni atribuirlas a cambios de código posteriores.

start_skill y requisito personal opcional del proveedor guardados en borrador del entorno; api.openai.com añadido a destinos, sin claves ni afirmación de aplicación/publicación del snapshot. Próximo paso: revisión humana. Proveedor real queda opcional pendiente de configuración segura y validación específica.
