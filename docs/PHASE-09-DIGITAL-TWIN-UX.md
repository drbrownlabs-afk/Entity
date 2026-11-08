# Fase 09 — producto: gemelo digital Dollhouse-first

Decisión del operador: la pantalla principal no es un walkthrough ni un visor de SuperSplat. Es un **gemelo digital 3D tipo Dollhouse**, en perspectiva orbital, abierto por arriba con el techo recortado/retirado para ver interiores. Navegación interior solo secundaria.

## Requisitos de experiencia
1. Vista inicial Dollhouse del coworking original, giro orbital, zoom, selección 3D; visualizar cuatro conjuntos de mesas: A/B oficinas privadas completas, C/D públicos. No inventar quinta mesa E ni staff C.
2. Retirar/recortar techo **en el render** mediante técnica adecuada para Gaussian Splatting (clipping, máscaras o representación híbrida), sin mutilar el asset original. Verificar resultado visual desktop/móvil, no dar por aprobado el encuadre superior de inspección existente como Dollhouse de producto. Preservar paredes y mobiliario reconocibles.
3. Entidades seleccionables en el espacio: Person, Camera, Zone, Resource, Device. Selección abre panel contextual ENTITY con ID, tipo, estado, relaciones entrantes/salientes, eventos/memoria, permisos y acciones disponibles. Mostrar aristas/relaciones con filtro legible, no todas superpuestas.
4. Personajes 3D presentes y situados conforme al estado y las poses verificadas de Core; nunca inventar posiciones. Timeline/clock para observar cambios. Al seleccionar una persona, mostrar sus relaciones y trazabilidad.
5. Cámaras CCTV visibles como objetos/frustums o indicadores propios ENTITY, seleccionables, con panel de cobertura, estado y feed/vista del mismo mundo 3D. Diferenciar cámaras virtuales de físicas.
6. Interfaz enteramente ENTITY: quitar UI, anotaciones, retícula, botones y panel de inventario de SuperSplat. El SDK/SSOG puede ser motor interno. Herramientas de calibración solo en modo diagnóstico.
7. Página demo pública debe ofrecer experiencia comprobable sin pedir al visitante URL de servidor/usuario/contraseña. Si requiere Core, desplegar backend demo accesible HTTPS con acceso seguro o proporcionar modo demo local claramente identificado, con datos sintéticos coherentes; no fingir estado vivo ni Core conectado.
8. Interacción de prueba: Dollhouse inicial -> seleccionar Carlos -> ver relaciones -> seleccionar cámara -> ver feed/cobertura -> seleccionar A -> ver reserva/ocupación -> reproducir jornada -> comprobar cambios en escena y memoria -> entrar al interior y regresar a Dollhouse.
9. Validación: capturas reales desktop/móvil y E2E visual/funcional sobre URL publicada, selección/routing de entidad, cambios sincronizados con Core, ausencia de controles SuperSplat. La carga del SSOG y pruebas unitarias de API no son aceptación visual.

## Arquitectura
Core es el modelo computable del mundo y fuente de verdad. El Dollhouse es la representación espacial/visual interactiva; no reemplaza Core ni define relaciones a partir de hotspots. La escena original sirve como soporte visual. Todo objeto/selección se resuelve a ID de entidad de Core. No reducir la corrección a ocultar botones CSS.

**Estado:** especificación vinculante registrada; implementación y validación pendientes. No declarar fase cerrada.
