const ids=['dl-yolo','dl-evaluacion','dl-integracion'];
const f=(n,d=2)=>Number(n).toLocaleString('es-CO',{maximumFractionDigits:d});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const PRACTICAL_E4={
 'dl-yolo':{
  problem:'Una cooperativa recibe cosecha. Antes de contar o revisar, necesita registrar dónde aparecen los objetos en cada imagen.',
  goal:'Seguir una propuesta desde su caja hasta su fila y comprobar qué cambia al filtrar.',
  task:'Elige una escena. Lee las puntuaciones dadas y predice cuántas propuestas pasarán el filtro antes de mostrar el resultado.',
  change:'Compara cortes de puntuación 0,50 y 0,90 manteniendo la misma escena y las mismas propuestas.',
  watch:'Una caja es una propuesta del detector. La fila se conserva si su puntuación supera el corte; el objeto dibujado no desaparece al filtrar.',
  expected:'El registro cuenta propuestas conservadas, no objetos confirmados. Puede omitir objetos y conservar una caja sobre el fondo.',
  bridge:'Ya tenemos un registro. El siguiente tema añade referencias conocidas para comprobar si sus cajas están bien ubicadas.',
  colabBridge:'Aquí las cajas y puntuaciones están dadas en un dibujo agrícola. Colab ejecuta YOLO sobre una foto de objetos cotidianos: no identifica defectos agrícolas ni convierte este esquema en una evaluación real.',
  checkQuestion:'¿Cuatro filas demostrarían que recibimos exactamente cuatro objetos?',
  checkAnswer:'No. Son cuatro propuestas conservadas. Puede haber omisiones, duplicados o falsas propuestas; hace falta comprobarlas.'
 },
 'dl-evaluacion':{
  problem:'La caja quedó en el registro, pero todavía debemos comprobar si corresponde al objeto que conocemos.',
  goal:'Construir IoU con ancho, alto y áreas visibles, y separar propuestas incorrectas de objetos omitidos.',
  task:'Compara las dos cajas. Predice TP/FP/FN y después revela las áreas, la división y los conteos.',
  change:'Prueba la misma caja sin desplazar, desplazada 10 y 30 píxeles. Conserva IoU mínima 0,50; después sube solo el corte de puntuación a 0,90.',
  watch:'El corte de puntuación decide si conservamos la propuesta. IoU mide superposición. TP/FP/FN requieren además la categoría correcta.',
  expected:'Con puntuación 0,80 y corte 0,50: desplazamiento 0 o 10 da TP/FP/FN=1/0/0; 30 da 0/1/1. Con corte 0,90 queda 0/0/1.',
  bridge:'Comprobar localización no decide qué producto revisar. El último tema cambia explícitamente a puntuaciones de defecto y consecuencias de una política.',
  colabBridge:'Colab usa estas cajas sintéticas conocidas; no calcula mAP de la fotografía de YOLO. Una referencia solo puede emparejarse una vez.',
  checkQuestion:'¿Por qué una sola caja mal ubicada puede sumar FP y FN?',
  checkAnswer:'FP cuenta la propuesta sin coincidencia válida. FN cuenta el objeto de referencia que quedó sin detectar. Son dos tipos de conteo, no dos objetos adicionales.'
 },
 'dl-integracion':{
  problem:'En la misma recepción ya sabemos qué unidades estudiar. Ahora decidimos cuáles revisar por posible defecto y qué consecuencias tendría esa regla.',
  goal:'Separar puntuación de defecto, acción de revisión, referencia conocida y coste supuesto.',
  task:'Elige una regla viendo solo las puntuaciones. Expresa una previsión y después revela las etiquetas para calcular el coste observado del ejemplo.',
  change:'Conserva los mismos diez granos. Compara cortes 0,30, 0,50, 0,70, 0,90 y revisar todos; cambia únicamente el coste de aceptar un defecto entre 8 y 1.',
  watch:'Revisión se cuenta por grano revisado. Defecto aceptado se cuenta solo entre los no revisados cuya referencia indica defecto.',
  expected:'Con coste 1 por revisión y 8 por defecto aceptado: corte 0,30 cuesta 6; 0,50 cuesta 12; revisar todos cuesta 10. Una puntuación por sí sola no permite conocer el coste observado.',
  bridge:'El recorrido termina uniendo registro, comprobación y decisión. Elegimos reglas con validación y después las comprobamos en una prueba reservada.',
  colabBridge:'La tabla del cuaderno usa estos diez granos, etiquetas y puntuaciones dadas. p_defecto no es la confianza de localización de YOLO ni sale del modelo COCO de la fotografía.',
  checkQuestion:'Si cambiamos el coste de omitir un defecto, ¿aprende de nuevo el modelo?',
  checkAnswer:'No. Se conservan los granos, sus puntuaciones y etiquetas; solo recalculamos las consecuencias de las reglas. La política preferida puede cambiar sin entrenar.'
 }
};

