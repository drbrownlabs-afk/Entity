# Fase05 — clic para caminar y publicación

Estado: IMPLEMENTACIÓN EN VALIDACIÓN. No aprobación humana; no iniciar Fase06.

La orden vigente cancela pendientes de 04.5 y bloquea 06 hasta revisión personal del visor publicado. Se conserva el maestro Blender, GLB, arquitectura y calidad visual existentes; esta entrega no resuelve ni aprueba la equivalencia visual pendiente.

## Implementación

- PathFinding.js 0.4.18 (MIT), A* con ocho vecinos sin cortar esquinas. Adaptador al suelo exportado de 10 cm, radio de cápsula original, alturas de rampa y límite de desnivel existentes. Reutiliza el sistema de colisiones; no se reconstruye geometría ni se crea otro visor.
- Obstáculos estáticos indexados en celdas de un metro para reducir consultas. Puertas incorporadas al plan de ruta según posición real de la hoja. Cada segmento se verifica en pasos de 2.5 cm y cada avance vuelve a comprobar el paso; si cambia una puerta, recalcula o detiene sin atravesarla.
- Marcha hasta 1.4 m/s, aceleración y frenado, altura de ojos original. Mirada independiente, nuevo destino con otro toque y cancelación al cambiar de vista o pulsar Escape. Nunca teletransporta a un destino inaccesible.
- Suelo, acabados transitables, rampa y alfombras envían destinos solamente en Walk Mode. Otros objetos conservan selección/fichas y controles de puertas, luces y televisores. Arrastre, cancelación, botón secundario y multitáctil no envían destinos. Eliminados controles de flechas y joystick; mismo gesto en móvil/escritorio.
- Recursos y decodificadores respetan la ruta base Vite, necesaria para Pages. No se recorta el modelo ni se reducen texturas.

## Publicación

Ruta prevista: https://drbrownlabs-afk.github.io/Entity/spatial-simulation/

Workflow `spatial-pages.yml`, activado únicamente por la rama `codex/spatial-simulation`. Construye el visor y añade su carpeta a una copia de lectura de los artefactos publicados en `gh-pages`, conservando la web original. Publica mediante el servicio Pages y un artefacto; no hace checkout, commit ni push de cambios en main/gh-pages. Incluye manifiesto de commit y prueba pública con Chromium después del despliegue. El estado efectivo del despliegue y verificación se registra por separado, no se infiere de este workflow.

## Validación reproducible

```
npm --prefix apps/spatial-simulation ci
npm --prefix apps/spatial-simulation test
npm --prefix apps/spatial-simulation run build -- --base=/Entity/spatial-simulation/
# En apps/spatial-simulation, ejecutar vite preview con la misma base.
SPATIAL_TEST_URL=http://127.0.0.1:5181/Entity/spatial-simulation/ npm --prefix apps/spatial-simulation run test:walk-browser
```

Pruebas: las 21 rutas aprobadas, puerta cerrada/abierta y cierre durante marcha, redirección, velocidad, suelo continuo y rampa, esquinas, agujeros y desniveles, clasificación de gestos. Chromium comprueba entrada nativa de ratón/toque, selección/controles, vista general y carga desde subruta. El avance completo del controlador se acelera de forma determinista en la prueba para no convertir SwiftShader en un benchmark de móvil real. Emulación táctil no acredita rendimiento en hardware móvil físico.
