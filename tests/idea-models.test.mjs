import test from 'node:test';
import assert from 'node:assert/strict';
import {TOPICS,initialIdea,ideaCase,ideaResult,stepIdea,SHIPMENTS,FARMS,PLANTS} from '../docs/idea-models.js';
import {renderIdeaPlot} from '../docs/idea-studio.js';

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
test('cambiar la tasa conserva el valor realmente aplicado en cada actualización',()=>{
 const start=initialIdea('adjustment'),first=stepIdea(start);
 assert.equal(first.theta,-1);assert.deepEqual(first.rates,[.1]);
 const second=stepIdea({...first,rate:.5});
 assert.equal(second.theta,3);assert.deepEqual(second.rates,[.1,.5]);
 for(let i=1;i<second.states.length;i++)assert.equal(second.states[i],second.states[i-1]-second.rates[i-1]*2*(second.states[i-1]-3));
 assert.deepEqual(first.rates,[.1]);
});
test('la curva de pérdida muestra la función visible sin convertir su recorte en una meseta',()=>{
 const plot=renderIdeaPlot('adjustment',initialIdea('adjustment'));
 const points=plot.match(/<polyline points="([^"]+)"/)[1].split(' ').map(pair=>pair.split(',').map(Number));
 assert.ok(points.every(([x,y])=>Number.isFinite(x)&&y>=50-1e-9&&y<=285+1e-9));
 assert.ok(points.filter(([,y])=>Math.abs(y-50)<1e-9).length<=2);
 assert.ok(points.some(([,y])=>y>284));
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
 const check=(value,path)=>{
  if(typeof value==='number')assert.ok(Number.isFinite(value),path);
  else if(value&&typeof value==='object')for(const [key,entry] of Object.entries(value))check(entry,`${path}.${key}`);
 };
 for(const t of TOPICS)for(let i=0;i<t.cases.length;i++)check(ideaResult(t.id,ideaCase(t.id,i)),`${t.id}, caso ${i+1}`);
});

test('cada escenario guarda una copia independiente, incluido el historial y los píxeles',()=>{
 for(const topic of TOPICS){
  const initial=initialIdea(topic.id),saved=structuredClone(initial);
  for(let i=0;i<topic.cases.length;i++){
   const state=ideaCase(topic.id,i),snapshot=structuredClone(state);
   ideaResult(topic.id,state);
   assert.deepEqual(state,snapshot,`${topic.id}: calcular no cambia el escenario`);
  }
  assert.deepEqual(initial,saved);
 }
 const first=initialIdea('convolution');first.image[0][0]=1;
 assert.equal(initialIdea('convolution').image[0][0],0);
 const learning=initialIdea('adjustment');learning.history.push(4);
 assert.deepEqual(initialIdea('adjustment').history,[25]);
});

test('la frontera del umbral es inclusiva y las métricas sin alertas no inventan precisión',()=>{
 for(let i=0;i<=100;i++){
  const threshold=i/100,r=ideaResult('alerts',{threshold});
  assert.equal(r.tp+r.fp+r.tn+r.fn,10);
  assert.equal(r.tp+r.fn,4);assert.equal(r.fp+r.tn,6);
  assert.equal(r.rows.filter(v=>v.alert).length,r.tp+r.fp);
  assert.equal(r.accuracy,(r.tp+r.tn)/10);
  assert.equal(r.recall,r.tp/4);
  assert.equal(r.precision,r.tp+r.fp?r.tp/(r.tp+r.fp):null);
 }
 for(const plant of PLANTS){
  assert.equal(ideaResult('alerts',{threshold:plant.score}).rows.find(v=>v.name===plant.name).alert,true);
  assert.equal(ideaResult('alerts',{threshold:plant.score+1e-8}).rows.find(v=>v.name===plant.name).alert,false);
 }
 assert.equal(ideaResult('alerts',{threshold:1}).precision,null);
 assert.equal(ideaResult('alerts',{threshold:0}).rows.every(v=>v.alert),true);
});

test('OLS conserva la ortogonalidad de residuos y el MAE usa errores absolutos en los extremos visibles',()=>{
 const fit=ideaCase('prediction',2),result=ideaResult('prediction',fit);
 const residuals=FARMS.map((farm,i)=>farm.y-result.predicted[i]);
 assert.ok(Math.abs(residuals.reduce((sum,v)=>sum+v,0))<1e-10);
 assert.ok(Math.abs(residuals.reduce((sum,v,i)=>sum+v*FARMS[i].x,0))<1e-9);
 for(const slope of [.005,.05])for(const bias of [0,2]){
  const r=ideaResult('prediction',{slope,bias});
  assert.ok(r.errors.every(v=>v>=0&&Number.isFinite(v)));
  assert.equal(r.mae,r.errors.reduce((sum,v)=>sum+v,0)/6);
 }
});

