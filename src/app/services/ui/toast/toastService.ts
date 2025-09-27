import { Toast, ToastSeverity } from '@/ui/toast/types';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  constructor() {}

  addToast({
    message,
    severity,
    duration = 5000,
  }: {
    message: string;
    severity: ToastSeverity;
    duration?: number;
  }) {
    const id = crypto.randomUUID();
    const toast: Toast = { id, message, severity, duration };
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);

       
      }, duration);
    }
  }

  removeToast(id: string): void {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}
