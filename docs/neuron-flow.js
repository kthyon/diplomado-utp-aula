// Figura animada «Cómo aprende una neurona»: muestra las partes y el recorrido de la información en seis pasos.
// Sustituye a la infografía estática red-neuronal.webp. Los valores salen de neuron-flow-model.js.
import {NEURON_CASE,trainStep} from './neuron-flow-model.js?v=neurona-20261112a';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Hasta cuatro decimales, coma decimal y signo menos tipográfico.
export const nf=(v,d=4)=>Number(v).toLocaleString('es-CO',{minimumFractionDigits:0,maximumFractionDigits:d}).replace('-','−');
const pct=v=>Number(v*100).toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2})+' %';
const signed=v=>v<0?`(${nf(v)})`:nf(v);

const C=NEURON_CASE,R=trainStep(C);

export const NEURON_STEPS=[
 ['Datos','Datos y respuesta conocida'],
 ['Predicción','Primera predicción'],
 ['Error','Medir el error'],
 ['Gradientes','Retropropagación: calcular gradientes'],
 ['Ajuste','Optimizador: cambiar parámetros'],
 ['De nuevo','Volver a predecir']
];

export const NEURON_PARTS=[
 ['inputs','blue','Entradas (x₁, x₂)','Los datos que recibe la neurona. Aquí son dos medidas del grano de café, ya convertidas en números; no es la imagen completa.'],
 ['weights','teal','Pesos (w₁, w₂)','Un número por cada entrada: indica cuánto influye y en qué sentido. Un peso positivo empuja la suma hacia arriba; uno negativo, hacia abajo. Se aprenden entrenando.'],
 ['bias','amber','Sesgo (b)','Número que se suma siempre, sin depender de las entradas. Desplaza el punto a partir del cual la neurona responde. También se aprende.'],
 ['sum','violet','Suma ponderada (Σ → z)','Multiplica cada entrada por su peso, suma los resultados y añade el sesgo. Al resultado se le llama z.'],
 ['act','pink','Activación (sigmoide)','Función que transforma z. La sigmoide lleva cualquier número al rango entre 0 y 1.'],
 ['out','orange','Salida (p)','La puntuación que entrega la neurona para la clase «sano». Es una puntuación ilustrativa, no una probabilidad calibrada.'],
 ['label','green','Etiqueta (y)','La respuesta correcta que ya se conoce para este ejemplo. Solo se usa al entrenar.'],
 ['loss','red','Pérdida (L)','Número que mide cuánto se alejó la salida de la etiqueta. Entrenar es ajustar pesos y sesgo para bajarla.'],
 ['grad','magenta','Gradiente','Indica cuánto y en qué sentido cambia la pérdida si se mueve un parámetro. Viaja hacia atrás, de la pérdida a los pesos y al sesgo; nunca cambia las entradas.']
];

/* ---------- Geometría ---------- */

const IN=[{x:16,y:88},{x:16,y:228}],IN_W=176,IN_H=64;
const EDGE=[[[192,120],[392,178]],[[192,260],[392,204]]];
const CHIP=EDGE.map(([a,b])=>[a[0]+(b[0]-a[0])*.38,a[1]+(b[1]-a[1])*.38]);
const SUM=[430,190],BIAS={x:352,y:30,w:156,h:44},ACT={x:548,y:148,w:104,h:84},OUT={x:718,y:158,w:186,h:64},LOSS={x:718,y:298,w:186,h:64},LABEL={x:500,y:298,w:170,h:64};
const sub=['₁','₂'];
const actPoint=z=>[ACT.x+8+(Math.max(-4,Math.min(4,z))+4)/8*(ACT.w-16),ACT.y+ACT.h-8-1/(1+Math.exp(-z))*(ACT.h-16)];
const curve=Array.from({length:33},(_,i)=>actPoint(-4+i/4).map(v=>v.toFixed(1)).join(',')).join(' ');

// Qué se sabe en cada momento: paso 1 a 6, antes (done = false) o después (done = true) de su animación.
function view(step,done){
 const updated=step>5||(step===5&&done),again=step===6;
 const w=updated?R.next.w:C.w,b=updated?R.next.b:C.b;
 const run=again?(done?R.after:null):(step>2||(step===2&&done))?R.before:null;
 const loss=again?(done?R.after.loss:null):(step>3||(step===3&&done))?R.before.loss:null;
 const grads=(step===4&&done)||step===5;
 return {w,b,run,loss,grads,again};
}
const ACTIVE={1:['inputs','label'],2:['inputs','weights','bias','sum','act','out'],3:['out','label','loss'],4:['loss','weights','bias','grad'],5:['weights','bias','grad'],6:['inputs','weights','bias','sum','act','out','label','loss']};

