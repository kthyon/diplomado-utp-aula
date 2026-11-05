import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {COURSES,LESSONS,NOTEBOOKS,classOf} from '../docs/content.js';
import {DL_LEARNING_PATHS} from '../docs/dl-learning-paths.js';
import {renderDLGuide,renderDLPractice,renderDLContinuation} from '../docs/dl-course-journey.js';
import {renderLearningGuide,renderLearningLab,CLASS_PURPOSES} from '../docs/learning-layout.js';
import {renderTopicCompass,renderOrganizedFinish,mountLessonSections} from '../docs/learning-organization.js';
import {renderLessonFlow} from '../docs/flow-guidance.js';
import {notebookResourceRole,NOTEBOOK_PATHS} from '../docs/notebook-paths.js';
import {encounterForTopic,colabNotebookUrl} from '../docs/encounter-notebooks.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const topics=COURSES.dl.classes.flatMap(m=>m.topics);
const lessons=topics.map(id=>LESSONS.find(l=>l.id===id));
const sections=['idea-del-tema','ejemplo-del-tema','practica-del-tema','cuaderno-del-tema'];
const count=(html,pattern)=>(html.match(pattern)||[]).length;
const source=fs.readFileSync(new URL('../docs/app.js',import.meta.url),'utf8');

// Run the actual page builders without booting identity, routing or persistence.
// This tests how app.js supplies resources and notes to the new DL renderer.
function renderPage(id,{seen=false}={}){
 const state={completed:seen?[id]:[],notes:{[id]:'OBSERVACIÓN_PERSONAL'}};
 const context=vm.createContext({
  state,COURSES,NOTEBOOKS,CLASS_PURPOSES,NOTEBOOK_PATHS,esc,
  findLesson:key=>LESSONS.find(l=>l.id===key),classOf,
  access:()=>true,home:()=>'',locked:()=>'',
  allIds:course=>COURSES[course].classes.flatMap(m=>m.topics),
  intro:(k,title,description)=>`<header><h1>${esc(title)}</h1><p>${description}</p></header>`,
  isOrganizedTopic:()=>true,studentConnected:()=>false,
  notebookResourceRole,renderTopicCompass,renderOrganizedFinish,
  renderLearningGuide,renderLearningLab,renderDLContinuation,renderLessonFlow
 });
 const lessonFunction=source.slice(source.indexOf('function lesson(id){'),source.indexOf('\nfunction renderOrganizedMeeting'));
 const organizedFunction=source.slice(source.indexOf('function organizedLesson('),source.indexOf('\nfunction explore()'));
 vm.runInContext(lessonFunction+'\n'+organizedFunction,context);
 return vm.runInContext(`lesson(${JSON.stringify(id)})`,context);
}

test('los doce temas tienen una definición inicial, tres términos y un solo ejemplo visual principal',()=>{
 assert.deepEqual(Object.keys(DL_LEARNING_PATHS),topics);
 for(const lesson of lessons){
  const p=DL_LEARNING_PATHS[lesson.id],html=renderDLGuide(lesson);
  assert.equal(p.terms.length,3,lesson.id);
  assert.ok(html.includes(esc(p.definition)),lesson.id+' definición visible');
  const terms=html.match(/<dl class="dl-essential-terms">([\s\S]*?)<\/dl>/)?.[1];
  assert.equal(count(terms,/<dt>/g),3,lesson.id+' tres ideas esenciales');
  assert.equal(count(html,/data-dl-primary-example=/g),1,lesson.id+' un ejemplo');
  assert.equal(count(html,/data-dl-diagram=/g),1,lesson.id+' una figura principal');
  assert.equal(count(html,/class="lesson-scene"/g),0,lesson.id+' escena antigua no duplicada');
  assert.equal(count(html,/class="dl-path"/g),0,lesson.id+' flujo antiguo no repetido');
  assert.equal(count(html,/class="dl-understanding"/g),1,lesson.id+' comprobación del ejemplo');
 }
});

