import test from 'node:test';
import assert from 'node:assert/strict';
import {searchCatalog} from '../docs/search.js';
import {LESSONS,GLOSSARY,COURSES} from '../docs/content.js';
const search=t=>searchCatalog(t,LESSONS,GLOSSARY,COURSES);
test('classification is found without accents and regardless of case',()=>{assert.ok(search(' CLASIFICACION ').lessons.some(l=>l.id==='ml-clasificacion'));assert.deepEqual(search('clasificación'),search('clasificacion'));});
test('multi-word queries can match words across a lesson',()=>{assert.ok(search('clasificacion probabilidades').lessons.some(l=>l.id==='ml-clasificacion'));});
test('course names and abbreviations find their subjects',()=>{assert.equal(search('Machine Learning').lessons.length,12);assert.equal(search('ML').lessons.length,12);assert.equal(search('Deep Learning').lessons.length,12);assert.equal(search('DL').lessons.length,12);});
test('empty and unknown queries return no false matches',()=>{assert.deepEqual(search(''),{lessons:[],glossary:[]});assert.deepEqual(search('zzzinexistente'),{lessons:[],glossary:[]});});
