import test from 'node:test';
import assert from 'node:assert/strict';
import {DELIVERIES,recurrentStates,memoryWeights,lstmStep,softmax,ATTENTION_DAYS,attention,selfAttention,encodeSequence,sameSummary,SCENE,overlap,iou,suppressDuplicates,detect,evaluateScene,precisionRecallCurve,REVIEW_UNITS,reviewCost,cheapestCut} from '../docs/dl-visual-models.js';
import {VISUAL_TOPICS,hasVisualExplainer,renderVisualIdea,renderVisualFigures,renderVisualCards,visualColabNote,drawVisualFigure,mountVisualExplainers,visualGoals,visualFigureDefaults,encounterGlossary,renderEncounterClosing,topicReferences,encounterReferences} from '../docs/dl-visual-explainers.js';
import {PRACTICAL_LESSONS,renderPracticalGuide,renderPracticalPractice} from '../docs/dl-practical-lessons.js';
import {LESSONS} from '../docs/content.js';

const near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<=e,`${a} ≈ ${b}`);

test('memoria recurrente: la regla mitad y mitad reproduce el ejercicio y los pesos se desvanecen',()=>{
 assert.deepEqual(recurrentStates([10,20,30,40],.5),[5,12.5,21.25,30.625]);
 assert.equal(DELIVERIES.length,12);
 const w=memoryWeights(12,.5);near(w[11],.5);near(w[0],.5**12);
 const states=recurrentStates(DELIVERIES,.5);near(states[11],DELIVERIES.reduce((a,x,i)=>a+x*w[i],0));
 assert.deepEqual(recurrentStates(DELIVERIES,0),DELIVERIES);
});

test('compuertas LSTM: recordar, reemplazar y callar dan los resultados esperados',()=>{
 const base={previous:.8,candidate:.5};
 assert.equal(lstmStep({...base,forget:1,input:0,output:1}).memory,.8);
 assert.equal(lstmStep({...base,forget:0,input:1,output:1}).memory,.5);
 assert.equal(lstmStep({...base,forget:1,input:0,output:0}).shown,0);
 near(lstmStep({...base,forget:.5,input:.5,output:1}).shown,Math.tanh(.65));
});

test('atención: coincide con el cuaderno en los registros A y B y reparte por igual con Q = [0, 0]',()=>{
 const r=attention([1,0],[[1,0],[0,1]],[10,20]);near(r.weights[0],.6697615493,1e-9);near(r.output,13.3023845067,1e-9);
 assert.deepEqual(ATTENTION_DAYS.slice(0,2).map(d=>[d.key,d.value]),[[[1,0],10],[[0,1],20]]);
 const keys=ATTENTION_DAYS.map(d=>d.key),values=ATTENTION_DAYS.map(d=>d.value);
 const even=attention([0,0],keys,values);even.weights.forEach(w=>near(w,.25));near(even.output,25);
 near(softmax([1,2,3]).reduce((a,b)=>a+b),1);
 assert.ok(attention([1,1],keys,values,.3).weights[2]>attention([1,1],keys,values,1).weights[2],'temperatura baja concentra');
 for(const row of selfAttention(keys))near(row.reduce((a,b)=>a+b),1);
});

test('Transformer: sin posición el orden no cambia el resumen; con posición sí',()=>{
 const a=[6,2,5,3],b=[3,5,2,6];
 assert.ok(sameSummary(encodeSequence(a,false).summary,encodeSequence(b,false).summary));
 assert.ok(!sameSummary(encodeSequence(a,true).summary,encodeSequence(b,true).summary,1e-3));
 for(const row of encodeSequence(a,true).weights)near(row.reduce((x,y)=>x+y),1);
});

test('detección: el corte usa puntuación > corte y la supresión deja una caja por fruto repetido',()=>{
 near(overlap([10,20,50,60],[20,20,60,60]).iou,.6);near(iou([10,20,50,60],[40,20,80,60]),400/2800);assert.equal(iou([0,0,10,10],[20,20,30,30]),0);
 assert.equal(detect(SCENE,.25,false).kept.length,12);
 assert.equal(detect(SCENE,.48,false).passed.some(p=>p.id==='P3'),false,'0,48 no supera el corte 0,48');
 const clean=detect(SCENE,.25,true);
 assert.deepEqual(clean.kept.map(p=>p.id).sort(),['P1','P10','P11','P12','P4','P6','P8','P9']);
 assert.deepEqual(clean.removed.map(p=>[p.id,p.duplicateOf]).sort(),[['P2','P1'],['P3','P1'],['P5','P4'],['P7','P6']]);
 assert.equal(suppressDuplicates(SCENE.proposals.filter(p=>['P8','P9'].includes(p.id))).kept.length,2,'categorías distintas no se suprimen entre sí');
});

