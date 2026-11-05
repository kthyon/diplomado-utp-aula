import {DL_LEARNING_PATHS} from './dl-learning-paths.js?v=dl-recorrido-20261105';
import {renderDLTopicDiagram} from './dl-topic-diagrams.js?v=dl-recorrido-20261105';
import {DL_FOUNDATIONS,renderBiasExplanation,renderActivationBridge} from './dl-foundations.js?v=dl-recorrido-20261105';
import {renderTopicVocabulary} from './lesson-context.js';
import {NOTEBOOK_PATHS} from './notebook-paths.js?v=dl-recorrido-20261105';
import {encounterForTopic,colabNotebookUrl} from './encounter-notebooks.js';
import {LESSON_OFFERING} from './lesson-offering.js?v=dl-recorrido-20261105';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nextSection=(target,label)=>`<button type="button" class="button dl-continue" data-lesson-section="${target}">${label}<span aria-hidden="true"> →</span></button>`;
const check=({question,answer})=>`<details class="dl-understanding"><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`;

export function renderDLGuide(lesson){
 const p=DL_LEARNING_PATHS[lesson.id];if(!p)return '';
 const g=lesson.guide,c=g.case,f=DL_FOUNDATIONS[lesson.id];
 const table=c.columns?.length?`<div class="learning-table-wrap"><table class="learning-table"><caption>${esc(c.title)}</caption><thead><tr>${c.columns.map(t=>`<th scope="col">${esc(t)}</th>`).join('')}</tr></thead><tbody>${c.rows.map(row=>`<tr>${row.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
 return `<section id="idea-del-tema" class="dl-lesson-section dl-concept"><h2><span>1.</span> Entiende la idea</h2><p class="dl-definition">${esc(p.definition)}</p>
 <dl class="dl-essential-terms">${p.terms.map(([name,meaning],i)=>`<div><dt><span class="dl-term-index" aria-hidden="true">${i+1}</span>${esc(name)}</dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl>
 ${renderTopicVocabulary(lesson.id,g.vocabulary,g.essentialCount)}
 <details class="dl-reference"><summary>Por qué funciona y qué conviene recordar</summary><h3>${esc(f.why)}</h3><p>${esc(f.reason)}</p>${lesson.id==='dl-redes'?`<details><summary>Profundizar en el bias: ejemplo de una báscula</summary>${renderBiasExplanation()}</details>`:''}<p><a href="${esc(f.source)}" target="_blank" rel="noopener noreferrer">Consultar la explicación original ↗</a></p></details>
 <div class="dl-section-action">${nextSection('ejemplo-del-tema','Continuar al ejemplo')}</div></section>
 <section id="ejemplo-del-tema" class="dl-lesson-section dl-worked-example" data-dl-primary-example="${lesson.id}"><h2><span>2.</span> ${esc(c.title)}</h2><p class="dl-example-question">${esc(p.example.question)}</p><p>${esc(p.example.intro)}</p>
 ${renderDLTopicDiagram(lesson.id)}<div class="dl-diagram-reading"><h3>Cómo leerlo</h3><p>${esc(p.example.reading)}</p></div><p class="dl-takeaway"><strong>Qué aprendemos:</strong> ${esc(p.example.takeaway)}</p>
 <details class="dl-reference"><summary>Ver los datos y la cuenta completa de este ejemplo</summary><p>${esc(c.context)}</p>${table}<ol class="dl-full-calculation">${c.reasoning.map(r=>`<li>${esc(r)}</li>`).join('')}</ol><p>${esc(c.conclusion)}</p></details>
 ${check(p.example.check)}<div class="dl-section-action">${nextSection('practica-del-tema','Continuar a la práctica')}</div></section>`;
}

export function renderDLPractice(lesson,supportBooks='',notes=''){
 const p=DL_LEARNING_PATHS[lesson.id];if(!p)return '';
 const route=NOTEBOOK_PATHS[lesson.id],meeting=encounterForTopic(lesson.id),topicIndex=meeting.topics.indexOf(lesson.id)+1;
 const primaryURL=colabNotebookUrl(meeting.file,lesson.id),extra=LESSON_OFFERING[lesson.id]?.explorer;
 const plant=['dl-redes','dl-entrenamiento'].includes(lesson.id)?`<a href="laboratorio.html?volver=${lesson.id}#red" target="_blank" rel="noopener noreferrer">Seguir el viaje de la información con una planta ↗</a>`:'';
 return `<section id="practica-del-tema" class="dl-lesson-section dl-practice"><h2><span>3.</span> ${esc(p.practice.title)}</h2><p>${esc(p.practice.prompt)}</p><dl class="dl-experiment-brief"><div><dt>Qué cambiar</dt><dd>${esc(p.practice.change)}</dd></div><div><dt>Qué observar</dt><dd>${esc(p.practice.watch)}</dd></div></dl>
 ${lesson.sim?'<div id="lesson-sim"></div>':`<div class="dl-without-simulator"><p>Haz la comparación sobre el gráfico del ejemplo. Después compruébala en el cuaderno.</p>${nextSection('ejemplo-del-tema','Volver al gráfico')}</div>`}
 <details class="dl-understanding"><summary>Comprobar lo que observaste</summary><p>${esc(p.practice.expected)}</p></details>
 <div class="dl-section-action">${nextSection('cuaderno-del-tema','Continuar al cuaderno de este tema')}</div></section>
 <section id="cuaderno-del-tema" class="dl-lesson-section dl-notebook"><h2><span>4.</span> Hazlo en Colab</h2><p>${esc(p.colab.goal)}</p>
 <div class="dl-colab-location"><strong>Encuentro ${meeting.index+1} · Tema ${topicIndex} de 3</strong><span>${esc(route.section)}</span><small>${esc(meeting.file)}</small></div>
 <a class="button dl-colab-link" href="${esc(primaryURL)}" target="_blank" rel="noopener noreferrer">Abrir la práctica de este tema en Colab ↗</a>
 <p class="dl-execution-note">La primera vez, elige <strong>Archivo → Guardar una copia en Drive</strong>. Si ya tienes tu copia del encuentro, reutilízala y ve a <strong>${esc(route.section)}</strong>.</p><ol class="dl-colab-steps">${p.colab.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p>Vuelve a esta pestaña para comprobar y registrar lo que observaste.</p>
 <p class="dl-execution-note">Cada tema incluye su preparación: ejecuta sus celdas en orden. Puedes trabajar en CPU. El cuaderno no marca automáticamente el progreso del aula.</p>
 <details class="dl-reference"><summary>Datos, unidades y alcance de esta práctica</summary><p>${esc(route.observe)}</p><p>${esc(route.tip)}</p></details>
 <div class="dl-build-check"><h3>Al terminar, comprueba</h3><p>${esc(p.colab.check)}</p></div>
 <details class="dl-reference dl-optional-material"><summary>Apoyos y otros ejemplos · opcionales</summary><p>El recorrido principal termina con el cuaderno de arriba. Estos recursos amplían la idea. Se abren aparte; vuelve a esta pestaña para continuar.</p>${plant?`<p>${plant}</p>`:''}${extra?`<p><a href="?tema-origen=${lesson.id}#explorar/${extra}" target="_blank" rel="noopener noreferrer">Explorar ${esc(lesson.title||'esta idea')} con otros datos ↗</a></p>`:''}${lesson.id==='dl-activaciones'?`<details><summary>Por qué una activación cambia lo que pueden representar varias capas</summary>${renderActivationBridge()}</details>`:''}${supportBooks?`<h3>Cuadernos de apoyo</h3><p>Estos archivos conservan sus propios capítulos y ejemplos; sus números de sección son distintos del cuaderno principal.</p>${supportBooks}`:''}<p><a href="notebooks/${meeting.file}" download>Descargar el cuaderno principal .ipynb</a></p></details>
 ${notes}</section>${lesson.id==='dl-integracion'?renderDLCourseEssentials():''}`;
}

export function renderDLCourseEssentials(){
 const items=[
  ['Una red transforma representaciones','Las entradas son datos; los pesos y bias son parámetros. Una capa transforma números y entrega otra representación. Deep Learning pertenece a Machine Learning, dentro de la inteligencia artificial.','dl-redes'],
  ['Predecir y aprender son acciones diferentes','Predecir usa los parámetros actuales. En el entrenamiento supervisado, una respuesta conocida permite calcular pérdida y gradientes para actualizar esos parámetros. La prueba utiliza casos reservados.','dl-entrenamiento'],
  ['La tarea determina qué salida necesitamos','Una etiqueta describe una imagen; cajas localizan objetos; máscaras marcan píxeles. En secuencias importa el orden. La atención mezcla información y forma parte de arquitecturas como Transformer.','dl-vision'],
  ['Reutilizar pesos no enseña una categoría nueva','Un modelo preentrenado ya aprendió con otros datos. Para otra tarea puedes entrenar una cabeza nueva o ajustar también parte del extractor; necesitas datos y una evaluación apropiados.','dl-transferencia'],
  ['Una puntuación necesita comprobación antes de actuar','El umbral convierte una puntuación en una regla de acción. Referencias, datos representativos, métricas y consecuencias permiten comprobar si esa regla sirve. Una demostración pequeña no demuestra desempeño en una operación real.','dl-evaluacion']
 ];
 return `<section class="dl-course-closure"><h2>Lo básico que debes poder explicar</h2><p>Recorre estas cinco ideas con tus palabras. Abre una explicación o vuelve al tema cuando necesites repasarlo; no es una evaluación con nota.</p>${items.map(([title,answer,id])=>`<details class="dl-understanding"><summary>${esc(title)}</summary><p>${esc(answer)} <a href="#tema/${id}">Repasar el tema →</a></p></details>`).join('')}</section>`;
}

export function renderDLContinuation({previous=null,next=null}={}){
 return `<nav class="dl-topic-continuation" aria-label="Continuar el recorrido de Deep Learning">${previous?`<a href="#tema/${esc(previous.id)}"><small>Volver al tema anterior</small><span>← ${esc(previous.title)}</span></a>`:''}${next?`<a href="#tema/${esc(next.id)}"><small>Siguiente tema</small><span>${esc(next.title)} →</span></a>`:`<a href="#curso/dl"><small>Fin de los doce temas</small><span>Volver al recorrido de Deep Learning →</span></a>`}<p>Puedes continuar por estos enlaces. Marcar como visto es un registro personal y voluntario.</p></nav>`;
}
