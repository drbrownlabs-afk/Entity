# P2 — Addendum de Fase 08: grafo relacional y entidadización del coworking

**Estado:** instrucción complementaria autorizada para P2-08. **Proceso:** P2, con cambios de plataforma exclusivamente en P1. **Referencia:** `docs/P2-ROADMAP.md`, `docs/ENTITY-MASTER-SPEC.md`, `AGENTS.md` y ADR-2026-11-08-003.

## Objetivo
Conectar el gemelo digital existente del coworking a ENTITY Core y construir un **modelo computable compartido**, no solo un inventario de objetos ni un grafo dibujado en el visor. Reutilizar el backend, frontend de plataforma, Núcleo, Entidadizador, contratos y APIs de P1. P2 consume, vincula y verifica; cualquier adaptación de software compartido pertenece a P1.

**Excepción de secuencia aprobada:** ejecutar P2-08 ahora sin esperar los avatares. P2-06 y P2-07 permanecen pendientes hasta mañana; no declararlas completadas. No iniciar P2-09 automáticamente.

## Entidades a registrar y comprobar
- Coworking y ambientes A, B, C, D y E. A y B son oficinas privadas reservables como ambiente completo; C es zona de staff, no reservable al público; D y E contienen puestos individuales.
- Puestos solicitados para esta iteración: **D1, D2, D3, D4, D5, D6, E1, E5 y E6**. Preservar el inventario canónico de 12 puestos D1–D6 y E1–E6: no borrar ni desautorizar E2–E4 si ya existen; distinguir alcance inicial de indexación de catálogo comercial completo.
- Recepción/kiosco, cafetería, lounge, sala de reuniones, accesos, pasillos y mobiliario relevante **solo cuando existan o estén identificados** en la escena. No crear geometría nueva ni inventar coordenadas.
- Personas lógicas sin avatar: visitante, miembro, staff, anfitrión, según casos de uso. Usar identificadores sintéticos para pruebas, no inventar usuarios reales.

## Relaciones tipadas mínimas
1. **Espaciales:** `CONTIENE` / `PERTENECE_A` (coworking→ambiente→puesto), `UBICADO_EN` (persona/objeto→zona), `ADYACENTE_A` y `CONECTADO_CON` únicamente si la geometría/puertas/rutas lo confirman. La adyacencia no implica transitabilidad.
2. **Funcionales:** `RESERVADO_POR` (recurso→persona, mediado por entidad reserva e intervalo), `TIENE_ACCESO_A` (sujeto→recurso, con política y vigencia), `GESTIONADO_POR` (recurso→staff/rol), `OFRECE_SERVICIO` (zona→servicio).
3. **Operativas:** `OCUPADO_POR` (recurso→persona, con fuente y validez), `ATIENDE_A` (servicio/staff→persona cuando exista evento), asociaciones de eventos con entidades y relaciones. Los eventos deben quedar en la memoria/historial del Core, no como relaciones permanentes ficticias.

Las denominaciones son vocabulario funcional propuesto; comprobar contratos existentes antes de añadir tipos nuevos. Para cada entidad y relación: identidad estable, tipo, procedencia, estado, vigencia temporal cuando aplique, eventos, memoria, autorización y referencia espacial cuando exista. Distinguir **declarado, reservado, autorizado, presente, ocupado, observado, inferido y simulado**; nunca inferir ocupación a partir de una reserva.

## Comportamientos y pruebas de aceptación
- Consultar qué puestos pertenecen a D/E y cuáles están disponibles en un intervalo; qué personas tienen autorización para B; quién tiene reserva sobre D3; y qué entidades se relacionan con recepción.
- Crear una reserva sintética de D3 con intervalo, persona y procedencia; reflejar su disponibilidad sin marcarlo físicamente ocupado. Registrar después un check-in sintético autorizado y verificar eventos/estado e historial.
- Comprobar correspondencia entidad↔objeto/zona en PlayCanvas, consultas P2→API P1, cambios de estado bidireccionales cuando estén soportados, persistencia tras reinicio, controles de acceso, trazabilidad y ausencia de Core paralelo.
- Identificar relaciones espaciales **no verificadas** como desconocidas; no fabricar puertas, rutas, adyacencias, ubicaciones, cámaras, vídeos, pisos ni personajes 3D.
- Mantener el demo anterior fuera de la experiencia activa solo según instrucción separada de retirada; no eliminar componentes compartidos de P1.

## Entrega y continuidad
Antes de implementar, leer `AGENTS.md`, canon, ADR, estado y bitácora. Documentar cambios y pruebas **en los archivos de memoria existentes**, sin crear otro master ni snapshots automáticos. Informar rama/commit, rutas modificadas, entidades/relaciones creadas, pruebas realmente ejecutadas, bloqueos, dependencias P1 y siguiente paso. No declarar fase aprobada sin revisión del operador.
