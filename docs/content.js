import {reviewedGlossary} from './definitions.js';
import {LESSON_GUIDES} from './learning-guides.js?v=definiciones-20261027';
export const REPO='kthyon/diplomado-utp-aula';
export const SOURCES={ml:'https://docs.google.com/presentation/d/1UOnYu1aT7Sg58BUlmPL6_BNyoFlhFc4Zu456IZP93ns/edit',terms:'https://docs.google.com/document/d/1WfPiuA4LUkE3axpf3qb_-_cQu55OEpnwQohtTyN2zYo/edit',dl:'https://docs.google.com/document/d/1buuOnf-xMsWfpRQeyW2swHEt9I7JKsroikz0rKsG_G0/edit',activation:'https://docs.google.com/document/d/1qsi3HQwW0zRlLMyAplVuANgZzmuLhcIhvOAJaiUxU6c/edit'};
export const COURSES={
 ml:{id:'ml',module:5,title:'Machine Learning',subtitle:'Construir predicciones, alertas y pronósticos para resolver tareas operativas.',color:'verde',dates:'23, 24, 30 y 31 de octubre',classes:[
  {title:'Del problema a la primera predicción',date:'23 oct',iso:'2026-10-23',time:'Viernes · 18:30–22:00',topics:['ml-problema','ml-preparacion','ml-regresion']},
  {title:'Clasificar y entender los errores',date:'24 oct',iso:'2026-10-24',time:'Sábado · 08:00–12:00',topics:['ml-clasificacion','ml-metricas','ml-umbral']},
  {title:'Encontrar estructura y combinar modelos',date:'30 oct',iso:'2026-10-30',time:'Viernes · 18:30–22:00',topics:['ml-clustering','ml-pca','ml-ensambles']},
  {title:'El tiempo, las decisiones y el cierre',date:'31 oct',iso:'2026-10-31',time:'Sábado · 08:00–12:00',topics:['ml-series','ml-refuerzo','ml-integracion']}
 ]},
 dl:{id:'dl',module:6,title:'Deep Learning',subtitle:'Construir cálculos, pruebas y registros con redes, imágenes y secuencias.',color:'naranja',dates:'6, 7, 13 y 14 de noviembre',classes:[
  {title:'Cómo aprende una red neuronal',date:'6 nov',iso:'2026-11-06',time:'Viernes · 18:30–22:00',topics:['dl-redes','dl-activaciones','dl-entrenamiento']},
  {title:'De los píxeles a la representación',date:'7 nov',iso:'2026-11-07',time:'Sábado · 08:00–12:00',topics:['dl-vision','dl-cnn','dl-transferencia']},
  {title:'Secuencias, atención y contexto',date:'13 nov',iso:'2026-11-13',time:'Viernes · 18:30–22:00',topics:['dl-secuencias','dl-atencion','dl-transformers']},
  {title:'Detección y decisiones con evidencia',date:'14 nov',iso:'2026-11-14',time:'Sábado · 08:00–12:00',topics:['dl-yolo','dl-evaluacion','dl-integracion']}
 ]}
};
const LESSON_BASE=[
  {
    "id": "ml-problema",
    "title": "Primero la pregunta, después el modelo",
    "concept": "Durante el ajuste se usan entradas X y respuestas y conocidas. Durante una predicción nueva, el modelo recibe X y calcula una estimación de y. Para evaluarlo, separa ejemplos de prueba antes de ajustar; sus respuestas se consultan para medir error. Si la salida es una categoría se trata de clasificación; si es una cantidad se trata de regresión.",
    "notebooks": [
      "laboratorio-ml.ipynb"
    ],
    "quiz": {
      "q": "Si queremos estimar toneladas por hectárea, ¿qué tarea planteamos?",
      "choices": [
        "Regresión: estimar una cantidad.",
        "Clustering: agrupar fincas por similitud.",
        "Clasificación: decidir si el rendimiento supera una categoría definida."
      ],
      "answer": 0,
      "feedback": "La salida es una cantidad con unidades. Si preguntáramos «rendimiento alto o bajo», necesitaríamos definir categorías."
    },
    "source": "https://scikit-learn.org/stable/supervised_learning.html"
  },
  {
    "id": "ml-preparacion",
    "title": "Un registro vacío no es cero",
    "concept": "En un pipeline, la preparación y el modelo forman una secuencia. Primero se ajusta la preparación con entrenamiento; luego se transforman entrenamiento y prueba con esa misma regla. Imputar con la mediana es una opción, no una regla apropiada para toda ausencia: investiga por qué faltan datos y conserva su significado.",
    "notebooks": [
      "laboratorio-ml.ipynb"
    ],
    "quiz": {
      "q": "¿De dónde debe salir la mediana que completa la lluvia de prueba?",
      "choices": [
        "De todos los datos juntos.",
        "De las lluvias conocidas de entrenamiento.",
        "De la respuesta de la finca de prueba."
      ],
      "answer": 1,
      "feedback": "La mediana se aprende con las medidas conocidas de entrenamiento. La prueba conserva respuestas para comprobar el modelo y no participa en aprender esa regla."
    },
    "source": "https://scikit-learn.org/stable/common_pitfalls.html"
  },
  {
    "id": "ml-regresion",
    "title": "Una predicción también tiene error",
    "concept": "La recta usa y estimada = b + w × x. b es el intercepto y w la pendiente. El ajuste por mínimos cuadrados elige b y w para minimizar la suma de errores al cuadrado en entrenamiento. El MAE, en cambio, promedia errores absolutos. Ajustar con un criterio y evaluar con otro son operaciones que deben identificarse.",
    "notebooks": [
      "regresion.ipynb",
      "laboratorio-ml.ipynb"
    ],
    "quiz": {
      "q": "¿Qué significa MAE = 0,46 t/ha?",
      "choices": [
        "46 % de aciertos.",
        "Todas las fincas tienen exactamente ese error.",
        "Error absoluto promedio de 0,46 t/ha en esa prueba."
      ],
      "answer": 2,
      "feedback": "El promedio resume errores distintos. R² tampoco es un porcentaje de aciertos y puede ser negativo."
    },
    "source": "https://scikit-learn.org/stable/modules/model_evaluation.html#mean-absolute-error"
  },
  {
    "id": "ml-clasificacion",
    "title": "De una puntuación a una categoría",
    "concept": "La clase positiva es la categoría que interesa detectar; aquí, con plaga. Una decisión positiva es una alerta. Los modelos pueden producir probabilidades estimadas u otras puntuaciones; una salida entre 0 y 1 no garantiza que, entre cien casos puntuados con 0,80, ochenta sean positivos. Esa correspondencia se estudia mediante calibración.",
    "notebooks": [
      "clasificacion.ipynb"
    ],
    "quiz": {
      "q": "¿Una puntuación de 0,80 significa que una planta tiene 80 % de daño?",
      "choices": [
        "Sí, siempre.",
        "No: la puntuación se refiere a la clase definida.",
        "Solo si el modelo tiene muchos árboles."
      ],
      "answer": 1,
      "feedback": "En estas plantas, la puntuación se compara con un umbral para decidir alerta. No mide la proporción dañada de la planta."
    },
    "source": "https://scikit-learn.org/stable/modules/classification_threshold.html"
  },
  {
    "id": "ml-metricas",
    "title": "Diez plantas, cuatro resultados posibles",
    "concept": "TP = positivo real con alerta; FP = negativo real con alerta; FN = positivo real sin alerta; TN = negativo real sin alerta. Precision = TP/(TP+FP), recall = TP/(TP+FN), accuracy = (TP+TN)/(TP+FP+FN+TN). Si el denominador es cero, la proporción no está definida; no se interpreta como un porcentaje observado.",
    "notebooks": [
      "laboratorio-ml.ipynb"
    ],
    "quiz": {
      "q": "¿Qué error deja pasar una planta que realmente tiene plaga?",
      "choices": [
        "Falso positivo.",
        "Falso negativo.",
        "Verdadero negativo."
      ],
      "answer": 1,
      "feedback": "Un falso negativo predice ausencia de plaga cuando sí existe. Su importancia depende del uso y de las consecuencias."
    },
    "source": "https://scikit-learn.org/stable/modules/model_evaluation.html#confusion-matrix"
  },
  {
    "id": "ml-umbral",
    "title": "La decisión tiene un umbral",
    "concept": "El umbral debe ajustarse con validación, dentro del entrenamiento, según el uso propuesto. Después se evalúa la regla elegida en una prueba separada. Si se elige el umbral mirando la prueba final, esa prueba deja de ser una comprobación independiente. Cambiar el umbral conserva el modelo y sus puntuaciones.",
    "notebooks": [
      "laboratorio-ml.ipynb"
    ],
    "quiz": {
      "q": "Al subir el umbral de 0,50 a 0,70, ¿qué cambia?",
      "choices": [
        "La regla para activar una alerta.",
        "La realidad de las plantas.",
        "El número original de plantas."
      ],
      "answer": 0,
      "feedback": "La misma puntuación puede generar otra decisión. Un umbral no modifica las etiquetas reales."
    },
    "source": "https://scikit-learn.org/stable/modules/classification_threshold.html"
  },
  {
    "id": "ml-clustering",
    "title": "Parecidos no son categorías de calidad",
    "concept": "K-Means solicita el número k de grupos y ajusta centros; Mean-Shift busca concentraciones de puntos según una escala de vecindad; DBSCAN conecta puntos densos dentro de un radio. En DBSCAN, un núcleo cumple el mínimo de vecinos, un borde puede quedar unido a un núcleo y el resto queda sin asignar. Sus etiquetas son identificadores de grupo.",
    "notebooks": [
      "laboratorio-ml.ipynb",
      "clustering.ipynb"
    ],
    "quiz": {
      "q": "¿Qué significa un punto no agrupado por DBSCAN?",
      "choices": [
        "Debe eliminarse.",
        "Tiene calidad baja.",
        "No pertenece a un grupo con esa configuración."
      ],
      "answer": 2,
      "feedback": "Cambiar escala o parámetros puede cambiar su etiqueta. Investiga su significado antes de descartarlo."
    },
    "source": "https://scikit-learn.org/stable/modules/clustering.html#dbscan"
  },
  {
    "id": "ml-pca",
    "title": "Resumir sin inventar clases",
    "concept": "El centrado resta la media; el escalado cambia la unidad o dispersión de cada variable. Son pasos diferentes. Si una variable tiene una escala mucho mayor, puede dominar la proyección. La varianza explicada de los componentes elegidos se compara con la varianza total de las variables preparadas; no mide qué tan bien se conserva toda propiedad útil para una tarea.",
    "notebooks": [
      "pca.ipynb"
    ],
    "quiz": {
      "q": "¿Conservar 93 % de varianza significa 93 % de aciertos?",
      "choices": [
        "Sí.",
        "No: son conceptos diferentes.",
        "Solo en clasificación."
      ],
      "answer": 1,
      "feedback": "Varianza resume dispersión de las entradas. Una tarea predictiva requiere su propia evaluación."
    },
    "source": "https://scikit-learn.org/stable/modules/decomposition.html#pca"
  },
  {
    "id": "ml-ensambles",
    "title": "Varias respuestas, una comparación justa",
    "concept": "Bagging ajusta modelos con muestras de entrenamiento tomadas con reemplazo y agrega sus predicciones. Boosting añade modelos en secuencia para reducir una pérdida conjunta. Stacking ajusta un combinador con predicciones de modelos base obtenidas sin usar para su ajuste la respuesta de esa misma fila. Elegir un modelo requiere validación y evaluar después la elección en una prueba final reservada.",
    "notebooks": [
      "laboratorio-ml.ipynb"
    ],
    "quiz": {
      "q": "¿Qué hace justa la comparación del laboratorio?",
      "choices": [
        "Elegir nombres conocidos.",
        "Cambiar las fincas de prueba para cada modelo.",
        "Usar las mismas fincas de prueba y la misma métrica."
      ],
      "answer": 2,
      "feedback": "Cambiar el conjunto o la métrica puede producir diferencias que no vienen del algoritmo."
    },
    "source": "https://scikit-learn.org/stable/modules/ensemble.html"
  },
  {
    "id": "ml-series",
    "title": "El futuro va después",
    "concept": "Tendencia es un cambio sostenido del nivel de una serie; estacionalidad es un patrón que se repite con un periodo. Al evaluar, la preparación también debe aprenderse solo con fechas anteriores al corte. Para comprobar estabilidad, se pueden usar varios cortes históricos, siempre entrenando antes de cada ventana de evaluación.",
    "notebooks": [
      "laboratorio-ml.ipynb"
    ],
    "quiz": {
      "q": "¿Podemos mezclar semanas futuras y pasadas al evaluar un pronóstico?",
      "choices": [
        "No: respetamos el orden y lo disponible al pronosticar.",
        "Sí, siempre mejora la prueba.",
        "Solo si hay pocas semanas."
      ],
      "answer": 0,
      "feedback": "Una partición aleatoria puede dar información del futuro a un modelo que debía aprender del pasado."
    },
    "source": "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html"
  },
  {
    "id": "ml-refuerzo",
    "title": "Aprender de las consecuencias",
    "concept": "Q-learning mantiene valores Q(estado, acción) que estiman recompensa futura descontada. La experiencia actualiza esos valores y permite elegir una acción según lo aprendido. Explorar consiste en probar alternativas; aprovechar consiste en elegir según los valores actuales. La recompensa acumulada de una ruta y el valor Q de una acción son cantidades diferentes.",
    "notebooks": [
      "refuerzo.ipynb"
    ],
    "quiz": {
      "q": "¿Qué describe una política en aprendizaje por refuerzo?",
      "choices": [
        "La regla para elegir una acción a partir del estado.",
        "La suma de todas las medidas del conjunto.",
        "El nombre de la casilla de meta."
      ],
      "answer": 0,
      "feedback": "Una política indica cómo actuar en cada estado. Las recompensas obtenidas permiten evaluar y mejorar esa forma de elegir."
    },
    "source": "https://gymnasium.farama.org/introduction/basic_usage/"
  },
  {
    "id": "ml-integracion",
    "title": "Explicar el resultado antes de usarlo",
    "concept": "La referencia establece qué ofrece una regla sencilla; la propuesta se compara sobre los mismos casos. Si se prueban muchas configuraciones, se eligen con validación y se conserva una prueba para evaluar la elección. Para usar el resultado en otra temporada o proceso, se comprueba con datos representativos de ese uso.",
    "notebooks": [
      "laboratorio-ml.ipynb"
    ],
    "quiz": {
      "q": "¿Qué conclusión respaldan los datos simulados del laboratorio?",
      "choices": [
        "Que el modelo ya funciona en cualquier finca.",
        "Que ciertas configuraciones mejoraron la referencia en esta prueba.",
        "Que aumentar fertilizante causa siempre más producción."
      ],
      "answer": 1,
      "feedback": "Una evaluación tiene un alcance concreto. Trasladarla a otro contexto requiere nueva evidencia."
    },
    "source": "https://scikit-learn.org/stable/common_pitfalls.html"
  },
  {
    "id": "dl-redes",
    "title": "Una red transforma entradas",
    "concept": "Una capa transforma un conjunto de entradas; las capas ocultas producen representaciones intermedias y la capa de salida responde a la tarea. Pesos y sesgos son parámetros. El cálculo de salida usa sus valores actuales; el entrenamiento los modifica según una pérdida. Añadir capas aumenta posibilidades de representación, pero no garantiza menor error con casos nuevos.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Qué son los pesos de una red?",
      "choices": [
        "Nombres de las clases.",
        "Parámetros que se ajustan al aprender.",
        "El porcentaje de aciertos."
      ],
      "answer": 1,
      "feedback": "Los pesos determinan cómo se combinan las señales. Se aprenden con datos y un criterio de error."
    },
    "source": "https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html"
  },
  {
    "id": "dl-activaciones",
    "title": "La activación cambia la respuesta",
    "concept": "ReLU(z) = máximo(0,z); sigmoid(z) = 1/(1+exp(−z)); tanh(z) = (exp(z)−exp(−z))/(exp(z)+exp(−z)). exp(z) es la función exponencial. Para entradas finitas, sigmoid queda estrictamente entre 0 y 1 y tanh entre −1 y 1. El redondeo puede ocultar diferencias pequeñas.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Qué hace ReLU con una entrada negativa?",
      "choices": [
        "La devuelve en valor absoluto.",
        "Produce siempre 0,5.",
        "La convierte en cero."
      ],
      "answer": 2,
      "feedback": "ReLU conserva señales positivas y lleva las negativas a cero. Eso no representa por sí solo una categoría."
    },
    "source": "https://docs.pytorch.org/docs/stable/generated/torch.nn.ReLU.html"
  },
  {
    "id": "dl-entrenamiento",
    "title": "El error guía los ajustes",
    "concept": "Una época recorre una vez los ejemplos de entrenamiento. En cada actualización se calcula la salida, se obtiene una pérdida, se calculan sus gradientes y se aplica el optimizador. La curva de entrenamiento describe ese proceso; las métricas en validación o prueba describen cómo funciona con ejemplos que no participaron en el ajuste de parámetros.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Una pérdida baja en entrenamiento garantiza buenos resultados nuevos?",
      "choices": [
        "Sí.",
        "No: necesitamos evaluación con datos reservados.",
        "Solo si hay más épocas."
      ],
      "answer": 1,
      "feedback": "Una red puede memorizar. Épocas, pérdida y calidad en prueba son conceptos distintos."
    },
    "source": "https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html"
  },
  {
    "id": "dl-vision",
    "title": "Tres preguntas distintas para una imagen",
    "concept": "La segmentación semántica asigna una categoría a cada píxel; la segmentación de instancias distingue además objetos individuales de una misma categoría. Una caja es un rectángulo e incluye normalmente parte del fondo; una máscara describe una región de píxeles. La escena de este tema dibuja las salidas para compararlas; el cuaderno ejecuta detección con cajas.",
    "notebooks": [
      "laboratorio-dl.ipynb",
      "yolo-registro.ipynb"
    ],
    "quiz": {
      "q": "¿Qué salida corresponde a detección?",
      "choices": [
        "Solo una etiqueta de imagen.",
        "Una categoría y una caja por detección.",
        "Una máscara de todos los píxeles necesariamente."
      ],
      "answer": 1,
      "feedback": "La caja aproxima localización. Una máscara requiere una tarea o un modelo de segmentación."
    },
    "source": "https://docs.ultralytics.com/modes/predict/"
  },
  {
    "id": "dl-cnn",
    "title": "Aprender patrones locales de píxeles",
    "concept": "En una capa CNN, la operación habitual multiplica cada ventana por los pesos del filtro sin invertirlo, técnicamente una correlación cruzada. Reutiliza los mismos pesos en cada posición. El paso indica cuánto se desplaza la ventana y el relleno añade valores alrededor de la entrada; ambos cambian el tamaño del mapa. Aquí el paso es 1 y no hay relleno.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Aplicar un filtro fijo equivale a entrenar una CNN?",
      "choices": [
        "No: explica una operación, no un aprendizaje completo.",
        "Sí, si el filtro tiene tres columnas.",
        "Solo en fotos de plantas."
      ],
      "answer": 0,
      "feedback": "Entrenar una CNN ajusta parámetros a partir de ejemplos y pérdida; un filtro fijo solo muestra su operación."
    },
    "source": "https://docs.pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html"
  },
  {
    "id": "dl-transferencia",
    "title": "Reutilizar lo aprendido",
    "concept": "Se puede conservar un extractor preentrenado y aprender una nueva salida, o ajustar parte de sus parámetros con ejemplos nuevos. Traducir modelo.names cambia textos, no los parámetros. Antes de adaptar se definen categorías, ejemplos etiquetados y una prueba separada; el cuaderno YOLO de este tema solo carga pesos y ejecuta inferencia.",
    "notebooks": [
      "yolo-registro.ipynb"
    ],
    "quiz": {
      "q": "¿Renombrar una salida a «café defectuoso» enseña esa categoría al modelo?",
      "choices": [
        "Sí.",
        "No: cambiar un texto no entrena pesos.",
        "Solo si usamos GPU."
      ],
      "answer": 1,
      "feedback": "La correspondencia entre categorías y ejemplos se aprende con datos. Una GPU cambia ejecución, no el significado de las clases."
    },
    "source": "https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html"
  },
  {
    "id": "dl-secuencias",
    "title": "El orden puede cambiar el significado",
    "concept": "Una RNN actualiza su estado con los parámetros actuales en cada paso; durante el entrenamiento se ajustan esos parámetros con secuencias. LSTM añade mecanismos que controlan qué información se mantiene o actualiza. El promedio de una lista no cambia al reordenarla, pero una regla recurrente puede producir estados finales diferentes.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "Con la regla del ejemplo, ¿qué ocurre al invertir 10 → 20 → 30?",
      "choices": [
        "Cambia el estado final, aunque el promedio sigue en 20.",
        "El estado final siempre permanece igual.",
        "El promedio pasa de 20 a 30."
      ],
      "answer": 0,
      "feedback": "La regla combina estado anterior y entrada actual: produce 21,25 en un orden y 13,75 en el inverso. El promedio de los mismos tres valores es 20."
    },
    "source": "https://arxiv.org/abs/1706.03762"
  },
  {
    "id": "dl-atencion",
    "title": "Relacionar elementos con contexto",
    "concept": "En la atención escalada, las puntuaciones son Q·K divididas por la raíz cuadrada del número de componentes de cada clave. Softmax convierte esas puntuaciones en pesos y la salida es su suma ponderada de V. En una red, Q, K y V suelen obtenerse mediante transformaciones aprendidas. Un peso de atención describe una contribución interna, no una causa demostrada de la decisión final.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Qué se hace con los pesos obtenidos mediante softmax?",
      "choices": [
        "Se suman a las etiquetas esperadas.",
        "Se multiplican por los valores V y se suman sus contribuciones.",
        "Se sustituyen por las posiciones de entrada."
      ],
      "answer": 1,
      "feedback": "La salida de atención es una suma ponderada de V. En el caso, 0,6698 × 10 + 0,3302 × 20 ≈ 13,302; se usan los pesos sin redondear."
    },
    "source": "https://arxiv.org/abs/1706.03762"
  },
  {
    "id": "dl-transformers",
    "title": "Atención más información de orden",
    "concept": "El encoder es el bloque que transforma la secuencia mediante atención y otras capas. En este cuaderno se añade un vector de posición y después se conserva cada posición al aplanar la salida para clasificar. La regla de etiquetas y el formato de las entradas deben mantenerse al crear casos nuevos. La exactitud se calcula comparando las predicciones con esas etiquetas.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "Para la secuencia [3,1,7,2], ¿cuál es la etiqueta si la regla es primero > último?",
      "choices": [
        "0, porque aparece un 1.",
        "1, porque 3 es mayor que 2.",
        "7, porque es el número máximo."
      ],
      "answer": 1,
      "feedback": "La regla compara posiciones: primero 3 y último 2. La etiqueta esperada es 1; después se comprueba si la red predijo esa etiqueta."
    },
    "source": "https://arxiv.org/abs/1706.03762"
  },
  {
    "id": "dl-yolo",
    "title": "De una foto a un registro",
    "concept": "Una detección se conserva si cumple las reglas de salida del detector y del filtro aplicado. Coordenadas, categoría y puntuación permiten rastrear qué imagen produjo cada fila. Una misma escena puede producir omisiones o detecciones duplicadas, y un objeto de una categoría ausente del modelo puede no reconocerse. Por eso los conteos automáticos se revisan antes de usarse como inventario.",
    "notebooks": [
      "yolo-registro.ipynb"
    ],
    "quiz": {
      "q": "Si una categoría tiene cero detecciones, ¿probamos que no hay ningún objeto de ese tipo?",
      "choices": [
        "No: puede faltar detección o quedar bajo el umbral.",
        "Sí, siempre.",
        "Solo cuando la foto es grande."
      ],
      "answer": 0,
      "feedback": "Oclusión, categorías desconocidas y umbral pueden afectar las detecciones. Hay que revisar la escena."
    },
    "source": "https://docs.ultralytics.com/modes/predict/"
  },
  {
    "id": "dl-evaluacion",
    "title": "Una imagen marcada no prueba calidad",
    "concept": "Primero se filtran propuestas por puntuación y después se relacionan con objetos de referencia de la misma categoría mediante IoU. Aquí hay un solo objeto y una sola propuesta. Para muchos objetos se necesita una regla de correspondencia que evite contar un objeto varias veces. mAP resume curvas de precision y recall en una evaluación con anotaciones; no es la puntuación de una caja.",
    "notebooks": [
      "yolo-registro.ipynb"
    ],
    "quiz": {
      "q": "Con IoU mínima 0,50, puntuación 0,80 conservada e IoU 0,143, ¿qué cuenta el caso de un objeto?",
      "choices": [
        "Un verdadero positivo.",
        "Un falso positivo y un objeto omitido.",
        "Ningún error, porque la puntuación es alta."
      ],
      "answer": 1,
      "feedback": "La propuesta se conserva por puntuación, pero no coincide suficientemente con la caja de referencia: suma FP = 1 y FN = 1."
    },
    "source": "https://docs.ultralytics.com/modes/val/"
  },
  {
    "id": "dl-integracion",
    "title": "Del modelo a una decisión responsable",
    "concept": "Para el caso se supone que una revisión detecta todo defecto y que revisar cuesta lo mismo para cada grano. Estos supuestos permiten comprobar la cuenta. Una operación real también necesita medir errores de revisión, capacidad por turno y consecuencias. Cambiar los costes conservando los casos permite estudiar cómo cambia la política preferida.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Qué coste tiene revisar cuatro granos y aceptar un defecto si revisar cuesta 1 y aceptar un defecto cuesta 8?",
      "choices": [
        "4 unidades.",
        "8 unidades.",
        "12 unidades."
      ],
      "answer": 2,
      "feedback": "Coste = 4 × 1 + 1 × 8 = 12. La comparación de políticas conserva los casos y aplica la misma fórmula."
    },
    "source": "https://scikit-learn.org/stable/common_pitfalls.html"
  }
];
export const LESSONS=LESSON_BASE.map(lesson=>{const guide=LESSON_GUIDES[lesson.id];return {...lesson,guide,summary:guide.objective,example:guide.case.context+' '+guide.case.conclusion,steps:guide.case.reasoning,sim:guide.explorer};});
const BASE_GLOSSARY=[
  [
    "Machine Learning",
    "Aprendizaje automático: métodos que ajustan reglas con datos para tareas como predecir, clasificar o agrupar."
  ],
  [
    "Deep Learning",
    "Aprendizaje profundo: métodos que aprenden representaciones mediante redes neuronales con varias capas de transformaciones."
  ],
  [
    "Observación",
    "Un caso registrado, por ejemplo una finca en una temporada. En una tabla suele corresponder a una fila."
  ],
  [
    "Variable",
    "Una característica de los casos, como lluvia en mm o temperatura en °C. En una tabla suele corresponder a una columna."
  ],
  [
    "Entradas X",
    "Variables que el modelo recibe para calcular una salida. Deben estar disponibles al usarlo."
  ],
  [
    "Respuesta y",
    "Cantidad o categoría que se busca predecir. En aprendizaje supervisado se conoce para entrenar y comprobar ejemplos."
  ],
  [
    "Predicción",
    "Salida calculada por un modelo para unas entradas; se compara con una respuesta conocida para evaluar el error."
  ],
  [
    "Datos simulados",
    "Valores generados para practicar un procedimiento; se distinguen de mediciones de una operación real."
  ],
  [
    "Entrenamiento",
    "Proceso que ajusta parámetros o reglas con ejemplos de entrenamiento."
  ],
  [
    "Conjunto de entrenamiento",
    "Ejemplos utilizados para aprender la preparación y los parámetros del modelo."
  ],
  [
    "Validación",
    "Ejemplos o particiones usados para elegir configuraciones, como una tasa o un umbral, dentro del desarrollo."
  ],
  [
    "Prueba",
    "Ejemplos reservados para evaluar la solución elegida. Sus respuestas no se usan para ajustar parámetros ni elegir configuraciones."
  ],
  [
    "Imputación",
    "Completar un valor ausente con una estimación, conservando que la medición original falta."
  ],
  [
    "Mediana",
    "Valor central de una lista ordenada; si hay una cantidad par de valores, media de los dos centrales."
  ],
  [
    "Pipeline",
    "Secuencia que conecta preparación y modelo. Cada paso que aprende una regla se ajusta con entrenamiento y se reutiliza al predecir."
  ],
  [
    "MAE",
    "Error absoluto medio: promedio de |observado − predicho|. Se expresa en las unidades de la respuesta."
  ],
  [
    "RMSE",
    "Raíz del promedio de los errores al cuadrado. Se expresa en las unidades de la respuesta y penaliza más los errores grandes."
  ],
  [
    "Umbral",
    "Valor límite elegido para aplicar una regla. Hay que declarar si acepta igualdad (≥) o exige superar el límite (>); las dos convenciones aparecen identificadas en las demostraciones."
  ],
  [
    "Precision",
    "Detecciones positivas correctas divididas entre todas las alertas: TP/(TP+FP). Si no hay alertas, ese cociente no está definido."
  ],
  [
    "Recall",
    "Positivos reales detectados divididos entre todos los positivos reales: TP/(TP+FN)."
  ],
  [
    "Accuracy",
    "Aciertos totales divididos entre todos los casos: (TP+TN)/(TP+FP+FN+TN)."
  ],
  [
    "Componente PCA",
    "Nueva dirección, perpendicular a las anteriores, que conserva la máxima variación restante de las variables centradas."
  ],
  [
    "Peso",
    "Parámetro que multiplica una entrada o representación antes de combinarla con otras."
  ],
  [
    "Pérdida",
    "Función numérica que mide desacuerdo y sirve de objetivo al ajustar parámetros."
  ],
  [
    "Gradiente",
    "Conjunto de derivadas que indica cómo cambia una función al variar cada parámetro. Para un parámetro es su pendiente."
  ],
  [
    "Tasa de aprendizaje",
    "Factor que multiplica el gradiente en una actualización; con el mismo gradiente, una tasa mayor produce un cambio mayor."
  ],
  [
    "Inferencia",
    "Cálculo de predicciones con un modelo, manteniendo sus parámetros sin actualizar."
  ],
  [
    "Caja de detección",
    "Rectángulo que propone la ubicación de un objeto; sus coordenadas y categoría forman parte de una detección."
  ],
  [
    "Atención",
    "Cálculo que compara una consulta con claves, obtiene pesos y combina los valores asociados mediante esos pesos."
  ],
  [
    "Regresión",
    "Tarea que estima una cantidad, como toneladas por hectárea o minutos por solicitud."
  ],
  [
    "Clasificación",
    "Tarea que asigna categorías definidas, aprendiendo con ejemplos de categoría conocida."
  ],
  [
    "Ensamble",
    "Combinación de predicciones de varios modelos para producir una salida. Su mejora se comprueba con una comparación común."
  ],
  [
    "Sesgo de una neurona",
    "Parámetro que se añade a la suma de entradas multiplicadas por sus pesos."
  ],
  [
    "Activación",
    "Función aplicada a la señal de una neurona. ReLU devuelve cero para entradas negativas y conserva las no negativas."
  ],
  [
    "Convolución",
    "En una CNN, operación que desplaza un filtro por la entrada y obtiene una suma de productos en cada ventana."
  ],
  [
    "Filtro",
    "Tabla de pesos aplicada a cada ventana para calcular una respuesta local. Puede estar fijada para un ejercicio o aprendida en una red."
  ],
  [
    "Estado recurrente",
    "Resumen que se actualiza usando el estado del paso anterior y la entrada actual."
  ],
  [
    "Token",
    "Unidad de una secuencia representada mediante números. Puede ser una palabra, parte de una palabra u otro elemento según la tarea."
  ],
  [
    "Información de posición",
    "Representación del lugar de un elemento en la secuencia, usada para distinguir órdenes."
  ],
  [
    "Consulta, clave y valor",
    "Q se compara con K para calcular puntuaciones y pesos; los pesos se aplican a V para obtener la combinación."
  ],
  [
    "Softmax",
    "Función que divide la exponencial de cada puntuación por la suma de todas las exponenciales: obtiene pesos positivos que suman 1."
  ],
  [
    "IoU",
    "Área de intersección / área de unión de dos cajas. Sin solapamiento vale 0; si coinciden por completo vale 1. No tiene unidades."
  ],
  [
    "Modelo preentrenado",
    "Modelo cuyos parámetros se ajustaron previamente. Puede reutilizarse para inferencia o servir de punto de partida para otro entrenamiento."
  ],
  [
    "Política",
    "Regla para elegir acciones a partir de un estado o una puntuación. En refuerzo se aprende mediante experiencia; en las alertas puede fijarse con un umbral."
  ],
  [
    "Calibración",
    "Correspondencia entre probabilidades predichas y frecuencias observadas: entre casos con probabilidad 0,80 se espera alrededor de 80 % de positivos si están bien calibradas."
  ]
];
export const GLOSSARY=reviewedGlossary(BASE_GLOSSARY);
export function findLesson(id){return LESSONS.find(l=>l.id===id)}
export function classOf(id){const c=COURSES[id.split('-')[0]];return c?.classes.find(cl=>cl.topics.includes(id))}
export const NOTEBOOKS={
 'laboratorio-ml.ipynb':{title:'Laboratorio ML explicado',hint:'Preparación, referencia, métricas, ensambles, DBSCAN y series. Empieza por el bloque de esta clase.'},
 'regresion.ipynb':{title:'Regresión con fertilizante y lluvia',hint:'Recta, curva y regularización con ejemplos simulados.'},
 'clasificacion.ipynb':{title:'Clasificación e Iris',hint:'Logística, bosque, SVM y KNN con datos distintos.'},
 'clustering.ipynb':{title:'Agrupación de fincas simuladas',hint:'K-Means y Mean-Shift. Lee escala, parámetros y colores.'},
 'pca.ipynb':{title:'PCA de tres variables a componentes',hint:'Gráficos 3D, 2D y 1D; varianza calculada con los datos.'},
 'refuerzo.ipynb':{title:'Q-learning en GridWorld',hint:'Simulación con paredes, pozo y meta; recompensa y política.'},
 'laboratorio-dl.ipynb':{title:'Laboratorio DL ilustrado',hint:'Ruta por encuentro: preparación, 01/09 (redes), 10 (CNN), 11 LSTM, 12 (atención/Transformer) y 14 (decisiones). Repaso y extensiones separados.'},
 'yolo-registro.ipynb':{title:'YOLO: foto → detecciones → registro',hint:'Fotos de demostración, propuestas y registro; evaluación de cajas sintéticas con referencia conocida.'}
};
