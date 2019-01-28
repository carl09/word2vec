import { IProduct } from 'src/app/services/models';
import { getCartSavedData, getProducts } from './../data/index';

// this is a server operation becouse we do not want sales information sent to the client
export const suggestProduct = async (code: string): Promise<IProduct[]> => {
  const products = await getProducts(); // get all the current products
  const cartData = await getCartSavedData(); // get all the sales information

  const salesCount = cartData
    .map(x => x.products)
    .reduce((a, cart) => {
      if (cart.find(x => x.productCode === code)) {
        // find any sales with the product code
        cart
          .filter(x => x.productCode !== code)
          .map(x => x.productCode)
          .forEach(i => {
            a[i] = (a[i] || 0) + 1; // count each time an assocated product is found in the sale
          });
      }
      return a;
    }, {});

  return Object.keys(salesCount)
    .map(x => {
      // transform the object to an array
      return [x, salesCount[x]];
    })
    .sort((a, b) => {
      // sort results by sales count
      return (a[1] = b[1]);
    })
    .slice(0, 3) // return the best products
    .map(x => {
      return products.find(y => y.code === x[0]); // map it back to a product
    });
};
