import {withDiagramZoom} from './dl-figures.js';
// Puentes de comprensión: solo se renderizan para los doce temas de Deep Learning.
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const BIAS_EXPLANATION = {
 title:'Sesgo: un desplazamiento que la neurona puede aprender',
 meaning:'El sesgo b es un parámetro que se suma después de multiplicar las entradas por sus pesos y antes de aplicar la activación: z = w₁x₁ + w₂x₂ + … + b; salida = activación(z). Puede ser positivo, negativo o cero. Para unas mismas entradas, cambiar b desplaza z en esa cantidad.',
 purpose:'¿Por qué hace falta? Sin sesgo, entradas todas iguales a cero obligan a que z sea cero, sin importar los pesos. Con sesgo, z puede valer b. Esto permite desplazar el punto en el que responde una unidad, sin cambiar cuánto aporta cada entrada. En una unidad con salida identidad, el peso cambia la pendiente y el sesgo mueve la recta arriba o abajo. Con otra activación, ese desplazamiento ocurre antes de transformarla.',
 learning:'Durante el entrenamiento, el optimizador puede ajustar b a partir de los ejemplos, igual que los pesos. Durante una predicción, usa su valor actual sin modificarlo. «Sesgo» aquí no significa prejuicio, error de medición ni una corrección elegida después de ver cada respuesta.',
 exampleTitle:'Una operación real: pesar producto sin contar la caja',
 context:'En pesaje se resta la tara —el peso del recipiente vacío— del peso bruto para obtener el peso neto del producto. Supón una caja de 2 kg: cargada marca 12 kg; el producto pesa 10 kg. Es una operación real de báscula, con cifras ilustrativas, no mediciones de una finca.',
 mapping:'Podemos escribir esa operación como una unidad con salida identidad, que devuelve z sin transformarlo: entrada x = peso bruto en kg; peso multiplicador w = 1, sin unidades; sesgo b = −2 kg. Así, salida = 1 × 12 kg + (−2 kg) = 10 kg. Aquí fijamos b usando la tara conocida; no lo entrenamos.',
 comparison:'Con la misma caja: bruto 2 kg → neto 0 kg; bruto 7 kg → neto 5 kg; bruto 12 kg → neto 10 kg. Si el bruto aumenta 1 kg, el neto aumenta 1 kg: w=1 mantiene esa relación. El sesgo resta siempre los mismos 2 kg. Sin él, la unidad daría 12 kg para la caja cargada y contaría el envase como producto.',
 reading:'Horizontal: peso bruto. Vertical: salida calculada. Línea continua: x−2, con sesgo. Línea discontinua: x, sin sesgo. Ambas tienen la misma pendiente; sus salidas se separan siempre 2 kg. Mostramos x≥2 kg, el dominio de esta caja. Una báscula puede ejecutar esta resta directamente; el ejemplo ayuda a entender la función de b en una neurona.',
 question:'¿Qué b usarías para una caja vacía de 3 kg, si cargada marca 12 kg?',
 answer:'b=−3 kg; salida=1×12−3=9 kg de producto. Conservas w=1: cambia el desplazamiento, no la cantidad que añade cada kg de entrada. Si cambia la tara entre cajas, una sola constante no basta: debes registrar la tara correspondiente o incorporarla como otra entrada.',
 source:'https://www.canscale.com/support/software/dispatch/docs/3.1/webhelp/term_gross_tare_net.htm'
};

