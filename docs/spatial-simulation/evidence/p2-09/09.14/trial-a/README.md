# P2-09.14 — recorrido reproducible de un actor

Gate técnico del corpus superado. Esta entrega contiene el capturador, el planificador del simulador, validadores, métricas agregadas y un montaje de frames reales sintéticos. No certifica todavía detección, MOT, ReID ni aceptación humana final.

## Resultados para analizar

| Medida | Resultado |
|---|---:|
| Actores simultáneos | 1 |
| Sensores independientes | 8 |
| Instantes sincronizados | 251 |
| Imágenes verificadas por SHA256 | 2008 |
| Duración del escenario | 124.547 s |
| Recorrido en unidades nativas | 105.547 |
| Velocidad máxima medida | 1.00484 unidades/s |
| Oportunidades ópticas válidas | 513 |
| Instantes sin vista útil | 19 |
| Instantes sin al menos20píxeles visibles en ninguna cámara | 12 |
| Recaptura en navegador nuevo con otro ID interno | 32/32 hashes idénticos |

[Capturas por sensor](camera-views.jpg), [validación completa del corpus](corpus-checks.json) y [reproducción](reproduction.json).

Las513oportunidades son etiquetas del evaluador, no detecciones deYOLOX. Una oportunidad útil exige altura visible≥80px,≥120píxeles visibles,≥200píxeles amodales dentro del encuadre y fracción visible≥0.35. La fracción se limita al encuadre; no garantiza cuerpo completo. No confundir19instantes sin vista útil con19instantes de desaparición completa:12quedan por debajo del criterio de20píxeles en todas las cámaras.

Todos los sensores tienen oportunidades útiles y pérdidas/reapariciones: los conteos por sensor están en corpus-checks.json. Los campos pause_intervals=31 y turn_intervals=65 cuentan intervalos entre frames, no31paradas ni65maniobras independientes. La animación es un dummyMIT en pose de validación trasladado/orientado; no son personajes finales ni una prueba multipersona.

## Reproducción local

Se diseñó después de validar el grafo09.13, con entrada, lounge, espera, recepción, cafetería, comedor, sector ciego y retorno; giros y pausas incluidas. El planificador consulta caminos transitables del grafo, no alimenta el motor de percepción.

```text
python scripts/spatial-simulation/perception/plan-cctv-trial.py --run trial-a
P2_TRIAL_RUN=trial-a node apps/spatial-simulation/tests/cctv-trial.mjs
python scripts/spatial-simulation/perception/check-cctv-trial.py --run trial-a
python scripts/spatial-simulation/perception/plan-cctv-trial.py --run trial-a-repro
P2_TRIAL_RUN=trial-a-repro P2_TRIAL_SAMPLE=4 node apps/spatial-simulation/tests/cctv-trial.mjs
python scripts/spatial-simulation/perception/check-cctv-reproduction.py --run trial-a --sample trial-a-repro
P2_TRIAL_RUN=trial-a bash scripts/spatial-simulation/perception/stage-trial-frames.sh
```

Usar un identificador nuevo si el corpus ya existe: los scripts impiden sobrescribirlo. PowerShell establece variables mediante$env:. Requiere el entorno fijado de09.10, previewVite5192, P2_CHROMIUM al navegador local y TEMP/TMP escribibles. Variantes0–4 permiten velocidades de estímulo distintas dentro del límite del grafo; solo variante0 ha sido capturada/validada en esta entrega. El reloj de medios es simulado y se distingue del tiempo de render.

Plan, poses, identificadores internos, referencias amodales y etiquetas por frame permanecen en el evaluador privado bajo.runtime. Los workers deENTITY reciben únicamente frames/manifiesto estricto y contexto legítimo de cámaras. No se publican aquí esos archivosGT ni cachés. El planificador publicado es código del simulador; no se monta ni importa en inferencia. Los PNG son resultados regenerables del test, no prerrequisitos de transferencia.

Evaluador rápidoOpenCV: equivalencia exacta con24casos de calibración existentes;5tests de máscarasPASS. Validación completa del corpus:458.08s. Caché ext4 de solo frames verificada porSHA. La prueba de reproducción demuestra invariancia de píxeles ante cambio deID; la invariancia de inferencia conGT desconectado debe comprobarse después.

09.15 se inició por separado; sus resultados no forman parte del gate09.14.09.16–09.18 y aceptación humana final siguen pendientes. Baseline09.1–09.9 y CoreP1 preservados.
