import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DropdownMenuData {
  show: boolean;
  position: { top: number; left: number };
  workOrderId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DropdownMenuService {
  private menuSubject = new Subject<DropdownMenuData>();
  public menu$ = this.menuSubject.asObservable();

  showMenu(position: { top: number; left: number }, workOrderId: string): void {
    this.menuSubject.next({ show: true, position, workOrderId });
  }

  hideMenu(): void {
    this.menuSubject.next({ show: false, position: { top: 0, left: 0 } });
  }
}
