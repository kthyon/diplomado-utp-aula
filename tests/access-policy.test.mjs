import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES,LESSONS} from '../docs/content.js';
import {colombiaDay,scheduleReleases,validFullName,mayEnter} from '../docs/access-policy.js';
import {canAccess} from '../docs/math.js';

test('La clase abre exactamente a medianoche de Colombia, independientemente del huso del dispositivo',()=>{
 const before=colombiaDay(new Date('2026-10-23T04:59:59Z')),at=colombiaDay(new Date('2026-10-23T05:00:00Z'));
 assert.equal(before,'2026-10-22');assert.equal(at,'2026-10-23');
 assert.deepEqual(scheduleReleases(COURSES,before).released.ml,[]);
 assert.deepEqual(scheduleReleases(COURSES,at).released.ml,COURSES.ml.classes[0].topics);
});
test('Cada fecha abre todos sus temas y nunca retira encuentros ya abiertos',()=>{
 let previous=[];
 for(const cl of Object.values(COURSES).flatMap(c=>c.classes)){
  const r=scheduleReleases(COURSES,cl.iso),ids=Object.values(r.released).flat();
  for(const id of [...previous,...cl.topics])assert.ok(ids.includes(id));
  for(const future of Object.values(COURSES).flatMap(c=>c.classes).filter(c=>c.iso>cl.iso))for(const id of future.topics)assert.ok(!ids.includes(id));
  previous=ids;
 }
 assert.equal(Object.values(scheduleReleases(COURSES,'2027-01-01').released).flat().length,24);
});
test('Docente ve todo antes de las fechas y estudiante conserva la apertura prevista',()=>{
 const teacher=scheduleReleases(COURSES,'2026-10-16',true),student=scheduleReleases(COURSES,'2026-10-16');
 for(const l of LESSONS){assert.equal(canAccess(l.id,teacher,LESSONS),true);assert.equal(canAccess(l.id,student,LESSONS),false)}
 assert.equal(canAccess('ml-inventado',teacher,LESSONS),false);
});
test('Ningún tema abierto depende de completar el anterior',()=>{
 const r=scheduleReleases(COURSES,'2026-10-23');
 assert.equal(canAccess('ml-regresion',r,LESSONS,[]),true);
 assert.equal(canAccess('ml-clasificacion',r,LESSONS,['ml-problema','ml-preparacion','ml-regresion']),false);
});
test('Sin nombre completo no hay entrada; correo y alias no reemplazan el nombre',()=>{
 for(const value of ['',null,'Cris','cris@example.com','  ','123 456']){assert.equal(validFullName(value),false);assert.equal(mayEnter(value),false)}
 for(const value of ['Cristian Alvarado','María José Pérez','Ana O’Neill','Jean-Pierre Díaz'])assert.equal(mayEnter(value),true);
 assert.equal(mayEnter('',true),true);
});
