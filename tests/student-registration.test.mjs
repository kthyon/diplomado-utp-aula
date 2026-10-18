import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=(await readFile(new URL('../docs/student-registration.js',import.meta.url),'utf8')).replace("import {validFullName} from './access-policy.js';","const validFullName=v=>typeof v==='string'&&v.includes(' ');").replace("import {STUDENT_RECORDS} from './database-config.js';","const STUDENT_RECORDS={enabled:true,url:'https://records.test'};");
async function setup({pending=false,putFails=false,sessionFails=false}={}){
 const elements=new Map(['#profile-status','[data-save-status]','[data-retry-save]'].map(k=>[k,{textContent:'',hidden:true}])),stored=new Map(pending?[['utp-cloud-pending','student-1']]:[]),timers=[],calls=[],notifications=[];
 globalThis.location={origin:'https://records.test',search:'',pathname:'/aula/'};globalThis.history={replaceState(){}};globalThis.window={addEventListener(){}};globalThis.document={querySelector:k=>elements.get(k)};
 globalThis.localStorage={getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v),removeItem:k=>stored.delete(k)};
 globalThis.setTimeout=fn=>{timers.push(fn);return timers.length};globalThis.clearTimeout=id=>{if(id)timers[id-1]=null};
 let failPut=putFails;
 globalThis.fetch=async(url,options={})=>{calls.push({url,...options});assert.ok(options.signal instanceof AbortSignal);if(sessionFails)throw new DOMException('timeout','TimeoutError');if(options.method==='PUT'&&failPut)throw Error('offline');const identity=options.method==='POST'?JSON.parse(options.body):{full_name:'Persona Prueba'};return Response.json(url==='/api/session'?{role:'student'}:options.method==='PUT'?{ok:true}:{student:{id:'student-1',full_name:identity.full_name,email:identity.email||''},name:identity.full_name,completed:[],notes:{}})};
 const mod=await import('data:text/javascript;base64,'+Buffer.from(source+'\n// '+Math.random()).toString('base64'));
 let state={name:'Persona Prueba',studentId:'student-1',completed:['ml-problema'],notes:{'ml-problema':'Nota pendiente'}};
 await mod.initStudentRegistration({read:()=>state,notify:t=>notifications.push(t),apply:r=>{state={...state,...r}},chooseImport:async()=>false});
 const flush=async()=>{for(const fn of timers.splice(0))fn?.();for(let i=0;i<4;i++)await new Promise(setImmediate)};
 return {mod,elements,stored,calls,notifications,flush,online:()=>{failPut=false},state:()=>state};
}
const nativeTimeout=globalThis.setTimeout,nativeClear=globalThis.clearTimeout;
test('El guardado fallido conserva pendientes y el botón reintenta el mismo avance',async()=>{
 try{const h=await setup({pending:true,putFails:true});await h.flush();assert.equal(h.mod.studentConnected(),true);assert.equal(h.stored.get('utp-cloud-pending'),'student-1');assert.equal(h.elements.get('[data-retry-save]').hidden,false);assert.equal(h.state().notes['ml-problema'],'Nota pendiente');h.online();h.mod.retryStudentProgress();await h.flush();assert.equal(h.stored.has('utp-cloud-pending'),false);assert.equal(h.elements.get('[data-retry-save]').hidden,true);assert.equal(h.elements.get('[data-save-status]').textContent,'Avance sincronizado');assert.equal(h.calls.filter(c=>c.method==='PUT').length,2);assert.equal(JSON.parse(h.calls.find(c=>c.method==='PUT').body).notes['ml-problema'],'Nota pendiente');}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
test('Un fallo al verificar la sesión no concede rol ni conexión y explica cómo recuperarse',async()=>{
 try{const h=await setup({sessionFails:true});assert.equal(h.mod.studentConnected(),false);assert.match(h.notifications[0],/tardando demasiado/);assert.equal(h.calls.length,1);}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
test('Editar el nombre con cambios pendientes conserva las notas y actualiza la identidad visible',async()=>{
 try{const h=await setup({pending:true,putFails:true});await h.mod.registerStudent({full_name:'Nombre Nuevo',email:'nuevo@gmail.com'});assert.equal(h.state().name,'Nombre Nuevo');assert.equal(h.state().notes['ml-problema'],'Nota pendiente');assert.deepEqual(h.state().completed,['ml-problema']);await h.flush();assert.equal(h.stored.get('utp-cloud-pending'),'student-1');}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
