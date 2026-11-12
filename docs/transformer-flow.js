// Arquitectura de un Transformer (encoder y decoder, variante pre-Norm) como figura animada.
// Diagrama propio adaptado de «Transformer, full architecture» de Daniel Voigt Godoy (CC BY 4.0), que antes se mostraba como imagen.
// Explica una estructura: no ejecuta las operaciones.
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const TRANSFORMER_STEPS=[
 ['Entrada','Encoder: convertir la entrada en vectores con posición','La secuencia de entrada se parte en tokens. Cada token se convierte en un vector (<b>embedding</b>) y se le suma la <b>codificación posicional</b>, que indica su lugar. Desde aquí todas las posiciones avanzan a la vez, no una por una.'],
 ['Autoatención','Encoder: cada posición consulta a las demás','Tras normalizar (<b>Norm</b>), el mismo vector se usa tres veces: como consulta <b>Q</b>, clave <b>K</b> y valor <b>V</b>. La <b>autoatención con varias cabezas</b> mezcla la información de toda la secuencia. Después, la <b>suma residual</b> (+) añade lo que entró al subbloque, que viajó por la ruta lateral sin transformarse.'],
 ['Red','Encoder: transformar cada posición y repetir','Otra normalización y una <b>red de avance directo</b> que transforma cada posición por separado, con su suma residual. Los dos subbloques forman una capa que se repite <b>N veces</b>. Una Norm final entrega la <b>memoria del encoder</b>: un vector con contexto por cada posición de la entrada.'],
 ['Decoder','Decoder: leer lo ya generado sin mirar el futuro','La secuencia objetivo entra <b>desplazada una posición</b>: el decoder ve los tokens anteriores y debe predecir el siguiente. Su autoatención lleva una <b>máscara causal</b> que tapa las posiciones futuras, para que no pueda copiar la respuesta.'],
 ['Cruce','Decoder: consultar la entrada con atención cruzada','Aquí se conectan las dos columnas. La consulta <b>Q</b> sale del decoder; las claves <b>K</b> y los valores <b>V</b> llegan desde la memoria del encoder. Así cada posición de la salida decide qué partes de la entrada mirar.'],
 ['Salida','Decoder: transformar y predecir','Una red de avance directo con su suma residual cierra la capa del decoder, que también se repite N veces. La Norm final y una <b>capa lineal</b> convierten cada vector en puntuaciones, una por cada token posible: de ahí sale la <b>predicción</b> del siguiente token.']
];

export const TRANSFORMER_PARTS=[
 ['emb','ink','Embeddings','Convierte cada token en un vector: una lista de números que la red puede comparar y transformar. Se aprende entrenando.'],
 ['pos','teal','Codificación posicional','Señal que se suma a cada embedding para indicar su lugar. Sin ella, la atención no distingue el orden. La onda ilustra una codificación fija; el cuaderno usa posiciones aprendidas.'],
 ['norm','green','Norm','Normalización: mantiene los números de cada posición en una escala estable. En esta variante (pre-Norm) va antes de cada subbloque. No es softmax ni calcula pesos de atención.'],
 ['attn','blue','Autoatención','Cada posición consulta a todas las de su misma secuencia y construye una mezcla ponderada. Varias cabezas lo hacen en paralelo y cada una puede fijarse en una relación distinta.'],
 ['mask','red','Autoatención con máscara','La autoatención del decoder: una máscara causal impide mirar posiciones futuras. Es la pieza que usan los modelos de lenguaje para predecir el siguiente token.'],
 ['cross','violet','Atención cruzada','El decoder consulta la memoria del encoder: Q viene del decoder; K y V, del encoder. Un modelo solo-decoder, como los modelos de lenguaje, no tiene este subbloque.'],
 ['ffn','amber','Red de avance directo','Red pequeña que transforma cada posición por separado después de la atención.'],
 ['res','pink','Suma residual','El + de cada subbloque suma lo que entró con lo que salió. La ruta lateral conserva un camino directo para la información y para el gradiente.'],
 ['head','orange','Capa lineal y predicción','Convierte el vector final de cada posición en puntuaciones de salida. La figura no dibuja el softmax ni la elección del token.'],
 ['notebook','ink','Lo que usa el cuaderno','El clasificador del cuaderno usa solo el encoder (columna izquierda) y una cabeza de clasificación; el decoder no se ejecuta. Además, su encoder coloca Norm después de cada subbloque (post-Norm), no antes.']
];

