import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICartSave, IProductSummary } from 'src/app/services/models';
import { ProductsService } from '../../services/products.service';
import { PredictionService } from './../../services/prediction.service';

export interface ICountUser {
  label: string;
  count: number;
}

export interface ICountProducts {
  code: string;
  img: string;
  count: number;
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {
  public users$: Observable<ICountUser[]>;

  public products$: Observable<ICountProducts[]>;

  constructor(private predictionService: PredictionService, private productsService: ProductsService) {}

  ngOnInit(): void {
    const http$: Observable<ICartSave[]> = this.predictionService.cartSaveData();

    this.users$ = http$.pipe(
      map(x => {
        const userMap = x.reduce((a, c) => {
          a[c.sex + c.style] = (a[c.sex + c.style] || 0) + 1;
          console.log(a);
          return a;
        }, {});

        return Object.keys(userMap).map(y => {
          return {
            label: y,
            count: userMap[y] as number,
          };
        });
      }),
    );

    this.products$ = combineLatest(http$, this.productsService.getProducts()).pipe(
      map(([x, y]: [ICartSave[], IProductSummary[]]) => {
        const productImageMap = y.reduce((a, c) => {
          a[c.code] = c.img;
          return a;
        }, {});

        const procustMap = y.reduce((a, c) => {
          a[c.code] = 0;
          return a;
        }, {});

        x.forEach(c => {
          c.products.forEach(l => {
            procustMap[l.productCode] = procustMap[l.productCode] + 1;
          });
        });

        return Object.keys(procustMap)
          .map(z => {
            return {
              code: z,
              img: productImageMap[z],
              count: procustMap[z],
            };
          })
          // .sort((a, b) => {
          //   return a.count - b.count;
          // });
      }),
    );
  }
}
