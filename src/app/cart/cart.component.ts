import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ICartSummary, ICartSave } from '../services/models';
import { CartService } from '../services/cart-worker.service';
import { Store } from '@ngrx/store';
import { CartRemoveAction, CartAddAction, CartRemoveAllAction } from '../services/reducers/actions';
import { map, take } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  summary$: Observable<ICartSummary[]>;

  public saveCartForm: FormGroup;

  constructor(
    private cartService: CartService,
    private store: Store<any>,
    private formBuilder: FormBuilder,
  ) {}

  public ngOnInit(): void {
    this.summary$ = this.cartService.getCartSummary();
    this.createForm();
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

  public saveCart() {
    this.cartService
      .getCartSummary()
      .pipe(
        map(x => {
          return x.map(y => {
            return {
              productCode: y.productCode,
              qty: y.qty,
            };
          });
        }),
        take(1),
      )
      .subscribe(x => {
        const saveData: ICartSave = {
          sex: this.saveCartForm.value.sex,
          style: this.saveCartForm.value.style,
          products: x,
        };

        this.addItems(saveData);

        console.log(saveData);
        this.store.dispatch(new CartRemoveAllAction());
      });
  }

  private createForm() {
    this.saveCartForm = this.formBuilder.group({
      sex: new FormControl(''),
      style: new FormControl(''),
    });
  }

  private addItems(cartSave: ICartSave) {
    const rawData = localStorage.getItem('saveData') || '[]';

    const items: ICartSave[] = JSON.parse(rawData);

    items.push(cartSave);

    console.log(JSON.stringify(items));

    localStorage.setItem('saveData', JSON.stringify(items));
  }
}
