import {validFullName} from './access-policy.js';
import {STUDENT_RECORDS} from './database-config.js';
let identityReady=false;
if(location.origin===new URL(STUDENT_RECORDS.url).origin){try{const session=await fetch('/api/session').then(r=>r.json());if(session.role==='teacher')identityReady=true;else{const record=await fetch('/api/me').then(r=>r.json());identityReady=validFullName(record.name)}}catch{}}
else{try{identityReady=validFullName(JSON.parse(localStorage.getItem('utp-aula-v1')||'{}').name)}catch{}}
if(!identityReady){location.replace('./?destino='+encodeURIComponent('laboratorio.html'+location.hash));await new Promise(()=>{})}
import {initialNetwork,forward,learn,loss,neighbors,PEOPLE,evaluate} from './lab-models.js';
import {createPlantScene} from './lab-greenhouse.js';

const $=id=>document.getElementById(id);
const f=(n,d=2)=>Number(n).toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=n=>n===null?'Sin alertas':f(n*100,1)+' %';
const stories={
 riego:{title:'Una red aprende a regar',kicker:'Aprender del error',steps:[
  'El suelo está seco. En este ejemplo, la respuesta que queremos enseñar es «regar».',
  'La red recibe dos datos: qué tan seco está el suelo y cuánto calor hace.',
  'Combina esos datos, pero responde «no regar». Su respuesta es incorrecta.',
  'Le mostramos la respuesta correcta. El error guía el ajuste de sus conexiones.',
  'Con los mismos datos, ahora responde «regar». Aprendió de este ejemplo.'
 ],labels:['La situación','Los datos','La decisión','El error','El aprendizaje']},
 vecinos:{title:'Cambiar la escala cambia los vecinos',kicker:'KNN · aprender por semejanza',steps:[
  'Queremos predecir si una persona comprará. Para hacerlo, consultamos tres casos parecidos.',
  'Sin escalar, las diferencias en pesos dominan a las diferencias de edad. Dos vecinos votan «no compra».',
  'Al poner ambas variables en una escala comparable, cambian los vecinos. Ahora dos votan «compra».',
  'Mismos datos, distinta forma de medir la distancia. Escalar puede cambiar la decisión; no garantiza mejorarla.'
 ],labels:['La pregunta','Sin escalar','Con escalado','La idea clave']},
 metricas:{title:'99 aciertos pueden ocultar un problema',kicker:'Mirar más de una métrica',steps:[
  'Hay 100 piezas. Solo una tiene un defecto: la que ves marcada en naranja.',
  'El sistema dice que todas están bien. Acierta 99 veces, pero deja pasar el único defecto.',
  'Al bajar el umbral, detecta el defecto. También aparecen dos falsas alertas.',
  'Ahora detecta el 100 % de los defectos, pero solo una de sus tres alertas es correcta.'
 ],labels:['Las piezas','El engaño','Detectar el defecto','El costo de las alertas']}
};
const base=initialNetwork(),trained=Array.from({length:10}).reduce(net=>learn(net,[.9,.2],1),base);
let active='',step=0,playing=false,timer=null,disposePlant=()=>{},updatePlant=()=>{};
let custom=false,water={net:initialNetwork(),x:[.9,.2],y:1,steps:0};
let query={age:43,income:4200000,k:3},threshold=1;
const playIcon='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z"/></svg>';
const pauseIcon='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h4v12H3zm6 0h4v12H9z"/></svg>';
const slider=(id,label,min,max,increment,value)=>`<label><span>${label}<output id="${id}-value">${value}</output></span><input id="${id}" type="range" min="${min}" max="${max}" step="${increment}" value="${value}"></label>`;

