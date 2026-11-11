# Investigación independiente para el perfil CCTV posterior

Consulta de fuentes oficiales: 2026-11-11. Preparación documental independiente; no supera09.11/09.12 ni acredita instalación o cobertura. Referencia conceptual del operador: C central de cuatro cabezales, C1/C2 diagonales cruzadas del corredor, C3/C4 alas y transiciones. Solo geometría PlayCanvas y capturas pueden convertir esa idea en poses verificadas.

| SKU | Resolución y cadencia documentadas | Óptica y campo por sensor | Uso candidato |
|---|---|---|---|
| AXIS P3747-PLVE | Cuatro sensores; cada uno hasta2592×1944 a20fps; modo2560×1440 hasta25/30fps | 3.18–7.42mm; H90–40°, V71.5–30°; foco mínimo1.5m | C: cuatro vistas independientes, no panorama cosido |
| AXIS P3265-LVE, variante9mm | 1920×1080;25/30fps conWDR,50/60sinWDR | 3.4–8.9mm; H100–36°, V53–20°; foco mínimo0.5m | Alternativa convencional de menor carga de píxeles |
| AXIS P3267-LVE | 2592×1944;25/30fps | 3–8mm; H104–40°, V74–29°; foco mínimo1m | C1–C4: candidata con mayor resolución para recortes y transiciones |

Fuentes primarias:

- [P3747-PLVE, ficha oficial](https://www.axis.com/dam/public/51/8d/8c/datasheet-axis-p3747-plve-panoramic-camera-en-US-506195.pdf): flujos configurables H.264/H.265/MJPEG, WDR e IR. El máximo agregado resumido en una página comercial no sustituye los modos por sensor de la ficha. No se inventan streams a partir de una imagen360°.
- [P3265-LVE, ficha oficial](https://www.axis.com/dam/public/ae/0d/80/datasheet-axis-p3265-lve-dome-camera-en-US-487402.pdf): distingue variante9mm de22mm, por lo que no se mezclan sus FOV. Zoom/foco remoto, P-Iris y varios streams configurables H.264/H.265/MJPEG. Cadencia depende deWDR.
- [P3267-LVE, ficha oficial](https://www.axis.com/dam/public/8a/0b/4c/datasheet-axis-p3267-lve-dome-camera-en-US-388254.pdf) y [soporte oficial](https://www.axis.com/en-gb/products/axis-p3267-lve/support): streams H.264/H.265/MJPEG; ajuste mecánico pan±190°, tilt−10..80°, rotación±190°;WDR hasta120dB según escena, IR y corrección de distorsión disponibles. Dos recortes de una vista no equivalen a dos sensores físicos.

Elección provisional para ensayos: P3747-PLVE + cuatroP3267-LVE, por cuatro canales reales y margen de resolución en detalle. P3265-LVE queda como alternativa si las mediciones favorecen menor carga. No compra ni acceso a equipos físicos. Confirmar restricciones mecánicas por cabezal y montaje antes de fijar poses finales; la geometría nativa no tiene escala métrica certificada.

La simulación debe declarar sus límites: una perspectiva rectificada, reescalada o sin ruido/compresión/WDR físico no es emulación óptica completa. Calibrar matrices y resolución efectiva del renderer; no atribuir coeficientes de distorsión reales sin medición. Guardar procedencia, dispositivo/sensor/canal/stream por separado, poses iniciales/finales, densidad de píxeles, oclusiones y solapamientos. No cambiar el perfil histórico de seis cámaras.
