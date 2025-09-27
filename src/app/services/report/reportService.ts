import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { UserHabitsService } from '@/services/habits/userHabits';
import { Reports } from '@/reports/types';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'habit-reports';
const LAST_GENERATED_KEY = 'habit-reports-last-generated';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private lastGenerated: Date;
  private storage?: Storage;

  private reportsSubject = new BehaviorSubject<Reports[]>([]);
  reports$ = this.reportsSubject.asObservable();

  constructor(
    private routineService: UserHabitsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.storage = this.document.defaultView?.localStorage ?? undefined;

    if (this.storage) {
      const storedDate = this.storage.getItem(LAST_GENERATED_KEY);
      this.lastGenerated = storedDate ? new Date(storedDate) : this.yesterday();
      const storedReports = this.storage.getItem(STORAGE_KEY);
      if (storedReports) {
        try {
          this.reportsSubject.next(JSON.parse(storedReports) as Reports[]);
        } catch {}
      }
    } else {
      this.lastGenerated = this.yesterday();
    }

    this.listenToRoutineActive();
  }

  private yesterday(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  private listenToRoutineActive() {

    setInterval(() => {
      if (this.routineService.getIsActive()) {
        this.generateMissingReports();
      }
 
    }, 1000 * 5);
  }

  getReports(): Reports[] {
    if (!this.storage) return [];
    const stored = this.storage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as Reports[];
    } catch {
      return [];
    }
  }

  private saveReports(reports: Reports[]) {
    this.reportsSubject.next(reports);
    if (this.storage) {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(reports));
    }
  }

  generateMissingReports() {
    const reports = [...this.getReports()];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let last = new Date(this.lastGenerated);
    last.setHours(0, 0, 0, 0);

    const userHabits = this.routineService.getUserHabits();
    if (!userHabits.length) {
      this.lastGenerated = this.yesterday();
      if (this.storage) this.storage.setItem(LAST_GENERATED_KEY, this.lastGenerated.toISOString());
      return;
    }

    const missingDays: Date[] = [];
    let d = new Date(last);
    d.setDate(d.getDate() + 1);

    while (d <= today) {
      missingDays.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }

    missingDays.forEach((day) => {
      reports.push({
        date: day,
        userHabits: userHabits.map((h) => ({ ...h })),
      });
    });

    if (missingDays.length) {
      this.saveReports(reports);
      this.lastGenerated = today;
      if (this.storage) this.storage.setItem(LAST_GENERATED_KEY, this.lastGenerated.toISOString());
    }
  }

  deleteReportByDate(date: Date) {
    const reports = this.getReports();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const updatedReports = reports.filter((r) => {
      const reportDate = new Date(r.date);
      reportDate.setHours(0, 0, 0, 0);
      return reportDate.getTime() !== targetDate.getTime();
    });

    this.saveReports(updatedReports);
  }
}
