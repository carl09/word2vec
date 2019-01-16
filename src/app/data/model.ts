import * as tf from '@tensorflow/tfjs';

export const createModel = (encodeNumberLength: number): tf.Sequential => {
  const model = tf.sequential();

  const hidden = tf.layers.dense({
    units: 1, // Number of nodes in the hidden Layer
    inputShape: [encodeNumberLength], // Input Layer with 2 nodes
    // activation: 'relu', // 'relu',
    //   activation: 'softmax',
    // activation: 'sigmoid',
    activation: 'sigmoid',
    kernelInitializer: 'zeros',
    useBias: true,
  });

  model.add(hidden);

  const output = tf.layers.dense({
    units: encodeNumberLength,
    activation: 'softmax',
  });
  model.add(output);

  model.compile({
    // loss: 'meanSquaredError',
    // optimizer: modelOptimizer,
    metrics: ['accuracy'],
    loss: 'categoricalCrossentropy',
    optimizer: tf.train.rmsprop(0.005),
  });

  return model;
};
