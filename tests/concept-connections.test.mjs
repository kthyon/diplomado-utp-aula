import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSON_GUIDES} from '../docs/learning-guides.js';
import {CONCEPT_CONNECTIONS,renderConceptConnections} from '../docs/concept-connections.js';
import {renderLearningGuide} from '../docs/learning-layout.js';

test('every ML and DL topic exposes origins, reading guidance and conceptual connections in its actual lesson',()=>{
  assert.deepEqual(Object.keys(CONCEPT_CONNECTIONS).sort(),Object.keys(LESSON_GUIDES).sort());
  for(const [id,guide] of Object.entries(LESSON_GUIDES)){
    const html=renderLearningGuide({id,guide});
    assert.ok(html.includes(renderConceptConnections(id)),id);
    assert.ok(CONCEPT_CONNECTIONS[id][0].split(' → ').length>=3,id);
    for(const text of CONCEPT_CONNECTIONS[id].slice(1))assert.ok(text.length>100,id);
    assert.ok(html.includes('De dónde salen los valores'),id);
    assert.ok(html.includes('Cómo leer el ejemplo y su gráfico'),id);
  }
});