test('mediana, activaciones y sus límites mantienen su significado con los controles extremos',()=>{
 for(const rainA of [100,900])for(const rainC of [100,900])for(const rainD of [100,900]){
  const r=ideaResult('missing',{rainA,rainC,rainD});
  assert.equal(r.estimate,r.ordered[1]);
  assert.ok(r.mean>=100&&r.mean<=900);
 }
 for(let i=-40;i<=40;i++){
  const signal=i/10,values=Object.fromEntries(ideaResult('signal',{signal}).values.map(v=>[v.type,v.value]));
  assert.equal(values.relu,Math.max(0,signal));
  assert.ok(values.sigmoid>0&&values.sigmoid<1);
  assert.ok(values.tanh>-1&&values.tanh<1);
  const opposite=Object.fromEntries(ideaResult('signal',{signal:-signal}).values.map(v=>[v.type,v.value]));
  assert.ok(Math.abs(values.sigmoid+opposite.sigmoid-1)<1e-12);
  assert.ok(Math.abs(values.tanh+opposite.tanh)<1e-12);
 }
});

test('la tasa crítica 1 oscila sin reducir pérdida; la tasa 0,5 llega y permanece en el objetivo',()=>{
 const oscillation=stepIdea({...initialIdea('adjustment'),rate:1},15);
 assert.ok(oscillation.history.every(v=>v===25));
 assert.ok(oscillation.states.every((v,i)=>v===(i%2?8:-2)));
 const exact=stepIdea({...initialIdea('adjustment'),rate:.5},15);
 assert.ok(exact.states.slice(1).every(v=>v===3));
 assert.ok(exact.history.slice(1).every(v=>v===0));
 const capped=stepIdea(oscillation,5);assert.deepEqual(capped,oscillation);
 for(const rate of [.05,.1,.95,1.05,1.1]){
  const r=stepIdea({...initialIdea('adjustment'),rate},15);
  r.history.slice(1).forEach((v,i)=>assert.ok(Math.abs(v-r.history[i]*(1-2*rate)**2)<1e-8));
 }
});

test('las cargas extremas y todos los k disponibles conservan distancia, orden y voto explicable',()=>{
 for(const km of [20,25,43,50])for(const kg of [2500,4200,5500])for(const k of [1,3,5])for(const scaled of ['no','yes']){
  const r=ideaResult('neighbors',{km,kg,k,scaled});
  assert.equal(r.selected.length,k);
  assert.deepEqual(r.selected,r.ranked.slice(0,k));
  assert.ok(r.ranked.every((v,i)=>v.distance>=0&&Number.isFinite(v.distance)&&(!i||v.distance>=r.ranked[i-1].distance)));
  assert.equal(r.kind,Number(r.votes>k/2));
  for(const row of r.ranked)assert.ok(Math.abs(row.distance-Math.hypot(row.xy[0]-r.query[0],row.xy[1]-r.query[1]))<1e-12);
 }
 const scaled=ideaResult('neighbors',ideaCase('neighbors',1));
 for(let axis=0;axis<2;axis++){
  const coordinates=scaled.ranked.map(row=>row.xy[axis]);
  assert.ok(Math.abs(coordinates.reduce((sum,v)=>sum+v,0))<1e-12);
  assert.ok(Math.abs(coordinates.reduce((sum,v)=>sum+v*v,0)/6-1)<1e-12);
 }
});

test('cada posición de ambos filtros suma sus nueve productos sin modificar la imagen',()=>{
 for(const filter of ['horizontal','average'])for(let row=0;row<3;row++)for(let column=0;column<3;column++){
  const p={...initialIdea('convolution'),filter,row,column},snapshot=structuredClone(p);
  const r=ideaResult('convolution',p);
  assert.ok(Math.abs(r.value-r.products.flat().reduce((sum,v)=>sum+v,0))<1e-12);
  assert.equal(r.value,r.map[row][column]);
  assert.deepEqual(p,snapshot);
  if(filter==='horizontal')assert.equal(r.value,row<2?3:0);
  else assert.ok(r.map.flat().every(v=>v>=0&&v<=1+1e-12));
 }
 assert.deepEqual(['classification','detection','segmentation'].map(task=>ideaResult('vision',{task}).count),[1,3,3]);
});
