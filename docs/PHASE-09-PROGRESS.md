# Fase 09 — Checkpoints y evidencia
Estado global: EN CURSO. Integradas implementaciones 943ff31 y reglas actualizadas 14c33fe.
Rama de planificación: `codex/phase-09-autonomous-plan`.
El original remoto ya está integrado y verificado con Chromium autorizado en GitHub Actions. El403 del proxy local no prueba indisponibilidad ni necesidad de otra exportación. Último lote local:83pruebas backend aprobadas; evidencias y límites se detallan abajo.

| Subfase | Estado | Pruebas/evidencia | Commit/PR | Siguiente |
|---|---|---|---|---|
| 09.1 | EN CURSO | SSOG/voxels originales1440/390 PASS; A/B, reunión, espera/descanso y recepción con referencias; vista superior de inspección real | 0474c40 y evidencias survey | Nuevo Dollhouse publicado pendiente de captura; inventario geométrico C/D/E y asientos incompleto. Vite no requerido |
| 09.2 | EN CURSO | 83tests; reloj Core, pausa/reinicio/replay, jornada activa de tres clientes; cinco poses Core/GLB sobre pasillo voxel verificado | 9ad7985; spatial-core.json | Rutas físicas de toda la jornada pendientes; no inventar posiciones fuera del tramo calibrado |
| 09.3 | EN CURSO | Dos cámaras SDK observan al mismo personaje virtual; observación anónima guardada e historia recuperada; permisos/alertas backend verificados | spatial-runs/42423665942.json | Cerrar recorrido integral con Dollhouse/producto y cobertura de zonas aún no calibradas |
| 09.4 | VERIFICADA AUTOMÁTICAMENTE | Disponibilidad/ocupación independientes, concurrencia, no-show, conflicto/reasignación y eventos; regresión83PASS | backend-regression.txt | Integración visual completa en09.9 pendiente |
| 09.5 | VERIFICADA AUTOMÁTICAMENTE | HVAC-D afecta soloD, ticket/personas/reservas, reparación y sensor; regresión83PASS | backend-regression.txt | Sensores/actuadores sintéticos; hardware no probado |
| 09.6 | VERIFICADA AUTOMÁTICAMENTE | Filtros por entidad/zona histórica/tipo/intervalo y scrubbing E2E; reinicio HTTP108entidades/19eventos; backup íntegro; Docker persistente | memory-regression.txt, reception-http-*.json, memory-390.png, spatial-core.json | La reconstrucción no ofrece vídeo grabado; rutas visuales completas siguen en09.2/09.9 |
| 09.7 | VERIFICADA AUTOMÁTICAMENTE | Core query/evidencia/TTL/permisos/acciones/trazas, SDKOpenAI con transporte controlado ytimeout; regresión83PASS | backend-regression.txt | Proveedor remoto real no probado sin clave |
| 09.8 | VERIFICADA AUTOMÁTICAMENTE | Cierre/HVAC/sobreocupación aislados, comparación y aplicación revalidada; regresión83PASS | backend-regression.txt | Efectos visuales completos dependen de09.2/09.9 |
| 09.9 | EN CURSO | UI compartida Office/personal; E2E1280/390; José/Carlos/kiosco con replay común; runbook y arranque Docker preparados | PHASE-09-RUNBOOK.md; PR#2 | CI/Pages nuevos, paquete limpio, flujo espacial completo y límites de dispositivos físicos |


## Regla de registro
En cada gate, añadir fecha, comandos exactos, resultado PASS/FAIL/NO EJECUTADO, capturas/logs sin secretos, problemas y correcciones, SHA, estado GitHub, dependencias y próxima acción. Nunca inventar pruebas. Al reiniciar Codex, leer este documento y retomar el primer gate no verificado.

## Checkpoint de implementación y acceso — 2026-11-07

