# ENTITY Spatial Simulation — Plan de ejecución Codex

**Estado:** instrucciones aprobadas para el agente de reconstrucción. **Rama:** `codex/spatial-simulation`. **Alcance:** crear un nuevo escenario 3D Blender + PlayCanvas; no modificar backend, frontend anterior, fuentes Gaussian ni artefactos de handoff.

## Entradas obligatorias y ubicación exacta

Leer primero, en este orden:

1. `docs/spatial-simulation/GEOMETRY-HANDOFF.md` — guía técnica, limitaciones, coordenadas y fuentes.
2. `docs/spatial-simulation/SPACE-INVENTORY.json` — 56 registros, IDs, anclas, procedencia y campos desconocidos.
3. `docs/spatial-simulation/ANNOTATIONS-MAP.json` — siete anotaciones, cámaras y poses de inspección.
4. `docs/spatial-simulation/WALKABLE-FLOOR.obj` — suelo parcial muestreado; no equivale a planta arquitectónica completa.
5. `worlds/synthetic-office/original-viewer-settings.json`, `worlds/synthetic-office/manifest.json`, `worlds/synthetic-office/semantic-annotations.json`, `worlds/synthetic-office/calibrated-resources.json`.
6. `docs/evidence/phase09/survey/` — capturas y picks existentes; no buscar fotografías adicionales.
7. `docs/evidence/phase09/source-voxels/scene.voxel.json` y `.bin` — colisión original.
8. `scripts/spatial-simulation/extract-handoff.py` — regeneración local del inventario.

Escena visual original: https://superspl.at/scene/a972d838 . Su implementación usa `https://d28zzqy0iyovbz.cloudfront.net/a972d838/v1/lod-meta.json` como entrada LOD; los voxels están disponibles localmente. No asumir que existe GLB segmentado del Gaussian. Inspeccionar visualmente el Gaussian únicamente para resolver geometría faltante. Las dos referencias visuales aprobadas por el operador muestran (a) mamparas de vidrio de altura completa con perfilería negra delgada y (b) cafetería contemporánea con barra, madera cálida, vegetación y mesas; obtener esas imágenes del material suministrado al agente antes de afirmar coincidencia exacta.

Coordenadas fuente PlayCanvas +Y vertical; conversión a Blender Z-up `(x,y,z) -> (x,-z,y)`, rotación +90° X **una sola vez**. Escala relativa 1:1; escala métrica no certificada. Preservar las coordenadas originales en metadatos. El OBJ es suelo parcial, no paredes ni plano completo. No interpretar bounds globales, huecos o anclas como dimensiones certificadas.

## Aislamiento de trabajo

Crear exclusivamente archivos nuevos bajo `simulation/`, `apps/spatial-simulation/` y `docs/spatial-simulation/` (salvo rutas equivalentes justificadas sin colisión). **No modificar ni borrar** código backend, frontend actual, `worlds/synthetic-office/`, `docs/evidence/`, ni los tres archivos originales de handoff y el OBJ. No ejecutar el extractor si eso reescribe los artefactos versionados; verificar primero con copia temporal. No fusionar ramas. No crear segundo Core ni duplicar IDs existentes. Registrar commit base y cambios realizados. El agente trabaja solamente en esta rama ya creada.

## Arquitectura de objetos y estados

Archivo maestro Blender con colecciones por ambiente y por tipo; cada pieza manipulable como objeto independiente, transformable y numerado, con stable ID, tipo semántico, material, ambiente, transform y origen de geometría. Muebles, mamparas, puertas, luminarias, pantallas y personajes separados. La selección y edición geométrica ocurre en Blender; en runtime PlayCanvas las **puertas y luminarias son dispositivos operables** mediante acciones y estados, no controles de edición de malla. La simulación local mantiene su estado visual; el Core existente conserva autoridad sobre datos de negocio cuando esté conectado. No inventar observaciones de cámaras por mover personajes.

