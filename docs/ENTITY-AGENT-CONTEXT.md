# ENTITY — Contexto conceptual y operativo para agentes de desarrollo

> Documento de orientación para comprender el propósito del producto y de P2-09. No sustituye el canon, los ADR, los contratos ni los gates técnicos. El estado real debe verificarse en el repositorio.

## 1. Qué es ENTITY

ENTITY es una plataforma de inteligencia contextual que transforma información procedente de diferentes fuentes en un modelo del mundo unificado, persistente y computable.

Su principio central es la **entidadización**: representar personas, objetos, espacios, dispositivos, servicios y otros elementos como entidades con identidad, estado, relaciones, eventos y memoria.

ENTITY conecta información que normalmente permanece fragmentada entre sistemas independientes.

No se limita a almacenar datos o generar análisis. Su propósito es construir un contexto compartido que permita comprender situaciones, consultar relaciones, interpretar acontecimientos y ejecutar acciones autorizadas.

La plataforma distingue entre información observada, inferida y desconocida. Las entidades pueden mantener continuidad incluso cuando dejan de recibirse observaciones.

El **World Model** constituye la representación contextual unificada. El **Shared World Model** permite que aplicaciones, servicios y agentes utilicen ese contexto mediante interfaces y capacidades controladas.

ENTITY Core mantiene el modelo computable y su memoria operativa. Los conectores y el Entidadizador incorporan información externa. Los componentes de percepción transforman señales de sensores en observaciones que alimentan ese modelo.

El gemelo digital puede representar visualmente el entorno, pero no constituye el núcleo de ENTITY.

## 2. Qué es ENTITY Spaces

ENTITY Spaces es la aplicación de la inteligencia espacial de ENTITY a entornos como edificios, instalaciones y espacios operativos.

Su objetivo es representar no solamente la geometría de un lugar, sino también lo que ocurre dentro de él.

Un espacio contiene entidades relacionadas: personas, habitaciones, dispositivos, accesos, actividades, recursos y acontecimientos.

ENTITY Spaces integra información espacial, temporal y operacional para mantener una representación contextual actualizada.

Las cámaras aportan observaciones visuales; los accesos informan entradas y salidas; las reservas aportan información sobre ocupación prevista; otros sistemas contribuyen con sus propios estados y eventos.

Ninguna fuente individual representa necesariamente la realidad completa.

ENTITY combina esas evidencias, conserva su procedencia y reconoce los límites de lo que puede determinar.

El resultado es un espacio cuyo contexto puede ser consultado y utilizado por aplicaciones, interfaces y sistemas operativos.

## 3. Qué es ENTITY Workspaces

ENTITY Workspaces es el caso de aplicación de ENTITY Spaces a oficinas y espacios de coworking.

Su modelo operativo relaciona personas, salas, puestos de trabajo, reservas, accesos, dispositivos, recursos y actividades.

Por ejemplo, una sala puede estar reservada, pero no necesariamente ocupada. Una persona puede haber registrado su entrada sin estar visible en ninguna cámara. Un dispositivo puede encontrarse físicamente en una sala y estar asociado a una actividad programada.

Estas diferencias son fundamentales.

ENTITY debe poder relacionar información procedente de distintos sistemas sin confundir una reserva con una ocupación observada, una detección visual con una identidad civil o una ausencia de observación con una salida del edificio.

El propósito es mantener una representación coherente de las operaciones del workspace, que pueda utilizarse para consultas, coordinación y acciones.

## 4. Nuestro laboratorio: Spatial Simulation

Estamos desarrollando un coworking virtual como entorno controlado de pruebas para ENTITY Workspaces.

La escena contiene arquitectura, habitaciones, mobiliario, personajes, cámaras y otros elementos vinculables al modelo del mundo.

El simulador genera situaciones y proporciona una realidad de referencia para evaluar los resultados.

**El simulador conoce lo que ocurre. ENTITY debe reconstruir lo que pueda conocer mediante las fuentes de información permitidas.**

Esta separación es indispensable para demostrar capacidades reales y evitar resultados artificialmente correctos.

El objetivo no es construir únicamente una escena visualmente convincente, sino comprobar la interoperabilidad entre el entorno espacial, las observaciones y ENTITY Core.

## 5. Contexto específico: P2-09 — Percepción y continuidad espacial

Actualmente estamos validando la capacidad de ENTITY para observar y seguir personas dentro del coworking utilizando cámaras virtuales.

Un personaje recorre distintas zonas del edificio, atraviesa campos de visión, desaparece detrás de obstáculos y reaparece en otras cámaras.

ENTITY debe interpretar las imágenes sin recibir la trayectoria real, el identificador privado del personaje ni las etiquetas del evaluador.

El experimento debe demostrar progresivamente que puede:

