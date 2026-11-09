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
