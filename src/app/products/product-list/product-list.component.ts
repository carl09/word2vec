import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { IProductSummary, IProductViewed } from '../../services/models/products.model';
import { PredictionService } from '../../services/prediction.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  public products$: Observable<IProductSummary[]>;
  public productViewed$: Observable<IProductViewed[]>;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private predictionService: PredictionService,
  ) {}

  public ngOnInit(): void {
    this.products$ = this.productsService.getProducts();
    this.productViewed$ = this.cartService.getCartCodes().pipe(
      switchMap(x => {
        return this.predictionService.guess(5, ...x);
      }),
      map(x => {
        return x.map(y => {
          return {
            code: y.label,
            name: y.name,
            img: y.img,
          };
        });
      }),
    );
  }
}
