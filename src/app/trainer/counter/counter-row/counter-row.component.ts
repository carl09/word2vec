import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PredictionService } from './../../../services/prediction.service';

@Component({
  // selector: 'app-counter-row',
  // tslint:disable-next-line:component-selector
  selector: '[app-counter-tr]',
  templateUrl: './counter-row.component.html',
  styleUrls: ['./counter-row.component.scss'],
})
export class CounterRowComponent implements OnInit {
  @Input() public code: string;
  @Input() public count: number;
  @Input() public img: string;

  public guesses$: Observable<any>;
  public suggest$: Observable<any>;

  constructor(private predictionService: PredictionService) {}

  ngOnInit(): void {
    this.guesses$ = this.predictionService.guess(3, this.code);
    this.suggest$ = this.predictionService.remoteSuggest(this.code);
  }
}
