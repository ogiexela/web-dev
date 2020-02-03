import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HatchwaysService } from './services/hatchways.service';
import { fetchWorkOrders, putWorkOrders, fetchWorker, putWorker } from './actions/hatchways.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { WorkOrder } from './models/work-order';
import { WorkOrders } from './models/work-orders';

@Injectable()
export class AppEffects {

  fetchWorkOrders$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(fetchWorkOrders),
        mergeMap(
          () => this.hatchwaysService
            .getWorkOrders()
            .pipe(
              map(workOrders => putWorkOrders({ workOrders: this.reduceWorkOrders(workOrders) })),
              catchError(() => EMPTY)
            )),
      ),
  );

  fetchWorker$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(fetchWorker),
        mergeMap(
          (action) => this.hatchwaysService
            .getWorker(action.id)
            .pipe(
              map(worker => putWorker({ worker, id: action.id })),
              catchError(() => EMPTY)
            )),
      ),
  );

  constructor(
    private actions$: Actions,
    private hatchwaysService: HatchwaysService,
  ) { }

  private reduceWorkOrders(workOrders: WorkOrder[]): WorkOrders {
    return workOrders.reduce<WorkOrders>((red, order) => {
      red[order.id] = order;
      return red;
    }, {});
  }
}
