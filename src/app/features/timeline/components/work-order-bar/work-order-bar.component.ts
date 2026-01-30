import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WorkOrderDocument,
  WORK_ORDER_STATUS_CONFIG,
} from '../../../../core/models/work-order.model';
import { DropdownMenuService } from '../../../../core/services/dropdown-menu.service';
import { DateUtils } from '../../../../shared/utils/date.utils';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-order-bar.component.html',
  styleUrl: './work-order-bar.component.scss',
})
export class WorkOrderBarComponent {
  @Input() workOrder!: WorkOrderDocument;
  @Input() left: number = 0;
  @Input() width: number = 0;
  @Output() edit = new EventEmitter<WorkOrderDocument>();
  @Output() delete = new EventEmitter<string>();

  get statusConfig() {
    return WORK_ORDER_STATUS_CONFIG[this.workOrder.data.status];
  }

  constructor(private dropdownMenuService: DropdownMenuService) {}

  onBarContentClick(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.workOrder);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();

    const button = event.target as HTMLElement;
    const rect = button.closest('.menu-button')?.getBoundingClientRect();

    if (rect) {
      const position = {
        top: rect.bottom + 4,
        left: rect.right - 140,
      };

      this.dropdownMenuService.showMenu(position, this.workOrder.docId);
    }
  }

  getTooltip(): string {
    const startDate = DateUtils.formatDateUS(DateUtils.parseDate(this.workOrder.data.startDate));
    const endDate = DateUtils.formatDateUS(DateUtils.parseDate(this.workOrder.data.endDate));
    return `${this.workOrder.data.name}\n${startDate} - ${endDate}\nStatus: ${this.statusConfig.label}`;
  }
}
