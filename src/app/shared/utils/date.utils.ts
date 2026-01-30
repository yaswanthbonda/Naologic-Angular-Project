import {
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
  differenceInDays,
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from 'date-fns';

export type TimeScale = 'day' | 'week' | 'month';

export interface DateColumn {
  date: Date;
  label: string;
  isToday: boolean;
}

export class DateUtils {
  /**
   * Generate date columns for the timeline based on zoom level
   */
  static generateDateColumns(startDate: Date, endDate: Date, timeScale: TimeScale): DateColumn[] {
    const today = startOfDay(new Date());

    switch (timeScale) {
      case 'day':
        return eachDayOfInterval({ start: startDate, end: endDate }).map((date) => ({
          date,
          label: format(date, 'MMM d'), // Keep this short format for day view
          isToday: startOfDay(date).getTime() === today.getTime(),
        }));

      case 'week':
        return eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 }).map(
          (date) => ({
            date,
            label: `Week of ${format(date, 'MMM d')}`,
            isToday: startOfWeek(today, { weekStartsOn: 1 }).getTime() === date.getTime(),
          })
        );

      case 'month':
        return eachMonthOfInterval({ start: startDate, end: endDate }).map((date) => ({
          date,
          label: format(date, 'MMMM yyyy'),
          isToday: startOfMonth(today).getTime() === date.getTime(),
        }));
    }
  }

  /**
   * Get the visible date range based on current date and zoom level
   */
  static getVisibleRange(
    timeScale: TimeScale,
    centerDate: Date = new Date()
  ): { start: Date; end: Date } {
    const center = startOfDay(centerDate);

    switch (timeScale) {
      case 'day':
        return {
          start: addDays(center, -14), // 2 weeks before
          end: addDays(center, 14), // 2 weeks after
        };

      case 'week':
        return {
          start: addWeeks(startOfWeek(center, { weekStartsOn: 1 }), -8), // 8 weeks before
          end: addWeeks(startOfWeek(center, { weekStartsOn: 1 }), 8), // 8 weeks after
        };

      case 'month':
        return {
          start: addMonths(startOfMonth(center), -6), // 6 months before
          end: addMonths(startOfMonth(center), 6), // 6 months after
        };
    }
  }

  /**
   * Calculate position of a work order bar on the timeline
   */
  static calculateBarPosition(
    workOrderStart: string,
    workOrderEnd: string,
    timelineStart: Date,
    timelineEnd: Date,
    containerWidth: number
  ): { left: number; width: number } {
    const start = new Date(workOrderStart);
    const end = new Date(workOrderEnd);

    const totalDays = differenceInDays(timelineEnd, timelineStart);
    const startOffset = differenceInDays(start, timelineStart);
    const duration = differenceInDays(end, start) + 1; // +1 to include end date

    const pixelsPerDay = containerWidth / totalDays;

    return {
      left: startOffset * pixelsPerDay,
      width: duration * pixelsPerDay,
    };
  }

  /**
   * Convert a click position on the timeline to a date
   */
  static clickPositionToDate(
    clickX: number,
    timelineStart: Date,
    timelineEnd: Date,
    containerWidth: number
  ): Date {
    const totalDays = differenceInDays(timelineEnd, timelineStart);
    const pixelsPerDay = containerWidth / totalDays;
    const daysFromStart = Math.floor(clickX / pixelsPerDay);

    return addDays(timelineStart, daysFromStart);
  }

  /**
   * Format date for US format display (MM/DD/YYYY)
   */
  static formatDateUS(date: Date): string {
    return format(date, 'MM/dd/yyyy');
  }

  /**
   * Format date for input field (yyyy-MM-dd)
   */
  static formatDateForInput(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  /**
   * Parse date string to Date object
   */
  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}
