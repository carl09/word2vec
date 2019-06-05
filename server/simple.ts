import * as tf from '@tensorflow/tfjs';
import { createModelWithParms } from '../src/app/data/model';
import {
  generateTrainingData,
  getUniqueWords,
  removeStopWords,
  TrainData,
} from '../src/app/data/utils';

// tslint:disable-next-line:no-var-requires
require('@tensorflow/tfjs-node');

interface IHyperParm {
  activation: string;
  loss: number;
  optimizer: string;
}

interface ITrainResult {
  loss: number;
  name: string;
}

const generateTrainingTensors = (lines: string[], encodeLength: number) => {
  const results: TrainData[] = [];
  for (let index = 0; index < 4; index++) {
    lines.forEach(x => {
      const result = generateTrainingData(x);

      result.forEach(y => {
        if (y.left) {
          results.push({
            data: word2int[y.data],
            label: word2int[y.left],
          });
        }
        if (y.right) {
          results.push({
            data: word2int[y.data],
            label: word2int[y.right],
          });
        }
      });
    });
  }

  const dataTensor = tf.oneHot(tf.tensor1d([...results.map(x => x.data)], 'int32'), encodeLength);
  const labelTensor = tf.oneHot(tf.tensor1d([...results.map(x => x.label)], 'int32'), encodeLength);

  return {
    data: dataTensor,
    label: labelTensor,
  };
};

const createHyperPrams = () => {
  const activationTypes: string[] = [
    'elu',
    'hardSigmoid',
    'linear',
    'relu',
    'relu6',
    'selu',
    'sigmoid',
    'softmax',
    'softplus',
    'softsign',
    'tanh',
  ];
  const losses: number[] = [0.5, 0.05, 0.005];

  const optimizers: string[] = [
    'sgd',
    'momentum',
    'rmsprop',
    'adam',
    'adadelta',
    'adamax',
    'adagrad',
  ];

  const prams: IHyperParm[] = [];

  losses.forEach(loss => {
    activationTypes.forEach(activation => {
      optimizers.forEach(optimizer => {
        prams.push({
          activation,
          loss,
          optimizer,
        });
      });
    });
  });

  return prams;
};

// tslint:disable-next-line:no-unused
const doit = async (
  parms: IHyperParm[],
  trainingData: any,
  encodeLength: number,
  epochs: number,
): Promise<ITrainResult[]> => {
  const results: ITrainResult[] = [];

  for (const i of parms) {
    const model = createModelWithParms(encodeLength, i.activation, i.loss, i.optimizer);

    const training = await model.fit(trainingData.data, trainingData.label, {
      epochs,
      shuffle: true,
      verbose: 1,
      // callbacks: {
      //   onEpochEnd: async (epoch, logs) => {
      //     // console.log(epoch, logs.loss);
      //   },
      // },
    });
    const losses = training.history.loss as number[];
    results.push({
      loss: losses[losses.length - 1],
      name: `Run: ${i.activation} : ${i.loss} : ${i.optimizer}`,
    });
  }
  return results;
};

const data = [
  'king is a strong man',
  'queen is a wise woman',
  'boy is a young man',
  'girl is a young woman',
  'prince is a young king',
  'princess is a young queen',
  'man is strong',
  'woman is pretty',
  'prince is a boy will be king',
  'princess is a girl will be queen',

  'King is a man',
  'Prince becomes a king',
  'Queen is a woman',
  'King is married to the queen',
];

const tidyData = data.map(removeStopWords);

const words = getUniqueWords(tidyData);

const word2int: { [id: string]: number } = {};

words.forEach((w, i) => {
  word2int[w] = i;
});

const encodeNumberLength = words.length;

// const trainingData = generateTrainingTensors(tidyData, encodeNumberLength);
// const hyperPrams = createHyperPrams();

doit(
  createHyperPrams(),
  generateTrainingTensors(tidyData, encodeNumberLength),
  encodeNumberLength,
  10,
).then(r => {
  console.log('--------------------------------------------');

  console.log(
    r.sort((a, b) => {
      return a.loss - b.loss;
    }),
  );
});
