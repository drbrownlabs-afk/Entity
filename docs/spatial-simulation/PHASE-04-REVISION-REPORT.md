# Revisión de mobiliario y calidad arquitectónica — Fase 04

Fecha: 2026-11-08. Rama `codex/spatial-simulation`, posterior a la entrega `e75987f`. Revisión pedida por el operador; no autoriza PlayCanvas ni Mixamo. Estado: trabajo de acabado y revisión visual, sin aceptación humana automática.

## Cambios solicitados

- Comedor: cuatro mesas y catorce sillas, frente a dos mesas y ocho sillas anteriores; se conservan cuatro taburetes de barra. No se amplía el perímetro ni se cambia el pasillo principal.
- Se retira el grupo concreto de sillas blancas de visita y se colocan dos sofás. La orden actual del operador sustituye la etiqueta anterior de recepción para el uso de esos asientos. El mostrador/kiosco sigue en su lugar y las anclas originales no se reescriben. El sofá de la otra zona de espera permanece.
- Lounge: dos sofás profesionales en acabado neutro, butaca, puf, mesas, alfombra con mapas de tejido, plantas, libros, flores y arte. La nueva distribución se adapta a la huella del lounge existente.
- Reuniones: pantalla independiente grande, 2,35 × 1,32 unidades relativas, con soporte/acabado y barra de sonido. No se atribuyen pulgadas o medidas certificadas.
- Baño: señalización BAÑO/WC, lavabo, espejo, inodoro y acabados dentro del bloque opaco existente. Las vistas de inspección están fuera del recinto. Solo la captura arquitectónica indicada abre su puerta; no hay personas ni cámaras de vigilancia dentro.
- Las dos cabinas permanecen en su sitio y mantienen sus puertas y huella; se añaden rótulos, detalle de paneles y terminal telefónico de simulación.

## Calidad y procedencia

Se integran seis modelos profesionales existentes con geometría y mapas originales de alta calidad: GlamVelvetSofa, SheenWoodLeatherSofa, SheenChair, DiffuseTransmissionPlant, GlassVaseFlowers y SpecularSilkPouf. Proceden de la colección oficial Khronos glTF-Sample-Assets, con commit y SHA256 fijados. [Atribución, licencias y modificaciones](../../simulation/spatial-office/assets/archviz/ASSETS-NOTICE.md). No se editan los archivos GLB descargados; se modifican las instancias de la escena.

Se mantienen UV, normales, rugosidad y detalles de tapizados. Hay suelo PBR 2K, alfombra con color/normal, microrelieve de pintura, materiales de vidrio dieléctricos (IOR 1,52), madera con mapas, metal satinado, herrajes, teclados con teclas, ratones/alfombrillas y respaldos ergonómicos refinados en sus posiciones originales. La vegetación es geometría con textura; el muro verde y los colgantes dejan de usar la aproximación de esferas.

El cielo procedural Nishita y un HDRI CC0 se usan como recursos de luz/reflejo. El HDRI es un contexto urbano genérico de Potsdamer Platz, no una identificación geográfica del edificio. La hora modifica sol/cielo y brillo de contexto. Continúan desconocidas las coordenadas reales del proyecto.

La iluminación indirecta se modela con fuentes y emisores conmutables, sin hornear su contribución artificial en un albedo o lightmap fijo. El maestro contiene 71 luminarias en 17 circuitos, 19 puertas y seis pantallas. La energía de Blender y la radiancia de las lentes no se presentan como una calibración fotométrica física.

Los JPG 1290/1288/1286 aportados por el operador se conservan como **objetivo visual mínimo**, con hashes y rol explícito en `evidence/phase04-revision/operator-references.json`. No se usan como capturas de ejecución ni para sustituir píxeles de las imágenes de Blender.

## Archivo y controles

El nuevo maestro es `simulation/spatial-office/output/office-phase04-revision.blend`; el maestro anterior `office-phase04.blend` permanece intacto. Las texturas están empaquetadas. La ficha de dispositivos actual es `device-manifest-revision.json` y el catálogo es `revision-full-inventory.json`.

