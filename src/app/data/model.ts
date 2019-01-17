import * as tf from '@tensorflow/tfjs';

export const createModelWithParms = (
  encodeNumberLength: number,
  activation: string,
  loss: number,
  optimizerName: string,
): tf.Sequential => {
  const model = tf.sequential();

  const hidden = tf.layers.dense({
    units: 1,
    inputShape: [encodeNumberLength],
    // activation: 'relu', // 'relu',
    //   activation: 'softmax',
    // activation: 'sigmoid',
    activation,
    kernelInitializer: 'zeros',
    useBias: true,
  });

  model.add(hidden);

  const output = tf.layers.dense({
    units: encodeNumberLength,
    activation: 'softmax',
  });
  model.add(output);

  let optimizer: tf.Optimizer;
  switch (optimizerName) {
    case 'sgd':
      optimizer = tf.train.sgd(loss);
      break;
    case 'momentum':
      optimizer = tf.train.momentum(loss, 1);
      break;
    case 'rmsprop':
      optimizer = tf.train.rmsprop(loss);
      break;
    case 'adam':
      optimizer = tf.train.adam(loss);
      break;
    case 'adadelta':
      optimizer = tf.train.adadelta(loss);
      break;
    case 'adamax':
      optimizer = tf.train.adamax(loss);
      break;
    case 'adagrad':
      optimizer = tf.train.adagrad(loss);
      break;
  }

  model.compile({
    // loss: 'meanSquaredError',
    // optimizer: modelOptimizer,
    // metrics: ['accuracy'],
    loss: 'categoricalCrossentropy',
    optimizer,
  });

  return model;
};

export const createModel = (encodeNumberLength: number): tf.Sequential => {
  // return createModelWithParms(encodeNumberLength, 'sigmoid', 0.005, 'rmsprop');
  return createModelWithParms(encodeNumberLength, 'linear', 0.5, 'adamax');
};

// 100x
//   { name: 'Run: linear : 0.5 : adamax', loss: 2.599022150039673 },
//   { name: 'Run: elu : 0.5 : adamax', loss: 2.6553778648376465 },
//   { name: 'Run: selu : 0.5 : adamax', loss: 2.658170700073242 },
//   { name: 'Run: linear : 0.05 : adam', loss: 2.704240322113037 },
//   { name: 'Run: linear : 0.5 : adam', loss: 2.72676682472229 },
//   { name: 'Run: tanh : 0.5 : adamax', loss: 2.7294089794158936 },
//   { name: 'Run: softplus : 0.5 : adamax', loss: 2.7523672580718994 },
//   { name: 'Run: elu : 0.05 : adam', loss: 2.756197929382324 },
//   { name: 'Run: selu : 0.05 : adam', loss: 2.767658233642578 },
//   { name: 'Run: softsign : 0.5 : adam', loss: 2.782181978225708 },
//   { name: 'Run: linear : 0.05 : rmsprop', loss: 2.789928913116455 },
//   { name: 'Run: elu : 0.05 : rmsprop', loss: 2.799903631210327 },
//   { name: 'Run: linear : 0.05 : adamax', loss: 2.80183744430542 },
//   { name: 'Run: softsign : 0.5 : adamax', loss: 2.805767774581909 },
//   { name: 'Run: selu : 0.05 : rmsprop', loss: 2.8103926181793213 },
//   { name: 'Run: softplus : 0.05 : adam', loss: 2.8143250942230225 },
//   { name: 'Run: softplus : 0.05 : rmsprop', loss: 2.81608510017395 },
//   { name: 'Run: tanh : 0.05 : adam', loss: 2.8479037284851074 },

// 500x
//   { name: 'Run: softplus : 0.5 : adamax', loss: 2.5535004138946533 },
//   { name: 'Run: linear : 0.5 : adamax', loss: 2.573293447494507 },
//   { name: 'Run: elu : 0.05 : adam', loss: 2.5743587017059326 },
//   { name: 'Run: elu : 0.5 : adamax', loss: 2.58613920211792 },
//   { name: 'Run: softsign : 0.5 : adamax', loss: 2.6009669303894043 },
//   { name: 'Run: softplus : 0.05 : adamax', loss: 2.60272479057312 },
//   { name: 'Run: elu : 0.05 : adamax', loss: 2.6030733585357666 },
//   { name: 'Run: tanh : 0.5 : adamax', loss: 2.6135880947113037 },
//   { name: 'Run: softsign : 0.05 : adam', loss: 2.641456365585327 },
//   { name: 'Run: selu : 0.05 : adam', loss: 2.6586759090423584 },
//   { name: 'Run: linear : 0.05 : adamax', loss: 2.6615610122680664 },
//   { name: 'Run: linear : 0.005 : rmsprop', loss: 2.663315534591675 },
//   { name: 'Run: linear : 0.05 : adam', loss: 2.666041612625122 },
//   { name: 'Run: linear : 0.05 : rmsprop', loss: 2.6739304065704346 },
//   { name: 'Run: selu : 0.05 : rmsprop', loss: 2.6742448806762695 },
//   { name: 'Run: sigmoid : 0.5 : adam', loss: 2.6828160285949707 },
//   { name: 'Run: softsign : 0.5 : adam', loss: 2.685666084289551 },
//   { name: 'Run: sigmoid : 0.5 : adamax', loss: 2.7031333446502686 },
//   { name: 'Run: elu : 0.05 : rmsprop', loss: 2.7110776901245117 },
//   { name: 'Run: softplus : 0.05 : adam', loss: 2.714296579360962 },
//   { name: 'Run: selu : 0.05 : adamax', loss: 2.71500825881958 },
//   { name: 'Run: selu : 0.5 : adamax', loss: 2.7198612689971924 },
//   { name: 'Run: selu : 0.5 : adam', loss: 2.722872495651245 },
//   { name: 'Run: tanh : 0.05 : adam', loss: 2.729630470275879 },
