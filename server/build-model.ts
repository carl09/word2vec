require('@tensorflow/tfjs-node');
import * as cartItemsData from './assets/cartData.json';
import * as productsData from './assets/products.json';
import { IProduct } from '../src/app/services/models/products.model';
import { ICartSave } from '../src/app/services/models/index';
import { generateModel } from './generate-model';


generateModel(productsData as IProduct[], cartItemsData as ICartSave[]);

// const products = (productsData as IProduct[]).map(x => x.code);

// const product2int: { [id: string]: number } = {};

// products.forEach((w, i) => {
//   product2int[w] = i;
// });

// const trainingData: TrainData[] = (cartItemsData as ICartSave[]).reduce((a, c) => {
//   return a.concat(transformCartToTraining(c, product2int));
// }, []);

// const encodeNumberLength = products.length;

// const model = createModel(encodeNumberLength);

// const dataTensor = tf.oneHot(
//   tf.tensor1d([...trainingData.map(x => x.data)], 'int32'),
//   encodeNumberLength,
// );
// const labelTensor = tf.oneHot(
//   tf.tensor1d([...trainingData.map(x => x.label)], 'int32'),
//   encodeNumberLength,
// );

// model
//   .fit(dataTensor, labelTensor, {
//     epochs: 1000,
//     shuffle: true,
//     callbacks: {
//       onEpochEnd: async (epoch, logs) => {
//         // console.log(epoch, logs.loss);
//       },
//     },
//   })
//   .then(() => {
//     dataTensor.dispose();
//     labelTensor.dispose();

//     model.save('file://./assets/cart-1a');
//   });
