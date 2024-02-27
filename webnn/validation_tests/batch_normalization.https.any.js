// META: title=validation tests for WebNN API batchNormalization operation
// META: global=window,dedicatedworker
// META: script=../resources/utils_validation.js
// META: timeout=long

'use strict';

let meanIndex = 0;
let varianceIndex = 0;

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    const invalidAxisArray = generateOutOfRangeValuesArray(unsignedLongType);
    for (let axis of validAxisArray) {
      let size = dimensions2D[axis];
      const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [size]});
      const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [size]});
      for (let invalidAxis of invalidAxisArray) {
        assert_throws_js(TypeError, () => builder.batchNormalization(input, mean, variance, {axis: invalidAxis}));
      }
    }
  }
}, "[batchNormalization] TypeError is expected if options.axis is outside the 'unsigned long' value range");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      let size = dimensions2D[axis];
      const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [size]});
      const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [size]});
      assert_throws_dom('DataError', () => builder.batchNormalization(input, mean, variance, {axis: getRank(dimensions2D)}));
    }
  }
}, "[batchNormalization] DataError is expected if options.axis is 'unsigned long' and it's not in the range 0 to the rank of input, exclusive");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      let size = dimensions2D[axis];
      const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [size]});
      const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [size]});
      for (let axis of notUnsignedLongAxisArray) {
        assert_false(typeof axis === 'number' && Number.isInteger(axis), "[batchNormalization] options.axis should be of 'unsigned long'");
        assert_throws_js(TypeError, () => builder.batchNormalization(input, mean, variance, {axis}));
      }
    }
  }
}, '[batchNormalization] TypeError is expected if options.axis is not an unsigned long interger');

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [dimensions2D[axis]]});
      for (let dimensions of allWebNNDimensionsArray) {
        if (dimensions.length !== 1) {
          // set mean not be 1D tensor
          const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions});
          assert_throws_dom('DataError', () => builder.batchNormalization(input, mean, variance));
        }
      }
    }
  }
}, "[batchNormalization] DataError is expected if the size of mean.dimensions is not 1");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      let size = dimensions2D[axis];
      const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [size]});
      for (let offset of adjustOffsetsArray) {
        const adjustedSize = size + offset;
        const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [adjustedSize]});
        assert_throws_dom('DataError', () => builder.batchNormalization(input, mean, variance, {axis}));
      }
    }
  }
}, "[batchNormalization] DataError is expected if mean.dimensions[0] is not equal to input.dimensions[options.axis]");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [dimensions2D[axis]]});
      for (let dimensions of allWebNNDimensionsArray) {
        if (dimensions.length !== 1) {
          // set variance not be 1D tensor
          const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions});
          assert_throws_dom('DataError', () => builder.batchNormalization(input, mean, variance));
        }
      }
    }
  }
}, "[batchNormalization] DataError is expected if the size of variance.dimensions is not 1");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      let size = dimensions2D[axis];
      const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [size]});
      for (let offset of adjustOffsetsArray) {
        const adjustedSize = size + offset;
        const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [adjustedSize]});
        assert_throws_dom('DataError', () => builder.batchNormalization(input, mean, variance, {axis}));
      }
    }
  }
}, "[batchNormalization] DataError is expected if variance.dimensions[0] is not equal to input.dimensions[options.axis]");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [dimensions2D[axis]]});
      const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [dimensions2D[axis]]});
      for (let dimensions of allWebNNDimensionsArray) {
        if (dimensions.length !== 1) {
          // set scale not be 1D tensor
          const scale = builder.input('scale', {dataType, dimensions});
          assert_throws_dom('DataError', () => builder.batchNormalization(input, mean, variance, {axis, scale}));
        }
      }
    }
  }
}, "[batchNormalization] DataError is expected if the size of scale.dimensions is not 1");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      let size = dimensions2D[axis];
      const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [size]});
      const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [size]});
      for (let offset of adjustOffsetsArray) {
        const adjustedSize = size + offset;
        const scale = builder.input('scale', {dataType, dimensions: [adjustedSize]});
        assert_throws_dom('DataError', () => builder.batchNormalization(input, mean, variance, {axis, scale}));
      }
    }
  }
}, "[batchNormalization] DataError is expected if scale.dimensions[0] is not equal to input.dimensions[options.axis]");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [dimensions2D[axis]]});
      const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [dimensions2D[axis]]});
      for (let dimensions of allWebNNDimensionsArray) {
        if (dimensions.length !== 1) {
          // set bias not be 1D tensor
          const bias = builder.input('bias', {dataType, dimensions});
          assert_throws_dom('DataError', () => builder.batchNormalization(input, mean, variance, {axis, bias}));
        }
      }
    }
  }
}, "[batchNormalization] DataError is expected if the size of bias.dimensions is not 1");

promise_test(async t => {
  for (let dataType of allWebNNOperandDataTypes) {
    const input = builder.input(`input${++inputIndex}`, {dataType, dimensions: dimensions2D});
    const validAxisArray = getAxisArray(dimensions2D);
    for (let axis of validAxisArray) {
      let size = dimensions2D[axis];
      const mean = builder.input(`mean${++meanIndex}`, {dataType, dimensions: [size]});
      const variance = builder.input(`variance${++varianceIndex}`, {dataType, dimensions: [size]});
      for (let offset of adjustOffsetsArray) {
        const adjustedSize = size + offset;
        const bias = builder.input('bias', {dataType, dimensions: [adjustedSize]});
        assert_throws_dom('DataError', () => builder.batchNormalization(input, mean, variance, {axis, bias}));
      }
    }
  }
}, "[batchNormalization] DataError is expected if bias.dimensions[0] is not equal to input.dimensions[options.axis]");
