# ENTITY-SELF — Genealogía extendida, Espacios 4.0, Núcleo y ecosistema de agentes

**Fecha:** 2026-11-09. **Naturaleza:** recuperación histórica contextual; no altera canon, estado de P1/P2/P3 ni operaciones del Core. Fuentes: conversaciones de julio–noviembre 2026 recuperadas por búsqueda de contexto personal, y canon/ADR del repositorio. Las conversaciones no se han exportado íntegras.

## Frontera de aislamiento obligatoria

ENTITY-SELF es un dominio de conocimiento separado. Reutiliza **exclusivamente la API/backend existente de P1**, sin modificar sus fuentes, esquemas, migraciones, configuración, dependencias, rutas ni despliegues en esta incorporación. No modifica P2/P3, el coworking, los personajes, simulaciones, escenas, estados, relaciones ni memoria de esos dominios. Todos los IDs propios usan prefijo `entity-self:`; no se escriben relaciones externas sin contrato y autorización específicos. Los importadores existentes operan por llamadas API explícitas y no se ejecutan automáticamente. Si el Core carece de aislamiento de autorización por dominio, **el prefijo no es una frontera de seguridad**: limitar credenciales, entorno y acceso, y no dar acceso a terceros sin control. La importación a producción no está acreditada.

## Genealogía comercial

**2026-07-24:** decisión explícita: infraestructura horizontal como tesis; **Espacios 4.0** como solución/vertical inicial comercial. Espacios que perciben, comprenden, recuerdan y actúan; sensores, gemelos, agentes, seguridad, energía, operaciones y automatización. La monetización explorada incluía control, seguridad, mantenimiento, analítica, SaaS, APIs, licencias y servicios. **No confundir estos modelos exploratorios con la política comercial SaaS vigente.**

**2026-07-27:** Entity Runtime se considera transversal a gemelos humanos, gaming, robótica, defensa, software y hardware. Universo→Mundo→Entidad→Agente; la reconstrucción espacial es vehículo de demostración, no límite ontológico.

**2026-08-10–11:** Espacios 4.0 se vende como **«La primera Casa Viva inteligente»**: transformar espacios existentes en entornos que perciben, recuerdan, comprenden, interactúan y actúan. **Casa Rivera (Cuenca)** es laboratorio/piloto propuesto entonces, no despliegue confirmado. Naming histórico **Entity Spaces / Entity Espacios 4.0**; ENTITY como infraestructura subyacente. La narrativa comercial prioriza el espacio y su transformación, no Unreal como producto.

**2026-08-27:** evolución del demostrador: Gaming Runtime → Espacios 4.0 → Entity OS Studio → demostrador transversal de cuatro realidades → Casa Viva para Epic. Espacios 4.0 como secuencia Digital Twin → Live Digital Twin → Spatially Intelligent Twin → Agentic World. Entity OS Studio como expresión transversal para espacios, organizaciones, personas, máquinas, software y simulaciones. La propuesta para Epic no debe confundirse con producto aprobado.

**2026-10-21/26:** Espacios 4.0 implementa ENTITY como inteligencia espacial: WORLD (representación 3D), LIVE (sensores), STATE (entidades/relaciones/memoria), ENTITY (inteligencia), AGENTS. Mensaje comercial: un edificio puede tener muchos sistemas inteligentes y seguir fragmentado; la solución los integra en un modelo contextual común.

**2026-11:** marca actual **ENTITY** (horizontal), vertical **ENTITY Spatial Intelligence**; Espacios 4.0 permanece como antecedente y concepto comercial relacionado. El aeropuerto sirve como narrativa integral para inversionistas; coworking como piloto controlado; no confundir los dos.

## Historia comercial que no debe perderse

Un documento histórico sobre propuesta a Singapur describe un **piloto de centro comercial de seis meses** con posible grant IMDA de **USD 250.000**, propuesta de financiación y estimaciones SaaS de **USD 50.000–200.000 mensuales por centro**. Estas cifras son **proyecciones históricas**, no ofertas verificadas ni ingresos. También planteaba Entity OS Core open source + Entity OS Cloud propietaria, templates premium, API subscriptions, compute y marketplace. La estrategia vigente de SaaS cloud y propiedad intelectual se determina por canon/decisiones actuales; no activar el modelo open source histórico sin aprobación.

## Genealogía técnica

