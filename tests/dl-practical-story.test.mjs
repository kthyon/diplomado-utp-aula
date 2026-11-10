import test from 'node:test';
import assert from 'node:assert/strict';
import {PRACTICAL_STORY,renderStudentStory} from '../docs/dl-practical-story.js';

const e3=['dl-secuencias','dl-atencion','dl-transformers'],e4=['dl-yolo','dl-evaluacion','dl-integracion'];

test('seis temas siguen el mismo proyecto con un producto y un siguiente paso',()=>{
 assert.deepEqual(Object.keys(PRACTICAL_STORY),[...e3,...e4]);
 for(const [i,id] of [...e3,...e4].entries()){
  const s=PRACTICAL_STORY[id],html=renderStudentStory(id),text=html.replace(/<[^>]*>/g,' ');
  for(const key of ['resume','question','mission','carried','deliverable','next','reading'])assert.ok(s[key]?.length>25,id+' '+key);
  assert.match(html,/Nuestro caso: preparar la próxima recepción/);
  assert.match(html,new RegExp(`Encuentro ${i<3?3:4} · Tema ${i%3+1} de 3`));
  for(const key of ['resume','question','mission'])assert.ok(html.includes(s[key]),id+' orientación visible '+key);
  for(const key of ['carried','deliverable','next','reading'])assert.ok(!html.includes(s[key]),id+' no adelanta '+key);
  assert.match(s.deliverable,/bitácora/);assert.match(s.reading,/\.[^.!?]+\.$/,id+' lectura en dos frases');
  assert.ok(text.trim().split(/\s+/).length<=180,id+' bloque visible breve');
  assert.equal((html.match(/data-student-story=/g)||[]).length,1,id+' una historia por ruta');
  assert.doesNotMatch(html,/<table|class=".*card|#tema\//,id+' no añade otro catálogo');
 }
 assert.equal(renderStudentStory('ml-regresion'),'');
});

test('el encuentro 3 conecta historial, consulta y comprobación sin inventar un predictor único',()=>{
 const a=PRACTICAL_STORY['dl-secuencias'],b=PRACTICAL_STORY['dl-atencion'],c=PRACTICAL_STORY['dl-transformers'];
 assert.match(a.resume,/10, 20, 30 y 40/);assert.match(a.next,/consultarlos/);
 assert.match(b.resume,/historial ordenado/);assert.match(b.mission,/A=10 y B=20/);assert.match(b.next,/arquitectura/);
 assert.match(c.mission,/referencia|respuesta/);assert.match(c.reading,/ensayo distinto del pronóstico LSTM/);assert.match(c.carried,/no garantiza un acierto ni pronostica/);
 assert.match(c.next,/detector/);
});

test('el encuentro 4 distingue propuesta, referencia y puntuación de defecto',()=>{
 const a=PRACTICAL_STORY['dl-yolo'],b=PRACTICAL_STORY['dl-evaluacion'],c=PRACTICAL_STORY['dl-integracion'];
 assert.match(a.carried,/no equivale a confirmar el inventario/);assert.match(a.next,/objeto.*ubicada/);
 assert.match(b.mission,/áreas.*IoU/);assert.match(b.deliverable,/área común, unión, IoU/);assert.match(b.next,/revisar.*consecuencias/);
 assert.match(c.carried,/defecto.*distinto.*YOLO/);assert.match(c.reading,/dadas.*revisión perfecta/);assert.match(c.next,/validación.*reservados/);
});
