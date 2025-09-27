import { Routes } from '@angular/router';
import { HabitTrackerPlanner } from '@/components/habit-tracker-planner/habit-tracker-planner';
import { Home } from './components/home/home';
import { ReportSectionComponent } from './components/report-section/report-section';
import { DailyPerformanceGraphComponent } from './components/daily-performance-graph/daily-performance-graph';

export const routes: Routes = [
  {
    path: 'tracker',
    component: HabitTrackerPlanner,
  },
  {
    path: '',
    component: Home,
  },
  {
    path: 'reports',
    component: ReportSectionComponent
  },
  {
    path: "daily-performance",
    component: DailyPerformanceGraphComponent
  }
];
