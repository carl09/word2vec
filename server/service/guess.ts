import * as tf from '@tensorflow/tfjs';
import { IProduct } from '../../src/app/services/models';
import { getProducts } from './../data/index';

export const guessProduct = async (code: string): Promise<IProduct[]> => {
  const products = await getProducts();

  const product2int: { [id: string]: number } = products.reduce((a, w, i) => {
    a[w.code] = i;
    return a;
  }, {});

  const model = await tf.loadModel('file://./server/assets/cart-1a/model.json');

  const productTensor = tf.oneHot(tf.tensor1d([product2int[code]], 'int32'), products.length);
  const r: Float32Array = (await (model.predict(
    productTensor,
  ) as tf.Tensor).data()) as Float32Array;

  productTensor.dispose();

  return Array.from(r)
    .map((v, i) => {
      return {
        label: products[i].code,
        img: products[i].img,
        rank: v,
      };
    })
    .filter(x => x.label !== code)
    .sort((a, b) => {
      return b.rank - a.rank;
    })
    .slice(0, 3)
    .map(x => {
      return products.find(y => y.code === x.label);
    });
};