export function renderBiasExplanation(){
 const b=BIAS_EXPLANATION;
 const x=v=>65+(v-2)*31,y=v=>220-v*14;
 const graph=withDiagramZoom(`<svg viewBox="0 0 440 290" role="img" aria-label="Misma pendiente: sin sesgo la salida es x; con sesgo menos dos kilogramos es x menos dos"><path d="M65 35V220H375" fill="none" stroke="currentColor"/>${[0,5,10,12].map(v=>`<text x="52" y="${y(v)+5}" text-anchor="end">${v}</text>`).join('')}${[2,7,12].map(v=>`<text x="${x(v)}" y="245" text-anchor="middle">${v}</text>`).join('')}<path d="M${x(2)} ${y(2)}L${x(12)} ${y(12)}" fill="none" stroke="currentColor" stroke-dasharray="6 5" stroke-width="2"/><path d="M${x(2)} ${y(0)}L${x(12)} ${y(10)}" fill="none" stroke="currentColor" stroke-width="3"/>${[2,7,12].map(v=>`<circle cx="${x(v)}" cy="${y(v-2)}" r="5" fill="currentColor"/>`).join('')}<text x="65" y="20">Salida (kg)</text><text x="220" y="277" text-anchor="middle">Peso bruto (kg)</text></svg>`);
 return `<section class="dl-bias-explanation"><h3>${esc(b.title)}</h3><p>${esc(b.meaning)}</p><p>${esc(b.purpose)}</p><p>${esc(b.learning)}</p><h4>${esc(b.exampleTitle)}</h4><p>${esc(b.context)}</p><p>${esc(b.mapping)}</p><div class="dl-activation-bridge">${graph}<p>${esc(b.reading)}</p></div><p>${esc(b.comparison)}</p><details><summary>${esc(b.question)}</summary><p>${esc(b.answer)}</p></details><p class="dl-foundation-source"><a href="${b.source}" target="_blank" rel="noopener noreferrer">Pesaje bruto, tara y neto · documentación de CanScale ↗</a></p></section>`;
}
export const DL_FOUNDATIONS = {
 'dl-redes': {
  before: [['Entrada x','Número disponible antes de calcular la respuesta. El subíndice identifica cuál entrada es.'],['Parámetro','Número ajustable del modelo: un peso w multiplica y un sesgo b se añade.'],['Capa y representación','Una capa reúne unidades de cálculo. Su lista de salidas es una nueva representación de las mismas entradas.']],
  why: '¿Por qué conectar neuronas en capas?',
  reason: 'Cada unidad combina entradas de una manera distinta. La capa siguiente combina esas salidas y puede construir relaciones más complejas. «Oculta» significa intermedia: no observamos directamente una respuesta correcta para cada una de sus neuronas. Deep Learning aprende varias transformaciones de representación; no hay un número universal de capas que garantice aprender mejor.',
  flow: [['Entradas','x₁ = 2; x₂ = 1'],['Una unidad oculta','h = ReLU(0,5x₁ − x₂ + 0,5) = 0,5'],['Otra capa','z = 2h − 1 = 0'],['Salida binaria ilustrativa','sigmoide(z) = 0,5']],
  read: 'Sigue los pasos numerados: la salida h se vuelve entrada de la capa siguiente. La sigmoide transforma z con 1/(1+exp(−z)); exp(0)=1, por eso aquí entrega 1/2. Es un fragmento mínimo con una sola unidad oculta; todos los parámetros están dados, sin entrenamiento.',
  question: 'Si conservas entradas y pesos, pero el primer sesgo pasa de 0,5 a −0,5, ¿qué cambia en las dos capas?',
  answer: 'La primera suma pasa a −0,5 y ReLU entrega h=0. La segunda suma es 2×0−1=−1; la sigmoide da aproximadamente 0,269. Se propagó un cambio manual; no se aprendieron parámetros.',
  source: 'https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html'
 },
 'dl-activaciones': {
  before: [['Función','Regla que asigna una salida a cada entrada.'],['Suma z','Resultado de sumar entradas por pesos y añadir el sesgo; todavía no es una clase.'],['No linealidad','Transformación que permite que la relación completa no se reduzca a una sola transformación de la forma ax+b.']],
  why: '¿Por qué no basta con sumar más capas?',
  reason: 'Si todas las capas solo multiplican y suman, pueden combinarse en una sola transformación afín. Por ejemplo, h=2x+1 y salida=3h−2 equivale a 6x+1. Una activación no lineal entre capas rompe esa equivalencia. No se elige por el aspecto de la curva: la tarea, la salida requerida y el comportamiento de los gradientes importan.',
  flow: [['Señal negativa','z = −2'],['ReLU','máximo(0, −2) = 0'],['Sigmoide','1 / (1 + exp(2)) ≈ 0,119'],['tanh','tanh(−2) ≈ −0,964']],
  read: 'Aquí las tres salidas son alternativas para la misma z, no pasos consecutivos. exp(2) significa e²; e≈2,718. ReLU no tiene techo; sigmoide está entre 0 y 1 y tanh entre −1 y 1 para entradas finitas.',
  question: '¿Una sigmoide de 0,8 significa que el modelo acierta el 80 % de las veces?',
  answer: 'No. Es una salida de un caso. Para interpretar probabilidades hace falta una tarea probabilística y comprobar calibración: entre casos con puntuación cercana a 0,8, ¿ocurre el positivo aproximadamente el 80 % de las veces? Un umbral convierte después la puntuación en decisión.',
  source: 'https://d2l.ai/chapter_multilayer-perceptrons/mlp.html'
 },
 'dl-entrenamiento': {
  before: [['Etiqueta y','Respuesta conocida de un ejemplo supervisado. No es una entrada disponible al predecir.'],['Pérdida L','Número que penaliza el desacuerdo según una fórmula elegida. No es porcentaje de fallos.'],['Gradiente y tasa η','El gradiente indica sensibilidad de la pérdida; η, la tasa elegida, regula el tamaño de la actualización.']],
  why: '¿Por qué restamos el gradiente?',
  reason: 'El gradiente apunta hacia el aumento local de la pérdida. Un paso pequeño en la dirección contraria intenta reducirla. Es una aproximación local: un paso grande puede cruzar el mínimo y empeorar. Retropropagación calcula gradientes mediante la regla de la cadena; el optimizador los usa para actualizar. Una época recorre una vez los ejemplos de entrenamiento; un lote es el grupo usado en una actualización.',
  flow: [['Medir','L(θ)=(θ−3)²; θ=−2 → L=25'],['Derivar','g=2(θ−3)=−10'],['Actualizar','θ nuevo=−2−0,1×(−10)=−1'],['Volver a medir','L(−1)=(−1−3)²=16']],
  read: 'θ nombra un único parámetro sin unidades; 3 es el objetivo elegido. En una red, la pérdida depende de muchos parámetros y ejemplos. El descenso básico mostrado no es la fórmula completa de Adam.',
  question: 'Desde el mismo inicio, usa tasa 1,1. ¿Por qué empeora aunque sigas la dirección del descenso?',
  answer: 'θ nuevo=−2−1,1×(−10)=9. La pérdida es (9−3)²=36, mayor que 25. El paso fue demasiado grande. Para comparar tasas reinicia primero. Una pérdida de entrenamiento menor tampoco prueba generalización: valida configuraciones y reserva la prueba final.',
  source: 'https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html'
 },
 'dl-vision': {
  before: [['Píxel','Posición de una imagen que almacena brillo o componentes de color.'],['Canal y tensor','Un canal guarda una componente, por ejemplo rojo. Un tensor organiza esos números en ejes.'],['Anotación','Respuesta de referencia: etiqueta, caja o máscara según la tarea.']],
  why: '¿Por qué definir la salida antes de elegir la red?',
  reason: 'Las respuestas necesarias determinan las anotaciones y la evaluación. Una etiqueta global no permite contar objetos individuales. Las cajas localizan, pero incluyen fondo. Una máscara indica píxeles; la segmentación semántica agrupa por categoría y la de instancias distingue objetos de la misma categoría.',
  flow: [['Imagen','60 alto × 90 ancho × 3 canales'],['Clasificar','Una etiqueta para la foto'],['Detectar','Categoría + caja por objeto'],['Segmentar','Categoría por píxel; instancias si hay que separar objetos']],
  read: 'Las tres salidas son tareas alternativas sobre una misma imagen. Hay 60×90×3=16 200 valores en este ejemplo RGB, no 16 200 objetos. PyTorch suele ordenar una imagen como canales×alto×ancho y añade un eje de lote al reunir imágenes.',
  question: 'Necesitas medir superficie visible y contar frutos que se tocan. ¿Bastan cajas?',
  answer: 'Las cajas ayudan a localizar y contar propuestas, pero no delimitan la superficie visible. Las máscaras de instancias son una salida adecuada para separar y delimitar cada fruto. Convertir píxeles a cm² exige además calibración espacial; una máscara por sí sola no aporta escala física.',
  source: 'https://docs.ultralytics.com/tasks/segment/'
 },
 'dl-cnn': {
  before: [['Filtro o kernel','Pequeña matriz de pesos que se reutiliza en todas las ventanas.'],['Mapa de respuestas','Cuadrícula formada por las sumas calculadas en cada posición.'],['Paso y relleno','Stride: cuánto se mueve la ventana. Padding: borde añadido antes del cálculo.']],
  why: '¿Por qué usar el mismo filtro en varias posiciones?',
  reason: 'Compartir pesos permite buscar un mismo patrón local en distintas zonas con menos parámetros que asignando pesos diferentes a cada posición. Las capas posteriores combinan respuestas y amplían la región de entrada que influye en cada salida. Esto no garantiza invariancia a giros, iluminación o cualquier desplazamiento.',
  flow: [['Entrada','Imagen inventada 5×5'],['Ventana','Filtro 3×3; paso 1; sin relleno'],['Cuenta local','9 productos → una suma'],['Mapa','(5−3)+1=3 posiciones por eje → 3×3']],
  read: 'En el filtro horizontal se resta la fila superior de la inferior. Una respuesta de 3 indica contraste en esta escala artificial, no tres objetos ni una probabilidad. Una CNN aprende los filtros; aquí el filtro está fijado para inspeccionar la operación.',
  question: 'Si los nueve píxeles valen 1, ¿qué entregan el filtro de cambio horizontal y el promedio?',
  answer: 'Horizontal: −1−1−1+1+1+1=0; no hay cambio entre filas. Promedio: nueve veces 1/9=1; se conserva el nivel uniforme. Una salida cero del primer filtro no significa ausencia de contenido.',
  source: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html'
 },
 'dl-transferencia': {
  before: [['Preentrenado','Modelo cuyos parámetros ya fueron ajustados con datos anteriores.'],['Extractor y cabeza','El extractor construye representaciones; la cabeza las convierte en la salida de la tarea.'],['Congelar y ajuste fino','Congelar impide actualizar parámetros. Ajuste fino entrena parte o todo un modelo previo con nuevos ejemplos.']],
  why: '¿Por qué reutilizar representaciones?',
  reason: 'Patrones visuales aprendidos antes pueden ser útiles para otra tarea y reducir el entrenamiento necesario. Hay que comprobar dominio, preparación de imagen y categorías. Se puede entrenar una cabeza nueva con el extractor congelado, o ajustar también parte del extractor. En ambos casos hacen falta etiquetas apropiadas y una prueba independiente.',
  flow: [['Modelo previo','Extractor con pesos aprendidos'],['Nueva tarea','Definir categorías y reunir anotaciones'],['Adaptación','Cabeza nueva; opcionalmente ajustar extractor'],['Comprobación','Evaluar en lotes nuevos reservados']],
  read: 'Este esquema describe una posible adaptación. El cuaderno ejecuta inferencia con pesos existentes: no entrena una categoría agrícola. Revisar su catálogo antes de usarlo evita confundir una demostración con transferencia ya realizada.',
  question: '¿Renombrar «bus» como «grano defectuoso» enseña la nueva categoría?',
  answer: 'No cambia ni pesos ni representación ni ejemplos de entrenamiento. Solo cambia el texto mostrado. Para la nueva tarea necesitas anotaciones de esa categoría, una adaptación adecuada y evaluación con imágenes reservadas; fotos del mismo lote deben mantenerse en la misma partición.',
  source: 'https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html'
 },
 'dl-secuencias': {
  before: [['Secuencia','Lista ordenada: cada posición tiene significado temporal u otro orden definido.'],['Estado s','Resumen que se actualiza al recibir una entrada. No es necesariamente una predicción.'],['RNN y LSTM','Recurrent Neural Network: red neuronal recurrente. Long Short-Term Memory: memoria de largo y corto plazo, un tipo de RNN con compuertas.']],
  why: '¿Por qué la media no basta para representar el orden?',
  reason: 'La media de 10,20,30 y 30,20,10 es igual, pero las tendencias son opuestas. Una actualización recurrente conserva una influencia del pasado. LSTM aprende compuertas que regulan qué retener y qué incorporar; no conserva todo ni recuerda indefinidamente. En el ejemplo manual los coeficientes 0,5 son dados, no aprendidos.',
  flow: [['Inicio','s₀=0'],['Llega 10','s₁=0,5×0+0,5×10=5'],['Llega 20','s₂=0,5×5+0,5×20=12,5'],['Llega 30','s₃=0,5×12,5+0,5×30=21,25']],
  read: 'Entradas y estados se expresan en cajas en el ejemplo ficticio. El estado puede ser fraccionario porque es un resumen ponderado, no un conteo físico ni el pronóstico de la próxima entrega.',
  question: 'Invierte el orden. ¿Por qué el estado final cambia si la media sigue siendo 20?',
  answer: 'Con 30→20→10 los estados son 15, 17,5 y 13,75. La entrada reciente pesa más en esta regla. Para pronosticar en Colab se usan ventanas anteriores al instante objetivo; no mezcles ventanas al azar entre entrenamiento y prueba ni uses el futuro para escalar.',
  source: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html'
 },
 'dl-atencion': {
  before: [['Consulta Q y claves K','Vectores que se comparan para calcular compatibilidad. Un vector es una lista ordenada de números.'],['Valores V','Información que se va a mezclar; no tiene por qué coincidir con las claves.'],['Softmax','Convierte puntuaciones en participaciones positivas que suman uno por consulta.']],
  why: '¿Por qué separar comparación y contenido?',
  reason: 'Las claves permiten decidir cuánto participa cada fuente; los valores contienen lo que aporta. Primero se multiplican componentes correspondientes y se suman: producto escalar. Se divide por la raíz de la dimensión de la clave para moderar la escala de las puntuaciones; softmax normaliza después. Esto no garantiza probabilidades calibradas ni explica causalidad.',
  flow: [['Comparar','Q=[1,0]; claves [1,0] y [0,1] → 1 y 0'],['Escalar','Dimensión 2 → dividir entre √2'],['Normalizar','softmax(0,7071; 0) → 0,6698 y 0,3302'],['Mezclar V','0,6698×10 + 0,3302×20 ≈ 13,302']],
  read: 'Los números son construidos, sin unidades físicas. Los pesos de atención se recalculan al cambiar Q; no son los parámetros aprendidos de las proyecciones que generan Q, K y V en una red real.',
  question: 'Con Q=[0,0], ¿se elimina la información o se mezcla de otra manera?',
  answer: 'Ambos productos escalares son 0. softmax asigna 0,5 a cada fuente y la salida es 0,5×10+0,5×20=15. Consulta cero no implica salida cero: los valores siguen siendo 10 y 20.',
  source: 'https://arxiv.org/abs/1706.03762'
 },
 'dl-transformers': {
  before: [['Token y embedding','Token: una unidad de la secuencia. Embedding: su representación como vector; en esta práctica la unidad es un número.'],['Autoatención','Q, K y V proceden de la misma secuencia mediante transformaciones que pueden ser distintas.'],['Posición','Información del lugar de cada unidad, incorporada para que el modelo pueda usar el orden.']],
  why: '¿Por qué la atención sola no resuelve el orden?',
  reason: 'Sin información posicional, la autoatención por sí sola no distingue el orden por el contenido de los elementos. El diseño completo importa: máscaras y selección de posiciones también pueden aportar estructura. Un bloque Transformer combina atención, transformaciones por posición, conexiones residuales y normalización. No es solo softmax ni significa necesariamente generar texto.',
  flow: [['Entrada','[1,2,3,4]: cuatro cantidades'],['Representación','Vectores + información de posición'],['Bloques','Autoatención y transformaciones'],['Respuesta','¿Última < primera? 4<1 → no (0)']],
  read: 'La regla última<primera genera la etiqueta de referencia de la tarea sintética. El dibujo no muestra una red entrenada ni promete que siempre acierte; la práctica entrena y compara sus predicciones con esas etiquetas.',
  question: '¿Qué respuesta debe tener [4,3,2,1]? ¿Y [2,1,4,2]?',
  answer: 'Primera: 1<4 es verdadero → etiqueta 1. Segunda: 2<2 es falso → etiqueta 0. «Menor» es estricto. Antes de mirar una predicción puedes calcular su respuesta de referencia y después comprobarla en casos reservados.',
  source: 'https://arxiv.org/abs/1706.03762'
 },
 'dl-yolo': {
  before: [['YOLO','You Only Look Once: solo se mira una vez. Familia de detectores de objetos.'],['Caja y coordenadas','Rectángulo [x₁,y₁,x₂,y₂]; en este ejemplo el origen está arriba a la izquierda y las unidades son píxeles.'],['Puntuación y umbral','La puntuación la produce el modelo; el umbral es un corte que se elige para filtrar propuestas.']],
  why: '¿Por qué una caja conservada todavía es una propuesta?',
  reason: 'Filtrar puntuaciones no comprueba categoría ni localización. Para revisar un resultado hay que conservar imagen, categoría, puntuación y coordenadas. La supresión de no máximos (NMS) reduce cajas redundantes comparando propuestas entre sí; no las compara con la verdad. Las variantes de detector pueden tener posprocesamientos distintos.',
  flow: [['Propuesta dada','Categoría + caja + puntuación 0,80'],['Filtro didáctico','0,80 ≥ umbral 0,50'],['Registro','Se conserva para revisión'],['Comprobación aparte','Contrastar categoría y ubicación con anotación']],
  read: 'Esta web usa ≥ para hacer visible la igualdad. La inferencia del cuaderno con Ultralytics usa su filtro de puntuación > conf: con igualdad exacta puede diferir. Cambiar el corte no cambia pesos ni corrige cajas.',
  question: 'La caja tiene puntuación 0,80. ¿Qué ocurre con cortes 0,50 y 0,90? ¿Se aprendió algo?',
  answer: 'Con la regla didáctica ≥, se conserva con 0,50 y se descarta con 0,90. Sus coordenadas y puntuación permanecen iguales. No hubo entrenamiento. Guarda también las propuestas descartadas si necesitas auditar cómo cambió la regla.',
  source: 'https://docs.ultralytics.com/modes/predict/'
 },
 'dl-evaluacion': {
  before: [['Referencia','Objeto anotado con categoría y caja para comprobar propuestas.'],['IoU','Intersection over Union: intersección sobre unión. Área compartida dividida entre el área cubierta por ambas cajas, sin duplicar la intersección.'],['Emparejamiento','Asignación uno a uno entre propuestas y referencias con categoría correcta e IoU suficiente.']],
  why: '¿Por qué una propuesta mala puede sumar dos errores?',
  reason: 'Se cuentan cosas diferentes. Una propuesta conservada sin coincidencia es un falso positivo (FP). Un objeto de referencia que quedó sin propuesta válida es un falso negativo (FN). Si una única caja queda mal ubicada, ocurren ambos. Un verdadero positivo (TP) requiere coincidencia válida; duplicar cajas de un objeto no crea más aciertos.',
  flow: [['Superposición','Área compartida = 1200 px²'],['Unión','Área total cubierta = 2000 px²'],['IoU','1200/2000 = 0,60'],['Criterio elegido','Categoría correcta e IoU≥0,50 → coincidencia']],
  read: 'No confundas el umbral de puntuación con el de IoU de evaluación o el de IoU de NMS. Precisión=TP/(TP+FP); recall=TP/(TP+FN). Si el denominador es cero, la proporción no está definida en este ejemplo.',
  question: 'Una referencia y una propuesta conservada, con categoría correcta e IoU 0,30. Se exige 0,50. ¿Qué cuentas?',
  answer: 'TP=0, FP=1 y FN=1. Precisión=0/1=0 y recall=0/1=0. Si se descarta la propuesta antes, FP=0 y FN=1; la precisión queda sin denominador. AP resume una curva de precisión–recall y mAP promedia AP bajo un protocolo: no salen de una sola IoU.',
  source: 'https://docs.ultralytics.com/guides/yolo-performance-metrics/'
 },
 'dl-integracion': {
  before: [['Política','Regla que transforma una salida del modelo en una acción.'],['Coste supuesto','Puntos para comparar consecuencias; no representan precios reales.'],['Evidencia de uso','Datos, errores y condiciones que permiten justificar el alcance de una decisión.']],
  why: '¿Por qué la mejor política depende de las consecuencias?',
  reason: 'Revisar consume recursos; omitir un defecto también puede tener consecuencias. Aquí suponemos que revisar identifica y retira cualquier defecto revisado. El coste suma revisiones y defectos aceptados; no añade otra penalización por falsa alerta porque su revisión ya está contada. En una aplicación habría que medir tiempos, errores humanos y capacidad disponible.',
  flow: [['Política A','4 revisiones; 1 defecto aceptado'],['Costes elegidos','1 punto/revisión; 8/defecto aceptado'],['Comparar','A: 4×1+1×8=12; revisar 10: 10×1=10'],['Cambiar una consecuencia','Con 1/defecto: A=5; revisar 10=10']],
  read: 'Las cantidades son un escenario construido para entender la cuenta; la práctica usa su propia tabla de diez granos. Cambian las consecuencias o el umbral, no las puntuaciones. Las dos alternativas deben evaluarse sobre los mismos casos.',
  question: '¿Puedes elegir el umbral mirando la prueba final y luego anunciar ese coste como evaluación independiente?',
  answer: 'No. Usa validación para elegir el umbral y la política, y una prueba reservada para estimar el resultado final. Documenta la regla, sus costes supuestos, capacidad y errores. Una comparación didáctica no autoriza un uso industrial.',
  source: 'https://scikit-learn.org/stable/modules/classification_threshold.html'
 }
};

