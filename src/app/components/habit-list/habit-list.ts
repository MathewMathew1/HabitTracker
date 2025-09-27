import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit } from '@/habits/types';
import { HabitItemComponent } from '../habit-item/habit-item';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule, HabitItemComponent],
  templateUrl: './habit-list.html',
})
export class HabitListComponent {
  @Input() habits: Habit[] = [];
  @Output() habitSelected = new EventEmitter<Habit>();

  onHabitSelected(habit: Habit) {
    this.habitSelected.emit(habit);  
  }
}
