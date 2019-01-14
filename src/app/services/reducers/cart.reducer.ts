import { Action, ActionReducer } from '@ngrx/store';
import { ICart } from '../models';
import * as reducerActions from './actions';
import { CART_ADD } from './actions/cart.actions';

export const cartReducer: ActionReducer<ICart> = (
  state: ICart = { items: [] },
  action: reducerActions.Actions,
) => {
  switch (action.type) {
    case reducerActions.CART_ADD:
      return addProduct(state, action.payload);
    case reducerActions.CART_REMOVE:
      return removeProduct(state, action.payload);
    default:
      return state;
  }
};

function addProduct(
  state: ICart,
  action: reducerActions.ICartAddActionPayload,
): ICart {
  const items = [];
  let exists = false;
  state.items.forEach(x => {
    if (x.productCode === action.productCode) {
      exists = true;
      items.push({
        productCode: x.productCode,
        qty: x.qty + action.qty,
      });
    } else {
      items.push(x);
    }
  });

  if (!exists) {
    items.push({
      productCode: action.productCode,
      qty: action.qty,
    });
  }
  return {
    items,
  };
}

function removeProduct(
  state: ICart,
  action: reducerActions.ICartAddActionPayload,
): ICart {
  const items = [];
  state.items.forEach(x => {
    if (x.productCode === action.productCode) {
      items.push({
        productCode: x.productCode,
        qty: x.qty - action.qty,
      });
    } else {
      items.push(x);
    }
  });

  return {
    items,
  };
}
