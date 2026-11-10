import test from 'node:test';
import assert from 'node:assert/strict';
import {PRACTICAL_E3,renderE3Workbench,mountE3Workbench,memoryCalculation,memoryTrace,attentionCalculation,transformerScenario,choiceFeedback} from '../docs/practical-e3.js';

function fixture(id){
 const html=renderE3Workbench(id),attributes=s=>Object.fromEntries([...s.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(m=>[m[1],m[2]??'']));
 const node=attrs=>({attributes:attrs,dataset:Object.fromEntries(Object.entries(attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v])),disabled:Object.hasOwn(attrs,'disabled'),events:new Map(),innerHTML:'',textContent:'',setAttribute(k,v){this.attributes[k]=v;},hasAttribute(k){return Object.hasOwn(this.attributes,k);},closest(selector){assert.equal(selector,'button');return this;},addEventListener(event,fn){const handlers=this.events.get(event)||[];handlers.push(fn);this.events.set(event,handlers);}});
 const controls=[...html.matchAll(/<button\b([^>]*)>/g)].map(m=>node(attributes(m[1])));
 const slots=Object.fromEntries(['diagram','question','feedback','result','equations'].map(k=>['data-p3-'+k,node({})]));
 const el=node({'data-p3-topic':id});
 Object.defineProperty(el,'innerHTML',{set(){assert.fail('No reconstruir el workbench ni sus controles');}});
 el.querySelector=selector=>{const key=selector.slice(1,-1);return slots[key]||controls.find(c=>c.hasAttribute(key))||null;};
 el.querySelectorAll=selector=>controls.filter(c=>c.hasAttribute(selector.slice(1,-1)));
 el.contains=target=>controls.includes(target);
 const root={querySelectorAll(selector){assert.equal(selector,'[data-p3-topic]');return [el];}};
 mountE3Workbench(root);
 const button=(name,value)=>controls.find(c=>c.hasAttribute('data-p3-'+name)&&(value===undefined||c.attributes['data-p3-'+name]===String(value)));
 const click=(name,value)=>{const b=button(name,value);assert.ok(b,'Existe el control '+name);assert.equal(b.disabled,false,'Está disponible '+name);for(const fn of el.events.get('click')||[])fn({target:b});return b;};
 return {html,root,el,controls,button,click,text:name=>slots['data-p3-'+name].textContent,markup:name=>slots['data-p3-'+name].innerHTML};
}
function finish(w,choice){w.click('choice',choice);w.click('reveal');while(!w.button('next').disabled)w.click('next');}

test('los tres temas declaran una tarea manipulable y no añaden secciones ni otro SVG',()=>{
 for(const id of ['dl-secuencias','dl-atencion','dl-transformers']){
  const p=PRACTICAL_E3[id],html=renderE3Workbench(id);
  for(const field of ['problem','goal','task','change','watch','expected','bridge','colabBridge','checkQuestion','checkAnswer'])assert.ok(p[field]?.length>25,id+' '+field);
  assert.equal((html.match(/data-dl-diagram=/g)||[]).length,1);assert.equal((html.match(/<svg\b/g)||[]).length,1);
  assert.doesNotMatch(html,/<section\b|id="(?:idea|ejemplo|practica|cuaderno)-del-tema"/);
  assert.match(html,/Antes de revelar/);assert.equal((html.match(/data-p3-case=/g)||[]).length,3);
 }
 assert.equal(renderE3Workbench('dl-yolo'),'');
});

test('la recurrencia separa ambas contribuciones y conserva el efecto del orden',()=>{
 assert.deepEqual(memoryCalculation(5,20),{previous:5,input:20,retained:2.5,incoming:10,next:12.5});
 assert.deepEqual(memoryTrace([10,20,30,40]).map(x=>x.next),[5,12.5,21.25,30.625]);
 assert.deepEqual(memoryTrace([40,30,20,10]).map(x=>x.next),[20,25,22.5,16.25]);
 assert.equal(memoryTrace([30,10,40,20]).at(-1).next,23.125);
 assert.throws(()=>memoryCalculation(Infinity,10));
});

