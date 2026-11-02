# Auditoría de claridad de los doce temas de Deep Learning

Revisión del 2 de noviembre de 2026, posterior a la ampliación de sesgo. Base: `ffa6616101d4a72050be2d626adb04ccae7c6187`.

## Método y resultado

Se contrastaron conceptos, definiciones, casos, operaciones, comprobaciones, exploradores, enlaces y las celdas efectivas de los cuatro cuadernos principales. Se conservaron las cuentas pequeñas ya correctas. Los problemas encontrados fueron principalmente contradicciones entre apartados, vocabulario que no se actualizaba desde el catálogo común y conclusiones demasiado amplias sobre las demostraciones.

| Tema | Hallazgo | Corrección |
|---|---|---|
| Redes | La definición de sesgo mejorada convivía con una copia antigua en el vocabulario. La web y Colab daban salidas distintas pese a coincidir su suma z. | El vocabulario DL toma las definiciones comunes actuales. Se explicita z=0,5 en ambos ejemplos, ReLU=0,5 en web y sigmoide≈0,622 en Colab. Se conserva el ejemplo real de tara con cifras ilustrativas. |
| Activaciones | Faltaba desarrollar ReLU y exp en el primer concepto y aclarar identidad, saturación y calibración. Dos experimentos podían leerse como uno solo. | Se definen las funciones y se distingue capacidad de representación de comparación de curvas. Se incorporan los términos al catálogo. |
| Entrenamiento | «Entrenar» se definía solo mediante etiquetas, sin acotar a aprendizaje supervisado. La pérdida cuadrática manual se podía confundir con la de clasificación. No estaba claro qué particiones ejecutaba Colab. | Se acota el encuentro a aprendizaje supervisado, se distingue pasada hacia delante/retropropagación/actualización y se explica la regla de la cadena con una cuenta. Se declara y=1 sano, BCEWithLogitsLoss y que el cuaderno no implementa validación ni parada temprana. |
| Visión | Un píxel se presentaba como un número sin distinguir RGB. La máscara común de Colab podía confundirse con las instancias separadas de la web. Clasificación parecía implicar siempre una sola etiqueta. | Se explican intensidades/canales y se distinguen máscara binaria e instancias. La etiqueta única se acota a este ejemplo; se reconoce clasificación multietiqueta en otras tareas. |
| CNN | La descripción inicial no acotaba a un canal. No se conectaban las dimensiones del ejemplo manual y la red real. | Se explica que un filtro combina posiciones y canales. Se sigue 8×8×1 → ocho mapas 8×8 → pooling 4×4 → 128 valores → diez logits. Se distingue el filtro fijo posterior de los filtros aprendidos. |
| Transferencia | La presencia de una categoría podía leerse como prueba suficiente de compatibilidad. No se separaba del todo entrenar una cabeza de ajustar el extractor. | Se declara que el cuaderno solo realiza inferencia. Se explican cabeza nueva con extractor congelado, ajuste fino y evaluación del dominio local. |
| Secuencias | RNN se usaba antes de desarrollar su nombre. El mismo número 12 designaba ventana y tamaño oculto. Los 60 instantes podían interpretarse como un único pronóstico de horizonte 60. | Se desarrolla RNN; se separan ventana y estado oculto. Se explica evaluación de un paso con observaciones previas disponibles, referencia y unidades de la serie artificial. |
| Atención | El caso declaraba cantidades de cajas mientras el fundamento decía que todos los números carecían de unidades. exp aparecía sin resolver su valor. | Q/K y pesos quedan sin unidades; V y mezcla se expresan en cajas ficticias. El explorador explica exp y muestra sus valores calculados. Se mantienen Q/K/V manuales y se distingue participación de parámetro aprendido. |
| Transformer | Había vocabulario token duplicado. La explicación podía atribuir el resultado solo a la posición añadida, aunque la salida conserva posiciones. La pregunta con extremos iguales no correspondía a la distribución evaluada. | Se deduplican alias; se definen logits, entropía cruzada, residual y LayerNorm. Se explicita el papel de la lectura por posiciones y que el experimento no aísla la posición añadida. Se declara la exclusión de extremos iguales. |
| YOLO | Se podía confundir tamaño de procesamiento con coordenadas originales; persistía riesgo de equiparar fila y objeto verificado. | Se explica xyxy, ancho/alto y que imgsz no cambia la interpretación de las coordenadas de salida. Se conserva la diferencia entre ≥ didáctico y > conf del cuaderno. |
| Evaluación | El origen de las cajas difiere entre web y Colab. El caso con una propuesta no explicaba del todo qué pasa con duplicados. | Se aclara que traslaciones comunes conservan IoU. Se explican emparejamiento uno a uno, duplicados, FP/FN y precisión frente a recall, exactitud y mAP. |
| Integración | Cambia la clase positiva respecto al encuentro de entrenamiento. El empate de costes podía ocultar cargas y omisiones diferentes. | Se declara y=1 defectuoso, puntuaciones dadas y conjunto independiente. Se comparan el empate 0,70/0,90, sus 3/1 revisiones y 1/3 omisiones; el coste no decide por sí solo el desempate. |

