import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {COURSES,LESSONS,NOTEBOOKS} from '../docs/content.js';
import {ENCOUNTER_NOTEBOOKS,colabNotebookUrl} from '../docs/encounter-notebooks.js';
import {NOTEBOOK_PATHS} from '../docs/notebook-paths.js';
import {STUDENT_RECORDS} from '../docs/database-config.js';
import {buildEncounterNotebooks} from '../scripts/build_encounter_notebooks.mjs';
import {PRACTICAL_LESSONS} from '../docs/dl-practical-lessons.js';

test('los principales DL vuelven al mismo aula conectada y al tema específico, conservando la sesión del alumno o docente',()=>{
 for(const meeting of ENCOUNTER_NOTEBOOKS.filter(m=>m.course==='dl')){
  const nb=JSON.parse(fs.readFileSync(new URL('../docs/notebooks/'+meeting.file,import.meta.url),'utf8'));
  for(const id of meeting.topics){
   const close=nb.cells.find(c=>c.id==='comprueba-'+id).source;
   const returnURL=new URL('/aula/',STUDENT_RECORDS.url).href+'#tema/'+id;
   assert.ok(close.includes('[Volver al tema del aula]('+returnURL+')'));
   assert.doesNotMatch(close,/github\.io/,'volver no debe enviar a otro origen con un registro distinto');
  }
 }
});

test('cada uno de los ocho encuentros tiene un principal con sus tres temas y enlaces al punto correcto',()=>{
 assert.equal(ENCOUNTER_NOTEBOOKS.length,8);
 assert.equal(new Set(ENCOUNTER_NOTEBOOKS.map(m=>m.file)).size,8);
 for(const m of ENCOUNTER_NOTEBOOKS){
  assert.deepEqual(m.topics,COURSES[m.course].classes[m.index].topics);
  assert.ok(NOTEBOOKS[m.file]);
  const nb=JSON.parse(fs.readFileSync(new URL('../docs/notebooks/'+m.file,import.meta.url)));
  assert.deepEqual(nb.metadata.utp.topics,m.topics);
  for(const id of m.topics){
   assert.equal(LESSONS.find(l=>l.id===id).notebooks[0],m.file);
   assert.ok(nb.cells.some(c=>c.id==='tema-'+id&&c.cell_type==='markdown'));
   assert.ok(colabNotebookUrl(m.file,id).endsWith('#scrollTo=tema-'+id));
   const route=NOTEBOOK_PATHS[id];
   assert.doesNotMatch(route.section,/^Tema \d+ · \d/,'el principal usa los temas del encuentro, no números de capítulos del apoyo');
   assert.deepEqual(nb.metadata.utp.routes[id],[...route.prepareIds,...route.codeIds]);
   for(const cell of nb.cells.filter(c=>nb.metadata.utp.routes[id].includes(c.id)))assert.equal(cell.cell_type,'code');
  }
 }
 assert.ok(!colabNotebookUrl('pca.ipynb','ml-pca').includes('#scrollTo='));
});

