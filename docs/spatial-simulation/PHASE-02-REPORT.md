# Fase 02 — distribución funcional, agrupación E y accesos

Fecha: 2026-11-08. Rama `codex/spatial-simulation`, base `cd95f96`.
Autorización del operador: «continúa con la fase dos». Estado: **VERIFICADA INTERNAMENTE**, sin aprobación humana automática. El plan actualizado autoriza el avance interno por Fases 03 y 04.

## Resultado implementado

Maestro actualizado: [office-phase02.blend](../../simulation/spatial-office/output/office-phase02.blend).
[Plano con IDs](evidence/phase02/layout-with-ids.svg), [inventario del incremento](../../simulation/spatial-office/output/phase02-inventory.json), [inventario completo](../../simulation/spatial-office/output/phase02-full-inventory.json).

- A/B/C/D y reuniones tienen mamparas transparentes hasta techo, perfiles negros delgados y puerta hacia el pasillo. Se conservan sus mesas y asientos. La mesa negra sigue siendo reuniones, junto al muro vegetal; no se usa como espera.
- **E es la agrupación adicional al fondo, detrás de D**, con mesa de la misma familia, seis posiciones y mamparas. Usa `sim:ROOM-E` y objetos `sim:p2:E:*`; no crea disponibilidad comercial ni entidades Core. Para encajar E sin mover las superficies calibradas D, se amplía el borde posterior estimado de −26,5 a −28,6 en una franja de X−2,85..4,35. Es diseño propuesto en unidades relativas, no una medición nueva del edificio. La L y cafetería del operador se conservan.
- Según la corrección del operador importada en el plan 8490e1a, recepción ocupa el sector de sillas blancas y espera el sector de sillas negras. Se añade mostrador/kiosco junto a las blancas; las negras se sustituyen por sofá, butaca y mesa auxiliar. Las anclas RECEPTION/WAITING-AREA del handoff no se reescriben: son referencias históricas, con correspondencia operativa explícita en phase02-layout.json. Solo se ajusta también un almacenamiento estimado de A para liberar su mampara; mesas/asientos A–D permanecen en sus posiciones.
- La cafetería continúa sin pods: dos mesas normales, ocho sillas, barra, cuatro taburetes, equipamiento, madera, vegetación y luz cálida de referencia.
- **Cuatro televisores independientes**: recepción, espera/zona común, cafetería y circulación. Cada uno tiene pantalla, ID, material e imagen de prueba propios, UV y textura empaquetada en el `.blend`, aptos para exportación/contenido posterior.
- **Siete puertas independientes**: A/B/C/D/E, reuniones y seguridad del pasillo. Cada una tiene pivote, hoja, marco, manilla y proxy de colisión hijo del mismo pivote. Animación demostrativa: frame 1 cerradas, 31 abiertas, 61 cerradas. El cierre/bloqueo es simulado; no controla accesos físicos.
- Se crea una rampa al sector elevado de cafetería. Se corta de verdad el tramo de slab/escalón en el paso: no se oculta un escalón vertical debajo de la rampa. El QA de rutas consulta las caras reales de suelo y limita los saltos de altura.

## Pruebas ejecutadas

**295 comprobaciones PASS y diez recorridos geométricos válidos**, en [summary.json](evidence/phase02/summary.json) y [checks.json](evidence/phase02/checks.json).

| Gate 02 | Evidencia ejecutada |
|---|---|
| Maestro abre e IDs no se duplican | Reapertura en proceso Blender independiente, inventario y hashes actuales |
| Mamparas no atraviesan mesas, sillas, mobiliario ni columnas | Cruce BVH de geometría evaluada; cero intersecciones en [partition-intersections.json](evidence/phase02/partition-intersections.json) |
| Sin mamparas coincidentes | Unicidad de bounds de paneles; D/E comparten una sola pared, cierre posterior de E presente |
| Puertas independientes, operables y colisionadores sincronizados | Barrido en once ángulos por puerta; colisionador y hoja con la misma matriz; barrido sin choques con mobiliario; comandos por ID sin alterar las otras acciones |
| Bloqueo simulado coherente | Apertura denegada al bloquear; el bloqueo detiene también una animación ya programada; desbloqueo y lectura de estado comprobados |
| Circulación y accesos | Diez rutas con radio QA 0,18, paso 0,1 y salto máximo 0,06, sobre suelo real del modelo; puertas abiertas. [routes.json](evidence/phase02/routes.json) |
| Seguridad cerrada/abierta | Cerrada bloquea el recorrido hacia el fondo con las otras puertas abiertas; abierta libera el corredor. No es certificación de acceso real |
| Cafetería sin pods y E adicional | Dos mesas de cafetería separadas de la agrupación E de seis puestos; comprobado por IDs/tipos |
| Cuatro TVs independientes | Cuatro cuerpos/pantallas, estados de prueba y materiales distintos, imágenes empaquetadas y UV válidos |
| Conservación | 577 archivos originales intactos y revisión exacta del plan remoto 8490e1a preservada; maestro de cafetería preservado por SHA256; anclas y mesas/asientos A–D comprobados |

