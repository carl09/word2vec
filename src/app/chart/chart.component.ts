import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js';
import { createGraphDefaults } from './graph.utils';
import { SeriesComponent } from './series.component';

export interface SelectEvent {
  seriesIndex: number;
  seriesLabel: string;
  value: number;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, AfterContentInit, OnChanges {
  @ContentChildren(SeriesComponent) public series: QueryList<SeriesComponent>;

  @ViewChild('canvas1')
  canvas1: ElementRef;

  @Input()
  title: string;

  @Input()
  labels: string[];

  @Output()
  public readonly select: EventEmitter<SelectEvent> = new EventEmitter();

  public chart1: Chart;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.chart1 = createGraphDefaults(this.canvas1, this.title);

    this.chart1.data.labels = this.labels || [];

    this.chart1.canvas.onclick = evt => {
      const activePoint = this.chart1.getElementAtEvent(evt)[0];

      if (activePoint) {
        const label = this.chart1.data.labels[activePoint._index];
        const value = this.chart1.data.datasets[activePoint._datasetIndex].data[activePoint._index];

        if (this.select.observers.length !== 0) {
          this.select.emit({
            seriesIndex: activePoint._index,
            seriesLabel: label as string,
            value: value as number,
          });
        }

        this.series.toArray()[activePoint._datasetIndex].onSelect({
          seriesIndex: activePoint._index,
          seriesLabel: label as string,
          value: value as number,
        });
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (this.chart1) {
      if (changes.labels.currentValue) {
        this.chart1.data.labels = changes.labels.currentValue;
        this.chart1.update();
      }
    }
  }

  ngAfterContentInit(): void {
    this.addRows(this.series);

    this.series.changes.subscribe(x => {
      console.log('Change', x, this.series.length);
      this.addRows(this.series);
      // this.changeDetectorRef.markForCheck();
    });
  }

  private addRows(s: QueryList<SeriesComponent>) {
    s.forEach((x: SeriesComponent, i: number) => {
      if (!this.chart1.data.datasets[i]) {
        this.chart1.data.datasets.push({
          backgroundColor: x.color || '#FF0000',
          borderColor: x.color,
          label: x.label,
          fill: false,
        });

        this.chart1.data.datasets[i].data = x.values;
      }
    });

    this.chart1.update();
  }
}
