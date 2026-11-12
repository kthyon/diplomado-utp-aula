import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS} from '../docs/content.js';
import {isEncounterThree,renderEncounterThreeGuide,mountEncounterThree} from '../docs/dl-encounter-three.js';

const render=id=>renderEncounterThreeGuide(LESSONS.find(lesson=>lesson.id===id)||{id});
const number=text=>Number(text.replaceAll('.','').replace(',','.'));

// A small DOM boundary, not a replacement implementation of the calculations.
// Controls come from the real renderer. Any attempt to rebuild their container
// throws; only the figure and text slots may be repainted.
function fixture(id){
 const html=render(id),section=html.match(/<section id="ejemplo-del-tema"[\s\S]*?<\/section>/)?.[0];
 assert.ok(section,'el renderer crea su ejemplo principal');
 const attrs=text=>Object.fromEntries([...text.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(m=>[m[1],m[2]??'']));
 const node=attributes=>({
  attributes,dataset:Object.fromEntries(Object.entries(attributes).filter(([name])=>name.startsWith('data-')).map(([name,value])=>[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),value])),
  disabled:false,events:new Map(),innerHTML:'',textContent:'',value:'',
  setAttribute(name,value){this.attributes[name]=value;},
  hasAttribute(name){return Object.hasOwn(this.attributes,name);},
  addEventListener(name,handler){const list=this.events.get(name)||[];list.push(handler);this.events.set(name,list);},
  closest(selector){assert.equal(selector,'button');return this;}
 });
 const controls=[...section.matchAll(/<button\b([^>]*)>/g)].map(m=>node(attrs(m[1])));
 const slots=Object.fromEntries(['data-e3-figure','data-e3-result','data-e3-detail'].map(key=>[key,node({[key]:''})]));
 const focus=section.includes('<select data-e3-focus>')?node({'data-e3-focus':''}):null;
 if(focus){const select=section.match(/<select data-e3-focus>([\s\S]*?)<\/select>/)[1];focus.value=select.match(/<option value="(\d+)" selected>/)[1];}
 const el=node({'data-e3-topic':id});
 Object.defineProperty(el,'innerHTML',{set(){assert.fail('repintar no debe reconstruir controles');}});
 el.querySelector=selector=>{const attr=selector.slice(1,-1);return slots[attr]||(attr==='data-e3-focus'?focus:controls.find(n=>n.hasAttribute(attr)))||null;};
 el.querySelectorAll=selector=>controls.filter(n=>n.hasAttribute(selector.slice(1,-1)));
 el.contains=target=>controls.includes(target)||target===focus;
 const root={querySelectorAll(selector){assert.equal(selector,'[data-e3-topic]');return [el];}};
 mountEncounterThree(root);
 function click(attribute,value){const button=controls.find(n=>n.hasAttribute(attribute)&&(value===undefined||n.attributes[attribute]===value));assert.ok(button,'control real '+attribute);assert.equal(button.disabled,false,'el control está disponible');for(const listener of el.events.get('click')||[])listener({target:button});return button;}
 return {html,section,controls,slots,el,root,focus,click,
  result:()=>slots['data-e3-result'].textContent,
  figure:()=>slots['data-e3-figure'].innerHTML,
  detail:()=>slots['data-e3-detail'].textContent,
  chooseFocus(value){assert.ok(focus);focus.value=String(value);for(const listener of focus.events.get('change')||[])listener();}
 };
}

test('el diario y el paso leído sobreviven al navegar entre los tres temas',()=>{
 const memory=fixture('dl-secuencias');memory.click('data-e3-preset','down');memory.click('data-e3-read');memory.click('data-e3-read');
 assert.match(memory.result(),/Día 2: 0,5 × 20 \+ 0,5 × 30 = 25/);
 const attention=fixture('dl-atencion');
 assert.equal(attention.controls.find(n=>n.attributes['data-e3-preset']==='down').attributes['aria-pressed'],'true');
 assert.match(attention.figure(),/Día 1: 40 cajas/);assert.match(attention.figure(),/Día 4: 10 cajas/);
 const transformer=fixture('dl-transformers');
 assert.equal(transformer.controls.find(n=>n.attributes['data-e3-preset']==='down').attributes['aria-pressed'],'true');
 assert.match(transformer.figure(),/>40 cajas<\/text>/);assert.match(transformer.figure(),/>10 cajas<\/text>/);
 const returned=fixture('dl-secuencias');assert.match(returned.result(),/Día 2: 0,5 × 20 \+ 0,5 × 30 = 25/);
});

