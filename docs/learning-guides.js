export const LESSON_GUIDES={
  "ml-problema": {
    "objective": "Diseñar una primera predicción útil para planear una operación.",
    "relevance": "Una cooperativa necesita anticipar producción para organizar transporte antes de cosechar.",
    "concept": "El aprendizaje automático permite construir una regla a partir de ejemplos y comprobarla en otros casos. En esta primera tarea queremos estimar rendimiento para planear transporte. El recorrido tiene tres momentos distintos: entrenar ajusta la regla con parejas de entradas y respuestas; predecir calcula una salida para otro caso; evaluar compara esa salida con la respuesta observada. Aprender una relación no demuestra que una variable cause la otra.",
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
      },
      {
        "term": "Observación o muestra",
        "meaning": "Un caso de la tabla: aquí, un lote durante un periodo."
      },
      {
        "term": "Variable o característica",
        "meaning": "Propiedad registrada de cada caso; las características de entrada describen lo que sabemos al decidir, como lluvia en mm. La respuesta también es una variable, pero se mantiene separada de esas entradas."
      },
      {
        "term": "Modelo",
        "meaning": "Regla que recibe entradas y calcula una salida; aquí, una relación entre lluvia y rendimiento."
      },
      {
        "term": "Algoritmo de aprendizaje",
        "meaning": "Procedimiento que ajusta la regla usando datos; no es la predicción resultante."
      },
      {
        "term": "Parámetro",
        "meaning": "Valor ajustable de la regla, como la pendiente de una recta."
      },
      {
        "term": "X e y",
        "meaning": "X reúne las entradas; y contiene las respuestas conocidas del aprendizaje supervisado."
      }
    ],
    "lab": {
      "title": "Predecir antes de conocer la respuesta",
      "objective": "Separar entrada, predicción y comprobación en una ficha de un lote.",
      "instruction": "Avanza hasta «Predecir un caso nuevo». Elige B, anota su predicción y luego revela el rendimiento.",
      "watch": "La predicción se calcula con lluvia; el rendimiento reservado aparece al comprobar, sin cambiar el patrón aprendido.",
      "expected": "B tiene 550 mm: 0,005 × 550 = 2,75 t/ha. Observado: 3,10 t/ha. Error absoluto: |3,10 − 2,75| = 0,35 t/ha.",
      "notebookGuide": "En tu copia de Laboratorio ML explicado, ejecuta hasta 1.3. La tabla contiene 240 fincas simuladas y tres entradas; la separación deja 180 para entrenar y 60 para prueba. Es otro conjunto, distinto del pequeño ejemplo visual."
    },
    "takeaway": "Define la unidad de cada fila, las entradas disponibles al decidir y la respuesta que quieres estimar. Comprueba las predicciones con casos que quedaron fuera del ajuste.",
    "next": "Antes de aprender, revisemos qué hacer cuando falta una entrada.",
    "explorer": "problem",
    "build": {
      "title": "Ficha de una predicción",
      "steps": [
        "Registra para B: lluvia conocida, rendimiento predicho y rendimiento revelado, con unidades. Calcula su error absoluto.",
        "En 1.1 del cuaderno, identifica qué representa una fila y separa las tres entradas de la respuesta rendimiento.",
        "Comprueba en 1.3 los tamaños 180 y 60. Anota qué grupo puede usarse para ajustar y cuál queda reservado para comprobar."
      ],
      "check": "La ficha de B da 2,75 t/ha predichas y 0,35 t/ha de error. En el cuaderno, rendimiento no aparece como entrada y las 60 filas de prueba quedan fuera del ajuste.",
      "transfer": "Para anticipar pedidos, define una fila por producto y semana. Distingue información disponible al planear de pedidos observados después.",
      "stretch": "Repite con A o C en el explorador y compara sus errores absolutos. El patrón no cambia al revelar otra respuesta."
    },
    "prerequisite": "Partimos de una pregunta: ¿cuánto producirá un lote antes de cosecharlo? Primero identifica qué representa una fila, qué sabemos al decidir y qué queremos estimar.",
    "understanding": {
      "question": "¿Qué distingue entrenar, predecir y comprobar una predicción?",
      "answer": "Entrenar ajusta la regla con ejemplos conocidos; predecir calcula una salida para otro caso; comprobar compara esa salida con su respuesta observada. La respuesta de prueba no se usa para ajustar."
    }
  },
  "ml-preparacion": {
    "objective": "Preparar una tabla con datos ausentes sin contaminar la prueba.",
    "relevance": "Si falla una estación, escribir cero confundiría ausencia de medida con ausencia de lluvia.",
    "concept": "Una regla solo puede interpretarse si sus entradas conservan un significado consistente. Preparar datos implica revisar unidades, registros y ausencias, y aplicar las transformaciones que requiera el método. Aquí estudiamos una ausencia de lluvia: la completamos con una estimación calculada en entrenamiento y dejamos constancia de que no fue medida. La mediana es una opción para este ejemplo; antes de usarla hay que investigar por qué falta el dato.",
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
      },
      {
        "term": "Conjunto de prueba",
        "meaning": "Casos apartados para evaluar la solución final; no sirven para elegir la preparación."
      },
      {
        "term": "Fuga de información",
        "meaning": "Uso durante el desarrollo de datos que no estarían disponibles al predecir, o que pertenecen a la prueba reservada."
      },
      {
        "term": "Escalado",
        "meaning": "Cambio de representación de una variable, por ejemplo restar su media y dividir por su desviación estándar. Es importante en métodos basados en distancias; no todos los modelos lo necesitan igual."
      },
      {
        "term": "Pipeline",
        "meaning": "Secuencia que aplica preparación y modelo en el mismo orden al entrenar y al predecir."
      }
    ],
    "lab": {
      "title": "Completar sin inventar una medición",
      "objective": "Preparar una columna conservando la marca de dato ausente.",
      "instruction": "Deja C en 600 y D en 700 mm. Cambia A de 500 a 100 mm y compara el valor asignado a B.",
      "watch": "B conserva el color de estimación; los controles solo cambian registros conocidos de entrenamiento.",
      "expected": "La mediana de 500, 600 y 700 es 600 mm. La de 100, 600 y 700 también es 600 mm: B no cambia. Seguimos sin conocer su lluvia real.",
      "notebookGuide": "En Laboratorio ML explicado, ejecuta 1.2–1.5 en orden. 1.2 crea 20 ausencias; 1.3 separa los conjuntos y 1.5 muestra la mediana aprendida por el pipeline solo con entrenamiento."
    },
    "takeaway": "Aprende la regla de preparación con entrenamiento, aplícala a los otros conjuntos y conserva la diferencia entre una medición y una estimación.",
    "next": "Con entradas preparadas, calcularemos una predicción y su error.",
    "explorer": "impute",
    "build": {
      "title": "Tabla preparada y regla de limpieza",
      "steps": [
        "Registra A, B, C y D con dos columnas: registro original y valor preparado. Marca B como estimado en ambas pruebas del explorador.",
        "Ejecuta 1.2–1.5 del cuaderno y anota ausencias iniciales, tamaño de entrenamiento y mediana de lluvia impresa.",
        "Localiza SimpleImputer dentro del pipeline. Comprueba que fit recibe X_tr, y_tr; la prueba se transforma al predecir, sin volver a aprender la mediana."
      ],
      "check": "B recibe 600 mm en las dos pruebas visuales y conserva su marca de estimación. La mediana del cuaderno procede de sus propias filas de entrenamiento; no tiene por qué ser 600 mm.",
      "transfer": "Para tiempos de entrega sin registrar, conserva la ausencia original y la unidad minutos. Una ausencia no significa entrega inmediata.",
      "stretch": "En una celda nueva de tu copia, consulta X_tr.isna().sum() y lineal[0].statistics_ para relacionar ausencias por columna con las estadísticas de imputación aprendidas."
    },
    "prerequisite": "Ya separamos las entradas de la respuesta. Ahora necesitamos que cada columna conserve un significado y una unidad comparables antes de ajustar la regla.",
    "understanding": {
      "question": "¿Por qué completar una ausencia y escalar una variable son operaciones diferentes?",
      "answer": "Imputar estima un valor faltante. Escalar cambia la representación numérica de valores disponibles. Ninguna operación debe aprender estadísticas de la prueba; tampoco convierte una estimación en una medida real."
    }
  },
  "ml-regresion": {
    "objective": "Construir una comparación de estimaciones con errores en unidades útiles.",
    "relevance": "Estimar cosechas ayuda a planificar; necesitamos saber cuánto puede equivocarse la estimación.",
    "concept": "La regresión responde preguntas sobre cantidades, como rendimiento en t/ha. Una recta es una de sus posibles reglas: predicción = intercepto + pendiente × entrada. En la ilustración movemos sus parámetros manualmente; en el cuaderno se ajustan con datos. Después medimos cuánto se separan sus predicciones de los valores observados. El criterio usado para ajustar y la métrica usada para evaluar pueden ser diferentes.",
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
        "term": "Error absoluto",
        "meaning": "Distancia sin signo entre observado y predicho."
      },
      {
        "term": "MAE",
        "meaning": "Promedio de esas distancias."
      },
      {
        "term": "Intercepto",
        "meaning": "Salida de la recta cuando la entrada vale cero. Puede no tener interpretación práctica si cero queda fuera de los datos observados."
      },
      {
        "term": "Pendiente",
        "meaning": "Cambio de la salida por cada unidad adicional de entrada; aquí se expresa en (t/ha)/(kg/ha)."
      },
      {
        "term": "Ajuste por mínimos cuadrados",
        "meaning": "Procedimiento que elige los parámetros minimizando la suma de errores al cuadrado en entrenamiento."
      },
      {
        "term": "Residuo",
        "meaning": "Observado menos predicho. Su signo indica por encima o por debajo; el error absoluto elimina ese signo."
      },
      {
        "term": "Extrapolación",
        "meaning": "Predicción fuera del intervalo de entradas observado al entrenar; requiere especial comprobación."
      }
    ],
    "lab": {
      "title": "Ajustar una recta y medir su error",
      "objective": "Comparar dos ajustes sin confundir ajuste con evaluación reservada.",
      "instruction": "Fija pendiente 0,025 e intercepto 1. Anota el MAE y pulsa «Ajustar a estos puntos»; registra el nuevo MAE.",
      "watch": "Los seis puntos no cambian. Las líneas verticales son diferencias entre observado y predicho; MAE promedia sus magnitudes.",
      "expected": "El MAE pasa de 0,20 a aproximadamente 0,04 t/ha. Ambos valores describen los seis puntos usados para ajustar, no fincas nuevas.",
      "notebookGuide": "En Laboratorio ML explicado, ejecuta 1.1–1.6. La tabla resultados compara referencia y regresión sobre las mismas 60 fincas reservadas; comparacion muestra observado, predicción lineal y error por finca."
    },
    "takeaway": "El MAE describe el tamaño medio del error en las unidades de la respuesta. Para evaluar casos nuevos, calcúlalo con datos reservados.",
    "next": "Cambiaremos la pregunta: de cuánto rendimiento a qué categoría asignar.",
    "explorer": "regression",
    "build": {
      "title": "Tabla de predicciones y referencia",
      "steps": [
        "Anota pendiente, intercepto y MAE antes y después del ajuste visual, indicando que se usan los mismos seis puntos.",
        "En 1.6 del cuaderno, registra los dos MAE de resultados y revisa las primeras filas de comparacion.",
        "Comprueba una fila: error = |observado − predicción|. Decide qué modelo seguirías probando a partir de su MAE en prueba y expresa el error en t/ha."
      ],
      "check": "El ajuste visual reduce su MAE a cerca de 0,04 t/ha. La comparación reservada del cuaderno usa sus propios MAE; el error por fila coincide con la diferencia absoluta calculada.",
      "transfer": "Para estimar minutos de atención, conserva una referencia sencilla y evalúa ambas reglas sobre las mismas solicitudes reservadas; expresa MAE en minutos.",
      "stretch": "En una celda nueva de tu copia, usa comparacion.sort_values('error_absoluto_t_ha', ascending=False).head() para inspeccionar los errores mayores."
    },
    "prerequisite": "Tenemos una tabla preparada y una respuesta numérica. Ahora distinguimos la regla que calcula una cantidad del criterio que usa el entrenamiento para ajustarla.",
    "understanding": {
      "question": "¿De dónde salen pendiente e intercepto y qué mide el MAE?",
      "answer": "En la demostración eliges pendiente e intercepto manualmente. En el entrenamiento los estima el algoritmo con los datos. El MAE resume el error absoluto de las predicciones en las unidades de la respuesta; no indica causalidad."
    }
  },
  "ml-clasificacion": {
    "objective": "Construir una lista de revisión a partir de puntuaciones y una regla explícita.",
    "relevance": "Una alerta puede priorizar plantas para revisión, sin reemplazar la comprobación de campo.",
    "concept": "La clasificación responde preguntas sobre categorías: aquí, si una planta tiene plaga. El modelo puede producir una puntuación y una regla la convierte en una categoría predicha. Esa decisión se contrasta con la etiqueta real. Separar estos tres elementos permite entender por qué un mismo modelo puede generar distintas listas de alertas al cambiar el umbral.",
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
      },
      {
        "term": "Etiqueta real",
        "meaning": "Categoría registrada para un ejemplo por observación o anotación; sirve de respuesta durante el entrenamiento y de referencia al evaluar."
      },
      {
        "term": "Clase positiva",
        "meaning": "Categoría que queremos detectar: en este caso, con plaga. Positiva no significa beneficiosa."
      },
      {
        "term": "Clasificación binaria y multiclase",
        "meaning": "Binaria distingue dos clases; multiclase elige entre más de dos categorías mutuamente excluyentes."
      },
      {
        "term": "Calibración",
        "meaning": "Correspondencia entre probabilidades estimadas y frecuencias observadas. Una puntuación de 0,80 por sí sola no demuestra esa correspondencia."
      }
    ],
    "lab": {
      "title": "Construir una lista de revisión",
      "objective": "Convertir puntuaciones en alertas y comprobar dos errores distintos.",
      "instruction": "Fija el umbral en 0,50. Anota qué plantas tienen borde de alerta y compara P4 y P5 con su realidad escrita.",
      "watch": "El borde marca una decisión. La etiqueta «Con plaga» o «Sana» describe la realidad inventada con la que la comprobamos.",
      "expected": "Se alertan P1, P2, P3, P5 y P6. P4 tiene plaga y queda omitida; P5 y P6 están sanas y generan falsas alertas.",
      "notebookGuide": "En Clasificación e Iris, ejecuta la sección 1: su puntuación busca alto rendimiento a partir de un índice hídrico simulado, no plagas. Identifica entrada, clase positiva y umbral; allí las métricas se calculan sobre entrenamiento."
    },
    "takeaway": "Define la categoría positiva y la regla de alerta. Conserva puntuación, decisión y realidad en columnas separadas.",
    "next": "Contaremos esos aciertos y errores para interpretar las métricas.",
    "explorer": "threshold",
    "build": {
      "title": "Lista de plantas por revisar",
      "steps": [
        "Crea una lista con planta, puntuación y decisión para las diez plantas a umbral 0,50. Regla: puntuación ≥ umbral → alerta.",
        "Añade la realidad escrita y marca P4 como omisión, P5 y P6 como falsas alertas. Separa decisión de confirmación de plaga.",
        "En la sección 1 del cuaderno, localiza la comparación de puntuaciones con el umbral e identifica qué significa 1 en ese otro ejemplo."
      ],
      "check": "La lista contiene cinco alertas. P4 no se alerta aunque tiene plaga; P5 y P6 se alertan aunque están sanas. Una puntuación no equivale a porcentaje de daño.",
      "transfer": "Para priorizar soporte, define primero qué cuenta como solicitud urgente. La alerta inicia revisión; registra también solicitudes urgentes que quedaron fuera.",
      "stretch": "Sube el umbral a 0,70 y revisa P3, cuya puntuación es exactamente 0,70. Debe conservar su alerta porque la regla incluye la igualdad."
    },
    "prerequisite": "En regresión la salida era una cantidad. Ahora la pregunta es si una planta pertenece a una categoría, y una puntuación debe convertirse en una decisión.",
    "understanding": {
      "question": "¿Puntuación, clase predicha y clase real son lo mismo?",
      "answer": "No. La puntuación es una salida numérica; el umbral la convierte en clase predicha. La clase real se obtiene mediante observación o anotación y permite evaluar la decisión. Mover el umbral no cambia la realidad."
    }
  },
  "ml-metricas": {
    "objective": "Construir un reporte que muestre qué detecta y qué omite una alerta.",
    "relevance": "«Acertamos bastante» oculta si omitimos plagas o revisamos demasiadas plantas sanas.",
    "concept": "Las métricas de clasificación resumen decisiones comparadas con su realidad conocida. Antes de calcular porcentajes, organizamos todos los casos en una matriz de confusión con los cuatro resultados de abajo. Cada métrica elige un denominador diferente y responde una pregunta distinta. Debemos declarar que la clase positiva es «con plaga» para interpretar los conteos.",
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
        "meaning": "TP / (TP + FN): proporción de plantas con plaga que detectamos. Sin positivos reales, el denominador es cero y esta proporción no queda definida."
      },
      {
        "term": "Accuracy",
        "meaning": "(TP + TN) / total: proporción de casos acertados. En español, exactitud; no debe confundirse con precision."
      },
      {
        "term": "Verdadero positivo (TP)",
        "meaning": "Planta con plaga que sí recibió alerta."
      },
      {
        "term": "Falso positivo (FP)",
        "meaning": "Planta sana que recibió una alerta incorrecta."
      },
      {
        "term": "Falso negativo (FN)",
        "meaning": "Planta con plaga que quedó sin alerta."
      },
      {
        "term": "Verdadero negativo (TN)",
        "meaning": "Planta sana que quedó correctamente sin alerta."
      },
      {
        "term": "Desbalance de clases",
        "meaning": "Una categoría aparece mucho más que otra. Su frecuencia afecta cómo interpretamos los porcentajes."
      },
      {
        "term": "Precision (precisión)",
        "meaning": "TP / (TP + FP): proporción de alertas correctas. Si no hay alertas, el denominador es cero y esta proporción no queda definida."
      }
    ],
    "lab": {
      "title": "Contar antes de calcular porcentajes",
      "objective": "Construir un reporte que distinga omisiones y falsas alertas.",
      "instruction": "Fija 0,50. Cuenta las plantas de cada casilla de la matriz y calcula cuántas plagas detectaste y cuántas alertas acertaron.",
      "watch": "Filas = realidad; columnas = predicción. Detectadas / todas las plantas con plaga responde algo distinto de detectadas / todas las alertas.",
      "expected": "TP = 3, FP = 2, FN = 1 y TN = 4. Sensibilidad (recall) = 3/4 = 75 %; precisión = 3/5 = 60 %; exactitud = 7/10 = 70 %.",
      "notebookGuide": "Ejecuta la sección 2 de Laboratorio ML explicado. Usa las mismas diez realidades y decisiones del caso 0,50. Reconstruye los cuatro conteos antes de leer las métricas impresas."
    },
    "takeaway": "Escribe el numerador y el denominador de cada métrica: detectar plagas, acertar alertas y acertar decisiones son preguntas diferentes.",
    "next": "Mover el umbral cambiará esos conteos sin cambiar las plantas.",
    "explorer": "threshold",
    "build": {
      "title": "Reporte de calidad de las alertas",
      "steps": [
        "Reúne las diez plantas en cuatro grupos: detección correcta, falsa alerta, omisión y descarte correcto. Anota identificadores y cantidades.",
        "Calcula sensibilidad, precisión y exactitud con numerador y denominador. Contrasta tus resultados con la matriz y la tabla de la sección 2 del cuaderno.",
        "Escribe qué revisarías primero: P4 requiere atención por la omisión; P5 y P6 consumen revisiones innecesarias en este ejemplo."
      ],
      "check": "Los conteos 3 + 2 + 1 + 4 suman diez. Los denominadores son cuatro plantas con plaga, cinco alertas y diez plantas, respectivamente.",
      "transfer": "En solicitudes urgentes, informa cuántas se omitieron y cuántas revisiones resultaron innecesarias; un único porcentaje no explica ambos efectos.",
      "stretch": "Sube el umbral a 0,95: no habrá alertas. Comprueba que la precisión queda sin definir porque su denominador es cero; no la conviertas en 0 % ni 100 %."
    },
    "prerequisite": "Ya tenemos decisiones y etiquetas reales. Ahora contamos qué tipo de error cometemos antes de resumirlo en un porcentaje.",
    "understanding": {
      "question": "Si casi todas las plantas están sanas, ¿por qué la exactitud puede ocultar un problema?",
      "answer": "Un sistema que siempre responde sana acertaría muchas veces, pero detectaría cero plantas con plaga. Por eso revisamos recall, precisión y los cuatro conteos, indicando cuál es la clase positiva."
    }
  },
  "ml-umbral": {
    "objective": "Configurar una política de alertas según la capacidad de revisión.",
    "relevance": "Un equipo con pocas personas para revisar debe decidir cuánto riesgo de omisión aceptar.",
    "concept": "Ahora usamos las métricas para elegir una política de alertas. La regla es dar alerta si puntuación ≥ umbral: un corte más alto puede reducir revisiones y también dejar positivos sin atender. Las puntuaciones y las plantas permanecen fijas; cambian las decisiones. La elección debe responder a consecuencias y capacidad, hacerse con validación y comprobarse después en una prueba separada.",
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
      },
      {
        "term": "Capacidad de revisión",
        "meaning": "Número de alertas que realmente podemos atender en un periodo."
      },
      {
        "term": "Coste de error",
        "meaning": "Consecuencia asignada a una falsa alerta o a una omisión; debe declararse en el contexto."
      },
      {
        "term": "Regla de decisión",
        "meaning": "Instrucción que convierte una salida en acción; aquí, dar alerta si puntuación ≥ umbral."
      }
    ],
    "lab": {
      "title": "Ajustar la carga de revisión",
      "objective": "Elegir una regla compatible con cuatro revisiones y describir su riesgo.",
      "instruction": "Compara umbrales 0,30, 0,50 y 0,70. Registra alertas, falsas alertas y omisiones para cada uno.",
      "watch": "Las puntuaciones y realidades permanecen fijas; cambian las decisiones. Cuenta cuántas alertas caben en una ronda de cuatro revisiones.",
      "expected": "0,30 → 7 alertas, 3 falsas y 0 omisiones. 0,50 → 5 alertas, 2 falsas y 1 omisión. 0,70 → 4 alertas, 1 falsa y 1 omisión.",
      "notebookGuide": "La sección 2 de Laboratorio ML explicado tiene decisiones fijas, sin selector de umbral: sirve para verificar los conteos de 0,50. Compara los tres umbrales en este explorador y guarda la tabla en tu copia o bitácora."
    },
    "takeaway": "Elige la regla considerando revisiones necesarias, falsas alertas y omisiones; indica qué harás con los casos que no entren en la revisión.",
    "next": "Después buscaremos grupos cuando no tenemos categorías conocidas.",
    "explorer": "threshold",
    "build": {
      "title": "Política para cuatro revisiones",
      "steps": [
        "En el explorador, construye una tabla de tres filas: umbral, alertas, falsas alertas y omisiones. Conserva las mismas diez plantas.",
        "Entre los tres cortes, identifica el que produce como máximo cuatro alertas. Anota las plantas alertadas y cuál planta con plaga queda sin revisar.",
        "Escribe la regla elegida y una acción para casos pendientes, como programar otra inspección. Verifica en la sección 2 del cuaderno solo la fila correspondiente a 0,50."
      ],
      "check": "A 0,70 se alertan P1, P2, P3 y P5: cuatro revisiones, una falsa alerta y una omisión, P4. Cumplir capacidad no elimina el riesgo de dejar una plaga sin atender.",
      "transfer": "En soporte, fija capacidad por turno y el coste de retrasar solicitudes urgentes antes de elegir un umbral con datos de validación.",
      "stretch": "Prueba 0,40: detecta las cuatro plantas con plaga, pero emite seis alertas. Añade esa fila y explica por qué excede la capacidad elegida."
    },
    "prerequisite": "Las métricas explican las consecuencias de una regla. Ahora elegimos una regla de acción usando esas consecuencias y la capacidad de revisión.",
    "understanding": {
      "question": "¿Cambiar el umbral vuelve a entrenar el modelo?",
      "answer": "En este ejemplo, no: conserva sus puntuaciones y cambia la decisión. Elegimos el corte con validación y después medimos la política elegida en una prueba separada."
    }
  },
  "ml-clustering": {
    "objective": "Construir una segmentación exploratoria para organizar una revisión.",
    "relevance": "Comparar centros de acopio por sus indicadores ayuda a organizar una revisión cuando no existen etiquetas de grupo.",
    "concept": "Clustering significa agrupar registros por parecido cuando no tenemos una etiqueta de grupo para aprender. Primero se define qué describe cada registro y cómo se medirá su cercanía. DBSCAN reúne puntos conectados por vecindades con suficientes registros y deja otros sin grupo. El radio y el mínimo de vecinos son decisiones de configuración: cambiar esas reglas puede cambiar los grupos aunque la tabla sea idéntica. El resultado sirve para organizar una revisión; para explicar por qué un centro pertenece a un grupo hay que volver a sus indicadores.",
    "case": {
      "title": "Cercanía antes de poner nombres",
      "context": "Seis centros de acopio ficticios entregan dos porcentajes del mismo periodo. X es capacidad de almacenamiento utilizada: volumen ocupado / capacidad total × 100. Y es proporción de lotes pendientes de revisión: lotes pendientes / lotes recibidos × 100. Comparamos ambos indicadores con el mismo peso, una elección didáctica que habría que justificar en una operación. El radio 3 se mide en este plano de puntos porcentuales. Ninguna fila representa a una persona.",
      "columns": [
        "Centro",
        "X · Capacidad utilizada (%)",
        "Y · Lotes pendientes (%)"
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
        "Con radio 3, A = (20,20) y B = (22,20) están a √[(22−20)² + (20−20)²] = 2. Son vecinos. A y C también distan 2. El mínimo elegido es 2, contando al propio punto.",
        "A, B y C forman un grupo conectado. D = (70,60) y E = (72,60) distan 2 y forman otro. F = (5,90) no alcanza el mínimo de vecinos dentro del radio.",
        "La lista de revisión queda: grupo 1, A–B–C; grupo 2, D–E; F, revisión individual. El número del grupo es un identificador: no significa mejor o peor calidad."
      ],
      "conclusion": "Podemos organizar la exploración en dos perfiles y una revisión individual. Antes de decidir una acción para F se consultarían sus registros: estar sin grupo no demuestra una falla ni autoriza borrar datos.",
      "question": "¿Qué centros quedan conectados con radio 3 y mínimo dos puntos, y cuál queda aislado?"
    },
    "vocabulary": [
      {
        "term": "Aprendizaje no supervisado",
        "meaning": "Explora estructura sin recibir etiquetas correctas de grupo."
      },
      {
        "term": "Distancia",
        "meaning": "Número que mide separación entre registros según columnas y escalas elegidas."
      },
      {
        "term": "DBSCAN",
        "meaning": "Agrupa zonas conectadas por suficientes vecinos y permite casos sin grupo."
      },
      {
        "term": "Radio y mínimo",
        "meaning": "Configuraciones elegidas: cercanía máxima y cantidad mínima de vecinos, contando al propio punto."
      },
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
      },
      {
        "term": "K-Means",
        "meaning": "Agrupa alrededor de K centros y asigna cada punto al centro más cercano. K se elige antes del ajuste y responde a un criterio distinto al de DBSCAN."
      },
      {
        "term": "Hiperparámetro",
        "meaning": "Configuración elegida antes del ajuste, como radio y mínimo de puntos; se diferencia de un parámetro aprendido."
      },
      {
        "term": "Mean-Shift",
        "meaning": "Método que desplaza candidatos hacia zonas de mayor concentración de puntos. Su escala de vecindad influye en las agrupaciones."
      }
    ],
    "lab": {
      "title": "Agrupar sin etiquetas previas",
      "objective": "Separar grupos por densidad de registros que requieren revisión individual.",
      "instruction": "Deja el mínimo en 4. Compara radio 10 con radio 3 y anota grupos y puntos sin asignar.",
      "watch": "Las coordenadas de los 29 puntos no cambian. El color identifica un grupo; gris significa sin grupo con esa configuración.",
      "expected": "Radio 10: dos grupos y tres puntos sin asignar. Radio 3: cero grupos y 29 sin asignar. No cambiaron los datos, cambió la regla de cercanía.",
      "notebookGuide": "En Laboratorio ML explicado, ejecuta la sección 4. Usa otro conjunto de 123 puntos y escala antes de DBSCAN. La salida cuenta etiquetas y el gráfico ubica cada grupo; −1 significa no agrupado."
    },
    "takeaway": "Un grupo significa cercanía con las variables y parámetros elegidos. Antes de darle un significado operativo, revisa qué comparten sus registros.",
    "next": "PCA resumirá variables, sin formar grupos.",
    "explorer": "clusters",
    "build": {
      "title": "Mapa de grupos y casos por investigar",
      "steps": [
        "Reconstruye la distancia A–B y registra la lista A–B–C / D–E / F con radio 3 y mínimo 2. Escribe qué representa cada porcentaje.",
        "En el explorador compara sus 29 perfiles inventados con radio 10 y 3, manteniendo mínimo 4. Registra cuántos grupos y casos individuales aparecen; sus datos y configuración difieren de la tabla de seis centros.",
        "En la sección 4 del cuaderno, lee los grupos del conjunto de 123 puntos. Registra una tabla con configuración, conteos y una frase sobre qué se revisaría. Esos puntos ilustran DBSCAN; no son registros reales de centros de acopio."
      ],
      "check": "El explorador produce 2 grupos y 3 sin asignar frente a 0 y 29. El cuaderno tiene 123 puntos distintos; sus conteos no se sustituyen por los del explorador.",
      "transfer": "Para agrupar incidencias de equipos, define primero medidas y escalas. Comprueba el significado de cada grupo antes de asignarle una acción.",
      "stretch": "En tu copia, cambia únicamente eps en DBSCAN de la sección 4 y ejecuta de nuevo desde el principio en un entorno reiniciado. Así la semilla reproduce los mismos puntos y puedes comparar conteos sin cambiar también los datos."
    },
    "prerequisite": "Partimos de tablas preparadas, pero esta vez nadie nos registra la respuesta «grupo correcto». La pregunta es qué registros se parecen según las variables elegidas.",
    "understanding": {
      "question": "¿Por qué un grupo de DBSCAN no equivale a una clase real ni a una recomendación agrícola?",
      "answer": "El grupo surge de las variables, su escala y los parámetros elegidos. Hay que investigar qué comparten sus miembros y comprobar si esa agrupación ayuda en la operación. Un punto sin grupo tampoco es automáticamente un dato erróneo."
    },
    "outcome": {
      "title": "Lista de revisión",
      "result": "A–B–C juntos; D–E juntos; F individual",
      "reading": "Radio 3; mínimo 2; seis centros ficticios"
    },
    "essentialCount": 6
  },
  "ml-pca": {
    "objective": "Construir una vista resumida de registros y documentar la información que conserva.",
    "relevance": "Resumir medidas que cambian juntas facilita una gráfica; debemos saber qué información se pierde.",
    "concept": "Una tabla puede tener columnas que cambian juntas. PCA construye nuevas direcciones, llamadas componentes, para representar los mismos registros con menos números. Primero se resta la media para estudiar diferencias respecto al centro; también se decide si hace falta escalar. La primera componente busca conservar la mayor variación posible. «Conservar variación» significa mantener separaciones entre los registros, no acertar una etiqueta. Empezaremos con dos columnas y una dirección para ver qué se guarda y qué se pierde.",
    "case": {
      "title": "Dos medidas que se mueven juntas",
      "context": "Otros cuatro centros ficticios, G–J, tienen estos porcentajes inventados de capacidad utilizada y lotes pendientes. En ambas columnas la media es 50 %. Restarla produce las columnas centradas: 48−50 = −2 puntos porcentuales. Los valores negativos describen diferencias respecto a la media, no porcentajes de ocupación negativos. Elegimos columnas que cambian juntas para ver la cuenta completa.",
      "columns": [
        "Centro",
        "Ocupación (%)",
        "Pendientes (%)",
        "X centrado (puntos porcentuales)",
        "Y centrado (puntos porcentuales)"
      ],
      "rows": [
        [
          "G",
          "48",
          "48",
          "−2",
          "−2"
        ],
        [
          "H",
          "49",
          "49",
          "−1",
          "−1"
        ],
        [
          "I",
          "51",
          "51",
          "1",
          "1"
        ],
        [
          "J",
          "52",
          "52",
          "2",
          "2"
        ]
      ],
      "reasoning": [
        "Calcula el centro: (48+49+51+52)/4 = 50 en cada columna. Las diferencias son −2, −1, 1 y 2. Su suma de cuadrados es 4+1+1+4 = 10 por columna; entre ambas, 20. Para comparar proporciones no necesitamos dividir por el mismo denominador de varianza.",
        "Si conservamos solo la coordenada X, retenemos 10 de los 20 puntos porcentuales al cuadrado de la suma total: 10/20 = 50 %. Se descarta la coordenada Y; en esta tabla se puede reconstruir porque Y = X, pero esa coincidencia no ocurre en general.",
        "La dirección diagonal de 45° contiene todos estos puntos. Proyectarlos sobre ella no cambia su posición: conserva el 100 % de la variación en este ejemplo especialmente construido."
      ],
      "conclusion": "Una sola dirección resume estas dos columnas sin perder variación en los cuatro registros elegidos. Eso no demuestra que siempre baste una componente ni que podamos predecir calidad con 100 % de exactitud.",
      "question": "¿Qué variación conservamos al representar estos cuatro puntos sobre el eje X o sobre su diagonal?"
    },
    "vocabulary": [
      {
        "term": "Variable",
        "meaning": "Columna que describe un aspecto del registro."
      },
      {
        "term": "Centrado",
        "meaning": "Restar la media a una columna; un valor negativo queda por debajo de esa media."
      },
      {
        "term": "Componente",
        "meaning": "Nueva dirección que combina las columnas originales."
      },
      {
        "term": "Variación conservada",
        "meaning": "Parte de la dispersión original que mantiene la nueva representación; no es exactitud predictiva."
      },
      {
        "term": "Proyección",
        "meaning": "Representar cada punto sobre una dirección."
      },
      {
        "term": "Varianza",
        "meaning": "Medida de dispersión de los datos."
      },
      {
        "term": "Varianza explicada",
        "meaning": "Proporción de la dispersión total que conserva una componente; no es una métrica de clasificación."
      },
      {
        "term": "Cargas de una componente",
        "meaning": "Pesos con que las variables originales participan en una nueva dirección. Ayudan a interpretar el eje."
      },
      {
        "term": "Escala de variables",
        "meaning": "Si una columna tiene números mucho mayores, puede dominar PCA. Decidir si se estandariza forma parte del análisis."
      }
    ],
    "lab": {
      "title": "Elegir qué variación conservar",
      "objective": "Construir una vista reducida e indicar qué información descarta.",
      "instruction": "Compara direcciones 0°, 90° y 37°. Anota el porcentaje de varianza conservada para cada dirección.",
      "watch": "Verde = dirección; naranja = proyección; líneas finas = parte descartada. Las 22 observaciones originales permanecen fijas.",
      "expected": "0° conserva aproximadamente 63,1 %; 90°, 36,9 %; 37°, 98,0 %. Son porcentajes de varianza de estos 22 puntos, no porcentajes de aciertos.",
      "notebookGuide": "En PCA, ejecuta el bloque completo: genera 200 registros con X1, X2 y X3, los escala y dibuja PC1–PC2 y PC1. Lee los porcentajes calculados para esas vistas; no uses los del explorador."
    },
    "takeaway": "Al reducir variables, informa la variación conservada y mantén la relación de cada punto con su registro original.",
    "next": "Pasaremos de combinar variables a combinar predicciones de varios modelos.",
    "explorer": "pca",
    "build": {
      "title": "Vista de dos componentes",
      "steps": [
        "Completa a mano la resta de la media para G y comprueba las sumas 10, 10 y 20. Registra qué significan 50 % y 100 % en la tabla.",
        "En el explorador compara sus 22 puntos a 0°, 90° y 37°. Señala observación, proyección y parte descartada; no esperes los porcentajes de la tabla perfectamente diagonal.",
        "En el cuaderno PCA, lee los porcentajes de PC1 y de PC1+PC2. Registra una vista con su porcentaje conservado, su complemento hasta 100 % y una explicación de que los ejes combinan variables."
      ],
      "check": "El explorador da aproximadamente 63,1 %, 36,9 % y 98,0 %. La vista del cuaderno informa su propio porcentaje y su complemento hasta 100 %; no se interpreta como exactitud de clasificación.",
      "transfer": "Para explorar muchas medidas operativas, usa la vista resumida para encontrar patrones y vuelve a las columnas originales para explicarlos.",
      "stretch": "En una celda nueva de tu copia, crea pd.DataFrame(X_pca[:, :2], index=df.index, columns=['PC1', 'PC2']) y comprueba la correspondencia de una fila con su registro original."
    },
    "prerequisite": "Agrupar organiza filas. Ahora queremos resumir columnas de los mismos tipos de registros; esa es otra pregunta y exige otra forma de leer el resultado.",
    "understanding": {
      "question": "¿Conservar 90 % de varianza significa lograr 90 % de exactitud?",
      "answer": "No. El porcentaje describe dispersión de las entradas conservada por la proyección; no compara predicciones con respuestas reales. Incluso una dirección con poca variación podría ser útil para una tarea predictiva."
    },
    "outcome": {
      "title": "Lectura de representación",
      "result": "Eje X: 50 %; diagonal: 100 % en cuatro registros elegidos",
      "reading": "Porcentaje de variación, no porcentaje de aciertos"
    },
    "essentialCount": 6
  },
  "ml-ensambles": {
    "objective": "Seleccionar un modelo candidato mediante una comparación reproducible.",
    "relevance": "Combinar estimaciones puede compensar errores; midamos el resultado antes de confiar.",
    "concept": "Un modelo puede quedarse corto en un lote y excederse en otro. Un ensamble combina predicciones de varios modelos para intentar reducir esos errores. Empezaremos por un promedio que se puede calcular a mano. Después compararemos un árbol, un bosque y boosting con una referencia, siempre sobre los mismos casos reservados. Combinar ayuda si los errores se compensan; si todos se equivocan igual, el promedio conserva esa equivocación. La ventaja se comprueba con resultados, no con el nombre del algoritmo.",
    "case": {
      "title": "Dos errores pueden compensarse",
      "context": "Una cooperativa necesita estimar cuánto recogerá para preparar transporte. La tabla contiene tres fincas ficticias reservadas, su rendimiento observado y predicciones dadas de dos modelos imaginarios. Las cantidades están en toneladas por hectárea. Para hacer tangible la salida, supongamos además que cada finca tiene 10 ha: una estimación de 3 t/ha correspondería a 30 toneladas. Las predicciones no se reajustan usando estas respuestas.",
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
        "En la finca 1, A estima 2 y B estima 4 t/ha. Su promedio es (2+4)/2 = 3 t/ha, igual a lo observado. Para 10 ha, A daría 20 t, B 40 t y la combinación 30 t.",
        "En las tres fincas, los errores absolutos de A son 1, 1 y 0; los de B también. Cada MAE es (1+1+0)/3 = 0,67 t/ha aproximadamente. La combinación tiene errores 0, 0 y 0.",
        "En este ejemplo construido los errores se compensan exactamente. Con dos predicciones de 2 t/ha para una finca observada de 3, el promedio seguiría en 2: combinar no eliminaría el error compartido."
      ],
      "conclusion": "En estas tres fincas, el promedio predice 3, 4 y 5 t/ha y su MAE es cero. A y B se compensan aquí; si compartieran el mismo error, el promedio también lo conservaría.",
      "question": "¿Promediar A y B reduce el error en las tres fincas reservadas?",
      "stages": [
        {
          "title": "Un árbol",
          "detail": "Aprende preguntas sucesivas sobre las entradas y llega a una predicción. Puede cambiar mucho si cambian sus ejemplos."
        },
        {
          "title": "Bagging y bosque",
          "detail": "Entrena modelos con muestras de filas obtenidas con reemplazo y agrega salidas. El bosque añade selección aleatoria de características para diversificar sus árboles."
        },
        {
          "title": "Boosting",
          "detail": "Añade modelos en secuencia para reducir la pérdida conjunta. Cada nuevo modelo depende del estado de la combinación que ya se ha construido."
        },
        {
          "title": "Misma comprobación",
          "detail": "Las alternativas se eligen mediante validación y se comprueban con la misma reserva. El ejemplo perfecto de dos promedios no determina qué método ganará en el cuaderno."
        }
      ]
    },
    "vocabulary": [
      {
        "term": "Ensamble",
        "meaning": "Modelo que combina predicciones de otros modelos."
      },
      {
        "term": "Referencia",
        "meaning": "Regla sencilla contra la cual comprobamos si una candidata aporta una mejora."
      },
      {
        "term": "MAE",
        "meaning": "Promedio de errores absolutos: diferencias sin signo entre predicción y observado. Conserva las unidades de la respuesta."
      },
      {
        "term": "Caso reservado",
        "meaning": "Registro cuya respuesta no se usó para ajustar el modelo y que permite comprobarlo."
      },
      {
        "term": "Bagging",
        "meaning": "Aprender con muestras de filas con reemplazo y agregar predicciones."
      },
      {
        "term": "Boosting",
        "meaning": "Añadir modelos en secuencia para reducir la pérdida conjunta."
      },
      {
        "term": "Árbol de decisión",
        "meaning": "Modelo que aplica preguntas sucesivas sobre características hasta llegar a una predicción. Sus cortes se aprenden al entrenar."
      },
      {
        "term": "Bosque aleatorio",
        "meaning": "Ensamble de árboles entrenados con muestras aleatorias de filas y selecciones de características; combina sus salidas."
      },
      {
        "term": "RMSE",
        "meaning": "Raíz del promedio de errores al cuadrado. Tiene las unidades de la respuesta y da mayor peso relativo a errores grandes que el MAE."
      },
      {
        "term": "Diversidad de errores",
        "meaning": "Grado en que los modelos se equivocan en casos o direcciones distintos; combinar errores idénticos no los elimina."
      },
      {
        "term": "Stacking",
        "meaning": "Aprende un combinador a partir de predicciones de modelos base. Para entrenarlo se necesitan predicciones obtenidas sin ajustar cada modelo base con la respuesta de esa misma fila."
      }
    ],
    "lab": {
      "title": "Comparar modelos en la misma prueba",
      "objective": "Seleccionar un candidato con errores expresados en unidades útiles.",
      "instruction": "Cambia el selector de MAE a RMSE. Registra ambos errores de referencia, árbol, bosque y boosting.",
      "watch": "Una barra corta indica menor error. El gráfico contiene resultados guardados de las mismas 60 fincas; el selector no entrena modelos.",
      "expected": "Boosting tiene el menor error entre estos cuatro: MAE 0,301 y RMSE 0,411 t/ha. Eso describe esta prueba, sin establecer un ganador universal.",
      "notebookGuide": "Ejecuta Laboratorio ML explicado desde el comienzo hasta la sección 3. Reutiliza X_tr y X_te del bloque 1 para todos los modelos; tabla muestra MAE, RMSE y R² de tu ejecución."
    },
    "takeaway": "Compara modelo y combinación con la misma respuesta, los mismos casos reservados y la misma métrica.",
    "next": "Cuando los casos son semanas, también importa el orden de la prueba.",
    "explorer": "ensembles",
    "build": {
      "title": "Tabla comparativa de modelos",
      "steps": [
        "Calcula el promedio y el error de cada fila. Añade la estimación en toneladas para la finca 1 con las 10 ha supuestas; diferencia rendimiento de producción total.",
        "En el explorador registra MAE y RMSE de los cuatro modelos. Una barra representa un error de la misma prueba; cambiar el selector no vuelve a entrenarlos.",
        "Ejecuta la sección 3 de Laboratorio ML explicado. Registra su tabla de referencia y candidatas con unidades y justifica cuál seguirías evaluando. Conserva las cifras de esa ejecución, sin sustituirlas por el promedio perfecto del caso pequeño."
      ],
      "check": "La tabla tiene cuatro modelos, una única prueba y dos errores en t/ha. En los resultados guardados, boosting da 0,301 de MAE y 0,411 de RMSE; tu ejecución se documenta con sus propias cifras.",
      "transfer": "Para comparar estimadores de duración, usa las mismas tareas reservadas. MAE conserva unidades; RMSE da más peso a errores grandes.",
      "stretch": "En tu copia, inspecciona tabla[['modelo', 'MAE_t_ha', 'RMSE_t_ha']].sort_values('MAE_t_ha') y compara con ordenar por RMSE."
    },
    "prerequisite": "La pregunta sigue siendo estimar una cantidad y comprobar el error. La novedad es cómo obtener una sola predicción a partir de varios modelos.",
    "understanding": {
      "question": "¿Un bosque de muchos árboles garantiza superar a un árbol?",
      "answer": "No. La combinación puede reducir algunos errores, pero depende de los datos y de cuánto se parezcan las equivocaciones. Se decide mediante validación; la prueba final mide el resultado elegido."
    },
    "outcome": {
      "title": "Comparación de candidatas",
      "result": "A: MAE 0,67; B: MAE 0,67; promedio: MAE 0 t/ha, en esta tabla ficticia",
      "reading": "Para 10 ha de la finca 1: predicción combinada de 30 t"
    },
    "essentialCount": 8
  },
  "ml-series": {
    "objective": "Construir un pronóstico para planear compras y comprobarlo respetando el tiempo.",
    "relevance": "Planear compras exige anticipar ventas usando solo información disponible al decidir.",
    "concept": "Para planear compras de un producto perecedero necesitamos estimar ventas que aún no conocemos. Una serie temporal es una lista de observaciones con fecha y orden. Pronosticar usa únicamente la historia disponible al decidir. Primero fijamos una fecha de corte y un horizonte; después comparamos reglas sencillas y modelos sobre el mismo futuro reservado. Mostrar las respuestas futuras para evaluar no permite usarlas al construir el pronóstico.",
    "case": {
      "title": "Pronosticar dos semanas antes de verlas",
      "context": "Una comercializadora decide su planificación al cierre de la semana 4. Las cantidades inventadas son cajas de tomate vendidas por semana; cada caja tiene el mismo formato comercial en el ejercicio. Las semanas 5–6 están reservadas y se revelan después. Repetir dos semanas es una regla elegida para este caso, no una estacionalidad observada del mercado.",
      "columns": [
        "Semana",
        "Ventas (cajas)",
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
      "conclusion": "Para las semanas 5–6, repetir el ciclo de esta tabla da 100 y 110 cajas y MAE 0; repetir el último valor da 110 y 110, con MAE 5 cajas. Para convertir un pronóstico en compra aún harían falta existencias, plazos y consecuencias; el ejemplo no los calcula.",
      "question": "Al cerrar la semana 4, ¿qué regla estima mejor las ventas de las semanas 5 y 6?"
    },
    "vocabulary": [
      {
        "term": "Serie temporal",
        "meaning": "Observaciones ordenadas y fechadas de una misma variable."
      },
      {
        "term": "Corte",
        "meaning": "Fecha que separa lo conocido al decidir de lo reservado para comprobar."
      },
      {
        "term": "Horizonte",
        "meaning": "Periodo futuro al que se refiere un pronóstico."
      },
      {
        "term": "Referencia temporal",
        "meaning": "Regla sencilla, como repetir el último valor, que usa solo pasado disponible."
      },
      {
        "term": "Tendencia",
        "meaning": "Cambio sostenido del nivel de una serie a lo largo del tiempo."
      },
      {
        "term": "Estacionalidad",
        "meaning": "Patrón que tiende a repetirse con una periodicidad, como semanas de un ciclo; debe comprobarse con historia suficiente."
      },
      {
        "term": "Referencia ingenua",
        "meaning": "Regla sencilla como repetir el último valor observado; permite juzgar si un modelo aporta mejora."
      },
      {
        "term": "Evaluación temporal",
        "meaning": "Comparación que entrena con pasado y evalúa periodos posteriores, idealmente en varios cortes."
      }
    ],
    "lab": {
      "title": "Pronosticar desde una fecha de corte",
      "objective": "Comparar tres pronósticos hechos con el mismo pasado.",
      "instruction": "Selecciona Último valor, Repetir ciclo de 12 semanas y Tendencia. Anota el MAE de cada estrategia sobre las 24 semanas reservadas.",
      "watch": "El corte está después de la semana 60. Los pronósticos usan solo el pasado; las ventas negras del tramo futuro permiten comprobarlos.",
      "expected": "MAE aproximado: último valor 14,90; ciclo de 12 semanas 11,35; tendencia 7,65 unidades. Son 84 semanas simuladas fijas del explorador.",
      "notebookGuide": "En la sección 5 de Laboratorio ML explicado, conserva corte = 60 y periodo = 12. Su serie tiene otra variación simulada; lee sus MAE de la tabla, sin esperar las cifras del explorador."
    },
    "takeaway": "Registra fecha de corte, horizonte y error. Compara las reglas sobre las mismas fechas posteriores al corte.",
    "next": "Veremos decisiones donde una acción cambia la situación siguiente.",
    "explorer": "series",
    "build": {
      "title": "Pronóstico con fecha de corte",
      "steps": [
        "Escribe los dos pronósticos antes de mirar las semanas 5 y 6: último valor [110,110] y repetición [100,110]. Después revela las ventas y calcula ambos MAE en cajas.",
        "En el explorador identifica corte tras semana 60 y reserva de 24 semanas. Compara las tres reglas y anota sus MAE sobre exactamente esas 24 observaciones.",
        "En la sección 5 del cuaderno, registra la tabla de métodos y errores de su propia serie, con fecha de corte y horizonte. Explica por qué no se mezcla ni se reordena el futuro para ajustar el método."
      ],
      "check": "Las tres reglas usan las mismas 60 semanas pasadas y se comparan sobre las mismas 24 futuras. Los MAE del cuaderno corresponden a su propia serie, sin mezclar datos futuros al pronosticar.",
      "transfer": "Para anticipar carga semanal de soporte, conserva el orden temporal y expresa el error en cantidad de solicitudes.",
      "stretch": "En una celda nueva de tu copia, crea pd.DataFrame({'semana': t[corte:], 'observado': futuro, **pronosticos}) y comprueba que tiene 24 filas."
    },
    "prerequisite": "Ya comparamos predicciones con respuestas observadas. Ahora la pregunta añade una condición: qué información existía en la fecha en que había que decidir.",
    "understanding": {
      "question": "¿Por qué una buena predicción del pasado podría fallar como pronóstico?",
      "answer": "Podría haberse construido usando información que llegó después de la fecha de decisión. Un pronóstico válido usa solo historia disponible y se comprueba en un horizonte posterior al corte."
    },
    "outcome": {
      "title": "Ficha de pronóstico",
      "result": "Emisión: cierre de semana 4; horizonte: semanas 5 y 6",
      "reading": "Referencia: 110/110 cajas, MAE 5; ciclo elegido: 100/110, MAE 0"
    },
    "essentialCount": 6
  },
  "ml-refuerzo": {
    "objective": "Construir y probar una secuencia de acciones con recompensas acumuladas.",
    "relevance": "Una acción afecta pasos posteriores; no basta con evaluar cada movimiento por separado.",
    "concept": "Pronosticar responde qué podría ocurrir. Aprender por refuerzo responde qué acción elegir cuando actuar cambia la situación siguiente. Un agente recibe un estado, elige una acción y observa una consecuencia y una recompensa. Una política es la regla que propone acciones según el estado. Primero seguiremos un recorrido manual para entender el entorno; después veremos cómo Q-learning actualiza estimaciones con muchos recorridos. Mover la ficha manualmente no entrena al agente.",
    "case": {
      "title": "Llegar a la meta sin tocar el pozo",
      "context": "Representamos un recorrido de preparación de pedidos en una bodega mediante un tablero inventado de 5 × 5 casillas. Inicio: fila 0, columna 0; meta: 1,4. Es una representación didáctica, no un plano de una bodega real. Los puntos −1 por paso, +10 al llegar y −10 al caer al pozo son recompensas elegidas para el ejercicio: no dinero ni minutos. Las coordenadas empiezan en cero.",
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
        "Entrar en la meta registra +10 y termina el episodio. La suma sin descuento es −1 −1 −1 −1 +10 = 6.",
        "Una pared o borde impide avanzar, pero consume un paso y resta 1. Caer al pozo resta 10 y termina."
      ],
      "conclusion": "La ficha de esta ruta contiene cinco acciones, llegada a la meta y retorno 6 puntos. Una ruta manual permite comprobar las reglas; no demuestra que se haya aprendido una política ni que sea óptima para cualquier bodega.",
      "question": "¿A qué estado llega cada acción de la ruta y cuánto suman sus recompensas?"
    },
    "vocabulary": [
      {
        "term": "Estado",
        "meaning": "Situación que recibe el agente antes de elegir."
      },
      {
        "term": "Acción",
        "meaning": "Elección disponible; el entorno determina qué consecuencia produce."
      },
      {
        "term": "Recompensa",
        "meaning": "Número que el ejercicio registra después de actuar."
      },
      {
        "term": "Política",
        "meaning": "Regla para elegir acciones a partir del estado."
      },
      {
        "term": "Agente y entorno",
        "meaning": "El agente elige acciones; el entorno define qué sucede y qué recompensa recibe."
      },
      {
        "term": "Episodio",
        "meaning": "Recorrido desde el inicio hasta una condición de cierre, como meta o pozo."
      },
      {
        "term": "Retorno",
        "meaning": "Recompensas acumuladas de un recorrido; aquí se suman sin descuento."
      },
      {
        "term": "Valor Q",
        "meaning": "Estimación del retorno futuro de elegir una acción en un estado. En Q-learning se actualiza con experiencia y se aplica un factor de descuento a recompensas futuras; no es la suma ya observada de una ruta."
      },
      {
        "term": "Exploración y aprovechamiento",
        "meaning": "Explorar prueba alternativas para aprender; aprovechar elige lo que parece mejor con la información actual."
      }
    ],
    "lab": {
      "title": "Distinguir un recorrido de una política aprendida",
      "objective": "Registrar acciones y recompensas antes de examinar Q-learning.",
      "instruction": "Pulsa «Nuevo recorrido». Avanza cuatro veces a la derecha y una hacia abajo; después reinicia y prueba un movimiento hacia arriba desde el inicio.",
      "watch": "La ruta termina al alcanzar meta o pozo. Un movimiento contra el borde no cambia de casilla, pero cuenta como paso y resta 1.",
      "expected": "Derecha × 4 y abajo × 1 alcanza la meta en cinco pasos: −1 −1 −1 −1 +10 = 6. Subir desde el inicio deja el agente allí con un paso y recompensa −1. Ninguna ruta manual entrena una política.",
      "notebookGuide": "En Q-learning en GridWorld, ejecuta el bloque completo. Distingue entrenamiento de 2000 episodios, tabla Q y demostración final con política aprendida; trayectoria y total permiten comprobar esa demostración."
    },
    "takeaway": "Registra estados, acciones y recompensas para evaluar un recorrido. Aprender una política requiere actualizarla a partir de la experiencia.",
    "next": "Cerraremos distinguiendo una demostración correcta de evidencia suficiente para utilizarla.",
    "explorer": "grid",
    "build": {
      "title": "Registro de recorrido y política aprendida",
      "steps": [
        "Completa cinco filas: estado anterior, acción, estado siguiente y recompensa. Sigue derecha × 4 y abajo × 1, y suma −1−1−1−1+10 = 6.",
        "Reinicia y prueba subir desde el inicio. Registra que no se mueve, consume un paso y resta un punto; así separas acción intentada de cambio de estado.",
        "En Q-learning en GridWorld, ejecuta el entrenamiento y lee la demostración final. Registra su ruta y retorno, distinguiéndolos de la curva de muchos episodios y de tu ruta manual."
      ],
      "check": "La ruta manual tiene cinco pasos y recompensa 6; el borde añade un paso de −1 sin movimiento. La ruta aprendida se comprueba con su salida ejecutada; una sola ruta exitosa no prueba optimalidad.",
      "transfer": "Para estudiar rutas de una bodega simulada, define estados, acciones, obstáculos y recompensas antes de aprender una política.",
      "stretch": "En tu copia, repite la demostración con Q fija, sin ejecutar el bloque de entrenamiento otra vez, y compara llegada a meta, pasos y recompensa de varios episodios."
    },
    "prerequisite": "Una compra o un movimiento tiene consecuencias posteriores. Aquí aislamos esa idea en un entorno pequeño donde podemos ver y comprobar cada consecuencia.",
    "understanding": {
      "question": "¿Qué falta para que una ruta elegida manualmente sea aprendizaje por refuerzo?",
      "answer": "Que un agente use experiencias de estados, acciones y recompensas para actualizar su política o valores. Moverlo manualmente solo permite explorar el entorno y sus reglas."
    },
    "outcome": {
      "title": "Registro de interacción",
      "result": "Ruta manual: derecha, derecha, derecha, derecha, abajo",
      "reading": "Cinco pasos; meta alcanzada; retorno 6 puntos, sin entrenamiento manual"
    },
    "essentialCount": 8
  },
  "ml-integracion": {
    "objective": "Construir un prototipo de predicción con una decisión de uso documentada.",
    "relevance": "Antes de cambiar una operación, expliquemos la evidencia y qué falta comprobar.",
    "concept": "Una propuesta de ML debe poder explicarse de principio a fin: quién necesita decidir, qué información existe al hacerlo, qué predice el modelo y cómo se comprobó. Para cerrar la asignatura no añadimos un algoritmo: unimos esas piezas en una ficha de prototipo. Compararemos una candidata con una regla sencilla en los mismos registros y diremos qué respalda la diferencia. Un error menor en tres casos no demuestra por sí solo una mejora económica ni desempeño en otra temporada.",
    "case": {
      "title": "Una mejora pequeña con alcance concreto",
      "context": "La cooperativa revisa una candidata para planear recogida. En tres fincas reservadas y ficticias ya conocemos el rendimiento en t/ha. La referencia predice siempre 4 t/ha y las predicciones candidatas están dadas. Las reglas se eligieron antes de mirar esta prueba. Con una superficie supuesta de 10 ha por finca, podemos traducir cada estimación a toneladas sin cambiar la comparación de rendimiento.",
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
        "Referencia: |4−3| = 1, |4−4| = 0 y |4−5| = 1 t/ha. Su MAE es (1+0+1)/3 = 0,67 t/ha aproximadamente.",
        "Candidata: |3,2−3| = 0,2; |3,8−4| = 0,2; |5,1−5| = 0,1. Su MAE es 0,5/3 = 0,17 t/ha aproximadamente.",
        "En la finca A de 10 ha, la referencia estimaría 40 t y la candidata 32 t; se observaron 30 t. Esa comparación concreta ayuda a planear una prueba de recogida, pero no calcula costes ni decide capacidad de vehículos."
      ],
      "conclusion": "Podemos explicar esta mejora, sin afirmar una recomendación de fertilización ni beneficio económico real.",
      "question": "¿La regla candidata reduce el error frente a predecir siempre 4 t/ha en estas tres fincas?"
    },
    "vocabulary": [
      {
        "term": "Pregunta operativa",
        "meaning": "Decisión concreta que se quiere apoyar y momento en que debe tomarse."
      },
      {
        "term": "Referencia",
        "meaning": "Solución sencilla que permite juzgar si una candidata mejora algo."
      },
      {
        "term": "Evidencia",
        "meaning": "Datos y resultados que permiten comprobar una afirmación concreta."
      },
      {
        "term": "Límite de uso",
        "meaning": "Condición o tarea para la que todavía no se comprobó la propuesta."
      },
      {
        "term": "Generalización",
        "meaning": "Desempeño en casos nuevos del contexto de uso."
      },
      {
        "term": "Sobreajuste",
        "meaning": "El modelo se adapta demasiado a particularidades del entrenamiento y funciona peor en casos nuevos."
      },
      {
        "term": "Subajuste",
        "meaning": "La regla no captura suficientemente la relación relevante, incluso en entrenamiento."
      },
      {
        "term": "Reproducibilidad",
        "meaning": "Poder reconstruir el procedimiento registrando datos, separación, preparación, configuración y cálculo."
      },
      {
        "term": "Cambio de distribución",
        "meaning": "Las condiciones o frecuencias del uso difieren de las de entrenamiento; puede deteriorar el desempeño."
      }
    ],
    "lab": {
      "title": "Unir datos, predicción y evidencia",
      "objective": "Construir una salida reproducible para apoyar una decisión operativa.",
      "instruction": "En la tabla del ejemplo resuelto, calcula el error absoluto de cada predicción y promedia las tres filas para cada regla.",
      "watch": "Referencia y candidata se comparan con los mismos tres observados. El error mide la diferencia de rendimiento, no un beneficio económico demostrado.",
      "expected": "Referencia: 2/3 ≈ 0,67 t/ha; candidata: 0,5/3 ≈ 0,17 t/ha. La candidata mejora en esos tres casos inventados; falta comprobar otros periodos y condiciones.",
      "notebookGuide": "En tu copia de Laboratorio ML explicado, ejecuta 1.1–1.6 en orden. Usa resultados para comparar los dos MAE y comparacion para inspeccionar predicciones y errores de fincas reservadas."
    },
    "takeaway": "Reúne pregunta, datos, referencia, error y decisión de uso en un resultado que puedas volver a ejecutar.",
    "next": "En Deep Learning conservaremos este recorrido, con más capas y parámetros.",
    "explorer": null,
    "build": {
      "title": "Prototipo ML: de la tabla a una decisión",
      "steps": [
        "Registra una ficha con pregunta, entradas disponibles, respuesta buscada y uso propuesto: estimar rendimiento para planear recogida, no recomendar una dosis.",
        "Completa la comparación de la tabla: errores por finca, MAE de referencia y candidata y lectura en t/ha. Traduce A a toneladas usando las 10 ha declaradas.",
        "Repite la ficha con resultados y comparacion de tu cuaderno. Indica de dónde salen los datos, qué filas quedaron fuera del ajuste y qué periodo o condición falta comprobar antes del uso."
      ],
      "check": "El caso pequeño da MAE 0,67 frente a 0,17 t/ha. Tu prototipo conserva sus propias cifras, usa una prueba reservada y puede repetirse desde la copia personal sin sustituir la respuesta por la predicción.",
      "transfer": "Para estimar duración de solicitudes, redefine fila, entradas y respuesta. Mantén preparación aprendida en entrenamiento, referencia y evaluación reservada.",
      "stretch": "En una celda nueva de tu copia, usa X_te.head(1), lineal.predict(X_te.head(1)) y y_te.loc[X_te.head(1).index] para inspeccionar entrada, predicción y observado de la misma fila reservada."
    },
    "prerequisite": "Recuperamos la pregunta operativa y las comparaciones ya estudiadas. Lo que cierra el trabajo es una explicación verificable, no otro algoritmo.",
    "understanding": {
      "question": "¿Qué evidencia necesitamos además de una métrica favorable?",
      "answer": "Casos representativos del uso esperado, separación correcta de datos, comparación justa con una referencia, revisión de errores y condiciones para supervisar o detener el uso. Tres casos ilustrativos no bastan."
    },
    "outcome": {
      "title": "Ficha de prototipo",
      "result": "Referencia: MAE ≈ 0,67; candidata: MAE ≈ 0,17 t/ha",
      "reading": "Finca A, 10 ha: observado 30 t; referencia 40 t; candidata 32 t"
    },
    "essentialCount": 4
  },
  "dl-redes": {
    "objective": "Construir el cálculo de una neurona y rastrear cómo sus entradas producen una salida.",
    "concept": "Una red recibe números, los transforma y produce una salida. Para entender ese recorrido empezaremos por una neurona, una unidad de cálculo, antes de hablar de muchas capas. Cada entrada se multiplica por un peso; los productos se suman junto con un sesgo; una función de activación transforma la suma. En el ejemplo todos esos valores están dados para que podamos comprobarlos. Una red aprende cuando un procedimiento ajusta sus parámetros usando ejemplos; esta primera cuenta solo muestra cómo se calcula una salida.",
    "relevance": "Permite explicar el cálculo antes de confiar en una etiqueta o una puntuación.",
    "case": {
      "title": "Dos señales y un ajuste",
      "context": "Desarmamos una unidad de cálculo que podría formar parte de una red para imágenes. Sus entradas x₁ = 2 y x₂ = 1 son dos señales numéricas abstractas, no cantidades de frutos ni porcentajes de enfermedad. Los pesos w₁ = 0,5 y w₂ = −1 y el sesgo b = 0,5 se fijan para seguir la operación. Aplicamos ReLU, que conserva la suma si es positiva y da 0 si es negativa.",
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
        "term": "Entrada",
        "meaning": "Número recibido por la unidad; puede ser un dato preparado o la salida de una capa anterior."
      },
      {
        "term": "Peso",
        "meaning": "Factor que multiplica una entrada y regula su aporte."
      },
      {
        "term": "Sesgo",
        "meaning": "Valor que se suma a los productos antes de la activación."
      },
      {
        "term": "Activación",
        "meaning": "Función que transforma la suma y produce la salida de la unidad."
      },
      {
        "term": "Representación",
        "meaning": "Descripción numérica de los datos que otra capa puede transformar. No es necesariamente interpretable como una propiedad física."
      },
      {
        "term": "Capa oculta",
        "meaning": "Transformación intermedia entre entrada y salida; oculta significa que su salida no es la respuesta objetivo observada."
      },
      {
        "term": "Arquitectura",
        "meaning": "Organización de capas, conexiones y tamaños. Se elige como configuración; los pesos se ajustan durante el entrenamiento."
      },
      {
        "term": "Inferencia",
        "meaning": "Cálculo de una salida con los parámetros actuales, sin actualizarlos."
      }
    ],
    "explorer": "neuron",
    "takeaway": "Sigue entradas → productos por pesos → suma con sesgo → activación. Ese recorrido permite comprobar una neurona antes de interpretar una red.",
    "next": "Compararemos activaciones para la misma señal.",
    "lab": {
      "title": "Comprobar una neurona",
      "objective": "Calcular la salida y verificar qué cambia al mover un solo parámetro.",
      "instruction": "Pulsa «Restablecer ejemplo». Anota suma y salida; cambia solo «Sesgo b» de 0,5 a −0,5 y vuelve a anotarlas.",
      "watch": "Los productos x × w permanecen en 1 y −1; cambia el sesgo que se añade antes de ReLU.",
      "expected": "Con sesgo 0,5: z = 0,5 y salida = 0,5. Con sesgo −0,5: z = −0,5 y salida = 0. Son parámetros elegidos, sin entrenamiento.",
      "notebookGuide": "En tu copia de Laboratorio DL, ejecuta las dos celdas de preparación y la primera celda de código del bloque 09. Allí se fijan entradas [0,6; 0,2], pesos [2; −1] y sesgo −0,5; se aplica sigmoide, no ReLU."
    },
    "build": {
      "title": "Calculadora de una neurona",
      "steps": [
        "Dibuja dos entradas y anota debajo sus productos: 2 × 0,5 = 1 y 1 × (−1) = −1. Suma el sesgo 0,5 y aplica ReLU; registra entrada, suma y salida.",
        "En el explorador cambia solo el sesgo a −0,5. Explica por qué los productos siguen iguales, la suma cambia y la salida pasa a 0.",
        "En el bloque 09 de Laboratorio DL, sigue la neurona con sus propios valores y sigmoide. Registra su cuenta separada: usar otra función y otras entradas produce otra salida; no es una contradicción del ejemplo web."
      ],
      "check": "Cada salida se reproduce con sus entradas, pesos, sesgo y activación. Mover el sesgo a mano no se presenta como entrenamiento.",
      "transfer": "Usa el mismo registro para inspeccionar una neurona de una red pequeña: entrada, productos, sesgo, suma y transformación.",
      "stretch": "Crea una función con esos cinco elementos y verifica los dos casos de la web y los dos del cuaderno."
    },
    "prerequisite": "Retomamos la idea de modelo como regla que transforma entradas. Ahora vamos a abrir esa regla y seguir una unidad de cálculo paso a paso.",
    "understanding": {
      "question": "¿Qué diferencia una neurona, una capa y una red?",
      "answer": "Una neurona calcula una transformación; una capa reúne transformaciones que producen una representación; una red conecta capas. El entrenamiento cambia pesos y sesgos, mientras la inferencia usa los valores ya fijados."
    },
    "outcome": {
      "title": "Rastro de una neurona",
      "result": "Productos: 1 y −1; suma con sesgo: 0,5; ReLU: 0,5",
      "reading": "Con sesgo −0,5: suma −0,5 y salida 0; ningún peso fue aprendido"
    },
    "essentialCount": 4
  },
  "dl-activaciones": {
    "objective": "Configurar una transformación de señales y comprobar su rango de salida.",
    "concept": "La activación recibe un número, normalmente la suma calculada por una neurona, y devuelve otro. ReLU deja pasar lo positivo y convierte lo negativo en 0. La sigmoide comprime valores entre 0 y 1; tanh entre −1 y 1. Sus curvas ayudan a leer qué señal continúa hacia la siguiente capa. Compararemos la misma entrada para aislar la diferencia entre funciones. Esta transformación no aprende pesos por sí sola, y el rango de una salida no basta para declarar una probabilidad fiable.",
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
        "term": "Señal",
        "meaning": "Número que recibe una función de activación."
      },
      {
        "term": "ReLU",
        "meaning": "Devuelve el mayor entre cero y la entrada."
      },
      {
        "term": "Sigmoide",
        "meaning": "Comprime la entrada a un número entre 0 y 1."
      },
      {
        "term": "tanh",
        "meaning": "Comprime la entrada a un número entre −1 y 1, conservando su signo."
      },
      {
        "term": "No lineal",
        "meaning": "Transformación que no puede representarse mediante una sola recta en todo su dominio."
      },
      {
        "term": "Rango de salida",
        "meaning": "Valores que puede devolver una función: ReLU ≥ 0; para entradas finitas, sigmoide está estrictamente entre 0 y 1 y tanh entre −1 y 1. El redondeo puede mostrar un extremo."
      },
      {
        "term": "Entrada z",
        "meaning": "Suma ponderada más sesgo antes de la activación; no es necesariamente una medida original ni una probabilidad."
      },
      {
        "term": "Capa de salida",
        "meaning": "Última transformación. Su tamaño y activación deben corresponder a la cantidad o categorías que se quieren predecir."
      }
    ],
    "explorer": "activation",
    "takeaway": "Compara activaciones manteniendo la entrada fija. Verifica su rango antes de interpretar la salida como puntuación o conectarla a otra operación.",
    "next": "Veremos cómo se ajustan parámetros utilizando el error.",
    "lab": {
      "title": "La misma entrada, tres salidas",
      "objective": "Construir una tabla que distinga el rango y el signo de cada activación.",
      "instruction": "Fija «Señal de entrada» en −2. Cambia «Función» entre ReLU, Sigmoid y tanh; registra las tres salidas. Repite con 0 y 2.",
      "watch": "El punto muestra entrada en el eje X y salida en el eje Y. Cambiar función conserva la entrada.",
      "expected": "Para −2: 0; 0,119; −0,964. Para 0: 0; 0,5; 0. Para 2: 2; 0,881; 0,964, en el orden ReLU, sigmoid y tanh.",
      "notebookGuide": "En la primera celda de código del bloque 09 de Laboratorio DL, ejecuta las curvas de activación. En la celda siguiente, localiza ReLU en las capas ocultas y la sigmoide que se aplica al evaluar la salida."
    },
    "build": {
      "title": "Tabla de pruebas de activación",
      "steps": [
        "Para entrada −2, calcula ReLU como el mayor entre −2 y 0. Después lee las otras dos salidas en la tabla, conservando la entrada.",
        "En el explorador repite con 0 y 2. Registra tres filas con entrada y salidas de las tres funciones; marca cuáles pueden ser negativas o superar 1.",
        "En el bloque 09 del cuaderno, localiza una activación dentro de la red y la transformación de la salida al evaluar. Explica para qué lugar del recorrido se está usando cada una, sin interpretar cualquier número entre 0 y 1 como probabilidad calibrada."
      ],
      "check": "Las nueve salidas coinciden con el explorador al redondear. ReLU(2) = 2, no 200 %; sigmoide(0) = 0,5, sin demostrar una probabilidad calibrada.",
      "transfer": "Antes de usar una salida en una regla de alerta, verifica su rango y significado; una activación no es una métrica de aciertos.",
      "stretch": "Reproduce las nueve salidas con las funciones de PyTorch y compara con tu tabla usando los valores sin redondear."
    },
    "prerequisite": "La neurona ya produjo una suma. Falta comprender la regla que transforma esa suma antes de continuar el recorrido.",
    "understanding": {
      "question": "¿Por qué apilar capas sin activaciones no lineales puede aportar menos de lo esperado?",
      "answer": "Una sucesión de transformaciones afines sigue siendo una transformación afín. Las activaciones no lineales permiten representar otros patrones. Eso aumenta capacidad, pero no garantiza buen desempeño sin datos y entrenamiento adecuados."
    },
    "outcome": {
      "title": "Tabla de transformaciones",
      "result": "Con entrada −2: ReLU 0; sigmoide ≈ 0,119; tanh ≈ −0,964",
      "reading": "Misma entrada, tres funciones; sin entrenamiento de parámetros"
    },
    "essentialCount": 4
  },
  "dl-entrenamiento": {
    "objective": "Ajustar un parámetro y diagnosticar un paso que empeora el resultado.",
    "concept": "Entrenar repite cuatro acciones: producir una salida, compararla con una respuesta conocida, calcular cómo cambia la pérdida y actualizar parámetros. La pérdida es un número que mide el desacuerdo según una regla elegida. El gradiente indica la dirección y sensibilidad de ese número; la tasa de aprendizaje regula el tamaño del ajuste. Usaremos un solo parámetro para comprobar la operación completa. En una red hay muchos parámetros y se aplica el mismo ciclo, con una comprobación posterior sobre ejemplos que no participaron en el ajuste. En una red, la retropropagación calcula gradientes a través de las capas; el optimizador utiliza esos gradientes para actualizar. Son funciones distintas del ciclo.",
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
        "term": "Parámetro",
        "meaning": "Valor ajustable del modelo; en la cuenta seguimos solo uno."
      },
      {
        "term": "Pérdida",
        "meaning": "Número que mide el desacuerdo según una regla elegida."
      },
      {
        "term": "Gradiente",
        "meaning": "Indica cómo cambia la pérdida al cambiar el parámetro; aquí es una pendiente."
      },
      {
        "term": "Tasa de aprendizaje",
        "meaning": "Factor elegido que multiplica el gradiente al realizar el ajuste."
      },
      {
        "term": "Retropropagación",
        "meaning": "Procedimiento que calcula la influencia de cada parámetro sobre la pérdida propagando derivadas por las capas."
      },
      {
        "term": "Optimizador",
        "meaning": "Regla que utiliza gradientes para actualizar parámetros, como descenso por gradiente."
      },
      {
        "term": "Lote o batch",
        "meaning": "Subconjunto de ejemplos procesado para calcular una actualización."
      },
      {
        "term": "Época",
        "meaning": "Un recorrido completo por los ejemplos de entrenamiento. No equivale a una sola actualización cuando hay varios lotes."
      },
      {
        "term": "Validación",
        "meaning": "Datos separados para observar generalización y elegir configuraciones durante el desarrollo."
      },
      {
        "term": "Regularización y parada temprana",
        "meaning": "Estrategias para limitar el sobreajuste: restringir el ajuste o detenerlo según validación. No garantizan mejora por sí solas."
      }
    ],
    "explorer": "training",
    "takeaway": "Comprueba parámetro anterior, gradiente, tasa, parámetro nuevo y pérdida. Evalúa por separado el funcionamiento con casos reservados.",
    "next": "Pasaremos a preguntas sobre imágenes.",
    "lab": {
      "title": "Elegir un paso que reduzca la pérdida",
      "objective": "Comparar dos actualizaciones desde el mismo estado inicial.",
      "instruction": "Pulsa «Reiniciar», fija «Tasa de aprendizaje» en 0,10 y pulsa «Dar un paso». Registra el resultado. Reinicia y repite con 1,10.",
      "watch": "Lee la cuenta de actualización y la pérdida. En ambas pruebas el parámetro empieza en −2 y la pérdida en 25.",
      "expected": "El gradiente inicial es −10. Con tasa 0,10: parámetro −1 y pérdida 16. Con 1,10: parámetro 9 y pérdida 36; un paso mayor empeora esta cuenta.",
      "notebookGuide": "En Laboratorio DL, el bloque 01 contiene la celda «Pérdida L(w) = (w−3)^2»: compara TASA = 0.10 y 1.10 ejecutando la celda desde el inicio. El bloque 09 entrena otra red y usa otra pérdida; sus cifras no son las de este ejemplo."
    },
    "build": {
      "title": "Registro de ajustes y pérdidas",
      "steps": [
        "Escribe el estado inicial: parámetro −2, objetivo 3 y pérdida 25. Calcula el gradiente inicial 2 × (−2−3) = −10.",
        "Con tasa 0,10, reproduce −2−0,10×(−10) = −1 y pérdida 16. Reinicia; con 1,10 obtén 9 y pérdida 36. Registra dos filas que partan del mismo inicio.",
        "Ejecuta la pérdida sencilla del bloque 01 del cuaderno y después observa el entrenamiento de la red en el bloque 09. Distingue qué datos usa el ajuste de cuáles sirven para comprobarla; sus pérdidas no se comparan numéricamente con 25, 16 y 36."
      ],
      "check": "La comparación de un paso reproduce −1/16 y 9/36. En la red, una curva descendente describe entrenamiento; la exactitud impresa usa los 80 casos reservados, sin prometer un porcentaje.",
      "transfer": "Al probar configuraciones de una red, conserva el inicio y registra pérdida y evaluación por separado. Si eliges mirando una reserva, úsala como validación y conserva otra prueba final.",
      "stretch": "En una copia, compara dos tasas del bloque 09 conservando semilla, separación y épocas; registra los resultados sin garantizar qué tasa ganará."
    },
    "prerequisite": "Ya sabemos calcular una salida. Ahora necesitamos explicar de dónde podría salir un cambio de pesos, en lugar de ajustarlos manualmente.",
    "understanding": {
      "question": "Si baja la pérdida de entrenamiento, ¿ya sabemos que la red generaliza?",
      "answer": "No. Hay que observar datos separados. Si la pérdida de entrenamiento baja y la de validación empieza a subir, puede haber sobreajuste. La prueba final permanece aparte de las decisiones de desarrollo."
    },
    "outcome": {
      "title": "Comparación de un paso",
      "result": "Tasa 0,10: parámetro −1 y pérdida 16; tasa 1,10: parámetro 9 y pérdida 36",
      "reading": "Ambas desde −2 y pérdida 25; el paso grande empeora esta cuenta"
    },
    "essentialCount": 10
  },
  "dl-vision": {
    "objective": "Definir la salida visual que necesita una operación y probar una detección.",
    "concept": "Antes de elegir una red para una imagen hay que precisar qué necesita recibir quien toma la decisión. Clasificar registra una etiqueta de toda la imagen. Detectar registra propuestas de objetos con categoría y ubicación, a menudo mediante cajas. Segmentar delimita regiones de píxeles. Son preguntas diferentes, no tres grados de exactitud. En la misma foto de tres frutos compararemos esas salidas y las referencias que harían falta para comprobar cada una.",
    "relevance": "Evita pedir posiciones o contornos a una herramienta que solamente clasifica.",
    "case": {
      "title": "Una foto de tres frutos, tres necesidades",
      "context": "Un centro de recepción recibe una foto ilustrada con tres frutos. El responsable puede querer seleccionar la foto para revisión, localizar cada fruto o examinar su región visible. Conservamos exactamente la misma escena y cambiamos la pregunta. Las salidas dibujadas permiten entender la tarea; no provienen de una red entrenada.",
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
        "term": "Píxel",
        "meaning": "Una celda de la imagen representada con números."
      },
      {
        "term": "Clasificación de imagen",
        "meaning": "Una etiqueta para la imagen completa."
      },
      {
        "term": "Detección",
        "meaning": "Propuestas de objetos con categoría y ubicación."
      },
      {
        "term": "Segmentación",
        "meaning": "Asignación de regiones o categorías a píxeles."
      },
      {
        "term": "Caja",
        "meaning": "Rectángulo que aproxima la ubicación de un objeto."
      },
      {
        "term": "Máscara",
        "meaning": "Píxeles asignados a un objeto o categoría."
      },
      {
        "term": "Canal",
        "meaning": "Una componente del valor de cada píxel; una imagen RGB tiene rojo, verde y azul."
      },
      {
        "term": "Tensor",
        "meaning": "Arreglo de números con varias dimensiones. Una imagen puede organizarse por alto, ancho y canales; un lote añade una dimensión de ejemplos."
      },
      {
        "term": "Anotación",
        "meaning": "Respuesta de referencia preparada para entrenar o evaluar: etiqueta, caja o máscara según la tarea."
      },
      {
        "term": "Normalización de imagen",
        "meaning": "Transformación de intensidades según la entrada esperada por el modelo; dividir entre 255 es una opción común para imágenes de 8 bits, no una regla universal."
      },
      {
        "term": "Segmentación semántica y de instancias",
        "meaning": "La semántica asigna categorías por píxel; la de instancias distingue además objetos individuales de una misma categoría."
      }
    ],
    "explorer": "vision",
    "takeaway": "Pide una salida acorde con el trabajo: etiqueta para clasificar, cajas para localizar y máscaras para delimitar píxeles.",
    "next": "Examinaremos una operación que ayuda a construir representaciones de píxeles.",
    "lab": {
      "title": "Elegir la salida que necesita la tarea",
      "objective": "Distinguir una etiqueta global, cajas por objeto y máscaras de píxeles.",
      "instruction": "En «Pregunta», recorre Clasificación, Detección y Segmentación. Para cada opción, anota qué información nueva aparece sobre la misma escena.",
      "watch": "Una etiqueta describe la imagen; las cajas localizan objetos; las máscaras delimitan regiones. La escena conserva los mismos tres frutos.",
      "expected": "Obtienes una etiqueta, tres cajas o tres regiones coloreadas. Son salidas dibujadas para comparar tareas, no predicciones de una red.",
      "notebookGuide": "En tu copia de YOLO, ejecuta las secciones 2–6 en orden: preparación, pesos, foto, inferencia y tabla. Relaciona una caja de la foto con una fila; este cuaderno ejecuta detección, no segmentación."
    },
    "build": {
      "title": "De una foto a una salida definida",
      "steps": [
        "Completa una ficha con necesidad y salida: seleccionar foto → etiqueta; localizar tres frutos → cajas; delimitar regiones visibles → máscaras.",
        "Recorre las tres opciones del explorador y relaciona cada marca con esa ficha. Explica por qué una etiqueta no localiza frutos y una caja incluye algo de fondo.",
        "En YOLO, secciones 2–6, ejecuta la detección y vincula una caja con su fila de registro. Registra categoría, puntuación y ubicación, indicando que este cuaderno no ejecuta segmentación."
      ],
      "check": "Una fila se puede rastrear a su caja y sus dimensiones. No se atribuyen máscaras al detector ni se interpreta una tabla vacía como ausencia confirmada de objetos.",
      "transfer": "Para revisar equipos en una foto de bodega, define las categorías requeridas y la salida antes de decidir si necesitas clasificación, detección o segmentación.",
      "stretch": "Usa el recorte de la sección 9 de YOLO para comprobar las coordenadas de una caja sin añadir un segundo clasificador."
    },
    "prerequisite": "Una red transforma datos, pero su salida debe corresponder a una tarea. Empezaremos por especificar qué información necesita la inspección.",
    "understanding": {
      "question": "¿Qué etiquetas hay que preparar para clasificar, detectar y segmentar?",
      "answer": "Para clasificación, una categoría por imagen en la tarea descrita; para detección, categoría y caja por objeto; para segmentación, categorías o identidades por píxel. Son anotaciones diferentes y requieren evaluaciones acordes."
    },
    "outcome": {
      "title": "Especificación de salida",
      "result": "Seleccionar: una etiqueta; localizar: tres cajas; delimitar: tres regiones",
      "reading": "La escena es fija y sus marcas son ilustrativas, no inferencias de una red"
    },
    "essentialCount": 4
  },
  "dl-cnn": {
    "objective": "Construir un mapa de filtro y distinguir cambios de imagen de cambios de pesos.",
    "concept": "Una imagen es una tabla de números. Una CNN aplica pequeñas tablas de pesos, llamadas filtros, sobre zonas de la imagen. En cada posición multiplica píxeles por pesos y suma; las respuestas forman otra tabla, el mapa. Usar el mismo filtro en todas las posiciones permite reconocer una señal local en lugares distintos. Primero resolveremos una ventana de nueve píxeles. En una red entrenada los filtros se aprenden; el filtro de este ejercicio está dado para entender la operación.",
    "relevance": "Ayuda a distinguir píxeles, pesos y resultados, antes de interpretar lo que reconoce una red.",
    "case": {
      "title": "Encontrar un cambio entre filas",
      "context": "La imagen inventada tiene 5 × 5 píxeles: dos filas de ceros y tres de unos (0 oscuro; 1 claro). La primera ventana de 3 × 3 contiene las filas de esta tabla. Usamos un filtro fijo para detectar el cambio. En este cálculo el paso es 1 y no añadimos relleno; por eso la salida tiene 3 × 3 celdas.",
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
        "meaning": "Zona pequeña de la imagen que se procesa en una posición."
      },
      {
        "term": "Filtro",
        "meaning": "Tabla de pesos que se aplica sobre cada ventana."
      },
      {
        "term": "Mapa de respuestas",
        "meaning": "Tabla producida al recorrer la imagen con el filtro."
      },
      {
        "term": "CNN",
        "meaning": "Red que usa operaciones locales con pesos compartidos y aprende representaciones durante entrenamiento."
      },
      {
        "term": "Convolución en una CNN",
        "meaning": "Operación que reutiliza un filtro en distintas posiciones y forma un mapa de respuestas; las bibliotecas suelen implementarla sin invertir el filtro."
      },
      {
        "term": "Mapa de características",
        "meaning": "Tabla de respuestas producida por un filtro al recorrer la entrada. Cada celda corresponde a una región."
      },
      {
        "term": "Stride o paso",
        "meaning": "Cuántas posiciones se desplaza el filtro entre cálculos; influye en el tamaño del mapa."
      },
      {
        "term": "Padding o relleno",
        "meaning": "Valores añadidos al borde para controlar el tamaño de salida y el tratamiento de los límites."
      },
      {
        "term": "Pooling",
        "meaning": "Resumen de regiones del mapa, por ejemplo mediante su máximo o promedio. Reduce resolución; no es sinónimo de convolución."
      }
    ],
    "explorer": "convolution",
    "takeaway": "Cada celda del mapa sale de una ventana, los mismos pesos y una suma de productos. Un filtro fijo permite verificar esa operación.",
    "next": "Veremos cómo reutilizar filtros y otros parámetros aprendidos previamente.",
    "lab": {
      "title": "Construir un mapa a partir de ventanas",
      "objective": "Reproducir las nueve respuestas de un filtro fijo.",
      "instruction": "Selecciona «Filtro: Horizontal» y «Columna de la ventana: 1». Recorre las filas 1, 2 y 3; registra sus sumas. Vuelve a fila 1 y elige Promedio.",
      "watch": "La ventana sombreada señala los nueve píxeles que producen la celda marcada del mapa.",
      "expected": "Horizontal: 3, 3 y 0 para las tres filas. Cada columna repite esos valores. Promedio en fila 1, columna 1: 1/3 ≈ 0,333.",
      "notebookGuide": "En Laboratorio DL, ejecuta el bloque 10: entrena una CNN de clasificación de dígitos y muestra después un filtro fijo sobre una imagen 8 × 8. Ese filtro y su relleno son distintos del explorador; no deben producir mapas iguales."
    },
    "build": {
      "title": "Mapa de respuestas locales",
      "steps": [
        "Escribe la primera ventana y su filtro. Reconstruye los nueve productos y la suma 3; explica qué celda del mapa produce esa ventana.",
        "En el explorador mueve la ventana por las filas 1, 2 y 3 y registra 3, 3 y 0 con el filtro horizontal. Cambia a Promedio y comprueba 1/3 en la primera posición.",
        "En el bloque 10 distingue la CNN que aprende a clasificar dígitos del filtro fijado para ilustrar una operación. Registra esa distinción y la lectura de una celda; entrenar con dígitos no demuestra reconocer defectos agrícolas."
      ],
      "check": "El mapa manual 3 × 3 coincide celda a celda. El cuaderno clasifica dígitos; ni el filtro fijo ni su mapa localizan objetos por sí solos.",
      "transfer": "Para inspeccionar cambios de intensidad, un mapa de filtro puede ser una transformación intermedia; la aceptación del producto necesita una tarea y una evaluación propias.",
      "stretch": "Implementa el recorrido sin relleno y comprueba la dimensión 5 − 3 + 1 = 3 en ambos ejes."
    },
    "prerequisite": "Ya distinguimos las salidas de visión. Ahora abrimos una de sus operaciones para entender de dónde sale un mapa numérico.",
    "understanding": {
      "question": "¿Un filtro que responde a un borde ya reconoce un fruto?",
      "answer": "No. Produce un mapa de respuestas locales. Una CNN combina muchos filtros, activaciones y capas hasta obtener una salida de la tarea; sus pesos se aprenden con datos. El filtro fijo permite entender una sola operación."
    },
    "outcome": {
      "title": "Una celda explicada",
      "result": "Primera ventana: suma 3; tercera fila de ventana: suma 0",
      "reading": "El mapa contiene respuestas del filtro, no un conteo de frutos"
    },
    "essentialCount": 6
  },
  "dl-transferencia": {
    "objective": "Probar si un modelo existente cubre una necesidad antes de adaptarlo.",
    "concept": "Un modelo preentrenado contiene parámetros aprendidos antes con otros ejemplos. Reutilizarlos puede evitar empezar desde cero, pero primero debemos comprobar qué entradas y categorías admite. Inferir es calcular una salida con esos pesos. Ajustar fino es cambiar parte de ellos usando ejemplos de una tarea nueva. Traducir una etiqueta o filtrar una clase existente no realiza ese aprendizaje. Aquí construiremos una ficha de compatibilidad antes de atribuirle al detector una capacidad que no tiene.",
    "relevance": "Permite decidir si un modelo existente responde al problema o necesita adaptación.",
    "case": {
      "title": "Reutilizar un detector para una tarea nueva",
      "context": "Una cooperativa quiere detectar granos y distinguir su condición. Primero revisa las categorías del detector cargado: el archivo utilizado en el cuaderno reconoce objetos comunes y no incluye las categorías de café requeridas. La tabla distingue usar el modelo, traducir su interfaz y proponer un nuevo entrenamiento.",
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
          "Traducir los nombres de salida al español",
          "No",
          "Hace legible la interfaz; conserva las categorías aprendidas"
        ],
        [
          "Ajustar parámetros con café etiquetado",
          "Sí",
          "Podría adaptar el modelo; requiere evaluación"
        ]
      ],
      "reasoning": [
        "Compara la categoría que necesitas con las categorías del archivo cargado.",
        "Traducir una categoría conserva sus patrones y parámetros: mejora la lectura, pero no añade una categoría nueva.",
        "Adaptar requiere ejemplos etiquetados, ajuste apropiado y evaluación reservada; el nombre del modelo no basta."
      ],
      "conclusion": "Cargar los pesos permite predecir las categorías disponibles. Para abordar café defectuoso hacen falta una tarea, datos etiquetados y una evaluación propios; cambiar el texto de una categoría mantiene el mismo detector.",
      "question": "¿Un detector con categorías persona y bus puede identificar café defectuoso solo al cambiar sus nombres?"
    },
    "vocabulary": [
      {
        "term": "Peso preentrenado",
        "meaning": "Parámetro aprendido antes con otros ejemplos."
      },
      {
        "term": "Inferencia",
        "meaning": "Cálculo de una salida usando parámetros ya disponibles."
      },
      {
        "term": "Categoría disponible",
        "meaning": "Clase que el modelo reconoce según su entrenamiento; un nombre nuevo no crea otra."
      },
      {
        "term": "Ajuste fino",
        "meaning": "Actualización de parámetros preentrenados con ejemplos de la nueva tarea."
      },
      {
        "term": "Preentrenado",
        "meaning": "Con parámetros ajustados previamente con otros datos."
      },
      {
        "term": "Extractor de características",
        "meaning": "Parte del modelo que convierte la entrada en una representación reutilizable."
      },
      {
        "term": "Congelar parámetros",
        "meaning": "Mantenerlos sin cambios durante el nuevo entrenamiento."
      },
      {
        "term": "Cabeza de salida",
        "meaning": "Capas finales que convierten la representación en la salida específica de la tarea."
      },
      {
        "term": "Dominio",
        "meaning": "Condiciones de los datos, como cultivo, iluminación, cámara y tipo de imagen. Un cambio de dominio puede afectar los resultados."
      }
    ],
    "explorer": null,
    "takeaway": "Comprueba entradas y categorías del modelo. Reutilizar pesos, traducir nombres y ajustar parámetros son operaciones diferentes.",
    "next": "Examinaremos problemas donde también importa el orden de las entradas.",
    "lab": {
      "title": "Comprobar si el modelo cubre la categoría",
      "objective": "Determinar qué se reutiliza y qué no aprende al ejecutar inferencia.",
      "instruction": "En YOLO, ejecuta hasta la sección 3. Consulta «modelo.names»: busca la categoría person y comprueba si existe una categoría café defectuoso.",
      "watch": "El archivo de pesos aporta categorías aprendidas; TRADUCCION solo cambia sus nombres visibles.",
      "expected": "person figura entre las categorías; café defectuoso no. Cargar pesos o traducir una etiqueta no adapta el modelo a una clase nueva.",
      "notebookGuide": "YOLO, secciones 3, 5 y 6: carga de pesos, inferencia y lectura de filas. La sección 9 filtra una categoría existente. El cuaderno no realiza ajuste fino ni entrena clases nuevas."
    },
    "build": {
      "title": "Ficha de compatibilidad del modelo",
      "steps": [
        "Escribe la necesidad de la cooperativa: identificar café defectuoso. Revisa el catálogo de categorías del detector antes de ejecutar una foto propia.",
        "En modelo.names busca person y busca café defectuoso. Registra una ficha con necesidad, categoría encontrada y conclusión de compatibilidad.",
        "Relaciona cargar pesos, inferir y traducir etiquetas con la tabla de acciones. Indica qué requeriría un ajuste real y una prueba independiente; el cuaderno de inferencia no realiza esos pasos."
      ],
      "check": "La ficha distingue clase conocida, nombre traducido y clase ausente. Los resultados corresponden a inferencia con pesos previos, no a un entrenamiento realizado aquí.",
      "transfer": "Antes de reutilizar un detector en inventario, contrasta sus categorías con cada objeto requerido y revisa imágenes del entorno de uso.",
      "stretch": "Añade una comprobación que avise cuando una categoría solicitada no esté entre los valores de modelo.names."
    },
    "prerequisite": "Hemos visto qué calcula una CNN. Ahora preguntamos qué parte de una red ya aprendida puede servir para la tarea que tenemos.",
    "understanding": {
      "question": "¿Cargar un detector y traducir sus categorías constituye ajuste fino?",
      "answer": "No. Cargarlo e inferir conserva los parámetros; traducir cambia el texto visible. El ajuste fino requiere entrenamiento adicional con datos y una pérdida. Evaluar el dominio local sigue siendo necesario."
    },
    "outcome": {
      "title": "Ficha de compatibilidad",
      "result": "Necesidad: café defectuoso; categoría del modelo: no disponible",
      "reading": "Traducir una etiqueta no añade una categoría ni cambia pesos"
    },
    "essentialCount": 4
  },
  "dl-secuencias": {
    "objective": "Construir un resumen de una secuencia que tenga en cuenta el orden.",
    "concept": "Una secuencia es una lista donde el lugar de cada valor importa. Por ejemplo, recibir 10, 20 y 30 cajas en horas sucesivas no describe el mismo recorrido que recibir 30, 20 y 10. Una regla recurrente guarda un estado y lo combina con la entrada siguiente. Seguiremos una regla fija de mitades para ver esa memoria. RNN y LSTM aprenden transformaciones más completas; no hace falta derivarlas para entender qué información conservan y cómo se comprueba una predicción.",
    "relevance": "Un resumen de sensores o ventas puede perder información si ignora qué ocurrió primero.",
    "case": {
      "title": "Los mismos valores, dos recorridos",
      "context": "Una operación registra cajas recibidas en tres horas: 10, 20 y 30. Comparamos ese orden con 30, 20 y 10. Para ilustrar memoria empezamos con estado 0 y calculamos estado nuevo = 0,5 × estado anterior + 0,5 × entrada. Los coeficientes son elegidos, no entrenados. El estado es un resumen ponderado de las cantidades, no el pronóstico de la siguiente hora.",
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
        "term": "Secuencia",
        "meaning": "Lista cuyos valores se interpretan según su orden."
      },
      {
        "term": "Estado recurrente",
        "meaning": "Resumen numérico que pasa de un paso al siguiente."
      },
      {
        "term": "Ventana temporal",
        "meaning": "Conjunto de lecturas anteriores usado como entrada para un instante."
      },
      {
        "term": "LSTM",
        "meaning": "Tipo de red recurrente que aprende a conservar y actualizar información a lo largo de una secuencia."
      },
      {
        "term": "Recurrente",
        "meaning": "Usa el resultado del paso anterior."
      },
      {
        "term": "Paso temporal",
        "meaning": "Posición de una lectura en la secuencia. Para sensores también deben registrarse fecha e intervalo."
      },
      {
        "term": "RNN",
        "meaning": "Red neuronal recurrente: comparte una transformación aprendida que actualiza un estado paso a paso."
      },
      {
        "term": "Compuerta",
        "meaning": "Mecanismo numérico que regula cuánto de una información pasa a otra operación; no implica comprensión humana."
      }
    ],
    "explorer": "sequence",
    "takeaway": "Conserva el orden y registra cada actualización del estado. El estado resume lo leído hasta ese paso.",
    "next": "Combinaremos información de varias fuentes usando pesos calculados.",
    "lab": {
      "title": "Conservar los valores y cambiar el orden",
      "objective": "Construir el rastro de un estado que depende del orden.",
      "instruction": "Elige Ascendente en «Orden de la secuencia» y pulsa «Ver el siguiente paso» tres veces. Cambia a Descendente y recorre sus tres pasos desde cero.",
      "watch": "Cada fila usa solo el estado anterior y la entrada actual. El promedio no cambia al invertir los valores.",
      "expected": "Ascendente: estados 5; 12,5; 21,25. Descendente: 15; 17,5; 13,75. Ambos conjuntos promedian 20. La regla fija no se entrena.",
      "notebookGuide": "En Laboratorio DL, bloque 11, la celda de LSTM usa las 12 lecturas previas para pronosticar un paso. Ejecuta las preparaciones y esa celda; compara los dos MAE que imprime sobre los mismos 60 instantes reservados."
    },
    "build": {
      "title": "Registro de estados y pronóstico",
      "steps": [
        "Completa las tres filas del recorrido ascendente: estados 5, 12,5 y 21,25. Conserva las operaciones para que otra persona pueda repetirlas.",
        "Reinicia e invierte el orden. Comprueba 15, 17,5 y 13,75; compara ambos estados finales con el promedio común de 20 cajas.",
        "En el bloque 11, identifica la ventana de doce lecturas y el instante que se predice. Registra los MAE de referencia y LSTM sobre los mismos 60 instantes reservados, usando las unidades de la serie simulada del cuaderno."
      ],
      "check": "Los estados finales son 21,25 y 13,75 pese a la misma media. La comparación del cuaderno usa futuro reservado y conserva el orden; su MAE no procede de la regla manual.",
      "transfer": "Para pronosticar una lectura de equipo, define cuándo estará disponible cada entrada y compara con una referencia simple como repetir la última lectura.",
      "stretch": "Inspecciona entradas[test, −1] y verifica que es la última lectura anterior al instante que se pronostica."
    },
    "prerequisite": "Una imagen se interpreta espacialmente. Aquí importa otra estructura: qué ocurrió antes y qué ocurrió después.",
    "understanding": {
      "question": "¿El estado recurrente guarda una copia exacta de todo lo anterior?",
      "answer": "No. Es un resumen que depende de la regla y de sus parámetros. En la demostración es una mezcla numérica fija; una RNN aprende su transformación y una LSTM usa mecanismos adicionales para regular la memoria."
    },
    "outcome": {
      "title": "Rastro de memoria",
      "result": "10→20→30: estado final 21,25; 30→20→10: 13,75",
      "reading": "Promedio común: 20; el estado fijo no es una predicción aprendida"
    },
    "essentialCount": 5
  },
  "dl-atencion": {
    "objective": "Construir una combinación ponderada de fuentes y rastrear su cálculo.",
    "concept": "Atención combina información con pesos que dependen de una consulta. En el ejemplo, A aporta 10 y B aporta 20. Si ambas pesan 0,5, la mezcla vale 15; si A pesa más, se acerca a 10. Para calcular el reparto comparamos una consulta Q con claves K, transformamos las puntuaciones en pesos que suman 1 y combinamos valores V. Empezaremos por interpretar esa mezcla; después seguiremos la operación numérica. Un peso alto no demuestra causalidad ni una importancia universal de la fuente.",
    "relevance": "Permite explicar una combinación interna sin presentarla como comprensión humana o explicación causal.",
    "case": {
      "title": "Una consulta, dos fuentes",
      "context": "Dos registros ficticios de una operación aportan cantidades de 10 y 20 cajas. Para estudiar cómo se combinan, les damos claves K_A = [1,0] y K_B = [0,1]. La consulta Q y esas claves son vectores elegidos para el cálculo, no características aprendidas de pedidos reales. V_A = 10 y V_B = 20 son los valores que mezclaremos. El resultado es una representación ponderada, no una orden de compra ni un pronóstico validado.",
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
        "term": "Vector",
        "meaning": "Lista ordenada de números; en Q y K hay dos componentes."
      },
      {
        "term": "Consulta, clave y valor",
        "meaning": "Q se compara con K para repartir pesos; V aporta la información que se combina."
      },
      {
        "term": "Peso de atención",
        "meaning": "Fracción de la mezcla asignada a una fuente; aquí todos los pesos son positivos y suman 1."
      },
      {
        "term": "Softmax",
        "meaning": "Transforma puntuaciones en pesos: exponencial de cada puntuación dividida por la suma de exponenciales."
      },
      {
        "term": "Consulta Q",
        "meaning": "Vector que se compara con las claves para calcular el reparto."
      },
      {
        "term": "Clave K y valor V",
        "meaning": "K interviene en la comparación; V aporta la información que se combina."
      },
      {
        "term": "Producto escalar",
        "meaning": "Multiplicar componentes correspondientes de dos vectores y sumar los productos; produce una puntuación de comparación."
      },
      {
        "term": "Dimensión d",
        "meaning": "Cantidad de componentes de cada consulta y clave; en el ejemplo vale 2 y se usa su raíz para escalar las puntuaciones."
      },
      {
        "term": "Mezcla ponderada",
        "meaning": "Suma de valores multiplicados por sus pesos. Aquí los pesos son positivos y suman 1."
      },
      {
        "term": "Autoatención",
        "meaning": "Atención en la que consultas, claves y valores proceden de representaciones de la misma secuencia."
      }
    ],
    "explorer": "attention",
    "takeaway": "Sigue consulta y claves → puntuaciones → pesos → suma ponderada de valores. Los pesos indican cuánto aporta cada valor a esa combinación.",
    "next": "Ubicaremos esta operación dentro de una arquitectura para secuencias.",
    "lab": {
      "title": "Cambiar la consulta, conservar las fuentes",
      "objective": "Reproducir una mezcla por atención desde sus productos hasta su salida.",
      "instruction": "En «Consulta Q», recorre [1,0], [0,1] y [0,0]. Para cada consulta, anota peso de A, peso de B y salida combinada.",
      "watch": "K y V permanecen fijos. Los productos se dividen por √2; softmax produce los pesos que multiplican 10 y 20.",
      "expected": "Los pesos suman 1 en cada caso. Las salidas son aproximadamente 13,302; 16,698 y 15; la consulta nula asigna 0,5 a cada fuente.",
      "notebookGuide": "En la primera celda de código del bloque 12 de Laboratorio DL, sigue Q @ K.T / √2, softmax y atencion @ V. Allí hay tres fichas y valores vectoriales; los resultados no son los de las dos fuentes del explorador."
    },
    "build": {
      "title": "Tabla de consulta, pesos y resultado",
      "steps": [
        "Empieza con Q = [0,0]: ambas puntuaciones son iguales, los pesos son 0,5 y 0,5, y la mezcla es 0,5×10 + 0,5×20 = 15.",
        "Cambia a [1,0] y [0,1]. Registra consulta, pesos y salida; comprueba que los pesos suman 1 y calcula la mezcla con los valores sin redondear.",
        "En la primera celda del bloque 12 identifica las tres fichas, sus filas de pesos y los valores que se mezclan. Reproduce una fila de la salida, aclarando que allí los valores son vectores y no las dos cantidades del ejemplo web."
      ],
      "check": "La tabla web reproduce las tres salidas. En el cuaderno, atencion @ V coincide con resultado; los pesos numéricos elegidos no demuestran relaciones semánticas aprendidas ni causas.",
      "transfer": "Para inspeccionar un bloque de atención, identifica primero quién consulta, cuáles son las fuentes y qué valores se mezclan.",
      "stretch": "Calcula np.allclose(atencion.sum(axis=1), 1) y verifica la combinación de una fila sin usar los pesos redondeados del gráfico."
    },
    "prerequisite": "Una regla recurrente acumula pasado paso a paso. Ahora veremos otra operación: consultar y combinar varias representaciones directamente.",
    "understanding": {
      "question": "¿Qué papel cumplen Q, K, V y los pesos de atención?",
      "answer": "Q plantea la comparación; K describe cada fuente para compararla; V contiene lo que se combinará. Las comparaciones producen pesos, y estos ponderan V. Un peso alto no demuestra una causa ni que la fuente sea correcta."
    },
    "outcome": {
      "title": "Una mezcla reconstruida",
      "result": "Q=[1,0]: pesos ≈ 0,6698 y 0,3302; salida ≈ 13,302",
      "reading": "Q=[0,0]: pesos iguales y salida 15; los pesos del ejemplo no fueron entrenados"
    },
    "essentialCount": 4
  },
  "dl-transformers": {
    "objective": "Construir una prueba de clasificación de secuencias con respuestas verificables.",
    "concept": "Un Transformer es una arquitectura para transformar secuencias usando atención y otras operaciones. Cada unidad se representa con números y se incorpora su posición, de modo que «primero» y «último» puedan distinguirse. Aquí no construiremos un asistente: comprobaremos una tarea pequeña de cuatro cantidades. La etiqueta la fija una regla conocida; la red intenta aprenderla. Separar esa etiqueta de las puntuaciones de la red permite verificar el resultado sin suponer que una arquitectura compleja siempre acierta.",
    "relevance": "Una arquitectura solo puede evaluarse después de definir qué debería responder.",
    "case": {
      "title": "¿El primero es mayor que el último?",
      "context": "Cada fila contiene cajas recibidas en cuatro horas ficticias. La etiqueta 1 significa que la última cantidad es menor que la primera; en caso contrario, 0. Es una comparación de extremos, no una afirmación de que todas las horas hayan bajado ni un pronóstico de demanda. Las cantidades entre 1 y 7 se eligieron para poder calcular las etiquetas a mano.",
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
      "conclusion": "La posición es necesaria para esta regla: [1,2,3,4] requiere 0 y [4,3,2,1] requiere 1. La tabla da respuestas esperadas; para saber qué predice el Transformer hay que ejecutar la red y leer su evaluación.",
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
        "term": "Unidad de entrada o token",
        "meaning": "Elemento de la secuencia; aquí, una cantidad numérica."
      },
      {
        "term": "Posición",
        "meaning": "Lugar de la unidad que permite distinguir primero de último."
      },
      {
        "term": "Atención",
        "meaning": "Operación que combina representaciones según una consulta."
      },
      {
        "term": "Etiqueta y predicción",
        "meaning": "La etiqueta es la respuesta conocida por la regla; la predicción es la salida calculada por la red."
      },
      {
        "term": "Token",
        "meaning": "Unidad de entrada; aquí, un número."
      },
      {
        "term": "Embedding o representación vectorial",
        "meaning": "Forma de representar una unidad de entrada mediante un vector. Cuando es aprendido, sus valores se ajustan para la tarea."
      },
      {
        "term": "Codificación de posición",
        "meaning": "Información sobre el lugar de cada unidad; permite distinguir órdenes que una mezcla sin posición podría confundir."
      },
      {
        "term": "Encoder",
        "meaning": "Conjunto de bloques que transforma la secuencia en representaciones contextualizadas. El laboratorio usa un encoder para clasificar."
      },
      {
        "term": "Cabezas de atención",
        "meaning": "Comparaciones realizadas en espacios de representación distintos y combinadas dentro de un bloque. Más cabezas no garantizan mejor resultado."
      },
      {
        "term": "Conexión residual y normalización",
        "meaning": "La conexión residual suma la entrada de un bloque a su transformación; la normalización ajusta la escala de activaciones. Ayudan al funcionamiento del bloque, pero no sustituyen su entrenamiento."
      }
    ],
    "explorer": null,
    "takeaway": "Define la regla de respuesta y conserva el orden de los elementos. Comprueba las predicciones con etiquetas conocidas de casos reservados.",
    "next": "Pasaremos a fotos que producen registros de objetos.",
    "lab": {
      "title": "Comprobar una tarea de orden",
      "objective": "Separar la etiqueta esperada de la salida de un Transformer entrenado.",
      "instruction": "Resuelve las cuatro etiquetas del ejemplo con la regla «primero > último». En el bloque 12 de Laboratorio DL, ejecuta el Transformer y revisa las dos secuencias que imprime al final: [1,2,3,4] y [4,3,2,1].",
      "watch": "La regla da la respuesta esperada. El cuaderno calcula puntuaciones de clase, pérdida y exactitud sobre secuencias reservadas.",
      "expected": "Las cuatro etiquetas del ejemplo son 0, 1, 0 y 1; las dos secuencias impresas requieren 0 y 1. Sus salidas de red y la exactitud se conocen al ejecutar, no se garantizan.",
      "notebookGuide": "Bloque 12, segunda celda de código: seq genera secuencias, np.unique elimina duplicados, y calcula etiquetas y train_test_split las separa. OrdenTransformer combina embedding, posición, encoder y salida; la celda imprime exactitud y puntuación de clase 1 para dos ejemplos."
    },
    "build": {
      "title": "Banco de pruebas para una secuencia",
      "steps": [
        "Calcula las cuatro etiquetas antes de ejecutar código: 0, 1, 0 y 1. Explica el significado de 1 y por qué no basta conocer el promedio o la colección de valores.",
        "Ejecuta el bloque 12 y recorre entrada, representación, posición, atención y salida. Registra los tamaños de entrenamiento y prueba y la exactitud que realmente imprime.",
        "Para las dos secuencias impresas, registra etiqueta esperada y puntuaciones de la red. Explica si coinciden y separa esos dos ejemplos de la prueba completa de 129 secuencias."
      ],
      "check": "Se conocen las etiquetas por la regla, pero no se inventan predicciones ni exactitud. Los ejemplos impresos son dos; la prueba completa contiene 129 secuencias con la semilla del cuaderno.",
      "transfer": "En una tarea con registros ordenados, define primero la respuesta comprobable y una reserva de secuencias distintas antes de elegir arquitectura.",
      "stretch": "En una copia, cambia ejemplos por nuevas secuencias de cuatro enteros de 1 a 7, calcula sus etiquetas y contrasta las clases con argmax. No las presentes como una prueba independiente sin revisar su presencia en entrenamiento."
    },
    "prerequisite": "Ya sabemos qué combina la atención. La ubicaremos dentro de una arquitectura que además necesita entrada, posición y una salida para la tarea.",
    "understanding": {
      "question": "¿Un Transformer es lo mismo que atención o que un chatbot?",
      "answer": "No. Atención es una operación dentro de la arquitectura. Un Transformer añade representación de entrada, posición y otras transformaciones. Puede resolver distintas tareas; el ejercicio clasifica secuencias numéricas y no genera conversación."
    },
    "outcome": {
      "title": "Prueba de orden",
      "result": "Etiquetas esperadas: 0, 1, 0, 1",
      "reading": "La clase describe extremos de cuatro cantidades; la exactitud se conoce al ejecutar"
    },
    "essentialCount": 7
  },
  "dl-yolo": {
    "objective": "Construir un registro de detecciones que pueda revisarse antes de contar objetos.",
    "concept": "Un detector recibe una foto y propone objetos. Cada propuesta incluye una categoría, una puntuación y una ubicación. YOLO es una familia de modelos para esa tarea. Convertir sus salidas en una tabla permite revisar qué produjo, pero no convierte cada fila en un objeto confirmado. Primero seguiremos una propuesta y el filtro que la conserva o descarta; después haremos inferencia con pesos preentrenados y volveremos de una fila a su caja.",
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
        "meaning": "Propuesta que incluye categoría, puntuación y ubicación."
      },
      {
        "term": "Caja",
        "meaning": "Rectángulo que localiza una propuesta mediante coordenadas."
      },
      {
        "term": "Puntuación",
        "meaning": "Salida numérica del detector que se utiliza para filtrar."
      },
      {
        "term": "Umbral",
        "meaning": "Límite elegido para conservar o descartar propuestas."
      },
      {
        "term": "Coordenadas de caja",
        "meaning": "Valores que ubican el rectángulo. En formato xyxy son x izquierda, y superior, x derecha e y inferior; otras herramientas usan centro, ancho y alto."
      },
      {
        "term": "Puntuación de detección",
        "meaning": "Salida numérica usada para filtrar propuestas; su definición depende del modelo y no equivale al IoU."
      },
      {
        "term": "Supresión de duplicados",
        "meaning": "Procedimiento que reduce propuestas redundantes, como NMS en detectores que la emplean. No todas las variantes usan el mismo posprocesamiento."
      }
    ],
    "explorer": "detection",
    "takeaway": "Relaciona cada fila con su imagen, categoría, puntuación y caja. Revisa las detecciones antes de convertir su conteo en una decisión operativa.",
    "next": "Comprobaremos si la caja conservada coincide con la ubicación conocida.",
    "lab": {
      "title": "Filtrar propuestas sin moverlas",
      "objective": "Construir un registro que conecte foto, caja, puntuación y conteo.",
      "instruction": "Fija «Desplazamiento horizontal de la caja» en 10. Cambia «Umbral de puntuación» a 0,50; 0,80 y 0,90; registra cuántas filas se conservan.",
      "watch": "La puntuación permanece en 0,80 y la caja no se mueve. Cambia solo la regla para conservarla.",
      "expected": "Se conserva una fila a 0,50 y 0,80, y ninguna a 0,90. La igualdad cuenta como conservar; el objeto conocido sigue presente aunque descartes la propuesta.",
      "notebookGuide": "En tu copia de YOLO, ejecuta en orden hasta la sección 8. Obtendrás foto marcada, tabla por detección, conteos y comparación de umbrales. La sección 11 permite guardar CSV y configuración."
    },
    "build": {
      "title": "Registro visual: de la foto a las filas",
      "steps": [
        "Completa el registro de la propuesta fija 0,80 para umbrales 0,50, 0,80 y 0,90: se conservan 1, 1 y 0 filas. La regla del esquema incluye igualdad.",
        "En YOLO hasta la sección 7, elige una detección y registra categoría, puntuación y coordenadas, vinculándolas a una caja de la foto. Explica qué categorías reconoce ese modelo, antes de atribuirle una categoría agrícola nueva.",
        "Compara los tres umbrales de la sección 8 y registra los conteos ejecutados. En la sección 11 guarda los archivos de la inferencia inicial con umbral 0,25: no los presentes como los archivos de cada panel comparado ni como inventario confirmado."
      ],
      "check": "Cada conteo puede rastrearse a filas y cajas. Los archivos finales pertenecen a la inferencia inicial de 0,25, no a cada panel de comparación; ningún conteo se presenta como inventario confirmado.",
      "transfer": "Para registrar objetos visibles en una bodega, conserva imagen y configuración, y revisa duplicados y omisiones antes de actualizar existencias.",
      "stretch": "Genera un identificador de imagen para cada fila al combinar varias fotos; no confundas detecciones repetidas entre fotos con objetos únicos."
    },
    "prerequisite": "Ya sabemos qué salida corresponde a detección y qué puede reutilizarse de un modelo. Ahora construiremos un registro que se pueda inspeccionar.",
    "understanding": {
      "question": "¿Qué información necesita una fila de detección para poder interpretarla?",
      "answer": "La imagen de origen, categoría, puntuación, coordenadas y convención de la caja. Después hay que revisar omisiones y duplicados; la cantidad de filas no es automáticamente la cantidad real de objetos."
    },
    "outcome": {
      "title": "Registro de una propuesta",
      "result": "Puntuación fija 0,80; umbrales 0,50/0,80/0,90 → filas 1/1/0 en el esquema",
      "reading": "Cambiar el filtro no mueve el objeto ni comprueba un acierto"
    },
    "essentialCount": 4
  },
  "dl-evaluacion": {
    "objective": "Construir una comprobación de localización que separe filtro y coincidencia.",
    "concept": "Para evaluar un detector no basta contar sus propuestas. Necesitamos objetos de referencia anotados con categoría y ubicación. Una coincidencia exige clase correcta y suficiente solapamiento de cajas. IoU mide ese solapamiento como área compartida dividida por área de unión. Separaremos dos decisiones: qué propuesta conserva el filtro de puntuación y cuál coincide después con una referencia. Una propuesta mal situada puede contar como falsa y dejar al mismo tiempo un objeto sin detectar. Al repetir la comparación para varias puntuaciones se obtiene una relación precisión–recall. AP resume esa relación con un protocolo declarado; mAP promedia AP según clases o umbrales del protocolo. Un conteo aislado no es mAP.",
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
        "term": "Referencia anotada",
        "meaning": "Categoría y caja usadas para comprobar una propuesta."
      },
      {
        "term": "IoU",
        "meaning": "Área compartida por dos cajas dividida por su área de unión."
      },
      {
        "term": "Coincidencia",
        "meaning": "Propuesta conservada que cumple clase y solapamiento exigidos con una referencia."
      },
      {
        "term": "TP, FP y FN",
        "meaning": "Objeto correctamente detectado, propuesta sin coincidencia y objeto de referencia omitido."
      },
      {
        "term": "Emparejamiento uno a uno",
        "meaning": "Asignación que evita que varias detecciones obtengan crédito por un mismo objeto."
      },
      {
        "term": "Umbral de IoU",
        "meaning": "Criterio elegido para aceptar una localización; cumple una función diferente del umbral de puntuación."
      },
      {
        "term": "AP y mAP",
        "meaning": "AP resume la relación entre precisión y recall al recorrer puntuaciones con un criterio de coincidencia; mAP promedia AP según clases y el protocolo indicado. Siempre hay que declarar ese protocolo."
      }
    ],
    "explorer": "detection",
    "takeaway": "Evalúa por separado la regla que conserva propuestas y el criterio que las compara con los objetos de referencia.",
    "next": "Consideraremos las consecuencias de convertir predicciones en acciones.",
    "lab": {
      "title": "Separar filtro y coincidencia",
      "objective": "Construir tres pruebas de aceptación de una caja.",
      "instruction": "Fija «IoU mínima para coincidencia» en 0,50. Con umbral de puntuación 0,50, prueba desplazamientos 10 y 30. Vuelve a 10 y sube el umbral a 0,90.",
      "watch": "Registra IoU, filas conservadas, verdaderos positivos, falsos positivos y objetos omitidos. La puntuación y la referencia permanecen fijas.",
      "expected": "Las tres pruebas dan IoU 0,60; 1/7 ≈ 0,143; 0,60 y TP/FP/FN 1/0/0; 0/1/1; 0/0/1. Descartar una mala propuesta no borra el objeto omitido.",
      "notebookGuide": "En YOLO, las secciones 6–8 permiten inspeccionar propuestas y filtros. No hay anotaciones de referencia ni evaluación mAP en ese cuaderno; la evaluación numérica de esta práctica usa la caja conocida del explorador."
    },
    "build": {
      "title": "Prueba de aceptación de cajas",
      "steps": [
        "Calcula las áreas de la primera prueba: referencia y candidata de 40×40, intersección 30×40 = 1200, unión 1600+1600−1200 = 2000 e IoU 0,60.",
        "Registra las tres filas del explorador con umbral de puntuación, desplazamiento, IoU y TP/FP/FN. Comprueba 1/0/0, 0/1/1 y 0/0/1, distinguiendo conservar de coincidir.",
        "En una imagen del cuaderno, especifica qué referencia anotada faltaría para evaluar sus propuestas. Explica cómo impedirías que dos cajas recibieran crédito por el mismo objeto; ese cuaderno no calcula mAP."
      ],
      "check": "Las tres filas reproducen los conteos esperados. Se separan umbral de puntuación e IoU; no se atribuyen métricas mAP al cuaderno de inferencia.",
      "transfer": "Antes de aceptar una automatización de conteo, comprueba objetos omitidos, duplicados y coincidencias espaciales con referencias anotadas.",
      "stretch": "Comprueba los extremos en el explorador: desplazamiento 0 produce IoU 1; desplazamiento 40 produce IoU 0. Mantén la propuesta conservada para interpretar FP y FN."
    },
    "prerequisite": "El registro del detector muestra lo que propuso. La evaluación añade una referencia para comprobar qué corresponde a un objeto y qué falta.",
    "understanding": {
      "question": "¿Por qué dos cajas para un solo objeto no deben contarse como dos aciertos?",
      "answer": "El emparejamiento de evaluación asigna como máximo una detección al objeto de referencia. Una propuesta adicional sin otro objeto coincidente es un falso positivo; tampoco se borra una omisión por descartar una caja."
    },
    "outcome": {
      "title": "Tabla de aceptación",
      "result": "Desplazar 10 px: IoU 0,60, TP/FP/FN=1/0/0; desplazar 30 px: ≈0,143, 0/1/1",
      "reading": "Descartar la propuesta con umbral 0,90 deja un objeto omitido: 0/0/1"
    },
    "essentialCount": 7
  },
  "dl-integracion": {
    "objective": "Construir una política de revisión con costes y una salida verificable.",
    "concept": "El modelo registra puntuaciones; una política decide qué hacer con ellas. En una inspección podemos revisar unos granos y aceptar otros sin revisión. Para comparar políticas debemos declarar qué cuesta revisar y qué consecuencia se asigna a dejar pasar un defecto. Usaremos los mismos diez casos y añadiremos revisar todos como referencia. El mínimo depende de esos supuestos. Cerramos DL con una regla explicable y comprobable, distinguiendo una comparación didáctica de una política validada para una operación real.",
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
        "term": "Política de revisión",
        "meaning": "Regla que decide qué casos revisar y cuáles aceptar sin revisión."
      },
      {
        "term": "Coste supuesto",
        "meaning": "Valor fijado para comparar consecuencias, sin presentarlo como un precio observado."
      },
      {
        "term": "Defecto aceptado",
        "meaning": "Caso defectuoso que la regla deja pasar sin revisión."
      },
      {
        "term": "Referencia de decisión",
        "meaning": "Alternativa sencilla, como revisar todos, que se compara con las demás políticas."
      },
      {
        "term": "Revisión humana",
        "meaning": "Acción cuya capacidad y posibilidad de error deben declararse. El caso simplifica su eficacia para poder comparar políticas."
      },
      {
        "term": "Latencia",
        "meaning": "Tiempo entre recibir una entrada y producir una respuesta; puede limitar el uso aunque la métrica sea buena."
      },
      {
        "term": "Seguimiento",
        "meaning": "Comprobación del desempeño durante el uso ante cambios de datos, condiciones o costes."
      }
    ],
    "explorer": null,
    "takeaway": "Compara políticas con los mismos casos, costes y supuestos. La opción elegida debe indicar qué se revisa, qué se acepta y cómo se seguirá el error.",
    "next": "Cierra explicando pregunta, datos, comparación, decisión y evidencia que falta.",
    "lab": {
      "title": "Cambiar el coste, conservar los casos",
      "objective": "Comparar políticas de revisión con consecuencias explícitas.",
      "instruction": "En el bloque 14 de Laboratorio DL, ejecuta primero con COSTO_DEFECTO_ACEPTADO = 8. Guarda la tabla; cambia ese valor a 1 y vuelve a ejecutar la celda.",
      "watch": "Puntuaciones, revisiones y defectos omitidos permanecen iguales. Solo cambia el coste asignado a aceptar un defecto.",
      "expected": "Con coste 8: 6, 12, 11 y 25 para umbrales 0,30; 0,50; 0,70; 0,90. Con coste 1: 6, 5, 4 y 4. Revisar todos cuesta 10 en ambos casos.",
      "notebookGuide": "Ejecuta las preparaciones y la celda del bloque 14. La tabla usa diez granos ficticios; la línea discontinua representa revisar todos. El ejercicio supone que la revisión detecta todos los defectos y usa costes ficticios."
    },
    "build": {
      "title": "Tabla de decisión para revisión asistida",
      "steps": [
        "Con coste de revisión 1 y de defecto aceptado 8, completa coste = revisiones×1 + defectos aceptados×8. Comprueba, por ejemplo, 4 revisiones y 1 defecto: coste 12.",
        "Registra la tabla de cuatro umbrales y revisar todos. Con estos supuestos el mínimo es 0,30, coste 6; revisar todos cuesta 10. Escribe qué se revisa y qué se acepta.",
        "Cambia únicamente el coste del defecto a 1 y repite. Registra el empate de 0,70 y 0,90 con coste 4, y declara la suposición de revisión perfecta y la capacidad que faltaría comprobar."
      ],
      "check": "Cada coste se reproduce como revisiones × 1 + defectos aceptados × coste elegido. El mínimo cambia por el supuesto de coste, sin que el modelo haya aprendido de nuevo.",
      "transfer": "Para priorizar inspecciones, añade costes observados, capacidad de revisión y errores humanos; vuelve a comparar políticas con datos separados.",
      "stretch": "Genera una tabla para varios costes de defecto e incluye siempre revisar todos. Si agregas un límite de capacidad, declara qué políticas dejan de ser viables."
    },
    "prerequisite": "Ya contrastamos propuestas con referencias. Falta explicar cómo convertir una salida en una decisión con consecuencias explícitas.",
    "understanding": {
      "question": "¿La arquitectura más compleja produce necesariamente la mejor decisión operativa?",
      "answer": "No. La elección depende de datos representativos, errores, coste, capacidad y tiempo de respuesta. La política elegida con validación debe comprobarse en una prueba separada y supervisarse cuando cambien las condiciones."
    },
    "outcome": {
      "title": "Regla de revisión justificada",
      "result": "Con costes 1 y 8: umbral 0,30, coste 6; revisar todos, coste 10",
      "reading": "Con coste de defecto 1: empate entre 0,70 y 0,90, coste 4; casos y puntuaciones fijos"
    },
    "essentialCount": 4
  }
};
