import * as fs from 'fs';
import { ICartSave, IProduct } from '../../src/app/services/models';

export const getProducts = (): Promise<IProduct[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile('./server/assets/products.json', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.toString()) as IProduct[]);
      }
    });
  });
};

export const getProductByCode = async (code: string): Promise<IProduct> => {
  const products = await getProducts();
  return products.find(x => x.code === code);
};

export const getCartSavedData = (): Promise<ICartSave[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile('./server/assets/cartData.json', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.toString()) as ICartSave[]);
      }
    });
  });
};

export const setCartSavedData = (data: ICartSave[]): Promise<{}> => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./server/assets/cartData.json', JSON.stringify(data), err => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
