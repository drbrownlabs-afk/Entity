# Auditoría de condiciones de iluminación — en curso

Se suspende la comparación de materiales y la generación de capturas de entrega hasta equilibrar iluminación. Maestro Blender intacto. No se añaden luminarias ni se aplica un aumento global para ocultar zonas oscuras.

Comparación del código ejecutado de Blender (`archviz_environment.py` y `environment.py`) con el visor:

| Contribución | Blender | Discrepancia encontrada / corrección |
|---|---|---|
| Política automática | fracción diurna `min(1, sin(elevación)/0.65)` | El visor omitía normalización y saturación. Corregido; a mediodía cada rol alcanza exactamente su mínimo configurado. |
| Sol | energía `2.5*sin(elevación)`; color lineal `(1, .68+.3*f, .42+.55*f)` | El visor utilizaba otra energía y otra paleta. Parámetros fuente restaurados; pendiente validar equivalencia fotométrica entre motores. |
| Exposición | EV constante 0.3 | El visor variaba exposición con el día. Se utiliza el multiplicador lineal `2^EV` constante. |
| Ambiente/exterior | Nishita para difuso; contexto HDR con reglas de rayos; intensidades distintas | El visor usa HDR urbano global y atlas locales. No es una equivalencia demostrada con el mundo de Cycles. Requiere separación y medición; no se considera resuelto. |
| Indirecta ambiental | Transporte de luz por la escena | HDR precalculado para 183 receptores; falta comprobar por superficie valores y orientación de UV contra Blender. |
| Indirecta artificial | Depende de cada fuente | Base única modulada por promedio de circuito: aproximación insuficiente para demostrar equivalencia por superficie o por lámpara. Requiere descomposición/calibración, conservando OFF=0. |
| Directa artificial | Potencia, área, orientación y color del maestro | Área y orientación transferidas; conversión de potencia mediante factor provisional 120 todavía no calibrada. No se declara equivalencia por compartir valores nominales. |

Orden de trabajo pendiente: medir por separado ambiente/exterior, sol, directa e indirecta en superficies representativas (techo, pared, suelo y mobiliario); verificar unidades, UV y dobles contribuciones; equilibrar cada componente. Solo después comparar con cámara/hora/estados idénticos y retomar materiales/reflejos/sombras.

Las correcciones de parámetros anteriores eliminan discrepancias verificadas en código; no demuestran todavía correspondencia visual. Gate05 ABIERTO. Sin nuevas capturas en este lote.
