// Cálculos de las explicaciones visuales de los encuentros 3 y 4 de Deep Learning.
// Todos los datos son inventados para explicar; las operaciones son las que muestran las figuras.

const sum=values=>values.reduce((a,b)=>a+b,0);
const dot=(a,b)=>sum(a.map((v,i)=>v*b[i]));

/* ---------- Encuentro 3 · Tema 1: memoria recurrente y LSTM ---------- */

// Doce entregas diarias ficticias, en cajas. Doce lecturas es también la ventana del cuaderno.
export const DELIVERIES=[18,24,31,36,38,35,29,22,17,15,19,26];

// Estado recurrente con una regla fija: h_t = conservar·h_(t-1) + (1-conservar)·x_t, con h_0 = 0.
export function recurrentStates(inputs,keep){
 let state=0;
 return inputs.map(x=>state=keep*state+(1-keep)*x);
}

// Cuánto pesa cada lectura en el último estado: (1-conservar)·conservar^(pasos transcurridos).
export function memoryWeights(count,keep){
 return Array.from({length:count},(_,k)=>(1-keep)*keep**(count-1-k));
}

// Un paso de la memoria de una LSTM con compuertas elegidas a mano (en una LSTM real se calculan).
export function lstmStep({previous,candidate,forget,input,output}){
 const memory=forget*previous+input*candidate;
 return {kept:forget*previous,added:input*candidate,memory,shown:output*Math.tanh(memory)};
}

/* ---------- Encuentro 3 · Tema 2: atención ---------- */

export function softmax(scores,temperature=1){
 const scaled=scores.map(s=>s/temperature),top=Math.max(...scaled);
 const exps=scaled.map(s=>Math.exp(s-top)),total=sum(exps);
 return exps.map(e=>e/total);
}

// Cuatro días registrados. Clave = [llovió, hubo mercado]; valor = cajas entregadas.
// Los dos primeros coinciden con el cuaderno: K = [1,0] y [0,1], V = 10 y 20.
export const ATTENTION_DAYS=[
 {name:'Día 1',key:[1,0],value:10},
 {name:'Día 2',key:[0,1],value:20},
 {name:'Día 3',key:[1,1],value:30},
 {name:'Día 4',key:[0,0],value:40}
];

// Atención de producto punto escalado: puntuación = Q·K/√d, pesos = softmax, salida = Σ peso·valor.
export function attention(query,keys,values,temperature=1){
 const scores=keys.map(key=>dot(query,key)/Math.sqrt(query.length));
 const weights=softmax(scores,temperature);
 const contributions=weights.map((w,i)=>w*values[i]);
 return {scores,weights,contributions,output:sum(contributions)};
}

// Autoatención: cada día pregunta con su propia clave. Devuelve la matriz de pesos fila a fila.
export function selfAttention(keys,temperature=1){
 return keys.map(query=>attention(query,keys,keys.map(()=>0),temperature).weights);
}

/* ---------- Encuentro 3 · Tema 3: Transformer ---------- */

// Representación de juguete de un número de 1 a 7 como vector de dos componentes.
export const embedToken=x=>{const angle=(x-1)/6*Math.PI/2;return [1.6*Math.cos(angle),1.6*Math.sin(angle)];};
// Señal de posición: un vector distinto para cada lugar de la secuencia.
export const positionSignal=i=>[0.9*Math.sin(1.4*(i+1)),0.9*Math.cos(1.4*(i+1))];

// Una capa de autoatención sobre la secuencia y un resumen por promedio.
export function encodeSequence(tokens,usePosition){
 const vectors=tokens.map((x,i)=>{const e=embedToken(x),p=usePosition?positionSignal(i):[0,0];return [e[0]+p[0],e[1]+p[1]];});
 const weights=vectors.map(q=>softmax(vectors.map(k=>dot(q,k))));
 const mixed=weights.map(row=>[0,1].map(d=>sum(row.map((w,j)=>w*vectors[j][d]))));
 const summary=[0,1].map(d=>sum(mixed.map(v=>v[d]))/mixed.length);
 return {vectors,weights,mixed,summary};
}

export const sameSummary=(a,b,tolerance=1e-9)=>a.every((v,i)=>Math.abs(v-b[i])<=tolerance);

/* ---------- Encuentro 4: una misma escena para detectar, evaluar y decidir ---------- */

// Escena de 100 × 100 unidades, origen arriba a la izquierda. Cajas [x1, y1, x2, y2].
export const SCENE={
 size:100,
 objects:[
  {id:'O1',cls:'naranja',box:[8,10,36,38]},
  {id:'O2',cls:'naranja',box:[44,14,70,40]},
  {id:'O3',cls:'aguacate',box:[14,52,40,86]},
  {id:'O4',cls:'aguacate',box:[58,54,86,90]},
  {id:'O5',cls:'naranja',box:[74,8,94,28]}
 ],
 proposals:[
  {id:'P1',cls:'naranja',conf:.92,box:[9,11,37,39]},
  {id:'P2',cls:'naranja',conf:.71,box:[5,7,34,36]},
  {id:'P3',cls:'naranja',conf:.48,box:[12,14,41,43]},
  {id:'P4',cls:'naranja',conf:.88,box:[45,15,71,41]},
  {id:'P5',cls:'naranja',conf:.63,box:[41,12,68,37]},
  {id:'P6',cls:'aguacate',conf:.85,box:[15,53,41,87]},
  {id:'P7',cls:'aguacate',conf:.56,box:[11,49,38,82]},
  {id:'P8',cls:'aguacate',conf:.79,box:[59,56,87,91]},
  {id:'P9',cls:'naranja',conf:.41,box:[60,55,85,88]},
  {id:'P10',cls:'naranja',conf:.32,box:[75,9,95,29]},
  {id:'P11',cls:'naranja',conf:.27,box:[28,40,50,60]},
  {id:'P12',cls:'aguacate',conf:.52,box:[68,30,96,58]}
 ]
};

