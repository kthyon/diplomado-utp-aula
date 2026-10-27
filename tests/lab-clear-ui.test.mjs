import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as models from '../docs/lab-clear-models.js';
import * as teaching from '../docs/lab-explanations.js';

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
 const location={hash};const context=vm.createContext({...models,...teaching,document,location,window:{scrollTo(){},addEventListener:(event,fn)=>listeners.set(event,fn)},setTimeout(fn){timers.set(++nextTimer,fn);return nextTimer},clearTimeout:id=>timers.delete(id)});
 const source=fs.readFileSync(new URL('../docs/lab-clear.js',import.meta.url),'utf8');vm.runInContext(source.slice(source.indexOf('const $=')),context);
 const node=id=>{const n=document.getElementById(id);assert.ok(n,'active control exists: '+id);return n};
 return {document,node,timers,run:code=>vm.runInContext(code,context),click:id=>node(id).onclick(),change(id,value,event='onchange'){const n=node(id);n.value=value;n[event]({target:n});},tab(value){location.hash='#'+value;listeners.get('hashchange')();},tick(){const [id,fn]=timers.entries().next().value||[];assert.ok(fn,'pending animation frame');timers.delete(id);fn();},hide(){document.hidden=true;listeners.get('visibilitychange')();}};
}

test('the public laboratory loads the three audited experiments, not the legacy implementation',()=>{
 const html=fs.readFileSync(new URL('../docs/laboratorio.html',import.meta.url),'utf8');
 assert.match(html,/src="lab-clear\.js\?/);assert.doesNotMatch(html,/src="(?:laboratorio|lab-greenhouse)\.js/);
 const lab=laboratory();for(const name of ['red','vecinos','metricas']){lab.tab(name);assert.equal(lab.run('tab'),name);assert.ok(lab.node('experimento').innerHTML.length>1000);}
});

test('prediction, error and training are separate operations; restart restores every network control',()=>{
 const lab=laboratory(),original=lab.run('JSON.stringify(net)');
 lab.click('nn-next');assert.equal(lab.run('step'),1);assert.equal(lab.run('JSON.stringify(net)'),original);
 lab.click('nn-next');assert.equal(lab.run('step'),2);assert.equal(lab.run('JSON.stringify(net)'),original);
 lab.click('nn-next');assert.equal(lab.run('epoch'),1);assert.notEqual(lab.run('JSON.stringify(net)'),original);
 assert.match(lab.node('nn-learning').innerHTML,/Última actualización/);
 lab.click('nn-next');assert.equal(lab.run('epoch'),1);
 lab.click('nn-train');assert.equal(lab.run('epoch'),21);assert.equal(lab.run('history.length'),22);
 lab.change('nn-sample',7);lab.change('neuron-choice',2);lab.click('nn-reset');
 assert.equal(lab.run('JSON.stringify(net)'),original);assert.equal(lab.run('epoch'),0);assert.equal(lab.run('step'),0);
 assert.equal(lab.node('nn-sample').value,'0');assert.equal(lab.node('neuron-choice').value,'0');assert.equal(lab.run('lastUpdate'),null);
 assert.equal(lab.run('history.length'),1);assert.doesNotMatch(lab.node('nn-visual').innerHTML,/NaN|Infinity/);
});

test('automatic playback completes one real update, and pause, navigation and hidden tabs cancel it',()=>{
 const lab=laboratory();lab.click('nn-play');assert.equal(lab.timers.size,1);assert.equal(lab.node('nn-play').getAttribute('aria-pressed'),'true');
 for(let i=0;i<4;i++)lab.tick();assert.equal(lab.run('step'),4);assert.equal(lab.run('epoch'),1);assert.equal(lab.timers.size,0);
 lab.click('nn-play');lab.click('nn-play');assert.equal(lab.timers.size,0);assert.equal(lab.node('nn-play').getAttribute('aria-pressed'),'false');
 lab.click('nn-play');lab.tab('vecinos');assert.equal(lab.timers.size,0);assert.equal(lab.run('running'),false);
 lab.tab('red');lab.click('nn-play');lab.hide();assert.equal(lab.timers.size,0);assert.equal(lab.run('running'),false);
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
