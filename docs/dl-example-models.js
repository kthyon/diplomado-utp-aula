// Small, invented examples. These functions execute arithmetic, not trained models.
const finite = (value, name) => {
  if (!Number.isFinite(value)) throw new TypeError(`${name} debe ser un número finito.`);
  return value;
};
const vector = (values, name) => {
  if (!Array.isArray(values) || values.length === 0) throw new TypeError(`${name} no puede estar vacío.`);
  return values.map(value => finite(value, name));
};
const rectangular = (values, name) => {
  if (!Array.isArray(values) || values.length === 0) throw new TypeError(`${name} no puede estar vacío.`);
  const rows = values.map(row => vector(row, name));
  if (rows.some(row => row.length !== rows[0].length)) throw new TypeError(`${name} debe ser rectangular.`);
  return rows;
};

export function neuronExample({ inputs = [2, 1], weights = [.5, -1], bias = .5 } = {}) {
  const x = vector(inputs, 'Entradas'), w = vector(weights, 'Pesos');
  if (x.length !== w.length) throw new RangeError('Debe haber un peso por entrada.');
  finite(bias, 'Sesgo');
  const products = x.map((value, index) => value * w[index]);
  const sum = products.reduce((total, value) => total + value, 0) + bias;
  return { inputs: x, weights: w, bias, products, sum, output: Math.max(0, sum) };
}

export const CONVOLUTION_INPUT = Object.freeze([
  Object.freeze([0, 0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0, 0]),
  Object.freeze([1, 1, 1, 1, 1]),
  Object.freeze([1, 1, 1, 1, 1]),
  Object.freeze([1, 1, 1, 1, 1])
]);
export const CONVOLUTION_FILTERS = Object.freeze({
  horizontal: Object.freeze([
    Object.freeze([-1, -1, -1]),
    Object.freeze([0, 0, 0]),
    Object.freeze([1, 1, 1])
  ]),
  average: Object.freeze(Array.from({ length: 3 }, () => Object.freeze([1 / 9, 1 / 9, 1 / 9])))
});

// The kernel is applied without flipping, as in the convolution layers used in DL.
export function validConvolution(input, kernel) {
  const image = rectangular(input, 'Entrada'), filter = rectangular(kernel, 'Filtro');
  const height = image.length - filter.length + 1, width = image[0].length - filter[0].length + 1;
  if (height < 1 || width < 1) throw new RangeError('El filtro debe caber en la entrada.');
  return Array.from({ length: height }, (_, row) => Array.from({ length: width }, (_, column) =>
    filter.reduce((total, filterRow, r) => total + filterRow.reduce((subtotal, value, c) =>
      subtotal + value * image[row + r][column + c], 0), 0)
  ));
}

export function convolutionExample({ filter = 'horizontal', row = 0, column = 0 } = {}) {
  if (!Object.hasOwn(CONVOLUTION_FILTERS, filter)) throw new RangeError('Filtro desconocido.');
  if (!Number.isInteger(row) || !Number.isInteger(column) || row < 0 || row > 2 || column < 0 || column > 2) {
    throw new RangeError('La posición de la ventana debe estar entre 0 y 2.');
  }
  const input = CONVOLUTION_INPUT.map(values => [...values]);
  const kernel = CONVOLUTION_FILTERS[filter].map(values => [...values]);
  const window = kernel.map((values, r) => values.map((_, c) => input[row + r][column + c]));
  const products = kernel.map((values, r) => values.map((value, c) => value * window[r][c]));
  const map = validConvolution(input, kernel);
  return { input, kernel, window, products, map, row, column, value: map[row][column], filter };
}

export function sequenceState(values = [10, 20, 30], { alpha = .5, initial = 0 } = {}) {
  const inputs = vector(values, 'Secuencia');
  finite(alpha, 'Peso del dato');
  finite(initial, 'Estado inicial');
  if (alpha < 0 || alpha > 1) throw new RangeError('El peso debe estar entre cero y uno.');
  let state = initial;
  const steps = inputs.map((input, index) => {
    const previous = state;
    state = (1 - alpha) * previous + alpha * input;
    return { index: index + 1, input, previous, state };
  });
  return { inputs, alpha, initial, steps, final: state, mean: inputs.reduce((sum, value) => sum + value, 0) / inputs.length };
}

export function stableSoftmax(values) {
  const scores = vector(values, 'Puntuaciones');
  const maximum = Math.max(...scores), exponentials = scores.map(value => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map(value => value / total);
}

export function scaledDotProductAttention(query, keys, values) {
  const q = vector(query, 'Consulta'), k = rectangular(keys, 'Claves'), v = vector(values, 'Valores');
  if (k[0].length !== q.length) throw new RangeError('Consulta y claves deben tener la misma dimensión.');
  if (k.length !== v.length) throw new RangeError('Debe haber un valor por clave.');
  const products = k.map(key => q.reduce((sum, value, index) => sum + value * key[index], 0));
  const scale = Math.sqrt(q.length), logits = products.map(value => value / scale), weights = stableSoftmax(logits);
  const contributions = weights.map((weight, index) => weight * v[index]);
  return { query: q, keys: k, values: v, products, scale, logits, weights, contributions, output: contributions.reduce((sum, value) => sum + value, 0) };
}

export const ATTENTION_QUERIES = Object.freeze({
  first: Object.freeze([1, 0]), second: Object.freeze([0, 1]), neutral: Object.freeze([0, 0])
});
export function attentionExample(query = 'first') {
  if (!Object.hasOwn(ATTENTION_QUERIES, query)) throw new RangeError('Consulta desconocida.');
  return scaledDotProductAttention(ATTENTION_QUERIES[query], [[1, 0], [0, 1]], [10, 20]);
}

function boxCoordinates(values) {
  const box = vector(values, 'Caja');
  if (box.length !== 4 || box[2] < box[0] || box[3] < box[1]) throw new RangeError('Usa una caja [x1,y1,x2,y2] ordenada.');
  return box;
}
export function intersectionOverUnion(first, second) {
  const a = boxCoordinates(first), b = boxCoordinates(second);
  const intersection = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
  const area = box => (box[2] - box[0]) * (box[3] - box[1]);
  const union = area(a) + area(b) - intersection;
  return union > 0 ? intersection / union : 0;
}

export function evaluateSingleDetection({ truth = [20, 20, 60, 60], prediction = [30, 20, 70, 60], confidence = .8, confidenceThreshold = .5, iouThreshold = .5, classMatches = true } = {}) {
  for (const [value, name] of [[confidence, 'Puntuación'], [confidenceThreshold, 'Umbral'], [iouThreshold, 'IoU mínima']]) {
    finite(value, name);
    if (value < 0 || value > 1) throw new RangeError(`${name} debe estar entre cero y uno.`);
  }
  const actual = boxCoordinates(truth), candidate = boxCoordinates(prediction);
  const iou = intersectionOverUnion(actual, candidate), kept = confidence >= confidenceThreshold;
  const matched = kept && Boolean(classMatches) && iou >= iouThreshold;
  return { truth: actual, prediction: candidate, confidence, confidenceThreshold, iouThreshold, iou, kept, matched, tp: Number(matched), fp: Number(kept && !matched), fn: Number(!matched) };
}

export function detectionExample({ offset = 10, threshold = .5, iouThreshold = .5 } = {}) {
  finite(offset, 'Desplazamiento');
  if (offset < 0 || offset > 40) throw new RangeError('El desplazamiento debe estar entre 0 y 40 píxeles.');
  return evaluateSingleDetection({ prediction: [20 + offset, 20, 60 + offset, 60], confidenceThreshold: threshold, iouThreshold });
}
