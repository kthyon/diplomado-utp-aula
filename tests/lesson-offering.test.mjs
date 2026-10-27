import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSON_GUIDES} from '../docs/learning-guides.js';
import {COURSES} from '../docs/content.js';
import {TOPICS} from '../docs/idea-models.js';
import {LESSON_OFFERING,MEETING_OFFERING,renderMeetingOffering,renderExplorerLink,renderNotebookBridge} from '../docs/lesson-offering.js';
import {renderLearningGuide,renderLearningLab} from '../docs/learning-layout.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
test('la distribución orientativa de los ocho encuentros solo se incluye para docentes',()=>{
 for(const [id,c] of Object.entries(COURSES))c.classes.forEach((cl,i)=>{
  for(const options of [undefined,{teacher:false}]){
   const student=renderMeetingOffering(id,i,cl,options);
   assert.doesNotMatch(student,/Distribución orientativa|<caption>|Los bloques orientan/);
   assert.match(student,/Durante la clase:/);
  }
  assert.match(renderMeetingOffering(id,i,cl,{teacher:true}),/Distribución orientativa/);
 });
});
test('los 24 recorridos conservan conceptos, vocabulario, casos, pasos y ampliaciones al añadir orientación',()=>{
 assert.deepEqual(Object.keys(LESSON_OFFERING).sort(),Object.keys(LESSON_GUIDES).sort());
 for(const [id,guide] of Object.entries(LESSON_GUIDES)){
  const lesson={id,guide,sim:true},reading=renderLearningGuide(lesson),lab=renderLearningLab(lesson,'<div>RECURSO_ORIGINAL</div>','<div>BITACORA_ORIGINAL</div>');
  for(const text of [guide.objective,guide.concept,guide.case.context,guide.case.conclusion,...guide.case.reasoning,...guide.vocabulary.flatMap(v=>[v.term,v.meaning])])assert.ok(reading.includes(esc(text)),id+': '+text);
  for(const text of [guide.lab.instruction,guide.lab.watch,guide.lab.expected,guide.lab.notebookGuide,...guide.build.steps,guide.build.check,guide.build.transfer,guide.build.stretch])assert.ok(lab.includes(esc(text)),id+': '+text);
  assert.ok(lab.includes('RECURSO_ORIGINAL')&&lab.includes('BITACORA_ORIGINAL'));
  assert.ok(reading.includes(esc(LESSON_OFFERING[id].focus)));
  assert.equal((lab.match(/Dónde continuar en tu copia/g)||[]).length,1);
 }
});
test('los ocho encuentros conservan los tres temas y distinguen foco de ampliación sin añadir barreras',()=>{
 for(const [id,c] of Object.entries(COURSES)){
  assert.equal(MEETING_OFFERING[id].length,c.classes.length);
  c.classes.forEach((cl,i)=>{
   assert.equal(cl.topics.length,3);
   const html=renderMeetingOffering(id,i);
   assert.match(html,/Durante la clase:/);assert.match(html,/Para profundizar:/);
   assert.match(html,/comprobaciones son opcionales y sin nota/);
   assert.ok(!html.includes('disabled'));
  });
 }
 assert.equal(renderMeetingOffering('inexistente',0),'');
});
test('los enlaces complementarios se limitan a exploradores que realmente existen',()=>{
 for(const id of Object.keys(LESSON_OFFERING)){
  const o=LESSON_OFFERING[id],html=renderExplorerLink(id);
  if(o.explorer){assert.ok(TOPICS.some(t=>t.id===o.explorer),id);assert.ok(html.includes('#explorar/'+o.explorer));}
  else assert.equal(html,'');
 }
 assert.equal(renderExplorerLink('<script>'),'');
});
test('los puentes distinguen práctica ilustrativa de ejecución real en cuaderno',()=>{
 assert.match(LESSON_OFFERING['ml-clasificacion'].bridge,/alto rendimiento/);
 assert.match(LESSON_OFFERING['ml-umbral'].bridge,/no tiene ese selector/);
 assert.match(LESSON_OFFERING['dl-entrenamiento'].bridge,/bloque 01/);
 assert.match(LESSON_OFFERING['dl-entrenamiento'].bridge,/bloque 09/);
 assert.match(LESSON_OFFERING['dl-evaluacion'].bridge,/no incluye anotaciones ni calcula mAP/);
 const rendered=renderNotebookBridge({id:'desconocido',guide:{lab:{notebookGuide:'<img onerror=x>'}}});
 assert.ok(!rendered.includes('<img'));assert.match(rendered,/&lt;img/);
});

