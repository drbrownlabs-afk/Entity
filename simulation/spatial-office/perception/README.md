# P2-09 — captura y percepción sobre el coworking existente

Plan vigente: `docs/P2-09.1-CAMERAS-VMS-SPEC.md`. Los gates y resultados se registran en los archivos de estado/bitácora existentes y en `docs/spatial-simulation/evidence/p2-09/`.

El adaptador de captura se activa únicamente con `?perception=1` en el visor PlayCanvas existente; conserva geometría, mobiliario, materiales y las interacciones normales cuando no se activa. No hay un segundo visor ni un Core nuevo. Las cámaras virtuales referencian los IDs previstos de P2-08.4; una cámara virtual no es equipo instalado.

Fuentes: documentación oficial de Raspberry Pi en su repositorio GitHub, fijada por commit/checksum en `public/perception/cameras.json`; comparación de módulos comerciales normal, Wide y HQ. La óptica virtual rectificada y la resolución/FPS efectivos se distinguen de las máximas del sensor. Distorsión física, ruido, obturador, fusión HDR y H.264 no se simulan como si estuvieran calibrados. La hipótesis inicial de dos panorámicas180 se reconsidera según cobertura y detalle: nunca se usa una perspectiva ordinaria como una panorámica180.

`prepare-core.py` y sus pruebas son P2-08, no generan observaciones de visión. Los guiones y cualquier posición del dummy quedan del lado del simulador/evaluador. Una detección debe provenir de píxeles y un seguimiento de detecciones temporales; ningún resultado se obtiene de nombres, IDs, poses o trayectorias del actor.

Dependencias locales preparadas: Python venv `.runtime/p2-vision-venv`, ONNX Runtime CPU1.23.2, OpenCV4.11.0.86, Norfair2.3.0. YOLOX nano preentrenado de Megvii, ONNX oficial: https://github.com/Megvii-BaseDetection/YOLOX/releases/download/0.1.1rc0/yolox_nano.onnx (Apache2.0; evaluación de precisión pendiente antes de09.5). No se descarga PyTorch/GPU para este circuito CPU.

El dummy temporal candidato CesiumMan, Cesium2017, CC-BY4.0, se descarga sin login del repositorio Khronos glTF Sample Assets; el logotipo no concede derechos de marca. No sustituye los personajes definitivos de06/07. Incorporación e imágenes con dummy se validan en09.4, no se declaran implementadas por preparar el recurso.

Reproducción de geometría: `python scripts/spatial-simulation/perception/audit.py`. Configuración fuente: `python scripts/spatial-simulation/perception/configure.py --source-checkout <checkout>` (requiere checkout local de documentación oficial fijada). Captura de prueba: compilación estática/preview en5192, `node apps/spatial-simulation/tests/perception-capture.mjs`. Validación de parámetros/PNG: `python scripts/spatial-simulation/perception/check_cameras.py`, seguida de inspección visual. No cerrar gates por generar archivos.
