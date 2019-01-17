require('@tensorflow/tfjs-node');
import * as cartItemsData from './assets/cartData.json';
import * as productsData from './assets/products.json';
import { IProduct } from '../src/app/services/models/products.model';
import { ICartSave } from '../src/app/services/models/index';
import { generateModel } from './generate-model';
import { createModel, createModelWithParms } from '../src/app/data/model';

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
        activation: activation,
        loss: loss,
        optimizer: optimizer,
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
  createModelWithParms(p.length, 'linear', 0.015, 'adamax'),
  300,
);

async function doIt(parms: IHyperParm[]): Promise<ITrainResult[]> {
  const results: ITrainResult[] = [];

  const products = productsData as IProduct[];

  for (const i of parms) {
    const result = await generateModel(
      products,
      cartItemsData as ICartSave[],
      createModelWithParms(products.length, i.activation, i.loss, i.optimizer),
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
