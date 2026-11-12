// Explicaciones visuales de los encuentros 3 y 4 de Deep Learning.
// Aportan a las secciones existentes de cada tema: la idea en una frase, una comparación cotidiana,
// figuras manipulables y vocabulario en tarjetas de color.
// Las figuras se recalculan con dl-visual-models.js; los datos son inventados y las cuentas son las mostradas.
import {DELIVERIES,recurrentStates,memoryWeights,lstmStep,ATTENTION_DAYS,attention,selfAttention,embedToken,positionSignal,encodeSequence,sameSummary,SCENE,overlap,detect,matchDetections,evaluateScene,precisionRecallCurve,REVIEW_UNITS,reviewCost,costCurve,cheapestCut} from './dl-visual-models.js?v=visual-20261112a';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(v,d=2)=>Number(v).toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=(v,d=0)=>num(v*100,d)+' %';
const DAY_COLORS=['blue','pink','teal','amber'];

/* ---------- Piezas comunes ---------- */

const card=(color,icon,term,meaning,example)=>`<div class="vx-card vx-c-${color}"><dt><span class="vx-icon" aria-hidden="true">${icon}</span>${esc(term)}</dt><dd>${meaning}${example?`<span class="vx-example"><b>Ejemplo:</b> ${example}</span>`:''}</dd></div>`;
const slider=(key,label,min,max,step,value)=>`<label class="vx-slider"><span>${esc(label)} <output data-vx-value="${key}"></output></span><input type="range" data-vx-control="${key}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
const toggle=(key,label,checked)=>`<label class="vx-toggle"><input type="checkbox" data-vx-control="${key}" ${checked?'checked':''}><span>${esc(label)}</span></label>`;
const preset=(label,values,key)=>`<button type="button" class="vx-chip" data-vx-set='${JSON.stringify(values)}'${key?` data-vx-key="${key}" data-vx-tab="${values[key]}"`:''}>${esc(label)}</button>`;
const goalList=name=>GOALS[name]?`<div class="vx-goals"><b>Retos</b><ul>${GOALS[name].map((g,i)=>`<li data-vx-goal="${i}"><span class="vx-goal-mark" aria-hidden="true"></span><span>${esc(g.text)}</span></li>`).join('')}</ul><p class="vx-goal-status" role="status" data-vx-goal-status></p></div>`:'';
const figure=(name,title,controls,reading)=>`<figure class="vx-fig" data-vx-fig="${name}"><figcaption>${esc(title)}</figcaption>${controls?`<div class="vx-controls">${controls}</div>`:''}<div class="vx-out" data-vx-out>${DRAW[name]({...DEFAULTS[name]})}</div>${goalList(name)}${reading?`<p class="vx-reading"><b>Cómo leerla:</b> ${reading}</p>`:''}</figure>`;
const svg=(w,h,label,body,extra='')=>`<div class="vx-scroll"><svg class="vx-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" ${extra}>${body}</svg></div>`;
const arrowDefs='<defs><marker id="vx-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="vx-f-ink"/></marker></defs>';

/* ---------- Estado inicial y rótulos de los controles ---------- */

const DEFAULTS={
 memory:{keep:50,day:12},
 gates:{forget:50,input:50,output:100},
 attention:{rain:true,market:false,temp:100},
 selfattention:{temp:100},
 pipeline:{stage:1},
 order:{position:false},
 detector:{grid:false,conf:25,nms:false},
 iou:{dx:10,dy:0},
 pr:{conf:50},
 review:{cut:50,price:8,truth:true}
};
const VALUE_LABELS={
 keep:s=>s.keep+' %',day:s=>'día '+s.day,forget:s=>s.forget+' %',input:s=>s.input+' %',output:s=>s.output+' %',
 temp:s=>num(s.temp/100,1),conf:s=>num(s.conf/100),dx:s=>s.dx+' px',dy:s=>s.dy+' px',cut:s=>num(s.cut/100),price:s=>s.price+(s.price===1?' punto':' puntos')
};

/* ---------- Retos con meta: se marcan solos cuando el estado de la figura los cumple ---------- */

const finalDetections=s=>matchDetections(detect(SCENE,s.conf/100,s.nms,.5).kept,SCENE.objects);
const GOALS={
 memory:[
  {text:'Leyendo los 12 días, encuentra cuánto conservar para que el día 1 pese al menos 3 %.',test:s=>s.day===12&&memoryWeights(12,s.keep/100)[0]>=.03},
  {text:'Haz que la memoria del día 12 quede a menos de 1 caja de la última entrega (26).',test:s=>s.day===12&&Math.abs(recurrentStates(DELIVERIES,s.keep/100)[11]-DELIVERIES[11])<1}
 ],
 gates:[
  {text:'Guarda la memoria intacta (0,80) sin mostrar nada a la salida.',test:s=>s.forget===100&&s.input===0&&s.output===0},
  {text:'Consigue una memoria nueva de exactamente 0,50. Hay más de una forma.',test:s=>Math.abs(lstmStep({previous:.8,candidate:.5,forget:s.forget/100,input:s.input/100,output:1}).memory-.5)<.0051}
 ],
 attention:[
  {text:'Haz que el día 3 reciba más del 60 % de la atención.',test:s=>attention([s.rain?1:0,s.market?1:0],ATTENTION_DAYS.map(d=>d.key),ATTENTION_DAYS.map(d=>d.value),s.temp/100).weights[2]>.6},
  {text:'Consigue un resumen de exactamente 25 cajas.',test:s=>Math.abs(attention([s.rain?1:0,s.market?1:0],ATTENTION_DAYS.map(d=>d.key),ATTENTION_DAYS.map(d=>d.value),s.temp/100).output-25)<.05}
 ],
 order:[{text:'Consigue que el modelo pueda distinguir los dos órdenes.',test:s=>s.position}],
 detector:[
  {text:'Deja 4 cajas y que las 4 sean correctas.',test:s=>{const r=finalDetections(s);return r.rows.length===4&&r.fp===0;}},
  {text:'Encuentra los 5 frutos con una sola caja por fruto, aunque sobren falsas alarmas.',test:s=>{const r=finalDetections(s);return s.nms&&r.tp===5;}}
 ],
 iou:[
  {text:'Coloca la caja naranja hasta lograr IoU de 0,90 o más.',test:s=>overlap(REFERENCE,[REFERENCE[0]+s.dx,REFERENCE[1]+s.dy,REFERENCE[2]+s.dx,REFERENCE[3]+s.dy]).iou>=.9},
  {text:'Déjala justo en el límite: IoU entre 0,50 y 0,55.',test:s=>{const v=overlap(REFERENCE,[REFERENCE[0]+s.dx,REFERENCE[1]+s.dy,REFERENCE[2]+s.dx,REFERENCE[3]+s.dy]).iou;return v>=.5&&v<=.55;}}
 ],
 pr:[
  {text:'Consigue precisión de 100 % con el mayor recall posible.',test:s=>{const e=evaluateScene(SCENE,s.conf/100);return e.precision===1&&e.recall>=.8;}},
  {text:'Consigue recall de 100 %. ¿Cuánto bajó la precisión?',test:s=>evaluateScene(SCENE,s.conf/100).recall===1}
 ],
 review:[
  {text:'Con el coste del defecto en 8, encuentra el corte más barato.',test:s=>s.truth&&s.price===8&&reviewCost(REVIEW_UNITS,s.cut/100,1,8).total===cheapestCut(REVIEW_UNITS,1,8).total},
  {text:'Cambia el coste del defecto hasta que lo más barato sea revisar 3 granos o menos, y ubica ese corte.',test:s=>{const r=reviewCost(REVIEW_UNITS,s.cut/100,1,s.price);return s.truth&&r.reviewed<=3&&r.total===cheapestCut(REVIEW_UNITS,1,s.price).total;}}
 ]
};
export const visualGoals=name=>GOALS[name]??[];

/* ---------- Figuras: Encuentro 3 ---------- */

const DRAW={};

DRAW.memory=({keep,day})=>{
 const k=keep/100,states=recurrentStates(DELIVERIES,k),weights=memoryWeights(day,k);
 const x=i=>62+i*45,y=v=>170-v*3.5;
 const bars=DELIVERIES.map((v,i)=>`<rect x="${x(i)-15}" y="${y(v)}" width="30" height="${v*3.5}" rx="4" class="${i<day?'vx-f-blue':'vx-f-ghost'}"/><text x="${x(i)}" y="${y(v)-5}" class="vx-t-small" text-anchor="middle">${i<day?v:''}</text><text x="${x(i)}" y="186" class="vx-t-small ${i===day-1?'vx-t-strong':''}" text-anchor="middle">${i+1}</text>`).join('');
 const line=states.slice(0,day).map((v,i)=>`${x(i)},${y(v)}`).join(' ');
 const dots=states.slice(0,day).map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="${i===day-1?6:3.5}" class="vx-f-orange"/>`).join('');
 const weightBars=weights.map((w,i)=>`<rect x="${x(i)-15}" y="${318-w*100}" width="30" height="${Math.max(w*100,.6)}" rx="3" class="vx-f-pink"/><text x="${x(i)}" y="${312-w*100}" class="vx-t-small" text-anchor="middle">${w>=.005?pct(w):'≈0'}</text>`).join('');
 const now=states[day-1];
 return svg(620,330,`Entregas de ${day} días, memoria de ${num(now,1)} cajas`,`
  <text x="20" y="14" class="vx-t-label">Entradas: cajas por día (azul) · Memoria tras cada lectura (naranja)</text>
  <line x1="40" y1="170" x2="600" y2="170" class="vx-axis"/>${bars}
  <polyline points="${line}" class="vx-l-orange"/>${dots}
  <text x="${day>7?x(day-1)-12:x(day-1)+12}" y="${y(now)+22}" class="vx-t-strong vx-tc-orange" text-anchor="${day>7?'end':'start'}">memoria ${num(now,1)}</text>
  <text x="20" y="212" class="vx-t-label">¿Cuánto pesa cada día en la memoria de hoy? (rosado)</text>
  <line x1="40" y1="318" x2="600" y2="318" class="vx-axis"/>${weightBars}`)+
 `<p class="vx-readout">Tras leer <b>${day}</b> ${day===1?'día':'días'} conservando el <b>${keep} %</b>, la memoria vale <b>${num(now,1)}</b>. ${day>1?`El día 1 pesa <b>${pct(weights[0],weights[0]<.01?2:0)}</b> y el día ${day} pesa <b>${pct(weights[day-1])}</b>.`:'Solo ha visto un día.'} ${keep>=80?'Recuerda mucho del pasado, pero reacciona despacio a lo nuevo.':keep<=20?'Reacciona rápido, pero casi no recuerda el pasado.':'Lo reciente domina; lo lejano se va borrando.'}</p>`;
};

