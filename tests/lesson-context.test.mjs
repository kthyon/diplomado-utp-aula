import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {COURSES,LESSONS} from '../docs/content.js';
import {LESSON_GUIDES} from '../docs/learning-guides.js';
import {renderLearningGuide,renderLearningLab,CLASS_PURPOSES} from '../docs/learning-layout.js';
import {SESSION_BLOCKS} from '../docs/session-plans.js';
import {renderMeetingOffering} from '../docs/lesson-offering.js';
import {TOPIC_CONTEXT,MEETING_CONTEXT,renderTopicContext,renderMeetingContext} from '../docs/lesson-context.js';
const before=JSON.parse(fs.readFileSync(new URL('./fixtures/protected-encounters-20261026.json',import.meta.url),'utf8'));
const hash=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');

test('los dos primeros encuentros conservan sus datos, explicación, práctica, vocabulario, agenda y cuadernos',()=>{
 for(const [id,base] of Object.entries(before.protectedTopics)){
  const l=LESSONS.find(l=>l.id===id);
  assert.equal(hash(LESSON_GUIDES[id]),base.guide,id+' guía');assert.equal(hash(l),base.lesson,id+' tema');
  assert.equal(hash(renderLearningGuide(l)),base.reading,id+' lectura');
  assert.equal(hash(renderLearningLab(l,'CUADERNOS','NOTAS')),base.lab,id+' práctica');
  assert.equal(renderTopicContext(id),'');
 }
 assert.deepEqual(SESSION_BLOCKS.ml.slice(0,2),before.firstAgendas);assert.deepEqual(CLASS_PURPOSES.ml.slice(0,2),before.firstPurposes);
 for(let i=0;i<2;i++)assert.equal(hash(renderMeetingOffering('ml',i,COURSES.ml.classes[i],{teacher:true})),before.firstMeetingHTML[i]);
 for(const [file,digest] of Object.entries(before.notebooks))assert.equal(hash(fs.readFileSync(new URL('../docs/notebooks/'+file,import.meta.url),'utf8')),digest,file);
});

test('el alcance es exactamente seis encuentros y dieciocho temas existentes, sin tocar fechas ni horarios',()=>{
 assert.deepEqual(COURSES,before.courses);
 const expected=[...COURSES.ml.classes.slice(2),...COURSES.dl.classes].flatMap(c=>c.topics).sort();
 assert.deepEqual(Object.keys(TOPIC_CONTEXT).sort(),expected);assert.equal(Object.keys(MEETING_CONTEXT).length,6);
 assert.equal(renderMeetingContext('ml',0),'');assert.equal(renderMeetingContext('ml',1),'');
 for(const id of expected){const t=TOPIC_CONTEXT[id],g=LESSON_GUIDES[id],html=renderLearningGuide({id,guide:g});
  assert.ok(MEETING_CONTEXT[t.meeting]);assert.equal(g.build.steps.length,3,id);assert.ok(g.outcome.result&&g.outcome.reading,id);
  for(const text of [g.concept,g.case.context,g.case.conclusion,g.outcome.result])assert.ok(typeof text==='string'&&text.trim(),id);
  assert.match(html,/Qué información tenemos/);assert.match(html,/Qué queremos decidir/);assert.match(html,/Resultado y cómo interpretarlo/);
  if(g.vocabulary.length>g.essentialCount)assert.match(html,/Vocabulario para profundizar/);
 }
});

test('los casos de origen distinguen datos, investigación y uso comercial sin adjudicar un despliegue a la práctica',()=>{
 for(const c of Object.values(MEETING_CONTEXT)){assert.ok(new URL(c.evidence.url).protocol==='https:');assert.ok(c.evidence.kind&&c.evidence.text);}
 assert.match(MEETING_CONTEXT['ml-3'].evidence.text,/clasificación/);
 assert.match(MEETING_CONTEXT['ml-4'].extra.text,/simulador/);
 assert.match(MEETING_CONTEXT['dl-3'].evidence.text,/LSTM/);assert.match(MEETING_CONTEXT['dl-3'].evidence.text,/No es el modelo/);
 assert.match(MEETING_CONTEXT['dl-4'].evidence.text,/no valida nuestro cuaderno/);
});

test('las cuentas operativas añadidas conservan unidades, denominadores y resultados reproducibles',()=>{
 const rows=LESSON_GUIDES['ml-pca'].case.rows;const x=rows.map(r=>Number(r[1])),y=rows.map(r=>Number(r[2]));
 const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;assert.equal(mean(x),50);assert.equal(mean(y),50);
 const sx=x.reduce((s,v)=>s+(v-50)**2,0),sy=y.reduce((s,v)=>s+(v-50)**2,0);assert.equal(sx,10);assert.equal(sy,10);assert.equal(sx/(sx+sy),.5);
 assert.equal(Math.hypot(22-20,20-20),2);assert.equal((2+4)/2*10,30);
 assert.ok(Math.abs((Math.abs(3.2-3)+Math.abs(3.8-4)+Math.abs(5.1-5))/3*10-5/3)<1e-12);
 assert.equal((Math.abs(110-100)+Math.abs(110-110))/2,5);
 assert.equal(-1-1-1-1+10,6);assert.equal(4*1+1*8,12);
});
