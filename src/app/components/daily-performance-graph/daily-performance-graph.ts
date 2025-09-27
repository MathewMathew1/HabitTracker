import { Component, DOCUMENT, effect, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexGrid,
  ApexYAxis,
  ApexTooltip,
  ChartComponent,
} from 'ng-apexcharts';
import { FiledReportsService } from '@/services/report/filledReportService';
import { FiledReport } from '@/reports/types';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-daily-performance-graph',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  templateUrl: './daily-performance-graph.html',
  styleUrls: ['./daily-performance-graph.css'],
})
export class DailyPerformanceGraphComponent {
  reports: FiledReport[] = [];
  public chartOptions!: ChartOptions;

  constructor(
    private filedReportsService: FiledReportsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    effect(() => {
      this.filedReportsService.filedReports$.subscribe((reports) => {
        this.reports = reports;
        this.updateChart();
      });
    });
  }

  private updateChart() {
    if (!this.reports.length) return;

    const sortedReports = [...this.reports].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dates = sortedReports.map((r) =>
      new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const scores = sortedReports.map((r) => r.grade ?? 0);

    const isDark = this.document.documentElement.classList.contains('dark');

    this.chartOptions = {
      series: [{ name: 'Daily Performance', data: scores }],
      chart: {
        height: 300,
        type: 'bar',
        toolbar: { show: false },
        foreColor: isDark ? '#E5E7EB' : '#1F2937',
      },
      dataLabels: { enabled: false },
      stroke: { show: false },
      xaxis: {
        categories: dates,
        labels: { style: { colors: Array(dates.length).fill(isDark ? '#E5E7EB' : '#1F2937') } },
      },
      yaxis: {
        min: 0,
        max: 10,
        tickAmount: 5,
        labels: { style: { colors: Array(5).fill(isDark ? '#E5E7EB' : '#1F2937') } },
      },
      grid: { borderColor: isDark ? '#374151' : '#e0e0e0' },
      title: { text: '', align: 'left' },
      tooltip: {
        enabled: true,
        theme: isDark ? 'dark' : 'light', 
        style: {
          fontSize: '12px',
          fontFamily: 'inherit',
        },
        y: {
          formatter: (val) => `${val}/10`,
        },
      },
    };
  }
}