function greenhouse(){return `<svg class="scenery" viewBox="0 0 1200 470" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="house-sky" x2="0" y2="1"><stop stop-color="#648b73"/><stop offset="1" stop-color="#183d3a"/></linearGradient><radialGradient id="house-light"><stop stop-color="#ead69a" stop-opacity=".4"/><stop offset="1" stop-color="#ead69a" stop-opacity="0"/></radialGradient><linearGradient id="bed" x2="1" y2="1"><stop stop-color="#395844"/><stop offset="1" stop-color="#193b36"/></linearGradient><g id="sprout"><path d="M0 0V-25" stroke="#426e52" stroke-width="2"/><ellipse cx="-6" cy="-15" rx="9" ry="4" fill="#66865b" transform="rotate(25 -6 -15)"/><ellipse cx="7" cy="-24" rx="9" ry="4" fill="#86a675" transform="rotate(-25 7 -24)"/></g></defs><path fill="url(#house-sky)" d="M0 0H1200V470H0z"/><circle cx="195" cy="83" r="200" fill="url(#house-light)"/><circle cx="195" cy="83" r="27" fill="#e5d697" opacity=".7"/><path d="M0 290L540 200l660 90v180H0" fill="#24483c"/><path d="M540 200L370 470h430z" fill="#81966b" opacity=".16"/><g fill="none" stroke="#a7c0a5" stroke-width="2" opacity=".22"><path d="M0 380V50L540-110l660 220v300M100 360V80L540-40l550 190v245M225 330V115L540 22l410 170v185M340 300V145L540 85l285 145v130M440 275V180l100-30 150 95v95M540 0v210M0 50l540 160 660-100M100 80l440 130 550-60M225 115l315 95 410-18M340 145l200 65 285 20"/></g><path d="M0 352l405-104 69 28L0 450zM1200 358L720 251l-43 24 523 175z" fill="#696d46"/><path d="M0 352l405-104 69 16L0 417zM1200 358L720 251l-43 13 523 153z" fill="url(#bed)"/>${Array.from({length:17},(_,i)=>`<use href="#sprout" transform="translate(${i*27} ${349-i*6.2}) scale(${1.1-i*.035})"/><use href="#sprout" transform="translate(${1200-i*28} ${350-i*5.9}) scale(${1.1-i*.035})"/>`).join('')}<path d="M0 470V410q30-90 85-95-32 60-28 155z" fill="#174438" opacity=".8"/><g fill="#43745c" opacity=".65">${Array.from({length:6},(_,i)=>`<ellipse cx="${18+i*9}" cy="${435-i*20}" rx="23" ry="7" transform="rotate(-25 ${18+i*9} ${435-i*20})"/>`).join('')}</g></svg>`;}

function waterScene(){return `${greenhouse()}<div class="scene-badge">Un pequeño invernadero</div><div class="scene-inner"><div class="plant-scene" id="plant-scene"><div class="plant-fallback"><svg viewBox="0 0 240 310" role="img" aria-label="Una planta con sensor de suelo y tubo de riego"><ellipse cx="115" cy="273" rx="76" ry="13" fill="#0c2b2b66"/><path d="M69 205h94l-14 65H84z" fill="#bc805d"/><ellipse cx="116" cy="205" rx="49" ry="13" fill="#4b4736"/><path d="M116 204V75" stroke="#80a476" stroke-width="6"/><path d="M115 118Q53 66 53 139q37 13 62-21M117 98q66-60 65 6-38 20-65-6M113 163q-57-40-58 21 42 3 58-21M117 151q51-48 61 10-33 17-61-10" fill="#87ad74"/><path d="M186 104v-12h-32" fill="none" stroke="#c5bea1" stroke-width="8"/><rect x="76" y="185" width="14" height="25" rx="3" fill="#9bd6c8"/></svg></div><div class="sensor-label" id="soil-label"><i></i>Suelo seco</div></div><div class="story-network" id="network-view"></div></div>`;}

