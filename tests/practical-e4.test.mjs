import test from 'node:test';
import assert from 'node:assert/strict';
import {PRACTICAL_E4,E4_GRAINS,e4Detection,e4Overlap,e4Policy,renderE4Workbench} from '../docs/practical-e4.js';

test('un filtro cambia propuestas conservadas, no objetos presentes',()=>{
 assert.equal(e4Detection(0,.5).count,1);assert.equal(e4Detection(0,.9).count,0);
 assert.equal(e4Detection(1,.5).count,1);assert.equal(e4Detection(2,.5).count,3);
 assert.equal(e4Detection(2,.9).objects.length,3);assert.throws(()=>e4Detection(4,.5));
});

test('IoU se reconstruye desde áreas y separa filtrado de coincidencia',()=>{
 const perfect=e4Overlap(0,.5),near=e4Overlap(10,.5),far=e4Overlap(30,.5),filtered=e4Overlap(10,.9);
 assert.equal(perfect.iou,1);assert.deepEqual([near.commonWidth,near.commonArea,near.union,near.iou],[30,1200,2000,.6]);
 assert.equal(far.commonArea,400);assert.equal(far.union,2800);assert.equal(far.iou,1/7);
 assert.deepEqual([near.tp,near.fp,near.fn],[1,0,0]);assert.deepEqual([far.tp,far.fp,far.fn],[0,1,1]);assert.deepEqual([filtered.tp,filtered.fp,filtered.fn],[0,0,1]);
 assert.equal(e4Overlap(40).iou,0);assert.throws(()=>e4Overlap(-1));
});

test('las políticas conservan los diez granos y recomputan solo consecuencias',()=>{
 assert.deepEqual(E4_GRAINS.filter(g=>g.defect).map(g=>g.id),[2,4,5,8]);
 const a=e4Policy(.3,8),b=e4Policy(.5,8),all=e4Policy(.5,8,true);
 assert.deepEqual([a.reviews,a.acceptedDefects,a.cost],[6,0,6]);assert.deepEqual([b.reviews,b.acceptedDefects,b.cost],[4,1,12]);assert.equal(all.cost,10);
 assert.equal(e4Policy(.7,1).cost,4);assert.equal(e4Policy(.9,1).cost,4);
 assert.deepEqual(e4Policy(.5,1).rows,b.rows);assert.throws(()=>e4Policy(.5,-1));
});

test('cada tema ofrece tres casos y exige una previsión antes de revelar',()=>{
 for(const id of Object.keys(PRACTICAL_E4)){
  const html=renderE4Workbench(id);assert.equal((html.match(/data-p4-case=/g)||[]).length,3);assert.equal((html.match(/data-dl-diagram=/g)||[]).length,1);
  assert.match(html,/data-p4-reveal disabled/);assert.match(html,/data-p4-result hidden/);assert.match(html,/data-p4-reset/);
  assert.doesNotMatch(html,/id="(?:idea|ejemplo|practica|cuaderno)-del-tema"/);
  for(const field of ['problem','goal','task','change','watch','expected','bridge','colabBridge','checkQuestion','checkAnswer'])assert.ok(PRACTICAL_E4[id][field]?.length>15,id+' '+field);
 }
 assert.equal(renderE4Workbench('dl-atencion'),'');
});
