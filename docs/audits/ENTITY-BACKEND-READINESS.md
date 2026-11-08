# ENTITY Backend — preparación para laboratorio Blender + PlayCanvas

Fecha: 2026-11-08 UTC. Fuente ejecutada: `40850d120a82a431b3e6ccc824e7bc734c379e5f`, rama de origen `codex/phase-09-autonomous-plan`. Auditoría en `codex/backend-readiness-audit`, sin merge ni cambios de main. Informe independiente de las etiquetas PASS previas. No se implementaron funciones ni correcciones.

## Decisión técnica

**Sí se puede comenzar el laboratorio nativo como integración de desarrollo aislada con el Core existente. No está listo para una instalación física ni para conectar directamente el Edge histórico al coworking.** Es viable crear el espacio y consumir las APIs por sede sin esperar otra arquitectura. Antes de conectar un simulador persistente deben resolverse el contrato de poses interactivas, el puente Edge→API por sede y la validación referencial del inventario. No se recomienda desarrollar otra base de negocio en PlayCanvas.

Esta es una recomendación técnica para la decisión del operador, no aprobación de Fase09 ni autorización de fases10/11. La auditoría no construye el laboratorio.

## Base, ramas y conservación

`git ls-remote --heads origin` confirmó main=`5ce25196fe3377fc811b54e22390b8d585248533`, entrega08=`701da1210ab893c20b3fe6b0cbec2ab7605d0842`, auditoría anterior=`943ff31329b6d9a681665d0c0b618923d01b37b4`, fase09=`40850d1`. Las entregas acumuladas no están fusionadas en main. No partir del main antiguo para el laboratorio.

El checkout original contiene cambios sin commit en UI, maniquí, navegación, servicio espacial, API interactiva y DevContainer. Se conservaron intactos en `/workspace/Entity`. **No pertenecen al SHA auditado ni se consideran implementaciones publicadas verificadas.** Se creó un worktree independiente desde HEAD para evitar incluirlos o probar accidentalmente otra versión. No se fusionaron ramas. La decisión actual suspende el desarrollo Gaussian Splatting y sustituye la prioridad previa de personajes/NPCs; se conserva todo su historial.

Se revisaron master spec, tablero, fase09/addendum, progreso, handoff, auditoría anterior, rutas Core/Office, autorizaciones, storage, grafos, simulación, memoria, agentes, contratos, Edge/outbox y suites. PostgreSQL/PostGIS y Scorpio siguen como objetivos/adaptadores pendientes; no son dependencias operativas necesarias para este laboratorio SQLite.

## Pruebas nuevas y regresiones realmente ejecutadas

Todas las bases son temporales. No se arrancó, migró ni reinició un servicio de trabajo para esta auditoría.

| Ejecución | Resultado | Alcance y evidencia |
|---|---|---|
| `PYTHONPATH=services/entity-api /workspace/Entity/.venv/bin/python -m unittest discover -s services/entity-api/tests -v` | **86 PASS, 61.252 s** | [log](evidence/backend-readiness/backend-tests.txt): incluye concurrencia de reservas, deduplicación, permisos, memoria, aislamiento, adaptadores fallidos, rollback de reloj, logout y reinicio de proceso |
| `PYTHONPATH=services/entity-edge /workspace/Entity/.runtime/edge-venv/bin/python -m unittest discover -s services/entity-edge/tests -v` | **7 PASS** | [log](evidence/backend-readiness/edge-tests.txt): detector/tracker y transporte controlado; no cámaras físicas |
| `.venv/bin/python scripts/audit-mvp.py .runtime/backend-audit/legacy-http-probes.json` | 18 sondas HTTP completadas, varias propiedades deseadas FALLAN | Uvicorn real en puerto efímero, base temporal y reinicio real. [Resultados](evidence/backend-readiness/legacy-http-probes.json); finalizar el script no significa 18 PASS |
| `/workspace/Entity/.runtime/edge-venv/bin/python scripts/audit-edge.py` | Bloqueo de cola **reproducido** | [Outbox](evidence/backend-readiness/edge-outbox.json), SQLite real + HTTPX MockTransport422; no fallo físico de red |
| `.venv/bin/python .runtime/backend-audit/scoped-probes.py` | 6 rechazos de seguridad correctos; 1 defecto referencial reproducido | [Sonda conservada](evidence/backend-readiness/scoped-probes.py), [resultados](evidence/backend-readiness/scoped-probes.json). TestClient y SQLite temporal; no prueba de red externa |