function networkSVG(result){
 const nodes=[[74,104],[74,223],[280,65],[280,164],[280,263],[491,164]];
 const edge=(a,b,c='')=>`<path class="net-edge ${c}" d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}"/>`;
 const pulse=step>=1&&step!==2?'signal':'';
 const edges=nodes.slice(0,2).flatMap(a=>nodes.slice(2,5).map(b=>edge(a,b,pulse))).join('')+nodes.slice(2,5).map(a=>edge(a,nodes[5],step>=2?'signal second':'')).join('');
 const values=[...water.x,...result.h,result.p];
 return `<svg viewBox="0 0 600 350" role="img" aria-label="Una red combina dos entradas en tres neuronas y produce una respuesta: ${result.p>=.5?'regar':'no regar'}."><g>${edges}</g><g class="net-layer input-layer"><text x="74" y="43" text-anchor="middle" font-size="15">Datos</text><circle class="net-node" cx="74" cy="104" r="26"/><path d="M65 104h18m-9-9v18" stroke="#ebd89b" stroke-width="2"/><circle class="net-node" cx="74" cy="223" r="26"/><circle cx="74" cy="223" r="7" fill="#e0c782"/><text x="74" y="149" text-anchor="middle" font-size="14">Suelo seco</text><text x="74" y="268" text-anchor="middle" font-size="14">Calor suave</text></g><g class="net-layer"><text x="280" y="22" text-anchor="middle" font-size="15">Combinar</text>${nodes.slice(2,5).map(([x,y],i)=>`<circle class="net-node" cx="${x}" cy="${y}" r="25"/><circle cx="${x}" cy="${y}" r="${6+result.h[i]*10}" fill="#d4c288" opacity=".8"/>`).join('')}</g><g class="net-layer"><text x="491" y="87" text-anchor="middle" font-size="15">Decidir</text><circle class="net-node output-node" cx="491" cy="164" r="31"/><circle class="output-fill" cx="491" cy="164" r="${7+result.p*14}"/></g><g class="decision"><text x="491" y="223" text-anchor="middle" font-size="20" font-weight="700">${result.p>=.5?'Regar':'No regar'}</text></g><g class="feedback"><path d="M490 265q-100 90-210 40" fill="none" stroke="#eba777" stroke-width="2" stroke-dasharray="5 6"/><path d="M289 300l-13 4 7 11" fill="none" stroke="#eba777" stroke-width="2"/><text x="420" y="313" text-anchor="middle" font-size="14">Lo correcto era regar</text></g>${custom?`<g>${nodes.map(([x,y],i)=>`<text x="${x}" y="${y+6}" text-anchor="middle" font-size="14" style="paint-order:stroke;stroke:#173f3c;stroke-width:5px">${f(values[i])}</text>`).join('')}</g>`:''}</svg>`;
}

