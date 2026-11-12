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
