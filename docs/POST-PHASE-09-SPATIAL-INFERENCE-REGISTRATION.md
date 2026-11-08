# ENTITY Spatial Intelligence — diseño acordado para implementar después de Fase 09
Fecha: 2026-11-07. Estado: **diseño y backlog, NO implementado ni probado**. Activación: una vez terminada y validada Fase 09. No interrumpir ni ampliar el alcance de sus gates actuales.

## Intención arquitectónica
ENTITY no es un visor ni una colección de conectores: el Núcleo mantiene un modelo computable compartido de entidades, estado, relaciones, eventos y memoria. El gemelo digital es su representación espacial y también la referencia geométrica para registrar cámaras y evaluar hipótesis de movimiento. La inferencia contextual inicial **sí** debe implementarse tras Fase 09; no posponerla indefinidamente bajo la categoría de investigación avanzada. La investigación posterior (campos latentes, relaciones geodésicas profundas, propagación causal compleja y multiagentes) sigue fuera de este incremento.

## Flujo de observaciones y asociación multicámara
1. Cada cámara produce detecciones y tracks locales con timestamp, source_id, frame_id, embeddings de apariencia/ReID (si están autorizados), confianza, coordenadas de imagen y, si existe, profundidad. No identificar civilmente a una persona por un track.
2. Un motor MC-MOT/ReID genera candidatos de continuidad entre cámaras usando apariencia (ropa, silueta y otras características). Reconocimiento facial solo si existe fundamento jurídico, consentimiento/política y evaluación de privacidad; no es requisito del MVP.
3. Contrastar cada candidato con el Núcleo: última posición conocida, historial de tracks, dirección, velocidad, tiempo de transición, rutas transitables, puertas, zonas, cobertura de cámaras, estado de accesos, reservas y eventos. **Reserva o respuesta en app no prueba presencia física ni identidad.**
4. Rechazar hipótesis físicamente imposibles aun con alta similitud visual; mantener alternativas e incertidumbre si faltan evidencias. Evitar mezclar probabilidades calibradas con scores arbitrarios.
5. Conservar hipótesis versionadas con evidence_ids, fuentes, ventana temporal, estado (propuesta/confirmada/rechazada), puntuación/calibración y motivos de revisión. Corregir asociaciones sin borrar eventos originales ni reasignar identidad civil de manera automática.
6. Mantener separadas **observación** (lo reportado), **estado** (lo vigente/verificable) e **interpretación** (hipótesis), y distinguir presencia observada/inferida/confirmada/desconocida; TTL, late arrivals, duplicados, idempotencia, relojes y procedencia.
7. Los resultados del motor se incorporan mediante contratos y eventos del Núcleo; no crear un segundo mundo paralelo ni depender del visor para la lógica.

## Registro automático de cámaras al gemelo
Objetivo: procedimiento de instalación semiautomático que ubique/oriente cada cámara en un sistema de coordenadas métricas común, registre su campo de visión y permita transformar observaciones a la geometría compartida.
- **AprilTag 3:** anclas fiduciales de ID único, tamaño físico conocido y pose conocida en el marco del gemelo; detectar marcadores y estimar pose con PnP. Usar varios marcadores bien distribuidos para redundancia; la cifra orientativa 3–5 por ambiente es una hipótesis de instalación, NO un mínimo universal.
- **OpenCV ChArUco:** calibración intrínseca (focal, punto principal, distorsión), especialmente cuando el dispositivo carece de calibración fiable.
- **COLMAP/SfM:** relocalización sin marcadores mediante imágenes, características y poses originales de la reconstrucción; conservar paquete de reconstrucción junto al Gaussian Splat (imágenes/poses/features/mapa/escala). Un SSOG/PLY aislado no garantiza correspondencias ni escala métrica.
- **RGB-D/Orbbec + Open3D ICP:** obtener puntos 3D del sensor y refinar alineación con nube/geométrica de referencia; requiere buena pose inicial y geometría discriminativa, no confiar en ICP ciego con superficies repetitivas.
- Resolver y almacenar transformaciones T_world_camera, intrínsecos, distorsión, frames de coordenadas, unidades, convención de ejes, versión, error de reproyección, incertidumbre, cobertura y fecha. Un píxel RGB sin profundidad define un rayo, no un punto 3D único.
- **Sincronización temporal distinta de espacial:** NTP/PTP o timestamps sincronizados, medir offset y jitter, considerar latencia de captura/procesamiento. AprilTags no sincronizan relojes.
- Visualizar frustum y cobertura sobre el gemelo; verificar poses con referencias independientes y rechazar calibración dudosa. Detectar cámara movida; recalibrar/relocalizar. Los marcadores pueden retirarse tras la calibración si la cámara queda fija, con política de mantenimiento.
- Proceso guiado: conectar cámara → verificar intrínsecos → observar marcadores o relocalizar → resolver/refinar pose → verificar calidad → registrar cámara/anclas → emitir evento de calibración. No inventar coordenadas a partir del render.

