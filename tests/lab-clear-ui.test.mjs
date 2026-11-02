import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as models from '../docs/lab-clear-models.js';
import * as teaching from '../docs/lab-explanations.js';
import {mountPlantNeuron} from '../docs/plant-neuron.js';
import {initialPlantNeuron,plantForward,plantUpdate} from '../docs/plant-neuron-model.js';

// A small DOM fixture runs the actual active page and its event handlers, without
// registration/network calls. Geometry is checked separately in a real browser.
function laboratory(hash='#red'){
 class Element{
  constructor(tag='div',attrs={}){this.tag=tag;this.attrs=attrs;this.children=[];this._html='';this._text='';}
  get dataset(){return Object.fromEntries(Object.entries(this.attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]));}
  get className(){return this.attrs.class||''}set className(v){this.attrs.class=v}
  get classList(){return {toggle:name=>{const all=new Set(this.className.split(/\s+/).filter(Boolean));const added=!all.has(name);if(added)all.add(name);else all.delete(name);this.className=[...all].join(' ');return added;}};}
  get innerHTML(){return this._html}set innerHTML(v){this._html=v;this.children=parse(v);}
  get textContent(){return this._text||this._html.replace(/<[^>]*>/g,'')}set textContent(v){this._text=String(v);}
  setAttribute(k,v){this.attrs[k]=String(v)}getAttribute(k){return this.attrs[k]??null}removeAttribute(k){delete this.attrs[k]}
  get options(){return descendants(this).filter(n=>n.tag==='option')}
  get type(){return this.attrs.type||''}
  get min(){return this.attrs.min||''}set min(v){this.attrs.min=String(v)}
  get max(){return this.attrs.max||''}set max(v){this.attrs.max=String(v)}
  get value(){return this._value??this.attrs.value??(this.tag==='select'?((this.options.find(o=>'selected'in o.attrs)||this.options[0])?.value??''):'')}
  set value(v){this._value=String(v)}
  append(n){this.children.push(n)}focus(){this.focused=true}scrollIntoView(){this.scrolled=true}
 }
 function parse(html){
  const root=new Element(),stack=[root],voids=new Set(['input','br','hr','meta','link','img','path','line','circle','rect','polyline']);
  for(const m of html.matchAll(/<\/?([a-z][\w-]*)\b([^>]*)>|([^<]+)/gi)){
   if(!m[1]){stack.at(-1)._text+=m[3]||'';continue;}
   const tag=m[1].toLowerCase();
   if(m[0].startsWith('</')){const at=stack.findLastIndex(n=>n.tag===tag);if(at>0)stack.length=at;continue;}
   const attrs={};for(const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)"|='([^']*)'|=([^\s>]+))?/g))attrs[a[1]]=a[2]??a[3]??a[4]??'';
   const n=new Element(tag,attrs);stack.at(-1).children.push(n);if(!voids.has(tag)&&!m[0].endsWith('/>'))stack.push(n);
  }return root.children;
 }
 function descendants(n){return n.children.flatMap(c=>[c,...descendants(c)])}
 const root=new Element('body');root.innerHTML=fs.readFileSync(new URL('../docs/laboratorio.html',import.meta.url),'utf8');
 const matches=(n,s)=>s.startsWith('.')?n.className.split(/\s+/).includes(s.slice(1)):s.startsWith('[')?(()=>{const m=s.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);return m&&m[1]in n.attrs&&(m[2]===undefined||m[2]===n.attrs[m[1]]);})():n.tag===s;
 const listeners=new Map(),timers=new Map();let nextTimer=0;
 const document={body:root,hidden:false,getElementById:id=>descendants(root).find(n=>n.attrs.id===id)||null,querySelector:s=>descendants(root).find(n=>matches(n,s))||null,querySelectorAll:s=>descendants(root).filter(n=>matches(n,s)),createElement:tag=>new Element(tag),addEventListener:(event,fn)=>listeners.set(event,fn)};
 const location={hash};const context=vm.createContext({...models,...teaching,mountPlantNeuron,document,location,window:{scrollTo(){},addEventListener:(event,fn)=>listeners.set(event,fn)},setTimeout(fn){timers.set(++nextTimer,fn);return nextTimer},clearTimeout:id=>timers.delete(id)});
 const source=fs.readFileSync(new URL('../docs/lab-clear.js',import.meta.url),'utf8');vm.runInContext(source.slice(source.indexOf('const $=')),context);
 const node=id=>{const n=document.getElementById(id);assert.ok(n,'active control exists: '+id);return n};
 return {document,node,timers,run:code=>vm.runInContext(code,context),click:id=>node(id).onclick(),change(id,value,event='onchange'){const n=node(id);n.value=value;n[event]({target:n});},tab(value){location.hash='#'+value;listeners.get('hashchange')();},tick(){const [id,fn]=timers.entries().next().value||[];assert.ok(fn,'pending animation frame');timers.delete(id);fn();},hide(){document.hidden=true;listeners.get('visibilitychange')();}};
}

