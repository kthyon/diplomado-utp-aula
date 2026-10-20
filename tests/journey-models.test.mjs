import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES} from '../docs/content.js';
import {colombiaDay,scheduleReleases} from '../docs/access-policy.js';
import {getJourney,hasNewTopics,getTopicCompletion,getCalendarMoment} from '../docs/journey-models.js';
const all=Object.values(COURSES).flatMap(course=>course.classes.flatMap(cl=>cl.topics));

test('calendario conserva las ocho fechas, horarios y el orden de las asignaturas',()=>{
 const journey=getJourney(COURSES,[],'2026-10-20');
 assert.deepEqual(journey.calendar.map(cl=>[cl.iso,cl.time]),[
 ['2026-10-23','Viernes · 18:00–22:00'],['2026-10-24','Sábado · 08:00–12:00'],
 ['2026-10-30','Viernes · 18:00–22:00'],['2026-10-31','Sábado · 08:00–12:00'],
 ['2026-11-06','Viernes · 18:00–22:00'],['2026-11-07','Sábado · 08:00–12:00'],
 ['2026-11-13','Viernes · 18:00–22:00'],['2026-11-14','Sábado · 08:00–12:00']]);
 assert.deepEqual(journey.calendar.map(cl=>cl.classId),['ml-1','ml-2','ml-3','ml-4','dl-1','dl-2','dl-3','dl-4']);
 assert.equal(journey.total,24);assert.equal(journey.seen,0);
 assert.equal(journey.resume,null);assert.equal(journey.hasAvailable,false);assert.equal(journey.href,'#curso/ml');
 assert.equal(journey.upcoming.classId,'ml-1');
});

test('las ocho medianoches Bogotá abren encuentros sin depender del progreso',()=>{
 for(const cl of getJourney(COURSES).calendar){
  const at=new Date(cl.iso+'T05:00:00Z'),before=new Date(at.getTime()-1);
  const previous=getJourney(COURSES,[],colombiaDay(before)),current=getJourney(COURSES,[],colombiaDay(at));
  assert.equal(current.available.length,previous.available.length+1);
  assert.ok(current.available.find(meeting=>meeting.classId===cl.classId));
  assert.deepEqual(current.available.map(meeting=>meeting.classId),getJourney(COURSES,all,colombiaDay(at)).available.map(meeting=>meeting.classId));
 }
 assert.equal(getJourney(COURSES,[],'2027-01-01').available.length,8);
});

test('retoma el primer pendiente abierto, sin convertirlo en requisito para otros encuentros',()=>{
 const a=getJourney(COURSES,['ml-problema'],'2026-10-25');
 assert.equal(a.resume.classId,'ml-1');assert.equal(a.resume.topicId,'ml-preparacion');assert.equal(a.href,'#tema/ml-preparacion');
 assert.equal(a.upcoming.classId,'ml-3');assert.equal(a.available.length,2);
 const b=getJourney(COURSES,all.slice(0,3),'2026-10-25');
 assert.equal(b.resume.classId,'ml-2');
 const c=getJourney(COURSES,all.slice(0,6),'2026-10-25');
 assert.equal(c.resume,null);assert.equal(c.allAvailableSeen,true);assert.equal(c.complete,false);
 assert.equal(c.href,'#curso/ml');assert.equal(c.upcoming.classId,'ml-3');
});

test('docente ve todo; el progreso cuenta solo IDs conocidos una vez y no muta datos',()=>{
 const courses=structuredClone(COURSES),completed=[...all,...all,'inventado'];
 const snapshot=structuredClone(completed),j=getJourney(courses,completed,'2026-10-20',true);
 assert.equal(j.available.length,8);assert.equal(j.upcoming.classId,'ml-1');
 assert.equal(j.seen,24);assert.equal(j.complete,true);assert.equal(j.resume,null);
 assert.deepEqual(courses,COURSES);assert.deepEqual(completed,snapshot);
 assert.equal(getJourney({},[]).complete,false);assert.equal(getJourney({},[]).href,'#inicio');
});

test('anuncia únicamente temas nuevos, nunca el cambio de día ni la eliminación de IDs',()=>{
 const before=scheduleReleases(COURSES,'2026-10-24');
 assert.equal(hasNewTopics(before,scheduleReleases(COURSES,'2026-10-25')),false);
 assert.equal(hasNewTopics(before,scheduleReleases(COURSES,'2026-10-30')),true);
 assert.equal(hasNewTopics(before,scheduleReleases(COURSES,'2026-10-23')),false);
 assert.equal(hasNewTopics(undefined,before),true);
 assert.equal(hasNewTopics(undefined,undefined),false);
});

