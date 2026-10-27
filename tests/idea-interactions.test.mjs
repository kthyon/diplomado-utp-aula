import test from 'node:test';
import assert from 'node:assert/strict';
import {mountIdeaStudio,renderIdeaPlot,ideaTeaching} from '../docs/idea-studio.js';
import {TOPICS,initialIdea,stepIdea,ideaResult,nextIdeaAdjustment} from '../docs/idea-models.js';

// A small DOM surface exercises the real delegated handlers and renderer, without
// browser or package dependencies. It deliberately has no layout implementation.
class Node {
 constructor(root,tag='div',attributes={},parent=null){this.root=root||this;this.tagName=tag.toUpperCase();this.attributes={...attributes};this.parentElement=parent;this.children=[];this.listeners={};this.value=attributes.value||'';this.step=attributes.step||'';this.hidden=Object.hasOwn(attributes,'hidden');this.open=false;this._html='';this._text=null;}
 get dataset(){return Object.fromEntries(Object.entries(this.attributes).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]));}
 get classList(){return {contains:name=>(this.attributes.class||'').split(/\s+/).includes(name),toggle:(name,force)=>{const names=new Set((this.attributes.class||'').split(/\s+/).filter(Boolean)),on=force??!names.has(name);if(on)names.add(name);else names.delete(name);this.attributes.class=[...names].join(' ');return on;}};}
 set innerHTML(value){this._html=value;this._text=null;this.children=[];const stack=[this],voidTags=new Set(['INPUT','IMG','BR','HR','META','LINK']);for(const token of value.matchAll(/<\/?[A-Za-z][^>]*>/g)){const raw=token[0],closing=raw.startsWith('</'),tag=raw.match(/^<\/?([^\s/>]+)/)[1].toUpperCase();if(closing){for(let i=stack.length-1;i>0;i--)if(stack[i].tagName===tag){stack[i]._html=value.slice(stack[i]._start,token.index);stack.length=i;break;}continue;}const attributes={};const content=raw.replace(/^<[^\s/>]+/,'').replace(/\/?\s*>$/,'');for(const a of content.matchAll(/([^\s=]+)(?:="([^"]*)")?/g))attributes[a[1]]=a[2]??'';const parent=stack.at(-1),node=new Node(this.root,tag,attributes,parent);node._start=token.index+raw.length;parent.children.push(node);if(!voidTags.has(tag)&&!raw.endsWith('/>'))stack.push(node);}}
 get innerHTML(){return this._html;}
 set textContent(value){this._text=String(value);}
 get textContent(){return this._text??this._html.replace(/<[^>]*>/g,'');}
 hasAttribute(name){return Object.hasOwn(this.attributes,name);}
 setAttribute(name,value){this.attributes[name]=String(value);}
 removeAttribute(name){delete this.attributes[name];}
 addEventListener(name,callback){(this.listeners[name]??=[]).push(callback);}
 emit(name,target=this){for(const callback of this.listeners[name]||[])callback({target,preventDefault(){}});}
 focus(options){this.root.focused=this;this.root.focusOptions=options;}
 matches(selector){return selector.split(/,(?![^[]*\])/).some(part=>{const pieces=part.trim().split(/\s+(?![^[]*\])/),last=pieces.pop();if(!this.atom(last))return false;let parent=this.parentElement;while(pieces.length){const expected=pieces.pop();while(parent&&!parent.atom(expected))parent=parent.parentElement;if(!parent)return false;parent=parent.parentElement;}return true;});}
 atom(selector){const tag=selector.match(/^[A-Za-z][\w-]*/)?.[0];if(tag&&tag.toUpperCase()!==this.tagName)return false;const id=selector.match(/#([\w-]+)/)?.[1];if(id&&this.attributes.id!==id)return false;for(const match of selector.matchAll(/\.([\w-]+)/g))if(!this.classList.contains(match[1]))return false;for(const match of selector.matchAll(/\[([^\]=]+)(?:=(?:"([^"]*)"|([^\]]*)))?\]/g)){if(!this.hasAttribute(match[1]))return false;const value=match[2]??match[3];if(value!==undefined&&this.attributes[match[1]]!==value)return false;}return true;}
 closest(selector){let node=this;while(node){if(node.matches(selector))return node;node=node.parentElement;}return null;}
 querySelectorAll(selector){const matches=[];const walk=node=>{for(const child of node.children){if(child.matches(selector))matches.push(child);walk(child);}};walk(this);return matches;}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
function setup(id){
 const previous=Object.getOwnPropertyDescriptor(globalThis,'document'),body=new Node();
 Object.defineProperty(globalThis,'document',{value:{hidden:true,body},configurable:true});
 const root=new Node();mountIdeaStudio(root,id);
 return {root,body,finish(){if(previous)Object.defineProperty(globalThis,'document',previous);else delete globalThis.document;}};
}
const click=(root,selector)=>{const button=root.querySelector(selector);assert.ok(button,selector);root.emit('click',button);return button;};
const change=(root,key,value,event='input')=>{const input=root.querySelector('[data-control="'+key+'"]');assert.ok(input,key);input.value=String(value);root.emit(event,input);return input;};

test('los ocho ejemplos responden a sus controles reales sin reemplazar el control activo',()=>{
 const changes={prediction:[['slope',.05],['bias',2]],alerts:[['threshold',1]],missing:[['rainA',900],['rainC',100],['rainD',100]],signal:[['signal',4],['function','tanh']],adjustment:[['rate',1.1]],vision:[['task','detection']],neighbors:[['km',50],['kg',5500],['k',5],['scaled','yes']],convolution:[['filter','average']]};
 for(const topic of TOPICS){const env=setup(topic.id);try{
  const {root}=env,original=root.querySelectorAll('[data-control]'),initial=root.querySelector('[data-graph]').innerHTML;
  for(const [key,value] of changes[topic.id])change(root,key,value,key==='filter'||key==='task'||key==='function'||key==='scaled'||key==='k'?'change':'input');
  assert.deepEqual(root.querySelectorAll('[data-control]'),original,topic.id+' conserva los controles y su foco');
  assert.notEqual(root.querySelector('[data-graph]').innerHTML,initial,topic.id+' actualiza el gráfico');
  assert.doesNotMatch(root.querySelector('[data-teaching]').innerHTML,/NaN|undefined|Infinity/,topic.id+' explicación finita');
  assert.ok(root.querySelectorAll('[data-case]').every(n=>n.attributes['aria-pressed']==='false'),topic.id+' deja de atribuir valores propios al caso fijo');
 }finally{env.finish();}}
});

test('reiniciar limpia la comparación guardada y mantiene coherente la vista de proyección',()=>{
 const env=setup('prediction');try{const {root,body}=env;
  click(root,'[data-save]');assert.equal(root.querySelector('[data-comparison]').hidden,false);
  change(root,'bias',2);click(root,'[data-project]');assert.equal(body.classList.contains('projecting'),true);
  click(root,'[data-reset]');
  assert.equal(root.querySelector('[data-comparison]').hidden,true);
  assert.equal(root.querySelector('[data-save]').textContent,'Fijar para comparar');
  assert.match(root.querySelector('[data-project]').textContent,/Salir de proyección/);
  assert.equal(root.querySelector('[data-project]').attributes['aria-pressed'],'true');
  assert.equal(root.querySelector('[data-control="bias"]').value,1);
 }finally{env.finish();}
});

test('editar un píxel invalida el caso fijo y seleccionar una fila no salta del cuadro de datos al dibujo',()=>{
 const env=setup('convolution');try{const {root}=env;
  click(root,'[data-case="1"]');const uniform=root.querySelector('[data-graph]').innerHTML;
  click(root,'[data-pixel="2,2"]');
  assert.notEqual(root.querySelector('[data-graph]').innerHTML,uniform);
  assert.ok(root.querySelectorAll('[data-case]').every(n=>n.attributes['aria-pressed']==='false'));
  assert.match(root.querySelector('[data-task]').textContent,/imagen cambió/);
  assert.deepEqual(root.focusOptions,{preventScroll:true});
 }finally{env.finish();}
 const prediction=setup('prediction');try{const {root}=prediction,table=root.querySelector('[data-table]');
  const target=table.querySelector('[data-pick="3"]');assert.ok(target);root.emit('click',target);
  assert.equal(root.focused.closest('[data-table]'),table);
  assert.deepEqual(root.focusOptions,{preventScroll:true});
  assert.match(root.querySelector('[data-insight]').textContent,/D:/);
 }finally{prediction.finish();}
});

test('ampliar usa las regiones locales de los gráficos principal, secundario y comparación sin reconstruir controles',()=>{
 const env=setup('adjustment');try{const {root}=env,rate=root.querySelector('[data-control="rate"]');
  click(root,'[data-save]');
  assert.equal(root.querySelector('[data-graph]').attributes.tabindex,'0');
  assert.equal(root.querySelector('[data-extra]').attributes.tabindex,'0');
  assert.equal(root.querySelector('[data-comparison]').querySelectorAll('.idea-chart-scroll').length,2);
  const graph=root.querySelector('[data-graph]');click(root,'[data-chart-zoom]');
  assert.equal(root.querySelector('.idea-studio').classList.contains('charts-enlarged'),true);
  assert.equal(root.querySelector('[data-graph]'),graph);
  assert.equal(root.querySelector('[data-control="rate"]'),rate);
  click(root,'[data-chart-zoom]');assert.equal(root.querySelector('.idea-studio').classList.contains('charts-enlarged'),false);
 }finally{env.finish();}
});

test('la vista previa de tasa coincide con el paso que se aplicará y no altera ningún estado aprendido',()=>{
 for(const rate of [.05,.1,.5,1,1.1])for(const steps of [0,1,5,14,15]){
  const p=stepIdea({...initialIdea('adjustment'),rate},steps),snapshot=structuredClone(p),r=ideaResult('adjustment',p);
  assert.deepEqual(p,snapshot);assert.deepEqual(r.next,nextIdeaAdjustment(p));
  const plot=renderIdeaPlot('adjustment',p),teaching=ideaTeaching('adjustment',p,p.states.length-1);
  assert.doesNotMatch(plot+teaching,/NaN|undefined|Infinity/);
  if(steps===15){assert.equal(r.next,null);assert.doesNotMatch(plot,/class="idea-next-step"/);continue;}
  const applied=stepIdea(p);assert.equal(r.next.theta,applied.theta);assert.equal(r.next.loss,applied.history.at(-1));
  assert.equal(r.next.step,applied.states.length-1);assert.match(teaching,/aún sin aplicar/);
  const circle=plot.match(/class="idea-next-step"[^>]*><circle cx="([^"]+)" cy="([^"]+)"/);assert.ok(circle);
  assert.ok(Number(circle[1])>=78&&Number(circle[1])<=678);assert.ok(Number(circle[2])>=50&&Number(circle[2])<=285);
 }
 const p=stepIdea(initialIdea('adjustment'),3),before=structuredClone(p);const a=ideaResult('adjustment',p),b=ideaResult('adjustment',{...p,rate:1.1});
 assert.notEqual(a.next.theta,b.next.theta);assert.deepEqual(p,before);
});

test('la estimación rayada conserva referencias únicas entre gráfico actual y escenarios A/B',()=>{
 const state=initialIdea('missing');const plots=['main','saved','current'].map(id=>renderIdeaPlot('missing',state,0,undefined,id));
 const ids=plots.flatMap(plot=>[...plot.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 assert.equal(new Set(ids).size,ids.length);
 plots.forEach((plot,index)=>assert.ok(plot.includes('url(#'+ids[index]+')')));
});

test('los vecinos sin escala se dibujan en el orden numérico real que decide sus votos',()=>{
 for(const km of [20,43,50])for(const kg of [2500,4200,5500])for(const k of [1,3,5]){
  const p={km,kg,k,scaled:'no'},r=ideaResult('neighbors',p),plot=renderIdeaPlot('neighbors',p);
  const entries=[...plot.matchAll(/aria-label="Envío ([A-F]): distancia numérica ([^"]+)"/g)];
  assert.deepEqual(entries.map(m=>m[1]),r.ranked.map(v=>v.id));
  assert.equal(entries.filter(m=>m[2].includes('; participa en')).length,k);
  assert.match(plot,/Barras|ordenados por la distancia numérica/);
 }
});

test('el plano estandarizado incluye consulta y datos con el mismo factor de píxeles en ambos ejes',()=>{
 for(const [km,kg] of [[20,2500],[50,5500],[43,4200],[100,15000]]){
  const p={km,kg,k:3,scaled:'yes'},r=ideaResult('neighbors',p),plot=renderIdeaPlot('neighbors',p);
  const query=plot.match(/<path d="M([\d.e+-]+) ([\d.e+-]+)l11 11-11 11-11-11z"/);assert.ok(query);
  assert.ok(Number(query[1])>=150&&Number(query[1])<=550);assert.ok(Number(query[2])+11>=50&&Number(query[2])+11<=450);
  const groups=[...plot.matchAll(/<g role="button"[^>]*>[\s\S]*?<circle cx="([^"]+)" cy="([^"]+)"/g)];assert.equal(groups.length,6);
  const pxPerX=(Number(groups[0][1])-Number(groups[1][1]))/(r.ranked[0].xy[0]-r.ranked[1].xy[0]);
  const pxPerY=(Number(groups[0][2])-Number(groups[1][2]))/(r.ranked[0].xy[1]-r.ranked[1].xy[1]);
  assert.ok(Math.abs(Math.abs(pxPerX)-Math.abs(pxPerY))<1e-9);
 }
});
