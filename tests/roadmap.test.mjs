import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES,LESSONS} from '../docs/content.js';
import {ROADMAP,roadmapMeetings,roadmapPosition} from '../docs/roadmap-model.js';

test('el mapa conserva los ocho encuentros, sus 24 temas y sus horarios oficiales',()=>{
 const rows=roadmapMeetings(COURSES),ids=new Set(LESSONS.map(l=>l.id));
 assert.equal(rows.length,8);assert.equal(Object.keys(ROADMAP).length,8);
 assert.deepEqual(rows.map(r=>r.number),[1,2,3,4,5,6,7,8]);
 assert.equal(new Set(rows.flatMap(r=>r.topics)).size,24);
 for(const row of rows){const official=COURSES[row.course].classes[row.localIndex];assert.equal(row.iso,official.iso);assert.equal(row.time,official.time);assert.deepEqual(row.topics,official.topics);assert.ok(row.topics.every(id=>ids.has(id)));assert.equal(row.concepts.length,3);assert.ok(row.question&&row.why&&row.outcome&&row.bridge&&row.slide);}
});
test('la ubicación usa la hora de clase, no la apertura a medianoche ni los temas vistos',()=>{
 assert.deepEqual(roadmapPosition(COURSES,new Date('2026-10-23T23:29:59Z')),{id:'ml-1',kind:'upcoming'});
 assert.deepEqual(roadmapPosition(COURSES,new Date('2026-10-23T23:30:00Z')),{id:'ml-1',kind:'current'});
 assert.deepEqual(roadmapPosition(COURSES,new Date('2026-10-24T14:00:00Z')),{id:'ml-2',kind:'current'});
 assert.deepEqual(roadmapPosition(COURSES,new Date('2026-10-24T17:00:00Z')),{id:'ml-3',kind:'upcoming'});
});
test('la transición a DL y el cierre del calendario se señalan sin acreditar progreso',()=>{
 assert.deepEqual(roadmapPosition(COURSES,new Date('2026-11-06T23:30:00Z')),{id:'dl-1',kind:'current'});
 assert.deepEqual(roadmapPosition(COURSES,new Date('2026-11-15T12:00:00Z')),{id:'dl-4',kind:'ended'});
});
test('consultar el mapa no modifica datos, horarios ni apertura de materiales',()=>{
 const copy=structuredClone(COURSES),before=JSON.stringify(copy);
 roadmapMeetings(copy);roadmapPosition(copy,new Date('2026-10-24T14:00:00Z'));
 assert.equal(JSON.stringify(copy),before);
});