/* ---------- Geometría (se lee de abajo hacia arriba, como la figura original) ---------- */

const XE=220,XD=540,HALF=95,SIDE=115;
const leaf=(step,part,col,body)=>`<g data-tf-step="${step}" data-tf-part="${part}" data-tf-col="${col}">${body}</g>`;
const poly=(points,cls='tf-line',marker=true)=>`<polyline points="${points.map(p=>p.join(',')).join(' ')}" class="${cls}"${marker?' marker-end="url(#tf-arrow)"':''}/>`;
const block=(cx,top,h,color,main,small)=>`<rect x="${cx-HALF}" y="${top}" width="${HALF*2}" height="${h}" rx="9" class="nf-box nf-b-${color}"/><text x="${cx}" y="${top+(small?h/2-3:h/2+5)}" class="tf-t-main" text-anchor="middle">${main}</text>${small?`<text x="${cx}" y="${top+h/2+13}" class="tf-t-sub" text-anchor="middle">${small}</text>`:''}`;
const plain=(cx,top,h,main,small)=>`<rect x="${cx-HALF}" y="${top}" width="${HALF*2}" height="${h}" rx="9" class="tf-plain"/><text x="${cx}" y="${top+(small?h/2-3:h/2+5)}" class="tf-t-main" text-anchor="middle">${main}</text>${small?`<text x="${cx}" y="${top+h/2+13}" class="tf-t-sub" text-anchor="middle">${small}</text>`:''}`;
const plus=(cx,cy)=>`<circle cx="${cx}" cy="${cy}" r="13" class="tf-plus"/><text x="${cx}" y="${cy+6}" class="tf-t-plus" text-anchor="middle">+</text>`;
const letter=(x,y,t)=>`<text x="${x}" y="${y}" class="tf-t-qkv">${t}</text>`;

// Un subbloque pre-Norm: Norm → operación → suma residual. `from` es el borde superior del elemento anterior.
function subBlock({cx,col,step,from,norm,box,part,color,main,small,sum,fan=true}){
 const split=from-9;
 return leaf(step,'norm',col,poly([[cx,from],[cx,norm+30]])+block(cx,norm,30,'green','Norm'))
  +(fan?leaf(step,part,col,poly([[cx,norm],[cx,norm-10]],'tf-line',false)+poly([[cx-50,norm-10],[cx+50,norm-10]],'tf-line',false)+[-50,0,50].map((d,i)=>poly([[cx+d,norm-10],[cx+d,box+52]])+letter(cx+d+7,norm-20,'VKQ'[i])).join('')):'')
  +leaf(step,part,col,block(cx,box,50,color,main,small)+poly([[cx,box],[cx,sum+13]]))
  +leaf(step,'res',col,poly([[cx,split],[cx+SIDE,split],[cx+SIDE,sum],[cx+15,sum]],'tf-line tf-res')+plus(cx,sum));
}
function inputs(cx,col,step,label,side){
 return leaf(step,'emb',col,`<text x="${cx}" y="830" class="tf-t-io" text-anchor="middle">${label}</text>`+poly([[cx,814],[cx,800]])+plain(cx,760,40,'Embeddings','un vector por token')+poly([[cx,760],[cx,737]]))
  +leaf(step,'pos',col,`<circle cx="${cx+side*70}" cy="724" r="13" class="tf-plus"/><path d="M${cx+side*70-8} 724q4 -9 8 0t8 0" class="tf-wave"/>`+poly([[cx+side*57,724],[cx+side*15,724]])+`<text x="${cx+side*90}" y="720" class="tf-t-sub" text-anchor="${side<0?'end':'start'}">Codificación</text><text x="${cx+side*90}" y="733" class="tf-t-sub" text-anchor="${side<0?'end':'start'}">posicional</text>`+plus(cx,724));
}