const DETECTION_CASES=[
 {name:'Un objeto, una propuesta',objects:[[35,50,12]],boxes:[{box:[20,35,50,65],score:.8}]},
 {name:'Dos objetos, dos puntuaciones',objects:[[25,35,12],[65,65,12]],boxes:[{box:[10,20,40,50],score:.8},{box:[50,50,80,80],score:.45}]},
 {name:'Objetos y una propuesta sobre el fondo',objects:[[25,30,12],[65,30,12],[25,70,12]],boxes:[{box:[10,15,40,45],score:.8},{box:[50,15,80,45],score:.6},{box:[10,55,40,85],score:.3},{box:[60,60,90,90],score:.55}]}
];
export const E4_GRAINS=Object.freeze([.1,.8,.2,.4,.9,.1,.6,.7,.2,.3].map((score,i)=>Object.freeze({id:i+1,score,defect:[2,4,5,8].includes(i+1)})));
export function e4Detection(caseIndex=0,cut=.5){
 const scene=DETECTION_CASES[caseIndex];if(!scene||!Number.isFinite(cut)||cut<0||cut>1)throw new Error('Escena o corte no válido.');
 const rows=scene.boxes.map((p,i)=>({...p,id:i+1,kept:p.score>cut}));return {scene:scene.name,objects:scene.objects,rows,count:rows.filter(r=>r.kept).length,cut};
}
export function e4Overlap(dx=10,cut=.5,minIoU=.5){
 if(!Number.isFinite(dx)||dx<0||dx>40||![cut,minIoU].every(v=>Number.isFinite(v)&&v>=0&&v<=1))throw new Error('Desplazamiento o corte no válido.');
 const reference=[10,20,50,60],proposal=[10+dx,20,50+dx,60],width=40,height=40,commonWidth=Math.max(0,40-dx),commonArea=commonWidth*height,areaA=width*height,areaB=areaA,union=areaA+areaB-commonArea,iou=commonArea/union,score=.8,kept=score>cut,tp=Number(kept&&iou>=minIoU),fp=Number(kept&&!tp),fn=1-tp;
 return {reference,proposal,dx,width,height,commonWidth,commonArea,areaA,areaB,union,iou,score,cut,minIoU,kept,tp,fp,fn};
}
export function e4Policy(cut=.5,omissionCost=8,reviewAll=false){
 if(!Number.isFinite(cut)||cut<0||cut>1||!Number.isFinite(omissionCost)||omissionCost<0)throw new Error('Regla o coste no válido.');
 const rows=E4_GRAINS.map(g=>({...g,review:reviewAll||g.score>=cut})),reviews=rows.filter(r=>r.review).length,acceptedDefects=rows.filter(r=>!r.review&&r.defect).length,cost=reviews+acceptedDefects*omissionCost;
 return {rows,cut,omissionCost,reviewAll,reviews,acceptedDefects,cost,allCost:10};
}