/* ---------- Dibujo ---------- */

const part=(name,step,body)=>`<g data-nf-part="${name}" class="${ACTIVE[step].includes(name)?'is-active':''}">${body}</g>`;
const arrow=(a,b,cls='nf-flow')=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="${cls}" marker-end="url(#${cls==='nf-back'?'nf-arrow-back':'nf-arrow'})"/>`;
const box=(o,color,small,big,extra='')=>`<rect x="${o.x}" y="${o.y}" width="${o.w??IN_W}" height="${o.h??IN_H}" rx="12" class="nf-box nf-b-${color}"/><text x="${o.x+(o.w??IN_W)/2}" y="${o.y+23}" class="nf-t-small" text-anchor="middle">${small}</text><text x="${o.x+(o.w??IN_W)/2}" y="${o.y+48}" class="nf-t-big" text-anchor="middle">${big}</text>${extra}`;
const bean=`<g class="nf-bean" aria-hidden="true"><ellipse cx="104" cy="190" rx="24" ry="16" transform="rotate(-18 104 190)" fill="#6b3f22"/><path d="M84 196q20 -2 22 -8t18 -6" fill="none" stroke="#3b2110" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="96" cy="183" rx="7" ry="3" transform="rotate(-18 96 183)" fill="#a8703f" opacity=".7"/></g>`;

export function neuronStage(step=1,done=true){
 const v=view(step,done),q='?';
 const inputs=C.x.map((x,i)=>box(IN[i],'blue',C.names[i],`x${sub[i]} = ${nf(x)}`)).join('')+bean;
 const weights=EDGE.map(([a,b],i)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="nf-edge" stroke-width="${(2+Math.abs(v.w[i])*1.6).toFixed(1)}" marker-end="url(#nf-arrow)"/><rect x="${CHIP[i][0]-68}" y="${CHIP[i][1]-16}" width="136" height="32" rx="16" class="nf-chip nf-b-teal"/><text x="${CHIP[i][0]}" y="${CHIP[i][1]+5}" class="nf-t-strong" text-anchor="middle">× w${sub[i]} = <tspan data-nf-val="w${i}">${nf(v.w[i])}</tspan></text>${v.run&&step!==4&&step!==5?`<text x="362" y="${i?232:158}" class="nf-t-strong nf-tc-teal" text-anchor="middle">${nf(v.run.products[i])}</text>`:''}`).join('');
 const bias=`<rect x="${BIAS.x}" y="${BIAS.y}" width="${BIAS.w}" height="${BIAS.h}" rx="12" class="nf-box nf-b-amber"/><text x="${BIAS.x+BIAS.w/2}" y="${BIAS.y+28}" class="nf-t-strong" text-anchor="middle">sesgo b = <tspan data-nf-val="b">${nf(v.b)}</tspan></text>${arrow([SUM[0],BIAS.y+BIAS.h],[SUM[0],SUM[1]-40])}`;
 const sum=`<circle cx="${SUM[0]}" cy="${SUM[1]}" r="38" class="nf-node nf-b-violet"/><text x="${SUM[0]}" y="${SUM[1]+13}" class="nf-t-sigma" text-anchor="middle">Σ</text><text x="${SUM[0]}" y="${SUM[1]+62}" class="nf-t-strong nf-tc-violet" text-anchor="middle">z = ${v.run?nf(v.run.z):q}</text>${arrow([SUM[0]+38,SUM[1]],[ACT.x-2,SUM[1]])}`;
 const dot=v.run?actPoint(v.run.z):null;
 const act=`<text x="${ACT.x+ACT.w/2}" y="${ACT.y-10}" class="nf-t-small nf-tc-pink" text-anchor="middle">sigmoide(z)</text><rect x="${ACT.x}" y="${ACT.y}" width="${ACT.w}" height="${ACT.h}" rx="12" class="nf-box nf-b-pink"/><line x1="${ACT.x+8}" y1="${ACT.y+ACT.h-8}" x2="${ACT.x+ACT.w-8}" y2="${ACT.y+ACT.h-8}" class="nf-axis"/><polyline points="${curve}" class="nf-curve"/>${dot?`<circle cx="${dot[0].toFixed(1)}" cy="${dot[1].toFixed(1)}" r="5.5" class="nf-f-pink"/>`:''}${arrow([ACT.x+ACT.w,SUM[1]],[OUT.x-2,SUM[1]])}`;
 const out=box(OUT,'orange','puntuación de «sano»',`p = ${v.run?nf(v.run.p):q}`)+arrow([OUT.x+OUT.w/2,OUT.y+OUT.h],[LOSS.x+LOSS.w/2,LOSS.y-2]);
 const label=box(LABEL,'green','Etiqueta: sano',`y = ${C.y}`)+arrow([LABEL.x+LABEL.w,LABEL.y+LABEL.h/2],[LOSS.x-2,LOSS.y+LOSS.h/2]);
 const loss=box(LOSS,'red','Pérdida',`L = ${v.loss===null?q:nf(v.loss)}`);
 // El gradiente regresa por un carril propio, paralelo a las flechas de ida, y termina en los parámetros.
 const backVisible=step===4||step===5;
 const back=backVisible?[
  arrow([LOSS.x+LOSS.w/2-26,LOSS.y-2],[OUT.x+OUT.w/2-26,OUT.y+OUT.h+2],'nf-back'),
  arrow([OUT.x-2,SUM[1]+14],[ACT.x+ACT.w+2,SUM[1]+14],'nf-back'),
  arrow([ACT.x-2,SUM[1]+14],[SUM[0]+40,SUM[1]+14],'nf-back'),
  arrow([SUM[0]+14,SUM[1]-40],[SUM[0]+14,BIAS.y+BIAS.h+2],'nf-back'),
  ...EDGE.map(([a,b],i)=>arrow([b[0]+2,b[1]+(i?16:-16)],[CHIP[i][0]+50,CHIP[i][1]+(i?19:-19)],'nf-back'))
 ].join('')+(v.grads?`<text x="${CHIP[0][0]}" y="${CHIP[0][1]-26}" class="nf-t-small nf-tc-magenta" text-anchor="middle">∂L/∂w₁ = ${nf(R.grads.w[0])}</text><text x="${CHIP[1][0]}" y="${CHIP[1][1]+36}" class="nf-t-small nf-tc-magenta" text-anchor="middle">∂L/∂w₂ = ${nf(R.grads.w[1])}</text><text x="${BIAS.x-8}" y="${BIAS.y+28}" class="nf-t-small nf-tc-magenta" text-anchor="end">∂L/∂b = ${nf(R.grads.b)}</text><text x="${ACT.x-6}" y="${SUM[1]+36}" class="nf-t-small nf-tc-magenta" text-anchor="end">δ = ${nf(R.delta)}</text>`:''):'';
 const summary=`Paso ${step} de 6, ${NEURON_STEPS[step-1][1]}. Pesos ${nf(v.w[0])} y ${nf(v.w[1])}, sesgo ${nf(v.b)}${v.run?`, z ${nf(v.run.z)}, salida ${nf(v.run.p)}`:''}${v.loss===null?'':`, pérdida ${nf(v.loss)}`}.`;
 return `<div class="nf-scroll"><svg class="nf-svg" viewBox="0 0 920 384" role="img" aria-label="${esc(summary)}"><defs><marker id="nf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" orient="auto"><path d="M0 0L10 5L0 10z" class="nf-f-ink"/></marker><marker id="nf-arrow-back" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" orient="auto"><path d="M0 0L10 5L0 10z" class="nf-f-magenta"/></marker></defs>
 ${part('inputs',step,inputs)}${part('weights',step,weights)}${part('bias',step,bias)}${part('sum',step,sum)}${part('act',step,act)}${part('out',step,out)}${part('label',step,label)}${part('loss',step,loss)}${part('grad',step,back)}<g data-nf-packets></g></svg></div>`;
}

