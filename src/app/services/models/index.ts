import { Subscription } from 'rxjs';
import { currencyTypes } from './currency.models';
import { createActionUnsubscribeKey, WorkerActions } from './worker-action.model';

export * from './worker-action.model';
export * from './user.model';
export * from './products.model';

export interface IWorkerMessage {
  reducer: string;
  payload: any;
}

export class SubScriptionManager {
  public key: string;
  public subscription: Subscription;

  constructor(workerAction: WorkerActions) {
    this.key = createActionUnsubscribeKey(workerAction);
  }
}

export interface ICartItem {
  productCode: string;
  qty: number;
}

export interface ICart {
  items: ICartItem[];
}

export interface ICartSummary {
  productCode: string;
  name: string;
  qty: number;
  itemPrice: number;
  totalPrice: number;
  currency: currencyTypes;
}

export interface ICartSave {
  sex: string;
  style: string;
  products: Array<{
    productCode: string;
    qty: number;
  }>;
}
