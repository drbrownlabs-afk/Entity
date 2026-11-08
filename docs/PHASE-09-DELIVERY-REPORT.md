# Fase 09 — interfaz espacial y resultados comprobados

Actualizado: 2026-11-08. Rama `codex/phase-09-autonomous-plan`, [PR #2](https://github.com/drbrownlabs-afk/Entity/pull/2), sin fusionar. Fase integral **EN CURSO**, sin aprobación automática ni avance a 10/11. Este informe sustituye sus versiones anteriores; la bitácora conserva la historia de ejecución.

## Cómo verla

**Aplicación pública:** https://drbrownlabs-afk.github.io/Entity/office.html

Abre directamente el lugar ORIGINAL, con interfaz ENTITY: Dollhouse, entidades, cámaras, ficha contextual, relaciones, eventos/memoria y timeline. En móvil la ficha ocupa la parte inferior y la navegación queda abajo. Se utilizan las referencias visuales del operador como guía de organización; no se sustituyó el lugar por una imagen o un edificio inventado.

El modo predeterminado se identifica como **Simulación autónoma / Sin Core conectado**. Reproduce la jornada, observaciones y rutas exportadas por el Core existente mediante `scripts/phase09/export-public-world.py`. Las reservas y capturas añadidas en este modo son **cambios de sesión**, no escrituras en un servidor. Recargar la página elimina esos cambios locales. Las reuniones con invitaciones requieren Core; no se finge haberlas creado localmente.

Para demostrarlo: selecciona Carlos y abre Relaciones; selecciona una cámara y abre el feed SIMULADO; registra evidencia de sesión; regresa a Dollhouse; abre C y selecciona un puesto; prueba una reserva y consulta Memoria. Reproduce/pausa el tramo calibrado con el mismo reloj. Los otros hitos permiten consultar estados operativos del guion, sin inventar poses humanas fuera de las rutas verificadas.

## Integración y datos reales del software

Se conserva el SDK oficial SuperSplat/PlayCanvas como motor interno, sin su interfaz pública. El techo se recorta por cámara, sin alterar el SSOG: vistas interiores/CCTV conservan la captura completa. Avatares GLB, cámaras, selección GPU y overlays usan el mismo mundo y AppBase. Los líderes de las etiquetas apuntan al ancla original; mover una etiqueta de pantalla no mueve una entidad.

La causa de la demo anterior sin personas era concreta: `operations.js` solo entregaba mundo tras un login y Pages no tenía Core HTTPS. Además, CCTV dependía de activar el modo Seguridad. La nueva entrada nativa monta datos explícitos de reproducción y conserva la conexión Core real opcional. Las herramientas anteriores siguen disponibles bajo `?diagnostic=1`.

**Inventario vigente:** A/B son oficinas privadas de seis posiciones, reservables completas. C/D son grupos de seis puestos individuales cada uno: C1–C6 y D1–D6. No hay E ni C de staff. Doce anclas de sillas y las dos mesas C/D se verificaron con fotografías y rayos del collider ORIGINAL en [survey-cd-seats.json](evidence/phase09/survey/survey-cd-seats.json). Son referencias geométricas, no pruebas de ocupación ni rutas para sentarse. La migración v5 conserva IDs, reservas e historial antiguos; los recursos obsoletos se retiran de las jornadas nuevas sin reasignar reservas silenciosamente.

Core persiste organizaciones Entity/Inmerso/Cowork, personas ficticias, relaciones tipadas, estados, reservas, visitas, permisos, dispositivos, tareas y eventos en SQLite. Núcleo mantiene los adaptadores/capacidades separados del Core. La recepción, cuenta personal y terminales conservan su integración existente, con verificación autorizada y privacidad. No hay reconocimiento facial inventado. Una afiliación organizacional no se presenta como ubicación física observada.

Desde el engranaje puede conectarse la interfaz a una API Core autenticada configurable. La conexión real fue probada contra Docker8010, incluida creación de reserva desde la interfaz, lectura independiente de la API y cancelación con historial. La memoria utiliza los filtros y la reconstrucción histórica de Core; consultar el pasado no rebobina el servidor y desactiva las acciones de escritura.

## Evidencias y comprobaciones

| Prueba | Resultado y referencia |
|---|---|
| Backend completo |86 pruebas PASS, 65.474s: `PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests`. Incluye conservación de reservas E antiguas, doce puestos nuevos y correspondencia exacta con rayos originales |
| Frontend / build |15 pruebas Node PASS y compilación Vite PASS. Se comparan poses fraccionales de reproducción con salidas reales de Core; reservas de sesión, privacidad de oficina, idempotencia y relaciones/eventos |
| Interfaz nativa con original |Fuente685dc5a, [run42451479996](https://github.com/drbrownlabs-afk/Entity/actions/runs/42451479996):1440×1000,1280×720,390×844 PASS. Carga SSOG/GLB, selección GPU, relaciones, feed con splats residentes, observación anónima normalizada, interior/Dollhouse, reloj, doce puestos y reserva de sesión. `native-interface.json` conserva SHA/run; capturas `native-*.png` |
| URL pública real |Misma fuente685dc5a, [Pages42451479952](https://github.com/drbrownlabs-afk/Entity/actions/runs/42451479952) PASS con Chromium contra URL pública. [Informe](evidence/phase09/native-pages-interface.json), no deducción a partir del build |
| CI general |Fuente685dc5a, [CI42451479977](https://github.com/drbrownlabs-afk/Entity/actions/runs/42451479977) Success: regresiones, paquete estático y extracción/instalación de fuente en carpeta limpia |
| Core real en interfaz nativa |`CHROMIUM_PATH=/usr/bin/chromium node scripts/phase09/verify-native-core-http.mjs`,1440/390 PASS. [native-core-http.json](evidence/phase09/native-core-http.json); no se presenta como comprobación local del SSOG |
| Recepción y aplicación personal |HTTP real/Chromium1280/390 PASS: tres clientes, invitación, respuesta de anfitrión, reservas, agenda en UTC/Tokio, permisos, revocación, borradores bajo ticks, filtros y privacidad. Reinicio conserva103entidades/19eventos; backupSQLite íntegro. `reception-http-browser.json` y `reception-http-process.json` |
| Docker actualizado |`ENTITY_BUILD_CA_FILE=/etc/ssl/certs/ca-certificates.crt bash scripts/start-office.sh --api-only` y `PYTHONPATH=services/entity-api .venv/bin/python scripts/phase09/smoke-office-docker.py` PASS.112entidades/24eventos de la jornada de prueba conservados; reinicio durante reproducción conserva reloj guardado y recupera pausa. Hashes de fuentes dentro de imagen iguales. Core anterior8000 preservado. [docker-office.json](evidence/phase09/docker-office.json) |
| ZIP extraído sin backend |Paquete685dc5a, comprobación1440/1280/390 PASS de estado/interacción sobre servidor estático4188, sin Python de aplicación/Core. [native-static-state.json](evidence/phase09/native-static-state.json). El proxy local403 impidió comprobar allí el SSOG; esa parte sí tiene pruebas remotas separadas |

Las ampliaciones posteriores de navegación por arrastre táctil/ratón y memoria Core se registran en bitácora/progreso y necesitan su propia ejecución remota; no se les atribuye retrospectivamente el PASS de685dc5a. Cada informe declara su fuente y alcance.

Fallos corregidos: login como prerequisito público; inventario Cstaff/D–E obsoleto; etiquetas que interceptaban toques; cámara móvil que recortaba D; feed fotografiado sin residencia de splats; timestamps/etiquetas de timeline no proporcionales; memoria Core sin filtro de entidad; borradores durante ticks y filtros temporales de memoria anteriores. Se conservan los informes fallidos por run. El primer comando local de unittest falló por `PYTHONPATH` omitido; corregido, no presentado como PASS.

## Límites que impiden cerrar la fase integral

- La captura ORIGINAL contiene artefactos y zonas borrosas fuera del interior. No equivale al acabado de un modelo CAD o de las imágenes de referencia. No se sustituyó por otro edificio para ocultarlo.
- La demo pública muestra **dos personas** en **un minuto** de rutas verificadas. El guion operativo completo existe, pero no están calibrados los movimientos de todo el equipo durante toda la jornada, las poses sentadas ni todos los recorridos de recepción/descanso. No se inventan esas ubicaciones. La escala métrica real no está certificada.
- No hay un Core persistente HTTPS público acreditado. Pages funciona autónomamente; sus acciones locales no son persistencia compartida. El Core Docker/API sí conserva estado y eventos.
- Kiosco/cuenta personal/recepción requieren Core autenticado; voz, WebPush y Android físico no tienen validación integral. Las consultas estructuradas usan el grafo real, pero no se acredita un LLM remoto ejecutado.
- Cámaras, puertas, sensores y actuadores del piloto son simulados/adaptadores de prueba. No se declara validado hardware del coworking ni sistema listo para producción.

No se solicita aprobación de la Fase09 como si estos pendientes estuvieran terminados. Los detalles de ejecución y checkpoints continúan en [progreso](PHASE-09-PROGRESS.md) y [bitácora](AGENT-WORKLOG.md).
