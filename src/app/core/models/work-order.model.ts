export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    status: WorkOrderStatus;
    startDate: string;
    endDate: string;
  };
}

export interface WorkOrderStatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

export const WORK_ORDER_STATUS_CONFIG: Record<WorkOrderStatus, WorkOrderStatusConfig> = {
  open: {
    label: 'Open',
    color: '#3b82f6',
    bgColor: '#dbeafe',
  },
  'in-progress': {
    label: 'In Progress',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
  },
  complete: {
    label: 'Complete',
    color: '#10b981',
    bgColor: '#d1fae5',
  },
  blocked: {
    label: 'Blocked',
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
};
