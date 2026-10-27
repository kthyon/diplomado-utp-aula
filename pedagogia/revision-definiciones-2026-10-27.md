# Revisión de definiciones, siglas y símbolos

27 de octubre de 2026. Base publicada: `f2fcda0227f86110867840d01e416b2b533bb7eb`.

Se revisó el vocabulario de los ocho encuentros y se incorporaron 81 referencias verificadas para términos ya utilizados. No se añadieron temas ni encuentros. Los seis temas y las celdas protegidas de los encuentros globales 1 y 2 permanecen intactos; sus aclaraciones se consultan en la biblioteca común y el buscador.

## Qué debe explicar cada referencia

- Nombre completo en inglés cuando corresponde a una sigla, junto con su significado en español.
- Definición comprensible sin dar por conocido el término que se está definiendo.
- Interpretación, unidades y condiciones necesarias para leer un resultado.
- Un ejemplo pequeño y enlace a documentación primaria.

Las referencias se centralizan en `definitions.js` y tres catálogos de ML, DL y apoyo de lectura. La biblioteca conserva sus conceptos generales y reúne las referencias revisadas: 108 entradas en total. Las siglas de los 18 temas pendientes se desarrollan en sus explicaciones y vocabulario. Los seis encuentros futuros tienen un panel desplegable de siglas y términos; los primeros dos no cambian su presentación.

## Cobertura por encuentro

| Encuentro | Referencias que se comprobaron |
|---|---|
| ML 1, apoyo común | ML, MAE, OLS, RMSE y NaN; variable, entrada, respuesta y separación de datos. |
| ML 2, apoyo común | TP, FP, FN, TN, precision, recall, accuracy y F1; KNN y SVM cuando aparecen en ampliaciones. |
| ML 3 | DBSCAN, PCA, PC1/PC2, MAE, RMSE, R², agrupación y ensambles; centrado, escalado y varianza. |
| ML 4 | MAE, aprendizaje por refuerzo, Q-learning, α, γ y ε; retorno observado frente a valor futuro descontado. |
| DL 1 | DL, ReLU, tanh, MSE, BCE, BCEWithLogitsLoss, Adam, pérdida, gradiente y retropropagación. |
| DL 2 | CNN, RGB, YOLO y COCO; CPU/GPU, filtros, tensores y reutilización de parámetros. |
| DL 3 | RNN, LSTM, MAE, Q/K/V, softmax, Transformer y representación de entradas. |
| DL 4 | YOLO, IoU, TP/FP/FN, AP/mAP, CSV y JSON; NMS con el alcance de cada variante. |

Q, α, γ y ε se presentan como símbolos; Transformer, tanh, F1 y R² no reciben expansiones inventadas. El valor Q de refuerzo se distingue de la consulta Q de atención.

## Precisiones y correcciones

- MAE es Mean Absolute Error, error absoluto medio: conserva las unidades de la respuesta y no significa que todos los casos tengan el mismo error. El ejemplo 1 y 3 cajas produce MAE 2 cajas.
- MSE eleva los errores al cuadrado y tiene unidades al cuadrado; RMSE extrae su raíz y vuelve a las unidades originales. No se intercambian con MAE.
- R² puede ser negativo y no es porcentaje de aciertos. Precision, recall y F1 requieren declarar su población y tratar los denominadores cero.
- La varianza declara si divide por n o n−1. Centrar, cambiar escala y estandarizar son operaciones relacionadas, pero distintas. Se precisa qué coeficientes llamamos «cargas» de PCA.
- AP no es la precisión en un único corte; mAP requiere declarar categorías y protocolo de IoU. No se cuentan verdaderos negativos de fondo en el ejemplo de detección.
- La actualización del ejemplo escalar describe descenso básico. Adam también usa el historial de gradientes. BCEWithLogitsLoss recibe logits y no necesita una sigmoide previa.
- Se acota a la práctica supervisada la necesidad de respuestas conocidas al entrenar la CNN; no se afirma que todas las CNN requieran etiquetas humanas.
- Se corrige una indicación residual del Transformer que mencionaba dos ejemplos: el cuaderno imprime cuatro.
- CSV se describe como registros con campos, sin afirmar que cada registro deba ocupar siempre una sola línea física.

## Colab

Se añadieron aclaraciones de nombres y símbolos junto a los bloques pertinentes de los seis cuadernos editables. Regresión y clasificación permanecen idénticos; en el laboratorio ML las nuevas aclaraciones comienzan después de las 22 celdas protegidas y se conserva el cierre original.

Las 61 celdas de código, sus IDs, orden y contenido son idénticos a la base de esta revisión. Esta edición solo modifica explicaciones; no altera cálculos, datos ni entrenamiento. Se verificaron sintaxis, IDs únicos y ausencia de salidas guardadas. No se volvió a ejecutar el código que no cambió.

## Verificación

- 147 pruebas aprobadas, sin fallos, incluidas cobertura por encuentro, nombres completos presentes, búsquedas equivalentes, protección de encuentros 1 y 2 y rutas de Colab.
- Búsqueda comprobada por MAE, Mean Absolute Error y error absoluto medio; también por R²/R2 y α/alpha.
- Revisión en navegador del resultado de MAE, sus unidades, ejemplo y fuente; paneles presentes en los seis encuentros pendientes y ausentes en los primeros dos.
- Revisión de claro/oscuro y de 320, 390, 768, 1024 y 1440 px sin desbordamiento de página en la vista comprobada.

Las fuentes primarias se enlazan desde cada referencia: scikit-learn, NumPy, PyTorch, publicaciones originales, Ultralytics, W3C, RFC y documentación técnica de los términos de apoyo. Se revisó exactitud y cobertura del vocabulario usado; el catálogo no pretende abarcar toda la disciplina ni añadir un programa nuevo.
