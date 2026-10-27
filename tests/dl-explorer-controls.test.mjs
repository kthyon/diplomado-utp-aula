import test from 'node:test';
import assert from 'node:assert/strict';
import {mountDLExplorer} from '../docs/dl-explorers.js';

// Exercise the real event handlers while retaining control identities, as the browser does.
class Control extends EventTarget {
 constructor(value, attrs={}) { super();this.value=String(value);this.dataset={field:attrs['data-field'],unit:attrs['data-unit']||''};this.type=attrs.type;this.attrs=attrs; }
 setAttribute(key,value){this.attrs[key]=String(value);}
}
const attributes=html=>Object.fromEntries([...html.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
function explorer(type){
 const controls=new Map(),outputs=new Map(),visual={innerHTML:''},status={textContent:''},reset={},step={};let mounts=0,renders=0,visualHTML='';
 Object.defineProperty(visual,'innerHTML',{get:()=>visualHTML,set:html=>{visualHTML=html;renders++;}});
 const el={set innerHTML(html){
  mounts++;
  for(const match of html.matchAll(/<input\b[^>]+>/g)){const attrs=attributes(match[0]);controls.set(attrs['data-field'],new Control(attrs.value,attrs));}
  for(const match of html.matchAll(/<select\b([^>]+)>([\s\S]*?)<\/select>/g)){
   const attrs=attributes(match[1]),options=[...match[2].matchAll(/<option\b([^>]+)>/g)];
   const chosen=options.find(option=>/\bselected\b/.test(option[1]))||options[0];controls.set(attrs['data-field'],new Control(attributes(chosen[1]).value,attrs));
  }
  for(const input of controls.values())if(input.type==='range')outputs.set(input.dataset.field,{textContent:''});
 },querySelector(selector){
  if(selector==='[data-visual]')return visual;if(selector==='[data-status]')return status;
  if(selector==='[data-reset]')return reset;if(selector==='[data-step]')return step;
  const key=selector.match(/\[data-(field|output)="([^"]+)"\]/);if(key)return(key[1]==='field'?controls:outputs).get(key[2]);
  throw new Error('Unexpected selector '+selector);
 },querySelectorAll(selector){
  if(selector==='[data-field]')return [...controls.values()];
  if(selector==='input[type="range"][data-field]')return [...controls.values()].filter(input=>input.type==='range');
  throw new Error('Unexpected selector '+selector);
 }};
 mountDLExplorer(el,type);
 return {controls,outputs,visual,status,reset,step,get mounts(){return mounts;},get renders(){return renders;},
  set(key,value,event='input'){const input=controls.get(key);input.value=String(value);input.dispatchEvent(new Event(event));},
  event(key,event){controls.get(key).dispatchEvent(new Event(event));}};
}

test('los cinco controles de neurona actualizan el cálculo y conservan sus nodos al restablecer',()=>{
 const e=explorer('neuron'),references=[...e.controls.values()];
 assert.match(e.status.textContent,/La suma es 0,5/);
 for(const [key,value,result] of [['x1',4,'1,5'],['x2',4,'-1,5'],['w1',2,'4,5'],['w2',2,'16,5'],['bias',2,'18']]){
  e.set(key,value);assert.ok(e.status.textContent.includes('La suma es '+result),key+' actualiza la suma');assert.equal(e.outputs.get(key).textContent,String(value));
 }
 assert.match(e.visual.innerHTML,/Salida ReLU[\s\S]*>18</);
 e.reset.onclick();assert.match(e.status.textContent,/La suma es 0,5/);
 e.set('bias',-2,'change');assert.match(e.status.textContent,/La suma es -2/);assert.match(e.status.textContent,/ReLU devuelve cero/);
 e.set('x1',4);e.reset.onclick();const before=e.renders;e.set('x1',4);assert.equal(e.renders,before+1,'volver al valor usado antes del reset redibuja');
 assert.equal(e.mounts,1);assert.deepEqual([...e.controls.values()],references);
});

test('cada ventana y filtro actualiza la celda seleccionada y mantiene las tablas completas consultables',()=>{
 const e=explorer('convolution');
 for(const filter of ['horizontal','average'])for(let row=1;row<=3;row++)for(let column=1;column<=3;column++){
  e.set('filter',filter,'change');e.set('row',row);e.set('column',column);
  const value=filter==='horizontal'?(row===3?'0':'3'):['0,3333','0,6667','1'][row-1];
  assert.ok(e.status.textContent.includes(`fila ${row}, columna ${column}`));
  assert.ok(e.status.textContent.endsWith(`es ${value}.`));
  assert.ok(e.visual.innerHTML.includes(`celda marcada (${row}, ${column})`));
  assert.equal((e.visual.innerHTML.match(/role="region"/g)||[]).length,4,'las cuatro matrices conservan un desplazamiento local con nombre');
  assert.equal((e.visual.innerHTML.match(/<caption>/g)||[]).length,4);
 }
 assert.equal(e.mounts,1);
});

test('invertir una secuencia mediante change reinicia pasos, barras y estado sin perder el control',()=>{
 const e=explorer('sequence'),order=e.controls.get('order');
 for(let i=0;i<3;i++)e.step.onclick();
 assert.match(e.status.textContent,/estado nuevo 21,25/);assert.equal(e.step.disabled,true);assert.match(e.visual.innerHTML,/s3/);
 e.set('order','descending','change');assert.match(e.status.textContent,/reiniciado a cero/);assert.equal(e.step.disabled,false);assert.doesNotMatch(e.visual.innerHTML,/<span>s3<\/span>/);
 for(let i=0;i<3;i++)e.step.onclick();assert.match(e.status.textContent,/estado nuevo 13,75/);
 e.reset.onclick();assert.equal(e.controls.get('order'),order);assert.equal(order.value,'descending');assert.match(e.status.textContent,/reiniciado a cero/);assert.equal(e.mounts,1);
});

test('la consulta actualiza el reparto gráfico y la salida, sin doble redibujado por input seguido de change',()=>{
 const e=explorer('attention');
 e.set('query','neutral','change');assert.match(e.status.textContent,/Peso de A 0,5, peso de B 0,5/);assert.match(e.status.textContent,/Salida combinada 15/);
 assert.equal((e.visual.innerHTML.match(/width:50%/g)||[]).length,2);
 const before=e.renders;e.set('query','second');e.event('query','change');assert.equal(e.renders,before+1);
 assert.match(e.status.textContent,/Salida combinada 16,6976/);
 const weights=[...e.visual.innerHTML.matchAll(/style="width:([\d.]+)%"/g)].map(match=>Number(match[1]));
 assert.equal(weights.length,2);assert.ok(weights[1]>weights[0]);assert.ok(Math.abs(weights[0]+weights[1]-100)<1e-9);
 e.reset.onclick();assert.match(e.status.textContent,/Salida combinada 13,3024/);assert.equal(e.mounts,1);
});

test('puntuación, coincidencia y leyenda de detección responden a sus límites de forma coherente',()=>{
 const e=explorer('detection');
 e.set('threshold',.8);assert.match(e.status.textContent,/Una fila conservada/);assert.doesNotMatch(e.visual.innerHTML,/class="dl-predicted-key dl-discarded-key"/);
 e.set('threshold',.85,'change');assert.match(e.status.textContent,/Ninguna fila conservada/);assert.match(e.status.textContent,/TP 0, FP 0, FN 1/);assert.match(e.visual.innerHTML,/class="dl-predicted-key dl-discarded-key"/);
 e.set('threshold',.5);e.set('offset',40);assert.match(e.status.textContent,/IoU 0\. TP 0, FP 1, FN 1/);
 e.set('offset',0);e.set('iou',.9);assert.match(e.status.textContent,/IoU 1\. TP 1, FP 0, FN 0/);
 e.reset.onclick();assert.match(e.status.textContent,/IoU 0,6\. TP 1, FP 0, FN 0/);assert.equal(e.outputs.get('offset').textContent,'10 px');assert.equal(e.mounts,1);
});