IDs existentes del handoff: A, B, C, D, MEETING-AREA-01, RECEPTION, WAITING-AREA, REST-AREA, CIRCULATION-01. Los nuevos IDs de Sala E, cafetería, puertas, luces, TVs y personajes adicionales se asignan en un namespace de simulación y se documentan; no se insertan automáticamente como entidades Core. Mantener trazabilidad entre Blender, GLB y PlayCanvas.

## Fase 01 — Reconstrucción de arquitectura y mobiliario original

**Meta:** escena Blender reconocible y editable desde datos existentes. Construir suelo, techo, paredes, columnas cilíndricas, ventanales, perfiles, revestimientos, mobiliario y vegetación. Preservar diferencias de nivel verificadas, proporciones, anclas A–D, reunión, recepción y espera. Reconstruir geometría faltante con estimaciones explícitas, no falsos datos medidos. Organizar objetos individualmente; aprovechar assets libres de licencia compatible. Comparar capturas desde poses originales.

**Gate 01:** .blend abre; estructura independiente; vistas equivalentes reconocibles; transformaciones y procedencia verificables; capturas y log.

## Fase 02 — Nueva arquitectura funcional, accesos y equipamiento

**Meta:** coworking segmentado y completo, sin bloquear circulación.

- **Salas A/B/C/D:** cada agrupación de mesas es un recinto propio, delimitado por mamparas de vidrio transparentes de piso a techo, perfilería negra delgada, puerta hacia pasillo. Mantener mesas originales y sus puestos. Las mamparas rodean la agrupación, no atraviesan mesas, sillas ni columnas.
- **Sala E:** nueva agrupación de mesas y mamparas de la misma familia; situar donde la geometría reconstruida permita circulación. Registrar nueva ubicación y criterio.
- **Reuniones:** la **mesa negra junto al muro vegetal** es la sala de reuniones, no espera; conservarla y cerrar el recinto con acceso funcional.
- **Recepción:** **corrección visual aprobada por el usuario:** el sector con **sillas blancas** es RECEPCIÓN; mantenerlo como recepción y añadir mostrador y mobiliario apropiado. El mapeo semántico anterior de sillas negras a RECEPTION es incorrecto; comprobar el emplazamiento sobre las imágenes actuales y registrar el cambio sin modificar los archivos de handoff.
- **Espera:** **corrección visual aprobada por el usuario:** el sector de **sillas negras** es la ZONA DE ESPERA; sustituir esas sillas negras por sofás cómodos, butacas y mesas auxiliares. Las sillas blancas corresponden a recepción. Mantener IDs originales como referencias históricas y documentar la nueva correspondencia espacial.
- **Cafetería y recreación:** retirar los pods/booths del **nuevo diseño**, no de los datos fuente. Sustituirlos por mesas de cafetería, sillas, barra equipada, máquina de café, almacenamiento, vegetación y espacio social. Mantener ambiente visual premium.
- **Pasillos y accesos:** circulación continua, puertas de seguridad y entradas a cada recinto.
- **Audiovisual:** cuatro televisores independientes, colocados con buena visibilidad en zonas comunes, recepción, cafetería y circulación; ID individual, pantalla con material apto para contenido dinámico.
- **Puertas:** objeto y pivote independientes, apertura/cierre animables, colisionador que refleje estado, interacción individual y posibilidad de estado bloqueada/desbloqueada donde proceda. No confundir cerradura visual con control de acceso real.

**Gate 02:** plano de distribución con IDs y capturas; todos los recintos con acceso viable, sin intersecciones, cafetería sin pods, cuatro TVs, puertas individualizadas.

## Fase 03 — Ampliación arquitectónica: tercera ala y planta en C

