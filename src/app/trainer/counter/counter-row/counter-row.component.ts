import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PredictionService } from './../../../services/prediction.service';

@Component({
  // selector: 'app-counter-row',
  // tslint:disable-next-line:component-selector
  selector: '[app-counter-tr]',
  templateUrl: './counter-row.component.html',
  styleUrls: ['./counter-row.component.scss'],
})
export class CounterRowComponent implements OnInit, OnDestroy {
  @Input() public code: string;
  @Input() public count: number;
  @Input() public img: string;

  public guesses$: Observable<any>;

  private ngUnsubscribe = new Subject<void>();

  constructor(private predictionService: PredictionService) {}

  ngOnInit(): void {
    this.guesses$ = this.predictionService.guess(this.code);
    // .pipe(takeUntil(this.ngUnsubscribe))
    // .subscribe(x => {
    //   console.log('guess', this.code, x);
    // });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
  }
}
