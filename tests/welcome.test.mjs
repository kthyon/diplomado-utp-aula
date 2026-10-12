import test from 'node:test';
import assert from 'node:assert/strict';
import {WELCOME_ID,WELCOME_KEY,EMBED_URL,PROJECT_URL,welcomeSeen} from '../docs/welcome.js';
test('La bienvenida apunta a Generalidades 2, no a una copia de las diapositivas',()=>{assert.equal(WELCOME_ID,'1n4uXQrFrcTKQNsJP2nNaQ9VTA7envI0Jk6DKmeBHQVA');assert.ok(EMBED_URL.includes(WELCOME_ID+'/embed'));assert.ok(PROJECT_URL.endsWith(WELCOME_ID+'/present'))});
test('La marca persiste en el navegador y no depende de la asignatura',()=>{const values=new Map(),storage={getItem:k=>values.get(k)};assert.equal(welcomeSeen(storage),false);values.set(WELCOME_KEY,'1');assert.equal(welcomeSeen(storage),true)});

