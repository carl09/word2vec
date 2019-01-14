import { Action, ActionReducer } from '@ngrx/store';
import { IUser } from '../models';
import { currencyTypes, DEFAULT_CURRENCY } from '../models/currency.models';
import * as reducerActions from './actions';
import { USER_SET_CURRENCY } from './actions/user.actions';

export const userReducer: ActionReducer<IUser> = (
  state: IUser = {
    currency: DEFAULT_CURRENCY,
  },
  action: reducerActions.Actions,
) => {
  switch (action.type) {
    case reducerActions.USER_LOGIN:
      return login(state, action.payload.username);
    case reducerActions.USER_LOGOFF:
      return logoff(state);
    case reducerActions.USER_SET_CURRENCY:
      return setCurrency(state, action.payload.currency);
    case reducerActions.USER_VIEWED_PRODUCT:
      return addViewProduct(state, action.payload.productCode);
    default:
      return state;
  }
};

function login(state: IUser, username: string): IUser {
  return {
    username,
    currency: state.currency,
    viewedProducts: state.viewedProducts,
  };
}

function logoff(state: IUser): IUser {
  return {
    currency: state.currency,
    viewedProducts: state.viewedProducts,
  };
}

function setCurrency(state: IUser, currency: currencyTypes): IUser {
  return {
    username: state.username,
    currency,
    viewedProducts: state.viewedProducts,
  };
}

function addViewProduct(state: IUser, productCode: string): IUser {
  const viewedProducts = (state.viewedProducts || []).slice();
  viewedProducts.push(productCode);

  return {
    username: state.username,
    currency: state.currency,
    viewedProducts,
  };
}
