import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {COURSES,LESSONS,NOTEBOOKS} from '../docs/content.js';
import {ENCOUNTER_NOTEBOOKS,colabNotebookUrl} from '../docs/encounter-notebooks.js';
import {NOTEBOOK_PATHS} from '../docs/notebook-paths.js';
import {buildEncounterNotebooks} from '../scripts/build_encounter_notebooks.mjs';

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
   for(const text of ['Lo que vas a poder hacer','Entiende la idea','Un caso pequeño','Antes de ejecutar','Qué cambiar y qué conservar'])assert.ok(intro.includes(text),id+' '+text);
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
