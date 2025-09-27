import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Reports, FiledReport } from '@/reports/types';
import { ReportsService } from '@/services/report/reportService';
import { ReportItemComponent } from "@/components/report-item/report-item";
import { FiledReportsService } from '@/services/report/filledReportService';
import { FilledReportItemComponent } from "@/components/report-filled-item/report-filled-item";

@Component({
  selector: 'app-report-section',
  standalone: true,
  imports: [CommonModule, ReportItemComponent, FilledReportItemComponent],
  templateUrl: './report-section.html',
  styleUrls: ['./report-section.css'],
})
export class ReportSectionComponent {
  @Input() title = '';

  reports: Reports[] = [];
  filledReports: FiledReport[] = [];

  constructor(public reportService: ReportsService, public filledReportService: FiledReportsService) {
    this.reportService.reports$.subscribe((reports) => {
      this.reports = reports;
    });
     this.filledReportService.filedReports$.subscribe((reports) => {
      this.filledReports = reports;
    });
  }
}
