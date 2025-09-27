import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FiledReport } from '@/reports/types';

@Component({
  selector: 'app-filled-report-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-filled-item.html',
  styleUrls: ['./report-filled-item.css'],
})
export class FilledReportItemComponent {
  @Input() report!: FiledReport;

  spoilerOpen = signal(false);

  toggleSpoiler() {
    this.spoilerOpen.set(!this.spoilerOpen());
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

  getGradeColor(value: number): string {
    if (!value) return '#d1d5db';
    if (value <= 3) return '#ef4444'; 
    if (value <= 5) return '#f97316'; 
    if (value <= 7) return '#eab308'; 
    if (value <= 9) return '#22c55e';
    return '#16a34a';
  }
}
