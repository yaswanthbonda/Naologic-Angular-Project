import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimelineHeaderComponent } from './components/timeline-header/timeline-header.component';
import { TimelineGridComponent } from './components/timeline-grid/timeline-grid.component';
import { WorkOrderPanelComponent } from './components/work-order-panel/work-order-panel.component';
import { WorkCenterService } from '../../core/services/work-center.service';
import { WorkOrderService } from '../../core/services/work-order.service';
import { DropdownMenuService } from '../../core/services/dropdown-menu.service';
import { WorkCenterDocument } from '../../core/models/work-center.model';
import { WorkOrderDocument } from '../../core/models/work-order.model';
import { TimeScale } from '../../shared/utils/date.utils';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimelineHeaderComponent, TimelineGridComponent, WorkOrderPanelComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit, OnDestroy {
  workCenters: WorkCenterDocument[] = [];
  workOrders: WorkOrderDocument[] = [];
  selectedTimeScale: TimeScale = 'day';

  showPanel = false;
  panelMode: 'create' | 'edit' = 'create';
  selectedWorkOrder: WorkOrderDocument | null = null;
  clickedWorkCenterId: string | null = null;
  clickedDate: Date | null = null;

  // Dropdown menu state
  showDropdownMenu = false;
  dropdownMenuPosition = { top: 0, left: 0 };
  dropdownWorkOrderId: string | null = null;

  private menuSubscription?: Subscription;

  constructor(
    private workCenterService: WorkCenterService,
    private workOrderService: WorkOrderService,
    private dropdownMenuService: DropdownMenuService
  ) {}

  ngOnInit(): void {
    this.loadData();

    // Subscribe to menu events
    this.menuSubscription = this.dropdownMenuService.menu$.subscribe((data) => {
      this.showDropdownMenu = data.show;
      this.dropdownMenuPosition = data.position;
      this.dropdownWorkOrderId = data.workOrderId || null;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  loadData(): void {
    this.workCenters = this.workCenterService.getWorkCenters();
    this.workOrderService.workOrders$.subscribe((orders) => {
      this.workOrders = orders;
    });
  }

  onTimeScaleChange(timeScale: TimeScale): void {
    this.selectedTimeScale = timeScale;
  }

  onTimelineClick(workCenterId: string, date: Date): void {
    this.panelMode = 'create';
    this.clickedWorkCenterId = workCenterId;
    this.clickedDate = date;
    this.selectedWorkOrder = null;
    this.showPanel = true;
  }

  onEditWorkOrder(workOrder: WorkOrderDocument): void {
    this.panelMode = 'edit';
    this.selectedWorkOrder = workOrder;
    this.clickedWorkCenterId = workOrder.data.workCenterId;
    this.clickedDate = null;
    this.showPanel = true;
  }

  onDeleteWorkOrder(docId: string): void {
    if (confirm('Are you sure you want to delete this work order?')) {
      this.workOrderService.deleteWorkOrder(docId);
    }
  }

  onPanelClose(): void {
    this.showPanel = false;
    this.selectedWorkOrder = null;
    this.clickedWorkCenterId = null;
    this.clickedDate = null;
  }

  onWorkOrderSave(workOrder: WorkOrderDocument): void {
    if (this.panelMode === 'create') {
      const success = this.workOrderService.createWorkOrder(workOrder);
      if (success) {
        this.showPanel = false;
        this.clickedWorkCenterId = null;
        this.clickedDate = null;
      } else {
        alert('Cannot create work order: overlaps with existing order on this work center.');
      }
    } else {
      const success = this.workOrderService.updateWorkOrder(workOrder);
      if (success) {
        this.showPanel = false;
        this.selectedWorkOrder = null;
        this.clickedWorkCenterId = null;
      } else {
        alert('Cannot update work order: overlaps with existing order on this work center.');
      }
    }
  }

  // Dropdown menu actions
  onDropdownEdit(): void {
    if (this.dropdownWorkOrderId) {
      const workOrder = this.workOrders.find((wo) => wo.docId === this.dropdownWorkOrderId);
      if (workOrder) {
        this.onEditWorkOrder(workOrder);
      }
    }
    this.closeDropdownMenu();
  }

  onDropdownDelete(): void {
    if (this.dropdownWorkOrderId) {
      this.onDeleteWorkOrder(this.dropdownWorkOrderId);
    }
    this.closeDropdownMenu();
  }

  closeDropdownMenu(): void {
    this.dropdownMenuService.hideMenu();
  }
}
