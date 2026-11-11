# P2-09.13 — grafo espacial estático de sensores

Gate técnico SUPERADO en `graph-checks.json`. Depende del perfil09.12 publicado enfba74e6. Se construyó ANTES de diseñar el nuevo recorrido de un actor. No constituye prueba de detección, MOT, ReID o aceptación humana.

P2 exporta contexto estático mediante el CollisionWorld existente: suelo, cápsula y colisiones reales, con celdas a0.2unidades nativas y aristas locales bidireccionales comprobadas en ambos sentidos. No se leen rutas ni se instancia humanoide. Dos hipótesis explícitas: todas las puertas cerradas, o solo las de seguridad abiertas. Son supuestos de escenario, no estados observados porENTITY.

La construcción aislada Bubblewrap recibe únicamente contexto estático permitido, calibración, contrato, gate previo y códigoEdge. Red/PID aislados; sin workspace completo, evaluador, imágenes ni modelos/personajes. Intento de leer el evaluador bloqueado. El artefacto final coincide porSHA con el generado dentro del aislamiento. No se importa la escena completa al worker de percepción.

P1 aporta `entity_edge/spatial_graph.py` y el nuevo contrato `SensorSpatialGraph.json`; son adaptación reutilizable de plataforma/Edge, sin modificar Core ni contratos históricos. P2 conserva exportador, perfil, construcción y evidencia. Baseline/modelo maestro/helpers históricos intactos.

## Resultados

| Hipótesis | Celdas | Aristas bidireccionales | Componentes transitables | Celdas ciegas aproximadas |
|---|---:|---:|---:|---:|
| Cerradas |5319|17231|26|1954|
| Seguridad abierta |5309|17184|25|1955|

Abrir hojas también cambia dónde puede situarse una cápsula; por ello no se comparan conteos globales como si fueran exactamente el mismo suelo libre. Las salas/cabinas cerradas y pequeños sectores separados permanecen componentes distintos. La conexión de circulación principal se comprueba con un paso físico de seguridad:1.2unidades de camino; abierto posible, cerrado imposible, transición0.01s rechazada. Con velocidad máxima declarada1.4unidades/s e incertidumbre0, mínimo0.857143s. Son unidades nativas, no metros certificados.

El mapa de visibilidad es una estimación conK/FOV y rayos contraAABB opacos a alturas genéricas0.55/0.95/1.45 sobre suelo; altura genérica de escala1.65. No usa altura/pose real del actor. Vidrio/vegetación, cuerpos recortados yAABB conservadores mantienen incertidumbre. Los números NO son recall ni visibilidad corporal medida: esa medición óptica separada está en09.12. Gris en `static-coverage.jpg` indica cero sensores estimados, no una persona oculta observada.

Se publican matriz de solapamientos y caminos mínimos entre regiones de sensores para cada hipótesis. La numeración no impone secuencia. El lector calcula camino transitable, dirección inicial posible, mínimo temporal y cámaras alcanzables desde una posición ESTIMADA por píxeles. Pausas sin máximo artificial. Durante pérdidas devuelve hipótesis/celdas ciegas, con cero observaciones creadas. Ausencia de detección aporta penalización graduada limitada (0.15 con geometría incierta), nunca una pérdida de identidad forzada. Los scores no son probabilidades calibradas.

## Validación ejecutada

- 16testsEdgePASS, incluidos6nuevos: camino alrededor de esquina, puerta cerrada/teletransporte, pausas largas, hipótesis alcanzables, evidencia negativa débil, metadatos privilegiados/aristas/reloj inválidos.
- Contrato estricto del artefacto realPASS; rechazaactor_id,routes,ground_truth. Contexto exportado y grafo sin esos campos ni poses/frames del humanoide.
- Revisión real del edificioPASS: conectividad abierta/cerrada, velocidad, posiciones fuera de geometría, pausa sin límite inventado y salida de hipótesis sin observaciones.
- Construcción aisladaPASS y artefactoSHA256 `51f1f9d2961b7b23b76b36442fd758f25a26a2f8a0888c67e9ba862598f11a57` (842484bytes). `build.json` registra la etapa de construcción previa a pruebas; el veredicto final está en `graph-checks.json`.

Comandos desde raíz, con entornoPython fijado de09.10:

```text
node scripts/spatial-simulation/perception/export-cctv-static.mjs
bash scripts/spatial-simulation/perception/run-graph-isolated.sh
python scripts/spatial-simulation/perception/check-cctv-graph.py
PYTHONPATH=services/entity-edge python -m unittest discover -s services/entity-edge/tests -v
```

Hashes de textosJSON normalizanCRLF→LF para conservar la comparación entreWindows/Linux. El archivo estático intermedio se regenera en`.runtime`; el grafo permitido se versiona en `simulation/spatial-office/perception/cctv-c-spatial-graph.json`. Tras reconstruir, comprobarSHA antes de copiar ese único archivo desde la salida aislada. Siguiente09.14: diseñar/capturar un único actor que desafíe este grafo, con GT exclusivamente en evaluador.09.15–09.18 pendientes; no aceptación humana final presumida.