test('los cuadernos publicados reproducen las fuentes, contienen contexto y no guardan ejecuciones',()=>{
 assert.equal(buildEncounterNotebooks({check:true}).length,8);
 for(const m of ENCOUNTER_NOTEBOOKS){
  const nb=JSON.parse(fs.readFileSync(new URL('../docs/notebooks/'+m.file,import.meta.url)));
  const ids=nb.cells.map(c=>c.id);assert.equal(new Set(ids).size,ids.length);
  for(const c of nb.cells){
   assert.match(c.id,/^[a-zA-Z0-9_-]{1,64}$/);
   if(c.cell_type==='code'){assert.equal(c.execution_count,null);assert.deepEqual(c.outputs,[]);}
  }
  for(const id of m.topics){
   const intro=nb.cells.find(c=>c.id==='tema-'+id).source;
   const headings=PRACTICAL_LESSONS[id]?['Lo que vas a poder hacer','Predice antes de ejecutar','Ejecuta y compara','Explica con tus palabras','Cómo conecta con el aula','Antes de ejecutar','Qué cambiar y qué conservar']:['Lo que vas a poder hacer','Entiende la idea','Un caso pequeño','Antes de ejecutar','Qué cambiar y qué conservar'];
   for(const text of headings)assert.ok(intro.includes(text),id+' '+text);
   if(PRACTICAL_LESSONS[id]){
    assert.ok(intro.indexOf('Predice antes de ejecutar')<intro.indexOf('Ejecuta y compara')&&intro.indexOf('Ejecuta y compara')<intro.indexOf('Explica con tus palabras'),id+' anticipar → ejecutar → explicar');
    assert.doesNotMatch(intro,/### Entiende la idea|### Un caso pequeño/,id+' no vuelve al bloque teórico sustituido');
   }
   assert.ok(nb.cells.find(c=>c.id==='comprueba-'+id).source.includes('Respuesta razonada'));
  }
 }
});

test('las explicaciones de preparación acompañan su código y no se adelantan en otro tema',()=>{
 const nb=JSON.parse(fs.readFileSync(new URL('../docs/notebooks/ml-encuentro-1.ipynb',import.meta.url)));
 const topic1=nb.cells.slice(1,nb.cells.findIndex(c=>c.id==='tema-ml-preparacion'));
 assert.ok(!topic1.some(c=>c.cell_type==='markdown'&&c.source.includes('### 1.2.')));
 const topic2=nb.cells.slice(nb.cells.findIndex(c=>c.id==='tema-ml-preparacion'),nb.cells.findIndex(c=>c.id==='tema-ml-regresion'));
 assert.ok(!topic2.some(c=>c.cell_type==='markdown'&&c.source.includes('### 1.5.')));
 const intro=topic2.findIndex(c=>c.cell_type==='markdown'&&c.source.includes('### 1.2.'));
 const code=topic2.findIndex(c=>c.id==='ml-preparacion--utp-95bdbbfc11ccfd84');
 assert.ok(intro>=0&&intro<code);
});

test('Deep Learning separa cálculo, activaciones y un paso de ajuste sin repetir sus programas entre temas',()=>{
 const one=JSON.parse(fs.readFileSync(new URL('../docs/notebooks/dl-encuentro-1.ipynb',import.meta.url)));
 const three=JSON.parse(fs.readFileSync(new URL('../docs/notebooks/dl-encuentro-3.ipynb',import.meta.url)));
 assert.ok(!one.cells.some(c=>c.cell_type==='code'&&c.id.endsWith('--lab09-neurona')),'la neurona con curvas no se repite en Redes y Activaciones');
 assert.ok(one.cells.some(c=>c.id==='dl-redes--capas-en-cadena'));
 assert.ok(one.cells.some(c=>c.id==='dl-activaciones--comparar-activaciones'));
 assert.ok(one.cells.some(c=>c.id==='dl-activaciones--curvas-activaciones'));
 assert.ok(one.cells.some(c=>c.id==='dl-entrenamiento--un-paso-gradiente'));
 assert.ok(!one.cells.some(c=>c.id==='dl-entrenamiento--lab01-gradiente'),'la curva de doce pasos no sustituye la comprobación de un paso');
 assert.ok(!three.cells.some(c=>c.id==='dl-transformers--lab12-atencion'),'Transformer conserva su propia tarea; no repite la mezcla previa');
 const ids=new Set(['dl-redes--lab01-calculo','dl-redes--capas-en-cadena','dl-activaciones--comparar-activaciones','dl-activaciones--curvas-activaciones','dl-entrenamiento--un-paso-gradiente']);
 for(const cell of one.cells.filter(c=>ids.has(c.id)))assert.match(cell.source,/^import |^from /m,cell.id+' declara sus herramientas');
 const fingerprints=new Set();
 for(const notebook of [one,three])for(const cell of notebook.cells.filter(c=>c.cell_type==='code'&&!/--preparacion[12]$/.test(c.id))){
  assert.ok(!fingerprints.has(cell.source),cell.id+' código principal duplicado');fingerprints.add(cell.source);
 }
});
