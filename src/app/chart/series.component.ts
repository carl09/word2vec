import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectEvent } from './chart.component';

@Component({
  selector: 'app-series',
  template: `
    <ng-content></ng-content>
  `,
})
export class SeriesComponent {
  @Input() public label: string;

  @Input() public color: string;

  @Input() public values: number[];

  @Output()
  public readonly select: EventEmitter<SelectEvent> = new EventEmitter();

  public onSelect(event: SelectEvent) {
    this.select.emit(event);
  }
}
