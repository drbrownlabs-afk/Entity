# Fase04.5 — EN EJECUCIÓN, no aprobada

Base del operador: 45af25a, rama exclusiva codex/spatial-simulation. Se incorporaron sus dos commits mediante avance directo de esta misma rama; sin commit de merge, sin tocar main.

Implementado: perfil reversible «Referencia Golden Hour», resolución nativa, MSAA4, sombras de todas las luminarias, sol 4096 y reflejos locales 512. Se conservan perfiles anteriores, instancias e interacciones. Al seleccionar el perfil se fija 17:00 y se pausa el reloj.

Render de referencia Blender iniciado con maestro aprobado sin guardar, cámara revision-lounge, 1440×960, Cycles96, 17:00. Estado y exposición reales en evidence/phase04-5/blender-conditions.json. Captura PlayCanvas iniciada con misma hora/cámara y perfil de referencia. Los archivos de ejecución indican progreso o fallos; no son prueba de captura terminada.

Pruebas unitarias y compilación ejecutadas. Pendientes: completar capturas; inventario PBR de tres etapas; carta de control del atlas; A/B independientes; equivalencia de ambiente e indirecta Golden Hour (las bases HDR actuales proceden de otra condición y no acreditan equivalencia a 17:00); comparación de los seis encuadres y revisión humana. No se inicia optimización móvil ni se declara gate completo.
