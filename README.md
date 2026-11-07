# ENTITY OS

Sistema modular de inteligencia espacial e IA situada. El núcleo propio representa entidades, estados, relaciones explícitas, eventos, memoria persistente y capacidades.

## Estado

**Fase 07 EN VALIDACIÓN. [Abrir ENTITY Experience](https://drbrownlabs-afk.github.io/Entity/).** La experiencia pública es autónoma y simulada; el Core sigue siendo un servicio de desarrollo local. Se ha incorporado una API inicial con persistencia local y un contenedor Docker. Scorpio es infraestructura externa NGSI-LD; su integración de datos con la API está pendiente. Core local 0.2.0 validado con migraciones, memoria y capacidades declaradas; Scorpio y el sistema completo siguen pendientes.

## Arranque local de desarrollo

Requiere Docker y Docker Compose v2. El arranque mínimo no requiere Scorpio.

```sh
sh scripts/start-local.sh
```

El script construye la API, la inicia y espera una respuesta de salud. Para probar datos tras reiniciar: `python3 scripts/smoke-docker.py` (crea datos sintéticos locales). Consulta la guía `services/entity-api/README.md` y la evidencia en `docs/audits/PHASE-00-2026-11-06.md`. Scorpio se mantiene separado, pendiente de integración.

**Importante:** el API actual utiliza SQLite como almacenamiento provisional. PostgreSQL/PostGIS y proyección NGSI-LD siguen pendientes. Contratos, autorización de integraciones/capacidades, Output virtual, IA situada, Edge y visor están implementados con los límites documentados por fase. No exponer el servicio directamente a Internet.

Documentación: `docs/architecture.md`, `docs/implementation-plan.md`, `AGENTS.md`.

Fase 01 EN VALIDACIÓN: resultados y límites en `docs/phases/PHASE-01.md`.

Demo Edge Fase 03 (EN VALIDACIÓN): `bash scripts/setup-edge.sh` y `bash scripts/demo-edge.sh` tras preparar Core. Vídeo preentrenado, tracking y observaciones en Core; detalles en docs/phases/PHASE-03.md. Fase 02 aceptada por operador;

Fase 04 Output virtual EN VALIDACIÓN: `bash scripts/demo-output.sh`, con Core/Edge preparados. Pantalla virtual, reglas, control manual y fallos probados; ver docs/phases/PHASE-04.md. CI remoto comprobado por web; diagnóstico en docs/audits/GITHUB-ACTIONS-RECOVERY.md.

Fase 05 IA situada EN VALIDACIÓN: `bash scripts/demo-agent.sh` con Core/Edge preparados. SDK OpenAI integrado y proveedor controlado reproducible, evidencia y acciones virtuales con permisos; inferencia remota pendiente de clave. Ver docs/phases/PHASE-05.md.

Fase 06 EN VALIDACIÓN: `bash scripts/setup-integrations.sh` y `bash scripts/demo-integrations.sh`. RTSP/MQTT reales locales, reservas ficticias y recuperación sin cambiar Core; matriz en docs/phases/PHASE-06.md.

## ENTITY Experience — Fase 07

[Demo pública](https://drbrownlabs-afk.github.io/Entity/) · [Pruebas, uso y límites](docs/phases/PHASE-07.md). Siete tiendas, visitantes anónimos, navegación 3D y cuatro cámaras CCTV virtuales sincronizadas, consultas y acciones simuladas verificables. Funciona sin Python ni Core. Conexión al Core opcional mediante URL configurable, identificada por separado.

Desarrollo: `bash scripts/setup-experience.sh` y `bash scripts/demo-experience.sh` (Node 24). GitHub Actions construye y publica `gh-pages`, y comprueba la URL pública con navegadores de escritorio y móvil. EN VALIDACIÓN; no se ha iniciado Fase 08.
