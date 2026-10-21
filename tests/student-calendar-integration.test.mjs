import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {COURSES,LESSONS,findLesson} from '../docs/content.js';
import {colombiaDay,scheduleReleases} from '../docs/access-policy.js';
import {canAccess} from '../docs/math.js';
import {getJourney,getCalendarMoment,getTopicCompletion} from '../docs/journey-models.js';
import {nextScheduleDelay,readReferenceOffset} from '../docs/schedule-clock.js';

const calendar=getJourney(COURSES).calendar;
const source=fs.readFileSync(new URL('../docs/app.js',import.meta.url),'utf8');
const completion=source.slice(source.indexOf('function completeTopic(id){'),source.indexOf('function focusCurrentRoute()'));
function classroom(day,completed=[]){
 const state={completed:[...completed]},location={hash:'#inicio'},messages=[];
 let writes=0;
 const context=vm.createContext({state,location,COURSES,getTopicCompletion,
  access:id=>canAccess(id,scheduleReleases(COURSES,day),LESSONS),
  save:()=>writes++,toast:t=>messages.push(t),studentSavePending:()=>false});
 vm.runInContext(completion,context);
 return {state,location,messages,mark:id=>vm.runInContext('completeTopic('+JSON.stringify(id)+')',context),writes:()=>writes};
}

test('recorrido integrado de ocho fechas: abrir, estudiar tres temas, guardar, retomar y cerrar 24/24',()=>{
 const completed=[];
 for(const [meetingIndex,meeting] of calendar.entries()){
  const day=colombiaDay(new Date(meeting.iso+'T00:00:00-05:00'));
  const c=classroom(day,completed);
  const initial=getJourney(COURSES,c.state.completed,day);
  assert.equal(initial.resume.topicId,meeting.topics[0]);
  assert.equal(initial.available.length,meetingIndex+1);
  for(const [topicIndex,id] of meeting.topics.entries()){
   assert.ok(findLesson(id));assert.equal(canAccess(id,scheduleReleases(COURSES,day),LESSONS),true);
   c.mark(id);
   assert.equal(c.state.completed.length,meetingIndex*3+topicIndex+1);
   const after=getTopicCompletion(COURSES,c.state.completed,id);
   assert.equal(after.classComplete,topicIndex===2);
   if(topicIndex<2)assert.equal(c.location.hash,'#tema/'+meeting.topics[topicIndex+1]);
   else if(after.next){
    assert.equal(c.location.hash,'#curso/'+meeting.course.id+'/'+(meeting.index+2));
    assert.match(c.messages.at(-1),/aún no abre/);
   }else assert.equal(c.location.hash,'#progreso');
   const count=c.state.completed.length;c.mark(id);
   assert.equal(c.state.completed.length,count,'repetir no duplica el avance');
  }
  assert.equal(c.writes(),3);
  completed.splice(0,completed.length,...c.state.completed);
  const reloaded=getJourney(COURSES,JSON.parse(JSON.stringify(completed)),day);
  assert.equal(reloaded.resume,null);assert.equal(reloaded.allAvailableSeen,true);
  assert.equal(reloaded.complete,meetingIndex===7);
 }
 assert.equal(completed.length,24);
 assert.equal(new Set(completed).size,24);
});

test('saltar directamente al último tema no borra los pendientes ni exige orden para entrar',()=>{
 const c=classroom('2026-11-14');
 c.mark('dl-integracion');
 assert.equal(c.location.hash,'#progreso');assert.match(c.messages.at(-1),/1 de 12/);
 const resumed=getJourney(COURSES,c.state.completed,'2026-11-14');
 assert.equal(resumed.resume.topicId,'ml-problema');assert.equal(resumed.seen,1);assert.equal(resumed.total,24);
 for(const meeting of calendar)for(const id of meeting.topics)assert.equal(canAccess(id,scheduleReleases(COURSES,'2026-11-14'),LESSONS),true);
});

test('cada encuentro respeta medianoche de apertura y extremos exactos de 3,5 horas el viernes y 4 el sábado',()=>{
 let hours=0;
 for(const meeting of calendar){
  const opening=Date.parse(meeting.iso+'T00:00:00-05:00');
  const before=scheduleReleases(COURSES,colombiaDay(new Date(opening-1)));
  const at=scheduleReleases(COURSES,colombiaDay(new Date(opening)));
  for(const id of meeting.topics){assert.equal(canAccess(id,before,LESSONS),false);assert.equal(canAccess(id,at,LESSONS),true);}
  const timing=getCalendarMoment(COURSES,new Date(opening)).calendar.find(x=>x.classId===meeting.classId);
  const start=Date.parse(timing.start),end=Date.parse(timing.end);hours+=(end-start)/3600000;
  assert.equal(getCalendarMoment(COURSES,new Date(start-1)).upcoming.classId,meeting.classId);
  assert.equal(getCalendarMoment(COURSES,new Date(start)).current.classId,meeting.classId);
  assert.equal(getCalendarMoment(COURSES,new Date(end-1)).current.classId,meeting.classId);
  assert.equal(getCalendarMoment(COURSES,new Date(end)).current,null);
  for(const boundary of [opening,start,end])assert.equal(nextScheduleDelay(COURSES,new Date(boundary-1)),51);
 }
 assert.equal(hours,30);
});

test('el reloj de referencia corrige un dispositivo adelantado antes de decidir la apertura',async()=>{
 const real=Date.parse('2026-10-23T04:59:59Z'),device=real+86400000;
 const offset=await readReferenceOffset(async()=>new Response(null,{headers:{date:new Date(real).toUTCString()}}),()=>device);
 assert.equal(offset,-86400000);
 const correctedDay=colombiaDay(new Date(device+offset));
 assert.equal(correctedDay,'2026-10-22');assert.equal(getJourney(COURSES,[],correctedDay).hasAvailable,false);
 assert.equal(getJourney(COURSES,[],colombiaDay(new Date(device+offset+1000))).available.length,1);
});

test('las ocho rutas directas de encuentro enfocan su sección y una ruta inválida vuelve al inicio de la vista',()=>{
 const focus=source.slice(source.indexOf('function focusCurrentRoute()'),source.indexOf('function registrationForm()'));
 for(const meeting of calendar){
  const events=[];
  const context=vm.createContext({location:{hash:'#curso/'+meeting.course.id+'/'+(meeting.index+1)},
   document:{getElementById:id=>id==='encuentro-'+meeting.classId?{scrollIntoView:()=>events.push('scroll'),focus:()=>events.push('focus')}:null},
   window:{scrollTo:()=>events.push('top')},$:()=>({open:false,focus:()=>events.push('main')})});
  vm.runInContext(focus+';focusCurrentRoute()',context);
  assert.deepEqual(events,['scroll','focus']);
 }
 const events=[];
 const context=vm.createContext({location:{hash:'#curso/ml/99'},document:{getElementById:()=>{throw Error('No debe buscar un encuentro inválido')}},window:{scrollTo:()=>events.push('top')},$:()=>({open:false,focus:()=>events.push('main')})});
 vm.runInContext(focus+';focusCurrentRoute()',context);assert.deepEqual(events,['top','main']);
});