const states={
 'dl-yolo':{caseIndex:0,cut:.5,prediction:'',revealed:false},
 'dl-evaluacion':{caseIndex:1,dx:10,cut:.5,prediction:'',revealed:false},
 'dl-integracion':{caseIndex:0,policy:'.5',omissionCost:8,prediction:'',revealed:false}
};
const defaults=JSON.parse(JSON.stringify(states));
const caseButtons=(id,labels,selected)=>`<div class="pw-controls" role="group" aria-label="Tres casos para explorar">${labels.map((label,i)=>`<button type="button" class="button secondary small" data-p4-case="${i}" aria-pressed="${selected===i}">${i+1}. ${esc(label)}</button>`).join('')}</div>`;
const prediction=(question,options)=>`<div class="pw-challenge"><h3>Predice antes de revelar</h3><label>${esc(question)}<select data-p4-prediction><option value="">Elige una previsión</option>${options.map(([value,label])=>`<option value="${value}">${esc(label)}</option>`).join('')}</select></label><button type="button" class="button" data-p4-reveal disabled>Revelar y comprobar</button><p class="pw-feedback" data-p4-feedback role="status" aria-live="polite">Todavía no mostramos el resultado. Elige una previsión.</p></div>`;
const svgFrame=(id,label)=>`<div class="pw-map" tabindex="0" role="region" aria-label="Gráfico interactivo; desplázalo si no cabe"><svg data-dl-diagram="${id}" data-p4-svg viewBox="0 0 760 390" role="img" aria-label="${esc(label)}" style="width:100%;height:auto;display:block"><title>${esc(label)}</title></svg></div>`;

export function renderE4Workbench(id){
 if(!ids.includes(id))return '';
 const s=states[id],reset='<button type="button" class="button secondary small" data-p4-reset>Reiniciar este tema</button>';
 let controls='',challenge='';
 if(id==='dl-yolo'){
  controls=caseButtons(id,DETECTION_CASES.map(c=>c.name),s.caseIndex)+`<div class="pw-controls"><label>Corte de puntuación <select data-p4-cut><option value="0.5">0,50</option><option value="0.9">0,90</option></select></label>${reset}</div><p class="pw-hint">Escenas, cajas y puntuaciones inventadas. Aquí conservamos puntuación &gt; corte, como en el cuaderno; no ejecutamos YOLO.</p>`;
  challenge=prediction('¿Cuántas propuestas quedarán en el registro?',Array.from({length:5},(_,i)=>[String(i),String(i)+' propuestas']));
 }else if(id==='dl-evaluacion'){
  controls=caseButtons(id,['Sin desplazar','Desplazar 10 px','Desplazar 30 px'],s.caseIndex)+`<div class="pw-controls"><label>Corte de puntuación <select data-p4-cut><option value="0.5">0,50</option><option value="0.9">0,90</option></select></label><span>IoU mínima: 0,50 · categoría correcta</span>${reset}</div><p class="pw-hint">Referencia: caja anotada que usamos para comprobar. [10,20,50,60] indica [izquierda, arriba, derecha, abajo]; mide 40 × 40 píxeles. Propuesta: caja del modelo, con puntuación dada 0,80. IoU mide qué parte del área cubierta por ambas es compartida.</p>`;
  controls+='<p class="pw-hint"><strong>Qué contamos:</strong> TP = propuesta que coincide con la referencia; FP = propuesta conservada sin coincidencia; FN = objeto de referencia que quedó sin detectar. Conservamos una propuesta solo si pasa el filtro.</p>';
  challenge=prediction('¿Qué conteos esperas: TP / FP / FN?',[['1/0/0','1 / 0 / 0: coincidencia válida'],['0/1/1','0 / 1 / 1: falsa propuesta y omisión'],['0/0/1','0 / 0 / 1: propuesta filtrada y omisión']]);
 }else{
  controls=caseButtons(id,['Omitir cuesta 8','Omitir cuesta 1','Revisar todos'],s.caseIndex)+`<div class="pw-controls"><label>Regla de revisión <select data-p4-policy><option value=".3">Puntuación ≥ 0,30</option><option value=".5">Puntuación ≥ 0,50</option><option value=".7">Puntuación ≥ 0,70</option><option value=".9">Puntuación ≥ 0,90</option><option value="all">Revisar los diez</option></select></label><label>Coste de aceptar un defecto <select data-p4-omission><option value="8">8 puntos</option><option value="1">1 punto</option></select></label><span>Revisar: 1 punto por grano</span>${reset}</div><p class="pw-hint">Diez unidades conocidas, no diez detecciones confirmadas por YOLO. p_defecto es otra puntuación dada. Referencias ocultas hasta comprobar; suponemos revisión perfecta y costes ficticios.</p>`;
  challenge=prediction('Frente a revisar los diez (10 puntos), ¿qué prevés?',[['lower','Un coste menor'],['equal','El mismo coste'],['higher','Un coste mayor'],['unknown','Faltan referencias para calcular']]);
 }
 return `<div class="p4-workbench" data-p4-workbench="${id}">${controls}${svgFrame(id,id==='dl-yolo'?'Escena y propuestas del detector simulado':id==='dl-evaluacion'?'Caja de referencia y propuesta desplazada':'Diez granos, puntuaciones dadas y decisiones de revisión')}<div data-p4-inputs></div>${challenge}<div data-p4-result hidden></div></div>`;
}