DRAW.gates=({forget,input,output})=>{
 const previous=.8,candidate=.5,f=forget/100,i=input/100,o=output/100,r=lstmStep({previous,candidate,forget:f,input:i,output:o});
 const valve=(x,y,open,color,label,vertical=false)=>{const size=46,fill=size*open;return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="8" class="vx-valve"/><rect x="${vertical?x:x}" y="${y+size-fill}" width="${size}" height="${fill}" rx="8" class="vx-f-${color}" opacity=".85"/><text x="${x+size/2}" y="${y+size/2+5}" class="vx-t-strong" text-anchor="middle">${Math.round(open*100)} %</text><text x="${x+size/2}" y="${y-8}" class="vx-t-small vx-tc-${color}" text-anchor="middle">${label}</text>`;};
 const box=(x,y,w,title,value,color)=>`<rect x="${x}" y="${y}" width="${w}" height="58" rx="10" class="vx-box vx-b-${color}"/><text x="${x+w/2}" y="${y+22}" class="vx-t-small" text-anchor="middle">${title}</text><text x="${x+w/2}" y="${y+46}" class="vx-t-big" text-anchor="middle">${value}</text>`;
 return svg(660,250,`Celda LSTM: memoria nueva ${num(r.memory)}, salida ${num(r.shown)}`,`${arrowDefs}
  ${box(8,40,118,'Memoria anterior',num(previous),'violet')}
  <line x1="126" y1="69" x2="150" y2="69" class="vx-flow" marker-end="url(#vx-arrow)"/>
  ${valve(152,46,f,'red','Olvido')}
  <line x1="198" y1="69" x2="246" y2="69" class="vx-flow" marker-end="url(#vx-arrow)"/><text x="222" y="60" class="vx-t-small" text-anchor="middle">${num(r.kept)}</text>
  <circle cx="264" cy="69" r="16" class="vx-node"/><text x="264" y="75" class="vx-t-big" text-anchor="middle">+</text>
  ${box(205,186,118,'Información nueva',num(candidate),'teal')}
  <line x1="264" y1="186" x2="264" y2="160" class="vx-flow" marker-end="url(#vx-arrow)"/>
  ${valve(241,112,i,'green','')}<text x="296" y="140" class="vx-t-small vx-tc-green">Entrada</text>
  <line x1="264" y1="112" x2="264" y2="88" class="vx-flow" marker-end="url(#vx-arrow)"/><text x="232" y="104" class="vx-t-small" text-anchor="end">${num(r.added)}</text>
  <line x1="280" y1="69" x2="318" y2="69" class="vx-flow" marker-end="url(#vx-arrow)"/>
  ${box(320,40,118,'Memoria nueva',num(r.memory),'violet')}
  <line x1="438" y1="69" x2="466" y2="69" class="vx-flow" marker-end="url(#vx-arrow)"/>
  ${valve(468,46,o,'blue','Salida')}
  <line x1="514" y1="69" x2="540" y2="69" class="vx-flow" marker-end="url(#vx-arrow)"/>
  ${box(542,40,110,'Lo que muestra',num(r.shown),'orange')}`)+
 `<p class="vx-readout">Memoria nueva = <b class="vx-tc-red">${num(f)}</b> × ${num(previous)} + <b class="vx-tc-green">${num(i)}</b> × ${num(candidate)} = <b>${num(r.memory)}</b>. Lo que muestra = <b class="vx-tc-blue">${num(o)}</b> × tanh(${num(r.memory)}) = <b>${num(r.shown)}</b>.</p>`;
};

const queryOf=s=>[s.rain?1:0,s.market?1:0];
DRAW.attention=s=>{
 const q=queryOf(s),keys=ATTENTION_DAYS.map(d=>d.key),values=ATTENTION_DAYS.map(d=>d.value),a=attention(q,keys,values,s.temp/100);
 const words=k=>`${k[0]?'llovió':'sin lluvia'} · ${k[1]?'mercado':'sin mercado'}`;
 const days=ATTENTION_DAYS.map((d,i)=>{const y=8+i*73,c=DAY_COLORS[i];return `<line x1="150" y1="150" x2="410" y2="${y+30}" class="vx-s-${c}" stroke-width="${2+a.weights[i]*26}" stroke-linecap="round" opacity=".8"/><rect x="295" y="${(150+y+30)/2-12+(i-1.5)*6}" width="50" height="22" rx="11" class="vx-pill"/><text x="320" y="${(150+y+30)/2+4+(i-1.5)*6}" class="vx-t-strong" text-anchor="middle">${pct(a.weights[i])}</text><rect x="410" y="${y}" width="200" height="60" rx="10" class="vx-box vx-b-${c}"/><text x="422" y="${y+19}" class="vx-t-strong">${d.name} · K = [${d.key.join(', ')}]</text><text x="422" y="${y+36}" class="vx-t-small">${words(d.key)}</text><text x="422" y="${y+52}" class="vx-t-small">V = ${d.value} cajas</text>`;}).join('');
 const bar=a.contributions.map((c,i)=>`<span class="vx-bg-${DAY_COLORS[i]}" style="flex:${Math.max(c,.01)}" title="${ATTENTION_DAYS[i].name}">${c/a.output>.09?num(c,1):''}</span>`).join('');
 const rows=ATTENTION_DAYS.map((d,i)=>`<tr><th scope="row"><span class="vx-dot vx-bg-${DAY_COLORS[i]}"></span>${d.name}</th><td>${num(a.scores[i])}</td><td>${pct(a.weights[i],1)}</td><td>${d.value}</td><td>${num(a.contributions[i])}</td></tr>`).join('');
 return svg(620,300,`Atención desde la consulta hacia cuatro días; resumen ${num(a.output,1)} cajas`,`
  <rect x="10" y="105" width="140" height="90" rx="12" class="vx-box vx-b-violet"/><text x="80" y="128" class="vx-t-strong" text-anchor="middle">Consulta: mañana</text><text x="80" y="150" class="vx-t-big" text-anchor="middle">Q = [${q.join(', ')}]</text><text x="80" y="172" class="vx-t-small" text-anchor="middle">${q[0]?'lloverá':'sin lluvia'}</text><text x="80" y="186" class="vx-t-small" text-anchor="middle">${q[1]?'habrá mercado':'sin mercado'}</text>${days}`)+
 `<div class="vx-mix"><span class="vx-mix-label">Aportes que se suman</span><div class="vx-stack">${bar}</div><span class="vx-mix-total">= <b>${num(a.output,1)}</b> cajas</span></div>
 <div class="vx-table-wrap"><table class="vx-table"><thead><tr><th scope="col">Registro</th><th scope="col">Parecido Q·K ÷ √2</th><th scope="col">Peso (softmax)</th><th scope="col">Valor</th><th scope="col">Aporte = peso × valor</th></tr></thead><tbody>${rows}</tbody></table></div>
 <p class="vx-readout">${q[0]+q[1]===0?'Con Q = [0, 0] ningún día se parece más que otro: todos pesan 25 % y el resumen es el promedio simple.':`El resumen se inclina hacia los días que comparten condiciones con la consulta. ${s.temp<100?'Con temperatura baja, el reparto se concentra en los más parecidos.':s.temp>100?'Con temperatura alta, el reparto se aplana.':''}`}</p>`;
};

DRAW.selfattention=s=>{
 const keys=ATTENTION_DAYS.map(d=>d.key),m=selfAttention(keys,s.temp/100),cell=58,x0=130,y0=46;
 const head=ATTENTION_DAYS.map((d,j)=>`<text x="${x0+j*cell+cell/2}" y="${y0-10}" class="vx-t-small" text-anchor="middle">${d.name}</text>`).join('');
 const body=m.map((row,i)=>`<text x="${x0-10}" y="${y0+i*cell+cell/2+4}" class="vx-t-small" text-anchor="end">${ATTENTION_DAYS[i].name} pregunta</text>`+row.map((w,j)=>`<rect x="${x0+j*cell+2}" y="${y0+i*cell+2}" width="${cell-4}" height="${cell-4}" rx="8" class="vx-f-violet" fill-opacity="${.08+w*.92}"/><text x="${x0+j*cell+cell/2}" y="${y0+i*cell+cell/2+5}" class="vx-t-strong ${w>.45?'vx-t-on':''}" text-anchor="middle">${pct(w)}</text>`).join('')).join('');
 return svg(400,290,'Matriz de autoatención entre los cuatro días',`<text x="${x0+cell*2}" y="14" class="vx-t-label" text-anchor="middle">… mira a →</text>${head}${body}`);
};

const TOKENS=[6,2,5,3];
const STAGES=[
 ['Tokens','Partimos la entrada en unidades. Aquí cada número es un token.'],
 ['Embedding','Cada token se convierte en un vector: una lista de números que la red puede comparar. En un modelo real esos números se aprenden.'],
 ['Posición','A cada vector se le suma una señal distinta según su lugar. Sin ella, el modelo no sabría cuál iba primero.'],
 ['Autoatención','Cada token consulta a todos los demás y decide cuánto mirar a cada uno. Cada fila suma 100 %.'],
 ['Red por posición','La mezcla pasa por una red pequeña, posición por posición. Un atajo suma la entrada original y una normalización mantiene estables los números.'],
 ['Salida','Una última capa, la cabeza, convierte el resultado en lo que pide la tarea: una clase, un número o el siguiente token. Sus pesos se aprenden entrenando. Si la tarea es predecir el siguiente token y el ciclo se repite, tienes un modelo de lenguaje.']
];
const vectorBars=(x,y,v,color,scale=16)=>v.map((value,d)=>`<rect x="${x+d*16}" y="${value>=0?y-value*scale:y}" width="12" height="${Math.abs(value)*scale}" rx="3" class="vx-f-${color}"/>`).join('')+`<line x1="${x-4}" y1="${y}" x2="${x+32}" y2="${y}" class="vx-axis"/>`;
DRAW.pipeline=({stage})=>{
 const enc=encodeSequence(TOKENS,true),cx=i=>150+i*110;
 const chips=TOKENS.map((t,i)=>`<rect x="${cx(i)-24}" y="74" width="48" height="40" rx="10" class="vx-box vx-b-blue"/><text x="${cx(i)}" y="101" class="vx-t-big" text-anchor="middle">${t}</text>`).join('');
 let detail='';
 if(stage===1)detail=TOKENS.map((t,i)=>`<text x="${cx(i)}" y="140" class="vx-t-small" text-anchor="middle">lugar ${i+1}</text>`).join('');
 if(stage===2)detail=TOKENS.map((t,i)=>{const e=embedToken(t);return vectorBars(cx(i)-14,190,e,'teal')+`<text x="${cx(i)}" y="214" class="vx-t-small" text-anchor="middle">[${num(e[0],1)}; ${num(e[1],1)}]</text>`;}).join('');
 if(stage===3)detail=TOKENS.map((t,i)=>{const e=embedToken(t),p=positionSignal(i),v=enc.vectors[i];return vectorBars(cx(i)-14,166,e,'teal',14)+`<text x="${cx(i)}" y="196" class="vx-t-strong" text-anchor="middle">+</text>`+vectorBars(cx(i)-14,222,p,'amber',14)+`<text x="${cx(i)}" y="252" class="vx-t-strong" text-anchor="middle">=</text>`+vectorBars(cx(i)-14,300,v,'violet',14);}).join('')+`<text x="20" y="160" class="vx-t-small vx-tc-teal">embedding</text><text x="20" y="218" class="vx-t-small vx-tc-amber">posición</text><text x="20" y="290" class="vx-t-small vx-tc-violet">suma</text>`;
 if(stage===4)detail=enc.weights.map((row,i)=>row.map((w,j)=>`<rect x="${cx(j)-24}" y="${124+i*26}" width="48" height="23" rx="5" class="vx-f-violet" fill-opacity="${.08+w*.92}"/><text x="${cx(j)}" y="${140+i*26}" class="vx-t-small ${w>.45?'vx-t-on':''}" text-anchor="middle">${pct(w)}</text>`).join('')+`<text x="${cx(0)-34}" y="${140+i*26}" class="vx-t-small" text-anchor="end">${TOKENS[i]} mira a</text>`).join('');
 if(stage===5)detail=`${arrowDefs}`+[['Mezcla de atención','violet'],['+ entrada original (atajo)','teal'],['Normalizar','amber'],['Red pequeña por posición','pink']].map(([label,color],i)=>`<rect x="${20+i*150}" y="140" width="132" height="46" rx="10" class="vx-box vx-b-${color}"/><text x="${86+i*150}" y="168" class="vx-t-small" text-anchor="middle">${label}</text>${i<3?`<line x1="${152+i*150}" y1="163" x2="${168+i*150}" y2="163" class="vx-flow" marker-end="url(#vx-arrow)"/>`:''}`).join('');
 if(stage===6)detail=`${arrowDefs}`+TOKENS.map((t,i)=>vectorBars(cx(i)-14,176,enc.mixed[i],'violet')).join('')+`<line x1="500" y1="160" x2="528" y2="160" class="vx-flow" marker-end="url(#vx-arrow)"/><rect x="532" y="134" width="80" height="52" rx="10" class="vx-box vx-b-orange"/><text x="572" y="156" class="vx-t-strong" text-anchor="middle">Cabeza</text><text x="572" y="174" class="vx-t-small" text-anchor="middle">→ respuesta</text>`;
 return svg(620,stage===3?262:172,`Recorrido de un Transformer, etapa ${stage}: ${STAGES[stage-1][0]}`,`<g transform="translate(0,-62)">${stage<5||stage===6?chips:''}${detail}</g>`)+`<p class="vx-readout"><b>${stage}. ${STAGES[stage-1][0]}.</b> ${STAGES[stage-1][1]}</p>`;
};

DRAW.order=({position})=>{
 const a=TOKENS,b=[...TOKENS].reverse(),A=encodeSequence(a,position),B=encodeSequence(b,position),same=sameSummary(A.summary,B.summary,1e-9);
 const side=(x,title,tokens,enc)=>`<text x="${x+110}" y="18" class="vx-t-strong" text-anchor="middle">${title}</text>`+tokens.map((t,i)=>`<rect x="${x+20+i*48}" y="28" width="40" height="34" rx="8" class="vx-box vx-b-blue"/><text x="${x+40+i*48}" y="51" class="vx-t-big" text-anchor="middle">${t}</text>`).join('')+enc.weights.map((row,i)=>row.map((w,j)=>`<rect x="${x+20+j*48}" y="${74+i*24}" width="40" height="21" rx="5" class="vx-f-violet" fill-opacity="${.08+w*.92}"/><text x="${x+40+j*48}" y="${89+i*24}" class="vx-t-small ${w>.45?'vx-t-on':''}" text-anchor="middle">${pct(w)}</text>`).join('')).join('')+`<text x="${x+110}" y="196" class="vx-t-small" text-anchor="middle">Resumen de la secuencia</text><text x="${x+110}" y="220" class="vx-t-big ${same?'vx-tc-red':'vx-tc-green'}" text-anchor="middle">[${num(enc.summary[0],3)}; ${num(enc.summary[1],3)}]</text>`;
 return svg(620,236,`Comparación de dos órdenes ${position?'con':'sin'} señal de posición: resúmenes ${same?'idénticos':'distintos'}`,`${side(20,'Orden original',a,A)}${side(340,'Orden invertido',b,B)}<text x="310" y="124" class="vx-t-big" text-anchor="middle">${same?'=':'≠'}</text>`)+
 `<p class="vx-verdict ${same?'is-bad':'is-good'}">${same?'<b>Sin posición, los dos resúmenes son idénticos.</b> La atención trata la entrada como una bolsa de números: no puede saber si 6 iba primero o último.':'<b>Con posición, los resúmenes son distintos.</b> Ahora el modelo sí tiene con qué aprender una tarea que depende del orden, como «¿el primero es mayor que el último?».'}</p>`;
};

/* ---------- Figuras: Encuentro 4 ---------- */

const CLASS_COLOR={naranja:'blue',aguacate:'pink'};
const fruit=o=>{const [x1,y1,x2,y2]=o.box,cx=(x1+x2)/2,cy=(y1+y2)/2,rx=(x2-x1)/2,ry=(y2-y1)/2;
 return o.cls==='naranja'?`<circle cx="${cx}" cy="${cy}" r="${rx*.94}" fill="#f59e0b"/><circle cx="${cx-rx*.3}" cy="${cy-ry*.32}" r="${rx*.22}" fill="#fde68a" opacity=".8"/><path d="M${cx} ${cy-ry*.9}q${rx*.35} ${-ry*.35} ${rx*.6} ${-ry*.05}q${-rx*.3} ${ry*.3} ${-rx*.6} ${ry*.05}" fill="#15803d"/>`
  :`<ellipse cx="${cx}" cy="${cy}" rx="${rx*.86}" ry="${ry*.96}" fill="#365314"/><ellipse cx="${cx}" cy="${cy+ry*.06}" rx="${rx*.66}" ry="${ry*.78}" fill="#bef264"/><circle cx="${cx}" cy="${cy+ry*.26}" r="${rx*.3}" fill="#92400e"/>`;};
const sceneBase=()=>`<rect width="100" height="100" rx="3" fill="#fef3c7"/>${[20,40,60,80].map(v=>`<line x1="0" y1="${v}" x2="100" y2="${v}" stroke="#fcd34d" stroke-width=".5"/>`).join('')}<rect x=".8" y=".8" width="98.4" height="98.4" rx="3" fill="none" stroke="#b45309" stroke-width="1.6"/>${SCENE.objects.map(fruit).join('')}`;
const tag=(b,text,color)=>{const w=text.length*1.9+2.4,y=Math.max(b[1]-5,.6);return `<rect x="${b[0]}" y="${y}" width="${w}" height="4.6" rx="1" class="vx-f-${color}"/><text x="${b[0]+1.2}" y="${y+3.5}" class="vx-t-tag">${text}</text>`;};
const boxRect=(p,color,extra='')=>`<rect x="${p.box[0]}" y="${p.box[1]}" width="${p.box[2]-p.box[0]}" height="${p.box[3]-p.box[1]}" rx="1" fill="none" class="vx-s-${color}" stroke-width="1" ${extra}/>`;

DRAW.detector=({grid,conf,nms})=>{
 const c=conf/100,r=detect(SCENE,c,nms,.5),real=SCENE.objects.length,final=r.kept.length;
 const cells=grid?SCENE.objects.map(o=>{const cx=(o.box[0]+o.box[2])/2,cy=(o.box[1]+o.box[3])/2;return `<rect x="${Math.floor(cx/20)*20}" y="${Math.floor(cy/20)*20}" width="20" height="20" fill="#facc15" opacity=".45"/><circle cx="${cx}" cy="${cy}" r="1.4" fill="#111"/>`;}).join('')+[20,40,60,80].map(v=>`<line x1="${v}" y1="0" x2="${v}" y2="100" class="vx-grid"/><line x1="0" y1="${v}" x2="100" y2="${v}" class="vx-grid"/>`).join(''):'';
 const removed=r.removed.map(p=>boxRect(p,'ghost','stroke-dasharray="2 1.5" opacity=".9"')).join('');
 const kept=r.kept.map(p=>boxRect(p,CLASS_COLOR[p.cls])+tag(p.box,`${p.id} ${num(p.conf)}`,CLASS_COLOR[p.cls])).join('');
 const message=final>real?'Sobran cajas: hay repetidas o falsas alarmas.':final<real?'Faltan objetos: el corte dejó fuera propuestas correctas.':'Hay tantas cajas como objetos. El siguiente tema comprueba si además están bien puestas.';
 const list=r.kept.map(p=>`<li><span class="vx-dot vx-bg-${CLASS_COLOR[p.cls]}"></span><b>${p.id}</b> ${p.cls} · ${num(p.conf)} · [${p.box.join(', ')}]</li>`).join('');
 return `<div class="vx-split"><div class="vx-scene"><svg class="vx-svg" viewBox="0 0 100 100" role="img" aria-label="Canastilla con ${real} frutos y ${final} cajas finales">${sceneBase()}${cells}${removed}${kept}</svg></div>
 <div class="vx-side"><ol class="vx-funnel"><li><b>${SCENE.proposals.length}</b><span>propuestas del modelo</span></li><li><b>${r.passed.length}</b><span>con confianza &gt; ${num(c)}</span></li><li class="is-final"><b>${final}</b><span>${nms?'tras quitar repetidas':'sin quitar repetidas'}</span></li></ol>
 <p class="vx-truth">Frutos reales en la canastilla: <b>${real}</b></p><p class="vx-verdict ${final===real?'is-good':'is-warn'}">${message}</p>
 <p class="vx-legend"><span class="vx-dot vx-bg-blue"></span>naranja <span class="vx-dot vx-bg-pink"></span>aguacate${nms&&r.removed.length?' <span class="vx-dash"></span>repetida descartada':''}</p></div></div>
 <details class="vx-rows"><summary>Ver el registro: una fila por caja final (${final})</summary><ul>${list||'<li>Ninguna caja supera el corte.</li>'}</ul></details>`;
};

const REFERENCE=[10,20,50,60];
DRAW.iou=({dx,dy})=>{
 const p=[REFERENCE[0]+dx,REFERENCE[1]+dy,REFERENCE[2]+dx,REFERENCE[3]+dy],o=overlap(REFERENCE,p),ok=o.iou>=.5,s=o.shared;
 return `<div class="vx-split"><div class="vx-scene vx-drag" data-vx-drag title="Arrastra la caja naranja"><svg class="vx-svg" viewBox="0 0 100 85" role="img" aria-label="Referencia azul y propuesta naranja con IoU ${num(o.iou)}"><rect width="100" height="85" rx="3" class="vx-f-soft"/>${[20,40,60,80].map(v=>`<line x1="${v}" y1="0" x2="${v}" y2="85" class="vx-grid"/>`).join('')}${[20,40,60,80].map(v=>`<line x1="0" y1="${v}" x2="100" y2="${v}" class="vx-grid"/>`).join('')}
 <rect x="10" y="20" width="40" height="40" class="vx-f-blue" fill-opacity=".28"/><rect x="10" y="20" width="40" height="40" fill="none" class="vx-s-blue" stroke-width="1"/>
 <rect x="${p[0]}" y="${p[1]}" width="40" height="40" class="vx-f-orange" fill-opacity=".22"/>${s?`<rect x="${s[0]}" y="${s[1]}" width="${s[2]-s[0]}" height="${s[3]-s[1]}" class="vx-f-violet" fill-opacity=".75"/>`:''}
 <rect x="${p[0]}" y="${p[1]}" width="40" height="40" fill="none" class="vx-s-orange" stroke-width="1.2"/>
 <text x="11" y="18" class="vx-t-tag vx-tc-blue">referencia</text><text x="${p[0]+1}" y="${p[1]+44.5}" class="vx-t-tag vx-tc-orange">propuesta</text></svg></div>
 <div class="vx-side"><dl class="vx-areas"><div><dt><span class="vx-dot vx-bg-violet"></span>Área común</dt><dd>${num(o.common,0)} px²</dd></div><div><dt><span class="vx-dot vx-bg-blue"></span><span class="vx-dot vx-bg-orange"></span>Unión</dt><dd>${num(o.union,0)} px²</dd></div></dl>
 <p class="vx-iou">IoU = ${num(o.common,0)} ÷ ${num(o.union,0)} = <b>${num(o.iou)}</b></p>
 <div class="vx-meter" aria-hidden="true"><span style="width:${o.iou*100}%" class="${ok?'vx-bg-green':'vx-bg-red'}"></span><i></i></div><p class="vx-meter-label">mínimo para aceptar: 0,50</p>
 <p class="vx-verdict ${ok?'is-good':'is-bad'}">${ok?'<b>TP · acierto.</b> La propuesta coincide lo suficiente con la referencia.':'<b>FP + FN.</b> La propuesta no coincide: cuenta como falsa alarma y, además, el objeto real queda sin detectar.'}</p></div></div>`;
};

DRAW.pr=({conf})=>{
 const c=conf/100,e=evaluateScene(SCENE,c),curve=precisionRecallCurve(SCENE).filter(p=>p.precision!==null);
 const boxes=e.rows.map(r=>boxRect(r,r.result==='TP'?'green':'red')+tag(r.box,`${r.result} ${num(r.conf)}`,r.result==='TP'?'green':'red')).join('');
 const missed=e.missed.map(o=>`<rect x="${o.box[0]-1.5}" y="${o.box[1]-1.5}" width="${o.box[2]-o.box[0]+3}" height="${o.box[3]-o.box[1]+3}" rx="2" fill="none" class="vx-s-amber" stroke-width="1.1" stroke-dasharray="2.5 1.5"/>`+tag([o.box[0]-1.5,o.box[1]-1.5],'FN sin detectar','amber')).join('');
 const x=r=>24+r*120,y=p=>136-p*120,point=`${x(e.recall??0)},${y(e.precision??1)}`;
 const bar=(label,value,formula,color)=>`<div class="vx-metric"><span>${label}</span><div class="vx-meter"><span class="vx-bg-${color}" style="width:${(value??0)*100}%"></span></div><b>${value===null?'sin definir':pct(value)}</b><small>${formula}</small></div>`;
 return `<div class="vx-split"><div class="vx-scene"><svg class="vx-svg" viewBox="0 0 100 100" role="img" aria-label="Evaluación con corte ${num(c)}: ${e.tp} aciertos, ${e.fp} falsas alarmas, ${e.fn} sin detectar">${sceneBase()}${boxes}${missed}</svg></div>
 <div class="vx-side"><ul class="vx-counts"><li class="vx-bg-green"><b>${e.tp}</b> TP · aciertos</li><li class="vx-bg-red"><b>${e.fp}</b> FP · falsas alarmas</li><li class="vx-bg-amber"><b>${e.fn}</b> FN · sin detectar</li></ul>
 ${bar('Precisión',e.precision,`de las cajas mostradas, ¿cuántas acertaron? ${e.tp} ÷ ${e.tp+e.fp}`,'blue')}${bar('Recall',e.recall,`de los frutos reales, ¿cuántos encontró? ${e.tp} ÷ ${e.tp+e.fn}`,'pink')}
 <svg class="vx-svg vx-curve" viewBox="0 0 160 160" role="img" aria-label="Curva precisión-recall"><line x1="24" y1="136" x2="148" y2="136" class="vx-axis"/><line x1="24" y1="136" x2="24" y2="12" class="vx-axis"/><polyline points="${curve.map(p=>`${x(p.recall)},${y(p.precision)}`).join(' ')}" class="vx-l-violet"/><circle cx="${point.split(',')[0]}" cy="${point.split(',')[1]}" r="5" class="vx-f-orange"/><text x="86" y="154" class="vx-t-small" text-anchor="middle">recall →</text><text x="12" y="76" class="vx-t-small" text-anchor="middle" transform="rotate(-90 12 76)">precisión →</text></svg></div></div>
 <p class="vx-readout">${c>=.6?'Corte alto: casi todo lo que muestra es correcto (precisión alta), pero se le escapan frutos (recall bajo).':c<=.3?'Corte bajo: encuentra todos los frutos (recall alto), pero deja pasar falsas alarmas (precisión baja).':'Corte medio: equilibra aciertos y olvidos.'} El punto naranja recorre la curva al mover el corte.</p>`;
};

DRAW.review=({cut,price,truth})=>{
 const c=cut/100,{scores,defects}=REVIEW_UNITS,r=reviewCost(REVIEW_UNITS,c,1,price),best=cheapestCut(REVIEW_UNITS,1,price),curve=costCurve(REVIEW_UNITS,1,price);
 const x=v=>50+v*520,stack={};
 const beans=scores.map((s,i)=>{const level=stack[s]=(stack[s]??-1)+1,cy=126-level*42,cx=x(s),bad=defects[i]===1;return `<ellipse cx="${cx}" cy="${cy}" rx="13" ry="15" class="${r.review[i]?'vx-f-amber':'vx-f-green'}"/>${truth&&bad?`<ellipse cx="${cx}" cy="${cy}" rx="17" ry="19" fill="none" class="vx-s-red" stroke-width="3.5"/>`:''}<text x="${cx}" y="${cy+5}" class="vx-t-strong vx-t-on" text-anchor="middle">${i+1}</text>`;}).join('');
 const ticks=[0,.2,.4,.6,.8,1].map(v=>`<line x1="${x(v)}" y1="150" x2="${x(v)}" y2="156" class="vx-axis"/><text x="${x(v)}" y="170" class="vx-t-small" text-anchor="middle">${num(v,1)}</text>`).join('');
 const top=Math.max(...curve.map(p=>p.total),10),cy=v=>120-v/top*100;
 const chart=truth?svg(620,150,`Coste total según el corte; mínimo en ${num(best.cut)}`,`<line x1="50" y1="120" x2="570" y2="120" class="vx-axis"/><line x1="50" y1="${cy(10)}" x2="570" y2="${cy(10)}" class="vx-dashline"/><text x="54" y="${cy(10)-6}" class="vx-t-small">revisar todos: 10</text><polyline points="${curve.map(p=>`${x(p.cut)},${cy(p.total)}`).join(' ')}" class="vx-l-violet"/>${curve.map(p=>`<circle cx="${x(p.cut)}" cy="${cy(p.total)}" r="2.5" class="vx-f-violet"/>`).join('')}<circle cx="${x(best.cut)}" cy="${cy(best.total)}" r="7" fill="none" class="vx-s-green" stroke-width="3"/><text x="${x(best.cut)}" y="${cy(best.total)+22}" class="vx-t-small vx-tc-green" text-anchor="middle">más barato: ${best.total}</text><circle cx="${x(c)}" cy="${cy(r.total)}" r="6" class="vx-f-orange"/><text x="50" y="140" class="vx-t-small">corte 0</text><text x="570" y="140" class="vx-t-small" text-anchor="end">corte 1</text>`):'';
 return svg(620,196,`Diez granos ordenados por puntuación con corte ${num(c)}: ${r.reviewed} a revisión`,`
  <rect x="${x(0)-20}" y="8" width="${x(c)-x(0)+20}" height="140" class="vx-f-green" fill-opacity=".1"/><rect x="${x(c)}" y="8" width="${x(1)-x(c)+20}" height="140" class="vx-f-amber" fill-opacity=".14"/>
  <text x="${Math.max(x(0)-12,(x(0)+x(c))/2-30)}" y="24" class="vx-t-strong vx-tc-green">${c>.12?'ACEPTAR':''}</text><text x="${Math.min(x(1)+12,(x(c)+x(1))/2+30)}" y="24" class="vx-t-strong vx-tc-amber" text-anchor="end">${c<.88?'REVISAR':''}</text>
  <line x1="${x(0)-20}" y1="150" x2="${x(1)+20}" y2="150" class="vx-axis"/>${ticks}${beans}
  <line x1="${x(c)}" y1="4" x2="${x(c)}" y2="176" class="vx-s-violet" stroke-width="3"/><text x="${x(c)}" y="190" class="vx-t-strong vx-tc-violet" text-anchor="middle">corte ${num(c)}</text>`)+
 `<div class="vx-cost"><span class="vx-bg-amber"><b>${r.reviewed}</b> revisiones × 1 = ${r.reviewTotal}</span><i>+</i><span class="vx-bg-red">${truth?`<b>${r.accepted}</b> ${r.accepted===1?'defecto aceptado':'defectos aceptados'} × ${price} = ${r.defectTotal}`:'defectos aceptados: <b>?</b>'}</span><i>=</i><span class="vx-cost-total">${truth?`<b>${r.total}</b> puntos`:'<b>?</b>'}</span></div>${chart}
 <p class="vx-readout">${truth?`${r.total<10?`Con este corte gastas <b>${r.total}</b>, menos que revisar los diez (10).`:r.total===10?'Con este corte gastas lo mismo que revisar los diez.':`Con este corte gastas <b>${r.total}</b>, más que revisar los diez (10): ${r.accepted} ${r.accepted===1?'defecto aceptado sale caro':'defectos aceptados salen caros'}.`} ${r.needless?`Revisas ${r.needless} ${r.needless===1?'grano sano':'granos sanos'} sin necesidad.`:''} El corte más barato con estos costes es <b>${num(best.cut)}</b>. Con probabilidades calibradas, la teoría diría revisar desde 1 ÷ ${price} = <b>${num(1/price,3)}</b>${reviewCost(REVIEW_UNITS,1/price,1,price).total===best.total?', que aquí cuesta lo mismo':`, que aquí costaría ${reviewCost(REVIEW_UNITS,1/price,1,price).total}: estas puntuaciones no están calibradas y diez granos son pocos`}.`:'Sin las referencias (qué granos son defectuosos de verdad) no puedes saber cuánto cuesta una regla. Por eso se necesita un conjunto de validación con respuestas conocidas.'}</p>`;
};

/* ---------- Contenido de cada tema ---------- */

const TOPICS={
 'dl-secuencias':{
  opener:'«No es malo, es buenísimo» y «No es buenísimo, es malo» usan las mismas palabras. ¿Qué cambió? Solo el orden. Hoy veremos cómo una red puede tenerlo en cuenta.',
  idea:'Una red recurrente lee una secuencia como tú lees una frase: un elemento después de otro, guardando en una memoria un resumen de lo anterior.',
  analogy:['Teléfono roto','Cada persona repite lo que oyó mezclado con algo nuevo. Tras muchos pasos, el primer mensaje casi desaparece. Eso le pasa a una red recurrente sencilla; la LSTM agrega compuertas para decidir qué conservar.'],
  figures:()=>figure('memory','Figura 1 · La memoria se actualiza al leer y lo lejano se desvanece',
    slider('day','Leer hasta',1,12,1,12)+slider('keep','Cuánto conserva de la memoria anterior',0,95,5,50)+`<button type="button" class="vx-chip vx-play" data-vx-play>▶ Leer los 12 días</button>`,
    'cada barra azul es una entrega. El punto naranja es la memoria después de leerla: una mezcla de la memoria anterior y la entrada de hoy. Las barras rosadas muestran cuánto influye cada día en esa memoria. Sube «conserva» y verás que recuerda más lejos pero reacciona más lento.')
   +figure('gates','Figura 2 · Las tres compuertas de una LSTM',
    slider('forget','Compuerta de olvido',0,100,5,50)+slider('input','Compuerta de entrada',0,100,5,50)+slider('output','Compuerta de salida',0,100,5,100)+`<div class="vx-presets">${preset('Recordar todo',{forget:100,input:0,output:100})}${preset('Borrar y reemplazar',{forget:0,input:100,output:100})}${preset('Mezclar',{forget:50,input:50,output:100})}${preset('Guardar en silencio',{forget:100,input:0,output:0})}</div>`,
    'cada compuerta es una llave entre 0 % (cerrada) y 100 % (abierta). Aquí las mueves tú; en una LSTM real la red calcula las tres en cada paso a partir de la entrada y de su estado, con pesos que aprende entrenando. Fíjate en el «+»: la memoria nueva se arma sumando lo conservado y lo nuevo. Ese camino que suma es lo que evita el desvanecimiento de la figura 1.'),
  cards:[
   ['blue','📈','Secuencia','Datos en los que el orden importa: si lo cambias, cambia el significado.','las entregas de 12 días seguidos, o «el perro persigue al gato» frente a «el gato persigue al perro».'],
   ['orange','🧠','Estado oculto (memoria)','Número o lista de números que resume lo leído hasta ahora. Se actualiza en cada paso.','el punto naranja de la figura 1.'],
   ['teal','🔁','RNN · red neuronal recurrente','Red que repite la misma operación en cada paso: combina la entrada de hoy con el estado anterior.','leer 12 días aplica 12 veces la misma regla.'],
   ['pink','🌫️','Desvanecimiento','En secuencias largas, la huella de los primeros pasos se multiplica muchas veces por números menores que 1 y casi se borra. Pasa dos veces: al leer, la memoria olvida lo lejano; al entrenar, la corrección que debería llegar a los primeros pasos (el gradiente del encuentro 1) también se encoge, y la red no logra aprender relaciones lejanas.','conservando el 50 %, el día 1 pesa 0,02 % tras 12 días.'],
   ['violet','🗄️','LSTM · memoria de largo y corto plazo','Red recurrente con una memoria protegida (estado de celda) y tres compuertas que regulan qué entra, qué se queda y qué sale. Esa memoria se actualiza sumando, no solo multiplicando: por eso lo guardado, y la corrección del entrenamiento, sobreviven muchos más pasos.','la figura 2: con el olvido en 100 %, el 0,80 pasa intacto.'],
   ['red','🚪','Compuerta','Valor entre 0 y 1 que actúa como llave: 0 bloquea, 1 deja pasar todo. Hay tres: olvido, entrada y salida.','olvido en 100 % y entrada en 0 % = «no toques la memoria».'],
   ['amber','🔲','Ventana','Las últimas lecturas que recibe el modelo para predecir la siguiente.','en Colab, 12 lecturas seguidas → predecir la número 13.'],
   ['green','⏱️','Paso de tiempo','Cada posición de la secuencia que la red lee, una después de otra.','el día 5 es el quinto paso; la figura 1 avanza un paso por día.'],
   ['violet','🔒','Estado de celda','La memoria protegida de una LSTM, que las compuertas modifican poco a poco. Es distinta del estado oculto, que es lo que la celda deja ver.','en la figura 2, «Memoria nueva» es el estado de celda y «Lo que muestra» es el estado oculto.'],
   ['teal','〰️','tanh · tangente hiperbólica','Función que lleva cualquier número al rango entre −1 y 1. La LSTM la usa para mantener acotados sus valores.','tanh(0,65) = 0,57.']
  ],
  practice:[
   ['blue','🔮','Pronóstico de un paso','Predecir solo el valor que sigue a la ventana, no toda la serie futura.','con las lecturas 1 a 12 se predice la 13.'],
   ['amber','📏','Línea base','Método sencillo contra el que se compara el modelo. Si el modelo no lo supera, no aporta.','repetir el último valor de la ventana.'],
   ['pink','🎯','MAE · error absoluto medio','Promedio de las distancias entre lo predicho y lo real, sin signo. Cuanto más bajo, mejor.','errores de 0,1, 0,2 y 0,3 dan un MAE de 0,2.'],
   ['orange','🔁','Época','Una pasada completa del modelo por todos los ejemplos de entrenamiento.','la LSTM del cuaderno entrena 90 épocas.'],
   ['red','📉','Pérdida','Número que mide cuánto se equivoca el modelo durante el entrenamiento. Entrenar es ajustar los pesos para bajarla.','el cuaderno usa el error cuadrático medio.']
  ],
  refs:[
   ['Hochreiter, S. y Schmidhuber, J. (1997). Long Short-Term Memory. Neural Computation, 9(8), 1735–1780.','https://doi.org/10.1162/neco.1997.9.8.1735','El artículo que propuso la LSTM y sus compuertas.'],
   ['Bengio, Y., Simard, P. y Frasconi, P. (1994). Learning long-term dependencies with gradient descent is difficult. IEEE Transactions on Neural Networks, 5(2), 157–166.','https://doi.org/10.1109/72.279181','Explica por qué una red recurrente sencilla pierde las dependencias lejanas.'],
   ['Goodfellow, I., Bengio, Y. y Courville, A. (2016). Deep Learning. MIT Press. Capítulo 10: Sequence Modeling: Recurrent and Recursive Nets.','https://www.deeplearningbook.org/contents/rnn.html','Libro de texto de referencia, de lectura libre: redes recurrentes, dependencias largas y LSTM.'],
   ['Zhang, A., Lipton, Z. C., Li, M. y Smola, A. J. (2023). Dive into Deep Learning. Cambridge University Press. Sección 10.1: Long Short-Term Memory (LSTM).','https://d2l.ai/chapter_recurrent-modern/lstm.html','Libro abierto con código ejecutable: explica cada compuerta con figuras y la implementa.'],
   ['PyTorch. Documentación de torch.nn.LSTM.','https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html','La capa que usa el cuaderno, con sus ecuaciones.']
  ],
  colab:'En Colab entrenarás una LSTM de verdad: recibe ventanas de 12 lecturas y aprende sola sus compuertas para pronosticar la siguiente. Compararás su error con el de repetir el último valor.'
 },
 'dl-atencion':{
  idea:'La atención responde una pregunta: de todo lo que tengo guardado, ¿qué se parece más a lo que busco ahora? Lo más parecido participa más en la respuesta.',
  analogy:['Buscar en una biblioteca','Llevas una pregunta (consulta), miras las etiquetas de los libros (claves) y te llevas una mezcla de sus contenidos (valores): más de los que mejor coinciden, menos de los demás.'],
  figures:()=>figure('attention','Figura 1 · Una consulta reparte su atención entre cuatro registros',
    `<div class="vx-presets"><span class="vx-controls-label">Mañana…</span>${toggle('rain','lloverá',true)}${toggle('market','habrá mercado',false)}</div>`+slider('temp','Temperatura del reparto',20,200,10,100),
    'el grosor de cada línea es el peso de atención. Cambia la consulta y fíjate en qué días engordan: los que comparten condiciones. La barra de colores suma los aportes (peso × cajas) para dar el resumen. Baja la temperatura para concentrar la atención; súbela para repartirla.')
   +figure('selfattention','Figura 2 · Autoatención: cada día consulta a todos los demás',
    slider('temp','Temperatura del reparto',20,200,10,100),
    'cada fila es un día que pregunta «¿quién se parece a mí?». Cuanto más oscuro el cuadro, más atención. Cada fila suma 100 %. Así un Transformer relaciona todos los elementos de una secuencia entre sí.'),
  cards:[
   ['green','➡️','Vector','Lista ordenada de números que representa algo. El lugar de cada número importa.','la clave del día 3 es el vector [1, 1].'],
   ['violet','❓','Consulta (Q, query)','Lo que estoy buscando ahora, expresado como una lista de números.','«mañana lloverá y no habrá mercado» → Q = [1, 0].'],
   ['blue','🏷️','Clave (K, key)','La etiqueta de cada registro guardado, con el mismo formato que la consulta para poder compararlas.','el día 3 llovió y hubo mercado → K = [1, 1].'],
   ['teal','📦','Valor (V, value)','El contenido que aporta cada registro si resulta elegido.','el día 3 se entregaron 30 cajas → V = 30.'],
   ['amber','📐','Puntuación de parecido','Número que mide cuánto coincide la consulta con una clave. Se calcula con el producto punto: multiplicar componente a componente y sumar.','[1, 0]·[1, 1] = 1×1 + 0×1 = 1.'],
   ['pink','🥧','Softmax','Operación que convierte las puntuaciones en porcentajes positivos que suman 100 %.','puntuaciones 0,71 y 0 → pesos 67 % y 33 %.'],
   ['green','⚖️','Peso de atención','El porcentaje con que participa cada registro en la respuesta. Un peso alto indica parecido, no que la fuente sea más confiable.','el grosor de las líneas de la figura 1.'],
   ['red','🌡️','Temperatura','Control que hace el reparto más concentrado (baja) o más parejo (alta).','con 0,2 casi toda la atención va al más parecido.'],
   ['orange','🔄','Autoatención','Atención de una secuencia sobre sí misma: cada elemento es consulta y también clave.','la matriz de la figura 2.'],
   ['teal','🧪','Mezcla ponderada','Suma de los valores multiplicados cada uno por su peso. Es la salida de la atención.','0,67 × 10 + 0,33 × 20 = 13,3 cajas.'],
   ['amber','➗','Escalado (dividir entre √d)','La puntuación se divide entre la raíz del número de componentes de los vectores para que no crezca cuando son largos.','aquí los vectores tienen 2 componentes: se divide entre √2 ≈ 1,41.'],
   ['violet','▦','Matriz de atención','Tabla con el peso que cada elemento da a cada uno de los demás: una fila por consulta, y cada fila suma 100 %.','la cuadrícula morada de la figura 2.']
  ],
  practice:[
  ],
  refs:[
   ['Bahdanau, D., Cho, K. y Bengio, Y. (2015). Neural Machine Translation by Jointly Learning to Align and Translate. ICLR 2015.','https://arxiv.org/abs/1409.0473','Introdujo la atención para que un traductor consulte toda la frase de origen.'],
   ['Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł. y Polosukhin, I. (2017). Attention Is All You Need. NeurIPS 2017.','https://arxiv.org/abs/1706.03762','Define la atención de producto punto escalado con consulta, clave y valor que calcula la figura.'],
   ['Zhang, A., Lipton, Z. C., Li, M. y Smola, A. J. (2023). Dive into Deep Learning. Cambridge University Press. Capítulo 11: Attention Mechanisms and Transformers.','https://d2l.ai/chapter_attention-mechanisms-and-transformers/','Libro abierto con código ejecutable: consultas, claves y valores desde la intuición hasta el cálculo.']
  ],
  colab:'En Colab calcularás esta misma operación con matrices: Q, K y V, el producto punto escalado y softmax. Los días 1 y 2 de la figura son exactamente los registros A = 10 y B = 20 del cuaderno.'
 },
 'dl-transformers':{
  idea:'Un Transformer no lee paso a paso: mira toda la secuencia a la vez y deja que cada elemento consulte a los demás con atención. Como así se pierde el orden, se le devuelve con una señal de posición.',
  analogy:['Una mesa redonda','Todos conversan con todos al mismo tiempo (atención) en lugar de pasarse el mensaje uno a uno. Pero si las sillas no están numeradas, nadie sabe quién habló primero: por eso hace falta la posición.'],
  figures:()=>figure('pipeline','Figura 1 · El recorrido de la información por un Transformer',
    `<div class="vx-presets">${STAGES.map(([name],i)=>preset(`${i+1}. ${name}`,{stage:i+1},'stage')).join('')}</div>`,
    'pulsa cada etapa en orden. La secuencia de ejemplo es 6, 2, 5, 3. Las barras son los números de cada vector; el mapa morado es la atención entre tokens.')
   +figure('order','Figura 2 · Experimento: ¿qué pasa si quitamos la posición?',
    toggle('position','Sumar la señal de posición',false),
    'las dos secuencias tienen los mismos números en orden contrario. Compara los dos resúmenes con la posición apagada y encendida. En esta cuenta el resumen es el promedio de las salidas de la atención.'),
  cards:[
   ['violet','🏗️','Transformer','Arquitectura de red que procesa toda la secuencia a la vez y relaciona sus elementos con atención, sin leer paso a paso.','las seis etapas de la figura 1.'],
   ['blue','🧩','Token','Unidad en que se parte la entrada: una palabra, un trozo de palabra o, aquí, un número.','la secuencia 6, 2, 5, 3 tiene cuatro tokens.'],
   ['teal','🔢','Embedding','Representación de un token como lista de números (vector), para que la red pueda compararlo y transformarlo. Se aprende durante el entrenamiento.','el token 6 → [0,4; 1,5] en la figura.'],
   ['amber','📍','Codificación posicional','Señal que se suma a cada embedding para indicar su lugar en la secuencia.','sin ella, 6-2-5-3 y 3-5-2-6 producen el mismo resumen.'],
   ['violet','🔄','Autoatención','Cada token consulta a todos los demás y construye una mezcla ponderada. Es la operación del tema anterior, aplicada a toda la secuencia.','el mapa morado de la etapa 4.'],
   ['pink','👥','Varias cabezas','Varias atenciones en paralelo; cada una puede fijarse en una relación distinta.','el modelo del cuaderno usa 2 cabezas.'],
   ['green','⚙️','Red por posición (feed-forward)','Red pequeña que transforma cada posición por separado después de la atención.','etapa 5.'],
   ['red','➕','Atajo y normalización','El atajo (conexión residual) suma la entrada a la salida de cada bloque para no perder información; la normalización mantiene los números en un rango estable.','etapa 5.'],
   ['orange','🎯','Encoder y cabeza','El encoder es el conjunto de bloques que produce las representaciones; la cabeza es la capa final que las convierte en la respuesta de la tarea.','en Colab la cabeza elige entre clase 0 y clase 1.'],
   ['blue','🧱','Bloque del encoder','La unidad que se repite en un Transformer: autoatención y red por posición, cada una con su atajo y su normalización.','el modelo del cuaderno usa un solo bloque.'],
   ['amber','⚡','Paralelo y coste','Como no lee paso a paso, un Transformer procesa todas las posiciones a la vez y conecta dos elementos cualesquiera con una sola operación de atención; una RNN necesita tantos pasos como distancia haya entre ellos. El precio: cada token mira a todos, así que la cuenta crece con el cuadrado de la longitud.','4 tokens dan 16 pesos en el mapa de la etapa 4; 1.000 tokens darían 1.000.000.'],
   ['pink','✍️','Decoder y máscara causal','Variante del bloque en la que cada token solo puede mirar a los anteriores: una máscara tapa los que vienen después. Así se entrena para predecir el siguiente token.','al leer 6, 2, 5 no puede mirar el 3: tiene que predecirlo.'],
   ['green','💬','LLM · modelo de lenguaje grande','«Large Language Model»: Transformer de tipo decoder, con muchos bloques, entrenado con enormes cantidades de texto para predecir el siguiente token. Genera repitiendo un ciclo: predice un token, lo añade a la entrada y vuelve a predecir.','los asistentes conversacionales de IA funcionan así; el modelo del cuaderno es un encoder pequeño que clasifica, no genera.']
  ],
  practice:[
   ['pink','🏷️','Clase y puntuación de clase','La clase es la respuesta posible que el modelo debe elegir; la puntuación indica cuánto se inclina por cada una.','clase 1 = «el primer número es mayor que el último».'],
   ['teal','✂️','Entrenamiento y prueba','Con los ejemplos de entrenamiento se ajustan los pesos; con los de prueba, que el modelo nunca vio, se mide si aprendió la regla.','en el cuaderno ninguna secuencia de prueba aparece en el entrenamiento.'],
   ['green','✅','Exactitud (accuracy)','Fracción de respuestas correctas sobre el total. Va de 0 a 1.','0,95 significa 95 aciertos de cada 100.']
  ],
  refs:[
   ['Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł. y Polosukhin, I. (2017). Attention Is All You Need. NeurIPS 2017.','https://arxiv.org/abs/1706.03762','El artículo que propuso el Transformer: autoatención, varias cabezas y codificación posicional.'],
   ['Bahdanau, D., Cho, K. y Bengio, Y. (2015). Neural Machine Translation by Jointly Learning to Align and Translate. ICLR 2015.','https://arxiv.org/abs/1409.0473','El antecedente: atención añadida a una red recurrente.'],
   ['Zhang, A., Lipton, Z. C., Li, M. y Smola, A. J. (2023). Dive into Deep Learning. Cambridge University Press. Sección 11.6: Self-Attention and Positional Encoding.','https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html','Libro abierto con código ejecutable: por qué la autoatención necesita una señal de posición.']
  ],
  colab:'En Colab entrenarás un Transformer pequeño (embedding, posición, un bloque encoder con 2 cabezas y una cabeza de salida) para decidir si el primer número es mayor que el último, y comprobarás sus respuestas en secuencias que no vio.'
 },
 'dl-yolo':{
  opener:'En la figura de la sección 2 hay una canastilla: mírala tres segundos. ¿Cuántos frutos hay y de qué tipo? Acabas de localizar, nombrar y contar: eso es detectar. Hoy veremos cómo lo hace una red y cómo saber si lo hizo bien.',
  idea:'Un detector responde tres preguntas por cada objeto: ¿dónde está? (caja), ¿qué es? (categoría) y ¿qué tan seguro estoy? (confianza). YOLO, «solo se mira una vez», las responde para toda la imagen en una sola pasada de la red.',
  analogy:['Marcar frutas en una foto','Muchos ayudantes proponen recuadros sobre la foto de la canastilla, cada uno con su grado de seguridad. Después te quedas con los más seguros y quitas los que marcan la misma fruta dos veces.'],
  figures:()=>figure('detector','Figura 1 · De muchas propuestas a un registro limpio',
    slider('conf','Corte de confianza',5,95,5,25)+`<div class="vx-presets">${toggle('grid','Ver la rejilla',false)}${toggle('nms','Quitar repetidas (NMS)',false)}</div>`,
    'empieza con el corte bajo: hay más cajas que frutos. Sube el corte para descartar las inseguras y activa «quitar repetidas» para dejar una caja por fruto. La rejilla muestra en amarillo la celda donde cae el centro de cada fruto: esa zona de la red es la responsable de proponerlo. Ningún corte deja los 5 frutos sin falsas alarmas: por eso el siguiente tema enseña a medir los errores.'),
  cards:[
   ['violet','👁️','YOLO','«You Only Look Once», solo se mira una vez: familia de detectores que predice todas las cajas de la imagen en una sola pasada de la red.','el cuaderno usa un modelo de esta familia.'],
   ['blue','🔎','Detección de objetos','Tarea que localiza y nombra varios objetos en una imagen. Clasificar dice «hay naranjas»; detectar dice «hay una naranja aquí y otra allá».','la canastilla de la figura.'],
   ['orange','⬜','Caja delimitadora','Rectángulo que encierra un objeto. Se escribe con las coordenadas de dos esquinas: [x₁, y₁, x₂, y₂], con el origen arriba a la izquierda.','P1 = [9, 11, 37, 39].'],
   ['pink','🏷️','Categoría','El nombre que el modelo asigna, elegido de la lista con la que fue entrenado. No puede nombrar lo que no está en su lista.','naranja o aguacate.'],
   ['green','📊','Confianza','Puntuación entre 0 y 1 que acompaña a cada caja. Alta no significa correcta: solo que el modelo está más seguro.','P1 tiene 0,92; P11 tiene 0,27.'],
   ['amber','▦','Rejilla','La red divide la imagen en celdas y cada celda propone cajas para los objetos cuyo centro cae en ella. Los modelos actuales usan rejillas de varios tamaños para objetos grandes y pequeños.','las celdas amarillas.'],
   ['violet','✂️','Corte de confianza','Regla para conservar solo las cajas con confianza mayor que un valor elegido.','con corte 0,50 se descarta P3 (0,48).'],
   ['red','🧹','NMS · supresión de no máximos','Limpieza de repetidas: de las cajas de la misma categoría que se montan mucho, conserva la de mayor confianza. Algunos modelos recientes se entrenan para entregar una sola caja por objeto y omiten este paso; el del cuaderno (YOLO26) es uno de ellos y resuelve las repetidas dentro de la red.','P1, P2 y P3 marcan el mismo fruto; queda P1.'],
   ['teal','📌','Propuesta','Cada caja candidata que entrega el modelo antes de filtrar. Una propuesta puede ser correcta, repetida o falsa.','la figura parte de 12 propuestas.'],
   ['green','📐','Píxel y coordenadas','La imagen es una cuadrícula de puntos llamados píxeles. La coordenada x crece hacia la derecha y la y hacia abajo, desde la esquina superior izquierda.','el punto (9, 11) está 9 a la derecha y 11 hacia abajo.'],
   ['teal','🧱','Extractor y cabeza de detección','Un detector reutiliza lo del encuentro 2: una red convolucional extrae mapas de respuestas de la imagen y una cabeza los convierte en cajas, categorías y confianzas. Se entrena comparando sus cajas con referencias anotadas: la pérdida castiga la caja mal ubicada y la categoría equivocada.','el modelo del cuaderno ya trae extractor y cabeza entrenados con COCO.']
  ],
  practice:[
   ['blue','📦','Modelo preentrenado','Red cuyos pesos ya se aprendieron con un conjunto grande de imágenes. Se usa tal como está, sin entrenarla de nuevo.','el cuaderno carga el archivo de pesos yolo26n.pt.'],
   ['amber','🗂️','COCO','«Common Objects in Context»: conjunto de fotos anotadas con 80 categorías de objetos cotidianos con el que se entrenó el modelo del cuaderno.','conoce «persona» y «bus», pero no «café».'],
   ['pink','⚡','Inferencia','Usar un modelo ya entrenado para obtener predicciones sobre datos nuevos, sin cambiar sus pesos.','pasar la foto por el modelo y recibir las cajas.']
  ],
  refs:[
   ['Redmon, J., Divvala, S., Girshick, R. y Farhadi, A. (2016). You Only Look Once: Unified, Real-Time Object Detection. CVPR 2016, 779–788.','https://openaccess.thecvf.com/content_cvpr_2016/html/Redmon_You_Only_Look_CVPR_2016_paper.html','El artículo original de YOLO: rejilla, cajas y confianza en una sola pasada. Acceso abierto en las actas.'],
   ['Ultralytics. Documentación del modo de predicción.','https://docs.ultralytics.com/modes/predict/','Cómo ejecutar el detector que usa el cuaderno y leer sus resultados.']
  ],
  colab:'En Colab ejecutarás un YOLO ya entrenado sobre una fotografía real, convertirás sus cajas en una tabla (categoría, confianza, coordenadas) y compararás cuántas quedan con tres cortes distintos.'
 },
 'dl-evaluacion':{
  idea:'Una caja dibujada no es una caja correcta. Evaluar es comparar cada propuesta con una referencia anotada por una persona y contar aciertos, falsas alarmas y olvidos.',
  analogy:['Calificar un examen de «encierra las frutas»','Necesitas la hoja de respuestas (las referencias) y una regla para decidir cuándo un recuadro cuenta como acierto: cuánto debe coincidir con el de la hoja.'],
  figures:()=>figure('iou','Figura 1 · IoU: cuánto coinciden dos cajas',
    slider('dx','Mover a la derecha',-10,45,1,10)+slider('dy','Mover hacia abajo',-20,25,1,0)+`<div class="vx-presets">${preset('Sin desplazar',{dx:0,dy:0})}${preset('10 px',{dx:10,dy:0})}${preset('30 px',{dx:30,dy:0})}</div>`,
    'arrastra la caja naranja o usa los controles. El morado es el área común; la unión es todo lo cubierto por alguna de las dos cajas, contando lo común una sola vez. IoU es la división de las dos. Los tres botones son los casos del cuaderno.')
   +figure('pr','Figura 2 · Precisión y recall sobre la canastilla del tema anterior',
    slider('conf','Corte de confianza',5,95,5,50),
    'es la misma escena del tema 1, ahora comparada con sus referencias. Verde = acierto (TP), rojo = falsa alarma (FP), ámbar punteado = fruto sin detectar (FN). Mueve el corte: no puedes subir precisión y recall a la vez; eliges un equilibrio.'),
  cards:[
   ['blue','📝','Referencia (anotación)','Caja y categoría correctas, marcadas por una persona. Sin referencias no se puede evaluar.','la caja azul de la figura 1.'],
   ['violet','🔲','IoU · intersección sobre unión','Área común dividida entre el área total cubierta por las dos cajas. Va de 0 (no se tocan) a 1 (idénticas).','desplazar 10 px da 1.200 ÷ 2.000 = 0,60.'],
   ['green','✅','TP · verdadero positivo','Propuesta que coincide con una referencia: categoría correcta e IoU suficiente (aquí, al menos 0,50).','las cajas verdes.'],
   ['red','🚨','FP · falso positivo','Propuesta que no corresponde a ninguna referencia: falsa alarma.','una caja sobre el fondo, o un aguacate llamado «naranja».'],
   ['amber','🙈','FN · falso negativo','Objeto real que quedó sin detectar: un olvido.','la naranja pequeña cuando el corte es alto.'],
   ['teal','🎯','Precisión','De todo lo que el modelo marcó, qué fracción era correcta: TP ÷ (TP + FP).','4 aciertos de 5 cajas = 80 %.'],
   ['pink','🧲','Recall (exhaustividad)','De todo lo que había, qué fracción encontró: TP ÷ (TP + FN).','4 de 5 frutos = 80 %.'],
   ['orange','📈','Curva precisión-recall','Gráfica que muestra cuánta precisión se conserva para cada nivel de recall al recorrer todos los cortes de confianza.','el punto naranja de la figura 2 se mueve sobre ella.'],
   ['teal','🔀','Intersección y unión','La intersección es la zona que cubren las dos cajas a la vez; la unión es toda la zona que cubre al menos una.','al desplazar 10 px: intersección 1.200 px², unión 2.000 px².'],
   ['amber','🚧','Umbral de IoU','El IoU mínimo para que una propuesta cuente como acierto. Es una regla que se elige, no algo que aprende el modelo.','aquí 0,50; con 0,75 se exige más ajuste.'],
   ['blue','📐','AP · precisión promedio','Número que resume la curva precisión-recall de una categoría: el área bajo la curva. Va de 0 a 1.','una curva que se mantiene alta da un AP cercano a 1.'],
   ['violet','🏁','mAP50 y mAP50-95','mAP es el promedio de las AP de todas las categorías. mAP50 usa un IoU mínimo de 0,50; mAP50-95 promedia los resultados con mínimos de 0,50 a 0,95, y es más exigente.','un mismo modelo siempre tiene mAP50 mayor o igual que mAP50-95.'],
   ['green','🗃️','Conjunto de validación','Imágenes con referencias que no se usaron para entrenar. Se reservan para medir el modelo.','las cajas azules hacen de validación en las figuras.'],
   ['red','🚫','TN · verdadero negativo','En clasificación es un caso negativo bien descartado. En detección no se cuenta: los lugares de la imagen donde no hay objeto y tampoco se propuso caja no tienen límite. Por eso aquí no se usa la exactitud y se trabaja con precisión y recall, que no lo necesitan.','en las fórmulas de la figura 2 solo aparecen TP, FP y FN.']
  ],
  practice:[
  ],
  refs:[
   ['Everingham, M., Van Gool, L., Williams, C. K. I., Winn, J. y Zisserman, A. (2010). The PASCAL Visual Object Classes (VOC) Challenge. International Journal of Computer Vision, 88(2), 303–338.','https://doi.org/10.1007/s11263-009-0275-4','Describe el procedimiento de evaluación de detección que popularizó el criterio de IoU 0,50 y la precisión promedio.'],
   ['Padilla, R., Netto, S. L. y da Silva, E. A. B. (2020). A Survey on Performance Metrics for Object-Detection Algorithms. IWSSIP 2020, 237–242.','https://doi.org/10.1109/IWSSIP48289.2020.9145130','Compara las variantes de precisión promedio (AP) y mAP y sus diferencias.'],
   ['Lin, T.-Y., Maire, M., Belongie, S., Hays, J., Perona, P., Ramanan, D., Dollár, P. y Zitnick, C. L. (2014). Microsoft COCO: Common Objects in Context. ECCV 2014, 740–755.','https://arxiv.org/abs/1405.0312','El conjunto de datos con el que se entrenan y comparan la mayoría de los detectores actuales, incluido el del cuaderno.'],
   ['Ultralytics. Documentación del modo de validación.','https://docs.ultralytics.com/modes/val/','Cómo calcula estas métricas la biblioteca del cuaderno.']
  ],
  colab:'En Colab calcularás IoU con las mismas dos cajas de 40 × 40 píxeles y contarás TP, FP y FN al desplazar la propuesta 10 y 30 píxeles y al subir el corte a 0,90.'
 },
 'dl-integracion':{
  idea:'El modelo entrega puntuaciones; la cooperativa necesita acciones. Integrar es convertir una puntuación en una decisión (revisar o aceptar) con una regla que tenga en cuenta cuánto cuesta cada error.',
  analogy:['El filtro de un aeropuerto','Revisar a todos los pasajeros es lento y caro; no revisar a nadie es peligroso. El punto justo depende de cuánto cuesta cada revisión y cuánto cuesta dejar pasar un problema.'],
  figures:()=>figure('review','Figura 1 · Mover el corte cambia qué revisas y cuánto cuesta',
    slider('cut','Corte: revisar si la puntuación es mayor o igual',0,100,5,50)+slider('price','Coste de aceptar un grano defectuoso',1,12,1,8)+`<div class="vx-presets">${toggle('truth','Mostrar cuáles son defectuosos',true)}</div>`,
    'cada grano está ubicado según su puntuación de defecto. A la derecha del corte van a revisión (ámbar); a la izquierda se aceptan (verde). El anillo rojo marca los defectuosos de verdad; el número identifica cada grano. La curva de abajo es el coste total para cada corte posible: busca el punto más bajo y luego cambia el coste del defecto para ver cómo se mueve.'),
  cards:[
   ['blue','🔀','Puntuación y decisión','La puntuación la produce el modelo; la decisión la produce una regla que alguien elige. Son dos cosas distintas.','0,60 es una puntuación; «revisar» es una decisión.'],
   ['violet','📏','Corte de decisión','Valor a partir del cual se actúa. Moverlo cambia cuántas unidades se revisan y cuántos errores se cuelan.','con corte 0,50 se revisan 4 granos.'],
   ['amber','🔍','Coste de revisar','Lo que cuesta inspeccionar una unidad, tenga o no defecto.','1 punto por grano.'],
   ['red','💥','Coste de un defecto aceptado','Lo que cuesta dejar pasar una unidad defectuosa. Suele ser mucho mayor que revisar.','8 puntos por grano defectuoso aceptado.'],
   ['green','🧮','Coste total','Revisiones × coste de revisar + defectos aceptados × coste del defecto. La mejor regla es la que lo hace más pequeño.','4 × 1 + 1 × 8 = 12.'],
   ['teal','🧪','Validación y prueba','El corte se elige con un conjunto de validación y se comprueba después en datos reservados que no se usaron para elegirlo.','elegir aquí y comprobar con otros diez granos.'],
   ['pink','👷','Persona en el circuito','El modelo prioriza; una persona revisa los casos dudosos. La solución completa incluye esa revisión, no solo la red.','los granos en ámbar pasan a inspección manual.'],
   ['orange','📜','Regla de decisión','Instrucción explícita que convierte cada puntuación en una acción. Debe poder escribirse y revisarse.','«revisar si la puntuación es mayor o igual que 0,35».'],
   ['red','🕳️','Defecto aceptado','Grano defectuoso que queda por debajo del corte y pasa sin revisión. Es un falso negativo de la regla.','el grano 4 (0,40) cuando el corte es 0,50.'],
   ['amber','🔁','Revisión innecesaria','Grano sano que supera el corte y se envía a revisión. Es un falso positivo de la regla.','el grano 7 (0,60) con corte 0,50.'],
   ['blue','📏','Línea base «revisar todos»','La alternativa más simple contra la que se compara la regla: inspeccionar todas las unidades.','diez revisiones cuestan 10 puntos.'],
   ['violet','📎','Supuesto del ejercicio','Lo que el ejercicio da por cierto y habría que comprobar en un caso real.','aquí se supone que la revisión manual detecta todos los defectos.'],
   ['teal','🎚️','Calibración','Una puntuación está calibrada si se puede leer como probabilidad: de los casos con 0,80, cerca del 80 % resultan positivos. Muchos modelos ordenan bien los casos sin estar calibrados.','aquí los tres granos con 0,20 y 0,30 no tienen ningún defecto.'],
   ['green','🧭','Corte teórico','Si las puntuaciones son probabilidades calibradas, conviene revisar cuando probabilidad × coste del defecto es mayor o igual que el coste de revisar; es decir, desde coste de revisar ÷ coste del defecto (Elkan, 2001).','1 ÷ 8 = 0,125. Con estos diez granos el corte más barato es otro (0,35 a 0,40): la diferencia viene de la calibración y de tener pocos datos.']
  ],
  practice:[
  ],
  refs:[
   ['Elkan, C. (2001). The Foundations of Cost-Sensitive Learning. IJCAI 2001, 973–978.','https://mlanthology.org/ijcai/2001/elkan2001ijcai-foundations/','Cómo elegir el corte de decisión cuando los errores no cuestan lo mismo.'],
   ['scikit-learn. Tuning the decision threshold for class prediction.','https://scikit-learn.org/stable/modules/classification_threshold.html','Guía práctica para ajustar el corte con datos de validación.']
  ],
  colab:'En Colab calcularás esta misma tabla de costes con los mismos diez granos y verás cómo cambia la mejor regla al bajar el coste del defecto de 8 a 1. Estas puntuaciones de defecto son un dato del ejercicio: el detector del tema 1 reconoce categorías, no defectos.'
 }
};

export const VISUAL_TOPICS=Object.keys(TOPICS);
export const hasVisualExplainer=id=>Object.hasOwn(TOPICS,id);

// Cada pieza se inserta en la sección del tema donde ya vivía ese contenido.
export function renderVisualOpener(id){
 const t=TOPICS[id];if(!t?.opener)return '';
 return `<div class="vx vx-inline" data-vx-opener="${id}"><p class="vx-opener"><b>Para abrir la clase.</b> ${esc(t.opener)}</p></div>`;
}
export function renderVisualIdea(id){
 const t=TOPICS[id];if(!t)return '';
 return `<div class="vx vx-inline" data-vx-idea="${id}"><p class="vx-idea"><span>La idea en una frase</span>${esc(t.idea)}</p><p class="vx-analogy"><b>Piénsalo así · ${esc(t.analogy[0])}.</b> ${esc(t.analogy[1])}</p></div>`;
}
export function renderVisualFigures(id){
 const t=TOPICS[id];if(!t)return '';
 return `<div class="vx vx-inline" data-vx-topic="${id}">${t.figures()}<p class="vx-note">Los datos de estas figuras son inventados para explicar. Las cuentas son reales: puedes rehacerlas a mano con los valores visibles.</p></div>`;
}
export function renderVisualCards(id){
 const t=TOPICS[id];if(!t)return '';
 const group=cards=>`<dl class="vx-cards">${cards.map(c=>card(c[0],c[1],c[2],esc(c[3]),esc(c[4]))).join('')}</dl>`;
 return `<div class="vx vx-inline" data-vx-cards="${id}"><h4 class="vx-subhead">Conceptos del tema (${t.cards.length})</h4>${group(t.cards)}${t.practice.length?`<h4 class="vx-subhead">Términos que verás en la práctica de Colab (${t.practice.length})</h4>${group(t.practice)}`:''}</div>`;
}
export const visualColabNote=id=>TOPICS[id]?.colab??'';
export const topicReferences=id=>TOPICS[id]?.refs??[];
const referenceList=refs=>`<ol class="vx-refs">${refs.map(([cite,url,why])=>`<li><span>${esc(cite)}</span> <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Abrir la fuente ↗</a><small>${esc(why)}</small></li>`).join('')}</ol>`;
export function renderTopicBibliography(id){
 const refs=topicReferences(id);if(!refs.length)return '';
 return `<details class="dl-reference vx vx-inline" data-vx-refs="${id}"><summary>Bibliografía de este tema (${refs.length} fuentes)</summary>${referenceList(refs)}</details>`;
}

const ENCOUNTERS=[
 {number:3,topics:['dl-secuencias','dl-atencion','dl-transformers'],names:['RNN y LSTM','Atención','Transformer'],recap:[
  ['¿Por qué una red recurrente sencilla olvida el comienzo de una secuencia larga?','Porque la huella de los primeros pasos se multiplica muchas veces por números menores que 1 y casi se borra: es el desvanecimiento. Le pasa a la memoria al leer y a la corrección al entrenar; la LSTM lo evita con una memoria que se actualiza sumando.'],
  ['¿Qué decide cada compuerta de una LSTM?','Olvido: cuánto conservar de la memoria. Entrada: cuánta información nueva guardar. Salida: cuánto mostrar.'],
  ['En atención, ¿qué son Q, K y V, y qué hace softmax?','Q es la consulta (lo que busco), K la clave (la etiqueta de cada registro) y V el valor (lo que aporta cada registro). Softmax convierte los parecidos en pesos positivos que suman 100 %.'],
  ['¿Por qué un Transformer necesita codificación posicional?','Porque la atención sola trata la entrada como un conjunto sin orden: sin esa señal, dos secuencias con los mismos elementos en distinto orden se ven iguales.'],
  ['¿En qué se diferencia la forma de leer de una RNN y de un Transformer?','La RNN lee paso a paso y resume en una memoria; el Transformer mira toda la secuencia a la vez y relaciona sus elementos con atención. Gana paralelismo y conexiones directas; paga una cuenta que crece con el cuadrado de la longitud.'],
  ['¿Qué le falta al Transformer de hoy para ser un modelo de lenguaje como los asistentes de IA?','Ser un decoder: que cada token solo mire a los anteriores, entrenarlo con muchísimo texto para predecir el siguiente token y generar repitiendo ese ciclo. Las piezas (tokens, embedding, posición, atención) son las mismas.']]},
 {number:4,topics:['dl-yolo','dl-evaluacion','dl-integracion'],names:['YOLO','Evaluación','Integración'],recap:[
  ['¿Qué tres datos trae cada detección?','Una caja (dónde está), una categoría (qué es) y una confianza (qué tan seguro está el modelo).'],
  ['¿Para qué sirve la supresión de no máximos (NMS)?','Para quitar cajas repetidas: entre las que marcan el mismo objeto conserva la de mayor confianza.'],
  ['¿Qué mide IoU y entre qué valores está?','Cuánto coinciden dos cajas: área común dividida entre el área que cubren entre las dos. Va de 0 a 1.'],
  ['¿Cuál es la diferencia entre un falso positivo y un falso negativo, y por qué no se cuentan verdaderos negativos?','Falso positivo: el modelo marcó algo que no era. Falso negativo: había un objeto y el modelo no lo marcó. Los lugares vacíos sin caja no tienen límite, así que en detección no se cuentan ni se usa la exactitud.'],
  ['Si subes el corte de confianza, ¿qué suele pasar con la precisión y el recall?','La precisión tiende a subir porque quedan las cajas más seguras, y el recall tiende a bajar porque se pierden objetos.'],
  ['¿Por qué el mejor corte de decisión depende de los costes?','Porque revisar de más y dejar pasar un defecto no cuestan lo mismo: el corte más barato cambia cuando cambian esos costes. Con probabilidades calibradas sería coste de revisar ÷ coste del defecto; con puntuaciones sin calibrar se elige con datos de validación.']]}
];
const encounterOf=id=>ENCOUNTERS.find(e=>e.topics.includes(id));

// Síntesis de las dos asignaturas: se muestra en el cierre del último encuentro, que la agenda ya anuncia como cierre del diplomado.
export const DIPLOMA_MAP=[
 ['blue','Una tabla con la respuesta conocida','ML · encuentros 1 a 3','Regresión si la respuesta es un número; clasificación si es una categoría. Los ensambles de árboles suelen ser el primer modelo que conviene probar.'],
 ['teal','Datos sin etiqueta','ML · encuentro 3','Clustering para encontrar grupos y PCA para resumir muchas columnas en pocas.'],
 ['amber','Una serie en el tiempo','ML 4 · DL 3','Primero una línea base y un modelo de series evaluado con fechas posteriores al corte; una LSTM cuando hay datos suficientes y patrones largos.'],
 ['pink','Decisiones encadenadas con recompensa','ML · encuentro 4','Aprendizaje por refuerzo.'],
 ['violet','Imágenes','DL · encuentros 2 y 4','Una etiqueta por imagen: CNN y transferencia desde un modelo preentrenado. Localizar y contar objetos: un detector como YOLO.'],
 ['green','Texto y secuencias largas','DL · encuentro 3','Atención y Transformer; los modelos de lenguaje son Transformers entrenados para predecir el siguiente token.'],
 ['red','En todos los casos','ML y DL','Datos reservados que el modelo no vio, una línea base, la métrica que corresponde a la tarea, un corte elegido según los costes y una persona que revisa los casos dudosos.'],
 ['orange','Para seguir después del diplomado','Lo que queda abierto','Ajuste fino de modelos preentrenados con datos propios, modelos de lenguaje y segmentación de imágenes.']
];
const diplomaMap=()=>`<h3>Cierre del diplomado: qué modelo para qué dato</h3><dl class="vx-glossary" data-vx-diploma>${DIPLOMA_MAP.map(([color,data,where,what])=>`<div><dt><span class="vx-dot vx-bg-${color}"></span>${esc(data)}<small>${esc(where)}</small></dt><dd>${esc(what)}</dd></div>`).join('')}</dl>`;

// Todos los términos del encuentro, en orden alfabético y sin repetir.
export function encounterGlossary(id){
 const e=encounterOf(id);if(!e)return [];
 const seen=new Set(),rows=[];
 e.topics.forEach((topic,i)=>{for(const [color,,term,meaning] of [...TOPICS[topic].cards,...TOPICS[topic].practice]){if(seen.has(term))continue;seen.add(term);rows.push({term,meaning,color,topic:e.names[i]});}});
 return rows.sort((a,b)=>a.term.localeCompare(b.term,'es'));
}
// Bibliografía del encuentro: las fuentes de sus tres temas, sin repetir.
export function encounterReferences(id){
 const e=encounterOf(id);if(!e)return [];
 const seen=new Set();
 return e.topics.flatMap(topic=>TOPICS[topic].refs).filter(([,url])=>!seen.has(url)&&seen.add(url));
}
const glossaryList=id=>`<dl class="vx-glossary">${encounterGlossary(id).map(r=>`<div><dt><span class="vx-dot vx-bg-${r.color}"></span>${esc(r.term)}<small>${esc(r.topic)}</small></dt><dd>${esc(r.meaning)}</dd></div>`).join('')}</dl>`;
export function renderEncounterGlossary(id){
 const e=encounterOf(id);if(!e)return '';
 return `<div data-vx-glossary="${id}"><h4 class="vx-subhead">Glosario del encuentro ${e.number}: ${encounterGlossary(id).length} términos de los tres temas</h4>${glossaryList(id)}</div>`;
}
// Cierre para proyectar al terminar el tercer tema: repaso sin nota y glosario completo a la vista.
export function renderEncounterClosing(id){
 const e=encounterOf(id);if(!e||e.topics[2]!==id)return '';
 return `<div class="vx vx-closing" data-vx-closing="${e.number}"><h3>Cierre del encuentro ${e.number}: repaso relámpago</h3><p class="vx-closing-lead">Sin nota. Responde en voz alta y después abre la tarjeta para comprobar.</p><div class="vx-flips">${e.recap.map(([q,a],i)=>`<details class="vx-flip vx-c-${['blue','pink','teal','amber','violet','green'][i]}"><summary><span>${i+1}</span>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>${e.number===4?diplomaMap():''}<h3>Glosario del encuentro ${e.number}</h3>${glossaryList(id)}<h3>Bibliografía del encuentro ${e.number}</h3>${referenceList(encounterReferences(id))}</div>`;
}

export const drawVisualFigure=(name,state={})=>DRAW[name]({...DEFAULTS[name],...state});
export const visualFigureDefaults=name=>({...DEFAULTS[name]});

/* ---------- Interacción ---------- */

const mounted=new WeakSet();
export function mountVisualExplainers(root=document){
 for(const fig of root.querySelectorAll('[data-vx-fig]')){
  if(mounted.has(fig))continue;mounted.add(fig);
  const name=fig.dataset.vxFig,state={...DEFAULTS[name]},out=fig.querySelector('[data-vx-out]');
  const sync=()=>{
   for(const control of fig.querySelectorAll('[data-vx-control]')){const key=control.dataset.vxControl;if(control.type==='checkbox')control.checked=Boolean(state[key]);else control.value=state[key];}
   for(const output of fig.querySelectorAll('[data-vx-value]'))output.textContent=VALUE_LABELS[output.dataset.vxValue]?.(state)??state[output.dataset.vxValue];
   for(const tab of fig.querySelectorAll('[data-vx-tab]'))tab.setAttribute('aria-pressed',String(String(state[tab.dataset.vxKey])===tab.dataset.vxTab));
   out.innerHTML=DRAW[name](state);
   const goals=GOALS[name];
   if(goals&&armed){
    goals.forEach((goal,i)=>{if(achieved.has(i)||!goal.test(state))return;achieved.add(i);const item=fig.querySelector(`[data-vx-goal="${i}"]`);item?.classList.add('is-done');const status=fig.querySelector('[data-vx-goal-status]');if(status)status.textContent=achieved.size===goals.length?'¡Lograste todos los retos de esta figura!':'Reto logrado. Falta '+(goals.length-achieved.size)+'.';});
   }
  };
  const achieved=new Set();let armed=false;
  let timer=null;const stop=()=>{if(timer){clearInterval(timer);timer=null;}};
  fig.addEventListener('input',event=>{const control=event.target.closest?.('[data-vx-control]');if(!control)return;stop();state[control.dataset.vxControl]=control.type==='checkbox'?control.checked:Number(control.value);sync();});
  fig.addEventListener('click',event=>{
   const set=event.target.closest?.('[data-vx-set]');
   if(set){stop();Object.assign(state,JSON.parse(set.dataset.vxSet));sync();return;}
   if(event.target.closest?.('[data-vx-play]')){
    stop();
    if(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches){state.day=12;sync();return;}
    state.day=1;sync();
    timer=setInterval(()=>{if(!fig.isConnected||state.day>=12){stop();return;}state.day+=1;sync();},550);
   }
  });
  if(name==='iou'){
   let dragging=false;
   const move=event=>{const box=out.querySelector('[data-vx-drag] svg')?.getBoundingClientRect();if(!box?.width)return;
    const px=(event.clientX-box.left)/box.width*100,py=(event.clientY-box.top)/box.height*85;
    state.dx=Math.max(-10,Math.min(45,Math.round(px-20-REFERENCE[0])));state.dy=Math.max(-20,Math.min(25,Math.round(py-20-REFERENCE[1])));sync();};
   out.addEventListener('pointerdown',event=>{if(!event.target.closest?.('[data-vx-drag]'))return;dragging=true;out.setPointerCapture?.(event.pointerId);event.preventDefault();move(event);});
   out.addEventListener('pointermove',event=>{if(dragging)move(event);});
   for(const type of ['pointerup','pointercancel'])out.addEventListener(type,()=>{dragging=false;});
  }
  sync();armed=true;
 }
}
