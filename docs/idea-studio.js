import {TOPICS,FARMS,PLANTS,SHIPMENTS,initialIdea,ideaCase,ideaResult,stepIdea} from './idea-models.js';
import {activation} from './math.js';
import {renderThreeScene} from './three-scenes.js?v=1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=2)=>Number(n).toLocaleString('es-CO',{maximumFractionDigits:d,minimumFractionDigits:d});
const colors=['#507b3c','#ac602d','#547d9f'];
const text=(x,y,label,extra='')=>`<text x="${x}" y="${y}" ${extra}>${esc(label)}</text>`;
const line=(x1,y1,x2,y2,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
const svg=(label,body,height=360)=>`<svg viewBox="0 0 720 ${height}" class="idea-plot" role="group" aria-label="${esc(label)}">${body}</svg>`;
function axes({xmin=0,xmax=1,ymin=0,ymax=1,xlabel,ylabel,xticks,yticks,width=600,height=235,left=78,bottom=285}){
 const x=v=>left+(v-xmin)/(xmax-xmin)*width,y=v=>bottom-(v-ymin)/(ymax-ymin)*height;
 return {x,y,body:`${yticks.map(v=>line(left,y(v),left+width,y(v),'class="idea-gridline"')+text(left-13,y(v)+5,fmt(v,Number.isInteger(v)?0:1),'text-anchor="end"')).join('')}${xticks.map(v=>text(x(v),bottom+25,fmt(v,Number.isInteger(v)?0:1),'text-anchor="middle"')).join('')}${line(left,bottom-height,left,bottom)}${line(left,bottom,left+width,bottom)}${text(left+width/2,bottom+62,xlabel,'text-anchor="middle"')}${text(21,bottom-height/2,ylabel,`text-anchor="middle" transform="rotate(-90 21 ${bottom-height/2})"`)}`};
}
const pick=(index,label,body,active)=>`<g role="button" tabindex="0" data-pick="${index}" aria-label="${esc(label)}" aria-pressed="${active}" class="idea-pick ${active?'is-selected':''}"><title>${esc(label)}</title>${body}</g>`;
const dot=(x,y,c,r=7)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const table=(headers,rows,caption)=>`<div class="idea-table-scroll" tabindex="0" role="region" aria-label="${esc(caption)}"><table><caption>${esc(caption)}</caption><thead><tr>${headers.map(v=>`<th scope="col">${v}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${v}</td>`:`<th scope="row">${v}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const rowButton=(id,name,selected)=>`<button type="button" data-pick="${id}" aria-pressed="${String(id)===String(selected)}">${esc(name)}</button>`;
const metrics=items=>`<div class="idea-metrics">${items.map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div>`;

export function renderIdeaPlot(id,p,selected=0,sharedLossMax){
 const r=ideaResult(id,p);
 if(id==='prediction'){
  const a=axes({xmin:0,xmax:160,ymin:0,ymax:10,xlabel:'Fertilizante (kg/ha)',ylabel:'Rendimiento (t/ha)',xticks:[0,40,80,120,160],yticks:[0,2,4,6,8,10]});
  const body=a.body+line(a.x(0),a.y(p.bias),a.x(160),a.y(p.bias+160*p.slope),'class="idea-model-line"')+FARMS.map((f,i)=>pick(i,`Finca ${f.name}: ${f.x} kg/ha, observado ${fmt(f.y)}, predicción ${fmt(r.predicted[i])} t/ha`,line(a.x(f.x),a.y(f.y),a.x(f.x),a.y(r.predicted[i]),'class="idea-residual"')+dot(a.x(f.x),a.y(f.y),colors[0])+dot(a.x(f.x),a.y(r.predicted[i]),colors[1],4)+text(a.x(f.x)+13,a.y(f.y)-10,f.name),Number(selected)===i)).join('');
  return svg('Seis fincas, recta y distancias entre observado y predicho',body);
 }
 if(id==='alerts'){
  const a=axes({xmin:0,xmax:1,ymin:0,ymax:11,xlabel:'Puntuación de cada planta',ylabel:'Plantas',xticks:[0,.2,.4,.6,.8,1],yticks:[]});
  return svg('Puntuaciones fijas y umbral de alerta',a.body+`<rect x="${a.x(p.threshold)}" y="50" width="${a.x(1)-a.x(p.threshold)}" height="235" class="idea-alert-area"/>`+line(a.x(p.threshold),35,a.x(p.threshold),285,'class="idea-threshold"')+text(Math.max(145,Math.min(600,a.x(p.threshold))),24,`Umbral ${fmt(p.threshold)}`,'text-anchor="middle"')+r.rows.map((v,i)=>{const yy=65+i*22;return pick(i,`${v.name}: puntuación ${fmt(v.score)}, ${v.plague?'con plaga':'sana'}, ${v.alert?'alerta':'sin alerta'}`,text(65,yy+5,v.name,'text-anchor="end"')+(v.plague?`<path d="M${a.x(v.score)} ${yy-8}l8 16h-16z" fill="${colors[1]}"/>`:dot(a.x(v.score),yy,colors[0]))+(v.alert?`<circle cx="${a.x(v.score)}" cy="${yy}" r="12" class="idea-alert-ring"/>`:''),Number(selected)===i)}).join(''));
 }
 if(id==='missing'){
  const a=axes({xmin:0,xmax:4,ymin:0,ymax:1000,xlabel:'Estación · B es estimada',ylabel:'Lluvia (mm)',xticks:[],yticks:[0,200,400,600,800,1000]});
  const values=[p.rainA,r.estimate,p.rainC,p.rainD];
  return svg('Registros medidos y estimación de lluvia para B',`<defs><pattern id="idea-hatch" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" stroke="${colors[1]}" stroke-width="3"/></pattern></defs>`+a.body+line(78,a.y(r.estimate),678,a.y(r.estimate),'class="idea-threshold"')+values.map((v,i)=>pick(i,`Estación ${'ABCD'[i]}: ${v} mm ${i===1?'estimados':'medidos'}`,`<rect x="${a.x(i+.5)-35}" y="${a.y(v)}" width="70" height="${285-a.y(v)}" fill="${i===1?'url(#idea-hatch)':colors[0]}" stroke="${i===1?colors[1]:colors[0]}"/>`+text(a.x(i+.5),a.y(v)-12,`${v}${i===1?' *':''}`,'text-anchor="middle"')+text(a.x(i+.5),312,'ABCD'[i],'text-anchor="middle"'),Number(selected)===i)).join(''));
 }
 if(id==='signal'){
  const a=axes({xmin:-4,xmax:4,ymin:-1.5,ymax:4.5,xlabel:'Señal de entrada',ylabel:'Salida de la función',xticks:[-4,-2,0,2,4],yticks:[-1,0,1,2,3,4]});
  return svg('ReLU, sigmoid y tanh sobre los mismos ejes',a.body+line(a.x(p.signal),50,a.x(p.signal),285,'class="idea-guide-line"')+['relu','sigmoid','tanh'].map((type,i)=>{const points=Array.from({length:161},(_,j)=>{const v=-4+j*.05;return `${a.x(v)},${a.y(activation(v,type))}`;}).join(' ');return `<polyline points="${points}" fill="none" stroke="${colors[i]}" stroke-width="${p.function===type?4:2}" opacity="${p.function===type?1:.55}"/>`+dot(a.x(p.signal),a.y(activation(p.signal,type)),colors[i],p.function===type?9:5);}).join(''));
 }
 if(id==='adjustment'){
  const top=sharedLossMax||Math.max(40,...p.history)*1.12,min=sharedLossMax?3-Math.sqrt(top):Math.min(-3,...p.states)-.5,max=sharedLossMax?3+Math.sqrt(top):Math.max(9,...p.states)+.5;
  const a=axes({xmin:min,xmax:max,ymin:0,ymax:top,xlabel:'Valor del parámetro',ylabel:'Pérdida (θ − 3)²',xticks:[-2,0,3,6,9].filter(v=>v>=min&&v<=max),yticks:[0,top/2,top]});
  const curve=Array.from({length:121},(_,i)=>{const theta=min+(max-min)*i/120;return `${a.x(theta)},${a.y(Math.min(top,(theta-3)**2))}`;}).join(' ');
  return svg('Parábola de pérdida y estados visitados',a.body+`<polyline points="${curve}" fill="none" stroke="${colors[0]}" stroke-width="3"/>`+line(a.x(3),50,a.x(3),285,'class="idea-guide-line"')+p.states.map((theta,i)=>pick(i,`Paso ${i}: parámetro ${fmt(theta)}, pérdida ${fmt(p.history[i])}`,(i?line(a.x(p.states[i-1]),a.y(p.history[i-1]),a.x(theta),a.y(p.history[i]),'class="idea-residual"'):'')+dot(a.x(theta),a.y(p.history[i]),colors[1],Number(selected)===i?9:5)+text(a.x(theta)+10,a.y(p.history[i])-9,i),Number(selected)===i)).join(''));
 }
 if(id==='vision'){
  const fruits=[[120,160,40,53],[300,145,48,60],[495,163,35,45]];
  return svg('Misma imagen con etiqueta, cajas o máscaras',`<rect x="60" y="35" width="600" height="300" rx="10" class="idea-image-bg"/>`+fruits.map(([xx,yy,rx,ry],i)=>{const x=xx+60,y=yy+35;return pick(i,`Fruto ${i+1}: centro ${xx},${yy} píxeles`,`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${p.task==='segmentation'?colors[i]:['#b5c78f','#c7aa76','#94b582'][i]}"/>`+(p.task==='detection'?`<rect x="${x-rx}" y="${y-ry}" width="${2*rx}" height="${2*ry}" class="idea-box"/>`:'')+(p.task!=='classification'?text(x,y-ry-12,`Fruto ${i+1}`,'text-anchor="middle"'):''),Number(selected)===i);}).join('')+(p.task==='classification'?`<rect x="218" y="55" width="285" height="35" rx="6" class="idea-image-label"/>${text(360,79,'Etiqueta: imagen con frutos','text-anchor="middle" class="idea-image-label-text"')}`:''));
 }
 if(id==='neighbors'){
  const scaled=p.scaled==='yes',a=axes(scaled?{xmin:-2.5,xmax:2.5,ymin:-2.5,ymax:2.5,xlabel:'Distancia estandarizada',ylabel:'Carga estandarizada',xticks:[-2,-1,0,1,2],yticks:[-2,-1,0,1,2],width:400,height:400,left:150,bottom:450}:{xmin:15,xmax:55,ymin:2200,ymax:5800,xlabel:'Distancia (km)',ylabel:'Carga (kg)',xticks:[20,30,40,50],yticks:[2500,3500,4500,5500]});
  return svg('Envíos históricos, consulta y vecinos que votan',a.body+r.selected.map(v=>line(a.x(r.query[0]),a.y(r.query[1]),a.x(v.xy[0]),a.y(v.xy[1]),'class="idea-residual"')).join('')+r.ranked.map(v=>{const i=SHIPMENTS.findIndex(s=>s.id===v.id);return pick(i,`Envío ${v.id}: ${v.km} km, ${v.kg} kg, ${v.kind?'Extendido':'Estándar'}`,dot(a.x(v.xy[0]),a.y(v.xy[1]),colors[v.kind],9)+text(a.x(v.xy[0])+13,a.y(v.xy[1])-10,v.id),Number(selected)===i);}).join('')+`<path d="M${a.x(r.query[0])} ${a.y(r.query[1])-11}l11 11-11 11-11-11z" class="idea-query"/>`,scaled?520:360);
 }
 return '';
}

const range=(key,label,min,max,step,value)=>`<label class="idea-range" for="idea-${key}"><span>${label}<output data-output="${key}" for="idea-${key}"></output></span><input id="idea-${key}" data-control="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
const select=(key,label,options,value)=>`<label class="idea-select" for="idea-${key}">${label}<select id="idea-${key}" data-control="${key}">${options.map(([v,n])=>`<option value="${v}" ${v===value?'selected':''}>${n}</option>`).join('')}</select></label>`;
function controls(id,p){
 switch(id){
 case 'prediction':return range('slope','Pendiente · t/ha por kg/ha',.005,.05,.0001,p.slope)+range('bias','Intercepto · t/ha',0,2,.01,p.bias)+'<button type="button" class="button small" data-fit>Ajustar recta con estos datos</button>';
 case 'alerts':return range('threshold','Umbral de alerta',0,1,.05,p.threshold);
 case 'missing':return ['A','C','D'].map(n=>range('rain'+n,'Lluvia de '+n+' · mm',100,900,50,p['rain'+n])).join('');
 case 'signal':return range('signal','Señal de entrada',-4,4,.1,p.signal)+select('function','Función destacada',[['relu','ReLU'],['sigmoid','Sigmoid'],['tanh','tanh']],p.function);
 case 'adjustment':return range('rate','Tasa de aprendizaje',.05,1.1,.05,p.rate)+'<button type="button" class="button small" data-step="1">Dar un paso</button><button type="button" class="button secondary small" data-step="5">Calcular cinco pasos</button><details class="idea-reading"><summary>Comparar tasas</summary><p>Cambiar la tasa conserva el punto actual. Reinicia para comparar desde −2.</p></details>';
 case 'vision':return select('task','Salida que necesitas',[['classification','Etiqueta global'],['detection','Cajas de objetos'],['segmentation','Máscaras de objetos']],p.task);
 case 'neighbors':return range('km','Distancia de la consulta · km',20,50,1,p.km)+range('kg','Carga de la consulta · kg',2500,5500,100,p.kg)+select('k','Vecinos que votan',[['1','1 vecino'],['3','3 vecinos'],['5','5 vecinos']],String(p.k))+select('scaled','Escala de las variables',[['no','Unidades originales'],['yes','Estandarizar con los históricos']],p.scaled);
 default:return select('filter','Filtro',[['horizontal','Horizontal: cambio entre filas'],['average','Promedio de nueve píxeles']],p.filter)+'';
 }
}
function pixelPlot(p,r){
 const grid=(values,kind,label)=>`<section><h4>${label}</h4><div class="idea-pixels" style="--columns:${values[0].length}">${values.map((row,y)=>row.map((v,x)=>{const active=kind==='pixel'?y>=p.row&&y<p.row+3&&x>=p.column&&x<p.column+3:y===p.row&&x===p.column;return `<button type="button" data-${kind}="${y},${x}" aria-label="${kind==='pixel'?'Píxel':'Mapa'}, fila ${y+1}, columna ${x+1}, valor ${fmt(v)}" aria-pressed="${active}" class="${active?'pixel-selected':''} ${kind==='pixel'&&v===1?'pixel-on':''}">${kind==='pixel'?v:fmt(v,2)}</button>`;}).join('')).join('')}</div></section>`;
 return `<div class="idea-pixel-panels">${grid(p.image,'pixel','1 · Imagen editable 5 × 5')}<section><h4>2 · Filtro 3 × 3</h4><div class="idea-kernel">${r.kernel.flat().map(v=>`<span>${p.filter==='average'?'1/9':v}</span>`).join('')}</div></section>${grid(r.map,'window','3 · Mapa 3 × 3')}</div><details class="idea-reading"><summary>Ver la cuenta de esta ventana</summary><p class="idea-equation">Ventana desde fila ${p.row+1}, columna ${p.column+1}. Suma de productos = ${r.products.flat().map(v=>fmt(v,3)).join(' + ')} = <b>${fmt(r.value,3)}</b>.</p></details>`;
}
function dataView(id,p,selected,filter){
 const r=ideaResult(id,p),b=(i,n)=>rowButton(i,n,selected);
 if(id==='prediction')return table(['Finca','Entrada kg/ha','Observado t/ha','Predicho t/ha','Error absoluto t/ha'],FARMS.map((v,i)=>[b(i,v.name),v.x,fmt(v.y),fmt(r.predicted[i]),fmt(r.errors[i])]),'Las seis observaciones y los cálculos de la recta');
 if(id==='alerts'){const rows=r.rows.flatMap((v,i)=>!filter||v.kind===filter?[[b(i,v.name),v.plague?'Con plaga':'Sana',fmt(v.score),v.alert?'Alerta':'Sin alerta',{tp:'Detección correcta',fp:'Falsa alerta',fn:'Omisión',tn:'Descarte correcto'}[v.kind]]]:[]);return rows.length?table(['Planta','Realidad','Puntuación','Decisión','Resultado'],rows,'Plantas de la casilla seleccionada o del conjunto completo'):'<p class="idea-empty">Con este umbral no hay plantas en la casilla seleccionada. Puedes elegir otra casilla o mostrar las diez plantas.</p>';}
 if(id==='missing')return table(['Estación','Registro original','Entrada preparada'],['A','B','C','D'].map((n,i)=>[b(i,n),i===1?'Sin registro':p['rain'+n]+' mm',(i===1?r.estimate:p['rain'+n])+' mm'+(i===1?' · estimado':' · medido')]),'Antes y después de completar la entrada de B');
 if(id==='signal')return table(['Entrada','ReLU','Sigmoid','tanh'],[-4,-2,0,2,4].map(v=>[`<button type="button" data-signal="${v}" aria-label="Usar entrada ${v}">${v}</button>`,...['relu','sigmoid','tanh'].map(t=>fmt(activation(v,t),3))]),'Las tres funciones sobre las mismas cinco entradas');
 if(id==='adjustment')return table(['Paso','Parámetro','Gradiente usado','Actualización aplicada','Pérdida'],p.states.map((v,i)=>[b(i,i),fmt(v,3),i?fmt(2*(p.states[i-1]-3),3):'—',i?fmt(v-p.states[i-1],3):'Inicio',fmt(p.history[i],3)]),'Historial completo: cada fila conserva el ajuste que realmente ocurrió');
 if(id==='vision')return p.task==='classification'?table(['Salida','Alcance'],[['Imagen con frutos','Una etiqueta para toda la imagen, sin posiciones individuales']],'Resultado de clasificación'):table(['Objeto',p.task==='detection'?'Caja [x₁,y₁,x₂,y₂] · px':'Región del cuerpo visible'],[[b(0,'Fruto 1'),p.task==='detection'?'[80,107,160,213]':'Elipse: centro [120,160], radios 40 y 53 px'],[b(1,'Fruto 2'),p.task==='detection'?'[252,85,348,205]':'Elipse: centro [300,145], radios 48 y 60 px'],[b(2,'Fruto 3'),p.task==='detection'?'[460,118,530,208]':'Elipse: centro [495,163], radios 35 y 45 px']],'Coordenadas relativas a la imagen de 600 × 300 píxeles');
 if(id==='neighbors')return table(['Envío','Distancia km','Carga kg','Servicio conocido','Distancia a consulta','¿Vota?'],r.ranked.map(v=>[b(SHIPMENTS.findIndex(s=>s.id===v.id),v.id),v.km,v.kg,v.kind?'Extendido':'Estándar',fmt(v.distance,3),r.selected.includes(v)?'Sí':'No']),p.scaled==='yes'?'Orden por distancia euclídea entre variables estandarizadas':'Orden por distancia euclídea usando los números en sus unidades originales');
 return table(['Fila de ventana','Píxeles','Pesos','Productos'],r.products.map((row,i)=>[i+1,p.image[p.row+i].slice(p.column,p.column+3).join(', '),r.kernel[i].map(v=>p.filter==='average'?'1/9':v).join(', '),row.map(v=>fmt(v,3)).join(', ')]),'Los nueve productos que forman la celda seleccionada');
}
function detail(id,p,selected){
 const r=ideaResult(id,p),i=Number(selected)||0;
 switch(id){
 case 'prediction':{const f=FARMS[i]||FARMS[0];return `${f.name}: ${fmt(p.bias)} + ${fmt(p.slope,4)} × ${f.x} = ${fmt(r.predicted[i])} t/ha. Observado: ${fmt(f.y)}. Error: ${fmt(r.errors[i])} t/ha.`;}
 case 'alerts':{const v=r.rows[i]||r.rows[0];return `${v.name}: ${fmt(v.score)} ${v.alert?'≥':'<'} ${fmt(p.threshold)} → ${v.alert?'alerta':'sin alerta'}. Revisarías ${r.tp+r.fp}: ${r.tp} con plaga y ${r.fp} sanas. Quedan ${r.fn} plagas sin alerta.`;}
 case 'missing':return `Ordenados: ${r.ordered.join(' · ')} mm → mediana ${r.estimate} mm. Media: ${fmt(r.mean)} mm. B permanece estimada.`;
 case 'signal':return `Entrada ${fmt(p.signal)} → ReLU ${fmt(r.values[0].value,3)} · sigmoid ${fmt(r.values[1].value,3)} · tanh ${fmt(r.values[2].value,3)}.`;
 case 'adjustment':{const step=Math.min(i,p.states.length-1);return step?`Paso ${step}: parámetro ${fmt(p.states[step-1],3)} → ${fmt(p.states[step],3)}. Pérdida ${fmt(p.history[step-1],3)} → ${fmt(p.history[step],3)}: ${p.history[step]>p.history[step-1]?'aumentó':'bajó o se mantuvo'}.`:'Inicio: parámetro −2. Pérdida: (−2 − 3)² = 25. Da un paso para seguir el ajuste.';}
 case 'vision':return {classification:'Una etiqueta para toda la imagen: no localiza ni cuenta cada fruto.',detection:`Fruto ${i+1}: la caja aproxima su ubicación e incluye parte del fondo.`,segmentation:`Fruto ${i+1}: la máscara delimita los píxeles de su cuerpo visible.`}[p.task];
 case 'neighbors':return `Votan ${r.selected.map(v=>v.id).join(', ')} → ${r.kind?'Extendido':'Estándar'} (${r.kind?r.votes:p.k-r.votes} de ${p.k} votos). ${p.scaled==='yes'?'Variables estandarizadas con los históricos.':'La magnitud de kg domina la distancia numérica.'}`;
 default:return `Ventana (${p.row+1}, ${p.column+1}) → suma ${fmt(r.value,3)}. Edita un píxel para ver qué celdas del mapa cambian.`;
 }
}
function summary(id,p){const r=ideaResult(id,p);switch(id){case 'prediction':return [['MAE de ajuste',fmt(r.mae,3)+' t/ha']];case 'alerts':return [['Alertas',r.tp+r.fp+' de 10'],['Falsas alertas',r.fp],['Omisiones',r.fn]];case 'missing':return [['B estimada',r.estimate+' mm'],['Media conocida',fmt(r.mean)+' mm']];case 'signal':return r.values.map(v=>[v.type,fmt(v.value,3)]);case 'adjustment':return [['Parámetro',fmt(p.theta,3)],['Pérdida actual',fmt(r.loss,3)],['Pasos',r.steps]];case 'vision':return [['Salida',p.task==='classification'?'1 etiqueta':p.task==='detection'?'3 cajas':'3 máscaras']];case 'neighbors':return [['Servicio predicho',r.kind?'Extendido':'Estándar'],['Vecinos que votan',r.selected.map(v=>v.id).join(', ')]];default:return [['Celda elegida',`${p.row+1}, ${p.column+1}`],['Suma',fmt(r.value,3)]];}}

export function mountIdeaStudio(el,initial='prediction'){
 let topic=TOPICS.find(t=>t.id===initial)||TOPICS[0],p=initialIdea(topic.id),selected=0,before=null,caseIndex=0,filter=null;
 const q=s=>el.querySelector(s);
 function animateChange(mode='case'){
  if(document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const nodes=mode==='select'?el.querySelectorAll('.idea-pick.is-selected,.idea-confusion [aria-pressed=true]'):mode==='pixel'?el.querySelectorAll('.idea-pixels .pixel-selected'):mode==='compare'?[q('[data-comparison]')]:[q('[data-graph]'),q('[data-extra]')];
  for(const node of nodes){if(!node||typeof node.animate!=='function')continue;node.getAnimations().forEach(a=>a.cancel());node.animate(mode==='select'?[{opacity:.55},{opacity:1}]:mode==='pixel'?[{backgroundColor:'var(--selected)'},{backgroundColor:getComputedStyle(node).backgroundColor}]:[{opacity:.6,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.2,0,0,1)'});}
 }
 function build(){
  const id=topic.id,hasThree=!['neighbors','convolution'].includes(id);
  el.innerHTML=`<section class="idea-studio"><header class="idea-toolbar"><span>8 ideas para explorar con datos</span><button type="button" class="button secondary small" data-project aria-pressed="${document.body.classList.contains('projecting')}">Vista para proyectar</button></header><nav class="idea-nav" aria-label="Ideas para explorar">${TOPICS.map(t=>`<button type="button" data-topic="${t.id}" aria-pressed="${t.id===id}">${esc(t.label)}</button>`).join('')}</nav><label class="idea-mobile-switch">Idea<select data-topic-switch>${TOPICS.map(t=>`<option value="${t.id}" ${t.id===id?'selected':''}>${esc(t.label)}</option>`).join('')}</select></label><div class="idea-intro"><h2 tabindex="-1">${esc(topic.title)}</h2><p class="idea-data-description" data-brief></p></div><div class="idea-cases" role="group" aria-label="Casos para comparar">${topic.cases.map(([label],i)=>`<button type="button" data-case="${i}" aria-pressed="${i===caseIndex}"><span>${i+1}</span>${esc(label)}</button>`).join('')}</div><p class="idea-task" data-task>${esc(topic.cases[caseIndex][1])}</p><div class="idea-workbench"><div class="idea-graph-panel"><div data-graph></div><div data-extra></div><div class="idea-chart-legend" data-legend></div><details class="idea-reading"><summary>Cómo leer el gráfico</summary><p>${esc(topic.read)}</p></details></div><aside class="idea-controls" aria-label="Controles del ejemplo"><h3>Prueba</h3>${controls(id,p)}<button type="button" class="button secondary small" data-save>Guardar escenario A</button><button type="button" class="idea-text-button" data-reset>Reiniciar ejemplo</button><div data-metrics></div></aside></div><div class="idea-insight" role="status" aria-live="polite" data-insight></div><details class="idea-data-section" data-table-details><summary>Ver datos y cálculos</summary><div class="idea-section-heading"><button type="button" class="idea-text-button" data-show-all hidden>Mostrar las diez plantas</button></div><div data-table></div><p class="idea-table-note">Selecciona un registro para relacionarlo con el gráfico. Las cuentas usan valores sin redondear; las cifras se muestran con decimales limitados.</p></details><section class="idea-compare" data-comparison hidden></section>${hasThree?'<details class="idea-three"><summary>Ver los mismos datos en una escena 3D</summary><div class="iso-stage"><div data-canvas></div><div class="iso-three-host" data-three></div></div></details>':''}<details class="idea-context"><summary>Contexto y alcance del ejemplo</summary><p>${esc(topic.context)}</p><p>${esc(topic.data)}</p><p>${esc(topic.limit)}</p></details><details class="idea-sources"><summary>Fuentes para profundizar</summary><p><a href="${topic.source}" target="_blank" rel="noopener noreferrer">Fundamento del concepto ↗</a></p><p>Otras exploraciones visuales: <a href="https://pair.withgoogle.com/explorables/" target="_blank" rel="noopener noreferrer">Google AI Explorables</a>, <a href="https://playground.tensorflow.org/" target="_blank" rel="noopener noreferrer">TensorFlow Playground</a>, <a href="https://setosa.io/ev/ordinary-least-squares-regression/" target="_blank" rel="noopener noreferrer">Explained Visually</a> y <a href="https://poloclub.github.io/cnn-explainer/" target="_blank" rel="noopener noreferrer">CNN Explainer</a>.</p></details></section>`;
  q('.idea-three')?.addEventListener('toggle',()=>{if(q('.idea-three').open)draw();});
  draw();
 }
 function draw(){
  const id=topic.id,r=ideaResult(id,p);
  q('[data-graph]').innerHTML=id==='convolution'?pixelPlot(p,r):renderIdeaPlot(id,p,selected);
  let extra='';
  if(id==='alerts')extra=`<div class="idea-confusion" role="group" aria-label="Selecciona un resultado para filtrar las plantas">${[['tp','Con plaga + alerta',r.tp],['fn','Con plaga + sin alerta',r.fn],['fp','Sana + alerta',r.fp],['tn','Sana + sin alerta',r.tn]].map(([key,label,value])=>`<button type="button" data-kind="${key}" aria-pressed="${filter===key}"><span>${label}</span><b>${value}</b></button>`).join('')}</div>`;
  if(id==='missing')extra=`<div class="idea-ordered" aria-label="Medidas ordenadas">${r.ordered.map((v,i)=>`<span class="${i===1?'is-median':''}">${v} mm${i===1?'<b>Mediana</b>':''}</span>`).join('')}</div>`;
  if(id==='adjustment'){
   const max=Math.max(25,...p.history)*1.1,a=axes({xmin:0,xmax:15,ymin:0,ymax:max,xlabel:'Número de paso',ylabel:'Pérdida',xticks:[0,5,10,15],yticks:[0,max/2,max]});
   extra=svg('Pérdida en cada paso calculado',a.body+`<polyline points="${p.history.map((v,i)=>`${a.x(i)},${a.y(v)}`).join(' ')}" fill="none" stroke="${colors[0]}" stroke-width="3"/>`+p.history.map((v,i)=>pick(i,`Paso ${i}: pérdida ${fmt(v,3)}`,dot(a.x(i),a.y(v),colors[1]),Number(selected)===i)).join(''));
  }
  q('[data-extra]').innerHTML=extra;
  q('[data-legend]').innerHTML={prediction:'● Verde: observado · Naranja: predicho · Segmento: error',alerts:'▲ Con plaga · ● Sana · Aro: alerta · Zona sombreada: puntuación ≥ umbral',missing:'Barra verde: medida · Barra rayada: estimación de B',signal:'Verde: ReLU · Terracota: sigmoid · Azul: tanh',adjustment:'Curva: pérdida de la función · Puntos: pasos visitados',vision:'Coordenadas desde la esquina superior izquierda · Cuerpos de fruto dibujados',neighbors:'Verde: Estándar · Terracota: Extendido · Rombo: envío nuevo',convolution:'0: píxel oscuro · 1: píxel claro · Borde marcado: ventana o celda seleccionada'}[id];
  q('[data-brief]').textContent={prediction:'6 fincas simuladas · fertilizante (kg/ha) → rendimiento (t/ha)',alerts:'10 plantas · 4 con plaga · puntuaciones de 0 a 1',missing:'3 medidas de lluvia en mm · B sin registro',signal:'Una entrada · ReLU, sigmoid y tanh',adjustment:'Inicio −2 · objetivo 3 · pérdida (θ − 3)²',vision:'Una imagen · tres frutos dibujados',neighbors:`6 envíos · distancia en km y carga en kg · ${p.k} vecinos`,convolution:'Imagen 5 × 5 · filtro 3 × 3 · mapa 3 × 3'}[id];
  q('[data-table]').innerHTML=dataView(id,p,selected,filter);q('[data-insight]').textContent=detail(id,p,selected);q('[data-metrics]').innerHTML=metrics(summary(id,p));
  q('[data-show-all]').hidden=!filter;
  el.querySelectorAll('[data-control]').forEach(input=>{input.value=p[input.dataset.control];const out=q(`[data-output="${input.dataset.control}"]`);if(out){out.textContent=fmt(p[input.dataset.control],input.dataset.control==='slope'?4:input.step<1?2:0);input.setAttribute('aria-valuetext',out.textContent);}});
  el.querySelectorAll('[data-step]').forEach(b=>b.disabled=p.states.length>=16);
  if(q('.idea-three')?.open){q('[data-canvas]').innerHTML=renderIdeaPlot(id,p,selected);renderThreeScene(q('[data-three]'),id,p,index=>{selected=id==='adjustment'?p.states.length-1:index;draw();});}
  const comparison=q('[data-comparison]');comparison.hidden=!before;
  if(before){const sharedMax=id==='adjustment'?Math.max(40,...p.history,...before.history)*1.12:undefined;comparison.innerHTML=`<div class="idea-section-heading"><h3>Compara A y B</h3><button type="button" class="idea-text-button" data-clear>Quitar comparación</button></div><p>A queda fijo; los controles cambian B.</p><div class="idea-pair">${[[before,'A · Guardado'],[p,'B · Actual']].map(([state,label])=>`<article><h4>${label}</h4>${metrics(summary(id,state))}${id==='convolution'?table(['Fila','Mapa'],ideaResult(id,state).map.map((row,i)=>[i+1,row.map(v=>fmt(v,2)).join(' · ')]),'Mapa de respuestas'):renderIdeaPlot(id,state,selected,sharedMax)}</article>`).join('')}</div>`;
   comparison.querySelectorAll('[data-pick]').forEach(node=>{node.removeAttribute('role');node.removeAttribute('tabindex');node.removeAttribute('aria-pressed');node.removeAttribute('data-pick');});
  }
 }
 el.addEventListener('input',e=>{if(e.target.hasAttribute('data-topic-switch')){topic=TOPICS.find(t=>t.id===e.target.value);p=initialIdea(topic.id);selected=0;before=null;filter=null;caseIndex=0;build();q('.idea-intro h2').focus();animateChange();return;}const key=e.target.dataset.control;if(!key)return;p[key]=e.target.tagName==='SELECT'&&!['k'].includes(key)?e.target.value:Number(e.target.value);caseIndex=-1;q('[data-task]').textContent='Exploración libre: conserva los datos que no estás cambiando y compara el resultado con un escenario guardado.';el.querySelectorAll('[data-case]').forEach(b=>b.setAttribute('aria-pressed','false'));if(topic.id==='adjustment')selected=p.states.length-1;draw();});
 el.addEventListener('click',e=>{
  const target=e.target.closest('button,[data-pick]');if(!target)return;
  if(target.dataset.topic){topic=TOPICS.find(t=>t.id===target.dataset.topic);p=initialIdea(topic.id);selected=0;before=null;filter=null;caseIndex=0;build();q('.idea-intro h2').focus();animateChange();}
  else if(target.dataset.case!==undefined){caseIndex=Number(target.dataset.case);p=ideaCase(topic.id,caseIndex);selected=0;filter=null;q('[data-task]').textContent=topic.cases[caseIndex][1];el.querySelectorAll('[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b===target)));draw();animateChange();}
  else if(target.dataset.pick!==undefined){selected=Number(target.dataset.pick);draw();q(`[data-pick="${selected}"]`)?.focus();animateChange('select');}
  else if(target.dataset.kind){filter=filter===target.dataset.kind?null:target.dataset.kind;draw();q('[data-table-details]').open=true;q(`[data-kind="${target.dataset.kind}"]`)?.focus();animateChange('select');}
  else if(target.hasAttribute('data-show-all')){filter=null;draw();}
  else if(target.hasAttribute('data-fit')){p=ideaCase('prediction',2);caseIndex=2;q('[data-task]').textContent=topic.cases[2][1];el.querySelectorAll('[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case==='2')));draw();animateChange();}
  else if(target.dataset.step){p=stepIdea(p,Number(target.dataset.step));selected=p.states.length-1;draw();animateChange('select');}
  else if(target.hasAttribute('data-signal')){p.signal=Number(target.dataset.signal);draw();q(`[data-signal="${p.signal}"]`)?.focus();animateChange();}
  else if(target.hasAttribute('data-reset')){p=initialIdea(topic.id);selected=0;filter=null;caseIndex=0;build();}
  else if(target.hasAttribute('data-save')){before=structuredClone(p);q('[data-save]').textContent='Reemplazar escenario A';draw();animateChange('compare');}
  else if(target.hasAttribute('data-clear')){before=null;q('[data-save]').textContent='Guardar escenario A';draw();}
  else if(target.dataset.pixel){const [row,column]=target.dataset.pixel.split(',').map(Number);p.image[row][column]=1-p.image[row][column];draw();q(`[data-pixel="${row},${column}"]`).focus();animateChange('pixel');}
  else if(target.dataset.window){[p.row,p.column]=target.dataset.window.split(',').map(Number);draw();q(`[data-window="${p.row},${p.column}"]`).focus();animateChange('pixel');}
  else if(target.hasAttribute('data-project')){document.body.classList.toggle('projecting');target.setAttribute('aria-pressed',String(document.body.classList.contains('projecting')));target.textContent=document.body.classList.contains('projecting')?'Salir de proyección':'Vista para proyectar';}
 });
 el.addEventListener('keydown',e=>{if(e.target.matches('[data-pick]')&&e.target.tagName.toLowerCase()!=='button'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
 build();
}
