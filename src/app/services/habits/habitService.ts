import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { HABITS } from '@/habits/habits';
import { Habit } from '@/habits/types';
import { ToastService } from '@/services/ui/toast/toastService';
import { ToastSeverity } from '@/ui/toast/types';
import { BehaviorSubject } from 'rxjs';

const CUSTOM_HABITS_KEY = 'custom-habits';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private habits: Habit[] = [...HABITS];

  private customHabitSubject = new BehaviorSubject<Habit | null>(null);
  public customHabit$ = this.customHabitSubject.asObservable();

  private storage?: Storage;

  constructor(private toastService: ToastService, @Inject(DOCUMENT) private document: Document) {
    this.storage = this.document.defaultView?.localStorage;
    this.loadCustomHabits();
  }

  getHabitById(id: string): Habit | undefined {
    return this.habits.find((h) => h.id === id);
  }

  getAllHabits(): Habit[] {
    return this.habits;
  }

  saveCustomHabit(habit: Habit) {

    if (!this.storage) {
      this.toastService.addToast({
        message: 'Unable to save custom habit',
        severity: ToastSeverity.error,
        duration: 5000,
      });
      return;
    }
    const stored = this.storage.getItem(CUSTOM_HABITS_KEY);
    const arr: Habit[] = stored ? JSON.parse(stored) : [];
    arr.push(habit);
    this.storage.setItem(CUSTOM_HABITS_KEY, JSON.stringify(arr));

    this.habits.push(habit);
    this.customHabitSubject.next(habit);

    this.toastService.addToast({
      message: 'Created custom habit',
      severity: ToastSeverity.success,
      duration: 5000,
    });
  }

  private loadCustomHabits() {
    if (!this.storage) return;

    const stored = this.storage.getItem(CUSTOM_HABITS_KEY);
    if (stored) {
      try {
        const arr: Habit[] = JSON.parse(stored);
        this.habits.push(...arr);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