Dentro del checkout, abrir el nuevo maestro y ejecutar su texto **START ENTITY visual controls** para habilitar el panel ENTITY. El bootstrap resuelve los scripts desde la ubicación del archivo. Al descargar únicamente el `.blend`, la geometría/materiales siguen visibles; los controles requieren los scripts contiguos del repositorio. No se habilita autoejecución global ni se conecta hardware/Core.

## Verificación

Los registros de `evidence/phase04-revision/` contienen builds, fallos corregidos, gate actual, preservación de matrices, comprobación de mamparas, barrido de puertas, rutas y controles. El gate nunca concede aceptación humana. Los renders finales y su revisión visual deben estar vinculados por hash a este maestro antes de cerrar la entrega.

Se mantiene la misma prueba geométrica de rutas: radio relativo 0,18, cuadrícula 0,10 y salto de nivel máximo 0,06. Las aproximaciones al comedor se ajustan a las mesas nuevas, conservando obstáculos y criterios. No equivale a certificación de accesibilidad o evacuación.

El backend, frontend, Gaussian y archivos originales de handoff se comprueban contra los hashes protegidos. La arquitectura y poses heredadas se comparan con el inventario de Fase04; solo se retira explícitamente el mobiliario/vegetación sustituido. No hay exportación arquitectónica definitiva ni implementación PlayCanvas. La transferencia de materiales avanzados, WebP, sheen/transmisión y luces requiere comparación en la futura Fase05, una vez autorizada.

## Correcciones posteriores: diseño de luz y vidrio

La petición posterior del operador prioriza las tiras cálidas ocultas, esquinas, vegetación y la reflectividad de **mamparas/ventanales**. Diseño actual: luminarias de trabajo 3200 K; acentos/decoración 2700 K. Perfiles continuos en L con LED oculto, revelado vertical en esquina, baño de luz sobre muro verde y seis difusores cálidos bajo las jardineras originales. Todos siguen su circuito/estado individual, incluida la emisión visible. Las temperaturas son nominales de diseño, no medidas espectrales.

Los treinta equipos tienen carcasa con radios y canto fino, soporte curvo, cristal frontal, cámara/micrófono, teclas con leyendas, ratón y alfombrilla; E recibe también pantallas/periféricos completos. Las posiciones de los monitores y mesas existentes no cambian. Los sofás reciben albedo tejido de procedencia profesional, recoloreado y horneado **solo como color**, sin iluminación; normal map independiente. Follaje real con transmisión de hoja fina y copas más densas.

**135 piezas arquitectónicas de vidrio** auditadas: IOR 1,52, rugosidad 0,01, transmisión 1, alfa 1 y reflexión Fresnel; el entorno y las luminarias se reflejan según el ángulo. Registro: `glazing-audit.json`. No se convierte el WC en vidrio. Capturas oblicuas y cercanas previstas para revisar el resultado real.

Último gate ejecutado: **676 PASS / 21 rutas**, incluyendo los controles embebidos, 71 luces, treinta equipos y auditoría óptica. La captura 1680×1120/128 anterior se canceló al recibir la corrección de iluminación del operador; su log es histórico, no un render final. La revisión utiliza 1440×960/hasta96 muestras para vistas principales y 1280×854/hasta64 para el resto, con Cycles y OIDN guiado. Los metadatos fijan el SHA del maestro al cargarlo y comprueban que no cambie durante cada captura.

## Jardín vertical continuo, según Gaussian

La vista original `docs/evidence/phase09/survey/front-return.jpg` se inspeccionó directamente: cobertura completa de follaje fino. La versión dispersa anterior se descarta visualmente. Se implementan 2170 grupos pequeños de follaje con variación determinista de tamaño, profundidad y tono, sobre sustrato orgánico; comparten tres variantes de malla/material y conservan UV, normales y máscara alfa del asset profesional. Las mallas de pared se simplifican a escala pequeña; los modelos de origen completos se conservan. Las plantas de suelo y colgantes mantienen detalle completo. Se corrige la máscara alfa de la transmisión fina para evitar hojas opacas/pálidas.

Gate actual: **678 PASS / 21 rutas**; maestro SHA256 `ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f`. Se añaden vistas frontal/cercana del jardín y desde los puestos. Las capturas de revisión se están produciendo; aceptación premium pendiente. El Gaussian original y sus capturas no se modifican.
