import { ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

export function createGraphDefaults(elementRef: ElementRef, title: string): Chart {
  // debugger;
  return new Chart(elementRef.nativeElement.getContext('2d'), {
    type: 'line',
    data: {},
    options: {
      responsive: true,
      //   title: {
      //     text: title,
      //   },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            display: true,
          },
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}
