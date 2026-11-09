# P2 — Addendum de fase 08: construcción inicial del modelo del mundo

**Alcance autorizado:** identidad, entidadización estructural, relaciones explícitas y correspondencia espacial. **No** ejecutar todavía consultas funcionales, reservas, simulaciones operativas, automatizaciones ni integraciones externas.

## Propósito
Construir primero la representación computable del coworking en **ENTITY Core de P1**. El gemelo digital de P2 es su representación espacial, no un Core paralelo. Reutilizar los contratos, modelos y mecanismos existentes; cualquier adaptación del backend, frontend de plataforma, Núcleo, Entidadizador o APIs compartidas corresponde a P1. No reconstruir la escena.

## 1. Inventario e identidad
- Registrar una entidad raíz para el coworking.
- Registrar ambientes **A, B, C, D y E**: A/B oficinas privadas reservables como unidad; C staff/no público; D/E coworking individual.
- Registrar como entidades los puestos **D1–D6, E1, E5 y E6** dentro del alcance inicial pedido. El catálogo previsto incluye E2–E4; conservarlo si ya existe y no confundir indexación inicial con eliminación de esos puestos.
- Registrar recepción/kiosco, cafetería, lounge, sala de reuniones, accesos, pasillos y mobiliario pertinente **solo cuando estén identificados en la escena o en documentación vigente**.
- Preparar entidades lógicas de **persona**, con identidad sintética/tipo/rol cuando proceda, **sin avatares, posiciones inventadas ni presencia física atribuida**.
- Para cada entidad definir ID estable, tipo, nombre, atributos mínimos, pertenencia, referencia de origen y, si está disponible, vínculo con objeto/zona de PlayCanvas. No duplicar entidades ya existentes.

## 2. Grafo explícito inicial
Crear y persistir **solo relaciones estructurales comprobadas**:
- `CONTIENE` y `PERTENECE_A`: coworking→ambientes→puestos/zonas/objetos.
- `UBICADO_EN` para mobiliario u objetos cuya ubicación esté efectivamente identificada.
- `ADYACENTE_A` y `CONECTADO_CON` únicamente tras verificar geometría, accesos y circulación; adyacencia no implica conexión.
- Relaciones funcionales estáticas verificables (por ejemplo, zona→función o ambiente C→uso staff), si encajan en contratos actuales.

**No materializar todavía** `RESERVADO_POR`, `OCUPADO_POR`, `ATIENDE_A`, check-ins, autorizaciones individuales ni vínculos entre personas y puestos sin datos reales o un escenario expresamente autorizado. Dejar preparados sus tipos conceptuales sin generar hechos ficticios. No inferir estados operativos de la geometría.

## 3. Correspondencia con el gemelo
Vincular entidades del Core con identificadores estables de objetos/zonas de la escena existente, sin imponer que toda entidad lógica tenga malla 3D. Documentar elementos sin correspondencia y geometría todavía no identificada. No generar pisos, vídeos, cámaras, personajes 3D ni coordenadas inventadas.

## 4. Alcance de verificación de esta etapa
Comprobar únicamente: inventario sin duplicados, IDs estables, tipado, integridad de relaciones, correspondencia espacial cuando exista y persistencia real en Core. Puede utilizarse inspección técnica o pruebas internas de persistencia, **pero no construir interfaz de consultas, queries operativas, flujos de reservas, check-in, sincronización bidireccional ni pruebas de esos flujos en esta etapa**.

## 5. Dependencias y continuidad
P2-06 y P2-07 (personajes/animaciones) quedan pendientes hasta mañana y **no bloquean** el registro de identidades. Las integraciones con CRM, cámaras, reservas, Drive y demás sistemas pertenecen a fases posteriores. No iniciar P2-09 ni declarar P2-08 aceptada automáticamente.

Antes de trabajar leer `AGENTS.md`, canon, ADR, estado y bitácora. Actualizar exclusivamente los registros existentes con entidades creadas, relaciones confirmadas, correspondencias verificadas, pruebas realmente realizadas, pendientes y commit. No crear memoria paralela ni snapshots automáticos.

