import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NOTEBOOK_PATHS,renderNotebookPath,notebookResourceRole} from '../docs/notebook-paths.js';
import {TOPIC_CONTEXT} from '../docs/lesson-context.js';
import {LESSONS} from '../docs/content.js';

test('cada tema pendiente dirige primero al cuaderno que realmente contiene su práctica',()=>{
 assert.deepEqual(Object.keys(NOTEBOOK_PATHS).sort(),Object.keys(TOPIC_CONTEXT).sort());
 for(const [id,path] of Object.entries(NOTEBOOK_PATHS)){
  const l=LESSONS.find(l=>l.id===id);
  assert.equal(l.notebooks[0],path.file,id);
  if(path.extra)assert.ok(l.notebooks.includes(path.extra),id+' ampliación');
  assert.match(notebookResourceRole(id,path.file),/principal/);
  const notebook=JSON.parse(fs.readFileSync(new URL('../docs/notebooks/'+path.file,import.meta.url),'utf8'));
  const ids=[...path.prepareIds,...path.codeIds];assert.equal(new Set(ids).size,ids.length,id+' ruta duplicada');
  for(const cellId of ids){const cell=notebook.cells.find(c=>c.id===cellId);assert.equal(cell?.cell_type,'code',id+' necesita '+cellId);}
 }
});

test('los primeros seis temas conservan su orientación y el resto explica preparación, lectura y tip',()=>{
 for(const l of LESSONS){const html=renderNotebookPath(l.id);
  if(!TOPIC_CONTEXT[l.id]){assert.equal(html,'');for(const file of l.notebooks)assert.equal(notebookResourceRole(l.id,file),'');}
  else{assert.match(html,/Tu recorrido en Colab/);assert.match(html,/Empieza aquí:/);assert.match(html,/Tip:/);}
 }
 assert.equal(renderNotebookPath('desconocido'),'');
});
