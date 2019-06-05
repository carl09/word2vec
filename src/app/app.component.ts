import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartService } from './services/cart.service';
import { currencyTypes } from './services/models/currency.models';
import { SetCurrencyAction } from './services/reducers/actions';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isAuthencated$: Observable<boolean>;
  public selected: currencyTypes;
  public currencies: currencyTypes[];

  public cartTotal$: Observable<number>;

  constructor(
    private userService: UserService,
    private store: Store<any>,
    private cartService: CartService,
  ) {}

  public ngOnInit(): void {
    this.isAuthencated$ = this.userService.isAuthencated();
    this.currencies = this.userService.getAvaliableCurrencys();
    this.cartTotal$ = this.cartService.getCartTotal();

    this.userService.getCurrency().subscribe(x => {
      // console.log('getCurrency', x);
      this.selected = x;
    });
  }

  public onSelectionChange(event: MatSelectChange) {
    // console.log('onSelectionChange', event);
    this.store.dispatch(
      new SetCurrencyAction({
        currency: event.value,
      }),
    );
  }
}
