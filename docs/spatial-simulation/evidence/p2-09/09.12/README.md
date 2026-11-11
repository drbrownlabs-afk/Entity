# P2-09.12 — perfil CCTV separado y calibración local

Estado EN VALIDACIÓN. Cinco dispositivos y ocho sensores independientes, sobre el PlayCanvas y Core existentes. No se altera el baseline de seis cámaras/246PNG ni la geometría. La disposición de la imagen del operador se adapta al corredor alargado y sus alas reales.

## Modelos y límites

La [comparación de09.10](../09.10/camera-research.md) conserva la investigación de tres SKUs. Selección virtual: C=AXIS P3747-PLVE; C1–C4=AXIS P3267-LVE. No compra ni acceso físico.

| Modelo | Datos oficiales | Decisión |
|---|---|---|
| [P3747-PLVE](https://www.axis.com/dam/public/51/8d/8c/datasheet-axis-p3747-plve-panoramic-camera-en-US-506195.pdf) | Cuatro canales5MP2592×1944/20fps;3.18–7.42mm,H90–40°,V71.5–30°; PTRZ,pan±180°,tilt−23..−150°,roll+5..−95°; varios streamsH.264/H.265/MJPEG,IR/WDR | C: cuatro perspectivas independientes, no panorama cosido |
| [P3737-PLE](https://www.axis.com/dam/public/2f/b5/98/datasheet-axis-p3737-ple-panoramic-camera-en-US-470471.pdf) | Alternativa cuatro sensores5MP | Sin ventaja medida frente aP3747 en este ensayo |
| [PNM-9085RQZ](https://www.hanwhavision.com/us/products/product-details/PNM-9085RQZ) | Hanwha:4×5MP/30fps,PTRZ4.13–9.4mm,H.264/H.265/MJPEG; página marcada discontinuado al consultar | Compatible, no seleccionado |
| [P3267-LVE](https://www.axis.com/dam/public/8a/0b/4c/datasheet-axis-p3267-lve-dome-camera-en-US-388254.pdf) | 2592×1944/25–30fps;3–8mm,H104–40°,V74–29°;pan±190°,tilt−10..80°,rotación±190°;WDR hasta120dB según escena,IR,streamsH.264/H.265/MJPEG | C1–C4 por resolución para recortes. Recortes digitales no son sensores adicionales |
| [P3265-LVE9mm](https://www.axis.com/dam/public/ae/0d/80/datasheet-axis-p3265-lve-dome-camera-en-US-487402.pdf) | 1080p,3.4–8.9mm,H100–36°,V53–20° | Alternativa de menor resolución ya comparada |

El perfil rectificado virtual1296×972 deriva K de FOV vertical/píxeles cuadrados. Distorsión cero describe el renderer, no una calibración de fábrica. Orígenes ópticos centrales coincidentes son una aproximación declarada; escala física no certificada. CapturaPBR nativa sinCameraFrame/jitter, sombras dinámicas ni emulación física de ruido/WDR/codec.2fps nominales de ensayo no equivalen a rendimiento en vivo.

## Editor y ajustes

`?cameraProfile=cctv-c` activa el perfil nuevo; `?perception=1` conserva el baseline. Editor con planta superior, frusta orientativos, selección de cabezal, soporteXYZ, giro/inclinación/FOV, ocho vistas, persistencia, exportación/importación. C desplaza sus cuatro orígenes conjuntamente; orientar un cabezal conserva los demás. Inventario/procedencia inmutables, intrínsecos recalculados. Conos no certifican visión a través de muros.

Generador reproducible: sin flags=candidato inicial; `--refine` eleva C y corrige S3, pero no resuelve el dintel; `--refine2` retira C, evita vegetación junto aC1 y colocaC2 dentro del vidrio posterior; `--refine3` conserva esos ajustes y retiraC3 a la esquina del lounge conFOV74° tras medir insuficiencia de escala en dos puntos. Poses iniciales/finales preservadas por sensor. No se elimina ni desplaza ningún obstáculo.

Inicial: C-S1/C2 fallaron calidad (desviación7.85/3.04). Elevar C1.15→1.50 no solucionó el dintel fijo hasta techo. Candidato2: ocho matrices e imágenes no planas; error máximo<0.000025px/origen<0.000002 unidades nativas. Las mediciones preliminares55/57 y57/57 de candidatos2/3 quedaron INVALIDADAS por el control de puertas cerradas: la profundidad transitoria se descartaba antes de copiarla. No son prueba de cobertura. C3 se retiró para mejorar su campo cercano, pero la cobertura debe medirse de nuevo. El adaptador nuevo `cctv-sequence.js` reutiliza PlayCanvas, el flujo de captura y el dummy existentes; difiere del helper histórico al crear texturas de profundidad explícitas. EnPlayCanvas2.23.3, `RenderPass.allocateAttachments` fija `storeDepth=false` para profundidad transitoria ytrue para `rt.depthBuffer`; el driver nativo puede invalidar el primer caso antes de copias externas. El helper histórico y sus resultados quedan intactos, con esta limitación descubierta. La prueba abierta declara puertas de seguridad abiertas SOLO en simulador; el control cerrado conserva las mismas poses y permite medir pérdidas por oclusión.

## Evaluación y reproducción

Un único dummy MIT reutilizado se coloca en puntos estáticos desordenados; no es el recorrido09.14. El evaluador compara frame real/fondo con un pase amodal privado que limpia profundidad. Ese pase y las poses nunca son inputs deENTITY. Utilidad de calibración:≥80px de altura,≥120px visibles,≥200px amodales en imagen, fracción visible≥0.35. La fracción está limitada al encuadre, no demuestra cuerpo completo. Interiores de cabinas cerradas se miden y documentan; accesos exteriores permanecen dentro del requisito de circulación.

```text
python scripts/spatial-simulation/perception/configure-cctv-profile.py --refine3
node apps/spatial-simulation/node_modules/vite/bin/vite.js build apps/spatial-simulation --base=/Entity/spatial-simulation/
P2_CCTV_NATIVE=1 P2_CCTV_EVIDENCE=refined3-editor-final node apps/spatial-simulation/tests/cctv-profile.mjs
python scripts/spatial-simulation/perception/check-cctv-calibration.py --label refined3-editor-final
P2_CCTV_NATIVE=1 P2_CCTV_PROBE_RUN=depth4-open node apps/spatial-simulation/tests/cctv-probes.mjs
python scripts/spatial-simulation/perception/evaluate-cctv-probes.py --run depth4-open
P2_CCTV_CLOSED=1 P2_CCTV_PROBE_RUN=depth4-closed node apps/spatial-simulation/tests/cctv-probes.mjs
python scripts/spatial-simulation/perception/evaluate-cctv-probes.py --run depth4-closed
python scripts/spatial-simulation/perception/summarize-cctv-gate.py
```

PreviewVite local5192; `P2_CHROMIUM` al navegador. PowerShell usa `$env:VARIABLE`;TEMP/TMP escribibles y cortos. Etiqueta nueva por ejecución. Frames/GT/máscaras detalladas en `.runtime/cctv-probes-<run>/`, fuera deGit; agregados y montajes sintéticos publicados. SHA de manifiesto/perfil identifican cada medición.

Pruebas ejecutadas:4tests del evaluadorPASS (ausencia, oclusión, escala, cambios fuera de referencia);11tests lógicaP2PASS; buildPASS con aviso dechunkgrande; contrato estricto456framesPASS medianteWSL (PythonWindows no tienejsonschema). Editor candidato2: guardas de metadatos superiores/anidados, recarga/restablecimiento y movimiento conjuntoPASS. Render nativoANGLE/D3D11IntelUHD disponible; candidato2 midió0.248–23.246s/captura, sin afirmación de tiempo real.

Gate técnico09.12SUPERADO: depth4-open ydepth4-closed incluyen456frames/57puntos cadauno.55/55puntos de circulación útiles; dos interiores de cabinas cerradas permanecen ciegos. Los ocho sensores tienen4–34puntos útiles con puertas abiertas y solapamientos conectados. Al cerrar seguridad,23casos sensor/punto pierden utilidad y el solapamiento se desconecta; no se inventa continuidad a través de puertas cerradas. Todas las comprobaciones de gate.jsonPASS; los dos manifiestos finales (912frames) pasan el contrato estricto enWSL. Las mediciones preliminares sin profundidad persistente permanecen invalidadas. Siguiente09.13;09.13–09.18 pendientes y aceptación humana final no presumida.
