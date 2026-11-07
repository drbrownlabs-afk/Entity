# Fase 01 — ENTITY Core persistente

Estado: EN VALIDACIÓN. Continuación autorizada por el operador tras la entrega publicada de Fase 00; esta autorización no se registra como aprobación automática de ninguna fase. Fase 02 NO INICIADA.

## Qué funciona

La API 0.2.0 conserva entidades, atributos, estados, relaciones tipadas e historial. Añade notas de memoria con procedencia, eventos explícitos y capacidades declaradas por entidad. Las declaraciones no ejecutan acciones. SQLite sigue siendo almacenamiento local: el caso actual no requiere consultas espaciales ni un servicio PostgreSQL adicional. La arquitectura futura PostgreSQL/PostGIS permanece vigente.

Las migraciones SQL 001 y 002 se ejecutan al arrancar, con transacción y bloqueo antes de leer la versión. Reconocen la base anterior sin versión, conservan sus registros y fijan `PRAGMA user_version=2`. Una versión futura se rechaza; una migración fallida revierte todo el lote. No hay downgrade automático: hacer backup antes de actualizar y restaurar una copia compatible si se requiere volver a una versión anterior. No ejecutar el código antiguo contra la base migrada.

## Contrato y límites

- Rutas `/v1`; peticiones con `schema_version: "1.0"` (valor por defecto). Campos adicionales y versiones desconocidas se rechazan con 422; textos obligatorios vacíos o solo espacios también.
- Contrato OpenAPI publicado en `packages/contracts/core/v1/openapi.json`; una prueba lo compara con la API generada.
- `POST/GET /v1/entities/{id}/memories`: contenido, fuente, UUID, fecha UTC y versión. Crear una nota añade `memory.recorded` en la misma transacción; respuesta de creación incluye `event_id`.
- `POST/GET /v1/entities/{id}/capabilities`: operación única por entidad, descripción, metadatos de parámetros y permiso requerido. Crear una declaración añade `capability.declared` atómicamente; operación repetida devuelve 409. `parameters` son metadatos descriptivos, no un esquema JSON Schema validado ni una promesa de ejecución.
- `POST/GET /v1/entities/{id}/events`: eventos con UUID, fecha del servidor UTC, fuente y payload; los de estado conservan `previous` y `value`. Las altas manuales no pueden usar los tipos internos `state.changed`, `memory.recorded`, `capability.declared`. La fuente aportada por el cliente es declarada, no autenticada.
- Las rutas originales siguen disponibles. Añadir `schema_version` a respuestas de creación y procedencia/versión a eventos son cambios aditivos. No se crean eventos nuevos retrospectivos para entidades o relaciones antiguas.
- No se ofrecen rutas para editar/borrar memorias, capacidades o eventos. El historial no equivale todavía a auditoría de todas las operaciones: crear entidades/relaciones no genera un evento adicional.
- Escrituras con `BEGIN IMMEDIATE`: el estado y su evento se guardan juntos, y dos escritores no leen el mismo estado anterior para construir historias incompatibles. Es concurrencia local de SQLite, no validación de carga distribuida.
- `/health` indica vida del proceso. `/ready` consulta tablas de memoria/capacidades y versión, devuelve 503 si no están disponibles; no reemplaza una comprobación de integridad completa o permisos de escritura.
- Scorpio permanece externo, sin código incorporado ni conexión/proyección implementada en esta entrega. No es requisito del arranque mínimo ni reemplazo de memoria. Conectores, Capability v1 interoperable, invocación, autorización y hardware pertenecen a fases posteriores.

## Cómo reproducir

En esta máquina cloud, desde `/workspace/Entity`:

```sh
bash scripts/setup-cloud.sh
sh scripts/start-local.sh
curl --fail --silent http://127.0.0.1:8000/health
curl --fail --silent http://127.0.0.1:8000/ready
python3 scripts/smoke-docker.py
```

Para ejecutar solo las pruebas:

