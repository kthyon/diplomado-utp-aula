import test from 'node:test';
import assert from 'node:assert/strict';
import {DL_FOUNDATIONS,activationComposition,renderDLPrerequisites,renderDLReason,renderDLCheck} from '../docs/dl-foundations.js';
import {neuronFigure,convolutionFigure} from '../docs/dl-figures.js';
import {neuronExample,convolutionExample} from '../docs/dl-example-models.js';
import {initialNetwork,trainEpoch,meanLoss} from '../docs/lab-clear-models.js';
import {networkCohort} from '../docs/dl-lab-evidence.js';
import {COURSES} from '../docs/content.js';

test('la composición sin activación se cancela; ReLU representa el valor absoluto en ambos signos',()=>{
 for(let x=-3;x<=3;x+=.5){assert.equal(activationComposition(x,false).output,0);assert.equal(activationComposition(x,true).output,Math.abs(x));}
 assert.deepEqual(activationComposition(-2),{x:-2,first:0,second:2,output:2});
});
test('los doce temas DL ofrecen definiciones previas, razón y transferencia sin añadir paneles a ML',()=>{
 assert.deepEqual(Object.keys(DL_FOUNDATIONS),COURSES.dl.classes.flatMap(c=>c.topics));
 for(const id of Object.keys(DL_FOUNDATIONS)){assert.match(renderDLPrerequisites(id),/<dl/);assert.match(renderDLReason(id),/<figure/);assert.match(renderDLCheck(id),/Comparar mi razonamiento/);}
 for(const id of COURSES.ml.classes.flatMap(c=>c.topics)){assert.equal(renderDLPrerequisites(id)+renderDLReason(id)+renderDLCheck(id),'');}
});
test('las cifras de los gráficos de neurona y ventana provienen del cálculo actual',()=>{
 const r=neuronExample({bias:-.5});assert.match(neuronFigure(r),/suma -0.5, salida ReLU 0/);
 const c=convolutionExample({row:2,column:1});assert.match(convolutionFigure(c),/Ventana desde fila 3, columna 2; respuesta 0/);
});
test('la comparación de ocho mensajes conserva el inicio y usa la pérdida de los pesos actuales',()=>{
 const initial=initialNetwork();let trained=initialNetwork();for(let i=0;i<20;i++)trained=trainEpoch(trained);
 assert.ok(meanLoss(trained)<meanLoss(initial));const html=networkCohort(trained,initial);
 assert.equal((html.match(/<tr><th>M\d/g)||[]).length,8);assert.match(html,/no mide mensajes nuevos/);
});
