import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS} from '../docs/content.js';
import {TOPIC_CONTEXT} from '../docs/lesson-context.js';
import {LESSON_SCENES} from '../docs/lesson-scenes.js';
import {renderLearningGuide} from '../docs/learning-layout.js';

test('los dieciocho ejemplos empiezan por una escena y sus tablas quedan dentro del detalle cerrado',()=>{
 assert.deepEqual(Object.keys(LESSON_SCENES).sort(),Object.keys(TOPIC_CONTEXT).sort());
 for(const id of Object.keys(LESSON_SCENES)){
  const html=renderLearningGuide(LESSONS.find(l=>l.id===id));
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
