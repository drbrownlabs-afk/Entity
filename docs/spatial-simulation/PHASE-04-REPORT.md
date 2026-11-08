> **Revisión actual del operador:** [Galería R1: jardín continuo, luz cálida y vidrio](REVIEW-PHASE04-REVISION.md) · [Maestro actualizado](../../simulation/spatial-office/output/office-phase04-revision.blend). Esta página conserva la entrega anterior para trazabilidad.

# Fase 04 — revisión de Blender, materiales, luz y tiempo

Fecha: 2026-11-08. Rama `codex/spatial-simulation`. **EN VALIDACIÓN para aprobación del operador.** Las fases 02–04 se verificaron internamente conforme al plan actualizado `8490e1a`, preservado junto con la revisión posterior `d51e2b9` (solo instrucciones de acceso para la futura Fase06). No se inicia PlayCanvas (05), personajes Mixamo (06) ni exportación definitiva del edificio.

## Qué se entrega

- **[Maestro actual office-phase04.blend](../../simulation/spatial-office/output/office-phase04.blend)**, conservando arquitectura C, agrupación E, cafetería, lounge, cabinas, baños y lockers.
- [Galería para revisar horarios y luces](REVIEW-PHASE04.md), [plano C con IDs](evidence/phase03/layout-with-ids.svg).
- **[Device manifest](../../simulation/spatial-office/output/device-manifest.json)**: 54 luminarias, 17 circuitos, 19 puertas, ocho lockers y cinco pantallas. Cada luz tiene ID, ambiente, posición/transformación, tipo, potencia de render nominal, color/temperatura nominal, estado, nivel y modo auto/manual. No son potencias medidas ni dispositivos físicos confirmados.
- [Inventario completo](../../simulation/spatial-office/output/phase04-full-inventory.json), [estado inicial](../../simulation/spatial-office/output/initial-visual-state.json), [configuración de sol/reloj y transferencia](../../simulation/spatial-office/lighting-config.json).

Las zonas A–E, reuniones, recepción, espera, cafetería, social/recreación de cafetería, pasillos, lounge, ambas cabinas, baños, lockers e impresión tienen circuito propio y control individual. Los emisores de barras/estantes también responden al estado: no quedan como materiales artificialmente luminosos inmutables. Sol/cielo se mantienen separados de las luces conmutables. Las pantallas son dispositivos distintos y pueden seguir mostrando su contenido aunque se apaguen luminarias.

## Qué se probó realmente

**486 comprobaciones PASS**, [resumen](evidence/phase04/summary.json), [asertos](evidence/phase04/checks.json).

- Todas las luminarias: OFF deja energía y emisión en cero; nivel 0,5 regula la potencia; otras luces mantienen su valor. Todos los circuitos: OFF y regulación de grupo sin perder los IDs individuales.
- Comandos inválidos/IDs desconocidos rechazados; snapshot inválido no aplica cambios parciales. Recuperación de estados/overrides y hora; reapertura del maestro restaura el estado inicial pausado.
- Reloj visual único de 24h: scrub, pausa, avance/retroceso a ±1×/±10×/±60×/±360×, wrap de medianoche y derivación reversible del sol. Interpolación de elevación continua comprobada en 241 puntos.
- Observador real configurable mediante **Astral 3.2**, probado con coordenadas sintéticas de QA, sin atribuirlas al edificio. Latitud/longitud del proyecto permanecen `null`: se usa una trayectoria artística explícita, no un sol georreferenciado inventado. Fecha, zona horaria y orientación son configurables.
- Panel y operadores de Blender registrados y ejecutados en pruebas headless: control de hora, circuitos y puertas. No se afirma una sesión GUI manual completa ni una prueba de navegador.
- Cinco materiales en una **prueba aislada de swatches**, exportados y reimportados por glTF oficial de Blender: base color, rugosidad, metalicidad, transmisión y textura de albedo. [Resultado](evidence/phase04/material-probe.json). Ese pequeño `pbr-transfer-probe.glb` no contiene geometría arquitectónica ni inicia la Fase05. No certifica equivalencia visual de PlayCanvas.
- El albedo procedural de terrazzo se hornea a textura pequeña empaquetada y con UV; **solo color de superficie, nunca iluminación**. Las luces artificiales continúan dinámicas. No hay lightmaps fijos contradictorios con OFF.
- Las matrices arquitectónicas de Fase03 se conservan: [comparación](evidence/phase04/architecture-preserved.json). Se sustituyen únicamente 13 lámparas de referencia no controlables por dispositivos identificados. No cambia la posición de muebles/puertas para mejorar fotos.

## Evidencia visual ejecutada

Diez renders Cycles reales: general a **08:00, 12:00, 16:00 y 20:00**, sala A a las 20:00 con todas/ninguna/una luminaria, lounge, cabinas y servicios. Para aislar la contribución de A, el resto de luminarias se mantiene OFF en esas tres capturas, con el mismo sol, cielo, cámara y exposición; las pantallas continúan separadas.

