import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=(await readFile(new URL('../docs/student-registration.js',import.meta.url),'utf8')).replace("import {validFullName} from './access-policy.js';","const validFullName=v=>typeof v==='string'&&v.includes(' ');").replace("import {STUDENT_RECORDS} from './database-config.js';","const STUDENT_RECORDS={enabled:true,url:'https://records.test'};");
async function setup({pending=false,putFails=false,sessionFails=false,search='',hash='',postConflict=false,bringLocal=false}={}){
 const elements=new Map(['#profile-status','[data-save-status]','[data-retry-save]'].map(k=>[k,{textContent:'',hidden:true}])),stored=new Map(pending?[['utp-cloud-pending','student-1']]:[]),timers=[],calls=[],notifications=[];
 const replacements=[];globalThis.location={origin:'https://records.test',search,hash,pathname:'/aula/'};globalThis.history={replaceState(_state,_title,url){replacements.push(url);const next=new URL(url,location.origin);location.search=next.search;location.hash=next.hash;}};globalThis.window={addEventListener(){}};globalThis.document={querySelector:k=>elements.get(k)};
 globalThis.localStorage={getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v),removeItem:k=>stored.delete(k)};
 globalThis.setTimeout=fn=>{timers.push(fn);return timers.length};globalThis.clearTimeout=id=>{if(id)timers[id-1]=null};
 let failPut=putFails;
 globalThis.fetch=async(url,options={})=>{calls.push({url,...options});assert.ok(options.signal instanceof AbortSignal);if(sessionFails)throw new DOMException('timeout','TimeoutError');if(options.method==='PUT'&&failPut)throw Error('offline');if(options.method==='POST'&&postConflict)return Response.json({error:'UNIQUE constraint failed: students.email'},{status:409});const identity=options.method==='POST'?JSON.parse(options.body):{full_name:'Persona Prueba'};return Response.json(url==='/api/session'?{role:'student'}:options.method==='PUT'?{ok:true}:{student:{id:'student-1',full_name:identity.full_name,email:identity.email||''},name:identity.full_name,completed:[],notes:{}})};
 const mod=await import('data:text/javascript;base64,'+Buffer.from(source+'\n// '+Math.random()).toString('base64'));
 let state={name:'Persona Prueba',studentId:bringLocal?'previous-account':'student-1',completed:['ml-problema'],notes:{'ml-problema':'Nota pendiente'}};
 const settings={read:()=>state,notify:t=>notifications.push(t),apply:r=>{state={...state,...r,studentId:r.student.id}},chooseImport:async()=>bringLocal};
 await mod.initStudentRegistration(settings);
 const flush=async()=>{for(const fn of timers.splice(0))fn?.();for(let i=0;i<4;i++)await new Promise(setImmediate)};
 return {mod,elements,stored,calls,notifications,flush,replacements,reinit:()=>mod.initStudentRegistration(settings),online:()=>{failPut=false},state:()=>state};
}
const nativeTimeout=globalThis.setTimeout,nativeClear=globalThis.clearTimeout;
test('El regreso se consume una vez y no reemplaza una navegación posterior al recargar',async()=>{
 try{const h=await setup({search:'?ruta=%23tema%2Fml-problema&destino=laboratorio.html%23red&otro=1',hash:'#inicio'});assert.equal(location.hash,'#tema/ml-problema');const params=new URLSearchParams(location.search);assert.equal(params.has('ruta'),false);assert.equal(params.get('destino'),'laboratorio.html#red');assert.equal(params.get('otro'),'1');location.hash='#progreso';await h.reinit();assert.equal(location.hash,'#progreso');assert.equal(h.replacements.length,1);}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
test('Rutas de regreso con prefijos engañosos se descartan sin perder la ubicación actual',async()=>{
 try{const h=await setup({search:'?ruta=%23progreso-falso',hash:'#biblioteca'});assert.equal(location.hash,'#biblioteca');assert.equal(location.search,'');for(const route of ['#inicio-falso','#curso/ml/extra','#curso/no','#tema/../../x','https://example.test','#buscar/x#docente'])assert.equal(h.mod.validReturnRoute(route),false,route);for(const route of ['#inicio','#progreso','#curso/ml','#curso/ml/2','#curso/dl/4','#explorar/neighbors','#generalidades','#tema/dl-atencion','#buscar/red%20neuronal'])assert.equal(h.mod.validReturnRoute(route),true,route);}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
test('Un correo duplicado muestra recuperación sin exponer SQL ni cambiar la identidad',async()=>{
 try{const h=await setup({postConflict:true});const before=structuredClone(h.state());await assert.rejects(h.mod.registerStudent({full_name:'Nombre Nuevo',email:'duplicado@example.test'}),error=>{assert.match(error.message,/correo.*registro/i);assert.match(error.message,/vacío/);assert.doesNotMatch(error.message,/UNIQUE|SQL|students\.email|constraint/);return true;});assert.deepEqual(h.state(),before);}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
test('Importar avance al conectar mantiene pendiente hasta la confirmación del servidor',async()=>{
 try{const h=await setup({bringLocal:true});assert.equal(h.mod.studentSavePending(),true);assert.equal(h.elements.get('[data-save-status]').textContent,'Guardando mi avance…');assert.match(h.notifications.at(-1),/pendiente de sincronizar/);assert.equal(h.calls.some(c=>c.method==='PUT'),false);await h.flush();assert.equal(h.mod.studentSavePending(),false);assert.equal(h.elements.get('[data-save-status]').textContent,'Avance sincronizado');}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
test('El guardado fallido conserva pendientes y el botón reintenta el mismo avance',async()=>{
 try{const h=await setup({pending:true,putFails:true});await h.flush();assert.equal(h.mod.studentConnected(),true);assert.equal(h.stored.get('utp-cloud-pending'),'student-1');assert.equal(h.elements.get('[data-retry-save]').hidden,false);assert.equal(h.state().notes['ml-problema'],'Nota pendiente');h.online();h.mod.retryStudentProgress();await h.flush();assert.equal(h.stored.has('utp-cloud-pending'),false);assert.equal(h.elements.get('[data-retry-save]').hidden,true);assert.equal(h.elements.get('[data-save-status]').textContent,'Avance sincronizado');assert.equal(h.calls.filter(c=>c.method==='PUT').length,2);assert.equal(JSON.parse(h.calls.find(c=>c.method==='PUT').body).notes['ml-problema'],'Nota pendiente');}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
test('Un fallo al verificar la sesión no concede rol ni conexión y explica cómo recuperarse',async()=>{
 try{const h=await setup({sessionFails:true});assert.equal(h.mod.studentConnected(),false);assert.match(h.notifications[0],/tardando demasiado/);assert.equal(h.calls.length,1);}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
test('Editar el nombre con cambios pendientes conserva las notas y actualiza la identidad visible',async()=>{
 try{const h=await setup({pending:true,putFails:true});await h.mod.registerStudent({full_name:'Nombre Nuevo',email:'nuevo@gmail.com'});assert.equal(h.state().name,'Nombre Nuevo');assert.equal(h.state().notes['ml-problema'],'Nota pendiente');assert.deepEqual(h.state().completed,['ml-problema']);await h.flush();assert.equal(h.stored.get('utp-cloud-pending'),'student-1');}finally{globalThis.setTimeout=nativeTimeout;globalThis.clearTimeout=nativeClear}
});
