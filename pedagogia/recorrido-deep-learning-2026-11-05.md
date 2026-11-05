# Deep Learning: recorrido básico, ejemplos y prácticas

Revisión del 5 de noviembre de 2026. Base publicada: `36c3a00db308a8f5f79f48408e7d78cb9ee807ab`.

## Propósito

Que un grupo con conocimientos heterogéneos pueda explicar qué entra, qué se transforma o aprende, qué sale y cómo se comprueba. La exactitud matemática no basta si la lectura obliga a repetir un caso varias veces o a adivinar qué práctica sigue.

Se usaron tres agentes: auditoría pedagógica de los doce temas, fuentes y gráficos, y revisión independiente de las dos propuestas. La integración y la revisión visual final añadieron correcciones cuando el dibujo no respondía a la pregunta o confundía procedencia de una respuesta.

## Cambios de lectura

- Cada tema muestra cuatro destinos: entender, ejemplo, práctica y Colab. Hay botones de continuación entre secciones, enlace nativo al ancla del cuaderno y navegación anterior/siguiente independiente de marcar avance.
- Un ejemplo principal por tema sustituye la acumulación de `foundation.flow`, escena con pasos, resultados y cuentas repetidas. La cuenta completa queda consultable en un detalle cerrado; el simulador se presenta después para cambiar una condición y comprobarla.
- El concepto comienza con una definición breve y tres términos. El vocabulario completo y el fundamento avanzado siguen disponibles bajo desplegables.
- La práctica principal se identifica por encuentro y tema. Los capítulos del apoyo dejan de ser las instrucciones visibles del principal. Las ampliaciones se agrupan como opcionales.
- Los enlaces de regreso y siguiente tema en los cuatro Colab DL apuntan al aula conectada, para conservar el mismo registro y la sesión del estudiante o docente; se corrigió un salto previo a otro origen.
- Los enlaces complementarios abren aparte. La neurona de riego tiene regreso explícito al tema; los exploradores opcionales incluyen un enlace para volver y continuar en Colab.
- «Ampliar gráfico» cambia el tamaño de un único SVG en su mismo recuadro, sin insertar una segunda copia. Permite reducirlo y conserva el estado ampliado al cambiar parámetros; las regiones mantienen nombres y desplazamiento local accesible.
- La vista docente conserva un hash explícito, por ejemplo `#tema/dl-redes`; `?vista=docente` solo elige el panel inicial cuando no hay destino. No concede rol.
- El cierre de la asignatura permite repasar cinco ideas básicas mediante explicaciones cortas y enlaces al tema, sin nota ni entrega.

## Revisión por tema

| Tema | Ejemplo y corrección |
|---|---|
| Redes | Se ubica IA → ML → DL. Entradas 2 y 1, pesos 0,5 y −1, bias 0,5 y salida ReLU 0,5. El gráfico agrupa suma y activación como una neurona. El ejemplo de tara pasa a ampliación. |
| Activaciones | La misma señal −2 se bifurca hacia ReLU, sigmoide y tanh. Son alternativas, no una cadena. Se distingue una salida numérica de probabilidad y de exactitud. |
| Entrenamiento | La figura compara dos tasas desde el mismo inicio: −2, pérdida 25 y gradiente −10. Tasa 0,1 produce −1 y pérdida 16; tasa 1,1 produce 9 y pérdida 36. Se separan propuesta, actualización y prueba. |
| Visión | Una misma escena se bifurca hacia etiqueta, cajas y máscaras de instancias. El principal compara marcas ilustrativas; no se presenta como ejecución de YOLO. |
| CNN | Ventana, filtro y celda de mapa se relacionan con colores y números. El filtro fijo manual se distingue de los filtros aprendidos en la CNN de dígitos. |
| Transferencia | Se distingue inferir con pesos existentes, entrenar una cabeza con extractor congelado y ajuste fino del extractor. Cambiar el nombre de una categoría no la enseña. |
| Secuencias | Dos órdenes conservan promedio y cambian el estado. La regla manual de mitades no es la LSTM ni el pronóstico. La fuente principal se corrige a documentación LSTM. |
| Atención | Consulta/claves → pesos → valores → productos → suma. 0,66976 y 0,33024 son pesos, no proporciones de la salida; se muestran sus aportes aproximados 6,6976 y 6,6048 cajas y suma 13,3024. |
| Transformer | Representación, posición, bloque y salida se distinguen de la regla de etiquetas. La salida del modelo se compara con la etiqueta externa, sin inventar una predicción correcta. Las cuatro secuencias de la práctica se enumeran. |
| YOLO | Se sigue una propuesta entre caja, categoría, puntuación y registro. Filtrar no entrena ni confirma el objeto. Se conserva la diferencia entre ≥ didáctico y > conf de la biblioteca. |
| Evaluación | Referencia y propuesta se contrastan por categoría e IoU. El gráfico muestra intersección y unión; se diferencia filtrar de emparejar y contar TP/FP/FN. |
| Integración | Las puntuaciones se conectan con revisiones, omisiones y coste. Se conserva la clase positiva defectuoso y los supuestos de revisión perfecta/costes ficticios. La fuente se dirige a selección de umbral. |

