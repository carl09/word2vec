import { currencyTypes } from './currency.models';

export interface IUser {
  username?: string;
  currency?: currencyTypes;
  viewedProducts?: string[];
}