export function transformerStage(){
 const enc=inputs(XE,'enc',1,'Secuencia de entrada',-1)
  +subBlock({cx:XE,col:'enc',step:2,from:711,norm:640,box:540,part:'attn',color:'blue',main:'Autoatención',small:'varias cabezas',sum:512})
  +subBlock({cx:XE,col:'enc',step:3,from:499,norm:440,box:370,part:'ffn',color:'amber',main:'Red de avance directo',small:'por posición',sum:342,fan:false})
  +leaf(3,'ffn','enc',poly([[XE,440],[XE,422]]))
  +leaf(3,'norm','enc',poly([[XE,329],[XE,298]])+block(XE,268,30,'green','Norm'));
 const bridge=leaf(3,'cross','bridge',poly([[XE,268],[XE,244],[380,244],[380,414]],'tf-line',false)+`<text x="300" y="237" class="tf-t-sub" text-anchor="middle">memoria del encoder</text>`)+leaf(5,'cross','bridge',poly([[380,414],[XD,414],[XD,392]])+poly([[XD-50,414],[XD-50,392]])+letter(XD-43,408,'V')+letter(XD+7,408,'K'));
 const dec=inputs(XD,'dec',4,'Secuencia objetivo desplazada',1)
  +subBlock({cx:XD,col:'dec',step:4,from:711,norm:640,box:540,part:'mask',color:'red',main:'Autoatención con máscara',small:'no mira el futuro',sum:512})
  +subBlock({cx:XD,col:'dec',step:5,from:499,norm:440,box:340,part:'cross',color:'violet',main:'Atención cruzada',small:'consulta al encoder',sum:312,fan:false})
  +leaf(5,'cross','dec',poly([[XD,440],[XD,428],[XD+50,428],[XD+50,392]])+letter(XD+57,412,'Q'))
  +subBlock({cx:XD,col:'dec',step:6,from:299,norm:240,box:170,part:'ffn',color:'amber',main:'Red de avance directo',small:'por posición',sum:142,fan:false})
  +leaf(6,'ffn','dec',poly([[XD,240],[XD,222]]))
  +leaf(6,'norm','dec',poly([[XD,129],[XD,108]])+block(XD,78,30,'green','Norm'))
  +leaf(6,'head','dec',poly([[XD,78],[XD,64]])+plain(XD,34,30,'Capa lineal')+poly([[XD,34],[XD,22]])+`<text x="${XD}" y="15" class="tf-t-io" text-anchor="middle">Predicciones</text>`);
 const frames=`<rect x="100" y="322" width="250" height="382" rx="22" class="tf-frame tf-frame-enc"/><text x="92" y="508" class="tf-t-io" text-anchor="end">N×</text><text x="92" y="524" class="tf-t-sub" text-anchor="end">capas</text>
  <rect x="420" y="122" width="250" height="582" rx="22" class="tf-frame tf-frame-dec"/><text x="678" y="408" class="tf-t-io">N×</text><text x="678" y="424" class="tf-t-sub">capas</text>
  <text x="92" y="346" class="tf-t-col" text-anchor="end">ENCODER</text><text x="678" y="146" class="tf-t-col">DECODER</text>`;
 return `<div class="nf-scroll"><svg class="nf-svg tf-svg" viewBox="0 0 760 840" role="img" aria-label="Arquitectura de un Transformer: a la izquierda el encoder, con embeddings, codificación posicional, autoatención y red de avance directo; a la derecha el decoder, con autoatención con máscara, atención cruzada sobre la memoria del encoder, red de avance directo, capa lineal y predicciones."><defs><marker id="tf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M0 0L10 5L0 10z" class="nf-f-ink"/></marker></defs>${frames}${enc}${bridge}${dec}<g data-tf-packets></g></svg></div>`;
}

/* ---------- Animación: paquetes que recorren cada paso (milisegundos) ---------- */

