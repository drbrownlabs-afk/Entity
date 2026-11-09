# Fase04.5 — EN EJECUCIÓN, no aprobada

Base del operador: 45af25a, rama exclusiva codex/spatial-simulation. Se incorporaron sus dos commits mediante avance directo de esta misma rama; sin commit de merge, sin tocar main.

Implementado: perfil reversible «Referencia Golden Hour», resolución nativa, MSAA4, sombras de todas las luminarias, sol 4096 y reflejos locales 512. Se conservan perfiles anteriores, instancias e interacciones. Al seleccionar el perfil se fija 17:00 y se pausa el reloj.

Render de referencia Blender iniciado con maestro aprobado sin guardar, cámara revision-lounge, 1440×960, Cycles96, 17:00. Estado y exposición reales en evidence/phase04-5/blender-conditions.json. Captura PlayCanvas iniciada con misma hora/cámara y perfil de referencia. Los archivos de ejecución indican progreso o fallos; no son prueba de captura terminada.

Pruebas unitarias y compilación ejecutadas. Pendientes: completar capturas; inventario PBR de tres etapas; carta de control del atlas; A/B independientes; equivalencia de ambiente e indirecta Golden Hour (las bases HDR actuales proceden de otra condición y no acreditan equivalencia a 17:00); comparación de los seis encuadres y revisión humana. No se inicia optimización móvil ni se declara gate completo.

## Gate vigente del operador: una imagen Blender primero

Se suspende toda nueva comparación PlayCanvas y toda cola de otras vistas hasta que el operador juzgue una sola imagen Blender. No basta una previsualización con ruido. La cobertura del coworking completo permanece pendiente, no cancelada.

El perfil máximo 1920×1280 / 256 muestras permanece disponible sin cambios. Para esta revisión individual se ejecuta Cycles a 1440×960, hasta 128 muestras adaptativas (umbral 0.02, mínimo 32), conservando transporte, geometría, materiales, luces, cámara y hora. Se guardan PNG crudo y guías reales albedo/normal, con salida OIDN separada. La ruta histórica `blender-preview` es un nombre técnico, no implica reducción geométrica ni aprobación de calidad. Esta ejecución sustituye trabajos previos interrumpidos; el tiempo y la finalización se registrarán únicamente al terminar.

La generación de esta imagen no demuestra todavía equivalencia de transporte Blender→PlayCanvas. El addendum transferible sigue siendo un gate pendiente; no se presenta el render como prueba de transferencia resuelta.

## Orden posterior: cancelar pendientes de 04.5 y validar Fase05

El operador cancela los trabajos pendientes de esta fase y prioriza Walk Mode y publicación web. No se generan nuevas vistas ni se calibra PlayCanvas contra Cycles en esta tarea. Se preservan los archivos y las evidencias ya producidos. La Fase04.5 no está aprobada; Fase06 queda bloqueada por la orden más reciente hasta aprobación personal de Fase05 en navegador, aunque el plan previo autorizaba avanzar.
