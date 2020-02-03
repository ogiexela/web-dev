import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  on,
  createReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { putWorkOrders, putWorker } from '../actions/hatchways.actions';
import { WorkOrders } from '../models/work-orders';
import { Workers } from '../models/workers';

export interface State {
  workOrders: WorkOrders;
  workers: Workers;
}

export const workOrdersReducer = createReducer(
  {} as WorkOrders,
  on(putWorkOrders, (state, action) => {
    return Object.assign({}, state, action.workOrders);
  }),
);

export const workerReducer = createReducer(
  {} as Workers,
  on(putWorker, (state, action) => {
    return Object.assign({}, state, {[action.id]: action.worker});
  }),
);


export const reducers: ActionReducerMap<State> = {
  workers: workerReducer,
  workOrders: workOrdersReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