## Integraciones y riesgos a validar
- Compatibilidad de drivers Orbbec/USB, RGB vs profundidad, sincronización y límites de rendimiento edge.
- IDs globales y namespaces por sitio/cámara/track; colisiones y reasociación errónea.
- Oclusiones, ropa similar, cambios de iluminación, trayectorias simultáneas y cámaras sin solapamiento.
- Ambigüedad espacial, escala/transformación del splat, topología de puertas/pasillos y cámaras movidas.
- Observaciones tardías, futuras, caducidad, pérdida de red, reintentos/Outbox, duplicación y contradicciones entre fuentes.
- Permisos multiempresa/sede y protección de embeddings/biometría, retención, acceso a vídeo y consulta del agente.
- Consistencia Core ↔ visor ↔ app ↔ kiosk; acción verificada solo cuando el dispositivo o proveedor confirma, no solo cuando el Core acepta el comando.

## Implementación incremental propuesta, posterior a Fase 09
A. Contratos de geometría/frames, anclas y calibración + pruebas sintéticas con poses conocidas.
B. Wizard de AprilTag/ChArUco, pose, incertidumbre, visualización del frustum y control de calidad.
C. Orbbec RGB-D real y registro de profundidad en marco común; pruebas de desplazamiento/recaptura.
D. MC-MOT/ReID modular (evaluar OpenVINO Multi-Camera Multi-Target Tracking, NVIDIA Multi-Camera Tracking y DeepStream MV3DT; comprobar licencia, compatibilidad GPU y costos antes de elegir).
E. Asociación contextual inicial con restricciones topológicas/temporales, eventos/memoria, hipótesis revisables y evidencia.
F. Pruebas adversas multicámara y E2E, incluyendo permisos, falsas asociaciones, reloj, desconexión y consistencia visual.
No afirmar que las cámaras están calibradas ni que ReID/contextual están implementados hasta demostrarlo con hardware y pruebas reproducibles.

## Referencias técnicas a evaluar
- AprilTag: https://github.com/AprilRobotics/apriltag
- OpenCV ArUco/ChArUco: https://docs.opencv.org/
- COLMAP: https://colmap.github.io/
- Open3D registration/ICP: https://www.open3d.org/docs/
- OpenVINO Model Zoo MC-MOT: https://github.com/openvinotoolkit/open_model_zoo/tree/master/demos/multi_camera_multi_target_tracking_demo/python
- NVIDIA DeepStream MV3DT: https://docs.nvidia.com/metropolis/deepstream/dev-guide/text/DS_MV3DT.html

## Instrucción de coordinación ChatGPT/Codex
Leer este documento al cerrar Fase 09 y planificar la fase siguiente con gates medibles; no ejecutar antes de su cierre. Registrar cada cambio, commit, pruebas y pendientes en docs/CHATGPT-CODEX-HANDOFF.md. Este documento captura las decisiones conceptuales de la conversación y no acredita código entregado.

## Extensión acordada — cámaras móviles registradas en el gemelo (2026-11-07)
Caso: guardia de seguridad utiliza ENTITY Mobile y su cámara de teléfono para aportar cobertura temporal en zonas sin CCTV fijo. Las cámaras existentes de un edificio se registran al gemelo sin sustituirlas; las cámaras móviles comparten el mismo marco geométrico, pero su pose cambia con cada instante.

**Arquitectura:** entidad MobileCamera/Device, operador y sesión autorizada; pose T_world_phone(t), orientación, intrínsecos, timestamp, precisión/covarianza, tracking_state, coverage/frustum, stream opcional, evidencia/procedencia. Registrar cada observación en el Núcleo y asociarla al estado compartido sin crear otro mundo. Diferenciar cobertura geométrica estimada de observación efectiva y de presencia confirmada. Video/embeddings solo bajo permisos, política de retención y consentimiento/base jurídica pertinente.

**Registro inicial:** localizar contra AprilTags con pose global conocida o contra mapa visual/SfM derivado de reconstrucción (COLMAP, correspondencias). ARCore/ARKit/VIO/SLAM ofrecen seguimiento local, pero sus coordenadas no coinciden automáticamente con el gemelo: resolver y verificar T_world_ARsession. No asumir que ARCore Geospatial VPS funciona en interiores privados. Se puede probar ARCore Cloud Anchors o ARKit ARWorldMap, con evaluación de conectividad, persistencia, soporte de dispositivo y privacidad.

**Seguimiento continuo:** teléfono estima pose con VIO; ENTITY transforma poses al marco del edificio, evalúa error y deriva, relocaliza periódicamente con anclas/mapa, detecta tracking perdido y degrada explícitamente la certeza. Sin profundidad, los píxeles son rayos, no puntos 3D; usar superficies conocidas, depth o triangulación para situar observaciones. Sincronizar timestamps vídeo/pose/observación y latencias; transporte WebRTC opcional para stream de baja latencia, nunca requisito para que Core reciba eventos.

**Escenario E2E posterior a Fase09:** guardia abre cobertura móvil, se autentica y autoriza, apunta a un marcador o zona conocida, ENTITY verifica pose y dibuja frustum en gemelo, transmite eventos/stream permitido, el guardia recorre pasillo sin cámaras fijas, el Núcleo actualiza cobertura temporal y evidencia, José ve la fuente móvil y el estado de localización; pérdida de tracking/conectividad suspende inferencias espaciales precisas sin falsificar ubicación. Validar móvil físico Android y, opcionalmente, iOS. No declarar implementado antes de prueba real.

**Referencias:** https://developers.google.com/ar/develop/anchors ; https://developers.google.com/ar/develop/java/cloud-anchors/developer-guide ; https://developer.apple.com/documentation/arkit/arworldmap .