Advertencia ejecutada: Starlette avisa de futura sustitución de httpx por httpx2 en TestClient. No causó fallos. Dependencias del entorno se reutilizaron; no es una instalación limpia de paquetes en esta auditoría. No se ejecutaron nuevo render 3D, Docker, Codespaces, RTSP externo, MQTT externo, carga sostenida, hardware ni LLM remoto. No se atribuyen a esta revisión evidencias históricas de esos entornos.

## A01–A10: reproducción y estado actual

| ID | Clasificación | Resultado actual y consecuencia |
|---|---|---|
| A01 | **Parcialmente corregido** | Sin sede y sin `ENTITY_REQUIRE_AUTH=1`, PUT genérico anónimo sigue200 y token de observador acepta sitio/fuente/conector distintos. Con sede Office, middleware bloquea API histórica; nuevas sondas: mundo401, otra sede403, miembro creando entidad403, conector de otra fuente403. No exponer modo legacy vacío como servicio compartido. |
| A02 | **Parcialmente corregido** | Legacy sigue fusionando `a:b/c` y `a/b:c` en un PersonTrack. Office usa UUID sobre lista JSON de partes en storage.identity, sin concatenación ambigua. No hay migración probada que sanee tracks históricos legacy. |
| A03 | **Parcialmente corregido** | Legacy acepta2099, conserva snapshot futuro y presencia tras reinicio. Office tiene adelanto máximo120s, TTL/freshness, asociaciones expiran y reloj persistente pausa al reiniciar. Sus tests actuales pasan; tolerancia120s aún requiere política de sincronización del nuevo simulador. |
| A04 | **Abierto y reproducible** | Outbox reintenta422 permanente y no llega al mensaje válido:2 pendientes. No cuarentena. Transporte apunta fijo a `/v1/integrations/observations`, bloqueado cuando existe sede Office; incompatibilidad de integración adicional. |
| A05 | **Parcialmente corregido** | Legacy sensor19°C persiste solo evento y state vacío. Office.observations sí normaliza medidas, estado zonal y evidencia; suite pasa. No existe puente automático desde todos los perfiles Edge al dominio Office. |
| A06 | **Parcialmente corregido** | Agente legacy sigue respuesta idéntica para preguntas distintas y omite memoria en answer. Office dispone consultas estructuradas sobre grafo/historia y SDK oficial con tool validada y ámbitos. Tests de SDK usan transporte controlado; no acreditan conversación remota ni precisión general. |
| A07 | **Parcialmente corregido** | Office ofrece world/events/SSE y proyección autorizada; suites de clientes/reloj pasan. El frontend antiguo mantiene su modelo local. No se volvió a ejecutar su sonda visual; sincronía del nuevo cliente Blender/PlayCanvas **no verificable** hasta existir ese cliente. |
| A08 | **Parcialmente corregido** | Legacy invoca capability UUID no declarado con200. Office resuelve descriptor por sede/recurso/operación, valida versión/permiso/revisión y no permite metadata sobre estado derivado. Sonda de campos id/kind maliciosos403 sin alterar Carlos. Debe usarse exclusivamente este camino. |
| A09 | **No verificable con la evidencia disponible** para nueva UI | Fallo original del adaptador viejo no se volvió a probar en navegador. No se inspecciona una UI inexistente como corregida. Abandonar el estado de negocio local elimina esa dependencia del nuevo laboratorio, pero no repara el componente conservado. |
| A10 | **Abierto; mitigaciones parciales** | Memoria Office paginada y acotaciones de esquema/contexto existen; siguen sin evidencia de carga/retención/cuotas globales, backup operativo automatizado o consolidación de ramas. No se certifica capacidad multiusuario por tests pequeños. |

Las correcciones F01–F04 anteriores no se deshicieron. F01/F02 reaparecen como422/401 correctos en las sondas HTTP; las correcciones del visor quedan conservadas pero no se vuelven a validar visualmente aquí.

## Hallazgos actuales y matriz de riesgo

