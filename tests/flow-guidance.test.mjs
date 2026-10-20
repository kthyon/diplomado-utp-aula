import test from 'node:test';
import assert from 'node:assert/strict';
import {renderFlowGuide,renderLessonFlow} from '../docs/flow-guidance.js';

test('la orientación distingue guardado local, registro y asistencia sin imponer entregas',()=>{
 const html=renderFlowGuide();
 assert.equal((html.match(/<li>/g)||[]).length,5);
 assert.match(html,/este navegador/);assert.match(html,/registro conectado/);
 assert.match(html,/No comprueba asistencia/);
 for(const label of ['Práctica guiada del tema','Explora una idea','Laboratorio visual'])assert.ok(html.includes(label));
 assert.match(html,/no son entregas obligatorias/);
});

test('la posición convierte índices desde cero y conserva la copia compartida de Colab',()=>{
 const html=renderLessonFlow({courseId:'ml',courseTitle:'Machine Learning',classIndex:3,topicIndex:2,topicCount:3});
 assert.match(html,/#curso\/ml/);assert.match(html,/Encuentro 4/);assert.match(html,/Tema 3 de 3/);
 assert.match(html,/reutiliza esa copia/);assert.match(html,/bloque señalado/);
 assert.match(html,/no asistencia/);
});

test('los nombres de asignatura se escapan y las rutas se limitan a módulos conocidos',()=>{
 const html=renderLessonFlow({courseId:'"><script>',courseTitle:'<img onerror="x">',classIndex:-1,topicIndex:NaN});
 assert.ok(!html.includes('<img'));assert.ok(!html.includes('<script>'));assert.ok(!html.includes('href='));
 assert.match(html,/&lt;img/);assert.ok(!html.includes('Encuentro 0'));assert.ok(!html.includes('NaN'));
 assert.ok(!renderLessonFlow().includes('undefined'));
});
