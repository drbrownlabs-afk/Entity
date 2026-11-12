# P2-09.17 — La continuidad visual llega al mismo ENTITY Core

## Objetivo

Una identidad global calculada en Edge no basta si desaparece al reiniciar o se duplica al repetir mensajes. Esta fase lleva las observaciones y la hipótesis global al Core P1 existente, con entidades, relaciones tipadas, eventos y memoria. El grafo de sensores limita asociaciones visuales; el grafo operativo de Core conserva esas asociaciones y su procedencia. Son responsabilidades diferentes del mismo sistema.

Se usa la SQLite local ya existente, el mismo sitio coworking-p2 y un run separado `p2-09-cctv-trial-a-verified2`. No se crea otro Core, otra sede ni una base de datos de sustitución. Los runs históricos y las personas registradas se comparan antes y después. El run nace al inicio del medio, registra cámaras/calibración y después adelanta su reloj para admitir el lote retrospectivo. Las consultas históricas verifican que las fuentes existían antes de las imágenes y que la inferencia global aún no aparece antes de su evidencia. El supervisor genera un ID nuevo por defecto; una medición fría sobre un run existente se rechaza, y el replay exige el mismo hash de salida original. No se modifican el baseline histórico de seis cámaras ni los resultados09.15/09.16: la medición nueva genera sus salidas privadas en el experimento `core17`.

## Resultados del ingreso y persistencia

| Comprobación | Resultado |
|---|---:|
| Frames ingresados por HTTP | 2008 |
| Observaciones locales de imagen | 609 |
| Tracks locales / hipótesis globales en Core | 24 / 1 |
| Grafo consultado desde la identidad global | 33 nodos / 72 relaciones |
| Duplicados exactos al repetir mensajes | 2009 / 2009 |
| Revisión antes/después del replay | 3512 / 3512 |
| Memorias de inferencia global | 1, conservada tras reinicio |
| Nuevas personas civiles | 0 |
| Regresión Core | 116 pruebas PASS |
| Ingreso de frame p50 / p95 | 109.86 / 133.39 ms |
| Detector por imagen p50 / p95 | 19.37 / 151.21 ms |
| Suma de tiempos medidos de inferencia + ingreso | 454.11 s |
| Throughput derivado de esa suma | 4.42 imágenes/s agregadas |

El replay, el reinicio HTTP real y las consultas históricas pasaron. Los JSON de auditoría/gate consignan el cierre adicional de aislamiento GT. El rendimiento combinado usa inferencia medida reutilizada y un ingreso nuevo: no es walltime de una ejecución única ni acredita16imágenes/s o tiempo real. Detector:1,136,804KiB RSS máximo; Core:71,528KiB; ingester:67,304KiB. Checkpoints GPU global45/273/273MiB durante la inferencia; muestreo del ingreso con inferencia reutilizada45MiB. Ninguno es VRAM exclusiva o un pico garantizado entre muestras.

## Representación y límites semánticos

Los ocho sensores se registran con ID de dispositivo, sensor, canal, stream y hash de calibración. Los cuatro cabezales de C siguen independientes. Cada frame genera `edge.presence`, incluyendo los vacíos, con hash, índice y timestamp original. Los tracks locales conservan caja y confianza, y un ancla de imagen calculada desde esa caja fresca (centro para la vista cenital, centro inferior en las demás); no reciben una posición mundial ni una identidad civil. Se añade `association_confirmed_at` para distinguir la observación original de la evidencia posterior que confirmó el MOT. La confirmación inicial puede ser posterior a una observación retrospectiva o anterior a detecciones posteriores del mismo track. La disponibilidad de la evidencia es el máximo de ambos tiempos; no se exige que toda observación sea anterior a la primera confirmación. Si no existe ese dato, la representación de clientes anteriores conserva su formato.

El nuevo contrato compartido `edge.global_track_association` expresa una hipótesis anónima: ID global, miembros locales, referencias a observaciones ya persistidas, hashes de modelo/grafo/calibración/salida, ejecución batch y provisionalidad. El servidor comprueba que cada referencia exista en el mismo run, corresponda al sensor y track declarados, incluya un frame trazado y no anticipe ni la imagen ni su confirmación. Rechaza campos extra como actor_id, posición mundial o identidad civil, miembros duplicados, namespaces ajenos y roles sin autorización.

La entidad global reutiliza el tipo Track con `track_scope=global`. No es una nueva Person. Cada track local apunta a ella mediante `provisionallySameVisualSubject`; la entidad global se relaciona con sus representantes locales. Una memoria resume la inferencia y referencia las observaciones; el evento/inbox conserva la entrada completa validada. Un hash o una puntuación no sustituye esa cadena de evidencias.

La identidad global tiene estado inferido y ubicación desconocida. No se le inventa `observed_at`, una zona confirmada, una trayectoria en las oclusiones ni ocupación de un recurso. La consulta de ubicación devuelve unknown. Los frames sin detecciones pueden cerrar la actividad de un track local, pero no borran la identidad ni afirman salida del edificio. No se usan reservas, pagos ni IDs privados para resolver identidad.

El campo active de los tracks globales no constituye una observación de presencia: su estado se identifica expresamente como asociación inferida y ubicación desconocida. La entidad y sus referencias permanecen almacenadas aunque no exista una localización confirmada.

El consumidor del contrato es responsable de la inferencia visual de09.16. Core valida contratos, permisos y procedencia; no vuelve a ejecutar OSNet ni certifica por sí solo la física de una asociación. Esta distinción evita presentar una validación del formato como una prueba de percepción.

## Verificación reproducible

Desde la raíz del repositorio en WSL, después del entorno09.10 y del corpus09.14:

