// Las horas se calculan desde el horario del encuentro; la agenda no controla el acceso.
export const SESSION_BLOCKS={
 ml:[
  [[45,'generalidades','Generalidades 2: conceptos clave y preguntas'],[30,'contenido','Formular la pregunta: entradas, respuesta y caso reservado'],[30,'contenido','Preparar los datos: ausencias y separación antes de ajustar'],[15,'pausa','Pausa'],[35,'contenido','Primera predicción y lectura del error'],[40,'practica','Práctica guiada en la copia personal de Colab'],[15,'cierre','Interpretación, dudas y conexión con clasificación']],
  [[10,'retoma','Retomar la predicción y resolver dudas de la práctica'],[45,'contenido','Clasificación: puntuación, categoría y clase positiva'],[15,'pausa','Pausa'],[45,'contenido','Reconstruir los cuatro resultados y leer las métricas'],[40,'contenido','Umbral: errores y capacidad de revisión'],[65,'practica','Práctica guiada de alertas y comparación de escenarios'],[20,'cierre','Interpretación, dudas y cierre']],
  [[10,'retoma','Recuperar las ideas de datos y evaluación'],[40,'contenido','Clustering: agrupar registros y leer sus límites'],[35,'contenido','PCA: resumir variables e interpretar la proyección'],[15,'pausa','Pausa'],[40,'contenido','Ensambles: combinar y comparar sobre la misma prueba'],[55,'practica','Práctica guiada: interpretar grupos, proyección y modelos'],[15,'cierre','Explicar qué pregunta responde cada método']],
  [[10,'retoma','Conectar los métodos con la pregunta operativa'],[55,'contenido','Series: corte temporal, referencia y pronóstico'],[15,'pausa','Pausa'],[35,'contenido','Refuerzo: estado, acción, recompensa y política'],[65,'practica','Integración: construir y comprobar un prototipo'],[40,'practica','Interpretar resultados y proponer la siguiente prueba'],[20,'cierre','Síntesis de ML y conexión con redes neuronales']]
 ],
 dl:[
  [[10,'repaso','Recordar Generalidades: relación entre IA, ML y DL'],[35,'contenido','Redes: seguir entradas, pesos y salida'],[25,'contenido','Activaciones: transformar la señal y leer las curvas'],[15,'pausa','Pausa'],[40,'contenido','Entrenamiento: pérdida, paso y tasa de aprendizaje'],[65,'practica','Práctica guiada: comparar el cálculo fijo con una red entrenada'],[20,'cierre','Interpretar lo aprendido, dudas y cierre']],
  [[10,'retoma','Recuperar el recorrido de una red'],[35,'contenido','Visión: píxeles y salidas para tres tareas'],[45,'contenido','CNN: ventana, filtro y mapa de respuestas'],[15,'pausa','Pausa'],[35,'contenido','Transferencia: reutilizar pesos y distinguir ajuste fino'],[80,'practica','Práctica guiada: filtros, imágenes y lectura de salidas'],[20,'cierre','Interpretación y dudas']],
  [[10,'retoma','Recuperar representación y salida'],[30,'contenido','Secuencias: orden, ventana y estado'],[35,'contenido','Atención: comparar fuentes y seguir una mezcla'],[15,'pausa','Pausa'],[35,'contenido','Transformer: representación, posición y atención'],[65,'practica','Práctica guiada: secuencias y atención con datos visibles'],[20,'cierre','Explicar el mecanismo con palabras y resolver dudas']],
  [[10,'retoma','Situar la tarea de detección'],[45,'contenido','YOLO: foto, cajas, puntuaciones y tabla'],[15,'pausa','Pausa'],[40,'contenido','Evaluación: referencia, coincidencia y errores'],[60,'practica','Integración: construir una política de revisión'],[50,'practica','Comparar escenarios, guardar resultados e interpretar límites'],[20,'cierre','Síntesis de DL y cierre de las dos asignaturas']]
 ]
};
function bounds(meeting){
 const m=String(meeting?.time||'').match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
 if(!m)return null;
 const start=Number(m[1])*60+Number(m[2]),end=Number(m[3])*60+Number(m[4]);
 return start<end?{start,end}:null;
}
const clock=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
export function courseHours(course){
 return (course?.classes||[]).reduce((sum,meeting)=>{const t=bounds(meeting);return sum+(t?t.end-t.start:0);},0)/60;
}
export function getSessionPlan(courseId,index,meeting){
 const blocks=SESSION_BLOCKS[courseId]?.[index],t=bounds(meeting);
 if(!blocks||!t)return null;
 const total=blocks.reduce((sum,[minutes])=>sum+minutes,0);
 if(total!==t.end-t.start)throw new RangeError('La agenda no cabe en el horario de '+courseId+' '+(index+1));
 let at=t.start;
 const rows=blocks.map(([minutes,kind,title])=>{const from=at;at+=minutes;return {from:clock(from),to:clock(at),minutes,kind,title};});
 return {rows,total,breakMinutes:rows.filter(r=>r.kind==='pausa').reduce((n,r)=>n+r.minutes,0),start:clock(t.start),end:clock(t.end)};
}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderSessionPlan(courseId,index,meeting){
 const plan=getSessionPlan(courseId,index,meeting);if(!plan)return '';
 return '<div class="learning-table-wrap"><table class="learning-table"><caption>Distribución orientativa · '+plan.total+' minutos, incluida la pausa · Colombia</caption><thead><tr><th scope="col">Hora</th><th scope="col">Min</th><th scope="col">Actividad</th></tr></thead><tbody>'+plan.rows.map(row=>'<tr><th scope="row">'+row.from+'–'+row.to+'</th><td>'+row.minutes+'</td><td>'+esc(row.title)+'</td></tr>').join('')+'</tbody></table></div><p>Los bloques orientan la clase y se ajustan al ritmo del grupo. Los materiales conservan su fecha de apertura para consultarlos; los minutos no bloquean temas.</p>';
}
