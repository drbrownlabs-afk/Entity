# FASE 09 — ENTITY Spatial Intelligence: Synthetic Office
Estado: PLAN AUTORIZADO PARA EJECUCIÓN AUTÓNOMA 09.1–09.9; implementación no iniciada por este documento.
Escenario: https://superspl.at/scene/a972d838
Continuidad: fases 00–08, ENTITY Core/Edge/Experience, contratos existentes. No borrar ni reemplazar el centro comercial anterior.

## Objetivo de producto
Demostración integral de un centro de trabajo computable: Gaussian Splat realista en dollhouse, personajes, cámaras CCTV, reservas, ocupación, flujos, sensores, climatización, energía, mantenimiento, seguridad, memoria persistente, consultas de IA situada, explicabilidad y escenarios hipotéticos. Todo comparte UNA simulación, UN reloj y el modelo ENTITY (entidades, estado, relaciones, eventos, memoria y capacidades). No construir nueve demos independientes ni un dashboard decorativo.

## Experiencia integral y casos narrativos
- 08:00: preparación basada en reservas, iluminación y HVAC.
- 09:15: llegadas; Luis aparece en CAM-01 y CAM-02 y en el gemelo, accede a DESK-03; diferencia entre identidad autorizada, track anónimo y presencia inferida; no-show de reservas.
- 10:30: reunión de seis personas; sala ocupada, agenda, ventilación, CO2 y confort.
- 11:20: reunión extendida, conflicto de reserva, alternativa, notificación y acción registrada.
- 14:00: avería HVAC, temperatura de zona, puestos/personas/reservas afectados, propuesta de reubicación, ticket de mantenimiento, efecto después de acción.
- 16:00: evento de seguridad por discrepancia entre zona/horario/autorización; CCTV, investigación y evidencias.
- 18:30: salida, ahorro energético, uso histórico, resumen de jornada.
- Exploración libre: seleccionar cualquier persona, puesto, sala, zona, cámara o equipo; ver estado, relaciones, fuentes, historial, reservas y acciones.
- Consultas: ¿Dónde está Luis ahora? ¿Dónde estaba a las 10? ¿Qué pasó hoy aquí? ¿Qué reunión hay a las 16 y 18? ¿Por qué subió la temperatura? ¿Qué cambió desde ayer? ¿Qué equipos y reservas afectó la incidencia?
- Escenarios what-if: cierre de zona, avería HVAC, ocupación inesperada; comparar impacto antes de ejecutar sin contaminar la línea temporal principal.

## Arquitectura no negociable
1. El gemelo digital permanece visible/accesible en TODOS los modos; CCTV en grid con ampliar cámara y alternar foco cámara/dollhouse; sincronización bidireccional de entidad, zona, selección y tiempo.
2. PlayCanvas renderiza la escena, las cámaras y personajes GLB/GLTF animados; Blender solo para preparar assets dinámicos si hace falta, NO para rehacer edificio ni generar colisiones.
3. SuperSplat y splat-transform para optimización SOG/Streamed SOG, anotaciones 3D, voxels y colisiones; utilizar flujo existente/oficial. El acceso a herramientas alojadas puede exigir autorización; no afirmar que se ejecutó si no ocurrió. Inspeccionar el sitio mediante sus vistas y anotaciones, sin volver a pedir benchmarking general del entorno. Adaptar cantidad y tipo de recursos al espacio real; no inventar salas inexistentes.
4. Segmentación por prompts opcional y no bloqueante: si es viable, aislar mobiliario; si no, inventario semántico mediante anotaciones SuperSplat con IDs, coordenadas y metadatos. No inventar un sistema paralelo de anclajes.
5. Conectores CCTV, acceso, reservas, sensores/HVAC y mantenimiento separados, con observaciones sintéticas y contratos intercambiables por integraciones reales; Core agnóstico de render, cámaras y proveedores.
6. Personajes y cámaras usan el mismo estado y reloj, no vídeos inconexos. La correlación entre cámaras requiere evidencia; identidad personal proviene de fuentes autorizadas, no reconocimiento facial supuesto.
7. Memoria de Core: eventos duraderos, snapshots y tracks consultables tras reinicio. Reconstrucción histórica de estados, relaciones, personas, cámaras (observaciones disponibles), logs y métricas. Diferenciar vídeo, reconstrucción e interpolación.
8. IA situada consulta datos reales de la simulación/Core con procedencia y tiempo; no respuestas hardcoded por frase. Acciones autorizadas, resultados y explicaciones auditables. Simulación what-if aislada del estado oficial.
9. Fase MVP: reglas y relaciones explícitas, no motores avanzados de inferencia latente, geodésica, 4DGS en vivo, re-ID biométrico ni multiagente sofisticado.
10. Publicación estática puede funcionar en modo autónomo claramente rotulado; no afirmar persistencia compartida del Core cuando solo exista estado local. Mantener la opción de conexión al Core real.

## Subfases y puertas de calidad (gate automático)
### 09.1 — Espacio computable
Implementar Synthetic Office, calidad web, dollhouse/interior, colisiones voxelizadas, navegación, cámaras y anotaciones SuperSplat. Inventariar escritorios, mesas, salas reales, pasillos, accesos, zonas, sensores y equipos con IDs estables.
Gate: escena carga, se navega sin atravesar paredes/suelo en rutas principales; IDs seleccionables y ubicados correctamente; capturas/evidencia de cámara y anclajes; no regresión viewer anterior.

