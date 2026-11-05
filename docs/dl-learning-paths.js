// Recorrido básico de Deep Learning. Las cifras de los ejemplos son didácticas;
// los resultados de modelos entrenados se leen al ejecutar cada cuaderno.
export const DL_LEARNING_PATHS = {
 'dl-redes': {
  goal:'Explicar qué entra a una neurona, qué hacen sus parámetros y cómo su salida alimenta otra capa.',
  definition:'Deep Learning (aprendizaje profundo) es parte de Machine Learning (aprendizaje automático), que pertenece a la inteligencia artificial (IA). Una red neuronal transforma números mediante capas de unidades de cálculo. En cada unidad, los pesos multiplican entradas, el bias suma un ajuste y una activación produce la salida.',
  terms:[
   ['Entrada','Número que recibe la unidad para calcular su respuesta.'],
   ['Peso y bias','El peso multiplica una entrada; el bias, o sesgo, se suma a los aportes. Son parámetros que pueden aprenderse.'],
   ['Capa y activación','Una capa reúne unidades. La activación transforma la suma de cada una; su salida puede entrar a otra capa.']
  ],
  example:{
   question:'¿Cómo se transforma un par de números en una salida?',
   intro:'Seguimos una neurona con dos señales abstractas, 2 y 1. Entradas, pesos y bias fueron elegidos para ver la cuenta; no son mediciones de una planta.',
   reading:'Sigue las flechas: cada entrada se multiplica por su peso. Los aportes 1 y −1 se suman con bias 0,5. ReLU conserva la suma positiva: sale 0,5.',
   takeaway:'Usar parámetros actuales es inferencia. Cambiar un control a mano explora el cálculo; todavía no entrena la neurona.',
   check:{question:'Si la siguiente capa recibe 0,5, ¿recibe un dato nuevo o una transformación de las entradas?',answer:'Recibe una transformación de las mismas entradas. Encadenar capas permite construir nuevas representaciones; no añade por sí solo una medición nueva.'}
  },
  practice:{
   title:'Comprueba qué aporta el bias',
   prompt:'Pulsa «Restablecer ejemplo» y observa entrada, productos, suma y salida.',
   change:'Cambia solo «Sesgo b» de 0,5 a −0,5.',
   watch:'Los productos de las entradas permanecen iguales; se desplaza la suma antes de ReLU.',
   expected:'La salida pasa de 0,5 a 0. No ocurrió aprendizaje: cambiaste un parámetro a mano.'
  },
  colab:{
   goal:'Reconstruir una neurona y seguir su salida hacia otra capa con parámetros dados.',
   steps:['Abre tu copia de dl-encuentro-1.ipynb en Tema 1 y ejecuta su preparación.','Ejecuta el cálculo de la neurona; identifica entradas, productos, bias y activación en su salida.','Continúa con las capas en cadena y sigue qué salida se convierte en entrada de la siguiente.'],
   check:'Puedes señalar qué números son datos, cuáles son parámetros y qué transformación produce cada salida. Calcular no modifica los parámetros.'
  }
 },
 'dl-activaciones': {
  goal:'Comparar activaciones con la misma entrada y explicar por qué permiten respuestas diferentes.',
  definition:'Una activación es una función: una regla que transforma la suma de una neurona. ReLU deja lo positivo y convierte lo negativo en cero; la sigmoide comprime a un valor entre 0 y 1; tanh, entre −1 y 1. Las activaciones no lineales permiten relaciones que varias multiplicaciones y sumas solas no representan.',
  terms:[
   ['Suma z','Resultado anterior a la activación: productos de entradas por pesos, más bias.'],
   ['ReLU','Rectified Linear Unit: unidad lineal rectificada. Devuelve el mayor entre cero y z.'],
   ['No linealidad','Transformación que permite que el recorrido completo vaya más allá de una única regla de multiplicar y sumar.']
  ],
  example:{
   question:'¿Qué cambia si la misma señal pasa por tres activaciones?',
   intro:'La señal interna es −2. La enviamos por tres caminos alternativos, manteniendo exactamente la misma entrada.',
   reading:'Lee una salida por camino: ReLU produce 0; sigmoide, aproximadamente 0,119; tanh, aproximadamente −0,964. No son tres pasos consecutivos.',
   takeaway:'La activación transforma; no aprende por sí sola. La función y la tarea determinan cómo interpretar su salida.',
   check:{question:'¿ReLU(2) significa una probabilidad del 200 %?',answer:'No. ReLU(2)=2 es una señal transformada, no un porcentaje. Incluso un valor entre 0 y 1 necesita un significado definido y comprobado antes de interpretarse como probabilidad.'}
  },
  practice:{
   title:'Compara conservando la entrada',
   prompt:'Fija «Señal de entrada» en −2 y lee el punto de la curva.',
   change:'Cambia «Función» entre ReLU, Sigmoid y tanh. Después repite con 0 y con 2.',
   watch:'El eje horizontal conserva la entrada; la altura del punto muestra la salida de la función elegida.',
   expected:'Con entrada 0, ReLU y tanh dan 0; sigmoide da 0,5. La diferencia viene de la función, no de otro dato.'
  },
  colab:{
   goal:'Comparar una señal y las curvas de activación, manteniendo sus entradas.',
   steps:['En dl-encuentro-1.ipynb, Tema 2, ejecuta su preparación y la comparación de activaciones.','Pon el mismo valor de SENAL en la celda de tabla y en la de curvas; ejecuta ambas. Son celdas independientes.','Lee sus curvas: entrada en horizontal, salida en vertical; relaciona cada punto con la tabla.'],
   check:'Puedes distinguir cuáles salidas admiten negativos o valores mayores que 1 y explicar por qué cambiar la función no equivale a entrenar.'
  }
 },
 'dl-entrenamiento': {
  goal:'Distinguir predecir de aprender y explicar cómo un ajuste puede reducir o aumentar la pérdida.',
  definition:'Entrenar de forma supervisada usa entradas y respuestas conocidas para ajustar parámetros. Primero se predice y se calcula una pérdida, que mide el desacuerdo. La retropropagación calcula gradientes; el optimizador los usa para actualizar pesos y bias. La tasa de aprendizaje regula el tamaño del cambio. Después hay que comprobar casos nuevos.',
  terms:[
   ['Etiqueta','Respuesta conocida que permite comparar durante el entrenamiento; no se entrega al predecir un caso nuevo.'],
   ['Pérdida y gradiente','La pérdida mide desacuerdo. El gradiente indica cómo cambia localmente esa pérdida al modificar los parámetros.'],
   ['Tasa de aprendizaje','Número que regula el tamaño de cada actualización. Una tasa mayor no garantiza una mejora mayor.']
  ],
  example:{
   question:'¿Por qué un paso grande puede empeorar el ajuste?',
   intro:'Para ver una sola actualización, un parámetro empieza en −2 y buscamos acercarlo a 3. Elegimos como pérdida el cuadrado de la diferencia. Las dos alternativas parten del mismo inicio.',
   reading:'El paso pequeño se acerca al objetivo y baja la pérdida de 25 a 16. El paso excesivo lo sobrepasa y la sube a 36. El objetivo permanece quieto.',
   takeaway:'Predecir usa parámetros; aprender los cambia. Reducir la pérdida de entrenamiento no demuestra todavía que funcionen en casos nuevos.',
   check:{question:'Si cambias la tasa pero todavía no aplicas el paso, ¿ya cambió el parámetro?',answer:'No. Preparaste otra actualización. El parámetro cambia al aplicar el paso con esa tasa y el gradiente calculado.'}
  },
  practice:{
   title:'Compara dos pasos desde el mismo inicio',
   prompt:'Pulsa «Reiniciar», fija «Tasa de aprendizaje» en 0,10 y pulsa «Dar un paso».',
   change:'Reinicia antes de repetir con tasa 1,10.',
   watch:'Distingue la propuesta pendiente del último paso aplicado y compara la pérdida después de cada actualización.',
   expected:'Con tasa 0,10, el parámetro llega a −1; con 1,10, a 9. El segundo sobrepasa el objetivo.'
  },
  colab:{
   goal:'Seguir un paso de ajuste y después comprobar el entrenamiento de una red pequeña.',
   steps:['En dl-encuentro-1.ipynb, Tema 3, ejecuta su preparación y el ejemplo de un parámetro.','Compara las dos tasas reiniciando ese ejemplo; después ejecuta la red pequeña desde su inicio.','Lee por separado la pérdida de entrenamiento y la evaluación de los ejemplos reservados.'],
   check:'Explicas qué se actualizó y con qué datos. En la clasificación del cuaderno, y=1 significa sano; la pérdida y la exactitud de esa red no son las de la cuenta manual.'
  }
 },
 'dl-vision': {
  goal:'Elegir entre etiqueta, caja y máscara según la pregunta que debe responder una imagen.',
  definition:'Una imagen digital guarda números en posiciones llamadas píxeles. En RGB (Red, Green, Blue: rojo, verde y azul), cada píxel guarda tres componentes. La visión por computador transforma estos números para responder tareas. Clasificar describe la imagen; detectar localiza objetos; segmentar marca píxeles. Cada tarea necesita respuestas de referencia y una evaluación apropiadas.',
  terms:[
   ['Píxel y canal','Un píxel es una posición de imagen; un canal guarda una componente, como rojo, verde o azul.'],
   ['Caja','Rectángulo que localiza un objeto y puede incluir fondo a su alrededor.'],
   ['Máscara','Marca de píxeles de interés. Las máscaras de instancias permiten separar objetos de la misma categoría.']
  ],
  example:{
   question:'¿Qué respuesta necesita la persona que revisa esta foto?',
   intro:'Conservamos una escena ilustrada de tres frutos. Cambiamos el encargo: seleccionar la foto, localizar los frutos o delimitar sus regiones visibles.',
   reading:'La etiqueta responde para toda la imagen. Las cajas señalan dónde mirar. Las máscaras marcan regiones de píxeles. Son salidas dibujadas para comparar tareas, no resultados de una red.',
   takeaway:'Primero define la pregunta y la salida necesaria. Una etiqueta global no sustituye la localización o los contornos.',
   check:{question:'Si necesitas medir la región visible de cada fruto, ¿basta una etiqueta que diga «hay frutos»?',answer:'No. Necesitas delimitar sus píxeles y separar los objetos, por ejemplo con máscaras de instancias. Convertir esa región a unidades físicas exige además una escala de imagen conocida.'}
  },
  practice:{
   title:'Cambia el encargo, conserva la escena',
   prompt:'En «Pregunta», elige Clasificación y observa qué información entrega.',
   change:'Recorre Detección y Segmentación sin cambiar la escena.',
   watch:'Distingue una respuesta global de las marcas que localizan objetos o delimitan píxeles.',
   expected:'La escena conserva tres frutos: cambia el tipo de respuesta, no la cantidad de objetos dibujados.'
  },
  colab:{
   goal:'Reconocer qué información aporta cada tipo de salida visual.',
   steps:['En dl-encuentro-2.ipynb, Tema 1, ejecuta su preparación y el dibujo de tareas visuales.','Compara etiqueta de imagen, cajas y máscara binaria para los dos objetos del cuaderno.','Explica qué pregunta responde cada salida y qué información todavía no proporciona.'],
   check:'El cuaderno dibuja respuestas para enseñar tareas; no ejecuta aquí un detector. Su máscara binaria separa objeto y fondo, pero no identifica por separado cada instancia.'
  }
 },
 'dl-cnn': {
  goal:'Seguir cómo una ventana de píxeles produce una celda y cómo varias celdas forman un mapa.',
  definition:'Una CNN (Convolutional Neural Network, red neuronal convolucional) aprende filtros para buscar patrones locales. Un filtro es una pequeña matriz de pesos: se combina con una ventana de píxeles mediante productos y una suma. Repetirlo en distintas posiciones forma un mapa de respuestas. Aquí fijamos el filtro para entender la operación antes de entrenar.',
  terms:[
   ['Ventana','Región de píxeles que se usa para calcular una respuesta local.'],
   ['Filtro o kernel','Pesos compartidos que se aplican en distintas posiciones. En esta calculadora son dados; una CNN puede aprenderlos.'],
   ['Mapa de respuestas','Cuadrícula de resultados: cada celda corresponde a una posición de la ventana.']
  ],
  example:{
   question:'¿Cómo encuentra este filtro un cambio de oscuro a claro?',
   intro:'La imagen inventada tiene 5×5 píxeles de un canal: 0 oscuro y 1 claro. Movemos un filtro de 3×3, de una posición en una posición y sin añadir borde.',
   reading:'La ventana resaltada produce una sola celda del mapa. En la primera posición, los productos suman 3; en una zona uniforme se compensan y dan 0.',
   takeaway:'Una respuesta alta indica un patrón del filtro, no un objeto contado. Entrenar una CNN ajusta filtros a partir de ejemplos.',
   check:{question:'¿Mover un filtro elegido a mano significa que ya entrenaste una CNN?',answer:'No. Calculaste respuestas con pesos fijos. Entrenar requiere una tarea, ejemplos, una pérdida y actualizaciones de parámetros.'}
  },
  practice:{
   title:'Relaciona una ventana con su celda',
   prompt:'En «Filtro», elige Horizontal y fija «Columna de la ventana» en 1.',
   change:'Mueve «Fila de la ventana» por 1, 2 y 3. Después vuelve a fila 1 y elige Promedio en «Filtro».',
   watch:'Sigue los nueve píxeles usados, sus productos y la celda resaltada del mapa.',
   expected:'Con el filtro Horizontal, las tres filas producen 3, 3 y 0. El mapa tiene 3×3 respuestas.'
  },
  colab:{
   goal:'Distinguir una CNN que aprende de un filtro fijo que ilustra una operación.',
   steps:['En dl-encuentro-2.ipynb, Tema 2, ejecuta la preparación y la CNN de imágenes de dígitos.','Identifica imágenes de entrada, filtros aprendidos y puntuaciones de las diez clases; lee la evaluación que imprime.','Inspecciona el filtro fijo mostrado después y explica por qué sus valores y su mapa son otro ejemplo.'],
   check:'La CNN aprende a clasificar dígitos de 8×8; la calculadora usa una imagen inventada de 5×5. No esperas mapas iguales ni atribuyes al filtro fijo la evaluación de la red.'
  }
 },
 'dl-transferencia': {
  goal:'Distinguir usar un modelo previo, entrenar una cabeza nueva y hacer ajuste fino.',
  definition:'Un modelo preentrenado ya aprendió parámetros con datos anteriores. Usarlo tal como está para predecir es inferencia. La transferencia aprovecha representaciones previas para otra tarea: puede entrenar una nueva salida manteniendo fijo el extractor. El ajuste fino modifica también parámetros del extractor. Ambas adaptaciones necesitan ejemplos adecuados y una comprobación independiente.',
  terms:[
   ['Preentrenado','Modelo con parámetros ajustados previamente a otra colección de ejemplos.'],
   ['Extractor y cabeza','El extractor construye representaciones; la cabeza las convierte en la salida requerida.'],
   ['Congelar y ajustar','Congelar mantiene parámetros fijos. Ajustar entrena parámetros seleccionados; el ajuste fino modifica también el extractor previo.']
  ],
  example:{
   question:'¿Puede un detector aprender una categoría nueva cambiando su nombre?',
   intro:'Un equipo quiere inspeccionar café defectuoso y recibe un detector de objetos comunes. Antes de usarlo, comprueba qué categorías aprendió.',
   reading:'Cargar pesos permite inferir. Traducir una etiqueta mejora la lectura. Entrenar una salida nueva o ajustar el extractor son otras acciones: cambian parámetros y requieren datos.',
   takeaway:'Reutilizar una red no demuestra que resuelva una tarea nueva. Hay que comprobar categorías, condiciones y resultados.',
   check:{question:'Si dejas fijo el extractor y entrenas solo una cabeza nueva, ¿hiciste ajuste fino del extractor?',answer:'No. Hiciste transferencia mediante una nueva cabeza. El ajuste fino cambia además parte o todo el extractor. El cuaderno de este tema solo realiza inferencia.'}
  },
  practice:{
   title:'Elige qué parte cambia',
   prompt:'Compara las tres acciones del ejemplo: usar, traducir y adaptar.',
   change:'Imagina que la categoría requerida no está en el catálogo del modelo.',
   watch:'Separa cambios de texto, cambios de la cabeza y cambios del extractor.',
   expected:'Cambiar nombres no incorpora la categoría. Para proponer una adaptación faltan ejemplos etiquetados, entrenamiento y evaluación propios.'
  },
  colab:{
   goal:'Comprobar qué reconoce el detector cargado y qué reutiliza al predecir.',
   steps:['En dl-encuentro-2.ipynb, Tema 3, ejecuta las celdas de preparación y carga del modelo.','Consulta modelo.names y sigue una categoría disponible hasta una propuesta de la foto.','Aplica el filtro de categoría y comprueba que conserva una clase existente sin entrenar pesos.'],
   check:'Puedes explicar por qué el cuaderno ejecuta inferencia y no ajuste fino. Que una clase esté disponible tampoco garantiza buen resultado en cualquier foto local.'
  }
 },
 'dl-secuencias': {
  goal:'Explicar por qué el orden importa y distinguir un estado calculado de un pronóstico.',
  definition:'Una secuencia es una lista en la que el orden tiene significado. Una red recurrente actualiza un estado, un resumen del pasado, con cada entrada. Una LSTM (Long Short-Term Memory, memoria de largo y corto plazo) aprende mecanismos que regulan qué conservar e incorporar. Primero usaremos una regla fija para observar el papel del orden.',
  terms:[
   ['Secuencia','Entradas organizadas por tiempo u otro orden definido; intercambiarlas puede cambiar la interpretación.'],
   ['Estado','Resumen que se actualiza al leer una entrada. No tiene por qué ser la predicción final.'],
   ['RNN y LSTM','RNN: Recurrent Neural Network, red neuronal recurrente. LSTM es un tipo de RNN que aprende a regular la información conservada.']
  ],
  example:{
   question:'¿Por qué los mismos valores pueden dejar estados finales diferentes?',
   intro:'Una bodega recibe 10, 20 y 30 cajas en tres horas. Comparamos ese recorrido con recibir 30, 20 y 10. Ambos tienen media 20.',
   reading:'En cada paso se mezcla mitad del estado anterior y mitad de la entrada actual. Sigue las flechas en orden: la última entrada influye de manera distinta según cuándo llega.',
   takeaway:'La media pierde información de orden. Este estado conserva parte de ella con una regla dada; todavía no pronostica la siguiente entrega.',
   check:{question:'¿El estado final 21,25 es una predicción de las cajas que llegarán después?',answer:'No. Es el resumen de las tres entradas aplicando la regla elegida. Para pronosticar hace falta definir un objetivo futuro y comprobar las predicciones con datos reservados.'}
  },
  practice:{
   title:'Invierte el recorrido y compara',
   prompt:'En «Orden de la secuencia», elige Ascendente y pulsa «Ver el siguiente paso» tres veces.',
   change:'En «Orden de la secuencia», elige Descendente y vuelve a recorrer los tres pasos desde cero.',
   watch:'Cada estado nuevo usa solo el estado anterior y la entrada que acaba de llegar.',
   expected:'La media sigue siendo 20; los estados finales son 21,25 y 13,75. El cambio se debe al orden.'
  },
  colab:{
   goal:'Leer un pronóstico de un paso hecho con doce observaciones anteriores.',
   steps:['En dl-encuentro-3.ipynb, Tema 1, ejecuta su preparación y la LSTM.','Identifica qué doce lecturas anteriores forman la entrada y qué lectura siguiente es el objetivo.','Compara el error de LSTM y la referencia de último valor sobre los mismos instantes reservados.'],
   check:'La práctica usa otra serie artificial. No trasladas los estados de cajas al pronóstico ni interpretas sus sesenta casos de prueba como un único pronóstico a sesenta pasos.'
  }
 },
 'dl-atencion': {
  goal:'Seguir cómo una consulta determina participaciones y cómo estas producen una mezcla.',
  definition:'La atención combina información dando distinta participación a cada fuente. Compara una consulta con las claves de las fuentes, transforma las compatibilidades en pesos que suman uno y mezcla sus valores. Una participación mayor acerca la mezcla a esa fuente. En una red, las representaciones que permiten estas comparaciones pueden aprenderse.',
  terms:[
   ['Consulta Q y claves K','La consulta expresa qué se busca; las claves permiten comparar las fuentes. Aquí son listas de números dadas.'],
   ['Valores V','Información que se mezcla después de calcular cuánto participa cada fuente.'],
   ['Pesos de atención','Participaciones recalculadas para una consulta. No son los parámetros aprendidos ni prueban qué causa un resultado.']
  ],
  example:{
   question:'¿Cómo se obtiene una mezcla diferente sin cambiar las dos fuentes?',
   intro:'Los valores son A=10 y B=20 cajas ficticias. Consulta y claves fueron construidas para observar el reparto; no provienen de pedidos reales.',
   reading:'La consulta inicial da a A aproximadamente dos tercios de la participación y a B un tercio. Multiplica cada valor por su participación y suma: la mezcla queda cerca de 13,3 cajas.',
   takeaway:'Comparar fuentes y mezclar su contenido son dos operaciones diferentes. Aquí se calcula atención; no se entrena un Transformer.',
   check:{question:'Si ambas fuentes participan por mitades, ¿la salida es cero o un valor intermedio?',answer:'Es 15: la mitad de 10 más la mitad de 20. Una consulta que produzca el mismo peso para ambas fuentes no elimina sus valores.'}
  },
  practice:{
   title:'Cambia la consulta, conserva las fuentes',
   prompt:'En «Consulta Q», elige «Q = [1, 0]» y sigue el reparto hasta la salida.',
   change:'En el mismo control, elige «Q = [0, 1]» y después «Q = [0, 0]».',
   watch:'Las claves y los valores permanecen fijos; cambian las participaciones y sus contribuciones a la mezcla.',
   expected:'La consulta neutra reparte 0,5 y 0,5 y produce 15. Más participación de A acerca la salida a 10; más de B, a 20.'
  },
  colab:{
   goal:'Reconstruir consulta, pesos y mezcla con las dos fuentes del ejemplo.',
   steps:['En dl-encuentro-3.ipynb, Tema 2, ejecuta su preparación y la atención de dos registros.','Lee por separado la comparación con las claves, el reparto calculado y la combinación de valores.','Contrasta el reparto mostrado con la mezcla; usa los valores sin redondear para comprobar la cuenta.'],
   check:'Los pesos suman uno. Puedes distinguir la consulta y las claves sin unidades físicas de los valores y la mezcla expresados en cajas ficticias.'
  }
 },
 'dl-transformers': {
  goal:'Ubicar representación, posición, atención y salida dentro de un Transformer.',
  definition:'Un Transformer organiza bloques de atención y pequeñas redes por posición para construir representaciones con contexto. Las entradas se convierten en vectores; la atención relaciona elementos y las transformaciones procesan sus representaciones. La información de orden y la forma de leer las posiciones permiten usar su ubicación. La salida depende de la tarea elegida.',
  terms:[
   ['Token y representación','Un token es una unidad de entrada. En esta práctica es un número, que se convierte en una lista de valores llamada vector.'],
   ['Autoatención','Relaciona elementos de la misma secuencia y mezcla información entre ellos.'],
   ['Posición y salida','La posición informa dónde está cada elemento; la salida transforma el conjunto en la respuesta de la tarea.']
  ],
  example:{
   question:'¿Cómo se organiza una red que debe responder sobre una secuencia?',
   intro:'La tarea construida pregunta si la última cantidad de cuatro horas es menor que la primera. Primero calculamos nosotros la etiqueta; después comprobamos qué responde la red.',
   reading:'Sigue las piezas de la arquitectura. En 1→2→3→4 la etiqueta es 0; en 4→3→2→1 es 1. Estas etiquetas conocidas no son todavía predicciones del modelo.',
   takeaway:'Atención es una pieza del Transformer. Conocer una regla sencilla permite comprobar su respuesta, pero no demuestra que la red ya la aprendió.',
   check:{question:'¿Qué aporta la atención y qué aporta la posición en este recorrido?',answer:'La atención mezcla información entre elementos según sus representaciones; la posición informa dónde están. El modelo completo transforma esas representaciones en puntuaciones de clase. En el cuaderno, la lectura final también conserva posiciones: no se aísla el efecto de añadir información posicional.'}
  },
  practice:{
   title:'Separa la respuesta esperada de la predicción',
   prompt:'Resuelve estas cuatro secuencias, en este orden: 1→2→3→4; 4→3→2→1; 2→7→1→3; 3→1→7→2. Compara primero y último.',
   change:'En la última secuencia, fíjate en la subida intermedia: la pregunta sigue comparando solo los extremos.',
   watch:'La tarea pregunta por los extremos, no si todas las cantidades van disminuyendo.',
   expected:'Las etiquetas de las cuatro filas son 0, 1, 0 y 1. Para conocer las respuestas de la red debes ejecutar el cuaderno.'
  },
  colab:{
   goal:'Relacionar las piezas de un Transformer entrenado con una tarea y una prueba comprobables.',
   steps:['En dl-encuentro-3.ipynb, Tema 3, ejecuta su preparación y el Transformer de la tarea de orden.','Localiza representación, posición, atención y salida; después lee la evaluación reservada que calcula.','Compara las cuatro respuestas esperadas con las respuestas predichas que imprime, sin dar por hecho que coinciden.'],
   check:'Distingues la etiqueta de referencia de las dos puntuaciones calculadas y de la clase elegida. La prueba del cuaderno excluye secuencias con extremos iguales.'
  }
 },
 'dl-yolo': {
  goal:'Rastrear una propuesta desde su caja en la foto hasta una fila del registro.',
  definition:'YOLO (You Only Look Once, solo se mira una vez) es una familia de detectores de objetos. Un detector propone categoría, ubicación y puntuación para cada objeto posible. La ubicación suele expresarse mediante una caja rectangular. Un umbral de puntuación filtra las propuestas; conservar una no confirma que su categoría o ubicación sean correctas.',
  terms:[
   ['Propuesta','Posible objeto que el modelo señala; necesita revisión o evaluación para comprobarse.'],
   ['Caja y categoría','La caja indica dónde mirar; la categoría dice qué objeto propone el modelo.'],
   ['Puntuación y umbral','El modelo calcula la puntuación. La persona elige el corte para conservar o descartar propuestas.']
  ],
  example:{
   question:'¿Por qué puede cambiar el registro sin cambiar la imagen?',
   intro:'Hay un objeto dibujado y una propuesta de caja con puntuación fija 0,80. Aplicamos un filtro didáctico que incluye la igualdad con el umbral.',
   reading:'Sigue la caja hasta su fila. Con un corte bajo permanece; con un corte mayor que su puntuación desaparece la propuesta, pero el objeto dibujado sigue presente.',
   takeaway:'El filtro cambia qué se conserva, no lo que aprendió el modelo ni los objetos presentes.',
   check:{question:'Si el registro queda vacío al subir el umbral, ¿demostramos que la imagen no contiene objetos?',answer:'No. Solo sabemos que ninguna propuesta pasó ese filtro. Puede haber objetos que el detector omitió o propuestas descartadas.'}
  },
  practice:{
   title:'Filtra la misma propuesta',
   prompt:'Conserva la puntuación 0,80 y la caja tal como están.',
   change:'Mueve «Umbral de puntuación» a 0,50, 0,80 y 0,90.',
   watch:'Relaciona la caja visible con las filas conservadas del registro.',
   expected:'Con la regla didáctica ≥, se conservan 1, 1 y 0 filas, respectivamente. Cambiar el corte no reentrena.'
  },
  colab:{
   goal:'Obtener propuestas de fotos y conservar un registro que pueda revisarse.',
   steps:['En dl-encuentro-4.ipynb, Tema 1, ejecuta en orden preparación, carga del modelo e inferencia.','Elige una misma detección en foto y tabla y rastrea categoría, puntuación y coordenadas.','Continúa con conteos, comparación de umbrales y exportación; identifica la configuración de la inferencia que guardas.'],
   check:'Una fila representa una detección conservada, no un inventario confirmado. Ultralytics filtra con puntuación > conf; el dibujo didáctico usa ≥ y declara esa diferencia.'
  }
 },
 'dl-evaluacion': {
  goal:'Distinguir filtrar una propuesta de comprobar si coincide con un objeto de referencia.',
  definition:'Evaluar detecciones compara las propuestas con objetos anotados como referencia. Una coincidencia válida exige la categoría correcta y suficiente superposición. IoU (Intersection over Union, intersección sobre unión) divide el área compartida entre el área cubierta por ambas cajas. Las propuestas sin coincidencia y los objetos sin detectar cuentan errores diferentes.',
  terms:[
   ['Referencia','Objeto anotado con ubicación y categoría para comprobar el resultado del detector.'],
   ['IoU','Número entre 0 y 1: cero significa sin área compartida; uno significa cajas idénticas.'],
   ['TP, FP y FN','True Positive (verdadero positivo): coincidencia válida. False Positive (falso positivo): propuesta sin coincidencia. False Negative (falso negativo): referencia sin detectar.']
  ],
  example:{
   question:'¿Una caja conservada está necesariamente bien ubicada?',
   intro:'La referencia y la candidata miden 40×40 píxeles y tienen la misma categoría. Conservamos la puntuación de la candidata y solo la desplazamos hacia la derecha.',
   reading:'Con desplazamiento 10, el área compartida es 1200 y la unión 2000 píxeles cuadrados: IoU=0,60. El umbral de coincidencia elegido es 0,50.',
   takeaway:'El umbral de puntuación decide qué propuestas revisar; el de IoU comprueba ubicación. Son cortes distintos.',
   check:{question:'Si una propuesta conservada queda mal ubicada sobre un único objeto, ¿puede producir FP y FN a la vez?',answer:'Sí. La propuesta sin coincidencia es un FP y el objeto de referencia que quedó sin propuesta válida es un FN. Contamos propuestas incorrectas y objetos omitidos, no la misma cosa dos veces.'}
  },
  practice:{
   title:'Conserva, desplaza y cuenta',
   prompt:'Fija «IoU mínima para coincidencia» y «Umbral de puntuación» en 0,50.',
   change:'En «Desplazamiento horizontal de la caja (píxeles)», prueba 10 y 30. Vuelve a 10 y sube «Umbral de puntuación» a 0,90.',
   watch:'Lee por separado IoU, propuesta conservada y conteos TP/FP/FN.',
   expected:'Los tres escenarios producen 1/0/0, 0/1/1 y 0/0/1. Descartar la propuesta no elimina el objeto omitido.'
  },
  colab:{
   goal:'Reproducir una evaluación de cajas con referencias conocidas.',
   steps:['En dl-encuentro-4.ipynb, Tema 2, ejecuta su preparación y la evaluación de cajas sintéticas.','Relaciona cada desplazamiento con su intersección, unión e IoU.','Lee TP, FP y FN para cada escenario y explica qué propuesta o referencia produce cada conteo.'],
   check:'Las fotos de demostración no tienen aquí las anotaciones necesarias para evaluar el detector. Esta evaluación sintética comprueba sus cajas conocidas; una referencia solo puede emparejarse una vez.'
  }
 },
 'dl-integracion': {
  goal:'Explicar cómo una puntuación se convierte en una acción y comparar sus consecuencias.',
  definition:'Una política es una regla que transforma la salida del modelo en una acción. Para revisar o aceptar productos hay que declarar consecuencias y capacidad disponibles. Una comparación de costes puede ayudar, siempre que sus supuestos estén claros. La regla se elige con validación y después se comprueba en una prueba reservada.',
  terms:[
   ['Política','Regla operativa: en este caso, revisar si la puntuación alcanza un umbral y aceptar el resto.'],
   ['Coste supuesto','Puntos inventados para comparar consecuencias; no son precios ni pérdidas reales medidas.'],
   ['Validación y prueba','Validación ayuda a elegir la regla. Prueba reservada comprueba el resultado después de esa elección.']
  ],
  example:{
   question:'¿Revisar menos siempre tiene un coste menor?',
   intro:'Tenemos diez granos ficticios. Revisar cuesta 1 punto y dejar pasar un defecto cuesta 8; suponemos que cada revisión identifica el defecto correctamente.',
   reading:'Con corte 0,50 hay cuatro revisiones y un defecto aceptado: coste 12. Con 0,30 hay seis revisiones y ningún defecto aceptado: coste 6. Revisar los diez costaría 10.',
   takeaway:'La alternativa preferida depende de las consecuencias declaradas, además del modelo. La revisión perfecta es un supuesto que habría que comprobar.',
   check:{question:'Si cambias el coste de aceptar un defecto, ¿cambian automáticamente las puntuaciones de la red?',answer:'No. Conservas los mismos casos y puntuaciones; recalculas las consecuencias de cada regla. Podría cambiar la política preferida sin entrenar otra vez.'}
  },
  practice:{
   title:'Conserva los casos y cambia una consecuencia',
   prompt:'Compara en el ejemplo las políticas 0,30 y 0,50 con revisar todos.',
   change:'Pregunta qué ocurriría si aceptar un defecto costara 1 punto en lugar de 8.',
   watch:'Las revisiones y los defectos aceptados de cada política siguen iguales; cambia cómo se valora su consecuencia.',
   expected:'Una menor carga de revisión puede acompañarse de más defectos aceptados. La capacidad y los errores importan aunque dos costes empaten.'
  },
  colab:{
   goal:'Construir una comparación reproducible de políticas con costes explícitos.',
   steps:['En dl-encuentro-4.ipynb, Tema 3, ejecuta su preparación y la tabla con COSTO_DEFECTO_ACEPTADO=8.','Guarda la comparación; cambia únicamente ese coste a 1 y vuelve a ejecutar la celda.','Compara con revisar todos y explica cualquier empate usando revisiones y defectos aceptados, no solo el total.'],
   check:'Aquí y=1 significa defectuoso. Puedes reproducir el coste de una política y distinguir los supuestos didácticos de la evidencia que faltaría para usarla.'
  }
 }
};
