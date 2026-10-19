# Revisión conceptual de ML y DL · 19 de octubre de 2026

Alcance: los 24 temas del aula, sus casos resueltos, conexiones y referencias de laboratorio. Esta revisión amplía la web; no sustituye la revisión de cada diapositiva ni una nueva ejecución de todos los cuadernos.

## Hallazgos y correcciones

| Encuentro | Vacío observado | Corrección incorporada |
|---|---|---|
| ML 1 | Se usaban modelo y ajuste sin distinguir regla, procedimiento y parámetros. Preparación se centraba en la mediana. | Modelo/algoritmo, filas/variables, X/y, parámetros, fuga, escalado, pipeline, pendiente, intercepto y residuo. |
| ML 2 | Faltaba un marco común para etiqueta, puntuación, categoría y acción. | Clase positiva, calibración, TP/FP/FN/TN, desbalance, validación y costes/capacidad. |
| ML 3 | Agrupación, proyección y ensamble aparecían como herramientas consecutivas sin diferencia de propósito. | Agrupar filas frente a resumir columnas y combinar salidas; distancia, hiperparámetros, K-Means/DBSCAN, cargas PCA, árboles, bosque y RMSE. |
| ML 4 | Pronóstico y refuerzo requerían explicar su relación y sus diferencias. | Tiempo disponible, tendencia, estacionalidad, referencia, agente/entorno, episodio, retorno, valor Q, exploración y generalización. |
| DL 1 | Se llegaba a la cuenta de una neurona antes de explicar capas y representaciones; faltaba vocabulario del entrenamiento. | Arquitectura, representación, inferencia, salida, retropropagación, optimizador, lote, época, validación y sobreajuste. |
| DL 2 | Píxeles, canales, mapas y transferencia se daban parcialmente por conocidos. | Tensor, anotación, normalización, mapa, stride, padding, pooling, extractor, congelación, cabeza y dominio. |
| DL 3 | Atención exigía vectores y productos antes de una intuición de mezcla; Transformer no explicaba todas sus piezas. | Mezcla ponderada sencilla antes de Q/K/V, vector, producto escalar, autoatención, RNN/LSTM, embedding, posición, encoder, cabezas y conexiones residuales. |
| DL 4 | Faltaba distinguir salida del detector de evidencia de acierto y de decisión operativa. | Convención de coordenadas, puntuación, duplicados, referencia anotada, emparejamiento uno a uno, AP/mAP, costes y latencia. |

Los 24 temas ahora incluyen una conexión de entrada y una pregunta conceptual con respuesta desplegable. Se conservan los casos numéricos, gráficos, animaciones y accesos a copias personales de Colab. Los ocho objetivos de encuentro se reformularon para expresar comprensión. Las portadas de ambas asignaturas muestran su pregunta central y la relación entre clases.

## Uso del tiempo de clase

Cada encuentro dispone de cuatro horas. Una distribución orientativa es 40 minutos de conceptos, 35 de ejemplo resuelto, 15 de pausa, 75 de exploración y cuaderno, 45 de interpretación y variaciones, y 30 de conexiones y dudas (240 minutos). Ajustarla al grupo; no es un horario oficial. Los detalles de código marcados como ampliación pueden reservarse para consulta.

Las comprobaciones son opcionales y sin calificación. La pregunta de comprensión busca que el estudiante explique con palabras lo que cambia, lo que permanece fijo y qué evidencia falta.

## Límites que deben conservarse

- Los datos ilustrativos no son mediciones agrícolas reales; las salidas con pesos fijados no son modelos entrenados.
- Los métodos no se comparan por porcentajes de tareas o divisiones diferentes.
- AP/mAP se define como vocabulario: el cuaderno de YOLO demuestra inferencia, no ejecuta esa evaluación con anotaciones.
- El ejemplo de atención tiene claves y valores fijados; el ejemplo de Transformer clasifica secuencias numéricas, no es un chatbot.
- Los fragmentos numéricos y las referencias existentes de los cuadernos se conservan; no se afirma haber reentrenado todas las redes ni corregido los documentos originales.

## Referencias primarias de contraste

- https://scikit-learn.org/stable/getting_started.html
- https://scikit-learn.org/stable/common_pitfalls.html
- https://www.tensorflow.org/tutorials/keras/overfit_and_underfit
- https://www.tensorflow.org/text/tutorials/transformer

## Segunda revisión: claridad y repeticiones

Se reescribieron las 24 introducciones para que expresen propósito y relación con la tarea. El glosario explica las piezas y el ejemplo muestra su uso. Se retiró el bloque de profundización que volvía a explicar el mismo concepto; sus matices útiles se incorporaron en su lugar (Mean-Shift, stacking, denominadores cero, segmentación y configuración de convolución). Se quitaron diez definiciones compartidas repetidas en temas posteriores y la repetición de objetivo y recordatorio en la columna lateral. Las conexiones y las preguntas pueden retomar una idea para aplicarla, pero no agregan una segunda definición completa.
