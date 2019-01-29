import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { combineLatest, Observable } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';
import { ICartSave, IGuessRank, IProduct } from './models';
import { ProductsService } from './products.service';
import { ResolverService } from './resolver.service';

const predict = (model: tf.Model, productLength: number) => {
  return (productId: number) => {
    let result: number[];
    tf.tidy(() => {
      // one Hot encoding produces Arrays just like in the word2vec example
      const productTensor = tf.oneHot(tf.tensor1d([productId], 'int32'), productLength);
      // the model is the same structure as in the word2vec exmaple
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

  public guess(numberOfItemsToReturn: number, ...productCodes: string[]): Observable<IGuessRank[]> {
    return combineLatest(this.tensorflowModel(), this.productsService.getProductRaw()).pipe(
      map(([model, productsData]: [tf.Model, IProduct[]]) => {
        // Create lookup for product code to index lookup
        const product2int: { [id: string]: number } = productsData.reduce((a, w, i) => {
          a[w.code] = i;
          return a;
        }, {});

        // for each product code in the cart, perdict the closest products
        const modelResults = productCodes.map(productCode => {
          // returns [0.1, 0.2, 0.5 ...]
          return predict(model, productsData.length)(product2int[productCode]);
        });

        // combine all the adding the rank
        const rankingResults = modelResults.reduce(
          (a, perdiction) => {
            perdiction.forEach((v, i) => {
              if (a[i]) {
                a[i] = a[i] + v;
              } else {
                a.push(v);
              }
            });
            return a;
          },
          [], // create empty array
        );

        // Formatting for usage
        return (
          rankingResults
            .map((v, i) => {
              return {
                label: productsData[i].code,
                img: productsData[i].img,
                name: productsData[i].name,
                rank: v,
              };
            })
            // removing products already in the cart
            .filter(x => !productCodes.find(y => y === x.label))
            // sort by the best products
            .sort((a, b) => {
              return b.rank - a.rank;
            })
            .slice(0, numberOfItemsToReturn)
        );
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

  public getMatrix(): Observable<Array<{ x: number; y: number; label: string; color: string }>> {
    return combineLatest(this.tensorflowModel(), this.productsService.getProductRaw()).pipe(
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

  public cartSaveData(): Observable<ICartSave[]> {
    return this.http.get<ICartSave[]>(this.resolverService.cartListSaved()).pipe(share());
  }

  private tensorflowModel() {
    if (!this.model$) {
      this.model$ = this.requestModel().pipe(shareReplay(1));
    }
    return this.model$;
  }

  private requestModel(): Observable<tf.Model> {
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
