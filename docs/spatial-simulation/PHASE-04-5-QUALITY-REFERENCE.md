# Fase 04.5 — Referencia visual sin restricciones de optimización móvil

**Estado:** especificación de ejecución para Codex; no implica que las tareas estén ejecutadas.
**Rama exclusiva:** `codex/spatial-simulation` del repositorio `drbrownlabs-afk/Entity`. No trabajar en `main`, no fusionar ramas ni modificar Core, Gaussian u otras aplicaciones.

## Objetivo

Establecer la máxima calidad visual viable del coworking **en PlayCanvas**, usando Blender/Cycles como referencia, **antes** de imponer presupuestos de rendimiento móvil. La prueba debe separar defectos de conversión PBR, iluminación, reflejos y ajustes de rendimiento. No asumir que quitar optimizaciones equivale a igualar Cycles.

## Procedimiento obligatorio

### A. Asegurar una línea base reproducible

1. Verificar rama activa y registrar commit inicial. Identificar maestro Blender, scripts de exportación, GLB, assets, código de render y capturas actuales.
2. Conservar el maestro original y la configuración actual del visor. Crear un **perfil de calidad de referencia** independiente y reversible, sin eliminar funcionalidades ni optimizaciones estructurales inocuas.
3. Fijar **una sola condición de iluminación: Golden Hour, aproximadamente 17:00**. Ajustar esa condición **en Blender y en PlayCanvas**; usar misma cámara, encuadre, estados de luminarias, exposición y balance de blancos. No implementar otros horarios en esta fase.
4. Capturar métricas iniciales: resolución real de pantalla, escala de render, límites de texturas, formatos, compresión, anisotropía, sombras, reflejos, tone mapping, antialiasing y tiempos de carga. No deducir calidad a partir de tests unitarios.

### B. Auditar la transferencia Blender → GLB → PlayCanvas

1. Comparar los materiales **en tres puntos**: maestro Blender, GLB exportado y material cargado en PlayCanvas. Construir un inventario por material: albedo, normal, roughness, metallic, AO, emisión, alpha/transmission, clearcoat, UV, espacios de color, dimensiones de textura, mipmaps y transformaciones aplicadas en runtime.
2. Inspeccionar `simulation/spatial-office/transfer-materials.py`: comprobar que el atlas procedural de seis caras a 1024 px no altere escala, orientación, normal o detalle. Probar superficies representativas con una carta/material de control y acercamientos. Aumentar resolución o cambiar el método **solo si la comparación demuestra pérdida**.
3. Inspeccionar `simulation/spatial-office/export-phase05.py` y la carga del GLB: confirmar tangentes, normales, UV0/UV1, extensiones glTF, textura color sRGB frente a mapas lineales, y que los materiales no se sustituyan silenciosamente.
4. Revisar específicamente cristales, telas, maderas, metales, piedra, vegetación y acabados de mobiliario. Registrar diferencias **concretas por material** y su origen. No usar la iluminación como explicación universal.
5. No declarar éxito por el probe de cinco muestras de la Fase 04: fue una prueba de campos y reimportación, no de equivalencia visual en navegador.

### C. Calidad de iluminación y reflejos

1. En Blender, producir referencia Cycles Golden Hour con iluminación exterior/ambiental y artificial equilibradas; preservar una copia de parámetros de cielo, sol, exposición y estados.
2. En PlayCanvas, igualar primero iluminación ambiental/exterior y exposición. Después calibrar la iluminación artificial y la indirecta, sin incrementar arbitrariamente la luz global.
3. Auditar `bake-daylight.py` y `irradiance.js`: UV1, resolución/densidad de texeles por superficie, orientación y decodificación HDR, contribución solar, luz indirecta y duplicación de iluminación. Verificar techos y paredes además del suelo.
4. Revisar `reflections.js`: calidad/resolución de capturas, entorno, box projection, materiales transparentes y actualizaciones. Incrementar resolución para el perfil de referencia y medir el efecto.
5. Conservar control independiente de luminarias/circuitos y coherencia OFF/ON. La calidad de referencia no autoriza hornear de forma fija la contribución de luces conmutables.

### D. Desactivar únicamente restricciones visuales, de manera reversible

- Desactivar límites móviles de resolución interna, degradación adaptativa, reducción de calidad de sombras/reflejos, sustitución de materiales y reducción de resolución/compresión de texturas **cuando existan**, documentando dónde se aplicaban.
- Mantener instancing, batching y otras optimizaciones que no alteren el resultado visual; si se sospecha un defecto, demostrarlo con una comparación A/B antes de cambiarlas.
- Permitir consumo elevado de VRAM y menor FPS en un **perfil de escritorio de máxima calidad**, registrando las cifras reales. Evitar límites ficticios de rendimiento o cambios globales permanentes.
- No sobrescribir los assets originales ni eliminar el perfil actual. El modo de referencia debe ser seleccionable y reproducible.

