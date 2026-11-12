# P2-09.15 — detección y seguimiento local con trazabilidad

Gate técnico local superado en [gate.json](gate.json), sobre el corpus09.14 publicado. Este resultado prepara evidencias para ENTITY; no demuestra todavía identidad global, ocupación de recursos ni persistencia enCore. Contexto del producto y aclaraciones del operador en [ENTITY-AGENT-CONTEXT](../../../../../ENTITY-AGENT-CONTEXT.md), secciones9–10.

## Resultados medidos

| Configuración YOLOX-S CUDA FP32 | Aciertos /513 oportunidades válidas | Recall | Cajas falsas/localización/duplicadas aIoU0.30 | Imágenes/s agregadas |
|---|---:|---:|---:|---:|
| Imagen completa, umbral0.25 |478|93.18%|3|24.25|
| Imagen completa, umbral0.10 |489|95.32%|15|21.03|
| Seleccionada: umbral0.25, recortes nativos enC1/C2 |503|98.05%|8|11.23|

Se conserva exactamente el modelo/pesos/preprocesado originales. Los recortes son píxeles reales640×640 con solapamiento, aplicados únicamente aC1-S1/C2-S1 por sus pérdidas de densidad. Se conservan detecciones de imagen completa, se excluyen fragmentos en bordes interiores del recorte y se aplicaNMS0.45. Sin nuevos detectores ni información privilegiada.

| Sensor | Detección válida | Recall detector | ObservacionesMOT válidas |
|---|---:|---:|---:|
| C-S1 |28/28|100%|28/28|
| C-S2 |58/59|98.31%|58/59|
| C-S3 |59/62|95.16%|58/62|
| C-S4 |31/32|96.88%|31/32|
| C1-S1 |89/89|100%|89/89|
| C2-S1 |102/102|100%|102/102|
| C3-S1 |62/63|98.41%|62/63|
| C4-S1 |74/78|94.87%|74/78|

El objetivo≥95% es agregado por oportunidades válidas: C4 individual sigue en94.87%. No se oculta ese límite. La validez óptica y el criterioIoU0.30 se mantuvieron durante las comparaciones. Una caja sin coincidencia suficiente puede ser una localización de un fragmento corporal o una duplicación; el conteo no significa necesariamente objetos de fondo confundidos con personas.

MOT seleccionado:502/513observaciones válidas (97.86%), cero cambios deID dentro de segmentos de visibilidad válida continua y4observaciones falsas/duplicadas restantes. Los IDs de entradas separadas pueden diferir: son locales al sensor, no personas distintas ni identidad global resuelta. [Montaje de tracks locales](local-tracks.jpg) usa únicamente frames y salidas del modelo, sin leerGT.

## Correcciones y significado para ENTITY

Se reutiliza Norfair2.3.0 con distancia normalizada0.25, retención12frames (6s nominales a2FPS) y confirmación tras evidencia adicional. La vista pronunciadaC-S4 usa centro de caja como ancla de seguimiento; esto no afirma una posición de pies ni coordenadas del mundo.

El último cambio espurio deID coincidía con una deriva del filtro: sus parámetros predeterminadosR4/Q0.1 no correspondían a las coordenadas0–1 usadas. Se ajustaron priors normalizadosR0.0001/Q0.001 y varianzas iniciales0.01; se mantuvo la misma puerta de asociación. El resultado fue cero cambios durante visibilidad continua. Son parámetros de ingeniería, no probabilidades calibradas.

Cada observación conserva la caja/confianza de su detección fresca exacta y su frame original. Una detección tentativa puede asociarse retrospectivamente cuando el track se confirma: se conserva observed_at y se añade por separado el instante de la evidencia de confirmación. No se rellenan huecos con predicciones ni se presentan asociaciones retrospectivas como conocimiento instantáneo en vivo.

Las salidas declaran identidad anónima local, coordenadas normalizadas de imagen y ausencia de inferencia de salida del edificio. Un frame sin track significa falta de observación confirmada. Los falsos tracks son un riesgo de falsa entidad/ocupación; no deben convertirse automáticamente en personas civiles ni disponibilidad de puestos. La asociación global y la memoria del mismoCore quedan para09.16/09.17.

## Aislamiento, pruebas y límites

- 21testsEdgePASS, incluidos confirmación, conservación de tiempos, gaps sin observaciones inventadas, recuperación, caducidad local y ancla explícita.
- Auditoría real de32frames en tres estados: evaluador original presente fuera del worker, directorioGT desconectado eID privado cambiado. Detecciones, IDsMOT, posiciones y tiempos de confirmación invariantes; original restaurado y hash de truth verificado. Comparación ignora tiempos de ejecución/RAM, con tolerancia máxima0.001px en cajas. MTMC aún no probado por esta auditoría.
- Bubblewrap sin red/workspace/evaluador; solo frames y contexto legítimo/modelos. GPU ejecutó kernelsCUDA en warmup; se detuvo profiling antes de medir.
-178.83s para2008imágenes,11.23imágenes/s agregadas. No sostiene16imágenes/s de captura total. Snapshots globalesGPU273MiB tras warmup/ejecución no son pico deVRAM del proceso. No afirmar tiempo real.
- Un único corpus de ajuste; no son cinco pruebas independientes. PersistenciaCore, identidad global y aceptación humana final siguen pendientes. Baseline09.1–09.9, geometría yCore no se modifican.

## Reproducción

Desde raíz, con el corpus09.14 y entorno09.10 disponibles:

```text
P2_TRIAL_RUN=trial-a P2_EXPERIMENT=tiles025 P2_VISION_WORKER=detect P2_DETECTOR_PROVIDER=cuda P2_DETECT_THRESHOLD=0.25 P2_TILE_SENSORS=C1-S1,C2-S1 bash scripts/spatial-simulation/perception/run-cctv-isolated.sh
P2_TRIAL_RUN=trial-a P2_EXPERIMENT=tiles025 P2_VISION_WORKER=mot-tuned bash scripts/spatial-simulation/perception/run-cctv-isolated.sh
python scripts/spatial-simulation/perception/evaluate-cctv-detection.py --run trial-a --experiment tiles025
python scripts/spatial-simulation/perception/evaluate-cctv-mot.py --run trial-a --experiment tiles025 --tracks tracks-tuned.json
python scripts/spatial-simulation/perception/audit-cctv-isolation.py
python scripts/spatial-simulation/perception/summarize-cctv-perception.py
PYTHONPATH=services/entity-edge python -m unittest discover -s services/entity-edge/tests -v
```

La auditoría se ejecuta con el evaluador inactivo: mueve temporalmente su directorio dentro del workspace, conserva el original y lo restaura en finally. No la ejecutar en paralelo con otro evaluador. DatosGT/referencias/etiquetas por frame y observaciones detalladas siguen locales; se publican código, agregados y montaje sintético. Los informes de experimentos individuales conservan su estado parcial; gate.json es el resumen final.
