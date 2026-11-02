// A single sigmoid neuron, with intentionally invented irrigation cases.
export const PLANT_EXAMPLE_CONTEXT = {simulated:true,description:'Datos y etiquetas inventados para explicar una neurona; no es una recomendación de riego.'};
export const PLANT_EXAMPLES = [
 {id:'seco',label:'Suelo seco',x:[.8,.6],y:1},
 {id:'humedo',label:'Suelo húmedo',x:[.15,.4],y:0},
 {id:'intermedio',label:'Caso intermedio',x:[.5,.5],y:1}
];
export const initialPlantNeuron = () => ({w:[2,1],b:-3});
const copy = model => ({w:[...model.w],b:model.b});
export function plantForward(model,x){
 const contributions=model.w.map((w,i)=>w*x[i]);
 const sumInputs=contributions.reduce((s,v)=>s+v,0),z=sumInputs+model.b;
 const p=z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));
 return {contributions,sumInputs,z,p,decision:p>=.5?1:0};
}
export const plantLoss = (p,y) => -y*Math.log(Math.max(1e-12,p))-(1-y)*Math.log(Math.max(1e-12,1-p));
export function plantUpdate(model,x,y,rate=1){
 const before=copy(model),prediction=plantForward(before,x),error=prediction.p-y;
 const gradients={w:x.map(v=>error*v),b:error};
 const after={w:before.w.map((v,i)=>v-rate*gradients.w[i]),b:before.b-rate*gradients.b};
 const nextPrediction=plantForward(after,x);
 return {before,after,prediction,nextPrediction,error,gradients,rate,lossBefore:plantLoss(prediction.p,y),lossAfter:plantLoss(nextPrediction.p,y)};
}