### E. Validación y entrega

1. Comparar **las mismas cámaras** en Blender y PlayCanvas: vista general de lounge y acercamientos de cristal, metal, tapicería, madera y techo. Incluir imágenes lado a lado a resolución nativa, sin retoque posterior.
2. Ejecutar pruebas A/B independientes: (a) materiales, (b) iluminación, (c) reflejos, (d) restricciones visuales. Cambiar una categoría a la vez para identificar la causa.
3. Registrar por cada problema: evidencia visual, archivo/función responsable, modificación, resultado antes/después y limitaciones restantes. Distinguir mejoras verificadas de hipótesis.
4. Conservar IDs, geometría, colisiones, puertas, controles de luminarias y circuitos. Comprobar funcionalidad básica tras cada cambio.
5. Entregar perfil de máxima calidad, comandos reproducibles, capturas comparativas, tabla de diferencias y métricas (resolución, VRAM, FPS, tamaño de descarga). **No declarar equivalencia con Cycles sin demostrarla visualmente.**

## Criterio de aceptación

La fase termina cuando existe una referencia PlayCanvas de máxima calidad reproducible y comparada visualmente con Blender en Golden Hour; se han auditado las pérdidas de exportación PBR y los ajustes de render; cada discrepancia importante está corregida o documentada con evidencia; y la escena mantiene sus interacciones. La aprobación visual final corresponde al operador. **No iniciar optimización móvil ni nuevas condiciones horarias hasta esa revisión.**

## Relación con las fases

Esta es una **fase correctiva entre la 04 y la 05**, ejecutada sobre los resultados ya existentes de ambas. No obliga a rehacer Blender ni supone que la 04 haya fallado. El trabajo de la Fase 05 puede conservarse; la fase 04.5 establece la referencia de calidad contra la cual se evaluarán posteriores optimizaciones.

## Addendum vinculante — iluminación transferible (operador, 2026-11-09)

La referencia debe diseñarse desde Blender para ejecutarse también en PlayCanvas. No se acepta una imagen Cycles cuya solución de iluminación no tenga representación definida en el runtime.

Antes de calibrar o producir capturas de aceptación, exportar una condición compartida 17:00: fuente, unidades, geometría emisora, transformaciones, RGB lineal, estados, exposición y cámara. Documentar la equivalencia y los límites de sol, ambiente, directa, indirecta, sombras, reflejos y PBR. Golden Hour es una condición artística del proyecto; no implica ubicación solar geográfica certificada.

- Sol: misma dirección y color; la energía radiométrica de Blender no se identifica directamente con intensidad/lux de PlayCanvas. Resolver transferencia mediante contribución precalculada o calibración documentada sobre superficies de control.
- Ambiente: exportar por separado las contribuciones difusa y especular del mundo de Blender. Un HDR urbano global no sustituye silenciosamente un cielo Nishita ni sus reglas de rayos.
- Directa: preservar geometría y orientación de emisores. Luces de área LTC son una representación disponible, pero el factor anterior W/120 no es una equivalencia acreditada y queda excluido del criterio de aceptación.
- Indirecta: generar datos Golden Hour desde el mismo estado compartido. Las bases de mediodía no acreditan equivalencia a las 17:00. Para conmutación, conservar contribuciones separables y validar respuesta de cada fuente; un promedio por circuito no acredita respuesta espacial individual.
- Sombras: registrar qué oclusión está precalculada y cuál es dinámica. Puertas/dispositivos móviles no deben dejar sombras fijas incompatibles con su estado.
- Reflejos: probes HDR locales con box projection y actualización coherente con estados; distinguir aproximación de transporte especular de equivalencia demostrada.
- PBR/color: conservar albedo y mapas lineales, UV, tangentes, parámetros físicos y transformación de salida común; no corregir una diferencia de transporte alterando arbitrariamente el material.

Criterios adicionales del gate: configuración compartida exportada y consumida por ambos motores; inventario explícito de componentes; demostración visual A/B con cámara, hora, estados y exposición idénticos; discrepancias corregidas desde su origen o documentadas con evidencia. Las primeras capturas iniciadas antes de este addendum son diagnósticos, no aceptación. Mantener perfil máximo y dejar optimización móvil para después. Aprobación visual exclusiva del operador.
