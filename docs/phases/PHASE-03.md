# Fase 03 — ENTITY Edge y percepción
Estado: EN VALIDACIÓN. Fase 02 APROBADA por declaración explícita del operador en esta tarea. Fase 04 NO INICIADA.

## Integración y alcance
Se hizo fetch y merge sin conflictos de main `1e6b29f`, incluyendo `cabd969`. Se conservan todos los commits de fases 00–02; no hay reset, reescritura ni eliminación de datos. La entrega está en `codex/phase-03-edge`. Las nuevas reglas de reutilización y pruebas sin hardware se aplican a este incremento.

### Evaluación previa de soluciones existentes

| Solución / procedencia | Evaluación real y decisión |
|---|---|
| OpenCV 4.11.0.86, https://github.com/opencv/opencv | Instalado y ejecutado. VideoCapture para captura/decodificación; HOGDescriptor con SVM de personas preentrenado incluido. Detectó personas en vtest.avi sin descargar pesos adicionales ni requerir GPU. Seleccionado para demostrador CPU. OpenCV publica licencia Apache-2.0; comprobar condiciones de cada recurso antes de distribución comercial. |
| Norfair 2.3.0, https://github.com/tryolabs/norfair/tree/v2.3.0 | README/licencia BSD-3-Clause consultados; instalado y ejecutado. Asociación euclidiana y filtro Kalman de la biblioteca; sin tracker desarrollado por ENTITY. Seleccionado. |
| Ultralytics YOLO y trackers, https://github.com/ultralytics/ultralytics | README oficial revisado: detección preentrenada y tracking disponibles, opciones de licencia AGPL/Enterprise. No instalado ni comparado en precisión. Sustituto futuro por adaptador; el demostrador ya funciona con la alternativa CPU ligera. |
| Frigate, https://github.com/blakeblackshear/frigate | README oficial revisado: NVR/OpenCV/TensorFlow/MQTT, recomienda acelerador. No desplegado: añade servicios innecesarios al objetivo actual de grabación local; opción de integración posterior. MIT según README. |

No se inventaron detectores, trackers, captura, renderer o motor de simulación. Código propio limitado a zonas, conversión de contratos, entidadización, coordinación y persistencia de entrega: son las brechas específicas de ENTITY. La fuente sintética es una secuencia fija de puntos de prueba, no un nuevo motor de simulación. NumPy, SciPy, FilterPy y dependencias exactas están fijadas en requirements.lock de Edge. Core mantiene su entorno separado y sin dependencias de visión.

