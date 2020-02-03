import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerComponent } from './worker.component';

@NgModule({
  declarations: [
    WorkerComponent,
  ],
  exports: [
    WorkerComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class WorkerModule { }