const seg=(t0,dur,path,label,kind='data')=>({t0,t1:t0+dur,path,label,kind});
const entry=cx=>[seg(0,500,[[cx,822],[cx,800]],'tokens'),seg(600,600,[[cx,760],[cx,737]],'vectores'),seg(600,600,[[cx+(cx===XE?-57:57),724],[cx+(cx===XE?-15:15),724]],'posición','pos'),seg(1300,500,[[cx,711],[cx,690]],'x')];
function pass(cx,t,from,norm,box,sum,label,fan){
 const split=from-9,items=[seg(t,600,[[cx,split],[cx,norm+30]],'x'),seg(t,2300,[[cx,split],[cx+SIDE,split],[cx+SIDE,sum],[cx+15,sum]],'x','res')];
 if(fan)for(const [d,l] of [[-50,'V'],[0,'K'],[50,'Q']])items.push(seg(t+700,800,[[cx,norm],[cx,norm-10],[cx+d,norm-10],[cx+d,box+52]],l));
 else items.push(seg(t+700,800,[[cx,norm],[cx,box+52]],'x'));
 items.push(seg(t+1600,700,[[cx,box],[cx,sum+13]],label));
 return items;
}
export function transformerSequence(step){
 if(step===1)return entry(XE);
 if(step===2)return pass(XE,0,711,640,540,512,'contexto',true);
 if(step===3)return [...pass(XE,0,499,440,370,342,'x′',false),seg(2500,600,[[XE,329],[XE,298]],'×N'),seg(3200,900,[[XE,268],[XE,244],[380,244],[380,330]],'memoria')];
 if(step===4)return [...entry(XD),...pass(XD,1900,711,640,540,512,'contexto',true)];
 if(step===5){const split=490;return [
  seg(0,600,[[XD,split],[XD,470]],'y'),seg(0,2600,[[XD,split],[XD+SIDE,split],[XD+SIDE,312],[XD+15,312]],'y','res'),
  seg(700,900,[[XD,440],[XD,428],[XD+50,428],[XD+50,392]],'Q'),
  seg(300,1300,[[380,244],[380,414],[XD,414],[XD,392]],'K','mem'),seg(300,1300,[[380,244],[380,414],[XD-50,414],[XD-50,392]],'V','mem'),
  seg(1800,700,[[XD,340],[XD,325]],'mezcla')];}
 return [...pass(XD,0,299,240,170,142,'y′',false),seg(2500,500,[[XD,129],[XD,108]],'×N'),seg(3100,500,[[XD,78],[XD,64]],'y′'),seg(3700,700,[[XD,34],[XD,20]],'siguiente token')];
}

/* ---------- Marcado ---------- */

