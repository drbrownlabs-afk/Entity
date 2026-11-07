# Fase 04 — ENTITY Output virtual
Estado: EN VALIDACIÓN. Fase 04 autorizada tras revisión de Fase 03 por operador/main 5ce2519, integrado sin conflictos. Fase 05 NO INICIADA.

## Qué funciona
Circuito completo: Observation v1 de presencia → estado Camera/PersonTrack de Fase 03 → regla persistente → capacidad declarada de Fase 01 → ejecutor virtual → lectura de comprobación → estado, evento y auditoría.

Se reutilizan FastAPI/Starlette para HTTP/HTML, el navegador para mostrar contenido, SQLite para estado virtual y asyncio.wait_for para timeout. README de FastAPI y Home Assistant consultados antes de implementar. Home Assistant y protocolos físicos no se desplegaron: no aportan una ventaja al laboratorio sin dispositivos. El código original se limita al enlace de reglas/capacidades, validación, idempotencia y adaptador virtual; no se creó renderer, motor audiovisual, framework de agentes ni protocolo de dispositivos.

Migración aditiva 004: virtual_outputs, output_rules y output_runs; conserva todas las tablas y datos previos. /ready informa esquema 4. Se hizo backup SQLite consistente en el volumen antes de actualizar Docker: /data/entity-before-phase04.sqlite3. No hay nuevas dependencias Python.

## API y control manual
Todos los cambios de Output requieren permiso server-side `output:write` mediante Bearer de Fase 02. No se admiten permisos/actor elegidos por el cuerpo del comando. Contratos en packages/contracts/output/v1.

1. Crear entidad tipo Display por API Core.
2. Declarar su capacidad con operation=`display.set_scene`, required_permission=`output:write`; se usa el UUID persistente de esa declaración. No se invoca un descriptor arbitrario enviado por el cliente.
3. `PUT /v1/output/displays/{id}` configura manual y behavior. Es un simulador explícito: normal, fail, timeout, mismatch. Cambiar configuración se audita.
4. `PUT /v1/output/rules/{rule}` vincula Camera y capability_id, escenas active_scene (welcome) e idle_scene (idle), enabled. La presencia es tracks no vacíos, no una inferencia de identidad. Se pueden deshabilitar reglas.
5. `POST /v1/output/commands` recibe request_id, capability_id, scene para control manual autorizado. `manual:true` suprime reglas automáticas y permite elegir escena manual. `manual:false` devuelve control a futuras observaciones; no reproduce retrospectivamente una observación antigua.
6. `GET /v1/output/displays/{id}` sirve una pantalla HTML de solo lectura con escena y modo, texto escapado y refresco estándar de navegador. No incluye tokens. La demo guarda una copia local para verla después de detener su servidor.

Las observaciones antiguas o duplicadas no vuelven a actuar. La regla genera request_id determinista por observación/regla. Mismo comando/actor/ID conserva resultado; contenido distinto con mismo ID produce 409. No se reintenta una orden fallida cambiando su significado bajo el mismo ID; una orden nueva necesita ID nuevo.

Se registran `output.result` y auditoría: verified, failed, timed_out, verification_failed o suppressed. El estado display.scene refleja lectura real del simulador, nunca el valor solicitado sin verificar. Timeout es espera real acotada/cancelada por asyncio (20 ms para laboratorio, retardo simulado 100 ms), no prueba de tiempo de respuesta de hardware. Un mismatch deja constancia de la escena observada diferente, sin inventar éxito. El resultado terminal, evento, estado y auditoría se persisten transaccionalmente.

## Demostración reproducible

Desde raíz, con Core/Edge instalados según sus guías:

```sh
bash scripts/setup-cloud.sh
bash scripts/setup-edge.sh
bash scripts/demo-output.sh
```

La demo usa el mismo adaptador Edge y Outbox de Fase 03, no un simulador nuevo; arranca Core local con credenciales efímeras y las destruye al terminar. Crea cámara/pantalla/capacidad/regla, entrega presencia y ausencia por HTTP real, comprueba lectura de escena, controla manualmente, inyecta fallos y reinicia Core para comprobar idempotencia. Detiene solo su proceso. Mantiene datos/reportes locales en .runtime/output-demo: core.sqlite3, outbox.sqlite3, screen.html, report.json, server.log. No borra datos al repetir, usa IDs nuevos por ejecución.

Resultados ejecutados: presence_to_welcome passed; absence_to_idle passed; manual_override passed; restart_idempotency passed; fail→failed, timeout→timed_out, mismatch→verification_failed. Siete eventos output.result por ejecución. Es salida VIRTUAL explícita, sin efecto físico, alimentación eléctrica, audio real, TV/proyector ni enchufe conectado.

## Pruebas y regresiones
- 23/23 tests Core (última suite 3.817 s), 0 omitidos: las 20 regresiones anteriores más 3 tests Output (con varios escenarios).
- 4/4 tests Edge (0.105 s), sin cambios de comportamiento de percepción.
- Demo Output HTTP real ejecutada dos veces, todas las comprobaciones aprobadas.
- Verificados permisos 403, comandos conflictivos 409, capacidad declarada, repetición durable, supresión manual, salida HTML escapada, rechazo de actuación por observaciones tardías.
- Build Docker con CA, start-local, /health y smoke-docker: aprobados con esquema 4 y volumen existente. compileall, pip check y diff --check correctos.
- CI ahora ejecuta la demo Output además de Core, Edge, vídeo y Docker. Pruebas locales no se presentan como ejecución remota: ver informe específico de Actions y conclusión observada.

## Límites
Modelo SQLite local; transacción incluye ejecución virtual breve. Para ejecutores físicos lentos se necesitará worker/outbox y verificación específica, no mantener una transacción mientras se controla un dispositivo remoto. La regla actual solo evalúa presencia/no presencia; no es motor de reglas general, ni Fase 05. Rutas Core anteriores y la lectura HTML siguen sin autenticación, para loopback/local de confianza, no exposición pública. Permisos globales heredados, no multiusuario endurecido. Validación física diferida según PLANS.md.

Próxima acción: revisión humana de Fase 04. No iniciar Fase 05 sin autorización.


## Publicación y CI observado
Implementación: https://github.com/drbrownlabs-afk/Entity/commit/520475fbfee95abc5440bea2a2edc627ffe8f573, rama codex/phase-04-output. CI remoto nuevo ejecutado por push y verificado Success: https://github.com/drbrownlabs-afk/Entity/actions/runs/42325368629 (51 s, ambos jobs). Se corrige adicionalmente upload-artifact a v6 tras warning real del primer run. Detalles del diagnóstico de API, PR #1 y conclusión final en GITHUB-ACTIONS-RECOVERY.md y bitácora. No se ha fusionado PR #1 ni se duplica su trabajo.
