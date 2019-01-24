import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { combineLatest, Observable } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';
import { ICartSave, IProduct } from './models';
import { ProductsService } from './products.service';
import { ResolverService } from './resolver.service';

const predict = (model: tf.Model, productLength: number) => {
  return (productId: number) => {
    let result: number[];
    tf.tidy(() => {
      const productTensor = tf.oneHot(tf.tensor1d([productId], 'int32'), productLength);

      result = Array.from((model.predict(productTensor) as tf.Tensor).dataSync());
    });
    return result;
  };
};

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private model$: Observable<tf.Model>;

  constructor(
    private productsService: ProductsService,
    private http: HttpClient,
    private resolverService: ResolverService,
  ) {}

  public getMatrix(): Observable<Array<{ x: number; y: number; label: string; color: string }>> {
    return combineLatest(this.model(), this.productsService.getProductRaw()).pipe(
      map(([model, productsData]: [tf.Model, IProduct[]]) => {
        const weights = model.layers[1].getWeights()[0].dataSync();
        const bias = model.layers[1].getWeights()[1].dataSync();

        const matrix: Array<{ x: number; y: number; label: string; color: string }> = [];

        for (let index = 0; index < weights.length; index++) {
          const x = weights[index];
          const y = bias[index];
          matrix.push({
            x,
            y,
            label: productsData[index].code,
            color: productsData[index].color,
          });
        }

        return matrix;
      }),
    );
  }

  public guess(
    itemsCount: number,
    ...code: string[]
  ): Observable<Array<{ label: string; img: string; name: string; rank: number }>> {
    console.log('PredictionService.guess', code);

    return combineLatest(this.model(), this.productsService.getProductRaw()).pipe(
      map(([model, productsData]: [tf.Model, IProduct[]]) => {
        const product2int: { [id: string]: number } = productsData.reduce((a, w, i) => {
          a[w.code] = i;
          return a;
        }, {});

        const results = code.map(x => {
          return predict(model, productsData.length)(product2int[x]);
        });

        const summaryResults = results.reduce((a, perdiction) => {
          perdiction.forEach((v, i) => {
            if (a[i]) {
              a[i] = a[i] + v;
            } else {
              a.push(v);
            }
          });
          return a;
        }, []);

        return summaryResults
          .map((v, i) => {
            return {
              label: productsData[i].code,
              img: productsData[i].img,
              name: productsData[i].name,
              rank: v,
            };
          })
          .filter(x => !code.find(y => y === x.label))
          .sort((a, b) => {
            return b.rank - a.rank;
          })
          .slice(0, itemsCount);
      }),
    );
  }

  public remoteSuggest(code: string): Observable<Array<{ label: string; img: string }>> {
    return this.http.get<IProduct[]>(this.resolverService.productSuggest(code)).pipe(
      map(x => {
        return x.map(z => {
          return {
            label: z.code,
            img: z.img,
          };
        });
      }),
      share(),
    );
  }

  public cartSaveData(): Observable<ICartSave[]> {
    return this.http.get<ICartSave[]>(this.resolverService.cartListSaved()).pipe(share());
  }

  private model() {
    console.log('PredictionService.model');
    if (!this.model$) {
      this.model$ = this.requestModel().pipe(shareReplay(1));
    }
    return this.model$;
  }

  private requestModel(): Observable<tf.Model> {
    console.log('PredictionService.requestModel');
    return Observable.create(obs => {
      this.resolverService
        .getModel()
        .then(model => {
          obs.next(model);
        })
        .catch(err => {
          obs.error(err);
        });
    });
  }
}