## Arquitectura implementada
- `services/entity-edge/entity_edge/pipeline.py`: adaptadores VideoSource/OpenCV, HogPeople, TemporalTracker/Norfair, ZoneMapper/OpenCV y Outbox SQLite.
- `cli.py`: captura → detector → tracker → zonas → Observation v1 → FIFO → REST Fase 02. Las fuentes de vídeo/sintéticas usan los mismos contratos. Adaptadores reemplazables sin incorporar SDKs al Core. Orbbec sigue diferido; no se implementa ni se afirma compatibilidad SDK física.
- Coordenadas normalizadas de imagen y polígonos configurables en zones.json; usa punto inferior central de la caja, sin inventar coordenadas del mundo. En solapamientos gana el primer polígono. No calibración métrica.
- Identificadores por cámara y sesión; reapertura/rotura genera sesión nueva. No identidad personal ni entre cámaras. No se reportan predicciones sin detección presente como personas observadas; un miss produce pérdida/exit. Puede haber fragmentación/ruido, no se promete continuidad perfecta.
- Entrada/salida/cambio de zona en payload.transitions; pérdidas y desconexión vacían tracks. El hook --disconnect-frame inyecta una interrupción reproducible en vídeo o fixture; no representa una desconexión USB física. VideoSource reabre URLs interrumpidas con backoff y máximo tres reconexiones; en grabaciones finitas la lectura final significa EOF. La recuperación de stream se prueba con un adaptador de captura controlado, no con una cámara/RTSP real.
- Media timeline disponible como frame_index/media_time_seconds; observed_at es hora UTC de procesamiento/reproducción, NO la fecha original del vídeo. La secuencia fija puede reutilizarse para sincronización futura de Fase 07, sin crear otro mundo/simulador. No se ha implementado aún el visor 3D.
- Outbox FIFO SQLite: UUID/cuerpo conservados en disco, reintentos con backoff 1–60 s, borrado solo después de 2xx. 4xx permanece para diagnóstico, no se descarta. La entrega la impulsa cada frame o una nueva ejecución; no es un daemon. --outbox debe estar en almacenamiento persistente. Enrolamiento inicial necesita Core accesible; no se afirma bootstrap offline universal.
- Observaciones tipo edge.presence se validan/proyectan atómicamente en Core: Camera, PersonTrack, Zone, relaciones observedIn, posiciones, estados active, counts y salud. UUID de entidad derivado de cámara+track de sesión. Al perder una pista se conserva historia/entidad y pasa active=false; se retira su relación actual de zona. Snapshots antiguos siguen como eventos pero no rebobinan el estado actual. La proyección es genérica de ENTITY, sin importar OpenCV/Norfair.
- Se conserva schema DB 3: proyección usa tablas existentes. No se modifica el modelo/API de observaciones Fase 02; el contrato de payload lo define Snapshot en app/edge_projection.py. Estado/historia/persistencia se actualizan en la misma transacción que ingestión/deduplicación.

## Demostración reproducible

Desde raíz `/workspace/Entity`:

```sh
# Si Core aún no está preparado: bash scripts/setup-cloud.sh
bash scripts/setup-edge.sh
bash scripts/demo-edge.sh
```

setup-edge instala dependencias en .runtime/edge-venv (aislado), descarga fuera de Git el vídeo público OpenCV y verifica SHA-256. Fuente fijada:
https://raw.githubusercontent.com/opencv/opencv/9d4808bef88a7aacbb360732303d42b279ebb6b5/samples/data/vtest.avi
SHA-256: `45cddc9490be69345cbdab64ca583be65987e864ca408038e648db99e10516cf`.

No se incluyen vídeos, imágenes personales, pesos externos ni credenciales en Git. El vídeo se usa como muestra pública de evaluación; no se garantiza derecho de redistribuirlo o usarlo comercialmente. El script deja de ejecutarse si falla checksum/TLS; no se sustituyen verificaciones.

La demo arranca su propio Core local con token efímero, procesa fixture y 60 fotogramas del vídeo, produce observaciones/entidades, inyecta interrupciones, detiene/reinicia Core y verifica recuperación de mensajes y pérdida de ACK. Detiene solo su proceso. Deja bases y reportes en .runtime/edge-demo: simulation-report.json, video-report.json, summary.json y core.sqlite3. Puede repetirse con `bash scripts/demo-edge.sh --directory .runtime/edge-demo-otra`; por defecto reutiliza bases y se acumulan historiales, no borra datos.

Para un Core propio, CLI utiliza ENTITY_EDGE_TOKEN privado; requiere registry:write y observe:write. Mantener loopback y las limitaciones de autorización de Fase 02; rutas Core antiguas no tienen autenticación. No imprimir ni guardar tokens reales en Git.

