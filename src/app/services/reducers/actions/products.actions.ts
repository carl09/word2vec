import { Action } from '@ngrx/store';
import { IProduct } from '../../models';

export const LOAD_PRODUCTS = 'LOAD_PRODUCTS';
export interface ILoadProductsActionPayload {
  products: IProduct[];
}

export class LoadProductsAction implements Action {
  public readonly type = LOAD_PRODUCTS;
  constructor(public payload: ILoadProductsActionPayload) {}
}

export type productsActions = LoadProductsAction;
