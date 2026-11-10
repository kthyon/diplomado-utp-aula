import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ENCOUNTER_THREE_MEDIA,renderEncounterThreeMedia} from '../docs/dl-encounter-three-media.js';
import {LESSONS} from '../docs/content.js';
import {renderDLGuide} from '../docs/dl-course-journey.js';

test('los cinco apoyos visuales tienen imagen local, dimensiones reales, alternativa y créditos',()=>{
 const items=Object.values(ENCOUNTER_THREE_MEDIA).flat();assert.equal(items.length,5);
 for(const item of items){
  const file=new URL('../docs/assets/encuentro-3/'+item.file,import.meta.url),buf=fs.readFileSync(file);
  assert.ok(buf.length>1000,item.file);assert.equal(buf.subarray(1,4).toString(),'PNG');assert.equal(buf.readUInt32BE(16),item.width);assert.equal(buf.readUInt32BE(20),item.height);
  assert.ok(item.alt.length>60&&item.reading.length>80&&item.connection.length>80,item.file+' tiene lectura ligada a la clase');
  assert.match(item.source,/^https:\/\/commons.wikimedia.org\/wiki\/File:/);assert.match(item.licenseURL,/^https:\/\/creativecommons.org\/licenses\//);assert.ok(item.author.length>4);
 }
});
test('cada subtema deja la galería plegada después del ejercicio y conserva un simulador principal',()=>{
 for(const id of Object.keys(ENCOUNTER_THREE_MEDIA)){
  const html=renderDLGuide(LESSONS.find(l=>l.id===id));
  const gallery=html.indexOf('<summary>Relacionar el ejercicio con las imágenes de una red</summary>'),image=html.indexOf('<img '),workbench=html.indexOf('data-p3-topic='),equations=html.indexOf('data-p3-equations');
  assert.ok(workbench>=0&&equations>workbench&&gallery>equations&&image>gallery,id+' primero manipular y después consultar imágenes');
  const open=html.lastIndexOf('<details',gallery);assert.ok(open>equations);
  assert.doesNotMatch(html.slice(open,gallery),/\bopen(?:\s|=|>)/,id+' galería cerrada inicialmente');
  assert.equal((html.match(/data-dl-diagram=/g)||[]).length,1);
  assert.equal((html.match(/data-p3-topic=/g)||[]).length,1,id+' un solo ejercicio');
  assert.match(html,/Abrir imagen en tamaño completo/);assert.match(html,/Copia sin modificaciones/);
  assert.doesNotMatch(renderEncounterThreeMedia(id),/<img[^>]+src="https?:/);
 }
 assert.equal(renderEncounterThreeMedia('dl-cnn'),'');assert.equal(renderEncounterThreeMedia('ml-regresion'),'');
});

test('cada imagen incluye una leyenda visible de significado y función junto a las flechas',()=>{
 for(const [id,items] of Object.entries(ENCOUNTER_THREE_MEDIA)){
  const html=renderEncounterThreeMedia(id),figures=[...html.matchAll(/<figure class="e3-media-card">([\s\S]*?)<\/figure>/g)].map(m=>m[1]);
  assert.equal(figures.length,items.length);
  for(let i=0;i<items.length;i++){
   const item=items[i],figure=figures[i];assert.ok(item.symbols.length>=6,item.file);
   assert.ok(item.arrows.length>80,item.file+' explica una ruta concreta');
   const image=figure.indexOf('<img '),legend=figure.indexOf('class="e3-symbols"');
   assert.ok(legend>image,item.file+' leyenda bajo su propia imagen');
   assert.doesNotMatch(figure,/<details\b/,item.file+' la leyenda no necesita otra apertura');
   assert.match(figure,/Cómo seguir las flechas/);assert.match(figure,/no ejecuta sus operaciones/);
   assert.match(figure,/<th scope="col">Símbolo<\/th><th scope="col">Qué representa<\/th><th scope="col">Para qué lo ponemos allí<\/th>/);
   assert.equal((figure.match(/<th scope="row">/g)||[]).length,item.symbols.length);
   for(const [symbol,meaning,purpose] of item.symbols){
    assert.ok(symbol.length>0&&meaning.length>20&&purpose.length>60,item.file+' explica y sitúa '+symbol);
    assert.ok(figure.includes(symbol.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')),item.file+' símbolo impreso');
   }
  }
 }
});

test('el inventario cubre las letras, índices, operadores y bloques realmente visibles en los cinco originales',()=>{
 const required={
  'rnn-desplegada.png':['xₜ₋₁','xₜ','xₜ₊₁','hₜ₋₁','hₜ','hₜ₊₁','oₜ₋₁','oₜ','oₜ₊₁','U','V','W','Unfold','t−1','t+1','…'],
  'celda-lstm.png':['LSTM unit','xₜ₋₁','xₜ','xₜ₊₁','cₜ₋₁','cₜ','cₜ₊₁','hₜ₋₁','hₜ','hₜ₊₁','oₜ₋₁','oₜ','oₜ₊₁','Fₜ','Iₜ','Oₜ','σ','tanh','×','+','…'],
  'atencion-relaciones.png':['x₀₀','x₀₁','x₁₀','x₁₁','Q','Self-Attention','FF','h₀₀','h₀₁','h₁₀','h₁₁','Encoder'],
  'atencion-detalle.png':['x₀₀','x₀₁','x₁₀','x₁₁','wᵀh','Q','K','V','s₀','s₁','*','a₀₀','a₀₁','a₁₀','a₁₁','Alignments','+','c₀₀','c₀₁','c₁₀','c₁₁','Context','FF','h₀₀','h₀₁','h₁₀','h₁₁','Self-Attention','Encoder'],
  'transformer-arquitectura.png':['Source Sequence','Shifted Target Sequence','Embeddings / Projections','Positional Encoding','+','Norm','Multi-Headed Self-Attention','Masked Multi-Headed Self-Attention','Multi-Headed Cross-Attention','Q','K','V','Feed-Forward Network','N×','Layers','Linear','Predictions']
 };
 for(const item of Object.values(ENCOUNTER_THREE_MEDIA).flat()){
  const labels=item.symbols.map(s=>s[0]).join(' | ');
  for(const symbol of required[item.file])assert.ok(labels.includes(symbol),item.file+' explica '+symbol);
 }
 const detail=ENCOUNTER_THREE_MEDIA['dl-atencion'][1],transformer=ENCOUNTER_THREE_MEDIA['dl-transformers'][0];
 assert.match(detail.symbols.find(([symbol])=>symbol.includes('a₀₀'))[2],/no cuatro porcentajes/,'los aportes vectoriales no se confunden con pesos');
 assert.match(transformer.connection,/pre-Norm.*post-Norm/,'se identifica la diferencia con el programa real');
 assert.match(transformer.symbols.find(([symbol])=>symbol==='Q')[2],/decoder/);
 assert.match(transformer.symbols.find(([symbol])=>symbol==='K')[2],/encoder/);
 assert.match(transformer.symbols.find(([symbol])=>symbol==='V')[2],/encoder/);
});