/* ---------- Lectura de cada paso ---------- */

export function neuronReading(step=1){
 const b=R.before,a=R.after;
 return [
  `Un grano de café descrito con dos medidas ya extraídas (no es la imagen completa): uniformidad <b>x₁ = ${nf(C.x[0])}</b> y manchas <b>x₂ = ${nf(C.x[1])}</b>. La etiqueta trae la respuesta correcta: sano, <b>y = ${C.y}</b>. Los pesos y el sesgo iniciales se fijaron a mano para el ejemplo.`,
  `Cada entrada se multiplica por su peso y se suma el sesgo: z = ${nf(C.w[0])} × ${nf(C.x[0])} + ${signed(C.w[1])} × ${nf(C.x[1])} + ${signed(C.b)} = <b>${nf(b.z)}</b>. La sigmoide convierte z en una puntuación entre 0 y 1: <b>p = ${nf(b.p)}</b>.`,
  `La pérdida compara la puntuación con la etiqueta. Se usa entropía cruzada binaria; como y = 1, L = −ln(p) = −ln(${nf(b.p)}) = <b>${nf(b.loss)}</b>. Cuanto más cerca esté p de 1, menor es la pérdida.`,
  `La retropropagación recorre la neurona hacia atrás para saber cuánto influyó cada parámetro en la pérdida. Para esta pérdida y esta sigmoide, a la suma llega <b>δ = p − y = ${nf(R.delta)}</b>. El gradiente de cada peso es δ por su entrada: <b>${nf(R.grads.w[0])}</b> y <b>${nf(R.grads.w[1])}</b>; el del sesgo es δ: <b>${nf(R.grads.b)}</b>. Los gradientes llegan a los parámetros, no a las entradas: los datos no se cambian.`,
  `El optimizador (descenso de gradiente con tasa α = ${nf(C.rate)}) mueve cada parámetro en contra de su gradiente: nuevo valor = valor anterior − α × gradiente. w₁ = ${nf(C.w[0])} − ${nf(C.rate)} × ${signed(R.grads.w[0])} = <b>${nf(R.next.w[0])}</b>; w₂ = ${nf(C.w[1])} − ${nf(C.rate)} × ${signed(R.grads.w[1])} = <b>${nf(R.next.w[1])}</b>; b = ${nf(C.b)} − ${nf(C.rate)} × ${signed(R.grads.b)} = <b>${nf(R.next.b)}</b>.`,
  `Con los parámetros nuevos: z = <b>${nf(a.z)}</b>, p = <b>${nf(a.p)}</b> y L = <b>${nf(a.loss)}</b>. La puntuación de «sano» pasó de ${pct(b.p)} a ${pct(a.p)} y la pérdida bajó de ${nf(b.loss)} a ${nf(a.loss)}. Este paso mejora el ajuste a este ejemplo; la generalización se comprueba con datos de prueba.`
 ][step-1];
}