## Cómo queda la experiencia

Cada práctica tiene un detalle «Qué cambia entre el ejemplo y Colab», compartido con su cuaderno. Los doce temas conservan sus objetivos y casos. Se mantienen los controles y el gráfico ampliado de neurona/CNN al recalcular. El catálogo común incluye identidad, hiperparámetro, saturación, entropía cruzada multiclase, conexión residual, normalización de capa y calibración; logit abarca la salida binaria y la de varias clases.

## Comprobaciones

- 208 pruebas locales aprobadas, incluidas las regresiones de acceso, fechas, progreso, controles y consistencia del vocabulario. El catálogo actual se aplica solo al vocabulario de los temas DL; se preserva orden y se eliminan alias duplicados sin modificar las listas fuente.
- Los doce temas se revisaron a 320, 390, 768, 1024 y 1440 px, en claro y oscuro: 120 combinaciones sin desbordamiento de página y con el detalle de continuidad presente.
- En navegador se comprobó el sesgo actualizado en el vocabulario, la explicación de Transformer y la ampliación de CNN después de mover la ventana: conserva ampliación, cuenta actual y desplazamiento local.
- Los cuatro cuadernos principales DL se regeneran y verifican con `--check`. Sus 50 celdas de código conservan exactamente IDs y texto. No se repitió ejecución CPU: esta revisión cambia explicaciones, no programas, bibliotecas o configuraciones.
- Las doce guías ML y los cuadernos ML y de apoyo conservan íntegro su contenido anterior. No se cambian calendario, matrícula, apertura, roles, API ni progreso. Los cambios recientes del laboratorio de planta se conservan y no forman parte de esta publicación.

## Fuentes principales contrastadas

- [PyTorch · CrossEntropyLoss](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html): logits, etiquetas y pérdida multiclase.
- [PyTorch · LayerNorm](https://docs.pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html): normalización interna de representaciones.
- [PyTorch · LSTM](https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html): ejes de secuencia y dimensión de estados.
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762): atención, posiciones y bloques Transformer.
- [Deep Residual Learning](https://arxiv.org/abs/1512.03385): conexiones residuales.
- [scikit-learn · Calibración](https://scikit-learn.org/stable/modules/calibration.html) y [selección de hiperparámetros](https://scikit-learn.org/stable/modules/grid_search.html).
- [Ultralytics · Predicción y cajas](https://docs.ultralytics.com/modes/predict/): resultados y coordenadas xyxy.

La lectura de lo que ejecuta cada cuaderno se basa en sus propias celdas publicadas; no se atribuyen a las prácticas técnicas adicionales que no ejecutan.
