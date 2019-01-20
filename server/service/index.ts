import { IProduct } from '../../src/app/services/models';
import { getCartSavedData, getProducts } from './../data/index';

export const guessProduct = async (code: string): Promise<IProduct[]> => {
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
