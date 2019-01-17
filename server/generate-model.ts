import * as tf from '@tensorflow/tfjs';
require('@tensorflow/tfjs-node');
import { IProduct } from '../src/app/services/models/products.model';
import { TrainData, transformCartToTraining } from '../src/app/data/utils';
import { ICartSave } from '../src/app/services/models/index';
import { createModel } from '../src/app/data/model';

export const generateModel = (
  productsData: IProduct[],
  cartItemsData: ICartSave[],
  model: tf.Sequential,
  epochs: number = 1000,
): Promise<any> => {
  const products = productsData.map(x => x.code);

  const product2int: { [id: string]: number } = {};

  products.forEach((w, i) => {
    product2int[w] = i;
  });

  const trainingData: TrainData[] = cartItemsData.reduce((a, c) => {
    return a.concat(transformCartToTraining(c, product2int));
  }, []);

  const encodeNumberLength = products.length;

  // const model = createModel(encodeNumberLength);

  const dataTensor = tf.oneHot(
    tf.tensor1d([...trainingData.map(x => x.data)], 'int32'),
    encodeNumberLength,
  );
  const labelTensor = tf.oneHot(
    tf.tensor1d([...trainingData.map(x => x.label)], 'int32'),
    encodeNumberLength,
  );

  const result = new Promise((resolve, reject) => {
    model
      .fit(dataTensor, labelTensor, {
        epochs: epochs,
        shuffle: true,
        // batchSize: 50,
        verbose: 1,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            // console.log(epoch, logs.loss);
          },
        },
      })
      .then(x => {
        dataTensor.dispose();
        labelTensor.dispose();

        model.save('file://./server/assets/cart-1a');

        const losses = x.history.loss as number[];

        // console.log(losses[losses.length - 1]);

        resolve(losses[losses.length - 1]);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });

  return result;
};