| Prioridad | Riesgo/evidencia | Qué bloquea | Corrección mínima propuesta, no implementada |
|---|---|---|---|
| P0 antes de ingestión | Dos entradas semánticas: Edge Outbox usa legacy, middleware lo deniega al existir Office (`main.py:office_legacy_boundary`, `pipeline.py:Outbox.flush`) | Conectar Edge tal cual al laboratorio | Adaptador/configuración explícita de destino por sede/run y autenticación de fuente; conservar Observationv1, no duplicar Core |
| P0 antes de interacción persistente | `spatial-routes` registra recorridos absolutos; no hay endpoint publicado de pose arbitraria/órdenes libres autoritativas, lease de productor o acceso por personaje | Afirmar simulador interactivo persistente y sincronizado | Contrato pequeño para ground truth/inputs separado de observaciones, reloj/revisión y autorización; reutilizar eventos/storage. WIP del checkout no es aceptación |
| P1 antes de importar inventario | `entity.upsert` permite `zone_id='missing-zone'`, devuelve verified y deriva locatedIn a entidad inexistente; FK SQL sigue limpia | Consistencia de escena/objetos y políticas por ubicación | Validar referencias tipadas de attributes y relaciones al crear/editar; preflight no destructivo de datos previos. PR de corrección separado |
| P1 antes de recuperación real | Mensaje422 permanente bloquea toda Outbox | Recuperación de fuentes ante datos inválidos | Cuarentena auditable/reparación y continuación segura; reintentar solo fallos recuperables sin perder cuerpos |
| P1 antes de datos reales | Legacy A01/A02/A03/A08 reproducidos en instalación sin sede | Exponer API histórica | Mantenerla bloqueada por configuración desde primer arranque, resolver/migrar defectos si se reutiliza; no abrirla para que Edge funcione |
| P1 antes de acciones físicas | Readback virtual y efectos externos no equivalen a transacción distribuida | Actuadores reales | Identidad de dispositivo, reconciliación tras timeout/fallo parcial y lectura física del resultado |
| P2 paralelo | Sin carga sostenida, retención y backups operativos demostrados; hashes/sesiones locales, no TLS productivo | Operación de instalación | Medir carga objetivo, restauración aislada, límites/retención, gestión de credenciales y transporte seguro |
| P2 paralelo | No prueba global de todas las combinaciones organización/rol/recurso | Asegurar ausencia de filtraciones | Matriz negativa de consultas, streams, escenarios y mutaciones para organizaciones distintas; mantener controles servidor |

La referencia colgante requiere rol admin en la sonda: no se ha demostrado escalada de un miembro. `foreign_key_check=[]` no garantiza integridad semántica del JSON. Las pruebas de aislamiento demuestran los casos ensayados, no ausencia exhaustiva de vulnerabilidades.

## A/B: qué funciona

Core FastAPI/SQLite utiliza transacciones `BEGIN IMMEDIATE`, claves foráneas SQL y migraciones. Office mantiene IDs por sede, entidades persistentes, relaciones explícitas temporales, eventos append-only, revisiones, comandos idempotentes y snapshots. La historia permite filtrar por entidad/zona/intervalo y reconstruir estado; tests incluyen dos eventos de mismo timestamp. No convierte automáticamente una ubicación vieja en presencia vigente.

Capacidades Office se declaran por recurso, validan entradas y ejecutan mediante Núcleo; fallos/timeout no se presentan como resultados físicos confirmados. Reservas, conflictos, reuniones, recepción, intercom, visitas, mantenimiento y what-if tienen servicios y tests existentes. No necesitan Gaussian Splatting. Autenticación: sesiones opacas, PBKDF2, expiración/logout y rol+recurso/sede en servidor; lecturas filtradas, acciones de miembros limitadas, identidad de cámara anónima salvo evidencia explícita autorizada. No afirmar SSO/MFA ni cifrado de SQLite.

El grafo Office y tablas genéricas comparten la misma SQLite, pero son proyecciones con semántica diferente, no dos interfaces equivalentes intercambiables. Modificar tablas genéricas no actualiza por sí solo el mundo Office. El laboratorio debe usar Office como fachada de dominio y no hacer escrituras directas en tablas.

## C/D: frontend que se puede retirar del nuevo producto

