import test from 'node:test';
import assert from 'node:assert/strict';
import {FIRST_FARMS,NEW_FARMS,farmPrediction,forecastExample} from '../docs/ml-example-models.js';
test('First prediction is fitted only on historical observations, with held-out error in t/ha',()=>{
  const model=farmPrediction(550);
  assert.equal(model.slope,.005);assert.equal(model.intercept,0);assert.equal(model.prediction,2.75);
  assert.ok(Math.abs(Math.abs(NEW_FARMS[1].yield-model.prediction)-.35)<1e-12);
  assert.equal(FIRST_FARMS.length,4);assert.ok(!FIRST_FARMS.some(f=>f.rain===550));
  const original=NEW_FARMS[1].yield;
  try{NEW_FARMS[1].yield=999;assert.equal(farmPrediction(550).prediction,2.75);}finally{NEW_FARMS[1].yield=original;}
});
test('Forecast strategies use identical observations, an earlier training window, and different test errors',()=>{
  const trend=forecastExample('trend'),last=forecastExample('last'),seasonal=forecastExample('seasonal');
  assert.deepEqual(trend.observed,last.observed);assert.deepEqual(last.observed,seasonal.observed);
  assert.equal(trend.training.length,60);assert.equal(trend.test.length,24);
  assert.ok(last.predictions.every(v=>v===last.training.at(-1)));
  assert.equal(seasonal.predictions[0],seasonal.training[48]);assert.equal(seasonal.predictions[12],seasonal.training[48]);
  assert.notEqual(trend.error,last.error);assert.notEqual(trend.error,seasonal.error);
});