function knnScene(){return `<span class="scene-badge">Tres vecinos, una decisión</span><div class="scene-legend"><span><i style="background:#94d8cf"></i>Compra</span><span><i style="background:#b7c1d6"></i>No compra</span><span>◇ Persona nueva</span></div><svg class="scene-plot" id="knn-plot" viewBox="0 0 850 360" role="img" aria-label="Edad e ingreso de seis personas y los tres vecinos seleccionados"></svg><div class="knn-outcome" id="knn-outcome"></div>`;}
function updateKNN(){
 const scaled=!custom?step>=2:$('scaled').checked,r=neighbors(query,query.k,scaled);
 const px=a=>80+(a-18)/42*680,py=v=>290-(v-1e6)/7e6*230;
 $('knn-plot').innerHTML=`<path d="M80 40V290H790" stroke="#8094aa" fill="none" opacity=".5"/>${[20,30,40,50,60].map(a=>`<text x="${px(a)}" y="314" text-anchor="middle">${a}</text>`).join('')}${[2,4,6,8].map(v=>`<path d="M80 ${py(v*1e6)}H790" stroke="#91a7bb" opacity=".1"/><text x="65" y="${py(v*1e6)+5}" text-anchor="end">${v} M</text>`).join('')}<text x="80" y="23">Ingreso mensual · COP</text><text x="440" y="345" text-anchor="middle">Edad · años</text>${(step||custom)?r.selected.map(p=>`<path class="neighbor-line" d="M${px(query.age)} ${py(query.income)}L${px(p.age)} ${py(p.income)}"/>`).join(''):''}${PEOPLE.map(p=>`<circle class="person-dot" cx="${px(p.age)}" cy="${py(p.income)}" r="12" fill="${p.buy?'#94d8cf':'#b7c1d6'}" stroke="#142b40" stroke-width="3"/><text x="${px(p.age)}" y="${py(p.income)-20}" text-anchor="middle">${p.id}</text>`).join('')}<path d="M${px(query.age)} ${py(query.income)-13}l13 13-13 13-13-13z" fill="#eed5a3" stroke="#142b40" stroke-width="2"/>`;
 $('knn-outcome').textContent=step||custom?`${scaled?'Con escalado':'Sin escalar'} → ${r.prediction?'Compra':'No compra'}`:'¿Comprará?';
 $('knn-detail').innerHTML=`<h3>${r.prediction?'Compra':'No compra'}</h3><p>${r.yes} de ${query.k} vecinos votan «compra».</p><table><thead><tr><th>Vecino</th><th>Edad</th><th>Ingreso COP</th><th>Distancia</th><th>Voto</th></tr></thead><tbody>${r.selected.map(p=>`<tr><td>${p.id}</td><td>${p.age}</td><td>${f(p.income,0)}</td><td>${f(p.distance)}</td><td>${p.buy?'Compra':'No compra'}</td></tr>`).join('')}</tbody></table><p class="hint">Los ejes se ajustan para mostrar ambos datos. Las longitudes del dibujo no son las distancias numéricas originales.</p><details><summary>Cómo se calcula</summary><p>Distancia euclídea y voto uniforme. La escala se ajusta solo con los seis casos de referencia, sin incluir la persona nueva.</p><p class="formula">z = (valor − media) / desviación típica<br>Edad: media ${f(r.stats[0].mean)}, desviación ${f(r.stats[0].sd)}<br>Ingreso: media ${f(r.stats[1].mean,0)} COP, desviación ${f(r.stats[1].sd,0)} COP</p><p>No se está midiendo el rendimiento en personas nuevas.</p></details>`;
 $('age-value').textContent=query.age;$('income-value').textContent=f(query.income,0);
}

function metricsScene(){return `<span class="scene-badge">100 piezas · un defecto</span><svg class="piece-grid" id="pieces-view" viewBox="0 0 490 280" role="img" aria-label="Cien piezas y un único defecto marcado con borde naranja"></svg><div class="metric-spotlight" id="metric-spotlight"></div><span class="piece-key" id="piece-key"></span>`;}
function updateMetrics(){
 const r=evaluate(threshold),colors={tp:'#a3dbc9',tn:'#afbfce',fp:'#edb883',fn:'#ed9b77'};
 $('pieces-view').innerHTML=r.items.map((p,i)=>`<rect class="piece" x="${12+i%10*47}" y="${8+Math.floor(i/10)*26}" width="15" height="15" rx="4" fill="${step===0&&!custom?(p.defect?'#edb883':'#afbfce'):colors[p.kind]}" stroke="${p.defect?'#ffcc94':'transparent'}" stroke-width="3"><title>Pieza ${p.id}: ${p.defect?'defectuosa':'sana'}${step||custom?`, ${p.alert?'con alerta':'sin alerta'}`:''}</title></rect>`).join('');
 $('metric-spotlight').innerHTML=!custom&&step===0?'<strong>1</strong><p>defecto entre 100 piezas</p>':!custom&&step===1?'<strong>99 %</strong><p>de aciertos</p><p class="accent">0 defectos detectados</p>':`<strong>${r.tp?'1':'0'} / ${r.tp+r.fn}</strong><p class="success">defectos detectados</p><p>${r.fp} falsas alertas</p>`;
 $('piece-key').textContent=step>=2||custom?'Verde: defecto detectado · naranja: falsa alerta':'El borde naranja señala el defecto real';
 $('metrics-detail').innerHTML=`<h3>¿Qué estamos contando?</h3><p>Exactitud: <strong>${pct(r.accuracy)}</strong> · ${r.tp+r.tn} aciertos de 100.</p><p>Recall: <strong>${pct(r.recall)}</strong> · ${r.tp} de ${r.tp+r.fn} defectos detectados.</p><p>Precisión: <strong>${pct(r.precision)}</strong> · ${r.precision===null?'sin alertas no se puede calcular':`Alertas correctas: ${r.tp} de ${r.tp+r.fp}`}.</p><p class="hint">Solo cambia el umbral. Las puntuaciones y el defecto real permanecen iguales. Son cifras inventadas para aprender a contar resultados.</p>`;
 $('threshold-value').textContent=f(threshold);
}

