import test from 'node:test';
import assert from 'node:assert/strict';
import {referenceOffset,readReferenceOffset,nextScheduleDelay} from '../docs/schedule-clock.js';
import {COURSES} from '../docs/content.js';
test('reference time accounts for cache age and request time without changing calendar data',()=>{
 const base=Date.parse('2026-10-23T05:00:00Z');
 assert.equal(referenceOffset(new Headers({date:new Date(base).toUTCString(),age:'10'}),base+20000,base+20200),-10100);
 assert.equal(referenceOffset(new Headers(),0,100),null);
});
test('clock failure keeps the existing clock and never blocks the classroom',async()=>{
 assert.equal(await readReferenceOffset(async()=>{throw Error('offline')},()=>0),null);
 assert.equal(await readReferenceOffset(async()=>new Response('',{status:405}),()=>0),null);
});
test('refresh aligns with midnight and lesson start/end, not just an arbitrary minute',()=>{
 assert.equal(nextScheduleDelay(COURSES,new Date('2026-10-23T04:59:59Z')),1050);
 assert.equal(nextScheduleDelay(COURSES,new Date('2026-10-23T22:59:59Z')),1050);
 assert.equal(nextScheduleDelay(COURSES,new Date('2026-10-24T02:59:59Z')),1050);
 assert.equal(nextScheduleDelay(COURSES,new Date('2026-10-20T18:00:00Z')),60000);
});