**Meta:** completar una **planta en C**, no una L: cuerpo longitudinal principal + ala de cafetería ya iniciada + **nueva ala social y de servicios**. No rehacer ni desplazar indiscriminadamente el trabajo aprobado en las fases 01 y 02. Esta ampliación debe terminarse antes del acabado definitivo y la exportación al visor. Continuar desde el archivo maestro y las transformaciones actuales, adaptando el diseño a su geometría real. El esquema previo en L deja de ser la configuración final.

**Programa espacial de la nueva ala:**
- **Sala social / lounge:** zona diferenciada de la cafetería; sofás modulares y sillones, mesas bajas, vegetación, pantalla, iluminación cálida por luminaria y circuito propio. No convertirla en segunda cafetería. Zona operativa con ID propio, capacidad/ocupación y recorridos accesibles.
- **Cabinas acústicas para llamadas:** dos unidades compactas, independientes y accesibles, con puerta de vidrio, aislamiento visual/acústico representado, escritorio o repisa, ventilación e iluminación propias. Puertas y luminarias con IDs y estados individuales. La simulación acústica avanzada no es requisito.
- **Bloque de baños:** volumen arquitectónico y puertas funcionales, interiores esquemáticos opcionales; sin cámaras virtuales dentro de baños ni visualización de personas en su interior. Puede modelarse ocupación solo mediante eventos de puerta/sensores simulados y siempre como estimación si no hay sensor directo. No representar vigilancia visual de áreas privadas.
- **Lockers / casilleros:** indispensables y **adyacentes al bloque de baños** en la nueva ala, con armarios modulares individualizables, puertas y capacidad de asignar IDs/estados de uso cuando se habiliten. No confundir lockers con el área de espera.
- **Impresión / servicios:** una pequeña estación de impresora y almacenamiento junto a los lockers, si cabe sin comprometer circulación; prioridad menor que baños y lockers.
- **Circulación y accesos:** conexión física clara desde el cuerpo principal a ambas alas, corredores sin intersecciones con muebles, entradas funcionales, rutas de evacuación plausibles y geometría coherente en planta en C. Añadir puertas individuales y sus colisionadores.
- **Corrección pendiente del cuerpo principal:** en el sector de **sillas negras** colocar **sofás de espera**; el sector de **sillas blancas** es **recepción**. La mesa negra grande junto al muro vegetal sigue siendo la **sala de reuniones**.
- **Dispositivos y semántica:** definir y ampliar el inventario de simulación y los IDs de dispositivos; preparar la extensión de `device-manifest.json` en fase 04 con zonas nuevas, puertas, lockers si son operables, iluminación por luminaria y circuito, pantalla del lounge. No crear entidades directamente en Core; IDs estables bajo namespace de simulación.
- **Calidad:** mantener el estilo de las imágenes recientes del proyecto (madera cálida, vidrio, perfilería negra, mobiliario contemporáneo); suficiente realismo operacional, sin perseguir fotorrealismo. Evitar duplicar innecesariamente assets o afectar rendimiento web.

**Referencias visuales de consulta, una por tipología (no implican reutilización automática de activos ni licencias):**
1. **Lounge / sala social:** https://www.coalesse.com/inspiration/gallery/ — sección *Social Connection Lounge*: sofás, butacas y mesas bajas.
2. **Cabina de llamadas:** https://en.ofinto.ch/focus-call/ — pod acústico con vidrio, repisa, ventilación e iluminación.
3. **Lockers y corredor de servicios:** https://www.sophiaspeerdesigns.net/coworking-space — secciones *Locker Room* y *Corridor*.
4. **Baños:** modelar acceso, puertas, tabiques y volumen de servicios de forma sobria; no hace falta recrear detalles íntimos.
5. **Referencia principal del propio proyecto:** las cinco capturas recientes suministradas por el usuario; mantener continuidad de materiales y escala.

