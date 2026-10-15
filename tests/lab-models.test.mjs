import test from 'node:test';
import assert from 'node:assert/strict';
import {initialNetwork,forward,gradients,learn,loss,neighbors,PEOPLE,evaluate} from '../docs/lab-models.js';
test('la red comienza equivocándose en el ejemplo seco y aprende sin mutar el estado previo',()=>{
 const original=initialNetwork(),copy=structuredClone(original),x=[.9,.2];
 assert.ok(forward(original,x).p<.5);let net=original;
 for(let i=0;i<10;i++){const before=loss(forward(net,x).p,1);net=learn(net,x,1);assert.ok(loss(forward(net,x).p,1)<before);}
 assert.ok(forward(net,x).p>.5);assert.deepEqual(original,copy);
});
test('retropropagación coincide con diferencias finitas en los 13 parámetros y ambas etiquetas',()=>{
 for(const y of [0,1]){const net=initialNetwork(),x=[.75,.3],g=gradients(net,x,y),eps=1e-5;
 for(const path of [...net.w.flatMap((w,j)=>w.map((_,k)=>['w',j,k])),...net.b.map((_,j)=>['b',j]),...net.v.map((_,j)=>['v',j]),['c']]){
  const a=structuredClone(net),b=structuredClone(net);let av=a,bv=b,gv=g;for(const p of path.slice(0,-1)){av=av[p];bv=bv[p];gv=gv[p];}const key=path.at(-1);av[key]+=eps;bv[key]-=eps;
  const numeric=(loss(forward(a,x).p,y)-loss(forward(b,x).p,y))/(2*eps);assert.ok(Math.abs(numeric-gv[key])<1e-6,path.join('.'));
 }}
});
test('KNN cambia su voto al escalar; la consulta no participa en las estadísticas',()=>{
 const q={age:43,income:4200000},raw=neighbors(q,3,false),scaled=neighbors(q,3,true);
 assert.equal(raw.prediction,0);assert.equal(scaled.prediction,1);assert.deepEqual(raw.stats,neighbors({age:60,income:8000000},3,true).stats);assert.equal(PEOPLE.length,6);
});
test('99 por ciento de exactitud puede coexistir con recall cero y precisión indefinida',()=>{
 const r=evaluate(1);assert.equal(r.accuracy,.99);assert.equal(r.recall,0);assert.equal(r.precision,null);assert.equal(r.fn,1);assert.equal(r.tp+r.tn+r.fp+r.fn,100);
});
test('umbral 0.80 detecta el defecto y produce dos falsas alertas',()=>{
 const r=evaluate(.8);assert.equal(r.tp,1);assert.equal(r.fp,2);assert.equal(r.fn,0);assert.equal(r.recall,1);assert.equal(r.precision,1/3);assert.equal(r.accuracy,.98);
});
