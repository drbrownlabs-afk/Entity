# Pendientes para financiar y validar después del MVP

Fase 08 EN VALIDACIÓN. Orden propuesto, no autorización de nuevas implementaciones. Los esfuerzos son estimaciones de ingeniería, no presupuestos ni fechas comprometidas; dependen de modelos, permisos e infraestructura concretos.

| Prioridad | Trabajo y resultado comprobable | Esfuerzo orientativo | Dependencia / coste por confirmar |
|---|---|---|---|
| P0 | Revisión humana de la demo y del informe; aceptación de versión o lista de defectos | 0.5–1 día | Operador; sin compras necesarias |
| P0 antes de Internet | Autenticación y permisos en todas las rutas Core, TLS/reverse proxy, límites de petición y retención; test de acceso indebido | 3–7 días | Servidor y política de usuarios; Core actual solo desarrollo local |
| P0 antes de datos reales | Backup periódico/cifrado fuera del host y restauración programada; política de datos y secretos | 2–4 días | Almacenamiento y custodio; prueba SQLite local ya existe |
| P1 | Safari/iOS/Android físicos, accesibilidad y rendimiento con GPU; corregir defectos medidos | 2–4 días | Teléfonos de prueba, no disponibles/validados en esta fase |
| P1 | Identificar modelo Orbbec disponible e integrar SDK/adaptador; capturar/calibrar dos zonas y repetir desconexión | 3–8 días | Modelo, acceso USB/SDK/licencia; hardware declarado por operador, sin acceso actual |
| P1 | TV/proyectores disponibles: HDMI/salida audiovisual y readback apropiado; delimitar qué confirma software y qué requiere operador/sensor | 2–5 días | Acceso a equipos y puertos concretos; no asumir control eléctrico |
| P1 | Piloto autorizado RTSP/NVR/MQTT con datos reales y perfil del sitio; medir precisión/falsas alarmas | 3–10 días | Permisos, credenciales y muestras del sistema tercero |
| P1 | Proveedor OpenAI real con clave segura: consultas/timeout/coste y políticas; comparar con fixture | 1–3 días | Clave/presupuesto por consumo, sin inferencia remota probada hoy |
| P2 según carga | Medir concurrencia, pérdida y latencia para 1/4/12 cámaras antes de elegir VPS/GPU y PostgreSQL/PostGIS | 3–7 días | Fuente de carga y objetivos; SQLite actual no acredita esa escala |
| P2 según piloto | Proyección NGSI-LD mediante adaptador hacia Scorpio externo y contrato de sincronización | 3–6 días | Broker y requisitos concretos; Core no se sustituye |
| P2 según fabricante | ONVIF/NVR/VMS, Modbus/BACnet/OPC UA mediante gateways maduros | Por evaluar tras inventario | Dispositivos y permisos; matriz Fase 06 no prueba hardware ajeno |

Costes recurrentes posibles: VPS, almacenamiento de backup, consumo del LLM y licencias específicas. No se inventan precios sin proveedor/región/volumen. Smart plugs/sensores/12 cámaras son compras propuestas, no disponibilidad confirmada. No hacen falta para revisar el MVP simulado actual. No se incluye reconocimiento biométrico, relaciones latentes ni multiagentes sofisticados.