## Resultados ejecutados
- Tests Core: 20/20 aprobados, 0 omitidos (última suite 4.006 s), incluyendo las 19 regresiones anteriores y proyección Edge: persona/zona/relación, deduplicación, rechazo atómico inválido, evento tardío, pérdida de pista. Prueba previa contó importaciones duplicadas del harness; corregida la importación, sin retirar los 19 tests originales.
- Tests Edge: 4/4 aprobados (0.103 s): Norfair mantiene ID en trayectoria y cruza zonas; pérdida/reinicio de sesión; outbox reabierta tras fallo; fuente inválida y zonas inválidas; reconexión a través de capture adapter controlado.
- HOG preliminar: seis frames del clip a pasos de 10 produjeron 2,2,5,4,3,5 cajas antes de umbral 0.5. Prueba práctica de modelo preentrenado, no evaluación de precisión/recall.
- Demo sintética: 20 pasos, 16 detecciones/tracks observados, 6 transiciones, pending=0.
- Demo vídeo: 60 frames, 181 muestras de detección/tracking, 68 transiciones, pending=0. NO son 181 personas únicas. En ejecución limpia se registraron 21 entidades temporales (incluidas fragmentaciones y sesiones de ambas fuentes), 62 eventos vídeo. Segunda ejecución conservó datos previos: 42 entidades acumuladas y 124 eventos vídeo.
- Recuperación HTTP real: Core apagado, envío falla, Outbox cerrada/reabierta; Core reiniciado, mismo mensaje entregado. Mensaje ya aceptado antes de perder ACK devuelve deduplicado; historial antes/después idéntico. summary.json: recovery/ack_loss_dedup/core_restart_persistence passed.
- scripts/setup-edge.sh ejecutado: instalación repetible, pip check correcto, checksum correcto.
- CI actualizado: job independiente instala Edge/Core, ejecuta tests y demo real; sube solo reportes numéricos, sin vídeo ni tokens. Resultado remoto no afirmado hasta poder consultarlo.

## Errores y limitaciones
Se corrigió un filtro inicial que consultaba age de la detección de Norfair y descartaba asociaciones válidas; ahora se comprueba que last_detection sea una detección del frame actual. Tests de continuidad/pérdida y demo aprobados tras el cambio. Detector HOG limitado a personas aproximadamente erguidas, sensible a escala/oclusiones; resultados no calibrados ni aptos para control crítico. Sin re-ID, biometría ni identidad entre cámaras.

Zonas son imagen, no plano físico. En grabaciones una lectura fallida se trata como EOF y no se distingue automáticamente corrupción de fin; fuentes en vivo tienen reintento limitado. No se valida RTSP/Orbbec física, GPU, carga sostenida, seguridad multiusuario ni recuperación ante corte eléctrico. Timestamps del cliente son confiados; reloj muy adelantado podría impedir actualizar hasta corregir el origen. SQLite local, listas sin paginación y permisos globales siguen siendo límites heredados.

No se avanzó Fase 04. Hardware real es subentrega diferida no bloqueante según PLANS.md actualizado. Próximo paso: revisión humana de esta evidencia.


## Entrega GitHub verificada
Implementación publicada: https://github.com/drbrownlabs-afk/Entity/commit/8baea3d95f185bc1df682ab0c74cae56310f0e88
Rama: codex/phase-03-edge. Fetch HTTPS a repositorio bare independiente confirmó SHA y árbol completo idénticos. merge-base confirmó ancestros 8f3815c, 001d2f8, 0506df4, cabd969 y 1e6b29f; trabajo previo preservado.

Build Docker con CA, start-local y smoke-docker ejecutados con la proyección nueva: correctos, volumen conservado y persistencia tras reinicio aprobada. compileall, pip check Edge y diff --check correctos. Descarga adicional desde URL fijada por commit confirmó el mismo checksum del vídeo. install_script/start_skill actualizados y guardados en borrador cloud (instalación Core+Edge y límite Fase 04); no se afirma publicación del snapshot.

PR intentado con gh pr create --repo drbrownlabs-afk/Entity --base main --head codex/phase-03-edge y body-file: Forbidden en api.github.com/graphql. Consulta gh api de Actions para la rama: Forbidden. Sin PR ni merge a main; CI remoto desconocido. No hay operación Git pendiente del operador. Requiere acceso API utilizable para que Codex pueda crear PR/consultar Actions; no se ha inferido la causa exacta del Forbidden. Fase 03 EN VALIDACIÓN, revisión humana pendiente; Fase 04 no iniciada.
