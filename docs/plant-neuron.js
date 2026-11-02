import {initialPlantNeuron,plantForward,plantUpdate,PLANT_EXAMPLES} from './plant-neuron-model.js?v=planta-20261102';

const fmt=(n,d=2)=>Number(n).toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
const action=n=>n?'Regar':'No regar';
const signed=n=>(n>=0?'+':'−')+fmt(Math.abs(n),3);
const STEPS=['Leer sensores','Multiplicar y sumar','Decidir','Comparar','Devolver el ajuste','Aprender'];
const copy=m=>({w:[...m.w],b:m.b});
const button=(id,label,cls='')=>`<button type="button" class="ll-button ${cls}" id="${id}">${label}</button>`;

function plantDrawing(x,watering){
 return `<svg class="pn-plant" viewBox="0 0 300 270" role="img" aria-label="Planta con suelo ${fmt(x[0]*100,0)} por ciento seco. Válvula ${watering?'abierta: riego simulado':'cerrada'}">
 <defs><linearGradient id="pn-pot" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e5b391"/><stop offset="1" stop-color="#b8714c"/></linearGradient><linearGradient id="pn-leaf"><stop stop-color="#a4c986"/><stop offset="1" stop-color="#477e54"/></linearGradient></defs>
 <ellipse cx="146" cy="246" rx="90" ry="9" fill="currentColor" opacity=".06"/>
 <path d="M150 178 Q141 124 151 61" fill="none" stroke="#527b48" stroke-width="7" stroke-linecap="round"/>
 <path d="M147 135 Q94 139 89 91 Q139 84 147 135M148 108 Q202 107 212 59 Q162 60 148 108M151 74 Q120 55 134 22 Q166 42 151 74" fill="url(#pn-leaf)"/>
 <path d="M96 98l48 33m60-63l-52 38" stroke="#47774d" stroke-width="2" opacity=".6" fill="none"/>
 <path d="M86 179h126l-16 61H101Z" fill="url(#pn-pot)"/><ellipse cx="149" cy="179" rx="63" ry="15" fill="#ab744e"/>
 <ellipse cx="149" cy="179" rx="54" ry="10" fill="${x[0]>.6?'#a88962':'#5e4936'}"/>
 <path d="M238 37v56h-24" fill="none" stroke="#8ca5ad" stroke-width="10" stroke-linecap="round"/><circle cx="238" cy="53" r="13" fill="${watering?'#308b77':'#87949a'}"/><path d="M232 53h12" stroke="white" stroke-width="3"/>
 ${watering?[0,1,2].map(i=>`<path class="pn-drop pn-drop-${i}" d="M214 109q-12 16 0 17q12-1 0-17" fill="#3e9ec3"/>`).join(''):''}
 <path d="M63 148v46" stroke="#397ca4" stroke-width="5" stroke-linecap="round"/><circle cx="63" cy="145" r="10" fill="#d7eafa" stroke="#397ca4" stroke-width="2"/>
 <text x="150" y="265" text-anchor="middle">${watering?'Válvula abierta · simulación':'Válvula cerrada'}</text></svg>`;
}