1. Detectar al personaje en las imágenes.
2. Mantener su seguimiento dentro de cada cámara.
3. Asociar observaciones entre diferentes cámaras.
4. Utilizar la geometría y las restricciones espaciales para evaluar desplazamientos posibles.
5. Conservar continuidad contextual durante pérdidas de visibilidad.
6. Incorporar las observaciones y relaciones resultantes al mismo ENTITY Core que representa el workspace.

Una detección no equivale automáticamente a una identidad. Una trayectoria probable tampoco equivale a una ubicación confirmada.

ENTITY debe preservar esas distinciones.

## 6. Estado y secuencia de P2-09

- **09.12:** configuración y calibración de ocho sensores virtuales.
- **09.13:** construcción del grafo espacial, conectividad, obstáculos y zonas ciegas.
- **09.14:** recorrido reproducible de un personaje con pausas, giros, oclusiones y reapariciones.
- **09.15:** detección y seguimiento local sobre las imágenes mediante GPU.
- **09.16:** asociación multicámara y continuidad de identidad mediante ReID/MTMC.
- **09.17:** integración con ENTITY Core, persistencia y evaluación del rendimiento.
- **09.18:** pruebas repetidas, evaluación integral y aceptación final.

El estado efectivo de cada fase debe verificarse mediante código, pruebas y evidencias del repositorio, no únicamente mediante este documento.

## 7. Criterios de razonamiento para el agente

El agente debe comprender qué situación del coworking representa cada experimento y cómo sus resultados contribuyen al modelo de ENTITY.

No debe optimizar métricas aisladas sacrificando coherencia espacial, temporal o semántica.

Debe distinguir detección, seguimiento local, asociación global, identidad civil, observación e inferencia.

Los errores deben analizarse como situaciones concretas: oclusiones, distancias, iluminación, campos de visión, desplazamientos imposibles o asociaciones ambiguas.

El ground truth pertenece exclusivamente al simulador y al evaluador aislado. No puede alimentar la inferencia de ENTITY.

Los resultados deben conservar trazabilidad, reproducibilidad y compatibilidad con ENTITY Core.

## 8. Qué queremos demostrar al terminar P2-09

Queremos observar un personaje desplazándose por el coworking y comprobar que ENTITY puede detectar su presencia, seguir sus movimientos, reconocer su continuidad entre cámaras y actualizar el modelo del mundo utilizando exclusivamente información permitida.

El resultado no debe ser únicamente una secuencia de detecciones correctas.

Debe ser **una entidad cuya presencia, estado, relaciones espaciales y continuidad temporal puedan representarse de manera coherente dentro de ENTITY**.

Ese es el propósito de esta fase y su contribución al sistema completo.

## 9. Aclaración del operador — cámaras integradas y continuidad espacial (2026-11-12)

Las cámaras son los ojos integrados de ENTITY: fuentes independientes de evidencia sobre un mismo espacio y un mismo contexto compartido. Sincronizar cada sensor con el edificio y construir el grafo permite razonar sobre lo que puede ocurrir entre vistas. El razonamiento debe partir de ese contexto espacial y temporal; elegir o mejorar un modelo visual es una herramienta dentro de ese sistema.

La expresión «la inteligencia debe estar en el espacio antes que en el modelo» significa que geometría, conectividad, sensores, tiempo y estado compartido organizan la interpretación de las evidencias. No atribuye al grafo conocimiento de la posición real de una persona: el espacio restringe hipótesis; las observaciones permitidas aportan evidencia; ENTITY mantiene las entidades, relaciones, incertidumbre y memoria resultantes.

Cada sensor conserva su identidad, pose, calibración, reloj y procedencia. Asociar observaciones entre cámaras no mezcla feeds, no convierte cuatro cabezales en un panorama y no borra el origen de una observación. Una asignación al sensor equivocado o una proyección incorrecta invalida el razonamiento espacial aunque el detector encuentre una persona.

Una misma persona observada por varias cámaras debe poder sostener una misma entidad de seguimiento. Los tracks locales son asociaciones temporales de cada sensor: cambiar de cámara o recuperar un track local no demuestra una nueva persona ni una identidad civil. La asociación global debe justificarse con apariencia, tiempo, movimiento y restricciones espaciales; una contradicción mantiene la asociación como incierta, en lugar de forzar una fusión.

Cuando una cámara pierde visibilidad, ENTITY conserva la entidad y su última evidencia con procedencia. Puede mantener hipótesis de desplazamiento por zonas transitables y cámaras candidatas, pero no presentar una ubicación predicha como observada ni deducir una salida del edificio por ausencia visual. Cuando llega nueva evidencia, puede confirmar o revisar la continuidad y conservar memoria de esa revisión.

