# P2-09.11 — reproducción local, gate técnico superado

2026-11-11. Resultado numérico: `reproduction.json`. Aceptación humana final no emitida; no significa superar el objetivo posterior de95%.

Publicación: métricas de evaluación agregadas. Las filas detalladas de visibilidad/IoU por frame se conservan solo localmente, fuera deGit y de los workers. La revisión automática rechazó su publicación; se aplica esta alternativa sin exponer esos detalles. Los montajes fueron comprobados como renders del gemelo y asset humano sintéticoMIT, sin cámara física.

Se repitió la captura local con el mismo protocolo de seis cámaras,41instantes por cámara,20s de medios y fixture temporal. **Los246PNG nuevos coinciden con los246hashes históricos**, sin requerir transferencia de los originales. Fuente histórica de captura y pruebas intacta: `capture-local.mjs` verifica su Gitblob y solo relocaliza salidas/root de ejecución/navegador. Inspección por el agente de `capture/dummy-views.jpg` y `evaluation/detections.jpg`: humanoide erguido, oclusiones y cajas sobre persona; persisten recorte de05 y poco detalle de06. No es aprobación del operador.

Pipeline real aislado: YOLOX-S→Norfair→OSNet produce89detecciones,8tracks locales,5asociaciones y4grupos provisionales. Evaluación separada:89TP IoU≥.50/165oportunidades,53.94%recall por vista;0FP aIoU.30. Coincide con la referencia, incluidas sus limitaciones. El nuevo perfil debe mejorar esa calidad, no ocultarla.

Benchmark sobre los mismos246frames, tres warmups excluidos, dos threads CPU y sin profiling en el bucle medido:

| Medida | CPU | CUDA FP32 |
|---|---:|---:|
| Tiempo batch con lectura/hash/preprocesado |56.905s|20.212s|
| Imágenes/s agregadas del detector |4.323|12.171|
| Inferencia mediana |167.888ms|29.931ms|
| Inferencia p95 |192.205ms|33.395ms|
| PicoRSS |278968KiB|1039212KiB|

GPU global:45MiB antes de sesión,274MiB después de warmup y al terminar; son snapshots de toda la GPU, **no picoVRAM del proceso**. KernelsCUDA comprobados durante warmup; no profiling en tramo cronometrado. Primera medición con profiling se conserva privadamente como preliminar, no tabla final. TF32 por defecto produjo diferencias máximas de.143px/.00139 de confianza; no se relajó el criterio: se desactivóTF32. Resultado final FP32:0diferencias de cantidad, máximo.000366px y.00000113 de confianza. No se afirma tiempo real del pipeline completo por este benchmark de detector.

Mismo CoreP1, HTTP/SQLite reales:246observaciones de cámara+5asociaciones, repetición251duplicados y revisión452sin cambios; reinicio real preserva hash del mundo,468entidades y25memorias, integrity_check=ok. Base local nueva tiene12personas declaradas; las dos identidades técnicas históricas de la máquina anterior no se transfirieron ni se inventaron para igualar470. No se crean personas civiles desde tracks. Onboarding permanece intacto. Regresión previa:111CorePASS/10EdgePASS/11lógicaP2PASS; no cambio de códigoP1.

`isolation.json`: detector/MOT/MTMC sobre cuatro frames reales de smoke mantienen las mismas salidas al variar el ID del evaluador y al desconectar GT. Se excluyen únicamente tiempos/RSS de la comparación. Datos del evaluador restaurados; frames/manifiesto intactos. Cada worker se ejecuta en namespaces PID/red y montajes mínimos, sin workspace, escena, guion o evaluador. Los tests del contrato rechazan campos privilegiados. Alcance explícito: prueba dinámica corta más inferencia completa conGTinaccesible; no validación multipersona.

## Comandos ejecutados

- `P2_LOCAL_RUN=<run> P2_CHROMIUM=<Chromium local> node scripts/spatial-simulation/perception/capture-local.mjs`; primero smoke de4frames, después corrida completa. Temporales de navegador privados y preview con base `/Entity/spatial-simulation/` en5192.
- `P2_LOCAL_RUN=<run> P2_VISION_WORKER=detect|mot|mtmc bash scripts/spatial-simulation/perception/run-local-isolated.sh` (cada etapa secuencial).
- `python scripts/spatial-simulation/perception/evaluate-local.py --run <run> --stage sequence|detection`, únicamente después de inferencia.
- `P2_VISION_WORKER=benchmark-cpu|benchmark-cuda` con el mismo launcher/frames/modelo.
- `python scripts/spatial-simulation/perception/ingest-local.py --local-run <run> --output <reporte nuevo>` dos veces; `snapshot-local-core.py` antes/después de reinicio ordenado del mismo servicio.
- `python scripts/spatial-simulation/perception/test-local-isolation.py --run <smoke> --output <reporte>` y `summarize-local.py --run <run>`; resumen exige coincidencia de hashes, equivalencia numéricaCPU/GPU, idempotencia, persistencia e invarianciaGT.

Fallos corregidos: Chrome cerraba antes de arrancar; temporales privados/Edge permiten ejecutar; preview sin base devolvíaHTML en rutas de assets, corregido sin cambiar la captura; lanzamiento inicial deAPI no persistió, corregido a proceso persistente; dependenciasEdge ausentes resueltas con su lockfile; TF32 corregido aFP32. No se ocultaron fallos ni se debilitó el gate. Próximo09.12: perfil nuevo de cinco dispositivos/ocho sensores, editor, calibración/cobertura y optimización autónoma, conservando las seis cámaras históricas.
