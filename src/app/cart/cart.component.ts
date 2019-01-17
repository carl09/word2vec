import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CartService } from '../services/cart-worker.service';
import { ICartSave, ICartSummary } from '../services/models';
import { CartAddAction, CartRemoveAction, CartRemoveAllAction } from '../services/reducers/actions';

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
    private http: HttpClient,
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

        this.http.post('http://localhost:3000/cartData', saveData).subscribe(z => {
          console.log(z);
        });

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
