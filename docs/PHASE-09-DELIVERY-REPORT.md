# Fase 09 — entrega técnica y límites reales

Fecha: 2026-11-08. Rama `codex/phase-09-autonomous-plan`, [PR#2](https://github.com/drbrownlabs-afk/Entity/pull/2), sin fusionar. Estado integral **EN CURSO**, sin aprobación humana. Este informe no declara terminadas las rutas ni la correspondencia física C/D/E.

## Qué funciona

Core conserva organizaciones Entity/Inmerso/Cowork, personas ficticias, relaciones tipadas, reservas, visitas, permisos, dispositivos, eventos e historial en SQLite. Núcleo normaliza capacidades y adaptadores sin sustituir Core. Las APIs realizan comprobaciones y cambios persistentes; no son respuestas visuales predefinidas.

Las oficinas A/B se reservan completas y tienen sus anclas originales. C es interno, no comercial. Hay exactamente 12 puestos públicos D1–D6/E1–E6. La ocupación observada no se deduce de tener una reserva. Reservas concurrentes, check-in/no-show, conflictos, reasignación y permisos están cubiertos. El fallo sintético HVAC-D produce impacto/ticket acotados y resolución auditable. Las ramas hipotéticas conservan el mundo oficial y revalidan la aplicación de propuestas.

Recepción por pantalla utiliza invitación y código autorizado, registra la visita y contacta a Carlos mediante el mismo grafo/Núcleo. La app personal responde y el kiosco consulta esa respuesta. No se supone reconocimiento facial ni presencia física por responder un mensaje. Voz depende de las APIs del navegador; el micrófono real no está acreditado.

Office, personal y kiosco siguen la misma jornada activa. El reloj pertenece al servidor, permite pausa/velocidad y se recupera pausado tras reinicio. El replay conserva la ejecución anterior. Las fechas se interpretan en la zona horaria de la sede, incluso con un navegador en Tokio. Los formularios conservan el trabajo del usuario durante los eventos del reloj. Los permisos se aplican en servidor por sede, rol y recurso; cerrar sesión revoca la sesión y descarta respuestas tardías.

El original de Synthetic Office se transmite desde SuperSplat mediante su SDK y voxels oficiales. Hay vista interior, superior y cámaras virtuales del mismo PlayCanvas. La evidencia espacial confirma a Luis en cinco instantes sobre un tramo físico de pasillo, observado por dos cámaras; las observaciones anónimas e historial se guardan en Core. La identidad solo se añade mediante una verificación sintética separada. La memoria permite filtrar por entidad/zona/tipo/intervalo; conserva el orden de cambios que comparten hora. La reconstrucción por hora muestra el cierre del instante y no ofrece vídeo grabado.

## Cómo ejecutar y reproducir

```bash
bash scripts/start-office.sh
```

Requisitos y cuentas: [runbook](PHASE-09-RUNBOOK.md). El arranque construye Docker, provisiona sin borrar datos y sirve la web compilada. API en8010, web en4175; no requiere un Python instalado en el anfitrión. Las contraseñas generadas permanecen en el archivo local privado indicado por el script y no se incluyen en Git ni en el paquete.

La instancia persistente de esta sesión tiene la jornada `demo-phase09-20261108`, pausada en09:15:05 de Guayaquil. Luis tiene una pose del corredor calibrado y una reservaD3; esa reserva no se convierte en ocupación del puesto. Son 116 entidades y 21 eventos, conservados exactamente tras reiniciar Docker. Ver [live-demo.json](evidence/phase09/live-demo.json). Desde Memoria se puede reconstruir el tramo09:15:00–09:15:10; desde el reloj se pueden ejecutar los hitos posteriores del guion existente. Fuera del tramo calibrado no se inventa una posición humana.

Visor público: https://drbrownlabs-afk.github.io/Entity/office.html. **Pages aloja el frontend y el archivo original remoto; las operaciones requieren configurar el mismo Core autenticado.** No existe un Core públicoHTTPS acreditado. El modo autónomo del centro comercial de la Fase07 se conserva y utiliza su fixture compartido; no se sustituye con él el coworking.

## Pruebas y evidencias

| Comprobación | Resultado y alcance |
|---|---|
| Regresión backend |84 pruebas locales aprobadas; corrección posterior de orden temporal2dirigidasPASS yCI general/PR e72a782Success. `backend-regression.txt`, `memory-regression.txt` |
| JavaScript/build |11 pruebas aprobadas y compilaciónVitePASS. No acreditan por sí solas geometría ni hardware |
| Interfaces HTTP reales |Chromium1280/390PASS: invitación, respuesta deCarlos, reservaA, consulta/agenda, UTC/Tokio, José/Carlos/kiosco sincronizados, formulario durante ticks, filtros históricos y privacidad tras logout. `reception-http-browser.json` |
| Proceso y backup |Reinicio deuvicorn conserva 110 entidades y 19 eventos; backup SQLite integrity_checkPASS. `reception-http-process.json` |
| Docker |Imagen comparada por SHA256 de cada archivoPython, estado/eventos conservados y parada/rearranque durante reproducción: reloj guardado exacto y pausa sin tiempo offline. `docker-office.json` |
| Paquete limpio |Fuente c3879e3 extraída en carpeta nueva, venv/npmci nuevos, dependencias coherentes, build y E2E HTTP/reinicio/backupPASS; hashes y ausencia de secretos verificados. El informe vincula eseSHA, no un paquete posterior. `clean-package.json` |
| Original y física |SSOG/voxels originales y navegación1440/390;22muestras del corredor libres,5poses Core/GLB y2CCTV; última prueba espacial e72a782/42443600314PASS. Archivos `original-integration.json`, `spatial-core.json`, `voxel-ground.json` y archivos históricos porrun |

Comandos exactos y fallos previos están en [progreso](PHASE-09-PROGRESS.md) y [bitácora](AGENT-WORKLOG.md). Los informes incluyen SHA y enlace deActions cuando la prueba se ejecuta allí. Un informe parcial/interrumpido no se interpreta comoPASS; las evidencias anteriores se conservan porrun.

## Defectos corregidos en esta continuación

- Relojes/jornadas que podían divergir entre interfaces y mensajes que podían pertenecer a otra ejecución.
- Pérdida del borrador de una acción cuando llegaban actualizaciones del mundo.
- Uso inconsistente de la zona horaria del dispositivo en reservas/consultas.
- Filtros de zona que podían trasladar al pasado una ubicación posterior con el mismo timestamp.
- Arranque que requería venv local, permisos restrictivos del código copiado a Docker y caché npm fuera del workspace.
- Encuadre superior que utilizaba límites exteriores del escaneo, transición fotografiada antes de terminar y yaw normalizado por el SDK. Se reutiliza la cámara oficial, sin modificar el edificio.

CI también detectó una edición con concurrency duplicado, corregida en51178c9. La comprobación móvil de orientación se ajustó al aspecto real del canvas. Son fallos de configuración/ensayo registrados, no supuestos fallos de autenticación del recurso original.

## Qué falta y qué impide cerrar toda la fase

1. **Correspondencia geométrica C/D/E y sus puestos.** Se han localizado cuatro conjuntos de trabajo en las vistas revisadas; A/B están confirmadas y los otros dos constan como mobiliario observado sin correspondencia comercial. Todavía no hay evidencia suficiente para vincular los tres ambientes restantes ni localizar una quinta agrupación. Eso no demuestra su inexistencia. No se inventan mesas, sillas, coordenadas ni ambientes adicionales.
2. **Jornada visual completa.** El servicio ejecuta la jornada y sus operaciones, pero solo hay un tramo humano físicamente calibrado de diez segundos. No se acredita que todos los empleados caminen, se sienten y descansen durante todo el día ni el recorrido visual integral Luis→D3→HVAC→E3. Las coordenadas pendientes no se rellenan con posiciones aproximadas.
3. **Acceso compartido fuera del equipo de ejecución.** Falta desplegar y verificar un Core persistenteHTTPS accesible para clientes remotos; WebPush tampoco está integrado. Polling y una página estática no equivalen a notificaciones del sistema móvil.
4. **IA de proveedor y voz en dispositivos reales.** Consultas guiadas usan datos/evidencias Core; el SDK tiene pruebas controladas. No se ha ejecutado un LLM remoto ni una sesión de voz/micrófono/Android físico. OpenClaw y las fases10/11 planificadas no se activan aquí.
5. **Piloto físico.** Cámaras, control de acceso, sensores y actuadores de esta jornada son sintéticos o adaptadores de prueba. Los ensayos previos RTSP/MQTT locales se conservan, pero no certifican cámaras/puertas/HVAC de un coworking real. Ese hardware no se inventa ni constituye una prueba ya realizada.

Los dos primeros puntos impiden declarar cerrado el flujo espacial integral. Los demás delimitan el uso actual y la preparación de un piloto; el hardware diferido no se convierte en un requisito nuevo de aprobación de la simulación. No se solicita aprobación de fase mientras queden esos gates sin demostrar.

## Última verificación remota

Fuente verificada: [c0afef6](https://github.com/drbrownlabs-afk/Entity/commit/c0afef6). Los cinco workflows terminaron **Success**:

- [CI general y paquete limpio](https://github.com/drbrownlabs-afk/Entity/actions/runs/42444521584).
- [CI del PR](https://github.com/drbrownlabs-afk/Entity/actions/runs/42444524894).
- [Original, colisiones y vistas1440/390](https://github.com/drbrownlabs-afk/Entity/actions/runs/42444521616).
- [Personaje, dos cámaras, observación e historia](https://github.com/drbrownlabs-afk/Entity/actions/runs/42444521608).
- [Pages y navegador sobre la URL pública](https://github.com/drbrownlabs-afk/Entity/actions/runs/42444521644).

El artefacto **entity-delivery** está listado en el CI general e incluye fuente/web/manifiesto y pruebas de la extracción limpia del lote actual. El manifiesto publicado en gh-pages señala exactamente el SHA anterior. La URL pública se verificó con navegador autorizado de Actions; el proxy local no se utiliza como prueba de disponibilidad pública. Ver [ci-verification.json](evidence/phase09/ci-verification.json). Los fallos anteriores permanecen en el historial, sin presentarlos como resultados del último árbol.