/* ---------- Animación: qué viaja, por dónde y cuándo (milisegundos) ---------- */

function forwardPackets(w,b,run){
 const items=[];
 EDGE.forEach(([a,e],i)=>{items.push({t0:0,t1:800,path:[a,CHIP[i]],label:nf(C.x[i]),kind:'data'},{t0:800,t1:1600,path:[CHIP[i],e],label:`= ${nf(run.products[i])}`,kind:'data'});});
 items.push({t0:800,t1:1600,path:[[SUM[0],BIAS.y+BIAS.h],[SUM[0],SUM[1]-40]],label:nf(b),kind:'data'},
  {t0:1750,t1:2500,path:[[SUM[0]+38,SUM[1]],[ACT.x,SUM[1]]],label:`z = ${nf(run.z)}`,kind:'data'},
  {t0:2650,t1:3400,path:[[ACT.x+ACT.w,SUM[1]],[OUT.x+OUT.w/2,SUM[1]]],label:`p = ${nf(run.p)}`,kind:'data'});
 return items;
}
const lossPackets=run=>[{t0:0,t1:900,path:[[OUT.x+OUT.w/2,OUT.y+OUT.h],[LOSS.x+LOSS.w/2,LOSS.y+10]],label:`p = ${nf(run.p)}`,kind:'data'},{t0:0,t1:900,path:[[LABEL.x+LABEL.w,LABEL.y+LABEL.h/2],[LOSS.x+30,LOSS.y+LOSS.h/2]],label:`y = ${C.y}`,kind:'data'}];
export function neuronSequence(step){
 if(step===1)return ['inputs','label','weights','bias','sum','act','out','loss'].map((name,i)=>({t0:i*700,t1:(i+1)*700,focus:name}));
 if(step===2)return forwardPackets(C.w,C.b,R.before);
 if(step===3)return lossPackets(R.before);
 if(step===4)return [
  {t0:0,t1:1900,path:[[LOSS.x+LOSS.w/2,LOSS.y],[OUT.x+OUT.w/2,SUM[1]],[ACT.x+ACT.w/2,SUM[1]],[SUM[0],SUM[1]]],label:`δ = ${nf(R.delta)}`,kind:'grad'},
  ...EDGE.map(([,e],i)=>({t0:2000,t1:2900,path:[e,CHIP[i]],label:nf(R.grads.w[i]),kind:'grad'})),
  {t0:2000,t1:2900,path:[[SUM[0],SUM[1]-40],[SUM[0],BIAS.y+BIAS.h/2]],label:nf(R.grads.b),kind:'grad'}];
 if(step===5)return [{t0:0,t1:1600,tween:[['w0',C.w[0],R.next.w[0]],['w1',C.w[1],R.next.w[1]],['b',C.b,R.next.b]]}];
 return [...forwardPackets(R.next.w,R.next.b,R.after),...lossPackets(R.after).map(p=>({...p,t0:p.t0+3500,t1:p.t1+3500}))];
}