function exploration(){
 if(active==='riego')return `<p>Cambia los datos y observa la respuesta. «Aprender» ajusta las conexiones usando la etiqueta que eliges.</p><div class="explore-grid"><div class="controls">${slider('dryness','Sequedad del suelo',0,1,.05,.9)}${slider('heat','Calor',0,1,.05,.2)}<label>Respuesta que queremos enseñar<select id="water-target"><option value="1">Regar</option><option value="0">No regar</option></select></label><button class="secondary" id="learn-one">Aprender un paso</button><button class="secondary" id="learn-ten">Aprender 10 pasos</button><button class="secondary" id="reset-network">Volver al ejemplo</button><p class="hint">Entradas entre 0 y 1, sin unidades físicas. Etiquetas inventadas; no es una recomendación de riego.</p></div><div class="explore-result" id="water-detail"></div></div>`;
 if(active==='vecinos')return `<p>Prueba otra persona y compara sus vecinos al activar o desactivar el escalado.</p><div class="explore-grid"><div class="controls">${slider('age','Edad · años',18,60,1,43)}${slider('income','Ingreso mensual · COP',1e6,8e6,1e5,4200000)}<label>Vecinos que votan<select id="knn-k"><option>1</option><option selected>3</option><option>5</option></select></label><label><input type="checkbox" id="scaled"> Estandarizar las variables</label><p class="hint">Seis personas ficticias. Sus compras ya están observadas.</p></div><div class="explore-result" id="knn-detail"></div></div>`;
 return `<p>Una alerta aparece si la puntuación de la pieza alcanza el umbral. Bájalo para encontrar el defecto y observa las falsas alertas.</p><div class="explore-grid"><div class="controls">${slider('threshold','Umbral de alerta',0,100,1,100)}<button class="secondary" id="no-alerts">Decir siempre «sana»</button><button class="secondary" id="detect">Detectar el defecto</button></div><div class="explore-result" id="metrics-detail"></div></div>`;
}

