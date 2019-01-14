import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { getUniqueWords, removeStopWords, generateTrainingData, TrainData } from './data/utils';
import { createModel } from './data/model';
import * as tf from '@tensorflow/tfjs';
import { Observable } from 'rxjs';
import { currencyTypes } from './services/models/currency.models';
import { UserService } from './services/user-worker.service';
import { CartService } from './services/cart-worker.service';
import { Store } from '@ngrx/store';
import { MatSelectChange } from '@angular/material';
import { SetCurrencyAction } from './services/reducers/actions';

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
