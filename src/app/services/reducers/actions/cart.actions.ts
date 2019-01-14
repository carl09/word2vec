// tslint:disable:max-classes-per-file
import { Action } from '@ngrx/store';

export const CART_ADD = 'CART_ADD';
export const CART_REMOVE = 'CART_REMOVE';

export interface ICartAddActionPayload {
  productCode: string;
  qty: number;
}

export interface ICartRemoveActionPayload {
  productCode: string;
  qty: number;
}

export class CartAddAction implements Action {
  public readonly type = CART_ADD;
  constructor(public payload: ICartAddActionPayload) {}
}

export class CartRemoveAction implements Action {
  public readonly type = CART_REMOVE;
  constructor(public payload: ICartRemoveActionPayload) {}
}

export type cartActions = CartAddAction | CartRemoveAction;
