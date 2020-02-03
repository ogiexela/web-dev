import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { fetchWorkOrders, fetchWorker } from './actions/hatchways.actions';
import { takeWhile, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { State } from './reducers';
import { fromEvent } from 'rxjs';
import { WorkOrders } from './models/work-orders';
import { Workers } from './models/workers';
import { WorkOrder } from './models/work-order';
import { Worker } from './models/worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private active = false;
  private fetchingWorkers = {};
  public workOrders: WorkOrders = {};
  public filteredWorkOrders: WorkOrders = {};
  public workerNameFilter = '';
  public workers: Workers = {};
  public latestFirst = false;

  @ViewChild('nameFilterInput', { static: true }) nameFilterInput: ElementRef;

  constructor(
    private store: Store<State>,
  ) { }

  ngOnInit(): void {
    this.active = true;
    this.subscribeToWorkOrders();
    this.subscribeToWorkers();
    this.store.dispatch(fetchWorkOrders());

    fromEvent(this.nameFilterInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((text: string) => {
        this.filterByName(text);
      });
  }

  private subscribeToWorkOrders() {
    this.subscribeToStore('workOrders')
      .subscribe((data: WorkOrders) => {
        this.workOrders = data;
        if (!this.workerNameFilter) {
          this.filteredWorkOrders = data;
          return;
        }

        const filteredOrders = Object.values(data).filter(order => {
          const worker: Worker = this.workers[order.workerId];
          if (!worker) {
            return false;
          }
          return worker.name.includes(this.workerNameFilter);
        });

        this.filteredWorkOrders = filteredOrders.reduce((red, order) => {
          red[order.id] = order;
          return red;
        }, {});
      });
  }

  public sortWorkOrders(latestFirst: boolean): void {
    this.latestFirst = latestFirst;
  }

  public get workOrderArray(): WorkOrder[] {
    return Object
      .values(this.filteredWorkOrders)
      .sort((a: WorkOrder, b: WorkOrder) => {
        if (this.latestFirst) {
          return b.deadline - a.deadline;
        } else {
          return a.deadline - b.deadline;
        }
      });
  }

  private filterByName(name: string): void {
    this.workerNameFilter = name.toLowerCase();

    if (!this.workerNameFilter) {
      this.filteredWorkOrders = this.workOrders;
      return;
    }

    const filteredOrders = Object.values(this.workOrders).filter(order => {
      const worker = this.workers[order.workerId];
      if (!worker) {
        return false;
      }
      return worker.name.toLowerCase().includes(this.workerNameFilter);
    });

    this.filteredWorkOrders = filteredOrders.reduce((red, order) => {
      red[order.id] = order;
      return red;
    }, {});

  }

  private subscribeToWorkers() {
    this.subscribeToStore('workers')
      .subscribe((data: Workers) => {
        this.workers = data;
      });
  }

  private subscribeToStore(store: 'workOrders' | 'workers') {
    return this.store
      .pipe(
        takeWhile(() => this.active),
        select(store)
      );
  }

  public fetchWorker(id: number): void {

    const worker = this.workers[id];

    if (!worker && worker !== null) {
      if (!this.fetchingWorkers[id]) {
        this.store.dispatch(fetchWorker({ id }));
        this.fetchingWorkers[id] = true;
      }
      return null;
    }

    if (worker && this.fetchingWorkers[id]) {
      delete this.fetchingWorkers[id];
    }

  }

}