```bash
cd services/entity-api
/opt/entity-p2/api-venv/bin/python -m unittest discover -s tests > ../../simulation/spatial-office/.runtime/api-tests17.log 2>&1
cd ../..
/opt/entity-p2/api-venv/bin/python scripts/spatial-simulation/perception/validate-cctv-core.py
/opt/entity-p2/api-venv/bin/python scripts/spatial-simulation/perception/finish-cctv-core.py
```

El supervisor:

1. Repite detector CUDA, MOT, OSNet y MTMC con trabajadores aislados y salidas separadas `core17`. Compara identidad/membresías con09.16 y comprueba ausencia de segmentos inviables.
2. Exige la suite Core en verde antes de importar. Inicia un proceso HTTP propio sobre la misma SQLite local; no termina procesos ajenos.
3. Registra metadatos de ocho sensores e importa frames y asociación global con IDs deterministas. No lee el evaluador ni la escena dinámica.
4. Repite exactamente los mensajes: todos deben ser duplicados y el mundo/revisión deben quedar iguales, sin memoria o relaciones adicionales.
5. Consulta grafo, ubicación, eventos y memoria por HTTP. Compara los mundos históricos y las personas anteriores.
6. Termina y vuelve a iniciar su proceso Uvicorn, sobre la misma SQLite; comprueba igualdad exacta de mundo, relaciones y memoria. Después cierra únicamente ese proceso propio.
7. Registra latencias, tiempos, FPS, RAM y memoria GPU muestreada, y registra los controles de Core. El finalizador solo promueve el gate técnico después de pasar también la auditoría de aislamiento.

La repetición conserva exactamente cajas, confianzas, timestamps, IDs locales y confirmaciones de los2008frames/609observaciones; ver `repeat-inference.json`. La auditoría posterior del ingreso reproduce los2009mensajes con evaluador desconectado e ID privado cambiado, exigiendo duplicados exactos e invariancia de mundo/relaciones/memoria; ver `isolation.json`. El auditor es el único que lee o renombra GT y restaura los originales.

Los resultados verificables están en `ingestion.json`, `replay.json`, `persistence.json`, `performance.json` y `gate.json`. El log privado y el marcador de salida del supervisor están bajo `.runtime`; no se crean copias/exportaciones de SQLite ni snapshots de recuperación.

## Diagnóstico y correcciones

La primera regresión encontró que añadir un campo opcional serializaba `association_confirmed_at:null` en clientes antiguos. Se conservó la forma anterior cuando el campo está ausente y se serializa la fecha a JSON cuando existe. La prueba de compatibilidad cubre ambos casos; los nuevos tests cubren autorización, referencias falsas, actor/pose prohibidos, confirmaciones futuras, deduplicación y ubicación global desconocida.

El primer ingreso se detuvo con422tras21frames persistidos: la validación asumía erróneamente que toda confirmación debía ser posterior a toda observación del track. El MOT conserva la confirmación inicial para las detecciones posteriores, y el contrato se corrigió para admitir ambos órdenes sin anticipar el reloj del Core. Los intentos `p2-09-cctv-trial-a` y `p2-09-cctv-trial-a-verified1` quedan conservados; la verificación limpia usa `p2-09-cctv-trial-a-verified2`, sin borrar ni reiniciar evidencia histórica. En el segundo intento aparecieron seis estimaciones filtradas apenas fuera de[0,1]; el ingreso usa ahora el ancla de la caja asociada real, sin recortar la predicción y fingir una observación. También se corrigió la creación del reloj para que los metadatos no aparezcan después de las imágenes en la reconstrucción histórica.

La importación no traduce asociaciones a pares con solapamiento ficticio para satisfacer el contrato antiguo. Se incorpora un contrato distinto para la inferencia global por continuidad, preservando el contrato y las pruebas del baseline.

## Qué significa el rendimiento

El modo normal mide los cuatro trabajadores y el primer ingreso HTTP completo; captura/render previo no incluido. La verificación final reutiliza la inferencia ya medida e idéntica mientras corrige únicamente el ingreso (`P2_REUSE_INFERENCE=1`): su tiempo combinado/FPS se calcula sumando los tiempos de procesamiento registrados de esos trabajadores y el ingreso nuevo medido. No es el walltime de una ejecución única ni incluye la inicialización de trabajadores en ese modo. `timing_basis` identifica explícitamente el alcance. Se informa tiempo total y FPS agregados de2008frames, además de latencia p50/p95 por imagen del detector y p50/p95 por petición de ingreso. El coste del replay se mide aparte. Los checkpoints de VRAM del detector pertenecen a la inferencia real previa; las muestras periódicas de la verificación final con caché corresponden al ingreso/Core. No se presentan como un pico de GPU durante una inferencia nueva. Estos percentiles no son una latencia causal de cámara a mundo: los medios son grabados y MTMC utiliza el corpus completo.

RAM: high-water marks por proceso, no suma de memoria física única del sistema. GPU: muestras de memoria global mediante nvidia-smi, incluyendo gráficos y otros procesos; no equivalen a VRAM exclusiva de la inferencia ni garantizan capturar un pico entre muestras. El host no se declara dedicado ni libre de otras tareas. No se presenta este circuito batch como tiempo real.

## Pendiente

09.18 debe parametrizar los adaptadores para cada corpus independiente y repetir cinco recorridos completos; no reutilizar trial-a como si fueran cinco ensayos. Debe con evaluación aislada, contrastar la coherencia entre sensores, identidad y Core, y presentar el resultado para aceptación humana final. Una ejecución persistente no demuestra todavía generalización, discriminación multipersona ni una instalación física. Las cuatro observaciones falsas y la incertidumbre geométrica identificadas en09.16 no desaparecen por almacenarlas en Core. No se identifican personas civiles ni se confirma la disponibilidad de puestos en esta fase.
