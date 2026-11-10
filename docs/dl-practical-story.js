const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Un mismo proyecto de la cooperativa; cada tema conserva su pregunta y su prueba.
export const PRACTICAL_STORY={
 'dl-secuencias':{
  resume:'La cooperativa quiere preparar la recepción de mañana. Su historial reciente registra 10, 20, 30 y 40 cajas en cuatro días.',
  question:'¿El promedio de 25 cajas cuenta lo mismo si las entregas ocurrieron al revés?',
  mission:'Lee un día después de otro y actualiza un resumen. Así comprobarás qué información se pierde al ignorar el orden antes de intentar anticipar entregas.',
  carried:'El orden importa. El estado resume lo leído; todavía no dice cuántas cajas llegarán mañana.',
  deliverable:'En tu bitácora, conserva las cuatro entradas, sus estados y una frase comparando el recorrido inverso.',
  next:'Si conservamos los registros, ¿podemos consultarlos dando distinta participación a cada uno?',
  reading:'Usamos cuatro días y una regla mitad y mitad para seguir cada operación. La LSTM del cuaderno aprende otros parámetros y ensaya un pronóstico con otra serie.'
 },
 'dl-atencion':{
  resume:'Ya distinguimos el historial ordenado de su promedio. La cooperativa conserva sus registros para consultarlos al estudiar la recepción.',
  question:'¿Cómo cambia un resumen si un registro participa más que otro?',
  mission:'Toma dos registros del diario, A=10 y B=20 cajas. Cambia la consulta y sigue cuánto participa cada uno, cuánto aporta y cómo se suman ambos aportes.',
  carried:'La mezcla conserva información de los registros. Una participación mayor no demuestra que una fuente sea más fiable.',
  deliverable:'En tu bitácora, guarda una consulta, sus dos participaciones, los dos aportes y la suma resultante.',
  next:'¿Cómo organiza una arquitectura estas relaciones sin perder dónde estaba cada registro?',
  reading:'Reducimos el diario a dos registros para poder reconstruir la mezcla completa. En una red real, las transformaciones que permiten comparar registros pueden aprenderse; aquí están dadas.'
 },
 'dl-transformers':{
  resume:'Ya leímos registros en orden y construimos una mezcla. Antes de confiar en una salida para preparar la recepción, debemos saber comprobarla.',
  question:'¿El último día llegaron menos cajas que el primero, y coincide la respuesta propuesta con esa referencia?',
  mission:'Resuelve la comparación de extremos. Después recorre representación, posición, relaciones y salida, y contrasta la clase elegida con tu respuesta.',
  carried:'Una puntuación mayor elige una clase; no garantiza un acierto ni pronostica la recepción de mañana.',
  deliverable:'En tu bitácora, guarda la secuencia, la referencia, las dos puntuaciones y si la clase elegida coincide.',
  next:'Para revisar lo recibido también necesitamos mirar imágenes: ¿qué objetos propone localizar un detector?',
  reading:'Una regla pequeña permite comprobar cada respuesta a mano. El Transformer del cuaderno aprende a clasificar extremos; es un ensayo distinto del pronóstico LSTM, no una etapa de ese mismo predictor.'
 },
 'dl-yolo':{
  resume:'Preparar la próxima recepción también exige inspeccionar lo recibido. Además del historial, la cooperativa necesita un registro de propuestas sobre imágenes.',
  question:'¿Qué propone localizar el detector y qué filas conserva nuestro filtro?',
  mission:'Elige una caja y síguela hasta su fila: categoría, puntuación y coordenadas. Cambia el corte conservando la escena y predice cuántas propuestas quedarán.',
  carried:'Contar propuestas conservadas no equivale a confirmar el inventario recibido.',
  deliverable:'En tu bitácora, conserva una propuesta con coordenadas, puntuación, corte y decisión de conservarla o descartarla.',
  next:'Ya tenemos propuestas. ¿Cómo comprobamos si una caja corresponde al objeto y está bien ubicada?',
  reading:'Usamos pocas propuestas dibujadas para rastrear cada fila. En Colab, YOLO detecta categorías conocidas en una fotografía; eso no enseña defectos agrícolas nuevos.'
 },
 'dl-evaluacion':{
  resume:'La cooperativa ya tiene propuestas registradas. Una puntuación suficiente hizo que una caja pasara el filtro; aún falta comprobarla.',
  question:'¿La propuesta conservada coincide con el objeto de referencia?',
  mission:'Superpón las cajas, calcula sus áreas y construye IoU paso a paso. Después distingue la propuesta incorrecta del objeto que quedó sin detectar.',
  carried:'Filtrar por puntuación y comprobar ubicación son operaciones diferentes. Una caja mal ubicada puede producir un FP y un FN.',
  deliverable:'En tu bitácora, guarda las dos cajas, área común, unión, IoU y conteos TP/FP/FN del mismo caso.',
  next:'Saber dónde falla una propuesta no elige una acción: ¿qué unidades conviene revisar y con qué consecuencias?',
  reading:'Dos cajas de 40×40 píxeles permiten reconstruir todas las áreas. Este ensayo usa referencias sintéticas conocidas; no evalúa automáticamente la fotografía del detector.'
 },
 'dl-integracion':{
  resume:'La cooperativa separó registro y comprobación. Ahora estudia una regla para revisar diez unidades conocidas de la recepción.',
  question:'¿Revisar menos granos reduce siempre el coste de la inspección?',
  mission:'Elige una regla viendo las puntuaciones de defecto. Después revela las referencias y cuenta revisiones y defectos aceptados antes de sumar sus costes.',
  carried:'La puntuación de defecto es un dato distinto de la confianza de YOLO. Cambiar costes no cambia esas puntuaciones.',
  deliverable:'En tu bitácora, compara dos reglas: unidades revisadas, defectos aceptados y coste desmenuzado con sus supuestos.',
  next:'Conserva esta evidencia: elige la regla con validación y compruébala después en datos reservados.',
  reading:'Diez granos y puntos ficticios hacen comprobable cada consecuencia. Las puntuaciones están dadas y suponemos revisión perfecta; no representan un detector agrícola desplegado.'
 }
};

const locationFor=id=>{
 const e3=['dl-secuencias','dl-atencion','dl-transformers'],e4=['dl-yolo','dl-evaluacion','dl-integracion'];
 const index=e3.indexOf(id);return index>=0?`Encuentro 3 · Tema ${index+1} de 3`:`Encuentro 4 · Tema ${e4.indexOf(id)+1} de 3`;
};

export function renderStudentStory(id){
 const s=PRACTICAL_STORY[id];if(!s)return '';
 return `<div class="pw-student-story" data-student-story="${id}"><h3>Nuestro caso: preparar la próxima recepción</h3><p class="pw-story-location">${locationFor(id)}</p><p>${escapeHTML(s.resume)}</p><p class="pw-story-question"><strong>${escapeHTML(s.question)}</strong></p><p>${escapeHTML(s.mission)}</p></div>`;
}