```sh
cd /workspace/Entity/services/entity-api
../../.venv/bin/python -m unittest discover -s tests -v
```

El smoke Docker crea datos sintéticos identificados como `phase01-smoke-*`, reinicia solo entity-api y verifica entidades, atributos, estado, relación, cinco eventos, una nota y una capacidad. Conserva esos datos en volumen local. Los unittest utilizan bases temporales. No borrar volúmenes al detener el servicio.

## Evidencia ejecutada — 2026-11-06 Ecuador / 2026-11-07 UTC

| Comando / comprobación | Resultado real |
|---|---|
| unittest discover en services/entity-api | 15 ejecutadas, 15 aprobadas, 0 omitidas, última suite 1.812 s |
| Reinicio real Uvicorn en unittest | Dos procesos distintos, mismo archivo; estado, relaciones, eventos, memorias y capacidades idénticos |
| Migración base Fase 00 y repetición de initialize | Datos conservados, sin duplicar migraciones; integridad y claves foráneas correctas |
| Migración incompatible/futura/fallida | Rechazo y rollback comprobados; versión no alterada tras fallo |
| Inicialización concurrente | 8 inicializaciones, 4 hilos; esquema final 2 sin duplicación |
| Estados concurrentes | 8 cambios, 4 hilos; cadena previous/value coherente y estado final coincidente |
| Errores de contrato e integridad | 404 inexistentes, 409 duplicados, 422 inválidos; sin escrituras parciales |
| Fallo inducido de evento | Notas/capacidades revertidas junto al evento fallido |
| Contrato OpenAPI | Archivo publicado coincide exactamente con API |
| docker compose -f compose.yaml -f .runtime/cloud-compose.yaml build | Correcto; capa dependencias reutilizada, aplicación reconstruida con migraciones |
| sh scripts/start-local.sh | Contenedor recreado y saludable usando volumen existente |
| python3 scripts/smoke-docker.py | Aprobado después de reiniciar contenedor con esquema 2 |
| Comparación SQLite con backup previo | 4 entidades, 2 estados, 2 relaciones y 4 eventos anteriores intactos; integrity_check=ok, foreign_key_check sin errores |
| curl /ready | 200, status ready, database_schema_version 2, api_version v1 |
| pip check local y contenedor | Sin dependencias incompatibles |
| compileall y git diff --check | Correctos |

Antes de actualizar el contenedor se creó una copia SQLite consistente mediante `sqlite3.Connection.backup`, en `/data/entity-phase00-before-phase01.sqlite3` del volumen local. No se guarda la base en Git. La comparación posterior revisó todas las columnas originales y claves de cada fila anterior, además de la integridad actual.

## Fallos, advertencias y publicación

- Durante implementación, eliminar una importación necesaria de `Field` produjo errores de importación y fallo de arranque. Importación restaurada; suite ampliada y ejecutada después: 15/15 aprobadas.
- Se detectó por inspección una posible carrera en lectura de estado previo; escrituras serializadas y prueba concurrente añadida/aprobada.
- Dos comandos de creación de archivos usaron un directorio incorrecto y no escribieron los archivos previstos; corregidos antes de validar. No alteraron datos del servicio.
- Se mantiene la advertencia de deprecación TestClient/httpx y el aviso de caché pip no escribible, sin fallos funcionales asociados.
- No se probaron PostgreSQL/PostGIS, Scorpio, hardware, carga prolongada, fallos eléctricos, backup remoto ni despliegue productivo. No hay autenticación; mantener enlace de puertos en loopback. Lecturas de listados sin paginación, límite a revisar antes de producción.
- Se entrega en rama `codex/phase-01-core`, sobre `566e883`, sin fusión a main ni autoaprobación. Los resultados de CI remoto y PR se registran en la bitácora con su observación real.
- Próximo paso: revisión humana de la Fase 01 y de la decisión de mantener SQLite local. No iniciar Fase 02 sin aprobación.
