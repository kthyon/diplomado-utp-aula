import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';

// The local adapter emulates identity headers supplied by hosting, not a client login.
// No production origin, account, database or paid service is contacted.
test('HTTP + SQLite: registro, guardado, desconexión, recuperación y cambio de cuenta', {timeout:20000}, async()=>{
 const source=(await readFile(new URL('../worker.js',import.meta.url),'utf8')).replace('/*CATALOG*/ null',await readFile(new URL('../catalog.json',import.meta.url),'utf8'));
 const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const child=spawn(process.env.AULA_TEST_PYTHON||(process.platform==='win32'?'python':'python3'),[fileURLToPath(new URL('sqlite_bridge.py',import.meta.url))],{stdio:['pipe','pipe','inherit'],env:{...process.env,PYTHONUTF8:'1'}});
 const waiting=[];let bridgeError;
 child.on('error',e=>{bridgeError=e;for(const p of waiting.splice(0))p.reject(e)});
 const lines=createInterface({input:child.stdout});
 lines.on('line',line=>{const result=JSON.parse(line),p=waiting.shift();if(result.error)p.reject(Error(result.error));else p.resolve(result.results)});
 const execute=statements=>bridgeError?Promise.reject(bridgeError):new Promise((resolve,reject)=>{waiting.push({resolve,reject});child.stdin.write(JSON.stringify({statements})+'\n')});
 const db={prepare(sql){return {bind(...args){const q={sql,args};return {...q,first:async()=>(await execute([q]))[0][0]||null,all:async()=>({results:(await execute([q]))[0]}),run:()=>execute([q])}},all:async()=>({results:(await execute([{sql,args:[]}]))[0]})}},batch:execute};
 const server=createServer(async(req,res)=>{
  try{const chunks=[];for await(const c of req)chunks.push(c);const headers=new Headers(req.headers);
   const subject=headers.get('x-test-account');headers.delete('x-test-account');
   if(subject){headers.set('oai-authenticated-user-id',subject);headers.set('oai-authenticated-user-email',subject+'@example.test')}
   const response=await worker.fetch(new Request(origin+req.url,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})}),{DB:db,ADMIN_EMAIL:'teacher@example.test'});
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(e){res.writeHead(500);res.end(JSON.stringify({error:e.message}))}
 });
 const nativeFetch=globalThis.fetch, globals=Object.fromEntries(['location','history','window','document','localStorage'].map(k=>[k,globalThis[k]]));
 let origin,account='persona-a',offline=false,state={name:'',studentId:null,completed:[],notes:{}},chooseImportCalls=0;
 const elements=new Map(),storage=new Map(),notices=[];
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
  globalThis.location={origin,pathname:'/aula/',search:'',hash:'#progreso'};
  globalThis.history={replaceState(){}};globalThis.window={addEventListener(){}};
  globalThis.document={querySelector:s=>{if(!elements.has(s))elements.set(s,{textContent:'',hidden:true});return elements.get(s)}};
  globalThis.localStorage={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
  globalThis.fetch=(url,options={})=>{if(offline)return Promise.reject(new TypeError('Synthetic offline'));return nativeFetch(new URL(url,origin),{...options,headers:{...options.headers,origin,'x-test-account':account}})};
  const registrationSource=(await readFile(new URL('../../docs/student-registration.js',import.meta.url),'utf8'))
   .replace("'./access-policy.js'",JSON.stringify(new URL('../../docs/access-policy.js',import.meta.url).href))
   .replace("import {STUDENT_RECORDS} from './database-config.js';",'const STUDENT_RECORDS='+JSON.stringify({enabled:true,url:origin})+';');
  const settings={read:()=>state,apply:v=>{state={...state,...v,studentId:v.student.id}},notify:s=>notices.push(s),chooseImport:async()=>{chooseImportCalls++;return false}};
  const fresh=async()=>{const m=await import('data:text/javascript;base64,'+Buffer.from(registrationSource+'\n// '+Math.random()).toString('base64'));await m.initStudentRegistration(settings);return m};
  const waitUntil=async(predicate)=>{const until=Date.now()+4000;while(!predicate()){if(Date.now()>until)throw Error('Expected registration status was not reached');await new Promise(r=>setTimeout(r,20))}};
  let registration=await fresh();assert.equal(registration.studentConnected(),false);
  await registration.registerStudent({full_name:'Persona Primera',email:'primera@example.test'});
  assert.equal(registration.studentConnected(),true);const a=state.studentId;
  state.completed=['ml-problema'];state.notes={'ml-problema':'Mi primera nota sintética'};
  registration.saveStudentProgress();assert.equal(registration.studentSavePending(),true);
  await waitUntil(()=>!registration.studentSavePending());
  assert.equal(elements.get('[data-save-status]').textContent,'Avance sincronizado');
  assert.deepEqual((await (await fetch('/api/me')).json()).completed,['ml-problema']);

  offline=true;state.notes['ml-problema']='Nota escrita sin conexión';registration.saveStudentProgress();
  await waitUntil(()=>elements.get('[data-save-status]').textContent==='Guardado pendiente');
  assert.equal(storage.get('utp-cloud-pending'),a);assert.equal(elements.get('[data-retry-save]').hidden,false);
  assert.equal(state.notes['ml-problema'],'Nota escrita sin conexión');offline=false;
  registration.retryStudentProgress();await waitUntil(()=>!registration.studentSavePending());
  state={name:'',studentId:a,completed:[],notes:{}};registration=await fresh();
  assert.equal(state.notes['ml-problema'],'Nota escrita sin conexión');assert.deepEqual(state.completed,['ml-problema']);

  // An invalid import is rejected before the existing snapshot is deleted.
  const invalid=await fetch('/api/me',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({completed:['unknown-topic'],notes:{}})});
  assert.equal(invalid.status,400);assert.deepEqual((await(await fetch('/api/me')).json()).completed,['ml-problema']);
  for(const method of ['POST','PUT']){
   const crossOrigin=await nativeFetch(origin+'/api/me',{method,headers:{origin:'https://untrusted.example','x-test-account':account,'content-type':'application/json'},body:'{}'});
   assert.equal(crossOrigin.status,403);
  }
  assert.equal((await nativeFetch(origin+'/api/me')).status,401);

  account='persona-b';assert.equal((await(await fetch('/api/me')).json()).student,null);
  registration=await fresh();
  await assert.rejects(registration.registerStudent({full_name:'Persona Segunda',email:'primera@example.test'}),/correo.*registro/i);
  await registration.registerStudent({full_name:'Persona Segunda',email:''});
  const b=state.studentId;assert.notEqual(a,b);assert.equal(chooseImportCalls,1);
  assert.deepEqual(state.completed,[]);assert.deepEqual(state.notes,{});
  const forged=await fetch('/api/me?id='+a,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({studentId:a,completed:[],notes:{'ml-problema':'Pertenece únicamente a B'}})});
  assert.equal(forged.status,200);
  assert.equal((await(await fetch('/api/me')).json()).notes['ml-problema'],'Pertenece únicamente a B');
  for(const path of ['/api/records','/api/students/'+a+'/progress'])assert.equal((await fetch(path)).status,403);
  account='persona-a';assert.equal((await(await fetch('/api/me')).json()).notes['ml-problema'],'Nota escrita sin conexión');
  account='persona-b';
  const imported=await fetch('/api/me',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({completed:['ml-problema'],notes:{'ml-problema':'Importación sintética'}})});
  assert.equal(imported.status,200);state={name:'',studentId:b,completed:[],notes:{}};await fresh();
  assert.equal(state.notes['ml-problema'],'Importación sintética');
  assert.equal(storage.has('utp-cloud-pending'),false);
 }finally{
  globalThis.fetch=nativeFetch;for(const [k,v] of Object.entries(globals)){if(v===undefined)delete globalThis[k];else globalThis[k]=v}
  await new Promise(resolve=>server.close(resolve));child.stdin.end();lines.close();child.kill();
 }
});
