import test from 'node:test';
import assert from 'node:assert/strict';
import {
  neuronExample, CONVOLUTION_INPUT, CONVOLUTION_FILTERS, validConvolution, convolutionExample,
  sequenceState, stableSoftmax, scaledDotProductAttention, attentionExample,
  intersectionOverUnion, evaluateSingleDetection, detectionExample
} from '../docs/dl-example-models.js';

const close = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≈ ${expected}`);

test('the fixed neuron exposes the actual products, bias, sum and ReLU output', () => {
  const example = neuronExample();
  assert.deepEqual(example.products, [1, -1]);
  assert.equal(example.sum, .5);
  assert.equal(example.output, .5);
  const negative = neuronExample({ inputs: [2, 1], weights: [.5, -1], bias: -1 });
  assert.equal(negative.sum, -1);
  assert.equal(negative.output, 0);
  assert.throws(() => neuronExample({ inputs: [1], weights: [1, 2] }), RangeError);
});

test('the horizontal filter produces a valid 3×3 map and every inspected sum matches its cell', () => {
  assert.deepEqual(validConvolution(CONVOLUTION_INPUT, CONVOLUTION_FILTERS.horizontal), [[3, 3, 3], [3, 3, 3], [0, 0, 0]]);
  for (let row = 0; row < 3; row++) for (let column = 0; column < 3; column++) {
    const example = convolutionExample({ row, column });
    close(example.products.flat().reduce((sum, value) => sum + value, 0), example.value);
    assert.equal(example.window[0][0], CONVOLUTION_INPUT[row][column]);
  }
  assert.throws(() => validConvolution([[1]], [[1, 1]]), RangeError);
  assert.throws(() => validConvolution([[1], [1, 2]], [[1]]), TypeError);
});

test('averaging counts the selected nine pixels without altering the input or filter', () => {
  const first = convolutionExample({ filter: 'average' }), second = convolutionExample({ filter: 'average', row: 1 }), third = convolutionExample({ filter: 'average', row: 2 });
  close(first.value, 1 / 3);
  close(second.value, 2 / 3);
  close(third.value, 1);
  first.input[0][0] = 99;
  assert.equal(CONVOLUTION_INPUT[0][0], 0);
  assert.equal(convolutionExample().input[0][0], 0);
  assert.throws(() => convolutionExample({ row: 3 }), RangeError);
});

test('the same values in another order have the same mean but different fixed-rule states', () => {
  const ascending = sequenceState(), descending = sequenceState([30, 20, 10]);
  assert.deepEqual(ascending.steps.map(step => step.state), [5, 12.5, 21.25]);
  assert.deepEqual(descending.steps.map(step => step.state), [15, 17.5, 13.75]);
  assert.equal(ascending.mean, 20);
  assert.equal(descending.mean, 20);
  assert.equal(ascending.initial, 0);
  assert.notEqual(ascending.final, descending.final);
  assert.throws(() => sequenceState([1, 2], { alpha: 1.1 }), RangeError);
});

test('softmax remains finite for large scores, sums to one and ignores an additive constant', () => {
  const large = stableSoftmax([1000, 1001, 1002]), shifted = stableSoftmax([0, 1, 2]);
  close(large.reduce((sum, value) => sum + value, 0), 1);
  large.forEach((value, index) => { assert.ok(Number.isFinite(value)); close(value, shifted[index]); });
  assert.deepEqual(stableSoftmax([7, 7]), [.5, .5]);
  assert.throws(() => stableSoftmax([]), TypeError);
  assert.throws(() => stableSoftmax([Infinity, 1]), TypeError);
});

test('attention scales dot products and combines V; changing Q changes the actual output', () => {
  const first = attentionExample(), second = attentionExample('second'), neutral = attentionExample('neutral');
  assert.deepEqual(first.products, [1, 0]);
  close(first.logits[0], 1 / Math.sqrt(2));
  close(first.weights[0], 1 / (1 + Math.exp(-1 / Math.sqrt(2))));
  close(first.output, 13.30238450673343);
  close(second.output, 16.69761549326657);
  assert.equal(neutral.output, 15);
  close(first.output, first.contributions.reduce((sum, value) => sum + value, 0));
  assert.throws(() => scaledDotProductAttention([1, 0], [[1]], [10]), RangeError);
  assert.throws(() => scaledDotProductAttention([1], [[1], [0]], [10]), RangeError);
});

test('IoU handles identical, disjoint, overlapping and degenerate boxes', () => {
  assert.equal(intersectionOverUnion([0, 0, 10, 10], [0, 0, 10, 10]), 1);
  assert.equal(intersectionOverUnion([0, 0, 10, 10], [20, 20, 30, 30]), 0);
  close(intersectionOverUnion([20, 20, 60, 60], [30, 20, 70, 60]), .6);
  assert.equal(intersectionOverUnion([0, 0, 0, 0], [0, 0, 0, 0]), 0);
  assert.throws(() => intersectionOverUnion([10, 0, 0, 10], [0, 0, 10, 10]), RangeError);
});

test('one retained bad detection is both a false positive and an unmatched true object', () => {
  const good = detectionExample(), bad = detectionExample({ offset: 30 }), discarded = detectionExample({ threshold: .9 });
  assert.deepEqual([good.tp, good.fp, good.fn], [1, 0, 0]);
  close(bad.iou, 1 / 7);
  assert.deepEqual([bad.tp, bad.fp, bad.fn], [0, 1, 1]);
  assert.equal(discarded.kept, false);
  assert.deepEqual([discarded.tp, discarded.fp, discarded.fn], [0, 0, 1]);
  assert.deepEqual([evaluateSingleDetection({ classMatches: false }).tp, evaluateSingleDetection({ classMatches: false }).fp], [0, 1]);
});

test('score and IoU thresholds use inclusive boundaries and control different decisions', () => {
  assert.equal(detectionExample({ threshold: .8 }).kept, true);
  assert.equal(detectionExample({ iouThreshold: .6 }).matched, true);
  const failedMatch = detectionExample({ iouThreshold: .65 });
  assert.equal(failedMatch.kept, true);
  assert.equal(failedMatch.matched, false);
  assert.equal(failedMatch.confidence, .8);
  close(failedMatch.iou, .6);
  assert.throws(() => detectionExample({ offset: -1 }), RangeError);
});
