import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '@/services/ui/toast/toastService';
import { ToastSeverity } from '@/ui/toast/types';
import { HabitService } from '@/services/habits/habitService';
import { FiledReport, GradedUserHabit, Reports } from '@/reports/types';
import { rateDailyPerformance } from '@/utilis/rateDailyPerformence';


const STORAGE_KEY = 'habit-filed-reports';

@Injectable({
  providedIn: 'root',
})
export class FiledReportsService {
  private storage?: Storage;
  private filedReportsSubject = new BehaviorSubject<FiledReport[]>([]);
  filedReports$ = this.filedReportsSubject.asObservable();

  constructor(
    private toastService: ToastService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.storage = this.document.defaultView?.localStorage ?? undefined;

    if (this.storage) {
      const stored = this.storage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as FiledReport[];
          this.filedReportsSubject.next(parsed);
        } catch {
          this.filedReportsSubject.next([]);
        }
      }
    }
  }

  private saveFiledReports(reports: FiledReport[]) {
    this.filedReportsSubject.next(reports);
    if (this.storage) {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(reports));
    }
  }

  getFiledReports(): FiledReport[] {
    return this.filedReportsSubject.getValue();
  }

  createFiledReport(note: string, grades: Record<string, number>, report: Reports) {
    const userHabitsGraded: GradedUserHabit[] = report.userHabits.map((uh) => ({
      userHabit: uh,
      grade: grades[uh.habit.id] ?? 1,
    }));

    const grade = rateDailyPerformance(report.userHabits, grades);

    const filedReport: FiledReport = {
      date: report.date,
      grade,
      userHabitsGraded,
      note,
    };

    const current = this.getFiledReports();
    const updated = [...current, filedReport];
    this.saveFiledReports(updated);

    this.toastService.addToast({
      message: 'Report filed successfully',
      severity: ToastSeverity.success,
      duration: 4000,
    });
  }

  deleteFiledReport(date: Date) {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const updated = this.getFiledReports().filter((fr) => {
      const d = new Date(fr.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() !== target.getTime();
    });

    this.saveFiledReports(updated);

    this.toastService.addToast({
      message: 'Filed report deleted',
      severity: ToastSeverity.success,
      duration: 3000,
    });
  }
}