- Original SSOG: `baf37b3`, informe `docs/evidence/phase09/original-integration.json`, escritorio1440/táctil emulado390 PASS; 4 anotaciones originales, walk nativo habilitado, sin escena sustituta. No equivale a validación de todos los recorridos/colisiones ni de teléfono físico.
- Receptor oficial Vite/SSOG: 3/3 tests de archivo PASS. Escritorio interactivo sin herramienta disponible y sin sesión autenticada utilizable; no se ha descargado un export Vite autenticado. CONNECT403 corresponde al proxy, no prueba fallo de autenticación. Directorio de entrada vacío. Protocolo en PHASE-09-ASSET-INTAKE.md.
- Checkpoint parcial de backend/API: módulos Office y Núcleo, permisos por sede/rol, reservas concurrentes, visitantes/host, observaciones anónimas con deduplicación, sensores, incidencias, tareas, memoria temporal y ramas what-if implementados. `PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests -v`: 47/47 PASS (14 Office y33 regresión); salida conservada en `docs/evidence/phase09/backend-regression.txt` (incluye advertencia de deprecación Starlette/httpx). Tests de API/SQLite y transporte controlado, no validación espacial ni hardware.
- Interfaz operativa enlazada al Core por API configurable, sin token persistido en navegador; compilación Vite comprobada. Su E2E con Core HTTP sigue pendiente. Bootstrap toma posiciones del archivo original; no afirma calibración individual de puestos, equipos o accesos.
- La tabla conserva los gates 09.2–09.9 PENDIENTES: existe implementación parcial, pero todavía no se han verificado integralmente ni se autoriza confundir tests unitarios con cierre de subfase. Pendientes personajes/recorridos originales, CCTV sincronizado completo, escenario diario, adaptadores de prueba y entrega integral. Ninguna aprobación solicitada ni concedida.


## Corrección de prioridad y zonificación — 2026-11-07 (decisión del operador)

**Continuación autorizada, sin Vite.** El viewer ya utiliza el SSOG original publicado y sus voxels (pruebas `baf37b3`). La búsqueda/descarga de Vite ZIP autenticado fue una prioridad errónea y queda expresamente retirada del camino crítico. El operador ya tiene Vite y NO necesita suministrarlo. No detenerse ni volver a investigar login, proxy o descarga para avanzar 09.1–09.9. El estado de 09.1 permanece EN CURSO porque faltan comprobaciones espaciales, no por falta de Vite. Las subfases 09.2–09.9 no están verificadas, aunque hay backend/UI parcial. El próximo trabajo es continuar implementación y pruebas, no emitir otro informe de descarga.

**Topología funcional fijada:** mesa negra junto a pared = reunión; conjunto de seis puestos contiguo = oficina privada 01; siguiente conjunto de seis = oficina privada 02; restantes puestos = individuales; dos sillas negras aisladas = recepción provisional; otro grupo de sillas = espera. Consultar `docs/phases/PHASE-09.md` para política y validación de anclas. El bootstrap actual clasifica erróneamente los dos grupos `Office Bench` como puestos individuales; corregir esa semántica y probar reservas privadas vs públicas sin inventar coordenadas ni borrar datos existentes.

**Siguiente gate ejecutable:** (a) revisar SSOG real y anclas; (b) corregir inventario/bootstrap/roles/recursos y validar espacialmente 09.1; (c) probar y cerrar el gate 09.1 con evidencia; (d) avanzar de inmediato por 09.2–09.9 con las pruebas de cada gate, sin aprobaciones intermedias. No marcar gate superado hasta ejecutarlo. La copia local SSOG y el ZIP Vite quedan opcionales y fuera de bloqueos.


## Hallazgo de cobertura espacial — 2026-11-07
El operador confirma MÁS conjuntos de mesas de seis sillas en la escena que los dos `Office Bench` anotados. El bootstrap actual itera solo cuatro anotaciones y por tanto **subrepresenta la escena**. Corrección obligatoria antes de cerrar 09.1: inspección visual integral del SSOG, inventario de mobiliario y grupos NO anotados, diferenciación por adyacencia de dos oficinas privadas junto a mesa negra y resto de puestos individuales; recepción y espera independientes. Registrar capturas y anclas verificables; no inferir coordenadas ni cantidades no observadas. No convertir dos anotaciones en dos oficinas privadas sin comprobar su ubicación. No depender de Vite. Esta modificación documental NO afirma que el inventario visual ni el bootstrap estén ya corregidos.


