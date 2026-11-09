# ENTITY / Proceso 2 — memoria técnica: cámaras RGB y proyección 3D multivista

**Fecha:** 2026-11-09
**Estado:** línea de investigación posterior, documentada; no implementada ni validada.
**Fuente operativa:** docs/P2-09.1-CAMERAS-VMS-SPEC.md y docs/DECISION-LOG.md. Este archivo desarrolla la investigación; no sustituye la especificación de P2-09.

## Configuración de cámaras del laboratorio
- Estudiar **6 a 8 cámaras en total**, sin número cerrado. El agente debe decidir y justificar cantidad, ubicación, orientación, altura y montaje tras auditar la geometría real de PlayCanvas.
- Hipótesis inicial: dos panorámicas 180° en extremos opuestos del corredor, más cuatro a seis cámaras convencionales distribuidas entre entrada, kiosco/recepción y circulación. No asumir que esta disposición es óptima antes de medirla.
- Comparar cámaras comerciales concretas y documentar óptica/proyección, FOV, resolución efectiva, FPS, distorsión, exposición, compresión y montaje.
- Priorizar solapamiento útil entre vistas, continuidad de seguimiento, densidad de píxeles por persona, oclusiones y sincronización temporal. Calibrar intrínsecos, extrínsecos y transformación al marco del gemelo.
- Distinguir cámaras de observación y tracking de cámaras adecuadas para reconstrucción multivista: **una panorámica 180° no sustituye automáticamente múltiples vistas geométricamente independientes**.

## Investigación de proyección y reconstrucción 3D
**Objetivo:** transformar observaciones RGB de varias cámaras calibradas en estimaciones espaciales coherentes con el gemelo, y estudiar representaciones dinámicas de personas y objetos (puntos, volumen o Gaussian Splatting dinámico) cuando los datos lo permitan.

Líneas técnicas:
1. **Registro 2D→3D:** calibración intrínseca/extrínseca, correspondencia cámara↔gemelo, proyección de rayos; intersección con suelo o superficies conocidas cuando proceda.
2. **Localización multivista:** sincronización de frames, correspondencia entre detecciones/tracks, triangulación geométrica de puntos observables, incertidumbre y validación frente a ground truth reservado al evaluador.
3. **Profundidad y geometría:** estudiar estéreo/multivista, estimadores monoculares de profundidad como ayuda no métrica, reconstrucción por siluetas/visual hull y límites ante oclusiones, reflejos y texturas.
4. **Representación dinámica:** investigar nubes de puntos temporales, reconstrucción volumétrica de humanos, 3D Gaussian Splatting dinámico y alternativas basadas en modelos humanos; analizar requisitos de cámaras, datos, compute y latencia.
5. **Integración con ENTITY:** el modelo computable de entidades/estados/relaciones/eventos/memoria es el Core; el gemelo 3D es su representación espacial. Registrar observaciones y estimaciones con procedencia, timestamps y confianza, sin confundir geometría visual con identidad verificada.

## Restricciones y criterios de evaluación
- **No prometer reconstrucción volumétrica fiable con solo 6–8 cámaras de vigilancia**: número, distribución, ópticas, visibilidad, sincronía y resolución pueden ser insuficientes para detalle corporal. Validar experimentalmente.
- RGB monocular no entrega profundidad métrica exacta por sí solo; reconstrucción multivista exige correspondencias y geometría calibrada.
- No pasar IDs, posiciones, trayectorias ni profundidad privilegiada del simulador al pipeline de percepción. Ground truth solo para comparación independiente.
- Evaluar cobertura angular, tasa de triangulación válida, error de reproyección/localización, continuidad temporal, tasa de oclusión, latencia, recursos y calidad de representación.
- No asumir NVIDIA, GPU específica, hardware físico o VMS como requisito de la etapa documental.
- El Core de ENTITY permanece SaaS centralizado; Edge eventual se limita a procesamiento local indispensable.

## Relación con la ejecución
- **P2-09.1–09.9:** auditoría, selección y calibración de cámaras, imágenes del dummy, detección real, MOT, re-ID/MTMC, integración Core y validación.
- **Investigación 3D avanzada:** registrada como continuidad posterior, **no es gate de P2-09** ni motivo para bloquear el circuito de percepción.
- Antes de implementarla, el agente debe presentar arquitectura experimental, datos requeridos, limitaciones y criterios medibles; no afirmar que está resuelta.

## Referencias internas
- docs/P2-09.1-CAMERAS-VMS-SPEC.md
- docs/spatial-simulation/snapshots/P2-09-2026-11-09-BASELINE.md
- docs/spatial-simulation/GEOMETRY-HANDOFF.md
- docs/DECISION-LOG.md
