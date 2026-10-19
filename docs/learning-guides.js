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
    "relevance": "Explorar lotes parecidos orienta una investigación cuando no existen etiquetas de grupo.",
    "concept": "La agrupación explora qué registros se parecen cuando no conocemos etiquetas de grupo. Esa similitud depende de las variables y sus escalas. Aquí usamos DBSCAN para encontrar zonas de puntos cercanos: el resultado organiza una exploración, pero no establece categorías verdaderas ni recomendaciones agrícolas. Otros métodos, como K-Means y Mean-Shift, definen los grupos de otra manera.",
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
      },
      {
        "term": "Aprendizaje no supervisado",
        "meaning": "Busca estructura en las entradas sin recibir etiquetas de respuesta para esa tarea."
      },
      {
        "term": "Distancia",
        "meaning": "Medida de separación entre registros. Cambia con las variables, las unidades y el escalado."
      },
      {
        "term": "DBSCAN",
        "meaning": "Método que conecta zonas con suficientes puntos cercanos; permite formas irregulares y puntos sin grupo."
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
        "Registra radio, mínimo, grupos y puntos sin asignar para las dos configuraciones del explorador.",
        "En la sección 4 del cuaderno, lee el conteo de cada etiqueta y ubícala en la leyenda. Verifica que todos los conteos sumen 123; usa sus propias cifras.",
        "Describe qué observaciones revisarías juntas y cuáles individualmente. Mantén nombres neutrales: el grupo no indica calidad y −1 no demuestra una falla."
      ],
      "check": "El explorador produce 2 grupos y 3 sin asignar frente a 0 y 29. El cuaderno tiene 123 puntos distintos; sus conteos no se sustituyen por los del explorador.",
      "transfer": "Para agrupar incidencias de equipos, define primero medidas y escalas. Comprueba el significado de cada grupo antes de asignarle una acción.",
      "stretch": "En tu copia, cambia únicamente eps en DBSCAN de la sección 4 y ejecuta de nuevo desde el principio en un entorno reiniciado. Así la semilla reproduce los mismos puntos y puedes comparar conteos sin cambiar también los datos."
    },
    "prerequisite": "Hasta aquí conocíamos la respuesta de cada ejemplo. Ahora exploramos similitudes sin etiquetas de grupo: la pregunta y la forma de comprobar resultados cambian.",
    "understanding": {
      "question": "¿Por qué un grupo de DBSCAN no equivale a una clase real ni a una recomendación agrícola?",
      "answer": "El grupo surge de las variables, su escala y los parámetros elegidos. Hay que investigar qué comparten sus miembros y comprobar si esa agrupación ayuda en la operación. Un punto sin grupo tampoco es automáticamente un dato erróneo."
    }
  },
  "ml-pca": {
    "objective": "Construir una vista resumida de registros y documentar la información que conserva.",
    "relevance": "Resumir medidas que cambian juntas facilita una gráfica; debemos saber qué información se pierde.",
    "concept": "PCA busca una representación con menos dimensiones que conserve tanta variación de las entradas como sea posible. Transforma variables en componentes ordenadas por la varianza que explican; las direcciones sucesivas son perpendiculares. Es útil para resumir y explorar datos, pero su porcentaje conservado no mide exactitud predictiva. Centrar y decidir si escalar son decisiones previas distintas.",
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
      },
      {
        "term": "Centrado",
        "meaning": "Restar la media de entrenamiento a cada variable para estudiar variaciones respecto a ella."
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
        "Registra los porcentajes de 0°, 90° y 37° en el explorador y señala qué dirección conserva más de las tres.",
        "En el cuaderno, localiza la varianza explicada por componente y su acumulado. Anota cuánto conservan PC1 sola y PC1 más PC2.",
        "Acompaña la vista PC1–PC2 con una lectura: cada punto es un registro; los ejes son combinaciones de las tres variables escaladas; indica porcentaje conservado y descartado."
      ],
      "check": "El explorador da aproximadamente 63,1 %, 36,9 % y 98,0 %. La vista del cuaderno informa su propio porcentaje y su complemento hasta 100 %; no se interpreta como exactitud de clasificación.",
      "transfer": "Para explorar muchas medidas operativas, usa la vista resumida para encontrar patrones y vuelve a las columnas originales para explicarlos.",
      "stretch": "En una celda nueva de tu copia, crea pd.DataFrame(X_pca[:, :2], index=df.index, columns=['PC1', 'PC2']) y comprueba la correspondencia de una fila con su registro original."
    },
    "prerequisite": "Agrupar asignaba registros a conjuntos. PCA cambia la representación de sus variables: resumir columnas y formar grupos son tareas distintas.",
    "understanding": {
      "question": "¿Conservar 90 % de varianza significa lograr 90 % de exactitud?",
      "answer": "No. El porcentaje describe dispersión de las entradas conservada por la proyección; no compara predicciones con respuestas reales. Incluso una dirección con poca variación podría ser útil para una tarea predictiva."
    }
  },
  "ml-ensambles": {
    "objective": "Seleccionar un modelo candidato mediante una comparación reproducible.",
    "relevance": "Combinar estimaciones puede compensar errores; midamos el resultado antes de confiar.",
    "concept": "Un ensamble produce una salida combinando las predicciones de varios modelos. Puede ayudar cuando sus errores se compensan, aunque también pueden equivocarse juntos. En el ejemplo aislamos el efecto de promediar; en el laboratorio se entrenan modelos. Bagging, boosting y stacking son formas distintas de construir la combinación y deben compararse con una referencia en los mismos casos.",
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
        "Compara las cuatro barras en MAE y RMSE. Registra los valores con unidades y conserva la referencia como punto de comparación.",
        "En la sección 3 del cuaderno, localiza fit(X_tr, y_tr) y predict(X_te). Comprueba que todos usan las mismas filas reservadas y copia los MAE y RMSE de tabla.",
        "Elige un candidato para seguir probando y justifica la elección con sus dos errores. Anota que cambiar de conjunto o de condiciones exige otra comprobación."
      ],
      "check": "La tabla tiene cuatro modelos, una única prueba y dos errores en t/ha. En los resultados guardados, boosting da 0,301 de MAE y 0,411 de RMSE; tu ejecución se documenta con sus propias cifras.",
      "transfer": "Para comparar estimadores de duración, usa las mismas tareas reservadas. MAE conserva unidades; RMSE da más peso a errores grandes.",
      "stretch": "En tu copia, inspecciona tabla[['modelo', 'MAE_t_ha', 'RMSE_t_ha']].sort_values('MAE_t_ha') y compara con ordenar por RMSE."
    },
    "prerequisite": "Ya sabemos evaluar una predicción y representar datos. Ahora combinamos modelos, conservando la misma pregunta, los mismos casos y la misma métrica.",
    "understanding": {
      "question": "¿Un bosque de muchos árboles garantiza superar a un árbol?",
      "answer": "No. La combinación puede reducir algunos errores, pero depende de los datos y de cuánto se parezcan las equivocaciones. Se decide mediante validación; la prueba final mide el resultado elegido."
    }
  },
  "ml-series": {
    "objective": "Construir un pronóstico para planear compras y comprobarlo respetando el tiempo.",
    "relevance": "Planear compras exige anticipar ventas usando solo información disponible al decidir.",
    "concept": "Una serie temporal conserva el orden de observaciones fechadas. Pronosticar usa la historia disponible para estimar periodos posteriores. Por eso la separación de datos debe reproducir la situación de decisión: entrenamiento y preparación se hacen con el pasado; las fechas siguientes quedan reservadas. Evaluamos reglas sencillas y modelos sobre el mismo horizonte.",
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
        "Registra las tres estrategias y sus MAE visuales. Anota que el pronóstico se emite al cierre de la semana 60 para las 24 siguientes.",
        "Ejecuta la sección 5 del cuaderno y copia su tabla de métodos y MAE. Localiza pasado, futuro y pronosticos para verificar qué valores usa cada regla.",
        "Elige una regla para un ensayo de compras. Registra momento de emisión, horizonte de 24 semanas, error observado y cuándo volverías a evaluarla."
      ],
      "check": "Las tres reglas usan las mismas 60 semanas pasadas y se comparan sobre las mismas 24 futuras. Los MAE del cuaderno corresponden a su propia serie, sin mezclar datos futuros al pronosticar.",
      "transfer": "Para anticipar carga semanal de soporte, conserva el orden temporal y expresa el error en cantidad de solicitudes.",
      "stretch": "En una celda nueva de tu copia, crea pd.DataFrame({'semana': t[corte:], 'observado': futuro, **pronosticos}) y comprueba que tiene 24 filas."
    },
    "prerequisite": "La evaluación anterior reservaba casos. Si queremos anticipar semanas futuras, también debemos respetar cuándo estuvo disponible cada dato.",
    "understanding": {
      "question": "¿Por qué una buena predicción del pasado podría fallar como pronóstico?",
      "answer": "Podría haberse construido usando información que llegó después de la fecha de decisión. Un pronóstico válido usa solo historia disponible y se comprueba en un horizonte posterior al corte."
    }
  },
  "ml-refuerzo": {
    "objective": "Construir y probar una secuencia de acciones con recompensas acumuladas.",
    "relevance": "Una acción afecta pasos posteriores; no basta con evaluar cada movimiento por separado.",
    "concept": "El aprendizaje por refuerzo estudia cómo elegir acciones cuando sus consecuencias afectan situaciones posteriores. El agente interactúa con un entorno y usa experiencias para mejorar su política. La demostración permite recorrer casillas y observar recompensas; el cuaderno usa Q-learning para aprender valores. Elegir un recorrido manualmente ayuda a entender las reglas, pero no entrena al agente.",
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
      },
      {
        "term": "Agente y entorno",
        "meaning": "El agente elige acciones; el entorno define qué sucede y qué recompensa recibe."
      },
      {
        "term": "Acción",
        "meaning": "Elección disponible en un estado; aquí, intentar moverse a una casilla vecina."
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
        "Registra los cinco movimientos hacia la meta con casilla, acción y recompensa. Comprueba la suma 6 y el final del episodio.",
        "Ejecuta el cuaderno y localiza la actualización de Q, el gráfico de recompensas y las flechas de la política. Cada salida muestra una parte distinta del aprendizaje.",
        "Lee la trayectoria y recompensa impresas de la demostración final. Cuenta sus movimientos y compara con tu ruta manual, sin confundir la curva de entrenamiento con esa única demostración."
      ],
      "check": "La ruta manual tiene cinco pasos y recompensa 6; el borde añade un paso de −1 sin movimiento. La ruta aprendida se comprueba con su salida ejecutada; una sola ruta exitosa no prueba optimalidad.",
      "transfer": "Para estudiar rutas de una bodega simulada, define estados, acciones, obstáculos y recompensas antes de aprender una política.",
      "stretch": "En tu copia, repite la demostración con Q fija, sin ejecutar el bloque de entrenamiento otra vez, y compara llegada a meta, pasos y recompensa de varios episodios."
    },
    "prerequisite": "Pronosticar estima lo que ocurrirá. En refuerzo una acción puede cambiar lo que ocurrirá después: necesitamos representar esa interacción.",
    "understanding": {
      "question": "¿Qué falta para que una ruta elegida manualmente sea aprendizaje por refuerzo?",
      "answer": "Que un agente use experiencias de estados, acciones y recompensas para actualizar su política o valores. Moverlo manualmente solo permite explorar el entorno y sus reglas."
    }
  },
  "ml-integracion": {
    "objective": "Construir un prototipo de predicción con una decisión de uso documentada.",
    "relevance": "Antes de cambiar una operación, expliquemos la evidencia y qué falta comprobar.",
    "concept": "Integrar ML significa justificar una cadena completa: pregunta, datos disponibles, preparación, método, comparación y decisión. La calidad de una solución depende de esa cadena, no de la complejidad del algoritmo. Una mejora en la prueba respalda una comparación concreta; para usarla en otra temporada o proceso necesitamos datos representativos y un plan de seguimiento.",
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
        "Ejecuta 1.1–1.6 desde el comienzo. Registra fila, entradas, respuesta, unidades y separación 180/60; identifica dónde se aprende la preparación.",
        "Conserva la tabla de MAE de referencia y candidata y las primeras filas de comparacion. Recalcula el error absoluto de una fila.",
        "Escribe cómo usarías la predicción para planear transporte: para un lote de área conocida, toneladas estimadas = t/ha predichas × hectáreas. Indica que falta evaluar errores en toneladas y comprobar otro periodo antes de usarla en operación."
      ],
      "check": "El caso pequeño da MAE 0,67 frente a 0,17 t/ha. Tu prototipo conserva sus propias cifras, usa una prueba reservada y puede repetirse desde la copia personal sin sustituir la respuesta por la predicción.",
      "transfer": "Para estimar duración de solicitudes, redefine fila, entradas y respuesta. Mantén preparación aprendida en entrenamiento, referencia y evaluación reservada.",
      "stretch": "En una celda nueva de tu copia, usa X_te.head(1), lineal.predict(X_te.head(1)) y y_te.loc[X_te.head(1).index] para inspeccionar entrada, predicción y observado de la misma fila reservada."
    },
    "prerequisite": "Los métodos resolvían preguntas distintas. Para integrarlos, vuelve a la pregunta original y reúne la evidencia de preparación, comparación y uso.",
    "understanding": {
      "question": "¿Qué evidencia necesitamos además de una métrica favorable?",
      "answer": "Casos representativos del uso esperado, separación correcta de datos, comparación justa con una referencia, revisión de errores y condiciones para supervisar o detener el uso. Tres casos ilustrativos no bastan."
    }
  },
  "dl-redes": {
    "objective": "Construir el cálculo de una neurona y rastrear cómo sus entradas producen una salida.",
    "concept": "Deep Learning pertenece al aprendizaje automático y construye reglas mediante redes de varias capas. Cada capa transforma una representación numérica para que la siguiente continúe el cálculo. La salida debe corresponder a la tarea. Empezaremos por una sola neurona: multiplicar entradas por pesos, sumar un sesgo y aplicar una activación. Seguir esta cuenta con parámetros fijados explica el funcionamiento; aprenderlos requiere el entrenamiento de los temas siguientes.",
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
        "Crea dos filas: sesgo, producto 2 × 0,5, producto 1 × (−1), suma z y salida ReLU. Usa sesgos 0,5 y −0,5; comprueba ambas filas en el explorador.",
        "Ejecuta la neurona explícita del bloque 09. Registra 0,6 × 2 − 0,2 − 0,5 = 0,5 y la salida sigmoide que imprime, aproximadamente 0,622.",
        "En esa celda cambia solo el sesgo de −0,5 a −1 y ejecútala de nuevo. Comprueba z = 0 y sigmoide = 0,5; conserva ambas cuentas."
      ],
      "check": "Cada salida se reproduce con sus entradas, pesos, sesgo y activación. Mover el sesgo a mano no se presenta como entrenamiento.",
      "transfer": "Usa el mismo registro para inspeccionar una neurona de una red pequeña: entrada, productos, sesgo, suma y transformación.",
      "stretch": "Crea una función con esos cinco elementos y verifica los dos casos de la web y los dos del cuaderno."
    },
    "prerequisite": "Conservamos de ML las entradas, la respuesta, el entrenamiento y la prueba. Lo nuevo es cómo varias capas construyen la regla y sus representaciones intermedias.",
    "understanding": {
      "question": "¿Qué diferencia una neurona, una capa y una red?",
      "answer": "Una neurona calcula una transformación; una capa reúne transformaciones que producen una representación; una red conecta capas. El entrenamiento cambia pesos y sesgos, mientras la inferencia usa los valores ya fijados."
    }
  },
  "dl-activaciones": {
    "objective": "Configurar una transformación de señales y comprobar su rango de salida.",
    "concept": "La activación transforma la suma producida por una neurona antes de pasarla a otra capa o a la salida. Su forma cambia qué patrones puede representar la red. Aquí comparamos ReLU, sigmoide y tanh con las mismas entradas para observar sus diferencias, sin entrenar parámetros. El significado de una salida depende también de la tarea: estar entre 0 y 1 no basta para ser una probabilidad calibrada.",
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
        "term": "ReLU",
        "meaning": "Función que devuelve el mayor entre cero y su entrada. Se usa habitualmente en capas intermedias."
      },
      {
        "term": "Sigmoide",
        "meaning": "Función que transforma un número en un valor entre 0 y 1. En una salida binaria puede representar una probabilidad estimada si la tarea y el entrenamiento lo justifican."
      },
      {
        "term": "tanh",
        "meaning": "Función que transforma su entrada en un valor entre −1 y 1."
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
        "Completa una tabla con tres entradas (−2, 0 y 2) y tres columnas de salida (ReLU, sigmoid y tanh) usando los controles.",
        "Marca qué función devuelve negativos, cuál convierte las entradas negativas en cero y cuál produce valores entre 0 y 1. Comprueba las curvas del bloque 09.",
        "Localiza nn.ReLU() y torch.sigmoid en el entrenamiento del bloque 09. Anota que BCEWithLogitsLoss recibe la salida sin sigmoide: no añadas otra antes de esa pérdida."
      ],
      "check": "Las nueve salidas coinciden con el explorador al redondear. ReLU(2) = 2, no 200 %; sigmoide(0) = 0,5, sin demostrar una probabilidad calibrada.",
      "transfer": "Antes de usar una salida en una regla de alerta, verifica su rango y significado; una activación no es una métrica de aciertos.",
      "stretch": "Reproduce las nueve salidas con las funciones de PyTorch y compara con tu tabla usando los valores sin redondear."
    },
    "prerequisite": "La neurona ya produjo una suma. La activación determina cómo se transforma antes de pasar a otra capa o a la salida.",
    "understanding": {
      "question": "¿Por qué apilar capas sin activaciones no lineales puede aportar menos de lo esperado?",
      "answer": "Una sucesión de transformaciones afines sigue siendo una transformación afín. Las activaciones no lineales permiten representar otros patrones. Eso aumenta capacidad, pero no garantiza buen desempeño sin datos y entrenamiento adecuados."
    }
  },
  "dl-entrenamiento": {
    "objective": "Ajustar un parámetro y diagnosticar un paso que empeora el resultado.",
    "concept": "Entrenar una red repite un ciclo: calcular salidas, medir pérdida, obtener gradientes y actualizar parámetros. La retropropagación y el optimizador cumplen funciones diferentes dentro de ese ciclo. El ejemplo reduce todo a un parámetro para ver cómo influye el tamaño del paso. En una red se actualizan muchos parámetros; reducir la pérdida de entrenamiento todavía no demuestra que funcione con casos nuevos.",
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
      },
      {
        "term": "Tasa de aprendizaje",
        "meaning": "Tamaño elegido para los pasos de actualización. Es un hiperparámetro, no un peso aprendido."
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
        "Guarda una fila por tasa con parámetro inicial, gradiente, tasa, parámetro nuevo y pérdida después de un paso. Reinicia antes de cambiar la tasa.",
        "En la celda de descenso del bloque 01, ejecuta 12 pasos con TASA = 0.10; registra peso y pérdida finales. Repite con 1.10 desde el mismo inicio y compara las trayectorias.",
        "Ejecuta el entrenamiento del bloque 09 con su configuración original. Registra pérdida inicial/final de la curva y la exactitud de prueba impresa; distingue los datos de cada resultado."
      ],
      "check": "La comparación de un paso reproduce −1/16 y 9/36. En la red, una curva descendente describe entrenamiento; la exactitud impresa usa los 80 casos reservados, sin prometer un porcentaje.",
      "transfer": "Al probar configuraciones de una red, conserva el inicio y registra pérdida y evaluación por separado. Si eliges mirando una reserva, úsala como validación y conserva otra prueba final.",
      "stretch": "En una copia, compara dos tasas del bloque 09 conservando semilla, separación y épocas; registra los resultados sin garantizar qué tasa ganará."
    },
    "prerequisite": "Ya podemos calcular una salida con pesos fijos. Aprender exige compararla con una respuesta y decidir cómo modificar los parámetros.",
    "understanding": {
      "question": "Si baja la pérdida de entrenamiento, ¿ya sabemos que la red generaliza?",
      "answer": "No. Hay que observar datos separados. Si la pérdida de entrenamiento baja y la de validación empieza a subir, puede haber sobreajuste. La prueba final permanece aparte de las decisiones de desarrollo."
    }
  },
  "dl-vision": {
    "objective": "Definir la salida visual que necesita una operación y probar una detección.",
    "concept": "En visión por computador elegimos una salida según la pregunta: una categoría por imagen, categorías y ubicaciones de objetos, o regiones de píxeles. Esa elección determina las anotaciones que necesitamos y la forma de evaluar. La escena conserva tres frutos para comparar tareas; sus cajas y máscaras son ilustrativas. El cuaderno ejecuta detección sobre una foto.",
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
      },
      {
        "term": "Píxel",
        "meaning": "Celda de una imagen digital. Su valor describe intensidad o color, no un objeto completo."
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
        "Escribe la necesidad «localizar objetos visibles para revisarlos» y especifica la salida: categoría, puntuación y cuatro coordenadas por caja. Compárala con etiqueta y máscara en el explorador.",
        "Ejecuta YOLO hasta la sección 6. Elige una fila, localiza su caja en la foto y registra categoría, puntuación, ancho y alto en píxeles.",
        "Comprueba ancho = x2 − x1 y alto = y2 − y1 con esa fila. Si la tabla está vacía, registra cero detecciones conservadas y revisa foto, categorías y umbral."
      ],
      "check": "Una fila se puede rastrear a su caja y sus dimensiones. No se atribuyen máscaras al detector ni se interpreta una tabla vacía como ausencia confirmada de objetos.",
      "transfer": "Para revisar equipos en una foto de bodega, define las categorías requeridas y la salida antes de decidir si necesitas clasificación, detección o segmentación.",
      "stretch": "Usa el recorte de la sección 9 de YOLO para comprobar las coordenadas de una caja sin añadir un segundo clasificador."
    },
    "prerequisite": "Una red recibe números. Antes de elegir un modelo para fotos, aclaremos cómo se representa una imagen y qué salida necesita la operación.",
    "understanding": {
      "question": "¿Qué etiquetas hay que preparar para clasificar, detectar y segmentar?",
      "answer": "Para clasificación, una categoría por imagen en la tarea descrita; para detección, categoría y caja por objeto; para segmentación, categorías o identidades por píxel. Son anotaciones diferentes y requieren evaluaciones acordes."
    }
  },
  "dl-cnn": {
    "objective": "Construir un mapa de filtro y distinguir cambios de imagen de cambios de pesos.",
    "concept": "Una red neuronal convolucional (CNN) construye representaciones usando operaciones locales que comparten pesos en distintas posiciones. Un filtro recorre la imagen y produce un mapa de respuestas; capas posteriores combinan esos mapas. En una CNN entrenada se aprenden los filtros. Aquí dejamos uno fijo para entender qué aporta cada ventana y cómo cambia la respuesta al cambiar los píxeles.",
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
        "meaning": "Región de píxeles que participa en un cálculo."
      },
      {
        "term": "Filtro",
        "meaning": "Pesos que se aplican en cada posición."
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
        "Calcula la primera ventana: multiplica cada píxel por su coeficiente y suma los nueve productos. Registra 3 con Horizontal y 1/3 con Promedio.",
        "Con Horizontal, recorre las nueve posiciones y construye el mapa [3,3,3], [3,3,3], [0,0,0]. Verifica cada celda con el explorador.",
        "Ejecuta el bloque 10 y registra la exactitud impresa de la CNN y una pareja «Real → pred.». Separa esos resultados del mapa del filtro fijo, que no es aprendido."
      ],
      "check": "El mapa manual 3 × 3 coincide celda a celda. El cuaderno clasifica dígitos; ni el filtro fijo ni su mapa localizan objetos por sí solos.",
      "transfer": "Para inspeccionar cambios de intensidad, un mapa de filtro puede ser una transformación intermedia; la aceptación del producto necesita una tarea y una evaluación propias.",
      "stretch": "Implementa el recorrido sin relleno y comprueba la dimensión 5 − 3 + 1 = 3 en ambos ejes."
    },
    "prerequisite": "Ya vimos píxeles y canales. Ahora una CNN transforma ventanas locales en mapas que otras capas pueden combinar.",
    "understanding": {
      "question": "¿Un filtro que responde a un borde ya reconoce un fruto?",
      "answer": "No. Produce un mapa de respuestas locales. Una CNN combina muchos filtros, activaciones y capas hasta obtener una salida de la tarea; sus pesos se aprenden con datos. El filtro fijo permite entender una sola operación."
    }
  },
  "dl-transferencia": {
    "objective": "Probar si un modelo existente cubre una necesidad antes de adaptarlo.",
    "concept": "El aprendizaje por transferencia reutiliza representaciones aprendidas con otros datos para una nueva tarea. Podemos conservar un extractor y aprender una salida nueva, o actualizar parte de sus parámetros. Antes debemos comprobar qué categorías y entradas admite el modelo y si sirve en las condiciones de uso. El cuaderno carga pesos y ejecuta inferencia; no realiza ajuste fino.",
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
        "term": "Preentrenado",
        "meaning": "Con parámetros ajustados previamente con otros datos."
      },
      {
        "term": "Ajuste fino",
        "meaning": "Actualizar parámetros previos con nuevos ejemplos."
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
        "Crea una ficha con categoría requerida, categoría original en modelo.names y decisión. Contrasta dos necesidades: localizar personas y detectar café defectuoso.",
        "Ejecuta la inferencia y el filtro de personas de la sección 9. Registra una detección si aparece; si no, deja constancia del resultado con ese umbral y esa foto.",
        "Completa la ficha: para personas se reutiliza una clase existente; para café defectuoso hacen falta datos etiquetados y adaptación fuera de este cuaderno. No cambies la traducción para simular una clase aprendida."
      ],
      "check": "La ficha distingue clase conocida, nombre traducido y clase ausente. Los resultados corresponden a inferencia con pesos previos, no a un entrenamiento realizado aquí.",
      "transfer": "Antes de reutilizar un detector en inventario, contrasta sus categorías con cada objeto requerido y revisa imágenes del entorno de uso.",
      "stretch": "Añade una comprobación que avise cuando una categoría solicitada no esté entre los valores de modelo.names."
    },
    "prerequisite": "Entrenar todos los filtros desde cero puede exigir muchos ejemplos. La transferencia reutiliza representaciones aprendidas y comprueba si sirven para la nueva tarea.",
    "understanding": {
      "question": "¿Cargar un detector y traducir sus categorías constituye ajuste fino?",
      "answer": "No. Cargarlo e inferir conserva los parámetros; traducir cambia el texto visible. El ajuste fino requiere entrenamiento adicional con datos y una pérdida. Evaluar el dominio local sigue siendo necesario."
    }
  },
  "dl-secuencias": {
    "objective": "Construir un resumen de una secuencia que tenga en cuenta el orden.",
    "concept": "Una secuencia conserva el orden de sus elementos: lecturas de un sensor, palabras o pasos de un proceso. La recurrencia incorpora la entrada actual a un estado que viene del paso anterior. Esa memoria permite que cambiar el orden cambie la salida, incluso con los mismos números. La regla fija de esta página explica el mecanismo; RNN y LSTM aprenden sus transformaciones durante el entrenamiento.",
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
        "term": "LSTM",
        "meaning": "Tipo de red recurrente con un estado de memoria y compuertas aprendidas que regulan conservar, actualizar y usar información."
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
        "Guarda tres filas por orden con entrada actual, estado anterior y estado nuevo. Comprueba los seis pasos en el explorador.",
        "Ejecuta la LSTM del bloque 11. Registra VENTANA = 12, CORTE = 180 y los MAE de LSTM y «último valor» impresos; no presupongas qué método gana.",
        "En el gráfico, compara ambas predicciones con la lectura simulada. Anota que cada predicción usa una ventana disponible y anticipa un solo instante, no toda la serie de una vez."
      ],
      "check": "Los estados finales son 21,25 y 13,75 pese a la misma media. La comparación del cuaderno usa futuro reservado y conserva el orden; su MAE no procede de la regla manual.",
      "transfer": "Para pronosticar una lectura de equipo, define cuándo estará disponible cada entrada y compara con una referencia simple como repetir la última lectura.",
      "stretch": "Inspecciona entradas[test, −1] y verifica que es la última lectura anterior al instante que se pronostica."
    },
    "prerequisite": "Una imagen conserva relaciones espaciales. Una secuencia conserva un orden temporal o de posiciones: no basta tratar sus elementos como una bolsa sin orden.",
    "understanding": {
      "question": "¿El estado recurrente guarda una copia exacta de todo lo anterior?",
      "answer": "No. Es un resumen que depende de la regla y de sus parámetros. En la demostración es una mezcla numérica fija; una RNN aprende su transformación y una LSTM usa mecanismos adicionales para regular la memoria."
    }
  },
  "dl-atencion": {
    "objective": "Construir una combinación ponderada de fuentes y rastrear su cálculo.",
    "concept": "La atención permite combinar información de varias posiciones según una consulta. Empecemos por una mezcla: dar pesos 0,75 y 0,25 a los valores 10 y 20 produce 12,5. En atención por producto escalar, los pesos se calculan comparando Q con cada K y aplicando escalado y softmax; después se combinan los V. En una red esas representaciones se obtienen con transformaciones aprendidas. Aquí sus valores están fijados para seguir el cálculo.",
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
      },
      {
        "term": "Vector",
        "meaning": "Lista ordenada de números que representa un elemento. Sus componentes no necesitan tener un significado físico individual."
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
        "Crea tres filas con consulta, dos productos Q·K, dos pesos y salida. Usa el explorador y comprueba salida = peso A × 10 + peso B × 20.",
        "Ejecuta la atención del bloque 12. Comprueba que las tres filas de pesos suman 1 y relaciona cada fila del mapa con la ficha que consulta.",
        "Selecciona una fila de la matriz atencion y verifica su combinación con V usando los valores sin redondear. Registra sus dos componentes de salida y compáralas con resultado."
      ],
      "check": "La tabla web reproduce las tres salidas. En el cuaderno, atencion @ V coincide con resultado; los pesos numéricos elegidos no demuestran relaciones semánticas aprendidas ni causas.",
      "transfer": "Para inspeccionar un bloque de atención, identifica primero quién consulta, cuáles son las fuentes y qué valores se mezclan.",
      "stretch": "Calcula np.allclose(atencion.sum(axis=1), 1) y verifica la combinación de una fila sin usar los pesos redondeados del gráfico."
    },
    "prerequisite": "La recurrencia resume el pasado paso a paso. La atención permite combinar directamente representaciones de varias posiciones; empezaremos por entender una mezcla ponderada.",
    "understanding": {
      "question": "¿Qué papel cumplen Q, K, V y los pesos de atención?",
      "answer": "Q plantea la comparación; K describe cada fuente para compararla; V contiene lo que se combinará. Las comparaciones producen pesos, y estos ponderan V. Un peso alto no demuestra una causa ni que la fuente sea correcta."
    }
  },
  "dl-transformers": {
    "objective": "Construir una prueba de clasificación de secuencias con respuestas verificables.",
    "concept": "Un Transformer es una arquitectura que usa atención junto con otras transformaciones para procesar secuencias. Representa cada unidad con números, incorpora posición y construye representaciones que dependen del contexto. Después una salida responde a la tarea. Nuestro laboratorio clasifica secuencias numéricas: la regla crea las etiquetas y el entrenamiento busca predecirlas. La arquitectura por sí sola no demuestra que esa regla se haya aprendido.",
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
        "Calcula a mano las cuatro etiquetas del ejemplo. Anota que invertir [1,2,3,4] cambia su etiqueta de 0 a 1 aunque conserve los mismos números.",
        "Ejecuta el Transformer del bloque 12. Registra los conteos de entrenamiento/prueba y la exactitud impresa; comprueba que no hay secuencias idénticas compartidas.",
        "Para los dos ejemplos que imprime la celda, guarda secuencia, etiqueta esperada y puntuación de clase 1. Revisa si cada salida favorece la clase esperada y distingue estos dos casos de la evaluación completa."
      ],
      "check": "Se conocen las etiquetas por la regla, pero no se inventan predicciones ni exactitud. Los ejemplos impresos son dos; la prueba completa contiene 129 secuencias con la semilla del cuaderno.",
      "transfer": "En una tarea con registros ordenados, define primero la respuesta comprobable y una reserva de secuencias distintas antes de elegir arquitectura.",
      "stretch": "En una copia, cambia ejemplos por nuevas secuencias de cuatro enteros de 1 a 7, calcula sus etiquetas y contrasta las clases con argmax. No las presentes como una prueba independiente sin revisar su presencia en entrenamiento."
    },
    "prerequisite": "Ya entendimos cómo atención mezcla valores. Ahora la ubicamos en una red completa que también necesita representar las unidades, su posición y la salida de la tarea.",
    "understanding": {
      "question": "¿Un Transformer es lo mismo que atención o que un chatbot?",
      "answer": "No. Atención es una operación dentro de la arquitectura. Un Transformer añade representación de entrada, posición y otras transformaciones. Puede resolver distintas tareas; el ejercicio clasifica secuencias numéricas y no genera conversación."
    }
  },
  "dl-yolo": {
    "objective": "Construir un registro de detecciones que pueda revisarse antes de contar objetos.",
    "concept": "YOLO es una familia de modelos para detectar objetos. En este cuaderno convierte una foto en propuestas con categoría, puntuación y caja. Filtrarlas produce un registro que podemos inspeccionar. Todavía hay que comprobar omisiones, clases equivocadas y duplicados antes de usar el conteo: una fila es una propuesta conservada, no una garantía de que exista un objeto distinto.",
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
        "Ejecuta YOLO hasta la sección 7. Elige una detección y registra su categoría, puntuación y coordenadas; comprueba que corresponde a una caja de la foto.",
        "Ejecuta la comparación de la sección 8 con 0,15; 0,50 y 0,85. Guarda los conteos que devuelve tu ejecución y revisa qué propuestas desaparecen; no son métricas de exactitud.",
        "Ejecuta la sección 11 para crear detecciones.csv, conteo.csv y configuracion.json. Comprueba que el total por categorías coincide con las filas de la tabla guardada, que usa UMBRAL = 0,25."
      ],
      "check": "Cada conteo puede rastrearse a filas y cajas. Los archivos finales pertenecen a la inferencia inicial de 0,25, no a cada panel de comparación; ningún conteo se presenta como inventario confirmado.",
      "transfer": "Para registrar objetos visibles en una bodega, conserva imagen y configuración, y revisa duplicados y omisiones antes de actualizar existencias.",
      "stretch": "Genera un identificador de imagen para cada fila al combinar varias fotos; no confundas detecciones repetidas entre fotos con objetos únicos."
    },
    "prerequisite": "Volvemos a detección: una arquitectura debe producir ubicaciones y categorías. YOLO es una familia concreta para esa tarea, con parámetros entrenados previamente en el cuaderno.",
    "understanding": {
      "question": "¿Qué información necesita una fila de detección para poder interpretarla?",
      "answer": "La imagen de origen, categoría, puntuación, coordenadas y convención de la caja. Después hay que revisar omisiones y duplicados; la cantidad de filas no es automáticamente la cantidad real de objetos."
    }
  },
  "dl-evaluacion": {
    "objective": "Construir una comprobación de localización que separe filtro y coincidencia.",
    "concept": "Evaluar un detector significa comprobar propuestas frente a objetos anotados. Una coincidencia requiere categoría correcta y suficiente acuerdo espacial, medido aquí con IoU. Primero filtramos por puntuación y después emparejamos propuestas con referencias: son decisiones diferentes. Con muchos objetos necesitamos correspondencias uno a uno para evitar contar varias veces el mismo acierto.",
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
        "term": "Referencia anotada",
        "meaning": "Categoría y ubicación que se usan como verdad de comparación, sujetas a la calidad de la anotación."
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
        "Crea tres filas con desplazamiento, umbral de puntuación, IoU mínima, IoU obtenida, TP, FP y FN. Reproduce las tres pruebas del explorador.",
        "Comprueba la primera IoU: intersección 30 × 40 = 1200; unión 1600 + 1600 − 1200 = 2000; cociente 0,60. Con desplazamiento 30, verifica 400/2800.",
        "En una foto del cuaderno YOLO, identifica qué falta para repetir la prueba: categoría y caja de referencia por objeto. Especifica también cómo evitarías emparejar dos propuestas con el mismo objeto."
      ],
      "check": "Las tres filas reproducen los conteos esperados. Se separan umbral de puntuación e IoU; no se atribuyen métricas mAP al cuaderno de inferencia.",
      "transfer": "Antes de aceptar una automatización de conteo, comprueba objetos omitidos, duplicados y coincidencias espaciales con referencias anotadas.",
      "stretch": "Comprueba los extremos en el explorador: desplazamiento 0 produce IoU 1; desplazamiento 40 produce IoU 0. Mantén la propuesta conservada para interpretar FP y FN."
    },
    "prerequisite": "Conservar una propuesta por puntuación solo decide qué sale del detector. Evaluarla exige compararla con objetos anotados y verificar clase y ubicación.",
    "understanding": {
      "question": "¿Por qué dos cajas para un solo objeto no deben contarse como dos aciertos?",
      "answer": "El emparejamiento de evaluación asigna como máximo una detección al objeto de referencia. Una propuesta adicional sin otro objeto coincidente es un falso positivo; tampoco se borra una omisión por descartar una caja."
    }
  },
  "dl-integracion": {
    "objective": "Construir una política de revisión con costes y una salida verificable.",
    "concept": "La última decisión consiste en convertir las salidas del modelo en acciones útiles. Aquí una política decide qué granos revisar y cuáles aceptar sin revisión. Comparamos políticas con los mismos casos y costes declarados, incluida revisar todos. La preferida puede cambiar al variar esos supuestos; elegirla con validación y evaluarla después conserva una comprobación independiente.",
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
        "term": "Coste supuesto",
        "meaning": "Valor elegido para comparar consecuencias en el ejemplo; no es un precio observado ni un parámetro aprendido."
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
        "Guarda las cuatro políticas de la tabla con coste 8 y añade la alternativa «revisar todos»: diez revisiones, cero defectos aceptados, coste 10.",
        "Repite con coste 1 sin modificar casos ni puntuaciones. Marca el mínimo y todos los empates: 0,30 es mínimo en el primer escenario; 0,70 y 0,90 empatan en el segundo.",
        "Escribe una regla para cada escenario: qué casos se revisan, cuáles se aceptan y qué coste supone. Declara que la revisión perfecta es una simplificación que habría que medir antes del uso."
      ],
      "check": "Cada coste se reproduce como revisiones × 1 + defectos aceptados × coste elegido. El mínimo cambia por el supuesto de coste, sin que el modelo haya aprendido de nuevo.",
      "transfer": "Para priorizar inspecciones, añade costes observados, capacidad de revisión y errores humanos; vuelve a comparar políticas con datos separados.",
      "stretch": "Genera una tabla para varios costes de defecto e incluye siempre revisar todos. Si agregas un límite de capacidad, declara qué políticas dejan de ser viables."
    },
    "prerequisite": "Una detección evaluada todavía debe convertirse en una acción útil. Ahora conectamos las salidas con revisión, capacidad y costes declarados.",
    "understanding": {
      "question": "¿La arquitectura más compleja produce necesariamente la mejor decisión operativa?",
      "answer": "No. La elección depende de datos representativos, errores, coste, capacidad y tiempo de respuesta. La política elegida con validación debe comprobarse en una prueba separada y supervisarse cuando cambien las condiciones."
    }
  }
};
