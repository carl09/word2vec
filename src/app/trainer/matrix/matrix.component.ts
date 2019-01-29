import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { take } from 'rxjs/operators';
import { PredictionService } from './../../services/prediction.service';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
})
export class MatrixComponent implements OnInit {
  @ViewChild('canvas1')
  canvas1: ElementRef;

  public chart1: Chart;

  constructor(private predictionService: PredictionService) {}

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
          display: false,
        },
        scales: {
          xAxes: [
            {
              display: true,
              drawBorder: false,
            },
          ],
          yAxes: [
            {
              display: true,
              drawBorder: false,
            },
          ],
        },
        tooltips: {
          bodyFontSize: 20,
          callbacks: {
            label(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label || '';
            },
          },
        },
      },
    });

    this.loadData();
  }

  private async loadData() {
    this.predictionService
      .getMatrix()
      .pipe(take(1))
      .subscribe(x => {
        console.log('init', x);

        x.forEach(i => {
          this.chart1.data.datasets.push({
            label: i.label,
            backgroundColor: i.color,
            data: [
              {
                x: i.x,
                y: i.y,
                r: 20,
              },
            ],
          });
        });

        this.chart1.update();
      });
  }
}
