export const LESSON_GUIDES={
  "ml-problema": {
    "objective": "Diseñar una primera predicción útil para planear una operación.",
    "relevance": "Una cooperativa necesita anticipar producción para organizar transporte antes de cosechar.",
    "concept": "Machine Learning o aprendizaje automático obtiene reglas a partir de datos para tareas como predecir cantidades o asignar categorías. En aprendizaje supervisado, cada ejemplo de entrenamiento incluye entradas y una respuesta conocida. El modelo ajusta su regla con esos ejemplos y después calcula respuestas para otros casos usando solo sus entradas. Si la respuesta buscada es una cantidad, como rendimiento en toneladas por hectárea (t/ha), la tarea se llama regresión.",
    "case": {
      "title": "Anticipar un lote reservado",
      "context": "Caso resuelto con datos inventados del mismo periodo: lluvia en milímetros (mm) y rendimiento en toneladas por hectárea (t/ha). Las primeras cuatro filas sirven para ajustar la regla. B quedó fuera de ese ajuste; aquí mostramos su respuesta conocida para comprobar el resultado.",
      "columns": [
        "Uso",
        "Lluvia (mm)",
        "Rendimiento (t/ha)"
      ],
      "rows": [
        [
          "Historia 1",
          "400",
          "2,00"
        ],
        [
          "Historia 2",
          "500",
          "2,50"
        ],
        [
          "Historia 3",
          "600",
          "3,00"
        ],
        [
          "Historia 4",
          "700",
          "3,50"
        ],
        [
          "Prueba B: respuesta revelada",
          "550",
          "3,10"
        ]
      ],
      "reasoning": [
        "La entrada es lluvia; la respuesta buscada es rendimiento. Cada fila representa un lote en un periodo.",
        "El patrón histórico suma 0,50 t/ha por cada 100 mm: para 550 mm predice 2,75 t/ha.",
        "Al revelar B, comparamos 3,10 con 2,75: el error absoluto es 0,35 t/ha. Predecir no es adivinar exactamente."
      ],
      "conclusion": "Para B estimamos 2,75 t/ha y observamos 3,10 t/ha: el error es 0,35 t/ha. Si B tiene 10 ha, la estimación total sería 27,5 toneladas y la producción observada 31: una diferencia de 3,5 toneladas para revisar al planear transporte. Esta relación inventada no demuestra que aumentar lluvia cause ese aumento.",
      "question": "¿Qué rendimiento estimamos para B si conocemos 550 mm de lluvia y qué error obtenemos al comprobarlo?"
    },
    "vocabulary": [
      {
        "term": "Entrada",
        "meaning": "Información disponible cuando calculas la predicción; aquí, lluvia en mm."
      },
      {
        "term": "Respuesta",
        "meaning": "Cantidad o categoría buscada; aquí, rendimiento en t/ha."
      },
      {
        "term": "Caso reservado",
        "meaning": "Ejemplo que queda fuera del ajuste y se usa después para comprobar la predicción."
      }
    ],
    "lab": {
      "title": "De los datos a la comprobación",
      "objective": "Construir: ficha de una predicción.",
      "instruction": "Avanza por datos, patrón, predicción y comparación. Selecciona el lote B antes de revelar su rendimiento.",
      "watch": "Separa el valor predicho del reservado; solo el último permite calcular el error.",
      "expected": "Para B: predicción 2,75 t/ha, observado 3,10 t/ha y error absoluto 0,35 t/ha.",
      "notebookGuide": "En Laboratorio ML explicado, sección 1.1, trabaja con la tabla de 240 fincas simuladas: lluvia, temperatura y fertilizante son las tres entradas; rendimiento es la respuesta. Las siguientes secciones separan las fincas de entrenamiento y de prueba."
    },
    "takeaway": "Define la unidad de cada fila, las entradas disponibles al decidir y la respuesta que quieres estimar. Comprueba las predicciones con casos que quedaron fuera del ajuste.",
    "next": "Antes de aprender, revisemos qué hacer cuando falta una entrada.",
    "explorer": "problem",
    "build": {
      "title": "Ficha de una predicción",
      "steps": [
        "Define la decisión: anticipar producción para organizar transporte. Anota una fila por lote y periodo, la entrada disponible y la respuesta con sus unidades.",
        "Usa el lote B: registra 550 mm, predicción 2,75 t/ha y, después de revelarlo, observado 3,10 t/ha. Calcula la diferencia absoluta.",
        "En tu copia de Laboratorio ML, identifica las columnas equivalentes de 1.1. Escribe qué información conocerías antes de cosechar y cuál debes reservar."
      ],
      "check": "La ficha separa entrada, predicción y observado; el error de B es 0,35 t/ha. La respuesta reservada no aparece entre las entradas.",
      "transfer": "Para anticipar pedidos de una bodega, cambia lote por producto-semana, define pedidos como respuesta y usa solo información disponible al planear.",
      "stretch": "Si ya programas: crea una tabla con columnas entrada, predicción, observado y error absoluto para los casos de prueba del cuaderno."
    }
  },
  "ml-preparacion": {
    "objective": "Preparar una tabla con datos ausentes sin contaminar la prueba.",
    "relevance": "Si falla una estación, escribir cero confundiría ausencia de medida con ausencia de lluvia.",
    "concept": "Preparar datos consiste en revisar registros, unidades y valores ausentes antes de ajustar un modelo. Imputar es completar una ausencia con una estimación; aquí usamos la mediana, el valor central de las medidas ordenadas. Calculamos esa regla con entrenamiento y la aplicamos a los demás casos sin volver a calcularla con la prueba. Conservamos una marca que permita distinguir valores medidos de estimados.",
    "case": {
      "title": "La estación B no registró lluvia",
      "context": "Cuatro fincas de entrenamiento y lluvia inventada del mismo periodo. B tiene una ausencia, no una medida de cero.",
      "columns": [
        "Finca",
        "Registro de lluvia (mm)",
        "Tipo de valor"
      ],
      "rows": [
        [
          "A",
          "500",
          "Medido"
        ],
        [
          "B",
          "Sin registro",
          "Ausente"
        ],
        [
          "C",
          "600",
          "Medido"
        ],
        [
          "D",
          "700",
          "Medido"
        ]
      ],
      "reasoning": [
        "Tomamos los registros conocidos de entrenamiento y los ordenamos: 500, 600, 700 mm.",
        "El valor central es 600 mm. Usamos esa mediana para completar B y conservamos la marca de estimación.",
        "Si faltara lluvia en prueba, aplicaríamos esos 600 mm, sin recalcular usando la prueba."
      ],
      "conclusion": "La fila queda utilizable mediante una regla explícita; seguimos sin saber cuánto llovió realmente en B.",
      "question": "¿Con qué valor completamos la lluvia de B sin confundir ausencia de registro con cero lluvia?"
    },
    "vocabulary": [
      {
        "term": "Imputar",
        "meaning": "Completar una ausencia con una estimación."
      },
      {
        "term": "Mediana",
        "meaning": "Valor central al ordenar los registros."
      },
      {
        "term": "Entrenamiento",
        "meaning": "Datos con los que aprendemos preparación y modelo."
      }
    ],
    "lab": {
      "title": "Una ausencia conserva su significado",
      "objective": "Construir: tabla preparada y regla de limpieza.",
      "instruction": "En el explorador de lluvia, cambia A de 500 a 100 mm y deja C y D iguales.",
      "watch": "Lee los registros y la barra de B: su color identifica una estimación.",
      "expected": "100, 600, 700 mantiene mediana 600. B no cambia; una media sí habría cambiado.",
      "notebookGuide": "En Laboratorio ML explicado, sigue 1.2 y 1.3: identifica las ausencias y separa entrenamiento/prueba antes de aprender la preparación. Explica de dónde sale la regla que después se aplica a la prueba."
    },
    "takeaway": "Aprende la regla de preparación con entrenamiento, aplícala a los otros conjuntos y conserva la diferencia entre una medición y una estimación.",
    "next": "Con entradas preparadas, calcularemos una predicción y su error.",
    "explorer": "impute",
    "build": {
      "title": "Tabla preparada y regla de limpieza",
      "steps": [
        "Copia las filas del caso; conserva la columna original y crea otra para el valor que usará el modelo.",
        "Calcula la mediana solo con las medidas conocidas de entrenamiento, completa B y añade una marca de dato estimado. Repite cambiando A a 100.",
        "En 1.2–1.3 de Laboratorio ML, localiza la separación y la preparación. Registra qué regla se aprende en entrenamiento y cuál se reutiliza en prueba."
      ],
      "check": "La mediana sigue en 600 mm al cambiar A; B conserva su marca de estimación. No se usa la prueba para recalcular la regla.",
      "transfer": "Aplica el mismo esquema a tiempos de entrega sin registrar: conserva la ausencia original y la unidad minutos; no la conviertas en entrega inmediata.",
      "stretch": "Si ya programas: cuenta ausencias antes y después de la transformación y comprueba que los datos originales se conservan."
    }
  },
  "ml-regresion": {
    "objective": "Construir una comparación de estimaciones con errores en unidades útiles.",
    "relevance": "Estimar cosechas ayuda a planificar; necesitamos saber cuánto puede equivocarse la estimación.",
    "concept": "Regresión estima una cantidad a partir de una o varias entradas. En la recta de este ejemplo, predicción = intercepto + pendiente × fertilizante: el intercepto es el valor que daría la recta con entrada cero y la pendiente indica cuánto cambia la predicción por cada kg/ha añadido a la entrada. El error absoluto es la distancia entre observado y predicho, sin signo. El MAE es el promedio de esos errores y se expresa en t/ha.",
    "case": {
      "title": "La recta se equivoca en cada finca",
      "context": "Seis fincas con datos inventados. Entrada: fertilizante en kg/ha; respuesta: rendimiento en t/ha. La regla inicial es predicción = 1 + 0,025 × fertilizante. La tabla y el explorador usan las mismas seis fincas.",
      "columns": [
        "Finca",
        "Fertilizante (kg/ha)",
        "Observado (t/ha)",
        "Predicho (t/ha)"
      ],
      "rows": [
        [
          "A",
          "40",
          "2,20",
          "2,00"
        ],
        [
          "B",
          "60",
          "2,80",
          "2,50"
        ],
        [
          "C",
          "80",
          "3,10",
          "3,00"
        ],
        [
          "D",
          "100",
          "3,70",
          "3,50"
        ],
        [
          "E",
          "120",
          "4,20",
          "4,00"
        ],
        [
          "F",
          "140",
          "4,70",
          "4,50"
        ]
      ],
      "reasoning": [
        "Para A calculamos 1 + 0,025 × 40 = 2,00 t/ha; su distancia a 2,20 es 0,20.",
        "Los seis errores absolutos son 0,20; 0,30; 0,10; 0,20; 0,20 y 0,20. Suman 1,20 t/ha.",
        "Dividimos entre seis: MAE = 0,20 t/ha. Es un promedio, no el error idéntico de cada finca."
      ],
      "conclusion": "La recta inicial tiene un error absoluto medio de 0,20 t/ha sobre estas seis fincas. Para evaluar su uso con otras fincas se necesita una prueba reservada. La pendiente describe la recta, no una dosis de fertilizante recomendada.",
      "question": "¿Cuánto se equivoca la recta inicial en estas seis fincas y qué cambia al ajustarla?"
    },
    "vocabulary": [
      {
        "term": "Predicción",
        "meaning": "Valor calculado por una regla."
      },
      {
        "term": "Error absoluto",
        "meaning": "Distancia sin signo entre observado y predicho."
      },
      {
        "term": "MAE",
        "meaning": "Promedio de esas distancias."
      }
    ],
    "lab": {
      "title": "Ajustar y comprobar son pasos distintos",
      "objective": "Construir: tabla de predicciones y referencia.",
      "instruction": "Fija pendiente en 0,025 e intercepto en 1. Lee el MAE y pulsa «Ajustar a estos puntos».",
      "watch": "Cambian la recta y las distancias; los seis puntos permanecen fijos.",
      "expected": "El MAE pasa de 0,20 a aproximadamente 0,04 t/ha. Sigue siendo error sobre los puntos utilizados.",
      "notebookGuide": "En Regresión, sección 1, ajusta la recta. En Laboratorio ML explicado, secciones 1.4–1.6, compara referencia y regresión con las mismas 60 fincas de prueba; calcula allí sus errores. El primer cuaderno usa fertilizante; el segundo utiliza lluvia, temperatura y fertilizante."
    },
    "takeaway": "El MAE describe el tamaño medio del error en las unidades de la respuesta. Para evaluar casos nuevos, calcúlalo con datos reservados.",
    "next": "Cambiaremos la pregunta: de cuánto rendimiento a qué categoría asignar.",
    "explorer": "regression",
    "build": {
      "title": "Tabla de predicciones y referencia",
      "steps": [
        "Compara la recta inicial con la ajustada en el explorador y anota ambos MAE, indicando que usan los mismos puntos de ajuste.",
        "En 1.4–1.6 de Laboratorio ML, conserva las mismas filas reservadas para la referencia y la regresión; registra observado y ambas predicciones.",
        "Calcula los errores absolutos y su promedio. Escribe cuál usarías en un ensayo de planificación y qué margen de error observaste."
      ],
      "check": "El ajuste visual pasa de 0,20 a cerca de 0,04 t/ha. La decisión del cuaderno usa su propia prueba reservada y sus cifras, no el error del ajuste visual.",
      "transfer": "Para estimar minutos de atención por solicitud, mantén el mismo procedimiento y expresa el MAE en minutos.",
      "stretch": "Si ya programas: añade una columna de error absoluto por caso y ordena las filas para inspeccionar los errores mayores."
    }
  },
  "ml-clasificacion": {
    "objective": "Construir una lista de revisión a partir de puntuaciones y una regla explícita.",
    "relevance": "Una alerta puede priorizar plantas para revisión, sin reemplazar la comprobación de campo.",
    "concept": "Clasificación asigna una categoría definida, como «con plaga» o «sana». Para aprenderla se usan ejemplos cuya categoría ya se conoce. En este ejercicio, cada planta tiene una puntuación entre 0 y 1; damos alerta si su puntuación es mayor o igual al umbral elegido. La puntuación es un número, la alerta es una decisión y la realidad conocida permite comprobar si esa decisión acertó.",
    "case": {
      "title": "Decidir cuáles plantas revisar",
      "context": "Seis de las diez plantas inventadas del explorador. Las puntuaciones están fijadas; aquí no entrenamos un clasificador.",
      "columns": [
        "Planta",
        "Puntuación",
        "Realidad conocida",
        "Alerta con umbral 0,50"
      ],
      "rows": [
        [
          "P1",
          "0,90",
          "Con plaga",
          "Sí"
        ],
        [
          "P3",
          "0,70",
          "Con plaga",
          "Sí"
        ],
        [
          "P4",
          "0,40",
          "Con plaga",
          "No"
        ],
        [
          "P5",
          "0,75",
          "Sana",
          "Sí"
        ],
        [
          "P6",
          "0,55",
          "Sana",
          "Sí"
        ],
        [
          "P8",
          "0,20",
          "Sana",
          "No"
        ]
      ],
      "reasoning": [
        "Positivo significa «con plaga». La clase responde esa pregunta, no califica a la planta como buena o mala.",
        "Aplicamos una regla: puntuación mayor o igual a 0,50 produce alerta. Por eso P5 sí y P4 no.",
        "Contrastamos con la realidad: P5 es una falsa alerta y P4 es una plaga omitida. La regla puede equivocarse."
      ],
      "conclusion": "Una puntuación de 0,75 no significa 75 % de daño ni asegura presencia de plaga.",
      "question": "¿Qué plantas reciben alerta con umbral 0,50 y cuáles de esas decisiones se equivocan?"
    },
    "vocabulary": [
      {
        "term": "Clase",
        "meaning": "Categoría definida para responder una pregunta."
      },
      {
        "term": "Puntuación",
        "meaning": "Número que una regla convierte en decisión."
      },
      {
        "term": "Umbral",
        "meaning": "Límite elegido para activar la alerta."
      }
    ],
    "lab": {
      "title": "Dos decisiones equivocadas",
      "objective": "Construir: lista de plantas por revisar.",
      "instruction": "Deja el umbral en 0,50 y localiza P4 y P5 en el explorador completo.",
      "watch": "Realidad escrita; borde naranja significa alerta.",
      "expected": "P4: plaga sin alerta; P5: sana con alerta. El explorador contiene las diez plantas.",
      "notebookGuide": "En Clasificación e Iris, empieza por la sección 1: puntuación y umbral. Las secciones 2–4 amplían bosque, SVM y KNN con otros datos; sus porcentajes no comparan modelos sobre una misma tarea."
    },
    "takeaway": "Define la categoría positiva y la regla de alerta. Conserva puntuación, decisión y realidad en columnas separadas.",
    "next": "Contaremos esos aciertos y errores para interpretar las métricas.",
    "explorer": "threshold",
    "build": {
      "title": "Lista de plantas por revisar",
      "steps": [
        "En el explorador, fija 0,50 y copia identificador, puntuación y decisión de cada planta. Escribe la regla: alerta si puntuación ≥ umbral.",
        "Añade la realidad conocida para comprobar después la lista. Marca P4 como omisión y P5 como falsa alerta.",
        "En la sección 1 de Clasificación e Iris, aplica esa separación entre puntuación, decisión y realidad; anota qué representa la clase positiva allí."
      ],
      "check": "La lista incluye cinco alertas en las diez plantas; una puntuación no se confunde con porcentaje de daño ni con confirmación de plaga.",
      "transfer": "Para priorizar solicitudes de soporte, define qué significa urgente y usa la lista para revisión humana, con seguimiento de solicitudes omitidas.",
      "stretch": "Si ya programas: crea una columna booleana comparando cada puntuación con el umbral; verifica el caso de igualdad."
    }
  },
  "ml-metricas": {
    "objective": "Construir un reporte que muestre qué detecta y qué omite una alerta.",
    "relevance": "«Acertamos bastante» oculta si omitimos plagas o revisamos demasiadas plantas sanas.",
    "concept": "Una matriz de confusión cuenta las combinaciones de realidad y predicción. Con plaga y alerta es un verdadero positivo; sana y alerta, un falso positivo; con plaga y sin alerta, un falso negativo; sana y sin alerta, un verdadero negativo. Recall divide detecciones correctas entre plantas con plaga; precision divide detecciones correctas entre todas las alertas. Accuracy divide todos los aciertos entre todas las plantas.",
    "case": {
      "title": "Las diez plantas, sin perder ninguna",
      "context": "Las diez plantas inventadas del explorador, agrupadas por resultado con umbral 0,50. Estas filas representan todos los casos.",
      "columns": [
        "Realidad",
        "Decisión",
        "Plantas",
        "Cantidad"
      ],
      "rows": [
        [
          "Con plaga",
          "Alerta",
          "P1, P2, P3",
          "3"
        ],
        [
          "Con plaga",
          "Sin alerta",
          "P4",
          "1"
        ],
        [
          "Sana",
          "Alerta",
          "P5, P6",
          "2"
        ],
        [
          "Sana",
          "Sin alerta",
          "P7, P8, P9, P10",
          "4"
        ]
      ],
      "reasoning": [
        "Cuatro plantas tenían plaga y detectamos tres: recall = 3/4 = 75 %. La planta P4 quedó omitida.",
        "De cinco alertas, tres eran correctas: precision = 3/5 = 60 %. Dos serían falsas alertas.",
        "Acertamos tres positivos y cuatro negativos: accuracy = (3 + 4)/10 = 70 %. Cada métrica responde otra pregunta."
      ],
      "conclusion": "70 % de aciertos no significa detectar 70 % de plagas: aquí detectamos 75 %.",
      "question": "¿Cuántas plagas detectamos, cuántas alertas son correctas y cuántas decisiones totales acertamos?"
    },
    "vocabulary": [
      {
        "term": "Recall",
        "meaning": "Proporción de positivos reales que detectamos."
      },
      {
        "term": "Precision",
        "meaning": "Proporción de alertas que eran correctas."
      },
      {
        "term": "Accuracy",
        "meaning": "Proporción de casos totales acertados."
      }
    ],
    "lab": {
      "title": "Leer una casilla antes del porcentaje",
      "objective": "Construir: reporte de calidad de las alertas.",
      "instruction": "Con umbral 0,50, cruza fila «Con plaga» con columna «Sin plaga».",
      "watch": "Fila: realidad; columna: predicción. Esa casilla cuenta omisiones.",
      "expected": "Con umbral 0,50: TP = 3, FP = 2, FN = 1 y TN = 4. Recall = 3/4 = 75 %; precision = 3/5 = 60 %; accuracy = (3+4)/10 = 70 %.",
      "notebookGuide": "En Laboratorio ML explicado, abre la sección 2 y reconstruye los cuatro conteos de las diez plantas antes de leer los porcentajes. Identifica el denominador de cada métrica."
    },
    "takeaway": "Escribe el numerador y el denominador de cada métrica: detectar plagas, acertar alertas y acertar decisiones son preguntas diferentes.",
    "next": "Mover el umbral cambiará esos conteos sin cambiar las plantas.",
    "explorer": "threshold",
    "build": {
      "title": "Reporte de calidad de las alertas",
      "steps": [
        "Con umbral 0,50, clasifica las diez plantas en detección correcta, falsa alerta, omisión y descarte correcto.",
        "Calcula recall, precision y accuracy escribiendo numerador y denominador. Reproduce los conteos de la sección 2 de Laboratorio ML.",
        "Redacta una decisión operativa: qué error conviene investigar primero y qué casos concretos revisarías."
      ],
      "check": "TP (detecciones correctas) = 3; FP (falsas alertas) = 2; FN (omisiones) = 1; TN (descartes correctos) = 4. Suman diez. Recall = 3/4, precision = 3/5 y accuracy = 7/10.",
      "transfer": "En detección de solicitudes urgentes, una omisión retrasa atención y una falsa alerta consume capacidad: reporta ambos efectos.",
      "stretch": "Si ya programas: calcula las proporciones desde los conteos y contempla un denominador cero sin inventar un porcentaje."
    }
  },
  "ml-umbral": {
    "objective": "Configurar una política de alertas según la capacidad de revisión.",
    "relevance": "Un equipo con pocas personas para revisar debe decidir cuánto riesgo de omisión aceptar.",
    "concept": "Un umbral es el límite que transforma una puntuación en una decisión. Aquí damos alerta cuando puntuación ≥ umbral. Al subirlo, la lista de alertas puede reducirse; al bajarlo, puede ampliarse. Las puntuaciones permanecen iguales: cambian las decisiones y sus errores. Para elegir el límite se comparan consecuencias y capacidad de revisión con datos de validación; la prueba final se conserva para evaluar la regla elegida.",
    "case": {
      "title": "Cuatro decisiones cambian de regla",
      "context": "Cuatro plantas inventadas del explorador. Cambiamos el umbral conservando puntuaciones y realidades; no generamos otro modelo.",
      "columns": [
        "Planta y realidad",
        "Puntuación",
        "Alerta a 0,50",
        "Alerta a 0,70"
      ],
      "rows": [
        [
          "P3: con plaga",
          "0,70",
          "Sí",
          "Sí"
        ],
        [
          "P4: con plaga",
          "0,40",
          "No",
          "No"
        ],
        [
          "P5: sana",
          "0,75",
          "Sí",
          "Sí"
        ],
        [
          "P6: sana",
          "0,55",
          "Sí",
          "No"
        ]
      ],
      "reasoning": [
        "La regla usa mayor o igual: P3 conserva su alerta cuando puntuación y umbral valen 0,70.",
        "P6 pierde la alerta al subir a 0,70: evitamos esa falsa alerta. P5 sigue por encima del nuevo límite.",
        "P4 continúa omitida. Subir el límite no resuelve toda equivocación; bajar a 0,40 sí activaría su alerta."
      ],
      "conclusion": "El umbral decide qué revisar. Elegirlo requiere conocer consecuencias y usar validación, dejando intacta la prueba final.",
      "question": "¿Qué regla permite revisar como máximo cuatro plantas y qué plagas quedan sin alerta?"
    },
    "vocabulary": [
      {
        "term": "Omisión",
        "meaning": "Positivo real que no recibe alerta."
      },
      {
        "term": "Validación",
        "meaning": "Datos para elegir reglas durante el desarrollo."
      }
    ],
    "lab": {
      "title": "Guardar las puntuaciones, cambiar decisiones",
      "objective": "Construir: política para un equipo de cuatro revisiones.",
      "instruction": "En las diez plantas, mueve el umbral de 0,50 a 0,70 y después a 0,30.",
      "watch": "Cuenta bordes y omisiones; las puntuaciones escritas permanecen iguales.",
      "expected": "A umbral 0,70: 4 alertas, 1 falsa alerta y 1 omisión. A 0,30: 7 alertas, 3 falsas alertas y 0 omisiones. Las diez puntuaciones permanecen iguales.",
      "notebookGuide": "En la sección 2 de Laboratorio ML explicado, cambia el umbral conservando puntuaciones y realidades. Comprueba qué conteos cambian y qué error tendría más consecuencias en el uso propuesto."
    },
    "takeaway": "Elige la regla considerando revisiones necesarias, falsas alertas y omisiones; indica qué harás con los casos que no entren en la revisión.",
    "next": "Después buscaremos grupos cuando no tenemos categorías conocidas.",
    "explorer": "threshold",
    "build": {
      "title": "Política para un equipo de cuatro revisiones",
      "steps": [
        "Supón que solo puedes revisar cuatro plantas en esta ronda. Compara umbrales 0,30, 0,50 y 0,70 conservando puntuaciones.",
        "Registra para cada umbral cuántas alertas, falsas alertas y omisiones produce. Selecciona una regla compatible con la capacidad y describe el riesgo restante.",
        "En la sección 2 del cuaderno, reproduce la tabla de comparación y escribe qué harás con las plantas sin revisar. Para elegir una regla de uso real, emplea validación y conserva aparte la prueba final."
      ],
      "check": "A 0,70 hay cuatro alertas y una omisión; cabe en la capacidad propuesta, pero no resuelve todo el riesgo. La política indica qué hacer con los casos sin revisar.",
      "transfer": "En una mesa de ayuda, cambia plantas por solicitudes y fija capacidad por turno antes de elegir una regla de prioridad.",
      "stretch": "Si ya programas: genera una tabla de varios umbrales, calcula revisiones y omisiones y filtra los compatibles con una capacidad dada."
    }
  },
  "ml-clustering": {
    "objective": "Construir una segmentación exploratoria para organizar una revisión.",
    "relevance": "Explorar lotes parecidos orienta una investigación cuando no existen etiquetas de grupo.",
    "concept": "Clustering o agrupación busca registros parecidos sin recibir etiquetas de grupo. La cercanía se calcula con las variables elegidas y depende de su escala. DBSCAN usa un radio de vecindad y un mínimo de puntos: los puntos con suficientes vecinos forman núcleos que conectan grupos; otros pueden unirse como borde o quedar sin grupo. El mínimo cuenta también al propio punto.",
    "case": {
      "title": "Cercanía antes de poner nombres",
      "context": "Seis lotes con dos indicadores inventados, X e Y, medidos en una misma escala de puntos. La distancia se calcula en ese plano; los números no representan porcentajes ni medidas agronómicas. El caso tiene seis puntos; el laboratorio amplía la comparación a 29.",
      "columns": [
        "Lote",
        "Índice X",
        "Índice Y"
      ],
      "rows": [
        [
          "A",
          "20",
          "20"
        ],
        [
          "B",
          "22",
          "20"
        ],
        [
          "C",
          "20",
          "22"
        ],
        [
          "D",
          "70",
          "60"
        ],
        [
          "E",
          "72",
          "60"
        ],
        [
          "F",
          "5",
          "90"
        ]
      ],
      "reasoning": [
        "Usamos radio 3 y mínimo dos puntos, contando el propio. A y B distan 2; D y E también.",
        "A, B y C quedan conectados; D y E forman otro grupo. F no tiene vecinos cercanos.",
        "Obtenemos dos grupos y F sin agrupar. Sus nombres numéricos son identificadores, no calificaciones de calidad."
      ],
      "conclusion": "F merece investigación; la configuración no demuestra un sensor averiado ni autoriza eliminar su registro.",
      "question": "¿Qué lotes quedan conectados con radio 3 y mínimo dos puntos, y cuál queda aislado?"
    },
    "vocabulary": [
      {
        "term": "Radio",
        "meaning": "Distancia máxima para considerar dos puntos vecinos."
      },
      {
        "term": "Núcleo",
        "meaning": "Punto que alcanza el mínimo requerido de vecinos dentro del radio, contándose a sí mismo."
      },
      {
        "term": "Sin grupo",
        "meaning": "Punto que no queda conectado a un grupo con esa configuración."
      }
    ],
    "lab": {
      "title": "La configuración también cambia el resultado",
      "objective": "Construir: mapa de grupos y casos por investigar.",
      "instruction": "En los 29 puntos, deja mínimo 4 y compara radio 10 con radio 3.",
      "watch": "Los puntos conservan posición; cambian colores y cantidad sin agrupar. Gris significa sin grupo.",
      "expected": "Radio 10: dos grupos y tres sin grupo. Radio 3: ningún grupo y 29 sin grupo.",
      "notebookGuide": "En Laboratorio ML explicado, la sección 4 desarrolla DBSCAN con otras observaciones. El cuaderno Agrupación añade K-Means y Mean-Shift: compara qué necesita cada método, sin interpretar los números de grupo como calidad."
    },
    "takeaway": "Un grupo significa cercanía con las variables y parámetros elegidos. Antes de darle un significado operativo, revisa qué comparten sus registros.",
    "next": "PCA resumirá variables, sin formar grupos.",
    "explorer": "clusters",
    "build": {
      "title": "Mapa de grupos y casos por investigar",
      "steps": [
        "Compara radio 10 y radio 3 con mínimo 4 en el explorador. Conserva las coordenadas y registra grupos y puntos sin asignar.",
        "En la sección 4 de Laboratorio ML, reproduce DBSCAN y crea una lista de observaciones por grupo, dejando aparte las no asignadas.",
        "Propón una revisión por grupo y otra para casos aislados. Usa nombres neutrales; confirma el significado con las variables antes de tomar acciones."
      ],
      "check": "El explorador da dos grupos y tres puntos sin asignar con radio 10; con radio 3 deja los 29 sin grupo. Ningún identificador se interpreta como calidad.",
      "transfer": "Para organizar incidencias de equipos por similitud, revisa escalas y variables antes de agrupar; un caso aislado merece inspección.",
      "stretch": "Si ya programas: prueba otra escala de las variables y compara la estabilidad de las asignaciones."
    }
  },
  "ml-pca": {
    "objective": "Construir una vista resumida de registros y documentar la información que conserva.",
    "relevance": "Resumir medidas que cambian juntas facilita una gráfica; debemos saber qué información se pierde.",
    "concept": "PCA, análisis de componentes principales, resume variables mediante nuevas direcciones llamadas componentes. Trabaja con datos centrados: a cada variable se le resta su media. La primera dirección conserva la mayor varianza, es decir, la mayor dispersión medida con distancias al cuadrado; las siguientes conservan variación restante en direcciones perpendiculares. El porcentaje conservado describe variación de las entradas, no aciertos de un modelo.",
    "case": {
      "title": "Dos medidas que se mueven juntas",
      "context": "Cuatro registros inventados con dos medidas X e Y en la misma escala. A cada medida ya se le restó su media: por eso aparecen valores negativos. Los cuatro puntos están sobre la diagonal Y = X. En el explorador se aplica el mismo procedimiento a 22 puntos.",
      "columns": [
        "Observación",
        "Índice X centrado",
        "Índice Y centrado"
      ],
      "rows": [
        [
          "A",
          "−2",
          "−2"
        ],
        [
          "B",
          "−1",
          "−1"
        ],
        [
          "C",
          "1",
          "1"
        ],
        [
          "D",
          "2",
          "2"
        ]
      ],
      "reasoning": [
        "La variación total es proporcional a la suma de cuadrados: X aporta 10 e Y aporta 10; total 20.",
        "Proyectar sobre el eje horizontal conserva solo X: 10/20 = 50 %. Se descarta la separación vertical.",
        "Proyectar sobre la diagonal de 45° deja cada punto sobre sí mismo: conserva 100 % en este caso especial."
      ],
      "conclusion": "PCA busca primero máxima varianza. Conservar 100 % aquí no mide aciertos predictivos.",
      "question": "¿Qué variación conservamos al representar estos cuatro puntos sobre el eje X o sobre su diagonal?"
    },
    "vocabulary": [
      {
        "term": "Proyección",
        "meaning": "Representar cada punto sobre una dirección."
      },
      {
        "term": "Varianza",
        "meaning": "Medida de dispersión de los datos."
      },
      {
        "term": "Componente",
        "meaning": "Nueva dirección que combina variables."
      }
    ],
    "lab": {
      "title": "Buscar una dirección que conserve dispersión",
      "objective": "Construir: vista de dos componentes.",
      "instruction": "En el explorador de 22 puntos, compara direcciones 0°, 90° y 37°.",
      "watch": "Verde: dirección; naranja: proyecciones; líneas finas: parte descartada. Los puntos originales permanecen fijos.",
      "expected": "Para los 22 puntos del explorador: 0° conserva aproximadamente 63,1 %; 90°, 36,9 %; 37°, 98,0 %. El caso resuelto usa cuatro puntos exactamente diagonales y por eso sus porcentajes son otros.",
      "notebookGuide": "En PCA, transforma las tres variables escaladas en dos componentes. Identifica qué registro representa cada punto y lee la varianza explicada de cada componente y su suma. La tabla del cuaderno muestra el porcentaje correspondiente a sus datos."
    },
    "takeaway": "Al reducir variables, informa la variación conservada y mantén la relación de cada punto con su registro original.",
    "next": "Pasaremos de combinar variables a combinar predicciones de varios modelos.",
    "explorer": "pca",
    "build": {
      "title": "Vista de dos componentes",
      "steps": [
        "Compara 0°, 90° y 37° en el explorador; registra la variación conservada con cada dirección.",
        "En el cuaderno PCA, ejecuta el paso de tres variables escaladas a dos componentes. Conserva el identificador de cada registro al dibujarlo.",
        "Añade al gráfico qué representan los puntos, la variación conservada y qué no puedes interpretar a partir de esa vista."
      ],
      "check": "Las direcciones del explorador conservan aproximadamente 63,1 %, 36,9 % y 98,0 %. La vista del cuaderno informa su propio porcentaje y mantiene correspondencia con los registros.",
      "transfer": "Usa una vista resumida para explorar muchas medidas de operación; vuelve a las variables originales antes de explicar por qué dos registros se parecen.",
      "stretch": "Si ya programas: compara la variación acumulada de uno y dos componentes después de escalar."
    }
  },
  "ml-ensambles": {
    "objective": "Seleccionar un modelo candidato mediante una comparación reproducible.",
    "relevance": "Combinar estimaciones puede compensar errores; midamos el resultado antes de confiar.",
    "concept": "Un ensamble combina predicciones de varios modelos para producir una salida. Por ejemplo, puede promediar dos estimaciones; si una queda por debajo y otra por encima, sus errores pueden compensarse. Bagging combina modelos ajustados con diferentes muestras; boosting añade modelos sucesivos para reducir la pérdida conjunta. Para saber si una combinación mejora, compara su error y el de una referencia sobre los mismos casos reservados.",
    "case": {
      "title": "Dos errores pueden compensarse",
      "context": "Tres fincas reservadas inventadas. Dos modelos imaginarios producen estas predicciones; promediarlas no usa los rendimientos conocidos para ajustarse.",
      "columns": [
        "Finca",
        "Observado (t/ha)",
        "Modelo A (t/ha)",
        "Modelo B (t/ha)",
        "Promedio (t/ha)"
      ],
      "rows": [
        [
          "1",
          "3,0",
          "2,0",
          "4,0",
          "3,0"
        ],
        [
          "2",
          "4,0",
          "5,0",
          "3,0",
          "4,0"
        ],
        [
          "3",
          "5,0",
          "5,0",
          "5,0",
          "5,0"
        ]
      ],
      "reasoning": [
        "En la finca 1 promediamos (2 + 4)/2 = 3 t/ha: una predicción baja y otra alta se compensan.",
        "Cada modelo tiene errores 1, 1 y 0: MAE = 2/3 ≈ 0,67 t/ha. El promedio tiene MAE cero.",
        "Si ambos modelos se equivocaran igual, promediar no eliminaría ese error compartido."
      ],
      "conclusion": "En estas tres fincas, el promedio predice 3, 4 y 5 t/ha y su MAE es cero. A y B se compensan aquí; si compartieran el mismo error, el promedio también lo conservaría.",
      "question": "¿Promediar A y B reduce el error en las tres fincas reservadas?"
    },
    "vocabulary": [
      {
        "term": "Ensamble",
        "meaning": "Combinación de varios modelos."
      },
      {
        "term": "Bagging",
        "meaning": "Aprender con muestras de filas con reemplazo y agregar predicciones."
      },
      {
        "term": "Boosting",
        "meaning": "Añadir modelos en secuencia para reducir la pérdida conjunta."
      }
    ],
    "lab": {
      "title": "Comparar con el mismo criterio",
      "objective": "Construir: tabla comparativa de modelos.",
      "instruction": "Ahora usa otro conjunto: las 60 fincas del gráfico. Cambia el selector de MAE a RMSE.",
      "watch": "Una barra corta significa menor error; cambiar métrica no vuelve a entrenar.",
      "expected": "Boosting tiene menor error aquí: MAE 0,301 y RMSE 0,411 t/ha. Las cuatro barras comparten prueba.",
      "notebookGuide": "En la sección 3 de Laboratorio ML explicado, localiza las mismas fincas reservadas para todos los modelos. Compara primero MAE y después explica qué error pesa más al usar RMSE."
    },
    "takeaway": "Compara modelo y combinación con la misma respuesta, los mismos casos reservados y la misma métrica.",
    "next": "Cuando los casos son semanas, también importa el orden de la prueba.",
    "explorer": "ensembles",
    "build": {
      "title": "Tabla comparativa de modelos",
      "steps": [
        "Reproduce el promedio de A y B del caso resuelto y calcula sus errores con las mismas tres fincas.",
        "En el explorador y la sección 3 de Laboratorio ML, compara referencia, árbol, bosque y boosting sobre su misma prueba. Registra MAE y RMSE con unidades.",
        "Elige un candidato para seguir probando y justifica la elección con error y necesidades de uso. Conserva la referencia en la tabla."
      ],
      "check": "En el explorador, boosting tiene el menor error entre los cuatro modelos: MAE 0,301 y RMSE 0,411 t/ha. Registra los resultados de tu ejecución del cuaderno y compáralos sobre sus mismas fincas de prueba.",
      "transfer": "Al comparar estimadores de duración de tareas, usa las mismas tareas reservadas y una referencia sencilla.",
      "stretch": "Si ya programas: repite la evaluación con otras particiones de entrenamiento sin reutilizar la prueba final para elegir ajustes."
    }
  },
  "ml-series": {
    "objective": "Construir un pronóstico para planear compras y comprobarlo respetando el tiempo.",
    "relevance": "Planear compras exige anticipar ventas usando solo información disponible al decidir.",
    "concept": "Una serie temporal es una lista de observaciones con fecha, como ventas por semana. Pronosticar consiste en estimar valores de fechas posteriores usando solo lo conocido al emitir el pronóstico. Para evaluar con datos históricos, fijamos una fecha de corte, ajustamos con el pasado y reservamos las fechas posteriores para comparar predicción y observado. El horizonte indica cuántos periodos hacia adelante se pronostican.",
    "case": {
      "title": "Pronosticar dos semanas antes de verlas",
      "context": "Seis semanas con ventas inventadas en unidades de producto. Las semanas 1–4 son historia disponible; ocultamos 5–6 hasta comprobar los pronósticos. El caso usa un ciclo de dos semanas; el explorador compara reglas con 84 semanas y un ciclo de doce.",
      "columns": [
        "Semana",
        "Ventas (unidades)",
        "Uso"
      ],
      "rows": [
        [
          "1",
          "100",
          "Conocida"
        ],
        [
          "2",
          "110",
          "Conocida"
        ],
        [
          "3",
          "100",
          "Conocida"
        ],
        [
          "4",
          "110",
          "Conocida"
        ],
        [
          "5",
          "100",
          "Reservada"
        ],
        [
          "6",
          "110",
          "Reservada"
        ]
      ],
      "reasoning": [
        "Al cerrar la semana 4, la regla «último valor» pronostica 110 y 110 para las semanas 5 y 6.",
        "Repetir las dos últimas semanas conocidas pronostica 100 y 110. Ambas reglas usan únicamente historia disponible.",
        "Revelamos la reserva: el último valor tiene MAE = (10 + 0)/2 = 5 unidades; repetir ciclo da cero."
      ],
      "conclusion": "El ciclo gana aquí; seis semanas inventadas no demuestran ese patrón en ventas reales.",
      "question": "Al cerrar la semana 4, ¿qué regla estima mejor las ventas de las semanas 5 y 6?"
    },
    "vocabulary": [
      {
        "term": "Corte",
        "meaning": "Momento que separa historia y futuro reservado."
      },
      {
        "term": "Horizonte",
        "meaning": "Cuánto adelante queremos pronosticar."
      }
    ],
    "lab": {
      "title": "Tres estrategias, el mismo futuro",
      "objective": "Construir: pronóstico con fecha de corte.",
      "instruction": "En la serie de 84 semanas, cambia «Estrategia de pronóstico»: Último valor, Repetir ciclo de 12 semanas y Tendencia.",
      "watch": "Los datos permanecen fijos. Las tres estrategias usan las primeras 60 semanas y se evalúan sobre las últimas 24.",
      "expected": "Sobre las 24 semanas reservadas del explorador: MAE de último valor ≈ 14,90; ciclo de 12 semanas ≈ 11,35; tendencia ≈ 7,65 unidades de producto.",
      "notebookGuide": "En Laboratorio ML explicado, sección 5, identifica las semanas de entrenamiento y las 24 de prueba. Genera los tres pronósticos sin usar las respuestas de prueba y compara sus MAE. Lee los resultados de esa tabla, calculados con la serie del cuaderno."
    },
    "takeaway": "Registra fecha de corte, horizonte y error. Compara las reglas sobre las mismas fechas posteriores al corte.",
    "next": "Veremos decisiones donde una acción cambia la situación siguiente.",
    "explorer": "series",
    "build": {
      "title": "Pronóstico con fecha de corte",
      "steps": [
        "Fija el cierre de la semana 60. En el explorador compara último valor, ciclo y tendencia sobre las mismas 24 semanas futuras.",
        "En la sección 5 de Laboratorio ML, conserva su corte temporal y crea una tabla de semana, observado, pronóstico y error para cada regla.",
        "Escoge una regla para el ejercicio de compras y anota fecha de emisión, horizonte, MAE y cuándo volverías a comprobarla."
      ],
      "check": "En el explorador los MAE son aproximadamente 14,90; 11,35 y 7,65 unidades. Ninguna regla recibe las ventas reservadas al generar el pronóstico.",
      "transfer": "Para prever carga de soporte por semana, conserva el orden temporal y expresa el error en cantidad de solicitudes.",
      "stretch": "Si ya programas: desplaza el corte en varias fechas históricas y compara errores por horizonte sin mezclar pasado y futuro."
    }
  },
  "ml-refuerzo": {
    "objective": "Construir y probar una secuencia de acciones con recompensas acumuladas.",
    "relevance": "Una acción afecta pasos posteriores; no basta con evaluar cada movimiento por separado.",
    "concept": "En aprendizaje por refuerzo, un agente elige una acción en un entorno, recibe una recompensa y pasa a otro estado. El estado describe la situación, como la casilla actual; la política indica qué acción elegir. El objetivo es aprender una política que obtenga mayor recompensa acumulada, considerando también las consecuencias futuras. Q-learning actualiza un valor para cada par estado–acción a partir de la experiencia.",
    "case": {
      "title": "Llegar a la meta sin tocar el pozo",
      "context": "GridWorld inventado de 5 × 5. Inicio: fila 0, columna 0. Meta: 1,4. Las coordenadas empiezan en cero.",
      "columns": [
        "Paso",
        "Acción",
        "Estado final (fila, columna)",
        "Recompensa"
      ],
      "rows": [
        [
          "1",
          "Derecha",
          "0,1",
          "−1"
        ],
        [
          "2",
          "Derecha",
          "0,2",
          "−1"
        ],
        [
          "3",
          "Derecha",
          "0,3",
          "−1"
        ],
        [
          "4",
          "Derecha",
          "0,4",
          "−1"
        ],
        [
          "5",
          "Abajo",
          "1,4: meta",
          "+10"
        ]
      ],
      "reasoning": [
        "Los cuatro movimientos iniciales cambian casilla y cuestan una unidad de recompensa cada uno.",
        "Entrar en la meta entrega +10 y termina el episodio. La suma sin descuento es −1 −1 −1 −1 +10 = 6.",
        "Una pared o borde impide avanzar, pero consume un paso y resta 1. Caer al pozo resta 10 y termina."
      ],
      "conclusion": "Esta ruta manual no demuestra aprendizaje ni una política óptima para todos los estados.",
      "question": "¿A qué estado llega cada acción de la ruta y cuánto suman sus recompensas?"
    },
    "vocabulary": [
      {
        "term": "Estado",
        "meaning": "Situación actual del agente."
      },
      {
        "term": "Recompensa",
        "meaning": "Señal numérica recibida después de actuar."
      },
      {
        "term": "Política",
        "meaning": "Regla para elegir acciones según el estado."
      }
    ],
    "lab": {
      "title": "Recorrer y contabilizar",
      "objective": "Construir: registro de recorrido y política aprendida.",
      "instruction": "Pulsa «Nuevo recorrido», cuatro veces derecha y una vez abajo.",
      "watch": "Relaciona casilla, pasos y recompensa; al terminar, los movimientos se desactivan.",
      "expected": "Meta alcanzada en cinco pasos, recompensa acumulada 6. No se entrenó Q-learning al pulsar botones.",
      "notebookGuide": "En Q-learning en GridWorld, distingue el recorrido manual de la política aprendida al actualizar valores Q. Relaciona recompensas por episodio con las decisiones de la política; no interpretes una ruta aislada como prueba de optimalidad."
    },
    "takeaway": "Registra estados, acciones y recompensas para evaluar un recorrido. Aprender una política requiere actualizarla a partir de la experiencia.",
    "next": "Cerraremos distinguiendo una demostración correcta de evidencia suficiente para utilizarla.",
    "explorer": "grid",
    "build": {
      "title": "Registro de recorrido y política aprendida",
      "steps": [
        "Desde un recorrido nuevo, ejecuta cuatro veces derecha y una abajo. Registra estado, acción y recompensa de cada paso.",
        "En Q-learning en GridWorld, ejecuta el entrenamiento y sigue un recorrido con la política aprendida. Conserva ambos registros por separado.",
        "Compara pasos, llegada a la meta y recompensa. Explica qué se decidió manualmente y qué se aprendió con actualizaciones Q."
      ],
      "check": "La ruta manual llega en cinco pasos y acumula 6. La ruta aprendida se comprueba al ejecutar; una ruta exitosa aislada no demuestra optimalidad.",
      "transfer": "Para estudiar movimientos en una bodega simulada, define estados, acciones, obstáculos y costes antes de evaluar una política.",
      "stretch": "Si ya programas: repite varios episodios con una política fija y resume llegada a meta y recompensa, además del ejemplo individual."
    }
  },
  "ml-integracion": {
    "objective": "Construir un prototipo de predicción con una decisión de uso documentada.",
    "relevance": "Antes de cambiar una operación, expliquemos la evidencia y qué falta comprobar.",
    "concept": "Un prototipo ML conecta una pregunta operativa con datos, preparación, un modelo y una salida que se pueda comprobar. La referencia es una regla sencilla con la que comparas la propuesta, por ejemplo predecir siempre la media de entrenamiento. Evalúa ambas con las mismas respuestas reservadas y la misma métrica. Usa esa comparación para decidir qué seguir probando en el contexto de la operación.",
    "case": {
      "title": "Una mejora pequeña con alcance concreto",
      "context": "Tres fincas reservadas inventadas, distintas de las anteriores. Las reglas se eligieron con otros datos; estas filas sirven para compararlas.",
      "columns": [
        "Finca",
        "Observado (t/ha)",
        "Referencia constante (t/ha)",
        "Candidata (t/ha)"
      ],
      "rows": [
        [
          "A",
          "3,0",
          "4,0",
          "3,2"
        ],
        [
          "B",
          "4,0",
          "4,0",
          "3,8"
        ],
        [
          "C",
          "5,0",
          "4,0",
          "5,1"
        ]
      ],
      "reasoning": [
        "La referencia tiene errores absolutos 1, 0 y 1: MAE = 2/3 ≈ 0,67 t/ha.",
        "La candidata tiene errores 0,2; 0,2 y 0,1: MAE = 0,5/3 ≈ 0,17 t/ha. Comparamos idénticas fincas.",
        "La candidata mejora esta prueba. Faltan datos representativos de otras condiciones y evaluar consecuencias antes de cambiar decisiones reales."
      ],
      "conclusion": "Podemos explicar esta mejora, sin afirmar una recomendación de fertilización ni beneficio económico real.",
      "question": "¿La regla candidata reduce el error frente a predecir siempre 4 t/ha en estas tres fincas?"
    },
    "vocabulary": [
      {
        "term": "Referencia",
        "meaning": "Regla sencilla con la cual comparar."
      },
      {
        "term": "Generalización",
        "meaning": "Desempeño en casos nuevos del contexto de uso."
      }
    ],
    "lab": {
      "title": "Reconstruir la evidencia de la comparación",
      "objective": "Construir: prototipo ML: de la tabla a una decisión.",
      "instruction": "Para cada regla, suma las distancias al observado y divide entre tres. Explica qué afirmación respalda la comparación y cuál no; después localiza la evaluación reservada en Laboratorio ML.",
      "watch": "Ambas reglas usan las mismas fincas. En el cuaderno, identifica qué datos se reservaron y dónde se calculan sus errores.",
      "expected": "Referencia: 2/3 ≈ 0,67 t/ha; candidata: 0,5/3 ≈ 0,17 t/ha. Respalda una mejora en esta prueba inventada, sin demostrar beneficio real ni causalidad.",
      "notebookGuide": "En Laboratorio ML explicado, vuelve a 1.4–1.6: referencia, candidata y prueba reservada. Explica qué respalda la comparación y qué evidencia faltaría antes de usarla en una cooperativa real."
    },
    "takeaway": "Reúne pregunta, datos, referencia, error y decisión de uso en un resultado que puedas volver a ejecutar.",
    "next": "En Deep Learning conservaremos este recorrido, con más capas y parámetros.",
    "explorer": null,
    "build": {
      "title": "Prototipo ML: de la tabla a una decisión",
      "steps": [
        "En tu copia de Laboratorio ML, completa preparación, referencia, candidata y evaluación de 1.1–1.6. Conserva las mismas filas de prueba.",
        "Reúne una salida con identificador, predicción, observado y error; añade MAE de referencia y candidata y las unidades.",
        "Escribe cómo usarías esa salida para planear transporte, cuándo pedirías revisión y qué datos faltan para probarla en otro periodo."
      ],
      "check": "El caso pequeño permite verificar 0,67 frente a 0,17 t/ha; tu prototipo documenta sus propios errores y se puede volver a ejecutar desde su copia.",
      "transfer": "Cambia la tarea a estimar duración de solicitudes: redefine fila, entradas y respuesta antes de reutilizar el flujo.",
      "stretch": "Si ya programas: encapsula preparación y modelo en un pipeline y comprueba una nueva fila con el mismo esquema."
    }
  },
  "dl-redes": {
    "objective": "Construir el cálculo de una neurona y rastrear cómo sus entradas producen una salida.",
    "concept": "Deep Learning o aprendizaje profundo utiliza redes neuronales con varias capas de transformaciones. Una neurona básica multiplica cada entrada por un peso, suma los productos y un sesgo, y aplica una función de activación. Las capas conectan estas operaciones para construir representaciones intermedias y una salida. Entrenar ajusta los pesos y otros parámetros; calcular una salida con parámetros fijados es un paso diferente.",
    "relevance": "Permite explicar el cálculo antes de confiar en una etiqueta o una puntuación.",
    "case": {
      "title": "Dos señales y un ajuste",
      "context": "Comprobamos una neurona con números fijados: entradas x₁ = 2 y x₂ = 1; pesos w₁ = 0,5 y w₂ = −1; sesgo b = 0,5. Son valores sin unidades físicas y la activación es ReLU. Para esta cuenta los parámetros ya están dados: no los entrenamos.",
      "columns": [
        "Parte",
        "Entrada",
        "Peso",
        "Contribución"
      ],
      "rows": [
        [
          "Señal 1",
          "2",
          "0,5",
          "1"
        ],
        [
          "Señal 2",
          "1",
          "−1",
          "−1"
        ],
        [
          "Sesgo añadido",
          "—",
          "—",
          "0,5"
        ]
      ],
      "reasoning": [
        "Multiplica las entradas: 2 × 0,5 = 1 y 1 × (−1) = −1.",
        "Suma los aportes y el sesgo: z = 1 − 1 + 0,5 = 0,5.",
        "ReLU conserva las sumas positivas: la salida es 0,5. Si el sesgo pasa a −0,5, z = −0,5 y la salida es 0."
      ],
      "conclusion": "Una sola entrada o un sesgo pueden cambiar la salida sin que haya ocurrido aprendizaje.",
      "question": "¿Cómo producen las entradas 2 y 1 una salida de 0,5 con los pesos y el sesgo indicados?"
    },
    "vocabulary": [
      {
        "term": "Peso",
        "meaning": "Número que multiplica una entrada."
      },
      {
        "term": "Sesgo",
        "meaning": "Ajuste añadido a la suma."
      },
      {
        "term": "Activación",
        "meaning": "Regla aplicada a esa suma."
      }
    ],
    "explorer": "neuron",
    "takeaway": "Sigue entradas → productos por pesos → suma con sesgo → activación. Ese recorrido permite comprobar una neurona antes de interpretar una red.",
    "next": "Compararemos activaciones para la misma señal.",
    "lab": {
      "title": "Cambiar una pieza y seguir el cálculo",
      "objective": "Construir: calculadora de una neurona.",
      "instruction": "Pulsa Restablecer ejemplo. Conserva las entradas y pesos; cambia Sesgo b de 0,5 a −0,5.",
      "watch": "Sigue los productos, la suma z y la salida ReLU.",
      "expected": "Los productos siguen en 1 y −1; z pasa de 0,5 a −0,5 y ReLU de 0,5 a 0.",
      "notebookGuide": "En el bloque 09 de Laboratorio DL ilustrado, separa la neurona con parámetros fijados de la red cuyos parámetros se entrenan. El cuaderno usa otras entradas y activación: sigue productos, suma y transformación."
    },
    "build": {
      "title": "Calculadora de una neurona",
      "steps": [
        "Registra las entradas 2 y 1, pesos 0,5 y −1 y sesgo 0,5. Construye una fila por producto y calcula suma y ReLU.",
        "Cambia solo el sesgo a −0,5; conserva ambas cuentas y comprueba el resultado en el explorador.",
        "En el bloque 09 de Laboratorio DL, localiza la operación equivalente y distingue parámetros fijados de parámetros entrenados."
      ],
      "check": "La primera cuenta da suma 0,5 y salida 0,5; la segunda da suma −0,5 y salida 0. Cada número puede rastrearse hasta su entrada.",
      "transfer": "Esta cuenta permite inspeccionar una pequeña red antes de interpretar una salida de priorización; los pesos del ejemplo no definen una política real.",
      "stretch": "Si ya programas: escribe una función que reciba entradas, pesos y sesgo y comprueba ambos casos."
    }
  },
  "dl-activaciones": {
    "objective": "Configurar una transformación de señales y comprobar su rango de salida.",
    "concept": "Una función de activación transforma el resultado de una suma en una neurona. ReLU devuelve cero si la entrada es negativa y conserva los valores no negativos; sigmoid devuelve valores entre 0 y 1; tanh, entre −1 y 1. Estas funciones añaden transformaciones no lineales, que permiten a una red representar relaciones más complejas que una sola recta. El significado de la salida depende de la tarea y de dónde se use la función.",
    "relevance": "Ayuda a evitar que un cero, un negativo o un valor entre cero y uno se confundan con una categoría o un acierto.",
    "case": {
      "title": "La misma señal sigue tres reglas",
      "context": "Aplicamos ReLU, sigmoid y tanh a cuatro números de entrada. Cada fila conserva la misma entrada para comparar las tres funciones; las columnas contienen sus salidas, redondeadas a tres decimales.",
      "columns": [
        "Entrada",
        "ReLU",
        "Sigmoid, aprox.",
        "tanh, aprox."
      ],
      "rows": [
        [
          "−2",
          "0",
          "0,119",
          "−0,964"
        ],
        [
          "0",
          "0",
          "0,500",
          "0"
        ],
        [
          "0,5",
          "0,5",
          "0,622",
          "0,462"
        ],
        [
          "2",
          "2",
          "0,881",
          "0,964"
        ]
      ],
      "reasoning": [
        "En la fila −2, ReLU compara con cero y conserva el mayor: devuelve 0.",
        "Sigmoid comprime esa entrada a 0,119; tanh conserva el signo y devuelve aproximadamente −0,964.",
        "En la fila 2, ReLU devuelve 2. Una salida superior a 1 confirma que no todas las activaciones expresan probabilidades."
      ],
      "conclusion": "Cambiar la función cambia el rango y la respuesta, aunque la entrada sea idéntica.",
      "question": "¿Qué salida produce cada activación al recibir exactamente la misma señal?"
    },
    "vocabulary": [
      {
        "term": "Activación",
        "meaning": "Función aplicada a la señal de una neurona."
      },
      {
        "term": "No lineal",
        "meaning": "Transformación que no puede representarse mediante una sola recta en todo su dominio."
      },
      {
        "term": "Rango de salida",
        "meaning": "Conjunto de valores que puede devolver una función."
      }
    ],
    "explorer": "activation",
    "takeaway": "Compara activaciones manteniendo la entrada fija. Verifica su rango antes de interpretar la salida como puntuación o conectarla a otra operación.",
    "next": "Veremos cómo se ajustan parámetros utilizando el error.",
    "lab": {
      "title": "Contrastar una fila",
      "objective": "Construir: tabla de pruebas de activación.",
      "instruction": "Fija Señal de entrada en −2 y cambia Función entre ReLU, Sigmoid y tanh.",
      "watch": "Compara el número de salida con la fila correspondiente; después repite con 2.",
      "expected": "Obtienes valores redondeados de la tabla. Mover los controles no entrena una función.",
      "notebookGuide": "En el bloque 09, localiza la activación dentro del modelo y explica qué señal transforma. Distingue esa operación de la pérdida de entrenamiento y de la métrica calculada con datos reservados."
    },
    "build": {
      "title": "Tabla de pruebas de activación",
      "steps": [
        "Construye una tabla para entradas −2, 0 y 2 con ReLU, sigmoid y tanh. Obtén las salidas con el explorador.",
        "Anota el rango de cada función y decide cuál admite negativos, cuál descarta señales negativas y cuál queda entre 0 y 1.",
        "En el bloque 09, localiza la activación del modelo y registra qué transforma. Mantén separadas activación, pérdida y métrica."
      ],
      "check": "Para −2, las salidas son 0, aproximadamente 0,119 y −0,964. Para 2, ReLU devuelve 2: no es un porcentaje.",
      "transfer": "Antes de conectar una salida a una regla de alerta, comprueba su significado y rango; estar entre 0 y 1 no demuestra calibración.",
      "stretch": "Si ya programas: grafica las tres funciones con el mismo conjunto de entradas y comprueba límites y signos."
    }
  },
  "dl-entrenamiento": {
    "objective": "Ajustar un parámetro y diagnosticar un paso que empeora el resultado.",
    "concept": "La pérdida es un número que mide el desacuerdo entre la salida y la respuesta esperada. El gradiente indica cómo cambia esa pérdida al variar los parámetros. En descenso por gradiente actualizamos cada parámetro restando tasa de aprendizaje × gradiente; una tasa mayor produce un cambio mayor para el mismo gradiente. En una red, retropropagación calcula los gradientes y el optimizador actualiza los parámetros.",
    "relevance": "Ayuda a interpretar una curva de entrenamiento: ajustar más fuerte puede empeorar.",
    "case": {
      "title": "Acercarse a un objetivo sin pasarse",
      "context": "Partimos de −2 y buscamos 3. La pérdida (parámetro − 3)² empieza en 25. Cada fila comienza otra vez en −2 y realiza un solo paso; no son pasos consecutivos.",
      "columns": [
        "Escenario",
        "Tasa de aprendizaje",
        "Parámetro después",
        "Pérdida"
      ],
      "rows": [
        [
          "Inicio",
          "Sin paso",
          "−2",
          "25"
        ],
        [
          "Pequeño",
          "0,1",
          "−1",
          "16"
        ],
        [
          "Exacto en este ejemplo",
          "0,5",
          "3",
          "0"
        ],
        [
          "Excesivo",
          "1,1",
          "9",
          "36"
        ]
      ],
      "reasoning": [
        "En −2, la pendiente de la pérdida es 2 × (−2 − 3) = −10.",
        "Con tasa 0,1: parámetro nuevo = −2 − 0,1 × (−10) = −1. La pérdida nueva es (−1 − 3)² = 16.",
        "Con tasa 1,1: parámetro nuevo = −2 − 1,1 × (−10) = 9. La pérdida es (9 − 3)² = 36, mayor que las 25 iniciales."
      ],
      "conclusion": "Desde el mismo inicio, tasa 0,1 reduce la pérdida de 25 a 16 y tasa 1,1 la aumenta a 36. El segundo paso sobrepasa el objetivo.",
      "question": "¿Qué tasa reduce la pérdida desde el mismo inicio y cuál sobrepasa el objetivo?"
    },
    "vocabulary": [
      {
        "term": "Pérdida",
        "meaning": "Medida que buscamos reducir durante el ajuste."
      },
      {
        "term": "Gradiente",
        "meaning": "Indica cómo cambia la pérdida al variar parámetros."
      }
    ],
    "explorer": "training",
    "takeaway": "Comprueba parámetro anterior, gradiente, tasa, parámetro nuevo y pérdida. Evalúa por separado el funcionamiento con casos reservados.",
    "next": "Pasaremos a preguntas sobre imágenes.",
    "lab": {
      "title": "Comparar pasos desde el mismo inicio",
      "objective": "Construir: registro de ajustes y pérdidas.",
      "instruction": "Fija Tasa de aprendizaje en 0,10 y pulsa Dar un paso. Reinicia; fija 1,10 y repite.",
      "watch": "Lee el parámetro antes y después, el gradiente y la pérdida; contrástalos con la curva.",
      "expected": "Con 0,1: gradiente −10, parámetro −1, pérdida 16. Con 1,1: parámetro 9 y pérdida 36.",
      "notebookGuide": "En el bloque 09, sigue pérdida, cálculo de gradientes y actualización de parámetros. Relaciona esos pasos con la cuenta de esta página; después distingue bajar la pérdida de funcionar bien con casos nuevos."
    },
    "build": {
      "title": "Registro de ajustes y pérdidas",
      "steps": [
        "Reinicia y realiza un paso con tasa 0,10; guarda parámetro anterior, gradiente, tasa, parámetro nuevo y pérdida.",
        "Reinicia desde el mismo punto y repite con 1,10. Compara las dos filas antes de elegir cómo continuar.",
        "En el bloque 09, ejecuta el entrenamiento y registra la pérdida. Comprueba el resultado en casos reservados antes de usar la red."
      ],
      "check": "Con 0,10 el parámetro queda en −1 y la pérdida en 16; con 1,10 queda en 9 y 36. Reiniciar permite una comparación desde el mismo estado.",
      "transfer": "Al ajustar una red para clasificar registros, usa la evolución de pérdida para detectar problemas y la prueba reservada para evaluar el uso.",
      "stretch": "Si ya programas: compara dos tasas con igual inicialización y número de pasos, conservando curvas y evaluación reservada."
    }
  },
  "dl-vision": {
    "objective": "Definir la salida visual que necesita una operación y probar una detección.",
    "concept": "En clasificación de imágenes, la salida es una etiqueta para la imagen o un recorte. En detección, cada objeto propuesto tiene una categoría y una caja que indica su ubicación. En segmentación, una máscara indica los píxeles asignados a una categoría o a un objeto concreto. Para elegir la tarea, define si necesitas seleccionar imágenes, localizar objetos o delimitar sus regiones visibles.",
    "relevance": "Evita pedir posiciones o contornos a una herramienta que solamente clasifica.",
    "case": {
      "title": "Una foto de tres frutos, tres necesidades",
      "context": "Una escena dibujada contiene tres frutos. Un equipo quiere seleccionar fotos, localizar objetos o delimitar regiones visibles. Conservamos la escena y cambiamos la pregunta; las salidas son ilustrativas.",
      "columns": [
        "Pregunta del equipo",
        "Salida necesaria",
        "Uso posible"
      ],
      "rows": [
        [
          "¿Esta escena contiene frutos?",
          "Una etiqueta para la escena",
          "Seleccionar fotos"
        ],
        [
          "¿Dónde está cada fruto?",
          "Tres cajas de ubicación",
          "Revisar posiciones"
        ],
        [
          "¿Qué región visible ocupa cada uno?",
          "Tres máscaras",
          "Examinar contornos"
        ]
      ],
      "reasoning": [
        "Para seleccionar la foto basta una etiqueta global; esa etiqueta no cuenta ni localiza cada objeto.",
        "Para ubicar los tres frutos necesitamos cajas. Cada caja también contiene algo de fondo.",
        "Para delimitar la región visible necesitamos máscaras, que distinguen píxeles del objeto y del entorno."
      ],
      "conclusion": "La salida que necesita el trabajo define la tarea; las tres no son intercambiables.",
      "question": "¿Qué salida necesitas para seleccionar una foto, localizar sus tres frutos o delimitar sus contornos?"
    },
    "vocabulary": [
      {
        "term": "Caja",
        "meaning": "Rectángulo que aproxima la ubicación de un objeto."
      },
      {
        "term": "Máscara",
        "meaning": "Píxeles asignados a un objeto o categoría."
      }
    ],
    "explorer": "vision",
    "takeaway": "Pide una salida acorde con el trabajo: etiqueta para clasificar, cajas para localizar y máscaras para delimitar píxeles.",
    "next": "Examinaremos una operación que ayuda a construir representaciones de píxeles.",
    "lab": {
      "title": "Cambiar la pregunta",
      "objective": "Construir: especificación de una tarea visual.",
      "instruction": "En «Una escena, tres tipos de salida», cambia Pregunta entre Clasificación, Detección y Segmentación.",
      "watch": "Observa qué información aparece sobre los mismos frutos.",
      "expected": "Ves una etiqueta global, tres cajas o tres regiones coloreadas. El dibujo no ejecuta un modelo.",
      "notebookGuide": "En YOLO, sigue las secciones 4–6: mira primero la foto, ejecuta la detección y relaciona una caja con su fila. Aquí el cuaderno realiza detección; no ejecuta segmentación de los frutos dibujados."
    },
    "build": {
      "title": "Especificación de una tarea visual",
      "steps": [
        "Elige una necesidad: seleccionar fotos, localizar objetos o delimitar contornos. Escribe la salida que debe producir y un ejemplo de cómo se usaría.",
        "Contrasta etiqueta, cajas y máscaras en la misma escena del explorador; señala qué información necesita tu operación.",
        "En las secciones 4–6 de YOLO, ejecuta la detección sobre la foto del cuaderno y relaciona una caja con su fila de resultados."
      ],
      "check": "La especificación pide etiqueta, caja o máscara según el uso. La ejecución del cuaderno produce detecciones; no se le atribuyen las máscaras del dibujo.",
      "transfer": "Para contar equipos visibles necesitas localizarlos y definir cómo tratar duplicados u objetos ocultos; una etiqueta global no basta.",
      "stretch": "Si ya programas: separa en la salida identificador de imagen, clase, puntuación y coordenadas antes de calcular un conteo."
    }
  },
  "dl-cnn": {
    "objective": "Construir un mapa de filtro y distinguir cambios de imagen de cambios de pesos.",
    "concept": "Una CNN es una red neuronal convolucional que procesa regiones locales, como ventanas de píxeles de una imagen. Un filtro es una tabla pequeña de pesos: multiplicamos cada píxel de una ventana por su peso y sumamos los productos. Al desplazar el filtro construimos un mapa de respuestas. En el entrenamiento de una CNN se ajustan los pesos de sus filtros; en este ejemplo los fijamos para comprobar la operación.",
    "relevance": "Ayuda a distinguir píxeles, pesos y resultados, antes de interpretar lo que reconoce una red.",
    "case": {
      "title": "Encontrar un cambio entre filas",
      "context": "La imagen inventada tiene 5 × 5 píxeles: dos filas de ceros y tres de unos (0 oscuro; 1 claro). La primera ventana de 3 × 3 contiene las filas de esta tabla. Usamos un filtro fijo para detectar el cambio.",
      "columns": [
        "Fila de píxeles",
        "Pesos correspondientes",
        "Suma de productos"
      ],
      "rows": [
        [
          "0, 0, 0",
          "−1, −1, −1",
          "0"
        ],
        [
          "0, 0, 0",
          "0, 0, 0",
          "0"
        ],
        [
          "1, 1, 1",
          "1, 1, 1",
          "3"
        ]
      ],
      "reasoning": [
        "Coloca el filtro sobre la primera ventana de 3 × 3. Multiplica cada píxel por el peso de la misma posición, sin invertir el filtro, como en una capa CNN.",
        "Suma los nueve productos: 0 + 0 + 3 = 3. Esa es una celda del mapa.",
        "Al bajar la ventana a la tercera fila, todos sus píxeles son 1: −3 + 0 + 3 = 0. Una región uniforme responde diferente."
      ],
      "conclusion": "Desplazar el mismo filtro produce nueve respuestas, un mapa de 3 × 3.",
      "question": "¿Qué respuesta da el filtro al pasar de una zona oscura a una clara y a una zona uniforme?"
    },
    "vocabulary": [
      {
        "term": "Ventana",
        "meaning": "Región de píxeles que participa en un cálculo."
      },
      {
        "term": "Filtro",
        "meaning": "Pesos que se aplican en cada posición."
      }
    ],
    "explorer": "convolution",
    "takeaway": "Cada celda del mapa sale de una ventana, los mismos pesos y una suma de productos. Un filtro fijo permite verificar esa operación.",
    "next": "Veremos cómo reutilizar filtros y otros parámetros aprendidos previamente.",
    "lab": {
      "title": "Relacionar ventana y mapa",
      "objective": "Construir: mapa de respuestas locales.",
      "instruction": "En Filtro selecciona horizontal y compara Fila de la ventana 1 y 3. Vuelve a fila 1 y selecciona promedio.",
      "watch": "Relaciona ventana, productos y celda del mapa; conserva Columna de la ventana en 1.",
      "expected": "Horizontal devuelve 3 y 0; promedio en la primera ventana devuelve 1/3 ≈ 0,333.",
      "notebookGuide": "En el bloque 10 de Laboratorio DL ilustrado, compara el filtro fijo con los filtros de la CNN entrenada. El cuaderno usa un dígito de 8×8 y un filtro de otra orientación; sigue la misma operación sin esperar mapas idénticos."
    },
    "build": {
      "title": "Mapa de respuestas locales",
      "steps": [
        "Usa la imagen 5 × 5 del caso. Calcula los productos de la primera ventana con el filtro horizontal y registra su suma.",
        "Desplaza la ventana para completar el mapa 3 × 3; comprueba sus valores en el explorador. Repite la primera ventana con el filtro promedio.",
        "En el bloque 10, ejecuta el filtro sobre el dígito y distingue ese filtro fijo de los filtros aprendidos de la CNN."
      ],
      "check": "El mapa horizontal es [3,3,3], [3,3,3], [0,0,0]. El promedio de la primera ventana es 1/3. El mapa aún no es una detección de objetos.",
      "transfer": "Para inspeccionar cambios de intensidad en una imagen, usa el mapa como transformación intermedia y valida aparte la tarea final.",
      "stretch": "Si ya programas: implementa el recorrido de ventanas sin padding y verifica que una entrada 5 × 5 con filtro 3 × 3 produce 3 × 3."
    }
  },
  "dl-transferencia": {
    "objective": "Probar si un modelo existente cubre una necesidad antes de adaptarlo.",
    "concept": "Un modelo preentrenado tiene parámetros ajustados previamente con otros datos. Aprendizaje por transferencia reutiliza parte de ese conocimiento para una tarea: puede conservar un extractor de características o ajustar parámetros mediante entrenamiento adicional, llamado ajuste fino. Inferencia es usar el modelo para obtener predicciones sin actualizar esos parámetros. Antes de reutilizarlo, comprueba qué entradas acepta, qué salidas produce y si sus categorías cubren tu necesidad.",
    "relevance": "Permite decidir si un modelo existente responde al problema o necesita adaptación.",
    "case": {
      "title": "Un detector de objetos no aprende café por renombrarlo",
      "context": "Una cooperativa quiere distinguir café sano de defectuoso. El detector del cuaderno produce categorías de COCO, un conjunto de imágenes de objetos comunes, como persona y bus. Sus categorías de salida no incluyen café sano o defectuoso. Comparamos tres acciones posibles.",
      "columns": [
        "Acción",
        "¿Actualiza pesos?",
        "Qué significa"
      ],
      "rows": [
        [
          "Cargar pesos y predecir una foto",
          "No",
          "Reutiliza lo aprendido"
        ],
        [
          "Cambiar bus por café en la tabla",
          "No",
          "Solo cambia un texto"
        ],
        [
          "Ajustar parámetros con café etiquetado",
          "Sí",
          "Podría adaptar el modelo; requiere evaluación"
        ]
      ],
      "reasoning": [
        "Compara la categoría que necesitas con las categorías del archivo cargado.",
        "Cambiar una etiqueta visible conserva parámetros y patrones: no enseña una categoría.",
        "Adaptar requiere ejemplos etiquetados, ajuste apropiado y evaluación reservada; el nombre del modelo no basta."
      ],
      "conclusion": "Cargar los pesos permite predecir las categorías disponibles. Para abordar café defectuoso hacen falta una tarea, datos etiquetados y una evaluación propios; cambiar el texto de una categoría mantiene el mismo detector.",
      "question": "¿Un detector con categorías persona y bus puede identificar café defectuoso solo al cambiar sus nombres?"
    },
    "vocabulary": [
      {
        "term": "Preentrenado",
        "meaning": "Con parámetros ajustados previamente con otros datos."
      },
      {
        "term": "Inferencia",
        "meaning": "Aplicar el modelo para producir una predicción."
      },
      {
        "term": "Ajuste fino",
        "meaning": "Actualizar parámetros previos con nuevos ejemplos."
      }
    ],
    "explorer": null,
    "takeaway": "Comprueba entradas y categorías del modelo. Reutilizar pesos, traducir nombres y ajustar parámetros son operaciones diferentes.",
    "next": "Examinaremos problemas donde también importa el orden de las entradas.",
    "lab": {
      "title": "Reconocer qué se está reutilizando",
      "objective": "Construir: ficha de compatibilidad del modelo.",
      "instruction": "Lee la carga de pesos y la llamada modelo.predict del cuaderno YOLO.",
      "watch": "Localiza el archivo de pesos, modelo.names y TRADUCCION.",
      "expected": "Distingues categorías aprendidas y traducción de nombres; no hay entrenamiento.",
      "notebookGuide": "En YOLO, las secciones 3 y 5 muestran carga de pesos e inferencia. En la sección 6, distingue las categorías del modelo de la traducción de nombres. Ninguno de esos pasos adapta los pesos a café defectuoso."
    },
    "build": {
      "title": "Ficha de compatibilidad del modelo",
      "steps": [
        "Define la categoría que necesitas detectar y consulta modelo.names en YOLO. Registra si está entre las categorías aprendidas.",
        "Ejecuta inferencia sobre la foto del cuaderno y conserva clase, puntuación y caja. Comprueba que TRADUCCION solo cambia nombres visibles.",
        "Completa una decisión: reutilizar si cubre la tarea o planear adaptación con ejemplos etiquetados y prueba reservada si no la cubre."
      ],
      "check": "La ficha distingue pesos, categorías y traducción. El detector disponible no aprende café defectuoso al cambiar un nombre; este laboratorio ejecuta inferencia.",
      "transfer": "Antes de reutilizar un detector para inventario, contrasta sus categorías con los objetos que realmente necesitas registrar.",
      "stretch": "Si ya programas: añade una comprobación que rechace una categoría solicitada cuando no figura en modelo.names."
    }
  },
  "dl-secuencias": {
    "objective": "Construir un resumen de una secuencia que tenga en cuenta el orden.",
    "concept": "Una secuencia es una lista ordenada, como lecturas consecutivas de un sensor. Una regla recurrente conserva un estado: un resumen que actualiza con la entrada actual y el estado anterior. Por eso dos listas con los mismos números pueden terminar con estados diferentes si cambia su orden. En una RNN, red neuronal recurrente, la regla contiene parámetros aprendidos; LSTM es un tipo de red recurrente que regula qué información conservar o actualizar.",
    "relevance": "Un resumen de sensores o ventas puede perder información si ignora qué ocurrió primero.",
    "case": {
      "title": "Los mismos valores, dos recorridos",
      "context": "Usamos 10, 20 y 30, sin unidades físicas. Empezamos con estado 0. En cada paso calculamos mitad del estado anterior más mitad de la nueva entrada. Ambas secuencias tienen promedio 20.",
      "columns": [
        "Paso",
        "Entrada ascendente",
        "Estado",
        "Entrada descendente",
        "Estado"
      ],
      "rows": [
        [
          "1",
          "10",
          "5",
          "30",
          "15"
        ],
        [
          "2",
          "20",
          "12,5",
          "20",
          "17,5"
        ],
        [
          "3",
          "30",
          "21,25",
          "10",
          "13,75"
        ]
      ],
      "reasoning": [
        "En orden ascendente, el primer estado es 0,5 × 0 + 0,5 × 10 = 5.",
        "El segundo es 0,5 × 5 + 0,5 × 20 = 12,5; el tercero es 21,25.",
        "En orden inverso, los estados son 15, 17,5 y 13,75: los últimos valores influyen de manera diferente en este recorrido."
      ],
      "conclusion": "El promedio coincide, pero el estado final cambia porque la regla conserva parte del pasado.",
      "question": "¿Por qué 10 → 20 → 30 y 30 → 20 → 10 tienen igual promedio, pero distinto estado final?"
    },
    "vocabulary": [
      {
        "term": "Estado",
        "meaning": "Resumen numérico actualizado al recibir cada entrada."
      },
      {
        "term": "Recurrente",
        "meaning": "Usa el resultado del paso anterior."
      }
    ],
    "explorer": "sequence",
    "takeaway": "Conserva el orden y registra cada actualización del estado. El estado resume lo leído hasta ese paso.",
    "next": "Combinaremos información de varias fuentes usando pesos calculados.",
    "lab": {
      "title": "Comprobar ambos órdenes",
      "objective": "Construir: registro de estados por paso.",
      "instruction": "En Orden de la secuencia elige ascendente y pulsa Ver el siguiente paso tres veces. Reinicia pasos y repite con descendente.",
      "watch": "Relaciona entrada actual, estado anterior y nuevo estado en cada paso.",
      "expected": "Obtienes 21,25 y 13,75. Cambia el orden; la regla y los valores permanecen iguales.",
      "notebookGuide": "En el bloque 11, compara contar palabras con conservar su orden y revisa la serie con LSTM. La regla fija de esta página solo explica un estado recurrente: en el cuaderno distingue parámetros aprendidos y evaluación."
    },
    "build": {
      "title": "Registro de estados por paso",
      "steps": [
        "Calcula los estados de 10, 20, 30 con estado inicial cero y la regla del caso; guarda entrada, estado anterior y nuevo estado.",
        "Repite con 30, 20, 10 y verifica ambas secuencias en el explorador. Compara el estado final y el promedio.",
        "En el bloque 11, ejecuta la parte de secuencias y localiza entradas ordenadas y respuesta; distingue la regla fija de un modelo entrenado."
      ],
      "check": "Ambas secuencias promedian 20, pero sus estados finales son 21,25 y 13,75. Ninguna fila utiliza una entrada posterior.",
      "transfer": "Para resumir lecturas consecutivas de un equipo, conserva su orden y marca los tiempos; el estado ilustrativo aún no predice averías.",
      "stretch": "Si ya programas: implementa la recurrencia y comprueba que invertir la lista cambia su estado final con la misma regla."
    }
  },
  "dl-atencion": {
    "objective": "Construir una combinación ponderada de fuentes y rastrear su cálculo.",
    "concept": "La atención por producto escalar combina información mediante pesos que dependen de una consulta Q. Comparamos Q con la clave K de cada fuente; esa comparación produce puntuaciones. Tras escalarlas, softmax transforma las puntuaciones en pesos que suman 1; cada peso multiplica el valor V asociado a su fuente. La suma de esas contribuciones es la salida.",
    "relevance": "Permite explicar una combinación interna sin presentarla como comprensión humana o explicación causal.",
    "case": {
      "title": "Una consulta, dos fuentes",
      "context": "Dos fuentes numéricas A y B tienen claves K_A = [1,0] y K_B = [0,1], y valores V_A = 10 y V_B = 20. Las claves sirven para compararlas con Q; los valores son los números que mezclaremos. Conservamos K y V y cambiamos solo Q. Todos estos números están fijados para el ejercicio.",
      "columns": [
        "Consulta Q",
        "Productos con A y B",
        "Pesos aproximados",
        "Salida"
      ],
      "rows": [
        [
          "[1,0]",
          "1 y 0",
          "0,6698 y 0,3302",
          "13,302"
        ],
        [
          "[0,1]",
          "0 y 1",
          "0,3302 y 0,6698",
          "16,698"
        ],
        [
          "[0,0]",
          "0 y 0",
          "0,5 y 0,5",
          "15"
        ]
      ],
      "reasoning": [
        "Con Q = [1,0], Q·K_A = 1×1 + 0×0 = 1 y Q·K_B = 1×0 + 0×1 = 0. Dividimos ambos por √2, porque las claves tienen dos componentes: obtenemos aproximadamente 0,7071 y 0.",
        "Softmax calcula el peso de A como exp(0,7071) / [exp(0,7071) + exp(0)] ≈ 0,6698. El peso de B es ≈ 0,3302; ambos suman 1.",
        "Combina los valores: 0,6698 × 10 + 0,3302 × 20 ≈ 13,302, usando los pesos sin redondear."
      ],
      "conclusion": "La consulta cambia el reparto y la salida, aunque claves y valores permanezcan iguales.",
      "question": "Si solo cambia la consulta Q, ¿cómo cambian los pesos de A y B y el valor combinado?"
    },
    "vocabulary": [
      {
        "term": "Consulta Q",
        "meaning": "Vector que se compara con las claves para calcular el reparto."
      },
      {
        "term": "Clave K y valor V",
        "meaning": "K interviene en la comparación; V aporta la información que se combina."
      },
      {
        "term": "Softmax",
        "meaning": "Convierte puntuaciones en pesos: divide la exponencial de cada puntuación por la suma de todas las exponenciales."
      }
    ],
    "explorer": "attention",
    "takeaway": "Sigue consulta y claves → puntuaciones → pesos → suma ponderada de valores. Los pesos indican cuánto aporta cada valor a esa combinación.",
    "next": "Ubicaremos esta operación dentro de una arquitectura para secuencias.",
    "lab": {
      "title": "Seguir la mezcla completa",
      "objective": "Construir: tabla de consulta, pesos y resultado.",
      "instruction": "En Consulta Q elige [1,0], después [0,1] y finalmente [0,0].",
      "watch": "Sigue productos, escala, softmax y suma ponderada; verifica que los pesos sumen 1.",
      "expected": "Las salidas son aproximadamente 13,302; 16,698 y 15. Nada se entrena al cambiar Q.",
      "notebookGuide": "En el bloque 12, sigue Q/K/V, sus productos y la combinación de valores con matrices. Relaciona cada paso con el cálculo de dos fuentes de esta página; la tabla de atención no demuestra una causa."
    },
    "build": {
      "title": "Tabla de consulta, pesos y resultado",
      "steps": [
        "Con las claves y valores del caso, calcula productos, escala y pesos para Q = [1,0]. Comprueba la suma ponderada.",
        "Conserva claves y valores; repite con [0,1] y [0,0]. Guarda las tres filas con sus pesos y resultados.",
        "En el bloque 12, ejecuta Q/K/V y relaciona cada matriz con las operaciones de tu tabla."
      ],
      "check": "Los pesos de cada fila suman 1; las salidas son aproximadamente 13,302; 16,698 y 15. Cambia la consulta, no los datos ni los parámetros.",
      "transfer": "Este cálculo ayuda a inspeccionar cómo un bloque mezcla información; para usarlo en una aplicación debes definir la tarea y evaluar sus respuestas.",
      "stretch": "Si ya programas: comprueba que softmax y el producto por V reproducen las tres salidas usando pesos sin redondear."
    }
  },
  "dl-transformers": {
    "objective": "Construir una prueba de clasificación de secuencias con respuestas verificables.",
    "concept": "Un Transformer es una arquitectura de red que combina atención con otras transformaciones para procesar secuencias. En el modelo de este laboratorio, cada número se representa con un vector y se añade información de su posición. La atención mezcla representaciones de diferentes posiciones; después, otras capas las transforman para calcular puntuaciones de salida. La etiqueta esperada se obtiene de la regla de la tarea y se compara con la predicción de la red.",
    "relevance": "Una arquitectura solo puede evaluarse después de definir qué debería responder.",
    "case": {
      "title": "¿El primero es mayor que el último?",
      "context": "Para cuatro números inventados, la etiqueta es 1 si el primero supera al último; en caso contrario, 0. Calculamos las etiquetas a mano.",
      "columns": [
        "Secuencia",
        "Primero",
        "Último",
        "Etiqueta"
      ],
      "rows": [
        [
          "1, 2, 3, 4",
          "1",
          "4",
          "0"
        ],
        [
          "4, 3, 2, 1",
          "4",
          "1",
          "1"
        ],
        [
          "2, 7, 1, 3",
          "2",
          "3",
          "0"
        ],
        [
          "3, 1, 7, 2",
          "3",
          "2",
          "1"
        ]
      ],
      "reasoning": [
        "Compara extremos: 1 < 4 exige 0; 4 > 1 exige 1.",
        "Cambiar el orden de los mismos números puede cambiar la etiqueta.",
        "La red debe aprender esta regla. La etiqueta calculada no es su predicción."
      ],
      "conclusion": "La tarea requiere posiciones, no solamente reconocer los números presentes.",
      "stages": [
        {
          "title": "Entrada y posición",
          "detail": "Cada número recibe un vector y se suma información de posición."
        },
        {
          "title": "Atención",
          "detail": "Combina representaciones según el contexto."
        },
        {
          "title": "Transformación",
          "detail": "Una pequeña red transforma cada representación. El bloque suma la representación anterior a la transformada y normaliza los valores para continuar el cálculo."
        },
        {
          "title": "Salida",
          "detail": "Conserva cuatro posiciones y calcula dos puntuaciones, una por clase."
        }
      ],
      "question": "¿Qué etiqueta corresponde a cada secuencia si la regla es «primero mayor que último»?"
    },
    "vocabulary": [
      {
        "term": "Token",
        "meaning": "Unidad de entrada; aquí, un número."
      },
      {
        "term": "Posición",
        "meaning": "Lugar de esa unidad en la secuencia."
      }
    ],
    "explorer": null,
    "takeaway": "Define la regla de respuesta y conserva el orden de los elementos. Comprueba las predicciones con etiquetas conocidas de casos reservados.",
    "next": "Pasaremos a fotos que producen registros de objetos.",
    "lab": {
      "title": "Seguir el bloque 12",
      "objective": "Construir: banco de pruebas para una secuencia.",
      "instruction": "Calcula las etiquetas de las cuatro secuencias de la tabla con la regla primero > último. En el bloque 12, sigue entrada, información de posición, atención y salida; ejecuta el modelo y compara sus predicciones con las etiquetas esperadas.",
      "watch": "Distingue etiquetas esperadas, pérdida de entrenamiento y evaluación en prueba.",
      "expected": "Las etiquetas calculadas con la regla son 0, 1, 0 y 1. Al ejecutar el cuaderno, compara cada predicción de la red con su etiqueta esperada y registra sus aciertos en prueba.",
      "notebookGuide": "En el bloque 12, resuelve primero las etiquetas de las secuencias y después sigue entrada, posición, encoder y salida. Compara predicción y etiqueta reservada al ejecutar; no deduzcas la exactitud a partir de la arquitectura."
    },
    "build": {
      "title": "Banco de pruebas para una secuencia",
      "steps": [
        "Usa la regla primero > último para obtener las etiquetas de las cuatro secuencias del caso. Conserva esas respuestas como comprobación.",
        "En el bloque 12, ejecuta el modelo y localiza entrada, posición, encoder y salida. Contrasta predicciones con etiquetas reservadas.",
        "Crea dos secuencias adicionales cambiando el orden, calcula sus etiquetas y registra predicción y acierto al probarlas con el mismo formato del cuaderno."
      ],
      "check": "Las cuatro etiquetas del caso son 0, 1, 0 y 1. El registro distingue la respuesta calculada de lo que predice la red; los aciertos se conocen al ejecutar.",
      "transfer": "En tareas con registros ordenados, define primero qué respuesta esperas y cómo la comprobarás antes de elegir una arquitectura.",
      "stretch": "Si ya programas: crea una función de etiquetado y prueba también igualdad entre extremos; la etiqueta debe ser 0."
    }
  },
  "dl-yolo": {
    "objective": "Construir un registro de detecciones que pueda revisarse antes de contar objetos.",
    "concept": "YOLO es una familia de modelos de detección de objetos. En la tarea del cuaderno, cada detección contiene una categoría, una puntuación y las coordenadas de una caja. Una regla de puntuación filtra qué propuestas se conservan y pasan al registro. El conteo corresponde a detecciones conservadas: para tratarlo como inventario debes revisar objetos omitidos, categorías equivocadas y duplicados.",
    "relevance": "Ayuda a revisar un registro visual antes de tratarlo como inventario.",
    "case": {
      "title": "Una propuesta, distintos filtros",
      "context": "En este ejercicio hay un objeto dibujado y una propuesta de caja con puntuación fija 0,80. Aplicamos la regla «conservar si puntuación ≥ umbral» sin mover la caja. La tabla muestra el filtro numérico; en el cuaderno YOLO ejecutarás detección sobre una foto.",
      "columns": [
        "Umbral",
        "¿0,80 supera o iguala el límite?",
        "Filas conservadas"
      ],
      "rows": [
        [
          "0,50",
          "Sí",
          "1"
        ],
        [
          "0,80",
          "Sí",
          "1"
        ],
        [
          "0,90",
          "No",
          "0"
        ]
      ],
      "reasoning": [
        "Con 0,50 se conserva la propuesta: el registro contiene una fila con caja y puntuación.",
        "Con 0,80 también se conserva, porque la regla incluye la igualdad.",
        "Con 0,90 se descarta la fila, pero el objeto conocido sigue presente. Cero registros no demuestra ausencia."
      ],
      "conclusion": "El conteo cambia por una regla de selección, sin modificar la escena ni la puntuación.",
      "question": "¿Cuántas filas conserva la regla puntuación ≥ umbral si la propuesta tiene puntuación 0,80?"
    },
    "vocabulary": [
      {
        "term": "Detección",
        "meaning": "Propuesta de categoría, puntuación y ubicación."
      },
      {
        "term": "Umbral",
        "meaning": "Límite para conservar una puntuación."
      }
    ],
    "explorer": "detection",
    "takeaway": "Relaciona cada fila con su imagen, categoría, puntuación y caja. Revisa las detecciones antes de convertir su conteo en una decisión operativa.",
    "next": "Comprobaremos si la caja conservada coincide con la ubicación conocida.",
    "lab": {
      "title": "Filtrar sin mover la caja",
      "objective": "Construir: registro visual: de la foto a las filas.",
      "instruction": "Con Desplazamiento horizontal de la caja en 10, cambia Umbral de puntuación entre 0,50; 0,80 y 0,90.",
      "watch": "Observa la propuesta conservada, la puntuación fija y el objeto de referencia.",
      "expected": "Conservas una predicción en los dos primeros casos y ninguna en el último. La ubicación no cambia.",
      "notebookGuide": "En YOLO, sigue las secciones 5–8: inferencia, filas, conteos y umbral. Explica cómo una detección llega al registro y por qué un registro vacío no demuestra que el objeto no exista."
    },
    "build": {
      "title": "Registro visual: de la foto a las filas",
      "steps": [
        "En las secciones 5–8 de YOLO, ejecuta la inferencia de la foto del cuaderno y registra clase, puntuación y coordenadas de las cajas.",
        "Conserva las propuestas y compara dos umbrales; cuenta por clase las filas que quedan, sin presentar el conteo como inventario confirmado.",
        "Usa el explorador para comprobar la igualdad con puntuación 0,80 y explica qué significa una tabla vacía cuando subes a 0,90."
      ],
      "check": "El caso conserva una fila a 0,50 y 0,80 y ninguna a 0,90. En tu ejecución, cada conteo se puede rastrear a filas y cajas de la misma imagen.",
      "transfer": "Para registrar objetos visibles en una bodega, guarda la imagen de origen y revisa duplicados y omisiones antes de actualizar existencias.",
      "stretch": "Si ya programas: genera una tabla con identificador de imagen y detección además de clase, puntuación y coordenadas."
    }
  },
  "dl-evaluacion": {
    "objective": "Construir una comprobación de localización que separe filtro y coincidencia.",
    "concept": "Evaluar detecciones consiste en comparar propuestas con objetos anotados como referencia. Una propuesta conservada se considera acierto si su categoría coincide y su caja cumple el criterio de localización. Aquí usamos IoU: área compartida por ambas cajas dividida por el área de su unión. Con una sola categoría, una propuesta conservada sin coincidencia cuenta como falso positivo y un objeto sin detección coincidente cuenta como falso negativo.",
    "relevance": "Una puntuación alta no garantiza una caja bien ubicada ni evita objetos omitidos.",
    "case": {
      "title": "Conservar una caja no basta",
      "context": "Un objeto de categoría Fruto tiene caja de referencia con esquina superior izquierda [20,20] e inferior derecha [60,60], en píxeles: ancho y alto de 40. La candidata tiene el mismo tamaño y categoría, y puntuación 0,80. Solo la desplazamos horizontalmente hacia la derecha. Aceptamos coincidencia si IoU ≥ 0,50; cada fila empieza un escenario independiente.",
      "columns": [
        "Desplazamiento",
        "Umbral de puntuación",
        "IoU",
        "TP / FP / FN"
      ],
      "rows": [
        [
          "10 píxeles",
          "0,50",
          "0,60",
          "1 / 0 / 0"
        ],
        [
          "30 píxeles",
          "0,50",
          "1/7 ≈ 0,143",
          "0 / 1 / 1"
        ],
        [
          "10 píxeles",
          "0,90",
          "0,60",
          "0 / 0 / 1"
        ]
      ],
      "reasoning": [
        "Con desplazamiento 10, comparten 30 × 40 = 1200 píxeles cuadrados; la unión mide 2000. IoU = 1200/2000 = 0,60.",
        "Con desplazamiento 30, IoU = 400/2800 = 1/7: la propuesta cuenta como falsa y el objeto queda omitido.",
        "Con umbral 0,90 se descarta la propuesta: no hay falso positivo, pero sigue habiendo un objeto omitido."
      ],
      "conclusion": "Filtrar y comprobar localización son decisiones distintas; ambas cambian los conteos.",
      "question": "¿La caja conservada coincide con el objeto y qué errores aparecen al desplazarla o descartarla?"
    },
    "vocabulary": [
      {
        "term": "IoU",
        "meaning": "Intersección / unión de las áreas de dos cajas. Vale 0 sin solapamiento y 1 si coinciden por completo."
      },
      {
        "term": "TP",
        "meaning": "Verdadero positivo: propuesta conservada que coincide con el objeto según el criterio."
      },
      {
        "term": "FP y FN",
        "meaning": "FP: propuesta conservada sin coincidencia. FN: objeto de referencia que no tiene una propuesta coincidente."
      }
    ],
    "explorer": "detection",
    "takeaway": "Evalúa por separado la regla que conserva propuestas y el criterio que las compara con los objetos de referencia.",
    "next": "Consideraremos las consecuencias de convertir predicciones en acciones.",
    "lab": {
      "title": "Separar filtro y coincidencia",
      "objective": "Construir: prueba de aceptación de cajas.",
      "instruction": "Deja IoU mínima para coincidencia en 0,50. Compara desplazamientos 10 y 30 con umbral 0,50; vuelve a 10 y sube el umbral a 0,90.",
      "watch": "Lee IoU y Verdaderos positivos, Falsos positivos y Objetos omitidos.",
      "expected": "Obtienes respectivamente TP/FP/FN = 1/0/0; 0/1/1 y 0/0/1.",
      "notebookGuide": "En YOLO, revisa las cajas y registros de las secciones 6–8. El cuaderno demuestra inferencia, no una evaluación mAP con etiquetas de referencia. La cuenta de IoU de esta página permite practicar una comprobación de localización."
    },
    "build": {
      "title": "Prueba de aceptación de cajas",
      "steps": [
        "Fija IoU mínima 0,50. Con umbral de puntuación 0,50, compara desplazamientos 10 y 30 y registra IoU, TP, FP y FN.",
        "Vuelve a desplazamiento 10 y sube el umbral a 0,90; documenta por qué desaparece la propuesta, pero no el objeto de referencia.",
        "En las cajas del cuaderno YOLO, indica qué anotaciones de referencia necesitarías para repetir esta evaluación con fotos reales."
      ],
      "check": "Las tres pruebas dan TP/FP/FN = 1/0/0, 0/1/1 y 0/0/1. La cuenta usa una caja de referencia; el cuaderno de inferencia no calcula mAP.",
      "transfer": "Para aceptar una automatización de conteo, revisa objetos omitidos y duplicados además de la puntuación de las cajas conservadas.",
      "stretch": "Si ya programas: verifica que la función IoU devuelve 1 para cajas idénticas y 0 para cajas sin solapamiento."
    }
  },
  "dl-integracion": {
    "objective": "Construir una política de revisión con costes y una salida verificable.",
    "concept": "Una política de revisión convierte una puntuación en una acción: enviar el caso a revisión o aceptarlo sin revisar. Su coste depende de cuántos casos revisas y cuántos defectos aceptas por error. Para comparar políticas, conserva los mismos casos y calcula coste = revisiones × coste de revisar + defectos aceptados × coste de aceptar un defecto. Incluye una alternativa sencilla, como revisar todos, y declara los supuestos de la revisión.",
    "relevance": "La decisión depende de errores y consecuencias, además de las puntuaciones.",
    "case": {
      "title": "¿Qué granos conviene revisar?",
      "context": "Diez granos y sus conteos ficticios del bloque 14. Enviamos a revisión los que alcanzan el umbral y aceptamos el resto. Revisar cuesta 1 unidad de coste; aceptar un defectuoso cuesta 8. Para esta cuenta suponemos que toda revisión detecta correctamente el defecto. Son unidades ficticias de coste, no precios.",
      "columns": [
        "Política",
        "Revisiones",
        "Defectos aceptados",
        "Coste total"
      ],
      "rows": [
        [
          "Umbral 0,30",
          "6",
          "0",
          "6"
        ],
        [
          "Umbral 0,50",
          "4",
          "1",
          "12"
        ],
        [
          "Umbral 0,70",
          "3",
          "1",
          "11"
        ],
        [
          "Umbral 0,90",
          "1",
          "3",
          "25"
        ],
        [
          "Revisar todos",
          "10",
          "0",
          "10"
        ]
      ],
      "reasoning": [
        "Separa revisiones y defectos que pasan sin revisión.",
        "Calcula coste = revisiones × 1 + defectos aceptados × 8. Por ejemplo, 4 × 1 + 1 × 8 = 12.",
        "Con estos supuestos, 0,30 tiene el menor coste: 6 frente a 12, 11, 25 y 10."
      ],
      "conclusion": "Menos revisiones no implica menor coste cuando dejar pasar defectos resulta caro.",
      "question": "¿Qué política tiene menor coste al pagar 1 por revisión y 8 por defecto aceptado, y qué cambia si este último coste baja a 1?"
    },
    "vocabulary": [
      {
        "term": "Política",
        "meaning": "Regla que transforma una puntuación en una acción."
      },
      {
        "term": "Referencia",
        "meaning": "Alternativa sencilla con la que comparar."
      }
    ],
    "explorer": null,
    "takeaway": "Compara políticas con los mismos casos, costes y supuestos. La opción elegida debe indicar qué se revisa, qué se acepta y cómo se seguirá el error.",
    "next": "Cierra explicando pregunta, datos, comparación, decisión y evidencia que falta.",
    "lab": {
      "title": "Cambiar el coste, conservar los casos",
      "objective": "Construir: prototipo de revisión asistida.",
      "instruction": "Usa los mismos conteos, pero reduce de 8 a 1 el coste de aceptar un defecto. Localiza COSTO_DEFECTO_ACEPTADO en el bloque 14.",
      "watch": "Compara todos los umbrales y revisar todos; no cambian puntuaciones ni conteos.",
      "expected": "Los costes pasan a 6, 5, 4, 4 y 10. Hay empate entre 0,70 y 0,90; la elección depende de los supuestos.",
      "notebookGuide": "En el bloque 14 de Laboratorio DL ilustrado, localiza el coste de aceptar un defecto y conserva los conteos al cambiarlo. Compara todas las políticas, incluida revisar todos, y explicita el supuesto sobre la revisión manual."
    },
    "build": {
      "title": "Prototipo de revisión asistida",
      "steps": [
        "En el bloque 14, conserva puntuaciones y conteos. Calcula costes de las cuatro reglas y de revisar todos con coste de defecto aceptado igual a 8.",
        "Cambia ese coste a 1 y vuelve a calcular la tabla. Selecciona una política para cada escenario y documenta el supuesto de revisión manual perfecta.",
        "Define la salida del prototipo: casos para revisión, casos aceptados, motivo y seguimiento de errores. Explica qué verificarías antes de usarlo en una operación."
      ],
      "check": "Con coste 8, el mínimo del caso es 6 a umbral 0,30. Con coste 1, las políticas cuestan 6, 5, 4, 4 y 10; 0,70 y 0,90 empatan. Los costes son ficticios.",
      "transfer": "Para priorizar inspecciones de productos, adapta el coste y la capacidad al proceso, mide errores de revisión y prueba la política antes de automatizar.",
      "stretch": "Si ya programas: genera la tabla para varios costes y capacidades, incluyendo siempre revisar todos como alternativa."
    }
  }
};