**Gate 03:** plano general actualizado demuestra **C completa** con nueva ala; imágenes interior/exterior de lounge, dos cabinas, baños y lockers juntos; acceso desde corredor, puertas con colisión, luminarias identificadas y preparadas para control individual, inventario/IDs y escena Blender actualizada; las pruebas funcionales de luces y puertas en PlayCanvas se realizan en fases 04 y 05. Inspección visual y prueba funcional del recorrido. **No iniciar personajes antes de terminar y validar internamente esta fase.**

## Fase 04 — Materiales, iluminación y automatización por ambiente

**Meta:** acabado premium **y** arquitectura de control individual de luminarias y puertas, diseñada antes de exportar.

Materiales PBR realistas: terrazzo, vidrio, aluminio/metal negro, madera, tapicería, vegetación, carpintería y reflejos; biseles y sombras creíbles. Iluminación natural desde ventanales y luminarias arquitectónicas. Cycles para renders de referencia; exportación PBR y esquema de luces apto para PlayCanvas.

**Iluminación operativa obligatoria:**
- Cada sala A, B, C, D, E, reuniones, recepción, espera, cafetería, recreación, lounge, cabinas acústicas, servicios y pasillos tiene **su propio circuito/zona**.
- Cada luminaria tiene ID único, transform, ambiente, tipo, intensidad nominal, color/temperatura si procede, estado on/off y nivel regulable cuando sea compatible.
- Un circuito puede operar todas las luminarias del ambiente, **sin perder control individual**.
- En PlayCanvas deben poder encenderse/apagarse luces individuales y grupos, con respuesta visual observable y estado consultable; incluir estado inicial y recuperación.
- El sistema de render no debe dejar iluminación horneada inmutable que siga iluminando una habitación cuando se apagan sus luces. Separar luz ambiental/solar de luz artificial conmutable. Para rendimiento, usar iluminación mixta o aproximaciones dinámicas comprobadas; documentar compromisos visuales.
- Puertas con ID, ambiente, estado abierta/cerrada, bloqueada/desbloqueada cuando proceda, transiciones, animación y colisiones sincronizadas; controles independientes por dispositivo.
- Definir `device-manifest.json` y contratos locales de comandos/eventos para luces, circuitos y puertas, adaptables después a las interfaces Core existentes. No modificar Core para implementarlo.

**Sistema temporal y ambiental obligatorio (preparación en Blender, fase 04):**
- Definir un reloj simulado único de 24 horas con tiempo continuo, ajuste directo de hora, pausa, reproducción hacia adelante y hacia atrás y velocidades configurables (por ejemplo ±1×, ±10×, ±60×, ±360×). No confundir este reloj con el tiempo real ni con eventos de sensores.
- Diseñar y documentar iluminación para mañana (08:00), mediodía (12:00), tarde (16:00) y noche (20:00) y transiciones intermedias; configurar trayectoria solar, orientación, temperatura/color, intensidad, sombras, luz de cielo y exposición de manera coherente. La trayectoria solar debe parametrizarse con ubicación, fecha y orientación configurables; no inventar coordenadas geográficas del edificio.
- Preparar en Blender la escena visual de alta calidad, luminarias con IDs y control por circuitos, materiales y reflejos; entregar renders de referencia de los cuatro horarios y de estados de luces. Separar contribuciones estáticas de las luminarias conmutables: evitar que un horneado fijo contradiga el estado OFF.
- Preparar especificación de transferencia a PlayCanvas: parámetros de cielo/sol, entorno, sombras, exposición, materiales, lightmaps y luces dinámicas o variantes de iluminación cuando corresponda. Priorizar continuidad visual con los renders aprobados, sin aceptar degradaciones injustificadas como premisa.
- La aprobación humana al terminar la fase 04 incluye los renders de 08:00, 12:00, 16:00 y 20:00 y la propuesta de transición temporal. **No iniciar PlayCanvas antes de esa aprobación.**

**Gate 04:** renders Blender y, solo si ya existe un entorno técnico aislado, pruebas técnicas preliminares sin iniciar la implementación de la fase 05 en PlayCanvas de la misma sala con todas las luces encendidas/apagadas y luz individual conmutada; comprobación de puertas y manifest de dispositivos. Materiales exportados sin pérdidas graves.