## Confirmación de correspondencia — 2026-11-07
El operador aclara que las DOS anotaciones originales `6-Person Office Bench System` **son exactamente las dos oficinas privadas** de seis posiciones. Queda resuelta la incertidumbre introducida anteriormente sobre su identificación. El resto de mesas de seis sillas, no anotadas, deben descubrirse por inspección visual e inventariarse como coworking de puestos individuales. El código actual del bootstrap sigue pendiente de corregir: hoy publica los puestos de ambas oficinas privadas como recursos individuales. Mantener 09.1 EN CURSO hasta implementación y pruebas; Vite no es dependencia.


## Nueva decisión vinculante — 2026-11-07: 12 puestos y recepción digital
El operador selecciona recepción digital (servicio sin ubicación física obligatoria). Inventario comercial: oficinas privadas A/B de seis posiciones cada una y reserva íntegra; C = seis posiciones de STAFF en conjunto identificable por mueble separador frontal, no reservable; D1–D6 y E1–E6 = ÚNICOS 12 puestos individuales reservables; mesa negra = reuniones; booths de descanso y pasillos no reservables. Esta decisión sustituye el supuesto previo de 18 puestos públicos y la ampliación automática a F/G. Se requiere inspección visual para localizar C/D/E y corregir bootstrap, APIs, permisos, reservas y UI. Estado de implementación: PENDIENTE; no declarar completado por esta actualización documental. SSOG original suficiente, Vite no requerido. Continuar ejecución autónoma 09.1–09.9.


## Decisión de recepción inteligente presencial — 2026-11-07
Recepción digital SÍ tiene punto físico: pantalla/kiosco en dos sillas negras aisladas, sin recepcionista. Voz/táctil, sin teléfono obligatorio. Mismo grafo ENTITY; cita 16:00, identidad, check-in, aviso al anfitrión, orientación. Implementación y pruebas E2E pendientes.


## Intercomunicación contextual — 2026-11-07
Nuevo alcance: intercom ENTITY en recepción y ambientes A/B/C, conectado al mismo Núcleo y grafo. Caso de aceptación: visitante Daniel llega a reunión 16:00, ENTITY avisa a Carlos por intercom, recibe confirmación o demora, responde al visitante y registra eventos. Validar routing por relaciones, estado/presencia, privacidad y fallback. Implementación pendiente.


## Implementación inicial de ENTITY App (2026-11-07)
Se añadió una primera vertical funcional para la participación real de Carlos en Synthetic Office:
- `apps/web/personal.html`: interfaz móvil con autenticación, bandeja de mensajes y respuestas «Estoy listo» / «En cinco minutos», más disparador de llegada para administrador.
- `services/entity-api/app/office/personal_app.py`: API autenticada `/v1/office/app/me`, `/inbox`, `/inbox/{id}/reply` y `/sites/{site}/demo-arrival`. Persistencia SQLite por sitio y usuario, respuestas de un solo uso y control de permiso `simulate` para crear eventos de demostración.
- `apps/web/vite.config.js`: entrada de build `personal.html`.
- `services/entity-api/tests/test_personal_app.py`: prueba básica de persistencia/aislamiento.

**Estado y límites:** código publicado, todavía sin ejecución de tests en este entorno ni despliegue. La bandeja se actualiza manualmente o al volver a la pestaña; NO hay todavía Web Push, service worker, suscripción real del teléfono, sesión persistida, disparador automático desde la llegada del avatar ni escritura de respuesta al estado compartido de la simulación. No presentar el prototipo como una notificación Android operativa. Próximo paso de Codex: enlazar evento de llegada y reunión del grafo a notificación dirigida al anfitrión, respuesta a comando/evento del Núcleo, push HTTPS opt-in y pruebas E2E en móvil. No detener el resto de Fase 09 por este incremento.

