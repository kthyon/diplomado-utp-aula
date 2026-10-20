# Revisión de los ocho cuadernos de Colab

Revisión del 20 de octubre de 2026. Se ejecutaron localmente en CPU las 60 celdas de código de las copias publicadas, conservando el orden dentro de cada cuaderno. No se activaron recursos de pago, cuentas de API ni entrenamiento externo.

| Cuaderno | Celdas ejecutadas | Resultado |
|---|---:|---|
| regresion.ipynb | 4 | Sin errores; predicción manual igual a predict |
| clasificacion.ipynb | 5 | Sin errores; comparación gráfica de tres cortes y voto de Iris |
| clustering.ipynb | 2 | Sin errores; K-Means y Mean-Shift |
| pca.ipynb | 2 | Sin errores; suma de productos igual a coordenada PC1 |
| refuerzo.ipynb | 1 | Sin errores; política demostrada llega a la meta con retorno 6 |
| laboratorio-ml.ipynb | 11 | Sin errores; preparación, métricas, ensambles, DBSCAN y series |
| laboratorio-dl.ipynb | 23 | Sin errores; incluidos XGBoost, LightGBM, SHAP, CNN, LSTM, Transformer, autoencoder y difusión |
| yolo-registro.ipynb | 12 | Sin errores; dos fotos, comparación de cortes, categoría, recorte y CSV |

## Correcciones y mejoras

- Ruta de uso por encuentro en los ocho archivos, copia personal y ejecución en orden. CPU suficiente para estas prácticas; ninguna exige contratar un recurso de pago.
- Explicación de origen de datos y parámetros, operaciones, lectura de gráficos y límites en todos los casos. Diferencia entre simulación, ajuste aprendido y configuración elegida.
- Regresión: sustitución de pendiente e intercepto con comprobación numérica. La conclusión de regularización ya no afirma un ganador fijo después de cambiar parámetros.
- Clasificación: operación entrada → logit → probabilidad → clase; tres gráficos y tabla de consecuencias al cambiar solo el corte. Esta demostración usa entrenamiento y no pretende seleccionar un corte para un proyecto real.
- PCA: fila original → estandarización → centrado → productos con pesos de PC1, comprobados contra la coordenada dibujada.
- Mean-Shift: silhouette solo se calcula con entre 2 y n−1 grupos; no se intenta calcular en los extremos indefinidos.
- DL: conteos TP/FN/FP/TN calculados con el corte actual, sin una frase fija que siguiera describiendo 0,50 tras cambiarlo. Precisión sin alertas queda no definida (NaN), distinta de cero.
- Preparación DL: XGBoost/LightGBM y SHAP se instalan al llegar a sus bloques; no son necesarios para preparar y ejecutar únicamente CNN o secuencias.
- YOLO: documentación de la frontera estricta `puntuación > conf` de Ultralytics 8.4.175. Se comprobó con propuestas exactamente en el corte y por encima. Se distingue esa convención del esquema inclusivo utilizado en otras demostraciones.
- YOLO: explicación de cómo elegir un corte mediante validación, por qué menos cajas no demuestra mayor precisión y qué ejecución alimenta los CSV.
- Ocho archivos normalizados a notebook 4.5, con identificadores únicos y sin salidas ni contadores de ejecución guardados.

## Comprobaciones adicionales

- En DL, atención suma uno por fila; no hay secuencias idénticas compartidas entre entrenamiento y prueba del Transformer; las muestras de difusión son finitas.
- Con corte 1 en la demostración DL: TP=0, FN=3, FP=0, TN=3 y precisión no definida.
- En YOLO, filas de detecciones = número de cajas, suma del conteo = filas y existen detecciones.csv, conteo.csv y configuracion.json. La carga de una foto personal permanece desactivada: no se subieron archivos de personas.
- En ML, los seis cuadernos no produjeron advertencias durante la ejecución comprobada. Se mantienen entrenamiento/prueba, escalado dentro de pipelines y temporalidad en series.
- `scripts/check_notebooks.py` comprueba sintaxis de las 60 celdas y ausencia de salidas guardadas sin instalar ni ejecutar bibliotecas.

## Alcance de la verificación

Se usó Python 3.12.14, NumPy 2.5.4, pandas 3.0.6, scikit-learn 1.9.1, Matplotlib 3.11.2, PyTorch 2.14.1+cpu y Ultralytics 8.4.175. Las comprobaciones corresponden a una ejecución local; no certifican el estado de cada entorno de Colab ni prometen métricas idénticas entre versiones. Los enlaces abren los archivos de GitHub en Colab y la primera celda indica guardar una copia personal. Las extensiones enlazadas de terceros no forman parte de estas 60 celdas ni se presentan como ejecutadas.

La revisión mejora comprensión y reproducibilidad; los datos simulados y unas pocas fotos no validan una aplicación agronómica, industrial o comercial.
