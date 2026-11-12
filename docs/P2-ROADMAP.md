# P2 — Roadmap vigente del coworking (reordenado 2026-11-12)

**Decisión del operador:** P2-09 es EXCLUSIVAMENTE cámaras/percepción. CRM, reservas, accesos y otros sistemas externos no pertenecen a P2-09. Se conservan los anteriores registros en el historial Git. No ejecutar fases automáticamente ni reconstruir el coworking. P1 es propietario de Core/APIs/adaptadores compartidos.

| Fase | Alcance | Estado |
|---|---|---|
| 01–05 | Escenario Blender/PlayCanvas y arquitectura existente | Conservar |
| 06 | 12 personajes ya entidadizados; Mixamo, animaciones, rutas, estados, colisiones | Retomar solo tras 09.18 y nueva orden del operador |
| 07 | Integración visual de personajes, navegación y comportamiento en el coworking | Después de 06 |
| 08 | Entidadización del coworking y vínculo con P1 Core | 460 entidades, 1185 relaciones y 290 mapeos documentados; aceptación pendiente |
| **09** | **Solo cámaras/percepción:** ocho sensores, calibración, detección, MOT, ReID/MTMC, grafo espacial, continuidad anónima y persistencia en el mismo Core | 09.17 gate técnico superado; 09.18 ensayos independientes; **09.19 siguiente prueba prioritaria: rendimiento e inferencia causal en vivo, obligatoria antes del cierre P2-09** |
| **10** | **Integración de P2-06/07 y P2-09:** doce personas simultáneas, ocho cámaras, cruces, oclusiones, desapariciones, reapariciones, identidades similares, tracking causal continuo y persistencia Core | Después de 06, 07 y 09.18; no crear otro motor de percepción |
| 11 | Sistemas externos: reservas, CRM, accesos, Drive, membresías, facturación, IT, mantenimiento y demás integraciones | Diferido; no implementar ahora |
| 12 | Sincronización operacional integral | Diferido |
| 13 | Validación de interoperabilidad E2E | Diferido |
| 14 | Escenarios operativos y evaluación contextual sin P3 multiagentes | Diferido |
| 15 | Validación integral del piloto | Diferido |

## Identidades existentes
Exactamente 12 personas de demo: Entity 2 (Carlos/Santiago), Inmerso 2 provisionales, staff 3, habituales 3, visitantes 2. Preservar identidades, organizaciones, relaciones, roles y asignaciones. Otras dos identidades técnicas históricas están fuera de esta población. Los modelos Mixamo finales aún no constan descargados/verificados. No duplicar personas ni mobiliario ni alterar geometría.

## Criterios obligatorios de P2-10
- Integrar las doce personas y sus animaciones en la escena existente; no entregar IDs internos de NPC ni ground truth al detector, ReID o Core como si fueran observaciones.
- Ocho vistas activas con múltiples personas simultáneas, apariencias similares, cruces, oclusiones, reapariciones, zonas ciegas y transiciones. Medir detección, falsos positivos, ID switches, fragmentación, asociaciones incorrectas y continuidad por cámara/persona/escenario.
- No fusionar identidades por número esperado; track anónimo no equivale a identidad civil. Sin evidencia, ubicación desconocida; no inventar presencia, trayectoria, salida ni ocupación.
- **Inferencia causal continua**: usar solo datos disponibles hasta el instante de decisión, sin futuro batch; medir latencia de captura a Core, throughput por cámara/agregado, colas, estabilidad, CPU/GPU/RAM/VRAM y recuperación. Definir objetivo medible y demostrarlo antes de llamar al sistema tiempo real.
- Persistir en el mismo P1 Core observaciones, eventos, relaciones y memoria con procedencia, idempotencia, historial, reinicio y conservación de entidades anteriores.
- Escenarios independientes y aceptación humana; distinguir simulación, prueba funcional, tiempo real y despliegue físico.

## Limitación actual que no debe ocultarse
P2-09.17: 2008 frames, 609 observaciones, 24 tracks locales, una hipótesis global anónima; 116 tests Core PASS. 4.42 imágenes/s agregadas es tasa DERIVADA de inferencia reutilizada + nueva ingesta, no wallclock de ejecución única. No alcanza 16 imágenes/s objetivo (8 cámaras a 2 FPS); MTMC es batch con evidencia futura y NO es inferencia causal en vivo. P2-09.18 debe completar cinco recorridos independientes y aceptación humana; no se declara completado aquí.