## Fase 05 — PlayCanvas, navegación e interacción (requiere aprobación previa)

**Meta:** escena arquitectónica completa (incluida la planta en C) navegable en navegador. Exportar GLB con IDs y jerarquía; vistas general e interior, navegación ratón/teclado/táctil, colisiones, selección de ambientes/objetos, ficha contextual. Reutilizar por importación/adaptador los componentes del frontend anterior **sin editar su código**. Implementar controles funcionales de puertas, luminarias individuales/circuitos y cuatro televisores con contenido de prueba. Selección de entidad muestra ID, tipo, ambiente y estado. No duplicar el Core.

**Reloj ambiental en PlayCanvas (solo después de autorización de fase 05):** implementar control horario 00:00–24:00, scrub directo, pausa, avance y retroceso acelerados, interpolación continua de sol/cielo/sombras/exposición y respuesta de luminarias según políticas configurables. Permitir anular manualmente el encendido automático por ambiente; separar tiempo simulado y datos reales. Verificar cambios visuales a 08:00, 12:00, 16:00 y 20:00, así como reproducción inversa y transiciones sin saltos visibles.

**Gate 05 (solo después de aprobación humana de la fase 04):** ejecución real en navegador, recorrido completo de la planta en C, incluyendo lounge, cabinas, baños y lockers, puertas con colisiones, luces con cambios visibles, TVs y selección con IDs correctos; capturas y logs.

## Fase 06 — Personajes humanos Mixamo, animaciones NPC y seguimiento multicámara

**Meta:** sustituir los dummies/maniquíes genéricos por **12 personajes humanos de Adobe Mixamo** seleccionados de las capturas del operador: **Megan, Kate, Louise, Suzie, Elizabeth, Sophie, Josh, Brian, David, Adam, James y Roth**. Mínimo aceptable: diez, objetivo doce. Ropa cotidiana y aspecto de usuarios de coworking. Excluir monstruos, zombis, criaturas fantásticas, militares y personajes caricaturescos. Verificar disponibilidad real de cada personaje; no sustituir modelos sin consultar.

**Acceso interactivo a Mixamo (fase 06):** antes de descargar recursos, abrir https://www.mixamo.com/ en una pestaña de **navegador remoto interactivo** que el operador pueda visualizar y controlar. Pausar y permitir que el operador inicie sesión personalmente con Adobe, sin pedir, leer, registrar ni almacenar sus credenciales. Una vez autenticada la sesión, continuar en esa misma sesión para localizar y descargar los doce personajes y sus animaciones. No asumir que el login en el navegador de ChatGPT se comparte automáticamente con Codex. Si el entorno de Codex no permite abrir una pestaña remota controlable o mantener la sesión, reportar la limitación y solicitar un método de acceso autorizado; no inventar acceso ni iniciar la fase 06 antes de su autorización. Esta instrucción es para cuando corresponda ejecutar fase 06, **no modifica el bloqueo actual tras fase 04**.

**Fuente y licencias:** https://www.mixamo.com/ . Buscar allí mismo los personajes y las animaciones. Documentar nombre, procedencia, rig, formato y condiciones de uso. No subir archivos originales de Mixamo a repositorios públicos sin verificar autorización; respetar restricciones de uso para entrenamiento ML. Si faltan credenciales o descargas, entregar listado exacto de recursos necesarios, sin afirmar que se obtuvieron.

**Animaciones para NPCs:** seleccionar clips Mixamo de idle/de pie, caminar (**In Place** cuando controle desplazamiento el navegador), girar, sentarse, permanecer sentado, levantarse, hablar/gesticular y caminar hacia atrás cuando esté disponible. Importar/retargetear en Blender, comprobar compatibilidad por rig, definir nombres y transiciones de estados y preparar GLB animados para PlayCanvas. NPCs deben caminar por rutas, detenerse, girar, sentarse y levantarse con colisiones y sin atravesar puertas ni mobiliario.

