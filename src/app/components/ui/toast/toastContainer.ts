import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastSeverity } from '@/ui/toast/types';
import { ToastService } from '@/services/ui/toast/toastService';


@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./toastContainer.html",
})
export class ToastContainerComponent {
  toasts: Toast[] = [];
  ToastSeverity = ToastSeverity;

  constructor(public toastService: ToastService) {
    this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  close(id: string): void {
    this.toastService.removeToast(id);
  }
}