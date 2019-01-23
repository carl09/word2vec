import * as tf from '@tensorflow/tfjs';
import { IProduct } from '../../src/app/services/models';
import { getCartSavedData, getProducts } from './../data/index';

// tslint:disable-next-line:no-unused
const test = (foo: string) => {
  return (b: string) => {
    return foo + b;
  };
};

export const suggestProduct = async (code: string): Promise<IProduct[]> => {
  const products = await getProducts();
  const cartData = await getCartSavedData();

  const salesCount = cartData
    .map(x => x.products)
    .reduce((a, cart) => {
      if (cart.find(x => x.productCode === code)) {
        cart
          .filter(x => x.productCode !== code)
          .map(x => x.productCode)
          .forEach(i => {
            a[i] = (a[i] || 0) + 1;
          });
      }
      return a;
    }, {});

  const ordered = Object.keys(salesCount)
    .map(x => {
      return [x, salesCount[x]];
    })
    .sort((a, b) => {
      return (a[1] = b[1]);
    })
    .slice(0, 3)
    .map(x => {
      return products.find(y => y.code === x[0]);
    });

  console.log(ordered);

  return ordered;
};

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

  const ranking = Array.from(r)
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

  console.log(ranking);

  return ranking;
};
