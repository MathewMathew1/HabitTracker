import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Reports } from '@/reports/types';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '@/services/report/reportService';
import { FiledReportsService } from '@/services/report/filledReportService';

@Component({
  selector: 'app-report-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-item.html',
  styleUrls: ['./report-item.css'],
})
export class ReportItemComponent {
  private _report!: Reports;

  @Input()
  set report(value: Reports) {
    this._report = value;

    const initialGrades: Record<string, number> = {};
    value.userHabits.forEach((h) => {
      initialGrades[h.habit.id] = 3;
    });
    this.grades.set(initialGrades);
  }
  get report(): Reports {
    return this._report;
  }

  constructor(
    private reportService: ReportsService,
    private reportFilledService: FiledReportsService
  ) {}

  spoilerOpen = signal(false);
  grades = signal<Record<string, number>>({});
  note = signal('');

  toggleSpoiler() {
    this.spoilerOpen.set(!this.spoilerOpen());
  }

  setGrade(habitId: string, value: number) {
    this.grades.update((current) => ({ ...current, [habitId]: value }));
  }

  save() {
    this.reportFilledService.createFiledReport(this.note(), this.grades(), this.report);
    this.reportService.deleteReportByDate(this.report.date);
  }

  getRangeColor(value: number | undefined): string {
    if (!value) return '#e5e7eb';
    switch (value) {
      case 1:
        return '#f87171';
      case 2:
        return '#fbbf24';
      case 3:
        return '#facc15';
      case 4:
        return '#34d399';
      case 5:
        return '#0cf73b';
      default:
        return '#e5e7eb';
    }
  }
}
