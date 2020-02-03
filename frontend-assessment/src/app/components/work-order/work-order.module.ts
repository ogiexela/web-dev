import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderComponent } from './work-order.component';
import { WorkerModule } from '../worker/worker.module';

@NgModule({
  declarations: [
    WorkOrderComponent,
  ],
  exports: [
    WorkOrderComponent,
  ],
  imports: [
    CommonModule,
    WorkerModule,
  ]
})
export class WorkOrderModule { }
