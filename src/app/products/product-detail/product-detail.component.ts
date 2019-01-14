import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IProductSummary, IProductViewed } from '../../services/models/products.model';
import { ProductsService } from '../../services/products-worker.service';
import { Store } from '@ngrx/store';
import { CartAddAction } from '../../services/reducers/actions/cart.actions';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  public product$: Observable<IProductSummary>;
  public productViewed$: Observable<IProductViewed[]>;

  private code: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store:  Store<any>,
    private productsService: ProductsService,
  ) {}

  public ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.code = params.get('code');

        return this.productsService.getProductByCode(this.code);
      }),
    );

    this.productViewed$ = this.productsService.getRecentProducts();
  }

  public addToCart() {
    this.store.dispatch(
      new CartAddAction({
        productCode: this.code,
        qty: 1,
      }),
    );
  }

  public back() {
    this.router.navigate(['/products']);
  }
}
