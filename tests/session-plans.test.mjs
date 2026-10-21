import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES} from '../docs/content.js';
import {getSessionPlan,courseHours,renderSessionPlan} from '../docs/session-plans.js';
const minute=s=>Number(s.slice(0,2))*60+Number(s.slice(3));
test('las ocho agendas caben en sus horas reales sin huecos ni solapes',()=>{
 for(const [id,c] of Object.entries(COURSES))c.classes.forEach((meeting,i)=>{
  const plan=getSessionPlan(id,i,meeting);
  assert.equal(plan.total,i%2===0?210:240);
  assert.equal(plan.breakMinutes,15);
  assert.equal(plan.start,i%2===0?'18:30':'08:00');
  assert.equal(plan.end,i%2===0?'22:00':'12:00');
  assert.equal(plan.rows[0].from,plan.start);
  plan.rows.forEach((row,j)=>{
   assert.ok(row.minutes>0);assert.equal(minute(row.to)-minute(row.from),row.minutes);
   if(j)assert.equal(plan.rows[j-1].to,row.from);
  });
  assert.equal(plan.rows.at(-1).to,plan.end);
 });
 assert.equal(courseHours(COURSES.ml),15);assert.equal(courseHours(COURSES.dl),15);
});
test('Generalidades ocupa 45 minutos el primer viernes y se repasa diez minutos al iniciar DL',()=>{
 const first=getSessionPlan('ml',0,COURSES.ml.classes[0]),dl=getSessionPlan('dl',0,COURSES.dl.classes[0]);
 assert.equal(first.rows[0].kind,'generalidades');assert.equal(first.rows[0].minutes,45);
 assert.equal(first.rows[0].from,'18:30');assert.equal(first.rows[0].to,'19:15');
 assert.equal(dl.rows[0].kind,'repaso');assert.equal(dl.rows[0].minutes,10);
 assert.equal(first.rows.filter(r=>r.kind==='practica').reduce((s,r)=>s+r.minutes,0),40);
 assert.equal(first.total-45-first.breakMinutes,150);
});
test('las fechas y los 24 temas no se redistribuyen al cambiar los tiempos internos',()=>{
 assert.deepEqual(Object.values(COURSES).flatMap(c=>c.classes.map(m=>m.iso)),['2026-10-23','2026-10-24','2026-10-30','2026-10-31','2026-11-06','2026-11-07','2026-11-13','2026-11-14']);
 const ids=Object.values(COURSES).flatMap(c=>c.classes.flatMap(m=>m.topics));
 assert.equal(ids.length,24);assert.equal(new Set(ids).size,24);
 const html=renderSessionPlan('ml',0,COURSES.ml.classes[0]);
 assert.match(html,/<caption>/);assert.match(html,/210 minutos, incluida la pausa/);
 assert.match(html,/18:30–19:15/);assert.match(html,/minutos no bloquean temas/);
});
test('un cambio de horario incompatible exige corregir la agenda antes de publicarla',()=>{
 assert.throws(()=>getSessionPlan('ml',0,{time:'Viernes · 18:00–22:00'}),RangeError);
 assert.equal(getSessionPlan('inexistente',0,COURSES.ml.classes[0]),null);
 assert.equal(renderSessionPlan('ml',0,{}),'');
});