test('the public laboratory loads the three audited experiments, not the legacy implementation',()=>{
 const html=fs.readFileSync(new URL('../docs/laboratorio.html',import.meta.url),'utf8');
 assert.match(html,/src="lab-clear\.js\?/);assert.doesNotMatch(html,/src="(?:laboratorio|lab-greenhouse)\.js/);
 const lab=laboratory();for(const name of ['red','vecinos','metricas']){lab.tab(name);assert.equal(lab.run('tab'),name);assert.ok(lab.node('experimento').innerHTML.length>1000);}
});

test('plant neuron shows sensors, prediction and returning gradients before applying one explicit update',()=>{
 const lab=laboratory(),state=()=>lab.run('plantLab.snapshot()'),original=initialPlantNeuron();
 assert.equal(state().step,0);assert.deepEqual(state().model,original);assert.equal(state().updates,0);
 assert.equal(lab.node('pn-step-5').disabled,true);
 lab.click('pn-step-5');assert.equal(state().step,0);assert.equal(state().updates,0);
 assert.doesNotMatch(lab.node('experimento').innerHTML,/spam|promoci.n|mensaje normal/i);
 for(let step=1;step<=4;step++){
  lab.click('pn-next');assert.equal(state().step,step);
  assert.deepEqual(state().model,original);assert.equal(state().updates,0);assert.equal(state().last,null);
  assert.equal(lab.node('pn-step-'+step).getAttribute('aria-current'),'step');
  assert.doesNotMatch(lab.node('pn-diagram').innerHTML,/NaN|Infinity/);
 }
 assert.match(lab.node('pn-caption').innerHTML,/Aún no se han aplicado/);
 assert.match(lab.node('pn-diagram').innerHTML,/Regreso en magenta/);
 assert.match(lab.node('pn-update').innerHTML,/Próximo ajuste · todavía sin aplicar/);
 const expected=plantUpdate(original,[.8,.6],1,1);
 lab.click('pn-next');assert.equal(state().step,5);assert.equal(state().updates,1);
 assert.deepEqual(state().model,expected.after);assert.deepEqual(state().x,[.8,.6]);assert.equal(state().y,1);
 assert.match(lab.node('pn-caption').innerHTML,/0,31 a 0,64/);
 assert.match(lab.node('pn-update').innerHTML,/Último ajuste aplicado/);
 assert.match(lab.node('pn-result').innerHTML,/Regar/);
 const learned=structuredClone(state().model);
 lab.click('pn-replay');assert.deepEqual(state().model,learned);assert.equal(state().updates,1);
 lab.click('pn-next');assert.equal(state().step,0);assert.deepEqual(state().model,learned);assert.equal(state().updates,1);
});

test('plant sliders retain focus and controls while redrawing; bias changes only the offset of fixed inputs',()=>{
 const lab=laboratory(),state=()=>lab.run('plantLab.snapshot()');
 const controls=['pn-dryness','pn-heat','pn-bias','pn-weight-dry','pn-weight-heat','pn-target','pn-rate','pn-next'];
 const saved=new Map(controls.map(id=>[id,lab.node(id)]));
 for(const [id,value,index] of [['pn-dryness',0,0],['pn-dryness',100,0],['pn-heat',0,1],['pn-heat',100,1]]){
  const control=lab.node(id);control.focus();lab.change(id,value,'oninput');
  assert.equal(state().x[index],value/100);assert.equal(state().step,0);assert.equal(state().updates,0);
  assert.equal(lab.node(id),control);assert.equal(control.focused,true);
  assert.doesNotMatch(lab.node('pn-diagram').innerHTML,/NaN|Infinity/);
 }
 lab.click('pn-case-seco');const fixed=state();
 for(const [id,value] of [['pn-bias-high',-1],['pn-bias-low',-3]]){
  lab.click(id);assert.deepEqual(state().x,fixed.x);assert.deepEqual(state().model.w,fixed.model.w);
  assert.equal(state().model.b,value);assert.equal(state().updates,0);
  const r=plantForward(state().model,state().x);
  assert.match(lab.node('pn-bias-comparison').innerHTML,new RegExp(r.p.toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2})));
  assert.match(lab.node('pn-bias-comparison').innerHTML,/Mismas entradas y mismos pesos/);
 }
 lab.change('pn-bias',0,'oninput');assert.equal(state().model.b,0);assert.deepEqual(state().x,fixed.x);assert.deepEqual(state().model.w,fixed.model.w);
 lab.change('pn-weight-dry',3,'oninput');assert.deepEqual(state().x,fixed.x);assert.equal(state().model.w[0],3);assert.equal(state().updates,0);
 lab.change('pn-weight-heat',-1,'oninput');assert.equal(state().model.w[1],-1);assert.equal(state().updates,0);
 for(const [id,control] of saved)assert.equal(lab.node(id),control,'control was not remounted: '+id);
});

