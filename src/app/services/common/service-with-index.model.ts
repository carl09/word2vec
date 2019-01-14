import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const SERVICE_WITH_INDEX = new InjectionToken<IServiceWithIndex[]>(
  'SERVICE_WITH_INDEX',
);

export interface IServiceWithIndex {
  methods: { [id: string]: (args: any[]) => Observable<any> };
}
