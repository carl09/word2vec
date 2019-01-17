// tslint:disable:max-classes-per-file

export interface IWorkerAction {
  action: ActionType;
}

export const createActionUnsubscribeKey = (workerActions: WorkerActions) => {
  switch (workerActions.action) {
    case 'listen': {
      const d = workerActions as ListenWorkerAction;
      return d.reducer;
    }
    case 'execute': {
      const d = workerActions as ExecuteWorkerAction;
      return `${d.key}-${d.uniqueRef}`;
    }
    default:
      return '';
  }
};

export class ReducerWorkerAction implements IWorkerAction {
  public action: ActionType = 'reducer';
  public payload: any;
}

export class ListenWorkerAction implements IWorkerAction {
  public action: ActionType = 'listen';
  public reducer: string;
  constructor(reducer: string) {
    this.reducer = reducer;
  }
}

export class ExecuteWorkerAction implements IWorkerAction {
  public action: ActionType = 'execute';
  public key: string;
  public uniqueRef: string;
  public args: any[];
  constructor(key: string, uniqueRef: string, args: any[]) {
    this.key = key;
    this.uniqueRef = uniqueRef;
    this.args = args;
  }
}

export class UnsubscribeWorkerAction implements IWorkerAction {
  public action: ActionType = 'unsubscribe';
  public key: string;
  constructor(workerActions: WorkerActions) {
    this.key = createActionUnsubscribeKey(workerActions);
  }
}

export type ActionType = 'reducer' | 'listen' | 'execute' | 'unsubscribe';

export type WorkerActions =
  | ReducerWorkerAction
  | ListenWorkerAction
  | ExecuteWorkerAction
  | UnsubscribeWorkerAction;
