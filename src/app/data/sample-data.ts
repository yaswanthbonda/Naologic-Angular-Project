import { WorkCenterDocument } from '../core/models/work-center.model';
import { WorkOrderDocument } from '../core/models/work-order.model';

export const WORK_CENTERS: WorkCenterDocument[] = [
  {
    docId: 'wc-1',
    docType: 'workCenter',
    data: { name: 'Extrusion Line A' },
  },
  {
    docId: 'wc-2',
    docType: 'workCenter',
    data: { name: 'CNC Machine 1' },
  },
  {
    docId: 'wc-3',
    docType: 'workCenter',
    data: { name: 'Assembly Station' },
  },
  {
    docId: 'wc-4',
    docType: 'workCenter',
    data: { name: 'Quality Control' },
  },
  {
    docId: 'wc-5',
    docType: 'workCenter',
    data: { name: 'Packaging Line' },
  },
];

export const WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Batch #A-2401',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2026-01-20',
      endDate: '2026-01-25',
    },
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Widget Production',
      workCenterId: 'wc-2',
      status: 'open',
      startDate: '2026-01-28',
      endDate: '2026-02-03',
    },
  },
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'Assembly Run #45',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2026-01-27',
      endDate: '2026-01-31',
    },
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Final Assembly',
      workCenterId: 'wc-3',
      status: 'open',
      startDate: '2026-02-01',
      endDate: '2026-02-05',
    },
  },
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'QC Inspection Batch',
      workCenterId: 'wc-4',
      status: 'blocked',
      startDate: '2026-01-26',
      endDate: '2026-02-02',
    },
  },
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Package Order #891',
      workCenterId: 'wc-5',
      status: 'complete',
      startDate: '2026-01-22',
      endDate: '2026-01-26',
    },
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Batch B',
      workCenterId: 'wc-1',
      status: 'in-progress',
      startDate: '2026-01-27',
      endDate: '2026-02-01',
    },
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'CNC Parts Order',
      workCenterId: 'wc-2',
      status: 'complete',
      startDate: '2026-01-18',
      endDate: '2026-01-24',
    },
  },
];