- **ENTITY Core:** identidad, estado, relaciones, eventos, memoria, capacidades, autorización y procedencia; fuente de realidad computable persistente.
- **Núcleo:** motor **distinto** de Core para descubrimiento/normalización de APIs, SDKs y protocolos, catálogo y ejecución autorizada de capacidades. Núcleo ≠ Core ≠ Entidadizador.
- **Entidadizador:** interpreta datos heterogéneos, resuelve identidad y produce/actualiza entidades, estados y relaciones.
- **Entity Framework / Entity Runtime / Entity OS:** nombres y abstracciones históricas relacionadas, no sinónimos exactos ni productos desplegados por inferencia. En agosto se estableció que el runtime de entidades debía ser independiente y reemplazable respecto de OpenClaw.
- **OpenClaw / OpenCloud:** aparecen en conversaciones históricas como runtime/gateway y entorno de agentes. Conservar los nombres **literalmente** como menciones diferentes; no asumir que OpenCloud es errata ni producto idéntico sin fuente. OpenClaw es un posible runtime para agentes, no Core.
- **NTT World:** entidad/mundo histórico independiente; no fusionar NTT con la identidad de ENTITY.
- **Nexo:** agente histórico dedicado a construir/evolucionar agentes OpenClaw. **Entity** fue especificado como agente `main` con contexto global; Bruno no debía ser entrada por defecto. Marea, Kiaga y Bruno aparecen como agentes especializados históricos; no afirmar que están activos hoy.
- **Memoria de agentes:** workspaces, handoffs MEMORY/STATE, transcripts, compaction y memoria de sesiones; no equivalen al grafo persistente de Core. La continuidad de mundo debe sobrevivir al cambio de agente o runtime.
- **World Model / Self Model:** modelos de mundo y de perspectiva; agentes como capacidades situadas sobre mundo compartido. Un mundo puede ser una entidad contenedora; los contextos de persona, hogar, vehículo, empresa y simulación se relacionan sin colapsar identidades.
- **Unreal/Pixel Streaming/Spatial FX-VFX/Niagara, Gaussian Splatting/Orbbec:** recursos de representación, simulación, percepción y experimentación; no son la ontología ni sustitutos del Core.
- **UFSL/campos geométricos/latentes, dependencias indirectas y propagación de efectos:** línea de investigación avanzada, **no parte del MVP implementado**.
- **Multiagentes:** integral a la arquitectura completa de ENTITY Spatial Intelligence; **P3 como implementación está planificado**, no realizado. Las capacidades externas deben ejecutarse bajo autorización y auditoría de Core.

## Relaciones históricas importantes

1. ENTITY plataforma **FUNDAMENTA** Espacios 4.0 / Entity Spaces / ENTITY Spatial Intelligence.
2. Espacios 4.0 **SE_COMERCIALIZABA_COMO** Casa Viva y **PROPUSO_PILOTO_EN** Casa Rivera.
3. Espacios 4.0 **EVOLUCIONA_EN_NARRATIVA_HACIA** Entity OS Studio y demostrador transversal; esto no implica sustitución técnica de Core.
4. Entity Runtime **DEBE_SER_INDEPENDIENTE_DE** OpenClaw; OpenClaw **PUEDE_EJECUTAR** agentes; los agentes **CONSUMEN** Core.
5. Núcleo **DESCUBRE_CAPACIDADES_PARA** Core; Entidadizador **ALIMENTA** Core; gemelo **REPRESENTA** mundo computable.
6. Nexo **DESARROLLABA** agentes OpenClaw; Entity agente main **COORDINABA** especialistas en propuesta histórica. No mezclar esos agentes con el producto ENTITY.
7. White papers de agosto **ANTECEDEN** posicionamiento de realidades computables; Espacios 4.0 **ES_VEHÍCULO_COMERCIAL_DE** la tesis horizontal.
8. Piloto Casa Rivera (histórico) **NO_ES_IGUAL_A** piloto coworking Impacto (prospecto posterior); demo centro comercial **NO_ES_IGUAL_A** guion aeropuerto.
9. Modelo open-source + cloud propietario **ES_PROPUESTA_HISTÓRICA**, no decisión canónica vigente.
10. ADR-2026-11-08-001/002/003 **PREVALECEN_SOBRE** interpretaciones previas de numeración, Núcleo/Core y propiedad del software.

## Pendientes de recuperación

Transcripciones completas mayo–noviembre; archivos originales de presentaciones Espacios 4.0/Casas Vivas; propuesta Singapur/IMDA; contratos de Entity Runtime; handoffs OpenCloud/NTT; especificaciones Nexo/Marea/Kiaga/Bruno; archivos METODOCC; white papers íntegros; propuestas Epic; material original Núcleo; evolución de precios. Conservar las referencias sin convertir propuestas en hechos vigentes.

**No modificar los archivos de P1/P2/P3 para completar esta genealogía.** La síntesis se registra únicamente dentro de ENTITY-SELF.