test('a learning rate change prepares a new update without applying it; reset restores inputs and all parameters',()=>{
 const lab=laboratory(),state=()=>lab.run('plantLab.snapshot()');
 for(let i=0;i<4;i++)lab.click('pn-next');
 const fixed=structuredClone(state());lab.change('pn-rate',.5);
 assert.equal(state().step,4);assert.equal(state().updates,0);assert.equal(state().rate,.5);assert.deepEqual(state().model,fixed.model);
 assert.match(lab.node('pn-caption').innerHTML,/Con tasa 0,50/);
 const expected=plantUpdate(fixed.model,fixed.x,fixed.y,.5);lab.click('pn-next');
 assert.deepEqual(state().model,expected.after);assert.equal(state().updates,1);
 const learned=structuredClone(state().model);lab.change('pn-rate',1);
 assert.equal(state().step,3);assert.equal(state().updates,1);assert.deepEqual(state().model,learned);
 assert.equal(state().last,null);assert.match(lab.node('pn-update').innerHTML,/todavía sin aplicar/);
 lab.click('pn-case-humedo');assert.deepEqual(state().x,[.15,.4]);assert.equal(state().y,0);assert.deepEqual(state().model,learned);
 lab.change('pn-target',1);assert.equal(state().y,1);assert.equal(state().updates,1);
 const reset=lab.node('pn-reset');reset.focus();lab.click('pn-reset');
 assert.equal(lab.node('pn-reset'),reset);assert.equal(reset.focused,true);
 assert.deepEqual(state().model,initialPlantNeuron());assert.deepEqual(state().x,[.8,.6]);assert.equal(state().y,1);
 assert.equal(state().rate,1);assert.equal(state().step,0);assert.equal(state().updates,0);assert.equal(state().last,null);
 for(const [id,value] of [['pn-dryness','80'],['pn-heat','60'],['pn-bias','-3'],['pn-weight-dry','2'],['pn-weight-heat','1'],['pn-target','1'],['pn-rate','1']])assert.equal(lab.node(id).value,value);
});

test('switching experiments preserves the plant snapshot and never trains on navigation',()=>{
 const lab=laboratory(),state=()=>lab.run('plantLab.snapshot()');
 for(let i=0;i<5;i++)lab.click('pn-next');
 const learned=structuredClone(state());
 for(const name of ['vecinos','metricas'])lab.tab(name);
 lab.tab('red');assert.deepEqual(state(),learned);
 for(const i of [1,3,4,2,0,5]){
  lab.click('pn-step-'+i);assert.equal(state().step,i);assert.equal(state().updates,learned.updates);assert.deepEqual(state().model,learned.model);
 }
 lab.tab('vecinos');lab.tab('red');assert.equal(state().step,5);assert.deepEqual(state().model,learned.model);assert.equal(state().updates,1);
 lab.click('pn-reset');lab.tab('metricas');lab.tab('red');
 assert.deepEqual(state().model,initialPlantNeuron());assert.equal(state().updates,0);assert.equal(state().step,0);
});

test('numeric packets follow the calculation order and return the actual parameter gradients',()=>{
 const lab=laboratory();
 const packets=()=>[...lab.node('pn-diagram').innerHTML.split('</svg>')[0].matchAll(/<g class="pn-packet"[^>]*>([\s\S]*?)<\/g>/g)].map(([,body])=>({
  begin:Number(body.match(/<animateMotion begin="([\d.]+)s"/)[1]),
  value:body.match(/<text[^>]*>([^<]+)<\/text>/)?.[1]
 }));
 lab.click('pn-step-1');
 assert.deepEqual(packets(),[{begin:0,value:'1,60'},{begin:0,value:'0,60'},{begin:0,value:'-3,00'}]);
 lab.click('pn-step-2');
 assert.deepEqual(packets(),[{begin:0,value:'-0,80'},{begin:2,value:'0,31'}]);
 lab.click('pn-step-3');
 assert.match(lab.node('pn-diagram').innerHTML,/Compara · etiqueta 1/);
 assert.deepEqual(packets(),[{begin:0,value:'0,31'}]);
 lab.click('pn-step-4');
 assert.deepEqual(packets(),[
  {begin:0,value:'-0,690'},
  {begin:2,value:'g = -0,552'},
  {begin:2,value:'g = -0,414'},
  {begin:2,value:'g = -0,690'}
 ]);
 lab.click('pn-next');
 assert.deepEqual(packets(),[
  {begin:0,value:'2,04'},{begin:0,value:'0,85'},{begin:0,value:'-2,31'},
  {begin:2,value:'0,58'},{begin:4,value:'0,64'}
 ]);
 assert.match(lab.node('pn-diagram').innerHTML,/Una neurona: suma \+ activación/);
});

