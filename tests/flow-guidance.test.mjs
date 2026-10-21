import test from 'node:test';
import assert from 'node:assert/strict';
import {getWelcome,renderFlowGuide,renderLessonFlow} from '../docs/flow-guidance.js';

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

test('el saludo es cercano, usa el nombre de pila y no depende de la hora',()=>{
 for(const hour of [0,5,11,12,17,18,23]){
  assert.equal(getWelcome({name:'Cristian Alvarado',now:new Date(2026,9,20,hour)}).heading,'¡Hola, Cristian!');
 }
 assert.equal(getWelcome({name:'Ing. Cristian Alvarado'}).heading,'¡Hola, Cristian!');
 assert.equal(getWelcome({name:''}).heading,'¡Hola!');
 assert.notEqual(getWelcome({name:'Ana',variant:0}).heading,getWelcome({name:'Ana',variant:1}).heading);
});

test('la bienvenida varía sin perder instrucciones opcionales y escapa el nombre',()=>{
 const options={name:'Ana Gómez',now:new Date(2026,9,20,14),variant:1};
 assert.deepEqual(getWelcome(options),getWelcome(options));
 assert.notEqual(getWelcome({...options,variant:0}).message,getWelcome(options).message);
 const html=renderFlowGuide({name:'<img src=x onerror=alert(1)>',now:options.now});
 assert.ok(!html.includes('<img'));assert.match(html,/&lt;img/);
 assert.match(html,/<details class="welcome-help"><summary>¿Necesitas una mano para empezar/);
 assert.ok(!html.includes('Cómo usar tu aula'));
 assert.ok(!html.includes('¿Qué te gustaría explorar hoy?'));
 assert.ok(!html.includes('¿Por dónde empezamos?'));
});
