# Revisión integral de Colab · 31 de octubre de 2026

Base: commit `8a1ff07a65a5d15507de9b08f423afa06bcfb1f6`.

## Resultado

Los ocho encuentros tienen un cuaderno principal propio. Cada uno contiene sus tres temas en orden, caso pequeño resuelto, datos y unidades, preparación incluida por tema, ejecución, lectura del resultado, pregunta razonada y límite de uso. Cada tema puede ejecutarse desde un espacio vacío y el cuaderno completo también se ejecuta en orden. Las ocho fuentes anteriores permanecen como apoyo, sin modificar sus bytes.

| Encuentro | Principal | Prácticas |
|---|---|---|
| ML 1 | `ml-encuentro-1.ipynb` | Entradas/respuesta; ausencias y mediana de entrenamiento; referencia y regresión sobre 60 fincas reservadas. |
| ML 2 | `ml-encuentro-2.ipynb` | Logística de alto rendimiento; matriz de las diez plantas; umbrales y capacidad de cuatro revisiones. |
| ML 3 | `ml-encuentro-3.ipynb` | DBSCAN; PCA con coordenada reconstruida; cuatro estimadores sobre la misma prueba. K-Means/Mean-Shift conservan su ampliación de apoyo. |
| ML 4 | `ml-encuentro-4.ipynb` | Pasado 60/futuro 24; Q-learning y demostración; referencia/candidata y casos reservados. |
| DL 1 | `dl-encuentro-1.ipynb` | Cuenta de neurona; comparación de activaciones con la misma señal; ajuste y entrenamiento de una red. |
| DL 2 | `dl-encuentro-2.ipynb` | Tipos de salida ilustrados; CNN de dígitos y filtro; inferencia con pesos previos y categorías existentes. |
| DL 3 | `dl-encuentro-3.ipynb` | LSTM y ventana; atención con A=10/B=20; Transformer de orden con patrones separados. |
| DL 4 | `dl-encuentro-4.ipynb` | Foto/propuestas/conteo/exportación; IoU y conteos sintéticos; costes de revisión frente a revisar todo. |

## Fallos de recorrido y claridad corregidos

- Los estudiantes debían localizar capítulos repartidos y los primeros seis temas no mostraban una ruta Colab detallada. Ahora los 24 temas indican principal, sección, preparación, lectura y tip; el botón abre el ancla del tema en Colab.
- El umbral tenía una práctica fija de 0,50 en el apoyo. El principal permite reproducir las mismas diez puntuaciones del aula, comparar 0,30/0,50/0,70 y editar un corte sin entrenar otro modelo. Se comprueban 7/5/4 alertas, 3/2/1 falsas y 0/1/1 omisiones.
- Activaciones añade una tabla para aplicar una misma señal editable a identidad, sigmoid, tanh y ReLU, separando el cambio de entrada del entrenamiento.
- El principal de detección incluye exportación de detecciones, conteos y configuración, además de las propuestas y su evaluación didáctica.
- Se corrige la referencia antigua a seis centros: el explorador de agrupación tiene 29; el bloque DBSCAN de Colab usa otros 123 puntos.
- Se identifica que la logística de apoyo trata alto rendimiento con un índice hídrico simulado, mientras que la matriz y los umbrales usan plantas con plaga. No se mezclan sus categorías.
- Las instrucciones de capítulos de las fuentes anteriores se identifican como apoyo. El principal se organiza por los tres temas del encuentro y repite preparación para que una sesión limpia no dependa de capítulos ocultos.

No se encontraron errores de ejecución en las ocho fuentes con las rutas actuales y bibliotecas del entorno verificado. Los cambios resuelven orientación, cobertura y contextualización; no se atribuyen fallos inexistentes a los algoritmos.

## Comprobaciones

- 40 ejecuciones distintas: ocho principales completos, 24 temas independientes y ocho fuentes completas. Todas sin errores. Cuatro recorridos afectados por los últimos añadidos se repitieron: 44 ejecuciones y 283 ejecuciones de celdas en total.
- Se verificaron resultados numéricos y separación de datos: imputación solo en entrenamiento; matriz TP3/FP2/FN1/TN4; umbrales; coordenada manual PCA; 60/24 semanas; llegada de Q-learning; pérdida de entrenamiento; patrones Transformer separados; pesos de atención; IoU/conteos; costes y archivos exportados.
- 154 celdas de código publicadas en 16 archivos: sintaxis válida, IDs únicos, sin outputs ni contadores de ejecución.
- 202 pruebas de sitio y backend aprobadas. La comprobación HTTP/SQLite usa identidades sintéticas y conexión local; no escribe en cuentas reales.
- Ejecución CPU con cero instalaciones y cero intentos de red durante la verificación. Se usaron dependencias y pesos de YOLO ya disponibles. En una sesión nueva de Colab puede ser necesaria su descarga inicial.
- Figuras de los principales guardadas y revisadas, con ejes, unidades y leyendas. Los ejemplos diferencian datos simulados, tareas ilustradas e inferencia de un detector.

Entorno: Python 3.12.14, NumPy 2.5.4, pandas 3.0.6, scikit-learn 1.9.1, Matplotlib 3.11.2, PyTorch 2.14.1+cpu, Ultralytics 8.4.175. Las métricas de una nueva ejecución se leen de su salida; esta revisión no garantiza disponibilidad permanente de recursos externos ni resultados idénticos en otras versiones.

## Mantenimiento

`docs/encounter-notebooks.js` define encuentros y enlaces; `docs/notebook-paths.js` define las fuentes y rutas. Generar con `node scripts/build_encounter_notebooks.mjs`; comprobar con `--check`. El generador conserva trazabilidad de cada celda y nunca copia salidas. Los tests verifican cobertura 8/24, anclas y sincronización con las fuentes.

`scripts/verify_encounter_notebooks.py` ejecuta código real, comprueba cada tema y registra resultados/figuras fuera de los cuadernos. Recibe rutas de informe, pesos locales y, si hace falta, bibliotecas instaladas; no instala dependencias ni habilita GPU o servicios de pago durante la verificación.
