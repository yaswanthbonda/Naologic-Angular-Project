import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkOrderDocument } from '../models/work-order.model';
import { WORK_ORDERS } from '../../data/sample-data';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  private workOrdersSubject = new BehaviorSubject<WorkOrderDocument[]>(WORK_ORDERS);
  public workOrders$: Observable<WorkOrderDocument[]> = this.workOrdersSubject.asObservable();

  getWorkOrders(): WorkOrderDocument[] {
    return this.workOrdersSubject.value;
  }

  getWorkOrdersByWorkCenter(workCenterId: string): WorkOrderDocument[] {
    return this.workOrdersSubject.value.filter((wo) => wo.data.workCenterId === workCenterId);
  }

  createWorkOrder(workOrder: WorkOrderDocument): boolean {
    // Check for overlaps
    if (this.hasOverlap(workOrder)) {
      return false;
    }

    const currentOrders = this.workOrdersSubject.value;
    this.workOrdersSubject.next([...currentOrders, workOrder]);
    return true;
  }

  updateWorkOrder(workOrder: WorkOrderDocument): boolean {
    // Check for overlaps (excluding the current work order)
    if (this.hasOverlap(workOrder, workOrder.docId)) {
      return false;
    }

    const currentOrders = this.workOrdersSubject.value;
    const index = currentOrders.findIndex((wo) => wo.docId === workOrder.docId);

    if (index !== -1) {
      const updatedOrders = [...currentOrders];
      updatedOrders[index] = workOrder;
      this.workOrdersSubject.next(updatedOrders);
      return true;
    }

    return false;
  }

  deleteWorkOrder(docId: string): void {
    const currentOrders = this.workOrdersSubject.value;
    this.workOrdersSubject.next(currentOrders.filter((wo) => wo.docId !== docId));
  }

  private hasOverlap(workOrder: WorkOrderDocument, excludeId?: string): boolean {
    const ordersOnSameWorkCenter = this.getWorkOrdersByWorkCenter(
      workOrder.data.workCenterId
    ).filter((wo) => wo.docId !== excludeId);

    const start = new Date(workOrder.data.startDate);
    const end = new Date(workOrder.data.endDate);

    return ordersOnSameWorkCenter.some((wo) => {
      const existingStart = new Date(wo.data.startDate);
      const existingEnd = new Date(wo.data.endDate);

      // Check if dates overlap
      return start <= existingEnd && end >= existingStart;
    });
  }

  generateId(): string {
    return `wo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
