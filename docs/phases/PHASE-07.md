# Fase 07 — ENTITY Experience

Estado: EN VALIDACIÓN. Fecha: 2026-11-07 UTC. Rama `codex/phase-07-experience`; conserva las fases anteriores, sin iniciar Fase 08. La autorización para continuar no se interpreta como autoaprobación de las fases previas.

## Cómo verla

URL pública verificada: https://drbrownlabs-afk.github.io/Entity/ . Publicación y prueba pública de escritorio/móvil aprobadas por Actions; ver cierre más abajo. El sitio funciona autónomamente con archivos estáticos, sin Python, cuentas ni backend. Se puede pausar, avanzar, mover la línea temporal, elegir acceso/vista o tocar una tienda para acercarse, cambiar escena/HVAC/apertura y consultar visitantes, tiendas, HVAC o escena. Las cuatro CCTV son cámaras virtuales del mismo mundo, no vídeo real. Exportar Observation v1 descarga los tracks visibles con procedencia simulada.

En desarrollo: `bash scripts/setup-experience.sh` y `bash scripts/demo-experience.sh`. Node 24/npm con lockfile. Compilación estática en `apps/web/dist`, base relativa compatible con `/Entity/`. Ningún recurso externo ni servidor Python es necesario para ejecutar ese directorio en un alojamiento web.

## Reutilización y sincronía

