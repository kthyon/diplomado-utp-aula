import test from 'node:test';
import assert from 'node:assert/strict';
import {INDUSTRY_CONTEXT,renderIndustryContext} from '../docs/dl-industry-context.js';

const ids=['dl-secuencias','dl-atencion','dl-transformers','dl-yolo','dl-evaluacion','dl-integracion'];
const words=text=>text.trim().split(/\s+/).length;
const unescape=text=>text.replaceAll('&#39;',"'").replaceAll('&quot;','"').replaceAll('&amp;','&');

test('los seis temas tienen un bloque breve y visible con escenario, razón y condición',()=>{
 assert.deepEqual(Object.keys(INDUSTRY_CONTEXT),ids);
 for(const id of ids){
  const item=INDUSTRY_CONTEXT[id],html=renderIndustryContext(id),body=[item.scenario,item.why,item.when].join(' ');
  assert.ok(words(body)<80,id+' se mantiene por debajo de 80 palabras de explicación');
  assert.ok(words(body)>=35,id+' conserva contexto suficiente');
  assert.equal((html.match(/<h3>Dónde sirve en la industria<\/h3>/g)||[]).length,1);
  assert.deepEqual([...html.matchAll(/<strong>([^<]+)<\/strong>/g)].map(m=>m[1]),['Escenario:','Por qué usarlo:','Cuándo tiene sentido:']);
  assert.doesNotMatch(html,/<details\b|<summary\b|<script\b|<button\b/);
  assert.match(item.when,/^Si |solo se justifica/,id+' uso condicionado, no recomendación universal');
  assert.match(item.when+' '+item.why,/frente a|media|regla|alternativas sencillas|conteo manual|sensores|clasificador|revisar todo/,id+' compara alternativas sencillas');
  assert.match(item.scenario,/cooperativa|recepción/,id+' mantiene la recepción como caso común');
  assert.doesNotMatch(body,/Google|Translate|Textract|Nature/,id+' no introduce otra historia en la explicación principal');
  assert.doesNotMatch(body,/garantiza|siempre es mejor|debe usarse siempre|50\s*%|0[,.]50 es/i);
 }
});

test('cada explicación termina en su fuente primaria exacta sin inventar una atribución',()=>{
 const hosts=new Set(['www.nature.com','research.google','www.ultralytics.com','docs.ultralytics.com','docs.aws.amazon.com']);
 const sourceURLs=new Set();
 for(const id of ids){
  const item=INDUSTRY_CONTEXT[id],html=renderIndustryContext(id),source=new URL(item.source.url),href=html.match(/<a href="([^"]+)"/)[1];
  assert.equal(source.protocol,'https:');assert.ok(hosts.has(source.hostname),id+' autor/editor/fabricante original');assert.ok(source.pathname.length>8);
  assert.equal(unescape(href),item.source.url);assert.ok(unescape(html).includes(item.source.title));
  assert.equal((html.match(/<a\b/g)||[]).length,1);assert.match(html,/rel="noopener noreferrer"/);assert.ok(html.indexOf('Misma idea en industria:')>html.indexOf('<strong>Cuándo tiene sentido:'));assert.match(html,/Ver una aplicación documentada/);
  sourceURLs.add(item.source.url);
 }
 assert.equal(sourceURLs.size,6);
});

test('los casos mantienen límites entre uso documentado y demostraciones de clase',()=>{
 assert.match(INDUSTRY_CONTEXT['dl-secuencias'].scenario,/uso propuesto/);assert.match(INDUSTRY_CONTEXT['dl-secuencias'].why,/todavía no pronostica/);assert.match(INDUSTRY_CONTEXT['dl-secuencias'].when,/última entrega.*días reservados/);
 assert.match(INDUSTRY_CONTEXT['dl-atencion'].scenario,/no un sistema instalado/);assert.match(INDUSTRY_CONTEXT['dl-atencion'].why,/mezcla no decide por sí sola/);
 assert.match(INDUSTRY_CONTEXT['dl-transformers'].scenario,/no desplegamos un modelo/);assert.match(INDUSTRY_CONTEXT['dl-transformers'].when,/basta una regla/);
 assert.match(INDUSTRY_CONTEXT['dl-yolo'].scenario,/aplicación propuesta/);assert.match(INDUSTRY_CONTEXT['dl-yolo'].when,/imágenes anotadas representativas/);
 assert.match(INDUSTRY_CONTEXT['dl-evaluacion'].scenario,/comparación sigue siendo sintética/);assert.match(INDUSTRY_CONTEXT['dl-evaluacion'].why,/IoU permite comprobar ubicación/);
 assert.match(INDUSTRY_CONTEXT['dl-integracion'].scenario,/dadas, distintas de las de YOLO/);assert.match(INDUSTRY_CONTEXT['dl-integracion'].why,/no son precios reales/);
});

test('el bloque no aparece en otros temas ni acepta claves heredadas',()=>{
 for(const id of ['dl-redes','dl-vision','ml-regresion','desconocido','toString','__proto__'])assert.equal(renderIndustryContext(id),'');
});
