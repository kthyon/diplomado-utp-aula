import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {COURSES,findLesson} from '../docs/content.js';
import {scheduleReleases} from '../docs/access-policy.js';
import {getJourney,getCalendarMoment,getTopicCompletion} from '../docs/journey-models.js';
import {laboratoryDestination} from '../docs/lab-access.js';

const source=fs.readFileSync(new URL('../docs/app.js',import.meta.url),'utf8');
const functions=source.slice(source.indexOf('function nextClass(){'),source.indexOf('function registrationForm()'));
function classroom({day='2026-10-31',completed=[],pending=false}={}){
 const nodes=new Map(),messages=[],state={name:'Persona Prueba',completed:[...completed],notes:{}},location={hash:'#inicio'},saved=[];
 const query=id=>{if(!nodes.has(id))nodes.set(id,{disabled:true,textContent:'',onclick:null});return nodes.get(id)};
 const releases=scheduleReleases(COURSES,day);
 const context=vm.createContext({COURSES,state,releases,location,serverClockOffset:0,teacherView:false,isConnectedView:false,getJourney,getCalendarMoment,getTopicCompletion,findLesson,laboratoryDestination,STUDENT_RECORDS:{url:'https://records.test'},
  esc:v=>String(v),fullDate:cl=>cl.iso,studentSavePending:()=>pending,studentConnected:()=>false,
  access:id=>Object.values(releases.released).flat().includes(id),save:()=>saved.push([...state.completed]),toast:t=>messages.push(t),$ :query,modal:html=>{query('modal').innerHTML=html},openStudentRegistration:()=>{query('external').opened=true},
  document:{createElement:()=>({click(){}})},Blob,URL,setTimeout:()=>0,
 });
 vm.runInContext(functions,context);
 return {run:code=>vm.runInContext(code,context),state,location,messages,saved,query};
}
test('finishing only the last topic never announces a completed subject',()=>{
 const c=classroom();c.run("completeTopic('ml-integracion')");
 assert.equal(c.location.hash,'#progreso');assert.deepEqual(c.state.completed,['ml-integracion']);
 assert.match(c.messages[0],/1 de 12/);assert.doesNotMatch(c.messages[0],/Completaste|12 de 12/);
});
test('finishing the real twelve topics and all twenty-four produces distinct truthful closure',()=>{
 const ml=COURSES.ml.classes.flatMap(c=>c.topics),dl=COURSES.dl.classes.flatMap(c=>c.topics);
 const subject=classroom({completed:ml.slice(0,-1)});subject.run("completeTopic('ml-integracion')");assert.match(subject.messages[0],/12 de 12/);assert.doesNotMatch(subject.messages[0],/24 de 24/);
 const all=classroom({day:'2026-11-14',completed:[...ml,...dl.slice(0,-1)]});all.run("completeTopic('dl-integracion')");assert.match(all.messages[0],/24 de 24/);
});
test('marking a topic is idempotent and a future meeting remains closed',()=>{
 const c=classroom({day:'2026-10-23'});c.run("completeTopic('ml-regresion')");
 assert.equal(c.location.hash,'#curso/ml/2');assert.match(c.messages[0],/aún no abre/);
 c.run("completeTopic('ml-regresion')");assert.equal(c.saved.length,1);
});
test('a continuation describes pending synchronization instead of claiming a confirmed save',()=>{
 const c=classroom({pending:true});c.run("completeTopic('ml-problema')");assert.equal(c.location.hash,'#tema/ml-preparacion');assert.match(c.messages[0],/sincronizando/);
});
test('connecting local work requires an explicit private copy before leaving the origin',()=>{
 const c=classroom({completed:['ml-problema']});c.run('connectRegistration()');
 assert.match(c.query('modal').innerHTML,/no puede leerlos automáticamente/);
 assert.match(c.query('modal').innerHTML,/disabled/);
 assert.equal(c.location.hash,'#inicio');assert.deepEqual(c.state.completed,['ml-problema']);
});