test('los cuatro pasos calculan 30,625 y al invertir 16,25; reiniciar conserva el diario',()=>{
 const memory=fixture('dl-secuencias');memory.click('data-e3-preset','up');
 for(const expected of ['5','12,5','21,25','30,625']){memory.click('data-e3-read');assert.ok(memory.result().includes('= '+expected+'.'),memory.result());}
 assert.equal(memory.controls.find(n=>n.hasAttribute('data-e3-read')).disabled,true);
 memory.click('data-e3-reset');assert.match(memory.result(),/Estado inicial: 0/);
 memory.click('data-e3-preset','down');for(let i=0;i<4;i++)memory.click('data-e3-read');
 assert.match(memory.result(),/= 16,25\./);assert.match(memory.result(),/no lo que llegará mañana/);
});

test('la atención uniforme da 25 y las afinidades normalizadas producen aportes coherentes',()=>{
 const attention=fixture('dl-atencion');attention.click('data-e3-preset','up');attention.click('data-e3-mode','equal');attention.chooseFocus(3);
 assert.match(attention.result(),/≈ 25 cajas de contexto/);assert.match(attention.detail(),/Q es 0\./);
 assert.deepEqual([...attention.figure().matchAll(/>([\d,]+) %<\/text>/g)].map(m=>number(m[1])),[25,25,25,25]);
 attention.click('data-e3-mode','affinity');
 const weights=[...attention.figure().matchAll(/>([\d,]+) %<\/text>/g)].map(m=>number(m[1]));
 assert.equal(weights.length,4);assert.ok(Math.abs(weights.reduce((a,b)=>a+b,0)-100)<=.2,'los porcentajes redondeados suman aproximadamente 100');
 assert.ok(weights.every(w=>w>=0));assert.ok(weights[3]>weights[0]);
 assert.match(attention.detail(),/Puntuaciones Q×K = \[−?[-]?2,25; −?[-]?0,75; 0,75; 2,25\]/);
 assert.match(attention.result(),/≈ 37,23 cajas de contexto/);
 attention.chooseFocus(0);assert.match(attention.result(),/≈ 12,77 cajas de contexto/);
});

test('repintar no reconstruye controles ni duplica el SVG o los listeners',()=>{
 const attention=fixture('dl-atencion'),original=[...attention.controls],focus=attention.focus;
 mountEncounterThree(attention.root);
 assert.equal(attention.el.events.get('click').length,1);assert.equal(focus.events.get('change').length,1);
 attention.click('data-e3-preset','mixed');attention.click('data-e3-mode','affinity');attention.chooseFocus(2);
 assert.deepEqual(attention.controls,original);assert.equal(attention.focus,focus);
 assert.equal((attention.figure().match(/<svg\b/g)||[]).length,1);
 assert.equal((attention.figure().match(/data-dl-diagram=/g)||[]).length,1);
 assert.equal(focus.value,'2');assert.match(attention.figure(),/Consulta: día 3/);
});

test('el nuevo recorrido no invade otros temas ni duplica su figura principal',()=>{
 for(const id of ['dl-vision','dl-transferencia','ml-regresion','desconocido']){assert.equal(isEncounterThree(id),false);assert.equal(render(id),'');}
 for(const id of ['dl-secuencias','dl-atencion','dl-transformers']){
  const html=render(id);assert.equal(isEncounterThree(id),true);
  assert.equal((html.match(/data-dl-primary-example=/g)||[]).length,1);assert.equal((html.match(/data-dl-diagram=/g)||[]).length,1);
  assert.equal((html.replace(/<svg class="nf-svg tf-svg"[\s\S]*?<\/svg>/,'').match(/<svg\b/g)||[]).length,1,'un solo gráfico principal; la arquitectura animada de la galería es apoyo');assert.match(html,/¿el último día llegaron menos cajas que el primero\?/);
 }
});
