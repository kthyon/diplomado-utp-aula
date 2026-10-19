import {initialNetwork,forward,gradients,loss,evaluate} from './lab-models.js';
export {initialNetwork,forward,loss,evaluate};
export function neuronCalculation(net,x,index=0){const products=net.w[index].map((w,i)=>w*x[i]),sum=products.reduce((a,b)=>a+b,net.b[index]);return {products,bias:net.b[index],sum,activation:1/(1+Math.exp(-sum))};}
export function outputUpdate(net){const gradient=EMAILS.reduce((sum,row)=>sum+forward(net,row.x).p-row.y,0)/EMAILS.length;return {before:net.c,gradient,rate:1.2,after:net.c-1.2*gradient};}
export function chooseThreshold(goal='detect'){const options=Array.from({length:101},(_,i)=>({threshold:i/100,...evaluate(i/100)}));return goal==='detect'?options.filter(r=>r.recall===1).sort((a,b)=>a.fp-b.fp||b.threshold-a.threshold)[0]:options.filter(r=>r.fp===0).sort((a,b)=>b.recall-a.recall||a.threshold-b.threshold)[0];}
// Invented examples: fractions of promotional words and links, plus a known label.
export const EMAILS=[{x:[.9,.8],y:1},{x:[.8,.9],y:1},{x:[.7,.7],y:1},{x:[.8,.6],y:1},{x:[.1,.2],y:0},{x:[.2,.1],y:0},{x:[.15,.15],y:0},{x:[.3,.2],y:0}];
export const meanLoss=net=>EMAILS.reduce((sum,r)=>sum+loss(forward(net,r.x).p,r.y),0)/EMAILS.length;
export function trainEpoch(net){
 const all=EMAILS.map(row=>gradients(net,row.x,row.y)),avg=pick=>all.reduce((sum,g)=>sum+pick(g),0)/all.length,rate=1.2;
 return {w:net.w.map((row,j)=>row.map((value,i)=>value-rate*avg(g=>g.w[j][i]))),b:net.b.map((value,j)=>value-rate*avg(g=>g.b[j])),v:net.v.map((value,j)=>value-rate*avg(g=>g.v[j])),c:net.c-rate*avg(g=>g.c)};
}
export const PACKAGES=[{id:'A',length:22,mass:4000,label:'Estándar'},{id:'B',length:24,mass:4500,label:'Estándar'},{id:'C',length:26,mass:4100,label:'Estándar'},{id:'D',length:42,mass:3000,label:'Especial'},{id:'E',length:44,mass:5300,label:'Especial'},{id:'F',length:46,mass:2700,label:'Especial'}];
export function packageNeighbors(query={length:43,mass:4200},scaled=false,unit='g',k=3){
 const divisor=unit==='kg'?1000:1,rows=PACKAGES.map(r=>({...r,mass:r.mass/divisor}));
 const stats=['length','mass'].map(key=>{const mean=rows.reduce((s,r)=>s+r[key],0)/rows.length;return {mean,sd:Math.sqrt(rows.reduce((s,r)=>s+(r[key]-mean)**2,0)/rows.length)};});
 const ranked=rows.map(r=>{const dx=(r.length-query.length)/(scaled?stats[0].sd:1),dy=(r.mass-query.mass/divisor)/(scaled?stats[1].sd:1);return {...r,dx,dy,distance:Math.hypot(dx,dy)};}).sort((a,b)=>a.distance-b.distance||a.id.localeCompare(b.id));
 const selected=ranked.slice(0,k),special=selected.filter(r=>r.label==='Especial').length;
 return {ranked,selected,special,standard:k-special,prediction:special>k/2?'Especial':'Estándar',stats};
}
