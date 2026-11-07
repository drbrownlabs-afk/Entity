# Fase 06 — Integración de fuentes existentes
Estado: EN VALIDACIÓN. Autorizada por operador; Fase 07 NO INICIADA. Commit base fc769b0, main sin cambios adicionales. Fases 00–05 preservadas.

## Qué se integró y qué se reutilizó

No se cambió código, esquema DB ni endpoints del Core. Los adaptadores nuevos viven en Edge y entregan Observation v1 a la entrada Fase 02 mediante la Outbox SQLite de Fase 03. La percepción sigue usando OpenCV HOG preentrenado/Norfair, sin detector/tracker/protocolo propios.

- MediaMTX 1.12.3 + FFmpeg: servidor RTSP y publicación H264 desde el vídeo público vtest.avi verificado por checksum en setup-edge. Transporte RTSP/TCP real en loopback; OpenCV recibe y procesa frames. MediaMTX https://github.com/bluenviron/mediamtx, licencia MIT consultada. FFmpeg instalado 7.1.5 en esta máquina, compilado con --enable-gpl/libx264; condiciones según build, no se redistribuyen binarios.
- Eclipse Mosquitto 2.0.22 + Eclipse Paho MQTT Python 2.1.0: broker real y cliente de protocolo existente. Paho callback API v2, MQTT 3.1.1, QoS1 y ACK manual después de guardar en SQLite. READMEs oficiales consultados. Paho: metadata EPL-2.0 OR BSD-3-Clause; LICENSE refiere EPL2/EDL1. Mosquitto: proyecto Eclipse, revisar sus condiciones EPL/EDL antes de redistribuir; imagen upstream sin código incorporado.
- HTTPX existente para polling REST de reservas. Servidor HTTP de fixture usa http.server de Python, sin framework/protocolo nuevo. Respuesta normalizada por lista blanca elimina campos ajenos/personales.
- ONVIF zeep (https://github.com/rospogrigio/onvif-zeep) y Frigate (https://github.com/blakeblackshear/frigate) evaluados documentalmente. Sin cámara/vendor autorizado no se presupone GetStreamUri, descubrimiento ni acceso NVR/VMS. Frigate puede aportar eventos MQTT/analítica en una instalación futura; no se desplegó ni se afirma compatibilidad del perfil de sensores con sus eventos.

Servidores Docker fijados por digest para reproducción:

```
bluenviron/mediamtx:1.12.3@sha256:3634a1eed1288b93e8d22ed74694eae96d483fcf676cac5d0c91830ad1b86b3d
eclipse-mosquitto:2.0.22@sha256:81a6193ae693942a3231cd3ac52875b02b7e3a19da671b2fb4b55cc874c5b279
```

## Adaptadores y perfiles

`entity_edge/integrations.py` contiene:
- measurement: id UUID, observed_at con zona, name, value finito, unit. Perfil temperature/C, humidity/percent, co2/ppm o presence/boolean. source_id/connector_id y bandera simulated los fija la configuración del adaptador, no el payload del sensor. Salida sensor.measurement. Valida tipo/unidades, no calibración ni precisión física. No se realizan acciones sobre sensores.
- MqttSensor: suscripción a topic exacto; topic ajeno ignorado. Callback abre conexión propia a Outbox (SQLite no comparte conexión entre hilos), guarda antes del PUBACK. Id/cuerpo repetidos llegan idénticos a deduplicación Core. Mensaje inválido registra error genérico sin copiar datos/credenciales y no confirma; se requiere diagnóstico/corrección del origen, no se pierde silenciosamente. Tamaño máximo 16k. Paho gestiona reconnect/backoff; se vuelve a suscribir tras conectar. TLS y usuario/clave opcionales mediante API cliente, verificación por defecto activa; no se validó TLS de hardware.
- reservation/poll_reservations: lista REST acotada a 1000; id, revision no negativa, status confirmed/cancelled, intervalo con zona y updated_at. UUID estable por conector/fuente/id/revisión. Misma revisión no duplica, contenido distinto con mismo ID se rechaza en Core; revisión nueva genera historia nueva. Normaliza todos los registros antes de encolar para evitar cola parcial por un registro inválido. No incluye campos de nombres/emails/clientes. El ID externo debe ser opaco; la lista blanca no anonimiza un identificador que ya contenga información personal.

No existe proyección materializada nueva para sensores/reservas: se consultan como eventos con procedencia y valores en GET events y evidence.events del agente. La respuesta textual de IA puede indicar que no hay estado materializado; no significa que no existan mediciones históricas. No se llama simulation.set_state para fingir estado físico. Vídeo sí conserva proyección Camera/PersonTrack/Zone/estado de Fase 03. No hay cambios Core específicos de proveedor.

## Demo reproducible

Desde /workspace/Entity, Core preparado:

```sh
bash scripts/setup-cloud.sh       # si Core no está preparado
bash scripts/setup-integrations.sh
bash scripts/demo-integrations.sh
```

Requiere Docker operativo, FFmpeg del sistema y Python 3.12. setup-integrations verifica herramientas, instala Edge desde lock y descarga imágenes por digest. No instala FFmpeg desde URLs arbitrarias; usar gestor oficial de sistema si falta. En CI ubuntu-24.04 se usa el FFmpeg disponible del runner.

La demo crea dos contenedores efímeros con puertos SOLO loopback y su Core local con token efímero. Sirve vtest.avi por RTSP/TCP usando MediaMTX/FFmpeg, sustituye la fuente virtual manteniendo el mismo Camera ID, procesa 30 frames, añade MQTT y reservas HTTP, prueba fallos/reintentos, consulta evidencia del agente controlado y detiene SOLO sus procesos/contenedores. Media real de prueba, datos de sensores/reservas ficticios. Nunca contactos CCTV ajenos ni claves reales. Observaciones terminan con EOF al finalizar el muestreo, no como diagnóstico del fin físico de una cámara.

Artefactos locales: .runtime/integrations-demo/core.sqlite3, outboxes por fuente, simulation-report.json, rtsp-report.json, report.json y services.log. Registros persistentes se conservan al repetir con IDs nuevos; broker/relay de demo son efímeros. No vídeos, bases ni credenciales en Git. Las imágenes respetan proxy/política; los protocolos de demo se ejecutan exclusivamente en loopback, sin rutas alternativas de Internet.

## Matriz de compatibilidad real

| Fuente/protocolo | Comprobado | Alcance/limitación |
|---|---|---|
| Fixture virtual → Observation v1 | Sí | Mismos endpoints/cámara que RTSP, datos simulated=true |
| RTSP/TCP H264 MediaMTX→OpenCV | Sí, protocolo real local | 30 frames del clip público por red, detección/tracking y eventos; no cámara física |
| Cambio de fuente sin modificar Core | Sí | Mismo Camera, contrato/tipos/proyección, dos procedencias; historial conserva ambos |
| Reconexión de stream OpenCV | Controlada en tests previos | No se cortó una cámara RTSP física; no garantía para todos los NVR/códecs |
| MQTT 3.1.1 QoS1 Mosquitto/Paho | Sí | Duplicado, broker restart/resuscripción, cola durable y caída Core; payloads ficticios |
| REST reservas HTTPX | Sí, fixture HTTP real | Repetición/revisión/cancelación y filtro de datos; no API de negocio autorizada externa |
| Consulta Core/agente | Sí | Sensor con 2 eventos y valor 25 C en evidencia; proveedor controlado |
| ONVIF discovery/GetStreamUri | No, documental | Falta dispositivo autorizado/credenciales/perfiles; candidato zeep |
| Frigate MQTT/eventos | No, documental | No confundir perfil telemetry con el payload propio Frigate; mapping futuro |
| NVR/VMS de terceros | No | Requiere fabricante, modelo, permisos y documentación; no compatibilidad universal |
| Orbbec/USB físico | No | Sigue diferido sin hardware |

## Evidencia y fallos corregidos
- 29/29 Core aprobados (4.583 s); 7/7 Edge (0.106 s), 0 omitidos. Tres tests nuevos con varios casos: IDs estables, privacidad, NaN/fecha inválida, REST 503/validación sin cola parcial, MQTT ACK después de persistencia y mensaje inválido sin ACK.
- Demo completa aprobada después de corregir arnés: fixture→RTSP en la misma Camera, 107 muestras de detección en primera ejecución correcta y 95 en última (NO personas únicas; el stream se captura en momentos distintos).
- Doble publicación de la misma medición MQTT: 1 evento. Broker reiniciado, cliente reconecta/resuscribe y envía nueva medición. Core detenido con cola pendiente; Outbox reabierta y entrega tras reinicio. Total 2 eventos de sensor, último valor 25.0 C.
- Poll REST repetido: una sola reserva inicial, revisión/cancelación nueva: 2 eventos. Consulta agente controlado trae referencias y valor exacto de medición.
- Primer intento falló en reconexión MQTT porque Docker reasignó el puerto publicado aleatoriamente al restart. Reproducción aislada confirmó 32771→32772. Arnés corregido a puerto host libre elegido explícitamente y estable; demo repetida y pasada. No se alteró el protocolo Paho para ocultar el fallo.
- GOP H264 por defecto obligaba a esperar ~25 s por keyframe; se configuró FFmpeg con GOP 10 para reducir espera. No cambia el detector.
- setup-integrations ejecutado, pip check sin conflictos, compileall/diff --check correctos. Sin migraciones/esquema nuevo, Core sigue en versión 5. CI ahora ejecuta también demo RTSP/MQTT/REST; conclusión remota se registra al verificarla.

## Roadmap de integraciones y restricciones
Modbus: evaluar pymodbus; BACnet: BAC0/bacpypes; OPC UA: asyncua; Zigbee: Zigbee2MQTT o Home Assistant; Matter: controlador existente de Home Assistant/Matter SDK. Son candidatos NO instalados ni validados en esta fase. Implementar mapping de entidades/observaciones, no protocolos propios, cuando exista sistema autorizado.

Broker de demo permite anónimos en loopback y no persiste sesiones en disco: no prueba supervivencia de mensajes arbitrarios en broker tras corte eléctrico. Se valida recuperación del cliente y cola Edge; TLS, ACL, secretos, retención/DLQ y sesiones durables deben configurarse antes de instalación real. No se garantiza deduplicación con IDs nuevos para el mismo hecho de un origen que no preserve UUID/revisión.

RTSP sigue sin re-ID, identidad entre cámaras o precisión calibrada. Reservas/sensores no tienen estado actual materializado ni reconciliación de negocio fuera de su historial. No se testearon UDP, audio, ONVIF real, carga, reloj de sensor incorrecto ni CCTV privado. No se modificaron las limitaciones de permisos locales de fases anteriores. Fase 07 NO INICIADA; siguiente paso revisión humana de Fase 06.


## CI remoto y correcciones de entorno
Primer run https://github.com/drbrownlabs-afk/Entity/actions/runs/42327761645 (8084b84): Failure en la demo de integración; api-tests pasó. Logs completos de ese job requieren login y no se atribuye su causa exacta a una hipótesis no comprobada. Se añadió instalación de FFmpeg desde apt oficial si falta y diagnóstico por etapa de excepción; el proveedor de demo se fija a controlled para impedir tráfico LLM accidental.

Run posterior https://github.com/drbrownlabs-afk/Entity/actions/runs/42328049603 (cc78f084a60ed625b61997713469a728e01ccac1): Success, 1m41s, api-tests 34s y edge-tests 1m37s, sin anotaciones. Incluye la demo RTSP/MQTT/REST y todas las regresiones/vídeo/Output/agente/Docker. Se conserva el fallo inicial como evidencia. Ajuste final de salud MQTT: al desconectar se limpian connected y subscribed, con test dirigido aprobado; nueva ejecución CI se comprueba tras publicar.