Brillo medio sRGB del render sin filtrar: **0,4902 todas ON → 0,2304 una ON → 0,0047 todas OFF**. Es una comparación de píxeles, no una medición de lux. Confirma cambio observable y ausencia de iluminación artificial horneada permanente. [Revisión y métricas](evidence/phase04/visual-review.json), [gate](evidence/phase04/gate.json).

La compilación de Blender no tiene OIDN integrado. Se conservaron los diez PNG originales y se generaron diez copias de revisión con **Open Image Denoise oficial 2.3.3**, filtrado de color sRGB sin añadir geometría. [Proveniencia, URL y SHA256](evidence/phase04/oidn-provenance.json), [parejas/hash y versiones](evidence/phase04/denoised/manifest.json). Descarga por HTTPS verificado, binario fijado por hash para reproducción; no se afirma un digest oficial vía API, cuyo acceso dio 403. El filtrado suaviza detalles finos; las imágenes crudas permiten contrastarlo.

## Cómo abrir y usar los controles

1. Abrir `office-phase04.blend` en Blender 4.3.2 o posterior.
2. En el editor de textos elegir **START ENTITY visual controls** y ejecutar ese texto. No se exige habilitar autoejecución global de archivos descargados.
3. En la vista 3D abrir la barra lateral con **N**, pestaña **ENTITY**. Cambiar hora y velocidad, Play/Pause, circuito, nivel y On/Off/Auto. Cada luminaria se puede conmutar aparte.
4. El selector de puertas permite previews locales de abrir/cerrar/bloquear/desbloquear. Esos botones cambian el estado inmediatamente; los clips de 30 frames se pueden inspeccionar con `doors.py`/línea de tiempo. Las dos cosas son pruebas visuales simuladas, sin controlar cerraduras físicas.

El reloj no modifica la hora del sistema, datos de sensores, reservas ni observaciones de cámaras. La recuperación por snapshot/reapertura se verifica; para conservar una edición propia de Blender hay que guardar su archivo, sin confundirlo con persistencia Core. El archivo inicial abre pausado a las 12:00 y las luces en modo auto.

## Reproducir en el entorno

```sh
python3 simulation/spatial-office/setup-lighting.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/build-phase04.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/check-phase04.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/inventory-phase02.py -- 04
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/probe-materials.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/render-phase04.py
python3 simulation/spatial-office/denoise-approval.py
```

Se requiere el maestro verificado internamente de Fase03. Setup se ejecutó con paquetes locales y hashes obligatorios, sin tocar dependencias del backend/frontend. Astral 3.2 (Apache-2.0), NumPy 2.3.5/Pillow 13.0.0 (sus licencias originales) y OIDN 2.3.3 (Apache-2.0). El binario/paquetes quedan en `.runtime/`, ignorados en Git; scripts, locks y hashes permiten reproducirlos. No se necesita GPU, servicio vivo, clave API ni hardware.

El servicio de borrador del entorno devolvió `INVALID_ARGUMENT` al leer y guardar `install_script`/`start_skill`; persistencia no confirmada. [Registro](evidence/phase04/configuration-status.json). Los pasos probados sí se guardan en el repositorio. No se afirma publicación del entorno ni validación en una instancia nueva.

## Límites y aprobación requerida

Dimensiones y distribución añadidas son estimaciones de diseño, sin escala métrica certificada. La vegetación/mobiliario siguen siendo representaciones simplificadas; no se afirma coincidencia fotográfica con las referencias. Las páginas externas de tipologías no fueron accesibles por el proxy y no se descargaron assets; las cinco imágenes adicionales mencionadas por el plan no están presentes. No se inventaron para completar evidencia.

No se modifican backend, frontend, Gaussian, handoff o evidencias originales. De los 578 archivos del snapshot histórico, 577 son idénticos; el plan restante fue actualizado externamente por el operador y se conserva exactamente en el commit `d51e2b9`, verificado por hash. No se ejecutó CI remoto ni se atribuyen pruebas históricas de otros servicios a este lote.

La transferencia a PlayCanvas es una **propuesta**: áreas de luz requieren equivalentes puntuales comprobados y comparación con estos renders; sol/cielo/exposición comparten parámetros y reloj; cualquier probe/lightmap excluye contribuciones artificiales conmutables. La equivalencia visual de runtime y la exportación definitiva quedan pendientes de autorización.

El plan vigente exige: **«Detenerse obligatoriamente al terminar la fase 04, antes de comenzar cualquier tarea de la fase 05»**. El operador debe revisar maestro C, horarios, materiales, dispositivos, accesos y límites antes de autorizar el visor. Ninguna fase se marca APROBADA por humano automáticamente; no se han iniciado Phase05/06 ni adquirido modelos Mixamo.
