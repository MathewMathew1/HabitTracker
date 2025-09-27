import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { UserHabit } from '@/habits/types';
import { HabitService } from './habitService';
import { ToastService } from '../ui/toast/toastService';
import  { ToastSeverity } from '@/ui/toast/types';

export interface RoutineData {
  userHabits: UserHabit[];
  isActive: boolean;
}

const STORAGE_KEY = 'habit-routine';

interface StoredUserHabit {
  id: string;
  severity: number;
}

interface StoredRoutine {
  habits: StoredUserHabit[];
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserHabitsService {
  private routine: RoutineData = { userHabits: [], isActive: false };
  private storage?: Storage;

  constructor(private habitService: HabitService, private toastService: ToastService, @Inject(DOCUMENT) private document: Document) {
    this.storage = this.document.defaultView?.localStorage;
    this.loadRoutine();
  }

  getUserHabits(): UserHabit[] {
    return this.routine.userHabits;
  }

  getIsActive(): boolean {
    return this.routine.isActive;
  }

  setUserHabits(habits: UserHabit[]): void {
    this.routine.userHabits = habits;
  }

  setIsActive(active: boolean): void {
    this.routine.isActive = active;
  }

  saveRoutine(userHabits: UserHabit[], isActive: boolean): void {
    const habits: StoredUserHabit[] = userHabits.map((u) => ({
      id: u.habit.id,
      severity: u.severity,
    }));
    this.routine = {userHabits, isActive}
    const stored: StoredRoutine = { habits, isActive };

    try {
      if (this.storage) {
        this.storage.setItem(STORAGE_KEY, JSON.stringify(stored));
      }
      this.toastService.addToast({message: "Saved user hobbies successfully", severity: ToastSeverity.success, duration: 5000})
    } catch (e) {
      this.toastService.addToast({message: "Unable to save user hobbies", severity: ToastSeverity.error, duration: 5000})
      console.log(e);
    }
  }

  private loadRoutine(): void {
    try {
      if (!this.storage) return;

      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as StoredRoutine | unknown;
      if (!parsed || typeof parsed !== 'object') return;

      const { habits, isActive } = parsed as StoredRoutine;
      if (!Array.isArray(habits)) return;

      const userHabits: UserHabit[] = habits
        .map(({ id, severity }) => {
          const habit = this.habitService.getHabitById(id);
          if (!habit) return null;
          return { habit, severity };
        })
        .filter((h): h is UserHabit => h !== null);

      this.routine.userHabits = userHabits;
      this.routine.isActive = isActive;
    } catch (e) {
      console.log(e);
    }
  }
}
