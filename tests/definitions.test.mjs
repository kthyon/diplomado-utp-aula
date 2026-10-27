import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFINITIONS,MEETING_DEFINITION_IDS,TOPIC_DEFINITION_IDS,getDefinition,findDefinition,renderMeetingDefinitions,renderGlossary} from '../docs/definitions.js';
import {COURSES,LESSONS,GLOSSARY} from '../docs/content.js';
import {renderLearningGuide} from '../docs/learning-layout.js';
import {searchCatalog} from '../docs/search.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('las definiciones tienen identidad única, interpretación, ejemplo y fuente verificable',()=>{
 assert.equal(new Set(DEFINITIONS.map(d=>d.id)).size,DEFINITIONS.length);
 for(const d of DEFINITIONS){for(const field of ['term','meaning','reading','example'])assert.ok(typeof d[field]==='string'&&d[field].trim(),d.id+' '+field);assert.equal(new URL(d.source).protocol,'https:');assert.ok(Array.isArray(d.aliases));}
 for(const id of ['mae','mse','rmse','pca','dbscan','cnn','rnn','lstm','relu','yolo','iou','ap','map','cpu','csv','json'])assert.ok(getDefinition(id).expansion,id+' nombre completo');
 for(const id of ['qkv','alpha','gamma','epsilon','transformer','r2'])assert.equal(getDefinition(id).expansion,'',id+' no es una sigla');
});

test('ocho encuentros y veinticuatro temas tienen cobertura, conservando los dos primeros sin panel nuevo',()=>{
 assert.deepEqual(Object.keys(TOPIC_DEFINITION_IDS).sort(),LESSONS.map(l=>l.id).sort());
 for(const [course,c] of Object.entries(COURSES))c.classes.forEach((cl,i)=>{
  const ids=MEETING_DEFINITION_IDS[course+'-'+(i+1)];assert.ok(ids);
  for(const id of ids)assert.ok(getDefinition(id),id);
  const html=renderMeetingDefinitions(course,i);
  if(course==='ml'&&i<2)assert.equal(html,'');else{assert.match(html,/Siglas y términos/);assert.match(html,/Consultar la fuente/);}
 });
 for(const l of LESSONS){for(const id of TOPIC_DEFINITION_IDS[l.id]){
  const d=getDefinition(id);assert.ok(d,l.id+' '+id);
  if(!['ml-problema','ml-preparacion','ml-regresion','ml-clasificacion','ml-metricas','ml-umbral'].includes(l.id)&&d.expansion)assert.ok(renderLearningGuide(l).includes(esc(d.expansion)),l.id+' no desarrolla '+d.term);
 }}
});

test('el buscador encuentra sigla, nombre completo, traducción y símbolos en la misma referencia',()=>{
 const search=q=>searchCatalog(q,LESSONS,GLOSSARY,COURSES).glossary;
 for(const q of ['MAE','Mean Absolute Error','error absoluto medio'])assert.ok(search(q).some(r=>r[0].startsWith('MAE')));
 for(const q of ['α','alpha'])assert.ok(search(q).some(r=>r[0].includes('α')));
 for(const q of ['R²','R2'])assert.ok(search(q).some(r=>r[0].startsWith('R²')));
 assert.equal(findDefinition(''),undefined);
 const html=renderGlossary(search('Mean Absolute Error'),{open:true});assert.match(html,/Nombre en inglés/);assert.match(html,/Cómo leerlo/);assert.match(html,/Ejemplo:/);assert.match(html,/Consultar la fuente/);
 assert.ok(!renderGlossary([['<img>','<script>']]).includes('<script>'));
});