test('evaluación: los conteos, la precisión y el recall salen de la misma escena',()=>{
 const low=evaluateScene(SCENE,.25),mid=evaluateScene(SCENE,.5),high=evaluateScene(SCENE,.9);
 assert.deepEqual([low.tp,low.fp,low.fn],[5,3,0]);assert.deepEqual([mid.tp,mid.fp,mid.fn],[4,1,1]);assert.deepEqual([high.tp,high.fp,high.fn],[1,0,4]);
 near(mid.precision,.8);near(mid.recall,.8);assert.equal(mid.missed[0].id,'O5');
 assert.equal(evaluateScene(SCENE,.95).precision,null,'sin cajas la precisión no está definida');
 const curve=precisionRecallCurve(SCENE);assert.equal(curve.length,19);assert.ok(curve[0].recall>=curve.at(-1).recall);
});

test('costes: reproduce la tabla del cuaderno y el corte más barato depende del coste del defecto',()=>{
 const totals=[.3,.5,.7,.9].map(c=>reviewCost(REVIEW_UNITS,c,1,8));
 assert.deepEqual(totals.map(t=>[t.reviewed,t.accepted,t.total]),[[6,0,6],[4,1,12],[3,1,11],[1,3,25]]);
 assert.equal(reviewCost(REVIEW_UNITS,0,1,8).total,10);
 assert.equal(cheapestCut(REVIEW_UNITS,1,8).total,5);assert.equal(cheapestCut(REVIEW_UNITS,1,1).total,4);
 assert.ok(cheapestCut(REVIEW_UNITS,1,1).cut>cheapestCut(REVIEW_UNITS,1,8).cut);
});

