import { Component, OnInit } from '@angular/core';
import { HabitListComponent } from '@/components/habit-list/habit-list';
import { FilterSectionComponent } from '@/components/search-filter/search-filter';
import { Habit, HabitSearch, UserHabit } from '@/habits/types';
import { UserHabitsComponent } from '@/components/user-habits/user-habits';
import { UserHabitsService } from '@/services/habits/userHabits';
import { HabitService } from '@/services/habits/habitService';

@Component({
  selector: 'app-habit-tracker-planner',
  imports: [HabitListComponent, FilterSectionComponent, UserHabitsComponent],
  templateUrl: './habit-tracker-planner.html',
  styleUrl: './habit-tracker-planner.css',
})
export class HabitTrackerPlanner implements OnInit {
  habits: Habit[] = [];
  filteredHabits: Habit[] = [];
  userHabits: UserHabit[] = [];
  searchCriteria: HabitSearch = { searchedName: '', includePositive: true, includeNegative: true };

  constructor(
    private routineService: UserHabitsService,
    private habitService: HabitService
  ) {

    this.habits = this.habitService.getAllHabits();
    
    this.filteredHabits = [...this.habits];
    this.userHabits = this.routineService.getUserHabits();

    this.habitService.customHabit$.subscribe(habit => {
      if (habit) {

        this.habits.push(habit);

        if(this.checkIfHabitFitsFilter(habit)){
   
          this.filteredHabits.push(habit)
        }
      }
    });
  }

  ngOnInit() {
    this.applyFilter();
  }

  onSearchChange(search: HabitSearch) {
    this.searchCriteria = search;
    this.applyFilter();
  }

  addHabit(habit: Habit) {

    if (habit.isCustomHabit && !this.habitService.getHabitById(habit.id)) {
      this.habitService.saveCustomHabit(habit);
    }

    this.userHabits.push({ habit, severity: 1 });
    this.filteredHabits = this.filteredHabits.filter((h) => h.id !== habit.id);
  }

  deleteUserHabit(userHabit: UserHabit) {
    this.userHabits = this.userHabits.filter((uH) => uH.habit.id !== userHabit.habit.id);
    this.filteredHabits.push(userHabit.habit);
  }

  saveRoutine(isRoutineActive: boolean) {
    this.routineService.saveRoutine(this.userHabits, isRoutineActive);
  }

  checkIfHabitFitsFilter(habit: Habit){
    const matchesName = habit.name.toLowerCase().includes(this.searchCriteria.searchedName.toLowerCase());
      const matchesType =
        (habit.isPositive && this.searchCriteria.includePositive) ||
        (!habit.isPositive && this.searchCriteria.includeNegative);
      const isNotAlreadyInRoutine =
        this.userHabits.findIndex((uH) => uH.habit.id === habit.id) === -1;
      return matchesName && matchesType && isNotAlreadyInRoutine;
  }

  applyFilter() {
    this.filteredHabits = this.habits.filter((habit) => {return this.checkIfHabitFitsFilter(habit)});
  }
}
