import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES} from '../docs/content.js';
import {summarizeProgress,renderProgressDashboard} from '../docs/progress-dashboard.js';
test('progress counts unique known topics, partial meetings and both subjects without attendance assumptions',()=>{
 const s=summarizeProgress(COURSES,['ml-problema','ml-problema','unknown'],'2026-10-24');
 assert.equal(s.seen,1);assert.equal(s.total,24);assert.equal(s.percent,4.2);assert.equal(s.completedClasses,0);
 assert.equal(s.subjects[0].percent,8.3);assert.equal(s.subjects[0].classes[0].percent,33.3);
 assert.equal(s.subjects[0].classes[1].open,true);assert.equal(s.subjects[1].classes[0].open,false);
 assert.equal(summarizeProgress(COURSES,[],'2027-01-01').percent,0);
});
test('one complete meeting contributes 12.5 percent and a complete subject 50 percent',()=>{
 const first=COURSES.ml.classes[0].topics;
 const s=summarizeProgress(COURSES,first);assert.equal(s.percent,12.5);assert.equal(s.completedClasses,1);assert.equal(s.subjects[0].classes[0].percent,100);
 const ml=COURSES.ml.classes.flatMap(c=>c.topics);assert.equal(summarizeProgress(COURSES,ml).percent,50);
 const all=Object.values(COURSES).flatMap(c=>c.classes.flatMap(c=>c.topics));const full=summarizeProgress(COURSES,all);assert.equal(full.percent,100);assert.equal(full.completedClasses,8);
 const html=renderProgressDashboard(s);assert.match(html,/aria-valuenow="12.5"/);assert.match(html,/no registra asistencia/);
});
