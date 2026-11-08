# FASE 11 — ENTITY Spatial Intelligence: Camera Gateway y continuidad espacial multicámara
Estado: PLANIFICADA / NO INICIADA. Activar SOLO tras validación integral de Fases 09 y 10. Esta es una tarea secuencial para Codex, con subfases 11.1–11.9 y gates ejecutables. No confundir plan con implementación.

## Contexto y objetivo no negociable
Fases 00–08 aportan Core, contratos, Edge OpenCV/Norfair, conectores RTSP/MQTT, IA situada inicial, viewer PlayCanvas, simulación y CI. Fase 09 entrega el coworking con SSOG original, interfaz desktop/móvil, cámaras virtuales, personajes, reservas, recepción, memoria y operaciones sobre un Core compartido. La Fase 09 sigue EN CURSO: NO alterar su alcance ni interferir con su ejecución.
**Objetivo de Fase 11:** al observar una persona en CAM-01, luego CAM-02 y CAM-05, ENTITY debe conservar un TrackGlobal y una trayectoria espaciotemporal plausible, combinando **dos inferencias inseparables**: (1) ReID/MC-MOT por apariencia (ropa, silueta, embeddings y calidad de observación); (2) inferencia contextual contra el modelo del mundo (posición, rutas transitables, velocidad, tiempo, dirección, obstáculos, puertas, cobertura, estado de accesos, memoria y eventos). Un parecido visual alto NO vence una imposibilidad física. Cuando no haya evidencia suficiente, conservar hipótesis alternativas y estado desconocido. TrackGlobal NO es identidad civil ni reconocimiento facial.

**Tercer pilar igualmente obligatorio:** registrar cada cámara respecto al mismo sistema métrico del gemelo digital, con intrínsecos, pose, frustum, calidad y sincronización temporal. **Cuarto pilar:** Camera Gateway transportable para llegar a un edificio y conectar sus fuentes por protocolos/interfaz, no por marca. Orbbec es hardware personal opcional para pruebas, no dependencia de ENTITY ni requisito de despliegue.

## Reglas de ejecución de Codex — una sola tarea, gates secuenciales
1. Antes de iniciar: leer AGENTS.md, PLANS.md, docs/PHASE-BOARD.md, docs/phases/PHASE-09.md, docs/PHASE-09-PROGRESS.md, docs/POST-PHASE-09-SPATIAL-INFERENCE-REGISTRATION.md, docs/phases/PHASE-03.md, docs/phases/PHASE-06.md, docs/CHATGPT-CODEX-HANDOFF.md, inspeccionar árbol, ramas, APIs, contratos, tests, CI y dependencias reales. Respetar correcciones más recientes sobre inventario/SSOG y no crear un segundo mundo.
2. Activación: comprobar evidencia de cierre integral de 09 y autorización de arranque de 10. Si 09 sigue abierta, **solo mantener planificación**. No iniciar código de 10.
3. Una vez autorizada 10, ejecutar 11.1→11.9. Por cada subfase: implementar; ejecutar tests unitarios/integración/regresión y E2E/inspección visual pertinentes; comparar con el gate observable; si falla, diagnosticar, corregir, agregar regresión y repetir; registrar comandos, PASS/FAIL/NO EJECUTADO, logs/capturas, commit SHA, limitaciones y siguiente paso; commit/push según permisos; continuar a la siguiente subfase SIN esperar aprobaciones humanas intermedias. Subfases superadas = VERIFICADA AUTOMÁTICAMENTE; fase integral = EN VALIDACIÓN hasta aprobación humana final.
4. Si falta hardware, permisos o proveedor, usar fixtures/streams de prueba con el MISMO contrato, registrar límites y continuar gates independientes; NO afirmar pruebas físicas. Si un gate crítico no puede demostrarse, no marcarlo superado y no ocultar el bloqueo. Dejar checkpoint durable y retomar desde el primer gate sin verificar; no detenerse solo por terminar una sesión.
5. Reutilizar bibliotecas/SDKs/modelos maduros antes de escribir algoritmos. Core y viewer permanecen agnósticos de cámara, proveedor y motor de visión. Datos sensibles y credenciales fuera de Git. Mantener controles por organización/sede/rol, retención y auditoría.

## 11.1 — Auditoría de base, contratos y fixture multicámara
**Objetivo:** conocer exactamente qué reutilizar de 03/06/09 y definir el escenario de prueba sin construir duplicados.
**Implementar:** matriz de componentes reales y gaps; inventario de Camera/Stream/Observation/TrackLocal/Event; IDs por site/camera/session; fixture determinista de 3+ cámaras con dos personas de ropa similar, trayectorias reales conocidas, timestamps de captura, solapamientos y zonas ciegas; ground truth separado de las observaciones accesibles al motor. Contratos versionados para frames, detecciones, embeddings opcionales, track local/global, hipótesis, calibración y evidencia.
**Gate:** reproducir fixture dos veces con resultados deterministas; verificar que el Core conserva eventos, que la simulación y un archivo de video pasan por el mismo contrato, y que el ground truth no se filtra al algoritmo. Publicar mapa de reutilización y tests. No avanzar sin contratos.