## Checkpoint ejecutado: inventario y recepción/intercom
Baseline47Core/6Node PASS. Migración A–E implementada:12puestos D/E públicos, A/B privados completos con propiedad organizacional, C y puestos internos no reservables. Grafo temporal derivado de campos explícitos y relaciones tipadas, reflejado en Core. Kiosco por pantalla/voz opcional del navegador, verificación autorizada, intercom privado por relaciones+presencia, espera/fallback y app personal conectados al mismo estado persistente.55tests PASS en backend-regression.txt; build de4entradas PASS. Prueba integral de navegador y ciclo diario siguen pendientes. Inspección de original produce evidencia survey; aún no permite dar por verificado el inventario geométrico completo. Estado global EN CURSO, sin gates espaciales autoaprobados.


## ENTITY Mobile — permisos diferenciados (2026-11-07)
Código en rama `codex/phase-09-autonomous-plan`:
- `app/office/access.py`: proyección server-side del mundo por rol e identidad. Miembros sin vínculo de persona fallan cerrado; cámaras, streams y otros miembros quedan excluidos.
- `app/office/api.py`: la API existente de mundo aplica proyección; consultas de miembros limitadas a entidad propia, ubicación autorizada y agenda propia; logs operativos, stream, capacidades y comparaciones de escenarios quedan reservados a operadores.
- `apps/web/personal.html`: pantalla móvil lee las simulaciones y muestra entidades autorizadas del mismo estado del Núcleo.
- `tests/test_personal_access.py`: pruebas unitarias de aislamiento básico.

**No está terminado ni desplegado:** aún no hay reproducción 3D responsive dentro de personal.html, visor de cámaras autorizado, creación/cancelación de reservas desde la app, consulta conversacional/voz, Web Push, integración automática de llegada/respuesta con el grafo ni pruebas E2E ejecutadas. Debe completarse antes de la demo comercial. Revisar todos los endpoints de lectura y permisos finos por recurso, empresa y rol (el acceso de operador actualmente es amplio), no confiar solo en la proyección de mundo. Ejecutar tests y verificar migraciones, sesión y controles de privacidad. La UI actual es un primer cliente del mundo compartido, no paridad funcional con escritorio.

## Gates funcionales ejecutados — jornada yrecepción (Codex,2026-11-07)
- Comando: PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests -v —64PASS; salida backend-regression.txt.
- Comando: PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm --prefix apps/web run test:browser —3PASS; mall conservado.
- Comandos: npm --prefix apps/web run build; CHROMIUM_PATH=/usr/bin/chromium .venv/bin/python scripts/phase09/demo-reception-http.py —PASS. reception-http-browser.json/process.json ycapturas1280/390: kiosk→Core→personal→Core→kiosk, reinicio ybackup. Micrófono/Androidreal NO EJECUTADOS; Pushpendiente.
- Inventario/reservas/confort operan sinrenderer. CAM05/06/RECEPTION del guion son fuentes sintéticas SIN pose física calibrada; no son prueba deCCTVproyectado.
- Survey original acotado produjo authored-middle/rear/rear-hall yprofundidades medidas. Faltan semánticaC/D/E/recepción/rutas.09.1 no verificada.
- Cambios posteriores deinterfaz/activos yCI se verifican antes decierre; verhandoff. Vite no es dependencia.


## Ampliación verificada —67tests yCoreDocker (Codex,2026-11-07)
67unittestPASS53.544s,6assetsRocketbox cargados enPlayCanvas con6clips cadauno, huesos animados cambian ymatrices finitas (avatar-assets.json). PreparaciónBlender deassets humanos originalesMIT; ningúnedificio/voxel reconstruido. Aún no colocados en09.2 por falta derutas/anclas completas; no confundir QA deanimación condemoespacial.

OfficeDocker construido ysaludable en8010, Coreanterior8000conservado. Reiniciocontenedor mantiene88entidades/3eventos exactos enprueba inicial (docker-office.json). CoreHTTP/kiosk/personal conreinicio/backup yaPASS. CI falló encheckout limpio porcarpeta de log ausente, diagnosticado conAPIautorizada deActions; corregido d3b28f7. CI42404091061 yPR42404097987Success.

