# P2-09 — captura y percepción sobre el coworking existente

Plan vigente: `docs/P2-09.1-CAMERAS-VMS-SPEC.md`. Los gates y resultados se registran en los archivos de estado/bitácora existentes y en `docs/spatial-simulation/evidence/p2-09/`.

El adaptador de captura se activa únicamente con `?perception=1` en el visor PlayCanvas existente; conserva geometría, mobiliario, materiales y las interacciones normales cuando no se activa. No hay un segundo visor ni un Core nuevo. Las cámaras virtuales referencian los IDs previstos de P2-08.4; una cámara virtual no es equipo instalado.

Fuentes: documentación oficial de Raspberry Pi en su repositorio GitHub, fijada por commit/checksum en `public/perception/cameras.json`; comparación de módulos comerciales normal, Wide y HQ. La óptica virtual rectificada y la resolución/FPS efectivos se distinguen de las máximas del sensor. Distorsión física, ruido, obturador, fusión HDR y H.264 no se simulan como si estuvieran calibrados. La hipótesis inicial de dos panorámicas180 se reconsidera según cobertura y detalle: nunca se usa una perspectiva ordinaria como una panorámica180.

`prepare-core.py` y sus pruebas son P2-08, no generan observaciones de visión. Los guiones y cualquier posición del dummy quedan del lado del simulador/evaluador. Una detección debe provenir de píxeles y un seguimiento de detecciones temporales; ningún resultado se obtiene de nombres, IDs, poses o trayectorias del actor.

Dependencias locales preparadas: Python venv `.runtime/p2-vision-venv`, ONNX Runtime CPU1.23.2, OpenCV4.11.0.86, Norfair2.3.0. YOLOX nano preentrenado de Megvii, ONNX oficial: https://github.com/Megvii-BaseDetection/YOLOX/releases/download/0.1.1rc0/yolox_nano.onnx (Apache2.0; evaluación de precisión pendiente antes de09.5). La inferencia no requiere PyTorch/GPU; PyTorchCPU se utilizó después exclusivamente para exportar el modelo deapariencia.

El dummy temporal candidato CesiumMan, Cesium2017, CC-BY4.0, se descarga sin login del repositorio Khronos glTF Sample Assets; el logotipo no concede derechos de marca. No sustituye los personajes definitivos de06/07. Ese candidato ya fue validado como baseline; el fixture vigente Rocketbox y los resultados completos se describen abajo.

Reproducción de geometría: `python scripts/spatial-simulation/perception/audit.py`. Configuración fuente: `python scripts/spatial-simulation/perception/configure.py --source-checkout <checkout>` (requiere checkout local de documentación oficial fijada). Captura de prueba: compilación estática/preview en5192, `node apps/spatial-simulation/tests/perception-capture.mjs`. Validación de parámetros/PNG: `python scripts/spatial-simulation/perception/check_cameras.py`, seguida de inspección visual. No cerrar gates por generar archivos.

## Circuito verificado P2-09 (2026-11-09)

Gates y métricas ejecutados: `docs/spatial-simulation/evidence/p2-09/09.9/integrated.json`. Estado técnico09.1–09.9 completado, **EN VALIDACIÓN**, no aceptación humana ni inicio10. El fixture vigente usa temporalmente `validation-person.glb`, MicrosoftRocketbox/MIT ya existente enP1; se conserva fuenteoriginal sin cambios y el anteriorCesium como baseline. No son personajes definitivos06/07 ni se vinculan aPersonCore.

Preparación reproducible en entorno de pruebas:

```sh
python -m venv --system-site-packages simulation/spatial-office/.runtime/p2-vision-venv
simulation/spatial-office/.runtime/p2-vision-venv/bin/python -m pip install -r scripts/spatial-simulation/perception/requirements.txt
python scripts/spatial-simulation/perception/download-models.py
# Solo si necesita regenerar el modelo de apariencia ONNX:
simulation/spatial-office/.runtime/p2-vision-venv/bin/python -m pip install -r scripts/spatial-simulation/perception/requirements-export.txt
simulation/spatial-office/.runtime/p2-vision-venv/bin/python scripts/spatial-simulation/perception/prepare-reid.py
```

Captura: build del visor existente con base `/Entity/spatial-simulation/`, preview estático desde `apps/spatial-simulation` en5192 (no HMR), después `node apps/spatial-simulation/tests/perception-sequence.mjs`. P2_SHORT_SEQUENCE=1 hace solo un ensayo pequeño de una cámara, **no** supera el gate de secuencia completa. El cache exige escenario/reloj/luminarias/puertas estáticos; las puertas de seguridad se abren expresamente en el escenario visual y todos los puntos pasan CollisionWorld. Ningún evento de apertura/check-in se manda alCore. Comprueba igualdad exacta del cuadro vacío; inicializa skin matrices antes de medir altura y conserva transformaciones originales del GLB. El perfil nativo de captura omite posprocesado/sombras dinámicas y no sustituye el perfil arquitectónico de máxima calidad.

El evaluador `check_sequence.py` valida esquema, fingerprints/timestamps y movimiento; genera etiquetas SOLO en `.runtime/p2-09-evaluation`. Nunca montar ese directorio ni el workspace completo en un worker. `run-isolated.sh` monta únicamente librerías,código del adaptador,PNG,calibración,modelos y salida; aísla red y PID. `P2_VISION_WORKER=detect|mot|mtmc` selecciona etapa. Para inferencia: YOLOX-S→Norfair→OSNet-AIN512D. El preprocesado de los binariosYOLOX descargados es rawBGR0..255; helpers antiguos bajo el tag tienen otra normalización y se descartaron por controlpositivo. Todos los modelos se fijan porSHA, no se entrenan desde cero.

Con P1 real ya aprovisionado y credenciales privadas generadas por la preparación08, iniciarAPI8092 sobre `.runtime/p2-core.sqlite3` y permitir CORS del preview5192. `validate-pipeline.sh` ejecuta píxeles→detección→MOT→MTMC→HTTP/P1; fuera de un sandbox externo que impida namespaces, sin desactivar aislamiento. Reutiliza sede `coworking-p2`, run `p2-09-vision`; si cambia el manifest, elegir run nuevo mediante `ingest-core.py --run` y conservar el anterior. No recrearCore ni sobrescribir otras sedes. Repetir el mismo corpus devuelve251 duplicados y no cambia revisión. Credenciales no están enGit.

Revisión en el mismo visor: `?perception=1` habilita seis cámaras virtuales y enlaces a grabacionesMP4. Para consultar el ensayo enP1, `?perception=1&coreRun=p2-09-vision`, conectar a una API autorizada; el selector permite volver a onboarding sin cambiar el run activo global. Track es anónimo, con evidencia/hash/confianza y relaciones provisionales; no es persona civil ni autorización deacceso. La APIHTTPS deproducción sigue pendiente: GitHubPages aloja el visor y las grabaciones, noSQLite/backend.

Métricas del ensayo:246 imágenes/20s/6cámaras,89 cajas verificadasIoU.50, recall porvista53.94%; combinación devistas observa39/39 instantes visibles delúnico actor. Cinco asociaciones unen cuatro cámaras; quedan3 fragmentaciones extra. Son hipótesis visuales, no conteo depersonas. CPU:~3.82 imágenes/s para pipelinebatch completo, insuficiente para2FPS simultáneos en6fuentes. Cámara05 recorta y06 ofrece poco detalle. No validación multipersona, hardware físico, móvil físico, GPU, RTSP/ONVIF/VMS ni reconstrucciónRGB3D por estos resultados.