test('memoria exige anticipar, da feedback real, revela tres cuentas y prepara otro día',()=>{
 const w=fixture('dl-secuencias');w.click('case','up');w.click('reset');
 assert.equal(w.button('reveal').disabled,true);assert.match(w.markup('equations'),/después de tu anticipación/);
 w.click('choice',0);assert.match(w.text('feedback'),/revisar tu anticipación/);
 w.click('choice',1);assert.match(w.text('feedback'),/coincide/);w.click('reveal');
 assert.match(w.markup('equations'),/1\. Conservar/);assert.match(w.markup('equations'),/2\. Incorporar/);assert.match(w.markup('equations'),/3\. Sumar/);
 assert.match(w.markup('equations'),/0,5 × 0 = 0/);assert.match(w.markup('equations'),/0,5 × 10 = 5/);assert.match(w.markup('equations'),/0 \+ 5 = 5/);
 w.click('next');assert.match(w.text('question'),/Día 2/);assert.equal(w.button('reveal').disabled,true);
 for(let day=1;day<4;day++){w.click('choice',1);w.click('reveal');if(day<3)w.click('next');}
 assert.match(w.text('result'),/30,625/);assert.equal(w.button('next').disabled,true);
 w.click('case','down');for(let day=0;day<4;day++){w.click('choice',1);w.click('reveal');if(day<3)w.click('next');}
 assert.match(w.text('result'),/16,25/);w.click('reset');assert.match(w.text('question'),/Día 1.*40 cajas/);assert.equal(w.button('reveal').disabled,true);
});

test('atención calcula escala, softmax estable, aportes y contexto en tres consultas',()=>{
 const a=attentionCalculation([1,0]),b=attentionCalculation([0,1]),equal=attentionCalculation([0,0]);
 assert.deepEqual(a.scores,[1,0]);assert.equal(a.dimension,2);assert.equal(a.scale,Math.sqrt(2));assert.equal(a.scaled[0],1/Math.sqrt(2));
 assert.deepEqual(equal.weights,[.5,.5]);assert.deepEqual(equal.contributions,[5,10]);assert.equal(equal.context,15);
 assert.ok(Math.abs(a.context-13.30238450673343)<1e-10);assert.ok(Math.abs(b.context-16.69761549326657)<1e-10);
 for(const r of [a,b,equal,attentionCalculation([10000,0])]){assert.ok(Math.abs(r.weights.reduce((x,y)=>x+y,0)-1)<1e-12);assert.ok(r.weights.every(Number.isFinite));assert.ok(r.context>=10&&r.context<=20);}
 assert.throws(()=>attentionCalculation([1]));
});