## 8.1 — Coworking como entidad madre del modelo del mundo

**Decisión de modelado:** el coworking es una **entidad raíz del espacio** en ENTITY Core, no un contenedor visual, una carpeta de objetos ni una segunda base de datos. Posee **identidad estable, atributos, estado, relaciones, eventos y memoria** propios. El grafo parte de esta entidad madre y se extiende a sus componentes y a las entidades operativas relacionadas.

- **Contención jerárquica:** `COWORKING CONTIENE AMBIENTE_A/B/C/D/E`; cada ambiente `CONTIENE` sus puestos, zonas u objetos realmente identificados. Por ejemplo, `AMBIENTE_D CONTIENE D1…D6` y `AMBIENTE_E CONTIENE E1…E6`, respetando el inventario y alcance de indexación de la fase.
- **Relaciones inversas:** cada elemento puede expresar `PERTENECE_A` su ambiente, y cada ambiente `PERTENECE_A` el coworking. Conservar consistencia entre ambos sentidos según los contratos reales de P1, sin duplicar aristas innecesariamente.
- **Relaciones transversales:** el coworking puede `OFRECE_SERVICIO` (recepción, cafetería, lounge), `TIENE_ACCESO` y `GESTIONADO_POR` una organización cuando esas entidades y hechos estén identificados. Las personas se relacionan con el coworking según rol o vínculo comprobado; **no** son objetos físicamente contenidos de forma permanente.
- **Estado propio y agregado:** diferenciar estado del coworking (por ejemplo, habilitado/fuera de servicio) de estados de ambientes y puestos. Los indicadores agregados se derivarán de fuentes y reglas verificadas, sin inventar ocupación o presencia.
- **Escalabilidad:** cada sede/coworking mantiene identidad y subgrafo propios; una entidad superior (organización/red) puede relacionar varias sedes sin sustituir la entidad madre de cada espacio.
- **Correspondencia espacial:** la entidad coworking representa el conjunto del lugar; sus hijos se vinculan con objetos/zonas del gemelo cuando exista una correspondencia comprobable. No exigir malla 3D para personas, servicios o relaciones lógicas.

**Alcance inmediato de 8.1:** definir y persistir esta jerarquía y las relaciones estructurales verificadas en Core. No implica cancelar trabajo funcional que Codex ya haya realizado, ni ordenar revertir consultas u otras implementaciones existentes. No añadir datos ficticios ni iniciar fases posteriores por esta instrucción.

## 8.2 — Personas, organizaciones y relaciones del coworking

**Población inicial: 12 personas lógicas**, independientes de los avatares 3D:
- **Staff (3):** recepción, administración y operaciones.
- **Entity (2):** Carlos y Santiago.
- **Inmerso (2):** dos integrantes con nombres sintéticos provisionales.
- **Usuarios habituales (3):** miembros con planes de coworking.
- **Visitantes (2):** usuarios ocasionales con pases temporales.
Asignar identidad sintética explícitamente identificada como tal a las personas sin nombre confirmado; no crear personas adicionales.

**Distinguir tipos de entidad:** el coworking, la sala A y la sala B son entidades **espaciales**; Entity e Inmerso son entidades **organizacionales**; Carlos, Santiago y los demás son entidades **persona**. La organización llamada Entity no es el Core tecnológico de ENTITY. Una organización puede trabajar en un espacio sin ser ella misma un espacio físico.