test('bias number line keeps both weighted sum and shifted sum visible at positive and negative settings',()=>{
 const lab=laboratory();
 for(const dryness of [0,100])for(const heat of [0,100])for(const bias of [-6,2]){
  lab.change('pn-dryness',dryness,'oninput');lab.change('pn-heat',heat,'oninput');lab.change('pn-bias',bias,'oninput');
  const diagram=lab.node('pn-bias-graphic').innerHTML;
  for(const [,kind,position]of diagram.matchAll(/class="pn-axis-dot pn-axis-(before|after)" style="left:([\d.-]+)%"/g)){
   assert.ok(Number(position)>=0&&Number(position)<=100,`${kind} dot outside the axis at dryness=${dryness}, heat=${heat}, bias=${bias}: ${position}%`);
  }
 }
});

test('KNN controls update figures and units at all bounds, and reset does not remount or lose focus',()=>{
 const lab=laboratory('#vecinos');
 for(const length of [20,48])for(const mass of [2500,5500])for(const k of [1,3,5])for(const unit of ['g','kg']){
  lab.change('package-length',length,'oninput');lab.change('package-mass',mass,'oninput');lab.change('knn-k',k);lab.click('unit-'+unit);
  const raw=models.packageNeighbors({length,mass},false,unit,k),scaled=models.packageNeighbors({length,mass},true,unit,k);
  for(const [id,result]of [['knn-raw',raw],['knn-scaled',scaled]]){assert.match(lab.node(id).innerHTML,new RegExp('Predicción: '+result.prediction));assert.equal((lab.node(id).innerHTML.match(/class="teach-neighbor-row chosen"/g)||[]).length,k);assert.doesNotMatch(lab.node(id).innerHTML,/NaN|Infinity/);}
  assert.equal(lab.node('package-length').getAttribute('aria-valuetext'),length+' centímetros');
 }
 lab.change('distance-package','A');const reset=lab.node('knn-reset');reset.focus();lab.click('knn-reset');
 assert.equal(lab.node('knn-reset'),reset);assert.equal(reset.focused,true);assert.equal(lab.node('distance-package').value,'C');
 assert.equal(lab.node('package-length').value,'43');assert.equal(lab.node('package-mass').value,'4200');assert.equal(lab.node('knn-k').value,'3');assert.equal(lab.node('unit-g').getAttribute('aria-pressed'),'true');
});

test('every score threshold updates decisions, plot, matrix and metrics; selected items survive changes',()=>{
 const lab=laboratory('#metricas');
 for(let i=0;i<=100;i++){
  const t=i/100,r=models.evaluate(t);lab.change('threshold',t,'oninput');
  assert.equal(lab.node('threshold-value').textContent,t.toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2}));
  assert.equal(lab.node('pieces').children.filter(n=>n.className.includes(' tp')||n.className.includes(' fp')).length,r.tp+r.fp);
  assert.match(lab.node('confusion').innerHTML,new RegExp('<strong>'+r.fn+'</strong>Omitido'));
  assert.doesNotMatch(lab.node('score-plot').innerHTML,/NaN|Infinity/);
 }
 lab.click('goal-detect');assert.equal(lab.node('threshold').value,'0.82');assert.match(lab.node('piece-note').textContent,/Defecto detectado/);
 lab.click('goal-clean');assert.equal(lab.node('threshold').value,'0.91');assert.match(lab.node('piece-note').textContent,/Defecto omitido/);
 lab.document.querySelector('[data-piece="99"]').onclick();assert.equal(lab.node('metric-inspect').value,'99');assert.match(lab.node('score-plot').innerHTML,/Pieza 99: 0,90/);assert.equal(lab.document.querySelector('[data-piece="99"]').getAttribute('aria-pressed'),'true');
 lab.change('metric-inspect',98);assert.match(lab.node('piece-note').textContent,/Pieza 98/);assert.equal(lab.document.querySelector('[data-piece="98"]').getAttribute('aria-pressed'),'true');
 for(const id of ['metric-none','metric-find','metric-many']){lab.click(id);assert.equal(lab.run('selectedPiece'),98);}
 lab.click('metric-reset');assert.equal(lab.node('threshold').value,'1');assert.equal(lab.node('metric-inspect').value,'100');assert.match(lab.node('metric-values').innerHTML,/No definida/);
});