Ejemplo conceptual: C1 observa una persona; después deja de verla. La última observación de C1 conserva su instante y origen. El grafo permite evaluar posibles reapariciones. Una observación compatible en C2 puede justificar continuidad de la entidad anónima. Un desplazamiento imposible o evidencia ambigua impide una confirmación automática. El intervalo sin visión permanece como desconocido o inferido, no como una trayectoria confirmada.

La prueba con un único dummy evalúa esta capacidad. Saber, desde el evaluador, que hay una sola persona no autoriza al algoritmo a escoger siempre una detección, fusionar todos los tracks ni consumir el identificador privado del simulador. Tampoco convierte la identidad anónima de seguimiento en una identidad civil.

### Consecuencias para las fases pendientes

| Ámbito | Criterio operativo |
|---|---|
| Evidencia por sensor | Conservar sensor, reloj, calibración y procedencia hasta las asociaciones y el Core; rechazar mezclas de fuentes. |
| Detección y MOT (09.15) | Medir aciertos y falsos tracks; emitir observaciones solo desde detecciones reales. Separar el tiempo observado del momento de evidencia que confirma después una asociación. |
| Continuidad global (09.16) | Justificar una entidad de seguimiento coherente entre cámaras y pérdidas; rechazar transiciones imposibles y conservar asociaciones inciertas sin fusionarlas arbitrariamente. |
| Modelo del workspace (09.17) | Actualizar el mismo Core con estado, relaciones, eventos y memoria, distinguiendo observado, inferido y desconocido; comprobar persistencia, idempotencia y trazabilidad. |
| Aceptación (09.18) | Evaluar la coherencia integral en cinco recorridos y presentarla al operador; un recall alto por sí solo no demuestra el sistema completo. |

Esta aclaración conserva la separación simulador/evaluador/ENTITY, el canon y los gates existentes. Describe el propósito y cómo razonar sobre la evidencia; no acredita como implementadas las capacidades pendientes. El estado verificable sigue registrado en PROJECT-STATUS, AGENT-WORKLOG y las evidencias de cada fase.

## 10. Ejemplo operativo: presencia, puesto y disponibilidad (2026-11-12)

El operador sitúa el objetivo general en una situación cotidiana: una persona llega al coworking y ocupa un puesto concreto, por ejemplo Juan en la mesaD,puesto3. Las cámaras aportan evidencias que, relacionadas con identidad legítima, geometría y recursos registrados, permiten actualizar presencia y ocupación en el modelo de entidades y relaciones de ENTITY Core. El ejemplo es ilustrativo; no declara que existan actualmente esas entidades exactas ni que esta integración esté implementada.

La ocupación debe referirse al recurso estable —mesa, puesto o silla según el inventario y el modelo operativo—, conservar su procedencia y distinguir lo observado de lo inferido. Estar cerca de una silla no demuestra por sí solo que se esté ocupando. Si solo existe un track visual anónimo, puede existir evidencia de ocupación sin que se conozca aún la identidad civil de quien ocupa el recurso. No se obtiene «Juan» del identificador privado del simulador.

El sistema puede utilizar ese estado para evaluar qué recursos están disponibles para otra persona, junto con reservas y las reglas autorizadas del coworking. Disponibilidad es una conclusión operativa apoyada en estado y políticas; no debe confundirse con que una silla aparezca vacía en una imagen. Una reserva puede bloquear disponibilidad sin confirmar ocupación, y una ocupación puede observarse aunque no exista una reserva.

Accesos, reservas, membresías, cobros, pagos y otras integraciones aportan información al mismo contexto compartido. Un pago no demuestra presencia; una reserva no demuestra ocupación; una detección no demuestra identidad civil. Conflictos, ausencia de datos y evidencias caducadas deben conservarse como tales, con tiempos y fuentes, en lugar de resolverlos mediante asociaciones arbitrarias.

El grafo espacial de sensores y el modelo de conocimiento operativo tienen funciones relacionadas y diferentes. El primero describe calibración, campos de visión, conectividad y desplazamientos posibles para interpretar evidencias. El modelo de entidades/relaciones de Core relaciona personas, recursos, presencia, ocupación, reservas y operaciones, con estado, eventos y memoria. Ambos deben contribuir a la coherencia del mismo workspace; las cámaras constituyen una fuente más, no una fuente privilegiada que sustituya las demás.

P2-09 valida progresivamente el camino desde píxeles hasta continuidad espacial y actualización trazable del Core. Esta orientación general sirve para tomar decisiones de desarrollo y razonar sobre errores que podrían crear falsa ocupación, duplicar personas o liberar recursos indebidamente. No autoriza iniciar integraciones de reservas/facturación, identificar civilmente al dummy, cambiar políticas comerciales ni ejecutar acciones financieras en la fase actual.