**Identidad persistente:** cada personaje tiene ID único y posición/estado persistentes. Separar ground truth de simulación de observaciones de cámaras virtuales; no exponer IDs internos al sistema de percepción. Incluir personajes de apariencia parecida, cruces y oclusiones para probar reidentificación multicámara, sin usar colores artificiales únicos como atajo. No confundir animación con implementación efectiva de seguimiento.

**Control:** personajes seleccionables; clic → ficha → asumir control → mover → liberar → elegir otro, manteniendo identidad y posición. Controlador desacoplado del origen de movimientos; no duplicar base de datos ni Core.

**Gate 06:** al menos diez personajes humanos funcionales (objetivo doce), animaciones NPC verificadas, transiciones y navegación, colisiones, IDs únicos y prueba de cambio de control entre al menos tres. Documentar pruebas y limitaciones. **Esta fase no está autorizada todavía: requiere aprobación posterior del operador.**

## Fase 07 — Integración y aceptación

**Meta:** un solo escenario Blender + PlayCanvas completo, ejecutable y reproducible. Inventario y manifest de dispositivos, fichas y correspondencias estables; conexión de lectura a ENTITY por adaptador existente cuando el contrato auditado lo permita, sin cambiar código original. Mantener simulación local operable aunque Core no esté disponible y distinguir claramente estados simulados de estados confirmados por Core.

**Gate 07:** desde instalación limpia, escena navegable, salas, cafetería, ala social, cabinas, baños y lockers terminados, cuatro TVs, control individual de cada luz y circuito, puertas, al menos diez personajes humanos Mixamo (objetivo doce) con animaciones NPC y control, fichas, materiales premium y ninguna modificación a backend/frontend/fuentes. Documentar comandos, pruebas, capturas, commits, limitaciones y pendientes.

## Política de autonomía y punto de revisión

El agente puede avanzar de manera autónoma desde la fase actual (fase 02) únicamente hasta **terminar la fase 04**, siguiendo el orden: ampliación arquitectónica (03), materiales, iluminación y preparación de dispositivos (04). **La fase 05 de PlayCanvas está bloqueada hasta recibir aprobación explícita del operador después de revisar Blender, renders, distribución, materiales, luces, puertas y dispositivos.** No solicitar autorización entre fases 02–04. Ejecutar y registrar todos los gates internamente, reparar fallos y conservar evidencia. **Detenerse obligatoriamente al terminar la fase 04, antes de comenzar cualquier tarea de la fase 05 (exportación definitiva, implementación o integración en PlayCanvas)**. Presentar archivo Blender, plano en C, renders y capturas de todas las áreas, materiales, inventario/IDs, diseño de puertas y luces, pruebas disponibles y problemas pendientes para revisión y aprobación del operador. No iniciar la fase 05 ni la fase 06 sin autorización posterior. No confundir esta autorización con permiso para modificar backend/frontend/Gaussian o fusionar ramas. Si existe un bloqueo real que requiere decisión externa, solicitarla con detalle concreto.

## Entregables

Archivo maestro `.blend`, scripts de construcción, inventario completo de objetos, manifest de dispositivos, GLB web optimizado, aplicación PlayCanvas separada, materiales y referencias con licencias, renders Cycles y capturas PlayCanvas, informe por gate. Evitar binarios grandes sin estrategia Git LFS o artefactos versionados. El resultado no se considera completo por pasar solo tests: requiere inspección visual y prueba funcional en navegador.

## Método del agente

Trabajar por metas y gates, con paralelismo interno cuando no haya dependencias. Corregir fallos de gate antes de aprobar fase. No alterar componentes fuera de alcance. No inventar dimensiones, IDs Core, cámaras físicas ni evidencia de ejecución. Reportar obstáculos concretos y resultados comprobables.