import {PRACTICAL_E3,renderE3Workbench,mountE3Workbench} from './practical-e3.js?v=visual-20261111e';
import {PRACTICAL_E4,renderE4Workbench,mountE4Workbench} from './practical-e4.js?v=visual-20261111e';
import {DL_LEARNING_PATHS} from './dl-learning-paths.js?v=dl-precision-20261105';
import {renderTopicVocabulary} from './lesson-context.js';
import {renderEncounterThreeMedia} from './dl-encounter-three-media.js?v=visual-20261111e';
import {NOTEBOOK_PATHS} from './notebook-paths.js?v=dl-precision-20261105';
import {encounterForTopic,colabNotebookUrl} from './encounter-notebooks.js';
import {PRACTICAL_STORY,renderStudentStory} from './dl-practical-story.js?v=visual-20261111e';
import {renderIndustryContext} from './dl-industry-context.js?v=visual-20261111e';
import {renderTopicRoute} from './dl-class-route.js?v=ruta-20261111b';
import {renderVisualOpener,renderVisualIdea,renderVisualFigures,renderVisualCards,visualColabNote,renderEncounterGlossary,renderTopicBibliography,renderEncounterClosing,mountVisualExplainers} from './dl-visual-explainers.js?v=visual-20261111e';

export const PRACTICAL_LESSONS=Object.fromEntries(Object.entries({...PRACTICAL_E3,...PRACTICAL_E4}).map(([id,p])=>[id,{...p,problem:PRACTICAL_STORY[id].resume,bridge:PRACTICAL_STORY[id].next,colabBridge:PRACTICAL_STORY[id].reading}]));
export const isPracticalLesson=id=>Object.hasOwn(PRACTICAL_LESSONS,id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const next=(target,label)=>`<button type="button" class="button dl-continue" data-lesson-section="${target}">${label} →</button>`;
const MAP_FLOW={
 3:{lead:'Un mismo problema, entender datos que vienen en orden, resuelto de tres formas. Cada tema nace de un límite del anterior.',
  nodes:[
   ['dl-secuencias','blue','RNN y LSTM','Leer en orden','Lee un elemento tras otro y guarda un resumen en su memoria.','secuencia → memoria'],
   ['dl-atencion','pink','Atención','Mirar lo que importa','Compara lo que busca con todo lo guardado y mezcla lo más parecido.','consulta + registros → mezcla ponderada'],
   ['dl-transformers','violet','Transformer','Mirar todo a la vez','Relaciona todos los elementos con atención y añade su posición.','secuencia completa → respuesta de la tarea']],
  links:[['La memoria olvida lo lejano.','La atención permite consultar directamente lo que importa, sin recordarlo todo.'],['Si la atención ya relaciona todo con todo, no hace falta leer en fila.','Pero así se pierde el orden: por eso la posición forma parte de la entrada.']],
  note:'RNN y Transformer son dos arquitecturas para la misma clase de tareas. La atención es la pieza que las separa.'},
 4:{lead:'Un mismo flujo de trabajo: de una foto a una acción. Cada tema responde la pregunta que deja abierta el anterior.',
  nodes:[
   ['dl-yolo','blue','YOLO','Encontrar','Localiza y nombra los objetos de una imagen.','foto → cajas, categoría y confianza'],
   ['dl-evaluacion','pink','IoU, precisión y recall','Comprobar','Compara las cajas con referencias anotadas y cuenta los errores.','cajas + referencias → aciertos, falsas alarmas y olvidos'],
   ['dl-integracion','violet','Integración','Decidir','Convierte una puntuación en una acción según lo que cuesta cada error.','puntuación + costes → revisar o aceptar']],
  links:[['Una caja dibujada no es una caja correcta.','Las cajas se comparan con referencias para medir cuánto coinciden.'],['Ya sabemos cuánto se equivoca el modelo.','Decidir exige fijar qué hacer con cada puntuación y cuánto cuesta cada error.']],
  note:'En el tema 3 las puntuaciones de defecto son un dato del ejercicio: no salen del detector del tema 1.'}
};
const node=(id,current,color,index,name,verb,detail,flow)=>`<a class="pw-flow-node pw-flow-${color}" href="#tema/${id}" ${id===current?'aria-current="page"':''} data-pw-topic="${id}"><span class="pw-flow-step" aria-hidden="true">${index}</span><span class="pw-flow-body"><small>${esc(verb)}</small><strong>${esc(name)}</strong><span>${esc(detail)}</span><span class="pw-flow-io">${esc(flow)}</span><span class="pw-map-action">${id===current?'Estás aquí · Ir al ejercicio':'Abrir este tema'} →</span></span></a>`;

export function renderPracticalMap(id){
 const number=Object.hasOwn(PRACTICAL_E3,id)?3:4,map=MAP_FLOW[number];
 return `<div class="pw-concept-map pw-flow" aria-label="Mapa conceptual del encuentro ${number}"><h3>Cómo se conectan los tres temas</h3><p class="pw-flow-lead">${esc(map.lead)}</p><ol class="pw-flow-list">${map.nodes.map(([topic,color,name,verb,detail,flow],i)=>`<li>${node(topic,id,color,i+1,name,verb,detail,flow)}${map.links[i]?`<p class="pw-flow-link"><span aria-hidden="true">↓</span><span><b>Límite:</b> ${esc(map.links[i][0])} <b>Siguiente paso:</b> ${esc(map.links[i][1])}</span></p>`:''}</li>`).join('')}</ol><p class="pw-hint">${esc(map.note)}</p></div>`;
}

export function renderPracticalGuide(lesson){
 const id=lesson.id,p=PRACTICAL_LESSONS[id],base=DL_LEARNING_PATHS[id],e3=Object.hasOwn(PRACTICAL_E3,id);
 if(!p)return '';
 const folded=id!=='dl-transformers',bench=e3?renderE3Workbench(id):renderE4Workbench(id);
 return `${renderTopicRoute(id)}<section id="idea-del-tema" class="dl-lesson-section pw-orientation"><h2>1. Sigamos el caso de la cooperativa</h2>${renderVisualOpener(id)}${renderStudentStory(id)}${renderVisualIdea(id)}<p><strong>Hoy podrás:</strong> ${esc(p.goal)}</p><div class="dl-section-action">${next('ejemplo-del-tema','Resolver esta parte del caso')}</div><details class="dl-reference pw-industry"><summary>Ver un uso en la industria y cuándo tiene sentido</summary>${renderIndustryContext(id)}</details>${renderPracticalMap(id)}</section>
 <section id="ejemplo-del-tema" class="dl-lesson-section pw-workbench" data-dl-primary-example="${id}"><h2>${folded?'2. Míralo funcionar y ponlo a prueba':'2. Míralo funcionar; después predice y comprueba'}</h2>${renderVisualFigures(id)}
 <h3 class="pw-turn">Ponle nombre a lo que acabas de ver</h3>${renderVisualCards(id)}
 ${folded?`<details class="dl-reference pw-optional-challenge" data-pw-challenge><summary>Reto opcional: predice a mano antes de ver la cuenta</summary><p>${esc(p.task)}</p>${bench}</details>`:`<h3 class="pw-turn">Tu turno: predice y comprueba</h3><p>${esc(p.task)}</p>${bench}`}
 <p class="pw-carried"><strong>Lo que conservas para continuar:</strong> ${esc(PRACTICAL_STORY[id].carried)}</p>
 <details class="dl-understanding"><summary>${esc(p.checkQuestion)}</summary><p>${esc(p.checkAnswer)}</p></details>
 ${e3?`<details class="dl-reference pw-reference" open><summary>Relacionar la figura con las imágenes de una red</summary><p>Localiza en estas imágenes la operación que acabas de mover en la figura. Son ilustraciones de arquitecturas, no cuentas nuevas.</p>${renderEncounterThreeMedia(id)}</details>`:''}
 <details class="dl-reference pw-reference pw-definitions" data-pw-definitions><summary>Todas las definiciones para consultar <span>definición del tema, ${lesson.guide.vocabulary.length} términos con sus siglas y el glosario del encuentro</span></summary><div class="vx vx-inline"><p class="vx-formal dl-definition"><span>Definición del tema</span>${esc(base.definition)}</p><h4 class="vx-subhead">Tres ideas esenciales</h4><dl class="dl-essential-terms">${base.terms.map(([term,meaning])=>`<div><dt>${esc(term)}</dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl><h4 class="vx-subhead">Términos y siglas de este tema</h4><dl class="vx-glossary vx-terms">${lesson.guide.vocabulary.map(v=>`<div><dt>${esc(v.term)}</dt><dd>${esc(v.meaning)}</dd></div>`).join('')}</dl>${renderEncounterGlossary(id)}</div></details>
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
 <section id="cuaderno-del-tema" class="dl-lesson-section dl-notebook"><h2>4. Compruébalo con código en Colab</h2><p><strong>${esc(visualColabNote(id))}</strong></p><p>${esc(p.colabBridge)}</p><div class="dl-colab-location"><strong>Encuentro ${meeting.index+1} · Tema ${meeting.topics.indexOf(id)+1} de 3</strong><span>${esc(route.section)}</span><small>${esc(meeting.file)}</small></div><a class="button dl-colab-link" href="${esc(colabNotebookUrl(meeting.file,id))}" target="_blank" rel="noopener noreferrer">Abrir la práctica de este tema en Colab ↗</a><p class="dl-execution-note">La primera vez, elige <strong>Archivo → Guardar una copia en Drive</strong>. Si ya tienes tu copia, abre la sección indicada arriba.</p><ol class="dl-colab-steps">${COLAB_ACTIONS[id].map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="dl-execution-note">Cada tema incluye su preparación: ejecuta sus celdas en orden. Puedes trabajar en CPU. Los resultados de una red entrenada pueden variar; compara lo que produjo tu ejecución.</p><details class="dl-reference"><summary>Qué demuestra esta práctica y qué queda por comprobar</summary><p>${esc(route.observe)}</p><p>${esc(route.tip)}</p></details><details class="dl-reference dl-optional-material"><summary>Cuadernos de apoyo y descarga · opcionales</summary><p>Para el recorrido principal usa el botón de arriba. Estos apoyos tienen otros capítulos y ejemplos.</p>${supportBooks}<p><a href="notebooks/${meeting.file}" download>Descargar el cuaderno principal .ipynb</a></p></details>${renderEncounterClosing(id)||renderTopicBibliography(id)}${notes}</section>`;
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
function mountOptionalChallenge(root){
 const challenge=root.querySelector?.('[data-pw-challenge]');if(!challenge)return;
 for(const button of root.querySelectorAll('#practica-del-tema [data-lesson-section="ejemplo-del-tema"]'))button.addEventListener('click',()=>{challenge.open=true;});
}
export function mountPracticalLessons(root=document){mountVisualExplainers(root);mountOptionalChallenge(root);mountE3Workbench(root);mountE4Workbench(root);mountPracticalMap(root);}