export function renderTransformerFlow(){
 return `<div class="nf tf" data-tf>
 <div class="nf-steps" role="group" aria-label="Recorrido por la arquitectura">${TRANSFORMER_STEPS.map(([short,long],i)=>`<button type="button" class="nf-step" data-tf-step-button="${i+1}" aria-pressed="${i===0}" title="${esc(long)}"><span>${i+1}</span>${esc(short)}</button>`).join('')}</div>
 <p class="nf-title" data-tf-title><b>1.</b> ${esc(TRANSFORMER_STEPS[0][1])}</p>
 <div class="tf-layout"><div class="nf-out tf-out" data-tf-out>${transformerStage()}</div>
 <div class="tf-side"><div class="nf-actions"><button type="button" class="nf-button is-primary" data-tf-next>Siguiente paso →</button><button type="button" class="nf-button" data-tf-replay>↻ Repetir</button><button type="button" class="nf-button" data-tf-all>▶ Ver todo el recorrido</button></div>
 <p class="nf-reading" data-tf-reading aria-live="polite">${TRANSFORMER_STEPS[0][2]}</p>
 <div class="nf-parts"><b>Partes</b><span class="nf-parts-hint">Pulsa una para ubicarla.</span><div class="nf-part-list">${TRANSFORMER_PARTS.map(([id,color,name])=>`<button type="button" class="nf-part" data-tf-focus="${id}" aria-pressed="false"><span class="nf-dot tf-bg-${color}"></span>${esc(name)}</button>`).join('')}</div><p class="nf-part-text" data-tf-part-text></p></div></div></div>
 </div>`;
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
// Estado de cada pieza: activa en su paso, atenuada si ya pasó, tenue si falta; al elegir una parte solo destaca esa.
export function leafState({step,part,col},current,focus){
 if(focus)return (focus==='notebook'?col==='enc':part===focus)?'is-on':'is-off';
 return step===current?'is-on':step<current?'is-past':'is-off';
}

const mounted=new WeakSet();
export function mountTransformerFlow(root=document){
 for(const fig of root.querySelectorAll('[data-tf]')){
  if(mounted.has(fig))continue;mounted.add(fig);
  const out=fig.querySelector('[data-tf-out]'),reading=fig.querySelector('[data-tf-reading]'),title=fig.querySelector('[data-tf-title]'),partText=fig.querySelector('[data-tf-part-text]'),next=fig.querySelector('[data-tf-next]');
  let step=1,focus=null,frame=null,timer=null,chain=false;
  const still=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const clear=()=>{if(frame)cancelAnimationFrame(frame);if(timer)clearTimeout(timer);frame=timer=null;const layer=out.querySelector('[data-tf-packets]');if(layer)layer.textContent='';};
  const paint=()=>{
   for(const g of out.querySelectorAll('[data-tf-step]'))g.setAttribute('class',leafState({step:Number(g.dataset.tfStep),part:g.dataset.tfPart,col:g.dataset.tfCol},step,focus));
   title.innerHTML=`<b>${step}.</b> ${esc(TRANSFORMER_STEPS[step-1][1])}`;reading.innerHTML=TRANSFORMER_STEPS[step-1][2];
   for(const b of fig.querySelectorAll('[data-tf-step-button]'))b.setAttribute('aria-pressed',String(!focus&&Number(b.dataset.tfStepButton)===step));
   for(const b of fig.querySelectorAll('[data-tf-focus]'))b.setAttribute('aria-pressed',String(b.dataset.tfFocus===focus));
   const info=TRANSFORMER_PARTS.find(p=>p[0]===focus);partText.innerHTML=info?`<b>${esc(info[2])}.</b> ${esc(info[3])}`:'';
   next.textContent=step===6?'↺ Volver al paso 1':'Siguiente paso →';
  };
  const done=()=>{clear();if(chain&&step<6)timer=setTimeout(()=>play(step+1),1200);else chain=false;};
  function play(target){
   clear();step=target;focus=null;paint();
   const layer=out.querySelector('[data-tf-packets]');
   if(still()||typeof requestAnimationFrame!=='function'||!layer){done();return;}
   const items=transformerSequence(step),total=Math.max(...items.map(i=>i.t1));
   const nodes=items.map(item=>{
    const g=document.createElementNS(SVG_NS,'g'),rect=document.createElementNS(SVG_NS,'rect'),text=document.createElementNS(SVG_NS,'text'),w=item.label.length*7.2+18;
    g.setAttribute('class','nf-packet tf-k-'+item.kind);g.style.opacity='0';
    rect.setAttribute('x',-w/2);rect.setAttribute('y',-12);rect.setAttribute('width',w);rect.setAttribute('height',24);rect.setAttribute('rx',12);
    text.setAttribute('y',4.5);text.setAttribute('text-anchor','middle');text.textContent=item.label;
    g.append(rect,text);layer.append(g);return g;
   });
   let start=null;
   const tick=now=>{
    start??=now;const t=now-start;
    items.forEach((item,i)=>{const local=(t-item.t0)/(item.t1-item.t0),g=nodes[i];if(local<0||local>1.2){g.style.opacity='0';return;}const [x,y]=along(item.path,ease(Math.min(1,local)));g.style.opacity='1';g.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);});
    if(t<total+300)frame=requestAnimationFrame(tick);else done();
   };
   frame=requestAnimationFrame(tick);
  }
  fig.addEventListener('click',event=>{
   const pick=event.target.closest?.('[data-tf-step-button]');
   if(pick){chain=false;play(Number(pick.dataset.tfStepButton));return;}
   if(event.target.closest?.('[data-tf-replay]')){chain=false;play(step);return;}
   if(event.target.closest?.('[data-tf-next]')){chain=false;play(step===6?1:step+1);return;}
   if(event.target.closest?.('[data-tf-all]')){chain=true;play(1);return;}
   const partButton=event.target.closest?.('[data-tf-focus]');
   if(partButton){chain=false;clear();focus=focus===partButton.dataset.tfFocus?null:partButton.dataset.tfFocus;paint();}
  });
  paint();
 }
}
