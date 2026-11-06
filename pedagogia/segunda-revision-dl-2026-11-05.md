# Segunda revisión de precisión y claridad · Deep Learning

Se revisaron los doce temas, sus ejemplos, controles, gráficos y los cuatro Colab principales. Tres agentes dividieron DL1–2, DL3–4 y continuidad de prácticas; los dos primeros contrastaron sus hallazgos entre sí. La coordinación revisó e implementó los diagramas y verificó el conjunto en navegador.

## Hallazgos corregidos

1. **Profundidad y ReLU:** la definición inicial describía redes sin aclarar la profundidad. Ahora relaciona varias capas con representaciones sucesivas y explica ReLU antes de interpretar el ejemplo.
2. **Transferencia:** «imágenes y etiquetas» compartían una flecha al extractor. Ahora solo la imagen entra al modelo; la etiqueta externa se compara con su predicción y la pérdida guía el ajuste de la cabeza. El extractor se mantiene fijo en esta estrategia ilustrativa. El Colab sigue declarado como inferencia, no adaptación ejecutada.
3. **Entrenamiento:** se pedía leer un porcentaje aunque accuracy_score devuelve una proporción. Se aclara 0,95 → 95 %, qué representan fondo y puntos del mapa, las particiones 240/80 y que el primer punto de pérdida corresponde a los lotes de la primera época, no al estado inicial anterior a aprender.
4. **Visión:** el texto del simulador prometía inferencia en el Tema 1, que solo dibuja tareas. Ahora distingue sus marcas ilustrativas de la inferencia con detector del Tema 3.
5. **CNN:** la lectura confusa sobre «mapas aprendidos» ahora distingue ocho filtros aprendidos y los mapas que producen. Se diferencia el filtro fijo que compara izquierda/derecha del filtro del aula que compara filas. La continuación apunta al Tema 3 del mismo cuaderno, sin exigir secciones de un apoyo distinto.
6. **Transformer:** faltaban representación y cabeza de salida. El diagrama ya muestra vector más posición, bloque, cabeza, dos puntuaciones y predicción. La etiqueta permanece fuera del modelo. No se atribuyen resultados numéricos no ejecutados.
7. **YOLO:** la geometría del dibujo no justificaba la fila de coordenadas. Imagen ficticia 100×100 px, origen superior izquierdo y escala uniforme: caja [20,20,60,60] de 40×40 px. Se conservan puntuación dada y diferencia entre filtro didáctico ≥ y filtro Ultralytics > conf.
8. **Integración:** las puntuaciones fijas del ejemplo ya no se atribuyen a «la red». Se excluye del principal un bloque de apoyo sobre SAM, DINOv2, difusión y modelos de lenguaje que no pertenecía al laboratorio de costes; el apoyo original se conserva.

Las cuentas de neurona, activaciones, descenso, filtro, secuencias, atención, IoU y costes coincidieron con los valores mostrados. No se alteraron para forzar otro resultado.

## Validación

- 221 pruebas aprobadas. Cuatro regresiones nuevas comprueban límites geométricos de los doce diagramas, correspondencia numérica de la caja YOLO y recorridos de flechas de transferencia y Transformer con etiqueta externa.
- Generación reproducible de los ocho principales comprobada con `--check`.
- Las 49 celdas de código de los cuatro principales DL son idénticas a las ya ejecutadas en CPU. En esta revisión solo cambió Markdown. Los cuatro principales ML y los ocho apoyos conservan sus archivos completos.
- Doce temas × cinco anchos (320, 390, 768, 1024 y 1440) × claro/oscuro: 120 combinaciones sin desbordamiento de página, cuatro apartados, un diagrama principal y ancla Colab correcta.
- En los tres gráficos retocados se comprobaron etiquetas sin solapamiento ni salida del área gráfica y se inspeccionaron capturas.
- Se conservan el único gráfico al ampliar, las fechas, la autorización docente, el progreso, el laboratorio de planta aceptado y los datos de producción. No se crean registros reales durante las comprobaciones.

## Fuentes primarias de contraste

- [PyTorch: construcción de una red y representaciones](https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html).
- [PyTorch: transferencia, entradas del modelo, etiquetas y pérdida](https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html).
- [PyTorch: Conv2d y mapas por filtro](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html).
- [scikit-learn: accuracy_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html).
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762).
- [Ultralytics: predicción y coordenadas xyxy](https://docs.ultralytics.com/modes/predict/).
- [scikit-learn: selección del umbral de decisión](https://scikit-learn.org/stable/modules/classification_threshold.html).

La evidencia privada se guarda en output/dl-second-review-20261105/ y output/dl-audit-20261105/notebook-preservation.json. Los comentarios de auditoría permanecen fuera de la interfaz de estudiantes.
