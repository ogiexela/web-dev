import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WorkOrder } from '../../models/work-order';
import { Workers } from '../../models/workers';
import { Worker } from '../../models/worker';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.css']
})
export class WorkOrderComponent {

  @Input() workOrder: WorkOrder;
  @Input() workers: Workers = {};
  @Output() workerFetcher: EventEmitter<number> = new EventEmitter<number>();

  public get worker(): Worker {
    const worker = this.workers[this.workOrder.workerId];

    if (!worker && worker !== null) {
      this.workerFetcher.emit(this.workOrder.workerId);
    }

    return worker;
  }
}
