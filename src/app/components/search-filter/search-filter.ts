import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit, HabitSearch } from '@/habits/types';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomHabitModalComponent } from '@/components/custom-habit/custom-habit';
import { HabitService } from '@/services/habits/habitService';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomHabitModalComponent],
  templateUrl: './search-filter.html',
})
export class FilterSectionComponent {
  search: HabitSearch = {
    searchedName: '',
    includePositive: true,
    includeNegative: true,
  };
    showModal = false;

  @Output() searchChange = new EventEmitter<HabitSearch>();

  constructor(private router: Router, private route: ActivatedRoute, private habitService: HabitService) {
    this.router.currentNavigation;
  }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParamMap;

    this.search.searchedName = queryParams.get('q') || '';
    this.search.includePositive = queryParams.get('positive') !== '0';
    this.search.includeNegative = queryParams.get('negative') !== '0';
    this.update();
  }

  addCustomHabit(habit: Habit) {
    this.habitService.saveCustomHabit(habit);
    this.showModal = false;
  }

  update() {
    this.searchChange.emit({ ...this.search });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.search.searchedName || null,
        positive: this.search.includePositive ? '1' : '0',
        negative: this.search.includeNegative ? '1' : '0',
      },
      queryParamsHandling: 'merge',
    });
  }
}