test('cada paso conduce al apartado siguiente y al tema exacto del Colab principal',()=>{
 for(const lesson of lessons){
  const html=renderDLGuide(lesson)+renderDLPractice(lesson),meeting=encounterForTopic(lesson.id);
  const positions=sections.map(id=>html.indexOf(`id="${id}"`));
  assert.ok(positions.every(p=>p>=0),lesson.id+' todos los apartados existen');
  assert.deepEqual([...positions].sort((a,b)=>a-b),positions,lesson.id+' orden de lectura');
  for(const id of sections)assert.equal(count(html,new RegExp(`\\bid="${id}"`,'g')),1,lesson.id+' destino único '+id);
  const transitions=[...html.matchAll(/class="button dl-continue" data-lesson-section="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(transitions.slice(0,2),sections.slice(1,3),lesson.id+' idea → ejemplo → práctica');
  assert.ok(transitions.includes('cuaderno-del-tema'),lesson.id+' práctica → cuaderno');
  const primary=html.match(/class="button dl-colab-link" href="([^"]+)"/g)||[];
  assert.equal(primary.length,1,lesson.id+' una acción principal');
  const href=primary[0].match(/href="([^"]+)"/)[1];
  assert.equal(href,colabNotebookUrl(meeting.file,lesson.id),lesson.id+' archivo y ancla reales');
  const url=new URL(href);assert.equal(url.hostname,'colab.research.google.com');
  assert.equal(url.hash,'#scrollTo=tema-'+lesson.id);
  assert.match(html,/Archivo → Guardar una copia en Drive/);
  assert.match(html,/Cada tema incluye su preparación/);
 }
});

test('la página integrada mantiene notas y progreso únicos; los apoyos no duplican el principal ni el quiz',()=>{
 for(const lesson of lessons)for(const seen of [false,true]){
  const html=renderPage(lesson.id,{seen}),meeting=encounterForTopic(lesson.id);
  for(const id of [...sections,'study-note','complete-lesson'])assert.equal(count(html,new RegExp(`\\bid="${id}"`,'g')),1,lesson.id+' '+id);
  assert.equal(count(html,/class="quiz"/g),0,lesson.id+' no añade el quiz anterior a las comprobaciones nuevas');
  assert.equal(count(html,/id="quiz-feedback"/g),0,lesson.id+' no crea feedback huérfano');
  assert.equal(count(html,/id="lesson-sim"/g),lesson.sim?1:0,lesson.id+' simulador único');
  assert.ok(html.includes('OBSERVACIÓN_PERSONAL'),lesson.id+' conserva la nota');
  assert.ok(!html.includes(`data-notebook="${meeting.file}"`),lesson.id+' principal fuera de tarjetas de apoyo');
  for(const support of lesson.notebooks.slice(1))assert.equal(count(html,new RegExp(`data-notebook="${support.replaceAll('.','\\.')}"`,'g')),1,lesson.id+' apoyo una sola vez');
  const optional=html.indexOf('dl-optional-material'),primary=html.indexOf('class="button dl-colab-link"');
  assert.ok(primary>=0&&optional>primary,lesson.id+' Colab antes de apoyos opcionales');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,lesson.id+' IDs sin duplicados');
 }
});

test('los enlaces entre temas avanzan en orden sin exigir registrar el tema como visto',()=>{
 for(let i=0;i<lessons.length;i++){
  const previous=lessons[i-1],next=lessons[i+1],html=renderDLContinuation({previous,next});
  if(previous)assert.ok(html.includes('href="#tema/'+previous.id+'"'));
  if(next)assert.ok(html.includes('href="#tema/'+next.id+'"'));
  else assert.match(html,/href="#curso\/dl"/);
  assert.doesNotMatch(html,/complete-lesson|data-complete|disabled/);
  assert.match(html,/registro personal y voluntario/);
 }
});

test('continuar al cuaderno enfoca su título y conserva ruta, simulador y notas',()=>{
 let handler;
 const heading={setAttribute(name,value){this[name]=value;},focus(options){this.focusOptions=options;}};
 const section={parentElement:null,querySelector:()=>heading,scrollIntoView(options){this.scrollOptions=options;}};
 const input={value:'.73'},note={value:'Mi cuenta y conclusión'};
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'location');
 const route={get hash(){return '#tema/dl-atencion';},set hash(value){assert.fail('moverse al cuaderno no cambia la ruta');}};
 Object.defineProperty(globalThis,'location',{value:route,configurable:true});
 const root={querySelectorAll:()=>[{dataset:{lessonSection:'cuaderno-del-tema'},addEventListener(name,fn){assert.equal(name,'click');handler=fn;}}],
  querySelector(selector){const elements={'#cuaderno-del-tema':section,'#study-note':note,'#lesson-sim':input};assert.ok(selector in elements);return elements[selector];},
  set innerHTML(value){assert.fail('no reconstruir el simulador al moverse');}};
 try{mountLessonSections(root);handler();
 assert.equal(heading.tabindex,'-1');assert.deepEqual(heading.focusOptions,{preventScroll:true});
 assert.deepEqual(section.scrollOptions,{behavior:'auto',block:'start'});
 assert.equal(input.value,'.73');assert.equal(note.value,'Mi cuenta y conclusión');assert.equal(route.hash,'#tema/dl-atencion');
 }finally{if(descriptor)Object.defineProperty(globalThis,'location',descriptor);else delete globalThis.location;}
});
