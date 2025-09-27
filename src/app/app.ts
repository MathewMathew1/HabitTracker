import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar";
import { ToastContainerComponent } from "./components/ui/toast/toastContainer";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('habit-tracker');

 

  darkMode = signal(false);

  toggleDark() {
    this.darkMode.set(!this.darkMode());

    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
