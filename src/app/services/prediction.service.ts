import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { combineLatest, Observable, of } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { ICartSave, IProduct } from './models';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private model$: Observable<tf.Model>;

  constructor(private productsService: ProductsService, private http: HttpClient) {}

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

  public guess(code: string): Observable<Array<{ label: string; img: string; rank: number }>> {
    return combineLatest(this.model(), this.productsService.getProductRaw()).pipe(
      map(([model, productsData]: [tf.Model, IProduct[]]) => {
        const product2int: { [id: string]: number } = {};

        productsData.forEach((w, i) => {
          product2int[w.code] = i;
        });

        const king = tf.oneHot(tf.tensor1d([product2int[code]], 'int32'), productsData.length);
        const r: Float32Array = (model.predict(king) as tf.Tensor).dataSync() as Float32Array;

        // console.log(r);
        const ranking = Array.from(r)
          
          .map((v, i) => {
            return {
              label: productsData[i].code,
              img: productsData[i].img,
              rank: v,
            };
          })
          .filter(x => x.label !== code)
          .sort((a, b) => {
            return b.rank - a.rank;
          });

        return [ranking[0], ranking[1], ranking[2], ranking[3]];
      }),
    );
  }

  public cartSaveData(): Observable<ICartSave[]> {
    return this.http.get<ICartSave[]>('http://localhost:3000/cartData').pipe(share());
  }

  private model() {
    if (!this.model$) {
      this.model$ = this.requestModel().pipe(shareReplay(1));
    }
    return this.model$;
  }

  private requestModel(): Observable<tf.Model> {
    return Observable.create(obs => {
      tf.loadModel(`${environment.hostUrl}assets/cart-1a/model.json`).then(model => {
        obs.next(model);
      });
    });
  }
}