Las rutas cubren recepción, espera, zona social de cafetería, barra, reuniones y A–E. Su cálculo es una herramienta de QA del modelo reconstruido, no un nuevo motor de simulación o navegación del producto. No certifica escala métrica, accesibilidad normativa ni evacuación. La interacción en navegador y física de PlayCanvas corresponden a la Fase 05.

## Inspección visual

Los renders finales y la revisión del agente se registran en `evidence/phase02/renders.json` y `visual-review.json`. El plano SVG muestra IDs, puertas, rampa, TVs y los recorridos. Las capturas Cycles muestran la distribución, perfiles, E al fondo y una vista interior. No se presenta el render de referencia como acabado premium definitivo: materiales, iluminación por circuitos y optimización se trabajan en Fase 04.

## Fallos detectados y resueltos

- La primera bisagra de reuniones rozaba una silla en el giro. Se desplazó dentro de su mismo frente y se repitió el barrido completo; no se movió la silla para esconder el problema. [Fallo original](evidence/phase02/first-door-collision.txt).
- La mampara compartida D/E estaba duplicada por una condición de reutilización invertida y se veía oscura. Se conserva una sola pared compartida y se cierra correctamente el fondo de E. Se añade la prueba de paneles coincidentes. [Render rechazado](evidence/phase02/rejected-duplicate-wall.png).
- Se reforzó el bloqueo para detener animaciones pendientes y se añadió prueba explícita. Las cuatro pantallas tienen UV y texturas reales de prueba, no solo colores de material.
- Un primer checker se inició antes de terminar el constructor y no encontró el inventario; otro intento tuvo un error de indentación en el checker. Se conservan ambos logs. La ejecución final secuencia construcción → validación y propaga errores con `--python-exit-code 1`; los fallos iniciales no cuentan como PASS.

## Reproducir y operar en Blender

Desde `/workspace/Entity`, con el maestro `office-cafe-L.blend` disponible:

```sh
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/build-phase02.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/check-phase02.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/inventory-phase02.py
python3 simulation/spatial-office/plan-phase02.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/render-phase02.py
```

Si falta el maestro de cafetería, reproducir primero las fases anteriores con sus constructores documentados. Sin dependencias nuevas ni servicios. Se reutilizan Blender, Cycles, BVH y Python estándar. No se cambian fuentes, backend, frontend ni Gaussian.

Abrir `office-phase02.blend` y reproducir la línea de tiempo para ver las puertas. El texto interno «Phase02 door controls» documenta comandos locales por ID. Desde la consola Python de Blender, con la ruta `simulation/spatial-office` en `sys.path`:

```python
from doors import command, query
command('sim:p2:door:A', 'open')  # transición de 30 frames
query('sim:p2:door:A')
# operaciones: open, close, lock, unlock
```

La consulta deriva el estado del ángulo actual: no finge que una transición pendiente ya terminó. El proxy se mueve con el pivote; esta entrega no acredita todavía motor físico o controles web. Los campos de posición de procedencia heredados se conservan como historia; `phase02-full-inventory.json` contiene la pose mundial actual de todos los objetos a frame 1, incluidas las piezas estimadas redistribuidas.

## Límites y siguiente fase

No hay integración Core, control de acceso real, personajes ni nueva aplicación PlayCanvas en esta fase. No se ejecutaron suites de backend/frontend o CI remoto: el código original permanece intacto. Los shaders/render CPU de referencia tienen ruido y las plantas son simplificadas. No se declara aceptada por humano. La actualización remota del plan autoriza continuar internamente por Fases 03 y 04, con aprobación obligatoria antes de PlayCanvas (05).

Secuencia vigente: completar la C en Fase03, iluminación/materiales/tiempo y dispositivos en Fase04, y detenerse para revisión humana antes de la Fase05 de PlayCanvas. La numeración antigua de materiales/visor queda sustituida por el plan remoto 8490e1a.

## Actualización remota conservada

Se detectaron e incorporaron por rebase los commits c4ae146..8490e1a del operador, sin merge ni sobrescritura de su plan. La única diferencia respecto del snapshot inicial de 578 archivos originales es ese plan actualizado externamente; su SHA256 exacto y commit se verifican mediante evidence/upstream-revisions.json. Backend, frontend, Gaussian y handoff permanecen byte-idénticos. El Gate02 final tiene 295 comprobaciones y diez rutas; los registros anteriores de 293 pertenecen a la ejecución previa a esta corrección.
