import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkOrder } from '../models/work-order';
import { WorkOrdersResponse } from '../models/work-orders-response';
import { WorkResponse } from '../models/work-response';
import { Worker } from '../models/worker';
import { map } from 'rxjs/operators';


const HATCHWAYS_API_URL_WORKERS = 'https://www.hatchways.io/api/assessment/workers';
const HATCHWAYS_API_URL_WORK_ORDERS = 'https://www.hatchways.io/api/assessment/work_orders';

@Injectable({
  providedIn: 'root'
})
export class HatchwaysService {

  constructor(private http: HttpClient) { }

  public getWorkOrders(): Observable<WorkOrder[]> {
    return this.http
      .get(HATCHWAYS_API_URL_WORK_ORDERS)
      .pipe(
        map((response: WorkOrdersResponse) => response.orders),
      );
  }

  public getWorker(id: number): Observable<Worker> {
    return this.http.get(`${HATCHWAYS_API_URL_WORKERS}/${id}`)
      .pipe(
        map((response: WorkResponse) => response.worker)
      );
  }
}
