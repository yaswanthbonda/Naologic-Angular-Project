import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderBarComponent } from '../work-order-bar/work-order-bar.component';
import { WorkCenterDocument } from '../../../../core/models/work-center.model';
import { WorkOrderDocument } from '../../../../core/models/work-order.model';
import { TimeScale, DateUtils, DateColumn } from '../../../../shared/utils/date.utils';

@Component({
  selector: 'app-timeline-grid',
  standalone: true,
  imports: [CommonModule, WorkOrderBarComponent],
  templateUrl: './timeline-grid.component.html',
  styleUrl: './timeline-grid.component.scss',
})
export class TimelineGridComponent implements OnInit, OnChanges {
  @Input() workCenters: WorkCenterDocument[] = [];
  @Input() workOrders: WorkOrderDocument[] = [];
  @Input() timeScale: TimeScale = 'day';

  @Output() timelineClick = new EventEmitter<{ workCenterId: string; date: Date }>();
  @Output() editWorkOrder = new EventEmitter<WorkOrderDocument>();
  @Output() deleteWorkOrder = new EventEmitter<string>();

  dateColumns: DateColumn[] = [];
  timelineStart!: Date;
  timelineEnd!: Date;

  // Adjust column width based on time scale
  get columnWidth(): number {
    switch (this.timeScale) {
      case 'day':
        return 80;
      case 'week':
        return 120;
      case 'month':
        return 150;
    }
  }

  ngOnInit(): void {
    this.generateTimeline();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeScale']) {
      this.generateTimeline();
    }
  }

  generateTimeline(): void {
    const range = DateUtils.getVisibleRange(this.timeScale);
    this.timelineStart = range.start;
    this.timelineEnd = range.end;
    this.dateColumns = DateUtils.generateDateColumns(
      this.timelineStart,
      this.timelineEnd,
      this.timeScale
    );
    console.log('Timeline generated:', {
      start: this.timelineStart,
      end: this.timelineEnd,
      columns: this.dateColumns.length,
      workOrders: this.workOrders.length,
    });
  }

  getWorkOrdersForWorkCenter(workCenterId: string): WorkOrderDocument[] {
    return this.workOrders.filter((wo) => wo.data.workCenterId === workCenterId);
  }

  getWorkOrderPosition(workOrder: WorkOrderDocument): { left: number; width: number } {
    const containerWidth = this.dateColumns.length * this.columnWidth;
    const position = DateUtils.calculateBarPosition(
      workOrder.data.startDate,
      workOrder.data.endDate,
      this.timelineStart,
      this.timelineEnd,
      containerWidth
    );
    console.log('Work order position:', workOrder.data.name, position);
    return position;
  }

  onRowClick(event: MouseEvent, workCenterId: string): void {
    const target = event.target as HTMLElement;

    // Don't trigger if clicking on a work order bar
    if (target.closest('.work-order-bar')) {
      return;
    }

    const row = event.currentTarget as HTMLElement;
    const timelineScroll = row.querySelector('.timeline-scroll-wrapper') as HTMLElement;
    if (!timelineScroll) return;

    const timelineGrid = timelineScroll.querySelector('.timeline-dates') as HTMLElement;
    if (!timelineGrid) return;

    const rect = timelineGrid.getBoundingClientRect();
    const scrollLeft = timelineScroll.scrollLeft;
    const clickX = event.clientX - rect.left + scrollLeft;
    const containerWidth = this.dateColumns.length * this.columnWidth;

    const clickedDate = DateUtils.clickPositionToDate(
      clickX,
      this.timelineStart,
      this.timelineEnd,
      containerWidth
    );

    this.timelineClick.emit({ workCenterId, date: clickedDate });
  }

  onEditWorkOrder(workOrder: WorkOrderDocument): void {
    this.editWorkOrder.emit(workOrder);
  }

  onDeleteWorkOrder(docId: string): void {
    this.deleteWorkOrder.emit(docId);
  }

  getTodayPosition(): number {
    const today = new Date();
    const containerWidth = this.dateColumns.length * this.columnWidth;
    const position = DateUtils.calculateBarPosition(
      today.toISOString().split('T')[0],
      today.toISOString().split('T')[0],
      this.timelineStart,
      this.timelineEnd,
      containerWidth
    );
    return position.left;
  }

  isTodayVisible(): boolean {
    const today = new Date();
    return today >= this.timelineStart && today <= this.timelineEnd;
  }
}