const text=(x,y,label,size=17,anchor='start',extra='')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="var(--ink)" ${extra}>${esc(label)}</text>`;
function detectionSvg(r,revealed){
 return `<title>Propuestas simuladas sobre una imagen de 100 por 100 píxeles</title><rect x="24" y="42" width="300" height="300" rx="8" fill="var(--soft)" stroke="var(--line)"/>${text(24,24,'Imagen simulada · 100 × 100 px',17)}<g transform="translate(24 42) scale(3)">${r.objects.map(([x,y,rad])=>`<circle cx="${x}" cy="${y}" r="${rad}" fill="#dca472" stroke="#78503a" stroke-width=".8"/>`).join('')}${r.rows.map(p=>`<rect x="${p.box[0]}" y="${p.box[1]}" width="${p.box[2]-p.box[0]}" height="${p.box[3]-p.box[1]}" fill="none" stroke="${revealed&&!p.kept?'#888b91':'#287a72'}" stroke-width="1" ${revealed&&!p.kept?'stroke-dasharray="2 1"':''}/><text x="${p.box[0]}" y="${p.box[1]-1.5}" font-size="4.5" fill="var(--ink)">P${p.id}</text>`).join('')}</g>${text(375,45,'Propuesta → fila del registro',21)}${r.rows.map((p,i)=>`${text(375,95+i*58,`P${p.id} · fruto · ${f(p.score)}`,19)}${text(375,118+i*58,revealed?(p.kept?'Se conserva':'Se descarta'):'¿Supera el corte?',16)}`).join('')}${text(24,372,revealed?`Registro: ${r.count} propuestas conservadas`:'Las cajas se filtran; los objetos dibujados permanecen.',18)}`;
}
function detectionInputs(r,revealed){return `<div class="pw-table-wrap"><table><caption>Entradas dadas y estado de cada propuesta</caption><thead><tr><th>Propuesta</th><th>Categoría propuesta</th><th>Puntuación</th><th>Coordenadas [x₁,y₁,x₂,y₂]</th><th>Filtro</th></tr></thead><tbody>${r.rows.map(p=>`<tr><th>P${p.id}</th><td>Fruto</td><td>${f(p.score)}</td><td>[${p.box.join(', ')}]</td><td>${revealed?(p.kept?'Conservar':'Descartar'):'Por comprobar'}</td></tr>`).join('')}</tbody></table></div>`;}
function overlapSvg(r,revealed){
 const scale=3.4,ox=35,oy=55;return `<title>Dos cajas de 40 por 40 píxeles, desplazamiento ${r.dx} píxeles</title>${text(30,25,'Referencia y propuesta · unidades en píxeles',19)}<rect x="${ox}" y="${oy}" width="340" height="272" fill="var(--soft)" stroke="var(--line)"/><g transform="translate(${ox} ${oy}) scale(${scale})"><rect x="10" y="20" width="40" height="40" fill="#4b91bb" fill-opacity=".25" stroke="#3a80a9" stroke-width=".8"/>${revealed&&r.commonWidth?`<rect x="${10+r.dx}" y="20" width="${r.commonWidth}" height="40" fill="#2a8b75" fill-opacity=".45"/>`:''}<rect x="${10+r.dx}" y="20" width="40" height="40" fill="none" stroke="#bd681d" stroke-width=".9" ${revealed&&!r.kept?'stroke-dasharray="2 1"':''}/></g>${text(420,72,'Referencia fija (azul)',20)}${text(420,103,'[10, 20, 50, 60]',18)}${text(420,150,'Propuesta (naranja)',20)}${text(420,181,'['+r.proposal.join(', ')+']',18)}${text(420,230,`Desplazamiento: ${r.dx} px`,18)}${text(420,265,'Puntuación: 0,80',18)}${text(420,300,`Corte de puntuación: ${f(r.cut)}`,18)}${text(35,365,revealed?`IoU = ${f(r.iou,3)} · TP / FP / FN = ${r.tp} / ${r.fp} / ${r.fn}`:'Predice los conteos; después construimos la cuenta.',18)}`;
}
function overlapResult(r){
 return `<div class="pw-result"><h3>Primero las áreas; después la división</h3><ol><li class="pw-step"><strong>Área de referencia:</strong> ancho = 50 − 10 = 40 px; alto = 60 − 20 = 40 px. <div class="pw-equation">40 × 40 = ${r.areaA} px²</div></li><li class="pw-step"><strong>Área de propuesta:</strong> mide también 40 × 40. <div class="pw-equation">40 × 40 = ${r.areaB} px²</div></li><li class="pw-step"><strong>Área común:</strong> ancho compartido = máx(0, 50 − ${10+r.dx}) = ${r.commonWidth} px; alto compartido = 40 px.<div class="pw-equation">${r.commonWidth} × 40 = ${r.commonArea} px²</div></li><li class="pw-step"><strong>Unión:</strong> sumar las dos áreas contaría dos veces la zona común; la restamos una vez.<div class="pw-equation">${r.areaA} + ${r.areaB} − ${r.commonArea} = ${r.union} px²</div></li><li class="pw-step"><strong>IoU:</strong> área común ÷ unión. Las unidades se cancelan.<div class="pw-equation">${r.commonArea} ÷ ${r.union} = ${f(r.iou,3)}</div></li></ol><h3>Dos comprobaciones diferentes</h3><p><strong>Filtro:</strong> 0,80 &gt; ${f(r.cut)} → ${r.kept?'propuesta conservada':'propuesta descartada'}.</p><p><strong>Coincidencia:</strong> categoría correcta e IoU ${f(r.iou,3)} ≥ 0,50 → ${r.iou>=.5?'ubicación suficiente':'ubicación insuficiente'}.</p><div class="pw-equation">TP = ${r.tp} · FP = ${r.fp} · FN = ${r.fn}</div><p>${r.tp?'La propuesta conservada coincide con la única referencia.':r.fp?'La propuesta conservada no coincide: cuenta un FP. El objeto de referencia quedó sin detectar: cuenta un FN.':'No queda propuesta conservada, así que no hay FP. El objeto de referencia sigue presente y omitido: cuenta un FN.'}</p><p class="pw-hint">Este ejemplo tiene una referencia y una propuesta de la misma categoría. No calcula AP ni mAP de las fotografías.</p></div>`;
}
function policySvg(r,revealed){
 return `<title>Diez granos con puntuaciones de defecto dadas, referencias ${revealed?'visibles':'ocultas'}</title>${text(30,28,'Cada unidad tiene su propia puntuación de defecto.',19)}${r.rows.map((g,i)=>{const x=80+(i%5)*145,y=100+Math.floor(i/5)*145;return `<circle cx="${x}" cy="${y}" r="31" fill="${revealed?(g.defect?'#edb98d':'#b4cdbb'):'var(--soft)'}" stroke="var(--ink)" stroke-width="1.5"/>${text(x,y+6,String(g.id),21,'middle',revealed?'style="fill:#242823"':'')}${text(x,y+54,`p = ${f(g.score)}`,16,'middle')}${text(x,y+77,g.review?'REVISAR':'ACEPTAR',14,'middle')}${text(x,y+99,revealed?(g.defect?'Defecto':'Sano'):'Referencia oculta',13,'middle')}`}).join('')}${text(30,375,revealed?`Revisar: ${r.reviews} · defectos aceptados: ${r.acceptedDefects}`:'La puntuación orienta una acción; todavía no revela la referencia.',17)}`;
}
function policyResult(r){
 const reviewIDs=r.rows.filter(g=>g.review).map(g=>g.id),defectIDs=r.rows.filter(g=>!g.review&&g.defect).map(g=>g.id),costs=[.3,.5,.7,.9].map(c=>e4Policy(c,r.omissionCost));
 return `<div class="pw-result"><h3>Con las referencias visibles ya podemos calcular</h3><p>Revisamos los granos ${reviewIDs.length?reviewIDs.join(', '):'—'}: <strong>${r.reviews} revisiones</strong>.</p><p>Defectos entre los no revisados: ${defectIDs.length?'grano'+(defectIDs.length>1?'s ':' ')+defectIDs.join(', '):'ninguno'}. <strong>Total: ${r.acceptedDefects}.</strong></p><ol><li class="pw-step">Trabajo de revisión: ${r.reviews} granos × 1 punto = <strong>${r.reviews} puntos</strong>.</li><li class="pw-step">Consecuencia de aceptar defectos: ${r.acceptedDefects} × ${r.omissionCost} = <strong>${r.acceptedDefects*r.omissionCost} puntos</strong>.</li><li class="pw-step">Sumamos ambas consecuencias.<div class="pw-equation">${r.reviews} × 1 + ${r.acceptedDefects} × ${r.omissionCost} = ${r.cost} puntos</div></li></ol><div class="pw-table-wrap"><table><caption>Mismos diez granos; solo cambia la regla</caption><thead><tr><th>Regla</th><th>Revisiones</th><th>Defectos aceptados</th><th>Coste</th></tr></thead><tbody>${costs.map(p=>`<tr><th>≥ ${f(p.cut)}</th><td>${p.reviews}</td><td>${p.acceptedDefects}</td><td>${p.cost} puntos</td></tr>`).join('')}<tr><th>Revisar todos</th><td>10</td><td>0</td><td>10 puntos</td></tr></tbody></table></div><p class="pw-hint">Referencia positiva = defectuoso. Suponemos revisión perfecta; revisar ya incluye el trabajo de las falsas alertas y no sumamos otra penalización por ellas. Son puntos ficticios, no dinero ni ahorro comercial. Elegir con validación; comprobar después con prueba reservada.</p></div>`;
}

function clearPrediction(root,s){s.prediction='';s.revealed=false;root.querySelector('[data-p4-prediction]').value='';root.querySelector('[data-p4-reveal]').disabled=true;}
function draw(root,id){
 const s=states[id],svg=root.querySelector('[data-p4-svg]'),inputs=root.querySelector('[data-p4-inputs]'),result=root.querySelector('[data-p4-result]'),feedback=root.querySelector('[data-p4-feedback]');let model,actual,feedbackText='';
 root.querySelectorAll('[data-p4-case]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.p4Case===s.caseIndex)));
 if(id==='dl-yolo'){
  model=e4Detection(s.caseIndex,s.cut);root.querySelector('[data-p4-cut]').value=String(s.cut);svg.innerHTML=detectionSvg(model,s.revealed);inputs.innerHTML=detectionInputs(model,s.revealed);actual=String(model.count);
  result.innerHTML=`<div class="pw-result"><h3>Qué conserva el filtro</h3>${model.rows.map(p=>`<p>P${p.id}: ${f(p.score)} &gt; ${f(s.cut)} → <strong>${p.kept?'conservar':'descartar'}</strong>.</p>`).join('')}<div class="pw-equation">${model.count} propuestas conservadas → ${model.count} filas</div><p>La escena contiene ${model.objects.length} objetos dibujados. Ese número no cambia al mover el corte. ${s.caseIndex===2?'En este caso hay además una propuesta sobre el fondo y una propuesta de objeto que puede quedar bajo el corte. Igualar el conteo real por casualidad no valida el registro.':'El número de filas describe la salida del filtro, no un inventario validado.'}</p></div>`;
  feedbackText=`Tu previsión: ${s.prediction} propuestas. Resultado: ${model.count}. ${s.prediction===actual?'La comparación de puntuaciones confirma tu previsión.':'Revisa cada comparación: el filtro conserva puntuación estrictamente mayor al corte.'}`;
 }else if(id==='dl-evaluacion'){
  model=e4Overlap(s.dx,s.cut);root.querySelector('[data-p4-cut]').value=String(s.cut);svg.innerHTML=overlapSvg(model,s.revealed);inputs.innerHTML='';result.innerHTML=overlapResult(model);actual=`${model.tp}/${model.fp}/${model.fn}`;
  feedbackText=`Tu previsión TP/FP/FN: ${s.prediction}. Resultado: ${actual}. ${s.prediction===actual?'Coincide: ahora puedes justificarlo con filtro y superposición.':'Comprueba primero si se conserva la propuesta y luego si coincide con la referencia.'}`;
 }else{
  model=e4Policy(s.policy==='all'?0:Number(s.policy),s.omissionCost,s.policy==='all');root.querySelector('[data-p4-policy]').value=s.policy;root.querySelector('[data-p4-omission]').value=String(s.omissionCost);svg.innerHTML=policySvg(model,s.revealed);inputs.innerHTML='';result.innerHTML=policyResult(model);actual=model.cost<10?'lower':model.cost>10?'higher':'equal';
  const labels={lower:'un coste menor',equal:'el mismo coste',higher:'un coste mayor',unknown:'que faltaban referencias para calcular'};
  feedbackText=s.prediction==='unknown'?`Exacto: las puntuaciones solas no daban el coste observado. Al revelar referencias, la regla cuesta ${model.cost} puntos frente a 10 de revisar todos.`:`Previste ${labels[s.prediction]}. Con las referencias del ejemplo obtenemos ${model.cost} puntos frente a 10: ${labels[actual]}. ${s.prediction===actual?'Tu previsión se cumple en estos datos.':'La comparación observada cambia esa previsión.'}`;
 }
 result.hidden=!s.revealed;feedback.textContent=s.revealed?feedbackText:'Resultado oculto. Elige una previsión; después revela y comprueba con los datos.';
}

export function mountE4Workbench(root=document){
 root.querySelectorAll('[data-p4-workbench]').forEach(workbench=>{
  if(workbench.dataset.p4Mounted)return;workbench.dataset.p4Mounted='true';const id=workbench.dataset.p4Workbench,s=states[id];if(!s)return;
  workbench.querySelector('[data-p4-prediction]').value=s.prediction;workbench.querySelector('[data-p4-reveal]').disabled=!s.prediction;
  workbench.querySelectorAll('[data-p4-case]').forEach(b=>b.addEventListener('click',()=>{s.caseIndex=+b.dataset.p4Case;if(id==='dl-evaluacion')s.dx=[0,10,30][s.caseIndex];if(id==='dl-integracion'){s.omissionCost=s.caseIndex===1?1:8;s.policy=s.caseIndex===2?'all':s.caseIndex===1?'.7':'.5';}clearPrediction(workbench,s);draw(workbench,id)}));
  const cut=workbench.querySelector('[data-p4-cut]');if(cut)cut.addEventListener('change',()=>{s.cut=Number(cut.value);clearPrediction(workbench,s);draw(workbench,id)});
  const policy=workbench.querySelector('[data-p4-policy]');if(policy)policy.addEventListener('change',()=>{s.policy=policy.value;clearPrediction(workbench,s);draw(workbench,id)});
  const omission=workbench.querySelector('[data-p4-omission]');if(omission)omission.addEventListener('change',()=>{s.omissionCost=Number(omission.value);clearPrediction(workbench,s);draw(workbench,id)});
  workbench.querySelector('[data-p4-prediction]').addEventListener('change',e=>{s.prediction=e.target.value;s.revealed=false;workbench.querySelector('[data-p4-reveal]').disabled=!s.prediction;draw(workbench,id)});
  workbench.querySelector('[data-p4-reveal]').addEventListener('click',()=>{if(!s.prediction)return;s.revealed=true;draw(workbench,id)});
  workbench.querySelector('[data-p4-reset]').addEventListener('click',()=>{Object.assign(s,defaults[id]);clearPrediction(workbench,s);draw(workbench,id)});
  draw(workbench,id);
 });
}