/* ---------- Marcado ---------- */

export function renderNeuronFlow(){
 return `<figure class="nf" data-nf>
 <figcaption>Cómo aprende una neurona: sus partes y un ajuste paso a paso <small>Clasificar café con una neurona · ejemplo numérico</small></figcaption>
 <div class="nf-steps" role="group" aria-label="Pasos del ajuste">${NEURON_STEPS.map(([short,long],i)=>`<button type="button" class="nf-step" data-nf-step="${i+1}" aria-pressed="${i===0}" title="${esc(long)}"><span>${i+1}</span>${esc(short)}</button>`).join('')}</div>
 <p class="nf-title" data-nf-title><b>1.</b> ${esc(NEURON_STEPS[0][1])}</p>
 <div class="nf-out" data-nf-out>${neuronStage(1,true)}</div>
 <div class="nf-actions"><button type="button" class="nf-button" data-nf-replay>↻ Repetir este paso</button><button type="button" class="nf-button is-primary" data-nf-next>Siguiente paso →</button><button type="button" class="nf-button" data-nf-all>▶ Ver los seis pasos seguidos</button></div>
 <p class="nf-reading" data-nf-reading aria-live="polite">${neuronReading(1)}</p>
 <div class="nf-parts"><b>Partes de la neurona</b><span class="nf-parts-hint">Pulsa una para ubicarla en el dibujo.</span><div class="nf-part-list">${NEURON_PARTS.map(([id,color,name])=>`<button type="button" class="nf-part" data-nf-focus-part="${id}" aria-pressed="false"><span class="nf-dot nf-bg-${color}"></span>${esc(name)}</button>`).join('')}</div><p class="nf-part-text" data-nf-part-text></p></div>
 <ul class="nf-notes"><li>En una red con varias capas, el gradiente recorre las conexiones hacia atrás, capa por capa.</li><li>Durante la inferencia solo se calcula la predicción (pasos 1 y 2), sin actualizar los pesos.</li><li><b>Lote:</b> ejemplos usados en una actualización. <b>Época:</b> una pasada completa por todos los ejemplos de entrenamiento.</li></ul>
 </figure>`;
}

/* ---------- Interacción ---------- */

const SVG_NS='http://www.w3.org/2000/svg';
const ease=t=>t<.5?2*t*t:1-(-2*t+2)**2/2;
function along(path,t){
 const lengths=path.slice(1).map((p,i)=>Math.hypot(p[0]-path[i][0],p[1]-path[i][1])),total=lengths.reduce((a,b)=>a+b,0);
 let left=t*total;
 for(let i=0;i<lengths.length;i++){if(left<=lengths[i]||i===lengths.length-1){const f=lengths[i]?Math.min(1,left/lengths[i]):0;return [path[i][0]+(path[i+1][0]-path[i][0])*f,path[i][1]+(path[i+1][1]-path[i][1])*f];}left-=lengths[i];}
 return path.at(-1);
}

