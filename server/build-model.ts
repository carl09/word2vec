// tslint:disable-next-line:no-var-requires
require('@tensorflow/tfjs-node');

import * as fs from 'fs';
import { createModelWithParms } from '../src/app/data/model';
import { ICartSave } from '../src/app/services/models/index';
import { IProduct } from '../src/app/services/models/products.model';
import { generateModel } from './generate-model';

const cartItemsDataJson = fs.readFileSync('./server/assets/cartData.json').toString();
const cartItemsData: ICartSave[] = JSON.parse(cartItemsDataJson);

const productsDataJson = fs.readFileSync('./server/assets/products.json').toString();
const productsData: IProduct[] = JSON.parse(productsDataJson);

interface IHyperParm {
  activation: string;
  loss: number;
  optimizer: string;
}

interface ITrainResult {
  loss: number;
  name: string;
}

const activationTypes: string[] = [
  'elu',
  // 'hardSigmoid',
  'linear',
  // 'relu',
  // 'relu6',
  'selu',
  'sigmoid',
  'softmax',
  'softplus',
  'softsign',
  'tanh',
];
const losses: number[] = [0.5, 0.05, 0.005];

const optimizers: string[] = [
  // 'sgd',
  // 'momentum',
  'rmsprop',
  'adam',
  // 'adadelta',
  'adamax',
  // 'adagrad',
];

const hyperParms: IHyperParm[] = [];

losses.forEach(loss => {
  activationTypes.forEach(activation => {
    optimizers.forEach(optimizer => {
      hyperParms.push({
        activation,
        loss,
        optimizer,
      });
    });
  });
});

// doIt(hyperParms).then(r => {

//   console.log('--------------------------------------------');

//   console.log(
//     r.sort((a, b) => {
//       return a.loss - b.loss;
//     }),
//   );
// });

const p = productsData as IProduct[];

generateModel(
  p,
  cartItemsData as ICartSave[],
  createModelWithParms({
    encodeNumberLength: p.length,
    activation: 'linear',
    loss: 0.015,
    optimizerName: 'adamax',
  }),
  300,
);

// tslint:disable-next-line:no-unused
async function doIt(parms: IHyperParm[]): Promise<ITrainResult[]> {
  const results: ITrainResult[] = [];

  const products = productsData as IProduct[];

  for (const i of parms) {
    const result = await generateModel(
      products,
      cartItemsData as ICartSave[],
      createModelWithParms({
        encodeNumberLength: products.length,
        activation: i.activation,
        loss: i.loss,
        optimizerName: i.optimizer,
      }),
      500,
    );
    console.log(`Run: ${i.activation} : ${i.loss} : ${i.optimizer}`, result);
    results.push({
      name: `Run: ${i.activation} : ${i.loss} : ${i.optimizer}`,
      loss: result,
    });
  }
  return results;
}
