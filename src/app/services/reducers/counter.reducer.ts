import { ActionReducer } from '@ngrx/store';
import * as reducerActions from './actions';

export const counterReducer: ActionReducer<number> = (
  state: number = 0,
  action: reducerActions.Actions,
) => {
  switch (action.type) {
    case reducerActions.INCREMENT:
      return state + 1;
    case reducerActions.DECREMENT:
      return state - 1;
    default:
      return state;
  }
};
