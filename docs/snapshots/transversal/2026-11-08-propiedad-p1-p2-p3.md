# Snapshot transversal — Propiedad de P1, P2 y P3
- **ID:** ENTITY-SNAPSHOT-2026-11-08-PROPIEDAD-PROCESOS
- **Fecha UTC:** 2026-11-08
- **Solicitud:** explícita del operador, en conversación, para guardar separación de responsabilidades y crear snapshot.
- **Repositorio:** drbrownlabs-afk/Entity
- **Rama:** codex/spatial-simulation
- **Commit base antes de esta documentación:** `3a2113b7f6d9480cf444f2c77c5f4ec5960a5ace`
- **Commit del snapshot:** commit que contiene este manifiesto (consultar historial Git del archivo y fijar su SHA; no confundir con commit base).
- **Tipo:** memoria/arquitectura/documentación, no checkpoint ejecutable.
- **Canon:** `docs/ENTITY-MASTER-SPEC.md` en el mismo commit del manifiesto.
- **ADR:** ADR-2026-11-08-001, 002 y **003** en `docs/DECISION-LOG.md`.
- **Estado:** `docs/PROJECT-STATUS.md`; roadmap `docs/P2-ROADMAP.md`; evidencia documental `docs/AGENT-WORKLOG.md`.

## Decisión registrada
**P1** es dueño del backend y frontend de plataforma, ENTITY Core, Núcleo, Entidadizador, APIs, conectores, contratos y **todas sus adaptaciones**. Si P2 o P3 requieren cambios en el software compartido, se desarrollan **en P1**, incluso cuando la antigua secuencia de fases de P1 esté detenida.

**P2** es dueño del **demo operativo del workspace/coworking**: gemelo digital, escena, personajes, cámaras, simulaciones, operaciones e integración de sistemas externos. Consume P1 y prueba el funcionamiento; no crea un Core ni backend duplicado.

**P3** es dueño de la **IA situada** y agentes/contexto; utiliza el modelo de P1 y puede probarse sobre P2. Sigue separado y no se autoriza desarrollo por este snapshot.

## Continuidad inmediata
- P2-05: gemelo construido, **según confirmación del operador**, no verificado técnicamente durante esta operación.
- P2-06: personajes Mixamo/NPCs, siguiente trabajo.
- P2-07: integrar y validar escena/personajes.
- P2-08: conexión al backend de P1 y entidadización de escena/personajes.
- P2-09: integración y entidadización de cámaras, CRM, Drive, reservas y demás sistemas, con adaptaciones compartidas hechas en P1.
- P2-10/11: sincronización y validación de interoperabilidad; fases posteriores según roadmap.
- La arquitectura Núcleo ≠ Entidadizador ≠ ENTITY Core se conserva.

## Evidencia, límites y recuperación
- **Comprobado en esta operación:** archivos de memoria y planificación consultados y actualizados en GitHub; comprobar el commit y contenido mediante fetch posterior.
- **No realizado:** código, pruebas de backend/frontend, compilaciones, conectores reales, acceso a equipos, export de bases de datos, captura de runtime, tags, despliegue o merge a main.
- **Riesgos:** confundir propietario de software (P1) con lugar donde se usa (P2/P3); mezclar fases globales históricas con numeración interna de P2; declarar implementaciones por documentación.
- **Recuperación:** abrir este manifiesto en el commit que lo contiene; leer el canon y ADR-003 en el mismo commit, luego estado y roadmap. No restaurar destructivamente código ni alterar ramas sin autorización.
- **Próxima acción:** continuar P2-06 con los personajes en el gemelo existente; las necesidades de software compartido se canalizan a P1.
