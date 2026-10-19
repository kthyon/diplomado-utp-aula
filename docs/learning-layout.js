import {renderConceptConnections} from './concept-connections.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const CLASS_PURPOSES={
  "ml": [
    "Entender cómo se aprende una regla desde ejemplos, distinguir entrenamiento de predicción y evaluar una cantidad en casos reservados.",
    "Distinguir puntuación, categoría y realidad; explicar cada tipo de error y elegir una regla de alertas con validación.",
    "Diferenciar agrupar registros, resumir variables y combinar modelos; interpretar qué aporta y qué no demuestra cada método.",
    "Respetar el tiempo al pronosticar, distinguir predicción de aprendizaje por interacción y justificar el alcance de un prototipo."
  ],
  "dl": [
    "Explicar cómo una red transforma entradas en salidas y cómo la pérdida guía el ajuste; distinguir parámetros, activación y tasa de aprendizaje.",
    "Relacionar píxeles, filtros y representaciones con la salida visual requerida; distinguir inferencia, transferencia y ajuste fino.",
    "Explicar orden, estado y representación vectorial; seguir una mezcla por atención y ubicarla dentro de un Transformer.",
    "Distinguir puntuación de detección y coincidencia espacial; evaluar errores y justificar una política de revisión con costes explícitos."
  ]
};
export function renderLearningGuide(l){
  const g=l.guide,c=g.case;
  const table=c.columns?.length&&c.rows?.length?`<div class="learning-table-wrap"><table class="learning-table"><caption>${esc(c.title)}</caption><thead><tr>${c.columns.map(t=>`<th scope="col">${esc(t)}</th>`).join('')}</tr></thead><tbody>${c.rows.map(row=>`<tr>${row.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
  return `<section class="panel learning-goal"><span class="eyebrow">LO QUE VAS A PODER HACER</span><h2>${esc(g.objective)}</h2><p><b>De dónde venimos:</b> ${esc(g.prerequisite||g.relevance)}</p><p><b>Vas a construir:</b> ${esc(g.build.title)}.</p></section>
    <section class="panel learning-concepts"><div class="eyebrow">01 · CONCEPTO</div><h2>Qué es, cómo funciona y para qué sirve</h2><p class="concept-intro">${esc(g.concept)}</p><dl class="concept-glossary">${g.vocabulary.map(v=>`<div><dt>${esc(v.term)}</dt><dd>${esc(v.meaning)}</dd></div>`).join('')}</dl><details class="concept-depth"><summary>Profundizar el concepto</summary><p>${esc(l.concept)}</p></details></section>
    <section class="panel worked-case"><div class="eyebrow">02 · EJEMPLO RESUELTO</div><h2>${esc(c.title)}</h2><p class="case-question"><b>${esc(c.question)}</b></p><p>${esc(c.context)}</p>${table}
    <h3>Resolvamos el caso</h3><ol class="worked-steps">${c.reasoning.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
    ${c.stages?.length?`<ol class="learning-stages">${c.stages.map(s=>`<li><b>${esc(s.title)}</b><span>${esc(s.detail)}</span></li>`).join('')}</ol>`:''}
    <div class="learning-result"><b>Qué podemos concluir</b><p>${esc(c.conclusion)}</p></div><p class="learning-takeaway"><b>Para recordar:</b> ${esc(g.takeaway)}</p>${g.understanding?`<details class="expected-result"><summary>Comprueba si lo entendiste: ${esc(g.understanding.question)}</summary><p>${esc(g.understanding.answer)}</p></details>`:''}</section>${renderConceptConnections(l.id)}`;
}
export function renderLearningLab(l,notebooks,notes=''){
  const g=l.guide,b=g.build;
  return `<section class="guided-exploration"><div class="exploration-prompt"><div class="eyebrow">03 · LABORATORIO GUIADO</div><h2>${esc(b.title)}</h2><h3>Prueba primero con el ejemplo</h3><p>${esc(g.lab.instruction)}</p><p><b>Qué observar:</b> ${esc(g.lab.watch)}</p></div>${l.sim?'<div id="lesson-sim"></div>':''}<details class="expected-result"><summary>Comprobar el ejemplo</summary><p>${esc(g.lab.expected)}</p></details><section class="panel notebook-lab"><h3>Construye tu solución</h3><p>${esc(g.lab.notebookGuide)}</p><p class="field-note">Crea una copia personal antes de ejecutar o modificar el cuaderno. Puedes registrar tus tablas y decisiones en el cuaderno o en tu bitácora.</p>${notebooks}<ol class="worked-steps build-steps">${b.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><div class="learning-result build-check"><h4>Comprueba tu construcción</h4><p>${esc(b.check)}</p></div><details class="practice-transfer"><summary>Aplícalo a otra operación</summary><p>${esc(b.transfer)}</p></details><details class="practice-transfer"><summary>Un paso más con código</summary><p>${esc(b.stretch)}</p></details>${notes}</section><p class="learning-bridge"><b>La siguiente conexión:</b> ${esc(g.next)}</p></section>`;
}
export const COURSE_GUIDES={
  ml:{
    question:'¿Cómo aprendemos una regla con datos y comprobamos si ayuda a tomar una decisión?',
    context:'Usaremos casos de agronegocios con datos simulados. Rendimiento, plagas, agrupaciones y series responden a preguntas diferentes: sus métodos no son intercambiables. Cada ejemplo permite estudiar una parte del proceso.',
    terms:[
      ['Aprendizaje supervisado','Aprende usando entradas y respuestas conocidas: regresión estima cantidades y clasificación asigna categorías.'],
      ['Aprendizaje no supervisado','Explora entradas sin etiquetas de respuesta: clustering agrupa registros y PCA resume variables.'],
      ['Aprendizaje por refuerzo','Aprende a elegir acciones por sus consecuencias y recompensas al interactuar con un entorno.'],
      ['Entrenamiento → validación → prueba','Entrenamiento ajusta; validación ayuda a elegir configuraciones; prueba estima el desempeño final. Las divisiones deben respetar tiempo, grupos y condiciones del uso.']
    ],
    route:[
      ['1 · Datos y predicción','Pregunta → variables → preparación → regla → error. Comprender antes de comparar algoritmos.'],
      ['2 · Categorías y decisiones','Puntuación → umbral → alertas → errores. Detectar bien y decidir bien son preguntas relacionadas.'],
      ['3 · Tres herramientas distintas','Clustering agrupa filas; PCA representa columnas; ensambles combinan predicciones. Cada una necesita su propia interpretación.'],
      ['4 · Tiempo e interacción','Series anticipa periodos; refuerzo aprende acciones. Integramos los métodos que responden a la pregunta elegida.']
    ],
    bridge:'Deep Learning conserva estos fundamentos y cambia la forma de representar y transformar los datos mediante redes de capas.'
  },
  dl:{
    question:'¿Cómo aprende una red representaciones y cómo verificamos que su salida sirve para la tarea?',
    context:'Deep Learning pertenece a Machine Learning. Conservamos preparación, separación de datos, validación y evaluación; estudiamos capas que aprenden representaciones de imágenes y secuencias. Más capas no garantizan mejores resultados.',
    terms:[
      ['Dato → representación → salida','Una imagen o secuencia se convierte en números; las capas transforman esos números y una salida responde a la tarea.'],
      ['Arquitectura, parámetros e hiperparámetros','La arquitectura organiza capas; pesos y sesgos se aprenden; tasa de aprendizaje y tamaños de capas son configuraciones elegidas durante el desarrollo.'],
      ['Inferencia y entrenamiento','Inferencia calcula una salida con parámetros actuales. Entrenamiento usa una pérdida y gradientes para actualizarlos. Una animación con valores fijos ilustra operaciones.'],
      ['Generalización','Aprender no es memorizar el entrenamiento: revisamos validación y prueba con datos representativos y evitamos que imágenes o secuencias relacionadas crucen divisiones.']
    ],
    route:[
      ['1 · Una red que aprende','Entradas → neurona → activación → pérdida → actualización. Primero entendemos el ciclo completo.'],
      ['2 · Representaciones visuales','Píxeles → filtros → mapas → salida de la tarea. Después decidimos qué reutilizar de un modelo previo.'],
      ['3 · Orden y contexto','Secuencia → estado o atención → representación contextual → salida. Atención es parte de una arquitectura.'],
      ['4 · Detección y uso','Caja y puntuación → coincidencia → errores → decisión. Una detección conservada todavía necesita comprobarse.']
    ],
    bridge:'Al cerrar, debes poder explicar qué entra, qué se aprende, qué sale, cómo se comprueba y cuándo la evidencia todavía no basta para usarlo.'
  }
};
export function renderCourseGuide(id){
  const g=COURSE_GUIDES[id];if(!g)return '';
  return `<section class="panel learning-concepts course-concepts"><span class="eyebrow">EL HILO DE LA ASIGNATURA</span><h2>${esc(g.question)}</h2><p class="concept-intro">${esc(g.context)}</p><details class="concept-depth"><summary>Las ideas que conectan todas las clases</summary><dl class="concept-glossary">${g.terms.map(([t,d])=>`<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl></details><h3>Cómo avanza la comprensión</h3><ol class="learning-stages" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))">${g.route.map(([t,d])=>`<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ol><p class="learning-takeaway">${esc(g.bridge)}</p></section>`;
}
