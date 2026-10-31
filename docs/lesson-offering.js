import {renderMeetingContext} from './lesson-context.js?v=organizacion-20261027';
import {renderNotebookPath,SOURCE_NOTEBOOK_PATHS} from './notebook-paths.js';
import {renderMeetingDefinitions} from './definitions.js?v=claridad-20261030';
import {renderSessionPlan} from './session-plans.js?v=1';
// Orientación editorial: acompaña el contenido, sin cambiar acceso ni progreso.
export const LESSON_OFFERING={
 'ml-problema':{focus:'Entrada, respuesta y caso reservado: identifica qué sabes antes de predecir y qué revelas después para comprobar.',bridge:'Conserva la separación entre aprender, predecir y comprobar. El caso pequeño deja ver una cuenta; el cuaderno permite repetir el proceso con más filas y entradas.'},
 'ml-preparacion':{focus:'Ausencia, imputación y entrenamiento: completar un dato exige elegir una regla y explicar de qué registros se aprende.',bridge:'Busca la misma decisión de preparación dentro del pipeline. Cambia el tamaño de la tabla; se mantiene la regla de aprender la preparación solo con entrenamiento.',explorer:'missing'},
 'ml-regresion':{focus:'Observado, predicho y error: lee primero los puntos y sus unidades; después relaciona la pendiente y el intercepto con la recta.',bridge:'El caso del tema, el explorador de fertilizante y el cuaderno usan datos distintos. Sigue en cada uno entrada → predicción → error; compara modelos solo sobre las mismas filas reservadas.',explorer:'prediction'},
 'ml-clasificacion':{focus:'Clase positiva, puntuación y categoría: una puntuación se transforma en decisión al aplicar un umbral.',bridge:'Aquí buscamos plagas; en la primera sección del cuaderno se busca alto rendimiento. Redefine la clase positiva antes de leer sus salidas. Iris es otra tarea de clasificación y queda como transferencia, no como continuación de las plantas.',explorer:'alerts'},
 'ml-metricas':{focus:'Realidad y decisión: cuenta los cuatro resultados antes de calcular cualquier proporción.',bridge:'En el bloque indicado puedes reconstruir la misma tabla de diez plantas. Empareja cada realidad con su decisión y solo después contrasta los conteos y las métricas.',explorer:'alerts'},
 'ml-umbral':{focus:'Puntuación y umbral: al mover el umbral cambian las alertas, aunque las plantas y sus realidades permanezcan iguales.',bridge:'La comparación de umbrales se hace en el explorador. El cuaderno permite comprobar los conteos del caso fijo 0,50; no tiene ese selector. Registra la comparación en tu copia o bitácora.',explorer:'alerts'},
 'ml-clustering':{focus:'Similitud, distancia y grupo: agrupar registros no significa predecir una etiqueta conocida.',bridge:'El cuaderno amplía la idea con otro conjunto y DBSCAN. Interpreta sus grupos y puntos no agrupados; sus etiquetas no deben coincidir con las del ejemplo pequeño.'},
 'ml-pca':{focus:'Variable, componente y variación: una proyección cambia la representación, no crea una respuesta que antes no existía.',bridge:'Conecta la proyección del ejemplo con PC1 y PC2 del cuaderno. Los porcentajes se calculan con sus propios datos; interpreta lo conservado y lo perdido sin trasladar cifras entre conjuntos.'},
 'ml-ensambles':{focus:'Modelo individual y combinación: compara todos con la misma tarea, partición y métrica.',bridge:'La combinación ilustrada ayuda a entender la idea. El cuaderno entrena otros modelos: usa su tabla sobre las mismas fincas de prueba para decidir si la combinación mejora la referencia.'},
 'ml-series':{focus:'Pasado disponible, futuro reservado y referencia: lee primero dónde está el corte temporal.',bridge:'La serie del cuaderno tiene su propia variación. Mantén el orden temporal y compara pronóstico y referencia sobre los mismos instantes; sus errores no tienen que igualar los del ejemplo.'},
 'ml-refuerzo':{focus:'Estado, acción y recompensa: una política se aprende por interacción con un entorno.',bridge:'GridWorld es un entorno didáctico distinto de una operación agrícola. Sigue la secuencia estado → acción → recompensa y distingue los episodios de entrenamiento de la demostración final.'},
 'ml-integracion':{focus:'Pregunta, evidencia y límite: justifica una decisión a partir de resultados de prueba, no solo de una cifra favorable.',bridge:'Vuelve a una comparación ya ejecutada del cuaderno. Usa sus errores y ejemplos reservados como evidencia; explica qué prueba adicional haría falta antes de una aplicación real.'},
 'dl-redes':{focus:'Entrada → combinación → activación → salida: sigue primero el recorrido de un dato; los pesos indican cómo participa cada entrada.',bridge:'La neurona permite seguir un cálculo con pesos fijados. En el bloque 09 del cuaderno se usa sigmoide: sigue esa función y sus valores, sin esperar la salida de un ejemplo con ReLU.'},
 'dl-activaciones':{focus:'Señal de entrada y salida: la activación transforma un número; no aprende por sí sola los pesos de la red.',bridge:'Primero compara las curvas; después identifica dónde aparece cada activación en el cuaderno. Una activación de capa oculta y la transformación de la salida cumplen funciones distintas.',explorer:'signal'},
 'dl-entrenamiento':{focus:'Predicción → pérdida → actualización: el error guía un cambio de parámetros; la tasa decide el tamaño del paso.',bridge:'Para ver un paso de ajuste usa la pérdida sencilla del bloque 01. Para ver una red entrenada usa el bloque 09. Comparten la idea de reducir pérdida, pero sus parámetros y cifras son diferentes.',explorer:'adjustment'},
 'dl-vision':{focus:'Imagen y tarea: una etiqueta, una caja y una máscara responden a preguntas distintas.',bridge:'El dibujo compara tareas; el cuaderno YOLO ejecuta detección sobre una foto. Relaciona cajas con filas de la tabla, sin interpretar esas cajas como máscaras de segmentación.',explorer:'vision'},
 'dl-cnn':{focus:'Ventana → filtro → respuesta: selecciona una zona de la imagen y sigue cómo produce una celda del mapa.',bridge:'El filtro editable explica una operación. El bloque 10 incluye una CNN de dígitos y otro filtro fijo: identifica cuál se entrena y cuál se eligió para ilustrar; los mapas no serán iguales.',explorer:'convolution'},
 'dl-transferencia':{focus:'Pesos previos, reutilización y ajuste: cargar una red permite inferir; aprender una tarea nueva requiere entrenamiento.',bridge:'YOLO demuestra cargar pesos y ejecutar inferencia. Filtrar una categoría existente no enseña una nueva; usa esa distinción para explicar qué paso faltaría si quisieras ajustar el modelo.'},
 'dl-secuencias':{focus:'Orden y contexto: la salida depende de qué lecturas anteriores se usan y de cómo se organizan.',bridge:'La secuencia pequeña explica el papel del pasado. En la LSTM del cuaderno identifica la ventana de doce lecturas y compara modelo y referencia en los mismos instantes reservados.'},
 'dl-atencion':{focus:'Consulta, fuentes y mezcla: atención asigna pesos a información disponible y combina sus valores.',bridge:'El cuaderno reconstruye las mismas dos fuentes A=10 y B=20 del aula. Sigue consulta, reparto y mezcla con los valores sin redondear; después abre el detalle de las operaciones.'},
 'dl-transformers':{focus:'Representación, posición y atención: ubica cada pieza por lo que aporta al recorrido de una secuencia.',bridge:'El cuaderno clasifica secuencias numéricas. Relaciona sus piezas con el recorrido conceptual; no esperes generación de texto ni las capacidades de un chatbot.'},
 'dl-yolo':{focus:'Caja, categoría y puntuación: interpreta cada propuesta antes de aplicar filtros o contar objetos.',bridge:'Pasa del esquema a una foto y a su tabla. Sigue una detección entre ambas vistas y registra la configuración; una caja conservada aún no demuestra un acierto.'},
 'dl-evaluacion':{focus:'Propuesta y referencia: comprobar una detección exige contrastarla con una anotación y contar aciertos y errores.',bridge:'La sección 13 de YOLO compara cajas sintéticas con una referencia conocida y reproduce IoU y TP/FP/FN del aula. Las fotos de demostración no incluyen anotaciones; el cuaderno no calcula mAP de esas fotos.'},
 'dl-integracion':{focus:'Salida, revisión y coste: explica la regla que convierte una puntuación en una acción y qué supuestos la sostienen.',bridge:'La tabla del bloque 14 usa granos y costes ficticios. Examina sus supuestos y compara con revisar todos; no la presentes como una política validada en campo.'}
};
export const MEETING_OFFERING={
 ml:[
  ['Generalidades 2 en 45 minutos; después seguir una predicción de principio a fin: pregunta, preparación, separación y error.','Detalles del pipeline y variaciones del ajuste, después de interpretar la primera comparación.'],
  ['Retomar dudas de la primera práctica y después reconstruir los cuatro resultados de una alerta y explicar el efecto del umbral.','Calibración y más indicadores, después de comprender los conteos.'],
  ['Distinguir tres propósitos: agrupar registros, resumir variables y combinar modelos.','Variantes de algoritmos y detalles de ensambles, a partir de esa distinción.'],
  ['Respetar el tiempo al pronosticar y distinguir predicción de aprendizaje por interacción.','La implementación completa de Q-learning, después de entender estado, acción y recompensa.']
 ],
 dl:[
  ['Seguir cómo una red transforma entradas y cómo la pérdida guía el ajuste.','Derivaciones del gradiente y variantes de optimización, después del ciclo completo.'],
  ['Relacionar imagen, ventana, filtro y salida; distinguir reutilizar pesos de ajustarlos.','Variantes de stride, padding y ajuste fino, después del ejemplo visual.'],
  ['Entender el papel del orden y seguir una mezcla por atención dentro de una arquitectura.','Dimensiones matriciales y detalles de la arquitectura, después de interpretar la mezcla.'],
  ['Comprobar cajas con referencias y justificar una política de revisión con sus límites.','El desarrollo completo de AP/mAP, después de distinguir inferencia y evaluación.']
 ]
};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderMeetingOffering(courseId,index,meeting,{teacher=false}={}){
 const row=MEETING_OFFERING[courseId]?.[index];if(!row)return '';
 const agenda=teacher?renderSessionPlan(courseId,index,meeting):'';
 const focus='<details class="concept-depth"><summary>En qué nos centraremos y qué puedes profundizar</summary><p><b>Durante la clase:</b> '+esc(row[0])+'</p><p><b>Para profundizar:</b> '+esc(row[1])+'</p><p>Puedes volver a estos apoyos cuando lo necesites; las comprobaciones son opcionales y sin nota.</p>'+agenda+'</details>';
 const context=renderMeetingContext(courseId,index);
 if(!context)return focus;
 return '<div class="meeting-supports"><details class="meeting-reference"><summary>Contexto, recorrido y alcance del encuentro</summary>'+context+focus+'</details>'+renderMeetingDefinitions(courseId,index)+'</div>';
}
export function renderNotebookBridge(l){
 const o=LESSON_OFFERING[l.id],guide=l.guide.lab.notebookGuide;
 const support=SOURCE_NOTEBOOK_PATHS[l.id],explanation=(support?'<p><b>Cuaderno de apoyo:</b> '+esc(support.file)+'. Las referencias a sus bloques numerados corresponden a ese archivo. El cuaderno principal reúne la preparación dentro de cada tema.</p>':'')+(o?'<p><b>La conexión con el ejemplo:</b> '+esc(o.bridge)+'</p>':'')+'<p><b>Dónde continuar en tu copia:</b> '+esc(guide)+'</p>',path=renderNotebookPath(l.id);
 return path?path+'<details class="notebook-context"><summary>Cómo se conecta el cuaderno con este ejemplo</summary>'+explanation+'</details>':explanation;
}
export function renderExplorerLink(id){
 const topic=LESSON_OFFERING[id]?.explorer;
 return topic?'<p class="learning-bridge"><a class="inline-link" href="#explorar/'+topic+'">Explorar esta idea con otros valores →</a> <span>El ejemplo complementario usa sus propios datos; vuelve a este tema para continuar en el cuaderno.</span></p>':'';
}