function updateWater(){
 const r=forward(water.net,water.x),on=(custom||step>=2)&&r.p>=.5;
 $('network-view').innerHTML=networkSVG(r);
 $('soil-label').innerHTML=`<i></i>${water.x[0]>.6?'Suelo seco':water.x[0]<.35?'Suelo húmedo':'Humedad intermedia'}`;
 if(custom){const texts=$('network-view').querySelectorAll('.input-layer text');texts[1].textContent=water.x[0]>.6?'Suelo seco':water.x[0]<.35?'Suelo húmedo':'Suelo intermedio';texts[2].textContent=water.x[1]>.6?'Calor alto':'Calor suave';}
 $('dryness-value').textContent=f(water.x[0]);$('heat-value').textContent=f(water.x[1]);
 $('water-detail').innerHTML=`<h3>${r.p>=.5?'Regar':'No regar'} · salida ${f(r.p,3)}</h3><p>Respuesta que enseñamos: <strong>${water.y?'regar':'no regar'}</strong>. ${water.steps} pasos de aprendizaje.</p><p>La pérdida en este caso es <strong>${f(loss(r.p,water.y),3)}</strong>. Menor pérdida significa mejor ajuste a esta etiqueta.</p><p class="hint">Aprender este ejemplo no demuestra que responda bien en otros. Es una red pequeña de una sola capa oculta.</p><details><summary>Ver conexiones y cálculo</summary><table><thead><tr><th>Neurona</th><th>Peso suelo</th><th>Peso calor</th><th>Sesgo</th><th>Salida</th></tr></thead><tbody>${water.net.w.map((w,i)=>`<tr><td>${i+1}</td><td>${f(w[0],3)}</td><td>${f(w[1],3)}</td><td>${f(water.net.b[i],3)}</td><td>${f(r.h[i],3)}</td></tr>`).join('')}</tbody></table><p class="formula">h = sigmoide(peso₁ × suelo + peso₂ × calor + sesgo)<br>Pesos de salida: ${water.net.v.map(v=>f(v,3)).join(' · ')}<br>Sesgo de salida: ${f(water.net.c,3)}<br>Tasa de aprendizaje: 0,50</p><p>Se ajustan 13 parámetros por retropropagación con entropía cruzada binaria. Salida ≥ 0,50: regar. La salida no es una probabilidad validada de necesidad de riego.</p></details>`;
 updatePlant(water.x[0],on,playing);
}

