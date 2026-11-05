import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS} from '../docs/content.js';
import {TOPIC_CONTEXT} from '../docs/lesson-context.js';
import {LESSON_SCENES} from '../docs/lesson-scenes.js';
import {renderLearningGuide} from '../docs/learning-layout.js';

test('ML conserva la escena y DL muestra una figura principal antes de la cuenta cerrada',()=>{
 assert.deepEqual(Object.keys(LESSON_SCENES).sort(),Object.keys(TOPIC_CONTEXT).sort());
 for(const id of Object.keys(LESSON_SCENES)){
  const html=renderLearningGuide(LESSONS.find(l=>l.id===id));
  if(id.startsWith('dl-')){
   const example=html.indexOf('data-dl-primary-example='),figure=html.indexOf('data-dl-diagram='),table=html.indexOf('<table');
   assert.ok(example>=0&&figure>example,id+' figura dentro del ejemplo principal');
   assert.ok(table>figure,id+' la figura precede la tabla de cuentas');
   assert.equal((html.match(/data-dl-primary-example=/g)||[]).length,1,id+' ejemplo principal único');
   assert.ok(!html.includes('class="lesson-scene"'),id+' no vuelve a mostrar la escena anterior');
   const stack=[];let tables=0;
   for(const match of html.matchAll(/<details\b[^>]*>|<\/details>|<table\b[^>]*>/g)){
    if(match[0].startsWith('</details'))assert.ok(stack.pop(),id+' cierre de detalle válido');
    else if(match[0].startsWith('<details'))stack.push({closed:!/<details\b[^>]*\sopen(?:\s|=|>)/.test(match[0])});
    else {tables++;assert.ok(stack.some(d=>d.closed),id+' cada tabla está en una referencia cerrada');}
   }
   assert.equal(stack.length,0,id+' referencias bien cerradas');assert.ok(tables>0,id+' cuenta disponible');
   continue;
  }
  const detail=html.indexOf('<details class="scene-technical">'),table=html.indexOf('<table');
  assert.ok(html.indexOf('class="lesson-scene"')<detail,id);
  assert.ok(table>detail,id+' tabla antes del detalle');
  assert.ok(table<html.indexOf('</details>',detail),id+' tabla fuera del detalle');
  assert.doesNotMatch(html.slice(detail,table),/<details[^>]*\bopen\b/);
 }
 for(const l of LESSONS.filter(l=>!TOPIC_CONTEXT[l.id]))assert.ok(!renderLearningGuide(l).includes('lesson-scene'));
});

test('el detalle mantiene todos los datos originales y las unidades para reconstruir el ejemplo visual',()=>{
 for(const id of Object.keys(LESSON_SCENES)){
  const l=LESSONS.find(l=>l.id===id),html=renderLearningGuide(l);
  for(const row of l.guide.case.rows)for(const value of row){
   const escaped=String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
   assert.ok(html.includes(escaped),id+': '+value);
  }
 }
});
