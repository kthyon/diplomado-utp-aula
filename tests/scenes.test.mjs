import test from 'node:test';
import assert from 'node:assert/strict';
import {SCENES,FARMS,PLANTS,defaults,result,nextAdjustment} from '../docs/scene-models.js';
test('six scenes each have a context, reading guide, limit and scenarios',()=>{
 assert.equal(SCENES.length,6);
 for(const s of SCENES){assert.ok(s.read&&s.limit&&s.idea);for(const [,preset] of s.presets)assert.doesNotThrow(()=>result(s.id,{...defaults(s),...preset}));}
});
test('prediction changes estimates, never the six observations',()=>{
 const baseline=result('prediction',{slope:.025,bias:1});
 assert.ok(Math.abs(baseline.error-.2)<1e-10);
 assert.ok(result('prediction',{slope:.04,bias:1.5}).error>baseline.error);
 assert.deepEqual(FARMS.map(f=>f.y),[2.2,2.8,3.1,3.7,4.2,4.7]);
});
test('alert tradeoff at low, medium and high thresholds',()=>{
 assert.deepEqual(['tp','fp','fn','tn'].map(k=>result('alerts',{threshold:.5})[k]),[3,2,1,4]);
 assert.deepEqual(['tp','fp','fn','tn'].map(k=>result('alerts',{threshold:.3})[k]),[4,3,0,3]);
 assert.deepEqual(['tp','fp','fn','tn'].map(k=>result('alerts',{threshold:.85})[k]),[1,0,3,6]);
 assert.equal(PLANTS.filter(p=>p.plague).length,4);
});
test('missing record uses middle of known values, not zero or mean',()=>{
 assert.equal(result('missing',{rainA:100,rainC:600,rainD:700}).estimate,600);
 assert.equal(result('missing',{rainA:900,rainC:200,rainD:300}).estimate,300);
});
test('negative signals distinguish the three activations',()=>{
 assert.equal(result('signal',{signal:-2,function:'relu'}).output,0);
 assert.ok(result('signal',{signal:-2,function:'sigmoid'}).output>0);
 assert.ok(result('signal',{signal:-2,function:'tanh'}).output<0);
});
test('small training step converges, half step reaches target, large step diverges',()=>{
 const small=nextAdjustment({rate:.1});assert.equal(small.theta,-1);assert.equal(result('adjustment',small).loss,16);
 const exact=nextAdjustment({rate:.5});assert.equal(exact.theta,3);assert.equal(result('adjustment',exact).loss,0);
 const large=nextAdjustment({rate:1.1});assert.ok(result('adjustment',large).loss>25);
});
test('comparison snapshots keep independent parameter and history values',()=>{
 let p=nextAdjustment({rate:.1});const a=structuredClone(p);p=nextAdjustment(p);
 assert.equal(a.history.length,2);assert.equal(p.history.length,3);assert.equal(a.theta,-1);
});