### 09.2 — Mundo simulado compartido
Reloj determinista, personas ficticias animadas, rutas, entradas/salidas, ocupación, simulación de conectores y eventos Core.
Gate: pausa/reinicio/replay deterministas; posición de personaje coincide en vistas y estado; eventos con timestamps; tests de sincronía.

### 09.3 — Seguridad y CCTV
Grid, fullscreen, cambio a gemelo, selección sincronizada, cobertura, accesos, alertas y tracking no biométrico.
Gate: persona atraviesa dos cámaras y dollhouse sin divergencia; alerta justificada por observación + autorización; histórico recuperable.

### 09.4 — Reservas, agenda, ocupación y flujos
Puestos/salas, check-in, no-show, conflictos, extensión, reasignación, circulación y densidad.
Gate: reserva cambia disponibilidad; ocupación no equivale automáticamente a reserva; conflicto y resolución producen eventos y estados coherentes.

### 09.5 — Confort, energía y mantenimiento
Sensores sintéticos por zona (temperatura, humedad, CO2, iluminación), HVAC, energía estimada, equipos, fallos y tickets.
Gate: fallo HVAC afecta solo dependencias espaciales pertinentes, crea ticket, identifica reservas/personas afectadas y permite resolución auditada.

### 09.6 — Memoria persistente y timeline
Snapshots/eventos/tracks; reconstrucción por tiempo; filtros por entidad/zona/evento; logs y cámaras históricas; métricas históricas.
Gate: reinicio no borra datos persistidos en Core; scrubbing restaura estado/relaciones/eventos correctos; ausencia de vídeo se rotula correctamente.

### 09.7 — IA situada y explicabilidad
Consultas sobre presente/pasado/causas, navegación desde respuestas, evidencia, acciones autorizadas y confirmación de resultado.
Gate: respuestas derivadas de datos y con fuente; ubicación desactualizada se declara desconocida; prueba de denegación, timeout y trazabilidad.

### 09.8 — Simulación hipotética y análisis
Cierre de zona, avería, sobreocupación; propagación por relaciones explícitas; comparación antes/después; utilización histórica y recomendaciones.
Gate: rama what-if no modifica el historial principal hasta acción confirmada; impactos reproducibles, justificados y consistentes.

### 09.9 — Experiencia integrada y entrega
Interfaz premium desktop/móvil con gemelo persistente, modos Seguridad/Operaciones/Reservas/Flujos/Mantenimiento/Memoria/IA/Escenarios; optimización, documentación y publicación autorizada.
Gate: flujo completo Luis → cámaras → puesto → HVAC → reasignación → memoria → consulta; CI/regresión, pruebas E2E, demo publicada si permisos, capturas y reporte final.

## Política de ejecución AUTÓNOMA — autorización explícita del operador
Esta Fase 09 se autoriza como UNA SOLA TAREA que abarca 09.1–09.9. Al terminar cada subfase:
A. ejecutar tests, lint, build y pruebas E2E pertinentes y revisión visual cuando aplique;
B. comparar resultados contra criterios de aceptación observables;
C. si falla, depurar, crear test de regresión, corregir y repetir hasta superar el gate;
D. registrar evidencia verificable, limitaciones y decisiones en docs/PHASE-09-PROGRESS.md y bitácora existente;
E. hacer commit/push en la rama autorizada conforme al flujo del repositorio;
F. CONTINUAR INMEDIATAMENTE con la siguiente subfase, SIN solicitar aprobación ni detenerse para revisión humana intermedia.
No marcar subfases APROBADAS por el operador: usar VERIFICADA AUTOMÁTICAMENTE con evidencia. La Fase 09 global queda EN VALIDACIÓN hasta revisión humana final.
Si un proveedor externo/servicio/hardware no está disponible, usar un adaptador simulado equivalente y registrar la diferencia; continuar lo demás. Si existe bloqueo real no eludible (credenciales/permisos/costo/destrucción de datos o imposibilidad técnica), documentar la causa y completar las subfases independientes; detenerse solo donde sea imprescindible, sin fingir éxito.
No detenerse en 09.1 ni terminar la tarea antes de 09.9 por comodidad, token budget o falta de feedback; si la sesión termina, dejar checkpoint durable con siguiente paso exacto para retomar. Ningún AGENTS.md genérico debe interpretarse como una exigencia de aprobación entre 09.x: esta autorización es específica de Fase 09.
No aprobar ni fusionar automáticamente cambios que requieran autorización adicional según protección de ramas. La entrega final requiere pruebas observadas y enlace a rama/PR/commit, no afirmaciones.

## Referencias y continuidad
Leer AGENTS.md, GOALS.md, PLANS.md, docs/CODEX-OPERATING-MODEL.md, docs/ENTITY-MASTER-SPEC.md, docs/EDGE-INTEGRATION-SPEC.md, docs/DECISION-LOG.md, docs/PROJECT-STATUS.md y docs/AGENT-WORKLOG.md. Inspeccionar implementación actual y ramas de fases 07/08; no asumir que main contiene lo más reciente. Reutilizar PlayCanvas, Core, conectores, tests y CI existentes. Si 07/08 no están fusionadas, trabajar desde la base que contenga implementación más reciente sin borrar avances, documentando la rama base.
