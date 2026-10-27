import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES,LESSONS,classOf} from '../docs/content.js';
import {TOPIC_CONTEXT} from '../docs/lesson-context.js';
import {NOTEBOOK_PATHS} from '../docs/notebook-paths.js';
import {LESSON_OFFERING} from '../docs/lesson-offering.js';
import {renderConceptConnections} from '../docs/concept-connections.js';
import {renderLessonScene} from '../docs/lesson-scenes.js';
import {CLASS_PURPOSES,renderLearningGuide,renderLearningLab} from '../docs/learning-layout.js';
import {isOrganizedTopic,renderTopicCompass,renderOrganizedFinish,mountLessonSections} from '../docs/learning-organization.js';

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const futureIds=[...COURSES.ml.classes.slice(2),...COURSES.dl.classes].flatMap(c=>c.topics);
const futureLessons=LESSONS.filter(l=>futureIds.includes(l.id));
const targets=['idea-del-tema','ejemplo-del-tema','practica-del-tema'];
const includesAll=(html,texts,label)=>{
 for(const text of texts)assert.ok(html.includes(esc(text)),label+': '+text);
};
// Track only native disclosure boundaries; this also handles nested details.
function detailsIn(html){
 const stack=[],details=[];
 for(const match of html.matchAll(/<details\b[^>]*>|<\/details>/g)){
  if(match[0].startsWith('</')){
   const detail=stack.pop();assert.ok(detail,'cierre details sin apertura');
   detail.end=match.index;details.push(detail);
  }else stack.push({start:match.index,end:html.length,tag:match[0],closed:!/^<details\b[^>]*\sopen(?:\s|=|>)/.test(match[0])});
 }
 assert.equal(stack.length,0,'details sin cerrar');return details;
}
const insideClosedDetail=(html,text)=>{
 const position=html.indexOf(text);assert.notEqual(position,-1,'contenido ausente: '+text);
 return detailsIn(html).some(d=>d.closed&&d.start<position&&position<d.end);
};

test('la nueva guía se limita a los dieciocho temas futuros y sus botones mantienen la ruta del tema',()=>{
 assert.equal(futureLessons.length,18);
 assert.deepEqual(Object.keys(TOPIC_CONTEXT).sort(),[...futureIds].sort());
 for(const l of LESSONS){
  const course=COURSES[l.id.split('-')[0]],meeting=classOf(l.id),classIndex=course.classes.indexOf(meeting);
  const purpose=CLASS_PURPOSES[course.id][classIndex];
  const flowHtml='<section data-original-flow>ORIENTACIÓN_ORIGINAL</section>';
  const html=renderTopicCompass(l,{courseTitle:course.title,classIndex,topicIndex:meeting.topics.indexOf(l.id),purpose,flowHtml});
  assert.equal(isOrganizedTopic(l.id),futureIds.includes(l.id),l.id);
  if(!futureIds.includes(l.id)){assert.equal(html,'',l.id+' conserva la rama original');continue;}
  includesAll(html,[l.guide.objective,purpose],l.id+' orientación completa');
  assert.ok(html.includes(flowHtml),l.id+' instrucciones de continuidad completas');
  const buttons=[...html.matchAll(/<button\b[^>]*data-lesson-section="([^"]+)"[^>]*>/g)];
  assert.deepEqual(buttons.map(m=>m[1]),targets,l.id+' tres destinos');
  for(const target of targets)assert.ok(!html.includes('href="#'+target+'"'),l.id+' no usa el router para desplazarse');
 }
 assert.equal(isOrganizedTopic('tema-inexistente'),false);
});

test('cada lectura conserva definiciones, contexto, caso, cuentas, interpretación y conexiones completas',()=>{
 for(const l of futureLessons){
  const g=l.guide,c=g.case,t=TOPIC_CONTEXT[l.id],html=renderLearningGuide(l);
  includesAll(html,[g.objective,g.concept,t.question,t.situation,t.known,t.decision,
   c.title,c.context,c.question,c.conclusion,g.takeaway,...c.reasoning,
   ...g.vocabulary.flatMap(v=>[v.term,v.meaning]),...(c.columns||[]),...(c.rows||[]).flat(),
   ...(c.stages||[]).flatMap(stage=>[stage.title,stage.detail]),
   ...(g.understanding?[g.understanding.question,g.understanding.answer]:[]),
   ...(g.outcome?[g.outcome.title,g.outcome.result,g.outcome.reading]:[]),
   LESSON_OFFERING[l.id].focus],l.id+' lectura');
  assert.ok(html.includes(renderConceptConnections(l.id)),l.id+' conexiones intactas');
  assert.ok(!insideClosedDetail(html,esc(g.concept)),l.id+' concepto visible inicialmente');
  const scene=renderLessonScene(l.id);
  assert.ok(scene&&html.includes(scene),l.id+' escena completa');
  assert.ok(!insideClosedDetail(html,scene),l.id+' escena visible inicialmente');
  for(const vocabulary of g.vocabulary){
   const definition='<summary>'+esc(vocabulary.term)+'</summary><p>'+esc(vocabulary.meaning)+'</p>';
   assert.ok(insideClosedDetail(html,definition),l.id+' término y definición consultables: '+vocabulary.term);
  }
  // Check the complete blocks, because the same answer may also occur in a scene.
  assert.ok(insideClosedDetail(html,'<div class="learning-result"><b>Qué podemos concluir</b><p>'+esc(c.conclusion)),l.id+' conclusión desplegable');
  assert.ok(insideClosedDetail(html,'<p class="learning-takeaway"><b>Para recordar:</b> '+esc(g.takeaway)),l.id+' recordatorio desplegable');
  if(g.understanding)assert.ok(insideClosedDetail(html,'<summary>Comprueba si lo entendiste: '+esc(g.understanding.question)),l.id+' comprobación desplegable');
 }
});

