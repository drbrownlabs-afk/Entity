# Snapshot de decisión — P2-09: cámaras como sensores y continuidad de identidad
Fecha: 2026-11-09. Rama: codex/spatial-simulation.
Tipo: snapshot **documental comparativo**, no backup ejecutable ni prueba nueva.
Base comparada: `docs/spatial-simulation/snapshots/P2-09-2026-11-09-BASELINE.md`.

## Decisión expresa del operador
1. Las cámaras son **sensores espaciales**, no solo fuentes de vídeo: cada observación tiene cámara, instante, posición/orientación/FOV conocidos y región del mundo observable.
2. La identificación de seguimiento debe ser **persistente y lógica**, combinando ReID/rasgos visibles (ropa, silueta, proporciones, apariencia; rostro solo si existe base legítima y condiciones adecuadas) con topología del lugar, trayectorias, dirección, velocidad, tiempo y plausibilidad física. No equiparar identidad visual de seguimiento con identidad civil.
3. La red de cámaras tiene **orden lógico espacial definido por el operador**. El ejemplo 1→2→3→4→5 expresa vecindad y continuidad, no una regla de que los números deban recorrerse secuencialmente. Desde cámara 3, según dirección y conexiones reales, las candidatas pueden ser 2 o 4. No permitir saltos incompatibles con rutas/tiempos. Una transición no adyacente solo se considera si existe ruta físicamente viable y evidencia suficiente, con incertidumbre explícita.
4. Mantener hipótesis de identidad durante huecos sin imagen, **sin inventar observaciones**. La ausencia en una cámara con cobertura y detector fiables aporta evidencia negativa graduada, no certeza de ausencia. Cuando hay múltiples candidatos, conservar hipótesis y evitar fusiones arbitrarias.
5. En simulación PlayCanvas la posición/rotación de cámara se conoce por el motor en el mismo marco del gemelo; derivar extrínsecos y, de la proyección/óptica simulada, intrínsecos. No requiere calibración física de cámaras reales. Lentes panorámicas/distorsión requieren modelado matemático correcto. No confundir geometría exacta del simulador con detecciones privilegiadas: percepción solo por imágenes.
6. **Human-in-the-loop primero:** el operador colocará y orientará personalmente las cámaras. Prioridad inmediata: mostrar las seis vistas virtuales actuales, vista superior y controles de posición/orientación/FOV en visor PlayCanvas; persistir y recalcular registro espacial automáticamente. No reubicar cámaras ni declarar configuración aprobada sin revisión del operador.
7. **Después** de aprobar ubicación/cobertura, validar percepción y evaluar stack de ReID+MTMC (incluidas opciones NVIDIA ya consideradas previamente), fusión de evidencia y continuidad; no sustituir componentes ni comenzar nueva investigación repetitiva por defecto.
8. Rendimiento CPU del entorno Codex no equivale a capacidad de producción con GPU. Diferenciar calidad perceptiva de benchmarks de infraestructura.

## Comparación con último snapshot
| Dimensión | BASELINE anterior | Decisión nueva / delta |
|---|---|---|
| Control de instalación | Agente determina ubicación y cantidad 6–8 por análisis | Operador decide posiciones y aprueba visualmente; seis existentes primero, 6–8 sigue como rango posible |
| Calibración | Calibrar cámara↔gemelo y sincronización | En escena virtual registro espacial derivado directamente de transforms/proyección; sincronía y óptica siguen verificándose |
| Cámara | Captura de píxeles y cobertura cruzada | **Sensor espacial** con vecindad, región observable, transiciones y evidencia positiva/negativa |
| Identidad | Detección→MOT→ReID/MTMC por apariencia, tiempo y geometría | Continuidad lógico-predictiva y topológica explícita; múltiples hipótesis, persistencia y restricciones de rutas |
| Validación | Dummy y gates autónomos | Gate humano previo para aprobar instalación de cámaras; no autoaprobar ubicación |
| Stack | NVIDIA opcional; selección técnica pendiente | ReID+MTMC NVIDIA ya fue considerado; no tratar como descubrimiento nuevo; comparar alternativas solo tras inspección y evidencia |
| Estado de ejecución | Sin MOT/MTMC acreditado al crear BASELINE | Worklog posterior registra 09.1–09.9 implementadas y gate técnico PASS, pero P2-09 **EN VALIDACIÓN**; no implica aprobación de ubicación ni robustez multi-persona |
| Métricas | Sin mediciones | Worklog posterior: 246 imágenes, 89 detecciones/165 oportunidades (53.94% recall por vista), cámara 05=4 y 06=1, 4 hipótesis para 1 actor, 3.82 imágenes/s CPU agregado. Métricas históricas, no reejecutadas aquí |

## Orden operativo inmediato
A. Exponer cámaras reales del simulador en visor existente, vistas sincronizadas y plano superior, sin moverlas automáticamente.
B. Permitir ajustes manuales y persistencia; recalcular pose/proyección y grafo de vecindad conforme a geometría y recorridos válidos.
C. Esperar aprobación visual del operador para posiciones y cobertura.
D. Repetir pruebas con imágenes reales renderizadas y evaluar asociación visual+espacial+temporal, primero un actor y luego varios; medir errores y rendimiento en hardware representativo.

## Límites y trazabilidad
- Esta decisión **complementa y precisa** la planificación de P2-09; prevalece sobre cualquier interpretación anterior que autorizara al agente a aprobar por sí solo la colocación de cámaras. La autonomía para desarrollo y pruebas se mantiene; el gate humano de ubicación es excepción expresa.
- No cambiar P1/P3, no crear otro Core, no alimentar percepción con ground truth, no afirmar cámaras físicas ni identidad civil.
- Fuentes: snapshot BASELINE, docs/P2-09.1-CAMERAS-VMS-SPEC.md, docs/AGENT-WORKLOG.md, instrucciones expresas del operador en conversación 2026-11-09.
