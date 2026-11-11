import {PRACTICAL_E3,renderE3Workbench,mountE3Workbench} from './practical-e3.js?v=visual-20261110';
import {PRACTICAL_E4,renderE4Workbench,mountE4Workbench} from './practical-e4.js?v=visual-20261110';
import {DL_LEARNING_PATHS} from './dl-learning-paths.js?v=dl-precision-20261105';
import {renderTopicVocabulary} from './lesson-context.js';
import {renderEncounterThreeMedia} from './dl-encounter-three-media.js?v=visual-20261110';
import {NOTEBOOK_PATHS} from './notebook-paths.js?v=dl-precision-20261105';
import {encounterForTopic,colabNotebookUrl} from './encounter-notebooks.js';
import {PRACTICAL_STORY,renderStudentStory} from './dl-practical-story.js?v=visual-20261110';
import {renderIndustryContext} from './dl-industry-context.js?v=visual-20261110';
import {renderVisualIdea,renderVisualFigures,renderVisualCards,visualColabNote,mountVisualExplainers} from './dl-visual-explainers.js?v=visual-20261110';

export const PRACTICAL_LESSONS=Object.fromEntries(Object.entries({...PRACTICAL_E3,...PRACTICAL_E4}).map(([id,p])=>[id,{...p,problem:PRACTICAL_STORY[id].resume,bridge:PRACTICAL_STORY[id].next,colabBridge:PRACTICAL_STORY[id].reading}]));
export const isPracticalLesson=id=>Object.hasOwn(PRACTICAL_LESSONS,id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const next=(target,label)=>`<button type="button" class="button dl-continue" data-lesson-section="${target}">${label} →</button>`;
const node=(id,current,name,detail)=>`<a href="#tema/${id}" ${id===current?'aria-current="page"':''} data-pw-topic="${id}"><strong>${name}</strong><span>${detail}</span><span class="pw-map-action">${id===current?'Estás aquí · Ir al ejercicio':'Abrir este tema'} →</span></a>`;

export function renderPracticalMap(id){
 const e3=Object.hasOwn(PRACTICAL_E3,id);
 return `<div class="pw-concept-map" aria-label="Mapa conceptual del encuentro ${e3?3:4}"><h3>Cómo se conectan los tres temas</h3>${e3?`
 <p class="pw-map-source"><strong>Tenemos registros en orden.</strong> Podemos estudiarlos con herramientas diferentes:</p>
 <div class="pw-map-branches"><div><p>Leer uno después de otro permite…</p>${node('dl-secuencias',id,'1 · Memoria: RNN y LSTM','Actualizar un estado con lo leído hasta ahora.')}</div><div><p>Consultar varias fuentes permite…</p>${node('dl-atencion',id,'2 · Atención','Repartir participaciones y combinar valores.')}</div></div>
 <p class="pw-map-link">La atención, junto con la posición y otras capas, forma parte de…</p>
 <div class="pw-map-end">${node('dl-transformers',id,'3 · Transformer','Una arquitectura que puede aprender una tarea sobre la secuencia.')}</div>
 <p class="pw-hint">La RNN y el Transformer son alternativas de arquitectura. El estado y la mezcla nos ayudan a entender operaciones; la respuesta de una tarea necesita una salida y una comprobación propias.</p>`:`
 <p class="pw-map-source"><strong>Queremos apoyar una inspección.</strong> Separamos tres preguntas antes de decidir:</p>
 <div class="pw-map-row">${node('dl-yolo',id,'1 · Detectar con YOLO','Foto → propuestas de cajas, categorías y puntuaciones.')}<p>Se comparan<br>con referencias</p>${node('dl-evaluacion',id,'2 · Evaluar','Cajas + anotaciones → coincidencias, errores y omisiones.')}</div>
 <p class="pw-map-link">Una decisión operativa exige además definir la acción y sus consecuencias.</p>
 <div class="pw-map-end">${node('dl-integracion',id,'3 · Integrar una solución','Unidades + puntuación de defecto dada + costes → regla de revisión.')}</div>
 <p class="pw-hint">Cambia la tarea del último tema: la puntuación de defecto de los diez granos es un dato didáctico distinto de la puntuación de YOLO. No la obtiene el detector del tema 1.</p>`}</div>`;
}

export function renderPracticalGuide(lesson){
 const id=lesson.id,p=PRACTICAL_LESSONS[id],base=DL_LEARNING_PATHS[id],e3=Object.hasOwn(PRACTICAL_E3,id);
 if(!p)return '';
 return `<section id="idea-del-tema" class="dl-lesson-section pw-orientation"><h2>1. Sigamos el caso de la cooperativa</h2>${renderStudentStory(id)}${renderVisualIdea(id)}<p><strong>Hoy podrás:</strong> ${esc(p.goal)}</p><div class="dl-section-action">${next('ejemplo-del-tema','Resolver esta parte del caso')}</div>${renderIndustryContext(id)}${renderPracticalMap(id)}</section>
 <section id="ejemplo-del-tema" class="dl-lesson-section pw-workbench" data-dl-primary-example="${id}"><h2>2. Míralo funcionar; después predice y comprueba</h2>${renderVisualFigures(id)}<h3 class="pw-turn">Tu turno: predice y comprueba</h3><p>${esc(p.task)}</p>${e3?renderE3Workbench(id):renderE4Workbench(id)}
 <p class="pw-carried"><strong>Lo que conservas para continuar:</strong> ${esc(PRACTICAL_STORY[id].carried)}</p>
 <details class="dl-understanding"><summary>${esc(p.checkQuestion)}</summary><p>${esc(p.checkAnswer)}</p></details>
 <h3 class="pw-turn">Ponle nombre a lo que acabas de hacer</h3>${renderVisualCards(id)}<details class="dl-reference pw-reference"><summary>Ver la definición formal y el vocabulario completo</summary><p class="dl-definition">${esc(base.definition)}</p><dl class="dl-essential-terms">${base.terms.map(([term,meaning])=>`<div><dt>${esc(term)}</dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl>${renderTopicVocabulary(id,lesson.guide.vocabulary,lesson.guide.essentialCount)}</details>
 ${e3?`<details class="dl-reference pw-reference"><summary>Relacionar el ejercicio con las imágenes de una red</summary><p>Primero resuelve el ejemplo. Después localiza en estas figuras la operación que comprobaste; son ilustraciones de arquitecturas, no nuevas cuentas que debas memorizar.</p>${renderEncounterThreeMedia(id)}</details>`:''}
 <div class="dl-section-action">${next('practica-del-tema','Hacer una comparación propia')}</div></section>`;
}

const COLAB_ACTIONS={
 'dl-secuencias':['Antes de ejecutar, señala cuáles son las doce lecturas de entrada y cuál es la siguiente lectura que intentamos anticipar.','Ejecuta la preparación y la LSTM. En los mismos instantes de prueba, localiza su error y el de repetir el último valor.','Anota ambos errores: ¿cuál fue menor en esta ejecución? Explica por qué el estado calculado en la web no era todavía este pronóstico.'],
 'dl-atencion':['Predice la mezcla para Q = [0, 0]: las dos fuentes deberían participar igual.','Ejecuta la preparación y la atención con A = 10 y B = 20. Compara las tres filas de consultas: [1, 0], [0, 1] y [0, 0].','Compara pesos y salida con el ejercicio de la web. Reconstruye una salida multiplicando cada valor por su peso y sumando los aportes.'],
 'dl-transformers':['Resuelve a mano las cuatro secuencias: la referencia es 1 si el último valor es menor que el primero y 0 en caso contrario.','Ejecuta la preparación y el entrenamiento. Localiza entrada, posición, encoder y salida en el código; después lee las predicciones impresas.','Compara referencia y predicción fila por fila. Explica un acierto o un error sin suponer que las puntuaciones dadas en la web eran salidas de esta ejecución.'],
 'dl-yolo':['Ejecuta preparación, carga e inferencia sobre la misma foto. El modelo reconoce categorías de su catálogo, no defectos agrícolas nuevos.','Elige una caja y sigue su categoría, puntuación y coordenadas hasta la misma fila de la tabla.','Compara los registros de dos umbrales. Exporta uno y anota la configuración: ¿qué cambió en las filas y qué siguió igual en la foto?'],
 'dl-evaluacion':['Predice qué pasará con una candidata desplazada 10 px y otra 30 px. Conserva el corte de coincidencia 0,50.','Ejecuta la preparación y la evaluación sintética. Comprueba área compartida, unión e IoU para ambas cajas.','Contrasta TP/FP/FN y luego filtra la propuesta con puntuación 0,80 usando corte 0,90. Explica qué ocurrió con la referencia que seguía presente.'],
 'dl-integracion':['Con coste de revisión 1 y defecto aceptado 8, predice si conviene más el corte 0,30 o el 0,50.','Ejecuta la preparación y la tabla de costes. Guarda el resultado y cambia únicamente COSTO_DEFECTO_ACEPTADO de 8 a 1.','Compara cada política con revisar todos. Justifica una elección con revisiones, defectos aceptados y coste; usa validación para elegir antes de comprobar en una prueba reservada.']
};

export function renderPracticalPractice(lesson,supportBooks='',notes=''){
 const id=lesson.id,p=PRACTICAL_LESSONS[id];if(!p)return '';
 const meeting=encounterForTopic(id),route=NOTEBOOK_PATHS[id];
 return `<section id="practica-del-tema" class="dl-lesson-section pw-transfer"><h2>3. Deja una conclusión para continuar</h2><dl class="dl-experiment-brief"><div><dt>Qué cambiar</dt><dd>${esc(p.change)}</dd></div><div><dt>Qué observar</dt><dd>${esc(p.watch)}</dd></div></dl>${next('ejemplo-del-tema','Volver al ejercicio y probar')}<p class="pw-deliverable"><strong>Tu producto para la cooperativa:</strong> ${esc(PRACTICAL_STORY[id].deliverable)} Completa: «Al cambiar ___, observé ___, porque ___».</p><details class="pw-check"><summary>Comparar mi explicación con lo esperado</summary><p>${esc(p.expected)}</p></details><p class="pw-bridge"><strong>La conexión siguiente:</strong> ${esc(p.bridge)}</p><div class="dl-section-action">${next('cuaderno-del-tema','Continuar con la práctica en Colab')}</div></section>
 <section id="cuaderno-del-tema" class="dl-lesson-section dl-notebook"><h2>4. Compruébalo con código en Colab</h2><p><strong>${esc(visualColabNote(id))}</strong></p><p>${esc(p.colabBridge)}</p><div class="dl-colab-location"><strong>Encuentro ${meeting.index+1} · Tema ${meeting.topics.indexOf(id)+1} de 3</strong><span>${esc(route.section)}</span><small>${esc(meeting.file)}</small></div><a class="button dl-colab-link" href="${esc(colabNotebookUrl(meeting.file,id))}" target="_blank" rel="noopener noreferrer">Abrir la práctica de este tema en Colab ↗</a><p class="dl-execution-note">La primera vez, elige <strong>Archivo → Guardar una copia en Drive</strong>. Si ya tienes tu copia, abre la sección indicada arriba.</p><ol class="dl-colab-steps">${COLAB_ACTIONS[id].map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="dl-execution-note">Cada tema incluye su preparación: ejecuta sus celdas en orden. Puedes trabajar en CPU. Los resultados de una red entrenada pueden variar; compara lo que produjo tu ejecución.</p><details class="dl-reference"><summary>Qué demuestra esta práctica y qué queda por comprobar</summary><p>${esc(route.observe)}</p><p>${esc(route.tip)}</p></details><details class="dl-reference dl-optional-material"><summary>Cuadernos de apoyo y descarga · opcionales</summary><p>Para el recorrido principal usa el botón de arriba. Estos apoyos tienen otros capítulos y ejemplos.</p>${supportBooks}<p><a href="notebooks/${meeting.file}" download>Descargar el cuaderno principal .ipynb</a></p></details>${notes}</section>`;
}

const mapMounts=new WeakSet();
export function mountPracticalMap(root=document,readHash=()=>location.hash){
 for(const link of root.querySelectorAll('[data-pw-topic]')){
  if(mapMounts.has(link))continue;mapMounts.add(link);
  link.addEventListener('click',event=>{
   if(readHash()!=='#tema/'+link.dataset.pwTopic)return;
   const section=root.querySelector('#ejemplo-del-tema');if(!section)return;
   event.preventDefault();const heading=section.querySelector('h2');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});section.scrollIntoView({block:'start',behavior:'auto'});
  });
 }
}
export function mountPracticalLessons(root=document){mountVisualExplainers(root);mountE3Workbench(root);mountE4Workbench(root);mountPracticalMap(root);}