export const boxArea=b=>Math.max(0,b[2]-b[0])*Math.max(0,b[3]-b[1]);
export function overlap(a,b){
 const shared=[Math.max(a[0],b[0]),Math.max(a[1],b[1]),Math.min(a[2],b[2]),Math.min(a[3],b[3])];
 const common=boxArea(shared),union=boxArea(a)+boxArea(b)-common;
 return {shared:common?shared:null,common,union,iou:union?common/union:0};
}
export const iou=(a,b)=>overlap(a,b).iou;

// Supresión de no máximos: por categoría, conserva la de mayor confianza y descarta las que la repiten.
export function suppressDuplicates(proposals,iouLimit=.5){
 const ordered=[...proposals].sort((a,b)=>b.conf-a.conf),kept=[],removed=[];
 for(const candidate of ordered){
  const winner=kept.find(k=>k.cls===candidate.cls&&iou(k.box,candidate.box)>iouLimit);
  if(winner)removed.push({...candidate,duplicateOf:winner.id});else kept.push(candidate);
 }
 return {kept,removed};
}

// Recorrido completo: filtrar por confianza (puntuación > corte, como el cuaderno) y quitar repetidas.
export function detect(scene,confidence,useSuppression=true,iouLimit=.5){
 const passed=scene.proposals.filter(p=>p.conf>confidence);
 const filtered=scene.proposals.filter(p=>p.conf<=confidence);
 const {kept,removed}=useSuppression?suppressDuplicates(passed,iouLimit):{kept:[...passed].sort((a,b)=>b.conf-a.conf),removed:[]};
 return {passed,filtered,kept,removed};
}

// Empareja detecciones con referencias: de mayor a menor confianza, misma categoría e IoU suficiente.
export function matchDetections(detections,objects,minIou=.5){
 const used=new Set(),rows=[];
 for(const d of [...detections].sort((a,b)=>b.conf-a.conf)){
  let best=null;
  for(const o of objects){
   if(used.has(o.id)||o.cls!==d.cls)continue;
   const value=iou(d.box,o.box);
   if(value>=minIou&&(!best||value>best.iou))best={id:o.id,iou:value};
  }
  if(best)used.add(best.id);
  rows.push({...d,match:best?.id??null,iou:best?.iou??0,result:best?'TP':'FP'});
 }
 const missed=objects.filter(o=>!used.has(o.id));
 const tp=rows.filter(r=>r.result==='TP').length,fp=rows.length-tp,fn=missed.length;
 return {rows,missed,tp,fp,fn,precision:tp+fp?tp/(tp+fp):null,recall:tp+fn?tp/(tp+fn):null};
}

export function evaluateScene(scene,confidence,minIou=.5){
 return matchDetections(detect(scene,confidence,true,.5).kept,scene.objects,minIou);
}

// Puntos de la curva precisión-recall al recorrer cortes de confianza.
export function precisionRecallCurve(scene,cuts=Array.from({length:19},(_,i)=>(i+1)*5/100)){
 return cuts.map(cut=>{const r=evaluateScene(scene,cut);return {cut,precision:r.precision,recall:r.recall,tp:r.tp,fp:r.fp,fn:r.fn};});
}

/* ---------- Encuentro 4 · Tema 3: regla de revisión y costes ---------- */

// Los mismos diez granos del cuaderno: puntuación de defecto dada y referencia (1 = defectuoso).
export const REVIEW_UNITS={scores:[.1,.8,.2,.4,.9,.1,.6,.7,.2,.3],defects:[0,1,0,1,1,0,0,1,0,0]};

// Revisar si puntuación ≥ corte. Coste = revisiones·coste de revisar + defectos aceptados·coste de aceptarlos.
export function reviewCost({scores,defects},cut,reviewPrice=1,defectPrice=8){
 const review=scores.map(s=>s>=cut);
 const reviewed=review.filter(Boolean).length;
 const accepted=review.filter((r,i)=>!r&&defects[i]===1).length;
 const needless=review.filter((r,i)=>r&&defects[i]===0).length;
 return {review,reviewed,accepted,needless,reviewTotal:reviewed*reviewPrice,defectTotal:accepted*defectPrice,total:reviewed*reviewPrice+accepted*defectPrice};
}

export function costCurve(units,reviewPrice=1,defectPrice=8,cuts=Array.from({length:21},(_,i)=>i*5/100)){
 return cuts.map(cut=>({cut,...reviewCost(units,cut,reviewPrice,defectPrice)}));
}

export function cheapestCut(units,reviewPrice=1,defectPrice=8){
 return costCurve(units,reviewPrice,defectPrice).reduce((best,p)=>p.total<best.total?p:best);
}