Se evaluaron los repositorios/documentación de PlayCanvas (https://github.com/playcanvas/engine), Three.js (https://github.com/mrdoob/three.js) y herramientas ya existentes. Se integra PlayCanvas 2.23.3 (MIT), alineado con AGENTS; Vite 8.3.6 (MIT) y Playwright 1.65.0 (Apache-2.0). Versiones transitivas fijadas en package-lock. Se reutilizan geometrías primitivas del motor; no assets externos, modelos, texturas o metraje con derechos inciertos. No se crea renderer, detector, motor físico ni simulador general.

El fixture determinista original de Edge se extrae sin cambiar sus 20 pasos a `worlds/shopping-mall/fixture.json`; tanto Edge como Experience lo consumen. Seis visitantes anónimos repiten esa misma trayectoria con desfases; no es una segunda simulación física. La geometría es ilustrativa: siete tiendas, pasillo, accesos, HVAC y señalización. Un único estado/revisión alimenta entidades, eventos, meshes, cinco cámaras, consultas y acciones. Las acciones locales registran `capability.result` verificado por lectura del estado local: no equivalen a una ejecución del Core. Memoria local limitada a 40 eventos, reiniciar la página reinicia la simulación. Exportaciones usan Observation v1 con fuente/modelo/procedencia y coordenadas del fixture; la prueba de integración las ingiere en el Core existente sin cambiar contratos.

## Conexión opcional al Core

La misma interfaz permite URL configurable, token en memoria y entidad de consulta, lectura del snapshot `edge.presence`, consulta mediante `/v1/agent/requests` y acción con capacidad declarada y entidad destino. El Core conserva autorización, auditoría, idempotencia y verificación de Output. Los errores HTTP y de red son visibles sin respuestas locales sustitutas. El modo Core detiene el replay y deshabilita las acciones locales; su refresco es manual, no streaming. Los tracks se proyectan sobre la geometría virtual; tiendas/HVAC son decorado local, no estados físicos leídos. La CCTV continúa siendo virtual. Se muestra la procedencia simulada cuando el snapshot la declara; una conexión real no acredita sensores físicos.

Para Pages, el backend debe ser accesible por HTTPS y permitir el origen `https://drbrownlabs-afk.github.io` mediante `ENTITY_ALLOWED_ORIGINS`. CORS está desactivado por defecto y no usa cookies ni comodines. No se publica un Core abierto ni credenciales en el sitio. La prueba de navegador usa un Core real temporal con proveedor `controlled-fixture` y Output virtual; no demuestra inferencia remota o hardware.

## Pruebas ejecutadas

- `npm --prefix apps/web test`: 4/4, determinismo, zonas, identificadores de eventos, acciones/readback, exportación y modos.
- `npm --prefix apps/web run build`: aprobado; JS ~2.02 MB sin comprimir / 517 KB gzip, CSS ~8 KB. Sin dependencias remotas al ejecutar.
- `cd apps/web && PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:browser`: 3/3. WebGL real, cinco cámaras/mismos meshes y revisión, escena y HVAC visibles, cierre de tienda, navegación, descarga, ausencia de llamadas Core en modo autónomo, móvil 390×844 sin desbordamiento, controles táctiles y pausa, Core HTTP real con CORS/consulta/acción/401 sin fallback.
- `PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests -v`: 29/29. Un primer comando sin PYTHONPATH falló por importación; corregida la invocación, sin cambiar tests para ocultarlo.
- `PYTHONPATH=services/entity-edge .runtime/edge-venv/bin/python -m unittest discover -s services/entity-edge/tests -v`: 7/7 aprobados.
- `.venv/bin/python scripts/test-experience-contract.py`: aprobado; exportación JS → ingestión Core → proyección de cuatro tracks → regla → Output verificado y deduplicación.
- `bash scripts/demo-edge.sh`: aprobado después de extraer fixture; 20 frames simulados/16 muestras/6 transiciones y vídeo de 60 frames/181 muestras/68 transiciones, recuperación incluida. Son muestras, no personas únicas.

Capturas/evidencia en `docs/evidence/phase07-*` y artefactos de Actions. Rendimiento local Chromium SwiftShader: ~17.8 FPS a 390×844; mide render por software en servidor, no un teléfono físico. El test exige al menos 8 FPS como umbral de humo, no promete 60 FPS. Se limita resolución a pixel ratio 1 y se evita sombreado costoso.

## Despliegue y fallos corregidos

El primer deploy de `gh-pages` ejecutó Pages nativo correctamente: run https://github.com/drbrownlabs-afk/Entity/actions/runs/42330844212 , commit estático 108d227. `.github/workflows/pages.yml` construye, prueba, publica solo estáticos preservando historia y solicita build Pages vía REST desde runner autorizado. Después exige que la URL pública sirva `deployment.json` con SHA exacto y ejecuta Chromium escritorio/móvil contra esa URL sin Core/Python. Un build sin URL correcta no cuenta como verificado. Capturas y reporte quedan en artefacto `pages-verification`.

Corregidos recorte de canvas/CCTV por modo de relleno PlayCanvas, receptor incorrecto de fetch en adaptador, identificadores repetidos tras truncar eventos y reconexión fallida que conservaba adaptador antiguo. El proxy de este entorno deniega api.github.com y github.io con CONNECT 403; Git y páginas públicas de github.com funcionan. No se infiere token inválido de ese bloqueo. Se utiliza Git autorizado para publicar y runner Actions para comprobar públicamente. Dominio Pages añadido al borrador de red del entorno; no se afirma aplicado. PR API continúa limitado; el resultado concreto se registra al cierre.

Pages usa Settings → Pages → Deploy from a branch → `gh-pages` / `(root)`, activado por publicación inicial. Si una política del propietario lo impidiera, esa es la configuración necesaria, con Actions habilitado y permisos de workflow contents/pages write; no se solicitan operaciones Git manuales. Workflow propio usa Ubuntu 24.04/actions Node 24; Pages nativo puede emitir advertencias de acciones administradas por GitHub.

## Pendientes de revisión

Revisión humana de Fase 07; pruebas en teléfonos/GPU/Safari físicos; órbita/recorrido libre si se requiere además de vistas y enfoque actuales; calibración métrica/3D real; Core HTTPS público opcional y autenticación de despliegue antes de uso productivo. No se ha implementado vídeo físico, LLM remoto ni control hardware en esta experiencia. Sin Fase 08.

## Publicación final comprobada

- Código: https://github.com/drbrownlabs-afk/Entity/commit/56d05f43348cbc85bd6c9144b1d3e52c8e3748a6 . Corrección de evidencia/workflow y versión publicada: https://github.com/drbrownlabs-afk/Entity/commit/1f1a3b3dd174cfe7c01b379cc887164347fcf93e . Rama `codex/phase-07-experience`, sin merge a main.
- Pages y prueba obligatoria de URL real: https://github.com/drbrownlabs-afk/Entity/actions/runs/42331518986 — Success, 52s, sin anotaciones. Artefacto pages-verification, 303 KB, contiene informe JSON y capturas. Comando del runner: `node scripts/check-public.mjs https://drbrownlabs-afk.github.io/Entity/ 1f1a3b3dd174cfe7c01b379cc887164347fcf93e`. Comprueba versión exacta servida, dos tamaños, WebGL/cinco cámaras/revisión, escena y consulta, cero llamadas API y errores. No es solo una compilación exitosa.
- Rama estática `gh-pages` e2a9cb3ada77c225496333bb326bc6e31f982cb7 contiene exclusivamente .nojekyll, index.html, assets y deployment.json con ese SHA de origen; descargada por Git. No Python, tokens ni backend en el sitio.
- Primer CI completo 42331389339 Success (1m32s), api-tests/edge-tests/experience-tests. CI final https://github.com/drbrownlabs-afk/Entity/actions/runs/42331518937 Success (1m42s), los tres jobs aprobados, sin anotaciones. Artefacto experience-evidence 827 KB y edge-report publicados. Docker/reinicio, detector/vídeo/recuperación, Output, agente y RTSP/MQTT/REST de fases anteriores pasaron también en ese run.
- Fetch independiente de GitHub confirma 1f1a3b3, árbol 1f12e2303bee81ed0b8d73eb7f1399b489c2494a y ancestro de Fase 06. Main 5ce2519 sigue incorporado.
- PR REST intentado: POST api.github.com/repos/drbrownlabs-afk/Entity/pulls Forbidden por restricción del entorno; no PR nuevo ni merge. No se pide Git manual al operador. Pages está activo y no necesita intervención del propietario.

El cierre documental posterior no modifica la versión de aplicación ya desplegada ni exige repetir pruebas. Fase 07 EN VALIDACIÓN hasta revisión humana.
