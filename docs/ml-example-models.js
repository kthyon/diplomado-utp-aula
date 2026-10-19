import {ols,mae} from './math.js';

// Deliberately small, invented cases; held-out answers never participate in fitting.
export const FIRST_FARMS=[{name:'1',rain:400,yield:2},{name:'2',rain:500,yield:2.5},{name:'3',rain:600,yield:3},{name:'4',rain:700,yield:3.5}];
export const NEW_FARMS=[{name:'A',rain:450,yield:2.6},{name:'B',rain:550,yield:3.1},{name:'C',rain:650,yield:3}];
export function farmPrediction(rain){const model=ols(FIRST_FARMS.map(f=>f.rain),FIRST_FARMS.map(f=>f.yield));return {...model,prediction:model.intercept+model.slope*rain};}
export function forecastExample(strategy){
  const observed=Array.from({length:84},(_,i)=>100+.6*i+12*Math.sin(2*Math.PI*i/12)+2*Math.sin(i*13.3));
  const training=observed.slice(0,60),test=observed.slice(60),fit=ols(training.map((_,i)=>i),training);
  const predictions=test.map((_,i)=>strategy==='last'?training.at(-1):strategy==='seasonal'?training[48+i%12]:fit.intercept+fit.slope*(60+i));
  return {observed,training,test,predictions,error:mae(test,predictions)};
}