test('las mejoras viven dentro de las secciones existentes de cada tema, sin bloque añadido',()=>{
 assert.deepEqual([...VISUAL_TOPICS].sort(),Object.keys(PRACTICAL_LESSONS).sort());
 assert.equal(hasVisualExplainer('dl-redes'),false);
 for(const render of [renderVisualIdea,renderVisualFigures,renderVisualCards])assert.equal(render('dl-redes'),'');
 for(const id of VISUAL_TOPICS){
  const lesson=LESSONS.find(l=>l.id===id),page=renderPracticalGuide(lesson),practice=renderPracticalPractice(lesson);
  const at=text=>{const i=page.indexOf(text);assert.notEqual(i,-1,id+' falta: '+text);return i;};
  const idea=at('id="idea-del-tema"'),example=at('id="ejemplo-del-tema"');
  assert.match(page,/<h2>1\. Sigamos el caso de la cooperativa<\/h2>/,id+' conserva la sección del caso');
  // Sección 1: el caso y, dentro de él, la idea y la comparación.
  assert.ok(idea<at('data-student-story=')&&at('data-student-story=')<at('data-vx-idea=')&&at('data-vx-idea=')<example,id+' idea dentro del caso');
  assert.ok(at('Dónde sirve en la industria')<example&&at('class="pw-concept-map pw-flow"')<example,id+' industria y mapa siguen en la sección 1');
  // Sección 2: figura, ejercicio existente y vocabulario, en ese orden.
  const figures=at('data-vx-topic='),bench=page.search(/data-p3-topic=|data-p4-workbench=/),cards=at('data-vx-cards=');
  assert.ok(example<figures&&figures<cards&&cards<bench,id+' figura → vocabulario → ejercicio');
  // Orden completo de la página: apertura, caso, idea, figura, tarjetas, ejercicio, galería, vocabulario formal, glosario; la bibliografía cierra el tema.
  const whole=page+practice,pos=t=>whole.indexOf(t);
  const order=['data-vx-opener=','data-student-story=','data-vx-idea=','id="ejemplo-del-tema"','data-vx-topic=','data-vx-cards=',/data-p3-topic=|data-p4-workbench=/,'Relacionar la figura con las imágenes','data-pw-definitions','data-vx-glossary=','id="practica-del-tema"','id="cuaderno-del-tema"','dl-colab-link',/data-vx-refs=|data-vx-closing=/]
   .map(k=>typeof k==='string'?pos(k):whole.search(k)).filter(i=>i!==-1);
  assert.deepEqual(order,[...order].sort((a,b)=>a-b),id+' orden de bloques');
  assert.equal(pos('data-vx-opener=')!==-1,['dl-secuencias','dl-yolo'].includes(id),id+' apertura solo en el primer tema');
  assert.equal(page.includes('data-vx-refs='),false,id+' la bibliografía no interrumpe la explicación');
  assert.ok(cards<at('data-pw-definitions'),id+' la definición formal sigue disponible');
  assert.equal(page.split('<details class="term-definition"').length-1,0,id+' ningún término exige un clic propio');
  for(const [key,count] of [['data-vx-idea=',1],['data-vx-topic=',1],['data-vx-cards=',1],['class="vx-idea"',1],['class="vx-analogy"',1]])assert.equal(page.split(key).length-1,count,id+' '+key);
  assert.ok((page.match(/class="vx-card /g)||[]).length>=7,id+' vocabulario');assert.ok((page.match(/data-vx-fig=/g)||[]).length>=1,id+' figura');
  assert.equal((renderVisualFigures(id).match(/inventados/g)||[]).length,1,id+' un solo aviso en las figuras');
  assert.ok(!/undefined|NaN/.test(page+practice),id+' sin valores rotos');
  assert.ok(visualColabNote(id).length>40&&practice.includes(visualColabNote(id).replace(/&/g,'&amp;')),id+' la nota de Colab está en la sección del cuaderno');
 }
});

test('las figuras muestran las cifras del cálculo actual',()=>{
 assert.match(drawVisualFigure('memory',{keep:50,day:4}).replace(DELIVERIES.join(),''),/memoria vale <b>[\d,]+<\/b>/);
 assert.match(drawVisualFigure('gates',{forget:100,input:0,output:100}),/= <b>0,80<\/b>/);
 assert.match(drawVisualFigure('attention',{rain:false,market:false}),/todos pesan 25 %/);
 assert.match(drawVisualFigure('order',{position:false}),/idénticos/);assert.match(drawVisualFigure('order',{position:true}),/distintos/);
 assert.match(drawVisualFigure('detector',{conf:25,nms:true}),/<b>8<\/b><span>tras quitar repetidas/);
 assert.match(drawVisualFigure('iou',{dx:10,dy:0}),/1\.200 ÷ 2\.000 = <b>0,60<\/b>/);assert.match(drawVisualFigure('iou',{dx:30,dy:0}),/FP \+ FN/);
 assert.match(drawVisualFigure('pr',{conf:50}),/<b>4<\/b> TP[\s\S]*<b>1<\/b> FP[\s\S]*<b>1<\/b> FN/);
 assert.match(drawVisualFigure('review',{cut:50,price:8,truth:true}),/<b>12<\/b> puntos/);
 assert.match(drawVisualFigure('review',{cut:50,price:8,truth:false}),/defectos aceptados: <b>\?<\/b>/);
});

test('los controles redibujan solo el resultado y conservan sus nodos',()=>{
 const listeners={},out={innerHTML:'',addEventListener(){},querySelector:()=>null};
 const control={dataset:{vxControl:'conf'},type:'range',value:'25',closest:()=>control};
 const output={dataset:{vxValue:'conf'},textContent:''};
 const fig={dataset:{vxFig:'detector'},isConnected:true,addEventListener:(t,f)=>listeners[t]=f,
  querySelector:s=>s==='[data-vx-out]'?out:null,
  querySelectorAll:s=>s==='[data-vx-control]'?[control]:s==='[data-vx-value]'?[output]:[]};
 const root={querySelectorAll:()=>[fig]};
 mountVisualExplainers(root);const first=out.innerHTML;assert.match(first,/con confianza &gt; 0,25/);assert.equal(output.textContent,'0,25');
 control.value='60';listeners.input({target:control});
 assert.match(out.innerHTML,/con confianza &gt; 0,60/);assert.notEqual(out.innerHTML,first);assert.equal(control.value,60);
 mountVisualExplainers(root);assert.match(out.innerHTML,/0,60/,'montar dos veces no reinicia el estado');
});

test('los retos no están cumplidos al abrir y todos tienen solución con los controles disponibles',()=>{
 const solutions={memory:[{keep:90,day:12},{keep:10,day:12}],gates:[{forget:100,input:0,output:0},{forget:0,input:100}],attention:[{rain:true,market:true,temp:50},{rain:false,market:false}],order:[{position:true}],detector:[{conf:60,nms:true},{conf:30,nms:true}],iou:[{dx:1,dy:1},{dx:13,dy:0}],pr:[{conf:60},{conf:25}],review:[{cut:35,price:8},{cut:65,price:1}]};
 for(const [name,answers] of Object.entries(solutions)){
  const goals=visualGoals(name),start=visualFigureDefaults(name);assert.equal(goals.length,answers.length,name);
  goals.forEach((goal,i)=>{assert.equal(goal.test(start),false,name+' reto '+i+' no cumplido al abrir');assert.equal(goal.test({...start,...answers[i]}),true,name+' reto '+i+' alcanzable');});
 }
 // Ningún corte deja los cinco frutos sin falsas alarmas: el reto no lo pide y la lectura lo dice.
 for(let c=5;c<=95;c+=5){const e=evaluateScene(SCENE,c/100);assert.ok(!(e.tp===5&&e.fp===0),'corte '+c);}
 assert.match(renderVisualFigures('dl-yolo'),/Ningún corte deja los 5 frutos sin falsas alarmas/);
});

test('el ejercicio anterior queda como reto opcional donde la figura lo cubre; Transformer lo conserva abierto',()=>{
 for(const id of VISUAL_TOPICS){
  const page=renderPracticalGuide(LESSONS.find(l=>l.id===id)),folded=page.includes('data-pw-challenge');
  assert.equal(folded,id!=='dl-transformers',id);
  if(folded){const open=page.indexOf('data-pw-challenge'),bench=page.search(/data-p3-topic=|data-p4-workbench=/),close=page.indexOf('</details>',bench);assert.ok(open<bench&&close>bench,id+' ejercicio dentro del reto opcional');assert.doesNotMatch(page.slice(page.lastIndexOf('<details',open),open),/\bopen\b/,id+' plegado');}
  assert.match(page,/<details class="dl-reference pw-industry">/,id+' industria plegada');
 }
});

test('cada encuentro tiene glosario completo, cierre con repaso y bibliografía con enlaces a fuentes primarias',()=>{
 for(const [first,last] of [['dl-secuencias','dl-transformers'],['dl-yolo','dl-integracion']]){
  const glossary=encounterGlossary(first),terms=glossary.map(g=>g.term);
  assert.ok(glossary.length>=20,first+' glosario amplio');assert.equal(new Set(terms).size,terms.length,'sin términos repetidos');
  assert.deepEqual(terms,[...terms].sort((a,b)=>a.localeCompare(b,'es')),'orden alfabético');
  for(const g of glossary)assert.ok(g.meaning.length>30&&g.topic,g.term);
  assert.equal(renderEncounterClosing(first),'');
  const closing=renderEncounterClosing(last);
  assert.equal((closing.match(/class="vx-flip /g)||[]).length,6);assert.match(closing,/Sin nota/);
  for(const term of terms)assert.ok(closing.includes(term.replace(/&/g,'&amp;')),'cierre incluye '+term);
  const refs=encounterReferences(first);assert.ok(refs.length>=4);assert.equal(new Set(refs.map(r=>r[1])).size,refs.length,'sin fuentes repetidas');
  assert.ok(renderPracticalPractice(LESSONS.find(l=>l.id===last)).includes('data-vx-closing='),'cierre en el tercer tema');
  assert.ok(!renderPracticalPractice(LESSONS.find(l=>l.id===first)).includes('data-vx-closing='));
 }
 for(const id of VISUAL_TOPICS){
  const refs=topicReferences(id),lesson=LESSONS.find(l=>l.id===id),guide=renderPracticalGuide(lesson),page=guide+renderPracticalPractice(lesson);assert.ok(refs.length>=2,id+' al menos dos fuentes');
  for(const [cite,url,why] of refs){assert.match(url,/^https:\/\/(doi\.org|arxiv\.org|docs\.pytorch\.org|docs\.ultralytics\.com|scikit-learn\.org|mlanthology\.org|d2l\.ai|www\.deeplearningbook\.org|openaccess\.thecvf\.com)\//,url);assert.ok(cite.length>20&&why.length>20);assert.ok(page.includes(url),id+' enlaza '+url);}
  assert.match(guide,/data-vx-glossary=/,id+' glosario disponible en el tema');
  assert.match(LESSONS.find(l=>l.id===id).title,/^(RNN y LSTM|Atención|Transformer|YOLO|IoU, precisión y recall|Integración): /,id+' el título nombra el concepto');
 }
});
