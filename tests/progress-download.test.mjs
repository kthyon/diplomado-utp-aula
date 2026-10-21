import test from 'node:test';
import assert from 'node:assert/strict';
import {offerProgressDownload} from '../docs/progress-download.js';

test('la copia conserva nombre, notas y avance y ofrece un enlace nativo antes de iniciar la descarga',async()=>{
 const progress={name:'Estudiante Pruebas',completed:['ml-problema'],notes:{'ml-problema':'Resultado sintético'}},events=[],timers=[],blobs=[];
 const host={append:a=>events.push(['append',a])};
 const anchor={click(){events.push(['click',this])},remove(){events.push(['remove',this])}};
 const documentRef={querySelector:s=>s==='#transfer-status'?host:null,createElement:()=>anchor};
 const urlAPI={createObjectURL:b=>{blobs.push(b);return 'blob:test-copy'},revokeObjectURL:u=>events.push(['revoke',u])};
 const link=offerProgressDownload(progress,{documentRef,urlAPI,timer:(fn,ms)=>timers.push({fn,ms})});
 assert.equal(link,anchor);assert.equal(link.download,'mi-progreso-utp.json');assert.match(link.textContent,/Guardar/);
 assert.equal(events[0][0],'append');assert.equal(events[1][0],'click');
 assert.deepEqual(JSON.parse(await blobs[0].text()),progress);assert.equal(timers[0].ms,60000);
 assert.equal(events.some(e=>e[0]==='revoke'),false);timers[0].fn();assert.equal(events.at(-1)[0],'revoke');
});
