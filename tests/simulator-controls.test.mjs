import test from 'node:test';
import assert from 'node:assert/strict';
import {mountSimulator} from '../docs/simulators.js';
import {forecastExample} from '../docs/ml-example-models.js';

// Exercise the real renderer and handlers. This fixture intentionally has no
// geometry engine: SVG coordinates are checked numerically, browser layout in E2E.
function simulator(type){
 class Element{
  constructor(tag='div',attrs={}){this.tag=tag;this.attrs=attrs;this.children=[];this.dataset={};this.handlers=new Map();this._text='';this._html='';this.renders=0;for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;}
  get className(){return this.attrs.class||''}
  get innerHTML(){return this._html}set innerHTML(value){this._html=String(value);this._text='';this.children=parse(this._html);this.renders++;}
  get textContent(){return this._text+this.children.map(n=>n.textContent).join('')}set textContent(value){this._text=String(value);this.children=[];}
  get options(){return descendants(this).filter(n=>n.tag==='option')}
  get value(){return this._value??this.attrs.value??(this.tag==='select'?(this.options.find(o=>'selected'in o.attrs)||this.options[0])?.value??'':this.tag==='option'?this.textContent:'')}
  set value(v){this._value=String(v)}
  setAttribute(k,v){this.attrs[k]=String(v)}getAttribute(k){return this.attrs[k]??null}
  addEventListener(type,fn){if(!this.handlers.has(type))this.handlers.set(type,[]);this.handlers.get(type).push(fn)}
  dispatch(type){const e={target:this};for(const fn of this.handlers.get(type)||[])fn(e);this['on'+type]?.(e)}
  querySelector(s){return this.querySelectorAll(s)[0]||null}
  querySelectorAll(s){return descendants(this).filter(n=>s.split(',').some(part=>matches(n,part.trim())))}
 }
 function descendants(n){return n.children.flatMap(child=>[child,...descendants(child)])}
 function matches(n,s){if(s.startsWith('#'))return n.attrs.id===s.slice(1);if(s.startsWith('.'))return n.className.split(/\s+/).includes(s.slice(1));if(s.startsWith('[')){const m=s.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);return m&&m[1]in n.attrs&&(m[2]===undefined||m[2]===n.attrs[m[1]]);}return n.tag===s;}
 function parse(html){
  const root=new Element(),stack=[root],voids=new Set(['input','br','hr','img','path','circle','rect','line','polyline','ellipse']);
  for(const m of html.matchAll(/<\/?([a-z][\w-]*)\b([^>]*)>|([^<]+)/gi)){
   if(!m[1]){stack.at(-1)._text+=m[3]||'';continue;}
   const tag=m[1].toLowerCase();if(m[0].startsWith('</')){const at=stack.findLastIndex(n=>n.tag===tag);if(at>0)stack.length=at;continue;}
   const attrs={};for(const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)"|='([^']*)'|=([^\s>]+))?/g))attrs[a[1]]=a[2]??a[3]??a[4]??'';
   const node=new Element(tag,attrs);stack.at(-1).children.push(node);if(!voids.has(tag)&&!m[0].endsWith('/>'))stack.push(node);
  }return root.children;
 }
 const root=new Element();mountSimulator(root,type);
 const q=s=>{const n=root.querySelector(s);assert.ok(n,'active element '+type+': '+s);return n};
 return {root,q,text:id=>q('#'+id).textContent,html:()=>q('#visual').innerHTML,change(id,value,event='input'){const n=q('#'+id);n.value=value;n.dispatch(event);},click(selector){const n=q(selector.startsWith('#')||selector.startsWith('[')?selector:'#'+selector);if(!n.disabled)n.dispatch('click');},all:s=>root.querySelectorAll(s)};
}
const localized=(n,d=2)=>Number(n).toLocaleString('es-CO',{maximumFractionDigits:d,minimumFractionDigits:d});
const near=(a,b,message,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${message}: ${a} ≈ ${b}`);
const pointsOf=node=>node.getAttribute('points').trim().split(/\s+/).map(p=>p.split(',').map(Number));
function finiteDrawing(s){assert.doesNotMatch(s.html(),/NaN|Infinity|undefined/);for(const n of s.all('circle,line,rect,ellipse'))for(const key of ['cx','cy','x1','x2','y1','y2','x','y','r','rx','ry','width','height'])if(n.getAttribute(key)!==null)assert.ok(Number.isFinite(Number(n.getAttribute(key))),'finite '+key);}

test('every simulator mounts, expands labels locally, and accepts real input/change events',()=>{
 for(const type of ['regression','ensembles','impute','threshold','clusters','pca','activation','training','attention','vision','series','grid']){
  const s=simulator(type);assert.equal(s.root.dataset.simulator,type);if(type==='clusters')assert.equal(s.all('[data-cl-point]').length,29);else assert.ok(s.q('#visual').innerHTML.length>200);finiteDrawing(s);
  s.click('[data-plot-expand]');assert.equal(s.q('.simulator').dataset.plotExpanded,'true');assert.equal(s.q('[data-plot-expand]').getAttribute('aria-pressed'),'true');s.click('[data-plot-expand]');assert.equal(s.q('.simulator').dataset.plotExpanded,'false');
 }
});

test('regression covers the maximum legal prediction without cropping and OLS changes both controls',()=>{
 const s=simulator('regression');s.change('slope',.05);s.change('bias',2,'change');
 assert.equal(s.text('reg-mae'),'3,05 t/ha');
 const fitLine=s.all('line').find(n=>n.getAttribute('stroke')==='#244f42'&&n.getAttribute('stroke-width')==='3');
 assert.ok(fitLine);near(Number(fitLine.getAttribute('y2')),24,'maximum prediction reaches the top axis');
 for(const n of s.all('line'))for(const y of ['y1','y2'])if(n.getAttribute(y)!==null){const v=Number(n.getAttribute(y));assert.ok(v>=24&&v<=249,'line stays inside the data area');}
 const visual=s.q('#visual'),before=visual.renders;s.change('bias',2,'input');assert.equal(visual.renders,before,'input followed by change at the same value must not redraw');
 s.click('fit-line');near(Number(s.q('#slope').value),.024714285714285713,'least-squares slope');near(Number(s.q('#bias').value),1.2257142857142855,'least-squares intercept');assert.equal(s.text('reg-mae'),'0,04 t/ha');finiteDrawing(s);
});

test('imputation sorts the current known values, rather than taking the middle control',()=>{
 const s=simulator('impute');s.change('rain-a',900);s.change('rain-c',100,'change');s.change('rain-d',700);
 assert.equal(s.text('rain-median'),'700 mm');assert.equal(s.text('rain-a-out'),'900 mm');assert.equal(s.text('rain-c-out'),'100 mm');
 const bars=s.all('rect'),imputed=bars.find(n=>n.getAttribute('fill')==='#e0b591');near(Number(imputed.getAttribute('width')),700/900*350,'B uses current median');
 s.change('rain-a',100,'change');assert.equal(s.text('rain-median'),'100 mm');finiteDrawing(s);
});

test('threshold recomputes every outcome and leaves precision undefined when no alert exists',()=>{
 const s=simulator('threshold');
 const matrix=()=>s.all('.cell').map(n=>Number(n.querySelector('b').textContent));
 assert.deepEqual(matrix(),[4,2,1,3]);assert.equal(s.text('precision'),'60 %');assert.equal(s.text('recall'),'75 %');assert.equal(s.text('accuracy'),'70 %');
 s.change('threshold',.95,'change');assert.equal(s.all('.alert').length,0);assert.deepEqual(matrix(),[6,0,4,0]);assert.equal(s.text('precision'),'Sin alertas');assert.equal(s.text('recall'),'0 %');assert.equal(s.text('accuracy'),'60 %');
 s.change('threshold',.05);assert.equal(s.all('.alert').length,10);assert.deepEqual(matrix(),[0,6,0,4]);assert.equal(s.text('precision'),'40 %');assert.equal(s.text('recall'),'100 %');
 s.change('threshold',.9,'change');assert.equal(s.all('.alert').length,1,'score equal to the threshold counts as an alert');assert.deepEqual(matrix(),[6,0,3,1]);finiteDrawing(s);
});

test('DBSCAN preserves data, controls, equal scales and the selected center across presets',()=>{
 const s=simulator('clusters'),radius=()=>s.q('#cluster-radius');
 const positions=()=>s.all('circle').filter(n=>n.getAttribute('id')?.startsWith('cluster-dot-')).map(n=>[n.getAttribute('cx'),n.getAttribute('cy')]);
 const before=positions(),input=s.q('#eps');assert.equal(before.length,29);
 assert.equal(s.text('cluster-count'),'2 · 3 sin grupo');
 for(const r of [3,25,50,65])for(const minimum of [2,9,15])for(const selected of [0,26,28]){
  s.change('eps',r);s.change('minpts',minimum,'change');s.change('cluster-point',selected,'change');
  near(Number(radius().getAttribute('r')),r*4.4,'radius uses the same scale as both axes');
  assert.deepEqual(positions(),before,'centers never move when parameters change');assert.equal(s.q('#eps'),input,'the dragged input is never rebuilt');
  assert.match(s.text('cluster-reading'),new RegExp('Centro '+(selected+1)+':'));assert.equal(s.text('minpts-out'),String(minimum));finiteDrawing(s);
 }
 s.change('eps',10);s.change('minpts',4);s.change('cluster-point',28);s.click('[data-cl-radius="3"]');assert.equal(s.text('cluster-count'),'0 · 29 sin grupo');assert.equal(s.q('#cluster-point').value,'28');
 s.click('[data-cl-radius="10"]');assert.equal(s.text('cluster-count'),'2 · 3 sin grupo');
 s.click('[data-cl-radius="50"]');assert.equal(s.text('cluster-count'),'1 · 1 sin grupo');
 s.click('cluster-reset');assert.equal(s.q('#eps').value,'10');assert.equal(s.q('#minpts').value,'4');assert.equal(s.q('#cluster-point').value,'0');assert.equal(s.text('cluster-count'),'2 · 3 sin grupo');
});

test('PCA redraws the current projection with the correct retained variance at 0°, 90° and 37°',()=>{
 const s=simulator('pca');
 for(const [angle,expected]of [[0,'63,1 %'],[90,'36,9 %'],[37,'98,0 %']]){
  s.change('angle',angle,'change');assert.equal(s.text('variance'),expected);assert.equal(s.text('angle-out'),angle+'°');
  const dots=s.all('circle');assert.equal(dots.filter(n=>n.getAttribute('fill')==='#6c96ad').length,22);assert.equal(dots.filter(n=>n.getAttribute('fill')==='#c47948').length,22);finiteDrawing(s);
  if(angle===0)for(const n of dots.filter(n=>n.getAttribute('fill')==='#c47948'))near(Number(n.getAttribute('cy')),139,'horizontal projections');
  if(angle===90)for(const n of dots.filter(n=>n.getAttribute('fill')==='#c47948'))near(Number(n.getAttribute('cx')),264,'vertical projections');
 }
});

test('ensemble metric selection changes the bars and reported error without changing models',()=>{
 const s=simulator('ensembles');assert.equal(s.text('ensemble-best'),'Gradient boosting · 0,301');
 const widths=()=>s.all('rect').map(n=>Number(n.getAttribute('width')));
 const mae=widths();s.change('ensemble-metric',2,'change');assert.equal(s.text('ensemble-best'),'Gradient boosting · 0,411');
 const rmse=widths();assert.equal(rmse.length,4);for(let i=0;i<4;i++)assert.ok(rmse[i]>mae[i]);near(rmse[3],.411416*290,'boosting RMSE bar');
 s.change('ensemble-metric',1);assert.deepEqual(widths(),mae);finiteDrawing(s);
});

test('all activation choices retain the chosen input and put the marker on the output curve',()=>{
 const s=simulator('activation');
 for(const signal of [-4,4])for(const [name,fn]of [['relu',x=>Math.max(0,x)],['sigmoid',x=>1/(1+Math.exp(-x))],['tanh',Math.tanh]]){
  s.change('signal',signal);s.change('act',name,'change');assert.equal(s.text('activation-output'),localized(fn(signal),3));assert.equal(s.q('#signal').value,String(signal));
  const marker=s.all('circle')[0];near(Number(marker.getAttribute('cy')),249-(fn(signal)+1)/5*225,'activation marker');finiteDrawing(s);
 }
});

test('training rate only previews the next update, reaches 60 finite steps, and resets the whole trace',()=>{
 const s=simulator('training');s.change('rate',.4,'change');assert.equal(s.text('parameter'),'-2,000');assert.equal(s.text('loss'),'25,000');assert.match(s.text('training-next'),/= 2,000/);assert.equal(pointsOf(s.q('polyline')).length,1);
 s.click('train-step');assert.equal(s.text('parameter'),'2,000');assert.equal(s.text('loss'),'1,000');
 s.change('rate',1.1);assert.equal(s.text('parameter'),'2,000');assert.equal(s.text('loss'),'1,000');assert.match(s.text('training-next'),/= 4,200/);
 s.click('train-reset');assert.equal(s.q('#rate').value,'1.1');assert.equal(s.text('parameter'),'-2,000');assert.equal(s.text('loss'),'25,000');
 for(let i=0;i<60;i++)s.click('train-step');assert.equal(pointsOf(s.q('polyline')).length,61);assert.equal(s.q('#train-step').disabled,true);assert.match(s.text('training-next'),/60 pasos/);finiteDrawing(s);
 for(const [x,y]of pointsOf(s.q('polyline'))){assert.ok(x>=58&&x<=471&&y>=24-1e-8&&y<=249,'divergent loss still fits the chart');}
 const prior=s.text('parameter');s.click('train-step');assert.equal(s.text('parameter'),prior);
 s.click('train-reset');assert.equal(s.text('parameter'),'-2,000');assert.equal(s.text('loss'),'25,000');assert.equal(pointsOf(s.q('polyline')).length,1);assert.equal(s.q('#train-step').disabled,false);finiteDrawing(s);
});

test('GridWorld counts blocked moves, terminates goal/pit episodes, and starts a clean new route',()=>{
 const s=simulator('grid'),move=dir=>s.click('[data-dir="'+dir+'"]');
 move('up');assert.equal(s.text('grid-score'),'-1 · 1 pasos');assert.match(s.text('grid-last'),/Borde o pared/);
 move('right');move('down');assert.equal(s.text('grid-score'),'-3 · 3 pasos');assert.match(s.text('grid-last'),/Borde o pared/);
 move('right');move('down');move('down');assert.equal(s.text('grid-score'),'-6 · 6 pasos');assert.match(s.text('grid-last'),/Borde o pared/);
 s.click('grid-reset');assert.equal(s.text('grid-score'),'0 · 0 pasos');
 for(let i=0;i<4;i++)move('right');move('down');assert.equal(s.text('grid-score'),'6 · 5 pasos');assert.match(s.text('grid-last'),/meta: \+10/);assert.ok(s.all('[data-dir]').every(n=>n.disabled));move('down');assert.equal(s.text('grid-score'),'6 · 5 pasos');
 s.click('grid-reset');assert.ok(s.all('[data-dir]').every(n=>!n.disabled));for(let i=0;i<3;i++)move('down');move('right');move('right');assert.equal(s.text('grid-score'),'-14 · 5 pasos');assert.match(s.text('grid-last'),/pozo: −10/);assert.ok(s.all('[data-dir]').every(n=>n.disabled));
 s.click('grid-reset');assert.equal(s.text('grid-score'),'0 · 0 pasos');assert.match(s.text('grid-last'),/fila 1, columna 1/);finiteDrawing(s);
});

test('manual attention weights, three vision outputs and the forecast selector follow their controls',()=>{
 const attention=simulator('attention');attention.change('att-rain',10);attention.change('att-soil',1,'change');attention.change('att-yield',1);
 const widths=attention.all('rect').map(n=>Number(n.getAttribute('width')));near(widths.reduce((a,b)=>a+b,0),300,'manual weights add to 100%');near(widths[0],250,'rain has 10/12 of the total');assert.match(attention.html(),/83,3 %/);
 const vision=simulator('vision');for(const [task,label]of [['detection','Tres cajas'],['segmentation','Tres máscaras'],['classification','Una etiqueta']]){vision.change('vision-task',task,'change');assert.equal(vision.text('vision-result'),label);assert.equal(vision.all('ellipse').length,3);if(task==='detection')assert.equal(vision.all('rect').filter(n=>n.getAttribute('fill')==='none').length,3);if(task==='segmentation')assert.equal(vision.all('ellipse').filter(n=>n.getAttribute('fill')==='#c47948').length,3);finiteDrawing(vision);}
 const series=simulator('series');for(const strategy of ['seasonal','last','trend']){series.change('forecast-strategy',strategy,'change');assert.equal(series.text('series-error'),localized(forecastExample(strategy).error)+' unidades');assert.equal(series.all('polyline').filter(n=>n.getAttribute('stroke-width')==='3.5').length,1);assert.equal(pointsOf(series.all('polyline')[0]).length,84);finiteDrawing(series);}
});
