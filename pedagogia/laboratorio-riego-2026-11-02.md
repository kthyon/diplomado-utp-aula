# Laboratorio visual: una neurona decide si regar

Reemplazo solicitado del ejemplo de spam en `laboratorio.html#red`. La página activa sigue siendo `lab-clear.js`; monta el nuevo controlador aislado `plant-neuron.js`, sus estilos y un modelo matemático independiente. No se modifican los experimentos de paquetes KNN y métricas, las clases, los cuadernos, el calendario ni los registros.

## Recorrido que ve el estudiante

1. Dos sensores ficticios: sequedad y calor. Se explica la conversión del índice 0–100 a 0–1; calor no se presenta como grados Celsius.
2. Cada entrada se multiplica por su peso. Azul y naranja se conservan a lo largo de las conexiones. El bias entra por un camino morado independiente.
3. Una frontera gráfica agrupa suma y activación como una sola neurona. La sigmoide convierte la suma en puntuación; el corte 0,50 produce regar/no regar.
4. El comparador recibe la puntuación y una etiqueta conocida, externa a la predicción.
5. El gradiente vuelve en magenta hacia pesos y bias. Se muestran números transportados y cambios propuestos. No cambia ningún parámetro todavía.
6. Solo la acción explícita aplica el ajuste. Después se repite la predicción con las mismas entradas. Los paquetes llegan en orden: aportes, suma, puntuación.

Los botones de pasos y repetición no entrenan. Cambiar tasa muestra una propuesta pendiente. Al navegar entre experimentos se conservan los datos y parámetros de la planta. El reinicio devuelve entradas, etiqueta, tasa, pesos y bias al inicio.

## Bias y ejemplo comprobado

El panel morado permite mantener entradas y pesos mientras se cambia b. Se comparan la puntuación sin bias y la puntuación con bias. La recta de desplazamiento incluye ambos extremos incluso con entradas y bias máximos. Un botón cancela la suma de los aportes para observar z=0, p=0,50.

Caso inicial: x=[0,8; 0,6], w=[2; 1], b=−3. Aportes 1,6 y 0,6; z=−0,8; p≈0,310026. Con etiqueta inventada y=1 y tasa η=1:

- δ=p−y≈−0,689974.
- Gradientes: [−0,551980; −0,413985] y −0,689974 para b.
- Nuevos pesos: [2,551980; 1,413985]; nuevo b≈−2,310026.
- Nueva suma≈0,579949; nueva puntuación≈0,641056. La decisión cambia de no regar a regar.
- La pérdida del mismo caso baja de aproximadamente 1,171 a 0,445. No se atribuye esta mejora a casos nuevos.

Sin entrenar, cambiar solo b de −3 a −1 conserva aportes 2,2 y cambia p de aproximadamente 0,31 a 0,77. El bias se define como parámetro sumado antes de activar; se distingue del error, del umbral y de las mediciones.

## Verificación

- 208 pruebas de la aplicación aprobadas, incluidas 8 de cálculo de la neurona y 9 de interfaz activa (planta, KNN y métricas).
- Gradientes contrastados mediante diferencias finitas para ambos valores de etiqueta y entradas extremas.
- Verificados controles conservados/foco, actualización explícita, tasa pendiente, navegación, reinicio, paquetes secuenciales y eje del bias.
- Navegador: tamaños 320, 390, 768, 1024 y 1440; temas claro/oscuro; sin desbordamiento horizontal de la página. En pantallas muy estrechas, el diagrama tiene desplazamiento local accesible.
- Revisados caso seco que aprende, caso húmedo y control que lleva la suma al corte. Consola sin errores.
- Movimiento reducido conserva el esquema estático y oculta los paquetes móviles. Diagramas SVG y planta originales; no se copian medios externos.

Fuentes conceptuales: [suma, bias y sigmoide, Google](https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function?hl=es-419) y [regresión logística con gradientes, TensorFlow](https://www.tensorflow.org/guide/core/logistic_regression_core). Datos, etiquetas y decisiones de riego del ejemplo son inventados para la explicación.
