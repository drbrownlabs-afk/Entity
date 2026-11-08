# Fuentes, reutilización y condiciones conocidas

| Recurso | Procedencia y versión | Uso y límites |
|---|---|---|
| Synthetic Office | argenzio, [escena a972d838](https://superspl.at/scene/a972d838), licencia registrada CC BY-NC 4.0 en `worlds/synthetic-office/manifest.json` | Reconstrucción derivada con atribución. Uso no comercial; no se presume autorización comercial. Las dimensiones no medidas siguen siendo estimaciones. |
| Handoff estructurado | `docs/spatial-simulation/`, fuente `40850d1`, base de trabajo `a037bb8` | 56 entradas, siete anotaciones, OBJ de 16.709 vértices/29.526 triángulos. Hashes originales verificados; no se reescribe ningún archivo fuente. |
| Capturas originales | `docs/evidence/phase09/survey/`, referencias de cada pieza en `layout.json` y reporte | Solo material ya suministrado. No se afirma semejanza exacta con las dos referencias adicionales de mamparas/cafetería que el plan menciona pero no adjunta en esta sesión. |
| Blender | 4.3.2, ejecutable `/usr/bin/blender`, proyecto oficial [blender.org](https://www.blender.org/), GPL | Modelado, modificadores, cámaras, formato `.blend` y Cycles CPU existentes. No se desarrolla renderer, simulador ni motor de geometría alternativo. |
| Python | 3.12.14, biblioteca estándar, [python.org](https://www.python.org/), PSF | Hashes, coordenadas, reproducción temporal y pruebas. Sin dependencias adicionales ni secretos. |
| Geometría nueva | `simulation/spatial-office/build.py`, `layout.json` | Primitivas editables y materiales procedurales. Se elige composición de Blender porque no hay malla segmentada original para reutilizar. No se descargan assets con licencias desconocidas. |

Los hashes de todos los archivos versionados de la base se registran en `docs/spatial-simulation/evidence/phase01/protected-files.json`. La licencia del programa Blender no sustituye la licencia de los datos de origen. La atribución se conserva también dentro del archivo maestro.
