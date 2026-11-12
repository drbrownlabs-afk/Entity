# P2-09.19 — Evidencia del diagnóstico, no cierre del gate causal

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
