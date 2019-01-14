// tslint:disable:max-classes-per-file
import { Action } from '@ngrx/store';

export const CART_ADD = 'CART_ADD';
export const CART_REMOVE = 'CART_REMOVE';
export const CART_REMOVE_ALL = 'CART_REMOVE_ALL';

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

export class CartRemoveAllAction implements Action {
  public readonly type = CART_REMOVE_ALL;
  constructor() {}
}

export type cartActions = CartAddAction | CartRemoveAction | CartRemoveAllAction;
