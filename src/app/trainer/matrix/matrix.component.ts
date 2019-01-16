import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import * as tf from '@tensorflow/tfjs';
import { removeStopWords, getUniqueWords, TrainData, generateTrainingData } from '../../data/utils';
import { createModel } from '../../data/model';
import { IProduct } from '../../services/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  // styleUrls: ['./trainer.component.scss'],
})
export class MatrixComponent implements OnInit {
  @ViewChild('canvas1')
  canvas1: ElementRef;

  public chart1: Chart;

  constructor(private http: HttpClient) {}

  public ngOnInit() {
    const ctx1 = this.canvas1.nativeElement.getContext('2d');

    this.chart1 = new Chart(ctx1, {
      type: 'bubble',
      data: {
        datasets: [],
      },
      options: {
        title: {
          text: 'accuracy curve',
        },
        legend: {
          // display: false,
        },
        scales: {
          xAxes: [
            {
              // display: false,
            },
          ],
          yAxes: [
            {
              // display: true,
            },
          ],
        },
      },
    });

    this.loadData();
  }

  private async loadData() {
    this.http
      .get<IProduct[]>(`${environment.hostUrl}products`)
      .pipe(take(1))
      .subscribe(productsData => {
        console.log('loading model');
        tf.loadModel(`${environment.hostUrl}assets/cart-1a/model.json`).then(model => {
          const weights = model.layers[1].getWeights()[0].dataSync();
          const bias = model.layers[1].getWeights()[1].dataSync();

          const matrix: Array<{ x: number; y: number }> = [];

          for (let index = 0; index < weights.length; index++) {
            const x = weights[index];
            const y = bias[index]; // weights[index++];
            console.log(x, y);
            matrix.push({
              x,
              y,
            });
          }

          const products = (productsData as IProduct[]).map(x => x.code);
          const product2int: { [id: string]: number } = {};

          products.forEach((w, i) => {
            product2int[w] = i;
          });

          for (let index = 0; index < products.length; index++) {
            const element = products[index];

            this.chart1.data.datasets.push({
              label: element,
              data: [
                {
                  x: matrix[index].x,
                  y: matrix[index].y,
                  r: 5,
                },
              ],
            });
          }

          this.chart1.update();
        });
      });
  }

  // private async loadData() {
  //   const data = [
  //     'king is a strong man',
  //     'queen is a wise woman',
  //     'boy is a young man',
  //     'girl is a young woman',
  //     'prince is a young king',
  //     'princess is a young queen',
  //     'man is strong',
  //     'woman is pretty',
  //     'prince is a boy will be king',
  //     'princess is a girl will be queen',

  //     'King is a man',
  //     'Prince becomes a king',
  //     'Queen is a woman',
  //     'King is married to the queen',
  //   ];

  //   const tidyData = data.map(removeStopWords);

  //   const words = getUniqueWords(tidyData);

  //   const word2int: { [id: string]: number } = {};

  //   words.forEach((w, i) => {
  //     word2int[w] = i;
  //   });

  //   const trainingData: TrainData[] = [];
  //   // for (let index = 0; index < 4; index++) {
  //   tidyData.forEach(x => {
  //     const result = generateTrainingData(x);

  //     result.forEach(y => {
  //       if (y.left) {
  //         trainingData.push({
  //           data: word2int[y.data],
  //           label: word2int[y.left],
  //         });
  //       }
  //       if (y.right) {
  //         trainingData.push({
  //           data: word2int[y.data],
  //           label: word2int[y.right],
  //         });
  //       }
  //     });
  //   });
  //   // }

  //   const encodeNumberLength = words.length;

  //   console.log(trainingData);

  //   const model = createModel(encodeNumberLength);

  //   // tf.tidy(() => {
  //   const dataTensor = tf.oneHot(
  //     tf.tensor1d([...trainingData.map(x => x.data)], 'int32'),
  //     encodeNumberLength,
  //   );
  //   const labelTensor = tf.oneHot(
  //     tf.tensor1d([...trainingData.map(x => x.label)], 'int32'),
  //     encodeNumberLength,
  //   );

  //   await model
  //     .fit(dataTensor, labelTensor, {
  //       epochs: 10,
  //       shuffle: true,
  //       // batchSize: 32,
  //       callbacks: {
  //         onEpochEnd: async (epoch, logs) => {
  //           await tf.nextFrame();
  //           console.log(epoch, logs);
  //         },
  //       },
  //     })
  //     .then(() => {
  //       const weights = model.layers[1].getWeights()[0].dataSync();
  //       const bias = model.layers[1].getWeights()[1].dataSync();

  //       const matrix: Array<{ x: number; y: number }> = [];

  //       for (let index = 0; index < weights.length; index++) {
  //         const x = weights[index];
  //         const y = bias[index]; // weights[index++];
  //         console.log(x, y);
  //         matrix.push({
  //           x,
  //           y,
  //         });
  //       }

  //       for (let index = 0; index < words.length; index++) {
  //         const element = words[index];

  //         this.chart1.data.datasets.push({
  //           label: element,
  //           data: [
  //             {
  //               x: matrix[index].x,
  //               y: matrix[index].y,
  //               r: 5,
  //             },
  //           ],
  //         });
  //       }

  //       this.chart1.update();

  //       const king = tf.oneHot(tf.tensor1d([word2int['king']], 'int32'), encodeNumberLength);
  //       const r: Float32Array = (model.predict(king) as tf.Tensor).dataSync() as Float32Array;

  //       king.dispose();

  //       // console.log(r);
  //       const ranking = Array.from(r)
  //         .map((v, i) => {
  //           return {
  //             label: words[i],
  //             rank: v,
  //           };
  //         })
  //         .sort((a, b) => {
  //           return b.rank - a.rank;
  //         });

  //       console.log(ranking);
  //       // r.forEach((v, i) => {
  //       //     console.log(`${words[i]} : ${v}`);
  //       // })
  //     });

  //   dataTensor.dispose();

  //   labelTensor.dispose();
  // }
}
