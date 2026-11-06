# ENTITY OS — Objetivos, restricciones y definición de éxito
Actualizado: 2026-11-06. Fuente de verdad: docs/ENTITY-MASTER-SPEC.md.

## Meta de producto
Demostrar que ENTITY OS puede percibir un espacio físico, contextualizar observaciones, mantener entidades/estado/relaciones/eventos/memoria persistentes, responder consultas mediante IA situada y ejecutar capacidades autorizadas sobre dispositivos reales; con hardware intercambiable sin modificar el Core.

## Dos entregables
A. Producto real: Core + Edge + conectores + percepción + acciones verificadas. Primera instalación transportable con Orbbec, Smart TV y tres proyectores disponibles; smart plugs/sensores aún por adquirir. 
B. ENTITY Experience: demo web de ala de centro comercial, con mundo 3D y CCTV virtual sincronizados, consultas y acciones sobre una simulación única. Nunca presentar simulación como instalación real.

## Restricciones innegociables
- Core agnóstico de fabricantes, cámaras, SDKs, sensores, LLM y motores de render.
- Entidades, estado, relaciones explícitas, eventos, memoria y capacidades son inseparables en el MVP.
- No crear algoritmos sofisticados de relaciones latentes/geodésicas, efecto mariposa, 4DGS, re-ID biométrico ni multiagente en esta etapa.
- No inventar disponibilidad de hardware, compatibilidad, pruebas, despliegues ni resultados.
- Datos y credenciales reales fuera de Git. Operaciones sobre hardware y servicios requieren permisos; cambios peligrosos requieren confirmación.
- No reemplazar código funcional sin pruebas de regresión ni destruir historial.
- Simuladores usan los mismos contratos que los conectores reales.

## Definición de éxito
1. Reiniciar Core no borra entidades, estados, relaciones ni eventos.
2. Edge procesa una Orbbec real y registra al menos presencia/personas en zonas configuradas.
3. Cambiar de Orbbec a cámara RTSP compatible no obliga a cambiar API ni modelo Core.
4. Un sensor/API externo ingresa datos a la misma ontología.
5. Un agente consulta información con procedencia y ejecuta una capacidad permitida con resultado verificado.
6. Se documentan y prueban fallos, reconexiones y deduplicación.
7. El centro comercial simulado usa un único estado para 3D, CCTV y entidades.
8. El operador no programador puede iniciar y verificar la demostración con instrucciones claras.

## Definición de 'terminado'
No equivale a 'código escrito'. Requiere: implementación versionada, pruebas ejecutadas con resultados, evidencia observable, errores conocidos, actualización de estado/bitácora, revisión humana. Una fase puede quedar parcial o bloqueada.