function stop(){playing=false;clearTimeout(timer);timer=null;updatePlayer();}
function updatePlayer(){
 if(!$('play'))return;
 $('play').innerHTML=(playing?pauseIcon:playIcon)+(playing?'Pausar':step===stories[active].steps.length-1?'Volver a ver':'Ver animación');
 $('play').setAttribute('aria-pressed',String(playing));
 $('story-scene').classList.toggle('playing',playing);
 if(active==='riego')updatePlant(water.x[0],(custom||step>=2)&&forward(water.net,water.x).p>=.5,playing);
 $('previous').disabled=step===0;$('next').disabled=step===stories[active].steps.length-1;
 document.querySelectorAll('[data-step]').forEach(b=>{const n=Number(b.dataset.step);b.classList.toggle('done',n<step);if(n===step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
}
function showStep(n){
 step=n;custom=false;
 if(active==='riego'){water={net:step===4?trained:initialNetwork(),x:[.9,.2],y:1,steps:step===4?10:0};$('dryness').value=.9;$('heat').value=.2;$('water-target').value=1;}
 if(active==='vecinos'){query={age:43,income:4200000,k:3};$('age').value=43;$('income').value=4200000;$('knn-k').value=3;$('scaled').checked=step>=2;}
 if(active==='metricas'){threshold=step>=2?.8:1;$('threshold').value=threshold*100;}
 $('story-scene').className=`story-scene ${active==='riego'?'water-scene':active==='vecinos'?'knn-scene':'metrics-scene'} step-${step}`;
 $('step-number').textContent=`${String(step+1).padStart(2,'0')} / ${String(stories[active].steps.length).padStart(2,'0')}`;
 $('caption').textContent=stories[active].steps[step];
 if(active==='riego')updateWater();else if(active==='vecinos')updateKNN();else updateMetrics();
 updatePlayer();
}
function schedule(){
 clearTimeout(timer);if(!playing)return;
 timer=setTimeout(()=>{if(document.hidden){stop();return;}if(step<stories[active].steps.length-1){showStep(step+1);schedule();}else stop();},6500);
}
function explore(){stop();custom=true;$('story-scene').className=`story-scene ${active==='riego'?'water-scene step-4':active==='vecinos'?'knn-scene step-'+($('scaled').checked?2:1):'metrics-scene step-2'}`;$('step-number').textContent='A TU RITMO';}
function train(n){
 explore();for(let i=0;i<n;i++)water.net=learn(water.net,water.x,water.y);
 water.steps+=n;$('caption').textContent='La red ajusta sus conexiones usando tu respuesta. Compara su salida antes y después de aprender.';updateWater();
}
function mount(){
 const lab=stories[location.hash.slice(1)]?location.hash.slice(1):'riego';if(active===lab)return;
 stop();disposePlant();disposePlant=()=>{};updatePlant=()=>{};active=lab;step=0;custom=false;
 document.querySelectorAll('[data-lab]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.lab===active)));
 $('experimento').innerHTML=`<div class="story-heading"><div><p class="eyebrow">${stories[active].kicker}</p><h1>${stories[active].title}</h1></div><p>Una idea a la vez · a tu ritmo</p></div><section class="story-scene" id="story-scene" aria-label="${stories[active].title}">${active==='riego'?waterScene():active==='vecinos'?knnScene():metricsScene()}</section><div class="story-caption" aria-live="polite" aria-atomic="true"><span class="step-number" id="step-number"></span><p id="caption"></p></div><div class="player" aria-label="Reproducción de la historia"><button class="play-button" id="play" aria-pressed="false">${playIcon}Ver animación</button><div class="step-dots" aria-label="Momentos de la historia">${stories[active].labels.map((s,i)=>`<button data-step="${i}" aria-label="${i+1}. ${s}"></button>`).join('')}</div><button class="replay" id="restart">Reiniciar</button><div class="step-arrows"><button id="previous" aria-label="Paso anterior">←</button><button id="next" aria-label="Paso siguiente">→</button></div></div><details class="explore" id="explore"><summary>Explorar por mi cuenta</summary><div class="explore-body">${exploration()}</div></details>`;
 showStep(0);
 if(active==='riego')createPlantScene($('plant-scene')).then(scene=>{if(!$('plant-scene')||!scene.host.isConnected){scene.dispose();return;}disposePlant=scene.dispose;updatePlant=scene.update;updateWater();});
 $('explore').addEventListener('toggle',()=>{if($('explore')?.open)stop();});
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='project'){const on=document.body.classList.toggle('projecting');b.setAttribute('aria-pressed',String(on));b.textContent=on?'Salir de proyección':'Vista para proyectar';}
 if(b.id==='play'){if(playing)stop();else{playing=true;if(custom||step===stories[active].steps.length-1)showStep(0);$('explore').open=false;updatePlayer();if(active==='riego')updateWater();schedule();}}
 if(b.id==='next'||b.id==='previous'){stop();showStep(Math.max(0,Math.min(stories[active].steps.length-1,step+(b.id==='next'?1:-1))));}
 if(b.dataset.step!==undefined){stop();showStep(Number(b.dataset.step));}
 if(b.id==='restart'||b.id==='reset-network'){stop();showStep(0);}
 if(b.id==='learn-one')train(1);if(b.id==='learn-ten')train(10);
 if(b.id==='no-alerts'||b.id==='detect'){$('threshold').value=b.id==='no-alerts'?100:80;threshold=Number($('threshold').value)/100;explore();updateMetrics();$('caption').textContent='Cambiar el umbral cambia las alertas. El defecto real sigue siendo el mismo.';}
});
document.addEventListener('input',e=>{
 if(['dryness','heat','water-target'].includes(e.target.id)){explore();water.x=[Number($('dryness').value),Number($('heat').value)];water.y=Number($('water-target').value);$('caption').textContent='Estos son tus datos. Calcular una respuesta no cambia las conexiones; aprender sí las ajusta.';updateWater();}
 if(['age','income','knn-k','scaled'].includes(e.target.id)){explore();query={age:Number($('age').value),income:Number($('income').value),k:Number($('knn-k').value)};updateKNN();$('caption').textContent='Los trazos unen a la persona nueva con los vecinos que votan. Compara la selección al cambiar la escala.';}
 if(e.target.id==='threshold'){threshold=Number(e.target.value)/100;explore();updateMetrics();$('caption').textContent='Cambiar el umbral cambia las alertas. El defecto real sigue siendo el mismo.';}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
window.addEventListener('hashchange',mount);mount();
