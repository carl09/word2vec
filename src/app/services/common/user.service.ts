import { Observable } from 'rxjs';
import { currencyTypes } from '../models/currency.models';
import { IProductSummary } from '../models/index';
import { IServiceWithIndex } from './service-with-index.model';

export abstract class UserService implements IServiceWithIndex {
  protected readonly methodIsAuthencated = 'UserService.isAuthencated';
  protected readonly methodGetCurrency = 'UserService.getCurrency';

  public methods: { [id: string]: (args: any[]) => Observable<any> } = {};

  constructor() {
    this.methods[this.methodIsAuthencated] = (args: any[]) =>
      this.isAuthencated();

    this.methods[this.methodGetCurrency] = (args: any[]) => this.getCurrency();
  }

  public abstract isAuthencated(): Observable<boolean>;

  public abstract getCurrency(): Observable<currencyTypes>;

  public getAvaliableCurrencys(): currencyTypes[] {
    return ['AUD', 'USD', 'EUR', 'MYR'];
  }
}
