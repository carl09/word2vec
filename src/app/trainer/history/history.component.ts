import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICartSave, IProductSummary } from 'src/app/services/models';
import { ProductsService } from '../../services/products.service';

export interface IHistory {
  sex: string;
  style: string;
  products: Array<{
    productCode: string;
    qty: number;
    img: string;
  }>;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  public items$: Observable<IHistory[]>;

  constructor(private http: HttpClient, private productsService: ProductsService) {}

  ngOnInit(): void {
    this.items$ = combineLatest(
      this.http.get('http://localhost:3000/cartData'),
      this.productsService.getProducts(),
    ).pipe(
      map(([x, y]: [ICartSave[], IProductSummary[]]) => {
        const productMap = y.reduce((a, c) => {
          a[c.code] = c.img;
          return a;
        }, {});

        return x.map(i => {
          return {
            sex: i.sex,
            style: i.style,
            products: i.products.map(p => {
              return {
                productCode: p.productCode,
                qty: p.qty,
                img: productMap[p.productCode],
              };
            }),
          };
        });
      }),
    );

    // this.items$ = this.http.get('http://localhost:3000/cartData') as Observable<ICartSave[]>;
  }
}