CCTV ahora usa4cámaras enuna solaappPlayCanvas (2activas en390px), SSOGoriginal yningúnrenderer paralelo; evidencia a98b717/f59651e. SinCore conectado son vistas autorales públicas, no observaciones reales. Una proyecciónCore conectada solo habilita cámaras autorizadas. Rutas nativas/voxels recorrieronpasillo hasta zonadebooths; ydelcámara estable, pero no se certifican todasparedes/mobiliario.

Recepción remota distingue respuesta deapp autenticada vs personaje sintético; responder no confirma presencia física. Espera→listo actualiza inbox/Conversation/Visit enmismomundo. PushHTTPS/Android/micrófono reales aúnnoejecutados. Espera ydescanso reciben anotacionesSuperSplat deprofundidad medida yrevisiónvisual; C/D/E/recepción aúnpendientes decalibración completa.

## Reanudación yregresión ampliada —2026-11-07
81b21ba remoto/CI42405312827 yPR42405316680Success confirmados.70testsPASS43.591s más3diariosPASS trasmanejo de respuesta real queprevalece sobreguion. Nuevoscontratos de rutas/reconstrucción, rangodeocupación conmulticámara yensayo desede distinta configurada, sinrecrearCore. Survey4ebc2bb contiene capturaslaterales ysuelo originales (scriptcorregido6ce1477). Preparada pruebaCore+SSOG+GLB+pickerSDKreal; resultado geométrico pendiente.09.2/09.3 permanecen sinverificar hastaque pase yse revisevisualmente.

## Continuación ejecutada —2026-11-07, Codex
72pruebasPASS48.835s trascorregir acceso limitado adestino/intervalo dereunión yorganización privada. SixRocketboxGLB QArealPASS conraízdeCore preservada yanimaciónen hijo; cincoinstantesCore/rendererPASS diagnóstico local. La pruebaSSOGd200a6b detectó divergencia yse corrigió95e5c2b; rerun realpendiente, no cerrar09.2/09.3.
Cliente personal reutiliza elMISMO office.html enproyección autorizada, sintransmitir tokens alvisor; consultas/formularioscompartidos, selección vinculada, mismasAPIs. E2E1280/390PASS: recepción→respuestapersonal→reservaA, proyecciónsinLuis/cámarasprivadas, reinicio/backup. Micrófono/Androidfísico/PushHTTPS siguen pendientes, no equivalenapruebaChromeemulada.
Recorrido voxel adicional7647cc7 se detieneante boothverde: se conserva laevidencia dedetención, no seafirma haber atravesadomobiliario. C/D/E/recepción requieren completar calibración visual; ningún puntose asigna poraproximación. Pages añadeverificación deloffice.html público, resultado traspublicaciónpendiente. ContinúaEN CURSO, ninguna aprobación humana inferida.


## 2026-11-08 — Codex: reloj Core, jornada activa y replay conservador
Implementado un único productor de reloj por ejecución en Core, play/pause/velocidad autorizados, pasos transaccionales de250ms y pausa al reiniciar sin sumar tiempo fuera de servicio. Un fallo de adaptador revierte reloj y acciones del paso y deja un evento de fallo, sin reintento destructivo. Replay crea otra ejecución, instala el guion y cambia la jornada activa en una sola transacción; conserva mundos e historial anteriores. Office, personal y kiosco siguen por defecto la jornada activa; elegir una ejecución explícita permite inspeccionarla. Inbox enlazado se filtra por ejecución; el mensaje demo aislado no se presenta como llegada del grafo. El kiosco solo obtiene ID/reloj, no datos privados del mundo. Hora civil usa la zona horaria de la sede, rechaza horas DST inexistentes/ambiguas.
Pruebas reales: PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests -v:81PASS59.139s; test_office_playback.py:3PASS5.074s; npm --prefix apps/web test:10PASS; npm --prefix apps/web run build:PASS. CHROMIUM_PATH=/usr/bin/chromium .venv/bin/python scripts/phase09/demo-reception-http.py:PASS1280/390, cambio compartido de jornada, play/pause, privacidad/logout tardío, recepción/intercom/reserva/grafo; reinicio HTTP108entidades/19eventos y backup integrity_checkPASS. Informes reception-http-*.json y backend/playback-regression.txt. El primer intento E2E esperaba observar08:00 a60× pese al polling3s: timeout del aserto; corregido comparando el reloj Core monotónico, sin ralentizar ni fingir el avance. El primer comando unittest sinPYTHONPATH no importaba app; repetido con el comando correcto anterior.
La evidencia SSOG original previa sí prueba22muestras físicas de pasillo libres,5poses Core/GLB,2CCTV y observación anónima/historia. No certifica rutas completas de jornada ni localización C/D/E: cuatro grupos se han localizado visualmente, correspondencia funcional de cinco ambientes sigue sin resolver. Recepción se ancló al sector de sillas negras, no a un kiosco medido. No se inventan muebles ni posiciones. Sin Android físico, micrófono real, WebPush ni LLM remoto verificados. Docker/CI/Pages del nuevo lote pendientes de ejecutar; no se reutiliza evidencia anterior como si probara código nuevo. Fase09 EN CURSO, PR#2 sin fusionar, sin aprobación humana ni avance a10/11.