## Cuadernos principales

Se retira repetición efectiva de código, conservando los ocho archivos de apoyo y los cuatro principales ML:

- DL1/Redes: cálculo de neurona y capas en cadena; sin curvas de activaciones.
- DL1/Activaciones: tabla de la misma señal y curvas; sin volver a ejecutar la neurona anterior. Las dos celdas independientes indican usar el mismo `SENAL`.
- DL1/Entrenamiento: una celda imprime el primer paso y compara ambas tasas antes de entrenar la red. La antigua demostración de doce pasos permanece en apoyo.
- DL3/Transformer: ejecuta su propia tarea sin repetir la celda manual de atención del tema anterior.
- Markdown de los cuatro principales sincronizado con el recorrido básico y títulos propios del encuentro.

Quedan 49 celdas de código DL: 12, 13, 9 y 15 por encuentro. Archivos 4.5, IDs únicos, sin outputs ni contadores de ejecución publicados.

## Validación

- 216 pruebas de aplicación aprobadas. Las pruebas anteriores que exigían conservar las repeticiones DL ahora verifican un ejemplo principal, procedencia de datos, lectura, tablas en detalles cerrados, cuatro destinos y enlaces. Las protecciones ML, calendario y acceso permanecen.
- 12 comprobaciones enfocadas repetidas tras los ajustes de figuras y cierre, más 20 comprobaciones del control de ampliación y los exploradores.
- Cuatro cuadernos completos y doce temas en sesiones limpias: **16 recorridos CPU correctos**, 98 ejecuciones de celdas, cero intentos de red. PyTorch 2.14.1+cpu, NumPy 2.5.4, pandas 3.0.6, scikit-learn 1.9.1 y Ultralytics 8.4.175 en el entorno de comprobación.
- Las cinco nuevas celdas introductorias también se ejecutaron aisladas sin ejecutar preparación previa: correctas.
- Generación reproducible verificada con `--check`; hashes de ML y apoyos conservados. Tras corregir los enlaces de regreso, se repitieron 12 pruebas enfocadas y se verificó que las 49 celdas de código eran idénticas a las ejecutadas.
- Doce temas × cinco tamaños (320, 390, 768, 1024 y 1440) × claro/oscuro: 120 combinaciones sin desbordamiento de página. Los gráficos anchos se desplazan dentro de su propia región accesible.
- Se revisaron capturas de los doce recorridos/figuras representativas, controles, foco al continuar, conservación de parámetros, regreso desde el laboratorio y enlace al cuaderno. Consola sin errores. Las dos figuras retocadas al final se volvieron a revisar visualmente.
- No se escribieron registros de estudiantes en producción. La vista local emplea sesiones sintéticas. No se alteran fechas, matrícula, rol, API, progreso ni la lógica de la neurona de riego aceptada.

## Fuentes contrastadas

Se crearon gráficos originales de operaciones; no se copiaron medios de terceros.

- [Google: neuronas y capas ocultas](https://developers.google.com/machine-learning/crash-course/neural-networks/nodes-hidden-layers).
- [PyTorch: construir una red](https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html) y [optimización](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html).
- [PyTorch: Conv2d](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html), [LSTM](https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html) y [transferencia](https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html).
- [TensorFlow: transferencia y ajuste fino](https://www.tensorflow.org/tutorials/images/transfer_learning).
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762).
- [Ultralytics: predicción](https://docs.ultralytics.com/modes/predict/) y [segmentación](https://docs.ultralytics.com/tasks/segment/).
- [scikit-learn: selección de umbral](https://scikit-learn.org/stable/modules/classification_threshold.html).

Las cifras de modelos entrenados se leen de cada ejecución; no se prometen resultados para datos nuevos.


