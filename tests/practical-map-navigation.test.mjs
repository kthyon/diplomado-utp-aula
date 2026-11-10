import test from 'node:test';
import assert from 'node:assert/strict';
import {mountPracticalMap,renderPracticalMap} from '../docs/dl-practical-lessons.js';

test('el recuadro del tema actual lleva al ejercicio y los otros conservan su enlace de navegación',()=>{
 const calls=[],handlers={};
 const heading={setAttribute:(...args)=>calls.push(['attribute',...args]),focus:o=>calls.push(['focus',o])};
 const section={querySelector:s=>{assert.equal(s,'h2');return heading;},scrollIntoView:o=>calls.push(['scroll',o])};
 const links=['dl-secuencias','dl-atencion','dl-transformers'].map(id=>({dataset:{pwTopic:id},addEventListener:(event,fn)=>{assert.equal(event,'click');handlers[id]=fn;}}));
 const root={querySelectorAll:s=>{assert.equal(s,'[data-pw-topic]');return links;},querySelector:s=>{assert.equal(s,'#ejemplo-del-tema');return section;}};
 mountPracticalMap(root,()=> '#tema/dl-atencion');
 handlers['dl-atencion']({preventDefault:()=>calls.push(['prevent'])});
 assert.deepEqual(calls,[['prevent'],['attribute','tabindex','-1'],['focus',{preventScroll:true}],['scroll',{block:'start',behavior:'auto'}]]);
 calls.length=0;handlers['dl-secuencias']({preventDefault:()=>assert.fail('el otro tema usa su enlace real')});assert.deepEqual(calls,[]);
 const html=renderPracticalMap('dl-atencion');assert.match(html,/Estás aquí · Ir al ejercicio/);assert.equal((html.match(/Abrir este tema/g)||[]).length,2);
});
