import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS} from '../docs/content.js';
import {findDefinition,reviewedTopicVocabulary} from '../docs/definitions.js';

test('cada vocabulario DL usa la definición común actual y no repite un concepto por alias',()=>{
 for(const lesson of LESSONS.filter(l=>l.id.startsWith('dl-'))){
  const used=new Set();
  for(const item of lesson.guide.vocabulary){
   const d=findDefinition(item.term);if(!d)continue;
   assert.ok(item.meaning.includes(d.meaning),lesson.id+': '+item.term+' desactualizado');
   assert.ok(!used.has(d.id),lesson.id+': concepto repetido '+d.id);used.add(d.id);
  }
 }
 const sesgo=LESSONS.find(l=>l.id==='dl-redes').guide.vocabulary.find(v=>v.term==='Sesgo');
 assert.ok(sesgo.meaning.includes(findDefinition('Sesgo').reading));
});

test('actualizar una definición y deduplicar alias preserva el orden y no modifica la fuente',()=>{
 const original=[{term:'Sesgo',meaning:'copia antigua'},{term:'Bias',meaning:'otra copia'},{term:'Término local',meaning:'explicación local'}];
 const reviewed=reviewedTopicVocabulary(original);
 assert.deepEqual(reviewed.map(v=>v.term),['Sesgo','Término local']);
 assert.equal(original[0].meaning,'copia antigua');assert.equal(original.length,3);
 assert.equal(reviewed[1].meaning,'explicación local');
});
