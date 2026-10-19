import {LESSON_GUIDES} from './learning-guides.js';
export const REPO='kthyon/diplomado-utp-aula';
export const SOURCES={ml:'https://docs.google.com/presentation/d/1UOnYu1aT7Sg58BUlmPL6_BNyoFlhFc4Zu456IZP93ns/edit',terms:'https://docs.google.com/document/d/1WfPiuA4LUkE3axpf3qb_-_cQu55OEpnwQohtTyN2zYo/edit',dl:'https://docs.google.com/document/d/1buuOnf-xMsWfpRQeyW2swHEt9I7JKsroikz0rKsG_G0/edit',activation:'https://docs.google.com/document/d/1qsi3HQwW0zRlLMyAplVuANgZzmuLhcIhvOAJaiUxU6c/edit'};
export const COURSES={
 ml:{id:'ml',module:5,title:'Machine Learning',subtitle:'Construir predicciones, alertas y pronósticos para resolver tareas operativas.',color:'verde',dates:'23, 24, 30 y 31 de octubre',classes:[
  {title:'Del problema a la primera predicción',date:'23 oct',iso:'2026-10-23',time:'Viernes · 18:00–22:00',topics:['ml-problema','ml-preparacion','ml-regresion']},
  {title:'Clasificar y entender los errores',date:'24 oct',iso:'2026-10-24',time:'Sábado · 08:00–12:00',topics:['ml-clasificacion','ml-metricas','ml-umbral']},
  {title:'Encontrar estructura y combinar modelos',date:'30 oct',iso:'2026-10-30',time:'Viernes · 18:00–22:00',topics:['ml-clustering','ml-pca','ml-ensambles']},
  {title:'El tiempo, las decisiones y el cierre',date:'31 oct',iso:'2026-10-31',time:'Sábado · 08:00–12:00',topics:['ml-series','ml-refuerzo','ml-integracion']}
 ]},
 dl:{id:'dl',module:6,title:'Deep Learning',subtitle:'Construir cálculos, pruebas y registros con redes, imágenes y secuencias.',color:'naranja',dates:'6, 7, 13 y 14 de noviembre',classes:[
  {title:'Cómo aprende una red neuronal',date:'6 nov',iso:'2026-11-06',time:'Viernes · 18:00–22:00',topics:['dl-redes','dl-activaciones','dl-entrenamiento']},
  {title:'De los píxeles a la representación',date:'7 nov',iso:'2026-11-07',time:'Sábado · 08:00–12:00',topics:['dl-vision','dl-cnn','dl-transferencia']},
  {title:'Secuencias, atención y contexto',date:'13 nov',iso:'2026-11-13',time:'Viernes · 18:00–22:00',topics:['dl-secuencias','dl-atencion','dl-transformers']},
  {title:'Detección y decisiones con evidencia',date:'14 nov',iso:'2026-11-14',time:'Sábado · 08:00–12:00',topics:['dl-yolo','dl-evaluacion','dl-integracion']}
 ]}
};
const LESSON_BASE=[
  {
    "id": "ml-problema",
    "title": "Primero la pregunta, después el modelo",
    "concept": "Un modelo aprende una regla a partir de ejemplos. Antes de escoger un algoritmo, define qué quieres estimar, qué representa cada fila y qué información estará disponible al usarlo. Regresión estima una cantidad; clasificación asigna una categoría.",
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
    "concept": "Imputar significa completar un dato ausente con una estimación. Esa regla debe aprenderse con entrenamiento y aplicarse sin recalcularla a prueba. Un pipeline encadena preparación y modelo.",
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
      "feedback": "Usar datos de prueba para aprender la preparación introduce información reservada. La cifra de 600 mm es ilustrativa; el laboratorio calcula su propia mediana."
    },
    "source": "https://scikit-learn.org/stable/common_pitfalls.html"
  },
  {
    "id": "ml-regresion",
    "title": "Una predicción también tiene error",
    "concept": "La regresión relaciona entradas con una cantidad. El MAE promedia distancias absolutas entre predicción y respuesta conocida. Tiene las unidades del objetivo. Para juzgar una mejora, compara con una referencia sencilla sobre los mismos datos de prueba.",
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
    "concept": "Clasificación aprende con categorías conocidas. Algunos modelos producen probabilidades o puntuaciones; una regla de decisión las transforma en clases. Una frontera divide el espacio de entradas según las decisiones del modelo.",
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
      "feedback": "La definición de la salida importa. El simulador usa probabilidad ilustrativa de plaga; el cuaderno de logística usa rendimiento alto."
    },
    "source": "https://scikit-learn.org/stable/modules/classification_threshold.html"
  },
  {
    "id": "ml-metricas",
    "title": "Diez plantas, cuatro resultados posibles",
    "concept": "Una matriz cruza realidad y predicción. Precision mide qué proporción de alertas era correcta; recall, qué proporción de positivos detectamos; accuracy, qué proporción de casos acertamos. Sus consecuencias pueden ser diferentes.",
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
    "concept": "En este ejemplo activamos alerta si la puntuación es mayor o igual al umbral. Bajar el umbral puede detectar más positivos y generar más falsas alertas. Se elige con validación y con las consecuencias de cada error; no ajustándolo con la prueba final.",
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
    "concept": "Clustering busca grupos sin etiquetas de grupo conocidas. K-Means solicita k centros; Mean-Shift busca zonas densas; DBSCAN depende de cercanía y densidad. Los identificadores de grupo no indican bueno o malo.",
    "notebooks": [
      "clustering.ipynb",
      "laboratorio-ml.ipynb"
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
    "concept": "PCA combina variables en nuevas direcciones: la primera conserva la máxima varianza; las siguientes son ortogonales entre sí y capturan la variación restante. Reducir dimensiones conserva parte de esa variación y descarta otra. Los ejes nuevos no son necesariamente las variables originales ni medidas de exactitud.",
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
    "concept": "Un ensamble combina modelos. Bagging ajusta modelos con muestras de filas tomadas con reemplazo y agrega sus predicciones. Boosting añade modelos en secuencia para reducir la pérdida del conjunto. Stacking aprende a combinar predicciones hechas fuera de la muestra usada para ajustar cada modelo base, dentro del entrenamiento. Combinar no garantiza mejorar: hay que evaluar.",
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
    "concept": "Una serie está ordenada por tiempo. Tendencia es cambio de largo plazo; estacionalidad es un patrón periódico; horizonte es cuánto adelante pronosticamos. Para evaluar el futuro, respetamos el orden temporal.",
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
    "concept": "En refuerzo, un agente interactúa con un entorno. Estado es la situación actual; acción, una elección; recompensa, la señal recibida; política, la forma de elegir. Explorar reúne experiencia y aprovechar elige según lo aprendido.",
    "notebooks": [
      "refuerzo.ipynb"
    ],
    "quiz": {
      "q": "¿El simulador manual de esta web entrena automáticamente Q-learning?",
      "choices": [
        "Sí.",
        "No: permite entender el entorno y las recompensas.",
        "Solo al llegar a meta."
      ],
      "answer": 1,
      "feedback": "El entrenamiento ocurre en el cuaderno. Aquí exploramos las decisiones que ese aprendizaje debe evaluar."
    },
    "source": "https://gymnasium.farama.org/introduction/basic_usage/"
  },
  {
    "id": "ml-integracion",
    "title": "Explicar el resultado antes de usarlo",
    "concept": "Entender un modelo implica explicar qué pregunta responde, con qué datos aprendió, cómo se comprobó y qué queda fuera de la conclusión. Un número aislado o un gráfico atractivo no sustituye ese recorrido.",
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
    "concept": "Una red combina entradas con pesos, aplica transformaciones y produce una salida. Los pesos son parámetros aprendidos; una capa oculta construye una representación intermedia. Más capas no equivalen automáticamente a más calidad.",
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
    "concept": "Una activación transforma la señal de una neurona. ReLU deja en cero las negativas; sigmoid produce valores entre 0 y 1; tanh entre −1 y 1. La interpretación depende del lugar de la función y de la tarea.",
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
    "concept": "La pérdida mide desacuerdo según la tarea. Retropropagación calcula cómo afecta cada parámetro a esa pérdida; el optimizador aplica ajustes. La tasa de aprendizaje controla su tamaño. Bajar pérdida de entrenamiento no prueba generalización.",
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
    "concept": "Clasificar responde qué categoría corresponde a una imagen o recorte. Detectar añade dónde hay objetos mediante cajas. Segmentar asigna píxeles a objetos o categorías. La salida necesaria determina la tarea y las etiquetas.",
    "notebooks": [
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
    "concept": "Una convolución aplica un filtro a regiones locales y crea un mapa de respuestas. Una CNN aprende filtros durante entrenamiento; no recibe reglas escritas para cada borde. Los mapas posteriores pueden combinar patrones más complejos.",
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
    "concept": "Un modelo preentrenado ya ajustó parámetros con otro conjunto de datos. Inferencia usa esos pesos para predecir; fine-tuning actualiza parte o todos con nuevos ejemplos. Reutilizar pesos no garantiza conocer una categoría nueva.",
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
    "concept": "Una secuencia tiene elementos cuyo orden puede importar. Un token es una unidad de representación; una posición informa dónde está. Contar los mismos elementos puede perder relaciones importantes.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Una bolsa de palabras siempre conserva el orden de una frase?",
      "choices": [
        "No: suele resumir presencia o frecuencia.",
        "Sí, por definición.",
        "Solo si todas las palabras son distintas."
      ],
      "answer": 0,
      "feedback": "Para tareas dependientes del orden hay que representarlo de alguna forma."
    },
    "source": "https://arxiv.org/abs/1706.03762"
  },
  {
    "id": "dl-atencion",
    "title": "Relacionar elementos con contexto",
    "concept": "Atención calcula cuánto contribuyen ciertas representaciones a otra. Sus pesos permiten combinar señales según el contexto del modelo. Una visualización de atención no prueba qué causó una decisión ni constituye comprensión humana.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Los pesos de atención demuestran causalidad?",
      "choices": [
        "Sí, siempre.",
        "No: muestran una combinación interna, no una causa probada.",
        "Solo si suman uno."
      ],
      "answer": 1,
      "feedback": "Una suma normalizada no convierte la relación en causal. La interpretación debe apoyarse en más evidencia."
    },
    "source": "https://arxiv.org/abs/1706.03762"
  },
  {
    "id": "dl-transformers",
    "title": "Atención más información de orden",
    "concept": "Un transformer combina atención con otras transformaciones para construir representaciones. La información de posición permite distinguir órdenes. La arquitectura es una herramienta; su resultado depende de datos, entrenamiento y tarea.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Un transformer pequeño de secuencias sintéticas ya valida una aplicación real?",
      "choices": [
        "Sí, basta con usar atención.",
        "No: habría que evaluar esa aplicación con sus datos.",
        "Solo si la pérdida llega a cero."
      ],
      "answer": 1,
      "feedback": "La arquitectura no reemplaza datos representativos ni evaluación del uso final."
    },
    "source": "https://arxiv.org/abs/1706.03762"
  },
  {
    "id": "dl-yolo",
    "title": "De una foto a un registro",
    "concept": "Un detector devuelve categoría, puntuación y caja por detección. Filtrar por puntuación cambia qué registros conservamos. Un conteo de detecciones no equivale automáticamente al número real de objetos presentes.",
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
    "concept": "Para evaluar necesitamos respuestas conocidas y un criterio apropiado. En detección importan localización y categoría; una puntuación interna no es una medida directa de aciertos. Otra cámara, iluminación o finca puede cambiar resultados.",
    "notebooks": [
      "yolo-registro.ipynb",
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Puntuación 0,90 garantiza 90 % de aciertos de esa detección?",
      "choices": [
        "Sí.",
        "No: hace falta evaluar y conocer su calibración.",
        "Solo si supera el umbral."
      ],
      "answer": 1,
      "feedback": "El umbral filtra puntuaciones. Medir aciertos requiere comparar con la realidad etiquetada."
    },
    "source": "https://docs.ultralytics.com/modes/val/"
  },
  {
    "id": "dl-integracion",
    "title": "Del modelo a una decisión responsable",
    "concept": "Una salida del modelo y una acción operativa son pasos diferentes. La decisión considera los errores, sus consecuencias y la posibilidad de revisión humana. Un experimento didáctico no demuestra impacto económico real.",
    "notebooks": [
      "laboratorio-dl.ipynb"
    ],
    "quiz": {
      "q": "¿Qué debemos conservar al presentar un resultado?",
      "choices": [
        "Solo la imagen más llamativa.",
        "La pregunta, los datos, la comparación y sus límites.",
        "Solo el nombre del modelo."
      ],
      "answer": 1,
      "feedback": "El recorrido permite valorar qué respalda la evidencia y qué aún requiere comprobación."
    },
    "source": "https://scikit-learn.org/stable/common_pitfalls.html"
  }
];
export const LESSONS=LESSON_BASE.map(lesson=>{const guide=LESSON_GUIDES[lesson.id];return {...lesson,guide,summary:guide.objective,example:guide.case.context+' '+guide.case.conclusion,steps:guide.case.reasoning,sim:guide.explorer};});
export const GLOSSARY=[['Observación','Un caso: por ejemplo, una finca en una temporada. Debemos mantener claro qué representa cada fila.'],['Variable','Una característica registrada, como lluvia en mm o temperatura en °C.'],['Entradas X','La información que recibe el modelo al hacer una predicción.'],['Respuesta y','La cantidad o categoría conocida con la que aprendemos y evaluamos.'],['Datos simulados','Valores inventados para aprender un procedimiento. Sus resultados no validan un uso real.'],['Entrenamiento','Datos con los que se aprenden parámetros y preparación.'],['Validación','Datos o particiones para elegir configuraciones dentro del proceso de desarrollo.'],['Prueba','Datos reservados para comprobar la solución elegida.'],['Imputación','Completar un dato ausente con una estimación; ausencia no equivale a cero.'],['Pipeline','Una secuencia que encadena preparación y modelo, aprendida con entrenamiento.'],['MAE','Promedio de los errores absolutos. Usa las unidades de la respuesta.'],['Umbral','Regla que convierte una puntuación en una decisión.'],['Precision','Proporción de alertas que corresponden a positivos reales.'],['Recall','Proporción de positivos reales que fueron detectados.'],['Componente PCA','Combinación de variables en una dirección de máxima varianza restante, ortogonal a las anteriores.'],['Peso','Parámetro que determina cuánto contribuye una entrada o representación.'],['Pérdida','Criterio numérico de desacuerdo que guía el aprendizaje.'],['Inferencia','Usar un modelo aprendido para producir predicciones.'],['Caja de detección','Rectángulo que localiza aproximadamente un objeto detectado.'],['Atención','Combinación de representaciones con pesos dependientes del contexto del modelo.']];
GLOSSARY.push(
 ['Regresión','Una tarea que estima una cantidad, como toneladas por hectárea. Su resultado conserva las unidades de la respuesta.'],
 ['Clasificación','Una tarea que asigna categorías definidas usando ejemplos con categorías conocidas.'],
 ['Ensamble','Combinación de varios modelos para producir una salida; debe comprobarse con los mismos datos y criterio de comparación.'],
 ['Sesgo de una neurona','Número que se añade a la suma de entradas multiplicadas por sus pesos.'],
 ['Activación','Función que transforma la señal de una neurona. ReLU conserva valores positivos y devuelve cero para los negativos.'],
 ['Convolución','Aplicación de un mismo filtro a regiones locales de una entrada para producir un mapa de respuestas.'],
 ['Filtro','Conjunto de pesos aplicado a una región. Un filtro fijado para explicar una cuenta no equivale a filtros aprendidos mediante entrenamiento.'],
 ['Estado recurrente','Representación que se actualiza combinando el estado anterior con una nueva entrada; puede conservar información del orden.'],
 ['Token','Unidad de una secuencia representada mediante números. Puede corresponder a una palabra, parte de una palabra u otro elemento según la tarea.'],
 ['Información de posición','Representación de dónde está un elemento dentro de una secuencia, necesaria cuando la tarea depende del orden.'],
 ['Consulta, clave y valor','En atención, la consulta se compara con claves para calcular pesos; esos pesos combinan los valores asociados.'],
 ['Softmax','Transformación de puntuaciones en pesos no negativos que suman uno. Por sí sola no demuestra que estén calibrados como probabilidades.'],
 ['IoU','Área de intersección dividida por el área de unión de dos regiones. En cajas permite medir coincidencia de ubicación, no exactitud general.'],
 ['Modelo preentrenado','Modelo cuyos parámetros ya se ajustaron con otros datos. Usarlo para inferencia no los actualiza; adaptarlo requiere un procedimiento de ajuste.']
);
export function findLesson(id){return LESSONS.find(l=>l.id===id)}
export function classOf(id){const c=COURSES[id.split('-')[0]];return c?.classes.find(cl=>cl.topics.includes(id))}
export const NOTEBOOKS={
 'laboratorio-ml.ipynb':{title:'Laboratorio ML explicado',hint:'Preparación, referencia, métricas, ensambles, DBSCAN y series. Empieza por el bloque de esta clase.'},
 'regresion.ipynb':{title:'Regresión con fertilizante y lluvia',hint:'Recta, curva y regularización con ejemplos simulados.'},
 'clasificacion.ipynb':{title:'Clasificación e Iris',hint:'Logística, bosque, SVM y KNN con datos distintos.'},
 'clustering.ipynb':{title:'Agrupación de fincas simuladas',hint:'K-Means y Mean-Shift. Lee escala, parámetros y colores.'},
 'pca.ipynb':{title:'PCA de tres variables a componentes',hint:'Gráficos 3D, 2D y 1D; varianza calculada con los datos.'},
 'refuerzo.ipynb':{title:'Q-learning en GridWorld',hint:'Simulación con paredes, pozo y meta; recompensa y política.'},
 'laboratorio-dl.ipynb':{title:'Laboratorio DL ilustrado',hint:'Para DL: bloques 09 (redes), 10 (CNN), 11 (secuencias), 12 (atención/Transformer) y 14 (decisiones). Bloque 13: extensión.'},
 'yolo-registro.ipynb':{title:'YOLO: foto → detecciones → registro',hint:'Inferencia sobre fotos de demostración, lectura de cajas y exportación de resultados.'}
};
