# P2-09.19 — Evidencia del diagnóstico, no cierre del gate causal

**Actualización tras «aceptado» del operador:** propuesta autorizada; implementación causal optativa en validación. Los párrafos del diagnóstico original que indican «no se inicia refactorización» son históricos. El gate actual mantiene falsas las demostraciones de16FPS sostenidos y fuente virtual integrada; no autoriza avanzar de fase.

`causal-development.json` conserva intentos intermedios, incluidos descartes, retrasos y la primera regresión con umbral incorrecto0.10. No usarla como paridad con la política congelada0.25. `raw-capture-probe.json` conserva la comparación nativa: PNG/BGR exactos en8sensores, BGR binario más lento y gruposPNG insuficientes para16FPS. La aprobación no es evidencia de funcionamiento.

El worker `entity_edge.causal_pixels` recibe únicamente envelopes de píxeles porstdin; Bubblewrap no monta frames futuros, workspace/evaluador o red. El productor de replay sí conoce el manifiesto y libera imágenes progresivamente; nunca entrega ese manifiesto al worker. El evaluador `evaluate-causal-cctv.py` se ejecuta después de `status=done`, fuera de ese aislamiento. Las colas de transporte son16/16frames y la decodificación tiene2frames. El modo `--lossless` aplica contrapresión para probar calidad y registra el retraso de liberación; no cuenta como fuente real a16FPS.

Reproducción del incremento, desde raíz, con los entornos ya preparados (elegir un run nuevo para conservar intentos):

```powershell
wsl -d Ubuntu-24.04 -u root -- /opt/entity-p2/api-venv/bin/python scripts/spatial-simulation/perception/replay-causal-cctv.py --run p2-09-causal19-example --corpus accept18-v0 --seconds 125 --core --lossless
wsl -d Ubuntu-24.04 -u root -- /opt/entity-p2/api-venv/bin/python scripts/spatial-simulation/perception/evaluate-causal-cctv.py --run p2-09-causal19-example --corpus accept18-v0
node apps/spatial-simulation/tests/diagnose-causal-capture.mjs
```

El replay inicia y cierra un proceso propio del P1 sobre la SQLite original, añade un run, verifica replay exacto y hashes de mundos previos. No es otro Core. Credenciales, frames, observaciones completas, SQLite y logs quedan privados en`.runtime`. La consulta de localización distingue imagen y mundo; contrato/tiempos/alias y límites se explican en el diagnóstico actualizado. Cambios compartidos en`services/entity-api` y`services/entity-edge` pertenecen aP1; escenas/ensayos aP2. La recuperación completa Edge y el gate sostenido todavía no están demostrados.

Diagnóstico y propuesta: [documento de revisión](../../../../P2-09.19-CAUSAL-PERCEPTION-DIAGNOSIS.md).

| Archivo | Medición real | Límite |
|---|---|---|
| runtime-probe.json | 64 frames/160 llamadas YOLOX y32 recortesOSNet CPU/CUDA, mismos pesos | No es inferencia continua ni prueba completa de calidad. OpenCV 2 hilos / ORT 2; FP32,TF32 desactivado; sin NMS global final en el probe detector. |
| capture-probe.json | 24 capturasRGB tras calentamiento, renderer Intel registrado | Fondos34.46 s y warmup fuera del periodo; serial, no ocho streams sostenidos. |
| core-readonly.json | SQLite original en modo ro, lecturas con actividad de aceptación | Descriptivo, no capacidad exclusiva. Sin copia ni modificación deDB. |
| core-readonly-after-acceptance.json | Mismas consultas después de terminar Core 09.18 | Conexión retenida y nueva; no atribuir toda la diferencia a connect(). |
| core-http-stage-probe.json |24 mensajes HTTPnuevos instrumentados en mismo P1/SQLite | Run diagnóstico separado y preservado,3instantes iniciales; etapas anidadas no se suman. |
| gate.json | Estado de diagnóstico/propuesta | Implementación y demostración causal todavía pendientes. |

No se accede a GT desde los probes de inferencia/Core. El probe de captura es código del simulador y solo exporta tiempos/renderer, no poses ni IDs. Los modelos verifican sus hashes; CUDA se comprueba por perfil de warmup. OSNet CPU/CUDA se compara sobre32crops reales del modelo, no etiquetas. La instrumentación HTTP se instala únicamente en un proceso propio, expone el resultado con autenticación de operador y cierra al terminar. Se guardó en RAM para no añadir E/S de trace a cada petición; las trazas crudas permanecen privadas.

Reproducción desde la raíz (entornos09.10 ya instalados):

```powershell
wsl -d Ubuntu-24.04 -u root -- bash scripts/spatial-simulation/perception/diagnose-cctv-runtime.sh
wsl -d Ubuntu-24.04 -u root -- /opt/entity-p2/api-venv/bin/python scripts/spatial-simulation/perception/diagnose-core-readonly.py
wsl -d Ubuntu-24.04 -u root -- /opt/entity-p2/api-venv/bin/python scripts/spatial-simulation/perception/diagnose-core-http.py
# Preview local5192 y navegador nativo configurados como en 09.14:
node apps/spatial-simulation/tests/diagnose-capture.mjs
```

El benchmark de modelos usa Bubblewrap con frames de accept18-v0 y pesos locales, sin workspace/evaluador/red. No instala ni cambia drivers. El probe HTTPcrea un run nuevo con24 mensajes de frames ya inferidos, comprueba mundos previos y no crea otro Core/DB. El primer intento guardó sus24 mensajes pero no extrajo trace por el comportamiento de SIGTERM de Uvicorn; se conservó y se repitió con extracción autenticada antes del cierre. No se usan esos datos fallidos para inventar métricas.

Los resultados no demuestran saturaciónGPU,16 FPS sostenidos, causalidad, calidad multipersona ni despliegue físico. Son evidencia para aprobar o revisar la propuesta. No se inicia refactorización sustancial,12 personajes, P3 ni integraciones externas. La aceptación de 09.18 y de P2-09 sigue pendiente; el roadmap939b241 requiere además09.19.
