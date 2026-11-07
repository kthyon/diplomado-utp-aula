import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderDLExtraResources,renderDLTopicExtraResource} from '../docs/dl-extra-resources.js';

const resource=fs.readFileSync(new URL('../docs/recursos/dl-encuentro-2/index.html',import.meta.url),'utf8');

test('el recurso adicional aparece únicamente en DL Encuentro 2',()=>{
 const html=renderDLExtraResources('dl',1);
 assert.match(html,/Abrir apoyo visual del Encuentro 2/);
 assert.match(html,/href="recursos\/dl-encuentro-2\/#ejemplo-4"/);
 for(const course of ['ml','dl'])for(const index of [0,1,2,3])if(course!=='dl'||index!==1)assert.equal(renderDLExtraResources(course,index),'');
});

test('los tres temas abren su ejemplo y conservan rutas relativas',()=>{
 for(const [id,example] of [['dl-vision',1],['dl-cnn',4],['dl-transferencia',7]])assert.match(renderDLTopicExtraResource(id),new RegExp('recursos/dl-encuentro-2/#ejemplo-'+example));
 for(const id of ['dl-secuencias','ml-regresion','dl-integracion'])assert.equal(renderDLTopicExtraResource(id),'');
 assert.doesNotMatch(resource,/127\.0\.0\.1|localhost|file:\/\/\//);
 const returnHref=resource.match(/class="resourceBack" href="([^"]+)"/)?.[1];
 assert.equal(returnHref,'../../#curso/dl/2');
 assert.equal(new URL(returnHref,'https://aula.test/aula/recursos/dl-encuentro-2/').href,'https://aula.test/aula/#curso/dl/2');
 assert.equal(new URL(returnHref,'https://kthyon.github.io/diplomado-utp-aula/recursos/dl-encuentro-2/').href,'https://kthyon.github.io/diplomado-utp-aula/#curso/dl/2');
});

test('la copia conserva nueve ejemplos y comprueba el acceso existente del aula',()=>{
 assert.match(resource,/const route=\[0,5,6,1,2,3,4,7,8\]/);
 for(const topic of ['Subtema 1 · Visión artificial','Subtema 2 · Redes convolucionales (CNN)','Subtema 3 · Transferencia de aprendizaje'])assert.ok(resource.includes(topic));
 assert.match(resource,/checkLabAccess/);
 assert.match(resource,/from '\.\.\/\.\.\/lab-access\.js'/);
 assert.match(resource,/<main hidden data-resource-main>/);
 assert.match(resource,/Volver al Encuentro 2/);
 assert.match(resource,/data:image\/jpeg;base64,/);
 assert.doesNotMatch(resource,/localStorage\.setItem|saveStudentProgress|\/api\/(?:register|progress)/);
});
