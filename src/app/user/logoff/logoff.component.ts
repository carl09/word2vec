import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LogoffAction } from '../../services/reducers/actions/user.actions';

@Component({
  selector: 'app-user-logoff',
  templateUrl: './logoff.component.html',
})
export class LogoffComponent implements OnInit {
  constructor(private store: Store<any>) {}

  public ngOnInit(): void {
    this.store.dispatch(new LogoffAction());
  }
}
