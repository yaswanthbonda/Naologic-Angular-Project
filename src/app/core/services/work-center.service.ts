import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkCenterDocument } from '../models/work-center.model';
import { WORK_CENTERS } from '../../data/sample-data';

@Injectable({
  providedIn: 'root',
})
export class WorkCenterService {
  private workCentersSubject = new BehaviorSubject<WorkCenterDocument[]>(WORK_CENTERS);
  public workCenters$: Observable<WorkCenterDocument[]> = this.workCentersSubject.asObservable();

  getWorkCenters(): WorkCenterDocument[] {
    return this.workCentersSubject.value;
  }

  getWorkCenterById(id: string): WorkCenterDocument | undefined {
    return this.workCentersSubject.value.find((wc) => wc.docId === id);
  }
}
