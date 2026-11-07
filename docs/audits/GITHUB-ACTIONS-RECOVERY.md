# Diagnóstico y recuperación de verificación GitHub Actions
Fecha: 2026-11-06 Ecuador / 2026-11-07 UTC.

## Causa demostrada
La máquina ejecuta red restricted/enforced, sin api.github.com en destinos permitidos. `gh auth status` muestra GH_TOKEN presente e informa token inválido; sin embargo una petición REST SIN credenciales a https://api.github.com falla con `Tunnel connection failed: 403 Forbidden` durante CONNECT al proxy. La petición no alcanza GitHub. Por tanto NO demuestra token inválido, expiración o falta de scopes. No se extrajo ni imprimió token alguno.

REST `gh api repos/drbrownlabs-afk/Entity/pulls/1` y GraphQL fallan en esta ruta API. El manifest de identidades no contiene conexiones; no hay herramienta GitHub alternativa habilitada en esta sesión. La conexión externa que creó PR #1 no está automáticamente disponible aquí. Git HTTPS funciona y su autenticación inyectada está separada de la API.

Adición api.github.com guardada con la configuración soportada en el borrador, preservando presets y sin ampliar a *. No se aplica automáticamente a la máquina: requiere guardar/publicar la configuración del entorno. No se afirma que este acceso API ya esté reparado. Hasta que se aplique, scopes/usuario API y cambios de settings no pueden comprobarse desde gh. No se usaron IPs, aliases, rutas directas ni desactivación de proxy para evadir la política.

## Método autorizado que sí funciona
Las páginas públicas de GitHub en github.com son accesibles mediante HTTPS normal, sin extraer credenciales ni iniciar sesión. Se inspeccionaron PR y Actions usando urllib, HTML visible, enlaces de runs y enlaces al commit completo.

- PR #1 existente: https://github.com/drbrownlabs-afk/Entity/pull/1 — Draft, desde codex/phase-03-edge hacia main, head 5ca635a; también confirmado vía `git ls-remote origin refs/pull/1/head`. No se creó un duplicado ni se fusionó.
- Lista Actions muestra 7 runs históricos completados correctamente (push fases 00–03 y PR #1). La ausencia de resultados API anterior no significaba ausencia de runs.
- Run del PR: https://github.com/drbrownlabs-afk/Entity/actions/runs/42324594328 — Status Success, api-tests y edge-tests, 52 s, commit 5ca635a. Resultado remoto real observado, no inferido.
- Los workflows push y pull_request están habilitados en la práctica. Un borrador de PR no impidió ese run. No se puede inspeccionar settings administrativos con la sesión web anónima; no se inventa su configuración interna.

## Correcciones aplicadas
El run remoto mostró avisos de Node20 de checkout@v4/setup-python@v5/upload-artifact@v4 y cambio de ubuntu-latest. Se verificaron repositorios/etiquetas oficiales y READMEs y se actualizó a checkout@v5, setup-python@v6, upload-artifact@v6 (Node24) y ubuntu-24.04. Permissions contents:read, manteniendo permiso runtime de artefactos y sin pedir escritura innecesaria.

Se conservaron triggers push/pull_request para API, Edge, scripts, contratos, Compose y workflow; workflow_dispatch existe. Cambios solo docs no disparan CI (diseño actual), por lo que no debe esperarse un run para cada commit documental. La Fase 04 añade demo Output al job Edge. No se desactivaron tests ni se eliminaron assertions para obtener verde.

Se usa push autorizado a codex/phase-04-output para disparar CI y la página Actions filtrada por branch para obtener el run. Cada comprobación requiere URL, commit y Status final; un estado In progress no valida la ejecución. Este camino permite continuar sin operaciones Git/CI manuales del operador, aunque API/PR/settings aún requieran acceso específico.


## Nuevo CI Fase 04: verificado
Push de implementación 520475fbfee95abc5440bea2a2edc627ffe8f573 disparó https://github.com/drbrownlabs-afk/Entity/actions/runs/42325368629 — Status Success, 51 s; api-tests 30 s, edge-tests 47 s. Commit completo confirmado por enlace de la página. Incluye demo Output además de detector/vídeo, tests y Docker. No se infiere verde por ausencia de runs.

Esa ejecución mostró que upload-artifact@v5 aún emitía warning Node20 (la suposición inicial de que v5 lo resolvería no era correcta). Se consultó action.yml oficial de v6: using node24, tag b7c566a772e6b6bfb58ed0dc250532a479d7789f. Corregido workflow a v6; resultado del siguiente run se registra en bitácora. Añadidos reporte/salida HTML de Output a artefactos sin credenciales.
