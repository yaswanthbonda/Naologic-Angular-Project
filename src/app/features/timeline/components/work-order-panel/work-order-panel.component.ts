import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkCenterDocument } from '../../../../core/models/work-center.model';
import { WorkOrderDocument, WorkOrderStatus } from '../../../../core/models/work-order.model';
import { WorkOrderService } from '../../../../core/services/work-order.service';
import { format, addDays } from 'date-fns';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './work-order-panel.component.html',
  styleUrl: './work-order-panel.component.scss',
})
export class WorkOrderPanelComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() workOrder: WorkOrderDocument | null = null;
  @Input() workCenters: WorkCenterDocument[] = [];
  @Input() prefilledWorkCenterId: string | null = null;
  @Input() prefilledStartDate: Date | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<WorkOrderDocument>();

  workOrderForm!: FormGroup;

  statusOptions: { value: WorkOrderStatus; label: string }[] = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'blocked', label: 'Blocked' },
  ];

  constructor(private fb: FormBuilder, private workOrderService: WorkOrderService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    if (this.mode === 'edit' && this.workOrder) {
      // Edit mode - populate with existing data
      this.workOrderForm = this.fb.group({
        name: [this.workOrder.data.name, Validators.required],
        workCenterId: [this.workOrder.data.workCenterId, Validators.required],
        status: [this.workOrder.data.status, Validators.required],
        startDate: [this.workOrder.data.startDate, Validators.required],
        endDate: [this.workOrder.data.endDate, Validators.required],
      });
    } else {
      // Create mode - use prefilled values or defaults
      const startDate = this.prefilledStartDate || new Date();
      const endDate = addDays(startDate, 7);

      this.workOrderForm = this.fb.group({
        name: ['', Validators.required],
        workCenterId: [this.prefilledWorkCenterId || '', Validators.required],
        status: ['open', Validators.required],
        startDate: [format(startDate, 'yyyy-MM-dd'), Validators.required],
        endDate: [format(endDate, 'yyyy-MM-dd'), Validators.required],
      });
    }
  }

  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'MM/dd/yyyy');
  }

  onSubmit(): void {
    if (this.workOrderForm.invalid) {
      Object.keys(this.workOrderForm.controls).forEach((key) => {
        this.workOrderForm.controls[key].markAsTouched();
      });
      return;
    }

    const formValue = this.workOrderForm.value;

    // Validate end date is after start date
    if (new Date(formValue.endDate) <= new Date(formValue.startDate)) {
      alert('End date must be after start date');
      return;
    }

    const workOrderData: WorkOrderDocument = {
      docId:
        this.mode === 'edit' && this.workOrder
          ? this.workOrder.docId
          : this.workOrderService.generateId(),
      docType: 'workOrder',
      data: {
        name: formValue.name,
        workCenterId: formValue.workCenterId,
        status: formValue.status,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
      },
    };

    this.save.emit(workOrderData);
  }

  onCancel(): void {
    this.close.emit();
  }

  onBackdropClick(): void {
    this.close.emit();
  }

  onPanelClick(event: Event): void {
    event.stopPropagation();
  }
}