## 2026-11-08 — Codex: memoria temporal y tercer cliente sincronizado
Backend83PASS60.502s (incluye2nuevas pruebas de filtros temporales/aislamiento). Memoria filtra entidad, zona, tipo e intervalo, aplica cursor después de filtrar y reconstruye relaciones históricas; no usa ubicación actual para reescribir el pasado. UI conserva filtros, scrubbing y evidencia; fecha en timezone de sede. SSE ahora entrega el evento no privado site.active_run_changed también a operadores acotados.
E2E real1280/390PASS: José enOffice y Carlos enpersonal, máskiosco, siguen replayactivo; mensajes anteriores desaparecen; relojplay/pausecompartido; JoséfiltraD1/ZONE-D/run.created, seleccionaevento yreconstruyehistoria sinCarlosprivado. reception-http-browser.json/memory-390.png; reinicio conserva108entidades/19eventos ybackupPASS. BuildPASS y11NodePASS (incluye rechazo de fecha civil imposible). No se afirma pruebaespacialSSOG nueva por esta ejecución local.
Arranque se prepara encontenedor con dependenciasfijadas, sinvenvhost, másfrontendcompilado. PrimerensayoconUIDdelhost detectó appDocker copiada conpermisos700/600 delworkspace; corregido chmoda+rX delcódigo público enimagen, sin cambiarpermisos0600decredenciales/datos. Nuevo ensayo con UID del anfitrión PASS: bootstrap en contenedor, up --wait y ready. Smoke posterior conserva98entidades/14eventos y Core8000saludable. EntregaZIP rotulaOffice/Coreobligatorio ySSOGremoto, sin vender todaslasentradascomoautónomas;CIañadeE2EOfficeextraídodelpaquetelimpio. VerPHASE-09-RUNBOOK.md. No cambianaprobaciones ni seabrenfases10/11.


## 2026-11-08 — Codex: inventario observado sin duplicar capacidad
Dos grupos de seis posiciones sin anotación original, visibles en original-plan-near-clipped/far, pasan a InventoryItem persistente con IDs OBSERVED-WORKGROUP-01/02 y relación partOf hacia la sede. No se asignan a C/D/E sin prueba; position y resource_mapping permanecen null, no son reservables ni comerciales y no aumentan la oferta12D/E. Bootstrap aplica la observación de forma aditiva e idempotente sin borrar reservas/historial. Prueba dirigida1PASS1.058s: reservaD1 conservada, docepuestos exactos, grafo, rechazo de booking para mobiliario sin capacidad declarada e idempotencia tras initialize. El primer aserto esperaba422, pero la API rechaza correctamente404 por ausencia de capacidad; no se cambió el servicio para acomodar el test. Regresión completa posterior en curso.
La configuración espacial dd4090d fue rechazada porActions42442701961: concurrency duplicado durante edición de workflows. Corregida inmediatamente en51178c9 restaurando el job espacial completo y un único bloque. No es un fallo del modelo del mundo. Se espera conclusión real de la nueva ejecución antes de declarar CI verificado. El trabajo no avanza aFase10/11.