## 11.2 — Camera Gateway: conexiones y onboarding
**Objetivo:** instalar ENTITY en un sitio sin depender de una marca de cámaras.
**Implementar:** gateway independiente de Core con manifiestos de adaptador, descubrimiento LAN ONVIF cuando aplique, conexión RTSP manual, fuentes NVR/DVR/VMS por stream o API disponible, plugins de API de fabricante, USB/UVC, archivo y video simulado; soporte de fuente móvil/WebRTC como extensión opcional. Fuentes analógicas requieren digitalización/DVR. Wizard de alta: descubrir/agregar→autorizar credenciales→probar stream→inscribir Camera/Stream→estado/salud→configurar retención/permisos. Manejar múltiples streams, reconexión/backoff, timeout, errores de autenticación, cambio de dirección, cola/idempotencia, credenciales protegidas y métricas. Distinguir compatibilidad comprobada de prevista.
**Gate:** registrar al menos una fuente automática o emulada por interfaz ONVIF, una RTSP y una fuente manual/archivo; comprobar alta/baja, reconexión, credenciales erróneas, caída de red y cambio de fuente sin modificar Core ni perder eventos. Validación real LAN/IP si hay acceso, separada de simulación. UI de configuración operativa, no solo CLI.

## 11.3 — Sincronización de relojes y registro geométrico
**Objetivo:** cada observación se ubica en el mismo tiempo y marco espacial del SSOG.
**Implementar:** timestamp de captura frente a procesamiento, offset/jitter, reloj simulado y sincronización NTP/PTP cuando aplique; intrínsecos, distorsión, T_world_camera, frames/ejes/unidades, FOV/frustum, error, incertidumbre, vigencia y versiones. Wizard guiado con AprilTag/ChArUco/PnP y alternativa de puntos manuales verificados; evaluar COLMAP/SfM usando imágenes/poses originales y RGB-D/ICP opcional. Un SSOG aislado no asegura escala métrica. Sin profundidad, el píxel es un rayo: intersectar con suelo/geometría conocida solo cuando sea válido, con incertidumbre. Detectar cámara movida y caducar calibración.
**Gate:** registrar 3 cámaras de fixture con poses conocidas; medir error de reproyección y posición contra ground truth; frustums coherentes sobre SSOG; cámara desplazada invalida pose anterior; desfase de reloj detectado. Prueba real cuando exista hardware autorizado. No inventar precisión.

## 11.4 — Percepción y tracking por cámara
**Objetivo:** detecciones y tracks locales robustos, reutilizando Edge y modelos existentes.
**Implementar:** conservar OpenCV/Norfair como baseline, comparar con detectores/trackers existentes mediante adaptadores; timestamps, bbox, pie de persona, calidad, oclusión, dirección, source_id, session_id, latencia y pérdida. No inferir presencia durante ausencia de detección. No asociar nombre civil.
**Gate:** pruebas de varias personas, cruces, oclusión, salida/reentrada, desconexión y cambio de fuente; IDs locales correctamente delimitados por cámara/sesión, resultados reproducibles, métricas y regresión Fase 03/09.

## 11.5 — ReID y asociación visual multicámara
**Objetivo:** producir candidatos de continuidad entre cámaras, incluso sin solapamiento.
**Implementar:** evaluar soluciones existentes OpenVINO MC-MOT, DeepStream/MV3DT y modelos ReID reutilizables según licencia/hardware; embeddings de apariencia, ropa/silueta, calidad, ventanas temporales, asociación global con conflictos uno-a-uno y manejo de varias personas similares. TrackGlobal separado de TrackLocal y Person. No reconocimiento facial obligatorio.
**Gate:** fixture CAM-01→02→05 produce candidatos visuales y un TrackGlobal cuando hay evidencia suficiente; prueba de personas similares y cruce no fusiona automáticamente; medir ID switches, fragmentación, falsas asociaciones y latencia. Este gate solo demuestra ReID visual, NO cierre de Fase 11.

