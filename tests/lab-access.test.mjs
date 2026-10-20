import test from 'node:test';
import assert from 'node:assert/strict';
import {checkLabAccess,laboratoryDestination} from '../docs/lab-access.js';

test('laboratory return accepts only actual laboratory routes',()=>{
 for(const hash of ['','#red','#vecinos','#metricas','#riego'])assert.equal(laboratoryDestination('?destino='+encodeURIComponent('laboratorio.html'+hash)),'laboratorio.html'+hash);
 for(const value of ['https://other.test','laboratorio.html.evil','laboratorio.html/../../','laboratorio.html#unknown'])assert.equal(laboratoryDestination('?destino='+encodeURIComponent(value)),null);
});
test('lab failure is recoverable instead of an unbounded wait or registration loop',async()=>{
 const calls=[];
 const options={origin:'https://records.test',recordsURL:'https://records.test',storage:{getItem:()=>null},fetcher:async(path,settings)=>{calls.push({path,settings});throw new DOMException('timeout','TimeoutError')}};
 assert.deepEqual(await checkLabAccess(options),{status:'unavailable'});
 assert.ok(calls[0].settings.signal instanceof AbortSignal);
 assert.equal((await checkLabAccess({...options,fetcher:async()=>Response.json({role:'teacher'})})).status,'ready');
 assert.equal((await checkLabAccess({...options,fetcher:async path=>Response.json(path==='/api/session'?{role:'student'}:{student:null,name:''})})).status,'registration');
 assert.equal((await checkLabAccess({...options,fetcher:async path=>Response.json(path==='/api/session'?{role:'student'}:{student:{id:'own'},name:'Persona Prueba'})})).status,'ready');
});
test('public lab uses the same full-name gate and never grants teacher role from local storage',async()=>{
 const base={origin:'https://class.test',recordsURL:'https://records.test'};
 assert.equal((await checkLabAccess({...base,storage:{getItem:()=>JSON.stringify({name:'Alias',role:'teacher'})}})).status,'registration');
 assert.equal((await checkLabAccess({...base,storage:{getItem:()=>JSON.stringify({name:'Persona Prueba'})}})).status,'ready');
});
