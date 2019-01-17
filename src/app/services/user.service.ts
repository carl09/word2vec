import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUser } from './models';
import { currencyTypes, DEFAULT_CURRENCY } from './models/currency.models';
import { IState } from './reducers/reducers';

const selectUser = (state: IState) => state.user;

const selectIsAuthencated: MemoizedSelector<IState, boolean> = createSelector(
  selectUser,
  (user: IUser) => {
    if (user && user.username) {
      return true;
    }

    return false;
  },
);

export const selectGetCurrency: MemoizedSelector<IState, currencyTypes> = createSelector(
  selectUser,
  (user: IUser) => {
    if (user && user.currency) {
      return user.currency;
    }

    return DEFAULT_CURRENCY;
  },
);

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private store: Store<IState>) {}

  public isAuthencated(): Observable<boolean> {
    return this.store.pipe(select(selectIsAuthencated));
  }

  public getCurrency(): Observable<currencyTypes> {
    return this.store.pipe(select(selectGetCurrency));
  }

  public getAvaliableCurrencys(): currencyTypes[] {
    return ['AUD', 'USD', 'EUR', 'MYR'];
  }
}