## Orden y gobierno
1. Completar P2-09.18 sin alterar sus gates; a continuación ejecutar **P2-09.19: diagnóstico de captura, YOLOX, MOT, OSNet, MTMC, HTTP/Core y optimización de pipeline causal continuo**. Medir ocho cámaras simultáneas y objetivo inicial 16 imágenes/s agregadas, latencia, colas, GPU/CPU/VRAM, pérdida de frames y persistencia. No declarar P2-09 aceptado sin demostrarlo.
2. Esperar orden explícita del operador para P2-06 **solo tras P2-09.19 y aceptación de P2-09**; después P2-07.
3. P2-10: validar conjuntamente personajes y cámaras en Core, sin sistemas externos.
4. P2-11–15: solo después y con autorización.
5. No abrir Core paralelo, no implementar P3 ni construir motores futuros. Adaptaciones compartidas pertenecen a P1.

## P2-09.19 — Diagnóstico arquitectónico de percepción continua (prioridad inmediata)

### Problema y propósito
P2-09 ha demostrado componentes de detección, seguimiento, asociación multicámara y persistencia en ENTITY Core, pero el circuito actual se apoya en análisis retrospectivo por lotes. Este mecanismo **no representa el funcionamiento operativo deseado**: ENTITY debe percibir y actualizar su modelo mientras los acontecimientos suceden, sin esperar al final de una secuencia. La cifra derivada de 4.42 imágenes/s no demuestra FPS de una ejecución continua; tampoco prueba por sí sola saturación GPU ni identifica el cuello de botella. No confundir mayor throughput con verdadera causalidad y latencia operativa.

### Encargo al agente técnico (Sol 6.1): criterio propio, no micromanagement
Revisar el **código real, arquitectura, dependencias, mediciones y evidencias** de P2-09 y su relación con P1 ENTITY Core. Determinar por qué el sistema todavía no ofrece percepción continua, cuál es el límite real y qué arquitectura o cambios permiten resolverlo. Investigar sin prejuzgar si el problema está en el modelo, la GPU, el render/captura, el flujo de datos, la inferencia, la asociación multicámara, HTTP, persistencia, sincronización o en el diseño general. No imponer de antemano una tecnología, un patrón de colas, una optimización o la conservación del batch. Cuestionar la arquitectura actual si las evidencias lo justifican, reutilizando componentes que sí aportan valor.

El resultado deseado es **percepción causal y continua desde ocho cámaras hacia el mismo ENTITY Core**, con hipótesis de identidad actualizadas progresivamente, eventos, estados, relaciones y memoria persistentes, latencia acotada y rendimiento reproducible. Las decisiones no deben depender de fotogramas futuros ni de IDs/ground truth privados del simulador. Una pérdida de visión no autoriza a inventar posición, salida, presencia ni identidad civil. No crear otro Core ni otro motor de percepción sin justificación técnica aprobada.

### Secuencia de decisión y aceptación
**Primero entregar diagnóstico arquitectónico fundamentado y propuesta de solución**: qué conservar, qué modificar, por qué, alternativas y riesgos, métricas que permiten discriminar hipótesis y evidencia de los límites actuales. Presentarlo al operador **antes de implementar una refactorización sustancial**. Después de aprobación, implementar y demostrar el funcionamiento continuo en el escenario actual con un personaje y ocho cámaras. Objetivo inicial de prueba: **16 imágenes/s agregadas (2 por cámara)**, más latencia extremo a extremo, estabilidad, pérdida de frames, capacidad de recuperación y persistencia verificadas. Medir rendimiento en ejecución única real, no sumar tiempos batch; separar inferencia, render, comunicación y Core solo en la medida necesaria para encontrar el cuello de botella. No declarar tiempo real/profesional hasta demostrarlo.

**No incorporar doce personajes, P2-06/07/10 ni CRM, reservas, accesos u otros sistemas externos.** P2-09.18 mantiene sus cinco ensayos de independencia y aceptación; P2-09.19 es el siguiente gate técnico prioritario y bloquea el avance posterior. No reescribir resultados históricos ni duplicar trabajo.