**Relaciones iniciales:**
- `COWORKING CONTIENE SALA_A` y `COWORKING CONTIENE SALA_B`, respetando la jerarquía espacial existente.
- `ENTITY_ORGANIZACION TIENE_ASIGNADO_ESPACIO SALA_A`; `INMERSO_ORGANIZACION TIENE_ASIGNADO_ESPACIO SALA_B`. Registrar vigencia y fuente cuando aplique.
- `CARLOS PERTENECE_A_ORGANIZACION ENTITY_ORGANIZACION` y `SANTIAGO PERTENECE_A_ORGANIZACION ENTITY_ORGANIZACION`. Son `COMPAÑERO_DE` en sentido laboral, relación que puede derivarse de su organización común sin duplicar datos.
- Los dos integrantes de Inmerso pertenecen a `INMERSO_ORGANIZACION` y son compañeros laborales.
- El staff tiene relaciones `TRABAJA_PARA` y `DESEMPEÑA_ROL` (recepción, administración, operaciones) con la organización operadora si está identificada; no inferir que el rol implica ubicación.
- Los tres usuarios habituales tienen `MEMBRESIA` individual asociada a un `PLAN_MEMBRESIA`; los visitantes pueden tener `PASE` temporal. Membresías y planes son entidades diferentes: una persona conserva identidad al cambiar de plan. Condiciones comerciales reales requieren fuente verificada; los ejemplos sintéticos deben etiquetarse como tales.
- Diferenciar `ASIGNADO_A`, `RESERVADO_POR`, `PRESENTE_EN` y `OCUPADO_POR`. Asignación permanente de una sala a una empresa **no** demuestra presencia física actual. Si se crea ocupación de demostración, etiquetarla como dato simulado con tiempo y procedencia; no atribuirla a cámaras ni sensores.

**Integridad:** IDs estables, tipos, fuente, temporalidad y persistencia para personas, organizaciones, espacios, membresías y relaciones. No duplicar personas por avatar, visita o reserva; no inventar vínculos personales por compartir trabajo. Usar P1 Core/Entidadizador, con P2 como consumidor. No exigir personajes 3D ni deshacer funcionalidades ya realizadas. Documentar implementación y pruebas reales en bitácora; no avanzar fases automáticamente.

### 8.2.1 — Escenarios concretos para tres habituales y dos visitantes

Estas cinco personas **ya están incluidas** en las doce de 8.2; no crear identidades adicionales. Todos los hechos del escenario son **datos sintéticos de demostración**, no datos observados ni operaciones fiscales reales.

1. **Habitual con membresía anual:** membresía vigente, relación con plan anual y derecho de acceso según condiciones del plan; asignación o uso de puesto individual sujeto a disponibilidad y reglas.
2. **Habitual con membresía mensual vencida:** conservar la persona y el historial de su membresía anterior; representar vencimiento, solicitud de renovación, orden/cobro, pago confirmado, factura y nueva vigencia. La renovación no debe marcarse pagada antes de confirmarse el pago. La factura es una entidad documental con identificador, emisor, receptor, conceptos, importes, estado y vínculo al pago; **solo factura simulada**, sin numeración fiscal real ni emisión al SRI.
3. **Habitual por horas:** pase o paquete de horas, saldo/consumo, registro de sesiones y vencimiento si aplica. No confundir saldo contratado con tiempo efectivamente utilizado.
4. **Visitante comercial:** llega a conocer el coworking y evaluar una futura membresía. Relacionar visitante, motivo de visita, recepción, eventual recorrido y oportunidad comercial; no convertirlo automáticamente en miembro.
5. **Visitante de reunión:** llega para una reunión programada con una persona de Entity, en la oficina A **solo si el anfitrión y el permiso de acceso a esa oficina están definidos en el escenario**; de lo contrario, usar un espacio de reunión habilitado. Relacionar visitante, anfitrión, organización, evento de agenda, lugar, invitación y llegada. No asumir presencia física hasta registrar un evento simulado de llegada.

**Tipos y relaciones adicionales:** `MEMBRESIA`, `PLAN_MEMBRESIA`, `PASE_HORAS`, `SESION_USO`, `RENOVACION`, `ORDEN_COBRO`, `PAGO`, `FACTURA`, `VISITA`, `REUNION`, `INVITACION` y `OPORTUNIDAD_COMERCIAL` según contratos P1 existentes. Vincular mediante `TITULAR_DE`, `CORRESPONDE_A_PLAN`, `RENUEVA`, `PAGA`, `FACTURA_PAGO`, `ASISTE_A`, `ANFITRION_DE`, `PROGRAMADA_EN` y `REGISTRA_LLEGADA`, adaptando nomenclatura a la semántica del Core sin crear modelos paralelos.