export function renderDLPrerequisites(id) {
 const item = DL_FOUNDATIONS[id]; if (!item) return '';
 return `<div class="dl-foundation"><h3>Antes de seguir: tres ideas necesarias</h3><dl class="dl-first-terms">${item.before.map(([term, meaning])=>`<div><dt>${esc(term)}</dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl></div>`;
}
export function renderDLReason(id) {
 const item = DL_FOUNDATIONS[id]; if (!item) return '';
 return `<div class="dl-foundation">${id==='dl-redes'?renderBiasExplanation():''}<h3>${esc(item.why)}</h3><p>${esc(item.reason)}</p><figure class="dl-path"><figcaption>Una idea que puedes seguir</figcaption><ol>${item.flow.map(([title, value], index)=>`<li><span class="dl-path-index" aria-hidden="true">${index+1}</span><b>${esc(title)}</b><span>${esc(value)}</span></li>`).join('')}</ol><p>${esc(item.read)}</p></figure><p class="dl-foundation-source"><a href="${item.source}" target="_blank" rel="noopener noreferrer">Consultar el fundamento ↗</a></p></div>`;
}
export function renderDLCheck(id) {
 const item = DL_FOUNDATIONS[id]; if (!item) return '';
 return `<section class="dl-transfer-check"><h3>Haz una predicción antes de probar</h3><p>${esc(item.question)}</p><details><summary>Comparar mi razonamiento</summary><p>${esc(item.answer)}</p></details><p class="dl-record">Explica qué cambió, qué quedó igual y qué cuenta sostiene tu respuesta. Puedes anotarlo en tu bitácora; es una comprobación voluntaria.</p></section>`;
}

// Números dados: muestra lo que una no linealidad permite representar, sin entrenar.
export function activationComposition(x, nonlinear = true) {
 const first = nonlinear ? Math.max(0, x) : x;
 const second = nonlinear ? Math.max(0, -x) : -x;
 return {x, first, second, output:first+second};
}
export function renderActivationBridge() {
 return `<section class="dl-activation-bridge"><h3>¿Qué aporta una activación entre capas?</h3><p>Dos unidades reciben x y −x. Sus salidas se suman con pesos 1 y sesgo 0. Conserva esos parámetros y cambia solo la activación.</p><label>Transformación de las dos unidades<select data-composition-mode><option value="relu">Con ReLU: aparece una V</option><option value="linear">Sin activación: se cancelan</option></select></label><label>Entrada x <output data-composition-value></output><input data-composition-x type="range" min="-3" max="3" step="0.5" value="-2"></label><div data-composition-plot></div><p data-composition-result role="status" aria-live="polite"></p><p>Horizontal: entrada x; vertical: salida. La línea muestra todas las entradas y el punto la elegida. Este ejemplo demuestra una posibilidad de representación; sus pesos son manuales.</p></section>`;
}
export function mountActivationBridge(root) {
 const input=root.querySelector('[data-composition-x]'), mode=root.querySelector('[data-composition-mode]');
 if(!input||!mode)return;
 const fmt=n=>n.toLocaleString('es-CO',{maximumFractionDigits:2});
 const draw=()=>{
  const r=activationComposition(Number(input.value),mode.value==='relu');
  root.querySelector('[data-composition-value]').textContent=fmt(r.x);
  input.setAttribute('aria-label','Entrada x para comparar capas');input.setAttribute('aria-valuetext',fmt(r.x));
  const px=x=>55+(x+3)*65, py=y=>225-y*55;
  const points=Array.from({length:61},(_,i)=>{const x=-3+i/10;return `${px(x)},${py(activationComposition(x,mode.value==='relu').output)}`;}).join(' ');
  const zoomOpen=root.querySelector('[data-composition-plot] details')?.open;
  root.querySelector('[data-composition-plot]').innerHTML=withDiagramZoom(`<svg viewBox="0 0 500 280" role="img" aria-label="${mode.value==='relu'?'Con ReLU: salida igual al valor absoluto de x':'Sin activación: salida cero en todas las entradas'}"><path d="M55 30V225H445" fill="none" stroke="currentColor"/>${[-3,0,3].map(x=>`<text x="${px(x)}" y="245" text-anchor="middle">${x}</text>`).join('')}${[0,1,2,3].map(y=>`<text x="42" y="${py(y)+5}" text-anchor="end">${y}</text>`).join('')}<text x="250" y="272" text-anchor="middle">Entrada x</text><text x="55" y="20">Salida</text><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="${px(r.x)}" cy="${py(r.output)}" r="7" fill="currentColor"/></svg>`);
  if(zoomOpen)root.querySelector('[data-composition-plot] details').open=true;
  root.querySelector('[data-composition-result]').textContent=`x=${fmt(r.x)}. Primera unidad: ${fmt(r.first)}. Segunda: ${fmt(r.second)}. Suma: ${fmt(r.first)} + (${fmt(r.second)}) = ${fmt(r.output)}. ${mode.value==='relu'?'ReLU(x)+ReLU(−x) representa |x|: la V no se reduce a una sola recta.':'x+(−x)=0: se cancelan para cualquier entrada.'}`;
 };
 input.addEventListener('input',draw);mode.addEventListener('change',draw);draw();
}
