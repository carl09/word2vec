import { createModel } from './src/app/data/model';
import { TrainData } from './src/app/data/utils';
import { ICartSave, IProduct } from './src/app/services/models/index';
import * as tf from '@tensorflow/tfjs';
require('@tensorflow/tfjs-node');

import * as cartItemsData from './src/assets/cartData.json';
import * as productsData from './src/assets/products.json';

const transformCartToTraining = (
  cartItem: ICartSave,
  lookup: { [id: string]: number },
): TrainData[] => {
  const result: TrainData[] = [];

  cartItem.products.forEach((x, i) => {
    for (let index = 0; index < cartItem.products.length; index++) {
      const label = cartItem.products[index];
      if (i !== index) {
        // console.log(x.productCode, element.productCode);
        result.push({
          data: lookup[x.productCode],
          label: lookup[label.productCode],
        });
      }
    }
  });

  return result;
};

const products = (productsData as IProduct[]).map(x => x.code);

// console.log(products);

const product2int: { [id: string]: number } = {};

products.forEach((w, i) => {
  product2int[w] = i;
});

const trainingData: TrainData[] = (cartItemsData as ICartSave[]).reduce((a, c) => {
  return a.concat(transformCartToTraining(c, product2int));
}, []);

// console.log(trainingData);

const encodeNumberLength = products.length;

const model = createModel(encodeNumberLength);

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

model
  .fit(dataTensor, labelTensor, {
    epochs: 1000,
    shuffle: true,
    // batchSize: 32,
    // validationSplit: 0.15,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        // console.log(epoch, logs.loss);
      },
    },
  })
  .then(() => {
    dataTensor.dispose();
    labelTensor.dispose();

    const weights = model.layers[1].getWeights()[0].dataSync();
    const bias = model.layers[1].getWeights()[1].dataSync();

    const matrix: Array<{ x: number; y: number }> = [];

    for (let index = 0; index < weights.length; index++) {
      const x = weights[index];
      const y = bias[index]; // weights[index++];
      console.log(x, y);
      matrix.push({
        x,
        y,
      });
    }

    model.save('file://./src/assets/cart-1a');
  });


