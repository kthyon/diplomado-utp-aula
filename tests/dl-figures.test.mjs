import test from 'node:test';
import assert from 'node:assert/strict';
import {withDiagramZoom,neuronFigure,convolutionFigure} from '../docs/dl-figures.js';
import {neuronExample,convolutionExample} from '../docs/dl-example-models.js';

test('ampliar conserva un solo gráfico y su lectura, con un control conectado al mismo recuadro',()=>{
 for(const html of [neuronFigure(neuronExample()),convolutionFigure(convolutionExample()),withDiagramZoom('<svg viewBox="0 0 10 10" role="img"><text>Una única figura</text></svg>')]){
  assert.equal((html.match(/<svg\b/g)||[]).length,1);
  assert.equal((html.match(/class="dl-figure-scroll"/g)||[]).length,1);
  const target=html.match(/<summary aria-controls="([^"]+)"/)[1];
  assert.ok(html.includes(`id="${target}" role="region"`));
  assert.match(html,/Reducir gráfico/);
  const details=html.indexOf('</details>'),graph=html.indexOf('<svg');
  assert.ok(graph>details,'el gráfico visible está fuera del contenido que se oculta al cerrar el control');
 }
 assert.match(neuronFigure(neuronExample()),/<figcaption>Los dos aportes/);
 assert.equal(withDiagramZoom('<p>Sin gráfico</p>'),'<p>Sin gráfico</p>');
});

test('varios gráficos de la misma página tienen destinos de ampliación únicos',()=>{
 const html=neuronFigure(neuronExample())+convolutionFigure(convolutionExample());
 const ids=[...html.matchAll(/id="(dl-zoom-view-\d+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,2);assert.equal(new Set(ids).size,2);
});
