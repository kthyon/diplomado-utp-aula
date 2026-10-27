// Contexto de los encuentros pendientes. Los seis temas de los encuentros 1 y 2 no se modifican.
export const MEETING_CONTEXT={
 'ml-3':{title:'Una cooperativa necesita entender sus registros antes de elegir un modelo',story:'Una cooperativa recibe tablas ya preparadas y enfrenta tres preguntas. Primero compara centros de acopio por sus indicadores; después resume medidas que cambian juntas; finalmente contrasta modelos de rendimiento para planear transporte. Cada pregunta usa la tabla que le corresponde: relacionaremos los métodos sin confundir sus datos ni sus resultados.',route:['Agrupar filas parecidas para investigar, sin inventar categorías de calidad.','Resumir columnas y explicar qué variación se conserva.','Combinar predicciones y comprobar si reducen el error frente a una referencia.'],result:'Una explicación que asocie cada pregunta con su método y permita rastrear el resultado hasta los registros originales.',evidence:{kind:'Datos reales para investigación',title:'Mediciones de granos de fríjol',text:'El repositorio UCI documenta imágenes de 13.611 granos, siete variedades y 16 características de forma. Esto muestra por qué una tabla agrícola puede tener muchas medidas relacionadas. La fuente plantea clasificación; usar sus medidas para explorar grupos o componentes sería otra pregunta, no un resultado garantizado.',url:'https://archive.ics.uci.edu/dataset/602/dry+bean+dataset',label:'UCI · Dry Bean'}},
 'ml-4':{title:'Planear una operación exige distinguir pronósticos de decisiones',story:'Una comercializadora de productos perecederos prepara su siguiente periodo de compras. Conocer lo que podría vender ayuda a planear, pero no determina por sí solo qué acción conviene. Además, una decisión puede cambiar lo que ocurrirá después. Cerraremos ML explicando qué evidencia respalda cada propuesta.',route:['Emitir un pronóstico usando solo información disponible en la fecha de decisión.','Distinguir predecir de aprender una secuencia de acciones mediante interacción.','Comparar una candidata con una regla sencilla y declarar qué falta antes de usarla.'],result:'Una ficha de prototipo con pregunta, entradas disponibles, referencia, prueba reservada y límite de uso.',evidence:{kind:'Sistema de investigación aplicado',title:'Pronósticos de precios para productos perecederos',text:'Un trabajo de investigación construyó un sistema de pronóstico con datos de Agmarknet y evaluó sus resultados con registros y una pequeña encuesta de mercados. Ilustra una necesidad real de información; no demuestra que nuestras ventas simuladas, ni una predicción aislada, produzcan una ganancia económica.',url:'https://arxiv.org/abs/1812.05173',label:'Estudio original · pronóstico de precios'},extra:{kind:'Investigación en simulador',title:'Decidir mediante interacción: gym-DSSAT',text:'gym-DSSAT estudia decisiones de manejo mediante un simulador de crecimiento de cultivos. Sus resultados preliminares no son una validación de una política en una finca real. Nuestro tablero de casillas conserva solo la idea estado → acción → consecuencia.',url:'https://openreview.net/pdf?id=4vNeWNQc3U',label:'Publicación original · gym-DSSAT'}},
 'dl-1':{title:'Antes de programar una red, sigamos una sola cuenta',story:'Un equipo quiere que una herramienta aprenda patrones a partir de ejemplos de productos o plantas. Para entender una red no empezaremos con una arquitectura completa: seguiremos qué entra, cuánto aporta cada entrada, cómo se transforma la suma y cómo una comparación con la respuesta conocida permite ajustar parámetros.',route:['Calcular una neurona con dos entradas y pesos dados.','Comparar tres transformaciones de la misma señal.','Observar una actualización y separar aprendizaje de comprobación con casos nuevos.'],result:'El rastro de una cuenta: entradas → productos → suma → activación → salida → pérdida → ajuste.',evidence:{kind:'Resultado de investigación',title:'Clasificar imágenes de hojas con redes profundas',text:'PlantVillage permitió estudiar clasificación de imágenes de hojas. El trabajo reportó resultados altos en su prueba controlada y una caída importante con imágenes de otras condiciones. Es una razón para aprender redes y, a la vez, separar el ajuste de la comprobación fuera del entorno de entrenamiento.',url:'https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2016.01419/full',label:'Estudio original · clasificación de hojas'}},
 'dl-2':{title:'Una misma foto puede exigir tres productos distintos',story:'En una operación de recepción, una foto puede servir para seleccionar imágenes, localizar frutos o delimitar su superficie visible. Son necesidades diferentes. Elegiremos primero la salida, después entenderemos una operación local de la red y finalmente comprobaremos qué puede reutilizarse de un modelo ya entrenado.',route:['Elegir entre etiqueta de imagen, cajas de objetos o regiones de píxeles.','Seguir una ventana y un filtro antes de interpretar una CNN completa.','Verificar las categorías del modelo y distinguir inferencia de adaptación.'],result:'Una especificación de entrada, salida y comprobación; no basta con elegir un modelo conocido.',evidence:{kind:'Investigación, con alcance limitado',title:'Una etiqueta de hoja no localiza cada lesión',text:'El estudio de PlantVillage clasifica imágenes de hojas; no demuestra que cualquier foto de campo pueda diagnosticarse ni que una etiqueta delimite lesiones. En clase distinguimos esa salida global de las cajas y máscaras que requerirían otras preguntas y anotaciones.',url:'https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2016.01419/full',label:'Estudio original · tarea y condiciones'}},
 'dl-3':{title:'El orden de las lecturas puede cambiar la interpretación',story:'Un equipo revisa una secuencia de señales antes de planear una operación. Los mismos tres valores pueden describir una subida o una bajada. Primero veremos cómo conservar información del pasado; después cómo combinar fuentes; por último ubicaremos atención y posición dentro de una arquitectura.',route:['Comparar dos órdenes con los mismos números y reconstruir un estado.','Calcular una mezcla de valores a partir de pesos explícitos.','Distinguir una regla de etiquetado de lo que aprende un Transformer.'],result:'Una tabla que permita explicar qué información usa cada salida y cómo se comprueba.',evidence:{kind:'Pronóstico operativo documentado',title:'Redes recurrentes para anticipar caudales',text:'Una investigación publicada en Nature describe pronósticos de caudal con redes LSTM que usan secuencias meteorológicas históricas y pronosticadas. Motiva el valor del orden y del horizonte. No es el modelo de nuestra práctica ni demuestra que atención o un Transformer sean la arquitectura de ese sistema.',url:'https://www.nature.com/articles/s41586-024-07145-1',label:'Publicación original · pronóstico de caudales'}},
 'dl-4':{title:'Pasar de una imagen a una acción exige comprobar varias cosas',story:'Una operación quiere usar imágenes para apoyar una inspección. Obtener una caja y una puntuación es apenas el comienzo: hay que verificar qué objeto corresponde a cada propuesta, qué quedó sin detectar y qué consecuencias tiene revisar o aceptar un caso. Mantendremos separadas esas decisiones.',route:['Rastrear una detección desde la imagen hasta una fila de registro.','Comparar propuestas con referencias anotadas y contar errores.','Elegir una política de revisión con costes, capacidad y límites declarados.'],result:'Un registro de propuestas y una decisión justificable; un conteo del detector todavía no es un inventario confirmado.',evidence:{kind:'Aplicación comercial documentada',title:'Visión y decisiones selectivas en agricultura',text:'Blue River Technology describe See & Spray como un sistema que combina visión, aprendizaje profundo y actuación selectiva sobre plantas. Es una aplicación comercial del proceso percepción → decisión → acción. La descripción del fabricante no valida nuestro cuaderno ni demuestra que ese producto use la familia YOLO.',url:'https://www.bluerivertechnology.com/products/',label:'Fabricante · funcionamiento de See & Spray'}}
};