const mounted=new WeakSet();
export function mountNeuronFlow(root=document){
 for(const fig of root.querySelectorAll('[data-nf]')){
  if(mounted.has(fig))continue;mounted.add(fig);
  const out=fig.querySelector('[data-nf-out]'),reading=fig.querySelector('[data-nf-reading]'),title=fig.querySelector('[data-nf-title]'),partText=fig.querySelector('[data-nf-part-text]');
  let step=1,frame=null,timer=null,chain=false;
  const still=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const stop=()=>{if(frame)cancelAnimationFrame(frame);if(timer)clearTimeout(timer);frame=timer=null;};
  const focus=name=>{if(name)fig.dataset.nfFocus=name;else delete fig.dataset.nfFocus;
   for(const b of fig.querySelectorAll('[data-nf-focus-part]'))b.setAttribute('aria-pressed',String(b.dataset.nfFocusPart===name));
   const info=NEURON_PARTS.find(p=>p[0]===name);partText.innerHTML=info?`<b>${esc(info[2])}.</b> ${esc(info[3])}`:'';};
  const show=done=>{
   out.innerHTML=neuronStage(step,done);
   title.innerHTML=`<b>${step}.</b> ${esc(NEURON_STEPS[step-1][1])}`;
   reading.innerHTML=done?neuronReading(step):'…';
   for(const b of fig.querySelectorAll('[data-nf-step]'))b.setAttribute('aria-pressed',String(Number(b.dataset.nfStep)===step));
   const next=fig.querySelector('[data-nf-next]');next.textContent=step===6?'↺ Volver al paso 1':'Siguiente paso →';
  };
  const finish=()=>{stop();focus(null);show(true);if(chain&&step<6)timer=setTimeout(()=>play(step+1),1400);else chain=false;};
  function play(target){
   stop();step=target;focus(null);
   if(still()||typeof requestAnimationFrame!=='function'){finish();return;}
   show(false);
   const items=neuronSequence(step),total=Math.max(...items.map(i=>i.t1)),layer=out.querySelector('[data-nf-packets]');
   const nodes=items.map(item=>{
    if(!item.path)return null;
    const g=document.createElementNS(SVG_NS,'g'),rect=document.createElementNS(SVG_NS,'rect'),text=document.createElementNS(SVG_NS,'text'),w=item.label.length*7.6+22;
    g.setAttribute('class','nf-packet nf-k-'+item.kind);g.style.opacity='0';
    rect.setAttribute('x',-w/2);rect.setAttribute('y',-14);rect.setAttribute('width',w);rect.setAttribute('height',28);rect.setAttribute('rx',14);
    text.setAttribute('y',5);text.setAttribute('text-anchor','middle');text.textContent=item.label;
    g.append(rect,text);layer.append(g);return g;
   });
   let start=null,current=null;
   const tick=now=>{
    start??=now;const t=now-start;
    items.forEach((item,i)=>{
     const local=(t-item.t0)/(item.t1-item.t0);
     if(item.path){const g=nodes[i];if(local<0||local>1.25){g.style.opacity='0';return;}const [x,y]=along(item.path,ease(Math.min(1,local)));g.style.opacity='1';g.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);}
     else if(item.focus){if(local>=0&&local<1&&current!==item.focus){current=item.focus;focus(item.focus);}}
     else if(item.tween&&local>=0){const f=ease(Math.min(1,local));for(const [key,from,to] of item.tween){const node=out.querySelector(`[data-nf-val="${key}"]`);if(node)node.textContent=nf(from+(to-from)*f);}}
    });
    if(t<total+350)frame=requestAnimationFrame(tick);else finish();
   };
   frame=requestAnimationFrame(tick);
  }
  fig.addEventListener('click',event=>{
   const pick=event.target.closest?.('[data-nf-step]');
   if(pick){chain=false;play(Number(pick.dataset.nfStep));return;}
   if(event.target.closest?.('[data-nf-replay]')){chain=false;play(step);return;}
   if(event.target.closest?.('[data-nf-next]')){chain=false;play(step===6?1:step+1);return;}
   if(event.target.closest?.('[data-nf-all]')){chain=true;play(1);return;}
   const partButton=event.target.closest?.('[data-nf-focus-part]');
   if(partButton){chain=false;stop();if(partButton.dataset.nfFocusPart==='grad'&&step!==4&&step!==5)step=4;show(true);focus(fig.dataset.nfFocus===partButton.dataset.nfFocusPart?null:partButton.dataset.nfFocusPart);}
  });
  show(true);
 }
}
