import { DOCUMENT, Inject, Injectable, signal } from '@angular/core';

const DARK_MODE_KEY = 'darkMode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  darkMode = signal(false);
  private storage?: Storage;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.storage = this.document.defaultView?.localStorage;

    const saved = this.storage?.getItem(DARK_MODE_KEY);
    if (saved === 'true') {
      this.darkMode.set(true);
      this.applyClass(true);
    } else {
      this.applyClass(false);
    }
  }

  toggle() {
    this.setDarkMode(!this.darkMode());
  }

  private setDarkMode(value: boolean) {
    this.darkMode.set(value);
    this.applyClass(value);
    this.storage?.setItem(DARK_MODE_KEY, value.toString());
  }

  private applyClass(isDark: boolean) {
    if (isDark) {
      this.document.documentElement.classList.add('dark');
    } else {
      this.document.documentElement.classList.remove('dark');
    }
  }
}
