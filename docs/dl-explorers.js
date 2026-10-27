import { neuronExample, convolutionExample, sequenceState, attentionExample, detectionExample } from './dl-example-models.js';

const fmt = (value, digits = 4) => Number(value).toLocaleString('es-CO', { maximumFractionDigits: digits });
const tuple = values => '[' + values.map(value => fmt(value)).join(', ') + ']';
let explorerCount = 0;

// Keep numeric columns readable; scroll only a wide table, never the entire lesson.
function readableTables(html) {
  return html.replace(/<table class="(dl-table|dl-matrix)">([\s\S]*?)<\/table>/g, (table, _, body) => {
    const caption = body.match(/<caption>([^<]*)<\/caption>/)?.[1] || 'Detalle del cálculo';
    return `<div class="dl-table-scroll" role="region" tabindex="0" aria-label="${caption}. Tabla con desplazamiento horizontal si no cabe.">${table}</div>`;
  });
}

function matrix(values, caption, { active = () => false, cell = value => fmt(value) } = {}) {
  return `<table class="dl-matrix"><caption>${caption}</caption><thead><tr><th scope="col">Fila</th>${values[0].map((_, column) => `<th scope="col">${column + 1}</th>`).join('')}</tr></thead><tbody>${values.map((row, r) => `<tr><th scope="row">${r + 1}</th>${row.map((value, c) => `<td class="${active(r, c) ? 'dl-selected-cell' : ''}">${cell(value, r, c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function createShell(el, type, title, controls, caption) {
  const prefix = `dl-${type}-${++explorerCount}`;
  const range = (key, label, min, max, step, value, unit = '') => `<label class="dl-range" for="${prefix}-${key}"><span>${label}<output data-output="${key}" for="${prefix}-${key}"></output></span><input id="${prefix}-${key}" data-field="${key}" data-unit="${unit}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${label}"></label>`;
  const select = (key, label, options, value) => `<label class="dl-select" for="${prefix}-${key}">${label}<select id="${prefix}-${key}" data-field="${key}">${options.map(([id, name]) => `<option value="${id}" ${id === value ? 'selected' : ''}>${name}</option>`).join('')}</select></label>`;
  el.innerHTML = `<section class="simulator dl-explorer dl-${type}" aria-labelledby="${prefix}-title"><div class="sim-header"><h3 id="${prefix}-title">${title}</h3><span class="pill">EJEMPLO CALCULADO</span></div><div class="sim-grid"><aside class="controls" aria-label="Controles: ${title}">${controls({ range, select })}<p class="dl-status" data-status role="status" aria-live="polite" aria-atomic="true"></p></aside><div class="dl-visual"><p class="dl-scroll-hint">Si una tabla no cabe, deslízala para consultar todas sus columnas.</p><div data-visual></div></div></div><p class="sim-caption">${caption}</p></section>`;
  const q = selector => el.querySelector(selector);
  const field = key => q(`[data-field="${key}"]`);
  const number = key => Number(field(key).value);
  const visual = html => { q('[data-visual]').innerHTML = readableTables(html); };
  const renderedValues = new WeakMap();
  const sync = () => el.querySelectorAll('input[type="range"][data-field]').forEach(input => {
    const text = fmt(Number(input.value)) + (input.dataset.unit ? ' ' + input.dataset.unit : '');
    q(`[data-output="${input.dataset.field}"]`).textContent = text;
    input.setAttribute('aria-valuetext', text);
  });
  const bind = draw => {
    el.querySelectorAll('[data-field]').forEach(input => {
      renderedValues.set(input, input.value);
      const update = () => { if (input.value === renderedValues.get(input)) return; renderedValues.set(input, input.value); sync(); draw(); };
      input.addEventListener('input', update);
      input.addEventListener('change', update);
    });
    sync();
    draw();
  };
  const restore = (values, draw) => {
    for (const [key, value] of Object.entries(values)) { field(key).value = value; renderedValues.set(field(key), field(key).value); }
    sync();
    draw();
  };
  return { q, field, number, visual, sync, bind, restore };
}

const metric = (label, value) => `<div class="metric"><small>${label}</small><strong>${value}</strong></div>`;
const reset = '<button type="button" class="button secondary small" data-reset>Restablecer ejemplo</button>';
const weightFigure = result => `<figure class="dl-weight-figure"><figcaption>Cómo reparte la atención esta consulta</figcaption>${result.weights.map((weight, index) => `<div class="dl-value-bar"><span>Fuente ${index ? 'B' : 'A'}</span><span class="dl-value-track" aria-hidden="true"><i style="width:${weight * 100}%"></i></span><b>${fmt(weight * 100, 1)} %</b></div>`).join('')}<p class="dl-note">Los dos pesos suman 100 %. La salida combina 10 y 20 según este reparto; no elige una categoría.</p></figure>`;
const stateFigure = (result, steps) => `<figure class="dl-state-figure"><figcaption>Estado acumulado · misma escala de 0 a 30</figcaption>${[{index:0,state:result.initial},...result.steps.slice(0, steps)].map(item => `<div class="dl-value-bar"><span>s${item.index}</span><span class="dl-value-track" aria-hidden="true"><i style="width:${item.state / 30 * 100}%"></i></span><b>${fmt(item.state, 2)}</b></div>`).join('')}</figure>`;

function neuron(el) {
  const defaults = { x1: 2, x2: 1, w1: .5, w2: -1, bias: .5 };
  const shell = createShell(el, 'neuron', 'De dos entradas a una salida', ({ range }) =>
    range('x1', 'Entrada x₁', 0, 4, .5, defaults.x1) + range('x2', 'Entrada x₂', 0, 4, .5, defaults.x2) +
    range('w1', 'Peso w₁', -2, 2, .5, defaults.w1) + range('w2', 'Peso w₂', -2, 2, .5, defaults.w2) +
    range('bias', 'Sesgo b', -2, 2, .5, defaults.bias) + reset,
  'Entradas y parámetros fijados a mano, sin unidades físicas. Multiplicamos cada entrada por su peso, añadimos el sesgo y aplicamos ReLU. Mover un control no entrena una red; permite seguir el cálculo de una neurona.');
  const { q, number, visual } = shell;
  const draw = () => {
    const result = neuronExample({ inputs: [number('x1'), number('x2')], weights: [number('w1'), number('w2')], bias: number('bias') });
    visual(`<div class="dl-operation"><span class="eyebrow">1 · COMBINAR ENTRADAS</span><table class="dl-table"><caption>Cada entrada tiene su propio peso</caption><thead><tr><th scope="col">Entrada</th><th scope="col">Valor x</th><th scope="col">Peso w</th><th scope="col">Producto x × w</th></tr></thead><tbody>${result.inputs.map((input, index) => `<tr><th scope="row">x${index + 1}</th><td>${fmt(input)}</td><td>${fmt(result.weights[index])}</td><td>${fmt(result.products[index])}</td></tr>`).join('')}</tbody></table></div><div class="dl-operation"><span class="eyebrow">2 · AÑADIR EL SESGO</span><p class="dl-equation">z = (${fmt(result.inputs[0])} × ${fmt(result.weights[0])}) + (${fmt(result.inputs[1])} × ${fmt(result.weights[1])}) + (${fmt(result.bias)}) = <b>${fmt(result.sum)}</b></p></div><div class="dl-operation"><span class="eyebrow">3 · APLICAR RELU</span><p class="dl-equation">ReLU(z) = máximo(0, ${fmt(result.sum)}) = <b>${fmt(result.output)}</b></p><div class="dl-metrics">${metric('Suma z', fmt(result.sum))}${metric('Salida ReLU', fmt(result.output))}</div></div>`);
    q('[data-status]').textContent = `La suma es ${fmt(result.sum)}. ${result.sum < 0 ? 'Como es negativa, ReLU devuelve cero.' : 'Como no es negativa, ReLU conserva ese valor.'} Salida ${fmt(result.output)}.`;
  };
  shell.bind(draw);
  q('[data-reset]').onclick = () => shell.restore(defaults, draw);
}

function convolution(el) {
  const defaults = { filter: 'horizontal', row: 1, column: 1 };
  const shell = createShell(el, 'convolution', 'Una ventana, nueve productos y una suma', ({ range, select }) =>
    select('filter', 'Filtro', [['horizontal', 'Horizontal'], ['average', 'Promedio']], defaults.filter) +
    range('row', 'Fila de la ventana', 1, 3, 1, defaults.row) + range('column', 'Columna de la ventana', 1, 3, 1, defaults.column) + reset,
  'Imagen inventada de 5 × 5: 0 es oscuro y 1 es claro. Aplicamos un filtro fijo de 3 × 3, sin invertirlo, con paso 1 y sin relleno: resulta un mapa de 3 × 3. La ventana marcada usa la fila y columna de su esquina superior izquierda. Aquí calculamos una operación; no aprendemos filtros ni ejecutamos una CNN entrenada.');
  const { q, number, field, visual } = shell;
  const draw = () => {
    const result = convolutionExample({ filter: field('filter').value, row: number('row') - 1, column: number('column') - 1 });
    const average = result.filter === 'average', coefficient = value => average ? '1/9' : fmt(value);
    const product = value => average && value !== 0 ? '1/9' : fmt(value);
    visual(`<div class="dl-matrix-grid">${matrix(result.input, 'Entrada 5 × 5 · ventana sombreada', { active: (r, c) => r >= result.row && r < result.row + 3 && c >= result.column && c < result.column + 3 })}${matrix(result.kernel, average ? 'Filtro promedio · cada valor es 1/9' : 'Filtro de cambio horizontal', { cell: coefficient })}</div><div class="dl-operation"><span class="eyebrow">PRODUCTO POR POSICIÓN</span>${matrix(result.products, 'Los nueve productos de la ventana', { cell: (value, r, c) => `${fmt(result.window[r][c])} × (${coefficient(result.kernel[r][c])}) = ${product(value)}` })}<p class="dl-equation">Suma = ${result.products.flat().map(product).join(' + ')} = <b>${fmt(result.value)}</b></p></div>${matrix(result.map, `Mapa de respuestas 3 × 3 · celda marcada (${number('row')}, ${number('column')})`, { active: (r, c) => r === result.row && c === result.column })}<div class="dl-metrics">${metric('Respuesta de esta ventana', fmt(result.value))}</div><p class="dl-note">${average ? 'El promedio conserva el nivel medio de los nueve píxeles.' : 'Este filtro resta la fila superior de la inferior: responde al cambio de oscuro a claro entre ambas.'} Los cálculos conservan su precisión; las cifras decimales se muestran redondeadas.</p>`);
    q('[data-status]').textContent = `Ventana desde fila ${number('row')}, columna ${number('column')}. Filtro ${average ? 'promedio' : 'horizontal'}. La suma de sus nueve productos es ${fmt(result.value)}.`;
  };
  shell.bind(draw);
  q('[data-reset]').onclick = () => shell.restore(defaults, draw);
}

function sequence(el) {
  let visibleSteps = 0;
  const shell = createShell(el, 'sequence', 'El mismo conjunto, otro orden', ({ select }) =>
    select('order', 'Orden de la secuencia', [['ascending', 'Ascendente · 10 → 20 → 30'], ['descending', 'Descendente · 30 → 20 → 10']], 'ascending') +
    '<button type="button" class="button" data-step>Ver el siguiente paso</button><button type="button" class="button secondary small" data-reset>Reiniciar pasos</button>',
  'Valores inventados y sin unidades físicas. La regla fija sₜ = 0,5 × sₜ₋₁ + 0,5 × xₜ empieza en s₀ = 0. Combina el estado anterior con la entrada actual. No es una RNN o LSTM entrenada: permite comprobar cómo una regla con estado puede depender del orden.');
  const { q, field, visual } = shell;
  const draw = () => {
    const result = sequenceState(field('order').value === 'ascending' ? [10, 20, 30] : [30, 20, 10]);
    const step = visibleSteps ? result.steps[visibleSteps - 1] : null;
    visual(`<div class="dl-sequence-tokens" aria-label="Secuencia elegida">${result.inputs.map((input, index) => `<span class="${index < visibleSteps ? 'dl-token-seen' : ''}"><small>Posición ${index + 1}</small><b>${input}</b></span>`).join('<i aria-hidden="true">→</i>')}</div>${stateFigure(result, visibleSteps)}<p class="dl-equation">${step ? `s${step.index} = 0,5 × ${fmt(step.previous)} + 0,5 × ${fmt(step.input)} = <b>${fmt(step.state)}</b>` : 'Estado inicial: s₀ = 0. Antes del primer paso no hemos leído ningún valor.'}</p><table class="dl-table"><caption>Rastro del cálculo · ${visibleSteps} de 3 pasos visibles</caption><thead><tr><th scope="col">Paso</th><th scope="col">Entrada</th><th scope="col">Estado anterior</th><th scope="col">Estado nuevo</th></tr></thead><tbody>${result.steps.map((item, index) => `<tr><th scope="row">${item.index}</th><td>${item.input}</td><td>${index < visibleSteps ? fmt(item.previous) : 'Por calcular'}</td><td>${index < visibleSteps ? fmt(item.state) : 'Por calcular'}</td></tr>`).join('')}</tbody></table><div class="dl-metrics">${metric('Media de los tres valores', fmt(result.mean))}${metric('Estado actual', fmt(step ? step.state : result.initial))}${metric('Estado final', visibleSteps === 3 ? fmt(result.final) : 'Por calcular')}</div><p class="dl-note">${visibleSteps === 3 ? 'Ahora invierte el orden, recorre los pasos y compara: la media permanece en 20; el estado final puede cambiar.' : 'Antes de avanzar, anticipa cómo se combinarán el estado anterior y el siguiente valor.'}</p>`);
    q('[data-step]').disabled = visibleSteps === 3;
    q('[data-step]').textContent = visibleSteps === 3 ? 'Tres pasos visibles' : 'Ver el siguiente paso';
    q('[data-status]').textContent = step ? `Paso ${step.index}: estado anterior ${fmt(step.previous)}, entrada ${step.input}, estado nuevo ${fmt(step.state)}.${visibleSteps === 3 ? ' Secuencia terminada.' : ''}` : 'Estado reiniciado a cero. Puedes recorrer la secuencia paso a paso.';
  };
  q('[data-step]').onclick = () => { if (visibleSteps < 3) { visibleSteps++; draw(); } };
  q('[data-reset]').onclick = () => { visibleSteps = 0; draw(); };
  shell.bind(() => { visibleSteps = 0; draw(); });
}

function attention(el) {
  const shell = createShell(el, 'attention', 'De una consulta a una combinación de valores', ({ select }) =>
    select('query', 'Consulta Q', [['first', 'Q = [1, 0]'], ['second', 'Q = [0, 1]'], ['neutral', 'Q = [0, 0]']], 'first') + reset,
  'Consulta, claves y valores inventados y fijados a mano. Calculamos productos escalares, dividimos por √2, aplicamos softmax y combinamos los valores V. Los pesos suman 1, pero no prueban causalidad ni explican por sí solos una decisión. Este ejemplo ejecuta atención numérica; no entrena ni representa un Transformer completo.');
  const { q, field, visual } = shell;
  const draw = () => {
    const result = attentionExample(field('query').value);
    visual(`<p class="dl-equation">Consulta actual Q = <b>${tuple(result.query)}</b></p>${weightFigure(result)}<table class="dl-table"><caption>Fuentes fijas: cambiar Q no cambia K ni V</caption><thead><tr><th scope="col">Fuente</th><th scope="col">Clave K</th><th scope="col">Valor V</th></tr></thead><tbody>${result.keys.map((key, index) => `<tr><th scope="row">${index === 0 ? 'A' : 'B'}</th><td>${tuple(key)}</td><td>${result.values[index]}</td></tr>`).join('')}</tbody></table><div class="dl-operation"><span class="eyebrow">1 · COMPARAR Y ESCALAR</span><p class="dl-note">Para cada fuente: puntuación = (Q · K) / √2. Dividimos por √2 porque Q y K tienen dos componentes.</p><table class="dl-table"><caption>De la comparación a la contribución</caption><thead><tr><th scope="col">Fuente</th><th scope="col">Q · K</th><th scope="col">Puntuación escalada</th><th scope="col">Peso softmax</th><th scope="col">Peso × V</th></tr></thead><tbody>${result.keys.map((_, index) => `<tr><th scope="row">${index === 0 ? 'A' : 'B'}</th><td>${fmt(result.products[index])}</td><td>${fmt(result.logits[index])}</td><td>${fmt(result.weights[index])}</td><td>${fmt(result.contributions[index])}</td></tr>`).join('')}</tbody></table></div><div class="dl-operation"><span class="eyebrow">2 · NORMALIZAR CON SOFTMAX</span><p class="dl-equation">Peso de A = exp(${fmt(result.logits[0])}) / [exp(${fmt(result.logits[0])}) + exp(${fmt(result.logits[1])})] = <b>${fmt(result.weights[0])}</b></p><p class="dl-note">Peso de B = ${fmt(result.weights[1])}. La suma es ${fmt(result.weights.reduce((total, value) => total + value, 0))}.</p></div><div class="dl-operation"><span class="eyebrow">3 · COMBINAR LOS VALORES</span><p class="dl-equation">Salida = (${fmt(result.weights[0])} × 10) + (${fmt(result.weights[1])} × 20) ≈ <b>${fmt(result.output)}</b></p><div class="dl-metrics">${metric('Salida combinada', fmt(result.output))}</div></div><p class="dl-note">Se conserva la precisión durante el cálculo; los pesos mostrados están redondeados. Cambia Q para comparar la salida conservando las dos fuentes.</p>`);
    q('[data-status]').textContent = `Consulta ${tuple(result.query)}. Peso de A ${fmt(result.weights[0])}, peso de B ${fmt(result.weights[1])}. Salida combinada ${fmt(result.output)}.`;
  };
  shell.bind(draw);
  q('[data-reset]').onclick = () => shell.restore({ query: 'first' }, draw);
}

function detectionPicture(result) {
  const [x1, y1, x2, y2] = result.prediction;
  const overlapX = Math.max(20, x1), overlapY = Math.max(20, y1);
  const width = Math.max(0, Math.min(60, x2) - overlapX), height = Math.max(0, Math.min(60, y2) - overlapY);
  return `<svg class="dl-box-picture" viewBox="-12 -12 130 130" role="img" aria-label="Imagen didáctica de 100 por 100 píxeles. Caja conocida 20,20 a 60,60. Caja candidata ${x1},${y1} a ${x2},${y2}. IoU ${fmt(result.iou)}. ${result.kept ? 'Predicción conservada.' : 'Predicción descartada por puntuación.'}"><rect x="0" y="0" width="100" height="100" rx="1" fill="#f2f4ed" stroke="#a9b2a3" stroke-width=".5"/><text x="0" y="-4" font-size="4">0</text><text x="92" y="-4" font-size="4">100 px</text><text x="-11" y="101" font-size="4">100 px</text><rect x="${overlapX}" y="${overlapY}" width="${width}" height="${height}" fill="#a7bdce" fill-opacity=".45"/><rect x="20" y="20" width="40" height="40" fill="none" stroke="#42744e" stroke-width="1.3"/><rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="none" stroke="${result.kept ? '#b9652a' : '#71776b'}" stroke-width="1.3" stroke-dasharray="2 1"/></svg>`;
}

function detection(el) {
  const defaults = { offset: 10, threshold: .5, iou: .5 };
  const shell = createShell(el, 'detection', 'Una caja conservada no garantiza una buena detección', ({ range }) =>
    range('offset', 'Desplazamiento horizontal de la caja (píxeles)', 0, 40, 1, defaults.offset, 'px') +
    range('threshold', 'Umbral de puntuación', 0, 1, .05, defaults.threshold) +
    range('iou', 'IoU mínima para coincidencia', .1, .9, .05, defaults.iou) + reset,
  'Una imagen inventada de 100 × 100 píxeles, un objeto conocido y una predicción candidata de la misma categoría «Fruto». Su puntuación está fijada en 0,80. El umbral de puntuación decide si conservamos la fila; la IoU mínima decide si coincide suficientemente con la caja conocida. No se ejecuta YOLO ni se mide mAP.');
  const { q, number, visual } = shell;
  const draw = () => {
    const result = detectionExample({ offset: number('offset'), threshold: number('threshold'), iouThreshold: number('iou') });
    const overlapWidth = Math.max(0, 40 - number('offset')), intersection = overlapWidth * 40, union = 3200 - intersection;
    const outcome = !result.kept ? 'La candidata se descarta por puntuación. No hay falso positivo, pero el objeto conocido queda sin detectar.' : result.matched ? 'La candidata se conserva y coincide con el objeto: es un verdadero positivo.' : 'La candidata se conserva, pero no coincide lo suficiente: cuenta como falso positivo y deja un objeto omitido.';
    visual(`${detectionPicture(result)}<div class="dl-box-legend"><span><i class="dl-known-key"></i> Caja conocida</span><span><i class="dl-predicted-key ${result.kept ? '' : 'dl-discarded-key'}"></i> Candidata ${result.kept ? 'conservada' : 'descartada'}</span><span><i class="dl-overlap-key"></i> Intersección</span></div><table class="dl-table"><caption>Categoría Fruto · coordenadas [x₁, y₁, x₂, y₂] en píxeles</caption><thead><tr><th scope="col">Registro</th><th scope="col">Caja</th><th scope="col">Puntuación</th></tr></thead><tbody><tr><th scope="row">Objeto conocido</th><td>${tuple(result.truth)}</td><td>No corresponde</td></tr><tr><th scope="row">Predicción candidata</th><td>${tuple(result.prediction)}</td><td>0,80</td></tr></tbody></table><div class="dl-operation"><span class="eyebrow">1 · CONSERVAR O DESCARTAR UNA FILA</span><p class="dl-equation">0,80 ${result.kept ? '≥' : '<'} ${fmt(result.confidenceThreshold, 2)} → <b>${result.kept ? '1 fila conservada' : '0 filas conservadas'}</b></p></div><div class="dl-operation"><span class="eyebrow">2 · COMPARAR CON LA CAJA CONOCIDA</span><p class="dl-equation">IoU = intersección / unión = ${fmt(intersection)} / ${fmt(union)} = <b>${fmt(result.iou)}</b></p><p class="dl-note">Intersección y unión se miden en píxeles cuadrados. IoU no tiene unidades. Mínimo para coincidencia: ${fmt(result.iouThreshold, 2)}; ambas categorías son Fruto.</p></div><div class="dl-metrics">${metric('IoU', fmt(result.iou))}${metric('Verdaderos positivos (TP)', result.tp)}${metric('Falsos positivos (FP)', result.fp)}${metric('Objetos omitidos (FN)', result.fn)}</div><p class="dl-note">${outcome}</p><p class="dl-note">Aquí hay un objeto real y como máximo una predicción. Una mala localización conservada puede sumar FP y FN a la vez. No contamos verdaderos negativos de fondo en este ejercicio.</p>`);
    q('[data-status]').textContent = `Puntuación 0,80; umbral ${fmt(result.confidenceThreshold, 2)}. ${result.kept ? 'Una fila conservada.' : 'Ninguna fila conservada.'} IoU ${fmt(result.iou)}. TP ${result.tp}, FP ${result.fp}, FN ${result.fn}.`;
  };
  shell.bind(draw);
  q('[data-reset]').onclick = () => shell.restore(defaults, draw);
}

const EXPLORERS = { neuron, convolution, sequence, attention, detection };
export function mountDLExplorer(el, type) {
  if (!el) return;
  if (!Object.hasOwn(EXPLORERS, type)) throw new RangeError('Explorador DL desconocido.');
  EXPLORERS[type](el);
}
