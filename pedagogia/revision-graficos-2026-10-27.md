# Revisión de gráficos interactivos y adaptación de pantalla

27 de octubre de 2026. Revisión conjunta de los simuladores de asignatura, los ocho ejemplos de Explora una idea, sus seis vistas 3D y los tres experimentos activos del Laboratorio visual.

## Correcciones

- Regresión: el dominio vertical incluye la predicción máxima permitida (10 t/ha); la recta y los residuos ya no desaparecen al combinar pendiente 0,05 e intercepto 2. Se conservan las seis observaciones.
- Controles: los resultados responden a `input` y `change`, sin un segundo redibujado para el mismo valor. Los controles se conservan mientras cambian figuras, cifras y explicaciones.
- Entrenamiento: la tasa cambia una previsualización identificada como pendiente. El parámetro y su historial cambian únicamente al aplicar el paso. Los reinicios y límites de pasos conservan un estado finito y explican cómo continuar.
- DBSCAN: ambos ejes usan 1,5 píxeles por punto porcentual; el dominio deja margen para ver completo el radio máximo de cualquier centro. Una selección permite comprobar vecinos, núcleo, borde y ruido sin cambiar los registros.
- Vecinos sin escalar: barras ordenadas muestran las distancias realmente calculadas; el dibujo anterior utilizaba escalas visuales distintas que sugerían cercanías falsas. La dispersión estandarizada usa escalas iguales y un dominio que incluye la consulta y los históricos.
- GridWorld: se explica cada movimiento, bloqueo y final de episodio. Llegar a la meta, caer al pozo y reiniciar mantienen los pasos y recompensas correctos.
- Deep Learning: tablas numéricas completas mediante desplazamiento local, controles y resumen accesibles en pantallas estrechas, matrices apiladas por el ancho real. La leyenda distingue una caja conservada de una descartada. Barras muestran el reparto actual de atención y el estado de secuencia.
- Explora una idea: restablecer elimina la comparación guardada; editar píxeles desmarca el caso fijo; seleccionar una fila mantiene el foco en esa tabla. Comparaciones y dibujos alternativos tienen identificadores SVG únicos. Ejes de entrenamiento y números de pasos evitan superposición al divergir.
- Las figuras de asignatura y de Explora una idea caben completas; una opción amplía etiquetas y permite desplazamiento local. Las tablas conservan todos sus valores. No se ocultan desbordamientos globales para disimular contenido recortado.
- 3D: encuadre desde los límites del contenido y etiquetas; ajuste al tamaño y al giro sin reiniciar cámara. Botones de inspección y selección persistentes; en contenedores estrechos se identifica un objeto a la vez y todos los nombres siguen disponibles en botones. Se conserva el esquema alternativo 2D si falla la vista tridimensional.
- Laboratorio visual: grids, selects, filas de vecinos, cabecera y piezas adaptados a móvil; gráficos grandes con desplazamiento local; animación de conexiones positivas visible; reinicios completos y pieza seleccionada sincronizada.

## Validación

- 183 pruebas automáticas aprobadas: 32 nuevas, además de las 151 existentes. Incluyen los 12 tipos del simulador común, cinco exploradores DL, ocho ideas y tres laboratorios. No cambian guías ni cuadernos de los dos primeros encuentros, calendario, roles o cálculo del progreso.
- Regresiones del laboratorio: 101 umbrales, 24 combinaciones de vecinos, cálculo y entrenamiento de la red, reproducción, pausa, cambio de experimento y reinicios.
- Encuadre 3D: 225 combinaciones de tamaño, giro, elevación y altura; 225 posiciones de etiquetas.
- Navegador real: cambios de rango mínimo/máximo, opciones, pasos y reinicios; casos iniciales, actualización numérica, entrenamiento y fin de episodio. Giro de cámara, selección de objeto y cambio entre 2D/3D con los mismos valores.
- Adaptación comprobada a 320, 390, 768, 1024 y 1440 px: veinte temas interactivos en ambos modos (200 comprobaciones), ocho ideas con comparación en ambos modos y ampliación móvil (88), tres laboratorios en ambos modos (30) y seis escenas 3D con valores extremos (30). Sin desbordamiento global en las 348 comprobaciones.
- Pruebas locales con identidad sintética y reloj de revisión temporal. No se modifica progreso de estudiantes reales ni se publican archivos de prueba del navegador.

Las versiones de entrada e importaciones de módulos se actualizan juntas para evitar mezclar código nuevo con archivos anteriores guardados por el navegador.
