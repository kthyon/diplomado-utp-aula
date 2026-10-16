import test from 'node:test';import assert from 'node:assert/strict';import worker,{validateStudent,validateProgress,validateRegistration,handleStudent} from '../worker.js';
test('anonymous callers cannot read or write records',async()=>{for(const method of ['GET','POST','DELETE']){const r=await worker.fetch(new Request('https://records.test/api/records',{method}),{});assert.equal(r.status,401);}});
test('authenticated writes must come from the private panel origin',async()=>{const r=await worker.fetch(new Request('https://records.test/api/clean',{method:'POST',headers:{'oai-authenticated-user-id':'teacher','origin':'https://evil.test'},body:'{}'}),{DB:{}});assert.equal(r.status,403);});
test('an optional administrator identity restriction is enforced',async()=>{const r=await worker.fetch(new Request('https://records.test/api/records',{headers:{'oai-authenticated-user-id':'other','oai-authenticated-user-email':'other@example.test'}}),{ADMIN_EMAIL:'teacher@example.test',DB:{}});assert.equal(r.status,403);});
test('student identity normalization and validation',()=>{assert.deepEqual(validateStudent({full_name:'  Ejemplo de Prueba ',email:' TEST@EXAMPLE.TEST '}),{full_name:'Ejemplo de Prueba',email:'test@example.test'});assert.throws(()=>validateStudent({full_name:'A'}));assert.throws(()=>validateStudent({full_name:'Nombre Apellido',email:'bad'}));assert.equal(validateStudent({full_name:'Nombre Apellido'}).email,null);});
test('imports reject unknown topics and oversized notes, deduplicate progress',()=>{const catalog={topics:[{id:'ml-a'}]};assert.deepEqual(validateProgress({completed:['ml-a','ml-a'],notes:{'ml-a':'nota'}},catalog),{completed:['ml-a'],notes:[['ml-a','nota']]});assert.throws(()=>validateProgress({completed:['other'],notes:{}},catalog));assert.throws(()=>validateProgress({completed:[],notes:{'ml-a':'x'.repeat(10001)}},catalog));});
test('student queries use the authenticated subject, not a claimed student id',async()=>{
 const queries=[];const db={prepare(sql){return {bind(...args){queries.push({sql,args});return {first:async()=>null}}}}};
 const r=await handleStudent(new Request('https://records.test/api/me?id=other-student'),db,'verified-subject');
 assert.deepEqual(await r.json(),{student:null});assert.deepEqual(queries,[{sql:'SELECT id FROM students WHERE auth_subject=?',args:['verified-subject']}]);
});
test('a signed-in student cannot list the group or access cleanup',async()=>{
 for(const [path,method] of [['records','GET'],['clean','POST'],['students','POST']]){
 const r=await worker.fetch(new Request('https://records.test/api/'+path,{method,headers:{'oai-authenticated-user-id':'student','oai-authenticated-user-email':'student@utp.edu.co','origin':'https://records.test'}}),{DB:{},ADMIN_EMAIL:'teacher@example.test'});assert.equal(r.status,403);}
});
test('El registro exige nombre completo y acepta correo opcional de cualquier proveedor',()=>{
 for(const full_name of ['', 'Alias', 'alumno@gmail.com', '  '])assert.throws(()=>validateRegistration({full_name}));
 assert.deepEqual(validateRegistration({full_name:' María  Pérez ',email:'PERSONA@GMAIL.COM'}),{full_name:'María Pérez',email:'persona@gmail.com'});
 assert.equal(validateRegistration({full_name:'Cristian Alvarado'}).email,null);
 assert.throws(()=>validateRegistration({full_name:'Nombre Apellido',email:'incorrecto'}));
});
test('La vista docente solo procede de la identidad verificada, nunca de un parámetro',async()=>{
 const env={ADMIN_EMAIL:'Teacher@Example.Test'};
 const anonymous=await worker.fetch(new Request('https://records.test/api/session?role=teacher'),env);assert.equal(anonymous.status,401);
 for(const [email,role] of [['student@gmail.com','student'],['teacher@example.test','teacher']]){
  const r=await worker.fetch(new Request('https://records.test/api/session?role=teacher&vista=docente',{headers:{'oai-authenticated-user-id':'verified','oai-authenticated-user-email':email}}),env);
  const session=await r.json();assert.equal(session.role,role);assert.equal(session.timeZone,'America/Bogota');assert.ok(Number.isFinite(Date.parse(session.now)));assert.equal(session.email,undefined);
 }
});
test('El inicio de sesión conserva la ruta de regreso al aula',async()=>{
 const r=await worker.fetch(new Request('https://records.test/aula/?vista=docente'),{});
 assert.equal(new URL(r.headers.get('location')).searchParams.get('return_to'),'/aula/?vista=docente');
});
test('Un registro sin nombre devuelve un error corregible y no escribe datos',async()=>{
 const db={prepare(){return {bind(){return {first:async()=>null}}}}};
 const r=await worker.fetch(new Request('https://records.test/api/me',{method:'POST',headers:{'oai-authenticated-user-id':'student','origin':'https://records.test','content-type':'application/json'},body:JSON.stringify({full_name:'',email:'student@gmail.com'})}),{DB:db});
 assert.equal(r.status,400);assert.match((await r.json()).error,/nombre y apellidos/);
});