function diagram(x,m,r,step,pending,mobile=false,target=1){
 const s=mobile?{w:390,h:850,a:[88,66],b:[300,66],sum:[194,287],bias:[305,215],act:[194,448],out:[194,625]}:{w:1000,h:410,a:[104,91],b:[104,267],sum:[435,181],bias:[435,49],act:[681,181],out:[891,181]};
 const forward=step===1||step===5,back=step===4;
 const ink=c=>({'#397ca4':'var(--pn-blue)','#be681e':'var(--pn-orange)','#8455ad':'var(--pn-purple)','#278071':'var(--pn-green)','#bf3978':'var(--pn-pink)'}[c]);
 const paths=mobile?['M88 100 V160 Q88 200 159 260','M300 100 V160 Q300 200 229 260','M194 327 V413','M194 483 V585']:['M144 91 C245 91 287 141 390 168','M144 267 C245 267 287 220 390 193','M480 181 H637','M725 181 H847'];
 const biasPath=mobile?'M305 250 Q305 268 232 274':'M435 76 V137';
 const reverse=mobile?'M114 755 H26 V287 H150':'M811 311 H435 V224';
 const reverseWeights=mobile?['M155 287 L88 162','M233 287 L300 162']:['M390 178 C287 141 245 91 206 91','M390 193 C287 220 245 267 206 267'];
 const wire=(d,color,active,payload='',delay=0)=>`<path d="${d}" fill="none" stroke="${ink(color)}" stroke-width="${active?4:2}" opacity="${active?1:.45}" marker-end="url(#pn-arrow-${color.slice(1)})"/>${active?`<g class="pn-packet" opacity="0"><set attributeName="opacity" to="1" begin="${delay}s" dur="2s"/><circle r="7" fill="${ink(color)}"/>${payload?`<text x="0" y="-13" text-anchor="middle" class="pn-payload" style="fill:${ink(color)}">${payload}</text>`:''}<animateMotion begin="${delay}s" dur="2s" repeatCount="1" path="${d}"/></g>`:''}`;
 const text=(cx,cy,content,cls='')=>`<text x="${cx}" y="${cy}" text-anchor="middle" class="${cls}">${content}</text>`;
 const node=(pos,title,value,color,active,sub='')=>`<g><rect x="${pos[0]-43}" y="${pos[1]-37}" width="86" height="74" rx="20" fill="var(--paper)" stroke="${ink(color)}" stroke-width="${active?3:1.5}"/>${text(pos[0],pos[1]-9,title,'pn-node-title')}${text(pos[0],pos[1]+17,value,'pn-node-value')}${sub?text(pos[0],pos[1]+61,sub,'pn-node-sub'):''}</g>`;
 const badge=(cx,cy,str,color)=>`<rect x="${cx-67}" y="${cy-17}" width="134" height="34" rx="12" fill="var(--paper)" stroke="${ink(color)}"/>${text(cx,cy+5,str,'pn-edge-label')}`;
 return `<svg class="pn-diagram ${mobile?'pn-mobile':'pn-desktop'}" viewBox="0 0 ${s.w} ${s.h}" role="img" aria-label="${back?'Regreso en magenta: el gradiente calcula cambios de pesos y bias; los sensores no cambian.':`Ida: sequedad ${fmt(x[0])} por peso ${fmt(m.w[0])}; calor ${fmt(x[1])} por peso ${fmt(m.w[1])}; sumamos bias ${fmt(m.b)}. Suma ${fmt(r.z)}, salida ${fmt(r.p)}: ${action(r.decision)}.`}">
 <defs>${['#397ca4','#be681e','#8455ad','#278071','#bf3978'].map(c=>`<marker id="pn-arrow-${c.slice(1)}${mobile?'m':''}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1L9 5L0 9Z" fill="${ink(c)}"/></marker>`).join('')}</defs>
 ${mobile?'<rect x="111" y="240" width="168" height="270" rx="28" class="pn-neuron-boundary"/>':'<rect x="369" y="128" width="362" height="144" rx="28" class="pn-neuron-boundary"/>'}
 ${wire(paths[0],'#397ca4',forward,fmt(r.contributions[0]))}${wire(paths[1],'#be681e',forward,fmt(r.contributions[1]))}${wire(biasPath,'#8455ad',forward,fmt(m.b))}${wire(paths[2],'#278071',step===2||step===5,fmt(r.z),step===5?2:0)}${wire(paths[3],'#278071',step===2||step===5,fmt(r.p),step===5?4:2)}
 ${(step===3||step===4)?wire(mobile?'M194 695 V715':'M891 248 V272','#bf3978',step===3,fmt(r.p)):''}
 ${back?wire(reverse,'#bf3978',true,fmt(pending.error,3))+reverseWeights.map((d,i)=>wire(d,'#bf3978',true,'g = '+fmt(pending.gradients.w[i],3),2)).join('')+wire(mobile?'M194 250 L272 230':'M435 137 V78','#bf3978',true,'g = '+fmt(pending.gradients.b,3),2):''}
 ${node(s.a,'Sequedad',fmt(x[0]),'#397ca4',true)}${node(s.b,'Calor',fmt(x[1]),'#be681e',true)}
 ${badge(mobile?88:250,mobile?151:91,`× ${fmt(m.w[0])} = ${fmt(r.contributions[0])}`,'#397ca4')}
 ${badge(mobile?300:250,mobile?151:267,`× ${fmt(m.w[1])} = ${fmt(r.contributions[1])}`,'#be681e')}
 ${node(s.bias,'Bias · b',fmt(m.b),'#8455ad',step>=1)}
 ${node(s.sum,'Suma · z',fmt(r.z),'#8455ad',step>=1)}
 ${node(s.act,'Sigmoide',fmt(r.p),'#278071',step>=2,'Convierte z a 0–1')}
 ${node(s.out,r.decision?'REGAR':'NO REGAR',fmt(r.p*100,0)+' / 100','#278071',step>=2,'Corte fijo: 50 / 100')}
 ${mobile?text(194,24,'1 · Datos de los sensores','pn-heading')+text(194,383,'2 · La suma entra a la activación','pn-small')+text(194,544,'3 · La puntuación produce una decisión','pn-small'):text(104,26,'1 · Entradas','pn-heading')+text(435,110,'2 · Combinar','pn-heading')+text(681,86,'3 · Activar','pn-heading')+text(891,86,'4 · Decidir','pn-heading')}
 ${text(mobile?194:555,mobile?528:290,'Una neurona: suma + activación','pn-neuron-label')}
 ${(step===3||step===4)?`<rect x="${mobile?114:811}" y="${mobile?718:274}" width="160" height="74" rx="16" class="pn-compare-node"/>${text(mobile?194:891,mobile?741:297,`Compara · etiqueta ${target}`,'pn-node-title')}${text(mobile?194:891,mobile?768:324,`p − y = ${fmt(pending.error,3)}`,'pn-compare-value')}`:''}
 ${back?text(mobile?194:664,mobile?824:390,`REGRESO · p − y = ${fmt(pending.error,3)}`,'pn-back-text'):''}
 </svg>`.replace(/url\(#pn-arrow-([a-f0-9]+)\)/g,(_,c)=>`url(#pn-arrow-${c}${mobile?'m':''})`);
}

function markup(){return `<section class="pn-lab"><div class="ll-kicker">01 · UNA NEURONA, UNA DECISIÓN</div><h2 class="ll-title">¿Regamos la planta?</h2><p class="ll-question">Dos sensores entran. Una decisión sale. Sigue los números y descubre cómo aprende la neurona cuando se equivoca.</p>
 <div class="pn-cases" aria-label="Casos simulados">${PLANT_EXAMPLES.map(c=>button('pn-case-'+c.id,c.label)).join('')}${button('pn-reset','Reiniciar todo')}</div>
 <div class="pn-workspace"><aside class="ll-card pn-sensors"><div class="ll-kicker">LOS DATOS · PUEDES MOVERLOS</div><div id="pn-plant"></div>
 <label class="pn-blue" for="pn-dryness">Sequedad del suelo <output id="pn-dryness-value"></output></label><input id="pn-dryness" type="range" min="0" max="100" step="5" value="80" aria-describedby="pn-dry-help"><p id="pn-dry-help" class="pn-hint">0 = húmedo · 100 = seco. Para la neurona, dividimos entre 100.</p>
 <label class="pn-orange" for="pn-heat">Calor <output id="pn-heat-value"></output></label><input id="pn-heat" type="range" min="0" max="100" step="5" value="60" aria-describedby="pn-heat-help"><p id="pn-heat-help" class="pn-hint">Índice inventado: 0 = poco calor · 100 = mucho. No son °C.</p><p class="pn-hint">La planta representa la decisión. Los sensores permanecen fijos durante el aprendizaje.</p></aside>
 <article class="ll-card pn-main"><div class="pn-stage-heading"><span id="pn-stage-name"></span><span class="pn-mode" id="pn-mode"></span></div>
 <div class="pn-steps" aria-label="Pasos del recorrido">${STEPS.map((s,i)=>`<button type="button" data-pn-step="${i}" id="pn-step-${i}"><span>${i+1}</span>${s}</button>`).join('')}</div>
 <div id="pn-diagram" role="region" aria-label="Recorrido de la información por la neurona" tabindex="0"></div><div class="pn-legend"><span class="pn-blue">● Sequedad y su peso</span><span class="pn-orange">● Calor y su peso</span><span class="pn-purple">● Bias</span><span class="pn-green">→ Predicción</span><span class="pn-pink">← Ajustes al aprender</span></div>
 <div class="pn-caption" id="pn-caption" role="status" aria-live="polite"></div><div class="pn-toolbar">${button('pn-next','Seguir los datos →','primary')}${button('pn-replay','Repetir animación')}${button('pn-back','Paso anterior')}</div><div id="pn-trip"></div><div id="pn-result"></div>
 </article></div>
 <section class="ll-card pn-bias"><div class="ll-kicker pn-purple">EL BIAS, SIN MISTERIO</div><h3>Un ajuste que se suma, aunque los sensores no cambien.</h3><p>Los <strong>pesos</strong> multiplican cada entrada. El <strong>bias</strong> (sesgo, <strong>b</strong>) se suma después: puede favorecer o frenar que la neurona active el riego.</p>
 <div class="pn-bias-grid"><div><label class="pn-purple" for="pn-bias">Bias · cantidad que se suma <output id="pn-bias-value"></output></label><input id="pn-bias" type="range" min="-6" max="2" step=".001" value="-3" aria-describedby="pn-bias-help"><p id="pn-bias-help">Mueve solo este control. <strong>No cambian las entradas ni los pesos.</strong> La puntuación y la decisión se recalculan.</p><div class="pn-toolbar">${button('pn-bias-low','Probar b = −3')}${button('pn-bias-high','Probar b = −1')}${button('pn-bias-cut','Llevar la suma a 0')}</div></div><div id="pn-bias-comparison"></div></div>
 <div id="pn-equation"></div><div id="pn-bias-graphic"></div><p class="pn-hint">El bias no es el error ni el umbral de decisión. Aquí el umbral permanece en 0,50; el bias cambia la suma que entra a la sigmoide. Moverlo a mano es explorar; aprender lo ajusta usando una respuesta conocida.</p></section>
 <section class="ll-card pn-learning"><div class="ll-kicker pn-pink">EL CAMINO DE VUELTA</div><h3>Para aprender, hace falta una respuesta conocida.</h3><div class="pn-learning-controls"><label for="pn-target">Respuesta de este ejemplo simulado<select id="pn-target"><option value="1">1 · Sí había que regar</option><option value="0">0 · No había que regar</option></select></label><label for="pn-rate">Tamaño del ajuste · tasa η<select id="pn-rate"><option value=".25">0,25 · pequeño</option><option value=".5">0,50 · medio</option><option value="1" selected>1,00 · ejemplo inicial</option></select></label></div>
 <p>Esta respuesta es una <strong>etiqueta de entrenamiento</strong>: la elegimos para enseñar. Al predecir un caso nuevo, la neurona recibe los sensores, <strong>no la etiqueta</strong>.</p><div id="pn-update"></div>
 <details class="ll-details"><summary>Ver las cuentas del aprendizaje y los pesos</summary><div id="pn-math"></div><div class="pn-learning-controls"><label for="pn-weight-dry">Peso de sequedad <output id="pn-weight-dry-value"></output><input id="pn-weight-dry" type="range" min="-4" max="6" step=".001" value="2"></label><label for="pn-weight-heat">Peso de calor <output id="pn-weight-heat-value"></output><input id="pn-weight-heat" type="range" min="-4" max="6" step=".001" value="1"></label></div><p>Cambiar un peso a mano explora su efecto; no entrena. Un peso negativo hace que esa entrada reste a la suma.</p></details>
 <details class="ll-details"><summary>Comprueba si lo entendiste · sin nota</summary><p><strong>Si mueves el bias y dejas quietos los sensores, ¿qué cambió?</strong> Un parámetro de la neurona. La suma cambia antes de activar; no cambió la medición.</p><p><strong>¿Qué vuelve por las flechas magenta?</strong> El gradiente: información para calcular cambios de pesos y bias. No vuelven agua ni nuevos datos hacia los sensores.</p><p><strong>¿Ya aprendió a regar cualquier planta?</strong> No. Un ajuste mejora este caso; para comprobar que generaliza hacen falta muchos casos y una prueba independiente.</p></details>
 <p class="ll-limit">Datos, escalas, etiquetas y parámetros iniciales inventados para aprender. Es una neurona sigmoide sin capas ocultas. La puntuación no son litros ni una probabilidad agronómica validada. No es una recomendación de riego.</p><p class="ll-source">Conceptos: <a href="https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function?hl=es-419" target="_blank" rel="noopener noreferrer">suma, bias y sigmoide · Google</a> · <a href="https://www.tensorflow.org/guide/core/logistic_regression_core" target="_blank" rel="noopener noreferrer">aprendizaje con gradientes · TensorFlow</a></p></section></section>`;}

export function mountPlantNeuron({root,document:doc=globalThis.document,state=null}){
 const $=id=>doc.getElementById(id);
 let model=state?copy(state.model):initialPlantNeuron(),x=state?[...state.x]:[.8,.6],y=state?.y??1,rate=state?.rate??1,step=state?.step??0,updates=state?.updates??0,last=state?.last??null;
 root.innerHTML=markup();
 const stop=()=>{root.setAttribute('data-pn-paused','true');};
 const sync=()=>{for(const [id,v] of [['pn-dryness',x[0]*100],['pn-heat',x[1]*100],['pn-bias',model.b],['pn-weight-dry',model.w[0]],['pn-weight-heat',model.w[1]],['pn-target',y],['pn-rate',rate]]){const e=$(id);if(e.type==='range'){e.min=Math.min(Number(e.min),Math.floor(v));e.max=Math.max(Number(e.max),Math.ceil(v));}e.value=String(v);}};
 function redraw(){
  root.removeAttribute('data-pn-paused');
  const r=plantForward(model,x),u=plantUpdate(model,x,y,rate),old=last?.prediction;
  const messages=[
   ['Empieza en los sensores.',`Sequedad ${fmt(x[0]*100,0)} ÷ 100 = ${fmt(x[0])}; calor ${fmt(x[1]*100,0)} ÷ 100 = ${fmt(x[1])}. Estos dos números viajan hacia la neurona. La etiqueta no entra.`],
   ['Cada camino multiplica; la neurona suma.',`${fmt(x[0])} × ${fmt(model.w[0])} = ${fmt(r.contributions[0])}. ${fmt(x[1])} × ${fmt(model.w[1])} = ${fmt(r.contributions[1])}. Al sumar el bias ${fmt(model.b)}, obtenemos z = ${fmt(r.z)}.`],
   ['La suma se convierte en una puntuación.',`La sigmoide convierte z = ${fmt(r.z)} en p = ${fmt(r.p)}. Como p ${r.decision?'≥':'<'} 0,50, la decisión es «${action(r.decision).toLowerCase()}». Predecir no cambia los parámetros.`],
   ['Ahora sí miramos la respuesta conocida.',`La neurona da ${fmt(r.p)} y la etiqueta es ${y} («${action(y).toLowerCase()}»). La diferencia p − y = ${fmt(u.error,3)} permite calcular los ajustes. No es un porcentaje de errores.`],
   ['La información de ajuste vuelve en magenta.',`El gradiente indica cómo cambiar cada parámetro. Con tasa ${fmt(rate)}, proponemos Δpeso de sequedad ${signed(-rate*u.gradients.w[0])}, Δpeso de calor ${signed(-rate*u.gradients.w[1])} y Δbias ${signed(-rate*u.gradients.b)}. Aún no se han aplicado.`],
   ['Aplicamos y volvemos a predecir.',last?`Mismos sensores y misma etiqueta. La puntuación pasó de ${fmt(old.p)} a ${fmt(r.p)}; la decisión, de «${action(old.decision).toLowerCase()}» a «${action(r.decision).toLowerCase()}». Ajustes aplicados: ${updates}.`:'Sigue el recorrido para aplicar el primer ajuste.']
  ];
  $('pn-stage-name').textContent=`${step+1} / 6 · ${STEPS[step]}`;$('pn-mode').textContent=step<3?'IDA · PREDECIR':step<5?'VUELTA · PREPARAR AJUSTE':'NUEVA PREDICCIÓN';
  for(let i=0;i<6;i++){const b=$('pn-step-'+i);if(i===step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');b.disabled=i===5&&!last;}
  $('pn-diagram').innerHTML=diagram(x,model,r,step,u,false,y)+diagram(x,model,r,step,u,true,y);
  $('pn-plant').innerHTML=plantDrawing(x,step>=2&&Boolean(r.decision));
  $('pn-caption').innerHTML=`<strong>${messages[step][0]}</strong><span>${messages[step][1]}</span>`;
  $('pn-next').textContent=['Seguir los datos →','Ver cómo decide →','Comparar con la respuesta →','Ver qué información regresa ←','Aplicar este ajuste y predecir →','Preparar otro ajuste ↺'][step];$('pn-back').disabled=step===0;$('pn-replay').disabled=step===0;
  $('pn-trip').innerHTML=step===4?`<div class="pn-return"><strong>Decisión → comparación → gradientes → pesos y bias</strong><div class="pn-return-values"><span>Al peso azul: g₁ = ${fmt(u.gradients.w[0],3)}</span><span>Al peso naranja: g₂ = ${fmt(u.gradients.w[1],3)}</span><span>Al bias morado: gᵦ = ${fmt(u.gradients.b,3)}</span></div><span>Los ajustes se calculan con estos datos. Los sensores no se modifican.</span></div>`:`<div class="pn-forward"><strong>Sensores → pesos → suma + bias → sigmoide → decisión</strong><span>${step===0?'Los números del esquema ya están calculados para que puedas seguirlos. Avanza para destacar cada operación.':'Cada valor sale de la operación anterior. Sigue las flechas de izquierda a derecha; en móvil, de arriba abajo.'}</span></div>`;
  const visible=step>=2;
  $('pn-result').innerHTML=`<div class="pn-output"><div><small>Puntuación para regar</small><strong>${visible?fmt(r.p):'Por recorrer'}</strong></div><div><small>Decisión con corte 0,50</small><strong>${visible?action(r.decision):'Sigue los pasos'}</strong></div></div><div class="pn-score" aria-hidden="true"><i style="width:${r.p*100}%"></i><b></b></div><div class="pn-score-label"><span>0 · no regar</span><span>Corte 0,50</span><span>1 · regar</span></div>`;
  for(const [id,value] of [['pn-dryness',`${fmt(x[0]*100,0)} / 100 → ${fmt(x[0])}`],['pn-heat',`${fmt(x[1]*100,0)} / 100 → ${fmt(x[1])}`],['pn-bias',fmt(model.b,3)],['pn-weight-dry',fmt(model.w[0],3)],['pn-weight-heat',fmt(model.w[1],3)]]){$(id+'-value').textContent=value;$(id).setAttribute('aria-valuetext',value);}
  for(const c of PLANT_EXAMPLES)$('pn-case-'+c.id).setAttribute('aria-pressed',String(x.every((v,i)=>v===c.x[i])&&y===c.y));
  const without=plantForward({...model,b:0},x);
  $('pn-bias-comparison').innerHTML=`<div class="pn-bias-pair"><div><small>Sin bias · b = 0</small><strong>${fmt(without.p)}</strong><span>${action(without.decision)}</span></div><div><small>Con bias · b = ${fmt(model.b)}</small><strong>${fmt(r.p)}</strong><span>${action(r.decision)}</span></div></div><p class="pn-hint">Mismas entradas y mismos pesos en ambos. Solo cambia el bias.</p>`;
  $('pn-equation').innerHTML=`<div class="pn-equation"><span class="pn-term pn-blue">${fmt(x[0])} × ${fmt(model.w[0])}<b>${fmt(r.contributions[0])}</b></span><span>+</span><span class="pn-term pn-orange">${fmt(x[1])} × ${fmt(model.w[1])}<b>${fmt(r.contributions[1])}</b></span><span>+</span><span class="pn-term pn-purple">bias<b>${fmt(model.b)}</b></span><span>=</span><span class="pn-term">suma z<b>${fmt(r.z)}</b></span></div><p class="pn-hint">Si z es 0, la sigmoide da 0,50. Si z es negativo, queda por debajo del corte; si es positivo, queda por encima.</p>`;
  const min=Math.min(-4,r.sumInputs-1,r.z-1),max=Math.max(4,r.sumInputs+1,r.z+1),pos=v=>8+84*(v-min)/(max-min),a=pos(r.sumInputs),b=pos(r.z),zero=pos(0);
  $('pn-bias-graphic').innerHTML=`<div class="pn-bias-axis" role="img" aria-label="La suma sin bias ${fmt(r.sumInputs)} se desplaza ${fmt(model.b)} hasta ${fmt(r.z)}. El corte corresponde a z igual a cero."><span class="pn-axis-zero" style="left:${zero}%">0</span><i class="pn-axis-shift" data-direction="${model.b<0?'left':'right'}" style="left:${Math.min(a,b)}%;width:${Math.abs(a-b)}%"></i><span class="pn-axis-dot pn-axis-before" style="left:${a}%"></span><span class="pn-axis-dot pn-axis-after" style="left:${b}%"></span></div><div class="pn-axis-key"><span>○ Sin bias: ${fmt(r.sumInputs)}</span><strong class="pn-purple">● Con bias: ${fmt(r.z)}</strong><span>Desplazamiento: ${fmt(model.b)}</span></div>`;
  const shown=step===5&&last?last:u,applied=step===5&&last;
  $('pn-update').innerHTML=`<div class="pn-update-title">${applied?'Último ajuste aplicado':'Próximo ajuste · todavía sin aplicar'}</div><div class="pn-parameter-grid">${[['Peso de sequedad',shown.before.w[0],shown.after.w[0]],['Peso de calor',shown.before.w[1],shown.after.w[1]],['Bias',shown.before.b,shown.after.b]].map(([label,v,n])=>`<div><small>${label}</small><strong>${fmt(v,3)} → ${fmt(n,3)}</strong><span>Cambio: ${signed(n-v)}</span></div>`).join('')}</div><p class="pn-hint">${applied?`Pérdida de este caso: ${fmt(shown.lossBefore,3)} → ${fmt(shown.lossAfter,3)}. Esto no evalúa otras plantas.`:'Llega al paso 5 y pulsa «Aplicar este ajuste y predecir» para cambiar los parámetros.'}</p>`;
  $('pn-math').innerHTML=`<div class="pn-math"><p class="pn-hint">Mostramos cifras redondeadas; el cálculo conserva su precisión interna.</p><p><strong>1. Compara:</strong> δ = p − y = ${fmt(shown.prediction.p,3)} − ${y} = ${fmt(shown.error,3)}.</p><p><strong>2. Calcula el gradiente:</strong> g₁ = δ × ${fmt(x[0])} = ${fmt(shown.gradients.w[0],3)}; g₂ = δ × ${fmt(x[1])} = ${fmt(shown.gradients.w[1],3)}; gᵦ = δ = ${fmt(shown.gradients.b,3)}. El bias se suma directamente, por eso su derivada es 1.</p><p><strong>3. Actualiza:</strong> parámetro nuevo = parámetro anterior − tasa × su gradiente. Para el bias: ${fmt(shown.before.b,3)} − ${fmt(shown.rate)} × (${fmt(shown.gradients.b,3)}) = ${fmt(shown.after.b,3)}.</p><p>Usamos sigmoide p = 1 / (1 + e<sup>−z</sup>) y pérdida de entropía cruzada binaria L = −[y ln(p) + (1−y) ln(1−p)]. Para esta combinación, el gradiente respecto a z es p−y. No derivamos la decisión de sí/no.</p></div>`;
 }
 function explore(){step=0;last=null;sync();redraw();}
 function advance(){if(step===4){last=plantUpdate(model,x,y,rate);model=copy(last.after);updates++;step=5;sync();}else if(step===5){last=null;step=0;}else step++;redraw();}
 $('pn-next').onclick=advance;$('pn-back').onclick=()=>{step=Math.max(0,step-1);redraw();};$('pn-replay').onclick=redraw;
 for(let i=0;i<6;i++)$('pn-step-'+i).onclick=()=>{if(i===5&&!last)return;step=i;redraw();};
 for(const c of PLANT_EXAMPLES)$('pn-case-'+c.id).onclick=()=>{x=[...c.x];y=c.y;explore();};
 $('pn-reset').onclick=()=>{model=initialPlantNeuron();x=[.8,.6];y=1;rate=1;updates=0;explore();};
 for(const [id,index] of [['pn-dryness',0],['pn-heat',1]])$(id).oninput=e=>{x[index]=Number(e.target.value)/100;explore();};
 $('pn-bias').oninput=e=>{model.b=Number(e.target.value);explore();};
 for(const [id,bias] of [['pn-bias-low',-3],['pn-bias-high',-1]])$(id).onclick=()=>{model.b=bias;explore();};
 $('pn-bias-cut').onclick=()=>{model.b=-plantForward(model,x).sumInputs;explore();};
 for(const [id,i] of [['pn-weight-dry',0],['pn-weight-heat',1]])$(id).oninput=e=>{model.w[i]=Number(e.target.value);explore();};
 $('pn-target').onchange=e=>{y=Number(e.target.value);explore();};$('pn-rate').onchange=e=>{rate=Number(e.target.value);if(step===5){last=null;step=3;}redraw();};
 sync();redraw();
 return {stop,destroy:stop,snapshot:()=>({model:copy(model),x:[...x],y,rate,step,updates,last})};
}
