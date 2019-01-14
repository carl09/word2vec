import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ICartSummary } from '../services/models';
import { CartService } from '../services/cart-worker.service';
import { Store } from '@ngrx/store';
import { CartRemoveAction, CartAddAction } from '../services/reducers/actions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  summary$: Observable<ICartSummary[]>;

  constructor(
    private cartService: CartService,
    private store: Store<any>,
  ) {}

  public ngOnInit(): void {
    this.summary$ = this.cartService.getCartSummary();
  }

  public remove(productCode: string) {
    this.store.dispatch(
      new CartRemoveAction({
        productCode,
        qty: 1,
      }),
    );
  }

  public add(productCode: string) {
    this.store.dispatch(
      new CartAddAction({
        productCode,
        qty: 1,
      }),
    );
  }
}