test('la salida del tema distingue continuidad, cambio de encuentro y cierre real',()=>{
 const first=getTopicCompletion(COURSES,['ml-problema'],'ml-problema');
 assert.equal(first.next.id,'ml-preparacion');assert.equal(first.next.sameClass,true);assert.equal(first.classComplete,false);
 const boundary=getTopicCompletion(COURSES,all.slice(0,3),'ml-regresion');
 assert.equal(boundary.next.id,'ml-clasificacion');assert.equal(boundary.next.sameClass,false);
 assert.equal(boundary.next.meeting.iso,'2026-10-24');assert.equal(boundary.classComplete,true);assert.equal(boundary.courseComplete,false);
 const lastOnly=getTopicCompletion(COURSES,['ml-integracion'],'ml-integracion');
 assert.equal(lastOnly.isLastTopic,true);assert.equal(lastOnly.courseComplete,false);assert.equal(lastOnly.pendingId,'ml-problema');
 const ml=getTopicCompletion(COURSES,all.slice(0,12),'ml-integracion');
 assert.equal(ml.courseComplete,true);assert.equal(ml.complete,false);assert.equal(ml.pendingId,null);
 assert.equal(getTopicCompletion(COURSES,all,'dl-integracion').complete,true);
 assert.equal(getTopicCompletion(COURSES,all,'desconocido'),null);
});

test('el viernes la clase de hoy sigue próxima antes de las 18, está en curso a las 18 y termina a las 22',()=>{
 const before=getCalendarMoment(COURSES,new Date('2026-10-23T17:59:59.999-05:00'));
 assert.equal(before.current,null);assert.equal(before.upcoming.classId,'ml-1');
 const start=getCalendarMoment(COURSES,new Date('2026-10-23T18:00:00-05:00'));
 assert.equal(start.current.classId,'ml-1');assert.equal(start.upcoming.classId,'ml-2');
 assert.equal(start.current.start,'2026-10-23T23:00:00.000Z');
 assert.equal(start.current.end,'2026-10-24T03:00:00.000Z');
 assert.equal(getCalendarMoment(COURSES,new Date('2026-10-23T21:59:59.999-05:00')).current.classId,'ml-1');
 const end=getCalendarMoment(COURSES,new Date('2026-10-23T22:00:00-05:00'));
 assert.equal(end.current,null);assert.equal(end.upcoming.classId,'ml-2');
});

test('el sábado respeta el intervalo 08:00 incluido a 12:00 excluido',()=>{
 assert.equal(getCalendarMoment(COURSES,new Date('2026-10-24T07:59:59.999-05:00')).upcoming.classId,'ml-2');
 assert.equal(getCalendarMoment(COURSES,new Date('2026-10-24T08:00:00-05:00')).current.classId,'ml-2');
 assert.equal(getCalendarMoment(COURSES,new Date('2026-10-24T11:59:59.999-05:00')).current.classId,'ml-2');
 const end=getCalendarMoment(COURSES,new Date('2026-10-24T12:00:00-05:00'));
 assert.equal(end.current,null);assert.equal(end.upcoming.classId,'ml-3');
});

test('abrir materiales a medianoche no significa sesión en curso ni desplaza la próxima a mañana',()=>{
 for(const cl of getJourney(COURSES).calendar){
  for(const iso of [cl.iso+'T00:00:00-05:00',new Date(new Date(cl.iso+'T00:00:00-05:00').getTime()-1).toISOString()]){
   const moment=getCalendarMoment(COURSES,new Date(iso));
   assert.equal(moment.current,null);assert.equal(moment.upcoming.classId,cl.classId);
  }
 }
 assert.equal(getCalendarMoment(COURSES,new Date('2026-11-14T12:00:00-05:00')).upcoming,null);
});

test('horarios ausentes o mal formados no producen una sesión inventada ni alteran los strings',()=>{
 const original=structuredClone(COURSES),courses=structuredClone(COURSES);
 for(const course of Object.values(courses))for(const cl of course.classes)cl.time='Por confirmar';
 const missing=getCalendarMoment(courses,new Date('2026-10-23T18:00:00-05:00'));
 assert.equal(missing.current,null);assert.equal(missing.upcoming,null);
 assert.ok(missing.calendar.every(cl=>cl.start===null&&cl.end===null));
 assert.equal(getCalendarMoment(COURSES,new Date('inválida')).current,null);
 assert.equal(getCalendarMoment(COURSES,new Date('inválida')).upcoming,null);
 assert.deepEqual(COURSES,original);
});
