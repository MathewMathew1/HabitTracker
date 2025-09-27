import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '@/services/theme/theme';
import { ReportsService } from '@/services/report/reportService';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  mobileMenuOpen = false;

  reportCount$: Observable<number>; 

  darkMode = computed(() => this.theme.darkMode());

  constructor(public theme: ThemeService, public reportService: ReportsService) {
    this.reportCount$ = this.reportService.reports$.pipe(
      map(reports => reports.length)
    );
  }
}
