import test from 'node:test';import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';import {spawn} from 'node:child_process';import {createInterface} from 'node:readline';import {fileURLToPath} from 'node:url';
const workerSource=(await readFile(new URL('../worker.js',import.meta.url),'utf8')).replace('/*CATALOG*/ null',await readFile(new URL('../catalog.json',import.meta.url),'utf8'));
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'));
test('Registro, aislamiento entre cuentas, importación y reinicio preservan notas privadas (SQLite real)',{timeout:10000},async()=>{
 const python=process.env.AULA_TEST_PYTHON||(process.platform==='win32'?'python':'python3');
 const child=spawn(python,[fileURLToPath(new URL('sqlite_bridge.py',import.meta.url))],{stdio:['pipe','pipe','inherit']});const pending=[];let bridgeError;child.on('error',error=>{bridgeError=error;for(const wait of pending.splice(0))wait.reject(error)});child.on('exit',code=>{if(code&&pending.length){bridgeError=Error('SQLite bridge exited '+code);for(const wait of pending.splice(0))wait.reject(bridgeError)}});
 const lines=createInterface({input:child.stdout});lines.on('line',line=>{const result=JSON.parse(line),wait=pending.shift();if(result.error)wait.reject(Error(result.error));else wait.resolve(result.results)});
 function execute(statements){if(bridgeError)return Promise.reject(bridgeError);return new Promise((resolve,reject)=>{pending.push({resolve,reject});child.stdin.write(JSON.stringify({statements})+'\n')})}
 const db={prepare(sql){return {
  bind(...args){const query={sql,args};return {...query,first:async()=>(await execute([query]))[0][0]||null,all:async()=>({results:(await execute([query]))[0]}),run:()=>execute([query])}},
  all:async()=>({results:(await execute([{sql,args:[]}]))[0]})
 }},batch:queries=>execute(queries)};
 const env={DB:db,ADMIN_EMAIL:'teacher@example.test'};
 async function call(path='me',method='GET',value,subject='student-a',email='a@example.test'){
  const response=await worker.fetch(new Request('https://records.test/api/'+path,{method,headers:{origin:'https://records.test','oai-authenticated-user-id':subject,'oai-authenticated-user-email':email,...(value?{'content-type':'application/json'}:{})},body:value?JSON.stringify(value):undefined}),env);return {status:response.status,value:await response.json()};
 }
 try{
  assert.equal((await call()).value.student,null);
  const a=await call('me','POST',{full_name:'Persona Primera'});assert.equal(a.status,200);assert.equal(a.value.student.email,null);const id=a.value.student.id;
  const b=await call('me','POST',{full_name:'Persona Segunda',email:'cualquiera@gmail.com'},'student-b');assert.notEqual(b.value.student.id,id);
  assert.equal((await call('me','PUT',{studentId:b.value.student.id,completed:['ml-problema'],notes:{'ml-problema':'Nota A'}})).status,200);
  assert.deepEqual((await call('me','GET',undefined,'student-b')).value.notes,{});
  assert.deepEqual((await call('me?id='+id,'GET',undefined,'student-b')).value.completed,[]);
  for(const path of ['records','students/'+id+'/progress'])assert.equal((await call(path,'GET',undefined,'student-b')).status,403);
  await execute([{sql:"INSERT INTO notes(id,student_id,course_id,topic_id,content,owner_scope) VALUES ('teacher-note',?,'ml','ml-problema','Nota privada','teacher')",args:[id]}]);
  const imported=await call('students/'+id+'/progress','POST',{completed:['ml-preparacion'],notes:{'ml-problema':'Nota importada'}},'teacher','teacher@example.test');assert.equal(imported.status,200);
  assert.deepEqual((await call()).value.notes,{'ml-problema':'Nota importada'});
  assert.equal((await execute([{sql:"SELECT content FROM notes WHERE id='teacher-note'",args:[]}]))[0][0].content,'Nota privada');
  assert.equal((await call('me','PUT',{completed:[],notes:{}})).status,200);assert.deepEqual((await call()).value.completed,[]);assert.deepEqual((await call()).value.notes,{});
  assert.equal((await execute([{sql:"SELECT count(*) AS n FROM notes WHERE owner_scope='teacher'",args:[]}]))[0][0].n,1);
  const group=await call('records','GET',undefined,'teacher','teacher@example.test');assert.equal(group.status,200);assert.equal(group.value.students.length,2);assert.equal(group.value.notes[0].content,'Nota privada');
 }finally{child.stdin.end();lines.close();child.kill()}
});
