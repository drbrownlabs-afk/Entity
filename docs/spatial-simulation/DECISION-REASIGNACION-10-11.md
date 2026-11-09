# Decisión definitiva — Reasignación de antiguas fases 10 y 11
Fecha: 2026-11-08. Esta decisión prevalece sobre cualquier planificación contradictoria anterior.

## Proceso 1 — Software ENTITY
**Se cierra su planificación en Fase 09. No existe Fase 10 ni Fase 11 pendiente de ejecutar en este proceso.** El backend, frontend, API y Core existentes se reutilizan, no se reconstruyen. Los documentos históricos `docs/phases/PHASE-10.md`, `docs/phases/PHASE-11.md`, `PLANS.md` y `docs/PHASE-BOARD.md` pueden conservar sus referencias como archivo histórico, pero sus instrucciones de activación de fases 10 y 11 **quedan revocadas**.

## Proceso 2 — Gemelo digital + simulación y percepción espacial
**No termina en Fase 07.** Las fases 01–07 del plan `docs/spatial-simulation/IMPLEMENTATION-PLAN.md` son únicamente el bloque de construcción arquitectónica, PlayCanvas, personajes Mixamo y escena funcional. Continúa, en el MISMO proceso, con integración de cámaras y percepción.

**Se incorpora íntegramente aquí el alcance técnico de la antigua Fase 11 del Proceso 1**, sin heredar su número ni condición de ejecutar tras agentes:
- Camera Gateway y adaptadores para cámaras reales autorizadas (ONVIF, RTSP, NVR/VMS, USB/SDK según modelo).
- Selección de cámaras comerciales concretas y gemelos fieles de hardware, configuración, óptica, FOV, FPS, resolución, PTZ, calibración y cobertura.
- Vistas sintéticas generadas desde la MISMA escena 3D, con los aproximadamente 12 personajes humanos realistas seleccionados de Adobe Mixamo. Los dummies geométricos fueron descartados por simplificar artificialmente la reidentificación.
- Registro espacial de cada cámara; sincronización, observaciones, detección, tracking, asociación visual, ReID multicámara, TrackGlobal y trayectoria espaciotemporal.
- Inferencia contextual con rutas, tiempos, puertas, obstáculos, límites de velocidad y memoria; imposibilidades físicas prevalecen sobre parecido visual. Incertidumbre, hipótesis alternativas, métricas y evidencia.
- Separación estricta entre ground truth de simulación, observación e identidad inferida. No entregar ID interno del NPC al detector.
- Uso de contratos y servicios del ENTITY Core existente, sin crear otro backend.
**Gate de este bloque:** demostrar observaciones y seguimiento entre varias cámaras en un coworking 3D con personajes realistas, cruces y oclusiones, con métricas y procedencia. Distinguir virtual de dispositivo físico conectado.

## Proceso 3 — Inteligencia situada
**Se incorpora aquí el alcance de la antigua Fase 10 del Proceso 1**, sin reabrir aquella numeración:
- Agente ENTITY con OpenClaw como runtime a evaluar/usar conforme a su especificación histórica, no como nuevo Core.
- Capacidades existentes expuestas por API/SDK/MCP/herramientas; sesiones, roles, autorizaciones, memoria y acciones auditables.
- Agente situado sobre modelo del mundo compartido con evidencia espacial aportada por Proceso 2.
- Integración con aplicaciones empresariales **reales**: Google Drive, CRM, reservas y calendarios mediante APIs oficiales; no crear imitaciones de esos programas.
- Escenarios operativos y piloto tras verificar permisos, trazabilidad y límites.

## Precedencia documental
1. **Esta decisión** fija la reasignación de 10/11 y el alcance extendido del Proceso 2.
2. `PROCESOS-CANONICOS.md` es la descripción general de tres procesos; leerlo junto con esta decisión, que corrige cualquier frase que sugiera que el Proceso 2 termina en 07.
3. `IMPLEMENTATION-PLAN.md` conserva fases 01–07 como bloque 3D, no como fin del Proceso 2.
4. `MASTER-ROADMAP-08-15.md` queda **obsoleto y no ejecutable**: sus fases 08–15, orden y dependencias se revocan.
5. `docs/phases/PHASE-10.md` y `docs/phases/PHASE-11.md` son **especificaciones históricas de referencia**, no fases activas de Proceso 1.
No tocar `main`, no fusionar ramas, no declarar implementaciones completas sin pruebas y aprobación.
