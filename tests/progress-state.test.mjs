import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeProgress,importProgress,decodeSearch} from '../docs/progress-state.js';
const current={name:'Persona Original',email:'original@example.test',studentId:'cuenta-verificada',completed:['ml-preparacion'],notes:{'ml-preparacion':'Mi nota'},quiz:{'ml-preparacion':true}};
test('El estado local dañado no rompe el perfil ni multiplica el progreso',()=>{
 const s=normalizeProgress({name:42,completed:['ml-problema','ml-problema',null,'inventado'],notes:null,quiz:[]});
 assert.equal(s.name,'');assert.deepEqual(s.completed,['ml-problema']);assert.deepEqual(s.notes,{});assert.deepEqual(s.quiz,{});
 assert.deepEqual(normalizeProgress(null),normalizeProgress({}));
});
test('Una importación inválida no modifica los datos existentes',()=>{
 for(const v of [{completed:[],notes:{}},{name:42,completed:[],notes:{}},{name:'Alias',completed:[],notes:{}},{name:'Persona Prueba',completed:[],notes:null},{name:'Persona Prueba',completed:['inventado'],notes:{}}])assert.throws(()=>importProgress(v,current));
 assert.equal(current.notes['ml-preparacion'],'Mi nota');
});
test('Importar avance conserva identidad, correo y cuenta actual y deduplica temas',()=>{
 const s=importProgress({name:'Otra Persona',studentId:'otra-cuenta',email:'otra@example.test',completed:['ml-problema','ml-problema'],notes:{'ml-problema':'<texto literal>'}},current);
 assert.equal(s.name,current.name);assert.equal(s.email,current.email);assert.equal(s.studentId,current.studentId);assert.deepEqual(s.completed,['ml-problema']);assert.deepEqual(s.notes,{'ml-problema':'<texto literal>'});
});
test('Una búsqueda mal codificada se muestra sin romper la navegación',()=>{assert.equal(decodeSearch('%'),'%');assert.equal(decodeSearch('clasificaci%C3%B3n'),'clasificación');assert.equal(decodeSearch('%E0%A4%A'),'%E0%A4%A')});
