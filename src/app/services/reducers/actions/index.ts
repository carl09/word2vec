// tslint:disable:max-classes-per-file
import { Action } from '@ngrx/store';
import { IProduct } from '../../models';
import { cartActions } from './cart.actions';
import { productsActions } from './products.actions';
import { userActions } from './user.actions';

export * from './products.actions';
export * from './user.actions';
export * from './cart.actions';

export const INCREMENT = 'INCREMENT';
export class IncrementAction implements Action {
  public readonly type = INCREMENT;
}

export const DECREMENT = 'DECREMENT';
export class DecrementAction implements Action {
  public readonly type = DECREMENT;
}

export type Actions =
  | IncrementAction
  | DecrementAction
  | productsActions
  | userActions
  | cartActions;
