import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NOTEBOOK_PATHS,renderNotebookPath,notebookResourceRole} from '../docs/notebook-paths.js';
import {LESSONS} from '../docs/content.js';

test('los veinticuatro temas dirigen al cuaderno que realmente contiene su práctica',()=>{
 assert.deepEqual(Object.keys(NOTEBOOK_PATHS).sort(),LESSONS.map(l=>l.id).sort());
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

test('todos los temas explican preparación, lectura y tip',()=>{
 for(const l of LESSONS){const html=renderNotebookPath(l.id);
  assert.match(html,/Tu recorrido en Colab/);assert.match(html,/Empieza aquí:/);assert.match(html,/Tip:/);
 }
 assert.equal(renderNotebookPath('desconocido'),'');
});
