import { currencyTypes } from './currency.models';
export interface IProduct {
  code: string;
  name: string;
  img: string;
  unitPrice: number;
  color: string;
}

export interface IProductSummary {
  code: string;
  name: string;
  img: string;
  price: number;
  currency: currencyTypes;
}

export interface IProductViewed {
  code: string;
  name: string;
  img: string;
}
