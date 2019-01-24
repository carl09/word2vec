import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IProduct, IProductSummary, IProductViewed, IUser } from './models';
import { convertCurrency, currencyTypes, DEFAULT_CURRENCY } from './models/currency.models';
import { LoadProductsAction, ViewedProductAction } from './reducers/actions';
import { IState } from './reducers/reducers';
import { ResolverService } from './resolver.service';
import { selectGetCurrency } from './user.service';

const selectUser = (state: IState) => state.user;
const selectProducts = (state: IState) => state.products;

const selectProductsForDisplay: MemoizedSelector<IState, IProductSummary[]> = createSelector(
  selectGetCurrency,
  selectProducts,
  (userCurrency: currencyTypes, products: IProduct[]) => {
    const items = [];

    const currency: currencyTypes = userCurrency || DEFAULT_CURRENCY;

    products.forEach(x => {
      const i: IProductSummary = {
        code: x.code,
        name: x.name,
        img: x.img,
        price: convertCurrency(currency, x.unitPrice),
        currency,
      };
      items.push(i);
    });

    return items;
  },
);

const selectRecent: MemoizedSelector<IState, string[]> = createSelector(
  selectUser,
  (user: IUser) => {
    if (user && user.viewedProducts) {
      return user.viewedProducts;
    }

    return [];
  },
);

const selectProductsRecent: MemoizedSelector<IState, IProductViewed[]> = createSelector(
  selectRecent,
  selectProducts,
  (viewedProducts: string[], products: IProduct[]) => {
    const items: IProductViewed[] = [];

    const itemAdded = {};

    const productObj = {};

    products.forEach(x => {
      productObj[x.code] = x;
    });

    for (let index = viewedProducts.length; index >= 0; index--) {
      const x = viewedProducts[index];
      const p = productObj[x];
      if (p && !itemAdded[x]) {
        const i: IProductViewed = {
          code: x,
          name: p.name,
          img: p.img,
        };
        items.push(i);
        itemAdded[x] = true;
      }
      if (items.length > 3) {
        break;
      }
    }

    return items;
  },
);

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(
    private store: Store<IState>,
    private http: HttpClient,
    private resolverService: ResolverService,
  ) {}

  public loadProducts() {
    this.http.get<IProduct[]>(this.resolverService.productsList()).subscribe((resp: IProduct[]) => {
      this.store.dispatch(
        new LoadProductsAction({
          products: resp,
        }),
      );
    });
  }

  public getProductByCode(code: string): Observable<IProductSummary> {
    return this.store.pipe(
      select(selectProductsForDisplay),
      map(x => {
        // console.log('Inside reducer:', x);
        const items = x.filter(y => y.code === code);
        return items[0];
      }),
      tap(() => {
        this.store.dispatch(
          new ViewedProductAction({
            productCode: code,
          }),
        );
      }),
    );
  }

  public getProducts(): Observable<IProductSummary[]> {
    return this.store.pipe(select(selectProductsForDisplay));
  }

  public getRecentProducts(): Observable<IProductViewed[]> {
    return this.store.pipe(select(selectProductsRecent));
  }

  public getProductRaw(): Observable<IProduct[]> {
    return this.store.pipe(select(selectProducts));
  }
}
