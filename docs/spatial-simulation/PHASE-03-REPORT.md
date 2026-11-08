# Fase 03 — tercera ala, planta en C y servicios

Fecha: 2026-11-08. Rama `codex/spatial-simulation`. Plan vigente importado de `8490e1a`, con autonomía explícita 02→04. **Gate interno verificado; no aceptación humana inventada.**

## Entrega

[Maestro de arquitectura C](../../simulation/spatial-office/output/office-phase03.blend), [plano con IDs](evidence/phase03/layout-with-ids.svg), [inventario](../../simulation/spatial-office/output/phase03-inventory.json), [inventario completo](../../simulation/spatial-office/output/phase03-full-inventory.json).

Se añade una tercera ala frontal de X−12..−6,5 y Z−5,8..2,65, además de la cafetería posterior ya construida, formando una C. Las dimensiones son parámetros de diseño estimados, no medidas recuperadas del Gaussian. Se conserva el cuerpo principal, E al fondo, la cafetería, las anclas originales y la corrección de recepción blanca/espera negra.

La nueva ala contiene:

- Lounge separado de cafetería: tres módulos de sofá y un sillón, mesa baja, plantas y pantalla propia. Capacidad modelada de cuatro asientos; ocupación desconocida, no inferida de cámaras.
- Dos cabinas de llamadas, una persona por unidad: vidrio, puerta independiente, mesa/repisa, asiento, ventilación e iluminación identificada. Representación arquitectónica, sin certificación acústica.
- Bloque de baños opaco con puerta operable; interiores esquemáticos vacíos. Sin cámaras ni personajes dentro y sin inferir ocupación por imagen. Roof/puerta se mantienen opacos/cerrados en capturas de revisión.
- Ocho lockers individualizados y operables, adyacentes al bloque de baños; asignación nula, estado inicial no asignado. No se crean asignaciones Core.
- Estación de impresión y almacenamiento junto a lockers, fuera del corredor.
- Rampa frontal real y conexión a la circulación existente, además de la rampa de cafetería. Se corta el slab/escalón correspondiente.
- Un segundo cierre de seguridad en el paso elevado: evita que la nueva conexión frontal permitiera rodear el cierre del corredor. La TV de circulación se desplaza ligeramente en su mismo sector para despejarlo.

El conjunto tiene **19 puertas simuladas**: siete de Fase02, dos de cabinas, una de baños, ocho de lockers y un cierre adicional. Cinco pantallas en total: cuatro originales del incremento y la del lounge. Luminarias del ala nueva preparadas con ID por ambiente; el inventario completo de luz se finaliza en Fase04.

## Validación ejecutada

**644 comprobaciones PASS y dieciséis recorridos**. [Resumen](evidence/phase03/summary.json), [asertos](evidence/phase03/checks.json), [rutas](evidence/phase03/routes.json), [revisión visual](evidence/phase03/visual-review.json).

Las pruebas reabren el `.blend`, conservan anclas/mesas/asientos A–D, verifican unicidad de IDs, mamparas contra mobiliario/columnas/maceteros, apertura completa de las 19 puertas, colisionadores, bloqueo que detiene animaciones pendientes, independencia de comandos, rutas con altura de suelo real y ambos cierres. Comprueban ocho lockers no asignados, dos cabinas y ausencia de cámaras en el volumen de baños. Ninguna navegación de PlayCanvas ni hardware físico se atribuye a estas pruebas.

Cuatro renders Cycles examinados: general C, lounge, dos cabinas y acceso a baños/lockers/impresión. El encuadre inicial del lounge pasaba junto a una planta que tapaba los asientos; se corrigió el encuadre y se repitió la captura. La Fase04 mejora materiales/iluminación y produce las copias finales para aprobación.

## Correcciones y límites

Las puertas de lockers se separaron ligeramente del frente de la carcasa tras detectar interferencia de sus proxies con los estantes. Un punto objetivo de cabina coincidía con el volumen de una silla: se corrigió la aproximación hacia suelo libre, manteniendo radio, obstáculos y altura de QA. Se incluyen maceteros en el chequeo y se recolocan los colgantes estimados de A/B/C para que queden dentro de sus mamparas; ninguna ancla original se mueve.

Los tres sitios externos de tipologías devolvieron 403 del proxy; [registro](evidence/phase03/reference-access.json). No se descargaron ni redistribuyeron activos de esas páginas ni se afirma haber visto su contenido. Se usaron el programa espacial del plan y las referencias del operador 1211/1212. Las cinco capturas adicionales mencionadas por el plan no están en este workspace; no se finge coincidencia con ellas.

No se modifican backend, frontend, Gaussian, handoff ni evidencia histórica. El plan del operador actualizado por separado se conserva con su hash exacto, documentado en evidence/upstream-revisions.json.

## Reproducir

```sh
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/build-phase03.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/check-phase03.py
python3 simulation/spatial-office/plan-phase03.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/render-phase03.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/inventory-phase02.py -- 03
```

Requiere el maestro de Fase02; los constructores anteriores están documentados en sus informes. Blender y Python existentes, sin servicios nuevos. BVH y animación son componentes de Blender; búsqueda de rutas es una herramienta de QA estática, no otro simulador empresarial. La continuación autorizada es Fase04; PlayCanvas permanece bloqueado hasta revisión humana posterior.
