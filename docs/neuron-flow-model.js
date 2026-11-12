// Una neurona sigmoide con dos entradas: predicción, pérdida, gradientes y un paso de ajuste.
// Los parámetros iniciales se fijaron a mano para el ejemplo; las cuentas son las que muestra la figura.
export const NEURON_CASE={names:['Uniformidad','Manchas'],x:[.6,.2],y:1,w:[2,-1],b:-.5,rate:.1};

export const sigmoid=z=>1/(1+Math.exp(-z));

// Suma ponderada y activación.
export function forward(x,w,b){
 const products=x.map((v,i)=>v*w[i]);
 const z=products.reduce((a,v)=>a+v,b);
 return {products,z,p:sigmoid(z)};
}

// Entropía cruzada binaria para una etiqueta y ∈ {0, 1}.
export const binaryLoss=(p,y)=>-(y*Math.log(p)+(1-y)*Math.log(1-p));

// Un paso completo: predecir, medir, retropropagar, actualizar y volver a predecir.
export function trainStep(c=NEURON_CASE){
 const before=forward(c.x,c.w,c.b);
 const delta=before.p-c.y; // ∂L/∂z para sigmoide con entropía cruzada: (−y/p + (1−y)/(1−p)) · p(1−p) = p − y
 const grads={w:c.x.map(v=>delta*v),b:delta};
 const next={w:c.w.map((v,i)=>v-c.rate*grads.w[i]),b:c.b-c.rate*grads.b};
 const after=forward(c.x,next.w,next.b);
 return {before:{...before,loss:binaryLoss(before.p,c.y)},delta,grads,next,after:{...after,loss:binaryLoss(after.p,c.y)}};
}
