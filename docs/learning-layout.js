import {renderConceptConnections} from './concept-connections.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const CLASS_PURPOSES={
  ml:[
    'Construir una tabla de predicciones: pregunta operativa, datos preparados, referencia y error sobre casos reservados.',
    'Construir una lista de revisión con una regla de alertas, un reporte de errores y una capacidad de atención definida.',
    'Crear un mapa exploratorio de registros y una tabla de modelos comparables para elegir qué seguir probando.',
    'Producir un pronóstico con fecha de corte, probar una secuencia de acciones y reunir un prototipo ML reproducible.'
  ],
  dl:[
    'Construir y comprobar los cálculos de una neurona, sus activaciones y el ajuste de un parámetro.',
    'Definir una tarea visual, producir un mapa de filtro y probar si un detector existente cubre la necesidad.',
    'Crear registros de estados, comprobar una mezcla por atención y construir pruebas de secuencias con respuestas conocidas.',
    'Construir un registro de detecciones, una prueba de cajas y una política de revisión con costes explícitos.'
  ]
};
export function renderLearningGuide(l){
  const g=l.guide,c=g.case;
  const table=c.columns?.length&&c.rows?.length?`<div class="learning-table-wrap"><table class="learning-table"><caption>${esc(c.title)}</caption><thead><tr>${c.columns.map(t=>`<th scope="col">${esc(t)}</th>`).join('')}</tr></thead><tbody>${c.rows.map(row=>`<tr>${row.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
  return `<section class="panel learning-goal"><span class="eyebrow">LO QUE VAS A PODER HACER</span><h2>${esc(g.objective)}</h2><p><b>Vas a construir:</b> ${esc(g.build.title)}.</p></section>
    <section class="panel learning-concepts"><div class="eyebrow">01 · CONCEPTO</div><p class="concept-intro">${esc(g.concept)}</p><dl class="concept-glossary">${g.vocabulary.map(v=>`<div><dt>${esc(v.term)}</dt><dd>${esc(v.meaning)}</dd></div>`).join('')}</dl><details class="concept-depth"><summary>Profundizar el concepto</summary><p>${esc(l.concept)}</p></details></section>
    <section class="panel worked-case"><div class="eyebrow">02 · EJEMPLO RESUELTO</div><h2>${esc(c.title)}</h2><p class="case-question"><b>${esc(c.question)}</b></p><p>${esc(c.context)}</p>${table}
    <h3>Resolvamos el caso</h3><ol class="worked-steps">${c.reasoning.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
    ${c.stages?.length?`<ol class="learning-stages">${c.stages.map(s=>`<li><b>${esc(s.title)}</b><span>${esc(s.detail)}</span></li>`).join('')}</ol>`:''}
    <div class="learning-result"><b>Qué podemos concluir</b><p>${esc(c.conclusion)}</p></div><p class="learning-takeaway"><b>Para recordar:</b> ${esc(g.takeaway)}</p></section>${renderConceptConnections(l.id)}`;
}
export function renderLearningLab(l,notebooks,notes=''){
  const g=l.guide,b=g.build;
  return `<section class="guided-exploration"><div class="exploration-prompt"><div class="eyebrow">03 · LABORATORIO GUIADO</div><h2>${esc(b.title)}</h2><h3>Prueba primero con el ejemplo</h3><p>${esc(g.lab.instruction)}</p><p><b>Qué observar:</b> ${esc(g.lab.watch)}</p></div>${l.sim?'<div id="lesson-sim"></div>':''}<details class="expected-result"><summary>Comprobar el ejemplo</summary><p>${esc(g.lab.expected)}</p></details><section class="panel notebook-lab"><h3>Construye tu solución</h3><p>${esc(g.lab.notebookGuide)}</p><p class="field-note">Crea una copia personal antes de ejecutar o modificar el cuaderno. Puedes registrar tus tablas y decisiones en el cuaderno o en tu bitácora.</p>${notebooks}<ol class="worked-steps build-steps">${b.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><div class="learning-result build-check"><h4>Comprueba tu construcción</h4><p>${esc(b.check)}</p></div><details class="practice-transfer"><summary>Aplícalo a otra operación</summary><p>${esc(b.transfer)}</p></details><details class="practice-transfer"><summary>Un paso más con código</summary><p>${esc(b.stretch)}</p></details>${notes}</section><p class="learning-bridge"><b>La siguiente conexión:</b> ${esc(g.next)}</p></section>`;
}
