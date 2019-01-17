import * as tf from '@tensorflow/tfjs';
import { removeStopWords, getUniqueWords, TrainData, generateTrainingData } from '../src/app/data/utils';
import { createModel } from '../src/app/data/model';
require('@tensorflow/tfjs-node');

const WINDOW_SIZE = 2;

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

// console.log('corpus', corpus);

// console.log("removeStopWords: ", removeStopWords(data[0]));

const tidyData = data.map(removeStopWords);

// console.log(tidyData);

const words = getUniqueWords(tidyData);

// console.log(words, words.length);

const word2int: { [id: string]: number } = {};

words.forEach((w, i) => {
  word2int[w] = i;
});

const trainingData: TrainData[] = [];
for (let index = 0; index < 4; index++) {
  tidyData.forEach(x => {
    const result = generateTrainingData(x);

    result.forEach(y => {
      if (y.left) {
        trainingData.push({
          data: word2int[y.data],
          label: word2int[y.left],
        });
      }
      if (y.right) {
        trainingData.push({
          data: word2int[y.data],
          label: word2int[y.right],
        });
      }
    });

    // trainingData = [...trainingData, ...generateTrainingData(x)];
  });
}

// console.log(trainingData);

// const item = trainingData[trainingData.length -1];

// console.log(item);

const encodeNumberLength = words.length;

const model = createModel(encodeNumberLength);

// tf.tidy(() => {
const dataTensor = tf.oneHot(
  tf.tensor1d([...trainingData.map(x => x.data)], 'int32'),
  encodeNumberLength,
);
const labelTensor = tf.oneHot(
  tf.tensor1d([...trainingData.map(x => x.label)], 'int32'),
  encodeNumberLength,
);

dataTensor.print();

labelTensor.print();

model.summary();

// dataTensor.print()

model
  .fit(dataTensor, labelTensor, {
    epochs: 1000,
    shuffle: false,
    // batchSize: 32,
    validationSplit: 0.15,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        // console.log(epoch, logs.loss);
      },
    },
  })
  .then(() => {
    // console.log(model.toJSON())

    // const weights = model.layers[1].getWeights()[0].dataSync();
    // console.log(weights);

    // for (let index = 0; index < weights.length; index++) {
    //   const x = weights[index];
    //   const y = weights[index++];
    //   // console.log(x, y);
    // }

    // const bias = model.layers[1].getWeights()[1].dataSync()
    // console.log(bias);
    console.log('Queriung: ', word2int['king']);
    const king = tf.oneHot(tf.tensor1d([word2int['king']], 'int32'), encodeNumberLength);
    const r: Float32Array = (model.predict(king) as tf.Tensor).dataSync() as Float32Array;

    // console.log(r);
    const ranking = Array.from(r)
      .map((v, i) => {
        return {
          label: words[i],
          rank: v,
        };
      })
      .sort((a, b) => {
        return b.rank - a.rank;
      });

    console.log(ranking);
    // r.forEach((v, i) => {
    //     console.log(`${words[i]} : ${v}`);
    // })
  });

// })