Mantener identidad estable, procedencia, vigencia, historial de cambios y distinción entre hechos planificados, simulados y observados. Estos son escenarios de dominio para el modelo y futuras pruebas operativas; no ordenar revertir funcionalidades existentes ni crear integraciones de pagos o facturación reales por esta adición.

## 8.3 — Límite entre simulador, percepción y ENTITY (decisión de implementación)

**Objetivo del laboratorio:** el entorno y los personajes son sintéticos, pero el software ENTITY Core, entidadización, percepción y lógica operativa son funcionales. ENTITY no debe saber que está en una simulación. Esta decisión prevalece sobre cualquier sugerencia anterior de inyectar directamente a Core eventos de llegada, identidades, posiciones o estados internos del motor 3D.

### Trabajo permitido ahora: comportamientos del simulador
- Preparar secuencias de acciones de avatares cuando estén disponibles: Daniel llega, cruza accesos, se acerca a recepción, espera y va a la reunión con Carlos; otros personajes trabajan, se desplazan, entran y salen, se reúnen o usan puestos.
- Las secuencias son **estímulos visuales** del entorno. No constituyen detección, reconocimiento, consulta, check-in, notificación ni actualización de Core.
- Si aún no hay personajes 3D, preparar los guiones de acciones y sus disparadores **solo dentro del simulador**, sin inventar que ya existen animaciones o avatares implementados. No desbloquear automáticamente las fases 06/07 ni interrumpir su estado.
- Conservar las entidades, organizaciones, relaciones, membresías y reuniones documentadas en 8.1/8.2 como modelo de dominio; no revertir trabajo existente.

### Siguiente etapa: percepción multicámara real sobre imágenes sintéticas
- Las cámaras **virtuales** dentro de la escena producen fotogramas o vídeo desde sus puntos de vista, con cobertura y solapamiento verificables.
- El pipeline funcional debe incluir **detección y tracking por cámara (MOT)** y **asociación/reidentificación multicámara (MTMC/Re-ID)** para que el mismo avatar conserve **una identidad de seguimiento global** al pasar de cámara 1 a 2 y 3, incluso ante oclusiones y huecos de cobertura.
- La identidad visual provisional no equivale a identidad civil: el sistema puede conocer que es el mismo individuo sin saber aún que es Daniel. La identidad nominal se vincula solo mediante evidencia de identificación o interacción verificable.
- ENTITY recibe exclusivamente observaciones y eventos derivados del pipeline de percepción y otras interfaces legítimas (kiosco/app/agenda), nunca IDs internos de avatar, coordenadas privilegiadas, trayectorias verdaderas, scripts o etiquetas del simulador.
- El simulador sí conserva *ground truth* de avatares y trayectorias para **evaluación aislada**, inaccesible a ENTITY; medir continuidad, ID switches, duplicaciones, pérdidas y recuperación entre cámaras.
- La sustitución futura de cámaras virtuales por fuentes externas debe conservar el contrato de entrada de percepción, sin reescribir el Core.

### Escenario de referencia, aún NO conectado
Daniel tiene reunión con Carlos a las 16:00. En el simulador se puede preparar su llegada y recorrido. Solo cuando la percepción multicámara esté implementada y conectada, ENTITY podrá detectar su presencia, interactuar en recepción, verificar la reunión en el modelo del mundo, notificar a Carlos mediante la app y actualizar estados y memoria conforme a hechos realmente percibidos/confirmados. **No simular esas capacidades dentro de Core antes de conectarlas ni representar una animación como prueba de inteligencia espacial.**

### Restricciones de ejecución
No crear ahora interacciones ficticias ENTITY↔personajes, falsos eventos de cámara inyectados a Core, consultas o check-ins provocados directamente por el motor 3D. No cancelar ni deshacer funcionalidades previas por esta aclaración. Registrar por separado qué existe realmente, qué está solo documentado y qué queda pendiente. Esta adición documenta la arquitectura y el orden de trabajo; no afirma que el pipeline multicámara esté implementado.
