import test from 'node:test';
import assert from 'node:assert/strict';
import {TOPICS,initialIdea,ideaCase,ideaResult,stepIdea,SHIPMENTS} from '../docs/idea-models.js';

test('el ajuste OLS mejora la misma prueba de seis observaciones sin alterar los datos',()=>{
 const initial=ideaResult('prediction',initialIdea('prediction')),fit=ideaResult('prediction',ideaCase('prediction',2));
 assert.ok(Math.abs(initial.mae-.2)<1e-10);assert.ok(fit.mae<.05);assert.equal(fit.predicted.length,6);
});
test('la política de cuatro revisiones conserva una falsa alerta y una omisión',()=>{
 const r=ideaResult('alerts',ideaCase('alerts',1));assert.deepEqual([r.tp,r.fp,r.fn,r.tn],[3,1,1,5]);
 assert.equal(r.rows.filter(v=>v.kind==='fn')[0].name,'P4');
 const low=ideaResult('alerts',ideaCase('alerts',2));assert.deepEqual([low.tp,low.fp,low.fn],[4,3,0]);
});
test('la mediana resiste el valor extremo que modifica la media',()=>{
 const a=ideaResult('missing',ideaCase('missing',0)),b=ideaResult('missing',ideaCase('missing',1));
 assert.equal(a.estimate,600);assert.equal(b.estimate,600);assert.notEqual(a.mean,b.mean);
});
test('el historial de actualizaciones no muta el escenario guardado y se detiene en quince pasos',()=>{
 const start=ideaCase('adjustment',2),saved=structuredClone(start),next=stepIdea(start);
 assert.equal(next.theta,9);assert.equal(next.history.at(-1),36);assert.deepEqual(start,saved);
 const long=stepIdea(next,30);assert.equal(long.states.length,16);assert.equal(long.history.length,16);
 assert.ok(long.history.every(Number.isFinite));
});
test('KNN calcula la escala solo con los históricos y cambia los votos conservando la consulta',()=>{
 const raw=ideaCase('neighbors',0),scaled=ideaCase('neighbors',1),before=structuredClone(SHIPMENTS);
 const a=ideaResult('neighbors',raw),b=ideaResult('neighbors',scaled);
 assert.equal(raw.km,scaled.km);assert.equal(raw.kg,scaled.kg);assert.equal(a.kind,0);assert.equal(b.kind,1);
 assert.notDeepEqual(a.selected.map(v=>v.id),b.selected.map(v=>v.id));assert.deepEqual(SHIPMENTS,before);
 assert.deepEqual(ideaResult('neighbors',{...scaled,kg:5000}).stats,b.stats);
});
test('las nueve ventanas responden al píxel central y el filtro horizontal cancela una imagen uniforme',()=>{
 const uniform=ideaResult('convolution',ideaCase('convolution',1));assert.ok(uniform.map.flat().every(v=>v===0));
 const p=ideaCase('convolution',2),r=ideaResult('convolution',p);assert.ok(r.map.flat().every(v=>Math.abs(v-1/9)<1e-12));
 p.image[2][2]=0;assert.ok(ideaResult('convolution',p).map.flat().every(v=>v===0));
 assert.equal(ideaResult('convolution',ideaCase('convolution',2)).value,1/9);
});
test('los tres casos de cada una de las ocho ideas producen resultados finitos',()=>{
 assert.equal(TOPICS.length,8);
 for(const t of TOPICS)for(let i=0;i<t.cases.length;i++)assert.ok(!JSON.stringify(ideaResult(t.id,ideaCase(t.id,i))).includes('null'),t.id);
});
