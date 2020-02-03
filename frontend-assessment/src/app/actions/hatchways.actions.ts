import { createAction, props } from '@ngrx/store';
import { WorkOrders } from '../models/work-orders';
import { Worker } from '../models/worker';

export const putWorkOrders = createAction('[Hatchways] put work orders', props<{workOrders: WorkOrders}>());
export const putWorker = createAction('[Hatchways] put worker', props<{id: number, worker: Worker}>());
export const fetchWorkOrders = createAction('[Hatchways] fetch work orders');
export const fetchWorker = createAction('[Hatchways] fetch worker', props<{ id: number }>());