test('atención parte del historial y permite seguir reparto, aportes y suma antes del formalismo',()=>{
 const w=fixture('dl-atencion');w.click('case','a');w.click('reset');assert.equal(w.button('reveal').disabled,true);
 assert.match(w.html,/dos primeros registros del mismo historial de la cooperativa/);
 assert.match(w.html,/Consultar registro A · 10 cajas/);assert.match(w.html,/Consultar registro B · 20 cajas/);assert.match(w.html,/Consultar ambos por igual/);
 assert.doesNotMatch(w.markup('diagram')+w.text('question')+w.markup('equations'),/Consulta Q|clave K|Valor V|√|66,98|33,02/,'antes de anticipar no muestra formalismo ni reparto');
 assert.equal(w.button('previous').disabled,true);
 w.click('choice',1);assert.match(w.text('feedback'),/revisar/);w.click('choice',0);assert.match(w.text('feedback'),/coincide/);w.click('reveal');
 assert.match(w.text('result'),/Paso 1 de 3/);assert.match(w.markup('equations'),/1\. Leer el reparto/);
 assert.match(w.markup('diagram'),/66,98 %/);assert.match(w.markup('equations'),/33,02 % de participación/);
 assert.doesNotMatch(w.markup('equations'),/data-p3-formal|√|Q es/,'primero construye el reparto visible');
 w.click('next');assert.match(w.text('result'),/Paso 2 de 3/);assert.match(w.markup('equations'),/2\. Calcular cuánto aporta/);
 assert.match(w.markup('equations'),/0,66976 × 10 ≈ 6,6976 cajas/);assert.match(w.markup('equations'),/0,33024 × 20 ≈ 6,6048 cajas/);
 w.click('next');assert.match(w.text('result'),/Paso 3 de 3/);assert.match(w.text('result'),/13,3024 cajas/);assert.equal(w.button('next').disabled,true);
 const markup=w.markup('equations'),formal=markup.match(/<details class="dl-reference p3-attention-formal"([^>]*)>([\s\S]*?)<\/details>/);
 assert.ok(formal);assert.doesNotMatch(formal[1],/\bopen\b/,'formal completo cerrado inicialmente');
 assert.match(formal[2],/<h3>De dónde salen las participaciones: Q, K y softmax<\/h3>/);
 assert.match(formal[2],/Q es una lista de dos números/);assert.match(formal[2],/K son las claves/);assert.match(formal[2],/V son las cantidades/);
 const fragments=['Comparar Q','Escalar','Preparar la calculadora','Calcular exponenciales','Sumar las partes','Dividir cada parte','Calcular cada aporte','Sumar los aportes'];
 for(const fragment of fragments)assert.ok(formal[2].includes(fragment),fragment+' conservado');
 assert.equal((formal[2].match(/class="pw-step"/g)||[]).length,8);
 assert.match(formal[2],/d = 2; √d = √2/);assert.match(formal[2],/e es una constante/);assert.match(formal[2],/no son aquí parámetros aprendidos/);
 assert.match(markup,/10 \+ 20 = 30 cajas/,'el resumen se distingue del inventario');
 w.click('previous');assert.match(w.text('result'),/Paso 2 de 3/);assert.match(w.markup('equations'),/2\. Calcular cuánto aporta/);assert.doesNotMatch(w.markup('equations'),/data-p3-formal/);
 w.click('previous');assert.match(w.text('result'),/Paso 1 de 3/);assert.equal(w.button('previous').disabled,true);
 w.click('next');w.click('next');assert.match(w.text('result'),/13,3024 cajas/);
 w.click('case','b');finish(w,1);assert.match(w.text('result'),/16,6976 cajas/);
 assert.match(w.markup('diagram'),/66,98 %/);assert.equal(w.button('next').disabled,true);
 w.click('case','equal');finish(w,2);assert.match(w.text('result'),/15 cajas/);
 assert.match(w.markup('equations'),/5 \+ 10 ≈ 15 cajas/);assert.match(w.markup('diagram'),/50 %/);
 w.click('reset');assert.equal(w.button('reveal').disabled,true);assert.match(w.text('question'),/ambos registros por igual/);
 assert.doesNotMatch(w.markup('equations'),/data-p3-formal/);assert.equal(w.button('previous').disabled,true);
});

test('Transformer distingue referencia, argmax de puntuaciones dadas y un error deliberado',()=>{
 const a=transformerScenario('up'),b=transformerScenario('down'),c=transformerScenario('mixed');
 assert.deepEqual([a.reference,b.reference,c.reference],[0,1,1]);assert.deepEqual([a.prediction,b.prediction,c.prediction],[0,0,1]);assert.equal(b.correct,false);
 assert.deepEqual(transformerScenario('up',false).visible,transformerScenario('down',false).visible);
 const w=fixture('dl-transformers');w.click('case','down');w.click('reset');assert.equal(w.button('reveal').disabled,true);
 finish(w,1);assert.match(w.markup('equations'),/referencia 1/);assert.match(w.markup('equations'),/clase predicha 0/);assert.match(w.markup('equations'),/ERROR/);assert.match(w.markup('equations'),/No proceden de una red ejecutada/);
 w.click('case','mixed');finish(w,1);assert.match(w.text('result'),/coincide/);
 w.click('positions');assert.match(w.markup('diagram'),/sin fecha/);assert.equal(w.button('reveal').disabled,true);
 w.click('choice',2);assert.match(w.text('feedback'),/coincide.*Sin fechas/);w.click('reveal');while(!w.button('next').disabled)w.click('next');assert.match(w.markup('equations'),/evaluación pendiente/);
 w.click('reset');assert.match(w.markup('diagram'),/Día 1/);assert.equal(w.button('reveal').disabled,true);
});

test('controles, un solo diagrama y listeners se conservan al repintar y reiniciar',()=>{
 const w=fixture('dl-atencion'),original=[...w.controls];mountE3Workbench(w.root);assert.equal(w.el.events.get('click').length,1);
 w.click('case','b');w.click('choice',1);w.click('reveal');w.click('next');w.click('reset');
 assert.deepEqual(w.controls,original);assert.equal((w.markup('diagram').match(/<svg\b/g)||[]).length,1);assert.equal((w.markup('diagram').match(/data-dl-diagram=/g)||[]).length,1);
 assert.equal(choiceFeedback(1,1).correct,true);assert.equal(choiceFeedback(1,0).correct,false);
});
