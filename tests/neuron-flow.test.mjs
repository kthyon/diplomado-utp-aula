import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {NEURON_CASE,forward,binaryLoss,trainStep,sigmoid} from '../docs/neuron-flow-model.js';
import {NEURON_STEPS,NEURON_PARTS,neuronStage,neuronReading,neuronSequence,renderNeuronFlow,mountNeuronFlow,nf} from '../docs/neuron-flow.js';

const near=(a,b,e=5e-5)=>assert.ok(Math.abs(a-b)<=e,`${a} ≈ ${b}`);

test('neurona: las cifras de los seis pasos coinciden con la infografía que sustituye',()=>{
 const r=trainStep();
 near(r.before.z,.5,1e-12);near(r.before.p,.6225);near(r.before.loss,.4741);
 near(r.delta,-.3775);near(r.grads.w[0],-.2265);near(r.grads.w[1],-.0755);near(r.grads.b,-.3775);
 near(r.next.w[0],2.0227);near(r.next.w[1],-.9924);near(r.next.b,-.4622);
 near(r.after.z,.5529);near(r.after.p,.6348);near(r.after.loss,.4544);
 assert.ok(r.after.loss<r.before.loss,'un paso baja la pérdida de este ejemplo');
});

test('neurona: δ = p − y es la derivada de la pérdida respecto a z y los gradientes coinciden con diferencias finitas',()=>{
 const c=NEURON_CASE,r=trainStep(),h=1e-6,L=(w,b)=>binaryLoss(forward(c.x,w,b).p,c.y);
 near((L([c.w[0]+h,c.w[1]],c.b)-L([c.w[0]-h,c.w[1]],c.b))/(2*h),r.grads.w[0],1e-7);
 near((L([c.w[0],c.w[1]+h],c.b)-L([c.w[0],c.w[1]-h],c.b))/(2*h),r.grads.w[1],1e-7);
 near((L(c.w,c.b+h)-L(c.w,c.b-h))/(2*h),r.grads.b,1e-7);
 near(sigmoid(0),.5,1e-12);near(binaryLoss(.5,0),Math.log(2),1e-12);
});

test('neurona: cada paso muestra solo lo que ya se calculó',()=>{
 assert.equal(NEURON_STEPS.length,6);
 for(let step=1;step<=6;step++)for(const done of [false,true])assert.ok(!/undefined|NaN|null/.test(neuronStage(step,done)+neuronReading(step)),`paso ${step}`);
 assert.match(neuronStage(1,true),/z = \?[\s\S]*p = \?[\s\S]*L = \?/);
 assert.match(neuronStage(2,true),/z = 0,5<[\s\S]*p = 0,6225[\s\S]*L = \?/);
 assert.match(neuronStage(3,true),/L = 0,4741/);
 assert.doesNotMatch(neuronStage(3,true),/∂L/);assert.match(neuronStage(4,true),/∂L\/∂w₁ = −0,2265[\s\S]*∂L\/∂w₂ = −0,0755[\s\S]*∂L\/∂b = −0,3775/);
 assert.match(neuronStage(5,false),/data-nf-val="w0">2</);assert.match(neuronStage(5,true),/data-nf-val="w0">2,0227<[\s\S]*data-nf-val="w1">−0,9924<[\s\S]*data-nf-val="b">−0,4622</);
 assert.match(neuronStage(6,false),/p = \?/);assert.match(neuronStage(6,true),/z = 0,5529[\s\S]*p = 0,6348[\s\S]*L = 0,4544/);
 assert.match(neuronReading(6),/62,25 % a 63,48 %/);assert.match(neuronReading(5),/2 − 0,1 × \(−0,2265\) = <b>2,0227<\/b>/);
 assert.equal(nf(-.992449),'−0,9924');
});

test('neurona: los pesos se dibujan sobre las conexiones y el gradiente termina en los parámetros, no en las entradas',()=>{
 const stage=neuronStage(2,true);
 for(const [id] of NEURON_PARTS)assert.ok(stage.includes(`data-nf-part="${id}"`),id);
 assert.match(stage,/class="nf-edge"[^>]*>\s*<rect[^>]*class="nf-chip/,'el peso va en la conexión');
 const grad=neuronSequence(4).filter(i=>i.kind==='grad');assert.equal(grad.length,4);
 for(const item of grad)assert.ok(item.path.at(-1)[0]>200,'ningún gradiente llega a las cajas de entrada (x < 192)');
 assert.deepEqual(neuronSequence(5)[0].tween.map(t=>t[0]),['w0','w1','b']);
 assert.ok(neuronSequence(2).every(i=>i.kind==='data')&&neuronSequence(6).length>neuronSequence(2).length);
 assert.deepEqual(neuronSequence(1).map(i=>i.focus),['inputs','label','weights','bias','sum','act','out','loss']);
});

test('neurona: la figura reemplaza a la imagen estática en la biblioteca y funciona sin animación',()=>{
 const app=readFileSync(new URL('../docs/app.js',import.meta.url),'utf8'),html=renderNeuronFlow();
 assert.ok(!app.includes('red-neuronal.webp'));assert.match(app,/renderNeuronFlow\(\)/);assert.match(app,/mountNeuronFlow\(document\)/);
 assert.equal(existsSync(new URL('../docs/assets/red-neuronal.webp',import.meta.url)),false);
 assert.equal((html.match(/data-nf-step=/g)||[]).length,6);assert.equal((html.match(/data-nf-focus-part=/g)||[]).length,NEURON_PARTS.length);
 assert.match(html,/Época:<\/b> una pasada completa por todos los ejemplos de entrenamiento/);
 // Sin requestAnimationFrame (o con movimiento reducido) cada paso salta a su estado final.
 const listeners={},out={innerHTML:''},node=()=>({innerHTML:'',textContent:'',setAttribute(){}}),reading=node(),title=node(),text=node(),next=node();
 const fig={dataset:{},addEventListener:(t,f)=>listeners[t]=f,querySelector:s=>s==='[data-nf-out]'?out:s==='[data-nf-reading]'?reading:s==='[data-nf-title]'?title:s==='[data-nf-part-text]'?text:s==='[data-nf-next]'?next:null,querySelectorAll:()=>[]};
 mountNeuronFlow({querySelectorAll:()=>[fig]});assert.match(out.innerHTML,/Paso 1 de 6/);
 const click=sel=>listeners.click({target:{closest:s=>s===sel.split('=')[0]+']'||s===sel?{dataset:{nfStep:'4',nfFocusPart:'grad'}}:null}});
 click('[data-nf-step]');assert.match(out.innerHTML,/Paso 4 de 6/);assert.match(reading.innerHTML,/δ = p − y = −0,3775/);
 click('[data-nf-next]');assert.match(out.innerHTML,/Paso 5 de 6/);assert.equal(next.textContent,'Siguiente paso →');
});
