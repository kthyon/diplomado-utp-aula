import test from 'node:test';
import assert from 'node:assert/strict';
import {DL_LEARNING_PATHS} from '../docs/dl-learning-paths.js';
import {LESSON_GUIDES} from '../docs/learning-guides.js';
import {CONCEPT_CONNECTIONS,renderConceptConnections} from '../docs/concept-connections.js';
import {renderLearningGuide} from '../docs/learning-layout.js';

test('ML conserva conexiones completas y DL explica el origen y la lectura de su ejemplo principal',()=>{
  assert.deepEqual(Object.keys(CONCEPT_CONNECTIONS).sort(),Object.keys(LESSON_GUIDES).sort());
  for(const [id,guide] of Object.entries(LESSON_GUIDES)){
    const html=renderLearningGuide({id,guide});
    if(id.startsWith('dl-')){
      const p=DL_LEARNING_PATHS[id];
      const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      assert.ok(html.includes(esc(p.example.intro)),id+' declara el contexto de los valores');
      assert.ok(html.includes(esc(p.example.reading)),id+' explica cómo leer la figura actual');
      assert.ok(html.includes(esc(p.example.takeaway)),id+' explica qué demuestra');
      const caption=[...html.matchAll(/<figcaption>([\s\S]*?)<\/figcaption>/g)].map(m=>m[1]).join(' ');
      assert.match(p.example.intro+' '+caption,/dados|elegid|fijad|simulad|inventad|fictici|ilustra|construid|señal interna es −2|miden 40×40 píxeles/i,id+' asignación u origen explícitos');
      assert.equal((html.match(/data-dl-primary-example=/g)||[]).length,1,id+' no repite el ejemplo');
      continue;
    }
    assert.ok(html.includes(renderConceptConnections(id)),id);
    assert.ok(CONCEPT_CONNECTIONS[id][0].split(' → ').length>=3,id);
    for(const text of CONCEPT_CONNECTIONS[id].slice(1))assert.ok(text.length>100,id);
    assert.ok(html.includes('De dónde salen los valores'),id);
    assert.ok(html.includes('Cómo leer el ejemplo y su gráfico'),id);
  }
});
