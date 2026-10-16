import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TOOLS,TOOL_GROUPS,filterTools} from '../docs/tools-catalog.js';
import {TOOL_LOGOS} from '../docs/tools-logos.js';
test('El catálogo permite encontrar herramientas por tarea sin depender de mayúsculas o tildes',()=>{
 const names=filterTools('BUSQUEDA SEMANTICA').map(t=>t.id);
 assert.ok(names.includes('qdrant'));assert.ok(names.includes('cohere'));assert.deepEqual(names,filterTools('búsqueda semántica').map(t=>t.id));
});
test('Las categorías aíslan las herramientas según su uso y se combinan con la búsqueda',()=>{
 for(const group of Object.keys(TOOL_GROUPS)){const matches=filterTools('',group);assert.ok(matches.length);assert.ok(matches.every(t=>t.group===group))}
 assert.deepEqual(filterTools('n8n','automation').map(t=>t.id),['n8n']);assert.equal(filterTools('n8n','study').length,0);
});
test('La búsqueda encuentra palabras distribuidas entre nombre, función y etiquetas',()=>{
 assert.ok(filterTools('python navegador').some(t=>t.id==='colab'));assert.ok(filterTools('voz narración').some(t=>t.id==='elevenlabs'));
 assert.equal(filterTools('herramienta-inexistente-123').length,0);assert.equal(filterTools('').length,TOOLS.length);
});
test('Todos los recursos tienen un logo local procedente de la fuente oficial registrada',()=>{
 const sources=JSON.parse(fs.readFileSync(new URL('../docs/assets/tool-logos/sources.json',import.meta.url)));
 assert.equal(new Set(TOOLS.map(t=>t.id)).size,TOOLS.length);
 for(const t of TOOLS){assert.ok(TOOL_LOGOS[t.id]);assert.ok(fs.statSync(new URL('../docs/'+TOOL_LOGOS[t.id],import.meta.url)).size>50);const source=sources.find(s=>s.id===t.id);assert.ok(source?.source.startsWith('https://'));assert.equal(new URL(t.url).protocol,'https:');assert.equal(new URL(t.guide).protocol,'https:')}
});
