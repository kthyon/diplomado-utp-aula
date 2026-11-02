import test from 'node:test';
import assert from 'node:assert/strict';
import {
 initialPlantNeuron,
 plantForward,
 plantLoss,
 plantUpdate,
 PLANT_EXAMPLE_CONTEXT,
 PLANT_EXAMPLES
} from '../docs/plant-neuron-model.js';

const close=(actual,expected,tolerance=1e-10)=>assert.ok(
 Math.abs(actual-expected)<=tolerance,
 `${actual} differs from ${expected} by more than ${tolerance}`
);

test('plant neuron starts with the displayed dry-soil case and explains every contribution',()=>{
 const model=initialPlantNeuron();
 assert.deepEqual(model,{w:[2,1],b:-3});
 const result=plantForward(model,[.8,.6]);
 assert.deepEqual(result.contributions,[1.6,.6]);
 close(result.sumInputs,2.2);
 close(result.z,-.8);
 close(result.p,.31002551887238755);
 assert.equal(result.decision,0);
 close(plantLoss(result.p,1),1.1711006659477778);
});

test('prediction and loss keep inputs and parameters fixed, including independently created models',()=>{
 const model=initialPlantNeuron(),other=initialPlantNeuron(),x=[.8,.6];
 Object.freeze(model.w);Object.freeze(model);Object.freeze(x);
 const first=plantForward(model,x);
 for(let i=0;i<5;i++){
  assert.deepEqual(plantForward(model,x),first);
  plantLoss(first.p,1);
 }
 assert.deepEqual(model,{w:[2,1],b:-3});
 assert.deepEqual(x,[.8,.6]);
 other.w[0]=10;other.b=10;
 assert.deepEqual(model,{w:[2,1],b:-3});
});

test('one learning step changes the initial wrong decision and reduces the same-case loss',()=>{
 const model=initialPlantNeuron(),snapshot=structuredClone(model),x=[.8,.6];
 const update=plantUpdate(model,x,1);
 assert.deepEqual(model,snapshot);
 assert.deepEqual(update.before,snapshot);
 assert.deepEqual(update.prediction,plantForward(model,x));
 close(update.error,-.6899744811276125);
 close(update.gradients.w[0],-.55197958490209);
 close(update.gradients.w[1],-.4139846886765675);
 close(update.gradients.b,-.6899744811276125);
 assert.equal(update.rate,1);
 close(update.after.w[0],2.55197958490209);
 close(update.after.w[1],1.4139846886765675);
 close(update.after.b,-2.3100255188723873);
 close(update.nextPrediction.z,.5799489622552255);
 close(update.nextPrediction.p,.6410556624658641);
 assert.equal(update.nextPrediction.decision,1);
 close(update.lossBefore,1.1711006659477778);
 close(update.lossAfter,.44463898891134934);
 assert.ok(update.lossAfter<update.lossBefore);
 assert.deepEqual(update.nextPrediction,plantForward(update.after,x));
});

test('returning gradients agree with independent finite differences for every parameter and both labels',()=>{
 const epsilon=1e-5;
 for(const x of [[.8,.6],[0,0],[0,1],[1,0],[1,1]]){
  for(const y of [0,1]){
   const model=initialPlantNeuron(),update=plantUpdate(model,x,y);
   for(const key of ['w0','w1','b']){
    const plus=structuredClone(model),minus=structuredClone(model);
    if(key==='b'){plus.b+=epsilon;minus.b-=epsilon;}
    else{const i=Number(key.at(-1));plus.w[i]+=epsilon;minus.w[i]-=epsilon;}
    const numerical=(plantLoss(plantForward(plus,x).p,y)-plantLoss(plantForward(minus,x).p,y))/(2*epsilon);
    const analytical=key==='b'?update.gradients.b:update.gradients.w[Number(key.at(-1))];
    close(analytical,numerical,1e-7);
   }
  }
 }
});

test('learning both labels and extreme inputs stays finite and moves the score toward the known label',()=>{
 for(const x of [[0,0],[0,1],[1,0],[1,1],[.8,.6]]){
  for(const y of [0,1]){
   const model=initialPlantNeuron(),update=plantUpdate(model,x,y);
   assert.ok(Number.isFinite(update.lossBefore)&&Number.isFinite(update.lossAfter));
   assert.ok(update.lossAfter<update.lossBefore);
   assert.ok(y===1?update.nextPrediction.p>update.prediction.p:update.nextPrediction.p<update.prediction.p);
   assert.ok(update.nextPrediction.p>0&&update.nextPrediction.p<1);
   x.forEach((value,i)=>{if(value===0)assert.equal(update.after.w[i],model.w[i]);});
  }
 }
 const zeroStep=plantUpdate(initialPlantNeuron(),[.8,.6],1,0);
 assert.deepEqual(zeroStep.after,initialPlantNeuron());
 close(zeroStep.lossAfter,zeroStep.lossBefore);
 assert.ok(Number.isFinite(plantLoss(0,1)));
 assert.ok(Number.isFinite(plantLoss(1,0)));
});

test('bias shifts the same weighted inputs before activation and is distinct from the decision cutoff',()=>{
 const x=[.8,.6],low={w:[2,1],b:-3},high={w:[2,1],b:-1};
 const a=plantForward(low,x),b=plantForward(high,x);
 assert.deepEqual(a.contributions,b.contributions);
 close(a.sumInputs,b.sumInputs);
 close(b.z-a.z,2);
 close(a.p,.31002551887238755);
 close(b.p,.7685247834990178);
 assert.equal(a.decision,0);assert.equal(b.decision,1);
 // With a fixed cutoff of .5, equality activates the decision; the bias itself is not .5.
 const boundary=plantForward({w:[0,0],b:0},[0,0]);
 close(boundary.p,.5);assert.equal(boundary.decision,1);
 const allZero=plantForward({w:[2,1],b:-3},[0,0]);
 close(allZero.z,-3);close(allZero.p,.04742587317756678);
});

test('learning snapshots do not share writable weight arrays with the starting model',()=>{
 const model=initialPlantNeuron(),update=plantUpdate(model,[.8,.6],1);
 assert.notEqual(update.before.w,model.w);
 assert.notEqual(update.after.w,model.w);
 assert.notEqual(update.after.w,update.before.w);
 update.after.w[0]=999;
 assert.deepEqual(model,{w:[2,1],b:-3});
 assert.deepEqual(update.before,{w:[2,1],b:-3});
});

test('plant examples disclose their invented educational origin and contain explicit normalized inputs and labels',()=>{
 assert.equal(PLANT_EXAMPLE_CONTEXT.simulated,true);
 assert.match(PLANT_EXAMPLE_CONTEXT.description,/inventad/i);
 assert.match(PLANT_EXAMPLE_CONTEXT.description,/no es una recomendaci.n de riego/i);
 assert.equal(PLANT_EXAMPLES.length,3);
 assert.equal(new Set(PLANT_EXAMPLES.map(row=>row.id)).size,PLANT_EXAMPLES.length);
 for(const row of PLANT_EXAMPLES){
  assert.equal(row.x.length,2);
  assert.ok(row.x.every(value=>Number.isFinite(value)&&value>=0&&value<=1));
  assert.ok(row.y===0||row.y===1);
  assert.ok(row.label.length>0);
 }
 const dry=PLANT_EXAMPLES.find(row=>row.id==='seco');
 assert.deepEqual(dry.x,[.8,.6]);assert.equal(dry.y,1);
 const wet=PLANT_EXAMPLES.find(row=>row.id==='humedo');
 assert.deepEqual(wet.x,[.15,.4]);assert.equal(wet.y,0);
});