Se pueden dejar de cargar `createViewer`, SSOG, voxels SuperSplat, herramientas de survey/calibración, recorte de techo, assets Rocketbox y replay/negocio local. Conservar código/historia como referencia. Core no importa PlayCanvas/SuperSplat/OpenCV; eliminarlos del cliente nuevo no exige reemplazar Core. Reutilizables: cliente HTTP autenticado, controles de capacidades, consultas, timeline y selección por ID, después de desacoplarlos del viewer y comprobar permisos. No borrar recursos/eventos persistidos ni reinterpretar sus coordenadas antiguas como coordenadas Blender.

## E: interfaces del laboratorio

| Necesidad | Existente | Adaptación pendiente |
|---|---|---|
| Escena, ambientes y objetos independientes | `POST /v1/sites/{site}/runs/{run}/commands`: entity.upsert / relation.add; Site/Building/Floor/Zone/Room/Office/Light/Equipment | No tipo Scene específico ni importador Blender. Usar entidad espacial existente+metadata de asset/version/frame; validar referencias y conversión de ejes/unidades. Alta de sede actual es bootstrap/servicio interno, no API pública de onboarding |
| Personas/dispositivos estables | UUID por sede y local ID; Person/Camera/Sensor/AccessPoint | Mapeo estable exportador→ID y registro manual de cada fuente/binding |
| Puertas, luces y equipos | device.setPower para Light/HVAC/Equipment, access.requestEntry con política | Puerta open/close/cerradura física no equivale a acceso permitido; capability/adaptador específico pendiente |
| Observaciones virtuales/reales | `POST .../observations`, Observationv1 + edge.presence/sensor.measurement | Configurar source/binding/auth; mismo contrato, adaptador independiente de motor3D; no enviar GT como identidad observada |
| Grafo, historia y memoria | world?at/branch, queries, events con filtros y detalle | Esquema público completo/versionado del mundo y política de retención/cursor para carga esperada |
| Acciones PlayCanvas | commands + capabilities + expected_revision/id/version | Cliente autorizado sin reglas de negocio locales; readback e interfaz de confirmación |
| Varios clientes | world polling y SSE autenticado con cursor | Probar reconexión del cliente nativo, descarte de respuestas obsoletas y render coherente; SSE es aviso, no snapshot completo |
| Reinicio | SQLite durable, backups/scripts y tests de restart; reloj pausa sin aplicar tiempo offline | Contrato de reanudación de fuente3D, detección de silencios y restauración operacional |
| Poses/control libre | Rutas QA y reconstrucción temporal existentes | No confundirlas con runtime interactivo publicado; definir fuente, validación, secuencia, frecuencia, persistencia e historial |

## F: orden mínimo de correcciones

1. Mantener bloqueado legacy desde arranque y elegir las APIs Office como contrato de integración.
2. Validar referencias de inventario/relaciones antes de importar la escena nativa; añadir regresión del caso missing-zone.
3. Adaptar transporte Edge al destino por sede/run y reparar cola envenenada sin perder evidencia.
4. Cerrar contrato de poses/órdenes y reloj único, con ground truth separado de observaciones e identidad; no duplicar reservas/memoria en navegador.
5. Demostrar dos clientes HTTP, reinicio, huecos/futuros/duplicados y fallos del adaptador en un ensayo aislado del nuevo cliente antes de afirmar integración completa.

El modelado Blender, exportación GLB y cliente de solo lectura pueden comenzar mientras estas correcciones se ejecutan. La integración interactiva persistente no debe declararse lista antes de los puntos1–4. No hace falta migrar a Unreal, sustituir SQLite por otra DB ni reconstruir reservas para comenzar.

## G: instalación física posterior

Pendientes hardware Orbbec/RTSP autorizado, calibración imagen→zona/espacio y tiempo, precisión del detector/tracker y oclusión, pérdida/reconexión de red real, identificación autorizada no biométrica, credenciales/retención de vídeo, efectos físicos de puertas/luces/HVAC con confirmación, capacidad/carga de sitio y recuperación de backups. MQTT/REST/RTSP tienen código/adaptadores de pruebas; eso no acredita instalaciones reales. ReID y registro multicámara avanzado siguen diferidos a11; OpenClaw a10. Ninguna de estas fases se inició en la auditoría.
