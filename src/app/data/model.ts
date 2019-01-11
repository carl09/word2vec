import * as tf from '@tensorflow/tfjs';

export const createModel = (encodeNumberLength: number): tf.Sequential => {
  const model = tf.sequential();

  const hidden = tf.layers.dense({
    units: 1, // Number of nodes in the hidden Layer
    inputShape: [encodeNumberLength], // Input Layer with 2 nodes
    // activation: 'relu', // 'relu',
    //   activation: 'softmax',
    // activation: 'sigmoid',
    activation: 'elu',
    kernelInitializer: 'zeros',
    useBias: true,
  });

  //  const hidden = tf.layers.lstm({
  //   units: 1, // Number of nodes in the hidden Layer
  //   inputShape: [encodeNumberLength], // Input Layer with 2 nodes
  //   returnSequences: false,
  //   // activation: 'relu6', // 'relu',
  //   // kernelInitializer: 'glorotUniform',
  //   useBias: true,
  // });

  model.add(hidden);

  // model.add(tf.layers.dropout({ rate: 0.02 }));

    // const hidden = tf.layers.embedding({
    //   inputShape: [encodeNumberLength],
    //   inputDim: encodeNumberLength,
    //   outputDim: 1,
    //   maskZero: true,
    //   updatable: true,
    //   trainable: true,
      
    //   // embeddingsInitializer: 'zeros',
    //   // useBias: true,
    // });

    // model.add(hidden);

    // model.add(tf.layers.flatten());

  //   const middle = tf.layers.dense({
  //     units: 4, // Number of nodes in the hidden Layer
  //     inputShape: [encodeNumberLength], // Input Layer with 2 nodes
  //     activation: 'relu', // 'relu',
  //     // kernelInitializer: 'glorotUniform',
  //     useBias: true,
  //   });

  //   model.add(middle);

  const output = tf.layers.dense({
    units: encodeNumberLength,
    activation: 'softmax',
  });
  model.add(output);

  const modelOptimizer = tf.train.sgd(0.1);

  model.compile({
    // loss: 'meanSquaredError',
    // optimizer: modelOptimizer,
    metrics: ['accuracy'],
    loss: 'categoricalCrossentropy',
    optimizer: tf.train.rmsprop(0.005),
  });

  return model;
};