test('la práctica conserva los pasos y la ruta real de Colab sin duplicar simulador, notas, quiz ni progreso',()=>{
 for(const l of futureLessons){
  const g=l.guide,path=NOTEBOOK_PATHS[l.id];
  const notes='<textarea id="study-note">NOTA_ORIGINAL</textarea>';
  const lab=renderLearningLab(l,'<div>CUADERNO_ORIGINAL</div>',notes);
  includesAll(lab,[g.build.title,g.lab.objective,g.lab.instruction,g.lab.watch,g.lab.expected,g.lab.notebookGuide,
   ...g.build.steps,g.build.check,g.build.transfer,g.build.stretch,g.next,
   path.section,path.prepare,path.observe,path.tip,LESSON_OFFERING[l.id].bridge],l.id+' práctica');
  assert.ok(lab.includes('CUADERNO_ORIGINAL')&&lab.includes(notes),l.id+' recursos y bitácora originales');
  const finish='<button id="complete-lesson">AVANCE_ORIGINAL</button>';
  const html=renderLearningGuide(l)+'<div class="quiz"><div id="quiz-feedback"></div></div>'+lab+renderOrganizedFinish(finish);
  for(const id of [...targets,'study-note','quiz-feedback','complete-lesson']){
   assert.equal((html.match(new RegExp('\\bid="'+id+'"','g'))||[]).length,1,l.id+' destino único: '+id);
  }
  assert.equal((html.match(/\bid="lesson-sim"/g)||[]).length,l.sim?1:0,l.id+' montaje único del laboratorio');
  assert.equal((html.match(/class="quiz"/g)||[]).length,1,l.id+' quiz único');
  assert.ok(html.includes(finish),l.id+' botón de avance conservado');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,l.id+' IDs sin duplicados');
  detailsIn(html);
 }
});

function fakeButton(target){
 const listeners=[];
 return {dataset:{lessonSection:target},listeners,
  addEventListener(type,listener){assert.equal(type,'click');listeners.push(listener);},
  click(){for(const listener of listeners)listener({preventDefault(){}});}};
}
function focusTarget(){
 return {attributes:{},focusCalls:[],setAttribute(name,value){this.attributes[name]=value;},focus(options){this.focusCalls.push(options);}};
}
test('moverse entre apartados abre detalles y enfoca el título sin reconstruir ni cambiar la ruta',()=>{
 const outer={tagName:'DETAILS',open:false,parentElement:null};
 const inner={tagName:'DETAILS',open:false,parentElement:{tagName:'DIV',parentElement:outer}};
 const heading=focusTarget(),section={parentElement:inner,scrollCalls:[],
  querySelector(selector){assert.equal(selector,'h2,h3');return heading;},
  scrollIntoView(options){this.scrollCalls.push(options);}};
 const fallback=Object.assign(focusTarget(),{parentElement:null,scrollCalls:[],querySelector(){return null;},scrollIntoView(options){this.scrollCalls.push(options);}});
 const buttons=[fakeButton(targets[0]),fakeButton(targets[1]),fakeButton(targets[2]),fakeButton('destino-no-autorizado')];
 const note={value:'Mi resultado personal'},simulator={value:0.73},quiz={answer:2};
 const elements={'#idea-del-tema':section,'#ejemplo-del-tema':fallback,'#study-note':note,'#lesson-sim':simulator,'.quiz':quiz};
 const queries=[];
 const root={querySelectorAll(selector){assert.equal(selector,'[data-lesson-section]');return buttons;},
  querySelector(selector){queries.push(selector);return elements[selector]||null;},
  set innerHTML(value){assert.fail('desplazarse no debe reconstruir la lectura');}};
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'location');
 const location={get hash(){return '#tema/dl-atencion';},set hash(value){assert.fail('desplazarse no debe cambiar el hash');}};
 Object.defineProperty(globalThis,'location',{value:location,configurable:true});
 try{
  mountLessonSections(root);
  assert.ok(buttons.every(button=>button.listeners.length===1),'un enlace de comportamiento por botón');
  buttons[0].click();
  assert.equal(inner.open,true);assert.equal(outer.open,true);
  assert.equal(heading.attributes.tabindex,'-1');
  assert.deepEqual(heading.focusCalls,[{preventScroll:true}]);
  assert.deepEqual(section.scrollCalls,[{behavior:'auto',block:'start'}]);
  buttons[1].click();
  assert.equal(fallback.attributes.tabindex,'-1','un apartado sin título puede recibir foco');
  assert.equal(fallback.focusCalls.length,1);assert.equal(fallback.scrollCalls.length,1);
  buttons[2].click();buttons[3].click();
  assert.deepEqual(queries,['#idea-del-tema','#ejemplo-del-tema','#practica-del-tema'],'destinos inexistentes se ignoran sin consultar selectores arbitrarios');
  assert.equal(elements['#study-note'],note);assert.equal(note.value,'Mi resultado personal');
  assert.equal(elements['#lesson-sim'],simulator);assert.equal(simulator.value,0.73);
  assert.equal(elements['.quiz'],quiz);assert.equal(quiz.answer,2);
  assert.equal(location.hash,'#tema/dl-atencion');
 }finally{
  if(descriptor)Object.defineProperty(globalThis,'location',descriptor);else delete globalThis.location;
 }
});
