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
test('cada subtema muestra la galería después del ejercicio y conserva un simulador principal',()=>{
 for(const id of Object.keys(ENCOUNTER_THREE_MEDIA)){
  const html=renderDLGuide(LESSONS.find(l=>l.id===id));
  const gallery=html.indexOf('<summary>Relacionar la figura con las imágenes de una red</summary>'),image=html.search(/<img |data-tf=?/),workbench=html.indexOf('data-p3-topic='),equations=html.indexOf('data-p3-equations');
  assert.ok(workbench>=0&&equations>workbench&&gallery>equations&&image>gallery,id+' primero manipular y después consultar imágenes');
  const open=html.lastIndexOf('<details',gallery);assert.ok(open>equations);
  assert.match(html.slice(open,gallery),/\bopen(?:\s|=|>)/,id+' galería visible desde el inicio');
  assert.equal((html.match(/data-dl-diagram=/g)||[]).length,1);
  assert.equal((html.match(/data-p3-topic=/g)||[]).length,1,id+' un solo ejercicio');
  assert.match(html,/Abrir imagen en tamaño completo|Ver la figura original/);assert.match(html,/Copia sin modificaciones|adaptado de esa figura/);
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
   const image=figure.search(/<img |data-tf=?/),legend=figure.indexOf('class="e3-symbols"');
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

test('la arquitectura del Transformer es una figura animada: mismas piezas que el original, recorrido en seis pasos y crédito de adaptación',async()=>{
 const {TRANSFORMER_STEPS,TRANSFORMER_PARTS,transformerStage,transformerSequence,renderTransformerFlow,leafState,mountTransformerFlow}=await import('../docs/transformer-flow.js');
 const html=renderEncounterThreeMedia('dl-transformers'),stage=transformerStage();
 assert.equal((html.match(/<img /g)||[]).length,0,'ya no se muestra la imagen estática');assert.equal((html.match(/data-tf-out/g)||[]).length,1);
 assert.match(html,/adaptado de esa figura/);assert.match(html,/Ver la figura original/);assert.match(html,/Daniel Voigt Godoy/);assert.match(html,/CC BY 4\.0/);
 assert.equal(renderEncounterThreeMedia('dl-atencion').includes('data-tf'),false);
 assert.equal(TRANSFORMER_STEPS.length,6);assert.equal((renderTransformerFlow().match(/data-tf-step-button=/g)||[]).length,6);
 // Piezas del original: 2 embeddings, 2 posiciones, 7 Norm, 3 atenciones, 2 redes, 5 sumas residuales, capa lineal.
 const count=re=>(stage.match(re)||[]).length;
 assert.equal(count(/>Norm</g),7);assert.equal(count(/>Embeddings</g),2);assert.equal(count(/>Codificación</g),2);assert.equal(count(/>Red de avance directo</g),2);
 assert.equal(count(/>Autoatención</g),1);assert.equal(count(/>Autoatención con máscara</g),1);assert.equal(count(/>Atención cruzada</g),1);assert.equal(count(/>Capa lineal</g),1);
 assert.equal(count(/class="tf-line tf-res"/g),5);assert.equal(count(/class="tf-plus"/g),5+2+2,'cinco sumas residuales, dos sumas de posición y dos símbolos de onda');
 assert.equal(count(/class="tf-t-qkv">Q</g),3);assert.equal(count(/class="tf-t-qkv">K</g),3);assert.equal(count(/class="tf-t-qkv">V</g),3);
 assert.ok(!/undefined|NaN/.test(stage+renderTransformerFlow()));
 // En la atención cruzada, K y V llegan desde el encoder (x < 540) y Q sale del decoder.
 const cross=transformerSequence(5),start=l=>cross.find(i=>i.label===l).path[0][0];
 assert.ok(start('K')<420&&start('V')<420&&start('Q')===540);
 for(let step=1;step<=6;step++)for(const item of transformerSequence(step)){assert.ok(item.t1>item.t0&&item.path.length>=2&&item.label);for(const [x,y] of item.path)assert.ok(x>0&&x<760&&y>0&&y<840);}
 assert.ok(transformerSequence(1).every(i=>i.path.every(p=>p[0]<300))&&transformerSequence(6).every(i=>i.path.every(p=>p[0]>400)),'el paso 1 ocurre en el encoder y el 6 en el decoder');
 // Estados: paso actual, pasos anteriores y foco por parte; «lo que usa el cuaderno» destaca solo el encoder.
 assert.equal(leafState({step:2,part:'attn',col:'enc'},2,null),'is-on');assert.equal(leafState({step:1,part:'emb',col:'enc'},2,null),'is-past');assert.equal(leafState({step:5,part:'cross',col:'dec'},2,null),'is-off');
 assert.equal(leafState({step:6,part:'norm',col:'dec'},1,'norm'),'is-on');assert.equal(leafState({step:4,part:'mask',col:'dec'},4,'notebook'),'is-off');assert.equal(leafState({step:3,part:'ffn',col:'enc'},6,'notebook'),'is-on');assert.equal(leafState({step:5,part:'cross',col:'bridge'},5,'notebook'),'is-off');
 assert.deepEqual(TRANSFORMER_PARTS.map(p=>p[0]),['emb','pos','norm','attn','mask','cross','ffn','res','head','notebook']);
 assert.match(TRANSFORMER_PARTS.at(-1)[3],/post-Norm/);
 const app=fs.readFileSync(new URL('../docs/app.js',import.meta.url),'utf8');assert.match(app,/mountTransformerFlow\(document\)/);
 assert.equal(typeof mountTransformerFlow,'function');
});