## 11.6 — Inferencia contextual y validación física
**Objetivo:** decidir continuidad visual usando el modelo del mundo, no solo scores ReID.
**Implementar:** topología navegable (zonas, puertas, pasillos, pisos, escaleras, accesos, obstáculos), cobertura y calibración de cámaras, distancias/tiempos físicamente plausibles, dirección/velocidad, memoria de últimas observaciones, eventos de acceso y estados. Aplicar restricciones duras para imposibilidades; puntuaciones calibradas o reglas explícitas transparentes para evidencia blanda; no sumar arbitrariamente scores incomparables. Mantener alternativas y estados propuesta/confirmada/rechazada con evidencia, motivos, timestamps y versiones. Reservas o mensajes de app no demuestran presencia física. Asociaciones revisables sin borrar historia.
**Gate:** mismo sujeto CAM-01→02→05 con transición posible conserva TrackGlobal; sujeto muy parecido en cámara inalcanzable en tiempo dado es RECHAZADO; ausencia de ruta o reloj confiable resulta INCIERTO, no falsa confirmación. Tests de pisos, puertas, simultaneidad, cobertura incompleta y cambios de topología.

## 11.7 — Proyección en Core, memoria y gemelo digital
**Objetivo:** una sola fuente de verdad para cámaras, hipótesis, observaciones, trayectorias y experiencia.
**Implementar:** eventos inmutables, idempotencia, corrección/versionado de asociaciones, TTL, observaciones tardías, persistencia, permisos y trazas; exponer API de historial, track global, evidencia y salud/calibración. PlayCanvas muestra cámaras/frustums, cobertura, trayectoria observada vs inferida y zonas ciegas; selección sincronizada con CCTV, timeline y fichas. Viewer no calcula ni almacena la verdad de ReID.
**Gate:** seleccionar TrackGlobal desde CAM-01 y verlo en CAM-02/CAM-05 y SSOG; consultar evidencia y tiempos; reiniciar Core y reconstruir historia; simular corrección de asociación y comprobar que eventos originales permanecen. Tests de acceso denegado a video/embeddings entre roles/sedes.

## 11.8 — Robustez, rendimiento y despliegue transportable
**Objetivo:** funcionamiento sostenido con cámaras heterogéneas y fallos reales.
**Implementar:** perfilado CPU/GPU, elección edge/cloud, colas y backpressure, recuperación de cortes, rotación de credenciales, detección de cámaras movidas, fuentes sin profundidad, video tardío/desordenado, límites de almacenamiento/retención y aislamiento multi-sede. Wizard completo de instalación y diagnóstico. Cámara móvil con pose T_world_phone(t) como extensión independiente si es viable; no bloquear entrega principal.
**Gate:** ensayo prolongado reproducible con varias fuentes, desconexiones y recuperación, métricas de FPS/latencia/pérdidas/uso de recursos, matriz de compatibilidad real vs simulada, no regresión de 09 ni fuga de datos. Documentar límites sin prometer compatibilidad universal.

## 11.9 — Escenario integral, auditoría y entrega
**Objetivo:** demostrar la Fase 11 como producto integrado, no nueve demos.
**Escenario E2E:** alta de CAM-01/02/05 en gateway → registro geométrico y sincronización temporal → dos personas con apariencia parecida entran por distintas rutas → tracking local → ReID genera candidatos → modelo del mundo confirma una continuidad plausible y rechaza una imposible → TrackGlobal recorre zonas del coworking → SSOG/CCTV/timeline muestran observaciones y tramos inferidos → desconexión/reconexión de CAM-02 → historia y evidencia sobreviven reinicio → operador consulta «¿por qué crees que es la misma persona?» y recibe evidencia, incertidumbre y ruta, usando capacidades de IA situada existentes si están disponibles.
**Gate:** ejecutar CI/regresiones 00–09, E2E en desktop y móvil, revisión visual sobre SSOG original, tests adversos, permisos, reinicio y configuración de otra sede; publicar capturas, logs, métricas, reporte de compatibilidad y límites, commits y procedimiento reproducible. Fase global EN VALIDACIÓN para aprobación humana; no declararla aprobada automáticamente.

## Estado y bitácora
Crear/actualizar docs/PHASE-11-PROGRESS.md al activar, con tabla 11.1–11.9 (estado, evidencia/comandos, SHA, siguiente gate), reportar PASS/FAIL/NO EJECUTADO y mantener docs/PHASE-BOARD.md y docs/CHATGPT-CODEX-HANDOFF.md. La incorporación de este documento NO autoriza a Codex a abandonar la Fase 09 ni acredita implementación de Fase 11.

## Fuera de alcance
Nueva implementación del agente OpenClaw (entregada en Fase 10), agentes múltiples, reconstruir el SSOG, reemplazar Core, reconocimiento facial obligatorio, cámaras Orbbec obligatorias, investigación avanzada de campos latentes/geodésicos, 4DGS en vivo y funcionalidades comerciales no relacionadas. Referencia conceptual: docs/POST-PHASE-09-SPATIAL-INFERENCE-REGISTRATION.md.
