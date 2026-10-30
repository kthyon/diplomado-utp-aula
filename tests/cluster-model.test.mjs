import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUSTER_POINTS,clusterResult,changedMembership,clusterX,clusterY,clusterHull} from '../docs/cluster-model.js';
test('the guide keeps its original 29 profiles and the reference outcomes',()=>{
 const original=[...[0,1].flatMap(g=>Array.from({length:13},(_,i)=>[g*50+23+Math.cos(i*2.4)*((i%4)+2)*2,g*40+25+Math.sin(i*2.4)*((i%4)+2)*2])),[5,80],[95,10],[55,95]];
 assert.deepEqual(CLUSTER_POINTS,original);
 for(const [eps,groups,noise] of [[3,0,29],[5,4,11],[10,2,3],[50,1,1],[65,1,0]]){
  const r=clusterResult(eps,4);assert.equal(r.groups.length,groups);assert.equal(r.noise,noise);
 }
});
test('every selected neighborhood and role matches inclusive Euclidean distances',()=>{
 const saved=structuredClone(CLUSTER_POINTS);
 for(const eps of [3,7,10,25,50,65])for(const min of [2,4,9,15])for(let i=0;i<29;i++){
  const r=clusterResult(eps,min,i);assert.equal(r.neighbors.length,r.counts[i]);assert.equal(r.neighbors[0].id,i);
  assert.equal(r.neighbors[0].distance,0);
  for(const n of r.neighbors)assert.ok(n.distance<=eps);
  assert.equal(r.roles[i],r.counts[i]>=min?'núcleo':r.labels[i]>=0?'borde':'sin grupo');
  assert.equal(r.groups.reduce((n,g)=>n+g.ids.length,0)+r.noise,29);
 }
 assert.deepEqual(CLUSTER_POINTS,saved);
 const d=Math.hypot(CLUSTER_POINTS[0][0]-CLUSTER_POINTS[1][0],CLUSTER_POINTS[0][1]-CLUSTER_POINTS[1][1]);
 assert.ok(clusterResult(d,2,0).neighbors.some(n=>n.id===1));assert.ok(!clusterResult(d-1e-10,2,0).neighbors.some(n=>n.id===1));
});
test('a stricter minimum dissolves groups without changing coordinates; change tracking ignores inspection',()=>{
 assert.equal(clusterResult(10,15).noise,29);
 assert.equal(changedMembership(clusterResult(10,4,0),clusterResult(10,4,28)),0);
 assert.equal(changedMembership(clusterResult(3,4),clusterResult(10,4)),26);
 assert.ok(Math.abs((clusterX(100)-clusterX(0))-(clusterY(0)-clusterY(100)))<1e-10);
 for(const group of clusterResult(10,4).groups)assert.ok(clusterHull(group.ids).every(p=>CLUSTER_POINTS.includes(p)));
});