export const TOPIC_CONTEXT={
  "ml-clustering": {
    "meeting": "ml-3",
    "question": "¿Qué registros conviene revisar juntos y cuál merece una revisión individual?",
    "situation": "La cooperativa no tiene etiquetas que digan a qué grupo pertenece cada centro de acopio. Quiere comenzar una revisión por registros parecidos, en lugar de recorrer la tabla sin un criterio.",
    "known": "Recibimos una tabla preparada. Cada fila es un centro de acopio: X describe capacidad utilizada y Y lotes pendientes, ambos como porcentajes del periodo. Elegir qué columnas comparar y en qué escala forma parte de definir la similitud.",
    "decision": "Organizar una exploración: qué filas revisar juntas y cuáles investigar por separado. Un grupo no se llamará automáticamente «bueno», «malo» o «apto»."
  },
  "ml-pca": {
    "meeting": "ml-3",
    "question": "¿Cómo resumir varias medidas sin confundir resumen con predicción?",
    "situation": "La misma cooperativa tiene varias medidas por centro de acopio. Si algunas cambian juntas, mirar cada una por separado dificulta explorar los registros. Quiere una representación más pequeña y saber qué información pierde.",
    "known": "Una fila sigue siendo el mismo centro de acopio. Las columnas son sus medidas. Antes de PCA se decide cómo centrar y, cuando corresponda, escalar esas medidas usando el entrenamiento.",
    "decision": "Elegir una representación para explorar la tabla. El porcentaje que conserva esa representación no califica la calidad ni la rentabilidad de un centro."
  },
  "ml-ensambles": {
    "meeting": "ml-3",
    "question": "¿Combinar varias estimaciones mejora una referencia sencilla?",
    "situation": "La cooperativa usa estimaciones de rendimiento para preparar transporte. Dos modelos dan valores diferentes para los mismos lotes. El equipo quiere saber si combinarlos ayuda, en vez de elegir el más complejo por su nombre.",
    "known": "Cada fila de la comparación es un lote reservado. Tenemos su rendimiento observado y dos predicciones hechas sin usar la respuesta de esa fila para ajustar los modelos.",
    "decision": "Seleccionar una candidata para seguir evaluando con el mismo error y los mismos casos. Un error menor en esta prueba no demuestra un ahorro de transporte."
  },
  "ml-series": {
    "meeting": "ml-4",
    "question": "¿Qué podíamos pronosticar con lo que sabíamos en ese momento?",
    "situation": "Una comercializadora debe planear compras antes de conocer las ventas siguientes. Si compra demasiado puede acumular producto perecedero; si compra poco puede no atender pedidos. Estimaremos cantidades, sin convertirlas todavía en una orden de compra.",
    "known": "Cada fila es una semana y cada valor es una cantidad vendida. La fecha de corte marca qué ventas ya se conocían al emitir el pronóstico.",
    "decision": "Comparar reglas que anticipan el mismo periodo futuro. La cantidad a comprar requeriría además existencias, plazos y consecuencias que esta cuenta no modela."
  },
  "ml-refuerzo": {
    "meeting": "ml-4",
    "question": "¿Qué cambia cuando una decisión modifica la situación siguiente?",
    "situation": "Para preparar un pedido en una bodega, una secuencia de movimientos puede ahorrar o añadir pasos. Esta situación ayuda a distinguir elegir acciones de pronosticar una cantidad. No vamos a automatizar equipos ni trasladar recompensas del tablero a una finca.",
    "known": "El ejemplo entrega un entorno completo: casillas, inicio, meta, obstáculos y consecuencias. Una casilla es un estado; un movimiento es una acción; una recompensa es un número definido por el ejercicio.",
    "decision": "Aprender una regla para elegir acciones según el estado. Antes de entrenar, reconstruiremos manualmente un recorrido para entender las consecuencias."
  },
  "ml-integracion": {
    "meeting": "ml-4",
    "question": "¿Qué evidencia mínima hace defendible una propuesta de ML?",
    "situation": "Al terminar ML, la cooperativa solicita una propuesta comprensible para planear transporte. Quiere saber qué dato entra, qué cantidad sale, cuánto se equivoca y en qué condiciones debe volver a comprobarse.",
    "known": "Disponemos de una tabla preparada y de respuestas observadas para una prueba reservada. Las predicciones de referencia y candidata se comparan con exactamente las mismas filas.",
    "decision": "Decidir si vale la pena continuar probando la candidata. El resultado no es una recomendación de fertilización ni una autorización para automatizar compras."
  },
  "dl-redes": {
    "meeting": "dl-1",
    "question": "¿Qué hace una neurona antes de que una red pueda aprender?",
    "situation": "Queremos comprender cómo una red transforma números que describen una planta o un producto. En lugar de empezar con muchas capas, seguiremos una sola unidad de cálculo con dos entradas.",
    "known": "Una entrada es un número que describe el caso. Un peso multiplica ese número; el sesgo añade un ajuste. En este ejemplo elegimos todos los valores para poder reconstruir la cuenta.",
    "decision": "Entender cómo se produce una salida. Todavía no decidimos si un producto tiene un defecto ni afirmamos que la neurona reconozca enfermedades."
  },
  "dl-activaciones": {
    "meeting": "dl-1",
    "question": "¿Por qué la misma suma puede producir respuestas diferentes?",
    "situation": "La neurona ya calculó una señal. Ahora debemos entender qué transformación se aplica antes de pasarla a la siguiente capa o a la salida. Esa elección afecta lo que la red puede representar.",
    "known": "Recibimos la misma entrada numérica para las tres funciones. Aquí «entrada» es la señal que recibe la activación, no una nueva fotografía o un dato adicional del cultivo.",
    "decision": "Distinguir las formas y rangos de ReLU, sigmoide y tanh. Observar una curva no equivale a elegir una arquitectura validada para una operación."
  },
  "dl-entrenamiento": {
    "meeting": "dl-1",
    "question": "¿Cómo se modifica un parámetro después de medir un error?",
    "situation": "Una red debe ajustar sus parámetros a partir de ejemplos, no porque alguien mueva controles hasta obtener una salida bonita. Reduciremos el ciclo a una cuenta para ver por qué el tamaño del cambio importa.",
    "known": "El ejercicio empieza con un parámetro −2 y un objetivo 3. La pérdida es una regla elegida para medir su separación: (parámetro − 3)².",
    "decision": "Comparar dos tamaños de actualización desde el mismo inicio. Una tasa que funciona en esta cuenta no es una receta para entrenar cualquier red."
  },
  "dl-vision": {
    "meeting": "dl-2",
    "question": "¿Qué debe entregar la herramienta para ayudar en una inspección?",
    "situation": "Un centro de recepción toma una foto de productos. Para seleccionar fotos le basta una etiqueta; para ubicar cada fruto necesita cajas; para examinar su región visible necesita máscaras. Empezar por la salida evita pedirle al modelo una tarea distinta de la necesaria.",
    "known": "La escena contiene tres frutos dibujados. Conservamos la misma imagen y cambiamos la pregunta; no se está ejecutando un detector en el dibujo.",
    "decision": "Especificar una salida útil: etiqueta de toda la imagen, cajas por objeto o regiones de píxeles. Cada una exige referencias de comparación distintas."
  },
  "dl-cnn": {
    "meeting": "dl-2",
    "question": "¿Cómo convierte una pequeña zona de una imagen en un número?",
    "situation": "Para inspeccionar imágenes necesitamos entender de dónde salen las respuestas de una CNN. Antes de interpretar una fotografía completa, seguiremos nueve píxeles y un filtro sencillo.",
    "known": "Un píxel es una celda numérica de la imagen. El ejemplo usa solo 0 y 1 para oscuro y claro. Un filtro es una pequeña tabla de pesos que se reutiliza en distintas posiciones.",
    "decision": "Comprender una operación local y su mapa de respuestas. Un borde detectado no es todavía un fruto, un defecto ni un diagnóstico."
  },
  "dl-transferencia": {
    "meeting": "dl-2",
    "question": "¿El modelo que descargamos reconoce realmente lo que necesitamos?",
    "situation": "La cooperativa busca inspeccionar café, pero dispone de un detector entrenado con objetos comunes. Es útil reutilizar trabajo previo siempre que se compruebe su alcance; cambiar el nombre visible de una clase no le enseña otra.",
    "known": "Un archivo de pesos contiene parámetros ya entrenados. El modelo también entrega un catálogo de categorías que debemos revisar antes de inferir sobre fotos propias.",
    "decision": "Establecer qué se puede usar directamente y qué requeriría adaptación y prueba. No iniciaremos un entrenamiento costoso ni presentaremos categorías nuevas como aprendidas."
  },
  "dl-secuencias": {
    "meeting": "dl-3",
    "question": "¿Una subida y una bajada significan lo mismo si contienen los mismos valores?",
    "situation": "Un equipo observa señales de un proceso antes de decidir cuándo revisar una operación. Un promedio puede ocultar si los valores están subiendo o bajando. Necesitamos conservar el orden.",
    "known": "Cada posición corresponde a un paso. Usamos 10, 20 y 30 cajas recibidas en horas sucesivas; invertimos el orden sin cambiar las cantidades.",
    "decision": "Entender una memoria de cálculo. La última cifra del estado no será una temperatura pronosticada ni una alarma de proceso."
  },
  "dl-atencion": {
    "meeting": "dl-3",
    "question": "¿Cómo combinar información de varias fuentes según lo que estamos consultando?",
    "situation": "Imagina una revisión de dos registros de una operación. No siempre interesa combinar sus valores con la misma importancia: la consulta determina el reparto. Usaremos dos fuentes abstractas para entender la cuenta, sin atribuirles efectos agronómicos.",
    "known": "A aporta 10 cajas y B aporta 20. Cada fuente tiene una clave numérica para compararla con la consulta. Estos vectores y valores son dados para el ejercicio.",
    "decision": "Interpretar un reparto y su resultado. Un peso alto no demuestra que una fuente cause el resultado ni que sea más fiable en la realidad."
  },
  "dl-transformers": {
    "meeting": "dl-3",
    "question": "¿Qué aporta la posición cuando una red debe responder sobre una secuencia?",
    "situation": "Una operación puede necesitar distinguir el valor inicial del final, aunque los números intermedios sean los mismos. Para comprender un Transformer usaremos una regla conocida que permite comprobar cada etiqueta a mano.",
    "known": "Cada entrada tiene cuatro cantidades de cajas recibidas en horas sucesivas. La respuesta esperada es 1 cuando el primero supera al último y 0 en caso contrario. Esa regla define las etiquetas; no es todavía lo que predice la red.",
    "decision": "Comprobar si una arquitectura aprende una tarea de orden. Este banco de pruebas no pronostica rendimientos ni genera recomendaciones de un asistente."
  },
  "dl-yolo": {
    "meeting": "dl-4",
    "question": "¿Qué significa una fila producida por un detector?",
    "situation": "Una operación de inspección quiere pasar de fotos a un registro revisable. Necesita poder volver de cada fila a la imagen para comprobar qué objeto propuso el detector antes de usar un conteo.",
    "known": "El modelo recibe una imagen y propone categoría, puntuación y caja. En el esquema trabajaremos con una única propuesta de puntuación 0,80 y una referencia visible.",
    "decision": "Conservar propuestas para inspección. Una fila no garantiza un objeto distinto ni autoriza actualizar existencias sin revisar duplicados y omisiones."
  },
  "dl-evaluacion": {
    "meeting": "dl-4",
    "question": "¿La caja que conservamos coincide con un objeto anotado?",
    "situation": "La inspección necesita saber no solo cuántas filas produjo el detector, sino cuáles corresponden a objetos y cuáles faltan. Para comprobarlo hace falta una referencia independiente.",
    "known": "Un objeto tiene categoría y caja anotadas. La candidata aporta otra caja, la misma categoría y puntuación 0,80. La anotación se entrega; esta práctica no enseña a recolectar imágenes.",
    "decision": "Aceptar o rechazar una coincidencia según un criterio declarado y contar aciertos, falsas propuestas y omisiones."
  },
  "dl-integracion": {
    "meeting": "dl-4",
    "question": "¿Qué política de revisión tiene sentido con estas consecuencias?",
    "situation": "Una operación puede revisar algunos granos y aceptar otros sin inspección. Revisar cuesta tiempo; dejar pasar un defecto también tiene consecuencias. La puntuación de una red no elige por sí sola esa política.",
    "known": "El ejercicio entrega diez granos ficticios, sus puntuaciones, sus etiquetas y dos costes supuestos. La revisión se considera perfecta únicamente para simplificar la comparación.",
    "decision": "Comparar políticas con los mismos casos y declarar qué se revisa y qué se acepta. Antes del uso real habría que considerar capacidad y error humano."
  }
};

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function evidenceCard(e){return `<div class="context-evidence"><span class="eyebrow">${esc(e.kind)}</span><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p><a class="inline-link" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${esc(e.label)} ↗</a></div>`;}
export function renderMeetingContext(courseId,index){const c=MEETING_CONTEXT[courseId+'-'+(index+1)];if(!c)return '';return `<section class="meeting-context"><h4>El problema que guía este encuentro</h4><p>${esc(c.story)}</p><ol>${c.route.map(t=>`<li>${esc(t)}</li>`).join('')}</ol><p><b>Con qué salimos:</b> ${esc(c.result)}</p></section>`;}
export function renderTopicContext(id,objective){const t=TOPIC_CONTEXT[id];if(!t)return '';return `<section class="panel learning-goal topic-context organized-context"><div class="eyebrow">LA PREGUNTA DE ESTE TEMA</div><h2>${esc(t.question)}</h2><p>${esc(t.situation)}</p><details class="context-detail"><summary>Contexto del caso: datos y decisión</summary><p><b>Objetivo al terminar:</b> ${esc(objective)}</p><dl class="context-brief"><div><dt>Qué información tenemos</dt><dd>${esc(t.known)}</dd></div><div><dt>Qué queremos decidir</dt><dd>${esc(t.decision)}</dd></div></dl></details></section>`;}
export function renderCaseEvidence(id){const t=TOPIC_CONTEXT[id];if(!t)return '';const first=Object.keys(TOPIC_CONTEXT).find(k=>TOPIC_CONTEXT[k].meeting===t.meeting)===id;if(!first)return '';const c=MEETING_CONTEXT[t.meeting];return `<details class="context-case"><summary>Un caso documentado para situar este encuentro</summary>${evidenceCard(c.evidence)}${c.extra?evidenceCard(c.extra):''}</details>`;}
export function renderTopicOutcome(g){if(!g.outcome)return '';return `<div class="context-outcome"><h3>Resultado y cómo interpretarlo</h3><p><b>${esc(g.outcome.title)}:</b> ${esc(g.outcome.result)}</p><p>${esc(g.outcome.reading)}</p></div>`;}
export function renderTopicVocabulary(id,vocabulary,count=4){const list=items=>`<dl class="concept-glossary">${items.map(v=>`<div><dt>${esc(v.term)}</dt><dd>${esc(v.meaning)}</dd></div>`).join('')}</dl>`;if(!TOPIC_CONTEXT[id])return list(vocabulary);const dictionary=items=>`<div class="term-dictionary">${items.map(v=>`<details class="term-definition"><summary>${esc(v.term)}</summary><p>${esc(v.meaning)}</p></details>`).join('')}</div>`;return `<details class="topic-vocabulary"><summary>Palabras y siglas de este tema <span>${vocabulary.length} definiciones para consultar cuando las necesites</span></summary>${dictionary(vocabulary.slice(0,count))}${vocabulary.length>count?`<details class="context-vocabulary"><summary>Vocabulario para profundizar</summary>${dictionary(vocabulary.slice(count))}</details>`:''}</details>`;}
