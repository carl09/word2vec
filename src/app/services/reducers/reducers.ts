import { Action, ActionReducer, ActionReducerMap } from '@ngrx/store';
import { ICart, IProduct, IUser } from '../models';
import { cartReducer } from './cart.reducer';
import { counterReducer } from './counter.reducer';
import { productsReducer } from './products.reducer';
import { userReducer } from './user.reducer';

export interface IState {
  cart: ICart;
  counter: number;
  products: IProduct[];
  user: IUser;
}

export const reducers: ActionReducerMap<IState> = {
  cart: cartReducer,
  counter: counterReducer,
  products: productsReducer,
  user: userReducer,
};
