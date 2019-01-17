import { ActionReducer } from '@ngrx/store';
import { IProduct } from '../models';
import * as reducerActions from './actions';

export const productsReducer: ActionReducer<IProduct[]> = (
  state: IProduct[] = [],
  action: reducerActions.Actions,
) => {
  switch (action.type) {
    case reducerActions.LOAD_PRODUCTS:
      return loadProducts(state, action.payload.products);
    default:
      return state;
  }
};

function loadProducts(state: IProduct[], products: IProduct[]) {
  return (state || []).concat(products);
}
