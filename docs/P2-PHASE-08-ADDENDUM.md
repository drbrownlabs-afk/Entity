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
