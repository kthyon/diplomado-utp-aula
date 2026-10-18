import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as models from '../docs/lab-models.js';

function laboratory(){
 const nodes=new Map(),handlers=new Map();
 const node=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',attributes:{},setAttribute(name,value){this.attributes[name]=value},addEventListener(type,handler){handlers.set(id+':'+type,handler)},focus(){this.focused=true},scrollIntoView(){this.scrolled=true}});return nodes.get(id)};
 const source=fs.readFileSync(new URL('../docs/laboratorio.js',import.meta.url),'utf8');
 const script=source.slice(source.indexOf('const $='),source.lastIndexOf("window.addEventListener('hashchange',mount);mount();"));
 const context=vm.createContext({...models,document:{getElementById:node,querySelector:node,addEventListener(){}},setTimeout(){},clearTimeout(){},structuredClone});
 vm.runInContext(script,context);
 return{node,handlers,run:code=>vm.runInContext(code,context)};
}

test('cada deslizador del laboratorio tiene nombre accesible estable y etiqueta que enfoca el control',()=>{
 const lab=laboratory();
 for(const [id,label] of [['dryness','Sequedad del suelo'],['heat','Calor'],['age','Edad · años'],['income','Ingreso mensual · COP'],['threshold','Umbral de alerta']]){
  const html=lab.run(`slider(${JSON.stringify(id)},${JSON.stringify(label)},0,100,1,80)`);
  assert.match(html,new RegExp(`<label for="${id}">`));
  assert.match(html,new RegExp(`<input id="${id}" aria-label="${label}"`));
 }
});

test('el umbral comunica el mismo valor decimal visible y accesible, también en los extremos',()=>{
 const lab=laboratory();
 for(const threshold of [0,.8,1]){
  lab.run(`threshold=${threshold};updateMetrics()`);
  const text=threshold.toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2});
  assert.equal(lab.node('threshold-value').textContent,text);
  assert.equal(lab.node('threshold').attributes['aria-valuetext'],text);
 }
});

test('saltar al experimento conserva historia, paso, datos personalizados y reproducción',()=>{
 const lab=laboratory();
 for(const story of ['riego','vecinos','metricas']){
  lab.run(`active=${JSON.stringify(story)};step=2;custom=true;playing=true;water.x=[.45,.7];query={age:50,income:6000000,k:5};threshold=.63`);
  const before=lab.run('JSON.stringify({active,step,custom,playing,water,query,threshold})');
  let prevented=false;
  lab.handlers.get('.skip:click')({preventDefault(){prevented=true}});
  assert.equal(prevented,true,'el salto no debe cambiar el fragmento de historia');
  assert.equal(lab.run('JSON.stringify({active,step,custom,playing,water,query,threshold})'),before);
  assert.equal(lab.node('experimento').focused,true);
  assert.equal(lab.node('experimento').scrolled,true);
 }
});

test('el relato sin escalado coincide con los tres votos del ejemplo predeterminado',()=>{
 const lab=laboratory(),result=models.neighbors({age:43,income:4200000},3,false);
 assert.equal(result.selected.length,3);
 assert.equal(result.selected.every(person=>person.buy===0),true);
 assert.match(lab.run('stories.vecinos.steps[1]'),/Los tres vecinos votan «no compra»/);
});
