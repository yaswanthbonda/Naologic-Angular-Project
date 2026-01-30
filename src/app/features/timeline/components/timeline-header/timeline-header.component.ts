import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TimeScale } from '../../../../shared/utils/date.utils';

@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './timeline-header.component.html',
  styleUrl: './timeline-header.component.scss',
})
export class TimelineHeaderComponent {
  @Input() selectedTimeScale: TimeScale = 'day';
  @Output() timeScaleChange = new EventEmitter<TimeScale>();

  timeScaleOptions: { value: TimeScale; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  onTimeScaleChange(timeScale: TimeScale): void {
    this.timeScaleChange.emit(timeScale);
  }
}
